// Pure Node 22 offline smoke for the existing source Worker under disabled D1-only staging flags.
// This is NOT a Cloudflare deployment, not an endorsement of R2-free historical operation,
// and not proof of the currently deployed source Worker SHA.
import assert from "node:assert/strict";
import worker from "../deploy/worker.mjs";

const env=Object.freeze({
  SYSTEM2_CAPTURE_ENABLED:"false",
  SYSTEM2_CAPTURE_MODE:"LIMITED_PROSPECTIVE_SHADOW",
  SYSTEM2_CAPTURE_CONTRACT_VERSION:"0.1",
  SYSTEM2_RESONANCE_ENABLED:"false",
  SYSTEM2_RESONANCE_CONTRACT_VERSION:"0.1",
  // Intentionally no SYSTEM2_HISTORY_BUCKET / R2 / FUGLE_API_KEY / KV / D1.
});
assert.equal(env.SYSTEM2_HISTORY_BUCKET,undefined);
assert.equal(env.FUGLE_API_KEY,undefined);
assert.equal(env.SYSTEM2_DB,undefined);

async function get(path) {
  return worker.fetch(new Request("https://local-invalid.invalid"+path,{method:"GET"}),env);
}
const health=await get("/health");
assert.equal(health.status,200);
const healthJson=await health.json();
assert.equal(healthJson.schemaVersion,"BINDING_MISSING");
assert.equal(healthJson.captureEnabledRequested,false);
assert.equal(healthJson.resonanceState,"RESONANCE_DISABLED");
assert.equal(healthJson.system1RuntimeUsed,false);
assert.equal(healthJson.fugleQuoteConfigured,false);
const terminal=await get("/terminal");
assert.equal(terminal.status,200);
assert.match(terminal.headers.get("content-type")||"",/text\/html/i);
assert((await terminal.text()).length>1000);
const resonancePage=await get("/resonance");
assert.equal(resonancePage.status,200);
assert((await resonancePage.text()).length>100);
const root=await get("/");
assert.equal(root.status,200);
const missing=await get("/api/unknown-route");
assert.equal(missing.status,404);
const nonGet=await worker.fetch(new Request("https://local-invalid.invalid/health",{method:"POST"}),env);
assert.equal(nonGet.status,404);

let waits=[];
const context={waitUntil:p=>waits.push(Promise.resolve(p))};
await worker.scheduled({scheduledTime:Date.parse("2026-10-09T11:00:00Z")},env,context);
await Promise.all(waits);
assert.equal(waits.length,1);
await worker.scheduled({scheduledTime:Date.parse("2026-10-09T11:00:00Z")},env);
await assert.rejects(
  worker.scheduled({scheduledTime:Date.parse("2026-10-09T11:00:00Z")},{
    ...env,SYSTEM2_CAPTURE_ENABLED:"true",
  }),
  /CAPTURE_SOURCE_ADAPTERS_NOT_CONFIGURED/
);
console.log("System2 disabled Worker offline smoke PASS: GET UI/health and scheduled no R2/Fugle/D1 bindings");
