// Source-only last live snapshot diagnostics for two 2026-10-14 exceptions.
// Authenticated GET only; do not show admin token, webhook, positions or plan amounts.
import {mkdir,writeFile} from "node:fs/promises";
const BASE="https://fugle-test.imihan0630.workers.dev";
const TOKEN=process.env.V7_ADMIN_TOKEN||"";
if(!TOKEN)throw Error("EXISTING_V7_ADMIN_READ_TOKEN_REQUIRED");
async function read(path){
 const r=await fetch(BASE+path,{headers:{"x-admin-token":TOKEN,accept:"application/json"},
  signal:AbortSignal.timeout(18000)});
 if(!r.ok)throw Error("ORIGINAL_V8_READONLY_GET_HTTP_"+r.status);
 const d=await r.json();
 if(!d||typeof d!=="object")throw Error("ORIGINAL_V8_READONLY_RESPONSE_INVALID");
 return d;
}
const [live,config]=await Promise.all([read("/api/live"),read("/api/config")]);
const now=new Date(),day=new Intl.DateTimeFormat("en-CA",{
 timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"
}).format(now);
if(day!=="2026-10-14")throw Error("AUDIT_TARGET_SESSION_CHANGED_DONT_MISREPORT");
const results=Array.isArray(live?.results)?live.results:[];
const expected=["FORMAL:6226","FORMAL:8046","FORMAL:3037","FORMAL:6191",
 "FORMAL:2609","AIDEEN_APP:6213","AIDEEN_APP:3189","AIDEEN_APP:6672","AIDEEN_APP:2404"];
const names=results.map(x=>String(x?.plan?.strategyPool||x?.strategyPool||"FORMAL")+":"+String(x.symbol)).sort();
if(results.length!==9||JSON.stringify(names)!==JSON.stringify([...expected].sort()))
 throw Error("ORIGINAL_PROTECTED_NINE_MONITOR_IDENTITIES_UNVERIFIED");
const age=x=>{const raw=Number(x);const ms=raw>=1e14&&raw<1e17?Math.floor(raw/1000):NaN;
 return Number.isFinite(ms)?Math.round((now.getTime()-ms)/1000):null};
const rows=results.map(x=>{
 const pool=String(x?.plan?.strategyPool||x?.strategyPool||"FORMAL");
 const producerTime=x?.quote?.lastUpdated;
 const quoteAge=age(producerTime);
 const result={
  key:pool+":"+String(x?.symbol),stockOk:x?.ok===true,
  quoteAgeSeconds:quoteAge,providerMicrosecondTimestampPresent:quoteAge!==null,
  rawQuoteIsTrial:x?.quote?.isTrial===true,
  resultCurrentPricePresent:Number(x?.currentPrice)>0,
  executionQuoteFresh:x?.executionData?.quoteFresh===true,
  originalExecutionReason:String(x?.executionData?.reason||"").slice(0,120),
  formal15Fresh:x?.executionData?.formal15Fresh===true,
  auxiliary10Fresh:x?.executionData?.auxiliary10Fresh===true,
  frame10CompletedBars:x?.frame10?.completedBars??null,
  frame15CompletedBars:x?.frame15?.completedBars??null,
  lastTenMinuteBarStart:x?.frame10?.latest?.time??null,
  lastFifteenMinuteBarStart:x?.frame15?.latest?.time??null,
  // Quote date/tradingHalt/current raw source flags are NOT exposed in /api/live.
  missingRawFieldsNeededForDefinitiveRootCause:["quote.date","quote.symbol","quote.tradingHalt"]
 };
 return result;
}).sort((a,b)=>a.key.localeCompare(b.key));
const stalePlan=config?.stocks?.filter(x=>x.planDate!==day).map(x=>({
 symbol:String(x.symbol),planDate:String(x.planDate||"")
}))||[];
const failures=rows.filter(x=>!x.executionQuoteFresh);
const evidence={schema:"S1_P0_20261014_ORIGINAL_NINE_QUOTE_FAILURE_SAFETY_GET_ONLY",
 atUtc:now.toISOString(),taipeiDate:day,liveTimestamp:live?.generatedAtIso??live?.generatedAt??null,
 cronStatusNotChecked:true,quoteStateComplete:failures.length===0,
 freshCount:rows.length-failures.length,invalidCount:failures.length,
 invalidKeys:failures.map(x=>x.key),staleFormalPlans:stalePlan,
 cannotClassifyRawTradingHaltFromSummary:true,
 noWorkerWrite:true,noD1Write:true,noKVWrite:true,noFugleProviderCall:true,
 noOriginalCronChange:true,noTrade:true,noPush:true,
 rows};
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/system1-20261014-quote-two-exceptions.json",JSON.stringify(evidence,null,2)+"\n");
console.log("SYSTEM1_P0_QUOTE_FLAG_EXCEPTIONS_READONLY="+JSON.stringify({
 at:evidence.atUtc,live:evidence.liveTimestamp,valid:evidence.freshCount,
 invalid:evidence.invalidKeys,invalidDetail:rows.filter(x=>!x.executionQuoteFresh),
 staleFormalPlans:stalePlan,requiresRawVendorDetailsForDefinitiveCause:true,
 readOnly:true}));
