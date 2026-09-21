import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const exported="\nexport {researchReadinessEvidenceFromOutcomes,researchEvidenceReadinessMatrix};";
const mod=await import("data:text/javascript;base64,"+Buffer.from(source+exported).toString("base64")+"#"+Date.now());

assert.match(source,/const VERSION = "8\.\d+\.\d+[^"]*";/);

for(const marker of [
  "Research Evidence Readiness",
  "DATA_QUALITY_BLOCKED",
  "DESCRIPTIVE_READY",
  "researchReadinessEvidenceFromOutcomes"
]) assert.ok(source.includes(marker),marker);

const outcomes=[];
for(let d=0;d<20;d++) {
  const date="2026-10-"+String(1+d).padStart(2,"0");
  const residual=[-2,-1,1,2];
  const volume=[0.8,1.2,0.7,1.3];
  for(let j=0;j<4;j++) {
    outcomes.push({
      scanDate:date,
      cohort:(j===0||j===2)?"SELECTED":"BROAD_CONTROL",
      horizons:{
        d1:{returnPct:j+0.1,mfePct:j+0.8,maePct:-0.5},
        d5:{returnPct:j+0.5,mfePct:j+1.5,maePct:-1},
        d10:{returnPct:j+1,mfePct:j+2,maePct:-1.5},
        d20:{returnPct:j+1.5,mfePct:j+2.5,maePct:-2}
      },
      firstDay:{overnightPct:0.1*j,intradayPct:0.2*j},
      breakout:{status:j%2===0?"HELD_3D":"FAILED_CLOSE_WITHIN_3D"},
      snapshot:{
        market:{regime:d<10?"RISK_ON":"RANGE"},
        price:{residualSectorRs20:residual[j]},
        volume:{volumeTodayVsPrev5:volume[j]}
      }
    });
  }
}
const base=mod.researchReadinessEvidenceFromOutcomes(outcomes);
assert.equal(base.d5Samples,80);
assert.equal(base.d5IndependentScanDates,20);
assert.equal(base.experiments.R01.held3D,40);
assert.equal(base.experiments.R01.failedClose3D,40);
assert.equal(base.experiments.R02.selectionPairedD5Dates,20);
assert.equal(base.experiments.R04.matureD5Samples,80);
assert.equal(base.experiments.R05.matureD1TimingSamples,80);
assert.equal(base.experiments.R07.matureD5Samples,80);
assert.equal(base.experiments.R08.pairedD5Dates,20);

const matrix=mod.researchEvidenceReadinessMatrix(
  base,
  {},
  {selectedPlans:40,buyTriggeredPlans:12},
  {
    usableDays:20,
    transitions:{"RISK_ON->RISK_ON":8,"RISK_ON->RANGE":1,"RANGE->RANGE":10},
    top5SectorRetentionPct:{avg:62.5}
  },
  {total:80,dates:20},
  {status:"HEALTHY"}
);
assert.equal(matrix.researchOnly,true);
assert.equal(matrix.decisionImpact,false);
assert.equal(matrix.formalCoreImpact,false);
assert.equal(matrix.experiments.length,8);
assert.equal(matrix.descriptiveReady,8);
assert.equal(matrix.status,"ALL_DESCRIPTIVE_READY");
assert.ok(matrix.experiments.every(x=>x.status==="DESCRIPTIVE_READY"));

const empty=mod.researchEvidenceReadinessMatrix(
  mod.researchReadinessEvidenceFromOutcomes([]),
  {},{selectedPlans:0,buyTriggeredPlans:0},{usableDays:0,transitions:{}},{total:0,dates:0},
  {status:"WAITING_FIRST_POST_DEPLOY_SCAN"}
);
assert.equal(empty.status,"ACCUMULATING");
assert.equal(empty.descriptiveReady,0);
assert.ok(empty.waitingData>=6);

const blocked=mod.researchEvidenceReadinessMatrix(
  base,{}, {selectedPlans:40,buyTriggeredPlans:12},
  {usableDays:20,transitions:{"RISK_ON->RANGE":1}},
  {total:80,dates:20},
  {status:"RESEARCH_DATA_GAP"}
);
assert.equal(blocked.status,"DATA_QUALITY_BLOCKED");
assert.equal(blocked.dataQualityBlocked,8);
assert.ok(blocked.experiments.every(x=>x.formalCoreImpact===false));

console.log(JSON.stringify({
  ok:true,
  experiments:8,
  allDescriptiveReadySynthetic:true,
  dataQualityBlock:true,
  thresholdsReused:true,
  formalCoreImpact:false
}));
