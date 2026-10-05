// Shared, offline Class A contract. Hash-linked receipts require an externally retained head.
import { createHash } from 'node:crypto';
import { canonicalJcsJson } from './canonical_receipt_hash_v0_1.mjs';
const hash = x => createHash('sha256').update('EXPERIMENT_HOLDOUT_V0_1|' + canonicalJcsJson(x)).digest('hex');
const text = x => typeof x === 'string' && x.trim().length > 0;
const instant = x => { if (!text(x) || !/(Z|[+-]\d\d:\d\d)$/.test(x) || !Number.isFinite(Date.parse(x))) throw Error('INVALID_INSTANT'); return Date.parse(x); };
const identity = x => canonicalJcsJson([x.experimentId,x.experimentVersion]);
export const EMPTY_LEDGER_HEAD = '0'.repeat(64);
export function replayExperimentLedger(events, expectedHead) {
  let head=EMPTY_LEDGER_HEAD,lastAt=-Infinity;
  const experiments=new Map(),holdouts=new Map(),eventIds=new Set(),familyTrials=new Map();
  for (const event of events) {
    const {eventHash,...body}=event;
    if (body.previousHash!==head || body.sequence!==eventIds.size+1 || eventHash!==hash(body)) throw Error('LEDGER_CHAIN_INTEGRITY');
    if (!text(body.eventId) || eventIds.has(body.eventId)) throw Error('DUPLICATE_EVENT_ID');
    const at=instant(body.at);
    if (at<lastAt) throw Error('NON_MONOTONIC_LEDGER_CLOCK');
    const action=body.action,id=identity(action);
    if (!text(action.experimentId) || !text(action.experimentVersion)) throw Error('EXPERIMENT_ID_VERSION_REQUIRED');
    if (action.type==='REGISTER') {
      const s=action.spec;
      for (const f of ['targetId','benchmarkId','holdoutId','parameterFamilyId','factorVersion','primaryOutcomeHorizon','multiplicityMethod','stopRule','minimumDetectableEffect']) if (!text(s?.[f])) throw Error('PREREGISTRATION_REQUIRED:'+f);
      if (!s.target || !s.benchmark || !Array.isArray(s.frozenCandidateSet) || !s.frozenCandidateSet.length || !/^[a-f0-9]{64}$/.test(s.factorRegistryDigest) || !/^[a-f0-9]{64}$/.test(s.holdoutDatasetHash)) throw Error('FROZEN_DEFINITION_REQUIRED');
      if (s.inspectionPolicy!=='SINGLE_INSPECTION_THEN_DEVELOPMENT') throw Error('SEQUENTIAL_EXCEPTION_REQUIRES_D16_CONTRACT');
      for (const prior of experiments.values()) if ((prior.experimentId===action.experimentId || prior.spec.factorVersion===s.factorVersion) && prior.spec.parameterFamilyId!==s.parameterFamilyId) throw Error('EXPERIMENT_FAMILY_RESET_FORBIDDEN');
      const targetHash=hash(s.target),benchmarkHash=hash(s.benchmark),specHash=hash(s);
      if (s.targetHash!==targetHash || s.benchmarkHash!==benchmarkHash) throw Error('TARGET_BENCHMARK_HASH_MISMATCH');
      if (experiments.has(id)) {
        if (experiments.get(id).specHash!==specHash) throw Error('IMMUTABLE_EXPERIMENT_VERSION_CONFLICT');
        throw Error('DUPLICATE_REGISTRATION');
      }
      // Renaming a holdout cannot reset inspection consumption. Same ID cannot change data.
      for (const h of holdouts.values()) if (h.holdoutIds.includes(s.holdoutId) && h.datasetHash!==s.holdoutDatasetHash) throw Error('HOLDOUT_ID_DATASET_MUTATION');
      let holdout=holdouts.get(s.holdoutDatasetHash);
      if (!holdout) {holdout={holdoutIds:[s.holdoutId],datasetHash:s.holdoutDatasetHash,holdoutUseCount:0,firstInspectedAt:null,consumedAsDevelopmentData:false};holdouts.set(s.holdoutDatasetHash,holdout);}
      if (!holdout.holdoutIds.includes(s.holdoutId)) holdout.holdoutIds.push(s.holdoutId);
      const priorInspection=holdout.holdoutUseCount>0;
      const item={experimentId:action.experimentId,experimentVersion:action.experimentVersion,spec:JSON.parse(canonicalJcsJson(s)),specHash,targetHash,benchmarkHash,registeredAt:body.at,registeredAfterInspection:priorInspection,experimentInspectionCount:0,outcomeLock:null};
      if (priorInspection) holdout.consumedAsDevelopmentData=true;
      experiments.set(id,item);
      familyTrials.set(s.parameterFamilyId,(familyTrials.get(s.parameterFamilyId)??0)+1);
    } else {
      const experiment=experiments.get(id);
      if (!experiment) throw Error('EXPERIMENT_NOT_PREREGISTERED');
      const holdout=holdouts.get(experiment.spec.holdoutDatasetHash);
      if (action.type==='INSPECT') {
        if (!text(action.inspectionId)) throw Error('INSPECTION_ID_REQUIRED');
        // Every distinct committed access consumes a use; no client id can erase an access.
        holdout.holdoutUseCount++;
        experiment.experimentInspectionCount++;
        holdout.firstInspectedAt ??= body.at;
        if (holdout.holdoutUseCount>1 || experiment.outcomeLock) holdout.consumedAsDevelopmentData=true;
      } else if (action.type==='LOCK_OUTCOME') {
        if (experiment.outcomeLock) throw Error('OUTCOME_ALREADY_LOCKED');
        if (!experiment.experimentInspectionCount || !['POSITIVE','NEGATIVE','NULL','FAILED','INCONCLUSIVE'].includes(action.result) || !/^[a-f0-9]{64}$/.test(action.outcomeDigest)) throw Error('OUTCOME_RECEIPT_REQUIRED');
        experiment.outcomeLock={result:action.result,outcomeDigest:action.outcomeDigest,lockedAt:body.at};
      } else throw Error('UNKNOWN_LEDGER_ACTION');
    }
    head=eventHash;lastAt=at;eventIds.add(body.eventId);
  }
  if (head!==expectedHead) throw Error('EXTERNAL_HEAD_MISMATCH');
  return {schemaVersion:'EXPERIMENT_HOLDOUT_STATE_V0_1',head,eventsN:events.length,experiments:[...experiments.values()].map(e=>({...e,...holdouts.get(e.spec.holdoutDatasetHash),promotionAuthorized:false})),holdouts:[...holdouts.values()],familyTrials:Object.fromEntries(familyTrials),researchOnly:true,decisionImpact:false,independentClosure:'PENDING_ROOM00',d16SemanticReview:'PENDING',formalOptimizationCandidate:'NONE'};
}
export function appendExperimentEvent(events, expectedHead, {eventId,at,action}) {
  replayExperimentLedger(events,expectedHead);
  const body={sequence:events.length+1,previousHash:expectedHead,eventId,at,action};
  const next={...body,eventHash:hash(body)};
  const result=[...events,next];
  return {event:next,state:replayExperimentLedger(result,next.eventHash)};
}
export function definitionHash(definition) { return hash(definition); }
