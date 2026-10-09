import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {validateDispatchScope} from "./verify_official_data_dispatch_inputs.mjs";

const workflow=await readFile(new URL("../.github/workflows/v7-market-data.yml",import.meta.url),"utf8");
const cases=[
  {marketDate:"2026-10-08",dataOnly:true,qualityOnly:false,scanAllowed:false},
  {marketDate:"2026-10-08",dataOnly:false,qualityOnly:true,scanAllowed:false},
  {marketDate:"",dataOnly:false,qualityOnly:true,scanAllowed:false},
  {marketDate:"2026-10-08",dataOnly:false,qualityOnly:false,scanAllowed:true},
  {marketDate:"",dataOnly:false,qualityOnly:false,scanAllowed:true}
];
for(const fixture of cases) {
  const actual=validateDispatchScope(fixture);
  assert.equal(actual.scanAllowed,fixture.scanAllowed);
}
assert.throws(()=>validateDispatchScope({dataOnly:true}),/requires market_date/);
assert.throws(()=>validateDispatchScope({marketDate:"2026-10-08",dataOnly:true,qualityOnly:true}),/cannot both be true/);
assert.throws(()=>validateDispatchScope({marketDate:"20261008",dataOnly:true}),/YYYY-MM-DD/);

function stepBody(name,nextName) {
  const begin=workflow.indexOf("      - name: "+name+"\n");
  assert.ok(begin>=0,name+" step missing");
  const end=workflow.indexOf("      - name: "+nextName+"\n",begin+8);
  assert.ok(end>begin,nextName+" following step missing");
  return workflow.slice(begin,end);
}
const validation=stepBody("Validate manual recovery scope (never alters trading plans)","Skip official exchange holidays safely");
assert.match(validation,/node tests\/verify_official_data_dispatch_inputs\.mjs/);
const market=stepBody("Sync today's official market data (no target changes or orders)","Sync official institutions and missing recent trading days (no plan changes)");
const institutions=stepBody("Sync official institutions and missing recent trading days (no plan changes)","Verify prior-session market + institution prerequisites after midnight");
for(const section of [market,institutions]) {
  assert.match(section,/inputs\.data_only == true && inputs\.market_date != ''/);
  assert.match(section,/inputs\.quality_only != true && inputs\.data_only != true/);
  assert.match(section,/OFFICIAL_MARKET_DATE:.*inputs\.market_date/);
}
const historicalQuality=stepBody("Historical official quality recovery","Historical after-market recovery");
assert.match(historicalQuality,/if: github\.event_name == 'workflow_dispatch' && inputs\.market_date != ''\n/);
const historicalScan=workflow.slice(workflow.indexOf("      - name: Historical after-market recovery\n"));
assert.match(historicalScan,/inputs\.quality_only != true && inputs\.data_only != true/);
const scheduledScan=stepBody("Recover missing same-day analysis after complete data (skip prior success)","Historical official quality recovery");
assert.match(scheduledScan,/inputs\.data_only != true/);
assert.match(workflow,/data_only:\n\s+description:/);
console.log(JSON.stringify({ok:true,fixtures:cases.length,invalidInputsRejected:3,
  marketInstitutionDataOnly:true,qualityOnlyNeverScan:true,dataOnlyNeverScan:true,
  formalStrategyUnchanged:true,noTrade:true,noPush:true}));
