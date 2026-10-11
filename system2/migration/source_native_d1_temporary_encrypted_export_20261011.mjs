// Owner-approved real SOURCE System2 D1 backup, encrypted before any artifact upload.
// Does not query or mutate V8 D1; never outputs SQL, signed URLs, bearer tokens,
// original row data, or unencrypted archive to public GitHub artifacts.
// Temporary recoverability depends on existing SOURCE_D1_TOKEN; rotate only after
// independent migration/archive re-encryption. No new Secrets or paid Cloudflare.
import {createHash,randomBytes,hkdfSync,createCipheriv,createDecipheriv} from "node:crypto";
import {mkdir,writeFile,stat,readFile,rm,createReadStream,createWriteStream} from "node:fs/promises";
import {createReadStream as streamRead,createWriteStream as streamWrite} from "node:fs";
import {Readable,Transform} from "node:stream";
import {pipeline} from "node:stream/promises";
import {createGzip,createGunzip} from "node:zlib";
import {spawn} from "node:child_process";
const account=process.env.CLOUDFLARE_ACCOUNT_ID,token=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN,workersToken=process.env.CLOUDFLARE_API_TOKEN;
const sha=x=>createHash("sha256").update(String(x).toLowerCase()).digest("hex");
const SHA_ACCOUNT="3a6732b4f599575098949e818ef9266c324929cf38644387bddc09e05497243b";
const SHA_SOURCE_DB="9768891c958358067329099ab5cc10560633c47437713966ef02024c14c9fb80";
const dir="/tmp/s2-source-private-encrypted-export";
const maxCompressed=65000000,maxPlain=1200000000; // avoid unbounded public Actions artifact storage.
const sleep=t=>new Promise(ok=>setTimeout(ok,t));
const receipt={schemaVersion:"S2_SOURCE_D1_TEMP_AES_GCM_BACKUP_20261011_V0_1",
 role:"OLD_SOURCE_SYSTEM2_D1_ONLY",accountHash:SHA_ACCOUNT,d1Hash:SHA_SOURCE_DB,
 ownerExtraV8QuotaReserveCancelled:true,originV8Touched:false,oldSourceCronModified:false,
 destinationD1Written:false,cloudflareD1TableMutations:0,cloudflareBackupExportRequested:false,
 sourceSQLLoggedOrUploadedPlaintext:false,encryption:"AES-256-GCM_GZIP_HKDF_EXISTING_SOURCE_D1_TOKEN",
 keyMaterialPublished:false,newSecretsOrCloudflarePermissions:0,paidCloudflareServicesProvisioned:0,
 startedAtUtc:new Date().toISOString(),result:"BLOCKED_PENDING",blocker:null};
