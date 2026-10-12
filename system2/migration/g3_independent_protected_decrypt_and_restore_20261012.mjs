// G3 independent verifier — NOT the prior producer's secure transfer script.
// Existing DEST environment token unlocks already-sealed RSA private key only.
// Original encrypted bytes are downloaded from GitHub artifacts; NO Cloudflare API
// or source export. Streams authenticated AES-GCM gunzip into local ephemeral SQL.
// SQL, source rows, RSA key and D1 tokens NEVER enter uploaded artifacts/logs.
import {createHash,createDecipheriv,hkdfSync,privateDecrypt,constants} from "node:crypto";
import {readFile,writeFile,mkdir,rm,stat} from "node:fs/promises";
import {createReadStream,createWriteStream} from "node:fs";
import {pipeline} from "node:stream/promises";
import {Transform} from "node:stream";
import {createGunzip} from "node:zlib";
import {spawn} from "node:child_process";
import {fileURLToPath} from "node:url";
const dir="/tmp/g3-independent-audit",inputs="/tmp/g3-independent-input";
const sha=b=>createHash("sha256").update(b).digest("hex");
const acctHash="27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55";
const originalSqlSha="56cd6ebc449949d67a7123da2a2300d685f3d5a2412383a3afc217001c4e5f12";
const expectedEncryptedSha="68c0244edb03c3239ff7e3cb7b50b5b5abf6d7c75c47839175e45fdba0936957";
const fail=x=>{throw Error("G3_INDEPENDENT_"+x)};
async function witness(){
  if(!process.env.S2_SCHEMA_DEST_ACCOUNT_ID||!process.env.S2_SCHEMA_DEST_D1_WRITE_TOKEN||
     sha(process.env.S2_SCHEMA_DEST_ACCOUNT_ID.toLowerCase())!==acctHash)fail("PROTECTED_DEST_ENV_IDENTITY");
  const sealed=JSON.parse(await readFile(inputs+"/key/destination-private-key-sealed.json","utf8"));
  const publicKey=await readFile(inputs+"/key/destination-public.pem","utf8");
  const transfer=JSON.parse(await readFile(inputs+"/source/rsa-wrapped-transfer-meta.json","utf8"));
  const encryptedFile=inputs+"/source/source-sql-rewrapped-for-destination.gz.gcm";
  if(sha(publicKey)!==sealed.publicKeySha256||
     sha(publicKey)!==transfer.publicKeySha256||
     transfer.oldSqlSHA256!==originalSqlSha||transfer.oldBackupRunId!==38150147134||
     transfer.oldEncryptedBackupArtifactId!==11706652537||
     transfer.ciphertextSha256!==expectedEncryptedSha)fail("ARCHIVE_OR_KEY_ORIGINAL_METADATA_DRIFT");
  const ciph=await readFile(encryptedFile);
  if(sha(ciph)!==expectedEncryptedSha||ciph.length!==transfer.ciphertextBytes)fail("CIPHERTEXT_ORIGINAL_SHA_MISMATCH");
  const derived=hkdfSync("sha256",Buffer.from(process.env.S2_SCHEMA_DEST_D1_WRITE_TOKEN),
    Buffer.from(sealed.salt,"hex"),Buffer.from("S2_DEST_SOURCE_SQL_RSA_PRIVKEY_KDF_V1"),32);
  const d=createDecipheriv("aes-256-gcm",derived,Buffer.from(sealed.iv,"hex"));
  d.setAuthTag(Buffer.from(sealed.authTag,"hex"));
  const priv=Buffer.concat([d.update(Buffer.from(sealed.ciphertext,"base64")),d.final()]);
  const contentKey=privateDecrypt({key:priv,padding:constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash:"sha256"},Buffer.from(transfer.wrappedContentKey,"base64"));
  const decipher=createDecipheriv("aes-256-gcm",contentKey,Buffer.from(transfer.iv,"hex"));
  decipher.setAuthTag(Buffer.from(transfer.authTag,"hex"));
  await mkdir(dir,{recursive:true,mode:0o700});
  const sql=dir+"/original-private-ephemeral-source.sql";
  const h=createHash("sha256");let bytes=0;
  const tap=new Transform({transform(chunk,enc,cb){bytes+=chunk.length;h.update(chunk);cb(null,chunk)}});
  await pipeline(createReadStream(encryptedFile),decipher,createGunzip(),tap,
      createWriteStream(sql,{mode:0o600}));
  if(h.digest("hex")!==originalSqlSha||bytes!==316938975)fail("SOURCE_SQL_PLAINTEXT_SHA_OR_BYTES_DRIFT");
  const py="system2/migration/g3_independent_sqlite_restore_and_pit_witness_20261012.py";
  let witnessJson=await new Promise((resolve,reject)=>{
    const p=spawn("python3",[py,sql],{stdio:["ignore","pipe","pipe"]});
    let output="",errors="";
    p.stdout.on("data",x=>{output+=x.toString();if(output.length>170000)p.kill()});
    p.stderr.on("data",x=>{errors+=x.toString()});
    p.on("close",code=>{
      if(code!==0)return reject(Error("G3_INDEPENDENT_SQLITE_RESTORE_FAILED"));
      try{resolve(JSON.parse(output))}catch{reject(Error("G3_INDEPENDENT_SQLITE_WITNESS_INVALID"))}
    });
  });
  if(witnessJson.sourceTotalRows!==113222||witnessJson.a1SourceRows!==84688||
     witnessJson.decisionsTableRows!==0||witnessJson.tableCount!==55||witnessJson.indexCount!==63||
     witnessJson.sourceSqlSHA256!==originalSqlSha||
     witnessJson.permissionToImport!==false||witnessJson.independentlyQualifiedPITBarRows!==0)
    fail("INDEPENDENT_WITNESS_MATHEMATICAL_OR_SAFETY_FAILURE");
  const payload=JSON.stringify(witnessJson,null,2)+"\n";
  await writeFile(dir+"/sanitized-independent-sqlite-content-roots.json",payload,{flag:"wx",mode:0o600});
  await rm(sql,{force:true});
  return {schemaVersion:"S2_G3_INDEPENDENT_PROTECTED_DECRYPT_RESTORE_EVIDENCE_20261012_V0_1",
   sourceSqlSha256:originalSqlSha,sourceOriginalRun:38150147134,sourceOriginalArtifact:11706652537,
   encryptedTransitRun:38151167952,contentSha256:expectedEncryptedSha,
   independentlyDecryptedOriginalSql:true,sqliteRestoredFreshIndependentCode:true,
   originalSqlBytes:bytes,tableCount:55,indexCount:63,totalRows:113222,sourceDecisions:0,
   a1Rows:84688,contentRootSHA256:witnessJson.wholeDatabaseContentRootSHA256,
   perTableDigestsSHA256:sha(payload),provisionalRows:witnessJson.provisionalSelectedBarRows,
   eligiblePITRows:witnessJson.independentlyQualifiedPITBarRows,
   externalProviderClockVerified:false,remoteFrozenRootsProven:false,archiveIndependentKeyEscrow:false,
   noDestinationD1Insert:true,CloudflareCalls:0,newSecrets:0,paidTier:false,
   conclusion:"INDEPENDENT_SOURCE_SQL_RESTORE_PASS__PIT_FROZEN_DURABLE_KEY_G3_GATE_PENDING"};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 try{const x=await witness();await writeFile(dir+"/sanitized-independent-restore-receipt.json",
   JSON.stringify(x,null,2)+"\n",{flag:"wx",mode:0o600});
   console.log(JSON.stringify({stage:"G3_INDEPENDENT_SOURCE_RESTORE",result:x.conclusion,
     independentlyRestored:x.independentlyDecryptedOriginalSql,rows:x.totalRows,
     restoredIndexes:x.indexCount,PITAcceptedRows:x.eligiblePITRows,destinationWrites:0}));
 }catch(e){console.error(/^G3_INDEPENDENT_[A-Z_]+$/.test(String(e.message))?e.message:"G3_INDEPENDENT_FAIL_CLOSED");
   process.exitCode=2}
}
