// System1 independent GH Mobile assigned-Issue STATUS backup. No production mutation.
// Only scheduled main and exact cron may create one GH issue per verified market day.
// GitHub push requires the account owner to enable issue-assignment notifications.
import {mkdir,writeFile} from "node:fs/promises";
import {classifyPostcloseBusinessChain} from "../research/system1_overnight_formal_delivery_readonly_v0_1.mjs";
const REPO="imihan0630-sys/v7-fugle-worker",OWNER="imihan0630-sys";
const BASE="https://fugle-test.imihan0630.workers.dev";
const CRON="30 16 * * 1-5"; // Taipei Tue-Sat 00:30, prior market session.
const OUT="artifacts/system1-p0-github-mobile-postclose-backup.json";
const closed=new Set(["2026-01-01","2026-02-12","2026-02-13","2026-02-15",
 "2026-02-16","2026-02-17","2026-02-18","2026-02-19","2026-02-20",
 "2026-02-27","2026-02-28","2026-04-03","2026-04-04","2026-04-05",
 "2026-04-06","2026-05-01","2026-06-19","2026-09-25","2026-09-28",
 "2026-10-09","2026-10-10","2026-10-25","2026-10-26","2026-12-25"]);
const dateOk=d=>/^\d{4}-\d{2}-\d{2}$/.test(String(d))&&
 Number.isFinite(Date.parse(d+"T00:00:00Z"))&&
 new Date(d+"T00:00:00Z").toISOString().slice(0,10)===d;
export function marketTarget(now=new Date()){
 const fmt=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",
  month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});
 const pp=fmt.formatToParts(now),get=k=>pp.find(p=>p.type===k)?.value;
 const date=[get("year"),get("month"),get("day")].join("-");
 if(!dateOk(date))throw Error("DATE_INVALID");
 const hour=Number(get("hour")),min=Number(get("minute"));
 if(hour>=16||(hour===0&&min<30))return {state:"SCHEDULE_TOO_LATE_OR_EARLY",date:null};
 const prior=new Date(Date.parse(date+"T12:00:00Z")-86400000).toISOString().slice(0,10);
 const dow=new Date(prior+"T12:00:00Z").getUTCDay();
 if(!prior.startsWith("2026-"))return {state:"CALENDAR_YEAR_UNVERIFIED",date:null};
 if(dow===0||dow===6||closed.has(prior))
  return {state:"MARKET_CLOSED_SKIP",date:prior};
 return {state:"MARKET_DAY",date:prior};
}
export function classified({date,chain,stocks}={}){
 if(!dateOk(date))throw Error("DATE_INVALID");
 const c=chain||{},n=c.formalSelectedCount;
 const exact=c.targetDate===date&&c.formalScanDate===date&&
 c.sourcesReady===true&&c.formalPipelineComplete===true&&
 c.formalSelectionAuthenticated===true&&
 c.primaryMonitorReadbackVerified===true&&
 Number.isSafeInteger(n)&&n>=0&&n<=6&&!Object.keys(c.readErrors||{}).length&&
 c.category!=="GET_READ_ERROR";
 const ids=Array.isArray(stocks)?stocks.map(s=>String(s?.symbol||"")):[];
 const idOk=ids.length===n&&ids.every(s=>/^\d{4}$/.test(s))&&new Set(ids).size===ids.length;
 let kind="UNKNOWN",label="盤後狀態未驗證";
 if(exact&&idOk){kind=n===0?"ZERO":"SELECTED";label=n===0?"確認選股 0 檔":"正式選股 "+n+" 檔";}
 else if(c.targetDate===date&&c.category!=="GET_READ_ERROR"&&
 !Object.keys(c.readErrors||{}).length&&
 ["FORMAL_SCAN_NOT_SAVED_AFTER_READY_SOURCES",
 "FORMAL_SCAN_NOT_SAVED_SOURCE_UNVERIFIED","FORMAL_SCAN_STALE_DATE",
 "FORMAL_SCAN_NOT_COMPLETE","PRIMARY_MONITOR_KV_NOT_VERIFIED"].includes(c.category)){
 kind="INCOMPLETE";label="盤後選股未完成";
 }
 const marker="SYSTEM1_POSTCLOSE:"+date;
 const title=(kind==="SELECTED"||kind==="ZERO"?"✅ ":"⚠️ ")+
 "System 1｜"+date+"｜"+label+" ["+marker+"]";
 const body=[
 "System 1 每日盤後備援狀態："+date,
 "狀態："+label,
 kind==="ZERO"?"同日 Formal+KV 精確驗證完成，確認選出 0 檔。":
 kind==="SELECTED"?"同日 Formal+KV 精確驗證完成，選出 "+n+" 檔。":
 "正式選股未完成或證據無法驗證；不是確認 0 檔，保留既有計畫。",
 kind==="SELECTED"?"正式代號："+ids.join("、"):"",
 "資料完整："+(c.sourcesReady===true?"有":"未驗證"),
 "正式保存："+(c.formalSelectionAuthenticated===true?"有":"未驗證"),
 "KV 同日讀回："+(c.primaryMonitorReadbackVerified===true?"有":"未驗證"),
 "原始日報 Outbox："+(c.dailyReportOutboxAccepted===true?"ACCEPTED（不等於手機收到）":"未驗證"),
 "判定代碼："+String(c.category||"GET_UNKNOWN").replace(/[^A-Z0-9_]/g,"").slice(0,80),
 "只讀狀態通知：不重選股，不更動持倉、停損、資金或交易計畫。",
 "GitHub 行動裝置推播須由帳號擁有者開啟 Issue 指派通知。",
 marker
 ].filter(Boolean).join("\n");
 return {kind,label,title,body,marker,verified:exact&&idOk,
 confirmedZero:kind==="ZERO",count:exact&&idOk?n:null,
 phoneReceivedProven:false,productionCoreUnchanged:true,noD1Write:true,noTrade:true};
}
const env=process.env;
const report={schema:"SYSTEM1_GH_ISSUE_BACKUP_V0_1",runAt:new Date().toISOString(),
 noChatGPTTask:true,noSlackToken:true,noCloudflarePOST:true,noCloudflareCronEdit:true,
 noD1Sql:true,noKVWrite:true,noTrade:true};
