import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const exported="\nexport {researchFactorRedundancy,researchCostStress,researchGovernanceMaturity};";
const mod=await import("data:text/javascript;base64,"+Buffer.from(source+exported).toString("base64")+"#"+Date.now());

assert.match(source,/const VERSION = "8\\.(?:[7-9]|[1-9]\\d+)\\.\\d+[^"]*";/);

for(const marker of [
  "PAIRWISE_PEARSON_FULL_FORMAL_SCAN",
  "roundTripBps",
  "eligibleForFormalReview",
  "防過度擬合診斷"
]) assert.ok(source.includes(marker),marker);

const snapshots=[];
for(let i=0;i<35;i++) snapshots.push({
  scan_date:(i<20?"2026":"2027")+"-01-"+String(1+(i%20)).padStart(2,"0"),
  market_regime:i%2?"BULL_BROAD":"MIXED",
  snapshot:{sourceCompleteness:"FULL_FORMAL_SCAN",market:{regime:i%2?"BULL_BROAD":"MIXED"},sector:{name:i%3?"AI":"PCB"},
    price:{residualSectorRs20:i,positiveDayRatio20:i*2,maxDrawdown20Pct:-i,atrPercent:2+i/100,volatility20:3+i/100},
    volume:{volumeTodayVsPrev5:1+i/100},setup:{compressionScoreResearch:i,breakoutQualityResearch:i,overheatPenaltyResearch:100-i},
    institution:{score:i},fundamental:{score:i}}
});
const redundancy=mod.researchFactorRedundancy(snapshots);
assert.equal(redundancy.researchOnly,true);
assert.equal(redundancy.decisionImpact,false);
assert.ok(redundancy.highRedundancyCount>=1);

const outcomes=[];
for(let i=0;i<35;i++) outcomes.push({cohort:"SELECTED",horizons:{d5:{returnPct:i%2?2:-0.5}}});
const cost=mod.researchCostStress(outcomes);
assert.equal(cost.selectedD5Samples,35);
assert.equal(cost.scenarios.length,3);
assert.equal(cost.status,"DESCRIPTIVE_READY");

const study={sampleCount:80,fullMatureCount:80,reconstructedMatureCount:0,distinctScanDates:20,distinctYears:2,regimes:["BULL_BROAD","MIXED"],trainDates:12,holdoutDates:6,
  validation:{method:"PURGED_FORWARD_HOLDOUT"},
  factors:[{key:"x",label:"x",direction:"HIGH",train:{n:40,spreadPct:1},holdout:{n:20,spreadPct:0.5}}]};
const maturity=mod.researchGovernanceMaturity(
  snapshots,study,{coverage:{d5:80}}, {usableDays:20},{status:"HEALTHY"},
  {...redundancy,status:"NO_HIGH_REDUNDANCY_DETECTED"},cost
);
assert.equal(maturity.researchOnly,true);
assert.equal(maturity.formalCoreImpact,false);
assert.equal(maturity.eligibleForFormalReview,true);

const locked=mod.researchGovernanceMaturity([],{}, {coverage:{d5:0}}, {usableDays:0},{status:"RESEARCH_DATA_GAP"},
  {status:"ACCUMULATING"},{selectedD5Samples:0,status:"ACCUMULATING"});
assert.equal(locked.eligibleForFormalReview,false);
assert.ok(locked.blockers.length>=5);

console.log(JSON.stringify({ok:true,redundancy:true,costStress:true,maturityGate:true,formalCoreImpact:false}));
