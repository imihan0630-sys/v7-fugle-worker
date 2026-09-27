# Technical Indicator Path Efficiency V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / PREREGISTERED / OUTCOME-BLIND
Formal Core: LOCKED

## Purpose

Freeze the only residual primitive retained from KAMA research before any outcome inspection:
fixed-window price-path efficiency.

This is NOT a KAMA trading-signal specification.

## TI-116 — Exact pathEfficiency10

Require 11 eligible close observations C_(t-10)..C_t.

direction10 = abs(C_t - C_(t-10))

pathLength10 =
sum from i=t-9 to t of abs(C_i - C_(i-1))

If pathLength10 > 0:
pathEfficiency10 = direction10 / pathLength10

If pathLength10 = 0:
pathEfficiency10 = 0
flatPath10 = true

Range:
0 <= pathEfficiency10 <= 1

No threshold states are frozen.

## TI-117 — Mathematical interpretation

pathEfficiency10 = 1 only when all non-zero close changes inside the window move in the same direction.

A lower value means more of the cumulative absolute movement cancels before reaching the final endpoint displacement.

Two paths can share the same ret10 but have different pathEfficiency10.

Example:
A:
100 -> 101 -> 102 -> ... -> 110
high efficiency.

B:
100 -> 105 -> 101 -> 106 -> 102 -> ... -> 110
same endpoint return can coexist with a much longer path and lower efficiency.

Therefore ER10 is not algebraically identical to ret10.

## TI-118 — But it is not automatically trend quality alpha

High path efficiency can represent:
- orderly continuation;
- price-limit constrained one-way discovery;
- one-off event repricing;
- late-stage chase;
- illiquid stair-step movement.

Low path efficiency can represent:
- noisy range;
- healthy consolidation;
- accumulation/distribution;
- high-volatility disagreement;
- mean-reverting pullback.

No universal directional sign.

## TI-119 — Ownership/redundancy map

Closest existing concepts:

Pattern:
- pole path efficiency on a specifically anchored impulse leg.

Trend:
- positiveDayRatio20;
- persistenceScoreResearch;
- multi-horizon returns;
- maxDrawdown20Pct.

Technical:
- ADX directional trend-strength;
- returnVelocityShift5v20;
- MA slope.

Difference:
pathEfficiency10 is fixed-window endpoint displacement divided by total close path length.

Owner:
TREND_QUALITY primitive, consumed by technical-indicator research only as a KAMA-derived comparator.

Do NOT duplicate it inside Pattern when an impulse leg already has polePathEfficiency.

## TI-120 — Frozen adversarial fixtures

P1 — same ret10, different zig-zag:
- identical start/end close;
- different interior path.
Expected different pathEfficiency10.

P2 — monotonic up:
expected pathEfficiency10 = 1.

P3 — monotonic down:
expected pathEfficiency10 = 1.
This proves high efficiency is directionless.

P4 — flat:
pathLength=0 -> pathEfficiency10=0 + flatPath10=true.

P5 — alternating equal-amplitude range with same endpoint:
low efficiency.

P6 — one limit-up event then flat:
can create high/moderate efficiency but interpretation CONSTRAINED/EVENT_CONTEXT, not ordinary clean trend.

P7 — verified suspension inside calendar interval:
session gap does not create an artificial zero-return bar and does not count as an eligible bar.

P8 — pseudo-bar inserted:
DATA_BLOCKED unless canonical session filtering removes it.

P9 — corporate-action reset:
DATA_BLOCKED until TECHNICAL_CONTINUITY resolves mechanical discontinuity.

P10 — same positiveDayRatio but different magnitude path:
expected potential ER difference.

## TI-121 — Required future controls

Before any outcome claim, control:
- ret10 and ret5/20/60;
- positiveDayRatio20;
- persistenceScoreResearch;
- maxDrawdown20Pct;
- MA slope/alignment;
- ADX/DMI trend-quality;
- volatility20 / ATR;
- Pattern state;
- polePathEfficiency when applicable;
- overheat/lateStage;
- liquidity;
- market/sector regime;
- limit/event constraints.

Primary null:
pathEfficiency10 adds no stable information beyond existing trend-consistency/path-quality features.

If null survives:
reject pathEfficiency10 as redundant.

## TI-122 — No parameter zoo

Only ER10/pathEfficiency10 is frozen.

Do NOT add:
- ER5;
- ER14;
- ER20;
- ER60;
- squared ER;
- EMA-smoothed ER;
- arbitrary high/low thresholds

before the baseline is falsified.

The classic KAMA 10-period ER motivates the baseline; it does not establish Taiwan optimality.

## Current status

PATH_EFFICIENCY_10 =
SPEC_FROZEN / ADVERSARIAL_FIXTURES_FROZEN / OUTCOME_UNTESTED / REDUNDANCY_HIGH / LOW_PRIORITY_WORTH_FALSIFICATION

KAMA_LINE =
FILTER_COMPARATOR_ONLY

FORMAL_OPTIMIZATION_CANDIDATE =
NONE

Formal Core remains LOCKED.

## Exact next continuation

1. No runtime wiring or production field.
2. If later implemented research-only, reuse existing eligible close history with zero new market calls.
3. Preserve direction10/pathLength10/raw ER and constraint state.
4. Do not threshold before continuous residual evidence.
5. Outcome priority remains below the primary four indicator gates and EXTREME_RECENCY_20.
6. Formal Core unchanged.
