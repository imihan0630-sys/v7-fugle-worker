// Real encrypted D1 source-to-destination **transit** without sharing Cloudflare tokens.
// DEST_KEYGEN: destination env generates RSA public key + privately sealed RSA key.
// SOURCE_REWRAP: old source env decrypts original encrypted source backup directly
// to a NEW RSA-wrapped AES-GCM gzip ciphertext, no plaintext disk/Artifact.
// DEST_VERIFY: destination env opens it, restores source SQL locally only, and
// reads destination D1 GET/SELECT schema/counters, NEVER writes target data.
// Temporary artifact retention only. This is NOT migration G4 completion.
import {generateKeyPairSync,randomBytes,hkdfSync,createHash,createCipheriv,createDecipheriv,publicEncrypt,privateDecrypt,constants} from "node:crypto";
import {readFile,writeFile,mkdir,rm,stat} from "node:fs/promises";
import {createReadStream,createWriteStream} from "node:fs";
import {pipeline} from "node:stream/promises";
import {Transform,Writable} from "node:stream";
import {createGunzip} from "node:zlib";
import {spawn} from "node:child_process";
const role=process.argv[2],dir="/tmp/s2-secure-d1-bridge",sha=x=>createHash("sha256").update(x).digest("hex");
const oldAccountSha="3a6732b4f599575098949e818ef9266c324929cf38644387bddc09e05497243b";
const newAccountSha="27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55";
const targetDbSha="95f48f4d37b8eb4c16919d037259a5ebc30a8057e1933db39a6e8f759b9874b9";
const oldSqlSha="56cd6ebc449949d67a7123da2a2300d685f3d5a2412383a3afc217001c4e5f12";
function digestLower(s){return sha(String(s||"").toLowerCase())}
function bad(m){throw Error(m)}
const out={schemaVersion:"S2_CROSS_ENV_RSA_OAEP_AES_GCM_D1_TRANSFER_V0_1",stage:role,
 noSourceOrDestCloudflareDataMutations:true,newSecrets:0,newPaidServices:0,
 plaintextOrKeyPublished:false,startedAtUtc:new Date().toISOString(),result:"BLOCKED"};
