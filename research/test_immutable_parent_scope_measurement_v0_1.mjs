import assert from "node:assert/strict";
import { TECHNICAL_PARENT_SCOPE_ID, measureImmutableParentScope } from "./immutable_parent_scope_measurement_v0_1.mjs";

const normalized=[
  {symbol:"1101",market:"TWSE",close:50},
  {symbol:"2330",market:"TWSE",close:1200},
  {symbol:"3105",market:"TPEX",close:80},
  {symbol:"8299",market:"TPEX",close:1500},
];

const feature=[
  {symbol:"1101",market:"TWSE",close:50},
  {symbol:"2330",market:"TWSE",close:1200},
  {symbol:"3105",market:"TPEX",close:80},
];

const ok=measureImmutableParentScope(normalized,feature);
assert.equal(ok.parentScopeId,TECHNICAL_PARENT_SCOPE_ID);
assert.equal(ok.status,"VALID");
assert.equal(ok.normalizedTodayCount,4);
assert.equal(ok.parentCount,3);
assert.equal(ok.preParentNotInFeatureCount,1);
assert.equal(ok.parentCoverageRatio,0.75);
assert.deepEqual(ok.marketCounts,{TWSE:2,TPEX:1,UNKNOWN:0});
assert.deepEqual(ok.poolCounts,{GENERAL:2,THOUSAND:1,UNKNOWN:0});
assert.deepEqual(ok.normalizedNotInFeatureSymbols,["8299"]);

const dupParent=measureImmutableParentScope(normalized,[...feature,feature[0]]);
assert.equal(dupParent.status,"SCOPE_QA_FAIL");
assert.ok(dupParent.qaFailures.includes("DUPLICATE_PARENT_SYMBOL"));

const dupNormalized=measureImmutableParentScope([...normalized,normalized[0]],feature);
assert.equal(dupNormalized.status,"SCOPE_QA_FAIL");
assert.ok(dupNormalized.qaFailures.includes("DUPLICATE_NORMALIZED_SYMBOL"));

const outside=measureImmutableParentScope(normalized,[...feature,{symbol:"9999",market:"TWSE",close:20}]);
assert.equal(outside.status,"SCOPE_QA_FAIL");
assert.deepEqual(outside.parentOutsideNormalizedSymbols,["9999"]);

const empty=measureImmutableParentScope([],[]);
assert.equal(empty.status,"VALID");
assert.equal(empty.parentCoverageRatio,null);

console.log(JSON.stringify({ok:true,scope:"PARENT_SCOPE_MEASUREMENT_PASS"}));
