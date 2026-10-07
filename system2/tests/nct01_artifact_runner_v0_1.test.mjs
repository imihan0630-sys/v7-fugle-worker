import assert from "node:assert/strict";
import { runNcT01ArtifactOnlyV0_1 } from "../runtime/nct01_artifact_runner_v0_1.mjs";
import { buildNcT01HiddenFallbackAuditV0_1 } from "../runtime/nct01_hidden_fallback_audit_v0_1.mjs";

const h=(c)=>String(c).repeat(64);
const cleanAudit=await buildNcT01HiddenFallbackAuditV0_1({
  runnerEntryPoint:"system2/runtime/nct01_artifact_runner_v0_1.mjs",
  runnerHeadSha:"a".repeat(40),
  auditedBlobIdentities:[
    {path:"system2/runtime/nct01_artifact_runner_v0_1.mjs",blobSha:"b".repeat(40)},
    {path:"system2/runtime/nct01_physical_receipt_v0_1.mjs",blobSha:"c".repeat(40)},
  ],
  perDimensionDisposition:{
    cachedSystem1SelectionUsed:"PROVEN_ABSENT",
    persistedSystem1SelectionUsed:"PROVEN_ABSENT",
    aliasReconstructionUsed:"PROVEN_ABSENT",
    crossProjectFallbackUsed:"PROVEN_ABSENT",
    staleSharedStateUsed:"PROVEN_ABSENT",
  },
  runtimeEvidence:{
    instrumented:true,
    sameExecutionCut:true,
    runtimeForbiddenAccessCount:0,
    runtimeEvidenceDigest:h("f"),
    typedEvidence:["NO_FORBIDDEN_SYSTEM1_ACCESS"],
  },
  forbiddenSourceFamilyVersion:"S2-NCT01-FORBIDDEN-SOURCES-V0_1",
  auditGeneratedAt:"2026-10-07T07:30:30Z",
});
const policy={
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  fingerprintHash:h("1"),
  candidateUniverseMode:"NOT_PHYSICALLY_PROVEN",
  requiresOtherSystemCandidateOutput:false,
  requiresOtherSystemRankOutput:false,
};
const continuityReceipt={continuityReceiptId:"REAL-WITNESS-1101",receiptHash:h("2")};

