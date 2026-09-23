import assert from 'node:assert/strict';
import { r03r06SequenceReadiness } from './r03_r06_sequence_readiness.mjs';
const valid = (regime='MIXED', sectors=['A','B','C','D','E']) => JSON.stringify({ regime, marketReturn20: 1.2, aboveMa20Pct: 51.1, topSectors: sectors.map(industry => ({ industry })) });
const journal = ['2026-09-21','2026-09-22','2026-09-23','2026-09-24','2026-09-25','2026-09-26','2026-09-27','2026-09-28'].map(scan_date => ({ scan_date, selected_count: 0 }));
const research = [
  { scan_date:'2026-09-21', market_json:valid() },
  // 09-22 missing research row
  { scan_date:'2026-09-23', market_json:'{' },
  { scan_date:'2026-09-24', market_json:JSON.stringify({ regime:'MIXED', topSectors:[{industry:'A'},{industry:'B'},{industry:'C'},{industry:'D'},{industry:'E'}] }) },
  { scan_date:'2026-09-25', market_json:valid('MIXED') },
  { scan_date:'2026-09-26', market_json:valid('BULL',['A','B','C','D']) },
  { scan_date:'2026-09-27', market_json:valid('BULL',['A','A','B','C','D','E']) },
  { scan_date:'2026-09-28', market_json:valid('BULL') }
];
const out = r03r06SequenceReadiness(journal, research);
assert.equal(out.expectedDateCount, 8);
assert.equal(out.duplicateJournalDateCount, 0);
assert.equal(out.dates[0].journalRow, 'SINGLE');
assert.equal(out.dates[0].researchRow, 'PRESENT');
assert.equal(out.dates[1].researchRow, 'MISSING');
assert.equal(out.dates[2].marketJson, 'MALFORMED');
assert.equal(out.dates[3].regimeInputCompleteness, 'UNKNOWN');
assert.equal(out.dates[4].regimeInputCompleteness, 'PROVEN_COMPLETE');
assert.equal(out.dates[5].top5SectorComputable, 'NO');
assert.equal(out.dates[6].top5SectorComputable, 'YES');
assert.deepEqual(out.adjacentPairs[0], { from:'2026-09-21', to:'2026-09-22', calendarDayGap:1, expectedJournalAdjacency:'YES', exchangeSessionAdjacency:'UNKNOWN', journalDenominatorQuality:'CLEAN', r06RegimeFieldsReady:'NO', r03Top5FieldsReady:'NO', r06RegimePairReady:'NO', r03Top5PairReady:'NO' });
assert.deepEqual(out.adjacentPairs[1], { from:'2026-09-22', to:'2026-09-23', calendarDayGap:1, expectedJournalAdjacency:'YES', exchangeSessionAdjacency:'UNKNOWN', journalDenominatorQuality:'CLEAN', r06RegimeFieldsReady:'NO', r03Top5FieldsReady:'NO', r06RegimePairReady:'NO', r03Top5PairReady:'NO' });
// Even two structurally complete adjacent journal rows do not prove consecutive exchange sessions.
const complete = r03r06SequenceReadiness(
  [{scan_date:'2026-09-25'},{scan_date:'2026-09-28'}],
  [{scan_date:'2026-09-25',market_json:valid('BULL')},{scan_date:'2026-09-28',market_json:valid('BULL')}]
);
assert.equal(complete.adjacentPairs[0].calendarDayGap, 3);
assert.equal(complete.adjacentPairs[0].exchangeSessionAdjacency, 'UNKNOWN');
assert.equal(complete.adjacentPairs[0].journalDenominatorQuality, 'CLEAN');
assert.equal(complete.adjacentPairs[0].r06RegimeFieldsReady, 'YES');
assert.equal(complete.adjacentPairs[0].r03Top5FieldsReady, 'YES');
assert.equal(complete.adjacentPairs[0].r06RegimePairReady, 'UNKNOWN_SESSION_ADJACENCY');
assert.equal(complete.adjacentPairs[0].r03Top5PairReady, 'UNKNOWN_SESSION_ADJACENCY');

// Duplicate journal rows are one expected date plus an explicit denominator anomaly, never two observations.
const dupJournal = r03r06SequenceReadiness(
  [{scan_date:'2026-09-24'},{scan_date:'2026-09-24'},{scan_date:'2026-09-25'}],
  [{scan_date:'2026-09-24',market_json:valid('BULL')},{scan_date:'2026-09-25',market_json:valid('BULL')}]
);
assert.equal(dupJournal.expectedDateCount, 2);
assert.equal(dupJournal.duplicateJournalDateCount, 1);
assert.deepEqual(dupJournal.duplicateJournalDates, ['2026-09-24']);
assert.equal(dupJournal.dates[0].journalRow, 'DUPLICATE');
assert.equal(dupJournal.adjacentPairs[0].journalDenominatorQuality, 'DUPLICATE_DATE_ANOMALY');
assert.equal(dupJournal.adjacentPairs[0].r06RegimeFieldsReady, 'NO');
assert.equal(dupJournal.adjacentPairs[0].r03Top5FieldsReady, 'NO');
console.log('PASS r03/r06 sequence readiness fixtures');
