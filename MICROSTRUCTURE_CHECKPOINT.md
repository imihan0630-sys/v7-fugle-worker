# Market Microstructure Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: MS-001 through MS-006 complete.
Next: MS-007.

## Durable conclusions

- Market microstructure is a distinct information layer from K-line and price-volume.
- Bid-ask spread is both execution friction and an adverse-selection/liquidity signal; it is not directional alpha by itself.
- Order Flow Imbalance (OFI) is conceptually stronger than raw volume for short-horizon supply/demand pressure, but requires real quote/order-book event data.
- The same imbalance has larger price impact in thinner books; depth must therefore normalize any imbalance interpretation.
- Imbalance persistence can arise from order splitting, but persistent pressure can later reverse; do not map imbalance monotonically to bullish/bearish labels.
- Taiwan-specific price limits, tick sizes, call-auction periods, volatility interruptions and odd-lot mechanics require explicit controls.
- OHLCV cannot reconstruct true OFI, cancellations, queue state or full depth. Historical backfill from candles is prohibited.
- Preferred architecture is a six-layer research state: Liquidity Cost / Available Depth / Pressure / Price Response / Persistence / Constraint.
- Highest-value integration point is 15m BUY and Execution Alpha research, especially false-breakout, chase/slippage and absorption diagnostics.
- Formal Core remains LOCKED. This lane is research-only / Shadow.

## Positive hypotheses to test

1. Tight normalized spread + positive OFI + positive price progress improves short-horizon follow-through.
2. Positive pressure with adequate/replenishing depth is more durable than thin-book price jumps.
3. Widening spread during a chase degrades execution alpha.
4. Buy pressure without price progress is an absorption/exhaustion warning.
5. Same-slot normalization improves robustness relative to raw spread/depth thresholds.

## Counter-hypotheses / failure modes

1. Book imbalance may be fleeting or canceled.
2. High OFI can be late-stage chasing rather than information.
3. Microstructure may add little beyond existing liquidity/ATR/volume features.
4. Effects may disappear after cost, tick-size and price-tier controls.
5. Opening/closing auction, limit-up/down proximity and volatility interruptions can dominate normal continuous-market relationships.
6. Prospective data volume may be insufficient for stable inference.

## Exact next continuation

- MS-007 queue imbalance + microprice.
- MS-008 trade-sign inference and aggressor-side data truth.
- MS-009 effective spread / implementation shortfall / slippage.
- MS-010 intraday seasonality and same-slot normalization.
- MS-011 current Fugle/Worker data-availability audit.
- MS-012 frozen minimal Shadow feature spec + falsification plan.

Files:
- MICROSTRUCTURE_RESEARCH.md
- MICROSTRUCTURE_CHECKPOINT.md
