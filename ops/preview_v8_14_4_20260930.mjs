import assert from "node:assert/strict";

const origin="https://fugle-test.imihan0630.workers.dev";
const token=process.env.V7_ADMIN_TOKEN;
assert.ok(token,"V7_ADMIN_TOKEN required");
const headers={"x-admin-token":token,"content-type":"application/json","accept":"application/json"};
const target="2026-09-30";

async function get(path,timeout=30000){
  const res=await fetch(origin+path,{headers,signal:AbortSignal.timeout(timeout)});
  const text=await res.text();
  let data; try{data=JSON.parse(text)}catch{throw new Error(path+" non-json "+res.status+" "+text.slice(0,500))}
  if(!res.ok) throw new Error(path+" HTTP "+res.status+" "+String(data.error||data.detail||text).slice(0,1400));
  return data;
}
async function post(path,body,timeout=240000){
  const res=await fetch(origin+path,{method:"POST",headers,body:JSON.stringify(body),signal:AbortSignal.timeout(timeout)});
  const text=await res.text();
  let data; try{data=JSON.parse(text)}catch{throw new Error(path+" non-json "+res.status+" "+text.slice(0,500))}
  if(!res.ok) throw new Error(path+" HTTP "+res.status+" "+String(data.error||data.detail||text).slice(0,1400));
  return data;
}

const version=await get("/api/version");
assert.equal(version.version,"8.14.4-history-memory-compaction");

const quality=await get("/api/quality-status?marketDate="+target);
assert.equal(quality.marketDate,target);
assert.equal(quality.index?.ready,true);
assert.equal(quality.tdcc?.ready,true);
for(const kind of ["FINANCIAL","VALUATION","ANNOUNCEMENTS","QUARTER_EPS"]){
  assert.equal(quality.datasets?.[kind]?.ready,true,kind+" not ready");
}
const closure=await get("/api/history/closure-proof?marketDate=2026-07-10");
assert.ok(closure.TWSE && closure.TPEx,"7/10 closure proof missing");

const started=Date.now();
const preview=await post("/api/scan-preview",{marketDate:target,epsReviewOnly:true},240000);
const elapsedMs=Date.now()-started;

assert.equal(preview.scanDate,target,"preview scanDate mismatch");
assert.notEqual(preview.skipped,true,"preview must not be skipped");
const h=preview?.diagnostics?.historySourceRevalidation||{};
assert.ok(Number(h.usableSymbols||0)>0,"zero history-admitted symbols");
assert.equal(Number(h.reasons?.OFFICIAL_GAP_PROOF_UNAVAILABLE||0),0,"closure proof gap remains");

for(const stock of preview.stocks||[]){
  assert.equal(stock.closeDate,target,"stale closeDate "+stock.symbol);
  assert.equal(stock?.researchSnapshot?.provenance?.priceBarsThrough,target,"stale priceBarsThrough "+stock.symbol);
}

console.log(JSON.stringify({
  ok:true,
  readOnly:true,
  noPlanChanges:true,
  noPush:true,
  noTrade:true,
  version:version.version,
  scanDate:preview.scanDate,
  elapsedMs,
  selectedCount:preview.selectedCount,
  formal:(preview.stocks||[]).map(x=>({
    symbol:x.symbol,name:x.name,closeDate:x.closeDate,planDate:x.planDate,
    priceBarsThrough:x?.researchSnapshot?.provenance?.priceBarsThrough
  })),
  history:{
    usableSymbols:h.usableSymbols,
    unusableSymbols:h.unusableSymbols,
    verifiedMarketClosureSymbols:h.verifiedMarketClosureSymbols,
    reasons:h.reasons
  },
  system2Changed:false
},null,2));
