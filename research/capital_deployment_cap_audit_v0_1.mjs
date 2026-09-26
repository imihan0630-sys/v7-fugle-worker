// Capital deployment cap audit v0.1
// Research-only structural analysis of the existing allocation formula.

function n(x){const v=Number(x);return Number.isFinite(v)?v:null;}
function r(x,d=4){if(!Number.isFinite(x))return null;const p=10**d;return Math.round(x*p)/p;}
export function nominalDeployRatio(count){
  const c=Math.max(0,Math.floor(Number(count)||0));
  return c<=0?0:c===1?0.35:c===2?0.60:0.85;
}
export function normalizeStoredRatio(value){
  const v=n(value);
  if(v===null)return null;
  return v>1?v/100:v;
}
export function auditAllocationScores(scores,totalCapital=200000,{cap=0.35,roundingUnit=1000}={}){
  const clean=(scores||[]).map(Number).filter(Number.isFinite).map(x=>Math.max(1,x));
  const count=clean.length;
  const deploy=nominalDeployRatio(count);
  const capital=Number(totalCapital);
  if(!(capital>0)||!count)return {
    status:count?"UNKNOWN":"NO_SELECTED",count,nominalDeployRatio:deploy
  };
  const sum=clean.reduce((a,b)=>a+b,0)||1;
  const rows=clean.map((score,index)=>{
    const scoreShare=score/sum;
    const rawRatio=deploy*scoreShare;
    const cappedRatio=Math.min(cap,rawRatio);
    const rawCapital=capital*cappedRatio;
    const roundedCapital=Math.floor(rawCapital/roundingUnit)*roundingUnit;
    return {index,score:r(score,4),scoreShare:r(scoreShare,6),rawRatio:r(rawRatio,6),
      capBound:rawRatio>cap+1e-12,cappedRatio:r(cappedRatio,6),
      preRoundCapital:r(rawCapital,2),roundedCapital};
  });
  const sumCapped=rows.reduce((s,x)=>s+x.cappedRatio,0);
  const roundedCapital=rows.reduce((s,x)=>s+x.roundedCapital,0);
  const nominalCapital=capital*deploy;
  const cappedCapital=capital*sumCapped;
  return {
    status:"READY",count,totalCapital:capital,nominalDeployRatio:deploy,
    nominalDeployCapital:r(nominalCapital,2),
    capAdjustedRatio:r(sumCapped,6),
    capAdjustedCapital:r(cappedCapital,2),
    actualFormulaCapital:roundedCapital,
    capClippingReserveNTD:r(Math.max(0,nominalCapital-cappedCapital),2),
    capClippingReservePctOfPool:r(Math.max(0,deploy-sumCapped)*100,4),
    roundingReserveNTD:r(Math.max(0,cappedCapital-roundedCapital),2),
    roundingReservePctOfPool:r(Math.max(0,(cappedCapital-roundedCapital)/capital)*100,4),
    totalFormulaReserveVsNominalNTD:r(Math.max(0,nominalCapital-roundedCapital),2),
    totalFormulaReserveVsNominalPctOfPool:r(Math.max(0,(nominalCapital-roundedCapital)/capital)*100,4),
    capBoundNames:rows.filter(x=>x.capBound).length,
    rows,
    semantics:"CURRENT_CLIP_AND_CASH_NO_REDISTRIBUTION"
  };
}

export function cappedWaterfillDiagnostic(scores,totalCapital=200000,{cap=0.35}={}){
  const clean=(scores||[]).map(Number).filter(Number.isFinite).map(x=>Math.max(1,x));
  const count=clean.length,deploy=nominalDeployRatio(count);
  if(!count||!(Number(totalCapital)>0))return {status:"UNKNOWN"};
  const alloc=Array(count).fill(0),active=new Set(clean.map((_,i)=>i));
  let remaining=deploy;
  for(let iter=0;iter<count+2 && active.size && remaining>1e-12;iter++){
    const weightSum=[...active].reduce((s,i)=>s+clean[i],0);
    if(!(weightSum>0))break;
    let clippedAny=false;
    for(const i of [...active]){
      const proposal=remaining*clean[i]/weightSum;
      if(proposal>=cap-alloc[i]-1e-12){
        const add=Math.max(0,cap-alloc[i]);
        alloc[i]+=add;remaining-=add;active.delete(i);clippedAny=true;
      }
    }
    if(!clippedAny){
      const ws=[...active].reduce((s,i)=>s+clean[i],0);
      for(const i of active)alloc[i]+=remaining*clean[i]/ws;
      remaining=0;
    }
  }
  return {
    status:"READY",nominalDeployRatio:deploy,
    allocations:alloc.map((ratio,i)=>({index:i,ratio:r(ratio,6),capital:r(ratio*totalCapital,2)})),
    residualRatio:r(remaining,6),
    warning:"Diagnostic counterfactual only. Redistributing clipped capital can materially increase lower-score names and may worsen outcomes."
  };
}
