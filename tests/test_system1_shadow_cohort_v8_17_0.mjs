import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {createHash} from 'node:crypto';
import {buildShadowCohort,shadowHash,SHADOW_CAPTURE_VERSION,SHADOW_COMPARATOR,SHADOW_RANK_FIELDS} from '../research/system1_shadow_cohort_membership_v0_1.mjs';
import {persistShadowCohort,readShadowCohort,appendShadowQuality,loadShadowC1Parent} from '../research/system1_shadow_cohort_storage_v0_1.mjs';
import {collectShadowCohortEvidence} from '../research/system1_shadow_cohort_collection_v0_1.mjs';
import {adaptC1PopulationPages,diagnosePopulation} from '../research/system1_selection_isolated_v0_1.mjs';

const sha=s=>createHash('sha256').update(s).digest('hex');
const baseline=fs.readFileSync('artifacts/Worker-before-v8_17_0.mjs','utf8');
const source=fs.readFileSync(process.env.V7_TEST_WORKER_PATH||'Worker.js','utf8');
function body(s,name){const start=s.indexOf('function '+name+'('),end=s.indexOf('\n}',start)+2;assert.ok(start>=0&&end>start);return s.slice(start,end);}
let normalized=source.replace('8.17.0-shadow-cohort-membership','8.16.0-zero-pick-prospective-capture')
 .replace(/\n\/\/ BEGIN V8\.17 SHADOW COHORT MODULES[\s\S]*?\/\/ END V8\.17 SHADOW COHORT MODULES\n/,'')
 .replace(/    \/\/ BEGIN V8\.17 SHADOW COHORT ROUTES[\s\S]*?    \/\/ END V8\.17 SHADOW COHORT ROUTES\n\n/,'');
