import fs from 'node:fs';

const fixture=JSON.parse(fs.readFileSync(new URL('./d03_post_facto_indicator_clock_cases_20261009_v0_1.json',import.meta.url)));
const clone=x=>structuredClone(x);
const setPath=(o,p,v)=>{if(p)o[p]=v;};

function evaluate(x){
  const sourceComplete=x.sourceRunSuccess&&
    x.marketDateReceiptCount===x.expectedMarketDateReceiptCount&&
    x.sourceKeyCount===x.expectedSourceKeyCount&&x.sourceMarketDateMatched&&
    x.primaryTransportOnly&&x.rawPriceSpace&&x.normalizedHashesPresent;
  if(x.attemptedClockBackdating)return {state:'BLOCKED_CLOCK_BACKDATING',mechanismReplay:false,pitReady:false,w0Ready:false,outcomeJoinReady:false};
  if(!sourceComplete)return {state:'UNKNOWN',mechanismReplay:false,pitReady:false,w0Ready:false,outcomeJoinReady:false};
  const mechanismReplay=true;
  const storageConflict=x.hotD1CensusExecuted&&x.allSourceKeysInHotD1&&
    (!x.hotD1ValuesMatch||!x.noRawMultiversionConflict);
  if(storageConflict)return {state:'STORAGE_CONFLICT',mechanismReplay,pitReady:false,w0Ready:false,outcomeJoinReady:false};
  const pitReady=!x.postFactoObservation&&x.firstKnownAtProven&&x.availableByDecision&&x.exactSymbolSessionCertified;
  const w0Ready=pitReady&&x.corporateActionAncestryCertified&&x.haltNoEventCertified&&
    x.identityTransitionDisposed&&x.continuityReceiptHashBound;
  const outcomeJoinReady=w0Ready&&x.genuineParentAvailable&&x.populationDenominatorComplete&&x.costFillabilityBound;
  const state=outcomeJoinReady?'OUTCOME_JOIN_READY':w0Ready?'W0_READY':pitReady?'PIT_INPUT_READY':'POST_FACTO_SOURCE_ONLY';
  return {state,mechanismReplay,pitReady,w0Ready,outcomeJoinReady};
}

let passed=0;
for(const c of fixture.cases){
  const x=clone(fixture.base);setPath(x,c.path,c.value);Object.assign(x,c.patch||{});
  const actual=evaluate(x);
  const expected={state:c.expectedState,mechanismReplay:c.mechanismReplay,pitReady:c.pitReady,w0Ready:c.w0Ready,outcomeJoinReady:c.outcomeJoinReady};
  if(JSON.stringify(actual)!==JSON.stringify(expected))throw new Error(`${c.id}: ${JSON.stringify(actual)}`);
  passed++;
}

const current=evaluate(fixture.base);
if(current.state!=='POST_FACTO_SOURCE_ONLY'||current.pitReady||current.w0Ready||current.outcomeJoinReady)
  throw new Error('post-facto source evidence over-promoted');

console.log(JSON.stringify({
  status:'PASS',cases:passed,physicalRunId:fixture.physicalEvidence.runId,
  sourceReceiptCount:fixture.physicalEvidence.marketDateReceipts,
  sourceKeyCount:fixture.physicalEvidence.sourceKeys,
  currentState:current.state,currentMechanismReplay:current.mechanismReplay,
  currentPitReady:current.pitReady,currentW0Ready:current.w0Ready,
  currentOutcomeJoinReady:current.outcomeJoinReady,
  d03MaturityPct:56.7,formalCoreImpact:'NONE_LOCKED'
}));
