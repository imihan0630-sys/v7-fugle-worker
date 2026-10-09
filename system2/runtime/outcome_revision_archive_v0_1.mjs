import { deepFreeze } from "./factor_snapshot.mjs";
import { canonicalStringify, sha256Hex } from "./decision_archive.mjs";
import { toS2OutcomeRowV0_1, validateMonotonicOutcomeUpdateV0_1 } from "./outcome_tracker_v0_1.mjs";

// CORR-012: this is an offline/Shadow evidence archive contract, not a physical
// D1 writer, production engine or independent source-attestation authority.
export const S2_OUTCOME_REVISION_ARCHIVE_VERSION_V0_1 = "S2_OUTCOME_REVISION_ARCHIVE_V0_1";
const HEX = /^[0-9a-f]{64}$/;
function requiredText(v, name) {
  if (typeof v !== "string" || !v.trim()) throw new Error(name + " is required");
  return v.trim();
}
function hash(v, name) {
  const s = requiredText(v, name);
  if (!HEX.test(s)) throw new Error(name + " must be 64 lowercase hex");
  return s;
}
function object(v, name) {
  if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error(name + " must be an object");
  return v;
}
function exact(actual, expected, name) {
  if (actual !== expected) throw new Error("OUTCOME_REVISION_PARENT_MISMATCH:" + name);
}
function omitHash(v, field) {
  const rest = { ...v };
  delete rest[field];
  return rest;
}
async function checkOutcome(outcome) {
  object(outcome, "outcome");
  const claimed = hash(outcome.outcomeHash, "outcome.outcomeHash");
  if (typeof outcome.updatedAt !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(outcome.updatedAt) || !Number.isFinite(Date.parse(outcome.updatedAt))) { throw new Error("OUTCOME_REVISION_OUTCOME_CLOCK_INVALID"); }
  if (claimed !== await sha256Hex(omitHash(outcome, "outcomeHash"))) {
    throw new Error("OUTCOME_REVISION_SNAPSHOT_HASH_MISMATCH");
  }
  return claimed;
}
function getParentLineage(decision, regime) {
  object(decision, "decision");
  object(regime, "regime");
  const data = {
    decisionId: requiredText(decision.decisionId, "decision.decisionId"),
    decisionHash: hash(decision.decisionHash, "decision.decisionHash"),
    strategyId: requiredText(decision.strategyId, "decision.strategyId"),
    strategyVersion: requiredText(decision.strategyVersion, "decision.strategyVersion"),
    symbol: requiredText(decision.symbol, "decision.symbol"),
    marketDate: requiredText(decision.marketDate, "decision.marketDate"),
    decisionTimestamp: requiredText(decision.decisionTimestamp, "decision.decisionTimestamp"),
    regimeSnapshotId: requiredText(regime.regimeSnapshotId, "regime.regimeSnapshotId"),
    regimeHash: hash(regime.regimeHash, "regime.regimeHash"),
  };
  exact(decision.regimeSnapshotId, data.regimeSnapshotId, "decision.regimeSnapshotId");
  exact(regime.marketDate, data.marketDate, "regime.marketDate");
  exact(regime.decisionTimestamp, data.decisionTimestamp, "regime.decisionTimestamp");
  return data;
}
function checkProjection(outcome, simulation) {
  const projection = object(outcome.simulatedExecution, "outcome.simulatedExecution");
  const sim = object(simulation, "simulation");
  object(sim.order, "simulation.order");
  const model = object(sim.order.costModel, "simulation.order.costModel");
  exact(projection.executionHash, sim.executionHash, "executionHash");
  exact(projection.executionVersion, sim.executionVersion, "executionVersion");
  exact(projection.state, sim.state, "executionState");
  exact(projection.costModelVersion, model.costModelVersion, "costModelVersion");
  exact(projection.taxRuleId, model.taxRuleId, "taxRuleId");
  if (canonicalStringify(projection.costModel) !== canonicalStringify(model)) {
    throw new Error("OUTCOME_REVISION_COST_MODEL_MISMATCH");
  }
  exact(projection.realizedReturnAfterCost, sim.realizedReturnAfterCost, "simulatedReturn");
  exact(projection.holdingSessions, sim.holdingSessions, "holdingSessions");
  return model;
}
function checkIdentity(outcome, simulation, lineage) {
  for (const [name, actual, expected] of [
    ["decisionId", outcome.decisionId, lineage.decisionId],
    ["symbol", outcome.symbol, lineage.symbol],
    ["marketDate", outcome.decisionMarketDate, lineage.marketDate],
    ["decisionTimestamp", outcome.decisionTimestamp, lineage.decisionTimestamp],
    ["simulation.decisionId", simulation.order.decisionId, lineage.decisionId],
    ["simulation.strategyId", simulation.order.strategyId, lineage.strategyId],
    ["simulation.strategyVersion", simulation.order.strategyVersion, lineage.strategyVersion],
    ["simulation.symbol", simulation.order.symbol, lineage.symbol],
    ["simulation.decisionTimestamp", simulation.order.decisionTimestamp, lineage.decisionTimestamp],
    ["simulation.priceSpace", simulation.order.priceSpace, outcome.priceSpace],
    ["simulation.corporateActionState", simulation.order.corporateActionState, outcome.corporateActionState],
  ]) exact(actual, expected, name);
}
function validateMaturation(previous, next) {
  const check = validateMonotonicOutcomeUpdateV0_1(
    toS2OutcomeRowV0_1(previous), toS2OutcomeRowV0_1(next),
  );
  if (!check.updateAllowed) {
    throw new Error("OUTCOME_REVISION_NON_MONOTONIC:" + check.blockers.join("|"));
  }
  if (!(Date.parse(next.updatedAt) > Date.parse(previous.updatedAt))) {
    throw new Error("OUTCOME_REVISION_CLOCK_NOT_ADVANCED");
  }
}

