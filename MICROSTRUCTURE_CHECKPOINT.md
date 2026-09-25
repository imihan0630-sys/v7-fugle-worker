# Market Microstructure Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: MS-001 through MS-043 complete.
Next: MS-044.

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

## MS-013 through MS-018 durable update

- Absorption is dynamic: pressure + repeated opposing-side replenishment + weak price response. One large displayed queue is insufficient.
- Liquidity-vacuum breakouts and depth-supported breakouts must be separated; a large move in a thin book can reflect high price impact rather than strong demand.
- Failed-breakout research is pre-registered around spread widening, pressure-price divergence, replenishment and depth-imbalance flips, with matched successful-breakout controls.
- Taiwan 2004 order-imbalance evidence supports persistence from order splitting/herding but little aggregate price pressure beyond one day; trader-class findings are historically bounded and must not be transplanted to 2026.
- 2026 TWSE market-structure commentary indicates a much more institutionalized market than circa 2000, strengthening the need for current revalidation.
- V8.8.1 already records top-five bids/asks, spreadPct, bidDepth5, askDepth5, depthImbalance and executionMarketState in the research recorder. Do not duplicate these fields.
- Current recorder event cadence (open, first 10m/15m/30m, formal signal) is too sparse for true event-level OFI or seconds-scale resiliency.
- Incremental priority is now same-slot normalization, trade-pressure proxy, pressure-to-price response, weighted-mid displacement, transaction rate, replenishment/resiliency and persistence states.
- Adding new REST trades/volumes calls directly to Formal monitoring can create shared-runtime risk and should be Class B unless isolated. Preferred future design is a separate research-only capture path.

## Exact next continuation

- MS-019 minimum prospective cadence/storage burden for replenishment.
- MS-020 adverse-selection / post-trade markout.
- MS-021 Taiwan tick-size-band / thousand-dollar normalization.
- MS-022 price-limit-proximity nonlinear behavior.
- MS-023 cross-lane redundancy matrix.
- MS-024 frozen empirical protocol before implementation.

Files:
- MICROSTRUCTURE_RESEARCH.md
- MICROSTRUCTURE_CHECKPOINT.md


## MS-019 through MS-024 durable update

- Dynamic replenishment/resiliency cannot be inferred from the current sparse open/10m/15m/30m/signal snapshots; prospective high-frequency/event-driven data are required.
- Cadence pilot is frozen to compare 1s / 5s / 15s state-reconstruction fidelity without return outcomes; per regular 4.5h session this is 16,200 / 3,240 / 1,080 buckets per symbol.
- Post-fill markout and implementation shortfall are only valid when genuine fills exist; otherwise use post-signal/post-pressure mid moves.
- TWSE tick normalization is mandatory: stock ticks are NT$0.01 / 0.05 / 0.10 / 0.50 / 1 / 5 across the official price bands, making thousand-dollar stocks structurally distinct.
- Price-limit proximity and volatility-interruption/trial states are separate nonlinear regimes, not automatic BAD observations.
- Cross-lane redundancy matrix is frozen; existing spread/depth fields must be reused, and new variables need stable incremental value after K-line, price-volume, ATR/liquidity, Residual RS, sector, regime and overheat controls.
- First empirical protocol is frozen prospectively. Primary horizons are +1m/+5m/+10m/+15m/+30m, 15m/30m MFE/MAE, breakout hold/failure and fill-quality outcomes only where fills are verified.
- Next action is evidence collection from the existing recorder before any new runtime capture is proposed.

## Revised exact next continuation

- MS-025 quantify actual existing execution-recorder coverage by event/date.
- MS-026 test whether existing spread/depth snapshots can answer a first baseline question with zero code.
- MS-027 if coverage permits, pre-register/run zero-code baseline using existing fields.
- MS-028 only if inadequate, prepare isolated research-capture proposal with cadence/storage/rate-limit budget.


