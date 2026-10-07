import fs from 'node:fs';
import assert from 'node:assert/strict';

const spec=JSON.parse(fs.readFileSync(new URL('./d03_layer_b_lifecycle_event_normalization_contract_20261007_v0_1.json',import.meta.url),'utf8'));

assert.equal(spec.maturityDecision.d03MaturityPct,56.7);
assert.equal(spec.maturityDecision.d03_09,'L2_40');
assert.equal(spec.maturityDecision.d03_10,'L2_40');
assert.equal(spec.maturityDecision.maturityPromotion,false);
assert.equal(spec.maturityDecision.layerC,'NOT_PROVEN');

assert.match(spec.intervalSemantics.stopResume,/\[stopDate,resumeDate\)/);
assert.match(spec.intervalSemantics.delisting,/exclusive membership boundary/);
assert.match(spec.intervalSemantics.listing,/inclusive membership boundary/);
assert.match(spec.intervalSemantics.overlap,/Never subtract the same symbol-session twice/);

for(const needed of [
  'LISTING_START','REGULATORY_STOP','REGULATORY_RESUME',
  'DELISTING_EFFECTIVE','SHARE_CONVERSION_STOP','MARKET_MIGRATION_OUT','MARKET_MIGRATION_IN'
]) assert.ok(spec.canonicalEventTypes.includes(needed));

for(const needed of [
  'DELISTING_TERMINATES_OLD_SYMBOL_MEMBERSHIP',
  'RESUME_REOPENS_TRADING_ONLY_IF_MEMBERSHIP_REMAINS_ACTIVE',
  'SOURCE_DISAGREEMENT_FAILS_CLOSED_TO_CONFLICT_NOT_BEST_GUESS',
  'NO_SYNTHETIC_OHLC_FOR_NON_TRADING_INTERVALS'
]) assert.ok(spec.authorityAndConflictRules.includes(needed));

const cases=Object.fromEntries(spec.acceptanceCases.map(x=>[x.id,x.rule]));
assert.equal(cases.TWSE_8101_2024,'stop 2024-08-22, resume 2024-11-19 => [2024-08-22,2024-11-19) no-trading');
assert.equal(cases.TWSE_1701_2024,'share-conversion stop 2024-08-21 plus delisting 2024-09-02 => [2024-08-21,2024-09-02) no-trading and old-symbol membership ends 2024-09-02');
assert.equal(cases.TPEX_4806_2023,'stop 2023-04-10, resume 2023-10-12 => [2023-04-10,2023-10-12) no-trading');
assert.equal(cases.TPEX_3089_2021,'stop 2021-01-20, resume 2021-07-20 => [2021-01-20,2021-07-20) no-trading');

assert.deepEqual(spec.coverageIntegration.missingReasonPriority,[
  'NOT_A_MEMBER_ON_DATE',
  'OFFICIAL_REGULATORY_NO_TRADING_INTERVAL',
  'OFFICIAL_LISTING_OR_MIGRATION_BOUNDARY',
  'UNKNOWN_SYMBOL_SESSION_GAP'
]);

console.log(JSON.stringify({
  status:'PASS',
  eventTypeCount:spec.canonicalEventTypes.length,
  acceptanceCaseCount:spec.acceptanceCases.length,
  d03MaturityPct:spec.maturityDecision.d03MaturityPct,
  layerB:spec.maturityDecision.layerB
}));
