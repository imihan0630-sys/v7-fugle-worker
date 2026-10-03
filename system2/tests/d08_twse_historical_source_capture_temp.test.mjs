import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { averageRankPercentile } from "../../research/historical_valuation_replay_core_v0_1.mjs";

const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const sha256=(s)=>createHash("sha256").update(s).digest("hex");
const toNum=(x)=>{
  const s=String(x??"").trim();
  if(!s || s==="-" || s.toUpperCase()==="N/A" || s==="--") return null;
  const n=Number(s.replaceAll(",",""));
  return Number.isFinite(n)?n:null;
};
const rocToIso=(s)=>{
  const m=String(s??"").match(/^(\d{2,3})年(\d{2})月(\d{2})日$/);
  if(!m) return null;
  return String(Number(m[1])+1911).padStart(4,"0")+"-"+m[2]+"-"+m[3];
};
const monthEnds=(startYm,endYm)=>{
  const [sy,sm]=startYm.split("-").map(Number);
  const [ey,em]=endYm.split("-").map(Number);
  const out=[];
  let y=sy,m=sm;
  while(y<ey || (y===ey && m<=em)){
    const d=new Date(Date.UTC(y,m,0)).getUTCDate();
    out.push(String(y).padStart(4,"0")+String(m).padStart(2,"0")+String(d).padStart(2,"0"));
    m++; if(m===13){m=1;y++;}
  }
  return out;
};
async function fetchMonth(symbol,ymd){
  const urls=[
    `https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU?date=${ymd}&stockNo=${symbol}&response=json`,
    `https://www.twse.com.tw/exchangeReport/BWIBBU?date=${ymd}&stockNo=${symbol}&response=json`,
  ];
  let last=null;
  for(const url of urls){
    try{
      const res=await fetch(url,{headers:{"user-agent":"Mozilla/5.0 D08-source-only-research"}});
      const text=await res.text();
      last={url,status:res.status,text};
      if(!res.ok) continue;
      const json=JSON.parse(text);
      if(json?.stat==="OK" && Array.isArray(json.fields) && Array.isArray(json.data)){
        return {url,status:res.status,text,json,hash:sha256(text)};
      }
    }catch(e){last={url,error:String(e)};}
  }
  throw new Error("TWSE monthly fetch failed "+symbol+" "+ymd+" "+JSON.stringify(last).slice(0,500));
}
function parseMonth(symbol,capture){
  const {json}=capture;
  const required=["日期","本益比","股價淨值比","財報年/季"];
  for(const h of required) assert.ok(json.fields.includes(h), "missing "+h+" for "+symbol);
  const idx=Object.fromEntries(json.fields.map((x,i)=>[x,i]));
  return json.data.map(row=>({
    symbol,
    tradeDate:rocToIso(row[idx["日期"]]),
    pe:toNum(row[idx["本益比"]]),
    pb:toNum(row[idx["股價淨值比"]]),
    fiscalReportPeriod:String(row[idx["財報年/季"]]??"").trim()||null,
  })).filter(x=>x.tradeDate);
}
async function captureSeries(symbol,startYm,endYm){
  const months=monthEnds(startYm,endYm);
  const captures=[];
  for(let i=0;i<months.length;i+=6){
    const batch=months.slice(i,i+6);
    const got=await Promise.all(batch.map(async ymd=>{
      const c=await fetchMonth(symbol,ymd);
      await sleep(80);
      return {ymd,...c};
    }));
    captures.push(...got);
    await sleep(150);
  }
  const rows=captures.flatMap(c=>parseMonth(symbol,c))
    .sort((a,b)=>a.tradeDate.localeCompare(b.tradeDate));
  const uniq=[];
  const seen=new Set();
  for(const r of rows){
    const key=r.tradeDate;
    if(seen.has(key)) continue;
    seen.add(key); uniq.push(r);
  }
  return {
    symbol,
    monthsRequested:months.length,
    monthsCaptured:captures.length,
    sourceFingerprint:sha256(captures.map(c=>c.ymd+":"+c.hash).join("|")),
    firstDate:uniq.at(0)?.tradeDate??null,
    lastDate:uniq.at(-1)?.tradeDate??null,
    rows:uniq,
  };
}
function metricReceipt(series,metric){
  const valid=series.rows.filter(r=>Number.isFinite(r[metric]));
  const current=valid.at(-1);
  if(!current) return {metric,state:"UNKNOWN",reason:"NO_VALID_VALUES",validCount:0};
  const values=valid.map(r=>r[metric]);
  const windows={};
  for(const n of [252,756,1260]){
    const ref=values.slice(-n);
    windows[n]={
      ...averageRankPercentile(ref,current[metric],{minValid:n}),
      startDate: valid.slice(-n).at(0)?.tradeDate??null,
      endDate: current.tradeDate,
    };
  }
  windows.expanding={
    ...averageRankPercentile(values,current[metric],{minValid:252}),
    startDate:valid.at(0)?.tradeDate??null,
    endDate:current.tradeDate,
  };
  return {metric,currentDate:current.tradeDate,currentValue:current[metric],validCount:valid.length,windows};
}

