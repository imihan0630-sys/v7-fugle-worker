import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow=await readFile(".github/workflows/system2-historical-pack-2017-backfill.yml","utf8");
const script=await readFile("system2/scripts/historical_pack_year_backfill_v0_1.mjs","utf8");
const verifier=await readFile("system2/scripts/historical_market_year_verify_v0_1.mjs","utf8");

assert.match(workflow,/name:\s+System2 Historical Pack Annual Backfill/);
assert.match(workflow,/year:\s*\n\s+description:/);
for(const year of ["2017","2018","2019","2020","2021","2022","2023","2024","2025"]){
  assert.ok(workflow.includes(`- "${year}"`),`workflow year option missing: ${year}`);
}
assert.ok(!workflow.includes('- "2026"'),"current year must not use completed-year annual workflow");
assert.ok(!workflow.includes('SYSTEM2_HISTORY_YEAR: "2017"'),"workflow must not hard-code 2017");
assert.equal((workflow.match(/SYSTEM2_HISTORY_YEAR: \$\{\{ inputs\.year \}\}/g)||[]).length,3);
assert.match(workflow,/Persist bounded 2021 TPEx PIT revision lineage/);
assert.match(workflow,/inputs\.year == '2021' && inputs\.market == 'TPEX'/);
assert.match(workflow,/historical_tpex_2021_revision_overlay_v0_1\.mjs/);
assert.ok(workflow.includes("system2-historical-coverage-${{ inputs.market }}-${{ inputs.year }}"));

assert.match(script,/latestCompletedCalendarYear=taipeiCalendarYear-1/);
assert.match(script,/annual cold-pack workflow accepts completed calendar years only/);
assert.match(script,/S2-HIST-PACK-YEAR\|\$\{market\}\|\$\{year\}/);
assert.ok(!verifier.includes("no suspension for 2017."),"TPEx suspension limitation must not hard-code 2017");
assert.ok(verifier.includes("no suspension for ${year}."),"TPEx suspension limitation must bind the selected year");

console.log("historical annual workflow semantics tests passed");
