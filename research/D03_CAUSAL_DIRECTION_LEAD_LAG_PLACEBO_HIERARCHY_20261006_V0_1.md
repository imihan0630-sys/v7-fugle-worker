# D03 Causal-Direction / Lead-Lag Placebo Hierarchy V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Scope: D03 technical-indicator timing / interaction falsification
Status: RESEARCH_ONLY / OUTCOME_CLOSED / TIMING_PLACEBO_HIERARCHY_FROZEN
Formal Core: LOCKED

## Purpose

Freeze a timing-placebo hierarchy that distinguishes:
1. genuinely predictive information observable at the decision clock;
2. contemporaneous association;
3. stale-state persistence;
4. reverse-direction association;
5. future-state leakage.

The contract does not claim that a technical indicator causes future returns. It defines what must be rejected before a predictive interpretation can be considered.

## TI-979 — predictive ordering is a hard clock invariant

For a candidate signal X and future endpoint Y:

signalKnownAt <= decisionCutoff < endpointWindowStart <= endpointKnownAt.

Any feature state finalized after decisionCutoff is unavailable, even if its bar label carries the decision date.

## TI-980 — contemporaneous association is not prediction

An indicator computed from the same close/high/low path as current return can correlate with that return by construction.

Same-session association may be retained for description or mechanism diagnostics, but contributes zero predictive evidence unless the indicator was fully observable before the tradable decision cutoff and the endpoint begins afterward.

## TI-981 — lead-lag ladder

Every timing claim must register a finite offset family before outcomes:
- stale lags: X(t-k);
- decision-time signal: X(t);
- illegal future leads: X(t+k);
- contemporaneous endpoint;
- forward endpoints D5/D10/D20 where already authorized.

The offset family belongs to the same multiple-testing family. Selecting the best offset after outcomes is prohibited.

## TI-982 — future-lead placebo is a leakage sentinel only

A future signal X(t+k) may be evaluated offline only as a leakage diagnostic.

It can never:
- become a candidate feature;
- contribute an evidence unit;
- set a threshold;
- select a model;
- repair a weak decision-time signal.

If future leads materially outperform valid decision-time signals, classify FUTURE_STATE_LEAKAGE_SUSPECTED or TIMING_IDENTITY_UNRESOLVED until explained.

## TI-983 — reverse-time endpoint placebo

Past/pre-decision returns or already-realized path states can be used as negative-control endpoints to detect mechanical ancestry, selection on trend and reverse interpretation.

A strong association with already-realized outcomes does not prove future prediction. If both past and future associations are similar, the result may be persistence, path encoding or regime selection rather than incremental forecasting.

## TI-984 — directionality requires direct-price ancestry controls

All D03 signals inherit price-path information. Lead-lag analysis must control:
- direct returns at matching lookbacks;
- price-vs-MA / slope / trend persistence where applicable;
- D01 price structure;
- D04 range/volatility for Bollinger/ADX;
- D18 Regime;
- current System 1/System 2 overlapping factor families.

If the indicator adds no value beyond these controls, state REDUNDANT_WITH_ANCESTRY, not BAD.

## TI-985 — endpoint windows and overlapping-label purge

D5/D10/D20 endpoints overlap across nearby decision dates. Split, purge and embargo must cover the maximum forward endpoint plus any feature lookback/confirmation footprint required by D16.

Row-level random split and unpurged walk-forward are invalid.

## TI-986 — common support across offsets

All registered offsets and baselines must be compared on the same eligible symbol-date population unless a preregistered estimand explicitly says otherwise.

Dropping difficult dates only for one offset, allowing future leads more complete coverage, or imputing missing lag states asymmetrically invalidates the ladder.

## TI-987 — dependence-preserving placebo generation

Timing displacement must preserve, as required by the declared null:
- official trading-session calendar;
- date common shocks;
- sector/regime composition;
- repeated-symbol and episode structure;
- limit/suspension/corporate-action continuity;
- timeframe finality and featureKnownAt semantics.

Naive row permutation or calendar-day shifting across non-trading days is rejected.

## TI-988 — multi-timeframe clock hierarchy

Weekly, Daily and M15 states retain separate finality clocks.

Required interaction clock:
max(all component firstObservableAt).

An incomplete weekly bar or closing M15 state cannot be backdated into an earlier daily decision. Repaint-safe pivot/divergence confirmation remains bound to confirmedAt.

## TI-989 — stale-signal persistence is not an independent source

If X(t-k), X(t) and X(t+k) describe the same indicator family, offset variants remain one parameter/timing family.

Stable performance across reasonable stale lags may support robustness, but does not create multiple evidence votes.

## TI-990 — lead-lag symmetry is a falsifier

If predictive strength is symmetric before and after the decision clock, plausible explanations include smoothing persistence, temporal aggregation, shared trends or time-label errors.

Allowed blocking states:
- LEAD_LAG_SYMMETRY_UNRESOLVED;
- TEMPORAL_AGGREGATION_CONFOUND;
- CLOCK_IDENTITY_INCOMPATIBLE.

