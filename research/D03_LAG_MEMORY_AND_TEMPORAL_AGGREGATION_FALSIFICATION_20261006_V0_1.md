# D03 Lag-Memory / Temporal-Aggregation Falsification V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Parent contracts: TI-080~091, TI-979~1046
Status: RESEARCH_ONLY / OUTCOME_CLOSED / LAG_MEMORY_FALSIFICATION_FROZEN
Formal Core: LOCKED

## Purpose

Prevent a technical indicator's own smoothing/memory/aggregation from being misread as an economic transmission delay.

A peak at lag k may arise because:
- the factor is a filtered history of price;
- adjacent lag states are highly collinear;
- the data were downsampled/aggregated;
- the endpoint overlaps;
- a raw price innovation already explains the effect.

## TI-1047 — observed lag is the convolution of market dynamics and indicator memory

For a filtered factor F_t built from historical prices, a predictive association between F_t and Y_{t+h} is not automatically evidence that the market reacts after h periods.

F_t itself already represents a weighted history.

Interpretation must separate:
- raw information timing;
- factor memory;
- outcome horizon.

## TI-1048 — every lag study binds memory class

Use the existing D03 memory taxonomy:
- FINITE_WINDOW;
- RECURSIVE_IIR;
- HYBRID_FINITE_RECURSIVE;
- PATH_STATE;
- EPISODE_CONFIRMATION;
- NESTED_TIMEFRAME.

The lag receipt records memoryClass and memoryKernelVersion/state-construction version.

## TI-1049 — finite windows create overlapping lag exposure

SMA/returns/Bollinger/range-based states at t and t-1 share most underlying observations.

Therefore adjacent factor lags are not independent treatment doses.

The receipt reports:
- underlying raw-window overlap;
- effective shared eligible-session count;
- lag-to-lag correlation on common support.

## TI-1050 — recursive IIR state has long overlapping memory

EMA, RSI, MACD and ADX retain recursively smoothed history.

A one-session lag changes the weighting of many of the same primitive observations rather than replacing the information set.

No "lag 2 beats lag 1" causal timing story is allowed without memory controls.

## TI-1051 — KD is hybrid

KD combines:
- finite rolling high/low RSV memory; and
- recursive K/D smoothing.

Its lag structure must reflect both.

The factor cannot be treated as a simple 9-session finite window after the raw high/low exits.

## TI-1052 — MACD lag peaks can be filter geometry

MACD combines fast and slow EMA states and optional signal smoothing.

The resulting signed filter kernel can create delayed-looking extrema/crosses.

Any lag-peak interpretation must compare against:
- direct return/trend controls;
- EMA parent states;
- raw price innovations.

## TI-1053 — ADX lag peaks are especially non-identifiable without replay controls

ADX combines:
- TR;
- +DM/-DM;
- Wilder smoothing;
- nonlinear DI/DX;
- additional ADX smoothing.

A lag peak can reflect cascade memory and trend persistence.

D03 forbids interpreting an ADX lag peak as "market reaction delay" without D16-approved state-space/memory-aware analysis.

## TI-1054 — Bollinger has finite but overlapping center/dispersion memory

Bollinger20 location/width at adjacent dates share 19 of 20 closes under ordinary continuous eligible sessions.

A stable lag plateau may be arithmetic overlap.

The primary comparison must include:
- direct price-vs-SMA;
- direct return;
- raw/alternative volatility controls.

## TI-1055 — divergence adds confirmation lag on top of base-indicator memory

Divergence timing contains:
1. base indicator memory;
2. price pivot geometry;
3. pivot confirmation lag.

Therefore observed post-confirmation lag response cannot be interpreted without charging the confirmation delay and base-indicator memory.

## TI-1056 — multi-timeframe aggregation changes the stochastic representation

Weekly aggregation, daily bars and M15 bars are not simply the same process at different labels.

