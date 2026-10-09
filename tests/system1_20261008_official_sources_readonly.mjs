import {mkdir,writeFile} from "node:fs/promises";
import {fetchOfficialMarketPayload} from "./system1_official_market_transport_v0_1.mjs";
const marketDate="2026-10-08";
const origin={
  TWSE:"https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=20261008&type=ALLBUT0999",
  TPEx:"https://www.tpex.org.tw/www/zh-tw/afterTrading/dailyQuotes?date=2026%2F10%2F08&id=&response=json"
};
const receipt={
 schemaVersion:"SYSTEM1_OFFICIAL_SOURCE_20261008_PUBLIC_READONLY_V0_1",
 observedAt:new Date().toISOString(),marketDate,
 evidenceGrade:"OFFICIAL_SOURCE_RESPONSE_ONLY",
 productionD1HistoryVerified:false,formalScanVerified:false,
 noCredentials:true,noWorkerPost:true,noD1Write:true,noTrade:true,noPush:true,
 sources:{}
};
for(const market of ["TWSE","TPEx"]){
 const entry={reachable:false,httpStatus:null,sourceAttempts:null,returnedKeys:[],errorClass:null};
 try{
  const fetched=await fetchOfficialMarketPayload({market,sourceUrl:origin[market],attempts:2,timeoutMs:18000});
  const p=fetched.payload;
  entry.reachable=true;
  entry.httpStatus=fetched.httpStatus;
  entry.sourceAttempts=fetched.attemptsUsed;
  entry.returnedKeys=Object.keys(p||{}).slice(0,22);
  entry.dateField=p?.date??p?.Date??null;
  entry.statusField=p?.stat??p?.status??null;
  entry.possibleRowCount=Array.isArray(p?.data9)?p.data9.length:
    Array.isArray(p?.data)?p.data.length:
    Array.isArray(p?.tables)?p.tables.length:
    Array.isArray(p?.aaData)?p.aaData.length:null;
 }catch(e){
  const msg=String(e?.message||"");
  entry.errorClass=msg.includes("RETRY_EXHAUSTED")?"RETRY_EXHAUSTED":
    msg.includes("NON_JSON")?"NON_JSON":
    msg.includes("HTTP_")?"HTTP_NON_OK":"NETWORK_OR_SCHEMA";
 }
 receipt.sources[market]=entry;
}
receipt.bothSourcesReachable=receipt.sources.TWSE.reachable&&receipt.sources.TPEx.reachable;
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/system1-official-source-20261008-readonly.json",JSON.stringify(receipt,null,2)+"\n");
console.log("SYSTEM1_OFFICIAL_20261008_SOURCE_READONLY="+JSON.stringify(receipt));