function fakeOrchestratorFactory({withWitness=true}={}){
  return async (args)=>{
    assert.equal(args.contract.strategyId,"SHORT_MOMENTUM");
    assert.equal(args.contract.strategyVersion,"V0.1-CONTRACT");
    assert.equal(args.shadowSpec.shadowSpecId,"S2-SM-LS-001");
    assert.equal(args.lookbackSessions,61);
    assert.equal(args.resolveContinuityState,undefined);
    assert.equal(typeof args.resolveContinuityEvidence,"function");
    assert.equal(typeof args.assessSymbol,"function");
    assert.ok(args.runWarnings.includes("SYSTEM1_TOP6_INPUT_UNAVAILABLE"));
    assert.ok(args.runWarnings.includes("SYSTEM1_RANK_INPUT_UNAVAILABLE"));
    assert.ok(args.runWarnings.includes("D1_PERSISTENCE_EXECUTION_DISABLED"));

    const hit=await args.resolveContinuityEvidence({symbol:"1101"});
    const miss=await args.resolveContinuityEvidence({symbol:"1213"});
    assert.equal(hit,withWitness?continuityReceipt:null);
    assert.equal(miss,null);

    const assessment=await args.assessSymbol({
      factorBundle:{factorObservations:[],coreMetrics:{}},
    });
    assert.equal(assessment.entryReadiness,"WATCH");
    assert.ok(assessment.warnings.includes("NO_SYSTEM1_AB_OR_TOP6_DEPENDENCY"));

    const witnessDiag=withWitness
      ? {
          symbol:"1101",
          state:"ACCOUNTED",
          replayState:"READY",
          replayHash:h("3"),
          continuityBindingState:"READY",
          continuityReceiptHash:h("4"),
          sourceHistoryHash:h("5"),
          continuityTransformHash:h("6"),
          continuityBlockerCodes:[],
          missingRequiredEvidenceCount:0,
          requiredEvidenceComplete:true,
          assessmentHash:h("6"),
          strategyValidity:"VALID",
          entryReadiness:"WATCH",
        }
      : {
          symbol:"1101",
          state:"ACCOUNTED",
          replayState:"READY",
          replayHash:h("3"),
          continuityBindingState:"INCOMPLETE",
          continuityReceiptHash:null,
          sourceHistoryHash:h("5"),
          continuityTransformHash:null,
          continuityBlockerCodes:["CONTINUITY_RECEIPT_MISSING"],
          missingRequiredEvidenceCount:1,
          requiredEvidenceComplete:false,
          assessmentHash:h("7"),
          strategyValidity:"INCOMPLETE",
          entryReadiness:"BLOCKED",
        };

    return {
      strategyId:"SHORT_MOMENTUM",
      strategyVersion:"V0.1-CONTRACT",
      decisionTimestamp:"2026-10-07T07:30:00.000Z",
      a1BatchHash:h("7"),
      baseUniverseCount:2,
      eligibleCount:2,
      accountedCount:2,
      orchestrationHash:h("8"),
      perSymbolDiagnostics:[
        witnessDiag,
        {
          symbol:"1213",
          state:"ACCOUNTED",
          replayState:"READY",
          replayHash:h("9"),
          continuityBindingState:"INCOMPLETE",
          continuityReceiptHash:null,
          sourceHistoryHash:h("a"),
          continuityTransformHash:null,
          continuityBlockerCodes:["CONTINUITY_RECEIPT_MISSING"],
          missingRequiredEvidenceCount:1,
          requiredEvidenceComplete:false,
          assessmentHash:h("7"),
          strategyValidity:"INCOMPLETE",
          entryReadiness:"BLOCKED",
        },
      ],
      bundle:{
        runReceipt:{runState:"COMPLETE",universeVersion:"A1-ORDINARY-EQUITY-V0.1"},
        factorRows:[
          {symbol:"1101",snapshot_hash:h("b")},
          {symbol:"1213",snapshot_hash:h("c")},
        ],
        decisionSnapshots:[
          {evaluation:{symbol:"1101",state:withWitness?"WATCH":"INCOMPLETE"}},
          {evaluation:{symbol:"1213",state:"INCOMPLETE"}},
        ],
        fingerprint:{shadowAccountingHash:h("d")},
        persistenceBatch:{batchHash:h("e")},
      },
    };
  };
}

const common={
  runId:"NC-T01-RUN-001",
  receiptId:"NC-T01-RECEIPT-001",
  marketDate:"2026-10-07",
  decisionTimestamp:"2026-10-07T07:30:00Z",
  capturedAt:"2026-10-07T07:31:00Z",
  universeVersion:"A1-ORDINARY-EQUITY-V0.1",
  a1SymbolSnapshotBatch:{state:"READY"},
  sourceSessionReceipt:{sourceSessionState:"SOURCE_SESSION_READY"},
  regime:{labels:["UNKNOWN"]},
  loadPriorHistoricalBars:async()=>[],
  policyFingerprintReceipt:policy,
  sharedRawSourceRefs:["A1_TWSE_OFFICIAL","S2_D1_PIT_HISTORY"],
  historyPrefetchEvidence:{prefetchHash:h("f")},
  hiddenFallbackAuditEvidence:cleanAudit,
};

