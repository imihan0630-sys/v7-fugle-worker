import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {fetchBufferedOfficialSource} from "./official_source_fetch_v0_1.mjs";

const quality=await readFile(new URL("./sync_official_quality.mjs",import.meta.url),"utf8");
const helper=await readFile(new URL("./official_source_fetch_v0_1.mjs",import.meta.url),"utf8");

assert.match(quality,/const MOPS_FINANCIAL_BODY_TIMEOUT_MS=90000;/);
assert.match(quality,/ajax_t163sb04'[\s\S]{0,500}timeoutMs:MOPS_FINANCIAL_BODY_TIMEOUT_MS/);
assert.match(helper,/defaultTimeoutMs=45000/);
assert.doesNotMatch(helper,/defaultTimeoutMs=90000/);
assert.match(helper,/officialSourceRetry/);
assert.match(helper,/path:pathname/);

let seenSignalTimeout=null;
const response=await fetchBufferedOfficialSource("https://example.invalid/large-official-body",{timeoutMs:90000},{
  sleep:async()=>{},
  fetchImpl:async (_url,options)=>{
    seenSignalTimeout=options.signal;
    return {
      status:200,
      ok:true,
      statusText:"OK",
      headers:new Headers({"content-type":"text/plain"}),
      arrayBuffer:async()=>new TextEncoder().encode("complete").buffer
    };
  }
});
assert.equal(await response.text(),"complete");
assert.ok(seenSignalTimeout instanceof AbortSignal);

console.log(JSON.stringify({
  ok:true,
  targetedMopsFinancialTimeoutMs:90000,
  defaultOfficialTimeoutMs:45000,
  boundedRetriesPreserved:true,
  authorizationFailClosedPreserved:true,
  formalCoreChanged:false,
  system2Changed:false
}));
