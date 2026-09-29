const origin='https://fugle-test.imihan0630.workers.dev';
const token=process.env.V7_ADMIN_TOKEN;
if(!token) throw new Error('Missing V7_ADMIN_TOKEN');
const res=await fetch(origin+'/api/scan-preview',{method:'POST',headers:{'x-admin-token':token,'content-type':'application/json','accept':'application/json'},body:JSON.stringify({marketDate:'2026-09-29',epsReviewOnly:true}),signal:AbortSignal.timeout(180000)});
const text=await res.text(); let data; try{data=JSON.parse(text)}catch{throw new Error('non-json '+res.status+' '+text.slice(0,500))}
if(!res.ok) throw new Error(String(data.error||text).slice(0,1000));
const out={
  version:data.version,dryRun:data.dryRun,skipped:data.skipped,reason:data.reason,
  scanDate:data.scanDate,status:data.status,selectedCount:data.selectedCount,
  market:data.market,
  stocks:(data.stocks||[]).map(x=>({symbol:x.symbol,name:x.name,formalClose:x.formalClose,closeDate:x.closeDate,planDate:x.planDate,channel:x.channel,signalLevel:x.signalLevel,priorityScore:x.priorityScore,rewardRisk:x.rewardRisk,selectedReason:x.selectedReason})),
  hybridStocks:(data.hybridStocks||[]).map(x=>({symbol:x.symbol,name:x.name,formalClose:x.formalClose,closeDate:x.closeDate,planDate:x.planDate,selectedReason:x.selectedReason})),
  quarterEpsReview:data.diagnostics?.quarterEpsReview,
  with60Days:data.diagnostics?.with60Days,
  historyCacheCount:data.diagnostics?.historyCacheCount,
  marketSources:data.diagnostics?.marketSources,
  finalPoolMerge:data.diagnostics?.finalPoolMerge,
  thousandStockPool:data.thousandStockPool?{selectedCount:data.thousandStockPool.selectedCount,shortlist:data.thousandStockPool.shortlist}:null
};
console.log(JSON.stringify(out,null,2));
if(data.scanDate!=='2026-09-29') throw new Error('preview scanDate mismatch');
