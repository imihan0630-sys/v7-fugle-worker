# D02-08 Accumulation / Distribution Proxy PIT Readiness V0.1

Updated: 2026-10-04 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / PIT_READINESS_PASS
Module: D02-08 吸籌／出貨代理變數
Formal Core: LOCKED / unchanged
Evidence cursor: PVE-239

## Scope narrowing

D02-08 is NOT promoted as an identifiable "smart-money intent" module.

The L3 observable construct is narrowed to:
`PROVIDER_TRADE_PRESSURE_PROXY`

It consumes an independent provider-side microstructure family that is not reconstructible from OHLCV alone:
- cumulative tradeVolume;
- cumulative tradeVolumeAtBid;
- cumulative tradeVolumeAtAsk;
- cumulative transaction count;
- source/provider timestamps.

Official current source contracts:
- Fugle Intraday Quote exposes the cumulative fields above;
- Fugle Intraday Volumes exposes price-level volumeAtBid/volumeAtAsk and explicitly states opening first-trade volume is excluded from inside/outside classification;
- Fugle Intraday Trades exposes bid/ask/price/size/time/serial for current-day trade details.

## Executable research adapter

Artifacts:
- `research/d02_provider_trade_pressure_proxy_v0_1.mjs`
- `tests/test_d02_provider_trade_pressure_proxy_v0_1.mjs`

Independent local execution:
- Node.js v22.16.0;
- 14/14 tests PASS.

The adapter:
1. normalizes provider cumulative quote totals under explicit symbol/type/exchange/date identity;
2. converts provider microsecond time independently from fetch time;
3. requires non-decreasing source/fetch clocks;
4. requires cumulative trade/AtBid/AtAsk counters not to regress;
5. forbids round-lot/odd-lot mixing;
6. preserves unclassified volume explicitly;
7. rejects classified-volume delta greater than total-volume delta;
8. returns UNKNOWN when there is no new/classified volume;
9. supports a preregistered coverage floor without tuning it from outcomes;
10. permanently emits:
   - trueOfiEligible=false;
   - dynamicAbsorptionEligible=false;
   - participantIntentEligible=false.

Primary proxy:
`providerTradePressureProxy = (deltaAtAsk - deltaAtBid) / (deltaAtAsk + deltaAtBid)`

Only classified delta volume enters the numerator/denominator.
Unclassified volume is retained as a separate coverage quantity.

## Clock

For an interval formed by previous and current captures:

`firstKnownAt = current.sourceFetchedAt`

Provider event/statistic time is source provenance.
The feature cannot be known to the research system before the current fetch.

Same-day/same-symbol/same-type identity is mandatory.

## Observable response states

The pressure proxy may be joined with an independently timestamped price response to produce labels such as:
- ASK_PRESSURE_WITH_UP_PROGRESS;
- ASK_PRESSURE_WITH_WEAK_OR_NEGATIVE_PROGRESS;
- BID_PRESSURE_WITH_DOWN_PROGRESS;
- BID_PRESSURE_WITH_WEAK_OR_POSITIVE_PROGRESS.

These are observable pressure-response coordinates only.

Forbidden reinterpretations:
- ACCUMULATION;
- DISTRIBUTION;
- SMART_MONEY_BUYING;
- SMART_MONEY_SELLING;
- TRUE_OFI;
- GROUND_TRUTH_AGGRESSOR_SIDE;
- PASSIVE_ABSORPTION;
- ICEBERG/HIDDEN_INTENT.

## D05 dependency boundary

D05 currently validates several supporting PIT-observable families such as spread, displayed depth, market-state/liquidity state and current provider source semantics.

However D05-05 true OFI remains L2 because event-sequence completeness is not proven.
Dynamic replenishment/resiliency also requires denser prospective capture.

D02-08 therefore consumes only the coarse provider-pressure proxy.
It may not inherit unavailable D05 claims.

## Falsification cases

1. Positive provider pressure + weak price progress does not prove absorption.
2. Negative provider pressure + stable/rising price does not prove accumulation.
3. High unclassified-volume share weakens side-pressure interpretation.
4. Opening-auction unclassified volume is expected under provider semantics and must not be assigned to either side.
5. Counter regression / timestamp reversal is data-quality failure, not negative pressure.
6. Odd-lot and round-lot streams are distinct.
7. If future incremental value disappears after direct volume, price response, spread/depth, volatility, event and regime controls, this proxy is redundant.
8. Even successful prediction would not identify participant identity without independent ownership/order-origin evidence.

## Maturity decision

L3 requires Taiwan PIT source/clock/replay feasibility, not intent identification or alpha.

D02-08 now has:
- an independent non-OHLCV observable source family;
- current official Taiwan-equity source semantics;
- explicit knownAt/fetch clock;
- executable fail-closed replay;
- missing/unclassified coverage preservation;
- strict anti-intent naming boundary.

Decision:
D02-08 L2/40 -> L3/60.

Governance after promotion:
OBSERVATION / RESEARCH_ONLY / PROXY_ONLY / INTENT_UNIDENTIFIED.

Not implied:
- true accumulation/distribution detection;
- true OFI;
- alpha;
- Formal signal;
- L4/OOS/prospective efficacy.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
