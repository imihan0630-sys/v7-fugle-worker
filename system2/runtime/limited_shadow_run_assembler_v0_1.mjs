import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { buildStrategySourceReadinessReceipt } from "./strategy_source_readiness.mjs";
import { buildLimitedShadowDecisionSnapshot } from "./limited_shadow_v0_1.mjs";
import { buildShadowRunReceipt } from "./shadow_run_receipt.mjs";
import { buildShadowRunFingerprint } from "./shadow_run_fingerprint.mjs";
import { buildPredictionSnapshotBundleV0_1 } from "./prediction_snapshot_v0_1.mjs";
import {
  toShadowDecisionRow,
  toShadowRunRow,
  toSourceSessionRow,
  toShadowRunFingerprintRow,
} from "./storage_rows.mjs";
import { buildSystem2PersistenceBatch } from "./persistence_batch.mjs";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function json(value) {
  return JSON.stringify(value ?? null);
}

function factorRef(obs) {
  return `${requiredText(obs?.factorId, "factorId")}@${requiredText(obs?.factorVersion, "factorVersion")}`;
}

function assertSameClock(value, expected, field) {
  if (requiredText(value, field) !== expected) {
    throw new Error(`${field} does not match run clock`);
  }
}

function validateRegime(regime, marketDate, decisionTimestamp) {
  if (!regime || typeof regime !== "object") throw new Error("regime is required");
  assertSameClock(regime.marketDate, marketDate, "regime.marketDate");
  assertSameClock(regime.decisionTimestamp, decisionTimestamp, "regime.decisionTimestamp");
  return regime;
}

async function buildRegimeStorageRow({
  regime,
  regimeVersion,
  regimeFactorObservations = [],
  regimeSourceReceipts = [],
}) {
  if (!Array.isArray(regimeFactorObservations)) {
    throw new Error("regimeFactorObservations must be an array");
  }
  if (!Array.isArray(regimeSourceReceipts)) {
    throw new Error("regimeSourceReceipts must be an array");
  }

  const unknowns = Object.entries({
    taiwanIndexState: regime.taiwanIndexState,
    breadthState: regime.breadthState,
    liquidityState: regime.liquidityState,
    volatilityState: regime.volatilityState,
    leadershipState: regime.leadershipState,
    sectorRotationState: regime.sectorRotationState,
    globalMacroState: regime.globalMacroState,
  })
    .filter(([, state]) => state !== "KNOWN")
    .map(([field, state]) => ({ field, state }));

  const base = {
    regime_snapshot_id: requiredText(regime.regimeSnapshotId, "regime.regimeSnapshotId"),
    market_date: requiredText(regime.marketDate, "regime.marketDate"),
    decision_timestamp: requiredText(regime.decisionTimestamp, "regime.decisionTimestamp"),
    regime_version: requiredText(regimeVersion, "regimeVersion"),
    labels_json: json(regime.labels || []),
    states_json: json({
      taiwanIndexState: regime.taiwanIndexState,
      breadthState: regime.breadthState,
      liquidityState: regime.liquidityState,
      volatilityState: regime.volatilityState,
      leadershipState: regime.leadershipState,
      sectorRotationState: regime.sectorRotationState,
      globalMacroState: regime.globalMacroState,
      warnings: regime.warnings || [],
      factorRefs: regime.factorRefs || [],
    }),
    factor_observations_json: json(regimeFactorObservations),
    source_receipts_json: json(regimeSourceReceipts),
    unknowns_json: json(unknowns),
  };
  const snapshot_hash = await sha256Hex(base);
  return Object.freeze({ ...base, snapshot_hash });
}