async function save(){await mkdir("artifacts",{recursive:true});
 await writeFile(OUT,JSON.stringify(report,null,2)+"\n");
 console.log("SYSTEM1_GH_MOBILE_BACKUP="+JSON.stringify(report));}
async function github(path,method,body){
 if(!path.startsWith("/repos/"+REPO+"/"))throw Error("OUTSIDE_REPO_DENIED");
 const r=await fetch("https://api.github.com"+path,{method,
  headers:{Authorization:"Bearer "+env.GITHUB_TOKEN,Accept:"application/vnd.github+json",
   "X-GitHub-Api-Version":"2022-11-28",
   ...(body?{"Content-Type":"application/json"}:{})},
  ...(body?{body:JSON.stringify(body)}:{}),redirect:"error",
  signal:AbortSignal.timeout(16000)});
 if(!r.ok)throw Error("GITHUB_HTTP_"+r.status);
 return r.json();
}
const offline=process.argv.includes("--dry-run");
const schedule=env.GITHUB_EVENT_NAME==="schedule"&&
 env.GITHUB_EVENT_SCHEDULE===CRON&&env.GITHUB_REF==="refs/heads/main"&&
 String(env.GITHUB_RUN_ATTEMPT||"1")==="1";
if(offline||!schedule){
 report.outcome="OFFLINE_NO_NETWORK_NO_ISSUE";await save();
}else{
 const target=marketTarget(new Date());report.targetDate=target.date;
 if(target.state!=="MARKET_DAY"){
  report.outcome=target.state;if(target.state==="CALENDAR_YEAR_UNVERIFIED")process.exitCode=2;
  await save();
 }else if(!env.GITHUB_TOKEN||!env.V7_ADMIN_TOKEN){
  report.outcome="REQUIRED_TOKEN_MISSING_NO_POST";process.exitCode=2;await save();
 }else{
  const date=target.date,values={},errors={};
  const paths={scan:"/api/scan/status",config:"/api/config",
   institution:"/api/institution-status?marketDate="+date,
   quality:"/api/quality-status?marketDate="+date,
   outbox:"/api/push-outbox?limit=50"};
  await Promise.all(Object.entries(paths).map(async([name,path])=>{
   try{
    const res=await fetch(BASE+path,{method:"GET",
     headers:{"x-admin-token":env.V7_ADMIN_TOKEN,Accept:"application/json",
      "Cache-Control":"no-store"},redirect:"error",signal:AbortSignal.timeout(18000)});
    if(!res.ok){errors[name]="HTTP_"+res.status;return;}
    const json=await res.json();
    if(!json||Array.isArray(json)||typeof json!=="object"){
     errors[name]="INVALID_JSON";return;
    }
    values[name]=json;
   }catch{errors[name]="GET_FAILED";}
  }));
  const chain=classifyPostcloseBusinessChain({targetDate:date,
   scanStatus:values.scan,monitor:values.config,
   institution:values.institution,quality:values.quality,outbox:values.outbox,
   readErrors:errors});
  const notice=classified({date,chain,stocks:values.scan?.stocks});
  report.noticeKind=notice.kind;report.category=chain.category;
  report.confirmedZero=notice.confirmedZero;
  report.readErrors=Object.keys(errors);
  report.outboxAccepted=chain.dailyReportOutboxAccepted===true;
  try{
   const since=encodeURIComponent(date+"T00:00:00Z");
   let already=false,fullyListed=false;
   for(let p=1;p<=5;p++){
    const list=await github("/repos/"+REPO+
      "/issues?state=all&since="+since+"&per_page=100&page="+p,"GET");
    if(!Array.isArray(list))throw Error("ISSUE_LIST_INVALID");
    if(list.some(i=>!i.pull_request&&String(i.title||"").includes(notice.marker))){
     already=true;break;
    }
    if(list.length<100){fullyListed=true;break;}
   }
   if(already){report.outcome="ALREADY_SENT_NO_DUPLICATE";}
   else if(!fullyListed)throw Error("ISSUE_LIST_TRUNCATED_FAIL_CLOSED");
   else{
    const created=await github("/repos/"+REPO+"/issues","POST",{
     title:notice.title,body:notice.body,assignees:[OWNER]});
    if(!Number.isSafeInteger(created?.number)||
       !String(created?.html_url||"").startsWith("https://github.com/"+REPO+"/issues/"))
       throw Error("POST_RESULT_UNVERIFIED");
    report.outcome="GITHUB_ASSIGNED_ISSUE_CREATED_NOT_PHONE_RECEIPT";
    report.issueNumber=created.number;report.issueUrl=created.html_url;
   }
  }catch(e){
   report.outcome="GITHUB_ISSUE_NOTIFICATION_FAILED";
   report.errorClass=/^[A-Z0-9_]+$/.test(String(e.message||""))?
    e.message:"ISSUE_ERROR_REDACTED";process.exitCode=2;
  }
  await save();
 }
}
