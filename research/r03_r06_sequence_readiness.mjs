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
  const expected = [...new Set(journalRows.map(r => isoDate(r?.scan_date ?? r?.scanDate)).filter(d => d && d >= cutoff))].sort();
  const byDate = new Map();
  const duplicateResearchDates = new Set();
  for (const row of researchRows) {
    const d = isoDate(row?.scan_date ?? row?.scanDate);
    if (!d || d < cutoff) continue;
    if (byDate.has(d)) duplicateResearchDates.add(d); else byDate.set(d, row);
  }
  const dates = expected.map(scanDate => {
    const row = byDate.get(scanDate);
    if (!row) return { scanDate, researchRow: 'MISSING', marketJson: 'UNKNOWN', regimeInputCompleteness: 'UNKNOWN', top5SectorComputable: 'UNKNOWN' };
    if (duplicateResearchDates.has(scanDate)) return { scanDate, researchRow: 'DUPLICATE', marketJson: 'UNKNOWN', regimeInputCompleteness: 'UNKNOWN', top5SectorComputable: 'UNKNOWN' };
    const parsed = parseMarketJson(row.market_json ?? row.marketJson);
    if (parsed.state !== 'PARSED') return { scanDate, researchRow: 'PRESENT', marketJson: parsed.state, regimeInputCompleteness: 'UNKNOWN', top5SectorComputable: 'UNKNOWN' };
    const m = parsed.value;
    return {
      scanDate,
      researchRow: 'PRESENT',
      marketJson: 'PARSED',
      regimeInputCompleteness: finite(m.marketReturn20) && finite(m.aboveMa20Pct) ? 'PROVEN_COMPLETE' : 'UNKNOWN',
      top5SectorComputable: top5Computable(m, 'PARSED')
    };
  });
  const adjacentPairs = [];
  for (let i = 1; i < dates.length; i++) {
    const a = dates[i - 1], b = dates[i];
    const structural = a.researchRow === 'PRESENT' && b.researchRow === 'PRESENT' && a.marketJson === 'PARSED' && b.marketJson === 'PARSED';
    const r06Structural = structural && a.regimeInputCompleteness === 'PROVEN_COMPLETE' && b.regimeInputCompleteness === 'PROVEN_COMPLETE';
    const r03Structural = structural && a.top5SectorComputable === 'YES' && b.top5SectorComputable === 'YES';
    adjacentPairs.push({
      from: a.scanDate,
      to: b.scanDate,
      calendarDayGap: dayGap(a.scanDate, b.scanDate),
      expectedJournalAdjacency: 'YES',
      exchangeSessionAdjacency: 'UNKNOWN',
      r06RegimeFieldsReady: r06Structural ? 'YES' : 'NO',
      r03Top5FieldsReady: r03Structural ? 'YES' : 'NO',
      r06RegimePairReady: r06Structural ? 'UNKNOWN_SESSION_ADJACENCY' : 'NO',
      r03Top5PairReady: r03Structural ? 'UNKNOWN_SESSION_ADJACENCY' : 'NO'
    });
  }
  return { expectedDateCount: expected.length, dates, adjacentPairs };
}
