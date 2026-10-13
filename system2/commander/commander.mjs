// System2 Commander V0.1 — deterministic, owner-initiated, GitHub Issues-only dispatcher.
// No Cloudflare credential, Worker, Cron, D1, R2, V8 Formal Core, trade or push operation.
import {readFile,appendFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
const planUrl=new URL("./dispatch_plan_v0_1.json",import.meta.url);
export const marker=id=>"<!-- S2-COMMANDER-TASK:"+id+" -->";
export function verifyPlan(plan){
 if(plan.schemaVersion!=="S2_COMMANDER_PLAN_V0_1"||plan.commandIssue!==1229||plan.tasks.length!==14)throw Error("PLAN_OR_VERSION_DRIFT");
 const seen=new Set(plan.tasks.map(t=>t.id));
 if(seen.size!==14)throw Error("DUPLICATE_TASK");
 for(const t of plan.tasks){
  if(!/^M(0[1-9]|1[0-4])$/.test(t.id)||!plan.lanes[t.lane]||!Array.isArray(t.requiresVerified))throw Error("UNKNOWN_TASK_OR_LANE");
  if(t.requiresVerified.some(d=>d===t.id||!seen.has(d)))throw Error("UNRESOLVED_DEPENDENCY");
 }
 function visit(id,path=new Set()){
  if(path.has(id))throw Error("CYCLIC_DEPENDENCY");
  const next=new Set([...path,id]);
  for(const d of plan.tasks.find(t=>t.id===id).requiresVerified)visit(d,next);
 }
 for(const t of plan.tasks)visit(t.id);
 const cron=plan.tasks.find(t=>t.id==="M05");
 if(!cron.needsLiveApproval||!cron.requiresVerified.includes("M09")||!cron.requiresVerified.includes("M12"))throw Error("CRON_GATE_UNSAFE");
 return true;
}
export function auditPass(issue,id,comments=[]){
 const labels=(issue.labels||[]).map(x=>typeof x==="string"?x:x.name);
 if(issue.state!=="closed"||!labels.includes("s2cmd:audited-pass"))return false;
 return comments.some(c=>(c.user?.login==="imihan0630-sys")&&
  (c.body||"").includes("[S2CMD-INDEPENDENT-AUDIT-PASS "+id+"]")&&
  /https:\/\/github\.com\/imihan0630-sys\/v7-fugle-worker\/actions\/runs\/\d+/.test(c.body)&&
  /Artifact\s*#?\d+/i.test(c.body)&&/SHA-256:\s*[a-f0-9]{64}/i.test(c.body));
}
export function decide(plan,existing=[],verified={},liveApproval={},limits={}){
 verifyPlan(plan);
 const max=limits.max??plan.maxNewIssuesPerRun,laneMax=limits.laneMax??plan.maxUnverifiedPerLane;
 if(!Number.isInteger(max)||max<0||max>14||!Number.isInteger(laneMax)||laneMax<1||laneMax>4)throw Error("UNSAFE_LIMIT");
 const mapped=new Map(),occupied=Object.fromEntries(Object.keys(plan.lanes).map(k=>[k,0]));
 for(const issue of existing){
  const id=(issue.body||"").match(/<!-- S2-COMMANDER-TASK:(M\d{2}) -->/)?.[1];
  if(!id)continue;
  if(mapped.has(id))throw Error("DUPLICATE_ISSUE_"+id);
  mapped.set(id,issue);
 }
 for(const t of plan.tasks)if(mapped.has(t.id)&&verified[t.id]!==true)occupied[t.lane]++;
 const ready=[],waiting=[],present=[];
 const sorted=[...plan.tasks].sort((a,b)=>a.priority-b.priority||a.id.localeCompare(b.id));
 for(const t of sorted){
  if(mapped.has(t.id)){present.push({id:t.id,number:mapped.get(t.id).number,lane:t.lane,verified:verified[t.id]===true});continue;}
  const missing=t.requiresVerified.filter(id=>verified[id]!==true);
  if(t.needsLiveApproval&&liveApproval[t.id]!==true)missing.push("EXPLICIT_OWNER_LIVE_APPROVAL");
  if(missing.length){waiting.push({id:t.id,lane:t.lane,reason:"DEPENDENCY_OR_AUTHORIZATION",missing});continue;}
  if(ready.length>=max||occupied[t.lane]>=laneMax){waiting.push({id:t.id,lane:t.lane,reason:"LANE_CAPACITY",missing:[]});continue;}
  ready.push(t);occupied[t.lane]++;
 }
 return {ready,waiting,present,occupied,total:plan.tasks.length};
}
export function issueBody(plan,t,sha){
 return [
  marker(t.id),"## 總指揮派工："+t.id,"",
  "**主責：** "+plan.lanes[t.lane]+"　**Lane：** "+t.lane,
  "**任務階段：** "+t.phase+"　**優先序：** "+t.priority,
  "**原始 Issues：** "+t.refs.map(n=>"#"+n).join("、"),
  "**派工時 main：** "+sha+"（實際執行前必須再次讀最新 main）","",
  "### 本輪需要完成",t.title,"",
  "### 實體驗收標準",t.acceptance,"",
  "### 安全施工範圍",
  "1. 按 GitHub 正式治理先讀主檔、最新 checkpoint 與原始 Issue，避免重做或拿記憶當正式版本。",
  "2. 診斷→安全實作→測試→PR/CI→實體 Run/Job/Artifact→獨立稽核；CI SUCCESS 不得等同真實 Cloudflare 正式部署。",
  "3. Cloudflare Worker/Cron、付費、Secret、D1 高額寫入與 V8 Formal 有額外正式授權邊界；本派工 Issue **不是**雲端寫入授權。",
  "4. 必須保存原始 SHA、UTC/台北時間、反證、阻塞與可重現性；不能把初步 580 檔觀察當正式入選。",
  "5. 獨立稽核完成後，由 owner 於 Issue 留 [S2CMD-INDEPENDENT-AUDIT-PASS "+t.id+"]，並附真實 GitHub Actions Run URL、Artifact #、SHA-256: <64hex>；僅在已獨立驗證後才使用 s2cmd:audited-pass label 並關閉。",
  "6. 暫不自動喚醒其他 ChatGPT 聊天室。Work/Codex 若已有合規執行環境，可從本 GitHub Issue 接手並提交 PR；不能假裝雲端 Agent 已啟動。"
 ].join("\n");
}
export function formatReceipt(plan,result,created,sha,command){
 const createdText=created.map(x=>x.id+"→#"+x.number+"（"+plan.lanes[x.lane]+"）").join("、")||"本輪無新增";
 const waiting=result.waiting.map(x=>x.id+" "+x.reason+(x.missing.length?": "+x.missing.join(","):"")).join("；");
 return "## [S2-COMMANDER-RECEIPT] "+new Date().toISOString()+"\n"+
  "命令："+command+"；最新 main："+sha+"\n"+
  "固定任務母數："+result.total+"；既有任務："+result.present.length+"；本輪新增："+created.length+"；待依賴/額度："+result.waiting.length+"。\n"+
  "新增："+createdText+"\n待辦："+(waiting||"無")+"\n"+
  "**僅建立 GitHub Issues，Cloudflare 資源變更=0，未呼叫其他 ChatGPT 聊天室，未啟動 Codex Cloud，正式 PASS 必須由稽核原始物證判定。**";
}
async function github(repo,token,path,method="GET",data){
 const resp=await fetch("https://api.github.com/repos/"+repo+path,{method,headers:{
  Authorization:"Bearer "+token,Accept:"application/vnd.github+json",
  "X-GitHub-Api-Version":"2022-11-28","Content-Type":"application/json"
 },...(data===undefined?{}:{body:JSON.stringify(data)}),signal:AbortSignal.timeout(25000)});
 const result=await resp.json().catch(()=>null);
 if(!resp.ok)throw Error("GH_"+method+"_"+resp.status+"_"+path.split("?")[0]);
 return result;
}
async function allPages(repo,token,path){
 const all=[];
 for(let i=1;i<=6;i++){
  const rows=await github(repo,token,path+(path.includes("?")?"&":"?")+"per_page=100&page="+i);
  if(!Array.isArray(rows))throw Error("GH_EXPECTED_ARRAY");
  all.push(...rows);
  if(rows.length<100)return all;
 }
 throw Error("GH_PAGINATION_LIMIT");
}
async function ensureLabels(repo,token){
 const labels=await allPages(repo,token,"/labels");
 for(const [name,color] of [["s2cmd:task","24315e"],["s2cmd:audited-pass","216e39"]]){
  if(labels.some(x=>x.name===name))continue;
  await github(repo,token,"/labels","POST",{name,color,description:"System 2 commander audited task control"});
 }
}
async function run(){
 const plan=JSON.parse(await readFile(planUrl,"utf8"));verifyPlan(plan);
 const repo=process.env.GITHUB_REPOSITORY,token=process.env.GITHUB_TOKEN,command=process.env.S2_COMMAND||"start";
 if(repo!==plan.repository||!token||!["start","status"].includes(command))throw Error("UNAUTHORIZED_ENV_OR_COMMAND");
 const sha=(await github(repo,token,"/commits/main")).sha;
 if(!/^[a-f0-9]{40}$/.test(sha))throw Error("UNVERIFIED_MAIN");
 await ensureLabels(repo,token);
 const issues=await allPages(repo,token,"/issues?state=all&labels=s2cmd:task");
 const verified={};
 for(const issue of issues){
  const id=(issue.body||"").match(/<!-- S2-COMMANDER-TASK:(M\d{2}) -->/)?.[1];
  if(!id)continue;
  const comments=await allPages(repo,token,"/issues/"+issue.number+"/comments");
  verified[id]=auditPass(issue,id,comments);
 }
 const ownerComments=await allPages(repo,token,"/issues/"+plan.commandIssue+"/comments");
 const liveApproval={};
 for(const t of plan.tasks.filter(t=>t.needsLiveApproval)){
  liveApproval[t.id]=ownerComments.some(c=>c.user?.login==="imihan0630-sys"&&
   (c.body||"").trim()==="[S2CMD-OWNER-LIVE-APPROVAL "+t.id+"]");
 }
 const result=decide(plan,issues,verified,liveApproval),created=[];
 if(command==="start")for(const t of result.ready){
  const issue=await github(repo,token,"/issues","POST",{
   title:"[S2CMD]["+t.id+"]["+t.lane+"] "+t.title,
   body:issueBody(plan,t,sha),labels:["s2cmd:task"]
  });
  created.push({id:t.id,number:issue.number,lane:t.lane});
 }
 const receipt=formatReceipt(plan,result,created,sha,command);
 await github(repo,token,"/issues/"+plan.commandIssue+"/comments","POST",{body:receipt});
 if(process.env.GITHUB_STEP_SUMMARY)await appendFile(process.env.GITHUB_STEP_SUMMARY,receipt+"\n");
 console.log(JSON.stringify({state:"GITHUB_ISSUES_ONLY",command,main:sha,newIssues:created,existing:result.present.length,waiting:result.waiting.length,cloudflareResourceOperations:0}));
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])run().catch(e=>{console.error("S2_COMMANDER_FAIL_CLOSED",e.message);process.exitCode=1});
