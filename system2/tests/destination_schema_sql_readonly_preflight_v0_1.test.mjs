import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {probeDestinationEmptyD1SqlReadonlyV0_1 as probe,
 DEST_SCHEMA_SQL_READONLY_CONFIRM as CONFIRM} from "../migration/destination_schema_sql_readonly_preflight_v0_1.mjs";
import {collectCurrentSqlFilesOfflineV0_1 as collect} from "../migration/destination_schema_prefix_offline_v0_1.mjs";
const digest=x=>createHash("sha256").update(x).digest("hex");
const A="a".repeat(32),B="b".repeat(32),DB="c".repeat(32),TOKEN="SYNTHETIC_TEST_TOKEN_NOT_A_REAL_SECRET";
const identity={source:digest(A),dest:digest(B),db:digest(DB)};
const files=collect();
const sourceProvisioner=readFileSync("system2/deploy/provision_system2_d1.mjs","utf8");
const destinationReceipt=JSON.parse(readFileSync("system2/migration/evidence/S2_DEST_D1_POSTCREATE_REAL_GETONLY_RECONCILIATION_20261010_V0_1.json","utf8"));
function transport({nonempty=false,otherDb=false,wrongDb=false,errorSelect=false,wrongResult=false,
                 badSize=false,untypedRow=false}={}){
 const calls=[];
 const fetchImpl=async(url,options)=>{
  calls.push({url,method:options.method,sql:options.body?JSON.parse(options.body).sql:null});
  if(url.endsWith("/d1/database?page=1&per_page=100"))
   return Response.json({success:true,result:[{name:"system2-research",uuid:wrongDb?"d".repeat(32):DB},
     ...(otherDb?[{name:"other",uuid:"e".repeat(32)}]:[])],
     result_info:{page:1,per_page:100,count:otherDb?2:1,total_count:otherDb?2:1}});
  if(url.endsWith("/d1/database/"+DB))
   return Response.json({success:true,result:{name:"system2-research",file_size:badSize?90000:12288}});
  if(url.endsWith("/query")){
   if(errorSelect)return Response.json({success:false,errors:[{code:6000,message:"DO_NOT_LOG_VENDOR_MESSAGE"}]},{status:400});
   if(wrongResult)return Response.json({success:true,result:{success:true,results:[]}});
   const results=nonempty?[untypedRow?{type:"table"}:{type:"table",name:"s2_unexpected"}]:[];
   return Response.json({success:true,result:[{success:true,results}]});
  }
  throw Error("UNEXPECTED_URL");
 };
 return {fetchImpl,calls};
}
const mk=t=>({accountId:B,apiToken:TOKEN,confirm:CONFIRM,files,sourceProvisioner,destinationReceipt,
 _syntheticIdentity:identity,fetchImpl:t.fetchImpl});
const ok=transport();
const x=await probe(mk(ok));
assert.equal(x.result,"DESTINATION_D1_PHYSICAL_EMPTY_SQL_VERIFIED");
assert.equal(x.objectsFound,0);
assert.equal(x.tableCount,0);
assert.equal(x.indexCount,0);
assert.equal(x.anySqlWritesPerformed,false);
assert.equal(x.noNewWriteTokenRequiredForThisPreflight,true);
assert.equal(x.destinationSchemaApplied,false);
assert.equal(x.cloudApiCalls.metadataGets,2);
assert.equal(x.cloudApiCalls.readOnlySqlPostQueries,1);
assert.equal(x.cloudApiCalls.sqlDdlStatements,0);
assert.equal(ok.calls.length,3);
assert.deepEqual(ok.calls.map(x=>x.method),["GET","GET","POST"]);
assert.equal(ok.calls[2].sql,"SELECT type, name FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%' ORDER BY type, name");
assert(ok.calls.every(x=>x.url.includes("/accounts/"+B+"/d1/database")));
assert(!JSON.stringify(x).includes(B)&&!JSON.stringify(x).includes(TOKEN));
const present=transport({nonempty:true});
const y=await probe(mk(present));
assert.equal(y.result,"DESTINATION_D1_NONEMPTY_BLOCK_SCHEMA_IMPORT");
assert.equal(y.objectsFound,1);assert.equal(y.tableCount,1);
async function block(opts,reason,expectedRequests=undefined){
 const t=transport(opts.transport||{});
 const a={...mk(t),...(opts.modify||{})};
 await assert.rejects(()=>probe(a),e=>e.message===reason);
 assert(t.calls.every(c=>c.sql===null||c.sql.startsWith("SELECT ")));
 if(expectedRequests!==undefined)assert.equal(t.calls.length,expectedRequests);
}
await block({modify:{accountId:A}},"DESTINATION_ACCOUNT_ID_FINGERPRINT_MISMATCH",0);
await block({modify:{confirm:"YES"}},"OWNER_READ_ONLY_CONFIRM_REQUIRED",0);
await block({modify:{apiToken:"short"}},"DESTINATION_READ_INPUT_INVALID",0);
await block({transport:{otherDb:true}},"DESTINATION_DATABASE_NOT_SINGLETON",1);
await block({transport:{wrongDb:true}},"DESTINATION_DATABASE_IDENTITY_MISMATCH",1);
await block({transport:{badSize:true}},"DESTINATION_DATABASE_SIZE_OR_ID_CHANGED",2);
await block({transport:{errorSelect:true}},"DESTINATION_D1_READ_HTTP_UNVERIFIED",3);
await block({transport:{wrongResult:true}},"DESTINATION_SQL_QUERY_RECEIPT_INVALID",3);
await block({transport:{nonempty:true,untypedRow:true}},"DESTINATION_SCHEMA_SQL_ROW_INVALID",3);
await block({modify:{files:files.slice(0,10)}},"SCHEMA_PREFIX_OFFLINE_PLAN_INVALID",0);
const wf=readFileSync(".github/workflows/system2-destination-schema-sql-readonly-preflight.yml","utf8");
const runner=readFileSync("system2/migration/run_destination_schema_sql_readonly_preflight_v0_1.mjs","utf8");
const core=readFileSync("system2/migration/destination_schema_sql_readonly_preflight_v0_1.mjs","utf8");
assert.match(wf,/workflow_dispatch:/);
assert.doesNotMatch(wf,/^\s+(?:schedule|push|pull_request):/m);
assert.match(wf,/environment: system2-migration/);
assert.match(wf,/S2_MIGRATION_DESTINATION_READ_TOKEN/);
assert.doesNotMatch(wf,/S2_MIGRATION_SOURCE_READ_TOKEN|S2_SCHEMA_DEST_D1_WRITE_TOKEN|wrangler deploy/);
assert(!runner.includes("S2_MIGRATION_SOURCE_READ_TOKEN"));
assert(!core.includes("DROP TABLE")&&!core.includes("CREATE TABLE")&&!core.includes("INSERT INTO"));
assert(!runner.includes("inspectOrApplyDestinationSchemaV0_1"));
assert(!wf.includes("APPLY_ONCE"));
console.log("S2 target D1 SELECT-only preflight: mock empty/nonempty + ten fail-closed probes PASS, no DDL or source-token flows");
