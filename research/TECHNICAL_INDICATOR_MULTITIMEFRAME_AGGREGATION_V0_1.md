# Technical Indicator Multi-Timeframe / Temporal Aggregation Audit V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / TIMEFRAME_DEPENDENCE_SPEC
Formal Core: LOCKED

## Purpose

The system uses weekly, daily, 15-minute and sometimes 5-minute context.

A common technical-analysis mistake is to treat agreement across timeframes as independent confirmation.

This tranche freezes a causal and statistical firewall for multi-timeframe technical evidence.

## TI-201 — Different timeframes are not independent data sources

Weekly, daily and intraday bars are aggregations of the same underlying transaction path.

Therefore:
- daily RSI and weekly RSI are not independent market observations;
- daily breakout and weekly breakout can share the same price move;
- 15m strength and daily strong close can be two views of the same session;
- a 5-day return and one weekly return can be near-duplicates depending on calendar alignment.

Timeframe diversity can still add useful horizon structure.
It does not automatically create independent evidence.

## TI-202 — Timeframe meaning depends on bar construction

Changing bar interval changes:
- sample endpoints;
- high/low extrema;
- gap handling;
- volume aggregation;
- number of observations inside each indicator lookback;
- effective memory measured in real time.

Example:
RSI14 on 15-minute bars is not "the same RSI14 but faster" in a simple sense.
It summarizes roughly 14 completed 15-minute observations, not 14 trading days.

A named parameter without timeframe is therefore incomplete provenance.

Required identity:
indicatorId + formulaVersion + timeframe + sessionRule + lookback.

## TI-203 — Cross-timeframe horizon equivalence must be explicit

A 20-bar indicator means different real-time horizons:
- 20 daily bars ~ one trading month;
- 20 weekly bars ~ several months;
- 20 15m bars ~ a fraction of several sessions.

Conversely, different bar counts can describe similar real-time horizons.

Research should compare both:
1. same bar-count / different clock horizon;
2. approximately same clock horizon / different aggregation.

This prevents attributing a difference to "timeframe" when it is actually just different effective memory.

## TI-204 — Partial higher-timeframe bars are distinct states

At Wednesday close, the current weekly bar is incomplete.

A weekly indicator using the still-forming week can be causally available if computed from data observed so far, but its semantics differ from an indicator defined on completed weekly bars.

Required state:
- COMPLETED_HIGHER_TIMEFRAME_BAR;
- PARTIAL_ASOF_HIGHER_TIMEFRAME_BAR.

Do not compare or pool them silently.

For decision-time reproducibility:
- weeklyCompletedThrough;
- weeklyPartialAsOf;
- aggregationRule;
- marketSessionCalendar
must be explicit.

## TI-205 — Multi-timeframe confluence is hierarchy, not vote counting

Preferred role hierarchy already matches Pattern research:

Weekly:
- major trend;
- major structural resistance/support;
- long-base context.

Daily:
- selection;
- principal setup / pattern lifecycle.

15-minute:
- transition / acceptance / execution confirmation.

5-minute:
- execution detail / early observation where strategy allows.

Therefore:
weekly bullish + daily bullish + 15m bullish != three bullish votes.

It is:
- higher-horizon context;
- decision-horizon setup;
- execution-horizon state.

The proper question is whether the lower timeframe confirms, conflicts with, or remains unresolved relative to the higher-timeframe thesis.

## TI-206 — Cross-timeframe redundancy classes

### Type A — SAME_EVENT_DUPLICATE
Example:
daily close breaks prior high, and the last 15m bar is above the same prior high.
Potentially one breakout event described twice.

### Type B — NESTED_HORIZON
Example:
ret5 and weekly return over nearly the same trading dates.

### Type C — SHARED_COMPONENT
Example:
daily strong close partly caused by the same final 15m bar used as a separate bullish signal.

### Type D — DISTINCT_HORIZON_CONTEXT
Example:
weekly major resistance remains overhead while daily structure breaks a local 20-day pivot.
Potentially genuinely different structural scale.