async function buildFactorSnapshot({
  item,
  marketDate,
  decisionTimestamp,
  regimeSnapshotId,
  factorBundleVersion,
  capturedAt,
}) {
  const symbol = requiredText(item.symbol, "candidate.symbol");
  if (!Array.isArray(item.factorObservations)) {
    throw new Error(`candidate.factorObservations must be an array: ${symbol}`);
  }
  if (!Array.isArray(item.interactionObservations || [])) {
    throw new Error(`candidate.interactionObservations must be an array: ${symbol}`);
  }

  for (let i = 0; i < item.factorObservations.length; i += 1) {
    const obs = item.factorObservations[i];
    assertSameClock(obs.marketDate, marketDate, `factorObservations[${i}].marketDate`);
    assertSameClock(
      obs.decisionTimestamp,
      decisionTimestamp,
      `factorObservations[${i}].decisionTimestamp`,
    );
    if (obs.scope === "SYMBOL" && obs.scopeKey !== symbol) {
      throw new Error(`symbol factor scope mismatch: ${symbol}`);
    }
  }

  const completenessState = requiredText(
    item.completenessState || (
      item.factorObservations.some((x) => x.state !== "KNOWN")
        ? "INCOMPLETE"
        : "COMPLETE"
    ),
    "candidate.completenessState",
  );
  const unknowns = item.unknowns || item.factorObservations
    .filter((x) => x.state !== "KNOWN")
    .map((x) => ({
      factorId: x.factorId,
      factorVersion: x.factorVersion,
      state: x.state,
      reason: x.unknownReason || null,
    }));

  const snapshotId = requiredText(item.factorSnapshotId, "candidate.factorSnapshotId");
  const sourceManifest = item.sourceManifest || [];
  const base = {
    snapshot_id: snapshotId,
    market_date: marketDate,
    decision_timestamp: decisionTimestamp,
    symbol,
    company_name: item.companyName || null,
    factor_bundle_version: requiredText(factorBundleVersion, "factorBundleVersion"),
    regime_snapshot_id: regimeSnapshotId,
    industry_snapshot_id: item.industrySnapshotId || null,
    core_metrics_json: json(item.coreMetrics || {}),
    factor_observations_json: json(item.factorObservations),
    interaction_observations_json: json(item.interactionObservations || []),
    source_manifest_json: json(sourceManifest),
    completeness_state: completenessState,
    unknowns_json: json(unknowns),
    captured_at: capturedAt,
  };
  const snapshot_hash = await sha256Hex(base);

  return {
    row: Object.freeze({ ...base, snapshot_hash }),
    factorRefs: Object.freeze(item.factorObservations.map(factorRef)),
    interactionRefs: Object.freeze(
      (item.interactionObservations || []).map((x) =>
        `${requiredText(x.interactionId, "interactionId")}@${requiredText(x.interactionVersion, "interactionVersion")}`
      ),
    ),
  };
}

function assertUniqueCandidateSymbols(candidates) {
  const seen = new Set();
  for (let i = 0; i < candidates.length; i += 1) {
    const symbol = requiredText(candidates[i]?.symbol, `candidates[${i}].symbol`);
    if (seen.has(symbol)) throw new Error(`duplicate candidate symbol: ${symbol}`);
    seen.add(symbol);
  }
}

