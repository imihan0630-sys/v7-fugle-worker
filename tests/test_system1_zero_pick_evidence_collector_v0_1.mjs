import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {canonicalJcsJson} from '../research/canonical_receipt_hash_v0_1.mjs';
import {buildSystem1ZeroPickObserverSourceFromRuntime as source} from '../research/system1_zero_pick_runtime_source_adapter_v0_1.mjs';
import {buildSystem1ZeroPickRankObservation as observe} from '../research/system1_zero_pick_rank_input_observer_v0_1.mjs';
import {adaptC1PopulationPages,diagnosePopulation} from '../research/system1_selection_isolated_v0_1.mjs';
import {collectVerifiedC1C2} from '../research/system1_c1_c2_collection_v0_1.mjs';
import {verifyC1ZeroPickProspectiveEvidence as verify} from '../research/system1_zero_pick_evidence_collector_v0_1.mjs';
import {buildC3Registration} from '../research/system1_c3_registration_v0_1.mjs';

// Synthetic future-session fixtures; never counted as prospective market evidence.
const day='2026-10-05',decisionAt=day+'T10:00:00Z',generationId='C1:'+day+':collector-fixture';
const sha=s=>createHash('sha256').update(s).digest('hex');
const capture={schemaVersion:'SYSTEM1_ZERO_PICK_C1_CAPTURE_V0_1',
  semantics:'COUNTERFACTUAL_RANK_INPUT / RESEARCH_ONLY / NO_FORMAL_DECISION_IMPACT',
  fingerprintState:'SHA256_FINALIZED',sameScanOnly:true,laterRepairAllowed:false,
  historicalBackfillAllowed:false,actualFormalRank:false,providerCallDelta:0};
function featureRow(symbol,close,preSortOrdinal,{incomplete=false,reference=null}={}){
  const feature={close,historyDays:null,ret20:0,marketReturn20:0};
  const derived={rewardPerRisk:incomplete?null:0,setupQuality:0,institutionalScore:0,fundamentalScore:0};
  const pool=close>=1000?'THOUSAND':'GENERAL';
  const input=source({scanDate:day,symbol,pool,captureGeneration:generationId,decisionAt,preSortOrdinal,
    feature,derived,sector:{score:0},consensusReference:reference});
  const {sourceKnownAt,sourceKnownAtProvenance,sourceEventAt,marketConsensusState,consensusObservedReferenceDate}=input;
  return {symbol,pricePool:pool,feature,derived,sector:{},
    formalResult:{ok:false,firstFailure:'HISTORY_BLOCKED',selected:false},safety:{},
    zeroPickRankObservation:{...observe(input,sha),sourceKnownAt,sourceKnownAtProvenance,sourceEventAt,
      marketConsensusState,consensusObservedReferenceDate}};
}
const rows=[featureRow('2330',1000,0,{reference:{marketDate:day,updatedAt:day+'T09:00:00Z',bySymbol:{'2330':{sourceCount:3}}}}),
  featureRow('2007',999.99,1,{incomplete:true}),featureRow('2006',100,0),
  {symbol:'9999',pricePool:'GENERAL',feature:{close:10,historyDays:null},derived:null,
    formalResult:{ok:false,firstFailure:'HISTORY_BLOCKED',selected:false},zeroPickRankObservation:null,safety:{}}];
