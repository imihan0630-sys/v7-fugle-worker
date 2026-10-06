import assert from "node:assert/strict";
import vm from "node:vm";
import {mkdtemp,readFile,writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";
import {
  splitAfterMarketRecoverySchedule,
  PRIMARY_AFTER_MARKET_CRON,
  RECOVERY_AFTER_MARKET_CRON,
  COMBINED_AFTER_MARKET_CRON
} from "./update_cloudflare_after_market_split_recovery_candidate.mjs";

const productionInventory=[
  "0-24 5 * * MON-FRI",
  "* 1-4 * * MON-FRI",
  "35,55 15 * * mon-fri",
  "* 9 * * MON-FRI"
];
const split=splitAfterMarketRecoverySchedule(productionInventory);
assert.equal(split.changed,true);
assert.equal(split.schedules.length,5);
const crons=split.schedules.map(x=>String(x.cron).toLowerCase());
assert.equal(crons.filter(x=>x===PRIMARY_AFTER_MARKET_CRON).length,1);
assert.equal(crons.filter(x=>x===RECOVERY_AFTER_MARKET_CRON).length,1);
assert.equal(crons.includes(COMBINED_AFTER_MARKET_CRON),false);
for(const cron of ["0-24 5 * * mon-fri","* 1-4 * * mon-fri","* 9 * * mon-fri"]) assert.ok(crons.includes(cron));

const already=splitAfterMarketRecoverySchedule(split.schedules);
assert.equal(already.changed,false);
assert.deepEqual(already.schedules,split.schedules);

assert.throws(()=>splitAfterMarketRecoverySchedule([
  ...productionInventory,
  "55 15 * * mon-fri"
]),/coexist/i);

assert.throws(()=>splitAfterMarketRecoverySchedule([
  "0-24 5 * * MON-FRI",
  "* 1-4 * * MON-FRI",
  "35,55 15 * * mon-fri",
  "* 9 * * MON-FRI",
  "7 8 * * mon-fri"
]),/five-trigger ceiling/i);

const fixture=`
const VERSION = "8.20.0-formal-c1-binding-ledger";
function isAfterMarketSchedule(controller) {
  const cron=String(controller?.cron || "").trim().toLowerCase().replace(/\\s+/g," ");
  return cron === "35 15 * * mon-fri" || cron === "35,55 15 * * mon-fri";
}
async function runScheduledWithAudit(controller, env) {
  const scheduledTime = Number(controller?.scheduledTime || Date.now());
  const cronExpression = String(controller?.cron || "");
  const isAfterMarket = isAfterMarketSchedule(controller);
  const isHistoryWarmup = isHistoryWarmupSchedule(controller);
  const jobType = isHistoryWarmup ? "HISTORY_WARMUP" : (isAfterMarket ? "AFTER_MARKET_SCAN" : "INTRADAY_MONITOR");
  return {scheduledTime,cronExpression,isAfterMarket,isHistoryWarmup,jobType};
}
`;

const dir=await mkdtemp(join(tmpdir(),"pve253-"));
await writeFile(join(dir,"Worker.js"),fixture,"utf8");
const patch=fileURLToPath(new URL("../scripts/apply_v8_20_1_pve253_split_recovery_candidate.py",import.meta.url));
const py=spawnSync("python3",[patch],{cwd:dir,encoding:"utf8"});
assert.equal(py.status,0,py.stderr||py.stdout);
const patched=await readFile(join(dir,"Worker.js"),"utf8");
assert.ok(patched.includes('const VERSION = "8.20.1-pve253-split-recovery-candidate";'));
assert.ok(patched.includes('afterMarketRole==="RECOVERY" ? "AFTER_MARKET_RECOVERY" : "AFTER_MARKET_SCAN"'));
assert.ok(patched.includes('if(cron === "55 15 * * mon-fri") return "RECOVERY";'));
assert.ok(patched.includes('if(cron === "35 15 * * mon-fri") return "PRIMARY";'));
assert.ok(patched.includes('if(cron === "35,55 15 * * mon-fri") return "COMBINED";'));

const start=patched.indexOf("function afterMarketScheduleRole");
const end=patched.indexOf("async function runScheduledWithAudit",start);
assert.ok(start>=0&&end>start);
const sandbox={};
vm.runInNewContext(patched.slice(start,end)+"\nglobalThis.__role=afterMarketScheduleRole;globalThis.__is=isAfterMarketSchedule;",sandbox);
assert.equal(sandbox.__role({cron:"35 15 * * MON-FRI"}),"PRIMARY");
assert.equal(sandbox.__role({cron:"55 15 * * mon-fri"}),"RECOVERY");
assert.equal(sandbox.__role({cron:"35,55 15 * * mon-fri"}),"COMBINED");
assert.equal(sandbox.__is({cron:"* 1-4 * * MON-FRI"}),false);

console.log(JSON.stringify({
  ok:true,
  tests:12,
  currentInventoryCount:productionInventory.length,
  splitInventoryCount:split.schedules.length,
  freeTierConservativeCeiling:5,
  explicitPrimary:true,
  explicitRecovery:true,
  combinedBackwardCompatibility:true,
  productionMutationAuthorized:false,
  formalCoreImpact:"NONE"
}));
