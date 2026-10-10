import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {__testOnlySyntheticIdentityEngineV0_1 as fakeEngine,
 SCHEMA_CONFIRM,SCHEMA_BOUNDARY} from "../migration/destination_schema_only_manual_executor_v0_1.mjs";
import {planDestinationSchemaOnlyOfflineV0_1} from "../migration/destination_schema_only_offline_payload_v0_1.mjs";
import {collectCurrentSqlFilesOfflineV0_1} from "../migration/destination_schema_prefix_offline_v0_1.mjs";
const sha=s=>createHash("sha256").update(s).digest("hex");
const A="a".repeat(32),B="b".repeat(32),DB="c".repeat(32),TOKEN="SYNTHETIC_TEST_ONLY_TOKEN_NOT_REAL_CREDENTIAL";
const trusted={account:sha(B),source:sha(A),database:sha(DB)};
const files=collectCurrentSqlFilesOfflineV0_1();
const sourceProvisioner=readFileSync("system2/deploy/provision_system2_d1.mjs","utf8");
const destinationReceipt=JSON.parse(readFileSync("system2/migration/evidence/S2_DEST_D1_POSTCREATE_REAL_GETONLY_RECONCILIATION_20261010_V0_1.json","utf8"));
const seal=planDestinationSchemaOnlyOfflineV0_1({files,sourceProvisioner,destinationReceipt});
assert.equal(seal.plannedStatements,125);
function mock({notEmpty=false,wrongDb=false,extraDb=false,stopAfter=Infinity,badMeta=false}={}){
 const calls=[];let ddl=0;
 const fetchImpl=async(url,opts={})=>{
  const method=opts.method||"GET";
  const sql=opts.body?JSON.parse(opts.body).sql:null;
  calls.push({method,url:url.replaceAll(A,"[account]").replaceAll(B,"[account]"),sql});
  if(url.endsWith("/d1/database?page=1&per_page=100")){
    return Response.json({success:true,result:[
      {name:"system2-research",uuid:wrongDb?"d".repeat(32):DB},
      ...(extraDb?[{name:"unrelated",uuid:"f".repeat(32)}]:[])],
      result_info:{page:1,per_page:100,count:extraDb?2:1,total_count:extraDb?2:1}});
  }
  if(url.endsWith("/d1/database/"+DB))return Response.json({
    success:true,result:{name:"system2-research",uuid:DB,file_size:12288}});
  if(url.endsWith("/query")){
    if(sql?.startsWith("SELECT type, name FROM sqlite_schema")){
      return Response.json({success:true,result:[{success:true,results:notEmpty?[{type:"table",name:"s2_partial"}]:[]}]});
    }
    if(sql?.startsWith("SELECT type,name FROM sqlite_schema")){
      return Response.json({success:true,result:[{success:true,results:[
        ...Array.from({length:55},(_,i)=>({type:"table",name:"s2_"+i})),
        ...Array.from({length:63},(_,i)=>({type:"index",name:"s2_idx_"+i}))
      ]}]});
    }
    if(sql?.startsWith("SELECT schema_value FROM")){
      return Response.json({success:true,result:[{success:true,results:[{schema_value:badMeta?"1.0":"1.1"}]}]});
    }
    if(!/^CREATE\s+(?:TABLE|(?:UNIQUE\s+)?INDEX)|^INSERT\s+INTO\s+s2_schema_meta/.test(sql||""))throw Error("UNEXPECTED_SQL");
    ddl++;
    if(ddl===stopAfter)throw Error("SIMULATED_SQL_CONNECTION_AMBIGUOUS");
    return Response.json({success:true,result:[{success:true,results:[]}]});
  }
  throw Error("MOCK_UNEXPECTED_PATH");
 };
 return {fetchImpl,calls,get writes(){return ddl}};
}
const base=(fake,overrides={})=>({
 accountId:B,token:TOKEN,fetchImpl:fake.fetchImpl,mode:"VERIFY_ONLY",
 confirm:SCHEMA_CONFIRM,boundary:SCHEMA_BOUNDARY,
 files,sourceProvisioner,destinationReceipt,expectedPlanHash:seal.planSequenceSha256,...overrides
});
const pre=mock();
const v=await fakeEngine(base(pre),trusted);
assert.equal(v.result,"PREWRITE_EMPTY_TARGET_VERIFIED_ONLY");
assert.equal(v.appliedStatements,0);
assert.equal(v.plannedStatements,125);
assert.equal(pre.writes,0);
assert.deepEqual(pre.calls.map(x=>x.method),["GET","GET","POST"]);
const ok=mock();
const progress=[];
const done=await fakeEngine(base(ok,{mode:"APPLY_ONCE",onProgress:x=>progress.push(x)}),trusted);
assert.equal(done.result,"TARGET_D1_SCHEMA_ONLY_55_PHYSICAL_SQL_READBACK_PASS");
assert.equal(done.schemaTablesAfter,55);
assert.equal(done.schemaIndexesAfter,63);
assert.equal(done.schemaVersion,"1.1");
assert(ok.calls.some(x=>x.sql?.includes("type = 'index' AND name LIKE 'idx_s2_%'")));
assert.equal(done.appliedStatements,125);
assert.equal(progress.length,125);
assert.equal(ok.writes,125);
assert.equal(done.sourceRowsCopied,0);
assert.equal(done.workerOrCronChanged,false);
assert(!JSON.stringify(done).includes(B));
assert(!JSON.stringify(done).includes(TOKEN));
assert(ok.calls.every(x=>x.url.includes("/accounts/[account]/d1/database")));
assert(ok.calls.filter(x=>x.method==="POST" && x.sql?.startsWith("CREATE")).length===118);
assert(ok.calls.filter(x=>x.method==="POST" && x.sql?.startsWith("INSERT")).length===7);
async function rejected(opts,expect,noDdl=true){
 const fx=mock(opts?.mock||{});const arg=base(fx,opts?.change||{});
 await assert.rejects(()=>fakeEngine(arg,opts?.identity||trusted),err=>err.message.includes(expect));
 if(noDdl)assert.equal(fx.writes,0,expect);
}
await rejected({change:{accountId:A}},"DESTINATION_ACCOUNT_FINGERPRINT_MISMATCH");
await rejected({mock:{wrongDb:true}},"DESTINATION_D1_IDENTITY_MISMATCH");
await rejected({mock:{extraDb:true}},"DESTINATION_D1_CARDINALITY_UNVERIFIED");
await rejected({mock:{notEmpty:true}},"DESTINATION_SQL_SCHEMA_NOT_EMPTY_STOP_NO_RETRY");
await rejected({change:{confirm:"WRONG"}},"OWNER_SCHEMA_SCOPE_CONFIRMATION_REQUIRED");
await rejected({change:{boundary:"OTHER_SCOPE"}},"OWNER_SCHEMA_SCOPE_CONFIRMATION_REQUIRED");
await rejected({change:{expectedPlanHash:"0".repeat(64)}},"SEALED_SQL_PAYLOAD_HASH_NOT_VERIFIED");
await rejected({change:{mode:"APPLY_AND_DEPLOY_WORKER"}},"OWNER_SCHEMA_SCOPE_CONFIRMATION_REQUIRED");
const half=mock({stopAfter:20});
await assert.rejects(()=>fakeEngine(base(half,{mode:"APPLY_ONCE"}),trusted),
 err=>err.message.includes("UNKNOWN_OR_PARTIAL_SCHEMA_INSTALL_DO_NOT_RETRY"));
