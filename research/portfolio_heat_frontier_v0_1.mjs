// Portfolio heat vs concentration frontier v0.1 — research-only.
// Enumerates legal same-deployment NT$1,000-grid allocations and tests Pareto dominance
// in plan-time projected stop-risk heat and concentration. No return/alpha assumptions.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function sym(v){return String(v??"").trim()}
function round(v,d=10){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function hhi(xs){const t=xs.reduce((a,b)=>a+b,0);return t>0?xs.reduce((s,x)=>s+(x/t)**2,0):null}
function gini(xs){const a=[...xs].sort((x,y)=>x-y),n=a.length,sum=a.reduce((s,x)=>s+x,0);if(!(sum>0))return null;let w=0;for(let i=0;i<n;i++)w+=(i+1)*a[i];return 2*w/(n*sum)-(n+1)/n}
function cv(xs){const m=xs.reduce((s,x)=>s+x,0)/xs.length;if(!(m>0))return null;const v=xs.reduce((s,x)=>s+(x-m)**2,0)/xs.length;return Math.sqrt(v)/m}
function metrics(risks,totalCapital){
  const total=risks.reduce((a,b)=>a+b,0),mx=Math.max(...risks),mn=Math.min(...risks.filter(x=>x>0));
  return {
    totalProjectedRiskNTD:round(total,4),
    heatPctOfCapital:round(total/totalCapital*100,6),
    hhi:round(hhi(risks),10),
    gini:round(gini(risks),10),
    cv:round(cv(risks),10),
    maxRiskShare:round(mx/total,10),
    maxMin:round(mx/mn,10)
  };
}
function dominates(a,b,keys){
  let strict=false;
  for(const k of keys){
    if(a[k]>b[k]+1e-12)return false;
    if(a[k]<b[k]-1e-12)strict=true;
  }
  return strict;
}
export function portfolioHeatFrontier(plans=[],totalCapital,{
  gridNTD=1000,perNameCapPct=35,minUnitsPerName=1,maxStates=2000000,
  concentrationMetric="hhi"
}={}){
  const capital=n(totalCapital),grid=n(gridNTD),cap=n(perNameCapPct);
  if(!(capital>0)||!(grid>0)||!(cap>0))return {status:"UNKNOWN",reason:"INVALID_PARAMETERS"};
  const rows=(plans||[]).map(p=>{
    const buyHigh=n(p?.buyHigh??p?.buy_high),stop=n(p?.stop);
    return {symbol:sym(p?.symbol??p?.code),allocation:n(p?.totalAllocation??p?.total_allocation),buyHigh,stop,
      riskFrac:(buyHigh>0&&stop>0&&stop<buyHigh)?(buyHigh-stop)/buyHigh:null};
  });
  if(rows.length<2)return {status:"INSUFFICIENT_CROSS_NAME_SAMPLE"};
  if(rows.some(x=>!x.symbol||x.allocation===null||x.allocation<0||!(x.riskFrac>0)))return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_GEOMETRY"};
  const deployment=rows.reduce((s,x)=>s+x.allocation,0), unitsExact=deployment/grid;
  if(Math.abs(unitsExact-Math.round(unitsExact))>1e-8)return {status:"DEPLOYMENT_NOT_ON_GRID"};
  const totalUnits=Math.round(unitsExact),capUnits=Math.floor((capital*cap/100)/grid+1e-12),minUnits=Math.max(0,Math.trunc(minUnitsPerName));
  if(totalUnits<rows.length*minUnits||totalUnits>rows.length*capUnits)return {status:"INFEASIBLE_GRID_CAPACITY"};

  const currentRisks=rows.map(x=>x.allocation*x.riskFrac),currentMetrics=metrics(currentRisks,capital);
  const states=[],units=new Array(rows.length).fill(0);
  function evalState(){
    if(states.length>=maxStates)throw new Error("MAX_STATES_EXCEEDED");
    const allocations=units.map(u=>u*grid),risks=allocations.map((a,i)=>a*rows[i].riskFrac),m=metrics(risks,capital);
    states.push({allocationsNTD:Object.fromEntries(rows.map((x,i)=>[x.symbol,allocations[i]])),...m});
  }
  function dfs(i,remaining){
    if(i===rows.length-1){if(remaining<minUnits||remaining>capUnits)return;units[i]=remaining;evalState();return}
    const left=rows.length-i-1,lo=Math.max(minUnits,remaining-capUnits*left),hi=Math.min(capUnits,remaining-minUnits*left);
    for(let u=lo;u<=hi;u++){units[i]=u;dfs(i+1,remaining-u)}
  }
  try{dfs(0,totalUnits)}catch(e){if(String(e?.message)==="MAX_STATES_EXCEEDED")return {status:"STATE_SPACE_TOO_LARGE"};throw e}

  const keys=["heatPctOfCapital",concentrationMetric];
  const dominators=states.filter(s=>dominates(s,currentMetrics,keys)).sort((a,b)=>{
    const da=(currentMetrics.heatPctOfCapital-a.heatPctOfCapital)+(currentMetrics[concentrationMetric]-a[concentrationMetric]);
    const db=(currentMetrics.heatPctOfCapital-b.heatPctOfCapital)+(currentMetrics[concentrationMetric]-b[concentrationMetric]);
    return db-da;
  });
  const frontier=states.filter((s,i)=>!states.some((o,j)=>j!==i&&dominates(o,s,keys)))
    .sort((a,b)=>a.heatPctOfCapital-b.heatPctOfCapital||a[concentrationMetric]-b[concentrationMetric]);
  const oneGrid=states.filter(s=>{
    let moved=0;
    for(const row of rows)moved+=Math.abs((s.allocationsNTD[row.symbol]||0)-row.allocation);
    return Math.abs(moved-2*grid)<1e-8;
  });
  const localDominators=oneGrid.filter(s=>dominates(s,currentMetrics,keys));
  return {
    status:"READY",researchOnly:true,decisionImpact:false,
    selectedCount:rows.length,totalCapitalNTD:capital,currentDeploymentNTD:deployment,
    metricPair:["heatPctOfCapital",concentrationMetric],
    current:{allocationsNTD:Object.fromEntries(rows.map(x=>[x.symbol,x.allocation])),...currentMetrics},
    legalStates:states.length,
    paretoFrontierCount:frontier.length,
    paretoDominatingStates:dominators.length,
    oneGridNeighbors:oneGrid.length,
    oneGridDominatingStates:localDominators.length,
    bestDominators:dominators.slice(0,20),
    localDominators,
    frontier,
    currentParetoDominated:dominators.length>0,
    currentLocallyParetoDominated:localDominators.length>0,
    semantics:"Plan-time projected stop-risk only. Pareto dominance in heat/concentration does not establish economic dominance because expected-return/alpha differences are not modeled."
  };
}
