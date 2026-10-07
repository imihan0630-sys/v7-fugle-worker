import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {createHash} from 'node:crypto';
import {captureValuationSourceVintage,attachValuationSourceVintage,finalizeValuationSourceVintage,verifyValuationSourceVintage} from '../research/system1_valuation_source_vintage_v0_1.mjs';
import {collectValuationSourceVintageEvidence} from '../research/system1_valuation_source_vintage_collection_v0_1.mjs';
import {adaptC1PopulationPages,diagnosePopulation} from '../research/system1_selection_isolated_v0_1.mjs';
import {persistShadowCohort} from '../research/system1_shadow_cohort_storage_v0_1.mjs';
const sha=s=>createHash('sha256').update(s).digest('hex');
const baseline=fs.readFileSync('artifacts/Worker-before-v8_18_0.mjs','utf8');
const sourcePath=fs.existsSync('artifacts/Worker-before-v8_19_0.mjs')?'artifacts/Worker-before-v8_19_0.mjs':(process.env.V7_TEST_WORKER_PATH||'Worker.js');
const source=fs.readFileSync(sourcePath,'utf8');
function body(s,name){const start=s.indexOf('function '+name+'('),end=s.indexOf('\n}',start)+2;assert.ok(start>=0&&end>start);return s.slice(start,end);}
const changed=['runAfterMarketScanCore','selectTomorrowCandidates','buildC1PopulationReceipt','persistC1PopulationReceipt','verifyC1StoredGeneration'];
let normalized=source.replace('8.18.0-valuation-source-vintage','8.17.0-shadow-cohort-membership')
 .replace(/\n\/\/ BEGIN V8\.18 VALUATION SOURCE VINTAGE[\s\S]*?\/\/ END V8\.18 VALUATION SOURCE VINTAGE\n/,'');
for(const name of changed)normalized=normalized.replace(body(normalized,name),body(baseline,name));
assert.equal(sha(normalized),sha(baseline),'all other Formal/legacy runtime byte-identical');
assert.equal(body(source,'selectTomorrowCandidates').replace(',env.V7_VALUATION_SOURCE_VINTAGE);',');'),body(baseline,'selectTomorrowCandidates'));
assert.equal(body(source,'runAfterMarketScanCore').replace(/  \/\/ BEGIN V8\.18 REQUEST SOURCE CAPTURE[\s\S]*?  \/\/ END V8\.18 REQUEST SOURCE CAPTURE\n/,'').replace(', V7_VALUATION_SOURCE_VINTAGE:valuationSourceVintageContext',''),body(baseline,'runAfterMarketScanCore'));
for(const path of ['v7-regression.yml','v7-repair-ci.yml','v7-cloudflare.yml']){
 const workflow=fs.readFileSync('.github/workflows/'+path,'utf8');
 const chain=[...workflow.matchAll(/python3 (scripts\/apply_v8_[\d_]+\.py)/g)].map(m=>m[1]);
 assert.equal(chain.filter(x=>x==='scripts/apply_v8_18_0.py').length,1);
 assert.equal(chain.indexOf('scripts/apply_v8_18_0.py'),chain.indexOf('scripts/apply_v8_17_0.py')+1);
 if(chain.includes('scripts/apply_v8_21_0.py')){
   assert.equal(chain.indexOf('scripts/apply_v8_19_0.py'),chain.indexOf('scripts/apply_v8_18_0.py')+1);
   assert.equal(chain.indexOf('scripts/apply_v8_20_0.py'),chain.indexOf('scripts/apply_v8_19_0.py')+1);
   assert.equal(chain.indexOf('scripts/apply_v8_21_0.py'),chain.indexOf('scripts/apply_v8_20_0.py')+1);
   assert.ok(workflow.includes('const VERSION = \"8.21.0-c1-generation-set-finalization\";'),path+' V8.21 exact candidate version guard');
 } else if(chain.includes('scripts/apply_v8_20_0.py')){
   assert.equal(chain.indexOf('scripts/apply_v8_19_0.py'),chain.indexOf('scripts/apply_v8_18_0.py')+1);
   assert.equal(chain.indexOf('scripts/apply_v8_20_0.py'),chain.indexOf('scripts/apply_v8_19_0.py')+1);
   assert.ok(workflow.includes('const VERSION = \"8.20.0-formal-c1-binding-ledger\";'),path+' V8.20 exact candidate version guard');
 } else if(chain.includes('scripts/apply_v8_19_0.py')){
   assert.equal(chain.indexOf('scripts/apply_v8_19_0.py'),chain.indexOf('scripts/apply_v8_18_0.py')+1);
   assert.ok(workflow.includes('const VERSION = \"8.19.1-pve250-runtime-remediation\";'),path+' latest exact candidate version guard');
 } else {
   assert.ok(workflow.includes('const VERSION = \"8.18.0-valuation-source-vintage\";'),path+' V8.18 exact candidate version guard');
 }
}
const exports='buildC1PopulationReceipt,persistC1PopulationReceipt,readC1PopulationReceipt,persistCompletedC1Safe,c1ZeroPickOrdinals,selectTomorrowCandidates';
const load=(s,extra='',stub='')=>import('data:text/javascript;base64,'+Buffer.from(s+'\n'+stub+'\nexport {'+exports+extra+'};').toString('base64'));
const api=await load(source,',VALUATION_VINTAGE');
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

