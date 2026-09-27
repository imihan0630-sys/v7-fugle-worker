import assert from "node:assert/strict";
import {
  observeFundamentalComponents,
  inspectCanonicalQuarterlyFinancialEntry
} from "../research/fundamental_component_count_observer_v0_1.mjs";

// Current canonical quarterly producer supplies six countable slots by itself.
{
  const canonical={
    revenueQoQ:12,
    eps:3,
    grossMargin:40,
    operatingMargin:18,
    grossMarginYoY:2,
    operatingMarginYoY:1
  };
  const c=inspectCanonicalQuarterlyFinancialEntry(canonical);
  assert.equal(c.allSixObserved,true);
  assert.equal(c.observedCount,6);
  const o=observeFundamentalComponents(canonical);
  assert.equal(o.count,6);
  assert.equal(o.countGatePass,true);
}

// A partial alternate merged row can pass the earlier source-completeness field bundle
// while still failing the >=3 fundamental component gate.
{
  const partial={
    quarterRevenue:100,
    financialBasis:"alternate",
    revenueQoQ:10,
    revenueQuarterYoY:20,
    valuationObserved:true,
    priceBookRatio:2,
    announcementsVerified:true
  };
  const o=observeFundamentalComponents(partial);
  assert.equal(o.count,1);
  assert.equal(o.countGatePass,false);
  assert.equal(o.scoreGatePass,null);
}

// Nullish alias is semantic: invalid non-null MoM prevents a valid QoQ fallback.
{
  const f={
    revenueMoM:"N/A",
    revenueQoQ:50,
    eps:2,
    grossMargin:30
  };
  const o=observeFundamentalComponents(f);
  assert.equal(o.revenueMomentumAliasState,"INVALID_NON_NULL_MOM_SHADOWS_VALID_QOQ");
  assert.equal(o.count,2);
  assert.equal(o.countGatePass,false);
}
{
  const f={
    revenueMoM:null,
    revenueQoQ:50,
    eps:2,
    grossMargin:30
  };
  const o=observeFundamentalComponents(f);
  assert.equal(o.revenueMomentumAliasState,"QOQ_FALLBACK_USED");
  assert.equal(o.count,3);
  assert.equal(o.countGatePass,true);
}

console.log(JSON.stringify({
  ok:true,
  canonicalQuarterlyCountFloor:6,
  partialAlternateCompletenessCounterexample:true,
  nullishAliasShadowCounterexample:true,
  formalCoreImpact:false
},null,2));
