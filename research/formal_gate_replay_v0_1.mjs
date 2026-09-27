export const FORMAL_GATE_ORDER=[
  "PRICE_FLOOR",
  "HISTORY_60D",
  "RS_CONTEXT",
  "MARKET_CAP_FLOOR",
  "DAILY_ABNORMALITY",
  "LIQUIDITY",
  "SMALL_CAP_SPECIAL",
  "MID_CAP_LIQUIDITY",
  "CHIP_CONCENTRATION_PRESENT",
  "FINANCIAL_SOURCE_COMPLETENESS",
  "ANNOUNCEMENT_RISK",
  "VALUATION_RELATIVE_RISK",
  "SECTOR_GATE",
  "AB_SETUP",
  "FUNDAMENTAL_COMPONENT_COUNT",
  "FUNDAMENTAL_QUALITY",
  "ATR_QUALITY",
  "TARGET_AVAILABLE",
  "REWARD_RISK",
  "FINAL_SIGNAL_GRADE"
];

const SAFE_NOT_APPLICABLE_REASONS=new Set([
  "NOT_APPLICABLE_CAP_GTE_30",
  "NOT_APPLICABLE_CAP_GTE_100",
  "NO_POSITIVE_TTM_PE"
]);

function gateState(observer,id){
  const row=observer?.gates?.[id];
  return row&&typeof row==="object"?row:{status:"UNKNOWN",reason:"GATE_NOT_CAPTURED"};
}

function isSafeSkip(row){
  return row?.status==="NOT_EVALUABLE"&&SAFE_NOT_APPLICABLE_REASONS.has(String(row?.reason||""));
}

function blockerKind(row){
  const status=String(row?.status||"UNKNOWN");
  if(status==="PASS"||isSafeSkip(row)) return "CLEAR";
  if(status==="FAIL") return "FAIL";
  if(status==="UNKNOWN") return "UNKNOWN";
  if(status==="NOT_EVALUABLE") return "DEPENDENT_NOT_EVALUABLE";
  return "UNKNOWN";
}

export function replaySingleGateRemoval(observer,removedGate){
  const gate=String(removedGate||"");
  const index=FORMAL_GATE_ORDER.indexOf(gate);
  if(index<0) throw new Error("UNKNOWN_GATE:"+gate);
  const removed=gateState(observer,gate);

  const base={
    schemaVersion:"formal-gate-single-removal-replay-v0.1",
    removedGate:gate,
    removedGateStatus:removed.status,
    removedGateReason:removed.reason||null,
    originalFormalResult:observer?.formalResult||null,
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false
  };

  if(removed.status!=="FAIL"){
    return {...base,status:"REMOVED_GATE_NOT_OBSERVED_FAIL",nextGate:null,
      note:"No scarcity claim is made because the removed gate was not an observed FAIL."};
  }

  for(let i=0;i<index;i+=1){
    const id=FORMAL_GATE_ORDER[i],row=gateState(observer,id),kind=blockerKind(row);
    if(kind==="FAIL") return {...base,status:"EARLIER_OBSERVED_FAIL",nextGate:id,nextGateState:row};
    if(kind==="UNKNOWN") return {...base,status:"PRIOR_STATE_UNKNOWN",nextGate:id,nextGateState:row};
    if(kind==="DEPENDENT_NOT_EVALUABLE") return {...base,status:"PRIOR_STATE_NOT_EVALUABLE",nextGate:id,nextGateState:row};
  }

  for(let i=index+1;i<FORMAL_GATE_ORDER.length;i+=1){
    const id=FORMAL_GATE_ORDER[i],row=gateState(observer,id),kind=blockerKind(row);
    if(kind==="FAIL") return {...base,status:"NEXT_OBSERVED_FAIL",nextGate:id,nextGateState:row};
    if(kind==="UNKNOWN") return {...base,status:"NEXT_STATE_UNKNOWN",nextGate:id,nextGateState:row};
    if(kind==="DEPENDENT_NOT_EVALUABLE") return {...base,status:"NEXT_STATE_NOT_EVALUABLE",nextGate:id,nextGateState:row};
  }

  return {...base,status:"ALL_OTHER_OBSERVED_GATES_CLEAR",nextGate:null,
    note:"This is only a gate-state counterfactual. It is NOT a recovered Formal candidate, selection, rank, or trade."};
}

export function summarizeSingleGateRemoval(observers,removedGate){
  const rows=(Array.isArray(observers)?observers:[]).map(observer=>replaySingleGateRemoval(observer,removedGate));
  const counts={};
  const nextFailureCounts={};
  for(const row of rows){
    counts[row.status]=(counts[row.status]||0)+1;
    if(row.status==="NEXT_OBSERVED_FAIL"&&row.nextGate){
      nextFailureCounts[row.nextGate]=(nextFailureCounts[row.nextGate]||0)+1;
    }
  }
  return {
    schemaVersion:"formal-gate-single-removal-summary-v0.1",
    removedGate:String(removedGate||""),
    rows:rows.length,
    counts,
    nextFailureCounts,
    uniqueObservedClear:Number(counts.ALL_OTHER_OBSERVED_GATES_CLEAR||0),
    unresolved:Number(counts.PRIOR_STATE_UNKNOWN||0)+Number(counts.PRIOR_STATE_NOT_EVALUABLE||0)+
      Number(counts.NEXT_STATE_UNKNOWN||0)+Number(counts.NEXT_STATE_NOT_EVALUABLE||0),
    policy:"uniqueObservedClear is not recovered selectedCount. Ranking, quota, downstream geometry under changed prerequisites, costs and outcomes are not replayed.",
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false
  };
}
