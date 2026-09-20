import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const exported="\nexport {RESEARCH_INCREMENTAL_CONTRASTS,researchIncrementalFactorDiagnostics};";
const mod=await import("data:text/javascript;base64,"+Buffer.from(source+exported).toString("base64")+"#"+Date.now());

for(const marker of [
  "8.7.7-incremental-factor-diagnostics",
  "WITHIN_SCAN_DATE_DEMEANED_PARTIAL_CORRELATION",
  "trackedIncrementalDefinitions",
  "totalTrackedVariants",
  "I07"
]) assert.ok(source.includes(marker),marker);

assert.equal(mod.RESEARCH_INCREMENTAL_CONTRASTS.length,7);
const outcomes=[];
for(let d=0;d<20;d++) {
  for(let j=0;j<5;j++) {
    const base=d*0.1+j;
    outcomes.push({
      scanDate:"2026-01-"+String(1+d).padStart(2,"0"),
      cohort:j===0?"SELECTED":"BROAD_CONTROL",
      horizons:{d5:{returnPct:0.4*base+((j%2)?0.3:-0.2)}},
      snapshot:{
        price:{residualSectorRs20:base+0.2*j,persistenceScoreResearch:base*0.8+0.1*j,volatility20:4+0.2*j},
        setup:{breakoutQualityResearch:40+base*2,overheatPenaltyResearch:10+base,compressionScoreResearch:60-base},
        volume:{volumeTodayVsPrev5:0.8+0.05*j+base/100},
        institution:{score:50+base}
      }
    });
  }
}
const diag=mod.researchIncrementalFactorDiagnostics(outcomes);
assert.equal(diag.researchOnly,true);
assert.equal(diag.decisionImpact,false);
assert.equal(diag.formalCoreImpact,false);
assert.equal(diag.trackedDefinitions,7);
assert.equal(diag.trackedVariants,7);
assert.equal(diag.contrasts.length,7);
assert.ok(diag.contrasts.every(x=>x.samples>=60));
assert.ok(diag.contrasts.every(x=>x.distinctScanDates>=15));
assert.ok(diag.contrasts.every(x=>x.status!=="ACCUMULATING"));
assert.ok(diag.contrasts.every(x=>x.decisionImpact===false));

console.log(JSON.stringify({ok:true,contrasts:7,withinDateDemean:true,partialCorrelation:true,multipleTestingTracked:true,formalCoreImpact:false}));
