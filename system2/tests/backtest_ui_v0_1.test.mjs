import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(
  new URL("../ui/backtest_v0_1.html", import.meta.url),
  "utf8",
);

assert.match(html, /System 2｜區間條件回測 V0\.1/);
assert.match(html, /BULK_EXECUTION_BACKEND_NOT_CONNECTED/);
assert.match(html, /FULL_REPLAY/);
assert.match(html, /SHORT_MOMENTUM/);
assert.match(html, /coreMetrics\.relativeVolume20Prior/);
assert.match(html, /禁止使用未來\/outcome欄位/);
assert.match(html, /S2_BACKTEST_CONDITION_QUERY_V0_1/);
assert.doesNotMatch(html, /fugle-test\.imihan0630\.workers\.dev/);
assert.doesNotMatch(html, /SYSTEM2_CAPTURE_ENABLED\s*=\s*true/);

console.log("System2 XQ-style backtest UI v0.1 static guard passed");