for(const name of ['buildC1PopulationReceipt','persistCompletedC1Safe'])normalized=normalized.replace(body(normalized,name),body(baseline,name));
assert.equal(sha(normalized),sha(baseline),'all other runtime/legacy Shadow/Formal functions and side effects byte-identical');
const exports='buildC1PopulationReceipt,persistC1PopulationReceipt,readC1PopulationReceipt,persistCompletedC1Safe,c1ZeroPickOrdinals,selectTomorrowCandidates';
const load=(s,extra='',stub='')=>import('data:text/javascript;base64,'+Buffer.from(s+'\n'+stub+'\nexport {'+exports+extra+'};').toString('base64'));
const api=await load(source,',SHADOW_STORAGE');
class Statement{
 constructor(db,sql){this.owner=db;this.sql=sql;this.args=[];}
 bind(...args){this.args=args;return this;}
 run(){if(this.owner.fail?.(this.sql))throw Error('injected D1 write failure');return this.owner.db.prepare(this.sql).run(...this.args);}
 first(){return this.owner.db.prepare(this.sql).get(...this.args)||null;}
 all(){return {results:this.owner.db.prepare(this.sql).all(...this.args)};}
}
class D1{
 constructor(){this.db=new DatabaseSync(':memory:');this.fail=null;}
 prepare(sql){return new Statement(this,sql);}
 withSession(){return this;}
 async batch(statements){this.db.exec('BEGIN');try{for(const s of statements)s.run();this.db.exec('COMMIT');}catch(e){this.db.exec('ROLLBACK');throw e;}}
}
const day='2026-10-02',stamp=day+'T10:00:00.000Z';
let fixtureStamp=stamp;
const DateOriginal=Date;
class FixtureDate extends DateOriginal{constructor(...args){super(...(args.length?args:[fixtureStamp]));}static now(){return DateOriginal.parse(fixtureStamp);}}
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
const f=Array.from({length:30},(_,i)=>feature(String(2000+i),i%2?1200:100));
const sector={Steel:{score:70,breadth:70,avgChange:1,amountVs20DayAverage:1}};
let receipt;
globalThis.Date=FixtureDate;
try{
 const results=new Map(f.map((row,i)=>[row.symbol,{ok:i<10,basePassed:i>=10&&i%3===0,selected:false,
   reason:i<10?null:i%3===0?'20日流動性不足':i%3===1?'30至100億市值流動性要求未達':'市值資料不足',
   ...Object.fromEntries(SHADOW_RANK_FIELDS.map(k=>[k,0])),marketConsensusSources:0,marketConsensusBonus:0}]));
 receipt=api.buildC1PopulationReceipt(f,f,{stocks:{}},sector,results,f.slice(0,6),day,
   {ordinals:api.c1ZeroPickOrdinals(f,f),consensusReference:null});
}finally{globalThis.Date=DateOriginal;}
const env={V7_DB:new D1()};
const saved=await api.persistC1PopulationReceipt(env,receipt);assert.equal(saved.readbackVerified,true);
const page=await api.readC1PopulationReceipt(env,{generationId:receipt.generationId,limit:2});
assert.equal(page.page.hasMore,false);
const parent={...page.header,rows:page.rows};
const built=await buildShadowCohort(parent),small=await buildShadowCohort(parent,{capPerStratum:1});
const symbols=(x,type)=>x.memberships.filter(m=>m.membershipType===type).map(m=>m.symbol).sort();
assert.deepEqual(symbols(built,'INDEPENDENT_BROAD_MARKET_CONTROL'),symbols(small,'INDEPENDENT_BROAD_MARKET_CONTROL'));
assert.deepEqual(built.parent.firstFailureCounts,small.parent.firstFailureCounts);
assert.ok(built.memberships.some(m=>m.membershipType==='SELECTED'&&symbols(built,'INDEPENDENT_BROAD_MARKET_CONTROL').includes(m.symbol)));
assert.ok(symbols(built,'RESIDUAL_CONTROL').length>0);
assert.ok(symbols(built,'RESIDUAL_CONTROL').every(s=>parent.rows.find(r=>r.symbol===s).formalResult.firstFailure==='市值資料不足'));
assert.ok(built.memberships.filter(m=>m.membershipType.startsWith('LIQ_')).length>0);
assert.ok(built.memberships.every(m=>m.outcomeSelected===false&&m.actualFormalRank===false&&m.sourceQualityState==='UNKNOWN'));
assert.equal(built.parent.economicSuperiority,'UNKNOWN');assert.equal(built.parent.formalOptimizationCandidate,'NONE');
assert.equal(built.memberships.find(m=>m.membershipType==='SELECTED').liquidity.volumeThresholdRatio,1.5);
const reversed={...parent,rows:[...parent.rows].reverse()};reversed.contentDigest=sha(JSON.stringify(reversed.rows));
assert.deepEqual(symbols(await buildShadowCohort(reversed),'INDEPENDENT_BROAD_MARKET_CONTROL'),symbols(built,'INDEPENDENT_BROAD_MARKET_CONTROL'));
const missing=structuredClone(parent);missing.rows[0].formalResult.actualRankingTuple.rewardPerRisk=null;missing.contentDigest=sha(JSON.stringify(missing.rows));
await assert.rejects(()=>buildShadowCohort(missing),/QUALIFIED_ACTUAL_TUPLE_REQUIRED/);
await assert.rejects(()=>buildShadowCohort({...parent,shadowMembershipCapture:null}),/NO_BACKFILL/);
const near=structuredClone(parent);
for(const [i,r] of near.rows.entries()){
 r.formalResult={ok:false,basePassed:true,selected:false,firstFailure:'不符合A拉回承接/B突破後承接'};
 r.membershipSetup={A:Object.fromEntries(['a','b','c','d','e','f'].map((k,j)=>[k,j!==i%6])),B:Object.fromEntries(['a','b','c','d','e','f'].map(k=>[k,false]))};
}
near.contentDigest=sha(JSON.stringify(near.rows));const nearBuilt=await buildShadowCohort(near,{capPerStratum:1});
assert.equal(nearBuilt.parent.frameCounts.filter(s=>s.membershipType==='CHANNEL_NEAR_MISS').length,6);
assert.equal(nearBuilt.memberships.filter(m=>m.membershipType==='CHANNEL_NEAR_MISS').length,6);
const absent=structuredClone(parent);absent.rows[10].feature.avgVolume20Lots=0;
for(const k of ['avgAmount20','spreadPercent','orderBookDepthGood','depthScore'])absent.rows[10].feature[k]=null;
absent.contentDigest=sha(JSON.stringify(absent.rows));const absentBuilt=await buildShadowCohort(absent);
const incomplete=absentBuilt.memberships.find(m=>m.symbol===absent.rows[10].symbol);
assert.equal(incomplete.liquidity.avgVolume20Lots,0);assert.equal(incomplete.liquidity.liquidityExceptionPass,null);
assert.equal(incomplete.liquidity.exceptionInputCoverageState,'ABSENT');

