// PriorityScore × stop-distance interaction audit v0.1 — research-only.
// Quantifies within-date monotonic alignment across buyLow/midpoint/buyHigh references.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function sym(v){return String(v??"").trim()}
function round(v,d=8){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function ref(row,mode){return mode==="BUY_LOW"?row.buyLow:mode==="MIDPOINT"?(row.buyLow+row.buyHigh)/2:mode==="BUY_HIGH"?row.buyHigh:null}
function riskFrac(row,mode){const p=ref(row,mode);if(!(p>0)||!(row.stop>0)||row.stop>=p)return null;return (p-row.stop)/p}
function ranks(xs){
  const pairs=xs.map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v);
  const r=new Array(xs.length);
  for(let k=0;k<pairs.length;){
    let j=k+1; while(j<pairs.length&&pairs[j].v===pairs[k].v) j++;
    const avg=(k+j-1)/2+1;
    for(let t=k;t<j;t++) r[pairs[t].i]=avg;
    k=j;
  }
  return r;
}
function pearson(a,b){
  const n=a.length,ma=a.reduce((s,x)=>s+x,0)/n,mb=b.reduce((s,x)=>s+x,0)/n;
  let num=0,da=0,db=0;
  for(let i=0;i<n;i++){const x=a[i]-ma,y=b[i]-mb;num+=x*y;da+=x*x;db+=y*y}
  return da>0&&db>0?num/Math.sqrt(da*db):null;
}
function kendall(a,b){
  let c=0,d=0,t=0;
  for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++){
    const x=Math.sign(a[i]-a[j]),y=Math.sign(b[i]-b[j]);
    if(x===0||y===0){t++;continue}
    if(x===y)c++;else d++;
  }
  return {tau:(c+d)>0?(c-d)/(c+d):null,concordant:c,discordant:d,ties:t};
}
function permute(xs){
  if(xs.length===0)return [[]];
  const out=[];
  xs.forEach((x,i)=>{const rest=xs.slice(0,i).concat(xs.slice(i+1));for(const p of permute(rest))out.push([x,...p])});
  return out;
}

export function scoreStopInteractionAudit(plans=[]){
  const rows=(plans||[]).map(p=>({
    symbol:sym(p?.symbol??p?.code),score:n(p?.priorityScore??p?.priority_score),
    allocation:n(p?.totalAllocation??p?.total_allocation),
    buyLow:n(p?.buyLow??p?.buy_low),buyHigh:n(p?.buyHigh??p?.buy_high),stop:n(p?.stop)
  }));
  if(rows.length<3) return {status:"INSUFFICIENT_SAMPLE"};
  if(rows.some(x=>!x.symbol||x.score===null||x.allocation===null||!(x.buyLow>0)||!(x.buyHigh>=x.buyLow)||!(x.stop>0))) return {status:"UNKNOWN"};

  const scores=rows.map(x=>x.score),scoreRanks=ranks(scores);
  const modes={};
  for(const mode of ["BUY_LOW","MIDPOINT","BUY_HIGH"]){
    const fracs=rows.map(x=>riskFrac(x,mode));
    if(fracs.some(x=>x===null||!(x>0))){modes[mode]={status:"UNKNOWN"};continue}
    const riskRanks=ranks(fracs);
    const spearman=pearson(scoreRanks,riskRanks);
    const pear=pearson(scores,fracs);
    const kt=kendall(scores,fracs);
    const scoreOrder=[...rows].sort((a,b)=>b.score-a.score).map(x=>x.symbol);
    const riskOrder=rows.map((x,i)=>({symbol:x.symbol,v:fracs[i]})).sort((a,b)=>b.v-a.v).map(x=>x.symbol);
    const highestScore=scoreOrder[0],widestRisk=riskOrder[0];

    const perms=permute(fracs);
    let absAtLeast=0,posAtLeast=0;
    for(const p of perms){
      const rho=pearson(scoreRanks,ranks(p));
      if(Math.abs(rho)>=Math.abs(spearman)-1e-12)absAtLeast++;
      if(rho>=spearman-1e-12)posAtLeast++;
    }

    const scoreSum=scores.reduce((a,b)=>a+b,0);
    const cov=rows.reduce((s,x,i)=>s+(x.score/scoreSum-1/rows.length)*(fracs[i]-fracs.reduce((a,b)=>a+b,0)/rows.length),0)/rows.length;

    modes[mode]={
      status:"READY",
      stopRiskPct:Object.fromEntries(rows.map((x,i)=>[x.symbol,round(fracs[i]*100,6)])),
      scoreOrderDesc:scoreOrder,
      riskOrderDesc:riskOrder,
      exactRankMatch:scoreOrder.join("|")===riskOrder.join("|"),
      highestScoreSymbol:highestScore,
      widestStopRiskSymbol:widestRisk,
      highestScoreIsWidestStop:highestScore===widestRisk,
      spearmanRho:round(spearman,8),
      pearsonScoreVsStopRisk:round(pear,8),
      kendallTau:round(kt.tau,8),
      concordantPairs:kt.concordant,
      discordantPairs:kt.discordant,
      oneSidedExactPermutationP:round(posAtLeast/perms.length,8),
      twoSidedExactPermutationP:round(absAtLeast/perms.length,8),
      scoreShareStopRiskCovariance:round(cov,12),
      permutationCount:perms.length
    };
  }
  return {
    status:"READY",researchOnly:true,decisionImpact:false,selectedCount:rows.length,
    rows:rows.map(x=>({symbol:x.symbol,priorityScore:x.score,allocationNTD:x.allocation})),
    modes,
    interpretation:"Within-date mechanical alignment only. Exact permutation p-values are descriptive for this tiny selected set and do not create population/OOS evidence."
  };
}
