// ADD-tranche projected-risk concentration v0.1 — research-only.
// Uses the Formal residual 40% second budget after FIRST=round(totalAllocation*0.60)
// and integer-share preview at buyHigh. No ADD trigger or fill is inferred.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=10){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function sym(v){return String(v??"").trim()}
function hhi(xs){const t=xs.reduce((a,b)=>a+b,0);return t>0?xs.reduce((s,x)=>s+(x/t)**2,0):null}
function maxMin(xs){const p=xs.filter(x=>x>0);return p.length>=2?Math.max(...p)/Math.min(...p):null}
function addPreview(allocation,buyHigh,riskFrac,firstRatio){
  const first=Math.round(allocation*firstRatio),amount=allocation-first;
  const shares=Math.floor(amount/buyHigh),notional=shares*buyHigh;
  return {amount,shares,notional,risk:notional*riskFrac};
}
function fullPreview(allocation,buyHigh,riskFrac,firstRatio){
  const first=Math.round(allocation*firstRatio),second=allocation-first;
  const q1=Math.floor(first/buyHigh),q2=Math.floor(second/buyHigh);
  const notional=(q1+q2)*buyHigh;
  return {notional,risk:notional*riskFrac};
}

export function addTrancheRiskConcentration(plans=[],totalCapital,{
 firstTrancheRatio=0.6,gridNTD=1000,perNameCapPct=35,minUnitsPerName=1,maxStates=2000000
}={}){
 const capital=n(totalCapital),ratio=n(firstTrancheRatio),grid=n(gridNTD),capPct=n(perNameCapPct);
 if(!(capital>0)||!(ratio>0&&ratio<1)||!(grid>0)||!(capPct>0)) return {status:"UNKNOWN",reason:"INVALID_PARAMETERS"};
 const rows=(plans||[]).map(p=>{
   const buyHigh=n(p?.buyHigh??p?.buy_high),stop=n(p?.stop),allocation=n(p?.totalAllocation??p?.total_allocation);
   const riskFrac=(buyHigh>0&&stop>0&&stop<buyHigh)?(buyHigh-stop)/buyHigh:null;
   return {symbol:sym(p?.symbol??p?.code),allocation,buyHigh,stop,riskFrac};
 });
 if(rows.length<2) return {status:"INSUFFICIENT_CROSS_NAME_SAMPLE"};
 if(rows.some(x=>!x.symbol||x.allocation===null||x.allocation<0||!(x.buyHigh>0)||!(x.riskFrac>0))) return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_GEOMETRY"};

 const deployment=rows.reduce((s,x)=>s+x.allocation,0);
 const unitsExact=deployment/grid;
 if(Math.abs(unitsExact-Math.round(unitsExact))>1e-8) return {status:"DEPLOYMENT_NOT_ON_GRID"};
 const totalUnits=Math.round(unitsExact),capUnits=Math.floor((capital*capPct/100)/grid+1e-12),minUnits=Math.max(0,Math.trunc(Number(minUnitsPerName)||0));

 const evalAlloc=allocs=>{
   const add=rows.map((x,i)=>addPreview(allocs[i],x.buyHigh,x.riskFrac,ratio));
   const full=rows.map((x,i)=>fullPreview(allocs[i],x.buyHigh,x.riskFrac,ratio));
   if(add.some(x=>x.shares<1)) return null;
   const addRisks=add.map(x=>x.risk),fullRisks=full.map(x=>x.risk);
   return {
     allocationsNTD:Object.fromEntries(rows.map((x,i)=>[x.symbol,allocs[i]])),
     addProjectedRiskNTD:round(addRisks.reduce((a,b)=>a+b,0),4),
     addProjectedRiskHHI:round(hhi(addRisks),10),
     addMaxMinProjectedRisk:round(maxMin(addRisks),8),
     addPreviewNotionalNTD:round(add.reduce((s,x)=>s+x.notional,0),4),
     fullProjectedRiskHHI:round(hhi(fullRisks),10),
     addMinusFullHHI:round(hhi(addRisks)-hhi(fullRisks),10),
     rows:rows.map((x,i)=>({
       symbol:x.symbol,addAmountNTD:add[i].amount,addShares:add[i].shares,
       addPreviewNotionalNTD:round(add[i].notional,4),addProjectedRiskNTD:round(add[i].risk,4)
     }))
   };
 };

 const current=evalAlloc(rows.map(x=>x.allocation));
 if(!current) return {status:"CURRENT_ADD_NOT_ORDERABLE"};
 const equalAllocation=deployment/rows.length,equal=evalAlloc(rows.map(()=>equalAllocation));

 let stateCount=0,minHHI=null,optima=[];
 const units=new Array(rows.length).fill(0);
 function evaluate(){
   stateCount++; if(stateCount>maxStates) throw new Error("MAX_STATES_EXCEEDED");
   const alloc=units.map(u=>u*grid),v=evalAlloc(alloc); if(!v) return;
   const hv=v.addProjectedRiskHHI;
   if(minHHI===null||hv<minHHI-1e-12){minHHI=hv;optima=[v]}
   else if(Math.abs(hv-minHHI)<=1e-12)optima.push(v);
 }
 function dfs(i,remaining){
   if(i===rows.length-1){if(remaining<minUnits||remaining>capUnits)return;units[i]=remaining;evaluate();return}
   const left=rows.length-i-1,lo=Math.max(minUnits,remaining-capUnits*left),hi=Math.min(capUnits,remaining-minUnits*left);
   for(let u=lo;u<=hi;u++){units[i]=u;dfs(i+1,remaining-u)}
 }
 try{dfs(0,totalUnits)}catch(e){if(String(e?.message)==="MAX_STATES_EXCEEDED")return {status:"STATE_SPACE_TOO_LARGE"};throw e}
 if(!optima.length)return {status:"NO_FEASIBLE_ADD_ORDERABLE_STATE"};

 return {
   status:"READY",researchOnly:true,decisionImpact:false,
   secondTrancheRatio:round(1-ratio,4),currentDeploymentNTD:deployment,gridNTD:grid,perNameCapPct:capPct,
   current,equalCapital:equal,
   exhaustiveGrid:{feasibleStates:stateCount,minHHI:round(minHHI,10),uniqueOptimum:optima.length===1,optimumCount:optima.length,optima},
   currentMinusEqualAddHHI:round(current.addProjectedRiskHHI-equal.addProjectedRiskHHI,10),
   currentMinusGlobalMinAddHHI:round(current.addProjectedRiskHHI-minHHI,10),
   semantics:"ADD tranche plan-preview projected risk only. No FIRST fill, ADD trigger, order submission, fill, or realized exposure is implied."
 };
}
