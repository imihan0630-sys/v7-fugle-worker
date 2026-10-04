import { createHash } from "node:crypto";
import { deepFreeze } from "./factor_snapshot.mjs";

export const D08_TWSE_DAILY_VALUATION_YEAR_PACK_VERSION="0.1-RESEARCH";

function sha(v){return createHash("sha256").update(typeof v==="string"?v:JSON.stringify(v)).digest("hex");}
function iso(v,f){
  const s=String(v??"").trim();
  if(!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Error(f+" must be YYYY-MM-DD");
  return s;
}
function num(v){return Number.isFinite(v)?Number(v):null;}

export function canonicalizeD08ValuationDayV0_1(source){
  if(!source||source.schemaVersion!=="S2_OFFICIAL_HISTORICAL_A6_VALUATION_DATE_V0_1"){
    throw new Error("valid official historical A6 valuation receipt is required");
  }
  if(source.state!=="READY") throw new Error("A6 valuation day must be READY");
  const date=iso(source.marketDate,"marketDate");
  if(source.sourceDateEvidence!==date) throw new Error("A6 source date mismatch");
  if(!source.sourcePayloadHash) throw new Error("A6 source payload hash is required");
  const rows=[...source.rows].map(r=>({
    symbol:String(r.symbol),
    close:num(r.close),
    pe:num(r.pe),
    pb:num(r.pb),
    peState:String(r.peState),
    pbState:String(r.pbState),
    fiscalReportPeriod:r.fiscalReportPeriod===null?null:String(r.fiscalReportPeriod),
  })).sort((a,b)=>a.symbol.localeCompare(b.symbol));

  const seen=new Set();
  for(const r of rows){
    if(!/^[1-9][0-9]{3}$/.test(r.symbol)) throw new Error("non ordinary symbol "+r.symbol);
    if(seen.has(r.symbol)) throw new Error("duplicate valuation symbol "+r.symbol+" "+date);
    seen.add(r.symbol);
  }
  const peKnown=rows.filter(r=>Number.isFinite(r.pe)).length;
  const pbKnown=rows.filter(r=>Number.isFinite(r.pb)).length;
  const canonical={
    marketDate:date,
    sourceId:String(source.sourceId),
    sourcePayloadHash:String(source.sourcePayloadHash),
    sourcePayloadBytes:Number(source.sourcePayloadBytes||0),
    fieldFingerprint:String(source.fieldFingerprint),
    sourceSchemaProfile:String(source.sourceSchemaProfile||"UNKNOWN"),
    closeFieldProvided:source.closeFieldProvided===true,
    fiscalReportPeriodFieldProvided:source.fiscalReportPeriodFieldProvided===true,
    ordinarySymbolCount:rows.length,
    peKnownCount:peKnown,
    pbKnownCount:pbKnown,
    rows,
    schemaVersion:"D08_TWSE_DAILY_VALUATION_DAY_V0_1",
  };
  return deepFreeze({...canonical,dayPayloadHash:sha(canonical)});
}

export function buildD08ValuationYearPackV0_1({
  year,fromDate,toDate,calendarSource,dayReceipts,
}={}){
  if(!Number.isInteger(year)||year<2005||year>2100) throw new Error("year invalid");
  const from=iso(fromDate,"fromDate"), to=iso(toDate,"toDate");
  if(from.slice(0,4)!==String(year)||to.slice(0,4)!==String(year)||to<from) throw new Error("year range invalid");
  if(!Array.isArray(dayReceipts)||!dayReceipts.length) throw new Error("dayReceipts required");
  const days=dayReceipts.map(canonicalizeD08ValuationDayV0_1)
    .sort((a,b)=>a.marketDate.localeCompare(b.marketDate));
  const seen=new Set();
  for(const d of days){
    if(d.marketDate<from||d.marketDate>to) throw new Error("day outside pack range "+d.marketDate);
    if(seen.has(d.marketDate)) throw new Error("duplicate pack day "+d.marketDate);
    seen.add(d.marketDate);
  }
  const totalRows=days.reduce((s,d)=>s+d.ordinarySymbolCount,0);
  const totalPeKnown=days.reduce((s,d)=>s+d.peKnownCount,0);
  const totalPbKnown=days.reduce((s,d)=>s+d.pbKnownCount,0);
  const canonical={
    market:"TWSE",
    year,
    fromDate:from,
    toDate:to,
    calendarSource:String(calendarSource||"UNKNOWN"),
    tradingDateCount:days.length,
    totalRows,
    totalPeKnown,
    totalPbKnown,
    sourceBundleHash:sha(days.map(d=>d.marketDate+"|"+d.sourcePayloadHash).join("\n")),
    days,
    schemaVersion:"D08_TWSE_DAILY_VALUATION_YEAR_PACK_V0_1",
  };
  const packPayloadHash=sha(canonical);
  return deepFreeze({...canonical,packPayloadHash});
}

export function validateD08ValuationYearPackV0_1(pack){
  if(!pack||pack.schemaVersion!=="D08_TWSE_DAILY_VALUATION_YEAR_PACK_V0_1") throw new Error("invalid D08 year pack");
  const rebuilt=buildD08ValuationYearPackV0_1({
    year:pack.year,fromDate:pack.fromDate,toDate:pack.toDate,
    calendarSource:pack.calendarSource,
    dayReceipts:pack.days.map(d=>({
      marketDate:d.marketDate,state:"READY",sourceDateEvidence:d.marketDate,
      sourceId:d.sourceId,sourcePayloadHash:d.sourcePayloadHash,
      sourcePayloadBytes:d.sourcePayloadBytes,fieldFingerprint:d.fieldFingerprint,
      sourceSchemaProfile:d.sourceSchemaProfile,
      closeFieldProvided:d.closeFieldProvided,
      fiscalReportPeriodFieldProvided:d.fiscalReportPeriodFieldProvided,
      rows:d.rows.map(r=>({...r,marketDate:d.marketDate,market:"TWSE"})),
      schemaVersion:"S2_OFFICIAL_HISTORICAL_A6_VALUATION_DATE_V0_1",
    })),
  });
  if(rebuilt.packPayloadHash!==pack.packPayloadHash) throw new Error("D08 year pack hash mismatch");
  return true;
}
