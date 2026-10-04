import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {canonicalJcsJson} from '../research/canonical_receipt_hash_v0_1.mjs';
import {adaptC1PopulationPages} from '../research/system1_selection_isolated_v0_1.mjs';
import {verifyC1ZeroPickProspectiveEvidence} from '../research/system1_zero_pick_evidence_collector_v0_1.mjs';
import {buildSystem1ZeroPickObserverSourceFromRuntime} from '../research/system1_zero_pick_runtime_source_adapter_v0_1.mjs';
import {buildSystem1ZeroPickRankObservation} from '../research/system1_zero_pick_rank_input_observer_v0_1.mjs';
import {buildSystem1ZeroPickCounterfactualSelection} from '../research/system1_zero_pick_counterfactual_comparator_v0_1.mjs';

const source=fs.readFileSync(fs.existsSync('artifacts/Worker-before-v8_17_0.mjs')?'artifacts/Worker-before-v8_17_0.mjs':process.env.V7_TEST_WORKER_PATH||'Worker.js','utf8');
const baseline=fs.readFileSync('artifacts/Worker-before-v8_16_0.mjs','utf8');
const hash=s=>createHash('sha256').update(s).digest('hex');
const body=(s,name)=>{
  const start=s.indexOf('function '+name+'('),end=s.indexOf('\n}',start)+2;
  assert.ok(start>=0&&end>start,name);
  return s.slice(start,end);
};
const changedFunctions=['buildC1PopulationReceipt','persistC1PopulationReceipt','selectTomorrowCandidates'];
// Exact whole-source normalization: every other function, route, global and side effect stays byte-identical.
let normalized=source.replace('8.16.0-zero-pick-prospective-capture','8.15.4-c4-priority-provenance');
normalized=normalized.slice(0,normalized.indexOf('\nconst C1_ZERO_PICK_CANONICAL='))+normalized.slice(normalized.indexOf('function buildC1PopulationReceipt('));
for(const name of changedFunctions) normalized=normalized.replace(body(normalized,name),body(baseline,name));
assert.equal(hash(normalized),hash(baseline),'all non-plumbing runtime source must be byte-identical');
const ordinalBlock='  let c1ZeroPickContext=null;\n'+
 '  try { c1ZeroPickContext={ordinals:c1ZeroPickOrdinals(featureRows,todayRows),consensusReference:env.V7_MARKET_CONSENSUS}; }\n'+
 '  catch(error) { c1ZeroPickContext={ordinals:null,consensusReference:null}; }\n';
assert.equal(body(source,'selectTomorrowCandidates').replace(ordinalBlock,'')
 .replace('selected,scanDate,c1ZeroPickContext);','selected,scanDate);'),body(baseline,'selectTomorrowCandidates'));
