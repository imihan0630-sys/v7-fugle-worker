// B-145 recorder completeness proposal v0.2 — pure research contract.
// Future runtime implementation would be Class B. This module itself has no I/O or Formal impact.

function txt(v){return String(v??"").trim()}
function arr(v){return Array.isArray(v)?v:[]}
function uniq(xs){return [...new Set(xs)]}

export function classifyPlanDayNoBuyCoverage({
  tradeDate,
  planSymbol,
  expectedScheduledTimes=[],
  runReceipts=[],
  exactDateRows={},
  positiveBuySignals=[]
}={}){
  const date=txt(tradeDate),symbol=txt(planSymbol);
  const reasons=[];
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) reasons.push("TRADE_DATE_REQUIRED");
  if(!symbol) reasons.push("PLAN_SYMBOL_REQUIRED");

  const schedule=uniq(arr(expectedScheduledTimes).map(Number).filter(Number.isFinite)).sort((a,b)=>a-b);
  if(schedule.length!==265) reasons.push("EXPECTED_RUN_DENOMINATOR_NOT_265");

  const receipts=arr(runReceipts).filter(r=>txt(r?.tradeDate)===date);
  const byTime=new Map();
  for(const r of receipts){
    const t=Number(r?.scheduledTime);
    if(Number.isFinite(t)){
      if(byTime.has(t)) reasons.push("DUPLICATE_RUN_RECEIPT");
      byTime.set(t,r);
    }
  }
  const missing=schedule.filter(t=>!byTime.has(t));
  if(missing.length) reasons.push("MISSING_SCHEDULED_RUN_RECEIPT");

  const rowDate=txt(exactDateRows?.requestedTradeDate);
  const paginationComplete=exactDateRows?.paginationComplete===true &&
    exactDateRows?.hasMore===false && exactDateRows?.truncated===false;
  if(rowDate!==date) reasons.push("EXACT_DATE_QUERY_MISMATCH");
  if(!paginationComplete) reasons.push("EXACT_DATE_ROWS_NOT_COMPLETE");
  const rowKeys=new Set(arr(exactDateRows?.eventKeys).map(txt).filter(Boolean));

  let expectedBuy=false;
  let coverageFailure=false;
  const expectedKeys=[];
  for(const t of schedule){
    const r=byTime.get(t);
    if(!r) continue;
    if(r?.failOpen===true||txt(r?.errorClass)||Number(r?.failedCount||0)>0){
      coverageFailure=true;reasons.push("RUN_FAIL_OPEN_OR_ERROR");
    }
    const symbols=uniq(arr(r?.expectedSymbols).map(txt).filter(Boolean));
    if(!symbols.includes(symbol)){coverageFailure=true;reasons.push("PLAN_SYMBOL_NOT_EXPECTED_IN_RUN");}
    const status=r?.symbolStatuses?.[symbol];
    if(!status||status.ok!==true){coverageFailure=true;reasons.push("PLAN_SYMBOL_RESULT_NOT_OK");}

    for(const k of arr(r?.expectedEventKeys).map(txt).filter(Boolean)){
      expectedKeys.push(k);
      if(k.includes(":BUY:")||k.endsWith("|BUY")||k.includes("|BUY|")) expectedBuy=true;
    }

    const skipped=r?.skippedByReason||{};
    for(const [reason,countRaw] of Object.entries(skipped)){
      const count=Number(countRaw||0);
      if(!(count>0)) continue;
      if(reason!=="ALREADY_PRESENT_VERIFIED"){
        coverageFailure=true;reasons.push("NON_IDEMPOTENT_SKIP_"+reason);
      }
    }
  }

  const missingExpectedKeys=uniq(expectedKeys).filter(k=>!rowKeys.has(k));
  if(missingExpectedKeys.length){coverageFailure=true;reasons.push("EXPECTED_EVENT_KEY_MISSING");}

  const buys=arr(positiveBuySignals).filter(x=>
    txt(x?.tradeDate)===date && txt(x?.symbol)===symbol &&
    txt(x?.signalType).toUpperCase()==="BUY"
  );
  if(buys.length>0 || expectedBuy){
    return {
      status:"BUY_OBSERVED_OR_EXPECTED",
      complete:reasons.length===0&&!coverageFailure,
      noBuyEligible:false,
      positiveBuyCount:buys.length,
      expectedBuy,
      reasons:uniq(reasons),
      missingScheduledTimes:missing,
      missingExpectedEventKeys:missingExpectedKeys
    };
  }

  if(reasons.length===0&&!coverageFailure){
    return {
      status:"COMPLETE_NO_BUY",
      complete:true,noBuyEligible:true,
      positiveBuyCount:0,expectedBuy:false,reasons:[],
      coveredRuns:schedule.length,missingScheduledTimes:[],missingExpectedEventKeys:[]
    };
  }

  return {
    status:reasons.includes("RUN_FAIL_OPEN_OR_ERROR")||coverageFailure?"INCOMPLETE":"UNKNOWN",
    complete:false,noBuyEligible:false,positiveBuyCount:0,expectedBuy:false,
    reasons:uniq(reasons),coveredRuns:schedule.length-missing.length,
    missingScheduledTimes:missing,missingExpectedEventKeys:missingExpectedKeys
  };
}
