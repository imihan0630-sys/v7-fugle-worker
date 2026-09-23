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

const result = buildPricePathReadinessMatrix([immature, mature, missingField]);
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
assert.equal(result.unit, 'INDEPENDENT_SCAN_DATE_X_COHORT');
console.log('price_path_readiness fixtures PASS');
