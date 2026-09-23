import assert from 'node:assert/strict';
import { r03r06SequenceReadiness } from './r03_r06_sequence_readiness.mjs';
const valid = (regime='MIXED', sectors=['A','B','C','D','E']) => JSON.stringify({ regime, marketReturn20: 1.2, aboveMa20Pct: 51.1, topSectors: sectors.map(industry => ({ industry })) });
const journal = ['2026-09-21','2026-09-22','2026-09-23','2026-09-24','2026-09-25','2026-09-26','2026-09-27','2026-09-28'].map(scan_date => ({ scan_date, selected_count: 0 }));
const research = [
  { scan_date:'2026-09-21', market_json:valid() }, // zero-pick expected date remains eligible
  // 09-22 missing research row
  { scan_date:'2026-09-23', market_json:'{' }, // malformed
  { scan_date:'2026-09-24', market_json:JSON.stringify({ regime:'MIXED', topSectors:[{industry:'A'},{industry:'B'},{industry:'C'},{industry:'D'},{industry:'E'}] }) }, // default MIXED missing inputs
  { scan_date:'2026-09-25', market_json:valid('MIXED') }, // valid MIXED complete inputs
  { scan_date:'2026-09-26', market_json:valid('BULL',['A','B','C','D']) }, // partial top sectors
  { scan_date:'2026-09-27', market_json:valid('BULL',['A','A','B','C','D','E']) }, // duplicate sector names but five unique usable
  { scan_date:'2026-09-28', market_json:valid('BULL') }
];
const out = r03r06SequenceReadiness(journal, research);
assert.equal(out.expectedDateCount, 8);
assert.equal(out.dates[0].researchRow, 'PRESENT');
assert.equal(out.dates[1].researchRow, 'MISSING');
assert.equal(out.dates[2].marketJson, 'MALFORMED');
assert.equal(out.dates[3].regimeInputCompleteness, 'UNKNOWN');
assert.equal(out.dates[4].regimeInputCompleteness, 'PROVEN_COMPLETE');
assert.equal(out.dates[5].top5SectorComputable, 'NO');
assert.equal(out.dates[6].top5SectorComputable, 'YES');
// Missing middle expected date must break adjacency readiness; never bridge 09-21 -> 09-23.
assert.deepEqual(out.adjacentPairs[0], { from:'2026-09-21', to:'2026-09-22', r06RegimePairReady:'NO', r03Top5PairReady:'NO' });
assert.deepEqual(out.adjacentPairs[1], { from:'2026-09-22', to:'2026-09-23', r06RegimePairReady:'NO', r03Top5PairReady:'NO' });
console.log('PASS r03/r06 sequence readiness fixtures');