async function persist(){
 await mkdir(dir,{recursive:true,mode:0o700});
 out.completedAtUtc=new Date().toISOString();
 const name={DEST_KEYGEN:"destination-key-receipt.json",SOURCE_REWRAP:"source-transfer-receipt.json",DEST_VERIFY:"destination-verification-receipt.json",DEST_PIT_PLAN:"destination-pit-plan-receipt.json"}[role]||"bad-role-receipt.json";
 await writeFile(dir+"/"+name,JSON.stringify(out,null,2)+"\n",{flag:"wx",mode:0o600});
 console.log(JSON.stringify({stage:role,result:out.result,sourceSqlHashConfirmed:out.sourceSqlHashConfirmed??false,
  destinationD1Confirmed:out.destinationD1Confirmed??false,rows:out.restoredRowCount??null,
  targetExistingBars:out.destinationExistingBars??null,cloudflareDataWrites:0,error:out.error??null,completedAtUtc:out.completedAtUtc}));
}
async function getJson(name){return JSON.parse(await readFile(name,"utf8"))}
async function localRestore(sqlFile){
 const py=`import sqlite3,sys,json
s=open(sys.argv[1],"r",encoding="utf-8").read()
c=sqlite3.connect('/tmp/s2-bridge-verified-local.db')
c.executescript(s)
del s
check=c.execute("PRAGMA quick_check").fetchone()[0]
tabs=[r[0] for r in c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 's2_%'")]
idx=c.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='index' AND name LIKE 'idx_s2_%'").fetchone()[0]
rows=sum(c.execute('SELECT COUNT(*) FROM "'+t+'"').fetchone()[0] for t in tabs)
decisions=c.execute('SELECT COUNT(*) FROM s2_decisions').fetchone()[0]
print(json.dumps({"quickCheck":check,"tables":len(tabs),"indexes":idx,"rows":rows,"decisions":decisions}))
c.close()`;
 return new Promise((resolve,reject)=>{
 const ch=spawn("python3",["-c",py,sqlFile],{stdio:["ignore","pipe","pipe"]});let stdout="";
 ch.stdout.on("data",x=>stdout+=x.toString());ch.stderr.on("data",()=>{});
 ch.on("close",code=>{if(code!==0)return reject(Error("LOCAL_RESTORE_FAILED"));try{resolve(JSON.parse(stdout))}catch{reject(Error("RESTORE_OUTPUT_INVALID"))}});
 });
}
async function api(account,token,path,method="GET",body=null){
 const response=await fetch("https://api.cloudflare.com/client/v4/accounts/"+account+path,{method,
  headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},
  ...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(25000)});
 const data=await response.json().catch(()=>null);
 if(!response.ok||data?.success!==true)bad("DEST_READ_UNAVAILABLE");
 return data.result;
}
async function run(){
 if(!["DEST_KEYGEN","SOURCE_REWRAP","DEST_VERIFY","DEST_PIT_PLAN"].includes(role))bad("INVALID_ROLE");
 await mkdir(dir,{recursive:true,mode:0o700});
 if(role==="DEST_KEYGEN"){
  const token=process.env.S2_SCHEMA_DEST_D1_WRITE_TOKEN,account=process.env.S2_SCHEMA_DEST_ACCOUNT_ID;
  if(!token||!account||digestLower(account)!==newAccountSha)bad("DEST_ENV_MISSING_OR_WRONG");
  const {publicKey,privateKey}=generateKeyPairSync("rsa",{modulusLength:3072,
   publicKeyEncoding:{type:"spki",format:"pem"},privateKeyEncoding:{type:"pkcs8",format:"pem"}});
  const salt=randomBytes(24),iv=randomBytes(12);
  const key=hkdfSync("sha256",Buffer.from(token),salt,Buffer.from("S2_DEST_SOURCE_SQL_RSA_PRIVKEY_KDF_V1"),32);
  const cipher=createCipheriv("aes-256-gcm",key,iv);
  const encrypted=Buffer.concat([cipher.update(privateKey,"utf8"),cipher.final()]);
  const pack={schemaVersion:"S2_DEST_RSA_PRIVKEY_SEALED_V0_1",salt:salt.toString("hex"),iv:iv.toString("hex"),
   authTag:cipher.getAuthTag().toString("hex"),ciphertext:encrypted.toString("base64"),publicKeySha256:sha(publicKey)};
  await writeFile(dir+"/destination-public.pem",publicKey,{flag:"wx",mode:0o600});
  await writeFile(dir+"/destination-private-key-sealed.json",JSON.stringify(pack)+"\n",{flag:"wx",mode:0o600});
  out.publicKeySha256=pack.publicKeySha256;
  out.result="DEST_RSA_PRIVATE_KEY_SEALED_UNDER_EXISTING_DEST_TOKEN_PUBLIC_ONLY_TRANSFER_READY";
 }else if(role==="SOURCE_REWRAP"){
  const token=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN,account=process.env.CLOUDFLARE_ACCOUNT_ID;
  if(!token||!account||digestLower(account)!==oldAccountSha)bad("SOURCE_ENV_WRONG");
  const d="/tmp/s2-bridge-input",orig=await getJson(d+"/backup/sanitized-backup-receipt.json");
  if(orig.result!=="REAL_NATIVE_SOURCE_D1_FULL_SQL_ENCRYPTED_BACKUP_OFFLINE_RESTORE_VERIFIED"||
     orig.plainSqlSHA256!==oldSqlSha||orig.offlineTotalRows!==113222)bad("ORIGINAL_SOURCE_ARCHIVE_UNVERIFIED");
  const pem=await readFile(d+"/destkey/destination-public.pem","utf8");
  const key=hkdfSync("sha256",Buffer.from(token),Buffer.from(orig.kdfSaltHex,"hex"),
   Buffer.from("S2_CROSS_ACCOUNT_SOURCE_SQL_TEMP_ARCHIVE_20261011"),32);
  const decipher=createDecipheriv("aes-256-gcm",key,Buffer.from(orig.ivHex,"hex"));
  decipher.setAuthTag(Buffer.from(orig.authTagHex,"hex"));
  const transferableKey=randomBytes(32),iv=randomBytes(12),cipher=createCipheriv("aes-256-gcm",transferableKey,iv);
  const newFile=dir+"/source-sql-rewrapped-for-destination.gz.gcm";
  await pipeline(createReadStream(d+"/backup/source-system2-private.sql.gz.aes256gcm"),decipher,cipher,
   createWriteStream(newFile,{mode:0o600}));
  const wrapped=publicEncrypt({key:pem,padding:constants.RSA_PKCS1_OAEP_PADDING,oaepHash:"sha256"},transferableKey);
  // Check complete source SQL SHA against decrypted and newly encrypted bytes.
  const validate=createDecipheriv("aes-256-gcm",transferableKey,iv);
  const tag=cipher.getAuthTag();validate.setAuthTag(tag);
  const h=createHash("sha256");let rawBytes=0;
  const sink=new Writable({write(chunk,enc,cb){rawBytes+=chunk.length;h.update(chunk);cb()}});
  await pipeline(createReadStream(newFile),validate,createGunzip(),sink);
  if(h.digest("hex")!==oldSqlSha||rawBytes!==316938975)bad("TRANSFER_RESTORED_FULL_SQL_SHA_MISMATCH");
  const meta={schemaVersion:"S2_SOURCE_SQL_RSA_WRAPPED_TRANSFER_V0_1",
    publicKeySha256:sha(pem),oldSqlSHA256:oldSqlSha,
    oldEncryptedBackupArtifactId:11706652537,oldBackupRunId:38150147134,
    ciphertextSha256:sha(await readFile(newFile)),ciphertextBytes:(await stat(newFile)).size,
    iv:iv.toString("hex"),authTag:tag.toString("hex"),wrappedContentKey:wrapped.toString("base64"),
    plainSQLPublished:false,sourceCloudflareDataModified:false};
  await writeFile(dir+"/rsa-wrapped-transfer-meta.json",JSON.stringify(meta)+"\n",{flag:"wx",mode:0o600});
  out.sourceSqlHashConfirmed=true;out.ciphertextSize=meta.ciphertextBytes;out.result="FULL_SOURCE_SQL_SECURE_CROSS_ACCOUNT_KEY_TRANSFER_READY";
 }else{
  const token=process.env.S2_SCHEMA_DEST_D1_WRITE_TOKEN,account=process.env.S2_SCHEMA_DEST_ACCOUNT_ID;
  if(!token||!account||digestLower(account)!==newAccountSha)bad("DEST_ENV_MISSING_OR_WRONG");
  const d="/tmp/s2-bridge-input",pack=await getJson(d+"/destkey/destination-private-key-sealed.json");
  const pem=await readFile(d+"/destkey/destination-public.pem","utf8");
  if(pack.publicKeySha256!==sha(pem))bad("DEST_RSA_KEY_HASH_DRIFT");
  const key=hkdfSync("sha256",Buffer.from(token),Buffer.from(pack.salt,"hex"),
    Buffer.from("S2_DEST_SOURCE_SQL_RSA_PRIVKEY_KDF_V1"),32);
  const decryptKey=createDecipheriv("aes-256-gcm",key,Buffer.from(pack.iv,"hex"));
  decryptKey.setAuthTag(Buffer.from(pack.authTag,"hex"));
  const privatePem=Buffer.concat([decryptKey.update(Buffer.from(pack.ciphertext,"base64")),decryptKey.final()]);
  const transfer=await getJson(d+"/transfer/rsa-wrapped-transfer-meta.json");
  if(transfer.publicKeySha256!==sha(pem)||transfer.oldSqlSHA256!==oldSqlSha)bad("RSA_TRANSFER_METADATA_UNVERIFIED");
  const contentKey=privateDecrypt({key:privatePem,padding:constants.RSA_PKCS1_OAEP_PADDING,oaepHash:"sha256"},Buffer.from(transfer.wrappedContentKey,"base64"));
  const dec=createDecipheriv("aes-256-gcm",contentKey,Buffer.from(transfer.iv,"hex"));
  dec.setAuthTag(Buffer.from(transfer.authTag,"hex"));
  const sqlFile=dir+"/ORIGINAL_SQL_ONLY_ON_EPHEMERAL_DESTINATION_RUNNER.sql";
  await pipeline(createReadStream(d+"/transfer/source-sql-rewrapped-for-destination.gz.gcm"),dec,createGunzip(),
   createWriteStream(sqlFile,{mode:0o600}));
  if(sha(await readFile(sqlFile))!==oldSqlSha)bad("DESTINATION_TRANSFER_SQL_SHA_FAILED");
  const integrity=await localRestore(sqlFile);
  if(integrity.quickCheck!=="ok"||integrity.tables!==55||integrity.indexes!==63||integrity.rows!==113222||integrity.decisions!==0)
   bad("DESTINATION_OFFLINE_RESTORE_OR_PIT_ROWCOUNT_DRIFT");
  const dbs=await api(account,token,"/d1/database?per_page=100");
  if(!Array.isArray(dbs)||dbs.length!==1||dbs[0]?.name!=="system2-research"||digestLower(dbs[0].uuid||dbs[0].id)!==targetDbSha)
   bad("DEST_ACCOUNT_OR_D1_MISMATCH");
  const id=dbs[0].uuid||dbs[0].id;
  const q=await api(account,token,"/d1/database/"+id+"/query","POST",
   {sql:"SELECT COUNT(*) AS c FROM s2_historical_a1_bars"});
  if(!Array.isArray(q)||q.length!==1||q[0].success!==true||q[0].results?.length!==1)bad("DEST_HISTORICAL_COUNT_QUERY_FAILED");
  const n=q[0].results[0].c;
  out.destinationExistingBars=n;
  if(n!==0)bad("DEST_BARS_ALREADY_NONEMPTY_NO_BLIND_IMPORT");
  out.destinationD1Confirmed=true;out.sourceSqlHashConfirmed=true;
  out.restoredRowCount=integrity.rows;out.frozenDecisions=integrity.decisions;
  out.result="SECURE_SOURCE_SQL_DECRYPTED_AND_RESTORED_IN_TARGET_CREDENTIAL_ENV_DEST_D1_STILL_EMPTY_NO_IMPORT";
  if(role==="DEST_PIT_PLAN"){
    const audit=await new Promise((resolve,reject)=>{
      const p=spawn("python3",["system2/migration/issue1068_real_archive_pit_batch_plan_offline_v0_1.py",
        "/tmp/s2-bridge-verified-local.db"],{stdio:["ignore","pipe","pipe"]});
      let payload="",err="";
      p.stdout.on("data",c=>{payload+=c.toString();if(payload.length>150000) p.kill()});
      p.stderr.on("data",c=>{err+=c.toString()});
      p.on("close",code=>{
        if(code!==0)return reject(Error("ORIGINAL_PIT_BATCH_PLAN_SCAN_FAILED"));
        try{resolve(JSON.parse(payload))}catch{reject(Error("ORIGINAL_PIT_BATCH_PLAN_PAYLOAD_BAD"))}
      });
    });
    if(audit.sourceRows!==113222||audit.sourceBars!==84688||
       audit.permissionToImport!==false||audit.independentAuditAccepted!==false)
      bad("PIT_BATCH_AUDIT_INVALID_OR_OVERPROMOTED");
    await writeFile(dir+"/sanitized-source-pit-batch-plan.json",JSON.stringify(audit,null,2)+"\n",
      {flag:"wx",mode:0o600});
    out.sourceActualPitBatchSummary=audit.batchSummary;
    out.sanitizedPitPlanSHA256=sha(JSON.stringify(audit,null,2)+"\n");
    out.permissionToImport=false;
    out.result="REAL_ORIGINAL_SOURCE_PIT_AND_COMPLETE_BATCH_METADATA_SCANNED_OFFLINE_NO_D1_IMPORT";
  }
  await rm(sqlFile,{force:true});await rm("/tmp/s2-bridge-verified-local.db",{force:true});
 }
}
try{await run()}catch(e){out.result="BLOCKED_FAIL_CLOSED";out.error=String(e?.message||e).replace(/[a-f0-9]{30,}/ig,"REDACTED").slice(0,130);process.exitCode=2}
finally{await persist()}
