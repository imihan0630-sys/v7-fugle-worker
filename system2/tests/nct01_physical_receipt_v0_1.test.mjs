import assert from "node:assert/strict";
import {
  buildNcT01PhysicalIndependenceReceiptV0_1,
  buildNcT01ReceiptFromOrchestrationV0_1,
  nct01RequiredPassRefTypesV0_1,
} from "../runtime/nct01_physical_receipt_v0_1.mjs";
import { buildNcT01HiddenFallbackAuditV0_1 } from "../runtime/nct01_hidden_fallback_audit_v0_1.mjs";

const h=(c)=>String(c).repeat(64);
const typed=(type,c)=>type+":"+h(c);

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
    runtimeEvidenceDigest:h("d"),
    typedEvidence:["NO_FORBIDDEN_SYSTEM1_ACCESS"],
  },
  forbiddenSourceFamilyVersion:"S2-NCT01-FORBIDDEN-SOURCES-V0_1",
  auditGeneratedAt:"2026-10-07T07:30:30Z",
});

const allRefs=nct01RequiredPassRefTypesV0_1().map((type,index)=>
  type==="HIDDEN_FALLBACK_AUDIT_SHA256"
    ? type+":"+cleanAudit.auditDigest
    : typed(type,String((index%9)+1)),
);

const base={
  receiptId:"NC-T01-TEST-001",
  decisionAt:"2026-10-07T07:30:00Z",
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  hiddenFallbackAuditEvidence:cleanAudit,
  sharedRawSourceRefs:["A1_TWSE_OFFICIAL","S2_D1_PIT_HISTORY"],
  candidateUniverseProvenance:["UNIVERSE_VERSION:TEST","BASE_UNIVERSE_COUNT:2"],
  requiredInputsState:"READY",
  executionState:"EXECUTED",
  candidateGenerationExecutable:true,
  generatedCandidates:["1101"],
  sourceGenerationRefs:allRefs,
  generatedAt:"2026-10-07T07:31:00Z",
};

const pass=await buildNcT01PhysicalIndependenceReceiptV0_1(base);
assert.equal(pass.schemaVersion,"SDA022_NC_T01_RECEIPT_V0_1");
assert.equal(pass.resultClassification,"PHYSICALLY_INDEPENDENT_PATH_OBSERVED");
assert.equal(pass.zeroPickDisposition,"NOT_ZERO_PICK");
assert.equal(pass.system1Top6InputAvailable,false);
assert.equal(pass.system1RankInputAvailable,false);
assert.equal(pass.formalMutation,false);
assert.match(pass.receiptHash,/^[a-f0-9]{64}$/);

const zero=await buildNcT01PhysicalIndependenceReceiptV0_1({
  ...base,
  receiptId:"NC-T01-TEST-ZERO",
  generatedCandidates:[],
});
assert.equal(zero.resultClassification,"PHYSICALLY_INDEPENDENT_PATH_OBSERVED");
assert.equal(zero.zeroPickDisposition,"LEGITIMATE_ZERO_PICK");

const missingTyped=await buildNcT01PhysicalIndependenceReceiptV0_1({
  ...base,
  receiptId:"NC-T01-TEST-MISSING-REF",
  generatedCandidates:[],
  sourceGenerationRefs:allRefs.filter((x)=>!x.startsWith("CONTINUITY_RECEIPT_SHA256:")),
});
assert.equal(missingTyped.resultClassification,"EVIDENCE_INCOMPLETE");
assert.equal(missingTyped.zeroPickDisposition,"INPUT_INCOMPLETE");
assert.ok(missingTyped.notes.some((x)=>x.includes("CONTINUITY_RECEIPT_SHA256")));

const hiddenAudit=await buildNcT01HiddenFallbackAuditV0_1({
  runnerEntryPoint:"system2/runtime/nct01_artifact_runner_v0_1.mjs",
  runnerHeadSha:"a".repeat(40),
  auditedBlobIdentities:[
    {path:"system2/runtime/nct01_artifact_runner_v0_1.mjs",blobSha:"b".repeat(40)},
  ],
  perDimensionDisposition:{
    cachedSystem1SelectionUsed:"PROVEN_ABSENT",
    persistedSystem1SelectionUsed:"PRESENT",
    aliasReconstructionUsed:"PROVEN_ABSENT",
    crossProjectFallbackUsed:"PROVEN_ABSENT",
    staleSharedStateUsed:"PROVEN_ABSENT",
  },
  runtimeEvidence:{
    instrumented:true,
    sameExecutionCut:true,
    runtimeForbiddenAccessCount:1,
    runtimeEvidenceDigest:h("e"),
    typedEvidence:["PERSISTED_SYSTEM1_SELECTION_ACCESS"],
  },
  forbiddenSourceFamilyVersion:"S2-NCT01-FORBIDDEN-SOURCES-V0_1",
  auditGeneratedAt:"2026-10-07T07:30:30Z",
});
const hidden=await buildNcT01PhysicalIndependenceReceiptV0_1({
  ...base,
  receiptId:"NC-T01-TEST-HIDDEN",
  hiddenFallbackAuditEvidence:hiddenAudit,
  sourceGenerationRefs:[
    ...allRefs.filter((x)=>!x.startsWith("HIDDEN_FALLBACK_AUDIT_SHA256:")),
    "HIDDEN_FALLBACK_AUDIT_SHA256:"+hiddenAudit.auditDigest,
  ],
});
assert.equal(hidden.resultClassification,"HIDDEN_SYSTEM1_DEPENDENCY");
assert.equal(hidden.zeroPickDisposition,"DEPENDENCY_BLOCKED");

