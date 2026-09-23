const assert = require('assert');
const { buildPricePathReadinessMatrix } = require('./price_path_readiness_v8_8_2');

const immature = {
  scanDate: '2026-09-23', symbol: '1111', cohort: 'NEAR_MISS', baselineClose: 100,
  snapshot: { price: { close: 100, breakoutReferencePriceResearch: 99, residualSectorRs20: 3.2 }, volume: { volumeTodayVsPrev5: 0.8 } },
  breakout: { reference: 99, status: 'PENDING' }, firstDay: { overnightPct: null, intradayPct: null }, horizons: { d5: null, d10: null, d20: null }
};
const mature = {
  scanDate: '2026-09-23', symbol: '2222', cohort: 'NEAR_MISS', baselineClose: 50,
  snapshot: { price: { close: 50, breakoutReferencePriceResearch: 49, residualSectorRs20: 1.1 }, volume: { volumeTodayVsPrev5: 1.2 } },
  breakout: { reference: 49, status: 'HELD_3D' }, firstDay: { overnightPct: 1, intradayPct: -0.5 }, horizons: { d5: { returnPct: 2 }, d10: null, d20: null }
};
const missingField = {
  scanDate: '2026-09-24', symbol: '3333', cohort: 'SELECTED', baselineClose: 80,
  snapshot: { price: { close: 80 }, volume: {} }, breakout: { reference: null, status: 'NO_REFERENCE' },
  firstDay: { overnightPct: null, intradayPct: null }, horizons: { d5: null, d10: null, d20: null }
};
const validSnapshotBrokenHistory = {
  scanDate: '2026-09-25', symbol: '4444', cohort: 'BROAD_CONTROL', baselineClose: 120,
  snapshot: { price: { close: 120, breakoutReferencePriceResearch: 118, residualSectorRs20: 2.4 }, volume: { volumeTodayVsPrev5: 0.7 } },
  breakout: { reference: 118, status: 'PENDING' }, firstDay: { overnightPct: null, intradayPct: null }, horizons: { d5: null, d10: null, d20: null }
};
const malformedSnapshot = {
  scanDate: '2026-09-26', symbol: '5555', cohort: 'REJECTED_AFTER_BASE', baselineClose: null,
  snapshot: {}, breakout: { reference: null, status: 'NO_REFERENCE' }, firstDay: {}, horizons: {}
};
const validSnapshotMissingBaseline = {
  scanDate: '2026-09-27', symbol: '6666', cohort: 'BROAD_CONTROL', baselineClose: null,
  snapshot: { price: { residualSectorRs20: 1.7 }, volume: { volumeTodayVsPrev5: 0.9 } },
  breakout: { reference: null, status: 'NO_REFERENCE' }, firstDay: { overnightPct: null, intradayPct: null }, horizons: { d5: null, d10: null, d20: null }
};
// Deliberately inconsistent synthetic serializer state. The current production serializer cannot
// compute a finite return without a finite baseline, but B-13 precedence says an already finite
// serialized outcome is authoritative if such a row is ever encountered downstream.
const finiteOutcomeDespiteBrokenProvenance = {
  scanDate: '2026-09-28', symbol: '7777', cohort: 'BROAD_CONTROL', baselineClose: null,
  snapshot: { price: { residualSectorRs20: 0.4 }, volume: { volumeTodayVsPrev5: 1.1 } },
  breakout: { reference: null, status: 'NO_REFERENCE' }, firstDay: { overnightPct: null, intradayPct: null },
  horizons: { d5: { returnPct: 4.2 }, d10: null, d20: null }
};

