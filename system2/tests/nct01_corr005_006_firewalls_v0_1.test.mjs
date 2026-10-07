import assert from "node:assert/strict";
import {
  buildNcT01HiddenFallbackAuditV0_1,
  validateNcT01HiddenFallbackAuditV0_1,
} from "../runtime/nct01_hidden_fallback_audit_v0_1.mjs";
import {
  buildNcT01PhysicalIndependenceReceiptV0_1,
  buildNcT01ReceiptFromOrchestrationV0_1,
  nct01RequiredPassRefTypesV0_1,
} from "../runtime/nct01_physical_receipt_v0_1.mjs";

const h=(c)=>String(c).repeat(64);
const s40=(c)=>String(c).repeat(40);

function dimensionSet(overrides={}) {
  return {
    cachedSystem1SelectionUsed:"PROVEN_ABSENT",
    persistedSystem1SelectionUsed:"PROVEN_ABSENT",
    aliasReconstructionUsed:"PROVEN_ABSENT",
    crossProjectFallbackUsed:"PROVEN_ABSENT",
    staleSharedStateUsed:"PROVEN_ABSENT",
    ...overrides,
  };
}

async function audit({
  blob="b",
  dimensions=dimensionSet(),
  runtime=true,
  runtimeCount=0,
  runtimeDigest="c",
}={}) {
  return buildNcT01HiddenFallbackAuditV0_1({
    runnerEntryPoint:"system2/runtime/nct01_artifact_runner_v0_1.mjs",
    runnerHeadSha:s40("a"),
    auditedBlobIdentities:[
      {path:"system2/runtime/nct01_artifact_runner_v0_1.mjs",blobSha:s40(blob)},
      {path:"system2/runtime/nct01_physical_receipt_v0_1.mjs",blobSha:s40("d")},
    ],
    perDimensionDisposition:dimensions,
    runtimeEvidence:runtime ? {
      instrumented:true,
      sameExecutionCut:true,
      runtimeForbiddenAccessCount:runtimeCount,
      runtimeEvidenceDigest:h(runtimeDigest),
      typedEvidence:runtimeCount ? ["FORBIDDEN_ACCESS_OBSERVED"] : ["NO_FORBIDDEN_SYSTEM1_ACCESS"],
    } : {
      instrumented:false,
      sameExecutionCut:false,
      typedEvidence:[],
    },
    forbiddenSourceFamilyVersion:"S2-NCT01-FORBIDDEN-SOURCES-V0_1",
    auditGeneratedAt:"2026-10-08T00:10:00Z",
  });
}

function refsFor(auditEvidence) {
  return nct01RequiredPassRefTypesV0_1().map((type,index)=>
    type==="HIDDEN_FALLBACK_AUDIT_SHA256"
      ? type+":"+auditEvidence.auditDigest
      : type+":"+h(String((index%9)+1))
  );
}

const clean=await audit();
const cleanView=await validateNcT01HiddenFallbackAuditV0_1(clean);
assert.equal(cleanView.auditState,"CLEAN_PROVEN_ABSENT");
assert.equal(cleanView.auditIntegrityValid,true);
assert.equal(cleanView.reauditRequired,false);

const directBase={
  receiptId:"CORR005-DIRECT",
  decisionAt:"2026-10-08T00:00:00Z",
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  hiddenFallbackAuditEvidence:clean,
  sharedRawSourceRefs:["A1","PIT"],
  candidateUniverseProvenance:["UNIVERSE_VERSION:TEST"],
  requiredInputsState:"READY",
  executionState:"EXECUTED",
  candidateGenerationExecutable:true,
  generatedCandidates:[],
  sourceGenerationRefs:refsFor(clean),
  generatedAt:"2026-10-08T00:11:00Z",
};

const directPass=await buildNcT01PhysicalIndependenceReceiptV0_1(directBase);
assert.equal(directPass.resultClassification,"PHYSICALLY_INDEPENDENT_PATH_OBSERVED");
assert.equal(directPass.zeroPickDisposition,"LEGITIMATE_ZERO_PICK");

const omitted=await buildNcT01PhysicalIndependenceReceiptV0_1({
  ...directBase,
  receiptId:"CORR005-OMITTED",
  hiddenFallbackAuditEvidence:null,
  sourceGenerationRefs:refsFor(clean).filter((x)=>!x.startsWith("HIDDEN_FALLBACK_AUDIT_SHA256:")),
});
assert.equal(omitted.resultClassification,"EVIDENCE_INCOMPLETE");
assert.equal(omitted.zeroPickDisposition,"DEPENDENCY_BLOCKED");

const unknownAudit=await audit({
  dimensions:dimensionSet({staleSharedStateUsed:"UNKNOWN"}),
});
const unknown=await buildNcT01PhysicalIndependenceReceiptV0_1({
  ...directBase,
  receiptId:"CORR005-UNKNOWN",
  hiddenFallbackAuditEvidence:unknownAudit,
  sourceGenerationRefs:refsFor(unknownAudit),
});
assert.equal(unknown.resultClassification,"EVIDENCE_INCOMPLETE");

