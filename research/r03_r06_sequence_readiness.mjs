// Research-only offline helper. No runtime wiring.
const isoDate = v => /^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? String(v) : null;
const finite = v => typeof v === 'number' && Number.isFinite(v);

function parseMarketJson(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return { state: 'PARSED', value };
  if (typeof value !== 'string' || !value.trim()) return { state: 'MISSING', value: null };
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? { state: 'PARSED', value: parsed }
      : { state: 'MALFORMED', value: null };
  } catch { return { state: 'MALFORMED', value: null }; }
}

function top5Computable(market, parseState) {
  if (parseState !== 'PARSED' || !market || !Array.isArray(market.topSectors)) return 'UNKNOWN';
  const unique = [];
  for (const row of market.topSectors) {
    const name = typeof row?.industry === 'string' ? row.industry.trim() : '';
    if (name && !unique.includes(name)) unique.push(name);
    if (unique.length === 5) return 'YES';
  }
  return 'NO';
}

function dayGap(a, b) {
  const x = Date.parse(`${a}T00:00:00Z`), y = Date.parse(`${b}T00:00:00Z`);
  return Number.isFinite(x) && Number.isFinite(y) ? Math.round((y - x) / 86400000) : null;
}

export function r03r06SequenceReadiness(journalRows = [], researchRows = [], cutoff = '2026-09-21') {
  const journalCounts = new Map();
  for (const row of journalRows) {
    const d = isoDate(row?.scan_date ?? row?.scanDate);
    if (!d || d < cutoff) continue;
    journalCounts.set(d, (journalCounts.get(d) || 0) + 1);
  }
  const expected = [...journalCounts.keys()].sort();
  const duplicateJournalDates = expected.filter(d => journalCounts.get(d) > 1);

  const byDate = new Map();
  const duplicateResearchDates = new Set();
  for (const row of researchRows) {
    const d = isoDate(row?.scan_date ?? row?.scanDate);
    if (!d || d < cutoff) continue;
    if (byDate.has(d)) duplicateResearchDates.add(d); else byDate.set(d, row);
  }
  const dates = expected.map(scanDate => {
    const journalRow = journalCounts.get(scanDate) > 1 ? 'DUPLICATE' : 'SINGLE';
    const row = byDate.get(scanDate);
    if (!row) return { scanDate, journalRow, researchRow: 'MISSING', marketJson: 'UNKNOWN', regimeInputCompleteness: 'UNKNOWN', top5SectorComputable: 'UNKNOWN' };
    if (duplicateResearchDates.has(scanDate)) return { scanDate, journalRow, researchRow: 'DUPLICATE', marketJson: 'UNKNOWN', regimeInputCompleteness: 'UNKNOWN', top5SectorComputable: 'UNKNOWN' };
    const parsed = parseMarketJson(row.market_json ?? row.marketJson);
    if (parsed.state !== 'PARSED') return { scanDate, journalRow, researchRow: 'PRESENT', marketJson: parsed.state, regimeInputCompleteness: 'UNKNOWN', top5SectorComputable: 'UNKNOWN' };
    const m = parsed.value;
    return {
      scanDate,
      journalRow,
      researchRow: 'PRESENT',
      marketJson: 'PARSED',
      regimeInputCompleteness: finite(m.marketReturn20) && finite(m.aboveMa20Pct) ? 'PROVEN_COMPLETE' : 'UNKNOWN',
      top5SectorComputable: top5Computable(m, 'PARSED')
    };
  });
  const adjacentPairs = [];
  for (let i = 1; i < dates.length; i++) {
    const a = dates[i - 1], b = dates[i];
    const journalClean = a.journalRow === 'SINGLE' && b.journalRow === 'SINGLE';
    const structural = journalClean && a.researchRow === 'PRESENT' && b.researchRow === 'PRESENT' && a.marketJson === 'PARSED' && b.marketJson === 'PARSED';
    const r06Structural = structural && a.regimeInputCompleteness === 'PROVEN_COMPLETE' && b.regimeInputCompleteness === 'PROVEN_COMPLETE';
    const r03Structural = structural && a.top5SectorComputable === 'YES' && b.top5SectorComputable === 'YES';
    adjacentPairs.push({
      from: a.scanDate,
      to: b.scanDate,
      calendarDayGap: dayGap(a.scanDate, b.scanDate),
      expectedJournalAdjacency: 'YES',
      exchangeSessionAdjacency: 'UNKNOWN',
      journalDenominatorQuality: journalClean ? 'CLEAN' : 'DUPLICATE_DATE_ANOMALY',
      r06RegimeFieldsReady: r06Structural ? 'YES' : 'NO',
      r03Top5FieldsReady: r03Structural ? 'YES' : 'NO',
      r06RegimePairReady: r06Structural ? 'UNKNOWN_SESSION_ADJACENCY' : 'NO',
      r03Top5PairReady: r03Structural ? 'UNKNOWN_SESSION_ADJACENCY' : 'NO'
    });
  }
  return {
    expectedDateCount: expected.length,
    duplicateJournalDateCount: duplicateJournalDates.length,
    duplicateJournalDates,
    dates,
    adjacentPairs
  };
}
