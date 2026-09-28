import { hashCanonicalReceipt } from "./canonical_receipt_hash_v0_1.mjs";

function text(value, field) {
  const s=String(value??"").trim();
  if (!s) throw new Error("MISSING_" + field);
  return s;
}

function normalizeMarket(value) {
  const s=String(value??"").trim().toUpperCase();
  if (s==="TWSE") return "TWSE";
  if (s==="TPEX" || s==="TPEX") return "TPEx";
  throw new Error("INVALID_MARKET:" + value);
}

function historyState(admission) {
  if (admission?.usable===true) return "ADMITTED";
  if (String(admission?.status||"")==="DATA_INCOMPLETE") return "BLOCKED";
  return "UNKNOWN";
}

export function buildScanPopulationEntries({
  normalizedRows,
  historyAdmissionBySymbol,
  featureReadySymbols,
}) {
  if (!Array.isArray(normalizedRows)) throw new Error("NORMALIZED_ROWS_REQUIRED");
  const ready=new Set(Array.from(featureReadySymbols||[]).map(String));
  const admissions=historyAdmissionBySymbol||{};
  const seen=new Set();
  const entries=[];
  const consistencyReasons=[];

  for (let i=0;i<normalizedRows.length;i+=1) {
    const row=normalizedRows[i]||{};
    const symbol=text(row.symbol,"symbol@" + i);
    if (seen.has(symbol)) throw new Error("DUPLICATE_NORMALIZED_SYMBOL:" + symbol);
    seen.add(symbol);

    const admission=admissions[symbol]||{
      usable:false,
      status:"UNKNOWN",
      reason:"HISTORY_ADMISSION_MISSING",
    };
    const hState=historyState(admission);
    const featureReady=ready.has(symbol);
    if (featureReady && hState!=="ADMITTED") {
      consistencyReasons.push("FEATURE_READY_WITHOUT_HISTORY_ADMISSION:" + symbol);
    }

    entries.push(Object.freeze({
      symbol,
      market:normalizeMarket(row.market),
      historyAdmissionState:hState,
      historyAdmissionStatus:String(admission.status||"UNKNOWN"),
      historyAdmissionReason:admission.reason ? String(admission.reason) : null,
      verifiedNoTradeGapCount:Array.isArray(admission.verifiedNoTradeDates)?admission.verifiedNoTradeDates.length:0,
      featureBuildState:hState!=="ADMITTED" ? "NOT_ATTEMPTED" : (featureReady ? "READY" : "BLOCKED"),
      parentExpected:hState==="ADMITTED" && featureReady,
    }));
  }

  for (const symbol of ready) {
    if (!seen.has(symbol)) consistencyReasons.push("FEATURE_READY_SYMBOL_NOT_IN_NORMALIZED_POPULATION:" + symbol);
  }

  entries.sort((a,b)=>a.symbol.localeCompare(b.symbol));
  return Object.freeze({
    entries:Object.freeze(entries),
    consistencyValid:consistencyReasons.length===0,
    consistencyReasons:Object.freeze(consistencyReasons),
  });
}

function symbolsBy(entries, predicate) {
  return entries.filter(predicate).map(row=>row.symbol).sort();
}

export async function buildScanPopulationReceipt({
  scanDate,
  captureGeneration,
  populationSchemaVersion,
  normalizationVersion,
  sourceConfigFingerprint,
  normalizedRows,
  historyAdmissionBySymbol,
  featureReadySymbols,
}, cryptoImpl=globalThis.crypto) {
  const identity={
    scanDate:text(scanDate,"scanDate"),
    captureGeneration:text(captureGeneration,"captureGeneration"),
    populationSchemaVersion:text(populationSchemaVersion,"populationSchemaVersion"),
    normalizationVersion:text(normalizationVersion,"normalizationVersion"),
    sourceConfigFingerprint:text(sourceConfigFingerprint,"sourceConfigFingerprint"),
  };

  const built=buildScanPopulationEntries({
    normalizedRows,
    historyAdmissionBySymbol,
    featureReadySymbols,
  });
  if (!built.consistencyValid) {
    return Object.freeze({
      valid:false,
      status:"POPULATION_CONSISTENCY_FAIL",
      reasons:built.consistencyReasons,
      entries:built.entries,
    });
  }

  const entries=built.entries;
  const normalizedSymbols=symbolsBy(entries,()=>true);
  const admitted=symbolsBy(entries,row=>row.historyAdmissionState==="ADMITTED");
  const blocked=symbolsBy(entries,row=>row.historyAdmissionState==="BLOCKED");
  const unknown=symbolsBy(entries,row=>row.historyAdmissionState==="UNKNOWN");
  const featureReady=symbolsBy(entries,row=>row.parentExpected);

  const reasonCounts={};
  const marketCounts={};
  for (const row of entries) {
    marketCounts[row.market]=(marketCounts[row.market]||0)+1;
    const key=row.historyAdmissionReason||"NONE";
    reasonCounts[key]=(reasonCounts[key]||0)+1;
  }

  const [
    scanPopulationReceiptId,
    normalizedMarketKeysetHash,
    historyAdmittedKeysetHash,
    historyBlockedKeysetHash,
    historyUnknownKeysetHash,
    featureReadyKeysetHash,
  ]=await Promise.all([
    hashCanonicalReceipt(identity,"SCAN_POPULATION_ID",cryptoImpl),
    hashCanonicalReceipt(normalizedSymbols,"NORMALIZED_MARKET_KEYSET",cryptoImpl),
    hashCanonicalReceipt(admitted,"HISTORY_ADMITTED_KEYSET",cryptoImpl),
    hashCanonicalReceipt(blocked,"HISTORY_BLOCKED_KEYSET",cryptoImpl),
    hashCanonicalReceipt(unknown,"HISTORY_UNKNOWN_KEYSET",cryptoImpl),
    hashCanonicalReceipt(featureReady,"FEATURE_READY_KEYSET",cryptoImpl),
  ]);

  return Object.freeze({
    valid:true,
    status:"READY",
    identity:Object.freeze(identity),
    scanPopulationReceiptId,
    normalizedCount:normalizedSymbols.length,
    historyAdmittedCount:admitted.length,
    historyBlockedCount:blocked.length,
    historyUnknownCount:unknown.length,
    featureReadyParentExpectedCount:featureReady.length,
    normalizedMarketKeysetHash,
    historyAdmittedKeysetHash,
    historyBlockedKeysetHash,
    historyUnknownKeysetHash,
    featureReadyKeysetHash,
    marketCounts:Object.freeze({...marketCounts}),
    historyReasonCounts:Object.freeze({...reasonCounts}),
    entries,
  });
}
