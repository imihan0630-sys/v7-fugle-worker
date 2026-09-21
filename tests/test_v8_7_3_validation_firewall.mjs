import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const mod=await import("data:text/javascript;base64,"+Buffer.from(
  source+"\nexport {factorStudyFromSnapshots,researchPromotionGate};"
).toString("base64")+"#"+Date.now());

assert.match(source,/const VERSION = "8\.\d+\.\d+[^"]*";/);
for(const marker of [
  "PURGED_FORWARD_HOLDOUT",
  "purgedBoundaryDates",
  "trackedFactorDefinitions",
  "D+N重疊標籤",
  "尚未使用purged forward holdout防止重疊標籤洩漏",
  "驗證防火牆"
]) assert.ok(source.includes(marker),marker);

const snapshots=[];
const paths=[];
for(let i=1;i<=10;i++){
  const scanDate="2026-01-"+String(i).padStart(2,"0");
  const symbol=String(2000+i);
  snapshots.push({
    scan_date:scanDate,symbol,market_regime:"BULL_BROAD",
    snapshot:{sourceCompleteness:"FULL_FORMAL_SCAN",market:{regime:"BULL_BROAD"},price:{residualSectorRs20:i}}
  });
  const endDay=i+4;
  const asOfDate="2026-01-"+String(endDay).padStart(2,"0");
  paths.push({scanDate,symbol,horizons:{d5:{returnPct:i-5,asOfDate}}});
}
const study=mod.factorStudyFromSnapshots(snapshots,paths,5);
assert.equal(study.validation.method,"PURGED_FORWARD_HOLDOUT");
assert.equal(study.validation.firstHoldoutDate,"2026-01-08");
assert.equal(study.validation.rawTrainDates,7);
assert.equal(study.validation.purgedTrainDates,3);
assert.deepEqual(study.validation.purgedBoundaryDates,["2026-01-04","2026-01-05","2026-01-06","2026-01-07"]);
assert.equal(study.validation.holdoutDates,3);
assert.equal(study.trainDates,3);
assert.equal(study.holdoutDates,3);
assert.ok(study.multipleTesting.trackedFactorDefinitions>=10);

const gate=mod.researchPromotionGate({
  sampleCount:100,fullMatureCount:60,distinctScanDates:40,distinctYears:2,regimes:["BULL_BROAD","MIXED"],
  trainDates:20,holdoutDates:10,validation:{method:"RANDOM_SPLIT"},
  factors:[{direction:"HIGH",train:{n:30,spreadPct:1},holdout:{n:20,spreadPct:1},key:"x",label:"x"}]
});
assert.equal(gate.promotionEligible,false);
assert.ok(gate.reasons.some(x=>x.includes("purged forward holdout")));

console.log(JSON.stringify({
  ok:true,
  version:"8.7.3-validation-firewall",
  validation:"PURGED_FORWARD_HOLDOUT",
  overlapLeakageGuard:true,
  multipleTestingTracked:true,
  formalCoreImpact:false
}));
