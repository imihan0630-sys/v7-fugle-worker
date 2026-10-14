import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import vm from "node:vm";
import {execFileSync} from "node:child_process";

const root=new URL("../",import.meta.url);
execFileSync("python3",["scripts/apply_system1_p0_pinned_scan_runtime_reviewonly.py"],{cwd:new URL(".",root)});
const original=await readFile(new URL("../Worker.js",import.meta.url),"utf8");
const generated=await readFile(new URL("../artifacts/system1-pinned-scan-worker-reviewonly.mjs",import.meta.url),"utf8");
assert.notEqual(original,generated);
assert.ok(!original.includes("S1_P0_PINNED_SCAN_REQUEST_REVIEW_CANDIDATE"));
assert.match(generated,/pinnedMarketDateSupported:true/);
assert.match(generated,/const businessTime=await resolvePinnedScanRequestAuthority/);
assert.match(generated,/runAfterMarketScan\(env,businessTime/);
const match=generated.match(/\/\/ BEGIN S1_P0_PINNED_SCAN_REQUEST_REVIEW_CANDIDATE([\s\S]+?)\/\/ END S1_P0_PINNED_SCAN_REQUEST_REVIEW_CANDIDATE/);
assert.ok(match);
let holiday=false,calendarCalls=0,yearSeen=null;
const box={
 Date,Number,String,Error,
 taiwanDate(ms){return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(ms));},
 taiwanClock(ms){const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Taipei",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(ms));return {hour:Number(parts.find(x=>x.type==="hour").value),minute:Number(parts.find(x=>x.type==="minute").value)};},
 shiftDateString(s,shift){const d=new Date(s+"T12:00:00Z");d.setUTCDate(d.getUTCDate()+shift);return d.toISOString().slice(0,10);},
 async loadTradingCalendar(_env,year){calendarCalls++;yearSeen=year;},
 isTradingDate(){return !holiday}
};
vm.runInNewContext(match[1]+"\nthis.resolvePinnedScanRequestAuthority=resolvePinnedScanRequestAuthority;",box);
const decide=box.resolvePinnedScanRequestAuthority;
const same=Date.parse("2026-10-13T15:45:00Z");
const next=Date.parse("2026-10-13T20:49:34Z");
assert.equal(await decide({}, {marketDate:"2026-10-13",onlyIfMissing:true},same),same);
await assert.rejects(decide({}, {marketDate:"2026-10-13",onlyIfMissing:false},same),/PINNED_SCAN_DATE_NOT_AUTHORIZED_FOR_CLOCK/);
await assert.rejects(decide({}, {marketDate:"2026-10-13",onlyIfMissing:true,scheduledFallback:true},next),/PRIOR_DAY_REPLAY_OWNER_GATE_NOT_ENABLED/);
const approvedFixture={S1_PINNED_PRIOR_DAY_RECOVERY_ENABLED:"true",
 STOCKS_KV:{async get(){return null;}}};
assert.equal(await decide(approvedFixture, {marketDate:"2026-10-13",onlyIfMissing:true,scheduledFallback:true},next),same);
const ambiguousFixture={S1_PINNED_PRIOR_DAY_RECOVERY_ENABLED:"true",
 STOCKS_KV:{async get(){return {status:"FAILED",requestedDate:"2026-10-14"};}}};
await assert.rejects(decide(ambiguousFixture,{marketDate:"2026-10-13",onlyIfMissing:true,scheduledFallback:true},next),/AMBIGUOUS_PRIOR_BUSINESS_POST_NO_REPLAY/);
const originalSameDateFailure={S1_PINNED_PRIOR_DAY_RECOVERY_ENABLED:"true",
 STOCKS_KV:{async get(){return {status:"FAILED",requestedDate:"2026-10-13"};}}};
await assert.rejects(decide(originalSameDateFailure,{marketDate:"2026-10-13",onlyIfMissing:true,scheduledFallback:true},next),/AMBIGUOUS_PRIOR_BUSINESS_POST_NO_REPLAY/);
assert.equal(yearSeen,2026);
assert.equal(calendarCalls,2);
await assert.rejects(decide({}, {marketDate:"2026-10-13",onlyIfMissing:true},next),/PINNED_SCAN_DATE_NOT_AUTHORIZED_FOR_CLOCK/);
await assert.rejects(decide({}, {marketDate:"2026-10-13",scheduledFallback:true},next),/PINNED_SCAN_DATE_NOT_AUTHORIZED_FOR_CLOCK/);
await assert.rejects(decide({}, {marketDate:"2026-10-12",onlyIfMissing:true,scheduledFallback:true},next),/PINNED_SCAN_DATE_NOT_AUTHORIZED_FOR_CLOCK/);
await assert.rejects(decide({}, {marketDate:"2026-10-13",onlyIfMissing:true,scheduledFallback:true},Date.parse("2026-10-13T23:01:00Z")),/PINNED_SCAN_DATE_NOT_AUTHORIZED_FOR_CLOCK/);
await assert.rejects(decide({}, {marketDate:"2026-10-13"},Date.parse("2026-10-13T07:20:00Z")),/PINNED_SCAN_DATE_NOT_AUTHORIZED_FOR_CLOCK/);
await assert.rejects(decide({}, {marketDate:"2026-02-30"},same),/PINNED_SCAN_DATE_INVALID/);
holiday=true;
await assert.rejects(decide({}, {marketDate:"2026-10-13",onlyIfMissing:true},same),/PINNED_SCAN_DATE_NOT_OFFICIAL_TRADING_SESSION/);
assert.equal(await decide({}, {},next),next,"No-body legacy interface intentionally untouched");

assert.match(generated,/status:"FORMAL_COMMIT_STARTED"/);
assert.match(generated,/AMBIGUOUS_FORMAL_COMMIT_REPLAY_FORBIDDEN/);
assert.match(generated,/await options\.onBeforeFormalMutation\(marketDate\)/);
assert.ok(generated.indexOf('await options.onBeforeFormalMutation(marketDate)') <
          generated.indexOf('await env.STOCKS_KV.put(MARKET_STATE_KEY'));
assert.ok(!original.includes('status:"FORMAL_COMMIT_STARTED"'));
// Execute extracted ACTUAL proposed lease wrapper: a stored pre-write marker
// must reject another business attempt, while a fully pre-commit failed
// attempt can be retried without overriding a saved Formal plan.
const afterMarketSource=generated.slice(
  generated.indexOf("async function runAfterMarketScan(env,"),
  generated.indexOf("async function runAfterMarketScanCore(")
);
assert.ok(afterMarketSource.startsWith("async function runAfterMarketScan("));
let coreCalls=0,markWrites=[],leaseReleases=0,staged={status:"FORMAL_COMMIT_STARTED",commitAt:"2026-10-14T10:10:00Z"};
const leaseCtx={
 Date,JSON,Number,String,Error,LAST_SCAN_KEY:"V7_LAST_SCAN",
 taiwanDate(){return "2026-10-14";},
 async acquireSignalStateLease(){return {token:"fixture-lease",snapshot:staged};},
 async loadTradingCalendar(){},
 isTradingDate(){return true;},
 mostRecentWeekday(){return "2026-10-14";},
 isTestMode(){return false;},
 async persistSignalStateLease(_e,_k,_t,x){markWrites.push(x);},
 async releaseSignalLease(){leaseReleases++;},
 async runAfterMarketScanCore(_e,_t,o){
   coreCalls++;
   assert.equal(typeof o.onBeforeFormalMutation,"function");
   await o.onBeforeFormalMutation("2026-10-14");
   return {scanDate:"2026-10-14",selectedCount:0,generatedAt:"2026-10-14T23:45:00+08:00"};
 },
 async sendPush(){throw Error("NO_PUSH_EXPECTED")}
};
vm.runInNewContext(afterMarketSource+"\nthis.tryFormal=runAfterMarketScan;",leaseCtx);
const env={
 V7_DB:{},STOCKS_KV:{
   async get(key){return key==="V7_LAST_SCAN_ATTEMPT"?null:null;},
   async put(){return true;}
 }
};
const stop=await leaseCtx.tryFormal(env,Date.parse("2026-10-14T15:45:00Z"),{onlyIfMissing:true});
assert.equal(stop.skipped,true);
assert.equal(stop.reason,"AMBIGUOUS_FORMAL_COMMIT_REPLAY_FORBIDDEN");
assert.equal(coreCalls,0);
assert.equal(markWrites.length,0);
assert.equal(leaseReleases,1);
staged={status:"PRECHECK_FAILED",scanDate:"2026-10-14"};
const recovered=await leaseCtx.tryFormal(env,Date.parse("2026-10-14T15:45:00Z"),{onlyIfMissing:true});
assert.equal(recovered.scanDate,"2026-10-14");
assert.equal(coreCalls,1);
assert.equal(markWrites[0].status,"FORMAL_COMMIT_STARTED");
assert.equal(markWrites[0].scanDate,"2026-10-14");
assert.equal(markWrites[1].status,"SUCCESS");
assert.equal(leaseReleases,2);

assert.ok(generated.includes("const LIVE_STALE_SECONDS = 90;"));
assert.match(original,/runAfterMarketScan\(env, Date\.now\(\),\{onlyIfMissing:body\.onlyIfMissing===true\}\)/);
console.log(JSON.stringify({ok:true,positiveCases:2,failClosedNegativeCases:7,
 originalWorkerPreserved:true,candidateOnly:true,
 sameDateAndOneDayRollbackBounded:true,c1SelectionChanged:false,
 productionDeployment:false,noBusinessPOST:true,noWorkerWrite:true}));
