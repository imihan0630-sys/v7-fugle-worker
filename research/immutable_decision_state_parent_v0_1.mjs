// Research-only immutable decision-state parent prototype.
// Zero market calls. Zero D1 writes. Formal Core untouched.

function assertFiniteOrNull(value, field) {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error("INVALID_" + field);
  return n;
}

function assertText(value, field) {
  const text = String(value ?? "").trim();
  if (!text) throw new Error("MISSING_" + field);
  return text;
}

function canonicalValue(value) {
  if (value === null) return null;
  if (value === undefined) throw new Error("UNDEFINED_NOT_ALLOWED");
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("NON_FINITE_NUMBER");
    return value;
  }
  if (typeof value === "string" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      if (value[key] === undefined) throw new Error("UNDEFINED_NOT_ALLOWED:" + key);
      out[key] = canonicalValue(value[key]);
    }
    return out;
  }
  throw new Error("UNSUPPORTED_CANONICAL_TYPE");
}

export function canonicalJson(value) {
  return JSON.stringify(canonicalValue(value));
}

export function classifyActualFormalState(actualDecision) {
  const d = actualDecision || {};
  if (d.decisionError === true) return "DECISION_ERROR";
  if (d.formalOk === true) return d.selectedFlag === true ? "SELECTED" : "QUALIFIED_NOT_SELECTED";
  if (d.basePassed === false) return "FIRST_FAILURE_BASE_FALSE";
  if (d.basePassed === true) return "FIRST_FAILURE_BASE_TRUE";
  return "UNKNOWN";
}

