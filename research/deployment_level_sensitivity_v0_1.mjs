// Deployment-level sensitivity v0.1 — research-only.
// Replays current PriorityScore sizing at hypothetical nominal deployment ratios,
// then compares concentration against same-actual-deployment equal capital and exhaustive grid minima.
// No Formal deploy ratio is changed.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function sym(v){return String(v??"").trim()}
function round(v,d=10){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function hhi(xs){const t=xs.reduce((a,b)=>a+b,0);return t>0?xs.reduce((s,x)=>s+(x/t)**2,0):null}
function maxMin(xs){const p=xs.filter(x=>x>0);return p.length>=2?Math.max(...p)/Math.min(...p):null}
function preview(row,allocation,ratio=0.6){
  const first=Math.round(allocation*ratio),second=allocation-first;
  const firstShares=Math.floor(first/row.buyHigh),secondShares=Math.floor(second/row.buyHigh);
  const notional=(firstShares+secondShares)*row.buyHigh;
  return {notional,risk:notional*row.riskFrac,bothStagesOrderable:firstShares>=1&&secondShares>=1};
}
function currentSizing(rows,capital,deployRatio,capPct,grid){
  const scoreSum=rows.reduce((s,x)=>s+x.score,0);
  const cap=capital*capPct/100;
  return rows.map(x=>{
    const continuous=Math.min(cap,capital*deployRatio*x.score/scoreSum);
    const allocation=Math.floor(continuous/grid)*grid;
    return {...x,continuousAllocation:continuous,allocation};
  });
}

export function deploymentLevelSensitivity(plans=[],totalCapital,{
  deployRatios=[0.60,0.65,0.70,0.75,0.80,0.85,0.90,0.95],
  perNameCapPct=35,gridNTD=1000,firstTrancheRatio=0.6,minUnitsPerName=1,maxStates=2000000
}={}){
  const capital=n(totalCapital),capPct=n(perNameCapPct),grid=n(gridNTD),firstRatio=n(firstTrancheRatio);
  const drs=(deployRatios||[]).map(n);
  if(!(capital>0)||!(capPct>0)||!(grid>0)||!(firstRatio>0&&firstRatio<1)||!drs.length||drs.some(x=>!(x>0&&x<=1))){
    return {status:"UNKNOWN",reason:"INVALID_PARAMETERS"};
  }
  const rows=(plans||[]).map(p=>{
    const buyHigh=n(p?.buyHigh??p?.buy_high),stop=n(p?.stop);
    return {
      symbol:sym(p?.symbol??p?.code),score:n(p?.priorityScore??p?.priority_score),
      buyHigh,stop,riskFrac:(buyHigh>0&&stop>0&&stop<buyHigh)?(buyHigh-stop)/buyHigh:null
    };
  });
  if(rows.length<2)return {status:"INSUFFICIENT_CROSS_NAME_SAMPLE"};
  if(rows.some(x=>!x.symbol||!(x.score>0)||!(x.buyHigh>0)||!(x.riskFrac>0)))return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_GEOMETRY"};
  const capUnits=Math.floor((capital*capPct/100)/grid+1e-12);
  const minUnits=Math.max(0,Math.trunc(Number(minUnitsPerName)||0));
  const out={status:"READY",researchOnly:true,decisionImpact:false,totalCapitalNTD:capital,perNameCapPct:capPct,gridNTD:grid,firstTrancheRatio:firstRatio,levels:{}};

  for(const deployRatio of drs){
    const cur=currentSizing(rows,capital,deployRatio,capPct,grid);
    const currentDeployment=cur.reduce((s,x)=>s+x.allocation,0);
    const targetNominal=capital*deployRatio;
    const totalUnitsExact=currentDeployment/grid;
    if(!(currentDeployment>0)||Math.abs(totalUnitsExact-Math.round(totalUnitsExact))>1e-8){
      out.levels[String(deployRatio)]={status:"UNKNOWN",reason:"CURRENT_DEPLOYMENT_NOT_ON_GRID"};continue;
    }
    const currentPreview=cur.map(x=>preview(x,x.allocation,firstRatio));
    if(currentPreview.some(x=>!x.bothStagesOrderable)){
      out.levels[String(deployRatio)]={status:"CURRENT_NOT_TWO_STAGE_ORDERABLE"};continue;
    }
    const currentRisks=currentPreview.map(x=>x.risk),currentHHI=hhi(currentRisks);
    const totalUnits=Math.round(totalUnitsExact);
    if(totalUnits<rows.length*minUnits||totalUnits>rows.length*capUnits){
      out.levels[String(deployRatio)]={status:"GRID_CAPACITY_INVALID"};continue;
    }

    // same-actual-deployment equal capital, reconciled to grid deterministically by score-symbol order neutral to risk:
    const baseUnits=Math.floor(totalUnits/rows.length),remainder=totalUnits-baseUnits*rows.length;
    const equalUnits=rows.map((x,i)=>baseUnits+(i<remainder?1:0));
    const equalPreview=rows.map((x,i)=>preview(x,equalUnits[i]*grid,firstRatio));
    const equalRisks=equalPreview.map(x=>x.risk);

    let stateCount=0,feasible=0,minHHI=null,optima=[];
    const units=new Array(rows.length).fill(0);
    function evaluate(){
      stateCount++;
      if(stateCount>maxStates)throw new Error("MAX_STATES_EXCEEDED");
      const allocations=units.map(u=>u*grid);
      const p=rows.map((x,i)=>preview(x,allocations[i],firstRatio));
      if(p.some(x=>!x.bothStagesOrderable))return;
      feasible++;
      const risks=p.map(x=>x.risk),hv=hhi(risks);
      const cand={
        allocationsNTD:Object.fromEntries(rows.map((x,i)=>[x.symbol,allocations[i]])),
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
      if(String(e?.message)==="MAX_STATES_EXCEEDED"){out.levels[String(deployRatio)]={status:"STATE_SPACE_TOO_LARGE",stateCount};continue}
      throw e;
    }
    const equalHHI=hhi(equalRisks);
    out.levels[String(deployRatio)]={
      status:minHHI===null?"NO_FEASIBLE_STATE":"READY",
      nominalDeployRatio:deployRatio,
      nominalDeployTargetNTD:round(targetNominal,2),
      currentContinuousAllocationNTD:round(cur.reduce((s,x)=>s+x.continuousAllocation,0),4),
      currentActualPlannedDeploymentNTD:currentDeployment,
      implementationShortfallFromNominalNTD:round(targetNominal-currentDeployment,4),
      currentAllocationsNTD:Object.fromEntries(cur.map(x=>[x.symbol,x.allocation])),
      currentProjectedRiskHHI:round(currentHHI,10),
      equalCapitalAllocationsNTD:Object.fromEntries(rows.map((x,i)=>[x.symbol,equalUnits[i]*grid])),
      equalCapitalProjectedRiskHHI:round(equalHHI,10),
      globalMinHHI:round(minHHI,10),
      globalOptimumCount:optima.length,
      globalOptima:optima,
      legalStates:stateCount,twoStageFeasibleStates:feasible,
      currentMinusEqualHHI:round(currentHHI-equalHHI,10),
      currentMinusGlobalMinHHI:round(currentHHI-minHHI,10),
      currentMoreConcentratedThanEqual:currentHHI>equalHHI+1e-12,
      currentAboveGlobalMin:currentHHI>minHHI+1e-12
    };
  }
  const ready=Object.values(out.levels).filter(x=>x.status==="READY");
  out.summary={
    testedLevels:ready.length,
    currentMoreConcentratedThanEqualCount:ready.filter(x=>x.currentMoreConcentratedThanEqual).length,
    currentAboveGlobalMinCount:ready.filter(x=>x.currentAboveGlobalMin).length
  };
  out.semantics="Hypothetical nominal-deployment stress using the current score-proportional/cap/NT$1000-floor allocation rule. Comparators use each level's actual planned deployment after flooring. Structural only; Formal deploy ratio unchanged.";
  return out;
}
