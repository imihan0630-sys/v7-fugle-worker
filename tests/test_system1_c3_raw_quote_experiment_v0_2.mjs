import assert from "node:assert/strict";
import {buildC3RawQuoteEvidence,buildC3RawQuoteEntryExperiment,C3_RAW_QUOTE_CONTRACT_V0_2} from "../research/system1_c3_raw_quote_experiment_v0_2.mjs";
import {C3_CAPTURE_SLOTS} from "../research/system1_c3_capture_contract_v0_1.mjs";

let n=0;const eq=(a,b)=>{assert.deepEqual(a,b);n++};const ok=x=>{assert.ok(x);n++};
const generationId="gen-q-v02",sessionDate="2026-10-02",decisionAt="2026-10-02T23:35:00+08:00";
const ctx=(channel,depthScore=70)=>({
  close:99,depthScore,lateStage:false,channel,
  entryGeometry:channel==="A"?{entry:101,stop:95,target:117,support:100,breakout:null}:{entry:101,stop:94,target:118,support:null,breakout:100},
  provenance:{authenticated:true,parentId:generationId,sessionDate,knownAt:decisionAt}
});
const pair=(symbol,channel)=>({symbol,pool:"GENERAL",selectionContext:ctx(channel),formal:{qualified:false,selected:false},
  short:{gateStatus:"PASS",missingSafety:[],withoutSafetyGateStatus:"PASS"},swing:{gateStatus:"UNKNOWN"}});
const pairs=[pair("AAA","A"),pair("BBB","B")];
const c2={schemaVersion:"SYSTEM1_C2_PAIRED_LEDGER_V0_1",generationId,sessionDate,decisionAt,fingerprint:"f".repeat(64),
  completeMatchedCohort:true,researchOnly:true,formalCoreLocked:true,pairs,tally:{populationN:2}};

function iso(slot){
  const [h,m]=slot.split(":").map(Number),uh=(h+24-8)%24;
  return `2026-10-05T${String(uh).padStart(2,"0")}:${String(m).padStart(2,"0")}:00.000Z`;
}
function bar(symbol,slot,i){
  const start=iso(slot),end=new Date(Date.parse(start)+15*60000).toISOString();
  let open=101+i*.1,high=open+1,low=open-.5,close=open+.4;
  if(i===0){open=101;high=102;low=99.5;close=101;}
  if(i===2){high=118;close=116;}
  return {generation_id:generationId,target_trade_date:"2026-10-05",symbol,bar_start:start,bar_end:end,completed_bar:1,
    bar_json:JSON.stringify({time:start,open,high,low,close,volume:1000+i,volumeRatio:1.3})};
}
function quote(symbol,slot,state="CONTINUOUS"){
  const start=iso(slot),end=Date.parse(start)+15*60000,qt=new Date(end+30000).toISOString();
  return {generation_id:generationId,target_trade_date:"2026-10-05",symbol,bar_start:start,
    quote_json:JSON.stringify({symbol,date:"2026-10-05",quoteTimestamp:qt,executionMarketState:state,
      bestBid:101,bestAsk:101.5,spreadPct:.49,bidDepth5:300,askDepth5:200,depthImbalance:.2,
      isLimitUpHalt:false,semanticLimit:"Raw context only; no generic limit-up inference; raw depth not converted to depthScore."})};
}
const captureRows=[...C3_CAPTURE_SLOTS.map((x,i)=>bar("AAA",x,i)),...C3_CAPTURE_SLOTS.map((x,i)=>bar("BBB",x,i))];
const quoteRows=[
  ...C3_CAPTURE_SLOTS.map(x=>quote("AAA",x)),
  ...C3_CAPTURE_SLOTS.map((x,i)=>quote("BBB",x,i===4?"NON_CONTINUOUS_FLAGGED":"CONTINUOUS"))
];
const formalBaselineReceipts=[
  {symbol:"AAA",verified:true,parentId:generationId,sessionDate,knownAt:"2026-10-05T13:31:00+08:00",status:"NO_TRIGGER"},
  {symbol:"BBB",verified:true,parentId:generationId,sessionDate,knownAt:"2026-10-05T13:31:00+08:00",status:"NO_TRIGGER"}
];

