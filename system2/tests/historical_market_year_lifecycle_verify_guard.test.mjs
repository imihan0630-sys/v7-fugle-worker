import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const script=await readFile("system2/scripts/historical_market_year_verify_v0_1.mjs","utf8");
assert.match(script,/fetchTwseRegulatoryLifecycleForSymbolsV0_1/);
assert.match(script,/coverageBeforeLifecycle/);
assert.match(script,/unknownSymbols/);
assert.match(script,/TWSE_OFFICIAL_ANNOUNCEMENT_LIST_DETAIL/);
assert.match(script,/reclassifiedUnknownBars/);
assert.match(script,/beforeMissingReasonCounts/);
assert.match(script,/afterMissingReasonCounts/);
assert.match(script,/absenceCertifiesNoEvent:false/);
assert.match(script,/HISTORICAL_MARKET_YEAR_PHYSICAL_VERIFY_V0_6/);
assert.ok(
  script.indexOf("coverageBeforeLifecycle") < script.indexOf("fetchTwseRegulatoryLifecycleForSymbolsV0_1({"),
  "baseline coverage must be computed before targeted lifecycle-source lookup",
);
assert.ok(
  script.includes("filter((x)=>Number(x.unknownCount)>0)"),
  "TWSE announcement lookup must be limited to unresolved UNKNOWN symbols",
);
console.log("System2 historical market-year lifecycle verifier guard passed");
