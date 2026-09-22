# Research Checkpoint

Updated: 2026-09-22T11:07+08:00

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

### Live readiness + overlap continuation — 2026-09-22T07:42+08:00
- Production readback verified directly: `8.8.1-execution-coverage`, TEST_MODE=false, KV/D1 present. Public `/research` shell is reachable; protected `/api/research/dashboard` correctly returns 401 without ADMIN_TOKEN, so no secret was requested or exposed.
- Term-level overlap map:
  - R01 breakout hold/failure overlaps `breakoutQualityResearch` through breakout distance only; R01 outcome classification remains forward path evidence and is not mechanically identical.
  - R05 overnight/intraday decomposition is outcome-path evidence and does not mechanically overlap persistence, but any future opening-gap continuation score must control persistence/momentum rather than count both as independent confirmations.
  - R07/R08 attention proxy `volumeTodayVsPrev5` is already embedded at 25% inside breakout quality. I03/I04 therefore test a partially nested candidate/control pair; interpret attenuation as redundancy evidence, not as clean causal isolation.
  - I02 persistence vs residual RS is conceptually cleaner: persistence contains path breadth/multi-horizon trend/drawdown/MA state, while residual RS removes sector return. Correlation can still arise from momentum, but there is no direct formula nesting.
- Data-readiness constraint: 2026-09-22 market session has not yet produced mature execution-shadow-v2 evidence at this checkpoint; no directional Execution Alpha inference is permitted. Protected research API requires admin authorization, so field-level live coverage cannot be read anonymously.
- No new experiment, factor, threshold, window or formal rule registered. Formal Core remains LOCKED.

### Persistence / extreme-strength falsification — 2026-09-22T07:55+08:00
Further Taiwan evidence tightens the interpretation of the current persistence/overheat fields:
- Chen, Hsieh & Lee (2023) documents that roughly 46% of winner and 52% of loser constituents leave their groups immediately after formation in their six-month setup; nonpersistent members reverse, while persistent members show much stronger continuation. This supports studying persistence, but their academic definition is portfolio-membership persistence, not the system's `persistenceScoreResearch`.
- Lin, Xia, Yang & Yang (2020) finds extreme absolute-strength stocks in Taiwan are unusually volatile and can attenuate conventional momentum profitability; removing extremes improved their intermediate-term momentum results. This is relevant to the existing `overheatPenaltyResearch`, but does NOT validate its current formula or thresholds.

Falsification consequence:
1. Do not cite these papers as direct validation of `persistenceScoreResearch` or `overheatPenaltyResearch`; construct validity is incomplete because definitions differ.
2. Existing persistence score should be treated as a proxy family member, not "the literature's persistence factor".
3. Extreme-strength evidence increases the importance of checking whether apparent momentum/persistence benefit disappears after volatility/overheat controls; no new exclusion threshold is allowed from this evidence.
4. Future OOS diagnostics should separate "persistent path" from "extreme absolute strength / volatility" to avoid mistaking removal of unstable extremes for genuine continuation alpha.

## R01-R08 / I01-I07 impact
- R01-R08 unchanged; I01-I07 unchanged; no R09.
- I02/I03/I04 explicitly serve as redundancy controls for future path/ID hypotheses.
- R05 remains the execution-path prior; R07/R08 remain attention controls.
- No Formal Core change.

### Taiwan regime / overnight falsification extension — 2026-09-22T07:48+08:00
External literature review added a useful contradiction that prevents over-simplifying the earlier prior:
- Ho et al. (2023, Pacific-Basin Finance Journal) reports positive intraday-momentum returns and negative overnight-momentum returns in Taiwan, supporting the existing R05 separation.
- Zhang et al. (2023, Pacific-Basin Finance Journal) reports Taiwan overnight returns can show short-term persistence and long-term reversal associated with investor sentiment, with stronger short-term persistence when retail trading share is high. Therefore "overnight = reversal" is too strong; horizon and participant mix matter.
- Lin et al. (2016, Pacific-Basin Finance Journal) reports Taiwan momentum profits differ materially across market-state persistence vs transition: continuation in persistent states and reversal during transitions. This strengthens R06 as a falsification/control dimension rather than a new score.

Research implication:
1. Keep R05 definition unchanged. Do not encode positive/negative opening gap as bullish/bearish.
2. Treat openingGapPct as context; future execution analysis must distinguish immediate intraday continuation from longer-horizon correction and condition on market regime when sample size permits.
3. Do not create a retail-flow factor now: current execution-shadow-v2 does not capture a PIT retail-share field, and adding one before existing R05/R06 mature would expand the Factor Zoo.
4. No threshold/window changed; no new experiment registered.