const ev=buildC3RawQuoteEvidence(c2,{captureRows,quoteRows,formalBaselineReceipts});
eq(ev.schemaVersion,"SYSTEM1_C3_RAW_QUOTE_EVIDENCE_V0_2");
eq(ev.eligibleN,2);eq(ev.readyN,1);eq(ev.blockedN,1);
eq(ev.rows.find(x=>x.symbol==="AAA").status,"READY");
eq(ev.rows.find(x=>x.symbol==="BBB").status,"INPUT_BLOCKED");
ok(ev.rows.find(x=>x.symbol==="BBB").blockers.includes("MARKET_MECHANISM_NOT_CONTINUOUS"));
eq(ev.rows.find(x=>x.symbol==="AAA").rawDepthCoverageN,17);
eq(ev.rows.find(x=>x.symbol==="AAA").continuousMarketStateN,17);
eq(ev.rows.find(x=>x.symbol==="AAA").genericLimitUpState,"UNKNOWN");
eq(ev.rawDepthConvertedToDepthScore,false);
eq(ev.genericLimitUpStateNeverInferred,true);
eq(ev.readyReceipts.length,1);
eq(ev.readyReceipts[0].bars[0].selectionDepthScore,70);
eq(ev.readyReceipts[0].bars[0].executionMarketState,"CONTINUOUS");
eq(ev.readyReceipts[0].bars[0].rawQuote.depthImbalance,.2);

const exp=buildC3RawQuoteEntryExperiment(c2,ev,{costs:{brokerFeeBpsPerSide:14.25,sellTaxBps:30,slippageBpsPerSide:5}});
eq(exp.schemaVersion,"SYSTEM1_C3_RAW_QUOTE_ENTRY_EXPERIMENT_V0_2");
eq(exp.tally.readyN,1);
eq(exp.rows[0].symbol,"AAA");
eq(exp.rows[0].challenger.status,"TRIGGERED");
eq(exp.rows[0].challenger.fillStatus,"SIM_FILL");
eq(exp.rows[0].challenger.outcome,"TARGET");
eq(exp.tally.formalNoTriggerChallengerSimFillN,1);
eq(exp.economicSuperiority,"UNKNOWN");
eq(exp.comparisonToV01,"UNKNOWN");
eq(exp.noTrade,true);eq(exp.noPush,true);eq(exp.formalCoreLocked,true);
eq(C3_RAW_QUOTE_CONTRACT_V0_2.genericLimitUpStateRequired,false);
eq(C3_RAW_QUOTE_CONTRACT_V0_2.rawDepthConvertedToDepthScore,false);
eq(C3_RAW_QUOTE_CONTRACT_V0_2.requiredExecutionMarketState,"CONTINUOUS");

const missingQuote=quoteRows.filter(x=>!(x.symbol==="AAA"&&x.bar_start===iso("10:00")));
const evMissing=buildC3RawQuoteEvidence(c2,{captureRows,quoteRows:missingQuote,formalBaselineReceipts});
eq(evMissing.rows.find(x=>x.symbol==="AAA").status,"INPUT_BLOCKED");
ok(evMissing.rows.find(x=>x.symbol==="AAA").blockers.includes("INCOMPLETE_QUOTE_SESSION"));

const badContext={...c2,pairs:c2.pairs.map(x=>x.symbol==="AAA"?{...x,selectionContext:{...x.selectionContext,depthScore:null}}:x)};
const evBad=buildC3RawQuoteEvidence(badContext,{captureRows,quoteRows,formalBaselineReceipts});
ok(evBad.rows.find(x=>x.symbol==="AAA").blockers.includes("SELECTION_DEPTH_UNVERIFIED"));

assert.throws(()=>buildC3RawQuoteEntryExperiment(c2,{...ev,generationId:"wrong"},{costs:{brokerFeeBpsPerSide:14.25,sellTaxBps:30,slippageBpsPerSide:5}}),/MATCHED_EVIDENCE_REQUIRED/);n++;
assert.throws(()=>buildC3RawQuoteEntryExperiment(c2,ev,{costs:{brokerFeeBpsPerSide:14.25,sellTaxBps:null,slippageBpsPerSide:5}}),/FROZEN_COSTS_REQUIRED/);n++;

console.log(JSON.stringify({ok:true,assertions:n,preregisteredParallelArm:true,rawDepthOnly:true,
  genericLimitUpNeverInferred:true,nonContinuousFailsClosed:true,formalCoreImpact:false,realOrders:0,system2Touched:false}));
