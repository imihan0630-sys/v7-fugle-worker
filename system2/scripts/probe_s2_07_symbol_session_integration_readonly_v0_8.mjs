import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { buildOfficialTradingDatesV0_1 } from "../runtime/official_historical_backfill_source_v0_1.mjs";
import {
  evaluateSymbolSessionIntegrationV0_8,
  summarizeSymbolSessionIntegrationV0_8,
} from "../runtime/s2_07_symbol_session_integration_v0_8.mjs";

const START="2026-04-05";
const END="2026-10-02";
const PROMOTION_RECEIPT_URL=new URL("../evidence/S2_07_PROMOTION_LINKAGE_V0_7_PHYSICAL_20261006.json",import.meta.url);

function sha256Text(value){return createHash("sha256").update(String(value)).digest("hex");}
function normalizedField(value){return String(value??"").replace(/<[^>]*>/g,"").replace(/\s+/g,"").trim();}
function dateFromAny(value){
  const text=String(value??"").trim();
  if(!text)return null;
  const digits=text.replace(/\D/g,"");
  if(digits.length===8)return digits.slice(0,4)+"-"+digits.slice(4,6)+"-"+digits.slice(6,8);
  if(digits.length===7){
    const y=Number(digits.slice(0,3))+1911;
    return String(y).padStart(4,"0")+"-"+digits.slice(3,5)+"-"+digits.slice(5,7);
  }
  return null;
}

