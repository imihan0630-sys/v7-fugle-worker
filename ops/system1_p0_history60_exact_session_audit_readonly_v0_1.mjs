// Physical original System1 V7 D1 history audit after official data-only restoration.
// SELECT-only: exact completed bars, actual 60 TWSE sessions, holiday/halt ambiguity.
// No mutation of D1 history, seed-state, stock-config, worker, 3Min, push or billing.
import {mkdir,writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {buildOfficialTradingDatesV0_1} from "../system2/runtime/official_historical_backfill_source_v0_1.mjs";
import {auditHistoricalBars} from "./system1_p0_history60_exact_session_audit_lib_v0_1.mjs";
const account=process.env.CLOUDFLARE_ACCOUNT_ID||"";
const token=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN||process.env.CLOUDFLARE_API_TOKEN||"";
const target="2026-10-13";
if(!/^[a-f0-9]{32}$/i.test(account)||!token)throw Error("EXISTING_CLOUDFLARE_SOURCE_D1_READ_TOKEN_REQUIRED");
const calendar=await buildOfficialTradingDatesV0_1({fromDate:"2026-07-01",toDate:target});
if(!String(calendar.source||"").startsWith("TWSE_OFFICIAL")||
   calendar.tradingDates.length<60||
   calendar.tradingDates.at(-1)!==target)
 throw Error("OFFICIAL_EXACT_LAST_60_TRADING_SESSIONS_UNVERIFIED");
const last60=calendar.tradingDates.slice(-60);
const api="https://api.cloudflare.com/client/v4/accounts/"+account;
async function cf(path,method="GET",body){
 const r=await fetch(api+path,{method,headers:{
  authorization:"Bearer "+token,accept:"application/json",
  ...(body?{"content-type":"application/json"}:{})
 },...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(45000)});
 const d=await r.json().catch(()=>null);
 if(!r.ok||d?.success!==true)throw Error("D1_READONLY_PHYSICAL_HTTP_"+r.status);
 return d.result;
}
const databases=await cf("/d1/database?per_page=100");
const match=databases.filter(x=>x.name==="v7-live");
if(match.length!==1)throw Error("SOURCE_V7_LIVE_NOT_UNIQUE");
const id=match[0].uuid||match[0].id;
let lastSymbol="",queries=0,actualRowsRead=0;
const records=[];
while(true){
 if(++queries>35)throw Error("D1_READ_QUERY_CEILING");
 const sql="SELECT symbol,history_json,updated_at FROM v7_history_cache WHERE symbol>?1 ORDER BY symbol ASC LIMIT 75";
 const out=await cf("/d1/database/"+id+"/query","POST",{sql,params:[lastSymbol]});
 if(!Array.isArray(out)||out.length!==1||out[0].success!==true)
  throw Error("D1_SELECT_SOURCE_SCHEMA_UNVERIFIED");
 actualRowsRead+=Number(out[0].meta?.rows_read||0);
 if(actualRowsRead>20000)throw Error("D1_SELECT_SOURCE_ROW_CEILING");
 const rows=out[0].results||[];
 for(const row of rows){
  const symbol=String(row.symbol||"");
  let history=null;
  try{history=JSON.parse(row.history_json||"null");}catch{}
  if(!/^[1-9][0-9]{3}$/.test(symbol)){
   records.push({symbol,state:"OUTSIDE_ORDINARY_4DIGIT_UNIVERSE",dateEvidenceUnverified:true});
   continue;
  }
  const audit=auditHistoricalBars({symbol,bars:history,
    requiredTradingDates:last60,targetDate:target});
  records.push({...audit,lastWriteAt:row.updated_at||null});
 }
 if(rows.length===0||rows.length<75)break;
 lastSymbol=String(rows.at(-1).symbol||"");
 if(!lastSymbol)throw Error("D1_CURSOR_BROKEN");
}
const tally={};for(const r of records)tally[r.state]=(tally[r.state]||0)+1;
const short=records.filter(r=>r.has60Bars===false);
const stale=records.filter(r=>r.has60Bars===true&&r.hasLatestCompletedSession!==true);
const gap=records.filter(r=>r.has60Bars===true&&r.hasLatestCompletedSession===true&&!r.strictCalendarAligned);
const totalValid=records.filter(r=>r.has60Bars===true).length;
const latestCount=records.filter(r=>r.hasLatestCompletedSession===true).length;
const exactAligned=records.filter(r=>r.strictCalendarAligned===true).length;
const receipt={
 schema:"SYSTEM1_V8_P0_60_SESSION_PHYSICAL_HISTORY_QUALITY_AUDIT_V0_1",
 targetDate:target,observedAt:new Date().toISOString(),
 source:"ORIGINAL_SYSTEM1_V7_LIVE_D1_SELECT_ONLY_PLUS_OFFICIAL_TWSE_CALENDAR",
 tradingCalendarSource:calendar.source,fromRequiredSession:last60[0],lastRequiredSession:last60.at(-1),
 exactRequiredTradingSessionCount:last60.length,
 totalRows:records.length,sixtyValidBarCount:totalValid,
 latestCompletedBarCount:latestCount,strictExactSessionAlignedCount:exactAligned,
 allSourceRowsCertified:false,unresolvedListingHaltOrGaps:gap.length,
 incompleteBarCount:short.length,staleLatestCount:stale.length,
 classificationCounts:tally,readQueries:queries,d1RowsRead:actualRowsRead,
 noHistoryMutation:true,noSeedStateMutation:true,noWorkerWrite:true,noKVWrite:true,
 noTrade:true,noPush:true,noCandidatePromotion:true,
 status:records.every(r=>r.strictCalendarAligned)?"EXACT_SOURCE_ROWS_CALENDAR_ALIGNED":
    "INCOMPLETE_OR_POSSIBLY_HALTED_MUST_NOT_PROMOTE",
 rows:records
};
receipt.sha256=createHash("sha256").update(JSON.stringify(receipt)).digest("hex");
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/system1-p0-60-session-exact-source-audit.json",JSON.stringify(receipt,null,2)+"\n");
console.log("SYSTEM1_P0_60_SESSION_SOURCE_AUDIT="+JSON.stringify({
 total:receipt.totalRows,with60:totalValid,latest:latestCount,exactAligned,
 missingOrPossiblyHalted:gap.length,short:short.length,stale:stale.length,
 classes:tally,shortSamples:short.slice(0,20).map(x=>({symbol:x.symbol,state:x.state})),
 staleSamples:stale.slice(0,20).map(x=>({symbol:x.symbol,last:x.lastBarDate})),
 readQueries:queries,rowsRead:actualRowsRead,noD1Write:true
}));