### Existing-test sufficiency check — 2026-09-22T08:01+08:00
- I05 already preregisters `overheatPenaltyResearch` beyond `breakoutQualityResearch`; I07 preregisters compression beyond raw volatility. However, there is no frozen contrast that directly tests persistence beyond overheat/volatility.
- Do NOT add I08 yet. Adding a new contrast before the first prospective day matures would be technically permissible research-only work but is not currently justified: the immediate need is construct-validity and coverage, not another hypothesis count.
- Use existing I02/I05/I07 jointly as falsification context once mature: if persistence appears positive only where overheat is low or volatility/compression is favorable, treat that as a dependency requiring a separately preregistered future experiment rather than retrofitting the current definitions.
- This avoids expanding multiple-testing burden before any prospective evidence exists.

### Official TWSE microstructure constraint — 2026-09-22T08:08+08:00
Official TWSE trading-mechanism evidence was checked to constrain execution-shadow interpretation:
- Regular-session orders may enter from 08:30, but the opening is a call auction; continuous trading is 09:00-13:25 and the close is another call auction.
- Intraday Volatility Interruption can suspend matching for two minutes when a potential execution exceeds the applicable 3.5% reference band; matching resumes via call auction before continuous trading.
- Therefore an OPEN_BASELINE observation is structurally different from a normal continuous-session observation, and a spread/depth snapshot around opening or interruption cannot be assumed comparable to ordinary continuous trading.
- Current execution-shadow-v2 conservatively keeps mechanism state UNKNOWN unless quote flags verify it. That is correct; do not infer VI/disposition status from spread/depth shape.
- Future coverage analysis must stratify or at minimum label OPEN_BASELINE separately from FIRST_10M/15M/30M rather than pooling their spread/depth distributions.

No engineering change is needed yet: current recorder already stores stage and conservative market-state provenance. This is a research interpretation constraint, not a new trading rule.

### Execution-stage timing audit — 2026-09-22T08:15+08:00
Repository audit of `apply_v8_8_0.py` confirms stage windows are based on Taiwan clock:
- OPEN_BASELINE: 09:00-09:02
- FIRST_10M_COMPLETE: 09:11-09:12
- FIRST_15M_COMPLETE: 09:16-09:17
- FIRST_30M_COMPLETE: 09:31-09:32
- FORMAL_SIGNAL_OBSERVED: whenever formal notifications exist.

Interpretation:
- FIRST_10M/15M/30M are intentionally sampled after the named interval completes, reducing incomplete-bar look-ahead ambiguity.
- OPEN_BASELINE is not a pure pre-open order-book snapshot; it is an early post-opening observation that can contain the opening call-auction result plus the first continuous trades. Label must remain OPEN_BASELINE, not "opening auction microstructure".
- No timing change is justified before prospective coverage is observed. Any future stage-window change would create a new research measurement version and must preserve the old series.

### Execution Alpha conditioning audit — 2026-09-22T08:22+08:00
Repository audit of `research/counterfactual_v8_7_4.js` confirms:
- Execution Alpha uses only the first real formal BUY signal with a finite market price, measured as `(formalClose-entryPrice)/formalClose`; positive means the execution waited for a lower price.
- Plans with no BUY are excluded from the price-improvement distribution rather than coerced to 0, while `buyTriggerRate` separately reports BUY-triggered plans / selected plans.
- This avoids one bias (fake zero Execution Alpha) but creates an interpretation boundary: conditional price improvement among triggered BUYs is not the total economic value of the execution policy. A policy can show positive conditional price improvement while missing subsequent winners.
- Therefore future Execution Alpha evaluation must pair conditional entry improvement with trigger rate and opportunity-cost/path outcomes of no-BUY selected plans. Do not combine them into a single score until preregistered.

No code change yet: the existing recorder already preserves the needed selection and path data; first priority is prospective coverage/maturity.

### Execution-cost framework convergence — 2026-09-22T08:30+08:00
External execution literature check reinforces the conditioning audit:
- Implementation Shortfall frameworks explicitly include opportunity cost for unfilled intended quantity; evaluating only executed fills can make patient/non-filling execution look artificially good.
- This does not mean the current research metric is wrong: it is correctly labeled conditional entry-price improvement. It means it must not be promoted or described as total execution value.
- For this semi-automatic system, "no formal BUY triggered" is economically analogous to an unexecuted intended opportunity only after the intended quantity and evaluation horizon are defined prospectively. Those definitions are not yet frozen, so no synthetic opportunity-cost metric is created now.
- Existing D1/D3/D5/D10/D20 path outcomes plus buyTriggerRate are sufficient raw ingredients for a future preregistered decomposition after coverage matures.

This strengthens the current decision to accumulate rather than engineer another metric before the first prospective execution days exist.

