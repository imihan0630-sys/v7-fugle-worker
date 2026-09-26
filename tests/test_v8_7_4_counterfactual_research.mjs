import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  classifyExecutionPlanState,
  buildExecutionAlphaAccounting,
  buildExecutionAlphaComponents,
  compareExecutionPolicyToBenchmark,
  classifyExecutionBenchmarkEligibility,
  decomposeBuyImplementationShortfall,
  inferTaiwanLotType
} from "../research/execution_alpha_coverage_v0_1.mjs";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const exported="\nexport {researchShadowOutcomeForRow,researchPairedSelectionAlpha,researchExecutionAlphaFromRows,researchRegimePersistenceFromDays,buildShadowResearchDiagnostics};";
const mod=await import("data:text/javascript;base64,"+Buffer.from(source+exported).toString("base64")+"#"+Date.now());

assert.match(source,/const VERSION = "8\.\d+\.\d+[^"]*";/);
for(const marker of [
  "breakoutReferencePriceResearch",
  "SAME_SCAN_DATE_PAIRED_COHORT_DELTA",
  "FAILED_CLOSE_WITHIN_3D",
  "WITHIN_SCAN_DATE_MEDIAN_SPLIT",
  "Execution Alpha",
  "Counterfactual／Selection Alpha",
  "formalScoreImpact:false"
]) assert.ok(source.includes(marker),marker);

function snap(close=100,ref=99,residual=5,attention=1.2){
  return {price:{close,breakoutReferencePriceResearch:ref,residualSectorRs20:residual},volume:{volumeTodayVsPrev5:attention}};
}
function bars(closes,lows=null,opens=null){
  return closes.map((close,i)=>({
    date:"2026-09-"+String(21+i).padStart(2,"0"),
    open:opens?.[i]??close-0.5,high:close+1,low:lows?.[i]??close-1,close
  }));
}

const held=mod.researchShadowOutcomeForRow(
  {scan_date:"2026-09-20",symbol:"1101",name:"A",cohort:"SELECTED",snapshot:snap(100,99,7,0.8)},
  bars([102,103,104,105,106],[100,100,100,101,102],[101,102,103,104,105])
);
assert.equal(held.breakout.status,"HELD_3D");
assert.equal(held.horizons.d5.returnPct,6);
assert.equal(held.firstDay.overnightPct,1);
assert.ok(Math.abs(held.firstDay.intradayPct-0.99)<0.02);

const failed=mod.researchShadowOutcomeForRow(
  {scan_date:"2026-09-20",symbol:"1201",name:"B",cohort:"BROAD_CONTROL",snapshot:snap(100,99,2,1.8)},
  bars([98,99,100,101,102],[97,98,99,100,101],[100,98,99,100,101])
);
assert.equal(failed.breakout.status,"FAILED_CLOSE_WITHIN_3D");
assert.equal(failed.breakout.closeFailDate,"2026-09-21");

const outcomes=[
  {scanDate:"2026-09-01",cohort:"SELECTED",horizons:{d1:{returnPct:2},d3:{returnPct:4},d5:{returnPct:10},d10:{returnPct:12},d20:{returnPct:15}}},
  {scanDate:"2026-09-01",cohort:"BROAD_CONTROL",horizons:{d1:{returnPct:1},d3:{returnPct:2},d5:{returnPct:5},d10:{returnPct:6},d20:{returnPct:7}}},
  {scanDate:"2026-09-02",cohort:"SELECTED",horizons:{d1:{returnPct:1},d3:{returnPct:2},d5:{returnPct:2},d10:{returnPct:3},d20:{returnPct:4}}},
  {scanDate:"2026-09-02",cohort:"BROAD_CONTROL",horizons:{d1:{returnPct:2},d3:{returnPct:3},d5:{returnPct:4},d10:{returnPct:5},d20:{returnPct:6}}}
];
const alpha=mod.researchPairedSelectionAlpha(outcomes);
assert.equal(alpha.byComparator.BROAD_CONTROL.d5.pairedDates,2);
assert.equal(alpha.byComparator.BROAD_CONTROL.d5.avg,1.5);
assert.equal(alpha.byComparator.BROAD_CONTROL.d5.interpretation,"ACCUMULATING");

