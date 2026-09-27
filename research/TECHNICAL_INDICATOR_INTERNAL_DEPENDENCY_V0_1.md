# Technical Indicator Internal Dependency Governance V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / ANTI_DOUBLE_COUNTING_GOVERNANCE
Formal Core: LOCKED

## Purpose
Prevent a second Factor Zoo from reappearing inside each indicator.

Even after named-indicator pruning, one indicator can generate many labels:
- level;
- zone;
- threshold crossing;
- signal-line crossing;
- slope;
- acceleration;
- persistence;
- divergence;
- failure swing.

These are usually deterministic or path-derived transforms of the same parent series.

They are not independent votes by default.

## TI-072 — Continuous value and zone label are the same information hierarchy

Example RSI:
- rsiValue = 72;
- rsiZone = OVERBOUGHT if threshold is 70.

rsiZone is a deterministic quantization of rsiValue.

Therefore:
- RSI value + RSI overbought state cannot count as two independent confirmations.
- Changing the threshold changes event frequency, not the underlying source data.

Same rule applies to:
- KD zone;
- ADX strength label;
- Bollinger squeeze percentile state;
- Aroon threshold labels;
- any overbought/oversold bucket.

### Rule
Continuous value is the parent.
Zone/threshold state is a derived interpretation.

## TI-073 — Crossovers and slopes are path events, not new source families

Example MACD:
- histogram = DIF - signal;
- bullish MACD crossover occurs when histogram changes sign from <=0 to >0;
- histogram slope is histogram_t - histogram_(t-1).

These are different path descriptors but all derive from DIF/signal history.

They may have different TIMING value.
They do not represent independent information sources.

Required future design:
If a crossover is studied, control:
- current level;
- previous level;
- slope/path;
- parent trend state.

Do not score:
MACD positive + bullish crossover + histogram positive + histogram rising
as four votes.

## TI-074 — Persistence is duration of a parent state

Examples:
- RSI overbought for 5 sessions;
- KD high-level persistence;
- ADX high for 10 sessions.

Persistence may be genuinely useful because duration is path information not contained in one current value.

However:
persistence is still conditional on the parent state.

Correct research question:
Given the same current indicator level, does duration/persistence add incremental information?

Incorrect:
current high value + high-zone label + high-zone persistence = three independent bullish signals.

## TI-075 — Divergence is an interaction descriptor, not an independent family

A divergence requires:
- price swing geometry;
- indicator value at confirmed price pivots.

Therefore divergence belongs to an interaction layer:
PRICE_STRUCTURE x INDICATOR_STATE.

It cannot be counted once under Pattern and again under RSI/KD/MACD.

Primary price pivots remain owned by the Pattern swing engine.
Indicator lane samples its value at those confirmed pivots.

The divergence field may later prove useful, but its incremental test must control:
- raw price progression;
- indicator progression;
- Pattern reversal lifecycle.

## TI-076 — Signal line nesting creates filter trees, not independent evidence

Examples:
- MACD signal = EMA(DIF);
- TRIX signal = MA/EMA(TRIX);
- TSI signal = EMA(TSI);
- StochRSI smoothing = smoothing of a transform of RSI;
- Chaikin Oscillator = MACD-like filter of cumulative A/D.

Every added signal line creates another transformation of existing data.
It may improve timing/noise reduction, but it does not create a new evidence family.

### Rule
Nested filtering is evaluated as a model/representation alternative.

It cannot increase cross-family confluence count.

## TI-077 — Threshold search is hidden multiple testing

Suppose the same RSI history is tested at:
- 20/80;
- 25/75;
- 30/70;
- 35/65;
plus crossings, persistence durations and divergence tolerances.

This is a large hypothesis grid even though all fields are called "RSI".

Therefore multiple-testing governance applies WITHIN an indicator, not only across indicator names.

Baseline rule:
- freeze canonical/reference formula first;
- continuous variables first;
- no threshold optimization before stable residual evidence;
- later threshold/bucket design must be preregistered.

## TI-078 — Hierarchical aggregation design

Evidence hierarchy:

### Level 0 — Source
OHLCV / market/session/corporate-action semantics.

### Level 1 — Primitive transform
Examples:
- RSI value;
- K and D;
- DIF and signal;
- +DI/-DI/ADX;
- BB width/%B;
- daysSinceHigh20/daysSinceLow20.

### Level 2 — Derived path/event state
Examples:
- zone;
- slope;
- crossover;
- persistence;
- expansion/contraction.

### Level 3 — Interaction
Examples:
- divergence versus price pivots;
- indicator state at breakout/retest;
- indicator state x regime.

### Level 4 — Strategy consumption
SUPPORTIVE / WARNING / CONTEXT / REQUIRED only if strategy evidence later justifies it.

Cross-family confluence can occur only after within-family dependence is resolved.

## TI-079 — Recommended first residualization sequence

For each indicator:
1. fit/control the continuous primitive;
2. ask whether slope/path adds value;
3. ask whether persistence adds value conditional on level;
4. ask whether crossover adds value conditional on level/path;
5. ask whether divergence adds value conditional on price geometry + indicator progression;
6. only then consider strategy weighting.

This prevents a derived event from being mistaken for independent alpha.

## Machine-readable artifact

research/technical_indicator_field_dependency_graph_v0_1.json

The graph explicitly records parent/derived dependencies for:
- RSI;
- KD;
- MACD;
- ADX/DMI;
- Bollinger;
- EXTREME_RECENCY_20.

It can later be extended to additional families without changing Formal behavior.

## Current status

INTRA_INDICATOR_DOUBLE_COUNTING = GOVERNANCE_RULE_FROZEN

MULTI_INDICATOR_MAJORITY_VOTING = REJECTED_AS_DEFAULT

EXTREME_RECENCY_20 = SPEC_FROZEN / WORTH_FALSIFICATION

FORMAL_OPTIMIZATION_CANDIDATE = NONE

Formal Core remains LOCKED.

## Exact next continuation

1. Treat the dependency graph as mandatory research metadata for any new technical field.
2. Before accepting a new indicator output, declare whether it is primitive, derived path state, interaction or strategy interpretation.
3. Reject any scoring design that gives independent weight to deterministic parent/child fields without residual evidence.
4. Reconcile System 2 confluence engine against this hierarchy before any numeric technical weighting.
5. Continue primary empirical queue unchanged.
6. Formal Core remains unchanged.
