// Issue #1103. Fully synthetic; never a Cloudflare call or write.
// Covers exact physical objects, owner table association and inner D1 status.
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {
 __testOnlySyntheticFullSchema1103 as verify,FULL_OBJECT_CONFIRM,
 INVENTORY_SELECT,VERSION_SELECT
} from "../migration/destination_schema_full_object_readonly_1103_v0_1.mjs";
import {collectCurrentSqlFilesOfflineV0_1 as collect} from "../migration/destination_schema_prefix_offline_v0_1.mjs";
import {planDestinationSchemaOnlyOfflineV0_1 as planOffline}
 from "../migration/destination_schema_only_offline_payload_v0_1.mjs";

const sha=x=>createHash("sha256").update(x).digest("hex");
const A="a".repeat(32),B="b".repeat(32),DB="c".repeat(32);
const TOKEN="SYNTHETIC_TEST_TOKEN_NEVER_REAL_CREDENTIAL";
const identity={source:sha(A),dest:sha(B),db:sha(DB)};
const files=collect();
const sourceProvisioner=readFileSync("system2/deploy/provision_system2_d1.mjs","utf8");
const destinationReceipt=JSON.parse(readFileSync(
 "system2/migration/evidence/S2_DEST_D1_POSTCREATE_REAL_GETONLY_RECONCILIATION_20261010_V0_1.json","utf8"));