## TI-991 — causal language remains restricted

Passing the timing hierarchy supports only PIT-valid predictive incrementality.

It does not identify a structural causal mechanism unless additional assumptions, interventions or credible identification are provided by D16/other owners.

Allowed wording:
- predictive;
- incremental conditional association;
- timing-consistent.

Forbidden from D03 timing tests alone:
- causes;
- treatment effect;
- structural causal effect.

## TI-992 — state-dependent timing claims

Regime, volatility and liquidity slices must be preregistered. A signal cannot be called predictive because one ex-post market-state slice works.

State interactions consume the same research stream / multiplicity budget and require adequate independent dates in every claimed cell.

## TI-993 — cost and fillability clock

Tradable evaluation begins at the first executable price after signalKnownAt, not at the price used to finish the indicator.

Costs, limit constraints, suspension, opening gaps and available liquidity must follow that executable clock. Same-close fills are forbidden when the close completed the signal.

## TI-994 — selection pipeline timing replay

If candidate, horizon, offset, threshold or subgroup was selected, every null/placebo replay must reproduce the full frozen selection pipeline. Testing only the observed winning offset is invalid.

## TI-995 — indicator-specific applications

Bollinger:
- same-close %B/touch association is contemporaneous unless known before execution;
- future band/touch state is a leakage sentinel;
- valid path surrogate recomputes all descendants.

ADX:
- ADX(t) requires canonical Wilder state available by cutoff;
- high ADX cannot be backfilled from later convergence;
- future ADX slope/crossover is a leakage sentinel.

KD/RSI/MACD:
- crossover/state finalized on the close cannot receive that close as an executable fill;
- siblings and direct-return controls remain mandatory.

Divergence:
- clock is confirmedAt, not pivot extremum date;
- using later-confirmed pivots at the extremum date is repaint leakage.

Multi-timeframe:
- interaction clock is the latest component finality.

## TI-996 — terminal-state vocabulary

Allowed states:
- TIMING_METHOD_READY;
- CONTEMPORANEOUS_ONLY;
- REDUNDANT_WITH_ANCESTRY;
- FUTURE_STATE_LEAKAGE_SUSPECTED;
- LEAD_LAG_SYMMETRY_UNRESOLVED;
- TEMPORAL_AGGREGATION_CONFOUND;
- CLOCK_IDENTITY_INCOMPATIBLE;
- COMMON_SUPPORT_INSUFFICIENT;
- POWER_INSUFFICIENT;
- DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE;
- COST_OR_FILLABILITY_INVALIDATES;
- VERSION_INCOMPATIBLE.

Blocking states are valid scientific results and do not authorize retuning.

## TI-997 — minimum machine receipt

Required fields:
- signalFactorId/version;
- signalKnownAtRule;
- decisionCutoffRule;
- executionClockRule;
- endpoint family/windows;
- offset family;
- ancestry-baseline hash;
- common-support hash;
- purge/embargo rule;
- dependence method;
- multipleTestingFamilyId;
- researchStreamId;
- selectionPipelineHash;
- cost/fillability contract hash;
- terminal state.

## TI-998 — adversarial oracle

The deterministic fixture covers:
- valid PIT ordering;
- same-close contemporaneous-only case;
- future signal used as feature;
- future signal used only as leakage sentinel;
- reverse-time association overclaim;
- offset cherry-pick;
- common-support mismatch;
- random split;
- insufficient purge;
- calendar-day shift;
- multi-timeframe premature finality;
- divergence pivot backdating;
- same-close fill;
- missing ancestry controls;
- lead-lag symmetry;
- valid blocking state.

## TI-999 — support and counterevidence

Support: a genuine forecasting signal must be available before the outcome and before executable entry. Timing placebos can expose mechanical ancestry and leakage.

Counterevidence: smoothing and persistent regimes may create similar lead/lag patterns even without explicit leakage; therefore symmetry is a blocker, not automatic proof of fraud.

Alternative explanations:
- price-path persistence;
- time aggregation;
- common market shocks;
- uneven support;
- delayed publication/finality;
- cost/fill timing.

## TI-1000 — current decision and routing

Frozen:
TIMING_EVIDENCE = PIT_ORDERING_PLUS_DEPENDENCE_PRESERVING_LEAD_LAG_PLACEBO_HIERARCHY.

No outcomes were opened. No current D03 factor was promoted or demoted.

No promotion:
- D03 remains 56.7%;
- D03-09 and D03-10 remain L2/40;
- raw gate remains 2/3;
- FORMAL_OPTIMIZATION_CANDIDATE = NONE;
- Formal Core remains LOCKED.

## Exact next continuation point

1. Execute the deterministic timing oracle and store a version-pinned receipt.
2. D16 must bind any future D03 timing receipt to TI-749~1000.
3. Re-read System1/System2 implementation lanes before further semantic expansion.
4. Actual maturity gain still requires genuine prospective/raw-source or external machine evidence.

