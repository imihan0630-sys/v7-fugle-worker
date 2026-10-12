// OWNER EXPLICIT WAIVER 2026-10-12: RAW_ARCHIVE_ONLY D1 transfer.
// G3 PIT/Frozen/escrow are NOT pre-copy gates; original historical PIT is NOT certified.
// Destination only; no source D1 calls, no V8, Worker, Cron, R2 or paid mutations.
import {createHash,createDecipheriv,hkdfSync,privateDecrypt,constants} from "node:crypto";
import {readFile,writeFile,mkdir,rm,stat} from "node:fs/promises";
import {createReadStream,createWriteStream} from "node:fs";
import {createInterface} from "node:readline";
import {pipeline} from "node:stream/promises";
import {Transform} from "node:stream";
import {createGunzip} from "node:zlib";
import {spawn} from "node:child_process";
import {auditOriginalA1ImportedParity,auditOriginalBatchMetadataParity} from "./owner_override_existing_a1_parity_v0_1.mjs";

const out="/tmp/s2-owner-override-raw-copy",archive="/tmp/s2-owner-override-input";
const acctHash="27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55";
const dbHash="95f48f4d37b8eb4c16919d037259a5ebc30a8057e1933db39a6e8f759b9874b9";
const sourceSqlSha="56cd6ebc449949d67a7123da2a2300d685f3d5a2412383a3afc217001c4e5f12";
const cipherSha="f6bfdff72080008e593b479409117d8260afdbb70b73da7c197d67b8faa6dad1";
const limit=80000, stopAt=75000, maxStatementRows=80; // one JSON bind per insert, D1 hard max 100
const sha=x=>createHash("sha256").update(x).digest("hex");
const day=()=>new Date().toISOString().slice(0,10);
const fail=x=>{throw Error("S2_OWNER_RAW_COPY_"+x)};
const report={schemaVersion:"S2_OWNER_OVERRIDE_DEST_RAW_COPY_V0_1",ownerOverride:true,
  classification:"RAW_ARCHIVE_ONLY_PIT_UNVERIFIED_NO_QUALIFIED_ASOF_REPLAY",
  sourceFrozenDecisionsExpected:0,sourceBarsExpected:84688,sourceBatchesExpected:129,
  accountDailyBilledRowsLimit:100000,ownerOperationalBudgetBilledRows:limit,
  sourceExportRepeated:false,sourceDataMutations:0,
  v8Mutations:0,workerOrCronActivations:0,paidResources:0,
  dayStartedUtc:day(),rowsInsertedThisRun:0,chargedRowsWrittenThisRun:0,
  chunksAttempted:0,sourceR2ManifestCopy:false,completed:false,canPromotePIT:false,
  status:"NOT_STARTED"};