### Taiwan turnover / attention contradiction audit — 2026-09-22T08:38+08:00
Fresh literature verification found an important reason not to hard-code one attention story:
- Chen, Hsieh & Lee (2023) finds persistent momentum in Taiwan and links longer winner/loser persistence to heterogeneous beliefs; turnover is used as one heterogeneous-belief proxy. Their persistency definition is consecutive portfolio membership, not this system's composite persistence score.
- Lin, Ko, Feng & Yang (2016) finds market-state continuation vs transition is crucial: momentum is positive during state continuation and reverses during transitions. In their turnover split, continuation-state momentum is concentrated in higher-turnover stocks, which they interpret through attention/overconfidence.
- Ho et al. (2023) separately finds intraday-momentum profitability is stronger in stocks more prone to underreaction, using information discreteness and turnover as attention measures; overnight momentum is negative.
- A 2022 NTU study covering 2000-2021 reports the 2015 widening of Taiwan price limits coincides with a shift from average reversal pre-change to modest short-term momentum post-change, with high-turnover and low-turnover groups showing opposite patterns after the change.

Convergence / falsification:
1. Turnover/volume cannot be assigned a universal sign such as "high attention bad" or "quiet strength always better". Taiwan evidence supports both underreaction and attention/overconfidence channels depending on horizon and market state.
2. R07/R08 are therefore correctly framed as competing path hypotheses rather than a ranking rule. Do not promote Quiet Strength merely because the information-discreteness literature is attractive.
3. R06 market-state transition is a mandatory conditioning/falsification dimension once sample maturity allows; pooling continuation and transition dates could cancel real effects or manufacture unstable averages.
4. The 2015 price-limit change is a historical regime boundary for external evidence, but prospective Shadow beginning 2026-09-21 cannot estimate that structural break itself. Use it only to reject naive transfer of older Taiwan estimates.
5. No new factor or threshold is justified.

### Readiness-gate semantic audit — 2026-09-22T08:45+08:00
Audit of `research/readiness_v8_7_10.js` found a research-governance nuance:
- R02 readiness currently gates only on >=20 Selection Alpha D5 paired dates. It includes BUY-trigger count as evidence, but does not require any minimum number of BUY-triggered plans before labeling R02 DESCRIPTIVE_READY.
- Because R02 is explicitly "Selection Alpha vs Execution Alpha", a future state could technically become DESCRIPTIVE_READY for Selection Alpha while Execution Alpha remains too sparse to interpret.
- This is a research-readiness semantics issue only; it does not alter Formal Core. Do not silently change the existing frozen readiness definition in the middle of accumulation.
- Record as a candidate Class A versioned readiness refinement after prospective BUY evidence begins: split R02 readiness into Selection-side and Execution-side sub-readiness rather than adding an arbitrary BUY threshold now.
- No code change in this cycle because choosing a BUY minimum before observing operational coverage would be an unnecessary new parameter and increase researcher degrees of freedom.

### Price-limit / microstructure knowledge extension — 2026-09-22T08:58+08:00
Additional Taiwan evidence narrows how execution and attention fields should be interpreted:
- Lin et al. (2016) finds information discreteness can isolate underreaction-driven earnings momentum in Taiwan, but Lin et al. (market-dynamics study) finds the same ID logic does not explain momentum conditional on market-state continuation/transition. This is direct construct-context evidence: an attention proxy can work for earnings-information momentum yet fail for price momentum.
- Yang et al. (2018) documents continuing-overreaction momentum in Taiwan that remains after controls for small firms, idiosyncratic volatility, illiquidity and turnover; price-limit handling materially affects the measure.
- Cho et al. (2003) documents a high-frequency magnet effect toward Taiwan price limits, especially the upper bound. Therefore extreme intraday strength near limits may reflect market-mechanism dynamics, not simply stronger information.
- Kuo et al. (2010) shows TWSE tick-size changes affected quoted spread, execution costs, depth and trade size. Hence raw spreadPct/depthImbalance are not timeless structural factors; they are execution-state variables whose scale depends on microstructure/tick regime.

Research consequences:
1. Do not equate volume/turnover attention proxies across earnings momentum, price momentum and execution microstructure.
2. Treat near-limit observations as a distinct contamination/control concern when interpreting breakout/attention and execution depth; current execution-shadow-v2 does not yet store distance-to-price-limit, so do not infer it retrospectively.
3. Spread/depth remain controls/descriptors, not alpha factors. Any future normalization should be versioned and preferably relative to price/tick/own-history rather than raw absolute spread/depth.
4. No new factor is registered now; this evidence increases falsification requirements rather than factor count.

### Tick-normalization / institutional-flow falsification — 2026-09-22T09:04+08:00
Current TWSE rules and Taiwan evidence add two controls:
- TWSE Article 62 uses a stepwise stock tick schedule (NT$0.01 below 10; 0.05 for 10-<50; 0.10 for 50-<100; 0.50 for 100-<500; 1 for 500-<1000; 5 for >=1000). Article 63 generally applies ±10% daily limits, with specified exceptions.
- Therefore percentage spread alone is not enough for cross-sectional execution comparison: the minimum feasible spread in percentage terms changes discontinuously at price bands. Future execution diagnostics should preserve `spreadPct` but derive a research-only `spreadTicks` or tick-normalized spread from the contemporaneous price/tick schedule before comparing low- and high-price names.
- This is especially relevant to the system's thousand-dollar-stock pool: a NT$5 tick at >=1000 creates a very different spread floor than sub-500 stocks. Pool-level comparisons could otherwise mistake mechanical tick geometry for liquidity/execution quality.
- Taiwan foreign-institution evidence is mixed for profitability: foreign investors have been documented as momentum traders, but prior foreign ownership can anchor/strengthen their momentum trading without improving momentum profitability. Thus institutional consecutive buying should not be treated as independent proof that a momentum setup has alpha; it remains a formal strategy input but research must control overlap with price momentum and ownership/size/liquidity context.

