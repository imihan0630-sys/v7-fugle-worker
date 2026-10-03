# D02-05 Explosive / Climax / Distribution-Volume PIT Readiness V0.1

Updated: 2026-10-04 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / PIT_READINESS_PASS
Module: D02-05 爆量／高潮量／分配量
Formal Core: LOCKED / unchanged
Evidence cursor: PVE-239

## Scope correction

This module is operationalized as an observable extreme-participation family.
It does NOT treat "distribution" as directly observable from OHLCV.

Observable owner:
- D02 abnormal participation / price-response transforms.

Dependencies:
- D04 volatility state;
- D08/D11 event context when PIT-valid;
- D05 microstructure only if a directional mechanism claim is attempted.

Latent labels such as DISTRIBUTION / ABSORPTION / SMART_MONEY remain UNKNOWN unless a genuinely independent evidence family exists.

## Frozen pre-outcome measurement

The existing PV research implementation already defines:
- LOW: pvSlotRvol20 <= 0.8
- NORMAL: 0.8 < pvSlotRvol20 < 1.3
- ELEVATED: 1.3 <= pvSlotRvol20 < 2.5
- EXTREME: pvSlotRvol20 >= 2.5

These thresholds pre-exist this maturity decision and are not selected from outcomes.

Response state already separates:
- EFFICIENT_UP;
- EFFICIENT_DOWN;
- HIGH_EFFORT_LOW_PROGRESS;
- LOW_EFFORT_LOW_PROGRESS;
- NORMAL_RESPONSE;
with Guard-state handling.

V0.1 typed extreme states:
- EXTREME_EFFICIENT_UP
- EXTREME_EFFICIENT_DOWN
- EXTREME_LOW_PROGRESS
- EXTREME_GUARDED
- EXTREME_CONTEXT_UNKNOWN

None carries a fixed bullish/bearish sign.

## PIT clock

An intraday state is first known only after the 15-minute bar is complete and the source is fetched.
Context dependencies may only be joined when their own knownAt <= interaction observation time.

firstKnownAt =
max(volumeBarEnd, volumeSourceFetchedAt, each consumed dependency knownAt).

No later acceptance/failure may rewrite the original state.

## Taiwan source feasibility

Current D02 source chain provides:
- current completed 15m bars;
- historical same-slot 15m baselines;
- pvSlotRvol20;
- pvCumvolPace20;
- response/Guard states;
- immutable observation timestamps.

This is sufficient to identify unusual/extreme participation and contemporaneous price-response geometry without future data.

It is NOT sufficient to identify seller/buyer intent.

## Falsification boundaries

1. EXTREME + EFFICIENT_UP can still be late-stage blow-off, event shock or short-covering.
2. EXTREME + EFFICIENT_DOWN can be forced liquidity, capitulation or information repricing rather than distribution.
3. EXTREME + HIGH_EFFORT_LOW_PROGRESS is ambiguous among absorption, disagreement, climax, event flow and microstructure constraints.
4. Moderate abnormal volume + strong acceptance may outperform extreme volume; no monotone "more volume is better" assumption.
5. Extreme volume during a high-volatility/event state requires dependency controls; D02 does not own the full mechanism.
6. If future incremental value disappears after price response, volatility, event, liquidity and regime controls, the extreme-volume label remains descriptive only.

## Anti-double-count

D02-05 does not add a second vote to:
- D02-06 Effort-vs-Result;
- D02-03 breakout-volume confirmation;
- D04 volatility interaction.

It is a typed participation-state view over shared primitives.

## Maturity decision

L3 requires Taiwan PIT source/time/replay feasibility, not predictive success.

The observable extreme-participation family now has:
- frozen pre-outcome measurement;
- legal completed-bar clock;
- current/historical Taiwan source path;
- Guard and UNKNOWN semantics;
- explicit dependency ownership;
- positive and negative cases.

Decision:
D02-05 L2/40 -> L3/60.

Still NOT proven:
- distribution motive;
- directional alpha;
- L4 prospective/OOS evidence;
- L5 robustness/cost/redundancy.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
