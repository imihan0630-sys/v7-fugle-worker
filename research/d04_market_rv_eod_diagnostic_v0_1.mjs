import { deepFreeze } from "../system2/runtime/factor_snapshot.mjs";
import { sha256Hex } from "../system2/runtime/decision_archive.mjs";
import { buildMarketRvBundleV0_1, MARKET_RV_FACTOR_IDS } from "../system2/runtime/market_rv_builder_v0_1.mjs";

export const D04_EOD_DIAGNOSTIC_VERSION = "D04_A2_EOD_PROSPECTIVE_DIAGNOSTIC_V0_1";
export const D04_EOD_SCHEDULE_TAIPEI = "19:15";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}
function validDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
function normalizeOfficialDate(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 7) {
    return String(Number(digits.slice(0,3)) + 1911) + "-" + digits.slice(3,5) + "-" + digits.slice(5,7);
  }
  if (digits.length === 8) {
    return digits.slice(0,4) + "-" + digits.slice(4,6) + "-" + digits.slice(6,8);
  }
  return null;
}
function numericPrice(value) {
  const raw = String(value ?? "").replaceAll(",", "").trim();
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}
function taipeiDate(iso) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return null;
  return new Date(t + 8 * 3600_000).toISOString().slice(0,10);
}
function monthAnchor(year, month) {
  return String(year) + String(month).padStart(2,"0") + "01";
}
function priorMonth(anchor) {
  const y=Number(anchor.slice(0,4)),m=Number(anchor.slice(4,6));
  const d=new Date(Date.UTC(y,m-2,1));
  return monthAnchor(d.getUTCFullYear(),d.getUTCMonth()+1);
}
export function requiredMonthAnchorsV0_1(marketDate, maximumMonths = 3) {
  if (!validDate(marketDate)) throw new Error("marketDate must be YYYY-MM-DD");
  if (!Number.isInteger(maximumMonths) || maximumMonths < 1 || maximumMonths > 6) {
    throw new Error("maximumMonths must be 1..6");
  }
  const first = marketDate.slice(0,7).replaceAll("-","") + "01";
  const out=[first];
  while(out.length<maximumMonths) out.push(priorMonth(out.at(-1)));
  return Object.freeze(out);
}
export function fmtqikJsonUrlV0_1(anchor) {
  if (!/^\d{8}$/.test(String(anchor||""))) throw new Error("anchor must be YYYYMMDD");
  return "https://www.twse.com.tw/exchangeReport/FMTQIK?response=json&date=" + anchor;
}
export function parseFmtqikClosePayloadV0_1(payload, anchor) {
  const expected=requiredText(anchor,"anchor");
  const fields=Array.isArray(payload?.fields)?payload.fields.map(String):[];
  const dateIndex=fields.indexOf("日期");
  const closeIndex=fields.indexOf("發行量加權股價指數");
  const payloadAnchor=String(payload?.date||"").replace(/\D/g,"");
  if(String(payload?.stat||"").toUpperCase()!=="OK" || payloadAnchor!==expected
    || dateIndex<0 || closeIndex<0 || !Array.isArray(payload?.data)) {
    throw new Error("FMTQIK payload contract invalid for " + expected);
  }
  const prefix=expected.slice(0,4)+"-"+expected.slice(4,6)+"-";
  const rows=payload.data.map((row,index)=>{
    if(!Array.isArray(row)) throw new Error("FMTQIK row invalid at " + index);
    const date=normalizeOfficialDate(row[dateIndex]);
    const close=numericPrice(row[closeIndex]);
    if(!date || !date.startsWith(prefix) || close===null) {
      throw new Error("FMTQIK date/TAIEX close invalid at " + index);
    }
    return {date,close};
  });
  rows.sort((a,b)=>a.date.localeCompare(b.date));
  if(new Set(rows.map(x=>x.date)).size!==rows.length) throw new Error("FMTQIK duplicate trading date");
  return deepFreeze({anchor:expected,rows:Object.freeze(rows)});
}
function unknownObservation(factorId, marketDate, timestamp, reason) {
  return deepFreeze({
    factorId,
    factorVersion:D04_EOD_DIAGNOSTIC_VERSION,
    scope:"MARKET",
    scopeKey:"TAIEX",
    marketDate,
    decisionTimestamp:timestamp,
    state:"UNKNOWN",
    rawValue:null,
    normalizedValue:null,
    confidence:null,
    unknownReason:reason,
    qualityFlags:Object.freeze([reason]),
    provenance:deepFreeze({
      sourceId:"TWSE_FMTQIK_EOD_DIAGNOSTIC",
      pointInTimeEligible:false,
    }),
  });
}
export async function buildD04EodDiagnosticV0_1({
  marketDate,
  observedAt,
  payloadReceipts = [],
} = {}) {
  if (!validDate(marketDate)) throw new Error("marketDate must be YYYY-MM-DD");
  const seen=requiredText(observedAt,"observedAt");
  if(!Number.isFinite(Date.parse(seen))) throw new Error("observedAt must be timestamp");
  const reasons=[];
  if(taipeiDate(seen)!==marketDate) reasons.push("OBSERVED_ON_DIFFERENT_TAIPEI_DATE");
  if(!Array.isArray(payloadReceipts) || payloadReceipts.length===0) reasons.push("NO_MONTHLY_PAYLOAD_RECEIPTS");
  const rows=[];
  const provenance=[];
  for(const item of payloadReceipts||[]){
    if(!item || typeof item!=="object") { reasons.push("INVALID_MONTHLY_RECEIPT"); continue; }
    const anchor=String(item.anchor||"");
    const fetchedAt=String(item.fetchedAt||"");
    if(!/^\d{8}$/.test(anchor) || !Number.isFinite(Date.parse(fetchedAt))) {
      reasons.push("INVALID_MONTHLY_RECEIPT");
      continue;
    }
    if(Date.parse(fetchedAt)>Date.parse(seen)) reasons.push("MONTHLY_RECEIPT_AFTER_OBSERVED_AT");
    if(taipeiDate(fetchedAt)!==marketDate) reasons.push("MONTHLY_RECEIPT_NOT_SAME_TAIPEI_DATE");
    if(!/^[a-f0-9]{64}$/.test(String(item.rawPayloadHash||""))) reasons.push("RAW_PAYLOAD_HASH_MISSING");
    try {
      const parsed=parseFmtqikClosePayloadV0_1(item.payload,anchor);
      rows.push(...parsed.rows);
      provenance.push({
        anchor,
        url:item.url||fmtqikJsonUrlV0_1(anchor),
        fetchedAt,
        rawPayloadHash:item.rawPayloadHash||null,
      });
    } catch {
      reasons.push("MONTHLY_PAYLOAD_CONTRACT_INVALID");
    }
  }
  rows.sort((a,b)=>a.date.localeCompare(b.date));
  const uniqueRows=[];
  const seenDates=new Set();
  for(const row of rows){
    if(seenDates.has(row.date)) reasons.push("DUPLICATE_SESSION_ACROSS_MONTH_PAYLOADS");
    else {seenDates.add(row.date);uniqueRows.push(row);}
  }
  const through=uniqueRows.filter(x=>x.date<=marketDate);
  if(through.at(-1)?.date!==marketDate) reasons.push("TARGET_MARKET_DATE_NOT_IN_CURRENT_SOURCE");
  if(through.length<21) reasons.push("INSUFFICIENT_21_OFFICIAL_SESSIONS");
  const last21=through.slice(-21);
  const historyWindowHash=await sha256Hex(last21);
  const aggregateReceiptHash=await sha256Hex({
    version:D04_EOD_DIAGNOSTIC_VERSION,
    marketDate,
    observedAt:seen,
    provenance,
    historyWindowHash,
  });
  const uniqueReasons=Object.freeze([...new Set(reasons)].sort());
  let diagnosticFactorObservations=Object.freeze([]);
  let metrics=null;
  let builderBundleHash=null;
  if(uniqueReasons.length===0){
    const bundle=await buildMarketRvBundleV0_1({
      bundleId:"D04-EOD-"+marketDate+"-"+aggregateReceiptHash.slice(0,12),
      marketDate,
      decisionTimestamp:seen,
      observedAt:seen,
      availableAt:seen,
      capturedAt:seen,
      sourceDate:marketDate,
      sourceReceiptRef:"D04_EOD_DIAG|"+aggregateReceiptHash,
      sourceReceiptState:"READY",
      sourcePointInTimeEligible:true,
      sourceId:"TWSE_FMTQIK_EOD_DIAGNOSTIC",
      sourceName:"TWSE official FMTQIK current-source diagnostic",
      history:last21,
    });
    diagnosticFactorObservations=bundle.factorObservations;
    metrics=bundle.metrics;
    builderBundleHash=bundle.bundleHash;
  }
  const releaseReason=uniqueReasons.length
    ? uniqueReasons.join("|")
    : "NOT_STRATEGY_DECISION_CLOCK_OR_PROMOTION_GRADE";
  const factorObservations=Object.freeze(MARKET_RV_FACTOR_IDS.map(
    id=>unknownObservation(id,marketDate,seen,releaseReason)
  ));
  const base={
    version:D04_EOD_DIAGNOSTIC_VERSION,
    marketDate,
    scheduledBoundaryTaipei:D04_EOD_SCHEDULE_TAIPEI,
    actualObservedAt:seen,
    state:uniqueReasons.length?"NOT_READY":"SAME_DAY_EOD_DIAGNOSTIC_READY",
    blockerCodes:uniqueReasons,
    sourceReceipts:Object.freeze(provenance),
    historyWindow:Object.freeze(last21),
    historyWindowHash,
    aggregateReceiptHash,
    metrics,
    diagnosticFactorObservations,
    factorObservations,
    builderBundleHash,
    evidenceClass:"SAME_DAY_EOD_PROSPECTIVE_DIAGNOSTIC_ONLY",
    strategyDecisionClockAuthority:false,
    promotionGradeProspectiveDateCount:0,
    persistenceToSystem2D1:false,
    runFingerprintLinkage:false,
    formalDecisionImpact:false,
  };
  return deepFreeze({...base,diagnosticHash:await sha256Hex(base)});
}

export async function runD04EodDiagnosticV0_1({
  marketDate,
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
  maximumMonths = 3,
} = {}) {
  if(typeof fetchImpl!=="function") throw new Error("fetchImpl is required");
  const anchors=requiredMonthAnchorsV0_1(marketDate,maximumMonths);
  const receipts=[];
  for(const anchor of anchors){
    const url=fmtqikJsonUrlV0_1(anchor);
    const response=await fetchImpl(url,{
      method:"GET",
      headers:{accept:"application/json","user-agent":"D04-EOD-A2-Diagnostic/0.1"},
      redirect:"follow",
    });
    if(!response?.ok) {
      receipts.push({anchor,url,fetchedAt:now().toISOString(),rawPayloadHash:null,payload:null});
      continue;
    }
    const raw=await response.text();
    let payload=null;
    try{payload=JSON.parse(raw);}catch{}
    receipts.push({
      anchor,url,fetchedAt:now().toISOString(),
      rawPayloadHash:await sha256Hex(raw),
      payload,
      rawPayloadText:raw,
    });
  }
  const observedAt=now().toISOString();
  return buildD04EodDiagnosticV0_1({marketDate,observedAt,payloadReceipts:receipts});
}