Filtering/downsampling/aggregation can alter:
- autocorrelation;
- moving-average components;
- apparent directed dependence;
- lag peak.

Any cross-timeframe direction method must be validated for the aggregated representation.

## TI-1057 — filtered/downsampled Granger direction needs method-specific validation

External methodology shows filtering/downsampling can change Granger-causal properties or induce moving-average structure.

Therefore D03 rejects:
`RUN_GENERIC_VAR_ON_FILTERED_INDICATORS_AND_CALL_CAUSAL_DELAY`.

A D16 method must explicitly justify the filtered/aggregated data model.

## TI-1058 — lag collinearity makes exact peak location unstable

Adjacent lags of smoothed indicators can be nearly collinear.

Required diagnostics:
- lag-correlation matrix;
- condition/collinearity diagnostic;
- leave-one-lag-out stability;
- peak-set or plateau width;
- neighboring-lag uncertainty.

A single largest coefficient is not an identified exact delay.

## TI-1059 — broad plateau is persistence, not precise delay

If neighboring lags have materially similar evidence:
`LAG_PROFILE = PERSISTENT_PLATEAU`.

Do not report:
"the indicator leads returns by exactly k days."

Allowed:
"predictive association is distributed across the registered lag range."

## TI-1060 — boundary peak is a blocking diagnostic

If the best lag occurs at the maximum registered lag:
`BOUNDARY_PEAK_SEARCH_INCOMPLETE`.

Do not extend the lag grid after seeing outcomes and then call the expanded peak confirmatory.

A new lag range requires new preregistration/consumption treatment.

## TI-1061 — raw-root control is mandatory

Every D03 lag profile must compare against its strongest raw/less-filtered root representation.

Examples:
- retN / raw returns;
- price-vs-MA;
- range/volatility;
- D01 structure;
- price-volume primitives where relevant.

If the filtered indicator adds no residual predictive information:
`RAW_ROOT_EXPLAINS_EFFECT`.

## TI-1062 — innovation controls distinguish new information from state persistence

Where methodologically valid, D16 should consider a registered innovation/change representation in addition to the level/state.

Examples:
- indicator delta;
- slope/change;
- residual from predictable state evolution.

The purpose is to ask whether new state information predicts future outcomes beyond persistent level.

D03 does not prescribe one universal innovation estimator.

## TI-1063 — stale-state curve and innovation curve are separate diagnostics

A state may remain predictive because it identifies a persistent regime.

An innovation may be weak.

That can be scientifically valid but implies:
`STATE_CONTEXT_PREDICTIVE_NOT_TIMING_SHOCK`
rather than precise event timing.

## TI-1064 — lag profile shares the factor's multiplicity/search family

Searching:
- lag;
- horizon;
- state vs innovation;
- smoothing version;
- threshold;
- subgroup

expands one candidate universe unless preregistered otherwise.

The lag profile cannot be optimized independently of parameter-family accounting.

## TI-1065 — outcome overlap makes neighboring lag cells more dependent

For D5/D10/D20 endpoints, nearby decision dates and lags can share outcome sessions.

A smooth heatmap does not equal many independent confirmations.

D16 must report effective independent decision-date/outcome-footprint support.

## TI-1066 — non-synchronous external controls can create false lead-lag

If sector/index/cross-market controls use different close times or stale quotes, apparent direction may reflect observation timing.

D03 timing receipts require clock-compatible external controls where such controls enter the model.

This is especially important for cross-market or overnight context; it is not assumed away by using daily labels.

## TI-1067 — sign reversal across lag requires root decomposition

A short-lag positive and long-lag negative effect may be:
- true continuation/reversal dynamics;
- filter overshoot;
- overlapping horizon mechanics;
- regime mixture;
- selected noise.

Before economic narrative:
- compare raw-root controls;
- compare endpoint overlap;
- inspect regime/date concentration;
- preserve the full sign profile.

## TI-1068 — lag profile claims contract to an interval/set, not necessarily a point

