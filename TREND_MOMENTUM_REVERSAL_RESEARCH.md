# Trend / Momentum / Reversal Research

Updated: 2026-09-26 Asia/Taipei
Status: FALSIFICATION_IN_PROGRESS / RESEARCH_ONLY
Formal Core: LOCKED

## Purpose

Study when Taiwan-stock momentum is more likely to persist versus reverse, and identify only genuinely incremental context for the after-market selector.

This lane does NOT assume that stronger past return is monotonically better. Taiwan-specific evidence repeatedly shows that momentum is state-dependent and that some apparently intuitive momentum predictors fail in Taiwan.

## DL-003A — Market-state continuation versus transition

### External evidence

Primary Taiwan evidence:
- Lin, Ko, Feng & Yang (2016), Pacific-Basin Finance Journal 38, 59-75, DOI 10.1016/j.pacfin.2016.03.009.
- Sample: Taiwan, 1971-2014, monthly portfolio framework.
- Reported months: 284 market continuations and 231 market transitions.
- Reported momentum profit: +0.879% in continuations versus -0.775% in transitions.
- Interpretation in the paper: frequent market transitions help explain weak unconditional Taiwan momentum because continuation profits are offset by transition reversals.

Counter/transportability controls:
- This is monthly evidence using the paper's own UP/DOWN state construction; it is not a daily after-market selection rule.
- The current program's research regime is different: it uses 20-day market return plus breadth and can classify BULL_BROAD, BEAR_BROAD, INDEX_STRONG_BREADTH_WEAK, BREADTH_RECOVERY, or MIXED.
- Therefore the paper's state thresholds and return magnitudes must NOT be imported into the current selector.
- Modern Taiwan has +/-10% price limits and continuous intraday trading; old-sample mechanics are not assumed directly portable to 2026.

### Current-system audit

Current research regime definition in V8.7.0:
- BULL_BROAD: marketReturn20 >= 3 and above-MA20 breadth >= 55%.
- BEAR_BROAD: marketReturn20 <= -3 and breadth <= 45%.
- INDEX_STRONG_BREADTH_WEAK: marketReturn20 >= 0 and breadth < 45%.
- BREADTH_RECOVERY: marketReturn20 < 0 and breadth >= 55%.
- otherwise MIXED.

Current R06 already exists, but current implementation only:
- sorts prospective trade_research_days by scanDate;
- counts adjacent observed regime labels as X->Y transitions;
- reports usableDays / transition counts;
- does not attach an as-of continuation/transition state to each Shadow candidate;
- does not yet report candidate D5/MFE/MAE by continuation versus transition state.

Current Formal scoreCandidate()/strategySetupState() do not consume researchMarketContext.regime. Formal currently uses stock/sector structure, market-relative return, sector quality, institutions, fundamentals, RR, liquidity and related gates, but not the research regime label or a transition flag.

Therefore the research gap is NOT "invent a new regime score." The gap is whether the already-defined regime lifecycle contains incremental selection information.

### Critical data-quality falsification

Current researchRegimePersistenceFromDays() treats adjacent observed research rows as adjacent observations.
That is not automatically equivalent to adjacent official trading sessions.

A missing/failed scan between two rows can create an apparent direct X->Y transition whose exact transition date/path is unknown.

Frozen semantics:
- CONTINUATION = current and immediately previous official trading session both have valid regime and same label.
- TRANSITION = current and immediately previous official trading session both have valid regime and labels differ.
- GAP_UNKNOWN = prior observed research row is not the immediately previous official trading session.
- UNKNOWN = current/prior regime cannot be established.
- sameRegimeStreakSessions may increase only across proven consecutive official trading sessions.

Do not infer daily transition age through missing dates.

### Frozen v0.1 research question

For the existing prospective Shadow parent population, does an as-of-date CONTINUATION versus TRANSITION state explain subsequent candidate paths after existing controls?

Primary outcomes:
- D1 / D3 / D5 / D10 / D20
- MFE / MAE
- stop-first
- breakout failure/no-follow-through
- Selection Alpha within scan date when feasible

Required controls:
- candidate cohort
- A/B setup
- ret20 / ret60
- residualSectorRs20 / sector state
- breakoutQualityResearch
- overheatPenaltyResearch / lateStage
- volatility / ATR
- liquidity / price tier
- Quiet/Attention state
- market regime label itself

The key incremental test is transition lifecycle AFTER controlling current regime level. A simple "bull vs bear" result does not prove transition value.

### Falsification criteria

Reject or downgrade if:
- transition effect disappears after controlling current regime level and existing momentum/overheat features;
- only one specific transition pair drives the result;
- independent transition dates are too few;
- result depends on non-consecutive observed research rows;
- effect reverses across modern OOS blocks/regimes;
- transaction costs/chase/false-breakout risk offset apparent return benefit;
- any candidate-level classification requires future regime information.

### Candidate status

FALSIFICATION_IN_PROGRESS.
No FORMAL_OPTIMIZATION_CANDIDATE yet.