function pagesFor(inputRows=rows,headerChange={}){
  const header={generationId,sessionDate:day,decisionAt,readbackVerified:true,
    sourceMainSha:'a'.repeat(40),effectiveRuntimeVersion:'8.16.0-zero-pick-prospective-capture',
    zeroPickCapture:capture,featureN:3,contentDigest:sha(JSON.stringify(inputRows)),
    universeDigest:sha(inputRows.map(r=>r.symbol).sort().join('\n')),populationN:inputRows.length,
    capturedN:inputRows.length,chunkCount:2,completeness:'IN_MEMORY_COMPLETE_NORMALIZED_UNIVERSE',...headerChange};
  return [inputRows.slice(0,2),inputRows.slice(2)].map((rows,i)=>structuredClone({ok:true,header,
    chunks:[{chunkIndex:i,rowCount:rows.length,rows}],page:{hasMore:i===0,nextCursor:i===0?1:null}}));
}
const scanProof={scanDate:day,generationId,pipelineComplete:true,configVerified:true,c1SaveVerified:true};
const run=(pages=pagesFor(),selectedCount=0)=>verify({pages,adapted:adaptC1PopulationPages(pages),scanProof,formalSelectedCount:selectedCount});
const checked=run();
assert.equal(checked.status,'CAPTURE_INTEGRITY_VERIFIED');
assert.deepEqual([checked.childPresentN,checked.completeTupleN,checked.incompleteTupleN,checked.finalizedFingerprintN,checked.invalidTupleN],[3,2,1,2,0]);
assert.equal(checked.poolCounts.GENERAL.completeTupleN,1);
assert.equal(checked.poolCounts.THOUSAND.completeTupleN,1);
assert.equal(checked.readyForMatchedC5Join,true);
assert.equal(checked.eligibleForZeroPickCounterfactual,false,'capture is not a matched P1-A F9 C5 eligibility proof');
assert.equal(checked.cashEconomicComparisonAllowed,false);
assert.equal(checked.economicSuperiority,'UNKNOWN');
assert.equal(checked.formalOptimizationCandidate,'NONE');
assert.equal(checked.rows[2].observation.rankInput.rewardPerRisk,0);
assert.equal(checked.rows[1].validation.counterfactualRankable,false);
assert.equal(checked.rows[1].observation.rankInput,null);
assert.equal(checked.rows[2].observation.rankInput.preSortOrdinal,0,'retain feature insertion ordinal despite C1 order');
assert.deepEqual(run(pagesFor().reverse()),checked,'pagination arrival order does not renumber tuples');
const pages=pagesFor(),snapshot=JSON.stringify(pages),adapted=adaptC1PopulationPages(pages);
assert.deepEqual(adapted.rows.map(r=>r.zeroPickRankObservation),rows.map(r=>r.zeroPickRankObservation));
adapted.rows[0].zeroPickRankObservation.rankInput.rewardPerRisk=123;
assert.equal(JSON.stringify(pages),snapshot,'adapter owns a deep copy');

