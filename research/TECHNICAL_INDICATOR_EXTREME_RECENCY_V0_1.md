# Technical Indicator Structural Recency Specification V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / PREREGISTERED / OUTCOME-BLIND
Formal Core: LOCKED

## Purpose
Extract the only newly promoted residual primitive from Aroon-style research:
recency of the latest rolling extreme.

This is NOT a named Aroon trading signal.
It is a structural-time descriptor to test against existing Pattern/resistance freshness.

## TI-065 — Exact EXTREME_RECENCY_20 definition

Input:
- exactly the latest 20 eligible symbol-session daily bars ending at decision date t;
- high and low must be valid under the canonical technical-continuity space;
- non-symbol sessions and verified suspensions are not bars.

For highs:
1. maxHigh20 = maximum high over the 20 eligible bars;
2. find all eligible bars whose high equals maxHigh20 under exact stored numeric value;
3. choose the MOST RECENT occurrence;
4. daysSinceHigh20 = number of eligible symbol sessions after that bar through t.

For lows:
1. minLow20 = minimum low over the same 20 eligible bars;
2. choose the MOST RECENT equal-low occurrence;
3. daysSinceLow20 = number of eligible symbol sessions after that bar through t.

Range:
- 0 means the extreme occurred today;
- 19 means it occurred on the oldest eligible bar in the 20-session window.

No calendar-day counting.

Optional UI-only normalization:
- highRecency20 = 1 - daysSinceHigh20 / 19
- lowRecency20 = 1 - daysSinceLow20 / 19

The raw day counts are the primary research representation.

## TI-066 — Why this may be incrementally distinct

Two stocks can have:
- the same current close;
- the same priorHigh20 price;
- the same percentage distance to that high;
- similar ret20;
yet differ materially in how recently that high was established.

Example:
A:
- 20-day high occurred yesterday;
- current price 1% below it.

B:
- same 20-day high price and same current price;
- high occurred 15 eligible sessions ago.

Distance-to-resistance is identical.
Extreme recency is not.

This is the exact residual question to falsify.

## TI-067 — Why recency is NOT automatically bullish

Recent high can mean:
- fresh breakout pressure;
- trend continuation;
- late-stage exhaustion;
- price-limit constrained discovery;
- event shock.

Old high can mean:
- stale resistance;
- mature base;
- long unresolved overhead supply;
- irrelevant old pivot.

Therefore:
daysSinceHigh20 / daysSinceLow20 have NO universal sign.

They are context descriptors.

## TI-068 — Mandatory redundancy controls

Before any incremental claim, control:
- current distance to priorHigh20 / priorLow20;
- local/major resistance lifecycle;
- Pattern state and pattern age;
- breakoutAttempt / accepted / reentered / failed;
- ret5 / ret20 / ret60;
- MA slope/alignment;
- trendPersistence;
- VCP/Platform duration;
- lateStage / overheat;
- ATR / volatility;
- Price-Volume acceptance;
- regime / sector state.

Primary null:
Once structural distance and Pattern lifecycle are known, extreme recency adds no stable information.

If the null is not rejected robustly:
EXTREME_RECENCY_20 becomes explanation-only.

## TI-069 — Data-quality and market-structure guards

BLOCK when:
- fewer than 20 eligible symbol sessions;
- symbol-session provenance incomplete;
- technical continuity unresolved;
- corporate-action mechanical reset contaminates the window;
- any bar is a pseudo/no-trade bar being treated as a real session.

CONSTRAINED / separate stratum when:
- current or extreme-defining sessions are price-limit constrained;
- consecutive limit-up/down prevents ordinary price-discovery interpretation.

Verified suspension:
- does not increment daysSinceHigh20 or daysSinceLow20;
- window remains 20 eligible observed sessions, not 20 calendar dates.

## TI-070 — Adversarial fixtures frozen before outcomes

### R1 — Same distance, different age
Two synthetic paths end with identical:
- current close;
- priorHigh20;
- distanceToHigh.
Only the high's session age differs.
Expected: daysSinceHigh20 differs.

### R2 — Equal-high tie
The same maximum high occurs on bars t-10 and t-2.
Expected:
daysSinceHigh20 = 2.
Most recent equal extreme wins.

### R3 — New high today
Today's high is the unique window maximum.
Expected:
daysSinceHigh20 = 0.

### R4 — Verified suspension gap
A stock has a verified suspension between the extreme and t.
Expected:
suspension calendar days do not increment the eligible-session count.

### R5 — Pseudo-bar contamination
Provider inserts a flat no-trade pseudo-bar.
Expected:
DATA_BLOCKED unless canonical symbol-session filter removes it.

### R6 — Corporate-action discontinuity
Raw unbridged ex-right/ex-dividend reset creates an artificial extreme.
Expected:
DATA_BLOCKED in ordinary technical space until continuity semantics resolve.

### R7 — Consecutive limit-up
Latest highs update under limit-constrained price discovery.
Expected:
recency computes descriptively but interpretation state = CONSTRAINED/UNRESOLVED.

### R8 — Old high but accepted breakout above another local pivot
Expected:
daysSinceHigh20 alone cannot override current Pattern lifecycle.

## TI-071 — Outcome design

Do NOT test:
"buy low daysSinceHigh20."

First future inference:
Among otherwise comparable candidate parents, does extreme recency explain incremental dispersion after the mandatory structural controls?

Primary outcomes only after complete prospective coverage:
- D1 / D3 / D5 / D10;
- MFE / MAE;
- false-break / reentry timing;
- stop-first where provenance is valid.

Inference unit:
independent scan date.

No threshold sweep.
Use continuous raw day count first.

Only if continuous evidence is stable may descriptive bins be preregistered later.

## Current status

EXTREME_RECENCY_20:
SPEC_FROZEN / ADVERSARIAL_FIXTURES_FROZEN / OUTCOME_UNTESTED / WORTH_FALSIFICATION

AROON_NAMED_SIGNAL:
NOT_PROMOTED

FORMAL_OPTIMIZATION_CANDIDATE:
NONE

Formal Core remains LOCKED.

## Exact next continuation

1. No runtime wiring.
2. Reconcile EXTREME_RECENCY_20 against Pattern/resistance age semantics to ensure one owner and no duplicate field.
3. If later implemented research-only, reuse already-loaded history and add zero market-data calls.
4. Preserve raw daysSinceHigh20/daysSinceLow20; do not add threshold states yet.
5. Outcome testing remains after the primary four indicator redundancy gates.
6. Formal Core unchanged.
