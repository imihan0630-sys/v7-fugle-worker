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

// AUDIT_LANE. Assertive NEW independent post-fix replay against original
// PR #1088's repaired HEAD; zero Cloudflare network or physical D1 writes.
// This is intentionally separate from the authoring REMEDIATION tests.
const selectResponses=[
 ["missing-inner-success",{success:true,result:[{results:[{type:"table",name:"_cf_KV"}]}]}],
 ["null-inner-success",{success:true,result:[{success:null,results:[{type:"table",name:"_cf_KV"}]}]}],
 ["string-false-inner-success",{success:true,result:[{success:"false",results:[{type:"table",name:"_cf_KV"}]}]}],
 ["numeric-zero-inner-success",{success:true,result:[{success:0,results:[{type:"table",name:"_cf_KV"}]}]}],
 ["missing-success-empty-schema",{success:true,result:[{results:[]}]}],
 ["ambiguous-outer-status",{result:[{success:true,results:[]}]}],
 ["multiple-success-result-groups",{success:true,result:[{success:true,results:[]},{success:true,results:[]}]}],
 ["inner-error-with-success",{success:true,result:[{success:true,errors:[{code:500}],results:[]}]}],
 ["outer-error-with-success",{success:true,errors:[{code:500}],result:[{success:true,results:[]}]}],
 ["malformed-error-field",{success:true,errors:"unknown",result:[{success:true,results:[]}]}],
];
const simulateSelect=async (label,response)=>{
 const fx=mock({reserved:true});
 const original=fx.fetchImpl;
 const replacement={...fx,fetchImpl:async(url,opts)=>{
  const sql=opts.body?JSON.parse(opts.body).sql:null;
  if(url.endsWith("/query")&&sql?.startsWith("SELECT type, name FROM sqlite_schema"))
   return Response.json(response);
  return original(url,opts);
 }};
 await assert.rejects(
  ()=>fakeEngine(base(replacement),trusted),
  err=>err.message.includes("D1_SQL_RESPONSE_NOT_CONFIRMED_NO_RETRY")||
       err.message.includes("D1_SQL_OUTCOME_UNKNOWN_NO_RETRY"),
  label+" MUST fail closed");
 assert.equal(fx.writes,0,label+" must never issue DDL");
};
for(const [label,response] of selectResponses)await simulateSelect(label,response);
const good=mock({reserved:true});
const goodRead=await fakeEngine(base(good),trusted);
assert.equal(goodRead.result,"PREWRITE_EMPTY_TARGET_VERIFIED_ONLY");
assert.equal(goodRead.platformReservedObjectsBefore,1);
assert.equal(good.writes,0);
const valid=mock({reserved:true});
const applied=await fakeEngine(base(valid,{mode:"APPLY_ONCE"}),trusted);
assert.equal(applied.result,"TARGET_D1_SCHEMA_ONLY_55_PHYSICAL_SQL_READBACK_PASS");
assert.equal(applied.appliedStatements,125);
assert.equal(valid.writes,125);
const unknowns=[
 [{type:"table",name:"_cf_KV"},{type:"view",name:"unknown_view"}],
 [{type:"table",name:"_cf_KV"},{type:"trigger",name:"unknown_trigger"}],
 [{type:"table",name:"_cf_KV"},{type:"index",name:"unknown_index"}],
 [{type:"table",name:"_cf_KV"},{type:"table",name:"_cf_UNKNOWN"}],
 [{type:"table",name:"_cf_KV"},{type:"table",name:"_cf_KV"}],
 [{type:"index",name:"_cf_KV"}],
];
for(const schema of unknowns){
 const fx=mock({reserved:true});
 const orig=fx.fetchImpl;
 const replacement={...fx,fetchImpl:async(url,opts)=>{
  const sql=opts.body?JSON.parse(opts.body).sql:null;
  if(url.endsWith("/query")&&sql?.startsWith("SELECT type, name FROM sqlite_schema"))
   return Response.json({success:true,result:[{success:true,results:schema}]});
  return orig(url,opts);
 }};
 await assert.rejects(()=>fakeEngine(base(replacement,{mode:"APPLY_ONCE"}),trusted));
 assert.equal(fx.writes,0);
}
for(const ordinal of Array.from({length:125},(_,i)=>i+1)){
 const fx=mock({reserved:true});const original=fx.fetchImpl;let attempts=0;
 const replacement={...fx,fetchImpl:async(url,opts)=>{
  const sql=opts.body?JSON.parse(opts.body).sql:null;
  if(url.endsWith("/query")&&/^(CREATE|INSERT)\s/i.test(sql||"")){
   attempts++;
   if(attempts===ordinal)
     return Response.json({success:true,result:[{results:[]}]});
  }
  return original(url,opts);
 }};
 let failed;
 try{await fakeEngine(base(replacement,{mode:"APPLY_ONCE"}),trusted);}
 catch(e){failed=e;}
 assert.ok(failed,"unconfirmed DDL "+ordinal+" must throw");
 assert.match(failed.message,/UNKNOWN_OR_PARTIAL_SCHEMA_INSTALL_DO_NOT_RETRY/);
 assert.equal(failed.appliedStatements,ordinal-1,"only affirmative prior DDL should count");
 assert.equal(fx.writes,ordinal-1,"mock counts should stop before ambiguous response");
 assert.equal(attempts,ordinal,"must not retry or continue after ambiguous result");
}
// A simulated network timeout/disconnect after N affirmative DDL statements:
// distinguish confirmed progress from the UNKNOWN current request and never retry.
for(const index of [1,17,64,125]){
 const fx=mock({reserved:true});const original=fx.fetchImpl;let attempts=0;
 const f={...fx,fetchImpl:async(url,opts)=>{
  const sql=opts.body?JSON.parse(opts.body).sql:null;
  if(url.endsWith("/query")&&/^(CREATE|INSERT)\s/i.test(sql||"")){
   attempts++;
   if(attempts===index)throw Error("SYNTHETIC_NETWORK_DISCONNECT");
  }
  return original(url,opts);
 }};
 let failed;try{await fakeEngine(base(f,{mode:"APPLY_ONCE"}),trusted);}catch(e){failed=e;}
 assert.ok(failed&&failed.message.includes("UNKNOWN_OR_PARTIAL_SCHEMA_INSTALL_DO_NOT_RETRY"));
 assert.equal(failed.appliedStatements,index-1);
 assert.equal(attempts,index);
}
const repeated=mock({reserved:true,notEmpty:true});
await assert.rejects(()=>fakeEngine(base(repeated,{mode:"APPLY_ONCE"}),trusted));
assert.equal(repeated.writes,0,"nonempty repeat must be blocked");
const wrongTarget=mock({reserved:true,wrongDb:true});
await assert.rejects(()=>fakeEngine(base(wrongTarget),trusted),/DESTINATION_D1_IDENTITY_MISMATCH/);
assert.equal(wrongTarget.writes,0);
const sourceTarget=mock({reserved:true});
await assert.rejects(()=>fakeEngine(base(sourceTarget,{accountId:A}),trusted),/DESTINATION_ACCOUNT_FINGERPRINT_MISMATCH/);
assert.equal(sourceTarget.writes,0);
assert.equal(seal.stagedMigrationsExcluded,1);
assert.equal(seal.createTables,55);
assert.equal(seal.createIndexes,63);
assert.equal(seal.schemaMetaUpserts,7);
const wf=readFileSync(".github/workflows/system2-destination-schema-only-manual.yml","utf8");
assert.match(wf,/workflow_dispatch:/);
assert.doesNotMatch(wf,/^\s+(?:schedule|push|pull_request):/m);
assert.match(wf,/environment: system2-schema-only/);
assert.doesNotMatch(wf,/wrangler deploy|S2_MIGRATION_SOURCE_READ_TOKEN/);
console.log("AUDIT_PR1088_1092_INDEPENDENT_POSTFIX "+JSON.stringify({
 verdict:"PASS_SOURCE_LEVEL_ONLY",
 exactPrHead:"68259cda7993b997ac030276210631d5a396e187",
 malformedSelectRejects:selectResponses.length,
 unknownSchemaRejects:unknowns.length,
 unconfirmedDdlOrdinalRejects:125,
 transportInterruptionRejects:4,
 positiveVerifyOnly:true,
 positive125StatementSyntheticApply:true,
 physicalCloudflareQueries:0,
 physicalSchemaTablesInstalledClaimed:false,
 cloudSqlWrites:0,
}));
