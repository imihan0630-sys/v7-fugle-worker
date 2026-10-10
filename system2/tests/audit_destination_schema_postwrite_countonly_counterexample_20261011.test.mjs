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
function mock({notEmpty=false,wrongDb=false,extraDb=false,stopAfter=Infinity,badMeta=false,
  reserved=false,duplicateReserved=false,spoofedReservedType=false}={}){
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
      return Response.json({success:true,result:[{success:true,results:[
        ...(reserved?[{type:spoofedReservedType?"index":"table",name:"_cf_KV"}]:[]),
        ...(duplicateReserved?[{type:"table",name:"_cf_KV"}]:[]),
        ...(notEmpty?[{type:"table",name:"s2_partial"}]:[])
      ]}]});
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

// AUDIT_LANE historical-source-only test of WHAT the actual post-DDL
// verifier can and cannot certify. This mock is NOT a new Cloudflare query.
const fixture=mock({reserved:true});
const original=fixture.fetchImpl;
const probeSql=[];
const adapter={...fixture,fetchImpl:async(url,opts={})=>{
 const sql=opts.body?JSON.parse(opts.body).sql:null;
 if(url.endsWith("/query") && sql?.startsWith("SELECT type,name FROM sqlite_schema")){
  probeSql.push(sql);
  // Same expected COUNTS, completely non-canonical object NAMES.
  // The real SQLite query filters out any extra unrelated table/view/trigger.
  // This test establishes an evidence completeness gap, not a real incident.
  return Response.json({success:true,result:[{success:true,results:[
   ...Array.from({length:55},(_,i)=>({type:"table",name:"s2_unapproved_"+i})),
   ...Array.from({length:63},(_,i)=>({type:"index",name:"idx_s2_unapproved_"+i}))
  ]}]});
 }
 return original(url,opts);
}};
const synthetic=await fakeEngine(base(adapter,{mode:"APPLY_ONCE"}),trusted);
assert.equal(synthetic.result,"TARGET_D1_SCHEMA_ONLY_55_PHYSICAL_SQL_READBACK_PASS");
assert.equal(synthetic.appliedStatements,125);
assert.equal(synthetic.schemaTablesAfter,55);
assert.equal(synthetic.schemaIndexesAfter,63);
assert.equal(probeSql.length,1);
assert.match(probeSql[0],/name LIKE 's2_%'/);
assert.match(probeSql[0],/name LIKE 'idx_s2_%'/);
assert.doesNotMatch(probeSql[0],/type\s*=\s*'view'|type\s*=\s*'trigger'/);
assert.equal(fixture.writes,125);
console.log("S2_SCHEMA_POSTWRITE_INDEPENDENT_COMPLETENESS_COUNTEREXAMPLE "+JSON.stringify({
 outcome:"COUNT_ONLY_READBACK_CAN_FALSELY_PASS_WRONG_NAMES",
 intendedScope:"EVIDENCE_COMPLETENESS_SOURCE_LEVEL_NOT_A_REAL_CLOUDFLARE_INCIDENT",
 fakeTables:55,fakeIndexes:63,
 fakeObjectNamesNoncanonical:true,
 passesExistingVerifier:true,
 liveFullObjectInventoryAbsent:true,
 extraViewsTriggersNotSelected:true,
 cloudflareIOByAudit:0,
 safetyAction:"INDEPENDENT_MANUAL_READ_ONLY_FULL_SQLITE_SCHEMA_INVENTORY_NEEDED_BEFORE_EXACT_OBJECT_SET_SIGNOFF"
}));
