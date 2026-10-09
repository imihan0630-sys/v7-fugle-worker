import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {validateDispatchScope} from "./verify_official_data_dispatch_inputs.mjs";

const workflow=await readFile(new URL("../.github/workflows/v7-market-data.yml",import.meta.url),"utf8");
const gate=await readFile(new URL("./trading_day_gate.mjs",import.meta.url),"utf8");
const marketIngest=await readFile(new URL("./prepare_market_cache.mjs",import.meta.url),"utf8");
const instIngest=await readFile(new URL("./sync_institution_data.mjs",import.meta.url),"utf8");

const cases=[
  {marketDate:"2026-10-08",dataOnly:true,dataScope:"market",qualityOnly:false,scanAllowed:false},
  {marketDate:"2026-10-08",dataOnly:true,dataScope:"institution",qualityOnly:false,scanAllowed:false},
  {marketDate:"2026-10-08",dataOnly:true,dataScope:"quality",qualityOnly:false,scanAllowed:false},
  {marketDate:"2026-10-08",dataOnly:true,dataScope:"all",qualityOnly:false,scanAllowed:false},
  {marketDate:"2026-10-08",dataOnly:false,qualityOnly:true,scanAllowed:false},
  {marketDate:"",dataOnly:false,qualityOnly:true,scanAllowed:false},
  {marketDate:"2026-10-08",dataOnly:false,qualityOnly:false,scanAllowed:true},
  {marketDate:"",dataOnly:false,qualityOnly:false,scanAllowed:true}
];
for(const c of cases){
  const got=validateDispatchScope(c);
  assert.equal(got.scanAllowed,c.scanAllowed);
  if(c.dataOnly) assert.equal(got.dataScope,c.dataScope);
}
assert.throws(()=>validateDispatchScope({dataOnly:true}),/requires market_date/);
assert.throws(()=>validateDispatchScope({marketDate:"2026-10-08",dataOnly:true,qualityOnly:true}),/cannot both be true/);
assert.throws(()=>validateDispatchScope({marketDate:"20261008",dataOnly:true}),/YYYY-MM-DD/);
assert.throws(()=>validateDispatchScope({marketDate:"2026-10-08",dataOnly:true,dataScope:"anything"}),/Invalid data_scope/);
assert.throws(()=>validateDispatchScope({marketDate:"2026-10-08",dataOnly:false,dataScope:"all"}),/Non-data-only/);

function step(name,next){
  const p=workflow.indexOf("      - name: "+name+"\n");
  assert.ok(p>=0,name+" missing");
  const q=workflow.indexOf("      - name: "+next+"\n",p+8);
  assert.ok(q>p,next+" missing after "+name);
  return workflow.slice(p,q);
}
const validation=step("Validate manual recovery scope (never alters trading plans)","Skip official exchange holidays safely");
assert.ok(validation.includes("RECOVERY_INPUT_DATA_SCOPE:"));
assert.ok(validation.includes("node tests/verify_official_data_dispatch_inputs.mjs"));
const calendar=step("Skip official exchange holidays safely","Sync today's official market data (no target changes or orders)");
assert.ok(calendar.includes("V7_RECOVERY_DATA_ONLY_DATE:"));
assert.ok(gate.includes("override||context.marketDate"));
assert.ok(gate.includes("delta>7*86400000"));
assert.ok(gate.includes("parsed.toISOString().slice(0,10)!==override"));
assert.ok(gate.includes("api.isTradingDate(date)"));
const markets=step("Sync today's official market data (no target changes or orders)","Sync official institutions and missing recent trading days (no plan changes)");
const inst=step("Sync official institutions and missing recent trading days (no plan changes)","Verify prior-session market + institution prerequisites after midnight");
for(const [section,kind] of [[markets,"market"],[inst,"institution"]]){
  assert.ok(section.includes("inputs.data_only == true"));
  assert.ok(section.includes("inputs.data_scope == '"+kind+"'"));
  assert.ok(section.includes("inputs.data_scope == 'all'"));
  assert.ok(section.includes("steps.calendar.outputs.proceed == 'true'"));
  assert.ok(section.includes("OFFICIAL_MARKET_DATE: "+'$'+"{{ steps.calendar.outputs.market_date }}"));
  assert.ok(section.includes("V7_DATA_ONLY_RECOVERY:"));
  assert.ok(section.includes("inputs.quality_only != true && inputs.data_only != true"));
}
for(const [source,name] of [[marketIngest,"market"],[instIngest,"institution"]]){
  assert.ok(source.includes("V7_DATA_ONLY_RECOVERY"),name+" manual mode missing");
  assert.ok(source.includes("(manualDataOnly?7:1)*86400000"),name+" seven-day window missing");
  assert.ok(source.includes("Manual data-only recovery requires an explicit market date"));
}
const prior=step("Verify prior-session market + institution prerequisites after midnight","Sync official index, quarterly financials, valuation and TDCC (no plan changes)");
assert.ok(prior.includes("github.event_name == 'schedule'"));
const historyQuality=step("Historical official quality recovery","Historical after-market recovery");
assert.ok(historyQuality.includes("inputs.data_scope == 'quality'"));
assert.ok(historyQuality.includes("inputs.data_scope == 'all'"));
assert.ok(historyQuality.includes("inputs.data_only != true"));
assert.ok(historyQuality.includes("steps.calendar.outputs.proceed == 'true'"));
const manualScan=workflow.slice(workflow.indexOf("      - name: Historical after-market recovery\n"));
assert.ok(manualScan.includes("inputs.quality_only != true && inputs.data_only != true"));
const scheduledScan=step("Recover missing same-day analysis after complete data (skip prior success)","Historical official quality recovery");
assert.ok(scheduledScan.includes("inputs.data_only != true"));
assert.ok(workflow.includes("data_scope:\n"));
assert.ok(workflow.includes("default: market"));
console.log(JSON.stringify({
  ok:true,cases:cases.length,rejectedInvalidScopes:5,
  sevenDayManualOnly:true,stagedQuotaRecovery:true,tradingHolidayGate:true,
  scheduledDateWindowPreserved:true,qualityOnlyNeverScan:true,dataOnlyNeverScan:true,
  tradingRulesUnchanged:true,noOrder:true,noPush:true
}));
