// Read-only preflight for the 00:10 Taipei C1 evidence collector.
// Reuses the same Worker calendar implementation as trading_day_gate.mjs.
// No D1/Cloudflare/admin-token access, business scan, or C3 registration.
import {readFile,writeFile,mkdir,appendFile} from "node:fs/promises";
import {resolve,dirname} from "node:path";
import {decideSystem1C1OfficialSessionV0_1} from
  "../research/system1_c1_official_session_gate_v0_1.mjs";
import {previousTaipeiDate} from
  "../research/system1_c1_readiness_v0_1.mjs";

const now=new Date(),date=String(process.env.C1_SCAN_DATE||previousTaipeiDate(now)).trim();
const source=await readFile(process.env.V7_TEST_WORKER_PATH||
  new URL("../Worker.js",import.meta.url),"utf8");
// The imported production calendar engine is referenced read-only. Failure to
// obtain or verify the calendar is a hard error, NOT a declared holiday.
const calendar=await import("data:text/javascript;base64,"+
  Buffer.from(source+"\nexport {loadTradingCalendar,isTradingDate};").toString("base64"));
await calendar.loadTradingCalendar({},Number(date.slice(0,4)));
const decision=decideSystem1C1OfficialSessionV0_1({
  now,requestedDate:date,calendarDate:date,isTradingDay:calendar.isTradingDate(date)
});
if(process.env.GITHUB_OUTPUT)await appendFile(process.env.GITHUB_OUTPUT,
  "proceed="+decision.proceed+"\nscan_date="+decision.scanDate+"\n");
if(!decision.proceed){
  const out=resolve(process.env.C1_READINESS_OUTPUT||"artifacts/system1-c1-readiness.json");
  await mkdir(dirname(out),{recursive:true});
  await writeFile(out,JSON.stringify({observedAt:new Date().toISOString(),...decision,
    category:"OFFICIAL_NONTRADING_SESSION",
    verificationFailure:null,eligibleForResearch:false,
    physicalEvidenceAcceptance:false},null,2)+"\n","utf8");
}
console.log(JSON.stringify(decision));
