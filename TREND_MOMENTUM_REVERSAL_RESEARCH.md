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

1. R06 official-session feasibility is already proven; retain GAP_UNKNOWN semantics and wait for enough clean transition dates before outcome interpretation.
2. Momentum-rank persistency v0.1 is now specification-ready but not implemented. Do not reconstruct historical rank duration.
3. After the active V8.15 lineage clears, consider a Class-A proposal for zero-extra-call prospective ret60 rank/universe receipt only if it can be kept completely research-only and Formal-invariant.
4. The first future empirical question must condition on current ret60 rank; otherwise persistence is confounded with being a stronger winner.
5. Control existing trend-consistency persistenceScoreResearch and Residual RS; if rank retention adds nothing, reject it rather than tune rank thresholds.
6. Keep Momentum Gap rejected and Extreme Absolute Strength redundancy-high.
7. Continue another independent under-reconciled research question while prospective evidence accumulates.


## DL-003D — Momentum persistency construct audit

### Literature construct
Chen, Hsieh & Lee (2023) does not define persistency as a smoothness/trend-quality score.
At each monthly formation date, stocks are ranked cross-sectionally by prior 3/6/9/12-month return; winners are the top 30% and losers the bottom 30%. Persistency is the duration for which a stock consecutively remains in its corresponding winner/loser group.

For the six-month formation example, the paper reports only about 54.52% of winners remain winners in the next formation. Nonpersistent winner/loser groups exhibit strong reversal, while persistent groups exhibit stronger continuation. Those historical effect magnitudes are NOT portable thresholds for the current daily long-only system.

### Existing-system construct
Current `price.persistenceScoreResearch` is:
- 35% positiveDayRatio20;
- 25% fraction of ret5/ret10/ret20/ret60 that are positive;
- 20% 20-day drawdown quality;
- 20% close-above-MA20/MA60 quality.

This is an own-price-path **trend consistency heuristic**.
It is not cross-sectional winner/loser membership duration.

Therefore:
- do not cite `persistenceScoreResearch` as an implementation of Chen et al. 2023 persistence;
- I02 remains the frozen test of this existing heuristic beyond Residual RS and must not be silently redefined;
- a runtime rename is not justified merely for terminology; schema stability matters. In research interpretation, refer to it as “existing trend-consistency persistence heuristic” when ambiguity matters.

Status:
`CONSTRUCT_MISMATCH_CONFIRMED`.

## DL-003E — canonical replication feasibility

Current live price state retains roughly 65 sessions and directly computes ret60.
This is enough to form a system-native point-in-time ~3-month cross-sectional return rank, but not the paper's 6/9/12-month canonical formation windows.

More importantly, historical Shadow archives did not preserve full-universe point-in-time winner/loser ranks at every formation date.
Current data must not be used to fabricate past rank-membership duration.

Canonical historical replication status:
`PIT_CROSS_SECTIONAL_HISTORY_BLOCKED / NOT_RECONSTRUCTED`.

Prospective system-native feasibility:
`MATERIAL_PASS_FOR_RET60_RANK_CAPTURE`.

The current after-market featureRows already contain same-scan ret60 for source-valid histories before Formal A/B/fundamental/valuation/RR gates. A full-universe ret60 percentile can therefore be computed prospectively with zero extra market-data calls.

## DL-003F — system-native prospective rank retention v0.1

Durable machine spec:
`research/momentum_rank_persistence_spec_v0_1.json`.

V0.1 does not create a new additive score.

Primary continuous primitive:
- `momentumRankPct60` within the valid same-scan full feature universe.

Required provenance:
- universe count/coverage state;
- source scan date;
- exact previous consecutive clean scan date;
- no forward fill.

Literature-anchored top-30 membership is descriptive only.
Retention duration may advance only across consecutive official market sessions with complete rank receipts.
A missing/failed scan produces `GAP_UNKNOWN`, not EXITED.

The key incremental test is stricter than “persistent winners outperform”:
**after controlling the current ret60 rank level itself, does retained winner membership / rank stability add anything beyond Residual RS and the existing trend-consistency heuristic?**

If not, the duration construct is rejected as redundant for this selector.

## DL-003G — redundancy / universe-composition firewall

Rank retention is not mechanically equivalent to the existing heuristic because cross-sectional rank can change while a stock's own price-path features remain similar.
But it can still be economically redundant with:
- raw ret60 / current rank level;
- Residual RS;
- sector rotation;
- size/liquidity;
- market regime;
- Quiet/Attention;
- overheat.

Universe membership is itself a confound.
Rank changes caused by listings, missing histories, suspensions or data-quality exclusions cannot be interpreted as economic momentum decay without recording the rank denominator and coverage state.

Required outcomes:
D1/D3/D5/D10/D20, MFE/MAE, stop-first, and false/no-follow-through.

No outcome inspection or threshold search is authorized before prospective coverage exists.

