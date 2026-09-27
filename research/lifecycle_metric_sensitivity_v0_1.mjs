import {concentrationMetrics} from "./risk_metric_sensitivity_v0_1.mjs";

// FIRST / ADD / FULL × concentration-metric sensitivity — research only.
// All stages use plan-preview integer shares at buyHigh. No trigger/fill is implied.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=10){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function sym(v){return String(v??"").trim()}

export function lifecycleMetricSensitivity(plans=[],totalCapital,{
  firstTrancheRatio=0.6,gridNTD=1000,perNameCapPct=35,minUnitsPerName=1,maxStates=2000000
}={}){
  const capital=n(totalCapital),ratio=n(firstTrancheRatio),grid=n(gridNTD),capPct=n(perNameCapPct);
  if(!(capital>0)||!(ratio>0&&ratio<1)||!(grid>0)||!(capPct>0)) return {status:"UNKNOWN",reason:"INVALID_PARAMETERS"};
  const rows=(plans||[]).map(p=>{
    const symbol=sym(p?.symbol??p?.code),allocation=n(p?.totalAllocation??p?.total_allocation),buyHigh=n(p?.buyHigh??p?.buy_high),stop=n(p?.stop);
    const riskFrac=(buyHigh>0&&stop>0&&stop<buyHigh)?(buyHigh-stop)/buyHigh:null;
    return {symbol,allocation,buyHigh,stop,riskFrac};
  });
  if(rows.length<2)return {status:"INSUFFICIENT_CROSS_NAME_SAMPLE"};
  if(rows.some(x=>!x.symbol||x.allocation===null||x.allocation<0||!(x.buyHigh>0)||!(x.riskFrac>0)))return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_GEOMETRY"};

  const deployment=rows.reduce((s,x)=>s+x.allocation,0),unitsExact=deployment/grid;
  if(Math.abs(unitsExact-Math.round(unitsExact))>1e-8)return {status:"DEPLOYMENT_NOT_ON_GRID"};
  const totalUnits=Math.round(unitsExact),capUnits=Math.floor((capital*capPct/100)/grid+1e-12),minUnits=Math.max(0,Math.trunc(Number(minUnitsPerName)||0));
  const stages=["FIRST","ADD","FULL"],metrics=["HHI","GINI","CV","MAX_SHARE","MAX_MIN"];

  function stageRisks(allocs){
    const out={FIRST:[],ADD:[],FULL:[]};
    for(let i=0;i<rows.length;i++){
      const x=rows[i],allocation=allocs[i];
      const firstAmount=Math.round(allocation*ratio),addAmount=allocation-firstAmount;
      const q1=Math.floor(firstAmount/x.buyHigh),q2=Math.floor(addAmount/x.buyHigh);
      if(q1<1||q2<1)return null;
      out.FIRST.push(q1*x.buyHigh*x.riskFrac);
      out.ADD.push(q2*x.buyHigh*x.riskFrac);
      out.FULL.push((q1+q2)*x.buyHigh*x.riskFrac);
    }
    return out;
  }
  const currentAllocs=rows.map(x=>x.allocation),eq=deployment/rows.length,equalAllocs=rows.map(()=>eq);
  const currentRisks=stageRisks(currentAllocs),equalRisks=stageRisks(equalAllocs);
  if(!currentRisks||!equalRisks)return {status:"CURRENT_OR_EQUAL_STAGE_NOT_ORDERABLE"};

  const minima={};
  for(const stage of stages) minima[stage]=Object.fromEntries(metrics.map(m=>[m,{value:null,optima:[]}]));
  let stateCount=0;
  const units=new Array(rows.length).fill(0);

  function evaluate(){
    stateCount++; if(stateCount>maxStates)throw new Error("MAX_STATES_EXCEEDED");
    const allocs=units.map(u=>u*grid),risks=stageRisks(allocs); if(!risks)return;
    const key=allocs.map(x=>String(x).padStart(6,"0")).join("|");
    for(const stage of stages){
      const ms=concentrationMetrics(risks[stage]);
      for(const metric of metrics){
        const v=ms[metric],b=minima[stage][metric];
        const cand={allocationKey:key,allocationsNTD:Object.fromEntries(rows.map((x,i)=>[x.symbol,allocs[i]])),value:v};
        if(b.value===null||v<b.value-1e-12){b.value=v;b.optima=[cand]}
        else if(Math.abs(v-b.value)<=1e-12)b.optima.push(cand);
      }
    }
  }
  function dfs(i,remaining){
    if(i===rows.length-1){if(remaining<minUnits||remaining>capUnits)return;units[i]=remaining;evaluate();return}
    const left=rows.length-i-1,lo=Math.max(minUnits,remaining-capUnits*left),hi=Math.min(capUnits,remaining-minUnits*left);
    for(let u=lo;u<=hi;u++){units[i]=u;dfs(i+1,remaining-u)}
  }
  try{dfs(0,totalUnits)}catch(e){if(String(e?.message)==="MAX_STATES_EXCEEDED")return {status:"STATE_SPACE_TOO_LARGE"};throw e}

  const result={status:"READY",researchOnly:true,decisionImpact:false,selectedCount:rows.length,currentDeploymentNTD:deployment,gridNTD:grid,perNameCapPct:capPct,firstTrancheRatio:ratio,feasibleStates:stateCount,stages:{}};
  for(const stage of stages){
    const cm=concentrationMetrics(currentRisks[stage]),em=concentrationMetrics(equalRisks[stage]);
    const out={metrics:{}};
    for(const metric of metrics){
      const opts=minima[stage][metric].optima.sort((a,b)=>a.allocationKey.localeCompare(b.allocationKey));
      out.metrics[metric]={
        current:cm[metric],equalCapital:em[metric],globalMin:round(minima[stage][metric].value),
        currentMinusEqual:round(cm[metric]-em[metric]),
        currentMinusGlobalMin:round(cm[metric]-minima[stage][metric].value),
        currentMoreConcentratedThanEqual:cm[metric]>em[metric]+1e-12,
        currentAboveGlobalMin:cm[metric]>minima[stage][metric].value+1e-12,
        optimumCount:opts.length,optima:opts
      };
    }
    result.stages[stage]=out;
  }
  result.directionalSummary={
    totalComparisons:stages.length*metrics.length,
    currentMoreConcentratedThanEqual:stages.reduce((s,st)=>s+metrics.filter(m=>result.stages[st].metrics[m].currentMoreConcentratedThanEqual).length,0),
    currentAboveGlobalMin:stages.reduce((s,st)=>s+metrics.filter(m=>result.stages[st].metrics[m].currentAboveGlobalMin).length,0)
  };
  result.semantics="Lifecycle-stage metric sensitivity on buyHigh plan-preview risk. FIRST/ADD/FULL are evaluated independently over the same legal NT$1,000 allocation grid. No execution is implied.";
  return result;
}