const mutate=(change,header={})=>{const r=structuredClone(rows);change(r);return run(pagesFor(r,header));};
function invalid(change,code){
  const result=mutate(change);assert.equal(result.status,'CAPTURE_INTEGRITY_BLOCKED',code);
  assert.ok(result.rows.some(r=>r.validation.errors.includes(code)),code);
  assert.equal(result.readyForMatchedC5Join,false);
  for(const row of result.rows.filter(r=>r.validation.status==='INVALID')) assert.equal(row.validation.counterfactualRankable,false);
  return result;
}
const rehash=t=>{const {rankingTupleFingerprint,...payload}=t;t.rankingTupleFingerprint=sha(canonicalJcsJson(payload));};
invalid(r=>r[0].zeroPickRankObservation.rankInput.rankingTupleFingerprint='0'.repeat(64),'FINGERPRINT_MISMATCH');
invalid(r=>r[0].zeroPickRankObservation.rankInput.rankingTupleFingerprint='pending','FINGERPRINT_FORMAT_INVALID');
invalid(r=>r[0].zeroPickRankObservation.sourceKnownAt.feature=day+'T11:00:00Z','SOURCE_TIME_NOT_PIT_UPPER_BOUND');
invalid(r=>{const t=r[0].zeroPickRankObservation.rankInput;t.rankingTupleKnownAt=day+'T11:00:00Z';rehash(t);},'TUPLE_NOT_PIT_UPPER_BOUND');
invalid(r=>r[0].zeroPickRankObservation.sourceEventAt.consensusReferenceUpdatedAt=day+'T11:00:00Z','CONSENSUS_EVENT_NOT_PIT');
invalid(r=>r[0].zeroPickRankObservation.sourceEventAt.featureSourceEventAt=decisionAt,'INVENTED_SOURCE_EVENT_TIME');
invalid(r=>r[0].zeroPickRankObservation.actualFormalRank=true,'OBSERVATION_FIREWALL_MISMATCH');
invalid(r=>r[0].zeroPickRankObservation.researchOnly=false,'OBSERVATION_FIREWALL_MISMATCH');
invalid(r=>r[0].zeroPickRankObservation.decisionImpact=true,'OBSERVATION_FIREWALL_MISMATCH');
invalid(r=>r[0].zeroPickRankObservation.schemaVersion='future','OBSERVATION_SCHEMA_MISMATCH');
invalid(r=>r[0].zeroPickRankObservation.pool='GENERAL','OBSERVATION_IDENTITY_MISMATCH');
invalid(r=>r[0].zeroPickRankObservation.captureGeneration='other','OBSERVATION_IDENTITY_MISMATCH');
invalid(r=>r[0].pricePool='GENERAL','OBSERVATION_IDENTITY_MISMATCH');
invalid(r=>{const t=r[0].zeroPickRankObservation.rankInput;t.rankComparatorVersion='priority-only';rehash(t);},'TUPLE_LINEAGE_MISMATCH');
invalid(r=>{const t=r[0].zeroPickRankObservation.rankInput;t.preSortOrdinal=1;rehash(t);},'ORDINAL_INVALID');
invalid(r=>{const t=r[2].zeroPickRankObservation.rankInput;t.rewardPerRisk=null;rehash(t);},'TUPLE_NUMERIC_MISSING');
invalid(r=>{const t=r[2].zeroPickRankObservation.rankInput;t.rewardPerRisk=2;rehash(t);},'TUPLE_STORED_SOURCE_MISMATCH');
invalid(r=>r[0].zeroPickRankObservation.rankInput=null,'COMPLETE_TUPLE_MISSING');
invalid(r=>r[1].zeroPickRankObservation.rankInput=r[0].zeroPickRankObservation.rankInput,'INCOMPLETE_HAS_TUPLE');
invalid(r=>r[1].zeroPickRankObservation.missingFields={},'MISSING_FIELDS_INVALID');
invalid(r=>delete r[0].zeroPickRankObservation,'FEATURE_CHILD_MISSING');
invalid(r=>r[0].zeroPickRankObservation='malformed','OBSERVATION_SCHEMA_MISMATCH');
const duplicate=invalid(r=>{r[1]=featureRow('2007',999.99,0);},'DUPLICATE_POOL_ORDINAL');
assert.equal(duplicate.invalidTupleN,2);
for(const reference of [null,{marketDate:'2026-10-02',updatedAt:day+'T11:00:00Z',bySymbol:{'2006':{sourceCount:9}}}]){
  const result=mutate(r=>r[2]=featureRow('2006',100,0,{reference}));
  assert.equal(result.status,'CAPTURE_INTEGRITY_VERIFIED');
  const c=result.rows[2].observation;
  assert.equal(c.marketConsensusState,'ABSENT_OR_WRONG_DATE_AT_DECISION');
  assert.equal(c.rankInput.decomposition.marketConsensusSources,0);
  assert.equal(c.sourceEventAt.consensusReferenceUpdatedAt,null);
  assert.equal(result.laterRepairPerformed,false);
}
invalid(r=>{const t=r[2].zeroPickRankObservation.rankInput;t.decomposition.marketConsensusSources=3;rehash(t);},'CONSENSUS_LATER_REPAIR_OR_DATE_MISMATCH');
invalid(r=>r[0].zeroPickRankObservation.consensusObservedReferenceDate='2026-10-02','CONSENSUS_DATE_MISMATCH');
const rejected=mutate(r=>{const c=r[1].zeroPickRankObservation;c.missingFields=['OBSERVER_SOURCE_REJECTED'];
  delete c.sourceKnownAt;delete c.sourceKnownAtProvenance;delete c.sourceEventAt;delete c.marketConsensusState;delete c.consensusObservedReferenceDate;});