const provenance = {
  '2026-09-25|4444': { snapshotState: 'SNAPSHOT_OK', historyState: 'HISTORY_PARSE_ERROR' },
  '2026-09-26|5555': { snapshotState: 'SNAPSHOT_PARSE_ERROR', historyState: 'HISTORY_ROW_MISSING' },
  '2026-09-27|6666': { snapshotState: 'SNAPSHOT_OK', historyState: 'HISTORY_OK' },
  '2026-09-28|7777': { snapshotState: 'SNAPSHOT_OK', historyState: 'HISTORY_PARSE_ERROR' }
};
const result = buildPricePathReadinessMatrix([immature, mature, missingField, validSnapshotBrokenHistory, malformedSnapshot, validSnapshotMissingBaseline, finiteOutcomeDespiteBrokenProvenance], provenance);
const g = result.groups.find(x => x.scanDate === '2026-09-23' && x.cohort === 'NEAR_MISS');
assert.equal(g.rows, 2);
assert.equal(g.fields.r07ResidualSectorRs20.AVAILABLE, 2, 'field coverage must not depend on D5 maturity');
assert.equal(g.fields.r08VolumeTodayVsPrev5.AVAILABLE, 2, 'relative-volume coverage must not depend on D5 maturity');
assert.equal(g.outcomes.d5.AVAILABLE, 1);
assert.equal(g.outcomes.d5.OUTCOME_NOT_MATURE, 1);
const m = result.groups.find(x => x.scanDate === '2026-09-24' && x.cohort === 'SELECTED');
assert.equal(m.fields.r07ResidualSectorRs20.FIELD_UNKNOWN_OR_MISSING, 1);
assert.equal(m.fields.r08VolumeTodayVsPrev5.FIELD_UNKNOWN_OR_MISSING, 1);
assert.equal(m.outcomes.d5.OUTCOME_NOT_MATURE, 1);

const split = result.groups.find(x => x.scanDate === '2026-09-25' && x.cohort === 'BROAD_CONTROL');
assert.equal(split.fields.r07ResidualSectorRs20.AVAILABLE, 1, 'valid scan-time field must survive later history failure');
assert.equal(split.fields.r08VolumeTodayVsPrev5.AVAILABLE, 1, 'valid scan-time relative volume must survive later history failure');
assert.equal(split.outcomes.d5.PROVENANCE_BLOCKED, 1, 'history failure may block future outcome only');

const badSnapshot = result.groups.find(x => x.scanDate === '2026-09-26' && x.cohort === 'REJECTED_AFTER_BASE');
assert.equal(badSnapshot.fields.r05BaselineClose.PROVENANCE_BLOCKED, 1, 'malformed snapshot must not become ordinary missing field');
assert.equal(badSnapshot.fields.r07ResidualSectorRs20.PROVENANCE_BLOCKED, 1);
assert.equal(badSnapshot.outcomes.d5.PROVENANCE_BLOCKED, 1);

const noBaseline = result.groups.find(x => x.scanDate === '2026-09-27' && x.cohort === 'BROAD_CONTROL');
assert.equal(noBaseline.fields.r05BaselineClose.FIELD_UNKNOWN_OR_MISSING, 1, 'parsed snapshot with absent baseline is missing data, not snapshot parse failure');
assert.equal(noBaseline.fields.r07ResidualSectorRs20.AVAILABLE, 1, 'other scan-time fields remain observable when baseline alone is missing');
assert.equal(noBaseline.outcomes.d5.PROVENANCE_BLOCKED, 1, 'missing baseline must not be mislabeled as immature future outcome');

const finiteWins = result.groups.find(x => x.scanDate === '2026-09-28' && x.cohort === 'BROAD_CONTROL');
assert.equal(finiteWins.outcomes.d5.AVAILABLE, 1, 'finite serialized outcome remains authoritative even if attached provenance is inconsistent');
assert.equal(finiteWins.fields.r05BaselineClose.FIELD_UNKNOWN_OR_MISSING, 1, 'authoritative future metric must not fabricate a missing scan-time baseline');
assert.equal(result.unit, 'INDEPENDENT_SCAN_DATE_X_COHORT');
console.log('price_path_readiness fixtures PASS');
