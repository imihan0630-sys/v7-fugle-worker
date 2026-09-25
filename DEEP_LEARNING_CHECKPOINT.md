# Deep Learning Checkpoint

Updated: 2026-09-24 Asia/Taipei

> Canonical durable cursor for the scheduled 台股深度學習 workflow and any manual ChatGPT thread continuing that work.
> Do not restart from scratch. Read this file first, then continue from `Exact next continuation point`.

## Purpose
- Continuously learn external knowledge relevant to Taiwan stock selection and trading decisions.
- Search for new academic research, Taiwan-market evidence, market microstructure evidence, falsification, and genuinely independent variables.
- New knowledge is research-only first. It must not directly modify Formal Core（正式核心）.

## Continuity rules
- Every deep-learning run must begin by reading this file plus the latest `RESEARCH_CHECKPOINT.md`, `RESEARCH_WORKLIST.md`, and `RESEARCH_ENGINEERING_GOVERNANCE.md`. If the task touches chart morphology or price-volume behavior, also read the dedicated `KLINE_PATTERN_CHECKPOINT.md` / `PRICE_VOLUME_CHECKPOINT.md` lane before continuing.
- GitHub durable state overrides chat memory.
- Never repeat completed topics merely because the chat/thread changed.
- Before writing, re-read this file and confirm its latest blob SHA. If another run updated it, merge the newer progress rather than overwriting it.
- Every run with substantive progress must write back:
  1. topic/question studied,
  2. new evidence and source/provenance,
  3. supporting evidence,
  4. counter-evidence / alternative explanations,
  5. bias / overfit / redundancy checks,
  6. whether the finding is redundant, rejected, still uncertain, or worth Shadow Research（影子研究）,
  7. exact next continuation point.
- Missing evidence is UNKNOWN（未知）, never BAD（不佳） or zero.
- Do not fabricate historical Shadow（影子） samples.
- Do not alter Formal Core（正式核心）, live monitoring, capital, entry/exit, ranking, push rules, or production behavior without the owner-approved governance path.

## Learning lanes
1. Momentum persistence（動能持續性）
2. Successful vs false breakout（成功突破與假突破）
3. Selection Alpha（選股超額） vs Execution Alpha（執行超額）
4. Sector / supply-chain persistence（產業／供應鏈持續性）
5. Residual RS（殘差相對強弱）
6. Intraday vs overnight return（盤中與隔夜報酬）
7. Market regime transition（市場狀態轉換）
8. Quiet Strength（低關注強勢） vs Attention Strength（高關注強勢）
9. Revenue / fundamental persistence（營收／基本面持續性）
10. Institutional / short-flow evidence（法人／放空資金證據）
11. Overheat / remaining-upside control（過熱／剩餘空間控制）
12. New independent variables not already represented in the system（系統尚未涵蓋的獨立變數）
13. Price-volume relationship（價量關係） — context-dependent relative volume, effort-versus-result, breakout/pullback volume quality, and intraday same-slot normalization

## Handoff rule
- If a finding becomes a credible optimization candidate, record it under `Candidate handoff` with:
  - mechanism,
  - current system weakness it may address,
  - expected benefit,
  - failure modes,
  - validation design,
  - engineering class,
  - relation/redundancy to existing factors.
- A candidate is not a production change. Formal promotion still requires the existing research governance and owner approval.

## Current retained state
- Existing Formal research remains governed by `RESEARCH_CHECKPOINT.md`; this file does not replace it.
- Current high-interest optimization directions already identified:
  - breakout quality / false-breakout filtering,
  - Residual RS（殘差相對強弱） + sector persistence（產業持續性）,
  - Quiet Accumulation（安靜吸籌） / Smart Money（聰明資金） forming consensus,
  - overheat penalty（過熱懲罰） + remaining upside（剩餘上漲空間）.
- Hybrid WATCH（混合觀察） already implements part of early-consensus logic; new learning must test incremental value rather than re-labeling the same information.

## DL-001 — Information Discreteness（資訊離散度）／Gradual Price Path（漸進價格路徑）
Run date: 2026-09-24 Asia/Taipei

### Question
Does the *path* by which a stock accumulates gains contain incremental selection value beyond total return, breakout quality, volume, overheat, and current Quiet/Attention research?

