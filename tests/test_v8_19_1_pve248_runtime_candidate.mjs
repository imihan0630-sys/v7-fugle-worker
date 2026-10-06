import assert from "node:assert/strict";
import vm from "node:vm";
import {readFile} from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");

const functionSlice=(name,nextMarker)=>{
  const start=source.indexOf(`function ${name}`);
  assert.ok(start>=0,`${name} missing`);
  const end=source.indexOf(nextMarker,start);
  assert.ok(end>start,`${name} end marker missing`);
  return source.slice(start,end);
};

const afterMarketSource=functionSlice("isAfterMarketSchedule","async function runAfterMarketScan");
const sandbox={};
vm.runInNewContext(afterMarketSource+"\nglobalThis.__fn=isAfterMarketSchedule;",sandbox);
assert.equal(sandbox.__fn({cron:"35 15 * * MON-FRI"}),true,"single 23:35 cron must remain recognized");
assert.equal(sandbox.__fn({cron:"35,55 15 * * mon-fri"}),true,"combined 23:35/23:55 cron must be recognized");
assert.equal(sandbox.__fn({cron:"* 1-4 * * MON-FRI"}),false,"intraday cron must not be after-market");
assert.equal(sandbox.__fn({cron:"* 9 * * MON-FRI"}),false,"history warmup cron must not be after-market");

for(const marker of [
  'runAfterMarketScan(env, scheduledTime,{onlyIfMissing:true})',
  'detail: result?.status || result?.reason || null',
  'runPvBaselineWarmupSidecar(env,scheduledTime)',
  'source:"PVE248_AFTER_MARKET_RESEARCH_SIDECAR"',
  'bootstrapReceipt:cache?.bootstrapReceipt||null',
  'bootstrapAttemptAt',
  'providerStatus',
  'rawRowCount',
  'normalizedSessionCount',
  'rejectedSessionCount',
  'rejectedSessionReasons',
  'finalValidSessions',
  'const rawText=await response.text()',
  'rawPayloadHash:await pvSha256Hex(rawText)',
  'rawPayloadHashBasis:"EXACT_PROVIDER_RESPONSE_SHA256"',
  'provider:"FUGLE"',
  'pvSession15.rawProvenance=raw?.__pvRawProvenance||null',
  'provider:rawProvenance.provider||null',
  'endpoint:rawProvenance.endpoint||null',
  'rawPayloadHash:rawProvenance.rawPayloadHash||null'
]) assert.ok(source.includes(marker),marker);

assert.equal(source.includes('endpoint:url+"?api_key="'),false,"secret material must not be appended to persisted endpoint");
assert.equal(source.includes('endpoint:url+"&api_key="'),false,"secret material must not be appended to persisted endpoint");

// The candidate must not alter protected Formal definitions.
for(const marker of [
  'const MAX_STOCKS_PER_POOL = 3;',
  'const THOUSAND_STOCK_PRICE = 1000;',
  'const MAX_STOCKS = 6;',
  '15分K正式確認',
  'WATCH不占3席、不占20萬'
]) assert.ok(source.includes(marker),`protected Formal marker missing: ${marker}`);

console.log(JSON.stringify({
  ok:true,
  class:"B_CANDIDATE_UNMERGED",
  combinedCronRecognition:true,
  recoveryOnlyIfMissing:true,
  baselineWarmupFailOpen:true,
  bootstrapReceipt:true,
  exactRawResponseHash:true,
  formalMarkerChanges:0,
  productionDeployAuthorized:false
}));