const persisted=await persistShadowCohort(env.V7_DB,receipt.generationId);assert.equal(persisted.readbackVerified,true);
assert.equal((await persistShadowCohort(env.V7_DB,receipt.generationId)).deduplicated,true);
await Promise.all([persistShadowCohort(env.V7_DB,receipt.generationId),persistShadowCohort(env.V7_DB,receipt.generationId)]);
let output=await readShadowCohort(env.V7_DB,{generationId:receipt.generationId,limit:100});
assert.deepEqual(output.header,built.parent);assert.deepEqual(output.rows,built.memberships);
const first=built.memberships[0];
const quality={generationId:receipt.generationId,symbol:first.symbol,membershipType:first.membershipType,parentSnapshotHash:first.parentSnapshotHash,
 qualityRuleId:'FIXTURE_QA',observedAt:day+'T11:00:00Z',state:'SOURCE_QUALITY_BLOCKED',reasonCode:'MISSING_PROVENANCE'};
const inserted=await appendShadowQuality(env.V7_DB,quality);assert.equal(inserted.readbackVerified,true);
assert.equal((await appendShadowQuality(env.V7_DB,quality)).deduplicated,true);
await assert.rejects(()=>appendShadowQuality(env.V7_DB,{...quality,state:'VALID'}),/QUALITY_PROVENANCE_CONFLICT/);
await assert.rejects(()=>appendShadowQuality(env.V7_DB,{...quality,parentSnapshotHash:'0'.repeat(64)}),/QUALITY_PARENT_OR_PIT/);
await assert.rejects(()=>appendShadowQuality(env.V7_DB,{...quality,observedAt:'2099-01-01T00:00:00Z'}),/QUALITY_TIME_OR_STATE/);
const frozenPage=await readShadowCohort(env.V7_DB,{generationId:receipt.generationId,limit:1});
await appendShadowQuality(env.V7_DB,{...quality,qualityRuleId:'FIXTURE_QA_2',state:'UNKNOWN'});
const frozenNext=await readShadowCohort(env.V7_DB,{generationId:receipt.generationId,cursor:1,limit:1,qualityWatermark:frozenPage.qualitySnapshot.watermark});
assert.deepEqual(frozenNext.qualitySnapshot,frozenPage.qualitySnapshot,'later append must not leak into pinned pagination');
await assert.rejects(()=>readShadowCohort(env.V7_DB,{generationId:receipt.generationId,cursor:1}),/WATERMARK_REQUIRED/);
const parentBefore=JSON.stringify(await readShadowCohort(env.V7_DB,{generationId:receipt.generationId,limit:100}));
// Same date, different C1 generation conflicts without erasing the first-known generation.
const other=structuredClone(receipt);other.generationId+=':rerun';delete other.zeroPickCapture;
for(const r of other.rows)delete r.zeroPickRankObservation;
await api.persistC1PopulationReceipt(env,other);
await assert.rejects(()=>persistShadowCohort(env.V7_DB,other.generationId),/PROVENANCE_CONFLICT/);
assert.equal(JSON.stringify(await readShadowCohort(env.V7_DB,{generationId:receipt.generationId,limit:100})),parentBefore);
// Inject a transactional write failure on a different date. Prior complete generation remains exact.
const failed=structuredClone(other);failed.generationId+=':failure';failed.sessionDate='2026-10-01';failed.decisionAt='2026-10-01T10:00:00Z';
await api.persistC1PopulationReceipt(env,failed);env.V7_DB.fail=sql=>sql.includes('INSERT INTO trade_research_candidate_memberships');
await assert.rejects(()=>persistShadowCohort(env.V7_DB,failed.generationId),/WRITE_FAILED/);env.V7_DB.fail=null;
assert.equal(env.V7_DB.db.prepare('SELECT count(*) AS n FROM trade_research_population_receipts WHERE scan_date=?').get(failed.sessionDate).n,0);
assert.equal(JSON.stringify(await readShadowCohort(env.V7_DB,{generationId:receipt.generationId,limit:100})),parentBefore);
// Fail open to the established C1 save and Formal execution even if overlay persistence fails.
const safe=await api.persistCompletedC1Safe(env,other,day,{selectionVerified:true,now:Date.parse(stamp)});
assert.equal(safe.saveOk,true);assert.equal(safe.shadowCohort.status,'DATA_QUALITY_BLOCKED');
assert.equal((await api.persistCompletedC1Safe(env,receipt,day,{selectionVerified:true,now:Date.parse('2026-10-03T10:00:00Z')})).reason,'NON_PROSPECTIVE_SESSION_CAPTURE');

