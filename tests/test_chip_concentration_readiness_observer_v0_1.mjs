import assert from "node:assert/strict";
import {observeChipConcentrationReadiness,classifyTdccSnapshot,CHIP_REACH_STATE} from "../research/chip_concentration_readiness_observer_v0_1.mjs";

function snapshot({asOfDate="2026-09-18",count=1500,extra={}}={}){
  const stocks={};
  for(let i=0;i<count;i+=1){
    const symbol=String(1000+i).slice(-4).padStart(4,"1");
    stocks[symbol]={chipConcentration:50,chipAsOfDate:asOfDate};
  }
  Object.assign(stocks,extra);
  return {asOfDate,count:Object.keys(stocks).length,stocks};
}

// No snapshot is a scan-level data gap, not a normal per-symbol economic failure.
{
  const d=classifyTdccSnapshot({scanDate:"2026-09-21",tdccSnapshot:null});
  assert.equal(d.datasetState,"DATASET_MISSING");
  assert.equal(d.promotionQuality,"BLOCKED");
}

// A 14-day-old weekly snapshot can be formally fresh while PIT availability remains unproven.
{
  const s=snapshot({asOfDate:"2026-09-07"});
  const d=classifyTdccSnapshot({scanDate:"2026-09-21",tdccSnapshot:s});
  assert.equal(d.freshnessState,"WITHIN_FORMAL_14D_WINDOW");
  assert.equal(d.pitAvailabilityState,"FIRST_KNOWN_NOT_CAPTURED");
  assert.equal(d.promotionQuality,"BLOCKED");
}

// firstKnownAt after the decision cutoff is explicitly post-decision evidence.
{
  const s=snapshot();
  const d=classifyTdccSnapshot({
    scanDate:"2026-09-21",tdccSnapshot:s,
    decisionCutoffAt:"2026-09-21T10:10:00Z",
    firstKnownAt:"2026-09-21T12:00:00Z"
  });
  assert.equal(d.pitAvailabilityState,"POST_DECISION_CAPTURE");
  assert.equal(d.promotionQuality,"BLOCKED");
}

// Global >=1500 readiness does not imply symbol-level coverage.
{
  const s=snapshot();
  const rows=[{symbol:"9999",close:100},{symbol:"1000",close:1200},{symbol:"1001",close:50}];
  const reach={"9999":CHIP_REACH_STATE.REACHED,"1000":CHIP_REACH_STATE.REACHED,"1001":CHIP_REACH_STATE.NOT_REACHED};
  const o=observeChipConcentrationReadiness(rows,{scanDate:"2026-09-21",tdccSnapshot:s,preChipReachBySymbol:reach});
  assert.equal(o.dataset.globalCoverageState,"GLOBAL_MINIMUM_COVERAGE_PASS");
  assert.equal(o.counts.reached,2);
  assert.equal(o.counts.symbolAbsentAtReach,1);
  assert.equal(o.counts.coveredAtReach,1);
  assert.equal(o.counts.notReached,1);
  assert.equal(o.poolCounts.THOUSAND.reached,1);
}

// Numeric zero is observed concentration, not missing.
{
  const s=snapshot({extra:{"9998":{chipConcentration:0,chipAsOfDate:"2026-09-18"}}});
  const o=observeChipConcentrationReadiness([{symbol:"9998",close:80}],{
    scanDate:"2026-09-21",tdccSnapshot:s,preChipReachBySymbol:{"9998":"REACHED"}
  });
  assert.equal(o.counts.coveredAtReach,1);
  assert.equal(o.records[0].chipConcentration,0);
  assert.equal(o.records[0].formalMissingAction,"PASS_PRESENCE_GATE");
}

// Pre-gate rows must never inflate the chip formal-reach missing denominator.
{
  const s=snapshot();
  const o=observeChipConcentrationReadiness([{symbol:"9999",close:50}],{
    scanDate:"2026-09-21",tdccSnapshot:s,preChipReachBySymbol:{"9999":"NOT_REACHED"}
  });
  assert.equal(o.counts.reached,0);
  assert.equal(o.formalReachMissingRate,null);
  assert.equal(o.records[0].chipEvidenceState,"NOT_EVALUABLE_PRE_GATE");
}

// Proven first-known timestamp can make source availability eligible without changing Formal.
{
  const s=snapshot();
  const d=classifyTdccSnapshot({
    scanDate:"2026-09-21",tdccSnapshot:s,
    decisionCutoffAt:"2026-09-21T10:10:00Z",
    firstKnownAt:"2026-09-21T09:00:00Z"
  });
  assert.equal(d.pitAvailabilityState,"PIT_PROVEN_BY_FIRST_KNOWN_AT");
  assert.equal(d.promotionQuality,"PIT_ELIGIBLE");
}

console.log(JSON.stringify({ok:true,globalVsSymbolCoverageSeparated:true,pitAvailabilitySeparatedFromAsOf:true,formalCoreImpact:false},null,2));
