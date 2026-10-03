# D02-12 Intraday Volume Curve / Volume Profile PIT Readiness V0.1

Updated: 2026-10-04 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / PIT_READINESS_PASS
Module: D02-12 盤中量能曲線／Volume Profile
Formal Core: LOCKED / unchanged
Evidence cursor: remains PVE-239

## Semantic split

The label "Volume Profile" is ambiguous. V0.1 freezes two different families:

A. TIME_OF_DAY_VOLUME_CURVE
- volume by time slot;
- same-slot RVOL;
- cumulative participation pace.

B. PRICE_BY_VOLUME_PROFILE
- cumulative traded volume by transaction price;
- optional provider-classified volumeAtBid / volumeAtAsk;
- a spatial price-distribution view, not a time-of-day curve.

They must not be merged into one boolean or one vote.

## A. Time-of-day volume curve

Taiwan source feasibility:
- Fugle historical equity minute candles support 15-minute history from 2023-05-23 onward;
- live intraday candles support 15-minute bars;
- regular-stock intraday volume is documented in lots;
- current PV Shadow normalizes same slot against prior comparable sessions and separately tracks cumulative prefix pace.

Primary PIT clock:
- a slot becomes observable only after its bar is complete;
- the historical denominator uses only prior sessions;
- sourceFetchedAt / featureKnownAt must be >= barEnd.

Current bounded observable window:
- repository PV slots start at 09:00 and currently end at 13:00;
- current monitor does not capture the 13:15-start bar or complete closing-auction activity.

Therefore V0.1 may claim PIT feasibility only for the bounded observable window.
It must not claim a complete full-session closing profile.

Session guards:
- 09:00 is OPEN_AUCTION_MIXED;
- regular continuous-session slots are typed separately;
- TWSE regular trading is 09:00-13:30;
- delayed close can extend an affected security's closing match to 13:33;
- intraday odd-lot trading begins at 09:10 and is a separate market-data type.

## B. Price-by-volume profile

Fugle provides a current-day intraday volumes endpoint with:
- price;
- cumulative volume at that price;
- volumeAtBid;
- volumeAtAsk;
and supports an oddlot type.

PIT interpretation:
- the profile is only known as fetched at observation time;
- it may be persisted prospectively with sourceFetchedAt;
- it must not be reconstructed retrospectively and relabeled as historical Shadow when no historical profile source exists.

Provider caveat:
Fugle explicitly excludes the opening first trade from inside/outside classification, so volumeAtBid + volumeAtAsk can be below total volume by design.
Unclassified coverage must remain explicit; it cannot be assigned to buy/sell pressure.

Historical OOS depth for price-by-volume profile is NOT established by this endpoint.
That blocks L4-style historical/prospective performance inference, not L3 data feasibility.

## Anti-double-count boundary

TIME_OF_DAY_VOLUME_CURVE:
- pvSlotRvol20 and pvCumvolPace20 are transforms over the same intraday volume path;
- at 09:00 they are exactly identical by construction;
- cumulative pace must beat slot RVOL/persistence on common support before any independent evidence weight.

PRICE_BY_VOLUME_PROFILE:
- price-level concentration is not a second copy of same-slot RVOL;
- but it must later control for price range, close location, turnover/liquidity, auction/session state, and event flow.

Neither family identifies informed traders or hidden intent by itself.

## Falsification / negative cases

1. High opening volume may be auction/information-release concentration, not a universal bullish signal.
2. High closing volume may reflect benchmark/rebalance/overnight-risk flow, not directional confirmation.
3. A midday low-volume slot can be normal intraday seasonality rather than "dry-up".
4. Same raw slot volume has different meaning across symbols and across time of day; same-slot normalization is required.
5. A concentrated price-by-volume node does not prove support/resistance without future acceptance evidence.
6. Bid/ask classified coverage < total volume is expected under provider semantics; missing classification is not seller/buyer volume.
7. Current 13:00 monitor ceiling means "full-day curve complete" is false.

## Maturity decision

L3 requires Taiwan PIT data-source and time-semantics feasibility.

D02-12 now has:
- current and historical Taiwan intraday time-curve sources;
- a legal completed-bar clock;
- explicit bounded-window coverage;
- a prospective current-day price-by-volume source;
- explicit odd-lot/session/auction and classification guards;
- anti-double-count and negative-case rules.

Decision:
D02-12 L2/40 -> L3/60.

This does NOT mean predictive value is supported.
Price-by-volume historical/OOS evidence remains unavailable from the current source.
Closing-auction/full-session coverage remains incomplete.
L4/L5 remain closed.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