### Status
`SPEC_FROZEN / PROSPECTIVE_ONLY / NOT_IMPLEMENTED / ALPHA_UNKNOWN / NOT_OPTIMIZATION_READY`.



## DL-003H — Generic short-term reversal factor falsification

### External mechanism evidence

Taiwan evidence supports the existence of temporary price-pressure reversals, but not an unconditional “buy recent losers” rule.

Andrade, Chang & Seasholes (2008, JFE) uses Taiwan Stock Exchange data and confirms predictable reversals generated by non-informational trading imbalances in a liquidity-provider framework.

Kao (2011) finds Taiwan index-futures daily reversals after extreme low trading-imbalance / low-return states, while extreme high imbalance/high return can retain momentum.

Broader short-term reversal evidence also warns that news-driven/high-turnover moves can continue rather than reverse. Therefore recent negative return alone cannot identify a liquidity-pressure reversal.

These mechanisms are compatible with each other:
- non-informational liquidity pressure can mean-revert;
- information-driven price change can continue;
- extreme imbalance can produce different outcomes depending on sign/context.

### Current Formal A-line overlap

The current A after-market setup already requires:
- MA20/MA60 trend structure still intact;
- 2–15% pullback from recent high;
- price within 4% of identified support;
- current/short-horizon volume not showing expansion against the pullback;
- no break of structural low/support;
- not late-stage.

The current 15-minute A execution layer then requires:
- price not below the buy-zone lower bound;
- no bearish >=1.3x volume bar;
- entry into/hold of the support zone;
- <=0.9x prior-5-bar volume on the setup bar;
- reversal candle or strong close;
- higher low;
- subsequent bullish turn-up / break of the stop bar high.

Therefore a generic short-term reversal score would duplicate the existing “healthy pullback + confirmed reversal” architecture and risks weakening the explicit no-catching-a-falling-knife design.

Decision:
`GENERIC_SHORT_TERM_REVERSAL_FACTOR = REJECTED_OR_REDUNDANT`.

This does NOT prove the current A thresholds are optimal.

## DL-003I — pullback-origin attribution is the genuine residual question

The remaining incremental question is not “will a loser bounce?”
It is “what caused the pullback, and is that cause associated with continuation quality after the same A setup passes?”

Candidate origin/context layers are already owned elsewhere:
- Price-Volume: participation / price response / acceptance;
- Microstructure: spread / depth / side pressure / replenishment / resiliency;
- Event Risk / Fundamentals: known announcements and gap/event contamination;
- Leverage/Shorting: deleveraging or short-pressure context;
- Market Regime / Volatility: common risk-off shock.

Do not create a new all-in-one reversal score.

Frozen research role:
`PULLBACK_ORIGIN = MODERATOR / DIAGNOSTIC ONLY`.

Possible descriptive states, only when their owners provide valid evidence:
- STRUCTURAL_PULLBACK_NO_IDENTIFIED_SHOCK;
- EVENT_SHOCK_CONTEXT;
- LIQUIDITY_PRESSURE_CANDIDATE;
- DELEVERAGING_PRESSURE_CANDIDATE;
- COMMON_MARKET_SHOCK;
- MULTIPLE_ORIGINS;
- UNKNOWN.

These labels are explanatory context, not mutually exclusive causal truth.

### Microstructure firewall

A candle with a lower shadow, high volume, or later rebound is NOT sufficient to label a liquidity-pressure reversal.

True liquidity/inventory attribution requires at minimum valid contemporaneous side-pressure plus depth/replenishment/price-response evidence.
Current event-sparse recorder is not sufficient to reconstruct all such states historically.

Missing microstructure evidence => UNKNOWN, not “healthy liquidity.”

## DL-003J — A-line falsification design

When clean prospective evidence exists, compare A candidates that already passed the same Formal setup/entry architecture across valid origin contexts.

Primary outcomes:
- BUY-trigger coverage;
- D1/D3/D5/D10 returns after selection and after entry;
- MFE / MAE;
- stop-first;
- false/no-follow-through;
- entry improvement versus missed opportunity;
- holding-time sensitivity without outcome-tuned redefinition.

Required controls:
- A setup quality / support distance / pullback depth;
- ret20/ret60 and rank-persistency context if available;
- Residual RS / sector state;
- regime transition / market realized volatility;
- liquidity/price tier;
- institutional/crowding;
- event context;
- PV acceptance.

Falsification:
- if origin context adds no incremental information after existing A/PV/microstructure controls, reject it;
- if “liquidity reversal” is inferred only from OHLCV and not valid pressure evidence, invalidate that cohort;
- if any proposed relaxation increases BUY count but worsens MAE/stop/no-follow-through or costs, reject;
- if benefit is simply deeper pullbacks inside the current 2–15% band, classify as threshold-calibration evidence, not a new reversal factor.

### Status
`GENERIC_REVERSAL_REJECTED_OR_REDUNDANT / ORIGIN_ATTRIBUTION_DATA_GATED / NO_FORMAL_CHANGE`.

