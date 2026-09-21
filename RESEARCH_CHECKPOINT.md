# Research Checkpoint

Updated: 2026-09-21T23:58+08:00

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
- Governance still classifies formal 15m/10m confirmation semantics as Class C; Execution Alpha remains diagnostic/Shadow unless explicitly approved.
- Prior checkpoint established a worthwhile candidate optimization: a minimal prospective Shadow Execution Recorder preserving exact feature availability and contemporaneous execution state without changing Formal Core.
- Owner has not explicitly approved code modification/deployment in the current continuation turn; no runtime code changed and no deployment/version claim is made.

## Research advanced this cycle — Priority 6 Execution Alpha / market-state observability

### Research question
What market-mechanism state must a prospective Execution Recorder preserve so VWAP/first30/10m/15m evidence is not falsely interpreted as normal continuous-trading execution?

### New supporting evidence
- Current TWSE trading-mechanism documentation confirms regular trading is call auction at the open, continuous trading during the intraday session, and call auction again at the close.
- TWSE intraday Volatility Interruption (VI) is a materially different execution state: when triggered, matching is postponed for two minutes, only limit ROD orders/cancellations/volume changes are accepted, market/IOC/FOK orders are not accepted, and resumption occurs by call auction before returning to continuous trading.
- TWSE also documents disposition / altered-trading-method securities where periodic call auction can apply. Therefore a generic `NORMAL` state is insufficient for execution research; identical price/VWAP features can have different fill mechanics depending on matching regime.
- This strengthens the recorder proposal because contemporaneous market-state provenance is necessary to distinguish execution quality from microstructure-state contamination.

### Counterevidence / falsification
- Market-mechanism documentation proves institutional states exist, but does not prove the current vendor/runtime exposes a reliable real-time field for every state. Engineering must not infer VI/disposition/periodic-call status from price patterns.
- A recorder without trustworthy state provenance could create false precision. Unsupported state remains UNKNOWN.
- This evidence does not establish that VWAP, first30 strength, 10m or 15m timing adds alpha. It only establishes a confounder that prospective execution research must control.

### Redundancy / bias firewall
- No new score, threshold, R09 or formal confirmation rule.
- `executionMarketState` is a provenance/control variable, not a bullish/bearish factor.
- Future tests must separate normal continuous-trading observations from VI/call-auction/disposition observations or mark state UNKNOWN; do not pool them as equivalent execution opportunities.
- Continue controls for prior-day momentum, breakout quality, `positiveDayRatio20`, `residualSectorRs20`, attention/volume state, scan-date clustering, slippage and transaction costs.

### UNKNOWN / data quality
- Whether current Fugle/other runtime quote payload exposes VI, halt/resume, disposition-periodic-call or equivalent machine-readable state remains UNKNOWN until exact call sites/payloads are inspected.
- If only official daily disposition lists are available, they can establish disposition status point-in-time but not necessarily every intraday VI interval.
- Historical exact execution state remains UNKNOWN where not prospectively captured.

### R01-R08 / I01-I07 impact
- R01-R08 and I01-I07 unchanged.
- No R09 created.
- Execution Alpha recorder proposal is strengthened: market-state provenance is now a required falsification/control field, not optional metadata.

## Engineering classification / actions this cycle
- Candidate recorder remains provisionally Class A only if isolated research persistence can reuse already-polled data, fail open, and avoid material latency/shared-schema risk.
- If reliable market-state capture requires new shared fetches, scheduling changes, or vendor calls that can affect formal runtime, classify Class B and stop before production promotion.
- Formal 10m/15m semantics remain Class C.
- No code modification/deployment this cycle; explicit owner approval is still required before program modification/deployment.

## Tests / deployment
- Code tests: not applicable; runtime unchanged.
- Research validation: governance/worklist/checkpoint recovered; current TWSE official trading-mechanism evidence reviewed for opening/continuous/closing and VI state semantics.
- Deployment: none.

## Decision status
- No new strategy rule is ready.
- The prospective Shadow Execution Recorder remains the only currently validated engineering candidate. This cycle adds a material design requirement: preserve trustworthy market-mechanism state/provenance and keep unsupported states UNKNOWN.
- Do not implement until owner explicitly approves the previously presented recorder optimization.

## Exact next continuation point
If owner explicitly approves the prospective Shadow Execution Recorder, inspect current persistence bindings/schema and `Worker.js` quote/bar/monitoring call sites, including actual vendor payload fields for VI/halt/disposition/market-state observability. Determine Class A vs B before coding; create rollback branch; implement the smallest fail-open event recorder; run targeted + full regression and Formal Core invariant comparisons; only then use the authorized deployment chain and verify workflow + Production readback/health. If approval remains absent/deferred, continue Priority 6 research on modern post-2020 Taiwan individual-stock VWAP/first30 evidence and reliable market-state source coverage without modifying runtime.