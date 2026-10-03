import {appendFile,readFile} from "node:fs/promises";
import {resolveSystem1PostSessionSchedule} from "../research/system1_postsession_schedule_v0_1.mjs";

const source=await readFile(process.env.V7_TEST_WORKER_PATH||new URL("../Worker.js",import.meta.url),"utf8");
const helpers=await import("data:text/javascript;base64,"+Buffer.from(source+"\nexport {loadTradingCalendar,isTradingDate};").toString("base64"));

const now=new Date();
const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now);
const get=t=>parts.find(x=>x.type===t)?.value;
const taipeiToday=get("year")+"-"+get("month")+"-"+get("day");
const eventName=String(process.env.GITHUB_EVENT_NAME||"workflow_dispatch");
const requestedTradeDate=String(process.env.C3_REQUESTED_TRADE_DATE||"").trim();
const targetForCalendar=requestedTradeDate||taipeiToday;
if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(targetForCalendar)) throw new Error("C3_POSTSESSION_TARGET_DATE_INVALID");
await helpers.loadTradingCalendar({},Number(targetForCalendar.slice(0,4)));

const decision=resolveSystem1PostSessionSchedule({eventName,requestedTradeDate,taipeiToday,isTradingDate:helpers.isTradingDate});
const outputPath=String(process.env.GITHUB_OUTPUT||"").trim();
if(outputPath){
  await appendFile(outputPath,
    "should_run="+(decision.shouldRun?"true":"false")+"\n"+
    "target_trade_date="+decision.targetTradeDate+"\n"+
    "decision_status="+decision.status+"\n"
  );
}
console.log(JSON.stringify(decision));