### Evidence
1. Lin, Ko, Chen & Chu, Pacific-Basin Finance Journal (2016), "Information discreteness, price limits and earnings momentum": direct Taiwan-market evidence from 1989-2014. Earnings momentum was stronger when information arrived more continuously and attracted less attention; price-limit events behaved as attention-grabbing discrete information.
2. Huang, Lee, Song & Xiang, Journal of Financial Economics (2022), "A frog in every pan": continuous information from economically linked lead firms produced stronger delayed response than discrete information, extending the mechanism to customer/supplier and other lead-lag settings.
3. Galvani, Finance Research Letters (2024), "Frog in the Pan and the market-state effect on momentum": counter-evidence/conditioning result. The information-discreteness relation appeared in UP markets, not DOWN markets.
4. Lin et al., Pacific-Basin Finance Journal (2016), "Market dynamics and momentum in the Taiwan stock market": Taiwan conventional momentum can disappear because of frequent market transitions; positive momentum was conditional on continuing market states.
5. Ho et al., Pacific-Basin Finance Journal (2023), "Momentum investing and a tale of intraday and overnight returns: Evidence from Taiwan": past intraday and overnight components contain different predictive information, supporting the broader idea that return path/composition matters, not only cumulative return.

### Comparison with current system
- Existing research already stores ret5/10/20/60, positiveDayRatio20, maxDrawdown20Pct, gapPct, breakoutDistancePct, dailyClosePosition, upper-shadow ratio, volume expansion/contraction, breakout-quality score, overheat penalty, Residual RS（殘差相對強弱）, and Quiet/Attention diagnostics.
- No durable explicit Information Discreteness（資訊離散度）, jump-concentration, or gradual-return-path feature was found in the current research layer.
- Therefore this is not obviously identical to an existing factor, but it may correlate with positiveDayRatio20, maxDrawdown20Pct, volatility, gap, and Quiet Strength（低關注強勢）. Incremental-value testing is mandatory.

### Positive mechanism
- A stock that reaches the same 20-day return through many small same-direction moves may reflect persistent underreaction and incomplete information absorption.
- This could help distinguish "early persistent strength" from one-day attention spikes, potentially improving early selection and reducing late chasing.

### Counter-evidence / failure modes
- The 2024 evidence indicates the effect may vanish in DOWN（下跌） market states.
- Taiwan momentum itself is regime-sensitive; frequent regime transitions can erase the premium.
- Price limits, large gaps, earnings announcements, or one-day large institutional flows may make a discrete jump informative rather than harmful.
- A gradual path may simply proxy low volatility, trend smoothness, low drawdown, or Quiet Strength（低關注強勢） already captured by current features.
- Adding a new score without incremental testing risks Factor Zoo（因子動物園） and Overfitting（過度擬合）.

### Candidate status
WORTH_SHADOW_RESEARCH（值得影子研究）, not eligible for Formal Core（正式核心） change.

### Owner decision
- 2026-09-25 Asia/Taipei: owner approved continuing DL-001 research and Shadow validation.
- Approval is for research / Shadow validation only. It is not approval to alter Formal Core（正式核心）, formal ranking, thresholds, capital, execution, monitoring, or push behavior.
- Do not ask again merely to continue the already-approved research. Ask again only if mature evidence later supports a concrete program optimization that can affect formal selection behavior.

### Candidate handoff
- Mechanism: measure whether past return accumulated gradually/continuously versus through a few large jumps.
- Current weakness addressed: current selection knows total return, breakout quality and overheat, but does not explicitly distinguish *how* the return path was formed.
- Expected benefit: earlier identification of persistent underreaction; possible reduction of attention-spike / late-chase candidates.
- Primary risk: redundancy with existing path-quality and low-volatility variables; regime dependence.
- Validation design: research-only feature(s), pre-registered before outcome inspection; compare D5/D10/D20, MFE/MAE, stop-first, coverage and zero-pick impact. Test within BULL_BROAD（廣泛多頭） / MIXED（混合） / BEAR_BROAD（廣泛空頭） separately. Require incremental partial-correlation / same-date comparisons against positiveDayRatio20, volatility20, maxDrawdown20Pct, breakoutQualityResearch and Quiet/Attention classification.
- Engineering class: Class A（A級，僅研究／影子） if stored only in research snapshot and diagnostics with decisionImpact=false. Any use in Formal ranking/threshold becomes Class C（C級，正式核心） and requires owner approval.