Candidate research-only engineering idea (not implemented yet): versioned `spreadTicks` in execution-shadow-v3, computed from the official current tick schedule. This is measurement normalization, not a formal trading rule. Because current v2 prospective series is just beginning, preserve v2 raw fields and only add a parallel derived field if engineering is later justified; never rewrite old snapshots.

### Attention/disposition as an omitted market-mechanism state — 2026-09-22T09:12+08:00
Official 2026 TWSE surveillance rules and recent Taiwan disposition research reveal a missing research context:
- TWSE attention/disposition status is endogenous to abnormal price change, volume, turnover, concentration and related trading conditions. Repeated attention announcements can lead to disposition measures; first disposition can change matching to periodic matching (e.g. approximately every two minutes under the cited rule).
- This means attention/disposition status can mechanically alter liquidity, spread, depth, timing and momentum-path observations. It is neither a clean exogenous alpha factor nor ordinary liquidity noise.
- Recent Taiwan thesis evidence (2015-2025 disposition events) reports heterogeneous post-disposition paths by trigger type; another NTU study reports negative abnormal returns shortly after disposition announcements followed by rebound. These are supporting context, not sufficient for a formal rule.

Research consequence:
1. Add "official attention/disposition status" to the future execution data-quality/control wishlist, but do not fabricate historical PIT status and do not add it as an alpha factor.
2. When available prospectively, disposition observations should be stratified/excluded from ordinary continuous-market spread/depth comparisons because matching mechanics differ.
3. Attention status itself is outcome-linked; using it as a predictor without careful timing would create leakage/endogeneity risk. Preserve announcement-effective timing.
4. Current executionMarketState quote flags are not sufficient to identify official disposition status; keep UNKNOWN rather than infer.
5. No engineering change now before the first v2 coverage audit.

### Fundamental Persistence extension — 2026-09-22T09:20+08:00
Taiwan-specific monthly-revenue literature provides a stronger candidate direction than adding another price-only factor:
- Hung, Lu & Yang (2025/2026) reports positive Taiwan monthly-revenue momentum using YoY revenue growth; persistence in revenue growth materially strengthens the effect, and monthly revenue information contributes independently of quarterly revenue announcements.
- Chen, Liu & Chiao (2022) reports unexpected monthly revenue predicts future earnings growth and stock returns; monthly-revenue surprise, quarterly-revenue surprise and quarterly-earnings surprise are correlated but retain independent cross-sectional information in their tests.
- Lai et al. (2026) adds a crucial horizon contradiction: record-high monthly revenue can be followed by next-day intraday reversal, especially after strong pre-announcement run-ups/high prices/rapid revenue growth, while subsequent 20-day returns are positive. Pre-announcement institutional net selling strengthens the short-term reversal/recovery pattern.

Implications for current research:
1. "Fundamental Persistence" should focus on repeated/persistent revenue growth or surprise history, not a single spectacular revenue print.
2. A strong monthly revenue event plus already-extended price can have opposite short-horizon and medium-horizon behavior. Therefore fundamental strength must not automatically loosen the system's no-chase discipline.
3. Institutional flow around the announcement is potentially conditioning information, not proof of direction.
4. Current snapshot already carries quarterlyRevenueYoY/QoQ and quarterly EPS-related evidence, but a proper monthly-revenue persistence series requires PIT announcement history. Do not approximate it from a single latest revenue number.
5. This direction is worthy of future Class A Shadow research, but do not register a new experiment until the existing prospective archive confirms that monthly-revenue announcement dates/history can be captured PIT without backfill leakage.

### User objective translated into research discipline — 2026-09-22T09:28+08:00
User reaffirmed the economic objective: rapidly improve the system's ability to surface high-quality Taiwan stocks for short-term and swing opportunities. Research interpretation:
- Optimize evidence quality and decision usefulness, not headline win-rate. Never promise profit or manufacture a high hit rate by shrinking coverage, leaking future data, or tuning after outcomes.
- Short-term and swing horizons must remain separately evaluated because Taiwan evidence repeatedly shows horizon-dependent reversal/continuation.
- Candidate quality must be decomposed into Selection Alpha, Execution Alpha, path quality, fundamental persistence, regime/industry persistence, liquidity/cost and downside/false-break risk; correlated confirmations are not independent votes.
- "Best" future candidates require current real price/data, formal eligibility filters, and prospective evidence; research cannot substitute stale prices or retrospective stories.
- Speed objective means prioritize high-information falsification and data coverage over adding many factors.

