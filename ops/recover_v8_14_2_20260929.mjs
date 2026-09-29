const origin='https://fugle-test.imihan0630.workers.dev';
const token=process.env.V7_ADMIN_TOKEN;
if(!token) throw new Error('Missing V7_ADMIN_TOKEN');
const headers={'x-admin-token':token,'content-type':'application/json','accept':'application/json'};

async function call(path,{method='GET',body=null,timeout=180000}={}){
  const res=await fetch(origin+path,{method,headers,body:body===null?undefined:JSON.stringify(body),signal:AbortSignal.timeout(timeout)});
  const text=await res.text();
  let data; try{data=JSON.parse(text)}catch{throw new Error(path+' non-json '+res.status+' '+text.slice(0,500))}
  if(!res.ok) throw new Error(path+' HTTP '+res.status+' '+String(data.error||text).slice(0,1500));
  return data;
}

const closureInput={
  marketDate:'2026-07-10',
  marketScope:'BOTH',
  closureType:'TYPHOON',
  authority:'Taipei City Government stop-work decision + TWSE/TPEx natural-disaster rules',
  decisionKnownAt:'2026-07-09T20:00:00+08:00',
  officialSourceUrls:[
    'https://eoc.gov.taipei/News/Detail/909',
    'https://twse-regulation.twse.com.tw/TW/law/DAT0201_print.aspx?FLCODE=FL007347',
    'https://www.tpex.org.tw/storage/eb_data/11205/11200591671.html'
  ],
  provenanceNotes:'Owner-approved V8.14.2 System1 repair. 2026-07-10 BAVI: Taipei City announced full-day stop work before market open; exchange rules make TWSE and TPEx full-day closed.',
  complete:true
};

const seeded=await call('/api/history/closure-proof',{method:'POST',body:closureInput,timeout:30000});
if(seeded?.verified!==true || !seeded?.readback?.TWSE || !seeded?.readback?.TPEx) throw new Error('closure proof write/readback not verified');
console.log(JSON.stringify({step:'closure-proof',verified:true,markets:seeded.receipt?.storedMarkets,fingerprint:seeded.receipt?.evidenceFingerprint},null,2));

const preview=await call('/api/scan-preview',{method:'POST',body:{marketDate:'2026-09-29',epsReviewOnly:true},timeout:240000});
const h=preview?.diagnostics?.historySourceRevalidation||{};
if(preview?.scanDate!=='2026-09-29') throw new Error('preview scanDate mismatch '+String(preview?.scanDate));
if(preview?.skipped===true) throw new Error('preview still skipped: '+String(preview?.reason||preview?.status));
if(Number(h.usableSymbols||0)<=0) throw new Error('history admission still has zero usable symbols');
if(Number(h.reasons?.OFFICIAL_GAP_PROOF_UNAVAILABLE||0)>0) throw new Error('OFFICIAL_GAP_PROOF_UNAVAILABLE remains '+h.reasons.OFFICIAL_GAP_PROOF_UNAVAILABLE);
if(Number(h.verifiedMarketClosureSymbols||0)<=0) throw new Error('closure receipt was not consumed by history admission');
for(const stock of preview.stocks||[]){
  if(stock.closeDate!=='2026-09-29') throw new Error('preview stale closeDate '+stock.symbol+' '+stock.closeDate);
  if(stock?.researchSnapshot?.provenance?.priceBarsThrough!=='2026-09-29') throw new Error('preview stale priceBarsThrough '+stock.symbol+' '+String(stock?.researchSnapshot?.provenance?.priceBarsThrough));
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

const staged=await call('/api/scan/stage-selection',{method:'POST',body:{marketDate:'2026-09-29'},timeout:240000});
if(staged?.ok!==true || staged?.selectionPersisted!==true || staged?.scanDate!=='2026-09-29') throw new Error('stage-selection not persisted');
console.log(JSON.stringify({step:'stage-selection',formalSelectedCount:staged.formalSelectedCount,formalSymbols:staged.formalSymbols,hybridSymbols:staged.hybridSymbols,watchSymbols:staged.watchSymbols},null,2));

const monitor=await call('/?format=json',{timeout:30000});
const planned=Array.isArray(monitor.plannedStocks)?monitor.plannedStocks:[];
if(planned.length!==Number(staged.formalSelectedCount||0)) throw new Error('monitor plannedStocks count mismatch');
for(const stock of planned){
  if(stock.closeDate!=='2026-09-29') throw new Error('monitor stale closeDate '+stock.symbol+' '+stock.closeDate);
  if(stock.planDate!=='2026-09-30') throw new Error('monitor planDate mismatch '+stock.symbol+' '+stock.planDate);
}
const rec=await call('/api/recommendations',{timeout:30000});
if(rec.scanDate!=='2026-09-29' || rec.pipeline?.selectionPersisted!==true) throw new Error('recommendations readback not on recovered scan');

let report=null;
try {
  report=await call('/api/daily-report/resend',{method:'POST',body:{},timeout:60000});
} catch(error) {
  report={ok:false,error:String(error)};
}
console.log(JSON.stringify({
  ok:true,
  step:'final',
  version:monitor.version,
  scanDate:rec.scanDate,
  formalSelectedCount:staged.formalSelectedCount,
  plannedStocks:planned,
  dailyReport:{ok:report?.ok===true,deliveryState:report?.report?.deliveryState||null,error:report?.error||null},
  system2Changed:false
},null,2));
