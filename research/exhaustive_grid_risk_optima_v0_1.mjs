import {projectedStopRisk} from "./portfolio_risk_tier_a_v0_1.mjs";

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=8){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function symbolOf(p){return String(p?.symbol??p?.code??"").trim()}
function lexKey(xs){return xs.map(x=>String(Math.round(x)).padStart(6,"0")).join("|")}
function hhi(xs){
  const total=xs.reduce((a,b)=>a+b,0);
  if(!(total>0)) return null;
  return xs.reduce((s,x)=>s+(x/total)**2,0);
}
function maxMin(xs){
  const p=xs.filter(x=>x>0);
  if(p.length<2) return null;
  return Math.max(...p)/Math.min(...p);
}
function better(value,best,tol=1e-12){return best===null||value<best-tol}
function tied(value,best,tol=1e-12){return best!==null&&Math.abs(value-best)<=tol}

export function exhaustiveGridRiskOptima(plans=[],totalCapital,{
  perNameCapPct=35,
  gridNTD=1000,
  minUnitsPerName=1,
  firstTrancheRatio=0.6,
  maxStates=2000000
}={}){
  const capital=n(totalCapital),grid=n(gridNTD),capPct=n(perNameCapPct),firstRatio=n(firstTrancheRatio);
  if(!(capital>0)||!(grid>0)||!(capPct>0)||!(firstRatio>0&&firstRatio<1)) return {status:"UNKNOWN",reason:"INVALID_PARAMETERS"};
  const rows=[];
  let deployment=0;
  for(const p of plans||[]){
    const symbol=symbolOf(p),allocation=n(p?.totalAllocation??p?.total_allocation),buyHigh=n(p?.buyHigh??p?.buy_high);
    const r=projectedStopRisk(p);
    if(!symbol||allocation===null||!(buyHigh>0)||!r?.ok) return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_GEOMETRY",symbol:symbol||r?.symbol||null,riskReason:r?.reason||null};
    const riskFrac=r.riskPctHigh/100;
    rows.push({symbol,buyHigh,riskFrac});
    deployment+=allocation;
  }
  if(rows.length<2) return {status:"INSUFFICIENT_CROSS_NAME_SAMPLE"};
  const totalUnitsExact=deployment/grid;
  if(Math.abs(totalUnitsExact-Math.round(totalUnitsExact))>1e-8) return {status:"DEPLOYMENT_NOT_ON_GRID",deploymentNTD:deployment,gridNTD:grid};
  const totalUnits=Math.round(totalUnitsExact);
  const capNTD=capital*capPct/100;
  const capUnits=Math.floor(capNTD/grid+1e-12);
  const minUnits=Math.max(0,Math.trunc(Number(minUnitsPerName)||0));
  if(totalUnits<minUnits*rows.length||totalUnits>capUnits*rows.length) return {status:"INFEASIBLE_GRID_CAPACITY"};

  const result={
    status:"READY",researchOnly:true,decisionImpact:false,
    selectedCount:rows.length,totalCapitalNTD:capital,currentDeploymentNTD:deployment,
    gridNTD:grid,perNameCapPct:capPct,capUnits,minUnitsPerName:minUnits,
    stateCount:0,
    preShare:{minHHI:null,hhiOptima:[],minMaxToMin:null,maxMinOptima:[]},
    postShare:{minHHI:null,hhiOptima:[],minMaxToMin:null,maxMinOptima:[]},
    semantics:"Exhaustive structural search over same-deployment NT$grid allocations. PRE_SHARE uses allocation×planned stop risk; POST_SHARE applies 60/40 tranche and integer-share floor at buyHigh. Neither is a fill."
  };

  const units=new Array(rows.length).fill(0);
  function evaluate(){
    result.stateCount++;
    if(result.stateCount>maxStates) throw new Error("MAX_STATES_EXCEEDED");
    const allocations=units.map(u=>u*grid);
    const preRisks=rows.map((x,i)=>allocations[i]*x.riskFrac);
    const preview=rows.map((x,i)=>{
      const a=allocations[i];
      const first=Math.round(a*firstRatio);
      const second=a-first;
      const firstShares=Math.floor(first/x.buyHigh);
      const secondShares=Math.floor(second/x.buyHigh);
      const shares=firstShares+secondShares;
      const notional=shares*x.buyHigh;
      return {first,second,firstShares,secondShares,shares,notional,risk:notional*x.riskFrac};
    });
    if(preview.some(x=>x.shares<1)) return;
    const postRisks=preview.map(x=>x.risk);
    const preHHI=hhi(preRisks),postHHI=hhi(postRisks),preMM=maxMin(preRisks),postMM=maxMin(postRisks);
    const allocationKey=lexKey(allocations);
    const candidate={
      allocations:rows.map((x,i)=>({symbol:x.symbol,allocationNTD:allocations[i]})),
      allocationKey,
      preShare:{
        projectedRiskNTD:round(preRisks.reduce((a,b)=>a+b,0),4),
        projectedRiskHHI:round(preHHI,10),
        maxToMinProjectedRiskRatio:round(preMM,8),
        risks:rows.map((x,i)=>({symbol:x.symbol,projectedRiskNTD:round(preRisks[i],4)}))
      },
      postShare:{
        previewSuggestedNotionalNTD:round(preview.reduce((s,x)=>s+x.notional,0),4),
        shareFloorResidualNTD:round(deployment-preview.reduce((s,x)=>s+x.notional,0),4),
        projectedRiskNTD:round(postRisks.reduce((a,b)=>a+b,0),4),
        projectedRiskHHI:round(postHHI,10),
        maxToMinProjectedRiskRatio:round(postMM,8),
        rows:rows.map((x,i)=>({symbol:x.symbol,firstShares:preview[i].firstShares,secondShares:preview[i].secondShares,previewNotionalNTD:round(preview[i].notional,4),projectedRiskNTD:round(postRisks[i],4)}))
      }
    };
    const update=(bucket,key,val)=>{
      const minKey=key==="hhiOptima"?"minHHI":"minMaxToMin";
      if(better(val,bucket[minKey])){
        bucket[minKey]=val;
        bucket[key]=[candidate];
      } else if(tied(val,bucket[minKey])){
        bucket[key].push(candidate);
      }
    };
    update(result.preShare,"hhiOptima",preHHI);
    update(result.preShare,"maxMinOptima",preMM);
    update(result.postShare,"hhiOptima",postHHI);
    update(result.postShare,"maxMinOptima",postMM);
  }

  function dfs(i,remaining){
    if(i===rows.length-1){
      if(remaining<minUnits||remaining>capUnits) return;
      units[i]=remaining;
      evaluate();
      return;
    }
    const remainingNames=rows.length-i-1;
    const lo=Math.max(minUnits,remaining-capUnits*remainingNames);
    const hi=Math.min(capUnits,remaining-minUnits*remainingNames);
    for(let u=lo;u<=hi;u++){
      units[i]=u;
      dfs(i+1,remaining-u);
    }
  }
  try{dfs(0,totalUnits)}catch(e){
    if(String(e?.message)==="MAX_STATES_EXCEEDED") return {status:"STATE_SPACE_TOO_LARGE",maxStates,stateCount:result.stateCount};
    throw e;
  }
  if(result.stateCount===0||result.preShare.hhiOptima.length===0||result.postShare.hhiOptima.length===0) return {status:"NO_FEASIBLE_ORDERABLE_GRID_STATE"};

  for(const bucket of [result.preShare,result.postShare]){
    bucket.minHHI=round(bucket.minHHI,10);
    bucket.minMaxToMin=round(bucket.minMaxToMin,8);
    bucket.hhiOptima.sort((a,b)=>a.allocationKey.localeCompare(b.allocationKey));
    bucket.maxMinOptima.sort((a,b)=>a.allocationKey.localeCompare(b.allocationKey));
    bucket.hhiOptimumCount=bucket.hhiOptima.length;
    bucket.maxMinOptimumCount=bucket.maxMinOptima.length;
  }
  return result;
}
