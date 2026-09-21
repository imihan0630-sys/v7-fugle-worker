# Research Checkpoint

Updated: 2026-09-22T00:20+08:00

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
- Prior checkpoint established the prospective Shadow Execution Recorder as the only validated engineering candidate; owner approval to modify/deploy has not yet been given.
- No runtime code changed and no deployment/version claim is made this cycle.

## Research advanced this cycle — Priority 6 Execution Alpha / first30 falsification

### Research question
Does available Taiwan evidence justify turning early-session/first30 strength into a formal execution rule, or does it instead strengthen the case for prospective state recording and confounder controls?

### New supporting evidence
- Peer-reviewed 2021 research on Taiwanese ETFs documents intraday time-series momentum between early half-hour returns and the last half-hour return. However, the predictive effect of the first half-hour disappears after controlling for institutional and foreign-investor trading behavior. This is important evidence that an apparent first30 signal can be mediated by order-flow/investor-behavior state rather than represent independent execution alpha.
- Taiwan 0050 research (2003-2016 sample) likewise finds first-half-hour return can predict the final half hour, with stronger effects on high-volume/high-volatility and some macro/news states; it also reports non-universality during the 2008 crisis. This supports regime conditioning rather than a universal first30 rule.
- Separate Taiwan momentum research distinguishes intraday and overnight information and argues that these components can carry different return information, reinforcing the need not to collapse opening gap/overnight and intraday path into one momentum variable.
- TWSE Fact Book 2025 shows domestic individual investors still represented 54.07% of 2024 trading value, while foreign juridical investors represented 33.72%. Market participant composition therefore remains a material microstructure context and weakens any assumption that an ETF-era first30 relation transfers mechanically to current individual-stock Top6 execution.

### Counterevidence / falsification
- The strongest modern peer-reviewed Taiwan evidence located this cycle is for ETFs, not the system's individual-stock Top6 universe. External validity to individual stocks is therefore unproven.
- The ETF first-half-hour predictive effect disappears after controlling for institutional/foreign trading behavior, which is direct redundancy/confounding evidence against treating first30 return as standalone alpha.
- Older TWSE individual-stock contrarian evidence reports short-horizon reversals and that gross abnormal returns disappear after reasonable explicit transaction costs; the sample is old (2004), so it is not sufficient for current rule design but remains a useful falsification warning.
- No sufficiently strong post-2020 Taiwan individual-stock evidence was found this cycle that would justify a formal first30/VWAP threshold.

### Redundancy / bias firewall
- Do not add first30 return, opening gap, VWAP distance, or 10m/15m strength as a new score/gate based on the evidence above.
- Future prospective analysis must condition on or residualize at least: overnight/opening-gap component, prior-day momentum, breakout quality, `positiveDayRatio20`, `residualSectorRs20`, attention/volume state, market mechanism state, and where reliably available contemporaneous institutional/foreign order-flow state.
- Keep Selection Alpha separate from Execution Alpha: a feature that predicts later-day return may still fail to improve entry price, fill probability, slippage, MFE/MAE or net outcome after costs.
- Scan date remains the independence cluster; multiple Top6 stocks on one date are not six independent experiments.

### UNKNOWN / data quality
- Reliable point-in-time intraday institutional/foreign order-flow availability from current runtime/vendor remains UNKNOWN.
- Reliable real-time VI/halt/disposition market-state fields remain UNKNOWN until runtime payload inspection after recorder approval.
- Current post-2020 individual-stock first30/VWAP evidence remains insufficient; do not substitute ETF evidence as if it were individual-stock evidence.

### R01-R08 / I01-I07 impact
- R01-R08 and I01-I07 unchanged.
- No R09 created.
- No formal factor/threshold promoted.
- Execution Recorder rationale is strengthened: prospective observation is needed precisely because literature signals are regime-, participant-, instrument- and cost-sensitive.

## Engineering classification / actions this cycle
- No new engineering proposal beyond the previously presented prospective Shadow Execution Recorder.
- Recorder remains provisionally Class A only if isolated, fail-open, reuse-only and unable to alter formal latency/output; otherwise Class B.
- Formal 10m/15m semantics and any first30/VWAP trading rule remain Class C.
- Per owner authorization, no program modification or deployment without explicit approval.

## Tests / deployment
- Code tests: not applicable; runtime unchanged.
- Research validation: governance/worklist/checkpoint recovered; modern Taiwan ETF intraday evidence, Taiwan 0050 evidence, participant-composition evidence and older individual-stock transaction-cost falsification reviewed.
- Deployment: none.

## Decision status
- No first30/VWAP rule is ready for engineering or Formal Core proposal.
- The prospective Shadow Execution Recorder remains the only optimization currently worth implementing, because it enables genuine prospective falsification without pretending historical exact state can be reconstructed.
- No additional owner decision is required unless/until the owner chooses to approve that recorder.

## Exact next continuation point
If recorder approval remains absent/deferred, continue Priority 6 by investigating point-in-time source coverage for contemporaneous execution-cost proxies and order-flow state that can be captured without new shared vendor calls: bid/ask spread where available, quote depth/imbalance where available, realized slippage proxy, and whether current already-polled payloads expose sufficient fields. Falsify each against redundancy with liquidity/volume/price and against transaction-cost circularity. Do not code. If owner explicitly approves the recorder, instead inspect persistence bindings/schema and `Worker.js` quote/bar/monitoring call sites plus vendor payload fields, classify A vs B before coding, create rollback branch, implement minimal fail-open recorder, run targeted/full regression and Formal Core invariant comparisons, then deploy only if authorized and verify workflow + Production readback/health.