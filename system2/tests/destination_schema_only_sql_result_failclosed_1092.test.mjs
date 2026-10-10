// ISSUE #1092 REMEDIATION TEST. New independent-of-audit regression assertions.
// Preserve audit PR #1091 and its original failing evidence unchanged.
// All operations are synthetic with injected fetch, never live Cloudflare.
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {__testOnlySyntheticIdentityEngineV0_1 as engine,SCHEMA_CONFIRM,SCHEMA_BOUNDARY}
  from "../migration/destination_schema_only_manual_executor_v0_1.mjs";
import {planDestinationSchemaOnlyOfflineV0_1} from "../migration/destination_schema_only_offline_payload_v0_1.mjs";
import {collectCurrentSqlFilesOfflineV0_1} from "../migration/destination_schema_prefix_offline_v0_1.mjs";

const digest=x=>createHash("sha256").update(x).digest("hex");
const source="a".repeat(32),dest="b".repeat(32),db="c".repeat(32);
const token="SYNTHETIC_TEST_ONLY_TOKEN_NOT_REAL_CREDENTIAL";
const identity={source:digest(source),account:digest(dest),database:digest(db)};
const files=collectCurrentSqlFilesOfflineV0_1();
const sourceProvisioner=readFileSync("system2/deploy/provision_system2_d1.mjs","utf8");
const destinationReceipt=JSON.parse(readFileSync(
 "system2/migration/evidence/S2_DEST_D1_POSTCREATE_REAL_GETONLY_RECONCILIATION_20261010_V0_1.json","utf8"));
const plan=planDestinationSchemaOnlyOfflineV0_1({files,sourceProvisioner,destinationReceipt});
assert.equal(plan.plannedStatements,125);
assert.equal(plan.sqlStatements.length,125);
const success=results=>({success:true,result:[{success:true,results}]});
const reserved=[{type:"table",name:"_cf_KV"}];
const schemaRows=[
 ...Array.from({length:55},(_,i)=>({type:"table",name:"s2_"+i})),
 ...Array.from({length:63},(_,i)=>({type:"index",name:"idx_s2_"+i}))
];

