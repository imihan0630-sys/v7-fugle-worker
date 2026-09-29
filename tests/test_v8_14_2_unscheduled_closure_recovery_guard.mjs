import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');
const exported=source+'\nexport {validateUnscheduledMarketClosureReceipt,validateHistorySourceRevalidation,assertHistoricalRecoveryFreshness,unscheduledMarketClosureKey};';
const api=await import('data:text/javascript;base64,'+Buffer.from(exported).toString('base64'));

const valid={
  marketDate:'2026-07-10',
  marketScope:'BOTH',
  closureType:'TYPHOON',
  authority:'Taipei City Government + TWSE + TPEx official rules',
  decisionKnownAt:'2026-07-09T20:00:00+08:00',
  officialSourceUrls:[
    'https://eoc.gov.taipei/News/Detail/909',
    'https://twse-regulation.twse.com.tw/TW/law/DAT0201_print.aspx?FLCODE=FL007347',
    'https://www.tpex.org.tw/storage/eb_data/11205/11200591671.html'
  ],
  provenanceNotes:'2026-07-10 BAVI closure evidence chain',
  complete:true
};
const normalized=api.validateUnscheduledMarketClosureReceipt(valid);
assert.equal(normalized.marketScope,'BOTH');
assert.equal(normalized.marketDate,'2026-07-10');
assert.throws(()=>api.validateUnscheduledMarketClosureReceipt({...valid,officialSourceUrls:['https://example.com/a','https://twse.com.tw/x']}),/非官方|政府/);
assert.throws(()=>api.validateUnscheduledMarketClosureReceipt({...valid,marketScope:'BOTH',officialSourceUrls:[valid.officialSourceUrls[0],valid.officialSourceUrls[1]]}),/TPEx/);
assert.throws(()=>api.validateUnscheduledMarketClosureReceipt({...valid,decisionKnownAt:'2026-07-10T10:00:00+08:00'}),/晚於當日開盤/);

const scheduledHolidays=new Set(['2026-06-19','2026-09-25','2026-09-28']);
const dates=[];
for(let t=Date.parse('2026-06-01T12:00:00Z');t<Date.parse('2026-09-29T12:00:00Z');t+=86400000){
  const d=new Date(t),date=d.toISOString().slice(0,10),dow=d.getUTCDay();
  if(dow===0||dow===6||scheduledHolidays.has(date)||date==='2026-07-10') continue;
  dates.push(date);
}
const recent=dates.slice(-60);
assert.equal(recent.length,60);
assert.ok(recent[0]<'2026-07-10' && recent.at(-1)>'2026-07-10');
const history=recent.map((date,i)=>({date,open:100+i,high:101+i,low:99+i,close:100+i,volumeShares:1000}));

const receipt={
  ...normalized,
  appliesToMarket:'TWSE',
  capturedAt:'2026-09-30T00:00:00.000Z'
};
const canonical=JSON.stringify({
  schemaVersion:receipt.schemaVersion,marketDate:receipt.marketDate,marketScope:receipt.marketScope,
  closureType:receipt.closureType,authority:receipt.authority,decisionKnownAt:receipt.decisionKnownAt,
  officialSourceUrls:[...receipt.officialSourceUrls].sort()
});
const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical));
receipt.evidenceFingerprint=Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('');

const envWithClosure={STOCKS_KV:{get:async key=>key===api.unscheduledMarketClosureKey('TWSE','2026-07-10')?receipt:null}};
const admitted=await api.validateHistorySourceRevalidation({history,symbol:'2330',market:'TWSE',marketDate:'2026-09-29',env:envWithClosure,allowNetwork:false});
assert.equal(admitted.usable,true);
assert.equal(admitted.marketClosureStatus,'VERIFIED_MARKET_CLOSURE');
assert.deepEqual(admitted.verifiedMarketClosureDates,['2026-07-10']);

const blocked=await api.validateHistorySourceRevalidation({history,symbol:'2330',market:'TWSE',marketDate:'2026-09-29',env:{STOCKS_KV:{get:async()=>null}},allowNetwork:false});
assert.equal(blocked.usable,false);
assert.equal(blocked.reason,'OFFICIAL_GAP_PROOF_UNAVAILABLE');
assert.equal(blocked.gapDate,'2026-07-10');

assert.equal(api.assertHistoricalRecoveryFreshness([
  {symbol:'2006',closeDate:'2026-09-29',researchSnapshot:{provenance:{priceBarsThrough:'2026-09-29'}}}
],'2026-09-29',{skipped:false}),true);
assert.throws(()=>api.assertHistoricalRecoveryFreshness([
  {symbol:'2006',closeDate:'2026-09-24',researchSnapshot:{provenance:{priceBarsThrough:'2026-09-24'}}}
],'2026-09-29',{skipped:false}),/STALE_CLOSE_DATE/);
assert.throws(()=>api.assertHistoricalRecoveryFreshness([],'2026-09-29',{skipped:true}),/preview 為 skipped/);

console.log(JSON.stringify({ok:true,verifiedClosure:'2026-07-10',recoveryFreshnessGuard:true,system2Touched:false}));
