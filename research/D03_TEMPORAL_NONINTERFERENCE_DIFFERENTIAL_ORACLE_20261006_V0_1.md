# D03 Temporal Non-Interference Differential Oracle V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Parent contracts: TI-979~1022
Status: RESEARCH_ONLY / OUTCOME_CLOSED / TEMPORAL_NONINTERFERENCE_ORACLE_FROZEN
Formal Core: LOCKED

## Purpose

Detect hidden look-ahead channels that are not visible from one feature timestamp alone.

Core two-run property:

For a fixed decision epoch T, construct two worlds A and B that are identical for all information legally available by T and may differ arbitrarily only in information available after T.

A valid D03 decision-time computation must satisfy:

`OUTPUT_A(T) == OUTPUT_B(T)`.

If changing only future information changes the past decision output:
`TEMPORAL_NONINTERFERENCE_FAIL`.

## TI-1023 — the two-run agreement property

Freeze decision epoch T.

World A and World B must agree on the complete authorized information set available by T.

World B may alter:
- future bars;
- future outcomes;
- future corporate actions;
- future corrections/revisions;
- future universe membership;
- future regime labels;
- future source versions;
- future calendar observations not yet known.

Required invariant:
all decision-time outputs at T are identical.

## TI-1024 — compare semantic output, not only final score

The two-run comparison includes, as applicable:
- eligibility/admission;
- factor values;
- finality state;
- constraint state;
- factorVersion;
- continuity space;
- signalKnownAt;
- timing receipt;
- feature lineage;
- dedup family;
- research rank/selection state;
- reason codes.

A stable final score with changed intermediate eligibility is not a pass.

## TI-1025 — future outcome perturbation must never affect feature construction

Change all D5/D10/D20 outcomes after T while keeping the legal predictor information set fixed.

Expected:
- predictor/factor state at T unchanged;
- admission at T unchanged;
- timing receipt unchanged;
- candidate identity unchanged.

If any changes:
`OUTCOME_TO_FEATURE_LEAKAGE`.

## TI-1026 — future price-path perturbation must not change past recursive state

For recursive indicators:
- EMA;
- RSI;
- KD smoothing;
- MACD;
- ADX;

alter bars strictly after T.

State at T must remain exact.

This catches implementations that compute on full history and later slice the result using a non-causal transform.

## TI-1027 — future rolling-window values must not change past finite-window state

For:
- SMA;
- Bollinger;
- rolling returns;
- range oscillators;

future observations outside the T-prefix cannot affect the T-value.

Any implementation using centered rolling windows or future-aware smoothing fails.

## TI-1028 — full-sample normalization is forbidden for decision-time factors

Transformations such as:
- z-score using full-sample mean/std;
- min/max scaling using future extrema;
- percentile/rank using future dates;
- PCA/basis fit on the complete sample;

can alter a historical feature when future data changes.

Promotion-grade preprocessing must be:
- fixed ex ante; or
- fit only on the causal training prefix;
- versioned by training cutoff.

## TI-1029 — cross-sectional normalization is date-clock specific

A same-date cross-sectional rank or z-score may use other symbols only if those same-date inputs were legally available by the decision cutoff.

Post-close daily cross-section for next-session research can be valid.

Using full-day values for an intraday decision before the daily cross-section is complete is not valid.

The two-run test perturbs unavailable same-day later observations to expose this leak.

## TI-1030 — future universe membership cannot rewrite past eligibility

Changing a symbol's future:
- delisting;
- suspension history after T;
- index membership after T;
- market-cap rank after T;
- survival state

must not change whether it existed/qualified at T unless the qualifying rule legitimately used information already known by T.

Using today's survivors to reconstruct old candidate universes fails.

## TI-1031 — future corporate actions cannot silently rewrite the past decision space

A vendor may provide a fully adjusted historical series today using corporate actions that occurred after historical decision T.

For a PIT research claim, altering post-T corporate actions must not alter the historical decision input unless the historical semantic space explicitly and causally supported that adjustment at T.

Required:
- continuity/source-version identity;
- adjustment-space version;
- as-of availability.

Otherwise:
`FUTURE_CORPORATE_ACTION_REWRITE`.

## TI-1032 — later source corrections cannot overwrite earlier observed versions

World B may alter a correction first available after T.

Historical T decision must retain the version known at T.

An as-of query that always returns the latest final row fails this oracle.

## TI-1033 — future calendar knowledge cannot backfill earlier completion

Later-discovered calendar/session corrections cannot make an earlier weekly/M15 state look completed unless that calendar information was already available at T.

Historical completion state is versioned by the calendar known at the decision.

## TI-1034 — cache contamination is a first-class leak channel

A stateful runtime can leak future data even if query predicates are correct.

Differential test:
1. load only prefix-through-T and compute output;
2. load data through T+K, then query T;
3. compare exact semantic output.

If step 2 differs:
`FUTURE_CACHE_STATE_CONTAMINATION`.

