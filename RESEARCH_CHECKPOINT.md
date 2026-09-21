# Research Checkpoint

Updated: 2026-09-21T22:51+08:00

## Continuity / baseline
- Formal Core: LOCKED.
- Repository: `imihan0630-sys/v7-fugle-worker`.
- Production Worker: `fugle-test` / `https://fugle-test.imihan0630.workers.dev/`.
- Actual Production readback must override remembered/chat version strings.
- Prospective Shadow begins 2026-09-21; no fabricated historical Shadow.
- Missing evidence remains UNKNOWN, never BAD/0.
- Owner authorization rule: research may continue autonomously, but program modification/deployment requires first presenting a validated optimization proposal and receiving explicit owner approval.

## Repository state recovered this cycle
- Read main `RESEARCH_ENGINEERING_GOVERNANCE.md`, `RESEARCH_WORKLIST.md`, and this checkpoint before continuing.
- Read `REQUIREMENTS_30.md` for current formal-runtime constraints and historical deployment context.
- Governance still classifies formal 15m/10m confirmation semantics as Class C; Execution Alpha research must therefore remain diagnostic/Shadow until an explicit strategy decision.
- Production HTTP readback was not required for a deployment because no runtime code was changed this cycle; no Production version/health claim is made.

## Research advanced this cycle — Priority 6 Execution Alpha / timestamp semantics

### Research question
Before testing VWAP, opening gap, first-30-minute structure, or 15m/10m execution confirmation, what Taiwan-market timestamp and market-mechanism semantics are required to prevent look-ahead and false Execution Alpha?

### New supporting evidence
- Current TWSE rules specify regular market hours 09:00–13:30.
- TWSE mechanism documentation confirms opening is a call auction, intraday trading is generally continuous, and closing is a call auction; volatility interruption can postpone matching and resume through call auction.
- Taiwan intraday research finds opening volatility is exceptionally high and then materially lower/stabler through the remainder of the session (historically L-shaped rather than a generic US-style U-shaped assumption).
- Taiwan order-flow research finds both informed and liquidity-driven orders are concentrated around open/close; opening activity therefore cannot be assumed to be pure directional information.

### New counterevidence / direction convergence
- A raw `first30Return > 0`, `openingGap > 0`, or `price > VWAP` rule is not yet justified as independent alpha. Opening moves mix information, accumulated overnight orders, liquidity demand, and opening-call-auction price discovery.
- 10m/15m bars cannot be interpreted safely from bar labels alone. Research must distinguish `bar_start`, `bar_end`, `last_trade_at`, `feature_known_at`, and `decision_at`; a feature is PIT-eligible only if `feature_known_at <= decision_at`.
- Bars crossing or following volatility interruption, trading halt/resumption, periodic call auction/disposition regimes, or closing auction are not mechanically comparable with ordinary continuous-trading bars.
- Therefore Execution Alpha should first be treated as execution-state observability, not as another Selection score.

### Proposed preregistered research states (not implemented)
- `executionMarketState`: OPEN_CALL_AUCTION / CONTINUOUS / VI_CALL_AUCTION / HALT_RESUME_CALL_AUCTION / DISPOSITION_PERIODIC_CALL / CLOSE_CALL_AUCTION / UNKNOWN.
- `barStartAt`, `barEndAt`, `lastTradeAt`, `featureKnownAt`, `decisionAt`.
- Diagnostics only: `openingGapPct`, `first30Return`, `first30VolumeShare`, `sessionVWAP`, `priceVsVWAP`, `vwapDistanceAtr`, plus realistic/slippage-aware hypothetical fill timestamps.
- Opening diagnostics must be normalized/stratified for time-of-day volatility rather than compared with generic intraday thresholds.

### Redundancy / bias firewall
- Selection Alpha contamination: opening-gap/first30 strength may simply re-express prior-day momentum, breakout quality, `positiveDayRatio20`, residual sector strength, or attention/volume state. Incremental tests must control those incumbents.
- Look-ahead: never use a completed 15m/10m bar before its true end/availability timestamp; never use session VWAP computed with future trades.
- Market-mechanism bias: VI/disposition/halt-resume/call-auction observations require state labels or separate cohorts; do not silently pool with continuous trading.
- Trading costs: any execution improvement must survive spread/slippage/impact and realistic fill timing.
- Date clustering: same-day multiple symbols remain one clustered evidence date for maturity diagnostics.
- Factor Zoo: no separate scores for gap, VWAP, first30, 10m, and 15m without demonstrated incremental value; begin as diagnostics.

### UNKNOWN / data quality
- Missing exact trade/bar availability timestamps = UNKNOWN/PIT-ineligible for timestamp-sensitive experiments.
- Missing market-mechanism state = UNKNOWN; do not assume CONTINUOUS.
- A session VWAP unavailable at decision time cannot be reconstructed from end-of-day data for prospective decision testing.

### R01-R08 / I01-I07 impact
- R01-R08 and I01-I07 unchanged.
- No R09, score, threshold, gate, formal confirmation rule, monitoring rule, or push behavior added.
- This cycle establishes the data-governance prerequisites for any future Execution Alpha experiment.

## Engineering classification / actions this cycle
- No runtime/program change. Documentation/checkpoint only, required for durable research continuity.
- Any change to formal 15m/10m confirmation semantics remains Class C under governance.
- A future isolated Shadow execution-state recorder could potentially be proposed as Class A, but it is NOT yet approved or implemented; owner must first be notified that the knowledge is worth engineering and explicitly approve modification/deployment.
- Formal invariants unchanged by construction.
- Deployment: none.
- Rollback: revert this checkpoint commit if needed.

## Tests / deployment
- Code tests: not applicable; runtime code unchanged.
- Production deployment/readback: none required/performed this cycle because no runtime code changed.

## Decision status
- Current knowledge is meaningful research progress but NOT YET sufficient to recommend a program optimization. Continue research before asking for engineering approval.

## Exact next continuation point
Continue Priority 6 Execution Alpha without coding: establish whether a Shadow execution-state recorder would materially improve falsifiability and whether current runtime already exposes exact 10m/15m bar-close timestamps, trade timestamps, VWAP-at-decision, and market-mechanism state. Then research incremental evidence for VWAP/opening-gap/first-30-minute diagnostics after controlling prior-day momentum, `positiveDayRatio20`, `residualSectorRs20`, volume/attention state, and realistic transaction costs. Only if the combined evidence survives counterevidence and is clearly worth engineering should an optimization proposal be presented to the owner for explicit approval before any program modification/deployment.
