import assert from "node:assert/strict";
import { readFile, rm } from "node:fs/promises";
import { runTradingDayReadOnlyCheck } from "../scripts/check_twse_trading_day_readonly.mjs";

const output = "system2/artifacts/test-trading-day-output.txt";
const result = await runTradingDayReadOnlyCheck({
  marketDate: "2026-09-29",
  outputFile: output,
  probe: async ({ marketDate }) => ({
    marketDate,
    state: "READY",
    expectedTradingDay: true,
    source: "TWSE_OFFICIAL_HOLIDAY_SCHEDULE",
    externalMutationPerformed: false,
  }),
});
assert.equal(result.expectedTradingDay, true);
const content = await readFile(output, "utf8");
assert.match(content, /market_date=2026-09-29/);
assert.match(content, /expected_trading_day=true/);
await rm(output, { force: true });

await assert.rejects(
  () => runTradingDayReadOnlyCheck({
    marketDate: "2026-09-29",
    probe: async ({ marketDate }) => ({
      marketDate,
      state: "SOURCE_ERROR",
      expectedTradingDay: null,
    }),
  }),
  /gate unavailable/,
);

console.log("System2 trading-day check script tests passed");