assert.ok(source.indexOf(ordinalBlock)<source.indexOf('  scored.sort(rankFn);'));
const exports='buildC1PopulationReceipt,c1ChunkRows,persistC1PopulationReceipt,readC1PopulationReceipt,persistCompletedC1Safe,c1DerivedState,selectTomorrowCandidates';
const load=(s,extra='',stub='')=>import('data:text/javascript;base64,'+Buffer.from(s+'\n'+stub+'\nexport {'+exports+extra+'};').toString('base64'));
const api=await load(source,',c1ZeroPickOrdinals,buildC1ZeroPickChild,finalizeC1ZeroPickReceipt');
const day='2026-10-02';
const feature=(symbol,close=100)=>({
 symbol,name:'測試公司'+symbol,market:'TWSE',industry:'Steel',close,historyDays:61,
 marketReturn20:2,sectorReturn20:3,marketCapYi:200,changePercent:1,
 avgVolume20Lots:1500,avgAmount20:90000000,spreadPercent:.2,orderBookDepthGood:true,depthScore:90,
 chipConcentration:60,quarterRevenue:100,financialBasis:true,revenueQoQ:3,revenueQuarterYoY:20,
 valuationObserved:true,priceBookRatio:2,announcementsVerified:true,officialAnnouncements:[],
 priceEarningsRatio:18,sectorMedianPe:15,epsYoY:10,atrPercent:3,
 bullishStack:true,lateStage:false,ma20:close*.98,ma60:close*.9,ma5:close,ma10:close,prevMa20:close*.97,
 volumeTodayVsPrev5:.8,dailyClosePosition:.8,dailyUpperShadowRatio:.1,priorHigh20:close*1.12,
 todayLow:close*.99,priorLow20:close*.90,recentLow5Prev:close*.96,resistancePivotHighs:[close*1.2],
 ret20:8,foreignNet:1,trustNet:1,dealerNet:1,institutionTotalNet:300000,
 foreignBuyDays:3,trustBuyDays:3,dealerBuyDays:3,grossMargin:20,operatingMargin:10,eps:2,
 tradeValue:100000000,volumeShares:1500000,return20StartDate:'2026-09-02'
});
const sector={Steel:{score:71.234,breadth:60,avgChange:.5,amountVs20DayAverage:1.1}};
const consensus={marketDate:day,updatedAt:day+'T06:00:00Z',bySymbol:{'2006':{sourceCount:3}}};
function receipt(features,reference=consensus){
 const raw=features.map(f=>({...f})).reverse(); // Receipt row order must not determine ordinal.
 const context={ordinals:api.c1ZeroPickOrdinals(features,raw),consensusReference:reference};
 return api.buildC1PopulationReceipt(features,raw,{stocks:{}},sector,new Map(),[],day,context);
}
const features=[feature('2006'),feature('2330',1000),feature('2007',999.99),feature('2331',1200)];
const inputSnapshot=JSON.stringify({features,sector,consensus});
const draft=receipt(features),draftJson=JSON.stringify(draft);
assert.equal(draft.zeroPickCapture.fingerprintState,'PENDING_ASYNC_FINALIZE');
const finalized=await api.finalizeC1ZeroPickReceipt(draft);
assert.equal(JSON.stringify(draft),draftJson,'async finalization cannot mutate request-local receipt');
assert.equal(JSON.stringify({features,sector,consensus}),inputSnapshot);
for(const row of finalized.rows){
 const f=features.find(f=>f.symbol===row.symbol),child=row.zeroPickRankObservation;
 assert.equal(child.rankInputStatus,'COMPLETE');
 const expectedSource=buildSystem1ZeroPickObserverSourceFromRuntime({scanDate:day,symbol:f.symbol,pool:row.pricePool,
  captureGeneration:draft.generationId,decisionAt:draft.decisionAt,preSortOrdinal:features.filter(x=>(x.close>=1000)===(f.close>=1000)).indexOf(f),
  feature:f,sector:sector.Steel,derived:api.c1DerivedState(f),consensusReference:consensus});
 assert.deepEqual(child.rankInput,buildSystem1ZeroPickRankObservation(expectedSource,hash).rankInput);
 assert.equal(child.sourceKnownAtProvenance.notSourceEventTime,true);
 assert.equal(child.sourceEventAt.featureSourceEventAt,null);
 assert.equal(child.sourceEventAt.sectorSourceEventAt,null);
 assert.equal(child.rankInput.rankingTupleKnownAt,draft.decisionAt);
 assert.equal(child.actualFormalRank,false);
}
assert.equal(finalized.rows.find(r=>r.symbol==='2330').pricePool,'THOUSAND');
assert.equal(finalized.rows.find(r=>r.symbol==='2007').pricePool,'GENERAL');
const sourceIdentity={scanDate:day,symbol:'2006',pool:'GENERAL',captureGeneration:'fixture',decisionAt:day+'T07:00:00Z',preSortOrdinal:0};
const observe=(f=features[0],s=sector.Steel,d=api.c1DerivedState(features[0]),c=consensus)=>api.buildC1ZeroPickChild(f,s,d,sourceIdentity,c);
for(const missing of [null,undefined,NaN,Infinity,'',false,'0']){
 const child=observe({...features[0],ret20:missing});
 assert.equal(child.rankInputStatus,'INCOMPLETE');assert.equal(child.rankInput,null);
}
for(const key of ['rewardPerRisk','setupQuality','institutionalScore','fundamentalScore']){
 const child=observe(features[0],sector.Steel,{...api.c1DerivedState(features[0]),[key]:null});
 assert.equal(child.rankInputStatus,'INCOMPLETE');assert.equal(child.rankInput,null);
}
assert.equal(observe(features[0],{score:null}).rankInput,null);
assert.equal(observe({...features[0],marketReturn20:null}).rankInput,null);
const zero=observe({...features[0],ret20:0,marketReturn20:0},{score:0},{rewardPerRisk:0,setupQuality:0,institutionalScore:0,fundamentalScore:0});
assert.equal(zero.rankInputStatus,'COMPLETE');assert.equal(zero.rankInput.rewardPerRisk,0);
for(const reference of [null,{...consensus,marketDate:'2026-10-01'}]){
 const child=observe(features[0],sector.Steel,api.c1DerivedState(features[0]),reference);
 assert.equal(child.marketConsensusState,'ABSENT_OR_WRONG_DATE_AT_DECISION');
 assert.equal(child.rankInput.decomposition.marketConsensusSources,0);
}
assert.equal(observe().sourceEventAt.consensusReferenceUpdatedAt,consensus.updatedAt);
assert.equal(observe(features[0],sector.Steel,api.c1DerivedState(features[0]),{...consensus,updatedAt:day+'T08:00:00Z'}).rankInput,null);
assert.equal(observe(features[0],sector.Steel,api.c1DerivedState(features[0]),{...consensus,bySymbol:{'2006':{sourceCount:'bad'}}}).rankInput,null);
const ties=Array.from({length:5},(_,i)=>({...finalized.rows.find(r=>r.symbol==='2006').zeroPickRankObservation.rankInput,symbol:'G'+i,preSortOrdinal:i}));
assert.deepEqual(buildSystem1ZeroPickCounterfactualSelection({rows:ties.reverse()}).selectedSymbols,['G0','G1','G2']);