const noRuntime=await audit({runtime:false});
const runtimeMissing=await buildNcT01PhysicalIndependenceReceiptV0_1({
  ...directBase,
  receiptId:"CORR005-NO-RUNTIME",
  hiddenFallbackAuditEvidence:noRuntime,
  sourceGenerationRefs:refsFor(noRuntime),
});
assert.equal(runtimeMissing.resultClassification,"EVIDENCE_INCOMPLETE");

const presentAudit=await audit({
  dimensions:dimensionSet({persistedSystem1SelectionUsed:"PRESENT"}),
  runtimeCount:1,
});
const present=await buildNcT01PhysicalIndependenceReceiptV0_1({
  ...directBase,
  receiptId:"CORR005-PRESENT",
  hiddenFallbackAuditEvidence:presentAudit,
  sourceGenerationRefs:refsFor(presentAudit),
});
assert.equal(present.resultClassification,"HIDDEN_SYSTEM1_DEPENDENCY");
assert.equal(present.zeroPickDisposition,"DEPENDENCY_BLOCKED");

const missingDigest={...clean};
delete missingDigest.auditDigest;
const noDigest=await buildNcT01PhysicalIndependenceReceiptV0_1({
  ...directBase,
  receiptId:"CORR005-NO-DIGEST",
  hiddenFallbackAuditEvidence:missingDigest,
  sourceGenerationRefs:refsFor(clean).filter((x)=>!x.startsWith("HIDDEN_FALLBACK_AUDIT_SHA256:")),
});
assert.equal(noDigest.resultClassification,"EVIDENCE_INCOMPLETE");
assert.ok(noDigest.notes.includes("HIDDEN_FALLBACK_AUDIT_REAUDIT_REQUIRED"));

const drifted={
  ...clean,
  auditedBlobIdentities:clean.auditedBlobIdentities.map((row,index)=>
    index===0 ? {...row,blobSha:s40("e")} : row
  ),
};
const drift=await buildNcT01PhysicalIndependenceReceiptV0_1({
  ...directBase,
  receiptId:"CORR005-DRIFT",
  hiddenFallbackAuditEvidence:drifted,
  sourceGenerationRefs:refsFor(clean),
});
assert.equal(drift.resultClassification,"EVIDENCE_INCOMPLETE");
assert.ok(drift.notes.includes("HIDDEN_FALLBACK_AUDIT_REAUDIT_REQUIRED"));

const mismatchedDigest=await buildNcT01PhysicalIndependenceReceiptV0_1({
  ...directBase,
  receiptId:"CORR005-DIGEST-MISMATCH",
  sourceGenerationRefs:[
    ...refsFor(clean).filter((x)=>!x.startsWith("HIDDEN_FALLBACK_AUDIT_SHA256:")),
    "HIDDEN_FALLBACK_AUDIT_SHA256:"+h("9"),
  ],
});
assert.equal(mismatchedDigest.resultClassification,"EVIDENCE_INCOMPLETE");
assert.ok(mismatchedDigest.notes.some((x)=>x.includes("HIDDEN_FALLBACK_AUDIT_SHA256_MISMATCH")));

function diag(symbol,{
  continuityReady=true,
  requiredEvidenceComplete=true,
  missingRequiredEvidenceCount=0,
  strategyValidity="VALID",
  assessmentHash=h("4"),
}={}) {
  return {
    symbol,
    state:"ACCOUNTED",
    replayState:"READY",
    replayHash:h(symbol==="1101"?"1":"2"),
    continuityBindingState:continuityReady?"READY":"INCOMPLETE",
    continuityReceiptHash:continuityReady?h(symbol==="1101"?"3":"4"):null,
    sourceHistoryHash:h(symbol==="1101"?"5":"6"),
    continuityTransformHash:continuityReady?h(symbol==="1101"?"7":"8"):null,
    continuityBlockerCodes:continuityReady?[]:["CONTINUITY_RECEIPT_MISSING"],
    factorBundleHash:h("9"),
    assessmentHash,
    missingRequiredEvidenceCount,
    requiredEvidenceComplete,
    strategyValidity,
    entryReadiness:strategyValidity==="VALID"?"WATCH":"BLOCKED",
  };
}

function orchestration(rows,decisionStates={}) {
  return {
    strategyId:"SHORT_MOMENTUM",
    strategyVersion:"V0.1-CONTRACT",
    decisionTimestamp:"2026-10-08T00:00:00.000Z",
    a1BatchHash:h("a"),
    baseUniverseCount:rows.length,
    eligibleCount:rows.length,
    accountedCount:rows.length,
    orchestrationHash:h("b"),
    perSymbolDiagnostics:rows,
    bundle:{
      runReceipt:{runState:"COMPLETE",universeVersion:"A1-ORDINARY-EQUITY-V0.1"},
      factorRows:rows.map((row,index)=>({symbol:row.symbol,snapshot_hash:h(String((index%8)+1))})),
      decisionSnapshots:rows.map((row)=>({
        evaluation:{
          symbol:row.symbol,
          state:decisionStates[row.symbol]||"INCOMPLETE",
        },
      })),
      fingerprint:{shadowAccountingHash:h("c")},
      persistenceBatch:{batchHash:h("d")},
    },
  };
}

