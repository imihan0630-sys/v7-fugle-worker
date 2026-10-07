import { createHash } from "node:crypto";
import { deepFreeze } from "./factor_snapshot.mjs";

export const OFFICIAL_HISTORICAL_A6_VALUATION_VERSION="0.1-RESEARCH";
export const OFFICIAL_HISTORICAL_A6_VALUATION_SOURCE=deepFreeze({
  market:"TWSE",
  sourceId:"A6_TWSE_BWIBBU_D_HISTORICAL",
  sourceName:"TWSE BWIBBU_d historical daily valuation",
  sourceUrl:"https://www.twse.com.tw/exchangeReport/BWIBBU_d",
});

function reqText(v,f){
  if(typeof v!=="string"||!v.trim()) throw new Error(f+" is required");
  return v.trim();
}
function isoDate(v,f="marketDate"){
  const x=reqText(v,f);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(x)) throw new Error(f+" must be YYYY-MM-DD");
  return x;
}
function compact(d){return d.replaceAll("-","");}
function numberOrNull(v){
  const s=String(v??"").trim().replaceAll(",","");
  if(!s||s==="-"||s==="--"||s.toUpperCase()==="N/A") return null;
  const n=Number(s); return Number.isFinite(n)?n:null;
}
function ordinary(v){return /^[1-9][0-9]{3}$/.test(String(v??"").trim());}
function payloadDate(v){
  const s=String(v??"").replace(/\D/g,"");
  return s.length===8?s.slice(0,4)+"-"+s.slice(4,6)+"-"+s.slice(6,8):null;
}
function indexMap(fields){return Object.fromEntries(fields.map((x,i)=>[String(x).trim(),i]));}

export function parseOfficialHistoricalA6ValuationPayloadV0_1({
  marketDate,payload,observedAt,sourceUrl=null,sourcePayloadHash=null,sourcePayloadBytes=null,
}={}){
  const date=isoDate(marketDate);
  if(!payload||typeof payload!=="object"||Array.isArray(payload)) throw new Error("A6 payload must be object");
  if(payload.stat!=="OK") throw new Error("A6 source stat not OK "+date+" stat="+String(payload.stat??"UNKNOWN"));
  if(!Array.isArray(payload.fields)||!Array.isArray(payload.data)) throw new Error("A6 fields/data invalid");
  const required=["證券代號","證券名稱","本益比","股價淨值比"];
  const missing=required.filter(h=>!payload.fields.includes(h));
  if(missing.length) throw new Error("A6 schema drift missing core: "+missing.join(","));
  const closeFieldProvided=payload.fields.includes("收盤價");
  const fiscalReportPeriodFieldProvided=payload.fields.includes("財報年/季");
  const sourceSchemaProfile=closeFieldProvided&&fiscalReportPeriodFieldProvided
    ?"MODERN_RATIO_PLUS_CONTEXT"
    :(!closeFieldProvided&&!fiscalReportPeriodFieldProvided
      ?"LEGACY_RATIO_ONLY"
      :"PARTIAL_RATIO_CONTEXT");
  const evidence=payloadDate(payload.date);
  if(!evidence) throw new Error("A6 source date evidence missing");
  if(evidence!==date) throw new Error("SOURCE_DATE_MISMATCH:A6:requested="+date+":received="+evidence);
  const idx=indexMap(payload.fields);
  const seen=new Set();
  const rows=[];
  for(const raw of payload.data){
    if(!Array.isArray(raw)) continue;
    const symbol=String(raw[idx["證券代號"]]??"").trim();
    if(!ordinary(symbol)) continue;
    if(seen.has(symbol)) throw new Error("duplicate A6 ordinary symbol: "+symbol);
    seen.add(symbol);
    const pe=numberOrNull(raw[idx["本益比"]]);
    const pb=numberOrNull(raw[idx["股價淨值比"]]);
    rows.push(deepFreeze({
      market:"TWSE",
      marketDate:date,
      symbol,
      companyName:String(raw[idx["證券名稱"]]??"").trim()||null,
      close:closeFieldProvided?numberOrNull(raw[idx["收盤價"]]):null,
      closeState:closeFieldProvided?"SOURCE_FIELD_PRESENT":"SOURCE_NOT_PROVIDED",
      pe,pb,
      peState:pe===null?"SOURCE_NA_OR_UNKNOWN":"KNOWN",
      pbState:pb===null?"SOURCE_NA_OR_UNKNOWN":"KNOWN",
      fiscalReportPeriod:fiscalReportPeriodFieldProvided?(String(raw[idx["財報年/季"]]??"").trim()||null):null,
      fiscalReportPeriodState:fiscalReportPeriodFieldProvided?"SOURCE_FIELD_PRESENT":"SOURCE_NOT_PROVIDED",
      sourceFields:deepFreeze({fields:payload.fields,row:raw}),
      observedAt:String(observedAt||new Date().toISOString()),
      sourceId:OFFICIAL_HISTORICAL_A6_VALUATION_SOURCE.sourceId,
    }));
  }
  return deepFreeze({
    market:"TWSE",marketDate:date,state:rows.length?"READY":"NO_DATA",
    sourceId:OFFICIAL_HISTORICAL_A6_VALUATION_SOURCE.sourceId,
    sourceName:OFFICIAL_HISTORICAL_A6_VALUATION_SOURCE.sourceName,
    sourceUrl:sourceUrl||buildOfficialHistoricalA6ValuationUrlV0_1(date),
    sourceDateEvidence:evidence,
    fieldFingerprint:payload.fields.join("|"),
    sourceSchemaProfile,
    closeFieldProvided,
    fiscalReportPeriodFieldProvided,
    sourcePayloadHash:sourcePayloadHash||null,
    sourcePayloadBytes:Number.isInteger(sourcePayloadBytes)?sourcePayloadBytes:null,
    ordinarySymbolCount:rows.length,
    rows:Object.freeze(rows),
    schemaVersion:"S2_OFFICIAL_HISTORICAL_A6_VALUATION_DATE_V0_1",
  });
}