class Statement{
 constructor(db,sql){this.db=db;this.sql=sql;this.args=[];}
 bind(...args){this.args=args;return this;}
 async run(){return this.db.prepare(this.sql).run(...this.args);}
 async first(){return this.db.prepare(this.sql).get(...this.args)||null;}
 async all(){return {results:this.db.prepare(this.sql).all(...this.args)};}
}
class D1{
 constructor(){this.db=new DatabaseSync(':memory:');}
 prepare(sql){return new Statement(this.db,sql);}
 withSession(){return this;}
 async batch(statements){this.db.exec('BEGIN');try{for(const s of statements)await s.run();this.db.exec('COMMIT');}catch(e){this.db.exec('ROLLBACK');throw e;}}
}
const env={V7_DB:new D1()};
const saved=await api.persistC1PopulationReceipt(env,draft);
assert.equal(saved.readbackVerified,true);
assert.equal((await api.persistC1PopulationReceipt(env,draft)).deduplicated,true);
const page=await api.readC1PopulationReceipt(env,{generationId:draft.generationId});
assert.deepEqual(page.rows,finalized.rows);
assert.equal(page.header.zeroPickCapture.fingerprintState,'SHA256_FINALIZED');
assert.equal(saved.contentDigest,hash(JSON.stringify(page.rows)));
const staleTuple=structuredClone(draft);staleTuple.rows[0].zeroPickRankObservation.rankInput.decisionAt='2026-10-01T00:00:00Z';
await assert.rejects(()=>api.finalizeC1ZeroPickReceipt(staleTuple),/TUPLE_IDENTITY_OR_PIT_MISMATCH/);
const conflict=structuredClone(draft);conflict.rows[0].zeroPickRankObservation.rankInput.relativeStrength++;
await assert.rejects(()=>api.persistC1PopulationReceipt(env,conflict),/IMMUTABLE_GENERATION_CONFLICT/);
const wrongIdentity=structuredClone(draft);wrongIdentity.rows[0].zeroPickRankObservation.captureGeneration='wrong';
await assert.rejects(()=>api.finalizeC1ZeroPickReceipt(wrongIdentity),/IDENTITY_MISMATCH/);
const wrongFingerprint=structuredClone(finalized);wrongFingerprint.rows[0].zeroPickRankObservation.rankInput.rankingTupleFingerprint='0'.repeat(64);
await assert.rejects(()=>api.finalizeC1ZeroPickReceipt(wrongFingerprint),/FINGERPRINT_CONFLICT/);
const corrupted=structuredClone(finalized.rows);corrupted[0].zeroPickRankObservation.rankInput.rewardPerRisk++;
env.V7_DB.db.prepare('UPDATE trade_research_c1_chunks SET rows_json=? WHERE generation_id=?').run(JSON.stringify(corrupted),draft.generationId);
await assert.rejects(()=>api.readC1PopulationReceipt(env,{generationId:draft.generationId}),/DIGEST_MISMATCH/);
const now=Date.parse(draft.decisionAt);
const retrospective=await api.persistCompletedC1Safe(env,draft,day,{selectionVerified:true,now});
assert.equal(retrospective.reason,'NON_PROSPECTIVE_SESSION_CAPTURE');
const liveDay=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
// Offline D1 readback from the actual guarded runtime must satisfy the collector contract.
const collectorDraft=api.buildC1PopulationReceipt(features,features.slice().reverse(),{stocks:{}},sector,new Map(),[],liveDay,
  {ordinals:api.c1ZeroPickOrdinals(features,features),consensusReference:null});
