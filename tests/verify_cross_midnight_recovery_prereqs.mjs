import assert from "node:assert/strict";

const origin="https://fugle-test.imihan0630.workers.dev";
const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const marketDate=String(process.env.RECOVERY_MARKET_DATE||"").trim();
assert.ok(token,"V7_ADMIN_TOKEN required");
assert.match(marketDate,/^\\d{4}-\\d{2}-\\d{2}$/,"RECOVERY_MARKET_DATE required");

const headers={"x-admin-token":token,"accept":"application/json"};
async function get(path){
  const response=await fetch(origin+path,{headers,signal:AbortSignal.timeout(45000)});
  if([401,403].includes(response.status)) throw new Error("RECOVERY_PREREQ_AUTH_REJECTED");
  const body=await response.json().catch(()=>null);
  assert.equal(response.ok,true,path+" rejected: "+String(body?.error||response.status).slice(0,400));
  return body;
}
const market=await get("/api/market-data/status?marketDate="+encodeURIComponent(marketDate));
assert.equal(market.marketDate,marketDate);
assert.equal(market.ready,true,"Previous-session TWSE/TPEx market cache incomplete; fail closed");
assert.equal(market.markets?.TWSE?.ready,true);
assert.equal(market.markets?.TPEx?.ready,true);
const institution=await get("/api/institution-status?marketDate="+encodeURIComponent(marketDate));
assert.equal(institution.marketDate,marketDate);
assert.equal(institution.ready,true,"Previous-session institution streak incomplete; fail closed");
assert.equal(institution.historicalReadback,true);
console.log(JSON.stringify({
  ok:true,marketDate,crossMidnightPrerequisitesVerified:true,
  marketCounts:{TWSE:market.markets.TWSE.count,TPEx:market.markets.TPEx.count},
  institutionValidDates:institution.validDates,
  readOnly:true,historicalBackfillPerformed:false,noPlanChanges:true,noTrade:true,noPush:true
}));