function mock({selectReply,ddlReply,ddlBadAt=0,queryBadAt="",badMode=""}={}){
 let ddlAttempts=0,affirmativeDdl=0,queryCalls=0;
 const calls=[];
 const fetchImpl=async(url,opts={})=>{
  const method=opts.method||"GET",sql=opts.body?JSON.parse(opts.body).sql:null;
  calls.push({method,sql});
  if(url.endsWith("/d1/database?page=1&per_page=100"))
   return Response.json({success:true,result:[{name:"system2-research",uuid:db}],
     result_info:{page:1,total_count:1,count:1,per_page:100}});
  if(url.endsWith("/d1/database/"+db))
   return Response.json({success:true,result:{name:"system2-research",file_size:12288}});
  assert.ok(url.endsWith("/query"),"unexpected Cloudflare endpoint");
  assert.equal(method,"POST");
  queryCalls++;
  if(sql.startsWith("SELECT type, name FROM sqlite_schema")){
   if(queryBadAt==="initial"&&badMode==="disconnect")throw Error("mock connection reset");
   if(queryBadAt==="initial"&&badMode==="http503")return Response.json({success:false},{status:503});
   return Response.json(selectReply??success(reserved));
  }
  if(sql.startsWith("SELECT type,name FROM sqlite_schema")){
   return Response.json(queryBadAt==="readback"?{success:true,result:[{results:schemaRows}]}:success(schemaRows));
  }
  if(sql.startsWith("SELECT schema_value FROM s2_schema_meta")){
   return Response.json(queryBadAt==="version"?{success:true,result:[{results:[{schema_value:"1.1"}]}]}:success([{schema_value:"1.1"}]));
  }
  assert.match(sql,/^(?:CREATE|INSERT)\s/i);
  ddlAttempts++;
  if(ddlBadAt===ddlAttempts){
   if(badMode==="disconnect")throw Error("mock SQL connection reset");
   if(badMode==="http503")return Response.json({success:false},{status:503});
   if(badMode==="invalidJson")return {ok:true,json:async()=>{throw Error("bad JSON")}};
   return Response.json(ddlReply??{success:true,result:[{results:[]}]});
  }
  affirmativeDdl++;
  return Response.json(success([]));
 };
 return {fetchImpl,calls,get ddlAttempts(){return ddlAttempts},
         get affirmativeDdl(){return affirmativeDdl},get queryCalls(){return queryCalls}};
}
const args=(m,mode="VERIFY_ONLY",extras={})=>({
 accountId:dest,token,fetchImpl:m.fetchImpl,mode,confirm:SCHEMA_CONFIRM,
 boundary:SCHEMA_BOUNDARY,expectedPlanHash:plan.planSequenceSha256,
 files,sourceProvisioner,destinationReceipt,...extras
});
let positive=0,negative=0,ordinalNegative=0;
const validRead=mock();
const v=await engine(args(validRead),identity);
assert.equal(v.result,"PREWRITE_EMPTY_TARGET_VERIFIED_ONLY");
assert.equal(v.platformReservedObjectsBefore,1);
assert.equal(v.appliedStatements,0);
assert.equal(validRead.ddlAttempts,0);
positive++;
const validApply=mock();
const reports=[];
const done=await engine(args(validApply,"APPLY_ONCE",{onProgress:x=>reports.push(x)}),identity);
assert.equal(done.result,"TARGET_D1_SCHEMA_ONLY_55_PHYSICAL_SQL_READBACK_PASS");
assert.equal(done.appliedStatements,125);
assert.equal(done.schemaTablesAfter,55);
assert.equal(done.schemaIndexesAfter,63);
assert.equal(done.schemaVersion,"1.1");
assert.equal(done.planSequenceSha256,plan.planSequenceSha256);
assert.equal(done.platformReservedObjectsBefore,1);
assert.equal(validApply.affirmativeDdl,125);
assert.equal(reports.length,125);
assert.equal(done.sourceRowsCopied,0);
positive++;