const pass=await runNcT01ArtifactOnlyV0_1({
  ...common,
  continuityReceiptsBySymbol:{"1101":continuityReceipt},
  orchestrator:fakeOrchestratorFactory({withWitness:true}),
});
assert.equal(pass.receipt.resultClassification,"PHYSICALLY_INDEPENDENT_PATH_OBSERVED");
assert.equal(pass.receipt.zeroPickDisposition,"LEGITIMATE_ZERO_PICK");
assert.equal(pass.receipt.system1Top6InputAvailable,false);
assert.equal(pass.receipt.system1RankInputAvailable,false);
assert.equal(pass.evidence.continuityReceiptInputCount,1);
assert.equal(pass.evidence.continuityReadySymbolCount,1);
assert.deepEqual(pass.evidence.continuityReadySymbols,["1101"]);
assert.equal(pass.evidence.requiredEvidenceCompleteSymbolCount,1);
assert.equal(pass.evidence.strategyExecutableSymbolCount,1);
assert.equal(pass.evidence.hiddenFallbackAuditState,"CLEAN_PROVEN_ABSENT");
assert.equal(pass.evidence.hiddenFallbackAuditIntegrityValid,true);
assert.equal(pass.evidence.d1PersistenceExecuted,false);
assert.equal(pass.evidence.finalSelectionEnabled,false);
assert.equal(pass.evidence.system1RuntimeUsed,false);
assert.ok(pass.receipt.notes.includes("HISTORY_PREFETCH_SHA256:"+h("f")));

const sameCutOrder=[];
const sameCut=await runNcT01ArtifactOnlyV0_1({
  ...common,
  receiptId:"NC-T01-RECEIPT-SAME-CUT",
  hiddenFallbackAuditEvidence:null,
  hiddenFallbackAuditEvidenceFactory:async ({orchestration})=>{
    sameCutOrder.push("AUDIT_FINALIZED_AFTER_ORCHESTRATION");
    assert.equal(orchestration.strategyId,"SHORT_MOMENTUM");
    assert.equal(orchestration.orchestrationHash,h("8"));
    return cleanAudit;
  },
  continuityReceiptsBySymbol:{"1101":continuityReceipt},
  orchestrator:async (args)=>{
    sameCutOrder.push("ORCHESTRATION_EXECUTED");
    return fakeOrchestratorFactory({withWitness:true})(args);
  },
});
assert.deepEqual(sameCutOrder,[
  "ORCHESTRATION_EXECUTED",
  "AUDIT_FINALIZED_AFTER_ORCHESTRATION",
]);
assert.equal(sameCut.receipt.resultClassification,"PHYSICALLY_INDEPENDENT_PATH_OBSERVED");
assert.equal(sameCut.evidence.hiddenFallbackAuditIntegrityValid,true);

await assert.rejects(
  ()=>runNcT01ArtifactOnlyV0_1({
    ...common,
    receiptId:"NC-T01-BAD-DUAL-AUDIT",
    hiddenFallbackAuditEvidenceFactory:async()=>cleanAudit,
    continuityReceiptsBySymbol:{},
    orchestrator:fakeOrchestratorFactory({withWitness:false}),
  }),
  /mutually exclusive/,
);

const blocked=await runNcT01ArtifactOnlyV0_1({
  ...common,
  receiptId:"NC-T01-RECEIPT-BLOCKED",
  continuityReceiptsBySymbol:{},
  orchestrator:fakeOrchestratorFactory({withWitness:false}),
});
assert.equal(blocked.receipt.resultClassification,"EVIDENCE_INCOMPLETE");
assert.equal(blocked.receipt.requiredInputsState,"INCOMPLETE");
assert.equal(blocked.receipt.executionState,"BLOCKED_INPUTS");
assert.equal(blocked.receipt.zeroPickDisposition,"INPUT_INCOMPLETE");
assert.equal(blocked.evidence.continuityReadySymbolCount,0);

await assert.rejects(
  ()=>runNcT01ArtifactOnlyV0_1({
    ...common,
    receiptId:"NC-T01-BAD-POLICY",
    continuityReceiptsBySymbol:{},
    policyFingerprintReceipt:{...policy,candidateUniverseMode:"INDEPENDENT_FULL_MARKET"},
    orchestrator:fakeOrchestratorFactory({withWitness:false}),
  }),
  /must remain NOT_PHYSICALLY_PROVEN/,
);

console.log("System2 NC-T01 artifact-only runner core v0.1 tests passed");