const plan=planOffline({files,sourceProvisioner,destinationReceipt});
assert.equal(plan.plannedStatements,125);
assert.equal(plan.planSequenceSha256,"99a74747cbd3220afb84608c1ed8a9cf72e8eff71f2f23859227dbf7c56afe4f");
const expected=plan.sqlStatements.flatMap(s=>{
 if(s.type==="CREATE_S2_TABLE"){
  const m=s.sql.match(/^CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+(s2_[a-z0-9_]+)\s*\(/i);
  assert(m);return [{type:"table",name:m[1],tbl_name:m[1]}];
 }
 if(s.type==="CREATE_S2_INDEX"){
  const m=s.sql.match(/^CREATE\s+(?:UNIQUE\s+)?INDEX\s+IF\s+NOT\s+EXISTS\s+([a-z0-9_]+)\s+ON\s+(s2_[a-z0-9_]+)\s*\(/i);
  assert(m);return[{type:"index",name:m[1],tbl_name:m[2]}];
 }
 return [];
});
assert.equal(expected.length,118);
const vendor={type:"table",name:"_cf_KV",tbl_name:"_cf_KV"};
const goodRows=[...expected,vendor];
const clone=x=>JSON.parse(JSON.stringify(x));
const resp=results=>({success:true,result:[{success:true,results}],errors:[]});
function fixture({objects=goodRows,version="1.1",mutate=null,dbCount=1,wrongDb=false,
 metadataInvalid=false,transportError=null}={}){
 const calls=[];
 const fetchImpl=async(url,options={})=>{
  const sql=options.body?JSON.parse(options.body).sql:null;
  calls.push({url,method:options.method,sql});
  if(transportError==="disconnect")throw Error("synthetic disconnected");
  if(transportError==="http_error")return Response.json({success:false},{status:500});
  if(url.endsWith("/d1/database?page=1&per_page=100"))
   return Response.json({success:true,result:Array.from({length:dbCount},(_,i)=>({
    name:i===0?"system2-research":"other",uuid:i===0?(wrongDb?"d".repeat(32):DB):"e".repeat(32)})),
    result_info:{page:1,total_count:dbCount,count:dbCount,per_page:100}});
  if(url.endsWith("/d1/database/"+DB))
   return Response.json({success:true,result:{name:"system2-research",
    file_size:metadataInvalid?-1:1011712}});
  if(url.endsWith("/query")){
   assert.equal(options.method,"POST");
   assert([INVENTORY_SELECT,VERSION_SELECT].includes(sql),"unexpected SQL / unsafe query");
   const n=sql===INVENTORY_SELECT?"inventory":"version";
   const raw=n==="inventory"?resp(clone(objects)):resp(version===null?[]:[{schema_value:version}]);
   return Response.json(mutate?mutate(clone(raw),n):raw);
  }
  throw Error("Unexpected Cloudflare API path");
 };
 return {fetchImpl,calls};
}
function args(f,overrides={}){return{
  accountId:B,apiToken:TOKEN,confirm:FULL_OBJECT_CONFIRM,
  files,sourceProvisioner,destinationReceipt,fetchImpl:f.fetchImpl,...overrides
};}
let positive=0,negative=0;
const f=fixture(),r=await verify(args(f),identity);
assert.equal(r.status,"DESTINATION_SCHEMA_EXACT_FULL_OBJECT_SET_READONLY_PASS");
assert.equal(r.tableCount,55);assert.equal(r.indexCount,63);
assert.equal(r.schemaVersion,"1.1");assert.equal(r.rawObjectCount,119);
assert.equal(r.physicalObjects.length,118);
assert.equal(r.canonicalObjects.length,118);
assert.equal(r.canonicalObjectDigestSha256,r.physicalObjectDigestSha256);
assert.equal(r.planSequenceSha256,plan.planSequenceSha256);
assert.equal(r.cloudWritesPerformed,0);
assert.equal(r.cloudApiCalls.sqlDmlStatements,0);
assert.equal(f.calls.length,4);
assert.deepEqual(f.calls.map(x=>x.method),["GET","GET","POST","POST"]);
assert.deepEqual(f.calls.filter(x=>x.sql).map(x=>x.sql),[INVENTORY_SELECT,VERSION_SELECT]);
assert(f.calls.every(x=>x.url.includes("/accounts/"+B+"/d1/database/")||
   x.url.includes("/accounts/"+B+"/d1/database?")));
assert(!JSON.stringify(r).includes(TOKEN)&&!JSON.stringify(r).includes(B));
positive++;
const reversed=fixture({objects:goodRows.slice().reverse()});
const rr=await verify(args(reversed),identity);
assert.equal(rr.physicalObjectDigestSha256,r.physicalObjectDigestSha256);
positive++;

async function rejectCase(name,f,expectedCode,overrides={}){
 await assert.rejects(()=>verify(args(f,overrides),identity),e=>{
  if(expectedCode)assert.equal(e.message,expectedCode,name);
  return true;
 },name);
 assert(f.calls.every(c=>c.sql===null||
    (c.method==="POST"&&[INVENTORY_SELECT,VERSION_SELECT].includes(c.sql))),name);
 assert(f.calls.every(c=>c.url.includes("/accounts/"+B+"/d1/database"))||
    f.calls.length===0,name);
 negative++;
}
const altered=(fn)=>{const x=clone(goodRows);fn(x);return fixture({objects:x});};
await rejectCase("same count but wrong table name",altered(x=>{
 const i=x.findIndex(a=>a.type==="table");x[i].name="s2_renamed";
 x[i].tbl_name="s2_renamed";
}),"ISSUE1103_SCHEMA_OBJECT_SET_NOT_EXACT");
await rejectCase("same count wrong index name",altered(x=>{
 const i=x.findIndex(a=>a.type==="index");x[i].name="idx_s2_fake";
}),"ISSUE1103_SCHEMA_OBJECT_SET_NOT_EXACT");
await rejectCase("same count wrong index owner",altered(x=>{
 const i=x.findIndex(a=>a.type==="index");
 const t=x.find(a=>a.type==="table"&&a.name!==x[i].tbl_name);
 x[i].tbl_name=t.name;
}),"ISSUE1103_SCHEMA_OBJECT_SET_NOT_EXACT");
await rejectCase("one missing user table",altered(x=>x.splice(x.findIndex(a=>a.type==="table"&&a.name!=="_cf_KV"),1)),
 "ISSUE1103_SCHEMA_OBJECT_SET_NOT_EXACT");
await rejectCase("one missing index",altered(x=>x.splice(x.findIndex(a=>a.type==="index"),1)),
 "ISSUE1103_SCHEMA_OBJECT_SET_NOT_EXACT");
await rejectCase("unexpected other table",altered(x=>x.push({type:"table",name:"other_table",tbl_name:"other_table"})),
 "ISSUE1103_SCHEMA_OBJECT_SET_NOT_EXACT");
await rejectCase("unexpected unprefixed index",altered(x=>x.push({type:"index",name:"random_idx",tbl_name:expected.find(a=>a.type==="table").name})),
 "ISSUE1103_SCHEMA_OBJECT_SET_NOT_EXACT");
await rejectCase("unexpected view",altered(x=>x.push({type:"view",name:"v_secret",tbl_name:"v_secret"})),
 "ISSUE1103_SCHEMA_OBJECT_SET_NOT_EXACT");
await rejectCase("unexpected trigger",altered(x=>x.push({type:"trigger",name:"s2_outcome_revision_block_update",tbl_name:"s2_decisions"})),
 "ISSUE1103_SCHEMA_OBJECT_SET_NOT_EXACT");
await rejectCase("staged 0011 table",altered(x=>x.push({type:"table",name:"s2_outcome_revision_archive",tbl_name:"s2_outcome_revision_archive"})),
 "ISSUE1103_SCHEMA_OBJECT_SET_NOT_EXACT");
await rejectCase("vendor absent",fixture({objects:expected}),"ISSUE1103_PLATFORM_RESERVED_TABLE_MISMATCH");
await rejectCase("vendor type index spoofed",altered(x=>{const v=x.find(a=>a.name==="_cf_KV");v.type="index";}),
 "ISSUE1103_PLATFORM_RESERVED_TABLE_MISMATCH");
await rejectCase("vendor owner spoofed",altered(x=>{const v=x.find(a=>a.name==="_cf_KV");v.tbl_name="s2_decisions";}),
 "ISSUE1103_PLATFORM_RESERVED_TABLE_MISMATCH");
await rejectCase("vendor duplicate",altered(x=>x.push(clone(vendor))),
 "ISSUE1103_SCHEMA_DUPLICATE_OBJECT_NAME");
await rejectCase("user duplicate name",altered(x=>x.push(clone(expected[0]))),
 "ISSUE1103_SCHEMA_DUPLICATE_OBJECT_NAME");
for(const key of ["type","name","tbl_name"]){
 await rejectCase("null "+key,altered(x=>{x[0][key]=null}),
  "ISSUE1103_SCHEMA_OBJECT_ROW_INVALID");
 await rejectCase("missing "+key,altered(x=>{delete x[0][key]}),
  "ISSUE1103_SCHEMA_OBJECT_ROW_INVALID");
}
await rejectCase("unknown object type",altered(x=>{x[0].type="virtual"}),
 "ISSUE1103_SCHEMA_OBJECT_ROW_INVALID");
await rejectCase("sqlite internal forced in result",altered(x=>{x[0].name="sqlite_autoindex_x"}),
 "ISSUE1103_SCHEMA_OBJECT_ROW_INVALID");
await rejectCase("invalid identifier injection",altered(x=>{x[0].name="s2_bad;DROP TABLE"}),
 "ISSUE1103_SCHEMA_OBJECT_ROW_INVALID");
for(const [name,alter] of [
 ["missing inner success",x=>{delete x.result[0].success;}],
 ["null inner success",x=>{x.result[0].success=null;}],
 ["numeric inner success",x=>{x.result[0].success=0;}],
 ["string false inner success",x=>{x.result[0].success="false";}],
 ["string true inner success",x=>{x.result[0].success="true";}],
 ["duplicate result group",x=>{x.result.push(clone(x.result[0]));}],
 ["empty result group",x=>{x.result=[];}],
 ["results object",x=>{x.result[0].results={};}],
 ["inner errors",x=>{x.result[0].errors=[{code:6000}];}],
 ["outer errors",x=>{x.errors=[{code:6000}];}],
 ["outer false",x=>{x.success=false;}],
 ["outer string true",x=>{x.success="true";}],
]){
 await rejectCase(name,fixture({mutate:(x,n)=>n==="inventory"?alter(x)||x:x}));
}
await rejectCase("version wrong",fixture({version:"1.0"}),"ISSUE1103_SCHEMA_VERSION_NOT_VERIFIED");
await rejectCase("version missing",fixture({version:null}),"ISSUE1103_SCHEMA_VERSION_NOT_VERIFIED");
await rejectCase("version duplicate",fixture({mutate:(x,n)=>{
 if(n==="version")x.result[0].results.push({schema_value:"1.1"});
 return x;
}}),"ISSUE1103_SCHEMA_VERSION_NOT_VERIFIED");
await rejectCase("version inner missing success",fixture({mutate:(x,n)=>{
 if(n==="version")delete x.result[0].success;
 return x;
}}),"ISSUE1103_SQL_INNER_RESULT_NOT_STRICT_TRUE");
await rejectCase("source account id",fixture(),"ISSUE1103_DEST_ACCOUNT_IDENTITY_MISMATCH",{accountId:A});
await rejectCase("wrong database uuid",fixture({wrongDb:true}),"ISSUE1103_DEST_DATABASE_IDENTITY_MISMATCH");
await rejectCase("extra target db",fixture({dbCount:2}),"ISSUE1103_SINGLE_DEST_DATABASE_NOT_VERIFIED");
await rejectCase("bad destination metadata",fixture({metadataInvalid:true}),"ISSUE1103_DEST_METADATA_INVALID");
await rejectCase("missing confirmation",fixture(),"ISSUE1103_MANUAL_READONLY_CONFIRM_REQUIRED",{confirm:"OTHER"});
await rejectCase("bad SQL prefix",fixture(),"ISSUE1103_CANONICAL_SQL_PLAN_CHANGED",{files:files.slice(0,10)});
await rejectCase("transport disconnected",fixture({transportError:"disconnect"}),"ISSUE1103_READ_TRANSPORT_FAILED_NO_RETRY");
await rejectCase("HTTP 500",fixture({transportError:"http_error"}),"ISSUE1103_READ_HTTP_FAILED_NO_RETRY");

// Isolation and workflow policy assertions; READ-only token comes from the
// pre-existing destination account GitHub Environment. No source credentials.
const workflow=readFileSync(".github/workflows/system2-destination-full-schema-object-readonly-1103.yml","utf8");
const runner=readFileSync("system2/migration/run_destination_schema_full_object_readonly_1103_v0_1.mjs","utf8");
assert.match(workflow,/workflow_dispatch:/);
assert.match(workflow,/environment: system2-migration/);
assert.match(workflow,/S2_MIGRATION_DESTINATION_READ_TOKEN/);
assert.doesNotMatch(workflow,/S2_SCHEMA_DEST_D1_WRITE_TOKEN|S2_MIGRATION_SOURCE_READ_TOKEN|wrangler\s+deploy/);
assert.doesNotMatch(workflow,/^\s+(?:schedule|push|pull_request):/m);
assert(!workflow.includes("run_destination_schema_only_manual_v0_1.mjs"));
assert(!runner.includes("S2_SCHEMA_DEST_D1_WRITE_TOKEN"));
assert(!runner.includes("S2_MIGRATION_SOURCE_READ_TOKEN"));
assert.equal((INVENTORY_SELECT.match(/\bSELECT\b/gi)||[]).length,1);
assert.equal((VERSION_SELECT.match(/\bSELECT\b/gi)||[]).length,1);
console.log("S2_ISSUE1103_FULL_OBJECT_READONLY_TESTS "+
 JSON.stringify({positivePass:positive,negativePass:negative,
   exactTables:55,exactIndexes:63,expectedObjects:118,platformReserved:1,
   selectCalls:2,sourceRequests:0,physicalDdlOrDml:0,syntheticOnly:true}));
