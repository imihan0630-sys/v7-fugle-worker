import assert from "node:assert/strict";
import {
  LEGACY_AFTER_MARKET_CRON,PRIMARY_AFTER_MARKET_CRON,COMBINED_AFTER_MARKET_CRON,
  ensureAfterMarketRecoverySchedule
} from "./update_cloudflare_after_market_recovery_cron.mjs";

const base=[
  {cron:"* 1-4 * * mon-fri"},
  {cron:"0-24 5 * * mon-fri"},
  {cron:"*/5 9 * * mon-fri"},
  {cron:PRIMARY_AFTER_MARKET_CRON}
];
const combined=ensureAfterMarketRecoverySchedule(base);
assert.equal(combined.changed,true);
assert.equal(combined.schedules.length,base.length,"must not consume another account Cron slot");
assert.equal(combined.schedules.filter(x=>x.cron===COMBINED_AFTER_MARKET_CRON).length,1);
assert.equal(combined.schedules.some(x=>x.cron===PRIMARY_AFTER_MARKET_CRON),false);
assert.deepEqual(combined.schedules.slice(0,3),base.slice(0,3),"all non-after-market System1 schedules must be preserved");

const idempotent=ensureAfterMarketRecoverySchedule(combined.schedules);
assert.equal(idempotent.changed,false);
assert.deepEqual(idempotent.schedules,combined.schedules);

assert.throws(()=>ensureAfterMarketRecoverySchedule([
  ...base,{cron:COMBINED_AFTER_MARKET_CRON}
]),/both exist/);
assert.throws(()=>ensureAfterMarketRecoverySchedule(base.filter(x=>x.cron!==PRIMARY_AFTER_MARKET_CRON)),/exactly one 23:35/);
assert.throws(()=>ensureAfterMarketRecoverySchedule([...base,{cron:LEGACY_AFTER_MARKET_CRON}]),/Legacy 18:10/);

console.log(JSON.stringify({
  ok:true,
  primaryBefore:PRIMARY_AFTER_MARKET_CRON,
  combinedAfter:COMBINED_AFTER_MARKET_CRON,
  triggerCountUnchanged:true,
  preservesExistingSchedules:true,
  idempotent:true,
  system2Touched:false
}));