const policy={
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  fingerprintHash:h("e"),
};

async function assemble(id,rows,decisionStates={}) {
  return buildNcT01ReceiptFromOrchestrationV0_1({
    receiptId:id,
    orchestration:orchestration(rows,decisionStates),
    policyFingerprintReceipt:policy,
    sharedRawSourceRefs:["A1","PIT"],
    hiddenFallbackAuditEvidence:clean,
    generatedAt:"2026-10-08T00:11:00Z",
  });
}

const w0Only=await assemble("CORR006-W0-ONLY",[
  diag("1101",{requiredEvidenceComplete:false,missingRequiredEvidenceCount:1,strategyValidity:"INCOMPLETE"}),
]);
assert.equal(w0Only.requiredInputsState,"INCOMPLETE");
assert.equal(w0Only.executionState,"BLOCKED_INPUTS");
assert.equal(w0Only.candidateGenerationExecutable,false);
assert.equal(w0Only.zeroPickDisposition,"INPUT_INCOMPLETE");
assert.ok(w0Only.candidateUniverseProvenance.includes("CONTINUITY_READY_WITNESS_COUNT:1"));
assert.ok(w0Only.candidateUniverseProvenance.includes("STRATEGY_EXECUTABLE_WITNESS_COUNT:0"));

const invalidatedMissing=await assemble("CORR006-INVALIDATED-MISSING",[
  diag("1101",{requiredEvidenceComplete:false,missingRequiredEvidenceCount:1,strategyValidity:"INVALIDATED"}),
]);
assert.equal(invalidatedMissing.executionState,"BLOCKED_INPUTS");
assert.ok(invalidatedMissing.candidateUniverseProvenance.includes("STRATEGY_EXECUTABLE_WITNESS_COUNT:0"));

const weakeningComplete=await assemble("CORR006-WEAKENING",[
  diag("1101",{requiredEvidenceComplete:true,missingRequiredEvidenceCount:0,strategyValidity:"WEAKENING"}),
]);
assert.equal(weakeningComplete.executionState,"EXECUTED");
assert.equal(weakeningComplete.zeroPickDisposition,"LEGITIMATE_ZERO_PICK");
assert.ok(weakeningComplete.candidateUniverseProvenance.includes("STRATEGY_EXECUTABLE_WEAKENING_COUNT:1"));

const invalidatedComplete=await assemble("CORR006-INVALIDATED",[
  diag("1101",{requiredEvidenceComplete:true,missingRequiredEvidenceCount:0,strategyValidity:"INVALIDATED"}),
]);
assert.equal(invalidatedComplete.executionState,"EXECUTED");
assert.ok(invalidatedComplete.candidateUniverseProvenance.includes("STRATEGY_EXECUTABLE_INVALIDATED_COUNT:1"));

const mixed=await assemble("CORR006-MIXED",[
  diag("1101",{requiredEvidenceComplete:false,missingRequiredEvidenceCount:1,strategyValidity:"INCOMPLETE"}),
  diag("1213",{requiredEvidenceComplete:true,missingRequiredEvidenceCount:0,strategyValidity:"VALID",assessmentHash:h("5")}),
],{"1213":"QUALIFIED_NOT_SELECTED"});
assert.equal(mixed.executionState,"EXECUTED");
assert.deepEqual(mixed.generatedCandidates,["1213"]);
assert.ok(mixed.candidateUniverseProvenance.includes("CONTINUITY_READY_WITNESS_COUNT:2"));
assert.ok(mixed.candidateUniverseProvenance.includes("STRATEGY_EXECUTABLE_WITNESS_COUNT:1"));

const cleanChanged=await audit({blob:"f"});
const hashBefore=await buildNcT01PhysicalIndependenceReceiptV0_1(directBase);
const hashAfter=await buildNcT01PhysicalIndependenceReceiptV0_1({
  ...directBase,
  receiptId:directBase.receiptId,
  hiddenFallbackAuditEvidence:cleanChanged,
  sourceGenerationRefs:refsFor(cleanChanged),
});
assert.notEqual(clean.auditDigest,cleanChanged.auditDigest);
assert.notEqual(hashBefore.receiptHash,hashAfter.receiptHash);

const w1Before=await assemble("CORR006-W1-HASH",[
  diag("1101",{requiredEvidenceComplete:true,missingRequiredEvidenceCount:0,strategyValidity:"VALID"}),
]);
const w1After=await assemble("CORR006-W1-HASH",[
  diag("1101",{requiredEvidenceComplete:false,missingRequiredEvidenceCount:1,strategyValidity:"INCOMPLETE"}),
]);
assert.notEqual(w1Before.receiptHash,w1After.receiptHash);

console.log("System2 CORR-005/006 NC-T01 firewalls v0.1 tests passed");
