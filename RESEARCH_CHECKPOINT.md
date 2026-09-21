# Research Checkpoint

Updated: 2026-09-21T23:10+08:00

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
- Main `Worker.js` currently documents the intended live architecture as minute Quote polling with 10m/15m K updates only after bar close, but the repository-level audit did not find an existing research recorder that durably stores exact `barStartAt`, `barEndAt`, `lastTradeAt`, `featureKnownAt`, `decisionAt`, VWAP-at-decision, or market-mechanism-state fields for later falsification.
- No Production version/health claim is made this cycle because no runtime code was changed/deployed.

## Research advanced this cycle — Priority 6 Execution Alpha / falsifiability and runtime observability

### Research question
Does the current system expose enough point-in-time intraday state to falsify VWAP/opening-gap/first-30-minute/10m/15m execution hypotheses without reconstructing unavailable historical information?

### New supporting evidence
- `Worker.js` explicitly states the production design polls Quote each minute and updates 10m/15m K only after bars close. This is directionally compatible with PIT-safe execution research because it recognizes bar completion rather than treating a bar label as immediately known.
- Taiwan evidence supports continued investigation of first-30-minute information: a Taiwan index-futures study reports positive association between first-half-hour and last-half-hour returns, with stronger intraday momentum in some high-volume/high-volatility/news states.
- Broader intraday research finds exact-time-of-day return continuation can exist, but also finds sub-hour reversals can be driven by temporary liquidity imbalance and bid-ask bounce; execution timing can reduce costs rather than necessarily create new Selection Alpha.

### New counterevidence / direction convergence
- The current repository audit found no durable research schema/recorder for the exact timestamps and contemporaneous VWAP/market-state fields needed to distinguish genuinely known-at-decision information from later reconstruction. Therefore historical backfill of these fields would violate the PIT firewall and is prohibited.
- Evidence for first-30-minute momentum is not directly transferable to individual Taiwan stocks: the strongest Taiwan result located this cycle is TAIEX futures, not the system's cross-sectional stock-selection universe.
- Taiwan intraday volatility is strongly time-of-day dependent, with exceptionally high opening volatility; raw opening-gap/first30 thresholds risk measuring opening microstructure rather than execution quality.
- A recent systematic falsification study in another market found many OHLCV intraday signal families fail after realistic execution/OOS constraints. It is not Taiwan evidence, but is useful counterevidence against assuming gap/VWAP/opening-range diagnostics automatically create net alpha.

### Redundancy / bias firewall
- Do not promote `openingGapPct`, `first30Return`, `priceVsVWAP`, 10m or 15m states as separate factors merely because each looks predictive.
- Any future incremental test must control prior-day momentum, breakout quality, `positiveDayRatio20`, `residualSectorRs20`, attention/volume state and market regime.
- Selection Alpha and Execution Alpha remain separate: a diagnostic is useful if it improves fill quality, adverse-selection avoidance, slippage, or timing even if it adds no cross-sectional selection power.
- Same-day symbols remain clustered evidence; transaction costs/slippage and realistic next-observable fill timing are mandatory.
- No historical reconstruction of exact intraday state from EOD bars is allowed for prospective execution experiments.

### UNKNOWN / data quality
- Exact 10m/15m feature availability timestamps not durably recorded = UNKNOWN for historical timestamp-sensitive tests.
- VWAP-at-decision not durably recorded = UNKNOWN; end-of-session VWAP cannot substitute.
- Market mechanism state (continuous/VI/halt-resume/disposition periodic call/etc.) not durably recorded = UNKNOWN.
- Individual-stock first-30-minute incremental alpha in the Taiwan universe remains UNKNOWN; index-futures evidence cannot be silently generalized.

### R01-R08 / I01-I07 impact
- R01-R08 and I01-I07 unchanged.
- No R09, score, threshold, gate, formal confirmation rule, monitoring rule, or push behavior added.
- Execution Alpha direction has narrowed: the next useful evidence is prospective observability/falsification, not another retrospective OHLCV factor search.

## Engineering classification / actions this cycle
- No runtime/program modification or deployment.
- A prospective Shadow execution-state recorder is increasingly justified as a potential Class A research improvement because it would record evidence without changing formal outputs; however, per owner authorization, no code change will occur until a concrete optimization proposal is presented and explicitly approved.
- Any change to formal 15m/10m confirmation semantics remains Class C.
- Formal invariants unchanged by construction.

## Tests / deployment
- Code tests: not applicable; runtime code unchanged.
- Repository audit: inspected governance/worklist/checkpoint, repository tree and `Worker.js` architecture comments/current main source.
- Production deployment/readback: none performed because no code was changed.

## Decision status
- Research has materially converged on a candidate engineering need: prospective PIT execution-state recording may improve falsifiability and prevent future look-ahead. It is not yet an approved program optimization; before asking the owner to approve code, specify the minimal isolated recorder schema, storage cost, protected invariants, and evidence it would unlock.

## Exact next continuation point
Continue Priority 6 Execution Alpha without changing code: design the smallest isolated prospective Shadow execution-state recorder proposal and verify that it can record `barStartAt`, `barEndAt`, `lastTradeAt`, `featureKnownAt`, `decisionAt`, contemporaneous VWAP inputs/value, opening/first30 diagnostics, and `executionMarketState` without touching formal candidate eligibility, ranking, 15m/10m confirmation semantics, monitoring, push, capital or trade decisions. Estimate storage/API cost and define targeted/regression invariants. In parallel, continue searching for individual-stock Taiwan evidence and counterevidence on first-30-minute/VWAP execution effects. Only when the combined case is clearly worth engineering should the owner receive a concrete proposal for explicit approval before modification/deployment.
