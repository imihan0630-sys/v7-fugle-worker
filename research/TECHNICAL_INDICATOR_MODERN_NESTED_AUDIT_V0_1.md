# Technical Indicator Modern / Nested / Adaptive Audit V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / REDUNDANCY_AND_ROLE_AUDIT
Formal Core: LOCKED

## Scope

Continue the technical-indicator lane after TI-101.

This tranche audits Taiwan-common and modern/nested indicators:
- BIAS / BiasDiff;
- PSY;
- MO / Momentum variants;
- QQE;
- IFT-RSI;
- SuperTrend;
- Chandelier Exit;
- KAMA and Efficiency Ratio;
- DEMA / TEMA / HMA / reduced-lag moving averages;
- Schaff Trend Cycle.

No forward outcomes are inspected.

## TI-102 — BIAS duplicates MA-distance at matched horizon

Canonical BIAS family:
BIAS_N = 100 * (Close / MA_N - 1)

Current repository already stores:
maDistance20Pct = 100 * (Close / MA20 - 1)
maDistance60Pct = 100 * (Close / MA60 - 1)

Therefore, when:
- the same price input is used;
- the same MA type/period is used;

BIAS20 == maDistance20Pct
BIAS60 == maDistance60Pct.

This is an algebraic duplicate, not merely a correlated indicator.

Different BIAS periods are parameter variants of the same MA-distance family, not new evidence families.

### Status
BIAS_MATCHED_HORIZON = REJECTED_OR_REDUNDANT_AS_NEW_FACTOR

BiasDiff is a deterministic combination of two BIAS/MA-distance states and likewise cannot be treated as an independent family.

## TI-103 — PSY20 is exactly positiveDayRatio20

Published Taiwan/XQ PSY:
PSY_N = 100 * Count(Close_t > Close_(t-1), N) / N

Current repository positiveDayRatio20:
100 * count(positive close-to-close returns over the latest 20 returns) / valid-return count.

Under complete 20-return coverage:
PSY20 == positiveDayRatio20.

Therefore:
PSY20 is an exact duplicate of an existing research feature.

PSY12/PSY24 are same-family horizon variants.
They do not deserve a parameter sweep merely because traditional charting uses those settings.

### Status
PSY20 = REJECTED_OR_REDUNDANT_EXACT_DUPLICATE
PSY_OTHER_HORIZONS = PARAMETER_VARIANTS / NO_NEW_MECHANISM

## TI-104 — MO / RC-style indicators collapse to return geometry

Published Taiwan/XQ MO example:
MO_N = 100 * Close_t / Close_(t-N)

Then:
MO_N = 100 + retN_pct

Therefore MO is an affine transformation of the N-period percentage return.

Current ROC audit already rejected standard ROC_N as duplicate of retN.

### Status
MO = REJECTED_OR_REDUNDANT_AS_NEW_FACTOR
RC/ROC_LEVEL = REJECTED_OR_REDUNDANT

## TI-105 — IFT-RSI is a representation transform of RSI

Published modern IFT-RSI design:
1. compute RSI;
2. center/scale RSI;
3. smooth the scaled RSI with WMA;
4. apply inverse Fisher transform:
   (exp(2x)-1)/(exp(2x)+1).

The final nonlinear transform is monotonic in x.

Consequences:
- it changes scale and compresses values toward ±1;
- the WMA adds smoothing/lag;
- it can change threshold event frequency;
- it does not introduce a new underlying market-data source.

Any apparent benefit must be decomposed into:
A. RSI information;
B. smoothing/filter choice;
C. threshold/quantization effect.

### Status
IFT_RSI = NESTED_RSI_REPRESENTATION / LOW_PRIORITY_ROBUSTNESS_ONLY
INDEPENDENT_VOTE = FORBIDDEN

## TI-106 — QQE is RSI + smoothing + volatility trail

Modern QQE construction is conceptually:
1. RSI;
2. EMA-smoothed RSI;
3. absolute RSI changes;
4. additional smoothing to estimate RSI-domain volatility;
5. dynamic trailing bands/line around the smoothed RSI;
6. state/crossover logic.

Therefore QQE combines already-owned primitives:
- RSI signed-return balance;
- EMA filtering;
- volatility normalization, but in indicator space;
- path-dependent trailing state.

This may improve representation/timing, but it is not a new information family.

### Role classification
- RSI component -> TECHNICAL_INDICATOR / SIGNED_RETURN_BALANCE
- dynamic trail -> PATH_STATE / TIMING
- smoothing -> FILTER ALTERNATIVE

### Status
QQE = NESTED_RSI_PATH_STATE / REDUNDANCY_VERY_HIGH
QQE_SELECTION_VOTE = REJECTED
QQE_TIMING_ROBUSTNESS = DEFERRED

## TI-107 — SuperTrend is ATR-envelope path state, not independent selection alpha