function halt(s){throw new Error(s)}
async function api(path,cred,method="GET",body){
 const res=await fetch("https://api.cloudflare.com/client/v4/accounts/"+account+path,{
  method,headers:{Authorization:"Bearer "+cred,"Content-Type":"application/json"},
  ...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(30000)});
 if(!res.ok)halt(method+"_HTTP_"+res.status);
 const out=await res.json().catch(()=>null);
 if(out?.success!==true)halt(method+"_NOT_SUCCESS");
 return out.result;
}
async function runPythonRestore(sqlFile){
 const py=`import os,sqlite3,json,sys
path=sys.argv[1]
con=sqlite3.connect('/tmp/s2-source-verify-restore.db')
con.execute("PRAGMA journal_mode=OFF")
con.execute("PRAGMA synchronous=OFF")
con.execute("PRAGMA foreign_keys=OFF")
with open(path,'r',encoding='utf-8') as f:
    sql=f.read()
con.executescript(sql)
del sql
status=con.execute("PRAGMA quick_check").fetchone()[0]
tables=[x[0] for x in con.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 's2_%'").fetchall()]
idx=[x[0] for x in con.execute("SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_s2_%'").fetchall()]
counts={}
for table in tables:
    if not all(z.isalnum() or z=='_' for z in table): raise ValueError('TABLE_IDENTIFIER')
    counts[table]=con.execute('SELECT COUNT(*) FROM "'+table+'"').fetchone()[0]
print(json.dumps({'quickCheck':status,'tableCount':len(tables),'indexCount':len(idx),'tableRows':counts,'totalRows':sum(counts.values())},sort_keys=True))
con.close()`;
 return new Promise((resolve,reject)=>{
  const child=spawn("python3",["-c",py,sqlFile],{stdio:["ignore","pipe","pipe"]});
  let output="",err="";
  child.stdout.on("data",x=>output+=x.toString().slice(0,120000));
  child.stderr.on("data",x=>err+=x.toString().slice(0,200));
  child.on("close",code=>code===0?resolve(JSON.parse(output)):reject(Error("LOCAL_RESTORE_"+code)));
 });
}
async function main(){
 if(!/^[0-9a-f]{32}$/i.test(account||"")||sha(account)!==SHA_ACCOUNT||!token||!workersToken)halt("SOURCE_ENV_INVALID");
 await mkdir(dir,{recursive:true,mode:0o700});
 const list=await api("/d1/database?per_page=100",token);
 if(!Array.isArray(list)||list.filter(x=>x.name==="system2-research").length!==1||list.filter(x=>x.name==="v7-live").length!==1)halt("SOURCE_D1_INVENTORY_NOT_EXACT");
 const db=list.find(x=>x.name==="system2-research"),uuid=db.uuid||db.id;
 if(sha(uuid)!==SHA_SOURCE_DB)halt("SOURCE_DB_IDENTITY_DRIFT");
 const info=await api("/d1/database/"+uuid,token);
 if(info.name!=="system2-research"||!Number.isSafeInteger(info.file_size)||info.file_size<50000000||info.file_size>500000000)halt("SOURCE_D1_SIZE_OUT_OF_SCOPE");
 receipt.sourceSizeBytes=info.file_size;
 const sched=await api("/workers/scripts/system2-shadow-research/schedules",workersToken);
 const arr=Array.isArray(sched)?sched:sched?.schedules;
 if(!Array.isArray(arr)||arr.length!==0)halt("SOURCE_CRON_NONZERO");
 const s1=await api("/workers/scripts/fugle-test/schedules",workersToken);
 if(!(Array.isArray(s1)?s1:s1?.schedules)?.length|| (Array.isArray(s1)?s1:s1.schedules).length!==4)halt("V8_CRON_DRIFT");
 receipt.sourceCronZero=true;receipt.v8CronCount=4;
 // An API export can temporarily block **SOURCE System2 D1 only**, not V8 DB.
 receipt.cloudflareBackupExportRequested=true;
 let response=await api("/d1/database/"+uuid+"/export",token,"POST",{output_format:"polling"});
 let bookmark=response?.at_bookmark||null,signedUrl=null,attempts=1,filename=null;
 while(true){
  if(response?.status==="error")halt("D1_EXPORT_PROVIDER_ERROR");
  if(response?.status==="complete"&&typeof response?.result?.signed_url==="string"){
   signedUrl=response.result.signed_url;filename=response.result.filename||null;break;
  }
  if(!bookmark)halt("D1_EXPORT_MISSING_POLL_BOOKMARK");
  if(attempts>=140)halt("D1_EXPORT_POLL_MAX_REACHED");
  await sleep(3000);
  response=await api("/d1/database/"+uuid+"/export",token,"POST",{output_format:"polling",current_bookmark:bookmark});
  attempts++;
 }
 receipt.exportPollCount=attempts;receipt.originalExportFilenameFingerprint=sha(filename||"UNKNOWN");
 const salt=randomBytes(24),iv=randomBytes(12);
 const key=hkdfSync("sha256",Buffer.from(token),salt,Buffer.from("S2_CROSS_ACCOUNT_SOURCE_SQL_TEMP_ARCHIVE_20261011"),32);
 const cipher=createCipheriv("aes-256-gcm",key,iv);
 const sqlHash=createHash("sha256");
 let plainBytes=0;
 const signed=await fetch(signedUrl,{signal:AbortSignal.timeout(300000)});
 if(!signed.ok||!signed.body)halt("SIGNED_SQL_FETCH_FAILED_"+signed.status);
 const encPath=dir+"/source-system2-private.sql.gz.aes256gcm";
 const auditChunk=new Transform({transform(chunk,encoding,callback){
  plainBytes+=chunk.length;if(plainBytes>maxPlain)return callback(Error("RAW_SQL_LARGER_THAN_ALLOWED"));
  sqlHash.update(chunk);callback(null,chunk);
 }});
 await pipeline(Readable.fromWeb(signed.body),auditChunk,createGzip({level:6}),cipher,streamWrite(encPath,{mode:0o600}));
 const tag=cipher.getAuthTag(),sz=(await stat(encPath)).size;
 receipt.plainSqlByteSize=plainBytes;
 receipt.plainSqlSHA256=sqlHash.digest("hex");
 receipt.ciphertextByteSize=sz;
 receipt.zipCompressionRatio=Number((sz/Math.max(1,plainBytes)).toFixed(4));
 if(sz>maxCompressed)halt("CIPHERTEXT_GT_65MB_NO_UPLOAD_CHARGE");
 receipt.kdfSaltHex=salt.toString("hex");receipt.ivHex=iv.toString("hex");receipt.authTagHex=tag.toString("hex");
 const dec=createDecipheriv("aes-256-gcm",key,iv);dec.setAuthTag(tag);
 const restoredSql=dir+"/RESTORED_LOCAL_ONLY_DO_NOT_UPLOAD.sql";
 let decSha=createHash("sha256");
 const digest=new Transform({transform(chunk,enc,cb){decSha.update(chunk);cb(null,chunk)}});
 await pipeline(streamRead(encPath),dec,createGunzip(),digest,streamWrite(restoredSql,{mode:0o600}));
 if(decSha.digest("hex")!==receipt.plainSqlSHA256)halt("DECRYPT_RESTORED_SQL_SHA_MISMATCH");
 const restore=await runPythonRestore(restoredSql);
 if(restore.quickCheck!=="ok"||restore.tableCount!==55||restore.indexCount!==63)halt("FULL_SQLITE_RESTORE_INTEGRITY_OR_SCHEMA_FAIL");
 receipt.offlineRestoreVerified=true;
 receipt.offlineSourceTables=restore.tableCount;receipt.offlineSourceIndexes=restore.indexCount;
 receipt.offlineTotalRows=restore.totalRows;
 receipt.frozenDecisionRows=restore.tableRows.s2_decisions;
 receipt.rowsPerTable=restore.tableRows;
 receipt.minDestinationD1FreeDaysWithoutIndexAmplification=Math.ceil(restore.totalRows/100000);
 receipt.sourceD1Unmodified=true;
 await rm(restoredSql,{force:true});await rm("/tmp/s2-source-verify-restore.db",{force:true});
 receipt.result="REAL_NATIVE_SOURCE_D1_FULL_SQL_ENCRYPTED_BACKUP_OFFLINE_RESTORE_VERIFIED";
 receipt.backupRetentionLimits="GITHUB_ARTIFACT_TEMP_ONLY_14_DAYS; SOURCE_TOKEN_DERIVED_DECRYPTION_KEY; NOT_LONG_TERM_IMMUTABLE_STORAGE";
}
try{await main()}catch(e){
 receipt.blocker=String(e?.message||e).replace(/[a-f0-9]{32,}/gi,"REDACTED").slice(0,120);
 receipt.result="BLOCKED_OR_INCOMPLETE_REAL_EXPORT_NOT_CLAIMED_BACKUP";
 // Never upload incomplete ciphertext, possibly containing private rows.
 try{await rm(dir+"/source-system2-private.sql.gz.aes256gcm",{force:true})}catch{}
 process.exitCode=2;
}finally{
 await mkdir(dir,{recursive:true,mode:0o700});
 receipt.completedAtUtc=new Date().toISOString();
 await writeFile(dir+"/sanitized-backup-receipt.json",JSON.stringify(receipt,null,2)+"\n",{flag:"wx",mode:0o600});
 console.log(JSON.stringify({result:receipt.result,sourceCronZero:receipt.sourceCronZero??null,
  sourceDatabaseSize:receipt.sourceSizeBytes??null,cloudflareBackupExportRequested:receipt.cloudflareBackupExportRequested,
  totalRows:receipt.offlineTotalRows??null,ciphertextSize:receipt.ciphertextByteSize??null,
  offlineRestoreVerified:receipt.offlineRestoreVerified??false,blocker:receipt.blocker,completedAtUtc:receipt.completedAtUtc}));
}
