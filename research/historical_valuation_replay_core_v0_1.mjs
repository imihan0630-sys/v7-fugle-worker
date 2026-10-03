// D08-03 research-only historical valuation replay core v0.1.
// Pure functions only: zero network calls, zero persistence, zero Formal Core impact.

export const HISTORICAL_VALUATION_REPLAY_VERSION = "HISTORICAL_VALUATION_REPLAY_V0_1";

const REQUIRED_TWSE_HEADERS = [
  "證券代號",
  "證券名稱",
  "收盤價",
  "本益比",
  "股價淨值比",
  "財報年/季",
];

function finiteNumber(value) {
  if (value === null || value === undefined) return null;
  const raw = String(value).trim();
  if (!raw || raw === "-" || raw.toUpperCase() === "N/A" || raw === "--") return null;
  const n = Number(raw.replaceAll(",", ""));
  return Number.isFinite(n) ? n : null;
}

function isoDateFromYmd(value) {
  const raw = String(value ?? "").replaceAll("-", "").replaceAll("/", "");
  if (!/^\d{8}$/.test(raw)) return null;
  return raw.slice(0,4)+"-"+raw.slice(4,6)+"-"+raw.slice(6,8);
}

export function parseTwseBwibbuDaily(payload) {
  if (!payload || payload.stat !== "OK") {
    return { ok:false, state:"SOURCE_NOT_OK", rows:[], decisionImpact:false };
  }
  if (!Array.isArray(payload.fields) || !Array.isArray(payload.data)) {
    return { ok:false, state:"SCHEMA_INVALID", rows:[], decisionImpact:false };
  }
  const missing = REQUIRED_TWSE_HEADERS.filter(x => !payload.fields.includes(x));
  if (missing.length) {
    return { ok:false, state:"SCHEMA_DRIFT", missingHeaders:missing, rows:[], decisionImpact:false };
  }
  const index = Object.fromEntries(payload.fields.map((x,i)=>[x,i]));
  const tradeDate = isoDateFromYmd(payload.date);
  if (!tradeDate) {
    return { ok:false, state:"DATE_INVALID", rows:[], decisionImpact:false };
  }

  const rows = [];
  const seen = new Set();
  for (const rawRow of payload.data) {
    if (!Array.isArray(rawRow)) continue;
    const symbol = String(rawRow[index["證券代號"]] ?? "").trim();
    if (!/^\d{4,6}$/.test(symbol)) continue;
    if (seen.has(symbol)) {
      return { ok:false, state:"DUPLICATE_SYMBOL", symbol, rows:[], decisionImpact:false };
    }
    seen.add(symbol);

    const peRaw = rawRow[index["本益比"]];
    const pbRaw = rawRow[index["股價淨值比"]];
    const pe = finiteNumber(peRaw);
    const pb = finiteNumber(pbRaw);
    rows.push({
      market:"TWSE",
      tradeDate,
      symbol,
      companyName:String(rawRow[index["證券名稱"]] ?? "").trim(),
      close:finiteNumber(rawRow[index["收盤價"]]),
      pe,
      pb,
      peState: pe === null ? "SOURCE_NA_OR_UNKNOWN" : "KNOWN",
      pbState: pb === null ? "SOURCE_NA_OR_UNKNOWN" : "KNOWN",
      fiscalReportPeriod:String(rawRow[index["財報年/季"]] ?? "").trim() || null,
      sourceDataset:"TWSE_BWIBBU_D",
      formulaVersion:HISTORICAL_VALUATION_REPLAY_VERSION,
      decisionImpact:false,
    });
  }
  return {
    ok:true,
    state:"VALID",
    tradeDate,
    fieldFingerprint:payload.fields.join("|"),
    rowCount:rows.length,
    rows,
    decisionImpact:false,
  };
}

export function markFiscalDenominatorTransitions(rows) {
  const sorted=[...rows].sort((a,b)=>String(a.tradeDate).localeCompare(String(b.tradeDate)));
  let previous=null;
  return sorted.map(row=>{
    const changed = previous !== null
      && row.fiscalReportPeriod !== null
      && previous !== row.fiscalReportPeriod;
    const out={...row,fiscalDenominatorChangedToday:changed,priorFiscalReportPeriod:changed?previous:null};
    if (row.fiscalReportPeriod !== null) previous=row.fiscalReportPeriod;
    return out;
  });
}

export function averageRankPercentile(values,currentValue,{minValid=1}={}) {
  const clean=values.map(finiteNumber).filter(Number.isFinite);
  const current=finiteNumber(currentValue);
  if (current === null) return {state:"UNKNOWN",reason:"CURRENT_VALUE_UNAVAILABLE",percentile:null,validObservationCount:clean.length};
  if (clean.length < minValid) return {state:"UNKNOWN",reason:"INSUFFICIENT_VALID_HISTORY",percentile:null,validObservationCount:clean.length};
  if (clean.length === 1) return {state:"KNOWN",reason:null,percentile:0.5,validObservationCount:1};

  const less=clean.filter(x=>x<current).length;
  const equal=clean.filter(x=>x===current).length;
  if (equal===0) {
    return {state:"UNKNOWN",reason:"CURRENT_NOT_IN_REFERENCE_SAMPLE",percentile:null,validObservationCount:clean.length};
  }
  const percentile=(less + 0.5*(equal-1))/(clean.length-1);
  return {state:"KNOWN",reason:null,percentile,validObservationCount:clean.length};
}

export function buildHistoricalPercentile(rows,{metric="pe",windowValid=252}={}) {
  if (!["pe","pb"].includes(metric)) throw new Error("metric must be pe or pb");
  const sorted=[...rows].sort((a,b)=>String(a.tradeDate).localeCompare(String(b.tradeDate)));
  const out=[];
  const valid=[];
  for (const row of sorted) {
    const v=finiteNumber(row[metric]);
    if (v !== null) valid.push(v);
    const ref=valid.slice(-windowValid);
    const result=averageRankPercentile(ref,v,{minValid:windowValid});
    out.push({
      tradeDate:row.tradeDate,
      symbol:row.symbol,
      metric,
      value:v,
      ...result,
      decisionImpact:false,
    });
  }
  return out;
}