Potential eventual form, only if mature evidence passes all gates:
- conditional momentum-continuation risk context / guard;
- NOT a universal additive regime score.

Any Formal ranking/eligibility impact would be Class C.

## DL-003A.1 — Official-session continuity feasibility

### Source audit
Current base Worker already has official TWSE calendar machinery:
- `loadTradingCalendar(env, year)` fetches the official TWSE holiday schedule and fails closed when the requested year is unavailable;
- `isTradingDate(date)` uses the loaded official holiday set plus weekend logic;
- `nextTradingDate(date)` walks to the next official session.

Therefore R06 does NOT need a new calendar provider or a guessed weekday rule.

### Current semantic defect
`researchRegimePersistenceFromDays()` currently compares row i-1 to row i after sorting observed `trade_research_days` and increments `X->Y`.
It does not prove `nextTradingDate(prev.scanDate) === current.scanDate`.

Consequences:
- a failed/missing scan can create a direct observed transition across an unknown gap;
- apparent same-regime persistence across a gap can overstate the proven streak;
- transition count is descriptive of adjacent stored observations, not yet an exact consecutive-session lifecycle.

### Safe research design
Before any candidate-outcome inference:
1. load official calendar for all years touched;
2. for each adjacent research row, require `nextTradingDate(prev.scanDate) === current.scanDate`;
3. otherwise classify the edge `GAP_UNKNOWN` and do not extend a same-regime streak;
4. preserve raw observed `from->to` separately for audit, but do not count it as a one-session transition;
5. calendar unavailable => UNKNOWN, never assume weekday adjacency.

### Engineering classification
- A pure research-only implementation that changes only R06 diagnostics/readiness and cannot affect Formal outputs is a Class A candidate.
- If implementation changes shared calendar fetching/caching/runtime behavior, reclassify as Class B proposal-first.
- No implementation is required before the evidence schema is frozen; no Formal change.


## DL-003B — Momentum Gap falsification

Taiwan evidence:
- Lin, Ko & Yang (2022), Pacific-Basin Finance Journal 72, 101732, DOI 10.1016/j.pacfin.2022.101732.
- The momentum-gap predictor that works in other markets fails to significantly predict momentum returns in Taiwan.
- The paper finds Taiwan price limits may compress the extreme spread required for the signal.
- Past market return, market volatility and market illiquidity retained predictive information in their Taiwan tests.

Decision:
- MOMENTUM_GAP = REJECTED_FOR_CURRENT_RESEARCH_PRIORITY.
- Do not add a cross-sectional winner-minus-loser gap factor merely because it is successful elsewhere.
- Reconsider only if a distinct modern Taiwan mechanism/data contract emerges; that would be a new experiment.

## DL-003C — Extreme Absolute Strength / Overheat redundancy

Taiwan evidence:
- Lin, Xia, Yang & Yang (2020), Pacific-Basin Finance Journal 59, 101258, DOI 10.1016/j.pacfin.2019.101258.
- Stocks with extreme absolute strength were highly volatile and more likely to lose momentum; removing extremes improved intermediate-term Taiwan momentum in their historical portfolio tests.

Current-system overlap:
- Formal lateStage already rejects ret20 > 35% or MA20 distance > 25%.
- Formal B additionally requires ret20 <= 30%.
- Research overheatPenalty already increases with ret20 > 20%, MA20 distance > 12%, ATR > 6%, and large gaps.

Therefore extreme-strength research is NOT a clean new independent factor.

Frozen next test:
- first test whether the literature mechanism adds anything beyond existing lateStage + overheat + ATR/volatility;
- do not import the paper's historical 3%/4%/5% tail cutoffs into a daily 20/60-day selector;
- if a percentile representation is studied, it is a robustness/normalization diagnostic, not a new score, and its window must be preregistered before outcomes.

Status:
REDUNDANCY_HIGH / FALSIFICATION_IN_PROGRESS.

## Optimization bridge

No formal optimization is ready.

The most plausible future after-market optimization from this lane is:
1. preserve existing A/B setup and scores;
2. add a transition-state context only if prospective evidence shows materially worse momentum continuation / greater MAE or false-break risk immediately after regime transitions;
3. prefer a guard/modifier over adding another positive score;
4. quantify candidate coverage and zero-pick impact before any proposal.

This remains Class C if it can alter Formal selection/ranking/eligibility.

## Exact next continuation

1. Audit official-session continuity feasibility for R06; do not treat adjacent observed research rows as consecutive sessions.
2. Freeze a transition-state episode schema and expected-parent coverage accounting.
3. Because prospective R06 evidence is still immature, do not inspect transition-conditioned forward outcomes prematurely.
4. In parallel deepen market-level volatility/illiquidity as possible moderators, while checking the separate Volatility-Regime lane to avoid duplication.
5. Keep momentum gap rejected.
6. Audit Extreme Absolute Strength strictly as redundancy against existing lateStage/overheat, not as a new score.
