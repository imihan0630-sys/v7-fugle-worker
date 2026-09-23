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
  const appearances = new Map();
  for (const row of controls) {
    const d = asText(row.scan_date);
    if (!byDate.has(d)) byDate.set(d, []);
    byDate.get(d).push(row);
    const sym = asText(row.symbol);
    appearances.set(sym, (appearances.get(sym) || 0) + 1);
  }

  const dates = [...byDate.keys()].sort();
  const perDate = dates.map(scanDate => {
    const rs = byDate.get(scanDate);
    const symbols = rs.map(r => asText(r.symbol));
    const distinct = new Set(symbols);
    const industries = rs.map(readIndustry);
    const knownIndustries = industries.filter(Boolean);
    const industryCounts = new Map();
    for (const x of knownIndustries) industryCounts.set(x, (industryCounts.get(x) || 0) + 1);
    const largestIndustryCount = industryCounts.size ? Math.max(...industryCounts.values()) : null;
    const cross = {};
    for (const r of rs) {
      const pool = asText(r.pool) || "UNKNOWN";
      const industry = readIndustry(r) || "UNKNOWN";
      cross[pool] ||= {};
      cross[pool][industry] = (cross[pool][industry] || 0) + 1;
    }
    return {
      scanDate,
      effectiveControls: rs.length,
      distinctSymbols: distinct.size,
      repeatedRowsWithinDate: rs.length - distinct.size,
      industryKnown: knownIndustries.length,
      industryUnknown: rs.length - knownIndustries.length,
      industryNonNullCoverage: rs.length ? knownIndustries.length / rs.length : null,
      largestIndustryShareOfKnown: knownIndustries.length && largestIndustryCount != null ? largestIndustryCount / knownIndustries.length : null,
      poolXIndustry: cross,
      venueCoverage: "UNKNOWN"
    };
  });

  const repeatSymbols = [...appearances.entries()].filter(([, n]) => n > 1).sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0]));
  return {
    diagnostic: "BROAD_CONTROL_CONCENTRATION_READINESS",
    unit: "INDEPENDENT_SCAN_DATE",
    totalRows: controls.length,
    independentScanDates: dates.length,
    distinctSymbolsAcrossDates: appearances.size,
    repeatedSymbolsAcrossDates: repeatSymbols.map(([symbol, appearances]) => ({symbol, appearances})),
    maxAppearances: appearances.size ? Math.max(...appearances.values()) : 0,
    eligibleDenominator: "UNKNOWN",
    venueCoverage: "UNKNOWN",
    perDate
  };
}
