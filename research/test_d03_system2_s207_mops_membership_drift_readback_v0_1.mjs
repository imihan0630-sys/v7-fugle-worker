import fs from 'node:fs';
import assert from 'node:assert/strict';

const receipt=JSON.parse(fs.readFileSync(new URL('./d03_system2_s207_mops_membership_drift_readback_20261007_v0_1.json',import.meta.url),'utf8'));
const o=receipt.observed;

assert.equal(receipt.classification,'RESEARCH_ONLY_PROSPECTIVE_CAPTURE_MEMBERSHIP_DRIFT_NEGATIVE_GATE');
assert.equal(receipt.formalCoreImpact,'NONE_LOCKED');
assert.equal(o.frozenEventCount,23);
assert.equal(o.frozenUniqueSymbolCount,23);
assert.equal(o.sameStableEventUniverseHash,true);
assert.equal(o.firstRunVersionCount,159);
assert.equal(o.secondRunVersionCount,161);
assert.equal(o.secondMinusFirstVersionCount,9);
assert.equal(o.firstMinusSecondVersionCount,7);
assert.equal(o.commonVersionPayloadMutationCount,0);
assert.equal(o.populationMembershipStable,false);
assert.equal(o.payloadIdentityStableForCommonVersions,true);
assert.equal(o.latestCoveredSymbolCount,23);
assert.equal(o.latestQueryKeysetExactEventCount,21);
assert.equal(o.symbol4806WasPriorDivergentSymbol,true);
assert.equal(o.globalVersionIdentityIncludesStockCode,true);
assert.equal(o.sourceClockVersionKeyUsedAsGlobalIdentity,false);
for(const key of ['sourceSemanticsCertified','monthShardCoverageComplete','expectedMopsKeysetComplete','noRevisionGapThroughCut','preParentEvidenceCutReady','symbolSessionCompletenessCertified','technicalContinuityCertified','historyMutationPerformed','selectionAuthority','finalSelectionEnabled','livePushEnabled','capitalImpact','orderImpact','system1RuntimeUsed']) assert.equal(o[key],false,key);
assert.equal(receipt.d03Interpretation.oos,'UNKNOWN_NOT_OPENED');
assert.equal(receipt.d03Interpretation.walkForward,'UNKNOWN_NOT_OPENED');
assert.equal(receipt.maturityDecision.d03MaturityPct,56.7);
assert.equal(receipt.maturityDecision.d03_09,'L2_40');
assert.equal(receipt.maturityDecision.d03_10,'L2_40');
assert.equal(receipt.maturityDecision.formalOptimizationCandidate,'NONE');

console.log(JSON.stringify({status:'PASS',events:o.frozenEventCount,firstVersions:o.firstRunVersionCount,secondVersions:o.secondRunVersionCount,gained:o.secondMinusFirstVersionCount,lost:o.firstMinusSecondVersionCount,commonPayloadMutations:o.commonVersionPayloadMutationCount,membershipStable:o.populationMembershipStable,maturityPct:receipt.maturityDecision.d03MaturityPct,formalCoreImpact:receipt.formalCoreImpact}));
