import test from "node:test";
import assert from "node:assert/strict";
import {sha256Hex} from "../runtime/decision_archive.mjs";
import {official61SessionSourceReceiptHashBaseV0_1} from "../runtime/source_first_official_61_session_collector_v0_1.mjs";
import {captureM09ProspectiveSixCaNoWatchV0_1 as run}
 from "../scripts/capture_m09_prospective_six_ca_no_watch_v0_1.mjs";
const originalMarketDate="2026-10-15";
function calendar(){
 const dates=[];
 const t=Date.parse(originalMarketDate+"T00:00:00Z");
 for(let i=60;i>=0;i--)dates.push(new Date(t-i*86400000).toISOString().slice(0,10));
 return dates;
}
async function signedAudit(base){return {...base,auditHash:await sha256Hex(base)}}
async function originals(){
 const days=calendar();
 const source={
  schemaVersion:"S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1",
  marketDate:originalMarketDate,calendar:{tradingDates:days},
  state:"SOURCE_OBSERVED_UNAUDITED",
  requestCount:122,plannedMarketDateRequests:122,
  receivedMarketDateCount:122,sourceWindowFirstDate:days[0],
  sourceWindowLastDate:days.at(-1),sourceRowSymbolWindowsCompleteCount:1935,
  markets:["TWSE","TPEX"],receipts:[],errors:[],bySymbol:{},
  sourceQuotaD1Reads:0,sourceQuotaD1Writes:0,
  assessorExecuted:false,qualifiedCandidates:null,selectedCount:null,
  frozenDecisionsDurablyReadBack:false,
  independentProviderAudited:false,noSystem1RuntimeMutations:true
 };
 source.receiptHash=await sha256Hex(official61SessionSourceReceiptHashBaseV0_1(source));
 const audit=await signedAudit({
  schemaVersion:"SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1",
  verdict:"ACCEPTED_SOURCE_INTEGRITY_ONLY",
  marketDate:source.marketDate,
  sourceReceiptHash:source.receiptHash,
  sourceMarketDatePairsVerified:122,
  originalFilesRehashedAfterDownload:122,
  originalFilesDecompressedAndParsed:122,
  auditorSeparation:"INDEPENDENT_READBACK_PROCESS",
  selectionAuthorized:false
 });
 return {source,audit};
}
async function fakeNative(source,at="2026-10-16T07:23:02.000Z"){
 const base={
  schemaVersion:"S2_M09_SIX_CA_NATIVE_ORIGINAL_SOURCE_RECEIPT_V0_1",
  requestedStartDate:source.calendar.tradingDates[0],
  requestedEndDate:source.marketDate,
  sourceFamilyDenominator:6,sourcesRetainedOriginalBytes:6,
  nativeRangeSchemaCandidates:6,
  sourceReceipts:Array.from({length:6},(_,i)=>({sourceId:"ORIGINAL_"+i})),
  firstPhysicalObservedAtUtc:at,completedAtUtc:"2026-10-16T07:23:03.000Z",
  sourceContractCoverageComplete:false,
  historicalFirstKnownAtCertified:false,
  entireRangeCorrectionAndCancellationCoverageCertified:false,
  instrumentClassPITCertified:false,noEventMayBeClaimed:false,
  continuityCertified:false,selectionAuthorized:false,
  selectedCount:null,zeroPickDay:null,frozenD1Written:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreTouched:false
 };
 return {...base,receiptHash:await sha256Hex(base)};
}
function time(){
 const ticks=["2026-10-16T07:23:01.000Z","2026-10-16T07:23:04.000Z"];
 return ()=>new Date(ticks.shift()??"2026-10-16T07:23:04.000Z");
}
test("signed 122/122 audit can independently collect 6 current CA originals without stale preview; remain NOT historic PIT",async()=>{
 const {source,audit}=await originals();
 let calls=0,scope=null;
 const result=await run({
  sourceReceipt:source,independentAudit:audit,now:time(),
  fetchImpl:async()=>{throw Error("actual provider calls are deliberately mocked");},
  persistRaw:async()=>({verified:true}),
  capture:async ({marketDate,startDate,fetchImpl,persistRaw})=>{
    calls++;
    assert.equal(marketDate,source.marketDate);
    assert.equal(startDate,source.calendar.tradingDates[0]);
    assert.equal(typeof fetchImpl,"function");
    assert.equal(typeof persistRaw,"function");
    scope=await fakeNative(source);return scope;
  }
 });
 assert.equal(calls,1);
 assert.equal(result.receipt.status,"PROSPECTIVE_SIX_CA_ORIGINALS_CAPTURED_NOW__HISTORIC_PIT_UNKNOWN");
 assert.equal(result.receipt.requiresNoPreliminaryWatch,true);
 assert.equal(result.receipt.originalMarketDayCutQualified,false);
 assert.equal(result.receipt.observationOnlyAvailableAtUtc,"2026-10-16T07:23:02.000Z");
 assert.equal(result.receipt.caSourceReceiptHash,scope.receiptHash);
 assert.equal(result.receipt.originalBodyBytesRetained,6);
 assert.equal(result.receipt.qualifiedSelection,false);
 assert.equal(result.receipt.frozenD1Written,false);
 assert.equal(result.receipt.shadowAdmitted,false);
 assert.equal(result.receipt.completeCARevisionsAndNoEventCertified,false);
 assert.equal(result.receipt.cloudflareD1Writes,0);
});
test("original A1/source audit not 122/122, forged original hash or future A1 NOT ALLOWED to GET",async()=>{
 const {source,audit}=await originals();
 const cases=[
  ["source missing pair",s=>s.receivedMarketDateCount=121,a=>a],
  ["invalid source sha",s=>s.receiptHash="0".repeat(64),a=>a],
  ["wrong audit count",s=>s,a=>a.sourceMarketDatePairsVerified=121],
  ["audit future claim",s=>s,a=>a.selectionAuthorized=true],
  ["audit hash mismatch",s=>s,a=>a.auditHash="0".repeat(64)],
  ["forged audit separation",s=>s,a=>a.auditorSeparation="SELF_REPORTED"]
 ];
 for(const [label,mutateSource,mutateAudit] of cases){
  const s=structuredClone(source),a=structuredClone(audit);
  mutateSource(s);mutateAudit(a);
  let calls=0;
  await assert.rejects(run({sourceReceipt:s,independentAudit:a,now:time(),
    fetchImpl:async()=>{calls++},persistRaw:async()=>{},capture:async()=>{calls++}}),
    /S2_M09_PROSPECTIVE_CA_/,label);
  assert.equal(calls,0,label);
 }
});
test("forged current CA as historic PIT or no-event, invalid observation clock fails closed",async()=>{
 const {source,audit}=await originals();
 for(const [label,mutator] of [
   ["no event",c=>c.noEventMayBeClaimed=true],
   ["prior day backdate",c=>c.firstPhysicalObservedAtUtc="2026-10-15T06:00:00.000Z"],
   ["past market day selected",c=>c.selectionAuthorized=true],
   ["frozen",c=>c.frozenD1Written=true],
   ["cloud write",c=>c.cloudflareD1Writes=1],
   ["incomplete body promoted",c=>c.sourcesRetainedOriginalBytes=7],
   ["unqualified source family",c=>c.sourceFamilyDenominator=5]
 ]){
  const baseline=await fakeNative(source);
  mutator(baseline);
  baseline.receiptHash=await sha256Hex(Object.fromEntries(Object.entries(baseline).filter(([k])=>k!=="receiptHash")));
  await assert.rejects(run({
    sourceReceipt:source,independentAudit:audit,now:time(),
    fetchImpl:async()=>{},persistRaw:async()=>{},
    capture:async()=>baseline
  }),/S2_M09_PROSPECTIVE_CA_/,label);
 }
});
