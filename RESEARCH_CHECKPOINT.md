# Research Checkpoint

Updated: 2026-09-22T07:35+08:00

## Continuity / baseline
- Formal Core: **LOCKED**.
- Repository: `imihan0630-sys/v7-fugle-worker`.
- Production Worker: `fugle-test` / `https://fugle-test.imihan0630.workers.dev/`.
- Actual Production readback overrides remembered/chat version strings.
- Prospective Shadow begins 2026-09-21; no fabricated historical Shadow.
- Missing evidence remains UNKNOWN, never BAD/0.
- R01-R08 and I01-I07 remain frozen unless explicitly versioned; no R09 currently exists.

### Continuity enforcement — 2026-09-22T07:35+08:00
- Active user rule reaffirmed: once a research cycle is explicitly started, continue autonomously through all non-human steps. Do not stop merely to narrate progress.
- Permitted stop conditions are limited to: genuine MFA/reauth/secret/permission blocker, explicit Class B/Class C production decision, or a true technical blocker that connected tools cannot resolve.
- Ordinary findings, provenance recovery, research notes, Class A diagnostics, repository reads, falsification work and checkpoint persistence are continuation points, not stop points.
- When one research subtask completes, immediately advance to the next checkpoint item; report only at a genuine stop boundary or when explicitly asked for status.

## Current production research infrastructure
### V8.8.0 — Prospective Shadow Execution Recorder
- Production readback after deployment: `8.8.0-shadow-execution-recorder`.
- Sparse research-only snapshots: OPEN_BASELINE, FIRST_10M_COMPLETE, FIRST_15M_COMPLETE, FIRST_30M_COMPLETE, FORMAL_SIGNAL_OBSERVED when a formal notification event exists.
- PIT timestamps/freshness are stored; no historical execution Shadow was fabricated.
- Merge: `e9fe3c94c826593b9f2b85e6fdfc5c09b62b4646`; rollback source: `9951b93b308f5ef7bfb0f244ffca6ded90e54cea`.

### V8.8.1 — Execution Source Coverage
- Production deployment workflow run 90: SUCCESS.
- Research schema: `execution-shadow-v2`.
- Zero-additional-call fields from already-polled Fugle quote: openingGapPct, sessionAvgPrice / explicitly labeled VWAP proxy, best spread, five-level bid/ask depth and depthImbalance, conservative executionMarketState.
- Market state remains UNKNOWN when flags are insufficient; no claim of disposition/VI identification.
- Merge: `9283719e661e42a09b3b0d9fdfe27d54f3753d3e`; V8.8.0 is rollback baseline.
- No A/B, ranking, Top6, 3+3, capital, entry/add/reduce/sell/stop, monitoring eligibility or push behavior change.

## P2 research status — Execution Research Readiness
Status: **ACCUMULATING / RESEARCH ONLY**.

### Taiwan price-path / intraday prior
Durable note: `research/notes/P2_2026-09-22_0552_ID_INTRADAY_PRIOR.md`.
- Taiwan evidence supports path persistence / continuous-information underreaction as a stronger prior than raw cumulative return alone.
- Positive opening gap is not assumed bullish; overnight momentum can reverse while intraday momentum continues.
- Price-limit regime and turnover remain explicit falsification dimensions.
- Spread remains transaction-cost/liquidity evidence; five-level depth imbalance remains descriptive until prospective incremental evidence survives controls.

### Path-quality overlap audit — 2026-09-22 06:44
Durable note: `research/notes/P2_2026-09-22_0644_PATH_OVERLAP_AUDIT.md`; commit `be85cde98b4b9e4e681665add181865b53090903`.

New convergence:
1. `research/incremental_v8_7_7.js` already preregisters I02 persistence beyond residual RS and I03/I04 breakout quality vs attention volume. These are existing counted research dimensions and are the first redundancy/falsification controls for any future ID/path proposal.
2. R01, R05, R07 and R08 already cover breakout holding/failure, overnight-vs-intraday decomposition, and attention-vs-strength paths. A new information-discreteness factor now would materially expand the Factor Zoo before existing overlap is falsified.
3. Checked-in base `Worker.js` exposes raw path ingredients (ret20/ret60, volumeTodayVsPrev5, volatility20, priorHigh20, close position, upper shadow, MA structure/breakout setup), but literal deployed research definitions for `positiveDayRatio20` / `price.persistenceScoreResearch` / `setup.breakoutQualityResearch` were not located in the base source/code search. Their exact formulas must therefore be recovered from the generated/deployment research patch chain or production research schema before any new diagnostic is registered.
4. `positiveDayRatio20` is **UNKNOWN at definition-provenance level** for this audit. Do not infer its formula from its name, and do not treat this as evidence that the field is absent from deployed research snapshots.
5. Combining persistence + positive-day ratio + breakout quality after observing outcomes would itself be a new experiment/variant and is prohibited without preregistration.

#### Exact formula provenance recovery — 2026-09-22T06:53+08:00
Source recovered from `scripts/apply_v8_7_1.py` rather than inferred from field names.

