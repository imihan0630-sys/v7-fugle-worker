# Market Microstructure Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: MS-001 through MS-012 complete.
Next: MS-013.

## Durable conclusions

- Market microstructure is a distinct information layer from K-line and price-volume.
- Bid-ask spread is both execution friction and an adverse-selection/liquidity signal; it is not directional alpha by itself.
- Order Flow Imbalance (OFI) is conceptually stronger than raw volume for short-horizon supply/demand pressure, but true OFI requires real quote/order-book event data.
- The same imbalance has larger price impact in thinner books; depth must therefore normalize imbalance interpretation.
- Imbalance persistence can arise from order splitting, but persistent pressure can later reverse; do not map imbalance monotonically to bullish/bearish labels.
- Queue imbalance has documented one-tick-ahead predictive value in limit-order-book research, especially for large-tick stocks; this does not establish 15m or multi-day alpha.
- A simple weighted-mid is only a proxy. Do not label it a fitted Stoikov microprice.
- Trade aggressor side inferred from price/quotes is imperfect. Fugle bid/ask-at-trade plus provider inside/outside volume can support research proxies, but inferred/provided pressure must not be called ground-truth OFI.
- Execution cost must remain separate from selection/signal quality. No real fill => no implementation-shortfall claim.
- Intraday liquidity has time-of-day structure; same-slot normalization is the default research design.
- Taiwan-specific price limits, tick sizes, call-auction periods, volatility interruptions and odd-lot mechanics require explicit controls.
- OHLCV cannot reconstruct true OFI, cancellations, queue state or full depth. Historical backfill from candles is prohibited.
- Preferred architecture remains six layers: Liquidity Cost / Available Depth / Pressure / Price Response / Persistence / Constraint.
- Highest-value integration point is 15m BUY and Execution Alpha research, especially false-breakout, chase/slippage and absorption diagnostics.
- Fugle data availability is sufficient for prospective Shadow microstructure research: quote, trades, volumes and WebSocket books/trades expose useful fields.
- Current main-source Worker audit shows candles + quote calls but no direct use of trades/volumes or quote depth/inside-outside fields. This is source truth only; deployed runtime can differ due to guarded deploy patches.
- Formal Core remains LOCKED. This lane is research-only / Shadow.

## Pre-registered minimum Shadow V1 fields

1. msQuotedSpreadBps
2. msDepthImbalance1
3. msDepthImbalance5Notional
4. msTradePressureProxy (provider inside/outside proxy; NOT true OFI)
5. msWeightedMidProxyBps
6. msTransactionRate
7. msSessionState
8. msPriceLimitState
9. same-slot normalized spread/depth/pressure when historical coverage is sufficient
10. capturedAt/source/pointInTimeEligible/coverage/UNKNOWN provenance

## Positive hypotheses

- Tight same-slot spread + positive pressure + positive price progress improves 10m/30m follow-through versus price progress alone.
- Buy pressure without price progress is an absorption/exhaustion warning.
- Widening spread during chase-like conditions degrades execution alpha.
- Depth/queue state adds incremental information after current price-volume, ATR/liquidity, Residual RS, overheat, sector and regime controls.

## Counter-hypotheses / failure modes

- Displayed depth can be fleeting or canceled.
- High pressure can be late-stage chasing.
- Microstructure may add no incremental value after existing variables.
- Effects may disappear after cost, tick-size, price-tier and session controls.
- Results limited to opening minutes / one stock / one tier are fragile, not promotable.
- Prospective data may be insufficient.
- Taiwan call auction, price limit and volatility interruption mechanics can dominate normal continuous-market relations.
- Outcome-tuned thresholds are prohibited.

## Data source findings

Fugle official docs currently provide:
- intraday quote with market-state / limit / halt / trial / continuous fields and quote data;
- intraday trades with bid/ask/price/size/time/serial;
- intraday volumes with price-level volumeAtBid / volumeAtAsk;
- WebSocket books with best-five prices/sizes plus isContinuous/isTrial;
- WebSocket trades with event-level trade data.

Fugle explicitly excludes the opening first trade from its inside/outside-volume calculation because opening call auction may not represent the same supply-demand mechanism.

## Exact next continuation

- MS-013 absorption/replenishment.
- MS-014 liquidity-vacuum breakout vs depth-supported breakout.
- MS-015 spread/depth around failed breakouts.
- MS-016 Taiwan order-imbalance / investor-class evidence.
- MS-017 compare against existing V8.8.1 execution-recorder spread/depth fields and remove duplicates.
- MS-018 determine whether isolated Class-A prospective capture can reuse existing recorder without changing Formal runtime semantics.

Files:
- MICROSTRUCTURE_RESEARCH.md
- MICROSTRUCTURE_CHECKPOINT.md
