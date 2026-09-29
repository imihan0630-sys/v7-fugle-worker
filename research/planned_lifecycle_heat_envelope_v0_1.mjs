// Plan-time FIRST/ADD/FULL lifecycle heat envelope v0.1 — research-only.
// Reconstructs planned risk envelopes only. Does not infer actual stage transitions or fills.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function sym(v){return String(v??"").trim()}
function round(v,d=6){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}

function stageRow(p,ratio){
  const symbol=sym(p?.symbol??p?.code);
  const allocation=n(p?.totalAllocation??p?.total_allocation);
  const buyHigh=n(p?.buyHigh??p?.buy_high);
  const stop=n(p?.stop);
  if(!symbol||allocation===null||allocation<0||!(buyHigh>0)||!(stop>0)||stop>=buyHigh)return null;
  const riskFrac=(buyHigh-stop)/buyHigh;
  const firstAmount=Math.round(allocation*ratio);
  const addAmount=allocation-firstAmount;
  const firstShares=Math.floor(firstAmount/buyHigh);
  const addShares=Math.floor(addAmount/buyHigh);
  const firstNotional=firstShares*buyHigh;
  const addNotional=addShares*buyHigh;
  const fullNotional=firstNotional+addNotional;
  return {
    symbol,allocation,buyHigh,stop,riskFrac,
    firstAmount,addAmount,firstShares,addShares,
    firstNotional,addNotional,fullNotional,
    firstRisk:firstNotional*riskFrac,
    addRisk:addNotional*riskFrac,
    fullRisk:fullNotional*riskFrac
  };
}

export function plannedLifecycleHeatEnvelope(plans=[],totalCapital,{firstRatio=0.6}={}){
  const capital=n(totalCapital),ratio=n(firstRatio);
  if(!(capital>0)||!(ratio>0&&ratio<1))return {status:"UNKNOWN",reason:"INVALID_PARAMETERS"};
  if(!Array.isArray(plans))return {status:"UNKNOWN",reason:"INVALID_PLANS"};
  if(plans.length===0){
    return {
      status:"READY",selectedCount:0,firstRatio:ratio,addRatio:1-ratio,
      FIRST:{plannedNotionalNTD:0,plannedProjectedRiskNTD:0,totalCapitalHeatPct:0},
      ADD_INCREMENT:{plannedNotionalNTD:0,plannedProjectedRiskNTD:0,totalCapitalHeatPct:0},
      FULL:{plannedNotionalNTD:0,plannedProjectedRiskNTD:0,totalCapitalHeatPct:0},
      lifecycleTransitionStatus:"NOT_OBSERVED_NO_SELECTED_PLAN",
      actualLifecycleStatus:"UNKNOWN_WITHOUT_FILL_HOLDINGS_PROVENANCE",
      semantics:"Zero selected plan means zero planned lifecycle envelope; not proof of zero live portfolio risk."
    };
  }
  const rows=plans.map(p=>stageRow(p,ratio));
  if(rows.some(x=>x===null))return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_GEOMETRY"};
  const sum=k=>rows.reduce((s,x)=>s+x[k],0);
  const firstRisk=sum("firstRisk"),addRisk=sum("addRisk"),fullRisk=sum("fullRisk");
  const firstNotional=sum("firstNotional"),addNotional=sum("addNotional"),fullNotional=sum("fullNotional");
  const conservationRisk=fullRisk-(firstRisk+addRisk);
  const conservationNotional=fullNotional-(firstNotional+addNotional);
  return {
    status:"READY",selectedCount:rows.length,firstRatio:ratio,addRatio:1-ratio,
    FIRST:{
      plannedNotionalNTD:round(firstNotional,2),
      plannedProjectedRiskNTD:round(firstRisk,4),
      totalCapitalHeatPct:round(firstRisk/capital*100,6)
    },
    ADD_INCREMENT:{
      plannedNotionalNTD:round(addNotional,2),
      plannedProjectedRiskNTD:round(addRisk,4),
      totalCapitalHeatPct:round(addRisk/capital*100,6),
      conditionalMeaning:"Risk envelope added only if ADD becomes valid and executes; not assumed to occur."
    },
    FULL:{
      plannedNotionalNTD:round(fullNotional,2),
      plannedProjectedRiskNTD:round(fullRisk,4),
      totalCapitalHeatPct:round(fullRisk/capital*100,6)
    },
    conservation:{
      fullMinusFirstPlusAddRiskNTD:round(conservationRisk,8),
      fullMinusFirstPlusAddNotionalNTD:round(conservationNotional,8),
      exactWithinTolerance:Math.abs(conservationRisk)<1e-8&&Math.abs(conservationNotional)<1e-8
    },
    rows:rows.map(x=>({
      symbol:x.symbol,firstShares:x.firstShares,addShares:x.addShares,
      firstRiskNTD:round(x.firstRisk,4),addRiskNTD:round(x.addRisk,4),fullRiskNTD:round(x.fullRisk,4)
    })),
    lifecycleTransitionStatus:"PLAN_ENVELOPE_ONLY",
    actualLifecycleStatus:"UNKNOWN_WITHOUT_FILL_HOLDINGS_PROVENANCE",
    semantics:"FIRST/ADD/FULL are plan-time envelopes at buyHigh. They do not prove that BUY filled, ADD triggered, FULL was reached, or exposure stayed at these levels."
  };
}
