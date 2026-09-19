import assert from "node:assert/strict";

const origin="https://fugle-test.imihan0630.workers.dev";
assert.ok(process.env.V7_ADMIN_TOKEN,"V7_ADMIN_TOKEN required");
const headers={"x-admin-token":process.env.V7_ADMIN_TOKEN,"accept":"application/json"};

async function get(path,admin=true) {
  const response=await fetch(origin+path,{
    headers:admin?headers:{"accept":"text/html"},
    signal:AbortSignal.timeout(20000)
  });
  const text=await response.text();
  return {response,text};
}

const beforeResponse=await fetch(origin+"/api/config",{headers,signal:AbortSignal.timeout(20000)});
assert.equal(beforeResponse.ok,true,"Cannot read config before acceptance");
const before=await beforeResponse.json();

const overviewResult=await get("/api/system-overview");
assert.equal(overviewResult.response.ok,true,"system overview failed");
const overview=JSON.parse(overviewResult.text);
assert.equal(overview.version,"8.1.0-ops-hardening");
assert.equal(overview.requirements.total,30);
assert.ok(Number.isInteger(overview.requirements.completedCount));
assert.ok(Array.isArray(overview.requirements.incompleteRules));
assert.equal(overview.integrations.kvConfigured,true);
assert.equal(overview.integrations.d1Configured,true);
assert.equal(overview.latestPlan.threeMin.verified,true,"3Min recovery must remain verified");

const outboxResult=await get("/api/push-outbox?limit=10");
assert.equal(outboxResult.response.ok,true,"push outbox summary failed");
const outbox=JSON.parse(outboxResult.text);
assert.equal(outbox.configured,true);
assert.ok(typeof outbox.counts==="object");

const externalStatsResult=await get("/api/external-validation/stats");
assert.equal(externalStatsResult.response.ok,true,"external validation stats failed");
const externalStats=JSON.parse(externalStatsResult.text);
assert.ok(Number.isInteger(externalStats.days));
assert.equal(externalStats.noPlanChanges,true);

const page=await get("/system",false);
assert.equal(page.response.ok,true,"system page failed");
assert.match(page.text,/系統總控/);
assert.match(page.text,/30項完成度/);
assert.doesNotMatch(page.text,/tm_live_|ADMIN_TOKEN|PUSH_WEBHOOK_URL|THREEMIN_API_TOKEN/);

const afterResponse=await fetch(origin+"/api/config",{headers,signal:AbortSignal.timeout(20000)});
assert.equal(afterResponse.ok,true);
const after=await afterResponse.json();
assert.deepEqual(after,before,"Read-only ops acceptance must not alter monitoring config");

console.log(JSON.stringify({
  ok:true,
  version:overview.version,
  completedCount:overview.requirements.completedCount,
  incompleteRules:overview.requirements.incompleteRules,
  pushOutbox:outbox,
  externalValidationDays:externalStats.days,
  noPlanChanges:true,
  noPush:true,
  noThreeMinWrite:true
}));
