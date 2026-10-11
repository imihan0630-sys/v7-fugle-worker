import test from 'node:test';
import assert from 'node:assert/strict';
import {captureOfficial61SessionWindowV0_1} from '../runtime/source_first_official_61_session_collector_v0_1.mjs';

test('missing dated provider access fails before source reads',async()=>{
 await assert.rejects(
   ()=>captureOfficial61SessionWindowV0_1({marketDate:'2026-10-12',fetchImpl:null,persistOriginal:null}),
   /ORIGINAL_CAPTURE_IO_REQUIRED/,
 );
});
test('zero or excessive provider request budget rejected',async()=>{
 for(const limit of [0,123]){
  await assert.rejects(
   ()=>captureOfficial61SessionWindowV0_1({marketDate:'2026-10-12',maxRequestCount:limit,persistOriginal:async()=>{},fetchImpl:async()=>{}}),
   /BOUNDED_REQUEST_LIMIT_REQUIRED/,
  );
 }
});

function mockProvider(){
 const dates=Array.from({length:61},(_,i)=>{
  const d=new Date('2026-08-13T00:00:00Z');d.setUTCDate(d.getUTCDate()+i);
  return d.toISOString().slice(0,10);
 });
 const originals=[];
 const input={
  marketDate:'2026-10-12',pauseMs:0,
  now:()=>new Date('2026-10-12T15:44:00Z'),
  calendarResolver:async()=>({tradingDates:dates,source:'FIXTURE_NOT_A_TRADING_CALENDAR'}),
  fetchImpl:async()=>new Response('{"fixture":true}',{status:200}),
  persistOriginal:async({raw,sha256,market,date})=>{
   originals.push({market,date,bytes:raw.byteLength});
   return {stored:true,sha256,byteLength:raw.byteLength};
  },
  historicalFetch:async({market,marketDate,fetchImpl})=>{
   const url='https://example.invalid/'+market+'/'+marketDate;
   await fetchImpl(url,{method:'GET'});
   const base=market==='TWSE'?1000:2000;
   const count=market==='TWSE'?600:450;
   return {state:'READY',market,marketDate,sourceUrl:url,
    sourceDateEvidence:marketDate,sourceId:'FIXTURE_'+market,
    rows:Array.from({length:count},(_,i)=>{
     const close=80+i%30;
     return {symbol:String(base+i),market,marketDate,priceSpace:'RAW',
      open:close,high:close+1,low:close-1,close,
      volumeShares:100000,tradeValue:close*100000,
      sourceFields:{market,marketDate,code:base+i}};
    })};
  },
 };
 return {input,originals};
}
test('complete two-market 61-session fixture produces source-only windows, never picks',async()=>{
 const {input,originals}=mockProvider();
 const r=await captureOfficial61SessionWindowV0_1(input);
 assert.equal(r.state,'SOURCE_OBSERVED_UNAUDITED');
 assert.equal(r.requestCount,122);
 assert.equal(r.receivedMarketDateCount,122);
 assert.equal(originals.length,122);
 assert.equal(r.sourceRowSymbolWindowsCompleteCount,1050);
 assert.equal(r.bySymbol['TWSE|1000'].bars.length,61);
 assert.equal(r.bySymbol['TWSE|1000'].bars.at(-1).date,'2026-10-12');
 assert.equal(r.bySymbol['TWSE|1000'].bars.at(-1).firstKnownAt,'2026-10-12T15:44:00.000Z');
 assert.equal(r.independentProviderAudited,false);
 assert.equal(r.calendar.verifiedOfficialReadback,false);
 assert.equal(r.selectedCount,null);
 assert.equal(r.assessorExecuted,false);
 assert.equal(r.sourceQuotaD1Reads,0);
 assert.equal(r.sourceQuotaD1Writes,0);
});
test('HTTP request cap fails closed without claiming a selection or zero-pick',async()=>{
 const {input}=mockProvider();
 const r=await captureOfficial61SessionWindowV0_1({...input,maxRequestCount:2});
 assert.equal(r.state,'INCOMPLETE');
 assert.equal(r.requestCount,2);
 assert.equal(r.sourceRowSymbolWindowsCompleteCount,0);
 assert.equal(r.selectedCount,null);
});
