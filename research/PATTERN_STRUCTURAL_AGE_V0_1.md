# D01 DL-038 — Structural-Level Age / Decay Semantics V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / AGE_DECAY_SEMANTICS / FORMAL_CORE_LOCKED

## 1. Problem

"Old support/resistance decays" is not one variable.

A level can be:
- old since confirmation but touched yesterday;
- young since confirmation but never revisited;
- old in calendar days but young in eligible trading sessions due suspension/non-trading;
- repeatedly interacted with across changing regime/liquidity conditions.

Therefore one calendar-age number is insufficient.

## 2. Frozen age clocks

A1 — zoneAgeEligibleSessions
eligible symbol-session distance from parentConfirmedAt to asOf.

A2 — zoneAgeCalendarDays
calendar age for audit/display only.

A3 — lastTouchAgeEligibleSessions
eligible-session distance from last legal touch to asOf.

A4 — lastBounceAgeEligibleSessions
eligible-session distance from last legal bounce/response event to asOf, if event semantics are prospectively valid.

A5 — lastTransitionAgeEligibleSessions
time since latest canonical lifecycle transition.

A6 — dormantEligibleSessions
eligible sessions since the last canonical zone interaction.

A7 — interactionSpanEligibleSessions
eligible-session span from first legal interaction to most recent legal interaction.

No age clock has a preregistered bullish/bearish sign.

## 3. Eligible-session clock is primary

Calendar days can include:
- weekends;
- holidays;
- verified suspensions;
- non-trading periods.

For market-memory timing:
eligible symbol sessions are the primary clock.

Calendar age remains useful for audit / human interpretation.

Unknown symbol-session provenance:
age = UNKNOWN,
not calendar-day fallback.

## 4. Confirmation age vs interaction recency

zoneAge and lastTouchAge answer different questions.

Example:
Zone A confirmed 100 sessions ago, touched 1 session ago.
Zone B confirmed 20 sessions ago, last touched 18 sessions ago.

A is structurally older but interaction-recent.
B is structurally younger but interaction-dormant.

Do not collapse them into one "freshness score."

## 5. Age vs exposure

Age is not identical to opportunity.

A zone can be old while price spends most of the time far away.

Required context:
- distance path;
- time at/near risk;
- observable exposure;
- volatility;
- touch/dwell history.

A finding "older zones have fewer bounces" can be confounded by reduced interaction opportunity.

## 6. Age vs survival

A very old still-observed zone has survived long enough to remain in the sample.

This creates survivorship conditioning.

Future decay inference must use risk-set / landmark semantics:
compare zones alive and evaluable at the same age/risk state.

Do not group by eventual lifetime.

## 7. Structural continuity / invalidation

Age cannot continue blindly through:
- boundary version replacement;
- semantic-space break;
- unresolved corporate-action continuity;
- detector lineage change that creates a new object.

New boundary version:
new zone lineage / age clock.

A corporate-action-adjusted technical continuity space may preserve comparable geometry only under the canonical continuity contract.

## 8. No half-life assumption

Published evidence reports time decay in support/resistance behavior.

D01 does not convert that into:
- 20-day decay;
- 60-day expiry;
- exponential half-life;
- hard stale/fresh bucket.

Future D16 may fit preregistered continuous/nonlinear age effects after sufficient prospective data.

No post-outcome cutoff mining.

## 9. Decay analysis ladder

D0:
zoneAgeEligibleSessions alone.

D1:
D0 + lastTouchAge / dormant age.

D2:
D1 + touch count / spacing / dwell.

D3:
D2 + opportunity controls: volatility, distance path, width, liquidity, constrained sessions.

D4:
D3 + detector selection / salience / regime.

D5:
D4 + risk-set / survivorship-correct inference.

Only D5 supports a serious structural-age representation claim.

## 10. Competing mechanisms

Possible patterns:
- true memory decay over time;
- renewed salience after a recent touch;
- survival selection among durable zones;
- regime change;
- price moving far away reducing exposure;
- liquidity/tick changes.

Age sign can therefore be non-monotone.

No monotonic decay is assumed.

## 11. Current decision

STRUCTURAL_AGE = MULTI_CLOCK_CONTEXT.

ELIGIBLE_SESSION_AGE = PRIMARY.

CALENDAR_AGE = AUDIT_SECONDARY.

FRESHNESS_SCORE = REJECTED_V0_1.

HALF_LIFE = NOT_FROZEN.

AGE_DIRECTIONAL_SIGN = UNKNOWN.

OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 12. Exact next continuation

1. Build a PIT age-clock constructor from certified eligible sessions.
2. Add old-but-recent-touch vs young-but-dormant counterexamples.
3. Hand D0-D5 decay ladder to D16.
4. Next science: interaction between structural age and regime/state changes without inventing a new Pattern×Regime family.
5. No outcome join / no Formal change.