const collectorEnv=env; // Reuse initialized offline D1, matching the runtime schema cache.
await api.persistC1PopulationReceipt(collectorEnv,collectorDraft);
const collectorPage=await api.readC1PopulationReceipt(collectorEnv,{generationId:collectorDraft.generationId});
const collectorEvidence=verifyC1ZeroPickProspectiveEvidence({pages:[collectorPage],adapted:adaptC1PopulationPages([collectorPage])});
assert.equal(collectorEvidence.status,'CAPTURE_INTEGRITY_VERIFIED',JSON.stringify(collectorEvidence));
assert.equal(collectorEvidence.completeTupleN,features.length);
assert.equal(collectorEvidence.cashEconomicComparisonAllowed,false);

const legacy={...api.buildC1PopulationReceipt([], [{symbol:'9999',close:10}], {stocks:{}},{},new Map(),[],liveDay)};
assert.equal(await api.finalizeC1ZeroPickReceipt(legacy),legacy,'no backfill of legacy receipts');

// Actual Formal scoring, sorting and allocation run with deterministic feature-boundary fixtures.
const featureStub='buildEligibleMarketFeature=stock=>({...stock.fixture});';
const before=await load(baseline,'',featureStub),after=await load(source,'',featureStub);
const failed=await load(source,'',featureStub+'\nbuildC1ZeroPickChild=()=>{throw new Error("injected capture failure")};');
const failOrdinal=await load(source,'',featureStub+'\nc1ZeroPickOrdinals=()=>{throw new Error("injected ordinal failure")};');
let providerCalls=0;const originalFetch=globalThis.fetch;globalThis.fetch=()=>{providerCalls++;throw new Error('provider forbidden');};
const formalView=result=>{const {c1PopulationReceipt,c1CaptureError,...formal}=result;return formal;};
const selectionSizes=[];
try{
 for(const rejectAll of [false,true]){
  const fsx=Array.from({length:10},(_,i)=>({...feature('F'+i,i%2?1200:100),...(rejectAll?{marketCapYi:1}:{})}));
  const inputs=()=>[{stocks:Object.fromEntries(fsx.map(f=>[f.symbol,{symbol:f.symbol,fixture:f}]))},fsx,
   {V7_OFFICIAL_INDEX:{asOfDate:day,return20:2,history:[{date:'2026-09-02',close:100},{date:day,close:102}]},V7_MARKET_CONSENSUS:consensus},day];
  const a=before.selectTomorrowCandidates(...inputs()),b=after.selectTomorrowCandidates(...inputs());
  assert.deepEqual(formalView(b),formalView(a),'selected symbols, plans, capital, diagnostics and shadow parity');
  assert.deepEqual(formalView(failed.selectTomorrowCandidates(...inputs())),formalView(a),'capture failure must fail open');
  assert.deepEqual(formalView(failOrdinal.selectTomorrowCandidates(...inputs())),formalView(a),'ordinal failure must fail open');
  const selected=b.c1PopulationReceipt.rows.filter(r=>r.formalResult.selected);
  selectionSizes.push(selected.length);
  assert.equal(selected.length,rejectAll?0:6);
  if(rejectAll)assert.ok(b.c1PopulationReceipt.rows.every(r=>r.zeroPickRankObservation.rankInputStatus==='COMPLETE'),'rejected rows still have counterfactual tuples');
 }
}finally{globalThis.fetch=originalFetch;}
assert.equal(providerCalls,0);
const failingHash=await load(source,',finalizeC1ZeroPickReceipt','sha256Hex=async()=>{throw new Error("injected hash failure")};');
const currentReceipt={...draft,sessionDate:day,decisionAt:day+'T07:00:00Z'};
currentReceipt.rows=structuredClone(draft.rows).map(r=>({...r,zeroPickRankObservation:{...r.zeroPickRankObservation,decisionAt:currentReceipt.decisionAt,
 rankInput:{...r.zeroPickRankObservation.rankInput,decisionAt:currentReceipt.decisionAt,rankingTupleKnownAt:currentReceipt.decisionAt}}}));