assert.equal(half.writes,20);
const stale=mock({badMeta:true});
await assert.rejects(()=>fakeEngine(base(stale,{mode:"APPLY_ONCE"}),trusted),
 err=>err.message.includes("UNKNOWN_OR_PARTIAL_SCHEMA_INSTALL_DO_NOT_RETRY"));
assert.equal(stale.writes,125);
const wrongEnv=readFileSync(".github/workflows/system2-destination-schema-only-manual.yml","utf8");
const runner=readFileSync("system2/migration/run_destination_schema_only_manual_v0_1.mjs","utf8");
assert.match(wrongEnv,/workflow_dispatch:/);
assert.doesNotMatch(wrongEnv,/^\s+(?:schedule|push|pull_request):/m);
assert.match(wrongEnv,/environment: system2-schema-only/);
assert.doesNotMatch(wrongEnv,/environment: system2-research/);
assert.match(wrongEnv,/S2_SCHEMA_DEST_D1_WRITE_TOKEN/);
assert.doesNotMatch(wrongEnv,/CLOUDFLARE_ACCOUNT_ID|SYSTEM2_CLOUDFLARE_API_TOKEN|S2_MIGRATION_SOURCE_READ_TOKEN/);
// Reading the original provisioner source as text to compare its migrationFiles list is allowed.
// Executing/importing it would silently CREATE a D1 and is forbidden here.
assert.doesNotMatch(runner,/__testOnlySyntheticIdentityEngineV0_1|await\s+import\s*\(\s*["'][^"']*provision_system2_d1|(?:spawn|exec|fork)\s*\([^\n]*provision_system2_d1/);
assert.match(runner,/refs\/heads\/main/);
assert.match(runner,/GITHUB_EVENT_NAME/);
assert(!wrongEnv.includes("wrangler deploy"));
console.log("S2 destination Schema-only live-capable workflow: mock 125/125 + verify-only 0, 8 blockers + partial/unknown stop + source/env static isolation PASS; external Cloudflare writes 0");