Common SuperTrend construction:
- center around (High+Low)/2 or similar price center;
- upper/lower basic bands = center ± multiplier*ATR;
- recursive "step" rules prevent the active trailing band from moving against the prevailing state until reversal;
- trend side flips when price crosses the opposing trailing band.

Information decomposition:
- price center;
- ATR;
- trailing-stop/path state;
- price crossing path-dependent boundary.

This overlaps:
- ATR / volatility;
- support/stop geometry;
- trend state;
- trailing-stop position management.

Sideways whipsaw is a known mechanical failure mode.

### Status
SUPERTREND_SELECTION_FACTOR = REJECTED_AS_NEW_INFORMATION_FAMILY
SUPERTREND_TRAILING_STATE = POSITION_MANAGEMENT / TIMING_RESEARCH_ONLY

Any future study must compare it against current stop/REDUCE/RE-ADD/position-monitor state machines and costs.

## TI-108 — Chandelier Exit is explicit structural-high/low + ATR trailing stop

Long Chandelier:
periodHigh - ATR(period)*multiplier

Short Chandelier:
periodLow + ATR(period)*multiplier

This is directly composed from:
- rolling structural extreme;
- ATR;
- fixed multiplier.

Current system already owns rolling highs/lows, ATR, stop geometry and position-management logic.

### Status
CHANDELIER_EXIT = POSITION_MANAGEMENT_COMPARATOR_ONLY
NOT_A_SELECTION_FACTOR

Default 22/3 settings are practitioner defaults, not Taiwan-proven optimal coefficients.

## TI-109 — Reduced-lag moving averages are filter alternatives

DEMA:
DEMA = 2*EMA1 - EMA2

TEMA:
uses single-, double- and triple-smoothed EMAs to offset lag.

HMA:
combines shorter and full-period weighted/smoothed moving averages and smooths the difference over sqrt(n).

Their purpose is to trade off:
- lag;
- smoothness;
- overshoot/noise responsiveness.

They do not introduce a new economic source of information.

### Status
DEMA = MOVING_AVERAGE_FILTER_COMPARATOR
TEMA = MOVING_AVERAGE_FILTER_COMPARATOR
HMA = MOVING_AVERAGE_FILTER_COMPARATOR

They may later serve as filter-robustness checks only if direct MA-slope/trend research requires them.
They cannot be counted as independent trend factors.

## TI-110 — Schaff Trend Cycle is nested MACD + stochastic normalization

Typical STC:
1. compute fast/slow EMA difference (MACD-like line);
2. stochastic-normalize that line over a cycle window;
3. smooth;
4. apply a second stochastic normalization/smoothing stage.

Therefore STC is a nested combination of:
- filtered trend spread;
- range-location normalization;
- repeated smoothing.

It can alter timing/lag and bounded-state behavior, but no new market information is introduced.

### Hidden Factor-Zoo risk
STC adds multiple tunable dimensions:
- fast EMA;
- slow EMA;
- cycle window;
- smoothing coefficient/method;
- thresholds.

### Status
SCHAFF_TREND_CYCLE = NESTED_MACD_STOCHASTIC / REDUNDANCY_VERY_HIGH / LOW_PRIORITY
INDEPENDENT_VOTE = FORBIDDEN

## TI-111 — KAMA line is a filter; ER is the only residual primitive of interest

KAMA updates:
KAMA_t = KAMA_(t-1) + SC_t * (Price_t - KAMA_(t-1))

where SC adapts according to Efficiency Ratio (ER).

KAMA line itself remains an adaptive trend filter.
It does not create a new data source.

### Efficiency Ratio
ER_N =
abs(C_t - C_(t-N)) /
sum_{i=t-N+1..t} abs(C_i - C_(i-1))

Range approximately [0,1].

Interpretation:
- near 1: path is directionally efficient / close to monotonic;
- near 0: net displacement is small relative to path length.

This is a genuine path-shape descriptor rather than a simple endpoint return.

## TI-112 — ER overlap audit

ER is not obviously unique in the broader research architecture.

Existing related information:
- Pattern impulse/consolidation has pole path efficiency;
- trend research has positiveDayRatio20;
- persistenceScoreResearch combines positive-day ratio, positive multi-horizon returns, drawdown quality and MA quality;
- maxDrawdown20Pct;
- trendPersistence;
- returnVelocityShift5v20.

Differences:
- Pattern pole efficiency applies to a specifically anchored impulse leg, not every fixed rolling window;
- positiveDayRatio counts direction signs but ignores magnitude/path length;
- drawdown captures adverse excursion but not all zig-zag distance.

Therefore fixed-window ER is not algebraically duplicated by one existing canonical field.

But its incremental value is highly uncertain.

### Status
KAMA_LINE = FILTER_COMPARATOR_ONLY
EFFICIENCY_RATIO = DISTINCT_MECHANISM_PLAUSIBLE / REDUNDANCY_HIGH / LOW_PRIORITY_WORTH_FALSIFICATION

## TI-113 — Freeze one ER baseline only

Do not create ER5/10/20/60 grid.