### Analyst revision / 52-week anchor falsification — 2026-09-22T09:36+08:00
New Taiwan-specific evidence adds two candidate knowledge families, with explicit counterevidence:
- Finance Research Letters (2026) finds consensus analyst forecast-earnings-growth revisions predict Taiwan returns: upward-revision portfolios earned positive market-adjusted returns persisting up to about one month; raw expected earnings growth was conditional on positive expected growth / rising markets, while revision direction was more consistent. This suggests "change in expectations" may contain more incremental information than a static forecast level.
- Older Taiwan event evidence around analyst earnings forecasts finds institutional ownership changes and returns are intertwined with herding/price impact; institutional buying showed informed-trader evidence, but selling did not symmetrically do so. Therefore analyst revision + institutional buying cannot be assumed to be two independent confirmations.
- Hao et al. (2016) finds mixed Taiwan 52-week-high evidence: portfolio 52-week-high strategy was insignificant in the main portfolio test, recency worked only in some states/periods, January effects mattered, and profitability changed across historical regimes. Cross-sectional regressions produced different dominance. This is strong anti-overfit evidence against simply adding "near 52-week high" as a bullish factor.
- Lin (2024) further finds extreme salient payoffs can weaken the Taiwan 52-week-high anomaly, reinforcing that extreme recent winners/lottery-like salience can contaminate anchor signals.

Research implications:
1. Analyst revision direction is a potentially higher-value future PIT evidence field than static analyst target/forecast level, but only if timestamped consensus history is obtainable without look-ahead.
2. Do not add 52-week-high proximity as a new factor. Existing breakout/priorHigh20/persistence/overheat already capture nearby price-path information; 52-week-high would risk Factor Zoo expansion and mechanical overlap.
3. If analyst revisions are later captured, preregister an incremental test beyond price momentum, monthly-revenue persistence, residual RS and institution score; do not treat revision + institution buying as independent votes.
4. Short-term and swing horizons remain separate: analyst-revision evidence is roughly one-month scale, not evidence for next-day entry timing.
5. No formal-core change.

### Industry momentum / factor-momentum reverse validation — 2026-09-22T09:44+08:00
Fresh Taiwan evidence strengthens an existing design choice while also limiting it:
- A 2026 Taiwan factor-momentum thesis using 2005-2024 data and 32 fundamental/price factors finds standard factor momentum weakens materially after industry-related variation is removed; short-term industry momentum remains comparatively robust. Broader factor momentum also loses significance after adjusting for unconditional factor premia. This argues against treating a large collection of correlated factors as independent alpha sources.
- Older Taiwan work also found industry momentum stronger/more persistent than individual price momentum in its sample, but sample periods and market structure differ, so this is supporting context rather than current proof.
- Lin et al. (2016) provides the reverse validation: even momentum itself flips sign during market-state transitions despite positive continuation-state results. Industry strength therefore cannot be promoted without regime-transition control.
- A 2022 Taiwan short-term momentum study finds the 2015 price-limit widening coincides with a change from average reversal to modest momentum; post-change high-turnover and low-turnover groups can have opposite signs. This further rejects a timeless industry/momentum rule.

Research consequence:
1. Preserve R03 industry persistence and R06 regime transition as separate evidence dimensions. Industry continuation is promising, but must survive transition-state falsification.
2. Do not add generic factor momentum. The 2026 evidence suggests much of it can be industry exposure or unconditional factor premium in disguise.
3. For candidate ranking research, "leading industry + strong stock" should eventually be tested against "strong stock in non-leading industry" and "leading industry control stock" on the same scan date; otherwise stock alpha and industry beta remain confounded.
4. Existing Residual RS is especially valuable as the counterweight: a stock should not receive research credit twice for industry strength and stock strength unless residual stock-level strength remains after sector removal.
5. No formal-core change and no new experiment ID yet.

### Fundamental-price confluence vs lottery/salience falsification — 2026-09-22T09:52+08:00
Taiwan evidence now supports a more disciplined "confluence" hypothesis, with an important anti-chase filter:
- Chen et al. (Journal of Banking & Finance, 2014) finds revenue surprises, earnings surprises and prior returns each contain some exclusive unpriced information; no single momentum family dominates. Joint alignment can be stronger, but fundamental momentum and price momentum are partially overlapping rather than fully independent.
- Hung, Lu & Yang (2025/2026) strengthens the monthly-revenue persistence leg, while Lai et al. (2026) shows record-high monthly revenue can still produce next-day intraday reversal after strong pre-announcement run-ups, followed by positive ~20-day drift.
- Wang & Lien (2023) finds Taiwan attention-grabbing/lottery-like stocks with extreme upside behavior can be overpriced and have lower subsequent returns; retail attention intensifies the anomaly. This supplies a direct reverse-validation warning against interpreting spectacular recent returns/limit hits as "more confirmation".
- Therefore "fundamental + price + volume all strong" is not automatically safer. At extremes, the same apparent confluence can be salience/crowding/overreaction.

