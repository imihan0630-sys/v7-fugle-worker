import assert from "node:assert/strict";
import {
  isTradingDateWithCalendar,
  parseTwseTradingCalendar,
  probeTwseTradingDate,
} from "../runtime/twse_trading_calendar_readonly.mjs";

const payload = {
  queryYear: 2026,
  data: [
    ["2026-09-25", "休市"],
    ["2026-09-28", "休市"],
    ["2026-02-12", "最後交易日"],
  ],
};
const calendar = parseTwseTradingCalendar(payload, 2026);
assert.deepEqual(calendar.holidays, ["2026-09-25", "2026-09-28"]);
assert.equal(isTradingDateWithCalendar("2026-09-28", calendar), false);
assert.equal(isTradingDateWithCalendar("2026-09-29", calendar), true);
assert.equal(isTradingDateWithCalendar("2026-09-27", calendar), false);

const fetchImpl = async (_url, options) => {
  assert.equal(options.method, "GET");
  return {
    ok: true,
    status: 200,
    async json() { return payload; },
  };
};
const probe = await probeTwseTradingDate({
  marketDate: "2026-09-29",
  fetchImpl,
});
assert.equal(probe.state, "READY");
assert.equal(probe.expectedTradingDay, true);
assert.equal(probe.externalMutationPerformed, false);

console.log("System2 TWSE trading calendar tests passed");
