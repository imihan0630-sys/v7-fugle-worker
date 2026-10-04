import { createHash } from "node:crypto";
import { deepFreeze } from "./factor_snapshot.mjs";

export const D08_HISTORICAL_VALUATION_YEAR_PACK_VERSION="0.1-RESEARCH";

function sha(value){
  return createHash("sha256").update(typeof value==="string"?value:JSON.stringify(value)).digest("hex");
}
function isoDate(v,f){
  const s=String(v??"").trim();
  if(!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Error(f+" must be YYYY-MM-DD");
  return s;
}
function finiteOrNull(v){
  if(v===null||v===undefined) return null;
  const n=Number(v);
  return Number.isFinite(n)?n:null;
}
function ordinary(v){return /^[1-9][0-9]{3}$/.test(String(v??"").trim());}

export function buildD08HistoricalValuationYearPackV0_1({
  year,fromDate,toDate,dateSources=[],
}={}){
  const y=Number(year);
  if(!Number.isInteger(y)||y<2005||y>2100) throw new Error("year invalid");
  const from=isoDate(fromDate,"fromDate");
  const to=isoDate(toDate,"toDate");
  if(to<from) throw new Error("toDate before fromDate");
  if(!from.startsWith(String(y)+"-")||!to.startsWith(String(y)+"-")) throw new Error("year/date mismatch");
  if(!Array.isArray(dateSources)||!dateSources.length) throw new Error("dateSources required");

  const seenDates=new Set();
  const days=[];
  for(const source of [...dateSources].sort((a,b)=>String(a.marketDate).localeCompare(String(b.marketDate)))){
    const date=isoDate(source.marketDate,"source.marketDate");
    if(date<from||date>to) throw new Error("source date outside year interval: "+date);
    if(seenDates.has(date)) throw new Error("duplicate valuation source date: "+date);
    seenDates.add(date);
    if(source.state!=="READY"||source.sourceDateEvidence!==date) throw new Error("source not PIT-ready: "+date);
    if(!/^[a-f0-9]{64}$/.test(String(source.sourcePayloadHash||""))) throw new Error("source payload hash missing: "+date);
    if(!Array.isArray(source.rows)) throw new Error("source rows missing: "+date);

    const seenSymbols=new Set();
    const rows=source.rows.map(r=>{
      const symbol=String(r.symbol??"").trim();
      if(!ordinary(symbol)) throw new Error("non ordinary symbol in A6 year pack: "+symbol);
      if(seenSymbols.has(symbol)) throw new Error("duplicate symbol "+symbol+" on "+date);
      seenSymbols.add(symbol);
      return {
        symbol,
        close:finiteOrNull(r.close),
        pe:finiteOrNull(r.pe),
        pb:finiteOrNull(r.pb),
        peState:r.peState==="KNOWN"?"KNOWN":"SOURCE_NA_OR_UNKNOWN",
        pbState:r.pbState==="KNOWN"?"KNOWN":"SOURCE_NA_OR_UNKNOWN",
        fiscalReportPeriod:r.fiscalReportPeriod||null,
      };
    }).sort((a,b)=>a.symbol.localeCompare(b.symbol));

    days.push({
      marketDate:date,
      sourcePayloadHash:String(source.sourcePayloadHash),
      sourcePayloadBytes:Number(source.sourcePayloadBytes||0),
      fieldFingerprint:String(source.fieldFingerprint||""),
      ordinarySymbolCount:rows.length,
      rows,
    });
  }

  const rowCount=days.reduce((s,d)=>s+d.rows.length,0);
  const peKnownCount=days.reduce((s,d)=>s+d.rows.filter(r=>r.pe!==null).length,0);
  const pbKnownCount=days.reduce((s,d)=>s+d.rows.filter(r=>r.pb!==null).length,0);
  const minDailyRows=Math.min(...days.map(d=>d.rows.length));
  const maxDailyRows=Math.max(...days.map(d=>d.rows.length));
  const fieldFingerprints=[...new Set(days.map(d=>d.fieldFingerprint))].sort();
  const sourceBundleHash=sha(days.map(d=>[
    d.marketDate,d.sourcePayloadHash,d.sourcePayloadBytes,d.fieldFingerprint,d.ordinarySymbolCount
  ].join("|")).join("\n"));

  const canonical={
    schemaVersion:"D08_TWSE_HISTORICAL_VALUATION_YEAR_PACK_V0_1",
    researchOnly:true,
    outcomeJoin:false,
    market:"TWSE",
    year:y,
    fromDate:from,
    toDate:to,
    historyBoundStart:"2017-01-01",
    tradingDateCount:days.length,
    rowCount,
    peKnownCount,
    pbKnownCount,
    minDailyRows,
    maxDailyRows,
    fieldFingerprints,
    sourceBundleHash,
    days,
  };
  const payloadJson=JSON.stringify(canonical);
  return deepFreeze({
    canonical:deepFreeze(canonical),
    payloadJson,
    payloadHash:sha(payloadJson),
    sourceBundleHash,
    schemaVersion:"D08_TWSE_HISTORICAL_VALUATION_YEAR_PACK_BUILD_V0_1",
  });
}

export function flattenD08HistoricalValuationYearPackV0_1(pack){
  if(!pack||pack.schemaVersion!=="D08_TWSE_HISTORICAL_VALUATION_YEAR_PACK_V0_1"){
    throw new Error("valid D08 year pack canonical object required");
  }
  const rows=[];
  for(const day of pack.days||[]){
    for(const row of day.rows||[]){
      rows.push(deepFreeze({
        market:"TWSE",
        tradeDate:day.marketDate,
        symbol:row.symbol,
        close:row.close,
        pe:row.pe,
        pb:row.pb,
        peState:row.peState,
        pbState:row.pbState,
        fiscalReportPeriod:row.fiscalReportPeriod,
        sourcePayloadHash:day.sourcePayloadHash,
      }));
    }
  }
  return Object.freeze(rows);
}
