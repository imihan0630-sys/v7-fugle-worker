import fs from 'node:fs';
import assert from 'node:assert/strict';

const receipt=JSON.parse(fs.readFileSync(new URL('./d03_system2_s207_technical_continuity_readback_20261007_v0_1.json',import.meta.url),'utf8'));
const o=receipt.observed;

assert.equal(receipt.classification,'RESEARCH_ONLY_INCREMENTAL_EXTERNAL_MACHINE_READBACK');
assert.equal(receipt.formalCoreImpact,'NONE_LOCKED');
assert.equal(o.symbol,'4806');
assert.equal(o.actionFamily,'CAPITAL_REDUCTION');
assert.equal(o.bridgeState,'BOUNDED_CONTINUITY_BRIDGE_READY_PIT_BLOCKED');
assert.equal(o.boundedTechnicalContinuityBridgeReady,true);
assert.equal(o.mechanicalResetNeutralizedForBoundaryResearch,true);
assert.equal(o.residualMoveSeparatedFromMechanicalReset,true);
assert.ok(Math.abs(o.officialPreActionClose*o.officialReferencePriceRatio-o.officialReferencePrice)<1e-12);
assert.equal(o.transformedPreSuspensionCloseInReferenceSpace,o.officialReferencePrice);
assert.equal(o.pitTechnicalContinuityReplayEligible,false);
assert.equal(o.pitReplayBlocker,'OFFICIAL_EVENT_KNOWLEDGE_CLOCK_HISTORICAL_UNKNOWN');
assert.equal(o.technicalContinuityScope,'EVENT_BOUNDARY_ONLY');
for(const key of ['technicalContinuityCertified','allHistoryContinuityCertified','continuityTransformPerformed','historyMutationPerformed','adjustedHistoryPersisted','selectionAuthority','finalSelectionEnabled','livePushEnabled','capitalImpact','orderImpact','system1RuntimeUsed']) assert.equal(o[key],false,key);
assert.equal(o.rowsWritten,0);
assert.equal(receipt.d03Interpretation.oos,'UNKNOWN_NOT_OPENED');
assert.equal(receipt.d03Interpretation.walkForward,'UNKNOWN_NOT_OPENED');
assert.equal(receipt.d03Interpretation.factorRedundancy,'NO_NEW_INDEPENDENT_INFORMATION_ROOT');
assert.equal(receipt.maturityDecision.d03MaturityPct,56.7);
assert.equal(receipt.maturityDecision.d03_09,'L2_40');
assert.equal(receipt.maturityDecision.d03_10,'L2_40');
assert.equal(receipt.maturityDecision.formalOptimizationCandidate,'NONE');

console.log(JSON.stringify({status:'PASS',symbol:o.symbol,bridgeState:o.bridgeState,pitReplayEligible:o.pitTechnicalContinuityReplayEligible,maturityPct:receipt.maturityDecision.d03MaturityPct,formalCoreImpact:receipt.formalCoreImpact}));
