# D04 Second-wave L3 Promotion + Priority-B B04 Specialist Return — 2026-10-04 V0.1

Updated: 2026-10-04 Asia/Taipei
Room: 04｜波動與市場微結構研究室
Status: OUTCOME_BLIND_L3_FEASIBILITY_AUDIT / B04_SPECIALIST_RETURN_COMPLETE
Formal Core impact: NONE
OOS / Shadow claim: NONE

## Why this audit exists

The earlier room04 promotion audit held D04-02 / D04-05 / D04-06 at L2 because the market-side A2 TAIEX decision-clock lineage was not yet executable enough.

A newer merged shared artifact now exists:
- `system2/runtime/d18_taiex_context_v0_1.mjs`;
- `system2/tests/d18_taiex_context_v0_1.test.mjs`;
- `system2/runtime/d18_regime_transition_v0_1.mjs`;
- `system2/tests/d18_regime_transition_v0_1.test.mjs`;
- `research/D18_02_03_05_PIT_BUILDER_L3_ACCEPTANCE_20261004_V0_1.md`.

That shared evidence changes the D04 feasibility state and must be consumed rather than duplicated.

The L3 question remains only:
Can the source, clock, exact official-session support, UNKNOWN semantics and deterministic replay be constructed causally?

It does not ask whether the feature predicts returns.

---

## D04-02 RV5 / RV20 — PASS L2 -> L3

Existing D18 TAIEX context builder now proves executable feasibility for the exact D04 market-volatility primitive family.

Inputs:
- A2 official TAIEX source-probe receipt;
- source marketDate;
- source observedAt;
- source prospectiveSameDateEligible;
- exact official-session calendar receipt;
- 25-session TAIEX close history, with the final 21 rows used for 20 returns;
- decisionTimestamp.

Frozen estimator semantics:
- close-to-close SIMPLE returns;
- population standard deviation;
- realizedVol5 = population std of last 5 returns;
- realizedVol20 = population std of last 20 returns;
- volRatio5to20 = realizedVol5 / realizedVol20 only when denominator > 0;
- non-annualized.

Fail-closed conditions demonstrated by tests:
- late A2 receipt => UNKNOWN;
- future history row => rejection;
- history/calendar mismatch => UNKNOWN;
- insufficient source/calendar window => UNKNOWN;
- zero long-window dispersion => ratio remains null, not Infinity/zero imputation.

Replay:
- historyWindowHash;
- officialSessionWindowHash;
- deterministic receiptHash;
- repeated same input => identical receipt.

Semantic guard:
these are rolling close-to-close return-dispersion measures under the project's frozen naming contract, not intraday high-frequency realized variance.

Decision:
`D04-02 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / ECONOMIC_VALUE_UNKNOWN`.

No L4 promotion:
there is still no sufficient multi-date prospective Shadow/OOS efficacy evidence.

---

## D04-05 Volatility Regime State Transition — PASS L2 -> L3

D04 owns the primitive volatility-state transition.

Current executable source path:
1. build one PIT-eligible TAIEX context for prior official session;
2. build one PIT-eligible TAIEX context for current official session;
3. take volatilityDirection:
   - VOL_EXPANDING;
   - VOL_CONTRACTING;
   - VOL_EQUAL;
   - UNKNOWN when raw volatility is unavailable;
4. build a transition receipt across adjacent official sessions only.

The merged transition builder proves:
- both parent vectors must be PIT eligible;
- both must carry immutable receipt hashes;
- decision clocks must increase;
- prior/current dates must be adjacent official sessions;
- changed / unchanged / unknown are explicit;
- smoothing is not silently applied;
- retrospective relabeling is false;
- strategy/selection/capital impact is false;
- repeated same input replays to the same receipt hash.

This is sufficient for L3 source/clock/replay feasibility.

It is not L4 because:
- no volatility-transition trading policy has prospective/OOS evidence;
- no hysteresis/confirmation threshold is authorized;
- no directionality/alpha claim is made.

Decision:
`D04-05 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / TRANSITION_ALPHA_UNKNOWN`.

---

## D04-06 Market Volatility × Stock Volatility Interaction — PASS L2 -> L3

No new source family is required.

Market side:
- D04-02 / shared A2 TAIEX context builder;
- PIT-qualified marketDate;
- decisionTimestamp;
- official-session hashes;
- realizedVol5 / realizedVol20 / volatilityDirection.

