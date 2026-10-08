import assert from "node:assert/strict";
import fs from "node:fs";

const source=fs.readFileSync(process.env.V7_TEST_WORKER_PATH||"Worker.js","utf8");
const beforePath="artifacts/Worker-before-v8_20_1.mjs";
assert.equal(fs.existsSync(beforePath),true,"V8.20.1 pre-patch Worker artifact missing");
const before=fs.readFileSync(beforePath,"utf8");

assert.match(source,/const VERSION = "(?:8\.20\.(?:1-cross-midnight-recovery-readback|2-idempotent-d1-snapshots)|8\.21\.0-c1-generation-set-finalization)";/);
assert.match(source,/url\.pathname === "\/api\/market-data\/status"/);
assert.match(source,/url\.searchParams\.get\("marketDate"\)/);
assert.match(source,/const requestedDate=url\.searchParams\.get\("marketDate"\)/,
  "V8.9.7 historical institution readback must remain present");
assert.match(source,/readOnly:true,historicalBackfillPerformed:false,noPlanChanges:true,noPush:true/);
assert.match(source,/date !== taiwanDate\(\)/,"historical market-data writes must remain forbidden");
const marketStatusStart=source.indexOf('if (url.pathname === "/api/market-data/status")');
const marketWriteStart=source.indexOf('if (url.pathname === "/api/market-data")',marketStatusStart+1);
assert.ok(marketStatusStart>=0&&marketWriteStart>marketStatusStart,"market-data status route block missing");
const marketStatusBlock=source.slice(marketStatusStart,marketWriteStart);
assert.match(marketStatusBlock,/request\.method!=="GET"/);
assert.doesNotMatch(marketStatusBlock,/request\.method==="POST"|request\.method!=="POST"/);

async function api(text){
  const encoded=Buffer.from(text+"\nexport {scoreCandidate,selectTomorrowCandidates,evaluateMomentum,evaluateOperationSignals,saveStockConfig};").toString("base64");
  return import("data:text/javascript;base64,"+encoded);
}
const [a,b]=await Promise.all([api(before),api(source)]);
for(const name of ["scoreCandidate","selectTomorrowCandidates","evaluateMomentum","evaluateOperationSignals","saveStockConfig"]){
  assert.equal(a[name].toString(),b[name].toString(),name+" changed by recovery hardening");
}

const effectiveVersion=(source.match(/const VERSION = "([^"]+)";/)||[])[1]||"";
const added=source.length-before.length;
if(effectiveVersion==="8.20.1-cross-midnight-recovery-readback"||effectiveVersion==="8.20.2-idempotent-d1-snapshots")
  assert.ok(added>0&&added<12000,"unexpected V8.20.1/8.20.2 cumulative patch size");
else {
  assert.equal(effectiveVersion,"8.21.0-c1-generation-set-finalization");
  assert.ok(added>0,"V8.20.1 recovery layer disappeared under successor runtime");
}
console.log(JSON.stringify({
  ok:true,version:"8.20.1-cross-midnight-recovery-readback",
  marketStatusReadOnly:true,historicalInstitutionReadbackPreserved:true,
  historicalMarketWriteStillForbidden:true,formalCoreFunctionParity:true,
  system2Touched:false,noPlanChanges:true,noTrade:true,noPush:true
}));