const execution=mod.researchExecutionAlphaFromRows(
  [
    {scan_date:"2026-09-01",symbol:"1101",formal_close:100,buy_low:96,buy_high:100},
    {scan_date:"2026-09-02",symbol:"1201",formal_close:200,buy_low:198,buy_high:202},
    {scan_date:"2026-09-03",symbol:"1301",formal_close:50,buy_low:48,buy_high:50}
  ],
  [
    {plan_scan_date:"2026-09-01",symbol:"1101",signal_type:"BUY",market_price:98,occurred_at:"2026-09-02T01:10:00Z"},
    {plan_scan_date:"2026-09-02",symbol:"1201",signal_type:"BUY",market_price:202,occurred_at:"2026-09-03T01:15:00Z"}
  ]
);
assert.equal(execution.selectedPlans,3);
assert.equal(execution.buyTriggeredPlans,2);
assert.equal(execution.entryTimingPct.avg,0.5);
assert.equal(execution.decisionImpact,false);

const regime=mod.researchRegimePersistenceFromDays([
  {scanDate:"2026-09-01",market:{regime:"BULL_BROAD",topSectors:[{industry:"AI"},{industry:"PCB"},{industry:"ABF"},{industry:"光學"},{industry:"金融"}]}},
  {scanDate:"2026-09-02",market:{regime:"BULL_BROAD",topSectors:[{industry:"AI"},{industry:"PCB"},{industry:"ABF"},{industry:"散熱"},{industry:"金融"}]}},
  {scanDate:"2026-09-03",market:{regime:"MIXED",topSectors:[{industry:"AI"},{industry:"散熱"},{industry:"PCB"},{industry:"機器人"},{industry:"金融"}]}},
  {scanDate:"2026-09-04",market:{regime:"UNKNOWN",topSectors:[]}}
]);
assert.equal(regime.usableDays,3);
assert.equal(regime.transitions["BULL_BROAD->BULL_BROAD"],1);
assert.equal(regime.transitions["BULL_BROAD->MIXED"],1);
assert.equal(regime.longestTop5Streak[0].days,3);

const diagnostics=mod.buildShadowResearchDiagnostics([held,failed]);
assert.equal(diagnostics.breakout.held3D,1);
assert.equal(diagnostics.breakout.failedClose3D,1);
assert.equal(diagnostics.intradayVsOvernight.n,2);

// Coverage-aware Execution Alpha: missing recorder/monitor evidence is UNKNOWN, never NO_BUY.
{
  assert.equal(classifyExecutionPlanState({
    mature:true,sourceFresh:true,recorderComplete:true,monitorComplete:true,
    signalPersistenceKnown:true,buyObserved:true
  }),"BUY_OBSERVED_COMPLETE_COVERAGE");
  assert.equal(classifyExecutionPlanState({
    mature:true,sourceFresh:true,recorderComplete:false,monitorComplete:true,
    signalPersistenceKnown:true,buyObserved:false
  }),"UNKNOWN_RECORDER_INCOMPLETE");

  const plans=[
    {state:"BUY_OBSERVED_COMPLETE_COVERAGE",benchmarkPrice:100,firstBuyPrice:98,postEntryD5Return:0.04,idleSessions:0},
    {state:"NO_BUY_OBSERVED_COMPLETE_COVERAGE",benchmarkD5Return:0.08,benchmarkMfe:0.12,benchmarkMae:-0.02,idleSessions:5},
    {state:"NO_BUY_OBSERVED_COMPLETE_COVERAGE",benchmarkD5Return:-0.06,benchmarkMfe:0.01,benchmarkMae:-0.09,idleSessions:5},
    {state:"UNKNOWN_RECORDER_INCOMPLETE",idleSessions:null},
    {state:"NOT_YET_MATURE",idleSessions:null}
  ];
  const a=buildExecutionAlphaAccounting(plans);
  assert.equal(a.selectedPlans,5);
  assert.equal(a.completeCoveragePlans,3);
  assert.equal(a.buyObservedPlans,1);
  assert.equal(a.noBuyObservedPlans,2);
  assert.equal(a.unknownPlans,1);
  assert.equal(a.notYetMaturePlans,1);
  assert.ok(Math.abs(a.buyTriggerRateCompleteCoverageOnly-1/3)<1e-12);

  const components=buildExecutionAlphaComponents(plans);
  assert.ok(Math.abs(components.conditionalBuyEntry.meanEntryPriceImprovement-0.02)<1e-12);
  // One missed winner and one avoided loser coexist; NO_BUY has no one-sign interpretation.
  assert.ok(Math.abs(components.completeNoBuyOpportunityCost.meanBenchmarkD5Return-0.01)<1e-12);

  const policy=compareExecutionPolicyToBenchmark(plans);
  assert.equal(policy.status,"DESCRIPTIVE_ONLY");
  assert.equal(policy.unconditionalExecutionAlpha,null);
  assert.equal(policy.decisionImpact,false);
}

