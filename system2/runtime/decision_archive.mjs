import { deepFreeze } from "./factor_snapshot.mjs";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

export function canonicalStringify(value) {
  return JSON.stringify(canonicalize(value));
}

export async function sha256Hex(value) {
  const text = typeof value === "string" ? value : canonicalStringify(value);
  const bytes = new TextEncoder().encode(text);

  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(bytes).digest("hex");
}


export const DECISION_EVIDENCE_FIREWALL_VERSION_V0_1 = "0.1-RESEARCH";

function factorRefV0_1(observation) {
  return requiredText(observation?.factorId, "factorObservation.factorId")
    + "@"
    + requiredText(observation?.factorVersion, "factorObservation.factorVersion");
}

function uniqueTextArrayV0_1(values, field, blockers) {
  const rows = [...(values || [])].map((value, index) =>
    requiredText(String(value), field + "[" + index + "]")
  );
  const seen = new Set();
  for (const value of rows) {
    if (seen.has(value)) blockers.push("DUPLICATE_" + field.toUpperCase().replaceAll(".", "_") + ":" + value);
    seen.add(value);
  }
  return rows;
}

function familyAssessmentObjectV0_1(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function stateNeedsDecisionEvidenceV0_1(state) {
  return String(state || "") !== "INCOMPLETE";
}

export async function buildDecisionEvidenceFirewallV0_1({
  evaluation,
  factorObservations = [],
  strategyContract = null,
  familyAssessments = null,
} = {}) {
  const e = evaluation || {};
  const marketDate = requiredText(e.marketDate, "evaluation.marketDate");
  const decisionTimestamp = requiredText(e.decisionTimestamp, "evaluation.decisionTimestamp");
  const symbol = requiredText(e.symbol, "evaluation.symbol");
  if (!Number.isFinite(Date.parse(decisionTimestamp))) {
    throw new Error("evaluation.decisionTimestamp must be an ISO timestamp");
  }
  if (!Array.isArray(factorObservations)) throw new Error("factorObservations must be an array");

  const blockers = [];
  const declaredFactorRefs = uniqueTextArrayV0_1(e.factorRefs || [], "evaluation.factorRefs", blockers);
  const declaredSet = new Set(declaredFactorRefs);
  if (stateNeedsDecisionEvidenceV0_1(e.state) && declaredFactorRefs.length === 0) {
    blockers.push("DECISION_SUPPORTING_FACTOR_REFS_EMPTY");
  }
  const observedSet = new Set();
  const factorLineage = [];

  for (let index = 0; index < factorObservations.length; index += 1) {
    const observation = factorObservations[index];
    if (!observation || typeof observation !== "object") {
      blockers.push("FACTOR_OBSERVATION_INVALID:" + index);
      continue;
    }
    const ref = factorRefV0_1(observation);
    if (observedSet.has(ref)) blockers.push("DUPLICATE_FACTOR_OBSERVATION:" + ref);
    observedSet.add(ref);

    if (observation.marketDate !== marketDate) {
      blockers.push("FACTOR_MARKET_DATE_MISMATCH:" + ref);
    }
    if (observation.decisionTimestamp !== decisionTimestamp) {
      blockers.push("FACTOR_DECISION_CLOCK_MISMATCH:" + ref);
    }
    if (observation.scope === "SYMBOL" && observation.scopeKey !== symbol) {
      blockers.push("FACTOR_SYMBOL_SCOPE_MISMATCH:" + ref);
    }
    if (!declaredSet.has(ref)) {
      blockers.push("FACTOR_VERSION_NOT_AUTHORIZED_BY_DECISION_REF:" + ref);
    }

    const state = String(observation.state || "");
    const provenance = observation.provenance || {};
    const availableAt = typeof provenance.availableAt === "string" ? provenance.availableAt : null;
    const payloadHash = typeof provenance.payloadHash === "string"
      ? provenance.payloadHash.trim()
      : "";

    if (state === "KNOWN") {
      if (provenance.pointInTimeEligible !== true) {
        blockers.push("FACTOR_PIT_INELIGIBLE:" + ref);
      }
      if (!availableAt || !Number.isFinite(Date.parse(availableAt))) {
        blockers.push("FACTOR_AVAILABLE_AT_MISSING_OR_INVALID:" + ref);
      } else if (Date.parse(availableAt) > Date.parse(decisionTimestamp)) {
        blockers.push("FACTOR_AVAILABLE_AFTER_DECISION:" + ref);
      }
      if (typeof provenance.sourceId !== "string" || !provenance.sourceId.trim()) {
        blockers.push("FACTOR_SOURCE_ID_MISSING:" + ref);
      }
      if (!payloadHash) {
        blockers.push("FACTOR_SOURCE_HASH_MISSING:" + ref);
      }
    }

    const observationHash = await sha256Hex(observation);
    factorLineage.push({
      ref,
      factorId: observation.factorId,
      factorVersion: observation.factorVersion,
      state,
      sourceId: provenance.sourceId || null,
      sourcePayloadHash: payloadHash || null,
      availableAt,
      pointInTimeEligible: provenance.pointInTimeEligible === true,
      observationHash,
    });
  }

  for (const ref of declaredFactorRefs) {
    if (!observedSet.has(ref)) blockers.push("DECLARED_FACTOR_REF_MISSING_OBSERVATION:" + ref);
  }

  const contract = strategyContract && typeof strategyContract === "object"
    ? strategyContract
    : null;
  const assessments = familyAssessmentObjectV0_1(familyAssessments);
  const familyLineage = [];

  if (!contract || !assessments) {
    blockers.push("FAMILY_ASSESSMENT_LINEAGE_NOT_BOUND");
  } else {
    if (contract.strategyId !== e.strategyId) blockers.push("EVIDENCE_CONTRACT_STRATEGY_ID_MISMATCH");
    if (contract.strategyVersion !== e.strategyVersion) blockers.push("EVIDENCE_CONTRACT_STRATEGY_VERSION_MISMATCH");

    const families = Array.isArray(contract.evidenceFamilies) ? contract.evidenceFamilies : [];
    const authorizedFactorIds = new Set();
    for (const familySpec of families) {
      const family = requiredText(familySpec?.family, "strategyContract.evidenceFamilies[].family");
      const factorIds = [...(familySpec?.factorIds || [])].map(String);
      factorIds.forEach((id) => authorizedFactorIds.add(id));
      const assessment = assessments[family] || null;
      const mapped = factorLineage
        .filter((row) => factorIds.includes(row.factorId))
        .sort((a, b) => a.ref.localeCompare(b.ref));

      if (!assessment) {
        blockers.push("FAMILY_ASSESSMENT_MISSING:" + family);
      } else {
        if (familySpec?.unknownBlocksEligibility === true && assessment.observationState !== "KNOWN") {
          blockers.push("REQUIRED_FAMILY_NOT_KNOWN:" + family);
        }
        if (assessment.observationState === "KNOWN" && mapped.length === 0) {
          blockers.push("KNOWN_FAMILY_WITHOUT_FACTOR_LINEAGE:" + family);
        }
      }

      const assessmentHash = assessment ? await sha256Hex(assessment) : null;
      const familyBase = {
        family,
        assessmentObservationState: assessment?.observationState || "MISSING",
        assessmentThesisState: assessment?.thesisState || "INDETERMINATE",
        assessmentHash,
        factorRefs: mapped.map((row) => row.ref),
        factorObservationHashes: mapped.map((row) => row.observationHash),
      };
      familyLineage.push({
        ...familyBase,
        familyAssessmentHash: await sha256Hex(familyBase),
      });
    }

    for (const row of factorLineage) {
      if (!authorizedFactorIds.has(row.factorId)) {
        blockers.push("FACTOR_ID_NOT_AUTHORIZED_BY_STRATEGY_CONTRACT:" + row.ref);
      }
    }
  }

  const uniqueBlockers = [...new Set(blockers)].sort();
  const base = {
    schemaVersion: "S2_DECISION_EVIDENCE_FIREWALL_V0_1",
    version: DECISION_EVIDENCE_FIREWALL_VERSION_V0_1,
    marketDate,
    decisionTimestamp,
    symbol,
    strategyId: e.strategyId || null,
    strategyVersion: e.strategyVersion || null,
    declaredFactorRefs: Object.freeze([...declaredFactorRefs].sort()),
    factorLineage: Object.freeze(factorLineage.sort((a, b) => a.ref.localeCompare(b.ref))),
    familyLineage: Object.freeze(familyLineage.sort((a, b) => a.family.localeCompare(b.family))),
    blockerCodes: Object.freeze(uniqueBlockers),
    state: uniqueBlockers.length ? "INCOMPLETE" : "READY",
    outcomeJoinEligible: uniqueBlockers.length === 0,
  };
  const evidenceHash = await sha256Hex(base);
  return deepFreeze({ ...base, evidenceHash });
}

export async function buildFrozenDecisionSnapshot(input) {
  if (!input || typeof input !== "object") throw new Error("decision snapshot input is required");

  const evaluation = input.evaluation || {};
  const marketDate = requiredText(evaluation.marketDate, "evaluation.marketDate");
  const symbol = requiredText(evaluation.symbol, "evaluation.symbol");
  const strategyId = requiredText(evaluation.strategyId, "evaluation.strategyId");
  const strategyVersion = requiredText(evaluation.strategyVersion, "evaluation.strategyVersion");
  const state = requiredText(evaluation.state, "evaluation.state");

  const allowedStates = new Set([
    "SELECTED",
    "QUALIFIED_NOT_SELECTED",
    "REJECTED",
    "INCOMPLETE",
    "WATCH",
  ]);
  if (!allowedStates.has(state)) throw new Error(`unsupported decision state: ${state}`);

  const suppliedMissingRequiredFactors = [...(evaluation.missingRequiredFactors || [])].map(String);
  if (state === "SELECTED" && suppliedMissingRequiredFactors.length) {
    throw new Error("SELECTED decision cannot have missing required factors");
  }

  const factorObservations = [...(input.factorObservations || [])];
  const decisionEvidence = await buildDecisionEvidenceFirewallV0_1({
    evaluation,
    factorObservations,
    strategyContract: input.strategyContract || null,
    familyAssessments: input.familyAssessments || null,
  });
  const evidenceBlockers = decisionEvidence.blockerCodes.map(
    (code) => "DECISION_EVIDENCE:" + code,
  );
  const missingRequiredFactors = [...new Set([
    ...suppliedMissingRequiredFactors,
    ...evidenceBlockers,
  ])];
  const effectiveState = decisionEvidence.state === "READY" ? state : "INCOMPLETE";

  const regime = input.regime || {};
  if (regime.marketDate !== marketDate) {
    throw new Error("regime marketDate does not match decision marketDate");
  }

  const frozenAt = requiredText(input.frozenAt, "frozenAt");
  if (!Number.isFinite(Date.parse(frozenAt))) throw new Error("frozenAt must be a timestamp");

  const evaluationWithoutHash = {
    ...evaluation,
    decisionId: requiredText(evaluation.decisionId, "evaluation.decisionId"),
    decisionTimestamp: requiredText(evaluation.decisionTimestamp, "evaluation.decisionTimestamp"),
    strategyId,
    strategyVersion,
    symbol,
    marketDate,
    state: effectiveState,
    rank: effectiveState === "INCOMPLETE" ? null : Number.isFinite(evaluation.rank) ? evaluation.rank : null,
    totalScore: effectiveState === "INCOMPLETE" ? null : Number.isFinite(evaluation.totalScore) ? evaluation.totalScore : null,
    factorRefs: [...(evaluation.factorRefs || [])].map(String),
    interactionRefs: [...(evaluation.interactionRefs || [])].map(String),
    regimeSnapshotId: requiredText(evaluation.regimeSnapshotId, "evaluation.regimeSnapshotId"),
    reasons: [...(evaluation.reasons || [])].map(String),
    warnings: [
      ...(evaluation.warnings || []),
      ...evidenceBlockers,
    ].map(String),
    missingRequiredFactors,
    invalidationConditions: [...(evaluation.invalidationConditions || [])].map(String),
  };
  delete evaluationWithoutHash.decisionHash;

  const baseRecord = {
    evaluation: evaluationWithoutHash,
    entryPlan: input.entryPlan || {},
    factorObservations,
    interactionObservations: [...(input.interactionObservations || [])],
    regime,
    decisionEvidence,
    frozenAt,
    schemaVersion: "S2_DECISION_V0_1",
  };

  const decisionHash = await sha256Hex(baseRecord);

  return deepFreeze({
    ...baseRecord,
    evaluation: {
      ...evaluationWithoutHash,
      decisionHash,
    },
  });
}
