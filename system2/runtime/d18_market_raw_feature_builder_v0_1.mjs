import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const D18_MARKET_RAW_FEATURE_VERSION = "0.1";
const MARKET_MINIMUMS = deepFreeze({ TWSE: 600, TPEX: 450 });

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}
function finite(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
function median(values) {
  const xs = values.filter(Number.isFinite).sort((a,b)=>a-b);
  if (!xs.length) return null;
  const m=Math.floor(xs.length/2);
  return xs.length%2 ? xs[m] : (xs[m-1]+xs[m])/2;
}
function quantileDispersion(values) {
  const xs=values.filter(Number.isFinite).sort((a,b)=>a-b);
  if (xs.length < 4) return null;
  const q=(p)=>{
    const i=(xs.length-1)*p, lo=Math.floor(i), hi=Math.ceil(i);
    return lo===hi ? xs[lo] : xs[lo]+(xs[hi]-xs[lo])*(i-lo);
  };
  return q(0.75)-q(0.25);
}
function normalizeRow(row, market) {
  const symbol=String(row?.symbol ?? row?.Code ?? row?.SecuritiesCompanyCode ?? "").trim();
  if(!/^[1-9][0-9]{3}$/.test(symbol)) return null;
  const direction=String(row?.direction ?? "").toUpperCase();
  const ret=finite(row?.changePercent ?? row?.returnPct ?? row?.dailyReturnPct);
  let dir=direction;
  if(!["UP","DOWN","FLAT"].includes(dir) && ret!==null) dir=ret>0?"UP":ret<0?"DOWN":"FLAT";
  const tradeValue=finite(row?.tradeValue ?? row?.TradeValue ?? row?.TransactionAmount);
  return {symbol,market,direction:["UP","DOWN","FLAT"].includes(dir)?dir:"UNKNOWN",returnPct:ret,tradeValue};
}
function marketCoverage(rows, market) {
  const parsed=(rows||[]).map(r=>normalizeRow(r,market)).filter(Boolean);
  const unique=new Map();
  let duplicates=0;
  for(const row of parsed){if(unique.has(row.symbol)) duplicates++; unique.set(row.symbol,row);}
  const out=[...unique.values()];
  return {market,count:out.length,minimum:MARKET_MINIMUMS[market],duplicates,pass:out.length>=MARKET_MINIMUMS[market]&&duplicates===0,rows:out};
}

export async function buildD18MarketRawFeatureReceipt({
  receiptId, marketDate, decisionTimestamp, sourceSessionHash, universeVersion,
  twseRows=[], tpexRows=[], capturedAt,
}={}) {
  const ts=requiredText(decisionTimestamp,"decisionTimestamp");
  const cap=requiredText(capturedAt,"capturedAt");
  if(!Number.isFinite(Date.parse(ts))||!Number.isFinite(Date.parse(cap))) throw new Error("timestamps must be ISO");
  const twse=marketCoverage(twseRows,"TWSE"), tpex=marketCoverage(tpexRows,"TPEX");
  const coveragePass=twse.pass&&tpex.pass;
  const rows=[...twse.rows,...tpex.rows];
  const knownDirection=rows.filter(r=>r.direction!=="UNKNOWN");
  const returns=rows.map(r=>r.returnPct).filter(Number.isFinite);
  const values=rows.map(r=>r.tradeValue).filter(Number.isFinite);
  const up=knownDirection.filter(r=>r.direction==="UP").length;
  const down=knownDirection.filter(r=>r.direction==="DOWN").length;
  const flat=knownDirection.filter(r=>r.direction==="FLAT").length;
  const sortedValue=[...values].sort((a,b)=>b-a);
  const totalTradeValue=values.length?values.reduce((a,b)=>a+b,0):null;
  const share=(n)=>totalTradeValue>0?sortedValue.slice(0,n).reduce((a,b)=>a+b,0)/totalTradeValue:null;
  const state=coveragePass?"KNOWN":"UNKNOWN";
  const raw=coveragePass?{
    advanceCount:up,declineCount:down,flatCount:flat,
    advanceShare:knownDirection.length?up/knownDirection.length:null,
    medianReturnPct:median(returns),
    totalTradeValue,
    medianTradeValue:median(values),
    top10TradeValueShare:share(10),
    top20TradeValueShare:share(20),
    returnIqrPct:quantileDispersion(returns),
  }:null;
  const unknownReasons=[];
  if(!twse.pass) unknownReasons.push(`TWSE_COVERAGE_OR_DUPLICATE_FAILURE:${twse.count}/${twse.minimum}:dup=${twse.duplicates}`);
  if(!tpex.pass) unknownReasons.push(`TPEX_COVERAGE_OR_DUPLICATE_FAILURE:${tpex.count}/${tpex.minimum}:dup=${tpex.duplicates}`);
  const base={
    receiptId:requiredText(receiptId,"receiptId"), featureVersion:D18_MARKET_RAW_FEATURE_VERSION,
    marketDate:requiredText(marketDate,"marketDate"), decisionTimestamp:ts,
    sourceSessionHash:requiredText(sourceSessionHash,"sourceSessionHash"),
    universeVersion:requiredText(universeVersion,"universeVersion"),
    state, rawFeatures:raw,
    coverage:{twse:{count:twse.count,minimum:twse.minimum,pass:twse.pass,duplicates:twse.duplicates},tpex:{count:tpex.count,minimum:tpex.minimum,pass:tpex.pass,duplicates:tpex.duplicates},combinedCount:rows.length},
    unknownReasons:Object.freeze(unknownReasons),
    historyDependentFeatures:{aboveMa20Pct:"UNKNOWN_NOT_IN_V0_1",positive5dPct:"UNKNOWN_NOT_IN_V0_1",totalTradeValueVs20D:"UNKNOWN_NOT_IN_V0_1"},
    labelsAssigned:false, policyImpact:false, capturedAt:cap,
    schemaVersion:"D18_MARKET_RAW_FEATURE_RECEIPT_V0_1"
  };
  const featureSnapshotHash=await sha256Hex(base);
  return deepFreeze({...base,featureSnapshotHash});
}
export { MARKET_MINIMUMS };
