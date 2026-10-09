import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { auditS2F08RevisionChainReadbackV0_1 } from "./f08_outcome_atomic_cas_append_plan_v0_1.mjs";
import { classifyS2ExecutionDenominatorV0_1 } from "./execution_denominator_guard_v0_1.mjs";

// F08 / CORR-012 + CORR-013: pure downstream projection of an already frozen
// revision chain. Source rows supplied by a caller are NOT independent D1/PIT
// evidence. This module does not query storage, calculate trade statistics,
// certify a simulated fill, or enable a strategy/production selection.
export const F08_VERSIONED_RESEARCH_VIEW_V0_1 =
  "S2_F08_VERSIONED_OUTCOME_RESEARCH_VIEW_V0_1";
const HORIZONS = Object.freeze([1, 3, 5, 10, 20]);

function timestamp(v, name) {
  if (typeof v !== "string" ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(v) ||
      !Number.isFinite(Date.parse(v))) {
    throw new Error("F08_RESEARCH_VIEW_INVALID_TIMESTAMP:" + name);
  }
  return new Date(v).toISOString();
}

function observationalHorizons(outcome) {
  const matured = new Set(outcome.maturedHorizons || []);
  return HORIZONS.map((horizon) => {
    const key = "D" + horizon;
    const value = outcome.horizonReturns?.[key];
    const reported = matured.has(horizon);
    const eligible = outcome.performanceEligible === true &&
      reported && Number.isFinite(value);
    return {
      horizon:key,
      state:eligible ? "SOURCE_UNVERIFIED_OBSERVATION" : "UNKNOWN_OR_IMMATURE",
      signalReturnObservation:eligible ? value : null,
      signalOnly:true,
      physicalSourceAttested:false,
      costAdjustedTradeReturn:null,
      eligibleForStrategyPerformance:false,
    };
  });
}

export async function buildS2F08VersionedOutcomeResearchViewV0_1({
  receiptChain, readbackRows, observedAt, maxRevisions=100,
  bindingName="SYSTEM2_DB",
} = {}) {
  const at=timestamp(observedAt,"observedAt");
  // The existing structural auditor checks the complete genesis/ancestry,
  // exact SQL-shaped 22 columns, ordered ordinals and immutable hashes.
  const chain=await auditS2F08RevisionChainReadbackV0_1({
    receiptChain,readbackRows,maxRevisions,bindingName,
  });
  const first=receiptChain[0];
  const versions=[];
  for (const receipt of receiptChain) {
    const outcome=receipt.outcome;
    if (Date.parse(timestamp(outcome.updatedAt,"outcome.updatedAt")) > Date.parse(at)) {
      throw new Error("F08_RESEARCH_VIEW_FUTURE_OUTCOME");
    }
    const execution=classifyS2ExecutionDenominatorV0_1(
      outcome.simulatedExecution ?? null,
    );
    if (execution.denominatorEligible !== false ||
        execution.noFillDenominatorEligible !== false ||
        execution.certifiedTradeReturn !== null) {
      throw new Error("F08_RESEARCH_VIEW_UNEXPECTED_EXECUTION_AUTHORITY");
    }
    versions.push({
      revisionId:receipt.revisionId,
      revisionHash:receipt.revisionHash,
      revisionNumber:receipt.revisionNumber,
      previousRevisionHash:receipt.previousRevisionHash,
      outcomeHash:receipt.outcomeHash,
      updatedAt:timestamp(outcome.updatedAt,"outcome.updatedAt"),
      marketDate:receipt.parentLineage.marketDate,
      decisionHash:receipt.parentLineage.decisionHash,
      strategyId:receipt.parentLineage.strategyId,
      strategyVersion:receipt.parentLineage.strategyVersion,
      regimeHash:receipt.parentLineage.regimeHash,
      executionHash:receipt.lineage.executionHash,
      costModelHash:receipt.lineage.costModelHash,
      observedSignalHorizons:observationalHorizons(outcome),
      executionModelState:execution.modelState,
      executionModelClassification:execution.classification,
      confirmedTriggered:null,
      confirmedNoFill:null,
      confirmedProfitable:null,
      realizedReturnAfterCost:null,
      sourcePhysicalPITVerified:false,
      certifiedPerformance:false,
    });
  }
  const base={
    schemaVersion:F08_VERSIONED_RESEARCH_VIEW_V0_1,
    status:"RESEARCH_VIEW_ONLY_NO_PHYSICAL_OR_EXECUTION_CERTIFICATION",
    decisionId:first.parentLineage.decisionId,
    decisionHash:first.parentLineage.decisionHash,
    strategyId:first.parentLineage.strategyId,
    strategyVersion:first.parentLineage.strategyVersion,
    symbol:first.parentLineage.symbol,
    marketDate:first.parentLineage.marketDate,
    regimeHash:first.parentLineage.regimeHash,
    lineageHash:first.lineageHash,
    observedAt:at,
    versionCount:versions.length,
    latestRevisionHash:versions.at(-1).revisionHash,
    chainInspectionHash:chain.auditHash,
    revisions:versions,
    signalHorizonObservationsOnly:true,
    historicalRecordOverwriteAllowed:false,
    certifiedStrategyReturn:null,
    certifiedTradeCount:null,
    certifiedWinRate:null,
    certifiedProfitFactor:null,
    certifiedNoFillDenominator:null,
    selectedToTriggeredDenominator:null,
    realFillOrOrderAuthority:false,
    physicalD1ReadbackVerified:false,
    physicalD1WriteAuthorized:false,
    officialExchangeCalendarVerified:false,
    independentSourcePITVerified:false,
    accountWideQuotaGranted:false,
    performancePromotionAuthorized:false,
    shadowFinalSelectionEnabled:false,
    system1FormalCoreImpact:false,
  };
  return deepFreeze({...base,viewHash:await sha256Hex(base)});
}
