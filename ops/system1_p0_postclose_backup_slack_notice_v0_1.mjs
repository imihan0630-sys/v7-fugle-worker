// Independent GitHub-runner fallback STATUS notice, never a trade/plan/push replay.
// Safe-by-default: PR/manual never POST; only the scheduled run after market day,
// when owner has separately configured the dedicated Slack Incoming Webhook.
// This is intentionally independent of the Cloudflare Worker CPU budget.
import {mkdir,writeFile} from "node:fs/promises";
import {resolveScheduledPostcloseTarget,classifyPostcloseBusinessChain}
 from "../research/system1_overnight_formal_delivery_readonly_v0_1.mjs";
import {classifyPostcloseNotice}
 from "../research/system1_p0_postclose_notice_contract_v0_1.mjs";
const BASE="https://fugle-test.imihan0630.workers.dev";
const OUT="artifacts/system1-p0-postclose-backup-notice.json";
const dryRun=process.argv.includes("--dry-run");
const event=String(process.env.GITHUB_EVENT_NAME||"");
const eventCron=String(process.env.GITHUB_EVENT_SCHEDULE||"");
const attempt=Number(process.env.GITHUB_RUN_ATTEMPT||"1");
const admin=String(process.env.V7_ADMIN_TOKEN||"");
const webhook=String(process.env.SYSTEM1_POSTCLOSE_SLACK_WEBHOOK_URL||"");
const expectedCron="15 16 * * 1-5"; // UTC Mon-Fri = Taipei Tue-Sat at 00:15.
const after=resolveScheduledPostcloseTarget(new Date());
let report={schema:"SYSTEM1_P0_POSTCLOSE_BACKUP_SLACK_V0_1",
 observedAt:new Date().toISOString(),targetDate:after.targetDate||null,
 transport:"GITHUB_RUNNER_TO_SLACK_WEBHOOK_ONLY",
 noBusinessPOST:true,noCloudflareWorkerPOST:true,noD1Sql:true,noKVMutation:true,
 noPlanChange:true,noCronEdit:true,noTrade:true,
 phoneReceiptProven:false,originalTradeSignalReplayed:false};
function safeTimeDate(target){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(target||""))return false;
 const day=new Date(target+"T12:00:00Z").getUTCDay();
 if(day===0||day===6)return false;
 // Closed days from locked Worker 2026 official Taiwan calendar; do not claim
 // any other years have been independently validated.
 const holidays=new Set(["2026-01-01","2026-02-12","2026-02-13","2026-02-16",
  "2026-02-17","2026-02-18","2026-02-19","2026-02-20",
  "2026-02-27","2026-04-03","2026-04-06","2026-05-01",
  "2026-06-19","2026-09-25","2026-09-28","2026-10-09",
  "2026-10-26","2026-12-25"]);
 return target.startsWith("2026-")&&!holidays.has(target);
}
async function saved(){
 await mkdir("artifacts",{recursive:true});
 await writeFile(OUT,JSON.stringify(report,null,2)+"\n");
 console.log("SYSTEM1_P0_POSTCLOSE_BACKUP_NOTICE="+JSON.stringify(report));
}
if(dryRun){
 report={...report,status:"OFFLINE_DRY_RUN_NO_NETWORK",wouldSend:false};
 await saved();
}else if(event!=="schedule"||eventCron!==expectedCron||attempt!==1){
 report={...report,status:"NO_POST_OUTSIDE_PRIMARY_SCHEDULE_ATTEMPT",wouldSend:false};
 await saved();
}else if(!after.targetDate||!safeTimeDate(after.targetDate)){
 report={...report,status:"NOT_VERIFIED_2026_TRADING_DATE_NO_POST",wouldSend:false};
 await saved();
}else if(!admin||!webhook){
 report={...report,status:"NOT_CONFIGURED_NO_EXTERNAL_POST",
  errorClass:!admin?"ADMIN_READ_TOKEN_MISSING":"DEDICATED_SLACK_WEBHOOK_MISSING",wouldSend:false};
 await saved();process.exitCode=2;
}else if(!/^https:\/\/hooks\.slack\.com\/services\/[A-Z0-9]+\/[A-Z0-9]+\/[A-Za-z0-9]+$/.test(webhook)){
 report={...report,status:"WEBHOOK_HOST_NOT_ALLOWLISTED_NO_POST",wouldSend:false};
 await saved();process.exitCode=2;
}else{
 const date=after.targetDate;
 const paths={
  scanStatus:"/api/scan/status",monitor:"/api/config",
  institution:"/api/institution-status?marketDate="+date,
  quality:"/api/quality-status?marketDate="+date,
  outbox:"/api/push-outbox?limit=50"
 };
 const values={},errors={};
 await Promise.all(Object.entries(paths).map(async ([key,p])=>{
  try{
   const res=await fetch(BASE+p,{method:"GET",headers:{
    "x-admin-token":admin,accept:"application/json","cache-control":"no-cache"},
    signal:AbortSignal.timeout(16000),redirect:"error"});
   if(!res.ok){errors[key]="HTTP_"+res.status;return;}
   const data=await res.json();
   if(!data||typeof data!=="object"||Array.isArray(data)){errors[key]="BAD_JSON";return;}
   values[key]=data;
  }catch{errors[key]="GET_FAILED";}
 }));
 const chain=classifyPostcloseBusinessChain({targetDate:date,
  scanStatus:values.scanStatus,monitor:values.monitor,
  institution:values.institution,quality:values.quality,outbox:values.outbox,
  readErrors:errors});
 const notice=classifyPostcloseNotice({targetDate:date,chain});
 report={...report,targetDate:date,chainCategory:chain.category,
  messageKind:notice.kind,signalId:notice.signalId,
  sourceReadErrors:Object.keys(errors),originalOutboxAccepted:chain.dailyReportOutboxAccepted,
  formalVerified:chain.formalSelectionAuthenticated,
  actualZeroProven:notice.actualZeroProven};
 if(!notice.shouldSendBackup){
  report.status="ORIGINAL_DAILY_RESULT_ACCEPTED_SKIP_BACKUP";
  report.backupSent=false;await saved();
 }else{
  const payload={text:[
    notice.title+"｜"+date,
    notice.message,"盤後備援狀態通知（不是交易訊號）",
    "識別："+notice.signalId
   ].join("\n")};
  try{
   const res=await fetch(webhook,{method:"POST",headers:{"content-type":"application/json"},
    body:JSON.stringify(payload),redirect:"error",signal:AbortSignal.timeout(16000)});
   report.status=res.ok?"BACKUP_SLACK_HTTP_ACCEPTED_NOT_HANDSET_RECEIPT":"BACKUP_SLACK_HTTP_FAILED";
   report.backupSent=res.ok;report.httpStatus=res.status;
   if(!res.ok)process.exitCode=2;
  }catch{
   report.status="BACKUP_SLACK_TRANSPORT_FAILED";report.backupSent=false;process.exitCode=2;
  }
  await saved();
 }
}
