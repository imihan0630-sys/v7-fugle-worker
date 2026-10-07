import {createHash} from "node:crypto";
import {buildSystem1OpportunityLossBridge as buildV1} from "./system1_opportunity_loss_bridge_v0_1.mjs";

const MAX_CHASE=new Set(["MAX_CHASE_15M_BLOCK_B","MAX_CHASE_QUOTE_BLOCK"]);
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==="object"
  ?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const hash=x=>createHash("sha256").update(JSON.stringify(canonical(x))).digest("hex");
const inc=(o,k,n=1)=>{o[k]=(o[k]||0)+n;};

function normalizeLifecycle(rows,sessionDate,generationId){
  const byPlan=new Map();
  let invalidN=0,incompleteCoverageN=0;
  for(const row of rows||[]){
    const valid=row?.schemaVersion==="SYSTEM1_SELECTED_TO_BUY_CAUSE_ROW_V0_1"&&
      row?.sessionDate===sessionDate&&row?.generationId===generationId&&
      typeof row?.symbol==="string"&&row.symbol.length>0&&
      typeof row?.coverageComplete==="boolean"&&MAX_CHASE.has(String(row?.cause||""));
    if(!valid){invalidN++;continue;}
    if(row.coverageComplete!==true){incompleteCoverageN++;continue;}
    const key=String(row.symbol)+"|"+String(row.planIdentity||"");
    if(byPlan.has(key)) throw new Error("OPPORTUNITY_LOSS_V02_DUPLICATE_COMPLETE_PLAN_CAUSE_ROW");
    const memberships=[String(row.cause),...(Array.isArray(row.secondaryCauses)?row.secondaryCauses.map(String):[])]
      .filter(x=>MAX_CHASE.has(x));
    const uniqueMemberships=[...new Set(memberships)].sort();
    const events={};
    for(const cause of uniqueMemberships){
      const n=Number(row?.causeEventCounts?.[cause]);
      events[cause]=Number.isInteger(n)&&n>=0?n:1;
    }
    byPlan.set(key,{symbol:String(row.symbol),planIdentity:String(row.planIdentity||""),memberships:uniqueMemberships,events});
  }
  const causeMemberships={},causeEvents={},componentSymbols={
    MAX_CHASE_15M_BLOCK_B:new Set(),MAX_CHASE_QUOTE_BLOCK:new Set()
  };
  const maxChaseSymbols=new Set();
  for(const item of byPlan.values()){
    if(item.memberships.length) maxChaseSymbols.add(item.symbol);
    for(const cause of item.memberships){
      inc(causeMemberships,cause);
      inc(causeEvents,cause,item.events[cause]||0);
      componentSymbols[cause].add(item.symbol);
    }
  }
  return {
    validCompletePlanN:byPlan.size,
    incompleteCoverageN,invalidN,
    maxChaseUniqueSymbolN:maxChaseSymbols.size,
    maxChaseUniquePlanN:byPlan.size,
    maxChaseCauseMembershipN:Object.values(causeMemberships).reduce((a,b)=>a+b,0),
    maxChaseEventN:Object.values(causeEvents).reduce((a,b)=>a+b,0),
    causeMemberships,causeEvents,
    componentUniqueSymbols:{
      maxChase15mBlockB:componentSymbols.MAX_CHASE_15M_BLOCK_B.size,
      maxChaseQuoteBlock:componentSymbols.MAX_CHASE_QUOTE_BLOCK.size
    },
    completePlans:[...byPlan.values()].sort((a,b)=>a.symbol.localeCompare(b.symbol)||a.planIdentity.localeCompare(b.planIdentity))
  };
}

function stateRank(s){
  return String(s).startsWith("PROSPECTIVE_COUNTABLE")?0:
    s==="COMPLETE_FOR_CAPTURED_ELIGIBLE_SET"?0:
    s==="EXACT_CAUSE_ROWS_AVAILABLE"?0:
    String(s).startsWith("LEGACY_TARGET_GATE_OBSERVED")?1:
    s==="PARTIAL_DENOMINATOR"?2:3;
}

export function buildSystem1OpportunityLossBridgeV02(args={}){
  const base=buildV1(args);
  const lifecycle=normalizeLifecycle(args.lifecycleRows||[],base.sessionDate,base.generationId);
  const hypotheses=base.hypotheses.map(h=>h.id!=="H5_DOUBLE_MAX_CHASE_DOWNSTREAM"?h:{
    ...h,
    structuralN:lifecycle.validCompletePlanN>0?lifecycle.maxChaseUniqueSymbolN:null,
    evidenceState:lifecycle.validCompletePlanN>0?"EXACT_CAUSE_ROWS_AVAILABLE":"EXACT_DATE_LIFECYCLE_CAPTURE_NOT_AVAILABLE",
    components:{
      maxChase15mUniqueSymbols:lifecycle.componentUniqueSymbols.maxChase15mBlockB,
      maxChaseQuoteUniqueSymbols:lifecycle.componentUniqueSymbols.maxChaseQuoteBlock,
      maxChase15mCauseMemberships:lifecycle.causeMemberships.MAX_CHASE_15M_BLOCK_B||0,
      maxChaseQuoteCauseMemberships:lifecycle.causeMemberships.MAX_CHASE_QUOTE_BLOCK||0,
      maxChase15mEvents:lifecycle.causeEvents.MAX_CHASE_15M_BLOCK_B||0,
      maxChaseQuoteEvents:lifecycle.causeEvents.MAX_CHASE_QUOTE_BLOCK||0
    },
    denominator:"UNIQUE_SYMBOL_PRIMARY__CAUSE_MEMBERSHIP_AND_EVENTS_SECONDARY"
  });
  const investigationQueue=[...hypotheses].sort((a,b)=>
    stateRank(a.evidenceState)-stateRank(b.evidenceState)||
    (Number(b.structuralN)||0)-(Number(a.structuralN)||0)||a.id.localeCompare(b.id)
  ).map((x,i)=>({
    rank:i+1,id:x.id,evidenceState:x.evidenceState,structuralN:x.structuralN,
    interpretation:"INVESTIGATION_PRIORITY_ONLY_NOT_FORMAL_RELAXATION"
  }));
  const out={
    ...base,
    schemaVersion:"SYSTEM1_OPPORTUNITY_LOSS_BRIDGE_V0_2",
    rows:[...(base.rows||[])].sort((a,b)=>String(a.symbol||"").localeCompare(String(b.symbol||""))),
    lifecycle,
    hypotheses,
    investigationQueue,
    denominatorRules:{
      ...base.denominatorRules,
      maxChaseStructuralNUsesUniqueSymbol:true,
      maxChaseLayerMembershipsReportedSeparately:true,
      maxChaseRepeatedEventsReportedSeparately:true,
      duplicateCompletePlanCauseRowRejected:true
    },
    interpretation:{
      ...base.interpretation,
      sameSymbolTwoMaxChaseLayersDoNotBecomeTwoStocks:true
    }
  };
  const material={...out};delete material.fingerprint;
  out.fingerprint=hash(material);
  return out;
}
