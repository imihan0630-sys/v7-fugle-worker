// Research-only offline diagnostic for persisted Shadow rows.
// No formal selection/trading/runtime dependency. No return-conditioned outputs.

function asText(v) {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function readIndustry(row) {
  const s = row?.snapshot;
  if (s && typeof s === "object") return asText(s?.sector?.name);
  const raw = row?.snapshot_json;
  if (typeof raw !== "string" || !raw.trim()) return null;
  try { return asText(JSON.parse(raw)?.sector?.name); } catch { return null; }
}

export function diagnoseBroadControlConcentration(rows = []) {
  const controls = rows.filter(r => r?.cohort === "BROAD_CONTROL" && asText(r?.scan_date) && asText(r?.symbol));
  const byDate = new Map();
  for (const row of controls) {
    const d = asText(row.scan_date);
    if (!byDate.has(d)) byDate.set(d, []);
    byDate.get(d).push(row);
  }

  const dates = [...byDate.keys()].sort();
  const crossDateAppearances = new Map();
  const perDate = dates.map(scanDate => {
    const observed = byDate.get(scanDate);
    const groups = new Map();
    for (const row of observed) {
      const sym = asText(row.symbol);
      if (!groups.has(sym)) groups.set(sym, []);
      groups.get(sym).push(row);
    }
    const duplicateSymbols = [...groups.entries()].filter(([, rs]) => rs.length > 1).map(([symbol, rs]) => ({symbol, rows: rs.length}));
    const duplicateSet = new Set(duplicateSymbols.map(x => x.symbol));
    // Duplicate scan_date+symbol keys are data-quality anomalies. Exclude the ambiguous
    // key from concentration denominators instead of silently double-counting it or
    // arbitrarily choosing one duplicate row.
    const analyzable = observed.filter(r => !duplicateSet.has(asText(r.symbol)));
    for (const sym of groups.keys()) crossDateAppearances.set(sym, (crossDateAppearances.get(sym) || 0) + 1);

    const industries = analyzable.map(readIndustry);
    const knownIndustries = industries.filter(Boolean);
    const industryCounts = new Map();
    for (const x of knownIndustries) industryCounts.set(x, (industryCounts.get(x) || 0) + 1);
    const largestIndustryCount = industryCounts.size ? Math.max(...industryCounts.values()) : null;
    const cross = {};
    for (const r of analyzable) {
      const pool = asText(r.pool) || "UNKNOWN";
      const industry = readIndustry(r) || "UNKNOWN";
      cross[pool] ||= {};
      cross[pool][industry] = (cross[pool][industry] || 0) + 1;
    }
    return {
      scanDate,
      observedRows: observed.length,
      uniqueSymbolKeys: groups.size,
      duplicateRowsBeyondFirst: observed.length - groups.size,
      duplicateSymbols,
      dataQualityWarning: duplicateSymbols.length ? "DUPLICATE_SCAN_DATE_SYMBOL" : null,
      effectiveControls: analyzable.length,
      industryKnown: knownIndustries.length,
      industryUnknown: analyzable.length - knownIndustries.length,
      industryNonNullCoverage: analyzable.length ? knownIndustries.length / analyzable.length : null,
      largestIndustryShareOfKnown: knownIndustries.length && largestIndustryCount != null ? largestIndustryCount / knownIndustries.length : null,
      poolXIndustry: cross,
      venueCoverage: "UNKNOWN"
    };
  });

  const repeatSymbols = [...crossDateAppearances.entries()].filter(([, n]) => n > 1).sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0]));
  return {
    diagnostic: "BROAD_CONTROL_CONCENTRATION_READINESS",
    unit: "INDEPENDENT_SCAN_DATE",
    totalObservedRows: controls.length,
    independentScanDates: dates.length,
    distinctSymbolsAcrossDates: crossDateAppearances.size,
    repeatedSymbolsAcrossDates: repeatSymbols.map(([symbol, appearances]) => ({symbol, appearances})),
    maxAppearances: crossDateAppearances.size ? Math.max(...crossDateAppearances.values()) : 0,
    datesWithDuplicateKeys: perDate.filter(x => x.duplicateSymbols.length).map(x => x.scanDate),
    eligibleDenominator: "UNKNOWN",
    venueCoverage: "UNKNOWN",
    perDate
  };
}
