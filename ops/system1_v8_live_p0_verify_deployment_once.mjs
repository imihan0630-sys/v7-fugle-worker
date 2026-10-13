// Owner-approved System 1 P0: strictly read-only deployed Worker verification.
// No configuration, trade, 3Min, push, D1, KV or Cron mutation.
import fs from "node:fs";
import assert from "node:assert/strict";
const host="https://fugle-test.imihan0630.workers.dev";
const hdr={"x-admin-token":process.env.V7_ADMIN_TOKEN,accept:"application/json","cache-control":"no-cache"};
const baseline=JSON.parse(fs.readFileSync("/tmp/v7-predeploy.json","utf8"));
const backup=JSON.parse(fs.readFileSync("/tmp/v7-predeploy-backup/metadata.json","utf8"));
const wait=t=>new Promise(r=>setTimeout(r,t));
const get=async (path,headers=hdr)=>{
  const r=await fetch(host+path+"?p0Verify="+Date.now(),{headers,signal:AbortSignal.timeout(20000)});
  if(!r.ok)throw Error("READBACK_"+path+"_"+r.status);
  return r.json();
};
let live,sources;
for(let i=0;i<20;i++){
  try{
    [live,sources]=await Promise.all([get("/api/live"),get("/api/live/sources")]);
    if(sources?.schema==="SYSTEM1_V8_LIVE_SOURCES_READONLY_V0_2"&&Array.isArray(sources.aideenSymbols)&&Array.isArray(sources.expectedMonitorKeys)&&typeof live.displayPopulationMatches==="boolean")break;
  }catch(e){if(i===19)throw e;}
  if(i===19)throw Error("NEW_V8_RUNTIME_PATCH_NEVER_OBSERVED");
  await wait(3000);
}
assert.equal(sources?.schema,"SYSTEM1_V8_LIVE_SOURCES_READONLY_V0_2");
assert.equal(sources.noWrite,true);assert.equal(sources.noPlanChanges,true);assert.equal(sources.noPush,true);assert.equal(sources.noTrade,true);
const after=await get("/api/config");
const old=await get("/api/version",{"cache-control":"no-cache",accept:"application/json"});
assert.equal(old.bindings.d1,true);assert.equal(old.bindings.kv,true);
assert.equal(after.updatedAt,baseline.configUpdatedAt);
assert.deepEqual(after.stocks.map(x=>String(x.symbol)).sort(),baseline.plannedStocks.map(x=>String(x.symbol)).sort());
assert.deepEqual(sources.configSymbols.map(String).sort(),after.stocks.map(x=>String(x.symbol)).sort());
assert.ok(Array.isArray(sources.aideenSymbols),"AIDEEN_SEPARATE_POOL_PROVENANCE_MISSING");
assert.ok(Array.isArray(sources.expectedMonitorKeys),"FULL_MONITOR_POPULATION_PROVENANCE_MISSING");
assert.equal(sources.expectedMonitorKeys.length,after.stocks.length+sources.aideenSymbols.length);
assert.equal(new Set(sources.expectedMonitorKeys).size,sources.expectedMonitorKeys.length,
  "MONITOR_IDENTITY_COLLISION");
if(sources.d1?.monitoredCount===sources.expectedMonitorKeys.length) {
  assert.equal(sources.d1PopulationMatches,true,"D1_FORMAL_AIDEEN_POOL_IDENTITY_NOT_RECONCILED");
}

const api="https://api.cloudflare.com/client/v4/accounts/"+process.env.CF_ACCOUNT_ID+"/workers/scripts/fugle-test/schedules";
const r=await fetch(api,{headers:{authorization:"Bearer "+process.env.CF_API_TOKEN},signal:AbortSignal.timeout(20000)});
const c=await r.json();assert.equal(r.ok&&c.success===true,true);
const schedule=x=>(Array.isArray(x)?x:(x?.schedules||[])).map(s=>s.cron||s).sort();
assert.deepEqual(schedule(c.result),schedule(backup.schedules),"PRODUCTION_CRON_CHANGED_UNAUTHORIZED");
console.log("S1_P0_DEPLOY_READBACK_PASS",JSON.stringify({
  runtimeVersion:old.version,configuredSymbols:after.stocks.map(x=>x.symbol),aideenSymbols:sources.aideenSymbols,
  d1:{"ageSec":sources.d1AgeSeconds,"count":sources.d1?.monitoredCount,matched:sources.d1PopulationMatches},
  kv:{"ageSec":sources.kvAgeSeconds,"count":sources.kv?.monitoredCount,matched:sources.kvPopulationMatches},
  selectedSource:live.displaySource,displayPopulationMatches:live.displayPopulationMatches,
  cronUnchanged:true,noWrite:true,noTrade:true,afterCloseIntradayNotVerified:true
}));
