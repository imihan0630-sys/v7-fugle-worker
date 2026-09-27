const finite=v=>Number.isFinite(Number(v))?Number(v):null;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function decomposeInstitutionalScore(row={}){
  const f=finite(row.foreignBuyDays),t=finite(row.trustBuyDays),d=finite(row.dealerBuyDays);
  const net=finite(row.institutionTotalNet), lots=finite(row.avgVolume20Lots), c=finite(row.chipConcentration);
  const required=[f,t,d,net,lots,c];
  if(required.some(v=>v===null)||lots<=0) return {state:"UNKNOWN_INCOMPLETE_INPUT"};
  const streakLinear=8*f+10*t+4*d;
  const currentBuy=(f>0||t>0||d>0);
  const institutionsAligned=(f>0&&t>0&&d>0);
  const consensusInteraction=(institutionsAligned?15:0)+(currentBuy?6:0);
  const aggregateNetIntensity=clamp((net/(lots*1000))*25,0,25);
  const largeHolderConcentration=0.15*c;
  const preClamp=streakLinear+consensusInteraction+aggregateNetIntensity+largeHolderConcentration;
  const score=clamp(preClamp,0,100);
  return {
    state:"OBSERVED",streakLinear,consensusInteraction,aggregateNetIntensity,
    largeHolderConcentration,preClamp,score,scoreSaturated100:preClamp>=100,
    actorSignDivergence:(f>0)+(t>0)+(d>0)>0 && !institutionsAligned,
    aggregateNetNegativeButAnyActorPositive:net<0&&currentBuy,
    ownershipShareOfPreClamp:preClamp>0?largeHolderConcentration/preClamp:null
  };
}
export function summarizeInstitutionalScore(rows=[]){
  const x=rows.map(decomposeInstitutionalScore), o=x.filter(v=>v.state==="OBSERVED");
  return {rows:rows.length,observed:o.length,unknown:rows.length-o.length,
    saturated:o.filter(v=>v.scoreSaturated100).length,
    actorDivergence:o.filter(v=>v.actorSignDivergence).length,
    negativeAggregateButPositiveActor:o.filter(v=>v.aggregateNetNegativeButAnyActorPositive).length};
}
