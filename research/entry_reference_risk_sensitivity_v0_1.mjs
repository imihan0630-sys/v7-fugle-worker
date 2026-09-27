// Entry-reference stop-risk sensitivity v0.1 — research-only.
// Tests whether structural concentration depends on using buyHigh as the conservative entry reference.
// No outcome/fill assumptions.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=8){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function sym(v){return String(v??"").trim()}
function hhi(xs){const t=xs.reduce((a,b)=>a+b,0);return t>0?xs.reduce((s,x)=>s+(x/t)**2,0):null}
function maxMin(xs){const p=xs.filter(x=>x>0);return p.length>=2?Math.max(...p)/Math.min(...p):null}
function refPrice(row,mode){
  if(mode==="BUY_LOW") return row.buyLow;
  if(mode==="MIDPOINT") return (row.buyLow+row.buyHigh)/2;
  if(mode==="BUY_HIGH") return row.buyHigh;
  return null;
}
function riskFracAt(row,mode){
  const price=refPrice(row,mode);
  if(!(price>0)||!(row.stop>0)||row.stop>=price) return null;
  return (price-row.stop)/price;
}

export function entryReferenceRiskSensitivity(plans=[],totalCapital,{
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

  const modes=["BUY_LOW","MIDPOINT","BUY_HIGH"];
  const result={status:"READY",researchOnly:true,decisionImpact:false,selectedCount:rows.length,currentDeploymentNTD:deployment,gridNTD:grid,perNameCapPct:capPct,modes:{}};

  for(const mode of modes){
    const fracs=rows.map(x=>riskFracAt(x,mode));
    if(fracs.some(x=>x===null||!(x>0))){
      result.modes[mode]={status:"UNKNOWN",reason:"STOP_NOT_BELOW_REFERENCE"};
      continue;
    }
    const currentRisks=rows.map((x,i)=>x.allocation*fracs[i]);
    const equalAllocation=deployment/rows.length;
    const equalRisks=rows.map((x,i)=>equalAllocation*fracs[i]);

    let stateCount=0,minHHI=null,minMaxMin=null,hhiOptima=[],maxMinOptima=[];
    const units=new Array(rows.length).fill(0);
    function evaluate(){
      stateCount++;
      if(stateCount>maxStates) throw new Error("MAX_STATES_EXCEEDED");
      const alloc=units.map(u=>u*grid);
      const risks=alloc.map((a,i)=>a*fracs[i]);
      const hv=hhi(risks),mm=maxMin(risks);
      const candidate={
        allocationsNTD:Object.fromEntries(rows.map((x,i)=>[x.symbol,alloc[i]])),
        projectedStopRiskNTD:round(risks.reduce((a,b)=>a+b,0),4),
        projectedStopRiskHHI:round(hv,10),
        maxToMinProjectedRiskRatio:round(mm,8)
      };
      if(minHHI===null||hv<minHHI-1e-12){minHHI=hv;hhiOptima=[candidate]}
      else if(Math.abs(hv-minHHI)<=1e-12) hhiOptima.push(candidate);
      if(minMaxMin===null||mm<minMaxMin-1e-12){minMaxMin=mm;maxMinOptima=[candidate]}
      else if(Math.abs(mm-minMaxMin)<=1e-12) maxMinOptima.push(candidate);
    }
    function dfs(i,remaining){
      if(i===rows.length-1){
        if(remaining<minUnits||remaining>capUnits) return;
        units[i]=remaining; evaluate(); return;
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
    result.modes[mode]={
      status:"READY",
      referencePrices:Object.fromEntries(rows.map(x=>[x.symbol,round(refPrice(x,mode),4)])),
      stopRiskPct:Object.fromEntries(rows.map((x,i)=>[x.symbol,round(fracs[i]*100,6)])),
      widestStopRiskSymbol:rows[fracs.indexOf(Math.max(...fracs))].symbol,
      current:{
        allocationsNTD:Object.fromEntries(rows.map(x=>[x.symbol,x.allocation])),
        projectedStopRiskNTD:round(currentRisks.reduce((a,b)=>a+b,0),4),
        projectedStopRiskHHI:round(hhi(currentRisks),10),
        maxToMinProjectedRiskRatio:round(maxMin(currentRisks),8)
      },
      equalCapital:{
        allocationPerNameNTD:round(equalAllocation,4),
        projectedStopRiskNTD:round(equalRisks.reduce((a,b)=>a+b,0),4),
        projectedStopRiskHHI:round(hhi(equalRisks),10),
        maxToMinProjectedRiskRatio:round(maxMin(equalRisks),8)
      },
      exhaustiveGrid:{
        feasibleStates:stateCount,
        minHHI:round(minHHI,10),
        uniqueHHIOptimum:hhiOptima.length===1,
        hhiOptimumCount:hhiOptima.length,
        hhiOptima,
        minMaxToMin:round(minMaxMin,8),
        uniqueMaxMinOptimum:maxMinOptima.length===1,
        maxMinOptimumCount:maxMinOptima.length,
        maxMinOptima
      },
      currentMinusEqualCapitalHHI:round(hhi(currentRisks)-hhi(equalRisks),10),
      currentMinusGlobalMinHHI:round(hhi(currentRisks)-minHHI,10)
    };
  }

  result.semantics="Sensitivity of plan-time projected stop-risk concentration to BUY_LOW/MIDPOINT/BUY_HIGH entry references. Grid search is exhaustive over same selected names/deployment/cap/grid. No realized entry or fill is implied.";
  return result;
}
