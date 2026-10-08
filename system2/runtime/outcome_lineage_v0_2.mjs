import { deepFreeze } from "./factor_snapshot.mjs";
import { canonicalStringify, sha256Hex } from "./decision_archive.mjs";
import { validateMonotonicOutcomeUpdateV0_1 } from "./outcome_tracker_v0_1.mjs";

export const OUTCOME_VERSION_SCHEMA_V0_2 = "S2_OUTCOME_VERSION_V0_2";
const HASH_RE = /^[a-f0-9]{64}$/;

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function requiredHash(value, field) {
  const text = requiredText(value, field);
  if (!HASH_RE.test(text)) throw new Error(`${field} must be a lowercase SHA-256 hex digest`);
  return text;
}

function finiteOrNull(value, field) {
  if (value === null || value === undefined) return null;
  if (!Number.isFinite(Number(value))) throw new Error(`${field} must be finite or null`);
  return Number(value);
}

function integerOrNull(value, field) {
  if (value === null || value === undefined) return null;
  if (!Number.isInteger(Number(value)) || Number(value) < 0) {
    throw new Error(`${field} must be a non-negative integer or null`);
  }
  return Number(value);
}

function parseJsonObject(value, field) {
  let parsed;
  try {
    parsed = typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    throw new Error(`${field} must be valid JSON`);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${field} must encode an object`);
  }
  return parsed;
}

function stripHash(value, field) {
  const out = { ...value };
  delete out[field];
  return out;
}

async function recomputeOutcomeHash(snapshot) {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    throw new Error("snapshot is required");
  }
  const claimed = requiredHash(snapshot.outcomeHash, "snapshot.outcomeHash");
  const recomputed = await sha256Hex(stripHash(snapshot, "outcomeHash"));
  if (claimed !== recomputed) throw new Error("OUTCOME_HASH_MISMATCH");
  return claimed;
}

function normalizeDecisionLineage(lineage) {
  if (!lineage || typeof lineage !== "object" || Array.isArray(lineage)) {
    throw new Error("decisionLineage is required");
  }
  return {
    decisionId: requiredText(lineage.decisionId, "decisionLineage.decisionId"),
    decisionHash: requiredHash(lineage.decisionHash, "decisionLineage.decisionHash"),
    strategyId: requiredText(lineage.strategyId, "decisionLineage.strategyId"),
    strategyVersion: requiredText(lineage.strategyVersion, "decisionLineage.strategyVersion"),
    symbol: requiredText(lineage.symbol, "decisionLineage.symbol"),
    marketDate: requiredText(lineage.marketDate, "decisionLineage.marketDate"),
    decisionTimestamp: requiredText(
      lineage.decisionTimestamp,
      "decisionLineage.decisionTimestamp",
    ),
    regimeSnapshotId: requiredText(
      lineage.regimeSnapshotId,
      "decisionLineage.regimeSnapshotId",
    ),
  };
}

function normalizeRegimeLineage(lineage) {
  if (!lineage || typeof lineage !== "object" || Array.isArray(lineage)) {
    throw new Error("regimeLineage is required");
  }
  return {
    regimeSnapshotId: requiredText(
      lineage.regimeSnapshotId,
      "regimeLineage.regimeSnapshotId",
    ),
    regimeHash: requiredHash(lineage.regimeHash, "regimeLineage.regimeHash"),
  };
}

async function normalizeExecutionLineage(snapshot) {
  const sim = snapshot?.simulatedExecution;
  if (!sim || typeof sim !== "object" || Array.isArray(sim)) {
    throw new Error("snapshot.simulatedExecution with immutable execution lineage is required");
  }
  const costModel = sim.costModel;
  if (!costModel || typeof costModel !== "object" || Array.isArray(costModel)) {
    throw new Error("snapshot.simulatedExecution.costModel is required");
  }
  const costModelHash = await sha256Hex(costModel);
  return {
    executionState: requiredText(sim.state, "snapshot.simulatedExecution.state"),
    executionHash: requiredHash(
      sim.executionHash,
      "snapshot.simulatedExecution.executionHash",
    ),
    executionVersion: requiredText(
      sim.executionVersion,
      "snapshot.simulatedExecution.executionVersion",
    ),
    costModel: deepFreeze({ ...costModel }),
    costModelHash,
    costModelVersion: requiredText(
      sim.costModelVersion || costModel.costModelVersion,
      "snapshot.simulatedExecution.costModelVersion",
    ),
    taxRuleId: requiredText(
      sim.taxRuleId || costModel.taxRuleId,
      "snapshot.simulatedExecution.taxRuleId",
    ),
  };
}

function exactMatch(actual, expected, code) {
  if (actual !== expected) throw new Error(`OUTCOME_LINEAGE_MISMATCH:${code}`);
}

function lineageBaseFromRow(row) {
  return {
    decisionId: row.decision_id,
    decisionHash: row.decision_hash,
    strategyId: row.strategy_id,
    strategyVersion: row.strategy_version,
    symbol: row.symbol,
    marketDate: row.market_date,
    decisionTimestamp: row.decision_timestamp,
    regimeSnapshotId: row.regime_snapshot_id,
    regimeHash: row.regime_hash,
    priceSpace: row.price_space,
    corporateActionState: row.corporate_action_state,
    corporateActionHash: row.corporate_action_hash,
    executionHash: row.execution_hash,
    executionVersion: row.execution_version,
    costModelHash: row.cost_model_hash,
    costModelVersion: row.cost_model_version,
    taxRuleId: row.tax_rule_id,
  };
}

export async function buildOutcomeVersionRowV0_2({
  snapshot,
  decisionLineage,
  regimeLineage,
  corporateActionHash,
} = {}) {
  const outcomeHash = await recomputeOutcomeHash(snapshot);
  const decision = normalizeDecisionLineage(decisionLineage);
  const regime = normalizeRegimeLineage(regimeLineage);
  const execution = await normalizeExecutionLineage(snapshot);
  const corporateHash = requiredHash(corporateActionHash, "corporateActionHash");

  exactMatch(snapshot.decisionId, decision.decisionId, "decisionId");
  exactMatch(snapshot.symbol, decision.symbol, "symbol");
  exactMatch(snapshot.decisionMarketDate, decision.marketDate, "marketDate");
  exactMatch(snapshot.decisionTimestamp, decision.decisionTimestamp, "decisionTimestamp");
  exactMatch(decision.regimeSnapshotId, regime.regimeSnapshotId, "regimeSnapshotId");

  const priceSpace = requiredText(snapshot.priceSpace, "snapshot.priceSpace");
  const corporateActionState = requiredText(
    snapshot.corporateActionState,
    "snapshot.corporateActionState",
  );

  const lineageBase = {
    ...decision,
    regimeHash: regime.regimeHash,
    priceSpace,
    corporateActionState,
    corporateActionHash: corporateHash,
    executionHash: execution.executionHash,
    executionVersion: execution.executionVersion,
    costModelHash: execution.costModelHash,
    costModelVersion: execution.costModelVersion,
    taxRuleId: execution.taxRuleId,
  };
  const lineageHash = await sha256Hex(lineageBase);
  const outcomeVersionId = `S2OV:${lineageHash}`;

  const h = snapshot.horizonReturns || {};
  const b = snapshot.barrierObservation || {};
  const row = {
    outcome_version_id: outcomeVersionId,
    decision_id: decision.decisionId,
    decision_hash: decision.decisionHash,
    strategy_id: decision.strategyId,
    strategy_version: decision.strategyVersion,
    symbol: decision.symbol,
    market_date: decision.marketDate,
    decision_timestamp: decision.decisionTimestamp,
    regime_snapshot_id: regime.regimeSnapshotId,
    regime_hash: regime.regimeHash,
    price_space: priceSpace,
    corporate_action_state: corporateActionState,
    corporate_action_hash: corporateHash,
    execution_hash: execution.executionHash,
    execution_version: execution.executionVersion,
    cost_model_hash: execution.costModelHash,
    cost_model_version: execution.costModelVersion,
    tax_rule_id: execution.taxRuleId,
    lineage_hash: lineageHash,
    d1_return: finiteOrNull(h.D1, "snapshot.horizonReturns.D1"),
    d3_return: finiteOrNull(h.D3, "snapshot.horizonReturns.D3"),
    d5_return: finiteOrNull(h.D5, "snapshot.horizonReturns.D5"),
    d10_return: finiteOrNull(h.D10, "snapshot.horizonReturns.D10"),
    d20_return: finiteOrNull(h.D20, "snapshot.horizonReturns.D20"),
    mfe: finiteOrNull(snapshot.mfe, "snapshot.mfe"),
    mae: finiteOrNull(snapshot.mae, "snapshot.mae"),
    target_hit_session: integerOrNull(b.targetHitSession, "targetHitSession"),
    stop_hit_session: integerOrNull(b.stopHitSession, "stopHitSession"),
    ambiguous_same_bar: b.ambiguousSameBar ? 1 : 0,
    signal_returns_json: JSON.stringify({
      stock: snapshot.horizonReturns || {},
      benchmark: snapshot.benchmarkReturns || {},
      industry: snapshot.industryReturns || {},
      relativeBenchmark: snapshot.relativeBenchmarkReturns || {},
      relativeIndustry: snapshot.relativeIndustryReturns || {},
    }),
    signal_cost_scenarios_json: JSON.stringify(snapshot.costScenarios || {}),
    simulated_execution_state: execution.executionState,
    simulated_net_return_after_cost: finiteOrNull(
      snapshot.simulatedExecution?.realizedReturnAfterCost,
      "snapshot.simulatedExecution.realizedReturnAfterCost",
    ),
    simulated_holding_sessions: integerOrNull(
      snapshot.simulatedExecution?.holdingSessions,
      "snapshot.simulatedExecution.holdingSessions",
    ),
    simulated_fill_quality: snapshot.simulatedExecution?.fillQuality
      ? requiredText(snapshot.simulatedExecution.fillQuality, "snapshot.simulatedExecution.fillQuality")
      : null,
    outcome_payload_json: JSON.stringify(snapshot),
    outcome_hash: outcomeHash,
    updated_at: requiredText(snapshot.updatedAt, "snapshot.updatedAt"),
    schema_version: OUTCOME_VERSION_SCHEMA_V0_2,
  };
  return deepFreeze(row);
}

export async function verifyOutcomeVersionRowV0_2(row) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    throw new Error("outcome version row is required");
  }
  if (row.schema_version !== OUTCOME_VERSION_SCHEMA_V0_2) {
    throw new Error("unsupported outcome version schema");
  }

  const snapshot = parseJsonObject(row.outcome_payload_json, "outcome_payload_json");
  const recomputedOutcomeHash = await recomputeOutcomeHash(snapshot);
  if (row.outcome_hash !== recomputedOutcomeHash) throw new Error("OUTCOME_ROW_HASH_MISMATCH");

  const costModel = snapshot.simulatedExecution?.costModel;
  if (!costModel || typeof costModel !== "object" || Array.isArray(costModel)) {
    throw new Error("OUTCOME_COST_MODEL_MISSING");
  }
  const recomputedCostModelHash = await sha256Hex(costModel);
  if (row.cost_model_hash !== recomputedCostModelHash) {
    throw new Error("OUTCOME_COST_MODEL_HASH_MISMATCH");
  }

  const lineageBase = lineageBaseFromRow(row);
  const recomputedLineageHash = await sha256Hex({
    decisionId: lineageBase.decisionId,
    decisionHash: lineageBase.decisionHash,
    strategyId: lineageBase.strategyId,
    strategyVersion: lineageBase.strategyVersion,
    symbol: lineageBase.symbol,
    marketDate: lineageBase.marketDate,
    decisionTimestamp: lineageBase.decisionTimestamp,
    regimeSnapshotId: lineageBase.regimeSnapshotId,
    regimeHash: lineageBase.regimeHash,
    priceSpace: lineageBase.priceSpace,
    corporateActionState: lineageBase.corporateActionState,
    corporateActionHash: lineageBase.corporateActionHash,
    executionHash: lineageBase.executionHash,
    executionVersion: lineageBase.executionVersion,
    costModelHash: lineageBase.costModelHash,
    costModelVersion: lineageBase.costModelVersion,
    taxRuleId: lineageBase.taxRuleId,
  });
  if (row.lineage_hash !== recomputedLineageHash) {
    throw new Error("OUTCOME_LINEAGE_HASH_MISMATCH");
  }
  if (row.outcome_version_id !== `S2OV:${recomputedLineageHash}`) {
    throw new Error("OUTCOME_VERSION_ID_MISMATCH");
  }

  const immutableChecks = [
    ["decisionId", snapshot.decisionId, row.decision_id],
    ["symbol", snapshot.symbol, row.symbol],
    ["marketDate", snapshot.decisionMarketDate, row.market_date],
    ["decisionTimestamp", snapshot.decisionTimestamp, row.decision_timestamp],
    ["priceSpace", snapshot.priceSpace, row.price_space],
    ["corporateActionState", snapshot.corporateActionState, row.corporate_action_state],
    ["executionHash", snapshot.simulatedExecution?.executionHash, row.execution_hash],
    ["executionVersion", snapshot.simulatedExecution?.executionVersion, row.execution_version],
    ["costModelVersion", snapshot.simulatedExecution?.costModelVersion, row.cost_model_version],
    ["taxRuleId", snapshot.simulatedExecution?.taxRuleId, row.tax_rule_id],
  ];
  for (const [field, actual, expected] of immutableChecks) {
    if (actual !== expected) throw new Error(`OUTCOME_PAYLOAD_LINEAGE_MISMATCH:${field}`);
  }

  return deepFreeze({
    valid: true,
    outcomeHash: recomputedOutcomeHash,
    costModelHash: recomputedCostModelHash,
    lineageHash: recomputedLineageHash,
  });
}

function legacyProjection(row) {
  return {
    decision_id: row.decision_id,
    d1_return: row.d1_return,
    d3_return: row.d3_return,
    d5_return: row.d5_return,
    d10_return: row.d10_return,
    d20_return: row.d20_return,
    mfe: row.mfe,
    mae: row.mae,
    target_hit_session: row.target_hit_session,
    stop_hit_session: row.stop_hit_session,
    ambiguous_same_bar: row.ambiguous_same_bar,
    realized_return_after_cost: row.simulated_net_return_after_cost,
    holding_sessions: row.simulated_holding_sessions,
    outcome_json: row.outcome_payload_json,
    updated_at: row.updated_at,
  };
}

export async function validateMonotonicOutcomeVersionUpdateV0_2(existingRow, nextRow) {
  if (existingRow === null || existingRow === undefined) {
    await verifyOutcomeVersionRowV0_2(nextRow);
    return deepFreeze({ state: "INSERT_ALLOWED", updateAllowed: true, blockers: [] });
  }

  await verifyOutcomeVersionRowV0_2(existingRow);
  await verifyOutcomeVersionRowV0_2(nextRow);

  const blockers = [];
  const immutableColumns = [
    "outcome_version_id","decision_id","decision_hash","strategy_id","strategy_version",
    "symbol","market_date","decision_timestamp","regime_snapshot_id","regime_hash",
    "price_space","corporate_action_state","corporate_action_hash","execution_hash",
    "execution_version","cost_model_hash","cost_model_version","tax_rule_id","lineage_hash",
  ];
  for (const column of immutableColumns) {
    if (canonicalStringify(existingRow[column]) !== canonicalStringify(nextRow[column])) {
      blockers.push(`IMMUTABLE_OUTCOME_LINEAGE_REVISION:${column}`);
    }
  }

  const legacy = validateMonotonicOutcomeUpdateV0_1(
    legacyProjection(existingRow),
    legacyProjection(nextRow),
  );
  blockers.push(...legacy.blockers);

  return deepFreeze({
    state: blockers.length ? "OUTCOME_REVISION_CONFLICT" : "UPDATE_ALLOWED",
    updateAllowed: blockers.length === 0,
    blockers: Object.freeze([...new Set(blockers)]),
  });
}