const failSafe=await failingHash.persistCompletedC1Safe({V7_DB:new D1()},currentReceipt,day,{selectionVerified:true,now:Date.parse(day+'T08:00:00Z')});
assert.equal(failSafe.status,'DATA_QUALITY_BLOCKED');assert.equal(failSafe.noPush,true);assert.equal(failSafe.formalCoreImpact,false);
assert.match(failSafe.error,/injected hash failure/);

const scales=[];
for(const count of [500,1000,2000]){
 const start=performance.now();
 const r=receipt(Array.from({length:count},(_,i)=>feature(String(1000+i),i%5?100:1200)));
 const ready=await api.finalizeC1ZeroPickReceipt(r),chunks=api.c1ChunkRows(ready.rows);
 const bytes=Buffer.byteLength(JSON.stringify(ready)),maxChunkBytes=Math.max(...chunks.map(c=>Buffer.byteLength(JSON.stringify(c))));
 assert.ok(ready.rows.every(r=>r.zeroPickRankObservation.rankInputStatus==='COMPLETE'));
 assert.ok(maxChunkBytes<=90000);assert.ok(bytes<10000000);
 const save=await api.persistC1PopulationReceipt(env,r);
 assert.equal(save.readbackVerified,true);assert.equal(save.saved,count);
 scales.push({rows:count,bytes,maxChunkBytes,chunks:chunks.length,elapsedMs:Math.round(performance.now()-start)});
}
assert.throws(()=>api.c1ChunkRows([{name:'漢'.repeat(31000)}]),/D1_BYTE_BOUND/);
const report={ok:true,fixtureOnly:true,changedFunctions,protectedRuntimeByteIdentical:true,selectorCaptureOnlyParity:true,
 selectedSymbolsParity:true,plansCapitalParity:true,signalStateParity:true,fifteenMinuteParity:true,pushParity:true,orderParity:true,
 providerCallDelta:providerCalls,researchFailureFailOpen:true,selectionSizes,scales,
 scoreCandidateChanged:false,applyMarketConsensusChanged:false,formalRankFnChanged:false,
 sameScanOnly:true,pitKnownAtGuard:true,exactDateConsensusGuard:true,noLaterRepair:true,noHistoricalBackfill:true,
 actualFormalRankFalse:true,incompleteTupleFailClosed:true,preSortOrdinalStable:true,immutableGenerationConflictGuard:true,readbackVerified:true,
 maxObservedChunkBytes:Math.max(...scales.map(s=>s.maxChunkBytes)),scale2000Bytes:scales.find(s=>s.rows===2000).bytes,
 economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE'};
fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/system1-zero-pick-runtime-capture.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
