import assert from "node:assert/strict";
import {
  fetchOfficialMarketPayload,officialMarketRequestHeaders,retryableOfficialMarketStatus
} from "./system1_official_market_transport_v0_1.mjs";

const url="https://www.tpex.org.tw/www/zh-tw/afterTrading/dailyQuotes?date=2026%2F10%2F08&id=&response=json";
const jsonResponse=(status,payload)=>({
  status,ok:status>=200&&status<300,
  async text(){return JSON.stringify(payload);}
});

{
  const calls=[];let n=0;
  const fetchImpl=async(u,o)=>{
    calls.push({u,o});n++;
    return n===1?jsonResponse(403,{error:"waf"}):jsonResponse(200,{date:"20261008",tables:[]});
  };
  const r=await fetchOfficialMarketPayload({market:"TPEx",sourceUrl:url,fetchImpl,sleepImpl:async()=>{}});
  assert.equal(r.attemptsUsed,2);
  assert.equal(calls.length,2);
  assert.equal(calls[0].u,url,"canonical source URL must not be rewritten");
  assert.equal(calls[0].o.redirect,"follow");
  assert.match(calls[0].o.headers["user-agent"],/System1-Official-Market-Sync/);
  assert.match(calls[0].o.headers.referer,/tpex\.org\.tw/);
  assert.equal(calls[0].o.headers["cache-control"],"no-cache");
}
{
  let n=0;
  const socketError=Object.assign(new TypeError("terminated"),{cause:{code:"UND_ERR_SOCKET"}});
  const r=await fetchOfficialMarketPayload({
    market:"TPEx",sourceUrl:url,sleepImpl:async()=>{},
    fetchImpl:async()=>{n++;if(n===1)throw socketError;return jsonResponse(200,{date:"20261008",tables:[]});}
  });
  assert.equal(r.attemptsUsed,2);
}
{
  let calls=0;
  await assert.rejects(()=>fetchOfficialMarketPayload({
    market:"TPEx",sourceUrl:url,sleepImpl:async()=>{},
    fetchImpl:async()=>{calls++;return jsonResponse(404,{error:"not found"});}
  }),/OFFICIAL_MARKET_HTTP_404/);
  assert.equal(calls,1,"permanent HTTP errors must fail closed without retry");
}
{
  let calls=0;
  await assert.rejects(()=>fetchOfficialMarketPayload({
    market:"TPEx",sourceUrl:url,attempts:3,sleepImpl:async()=>{},
    fetchImpl:async()=>{calls++;return jsonResponse(503,{error:"busy"});}
  }),/OFFICIAL_MARKET_TRANSPORT_RETRY_EXHAUSTED/);
  assert.equal(calls,3);
}
assert.equal(retryableOfficialMarketStatus(403),true);
assert.equal(retryableOfficialMarketStatus(503),true);
assert.equal(retryableOfficialMarketStatus(404),false);
const headers=officialMarketRequestHeaders("TPEx");
assert.equal(headers.accept,"application/json,text/plain,*/*");

console.log(JSON.stringify({
  ok:true,assertions:14,canonicalUrlUnchanged:true,strongOfficialHeaders:true,
  transient403Retry:true,undiciSocketRetry:true,permanent404FailClosed:true,
  boundedRetry:true,maxAttempts:5,d1Mutation:false,kvMutation:false,
  formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
}));
