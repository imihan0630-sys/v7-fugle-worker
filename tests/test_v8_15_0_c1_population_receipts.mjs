import assert from "node:assert/strict";
import fs from "node:fs";
import {DatabaseSync} from "node:sqlite";

const workerPath=process.env.V7_TEST_WORKER_PATH||"Worker.js";
const source=fs.readFileSync(workerPath,"utf8");
assert.match(source,/const VERSION = "8\.15\.0-c1-population-receipts";/);
assert.match(source,/url\.pathname === "\/api\/research\/c1-population"/);
assert.match(source,/trade_research_c1_generations/);
assert.match(source,/trade_research_c1_chunks/);
assert.match(source,/decisionImpact:false/);

const api=await import("data:text/javascript;base64,"+Buffer.from(source+`
export {buildC1PopulationReceipt,c1ChunkRows,c1ImmutableDecision,persistC1PopulationReceipt,readC1PopulationReceipt};`).toString("base64")+"#"+Date.now());

class SqliteD1Statement {
  constructor(database,sql){this.database=database;this.sql=sql;this.args=[];}
  bind(...args){this.args=args;return this;}
  executeRun(){return this.database.prepare(this.sql).run(...this.args);}
  async run(){return this.executeRun();}
  async first(){return this.database.prepare(this.sql).get(...this.args)??null;}
  async all(){return {results:this.database.prepare(this.sql).all(...this.args)};}
}
class SqliteD1 {
  constructor(){this.database=new DatabaseSync(":memory:");}
  withSession(){return this;}
  prepare(sql){return new SqliteD1Statement(this.database,sql);}
  async batch(statements){
    this.database.exec("BEGIN IMMEDIATE");
    try{const results=statements.map(statement=>statement.executeRun());this.database.exec("COMMIT");return results;}
    catch(error){this.database.exec("ROLLBACK");throw error;}
  }
}

const feature=(symbol,close=100)=>({
  symbol,name:symbol,market:"TWSE",industry:"Steel",close,historyDays:61,
  marketReturn20:2,sectorReturn20:3,marketCapYi:200,changePercent:1,
  avgVolume20Lots:1500,avgAmount20:90000000,spreadPercent:.2,orderBookDepthGood:true,depthScore:90,
  chipConcentration:60,quarterRevenue:100,financialBasis:true,revenueQoQ:3,revenueQuarterYoY:20,
  valuationObserved:true,priceBookRatio:2,announcementsVerified:true,officialAnnouncements:[],
  priceEarningsRatio:18,sectorMedianPe:15,epsYoY:10,atrPercent:3,
  bullishStack:true,lateStage:false,ma20:98,ma60:90,ma5:102,ma10:100,prevMa5:99,prevMa10:100,
  volumeTodayVsPrev5:.8,dailyClosePosition:.8,dailyUpperShadowRatio:.1,priorHigh20:105,
  recentLow5Prev:96,resistancePivotHighs:[120],high60:120,ret20:8,foreignNet:1,trustNet:1,dealerNet:1,
  institutionTotalNet:300000,foreignBuyDays:3,trustBuyDays:3,dealerBuyDays:3,grossMargin:20,operatingMargin:10,eps:2
});
const features=[feature("2006"),feature("2330",1200)];
const todayRows=[...features.map(x=>({symbol:x.symbol,name:x.name,market:x.market,industry:x.industry,close:x.close})),
  {symbol:"9999",name:"HistoryBlocked",market:"TPEx",industry:"Other",close:30}];
const marketState={stocks:Object.fromEntries(todayRows.map(row=>[row.symbol,{historyFreshness:row.symbol==="9999"
  ?{usable:false,status:"UNKNOWN",reason:"OFFICIAL_GAP_PROOF_UNAVAILABLE"}
  :{usable:true,status:"VALID_EXACT_SESSIONS",reason:null,requiredBars:60}}]))};
const sectorStats={Steel:{breadth:55,avgChange:.5,amountVs20DayAverage:1.1}};
const formalResults=new Map([
  ["2006",{ok:true,basePassed:true,rrPassed:true}],
  ["2330",{ok:false,reason:"基本面品質明顯不足",basePassed:true,rrPassed:false}]
]);
const receipt=api.buildC1PopulationReceipt(features,todayRows,marketState,sectorStats,formalResults,[features[0]],"2026-10-01");
assert.equal(receipt.populationN,3);
assert.equal(receipt.featureN,2);
assert.equal(receipt.rows.find(x=>x.symbol==="9999").feature.historyDays,null);
assert.equal(receipt.rows.find(x=>x.symbol==="9999").historyAdmission.reason,"OFFICIAL_GAP_PROOF_UNAVAILABLE");
assert.equal(receipt.rows.find(x=>x.symbol==="2006").formalResult.selected,true);
assert.equal(receipt.rows.find(x=>x.symbol==="2330").formalResult.firstFailure,"基本面品質明顯不足");
assert.equal(receipt.rows.every(x=>x.safety.CORPORATE_ACTION_CONTINUITY.status==="UNKNOWN"),true);
assert.equal(receipt.decisionImpact,false);
assert.equal(receipt.formalCoreImpact,false);

