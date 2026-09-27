import assert from "node:assert/strict";
import {
  REACH_STATE,
  classifyFinancialSourceBundle,
  inspectCanonicalFinancialEntry,
  inspectCanonicalValuationEntry,
  observeFinancialSourceCompleteness
} from "../research/financial_source_completeness_readiness_observer_v0_1.mjs";

const financialGood={
  quarterRevenue:100,
  financialBasis:"MOPS-derived quarter basis",
  revenueQoQ:5,
  revenueQuarterYoY:12
};
const valuationGood={valuationObserved:true,priceBookRatio:2,priceEarningsRatio:18};
const financialSnapshot={asOfDate:"2026-09-25",count:1500,year:2026,quarter:2,stocks:{"1000":financialGood,"1001":financialGood}};
const valuationSnapshot={asOfDate:"2026-09-25",count:1500,stocks:{"1000":valuationGood,"1002":valuationGood}};
const announcementsSnapshot={asOfDate:"2026-09-25",count:0,stocks:{},sourcesVerified:true};

// Current producer shapes collapse four financial checks into one valid entry bundle.
{
  const x=inspectCanonicalFinancialEntry(financialGood);
  assert.equal(x.complete,true);
  assert.equal(x.canonicalProducerInvariantViolation,false);
  const bad=inspectCanonicalFinancialEntry({...financialGood,revenueQoQ:null});
  assert.equal(bad.present,true);
  assert.equal(bad.complete,false);
  assert.equal(bad.canonicalProducerInvariantViolation,true);
}

// Current valuation producer couples valuationObserved and numeric PB.
{
  assert.equal(inspectCanonicalValuationEntry(valuationGood).complete,true);
  const bad=inspectCanonicalValuationEntry({valuationObserved:true,priceBookRatio:null});
  assert.equal(bad.canonicalProducerInvariantViolation,true);
}

// Missing whole snapshot is scan-level unavailable, not a normal per-symbol source reject.
{
  const b=classifyFinancialSourceBundle({financialSnapshot:null,valuationSnapshot,announcementsSnapshot});
  assert.equal(b.scanLevelReady,false);
  assert.equal(b.canonicalScanBehavior,"SCAN_ABORT_DATA_INCOMPLETE");
  const o=observeFinancialSourceCompleteness([{symbol:"1000",close:50}],{
    financialSnapshot:null,valuationSnapshot,announcementsSnapshot,
    preGateReachBySymbol:{"1000":REACH_STATE.REACHED}
  });
  assert.equal(o.counts.scanLevelUnavailableAtReach,1);
}

// Same globally-ready snapshots can cover different same-day symbols.
{
  const rows=[{symbol:"1000",close:1200},{symbol:"1001",close:50},{symbol:"1002",close:50}];
  const reach=Object.fromEntries(rows.map(r=>[r.symbol,REACH_STATE.REACHED]));
  const o=observeFinancialSourceCompleteness(rows,{
    financialSnapshot,valuationSnapshot,announcementsSnapshot,preGateReachBySymbol:reach
  });
  assert.equal(o.counts.reached,3);
  assert.equal(o.counts.completeAtReach,1);
  assert.equal(o.counts.financialSymbolAbsentAtReach,1); // 1002
  assert.equal(o.counts.valuationSymbolAbsentAtReach,1); // 1001
  assert.equal(o.counts.announcementSourceUnverifiedAtReach,0);
  assert.equal(o.poolCounts.THOUSAND.reached,1);
}

// Verified announcement source is global; no per-symbol event array is still verified empty-set semantics.
{
  const o=observeFinancialSourceCompleteness([{symbol:"1000",close:50}],{
    financialSnapshot,valuationSnapshot,announcementsSnapshot,
    preGateReachBySymbol:{"1000":"REACHED"}
  });
  assert.equal(o.records[0].announcement.sourcesVerified,true);
  assert.equal(o.records[0].announcement.perSymbolArrayPresent,false);
  assert.equal(o.records[0].announcement.eventCount,0);
  assert.equal(o.records[0].formalBundledChecks.announcementsVerified,true);
}

// Pre-gate non-reached rows never enter the financial completeness denominator.
{
  const o=observeFinancialSourceCompleteness([{symbol:"1000",close:50}],{
    financialSnapshot,valuationSnapshot,announcementsSnapshot,
    preGateReachBySymbol:{"1000":"NOT_REACHED"}
  });
  assert.equal(o.counts.reached,0);
  assert.equal(o.formalReachIncompleteRate,null);
}

// Artificial partial producer rows are invariant violations, not legitimate independent sub-dimensions.
{
  const f={...financialSnapshot,stocks:{"1000":{...financialGood,revenueQuarterYoY:null}}};
  const o=observeFinancialSourceCompleteness([{symbol:"1000",close:50}],{
    financialSnapshot:f,valuationSnapshot,announcementsSnapshot,
    preGateReachBySymbol:{"1000":"REACHED"}
  });
  assert.equal(o.counts.financialProducerInvariantViolationAtReach,1);
  assert.equal(o.records[0].pattern,"F_INVALID|V_OK|A_GLOBAL_OK");
}

console.log(JSON.stringify({
  ok:true,
  financialFourChecksCollapsed:true,
  valuationTwoChecksCollapsed:true,
  announcementVerificationGlobal:true,
  preGateDenominatorProtected:true,
  formalCoreImpact:false
},null,2));
