import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const sha256=(s)=>createHash("sha256").update(s).digest("hex");
const rocToIso=(s)=>{
  const m=String(s??"").match(/^(\d{2,3})年(\d{2})月(\d{2})日$/);
  if(!m) return null;
  return String(Number(m[1])+1911).padStart(4,"0")+"-"+m[2]+"-"+m[3];
};
const months=[];
for(let y=2023,m=1;y<2026 || (y===2026&&m<=8);){
  months.push([y,m]);
  m++; if(m===13){m=1;y++;}
}
assert.equal(months.length,44);

async function fetchMonth(y,m){
  const date=String(y)+String(m).padStart(2,"0")+"01";
  const url="https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU?date="+date+"&stockNo=1102&response=json";
  const res=await fetch(url,{headers:{"user-agent":"D08-scan-date-source-only/0.1"}});
  const text=await res.text();
  assert.equal(res.ok,true,"HTTP failure "+url);
  const json=JSON.parse(text);
  assert.equal(json.stat,"OK","source not OK "+url+" "+json.stat);
  const idx=json.fields.indexOf("日期");
  assert.ok(idx>=0,"日期 field missing");
  const dates=json.data.map(r=>rocToIso(r[idx])).filter(Boolean).sort();
  assert.ok(dates.length>0,"no trading rows "+y+"-"+m);
  const last=dates.at(-1);
  assert.ok(last.startsWith(String(y)+"-"+String(m).padStart(2,"0")+"-"),"last row wrong month");
  return {month:String(y)+"-"+String(m).padStart(2,"0"),scanDate:last,rowCount:dates.length,sourceHash:sha256(text)};
}

const rows=[];
for(let i=0;i<months.length;i+=6){
  const batch=months.slice(i,i+6);
  rows.push(...await Promise.all(batch.map(([y,m])=>fetchMonth(y,m))));
  await new Promise(r=>setTimeout(r,120));
}
rows.sort((a,b)=>a.month.localeCompare(b.month));
assert.equal(rows.length,44);
assert.equal(new Set(rows.map(x=>x.scanDate)).size,44);
assert.equal(rows[0].month,"2023-01");
assert.equal(rows.at(-1).month,"2026-08");
const receipt={
  schemaVersion:"D08_TWSE_MONTH_END_SCAN_DATE_RECEIPT_V0_1",
  generatedAt:new Date().toISOString(),
  researchOnly:true,
  outcomeJoin:false,
  resolver:"official TWSE BWIBBU monthly 1102 last observed session",
  monthCount:rows.length,
  firstMonth:rows[0].month,
  lastMonth:rows.at(-1).month,
  scanDates:rows,
  scanDateListHash:sha256(rows.map(x=>x.month+"="+x.scanDate).join("|")),
  sourceBundleHash:sha256(rows.map(x=>x.month+":"+x.sourceHash).join("|")),
  guards:{noReturns:true,noThresholdSelection:true,noFormalCoreImpact:true}
};
console.log("D08_SCAN_DATE_RECEIPT="+JSON.stringify(receipt));