Allowed outputs:
- LAG_PROFILE_READY_POINT if a point is genuinely identifiable under preregistered criteria;
- LAG_PROFILE_READY_INTERVAL;
- PERSISTENT_PLATEAU;
- LAG_PEAK_UNIDENTIFIED;
- BOUNDARY_PEAK_SEARCH_INCOMPLETE.

Point estimates are not the default.

## TI-1069 — memory-kernel diagnostics are descriptive unless exactly identified

For simple linear smoothers, theoretical impulse-response weights may be computed.

For nonlinear/path-state factors such as ADX/divergence/pullback episodes:
- exact linear kernel interpretation is not valid;
- use replay/perturbation diagnostics instead.

Do not invent a universal "effective lag" number across all indicators.

## TI-1070 — factor-specific memory mapping

D03-01: weighted/recursive trend memory.
D03-02: finite endpoint-return horizon.
D03-03: path-persistence memory.
D03-04: outcome relation, not predictor lag.
D03-05: path-state + confirmation.
D03-06: hybrid finite-range + recursive KD.
D03-07: recursive Wilder-style RSI state.
D03-08: cascaded EMA/MACD.
D03-09: cascaded nonlinear Wilder/DMI/ADX.
D03-10: finite 20-session location/dispersion.
D03-12: base-indicator memory + pivot confirmation.
D03-13: nested aggregation/finality.

## TI-1071 — temporal aggregation is part of factorVersion

Changing:
- M5/M15/Daily/Weekly aggregation;
- close convention;
- partial/final bar semantics;
- resampling boundary

creates a timing/representation version.

It cannot be treated as a cosmetic view change.

## TI-1072 — D16 receipt additions

Future timing method receipt should expose:
- memoryClass;
- memoryKernelOrReplayVersion;
- rawRootControlHash;
- lagCandidateSetHash;
- lagCorrelationDiagnostics;
- lagPeakStability;
- temporalAggregationVersion;
- outcomeFootprintOverlapDiagnostics;
- lagProfileTerminalState.

## TI-1073 — allowed terminal states

Allowed:
- LAG_PROFILE_READY_POINT;
- LAG_PROFILE_READY_INTERVAL;
- PERSISTENT_PLATEAU;
- LAG_MEMORY_CONFOUND_UNRESOLVED;
- TEMPORAL_AGGREGATION_CONFOUND;
- LAG_PEAK_UNIDENTIFIED;
- BOUNDARY_PEAK_SEARCH_INCOMPLETE;
- RAW_ROOT_EXPLAINS_EFFECT;
- FILTER_DIRECTIONALITY_SENSITIVE;
- SUPPORT_THIN_AT_LAG;
- VERSION_INCOMPATIBLE.

Blocking states do not authorize re-smoothing or lag-range expansion after outcomes.

## TI-1074 — current decision

Frozen:
`OBSERVED_LAG = MARKET_DYNAMIC_PLUS_FACTOR_MEMORY_PLUS_AGGREGATION`.

Frozen:
`EXACT_LAG_PEAK != ECONOMIC_DELAY_UNLESS_MEMORY_AND_AGGREGATION_CONTROLLED`.

No outcomes opened.
No maturity promotion.
Formal Core remains LOCKED.

## External methodology anchors

Reviewed literature supports:
- filtering/downsampling can distort Granger-causal direction and introduce moving-average structure;
- measurement noise can induce or suppress directed dependence;
- distributed-lag estimates can be unstable under adjacent-lag collinearity and sensitive to maximum-lag choice;
- financial lead-lag patterns can also reflect asynchronous observation/trading timing.

These are method constraints only, not Taiwan-stock evidence.

## Exact next continuation point

1. Freeze machine lag-memory mapping and adversarial fixture.
2. Bind it to factor timing receipts from TI-1001~1022.
3. Then produce a D16 timing-method handoff delta covering TI-979~1074 without opening outcomes.