### Type E — DISTINCT_SESSION_INFORMATION
Example:
overnight gap context versus intraday acceptance.
Potentially different information origin.

Only Type D/E begin with a plausible incremental-information prior.

## TI-207 — Overlapping-window inference hazard

Using many overlapping lookback windows or overlapping horizon returns can mechanically increase dependence.

Recent 2026 momentum research shows overlapping return construction can materially inflate measured time-series momentum strength by accumulating autocorrelation.

Implication for this project:
- 5/10/20/60-day indicator rows on the same date are not four independent samples;
- daily observations on adjacent dates with 20-day overlapping windows are highly dependent;
- multi-timeframe indicators sharing underlying bars cannot inflate effective sample size.

Primary inference remains clustered by independent scan date / episode as already required.

## TI-208 — Bar-boundary sensitivity

Technical states can change when the same underlying trades are partitioned into different bars.

Examples:
- one 30m bar can hide a 15m breakout then rejection;
- daily OHLC cannot reconstruct exact intraday path;
- 5m noise can create multiple oscillator crosses that disappear at 15m;
- volume seasonality changes with slot definition.

Therefore a timeframe signal is partly a statement about the chosen aggregation operator.

V0.1 firewall:
- no post-outcome optimization of bar size;
- 15m primary / 10m auxiliary roles remain fixed where already frozen;
- 5m cannot be promoted because it finds more signals.

## TI-209 — Frozen multi-timeframe evidence object

Future research object per symbol / decision timestamp should distinguish:

- higherTimeframeContext{};
- decisionTimeframeSetup{};
- executionTimeframeState{};
- sharedEventIds[];
- overlapClass;
- barCompletionState;
- effectiveClockHorizon;
- sourceBarsThrough;
- asOf;
- availableAt;
- sessionCalendarVersion;
- continuityState.

Cross-timeframe agreement should be represented as:
- ALIGNED;
- MIXED;
- CONFLICT;
- UNKNOWN;

not as a numeric count by default.

## TI-210 — Multi-timeframe incremental-value test

Future question:
Does weekly context add information beyond daily long-horizon structural fields already available?

Mandatory controls:
- priorHigh60/majorStructuralHigh;
- MA60/120 where available;
- daily Pattern major-zone state;
- ret60;
- sector/regime;
- liquidity;
- current daily setup quality.

If weekly state adds no residual value after equivalent daily long-horizon geometry, keep it for explanation/context only.

For 15m:
Does intraday state add execution information beyond the frozen daily setup?
This is a different question from selection alpha and should use entry/false-break/MAE/opportunity-cost outcomes.

## Current status

MULTI_TIMEFRAME_V0_1 = FROZEN
TIMEFRAME_AGREEMENT = HIERARCHICAL_CONTEXT_NOT_VOTE_COUNT
OVERLAPPING_SAMPLE_INFLATION = EXPLICIT_GUARD
PARTIAL_HIGHER_TIMEFRAME = DISTINCT_CAUSAL_STATE
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Add timeframe/effective-horizon provenance to the semantic evidence identity.
2. Add overlapClass/sharedEventIds to future cross-timeframe research contracts.
3. Do not create a "3 timeframe bullish" score.
4. Weekly incremental research must first beat equivalent daily long-horizon structural controls.
5. Intraday incremental research remains execution/acceptance focused, not an extra daily selection vote.
6. Do not optimize timeframe/bar size after outcomes.
7. Formal Core remains unchanged.

## Evidence anchors

- Ahn, Hambusch & Hong (2026), JRFM: overlapping return windows can inflate measured time-series momentum strength through accumulated autocorrelation.
- Long-horizon predictive-return literature documents inference problems from overlapping horizons/dependence.
- Intraday periodicity literature shows that temporal aggregation and time-of-day structure can materially affect measured volatility/serial dependence.
- Current project Pattern/Price-Volume research already freezes daily=context/selection and 15m=transition/resolution roles; this tranche formalizes the anti-double-counting consequence.