assert.equal(rejected.status,'CAPTURE_INTEGRITY_VERIFIED');assert.equal(rejected.incompleteTupleN,1);
for(const change of [{fingerprintState:'PENDING_ASYNC_FINALIZE'},{historicalBackfillAllowed:true},{providerCallDelta:1}]){
  const result=run(pagesFor(rows,{zeroPickCapture:{...capture,...change}}));
  assert.equal(result.status,'CAPTURE_INTEGRITY_BLOCKED');assert.equal(result.finalizedFingerprintN,0);
}
const changedPage=pagesFor();changedPage[1].header.zeroPickCapture.fingerprintState='PENDING_ASYNC_FINALIZE';
assert.ok(run(changedPage).headerErrors.includes('CAPTURE_HEADER_PAGINATION_MISMATCH'));
const badGeneration=pagesFor();badGeneration[1].header.generationId='other';
assert.throws(()=>run(badGeneration),/C1_HEADER_MISMATCH/);
const badDigest=pagesFor();badDigest[0].chunks[0].rows[0].zeroPickRankObservation.rankInput.rewardPerRisk++;
assert.throws(()=>run(badDigest),/C1_DIGEST_MISMATCH/);
const oldRows=rows.map(({zeroPickRankObservation,...row})=>row);
const legacyPages=pagesFor(oldRows,{effectiveRuntimeVersion:'8.15.4-c4-priority-provenance',zeroPickCapture:undefined});
const legacy=run(legacyPages);
assert.equal(legacy.status,'LEGACY_NO_ZERO_PICK_CHILD');assert.equal(legacy.invalidTupleN,0);
assert.equal(legacy.childPresentN,0);assert.equal(legacy.historicalBackfillPerformed,false);
assert.ok(legacy.rows.every(r=>r.observation===null&&!r.validation.counterfactualRankable));
assert.ok(adaptC1PopulationPages(legacyPages).rows.every(r=>!Object.hasOwn(r,'zeroPickRankObservation')));
assert.equal(run(pagesFor(oldRows,{effectiveRuntimeVersion:undefined,zeroPickCapture:undefined})).status,'UNVERSIONED_NO_ZERO_PICK_CHILD');
assert.equal(run(pagesFor(rows,{effectiveRuntimeVersion:'8.15.4'})).status,'CAPTURE_INTEGRITY_BLOCKED','legacy cannot be retrofitted');
for(const selectedCount of [1,null,'0']){
 const result=run(pagesFor(),selectedCount);assert.equal(result.status,'CAPTURE_INTEGRITY_VERIFIED');
 assert.equal(result.legitimateZeroPick,false);assert.equal(result.readyForMatchedC5Join,false);
}
const selected=mutate(r=>r[0].formalResult.selected=true);assert.equal(selected.legitimateZeroPick,false);

const calls=[];
const request=async (url,options={})=>{
  const u=new URL(url);calls.push([u.pathname,options.method||'GET']);
  assert.equal(options.method||'GET','GET','no new provider call or write');
  let value;
  if(u.pathname==='/api/research/c1-population'){
    const index=Number(u.searchParams.get('cursor'));if(index) assert.equal(u.searchParams.get('generationId'),generationId);
    value=pagesFor()[index];
  }else if(u.pathname==='/api/scan/status')value={scanDate:day,dryRun:false,selectedCount:0,pipeline:{complete:true},config:{verified:true},
    researchC1Population:{generationId,generated:rows.length,saved:rows.length,saveOk:true,readbackVerified:true}};
  else if(u.pathname==='/api/config')value={stocks:[]};
  else throw Error('unexpected endpoint '+u.pathname);
  return {ok:true,status:200,json:async()=>structuredClone(value)};
};
const collected=await collectVerifiedC1C2({origin:'https://fixture.invalid',token:'fixture-only',scanDate:day,request});
assert.deepEqual(calls.map(c=>c[0]),['/api/research/c1-population','/api/research/c1-population','/api/scan/status']);
assert.deepEqual(collected.zeroPickProspective,checked);
const diagnosisWithoutChild=diagnosePopulation({...collected.adapted,
  rows:collected.adapted.rows.map(({zeroPickRankObservation,...row})=>row),samplePerStratum:3,seed:`C1-${day}`});
