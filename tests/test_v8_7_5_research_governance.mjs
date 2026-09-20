import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const exported="\nexport {RESEARCH_EXPERIMENT_CATALOG,researchExperimentLedger,researchShadowIntegrityFromRows};";
const mod=await import("data:text/javascript;base64,"+Buffer.from(source+exported).toString("base64")+"#"+Date.now());

assert.match(source,/const VERSION = "8\.7\.\d+[^"]*";/);

for(const marker of [
  "SHADOW_ARCHIVE_ENFORCEMENT_DATE",
  "trackedExperimentDefinitions",
  "totalTrackedDefinitions",
  "WAITING_FIRST_POST_DEPLOY_SCAN",
  "RESEARCH_DATA_GAP",
  "Research 資料完整性"
]) assert.ok(source.includes(marker),marker);

assert.equal(mod.RESEARCH_EXPERIMENT_CATALOG.length,7);
assert.deepEqual(mod.RESEARCH_EXPERIMENT_CATALOG.map(x=>x.id),["R01","R02","R03","R04","R05","R06","R07"]);
assert.ok(mod.RESEARCH_EXPERIMENT_CATALOG.every(x=>x.version==="1.0" && x.status==="ACCUMULATING"));

const ledger=mod.researchExperimentLedger();
assert.equal(ledger.researchOnly,true);
assert.equal(ledger.decisionImpact,false);
assert.equal(ledger.trackedExperimentDefinitions,7);
assert.equal(ledger.trackedExperimentVariants,7);

const days=[
  {scan_date:"2026-09-20",selected_count:3},
  {scan_date:"2026-09-21",selected_count:2},
  {scan_date:"2026-09-22",selected_count:0},
  {scan_date:"2026-09-23",selected_count:1},
  {scan_date:"2026-09-24",selected_count:1}
];
const shadows=[
  {scan_date:"2026-09-21",cohort:"SELECTED",count:2},
  {scan_date:"2026-09-21",cohort:"BROAD_CONTROL",count:6},
  {scan_date:"2026-09-22",cohort:"BROAD_CONTROL",count:6},
  {scan_date:"2026-09-23",cohort:"NEAR_MISS",count:4}
];
const integrity=mod.researchShadowIntegrityFromRows(days,shadows);
assert.equal(integrity.expectedScanDays,4);
assert.equal(integrity.archivedScanDays,3);
assert.equal(integrity.status,"RESEARCH_DATA_GAP");
assert.deepEqual(integrity.missingArchiveDates,["2026-09-24"]);
assert.equal(integrity.selectedCoverageMismatches.length,2);
assert.deepEqual(integrity.noBroadControlDates,["2026-09-23","2026-09-24"]);
assert.equal(integrity.formalCoreImpact,false);

const healthy=mod.researchShadowIntegrityFromRows(
  [
    {scan_date:"2026-09-21",selected_count:1},
    {scan_date:"2026-09-22",selected_count:0}
  ],
  [
    {scan_date:"2026-09-21",cohort:"SELECTED",count:1},
    {scan_date:"2026-09-21",cohort:"BROAD_CONTROL",count:6},
    {scan_date:"2026-09-22",cohort:"BROAD_CONTROL",count:6}
  ]
);
assert.equal(healthy.status,"HEALTHY");
assert.equal(healthy.missingArchiveDates.length,0);
assert.equal(healthy.selectedCoverageMismatches.length,0);
assert.equal(healthy.noBroadControlDates.length,0);

const waiting=mod.researchShadowIntegrityFromRows([{scan_date:"2026-09-20",selected_count:2}],[]);
assert.equal(waiting.status,"WAITING_FIRST_POST_DEPLOY_SCAN");

console.log(JSON.stringify({
  ok:true,
  experiments:ledger.trackedExperimentDefinitions,
  variants:ledger.trackedExperimentVariants,
  shadowIntegrity:true,
  unknownPreserved:true,
  formalCoreImpact:false
}));
