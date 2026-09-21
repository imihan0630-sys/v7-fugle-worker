import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const exported="\nexport {researchShadowOutcomeForRow,researchPairedSelectionAlpha,researchExecutionAlphaFromRows,researchRegimePersistenceFromDays,buildShadowResearchDiagnostics};";
const mod=await import("data:text/javascript;base64,"+Buffer.from(source+exported).toString("base64")+"#"+Date.now());

assert.match(source,/const VERSION = "8\\.(?:[7-9]|[1-9]\\d+)\\.\\d+[^"]*";/);
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
