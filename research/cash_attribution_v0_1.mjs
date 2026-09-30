// D15 Cash Attribution v0.1 — research-only.
// Separates plan-time reserve reasons from execution/account cash, which requires fill/holdings evidence.

import {scoreCapReserve} from "./score_cap_reserve_v0_1.mjs";

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function sym(v){return String(v??"").trim()}
function round(v,d=4){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function deployRatioForCount(k){const n=Math.max(0,Math.trunc(Number(k)||0));return n<=0?0:n===1?0.35:n===2?0.60:0.85}

export function classifyPlanTimeCash({
  scanDate,selectedCount,totalCapital,plans=[],
  executionEvidence="UNKNOWN"
}={}){
  const count=Number(selectedCount),capital=n(totalCapital);
  if(!Number.isInteger(count)||count<0||!(capital>0)) return {status:"UNKNOWN",reason:"INVALID_DAY_HEADER"};

  const rows=(plans||[]).map(p=>({
    symbol:sym(p?.symbol??p?.code),
    allocation:n(p?.totalAllocation??p?.total_allocation),
    priorityScore:n(p?.priorityScore??p?.priority_score)
  }));

  if(count===0){
    if(rows.length!==0) return {status:"UNKNOWN",reason:"ZERO_SELECTED_WITH_PLAN_ROWS"};
    return {
      status:"READY",scanDate:scanDate||null,selectedCount:0,totalCapitalNTD:capital,
      plannedDeploymentNTD:0,plannedCashNTD:capital,
      designedStrategicReserveNTD:capital,
      allocationImplementationShortfallNTD:0,
      capInducedReserveNTD:0,
      thousandFloorReserveNTD:0,
      planTimeCashReason:"NO_ELIGIBLE_OPPORTUNITY / DESIGNED_100_PERCENT_RESERVE",
      executionStateCash:{
        status:String(executionEvidence).toUpperCase()==="READY"?"SEPARATE_EVIDENCE_REQUIRED":"UNKNOWN",
        amountNTD:null,
        rule:"Plan-time zero selection does not prove broker cash balance; it only proves no new planned deployment."
      },
      semantics:"PLAN_TIME_CASH_ATTRIBUTION_ONLY"
    };
  }

  if(rows.length!==count||rows.some(x=>!x.symbol||x.allocation===null||x.allocation<0)){
    return {status:"UNKNOWN",reason:"PLAN_ROW_COUNT_OR_ALLOCATION_INCOMPLETE"};
  }

  const planned=rows.reduce((s,x)=>s+x.allocation,0);
  if(planned>capital+1e-8) return {status:"INVALID",reason:"PLANNED_DEPLOYMENT_EXCEEDS_CAPITAL"};

  const target=capital*deployRatioForCount(count);
  const strategic=Math.max(0,capital-target);
  const implementation=Math.max(0,target-planned);
  const aboveTarget=Math.max(0,planned-target);
  const plannedCash=Math.max(0,capital-planned);

  let capSplit={status:"UNKNOWN",reason:"MISSING_PRIORITY_SCORE_OR_RECONSTRUCTION_MISMATCH",capInducedReserveNTD:null,thousandFloorReserveNTD:null};
  if(rows.every(x=>x.priorityScore!==null)){
    const cf=scoreCapReserve(rows.map(x=>({symbol:x.symbol,priorityScore:x.priorityScore})),capital);
    const plannedBySymbol=new Map(rows.map(x=>[x.symbol,x.allocation]));
    const exact=cf.status==="READY" &&
      cf.details.length===rows.length &&
      cf.details.every(x=>plannedBySymbol.get(x.symbol)===x.plannedAllocationNTD) &&
      Math.abs(cf.plannedAllocationNTD-planned)<1e-8;
    if(exact){
      capSplit={
        status:"READY",
        capInducedReserveNTD:round(cf.capInducedReserveNTD,4),
        thousandFloorReserveNTD:round(cf.thousandFloorReserveNTD,4),
        capBindingSymbols:cf.capBindingSymbols
      };
    }
  }

  const accountingResidual=capital-(planned+strategic+implementation-aboveTarget);
  return {
    status:Math.abs(accountingResidual)<1e-6?"READY":"ACCOUNTING_MISMATCH",
    scanDate:scanDate||null,selectedCount:count,totalCapitalNTD:capital,
    nominalDeployRatioPct:round(deployRatioForCount(count)*100,4),
    nominalDeployTargetNTD:round(target,2),
    plannedDeploymentNTD:round(planned,2),
    plannedCashNTD:round(plannedCash,2),
    designedStrategicReserveNTD:round(strategic,2),
    allocationImplementationShortfallNTD:round(implementation,2),
    aboveNominalTargetNTD:round(aboveTarget,2),
    allocatorSplit:capSplit,
    accountingResidualNTD:round(accountingResidual,6),
    planTimeCashReason:implementation>0
      ?"DESIGNED_STRATEGIC_RESERVE_PLUS_ALLOCATION_IMPLEMENTATION_SHORTFALL"
      :"DESIGNED_STRATEGIC_RESERVE_ONLY",
    executionStateCash:{
      status:"UNKNOWN",
      amountNTD:null,
      unknownReasons:[
        "BUY/ADD may be untriggered or unfilled",
        "partial fills/order quantity are not proven",
        "REDUCE/SELL fills are not proven",
        "broker cash balance is not stored in the plan journal"
      ],
      rule:"Never subtract plannedDeployment from account capital and call the remainder actual broker cash."
    },
    semantics:"PLAN_TIME_CASH_ATTRIBUTION_ONLY"
  };
}

export function summarizePlanTimeCash(days=[]){
  const ready=(days||[]).filter(x=>x?.status==="READY");
  return {
    status:ready.length?"READY":"NO_READY_DATES",
    readyDates:ready.length,
    noOpportunityDates:ready.filter(x=>x.selectedCount===0).length,
    planDates:ready.filter(x=>x.selectedCount>0).length,
    totalDesignedReserveNTD:round(ready.reduce((s,x)=>s+(n(x.designedStrategicReserveNTD)||0),0),2),
    totalImplementationShortfallNTD:round(ready.reduce((s,x)=>s+(n(x.allocationImplementationShortfallNTD)||0),0),2),
    executionCashKnownDates:ready.filter(x=>x.executionStateCash?.amountNTD!==null).length,
    rule:"Cross-date sums are descriptive accounting totals, not a portfolio performance measure."
  };
}
