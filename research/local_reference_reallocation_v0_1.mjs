import {concentrationMetrics} from "./risk_metric_sensitivity_v0_1.mjs";

// Local NT$1,000 reallocation × entry-reference sensitivity — research only.
// Uses allocation×stop-distance risk without share-floor semantics.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=10){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function sym(v){return String(v??"").trim()}
const REFS=["BUY_LOW","MIDPOINT","BUY_HIGH"],METRICS=["HHI","GINI","CV","MAX_SHARE","MAX_MIN"];
function refPrice(x,ref){return ref==="BUY_LOW"?x.buyLow:ref==="MIDPOINT"?(x.buyLow+x.buyHigh)/2:ref==="BUY_HIGH"?x.buyHigh:null}

export function localReferenceReallocation(plans=[],totalCapital,{gridNTD=1000,perNameCapPct=35,minAllocationNTD=1000,tolerance=1e-12}={}){
  const capital=n(totalCapital),grid=n(gridNTD),capPct=n(perNameCapPct),minAlloc=n(minAllocationNTD);
  if(!(capital>0)||!(grid>0)||!(capPct>0)||!(minAlloc>=0))return {status:"UNKNOWN",reason:"INVALID_PARAMETERS"};
  const rows=(plans||[]).map(p=>({symbol:sym(p?.symbol??p?.code),allocation:n(p?.totalAllocation??p?.total_allocation),buyLow:n(p?.buyLow??p?.buy_low),buyHigh:n(p?.buyHigh??p?.buy_high),stop:n(p?.stop)}));
  if(rows.length<2)return {status:"INSUFFICIENT_CROSS_NAME_SAMPLE"};
  if(rows.some(x=>!x.symbol||x.allocation===null||x.allocation<minAlloc||!(x.buyLow>0)||!(x.buyHigh>=x.buyLow)||!(x.stop>0)))return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_GEOMETRY"};
  const capNTD=capital*capPct/100;

  const fracs={};
  for(const ref of REFS){
    fracs[ref]=rows.map(x=>{const p=refPrice(x,ref);return p>0&&x.stop<p?(p-x.stop)/p:null});
    if(fracs[ref].some(x=>!(x>0)))return {status:"UNKNOWN",reason:"STOP_NOT_BELOW_REFERENCE",reference:ref};
  }
  function metricsFor(allocs){
    const out={};
    for(const ref of REFS){
      const risks=allocs.map((a,i)=>a*fracs[ref][i]);
      out[ref]=concentrationMetrics(risks);
    }
    return out;
  }
  const currentAllocs=rows.map(x=>x.allocation),current=metricsFor(currentAllocs);
  const moves=[];
  for(let from=0;from<rows.length;from++)for(let to=0;to<rows.length;to++){
    if(from===to)continue;
    const allocs=[...currentAllocs];
    if(allocs[from]-grid<minAlloc-1e-8||allocs[to]+grid>capNTD+1e-8)continue;
    allocs[from]-=grid;allocs[to]+=grid;
    const cand=metricsFor(allocs),improved=[],worsened=[],unchanged=[],deltas={};
    for(const ref of REFS){
      deltas[ref]={};
      for(const metric of METRICS){
        const d=cand[ref][metric]-current[ref][metric];deltas[ref][metric]=round(d);
        const key=ref+"."+metric;
        if(d<-tolerance)improved.push(key);else if(d>tolerance)worsened.push(key);else unchanged.push(key);
      }
    }
    moves.push({
      from:rows[from].symbol,to:rows[to].symbol,gridNTD:grid,
      allocationsNTD:Object.fromEntries(rows.map((x,i)=>[x.symbol,allocs[i]])),
      improvedCount:improved.length,worsenedCount:worsened.length,unchangedCount:unchanged.length,
      weaklyDominatesCurrent:worsened.length===0&&improved.length>0,
      strictlyImprovesAll:improved.length===REFS.length*METRICS.length,
      strictlyWorsensAll:worsened.length===REFS.length*METRICS.length,
      improved,worsened,unchanged,deltas
    });
  }
  moves.sort((a,b)=>b.improvedCount-a.improvedCount||a.worsenedCount-b.worsenedCount||a.from.localeCompare(b.from)||a.to.localeCompare(b.to));
  const dominating=moves.filter(x=>x.weaklyDominatesCurrent);
  return {
    status:"READY",researchOnly:true,decisionImpact:false,
    gridNTD:grid,perNameCapPct:capPct,currentAllocationsNTD:Object.fromEntries(rows.map(x=>[x.symbol,x.allocation])),
    references:REFS,metrics:METRICS,totalCells:REFS.length*METRICS.length,
    legalOneStepMoves:moves.length,currentParetoLocalOptimumAcrossReferences:dominating.length===0,
    dominatingOneStepMoves:dominating.map(x=>({from:x.from,to:x.to,improvedCount:x.improvedCount,worsenedCount:x.worsenedCount,strictlyImprovesAll:x.strictlyImprovesAll})),
    moves,
    semantics:"Pre-share allocation×stop-distance concentration across buyLow/midpoint/buyHigh. One-grid local robustness only; no share/order/fill/economic-return inference."
  };
}