async function fetchTwseSuspensions(){
  const start=START.replaceAll("-",""),end=END.replaceAll("-","");
  const url="https://www.twse.com.tw/rwd/zh/afterTrading/TWTAWU"
    +"?startDate="+encodeURIComponent(start)+"&endDate="+encodeURIComponent(end)+"&querytype=3&response=json";
  const response=await fetch(url,{headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-S2-07-Symbol-Session/0.8"},signal:AbortSignal.timeout(60000)});
  const raw=await response.text();
  assert.equal(response.ok,true,"TWTAWU HTTP "+response.status);
  const payload=JSON.parse(raw);
  const fields=Array.isArray(payload?.fields)?payload.fields.map(normalizedField):[];
  const data=Array.isArray(payload?.data)?payload.data:[];
  const symbolIndex=fields.findIndex(x=>x.includes("證券代號")||x.includes("股票代號")||x==="代號");
  const suspendedIndex=fields.findIndex(x=>(x.includes("停止買賣")||x.includes("暫停交易")||x.includes("停止交易"))&&x.includes("日期"));
  const resumedIndex=fields.findIndex(x=>(x.includes("恢復買賣")||x.includes("恢復交易"))&&x.includes("日期"));
  assert.ok(symbolIndex>=0,"TWTAWU symbol field missing");
  assert.ok(suspendedIndex>=0,"TWTAWU suspension-date field missing");
  const intervals=[];
  for(const row of data){
    if(!Array.isArray(row))continue;
    const symbol=String(row[symbolIndex]??"").trim();
    if(!/^[1-9][0-9]{3}$/.test(symbol))continue;
    const suspendedFrom=dateFromAny(row[suspendedIndex]);
    const resumedOn=resumedIndex>=0?dateFromAny(row[resumedIndex]):null;
    if(!suspendedFrom)continue;
    intervals.push({
      market:"TWSE",symbol,suspendedFrom,resumedOn,coverageTo:END,
      sourceId:"TWSE_TWTAWU",
      sourceContractId:"D03_TWSE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT_V0_1",
      sourceRowHash:sha256Text(JSON.stringify({fields,row})),
      sourceArtifactHash:sha256Text(raw),
      sourceCoverageState:"BOUNDED_QUERY_OBSERVED_NO_ABSENCE_CERTIFICATION",
    });
  }
  return {market:"TWSE",sourceUrl:url,sourceArtifactHash:sha256Text(raw),fieldNames:fields,rowCount:data.length,intervals,absenceCertifiesNoSuspension:false,allHistoryCompletenessCertified:false};
}

async function fetchTpexSuspensions(){
  const url="https://www.tpex.org.tw/www/zh-tw/bulletin/sprcHis";
  const body=new URLSearchParams({date:"2026",cate:"1",response:"json"});
  const response=await fetch(url,{
    method:"POST",redirect:"follow",
    headers:{accept:"application/json,text/plain,*/*","content-type":"application/x-www-form-urlencoded; charset=UTF-8",referer:"https://www.tpex.org.tw/zh-tw/announce/market/halt/historical.html","user-agent":"System2-S2-07-Symbol-Session/0.8"},
    body,signal:AbortSignal.timeout(60000),
  });
  const raw=await response.text();
  assert.equal(response.ok,true,"TPEx sprcHis HTTP "+response.status);
  const payload=JSON.parse(raw);
  assert.equal(String(payload?.stat||"").toLowerCase(),"ok","TPEx sprcHis stat must be ok");
  const table=Array.isArray(payload?.tables)?payload.tables[0]||{}:{};
  const fields=Array.isArray(table.fields)?table.fields.map(normalizedField):[];
  const data=Array.isArray(table.data)?table.data:[];
  assert.equal(Number(table.totalCount??data.length),data.length,"TPEx totalCount mismatch");
  const symbolIndex=fields.findIndex(x=>x.includes("有價證券代號")||x.includes("證券代號")||x==="代號");
  const suspendedIndex=fields.findIndex(x=>x.includes("暫停交易日期"));
  const resumedIndex=fields.findIndex(x=>x.includes("恢復交易日期"));
  assert.ok(symbolIndex>=0,"TPEx symbol field missing");
  assert.ok(suspendedIndex>=0,"TPEx suspension-date field missing");
  const intervals=[];
  for(const row of data){
    if(!Array.isArray(row))continue;
    const symbol=String(row[symbolIndex]??"").trim();
    if(!/^[1-9][0-9]{3}$/.test(symbol))continue;
    const suspendedFrom=dateFromAny(row[suspendedIndex]);
    const resumedOn=resumedIndex>=0?dateFromAny(row[resumedIndex]):null;
    if(!suspendedFrom)continue;
    intervals.push({
      market:"TPEX",symbol,suspendedFrom,resumedOn,coverageTo:END,
      sourceId:"TPEX_SPRC_HIS",
      sourceContractId:"D03_TPEX_HALT_RESUMPTION_MACHINE_CONTRACT_V0_2",
      sourceRowHash:sha256Text(JSON.stringify({fields,row})),
      sourceArtifactHash:sha256Text(raw),
      sourceCoverageState:"BOUNDED_2026_MAINBOARD_POPULATION_PASS_NO_ALL_HISTORY_CERTIFICATION",
    });
  }
  return {market:"TPEX",sourceUrl:url,sourceArtifactHash:sha256Text(raw),fieldNames:fields,rowCount:data.length,totalCount:Number(table.totalCount??data.length),intervals,absenceCertifiesNoSuspension:false,allHistoryCompletenessCertified:false};
}

const promotionReceipt=JSON.parse(await readFile(PROMOTION_RECEIPT_URL,"utf8"));
assert.equal(promotionReceipt.schemaVersion,"S2_S2_07_PROMOTION_LINKAGE_PHYSICAL_RECEIPT_V0_7");
assert.equal(promotionReceipt.summary.eventCount,17);

const [calendar,twse,tpex]=await Promise.all([
  buildOfficialTradingDatesV0_1({fromDate:START,toDate:END}),
  fetchTwseSuspensions(),
  fetchTpexSuspensions(),
]);
assert.ok(calendar.tradingDateCount>0);
const intervals=[...twse.intervals,...tpex.intervals];
const rows=promotionReceipt.events.map(event=>evaluateSymbolSessionIntegrationV0_8({
  event,
  promotion:{state:event.state},
  marketSessions:calendar.tradingDates,
  suspensionIntervals:intervals,
}));
const summary=summarizeSymbolSessionIntegrationV0_8(rows);
assert.equal(summary.eventCount,17);
assert.equal(summary.promotionReadyCount,7);
assert.equal(summary.noSuspensionCertifiedCount,0);
assert.equal(summary.suspensionCoverageComplete,false);
assert.equal(summary.symbolSessionCompletenessCertified,false);
assert.equal(summary.technicalContinuityCertified,false);
assert.equal(summary.selectionAuthority,false);
assert.equal(summary.orderImpact,false);
for(const row of rows){
  if(row.boundedSymbolSessionEvidenceReady)assert.equal(row.promotionEvidenceReady,true);
  assert.equal(row.noSuspensionMayBeClaimed,false);
  assert.equal(row.symbolSessionCompletenessCertified,false);
  assert.equal(row.technicalContinuityCertified,false);
}
console.log(JSON.stringify({
  result:"S2_07_SYMBOL_SESSION_INTEGRATION_V0_8_COMPLETE",
  interval:{startDate:START,endDate:END},
  calendar:{source:calendar.source,tradingDateCount:calendar.tradingDateCount},
  sourceReceipts:{TWSE:twse,TPEX:tpex},
  summary,
  events:rows,
},null,2));
