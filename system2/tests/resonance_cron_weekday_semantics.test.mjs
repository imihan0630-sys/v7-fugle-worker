import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { classifyResonanceScheduleTimeV0_1 } from "../runtime/daily_resonance_integration_v0_1.mjs";

const config = await readFile(
  new URL("../deploy/wrangler.system2.example.toml", import.meta.url),
  "utf8",
);
const deploy = await readFile(
  new URL("../../.github/workflows/system2-resonance-deploy.yml", import.meta.url),
  "utf8",
);
const audit = await readFile(
  new URL("../../.github/workflows/system2-worker-state-audit.yml", import.meta.url),
  "utf8",
);

const expected = "*/5 0-5,11 * * MON-FRI";
for (const [name, source] of [["config", config], ["deploy", deploy], ["audit", audit]]) {
  assert.equal(source.includes(expected), true, name + " must lock the explicit MON-FRI cron");
  assert.doesNotMatch(
    source,
    /\*\/5 0-5,11 \* \* 1-5/,
    name + " must not use numeric 1-5 because Cloudflare maps 1=SUN ... 7=SAT",
  );
}

// 2026-10-02 was Friday: the intended 19:00 Taipei refresh must be admitted.
const friday1900 = classifyResonanceScheduleTimeV0_1("2026-10-02T11:00:00.000Z");
assert.equal(friday1900.weekdaySession, true);
assert.equal(friday1900.afterMarketPoolRefresh, true);

// Sunday must remain rejected by the runtime even if an envelope were ever misconfigured.
const sunday1900 = classifyResonanceScheduleTimeV0_1("2026-10-04T11:00:00.000Z");
assert.equal(sunday1900.weekdaySession, false);
assert.equal(sunday1900.afterMarketPoolRefresh, false);

console.log("System2 Cloudflare weekday semantics guard tests passed");
