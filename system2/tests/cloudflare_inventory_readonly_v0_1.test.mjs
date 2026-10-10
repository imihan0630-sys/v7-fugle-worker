import assert from "node:assert/strict";
import { collectCloudflareInventory, publicCloudflareInventory } from "../migration/cloudflare_inventory_readonly_v0_1.mjs";
const account = "a".repeat(32);
const token = "never-log-this-token";
const seen = [];
const mock = async (url, options) => {
  seen.push({url, options});
  const path = new URL(url).pathname, u = new URL(url);
  const result = (obj, info) => ({ok:true, json: async () => ({success:true,result:obj,...(info ? {result_info:info}: {})})});
  if (path.endsWith("/d1/database")) return result([{name:"system2-research",uuid:"f".repeat(32)}],{total_count:1});
  if (path.endsWith("/workers/scripts")) return result([{id:"system2-shadow-research"},{id:"fugle-test"}]);
  if (path.endsWith("/r2/buckets")) {
    if (!u.searchParams.has("cursor")) return result({buckets:[{name:"system2-historical-research"}]}, {cursor:"next"});
    if (u.searchParams.get("cursor") === "next") return result({buckets:[{name:"extra"}]});
  }
  if (path.endsWith("/storage/kv/namespaces")) return result([], {total_count:0});
  if (path.endsWith("/system2-shadow-research/settings")) return result({bindings:[
    {name:"SYSTEM2_DB",type:"d1",database_id:"secret-db-uuid"},
    {name:"SYSTEM2_HISTORY_BUCKET",type:"r2_bucket",bucket_name:"system2-historical-research"},
    {name:"FUGLE_API_KEY",type:"secret_text",text:"should-not-print"},
  ]});
  if (path.endsWith("/system2-shadow-research/schedules")) return result({schedules:[{cron:"*/5 0-5,11 * * MON-FRI"}]});
  throw new Error("Unexpected mock endpoint: "+path);
};
const p = await collectCloudflareInventory({accountId:account,apiToken:token,fetchImpl:mock,now:()=>new Date("2026-10-10T01:30:00.000Z")});
assert.equal(p.databases.length,1);
assert.equal(p.buckets.length,2);
assert.equal(p.workers.length,2);
assert.equal(p.crons.length,1);
assert.deepEqual(seen.map(s=>s.options.method),new Array(seen.length).fill("GET"));
assert(!seen.some(s=>s.url.includes(token)));
const pub = publicCloudflareInventory(p);
const json = JSON.stringify(pub);
assert(!json.includes(account));
assert(!json.includes(token));
assert(!json.includes("should-not-print"));
assert(!json.includes("secret-db-uuid"));
assert(!json.includes("f".repeat(32)));
assert(json.includes("system2-research"));
assert(json.includes("SYSTEM2_DB"));
assert.equal(pub.complete,true);
await assert.rejects(collectCloudflareInventory({accountId:"INVALID",apiToken:token,fetchImpl:mock}),/ACCOUNT_IDENTITY|ACCOUNT_ID_INVALID|CLOUDFLARE_ACCOUNT_ID_INVALID/);
await assert.rejects(collectCloudflareInventory({accountId:account,apiToken:"",fetchImpl:mock}),/READ_ONLY_API_TOKEN_MISSING/);
await assert.rejects(collectCloudflareInventory({accountId:account,apiToken:token,fetchImpl:async()=>({ok:false,status:403})}),/API_ERROR_403/);
await assert.rejects(collectCloudflareInventory({accountId:account,apiToken:token,fetchImpl:async()=>({ok:true,json:async()=>({success:false})})}),/API_RESPONSE_INVALID/);
assert.throws(()=>publicCloudflareInventory({complete:true,accountId:""}),/UNVERIFIED_PRIVATE_INVENTORY/);
let count=0;
await assert.rejects(collectCloudflareInventory({accountId:account,apiToken:token,fetchImpl:async (url, opt)=>{
  count++;
  if (url.includes("/r2/buckets")) return {ok:true,json:async()=>({success:true,result:{buckets:[]},result_info:{cursor:"same"}})};
  return mock(url,opt);
}}),/R2_CURSOR_LOOP/);
console.log("System2 Cloudflare read-only inventory: 11 checks PASS; GET-only, sanitization, cursor/auth failure guards");