Use the classic KAMA reference ER10 as the initial research baseline:
pathEfficiency10 =
abs(C_t - C_(t-10)) /
sum(last 10 eligible absolute close-to-close changes)

Zero denominator:
if all closes are equal, define pathEfficiency10 = 0 for the reference implementation and record FLAT_PATH=true.

This is descriptive only.

Required data guards:
- 11 valid eligible closes;
- symbol-session proof;
- technical continuity;
- no pseudo bars;
- corporate-action boundary resolved.

Required controls:
- ret10;
- ret5/20;
- positiveDayRatio20;
- persistenceScoreResearch;
- maxDrawdown20Pct;
- MA slope/alignment;
- Pattern pole efficiency where the same parent has an active impulse;
- volatility/ATR;
- regime.

Primary falsification:
If ER10 contributes no information after these controls, reject as redundant.

No alternative period is authorized before ER10 is falsified.

## TI-114 — Adaptive filtering must be separated from ER alpha

Even if ER10 later proves descriptive value, it does NOT follow that:
- KAMA crossovers have alpha;
- KAMA(10,2,30) parameters are optimal;
- adaptive smoothing improves the selector.

These are separate hypotheses.

KAMA uses ER to choose a smoothing rate.
The adaptive line may add lag/noise behavior that belongs to filter engineering rather than stock-selection information.

Therefore:
ER inference must precede any KAMA-line outcome study.

## TI-115 — Modern-indicator triage

### Exact/near-exact duplicates
- BIAS at matched MA horizon -> maDistancePct
- PSY20 -> positiveDayRatio20
- MO/ROC level -> retN affine/identity transform

### Nested transformations
- IFT-RSI -> smoothed RSI + monotonic nonlinear mapping
- QQE -> RSI + smoothing + RSI-volatility trailing state
- STC -> MACD + stochastic normalization + smoothing

### Filter alternatives
- KAMA line
- DEMA
- TEMA
- HMA

### Position-management constructs
- SuperTrend
- Chandelier Exit

### Residual path-quality primitive worth falsification
- pathEfficiency10 / KAMA ER10

No named modern indicator is promoted as an independent scoring factor.

## Current status

BIAS_MATCHED_HORIZON = REJECTED_OR_REDUNDANT
PSY20 = REJECTED_OR_REDUNDANT_EXACT_DUPLICATE
MO = REJECTED_OR_REDUNDANT
IFT_RSI = REPRESENTATION_ONLY
QQE = NESTED_RSI_PATH_STATE / LOW_PRIORITY
SUPERTREND = POSITION_MANAGEMENT_OR_TIMING_ONLY
CHANDELIER_EXIT = POSITION_MANAGEMENT_ONLY
DEMA_TEMA_HMA = FILTER_COMPARATORS
SCHAFF_TREND_CYCLE = NESTED_MACD_STOCHASTIC / LOW_PRIORITY
KAMA_LINE = FILTER_COMPARATOR_ONLY
PATH_EFFICIENCY_10 = SPEC_CANDIDATE / WORTH_FALSIFICATION_LOW_PRIORITY / ALPHA_UNKNOWN

FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Freeze a dedicated pathEfficiency10 spec/adversarial suite before outcomes.
2. Compare ownership against Pattern pole-path efficiency and Trend persistence; do not persist the same concept twice.
3. Extend redundancy registry:
   - BIAS -> MA_DISTANCE
   - PSY20 -> POSITIVE_DAY_RATIO20
   - MO -> RETURN
   - IFT_RSI/QQE -> RSI family
   - SuperTrend/Chandelier -> POSITION_MANAGEMENT
   - DEMA/TEMA/HMA/KAMA line -> MOVING_AVERAGE_FILTER
   - STC -> MACD_STOCHASTIC nested
   - ER10 -> PATH_EFFICIENCY residual.
4. Do not allocate primary prospective outcome budget to nested/filter variants.
5. Keep the primary empirical queue unchanged; ER10 remains after primary gates and EXTREME_RECENCY_20.
6. Formal Core unchanged.

## Evidence anchors
- XQ PSY published script: PSY = 100*CountIf(Close>Close[1],N)/N.
- XQ Bias docs: percent distance between close and moving average.
- XQ MO published script: 100*Close/Close[N].
- XQ 2026 QQE: RSI -> EMA smoothing -> RSI-domain volatility/trailing line.
- XQ 2026 IFT-RSI: RSI -> WMA -> inverse Fisher transform.
- XQ 2026 SuperTrend: price center ± ATR multiple + recursive step/trend state.
- XQ 2026 KAMA: ER = net displacement / cumulative absolute price path; adaptive smoothing constant.
- StockCharts KAMA: same ER mechanism and adaptive line.
- StockCharts Chandelier Exit: rolling high/low ± ATR multiple.
- StockCharts DEMA/TEMA/HMA: reduced-lag moving-average constructions.
- TradingView open-source STC descriptions: MACD line followed by stochastic normalization and smoothing.
