import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');
const exported=source+'\nexport {validateUnscheduledMarketClosureReceipt,validateHistorySourceRevalidation,unscheduledMarketClosureKey};';
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
  complete:true
};
const normalized=api.validateUnscheduledMarketClosureReceipt(valid);
const canonical=JSON.stringify({
  schemaVersion:normalized.schemaVersion,marketDate:normalized.marketDate,marketScope:normalized.marketScope,
  closureType:normalized.closureType,authority:normalized.authority,decisionKnownAt:normalized.decisionKnownAt,
  officialSourceUrls:[...normalized.officialSourceUrls].sort()
});
const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical));
const fingerprint=Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('');
const receipt={...normalized,appliesToMarket:'TWSE',capturedAt:'2026-09-30T00:00:00.000Z',evidenceFingerprint:fingerprint};

const holidays=new Set(['2026-06-19','2026-09-25','2026-09-28']);
const dates=[];
for(let t=Date.parse('2026-06-01T12:00:00Z');t<Date.parse('2026-09-29T12:00:00Z');t+=86400000){
  const d=new Date(t),date=d.toISOString().slice(0,10),dow=d.getUTCDay();
  if(dow===0||dow===6||holidays.has(date)||date==='2026-07-10') continue;
  dates.push(date);
}
const recent=dates.slice(-60);
const makeHistory=(offset=0)=>recent.map((date,i)=>({date,open:100+i+offset,high:101+i+offset,low:99+i+offset,close:100+i+offset,volumeShares:1000}));

let kvReads=0;
const closureKey=api.unscheduledMarketClosureKey('TWSE','2026-07-10');
const env={STOCKS_KV:{get:async key=>{kvReads++; return key===closureKey?receipt:null;}}};
const memo=new Map();
for(const [idx,symbol] of ['1101','1102','1103','1104','1105'].entries()){
  const result=await api.validateHistorySourceRevalidation({
    history:makeHistory(idx),symbol,market:'TWSE',marketDate:'2026-09-29',env,allowNetwork:false,receiptMemo:memo
  });
  assert.equal(result.usable,true);
  assert.equal(result.marketClosureStatus,'VERIFIED_MARKET_CLOSURE');
}
assert.equal(kvReads,1,'same market/date closure receipt must be read once per scan memo');
assert.equal(memo.has('CLOSURE:TWSE:2026-07-10'),true);

let missingReads=0;
const missingEnv={STOCKS_KV:{get:async()=>{missingReads++;return null;}}};
const missingMemo=new Map();
for(const symbol of ['1201','1202','1203']){
  const result=await api.validateHistorySourceRevalidation({
    history:makeHistory(),symbol,market:'TWSE',marketDate:'2026-09-29',env:missingEnv,allowNetwork:false,receiptMemo:missingMemo
  });
  assert.equal(result.usable,false);
  assert.equal(result.reason,'OFFICIAL_GAP_PROOF_UNAVAILABLE');
}
assert.equal(missingReads,2,'negative memo should read closure once and ordinary presence once');

console.log(JSON.stringify({ok:true,version:'8.14.4-history-memory-compaction',closureKvReads:kvReads,negativeKvReads:missingReads,system2Touched:false}));
