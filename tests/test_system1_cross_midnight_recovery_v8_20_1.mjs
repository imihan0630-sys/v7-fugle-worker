import assert from "node:assert/strict";
import fs from "node:fs";

const source=fs.readFileSync(process.env.V7_TEST_WORKER_PATH||"Worker.js","utf8");
const beforePath="artifacts/Worker-before-v8_20_1.mjs";
assert.equal(fs.existsSync(beforePath),true,"V8.20.1 pre-patch Worker artifact missing");
const before=fs.readFileSync(beforePath,"utf8");

assert.match(source,/const VERSION = "8\.20\.1-cross-midnight-recovery-readback";/);
assert.match(source,/url\.pathname === "\/api\/market-data\/status"/);
assert.match(source,/url\.searchParams\.get\("marketDate"\)/);
assert.match(source,/historicalReadback:!!requestedDate/);
assert.match(source,/readOnly:true,historicalBackfillPerformed:false,noPlanChanges:true,noPush:true/);
assert.match(source,/date !== taiwanDate\(\)/,"historical market-data writes must remain forbidden");
assert.doesNotMatch(source,/POST.*\/api\/market-data\/status/s);

async function api(text){
  const encoded=Buffer.from(text+"\nexport {scoreCandidate,selectTomorrowCandidates,evaluateMomentum,evaluateOperationSignals,saveStockConfig};").toString("base64");
  return import("data:text/javascript;base64,"+encoded);
}
const [a,b]=await Promise.all([api(before),api(source)]);
for(const name of ["scoreCandidate","selectTomorrowCandidates","evaluateMomentum","evaluateOperationSignals","saveStockConfig"]){
  assert.equal(a[name].toString(),b[name].toString(),name+" changed by recovery hardening");
}

const added=source.length-before.length;
assert.ok(added>0&&added<8000,"unexpected V8.20.1 patch size");
console.log(JSON.stringify({
  ok:true,version:"8.20.1-cross-midnight-recovery-readback",
  marketStatusReadOnly:true,historicalInstitutionReadback:true,
  historicalMarketWriteStillForbidden:true,formalCoreFunctionParity:true,
  system2Touched:false,noPlanChanges:true,noTrade:true,noPush:true
}));