Research consequence:
1. Future confluence research must distinguish moderate aligned evidence from extreme salient/overheated evidence; do not assume monotonic benefit as more signals become extreme.
2. Existing overheatPenaltyResearch and price-limit/attention evidence are natural falsification controls for any future fundamental-price confluence hypothesis.
3. Revenue/earnings/price alignment should be tested incrementally after controlling shared information, not counted as 3 independent votes.
4. For short-term selection, strong fundamental news after a large pre-event run-up is specifically a reversal-risk condition to test; for swing horizon, the same event may still drift positively. Keep horizons separate.
5. No new score/weight/threshold is registered.

### Continuity rule reinforced — 2026-09-22T10:00+08:00
Manual research must not stop merely to narrate intermediate findings. Intermediate commits, literature convergence, falsification results, or completion of one subtask are continuation points, not report boundaries. Continue immediately into the next non-human research task. Only interrupt for a genuine human-action boundary already defined by governance (MFA/reauth/secret/permission, explicit Class B/C production decision, or true technical blocker). User status requests are the other reporting exception.

### Earnings-quality / accrual anomaly reverse validation — 2026-09-22T10:08+08:00
Taiwan evidence adds a potentially useful fundamental-quality family, but with a strong regime caveat:
- Taiwan accrual-anomaly research finds higher accruals are associated with lower subsequent returns in earlier samples, consistent with investors overestimating accrual persistence relative to cash-flow persistence.
- However later Taiwan evidence reports that accrual-anomaly profitability weakened/disappeared after accounting-rule changes and the move toward IFRS-era reporting. This is exactly the kind of structural-break evidence that prevents blindly importing an old anomaly into the current market.
- Therefore "earnings growth" alone is insufficient evidence of quality; cash-flow backing / accrual composition is conceptually relevant, but the historical Taiwan anomaly cannot be assumed current or monotonic.

Research consequences:
1. Do not add an accrual factor from historical literature alone.
2. If future PIT fundamentals provide operating cash flow and accrual components, use them first as a falsification/control for revenue/EPS persistence rather than as an independent bullish score.
3. Any test must be post-IFRS/current-regime focused and separated from older Taiwan samples.
4. Fundamental Persistence should be harder to pass when reported growth is not supported by cash-flow quality, but no threshold/weight is set before prospective evidence.
5. No Formal Core change.

### Foreign-flow information vs price-pressure falsification — 2026-09-22T10:16+08:00
Taiwan institutional-flow literature supports keeping foreign flow as contextual evidence rather than treating every net buy as informed alpha:
- Foreign investors in Taiwan are documented as momentum-oriented traders, and their trading can predict returns at some horizons; however part of the association can arise from price pressure, ownership structure and persistence in trading rather than new fundamental information.
- Evidence on forecast events also shows asymmetric informed-trading content: institutional buying can carry information in some settings while selling need not be symmetric.
- This creates a confound with the formal A-line requirement that at least one foreign/investment-trust/main-force side is consecutively buying: consecutive buying can overlap mechanically with existing momentum and liquidity conditions.

Research consequences:
1. In research, institutional flow must be decomposed as confirmation/context, not counted as an independent vote without incremental testing.
2. Compare same-date candidates with similar momentum/residual RS but different institution scores to estimate incremental content.
3. Separate immediate price-pressure path from D5/D10/D20 persistence; a same-day/next-day effect is not automatically swing alpha.
4. Keep existing formal rule locked; this is a research falsification requirement, not a production-rule deletion.
5. No new threshold or weight.

### Volatility contraction / breakout reverse validation — 2026-09-22T10:24+08:00
Breakout literature and Taiwan market mechanics imply that "compression then expansion" must be treated as a conditional setup, not a universal bullish pattern:
- Volatility contraction can precede information resolution and large moves, but direction is not identified by contraction itself. A subsequent volume/price breakout supplies direction only after the event, creating look-ahead risk if the setup is labeled bullish before confirmation.
- In Taiwan, daily price limits, opening/closing auctions and disposition/VI-like matching changes can mechanically compress or distort observed ranges/volatility. A low raw volatility reading is therefore not always latent demand/supply balance.
- Existing I07 (Compression beyond Raw Volatility) is the correct preregistered route to test whether the system's compression construct adds information beyond volatility itself.

Research consequences:
1. Do not add another "squeeze" indicator or Bollinger-width clone before I07 matures; that would be factor duplication.
2. Separate pre-breakout compression quality from post-breakout confirmation. Never use future expansion to label the prior setup in a PIT snapshot.
3. Test compression incrementally after liquidity, price-limit/disposition context, breakout quality and overheat controls.
4. Failure cases (compression followed by downside expansion or no expansion) must remain in the archive; successful squeezes alone would create survivorship/selection bias.
5. No Formal Core change.

