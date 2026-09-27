// Research-only parent-scope measurement helper.
// Zero market calls. Zero D1 writes.

export const TECHNICAL_PARENT_SCOPE_ID = "FORMAL_HISTORY_ADMITTED_FEATURE_ROWS_V0_1";

function symbolOf(row) {
  return String(row?.symbol ?? row?.Symbol ?? row?.code ?? "").trim();
}

function marketOf(row) {
  const raw=String(row?.market ?? row?.Market ?? "").trim().toUpperCase();
  if (raw === "TWSE") return "TWSE";
  if (raw === "TPEX" || raw === "OTC") return "TPEX";
  return "UNKNOWN";
}

function priceOf(row) {
  const n=Number(row?.close ?? row?.Close ?? row?.ClosingPrice);
  return Number.isFinite(n) ? n : null;
}

function setAudit(rows,label) {
  const seen=new Set();
  const duplicates=[];
  const symbolRows=[];
  for (const row of Array.isArray(rows)?rows:[]) {
    const symbol=symbolOf(row);
    if (!symbol) throw new Error("MISSING_SYMBOL:" + label);
    if (seen.has(symbol)) duplicates.push(symbol);
    else seen.add(symbol);
    symbolRows.push({symbol,row});
  }
  return {seen,duplicates:Array.from(new Set(duplicates)).sort(),symbolRows};
}

export function measureImmutableParentScope(normalizedTodayRows,featureRows) {
  const normalized=setAudit(normalizedTodayRows,"NORMALIZED");
  const parents=setAudit(featureRows,"FEATURE");

  const parentOutsideNormalized=[...parents.seen].filter(s=>!normalized.seen.has(s)).sort();
  const normalizedNotInFeature=[...normalized.seen].filter(s=>!parents.seen.has(s)).sort();

  const marketCounts={TWSE:0,TPEX:0,UNKNOWN:0};
  const poolCounts={GENERAL:0,THOUSAND:0,UNKNOWN:0};
  for (const {row} of parents.symbolRows) {
    marketCounts[marketOf(row)]+=1;
    const close=priceOf(row);
    if (close===null) poolCounts.UNKNOWN+=1;
    else if (close>=1000) poolCounts.THOUSAND+=1;
    else poolCounts.GENERAL+=1;
  }

  const qaFailures=[];
  if (normalized.duplicates.length) qaFailures.push("DUPLICATE_NORMALIZED_SYMBOL");
  if (parents.duplicates.length) qaFailures.push("DUPLICATE_PARENT_SYMBOL");
  if (parentOutsideNormalized.length) qaFailures.push("PARENT_OUTSIDE_NORMALIZED_SET");

  const normalizedTodayCount=normalized.seen.size;
  const parentCount=parents.seen.size;

  return Object.freeze({
    parentScopeId:TECHNICAL_PARENT_SCOPE_ID,
    status:qaFailures.length ? "SCOPE_QA_FAIL" : "VALID",
    normalizedTodayCount,
    parentCount,
    preParentNotInFeatureCount:normalizedNotInFeature.length,
    parentCoverageRatio:normalizedTodayCount>0 ? parentCount/normalizedTodayCount : null,
    normalizedDuplicateSymbols:normalized.duplicates,
    parentDuplicateSymbols:parents.duplicates,
    parentOutsideNormalizedSymbols:parentOutsideNormalized,
    normalizedNotInFeatureSymbols:normalizedNotInFeature,
    marketCounts:Object.freeze(marketCounts),
    poolCounts:Object.freeze(poolCounts),
    qaFailures:Object.freeze(qaFailures),
    researchOnly:true,
    decisionImpact:false,
  });
}
