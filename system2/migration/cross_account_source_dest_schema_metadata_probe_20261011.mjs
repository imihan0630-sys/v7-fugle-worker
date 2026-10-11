// Actual Cloudflare SOURCE/DEST schema metadata preflight; no data dumps or writes.
// Scoped to independently existing source and destination GitHub environments.
// SELECT on sqlite_schema is schema-only, with no user data or scan; sanitized output.
import {createHash} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
const hash=x=>createHash('sha256').update(String(x??'').toLowerCase()).digest('hex');
const hashRaw=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const role=process.argv[2],source=role==='SOURCE',target=role==='DEST';
if(!source&&!target)throw Error('ROLE_REQUIRED_SOURCE_OR_DEST');
const expected={
 SOURCE:{accountHash:'3a6732b4f599575098949e818ef9266c324929cf38644387bddc09e05497243b',dbHash:'9768891c958358067329099ab5cc10560633c47437713966ef02024c14c9fb80'},
 DEST:{accountHash:'27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55',dbHash:'95f48f4d37b8eb4c16919d037259a5ebc30a8057e1933db39a6e8f759b9874b9'}
}[role];
const account=process.env.S2_PREFLIGHT_ACCOUNT_ID;
const token=process.env.S2_PREFLIGHT_D1_TOKEN,workerToken=process.env.S2_PREFLIGHT_WORKERS_TOKEN||token;
const report={schemaVersion:'S2_CROSS_ACCOUNT_SCHEMA_REAL_METADATA_PREFLIGHT_20261011',role,startedAtUtc:new Date().toISOString(),
 physicalCloudflareRead:true,queries:["GET_D1_METADATA","SQLITE_SCHEMA_ONLY"],originalD1RowsExported:0,
 physicalD1ExportExecuted:false,physicalDestinationImportExecuted:false,cloudflareMutationCount:0,
 sourceSystem1Unmodified:true,privateAccountsTokensIncluded:false,errors:[]};
