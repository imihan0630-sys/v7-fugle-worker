import test from "node:test";
import assert from "node:assert/strict";
import {inspectStrictPitSourceObservationV0_1 as audit}
 from "../runtime/pit_original_capture_asof_firewall_v0_1.mjs";
const capturedAt="2026-10-15T19:52:00.000Z";
const independentAuditAt="2026-10-15T19:54:35.094Z";
const oldCut="2026-10-15T15:45:00.000Z"; // owner actual 23:45 Taipei, source late
const newCut="2026-10-15T21:45:43.188Z"; // actual Oct16 preopen original evidence
const evaluatedAt="2026-10-15T22:00:00.000Z";
const SHA="a".repeat(64),sourceSHA="b".repeat(64),auditSHA="c".repeat(64),barSHA="d".repeat(64),rawSHA="e".repeat(64);
const sourceUrl="https://www.twse.com.tw/exchangeReport/MI_INDEX";
const witness={
 market:"TWSE",marketDate:"2026-10-15",
 originalRawResponseSha256:rawSHA,sourceReceiptHash:sourceSHA,
 independentAuditHash:auditSHA,sourceId:"A1_TWSE_MI_INDEX_HISTORICAL_DAILY",
 sourceUrl,originalCapturedAtUtc:capturedAt,independentlyAuditedAtUtc:independentAuditAt,
 originalNativeBytesRehashed:true,independentAuditVerdict:"ACCEPTED_SOURCE_INTEGRITY_ONLY",
 independentAuditSeparation:"INDEPENDENT_READBACK_PROCESS",
 strategyPitCertified:false,selectionAuthorized:false
};
const row={
 market:"TWSE",marketDate:"2026-10-15",symbol:"2330",priceSpace:"RAW",
 canonicalKey:"TWSE|2330|2026-10-15|RAW",
 sourceRowHash:SHA,barHash:barSHA,
 sourceId:witness.sourceId,sourceUrl,
 originalRawResponseSha256:rawSHA,
 availableAt:"2026-10-15T19:52:00.000Z",
 capturedAt,observedAt:capturedAt,
 availabilityBasis:"PROSPECTIVE_OBSERVATION",
 pitAvailabilityClass:"OBSERVED_AVAILABLE_UPPER_BOUND",
 pitReplayEligible:true,continuityState:"UNVERIFIED"
};
const check=(r=row,w=witness,cut=newCut)=>audit({
 marketDate:"2026-10-15",decisionCutAtUtc:cut,evaluatedAtUtc,
 bars:[r],sourceWitnesses:[w]
});
test("Positive physical-shaped original source observation after cutoff only; no strategy PIT",async()=>{
 const x=await check();
 assert.equal(x.observedByDecisionCutBarRows,1);
 assert.equal(x.blockedBarRows,0);
 assert.equal(x.state,"FULL_ROW_SOURCE_OBSERVATION_BY_CUT__STRATEGY_PIT_BLOCKED");
 assert.equal(x.admitted[0].earliestObservationalResearchUseAt,independentAuditAt);
 assert.equal(x.admitted[0].historicalBarPITCertified,false);
 assert.equal(x.historicalFirstKnownAtCertifiedCount,0);
 assert.equal(x.formalStrategyPitCertified,false);
 assert.equal(x.frozenSelectionAuthorized,false);
 assert.equal(x.shadowBacktestAuthorized,false);
 assert.equal(x.independentAuditLaneFinalSignoff,false);
 assert.match(x.receiptSha256,/^[0-9a-f]{64}$/);
});
test("Actual Oct15 23:45 owner cutoff was BEFORE original collector and audit; fake legacy availableAt cannot allow",async()=>{
 const old=await check({...row,availableAt:"2026-10-15T05:30:00.000Z"},witness,oldCut);
 assert.equal(old.observedByDecisionCutBarRows,0);
 assert.ok(old.blocked[0].reasonCodes.includes("PROVIDER_OR_AUDIT_ARRIVED_AFTER_DECISION_CUT"));
 assert.ok(old.blocked[0].reasonCodes.includes("BAR_CAPTURE_AFTER_DECISION_CUT"));
 assert.equal(old.formalStrategyPitCertified,false);
});
for(const [name,bar,source] of [
 ["Old market close inference unqualified",{...row,availableAt:"2026-10-15T05:30:00.000Z",availabilityBasis:"SESSION_CLOSE_FINALITY"},witness],
 ["Conservative session finality prohibited",{...row,pitAvailabilityClass:"CONSERVATIVE_SESSION_FINALITY"},witness],
 ["Legacy PIT self flag not sufficient",{...row,pitReplayEligible:false},witness],
 ["Missing original capture",{...row,capturedAt:null},witness],
 ["Missing independent audit witness",row,null],
 ["Changed source URL",{...row,sourceUrl:"https://unknown.example"},witness],
 ["Changed original source SHA",{...row,originalRawResponseSha256:"f".repeat(64)},witness],
 ["Spoof future bar capture",{...row,capturedAt:"2026-10-16T00:00:00.000Z"},witness],
 ["Spoof future observedAt",{...row,observedAt:"2026-10-16T00:00:00.000Z"},witness],
 ["Late source original witness",row,{...witness,originalCapturedAtUtc:"2026-10-16T00:00:00.000Z",independentlyAuditedAtUtc:"2026-10-16T00:01:00.000Z"}],
 ["Late separate auditor",row,{...witness,independentlyAuditedAtUtc:"2026-10-16T00:00:00.000Z"}],
 ["Self signed legacy market date",row,{...witness,marketDate:"2026-10-14"}]
]){
 test("fail-closed scoped eligibility "+name,async()=>{
  const a=await audit({marketDate:"2026-10-15",decisionCutAtUtc:newCut,
    evaluatedAtUtc,bars:[bar],sourceWitnesses:source?[source]:[]});
  assert.equal(a.observedByDecisionCutBarRows,0);
  assert.equal(a.blockedBarRows,1);
  assert.equal(a.formalStrategyPitCertified,false);
 });
}
for(const [name,mutate] of [
 ["forged source rehash",x=>{x.originalNativeBytesRehashed=false}],
 ["forged source/audit order",x=>{x.independentlyAuditedAtUtc="2026-10-15T19:40:00.000Z"}],
 ["source claims strategy certified",x=>{x.strategyPitCertified=true}],
 ["source claims selection",x=>{x.selectionAuthorized=true}],
 ["unseparated source auditor",x=>{x.independentAuditSeparation="SAME_PROCESS"}],
 ["source URI not https",x=>{x.sourceUrl="http://example.org/"}],
 ["source checksum invalid",x=>{x.sourceReceiptHash="checksum"}],
 ["audit verdict not accepted",x=>{x.independentAuditVerdict="UNKNOWN"}]
]){
 test("reject invalid external audit witness "+name,async()=>{
  const x={...witness};mutate(x);
  await assert.rejects(check(row,x),/S2_STRICT_PIT_ASOF_SOURCE_WITNESS_UNTRUSTED/);
 });
}
test("invalid future decision cut hard error",async()=>{
 await assert.rejects(audit({
  marketDate:"2026-10-15",decisionCutAtUtc:"2026-10-16T10:00:00.000Z",
  evaluatedAtUtc,bars:[row],sourceWitnesses:[witness]}),/S2_STRICT_PIT_ASOF_INVALID_INPUT/);
});
test("bad canonical identity hard error",async()=>{
 await assert.rejects(check({...row,canonicalKey:"TWSE|2331|2026-10-15|RAW"}),/BAR_IDENTITY_UNTRUSTED/);
});
test("duplicate source receipt hard error",async()=>{
 await assert.rejects(audit({marketDate:"2026-10-15",decisionCutAtUtc:newCut,
  evaluatedAtUtc,bars:[row],sourceWitnesses:[witness,witness]}),/SOURCE_WITNESS_DUPLICATE/);
});
test("duplicate exact row version hard error",async()=>{
 await assert.rejects(audit({marketDate:"2026-10-15",decisionCutAtUtc:newCut,
  evaluatedAtUtc,bars:[row,row],sourceWitnesses:[witness]}),/BAR_DUPLICATE_VERSION/);
});
test("current native preopen 122/122 evidence is NOT proof of 61-session CFI/CA strategy PIT",async()=>{
 const x=await check();
 assert.equal(x.all61SessionCorporateActionAndSuspensionEvidenceCertified,false);
 assert.equal(x.historicalOrdinaryShareNativeCFIVersionWindowCertified,false);
 assert.equal(x.historicalFullRevisionCoverageCertified,false);
 assert.equal(x.historicalFirstKnownAtCertifiedCount,0);
 assert.equal(x.system1FormalCoreModified,false);
 assert.equal(x.cloudflareD1Writes,0);
});
