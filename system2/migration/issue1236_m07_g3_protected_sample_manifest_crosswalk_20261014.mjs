// M07 protected original SOURCE SQL offline restore plus authentic sample manifest SHA crosswalk.
// Existing destination environment token used *only* as sealed RSA key decrypt KDF.
// No Cloudflare calls, D1 reads/writes, R2 GET, new Secret or paid entitlement.
import {createHash,createDecipheriv,hkdfSync,privateDecrypt,constants} from "node:crypto";
import {createReadStream,createWriteStream} from "node:fs";
import {readFile,mkdir,writeFile,rm} from "node:fs/promises";
import {createGunzip} from "node:zlib";
import {pipeline} from "node:stream/promises";
import {Transform} from "node:stream";
import {spawn} from "node:child_process";
import {fileURLToPath} from "node:url";
const BASE="/tmp/s2-m07-source-manifest-crosswalk",INPUT="/tmp/s2-m07-existing-source-archive";
const SQL_SHA="56cd6ebc449949d67a7123da2a2300d685f3d5a2412383a3afc217001c4e5f12";
const ENCRYPTED_SHA="f6bfdff72080008e593b479409117d8260afdbb70b73da7c197d67b8faa6dad1";
const ACCOUNT_SHA="27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55";
const SAMPLE_SHA="d9c0a7ac091083511dfdd1d028ef191fd6f2f27f41377b139c461566e1aeaa82";
const sha=x=>createHash("sha256").update(x).digest("hex");
const reject=x=>{throw Error("M07_CROSSWALK_"+x)};
async function decryptSource(){
 const account=process.env.S2_SCHEMA_DEST_ACCOUNT_ID;
 const token=process.env.S2_SCHEMA_DEST_D1_WRITE_TOKEN;
 if(!account||!token||sha(account.toLowerCase())!==ACCOUNT_SHA)reject("PROTECTED_ACCOUNT_IDENTITY");
 const [k,pem,t]=await Promise.all([
  readFile(INPUT+"/key/destination-private-key-sealed.json","utf8").then(JSON.parse),
  readFile(INPUT+"/key/destination-public.pem","utf8"),
  readFile(INPUT+"/source/rsa-wrapped-transfer-meta.json","utf8").then(JSON.parse)]);
 const wrapped=INPUT+"/source/source-sql-rewrapped-for-destination.gz.gcm";
 if(sha(pem)!==k.publicKeySha256||sha(pem)!==t.publicKeySha256||
    t.oldSqlSHA256!==SQL_SHA||t.oldBackupRunId!==38150147134||
    t.oldEncryptedBackupArtifactId!==11706652537||t.ciphertextSha256!==ENCRYPTED_SHA)
    reject("ARCHIVE_PROVENANCE_OR_KEY_IDENTITY");
 const bytes=await readFile(wrapped);
 if(sha(bytes)!==ENCRYPTED_SHA||bytes.length!==t.ciphertextBytes)
    reject("CIPHER_ORIGINAL_BYTES_SHA");
 const dk=hkdfSync("sha256",Buffer.from(token),Buffer.from(k.salt,"hex"),
   Buffer.from("S2_DEST_SOURCE_SQL_RSA_PRIVKEY_KDF_V1"),32);
 const keyCipher=createDecipheriv("aes-256-gcm",dk,Buffer.from(k.iv,"hex"));
 keyCipher.setAuthTag(Buffer.from(k.authTag,"hex"));
 const privatePem=Buffer.concat([keyCipher.update(Buffer.from(k.ciphertext,"base64")),keyCipher.final()]);
 const session=privateDecrypt({key:privatePem,padding:constants.RSA_PKCS1_OAEP_PADDING,
   oaepHash:"sha256"},Buffer.from(t.wrappedContentKey,"base64"));
 const dec=createDecipheriv("aes-256-gcm",session,Buffer.from(t.iv,"hex"));
 dec.setAuthTag(Buffer.from(t.authTag,"hex"));
 const sql=BASE+"/source.sql",h=createHash("sha256");
 let n=0;const tap=new Transform({transform(chunk,enc,cb){h.update(chunk);n+=chunk.length;cb(null,chunk)}});
 await pipeline(createReadStream(wrapped),dec,createGunzip(),tap,createWriteStream(sql,{mode:0o600}));
 if(h.digest("hex")!==SQL_SHA||n!==316938975)reject("ORIGINAL_SQL_AUTHENTICATION");
 return sql;
}
async function runPy(sql,sample){
 return await new Promise((resolve,reject)=>{
  const args=["system2/migration/issue1236_m07_original_d1_manifest_sample_match_20261014.py",sql,sample];
  const c=spawn("python3",args,{stdio:["ignore","pipe","pipe"]});
  let stdout="";c.stdout.on("data",x=>{stdout+=x.toString();if(stdout.length>12000)c.kill()});
  let stderr="";c.stderr.on("data",x=>{stderr+=x.toString().slice(0,200)});
  c.on("error",()=>reject(Error("M07_CROSSWALK_SPAWN_FAILED")));
  c.on("close",code=>{
   if(code!==0)return reject(Error(/^M07_CROSSWALK_[A-Z0-9_]+$/.test(stderr.trim())?
     stderr.trim():"M07_CROSSWALK_RESTORE_FAILED"));
   try{resolve(JSON.parse(stdout))}catch{reject(Error("M07_CROSSWALK_INVALID_JSON"))}
  });
 });
}
async function run(){
 await mkdir(BASE,{recursive:true,mode:0o700});
 const sample="/tmp/s2-m07-actual-original-sample/sample-sanitized.json";
 if(sha(await readFile(sample))!==SAMPLE_SHA)reject("ORIGINAL_SAMPLE_RECEIPT_SHA");
 const sql=await decryptSource();
 try{
  const result=await runPy(sql,sample);
  if(result.sourceManifestRowsScanned!==25823||result.sourceD1QueriedLive!==false||
   result.destinationD1Touched!==false||result.sampleObjectKeyMatchCount>1||
   result.independentAuditorApproved!==false)reject("RECEIPT_SCOPE_INVALID");
  return Object.freeze({
    schemaVersion:"S2_M07_PROTECTED_ORIGINAL_D1_R2_SAMPLE_OFFLINE_CROSSWALK_V0_1",
    status:result.status,archivedSourceSqlSHA256:SQL_SHA,
    sourceOriginalExportRun:38150147134,
    originalArchivedSourceSQLBytes:316938975,
    originalSampleR2Run:38511567530,
    originalSampleArtifact:11869878655,
    originalSampleInnerSHA256:SAMPLE_SHA,
    ...result,
    cloudflareApiCalls:0,liveSourceD1Queries:0,liveDestinationD1Queries:0,
    destinationD1Writes:0,sourceR2GetCalls:0,
    originalSampleR2ByteSHAWasVerifiedInOriginalProtectedJob:true,
    originalR2BytesIndependentlyRefetchedByCrosswalk:false,
    fullR2BucketOrManifestMigrated:false,system1FormalChanged:false,
    newSecretsOrPermissions:false,paidResources:false,formalAuditPass:false});
 }finally{await rm(sql,{force:true})}
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 let result={schemaVersion:"S2_M07_PROTECTED_ORIGINAL_D1_R2_SAMPLE_OFFLINE_CROSSWALK_V0_1",
  status:"FAIL_CLOSED",cloudflareApiCalls:0,sourceR2GetCalls:0,destinationD1Writes:0};
 try{result=await run()}catch(e){
  let str=String(e?.message||"");
  result.error=/^M07_CROSSWALK_[A-Z0-9_]+$/.test(str)?str:"M07_CROSSWALK_UNKNOWN_FAIL_CLOSED";
  process.exitCode=2;
 }finally{
  await mkdir(BASE,{recursive:true,mode:0o700});
  await writeFile(BASE+"/sanitized-crosswalk.json",JSON.stringify(result,null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify({status:result.status,matched:result.sampleObjectKeyMatchCount??null,
    sourceManifestsScanned:result.sourceManifestRowsScanned??null,
    sourceD1LiveQueries:0,destinationD1Writes:0,cloudflareCalls:0,error:result.error??null}));
  await rm(BASE+"/source.sql",{force:true}).catch(()=>{});
 }
}
