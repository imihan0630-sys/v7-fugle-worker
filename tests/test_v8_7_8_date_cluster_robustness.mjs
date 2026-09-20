import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const exported="\nexport {RESEARCH_INCREMENTAL_CONTRASTS,researchDateClusterRobustness,researchApplyClusterRobustnessToMaturity};";
const mod=await import("data:text/javascript;base64,"+Buffer.from(source+exported).toString("base64")+"#"+Date.now());

for(const marker of [
  "8.7.8-date-cluster-robustness",
  "LEAVE_ONE_SCAN_DATE_OUT_PARTIAL_CORRELATION",
  "FRAGILE_DATE_DEPENDENCE",
  "clusterRobustness",
  "clusterFragilityCount"
]) assert.ok(source.includes(marker),marker);

const outcomes=[];
for(let d=0;d<20;d++) {
  for(let j=0;j<5;j++) {
    const x=j-2;
    const dateShock=d===7?3.5:0;
    outcomes.push({
      scanDate:"2026-02-"+String(1+d).padStart(2,"0"),
      cohort:j===0?"SELECTED":"BROAD_CONTROL",
      horizons:{d5:{returnPct:0.55*x+0.12*(j%2)+dateShock*x}},
      snapshot:{
        price:{residualSectorRs20:x+0.08*d,persistenceScoreResearch:0.15*x+0.03*d,volatility20:4+0.1*j},
        setup:{breakoutQualityResearch:40+x*3,overheatPenaltyResearch:10+x,compressionScoreResearch:60-x},
        volume:{volumeTodayVsPrev5:1+0.1*j},
        institution:{score:50+x}
      }
    });
  }
}

const diag=mod.researchDateClusterRobustness(outcomes);
assert.equal(diag.researchOnly,true);
assert.equal(diag.decisionImpact,false);
assert.equal(diag.formalCoreImpact,false);
assert.equal(diag.clusteringUnit,"scanDate");
assert.equal(diag.trackedDefinitions,7);
assert.equal(diag.contrasts.length,7);
assert.ok(diag.contrasts.every(x=>x.independentScanDates>=15));
assert.ok(diag.contrasts.some(x=>x.leaveOneDateRuns>=10));
assert.ok(diag.contrasts.filter(x=>x.leaveOneDateRuns>=10).every(x=>x.status!=="ACCUMULATING"));
assert.ok(diag.contrasts.every(x=>x.formalCoreImpact===false));

const base={eligibleForFormalReview:true,blockers:[],evidence:{fullProspectiveSnapshots:100},policy:"base"};
const adjusted=mod.researchApplyClusterRobustnessToMaturity(base,{
  fragileContrastIds:["I01"],robustContrastIds:["I02"]
});
assert.equal(adjusted.eligibleForFormalReview,false);
assert.equal(adjusted.evidence.clusterFragilityCount,1);
assert.ok(adjusted.blockers.some(x=>x.includes("I01")));

console.log(JSON.stringify({ok:true,scanDateClustered:true,leaveOneDateOut:true,formalCoreImpact:false,governanceGateOnly:true}));