Stock side:
- existing A1 official daily source family;
- exact stock marketDate;
- decision-time eligible daily history;
- stock volatility20 / ATR / range descriptors as applicable;
- TECHNICAL_CONTINUITY state;
- source/history hash.

### Common-support join contract

A valid D04-06 observation requires all:
- market.marketDate == stock.marketDate;
- market decision cutoff == stock decision cutoff or both are demonstrably available before one frozen parent cutoff;
- both parent observations PIT eligible;
- stock technical continuity not BROKEN / UNVERIFIED for the required lookback;
- both factor versions retained;
- both source/history hashes retained;
- no current TAIEX value joined to a historical stock date;
- no missing side converted to neutral/zero.

If any condition fails:
`D04_06_INTERACTION_STATE = UNKNOWN`.

### Allowed research outputs

Descriptive only:
- market volatility direction × stock volatility level/direction;
- stock volatility relative to its own prior-session baseline;
- conditional cohort labels.

Not authorized:
- universal high/low thresholds chosen from outcomes;
- scalar risk-on/off score;
- independent second vote for the same volatility primitive;
- formal sizing/gating.

Because both source families, clocks and replay lineages are already feasible and the common-support join is deterministic/fail-closed, D04-06 reaches L3.

Decision:
`D04-06 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / INTERACTION_ALPHA_UNKNOWN`.

---

# Priority-B B04 specialist return — D04-05 vs D18-11

Terminal recommendation:
`KEEP_SEPARATE / COMPONENT_TO_COMPOSITE_DEPENDENCY / SCOPE_DEDUP_ONLY`.

## Semantic ownership

D04-05:
- owns the volatility component state and its transition;
- source object = market volatility primitive;
- output = prior volatility state -> current volatility state.

D18-11:
- owns transition of the composite observable market-regime vector;
- may include trend, volatility, breadth, rotation, size leadership, activity and other validated dimensions;
- output = which dimensions changed/unchanged/unknown in the composite state.

## Shared observable

The volatilityDirection transition is shared lineage.

Rule:
D18-11 consumes the D04-05 volatility transition or equivalent shared parent receipt ONCE.
It may not recompute the same 5/20 volatility transition and treat it as a second independent regime vote.

## Unique observables

D04-05 unique:
- volatility direction;
- volatility transition identity;
- raw vol5/vol20 lineage.

D18-11 unique:
- trend transition;
- breadth transition;
- activity/concentration/size/other composite dimensions where valid;
- multi-dimension transition summary.

## Divergent-state example A

Prior:
- volatility = VOL_CONTRACTING;
- trend = UP_TREND_CONTEXT.

Current:
- volatility = VOL_EXPANDING;
- trend = UP_TREND_CONTEXT.

D04-05:
- CHANGED.

D18-11:
- composite frame reports volatility changed;
- trend unchanged;
- overall composite transition contains more than the D04 primitive.

## Divergent-state example B

Prior:
- volatility = VOL_EXPANDING;
- trend = UP_TREND_CONTEXT.

Current:
- volatility = VOL_EXPANDING;
- trend = DOWN_TREND_CONTEXT.

D04-05:
- UNCHANGED.

D18-11:
- composite frame changed because trend changed.

This falsifies strict subsumption in either direction.

## Merge decision

No merge.
No retirement.
No module count change.
No maturity transfer.

B04 status:
`KEEP_SEPARATE / COMPONENT_TO_COMPOSITE_DEPENDENCY / SHARED_VOLATILITY_PRIMITIVE_DEDUPED`.

---

# Maturity result

Previous D04:
- 520 / 1000 = 52.0%.

Promotions:
- D04-02 +20;
- D04-05 +20;
- D04-06 +20.

New D04:
- 580 / 1000 = 58.0%.

D05 unchanged:
- 720 / 1400 = 51.4286% -> 51.4%.

Room04 combined:
- (580 + 720) / 24 = 54.1667% -> 54.2%.

Held at L2:
- D04-08 only.

Reason:
volatility scaling / position sizing is a portfolio/risk policy transform. Observable volatility is not sufficient evidence that a sizing policy is PIT-valid, executable and robust. Do not promote from input-data feasibility alone.

No L4 promotion.
No Formal optimization candidate.
Formal Core remains LOCKED.
