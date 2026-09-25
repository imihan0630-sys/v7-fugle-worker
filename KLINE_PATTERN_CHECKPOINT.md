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

- DL-002X Pennant / triangle subclasses / wedges

- DL-002Y Pattern Confidence / Ambiguity Profile

- DL-002Z Pattern Failure Timing / Acceptance Lifecycle

- DL-003A detector algorithm architecture comparison

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
1. Specify isolated Pattern Research cache schema with raw/adjusted OHLC, provenance, corporate-action flags, feature snapshots and detector-version metadata.
2. Specify deterministic as-of-date replay tests: fetched data -> swing engine -> topology -> pattern state must reproduce the historical snapshot exactly.
3. Define implementation order: research data layer -> swing engine -> structural levels -> VCP/W/Platform -> Cup -> Flag/Triangle/Wedge -> candlesticks/gaps after OPEN/adjustment readiness.
4. Define Pattern Research observability: coverage, data-blocked rate, repaint/prefix-invariance, detector disagreement, compute cost.
5. Research nested weekly/daily structure and whether weekly resistance explains daily R01 failures after controlling priorHigh60/MA60.
6. Keep primary detector architecture frozen: confirmed Directional-Change-style swings + transparent topology; PIP/kernel as independent robustness checks; DTW exploratory; ML deferred.
7. Implement synthetic/adversarial detector tests before any forward-return optimization if code is built.
8. Link diagnostics prospectively to Shadow Candidate Archive and execution recorder only when date coverage is complete.
9. Reuse R01 and existing D1/D3/D5/D10/MFE/MAE outcomes; do not create R09 yet.
10. Keep Formal Core unchanged until mature evidence supports a specific owner-approved proposal.

## Latest durable research commit
- `3377f6ded3eaeb4223b0f68562164da58554a495` — DL-003A detector architecture comparison.


## Continuation update — DL-003D
- Live connected Fugle audit found an important parameter-contract problem: `FCNT000154` requested with `adjusted=false` returned payload metadata `adjusted:true` for both TWSE 2412 and TPEx 6488. Therefore this connector route cannot certify RAW-vs-ADJUSTED parity; mismatch must block raw-gap/corporate-action validation rather than silently pass.
- C1-C8 counterexample fixtures are now frozen with deterministic synthetic inputs and expected detector states in `KLINE_PATTERN_RESEARCH.md`.
- Existing V8.7.2 Shadow Candidate Archive is confirmed as the Pattern parent population. Stable Pattern parent identity is `(scan_date,symbol)` plus parent snapshot hash; cohort_rank is not an identity key.
- Pattern v0.1 status: SPEC_READY / DATA_CONTRACT_GUARDED / NOT_IMPLEMENTED.
- Formal Core unchanged / LOCKED.

### Updated exact next continuation point
1. Resolve an authenticated RAW corporate-action source/path or prove the provider connector can truly return adjusted=false; until then RAW corporate-action fixture remains DATA_BLOCKED.
2. Translate frozen C1-C8 fixtures into executable isolated detector tests before any outcome study.
3. Implement only the lowest-level isolated research primitives first: data validator -> swing engine -> structural levels -> W/VCP/Platform; no full-universe scan and no Formal dependency.
4. Require prefix-invariance/replay exactness and Formal-isolation regression before enabling prospective Pattern logging.
5. Continue weekly/daily nested-resistance research controlling priorHigh60/MA60/R01 redundancy.

Latest durable research commit before this checkpoint update: `1fc02001fc0fea01b1ab42464b7901c6fec18c1d`.