const features=Array.from({length:10},(_,i)=>feature(String(2000+i),i%2?1200:100));
const payloads=rows=>({scanDate:day,captureObservedAt:stamp,
 valuation:{asOfDate:day,stocks:Object.fromEntries(rows.map(f=>[f.symbol,{valuationDate:day,valuationSource:'TWSE正式日估值',valuationObserved:true,priceEarningsRatio:f.priceEarningsRatio,priceBookRatio:f.priceBookRatio}]))},
 financial:{asOfDate:day,year:2026,quarter:2,stocks:Object.fromEntries(rows.map(f=>[f.symbol,{revenueQuarterYoY:f.revenueQuarterYoY,epsYoY:f.epsYoY}]))},
 quarterEps:{asOfDate:day,year:2026,quarter:2,stocks:Object.fromEntries(rows.map(f=>[f.symbol,{epsYoY:f.epsYoY,quarterEpsYear:2026,quarterEpsQuarter:2,quarterEpsSource:'https://mopsov.twse.com.tw/mops/web/ajax_t164sb04'}]))}});
const input=payloads(features),context=await captureValuationSourceVintage(input);
assert.equal(Object.isFrozen(context),true);
const reverse=JSON.parse(JSON.stringify(input));reverse.valuation.stocks=Object.fromEntries(Object.entries(reverse.valuation.stocks).reverse());
assert.equal((await captureValuationSourceVintage(reverse)).sources.valuation.contentDigest,context.sources.valuation.contentDigest,'object insertion order not digest order');
reverse.valuation.stocks[features[0].symbol].priceEarningsRatio=0;
assert.notEqual((await captureValuationSourceVintage(reverse)).sources.valuation.contentDigest,context.sources.valuation.contentDigest,'same-asOf changed content changes digest');
assert.equal(context.symbols[features[0].symbol].pe,18,'frozen snapshot cannot be repaired by later payload mutation');
input.valuation.stocks[features[0].symbol].priceEarningsRatio=77;assert.equal(context.symbols[features[0].symbol].pe,18);
const unused=payloads(features);unused.quarterEps.quarter=1;
const unusedContext=await captureValuationSourceVintage(unused);assert.equal(unusedContext.sources.quarterEps.applied,false);assert.equal(unusedContext.symbols[features[0].symbol].epsOrigin,'FINANCIAL');
const sector={Steel:{score:70,breadth:70,avgChange:1,amountVs20DayAverage:1}};
const make=(rows,ctx=context)=>{globalThis.Date=FixtureDate;try{return api.buildC1PopulationReceipt(rows,rows,{stocks:{}},sector,new Map(rows.map(f=>[f.symbol,{ok:true,basePassed:true,rrPassed:true,priorityScore:71.2345678,rewardPerRisk:71.2345678,marketConsensusScore:71.2345678,setupQuality:71.2345678,sectorFlow:71.2345678,relativeStrength:71.2345678}])),rows.slice(0,6),day,{ordinals:api.c1ZeroPickOrdinals(rows,rows),consensusReference:null},ctx);}finally{globalThis.Date=DateOriginal;}};
let receipt=make(features);assert.equal(receipt.valuationSourceVintage.officialFirstKnownAt,null);
assert.equal(receipt.rows[0].valuationProvenance.sourceKnownByDecisionAt,true);
assert.equal(receipt.rows[0].sectorMedianPeProvenance.positivePePeerCount,10);
assert.equal((await verifyValuationSourceVintage(await finalizeValuationSourceVintage(receipt))).completeSourceRows,10);
const future=await captureValuationSourceVintage({...payloads(features),captureObservedAt:'2099-01-01T00:00:00Z'});
assert.equal(make(features,future).valuationSourceVintage.status,'DATA_QUALITY_BLOCKED');
assert.equal(make(features,{...context,scanDate:'2026-10-01'}).valuationSourceVintage.status,'DATA_QUALITY_BLOCKED');
const missing=payloads(features);delete missing.valuation.stocks[features[0].symbol].valuationDate;missing.quarterEps=null;
const miss=make(features,await captureValuationSourceVintage(missing));assert.equal(miss.rows[0].valuationProvenance.sourceKnownByDecisionAt,null);assert.equal(miss.valuationSourceVintage.quarterEps.contentDigest,null);
const zeros=features.map(f=>({...f,priceEarningsRatio:0,priceBookRatio:0,revenueQuarterYoY:0,epsYoY:0}));
const zr=make(zeros,await captureValuationSourceVintage(payloads(zeros)));assert.equal(zr.rows[0].valuationProvenance.sourceKnownByDecisionAt,true);assert.equal(zr.rows[0].sectorMedianPeProvenance.positivePePeerCount,0);
const cyc=payloads(features);cyc.valuation.circular=cyc.valuation;
assert.equal((await captureValuationSourceVintage(cyc)).status,'DATA_QUALITY_BLOCKED');
const futureAsOf=payloads(features);futureAsOf.valuation.asOfDate='2099-01-01';
assert.equal(make(features,await captureValuationSourceVintage(futureAsOf)).valuationSourceVintage.status,'DATA_QUALITY_BLOCKED');
const futureRow=payloads(features);futureRow.valuation.stocks[features[0].symbol].valuationDate='2099-01-01';
assert.equal(make(features,await captureValuationSourceVintage(futureRow)).rows[0].valuationProvenance.sourceKnownByDecisionAt,null);
const cryptoDescriptor=Object.getOwnPropertyDescriptor(globalThis,'crypto');
let digestFailure;
try{Object.defineProperty(globalThis,'crypto',{configurable:true,value:{subtle:{digest(){throw Error('fixture digest failure');}}}});
 assert.equal((await captureValuationSourceVintage(payloads(features))).status,'DATA_QUALITY_BLOCKED');
 digestFailure=await finalizeValuationSourceVintage(receipt);
}finally{Object.defineProperty(globalThis,'crypto',cryptoDescriptor);}
assert.equal(digestFailure.valuationSourceVintage.status,'DATA_QUALITY_BLOCKED');assert.equal((await verifyValuationSourceVintage(digestFailure)).status,'DATA_QUALITY_BLOCKED');
const oversize=structuredClone(receipt);oversize.valuationSourceVintage.valuation.padding='x'.repeat(90001);
const bounded=await finalizeValuationSourceVintage(oversize);assert.equal(bounded.valuationSourceVintage.status,'DATA_QUALITY_BLOCKED');assert.ok(bounded.rows.every(r=>!r.valuationProvenance));
assert.equal((await verifyValuationSourceVintage(bounded)).status,'DATA_QUALITY_BLOCKED');
const env={V7_DB:new D1()};
const saved=await api.persistC1PopulationReceipt(env,receipt);assert.equal(saved.readbackVerified,true);
assert.equal((await api.persistC1PopulationReceipt(env,receipt)).deduplicated,true);
const pages=[];let cursor=0;do{const p=await api.readC1PopulationReceipt(env,{generationId:receipt.generationId,cursor,limit:2});pages.push(p);cursor=p.page.nextCursor;}while(cursor!==null);
assert.equal((await collectValuationSourceVintageEvidence(pages)).status,'SELECTION_TIME_SOURCE_VINTAGE_CAPTURED');
const parent={...pages[0].header,rows:pages.flatMap(p=>p.rows)};
const corrupt=structuredClone(parent);corrupt.valuationSourceVintage.valuation.contentDigest='0'.repeat(64);
await assert.rejects(()=>verifyValuationSourceVintage(corrupt),/ROOT_DIGEST/);
const other=structuredClone(receipt);other.valuationSourceVintage.captureRequestId='different';await assert.rejects(()=>api.persistC1PopulationReceipt(env,other),/IMMUTABLE_GENERATION_CONFLICT/);
await assert.rejects(()=>finalizeValuationSourceVintage({...receipt,effectiveRuntimeVersion:'8.17.0-shadow-cohort-membership'}),/LEGACY_NO_BACKFILL/);
const legacy=structuredClone(parent);delete legacy.valuationSourceVintage;
for(const r of legacy.rows){delete r.valuationProvenance;delete r.sectorMedianPeProvenance;delete r.valuationSourceVintageDigest;}
await assert.rejects(()=>verifyValuationSourceVintage(legacy),/CAPTURE_MISSING/);
legacy.effectiveRuntimeVersion='8.17.0-shadow-cohort-membership';
assert.equal((await verifyValuationSourceVintage(legacy)).status,'LEGACY_NO_SOURCE_VINTAGE');
const legacyPages=structuredClone(pages);legacyPages[0].header.valuationSourceVintage=null;
assert.equal((await collectValuationSourceVintageEvidence(legacyPages)).status,'DATA_QUALITY_BLOCKED');
const originalHeader=env.V7_DB.db.prepare('SELECT header_json FROM trade_research_c1_generations WHERE generation_id=?').get(receipt.generationId).header_json;
env.V7_DB.db.prepare('UPDATE trade_research_c1_generations SET header_json=? WHERE generation_id=?').run(JSON.stringify({...JSON.parse(originalHeader),valuationSourceVintage:corrupt.valuationSourceVintage}),receipt.generationId);
await assert.rejects(()=>api.readC1PopulationReceipt(env,{generationId:receipt.generationId}),/ROOT_DIGEST/);
env.V7_DB.db.prepare('UPDATE trade_research_c1_generations SET header_json=? WHERE generation_id=?').run(originalHeader,receipt.generationId);
assert.equal((await persistShadowCohort(env.V7_DB,receipt.generationId)).readbackVerified,true,'same C1 remains usable by shared membership');
const d1Failure=make(features);env.V7_DB.fail=sql=>sql.includes('INSERT INTO trade_research_c1_chunks');
const failedSave=await api.persistCompletedC1Safe(env,d1Failure,day,{selectionVerified:true,now:Date.parse(stamp)});env.V7_DB.fail=null;assert.equal(failedSave.saveOk,false);
assert.equal((await api.readC1PopulationReceipt(env,{generationId:receipt.generationId})).header.contentDigest,saved.contentDigest,'failed transaction preserves prior immutable evidence');
// C1 diagnosis values and Formal selector output are independent of source metadata.
const adapted=adaptC1PopulationPages(pages),d=diagnosePopulation(adapted);
assert.equal(d.populationN,features.length);
const cleanPages=structuredClone(pages);for(const p of cleanPages){delete p.header.valuationSourceVintage;for(const c of p.chunks)for(const r of c.rows){delete r.valuationProvenance;delete r.sectorMedianPeProvenance;delete r.valuationSourceVintageDigest;}}
const cleanDigest=sha(JSON.stringify(cleanPages.flatMap(p=>p.chunks).flatMap(c=>c.rows)));for(const p of cleanPages)p.header.contentDigest=cleanDigest;
assert.deepEqual(diagnosePopulation(adaptC1PopulationPages(cleanPages)),d,'unchanged structural C1/Formal diagnosis');
const stub='buildEligibleMarketFeature=stock=>({...stock.fixture});';
const before=await load(baseline,'',stub),after=await load(source,'',stub);
const broken=await load(source,'',stub+'\nVALUATION_VINTAGE.attachValuationSourceVintage=()=>{throw Error("fixture capture failure")};');
let providerCalls=0;const oldFetch=globalThis.fetch;globalThis.fetch=()=>{providerCalls++;throw Error('provider forbidden');};globalThis.Date=FixtureDate;
try{for(const rejectAll of [false,true]){
 const f=features.map(x=>({...x,...(rejectAll?{marketCapYi:1}:{})}));
 const args=()=>[{stocks:Object.fromEntries(f.map(x=>[x.symbol,{symbol:x.symbol,fixture:x}]))},f,{V7_OFFICIAL_INDEX:{asOfDate:day,return20:2,history:[{date:'2026-09-02',close:100},{date:day,close:102}]},V7_VALUATION_SOURCE_VINTAGE:context},day];
 const formal=x=>{const {c1PopulationReceipt,c1CaptureError,...rest}=x;return rest;};
 const a=before.selectTomorrowCandidates(...args()),b=after.selectTomorrowCandidates(...args());
 assert.deepEqual(formal(b),formal(a));assert.deepEqual(formal(broken.selectTomorrowCandidates(...args())),formal(a));assert.equal(b.candidates.length,rejectAll?0:6);
}}finally{globalThis.fetch=oldFetch;globalThis.Date=DateOriginal;}
assert.equal(providerCalls,0);
// Missing/digest failures block research but C1 safe persistence never changes Formal.
const bad=make(features,null);const safe=await api.persistCompletedC1Safe(env,bad,day,{selectionVerified:true,now:Date.parse(stamp)});assert.equal(safe.saveOk,true);
const scales=[];
for(const n of [500,1000,2000]){
 const rows=Array.from({length:n},(_,i)=>feature(String(10000+i),i%2?1200:100));
 const start=Date.now(),ctx=await captureValuationSourceVintage(payloads(rows)),draft=make(rows,ctx),db=env;
 await api.persistC1PopulationReceipt(db,draft);const ps=[];let c=0;
 do{const p=await api.readC1PopulationReceipt(db,{generationId:draft.generationId,cursor:c,limit:2});ps.push(p);c=p.page.nextCursor;}while(c!==null);
 assert.equal((await collectValuationSourceVintageEvidence(ps)).completeSourceRows,n);
 const changedPages=structuredClone(ps);changedPages.at(-1).header.valuationSourceVintage.captureRequestId+='x';
 assert.equal((await collectValuationSourceVintageEvidence(changedPages)).status,'DATA_QUALITY_BLOCKED');
 const stored={...ps[0].header,rows:ps.flatMap(p=>p.rows)},bytes=Buffer.byteLength(JSON.stringify(stored));
 const maxChunkBytes=Math.max(...ps.flatMap(p=>p.chunks).map(c=>Buffer.byteLength(JSON.stringify(c.rows))));
 assert.ok(maxChunkBytes<=90000);assert.ok(bytes<10000000,`receipt ${n} bytes ${bytes}`);
 const newOnlyBytes=Buffer.byteLength(JSON.stringify(stored.valuationSourceVintage))+stored.rows.reduce((n,r)=>n+Buffer.byteLength(JSON.stringify({valuationProvenance:r.valuationProvenance,sectorMedianPeProvenance:r.sectorMedianPeProvenance,valuationSourceVintageDigest:r.valuationSourceVintageDigest})),0);
 scales.push({rows:n,bytes,newProvenanceBytes:newOnlyBytes,maxChunkBytes,headerBytes:Buffer.byteLength(JSON.stringify(ps[0].header)),elapsedMs:Date.now()-start});
}
const report={ok:true,fixtureOnly:true,protectedRuntimeByteIdentical:true,selectorCaptureOnlyParity:true,selectedSymbolsParity:true,plansCapitalParity:true,signalStateParity:true,fifteenMinuteParity:true,pushParity:true,orderParity:true,providerCallDelta:providerCalls,changedFunctions:changed,digestDeterministic:true,immutableConflictDetection:true,readbackVerified:true,officialFirstKnownState:'NOT_PROVEN',promotionGradeOutcomeJoin:false,scales};
fs.writeFileSync('artifacts/system1-valuation-source-vintage-v8-18-0.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