const runtimeFailure=await buildNcT01PhysicalIndependenceReceiptV0_1({
  ...base,
  receiptId:"NC-T01-TEST-RUNTIME",
  executionState:"RUNTIME_FAILURE",
  candidateGenerationExecutable:false,
  generatedCandidates:[],
});
assert.equal(runtimeFailure.resultClassification,"EVIDENCE_INCOMPLETE");
assert.equal(runtimeFailure.zeroPickDisposition,"RUNTIME_FAILURE");

await assert.rejects(
  ()=>buildNcT01PhysicalIndependenceReceiptV0_1({
    ...base,
    receiptId:"NC-T01-TEST-BAD-REF",
    sourceGenerationRefs:["PIT_REPLAY_SHA256:not-a-hash"],
  }),
  /typed digest format/,
);

const orchestration={
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  decisionTimestamp:"2026-10-07T07:30:00.000Z",
  a1BatchHash:h("a"),
  baseUniverseCount:2,
  eligibleCount:2,
  accountedCount:2,
  orchestrationHash:h("b"),
  perSymbolDiagnostics:[
    {
      symbol:"1101",
      state:"ACCOUNTED",
      replayState:"READY",
      replayHash:h("c"),
      continuityBindingState:"READY",
      continuityReceiptHash:h("d"),
      sourceHistoryHash:h("e"),
      continuityTransformHash:h("f"),
      continuityBlockerCodes:[],
      missingRequiredEvidenceCount:0,
      requiredEvidenceComplete:true,
      assessmentHash:h("6"),
      strategyValidity:"VALID",
      entryReadiness:"BUY_ELIGIBLE",
    },
    {
      symbol:"1213",
      state:"ACCOUNTED",
      replayState:"READY",
      replayHash:h("7"),
      continuityBindingState:"INCOMPLETE",
      continuityReceiptHash:null,
      sourceHistoryHash:h("8"),
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
    runReceipt:{
      runState:"COMPLETE",
      universeVersion:"A1-ORDINARY-EQUITY-V0.1",
    },
    factorRows:[
      {symbol:"1101",snapshot_hash:h("1")},
      {symbol:"1213",snapshot_hash:h("2")},
    ],
    decisionSnapshots:[
      {evaluation:{symbol:"1101",state:"QUALIFIED_NOT_SELECTED"}},
      {evaluation:{symbol:"1213",state:"INCOMPLETE"}},
    ],
    fingerprint:{shadowAccountingHash:h("3")},
    persistenceBatch:{batchHash:h("4")},
  },
};
const policy={
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  fingerprintHash:h("5"),
};

const assembled=await buildNcT01ReceiptFromOrchestrationV0_1({
  receiptId:"NC-T01-ASSEMBLED",
  orchestration,
  policyFingerprintReceipt:policy,
  sharedRawSourceRefs:["A1_TWSE_OFFICIAL","S2_D1_PIT_HISTORY"],
  hiddenFallbackAuditEvidence:cleanAudit,
  generatedAt:"2026-10-07T07:31:00Z",
});
assert.equal(assembled.requiredInputsState,"READY");
assert.equal(assembled.executionState,"EXECUTED");
assert.equal(assembled.candidateGenerationExecutable,true);
assert.equal(assembled.resultClassification,"PHYSICALLY_INDEPENDENT_PATH_OBSERVED");
assert.deepEqual(assembled.generatedCandidates,["1101"]);
assert.ok(assembled.candidateUniverseProvenance.includes("CONTINUITY_READY_WITNESS_COUNT:1"));
assert.ok(assembled.candidateUniverseProvenance.includes("SYMBOL_LOCAL_INCOMPLETE_COUNT:1"));
assert.ok(assembled.sourceGenerationRefs.includes("SYSTEM2_POLICY_FINGERPRINT_SHA256:"+h("5")));
assert.ok(assembled.sourceGenerationRefs.includes("PIT_REPLAY_SHA256:"+h("c")));
assert.ok(assembled.sourceGenerationRefs.includes("CONTINUITY_RECEIPT_SHA256:"+h("d")));
assert.ok(assembled.sourceGenerationRefs.includes("FACTOR_SNAPSHOT_SHA256:"+h("1")));
assert.ok(!assembled.sourceGenerationRefs.includes("CONTINUITY_RECEIPT_SHA256:"+h("7")));

const noWitness=await buildNcT01ReceiptFromOrchestrationV0_1({
  receiptId:"NC-T01-NO-WITNESS",
  orchestration:{
    ...orchestration,
    perSymbolDiagnostics:orchestration.perSymbolDiagnostics.map((x)=>({
      ...x,
      continuityBindingState:"INCOMPLETE",
      continuityReceiptHash:null,
      continuityTransformHash:null,
      continuityBlockerCodes:["CONTINUITY_RECEIPT_MISSING"],
      strategyValidity:"INCOMPLETE",
      entryReadiness:"BLOCKED",
    })),
    bundle:{
      ...orchestration.bundle,
      decisionSnapshots:orchestration.bundle.decisionSnapshots.map((x)=>({
        evaluation:{...x.evaluation,state:"INCOMPLETE"},
      })),
    },
  },
  policyFingerprintReceipt:policy,
  sharedRawSourceRefs:["A1_TWSE_OFFICIAL","S2_D1_PIT_HISTORY"],
  hiddenFallbackAuditEvidence:cleanAudit,
  generatedAt:"2026-10-07T07:31:00Z",
});
assert.equal(noWitness.requiredInputsState,"INCOMPLETE");
assert.equal(noWitness.executionState,"BLOCKED_INPUTS");
assert.equal(noWitness.candidateGenerationExecutable,false);
assert.equal(noWitness.resultClassification,"EVIDENCE_INCOMPLETE");
assert.equal(noWitness.zeroPickDisposition,"INPUT_INCOMPLETE");

const changed=await buildNcT01PhysicalIndependenceReceiptV0_1({
  ...base,
  receiptId:"NC-T01-TEST-CHANGED",
  sourceGenerationRefs:[
    ...allRefs.filter((x)=>!x.startsWith("PIT_REPLAY_SHA256:")),
    "PIT_REPLAY_SHA256:"+h("9"),
  ],
});
assert.notEqual(pass.receiptHash,changed.receiptHash);

async function cleanAuditForLedger(runtimeDigest,typedEvidence){
  return buildNcT01HiddenFallbackAuditV0_1({
    runnerEntryPoint:"system2/scripts/run_nct01_physical_artifact_readonly_v0_1.mjs",
    runnerHeadSha:"a".repeat(40),
    auditedBlobIdentities:[
      {path:"system2/runtime/nct01_runtime_guard_v0_1.mjs",blobSha:"b".repeat(40)},
      {path:"system2/scripts/run_nct01_physical_artifact_readonly_v0_1.mjs",blobSha:"c".repeat(40)},
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
      runtimeEvidenceDigest:runtimeDigest,
      typedEvidence,
    },
    forbiddenSourceFamilyVersion:"S2-NCT01-FORBIDDEN-SOURCES-V0_1",
    auditGeneratedAt:"2026-10-09T00:05:00.000Z",
  });
}

const ledgerAuditA=await cleanAuditForLedger(
  h("a"),
  ["NCT01_RUNTIME_GUARD_LEDGER_SHA256:"+h("a"),"D1_ALLOWED_READ_QUERY_COUNT:10"],
);
const ledgerAuditB=await cleanAuditForLedger(
  h("b"),
  ["NCT01_RUNTIME_GUARD_LEDGER_SHA256:"+h("b"),"D1_ALLOWED_READ_QUERY_COUNT:11"],
);
assert.equal(ledgerAuditA.runtimeEvidence.runtimeForbiddenAccessCount,0);
assert.equal(ledgerAuditB.runtimeEvidence.runtimeForbiddenAccessCount,0);
assert.notEqual(ledgerAuditA.auditDigest,ledgerAuditB.auditDigest);

function refsForAudit(audit){
  return allRefs.map((ref)=>
    ref.startsWith("HIDDEN_FALLBACK_AUDIT_SHA256:")
      ? "HIDDEN_FALLBACK_AUDIT_SHA256:"+audit.auditDigest
      : ref
  );
}
const ledgerReceiptA=await buildNcT01PhysicalIndependenceReceiptV0_1({
  ...base,
  receiptId:"NC-T01-LEDGER-LINEAGE",
  hiddenFallbackAuditEvidence:ledgerAuditA,
  sourceGenerationRefs:refsForAudit(ledgerAuditA),
});
const ledgerReceiptB=await buildNcT01PhysicalIndependenceReceiptV0_1({
  ...base,
  receiptId:"NC-T01-LEDGER-LINEAGE",
  hiddenFallbackAuditEvidence:ledgerAuditB,
  sourceGenerationRefs:refsForAudit(ledgerAuditB),
});
assert.equal(ledgerReceiptA.resultClassification,"PHYSICALLY_INDEPENDENT_PATH_OBSERVED");
assert.equal(ledgerReceiptB.resultClassification,"PHYSICALLY_INDEPENDENT_PATH_OBSERVED");
assert.notEqual(ledgerReceiptA.receiptHash,ledgerReceiptB.receiptHash);

console.log("System2 NC-T01 physical receipt v0.1 tests passed");