## MS-025 through MS-026 — recorder coverage gate
- V8.8.0 writes are prospective/event-driven only at OPEN_BASELINE, FIRST_10M_COMPLETE, FIRST_15M_COMPLETE, FIRST_30M_COMPLETE and FORMAL_SIGNAL_OBSERVED while monitor results exist.
- Current read contract cannot prove exhaustive date/event coverage: rolling days only, newest-first SQL LIMIT 500, only newest 80 exposed, no exact-date cursor/truncation/expected-event/completeness fields.
- Coverage by historical event/date is therefore NOT_QUANTIFIABLE_FROM_CURRENT_READ_CONTRACT. Missing rows remain UNKNOWN, never NO-BUY/BAD/0.
- Sparse snapshots can describe captured spread/depth state but cannot identify seconds-scale replenishment/resiliency or true OFI.
- MS-026 zero-code inferential baseline is DATA_QUALITY_BLOCKED. Running outcome comparisons on returned rows would create coverage/selection bias. Descriptive audits may label the sample non-exhaustive but cannot estimate event frequency or absence.
- Counter-hypothesis: zero-code would be sufficient if complete target-date coverage were proven; current contract does not prove it.
- Shared endpoint completeness extension remains Class B proposal-first. No runtime/Formal/monitor/signal/capital/push change.

## Revised exact continuation
- MS-027 blocked until complete-enough recorder evidence exists; do not run on convenience samples.
- MS-028 prepare isolated research capture/readout design only, with cadence/storage/rate-limit budget and proof Formal runtime semantics are untouched. Re-evaluate MS-027 first if a complete existing artifact/readback appears.


## MS-027 through MS-043 — concept convergence
- MS-027 zero-code baseline remains DATA_QUALITY_BLOCKED because recorder coverage is not exhaustive.
- MS-028–032 froze an isolated-collector architecture, Fugle quota/storage budget, compact bucket schema and explicit completeness contract. Dynamic research requires prospective data; no historical OHLCV reconstruction.
- Official Fugle plan evidence: Basic currently supports 5 WebSocket subscriptions / 60 intraday REST calls per minute; Developer 300 / 600; Advanced 2000 / 2000. Books+trades requires 2 subscriptions per symbol. Actual account plan remains UNKNOWN until verified.
- Illustrative fixed-bucket burden shows 1s permanent capture scales too quickly; pilot 1s/5s/15s fidelity before choosing cadence.
- MS-033 retained flow-toxicity as a concept but explicitly rejected VPIN as a magic metric because published evidence is contested and sensitive to intensity/classification/sampling.
- MS-034 public top-five depth is only displayed liquidity; hidden liquidity exists and intent such as spoofing/iceberg cannot be asserted from public patterns alone.
- MS-035 separated signal quality, executable price quality and limit-fill probability. Hypothetical touch != proven fill.
- MS-036 separated transient from retained price impact; simple multi-horizon retention/retracement study preferred over structural impact modeling.
- MS-037 froze breakout/failed-breakout microstructure event-study windows and matched controls.
- MS-038 concluded a separate research collector is scientifically justified but is Class-B infrastructure proposal-first; no deployment.
- MS-039 created `MICROSTRUCTURE_COLLECTOR_PROPOSAL.md` with isolation/quota/storage/fidelity/go-no-go gates and no code/deploy.
- MS-040 current TWSE opening/closing/VI call auctions are separate regimes from continuous trading.
- MS-041 price discovery can arrive with lag; pressure must be tested at multiple horizons rather than only immediate reaction.
- MS-042 market/industry-wide liquidity commonality is documented globally and in Taiwan; stock liquidity stress must be separated from sector/market liquidity stress.
- MS-043 introduced a research-only Liquidity Regime layer distinct from Price Regime.
- Conceptual microstructure lane is now converged. Additional indicator invention is paused to avoid Factor-Zoo risk.
- Formal Core remains LOCKED; no Formal/monitor/signal/capital/push change and no deployment.

## Exact next continuation
- MS-044 mark concept lane CONCEPT_COMPLETE / EVIDENCE_PENDING.
- Start new durable lane: Market Breadth + Sector Rotation + Leadership.
- First tasks: breadth definitions, advance/decline structure, new-high/new-low participation, breadth divergence, industry momentum/rotation, leader participation, Taiwan data-source feasibility, positive/counter evidence.
