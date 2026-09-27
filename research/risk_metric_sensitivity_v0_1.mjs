// Risk concentration metric sensitivity v0.1 — research-only.
// Tests whether a structural conclusion depends on HHI alone.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=10){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function sym(v){return String(v??"").trim()}
function riskRef(row,mode){
  if(mode==="BUY_LOW") return row.buyLow;
  if(mode==="MIDPOINT") return (row.buyLow+row.buyHigh)/2;
  if(mode==="BUY_HIGH") return row.buyHigh;
  return null;
}
function riskFrac(row,mode){
  const ref=riskRef(row,mode);
  if(!(ref>0)||!(row.stop>0)||row.stop>=ref) return null;
  return (ref-row.stop)/ref;
}
export function concentrationMetrics(values=[]){
  const xs=(values||[]).map(n);
  if(xs.length<2||xs.some(x=>x===null||x<0)) return null;
  const total=xs.reduce((a,b)=>a+b,0);
  if(!(total>0)) return null;
  const shares=xs.map(x=>x/total);
  const hhi=shares.reduce((s,x)=>s+x*x,0);
  let abs=0;
  for(let i=0;i<xs.length;i++) for(let j=0;j<xs.length;j++) abs+=Math.abs(xs[i]-xs[j]);
  const gini=abs/(2*xs.length*total);
  const mean=total/xs.length;
  const variance=xs.reduce((s,x)=>s+(x-mean)**2,0)/xs.length;
  const cv=Math.sqrt(variance)/mean;
  const maxShare=Math.max(...shares);
  const positive=xs.filter(x=>x>0);
  const maxMin=positive.length>=2?Math.max(...positive)/Math.min(...positive):null;
  return {HHI:round(hhi),GINI:round(gini),CV:round(cv),MAX_SHARE:round(maxShare),MAX_MIN:round(maxMin)};
}

export function exhaustiveRiskMetricSensitivity(plans=[],totalCapital,{
  gridNTD=1000,perNameCapPct=35,minUnitsPerName=1,maxStates=2000000
}={}){
  const capital=n(totalCapital),grid=n(gridNTD),capPct=n(perNameCapPct);
  if(!(capital>0)||!(grid>0)||!(capPct>0)) return {status:"UNKNOWN",reason:"INVALID_PARAMETERS"};
  const rows=(plans||[]).map(p=>({
    symbol:sym(p?.symbol??p?.code),
    allocation:n(p?.totalAllocation??p?.total_allocation),
    buyLow:n(p?.buyLow??p?.buy_low),
    buyHigh:n(p?.buyHigh??p?.buy_high),
    stop:n(p?.stop)
  }));
  if(rows.length<2) return {status:"INSUFFICIENT_CROSS_NAME_SAMPLE"};
  if(rows.some(x=>!x.symbol||x.allocation===null||x.allocation<0||!(x.buyLow>0)||!(x.buyHigh>=x.buyLow)||!(x.stop>0))){
    return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_GEOMETRY"};
  }
  const deployment=rows.reduce((s,x)=>s+x.allocation,0);
  const unitsExact=deployment/grid;
  if(Math.abs(unitsExact-Math.round(unitsExact))>1e-8) return {status:"DEPLOYMENT_NOT_ON_GRID"};
  const totalUnits=Math.round(unitsExact);
  const capUnits=Math.floor((capital*capPct/100)/grid+1e-12);
  const minUnits=Math.max(0,Math.trunc(Number(minUnitsPerName)||0));
  if(totalUnits<rows.length*minUnits||totalUnits>rows.length*capUnits) return {status:"INFEASIBLE_GRID_CAPACITY"};

  const modes=["BUY_LOW","MIDPOINT","BUY_HIGH"], metricNames=["HHI","GINI","CV","MAX_SHARE","MAX_MIN"];
  const result={status:"READY",researchOnly:true,decisionImpact:false,selectedCount:rows.length,currentDeploymentNTD:deployment,gridNTD:grid,perNameCapPct:capPct,modes:{}};

  for(const mode of modes){
    const fracs=rows.map(x=>riskFrac(x,mode));
    if(fracs.some(x=>x===null||!(x>0))){result.modes[mode]={status:"UNKNOWN"};continue}
    const currentRisks=rows.map((x,i)=>x.allocation*fracs[i]);
    const eqAlloc=deployment/rows.length;
    const equalRisks=rows.map((x,i)=>eqAlloc*fracs[i]);
    const minima=Object.fromEntries(metricNames.map(m=>[m,{value:null,optima:[]}]));
    let stateCount=0;
    const units=new Array(rows.length).fill(0);
    function evaluate(){
      stateCount++;
      if(stateCount>maxStates) throw new Error("MAX_STATES_EXCEEDED");
      const alloc=units.map(u=>u*grid);
      const risks=alloc.map((a,i)=>a*fracs[i]);
      const metrics=concentrationMetrics(risks);
      const key=alloc.map(x=>String(x).padStart(6,"0")).join("|");
      for(const name of metricNames){
        const v=metrics[name];
        const bucket=minima[name];
        const cand={allocationKey:key,allocationsNTD:Object.fromEntries(rows.map((x,i)=>[x.symbol,alloc[i]])),value:v};
        if(bucket.value===null||v<bucket.value-1e-12){bucket.value=v;bucket.optima=[cand]}
        else if(Math.abs(v-bucket.value)<=1e-12) bucket.optima.push(cand);
      }
    }
    function dfs(i,remaining){
      if(i===rows.length-1){
        if(remaining<minUnits||remaining>capUnits) return;
        units[i]=remaining;evaluate();return;
      }
      const left=rows.length-i-1;
      const lo=Math.max(minUnits,remaining-capUnits*left);
      const hi=Math.min(capUnits,remaining-minUnits*left);
      for(let u=lo;u<=hi;u++){units[i]=u;dfs(i+1,remaining-u)}
    }
    try{dfs(0,totalUnits)}catch(e){
      if(String(e?.message)==="MAX_STATES_EXCEEDED"){result.modes[mode]={status:"STATE_SPACE_TOO_LARGE",stateCount};continue}
      throw e;
    }
    const current=concentrationMetrics(currentRisks),equal=concentrationMetrics(equalRisks);
    const metrics={};
    for(const name of metricNames){
      const opts=minima[name].optima.sort((a,b)=>a.allocationKey.localeCompare(b.allocationKey));
      metrics[name]={
        current:current[name],
        equalCapital:equal[name],
        globalMin:round(minima[name].value),
        currentMinusEqual:round(current[name]-equal[name]),
        currentMinusGlobalMin:round(current[name]-minima[name].value),
        currentMoreConcentratedThanEqual:current[name]>equal[name]+1e-12,
        currentAboveGlobalMin:current[name]>minima[name].value+1e-12,
        optimumCount:opts.length,
        optima:opts
      };
    }
    result.modes[mode]={status:"READY",feasibleStates:stateCount,metrics};
  }
  result.semantics="Metric-sensitivity of plan-time projected stop-risk concentration. HHI/Gini/CV/max contribution share/max-min are evaluated independently over the same legal NT$1,000 grid. Exact optima need not agree; direction is the falsification target.";
  return result;
}
