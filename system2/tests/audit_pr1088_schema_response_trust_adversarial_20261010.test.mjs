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

// AUDIT_LANE. This exact-PR-HEAD observational adversarial witness is entirely
// synthetic. PASS of this witness means a security fault has been REPRODUCED,
// not that the PR is safe or ready to merge.
const audit=[];
async function testResponse(name, override, isExpectedSafe) {
 const fx=mock({reserved:true});
 const original=fx.fetchImpl;
 const modified={...fx,fetchImpl:async(url,opts)=>{
  const sql=opts.body?JSON.parse(opts.body).sql:null;
  if(url.endsWith("/query")&&sql?.startsWith("SELECT type, name FROM sqlite_schema"))
    return Response.json(override);
  return original(url,opts);
 }};
 let result;
 try{
  const x=await fakeEngine(base(modified),trusted);
  result={accepted:true,result:x.result,writes:fx.writes};
 }catch(e){result={accepted:false,error:e.message,writes:fx.writes};}
 audit.push({name,...result});
 if(isExpectedSafe)assert.equal(result.accepted,false,"control "+name+" must reject");
 return result;
}
// Positive: canonical full Cloudflare SQL success response accepts exact _cf_KV
const positive=await testResponse("exact_cloudflare_vendor_reserved",
 {success:true,result:[{success:true,results:[{type:"table",name:"_cf_KV"}]}]},false);
assert.equal(positive.accepted,true);
assert.equal(positive.writes,0);
// Known safe: outer success:false must halt before DDL.
await testResponse("outer_success_false",
 {success:false,result:[{success:true,results:[{type:"table",name:"_cf_KV"}]}]},true);
// Adversarial: missing/invalid INNER success flag must never be interpreted
// as a successful "empty" database assertion.
const missingInner=await testResponse("inner_sql_success_missing",
 {success:true,result:[{results:[{type:"table",name:"_cf_KV"}]}]},false);
const nullInner=await testResponse("inner_sql_success_null",
 {success:true,result:[{success:null,results:[{type:"table",name:"_cf_KV"}]}]},false);
const stringFalseInner=await testResponse("inner_sql_success_string_false",
 {success:true,result:[{success:"false",results:[{type:"table",name:"_cf_KV"}]}]},false);
const numericFalseInner=await testResponse("inner_sql_success_numeric_zero",
 {success:true,result:[{success:0,results:[{type:"table",name:"_cf_KV"}]}]},false);
const noInnerEmpty=await testResponse("inner_sql_success_missing_empty_schema",
 {success:true,result:[{results:[]}]},false);
const badAccepted=[missingInner,nullInner,stringFalseInner,numericFalseInner,noInnerEmpty].filter(x=>x.accepted);
assert.ok(badAccepted.length>0,"test must actually reproduce unsafe behavior or be updated to a post-fix FAIL-CLOSED assertion");
// Adversarial: a complete batch of DDL API result payloads with absent nested
// success=true can be mistaken for confirmed physical execution, while the
// separate mock SQL DDL was never actually called. Only synthetic transport.
const fx=mock({reserved:true});
const original=fx.fetchImpl;let unconfirmed=0;
const f={...fx,fetchImpl:async(url,opts)=>{
 const sql=opts.body?JSON.parse(opts.body).sql:null;
 if(url.endsWith("/query")&&/^(CREATE|INSERT)\s/i.test(sql||"")){
  unconfirmed++;
  return Response.json({success:true,result:[{results:[]}]});
 }
 return original(url,opts);
}};
let wronglyCertified=null;
try{
 wronglyCertified=await fakeEngine(base(f,{mode:"APPLY_ONCE"}),trusted);
}catch(e){wronglyCertified={error:e.message};}
const schemaCertifiedWithoutAck=wronglyCertified?.result==="TARGET_D1_SCHEMA_ONLY_55_PHYSICAL_SQL_READBACK_PASS"&&fx.writes===0;
console.log("AUDIT_PR1088_RESPONSE_TRUST "+JSON.stringify({
 classification:"SOURCE_LEVEL_ADVERSARIAL_RESULT_NOT_CLOUD_WRITE",
 prHead:"602c2822437148d8f9da6618551f9c2b4067cb4b",
 malformedInnerSuccessCases:5,
 wronglyAcceptedMalformedCases:badAccepted.length,
 unsafeCounterexamples:badAccepted.map(x=>x.name),
 unconfirmedDdlStatements:unconfirmed,
 fakeDdlActuallyPerformed:fx.writes,
 claimedRealSchemaInstalled:wronglyCertified?.physicalSchemaInstalled??false,
 claimedSchemaSuccessWithoutSqlAck:schemaCertifiedWithoutAck,
 noCloudflareCalls:true,
 correctedExpectedBehavior:"Malformed D1 result groups must be treated UNKNOWN and STOP_NO_RETRY before any DDL / VERIFY_ONLY approval.",
}));
assert.equal(unconfirmed,125,"all 125 malformed DDL response groups must be exercised");
assert.equal(fx.writes,0,"mock must not actually confirm any DDL execution");
assert.equal(schemaCertifiedWithoutAck,true,"reproduce absent-ack DDL certification bug");
console.log("AUDIT_PR1088_INDEPENDENT_REPRODUCTION_PASS_WITH_UNSAFE_SECURITY_VERDICT");
