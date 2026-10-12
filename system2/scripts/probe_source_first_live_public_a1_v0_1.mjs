// P0 #1132: a real, bounded, public TWSE/TPEx official market-data smoke test.
// Two historical public GETs maximum, no D1, no secrets, no strategy-selection claim.
// A historical record first fetched today can NEVER be recast as known on its
// earlier market date for a prospective frozen decision.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {gzipSync,gunzipSync} from 'node:zlib';
import {buildOfficialTradingDatesV0_1} from '../runtime/official_historical_backfill_source_v0_1.mjs';
import {fetchOfficialHistoricalA1DateV0_1} from '../runtime/official_historical_a1_source_v0_1.mjs';
import {sha256Hex} from '../runtime/decision_archive.mjs';
const root='/tmp/system2-source-first-live-probe';
const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
const iso=()=>new Date().toISOString();
const taipeiDate=(now=new Date())=>new Intl.DateTimeFormat('en-CA',{
 timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit',
}).format(now);
const shift=(date,days)=>{
 const d=new Date(date+'T00:00:00Z');
 if(!Number.isFinite(+d))throw Error('INVALID_DAY');
 d.setUTCDate(d.getUTCDate()+days);
 return d.toISOString().slice(0,10);
};
function code(e){
 const message=String(e?.message||e);
 if(message.includes('SOURCE_DATE_MISMATCH'))return 'SOURCE_DATE_MISMATCH';
 if(message.includes('official historical A1 source exhausted')){
  const status=message.match(/HTTP\s+(401|403|404|408|429|500|502|503|504)\b/);
  return status?'PROVIDER_HTTP_'+status[1]:'SOURCE_TRANSPORT_UNAVAILABLE';
 }
 if(message.includes('ORIGINAL_SOURCE_BYTES'))return 'ORIGINAL_SOURCE_BYTES_UNVERIFIED';
 return 'SOURCE_READ_OR_SHAPE_UNAVAILABLE';
}
export async function probeSourceFirstLiveOfficialA1V0_1({
 now=()=>new Date(),fetchImpl=globalThis.fetch,
 calendarResolver=buildOfficialTradingDatesV0_1,
 historicalFetch=fetchOfficialHistoricalA1DateV0_1,
 saveOriginal=async({market,raw,sha256})=>{
  const p=resolve(root,market+'.json.gz');
  await mkdir(root,{recursive:true});
  await writeFile(p,gzipSync(raw),{flag:'wx',mode:0o600});
  const restored=gunzipSync(await readFile(p));
  return {stored:true,originalLength:restored.length,sha256:hash(restored)};
 }
}={}){
 if(typeof fetchImpl!=='function'||typeof saveOriginal!=='function')
   throw Error('LIVE_PROBE_REQUIRES_FETCH_AND_IMMUTABLE_SOURCE_SINK');
 const today=taipeiDate(now());
 const maxDate=shift(today,-1); // diagnostic only: don't infer same-session PIT
 const report={
  schemaVersion:'S2_SOURCE_FIRST_REAL_OFFICIAL_A1_SMOKE_V0_1',
  observationDateTaipei:today,observedAtUtc:now().toISOString(),
  purpose:'ACTUAL_PROVIDER_DIAGNOSTIC_NOT_PROSPECTIVE_FROZEN_SELECTION',
  sourceStatus:'BLOCKED',sourceTradingDate:null,calendar:null,markets:{},
  liveStockSelectionExecuted:false,selectedCount:null,zeroPickDay:null,
  durableFrozenDecisionReadbackVerified:false,system1Touched:false,
  system2CloudflareD1Queries:0,cloudflareMutations:0,orders:false,push:false,
 };
 try{
  const trading=await calendarResolver({fromDate:shift(maxDate,-20),toDate:maxDate,fetchImpl});
  const dates=trading?.tradingDates;
  if(!Array.isArray(dates)||!dates.length||dates.some(x=>x>maxDate)||!dates.every(x=>/^\d{4}-\d\d-\d\d$/.test(x)))
    throw Error('OFFICIAL_TRADING_DATE_CALENDAR_UNVERIFIED');
  const date=dates.at(-1);
  report.calendar={source:trading.source||null,
    originalTradingCalendarReadbackClaimedByThisCode:false,
    observedAtUtc:now().toISOString(),lastDate:date,
    datesHash:await sha256Hex(dates)};
  report.sourceTradingDate=date;
  for(const market of ['TWSE','TPEX']){
   let requestCount=0,raw=null,originalUrl=null,originalReadAt=null;
   const boundedFetch=async(url,options={})=>{
    if(++requestCount>1||options.method!=='GET'||!/^https:\/\//.test(String(url)))
      throw Error('LIVE_SOURCE_READ_MAX_ONE_HTTPS_GET_PER_MARKET');
    const response=await fetchImpl(url,options);
    if(response?.ok){
     const body=Buffer.from(await response.clone().arrayBuffer());
     if(body.byteLength>15_000_000)throw Error('ORIGINAL_SOURCE_BYTES_UNVERIFIED');
     const saved=await saveOriginal({market,raw:body,sha256:hash(body),
       url,requestedMarketDate:date,observedAtUtc:now().toISOString()});
     if(saved?.stored!==true||saved.sha256!==hash(body)||
        saved.originalLength!==body.length)
       throw Error('ORIGINAL_SOURCE_BYTES_UNVERIFIED');
     raw={bytes:body.length,sha256:hash(body)};
     originalUrl=url;originalReadAt=now().toISOString();
    }
    return response;
   };
   try{
    const r=await historicalFetch({market,marketDate:date,
      fetchImpl:boundedFetch,observedAt:()=>now().toISOString(),
      retryAttempts:1,retryDelayMs:0});
    const min=market==='TWSE'?600:450;
    if(!raw||r?.state!=='READY'||r.market!==market||
       r.sourceDateEvidence!==date||r.sourceUrl!==originalUrl||
       !Array.isArray(r.rows)||r.rows.length<min)
      throw Error('OFFICIAL_SOURCE_MARKET_DATE_OR_UNIVERSE_INVALID');
    report.markets[market]={
      state:'ORIGINAL_PROVIDER_GET_READBACK_VERIFIED',
      sourceId:r.sourceId,sourceDateEvidence:r.sourceDateEvidence,
      sourceDateEvidenceBasis:r.sourceDateEvidenceBasis,
      firstObservedAtUtc:originalReadAt,rawResponseSha256:raw.sha256,
      rawResponseBytes:raw.bytes,ordinarySymbolCount:r.rows.length,
      normalizedBarHash:await sha256Hex(r.rows.map(x=>({
       marketDate:x.marketDate,symbol:x.symbol,open:x.open,high:x.high,
       low:x.low,close:x.close,volumeShares:x.volumeShares,tradeValue:x.tradeValue,
       sourceRowFieldsHash:x.sourceFields?null:undefined,
      }))),
      sourceOriginalRetained:true,
      retrospectivePublicationTimeCertified:false,
    };
   }catch(e){
    report.markets[market]={state:'BLOCKED',errorCode:code(e),
      requestsMade:requestCount,originalBytesSaved:Boolean(raw)};
   }
  }
  if(['TWSE','TPEX'].every(m=>report.markets[m]?.state==='ORIGINAL_PROVIDER_GET_READBACK_VERIFIED'))
    report.sourceStatus='BOTH_MARKETS_REAL_SOURCE_READBACK_VERIFIED';
 }catch(e){
  report.calendar={state:'BLOCKED',code:'OFFICIAL_CALENDAR_READ_UNAVAILABLE'};
 }
 return Object.freeze({...report,receiptSha256:await sha256Hex(report)});
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url))){
 const r=await probeSourceFirstLiveOfficialA1V0_1();
 await mkdir(root,{recursive:true});
 await writeFile(resolve(root,'provider-smoke-receipt.json'),
   JSON.stringify(r,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({
  date:r.sourceTradingDate,sourceStatus:r.sourceStatus,
  twse:r.markets.TWSE?.state||null,tpex:r.markets.TPEX?.state||null,
  twseRows:r.markets.TWSE?.ordinarySymbolCount??null,
  tpexRows:r.markets.TPEX?.ordinarySymbolCount??null,
  tpexErrorCode:r.markets.TPEX?.errorCode||null,
  receiptSha256:r.receiptSha256,selection:'NOT_EXECUTED',
 }));
 if(r.sourceStatus!=='BOTH_MARKETS_REAL_SOURCE_READBACK_VERIFIED')process.exitCode=2;
}
