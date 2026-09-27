import {concentrationMetrics} from "./risk_metric_sensitivity_v0_1.mjs";

// One-grid local reallocation falsification — research only.
// Tests whether current allocation is even a local concentration optimum under the Formal NT$1,000 grid.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=10){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function sym(v){return String(v??"").trim()}
const STAGES=["FIRST","ADD","FULL"],METRICS=["HHI","GINI","CV","MAX_SHARE","MAX_MIN"];

export function localGridReallocation(plans=[],totalCapital,{
  firstTrancheRatio=0.6,gridNTD=1000,perNameCapPct=35,minAllocationNTD=1000,tolerance=1e-12
}={}){
  const capital=n(totalCapital),ratio=n(firstTrancheRatio),grid=n(gridNTD),capPct=n(perNameCapPct),minAlloc=n(minAllocationNTD);
  if(!(capital>0)||!(ratio>0&&ratio<1)||!(grid>0)||!(capPct>0)||!(minAlloc>=0)) return {status:"UNKNOWN",reason:"INVALID_PARAMETERS"};
  const rows=(plans||[]).map(p=>{
    const symbol=sym(p?.symbol??p?.code),allocation=n(p?.totalAllocation??p?.total_allocation),buyHigh=n(p?.buyHigh??p?.buy_high),stop=n(p?.stop);
    const riskFrac=(buyHigh>0&&stop>0&&stop<buyHigh)?(buyHigh-stop)/buyHigh:null;
    return {symbol,allocation,buyHigh,stop,riskFrac};
  });
  if(rows.length<2)return {status:"INSUFFICIENT_CROSS_NAME_SAMPLE"};
  if(rows.some(x=>!x.symbol||x.allocation===null||x.allocation<minAlloc||!(x.buyHigh>0)||!(x.riskFrac>0)))return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_GEOMETRY"};
  const capNTD=capital*capPct/100;

  function metricsFor(allocs){
    const risks={FIRST:[],ADD:[],FULL:[]};
    for(let i=0;i<rows.length;i++){
      const x=rows[i],allocation=allocs[i];
      const firstAmount=Math.round(allocation*ratio),addAmount=allocation-firstAmount;
      const q1=Math.floor(firstAmount/x.buyHigh),q2=Math.floor(addAmount/x.buyHigh);
      if(q1<1||q2<1)return null;
      risks.FIRST.push(q1*x.buyHigh*x.riskFrac);
      risks.ADD.push(q2*x.buyHigh*x.riskFrac);
      risks.FULL.push((q1+q2)*x.buyHigh*x.riskFrac);
    }
    return Object.fromEntries(STAGES.map(st=>[st,concentrationMetrics(risks[st])]));
  }

  const currentAllocs=rows.map(x=>x.allocation),currentMetrics=metricsFor(currentAllocs);
  if(!currentMetrics)return {status:"CURRENT_STAGE_NOT_ORDERABLE"};
  const moves=[];
  for(let from=0;from<rows.length;from++){
    for(let to=0;to<rows.length;to++){
      if(from===to)continue;
      const allocs=[...currentAllocs];
      if(allocs[from]-grid<minAlloc-1e-8)continue;
      if(allocs[to]+grid>capNTD+1e-8)continue;
      allocs[from]-=grid;allocs[to]+=grid;
      const candidate=metricsFor(allocs);if(!candidate)continue;
      const deltas={},improved=[],worsened=[],unchanged=[];
      for(const st of STAGES){
        deltas[st]={};
        for(const metric of METRICS){
          const d=candidate[st][metric]-currentMetrics[st][metric];
          deltas[st][metric]=round(d);
          const key=st+"."+metric;
          if(d<-tolerance)improved.push(key);
          else if(d>tolerance)worsened.push(key);
          else unchanged.push(key);
        }
      }
      moves.push({
        from:rows[from].symbol,to:rows[to].symbol,gridNTD:grid,
        allocationsNTD:Object.fromEntries(rows.map((x,i)=>[x.symbol,allocs[i]])),
        improvedCount:improved.length,worsenedCount:worsened.length,unchangedCount:unchanged.length,
        weaklyDominatesCurrent:worsened.length===0&&improved.length>0,
        strictlyImprovesAll:improved.length===STAGES.length*METRICS.length,
        strictlyWorsensAll:worsened.length===STAGES.length*METRICS.length,
        improved,worsened,unchanged,deltas
      });
    }
  }
  moves.sort((a,b)=>b.improvedCount-a.improvedCount||a.worsenedCount-b.worsenedCount||a.from.localeCompare(b.from)||a.to.localeCompare(b.to));
  const dominating=moves.filter(x=>x.weaklyDominatesCurrent);
  return {
    status:"READY",researchOnly:true,decisionImpact:false,
    gridNTD:grid,perNameCapPct:capPct,currentAllocationsNTD:Object.fromEntries(rows.map(x=>[x.symbol,x.allocation])),
    stageMetricCells:STAGES.length*METRICS.length,legalOneStepMoves:moves.length,
    currentParetoLocalOptimum:dominating.length===0,
    dominatingOneStepMoves:dominating.map(x=>({from:x.from,to:x.to,improvedCount:x.improvedCount,worsenedCount:x.worsenedCount,strictlyImprovesAll:x.strictlyImprovesAll})),
    moves,
    semantics:"One NT$grid transfer neighborhood under fixed total deployment and per-name cap. Improvement means lower concentration metric on plan-preview buyHigh risk; this is not an economic-return recommendation."
  };
}
