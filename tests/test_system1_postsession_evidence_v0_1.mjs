import assert from "node:assert/strict";
import {
  verifyC3CohortRows,adaptC3QuoteRows,buildC4ReadinessFromCohort,buildSystem1PostSessionPacket
} from "../research/system1_postsession_evidence_v0_1.mjs";
import {C3_CAPTURE_SLOTS} from "../research/system1_c3_capture_contract_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};

const generationId="gen-post-1",sessionDate="2026-10-02",targetTradeDate="2026-10-05";
const decisionAt="2026-10-02T23:35:00+08:00";
const contentDigest="a".repeat(64),universeDigest="b".repeat(64),fingerprint="c".repeat(64),cohortDigest="d".repeat(64);
const pair=(symbol,{priorityScore=null}={})=>({
  symbol,pool:"GENERAL",
  selectionContext:{
    close:99,depthScore:70,spreadPercent:.2,orderBookDepthGood:true,lateStage:false,
    ret20:10,maDistance20Pct:5,channel:"A",
    entryGeometry:{entry:101,stop:95,target:118,support:100,breakout:null},
    ...(priorityScore===null?{}:{priorityScore}),
    provenance:{authenticated:true,parentId:generationId,sessionDate,knownAt:decisionAt}
  },
  formal:{qualified:false,selected:false,firstFailure:"AB_SETUP"},
  short:{gateStatus:"PASS",missingSafety:[],withoutSafetyGateStatus:"PASS"},
  swing:{gateStatus:"UNKNOWN",missingSafety:["FUNDAMENTAL_QUALITY"]}
});
const c2={
  schemaVersion:"SYSTEM1_C2_PAIRED_LEDGER_V0_1",generationId,sessionDate,decisionAt,
  sourceContentDigest:contentDigest,universeDigest,fingerprint,completeMatchedCohort:true,researchOnly:true,formalCoreLocked:true,
  pairs:[pair("AAA"),pair("BBB")],
  tally:{populationN:2,formalRejectedButConditionalShortGatesPassN:2}
};
const cohortRows=[{
  generation_id:generationId,source_session_date:sessionDate,target_trade_date:targetTradeDate,
  source_c1_content_digest:contentDigest,source_c1_universe_digest:universeDigest,
  source_c2_fingerprint:fingerprint,cohort_digest:cohortDigest,
  symbol:"AAA",pool:"GENERAL",classification:"FULL_SHORT_PASS",created_at:"2026-10-03T00:10:00.000Z"
}];

function isoForSlot(slot){
  const [h,m]=slot.split(":").map(Number);
  return `2026-10-05T${String(h-8).padStart(2,"0")}:${String(m).padStart(2,"0")}:00.000Z`;
}
const barRows=C3_CAPTURE_SLOTS.map((slot,i)=>{
  const start=isoForSlot(slot),end=new Date(Date.parse(start)+15*60000).toISOString();
  const open=100+i*.1;
  return {
    generation_id:generationId,target_trade_date:targetTradeDate,symbol:"AAA",bar_start:start,bar_end:end,
    scheduled_time:Date.parse(end)+60000,
    bar_json:JSON.stringify({time:start,open,high:open+2,low:open-1,close:open+1,volume:1000+i,volumeRatio:1.3}),
    source_fetched_at:new Date(Date.parse(end)+60000).toISOString(),
    source_family:"FUGLE_INTRADAY_CANDLES_15M",completed_bar:1
  };
});
const quoteRows=C3_CAPTURE_SLOTS.map((slot,i)=>{
  const start=isoForSlot(slot),end=new Date(Date.parse(start)+15*60000).toISOString();
  return {
    generation_id:generationId,target_trade_date:targetTradeDate,symbol:"AAA",bar_start:start,
    scheduled_time:Date.parse(end)+60000,
    quote_json:JSON.stringify({
      symbol:"AAA",date:targetTradeDate,quoteTimestamp:new Date(Date.parse(end)+30000).toISOString(),
      bestBid:100,bestAsk:100.1,spreadPct:.1,bidDepth5:1000+i,askDepth5:900+i,depthImbalance:.0526,
      isLimitUpPrice:false,isLimitDownPrice:false,executionMarketState:"CONTINUOUS"
    }),
    source_fetched_at:new Date(Date.parse(end)+60000).toISOString(),
    source_family:"FUGLE_INTRADAY_QUOTE_RAW_CONTEXT"
  };
});

const pass={status:"PASS"},fail={status:"FAIL"};
const baseGates={SOURCE_AUTHENTICITY:pass,SESSION_CONTINUITY:pass,CORPORATE_ACTION_CONTINUITY:pass,EXECUTION_FEASIBILITY:pass,ACCOUNT_RISK:pass,
  PRICE_FLOOR:pass,HISTORY_60D:pass,DAILY_ABNORMALITY:pass,LIQUIDITY:pass,ANNOUNCEMENT_RISK:pass,RS_CONTEXT:pass,ATR_QUALITY:pass,
  SECTOR_GATE:pass,AB_SETUP:pass,VALUATION_RELATIVE_RISK:pass,FUNDAMENTAL_QUALITY:pass,FINANCIAL_SOURCE_COMPLETENESS:pass};
