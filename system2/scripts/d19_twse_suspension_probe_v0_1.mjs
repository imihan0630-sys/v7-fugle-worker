import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const startDate=process.env.D19_SUSP_START || "20260803";
const endDate=process.env.D19_SUSP_END || "20260831";
const unknownSymbols=new Set([
  "1213","1218","1341","1443","1472","1516","1538","1563","1589","1909",
  "2254","2321","2712","2867","4190","5906","6176","6949","6955","8101",
  "8105","8482","9110",
]);
const url="https://www.twse.com.tw/rwd/zh/afterTrading/TWTAWU"
  +"?startDate="+encodeURIComponent(startDate)
  +"&endDate="+encodeURIComponent(endDate)
  +"&querytype=3&response=json";
const response=await fetch(url,{
  headers:{accept:"application/json,text/plain,*/*","user-agent":"D19-TWSE-suspension-probe/0.1"},
  signal:AbortSignal.timeout(60000),
});
const rawText=await response.text();
assert.equal(response.ok,true,"TWTAWU HTTP "+response.status);
const payload=JSON.parse(rawText);
assert.ok(payload&&typeof payload==="object"&&!Array.isArray(payload),"TWTAWU payload object required");
const fields=Array.isArray(payload.fields)?payload.fields.map(x=>String(x??"").trim()):[];
const data=Array.isArray(payload.data)?payload.data:[];
assert.ok(fields.length>0&&Array.isArray(data),"TWTAWU fields/data required");
const normalized=fields.map(x=>x.replace(/\s+/g,""));
const symbolIndex=normalized.findIndex(x=>x.includes("證券代號")||x.includes("股票代號")||x==="代號");
assert.ok(symbolIndex>=0,"TWTAWU symbol field missing: "+fields.join("|"));
const dateIndexes=normalized.map((x,i)=>({x,i})).filter(({x})=>x.includes("日期")).map(({i})=>i);
const ordinary=/^[1-9][0-9]{3}$/;
const rows=data.filter(row=>Array.isArray(row)&&ordinary.test(String(row[symbolIndex]??"").trim()));
const matched=rows.filter(row=>unknownSymbols.has(String(row[symbolIndex]??"").trim()));
const sha=x=>createHash("sha256").update(x).digest("hex");
console.log(JSON.stringify({
  result:"PASS",
  probeVersion:"D19_TWSE_SUSPENSION_PROVENANCE_V0_1",
  requestedStartDate:startDate,
  requestedEndDate:endDate,
  sourceUrl:url,
  httpStatus:response.status,
  payloadHash:sha(rawText),
  upstreamStat:payload.stat??payload.status??null,
  fields,
  ordinaryRowCount:rows.length,
  unknownSymbolCount:unknownSymbols.size,
  matchedUnknownSymbolCount:new Set(matched.map(row=>String(row[symbolIndex]).trim())).size,
  matchedUnknownSymbols:[...new Set(matched.map(row=>String(row[symbolIndex]).trim()))].sort(),
  matchedRows:matched.map(row=>({
    symbol:String(row[symbolIndex]).trim(),
    dates:dateIndexes.map(i=>({field:fields[i],value:row[i]??null})),
    row,
  })),
  noMatchUnknownSymbols:[...unknownSymbols].filter(symbol=>!matched.some(row=>String(row[symbolIndex]).trim()===symbol)).sort(),
  note:"Absence from this result is not NO_SUSPENSION certification; exact source completeness and range identity remain separate gates.",
  formalCoreChanged:false,
  productionChanged:false,
},null,2));