## TI-1035 — model training cutoff is part of the decision information set

A fitted model/basis/normalizer used at T must bind:
- trainingCutoff;
- training data hash;
- preprocessing version;
- hyperparameter-selection cutoff.

Retraining with post-T observations and then scoring historical T is not a causal replay.

## TI-1036 — hyperparameter search cannot see future validation outcomes

Future outcomes cannot determine:
- lag count;
- indicator threshold;
- spline basis;
- regularization;
- feature subset;
- stopping rule

for a historical T replay.

Two-run perturbation of future labels must not change historical model identity.

## TI-1037 — future regime labels are forbidden unless causally observable

A regime label computed retrospectively from a window extending beyond T is not a decision-time control.

If future price changes can alter Regime(T), then Regime(T) is retrospective.

D18 controls consumed by D03 must expose firstObservableAt/availability semantics.

## TI-1038 — future pivot confirmation cannot rewrite divergence at the pivot date

Perturb future bars so a later pivot confirmation changes or disappears.

Past divergence state at the pivot extremum date must remain absent before confirmation.

The first legal divergence state exists only at firstObservableAt.

## TI-1039 — incomplete higher-timeframe bars are tested by future completion perturbation

At a Wednesday decision:
- alter Thursday/Friday data;
- Wednesday completed-week state must not change because it must not exist;
- Wednesday PARTIAL_ASOF state may exist but cannot be labeled final.

At an intraday M15 cutoff:
- alter the unfinished bar remainder;
- prior completed bars remain stable;
- unfinished-bar final state must not be exposed.

## TI-1040 — provisional live states are allowed to change only after their as-of

For a provisional state captured at t0:
- world A/B agree through t0;
- future same-session data after t0 may change later provisional/final states;
- the frozen t0 snapshot itself must remain identical.

This preserves legitimate live evolution without retroactive mutation.

## TI-1041 — output comparison requires deterministic randomness control

If a research method uses randomness:
- same pre-T inputs;
- same seed/RNG version;
- same training prefix

must produce the same T output.

Randomness differences cannot mask future dependence.

The receipt records randomSeedLedgerHash where applicable.

## TI-1042 — failure localization is mandatory

On a two-run mismatch, report the earliest differing layer:
- source/as-of read;
- continuity adjustment;
- indicator computation;
- cross-sectional transform;
- model/preprocessing;
- admission;
- ranking;
- consumer.

Do not report only "hash mismatch".

## TI-1043 — future sentinel acceptance is sufficient to block the timing path

If any explicitly future-only sentinel reaches:
- factor input;
- ranking;
- selection;
- signal;
- strategy outcome calculation as predictor;

then:
`TEMPORAL_NONINTERFERENCE_FAIL`.

No amount of OOS performance can repair a known look-ahead leak on the same evidence version.

## TI-1044 — passing finite sentinels is not proof of universal leak-freedom

A two-run oracle can falsify look-ahead freedom when it finds a dependency.

Passing registered perturbations proves only those tested channels did not change the output.

Therefore:
`PASS = REGISTERED_CHANNELS_CLEAR`
not:
`PASS = NO_POSSIBLE_LEAK_EXISTS`.

## TI-1045 — consumer-ready temporal-noninterference receipt

Required:
- receiptVersion;
- decisionEpoch;
- decisionClockVersion;
- authorizedInformationSetHash;
- worldAPrefixHash;
- worldBPrefixHash;
- futurePerturbationFamilyId/version;
- outputSemanticHashA/B;
- earliestDifferenceLayer;
- factorVersion;
- source/continuity/calendar versions;
- model/preprocessing/trainingCutoff identity where applicable;
- terminalState.

## TI-1046 — current decision

Frozen:
`TEMPORAL_NONINTERFERENCE = TWO_RUN_FUTURE_PERTURBATION_AGREEMENT`.

Allowed terminal states:
- REGISTERED_CHANNELS_CLEAR;
- TEMPORAL_NONINTERFERENCE_FAIL;
- OUTCOME_TO_FEATURE_LEAKAGE;
- FUTURE_CACHE_STATE_CONTAMINATION;
- FUTURE_CORPORATE_ACTION_REWRITE;
- FUTURE_VERSION_REWRITE;
- FUTURE_UNIVERSE_SURVIVORSHIP_LEAK;
- FUTURE_NORMALIZATION_LEAK;
- FUTURE_REGIME_LABEL_LEAK;
- FINALITY_BACKFILL_LEAK;
- NONDETERMINISTIC_REPLAY_UNRESOLVED;
- VERSION_INCOMPATIBLE.

No outcomes opened.
No maturity promotion.
Formal Core remains LOCKED.

## Exact next continuation point

1. Freeze machine two-run perturbation schema and deterministic fixtures.
2. Add D03 factor-specific perturbation families for finite-window, recursive, episode, divergence and multi-timeframe states.
3. Then audit lag-memory / temporal-aggregation confounding before interpreting any lag peak as a market delay.
