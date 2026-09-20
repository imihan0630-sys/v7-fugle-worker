import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {replaceAfterMarketSchedule,updateCloudflareAfterMarketCron,OLD_AFTER_MARKET_CRON,NEW_AFTER_MARKET_CRON} from "./update_cloudflare_after_market_cron.mjs";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");

for(const marker of [
  '8.7.12-after-market-2335',
  '35 15 * * MON-FRI',
  '23:35 盤後掃描',
  '23:35盤後日',
  '供 ChatGPT 23:40 後自動回報使用'
]) assert.ok(source.includes(marker),marker);
assert.equal(source.includes('10 10 * * MON-FRI'),false);
assert.equal(source.includes('18:10 盤後掃描'),false);
assert.equal(source.includes('Number(value.hour) >= 18'),false);

const marketWorkflow=await readFile(new URL("../.github/workflows/v7-market-data.yml",import.meta.url),"utf8");
const mirrorWorkflow=await readFile(new URL("../.github/workflows/v8-plan-mirror.yml",import.meta.url),"utf8");
const healthWorkflow=await readFile(new URL("../.github/workflows/v7-health.yml",import.meta.url),"utf8");
const recoverySource=await readFile(new URL("./recover_after_market.mjs",import.meta.url),"utf8");
const healthSource=await readFile(new URL("./scheduled_health.mjs",import.meta.url),"utf8");
assert.ok(marketWorkflow.includes("25 15 * * 1-5"),"23:25 final data refresh missing");
assert.ok(marketWorkflow.includes("45 15 * * 1-5"),"23:45 recovery schedule missing");
assert.ok(mirrorWorkflow.includes("50 15 * * 1-5"),"23:50 encrypted mirror missing");
assert.ok(healthWorkflow.includes("55 15 * * 1-5"),"23:55 health verification missing");
assert.ok(recoverySource.includes("time<'23:35' || time>'23:59'"),"Recovery window must begin at 23:35");
assert.ok(healthSource.includes("time<'23:45' || time>'23:59'"),"After-market health must run after formal scan");

const migrated=replaceAfterMarketSchedule([
  {cron:"* 1-4 * * MON-FRI"},
  {cron:"0-24 5 * * MON-FRI"},
  {cron:"* 9 * * MON-FRI"},
  {cron:"10 10 * * MON-FRI"}
]);
assert.equal(migrated.changed,true);
assert.equal(migrated.schedules.length,4);
assert.ok(migrated.schedules.some(x=>x.cron===NEW_AFTER_MARKET_CRON));
assert.ok(!migrated.schedules.some(x=>x.cron===OLD_AFTER_MARKET_CRON));

let schedules=[
  {cron:"* 1-4 * * MON-FRI"},
  {cron:"0-24 5 * * MON-FRI"},
  {cron:"* 9 * * MON-FRI"},
  {cron:"10 10 * * MON-FRI"}
];
let puts=0;
const mockFetch=async(_url,options={})=>{
  if(options.method==="PUT"){
    puts++;
    schedules=JSON.parse(options.body);
    return {ok:true,status:200,json:async()=>({success:true,result:{schedules}})};
  }
  return {ok:true,status:200,json:async()=>({success:true,result:{schedules}})};
};
const result=await updateCloudflareAfterMarketCron({
  fetchImpl:mockFetch,accountId:"test-account",apiToken:"test-token",scriptName:"fugle-test"
});
assert.equal(result.ok,true);
assert.equal(result.changed,true);
assert.equal(puts,1);
assert.equal(result.after.includes(NEW_AFTER_MARKET_CRON),true);
assert.equal(result.after.includes(OLD_AFTER_MARKET_CRON),false);

assert.throws(()=>replaceAfterMarketSchedule([{cron:"0 0 * * mon-fri"}]),/refusing to guess/i);
assert.throws(()=>replaceAfterMarketSchedule([{cron:OLD_AFTER_MARKET_CRON},{cron:NEW_AFTER_MARKET_CRON}]),/manual review/i);

console.log(JSON.stringify({
  ok:true,
  taipeiAfterMarket:"23:35",
  cloudflareUtcCron:NEW_AFTER_MARKET_CRON,
  preservesOtherCron:true,
  broadEveningFallbackRemoved:true,
  formalCoreImpact:false
}));
