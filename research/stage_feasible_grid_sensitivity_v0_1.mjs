// Two-stage-feasible exhaustive grid minima v0.1 — research-only.
// Adds the execution-feasibility constraint that every selected name must have >=1 FIRST share
// and >=1 ADD share at buyHigh for the tested tranche ratio.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function sym(v){return String(v??"").trim()}
function round(v,d=10){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function hhi(xs){const t=xs.reduce((a,b)=>a+b,0);return t>0?xs.reduce((s,x)=>s+(x/t)**2,0):null}
function maxMin(xs){const p=xs.filter(x=>x>0);return p.length>=2?Math.max(...p)/Math.min(...p):null}

function preview(row,allocation,ratio){
  const first=Math.round(allocation*ratio);
  const add=allocation-first;
  const firstShares=Math.floor(first/row.buyHigh);
  const addShares=Math.floor(add/row.buyHigh);
  const firstNotional=firstShares*row.buyHigh;
  const addNotional=addShares*row.buyHigh;
  return {
    first,add,firstShares,addShares,
    bothStagesOrderable:firstShares>=1&&addShares>=1,
    notional:firstNotional+addNotional,
    risk:(firstNotional+addNotional)*row.riskFrac
  };
}

export function stageFeasibleGridSensitivity(plans=[],totalCapital,{
  ratios=[0.05,0.10,0.15,0.20,0.25,0.30,0.35,0.40,0.45,0.50,0.55,0.60,0.65,0.70,0.75,0.80,0.85,0.90,0.95],
  gridNTD=1000,perNameCapPct=35,minUnitsPerName=1,maxStates=2000000
}={}){
  const capital=n(totalCapital),grid=n(gridNTD),capPct=n(perNameCapPct);
  if(!(capital>0)||!(grid>0)||!(capPct>0)) return {status:"UNKNOWN",reason:"INVALID_PARAMETERS"};
  const rs=(ratios||[]).map(n);
  if(!rs.length||rs.some(r=>!(r>0&&r<1))) return {status:"UNKNOWN",reason:"INVALID_RATIOS"};
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
  if(rows.some(x=>!x.symbol||x.allocation===null||x.allocation<0||!(x.buyHigh>0)||!(x.riskFrac>0))){
    return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_GEOMETRY"};
  }

  const deployment=rows.reduce((s,x)=>s+x.allocation,0);
  const unitsExact=deployment/grid;
  if(Math.abs(unitsExact-Math.round(unitsExact))>1e-8) return {status:"DEPLOYMENT_NOT_ON_GRID"};
  const totalUnits=Math.round(unitsExact);
  const capUnits=Math.floor((capital*capPct/100)/grid+1e-12);
  const minUnits=Math.max(0,Math.trunc(Number(minUnitsPerName)||0));
  if(totalUnits<rows.length*minUnits||totalUnits>rows.length*capUnits) return {status:"INFEASIBLE_GRID_CAPACITY"};

  const out={status:"READY",researchOnly:true,decisionImpact:false,selectedCount:rows.length,currentDeploymentNTD:deployment,gridNTD:grid,perNameCapPct:capPct,ratios:{}};

  for(const ratio of rs){
    let stateCount=0,stageFeasibleStates=0,minAll=null,minStage=null,optAll=[],optStage=[];
    const units=new Array(rows.length).fill(0);
    function evaluate(){
      stateCount++;
      if(stateCount>maxStates) throw new Error("MAX_STATES_EXCEEDED");
      const alloc=units.map(u=>u*grid);
      const p=rows.map((x,i)=>preview(x,alloc[i],ratio));
      if(p.some(x=>x.notional<=0)) return;
      const risks=p.map(x=>x.risk);
      const hv=hhi(risks);
      const candidate={
        allocationsNTD:Object.fromEntries(rows.map((x,i)=>[x.symbol,alloc[i]])),
        previewNotionalNTD:round(p.reduce((s,x)=>s+x.notional,0),4),
        projectedRiskNTD:round(risks.reduce((s,x)=>s+x,0),4),
        projectedRiskHHI:round(hv,10),
        maxToMinProjectedRiskRatio:round(maxMin(risks),8),
        allNamesBothStagesOrderable:p.every(x=>x.bothStagesOrderable)
      };
      if(minAll===null||hv<minAll-1e-12){minAll=hv;optAll=[candidate]}
      else if(Math.abs(hv-minAll)<=1e-12)optAll.push(candidate);

      if(candidate.allNamesBothStagesOrderable){
        stageFeasibleStates++;
        if(minStage===null||hv<minStage-1e-12){minStage=hv;optStage=[candidate]}
        else if(Math.abs(hv-minStage)<=1e-12)optStage.push(candidate);
      }
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
      if(String(e?.message)==="MAX_STATES_EXCEEDED"){out.ratios[String(ratio)]={status:"STATE_SPACE_TOO_LARGE",stateCount};continue}
      throw e;
    }
    const sameMin=minAll!==null&&minStage!==null&&Math.abs(minAll-minStage)<=1e-12;
    out.ratios[String(ratio)]={
      status:minStage===null?"NO_TWO_STAGE_FEASIBLE_STATE":"READY",
      firstRatio:ratio,secondRatio:1-ratio,
      legalStates:stateCount,
      twoStageFeasibleStates:stageFeasibleStates,
      unconstrainedMinHHI:round(minAll,10),
      unconstrainedOptimumCount:optAll.length,
      unconstrainedOptima:optAll,
      stageFeasibleMinHHI:minStage===null?null:round(minStage,10),
      stageFeasibleOptimumCount:optStage.length,
      stageFeasibleOptima:optStage,
      globalMinimumUnchangedByStageConstraint:sameMin,
      unconstrainedOptimaAllStageFeasible:optAll.every(x=>x.allNamesBothStagesOrderable)
    };
  }

  const ready=Object.values(out.ratios).filter(x=>x.status==="READY");
  out.summary={
    testedRatios:ready.length,
    minUnchangedCount:ready.filter(x=>x.globalMinimumUnchangedByStageConstraint).length,
    unconstrainedOptimaAllStageFeasibleCount:ready.filter(x=>x.unconstrainedOptimaAllStageFeasible).length
  };
  out.semantics="Compares unrestricted structural grid minima with minima constrained to >=1 FIRST and >=1 ADD share for every selected name. Still plan-preview, not fills.";
  return out;
}
