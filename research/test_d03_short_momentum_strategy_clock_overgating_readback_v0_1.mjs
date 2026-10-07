import fs from 'node:fs';
import assert from 'node:assert/strict';

const receipt=JSON.parse(fs.readFileSync(new URL('./d03_short_momentum_strategy_clock_overgating_readback_20261007_v0_1.json',import.meta.url),'utf8'));
const o=receipt.observed;

assert.equal(receipt.classification,'RESEARCH_ONLY_STRATEGY_CLOCK_SAMPLING_BIAS_FIREWALL');
assert.equal(receipt.formalCoreImpact,'NONE_LOCKED');
assert.deepEqual(o.shortMomentumFrozenRequiredFamilies,['TECHNICAL_STRUCTURE','PRICE_VOLUME','RISK_FRICTION']);
assert.equal(o.b2RequiredByShortMomentum,false);
assert.equal(o.a5RequiredByShortMomentum,false);
assert.equal(o.universalPitSessionSourceIntegrityStillRequired,true);
assert.equal(o.prospectiveRunA5Coverage,true);
assert.equal(o.prospectiveRunB2Coverage,false);
assert.equal(o.prospectiveRunGlobalRequiredReady,false);
assert.equal(o.globalRequiredSetEqualsShortMomentumRequiredSet,false);
assert.equal(o.correctedRuntimeExists,false);
assert.equal(o.genuineCorrectedMixedDependencyReceiptExists,false);
for(const key of ['selectionAuthority','finalSelectionEnabled','livePushEnabled','capitalImpact','orderImpact']) assert.equal(o[key],false,key);
for(const key of ['strategyEvaluableN','naturalZeroPickN','dataUnknownN','irrelevantSourceMissingButNonBlockingN']) assert.ok(receipt.requiredDenominators.includes(key),key);
assert.ok(receipt.requiredStateTaxonomy.includes('STRATEGY_IRRELEVANT_SOURCE_MISSING'));
assert.ok(receipt.requiredStateTaxonomy.includes('NATURAL_ZERO_PICK'));
assert.equal(receipt.d03Interpretation.oos,'UNKNOWN_CORRECTED_RUNTIME_NOT_AVAILABLE');
assert.equal(receipt.d03Interpretation.walkForward,'UNKNOWN_CORRECTED_RUNTIME_NOT_AVAILABLE');
assert.equal(receipt.maturityDecision.d03MaturityPct,56.7);
assert.equal(receipt.maturityDecision.d03_09,'L2_40');
assert.equal(receipt.maturityDecision.d03_10,'L2_40');
assert.equal(receipt.maturityDecision.formalOptimizationCandidate,'NONE');

console.log(JSON.stringify({status:'PASS',correction:receipt.source.correctionId,globalRequiredSetEqualsShortMomentumRequiredSet:o.globalRequiredSetEqualsShortMomentumRequiredSet,globalBlockedExample:o.prospectiveRunGlobalRequiredReady===false,correctedRuntimeExists:o.correctedRuntimeExists,maturityPct:receipt.maturityDecision.d03MaturityPct,formalCoreImpact:receipt.formalCoreImpact}));
