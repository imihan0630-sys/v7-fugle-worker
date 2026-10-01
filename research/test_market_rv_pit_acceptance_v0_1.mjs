import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { sha256Hex } from "../system2/runtime/decision_archive.mjs";
import { buildMarketRvBundleV0_1 } from "../system2/runtime/market_rv_builder_v0_1.mjs";
import { auditMarketRvPitCandidateV0_1 } from "./market_rv_pit_acceptance_v0_1.mjs";

// SYNTHETIC weekday fixture for structural checks ONLY. It is deliberately
// NOT a verified TWSE calendar and NEVER qualifies as prospective evidence.
function syntheticWeekdays21() {
  const days=[];
  for(let d=new Date("2026-09-01T12:00:00Z"); d<=new Date("2026-10-01T12:00:00Z"); d.setUTCDate(d.getUTCDate()+1)){
    if(d.getUTCDay()>=1 && d.getUTCDay()<=5) days.push(d.toISOString().slice(0,10));
  }
  return days.slice(-21);
}
function historyFor(days,returns=null){
  let c=100;
  return days.map((date,i)=>{
    if(i>0)c*=1+(returns?returns[i-1]:(i%2?0.012:-0.006));
    return {date,close:c};
  });
}
async function fixture(returns=null){
  const days=syntheticWeekdays21(),history=historyFor(days,returns);
  const marketDate=days.at(-1);
  const decisionTimestamp=marketDate+"T14:00:00+08:00";
  const observedAt=marketDate+"T13:40:00+08:00";
  const capturedAt=marketDate+"T13:41:00+08:00";
  const availableAt=marketDate+"T13:35:00+08:00";
  const sourceReceipt={
    sourceId:"A2_TAIEX_CLOSE",sourceDate:marketDate,marketDate,decisionTimestamp,
    observedAt,availableAt,capturedAt,
    state:"READY",receiptRef:"SYNTH_A2_RECEIPT",rawPayloadHash:"a".repeat(64),
    historyWindowHash:await sha256Hex(history),
  };
  const calendarReceipt={
    sourceId:"TWSE_FMTQIK_MONTHLY_SESSION_CALENDAR",
    throughDate:marketDate,receiptRef:"SYNTH_CALENDAR_RECEIPT",
    rawPayloadHash:"b".repeat(64),
    officialSessionDates:days,sessionDatesHash:await sha256Hex(days),
    firstObservedAt:marketDate+"T13:30:00+08:00"
  };
  return {bundleId:"SYNTH|"+marketDate,marketDate,decisionTimestamp,history,
    observedAt,availableAt,capturedAt,sourceReceipt,calendarReceipt};
}
async function audit(changes={}) {
  const base=await fixture();
  return auditMarketRvPitCandidateV0_1({...base,...changes});
}
function blocked(result,code){
  assert.equal(result.structuralState,"UNKNOWN");
  assert(result.blockerCodes.includes(code),JSON.stringify(result.blockerCodes));
  assert(result.factorObservations.every(x=>x.state==="UNKNOWN"&&x.rawValue===null));
  assert.equal(result.promotionGradeProspectiveDateCount,0);
}
{
  const x=await audit();
  assert.equal(x.structuralState,"STRUCTURAL_PASS");
  assert.equal(x.blockerCodes.length,0);
  assert.equal(x.factorObservations.length,3);
  assert(x.factorObservations.every(x=>x.state==="KNOWN"));
  assert.equal(x.externalRawSourceAttestation,"REQUIRED_NOT_PROVEN_BY_THIS_PURE_FUNCTION");
  assert.equal(x.immutableWriteReadbackReplay,"NOT_PERFORMED");
  assert.equal(x.runFingerprintLinkage,"NOT_PERFORMED");
  assert.equal(x.promotionGradeProspectiveDateCount,0);
  assert.equal(x.acceptanceHash,(await audit()).acceptanceHash);
}
// First falsification of v0.1: a "READY" source observed and captured AFTER
// the decision passed the old availableAt-only guard. It must now be blocked.
{
  const b=await fixture();
  const observedAt=b.marketDate+"T14:01:00+08:00";
  const capturedAt=b.marketDate+"T14:02:00+08:00";
  const legacy=await buildMarketRvBundleV0_1({
    bundleId:b.bundleId,marketDate:b.marketDate,decisionTimestamp:b.decisionTimestamp,
    observedAt,availableAt:b.availableAt,capturedAt,
    sourceDate:b.marketDate,sourceReceiptRef:b.sourceReceipt.receiptRef,
    sourceReceiptState:"READY",sourcePointInTimeEligible:true,history:b.history
  });
  assert(legacy.factorObservations.every(x=>x.state==="KNOWN"),
    "Witness: previous unguarded builder wrongly accepted a post-decision observation");
  const fixed=await auditMarketRvPitCandidateV0_1({...b,observedAt,capturedAt,
    sourceReceipt:{...b.sourceReceipt,observedAt,capturedAt}});
  blocked(fixed,"CAPTURE_OBSERVED_AFTER_DECISION");
  assert(fixed.blockerCodes.includes("CAPTURE_CAPTURED_AFTER_DECISION"));
}
{
  const b=await fixture();
  const capturedAt=b.marketDate+"T14:01:00+08:00";
  blocked(await auditMarketRvPitCandidateV0_1({...b,capturedAt,
    sourceReceipt:{...b.sourceReceipt,capturedAt}}),"CAPTURE_CAPTURED_AFTER_DECISION");
}
{
  const b=await fixture();
  const availableAt=b.marketDate+"T13:50:00+08:00";
  blocked(await auditMarketRvPitCandidateV0_1({...b,availableAt,
    sourceReceipt:{...b.sourceReceipt,availableAt}}),"CAPTURE_AVAILABLE_AFTER_OBSERVED");
}
{
  const b=await fixture();
  const history=[{date:"2026-08-31",close:99},...b.history.slice(0,10),...b.history.slice(11)];
  // 21 unique rows, latest date equals target, but one official expected day missing.
  assert.equal(history.length,21);
  const sourceReceipt={...b.sourceReceipt,historyWindowHash:await sha256Hex(history)};
  blocked(await auditMarketRvPitCandidateV0_1({...b,history,sourceReceipt}),
    "OFFICIAL_21_SESSION_WINDOW_MISMATCH");
}
{
  const b=await fixture();
  blocked(await auditMarketRvPitCandidateV0_1({...b,calendarReceipt:null}),
    "MISSING_INDEPENDENT_CALENDAR_RECEIPT");
}
{
  const b=await fixture();
  blocked(await auditMarketRvPitCandidateV0_1({...b,sourceReceipt:{...b.sourceReceipt,
    historyWindowHash:"f".repeat(64)}}),"A2_RECEIPT_HISTORY_HASH_MISMATCH");
}
{
  const b=await fixture();
  blocked(await auditMarketRvPitCandidateV0_1({...b,calendarReceipt:{...b.calendarReceipt,
    firstObservedAt:b.marketDate+"T14:02:00+08:00"}}),
    "CALENDAR_RECEIPT_NOT_OBSERVED_BY_DECISION");
}
{
  const b=await fixture();
  blocked(await auditMarketRvPitCandidateV0_1({...b,calendarReceipt:{...b.calendarReceipt,
    sessionDatesHash:"e".repeat(64)}}),"CALENDAR_SESSION_HASH_MISMATCH");
}
{
  const b=await fixture();
  blocked(await auditMarketRvPitCandidateV0_1({...b,sourceReceipt:{...b.sourceReceipt,
    sourceDate:"2026-09-30"}}),"A2_SOURCE_RECEIPT_NOT_SAME_DATE_READY");
}
{
  const b=await fixture();
  const flat=await fixture(Array(20).fill(0));
  const result=await auditMarketRvPitCandidateV0_1({...b,history:flat.history,
    sourceReceipt:{...b.sourceReceipt,historyWindowHash:await sha256Hex(flat.history)}});
  assert.equal(result.factorObservations[0].rawValue,0);
  assert.equal(result.factorObservations[1].rawValue,0);
  assert.equal(result.factorObservations[2].state,"UNKNOWN");
  assert.equal(result.factorObservations[2].unknownReason,"RV20_ZERO_DENOMINATOR");
}
// Structural effect of overlapping 5/20 population dispersion:
// Var20=.25 Var5 + .75 Var15 + .1875 (mean5-mean15)^2.
function pvar(v){
  const m=v.reduce((a,b)=>a+b,0)/v.length;
  return v.reduce((s,x)=>s+(x-m)**2,0)/v.length;
}
{
  const prior15=Array.from({length:15},(_,i)=>0.001*(i%3-1));
  const recent5=[0.04,-0.02,0.03,-0.01,0.015];
  const all=[...prior15,...recent5];
  const m1=prior15.reduce((a,b)=>a+b,0)/15;
  const m2=recent5.reduce((a,b)=>a+b,0)/5;
  const decomposed=.75*pvar(prior15)+.25*pvar(recent5)+.1875*(m2-m1)**2;
  assert(Math.abs(decomposed-pvar(all))<1e-15);
  assert(Math.sqrt(pvar(recent5))/Math.sqrt(pvar(all))<=2+1e-14);
}
{
  const b=await fixture([...Array(15).fill(0),...Array(5).fill(0.03)]);
  const result=await auditMarketRvPitCandidateV0_1(b);
  assert.equal(result.structuralState,"STRUCTURAL_PASS");
  assert(Math.abs(result.factorObservations[0].rawValue)<1e-14);
  assert(result.factorObservations[1].rawValue>0);
  assert(result.factorObservations[2].rawValue<1e-10);
  // This signals near-zero recent dispersion DESPITE five successive +3% returns.
}
{
  const source=await readFile(new URL("./market_rv_pit_acceptance_v0_1.mjs",import.meta.url),"utf8");
  assert(!source.includes("fetch(")&&!source.includes(".prepare("));
  assert(!source.includes("scoreCandidate")&&!source.includes("env."));
}
console.log("D04 PIT receipt and rolling-dispersion falsification: PASS");
