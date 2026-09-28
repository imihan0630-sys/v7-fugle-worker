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


const historicalPayload = {
  queryYear: 106,
  data: [
    ["106/01/02", "休市"],
    ["106/01/03", "開始交易日"],
    ["106/02/27", "休市"],
  ],
};
const historicalCalendar = parseTwseTradingCalendar(historicalPayload, 2017);
assert.equal(historicalCalendar.queryYearConvention, "ROC");
assert.deepEqual(historicalCalendar.holidays, ["2017-01-02", "2017-02-27"]);
assert.equal(isTradingDateWithCalendar("2017-01-02", historicalCalendar), false);
assert.equal(isTradingDateWithCalendar("2017-01-03", historicalCalendar), true);
