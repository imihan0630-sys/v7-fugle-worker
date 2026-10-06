import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const quality=await readFile(new URL("./sync_official_quality.mjs",import.meta.url),"utf8");
const workflow=await readFile(new URL("../.github/workflows/v7-market-data.yml",import.meta.url),"utf8");

const start=quality.indexOf("async function publicSource(");
const end=quality.indexOf("async function admin(",start);
assert.ok(start>=0&&end>start,"publicSource helper missing");
const extracted=quality.slice(start,end);
const mod=await import("data:text/javascript;base64,"+Buffer.from(
  'import assert from "node:assert/strict";\n'+extracted+'\nexport {publicSource};'
).toString("base64"));

const originalFetch=globalThis.fetch;
const originalSetTimeout=globalThis.setTimeout;
try{
  globalThis.setTimeout=(fn)=>{fn();return 0;};

  let attempts=0;
  globalThis.fetch=async()=>{
    attempts++;
    return {
      status:200,ok:true,statusText:"OK",headers:new Headers({"content-type":"text/plain"}),
      async arrayBuffer(){
        if(attempts<3) throw new Error("The operation was aborted due to timeout");
        return new TextEncoder().encode("payload-ok").buffer;
      }
    };
  };
  const response=await mod.publicSource("https://example.invalid/mops/body");
  assert.equal(attempts,3,"body timeout must retry full source fetch");
  assert.equal(await response.text(),"payload-ok","buffered response must remain readable after retry scope");

  let forbiddenAttempts=0;
  globalThis.fetch=async()=>{
    forbiddenAttempts++;
    return {
      status:403,ok:false,statusText:"Forbidden",headers:new Headers(),
      async arrayBuffer(){return new ArrayBuffer(0);}
    };
  };
  await assert.rejects(()=>mod.publicSource("https://example.invalid/forbidden"),/disallows access/);
  assert.equal(forbiddenAttempts,1,"authorization/source restriction must not be retried");
}finally{
  globalThis.fetch=originalFetch;
  globalThis.setTimeout=originalSetTimeout;
}

assert.match(quality,/const body=await response\.arrayBuffer\(\)/);
assert.match(quality,/publicSourceRetry/);
assert.match(quality,/fetch failed\|timeout\|aborted\|ECONNRESET\|ETIMEDOUT/i);

assert.match(workflow,/QUALITY_RECOVERY_ONLY: \$\{\{ github\.event_name == 'schedule' && github\.event\.schedule == '45 15 \* \* 1-5' && '1' \|\| '' \}\}/);
assert.match(workflow,/25 15 \* \* 1-5/);
assert.match(workflow,/45 15 \* \* 1-5/);
assert.match(workflow,/RECOVERY_MARKET_DATE:/);
assert.doesNotMatch(quality,/saveStockConfig\(/);
assert.doesNotMatch(quality,/\/api\/scan["']/);

console.log(JSON.stringify({
  ok:true,
  bodyTimeoutRetryVerified:true,
  sourceRestrictionNoRetry:true,
  fallbackRecoveryOnly:true,
  formalCoreChanged:false,
  qualityGateRelaxed:false
}));
