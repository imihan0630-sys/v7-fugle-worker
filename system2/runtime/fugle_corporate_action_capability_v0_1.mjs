import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const FUGLE_CA_CAPABILITY_VERSION = "0.1-RESEARCH";
export const FUGLE_CA_ORIGIN = "https://api.fugle.tw/marketdata/v1.0/stock";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}
function isoDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}
function ordinarySymbol(value) {
  return /^[1-9][0-9]{3}$/.test(String(value || "").trim());
}
function exchange(value) {
  const text = String(value || "").trim().toUpperCase();
  return ["TWSE","TPEX"].includes(text) ? text : null;
}
function finitePositive(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}
function rangeUrl(path, startDate, endDate) {
  const start=isoDate(startDate,"startDate"), end=isoDate(endDate,"endDate");
  if (end < start) throw new Error("endDate cannot be earlier than startDate");
  return `${FUGLE_CA_ORIGIN}${path}?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&sort=asc`;
}

export function buildFugleCorporateActionCapabilityUrlsV0_1({ startDate, endDate } = {}) {
  return deepFreeze({
    dividends: rangeUrl("/corporate-actions/dividends",startDate,endDate),
    capitalChanges: rangeUrl("/corporate-actions/capital-changes",startDate,endDate),
  });
}

async function fetchJson({ fetchImpl, apiKey, url }) {
  let response;
  try {
    response=await fetchImpl(url,{
      method:"GET",
      headers:{ "X-API-KEY":apiKey, accept:"application/json" },
      signal:AbortSignal.timeout(30000),
    });
  } catch (error) {
    return deepFreeze({
      ok:false,httpStatus:null,errorCode:error?.name==="TimeoutError"?"TIMEOUT":"NETWORK_ERROR",payload:null,
    });
  }
  const status=Number(response?.status);
  let payload=null;
  try { payload=await response.json(); } catch {}
  if (!response?.ok) {
    const errorCode=[401,403].includes(status) ? "PLAN_OR_AUTH_BLOCKED"
      : status===429 ? "RATE_LIMITED"
      : Number.isFinite(status) ? "HTTP_"+status : "HTTP_ERROR";
    return deepFreeze({ok:false,httpStatus:status,errorCode,payload:null});
  }
  if (!payload || typeof payload!=="object" || Array.isArray(payload)) {
    return deepFreeze({ok:false,httpStatus:status,errorCode:"INVALID_JSON_OBJECT",payload:null});
  }
  return deepFreeze({ok:true,httpStatus:status,errorCode:null,payload});
}

function validateDateWithin(date,start,end,field) {
  if (date===null || date===undefined || date==="") return null;
  const d=isoDate(date,field);
  if (d < start || d > end) return {date:d,inRange:false};
  return {date:d,inRange:true};
}

async function summarizeDividends(payload,start,end) {
  const data=Array.isArray(payload?.data)?payload.data:null;
  if (!data) throw new Error("dividends payload.data must be an array");
  const exchangeCounts={TWSE:0,TPEX:0,OTHER:0};
  let ordinaryEquityCount=0, requiredFieldReadyCount=0, priceReferenceReadyCount=0, outOfRangeCount=0;
  let minDate=null,maxDate=null;
  for (let i=0;i<data.length;i+=1) {
    const row=data[i]||{};
    const date=validateDateWithin(row.date,start,end,"dividends.data["+i+"].date");
    if (date && !date.inRange) outOfRangeCount+=1;
    if (date?.date) {
      minDate=!minDate||date.date<minDate?date.date:minDate;
      maxDate=!maxDate||date.date>maxDate?date.date:maxDate;
    }
    const ex=exchange(row.exchange);
    if (ex) exchangeCounts[ex]+=1; else exchangeCounts.OTHER+=1;
    if (ordinarySymbol(row.symbol) && ex) ordinaryEquityCount+=1;
    if (date?.date && ex && String(row.symbol||"").trim()) requiredFieldReadyCount+=1;
    if (finitePositive(row.previousClose) && finitePositive(row.referencePrice)) priceReferenceReadyCount+=1;
  }
  if (outOfRangeCount > 0) throw new Error("DIVIDENDS_DATE_RANGE_VIOLATION");
  const payloadHash=await sha256Hex(payload);
  return deepFreeze({
    rowCount:data.length,ordinaryEquityCount,requiredFieldReadyCount,priceReferenceReadyCount,
    outOfRangeCount,firstDate:minDate,lastDate:maxDate,exchangeCounts,payloadHash,
    futureEffectiveRowsAllowedBySourceContract:true,
    technicalPriceFactorCertified:false,
  });
}

