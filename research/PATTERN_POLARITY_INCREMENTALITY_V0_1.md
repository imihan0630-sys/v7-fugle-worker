# D01 DL-035 — Polarity Memory vs Breakout Momentum, Boundary Salience and Retest Selection V0.1

Updated: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / POLARITY_INCREMENTALITY_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-034 froze role-reversal eligibility without using the first retest outcome.

DL-035 asks whether former-role history is incrementally informative after separating three alternative explanations:

1. generic breakout continuation / momentum;
2. boundary salience / price clustering / reference-point effects;
3. selection into the first-retest sample.

The key scientific correction is:

> "Will price return to test the boundary?" and "What happens after the valid retest begins?" are different estimands.

Conditioning only on cases that later retest can create selection bias if former-role history changes retest arrival probability or timing.

No outcome is opened in this tranche.

## 2. External evidence context

Several evidence families make a naive polarity interpretation unsafe.

- Osler (2001/2003) documents acceleration through predictable technical levels and explains part of the effect through clustered stop-loss / take-profit orders around salient prices.
- George and Hwang (2004) show proximity to the 52-week high can dominate past-return information in momentum prediction.
- Hao, Chu, Ho and Ko (2016) find mixed anchoring and recency evidence for 52-week-high momentum in Taiwan, with strong state dependence across time and market conditions.
- Chiao (2009), using comprehensive Taiwan limit-order data, finds order prices cluster at integer/even prices and that price clustering creates barriers.
- Modern technical-rule studies evaluate large families of support/resistance and channel-breakout rules, reinforcing that generic breakout continuation is a separate mechanism family from former-role memory.

These findings do not prove the D01 polarity hypothesis.
They require stronger controls.

## 3. Two estimands, not one

### E1 — FIRST_RETEST_ARRIVAL

Population:
all DL-034 CROSS_CONFIRMED_FLIP_ELIGIBLE candidates at breakoutConfirmedAt.

Question:
does a valid first opposite-side retest occur, and when?

Possible later states:
- FIRST_RETEST_ARRIVED;
- RIGHT_CENSORED_NO_RETEST;
- CANCELLED_BEFORE_RETEST;
- DATA_BLOCKED.

This estimand must not condition on eventual retest arrival at cohort creation.

### E2 — FIRST_RETEST_RESPONSE

Population:
only candidates after FIRST_RETEST_ARRIVED / valid opportunity.

Question:
conditional on a valid first retest opportunity, does former-role history add representation to the future response?

E2 is conditional.
It must not be described as the unconditional effect of polarity memory on the entire breakout cohort.

## 4. Pre-break / post-break timing firewall

Covariates are separated by causal timing.

### PRE_BREAK_CONTEXT

Available no later than breakoutConfirmedAt:
- originalRole;
- certified prior-role history;
- breakout direction;
- breakout confirmation strength already provided by D01-05;
- D02 acceptance/persistence state available at confirmation;
- volatility/liquidity/regime state;
- relative tick / gap-limit state;
- round-price proximity;
- detector salience / anchor prominence;
- public reference-level proximity where a canonical owner provides it.

These may be baseline confounders / stratification variables.

### POST_BREAK_PRE_RETEST_PATH

Only exists after breakoutConfirmedAt and before first retest:
- max directional displacement;
- max displacement in ATR units;
- cumulative path;
- time to first retest;
- retracement depth / return-path descriptors;
- intervening volatility/liquidity migration;
- path efficiency where canonically defined.

These are potentially mediators or selection variables.

They are not ordinary baseline confounders.

## 5. Total vs path-conditional polarity effect

Future D16 analysis must distinguish:

TOTAL_POLARITY_INCREMENT:
- compare former-role vs salient non-role breakout candidates;
- adjust only preregistered pre-break context;
- do not casually adjust post-break mediators.

PATH_CONDITIONAL_POLARITY_INCREMENT:
- conditional first-retest response comparison;
- may additionally condition on post-break path descriptors;
- interpretation is a direct/context-conditional effect, not the total effect.

If post-break path adjustment removes the former-role difference, the conclusion is:
POLARITY_EFFECT_MEDIATED_OR_EXPLAINED_BY_PATH.

Do not call it "no effect" without stating the estimand change.

## 6. Salience-matched comparator family

A random breakout line is too weak a control.

Primary non-role comparator:

S0_SALIENT_NON_ROLE_BREAKOUT
- same detector family / semantic space;
- comparable breakout lifecycle;
- same symbol/date environment where feasible;
- candidate boundary was causally salient before breakout;
- candidate did NOT have a certified prior opposite support/resistance role at breakoutConfirmedAt.

Preferred sources include:
- same-detector UNCONFIRMED_ACTIVE structural candidate from DL-028;
- preregistered salient range/channel/reference boundary without certified opposite-role status.

Treatment-like representation:

S1_CERTIFIED_FORMER_ROLE_BREAKOUT
- same context;
- certified prior support/resistance role in the opposite polarity.

D01 freezes eligibility.
D16 owns matching/weighting.

## 7. Do not over-control the treatment definition

Prior-role certification depends on historical interaction evidence.

Therefore:
- former-role presence is the main representation being tested;
- originalRoleInteractionCount / bounce history may be studied as treatment intensity;
- do not automatically exact-match away every historical interaction dimension and then claim to test former-role presence.

D16 must state whether the estimand is:
- presence of certified role history;
- incremental intensity of role history among certified roots.

These are different questions.

## 8. Boundary salience controls