async function originalSQL() {
  const token=process.env.S2_SCHEMA_DEST_D1_WRITE_TOKEN,account=process.env.S2_SCHEMA_DEST_ACCOUNT_ID;
  if(!token||!account||sha(account.toLowerCase())!==acctHash)fail("ACCOUNT_IDENTITY");
  const k=JSON.parse(await readFile(archive+"/key/destination-private-key-sealed.json","utf8"));
  const pem=await readFile(archive+"/key/destination-public.pem","utf8");
  const t=JSON.parse(await readFile(archive+"/source/rsa-wrapped-transfer-meta.json","utf8"));
  const file=archive+"/source/source-sql-rewrapped-for-destination.gz.gcm";
  if(sha(pem)!==k.publicKeySha256||t.publicKeySha256!==sha(pem)||t.ciphertextSha256!==cipherSha||
     t.oldSqlSHA256!==sourceSqlSha||t.oldBackupRunId!==38150147134)fail("SOURCE_ARCHIVE_IDENTITY");
  const encrypted=await readFile(file);
  if(sha(encrypted)!==cipherSha||encrypted.length!==t.ciphertextBytes)fail("CIPHERTEXT_HASH");
  const key=hkdfSync("sha256",Buffer.from(token),Buffer.from(k.salt,"hex"),
    Buffer.from("S2_DEST_SOURCE_SQL_RSA_PRIVKEY_KDF_V1"),32);
  const kd=createDecipheriv("aes-256-gcm",key,Buffer.from(k.iv,"hex"));
  kd.setAuthTag(Buffer.from(k.authTag,"hex"));
  const privatePem=Buffer.concat([kd.update(Buffer.from(k.ciphertext,"base64")),kd.final()]);
  const contentKey=privateDecrypt({key:privatePem,padding:constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash:"sha256"},Buffer.from(t.wrappedContentKey,"base64"));
  const dec=createDecipheriv("aes-256-gcm",contentKey,Buffer.from(t.iv,"hex"));
  dec.setAuthTag(Buffer.from(t.authTag,"hex"));
  const plain=out+"/original.sql",h=createHash("sha256");let size=0;
  const tap=new Transform({transform(chunk,enc,cb){h.update(chunk);size+=chunk.length;cb(null,chunk)}});
  await pipeline(createReadStream(file),dec,createGunzip(),tap,createWriteStream(plain,{mode:0o600}));
  if(h.digest("hex")!==sourceSqlSha||size!==316938975)fail("PLAIN_SQL_IDENTITY");
  return plain;
}
async function extract(sql) {
  const metadata=await new Promise((resolve,reject)=>{
    const c=spawn("python3",["system2/migration/owner_override_source_raw_export_20261012.py",sql,out],
      {stdio:["ignore","pipe","pipe"]});
    let stdout="";
    c.stdout.on("data",x=>{stdout+=x.toString();if(stdout.length>4096)c.kill()});
    c.stderr.on("data",()=>{});
    c.on("close",exit=>{if(exit!==0)return reject(Error("S2_OWNER_RAW_COPY_LOCAL_EXTRACT"));
      try{resolve(JSON.parse(stdout))}catch{reject(Error("S2_OWNER_RAW_COPY_LOCAL_EXTRACT_JSON"))}});
  });
  if(metadata.bars!==84688||metadata.batches!==129||metadata.sourceRows!==113222)
    fail("LOCAL_SOURCE_COUNTERS");
  const m=JSON.parse(await readFile(out+"/meta.json","utf8"));
  if(m.pitHistoricallyCertified!==false||m.frozenDecisionRows!==0)fail("SOURCE_CLASSIFICATION");
  return m;
}
let dbid,account,token;
async function api(path,method="GET",body=null){
  if(day()!==report.dayStartedUtc)fail("UTC_QUOTA_DAY_ROLLOVER");
  const response=await fetch("https://api.cloudflare.com/client/v4/accounts/"+account+path,{
    method,headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json"},
    ...(body===null?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(45000)});
  const d=await response.json().catch(()=>null);
  if(!response.ok||d?.success!==true){
    report.providerError={operation:path.includes("/query")?"DEST_D1_SQL":"DEST_D1_LIST",
      httpStatus:response.status,codes:Array.isArray(d?.errors)?d.errors.slice(0,4).map(x=>x.code??"NO_CODE"):[]};
    fail("PROVIDER_REQUEST_FAILED");
  }
  return d.result;
}
async function query(sql,params=[]){
  const r=await api("/d1/database/"+dbid+"/query","POST",{sql,params});
  if(!Array.isArray(r)||r.length!==1||r[0].success!==true)fail("D1_QUERY_RESPONSE");
  return r[0];
}
async function checkDestination(){
  account=process.env.S2_SCHEMA_DEST_ACCOUNT_ID;token=process.env.S2_SCHEMA_DEST_D1_WRITE_TOKEN;
  if(!account||!token||sha(account.toLowerCase())!==acctHash)fail("DEST_ACCOUNT");
  const databases=await api("/d1/database?per_page=100");
  if(!Array.isArray(databases)||databases.length!==1||databases[0].name!=="system2-research")fail("DEST_DATABASE_UNIVERSE");
  const db=databases[0];dbid=db.uuid||db.id;
  if(sha(dbid.toLowerCase())!==dbHash||db.file_size>450000000)fail("DEST_DB_IDENTITY_OR_STORAGE");
  const s=await query("SELECT type,name FROM sqlite_schema WHERE name LIKE 's2_%' OR name LIKE 'idx_s2_%'");
  const names=s.results||[],tbl=names.filter(x=>x.type==="table").length,idx=names.filter(x=>x.type==="index").length;
  if(tbl!==55||idx!==63)fail("DEST_SCHEMA_MISMATCH");
  const jsonProbe=await query("SELECT json_extract(value,'$[0]') AS v FROM json_each(?)",
    [JSON.stringify([[7],[11]])]);
  if(jsonProbe.results?.length!==2||jsonProbe.results[0].v!==7||jsonProbe.results[1].v!==11)
    fail("DEST_JSON1_EXTENSION_UNVERIFIED");
  const check=await query("SELECT (SELECT count(*) FROM s2_historical_ingest_batches) as batches, (SELECT count(*) FROM s2_historical_a1_bars) as bars, (SELECT count(*) FROM s2_decisions) as decisions");
  const found=check.results?.[0];
  if(!found||found.batches>129||found.bars>84688||found.decisions!==0)fail("DEST_UNEXPECTED_ROWS");
  report.before={barRows:found.bars,batchRows:found.batches,sourceDecisions:found.decisions};
}
async function* lines(path) {
  const iter=createInterface({input:createReadStream(path,{encoding:"utf8"}),crlfDelay:Infinity});
  for await(const line of iter){if(line)yield JSON.parse(line)}
}
async function insertRows(table,columns,values){
  if(!values.length)return;
  if(values.length>maxStatementRows||values.some(x=>x.length!==columns.length))fail("INVALID_INSERT_ROWS");
  // Four thousand billed-row buffer prevents one SQL chunk crossing the user 80k ceiling.
  if(report.chargedRowsWrittenThisRun+4000>=stopAt) return false;
  if(day()!==report.dayStartedUtc)fail("UTC_DAY_CHANGED");
  const names=columns.map(c=>'"'+c.replace(/"/g,'""')+'"').join(",");
  // D1 has an official hard limit of 100 bound parameters / statement.
  // JSON1 is supported by Cloudflare D1: expand rows from just ONE JSON parameter.
  const selectors=columns.map((_,i)=>"json_extract(value,'$["+i+"]')").join(",");
  const sql='INSERT OR IGNORE INTO "'+table+'" ('+names+') SELECT '+selectors+' FROM json_each(?)';
  const payload=JSON.stringify(values);
  if(Buffer.byteLength(payload)>1000000)fail("BOUND_JSON_PAYLOAD_TOO_LARGE");
  const res=await query(sql,[payload]);
  report.chunksAttempted++;
  const used=res.meta?.rows_written;
  if(!Number.isSafeInteger(used)||used<0)fail("BILLED_WRITE_METADATA_MISSING_AFTER_WRITE_STOP");
  report.chargedRowsWrittenThisRun+=used;
  const inserted=Number.isSafeInteger(res.meta?.changes)?res.meta.changes:0;
  report.rowsInsertedThisRun+=inserted;
  if(report.chargedRowsWrittenThisRun>limit)fail("OWNER_DAILY_BUDGET_EXCEEDED");
  return true;
}
async function copy(){
 const m=JSON.parse(await readFile(out+"/meta.json","utf8"));
 const batchCols=m.columns.s2_historical_ingest_batches,barCols=m.columns.s2_historical_a1_bars;
 // S2 #1068: QUARANTINE this run BEFORE ANY INSERT if one prior row is
 // not byte-identity backed by the original SHA-verified SOURCE archive.
 // This read-only query checks every already-copied bar, not only aggregate counts.
 report.phase="PRECOPY_REAL_DEST_ORIGINAL_SOURCE_EXACT_PARITY";
 report.existingA1SourceHashParity=await auditOriginalA1ImportedParity({
   sourceRows:lines(out+"/bars.jsonl"),sourceColumns:barCols,
   query,expectedTargetRows:report.before.barRows
 });
 report.existingIngestManifestParity=await auditOriginalBatchMetadataParity({
   sourceRows:lines(out+"/batches.jsonl"),sourceColumns:batchCols,
   query,expectedTargetRows:report.before.batchRows
 });
 report.phase="DEST_RAW_A1_COPY";
 let pack=[];
 for await(const row of lines(out+"/batches.jsonl")){
   pack.push(row);
   if(pack.length===maxStatementRows){if(!await insertRows("s2_historical_ingest_batches",batchCols,pack))fail("BATCH_MANIFEST_BUDGET");pack=[];}
 }
 if(pack.length&&!await insertRows("s2_historical_ingest_batches",batchCols,pack))fail("BATCH_MANIFEST_BUDGET");
 const bc=await query("SELECT count(*) as c FROM s2_historical_ingest_batches");
 if(bc.results?.[0]?.c!==129)fail("BATCH_MANIFEST_READBACK");
 // Never replay history for trading or qualified performance; retain original source fields literally.
 // The target Worker and Cron are deliberately NOT activated.
 const prior=await query("SELECT batch_id, count(*) as n FROM s2_historical_a1_bars GROUP BY batch_id");
 const counts=new Map((prior.results||[]).map(x=>[x.batch_id,x.n]));
 const sourceCounts=new Map();
 for await (const row of lines(out+"/bars.jsonl")){
   const batch=row[barCols.indexOf("batch_id")];
   sourceCounts.set(batch,(sourceCounts.get(batch)||0)+1);
 }
 let buf=[],currentBatch=null,seenInCurrent=0;
 for await(const row of lines(out+"/bars.jsonl")){
   const batch=row[barCols.indexOf("batch_id")];
   if(currentBatch!==batch){
     if(buf.length){if(!await insertRows("s2_historical_a1_bars",barCols,buf))break;buf=[]}
     currentBatch=batch;seenInCurrent=0;
   }
   seenInCurrent++;
   if((counts.get(batch)||0)===sourceCounts.get(batch))continue;
   if((counts.get(batch)||0)>sourceCounts.get(batch))fail("DEST_SOURCE_BATCH_MISMATCH");
   buf.push(row);
   if(buf.length===maxStatementRows){if(!await insertRows("s2_historical_a1_bars",barCols,buf)){buf=[];break}buf=[];}
 }
 if(buf.length)await insertRows("s2_historical_a1_bars",barCols,buf);
 const after=await query("SELECT (SELECT count(*) FROM s2_historical_a1_bars) as bars,(SELECT count(*) FROM s2_historical_ingest_batches) as batches");
 const n=after.results?.[0];
 if(!n||n.batches!==129||n.bars<report.before.barRows||n.bars>84688)fail("FINAL_COUNT_INCONSISTENT");
 report.after={barRows:n.bars,batchRows:n.batches};
 // Post-insert physical row integrity. Count agreement alone can conceal
 // INSERT OR IGNORE skipping a source-divergent conflict.
 report.phase="POSTCOPY_REAL_DEST_ORIGINAL_SOURCE_EXACT_PARITY";
 report.afterA1SourceHashParity=await auditOriginalA1ImportedParity({
   sourceRows:lines(out+"/bars.jsonl"),sourceColumns:barCols,
   query,expectedTargetRows:n.bars
 });
 report.afterIngestManifestParity=await auditOriginalBatchMetadataParity({
   sourceRows:lines(out+"/batches.jsonl"),sourceColumns:batchCols,
   query,expectedTargetRows:n.batches
 });
 report.phase="DEST_RAW_A1_COPY_VERIFIED";
 report.completed=n.bars===84688;
 report.status=report.completed?"A1_RAW_HISTORY_COPY_COMPLETE_PIT_UNVERIFIED":
   "A1_RAW_HISTORY_PARTIAL__RESUME_NEXT_UTC_DAY";
}
async function main(){
 await mkdir(out,{recursive:true,mode:0o700});
 report.phase="DEST_PROVIDER_PREFLIGHT";
 await checkDestination();
 report.phase="SOURCE_ARCHIVE_DECRYPT";
 const sql=await originalSQL();
 report.phase="SOURCE_OFFLINE_RESTORE";
 await extract(sql);
 await rm(sql,{force:true});
 report.phase="DEST_RAW_A1_COPY";
 await copy();
}
try{
  await main();
}catch(e){
  report.status=report.status==="NOT_STARTED"?"FAILED_BEFORE_OR_DURING_COPY":"FAILED_AFTER_PARTIAL_COPY";
  report.error=/^S2_OWNER_RAW_COPY_[A-Z_]+$/.test(String(e.message))?e.message:"S2_OWNER_RAW_COPY_FAIL_CLOSED";
  process.exitCode=2;
}finally{
  report.completedAtUtc=new Date().toISOString();
  await mkdir(out,{recursive:true}).catch(()=>{});
  await writeFile(out+"/sanitized-copy-receipt.json",JSON.stringify(report,null,2)+"\n",{mode:0o600}).catch(()=>{});
  console.log(JSON.stringify({status:report.status,charged:report.chargedRowsWrittenThisRun,
    inserted:report.rowsInsertedThisRun,after:report.after||null,error:report.error||null}));
  await Promise.all(["/original.sql","/source.sqlite","/batches.jsonl","/bars.jsonl"].map(p=>rm(out+p,{force:true}).catch(()=>{})));
}