const outfile='/tmp/s2-migration-physical-'+role.toLowerCase()+'/sanitized-'+role.toLowerCase()+'.json';
function fail(x){throw Error(x)}
function checked(v,k){if(v?.success!==true||v?.errors?.length)fail(k+'_RESPONSE_FAIL');return v.result}
async function req(path,cred,method='GET',body){
 const r=await fetch('https://api.cloudflare.com/client/v4/accounts/'+account+path,{method,
 headers:{Authorization:'Bearer '+cred,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(30000)});
 const v=await r.json().catch(()=>null);if(!r.ok)fail(method+'_HTTP_'+r.status+'_'+path.split('/').slice(0,3).join('_').replace(/[^A-Z0-9_]/ig,''));
 return checked(v,method+'_CLOUDFLARE');
}
async function q(dbId,sql){
 const x=await req('/d1/database/'+dbId+'/query',token,'POST',{sql});
 if(!Array.isArray(x)||x.length!==1||x[0]?.success!==true||!Array.isArray(x[0].results))fail('SQLITE_SCHEMA_RESPONSE_INVALID');
 return x[0].results;
}
async function write(){
 await mkdir(outfile.substring(0,outfile.lastIndexOf('/')),{recursive:true});
 report.completedAtUtc=new Date().toISOString();
 await writeFile(outfile,JSON.stringify(report,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({role,state:report.state,sourceCronZero:report.sourceCronZero??null,
  physicalTables:report.schema?.tableCount??null,physicalIndexes:report.schema?.indexCount??null,
  physicalDbSizeBytes:report.database?.fileSizeBytes??null,cloudflareMutationCount:0,
  observedAtUtc:report.completedAtUtc}));
}
async function main(){
 if(!/^[0-9a-f]{32}$/i.test(account||'')||hash(account)!==expected.accountHash||!token||token.length<20)fail('ACCOUNT_OR_CREDENTIAL_INVALID');
 const d1=await req('/d1/database?per_page=100',token);
 if(!Array.isArray(d1))fail('DB_INVENTORY_MISSING');
 const matches=d1.filter(d=>d.name==='system2-research');
 if(matches.length!==1)fail('S2_D1_NOT_UNIQUE');
 const db=matches[0],id=db.uuid||db.id;
 if(hash(id)!==expected.dbHash)fail('S2_D1_UUID_WRONG_ACCOUNT');
 report.database={logicalName:db.name,uuidFingerprint:hash(id),fileSizeBytes:db.file_size??null,databaseCount:d1.length};
 if(source){
   const v8=d1.filter(d=>d.name==='v7-live');
   if(v8.length!==1)fail('V8_SOURCE_DB_NOT_PRESENT');
   if(!workerToken)fail('WORKER_METADATA_TOKEN_MISSING');
   const crons=await req('/workers/scripts/system2-shadow-research/schedules',workerToken);
   const rows=Array.isArray(crons)?crons:Array.isArray(crons?.schedules)?crons.schedules:null;
   report.sourceCronZero=Array.isArray(rows)&&rows.length===0;
   if(!report.sourceCronZero)fail('OLD_SOURCE_CRON_NOT_ZERO_ABORT');
   const v8crons=await req('/workers/scripts/fugle-test/schedules',workerToken);
   const v8rows=Array.isArray(v8crons)?v8crons:Array.isArray(v8crons?.schedules)?v8crons.schedules:null;
   report.system1CronCount=Array.isArray(v8rows)?v8rows.length:null;
   if(report.system1CronCount!==4)fail('V8_CRON_UNEXPECTED_ABORT');
 }
 if(!Number.isSafeInteger(report.database.fileSizeBytes)||report.database.fileSizeBytes<0)fail('D1_SIZE_NOT_NUMBER');
 if(report.database.fileSizeBytes>=500000000)fail('D1_FREE_SINGLE_DB_CAPACITY_EXCEEDED');
 const schemas=await q(id,"SELECT type,name,sql FROM sqlite_schema WHERE name LIKE 's2_%' OR name LIKE 'idx_s2_%' ORDER BY type,name");
 if(schemas.some(s=>!['table','index','view','trigger'].includes(s.type)||typeof s.name!=='string'||typeof s.sql!=='string'))fail('UNRECOGNIZED_SCHEMA_OBJECT');
 const tbl=schemas.filter(s=>s.type==='table'),idx=schemas.filter(s=>s.type==='index'),other=schemas.filter(s=>s.type!=='table'&&s.type!=='index');
 report.schema={tableCount:tbl.length,indexCount:idx.length,otherCount:other.length,
  tableNames:tbl.map(s=>s.name).sort(),indexNames:idx.map(s=>s.name).sort(),
  perObjectSchemaSha:schemas.map(s=>({name:s.name,type:s.type,sha256:hashRaw(s.sql)})),
  physicalAppliedSchemaHash:hashRaw(schemas.map(s=>[s.type,s.name,s.sql]))};
 if(target){
  if(tbl.length!==55||idx.length!==63)fail('DESTINATION_SCHEMA_NOT_55_63');
  const ver=await q(id,"SELECT schema_value FROM s2_schema_meta WHERE schema_key='schema_version' LIMIT 1");
  report.schema.schemaVersionReadback=ver[0]?.schema_value||null;
  if(report.schema.schemaVersionReadback!=='1.1')fail('DESTINATION_SCHEMA_VERSION_NOT_1_1');
 }
 report.sourceDataBackupPhysicallyDone=false;
 report.schemaCompatibilityPendingCrossAccountDiff=true;
 report.quotaHardLimitRespectedByNoDataScan=true;
 report.state='PHYSICAL_SCHEMA_METADATA_READBACK_SUCCESS_NOT_DATA_COPY';
 await write();
}
main().catch(async e=>{report.state='BLOCKED';report.errors=[String(e?.message||e).replace(/[0-9a-f]{32,}/ig,'REDACTED').slice(0,150)];
 try{await write()}catch{}process.exitCode=2});