const adapted=adaptC1PopulationPages([page]);
const diagnosis=diagnosePopulation({...adapted});const calls=[];
const request=async(url,options)=>{
 assert.equal(options.method,'GET');calls.push(String(url));const u=new URL(url);
 return {ok:true,status:200,json:()=>readShadowCohort(env.V7_DB,{generationId:u.searchParams.get('generationId'),
   cursor:u.searchParams.get('cursor'),limit:3,qualityWatermark:u.searchParams.get('qualityWatermark')})};
};
const evidence=await collectShadowCohortEvidence({pages:[page],diagnosis,origin:'https://fixture.invalid',headers:{},request});
assert.equal(evidence.status,'VERIFIED',evidence.error);assert.deepEqual(evidence.memberships,built.memberships);
assert.deepEqual(evidence.independentGateEvidence,diagnosis.observations);assert.equal(evidence.quality.length,2);
assert.equal(evidence.eligibleForInference,false);assert.ok(calls.length>1);
const badRequest=async(url,options)=>{const r=await request(url,options),v=await r.json();v.rows[0].parentSnapshotHash='0'.repeat(64);return {...r,json:async()=>v};};
assert.equal((await collectShadowCohortEvidence({pages:[page],diagnosis,origin:'https://fixture.invalid',headers:{},request:badRequest})).status,'DATA_QUALITY_BLOCKED');
const oldPage=structuredClone(page);delete oldPage.header.shadowMembershipCapture;
assert.equal((await collectShadowCohortEvidence({pages:[oldPage],request:()=>{throw Error('legacy cannot call new endpoint');}})).status,'LEGACY_NO_SHADOW_MEMBERSHIP_CAPTURE');
for(const path of ['/api/research/shadow-cohort','/api/research/shadow-cohort-quality']){
 const response=await api.default.fetch(new Request('https://fixture.invalid'+path),{ADMIN_TOKEN:'fixture-secret'},{});
 assert.equal(response.status,401);
}

const readResponse=await api.default.fetch(new Request('https://fixture.invalid/api/research/shadow-cohort?generationId='+encodeURIComponent(receipt.generationId),
 {headers:{'x-admin-token':'fixture-secret'}}),{...env,ADMIN_TOKEN:'fixture-secret'},{});
assert.equal(readResponse.status,200);assert.equal((await readResponse.json()).header.captureGeneration,receipt.generationId);
const appendResponse=await api.default.fetch(new Request('https://fixture.invalid/api/research/shadow-cohort-quality',
 {method:'POST',headers:{'x-admin-token':'fixture-secret','content-type':'application/json'},body:JSON.stringify(quality)}),{...env,ADMIN_TOKEN:'fixture-secret'},{});
assert.equal(appendResponse.status,200);assert.equal((await appendResponse.json()).deduplicated,true);
const wrongMethod=await api.default.fetch(new Request('https://fixture.invalid/api/research/shadow-cohort',
 {method:'POST',headers:{'x-admin-token':'fixture-secret'}}),{...env,ADMIN_TOKEN:'fixture-secret'},{});
assert.equal(wrongMethod.status,405);

