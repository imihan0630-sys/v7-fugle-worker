import assert from 'node:assert/strict';
import {evaluateGenerationSetFinalization} from '../research/system1_generation_set_finalization_v0_1.mjs';

const row = {
  generationId:'g1',sessionDate:'2026-10-07',decisionAt:'2026-10-07T15:35:00Z',
  runtimeVersion:'8.20.0-formal-c1-binding-ledger',originKind:'AFTER_MARKET_SCAN_PIPELINE',
  pathKind:'NORMAL_AFTER_MARKET',contentDigest:'c'.repeat(64),universeDigest:'u'.repeat(64),
  populationN:1875,integrityState:'VERIFIED'
};
function base() {
  return {
    scanDate:'2026-10-07',
    sessionIdentityHash:'s'.repeat(64),
    finalizationRuleVersion:'SDA016_T48_V0_1',
    producerRegistryVersion:'PREG_V0_1',
    producerSetHash:'p'.repeat(64),
    expectedProducerClasses:['AFTER_MARKET_SCAN_PIPELINE','STAGE_SELECTION_ROUTE','DIRECT_SAFE_PERSISTENCE_CALLER'],
    producerCutoffRuleHash:'r'.repeat(64),
    finalizedAt:'2026-10-07T16:00:00Z',
    knowledgeCutoff:'2026-10-07T16:00:00Z',
    ruleFrozenAt:'2026-10-07T06:00:00Z',
    outcomeObservedAt:'2026-10-08T01:30:00Z',
    finalizationRequested:true,
    producerState:{registryComplete:true,windowsClosed:true,runningRefs:[],pendingRetryRefs:[],unresolvedRefs:[],failedRefs:[]},
    inventory:{snapshotMutableUntilSessionComplete:true,truncated:false,integrityComplete:true,modernOriginCoverageComplete:true,generations:[row]},
    bindings:[{c1GenerationId:'g1'}]
  };
}

let x=base(); x.finalizationRequested=false;
assert.equal(evaluateGenerationSetFinalization(x).code,'GENERATION_SET_NOT_FINALIZED');

x=base(); x.producerState.windowsClosed=false; x.bindings=[];
assert.equal(evaluateGenerationSetFinalization(x).code,'NOT_FINALIZED');

x=base(); x.producerState.windowsClosed=false;
assert.equal(evaluateGenerationSetFinalization(x).code,'PARENT_VALID_SET_NOT_FINALIZED');

x=base(); x.producerState.registryComplete=false;
assert.equal(evaluateGenerationSetFinalization(x).code,'FINALIZATION_PRODUCER_SET_UNKNOWN');

x=base(); x.producerState.pendingRetryRefs=['retry-1'];
assert.equal(evaluateGenerationSetFinalization(x).code,'REJECT_EARLY_FINALIZATION');

x=base();
const good=evaluateGenerationSetFinalization(x);
assert.equal(good.code,'FINALIZED_VERIFIED');
assert.equal(good.receipt.generationCount,1);
assert.equal(good.receipt.generationIds[0],'g1');

x=base(); x.existingFinalization=good.receipt; x.inventory.generations=[row,{...row,generationId:'g2',decisionAt:'2026-10-07T15:40:00Z'}];
assert.equal(evaluateGenerationSetFinalization(x).code,'POST_FINALIZATION_GENERATION_VIOLATION');

x=base(); x.existingFinalization=good.receipt; x.replacementAttempt=true;
assert.equal(evaluateGenerationSetFinalization(x).code,'REJECT_MUTABLE_FINALIZATION_HISTORY');

x=base(); x.bindings=[{c1GenerationId:'outside'}];
assert.equal(evaluateGenerationSetFinalization(x).code,'FINALIZATION_BINDING_SET_MISMATCH');

x=base(); x.ruleFrozenAt='2026-10-08T02:00:00Z'; x.outcomeObservedAt='2026-10-08T01:30:00Z';
assert.equal(evaluateGenerationSetFinalization(x).code,'ADAPTIVE_FINALIZATION_RULE_REJECTED');

console.log(JSON.stringify({ok:true,cases:10,formalCoreImpact:'NONE',runtimeMutation:false}));