- `positiveDayRatio20`: from up to the latest 20 one-day close-to-close returns available through scanDate; percentage of finite returns strictly > 0.
- `persistenceScoreResearch`: requires at least 3 finite components, then computes `0.35*positiveDayRatio20 + 0.25*positiveHorizonPct + 0.20*ddQuality + 0.20*maQuality`. `positiveHorizonPct` is the percentage of positive ret5/ret10/ret20/ret60; `ddQuality=clamp(100 + maxDrawdown20Pct*5,0,100)`; `maQuality` is 0/50/100 from close above MA20 and MA60. Important implementation detail: the weighted expression uses `(positiveDayRatio20||0)`, `(positiveHorizonPct||0)`, `(ddQuality||0)`, so a missing component among the allowed one can contribute zero after the >=3 finite-component gate.
- `setup.breakoutQualityResearch`: `clamp(dailyClosePosition*35 + (1-dailyUpperShadowRatio)*25 + clamp((volVs5||0)/2,0,1)*25 + clamp(((breakoutPct||0)+1)/4,0,1)*15,0,100)`.
- `dailyClosePosition=(close-low)/(high-low)` with 0.5 on zero range; `dailyUpperShadowRatio=(high-max(open,close))/(high-low)` with 0 on zero range; `volVs5=todayVolume/avg(previous5 volumes)`; `breakoutPct=(close/priorHigh20-1)*100`.
- Snapshot provenance: prospective snapshots use `research-snapshot-v2`; `positiveDayRatio20` prefers an existing item field when present, otherwise reconstructed researchPrice; persistence/breakout quality are reconstructed from historical bars through scanDate.
- Existing preregistered redundancy controls confirmed in `research/incremental_v8_7_7.js`: I02 tests Persistence beyond Residual RS; I03/I04 directly test Breakout Quality vs Attention Volume with within-scan-date demeaning and D5 partial correlation. Maturity remains >=60 samples and >=15 distinct scan dates.

Overlap implication:
1. Persistence is structurally a composite of path breadth (positive-day ratio), multi-horizon momentum, drawdown quality, and MA state; it is not an independent primitive. Any future Information Discreteness/path score using positive-day breadth or multi-horizon sign would mechanically overlap.
2. Breakout Quality already embeds attention volume at 25% plus breakout distance at 15%; therefore treating raw volume and breakout quality as separate independent confirmations can double-count volume. I03/I04 are the correct preregistered falsification pair before adding another path-quality factor.
3. No new factor/threshold/window is registered. R01-R08 and I01-I07 stay frozen; Formal Core remains LOCKED.

## R01-R08 / I01-I07 impact
- R01-R08 unchanged; I01-I07 unchanged; no R09.
- I02/I03/I04 explicitly serve as redundancy controls for future path/ID hypotheses.
- R05 remains the execution-path prior; R07/R08 remain attention controls.
- No Formal Core change.

## Bias / data-quality firewall
- UNKNOWN remains UNKNOWN; no BAD/0 coercion.
- No historical execution-shadow-v2 backfill.
- Independent scan date remains the primary evidence unit; same-day stocks are clustered observations.
- No causal claim from contemporaneous correlations.
- No outcome-driven ID window, gap threshold, intraday-confirmation threshold or holding period introduced.
- Turnover can be both attention proxy and conditioning variable; avoid double-counting correlated information.
- Disposition/VI-specific state remains UNKNOWN until a reliable official PIT source distinguishes it.

## Engineering status this cycle
- Classification: research interpretation / provenance audit only.
- No code change, branch, PR, regression test or deployment required.
- Formal Core remains LOCKED.
- Durable note commit this cycle: `be85cde98b4b9e4e681665add181865b53090903`.

## Exact next continuation point
Priority 6 Execution Alpha remains in **P2 research-readiness / coverage diagnostics**. Continue without user interaction unless a B/C decision or genuine blocker appears:
1. With exact formulas now recovered, map term-level overlap against R01/R05/R07/R08 and I02/I03/I04, especially positive-day breadth, multi-horizon sign, volume attention and breakout distance; do not register a new factor yet.
2. Inspect prospective research snapshots once 2026-09-22 trading-day data exists and quantify field-level coverage by independent scan date; keep missing fields UNKNOWN.
3. Continue Taiwan evidence review on path persistence, turnover-conditioned momentum and regime sensitivity; prefer falsification/redundancy work over adding factors.
4. Let prospective execution-shadow-v2 accumulate actual trading-day snapshots; never fabricate/backfill historical execution fields.
5. When snapshots exist, read field-level coverage by independent scan date for openingGapPct, sessionAvgPrice/VWAP proxy, spreadPct, depthImbalance and executionMarketState before directional inference.
6. Preserve spread as execution-cost/liquidity control, depth imbalance as descriptive state, and opening gap as diagnostic/control until prospective evidence survives controls.
7. No formal execution gate/score proposal until prospective/OOS evidence survives Selection Alpha, momentum/attention, residual RS, liquidity/volatility, transaction-cost and date-cluster controls.
