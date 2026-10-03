import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const source=await readFile(new URL("./verify_deployment.mjs",import.meta.url),"utf8");
let n=0;
assert.match(source,/async function fetchReadOnlyWithRetry/);n++;
assert.match(source,/attempts=3/);n++;
assert.match(source,/timeoutMs=20000/);n++;
assert.match(source,/delayMs=3000/);n++;
assert.match(source,/method:'GET'/);n++;
assert.match(source,/READ_ONLY_VERIFY_AUTH_REJECTED_/);n++;
assert.match(source,/fetchReadOnlyWithRetry\(origin \+ '\/\?format=json'\)/);n++;
assert.doesNotMatch(source,/fetchReadOnlyWithRetry[\s\S]*method:'(?:POST|PUT|PATCH|DELETE)'/);n++;
assert.doesNotMatch(source,/fetchReadOnlyWithRetry[\s\S]*body:/);n++;
console.log(JSON.stringify({ok:true,assertions:n,readOnlyOnly:true,maxAttempts:3,timeoutMs:20000,businessWrites:false}));
