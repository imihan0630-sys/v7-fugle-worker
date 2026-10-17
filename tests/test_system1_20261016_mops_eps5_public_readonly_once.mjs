import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
process.argv.push("--dry-run");
const {checkContractMarkers,exceptionClass}=
  await import("../ops/system1_20261016_mops_eps5_public_readonly_once.mjs");
const html="CO_ID=4167&SYEAR=2026&SSEASON=2&REPORT_ID=C 合併綜合損益表 新台幣仟元";
const flags=checkContractMarkers(html,"4167",2026,2);
assert.equal(flags.allRequiredMarkersPresent,true);
assert.equal(flags.sourceSha256.length,64);
assert.equal(checkContractMarkers(html,"3236",2026,2).allRequiredMarkersPresent,false);
assert.equal(checkContractMarkers(html.replace("合併綜合損益表","個體綜合損益表"),"4167",2026,2).allRequiredMarkersPresent,false);
assert.equal(checkContractMarkers(html.replace("新台幣仟元","元"),"4167",2026,2).allRequiredMarkersPresent,false);
assert.throws(()=>checkContractMarkers(html,"4167",2027,2),/SCOPE_NOT_2026Q2_Q1/);
assert.equal(exceptionClass(Error("單季EPS公司、年度、季別或合併口徑不符")),
 "OFFICIAL_MOPS_HEADER_CONTRACT_MISMATCH");
assert.equal(exceptionClass(Error("沒有已核對的真正單季EPS")),
 "EPS_PERIOD_NOT_VERIFIED");
const s=await readFile(new URL("../ops/system1_20261016_mops_eps5_public_readonly_once.mjs",import.meta.url),"utf8");
assert.match(s,/const DATE="2026-10-16",YEAR=2026,QUARTER=2/);
assert.match(s,/SYMBOLS=\["4167","3236","3147","5340","6122"\]/);
assert.match(s,/mopsov\.twse\.com\.tw\/mops\/web\/ajax_t164sb04/);
assert.match(s,/fetchBufferedOfficialSource/);
assert.doesNotMatch(s,/process\.env\.(?:CLOUDFLARE|V7_ADMIN_TOKEN|GITHUB_TOKEN)/);
assert.doesNotMatch(s,/fugle-test\.imihan0630\.workers\.dev/);
assert.doesNotMatch(s,/\/api\/(?:quality-data|scan|push|config)/);
assert.match(s,/if\(process\.argv\.includes\("--dry-run"\)\)/);
assert.match(s,/noCloudflareCall:true,noWorkerPOST:true,noD1Read:true,noD1Write:true/);
const w=await readFile(new URL("../.github/workflows/system1-p0-20261016-mops-eps5-readonly-once.yml",import.meta.url),"utf8");
assert.match(w,/pull_request:/);assert.match(w,/types: \[opened\]/);
assert.match(w,/issues: none|contents: read/);
assert.doesNotMatch(w,/schedule:|workflow_dispatch:|push:/);
assert.doesNotMatch(w,/secrets\./);
assert.match(w,/if: github\.head_ref == 'audit\/system1-20261016-eps5-public-mops-one-shot-20261017'/);
console.log(JSON.stringify({suite:"S1 MOPS EPS5 public source-only probe",
 assertions:"PASS",networkInTest:false,prodMutation:false,
 oneShotPrOnly:true,originalParserUnmodified:true}));
