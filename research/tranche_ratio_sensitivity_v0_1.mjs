// Tranche-ratio sensitivity v0.1 — research-only.
// Tests whether projected-risk concentration depends on the 60/40 FIRST/ADD split.
// For each ratio, both tranches are integer-share floored at buyHigh and recombined.
// No trigger/fill is assumed.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function sym(v){return String(v??"").trim()}
function round(v,d=10){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function hhi(xs){const t=xs.reduce((a,b)=>a+b,0);return t>0?xs.reduce((s,x)=>s+(x/t)**2,0):null}
function maxMin(xs){const p=xs.filter(x=>x>0);return p.length>=2?Math.max(...p)/Math.min(...p):null}

function previewForAllocation(row,allocation,firstRatio){
  const first=Math.round(allocation*firstRatio);
  const second=allocation-first;
  const firstShares=Math.floor(first/row.buyHigh);
  const secondShares=Math.floor(second/row.buyHigh);
  const shares=firstShares+secondShares;
  const notional=shares*row.buyHigh;
  const risk=notional*row.riskFrac;
  return {first,second,firstShares,secondShares,shares,notional,risk};
}

export function trancheRatioSensitivity(plans=[],totalCapital,{
  ratios=[0.40,0.45,0.50,0.55,0.60,0.65,0.70,0.75,0.80,0.85,0.90],
  gridNTD=1000,
  perNameCapPct=35,
  minUnitsPerName=1,
  maxStates=2000000
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

  const equalAlloc=deployment/rows.length;
  const out={status:"READY",researchOnly:true,decisionImpact:false,selectedCount:rows.length,currentDeploymentNTD:deployment,gridNTD:grid,perNameCapPct:capPct,ratios:{}};

  for(const ratio of rs){
    const currentPreview=rows.map(x=>previewForAllocation(x,x.allocation,ratio));
    const equalPreview=rows.map(x=>previewForAllocation(x,equalAlloc,ratio));
    const currentRisks=currentPreview.map(x=>x.risk),equalRisks=equalPreview.map(x=>x.risk);

    let stateCount=0,minHHI=null,optima=[];
    const units=new Array(rows.length).fill(0);
    function evaluate(){
      stateCount++;
      if(stateCount>maxStates) throw new Error("MAX_STATES_EXCEEDED");
      const allocations=units.map(u=>u*grid);
      const preview=rows.map((x,i)=>previewForAllocation(x,allocations[i],ratio));
      if(preview.some(x=>x.shares<1)) return;
      const risks=preview.map(x=>x.risk);
      const hv=hhi(risks);
      const cand={
        allocationsNTD:Object.fromEntries(rows.map((x,i)=>[x.symbol,allocations[i]])),
        previewNotionalNTD:round(preview.reduce((s,x)=>s+x.notional,0),4),
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
      if(String(e?.message)==="MAX_STATES_EXCEEDED"){out.ratios[String(ratio)]={status:"STATE_SPACE_TOO_LARGE",stateCount};continue}
      throw e;
    }
    optima.sort((a,b)=>JSON.stringify(a.allocationsNTD).localeCompare(JSON.stringify(b.allocationsNTD)));
    const currentHHI=hhi(currentRisks),equalHHI=hhi(equalRisks);
    out.ratios[String(ratio)]={
      status:"READY",
      firstRatio:ratio,
      secondRatio:1-ratio,
      feasibleStates:stateCount,
      current:{
        previewNotionalNTD:round(currentPreview.reduce((s,x)=>s+x.notional,0),4),
        projectedRiskNTD:round(currentRisks.reduce((s,x)=>s+x,0),4),
        projectedRiskHHI:round(currentHHI,10),
        maxToMinProjectedRiskRatio:round(maxMin(currentRisks),8)
      },
      equalCapital:{
        previewNotionalNTD:round(equalPreview.reduce((s,x)=>s+x.notional,0),4),
        projectedRiskNTD:round(equalRisks.reduce((s,x)=>s+x,0),4),
        projectedRiskHHI:round(equalHHI,10),
        maxToMinProjectedRiskRatio:round(maxMin(equalRisks),8)
      },
      globalMin:{
        minHHI:round(minHHI,10),
        optimumCount:optima.length,
        optima
      },
      currentMinusEqualHHI:round(currentHHI-equalHHI,10),
      currentMinusGlobalMinHHI:round(currentHHI-minHHI,10),
      currentMoreConcentratedThanEqual:currentHHI>equalHHI+1e-12,
      currentAboveGlobalMin:currentHHI>minHHI+1e-12
    };
  }

  const ready=Object.values(out.ratios).filter(x=>x.status==="READY");
  out.directionalAgreement={
    testedRatios:ready.length,
    currentMoreConcentratedThanEqual:ready.filter(x=>x.currentMoreConcentratedThanEqual).length,
    currentAboveGlobalMin:ready.filter(x=>x.currentAboveGlobalMin).length
  };
  out.semantics="Plan-preview full two-tranche risk after ratio-specific integer-share flooring at buyHigh. Ratio sweep is structural only; it does not imply FIRST/ADD triggers or fills.";
  return out;
}
