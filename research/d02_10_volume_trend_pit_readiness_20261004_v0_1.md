# D02-10 Volume-State × Trend PIT Readiness V0.1

Updated: 2026-10-04 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / PIT_READINESS_PASS
Module: D02-10 成交量狀態×趨勢互動
Formal Core: LOCKED / unchanged
Evidence cursor: remains PVE-239

## Research question

Can D02 join a contemporaneously known participation state to a legally known trend context in Taiwan without look-ahead, repainting, or duplicate event voting?

This is a data-feasibility / time-semantics question only. It is not an alpha claim.

## Owner boundary

D02 owns participation / volume transforms.
D03 owns trend / momentum constructs.
D02-10 is an interaction transform and does not mint a new primitive price or volume observation.

One episode cannot receive independent +1 votes for:
- trend;
- abnormal volume;
- the trend×volume interaction;
unless residual incremental value is later proven on common support.

## Primary V0.1 clock

Use PRE_SESSION_TREND_CONTEXT as the primary trend side.

For Taiwan market date T:
- trend parent is computed only from data available through the last completed eligible symbol session before T;
- no current-session price move is allowed into the primary trend parent;
- current D02 participation is observed from a completed 15-minute bar on T;
- interaction firstKnownAt = max(trendParentKnownAt, volumeBarEnd, volumeSourceFetchedAt).

This prevents same-bar price response from being repackaged as a "trend×volume" predictor.

A same-session trend update can be studied later only as a separately typed secondary construct with stronger circularity controls.

## Primary input family

Trend parent: reference D03 canonical owner receipt, not a forked D02 formula.
Allowed examples are D03-owned pre-session primitives/states derived from prior eligible daily history, such as:
- ret20 / ret60 family;
- close-vs-MA context;
- MA slope/alignment;
- trend persistence.

Volume side:
- pvSlotRvol20;
- pvCumvolPace20 where cumulative continuity is valid;
- pvPersistenceState only when observation adjacency is independently verified.

At 09:00, pvCumvolPace20 == pvSlotRvol20 by construction, so the cumulative-pacing interaction adds zero distinct information there.

## Taiwan PIT source feasibility

Current repository evidence already has:
- Taiwan daily-history price inputs used by D03, with D03 trend modules at L3 data-feasibility maturity;
- historical 15-minute equity candles for the D02 same-slot baseline;
- live/intraday 15-minute equity candles;
- immutable source/bar timestamps and feature-known-at semantics in the PV Shadow design.

Fugle historical equity minute candles are available from 2023-05-23 onward.
Regular-stock intraday candle volume is documented in lots.

Therefore the V0.1 interaction can be replayed without future data:
prior-session trend receipt + current completed-slot participation receipt.

## Fail-closed rules

Interaction = UNKNOWN/BLOCKED when:
- D03 parent receipt/version is missing;
- trend parent uses current/future session data under the PRE_SESSION contract;
- D02 slot baseline is not field-ready;
- required same-slot history is incomplete;
- cumulative prefix continuity is broken for a cumulative feature;
- symbol/session or corporate-action continuity required by the chosen field is unresolved;
- sourceFetchedAt / featureKnownAt does not support the claimed observation clock.

## Falsification / alternative explanations

1. Uptrend + high RVOL is not automatically bullish continuation.
   It can be late-stage crowding, event shock, rebalance flow, or climax.

2. Downtrend + high RVOL is not automatically bearish continuation.
   It can be capitulation, disagreement, absorption, or forced liquidity.

3. Uptrend + low volume is not automatically healthy.
   It can be illiquidity or participation failure.

4. Downtrend + low volume is not automatically constructive exhaustion.
   It can be inactivity in a persistent decline.

5. If interaction value disappears after direct trend + direct participation + market/sector/liquidity controls, classify REDUNDANT.

## Maturity decision

L3 criterion is Taiwan PIT data-source and time-semantics feasibility, not predictive success.

D02-10 now has:
- explicit producer/consumer ownership;
- a non-look-ahead primary clock;
- reproducible Taiwan source lanes;
- fail-closed UNKNOWN semantics;
- anti-circularity and anti-double-count rules;
- positive and negative interpretation states.

Decision:
D02-10 L2/40 -> L3/60.

This does NOT mean:
- alpha supported;
- threshold validated;
- L4 prospective/OOS evidence achieved;
- L5 robustness achieved;
- Formal optimization candidate created.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
