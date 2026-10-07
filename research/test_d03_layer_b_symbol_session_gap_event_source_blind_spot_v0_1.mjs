import fs from 'node:fs';
import assert from 'node:assert/strict';

const spec=JSON.parse(fs.readFileSync(new URL('./d03_layer_b_symbol_session_gap_event_source_blind_spot_20261007_v0_1.json',import.meta.url),'utf8'));

assert.equal(spec.rootCause.state,'CONFIRMED_EVENT_SOURCE_CLASS_INCOMPLETENESS');
assert.ok(spec.requiredLifecycleUnion.includes('REGULATORY_STOP_TRADING'));
assert.ok(spec.requiredLifecycleUnion.includes('DELISTING_EFFECTIVE_DATE'));
assert.ok(spec.semanticRules.includes('ABSENCE_FROM_ONE_EVENT_FEED_NEVER_CERTIFIES_NO_STOP_EVENT'));
assert.ok(spec.semanticRules.includes('NO_SYNTHETIC_OHLC_MAY_BE_CREATED_TO_FILL_A_CLASSIFIED_NON_TRADING_INTERVAL'));

const twse=spec.evidence.find(x=>x.market==='TWSE'&&x.year===2024);
const t23=spec.evidence.find(x=>x.market==='TPEX'&&x.year===2023);
const t21=spec.evidence.find(x=>x.market==='TPEX'&&x.year===2021);
assert.equal(twse.directlyExplainedCandidateBars,373);
assert.equal(t23.directlyExplainedCandidateBars,296);
assert.equal(t21.directlyExplainedCandidateBars,144);
assert.ok(twse.directlyExplainedCandidatePct>78 && twse.directlyExplainedCandidatePct<79);
assert.ok(t23.directlyExplainedCandidatePct>74 && t23.directlyExplainedCandidatePct<75);
assert.ok(t21.directlyExplainedCandidatePct>34 && t21.directlyExplainedCandidatePct<35.1);

assert.equal(spec.maturityDecision.d03MaturityPct,56.7);
assert.equal(spec.maturityDecision.d03_09,'L2_40');
assert.equal(spec.maturityDecision.d03_10,'L2_40');
assert.equal(spec.maturityDecision.maturityPromotion,false);
assert.equal(spec.maturityDecision.rawSourceVersionGate,'2_OF_3');
assert.equal(spec.maturityDecision.outcomes,'CLOSED');

console.log(JSON.stringify({
 status:'PASS',
 twse2024CandidateReclassPct:twse.directlyExplainedCandidatePct,
 tpex2023CandidateReclassPct:t23.directlyExplainedCandidatePct,
 tpex2021DirectCandidateReclassPct:t21.directlyExplainedCandidatePct,
 maturityPct:spec.maturityDecision.d03MaturityPct
}));