## Candidate handoff
- DL-001: Information Discreteness（資訊離散度）／Gradual Price Path（漸進價格路徑） — WORTH_SHADOW_RESEARCH（值得影子研究）; owner approval should be requested before turning it into an optimization experiment that could later influence selection.


## DL-002 — Pattern Maturity（型態成熟度）／Multi-stage K-line Structure（多階段K線結構）
Run date: 2026-09-25 Asia/Taipei

### Question
Can explicit multi-stage chart morphology add incremental selection value beyond the current Formal A/B structure, especially by identifying high-quality setups that are still maturing before a classic breakout or pullback-entry condition becomes fully eligible?

### New evidence and provenance
1. Lo, Mamaysky & Wang, Journal of Finance (2000), “Foundations of Technical Analysis”: technical chart shapes can be converted from subjective visual ideas into systematic automatic pattern-recognition rules. In a large U.S. stock sample (1962-1996), several patterns such as double-bottoms carried incremental information relative to unconditional return distributions. This supports research on quantified morphology, but not blind trust in pattern names.
2. Lu, Pacific-Basin Finance Journal (2014), “The profitability of candlestick charting in the Taiwan stock market”: using Taiwan stock daily OHLC data from 1992-2009, four one-day candlestick patterns remained profitable after transaction costs, bootstrap checks, out-of-sample tests and sub-samples. The paper also shows that trend context matters and that not every candlestick pattern works.
3. Lu, Shiu & Liu, Review of Financial Economics (2012), Taiwan 50 components: Piercing, Bullish Engulfing and Bullish Harami were the profitable bullish two-day reversal patterns in their sample; bearish reversal patterns were much weaker. The study explicitly included transaction costs and out-of-sample/bootstrap checks. Important limitation: results depend on trend definition and holding strategy, so candlestick names should not become standalone Formal signals.
4. Wang & Chan, Expert Systems with Applications (2007): template-matched bull-flag rules were tested on both NASDAQ and the Taiwan Weighted Index, supporting the idea that continuation geometry can be formalized rather than eyeballed. This is evidence for researchability, not a production rule.
5. Fidelity’s Cup-with-Handle specification provides useful literature anchors for measurable morphology: prior advance, rounded cup, right-side recovery, handle formation near the upper half, handle pullback commonly not more than about one-third of the cup advance, volume drying in the handle, and increased volume on breakout. These are research anchors, not tuned Formal thresholds.
6. Fidelity’s Double-Bottom material defines confirmation as two troughs separated by a middle peak with breakout above that middle peak. Therefore “two lows” alone is not a confirmed W-bottom; pre-breakout maturity and confirmed-breakout states must be separated.
7. Sakata Five Methods are retained as a historical taxonomy (Three Mountains, Three Rivers, Three Gaps, Three Soldiers, Three Methods). Because their modern definitions are broad and partly reconstructed from later technical-analysis tradition, they should be decomposed into measurable OHLC/sequence features rather than treated as authoritative standalone signals.

### Comparison with current Formal system
Current Formal already includes substantial chart information:
- MA20/MA60 trend and bullish-stack state,
- priorHigh20 / recent highs,
- pullbackPct and supportDistancePct,
- volumeTodayVsPrev5 and 5-to-20-day contraction,
- dailyClosePosition and upper-shadow ratio,
- ATR/volatility,
- ret20 / late-stage checks,
- breakout and pullback A/B gates.

The material gap is not “no K-line logic.” The gap is topology and lifecycle:
- no explicit swing-leg segmentation,
- no count/order of contractions,
- no base age/duration,
- no cup roundness or rim symmetry,
- no handle location/depth,
- no neckline topology,
- no flag pole/channel geometry,
- no explicit pre-breakout maturity state,
- no continuous pattern-fit confidence,
- no explicit failed-pattern lifecycle.

Therefore DL-002 is potentially incremental, but redundancy with current breakout quality, pullback quality, volume contraction, overheat, ATR and Information Discreteness must be tested.

### Pre-registered research feature families
No production thresholds are changed. These are candidate measurements only.

#### VCP / progressive contraction
- contractionCount
- contractionDepthPct[]
- contractionDurationDays[]
- depthMonotonicity
- durationMonotonicity
- higherLowRatio
- volumeDryUpSlope
- finalTightnessPct
- finalTightnessATR
- pivotPrice
- pivotDistancePct
- breakoutRangeExpansion
- breakoutVolumeRatio
- trendContext / stage2LikeTrend gate