console.log(JSON.stringify({
  ok:true,
  version:"8.7.4-counterfactual-research",
  shadowOutcomes:true,
  pairedSelectionAlpha:true,
  executionAlpha:true,
  breakoutHoldFail:true,
  intradayOvernight:true,
  regimePersistence:true,
  formalCoreImpact:false
}));


// Execution benchmark must match Taiwan lot mechanism; selection close remains reference-only.
{
  assert.equal(inferTaiwanLotType(180),"ODD_LOT");
  assert.equal(inferTaiwanLotType(2000),"REGULAR_LOT");
  assert.equal(inferTaiwanLotType(1200),"MIXED_LOT");
  assert.equal(inferTaiwanLotType(null),"UNKNOWN");
  const selectionRef=classifyExecutionBenchmarkEligibility({
    benchmarkType:"SELECTION_CLOSE_REFERENCE",lotType:"ODD_LOT",benchmarkPrice:100
  });
  assert.equal(selectionRef.status,"REFERENCE_ONLY");
  assert.equal(selectionRef.eligible,false);

  const oddAtRegularOpen=classifyExecutionBenchmarkEligibility({
    benchmarkType:"NEXT_SESSION_REGULAR_OPEN",lotType:"ODD_LOT",benchmarkPrice:101
  });
  assert.equal(oddAtRegularOpen.status,"MECHANISM_MISMATCH");
  assert.equal(oddAtRegularOpen.eligible,false);

  const mixed=classifyExecutionBenchmarkEligibility({
    benchmarkType:"FIRST_ELIGIBLE_OBSERVED_QUOTE",lotType:"MIXED_LOT",benchmarkPrice:101,
    observedAt:"2026-09-30T09:10:05+08:00",quoteFresh:true,marketMechanism:"ODD_LOT_INTRADAY"
  });
  assert.equal(mixed.reason,"MIXED_LOT_REQUIRES_SEPARATE_REGULAR_AND_ODD_LOT_LEGS");

  const oddQuote=classifyExecutionBenchmarkEligibility({
    benchmarkType:"FIRST_ELIGIBLE_OBSERVED_QUOTE",
    lotType:"ODD_LOT",benchmarkPrice:101.2,observedAt:"2026-09-30T09:10:05+08:00",
    quoteFresh:true,marketMechanism:"ODD_LOT_INTRADAY"
  });
  assert.equal(oddQuote.status,"ELIGIBLE");
  assert.equal(oddQuote.eligible,true);

  const stale=classifyExecutionBenchmarkEligibility({
    benchmarkType:"FIRST_ELIGIBLE_OBSERVED_QUOTE",
    lotType:"REGULAR_LOT",benchmarkPrice:101,observedAt:"2026-09-30T09:01:00+08:00",
    quoteFresh:false,marketMechanism:"REGULAR_CONTINUOUS"
  });
  assert.equal(stale.reason,"QUOTE_FRESHNESS_UNPROVEN");
}

// Implementation shortfall keeps unfilled shares in the intended denominator.
{
  const x=decomposeBuyImplementationShortfall({
    intendedShares:1000,decisionPrice:100,horizonPrice:110,
    fills:[{shares:600,price:101}],explicitCostNTD:100,coverageComplete:true
  });
  assert.equal(x.status,"VALID");
  assert.equal(x.filledShares,600);
  assert.equal(x.unfilledShares,400);
  assert.ok(Math.abs(x.executionPriceCostNTD-600)<1e-12);
  assert.ok(Math.abs(x.missedOpportunityCostNTD-4000)<1e-12);
  assert.ok(Math.abs(x.totalShortfallNTD-4700)<1e-12);
  assert.ok(Math.abs(x.totalShortfallBps-470)<1e-12);

  // Avoiding a loser creates negative opportunity cost; NO-BUY/non-fill is not one-sign bad.
  const avoided=decomposeBuyImplementationShortfall({
    intendedShares:1000,decisionPrice:100,horizonPrice:90,
    fills:[],explicitCostNTD:0,coverageComplete:true
  });
  assert.equal(avoided.status,"VALID");
  assert.ok(avoided.missedOpportunityCostNTD<0);
  assert.ok(avoided.totalShortfallBps<0);

  const blocked=decomposeBuyImplementationShortfall({
    intendedShares:1000,decisionPrice:100,horizonPrice:110,
    fills:[],coverageComplete:false
  });
  assert.equal(blocked.status,"DATA_QUALITY_BLOCKED");
}
