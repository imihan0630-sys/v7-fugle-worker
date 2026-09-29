// D14 mixed-lot execution clock validator v0.1 — research-only.
// Validates mechanism-aware regular/odd-lot execution receipts and derives latency vectors.
// No trading behavior or Formal Core impact.

function s(v){return String(v??"").trim()}
function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function t(v){const x=Date.parse(v||"");return Number.isFinite(x)?x:null}
function round(v,d=3){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function overlapMs(a0,a1,b0,b1){const lo=Math.max(a0,b0),hi=Math.min(a1,b1);return Math.max(0,hi-lo)}

const LOT_RULES={
  REGULAR_LOT:{mechanism:"REGULAR_CONTINUOUS"},
  INTRADAY_ODD_LOT:{mechanism:"INTRADAY_ODD_LOT_CALL_AUCTION"}
};

function validateBlockedIntervals(intervals,eligibleAt,fillAt){
  const out=[];
  for(const raw of intervals||[]){
    const start=t(raw?.startAt),end=t(raw?.endAt);
    const reason=s(raw?.reason),sourceRef=s(raw?.sourceRef),observedAt=t(raw?.observedAt);
    if(start===null||end===null||!(end>start)||!reason||!sourceRef||observedAt===null){
      return {ok:false,reason:"INVALID_MECHANISM_BLOCK_INTERVAL"};
    }
    if(start<eligibleAt) return {ok:false,reason:"BLOCK_INTERVAL_BEFORE_FIRST_ELIGIBILITY"};
    if(start<fillAt&&fillAt<end) return {ok:false,reason:"FILL_INSIDE_MECHANISM_BLOCK"};
    out.push({startAt:start,endAt:end,reason,sourceRef,observedAt});
  }
  out.sort((a,b)=>a.startAt-b.startAt);
  for(let i=1;i<out.length;i++){
    if(out[i].startAt<out[i-1].endAt) return {ok:false,reason:"OVERLAPPING_MECHANISM_BLOCK_INTERVALS"};
  }
  return {ok:true,intervals:out};
}

function legValidator(parent,leg){
  const lotType=s(leg?.lotType);
  const rule=LOT_RULES[lotType];
  if(!rule) return {ok:false,reason:"UNKNOWN_LOT_TYPE"};
  if(s(leg?.mechanism)!==rule.mechanism) return {ok:false,reason:"MECHANISM_LOT_MISMATCH"};

  const intendedQty=n(leg?.intendedQty);
  if(!Number.isInteger(intendedQty)||intendedQty<=0) return {ok:false,reason:"INVALID_LEG_QUANTITY"};

  const eligibleAt=t(leg?.mechanismEligibleAt);
  const eligSource=s(leg?.mechanismEligibilityEvidence?.sourceRef);
  const eligObserved=t(leg?.mechanismEligibilityEvidence?.observedAt);
  const eligState=s(leg?.mechanismEligibilityEvidence?.state);
  if(eligibleAt===null||!eligSource||eligObserved===null||!["NORMAL","INTERRUPTED"].includes(eligState)){
    return {ok:false,reason:"MISSING_MECHANISM_ELIGIBILITY_PROVENANCE"};
  }

  const benchLot=s(leg?.benchmark?.lotType);
  const benchSource=s(leg?.benchmark?.sourceRef);
  const benchAt=t(leg?.benchmark?.observedAt);
  const benchPrice=n(leg?.benchmark?.price);
  if(benchLot!==lotType) return {ok:false,reason:"BENCHMARK_LOT_MISMATCH"};
  if(!benchSource||benchAt===null||!(benchPrice>0)) return {ok:false,reason:"INVALID_BENCHMARK_PROVENANCE"};

  const attempts=Array.isArray(leg?.orderAttempts)?leg.orderAttempts:[];
  if(!attempts.length) return {ok:false,reason:"MISSING_SUBMISSION_PROVENANCE"};

  const attemptMap=new Map();
  const fillIds=new Set();
  let totalFilled=0;
  const fillDiagnostics=[];

  for(const a of attempts){
    const id=s(a?.attemptId);
    if(!id||attemptMap.has(id)) return {ok:false,reason:"DUPLICATE_OR_MISSING_ATTEMPT_ID"};
    const submitAt=t(a?.submitAt),terminalAt=t(a?.terminalAt);
    const requestedQty=n(a?.requestedQty);
    const submitSource=s(a?.submitEvidence?.sourceRef);
    const terminalState=s(a?.terminalState);
    if(submitAt===null||terminalAt===null||terminalAt<submitAt||!Number.isInteger(requestedQty)||requestedQty<=0||!submitSource){
      return {ok:false,reason:"INVALID_ORDER_ATTEMPT"};
    }
    if(!["FILLED","PARTIAL_CANCELED","REPLACED"].includes(terminalState)){
      return {ok:false,reason:"INVALID_ATTEMPT_TERMINAL_STATE"};
    }
    attemptMap.set(id,{...a,_submitAt:submitAt,_terminalAt:terminalAt,_requestedQty:requestedQty});
  }

  for(const a of attemptMap.values()){
    const replaces=s(a?.replacesAttemptId);
    if(replaces){
      const prev=attemptMap.get(replaces);
      if(!prev) return {ok:false,reason:"REPLACEMENT_PARENT_MISSING"};
      if(s(prev?.terminalState)!=="REPLACED") return {ok:false,reason:"REPLACEMENT_PARENT_NOT_REPLACED"};
      if(a._submitAt<prev._terminalAt) return {ok:false,reason:"OVERLAPPING_REPLACEMENT_ATTEMPTS"};
    }
  }

  // Reject replacement cycles.
  for(const a of attemptMap.values()){
    let cur=a,seen=new Set();
    while(s(cur?.replacesAttemptId)){
      if(seen.has(cur.attemptId)) return {ok:false,reason:"REPLACEMENT_CYCLE"};
      seen.add(cur.attemptId);
      cur=attemptMap.get(s(cur.replacesAttemptId));
      if(!cur) break;
    }
  }

  for(const a of attemptMap.values()){
    const fills=Array.isArray(a?.fills)?a.fills:[];
    for(const f of fills){
      const fillId=s(f?.fillId),evidenceType=s(f?.evidenceType),sourceRef=s(f?.sourceRef);
      const fillAt=t(f?.fillAt),qty=n(f?.qty),price=n(f?.price);
      if(!fillId||fillIds.has(fillId)) return {ok:false,reason:"DUPLICATE_OR_MISSING_FILL_ID"};
      fillIds.add(fillId);
      if(evidenceType!=="BROKER_CONFIRMED_FILL") return {ok:false,reason:"NON_CONFIRMED_FILL_EVIDENCE"};
      if(!sourceRef||fillAt===null||!Number.isInteger(qty)||qty<=0||!(price>0)){
        return {ok:false,reason:"INVALID_FILL_PROVENANCE"};
      }
      if(fillAt<a._submitAt||fillAt>a._terminalAt) return {ok:false,reason:"FILL_OUTSIDE_ATTEMPT_LIFECYCLE"};
      if(fillAt<parent.decisionKnownAt) return {ok:false,reason:"FILL_BEFORE_DECISION"};
      if(fillAt<eligibleAt) return {ok:false,reason:"FILL_BEFORE_MECHANISM_ELIGIBILITY"};

      const blocks=validateBlockedIntervals(leg?.mechanismBlockedIntervals,eligibleAt,fillAt);
      if(!blocks.ok) return blocks;

      let blockedAfterEligibility=0;
      const exposureStart=Math.max(parent.decisionKnownAt,eligibleAt);
      for(const b of blocks.intervals){
        blockedAfterEligibility+=overlapMs(exposureStart,fillAt,b.startAt,b.endAt);
      }
      const rawLatency=fillAt-parent.decisionKnownAt;
      const preEligibility=Math.max(0,eligibleAt-parent.decisionKnownAt);
      const scalarPostEligibility=fillAt-exposureStart;
      const eligibleExposure=Math.max(0,scalarPostEligibility-blockedAfterEligibility);

      fillDiagnostics.push({
        lotType,
        attemptId:a.attemptId,
        fillId,
        qty,
        price,
        rawLatencyMs:rawLatency,
        preEligibilityWaitMs:preEligibility,
        decisionToSubmitLatencyMs:a._submitAt-parent.decisionKnownAt,
        scalarPostEligibilityLatencyMs:scalarPostEligibility,
        mechanismBlockedWaitAfterEligibilityMs:blockedAfterEligibility,
        eligibleExposureToFillMs:eligibleExposure,
        submitToFillLatencyMs:fillAt-a._submitAt
      });
      totalFilled+=qty;
    }
  }

  if(!fillDiagnostics.length) return {ok:false,reason:"MISSING_FILL_PROVENANCE"};
  if(totalFilled>intendedQty) return {ok:false,reason:"LEG_OVERFILLED"};

  return {
    ok:true,
    lotType,
    intendedQty,
    filledQty:totalFilled,
    remainingQty:intendedQty-totalFilled,
    status:totalFilled===intendedQty?"FILLED":"PARTIAL",
    fillDiagnostics
  };
}

export function validateMixedLotExecutionReceipt(receipt={}){
  const intendedQty=n(receipt?.intendedQuantity);
  const decisionKnownAt=t(receipt?.decisionKnownAt);
  const parentActionId=s(receipt?.parentActionId);
  const symbol=s(receipt?.symbol),action=s(receipt?.action).toUpperCase();
  if(!parentActionId||!symbol||!["BUY","ADD","REDUCE","SELL"].includes(action)||decisionKnownAt===null||!Number.isInteger(intendedQty)||intendedQty<=1000||intendedQty%1000===0){
    return {status:"UNKNOWN_OR_NOT_MIXED_LOT",valid:false};
  }

  const expectedRegular=Math.floor(intendedQty/1000)*1000;
  const expectedOdd=intendedQty%1000;
  const legs=Array.isArray(receipt?.legs)?receipt.legs:[];
  if(legs.length!==2) return {status:"INVALID",valid:false,reasons:["EXPECTED_TWO_LOT_LEGS"]};

  const byType=new Map(legs.map(x=>[s(x?.lotType),x]));
  if(byType.size!==2||!byType.has("REGULAR_LOT")||!byType.has("INTRADAY_ODD_LOT")){
    return {status:"INVALID",valid:false,reasons:["MISSING_REQUIRED_LOT_LEG"]};
  }
  if(n(byType.get("REGULAR_LOT")?.intendedQty)!==expectedRegular||n(byType.get("INTRADAY_ODD_LOT")?.intendedQty)!==expectedOdd){
    return {status:"INVALID",valid:false,reasons:["PARENT_QUANTITY_MISMATCH"]};
  }

  const parent={decisionKnownAt};
  const regular=legValidator(parent,byType.get("REGULAR_LOT"));
  if(!regular.ok) return {status:"INVALID",valid:false,reasons:[regular.reason]};
  const odd=legValidator(parent,byType.get("INTRADAY_ODD_LOT"));
  if(!odd.ok) return {status:"INVALID",valid:false,reasons:[odd.reason]};

  const filledQty=regular.filledQty+odd.filledQty;
  if(filledQty>intendedQty) return {status:"INVALID",valid:false,reasons:["PARENT_OVERFILLED"]};

  return {
    status:"VALID_MIXED_LOT_EXECUTION_RECEIPT",
    valid:true,
    researchOnly:true,
    decisionImpact:false,
    parentActionId,symbol,action,intendedQuantity:intendedQty,
    expectedSplit:{regularShares:expectedRegular,oddLotShares:expectedOdd},
    filledQty,remainingQty:intendedQty-filledQty,
    parentFillStatus:filledQty===intendedQty?"FILLED":"PARTIAL",
    legs:{REGULAR_LOT:regular,INTRADAY_ODD_LOT:odd},
    latencySemantics:{
      rawLatency:"fillAt - decisionKnownAt",
      preEligibilityWait:"max(0, firstMechanismEligibleAt - decisionKnownAt)",
      scalarPostEligibility:"fillAt - max(decisionKnownAt, firstMechanismEligibleAt)",
      mechanismBlockedWaitAfterEligibility:"sum of evidenced blocked intervals after first eligibility and before fill",
      eligibleExposureToFill:"scalarPostEligibility - mechanismBlockedWaitAfterEligibility",
      submitToFill:"fillAt - attempt.submitAt"
    },
    warning:"Four scalar clocks are necessary but not sufficient when market eligibility can become blocked again after first eligibility. Use blocked intervals; do not collapse latency vectors into one score."
  };
}