Key rule: contractions must be identified as non-overlapping swing legs. Overlapping rolling windows such as 5d/10d/20d can create a mechanical illusion of “shrinking volatility” and are not sufficient evidence of a true VCP.

#### Cup / Cup-with-Handle
- priorAdvancePct
- cupDurationDays
- cupDepthPct
- bottomRoundnessScore
- leftRightRimDiffPct
- rightSideRecoveryPct
- handleDurationDays
- handleDepthPct
- handlePositionInCup
- handleVolumeDryUp
- pivotPrice
- pivotDistancePct
- breakoutVolumeRatio

Critical distinction: CUP_FORMING -> RIGHT_SIDE_RECOVERY -> HANDLE_FORMING -> HANDLE_TIGHT -> PIVOT_READY -> BREAKOUT_CONFIRMED -> FAILED.

#### Double-bottom / W-bottom
- leftLow / rightLow
- troughSimilarityPct
- bottomSpacingDays
- necklinePrice
- necklineHeightPct
- rightLowVsLeftLowPct
- secondBottomVolumeRatio
- undercutAndReclaim flag
- reclaimSpeedDays
- necklineBreakoutVolumeRatio

Critical distinction: two troughs are only morphology. Confirmation requires neckline breakout. Research should separately test:
A. right low higher than left,
B. approximately equal lows,
C. slight undercut followed by rapid reclaim.
Do not assume A is superior before testing.

#### Flag / Pennant / Platform
- poleReturnPct / poleDurationDays
- consolidationDepthPct
- consolidationDurationDays
- channelSlope
- rangeCompressionSlope
- volumeDryUpSlope
- distanceToPriorHighPct
- breakoutVolumeRatio
- trendContext
- failedBreakoutWithin3D / within5D

#### Candlestick / Sakata-derived sequence features
Treat these as contextual confirmation features, not standalone strategies:
- standardized real-body size / ATR,
- upper/lower wick ratio,
- body overlap / engulfing ratio,
- gap size,
- close position,
- sequence direction count,
- volume confirmation,
- prior trend state,
- location versus support/resistance.

Priority bullish two-day patterns for Taiwan-specific research: Piercing, Bullish Engulfing, Bullish Harami, because Taiwan evidence exists. This is a research priority only, not a claim they remain profitable in 2026.

### Pattern maturity state machine
Use a generic lifecycle across pattern families:
1. FORMING
2. STRUCTURE_VALID
3. MATURE_PRE_BREAKOUT
4. PIVOT_READY
5. BREAKOUT_CONFIRMED
6. RETEST_CONFIRMING
7. FAILED

This is the central DL-002 hypothesis: continuous maturity state may preserve information that a binary pass/fail Formal gate loses.

### Positive mechanism
- A/B Formal requires a relatively complete pullback or breakout condition.
- Some stocks may already show diminishing supply, higher lows, tightening range and volume dry-up before breakout.
- A maturity state could identify “almost ready” setups without weakening Formal gates, potentially explaining part of the current low-selection / idle-capital problem.

### Counter-evidence / failure modes
- Classic chart patterns are vulnerable to hindsight bias: after the fact almost any path can be visually fit to a named shape.
- VCP and cup/handle have weaker peer-reviewed direct evidence than generic chart-pattern and Taiwan candlestick literature; treat them as hypotheses, not established alpha.
- Pattern geometry can be redundant with existing ATR, volatility, positive-day ratio, pullback quality, breakout quality, volume contraction and overheat.
- Pattern profitability is regime-dependent and can vary with trend definition, holding rule and transaction costs.
- A pre-breakout pattern may never break; a breakout pattern may fail immediately. “Beautiful setup” is not synonymous with positive expectancy.
- Many related pattern variants create multiple-testing / Factor-Zoo risk.

### Bias / overfit controls
- Freeze definitions before inspecting future outcomes.
- Pattern state at date t may use only bars available through t.
- Pre-breakout maturity and post-breakout confirmation must be separate labels; never backfill a mature state because a later breakout succeeded.
- No historical Shadow fabrication.
- Use walk-forward / non-overlapping out-of-sample blocks and date-clustered evaluation.
- Compare within the same scan date where possible; match/control for market regime, liquidity, price tier and sector.
- Evaluate incremental value after controlling for current Formal features rather than raw standalone win rate.
- Correct for multiple pattern tests; do not promote the single best-looking variant from many tried definitions.
- Include transaction costs and slippage in any trading-rule experiment; selection-alpha analysis remains separate from execution-alpha analysis.

