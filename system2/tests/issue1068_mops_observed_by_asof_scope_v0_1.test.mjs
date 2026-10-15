import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {admitOriginalMopsSourceObservationByCutV0_1,ORIGINAL}
 from "../migration/issue1068_mops_observed_by_asof_scope_v0_1.mjs";
const native=process.env.S2_ORIGINAL_MOPS_LEDGER_PATH;
if(!native)throw Error("S2_ISSUE1068_MOPS_TEST_ORIGINAL_ARTIFACT_REQUIRED");
const bytes=readFileSync(native);
const asof="2026-10-15T15:00:00.000Z",at="2026-10-15T15:10:00.000Z";
const call=(body=bytes,decisionCutAtUtc=asof,actualEvaluationAtUtc=at)=>
  admitOriginalMopsSourceObservationByCutV0_1({innerBytes:body,decisionCutAtUtc,actualEvaluationAtUtc});
test("REAL pinned original MOPS actual retrospective observation: 9/9 only AFTER Oct15 capture",()=>{
 const x=call();
 assert.equal(x.sourceArtifactId,11972825813);
 assert.equal(x.sourceRunId,38735146839);
 assert.equal(x.status,"SOURCE_OBSERVATION_BY_REAL_PAST_CUTOFF_9_OF_9_PASS__HISTORICAL_PIT_ZERO");
 assert.equal(x.sourceVersionsValidated,9);
 assert.equal(x.sourceVersionObservedByDecisionCut,9);
 assert.equal(x.sourceVersionNotYetObservedAtCut,0);
 assert.equal(x.historicalFirstKnownAtOrAvailableAtCertifiedCount,0);
 assert.equal(x.historicalMayJuly2026DecisionPITAccepted,false);
 assert.equal(x.independentAuditLaneSignoff,false);
 assert.equal(x.auditedStrategyPIT,false);
 assert.equal(x.finalSelectionAuthorized,false);
 assert.equal(x.historicalBacktestAuthorized,false);
 assert.equal(x.durableFrozenAllowed,false);
 assert.equal(x.cloudflareD1Writes,0);
 for(const v of x.versionAttestations){
  assert.equal(v.observedByDecisionCut,true);
  assert.match(v.sourceRowEvidenceSha256,/^[a-f0-9]{64}$/);
  assert.equal(v.originalHistoricalFirstKnownAt,null);
  assert.equal(v.originalHistoricalAvailableAt,null);
  assert.equal(v.historicPITCertified,false);
  assert.equal(v.strategyOrTradingEligible,false);
 }
});
test("PIT before May original source-reported clock: zero, never retrospective backdate",()=>{
 const v=call(bytes,"2026-05-22T09:00:00.000Z",at);
 assert.equal(v.sourceVersionObservedByDecisionCut,0);
 assert.equal(v.sourceVersionNotYetObservedAtCut,9);
 assert.equal(v.historicalMayJuly2026DecisionPITAccepted,false);
});
test("Oct15 capture boundary is physical: 2467 first observed at 12:30:35.791Z",()=>{
 const notYet=call(bytes,"2026-10-15T12:30:35.790Z",at);
 assert.equal(notYet.sourceVersionObservedByDecisionCut,0);
 const exactly=call(bytes,"2026-10-15T12:30:35.791Z",at);
 assert.equal(exactly.sourceVersionObservedByDecisionCut,2);
 assert.equal(exactly.sourceVersionNotYetObservedAtCut,7);
 const afterAll=call(bytes,"2026-10-15T12:30:48.746Z",at);
 assert.equal(afterAll.sourceVersionObservedByDecisionCut,9);
});
test("source-producer original native byte SHA and canonical ledger SHA are both fixed",()=>{
 assert.equal(ORIGINAL.originalInnerJsonSha256,
  "9f766158637a3e61e5a8a9399546fe533f24b033079561bf495a03daebea57a9");
 assert.equal(ORIGINAL.originalLedgerSha256,
  "776baeb5f5b151baeb08503db3caeac3151bd6e1ba9b2ce5485b0540ba998064");
 assert.equal(ORIGINAL.originalHistoricalPITAcceptedCount,0);
});
for(const [name,fn] of [
 ["alter original source row",b=>{const v=JSON.parse(b);v.versions[0].sourceRowEvidenceSha256="f".repeat(64);return Buffer.from(JSON.stringify(v))}],
 ["forge historical availableAt",b=>{const v=JSON.parse(b);v.versions[0].availableAt="2026-03-09T17:39:30+08:00";return Buffer.from(JSON.stringify(v))}],
 ["forge original firstKnownAt",b=>{const v=JSON.parse(b);v.versions[0].firstKnownAt="2026-03-09T17:39:30+08:00";return Buffer.from(JSON.stringify(v))}],
 ["drop historical original version",b=>{const v=JSON.parse(b);v.versions.pop();return Buffer.from(JSON.stringify(v))}],
 ["forge false PIT ledger",b=>{const v=JSON.parse(b);v.historicalPITCertifiedCount=9;return Buffer.from(JSON.stringify(v))}],
 ["change capture before original",b=>{const v=JSON.parse(b);v.versions[0].retrospectiveCapturedAtUtc="2026-03-01T00:00:00Z";return Buffer.from(JSON.stringify(v))}],
 ["tamper provider response SHA",b=>{const v=JSON.parse(b);v.versions[0].originalResponseSha256="f".repeat(64);return Buffer.from(JSON.stringify(v))}],
 ["append bytes to original native",b=>Buffer.concat([b,Buffer.from(" \n")])],
 ["empty provider",()=>Buffer.from("")],
 ["non-JSON provider",()=>Buffer.from("{garbage")]
]){
 test("no fabricated vintage PIT: "+name,()=>{
  assert.throws(()=>call(fn(bytes.toString("utf8"))),/S2_ISSUE1068_MOPS_ASOF_/);
 });
}
test("future decision cutoff forbidden",()=>{
 assert.throws(()=>call(bytes,"2026-10-16T01:00:00.000Z",at),/FUTURE_OR_INVALID_DECISION_CUT/);
});
test("invalid decision timezone forbidden",()=>{
 assert.throws(()=>call(bytes,"2026-10-15T23:00:00+08:00",at),/FUTURE_OR_INVALID_DECISION_CUT/);
});
test("invalid actual execution time forbidden",()=>{
 assert.throws(()=>call(bytes,asof,"no-utc"),/FUTURE_OR_INVALID_DECISION_CUT/);
});
