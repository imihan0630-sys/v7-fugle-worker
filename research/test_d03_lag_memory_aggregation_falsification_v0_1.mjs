import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const spec=JSON.parse(readFileSync(new URL('./d03_lag_memory_aggregation_falsification_20261006_v0_1.json',import.meta.url)));
const registry=new Map(spec.factorMemoryRegistry.map(x=>[x.factorId,x]));
assert.equal(registry.size,12);

export function evaluateLagProfile(x){
  if(!x||typeof x!=='object') throw new Error('INPUT_REQUIRED');
  for(const f of spec.requiredReceiptFields){
    if(!(f in x)||x[f]===null||x[f]===undefined||x[f]==='') throw new Error('MISSING_FIELD:'+f);
  }
  if(!spec.allowedTerminalStates.includes(x.lagProfileTerminalState)) throw new Error('INVALID_TERMINAL_STATE');
  const r=registry.get(x.factorId);
  if(!r) throw new Error('UNREGISTERED_FACTOR');
  if(x.memoryClass!==r.memoryClass) throw new Error('MEMORY_CLASS_DRIFT');

  if(x.factorId==='D03-04'){
    return {status:'OUTCOME_RELATION_NOT_PREDICTOR',exactLagClaimAllowed:false};
  }
  if(x.rawRootControlPass!==true){
    return {status:'RAW_ROOT_EXPLAINS_EFFECT',exactLagClaimAllowed:false};
  }
  if(x.temporalAggregationCompatible!==true){
    return {status:'TEMPORAL_AGGREGATION_CONFOUND',exactLagClaimAllowed:false};
  }
  if(x.lagCollinearitySevere===true&&x.peakIdentifiedDespiteCollinearity!==true){
    return {status:'LAG_PEAK_UNIDENTIFIED',exactLagClaimAllowed:false};
  }
  if(x.boundaryPeak===true){
    return {status:'BOUNDARY_PEAK_SEARCH_INCOMPLETE',exactLagClaimAllowed:false};
  }
  if(x.supportThinAtPeak===true){
    return {status:'SUPPORT_THIN_AT_LAG',exactLagClaimAllowed:false};
  }
  if(x.filterDirectionalitySensitive===true){
    return {status:'FILTER_DIRECTIONALITY_SENSITIVE',exactLagClaimAllowed:false};
  }
  if(x.memoryConfoundResolved!==true){
    return {status:'LAG_MEMORY_CONFOUND_UNRESOLVED',exactLagClaimAllowed:false};
  }
  if(x.plateau===true){
    return {status:'PERSISTENT_PLATEAU',exactLagClaimAllowed:false};
  }
  if(x.peakIntervalWidth>1){
    return {status:'LAG_PROFILE_READY_INTERVAL',exactLagClaimAllowed:false};
  }
  return {status:'LAG_PROFILE_READY_POINT',exactLagClaimAllowed:true};
}

function make(id,extra={}){
  const r=registry.get(id);
  return {
    factorId:id,
    factorVersion:'FV1',
    memoryClass:r.memoryClass,
    memoryKernelOrReplayVersion:'MEM1',
    rawRootControlHash:'RAW1',
    lagCandidateSetHash:'LAGS1',
    lagCorrelationDiagnostics:'CORR1',
    lagPeakStability:'STABLE',
    temporalAggregationVersion:'AGG1',
    outcomeFootprintOverlapDiagnostics:'OFO1',
    commonSupportHash:'SUP1',
    multipleTestingFamilyId:'MTF1',
    researchStreamId:'RS1',
    lagProfileTerminalState:'LAG_PROFILE_READY_POINT',
    rawRootControlPass:true,
    temporalAggregationCompatible:true,
    lagCollinearitySevere:false,
    peakIdentifiedDespiteCollinearity:false,
    boundaryPeak:false,
    supportThinAtPeak:false,
    filterDirectionalitySensitive:false,
    memoryConfoundResolved:true,
    plateau:false,
    peakIntervalWidth:1,
    ...extra
  };
}

for(const id of registry.keys()){
  const out=evaluateLagProfile(make(id));
  if(id==='D03-04') assert.equal(out.status,'OUTCOME_RELATION_NOT_PREDICTOR');
  else assert.equal(out.status,'LAG_PROFILE_READY_POINT');
}

assert.equal(evaluateLagProfile(make('D03-08',{rawRootControlPass:false})).status,'RAW_ROOT_EXPLAINS_EFFECT');
assert.equal(evaluateLagProfile(make('D03-13',{temporalAggregationCompatible:false})).status,'TEMPORAL_AGGREGATION_CONFOUND');
assert.equal(evaluateLagProfile(make('D03-09',{lagCollinearitySevere:true})).status,'LAG_PEAK_UNIDENTIFIED');
assert.equal(evaluateLagProfile(make('D03-10',{boundaryPeak:true})).status,'BOUNDARY_PEAK_SEARCH_INCOMPLETE');
assert.equal(evaluateLagProfile(make('D03-06',{supportThinAtPeak:true})).status,'SUPPORT_THIN_AT_LAG');
assert.equal(evaluateLagProfile(make('D03-08',{filterDirectionalitySensitive:true})).status,'FILTER_DIRECTIONALITY_SENSITIVE');
assert.equal(evaluateLagProfile(make('D03-09',{memoryConfoundResolved:false})).status,'LAG_MEMORY_CONFOUND_UNRESOLVED');
assert.equal(evaluateLagProfile(make('D03-07',{plateau:true})).status,'PERSISTENT_PLATEAU');
assert.equal(evaluateLagProfile(make('D03-02',{peakIntervalWidth:3})).status,'LAG_PROFILE_READY_INTERVAL');
assert.throws(()=>evaluateLagProfile(make('D03-08',{memoryClass:'FINITE_WINDOW'})),/MEMORY_CLASS_DRIFT/);

assert.equal(spec.forbiddenInterpretations.includes('BEST_LAG_EQUALS_CAUSAL_DELAY_WITHOUT_MEMORY_CONTROL'),true);
assert.equal(spec.forbiddenInterpretations.includes('ADJACENT_LAGS_AS_INDEPENDENT_EVIDENCE'),true);
assert.equal(spec.noClaim.exactEconomicDelay,true);
assert.equal(spec.noClaim.structuralCausality,true);

console.log(JSON.stringify({
  status:'PASS',
  registeredFactors:12,
  adversarialCases:10,
  governanceChecks:4,
  totalChecks:26,
  rawRootControlRequired:true,
  memoryClassBound:true,
  boundaryPeakBlocks:true,
  plateauDoesNotBecomeExactDelay:true,
  temporalAggregationConfoundBlocks:true,
  structuralCausalityClaimed:false,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
