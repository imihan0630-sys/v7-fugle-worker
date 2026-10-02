import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
const source=fs.readFileSync(process.env.V7_TEST_WORKER_PATH||'Worker.js','utf8');
assert.match(source,/8\.15\.1-c1-capture-integrity/);
const api=await import('data:text/javascript;base64,'+Buffer.from(source+`
export {buildC1PopulationReceipt,c1ChunkRows,persistC1PopulationReceipt,readC1PopulationReceipt,persistCompletedC1Safe};`).toString('base64'));
class Statement {
  constructor(db,sql){this.db=db;this.sql=sql;this.args=[];}
  bind(...args){this.args=args;return this;}
  async run(){return this.db.prepare(this.sql).run(...this.args);}
  async first(){return this.db.prepare(this.sql).get(...this.args)||null;}
  async all(){return {results:this.db.prepare(this.sql).all(...this.args)};}
}
class D1 {
  constructor(){this.db=new DatabaseSync(':memory:');}
  prepare(sql){return new Statement(this.db,sql);}
  withSession(){return this;}
  async batch(statements){
    this.db.exec('BEGIN');
    try{for(const s of statements) await s.run();this.db.exec('COMMIT');}
    catch(e){this.db.exec('ROLLBACK');throw e;}
  }
}
const day='2026-10-02',now=Date.parse(day+'T07:00:00Z');
const raw=[{symbol:'2006',close:100,market:'TWSE'},{symbol:'9999',close:30,market:'TPEx'}];
function receipt(){return {...api.buildC1PopulationReceipt([],raw,{stocks:{}},{},new Map(),[],day),
  decisionAt:day+'T06:00:00Z',capturedAt:day+'T06:00:00Z'};}
let n=0;const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const env={V7_DB:new D1(),TEST_MODE:'false'};
const r=receipt();
const saved=await api.persistCompletedC1Safe(env,r,day,{selectionVerified:true,now});
eq(saved.status,'VERIFIED');eq(saved.saveOk,true);eq(saved.readbackVerified,true);eq(saved.saved,2);
const replay=await api.persistCompletedC1Safe(env,r,day,{selectionVerified:true,now});eq(replay.status,'VERIFIED');
const p=await api.readC1PopulationReceipt(env,{generationId:r.generationId});eq(p.rows.length,2);
eq(p.rows[1].feature.historyDays,null);
eq(p.rows[1].safety.ACCOUNT_RISK.status,'UNKNOWN');
const wrongClock=await api.persistCompletedC1Safe(env,receipt(),day,{selectionVerified:true,now:now+86400000});
eq(wrongClock.reason,'NON_PROSPECTIVE_SESSION_CAPTURE');eq(wrongClock.saveOk,false);
eq((await api.persistCompletedC1Safe(env,receipt(),day,{selectionVerified:false,now})).reason,'FORMAL_SELECTION_UNVERIFIED');
eq((await api.persistCompletedC1Safe(env,null,day,{selectionVerified:true,captureError:'fixture failure',now})).reason,'C1_CAPTURE_FAILED');
eq((await api.persistCompletedC1Safe({},receipt(),day,{selectionVerified:true,now})).status,'DATA_QUALITY_BLOCKED');
const beforeClose={...receipt(),decisionAt:day+'T05:00:00Z'};
eq((await api.persistCompletedC1Safe(env,beforeClose,day,{selectionVerified:true,now})).reason,'NON_PROSPECTIVE_SESSION_CAPTURE');
const future={...receipt(),decisionAt:day+'T08:00:00Z'};
eq((await api.persistCompletedC1Safe(env,future,day,{selectionVerified:true,now})).reason,'NON_PROSPECTIVE_SESSION_CAPTURE');
const changed={...r,decisionAt:day+'T06:01:00Z'};
await assert.rejects(()=>api.persistC1PopulationReceipt(env,changed),/IMMUTABLE_GENERATION_CONFLICT/);n++;
const chunks=api.c1ChunkRows([{symbol:'1',name:'漢'.repeat(29000)},{symbol:'2',name:'漢'.repeat(29000)}]);
eq(chunks.length,2);eq(chunks.every(c=>Buffer.byteLength(JSON.stringify(c))<=90000),true);
assert.throws(()=>api.c1ChunkRows([{symbol:'1',name:'漢'.repeat(31000)}]),/D1_BYTE_BOUND/);n++;
const mutated=JSON.parse(env.V7_DB.db.prepare('SELECT rows_json FROM trade_research_c1_chunks WHERE generation_id=?').get(r.generationId).rows_json);
mutated[0].name='CORRUPTED_SAME_ROW_COUNT';
env.V7_DB.db.prepare('UPDATE trade_research_c1_chunks SET rows_json=? WHERE generation_id=?').run(JSON.stringify(mutated),r.generationId);
await assert.rejects(()=>api.readC1PopulationReceipt(env,{generationId:r.generationId}),/DIGEST_MISMATCH/);n++;
const brokenReplay=await api.persistCompletedC1Safe(env,r,day,{selectionVerified:true,now});
eq(brokenReplay.status,'DATA_QUALITY_BLOCKED');eq(brokenReplay.readbackVerified,false);eq(brokenReplay.saved,null);
eq(brokenReplay.noPush,true);eq(brokenReplay.formalCoreImpact,false);
assert.match(source,/try \{ c1PopulationReceipt=buildC1PopulationReceipt/);n++;
assert.match(source,/Object\.defineProperty\(summary,"c1PopulationReceipt",\{value:scan\.c1PopulationReceipt,enumerable:false\}\)/);n++;
assert.match(source,/persistCompletedC1Safe\(env,preview\.c1PopulationReceipt,date/);n++;
console.log(JSON.stringify({ok:true,assertions:n,fixtureOnly:true,readbackCorruptionRejected:true,
  retrospectiveCaptureRejected:true,utf8D1Bound:true,formalCoreImpact:false}));
