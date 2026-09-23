import assert from "node:assert/strict";
import { diagnoseBroadControlConcentration } from "./broad_control_concentration.mjs";

const rows = [
  {scan_date:"2026-09-21",symbol:"1111",cohort:"BROAD_CONTROL",pool:"GENERAL",snapshot:{sector:{name:"電子"}}},
  {scan_date:"2026-09-21",symbol:"2222",cohort:"BROAD_CONTROL",pool:"THOUSAND",snapshot_json:JSON.stringify({sector:{name:"電子"}})},
  {scan_date:"2026-09-21",symbol:"3333",cohort:"BROAD_CONTROL",pool:"GENERAL",snapshot:{sector:{name:null}}},
  {scan_date:"2026-09-22",symbol:"1111",cohort:"BROAD_CONTROL",pool:"GENERAL",snapshot:{sector:{name:"金融"}}},
  {scan_date:"2026-09-22",symbol:"4444",cohort:"BROAD_CONTROL",pool:"GENERAL",snapshot_json:"{bad"},
  {scan_date:"2026-09-22",symbol:"9999",cohort:"SELECTED",pool:"GENERAL",snapshot:{sector:{name:"電子"}}}
];
const x = diagnoseBroadControlConcentration(rows);
assert.equal(x.totalRows, 5);
assert.equal(x.independentScanDates, 2);
assert.equal(x.distinctSymbolsAcrossDates, 4);
assert.deepEqual(x.repeatedSymbolsAcrossDates, [{symbol:"1111",appearances:2}]);
assert.equal(x.maxAppearances, 2);
assert.equal(x.eligibleDenominator, "UNKNOWN");
assert.equal(x.venueCoverage, "UNKNOWN");
assert.equal(x.perDate[0].effectiveControls, 3);
assert.equal(x.perDate[0].industryKnown, 2);
assert.equal(x.perDate[0].industryUnknown, 1);
assert.equal(x.perDate[0].largestIndustryShareOfKnown, 1);
assert.equal(x.perDate[1].industryKnown, 1);
assert.equal(x.perDate[1].industryUnknown, 1);
assert.equal(x.perDate[1].venueCoverage, "UNKNOWN");
console.log("PASS broad_control_concentration fixtures");