### Validation design
Primary cohorts:
- Formal SELECTED
- Near-miss
- Rejected / Control

Primary outcomes:
- D1 / D3 / D5 / D10 return
- MFE / MAE
- stop-first rate
- breakout-failure within 3D / 5D
- time-to-pivot / time-to-entry
- entry-zone reach rate
- zero-pick / capital-utilization impact if used only as a Shadow supplement

Core comparisons:
1. Pattern-strong Near-miss vs pattern-weak Near-miss on the same date.
2. Pattern-strong Rejected vs matched rejected controls.
3. Formal SELECTED with high pattern maturity vs Formal SELECTED without it.
4. Pattern maturity incremental effect after controlling for ret20, ATR, volume contraction, breakoutQualityResearch, supportDistance, Residual RS, overheat and DL-001 Information Discreteness.
5. Regime split: BULL_BROAD / MIXED / BEAR_BROAD or the system’s durable regime labels.

### Candidate status
WORTH_SHADOW_RESEARCH.
No Formal Core change is approved or implied.

### Candidate handoff
- Mechanism: represent multi-day price geometry as an explicit maturity lifecycle rather than only binary A/B completion.
- Current weakness addressed: Formal may discard high-quality maturing structures before they fully qualify, contributing to sparse selection.
- Expected benefit: earlier visibility into structured setups without lowering Formal gates.
- Main risks: hindsight pattern fitting, redundancy, regime dependence, multiple-testing.
- Engineering class: Class A if implemented only as research snapshot / Shadow diagnostics with decisionImpact=false. Any effect on Formal ranking, thresholds, eligibility, capital, monitoring or push becomes Class C and requires owner approval.

### Exact DL-002 continuation
1. Build the swing-leg segmentation specification first (pivot detection without look-ahead leakage).
2. Define VCP contraction geometry on those swing legs; do not use overlapping-window shrinkage as the primary detector.
3. Define cup roundness/rim/handle metrics and W-bottom neckline states.
4. Define Taiwan candlestick feature formulas for Piercing, Bullish Engulfing and Bullish Harami using OHLC normalized by ATR/price.
5. Map each DL-002 feature against existing Formal research fields and remove duplicates before any coding proposal.
6. Only after definitions are frozen, run prospective / historical-as-of-date Shadow validation. Do not inspect outcomes first and tune definitions afterward.

## Exact next continuation point
1. Do not repeat the literature search above unless materially new evidence appears.
2. Owner has approved continuing DL-001 research / Shadow validation. Define the smallest pre-registered Information Discreteness（資訊離散度） feature without tuning thresholds to outcomes; test redundancy and regime interaction before any formal optimization proposal.
3. Independently continue the next highest-value external-learning question after DL-001, preferably one not already represented by Residual RS（殘差相對強弱）, Quiet/Attention, breakout quality, or overheat.
4. Keep Formal Core（正式核心） unchanged unless later mature evidence passes governance and owner explicitly approves.


## Parallel durable lane — Price-Volume Relationship（價量關係）
- Dedicated checkpoint: `PRICE_VOLUME_CHECKPOINT.md`
- Evidence / hypotheses: `PRICE_VOLUME_RESEARCH.md`
- Current cursor: PV-001 through PV-007 complete; continue from PV-008.
- Key rule: every price-volume claim must record both constructive and opposing interpretations before it can become a Shadow candidate.
- High-priority candidate: 15-minute same-slot relative-volume normalization, because Taiwan intraday volume has strong time-of-day seasonality and current previous-5-bar comparison may confound clock-time effects with abnormal participation. Fugle historical 15m coverage makes isolated research technically feasible. Also retain contextual/nonlinear breakout-volume quality and constructive-dry-up vs no-demand separation as Shadow candidates.
- Formal Core remains unchanged.

