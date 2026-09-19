import assert from "node:assert/strict";
import { createCipheriv, createDecipheriv, createHash, hkdfSync, randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const ORIGIN = process.env.V8_ORIGIN || "https://fugle-test.imihan0630.workers.dev";
const LATEST_PATH = "external-mirror/latest.enc.json";
const SALT = Buffer.from("V8-GITHUB-MIRROR-v1","utf8");
const INFO = Buffer.from("plan-encryption","utf8");
const AAD = Buffer.from("V8_PLAN_MIRROR_V1","utf8");

function requireSecret() {
  const token=process.env.V7_ADMIN_TOKEN;
  assert.ok(token,"V7_ADMIN_TOKEN is required");
  return token;
}

function deriveKey(secret) {
  return Buffer.from(hkdfSync("sha256",Buffer.from(String(secret),"utf8"),SALT,INFO,32));
}

function sha256(text) {
  return createHash("sha256").update(String(text),"utf8").digest("hex");
}

function encryptPayload(payloadJson,secret) {
  const key=deriveKey(secret);
  const iv=randomBytes(12);
  const cipher=createCipheriv("aes-256-gcm",key,iv);
  cipher.setAAD(AAD);
  const ciphertext=Buffer.concat([cipher.update(payloadJson,"utf8"),cipher.final()]);
  const tag=cipher.getAuthTag();
  return {
    version:1,
    algorithm:"AES-256-GCM",
    kdf:"HKDF-SHA256",
    iv:iv.toString("base64url"),
    tag:tag.toString("base64url"),
    ciphertext:ciphertext.toString("base64url"),
    sha256:sha256(payloadJson)
  };
}

function decryptEnvelope(envelope,secret) {
  assert.equal(envelope.version,1);
  assert.equal(envelope.algorithm,"AES-256-GCM");
  assert.equal(envelope.kdf,"HKDF-SHA256");
  const key=deriveKey(secret);
  const decipher=createDecipheriv("aes-256-gcm",key,Buffer.from(envelope.iv,"base64url"));
  decipher.setAAD(AAD);
  decipher.setAuthTag(Buffer.from(envelope.tag,"base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(envelope.ciphertext,"base64url")),
    decipher.final()
  ]).toString("utf8");
}

async function admin(path,options={}) {
  const token=requireSecret();
  const response=await fetch(ORIGIN+path,{
    ...options,
    headers:{
      "x-admin-token":token,
      "accept":"application/json",
      ...(options.body ? {"content-type":"application/json"} : {}),
      ...(options.headers||{})
    },
    signal:AbortSignal.timeout(60000)
  });
  const body=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error("Worker "+path+" HTTP "+response.status);
  return body;
}

async function exportCurrent() {
  const data=await admin("/api/storage/export-current");
  assert.equal(data.ok,true);
  assert.equal(data.provider,"D1_GITHUB_ENCRYPTED");
  assert.equal(typeof data.payloadJson,"string");
  assert.match(data.sha256,/^[0-9a-f]{64}$/);
  assert.equal(sha256(data.payloadJson),data.sha256);
  assert.equal(data.noPlanChanges,true);
  assert.equal(data.noPush,true);
  assert.equal(data.noThreeMinWrite,true);
  assert.equal(data.noTrade,true);
  return data;
}

function appendOutput(values) {
  if(!process.env.GITHUB_OUTPUT) return;
  return import("node:fs/promises").then(({appendFile})=>
    appendFile(process.env.GITHUB_OUTPUT,Object.entries(values).map(([k,v])=>k+"="+String(v)+"\n").join(""))
  );
}

async function prepare() {
  const data=await exportCurrent();
  try {
    const response=await fetch(ORIGIN+"/api/storage/status?mirrorPrepare="+Date.now(),{signal:AbortSignal.timeout(20000)});
    if(response.ok) {
      const status=await response.json();
      if(status?.mode==="D1_GITHUB_ENCRYPTED" && status?.github?.verified===true &&
         status?.github?.scanDate===data.scanDate && status?.d1?.sha256===data.sha256) {
        await appendOutput({skip:"true",scan_date:data.scanDate,sha256:data.sha256,latest_path:LATEST_PATH});
        console.log(JSON.stringify({prepared:false,alreadyVerified:true,scanDate:data.scanDate,sha256:data.sha256,plaintextWritten:false}));
        return;
      }
    }
  } catch {}
  const envelope=encryptPayload(data.payloadJson,requireSecret());
  assert.equal(envelope.sha256,data.sha256);
  await mkdir("external-mirror/history",{recursive:true});
  const historyPath="external-mirror/history/"+data.sha256+".enc.json";
  const serialized=JSON.stringify(envelope,null,2)+"\n";
  await writeFile(LATEST_PATH,serialized,"utf8");
  try { await readFile(historyPath,"utf8"); }
  catch { await writeFile(historyPath,serialized,"utf8"); }
  await appendOutput({skip:"false",scan_date:data.scanDate,sha256:data.sha256,latest_path:LATEST_PATH,history_path:historyPath});
  console.log(JSON.stringify({prepared:true,scanDate:data.scanDate,sha256:data.sha256,plaintextWritten:false}));
}

async function verify(commitSha) {
  assert.match(String(commitSha||""),/^[0-9a-f]{40}$/i);
  const expected=await exportCurrent();
  const repo=process.env.GITHUB_REPOSITORY;
  assert.ok(repo,"GITHUB_REPOSITORY is required");
  const rawUrl="https://raw.githubusercontent.com/"+repo+"/"+commitSha+"/"+LATEST_PATH;
  const raw=await fetch(rawUrl,{headers:{"user-agent":"V8-GitHub-Mirror/1.0"},signal:AbortSignal.timeout(30000)});
  assert.equal(raw.ok,true,"GitHub raw mirror readback failed");
  const envelope=JSON.parse(await raw.text());
  const plaintext=decryptEnvelope(envelope,requireSecret());
  assert.equal(sha256(plaintext),expected.sha256,"Decrypted GitHub mirror hash differs");
  assert.equal(plaintext,expected.payloadJson,"Decrypted GitHub mirror payload differs");
  const accepted=await admin("/api/storage/github-accept",{
    method:"POST",
    body:JSON.stringify({
      scanDate:expected.scanDate,
      sha256:expected.sha256,
      commitSha,
      mirrorPath:LATEST_PATH
    })
  });
  assert.equal(accepted.ok,true);
  assert.equal(accepted.verified,true);
  assert.equal(accepted.noPlanChanges,true);
  assert.equal(accepted.noPush,true);
  assert.equal(accepted.noThreeMinWrite,true);
  assert.equal(accepted.noTrade,true);
  console.log(JSON.stringify({verified:true,scanDate:expected.scanDate,sha256:expected.sha256,commitSha,plaintextLogged:false}));
}

async function waitRuntime() {
  const deadline=Date.now()+6*60*1000;
  while(Date.now()<deadline) {
    try {
      const response=await fetch(ORIGIN+"/api/version?mirrorWait="+Date.now(),{signal:AbortSignal.timeout(15000)});
      if(response.ok) {
        const data=await response.json();
        if(String(data.version||"").startsWith("8.4.0-")) {
          console.log(JSON.stringify({runtimeReady:true,version:data.version}));
          return;
        }
      }
    } catch {}
    await new Promise(resolve=>setTimeout(resolve,10000));
  }
  throw new Error("V8.4 runtime was not deployed within wait window");
}

async function selfTest() {
  const secret="test-only-secret-with-enough-entropy";
  const payload=JSON.stringify({schemaVersion:"V7_PLAN_2",scanDate:"2026-09-18",stocks:[{symbol:"3105"}]});
  const envelope=encryptPayload(payload,secret);
  assert.equal(envelope.sha256,sha256(payload));
  assert.equal(decryptEnvelope(envelope,secret),payload);
  assert.throws(()=>decryptEnvelope(envelope,secret+"wrong"));
  assert.equal(Object.prototype.hasOwnProperty.call(envelope,"payloadJson"),false);
  console.log(JSON.stringify({ok:true,encryptionRoundTrip:true,wrongKeyRejected:true,plaintextInEnvelope:false}));
}

const mode=process.argv[2] || "";
if(mode==="prepare") await prepare();
else if(mode==="verify") await verify(process.argv[3] || process.env.MIRROR_COMMIT_SHA);
else if(mode==="wait-runtime") await waitRuntime();
else if(mode==="self-test") await selfTest();
else throw new Error("Usage: node tests/github_plan_mirror.mjs <prepare|verify|wait-runtime|self-test> [commitSha]");