async function summarizeCapitalChanges(payload,start,end) {
  const data=Array.isArray(payload?.data)?payload.data:null;
  if (!data) throw new Error("capitalChanges payload.data must be an array");
  const exchangeCounts={TWSE:0,TPEX:0,OTHER:0};
  const actionTypeCounts={};
  let ordinaryEquityCount=0, requiredFieldReadyCount=0, priceReferenceReadyCount=0, outOfRangeResumeCount=0;
  let minResume=null,maxResume=null;
  for (let i=0;i<data.length;i+=1) {
    const row=data[i]||{};
    const resume=validateDateWithin(row.resumeDate,start,end,"capitalChanges.data["+i+"].resumeDate");
    if (resume && !resume.inRange) outOfRangeResumeCount+=1;
    if (resume?.date) {
      minResume=!minResume||resume.date<minResume?resume.date:minResume;
      maxResume=!maxResume||resume.date>maxResume?resume.date:maxResume;
    }
    const ex=exchange(row.exchange);
    if (ex) exchangeCounts[ex]+=1; else exchangeCounts.OTHER+=1;
    if (ordinarySymbol(row.symbol) && ex) ordinaryEquityCount+=1;
    const type=String(row.actionType||"UNKNOWN").trim()||"UNKNOWN";
    actionTypeCounts[type]=(actionTypeCounts[type]||0)+1;
    if (String(row.symbol||"").trim() && ex && type!=="UNKNOWN" && row.haltDate && row.resumeDate) {
      requiredFieldReadyCount+=1;
    }
    if (finitePositive(row.raw?.previousClose) && finitePositive(row.raw?.referencePrice)) {
      priceReferenceReadyCount+=1;
    }
  }
  const payloadHash=await sha256Hex(payload);
  return deepFreeze({
    rowCount:data.length,ordinaryEquityCount,requiredFieldReadyCount,priceReferenceReadyCount,
    outOfRangeResumeCount,firstResumeDate:minResume,lastResumeDate:maxResume,
    exchangeCounts,actionTypeCounts:deepFreeze(actionTypeCounts),payloadHash,
    futureEffectiveRowsAllowedBySourceContract:true,
    technicalPriceFactorCertified:false,
  });
}

export async function probeFugleCorporateActionCapabilityV0_1({
  apiKey,
  startDate,
  endDate,
  observedAt=new Date().toISOString(),
  fetchImpl=globalThis.fetch,
} = {}) {
  const key=requiredText(apiKey,"apiKey");
  const start=isoDate(startDate,"startDate"), end=isoDate(endDate,"endDate");
  if (end < start) throw new Error("endDate cannot be earlier than startDate");
  if (!Number.isFinite(Date.parse(observedAt))) throw new Error("observedAt must be ISO");
  if (typeof fetchImpl!=="function") throw new Error("fetchImpl is required");
  const urls=buildFugleCorporateActionCapabilityUrlsV0_1({startDate:start,endDate:end});
  const [dividendsTransport,capitalChangesTransport]=await Promise.all([
    fetchJson({fetchImpl,apiKey:key,url:urls.dividends}),
    fetchJson({fetchImpl,apiKey:key,url:urls.capitalChanges}),
  ]);
  let dividends=null,capitalChanges=null;
  if (dividendsTransport.ok) dividends=await summarizeDividends(dividendsTransport.payload,start,end);
  if (capitalChangesTransport.ok) capitalChanges=await summarizeCapitalChanges(capitalChangesTransport.payload,start,end);
  const bothReady=Boolean(dividendsTransport.ok && capitalChangesTransport.ok);
  const state=bothReady ? "SOURCE_CAPABILITY_READY"
    : [dividendsTransport.errorCode,capitalChangesTransport.errorCode].includes("PLAN_OR_AUTH_BLOCKED")
      ? "SOURCE_CAPABILITY_PLAN_OR_AUTH_BLOCKED"
      : "SOURCE_CAPABILITY_INCOMPLETE";
  return deepFreeze({
    schemaVersion:"SYSTEM2_FUGLE_CORPORATE_ACTION_CAPABILITY_V0_1",
    version:FUGLE_CA_CAPABILITY_VERSION,
    state,startDate:start,endDate:end,observedAt,
    transports:deepFreeze({
      dividends:deepFreeze({
        ok:dividendsTransport.ok,httpStatus:dividendsTransport.httpStatus,errorCode:dividendsTransport.errorCode,
      }),
      capitalChanges:deepFreeze({
        ok:capitalChangesTransport.ok,httpStatus:capitalChangesTransport.httpStatus,errorCode:capitalChangesTransport.errorCode,
      }),
    }),
    dividends,capitalChanges,
    sourceFamiliesObserved:deepFreeze([
      ...(dividendsTransport.ok?["FUGLE_DIVIDENDS"]:[]),
      ...(capitalChangesTransport.ok?["FUGLE_CAPITAL_CHANGES"]:[]),
    ]),
    sourceCoverageComplete:false,
    noEventMayBeClaimed:false,
    symbolSessionCompletenessCertified:false,
    technicalContinuityCertified:false,
    continuityTransformPerformed:false,
    historyMutationPerformed:false,
    strategyEvaluationPerformed:false,
    capacityRunProduced:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}
