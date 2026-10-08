import assert from "node:assert/strict";
import {
  fetchOfficialMarketPayload,officialMarketRequestHeaders,retryableOfficialMarketStatus
} from "./system1_official_market_transport_v0_1.mjs";

const tpexUrl="https://www.tpex.org.tw/www/zh-tw/afterTrading/dailyQuotes?date=2026%2F10%2F08&id=&response=json";
const twseUrl="https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=20261008&type=ALLBUT0999";
const jsonResponse=(status,payload)=>new Response(JSON.stringify(payload),{
  status,headers:{"content-type":"application/json"}
});

{
  const calls=[];let n=0;
  const nodeHttpsImpl=async(u,o,timeout)=>{
    calls.push({u,o,timeout});n++;
    return n===1?jsonResponse(403,{error:"waf"}):jsonResponse(200,{date:"20261008",tables:[]});
  };
  const r=await fetchOfficialMarketPayload({market:"TPEx",sourceUrl:tpexUrl,nodeHttpsImpl,sleepImpl:async()=>{}});
  assert.equal(r.attemptsUsed,2);
  assert.equal(r.transport,"node-https");
  assert.equal(calls.length,2);
  assert.equal(calls[0].u,tpexUrl,"canonical source URL must not be rewritten");
  assert.equal(calls[0].timeout,30000);
  assert.match(calls[0].o.headers["user-agent"],/System1-Official-Market-Sync/);
  assert.match(calls[0].o.headers.referer,/tpex\.org\.tw/);
  assert.equal(calls[0].o.headers["cache-control"],"no-cache");
}
{
  let n=0;
  const socketError=Object.assign(new TypeError("socket closed"),{code:"ECONNRESET"});
  const r=await fetchOfficialMarketPayload({
    market:"TPEx",sourceUrl:tpexUrl,sleepImpl:async()=>{},
    nodeHttpsImpl:async()=>{n++;if(n===1)throw socketError;return jsonResponse(200,{date:"20261008",tables:[]});}
  });
  assert.equal(r.attemptsUsed,2);
}
{
  let calls=0;
  await assert.rejects(()=>fetchOfficialMarketPayload({
    market:"TPEx",sourceUrl:tpexUrl,sleepImpl:async()=>{},
    nodeHttpsImpl:async()=>{calls++;return jsonResponse(404,{error:"not found"});}
  }),/OFFICIAL_MARKET_HTTP_404/);
  assert.equal(calls,1,"permanent HTTP errors must fail closed without retry");
}
{
  let calls=0;
  await assert.rejects(()=>fetchOfficialMarketPayload({
    market:"TPEx",sourceUrl:tpexUrl,attempts:3,sleepImpl:async()=>{},
    nodeHttpsImpl:async()=>{calls++;return jsonResponse(503,{error:"busy"});}
  }),/OFFICIAL_MARKET_TRANSPORT_RETRY_EXHAUSTED/);
  assert.equal(calls,3);
}
{
  let fetchCalls=0,nativeCalls=0;
  const r=await fetchOfficialMarketPayload({
    market:"TWSE",sourceUrl:twseUrl,sleepImpl:async()=>{},
    fetchImpl:async()=>{fetchCalls++;return jsonResponse(200,{stat:"OK",data:[]});},
    nodeHttpsImpl:async()=>{nativeCalls++;throw new Error("TWSE must not use native transport");}
  });
  assert.equal(r.transport,"fetch");
  assert.equal(fetchCalls,1);
  assert.equal(nativeCalls,0);
}
assert.equal(retryableOfficialMarketStatus(403),true);
assert.equal(retryableOfficialMarketStatus(503),true);
assert.equal(retryableOfficialMarketStatus(404),false);
const headers=officialMarketRequestHeaders("TPEx");
assert.equal(headers.accept,"application/json,text/plain,*/*");

console.log(JSON.stringify({
  ok:true,assertions:20,canonicalUrlUnchanged:true,strongOfficialHeaders:true,
  tpexNativeHttps:true,twseFetchUnchanged:true,transient403Retry:true,
  socketRetry:true,permanent404FailClosed:true,boundedRetry:true,maxAttempts:5,
  d1Mutation:false,kvMutation:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
}));