export function buildOfficialHistoricalA6ValuationUrlV0_1(marketDate){
  const date=isoDate(marketDate);
  return OFFICIAL_HISTORICAL_A6_VALUATION_SOURCE.sourceUrl+
    "?response=json&date="+compact(date)+"&selectType=ALL";
}

export async function fetchOfficialHistoricalA6ValuationDateV0_1({
  marketDate,observedAt=new Date().toISOString(),fetchImpl=globalThis.fetch,
  retryAttempts=3,retryDelayMs=350,
}={}){
  if(typeof fetchImpl!=="function") throw new Error("fetchImpl is required");
  const url=buildOfficialHistoricalA6ValuationUrlV0_1(marketDate);
  let last=null;
  for(let attempt=1;attempt<=retryAttempts;attempt++){
    try{
      const res=await fetchImpl(url,{
        headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-D08-A6-History/0.1"},
        signal:AbortSignal.timeout(45000),
      });
      if(!res.ok) throw new Error("A6 transport HTTP "+res.status);
      const text=await res.text();
      const payload=JSON.parse(text);
      const bytes=Buffer.byteLength(text,"utf8");
      const hash=createHash("sha256").update(text).digest("hex");
      return parseOfficialHistoricalA6ValuationPayloadV0_1({
        marketDate,payload,observedAt,sourceUrl:url,sourcePayloadHash:hash,sourcePayloadBytes:bytes,
      });
    }catch(e){
      const msg=String(e?.message||e);
      if(msg.includes("SOURCE_DATE_MISMATCH")||msg.includes("schema drift")||
         msg.includes("source stat")||msg.includes("duplicate A6")||msg.includes("date evidence")){
        throw e;
      }
      last=e;
      if(attempt<retryAttempts) await new Promise(r=>setTimeout(r,retryDelayMs*attempt));
    }
  }
  throw new Error("A6 historical source exhausted transports "+marketDate+": "+String(last?.message||last));
}
