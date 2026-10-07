import { deepFreeze } from "./factor_snapshot.mjs";
import { SHORT_MOMENTUM_CONTRACT_V0_1 } from "./strategy_contracts_v0_1.mjs";
import { findLimitedShadowSpec } from "./limited_shadow_v0_1.mjs";
import { assessStage1StrategyV0_1 } from "./stage1_assessor_policies_v0_1.mjs";
import { runDailyLimitedShadowOrchestratorV0_1 } from "./daily_shadow_orchestrator_v0_1.mjs";
import { buildNcT01ReceiptFromOrchestrationV0_1 } from "./nct01_physical_receipt_v0_1.mjs";

export const NCT01_ARTIFACT_RUNNER_VERSION_V0_1 = "0.1-RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function timestamp(value, field) {
  const text=requiredText(value,field);
  if(!Number.isFinite(Date.parse(text))) throw new Error(field+" must be an ISO timestamp");
  return new Date(text).toISOString();
}

function normalizeReceiptMap(input) {
  if(input instanceof Map) return new Map(input);
  if(input && typeof input==="object" && !Array.isArray(input)) {
    return new Map(Object.entries(input));
  }
  throw new Error("continuityReceiptsBySymbol must be a Map or object");
}

function cleanRawRefs(values) {
  if(!Array.isArray(values)) throw new Error("sharedRawSourceRefs must be an array");
  return [...new Set(values.map((x)=>requiredText(String(x),"sharedRawSourceRefs[]")))];
}