const c1={schemaVersion:"SYSTEM1_C1_ISOLATED_V0_1",sessionDate,populationN:2,observations:[
  {symbol:"AAA",pool:"GENERAL",formalResult:{ok:false},firstFailureReason:"AB_SETUP",gates:{...baseGates,AB_SETUP:fail}},
  {symbol:"BBB",pool:"GENERAL",formalResult:{ok:false},firstFailureReason:"VALUATION_RELATIVE_RISK",gates:{...baseGates,VALUATION_RELATIVE_RISK:fail}}
]};

const cohort=verifyC3CohortRows(cohortRows,targetTradeDate,c2);
eq(cohort.symbols,["AAA"]);
eq(cohort.generationId,generationId);
assert.throws(()=>verifyC3CohortRows([],targetTradeDate,c2),/C3_POSTSESSION_COHORT_NOT_FOUND/);n++;
assert.throws(()=>verifyC3CohortRows([{...cohortRows[0],source_c2_fingerprint:"e".repeat(64)}],targetTradeDate,c2),/C3_POSTSESSION_C2_COHORT_MISMATCH/);n++;

const states=adaptC3QuoteRows(quoteRows,cohort);
eq(states.length,17);
eq(states[0].verified,true);
eq(states[0].limitUp,false);
eq(states[0].marketState,"CONTINUOUS");
eq(states[0].depthScoreDerived,false);
ok(states.every(x=>x.rawDepthOnly===true));
const quoteMissingLimit=quoteRows.map((x,i)=>i===0?{...x,quote_json:JSON.stringify({...JSON.parse(x.quote_json),isLimitUpPrice:null})}:x);
const missingStates=adaptC3QuoteRows(quoteMissingLimit,cohort);
eq(missingStates[0].verified,false);
eq(missingStates[0].limitUp,null);

const packet=buildSystem1PostSessionPacket({
  targetTradeDate,cohortRows,barRows,quoteRows,c1Diagnosis:c1,c2Ledger:c2
});
eq(packet.schemaVersion,"SYSTEM1_POSTSESSION_EVIDENCE_PACKET_V0_1");
eq(packet.cohort.n,1);
eq(packet.capture.audit.fullEligibleN,2);
eq(packet.capture.audit.eligibleN,1);
eq(packet.capture.audit.readyN,1);
eq(packet.capture.audit.formalBaselineMissingDoesNotBlockChallenger,true);
eq(packet.c3.tally.receiptN,1);
eq(packet.c3.tally.formalBaselineUnknownN,1);
eq(packet.c3.tally.formalNoTriggerChallengerSimFillN,0);
eq(packet.c3.rows[0].formalBaseline.status,"UNKNOWN");
eq(packet.c4.status,"INPUT_BLOCKED");
eq(packet.c4.reason,"PRIORITY_SCORE_OR_GEOMETRY_NOT_PRESERVED");
eq(packet.c5.denominatorN,2);
eq(packet.interpretation.formalNotAdmittedIsNotEquivalentToFormalNoTrigger,true);
eq(packet.economicSuperiority,"UNKNOWN");
eq(packet.noTrade,true);

const packetMissingLimit=buildSystem1PostSessionPacket({
  targetTradeDate,cohortRows,barRows,quoteRows:quoteMissingLimit,c1Diagnosis:c1,c2Ledger:c2
});
eq(packetMissingLimit.capture.audit.readyN,0);
ok(packetMissingLimit.capture.audit.rows[0].blockers.includes("BAR_MICROSTRUCTURE_UNVERIFIED"));
eq(packetMissingLimit.c3.tally.receiptN,0);

const c2WithPriority={...c2,pairs:c2.pairs.map(x=>x.symbol==="AAA"?{
  ...x,selectionContext:{...x.selectionContext,priorityScore:80}
}:x)};
const c4Ready=buildC4ReadinessFromCohort(c2WithPriority,["AAA"]);
eq(c4Ready.status,"READY");
eq(c4Ready.comparison.selectedCount,1);
eq(c4Ready.comparison.preferredAllocator,null);
eq(c4Ready.comparison.economicSuperiority,"UNKNOWN");

const c2BadStop={...c2WithPriority,pairs:c2WithPriority.pairs.map(x=>x.symbol==="AAA"?{
  ...x,selectionContext:{...x.selectionContext,entryGeometry:{...x.selectionContext.entryGeometry,stop:null}}
}:x)};
const c4Bad=buildC4ReadinessFromCohort(c2BadStop,["AAA"]);
eq(c4Bad.status,"INPUT_BLOCKED");
ok(c4Bad.missing.some(x=>x.symbol==="AAA"&&x.field==="entryOrStop"));

console.log(JSON.stringify({
  ok:true,assertions:n,postSessionPacket:true,boundedC3Scope:true,formalBaselineUnknownPreserved:true,
  c4FailClosedWithoutPriorityScore:true,c5FullDenominator:true,missingLimitStateBlocks:true,
  economicSuperiority:"UNKNOWN",formalCoreImpact:false,system2Touched:false
}));