export async function verifyS2FrozenOutcomeRevisionV0_1(receipt) {
  object(receipt, "receipt");
  exact(receipt.schemaVersion, S2_OUTCOME_REVISION_ARCHIVE_VERSION_V0_1, "schemaVersion");
  const claimed = hash(receipt.revisionHash, "receipt.revisionHash");
  const calculated = await sha256Hex(omitHash(omitHash(receipt, "revisionHash"), "revisionId"));
  if (claimed !== calculated) throw new Error("OUTCOME_REVISION_RECEIPT_HASH_MISMATCH");
  const outcome = object(receipt.outcome, "receipt.outcome");
  const outcomeHash = await checkOutcome(outcome);
  exact(receipt.outcomeHash, outcomeHash, "outcomeHash");
  const parent = object(receipt.parentLineage, "receipt.parentLineage");
  const chain = object(receipt.lineage, "receipt.lineage");
  exact(chain.decisionId, outcome.decisionId, "lineage.decisionId");
  exact(chain.symbol, outcome.symbol, "lineage.symbol");
  exact(chain.marketDate, outcome.decisionMarketDate, "lineage.marketDate");
  exact(chain.decisionTimestamp, outcome.decisionTimestamp, "lineage.decisionTimestamp");
  for (const key of ["decisionId","decisionHash","strategyId","strategyVersion","symbol",
    "marketDate","decisionTimestamp","regimeSnapshotId","regimeHash"]) {
    exact(chain[key], parent[key], "lineage." + key);
  }
  exact(chain.priceSpace, outcome.priceSpace, "lineage.priceSpace");
  exact(chain.corporateActionState, outcome.corporateActionState, "lineage.corporateActionState");
  const costModel = object(outcome.simulatedExecution?.costModel, "outcome.simulatedExecution.costModel");
  exact(chain.costModelHash, await sha256Hex(costModel), "costModelHash");
  exact(chain.executionHash, outcome.simulatedExecution.executionHash, "executionHash");
  exact(chain.executionVersion, outcome.simulatedExecution.executionVersion, "executionVersion");
  exact(chain.costModelVersion, costModel.costModelVersion, "costModelVersion");
  exact(chain.taxRuleId, costModel.taxRuleId, "taxRuleId");
  exact(receipt.lineageHash, await sha256Hex(chain), "lineageHash");
  exact(receipt.costScenarioHash, await sha256Hex(outcome.costScenarios || {}), "costScenarioHash");
  if (!Number.isInteger(receipt.revisionNumber) || receipt.revisionNumber < 1) {
    throw new Error("OUTCOME_REVISION_NUMBER_INVALID");
  }
  if (receipt.revisionNumber === 1 && receipt.previousRevisionHash !== null) {
    throw new Error("OUTCOME_REVISION_GENESIS_PARENT_NOT_NULL");
  }
  if (receipt.revisionNumber > 1) hash(receipt.previousRevisionHash, "receipt.previousRevisionHash");
  exact(receipt.revisionId, "S2OR:" + claimed, "revisionId");
  exact(receipt.certifiedPerformance, false, "certifiedPerformance");
  exact(receipt.physicalPITVerified, false, "physicalPITVerified");
  exact(receipt.authorizesFinalSelection, false, "authorizesFinalSelection");
  return deepFreeze({valid:true,revisionHash:claimed,lineageHash:receipt.lineageHash,
    revisionNumber:receipt.revisionNumber});
}

