// P0 #1132: source-only, bounded 61-session official TWSE/TPEx bootstrap.
// No D1, Cloudflare, secrets, trades, live push, fabricated PIT or certified picks.
// Capture ORIGINAL provider JSON bytes and per-date SHA via copy-on-receive;
// caller must durably archive returned binary buffers and verify replay before acceptance.
import {createHash} from 'node:crypto';
import {buildOfficialTradingDatesV0_1} from './official_historical_backfill_source_v0_1.mjs';
import {fetchOfficialHistoricalA1DateV0_1} from './official_historical_a1_source_v0_1.mjs';
import {sha256Hex} from './decision_archive.mjs';

const DAY=/^\d{4}-\d{2}-\d{2}$/;
const UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const shaBytes=bytes=>createHash('sha256').update(bytes).digest('hex');
const iso=x=>typeof x==='string'&&UTC.test(x)&&Number.isFinite(Date.parse(x));
const dayOf=x=>{const d=new Date(x+'T00:00:00Z');if(!Number.isFinite(+d))throw Error('INVALID_DATE');return d};
function shift(x,n){const d=dayOf(x);d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
function assertOfficialDates(v,date){
 if(!Array.isArray(v)||v.length!==61||new Set(v).size!==61||
    v.some((x,i)=>!DAY.test(x)||(i>0&&x<=v[i-1]))||v.at(-1)!==date)
   throw Error('OFFICIAL_61_SESSION_CALENDAR_NOT_READY');
}
function validRow(row, market, date){
 const prices=[row?.open,row?.high,row?.low,row?.close];
 const eachValid=prices.every(p=>p===null||Number.isFinite(p)&&p>0);
 const complete=prices.every(Number.isFinite);
 return row?.market===market&&row?.marketDate===date&&
   /^[1-9]\d{3}$/.test(row.symbol||'')&&row.priceSpace==='RAW'&&
   eachValid&&(!complete||(row.high>=Math.max(row.open,row.close)&&
     row.low<=Math.min(row.open,row.close)))&&
   (row.volumeShares===null||Number.isFinite(row.volumeShares)&&row.volumeShares>=0)&&
   (row.tradeValue===null||Number.isFinite(row.tradeValue)&&row.tradeValue>=0);
}
/**
 * @param input
 * - marketDate: trading session T.
 * - fetchImpl: public HTTPS GET implementation (injected for regression).
 * - calendarResolver: existing independent official TWSE date resolver.
 * - historicalFetch: existing parse-with-source-date-check provider parser.
 * - persistOriginal: REQUIRED async callback to independently preserve exact
 *   original response bytes, returning verified {sha256,byteLength,stored:true}.
 * - maxRequestCount: 122 single day-market reads, no hidden retry/writes.
 */
export async function captureOfficial61SessionWindowV0_1({
 marketDate,fetchImpl=globalThis.fetch,calendarResolver=buildOfficialTradingDatesV0_1,
 historicalFetch=fetchOfficialHistoricalA1DateV0_1,persistOriginal,
 cachedOriginalsByUrl=null,
 now=()=>new Date(),pauseMs=0,maxRequestCount=122,
}={}){
 if(!DAY.test(marketDate||''))throw Error('MARKET_DATE_REQUIRED');
 if(typeof fetchImpl!=='function'||typeof persistOriginal!=='function')
   throw Error('ORIGINAL_CAPTURE_IO_REQUIRED');
 if(!Number.isInteger(pauseMs)||pauseMs<0||pauseMs>2000)throw Error('BOUNDED_PAUSE_REQUIRED');
 if(!Number.isInteger(maxRequestCount)||maxRequestCount<1||maxRequestCount>122)
   throw Error('BOUNDED_REQUEST_LIMIT_REQUIRED');
 const start=shift(marketDate,-145);
 const calendar=await calendarResolver({fromDate:start,toDate:marketDate,fetchImpl});
 const dates=calendar?.tradingDates?.slice(-61);
 assertOfficialDates(dates,marketDate);
 const calendarObserved=now().toISOString();
 if(!iso(calendarObserved))throw Error('CALENDAR_OBSERVATION_CLOCK_INVALID');
 const rowsBySymbol={};
 const receipts=[];
 const errors=[];
 let requestCount=0;
 for(const date of dates){
  for(const market of ['TWSE','TPEX']){
   if(requestCount>=maxRequestCount){
     errors.push({market,date,code:'PROVIDER_REQUEST_BUDGET_REACHED'});break;
   }
   // Capture exact body of each successful original provider response via clone.
   let captured=null, captureError=null;
   const capturedFetch=async(url,options)=>{
      requestCount++;
      if(options?.method!=='GET'||!String(url).startsWith('https://'))
        throw Error('ONLY_OFFICIAL_READ_ONLY_HTTPS_GET_ALLOWED');
      const response=await fetchImpl(url,options);
      if(response.ok){
       const raw=Buffer.from(await response.clone().arrayBuffer());
       const digest=shaBytes(raw);
       const cached=cachedOriginalsByUrl?.get?.(String(url))||null;
       if(cached&&(cached.sha256!==digest||cached.market!==market||
          cached.date!==date||!iso(cached.observedAt)||
          Date.parse(cached.observedAt)>now().getTime()))
         throw Error('REUSED_ORIGINAL_PROVENANCE_MISMATCH');
       const observedAt=cached?.observedAt||now().toISOString();
       const stored=await persistOriginal({market,date,sourceUrl:url,raw,
          sha256:digest,observedAt,reusedOriginalEvidence:!!cached});
       if(stored?.stored!==true||stored.sha256!==digest||
          stored.byteLength!==raw.byteLength)
          throw Error('ORIGINAL_PROVIDER_RESPONSE_NOT_DURABLY_PRESERVED');
       captured={sha256:digest,bytes:raw.byteLength,observedAt,url,
          reusedOriginalEvidence:!!cached};
      }
      return response;
   };
   let result=null;
   try{
    // One transport attempt per date: don't retry into hidden rate spikes.
    result=await historicalFetch({market,marketDate:date,fetchImpl:capturedFetch,
       observedAt:()=>now().toISOString(),retryAttempts:1,retryDelayMs:0});
    if(result?.state!=='READY'||result.sourceDateEvidence!==date||
       result.market!==market||result.sourceUrl!==captured?.url||!captured||!iso(captured.observedAt)||
       !Array.isArray(result.rows)||result.rows.length<(market==='TWSE'?600:450)||
       result.rows.some(row=>!validRow(row,market,date)))
      throw Error('SOURCE_DATE_PAYLOAD_COUNT_OR_BAR_INTEGRITY_INCOMPLETE');
    const symbolsSeen=new Set();
    for(const row of result.rows){
       if(symbolsSeen.has(row.symbol))throw Error('SOURCE_DUPLICATE_SYMBOL');
       symbolsSeen.add(row.symbol);
       const firstKnownAt=captured.observedAt;
       const bar={
         symbol:row.symbol,market,date,marketDate:date,priceSpace:'RAW',
         open:row.open,high:row.high,low:row.low,close:row.close,
         volumeShares:row.volumeShares,tradeValue:row.tradeValue,
         transactions:row.transactions,companyName:row.companyName,
         sourceRowHash:await sha256Hex(row.sourceFields),
         firstKnownAt,availableAt:firstKnownAt,
         sourceOriginalResponseSha256:captured.sha256,
         sourceId:result.sourceId,
       };
       const k=market+'|'+row.symbol;
       if(!rowsBySymbol[k])rowsBySymbol[k]=[];
       rowsBySymbol[k].push(bar);
    }
    receipts.push({market,marketDate:date,sourceId:result.sourceId,
      sourceUrl:captured.url,providerReportedDate:result.sourceDateEvidence,
      originalRawResponseSha256:captured.sha256,originalRawResponseBytes:captured.bytes,
      capturedAt:captured.observedAt,rowCount:result.rows.length,
      sourceDateEvidenceBasis:result.sourceDateEvidenceBasis,
      rawProviderBytesPreserved:true,
      reusedOriginalEvidence:captured.reusedOriginalEvidence});
   }catch(error){
      // Provider errors can contain URLs; never persist URLs/exceptions in failure evidence.
      captureError=String(error?.message||'ERROR').slice(0,130);
      errors.push({market,date,code:
        captureError.includes('NOT_DURABLY_PRESERVED')?'ORIGINAL_PROVIDER_BYTES_PRESERVATION_FAILED':
        captureError.includes('SOURCE_DATE_MISMATCH')?'SOURCE_DATE_MISMATCH':
        'OFFICIAL_DATE_CAPTURE_FAILED'});
      // Fail closed: no qualifying 61-day window; keep captured parts as diagnostics.
   }
   if(pauseMs>0)await new Promise(resolve=>setTimeout(resolve,pauseMs));
  }
 }
 const expected=dates.length*2;
 const full=receipts.length===expected&&errors.length===0;
 const bySymbol={};
 for(const [k,bars] of Object.entries(rowsBySymbol)){
   // Every requested session must be present exactly once and fully aligned.
   const arranged=bars.sort((a,b)=>a.date.localeCompare(b.date));
   const symbol=arranged[0]?.symbol,market=arranged[0]?.market;
   if(arranged.length!==61||arranged.some((b,i)=>b.date!==dates[i]))continue;
   bySymbol[k]={
     symbol,market,marketDate,providerMarketDate:marketDate,
     priceSpace:'RAW',volumeUnit:'SHARES',
     originalProviderResponseVerified:full,
     originalResponseSha256:await sha256Hex(arranged.map(x=>x.sourceOriginalResponseSha256)),
     observedAt:receipts.at(-1)?.capturedAt||calendarObserved,
     // Source-origin metadata is preserved but NEVER self-certifies audit.
     independentCurrentDailyCrossSourceEquivalenceVerified:false,
     bars:arranged,
   };
 }
 const originalCalendarHash=await sha256Hex({source:calendar.source,
   schemaVersion:calendar.schemaVersion,tradingDates:dates});
 const base={
  schemaVersion:'S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1',
  marketDate,calendar:{
    state:full?'SOURCE_OBSERVED_UNAUDITED':'INCOMPLETE',marketDate,
    tradingDates:dates,originalCalendarHash,
    observedAt:calendarObserved,providerSource:calendar.source,
    verifiedOfficialReadback:false,
  },
  state:full?'SOURCE_OBSERVED_UNAUDITED':'INCOMPLETE',
  requestCount,plannedMarketDateRequests:expected,
  receivedMarketDateCount:receipts.length,
  sourceWindowFirstDate:dates[0],sourceWindowLastDate:dates.at(-1),
  sourceRowSymbolWindowsCompleteCount:Object.keys(bySymbol).length,
  markets:['TWSE','TPEX'],
  receipts,errors,bySymbol,
  sourceQuotaD1Reads:0,sourceQuotaD1Writes:0,
  assessorExecuted:false,qualifiedCandidates:null,selectedCount:null,
  frozenDecisionsDurablyReadBack:false,independentProviderAudited:false,
  noSystem1RuntimeMutations:true,
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
