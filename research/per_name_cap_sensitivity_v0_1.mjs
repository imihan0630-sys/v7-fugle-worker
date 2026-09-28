// Per-name cap sensitivity v0.1 — research-only.
// Tests whether structural projected-risk concentration is a special artifact of the Formal 35% per-name cap.
// Uses same selected names, same planned deployment, NT$1,000 grid, 60/40 share flooring at buyHigh.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function sym(v){return String(v??"").trim()}
function round(v,d=10){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function hhi(xs){const t=xs.reduce((a,b)=>a+b,0);return t>0?xs.reduce((s,x)=>s+(x/t)**2,0):null}
function maxMin(xs){const p=xs.filter(x=>x>0);return p.length>=2?Math.max(...p)/Math.min(...p):null}
function preview(row,allocation,firstRatio){
  const first=Math.round(allocation*firstRatio);
  const second=allocation-first;
  const firstShares=Math.floor(first/row.buyHigh);
  const secondShares=Math.floor(second/row.buyHigh);
  const notional=(firstShares+secondShares)*row.buyHigh;
  return {firstShares,secondShares,notional,risk:notional*row.riskFrac,bothStagesOrderable:firstShares>=1&&secondShares>=1};
}

export function perNameCapSensitivity(plans=[],totalCapital,{
  capsPct=Array.from({length:19},(_,i)=>32+i),
  gridNTD=1000,
  firstTrancheRatio=0.6,
  minUnitsPerName=1,
  maxStates=2000000
}={}){
  const capital=n(totalCapital),grid=n(gridNTD),ratio=n(firstTrancheRatio);
  if(!(capital>0)||!(grid>0)||!(ratio>0&&ratio<1)) return {status:"UNKNOWN",reason:"INVALID_PARAMETERS"};
  const caps=(capsPct||[]).map(n);
  if(!caps.length||caps.some(x=>!(x>0&&x<=100))) return {status:"UNKNOWN",reason:"INVALID_CAPS"};

  const rows=(plans||[]).map(p=>{
    const buyHigh=n(p?.buyHigh??p?.buy_high),stop=n(p?.stop);
    return {
      symbol:sym(p?.symbol??p?.code),
      allocation:n(p?.totalAllocation??p?.total_allocation),
      buyHigh,stop,
      riskFrac:(buyHigh>0&&stop>0&&stop<buyHigh)?(buyHigh-stop)/buyHigh:null
    };
  });
  if(rows.length<2) return {status:"INSUFFICIENT_CROSS_NAME_SAMPLE"};
  if(rows.some(x=>!x.symbol||x.allocation===null||x.allocation<0||!(x.buyHigh>0)||!(x.riskFrac>0))) return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_GEOMETRY"};

  const deployment=rows.reduce((s,x)=>s+x.allocation,0);
  const unitsExact=deployment/grid;
  if(Math.abs(unitsExact-Math.round(unitsExact))>1e-8) return {status:"DEPLOYMENT_NOT_ON_GRID"};
  const totalUnits=Math.round(unitsExact);
  const minUnits=Math.max(0,Math.trunc(Number(minUnitsPerName)||0));

  const currentPreview=rows.map(x=>preview(x,x.allocation,ratio));
  const currentRisks=currentPreview.map(x=>x.risk);
  const currentHHI=hhi(currentRisks);
  const currentMaxAllocation=Math.max(...rows.map(x=>x.allocation));
  const currentMaxAllocationPct=currentMaxAllocation/capital*100;

  const out={
    status:"READY",researchOnly:true,decisionImpact:false,
    selectedCount:rows.length,totalCapitalNTD:capital,currentDeploymentNTD:deployment,
    currentMaxAllocationPct:round(currentMaxAllocationPct,6),
    currentProjectedRiskHHI:round(currentHHI,10),
    gridNTD:grid,firstTrancheRatio:ratio,caps:{}
  };

  for(const capPct of caps){
    const capUnits=Math.floor((capital*capPct/100)/grid+1e-12);
    const currentFeasible=rows.every(x=>x.allocation<=capUnits*grid+1e-8);
    if(totalUnits<rows.length*minUnits||totalUnits>rows.length*capUnits){
      out.caps[String(capPct)]={status:"INFEASIBLE_CAPACITY",capPct,currentFeasible};
      continue;
    }

    let stateCount=0,stageFeasibleStates=0,minHHI=null,optima=[];
    const units=new Array(rows.length).fill(0);
    function evaluate(){
      stateCount++;
      if(stateCount>maxStates) throw new Error("MAX_STATES_EXCEEDED");
      const alloc=units.map(u=>u*grid);
      const p=rows.map((x,i)=>preview(x,alloc[i],ratio));
      if(p.some(x=>!x.bothStagesOrderable)) return;
      stageFeasibleStates++;
      const risks=p.map(x=>x.risk),hv=hhi(risks);
      const cand={
        allocationsNTD:Object.fromEntries(rows.map((x,i)=>[x.symbol,alloc[i]])),
        previewNotionalNTD:round(p.reduce((s,x)=>s+x.notional,0),4),
        projectedRiskNTD:round(risks.reduce((s,x)=>s+x,0),4),
        projectedRiskHHI:round(hv,10),
        maxToMinProjectedRiskRatio:round(maxMin(risks),8)
      };
      if(minHHI===null||hv<minHHI-1e-12){minHHI=hv;optima=[cand]}
      else if(Math.abs(hv-minHHI)<=1e-12)optima.push(cand);
    }
    function dfs(i,remaining){
      if(i===rows.length-1){
        if(remaining<minUnits||remaining>capUnits)return;
        units[i]=remaining;evaluate();return;
      }
      const left=rows.length-i-1;
      const lo=Math.max(minUnits,remaining-capUnits*left);
      const hi=Math.min(capUnits,remaining-minUnits*left);
      for(let u=lo;u<=hi;u++){units[i]=u;dfs(i+1,remaining-u)}
    }
    try{dfs(0,totalUnits)}catch(e){
      if(String(e?.message)==="MAX_STATES_EXCEEDED"){out.caps[String(capPct)]={status:"STATE_SPACE_TOO_LARGE",capPct,stateCount,currentFeasible};continue}
      throw e;
    }
    optima.sort((a,b)=>JSON.stringify(a.allocationsNTD).localeCompare(JSON.stringify(b.allocationsNTD)));
    out.caps[String(capPct)]={
      status:minHHI===null?"NO_TWO_STAGE_FEASIBLE_STATE":"READY",
      capPct,currentFeasible,legalStates:stateCount,twoStageFeasibleStates:stageFeasibleStates,
      globalMinHHI:minHHI===null?null:round(minHHI,10),
      optimumCount:optima.length,optima,
      currentMinusGlobalMinHHI:(currentFeasible&&minHHI!==null)?round(currentHHI-minHHI,10):null,
      currentAboveGlobalMin:(currentFeasible&&minHHI!==null)?currentHHI>minHHI+1e-12:null
    };
  }

  const comparable=Object.values(out.caps).filter(x=>x.status==="READY"&&x.currentFeasible);
  out.summary={
    comparableCaps:comparable.length,
    currentAboveGlobalMinCount:comparable.filter(x=>x.currentAboveGlobalMin).length,
    minTestedFeasibleCapPct:comparable.length?Math.min(...comparable.map(x=>x.capPct)):null,
    maxTestedFeasibleCapPct:comparable.length?Math.max(...comparable.map(x=>x.capPct)):null
  };
  out.semantics="Post-share 60/40 plan-preview projected-risk cap sensitivity. Only cap values under which the current allocation itself remains legal are valid current-vs-global comparisons. No fills/outcomes.";
  return out;
}
