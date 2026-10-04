import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';

const sha=s=>createHash('sha256').update(s).digest('hex');
const baseline=fs.readFileSync('artifacts/Worker-before-v8_18_0.mjs','utf8');
const source=fs.readFileSync(process.env.V7_TEST_WORKER_PATH||'Worker.js','utf8');

function body(s,name){
  const marker='function '+name+'(';
  let start=s.indexOf(marker);
  if(start<0) start=s.indexOf('async '+marker);
  assert.ok(start>=0,name+' missing');
  const next=[s.indexOf('\nfunction ',start+1),s.indexOf('\nasync function ',start+1)].filter(x=>x>start);
  const end=next.length?Math.min(...next):s.length;
  return s.slice(start,end).trimEnd();
}

assert.match(source,/const VERSION = "8\.18\.0-decision-cutoff-provenance";/);

const changed=['runAfterMarketScanCore','selectTomorrowCandidates','buildC1PopulationReceipt'];
let normalized=source.replace('8.18.0-decision-cutoff-provenance','8.17.0-shadow-cohort-membership');
for(const name of changed) normalized=normalized.replace(body(normalized,name),body(baseline,name));
assert.equal(sha(normalized),sha(baseline),'V8.18 must be additive provenance-only outside three audited functions');

const core=body(source,'runAfterMarketScanCore');
const selector=body(source,'selectTomorrowCandidates');
const builder=body(source,'buildC1PopulationReceipt');

const consensus='const marketConsensus=await env.STOCKS_KV.get(`V7_MARKET_CONSENSUS:${marketDate}`,"json");';
const cutoff='const decisionCutoffAt=new Date().toISOString();';
const call='selectTomorrowCandidates(marketState, rows, { ...env, V7_TOTAL_CAPITAL: totalCapital, V7_OFFICIAL_INDEX:indexData, V7_MARKET_CONSENSUS:marketConsensus }, marketDate,decisionCutoffAt)';
const ci=core.indexOf(consensus),ki=core.indexOf(cutoff),si=core.indexOf(call);
assert.ok(ci>=0&&ki>ci&&si>ki,'cutoff must be after final consensus read and before selector');
const between=core.slice(ki+cutoff.length,si);
for(const forbidden of ['await ','fetch(','STOCKS_KV.get','V7_DB.']) assert.ok(!between.includes(forbidden),'no external/async read after cutoff: '+forbidden);

assert.match(selector,/function selectTomorrowCandidates\(marketState, todayRows, env, scanDate,decisionCutoffAt=null\)/);
for(const forbidden of ['await ','fetch(','fetchWithDeadline(','STOCKS_KV.get','V7_DB.']) assert.ok(!selector.includes(forbidden),'selector must stay synchronous/external-read-free: '+forbidden);
assert.ok(selector.includes('buildC1PopulationReceipt(featureRows,todayRows,marketState,sectorStats,c1FormalResults,selected,scanDate,c1ZeroPickContext,decisionCutoffAt)'));

assert.ok(builder.includes('decisionCutoffAt:normalizedDecisionCutoffAt'));
assert.ok(builder.includes('decisionCutoffProvenance:normalizedDecisionCutoffAt===null?"MISSING_FIXTURE_OR_LEGACY":"POST_FINAL_FORMAL_INPUT_PRE_SELECTOR_RUNTIME_STAMP_V0_1"'));
assert.ok(builder.includes('decisionCutoffRequiredForPromotion:true'));

const exports='buildC1PopulationReceipt,persistC1PopulationReceipt,readC1PopulationReceipt';
const api=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {'+exports+'};').toString('base64'));

const RealDate=Date;
let now='2026-10-05T10:20:00.000Z';
class FixtureDate extends RealDate{
  constructor(...args){super(...(args.length?args:[now]));}
  static now(){return RealDate.parse(now);}
}
globalThis.Date=FixtureDate;
let receipt;
try{
  receipt=api.buildC1PopulationReceipt(
    [],
    [{symbol:'2330',name:'台積電',market:'TWSE',industry:'半導體',close:1000}],
    {stocks:{}},{},new Map(),[],'2026-10-05',null,'2026-10-05T10:10:00.000Z'
  );
  assert.equal(receipt.decisionCutoffAt,'2026-10-05T10:10:00.000Z');
  assert.equal(receipt.decisionAt,'2026-10-05T10:20:00.000Z');
  assert.equal(receipt.decisionCutoffProvenance,'POST_FINAL_FORMAL_INPUT_PRE_SELECTOR_RUNTIME_STAMP_V0_1');
  assert.equal(receipt.decisionCutoffRequiredForPromotion,true);

  const missing=api.buildC1PopulationReceipt(
    [],[{symbol:'2331',name:'測試',market:'TWSE',industry:'其他',close:100}],
    {stocks:{}},{},new Map(),[],'2026-10-05'
  );
  assert.equal(missing.decisionCutoffAt,null);
  assert.equal(missing.decisionCutoffProvenance,'MISSING_FIXTURE_OR_LEGACY');

  assert.throws(()=>api.buildC1PopulationReceipt(
    [],[{symbol:'2332',name:'測試',market:'TWSE',industry:'其他',close:100}],
    {stocks:{}},{},new Map(),[],'2026-10-05',null,'2026-10-05T10:21:00.000Z'
  ),/C1_DECISION_CUTOFF_INVALID/);
  assert.throws(()=>api.buildC1PopulationReceipt(
    [],[{symbol:'2333',name:'測試',market:'TWSE',industry:'其他',close:100}],
    {stocks:{}},{},new Map(),[],'2026-10-05',null,'2026-10-04T10:10:00.000Z'
  ),/C1_DECISION_CUTOFF_SESSION_MISMATCH/);
} finally { globalThis.Date=RealDate; }

class Statement{
  constructor(owner,sql){this.owner=owner;this.sql=sql;this.args=[];}
  bind(...args){this.args=args;return this;}
  run(){return this.owner.db.prepare(this.sql).run(...this.args);}
  first(){return this.owner.db.prepare(this.sql).get(...this.args)||null;}
  all(){return {results:this.owner.db.prepare(this.sql).all(...this.args)};}
}
class D1{
  constructor(){this.db=new DatabaseSync(':memory:');}
  prepare(sql){return new Statement(this,sql);}
  withSession(){return this;}
  async batch(statements){this.db.exec('BEGIN');try{for(const s of statements)s.run();this.db.exec('COMMIT');}catch(e){this.db.exec('ROLLBACK');throw e;}}
}
const env={V7_DB:new D1()};
const saved=await api.persistC1PopulationReceipt(env,receipt);
assert.equal(saved.readbackVerified,true);
const page=await api.readC1PopulationReceipt(env,{generationId:receipt.generationId});
assert.equal(page.header.decisionCutoffAt,receipt.decisionCutoffAt);
assert.equal(page.header.decisionCutoffProvenance,receipt.decisionCutoffProvenance);

const conflict=structuredClone(receipt);
conflict.decisionCutoffAt='2026-10-05T10:11:00.000Z';
await assert.rejects(()=>api.persistC1PopulationReceipt(env,conflict),/C1_IMMUTABLE_GENERATION_CONFLICT/);

console.log(JSON.stringify({
  status:'PASS',
  version:'8.18.0-decision-cutoff-provenance',
  changedFunctions:changed,
  decisionCutoffPlacement:'POST_V7_MARKET_CONSENSUS_PRE_SELECTOR',
  headerRoundTrip:true,
  sameGenerationCutoffMutation:'CONFLICT',
  historicalBackfill:false,
  formalCoreImpact:false
}));