// Execute the actual selector on frozen same-scan inputs, including research failure injection.
const stub='buildEligibleMarketFeature=stock=>({...stock.fixture});';
const before=await load(baseline,'',stub),after=await load(source,'',stub);
const broken=await load(source,'',stub+'\nSHADOW_MEMBERSHIP.captureShadowFormalRanking=()=>{throw Error("fixture capture failure")};');
let providerCalls=0;const originalFetch=globalThis.fetch;
globalThis.fetch=()=>{providerCalls++;throw Error('external provider forbidden');};
globalThis.Date=FixtureDate;
try{
 for(const rejectAll of [false,true]){
 const features=f.slice(0,10).map(x=>({...x,...(rejectAll?{marketCapYi:1}:{})}));
 const args=()=>[{stocks:Object.fromEntries(features.map(x=>[x.symbol,{symbol:x.symbol,fixture:x}]))},features,
  {V7_OFFICIAL_INDEX:{asOfDate:day,return20:2,history:[{date:'2026-09-02',close:100},{date:day,close:102}]},
   V7_MARKET_CONSENSUS:{marketDate:day,updatedAt:day+'T09:00:00Z',bySymbol:{[features[0].symbol]:{sourceCount:3}}}},day];
 const formal=x=>{const {c1PopulationReceipt,c1CaptureError,...rest}=x;return rest;};
 const a=before.selectTomorrowCandidates(...args()),b=after.selectTomorrowCandidates(...args());
 assert.deepEqual(formal(b),formal(a));assert.deepEqual(formal(broken.selectTomorrowCandidates(...args())),formal(a));
 assert.equal(b.candidates.length,rejectAll?0:6);
 for(const r of b.c1PopulationReceipt.rows.filter(r=>r.formalResult.ok)){
   assert.equal(r.formalResult.actualRankingTuple.priorityScore,r.formalResult.priorityScore);
   assert.ok(SHADOW_RANK_FIELDS.every(k=>Number.isFinite(r.formalResult.actualRankingTuple[k])));
 }
 }
}finally{globalThis.fetch=originalFetch;globalThis.Date=DateOriginal;}
assert.equal(providerCalls,0);
const scales=[];
for(const [index,n] of [500,1000,2000].entries()){
 const scaleDay=['2026-09-28','2026-09-29','2026-09-30'][index];fixtureStamp=scaleDay+'T10:00:00.000Z';
 const features=Array.from({length:n},(_,i)=>feature(String(10000+i),i%2?1200:100));
 const results=new Map(features.map(row=>[row.symbol,{ok:true,basePassed:true,rrPassed:true,
   ...Object.fromEntries(SHADOW_RANK_FIELDS.map(k=>[k,71.2345678])),marketConsensusSources:3,marketConsensusBonus:4}]));
 let draft;globalThis.Date=FixtureDate;
 try{draft=api.buildC1PopulationReceipt(features,features,{stocks:{}},sector,results,features.slice(0,6),scaleDay,
   {ordinals:api.c1ZeroPickOrdinals(features,features),consensusReference:null});}finally{globalThis.Date=DateOriginal;}
 const start=Date.now();await api.persistC1PopulationReceipt(env,draft);
 const capture=await persistShadowCohort(env.V7_DB,draft.generationId);
 assert.equal(capture.readbackVerified,true);
 const stored=await loadShadowC1Parent(env.V7_DB,draft.generationId),b=await buildShadowCohort(stored);
 const size=new TextEncoder().encode(JSON.stringify(b)).byteLength,c1Bytes=new TextEncoder().encode(JSON.stringify(stored)).byteLength;
 const chunks=env.V7_DB.db.prepare('SELECT rows_json FROM trade_research_c1_chunks WHERE generation_id=?').all(draft.generationId);
 const maxChunkBytes=Math.max(...chunks.map(c=>new TextEncoder().encode(c.rows_json).byteLength));
 assert.ok(c1Bytes<10000000);assert.ok(size<10000000);assert.ok(maxChunkBytes<=90000);
 assert.ok(new TextEncoder().encode(JSON.stringify(b.parent)).byteLength<=90000);
 scales.push({rows:n,memberships:b.memberships.length,c1Bytes,maxChunkBytes,overlayBytes:size,elapsedMs:Date.now()-start});
}

const report={ok:true,fixtureOnly:true,formalCoreImpact:false,protectedRuntimeByteIdentical:true,legacyShadowByteIdentical:true,
 providerCallDelta:providerCalls,atomicFailurePreservesPrior:true,firstKnownGenerationPreserved:true,qualityAppendOnly:true,
 pinnedQualityPagination:true,collectorSameParent:true,economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE',scales};
fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/system1-shadow-cohort-v8-17-0.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
