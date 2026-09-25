# K-line Pattern Research Checkpoint

Updated: 2026-09-25 Asia/Taipei

## Purpose
Durable handoff for the user's continuous K-line / chart-pattern deep research.
When a new chat continues K-line learning, read this file first, then `KLINE_PATTERN_RESEARCH.md`.
Do not restart from generic pattern introductions.

## Governance
- Formal Core remains LOCKED.
- Research / Shadow first.
- Missing evidence = UNKNOWN.
- No look-ahead, no historical Shadow fabrication, no outcome-tuned pattern definitions.
- Any later change affecting Formal selection/ranking/threshold/capital/execution/monitor/push needs explicit owner approval.

## Current research theme
DL-002 — Pattern Maturity / Multi-stage K-line Structure

## Completed durable sections
- DL-002A repaint-safe swing segmentation concept
- DL-002B data-readiness audit
- DL-002C redundancy map against current Formal features
- DL-002D alignment with existing R01-R08 research governance
- DL-002E Taiwan market-regime portability
- DL-002F candlestick evidence conflict / preregistration
- DL-002G evidence tiers
- DL-002H swing segmentation specification v0.1
- DL-002I VCP specification v0.1
- DL-002J Cup-with-Handle specification v0.1
- DL-002K W/Double-Bottom specification v0.1
- DL-002L Platform / Bull Flag / Triangle specification v0.1
- DL-002M Sakata / multi-candle sequence specification v0.1
- DL-002N cross-pattern de-duplication / latent geometry layer
- DL-002O isolated research data architecture / validation plan
- DL-002P adversarial detector test suite
- DL-002Q multi-peak / multi-trough reversal family
- DL-002R High Tight Flag vs overheat interaction
- DL-002S Pattern Maturity vs existing 15-minute execution layer
- DL-002T false-break / Spring / Upthrust structural events
- DL-002U multi-timeframe weekly/daily/15m context
- DL-002V gap / Three-Gap / Island-Reversal research
- DL-002W conditional price-volume / effort-vs-result research

## Key findings to retain
1. The system already uses substantial daily K-line structure; the real missing layer is multi-stage topology/lifecycle, not “K-lines are absent.”
2. Current system already has a crude W proxy: leftLow/rightLow/rightFootHigher. Do not duplicate it.
3. Current B breakout qualification mainly uses priorHigh20; longer pattern pivots/necklines may differ.
4. Current live history cache retains ~65 bars and discards historical OPEN even though Fugle source can provide it.
5. Fugle official historical candles support OHLCV, adjusted=true, listed-stock daily data back to 2010, with <1-year range per request.
6. Long-base and candlestick research should use a separate research-only data path, not mutate shared Formal cache by default.
7. Raw vs adjusted OHLC must be explicit; corporate-action gaps must not become pattern signals.
8. Swing points must keep pivotAt and confirmedAt. Confirmed pattern state at date t may use only swings with confirmedAt<=t.
9. VCP must use non-overlapping confirmed contraction legs; overlapping 5/10/20-day windows can create false contraction.
10. Named patterns are interpretation labels; quantitative research should use latent geometry dimensions to avoid double counting.
11. Cup/VCP have weaker direct academic alpha evidence than generic systematic chart-pattern recognition; treat them as hypotheses.
12. Taiwan candlestick studies are specification-sensitive; named candles cannot be assumed timeless.
13. Old Taiwan evidence predates 2015 price-limit widening and 2020 continuous trading; transportability must be tested.
14. High Tight Flag is a useful overheat conflict study because updated practitioner performance deteriorated versus early claims.
15. Pattern maturity must be studied separately from existing 15-minute BUY execution; good selection can still create NO-BUY because of no retest/maxChase.
16. Opening gaps vs true range gaps are distinct; Taiwan overnight and intraday returns contain different information.

## Current blockers
- CANDLESTICK_HISTORY_OPEN: research source available, live cache inadequate.
- LONG_PATTERN_HORIZON: research source available, live cache too short.
- CORPORATE_ACTION_ADJUSTMENT: source supports adjusted=true; research handling must be explicit.
- EXECUTION_COVERAGE: missing recorder rows cannot be interpreted as NO-BUY without complete date coverage.

## Exact next continuation point
1. Research Pennant / Ascending Triangle / Descending Triangle / Falling Wedge / Rising Wedge as topology subclasses; do not create new independent scores if DL-002N latent geometry already represents them.
2. Define Pattern Confidence / Ambiguity without outcome-tuned weights; prefer component vectors, scale stability, pivot clarity and data-quality flags over one optimized score.
3. Deep-dive pattern failure timing: immediate rejection vs delayed failure vs successful retest, reusing R01 where possible.
4. Research weekly/daily nested-pattern relationships and whether weekly structural resistance explains daily breakout failures after controlling priorHigh60/MA60.
5. Specify detector implementation order: swing engine -> structural levels -> VCP/W/Platform -> Cup -> Flag/Triangle -> multi-candle patterns after OPEN/adjustment readiness.
6. Design the isolated Pattern Research cache schema and replay tests as a Class A research-only proposal; do not mutate shared Formal cache.
7. Implement synthetic/adversarial detector tests before return backtesting if research code is built.
8. Link pattern diagnostics prospectively to existing Shadow Candidate Archive and execution recorder only when date coverage is complete.
9. Reuse R01 and existing D1/D3/D5/D10/MFE/MAE outcomes; do not create R09 until definitions/data/redundancy work is frozen.
10. Continue external evidence search for genuinely independent pattern information and counter-evidence; avoid collecting more names without mechanism.

## Latest durable research commit
- `e32059b7d9faebf16b90bb5768e0552f88064bdc` — DL-002W price-volume structure.