function normalizedRanking(actualDecision) {
  const d = actualDecision || {};
  if (d.formalOk !== true) return null;
  const r = d.ranking || {};
  const required = [
    "postConsensusPriorityScore",
    "rewardPerRisk",
    "marketConsensusScore",
    "setupQuality",
    "sectorFlow",
    "relativeStrength",
  ];
  const out = {};
  for (const field of required) out[field] = assertFiniteOrNull(r[field], field);
  if (required.some(field => out[field] === null)) throw new Error("QUALIFIED_RANKING_TUPLE_INCOMPLETE");
  out.rewardRisk = assertFiniteOrNull(r.rewardRisk, "rewardRisk");
  out.marketConsensusSources = assertFiniteOrNull(r.marketConsensusSources, "marketConsensusSources");
  out.marketConsensusBonus = assertFiniteOrNull(r.marketConsensusBonus, "marketConsensusBonus");
  out.preSortOrdinal = Number(r.preSortOrdinal);
  out.observedPoolRank = Number(r.observedPoolRank);
  out.poolQuota = Number(r.poolQuota);
  out.cutlineRelation = assertText(r.cutlineRelation, "cutlineRelation");
  if (!Number.isInteger(out.preSortOrdinal) || out.preSortOrdinal < 0) throw new Error("INVALID_preSortOrdinal");
  if (!Number.isInteger(out.observedPoolRank) || out.observedPoolRank < 1) throw new Error("INVALID_observedPoolRank");
  if (!Number.isInteger(out.poolQuota) || out.poolQuota < 1) throw new Error("INVALID_poolQuota");
  return out;
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

export function buildImmutableDecisionStateParent(input, hashFn) {
  if (typeof hashFn !== "function") throw new Error("HASH_FUNCTION_REQUIRED");

  const identity = {
    parentSchemaVersion: assertText(input?.parentSchemaVersion, "parentSchemaVersion"),
    scanDate: assertText(input?.scanDate, "scanDate"),
    symbol: assertText(input?.symbol, "symbol"),
    captureGeneration: assertText(input?.captureGeneration, "captureGeneration"),
    decisionCutoffAt: assertText(input?.decisionCutoffAt, "decisionCutoffAt"),
    formalWorkerVersion: assertText(input?.formalWorkerVersion, "formalWorkerVersion"),
    selectionRuleVersion: assertText(input?.selectionRuleVersion, "selectionRuleVersion"),
    rankComparatorVersion: assertText(input?.rankComparatorVersion, "rankComparatorVersion"),
  };

  const actualDecision = input?.actualDecision || {};
  const formalState = classifyActualFormalState(actualDecision);
  const ranking = normalizedRanking(actualDecision);

  if (actualDecision.selectedFlag === true && actualDecision.formalOk !== true) {
    throw new Error("SELECTED_REQUIRES_FORMAL_OK");
  }
  if ((formalState === "FIRST_FAILURE_BASE_FALSE" || formalState === "FIRST_FAILURE_BASE_TRUE") &&
      !String(actualDecision.firstFailureReason || "").trim()) {
    throw new Error("FAILED_STATE_REQUIRES_FIRST_FAILURE_REASON");
  }
  if (formalState === "QUALIFIED_NOT_SELECTED" && actualDecision.selectedFlag === true) {
    throw new Error("QNS_SELECTED_CONFLICT");
  }

  const semanticPayload = {
    canonicalMarket: assertText(input?.canonicalMarket, "canonicalMarket"),
    pool: assertText(input?.pool, "pool"),
    priorityScoreDefinitionVersion: assertText(input?.priorityScoreDefinitionVersion, "priorityScoreDefinitionVersion"),
    historyAdmissionState: assertText(input?.historyAdmissionState, "historyAdmissionState"),
    historyAdmissionReceiptId: assertText(input?.historyAdmissionReceiptId, "historyAdmissionReceiptId"),
    sourceQualityState: assertText(input?.sourceQualityState, "sourceQualityState"),
    sourceSemanticFingerprint: assertText(input?.sourceSemanticFingerprint, "sourceSemanticFingerprint"),
    formalState,
    firstFailureReason: actualDecision.firstFailureReason ? String(actualDecision.firstFailureReason) : null,
    basePassed: actualDecision.basePassed === true ? true : actualDecision.basePassed === false ? false : null,
    rrPassed: actualDecision.rrPassed === true ? true : actualDecision.rrPassed === false ? false : null,
    formalOk: actualDecision.formalOk === true,
    channel: actualDecision.channel ? String(actualDecision.channel) : null,
    signalLevel: actualDecision.signalLevel ? String(actualDecision.signalLevel) : null,
    selectedFlag: actualDecision.selectedFlag === true,
    ranking,
    formalInputHash: assertText(input?.formalInputHash, "formalInputHash"),
    formalResultHash: assertText(input?.formalResultHash, "formalResultHash"),
  };

  const rankingTupleHash = ranking ? hashFn(canonicalJson({
    comparatorVersion: identity.rankComparatorVersion,
    ranking,
  })) : null;

  const semanticFingerprint = hashFn(canonicalJson(semanticPayload));
  const parentDecisionReceiptId = hashFn(canonicalJson(identity));

  return deepFreeze({
    parentDecisionReceiptId,
    parentSchemaVersion: identity.parentSchemaVersion,
    scanDate: identity.scanDate,
    symbol: identity.symbol,
    canonicalMarket: semanticPayload.canonicalMarket,
    pool: semanticPayload.pool,
    captureGeneration: identity.captureGeneration,
    decisionCutoffAt: identity.decisionCutoffAt,
    capturedAt: assertText(input?.capturedAt, "capturedAt"),
    createdAt: assertText(input?.createdAt, "createdAt"),
    formalWorkerVersion: identity.formalWorkerVersion,
    selectionRuleVersion: identity.selectionRuleVersion,
    rankComparatorVersion: identity.rankComparatorVersion,
    priorityScoreDefinitionVersion: semanticPayload.priorityScoreDefinitionVersion,
    historyAdmissionState: semanticPayload.historyAdmissionState,
    historyAdmissionReceiptId: semanticPayload.historyAdmissionReceiptId,
    sourceQualityState: semanticPayload.sourceQualityState,
    sourceSemanticFingerprint: semanticPayload.sourceSemanticFingerprint,
    formalState,
    firstFailureReason: semanticPayload.firstFailureReason,
    basePassed: semanticPayload.basePassed,
    rrPassed: semanticPayload.rrPassed,
    formalOk: semanticPayload.formalOk,
    channel: semanticPayload.channel,
    signalLevel: semanticPayload.signalLevel,
    selectedFlag: semanticPayload.selectedFlag,
    ranking,
    formalInputHash: semanticPayload.formalInputHash,
    formalResultHash: semanticPayload.formalResultHash,
    rankingTupleHash,
    semanticFingerprint,
    decisionImpact: false,
    researchOnly: true,
  });
}

export function compareImmutableParent(existing, incoming) {
  if (!existing || !incoming) return { status: "INVALID_COMPARE" };
  if (existing.parentDecisionReceiptId !== incoming.parentDecisionReceiptId) {
    return { status: "DIFFERENT_IDENTITY" };
  }
  if (existing.semanticFingerprint === incoming.semanticFingerprint) {
    return { status: "SAME_RECORD_EXACT" };
  }
  return { status: "PROVENANCE_CONFLICT" };
}
