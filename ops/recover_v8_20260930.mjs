const origin='https://fugle-test.imihan0630.workers.dev';
const token=process.env.V7_ADMIN_TOKEN;
if(!token) throw new Error('Missing V7_ADMIN_TOKEN');
const headers={'x-admin-token':token,'content-type':'application/json','accept':'application/json'};

async function call(path,{method='GET',body=null,timeout=180000}={}) {
  const res=await fetch(origin+path,{method,headers,body:body===null?undefined:JSON.stringify(body),signal:AbortSignal.timeout(timeout)});
  const text=await res.text();
  let data; try{data=JSON.parse(text)}catch{throw new Error(path+' non-json '+res.status+' '+text.slice(0,500))}
  if(!res.ok) throw new Error(path+' HTTP '+res.status+' '+String(data.error||text).slice(0,1500));
  return data;
}

const target='2026-09-30';

const quality=await call('/api/quality-status?marketDate='+encodeURIComponent(target),{timeout:30000});
if(quality?.marketDate!==target) throw new Error('quality marketDate mismatch');
if(quality?.index?.ready!==true || quality?.tdcc?.ready!==true) throw new Error('index/tdcc not ready');
for(const kind of ['FINANCIAL','VALUATION','ANNOUNCEMENTS','QUARTER_EPS']) {
  if(quality?.datasets?.[kind]?.ready!==true) throw new Error(kind+' not ready');
}
console.log(JSON.stringify({step:'quality-ready',marketDate:target,quality},null,2));

const closure=await call('/api/history/closure-proof?marketDate=2026-07-10',{timeout:30000});
if(!closure?.TWSE || !closure?.TPEx) throw new Error('7/10 closure proof missing');
console.log(JSON.stringify({step:'closure-proof-readback',verified:true},null,2));

const preview=await call('/api/scan-preview',{method:'POST',body:{marketDate:target,epsReviewOnly:true},timeout:240000});
const h=preview?.diagnostics?.historySourceRevalidation||{};
if(preview?.scanDate!==target) throw new Error('preview scanDate mismatch '+String(preview?.scanDate));
if(preview?.skipped===true) throw new Error('preview skipped: '+String(preview?.reason||preview?.status));
if(Number(h.usableSymbols||0)<=0) throw new Error('history admission has zero usable symbols');
if(Number(h.reasons?.OFFICIAL_GAP_PROOF_UNAVAILABLE||0)>0) throw new Error('OFFICIAL_GAP_PROOF_UNAVAILABLE remains '+h.reasons.OFFICIAL_GAP_PROOF_UNAVAILABLE);
for(const stock of preview.stocks||[]) {
  if(stock.closeDate!==target) throw new Error('preview stale closeDate '+stock.symbol+' '+stock.closeDate);
  if(stock?.researchSnapshot?.provenance?.priceBarsThrough!==target) throw new Error('preview stale priceBarsThrough '+stock.symbol+' '+String(stock?.researchSnapshot?.provenance?.priceBarsThrough));
}
console.log(JSON.stringify({
  step:'preview',
  scanDate:preview.scanDate,
  selectedCount:preview.selectedCount,
  usableSymbols:h.usableSymbols,
  unusableSymbols:h.unusableSymbols,
  verifiedMarketClosureSymbols:h.verifiedMarketClosureSymbols,
  reasons:h.reasons,
  formal:(preview.stocks||[]).map(x=>({symbol:x.symbol,name:x.name,closeDate:x.closeDate,planDate:x.planDate,priceBarsThrough:x?.researchSnapshot?.provenance?.priceBarsThrough}))
},null,2));

const staged=await call('/api/scan/stage-selection',{method:'POST',body:{marketDate:target},timeout:240000});
if(staged?.ok!==true || staged?.selectionPersisted!==true || staged?.scanDate!==target) throw new Error('stage-selection not persisted');
console.log(JSON.stringify({step:'stage-selection',formalSelectedCount:staged.formalSelectedCount,formalSymbols:staged.formalSymbols,hybridSymbols:staged.hybridSymbols,watchSymbols:staged.watchSymbols},null,2));

const monitor=await call('/?format=json',{timeout:30000});
const planned=Array.isArray(monitor.plannedStocks)?monitor.plannedStocks:[];
if(planned.length!==Number(staged.formalSelectedCount||0)) throw new Error('monitor plannedStocks count mismatch');
for(const stock of planned) {
  if(stock.closeDate!==target) throw new Error('monitor stale closeDate '+stock.symbol+' '+stock.closeDate);
  if(stock.planDate!=='2026-10-01') throw new Error('monitor planDate mismatch '+stock.symbol+' '+stock.planDate);
}
const rec=await call('/api/recommendations',{timeout:30000});
if(rec.scanDate!==target || rec.pipeline?.selectionPersisted!==true) throw new Error('recommendations readback not on recovered scan');

let report=null;
try {
  report=await call('/api/daily-report/resend',{method:'POST',body:{},timeout:60000});
} catch(error) {
  report={ok:false,error:String(error)};
}
console.log(JSON.stringify({
  ok:true,step:'final',version:monitor.version,scanDate:rec.scanDate,
  formalSelectedCount:staged.formalSelectedCount,plannedStocks:planned,
  dailyReport:{ok:report?.ok===true,deliveryState:report?.report?.deliveryState||null,error:report?.error||null},
  system2Changed:false
},null,2));
