import assert from "node:assert/strict";
import {
  observeAtrQualityFromHistory,
  compareAtrToCloseFallback
} from "../research/atr_quality_source_observer_v0_1.mjs";

function bars(n=65){
  return Array.from({length:n},(_,i)=>({
    date:`2026-01-${String(i+1).padStart(2,"0")}`,
    close:100,high:101,low:99
  }));
}

// Clean 20-bar range => ATR%=2 and passes current 1..10 gate.
{
  const o=observeAtrQualityFromHistory(bars());
  assert.equal(o.deployed.finiteRangeCount,20);
  assert.equal(o.sourceQuality.fullyObservedRangeCount,20);
  assert.equal(o.deployed.atrPercent,2);
  assert.equal(o.deployed.pass,true);
}

// Canonical source normalization can map missing H/L to null.
// Current deployed TR arithmetic then zero-coerces null and can create a ~price-sized range.
{
  const h=bars();
  h.at(-1).high=null; h.at(-1).low=null;
  h.at(-2).high=null; h.at(-2).low=null;
  const o=observeAtrQualityFromHistory(h);
  assert.equal(o.sourceQuality.highNullCount,2);
  assert.equal(o.sourceQuality.lowNullCount,2);
  assert.equal(o.deployed.finiteRangeCount,20);
  assert.equal(o.deployed.atrPercent,11.8);
  assert.equal(o.deployed.upperFail,true);
  const cf=compareAtrToCloseFallback(h);
  assert.ok(Math.abs(cf.atrPercent-1.8)<1e-12);
  assert.equal(cf.pass,true);
}

// Undefined/non-numeric representation behaves differently: NaN ranges are dropped by average(),
// silently reducing the effective ATR denominator rather than creating the null-zero coercion spike.
{
  const h=bars();
  delete h.at(-1).high; delete h.at(-1).low;
  delete h.at(-2).high; delete h.at(-2).low;
  const o=observeAtrQualityFromHistory(h);
  assert.equal(o.deployed.finiteRangeCount,18);
  assert.equal(o.deployed.atrPercent,2);
  assert.equal(o.sourceQuality.completeObserved20,false);
}

// Flat observed ranges produce atr20=0 -> atrPercent=null in buildMarketFeatures,
// then Formal (atrPercent||0)<1 rejects. Decision FAIL != evidence observed-zero ambiguity.
{
  const h=Array.from({length:65},(_,i)=>({date:String(i),close:100,high:100,low:100}));
  const o=observeAtrQualityFromHistory(h);
  assert.equal(o.deployed.atr20,0);
  assert.equal(o.deployed.atrPercent,null);
  assert.equal(o.deployed.formalCoercedAtrPercent,0);
  assert.equal(o.deployed.lowerFail,true);
}

console.log(JSON.stringify({
  ok:true,
  nullCoercionUpperRejectCounterexample:true,
  nonfiniteDenominatorShrinkCounterexample:true,
  flatAtrNullFormalFail:true,
  formalCoreImpact:false
},null,2));
