import assert from "node:assert/strict";
import { buildShadowSourceSessionReceipt } from "../runtime/shadow_source_session_receipt.mjs";
import { buildShadowRunReceipt } from "../runtime/shadow_run_receipt.mjs";
import {
  buildShadowRunFingerprint,
  verifyShadowRunFingerprintV0_1,
} from "../runtime/shadow_run_fingerprint.mjs";

const marketDate="2026-09-27";
const decisionTimestamp="2026-09-27T07:30:00Z";
const capturedAt="2026-09-27T07:31:00Z";
const h=(c)=>c.repeat(64);

const sourceReady=await buildShadowSourceSessionReceipt({
  receiptId:"SRC-FP-1",
  marketDate,
  decisionTimestamp,
  expectedSources:[{sourceId:"FIXTURE",role:"REQUIRED"}],
  observedSources:[{
    sourceId:"FIXTURE",
    state:"KNOWN",
    sourceDate:marketDate,
    availableAt:"2026-09-27T07:20:00Z",
    capturedAt:"2026-09-27T07:20:00Z",
    pointInTimeEligible:true,
    payloadHash:h("a"),
  }],
  capturedAt:"2026-09-27T07:20:00Z",
});

const runComplete=buildShadowRunReceipt({
  runId:"RUN1",
  marketDate,
  decisionTimestamp,
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  shadowSpecId:"S2-SM-LS-001",
  universeVersion:"TW-EQUITY-V0",
  baseUniverseSymbols:["2330","2454"],
  excludedSymbols:[],
  eligibleUniverseSymbols:["2330","2454"],
  symbolAccounts:[
    {symbol:"2330",state:"WATCH",decisionId:"D1"},
    {symbol:"2454",state:"WATCH",decisionId:"D2"},
  ],
  capturedAt,
});

const first=await buildShadowRunFingerprint({
  fingerprintId:"FP1",
  marketDate,
  decisionTimestamp,
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  shadowSpecId:"S2-SM-LS-001",
  universeVersion:"TW-EQUITY-V0",
  sourceSessionReceipt:sourceReady,
  shadowRunReceipt:runComplete,
  decisionHashes:[h("2"),h("1")],
  orderingHashes:[h("3")],
  rankingExperimentHashes:[],
  capacityHash:h("4"),
  lifecycleHashes:[h("6"),h("5")],
  capturedAt,
});

const second=await buildShadowRunFingerprint({
  fingerprintId:"FP1",
  marketDate,
  decisionTimestamp,
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  shadowSpecId:"S2-SM-LS-001",
  universeVersion:"TW-EQUITY-V0",
  sourceSessionReceipt:sourceReady,
  shadowRunReceipt:runComplete,
  decisionHashes:[h("1"),h("2")],
  orderingHashes:[h("3")],
  rankingExperimentHashes:[],
  capacityHash:h("4"),
  lifecycleHashes:[h("5"),h("6")],
  capturedAt,
});

assert.equal(first.runFingerprintHash,second.runFingerprintHash);
assert.equal(first.runFingerprintState,"RUN_FINGERPRINT_COMPLETE");
assert.equal(first.outcomeJoinEligible,true);
assert.deepEqual(first.decisionHashes,[h("1"),h("2")]);

const zeroRun=buildShadowRunReceipt({
  runId:"RUN-ZERO",
  marketDate,
  decisionTimestamp,
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  shadowSpecId:"S2-SM-LS-001",
  universeVersion:"TW-EQUITY-V0",
  baseUniverseSymbols:[],
  excludedSymbols:[],
  eligibleUniverseSymbols:[],
  symbolAccounts:[],
  capturedAt,
});
const zeroFp=await buildShadowRunFingerprint({
  fingerprintId:"FP-ZERO",
  marketDate,
  decisionTimestamp,
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  shadowSpecId:"S2-SM-LS-001",
  universeVersion:"TW-EQUITY-V0",
  sourceSessionReceipt:sourceReady,
  shadowRunReceipt:zeroRun,
  decisionHashes:[],
  capturedAt,
});
assert.equal(zeroFp.outcomeJoinEligible,true);

const sourceIncomplete=await buildShadowSourceSessionReceipt({
  receiptId:"SRC-BAD",
  marketDate,
  decisionTimestamp,
  expectedSources:[{sourceId:"FIXTURE",role:"REQUIRED"}],
  observedSources:[],
  capturedAt:"2026-09-27T07:20:00Z",
});
const runIncomplete=buildShadowRunReceipt({
  runId:"RUN2",
  marketDate,
  decisionTimestamp,
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  shadowSpecId:"S2-SM-LS-001",
  universeVersion:"TW-EQUITY-V0",
  baseUniverseSymbols:["2330"],
  excludedSymbols:[],
  eligibleUniverseSymbols:["2330"],
  symbolAccounts:[],
  capturedAt,
});
const blocked=await buildShadowRunFingerprint({
  fingerprintId:"FP2",
  marketDate,
  decisionTimestamp,
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  shadowSpecId:"S2-SM-LS-001",
  universeVersion:"TW-EQUITY-V0",
  sourceSessionReceipt:sourceIncomplete,
  shadowRunReceipt:runIncomplete,
  decisionHashes:[],
  capturedAt,
});
assert.equal(blocked.runFingerprintState,"RUN_FINGERPRINT_INCOMPLETE");
assert.equal(blocked.outcomeJoinEligible,false);
assert.ok(blocked.blockers.includes("SOURCE_SESSION_INCOMPLETE"));
assert.ok(blocked.blockers.includes("SHADOW_RUN_ACCOUNTING_INCOMPLETE"));
assert.ok(blocked.blockers.includes("EMPTY_DECISION_HASHES_WITHOUT_PROVED_EMPTY_UNIVERSE"));

const tampered={...zeroFp,runFingerprintHash:h("f")};
const verified=await verifyShadowRunFingerprintV0_1({
  fingerprint:tampered,
  sourceSessionReceipt:sourceReady,
  shadowRunReceipt:zeroRun,
  decisionSnapshots:[],
});
assert.equal(verified.outcomeJoinEligible,false);
assert.ok(verified.blockers.includes("RUN_FINGERPRINT_HASH_MISMATCH"));

console.log("System2 Shadow run fingerprint tests passed");
