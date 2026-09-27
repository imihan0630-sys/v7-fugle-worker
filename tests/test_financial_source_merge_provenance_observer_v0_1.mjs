import assert from "node:assert/strict";
import {
  inspectFormalMergedFinancialFields,
  compareCanonicalSourceToFormalMerged
} from "../research/financial_source_merge_provenance_observer_v0_1.mjs";

const fin={quarterRevenue:100,financialBasis:"MOPS",revenueQoQ:5,revenueQuarterYoY:12};
const val={valuationObserved:true,priceBookRatio:2,priceEarningsRatio:18};
const merged={...fin,...val,announcementsVerified:true};

assert.equal(inspectFormalMergedFinancialFields(merged).complete,true);

{
  const x=compareCanonicalSourceToFormalMerged({
    row:merged,
    financialEntry:fin,
    valuationEntry:val,
    announcementsSourcesVerified:true
  });
  assert.equal(x.alignment,"ALIGNED_COMPLETE");
}

{
  const x=compareCanonicalSourceToFormalMerged({
    row:merged,
    financialEntry:null,
    valuationEntry:null,
    announcementsSourcesVerified:true
  });
  assert.equal(x.sourceComplete,false);
  assert.equal(x.mergedFormalFieldComplete,true);
  assert.equal(x.alignment,"FORMAL_FIELD_PASS_WITH_CANONICAL_SOURCE_GAP");
}

{
  const x=compareCanonicalSourceToFormalMerged({
    row:{...merged,revenueQoQ:null},
    financialEntry:fin,
    valuationEntry:val,
    announcementsSourcesVerified:true
  });
  assert.equal(x.alignment,"INVARIANT_VIOLATION_SOURCE_COMPLETE_FIELD_FAIL");
}

{
  const x=compareCanonicalSourceToFormalMerged({
    row:{announcementsVerified:true},
    financialEntry:null,
    valuationEntry:null,
    announcementsSourcesVerified:true
  });
  assert.equal(x.alignment,"BOTH_INCOMPLETE");
}

console.log(JSON.stringify({
  ok:true,
  sourceVsMergedDualState:true,
  formalFieldPassWithCanonicalSourceGapRepresentable:true,
  outcomesUsed:false,
  formalCoreImpact:false
},null,2));
