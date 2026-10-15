import test from "node:test";
import assert from "node:assert/strict";
import {MOPS_REVISION_CONTROLS_V0_2} from "../runtime/mops_revision_control_matrix_v0_2.mjs";
import {buildHistoricalMopsSourceClockLedgerV0_1}
 from "../migration/mops_historical_source_clock_pit_ledger_v0_1.mjs";

const sourceUrl="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const capturedAtUtc="2026-10-15T12:26:00.000Z";
const sha="a".repeat(64);
function exampleRow(control,correction=false){
 const d=control.expectedDate||
  "2026-"+String(control.month).padStart(2,"0")+"-10";
 const clock=correction?"11:02:04":"10:01:02";
 return {
  date:d,time:clock,seqNo:correction?"2":"1",
  spokeDateRaw:d.replaceAll("-",""),spokeTimeRaw:clock.replaceAll(":",""),
  correctionOrCancellationHint:correction||control.mode==="CANCELLATION_ROW",
  rowText:control.mode==="CANCELLATION_ROW"?"公告核准撤銷現金增資":
    correction?"公告歷史更正":"公告歷史原始版本"
 };
}
function fixture(){
 return MOPS_REVISION_CONTROLS_V0_2.map(c=>({
  controlId:c.id,capturedAtUtc,originalResponseSha256:sha,sourceUrl,
  rows:c.mode==="CANCELLATION_ROW"?[exampleRow(c)]:[exampleRow(c),exampleRow(c,true)]
 }));
}
const orig=fixture();
const valid=buildHistoricalMopsSourceClockLedgerV0_1({captures:orig});
test("all five original and correction/cancellation source clocks parsed but no old PIT fabricated",()=>{
 assert.equal(valid.coveredHistoricalSourceClockControls,5);
 assert.equal(valid.coveredHistoricalSourceClockVersions,9);
 assert.equal(valid.sourceReportedClockValidatedCount,9);
 assert.equal(valid.historicalExactFirstKnownAtProvenCount,0);
 assert.equal(valid.historicalPITCertifiedCount,0);
 assert.equal(valid.originalPublicationLatencyCertified,false);
 assert.equal(valid.useSourceClockAsHistoricalAvailableAtAuthorized,false);
 assert.equal(valid.decisionAtBeforeRetrospectiveCapturePermitted,false);
 assert.equal(valid.cloudflareD1Writes,0);
 assert.equal(valid.cloudflareD1Queries,0);
 assert.equal(valid.system1FormalTouched,false);
 assert.match(valid.ledgerSha256,/^[0-9a-f]{64}$/);
 for(const row of valid.versions){
  assert.equal(row.firstKnownAt,null);
  assert.equal(row.availableAt,null);
  assert.equal(row.firstObservedAtConservativeUpperBoundUtc,capturedAtUtc);
  assert.equal(row.historicalDecisionPITAdmissible,false);
  assert.equal(row.asOfBeforeCaptureEligible,false);
  assert.equal(row.originalPublicationLatencyCertified,false);
 }
});
for(const [name,mutate] of [
 ["missing control",c=>{c.pop()}],
 ["duplicated control",c=>{c[1].controlId=c[0].controlId}],
 ["unknown extra control",c=>{c[0].controlId="UNKNOWN"}],
 ["untrusted source URL",c=>{c[0].sourceUrl="https://not-mops.example/"}],
 ["raw response SHA absent",c=>{c[0].originalResponseSha256="unverified"}],
 ["fabricated capture clock",c=>{c[0].capturedAtUtc="2026-05-99"}],
 ["backdated capturedAt before announcement",c=>{c[0].capturedAtUtc="2026-01-01T00:00:00Z"}],
 ["missing original correction",c=>{c[0].rows.pop()}],
 ["duplicate version key",c=>{c[0].rows[1]={...c[0].rows[0],correctionOrCancellationHint:true,rowText:"更正"}}],
 ["visible vs hidden source clock mismatch",c=>{c[0].rows[0].spokeTimeRaw="100103"}],
 ["illegal ROC source clock day",c=>{c[0].rows[0].spokeDateRaw="20260230"}],
 ["source clock of future year",c=>{
    c[0].rows[0].date="2027-05-22";c[0].rows[0].spokeDateRaw="20270522";
  }],
 ["cancellation cannot be inferred",c=>{c[4].rows[0].rowText="公告例行訊息"}],
 ["unbounded unexpected rows",c=>{c[0].rows=Array.from({length:101},()=>exampleRow(MOPS_REVISION_CONTROLS_V0_2[0]))}]
]){
 test("fail closed: "+name,()=>{
  const copy=structuredClone(orig);mutate(copy);
  assert.throws(()=>buildHistoricalMopsSourceClockLedgerV0_1({captures:copy}),/S2_HISTORICAL_MOPS_PIT_/);
 });
}
test("capture re-observation changes receipt but not source-reported clock or first-known status",()=>{
 const v=structuredClone(orig);v.forEach(x=>x.capturedAtUtc="2026-10-16T12:26:00.000Z");
 const again=buildHistoricalMopsSourceClockLedgerV0_1({captures:v});
 assert.notEqual(valid.ledgerSha256,again.ledgerSha256);
 assert.deepEqual(valid.versions.map(x=>x.sourceReportedAt),again.versions.map(x=>x.sourceReportedAt));
 assert.equal(again.historicalPITCertifiedCount,0);
});