const fiveOriginal=[
 ["missing",{success:true,result:[{results:reserved}]}],
 ["null",{success:true,result:[{success:null,results:reserved}]}],
 ["numeric_zero",{success:true,result:[{success:0,results:reserved}]}],
 ["string_false",{success:true,result:[{success:"false",results:reserved}]}],
 ["missing_empty",{success:true,result:[{results:[]}]}]
];
for(const [name,reply] of fiveOriginal){
 const fx=mock({selectReply:reply});
 await assert.rejects(()=>engine(args(fx),identity),e=>
  e.message.includes("D1_SQL_RESPONSE_NOT_CONFIRMED_NO_RETRY"),name);
 assert.equal(fx.ddlAttempts,0,name);
 negative++;
}
const additional=[
 ["boolean_false",{success:true,result:[{success:false,results:reserved}]}],
 ["string_true",{success:true,result:[{success:"true",results:reserved}]}],
 ["no_results",{success:true,result:[{success:true}]}],
 ["results_null",{success:true,result:[{success:true,results:null}]}],
 ["empty_groups",{success:true,result:[]}],
 ["duplicate_groups",{success:true,result:[{success:true,results:reserved},{success:true,results:reserved}]}],
 ["result_not_array",{success:true,result:{success:true,results:reserved}}],
 ["inner_array",{success:true,result:[[{success:true,results:reserved}]]}],
 ["inner_errors",{success:true,result:[{success:true,results:reserved,errors:[{code:1}]}]}],
 ["outer_errors",{success:true,result:[{success:true,results:reserved}],errors:[{code:1}]}],
 ["outer_string",{success:"true",result:[{success:true,results:reserved}]}],
 ["outer_false",{success:false,result:[{success:true,results:reserved}]}]
];
for(const [name,reply] of additional){
 const fx=mock({selectReply:reply});
 await assert.rejects(()=>engine(args(fx),identity),e=>
  e.message.includes("D1_SQL_RESPONSE_NOT_CONFIRMED_NO_RETRY")||
  e.message.includes("D1_SQL_OUTCOME_UNKNOWN_NO_RETRY"),name);
 assert.equal(fx.ddlAttempts,0,name);
 negative++;
}
// The original 125 unacknowledged DDL counterfeit MUST stop at the first one.
// Also test each ordinal 1..125 independently: a malformed inner reply cannot
// increment progress, and no later SQL statement may be attempted.
for(let ordinal=1;ordinal<=125;ordinal++){
 const fx=mock({ddlBadAt:ordinal});
 const receipt=[];
 await assert.rejects(()=>engine(args(fx,"APPLY_ONCE",{
  onProgress:x=>receipt.push(x)}),identity),e=>{
  assert.match(e.message,/UNKNOWN_OR_PARTIAL_SCHEMA_INSTALL_DO_NOT_RETRY/);
  assert.equal(e.appliedStatements,ordinal-1);
  assert.equal(e.progressHashes.length,ordinal-1);
  return true;
 },"malformed DDL ordinal "+ordinal);
 assert.equal(fx.ddlAttempts,ordinal);
 assert.equal(fx.affirmativeDdl,ordinal-1);
 assert.equal(receipt.length,ordinal-1);
 ordinalNegative++;
}
// HTTP transport ambiguities, invalid JSON, and postwrite forged success.
for(const mode of ["disconnect","http503","invalidJson"]){
 const fx=mock({ddlBadAt:20,badMode:mode});
 await assert.rejects(()=>engine(args(fx,"APPLY_ONCE"),identity),e=>{
   assert.match(e.message,/UNKNOWN_OR_PARTIAL_SCHEMA_INSTALL_DO_NOT_RETRY/);
   assert.equal(e.appliedStatements,19);return true;
 });
 assert.equal(fx.ddlAttempts,20);
 negative++;
}
for(const at of ["readback","version"]){
 const fx=mock({queryBadAt:at});
 await assert.rejects(()=>engine(args(fx,"APPLY_ONCE"),identity),e=>{
   assert.match(e.message,/UNKNOWN_OR_PARTIAL_SCHEMA_INSTALL_DO_NOT_RETRY/);
   assert.equal(e.appliedStatements,125);return true;
 });
 assert.equal(fx.affirmativeDdl,125);
 negative++;
}
for(const mode of ["disconnect","http503"]){
 const fx=mock({queryBadAt:"initial",badMode:mode});
 await assert.rejects(()=>engine(args(fx),identity),e=>
   e.message.includes("D1_SQL_OUTCOME_UNKNOWN_NO_RETRY"));
 assert.equal(fx.ddlAttempts,0);negative++;
}
// Unexpected user-defined tables must remain blocked, even with a vendor table.
for(const objects of [
 [...reserved,{type:"table",name:"s2_partial"}],
 [...reserved,{type:"index",name:"idx_malicious"}],
 [...reserved,{type:"view",name:"s2_fake"}],
 [...reserved,{type:"trigger",name:"s2_fake"}],
 [{type:"index",name:"_cf_KV"}],
 [...reserved,...reserved]
]){
 const fx=mock({selectReply:success(objects)});
 await assert.rejects(()=>engine(args(fx),identity));
 assert.equal(fx.ddlAttempts,0);negative++;
}
console.log("S2_CORR_1092_SQL_RESULT_FAILCLOSED "+
 JSON.stringify({positivePass:positive,negativePass:negative,
   originalFiveRejected:5,eachOf125DdlOrdinalsRejected:ordinalNegative,
   invalidInnerSuccessDdlConfirmed:0,
   vendorReservedPositive:true,valid125DdlMocked:true,
   outerAndInnerPositiveRequired:true,noPhysicalCloudflareCalls:true}));
