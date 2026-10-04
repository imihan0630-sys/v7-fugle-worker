# D01 DL-035 — D16 Polarity Incrementality / Retest Selection Handoff V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes:
- E1 first-retest arrival cohort semantics;
- E2 conditional first-retest response semantics;
- S0 salient non-role vs S1 certified former-role comparator identity;
- pre-break vs post-break timing classification.

D16 owns future statistical inference.

## 2. Never collapse E1 and E2

E1 asks:
Does a valid first retest occur and when?

Population:
all eligible breakout candidates at breakoutConfirmedAt.

E2 asks:
Conditional on a valid first retest, what is the response?

Population:
only FIRST_RETEST_ARRIVED cases.

An E2 result is conditional on retest selection and must not be presented as the unconditional effect of former-role memory.

## 3. Selection reporting

For S0 and S1 always report:
- eligible breakout N;
- first-retest arrival rate;
- time-to-retest distribution;
- cancellation rate;
- right-censoring rate;
- data-block / constraint rate.

Material E1 differences imply E2 sample selection differs.

## 4. Pre-break baseline controls

Eligible baseline controls are only information available by breakoutConfirmedAt:
- breakout quality / excess;
- D02 acceptance/persistence;
- volatility / liquidity;
- regime;
- tick / constraint state;
- boundary salience;
- detector prominence;
- structural age where causally available.

No post-break path belongs in the baseline total-effect adjustment set.

## 5. Post-break mediators

Examples:
- maximum directional displacement before retest;
- cumulative path;
- time to first retest;
- return-path / retracement descriptors;
- intervening volatility/liquidity migration.

These are MEDIATOR_OR_SELECTION_VARIABLE.

Using them changes the estimand.

## 6. Two estimands

TOTAL_POLARITY_INCREMENT:
- S1 vs S0 under pre-break adjustment/common support;
- no routine post-break mediator adjustment.

PATH_CONDITIONAL_POLARITY_INCREMENT:
- E2 comparison with post-break path adjustment;
- interpret as direct/context-conditional;
- do not claim it is the total former-role effect.

## 7. Comparator quality

Primary S0 is not a random horizontal line.

Prefer:
- same-detector salient candidate without certified prior opposite role;
- preregistered salient range/channel/reference breakout boundary.

S0 and S1 need common support in pre-break context.

## 8. Treatment-definition caution

Certified prior role is itself created from historical interactions.

Do not exact-match away the entire treatment definition.

Separate:
A. presence of certified prior opposite role;
B. intensity/history among certified prior-role roots.

## 9. Common support

TOTAL estimand requires overlap in:
- pre-break breakout context;
- salience;
- volatility/liquidity;
- regime;
- constraint state.

PATH-CONDITIONAL estimand additionally requires post-break path overlap.

No extrapolation outside support.

## 10. Literature/mechanism caution

Generic breakout continuation, price clustering and salient reference levels are real alternative mechanisms.

Taiwan evidence on 52-week-high momentum and limit-order price clustering makes salience/momentum especially important controls.

No behavioral intent is inferred from price alone.

## 11. Promotion boundary

No result authorizes Formal promotion without:
- PIT / replay;
- independent-date / common-support evidence;
- OOS / prospective validation;
- multiple-testing;
- redundancy;
- cost/tradability;
- existing Formal governance.

Formal Core remains LOCKED.