Store separately from certified role history:
- roundPriceDistanceTicks;
- relativeTick;
- detectorProminence;
- localExtremumRank;
- anchorVolumeRel;
- anchorRangeRel;
- 52-week / historical-high proximity when provided under a canonical research owner;
- simple range/channel boundary salience;
- price-level clustering receipt if available.

No scalar SALIENCE_SCORE is defined.

Behavioral labels such as "anchoring" are not inferred from price alone.

## 9. Breakout momentum / displacement controls

At breakout confirmation store only causal state available then:
- breakoutExcessPrice;
- breakoutExcessAtr;
- breakoutExcessTicks;
- breakoutDirection;
- breakout lifecycle / acceptance state;
- breakout volume / volatility / liquidity receipts from owners.

Do not use future peak displacement in the E1 baseline model.

For E2, post-break path to the retest may be stored, but its mediator status must remain explicit.

## 10. Retest arrival as a selection process

If former-role candidates are more likely to be revisited, or revisited sooner, then the E2 sample composition differs by role history.

Therefore future reporting must include for S0 and S1:
- eligible breakout cohort count;
- first-retest arrival rate;
- time-to-retest distribution;
- cancellation rate;
- right-censoring rate;
- constraint/data-block rate.

A strong E2 response difference with very different E1 arrival processes is not a clean unconditional polarity conclusion.

## 11. Right censoring and competing events

No-retest by study end:
RIGHT_CENSORED_NO_RETEST.

Breakout reclaimed / structural market invalidation before test:
CANCELLED_BEFORE_RETEST.

Missing provenance:
DATA_BLOCKED.

These are not the same outcome.

Do not call all of them "failed flip."

## 12. First-retest opportunity clock

The E2 predictor snapshot is frozen immediately before the first valid opposite-side interaction.

Allowed:
- pre-break context;
- post-break path observed up to that instant;
- role-episode age;
- DL-031 aging;
- DL-032 scale/regime;
- DL-033 path state.

Prohibited:
- any part of the retest response itself;
- later bars;
- later retests;
- best-retest selection.

## 13. Momentum vs salience vs former-role interpretation

Future nested logic:

I0_GENERIC:
generic salient breakout/retest baseline.

I1_PREBREAK_MATCHED:
I0 + pre-break breakout quality, volatility/liquidity/regime, salience controls.

I2_FORMER_ROLE:
I1 + certified former-role indicator / intensity.

I3_PATH_CONDITIONAL:
I2 + explicitly post-break mediator/path controls for conditional E2 interpretation.

Interpretation:

Q0_GENERIC_BREAKOUT_SUFFICIENT:
former-role history adds no value after I1.

Q1_POLARITY_INCREMENT:
former-role history remains after I1.

Q2_PATH_MEDIATED:
former-role difference weakens materially only after I3.

Q3_SALIENCE_EXPLANATION:
former-role difference disappears after non-role salience controls.

Q4_SELECTION_SENSITIVE:
E2 result is materially changed once E1 retest-arrival differences are considered.

Q5_NOT_EVALUABLE:
common support/provenance inadequate.

None proves causal memory or alpha.

## 14. Common support

Future S0/S1 inference must report overlap in PRE_BREAK_CONTEXT:
- breakout direction/quality;
- salience;
- volatility;
- liquidity;
- relative tick;
- regime;
- gap/limit constraint;
- structural age where applicable.

E2 path-conditional analysis additionally reports overlap in POST_BREAK_PRE_RETEST_PATH.

No extrapolation outside common support.

## 15. Sample identity

One breakout candidate remains one causal unit even if it contributes:
- an E1 arrival record;
- an E2 retest-response record;
- several salience descriptors;
- several path descriptors.

These do not create independent N.

## 16. Required durable fields

Per breakout cohort entry:
- parentId;
- structuralRootId / nullable for S0 where no certified root exists;
- structuralVersionId;
- roleEpisodeId;
- comparatorClass S0/S1;
- breakoutEventId;
- breakoutConfirmedAt;
- originalRole / null for S0;
- candidateRole;
- PRE_BREAK_CONTEXT receipt;
- salience receipt;
- D02 receipt;
- volatility/liquidity/regime receipts;
- constraint receipt;
- firstRetestArrivalState;
- firstRetestOpportunityAt if later observed;
- censor/cancel reason;
- POST_BREAK_PRE_RETEST_PATH receipt if E2 becomes eligible;
- mediatorFlag for each post-break descriptor;
- manifestVersion/hash.

No response outcome field belongs in this research manifest.

## 17. Current decision

RETEST_ARRIVAL_EQUALS_RETEST_RESPONSE =
FALSE.

CONDITION_ON_RETEST_WITHOUT_SELECTION_REPORT =
PROHIBITED.

POST_BREAK_PATH_AS_BASELINE_CONFOUNDER =
PROHIBITED.

SALIENCE_MATCH_REQUIRED =
TRUE.

RANDOM_BREAKOUT_LINE_AS_PRIMARY_CONTROL =
REJECTED.

FORMER_ROLE_HISTORY_INCREMENTALITY_REQUIRED =
TRUE.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 18. Exact next continuation

1. Build deterministic E1 arrival-cohort / E2 first-retest snapshot helpers and adversarial tests.
2. Freeze S0 salient-non-role vs S1 certified-former-role comparator semantics.
3. Mark post-break/pre-retest descriptors explicitly as mediators/selection variables.
4. Hand total-vs-path-conditional estimands plus retest-arrival selection handling to D16.
5. Execute DL-022..DL-035 research Node tests only through a reproducible approved research-test path.
6. Next D01 science: distinguish inherited old-role polarity memory from NEW post-break structure formed after the crossing near the same price zone.
7. No outcome join / no runtime wiring / no Formal change.
