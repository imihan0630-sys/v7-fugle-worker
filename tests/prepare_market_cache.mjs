import {fetchOfficialMarketPayload} from "./system1_official_market_transport_v0_1.mjs";
import assert from 'node:assert/strict';
const origin='https://fugle-test.imihan0630.workers.dev';
const now=new Date();
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
const requestedMarketDate=String(process.env.OFFICIAL_MARKET_DATE || '').trim();
const marketDate=requestedMarketDate || today;
assert.match(marketDate,/^\d{4}-\d{2}-\d{2}$/,'OFFICIAL_MARKET_DATE must be YYYY-MM-DD');
assert.ok(marketDate<=today,'OFFICIAL_MARKET_DATE cannot be in the future');
assert.ok(Date.parse(today+'T00:00:00Z')-Date.parse(marketDate+'T00:00:00Z')<=86400000,'OFFICIAL_MARKET_DATE exceeds one-day scheduled recovery window');
assert.ok(process.env.V7_ADMIN_TOKEN,'Normal V7_ADMIN_TOKEN authorization is required');
for (const market of ['TWSE','TPEx']) {
  const sourceUrl=market==='TWSE'
    ? `https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=${marketDate.replaceAll('-','')}&type=ALLBUT0999`
    : `https://www.tpex.org.tw/www/zh-tw/afterTrading/dailyQuotes?date=${encodeURIComponent(marketDate.replaceAll('-','/'))}&id=&response=json`;
  const source=await fetchOfficialMarketPayload({market,sourceUrl});
  const payload=source.payload;
  // Worker再次核對官方日期、普通股數量及來源，拒絕舊資料或HTML。
  const response=await fetch(origin+'/api/market-data',{method:'POST',headers:{'x-admin-token':process.env.V7_ADMIN_TOKEN,'content-type':'application/json'},
    body:JSON.stringify({market,marketDate,sourceUrl,payload}),signal:AbortSignal.timeout(30000)});
  if([401,403].includes(response.status)) throw new Error('管理員授權失敗；停止，不替換憑證');
  const result=await response.json();
  assert.equal(response.ok,true,`${market} cache rejected: ${String(result.error || response.status).slice(0,500)}`);
  assert.equal(result.verified,true);
  assert.equal(result.marketDate,marketDate);
  console.log(JSON.stringify({officialMarketCached:true,market,marketDate,count:result.count,verified:true,
    sourceHttpStatus:source.httpStatus,sourceAttemptsUsed:source.attemptsUsed,transportPolicy:"BOUNDED_OFFICIAL_RETRY_V0_1"}));
}
