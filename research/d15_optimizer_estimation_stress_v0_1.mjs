const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const matVec=(A,x)=>A.map(r=>dot(r,x));
export function portfolioVariance(w,cov){return dot(w,matVec(cov,w));}
export function portfolioMean(w,mu){return dot(w,mu);}
export function normalizeLongOnly(w){
 const x=w.map(v=>Math.max(0,v)),s=x.reduce((a,b)=>a+b,0);
 return s>0?x.map(v=>v/s):x;
}
export function twoAssetMeanVariance({mu,cov,riskAversion=1,grid=.001}){
 let best={weights:[0,1],objective:-Infinity};
 for(let w=0;w<=1+1e-12;w+=grid){
  const ww=Math.min(1,Number(w.toFixed(12))),weights=[ww,1-ww];
  const objective=portfolioMean(weights,mu)-.5*riskAversion*portfolioVariance(weights,cov);
  if(objective>best.objective) best={weights,objective,mean:portfolioMean(weights,mu),variance:portfolioVariance(weights,cov)};
 }
 return best;
}
export function perturbMean({mu,index,delta}){const x=[...mu];x[index]+=delta;return x;}
export function perturbCorrelation2({vol,corr}){
 if(!(corr>=-1&&corr<=1)) throw new Error("INVALID_CORRELATION");
 return [[vol[0]**2,corr*vol[0]*vol[1]],[corr*vol[0]*vol[1],vol[1]**2]];
}
export function equalRiskContribution2({cov,grid=.001}){
 let best={weights:[.5,.5],gap:Infinity};
 for(let w=0;w<=1+1e-12;w+=grid){
  const weights=[Math.min(1,Number(w.toFixed(12))),1-Math.min(1,Number(w.toFixed(12)))];
  const m=matVec(cov,weights),rc=weights.map((x,i)=>x*m[i]),gap=Math.abs(rc[0]-rc[1]);
  if(gap<best.gap) best={weights,gap,riskContributions:rc,variance:portfolioVariance(weights,cov)};
 }
 return best;
}
export function blackLittermanViewGuard({viewReceiptId,viewKnownAt,decisionAt,confidenceFrozenAt,outcomeKnownAt}){
 const reasons=[];
 if(!viewReceiptId) reasons.push("VIEW_RECEIPT_MISSING");
 const d=Date.parse(decisionAt),v=Date.parse(viewKnownAt),c=Date.parse(confidenceFrozenAt),o=Date.parse(outcomeKnownAt);
 if(!Number.isFinite(d)||!Number.isFinite(v)||v>d) reasons.push("VIEW_NOT_PIT");
 if(!Number.isFinite(c)||c>d) reasons.push("CONFIDENCE_NOT_FROZEN_PIT");
 if(Number.isFinite(o)&&(v>=o||c>=o)) reasons.push("VIEW_OR_CONFIDENCE_POST_OUTCOME");
 return {eligible:reasons.length===0,reasons};
}