export async function buildS2FrozenOutcomeRevisionV0_1({
  outcome, decision, regime, simulation, corporateActionHash, previousRevision = null,
} = {}) {
  const outcomeHash = await checkOutcome(outcome);
  const parent = getParentLineage(decision, regime);
  const model = checkProjection(outcome, simulation);
  checkIdentity(outcome, simulation, parent);
  const simulationHash = hash(simulation.executionHash, "simulation.executionHash");
  if (simulationHash !== await sha256Hex(omitHash(simulation, "executionHash"))) {
    throw new Error("OUTCOME_REVISION_EXECUTION_HASH_MISMATCH");
  }
  const actionHash = hash(corporateActionHash, "corporateActionHash");
  const lineage = {
    ...parent,
    priceSpace: outcome.priceSpace,
    corporateActionState: outcome.corporateActionState,
    corporateActionHash: actionHash,
    executionHash: simulationHash,
    executionVersion: simulation.executionVersion,
    costModelHash: await sha256Hex(model),
    costModelVersion: model.costModelVersion,
    taxRuleId: model.taxRuleId,
    costScenarioHash: await sha256Hex(outcome.costScenarios || {}),
  };
  const lineageHash = await sha256Hex(lineage);
  let previousRevisionHash = null, revisionNumber = 1;
  if (previousRevision !== null) {
    await verifyS2FrozenOutcomeRevisionV0_1(previousRevision);
    if (previousRevision.lineageHash !== lineageHash) {
      throw new Error("OUTCOME_REVISION_NEW_LINEAGE_REQUIRES_GENESIS");
    }
    validateMaturation(previousRevision.outcome, outcome);
    previousRevisionHash = previousRevision.revisionHash;
    revisionNumber = previousRevision.revisionNumber + 1;
  }
  const base = {
    schemaVersion: S2_OUTCOME_REVISION_ARCHIVE_VERSION_V0_1,
    parentLineage: parent,
    lineage,
    lineageHash,
    costScenarioHash: lineage.costScenarioHash,
    outcome,
    outcomeHash,
    revisionNumber,
    previousRevisionHash,
    certifiedPerformance: false,
    physicalPITVerified: false,
    authorizesFinalSelection: false,
    originalSourceEvidence: "NOT_INDEPENDENTLY_REVALIDATED",
    shadowResearchOnly: true,
  };
  const revisionHash = await sha256Hex(base);
  const receipt = deepFreeze({...base,revisionId:"S2OR:"+revisionHash,revisionHash});
  // Identity is derived exclusively from the frozen base, not an arbitrary
  // batch timestamp. Reprocessing same evidence yields the same revision id.
  return receipt;
}

export function toS2FrozenOutcomeRevisionRowV0_1(receipt) {
  if (!receipt || receipt.schemaVersion !== S2_OUTCOME_REVISION_ARCHIVE_VERSION_V0_1) {
    throw new Error("OUTCOME_REVISION_RECEIPT_NOT_VALIDATED");
  }
  return Object.freeze({
    revision_id: receipt.revisionId,
    revision_hash: receipt.revisionHash,
    decision_id: receipt.parentLineage.decisionId,
    decision_hash: receipt.parentLineage.decisionHash,
    strategy_id: receipt.parentLineage.strategyId,
    strategy_version: receipt.parentLineage.strategyVersion,
    regime_snapshot_id: receipt.parentLineage.regimeSnapshotId,
    regime_hash: receipt.parentLineage.regimeHash,
    lineage_hash: receipt.lineageHash,
    revision_number: receipt.revisionNumber,
    previous_revision_hash: receipt.previousRevisionHash,
    execution_hash: receipt.lineage.executionHash,
    cost_model_hash: receipt.lineage.costModelHash,
    cost_scenario_hash: receipt.costScenarioHash,
    outcome_hash: receipt.outcomeHash,
    observed_at: receipt.outcome.updatedAt,
    outcome_json: JSON.stringify(receipt.outcome),
    receipt_json: JSON.stringify(receipt),
    certified_performance: 0,
    physical_pit_verified: 0,
    final_selection_authorized: 0,
    schema_version: S2_OUTCOME_REVISION_ARCHIVE_VERSION_V0_1,
  });
}
