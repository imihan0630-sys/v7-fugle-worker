import assert from "node:assert/strict";
import {
  LEGACY_AFTER_MARKET_CRON,PRIMARY_AFTER_MARKET_CRON,RECOVERY_AFTER_MARKET_CRON,
  ensureAfterMarketRecoverySchedule
} from "./update_cloudflare_after_market_recovery_cron.mjs";

const base=[
  {cron:"* 1-4 * * mon-fri"},
  {cron:"0-24 5 * * mon-fri"},
  {cron:"*/5 9 * * mon-fri"},
  {cron:PRIMARY_AFTER_MARKET_CRON}
];
const added=ensureAfterMarketRecoverySchedule(base);
assert.equal(added.changed,true);
assert.equal(added.schedules.length,5);
assert.equal(added.schedules.filter(x=>x.cron===RECOVERY_AFTER_MARKET_CRON).length,1);
assert.deepEqual(added.schedules.slice(0,4),base);

const idempotent=ensureAfterMarketRecoverySchedule(added.schedules);
assert.equal(idempotent.changed,false);
assert.deepEqual(idempotent.schedules,added.schedules);

assert.throws(()=>ensureAfterMarketRecoverySchedule([
  ...base,{cron:RECOVERY_AFTER_MARKET_CRON},{cron:RECOVERY_AFTER_MARKET_CRON}
]),/Duplicate 23:55/);
assert.throws(()=>ensureAfterMarketRecoverySchedule(base.filter(x=>x.cron!==PRIMARY_AFTER_MARKET_CRON)),/exactly one 23:35/);
assert.throws(()=>ensureAfterMarketRecoverySchedule([...base,{cron:LEGACY_AFTER_MARKET_CRON}]),/Legacy 18:10/);

console.log(JSON.stringify({
  ok:true,
  primary:PRIMARY_AFTER_MARKET_CRON,
  recovery:RECOVERY_AFTER_MARKET_CRON,
  preservesExistingSchedules:true,
  idempotent:true,
  system2Touched:false
}));