export async function runNcT01ArtifactOnlyV0_1({
  runId,
  receiptId,
  marketDate,
  decisionTimestamp,
  capturedAt,
  universeVersion,
  a1SymbolSnapshotBatch,
  sourceSessionReceipt,
  regime,
  loadPriorHistoricalBars,
  continuityReceiptsBySymbol,
  policyFingerprintReceipt,
  sharedRawSourceRefs = [],
  historyPrefetchEvidence = null,
  hiddenFallbackAuditEvidence = null,
  orchestrator = runDailyLimitedShadowOrchestratorV0_1,
} = {}) {
  const id=requiredText(runId,"runId");
  const date=requiredText(marketDate,"marketDate");
  const clock=timestamp(decisionTimestamp,"decisionTimestamp");
  const captured=timestamp(capturedAt,"capturedAt");
  const universe=requiredText(universeVersion,"universeVersion");
  if(Date.parse(captured)<Date.parse(clock)) throw new Error("capturedAt cannot predate decisionTimestamp");
  if(typeof loadPriorHistoricalBars!=="function") throw new Error("loadPriorHistoricalBars is required");
  if(typeof orchestrator!=="function") throw new Error("orchestrator is required");
  if(!a1SymbolSnapshotBatch||typeof a1SymbolSnapshotBatch!=="object") throw new Error("a1SymbolSnapshotBatch is required");
  if(!sourceSessionReceipt||typeof sourceSessionReceipt!=="object") throw new Error("sourceSessionReceipt is required");
  if(!regime||typeof regime!=="object") throw new Error("regime is required");
  if(!policyFingerprintReceipt||typeof policyFingerprintReceipt!=="object") throw new Error("policyFingerprintReceipt is required");

  const shadowSpec=findLimitedShadowSpec("SHORT_MOMENTUM");
  if(!shadowSpec) throw new Error("SHORT_MOMENTUM limited Shadow spec missing");
  const continuityMap=normalizeReceiptMap(continuityReceiptsBySymbol);
  const rawRefs=cleanRawRefs(sharedRawSourceRefs);

  if(policyFingerprintReceipt.strategyId!=="SHORT_MOMENTUM") {
    throw new Error("NC-T01 policy fingerprint must be SHORT_MOMENTUM");
  }
  if(policyFingerprintReceipt.strategyVersion!==SHORT_MOMENTUM_CONTRACT_V0_1.strategyVersion) {
    throw new Error("NC-T01 policy fingerprint version mismatch");
  }
  if(policyFingerprintReceipt.candidateUniverseMode!=="NOT_PHYSICALLY_PROVEN") {
    throw new Error("NC-T01 pre-run fingerprint must remain NOT_PHYSICALLY_PROVEN");
  }
  if(policyFingerprintReceipt.requiresOtherSystemCandidateOutput!==false
    || policyFingerprintReceipt.requiresOtherSystemRankOutput!==false) {
    throw new Error("NC-T01 policy fingerprint contains System1 dependency");
  }

  const orchestration=await orchestrator({
    runId:id,
    fingerprintId:id+"|RUN-FINGERPRINT",
    predictionSnapshotId:id+"|PREDICTION",
    persistenceBatchId:id+"|PERSISTENCE-DRY-BUILD",
    marketDate:date,
    decisionTimestamp:clock,
    capturedAt:captured,
    universeVersion:universe,
    contract:SHORT_MOMENTUM_CONTRACT_V0_1,
    shadowSpec,
    sourceSessionReceipt,
    regime,
    a1SymbolSnapshotBatch,
    lookbackSessions:61,
    loadPriorHistoricalBars,
    resolveContinuityEvidence:async ({symbol})=>continuityMap.get(String(symbol))||null,
    assessSymbol:async ({factorBundle})=>assessStage1StrategyV0_1({
      strategyId:"SHORT_MOMENTUM",
      factorBundle,
    }),
    runWarnings:[
      "NC_T01_ARTIFACT_ONLY_PHYSICAL_PATH",
      "SYSTEM1_TOP6_INPUT_UNAVAILABLE",
      "SYSTEM1_RANK_INPUT_UNAVAILABLE",
      "D1_PERSISTENCE_EXECUTION_DISABLED",
    ],
  });

  const receipt=await buildNcT01ReceiptFromOrchestrationV0_1({
    receiptId:requiredText(receiptId,"receiptId"),
    orchestration,
    policyFingerprintReceipt,
    sharedRawSourceRefs:rawRefs,
    hiddenFallbackAuditEvidence,
    generatedAt:captured,
    notes:[
      "NC_T01_ARTIFACT_ONLY_RUNNER_V0_1",
      "SYSTEM1_TOP6_INPUT_AVAILABLE_FALSE",
      "SYSTEM1_RANK_INPUT_AVAILABLE_FALSE",
      "PERSISTENCE_BATCH_DRY_BUILT_NOT_EXECUTED",
      ...(historyPrefetchEvidence?.prefetchHash
        ? ["HISTORY_PREFETCH_SHA256:"+historyPrefetchEvidence.prefetchHash]
        : []),
    ],
  });

  const continuityReadySymbols=orchestration.perSymbolDiagnostics
    .filter((x)=>
      x.state==="ACCOUNTED"
      && x.replayState==="READY"
      && x.continuityBindingState==="READY"
      && Array.isArray(x.continuityBlockerCodes)
      && x.continuityBlockerCodes.length===0
    )
    .map((x)=>String(x.symbol))
    .sort();
  const requiredEvidenceCompleteSymbols=orchestration.perSymbolDiagnostics
    .filter((x)=>
      x.state==="ACCOUNTED"
      && x.requiredEvidenceComplete===true
      && Number(x.missingRequiredEvidenceCount||0)===0
    )
    .map((x)=>String(x.symbol))
    .sort();
  const strategyExecutableSymbols=orchestration.perSymbolDiagnostics
    .filter((x)=>
      x.state==="ACCOUNTED"
      && x.replayState==="READY"
      && x.continuityBindingState==="READY"
      && Array.isArray(x.continuityBlockerCodes)
      && x.continuityBlockerCodes.length===0
      && x.requiredEvidenceComplete===true
      && Number(x.missingRequiredEvidenceCount||0)===0
      && ["VALID","WEAKENING","INVALIDATED"].includes(x.strategyValidity)
      && typeof x.assessmentHash==="string"
    )
    .map((x)=>String(x.symbol))
    .sort();
  const incompleteSymbols=orchestration.perSymbolDiagnostics
    .filter((x)=>x.state==="ACCOUNTED" && x.strategyValidity==="INCOMPLETE")
    .map((x)=>String(x.symbol))
    .sort();

  const evidence=deepFreeze({
    schemaVersion:"S2_NCT01_ARTIFACT_RUN_V0_1",
    version:NCT01_ARTIFACT_RUNNER_VERSION_V0_1,
    runId:id,
    marketDate:date,
    decisionTimestamp:clock,
    strategyId:"SHORT_MOMENTUM",
    strategyVersion:SHORT_MOMENTUM_CONTRACT_V0_1.strategyVersion,
    policyFingerprintHash:policyFingerprintReceipt.fingerprintHash,
    baseUniverseCount:orchestration.baseUniverseCount,
    accountedCount:orchestration.accountedCount,
    continuityReceiptInputCount:continuityMap.size,
    continuityReadySymbolCount:continuityReadySymbols.length,
    continuityReadySymbols:Object.freeze(continuityReadySymbols),
    requiredEvidenceCompleteSymbolCount:requiredEvidenceCompleteSymbols.length,
    requiredEvidenceCompleteSymbols:Object.freeze(requiredEvidenceCompleteSymbols),
    strategyExecutableSymbolCount:strategyExecutableSymbols.length,
    strategyExecutableSymbols:Object.freeze(strategyExecutableSymbols),
    hiddenFallbackAuditState:hiddenFallbackAuditEvidence?.auditState||"EVIDENCE_INCOMPLETE",
    hiddenFallbackAuditDigest:hiddenFallbackAuditEvidence?.auditDigest||null,
    hiddenFallbackRunnerHeadSha:hiddenFallbackAuditEvidence?.runnerHeadSha||null,
    hiddenFallbackTransitiveManifestHash:hiddenFallbackAuditEvidence?.transitiveManifestHash||null,
    hiddenFallbackRuntimeForbiddenAccessCount:
      Number.isInteger(hiddenFallbackAuditEvidence?.runtimeEvidence?.runtimeForbiddenAccessCount)
        ? hiddenFallbackAuditEvidence.runtimeEvidence.runtimeForbiddenAccessCount
        : null,
    incompleteSymbolCount:incompleteSymbols.length,
    generatedCandidateCount:receipt.generatedCandidates.length,
    generatedCandidates:receipt.generatedCandidates,
    requiredInputsState:receipt.requiredInputsState,
    executionState:receipt.executionState,
    zeroPickDisposition:receipt.zeroPickDisposition,
    resultClassification:receipt.resultClassification,
    orchestrationHash:orchestration.orchestrationHash,
    persistenceBatchHash:orchestration.bundle?.persistenceBatch?.batchHash||null,
    shadowAccountingHash:orchestration.bundle?.fingerprint?.shadowAccountingHash||null,
    physicalReceiptHash:receipt.receiptHash,
    historyPrefetchHash:historyPrefetchEvidence?.prefetchHash||null,
    d1PersistenceExecuted:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });

  return deepFreeze({
    evidence,
    receipt,
    orchestration,
  });
}