## Price-Volume lane update — PV-008 through PV-015
- Dedicated files remain `PRICE_VOLUME_RESEARCH.md` and `PRICE_VOLUME_CHECKPOINT.md`.
- Current cursor: PV-001 through PV-015 complete; continue from PV-016.
- Newly durable conclusions:
  - breakout volume must be modeled nonlinearly; extreme volume can represent informed participation, attention/crowding, liquidity demand, absorption, distribution or exhaustion depending on price acceptance and context;
  - price-volume interpretation should use an as-of acceptance lifecycle rather than a single event-bar label;
  - Taiwan +/-10% price limits censor price progress, so generic effort-vs-result metrics require a separate price-limit cohort/control;
  - persistent abnormal volume and one-day shocks are distinct states;
  - signed up/down-volume proxies are noisy and must not be called true buy/sell volume;
  - own-history RVOL is preferred before cross-stock turnover normalization; issued shares are not free float;
  - turnover x 52-week-high evidence exists but currently has high redundancy / implementation-cost risk.
- Strongest Shadow directions remain: same-slot 15m RVOL, nonlinear breakout volume, constructive dry-up vs no-demand, acceptance lifecycle, price-limit control, and abnormal-volume persistence.
- Formal Core unchanged / LOCKED.

## Price-Volume lane update — PV-016 through PV-020
- Current cursor: PV-001 through PV-020 complete; continue from PV-021.
- New durable synthesis:
  - session cumulative average / VWAP-style position is an acceptance diagnostic, not proven standalone alpha;
  - price-impact / effort-result features require liquidity and Taiwan price-limit controls;
  - Taiwan opening gaps must be split into overnight shock and intraday acceptance because the two return components have different behavioral / information dynamics;
  - multi-timeframe volume should update one latent participation state rather than award duplicate points at daily/60m/15m/10m horizons;
  - preferred architecture is now five latent layers: Participation, Price Response, Acceptance Lifecycle, Persistence, Constraint/Guard.
- The research lane is intentionally converging toward a compact conditional state model instead of accumulating indicators.
- Formal Core unchanged / LOCKED.

## Price-Volume lane update — PV-021 through PV-027
- Current cursor: PV-001 through PV-027 complete; continue from PV-028.
- New durable conclusions:
  - intraday time-block concentration must use as-of historical block baselines; live snapshots must never use eventual full-day volume as denominator;
  - the practitioner dry-up -> expansion -> retest contraction -> reacceleration sequence is a falsifiable hypothesis, not a proven bullish law;
  - PV features must demonstrate incremental value after Formal A/B, Pattern Maturity, Residual RS, sector, institution, overheat, liquidity, Information Discreteness and regime controls;
  - prospective governance now has explicit pilot/evidence/milestone gates; no continuous outcome-driven threshold tuning;
  - a minimum viable research-only Shadow set is defined: pvDailyRvol20, pvSlotRvol20, pvCumvolPace20, pvResponseState, pvAcceptanceState, pvPersistenceState, pvGuardState plus coverage/provenance, while reusing existing Worker fields;
  - price-volume usefulness must be tested separately for directional alpha and risk/information-intensity prediction;
  - stock-specific residual RVOL versus market/sector activity is worth testing as contextual normalization, not another additive score.
- Minimal PV Shadow logging is now technically/research-governance ready to propose, but no Formal scoring change is approved.
- Formal Core unchanged / LOCKED.

## Price-Volume lane update — PV-028 through PV-032
- Current cursor: PV-001 through PV-032 complete; continue from PV-033.
- New durable conclusions:
  - current-day trade details / volume-at-price must not be backfilled from OHLCV; historical microstructure features require prospective capture;
  - transaction-count research is potentially useful for volatility but is second-stage because current historical candle data lack trade count;
  - corporate actions create structural breaks in raw-volume baselines; splits/par-value changes/capital reductions/long halts require a guard and baseline rebuild unless adjustment semantics are verified;
  - downside high-volume events may carry asymmetric risk but remain directionally ambiguous because capitulation/absorption is possible;
  - PV research has now been mapped to the existing funnel: after-market selection, 15m confirmation, gap/maxChase risk, stop-risk diagnostics, and future re-add research, with Formal behavior unchanged.
- Highest direct optimization hypothesis remains replacing/augmenting the current 15m previous-5-bar volume comparison in Shadow with same-slot RVOL + cumulative pace, then testing false-confirmation / no-follow-through outcomes.
- Research-only minimum PV logging remains the preferred first engineering step; no selection/ranking/BUY/maxChase/stop/capital/push/re-add changes are approved.
- Formal Core unchanged / LOCKED.