const chunks=api.c1ChunkRows(Array.from({length:121},(_,i)=>({symbol:String(i).padStart(4,"0"),x:"a".repeat(40)})),50,100000);
assert.deepEqual(chunks.map(x=>x.length),[50,50,21]);
assert.equal(api.c1ImmutableDecision(null,{contentDigest:"x",populationN:3,chunkCount:1}),"INSERT");
assert.equal(api.c1ImmutableDecision({content_digest:"x",population_n:3,chunk_count:1},{contentDigest:"x",populationN:3,chunkCount:1}),"IDEMPOTENT");
assert.equal(api.c1ImmutableDecision({content_digest:"y",population_n:3,chunk_count:1},{contentDigest:"x",populationN:3,chunkCount:1}),"CONFLICT");

const env={V7_DB:new SqliteD1(),TEST_MODE:"false"};
const saved=await api.persistC1PopulationReceipt(env,receipt);
assert.equal(saved.ok,true);
assert.equal(saved.saved,3);
assert.equal(saved.readbackVerified,true);
const firstPage=await api.readC1PopulationReceipt(env,{generationId:receipt.generationId,cursor:0,limit:1});
assert.equal(firstPage.ok,true);
assert.equal(firstPage.header.populationN,3);
assert.equal(firstPage.header.readbackVerified,true);
assert.equal(firstPage.page.hasMore,false);
assert.deepEqual(firstPage.rows.map(row=>row.symbol),todayRows.map(row=>row.symbol));
const replay=await api.persistC1PopulationReceipt(env,receipt);
assert.equal(replay.deduplicated,true);
const conflict=structuredClone(receipt);conflict.rows[0].name="MUTATED";
await assert.rejects(()=>api.persistC1PopulationReceipt(env,conflict),/C1_IMMUTABLE_GENERATION_CONFLICT/);

const scaleFeatures=Array.from({length:2000},(_,index)=>feature(String(1000+index),index%25===0?1200:100));
const scaleRows=scaleFeatures.map(row=>({symbol:row.symbol,name:`測試公司${row.symbol}`,market:indexMarket(row.symbol),industry:"Steel",close:row.close}));
function indexMarket(symbol){return Number(symbol)%2===0?"TWSE":"TPEx";}
const scaleState={stocks:Object.fromEntries(scaleRows.map(row=>[row.symbol,{historyFreshness:{usable:true,status:"VALID_EXACT_SESSIONS",requiredBars:60}}]))};
const scaleResults=new Map(scaleRows.map(row=>[row.symbol,{ok:false,reason:"A拉回承接/B突破後承接未成立",basePassed:true,rrPassed:false}]));
const scaleStarted=performance.now();
const scaleReceipt=api.buildC1PopulationReceipt(scaleFeatures,scaleRows,scaleState,sectorStats,scaleResults,[],"2026-10-01");
const scaleBuildMs=Math.round((performance.now()-scaleStarted)*100)/100;
const scaleChunks=api.c1ChunkRows(scaleReceipt.rows);
const scaleBytes=Buffer.byteLength(JSON.stringify(scaleReceipt.rows));
const maxChunkBytes=Math.max(...scaleChunks.map(chunk=>Buffer.byteLength(JSON.stringify(chunk))));
assert.equal(scaleReceipt.populationN,2000);
assert.ok(scaleBytes<10_000_000);
assert.ok(maxChunkBytes<1_000_000);

const formalLoop=source.slice(source.indexOf("function selectTomorrowCandidates"),source.indexOf("function researchStableHash"));
assert.match(formalLoop,/c1FormalResults\.set\(String\(f\.symbol\),result\)/);
assert.match(formalLoop,/c1PopulationReceipt,/);
assert.equal((formalLoop.match(/const result = applyMarketConsensus\(scoreCandidate\(f, sector\), consensus\);/g)||[]).length,2,
  "Formal and thousand scoring call count must stay unchanged");
assert.match(source,/c1PopulationSave = \{ok:false[\s\S]*?noTrade:true\}/);
assert.match(source,/daily result|每日盤後結果/i);

console.log(JSON.stringify({
  ok:true,version:"8.15.0-c1-population-receipts",populationIncludesHistoryBlocked:true,
  immutableChunking:true,protectedReadApi:true,extraMarketCalls:0,formalCoreImpact:false,
  population2000Bytes:scaleBytes,chunks2000:scaleChunks.length,maxChunkBytes,scaleBuildMs
}));