### Exact overheat/compression provenance audit — 2026-09-22T10:35+08:00
Repository source recovery from `scripts/apply_v8_7_1.py` now establishes the exact frozen research formulas:
- `overheatPenaltyResearch = clamp(max(0,ret20-20)*1.6 + max(0,maDistance20Pct-12)*2.2 + max(0,ATR%-6)*5 + max(0,abs(gapPct)-4)*4,0,100)`.
- `compressionScoreResearch = clamp(100 - (range10/range20)*40 - (range5/range20)*60,0,100)`, where each range is the high/low span over the respective recent window.
- I05 tests Overheat beyond Breakout Quality; I07 tests Compression beyond raw 20-day return volatility. Both are frozen D5 incremental contrasts.

Reverse-validation implications:
1. Overheat is explicitly a composite of 20-day return extension, distance above MA20, ATR% and absolute daily gap. It therefore overlaps momentum/path/risk variables by construction and must never be counted as four independent warnings.
2. The gap component is symmetric through `abs(gapPct)`: large gap-down and gap-up both raise overheat penalty. This is better interpreted as "extreme displacement/risk" than bullish-overextension specifically.
3. Compression is a nested-range geometry measure, not realized-volatility compression. I07 is therefore a legitimate construct test: if it adds nothing beyond volatility20, the geometric squeeze story is redundant.
4. Compression formula can score highly in a directional downtrend if recent high-low spans contract. It contains no trend direction. Any future bullish use must remain conditioned on separately frozen strength/breakout evidence; compression alone is not bullish.
5. Overheat thresholds (ret20 20%, MA20 distance 12%, ATR 6%, gap 4%) are research design parameters, not empirically proven Taiwan optimums. Do not retune them after seeing outcomes; if later challenged, create a new preregistered version rather than modifying v1.
6. No new factor or production change. The recovered provenance strengthens interpretation of I05/I07 and identifies concrete failure modes to inspect prospectively.

### Anti-overfit implementation audit — 2026-09-22T10:43+08:00
Audit of `research/anti_overfit_v8_7_6.js` found two important safeguards and one future weakness:
- Redundancy screening uses only FULL_FORMAL_SCAN prospective snapshots and flags pairwise Pearson |r|>=0.85 with n>=20; governance blocks formal-review eligibility when high redundancy remains unresolved.
- Cost stress applies 30/60/100 bps round-trip scenarios to SELECTED D5 outcomes; this is correctly labeled scenario analysis rather than claimed realized cost.
- Weakness: pairwise Pearson correlation can miss nonlinear redundancy and conditional duplication. Two factors can encode the same information nonlinearly while Pearson r stays below 0.85; conversely, high correlation need not mean one has no incremental predictive value.
- Therefore I01-I07 incremental contrasts are essential and pairwise redundancy must remain a coarse alarm, not a deletion rule.
- Future Class A diagnostic candidate after enough data: rank/Spearman and simple monotonic-bin redundancy checks on the same frozen factor catalog, without searching for the most flattering transform. Do not implement before prospective sample maturity because adding diagnostics now creates no decision value.
- Cost stress is also incomplete for execution-policy evaluation because missed/no-BUY opportunities are absent; keep it paired with trigger rate/opportunity-path research.
No production change.

### Date-cluster robustness audit — 2026-09-22T10:51+08:00
Audit of `research/cluster_robustness_v8_7_8.js` confirms the system does not treat same-day stocks as independent evidence:
- I01-I07 use leave-one-scan-date-out partial-correlation diagnostics after within-date demeaning.
- Maturity requires >=60 observations, >=15 independent scan dates and >=10 valid leave-one-date runs.
- A mature nontrivial signal is marked fragile if sign consistency drops below 70% or removing one date changes partial correlation by >=max(0.05,75% of the base effect).
- Formal-review eligibility is blocked when mature contrasts show date-cluster fragility.

Reverse-validation:
1. This protects against one spectacular market day driving an apparent factor effect, but it is still sensitivity analysis, not a full cluster-robust standard-error or bootstrap inference framework.
2. With only 15 independent dates, asymptotic inference would itself be fragile; the current conservative descriptive labeling is preferable to premature p-values.
3. Future statistical inference, if added, should cluster/resample by scan date and preserve the preregistered contrasts; do not bootstrap individual stocks as if independent.
4. A factor that survives leave-one-date-out but only in one regime/sector can still fail. Date robustness does not replace R06 regime and sector breadth checks.
5. No engineering change until more independent dates accumulate.

### Shadow-integrity reverse audit — 2026-09-22T10:59+08:00
Audit of `research/governance_v8_7_5.js` confirms a strong selection-bias firewall:
- Post-2026-09-21 formal research days are checked for any Shadow archive, exact SELECTED-count agreement, and existence of BROAD_CONTROL.
- Any missing archive, selected-count mismatch or zero broad-control day marks `RESEARCH_DATA_GAP`; research maturity is blocked but formal trading is not interrupted.
- This directly protects against analyzing only winners/selected names.