assert.deepEqual(collected.diagnosis,diagnosisWithoutChild,'C1 Formal/diagnostic output unaffected by child');
const legacyRequest=async(url,options)=>{
  if(new URL(url).pathname==='/api/research/c1-population')return {ok:true,status:200,json:async()=>legacyPages[Number(new URL(url).searchParams.get('cursor'))]};
  return request(url,options);
};
const old=await collectVerifiedC1C2({origin:'https://fixture.invalid',token:'fixture-only',scanDate:day,request:legacyRequest});
assert.deepEqual(old.diagnosis,collected.diagnosis);
const c2View=({sourceContentDigest,fingerprint,effectiveRuntimeVersion,...rest})=>rest;
assert.deepEqual(c2View(old.paired),c2View(collected.paired),'C2 classification/cohort output unaffected');
const corruptRequest=async(url,options)=>{
 const response=await request(url,options);
 if(new URL(url).pathname==='/api/research/c1-population'){
   const r=structuredClone(rows);r[0].zeroPickRankObservation.rankInput.rankingTupleFingerprint='0'.repeat(64);
   return {...response,json:async()=>pagesFor(r)[Number(new URL(url).searchParams.get('cursor'))]};
 }
 return response;
};
const corrupt=await collectVerifiedC1C2({origin:'https://fixture.invalid',token:'fixture-only',scanDate:day,request:corruptRequest});
assert.equal(corrupt.zeroPickProspective.status,'CAPTURE_INTEGRITY_BLOCKED');
assert.deepEqual(corrupt.diagnosis,collected.diagnosis,'invalid tuple does not block original C1/C2 collection');
assert.deepEqual(c2View(corrupt.paired),c2View(collected.paired));

// Execute the actual CLI with mocked HTTP and temporary artifacts, including existing C3 registration.
const dir=await mkdtemp(join(tmpdir(),'zero-pick-collector-'));
const env={V7_ORIGIN:'https://fixture.invalid',V7_ADMIN_TOKEN:'fixture-only',C1_SCAN_DATE:day,C3_REGISTER:'true',
 C1_EVIDENCE_OUTPUT:join(dir,'c1.json'),C2_EVIDENCE_OUTPUT:join(dir,'c2.json'),C1_READINESS_OUTPUT:join(dir,'readiness.json'),C3_REGISTRATION_OUTPUT:join(dir,'c3.json')};
const previous=Object.fromEntries(Object.keys(env).map(k=>[k,process.env[k]])),previousFetch=globalThis.fetch;
try{
 Object.assign(process.env,env);globalThis.fetch=request;calls.length=0;
 await import('./collect_system1_c1_c2_evidence.mjs');
 assert.ok(!process.exitCode,'collector CLI failed');
 const artifact=JSON.parse(await readFile(env.C1_EVIDENCE_OUTPUT,'utf8'));
 const paired=JSON.parse(await readFile(env.C2_EVIDENCE_OUTPUT,'utf8'));
 const registration=JSON.parse(await readFile(env.C3_REGISTRATION_OUTPUT,'utf8'));
 assert.deepEqual(artifact.zeroPickProspective,checked,'full original child and fingerprint survive artifact JSON');
 assert.deepEqual(artifact.diagnosis,collected.diagnosis);
 assert.deepEqual(paired,{...collected.paired,scanProof:collected.scanProof});
 const {zeroPickProspective,...oldArtifact}=artifact;
 assert.deepEqual(buildC3Registration(oldArtifact,paired,{stocks:[]}),buildC3Registration(artifact,paired,{stocks:[]}));
 assert.equal(registration.status,'NO_SHADOW_ONLY_COHORT');
 assert.deepEqual(calls.map(c=>c[0]),['/api/research/c1-population','/api/research/c1-population','/api/scan/status','/api/config']);
}finally{
 globalThis.fetch=previousFetch;
 for(const [k,v] of Object.entries(previous))if(v===undefined)delete process.env[k];else process.env[k]=v;
 await rm(dir,{recursive:true,force:true});
}
console.log('PASS zero-pick collector: integrity, PIT, legacy, pagination, fail-closed tuples, artifact and C1/C2/C3 parity (fixtures only)');
