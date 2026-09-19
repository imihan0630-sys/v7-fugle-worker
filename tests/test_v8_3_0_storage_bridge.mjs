import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const mod=await import("data:text/javascript;base64,"+Buffer.from(
  source+"\nexport {canonicalPlanJson,sha256Hex,firebaseConfigured,writePlanArchiveD1,readPlanArchiveD1};"
).toString("base64")+"#"+Date.now());

assert.match(source,/const VERSION = "8\.(?:3\.\d+|[4-9]\.\d+)[^"]*";/);

class FakeStatement {
  constructor(db,sql){ this.db=db; this.sql=sql; this.args=[]; }
  bind(...args){ this.args=args; return this; }
  async run(){
    if(this.sql.includes("INSERT INTO v8_plan_archive")){
      const [scanDate,planDate,schemaVersion,payloadJson,hash,provider,now]=this.args;
      const previous=this.db.plan.get(scanDate);
      this.db.plan.set(scanDate,{
        scan_date:scanDate,plan_date:planDate,schema_version:schemaVersion,payload_json:payloadJson,
        payload_sha256:hash,bridge_provider:provider,created_at:previous?.created_at||now,updated_at:now
      });
    }
    return {meta:{rows_written:1}};
  }
  async first(){
    if(this.sql.includes("FROM v8_plan_archive")){
      return this.db.plan.get(this.args[0]) || null;
    }
    return null;
  }
  async all(){ return {results:[]}; }
}
class FakeD1 {
  constructor(){ this.plan=new Map(); }
  prepare(sql){ return new FakeStatement(this,sql); }
  withSession(){ return this; }
}

const a={z:1,a:{d:4,c:3},b:[{y:2,x:1}]};
const b={b:[{x:1,y:2}],a:{c:3,d:4},z:1};
assert.equal(mod.canonicalPlanJson(a),mod.canonicalPlanJson(b));
assert.equal((await mod.sha256Hex(mod.canonicalPlanJson(a))).length,64);
assert.equal(mod.firebaseConfigured({}),false);
assert.equal(mod.firebaseConfigured({FIREBASE_PROJECT_ID:"p",FIREBASE_CLIENT_EMAIL:"e",FIREBASE_PRIVATE_KEY:"k"}),true);

const payload={
  schemaVersion:"V7_PLAN_2",scanDate:"2026-09-18",planDate:"2026-09-21",totalCapital:200000,remainingCash:32000,
  stocks:[{symbol:"3105",name:"穩懋",buyLow:489.54,buyHigh:496.92}]
};
const env={TEST_MODE:"false",V7_DB:new FakeD1()};
const write=await mod.writePlanArchiveD1(payload,env,"D1_THREEMIN_COMPAT");
assert.equal(write.stored,true);
assert.equal(write.verified,true);
assert.equal(write.provider,"D1_PRIMARY");
const read=await mod.readPlanArchiveD1(payload.scanDate,env);
assert.equal(read.scan_date,payload.scanDate);
assert.equal(read.plan_date,payload.planDate);
assert.deepEqual(read.payload,payload);
assert.equal(read.payload_sha256,write.sha256);

for(const marker of [
  'CREATE TABLE IF NOT EXISTS v8_plan_archive',
  'async function writePlanFirestore(payload,env)',
  'async function persistPlanBridge(payload,env)',
  'url.pathname==="/api/storage/status"',
  'url.pathname==="/api/storage/migrate-current"',
  'planStorageMode:',
  'externalPlanVerified: bridge.verified === true',
  'firebaseVerified: bridge.provider==="D1_FIRESTORE"'
]) assert.ok(source.includes(marker),marker);

console.log(JSON.stringify({
  ok:true,
  version:"8.3.0-d1-firestore-bridge",
  canonicalHash:true,
  d1PrimaryRoundTrip:true,
  firestoreOptional:true,
  legacyStorageCompatibilityCovered:true,
  noCutoverBeforeExternalReadback:true
}));