export async function buildLimitedShadowRunBundleV0_1({
  runId,
  fingerprintId,
  predictionSnapshotId,
  persistenceBatchId,
  marketDate,
  decisionTimestamp,
  capturedAt,
  universeVersion,
  baseUniverseSymbols = [],
  excludedSymbols = [],
  contract,
  shadowSpec,
  sourceSessionReceipt,
  regime,
  regimeVersion = "S2_MARKET_REGIME_V0",
  regimeFactorObservations = [],
  regimeSourceReceipts = [],
  factorBundleVersion,
  candidates = [],
  importantRejectedDecisionIds = [],
  runWarnings = [],
} = {}) {
  const date = requiredText(marketDate, "marketDate");
  const clock = requiredText(decisionTimestamp, "decisionTimestamp");
  const captured = requiredText(capturedAt, "capturedAt");
  if (!Number.isFinite(Date.parse(clock)) || !Number.isFinite(Date.parse(captured))) {
    throw new Error("decisionTimestamp/capturedAt must be ISO timestamps");
  }
  if (Date.parse(captured) < Date.parse(clock)) {
    throw new Error("capturedAt cannot be earlier than decisionTimestamp");
  }
  if (!contract || typeof contract !== "object") throw new Error("contract is required");
  if (!shadowSpec || typeof shadowSpec !== "object") throw new Error("shadowSpec is required");
  if (!sourceSessionReceipt || typeof sourceSessionReceipt !== "object") {
    throw new Error("sourceSessionReceipt is required");
  }
  assertSameClock(sourceSessionReceipt.marketDate, date, "sourceSessionReceipt.marketDate");
  assertSameClock(
    sourceSessionReceipt.decisionTimestamp,
    clock,
    "sourceSessionReceipt.decisionTimestamp",
  );
  if (shadowSpec.selectionLayerEnabled === true) {
    throw new Error("V0.1 assembler is limited-shadow only and cannot enable final selection");
  }
  if (contract.strategyId !== shadowSpec.strategyId) {
    throw new Error("contract/shadowSpec strategy mismatch");
  }
  if (contract.strategyVersion !== shadowSpec.strategyVersion) {
    throw new Error("contract/shadowSpec version mismatch");
  }
  if (!Array.isArray(candidates)) throw new Error("candidates must be an array");
  assertUniqueCandidateSymbols(candidates);

  const validatedRegime = validateRegime(regime, date, clock);
  const staticSourceReadiness = buildStrategySourceReadinessReceipt(contract);
  if (staticSourceReadiness.sourceReadiness === "SOURCE_BLOCKED") {
    throw new Error("SOURCE_BLOCKED strategy cannot be assembled");
  }

  const baseSet = new Set(baseUniverseSymbols.map(String));
  const excludedSet = new Set(excludedSymbols.map(String));
  const eligibleUniverseSymbols = [...baseSet].filter((x) => !excludedSet.has(x)).sort();
  for (const symbol of excludedSet) {
    if (!baseSet.has(symbol)) throw new Error(`excluded symbol not in base universe: ${symbol}`);
  }

  const candidateBySymbol = new Map(candidates.map((x) => [String(x.symbol), x]));
  for (const symbol of candidateBySymbol.keys()) {
    if (!baseSet.has(symbol)) throw new Error(`candidate symbol not in base universe: ${symbol}`);
    if (excludedSet.has(symbol)) throw new Error(`excluded symbol cannot be candidate: ${symbol}`);
  }

  const factorRows = [];
  const decisionSnapshots = [];
  const symbolAccounts = [];

  for (const item of candidates) {
    const symbol = requiredText(item.symbol, "candidate.symbol");
    const factorSnapshot = await buildFactorSnapshot({
      item,
      marketDate: date,
      decisionTimestamp: clock,
      regimeSnapshotId: validatedRegime.regimeSnapshotId,
      factorBundleVersion,
      capturedAt: captured,
    });
    factorRows.push(factorSnapshot.row);

    if (!item.assessment || typeof item.assessment !== "object") {
      throw new Error(`candidate assessment is required: ${symbol}`);
    }
    if (item.assessment.strategyId !== contract.strategyId) {
      throw new Error(`candidate assessment strategy mismatch: ${symbol}`);
    }
    if (item.assessment.strategyVersion !== contract.strategyVersion) {
      throw new Error(`candidate assessment version mismatch: ${symbol}`);
    }

    const decisionId = requiredText(item.decisionId, "candidate.decisionId");
    const snapshot = await buildLimitedShadowDecisionSnapshot({
      contract,
      sourceReadinessReceipt: staticSourceReadiness,
      assessment: item.assessment,
      shadowSpec,
      decision: {
        decisionId,
        marketDate: date,
        decisionTimestamp: clock,
        symbol,
        companyName: item.companyName || null,
        factorRefs: factorSnapshot.factorRefs,
        interactionRefs: factorSnapshot.interactionRefs,
        regimeSnapshotId: validatedRegime.regimeSnapshotId,
        reasons: item.reasons || [],
        warnings: item.warnings || [],
      },
      entryPlan: item.entryPlan || null,
      factorObservations: item.factorObservations,
      interactionObservations: item.interactionObservations || [],
      regime: validatedRegime,
      frozenAt: captured,
    });
    decisionSnapshots.push(snapshot);
    symbolAccounts.push({
      symbol,
      state: snapshot.evaluation.state,
      decisionId,
      reasons: snapshot.evaluation.reasons || [],
    });
  }

  const runReceipt = buildShadowRunReceipt({
    runId: requiredText(runId, "runId"),
    marketDate: date,
    decisionTimestamp: clock,
    strategyId: contract.strategyId,
    strategyVersion: contract.strategyVersion,
    shadowSpecId: shadowSpec.shadowSpecId,
    universeVersion: requiredText(universeVersion, "universeVersion"),
    baseUniverseSymbols: [...baseSet].sort(),
    excludedSymbols: [...excludedSet].sort(),
    eligibleUniverseSymbols,
    symbolAccounts,
    warnings: runWarnings,
    capturedAt: captured,
  });

  const fingerprint = await buildShadowRunFingerprint({
    fingerprintId: requiredText(fingerprintId, "fingerprintId"),
    marketDate: date,
    decisionTimestamp: clock,
    strategyId: contract.strategyId,
    strategyVersion: contract.strategyVersion,
    shadowSpecId: shadowSpec.shadowSpecId,
    universeVersion,
    sourceSessionReceipt,
    shadowRunReceipt: runReceipt,
    decisionHashes: decisionSnapshots.map((x) => x.evaluation.decisionHash),
    capturedAt: captured,
  });

  const predictionSnapshot = await buildPredictionSnapshotBundleV0_1({
    predictionSnapshotId: requiredText(predictionSnapshotId, "predictionSnapshotId"),
    marketDate: date,
    decisionTimestamp: clock,
    decisionSnapshots,
    importantRejectedDecisionIds,
    sourceSessionReceipt,
    shadowRunReceipts: [runReceipt],
    runFingerprints: [fingerprint],
    capturedAt: captured,
  });

  const regimeRow = await buildRegimeStorageRow({
    regime: validatedRegime,
    regimeVersion,
    regimeFactorObservations,
    regimeSourceReceipts,
  });

  const records = [
    { table: "s2_source_session_receipts", row: toSourceSessionRow(sourceSessionReceipt) },
    { table: "s2_market_regime_snapshots", row: regimeRow },
    ...factorRows.map((row) => ({ table: "s2_symbol_factor_snapshots", row })),
    ...decisionSnapshots.map((snapshot, index) => ({
      table: "s2_decisions",
      row: toShadowDecisionRow(snapshot, {
        factorSnapshotId: factorRows[index].snapshot_id,
      }),
    })),
    { table: "s2_shadow_runs", row: toShadowRunRow(runReceipt) },
    { table: "s2_shadow_run_fingerprints", row: toShadowRunFingerprintRow(fingerprint) },
  ];

  const persistenceBatch = await buildSystem2PersistenceBatch({
    batchId: requiredText(persistenceBatchId, "persistenceBatchId"),
    marketDate: date,
    decisionTimestamp: clock,
    records,
    createdAt: captured,
  });

  return deepFreeze({
    marketDate: date,
    decisionTimestamp: clock,
    strategyId: contract.strategyId,
    strategyVersion: contract.strategyVersion,
    shadowSpecId: shadowSpec.shadowSpecId,
    sourceSessionReceipt,
    regime: validatedRegime,
    factorRows: Object.freeze(factorRows),
    decisionSnapshots: Object.freeze(decisionSnapshots),
    runReceipt,
    fingerprint,
    predictionSnapshot,
    persistenceBatch,
    finalSelectionEnabled: false,
    selectedGenerationAuthorized: false,
    schemaVersion: "S2_LIMITED_SHADOW_RUN_BUNDLE_V0_1",
  });
}