const s1102=await captureSeries("1102","2021-06","2026-10");
const s9904=await captureSeries("9904","2025-07","2026-10");
const s3593=await captureSeries("3593","2025-10","2026-02");
const s7812=await captureSeries("7812","2026-09","2026-10");
const s1101=await captureSeries("1101","2026-10","2026-10");

assert.ok(s1102.rows.length>1000,"1102 long history too short");
assert.ok(s1102.rows.filter(r=>Number.isFinite(r.pe)).length>=756,"1102 PE must support 756 valid observations");
assert.ok(s1102.rows.filter(r=>Number.isFinite(r.pb)).length>=756,"1102 PB must support 756 valid observations");

const denA=s9904.rows.find(r=>r.tradeDate==="2026-08-12");
const denB=s9904.rows.find(r=>r.tradeDate==="2026-08-13");
assert.ok(denA && denB,"9904 denominator transition rows missing");
assert.equal(denA.fiscalReportPeriod,"115/1");
assert.equal(denB.fiscalReportPeriod,"115/2");
assert.equal(denA.pe,6.60);
assert.equal(denB.pe,5.06);

const caBefore=s3593.rows.find(r=>r.tradeDate==="2025-12-19");
const caAfter=s3593.rows.find(r=>r.tradeDate==="2025-12-22");
assert.ok(caBefore && caAfter,"3593 corporate-action context rows missing");

assert.ok(s7812.firstDate>="2026-09-22","7812 must not predate official listing date");
assert.ok(s7812.rows.length<252,"7812 must be short-history control");

const miss=s1101.rows.at(-1);
assert.ok(miss,"1101 current row missing");
assert.equal(miss.pe,null,"1101 current PE expected unavailable");
assert.ok(Number.isFinite(miss.pb),"1101 current PB should remain available");

const receipt={
  schemaVersion:"D08_TWSE_BOUNDED_HISTORY_SOURCE_RECEIPT_V0_1",
  generatedAt:new Date().toISOString(),
  researchOnly:true,
  outcomeJoin:false,
  endpointFamily:"TWSE_BWIBBU_MONTHLY",
  cases:{
    ordinaryLongHistory:{
      symbol:"1102",
      monthsRequested:s1102.monthsRequested,
      sourceFingerprint:s1102.sourceFingerprint,
      firstDate:s1102.firstDate,lastDate:s1102.lastDate,totalRows:s1102.rows.length,
      pe:metricReceipt(s1102,"pe"),pb:metricReceipt(s1102,"pb"),
    },
    fiscalDenominatorTransition:{
      symbol:"9904",
      sourceFingerprint:s9904.sourceFingerprint,
      before:denA,after:denB,
      pe:metricReceipt(s9904,"pe"),pb:metricReceipt(s9904,"pb"),
    },
    corporateActionContext:{
      symbol:"3593",
      event:"LOSS_REDUCTION_UNIT_SCALE",
      effectiveDate:"2025-12-22",
      sourceFingerprint:s3593.sourceFingerprint,
      before:caBefore,after:caAfter,
      note:"Valuation rows are preserved as official observations; corporate-action context is a tag, not an automatic reset."
    },
    newListingShortHistory:{
      symbol:"7812",officialListingDate:"2026-09-22",
      sourceFingerprint:s7812.sourceFingerprint,
      firstDate:s7812.firstDate,lastDate:s7812.lastDate,totalRows:s7812.rows.length,
      peValid:s7812.rows.filter(r=>Number.isFinite(r.pe)).length,
      pbValid:s7812.rows.filter(r=>Number.isFinite(r.pb)).length,
      percentileEligibility:{
        252:false,756:false,1260:false
      }
    },
    peMissingPbPresent:{
      symbol:"1101",
      sourceFingerprint:s1101.sourceFingerprint,
      latest:miss,
    }
  },
  guards:{
    noReturns:true,
    noThresholdSelection:true,
    noFormalCoreImpact:true,
    tpExExcluded:true,
  }
};
console.log("D08_CAPTURE_RECEIPT="+JSON.stringify(receipt));