Remaining limitation:
1. Presence of BROAD_CONTROL does not by itself prove the control cohort is representative. A control can exist yet be systematically different in liquidity, price, sector, market cap or eligibility quality.
2. Counterfactual same-date comparisons reduce market-day confounding but do not automatically balance these cross-sectional covariates.
3. Future mature-sample audit should report cohort covariate balance (at minimum price, liquidity/turnover, sector composition, residual RS and volatility) before interpreting Selection Alpha causally.
4. Do not propensity-match or optimize a matching model now; that would add researcher degrees of freedom before enough prospective dates. First report raw standardized differences / distribution overlap using frozen covariates.
5. This is a future Class A diagnostic candidate, not a new selection rule.

### Selection-Alpha estimand audit — 2026-09-22T11:07+08:00
Audit of `researchPairedSelectionAlpha` clarifies exactly what current R02 estimates:
- For each scan date and comparator cohort, it computes the unweighted mean future return of SELECTED minus the unweighted mean future return of that comparator, then averages those daily deltas across dates.
- This is a valid same-date descriptive estimand and prevents days with many stocks from automatically dominating the cross-date aggregate.
- It is not yet a causal "selection effect": SELECTED and BROAD_CONTROL/NEAR_MISS/REJECTED cohorts can differ systematically in price, liquidity, sector, volatility and factor exposure.
- It is also not a portfolio P&L estimand because within-day names are equally weighted regardless of intended capital, fill probability, transaction cost or pool constraints.

Reverse-validation consequences:
1. Keep the current metric exactly as frozen descriptive Selection Alpha.
2. Do not relabel it as strategy alpha or expected P&L even when positive.
3. Future covariate-balance diagnostics should precede any causal interpretation; execution/cost weighting belongs in a separate estimand, not a retrofit to R02.
4. Compare multiple comparator cohorts rather than cherry-picking whichever produces the largest positive delta; disagreement across BROAD_CONTROL, QUALIFIED_NOT_SELECTED, NEAR_MISS and REJECTED_AFTER_BASE is itself evidence about where selection value arises.
5. No code or formal-core change.

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

### Pre-open convergence before first live session — 2026-09-22T08:52+08:00
Current research path is now constrained enough for the first 2026-09-22 prospective execution session:
- No new path/attention/persistence factor should be added before I02/I03/I04/I05/I07 have prospective evidence.
- No opening-gap sign rule should be added; Taiwan literature supports horizon- and regime-dependent continuation/reversal.
- Execution Alpha must remain explicitly conditional on triggered BUY; trigger rate and non-BUY opportunity path are separate evidence.
- OPEN_BASELINE must be analyzed as an early post-open baseline, not a clean continuous-session microstructure observation.
- R02 readiness has a semantic gap (selection-side maturity can outpace execution-side maturity); preserve current definition for continuity and version any later refinement.
- The next information gain now comes from actual 09:00/09:11/09:16/09:31 prospective snapshots, not further parameter invention.

Exact continuation when the session begins:
1. Verify that OPEN_BASELINE/FIRST_10M/FIRST_15M/FIRST_30M rows are actually stored for monitored formal-plan symbols.
2. Audit field coverage and UNKNOWN reasons by event type, without scoring outcomes.
3. Check quote timestamps/bar-end timestamps for PIT consistency and stale-data contamination.
4. Keep Formal Core locked and do not infer alpha from a single date.

## Exact next continuation point
Priority 6 Execution Alpha remains in **P2 research-readiness / coverage diagnostics**. Continue without user interaction unless a B/C decision or genuine blocker appears:
1. Treat I03/I04 as a nested-factor redundancy diagnostic because breakout quality already contains 25% attention volume; do not interpret its partial correlation as clean causal isolation.
2. After 2026-09-22 intraday snapshots actually exist, quantify independent-date coverage for openingGapPct, sessionAvgPrice/VWAP proxy, spreadPct, depthImbalance and executionMarketState; keep missing fields UNKNOWN.
3. Continue Taiwan evidence review on turnover-conditioned momentum and market-structure sensitivity; prioritize falsification of persistence/attention overlap over adding factors.
4. Let prospective execution-shadow-v2 accumulate actual trading-day snapshots; never fabricate/backfill historical execution fields.
5. When snapshots exist, read field-level coverage by independent scan date for openingGapPct, sessionAvgPrice/VWAP proxy, spreadPct, depthImbalance and executionMarketState before directional inference.
6. Preserve spread as execution-cost/liquidity control, depth imbalance as descriptive state, and opening gap as diagnostic/control until prospective evidence survives controls.
7. No formal execution gate/score proposal until prospective/OOS evidence survives Selection Alpha, momentum/attention, residual RS, liquidity/volatility, transaction-cost and date-cluster controls.
