// V8 genuine morning live monitor audit, GET-only, with NO holdings/plan/3Min/trade/push changes.
// This is an evidence collector, not a fallback market scanner or a claimed Formal PASS.
import {writeFile,mkdir} from "node:fs/promises";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
const BASE="https://fugle-test.imihan0630.workers.dev";
const tpDate=(d=new Date())=>new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).format(d);
const utcClock=()=>new Date().toISOString();
const normDate=x=>String(x||"").slice(0,10).replaceAll("/","-");
const hasTodayClock=(value,day)=>String(value||"").replaceAll("/","-").includes(day);
const parseClock=value=>{
 const raw=String(value||"").trim();
 if(!raw)return NaN;
 if(/^\d{4}[/-]\d{2}[/-]\d{2}[ T]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(raw)){
  return Date.parse(raw.replaceAll("/","-").replace(" ","T")+"+08:00");
 }
 return Date.parse(raw);
};
const latestClock=(payload,fields)=>fields.map(x=>parseClock(payload?.[x])).filter(Number.isFinite).sort((a,b)=>b-a)[0]??NaN;
export function evaluateMonitorReadback({config,cron,live,signals,scan,day,now=Date.now(),maxAgeMs=180000}){
 const active=Array.isArray(config?.stocks)?config.stocks:[];
 const symbols=active.map(x=>String(x?.symbol||""));
 const sameDate=active.length>0&&active.every(x=>normDate(x?.planDate)===day);
 const duplicate=new Set(symbols).size!==symbols.length;
 const knownSource=Boolean(config?.source&&config?.source!=="None");
 const monitors=Array.isArray(cron?.recent)?cron.recent:[];
 const cronToday=monitors.filter(x=>x?.job_type==="INTRADAY_MONITOR"&&hasTodayClock(x?.scheduled_at,day));
 const successfulCron=cronToday.filter(x=>x?.status==="SUCCESS"&&x?.skipped!==true);
 const latestCronAt=successfulCron.map(x=>parseClock(x?.finished_at||x?.scheduled_at)).filter(Number.isFinite).sort((a,b)=>b-a)[0]??NaN;
 const cronSuccess=successfulCron.length>0;
 const cronFresh=Number.isFinite(latestCronAt)&&latestCronAt<=now+5000&&now-latestCronAt<=maxAgeMs;
 const cronFailure=cronToday.some(x=>x?.status==="FAILED");
 const liveToday=hasTodayClock(live?.generatedAt,day)||hasTodayClock(live?.checkedAt,day)||
      hasTodayClock(live?.observedAt,day)||hasTodayClock(live?.marketDate,day);
 const signalToday=hasTodayClock(signals?.generatedAt,day)||hasTodayClock(signals?.checkedAt,day)||
      hasTodayClock(signals?.observedAt,day)||hasTodayClock(signals?.marketDate,day);
 const latestLiveAt=latestClock(live,["generatedAtIso","generatedAt","checkedAt","observedAt"]);
 const latestSignalsAt=latestClock(signals,["generatedAtIso","generatedAt","checkedAt","observedAt"]);
 const liveFresh=liveToday&&Number.isFinite(latestLiveAt)&&latestLiveAt<=now+5000&&now-latestLiveAt<=maxAgeMs;
 const signalFresh=signalToday&&Number.isFinite(latestSignalsAt)&&latestSignalsAt<=now+5000&&now-latestSignalsAt<=maxAgeMs;
 const sourceCount=signals?.stockCount??signals?.count??null;
 const formalDate=normDate(scan?.scanDate);
 // A fresh success audit in D1 plus new live/signal actual state is required;
 // there is no "PASS" just because a GH job or Worker /api/version HTTP is green.
 const ok=sameDate&&!duplicate&&knownSource&&cronFresh&&(liveFresh||signalFresh);
 return {state:ok?"PASS_INTRADAY_MONITOR_ACCEPTED":
     !active.length?"NO_MONITOR_STOCKS":
     !sameDate?"WRONG_OR_STALE_PLAN_DATE":
     duplicate?"DUPLICATE_MONITOR_SYMBOL":
     !cronSuccess?"CRON_SUCCESS_NOT_VERIFIED":
     !cronFresh?"CRON_SUCCESS_STALE":
     "CURRENT_SESSION_LIVE_STATE_STALE_OR_NOT_VERIFIED",
   ok,day,monitorCount:active.length,symbols,planDateCurrent:sameDate,
   monitorConfigSource:String(config?.source||""),
   configUpdatedAt:config?.updatedAt??null,
   configuredCapital:config?.totalCapital??null,
   recordedProtectedPositions:active.filter(x=>x?.positionStage&&x.positionStage!=="NONE").map(x=>String(x.symbol)),
   brokeragePositionsReconciled:false,
   cronTodayCount:cronToday.length,cronSuccess,cronFresh,cronFailure,
   latestCronAt:Number.isFinite(latestCronAt)?new Date(latestCronAt).toISOString():null,
   cronObserved:cronToday.slice(0,8).map(x=>({scheduledAt:x?.scheduled_at||null,jobType:x?.job_type||null,status:x?.status||null,skipped:x?.skipped??null})),
   liveToday,signalToday,liveFresh,signalFresh,
   liveAgeSeconds:Number.isFinite(latestLiveAt)?Math.max(0,Math.round((now-latestLiveAt)/1000)):null,
   signalAgeSeconds:Number.isFinite(latestSignalsAt)?Math.max(0,Math.round((now-latestSignalsAt)/1000)):null,
   lastLiveAt:live?.generatedAtIso||live?.generatedAt||live?.checkedAt||null,
   lastSignalsAt:signals?.generatedAt||signals?.checkedAt||null,
   signalStockCount:sourceCount,formalScanDate:formalDate,
   formalComplete:scan?.pipeline?.complete===true,
   threeMinDeliveryVerified:false,phonePushVerified:false,tradeExecuted:false};
}
async function main(){
 const token=process.env.V7_ADMIN_TOKEN||"";
 if(!token)throw Error("V7_ADMIN_TOKEN_REQUIRED");
 const now=new Date(),day=tpDate(now),time=utcClock();
 const record={schemaVersion:"V8_INTRADAY_MONITOR_PHYSICAL_ACCEPTANCE_V0_1",observedAt:time,day,
   method:"EXISTING_PRODUCTION_ADMIN_GET_ONLY",noWorkerWrite:true,noD1Write:true,noKVWrite:true,
   noStockSelection:true,noPlanChanges:true,no3MinWrite:true,noPush:true,noTrade:true,
   endpoints:{},result:null,errors:[]};
 const urls=[["config","/api/config"],["cron","/api/cron/status"],["live","/api/live"],
             ["signals","/api/signals"],["scan","/api/scan/status"]];
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
 record.result=evaluateMonitorReadback({...data,day});
 record.result.deployedMonitorAccess=record.endpoints.config===200&&record.endpoints.live===200;
 record.digest=createHash("sha256").update(JSON.stringify(record.result)).digest("hex");
 await mkdir("artifacts",{recursive:true});
 await writeFile("artifacts/v8-intraday-monitor-readback-"+day+".json",JSON.stringify(record,null,2)+"\n");
 console.log("V8_INTRADAY_MONITOR_REAL_ACCEPTANCE="+JSON.stringify(record));
 if(record.errors.length||!record.result.ok)process.exitCode=2;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])await main();
