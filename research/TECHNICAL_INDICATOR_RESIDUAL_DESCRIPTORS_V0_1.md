# Technical Indicator Residual Descriptors V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / PREREGISTERED / OUTCOME-BLIND
Formal Core: LOCKED

## Scope
After the TI-027..TI-045 redundancy pruning, retain only two narrow residual descriptors for future falsification:
1. one return-velocity-shift descriptor instead of a new ROC family;
2. one normalized close-signed volume balance instead of raw cumulative OBV.

No outcomes are inspected and no parameters are tuned here.

## TI-046 — Minimal return-velocity-shift descriptor

### Motivation
Standard ROC_N is exactly the N-period return expressed in percent and is already rejected as a duplicate of retN.

The remaining question is whether recent return speed has changed relative to a longer baseline.

### Frozen V0.1 definition

Use per-session log-return velocities:
g5 = ln(C_t / C_(t-5)) / 5
g20 = ln(C_t / C_(t-20)) / 20

Define:
returnVelocityShift5v20 = g5 - g20

Interpretation:
- positive: recent five-session price velocity is faster than the twenty-session baseline;
- negative: recent velocity is slower than the twenty-session baseline.

This is a descriptive transition variable, not a bullish/bearish signal.

### Why log velocity
- multiplicative price scale invariant;
- horizons become comparable on a per-session basis;
- avoids pretending raw ret5 and ret20 percentages are directly comparable without horizon normalization.

### Required guards
- at least 21 valid eligible trading bars;
- TECHNICAL_CONTINUITY valid over the lookback;
- no pseudo/no-trade bars counted as ordinary sessions;
- corporate-action mechanical discontinuity neutralized by canonical continuity semantics;
- constrained price-limit states retained separately.

### Redundancy controls
Must be tested against:
- ret5/ret10/ret20/ret60;
- MACD histogram slope;
- MA20 slope change;
- trendPersistence;
- Pattern breakout/retest/failure lifecycle;
- lateStage/overheat;
- market regime/transition state.

### Status
RETURN_VELOCITY_SHIFT_5V20 = PREREGISTERED_RESIDUAL_HYPOTHESIS / ALPHA_UNKNOWN

No alternative horizon grid is authorized before this baseline is falsified.

## TI-047 — Minimal normalized close-signed volume balance

### Motivation
Raw OBV has an arbitrary cumulative starting level and a permanent memory of old volume shocks.
For cross-sectional research, freeze a bounded windowed equivalent of its core information.

For each eligible session i:
s_i =
+1 if C_i > C_(i-1)
-1 if C_i < C_(i-1)
0 if C_i = C_(i-1)

Define for N=20:
signedVolumeBalance20 = sum(s_i * V_i) / sum(V_i)

Range:
[-1, +1]

Interpretation:
- +1 means all observed volume in the window occurred on up-close days;
- -1 means all observed volume occurred on down-close days;
- near 0 means close-signed volume is balanced.

This does NOT mean actual buyer-minus-seller order flow.
Every trade has both a buyer and seller; the sign is only a close-direction classification.

### Why this representation
- removes arbitrary OBV starting level;
- bounded and cross-sectionally comparable when volume units are valid;
- directly exposes the only primitive OBV adds: close-sign-weighted volume share.

### Required guards
- explicit volumeUnit;
- stable/known tradingUnit through the lookback;
- sub-lot completeness sufficient for the use case;
- verified symbol-session membership;
- suspension/no-trade pseudo-bars excluded;
- no silent conversion between lots and shares;
- corporate-action/session continuity valid.

### Redundancy controls
Must be compared with:
- relativeVolume5/20/60;
- up/down day counts;
- direct returns;
- turnoverValue;
- priceResponseEfficiency;
- closeLocation;
- effortVsResultState;
- acceptance/rejection lifecycle;
- Pattern state;
- sector/market regime;
- institutional-flow context where available.

### Status
SIGNED_VOLUME_BALANCE20 = PREREGISTERED_PRICE_VOLUME_COMPARATOR / ALPHA_UNKNOWN

Ownership remains PRICE_VOLUME.

## TI-048 — OBV is not CVD/order flow

Important semantic firewall:
- OBV signs the entire bar/session volume from one close-to-close price comparison.
- True CVD/order-flow measures require buyer/seller aggressor-side or equivalent trade classification.

Therefore:
OBV / signedVolumeBalance20 cannot be labeled:
- net buying pressure;
- institutional accumulation;
- aggressive buy volume;
- seller exhaustion.

Allowed labels:
- close-signed volume balance;
- volume confirmation/disagreement proxy;
- descriptive price-volume alignment.

## TI-049 — One-off volume shock sensitivity

Raw cumulative OBV can be permanently shifted by one large event.
Windowed signedVolumeBalance20 limits that permanent-history problem but does not solve event confounding.

Mandatory event controls:
- index rebalance;
- large secondary offering/capital event where known;
- ex-rights/ex-dividend/corporate action;
- abnormal one-off block/turnover event where provenance exists.

No event should be interpreted as informed accumulation merely because it changes signed volume.

## TI-050 — Residual descriptor governance

V0.1 freezes exactly:
- returnVelocityShift5v20
- signedVolumeBalance20

Do NOT immediately add:
- 3v10 / 5v10 / 10v20 / 20v60 acceleration grids;
- multiple signed-volume windows;
- smoothed/EMA variants;
- threshold buckets optimized to outcomes.

Alternative horizons require:
1. baseline failure or an explicit distinct mechanism;
2. preregistration before outcomes;
3. multiple-testing controls.

Neither descriptor enters Formal, System 2 scoring, ranking or monitoring.

## Current status

RETURN_VELOCITY_SHIFT_5V20:
SPEC_FROZEN / OUTCOME_UNTESTED / REDUNDANCY_HIGH

SIGNED_VOLUME_BALANCE20:
SPEC_FROZEN / PRICE_VOLUME_OWNED / DATA_SEMANTICS_SENSITIVE / OUTCOME_UNTESTED

FORMAL_OPTIMIZATION_CANDIDATE:
NONE

Formal Core remains LOCKED.

## Exact next continuation

1. Preserve these formulas as the only residual ROC/OBV-style baseline descriptors.
2. Do not wire them to Worker.js or production runtime.
3. Future prospective snapshot extensions require schema/version review and complete parent coverage.
4. First empirical priority remains the older primary queue: KD-vs-RSI, MACD-vs-trend, ADX-vs-trend-quality, BBW-vs-ATR/VCP.
5. Only after those resolve may the two residual descriptors consume an outcome-testing budget.
6. signedVolumeBalance20 must be tested against richer direct Price-Volume states before any promotion.
7. returnVelocityShift5v20 must be tested against direct return path and MACD/MA transition features.
8. Formal Core remains unchanged.
