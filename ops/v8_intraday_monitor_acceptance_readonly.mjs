// V8 genuine morning live monitor audit, GET-only, with NO holdings/plan/3Min/trade/push changes.
// This is an evidence collector, not a fallback market scanner or a claimed Formal PASS.
import {writeFile,mkdir} from "node:fs/promises";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
const BASE="https://fugle-test.imihan0630.workers.dev";
const tpDate=(d=new Date())=>new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).format(d);
const utcClock=()=>new Date().toISOString();
const normDate=x=>String(x||"").slice(0,10).replaceAll("/","-");
// The dashboard is allowed to retain the final intraday snapshot after close.
// Only 09:00–13:30 weekday Taipei observations are eligible for *live* freshness PASS.
// An official holiday cannot be certified here without a verified trading calendar.
const MAX_FRESH_AGE_SECONDS=300;
const MAX_FUTURE_SKEW_SECONDS=60;
const taipeiWeekday=d=>new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Taipei",weekday:"short"}).format(d);
const taipeiMinutes=d=>{
 const s=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Taipei",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(d);
 const [hour,minute]=s.split(":").map(Number);
 return hour*60+minute;
};
const isTaipeiIntradayWindow=d=>!["Sat","Sun"].includes(taipeiWeekday(d))&&taipeiMinutes(d)>=540&&taipeiMinutes(d)<810;
const parseTimeMs=value=>{
 if(value instanceof Date)return Number.isFinite(value.getTime())?value.getTime():null;
 if(typeof value==="number")return Number.isFinite(value)?(value<1e11?value*1000:value):null;
 const s=String(value??"").trim();
 if(!s)return null;
 // Worker generatedAt is an Asia/Taipei wall-clock string without an offset.
 // Treat it as +08:00, NOT as UTC or the runner host timezone.
 const m=s.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?$/);
 const normalized=m?
   `${m[1]}-${m[2].padStart(2,"0")}-${m[3].padStart(2,"0")}T${m[4].padStart(2,"0")}:${m[5]}:${m[6]||"00"}+08:00`:s;
 const ms=Date.parse(normalized);
 return Number.isFinite(ms)?ms:null;
};
const ageSeconds=(value,nowMs)=>{
 const ms=parseTimeMs(value);
 return ms===null?null:Math.round((nowMs-ms)/1000);
};
const isFresh=age=>age!==null&&age>=-MAX_FUTURE_SKEW_SECONDS&&age<=MAX_FRESH_AGE_SECONDS;
const isTaipeiDate=(value,day)=>{
 const ms=parseTimeMs(value);
 return ms!==null&&tpDate(new Date(ms))===day;
};
const monitorKey=x=>String(x?.strategyPool||x?.plan?.strategyPool||"FORMAL").trim()+":"+String(x?.symbol||x?.plan?.symbol||"").trim();
export function evaluateMonitorReadback({config,aideen,cron,live,signals,scan,day,now=new Date()}){
 const observed=new Date(now),nowMs=observed.getTime();
 if(!Number.isFinite(nowMs))throw Error("INVALID_OBSERVATION_CLOCK");
 const intradayWindow=isTaipeiIntradayWindow(observed)&&day===tpDate(observed);
 const active=Array.isArray(config?.stocks)?config.stocks:[];
 const symbols=active.map(x=>String(x?.symbol||""));
 const sameDate=active.length>0&&active.every(x=>normDate(x?.planDate)===day);
 const duplicate=new Set(symbols).size!==symbols.length;
 const knownSource=Boolean(config?.source&&config?.source!=="None");
 const aideenStocks=Array.isArray(aideen?.stocks)?aideen.stocks:[];
 const expectedStocks=[...active,...aideenStocks];
 const expectedKeys=expectedStocks.map(monitorKey);
 const actualStocks=Array.isArray(live?.results)?live.results:[];
 const actualLiveSymbols=actualStocks.map(x=>String(x?.symbol||""));
 const actualKeys=actualStocks.map(monitorKey);
 const expectedSet=new Set(expectedKeys),actualSet=new Set(actualKeys);
 const missingSymbols=expectedKeys.filter(x=>!actualSet.has(x));
 const unexpectedSymbols=actualKeys.filter(x=>!expectedSet.has(x));
 const monitorPopulationMatches=actualKeys.length===expectedKeys.length&&
   expectedSet.size===expectedKeys.length&&actualSet.size===actualKeys.length&&
   missingSymbols.length===0&&unexpectedSymbols.length===0&&
   Number(live?.monitoredCount)===actualKeys.length;
 const monitors=Array.isArray(cron?.recent)?cron.recent:[];
 const cronToday=monitors.filter(x=>x?.job_type==="INTRADAY_MONITOR"&&isTaipeiDate(x?.scheduled_at,day));
 const cronSuccess=cronToday.some(x=>x?.status==="SUCCESS"&&x?.skipped!==true);
 const cronFailure=cronToday.some(x=>x?.status==="FAILED");
 const lastSuccessful=cronToday.filter(x=>x?.status==="SUCCESS"&&x?.skipped!==true)
   .sort((a,b)=>(parseTimeMs(b?.scheduled_at)??0)-(parseTimeMs(a?.scheduled_at)??0))[0];
 const lastCronSuccessAt=lastSuccessful?.scheduled_at||null;
 const cronAgeSeconds=ageSeconds(lastCronSuccessAt,nowMs);
 const liveStamp=live?.generatedAt??null, signalStamp=signals?.generatedAt??null;
 // checkedAt/observedAt may be refreshed by a GET even while quotes remain frozen.
 // marketDate is a date, never proof of an actually fresh intraday snapshot.
 const liveAgeSeconds=ageSeconds(liveStamp,nowMs),signalAgeSeconds=ageSeconds(signalStamp,nowMs);
 const liveToday=isTaipeiDate(liveStamp,day),signalToday=isTaipeiDate(signalStamp,day);
 const cronRecent=isFresh(cronAgeSeconds);
 const liveFresh=liveToday&&isFresh(liveAgeSeconds);
 const signalFresh=signalToday&&isFresh(signalAgeSeconds);
 const sourceCount=signals?.stockCount??signals?.count??null;
 const formalDate=normDate(scan?.scanDate);
 const notAssessed=!intradayWindow;
 // Do not claim a live PASS solely from a same-day date, a completed cron, or HTTP 200.
 // Require all three actual clocks advancing within five minutes.
 const ok=!notAssessed&&sameDate&&!duplicate&&knownSource&&monitorPopulationMatches&&cronRecent&&liveFresh&&signalFresh;
 const state=notAssessed?"OUTSIDE_TAIPEI_INTRADAY_WINDOW_NOT_ASSESSED":
     !active.length?"NO_MONITOR_STOCKS":
     !sameDate?"WRONG_OR_STALE_PLAN_DATE":
     duplicate?"DUPLICATE_MONITOR_SYMBOL":
     !knownSource?"UNKNOWN_MONITOR_CONFIG_SOURCE":
     !monitorPopulationMatches?"MONITOR_TARGETS_MISMATCH":
     !cronRecent?"RECENT_INTRADAY_CRON_NOT_VERIFIED":
     !liveFresh?"LIVE_SNAPSHOT_STALE_OR_MISSING":
     !signalFresh?"SIGNAL_SNAPSHOT_STALE_OR_MISSING":
     "PASS_INTRADAY_MONITOR_FRESHNESS";
 return {state,ok,notAssessed,day,observedAt:observed.toISOString(),
   isTaipeiIntradayWindow:intradayWindow,maxFreshAgeSeconds:MAX_FRESH_AGE_SECONDS,
   monitorCount:active.length,symbols,aideenMonitorCount:aideenStocks.length,
   expectedMonitorKeys:expectedKeys,actualMonitorKeys:actualKeys,planDateCurrent:sameDate,
   actualLiveSymbols,monitorPopulationMatches,missingSymbols,unexpectedSymbols,
   liveReportedMonitoredCount:live?.monitoredCount??null,
   monitorConfigSource:String(config?.source||""),
   configUpdatedAt:config?.updatedAt??null,
   configuredCapital:config?.totalCapital??null,
   recordedProtectedPositions:active.filter(x=>x?.positionStage&&x.positionStage!=="NONE").map(x=>String(x.symbol)),
   brokeragePositionsReconciled:false,
   cronTodayCount:cronToday.length,cronSuccess,cronFailure,cronRecent,
   lastCronSuccessAt,cronAgeSeconds,
   cronObserved:cronToday.slice(0,8).map(x=>({scheduledAt:x?.scheduled_at||null,jobType:x?.job_type||null,status:x?.status||null,skipped:x?.skipped??null})),
   liveToday,signalToday,liveFresh,signalFresh,liveAgeSeconds,signalAgeSeconds,
   lastLiveAt:liveStamp,lastSignalsAt:signalStamp,
   signalStockCount:sourceCount,formalScanDate:formalDate,
   formalComplete:scan?.pipeline?.complete===true,
   threeMinDeliveryVerified:false,phonePushVerified:false,tradeExecuted:false};
}
async function main(){
 const token=process.env.V7_ADMIN_TOKEN||"";
 if(!token)throw Error("V7_ADMIN_TOKEN_REQUIRED");
 const now=new Date(),day=tpDate(now),time=utcClock();
 const record={schemaVersion:"V8_INTRADAY_MONITOR_PHYSICAL_ACCEPTANCE_V0_3",observedAt:time,day,
   method:"EXISTING_PRODUCTION_ADMIN_GET_ONLY",noWorkerWrite:true,noD1Write:true,noKVWrite:true,
   noStockSelection:true,noPlanChanges:true,no3MinWrite:true,noPush:true,noTrade:true,
   endpoints:{},result:null,errors:[]};
 const urls=[["config","/api/config"],["cron","/api/cron/status"],["live","/api/live"],
             ["signals","/api/signals"],["scan","/api/scan/status"],["aideen","/api/aideen-pool"]];
 const data={};
 const headers={"x-admin-token":token,accept:"application/json"};
 for(const [name,path] of urls){
  try{
   const response=await fetch(BASE+path,{method:"GET",headers,signal:AbortSignal.timeout(22000)});
   record.endpoints[name]=response.status;
   if(!response.ok)throw Error("HTTP_"+response.status);
   data[name]=await response.json();
  }catch(error){record.errors.push(name+":"+String(error.message||error).slice(0,120));data[name]=null;}
 }
 record.result=evaluateMonitorReadback({...data,day,now});
 record.result.deployedMonitorAccess=record.endpoints.config===200&&record.endpoints.live===200;
 record.digest=createHash("sha256").update(JSON.stringify(record.result)).digest("hex");
 await mkdir("artifacts",{recursive:true});
 await writeFile("artifacts/v8-intraday-monitor-readback-"+day+".json",JSON.stringify(record,null,2)+"\n");
 console.log("V8_INTRADAY_MONITOR_REAL_ACCEPTANCE="+JSON.stringify(record));
 if(record.errors.length||(!record.result.ok&&!record.result.notAssessed))process.exitCode=2;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])await main();
