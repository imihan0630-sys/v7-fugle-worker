import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {probeSourceFirstLiveOfficialA1V0_1 as probe} from '../scripts/probe_source_first_live_public_a1_v0_1.mjs';
const obs='2026-10-11T11:15:00.000Z',date='2026-10-08';
function mock(){
 const captures=[];
 return {
  captures,
  now:()=>new Date(obs),
  calendarResolver:async()=>({tradingDates:['2026-10-07',date],source:'TWSE_OFFICIAL_MOCK'}),
  fetchImpl:async(url)=>new Response(JSON.stringify({url}),{status:200}),
  saveOriginal:async({market,raw,sha256})=>{
   const digest=createHash('sha256').update(raw).digest('hex');
   assert.equal(digest,sha256);captures.push(market);
   return {stored:true,sha256,originalLength:raw.length};
  },
  historicalFetch:async({market,marketDate,fetchImpl,observedAt})=>{
   const sourceUrl='https://example.invalid/'+market+'/'+marketDate;
   await fetchImpl(sourceUrl,{method:'GET'});
   const ordinaryCount=market==='TWSE'?600:450;
   const rows=Array.from({length:ordinaryCount},(_,i)=>({
    symbol:String(i+1000),marketDate,market,open:100,high:102,low:98,close:101,
    volumeShares:100000,tradeValue:10100000,sourceFields:{i,marketDate},
   }));
   return {market,state:'READY',sourceId:market+'_MOCK',
    sourceUrl,sourceDateEvidence:marketDate,
    sourceDateEvidenceBasis:'FIXTURE',rows};
  },
 };
}
test('two true-source transport inputs readback, but NEVER qualify historical picks',async()=>{
 const m=mock(),r=await probe(m);
 assert.equal(r.sourceStatus,'BOTH_MARKETS_REAL_SOURCE_READBACK_VERIFIED',JSON.stringify(r));
 assert.deepEqual(m.captures,['TWSE','TPEX']);
 assert.equal(r.sourceTradingDate,date);
 assert.equal(r.markets.TWSE.ordinarySymbolCount,600);
 assert.equal(r.markets.TPEX.ordinarySymbolCount,450);
 assert.equal(r.liveStockSelectionExecuted,false);
 assert.equal(r.selectedCount,null);
 assert.equal(r.zeroPickDay,null);
 assert.equal(r.durableFrozenDecisionReadbackVerified,false);
 assert.equal(r.system2CloudflareD1Queries,0);
});
test('provider target date mismatch must block two-market readiness',async()=>{
 const m=mock(),original=m.historicalFetch;
 m.historicalFetch=async(args)=>{
  const r=await original(args);
  return args.market==='TPEX'?{...r,sourceDateEvidence:'2026-10-07'}:r;
 };
 const r=await probe(m);assert.equal(r.sourceStatus,'BLOCKED');
 assert.equal(r.markets.TPEX.errorCode,'SOURCE_READ_OR_SHAPE_UNAVAILABLE');
 assert.equal(r.selectedCount,null);
});
test('single market timeout/failure cannot fabricate two-market readiness',async()=>{
 const m=mock(),original=m.historicalFetch;
 m.historicalFetch=async(args)=>{
  if(args.market==='TWSE')throw Error('provider inaccessible');
  return original(args);
 };
 const r=await probe(m);
 assert.equal(r.sourceStatus,'BLOCKED');
 assert.equal(r.markets.TWSE.state,'BLOCKED');
 assert.equal(r.markets.TPEX.state,'ORIGINAL_PROVIDER_GET_READBACK_VERIFIED');
});
test('missing original response byte preservation fails closed',async()=>{
 const m=mock();m.saveOriginal=async()=>({stored:false});
 const r=await probe(m);
 assert.equal(r.sourceStatus,'BLOCKED');
 assert.equal(r.markets.TWSE.errorCode,'ORIGINAL_SOURCE_BYTES_UNVERIFIED');
 assert.equal(r.markets.TPEX.errorCode,'ORIGINAL_SOURCE_BYTES_UNVERIFIED');
});
test('official trading calendar absence is not filled in with a guessed past date',async()=>{
 const m=mock();m.calendarResolver=async()=>({tradingDates:[]});
 const r=await probe(m);assert.equal(r.sourceStatus,'BLOCKED');
 assert.equal(r.sourceTradingDate,null);assert.equal(m.captures.length,0);
});
