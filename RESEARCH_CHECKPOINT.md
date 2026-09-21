# Research Checkpoint

Updated: 2026-09-22T05:57+08:00

## Continuity / baseline
- Formal Core: **LOCKED**.
- Repository: `imihan0630-sys/v7-fugle-worker`.
- Production Worker: `fugle-test` / `https://fugle-test.imihan0630.workers.dev/`.
- Actual Production readback overrides remembered/chat version strings.
- Prospective Shadow begins 2026-09-21; no fabricated historical Shadow.
- Missing evidence remains UNKNOWN, never BAD/0.
- R01-R08 and I01-I07 remain frozen unless explicitly versioned; no R09 currently exists.

## Current production research infrastructure
### V8.8.0 — Prospective Shadow Execution Recorder
- Production readback after deployment: `8.8.0-shadow-execution-recorder`.
- Sparse research-only snapshots: OPEN_BASELINE, FIRST_10M_COMPLETE, FIRST_15M_COMPLETE, FIRST_30M_COMPLETE, FORMAL_SIGNAL_OBSERVED when a formal notification event exists.
- PIT timestamps/freshness are stored; no historical execution Shadow was fabricated.
- Merge: `e9fe3c94c826593b9f2b85e6fdfc5c09b62b4646`; rollback source: `9951b93b308f5ef7bfb0f244ffca6ded90e54cea`.
- Regression / Repair CI / deployment verification passed.

### V8.8.1 — Execution Source Coverage
- Production deployment workflow run 90: SUCCESS.
- Research schema: `execution-shadow-v2`.
- Zero-additional-call fields from already-polled Fugle quote: openingGapPct, sessionAvgPrice / explicitly labeled VWAP proxy, best spread, five-level bid/ask depth and depthImbalance, conservative executionMarketState.
- Market state remains UNKNOWN when flags are insufficient; no claim of disposition/VI identification.
- Merge: `9283719e661e42a09b3b0d9fdfe27d54f3753d3e`; V8.8.0 is rollback baseline.
- No A/B, ranking, Top6, 3+3, capital, entry/add/reduce/sell/stop, monitoring eligibility or push behavior change.

## P2 research status — Execution Research Readiness
Status: **ACCUMULATING / RESEARCH ONLY**.

### Microstructure falsification prior
- Taiwan evidence supports treating spread primarily as transaction-cost/liquidity evidence rather than directional alpha.
- Five-level depth imbalance is descriptive microstructure state until prospective evidence shows incremental predictive/execution value after controls.
- Do not interpret aggregate book imbalance as institutional flow; current five-level book has no trader identity.
- Required controls include contemporaneous momentum/return, positiveDayRatio20, residualSectorRs20, turnover/attention, spread/liquidity, volatility, overnight gap, market state, transaction costs and scan-date clustering.

### New Taiwan price-path / intraday evidence — 2026-09-22
Durable detailed note: `research/notes/P2_2026-09-22_0552_ID_INTRADAY_PRIOR.md`.

Research convergence:
- Taiwan-specific information-discreteness evidence reports stronger earnings-momentum continuation when information arrives more continuously / attracts less attention; price-limit events are attention-grabbing discrete events.
- Taiwan momentum-persistency evidence reports that high turnover among nominal winner/loser portfolios attenuates ordinary momentum, while persistent winners/losers show stronger intermediate continuation.
- Taiwan intraday-vs-overnight evidence reports positive intraday momentum but negative overnight momentum, consistent with intraday underreaction versus overnight overreaction/correction.
- A Taiwan 2000-2021 short-term study reports a market-structure caveat: average reversal before the 2015 price-limit relaxation and average short-term momentum after it; turnover-conditioned momentum and reversal can coexist.

Research implications / falsification rules:
1. Price-path quality / persistence has a stronger Taiwan prior than raw cumulative return alone, but this does **not** justify a new factor yet.
2. Positive opening gap must not be assumed bullish. Future P2 analysis should distinguish gap + intraday confirmation from gap without confirmation, but no threshold/classification is registered yet.
3. Information discreteness overlaps conceptually with existing persistence, positiveDayRatio20, breakout quality and R07/R08 attention proxies. A new ID factor now would create material redundancy / Factor-Zoo risk.
4. Taiwan's price-limit regime and turnover are explicit falsification dimensions; effects isolated to one regime or turnover bucket are not general evidence.
5. Do not tune ID windows, gap thresholds, intraday confirmation thresholds or holding periods after seeing Shadow outcomes. Any new definition requires a separately preregistered experiment/version.

### R01-R08 / I01-I07 impact
- R05 receives stronger Taiwan-specific external prior; its definition is unchanged.
- R03/R04/R07/R08 remain required comparators/controls.
- R01-R08 unchanged; I01-I07 unchanged; no R09 created.
- No Formal Core change.

## Bias / data-quality firewall
- UNKNOWN remains UNKNOWN; no BAD/0 coercion.
- No historical execution-shadow-v2 backfill.
- Independent scan date remains the primary evidence unit; same-day stocks are clustered observations.
- No causal claim from contemporaneous correlations.
- Turnover can be both attention proxy and conditioning variable; avoid double-counting correlated information.
- Disposition/VI-specific state remains UNKNOWN until a reliable official PIT source distinguishes it.

## Engineering status this cycle
- Classification: research interpretation only.
- No code change, branch, PR, regression test or deployment required.
- Formal Core remains LOCKED.
- Durable research note commits: `d260c593e3a2be728e6779ab434d6efed72c2a88`, extended by `a8cfdf5f7155d94d4bc9e59a6f402551a99e951a`.

## Exact next continuation point
Priority 6 Execution Alpha remains in **P2 research-readiness / coverage diagnostics**. Continue without user interaction unless a B/C decision or genuine blocker appears:
1. Inspect repository definitions / generated patch chain for persistence, positiveDayRatio20 and breakout/path-quality fields to map overlap with information discreteness before proposing any new Shadow diagnostic.
2. Continue Taiwan evidence review on path persistence, turnover-conditioned momentum and regime sensitivity; prefer falsification/redundancy work over adding factors.
3. Let prospective execution-shadow-v2 accumulate actual trading-day snapshots; never fabricate/backfill historical execution fields.
4. When snapshots exist, read field-level coverage by independent scan date for openingGapPct, sessionAvgPrice/VWAP proxy, spreadPct, depthImbalance and executionMarketState before directional inference.
5. Preserve spread as execution-cost/liquidity control and depth imbalance as descriptive state unless prospective incremental evidence survives controls.
6. Preserve opening gap as diagnostic/control until prospective evidence tests whether intraday confirmation separates continuation from overnight correction.
7. No formal execution gate/score proposal until prospective/OOS evidence survives Selection Alpha, momentum/attention, residual RS, liquidity/volatility, transaction-cost and date-cluster controls.
