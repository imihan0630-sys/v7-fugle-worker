import fs from "node:fs";
import assert from "node:assert/strict";

const spec=JSON.parse(fs.readFileSync(new URL("./d03_adx_suspension_resume_wilder_state_semantics_20261008_v0_1.json",import.meta.url),"utf8"));

assert.equal(spec.maturityDecision.d03MaturityPct,56.7);
assert.equal(spec.maturityDecision.maturityPromotion,false);
assert.equal(spec.wilderReferenceSemantics.calendarGapReset,"NO_AUTOMATIC_RESET");
assert.equal(spec.wilderReferenceSemantics.calendarGapDecay,"NO_SYNTHETIC_ZERO_INPUT_DECAY");

const byState=Object.fromEntries(spec.cases.map(x=>[x.state,x]));

const pure=byState.PURE_SUSPENSION_NO_PRICE_BASIS_EVENT;
assert.equal(pure.automaticReset,false);
assert.match(pure.adxRule,/Skip non-trading dates entirely/);
assert.match(pure.adxRule,/continue canonical Wilder recursion/);
assert.match(pure.adxRule,/large market gap/);

const transformed=byState.SUSPENSION_WITH_CERTIFIED_PRICE_BASIS_TRANSFORM;
assert.equal(transformed.automaticReset,false);
assert.match(transformed.adxRule,/Do not bridge RAW/);
assert.match(transformed.adxRule,/continuity-transformed H\/L\/C history/);

const identity=byState.IDENTITY_TERMINATION_REORG_OR_MARKET_MIGRATION;
assert.equal(identity.automaticReset,true);
assert.equal(identity.resetMeaning,"NEW_IDENTITY_NEW_STATE_LINEAGE_NOT_CALENDAR_GAP_RESET");
assert.match(identity.adxRule,/Terminate old-symbol recursive state/);
assert.match(identity.adxRule,/Do not inherit ADX\/Wilder state/);

const unresolved=byState.UNRESOLVED_OR_CONFLICTED_EVENT_BOUNDARY;
assert.equal(unresolved.promotionState,"FAIL_CLOSED_CONTINUITY_UNKNOWN");

for(const forbidden of [
  "DO_NOT_INSERT_ZERO_VOLUME_FLAT_PSEUDO_BARS_DURING_SUSPENSION",
  "DO_NOT_DECAY_WILDER_STATE_ON_NON_TRADING_CALENDAR_DAYS",
  "DO_NOT_RESET_ADX_AFTER_AN_ARBITRARY_NUMBER_OF_CALENDAR_DAYS",
  "DO_NOT_BRIDGE_RAW_PRE_CA_PRICE_TO_POST_CA_PRICE_WHEN_PRICE_BASIS_CHANGED",
  "DO_NOT_INHERIT_RECURSIVE_STATE_ACROSS_SYMBOL_IDENTITY_TERMINATION"
]) assert.ok(spec.antiShortcuts.includes(forbidden));

assert.match(spec.parameterFamilyRule,/new preregistered parameter-family hypothesis/);
assert.equal(spec.warmupRule.fixedWaitRuleRejected,true);
assert.equal(spec.warmupRule.sixtyFiveBarInheritanceFromKdRsiMacdRejected,true);
assert.equal(spec.moduleImpact["D03-09"].maturityPromotion,false);
assert.equal(spec.moduleImpact["D03-10"].maturityPromotion,false);

console.log(JSON.stringify({
  status:"PASS",
  caseCount:spec.cases.length,
  antiShortcutCount:spec.antiShortcuts.length,
  calendarGapReset:spec.wilderReferenceSemantics.calendarGapReset,
  d03MaturityPct:spec.maturityDecision.d03MaturityPct
}));
