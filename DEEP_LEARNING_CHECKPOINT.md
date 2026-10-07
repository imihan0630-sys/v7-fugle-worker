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

## DL-001A — Canonical ID redundancy falsification / Taiwan price-limit residual path
Run date: 2026-09-26 Asia/Taipei

### Question
Before implementing the canonical Information Discreteness (ID) metric as a new research feature, is it genuinely incremental to the system's existing ret20 + positiveDayRatio20 fields?

### Source/evidence refresh
- Da, Gurun & Warachka's canonical FIP/ID construction is sign(cumulative return) × (% negative days - % positive days) over the formation period.
- Huang et al. (JFE 2022) reproduces the same construction explicitly.
- Lin, Ko, Chen & Chu (Pacific-Basin Finance Journal 2016) provides Taiwan-specific evidence and reports that a modified non-limit-hit ID measure is more discriminating for Taiwan earnings momentum than standard ID; limit-hit days are treated as attention-grabbing discrete-information events.
- Galvani (Finance Research Letters 2024) is retained as regime counterevidence: the FIP/ID relation is concentrated in UP markets and is not a universal state-independent law.

### Redundancy falsification
Let p = positive-day fraction, n = negative-day fraction, z = zero-return-day fraction and s = sign(cumulative return). Canonical ID = s × (n - p) = s × (1 - z - 2p).
Therefore, when zero-return days are absent, canonical ID is exactly determined by cumulative-return sign plus positiveDayRatio. With rare zero-return days it remains near-mechanically determined by those fields plus z.
The current research layer already stores ret20 and positiveDayRatio20. Therefore a plain 20-day canonical ID would mostly rename existing information rather than add an independent variable.

### Decision
- Standard 20-day canonical ID: REJECTED_OR_REDUNDANT as a standalone new factor unless later evidence shows a nontrivial zero-return/period-definition difference.
- Do not add a duplicate ID score to Formal or Shadow merely because the literature labels it separately.
- The Taiwan-specific residual hypothesis remains live: isolate gradual directional-day imbalance on non-limit-hit days and keep limit-hit events as a separate attention/discrete-event state.
- This modified path must still prove incremental value beyond positiveDayRatio20, ret20, volatility20, maxDrawdown20Pct, breakoutQualityResearch, Quiet/Attention, gap/limit-state and regime.

### Smallest pre-registered next feature
Research-only candidate, not yet coded:
1. idNonLimitDirectionalImbalance20 = sign(ret20) × (negNonLimitDays - posNonLimitDays) / validNonLimitDays.
2. limitHitDayCount20 and limitHitDirection20 are separate context fields; they are NOT added into the continuous-information score.
3. validNonLimitDays must exclude days whose authoritative exchange price-limit state cannot be established; missing limit-state evidence => UNKNOWN, not non-hit.
4. No outcome-driven thresholding. The feature remains continuous; any bucket cutpoints must be frozen prospectively or use rank/quantile diagnostics that do not alter Formal behavior.
5. Regime split is mandatory: BULL_BROAD / MIXED / BEAR_BROAD (or canonical system labels), because the external evidence is state-dependent.

### Falsification / redundancy test
- First test same-date partial/incremental association against positiveDayRatio20 and ret20.
- Then add volatility20, maxDrawdown20Pct, breakoutQualityResearch, Quiet/Attention and price-limit context.
- If the modified feature loses incremental value after those controls, classify REJECTED_OR_REDUNDANT.
- If value appears only in one regime or one industry cluster, retain as conditional evidence, not universal alpha.
- Do not infer causal investor inattention from the metric alone.

### Status
FALSIFICATION_IN_PROGRESS / RESEARCH_ONLY.
Formal Core unchanged.

## DL-001B — Authoritative price-limit source gate / incremental-content reduction
Run date: 2026-09-26 Asia/Taipei

### Source feasibility
- Current V8.7.1 `researchLimitState()` is heuristic, using current OHLC versus prior close and approximate 8%/9.5% bands. It is not authoritative enough for DL-001 because Taiwan daily limits are tied to the session opening-auction reference price and have explicit exception regimes.
- TWSE official public `TWT84U` exposes today's limit-up, opening-auction reference and limit-down prices plus prior-day context. This makes exact prospective TWSE capture feasible without reconstructing limits from prior close.
- TPEx official EDIS S38 / `STKT2QUOTESN.TXT` defines the daily marker explicitly: '+' up, '^' limit-up, '-' down, 'v' limit-down, blank flat and 'X' non-comparable, and includes next-day reference/limit prices. TPEx also has a date-queryable official public historical daily surface already validated in the Corporate Actions lane.
- Historical public reconciliation is not identical to immutable first-known archived bytes. For prospective research, raw source receipt/hash should be preserved. Missing archive/vintage evidence remains UNKNOWN.

### Structural falsification
Canonical ID is already redundant with ret20 sign + positive-day proportion (+ zero-day treatment).
The Taiwan non-hit construction is formed by removing limit-hit days from the same positive/negative day-count path. Therefore, conditional on the existing canonical day-sign information, the only new degrees of freedom are the number and direction of official limit-hit sessions (and denominator handling).
This means ID_non_hit should not be marketed as an independent broad gradual-path factor in this system.

If a 20-day window contains zero official limit-hit sessions, the Taiwan modification contributes no price-limit-exclusion information. Such rows cannot establish incremental DL-001 value.

### Literature counterevidence retained
Lin et al. (2016) reports stronger earnings-momentum separation for ID_non_hit than standard ID, but its ID_hit measure itself had no discriminatory ability for earnings surprises. The sample also used the old +/-7% regime, while modern Taiwan has +/-10% limits and continuous intraday trading. Transportability to 2026 after-market stock selection is unproven.

### Frozen v0.1 direction
A new spec is now durable in `INFORMATION_DISCRETENESS_SHADOW_SPEC.md`.
No additive score is proposed. The only v0.1 primitives worth prospective evidence are exact official limit-hit coverage/count/direction plus diagnostic canonical/non-hit imbalance.

Primary candidate object:
- `limitHitCount20`
- `signedLimitHitBalance20`
- `limitHitShare20`
with NO_PRICE_LIMIT / UNKNOWN kept separate.

No recency weighting, threshold sweep, nonlinear transform or Formal use.

### Status
Canonical ID: REJECTED_OR_REDUNDANT.
ID_non_hit as standalone broad factor: REJECTED_OR_REDUNDANT pending any evidence to the contrary.
Official price-limit context: FALSIFICATION_IN_PROGRESS / SPARSE_CONTROL_CANDIDATE.
Formal Core unchanged.


## DL-001C — Source/frequency gate / regime-dependent sparsity
Run date: 2026-09-26 Asia/Taipei

### Source-contract result
- TWSE exact daily limit/reference research is feasible through official TWT84U; the official report is date-queryable historically. TWSE Data E-Shop T97 supplies a stronger archive product path from 2014-01-06.
- TPEx exact daily limit classification is feasible through official S38 / STKT2QUOTESN.TXT marker semantics and the public date-queryable daily quote lane. Historical public reconciliation is not conflated with immutable first-known S38 bytes.
- Current V8.7.1 heuristic `researchLimitState()` remains prohibited as authoritative DL-001 truth.

### Outcome-free frequency sample
Official TWSE MI_INDEX stock counts provide an event-frequency cross-check without using future returns:
- 2026-09-24: 11 limit-up + 1 limit-down out of 1081 stock rows = 1.1101%.
- 2026-09-23: 15 + 1 out of 1081 = 1.4801%.
- 2026-09-04: 15 + 1 out of 1081 = 1.4801%.
- 2026-06-30: 59 + 1 out of 1078 = 5.5659%.

This falsifies a universal “too rare to matter” assumption. Price-limit events are sparse cross-sectionally on some dates but strongly regime/date dependent. It also falsifies any independence shortcut from a daily market hit rate to a 20-session per-symbol probability.

### Research consequence
- Frequency Gate = NOT_REJECTED_BUT_NOT_PROMOTED.
- The relevant denominator is not the whole market alone. The after-market selector is momentum/quality conditioned, so candidate-level exposure to recent limit-hit sessions may differ materially.
- Next evidence must therefore measure `limitHitCount20>0` on the exact prospective Shadow parent population, with cohort and regime stratification, before any forward-return analysis.
- No return outcome was inspected in this gate.

### Durable artifact
`research/information_discreteness_source_frequency_receipt_v0_1.json`.

### Optimization bridge status
No `FORMAL_OPTIMIZATION_CANDIDATE` yet.
The plausible eventual implementation, only if all later falsification gates pass, would be a conditional price-limit context/guard rather than a new additive Information Discreteness score.


## DL-003 — Trend / Momentum / Reversal lane initialized
Run date: 2026-09-26 Asia/Taipei

Dedicated durable files:
- `TREND_MOMENTUM_REVERSAL_RESEARCH.md`
- `TREND_MOMENTUM_REVERSAL_CHECKPOINT.md`

### Current findings
- Taiwan-specific evidence supports studying **market-state continuation versus transition**, not treating momentum as a monotonic past-return signal.
- Existing R06 is only a partial implementation: it counts regime-label transitions across observed research dates, but does not yet attach as-of continuation/transition lifecycle state to each Shadow parent or compare candidate outcomes by that state.
- Important falsification: adjacent observed research dates are not necessarily adjacent official trading sessions. A missing/failed scan can make a direct X->Y transition path unknowable. Future R06 semantics must distinguish TRANSITION from GAP_UNKNOWN.
- Current Formal `scoreCandidate()` / `strategySetupState()` do not consume research regime or transition state; therefore this is potentially incremental, but unproven.
- Taiwan-specific Momentum Gap evidence is negative; it is rejected from current research priority.
- Taiwan Extreme Absolute Strength evidence is relevant, but the mechanism is highly overlapping with current Formal `lateStage` and research `overheatPenalty` / ATR controls. No new score is justified without incremental evidence.

### Optimization bridge
No FORMAL_OPTIMIZATION_CANDIDATE yet.
The only plausible future form is a conditional transition-risk context/guard if prospective evidence proves worse follow-through / higher MAE / false-break risk during true consecutive-session regime transitions after controlling the regime level itself and existing momentum/overheat factors.

Formal Core unchanged.


## Exact next continuation point
1. Do not resurrect canonical ID or ID_non_hit as standalone additive factors. Their broad path information is redundant; only exact price-limit count/direction remains potentially incremental.
2. Next DL-001 step: bounded prospective source receipt / coverage test using official TWSE TWT84U and official TPEx daily limit state. Measure authoritative coverage and the frequency of windows with limitHitCount20>0 before looking at outcomes.
3. If limit-hit frequency/coverage is insufficient, reject DL-001 as too sparse for the after-market selector rather than adding complexity.
4. Only if the source/frequency gate passes, test limitHitCount20 / signedLimitHitBalance20 incrementally against ret20, positiveDayRatio20, volatility20, maxDrawdown20Pct, breakoutQualityResearch, overheat, Quiet/Attention, sector/Residual RS, liquidity and regime.
5. Independently continue the next highest-value under-reconciled Master-Map domain after the DL-001 source/frequency gate; avoid duplicating existing specialist lanes.
6. Keep Formal Core unchanged unless mature evidence passes governance and owner explicitly approves.


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

## Price-Volume lane update — PV-033 through PV-037
- Current cursor: PV-001 through PV-037 complete; continue from PV-038.
- PV research now has a concrete research-only engineering spec in `PRICE_VOLUME_SHADOW_SPEC.md`.
- Durable conclusions:
  - direction and risk outcomes must be evaluated separately; PV may be useful for volatility/MAE/stop-first/false-confirmation even if return-sign prediction is weak;
  - daily market/sector residual RVOL is feasible using current full-market daily history, but full-market 15m residualization is deferred;
  - volume shocks need freshness/decay variables rather than a guessed universal N-day expiry;
  - PV, Information Discreteness and news/attention context must be treated as interacting proxies, not blindly additive factors;
  - research snapshots must be immutable as-of-time, outcomes stored separately, completed bars only, corporate-action reset enforced and Formal-isolation regression tested;
  - highest-value experiment remains current previous-5-bar 15m volumeRatio vs same-slot RVOL + cumulative-volume pace.
- `PRICE_VOLUME_SHADOW_SPEC.md` is specification only; no Worker.js Formal logic has been changed.
- Formal Core unchanged / LOCKED.

## Price-Volume lane update — PV-038 through PV-047
- Current cursor: PV-001 through PV-047 complete; continue from PV-048.
- New durable conclusions:
  - volume-conditioned return autocorrelation is worth pooled research but not stable enough as a per-stock ~60D field, and it cannot identify trader motive directly;
  - OBV / A-D / CMF / MFI / Volume Oscillator mostly repackage primitive price-direction, close-location and volume relationships already available, so they should not be stacked as independent scores;
  - Shadow v0.1 RVOL semantics are frozen to robust prior-20-valid-session medians for daily, same-slot and cumulative-pace baselines; insufficient history => UNKNOWN;
  - persistent abnormal-volume episodes require event de-duplication so many snapshots do not masquerade as independent signals;
  - volume should moderate momentum life-cycle / late-stage context, not be interpreted as monotonic strength;
  - Taiwan/TPEx mainboard 15m interpretation must distinguish opening call-auction, continuous session and closing call-auction phases;
  - intraday volatility interruption is a genuine confounder but must not be reconstructed from OHLCV without a reliable event source;
  - ex-rights/ex-dividend gap/return features must use exchange-consistent adjusted reference prices, not raw previous close;
  - ESB/other incompatible market structures are outside PV Shadow v0.1 semantics.
- `PRICE_VOLUME_SHADOW_SPEC.md` has been synchronized with normalization and Taiwan market-structure guards.
- Formal Core unchanged / LOCKED.

## Price-Volume lane update — PV-048 through PV-057
- Current cursor: PV-001 through PV-057 complete; continue from PV-058.
- New durable conclusions:
  - limit-up/down is a market-structure context; historical candles cannot reconstruct lock duration, unlock/relock history or queue history, while live five-level quote data support prospective candidate-state capture only;
  - price-volume divergence must use pivots confirmed as-of-time and normalized participation, with constructive/adverse interpretations retained until later acceptance/failure;
  - issued-share turnover is feasible from official daily TWSE/TPEx company-basic data, but issued shares are not free float and corporate-action dating is mandatory;
  - all PV evidence must be evaluated across existing BULL_BROAD / MIXED / BEAR_BROAD regimes rather than assigned a universal sign;
  - an integrated PV interpretation matrix now explicitly records constructive interpretation, adverse interpretation, UNKNOWN/guard conditions and exact evidence for each state;
  - Pattern Maturity owns geometry; PV owns participation/response/acceptance. Named-pattern volume bonuses are prohibited when they duplicate the same latent PV state;
  - sector leader/follower PV timing is a moderator only; leader definitions must be as-of-time and incremental value must beat current sector score/breadth/RS;
  - abnormal-volume episodes retain a frozen pre-event baseline for persistence/decay while the ordinary robust rolling median remains intact;
  - PV governance levels are OBSERVER/MODIFIER/VETO; every current PV feature is OBSERVER. Data invalidity can veto PV interpretation, not the Formal stock;
  - the first prospective experiment is frozen: within the existing selected/monitored cohort, compare current previous-5-bar 15m volumeRatio against same-slot RVOL + cumulative pace + latent states for false/no-follow-through and MFE/MAE.
- `PRICE_VOLUME_SHADOW_SPEC.md` has been synchronized through PV-057.
- Formal Core unchanged / LOCKED.

## Price-Volume lane update — PV-058 through PV-062
- Current cursor: PV-001 through PV-062 complete; continue from PV-063.
- New durable conclusions:
  - false/no-follow-through labels are now frozen separately for A and B using only levels that existed at the anchor timestamp; later bars determine outcomes but never redraw the anchor;
  - same-session B1/B2/B4 horizons never roll across the overnight boundary; incomplete late-session horizons remain INCOMPLETE, while NEXT_SESSION and D1/D3/D5/D10 are separate outcome families;
  - PV outcome completion is idempotent under the current every-minute cron architecture: immutable feature snapshots, one outcome per snapshot+horizon, no duplicate or retroactive mutation;
  - resource audit shows the minimum PV layer should reuse existing 15m frames with zero extra live candle calls during ordinary monitoring; historical same-slot baseline bootstraps once per newly monitored symbol then rolls forward;
  - **superseded by PV-068:** current Formal cron stops at 13:24, so zero-extra-call v0.1 observes completed 15m bars starting 09:00 through 13:00 only: 17 bars x 6 stocks = 102 rows/trading day before outcomes; repeated minute cron runs must not duplicate rows;
  - research reporting remains admin/research only with no PV-based push or action language.
- `PRICE_VOLUME_SHADOW_SPEC.md` has been synchronized through PV-062.
- Formal Core unchanged / LOCKED.

## Price-Volume lane update — PV-063 through PV-077
- Current cursor: PV-001 through PV-077 complete; continue from PV-078.
- New durable conclusions:
  - pvResponseState v0.1 now has frozen formula semantics using robust same-slot participation, same-slot true-range normalization, close location, body/wick structure and guard-aware downgrade; HIGH_EFFORT_LOW_PROGRESS remains directionally ambiguous.
  - A and B use separate immutable acceptance state machines; Shadow observes current Formal geometry and never causes a state transition.
  - persistence uses a pre-registered hysteresis rule around the existing 1.3 abnormal threshold; missing/halted observations pause state evolution rather than normalize the episode.
  - guard semantics now store primary precedence + all flags + VALID/GUARDED/INVALID interpretability; PV data invalidity never invalidates the Formal stock.
  - implementation-ready pseudocode and mandatory tests exist under schema PV_SHADOW_V0_1; Worker.js remains unchanged.
  - provider/cron audit corrected the zero-extra-call 15m ceiling to 17 bars/symbol and 102 rows/day across 6 stocks; closing-auction research is outside the current live-monitor path.
  - Taiwan-specific Tier-2 context now includes day-trading intensity, official daily transaction count/average trade size, attention/disposition flags and strict source-scope normalization.
  - PV-029 was partially corrected: historical intraday transaction count remains unavailable from candle history, but daily transaction count is already present in official exchange closing data and can be added at low incremental cost.
  - Tier-2 scope has been pruned; the next value should come from prospective v0.1 evidence rather than adding more indicators.
- PRICE_VOLUME_SHADOW_SPEC.md is synchronized with the corrected 102-row current-cron bound and source-scope rules.
- Formal Core unchanged / LOCKED.

## Price-Volume lane update — PV-078 through PV-092
- Current research cursor: PV-001 through PV-092 complete.
- PV v0.1 has moved from idea discovery to validation/implementation readiness; further indicator expansion is intentionally paused.
- Superseded assumptions are explicitly marked rather than silently deleted. Current zero-extra-call live coverage is 17 completed 15m bars/symbol, 102 rows/day max for six monitored stocks; daily transaction count is feasible from official closing data even though historical intraday trade-count is not available from candles.
- New canonical engineering authority: `PRICE_VOLUME_SHADOW_IMPLEMENTATION_PLAN.md`.
- New durable test history: `PRICE_VOLUME_HYPOTHESIS_LEDGER.md`, starting with PV-H001 through PV-H004.
- PV_SHADOW_V0_1 now has frozen: response formula, separate A/B acceptance state machines, persistence hysteresis, guard precedence, field/null semantics, slot/bootstrap rules, fingerprints, deterministic fixtures, outcome horizons, idempotent finalizers, Formal-isolation tests, feature flag, kill switch, rollback criteria and validation governance.
- Statistical evaluation is event/date aware; raw 15m snapshot count is not treated as iid sample size. Effect size, MFE/MAE, coverage, valid-opportunity loss and capital-utilization impact matter alongside statistical inference.
- All current PV remains Level-0 OBSERVER. The only implementation readiness conclusion is: owner-authorized Class-A LOG_ONLY decisionImpact=false Shadow logging is sufficiently specified. No Formal A/B/ranking/BUY/maxChase/stop/capital/push/re-add optimization is supported yet.
- Worker.js remains unchanged / Formal Core LOCKED.
- Next rational phase after owner authorization: implementation -> DATA_QA -> prospective evidence -> untouched confirmation block -> only then consider any Modifier proposal.

## Price-Volume lane update — PV-093

- Owner-authorized V8.11.0 implements `PV_SHADOW_V0_1` as Class-A `LOG_ONLY`; `PV_SHADOW_ENABLED=false` remains the default and every stored record declares `decisionImpact=false`.
- The collector reuses completed 15m monitoring data, keeps daily/intraday units separate, stores immutable fingerprints and outcomes, and performs baseline bootstrap only in the after-market research path.
- Intraday and after-market PV work begins only after the corresponding Formal state/push persistence and is fail-open with zero PV push/action semantics.
- Deterministic T1–T18 fixtures are the initial oracle. PV-H001 through PV-H004 now enter `DATA_QA`, with no prospective evidence and no permission to change Formal.
- Formal Core remains LOCKED. The next phase is controlled enablement, first-session data-integrity review and the frozen first-50-event QA gate.


## Pattern Maturity lane update — DL-002II through DL-002JH
- Durable authority remains `KLINE_PATTERN_RESEARCH.md`.
- Provider/code audit materially resolved prior data uncertainty:
  - Fugle historical daily API already provides OPEN and turnover; current Worker mapping discards OPEN.
  - Fugle supports explicit `adjusted=true/false` for D/W/M; current Worker does not specify adjustment mode.
  - ordinary listed/OTC daily volume is shares; turnover is TWD; minute volume is lots.
  - historical minute bars are provider-supported from 2023-05-23, but are not required for Pattern Selection Shadow v0.1.
  - historical candle request windows must be <1 year, so 260-bar research bootstrap must use deterministic chunking.
- Official corporate-action continuity is feasible for both TWSE and TPEx; Pattern research must preserve RAW traded series separately from MORPHOLOGY continuity and total-return outcome semantics.
- Pattern Shadow storage/schema, no-lookahead anchor chronology, zone versioning, episode de-duplication, outcome anchors, C1-C8 counterexample stress pack, detector versioning and kill criteria are now specified.
- Code search did not locate an implemented runtime table/API matching the conceptual Shadow Candidate Archive cohort names; do not assume that archive exists physically.
- v0.1 scientific scope is deliberately narrow: observe current selector candidate/control populations and test incremental structural information; no full-universe pattern engine, ML/DTW, or Formal integration.
- Formal Core remains LOCKED.
- Exact next continuation:
  1. locate/reconcile actual scan-pipeline storage for rejected/near-miss candidates under any different naming;
  2. validate adjusted=true behavior on TWSE/TPEx corporate-action fixtures;
  3. freeze deterministic C1-C8 fixture inputs/expected detector states;
  4. then evaluate whether isolated Class-A PATTERN_SELECTION_SHADOW_V0_1 implementation is ready.


## Pattern Maturity continuation — DL-003D (2026-09-25 21:22 Asia/Taipei)

### Research topic / question
Reconcile the stale Pattern continuation recorded in this file against newer durable K-line research, verify whether Shadow Candidate Archive physically exists, and tighten corporate-action adjustment validation before any Pattern Shadow implementation.

### Sources / evidence
- GitHub main `KLINE_PATTERN_CHECKPOINT.md` and `KLINE_PATTERN_RESEARCH.md`: newer durable Pattern work has already frozen the isolated data schema/replay contract and implementation order; do not redo those items.
- GitHub main `scripts/apply_v8_7_2.py`: creates D1 table `trade_research_shadow_candidates`, persists SELECTED / QUALIFIED_NOT_SELECTED / NEAR_MISS / REJECTED_AFTER_BASE / BROAD_CONTROL, and exposes research-only summaries.
- GitHub main `.github/workflows/v7-cloudflare.yml`: production build applies V8.7.2 and validates `CREATE TABLE IF NOT EXISTS trade_research_shadow_candidates`; therefore absence from raw base `Worker.js` is not evidence that the runtime archive is absent.
- Fugle official Historical Candles docs: `adjusted=true/false` is supported for D/W/M, response identifies `adjusted`, and adjusted=true computes change from the adjusted series. Official docs also state ex-dividend daily change uses adjusted previous-close semantics. Example confirms adjusted OHLC behavior for TWSE 2412 around 2026-07-09.
- Fugle official Corporate Actions docs: dividend endpoint provides exchange, previousClose/referencePrice and dividend components; capital-change endpoint provides effectiveDate and adjustmentFactor for par-value changes/capital reductions/ETF splits/merges.

### Supporting evidence
1. The conceptual Shadow Candidate Archive blocker is RESOLVED at code/build-contract level: the physical D1 table and cohort construction are implemented by the V8.7.2 build patch.
2. Pattern Shadow can prospectively link to the existing archive instead of inventing a new cohort store.
3. Vendor documentation supports an explicit RAW vs ADJUSTED morphology contract and provides official corporate-action metadata needed for cross-checking.

### Counterevidence / alternative mechanisms
- Raw main `Worker.js` is a pre-build base; repository code search alone can falsely suggest the archive is absent. Build lineage must be considered.
- Documentation proves API semantics but does NOT by itself prove a representative TPEx corporate-action fixture reproduces the expected adjusted continuity numerically. TPEx fixture validation remains UNKNOWN, not PASS.
- Adjusted history may be vendor-revised after later corporate actions; raw bars, fetched adjusted bars, source payload hash/version and corporate-action registry must therefore remain separate.

### Bias / overfit / redundancy checks
- No return outcomes were inspected and no detector threshold was tuned.
- No historical Shadow rows were fabricated.
- Pattern cohort storage will reuse existing Shadow Candidate Archive; creating a second archive would be redundant and risks cohort drift.
- Corporate-action adjustment is a data-validity requirement, not an alpha factor and must not be scored.

### Comparison with current selector / three-pool architecture
- Existing archive is generated from the formal scan pipeline and preserves cohort/pool context while declaring researchOnly=true and decisionImpact=false.
- Pattern research should attach immutable detector snapshots to these existing candidate/control populations and later compare incremental information within the same scan dates.
- No A/B definition, 3+3+3 quota, ranking, BUY, maxChase, capital, push or Formal monitoring behavior needs to change for this research layer.

### Incremental value
YES for research infrastructure integrity: resolving the actual archive lineage removes a false blocker and prevents duplicate storage. Alpha value remains UNKNOWN until prospective Pattern snapshots accumulate and pass replay/data QA.

### Conclusion status
- Shadow archive lineage: RESOLVED / REUSE_EXISTING.
- Fugle adjusted semantics: DOCUMENTED / TWSE EXAMPLE CONFIRMED.
- TPEx corporate-action numeric fixture: UNKNOWN / VALIDATION_REQUIRED.
- Pattern detector alpha: UNKNOWN / NO RETURN CLAIM.
- Engineering: still Class-A candidate only if isolated, LOG_ONLY/Shadow-only and Formal-isolation tests pass; no implementation authorization is inferred here.
- Formal Core: LOCKED / unchanged.

### Exact next continuation point
1. Do not repeat DL-003B/C: they are already frozen in `KLINE_PATTERN_RESEARCH.md`.
2. Validate at least one TPEx and one additional TWSE corporate-action fixture by comparing RAW vs adjusted=true OHLC around the event against official dividend/capital-change reference fields; if authenticated historical payload is unavailable, keep the numeric result UNKNOWN rather than infer PASS from documentation.
3. Freeze deterministic C1-C8 synthetic/adversarial fixture inputs and expected swing/topology/maturity states under the already-frozen detector architecture; no future returns may be used.
4. Audit whether the existing Shadow archive rows expose a stable row reference/link contract sufficient for `pattern_outcome_link`; avoid a second candidate archive.
5. Only after adjustment + replay/prefix-invariance + C1-C8 gates are executable, evaluate isolated Class-A `PATTERN_SELECTION_SHADOW_V0_1` implementation readiness.
6. Continue external evidence search for weekly/daily nested resistance and Pattern x regime interactions, explicitly controlling redundancy with priorHigh60/MA60/R01 and existing breakout/overheat fields.


## Pattern Maturity continuation — DL-003E (2026-09-25 Asia/Taipei)
- New external evidence audit focused on nested daily/weekly resistance and Taiwan 52-week-high anchoring.
- Taiwan peer-reviewed evidence (1982-2012, TWSE+OTC) supports the 52-week-high anchor as potentially informative but materially regime/specification sensitive; it does not justify a hard resistance veto.
- Cross-market counterevidence finds horizontal support/resistance can predict some interruptions without producing excess return versus buy-and-hold. Therefore resistance geometry remains context/risk information, not presumed alpha.
- Current-program comparison: priorHigh60, MA60, ret20, overheat and R01 already capture much of generic resistance/momentum. Incremental candidate is narrower: confirmed 120/260-bar structural-zone distance, zone age/recency, repeated-test progression and local-breakout-vs-major-zone conflict/availableAir.
- Positive hypothesis: conditional on existing local breakout quality and momentum controls, small availableAir to a stable major zone may explain some near-term R01 failures / lower MFE.
- Falsification: reject if effect disappears after priorHigh60/MA60/ret20/overheat controls, flips by neighboring zone scale without mechanism, or is driven by old regimes/dates.
- Status: WORTH_SHADOW_RESEARCH only; no Formal optimization proposal, no score/gate change.
- Durable detail is in KLINE_PATTERN_RESEARCH.md commit eb17b418659ad7543a4d2cd9fa3d7ebb22b5f7f6.

### Exact next continuation point
1. Pattern: resolve authenticated RAW-vs-ADJUSTED corporate-action path and executable C1-C8 tests; keep current connector mismatch DATA_BLOCKED.
2. Pattern: pre-register one transparent major-zone hierarchy for nested-resistance Shadow fields before looking at outcomes; control priorHigh60/MA60/ret20/overheat/R01 redundancy.
3. Pattern: only after detector/replay/prefix-invariance gates pass, enable prospective observer logging; no historical Formal-cohort fabrication.
4. Cross-lane: consume Corporate Actions lane semantic spaces (RAW_EXECUTION / TECHNICAL_CONTINUITY / PRICE_INDEX_COMPARABLE / TOTAL_RETURN_COMPARABLE) rather than creating a competing adjustment engine.
5. Formal Core remains LOCKED.


## Pattern Maturity continuation — DL-003F (2026-09-25 Asia/Taipei)
- Pattern research has advanced from SPEC-only into an isolated executable detector-QA prototype on Draft PR #102; no Worker.js/runtime wiring or deploy.
- Latest validated PR head in this update: `580d6080e89b4f750f16633c34bf8409b3e5941c`.
- CI evidence: V8 Regression `36146803521` SUCCESS; V8 Repair `36146803565` SUCCESS.
- Early failures were retained and repaired: null/blank numeric values no longer coerce to 0; C2 VCP topology is independently tested rather than hidden inside swing extraction.
- C1-C8 adversarial fixtures are executable. Prefix invariance, replay exactness, price-scale invariance, missing-OPEN honesty, duplicate/order guards, confirmed `pivotAt/confirmedAt`, immutable zone versions, Shadow parent-hash drift detection and semantic-space provenance guards are executable.
- Primary swing prototype now implements the frozen lagged-ATR design: k=1/2/3 MICRO/BASE/MAJOR and threshold frozen from the prior completed bar at leg start. No scale chosen by future returns.
- Outcome-free nested-resistance hierarchy is frozen: Formal priorHigh20 comparator; BASE k=2/120 symbol sessions; MAJOR k=3/260 sessions; simple 260-session high redundancy comparator. Available-air stays continuous; there is no hard resistance veto.
- Swing-only VCP layer cannot claim full maturity until range/volume context is implemented; status stays `TOPOLOGY_ONLY_NEEDS_RANGE_VOLUME`.
- Corporate Actions cross-lane now supplies the correct semantic contract. FCNT000154 adjusted=false remains blocked as trusted RAW, while Pattern consumes RAW_EXECUTION / TECHNICAL_CONTINUITY etc. Real QA witnesses now include TWSE 2412/8454 and TPEx 5314.
- Important falsification: a corporate-action day must not blindly suppress all gaps. Only the mechanical reset is neutralized; a residual continuity-space gap remains market information.
- Pattern reuses the V8.7.2 Shadow archive with parent identity `scan_date|symbol` plus parent snapshot hash; same natural key/different hash is a provenance conflict.
- Exactly four Pattern x Regime hypotheses are preregistered (RG1 breakout acceptance, RG2 nested resistance, RG3 VCP/compression, RG4 reversal/prior trend). No combinatorial interaction search.
- No forward-return outcomes were inspected; alpha remains UNKNOWN; no R09; Formal Core remains LOCKED.
- Durable details: KLINE_PATTERN_RESEARCH.md main commit `a245b486dc60f29b623546416c2db4c6994465a4`; KLINE_PATTERN_CHECKPOINT.md commit `1b53e88c5aab6e7dbb4bb57f2889a72c7a794776`.

### Exact next continuation point
1. Keep Draft PR #102 unmerged/un-deployed; detector QA alone is not production authorization.
2. Complete isolated VCP range/volume context and W/Platform lifecycle semantics, preserving latent-geometry vs named-label separation.
3. Specify the isolated Pattern research-cache adapter that consumes Corporate Actions semantic spaces; no direct trusted RAW from the coercing FCNT000154 path and no second adjustment engine.
4. Add observability contract: coverage, DATA_BLOCKED reasons, prefix/replay exactness, scale disagreement, compute cost.
5. Only after prospective complete Shadow-parent coverage exists may Pattern snapshots link to D1/D3/D5/D10/MFE/MAE/R01 outcomes.
6. Run only frozen PATTERN-RG1..RG4 plus preregistered redundancy controls before adding interactions.
7. Continue positive AND negative validation; reject Pattern variables that collapse into priorHigh60/MA60/ret20/overheat/R01 or atrPercent/volatility20/volumeContraction/platformRange.
8. Do not propose Formal optimization until prospective evidence meets existing maturity/date/regime/holdout/cost gates.


## Pattern Maturity continuation — DL-003G (2026-09-25 Asia/Taipei)
- Draft PR #102 advanced in isolated research-only state.
- VCP range/volume context, W lifecycle and Platform lifecycle are now executable and regression-covered; named labels remain subordinate to latent geometry/context.
- New isolated Pattern cache adapter consumes Corporate Actions `TECHNICAL_CONTINUITY` and `RAW_EXECUTION` semantic spaces with point-in-time provenance and hash-drift detection; it does not build a competing adjustment engine.
- New observability contract measures coverage, DATA_BLOCKED reasons, replay/prefix exactness, scale agreement and compute time.
- First adapter CI attempt failed from a literal escaped-newline import bug; the error was diagnosed and repaired rather than reported-and-stopped. Corrected branch head `adefb586b4af2cbff6afd62dd0a6e0f7c413c784` passed V8 Repair `36147957526` and V8 Regression `36147957785`.
- New 2025 peer-reviewed Taiwan historical-high evidence shows that a true break above old highs can be a distinct momentum/reference-point regime, with turnover/size/seasonality heterogeneity. This is counterevidence against treating major resistance as a monotonic bearish veto.
- Future Pattern state should therefore preserve lifecycle: APPROACH_MAJOR_ZONE / FIRST_BREAK_ABOVE_MAJOR_ZONE / ACCEPTED_ABOVE_MAJOR_ZONE / FAILED_MAJOR_ZONE_BREAK, while controlling current priorHigh/ret20/overheat/volume/R01 variables.
- No Pattern outcomes were inspected; no parameter was tuned on returns; no R09; Formal Core remains LOCKED.
- Durable detail: `KLINE_PATTERN_RESEARCH.md` main commit `a1dccc96f1aaf8f80efc52b3939b72062e9fd14b`.

### Exact next continuation point
1. Keep Draft PR #102 unmerged/un-deployed and reconcile branch divergence with latest main before further code.
2. Specify isolated prospective Pattern observer persistence/API boundary and episode de-dup, preserving existing Shadow parent lineage.
3. Freeze outcome-free coverage/blocked/replay/prefix/scale/compute acceptance gates before prospective logging.
4. No historical Formal-cohort fabrication; only complete prospective parent coverage may later join D1/D3/D5/D10/MFE/MAE/R01.
5. When enough prospective dates exist, run only PATTERN-RG1..RG4 plus frozen redundancy controls.
6. Treat major-zone first-break/acceptance/failure as lifecycle context, never a hard resistance veto unless future mature evidence supports a separate owner-reviewed proposal.
7. Formal Core remains LOCKED.

## Price-Volume lane update — PV-098 through PV-117
- Current PV research cursor: PV-001 through PV-117 complete.
- The lane has moved from “how abnormal is volume?” to “what may have caused the volume?” while preserving ambiguity and no-look-ahead.
- Dealer flow audit found current Worker dealerBuyDays is based on combined dealer flow, which mixes proprietary and hedge activity. Official TWSE/TPEx payloads already contain the split, so PV-H005 is registered as a zero-extra-API Tier-2 research hypothesis; no Formal change.
- Covered-warrant hedging, ETF creation/redemption, block trades, leverage/shorting, index/passive flow and derivatives expiry are now treated as possible volume-origin/context mechanisms rather than automatic directional scores.
- Existing specialized lanes were reused rather than duplicated: LEVERAGE_SHORTING_RESEARCH.md, PASSIVE_FLOW_INDEX_REBALANCING_RESEARCH.md and DERIVATIVES_VOLATILITY_RESEARCH.md.
- Disposition stocks are now recognized as a serious 15m comparability issue because periodic call-auction timing can conflict with 15m slots. Attention is contextual; disposition can invalidate the clean PV cohort.
- Current research evidence has TWSE attention/disposition coverage but TPEx disposition remains UNKNOWN; missing coverage is not interpreted as normal.
- Disposition sessions should be excluded/paused from normal same-slot baselines rather than zero-filled; normal pre-disposition sessions may remain valid after restrictions end.
- PV_SHADOW_V0_1 stays frozen during DATA_QA. New origin-decomposition ideas remain Tier-2 and OBSERVER only.
- Formal Core LOCKED.

## Price-Volume lane update — PV-118 through PV-130
- Current PV research cursor: PV-001 through PV-130 complete.
- A unified multi-origin taxonomy and AC0~AC4 attribution-confidence system now prevent unsupported claims such as “this breakout volume was caused by smart money/ETF/dealer hedging.”
- TPEx attention/disposition source availability has been corrected: authoritative TPEx public/history sources exist; the current V8.7.11 UNKNOWN state is an integration/coverage gap, not absence of official data.
- Dealer H005 now distinguishes gross participation from net directional imbalance. Same net flow can represent very different trading activity.
- Source-scope compatibility is mandatory before any institutional gross/side participation ratio is computed; institutional daily flow must never use intraday 15m volume as denominator.
- Raw RVOL, market/sector residual RVOL and origin context are complementary dimensions, not duplicate scores.
- Origin studies use full Formal/control cohorts as the primary population; high-RVOL-only restriction is secondary due collider/selection-bias risk.
- Tier-2 priority after core PV DATA_QA: dealer proprietary/hedge split, TPEx disposition parity, daily transaction-count decomposition, actual SBL context, residual daily RVOL.
- PV_SHADOW_V0_1 remains frozen and unchanged; all new origin work is OBSERVER/Tier-2 only.
- Formal Core remains LOCKED.

## Price-Volume lane update — PV-131 through PV-145
- Current PV research cursor: PV-001 through PV-145 complete.
- Institutional origin research now separates gross activity, net direction, streak persistence and trajectory rather than treating “consecutive buying” as a single strength variable.
- Official buy/sell/net data for foreign, trust, dealer proprietary and dealer hedge are worth preserving, but no new standalone Formal factors are approved.
- All institutional participation ratios require source-scope compatibility with the denominator; daily flow can never be divided by 15m regular-session volume.
- Institutional streak evidence in Taiwan is participant/regime/buy-sell asymmetric; longer streak is not assumed monotonically better.
- Current Worker foreignNet is documented as a broad foreignMain+foreignDealer construct; official foreign-main and foreign-dealer semantics should be stored separately in future research capture.
- Investor categories are not independent votes because common information/passive/sector/hedge mechanisms can correlate them.
- Raw buy/sell/net point-in-time records are the durable research object; streaks and trajectories are derived/versioned views.
- H005 implementation remains deferred until PV_SHADOW_V0_1 DATA_QA is stable.
- Formal Core remains LOCKED.

## Price-Volume lane update — PV-146 through PV-160
- Current PV research cursor: PV-001 through PV-160 complete.
- Institutional-origin research is design-complete enough to defer implementation: raw buy/sell/net first, derived streak/trajectory later, scope-compatible denominators only, modular recorder separate from core PV Shadow.
- Foreign-dealer flow appears numerically rare/zero in sampled modern official data, so semantic separation is preserved but engineering priority remains below dealer proprietary/hedge.
- TWSE institutional trade-side participation has a matched-scope fixture; TPEx scope equivalence remains unverified.
- Institutional breadth versus strongest participant is a hypothesis, not a vote score.
- PV now reuses the existing Microstructure research lane. HIGH_EFFORT_LOW_PROGRESS is an umbrella result state, not absorption/distribution.
- Side-specific absorption requires pressure + replenishment + weak price progress evidence. Without it, mechanism remains unresolved.
- Existing V8.8.x execution recorder is sparse; coarse spread/depth/context may be testable, dynamic OFI/replenishment is not reconstructable.
- PV-H006 registered for microstructure incremental value on ambiguous high-effort events.
- PV_SHADOW_V0_1 remains frozen during DATA_QA; Formal Core LOCKED.

## Price-Volume lane update — PV-161 through PV-167
- Current PV research cursor: PV-001 through PV-167 complete.
- execution-shadow-v2 is now treated as a sparse coarse liquidity recorder, not an order-flow database.
- Coarse spread/depth/state research may be possible after live coverage QA; side-specific pressure/replenishment/OFI cannot be reconstructed from current stored rows.
- Important semantic warnings: lastTradeAt currently aliases quote.lastUpdated; FIRST_30M_COMPLETE has no dedicated 30m frame; openingGapPct is raw-prev-close based and corporate-action guarded.
- Top-five aggregate share depth cannot reconstruct per-level notional depth, queue shape or hidden liquidity.
- Current protected read endpoint is not an exhaustive coverage proof because of LIMIT 500 / recent-row truncation.
- PV-H006 remains DATA_QUALITY_BLOCKED pending authoritative live recorder coverage audit.
- Formal Core LOCKED.

## Price-Volume lane update — PV-168 through PV-183
- Current PV research cursor: PV-001 through PV-183 complete.
- Existing Fugle Quote contains substantially more research information than execution-shadow-v2 preserves; a future v3 could add useful fields with zero extra Quote REST calls.
- Provider avgPrice is consistent with cumulative trade-value/traded-share average in the official ordinary-equity example; scope/type provenance remains required.
- AtBid/AtAsk and transaction totals can support coarse interval pressure/activity when differenced under monotonic same-session guards, but never true OFI/replenishment.
- Current FORMAL_SIGNAL_OBSERVED recorder scope is batch-ambiguous: any notification causes rows for all results; nonmatching symbols may receive fallback SIGNAL. Such rows cannot be treated as symbol-specific signal events without independent match.
- Critical PV quality dependency: daily PV Shadow explicitly uses V7_D1_DAILY_HISTORY_SHARES, while tested history-freshness PR #100 is still Draft/Open/unmerged and no equivalent guard is on main. Daily PV quality and Formal cohort quality therefore require separate freshness verification.
- Intraday same-slot PV has a separate historical-15m baseline, but its research cohort can still be contaminated if Formal selection used stale daily history.
- execution-shadow-v3 is design-ready but intentionally deferred; core DATA_QA and history-quality stabilization come first.
- Formal Core remains LOCKED.

## Price-Volume lane update — PV-184 through PV-190
- Current PV research cursor: PV-001 through PV-190 complete.
- Primary PV evidence now requires both valid PV feature data and verified Formal cohort provenance; a clean intraday feature does not make a stale-history-selected sample clean.
- Existing prospective shadow-candidate cohorts are reused for control design; same-date stocks are not independent and date-level contrasts remain the primary inference unit.
- Quality discoveries quarantine via overlay instead of mutating immutable snapshots.
- Critical correction: PR #100's market-session-only history freshness is not production-ready as-is. Later Corporate Action research proves verified symbol-specific suspension days must be subtracted from expected market sessions; unknown suspension provenance fails closed.
- Current Execution Alpha BUY-trigger statistics are sourced from the trade journal and are separate from the execution recorder's FORMAL_SIGNAL_OBSERVED scope defect.
- Current evidence priority: symbol-session provenance/history integrity, core PV DATA_QA, recorder coverage, then optional recorder v3 / institutional-origin capture.
- No production code, Formal rules, thresholds, ranking, capital, monitoring or push were changed in this research turn.

## Price-Volume lane update — PV-191 through PV-200
- Current PV theory cursor: PV-001 through PV-200 complete.
- PV Phase-II theory is now considered converged; future work shifts to PVE evidence/falsification rather than adding volume indicators.
- PV consumes the Corporate Action/Symbol-Session quality engine instead of duplicating it. Freshness means expected symbol sessions, not merely exchange sessions; verified suspension is subtracted and unknown provenance fails closed.
- One bad Formal history record can propagate through 3+3 pool ranking/quota, so pool-date selection integrity is distinct from row-level feature validity.
- Immutable snapshots are never rewritten when later quality defects are discovered; append-only quality annotations determine analysis eligibility.
- H001~H004 primary evidence is WAITING_CLEAN_COHORT_PROVENANCE even if intraday PV feature DATA_QA continues.
- Existing prospective research cohorts remain the correct comparator architecture, but controls cannot repair a corrupted selected treatment set.
- Historical OHLCV may support labeled retrospective mechanics, never be inserted as fabricated prospective Shadow controls.
- Outcome-blind DATA_QA receipt and selection-time quality provenance are prerequisites before alpha interpretation.
- PR #100 remains research-only and must not be promoted in its current market-session-only form; later Corporate Action evidence requires symbol-session provenance first.
- No Formal/Core/runtime code was changed by this PV learning sequence.


## Corporate Actions deep-learning update — CA-113/CA-114 bounded source semantics
- Corporate Actions was continued from the durable CA-113 cursor; no earlier CA work was restarted.
- New durable receipt `research/corporate_action_ca113_bounded_public_lane_receipt_v0_1.json` validates an official TPEx historical daily issued-share query across independent years plus a non-trading-day control.
- 5314 provides direct positive/counter evidence for symbol-session provenance: issued shares remain 14.7m before the verified 2025-03-20..03-28 suspension, checked suspension-boundary rows are absent, and the resume session 2025-03-31 carries 294m shares. Missing-on-suspension must not be treated as source failure.
- Public TPEx history is now a validated reconciliation lane, but immutable S38 bytes/hash and historical first-known/revision completeness remain separate stronger gates.
- New `research/corporate_action_2465_payment_certificate_resolution_v0_2.json` proves a distinct TWSE reporting clock: MI_QFIIS 2465 `發行股數` jumps 83,946,031 -> 93,946,031 on 2025-11-12, before payment certificates trade on 2025-11-17 and before MOEA registration on 2026-01-06.
- Therefore reporting-table `發行股數`, registered-issued common shares, listed common shares and combined tradable instrument supply must remain separate semantic objects even when values later converge numerically.
- Positive and falsification evidence point in the same direction: source-field name is insufficient; denominatorType + event stage + knownAt/effectiveFromSession + instrument scope are mandatory.
- Remaining Corporate Actions blocker is exact TWSE daily listed-share/payment-certificate representation around 2465 plus stronger bounded archive completeness. CA-115 remains gated.
- Formal Core remains LOCKED; no production code, strategy factor, threshold, ranking, capital, monitoring or push behavior changed.

## Price-Volume evidence update — PVE-001 through PVE-003
- PV theory remains frozen through PV-200; evidence phase has started.
- Actual Actions artifacts prove PV Shadow was successfully enabled on run 36144091642 after an earlier concurrency-safe failed attempt. Worker/Formal fingerprints were unchanged and formalIsolation=true.
- Post-enable read-only QA run 36144193465 is NOT a QA pass: it confirms PV enabled but direct D1 SELECT is blocked by HTTP 403. The workflow token is consistent with lacking D1 Read scope; no secret/token permissions were altered.
- There are zero completed post-enable market sessions as of 2026-09-26. 9/25 and 9/28 are official TWSE holidays; 9/26-27 are weekend. Earliest ordinary prospective PV market date is 9/29.
- Existing research Shadow archive has 62 rows on 9/21-9/22 only and runtime integrity=RESEARCH_DATA_GAP, expectedScanDays=3 vs archivedScanDays=2. 9/23 is the missing enforced archive date.
- 9/21-9/22 archive existence is not clean selection provenance because symbol-session quality receipts were not captured at selection time.
- 9/24 is quarantined from clean rolling-history/PV research because B-130 proved stale Formal history.
- Primary clean-cohort dates for H001-H004 remain zero; no H001/H002 outcome comparison was started.
- Execution recorder exact-date completeness and signal-event mapping remain blocked, so H006 signal-microstructure inference is not started.
- No Formal/runtime/token/secret/deploy behavior was changed.

## PVE methodology update — PVE-005 through PVE-012
- Important namespace correction: 62 rows from the existing live research readback are Candidate Shadow Archive rows (`trade_research_shadow_candidates`), not PV Shadow rows. PV Shadow at-rest row count is still UNKNOWN.
- Existing /api/scan/status can supply useful after-market PV bootstrap/daily write receipts after a post-enable scan even while direct D1 read remains blocked.
- Runtime write acknowledgement and later D1 at-rest fingerprint verification are separate evidence levels.
- PV evidence readiness is now layered rather than a single qaPass.
- A valid zero-Formal-plan day can have zero PV rows; expected opportunity denominator must be explicit.
- Prospective PV feature/data-quality collection should continue even while selection-cohort alpha interpretation remains gated.
- No Worker/runtime/API/secret/Formal change was made.

## Price-Volume evidence update — PVE-013 through PVE-028
- PV evidence lane now separates after-market runtime acknowledgements, intraday persistence observability, D1 at-rest proof, cohort provenance and outcome maturity.
- /api/scan/status can expose after-market PV bootstrap/daily runtime receipts because pvShadow is included in the final LAST_SCAN_KEY summary. The intraday recorder result is not persisted in LAST_MONITOR_KEY because PV runs afterward.
- 2026-09-29 is the first ordinary post-enable session but is not primary H001~H004 evidence: its plan lineage inherits the known-stale 9/24 selection and it is expected to be same-slot baseline cold-start before the first after-market bootstrap.
- 2026-09-30 is only the earliest possible baseline-ready intraday session if the 9/29 bootstrap succeeds; clean-cohort provenance remains a separate gate.
- v0.1 Guard-label integrity has known defects: reversed liquidity thresholds, liquidityException type mismatch, unverified upstream CA/gap/marketStructure plumbing, VI hardcoded false, and raw previousClose used for price-censor semantics.
- These are research-label/data-quality defects only; Formal A/B/ranking/BUY/capital/push remain unchanged.
- First evidence window prioritizes falsifying recorder/guard correctness, not estimating alpha.

## Price-Volume evidence update — PVE-001 through PVE-006
- PV theory remains complete through PV-200; evidence lane has begun.
- Runtime activation is now verified, not merely inferred from code: PV_SHADOW_ENABLED=true and V8.11.0 LOG_ONLY is deployed with Formal isolation preserved.
- A read-only QA rerun after the expected after-market time showed 2026-09-25 was a holiday and was correctly skipped with zero Fugle calls; no fake scan/PV data were created.
- Direct D1 row-level QA is currently blocked by Cloudflare token authorization (403), so duplicate/fingerprint/at-rest row checks are still unproven. Runtime/admin-level readback remains available.
- Baseline bootstrap only occurs after successful after-market Formal completion; activation happened during a holiday block, so 2026-09-30 is the first natural candidate date for clean same-slot intraday evidence after a 2026-09-29 bootstrap.
- Evidence state = DATA_QA_PARTIAL. No H001~H006 interpretation or Formal promotion.

## Price-Volume evidence update — PVE-029 through PVE-061
- Current PV evidence cursor: PVE-001 through PVE-061, with theory PV-001 through PV-200 complete.
- H001/H002 raw volume evidence is now explicitly separated from H003 range/response/Guard quality. Historical 09:00 trueRange and missing-slot range continuity have defects that need not invalidate exact-slot volume medians.
- Formal previous-5 volume ratio and PV slot RVOL normally share the same current 15m source, but the primary comparison requires common support and exact-bar provenance; early-slot coverage is a separate question.
- Snapshot fingerprinting has a known retry defect because volatile sourceFetchedAt is hashed as semantic content; outcome fingerprinting does not share the insertion-time issue. Mutation conflicts must be cause-classified.
- D1 valid_sessions means cached session objects, not all-slot validity; per-slot volume/cumulative/range counts define true feature readiness.
- PV acceptance is not an exact replay of Formal at threshold boundaries and contains an A lower-shadow rule drift; H003 remains more gated.
- stopFirst path order is unknowable from a bar that touches both stop and target; daily outcomes also need symbol-session-aware handling for suspensions.
- v0.1 observedAt/enteredAt are market bar identity times, not feature-known times. Existing sourceFetchedAt/barEnd fields allow a conservative point-in-time overlay without mutating snapshots.
- No production change was made; evidence-first/falsification-first governance remains active.

## Price-Volume evidence update — PVE-062 through PVE-075
- Current PV evidence cursor: PVE-001 through PVE-075; theory PV-001 through PV-200 complete.
- Daily outcome exact-date lookup fails closed on missing dates rather than jumping to later history; NEXT_SESSION and D1 are duplicate one-session numeric endpoints.
- rangeAtr is unavailable in current v0.1 outcomes. Same-bar stop/target ordering and symbol-session suspensions remain separately guarded.
- Persistence event continuity lacks explicit expected-gap versus recorder-gap provenance; top-level eventKey is not the canonical event unit for all hypotheses.
- Evidence milestones now distinguish raw rows, DATA_QA observations, hypothesis-clean events and clean market dates.
- H001 must report coverage/common support before predictive performance; H003/H004 retain higher evidence gates.
- A field-level salvage policy prevents one research-label defect from unnecessarily destroying clean raw volume evidence.
- No PV research finding in this sequence changes Formal Core.


## Pattern Maturity continuation — DL-003H through DL-003J (2026-09-26 Asia/Taipei)
- Pattern work continued from DL-003G without restarting earlier topics.
- Stale Draft PR #102 was closed without merge/deploy; refreshed Draft PR #103 now contains the isolated Pattern research prototype on a newer main baseline.
- PR #103 validated head `5847e294d1c5644d9ec1d34343400618b10973c9`: V8 Repair `36203275992` SUCCESS and V8 Regression `36203275970` SUCCESS.
- New observer gates are executable: structural episode de-dup, 100% expected-parent attempt accounting, explicit BLOCKED reasons, provenance-conflict rejection, replay/prefix correctness gate.
- New persistence design is durable in `research/PATTERN_OBSERVER_PERSISTENCE_V0_1.md`; shared-runtime persistence remains intentionally unwired.
- Major-zone lifecycle is now causal/prefix-invariant and does not hard-code a post-break acceptance count.
- External evidence synthesis changes the interpretation of resistance: repeated pre-break bounces can exhibit memory, while crossing salient barriers can accelerate; Taiwan 2025 historical-high evidence shows true breakouts can enter an underreaction/momentum regime. Therefore touch count can never be assigned one monotonic sign ex ante.
- Taiwan price-limit literature supports C4's constrained-price-discovery state. A limit-constrained breakout can be a real breakout while acceptance remains unresolved; next-session overnight/intraday resolution is separately observable. Older 7%/call-auction evidence is not directly representative of 2026 10% continuous trading.
- Live Fugle content audit materially resolves the raw OHLC research lane via `FCNT000002` for 8454/5314/2412, while falsifying naive field equivalence: provider `change/change_rate` are adjustment/reference-based on action dates and `refPrice` is not universally unit-comparable. Volume is lots.
- Pattern still consumes Corporate Actions `TECHNICAL_CONTINUITY`; it does not infer continuity from future prices or provider change fields.
- Runtime readiness matrix status: GO_ISOLATED_QA / NO_GO_RUNTIME. Remaining blockers are cross-lane semantic/runtime provenance, not detector mechanics.
- No Pattern alpha/outcome test, no historical Shadow fabrication, no Formal change, no R09.

### Exact next continuation point
1. Keep PR #103 Draft; future engineering must reconcile/port against then-current main before any merge proposal.
2. Continue offline Pattern/source falsification while Corporate Actions/runtime semantic gates remain unresolved.
3. Require runtime-ready point-in-time RAW_EXECUTION + TECHNICAL_CONTINUITY + symbol-session + volume-semantic provenance before asking for Class-B observer wiring approval.
4. No prospective outcome inference until complete Pattern parent coverage exists.
5. When data gates clear, run only frozen PATTERN-RG1..RG4 and redundancy controls before adding pattern families/interactions.
6. Formal Core remains LOCKED.


## Pattern Maturity continuation — DL-003K
- New 2026 Taiwan market-microstructure evidence tightens Pattern portability: the 2020 continuous-trading reform improved liquidity/efficiency in modern evidence while separate evidence reports stronger retail behavioral biases after the reform.
- Conclusion: do not assume improved market efficiency eliminates reference-point/Pattern behavior; do not assume retail behavior automatically creates alpha.
- Primary Pattern evidence must be post-2020; older 7%/batch-auction evidence is mechanism/stress evidence only.
- Keep existing PATTERN-RG1..RG4 only; marketStructureRegime is a control/stratifier, not a new factor zoo branch.
- Formal Core unchanged.

## Price-Volume evidence update — PVE-062 through PVE-066
- Current PV evidence cursor: PVE-001 through PVE-066.
- Daily realized return/MFE/MAE can be salvaged only with symbol-session and corporate-action comparability; missing expected market-date bars are censoring until provenance explains them.
- Persistence events can currently bridge unobserved gaps, so pvPersistenceState is not a clean event-continuity variable without adjacency validation.
- Top-level eventKey conflates Acceptance and Participation event families; nested event keys must be used separately.
- v0.1 raw volume evidence remains partially salvageable despite Guard/response/Acceptance defects; H001/H002 have a lower evidence gate than H003/H004.
- 9/29 remains recorder/data QA only; 9/30 is merely the earliest possible field-ready date, not automatic clean evidence.
- No runtime/Formal modification made.

## Price-Volume evidence update — PVE-067 through PVE-091
- Current PV evidence cursor: PVE-001 through PVE-091.
- Clean H001/H002 row contracts, nested sample structure, sample-accounting funnel and first-report shape are now frozen before outcomes.
- Daily outcome table has important semantic duplication/censoring: NEXT_SESSION=D1 numerically in v0.1; AFTER_MARKET and INTRADAY anchors are different cohorts; outcomeComplete may mean censored rather than valid numeric outcome.
- Baseline cache provenance/freshness is now a first-class quality axis. validSessions>=20 does not prove recency or per-slot readiness, and exact denominator vintage is not frozen in old snapshots.
- New code-proven defect: after-market bootstrap fetches new selected symbols only through selectionDate-1. If the symbol was not already monitored on selection day, next-day baseline omits the immediately prior session. Re-entering symbols can also skip refresh solely because old cache count>=20.
- Existing baselineAsOfDate provides a partial v0.1 quarantine path; 9/30 readiness must be row-specific.
- No Formal/runtime change made.

## Price-Volume evidence update — PVE-092 through PVE-100
- Current PV evidence cursor is PVE-001 through PVE-100; theory remains PV-001 through PV-200.
- Existing admin endpoints can classify old monitored vs new after-market plan overlap, enabling baseline-lineage QA without D1.
- Baseline freshness is row-specific and plan-lineage dependent. Newly selected T-day symbols can omit T from the T+1 baseline because after-market historical bootstrap ends at T-1; re-entering symbols can skip refresh solely on old validSessions>=20.
- Non-skipped bootstrap lastMarketDate can expose the selection-day gap; skipped receipts cannot prove freshness.
- First live-session QA has been fully preregistered before market outcomes.
- Evidence Phase I is converged; next learning should consume actual 9/29/9/30 runtime receipts rather than invent more factors or tune rules.
- No Formal/runtime change made.


## Pattern Maturity continuation — DL-003L through DL-003T (long-cycle)
- Pattern research completed a deliberately extended cycle rather than stopping after a single finding.
- Named chart/candlestick labels are now formally governed as explainability metadata, not directional priors. Modern machine-chart evidence plus formal-definition ambiguity directly falsifies the assumption that textbook names carry a trustworthy one-sign return expectation.
- Draft PR #103 expanded only isolated Class-A research code: two-day candlestick relational encoding, overnight/intraday decomposition, confirmed-boundary latent geometry, cup/bowl anchor geometry, impulse/consolidation geometry, continuous resistance-test progression and cross-family shared-anchor overlap diagnostics.
- Latest validated research head: `2ba148d5a0aaaca6173b7ba4d1f8a9f24754e6b4`; V8 Repair `36205822887` SUCCESS; V8 Regression `36205822864` SUCCESS.
- New durable contracts on main: `research/PATTERN_NAMED_LABEL_GOVERNANCE_V0_1.md` and `research/PATTERN_LATENT_GEOMETRY_V0_1.md`. Runtime readiness matrix was also updated to distinguish research OPEN availability from the current Formal history cache, which still discards OPEN.
- Taiwan-specific falsification deepened: Bull-Flag evidence conflicts with broader Taiwan data-snooping/cost results; round-number order clustering is a real TWSE resistance confound; daily close location is context-dependent; daily candles must split overnight from intraday path.
- Pattern maturity is positioned, if ever validated, as Selection/WATCH information first. It does not bypass current 15m execution, RR, maxChase, liquidity, capital or 3+3+3 architecture.
- PR #103 remains Draft / unmerged / un-deployed and is already materially behind fast-moving main. Green detector CI is not merge readiness.
- No forward Pattern outcomes inspected; no historical Shadow fabrication; Pattern alpha remains UNKNOWN; Formal Core LOCKED.

### Exact next continuation point
1. Freeze latent geometry v0.1 and stop catalog expansion.
2. Continue outcome-blind source/semantic/adversarial real-data QA while Corporate Actions/runtime semantic gates remain unresolved.
3. Require runtime-ready PIT RAW_EXECUTION + TECHNICAL_CONTINUITY + symbol-session + volume semantics before any Class-B Pattern observer proposal.
4. Keep round-number proximity, close location, PV/volume, volatility and overheat as controls/confounds, not new Pattern scores.
5. Prospective Pattern outcome inference waits for COMPLETE parent coverage and run receipts.
6. When clean prospective evidence exists, run only PATTERN-RG1..RG4 plus frozen redundancy/date-cluster/holdout/cost gates.
7. No R09 and no Formal change without owner approval.


## Cross-lane update — Pattern source falsification + Execution Alpha coverage (2026-09-26 Asia/Taipei)
- Pattern real-source QA found FCNT000002 can emit flat zero-amount pseudo-bars on verified suspension dates and can report zero lots with positive traded amount on sub-lot days. Symbol-session membership and volume precision are now explicit research gates; latest Pattern head `69aace54c8d7d7b5ea2f7609495e5dea5eb616c2` passed Repair/Regression.
- A modern 5314 consecutive-limit-up witness confirms breakout acceptance may remain censored for multiple sessions; resolution waits for a later eligible unconstrained symbol-session.
- Execution Alpha canonical work resumed after Supply-Chain source closure. Draft PR #104 implements Class-A coverage-aware accounting from a fresh main branch; latest head `c9e23b01907dbeca7a130236816d56ac8db8764b` passed Repair/Regression.
- Execution evidence now explicitly separates participation, conditional BUY entry improvement, BUY path, complete NO-BUY opportunity cost and idle capital. Missing rows remain UNKNOWN; no composite score is authorized.
- 2026-09-24 BUY/NO-BUY remains UNKNOWN. Exact-date recorder completeness still requires separate Class-B runtime approval before implementation.
- No Production/Formal change; no R09.

### Exact next continuation point
1. Execution Alpha is the active canonical priority. Keep recorder exact-date Class-B proposal frozen until owner approval; do not reconstruct 9/24.
2. Continue outcome-independent Execution Alpha benchmark/cost/opportunity-cost semantics and synthetic falsification only until prospective complete-coverage dates exist.
3. When complete coverage exists, report the five Execution components separately by independent scan date and frozen A/B/pool/regime/liquidity strata; no composite optimization first.
4. Pattern latent geometry stays frozen; only source/data-validity falsification continues until runtime semantic gates clear.
5. Formal Core remains LOCKED.


## Execution Alpha continuation — EA-012 through EA-017 (2026-09-26 Asia/Taipei)
- Execution Alpha benchmark semantics now distinguish decision reference from executable price and regular-lot from odd-lot/mixed-lot mechanisms.
- Current V8.8.1 recorder uses default regular-lot Fugle quote; official Fugle supports `type=oddlot`, but that path is not currently captured. Therefore odd-lot/mixed-lot execution benchmarking is DATA_GATED rather than approximated from regular-lot quotes.
- Current Taiwan odd-lot mechanism is separate: 1–999 shares, first 09:10 match, 5-second call auctions since 2024-12-02. Older 3-minute Taiwan odd-lot evidence supports non-equivalent price/liquidity paths but not current effect magnitudes.
- FIRST execution denominator is frozen `firstShares`; ADD/REDUCE/RE-ADD are separate action denominators. Mixed quantities such as 1273 require 1000 regular + 273 odd-lot research legs.
- Formal signal market price is not actual fill evidence. Implementation shortfall retains unfilled opportunity cost and requires explicit ACTUAL/MODELED fill quality.
- Draft PR #104 latest validated head `5371e62dae80164bd0fdc5c8c10b8c0c2ce54a4e`; Repair `36211167568` SUCCESS; Regression `36211167625` SUCCESS. Unmerged/un-deployed and already behind main.
- Execution Alpha now has dual completeness gates: event/date completeness + execution-mechanism completeness. 9/24 remains UNKNOWN.
- No Production/Formal change; no R09.

### Exact next continuation point
1. Keep recorder exact-date and odd-lot runtime capture as separate Class-B gaps; do not implement/promote without owner approval.
2. Continue Class-A/outcome-independent Execution Alpha semantics: partial fills, cancel/replace, mixed-lot aggregation, cost/slippage and idle-capital opportunity-cost falsification.
3. Never benchmark odd-lot/mixed-lot plans with regular-lot quotes alone.
4. Prospective directional inference waits for complete event/date AND mechanism coverage.
5. First evidence report keeps participation, conditional entry improvement, BUY path, NO-BUY opportunity cost and idle capital separate, stratified by independent date/A-B/pool/regime/liquidity/lot mechanism.
6. No composite Execution Alpha score and no Formal 15m BUY change without later mature evidence + owner approval.


## Execution Alpha continuation — EA-018 through EA-024 (2026-09-26 Asia/Taipei)
- Continued active Execution Alpha lane outcome-independently: partial fills, cancel/replace, mixed-lot aggregation, explicit costs/slippage and idle-capital opportunity cost. No 9/24 reconstruction and no Formal tuning.
- TWSE current rules confirm ordinary stocks use 1,000-share regular lots; sub-1,000 shares are odd lots, with intraday odd-lot first match 09:10 and 5-second call auctions. Mixed quantities therefore require mechanism-specific legs rather than one regular-lot benchmark.
- TWSE current guidance confirms broker commissions are broker-specific; research must distinguish ACTUAL_FEE from MODELED_FEE. Seller tax and any day-trading treatment must be applied by actual transaction semantics, not assumed globally.
- 2026 passive-execution research supports an explicit trade-off among fill probability, adverse selection, impact and non-execution opportunity cost; external coefficients are not portable to Taiwan/Formal rules.
- Frozen semantics: preserve parent intendedQty/decisionTimestamp/decisionPrice/side/plan identity; child fillTimestamp/fillQty/fillPrice/mechanism/evidence-quality; keep filledQty and unfilledQty separate; never renormalize evaluation onto completed shares only.
- Cancel/replace attempts remain one parent execution chain and one clustered observation; replacements cannot inflate sample size. Price improvement and delay/non-execution opportunity cost are separate components.
- Mixed ordinary-stock quantity Q: regularQty=floor(Q/1000)*1000 and oddLotQty=Q-regularQty; aggregate only after mechanism-specific evaluation and by intended-share weights.
- Counterevidence: non-execution can be beneficial if price later falls; higher fill rate is not monotonically better because aggression can worsen spread/impact/adverse selection. Opportunity cost therefore needs frozen horizons and can have either sign.
- Bias controls: complete fills alone are an invalid denominator; timestamps are PIT anchors; child fills/replacements cluster under parent decision/date; no tactic/offset sweep; missing exact-date or odd-lot evidence stays UNKNOWN.
- Incremental value is measurement/provenance discipline, not a new stock-selection factor. Current exact-date recorder completeness and odd-lot capture remain separate Class-B gaps.
- Status: WORTH_SHADOW_RESEARCH / METHODOLOGY_FROZEN_FOR_SYNTHETIC_FALSIFICATION. No FORMAL_OPTIMIZATION_CANDIDATE; no runtime/Formal change.
- Engineering: Class A for documentation/synthetic fixtures/offline aggregation; Class B for new exact-date recorder fields, odd-lot capture or shared runtime persistence; Class C for any Formal 15m BUY/entry/sizing/action change.
- Exact next continuation: freeze implementation-shortfall sign conventions/equations; build synthetic adversarial fixtures for 0%, 25/75%, cancel favorable/adverse, regular-only, odd-lot-only and mixed chains; audit current recorder schema for parentDecisionId/intendedQty/child fills/cancel reason/ACTUAL-vs-MODELED provenance; keep missing fields UNKNOWN; prospective inference waits for complete event/date plus mechanism coverage; Formal Core remains LOCKED.


## Event & News D17 bounded official-disclosure source proof — 2026-09-28 Asia/Taipei
- Resumed the D17 source-only exact-next. TWSE/TPEx official daily material-disclosure feeds were captured twice with raw hashes and capture clocks; no outcomes were read.
- Both feeds preserve source publication time and full disclosure text under catalog-declared daily/open-data terms, but neither exposes native item/version/correction lineage.
- PIT conclusion: source publication time is descriptive; `capturedAt` is the conservative replay clock until API availability is authenticated. A daily catalog frequency cannot be relabeled an intraday SLA.
- Duplicate/novelty counterevidence: most observed rows shared 07:00:04 and referenced much older fact dates/multi-month notice periods. A daily disclosure row is not automatically a new event.
- Research-only observer/tests now deterministically normalize ROC clocks, map both schemas and fail revision/removal semantics closed to UNKNOWN.
- D11-08 and D17-01/02/09 remain L2; no maturity inflation, no outcome join, no R09, no Formal/runtime/deployment change.
- Exact next: fixed-cadence immutable multi-day capture over at least three trading sessions plus one after-hours interval; quantify capture-delay distributions, cross-day recurrence and change/removal classes; search for native correction identifiers; keep broad licensed general-news SOURCE_NEEDED.


## 2026-10-01 D03 — TI-453~459 ADX / moving-average offset redundancy

- Room/domain: 03｜技術指標與趨勢動能研究室 / D03.
- Governance: Class-A research-only. GitHub latest main and required governance/shared/router/tracker files re-read before work. No Formal selection/ranking/capital/monitoring/signal/push change.
- Source/PIT lane remains `ACCUMULATING_2_OF_3` prospective completed Taiwan sessions. No same-day duplicate was promoted into a third independent session.
- Evidence:
  - exact SMA identity `ΔSMA_n=(C_t-C_(t-n))/n` proves current deduction-price state, one-step SMA slope sign and same-horizon retN sign are directionally redundant;
  - EMA exact identity `ΔEMA=alpha*(C_t-EMA_(t-1))` rejects SMA-style single deduction-price semantics for EMA;
  - deterministic ADX14 witnesses: smooth up = 100, smooth down = 100, choppy same-net-return up ≈16.7353, flat oscillation ≈11.1728;
  - deterministic warm-up witness: full-history 16.076280, 65-bar 16.905634, 150-bar 16.076396.
- Counterevidence/failure conditions:
  - ADX has no directional authority by itself;
  - ADX and Impulse MACD are different transforms but share OHLC trend/range information, so independence is not assumed;
  - a 65-bar cache readiness finding for KD/RSI/MACD cannot be generalized to ADX14;
  - synthetic mechanism evidence does not establish Taiwan alpha, optimal 20/25 thresholds or OOS value.
- Redundancy/bias controls:
  - do not count SMA slope + deduction state + retN separately;
  - do not count EMA16/64 + Impulse + ADX as three independent votes;
  - future ADX inference must residualize direct trend, ATR/regime, trend persistence, structure and Impulse, use equal-date clustering, preserve blocked/UNKNOWN parents, and avoid threshold sweeps.
- Durable artifacts:
  - `research/TECHNICAL_INDICATOR_ADX_OFFSET_REDUNDANCY_V0_1.md`;
  - `research/test_technical_indicator_adx_offset_redundancy_v0_1.mjs`;
  - `TECHNICAL_INDICATOR_RESEARCH.md`;
  - `TECHNICAL_INDICATOR_CHECKPOINT.md`.
- Maturity: D03-09 ADX L1/20 -> L2/40; D03 aggregate 44.6% -> 46.2%. This is a mechanism/falsification promotion only.
- Candidate handoff: `FORMAL_OPTIMIZATION_CANDIDATE = NONE`. Formal Core remains LOCKED.
- Exact next continuation: wait for the next completed Taiwan session to supply the preregistered third source/version observation. If that gate passes governance, execute TI-005 KD-vs-RSI then TI-006 MACD-vs-direct-trend. Before any ADX efficacy test, freeze a long-enough warm-up/formulaVersion and +DI/-DI/DX/ADX continuity contract; ADX then tests residual value only, with no additive vote or threshold tuning.


## 2026-10-02 D03 — TI-460~473 ROC exact redundancy / EMA64 state-lineage

- Room/domain: 03｜技術指標與趨勢動能研究室 / D03.
- Governance: Class-A research-only; no Formal selection/ranking/capital/monitoring/signal/push change.
- Source/PIT:
  - official TWSE and TPEx 2026-10-02 completed-session content is source-visible;
  - current chat fetch transport exposes extracted/normalized content, not the frozen observer's origin raw bytes;
  - therefore no backfilled raw receipt is fabricated and `PROSPECTIVE_COMPLETED_SESSION_COVERAGE` remains 2/3.
- ROC findings:
  - standard percent ROC = exactly `100 * retN`;
  - common Momentum index = exactly `ROC+100`;
  - same-horizon log return is a one-to-one monotonic transform and preserves ordering;
  - raw price difference is nominal-price-scale confounded;
  - smoothed/delta ROC remains same-family and must be residualized.
- EMA16/64 findings:
  - EMA16 mean age 7.5 bars, half-life ≈5.538, 10%-residual horizon ≈18.397;
  - EMA64 mean age 31.5 bars, half-life ≈22.179, 10%-residual horizon ≈73.677;
  - synthetic local-reseed witness rejects assuming a 65-bar SMA-seeded EMA64 equals canonical long-history state;
  - System 2 EMA evidence therefore requires state-lineage/replay semantics;
  - EMA16/64 + Impulse remains partial/shared price-family evidence, not independent vote counting.
- Maturity:
  - D03-11 ROC L1/20 -> L2/40;
  - D03 aggregate 46.2% -> 47.7%;
  - D03-01 remains L3/60 and D03-13 remains L2/40; no theory-only inflation.
- Durable artifacts:
  - `research/TECHNICAL_INDICATOR_ROC_REDUNDANCY_V0_1.md`;
  - `research/test_technical_indicator_roc_redundancy_v0_1.mjs`;
  - `research/TECHNICAL_INDICATOR_EMA16_64_HORIZON_WARMUP_V0_1.md`;
  - `research/test_technical_indicator_ema16_64_horizon_warmup_v0_1.mjs`;
  - updated `TECHNICAL_INDICATOR_RESEARCH.md`, `TECHNICAL_INDICATOR_CHECKPOINT.md`, tracker/router/shared map.
- Candidate handoff: `FORMAL_OPTIMIZATION_CANDIDATE = NONE`; Formal Core remains LOCKED.
- Exact next continuation:
  1. close raw-byte third-session gate only through frozen observer or receipt-equivalent authorized transport;
  2. do not backfill 2026-10-02 extracted content;
  3. before System 2 resonance outcome testing, prove EMA64 canonical replay/state-lineage equivalence and retain EMA16/64 + Impulse as within-family evidence;
  4. after raw receipt gate passes, TI-005 KD-vs-RSI remains first efficacy inference, TI-006 MACD-vs-direct-trend second.


## 2026-10-03 D03 — TI-474~481 persistence PIT / tick-confound audit

- Room/domain: 03｜技術指標與趨勢動能研究室 / D03.
- Curriculum reconciliation: D03-11 ROC is already CURRICULUM_RETIRED / EXACT_REDUNDANCY and its alias/anti-double-count responsibility is owned by D03-02. Current D03 denominator = 12 modules.
- Exact current own-path persistence formula recovered:
  35% positiveDayRatio20 + 25% positive ret5/10/20/60 fraction + 20% drawdown quality + 20% MA20/MA60 quality.
- Deterministic counterexample:
  same ret5/10/20/60 endpoints, same positive horizon states, same MA states and no last-20 drawdown can still produce persistence 100 vs 84.25 due only to daily sign frequency.
- Taiwan-specific falsification:
  zero-return sessions reduce positiveDayRatio20; current TWSE tiered tick grid can mechanically generate different zero-return frequency for the same latent percentage trend. Synthetic +0.08%/session paths produced persistence 93 to 72 across price tiers. This is mechanism evidence, not a real-stock effect-size estimate.
- Score geometry:
  +1.75 per additional positive day; 6.25 per ret-horizon sign state; 10 per MA state; -1 per 1% additional drawdown until -20% floor.
- Construct firewall:
  current persistenceScoreResearch = own-path trend consistency;
  Chen-Hsieh-Lee momentum persistency = consecutive winner/loser rank membership duration;
  do not merge or transfer literature effect sizes.
- PIT feasibility:
  own-path score requires at most 61 continuity-valid closes; existing real Taiwan D03 source audit has demonstrated 82 daily bars on 2330/5314/2006/4977;
  future rows still require official-session, raw-history, TECHNICAL_CONTINUITY/corporate-action, constrained-session, formula and immutable parent provenance;
  cross-sectional ret60 rank retention is prospective-feasible but historical backfill remains forbidden.
- Maturity:
  D03-03 L2/40 -> L3/60;
  active 12-module D03 48.3% -> 50.0%.
- Raw-byte prospective source/version gate remains 2/3; Saturday 2026-10-03 does not add a Taiwan completed trading session.
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`; Formal Core LOCKED.
- Exact next: freeze component-level research-only persistence snapshot semantics, then continue D03-12 repaint-safe divergence PIT feasibility. TI-005/TI-006 efficacy stays blocked until the raw-receipt gate genuinely closes.


## 2026-10-03 D03 — TI-482~490 repaint-safe divergence PIT feasibility

- D03-12 primary divergence contract now separates pivotAt from confirmedAt/firstObservableAt.
- Synthetic timeline: L2 pivot D20 but confirmation D23; D22 has no legal divergence, D23 is first observable. A +4.2105% pivot-to-confirmation move in the witness is confirmation-lag cost, not post-signal alpha.
- Primary pairing is two most recent consecutive confirmed same-type/same-scale price pivots; no skipped-pivot, strongest-pair or outcome-selected matching.
- Historical episode identity is immutable. Later pivots generate new pairs but cannot rewrite old first-observed divergence state.
- Indicator value at pivotAt requires frozen formulaVersion/stateLineageId and continuity/source provenance. Later corrections create later observations, not backfilled prior truth.
- Divergence is Pattern × Indicator interaction evidence and cannot double-count Pattern geometry or RSI/KD/MACD aliases.
- Machine-readable contract: research/d03_repaint_safe_divergence_contract_v0_1.json.
- Maturity: D03-12 L2/40 -> L3/60; active 12-module D03 50.0% -> 51.7%.
- Raw-byte prospective source gate remains 2/3 over the weekend; outcomes stay NO_GO.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE; Formal Core LOCKED.
- Exact next: D03-13 multi-timeframe PIT feasibility, with weekly/daily/15m aggregation-boundary and partial-bar clocks; TI-005/TI-006 efficacy still waits for raw source gate completion.


## 2026-10-03 Room 06 — D08-03 dual-market historical valuation replay

- Room/domain: 06｜基本面與估值研究室 / D08-03.
- Governance: Class-A research-only; latest main/router/tracker reread; Formal Core LOCKED; no outcome join.
- Evidence:
  - TWSE BWIBBU_d public historical machine schema verified and header-mapped parser frozen.
  - 2026-10-02 official examples prove PE unavailable while PB remains usable.
  - 9904 寶成 2026-08-12 -> 2026-08-13 official fiscal-report-period change (115/1 -> 115/2) coincides with PE 6.60 -> 5.06 and PB 0.47 -> 0.38, freezing denominator-transition context.
  - TPEx public history exists and current OpenAPI schema is verified; public historical machine transport remains unverified.
  - Official TPEx EDIS S17 deterministic machine format exists as a licensed lane; no subscription/access was authorized.
  - 1294 漢田生技 official OTC listing date 2024-09-26 provides a limited-history negative control.
- Counterevidence/bias:
  - source-family existence != automated historical replay completeness;
  - percentile jumps can be denominator-vintage changes rather than repricing;
  - missing PE must not become numeric cheapness;
  - TWSE-only evidence cannot generalize to TPEx/full Taiwan;
  - no hidden/legacy endpoint schema may be frozen from third-party code.
- Research engineering:
  - machine contracts/preregistration added on main;
  - PR #364 research-only parser/guard merged at 6943edc24ca4c1d78c525b33b730d911f245e4fa;
  - exact-head System2 Research CI 37107054148 PASS, V8 Repair CI 37107054216 PASS, V8 Regression 37107054202 PASS;
  - System2 log explicitly executed D08 historical valuation replay guard with zero runtime/Formal impact.
- Maturity: D08-03 remains L3/60. No L4 promotion because no prospective/OOS outcome evidence.
- Candidate handoff: FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Exact next: bounded source-only TWSE history capture/readback -> preregistered percentiles without returns -> coverage/denominator-transition QA -> then TWSE-only Shadow outcome join. TPEx remains excluded until historical machine transport or authorized licensed source is verified.


## 2026-10-03 D03 — TI-491~525 multi-timeframe / continuation / pullback

- D03-13 Multi-timeframe:
  - three clocks frozen: barStartAt, barEndAt, featureKnownAt;
  - Weekly completion is official-calendar/symbol-session aware, not five-bar counting;
  - Daily LIVE→PROVISIONAL, FINAL+independent close→CONFIRMED;
  - M15 source path is PIT-feasible but bounded to 17/18 regular slots, through 13:15; 13:15–13:30 closing interval is not observed by current zero-extra-call path;
  - timeframe alignment is hierarchical context, never automatic vote count;
  - D03-13 L2/40 -> L3/60.
- D03-04 Momentum Continuation:
  - current momentum level owned by D03-02; persistence by D03-03;
  - continuation is a post-decision outcome relation;
  - synthetic falsifier: ret20(t)=+20%, forward D5=-4.1667%, rolling ret20(t+5)=+9.5238%, proving rolling sign retention can falsely label continuation;
  - primary future outcomes are non-overlapping D5/D10/D20 return/MFE/MAE with exact symbol-session/corporate-action lineage;
  - D03-04 L2/40 -> L3/60.
- D03-05 Pullback/Reversal:
  - generic reversal factor remains rejected/redundant with current A/PULLBACK + 15m confirmation;
  - residual question is pullback-origin attribution;
  - liquidity-pressure origin cannot be inferred from OHLCV/candles and remains D05 pressure/replenishment-data-gated;
  - D03-05 remains L2/40.
- Active D03 = 12 modules; aggregate = 55.0%.
- Raw-byte prospective source/version gate remains 2/3 over the weekend; outcome inference remains NO_GO.
- Formal Core LOCKED; FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Exact continuation: do not inflate D03-05; after raw gate completion preserve TI-005 KD-vs-RSI then TI-006 MACD-vs-direct-trend. Outcome-blind work may next attack D03-09 ADX / D03-10 Bollinger PIT-feasibility blockers.


## 2026-10-03 D03 — TI-526~533 ADX/Bollinger blocker audit

- D03-09 ADX: frozen formula and deeper history capability do not satisfy L3. Recursive ADX state requires canonical TECHNICAL_CONTINUITY, stateLineageId and replay-certified immutable parent provenance. L2/40 remains.
- D03-10 Bollinger: finite-window certification is structurally simpler (exact clean 20 eligible sessions, no recursive seed), but current physical TECHNICAL_CONTINUITY / parent lineage remains blocked. L2/40 remains.
- Key firewall: numerical observability and history depth are not equivalent to PIT source readiness.
- D03 aggregate remains 55.0%; no theory-only promotion.
- Principal remaining D03 L2 modules: D03-05 pullback origin (D05 data-gated), D03-09 ADX (recursive continuity/replay-gated), D03-10 Bollinger (finite-window continuity/parent-gated).
- Formal Core LOCKED; FORMAL_OPTIMIZATION_CANDIDATE = NONE.


## 2026-10-03 Room 06 — D08-03 bounded TWSE history receipt

- Source-only historical replay moved from parser feasibility to real bounded TWSE evidence.
- Temporary PR #381 intentionally closed without merge after evidence capture.
- Final verification: System2 Research CI 37122478859 PASS; V8 Regression 37122478893 PASS.
- Anti-look-ahead failure retained: future month-end 2026-10-31 was rejected by TWSE; collector now caps at completed session 2026-10-02.
- Corporate-action failure retained: 3593 must bridge last old-share session 2025-12-10 to new-share resume 2025-12-22, not calendar-adjacent dates.
- 1102 long-history sample = 1,300 official valuation rows; all 252/756/1260 windows operational.
- Same current 1102 PE/PB receives materially different ranks across windows, so no return-driven best-window selection is allowed.
- 9904 fiscal denominator transition, 3593 unit-scale break, 7812 new-listing insufficiency and 1101 PE-missing/PB-known semantics were independently observed.
- Durable artifact: research/d08_twse_bounded_history_source_receipt_20261003_v0_1.json.
- Maturity remains D08-03 L3/60; no OOS/Shadow return evidence yet.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE; Formal Core LOCKED.
- Exact next: broader TWSE cohort/scan-date freeze -> immutable source-only percentile snapshots -> baseline/control freeze -> TWSE-only Shadow outcome join. TPEx stays out until its historical machine lane is verified.


## DL-D21-20261004 — Insider clock / controller de-dup / pledge risk
Run date: 2026-10-04 Asia/Taipei
Scope: D21-03 / D21-04
Status: RESEARCH_ONLY / D21-03_L2_PARTIAL_REPLAY / D21-04_L2_MECHANISM_DEFINED / FORMAL_CORE_UNCHANGED

### Question studied
Can Taiwan insider-transfer and pledge disclosures add governance/risk information without creating look-ahead, double-counting related entities, or converting personal-liquidity events into false directional trading signals?

### Evidence and provenance
1. Official Taiwan source contracts identify separate daily pre-transfer filings, untransferred-status reporting and monthly post-report holding changes. The legal reporting clocks are not interchangeable.
2. Hon Hai 2317, 2025-12-01 provides a concrete cluster-de-duplication case: two same-day transfer filings totaling 5,180 lots were made by nominee-held legal entities associated with the same ultimate major-shareholder network.
3. Relative-size interpretation changes by denominator: each filing entity intended to transfer 100% of its own reported holding, while the combined 5,180 lots were about 0.30% of the ultimate major shareholder's publicly reported total Hon Hai holding.
4. Secondary MOPS-derived monthly pages are consistent with full December completion and zero untransferred shares, but the original monthly MOPS first-known receipt was not captured in this run; exact known_at therefore remains UNKNOWN.
5. Taiwan pledge literature and official rules support multiple mechanisms: personal liquidity, margin-call pressure, controller agency/control retention, corporate-policy spillover and voting-right effects. Company Act Article 197-1 makes very high director pledging potentially relevant to exercisable voting rights.

### Supporting mechanism
- Controller-level de-duplication can prevent the system from mistaking several related legal entities for independent insider consensus.
- Multi-denominator normalization can distinguish a transfer that is large for a shell/nominee entity but small for the ultimate controller.
- Pledge setup/release may add governance-tail-risk context when combined with price drawdown, controller structure, insider transfers and financing/capital-allocation events.

### Counter-evidence / alternative explanations
- Insider sales can reflect liquidity, diversification, gift, trust, tax, estate or restructuring motives rather than negative private information.
- Taiwan transfer-announcement effects are heterogeneous by transfer type, firm size and price context.
- Cluster effects documented internationally may be inflated by overlapping observations or may not transfer directly to Taiwan.
- Pledging can be a benign liquidity tool; regulatory environment and ownership structure materially condition its consequences.
- Without loan-to-value, maintenance ratio and collateral contract terms, a margin-call price is not observable and must remain UNKNOWN.

### Bias / overfit / redundancy checks
- Do not use raw filing-row count as independent cluster count.
- De-duplicate to related group / ultimate controller before statistical inference.
- Use issuer-date or non-overlapping event clusters as independent units; repeated rows/programs do not increase independent sample count.
- Control event size, prior return, liquidity, 52-week position, transfer method, pledge state, controller wedge, accounting quality and nearby news/corporate actions.
- Keep D21-03 distinct from D06 ownership flow and D07 accounting quality; test incremental value rather than double-counting.
- Keep D21-04 distinct from D22 financing stress while preserving cross-domain dependency.
- UNKNOWN exact MOPS timestamps or loan terms remain UNKNOWN, never zero/negative.

### Candidate handoff status
- D21-03: FALSIFICATION_IN_PROGRESS. Historical replay is partial; exact original monthly MOPS known_at remains missing. Not eligible for Formal optimization.
- D21-04: FALSIFICATION_IN_PROGRESS. Mechanisms and falsification contract are defined at L2; historical pledge setup/release replay is still required.
- No FORMAL_OPTIMIZATION_CANDIDATE is created. Formal Core remains LOCKED.

### Exact next continuation point
Build a historical Taiwan D21-04 pledge replay with at least one pledge setup and one release event, preferably the same issuer/controller. Preserve original known_at, filer-level and controller-group pledge ratios, contemporaneous price path, related insider transfers, repurchase/financing context and Article 197-1 voting-right relevance. Never infer a margin-call threshold without contract terms. Separately preserve D21-03 original monthly MOPS receipt as a pending source dependency and add a second independent transfer-motive case before considering L3.


## 2026-10-04 D19 specialist return — asset pricing / factor investing
- Room: 12｜資產定價與因子研究室.
- D19-13 relative-value/pairs/cointegration/residual-mean-reversion, D19-15 benchmark construction, and D19-16 liquidity premium completed L2 mechanism + falsification review.
- All 15 active D19 modules are now L2 / 40%; D19-14 remains retired/merged into D19-13 and is not an active denominator item.
- Counterevidence preserved: pair relationships can structurally break; benchmark vintages can leak future membership; Taiwan Amihud-style liquidity pricing is measure-sensitive and can reflect volume/mispricing rather than pure illiquidity risk.
- Redundancy control: D19 findings must be neutralized against existing D03/D04/D05/D07/D08/D09 families before independent-alpha claims.
- PIT engineering audit: existing System2 cold loaders/PIT replay/universe registry are reusable, but the six D19 factor-layer receipts remain unimplemented in code.
- Recommended first executable smoke slice: D19-04 cross-sectional momentum + D19-07 low-volatility/low-beta, using existing PIT daily bars/universe membership.
- Exact next: implement research-only factor-layer receipt adapter with deterministic universe -> return -> factorInput -> neutralization -> cost -> replay receipt chain and fail-closed tests. No D19 L3 until an actual Taiwan frozen-date replay receipt passes deterministic rerun validation.
- Formal Core unchanged; no formal optimization candidate.


## 2026-10-04 D03 — TI-534~542 observable pullback/reversal PIT reconciliation

- Latest H07 owner contract supersedes the earlier overly strict D03-05 interpretation: D03-05 owns the observable price phenomenon; causal origin is optional cross-lane context.
- Generic reversal factor remains rejected/redundant.
- Daily parent reuses A/PULLBACK geometry without Formal change.
- M15 research chronology is stricter than Formal numeric availability: exact expected slot prefix is mandatory; missing slot => DATA_BLOCKED.
- Seed low/zone entry cannot be backdated into a signal. Confirmation requires a later completed higher-low + bullish turn-up bar; confirmedAt uses bar-end/source-known clocks.
- Failed zone break/down-volume are first-class states; prior observed history is immutable.
- Liquidity/event/behavioral/market cause remains UNKNOWN unless the relevant owner provides a valid receipt.
- Existing PV Shadow implementation + A lifecycle fixture establish replay substrate; local D03 deterministic v0.2 fixture PASS.
- D03-05 L2/40 -> L3/60; 12-module D03 55.0% -> 56.7%.
- D03-09 ADX and D03-10 Bollinger remain L2 because TECHNICAL_CONTINUITY is still not physically certified; System2 official final-result pages have revisionCoverageComplete=false.
- Raw source-version gate remains 2/3. Important correction: 3/3 will be necessary but not sufficient for TI-005/TI-006 outcome inference; full immutable parent/continuity/state/replay gates must still pass.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE; Formal Core LOCKED.


## 2026-10-04 D03 — TI-543~550 primary queue outcome-closed preregistration

- TI-005 KD-vs-RSI and TI-006 MACD-vs-direct-trend are now preregistered before any forward outcome access.
- Raw D03 source-version gate remains 2/3. No receipt-equivalent 2026-10-02 D03 third-session artifact exists; System2 10/02 diagnostic evidence uses a different schema/clock and itself reports source/history not ready and continuity coverage zero.
- Important correction: D03 3/3 is necessary, not sufficient. Full Technical observer readiness still requires immutable Level-B parent/capture generation, TECHNICAL_CONTINUITY, symbol-session/limit provenance, exact parent-child attempt reconciliation, stateConstructionMode and replay/prefix certification.
- TI-005 frozen ladder: K0 BASE -> K1 B2 range-position -> K2 RSI14 -> K3 BOTH -> K4 KD-smoothing residual diagnostic. No overbought/oversold threshold voting or period search.
- TI-006 frozen ladder: M0 direct trend -> M1 normalized DIF -> M2 transition/curvature -> M3 combined non-alias MACD. Zero-line/EMA alignment and crossover/Histogram-sign aliases are not separate features.
- Primary outcome family is D5 return/MFE/MAE; D10/D20 are registered secondary and cannot rescue failed D5.
- D16 method receipt is mandatory before outcome access: exact common support, scanDate dependence-aware inference, purged chronological holdout, untouched holdout, leave-one-date, concentration and non-overlap diagnostics.
- Inference floors: D5 mature >=60, prospective complete >=30, independent scan dates >=15, >=2 Regimes, purged train >=10 dates, holdout >=5 dates, plus coverage/zero-pick/redundancy/cost/overfit gates.
- D03 maturity stays 56.7%; preregistration does not inflate maturity.
- `TI_005/006 = PREREGISTERED_NOT_EXECUTABLE`; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`; Formal Core LOCKED.


## 2026-10-04 D03 — TI-551~554 D16 method handoff

- D03 feature/estimand identity for TI-005/TI-006 is frozen before outcomes; D16 owns the statistical method and may not redefine the indicator experiment after results.
- Dependence graph explicitly includes scanDate common shocks, repeated symbols/episodes, overlapping forward windows, overlapping feature histories and sector dependence. Stock-row count is not independent N.
- D16 must return a machine-readable method receipt before T5 outcome access, including chronological purge/holdout, dependence/small-cluster treatment, exact estimands, robustness diagnostics and multiple-testing handling.
- If current evidence cannot support valid inference, D16 must return METHOD_BLOCKED / POWER_INSUFFICIENT rather than relax the preregistration.
- D03 maturity stays 56.7%; outcomes CLOSED; raw D03 gate 2/3; FORMAL_OPTIMIZATION_CANDIDATE NONE.


## AOKD external sweep V0.2 — 2026-10-04

New discovery only: 37 topic triages / 31 requested families; Layer A35/B1/C1/D0. No new specialist-ready or confirmed true-gap candidate. AOKD-05 material filing-delta = scope-extension research, corpus/clock/owner triage pending. AOKD-06 B2B payment behavior = Taiwan historical PIT data blocked; inspected detail API is US-only. Existing AOKD01–04 states preserved; D07-33 exists but expected A01 specialist-return path not found at read; 00 reconcile without new COV.

Canonical report: `shared-knowledge/AOKD_EXTERNAL_SWEEP_20261004_V0_2.md`.
Full registry: `shared-knowledge/aokd_external_sweep_registry_20261004_v0_2.json`.
Exact 00 cursor: `shared-knowledge/AOKD_00_CONTINUATION_CHECKPOINT_20261004_V0_2.md`.
After A06, three meaningful follow-up rounds found no additional retained families; bounded sweep temporarily saturated, not universal literature completeness. Counterevidence, full owner scopes, data/clock/missingness/licensing limits and incremental-test gates are recorded. Mostly abstract/documentation-level evidence; no Taiwan alpha/OOS claim. Next: source receipts and existing-owner scope triage, not Coverage promotion.

Baseline read: 22 domains / 354 modules / 41.5% maturity at ca844efda3809050238986acb1a160e2d439a428. Maturity movement belongs to parallel rooms; this docs-only checkpoint does not change tracker, owner, modules, domains, Formal behavior or runtime. Formal Core LOCKED; FORMAL_OPTIMIZATION_CANDIDATE NONE. Research 07:20:54–07:40:28 Taipei; Git commit timestamps record checkpoint persistence.


## DL-D21-20261004-B — accelerated governance deepening
Run date: 2026-10-04 Asia/Taipei
Scope: D21-04 / D21-05 / D21-07 / D21-09 / D21-10
Status: RESEARCH_ONLY / MULTI_MODULE_MECHANISM_FROZEN / FORMAL_CORE_UNCHANGED

### Questions studied
1. Can pledge paths be reconstructed as state transitions rather than static ratios?
2. Can Taiwan related-party transactions be separated into efficient contracting versus tunneling/propping mechanisms?
3. Can executive incentives be linked to actual capital-allocation decisions without treating pay level as a governance score?
4. Can succession/key-person events be classified without assuming family or professional succession has one universal sign?
5. Can corrections, restatements and internal-control weaknesses be separated into PIT-safe event families without rewriting historical financial data?

### New evidence / durable progress

D21-04:
- New Product Insurance 2850 / Shin Kong Textile provides a partial pledge path: 2024-12-19 +8,000 pledged lots -> balance 28,000; 2025-01-23 -4,000 release -> 24,000; 2025-02-03 -5,000 release -> 19,000, against a 51,548-lot holding.
- The path shows pledge ratio changing from about 54.33% to 36.86%.
- Original MOPS receipt/first-known remains missing, so D21-04 stays L2.

D21-05:
- Taiwan peer-reviewed evidence supports both opportunistic and efficient RPT mechanisms.
- Related operating sales/processing and non-operating RPTs can have different implications for earnings informativeness.
- Public-company rules explicitly govern RPT controls and impose approval/disclosure requirements for material related-party asset transactions, loans and guarantees.
- D21-05 advances L0 -> L2 / 40%.

D21-07:
- Taiwan remuneration governance explicitly requires performance/remuneration structures to consider company performance, future risk and risk appetite.
- Taiwan empirical evidence links managerial compensation with R&D and operating efficiency, but reverse causality remains material.
- Repurchase evidence shows incentive design and managerial overconfidence can interact with capital-return decisions.
- D21-07 advances L0 -> L2 / 40%.

D21-09:
- Taiwan succession evidence is heterogeneous by competition, family/control participation, successor type, heir background and post-succession strategy.
- No universal family-successor or outside-manager sign is defensible.
- D21-09 advances L0 -> L2 / 40%, role CONTEXT_ONLY / GOVERNANCE_TAIL_RISK / CONFIDENCE.

D21-10:
- Taiwan regulation distinguishes correction from formal restatement by quantitative thresholds and separate disclosure clocks.
- Historical research must preserve original reported values and later restated values simultaneously; corrected values cannot be backfilled.
- Taiwan evidence associates internal-control weaknesses and restatements with weaker performance/negative market response, with severity, earnings direction, regulator initiation and remediation affecting interpretation.
- D21-10 advances L0 -> L2 / 40%.

### Counter-evidence / alternative mechanisms
- RPTs can be efficient internal supply-chain/capital-market arrangements.
- Compensation can reflect talent/growth opportunities rather than cause superior investment.
- Succession effects can be driven by pre-existing poor performance or strategy rather than successor identity.
- Restatements can reflect complexity/detection quality rather than fraud.
- Remediation changes the meaning of an internal-control weakness.
- Pledging can be benign personal liquidity; margin-call thresholds remain unknowable without loan terms.

### Redundancy / anti-inflation decision
D21-11 Tunneling / Minority Shareholder Risk was NOT advanced in this run despite obvious thematic overlap. It may be an outcome/composite layer of D21-01 control wedge + D21-04 pledging + D21-05 RPT rather than an independent feature family. Before maturity promotion, its unique incremental information and ownership boundary must be defined to prevent double counting.

### Candidate status
- No FORMAL_OPTIMIZATION_CANDIDATE.
- D21-04/05/07/09/10 remain research-only or context/tail-risk roles as specified.
- Formal Core remains LOCKED.

### Exact next continuation point
1. Recover authoritative MOPS pledge setup/release receipts for D21-04; if source remains blocked, do not promote.
2. Run two-family historical Taiwan RPT replay for D21-05 with relationship vintage and approval/disclosure clocks.
3. Run dual-vintage correction/restatement replay for D21-10, preserving original and corrected financial values.
4. Audit D21-11 for true incremental ownership versus D21-01/04/05 before any maturity increase.


## 2026-10-04 Room09 continuation — MC-148 / source-only NDC and SEP vintage audit



Status: RESEARCH_ONLY / LATER_OBSERVED_SOURCE_QA / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED.

- MC-142: Latest main at first read was 46ffc0e665cbcedf89fa84620de0a97bdff7a347. D13-17/18/19 already L2/40 with research/MC-113..141 and Router/Map synchronized; no reconciliation rewrite. Recomputed D12 40.0%, D13 41.1%, room 09 40.6% across 36 modules. Parallel-room maturity is not this run's contribution.
- MC-143: Official NDC method has X13, two-stage HP, mean absolute deviation standardization, equal-weight composition, amplitude adjustment and trend restoration. A final published index cannot be reduced by subtracting TAIEX raw price. Conditional pre-amplitude standardized identity is (7*Z_all-Z_TAIEX)/6, only if the same-vintage standardized inputs exist. An independently recalibrated six-component index is a new research object, not an official NDC index.
- MC-144: NDC search-service opens returned 403, Python urllib GET returned 403; bounded curl GET succeeded HTTP 200. Native 11508 attachment download completed 2026-10-03T23:59:34.344603Z, 860717 bytes, SHA256 c035dc5bbd3fe91ca80a620fd84828a54e8c49885a1b3aa51db5e42857772c83. Five sheets, 537 rows each including header inspected by read-only OOXML extraction. No entitlement or immutable native archive/readback proof; therefore no strict source attestation or historical first-known promotion. Raw files were temporary QA inputs, not a durable source archive.
- MC-145: Leading raw sheet omits TIER manufacturing-climate component, exposes nominal M1B/equipment imports, and has latest employee-net-accession ellipsis. Standardized vintage components, deflators, hidden estimated inputs and calibration/amplitude factors are not established. Thus numeric official ex-TAIEX reconstruction from this annex alone is UNKNOWN. Ellipsis is missingness, never 0 or BAD; published aggregate does not authenticate unavailable constituents.
- MC-146: Concrete revision witness: July release headline 104.63; August annex revised July 103.87791359650292 and August 104.40865987750504. Same-vintage MoM is positive ~0.51%, but cross-release splice is negative ~0.21%. This is revision contamination, not proof of August contraction. Months within a single revised history are not independent vintage evidence. July/August text each names 4/6 rising non-price components; this optional breadth object loses magnitudes and remains a distinct preregistered custom context.
- MC-147: Independently read Fed June 17 and September 16 2026 original accessible SEP pages. Release 14:00 EDT is next calendar date 02:00 Taipei. Compare calendar year+variable+statistic+unit+definition. Same 2026 medians changed GDP +0.1pp, unemployment -0.2pp, PCE +0.1pp, core PCE +0.1pp, policy +0.3pp. These are policy-projection revisions, not market surprises. 2029 is newly added; missing June horizon cannot become zero.
- MC-148: SEP GDP/PCE are Q4/Q4, unemployment Q4 average, policy year-end midpoint. Core-PCE longer-run is not collected. Aggregate median changes are not same-person revisions; anonymous distributions and horizon-specific participation matter. Unchanged long-run GDP median 2.0 does not imply unchanged distribution (central tendency June 1.8–2.0, September 2.0–2.2). September comparator row cross-checks June page but does not prove native capture at June release.

Positive mechanism: cycle components may describe slow demand breadth, SEP revisions may distinguish growth from discount-rate transmission. Counterevidence: revision/estimation and price circularity can create spurious timing; public macro news may already be absorbed in rates/USD/global and Taiwan prices. Taiwan incremental value remains UNPROVEN. Baselines: Taiwan price/sector -> macro component-only -> rates/USD/global -> candidate; no duplicate composite votes.

Validation requirements remain PIT/source attestation, first-known vintage, independent release/event dates, frozen horizons, OOS/walk-forward and overlapping-window purge, prospective Shadow, leave-one-event-out/regime tests, transaction costs, selection/look-ahead/overfit and multiple-testing accounting. Outcomes not inspected. No test-PASS or alpha/OOS claim from OOXML inspection or arithmetic.

Artifacts:
- research/d13_18_ndc_vintage_reconstruction_audit_20261004_v0_1.json
- research/d13_19_sep_projection_vintage_audit_20261004_v0_1.json

Maturity unchanged: D13-18/19 L2 40%; D12 40.0%; D13 41.1%; room09 40.6%. Strict clean prospective dates added: 0. FORMAL_OPTIMIZATION_CANDIDATE NONE. Formal Core LOCKED; no runtime, score, ranking, signal, portfolio or push changes.

Exact next continuation: obtain/readback authorized NDC native vintage archives and standardized/estimated component transforms; if unavailable, retain numeric official ex-TAIEX UNKNOWN and separately preregister six-component macro breadth. Then CBO original projection vintage/assumptions, H.4.1 decomposition, CBC BOP/policy lineage and TWSE 18:10 version receipts. Do not repeat MC-142..148 or pretend these later observations were release-time captures.


## 2026-10-04 Room09 — MC-149..152 CBO projection assumption-clock audit

Status: RESEARCH_ONLY / LATER_OBSERVED_OFFICIAL_WEB_QA / OUTCOMES_CLOSED.
Observed 2026-10-04 approximately 08:25–08:28 Asia/Taipei. Recovery base main: 589534a945cda7b41593e57042be79337d02e429. MC-142..148 and DR-001..066 were read, not repeated.

- MC-149: Official report landing page https://www.cbo.gov/publication/61882 states publication February 11, 2026; https://www.cbo.gov/publication/62105 is its detailed HTML report, not a second independent projection vintage. Same report title/content and landing-page links must be resolved before counting independent releases. Search-engine publication-age metadata is not release evidence.
- MC-150: Report notes expose distinct assumptions: trade policy cutoff 2025-11-20; economic developments/laws cutoff 2025-12-03; demographic laws/policies cutoff 2025-09-30; budget legislation cutoff 2026-01-14. Publication is not universal information cutoff. Record these fields separately; preserve UNKNOWN intraday release/capture clocks. Budget years are fiscal years; economic years are calendar years. Do not join equal year labels without basis reconciliation.
- MC-151: Official data catalog https://www.cbo.gov/data/budget-economic-data lists economic projection vintages February 2026, September 2025, January 2025. A February-vs-January comparison is not the latest-adjacent revision if September exists; however partial September coverage may differ and must be inspected, not presumed identical. Potential GDP and underlying inputs are included in projection supplements from January 2020. Native workbook rows, headers, hashes and archive readback are NOT yet verified. Three link clicks returned tool argument-resolution errors; direct catalog and report landing-page reads succeeded. This is route QA, not missing-data proof or completed workbook comparison.
- MC-152: Preregister source-only alignment: variable + calendar/fiscal basis + year/horizon + annual-average/Q4-Q4/unit + actual/estimate/projection + assumption cutoffs + vintage identity. Common-horizon deltas only; new years remain NOT_COMPARABLE, never zero. Separate labor supply, capital and productivity assumptions; no AI-capex-to-realized-TFP shortcut. No surprise without independently archived pre-release expectations. No structural forecast-to-next-day Taiwan alpha claim.

Mechanism: changed structural growth assumptions can distinguish demand/productivity and discount-rate channels. Counterevidence: unchanged headline forecasts may hide offsetting assumptions; forecasts are conditional model outputs and may be stale by publication; public information may already be priced. Taiwan exposure mapping belongs to D07/D10; strategy effectiveness conditional on frozen macro state belongs to D18. Require Taiwan price/sector, rates/USD/global component baselines, costs, PIT, independent events, OOS, leave-one-event-out and multiple-testing controls before promotion. No outcomes inspected.

D12 40.0%; D13 41.1%; room09 40.6%, unchanged. D13-19 remains L2/40%. Strict clean prospective dates added=0. FORMAL_OPTIMIZATION_CANDIDATE=NONE. Formal Core LOCKED. No runtime/selection/signal/push/capital changes. Global tracker observed 42.4% / 354 modules; other-room progress is not credited to this audit.

Exact next: resolve/download permitted February 2026, September 2025 and January 2025 CBO original economic projection supplements via the official report/catalog, preserve raw identity, inspect common-variable/horizon coverage and assumptions outcome-blind. Do not repeat MC-149..152. Then H.4.1 decomposition and CBC BOP/policy/TWSE version receipts. NDC official numeric ex-TAIEX remains UNKNOWN pending same-vintage standardized/estimated inputs and authorized archive/readback. Raw attestation and true prospective dates remain required for L3.


## 2026-10-04 Room14 D21-05 source-clock replay

Status: RESEARCH_ONLY / D21-05_L2_UNCHANGED / FINANCING_RPT_REPLAY_PARTIAL / FORMAL_CORE_LOCKED

- Recovered from latest D21 checkpoint rather than restarting.
- Taiwan official disclosure architecture confirms separate periodic, monthly and event-driven clocks for related-party evidence.
- Financing-family replay: 2760 巨宇翔, 2026-10-01 public material information. Subsidiary Ding Tea Corporation guaranteed parent financing; renewal board approval was 2026-09-29. Original guarantee balance NTD70m, new guarantee NTD70m, post-event balance NTD140m, actual drawdown NTD56m.
- Guardrails: guarantee balance != cash drawdown; renewal != new extraction; parent/subsidiary direction, collateral and capacity remain separate fields.
- TWSE 2024 review evidence supports distinguishing ordinary RPT intensity from abnormal terms, overdue balances, deficient substantive-related-party identification and process/valuation failures.
- Counterevidence retained: efficient internal contracting, treasury support and vertical integration.
- D21-11 may not double count D21-05 raw RPT variables.
- D21-05 remains L2/40. L3 requires a second economically different native Taiwan RPT family with relationship vintage, approval clock and public known_at.
- No outcomes, OOS, walk-forward or prospective Shadow inspected. FORMAL_OPTIMIZATION_CANDIDATE=NONE.

Exact next: replay one operating or asset RPT family; if blocked, proceed to D21-10 dual-vintage restatement/correction replay.


## 2026-10-04 D19 Stage 7 — executable receipts, real-source negative L3 gate
- PR #439 merged as `76f5ef80dbf0654a033a0a780b065ebfabbf0e30`; research-only D19 six-layer factor receipts now exist in code.
- Validation: System2 Research CI `37165603677` PASS; V8 Regression `37165603710` PASS; D19 real-source smoke `37165603790` PASS_NEGATIVE_L3_GATE with production-isolation PASS.
- Real TWSE witness: 2026-08-03..2026-08-31, 21 official sessions, 22,810 source rows, bounded symbols 2330/2454; deterministic receipt chain completed.
- Physical TPEx source failure was preserved, not imputed: both primary and legacy official historical transports returned HTTP 520 for 2026-08-03.
- L3 blockers frozen: bounded universe not historical registry; corporate-action continuity unverified; industry neutralization not proven; D03/D09 redundancy not proven; cost provenance modeled transport-only; TPEx official historical source unavailable.
- D19 remains 40.0% / all 15 active modules L2. Engineering completion is not maturity promotion. Formal Core unchanged.
- Exact next: close D19-04 blockers on a frozen date-vintaged historical universe and rerun deterministic six-receipt chain; zero blockers trigger L3 readiness review only, not automatic promotion. D19-07 remains L2 until executable benchmark/beta semantics exist.


## 2026-10-04 Room09 — MC-153..164 CBO coverage, H.4.1 decomposition and CBC vintage firewall

Run started 2026-10-04 08:40 Asia/Taipei. Recovery main 55bd2b5e9d9ffa329eebb694f49e0306ac3c711a. RESEARCH_ONLY / SOURCE_QA / OUTCOMES_CLOSED / NO_PROMOTION. No MC-149..152 repetition.

### MC-153..158 — CBO official transformed-data audit
- Official CBO data page explicitly routes automated use to US-CBO/cbo-data. README says outputs transform source spreadsheets; canonical originals remain cbo.gov. Verified source commit 284a95665f9f2f74ed1f482feb629b43fce323da with connector and downloaded nine pinned CSVs + schema/catalog. Artifact manifest records URLs by path, exact byte counts/SHA256. This authenticates later-retrieved transformed content only, not historical first-known/native XLSX.
- Nine CSVs total 25,480 rows; no duplicate (date,variable) within any file, all numeric finite, no blank values or unknown schema variables. Cross-file uniqueness requires vintage+frequency+date+variable; calendar/fiscal annual dates are bare year strings despite README examples CY/FY. A parser relying on examples would generate false missingness or mix year bases. An initial CY2026 query returned no rows; inspecting actual labels and correcting to 2026 recovered values. No source absence claim from that failed query.
- Quarterly 2025-01: 7,728 rows/138 variables/2022q1..2035q4. 2025-09: 1,092/39/2022q1..2028q4. 2026-02: 8,176/146/2023q1..2036q4. September has only potential_lfpr from the potential family, no real_potential_gdp or labor-force/productivity decomposition. Structural revisions need January->February common rows, labeled LAST_AVAILABLE_COMPARABLE_VINTAGE rather than latest-adjacent; September absence remains NOT_IN_VINTAGE.
- Calendar annual real-GDP growth fields for 2026: 1.827/2.034/2.364 percent for Jan/Sep/Feb. Independent ratios of annual mean quarterly levels give 1.827985/2.034225/2.364424 percent; Q4/Q4 gives 1.805989/2.161528/2.228176. Hence calendar annual field is annual-mean YoY and cannot silently replace report Q4/Q4 headline or Fed SEP. Small field/level-derived differences require upstream precision reconciliation, not redefinition.
- Calendar 2026 potential-output growth Jan->Feb 2.286->2.215%; potential labor-force growth 1.098->0.557%; labor-force productivity 1.174->1.648%. Directional offsets matter. Exact level-based multiplicative labor*productivity reconstruction agrees with potential-output growth within <0.0002 percentage points. This is arithmetic/mechanism evidence; it neither proves AI causality nor next-day Taiwan alpha. No missing September values imputed.
- Official transform parser derives estimate_type from workbook fill styles and identifies projection columns using a final different-color run. CSV labels therefore require original-cell verification; current shared schema is not automatically vintage-specific definition proof, especially 2026 Census/BLS splitting. Original URLs were resolved from official etl/config.py; all three bounded native XLSX GETs returned 403. Respect block; no bypass. Initial missing bs4 dependency was handled via standard HTML parser; initial transform filename 404 corrected by repository tree. Hashing/transformed QA does not satisfy native-source attestation or Taiwan L3.

Artifact: research/d13_19_cbo_three_vintage_source_qa_20261004_v0_1.json.
Sources: https://www.cbo.gov/data/budget-economic-data ; https://github.com/US-CBO/cbo-data/blob/284a95665f9f2f74ed1f482feb629b43fce323da/README.md ; same commit etl/config.py, etl/transform_econ_projections.py and data/economic/economic_projections/schema.json.

### MC-159..161 — H.4.1 reserve-factors witness
Official dated page https://www.federalreserve.gov/releases/h41/20261001/ and release-method page https://www.federalreserve.gov/releases/h41/about.htm independently read. Later official web QA only, no source-attested release-time capture.
- Reference week/Wednesday=2026-09-30; release date=2026-10-01. Typical Thursday 16:30 New York converts to Friday 2026-10-02 04:30 Taipei under DST; winter typical clock is 05:30. Typical schedule is not exact actual release/capture proof. Do not use Wednesday data before Thursday publication or backfill Oct1 Taiwan 18:10.
- Table1 millions USD, weekly averages: supplying factors 6,790,836; absorbing excluding reserves 3,842,746; reserves 2,948,090. Level closure exact. Weekly changes -9,687 - (-27,584) = +17,897 reserves. Falling supplying factors coexist with rising reserves. This is reserve-factor accounting, not an assertion of QE or bullish stock liquidity.
- Wednesday point reserves 2,881,686 differ from weekly average 2,948,090. Never mix timing bases. Reverse repos total=329,260 average, foreign official=325,518, others=3,742. Total reverse repos are not domestic ON RRP; others is not an independently matched daily NYFed facility receipt. TGA average=948,674, Wednesday=984,046. Currency/other deposits/liabilities remain required. Assets-TGA-ONRRP heuristic is not reserve identity or automatic directional score.

### MC-162..164 — CBC flow and revision witness
Official releases:
https://www.cbc.gov.tw/tw/cp-302-191278-bfcdf-1.html (2026-05-20 Q1)
https://www.cbc.gov.tw/tw/cp-302-192739-2cf64-1.html (2026-08-20 Q2)
https://www.cbc.gov.tw/tw/cp-432-182951-a9c69-1.html (2025-08-20 Q2)
All later-observed web QA; no native annex, first-known capture, strict prospective count.
- Q2 2026 portfolio net-assets +48.1 = resident foreign-assets +67.1 minus nonresident liabilities +19.0, billions in original units are USD100m (億美元). Nonresident increase is mainly overseas corporate bonds, not proof of Taiwan-equity buying. Q1 +415.1 = +161.7 - (-253.4); negative nonresident investment mainly Taiwan-equity selling. Quarterly cross-border net assets, TWSE daily institution trades and actual FX conversion/hedging are distinct. Sector transmission needs D07/D10; domestic institution flow remains D06.
- Revision/discrepancy witnesses: August H1 financial net-assets 1,181.2 less Q2 537.9 implies Q1 643.3, whereas May Q1 headline=648.6; -5.3 cannot be ordinary one-decimal rounding. August Q2 current-account 584.9 minus same-vintage stated YoY increase 212.9 implies prior-year Q2=372.0; 2025 release gave 362.3. These are cross-release inconsistency/revision flags, not silently repaired historical observations; annex/version reconciliation required. H1 current-account implied Q1 625.4 vs May625.3 can reflect rounding and is not independent revision proof.
- Q2 component sums current-account585.0 vs headline584.9; finance538.0 vs537.9, consistent with component rounding. Current-account584.9 minus finance537.9 minus reserves7.9 leaves39.1; do not label it a capital-flight residual or assign entirely to errors/omissions without capital-account/full annex/sign convention. Next release is scheduled 2026-11-20 16:20 per Q2 page, not a realized publication. Quarter-end is never knownAt. Preserve announced schedule, actual publication/capture, reference quarter and revised-version identity separately.

### Incremental-value falsification and continuation
Positive mechanisms: growth composition, reserve liability shifts and investment-instrument composition can distinguish macro states that identical headlines conceal. Counterevidence: conditional projections, accounting reallocation, seasonal/quarter-end balance-sheet moves, trade-credit settlement and prior market absorption may fully explain apparent direction. No scalar macro score.
Freeze Taiwan price/sector -> domestic institution flow -> rates/USD/global -> candidate baseline order, then independent release-level comparisons with costs, OOS/walk-forward, overlapping-horizon purge, leave-one-event/regime-out and multiple-testing accounting. Do not count thousands of CSV rows, quarters inside a revision file or constituent arithmetic as independent prospective events.
D13-16/17/19 remain L2/40%; D12=40.0%, D13=41.1%, room09=40.6%. Strict clean prospective dates added=0. Formal Core LOCKED; FORMAL_OPTIMIZATION_CANDIDATE=NONE; outcomes CLOSED. No Worker/runtime, rankings, signals, push, capital or holdings changes. Global tracker observed42.4%/354 modules, not this run's promotion.

Exact next: obtain permitted CBO native XLSX (or explicitly validated official original archive) and verify projection shading/definition against pinned transformed rows; do not bypass 403. Read CBC May/August/2025 annex vintages to reconcile the -5.3/+9.7 discrepancies; keep UNKNOWN until complete signs/rows are verified. Then audit one USTR/BIS/OFAC announcement/legal/effective policy lineage and TWSE 18:10 foreign-flow version receipts. For H.4.1, preserve a future authorized raw receipt at actual publication; independently matched NYFed ONRRP before heuristic comparisons. NDC ex-TAIEX remains UNKNOWN pending standardized vintage inputs. Do not repeat MC-153..164.

## DL-D21-20261004-C — RPT / dual-vintage restatement / tunneling boundary
Run date: 2026-10-04 Asia/Taipei
Scope: D21-05 / D21-10 / D21-11
Status: D21-05_L3 / D21-10_L3 / D21-11_L2 / RESEARCH_ONLY / FORMAL_CORE_UNCHANGED

### Research questions
- Can Taiwan related-party transactions be replayed safely at the daily after-market decision clock across economically distinct transaction families?
- Can financial restatements be reconstructed with original-versus-corrected vintages without look-ahead?
- Can tunneling/minority-shareholder risk be defined as an independent derived layer rather than double-counting ownership, pledge and RPT raw inputs?

### Evidence
D21-05:
- Yuanta Financial 2024-04-29 related-party real-estate disposal: MOPS-fed archive observed at 16:46:05; issuer archive matches same-day transaction; NT$133m amount; EirGenix related-party counterparty; appraisal, board and audit approval disclosed.
- Yuanta Financial 2024-07-26 NT$3bn capital injection into 100%-owned Yuanta Life: MOPS-fed archive observed at 16:26:47; board and audit approval clocks disclosed; stated capital-adequacy / financial-structure purpose.
- These demonstrate two RPT families and conservative daily-PIT availability before the formal after-market decision clock.

D21-10:
- Taiwan Terminal 3432, 2024-04-23 16:39:54 observed public restatement announcement directly discloses original / impact / restated values across multiple periods. 2022 EPS moved -17.57 -> -20.13, while 2023 annual EPS moved -5.32 -> -0.60 due reversal effects.
- Leader Electronics 3058 2025-05 case links restatement/correction to a senior-manager internal-control breach, unrecorded private stock dispositions and temporarily uncollected proceeds, a distinct cause family from the 3432 accounting-estimate case.
- Historical research must store original_vintage and corrected_vintage side by side; later values cannot be backfilled.

D21-11:
- Taiwan literature and TWSE review practice confirm that RPTs can represent tunneling/propping/internal-capital-market behavior depending on terms, beneficiary and governance context.
- The unique D21-11 ownership boundary is therefore a derived classification of directional value extraction from the listed issuer/minority shareholders to controller-related beneficiaries.
- D21-11 does not own raw wedge, pledge, RPT or accounting variables.

### Counter-evidence / falsification
- Large RPTs can be legitimate internal capital allocation.
- An RPT with related-party status is not proof of tunneling.
- Restatements can improve some later-period numbers because corrections propagate through accounting reversals.
- Detection/remediation may indicate functioning governance rather than only deterioration.
- Tunneling classification must preserve efficient-contracting/propping alternatives and cannot be created from one raw governance risk input.

### Bias / redundancy
- observed_public_at is safe for a later daily decision clock; it is not automatically the first publication second.
- Intraday first-minute studies still require original authoritative timestamp precision.
- D21-11 must test incremental value conditional on D21-01/04/05 rather than add duplicate points.
- D21-10 must test redundancy versus D07 accounting quality and D11 event-risk evidence.

### Maturity / candidate status
- D21-05 -> L3 / 60%.
- D21-10 -> L3 / 60%.
- D21-11 -> L2 / 40%.
- No FORMAL_OPTIMIZATION_CANDIDATE.
- Formal Core remains LOCKED.

### Exact next continuation
Build a D21-11 historical one-positive/one-control case set using contemporaneous beneficiary, transaction terms/pricing, control linkage and approval evidence. Continue D21-04 original pledge-receipt recovery when authoritative source access permits. D21-05 and D21-10 require prospective/OOS evidence before any L4 promotion.


## 2026-10-04 D19 Stage 8 — full TWSE denominator physically reconciled
- PR #460 merged as `1a7b6e7e8d8552953f909f4ee1448733a1daf643`.
- D19 TWSE full-universe workflow `37172684933`, System2 CI `37172684904`, V8 Regression `37172684903`: PASS.
- 2026-08-31 historical snapshot denominator 1,089; 2026-08-03..08-31 official rows 22,810; D19-04 input 1,064 KNOWN / 25 explicit UNKNOWN = 97.7043%.
- UNKNOWN: 2 recent listing insufficient-lookback; 6 incomplete-session rows; 17 null/invalid-close requiring trading-state provenance. No silent drop / no UNKNOWN->0.
- TPEx PR #459 negative experiment closed unmerged: all three current/fallback official transports HTTP 520; prior full-market benchmark had 18,646 rows but did not persist them.
- Corporate-action source/parser PASS does not equal continuity certification; industry vintage, D03/D09 redundancy and D14-compatible cost evidence remain open.
- Machine blocker reconciliation: `research/d19_04_l3_blocker_reconciliation_20261004_v0_1.json`.
- D19 remains 40.0% / all 15 active modules L2. Formal Core unchanged.


## 2026-10-04 D19 Stage 9 — symbol-session / invalid-close evidence
- D19-04 remains L2 / 40%; no maturity promotion.
- PR #463 / commit `67ff5fca7544954ed12cb59449b6dae046c012b6` physically captured official TWSE historical temporary-suspension evidence for 1218 and 1909 in the frozen 2026-08 interval; non-matches remain UNKNOWN rather than NO_SUSPENSION.
- Six fewer-than-21-row TWSE names were separately matched to official stop-trading / structural-event windows; immutable D19 source bundling remains pending.
- PR #464 / commit `c8945c76e2cc4cd72faecaa4cd6d09a0b7077eb1` decomposed the remaining 15 invalid-close names into 50 rows: 11 official zero-trade rows and 39 positive-activity/no-OHLC unresolved rows.
- Forward fill, previous-close substitution, and volume-to-price substitution are prohibited. The 20-session momentum lane requires a preregistered valid-observation / symbol-session / stale-price contract before L3 replay.
- Remaining hard gates: TPEx replayable history/universe, full continuity certification, PIT industry vintage, compatible D03/D09 paired redundancy, and D14-compatible cost provenance.
- Formal Core unchanged; FORMAL_OPTIMIZATION_CANDIDATE = NONE.


## 2026-10-04 Room09 — MC-165..172 native CBC revisions and BIS legal clocks
Run start 2026-10-04 11:34 Asia/Taipei. RESEARCH_ONLY / OUTCOMES_CLOSED / NO_PROMOTION.
Artifact: research/d13_cbc_native_revision_policy_lineage_20261004_v0_1.json.

### Append-only evidence-identity reconciliation
Two earlier source families reused MC-149..156. Retain both unchanged. Disambiguate by (evidenceId,sourceArtifact,runHeading), never evidenceId alone: CBO family research/d13_19_cbo_three_vintage_source_qa_20261004_v0_1.json and preceding MC-149..152 CBO heading; cross-link family research/d12_d13_source_lineage_deepening_20261004_v0_1.md. Max prior substantive sequence is MC-164; this run continues MC-165..172, next MC-173. No deletion, historical renumbering, false progress rollback or duplicate independent-event credit.

### MC-165 — three permitted native annexes
Retrieved CBC official XLSX at links attached to 2026-05-20,2026-08-20 and2025-08-20 releases. URLs, byte counts, SHA256, local completion time, selected raw cached cell strings and labels recorded in artifact. Respect allowed native downloads; no original-release byte attestation inferred. May has3 worksheets; August and prior-year August have4 because H1 comparison is additional sheet2. Historical current/financial sheets are May2/3 vs August3/4. Resolve table title/units/reference quarter and revision marker rather than ordinal index. Native p/r note=preliminary/revised. Standard-library OOXML read only; no formula recalculation; arithmetic at displayed0.01 USD100m while preserving raw serialization tails. Corrected an intermediate mistaken 'service detail' description to H1 comparison after native title read.

### MC-166 — Q1 2026 financial revision decomposes
May sheet1 B19=648.64; August sheet4 D32=643.30 with C32=1r. Delta -5.34 USD100m. Net direct73.68->73.02 (-0.66); portfolio415.07->417.78 (+2.71); derivative -2.31 unchanged; other162.20->154.81 (-7.39). Component deltas close -5.34 exactly. May resident-other assets292.62->283.05 and liabilities130.42->128.24 explain net-other change. Revised accounting cannot establish why source submissions changed or a new capital-flight event on original quarter date.

### MC-167 — small current-account change is a real revision
May CA625.29 vs August history625.35, C32=1r, delta+0.06. Goods580.05->584.04 (+3.99), services-34.23->-36.25 (-2.02), primary92.21->90.33 (-1.88), secondary-12.74->-12.77 (-0.03), exact sum+0.06. Previously headline-only625.3/625.4 allowed rounding; native revised row now resolves it. A tiny net revision conceals materially offsetting component changes; no gross double-counting score.

### MC-168 — prior-year base revision resolves +9.7 witness
2025 August native Q2 CA362.29; 2026 August same quarter revised372.01 (sheet3 C29=2r). Exact +9.72 USD100m. Goods+10.79, services-1.57, primary+0.47, secondary+0.03 close+9.72. Current Q2 YoY212.90 uses revised372.01. Applying original362.29 to current584.91 instead gives222.62: different version-defined comparison, not economic surprise. These endpoints do not identify intervening release or first revision time; lineage interval remains unresolved.

### MC-169 — complete signs close the earlier residual
August native Q2: CA584.91 + capital(-0.03) - FA537.89 + errors(-39.13) = reserves7.86 USD100m. May Q1 same identity closes -46.55;2025Q2 closes160.02. Eight targeted Decimal checks PASS:3 revision decompositions,3 BOP identities,2 Q2 component sums. The headline39.1 residual is accounted for by capital plus errors with proper signs; not identified equity withdrawal/FX demand. Q2 net financial84.68+48.06-88.32+493.47=537.89. Resident/nonresident net accounting remains distinct from TWSE daily equities and actual FX settlement.

### MC-170 — BIS original document boundary and clocks
Verified official govinfo PDF2025-19001,90FR47201, publication2025-09-30, effective2025-09-29; original press datedSept29 has no audited intraday time. Document's own footer Filed9-29-25;8:45am. First-page PDF includes tail/footer of PRECEDING2025-18992; never assign that identity to affiliates rule. Original text includes50-percent ownership restrictions and scoped temporary license endingNov28,2025; not universal transaction relief. Ownership, jurisdiction/items, party restrictions and exceptions remain separate from company-sector exposures.
Source: https://www.govinfo.gov/content/pkg/FR-2025-09-30/pdf/2025-19001.pdf ; https://www.bis.gov/press-release/department-commerce-expands-entity-list-cover-affiliates-listed-entities .

### MC-171 — supersession and scheduled phase
Official2025-19846 PDF90FR50857: filedNov10,2025;8:45am, effectiveNov10; publicationNov12. It stays changes throughNov9,2026 and schedules reinstatementNov10,2026 absent further extension/amendment. Future phase=SCHEDULED_SUBJECT_TO_AMENDMENT, not observed or guaranteed current law. Not an exhaustive intervening-amendment legal audit. PDF includes beginning of another Entity List rule after its own footer: exclude unrelated provisions. Filing footer's quoted clock has no encoded timezone; no invented UTC timestamp. Announcement, public inspection, formal publication, effective, transition expiry and local observedAt must remain separate.
Source: https://www.govinfo.gov/content/pkg/FR-2025-11-12/pdf/2025-19846.pdf .

### MC-172 — mechanism, falsification and eligibility
Possible incremental signal is revision composition/known legal phase conditional on Taiwan price/sector, domestic flow, rates/USD/global baselines. Rival explanations: reporting revisions, offsets, instrument/settlement shifts, anticipatory pricing, correlated diplomatic/macro events. Later retrieved official native bytes improve source QA but do not establish historical first-known or source-attested decision-time receipts. Raw native bytes are not durably archived by this JSON; hashes/excerpts are not archive/readback certification. No imputation, realized outcome joins, company eligibility claim or trading recommendation. Require contemporaneous immutable source receipt, event-cluster independence, exposure known at decision, costs, purged walk-forward/OOS, leave-one-event/regime-out and multiple-testing control before promotion.

D12=40.0%; D13=41.1%; room09=40.6%,36 modules unchanged. D13-11/16/17 stay L2/40%; strict clean prospective dates added0. FORMAL_OPTIMIZATION_CANDIDATE=NONE; Formal Core LOCKED. No runtime, selection, ranking, signal, push, capital/holdings change. Latest global tracker read43.7%/356 modules; concurrent other-room work is not credited to this run.

Exact next: MC-173. Bound CBC intermediate release lineage to identify when2025Q2 revisions became public; preserve future2026-11-20 scheduled BOP raw receipt only upon actual release and authorized archive/readback. For BIS, audit amendment/supersession chain before any current legal-state claim; resolve authoritative public-inspection availability and timezone only from direct evidence. D12 next remains permitted raw TAIFEX option-chain metadata/date/strike/bid-ask/settlement coverage and first-known receipts; later replay alone is not L3. CBO native403 remains blocked; no bypass. Do not repeat MC-165..172.

## DL-D21-20261004-D — tunneling timing firewall / management guidance credibility
Run date: 2026-10-04 Asia/Taipei
Scope: D21-11 / D21-12
Status: D21-11_L2_PARTIAL_REPLAY / D21-12_L2_MECHANISM_DEFINED / RESEARCH_ONLY / FORMAL_CORE_UNCHANGED

### D21-11 durable result
- A later-adjudicated Taiwan extraction case and a justified related-party control case now exist.
- The key anti-look-ahead finding is temporal: later judicial truth is an ex-post label and cannot be backfilled to the original transaction date.
- D21-11 must preserve underlying_transaction_date, decision_time_public_state, adjudication_known_at and remediation/recovery state separately.
- The confirmed case lacks recovered contemporaneous public transaction-date evidence in this run, so D21-11 remains L2 / 40%.
- Promotion to L3 requires a decision-time reproducible case: either contemporaneous evidence for the confirmed case or another high-suspicion case whose beneficiary/terms/control evidence was publicly available at the relevant decision timestamp.

### D21-12 management-guidance credibility
- D21-12 advances L0 -> L2 / 40%.
- Guidance channels are separated into formal financial forecasts, investor-conference guidance, material-announcement forward statements and non-scorable generic optimism.
- Taiwan source families include MOPS / issuer IR / TWSE conference materials, formal forecast filings, revisions and later actual results.
- Competing mechanisms retained: management credibility history, information-efficiency benefit, strategic optimism/self-selection, meet-or-beat / earnings-management behavior and genuine external uncertainty.
- Credibility is a rolling realized-history construct. Forecast error may only be computed after the actual outcome became public.
- Management identity is versioned; predecessor credibility does not automatically transfer to a successor.
- Qualitative statements without a pre-defined falsifiable proposition remain NON_SCORABLE.

### Bias / redundancy
- Control analyst coverage, disclosure frequency, firm size, institutional ownership, operating volatility, industry uncertainty, macro/FX/commodity shocks, management turnover, analyst consensus/dispersion, D07 fundamentals and D11 event/news evidence.
- Do not reward frequent guidance mechanically.
- Do not punish a single miss mechanically.
- A credibility factor that only proxies firm quality or analyst coverage is redundant.

### Candidate status
- D21-11: FALSIFICATION_IN_PROGRESS / no L3 promotion.
- D21-12: FALSIFICATION_DEFINED / L2 only.
- No FORMAL_OPTIMIZATION_CANDIDATE.
- Formal Core remains LOCKED.

### Exact next continuation
Build a two-issuer Taiwan D21-12 numeric-guidance replay from original public known_at through any revision/withdrawal to actual-outcome known_at. Prefer one relatively accurate guidance history and one repeated optimistic/revision-heavy history. Compute forecast error only after outcome publication and test incremental value beyond analyst coverage, earnings revisions and fundamentals. Continue D21-11 contemporaneous-evidence recovery opportunistically; after D21-12 replay, begin D21-13 materiality-focused ESG/climate/social risk.


## 2026-10-04 D03 — TI-594~610 TPEx source closure / Bollinger first-parent acceptance

- Official TPEx machine-route discovery is now physical rather than inferred.
- Halt/resumption:
  - route `/www/zh-tw/bulletin/sprcHis`;
  - physical bounded 2026 mainboard JSON = 30 rows / totalCount 30;
  - official CSV = same 30 unique keys; no duplicates;
  - source-local zero controls PASS.
- Ex-right/ex-dividend actual results:
  - route `/www/zh-tw/bulletin/exDailyQ`;
  - 2026-07-01..2026-10-04 physical JSON = 587/587;
  - JSON/CSV keyset equivalence PASS;
  - official fields include prior close, reference price, rights/dividend values, limits and trading-base price.
- Capital reduction:
  - route `/www/zh-tw/bulletin/revivt`;
  - 2026-01-01..2026-10-04 physical JSON = 11/11;
  - JSON/CSV non-detail keyset equivalence PASS;
  - detail exposes suspension/resumption and share-replacement/cash-return data.
- Shared continuity archive supports `PROSPECTIVE_OBSERVED`: pre-parent source capture can be a causal observed availability upper bound; post-parent capture cannot backfill.
- Bollinger first-parent acceptance evaluator is frozen and physically tested in workflow run `37182674404`:
  - exact 20-session valid path PASS;
  - late capture, missing bar and duplicate date fail closed;
  - constrained valid state remains visible;
  - incomplete expected-parent attempts remain INCOMPLETE;
  - complete attempt set including UNKNOWN can be COMPLETE.
- No maturity inflation:
  - D03-10 Bollinger remains L2/40;
  - D03-09 ADX remains L2/40;
  - D03 remains 56.7%;
  - first genuine post-V8.17 Taiwan parent generation is still pending because 2026-10-04 is Sunday.
- Raw D03 source-version gate remains separately 2/3; TI-005/TI-006 outcomes remain CLOSED; Formal Core LOCKED.
- Exact next: first genuine parent readback -> cutoff-safe continuity attempts for every expected parent -> Bollinger COMPLETE-run L3 review -> ADX canonical recursive replay review.


## DL-D21-20261004-E — guidance PIT and material ESG scope
Run date: 2026-10-04 Asia/Taipei
Scope: D21-12 / D21-13
Status: D21-12_L3 / D21-13_L2 / RESEARCH_ONLY / FORMAL_CORE_UNCHANGED

### D21-12 guidance replay
- TSMC 2024 numeric revenue guidance is replayable across 2Q/3Q/4Q:
  - 2Q guide 19.6-20.4 USD bn -> actual 20.82;
  - 3Q guide 22.4-23.2 -> actual 23.50;
  - 4Q guide 26.1-26.9 -> actual 26.88.
- MediaTek numeric revenue guidance is replayable across several quarters:
  - 3Q24 guide NT$123.5-132.4bn -> actual NT$131.813bn;
  - 4Q24 guide NT$126.5-134.5bn -> actual NT$138.043bn;
  - 2Q25 guide NT$147.2-159.4bn -> actual NT$150.369bn.
- Both small samples lean conservative rather than optimistic; this is a descriptive sample property, not a permanent management trait.
- Critical PIT finding: actual_outcome_known_at is metric-specific. MediaTek quarter revenue becomes reconstructable after the final monthly-sales report; margin metrics remain later. TSMC USD-revenue guidance requires the matching official USD quarterly actual unless an FX-consistent reconstruction is pre-registered.
- Current TWSE rules require listed companies to continuously assess qualifying forecast attainability and promptly disclose when such forecast information is no longer applicable. Revision / no-longer-applicable timing is therefore a first-class credibility feature.
- D21-12 advances to L3 / 60%. No L4 without OOS/prospective incremental evidence.

### D21-13 financially material ESG/climate/social scope
- D21-13 advances L0 -> L2 / 40%.
- Generic ESG score is rejected as a primary signal.
- Only financially material channels are owned: revenue/demand, cost, capex, asset value, financing/insurance, regulation, supply chain/customer qualification, workforce/safety, litigation/remediation and disclosure credibility.
- Taiwan phased IFRS sustainability adoption begins from FY2026 for >=NT$10bn paid-in-capital listed/OTC companies, FY2027 for NT$5-10bn, and FY2028 for the remainder.
- Disclosure-phase and methodology-vintage controls are mandatory; post-mandate disclosure increases cannot be interpreted as risk deterioration mechanically.
- Academic evidence supports distinguishing material versus immaterial sustainability topics, while ESG-rating divergence literature rejects treating one vendor composite as ground truth.
- Candidate metrics emphasize sector-specific emissions/energy/water, transition capex, target-versus-realized progress, safety/labor/product events and disclosure quality.

### Falsification / redundancy
- D21-12 must control analyst coverage, earnings revisions, firm fundamentals, industry and macro shocks, manager turnover and self-selection into guidance.
- D21-13 must control industry, size/reporting resources, export/customer exposure, regulation phase, energy intensity, capex cycle, profitability/valuation, D09/D10 supply chain, D13 macro/policy and D21-10 disclosure quality.
- Neither module has a Formal optimization candidate.

### Exact next continuation
1. Build D21-13 multi-sector Taiwan historical PIT replay using at least two materially different channels, preferably semiconductor water/energy/carbon versus high-emission industry or labor/product-safety-sensitive industry.
2. Preserve disclosure regime, methodology version, assurance, target baseline/revision, target-versus-realized state, known_at and financial transmission channel.
3. D21-12 requires rolling multi-year OOS/prospective validation before L4.
4. Continue D21-11 contemporaneous-evidence recovery opportunistically.


## 2026-10-04 Room09 D12/D13 source-lineage continuation

- Dedicated evidence: `research/d12_d13_public_source_lineage_20261004_v0_1.md`.
- D12: TAIFEX official option time-and-sales RPT/CSV and OpenAPI `/OptionsTimeAndSalesData` routes are confirmed. Trade-parent evidence is explicitly separated from quote/surface-parent evidence. Conflicting current crawl issued-times require receipt/version identity rather than timestamp selection by convenience. H11 remains PARTIAL_EVIDENCE_RECEIVED; no raw quote-chain parent/common-support surface residual evidence yet.
- D13: CBC cross-release arithmetic proves repeated historical BOP revisions. Same-vintage subtraction is now mandatory; cross-release cumulative subtraction is prohibited. The 2025Q2 exact first-public revision to the later 372.01 endpoint remains UNKNOWN pending lossless native intermediate-annex inspection.
- Counterevidence/quality: source-route existence is not raw-parent attestation; aggregate cumulative changes do not identify which prior quarter changed; later revised history cannot be backfilled to original decision dates; tool/access failure is not source absence.
- Maturity unchanged: D12 40.0%, D13 41.1%. Outcomes CLOSED. Formal Core unchanged. FORMAL_OPTIMIZATION_CANDIDATE=NONE.
- Exact next: D12 materialize one permitted OpenAPI/time-and-sales parent plus a permitted quote-chain parent for H11 identical-parent/common-support comparison; D13 losslessly inspect CBC 2025-11-20 native XLSX first, then 2026-02-26 and 2026-05-20 only if needed to establish the first-public 2025Q2 revision.


## 2026-10-04 D03 — TI-611~630 ADX/Bollinger acceptance hardening

- D03 remains 56.7%; no maturity increase from synthetic/fixture acceptance logic.
- ADX acceptance v0.1 initially passed read-only CI but was then self-falsified: a caller could self-declare FULL_REPLAY and supply nonempty lineage/hash labels.
- ADX v0.2 now requires owner-chain source identity, rawHistoryAdmissionReceiptId, symbol/session/calendar/continuity/corporate-action versions, 64-hex sourceHistoryHash/continuityTransformHash/stateLineageId, canonical clean-history anchor certification, exact eligible-bar count from anchor, per-bar observedRawBarIdentity/sourceBarHash and prefix replay equality.
- Read-only ADX v0.2 workflow run 37184852267 PASS; fake lineage, uncertified/shifted anchor and unverified trusted-prior state fail closed.
- Bollinger v0.1 was found to have the same self-attestation weakness. Bollinger v0.2 requires the same owner-chain continuity identity, exact 20 eligible-session population counts, per-bar raw identity/hash and the frozen core formula implementation.
- Read-only Bollinger v0.2 workflow run 37184976280 PASS; fake lineage, missing raw receipt, late capture, 19-bar window, unresolved event and wrong standard-deviation semantics fail closed.
- V0.1 evaluators are not promotion-grade; v0.2 is the current acceptance contract.
- First genuine post-V8.17 Taiwan parent remains pending because 2026-10-04 is Sunday.
- D03-10 Bollinger stays L2/40; D03-09 ADX stays L2/40; raw source-version gate stays 2/3; TI-005/TI-006 outcomes remain closed.
- Exact next: inspect and freeze the parent-to-continuity receipt binding envelope so Monday cannot substitute a continuity receipt from another parent/generation/symbol/window; then use the first genuine parent for Bollinger v0.2, followed by ADX v0.2 FULL_REPLAY.


## 2026-10-04 D03 — TI-631~635 parent continuity binding

- Added immutable parent×continuity binding instead of duplicating shared continuity facts into each parent.
- Binding hashes the exact scanDate/captureGeneration/symbol/parentSnapshotHash/parent knownAt plus continuity identity/version/asOf/capturedAt/source and transform hashes/date-set hashes/sourceBarsThrough.
- Physical read-only run 37185221432 PASS: cross-generation identity differs; wrong asOf, late capture, date-set mismatch and future-bar contamination all fail closed; correctly bound Bollinger/ADX v0.2 remain VALID.
- This closes join-identity design risk only. D03 stays 56.7%; D03-09/10 stay L2; first genuine post-V8.17 parent pending.
- Exact next: audit the real pre-parent clock envelope; continuity capture must exist no later than parent knownAt, and parent availability alone is insufficient.


## 2026-10-04 D03 — TI-636~643 pre-parent clock audit

- Physical read-only run 37185635335 PASS.
- First genuine V8.17 parent is necessary but not sufficient: Technical continuity source/version evidence must be legitimately known no later than C1 decisionAt.
- Current 16:30 System2 recent A1 warmup is raw history only and explicitly continuity UNVERIFIED.
- Current 18:35 daily diagnostic is after the normal 18:10 parent and cannot backfill decision-time Technical evidence.
- Continuity/MOPS capability workflows currently have no recurring pre-parent promotion-grade capture schedule.
- Therefore PRE_PARENT_CERTIFIED_CONTINUITY_CAPTURE_NOT_PRESENT is a new explicit blocker; Bollinger/ADX first-parent promotion readiness is false under the current clock envelope.
- D03 remains 56.7%; next research target is whether official MOPS sourceReportedAt can be certified as a public disclosure clock or must remain a prospective-observation debt.


## 2026-10-04 D03 — TI-644~650 MOPS clock corroboration

- Official TWSE rules/material independently corroborate MOPS as a public/timely disclosure platform and sourceReportedAt as a meaningful issuer disclosure/reporting clock.
- This does not prove zero/bounded public retrieval latency; historical sourceReportedAt remains insufficient as exact availableAt.
- Safe asymmetry: sourceReportedAt after parent => excluded; sourceReportedAt before parent without certified prospective observation => still availability-UNKNOWN.
- Read-only run 37185849126 PASS for the clock classifier.
- Latest owner lane already has source-reported clock semantics certified and a prospective observation adapter implemented, but prospectiveObservationCount remains 0 and no automatic high-frequency schedule exists.
- D03 therefore consumes the shared observer rather than forking one; maturity remains 56.7%.

## DL-D21-20261004-F — sector materiality / planned-vs-abrupt succession
Run date: 2026-10-04 Asia/Taipei
Scope: D21-13 / D21-09
Status: D21-13_L3 / D21-09_L3 / RESEARCH_ONLY / FORMAL_CORE_UNCHANGED

### D21-13 materiality replay
- TSMC 2023 Sustainability Report became public on 2024-07-31. Report-specific 2023 metrics enter historical availability in 2024, not 2023.
- TSMC 2023 unit water consumption = 176.4 L per 12-inch equivalent wafer mask layer, +25.2% versus 2010 base and missed target; issuer attributed the deterioration materially to lower utilization. Process-water recycling = 90.3%; reclaimed-water replacement = 12%, above its disclosed 2023 target.
- Denominator effect is frozen: a worse intensity metric can coexist with improved resilience metrics and can be driven by lower production/utilization.
- China Steel 2023 Sustainability Report was board-approved/publicly described 2024-08-13. 2023 carbon reduction about 358,000 tCO2e; process-water recycling 98.5%; total water intensity 5.04 versus 4.90 target; new-water intensity 2.16 versus 2.50 target.
- China Steel explicitly links carbon fees, low-carbon energy/raw materials and carbon-neutral technology to operating/R&D costs.
- Cross-sector mapping is mandatory. Semiconductor materiality centers on water/power/process/supplier-customer decarbonization; integrated steel centers on absolute carbon, carbon fees, low-carbon raw materials, technology/capex and process water.
- D21-13 advances to L3 / 60%. Generic ESG composite remains rejected.

### D21-09 succession replay
- TSMC planned succession: 2023-12-19 public plan that Mark Liu would retire after 2024 AGM and C.C. Wei was recommended; effective chairman election 2024-06-04. Lead time 168 days.
- Taiwan Cement abrupt event: 2017-01-22 incapacity led to acting chairman/president; MOPS-derived archive by 2017-01-23 07:20. Leslie Koo's death was publicly announced before market open; permanent chairman/president Chang An-Ping selected later 2017-01-23 with MOPS-derived archive at 17:23.
- Succession state must preserve incapacity, acting appointment, death/retirement confirmation, permanent successor and effective date. Current roster cannot reconstruct this path.
- D21-09 advances to L3 / 60%. Planned and abrupt transitions are not one event family.

### Falsification / redundancy
- Sustainability intensity metrics require denominator and methodology controls; report vintage cannot be backfilled.
- Mandatory disclosure phase and methodology changes can create apparent ESG improvement/deterioration without economic change.
- Planned succession may reflect ordinary retirement; abrupt succession may be mitigated by deep internal management continuity.
- Company statements of no operational impact are claims, not causal proof.
- D21-09 must control prior performance, governance, family/controller status and industry conditions.

### Candidate status
- No FORMAL_OPTIMIZATION_CANDIDATE.
- D21-13 and D21-09 require OOS/prospective incremental validation before L4.
- Formal Core remains LOCKED.

### Exact next continuation
D21-07 is the largest executable L2 module without PIT validation. Build a historical Taiwan compensation-policy to capital-allocation replay, covering at least one long-horizon investment decision and one capital-return/financing decision, with policy known_at, decision known_at and future realized outcomes separated. Keep D21-11/04/03/01 source blockers non-blocking.


## 2026-10-04 D03 — TI-651~660 pre-parent source-cut acceptance

- Durable handoff: `research/D03_PRE_PARENT_CONTINUITY_SOURCE_CUT_HANDOFF_V0_1.md`.
- Physical source-capacity run `37190871367` PASS over 2026-08-15..2026-10-02:
  - 294 official actual-result events;
  - 31 event-bearing dates;
  - mean ~9.48 events per event-bearing date;
  - max 33 events/symbols on one effective date;
  - 149 TWSE ex-right/dividend, 129 TPEx ex-right/dividend, 7+7 capital-reduction, 1+1 par-value-change events.
- This supports event-driven revision-source engineering as materially smaller than full-market per-symbol polling, but proves no production budget or completeness.
- Critical clock refinement: exact prospective MOPS version `firstObservedAt <= parentKnownAt` is sufficient conservative parent-cutoff availability evidence even when latency `precisionEligible=false`. Prior NOT_OBSERVED <=5 minutes is latency precision, not intrinsic D03 parent eligibility.
- Selected-only pre-parent capture is rejected because C1 parent/keyset is produced by the normal scan; source cut must be market-wide/exchange-wide or full eligible-universe before parent.
- Physical source-cut policy run `37191199051` PASS:
  valid market-wide cut passes; late cut, selected-only scope, late/retrospective MOPS version, incomplete version keyset and truncated query all fail closed.
- Current v0.2 Bollinger/ADX `capturedAt <= parentKnownAt` requirement remains intact; no evidenceCutoffAt/receiptCreatedAt reinterpretation was made.
- Hard shared-owner debt: `noRevisionGapThroughCut`, cutoff-safe source-cut runtime, symbol-session completeness and genuine parent-bound continuity receipts.
- No maturity inflation: D03-10 remains L2/40, D03-09 remains L2/40, D03 = 56.7%.
- Next honest path: owner source cut -> genuine V8.17 parent -> bound Bollinger COMPLETE run -> 58.3%; ADX canonical FULL_REPLAY COMPLETE run -> 60.0%.
- Raw D03 3-session gate remains 2/3; TI-005/TI-006 outcomes CLOSED; Formal Core LOCKED.


## 2026-10-04 D03 — TI-661~685 cutoff-safe continuity architecture

- Room/domain: 03｜技術指標與趨勢動能研究室 / D03.
- Maturity remains 56.7%; this tranche deliberately does not convert contract quality into L3 evidence.
- New timing architecture:
  - immutable market-wide evidence cut must precede true Formal decisionCutoffAt;
  - continuity computation may occur after the parent only when derived exclusively from the pre-cut immutable facts;
  - post-cut or unbound source facts block;
  - market-wide cut hash and symbol-specific transform manifest remain separate provenance layers.
- Physical workflow 37195966922 PASS under strict decision-cutoff semantics.
- Two-point noRevisionGapThroughCut candidate:
  - late-discovered pre-cut version, version mutation, missing pre version, truncation/incomplete post population all block;
  - later genuinely post-cut revisions are allowed;
  - workflow 37195789302 PASS;
  - owner certification required; D03 self-certification forbidden.
- Strict pre-parent source-cut V0.2:
  - decisionAt/parentKnownAt may not substitute for decisionCutoffAt;
  - workflow 37195982487 PASS.
- Parent × evidence-cut × continuity binding V0.2:
  - post-parent-derived Bollinger and canonical FULL_REPLAY ADX synthetic receipts remain valid only after strict cut timing passes;
  - generation/cut/lineage identities are bound;
  - workflow 37196089575 PASS.
- Effective V8.17 build audit:
  - first assumption that totalCapital was the last async Formal input was falsified;
  - V7.5.30 adds a later Formal-affecting V7_MARKET_CONSENSUS KV read;
  - corrected workflow 37196768178 PASS after C1/C2 review 95/95;
  - after market-consensus read and before synchronous selectTomorrowCandidates there are zero external/async reads;
  - C1 decisionAt exists, decisionCutoffAt absent;
  - current source-audited owner insertion point = immediately after market-consensus read, before selector.
- Owner handoff V0.2:
  - research/D03_PARENT_DECISION_CUTOFF_OWNER_HANDOFF_V0_2.md
  - no Production change authorized by D03.
- Exact next:
  1. shared parent owner implements/version additive decisionCutoffAt at audited boundary under applicable Production governance;
  2. first genuine trading-session C1 generation must physically read back cutoff; no historical backfill;
  3. shared continuity owner creates market-wide evidence cut <= cutoff and certifies noRevisionGapThroughCut + symbol-session completeness;
  4. derived continuity may be post-parent only from that cut;
  5. bind every expected parent; Bollinger COMPLETE first -> possible 58.3%;
  6. ADX only canonical FULL_REPLAY -> possible 60.0%;
  7. raw D03 source-version gate remains 2/3; TI-005/TI-006 outcomes CLOSED.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE; Formal Core LOCKED.


## DL-D21-20261004-G — incentive allocation / tunneling decision-time state
Run date: 2026-10-04 Asia/Taipei
Scope: D21-07 / D21-11
Status: D21-07_L3 / D21-11_L3 / RESEARCH_ONLY / FORMAL_CORE_UNCHANGED

### D21-07 incentive -> capital allocation replay
- TSMC 2024-02-06 disclosed RSA design intended to retain executives/key talent and link compensation with shareholder interests and ESG.
- TSMC 2024-06-05 approved about US$17.3562bn long-horizon capital appropriations and a 3.249m-share buyback explicitly to offset dilution from employee restricted stock awards.
- The dilution-offset buyback is an issuer-stated direct mechanism. The capex approval is NOT treated as caused by the incentive plan.
- Later outcome evidence records about US$29.76bn 2024 consolidated capex, about 0.9m additional 12-inch-equivalent wafer capacity, and completed/cancelled 3.249m-share buyback.
- Board capital appropriations are authorization batches and cannot be compared mechanically with annual capex as an execution ratio.
- MediaTek is retained as a falsification control: stock-ownership incentives, high shareholder payout and large R&D investment can coexist.
- D21-07 advances to L3 / 60%; no L4 without OOS/prospective incremental evidence.

### D21-11 decision-time tunneling state replay
- Formosa Oilseed Processing 1225 on 2020-02-07 corrected prior financial-report notes to disclose omitted related-party stock purchases: 1.523m shares, NT$43.338m, counterparty a first-degree relative of the then vice chairman.
- At that public state the correct classification is AMBIGUOUS / ELEVATED_GOVERNANCE_CONCERN, not confirmed tunneling.
- On 2020-11-05 the Taichung District Prosecutors Office publicly alleged controller/beneficiary linkage, irregular transactions totaling NT$92.32935m, concealment of related-party status, false financial reporting and about NT$20.175m company loss.
- That public state supports HIGH_SUSPICION, not yet confirmed conviction.
- Later adjudication can create CONFIRMED_TUNNELING only from its later known_at.
- When source timing is DATE_ONLY, intraday use is prohibited and daily eligibility begins on the next trading day unless same-day-before-decision timing is independently proven.
- D21-11 advances to L3 / 60%.

### Anti-look-ahead / causal controls
- Ex-post court truth never backfills an earlier feature state.
- Incentive-policy timing preceding an allocation decision does not establish causality.
- Same-board-meeting approvals are co-occurrence unless the issuer explicitly states a mechanism.
- Outcome data enter only after later public disclosure.
- All L3 modules remain below L4 without OOS/prospective evidence.

### Exact next continuation
D21 remaining L2 source-blocked priorities:
1. D21-04 authoritative pledge setup/release receipts or another original-source pledge pair.
2. D21-03 authoritative monthly insider known_at plus a second transfer-motive case.
3. D21-01 authoritative ownership-report first-known receipt/time.
Do not idle if one source remains blocked; try the next executable source path. No Formal Core change.


## 2026-10-04 D03 — TI-686~692 decision-cutoff minimal implementation audit

- Latest authoritative D03 state remained 56.7% with Bollinger/ADX blocked behind genuine cutoff-bearing parent + owner-certified continuity.
- New source-level implementation audit proves a dedicated D1 column is not semantically required for `decisionCutoffAt`: current C1 receipt persistence already serializes the entire immutable parent header in `trade_research_c1_generations.header_json`, and readback reparses it.
- Existing same-generation header conflict logic can make cutoff immutable automatically once the field is present.
- D03 does not need cutoff duplicated into each Shadow membership row; membership -> captureGeneration -> immutable C1 header is the preferred single-owner chain.
- Minimum owner runtime patch: stamp cutoff after the final `V7_MARKET_CONSENSUS` read and before synchronous selector; pass exact value into selector/C1 builder; enforce cutoff <= decisionAt; persist/read back via existing header; no provider call; no Formal behavior change; no historical backfill.
- This narrows implementation risk but does not create genuine session evidence, so D03 maturity remains 56.7%.
- Exact next: shared System1 parent owner implements under Production governance, then first genuine post-deploy session readback + cutoff-safe continuity binding + complete Bollinger v0.2 parent reconciliation; ADX only after canonical FULL_REPLAY.


## DL-D21-20261004-H — conservative PIT bound / source-gate audit
Run date: 2026-10-04 Asia/Taipei
Scope: D21-01 / D21-03 / D21-04
Status: D21-01_L3 / D21-03_L2 / D21-04_L2 / FORMAL_CORE_UNCHANGED

### D21-01 conservative daily PIT
- Exact first-public timestamp is preferred but not required for daily replay when regulation provides an authoritative latest-publication bound.
- Historical 2024-08-01 annual-report rule: listed/OTC issuers with paid-in capital >=NT$2bn or foreign/PRC holdings >=30% had to file annual report 14 days before AGM.
- TSMC 2025 AGM 2025-06-03 -> latest filing 2025-05-20 -> safe daily use 2025-05-21.
- Formosa Plastics 2025 AGM 2025-06-11 -> latest filing 2025-05-28 -> safe daily use 2025-05-29.
- Statutory-bound timing is a conservative lower-freshness fallback, not exact known_at; intraday use is prohibited.
- D21-01 advances L2 -> L3 / 60%.

### D21-04 source-gate audit
- Official rules confirm pledge setup/release filing within 5 days and monthly aggregation.
- This can support conservative daily known-at only after an authoritative underlying pledge-event date is established.
- Current 2850/Shinkong Textile individual pledge event dates remain secondary-source only; no L3 promotion.

### D21-03 motive-diversity audit
- Hon Hai 2019 trust-transfer rows establish a clear non-directional event family.
- FSC official publication corroborates the 2019-04-19 holder/date/amount; secondary market archives supply the trust method and receiving trust account.
- Pre-transfer trust evidence does not solve the monthly actual-holding-change known_at requirement.
- D21-03 remains L2 / 40%.

### Exact next continuation
1. D21-03: recover authoritative monthly holding-change content or another official source allowing a conservative next-day safe bound.
2. D21-04: recover authoritative historical pledge event dates/receipts or switch to an issuer with official pledge event archives.
3. No L4 promotion for any L3 module without OOS/prospective evidence.


## 2026-10-04 D19 Stage 12 — bounded calendar PIT promotion
- `research/d19_12_date_intrinsic_calendar_pit_receipt_20261004_v0_1.json` is the durable receipt.
- D19-12 Seasonality／Calendar Anomalies promotes L2/40 -> L3/60 only for bounded TWSE WEEKDAY and MONTH_OF_YEAR states.
- Existing executable official historical TWSE calendar code/tests plus 2017 physical market-year evidence establish replayable date-intrinsic state feasibility; outcomes remain closed.
- Holiday/pre-holiday/post-holiday/turn-of-month/lunar/settlement-rebalance remain outside the promoted scope until their own historical known-at/vintage semantics are proven.
- D19 aggregate maturity becomes 41.3%; Formal Core unchanged; no optimization candidate.
- Exact next: add an independent historical year under identical date-intrinsic semantics, then separately pursue holiday/turn-of-month source clocks; continue D19-04 research-owned industry/redundancy/cost gates while DATA_LANE owns full-market historical population work.

## 2026-10-04 D06 — IC-062~063 retail proxy validation Stage 1

- Room/domain: 05｜法人與籌碼研究室 / D06.
- D06 maturity remains 47.8%; D06-19 remains L2 / 40%.
- New durable receipt: `research/d06_19_retail_proxy_validation_stage1_20261004_v0_1.json`.
- Outcome gate stayed closed: no return, MFE, MAE, hit-rate or stock-selection data were joined.
- Direct baseline: TWSE annual domestic-individual trading-value share for 2020-2025 = 62.07%, 67.99%, 58.30%, 57.91%, 54.07%, 52.11%.
- Common-frequency proxy comparison:
  - margin-purchase market share correlation with direct retail share = 0.8499; first-difference correlation = 0.7287; annual direction disagreement = 1/5 = 20%.
  - total credit-trading share correlation with direct retail share = 0.8904; first-difference correlation = 0.7047; annual direction disagreement = 2/5 = 40%.
- Interpretation: margin/credit trading is a useful aggregate retail-participation proxy/control, not direct retail flow. Small N and shared secular decline prohibit predictive inference.
- New mandatory proxy-quality split:
  - identity purity;
  - retail-universe coverage.
- Official 2026 TWSE evidence: natural persons exceed 98% of credit trading, while credit trading itself is only around 6% of market trading value -> high purity, narrow coverage.
- Official odd-lot evidence: domestic individuals are 82.5% of intraday odd-lot trading value, while odd-lot trading is around 0.91% of centralized-market value -> high purity, very narrow coverage.
- Frozen falsifications:
  - HIGH_PURITY != HIGH_COVERAGE;
  - margin != direct retail flow;
  - odd-lot != all retail;
  - broker branch remains execution context, not owner identity;
  - market-level retail participation cannot be backfilled into stock-date retail direction.
- D06-19 direct TWSE stock/order investor-type existence remains verified only through restricted historical research access; current authorized PIT/replay contract and TPEx parity remain unverified.
- H12 remains partial pending Room10 D14-19 counterpart and the first live TWSE rate/supply receipt.
- Sunday L3 promotion ceiling remains in force; no maturity inflation.
- `FORMAL_OPTIMIZATION_CANDIDATE: NONE`; Formal Core remains LOCKED.

### Exact next continuation
1. Next valid trading day: capture immutable CORE_CROWDING parent receipts.
2. Capture D06-03 dealer proprietary/hedge split receipt.
3. Capture D06-05 same-generation TDCC lineage.
4. Execute IC-043 TPEx EARLY/LATE paired leverage vintage.
5. Capture D06-14 T_PRELIM then follow T1_REVISED/T2_FINAL.
6. Execute PF-040 units-delta + same-generation PCF.
7. Capture D06-18 TWSE borrow-rate/displayed-supply receipt.
8. Do not reopen D06-19 public data-existence search; special data pursuit requires owner authorization.


## 2026-10-05 D03 — TI-693~700 V8.18 decision-cutoff engineering gate

- Draft PR #600 exact head `f030f04c1a807a23fe19072b96407f1436d09da8`.
- Candidate `8.18.0-decision-cutoff-provenance` adds only the audited cutoff stamp/propagation/header provenance.
- V8 Repair run 37237843589 SUCCESS.
- C1/C2 isolated review run 37237843572 SUCCESS, 100/100; V8.18 delta limited to runAfterMarketScanCore / buildC1PopulationReceipt / selectTomorrowCandidates; Formal impact false.
- V8 Regression run 37237843517 SUCCESS; dedicated cutoff fixture PASS, exact header readback and same-generation cutoff mutation conflict verified.
- No Production deploy; PR remains draft/open/unmerged.
- D03 remains 56.7%; Bollinger/ADX stay L2 until post-deploy genuine parent/continuity evidence.
- Protected next action: explicit owner Production approval for concrete PR #600 merge/deploy.

## 2026-10-05 D06 — IC-065~066 SDA-007 semantic lineage remediation

- Room/domain: 05｜法人與籌碼研究室 / D06.
- Durable contract: `research/d06_sda007_flow_ownership_lineage_contract_20261005_v0_1.json`.
- SDA-007 learning-room semantic remediation is complete: observed flow/ownership is separated from motive; passive/active and mechanical/behavioral interpretations consume shared primitive receipts rather than creating new independent votes.
- Primitive families are frozen across institutional flow, TDCC ownership, index event, ETF primary flow, margin, SBL, lending economics, day trading, broker/branch and direct-retail data.
- Every derived child must reference parentReceiptIds/informationRoot; deterministic transforms have zero additional independent-evidence count until D16 residual incrementality is proven.
- Outcomes remain closed. D06 maturity is unchanged. Formal Core remains LOCKED.
- SDA-007 is NOT closed: System1/System2 machine lineage + D16 common-support/OOS validation + 00 readback remain required.

### Exact next continuation
1. On the next valid trading session execute the pre-registered D06 capture set with primitiveReceiptId/parentReceiptIds.
2. Preserve CORE_CROWDING, dealer split, TDCC lineage, TPEx leverage vintage, TPEx day-trading vintages, ETF units+PCF and TWSE lending-rate/supply receipts.
3. Route the new SDA-007 semantic receipt to engineering/D16 owners; do not change Formal or maturity from governance completion.
4. D06-19 public data-existence search remains closed; special investor-type source access still requires owner authorization.

## 2026-10-05 D06 — IC-067 TDCC prospective parent

- Official TDCC current weekly distribution was captured pre-market for the 2026-10-05 D06 prospective generation.
- New source date = 2026-10-02; previous durable D06 TDCC vintage was 2026-09-24.
- Durable parent receipt: research/d06_tdcc_parent_receipt_20261005_v0_1.json.
- Coverage = 69,326 bracket rows / 4,078 securities.
- Exact grade integrity passed 4,078/4,078 with no missing grades and no reconciliation failures.
- Source fingerprint = fnv1a64-utf8:ad1a265c0a3dcaf8.
- D06-10 existing L3 is strengthened by a genuine prospective parent vintage.
- D06-05 remains L2: same-generation immutable row attachment is still pending; holder identity/passive share remain UNKNOWN.
- No outcomes were joined; no Formal change; no maturity promotion from parent capture alone.

### Exact next continuation
1. After the 2026-10-05 after-market research generation exists, attach primitive receipt D06-20261005-TDCC-WEEKLY plus fingerprint/chipAsOfDate/chipDefinition to the same-generation D06-05/D06-06 rows.
2. Continue the frozen D06-03, TPEx leverage vintages, D06-14 day-trading vintages, PF-040 ETF units+PCF and D06-18 lending-economics lanes only at their actual source clocks.
3. Keep SDA-007 engineering/D16/00 closure pending; learning semantic remediation is complete.


## 2026-10-05 D06 — IC-068 passive-active residual identifiability

- Room/domain: 05｜法人與籌碼研究室 / D06.
- Durable receipt: `research/d06_sda007_passive_active_residual_identifiability_20261005_v0_1.json`.
- New falsifier: investor-class flow minus modeled passive ETF/index exposure is not identified active conviction.
- Taiwan source reason: TWSE institutional data identify actor/desk categories, while ETF creation/redemption mechanics permit multiple fulfillment paths; PCF/units therefore do not prove actual stock execution.
- External evidence reason: fund-flow return relations mix information and price pressure; ETF sampling and market-clearing responses make naive passive-flow subtraction non-identifying.
- Frozen outcome-blind tests: institutional-after-passive; passive-after-institutional; crowding-after-parents; active-conviction identification.
- One primitive can have many consumers but not many independent votes. Statistical residuals retain observational labels.
- Maturity impact: NONE. D06 remains 47.8%; outcomes CLOSED; Formal Core LOCKED.
- Exact next: continue 2026-10-05 actual-clock capture lanes, then route R1-R4 to D16 only after prospective common-support coverage is sufficient. System 1/System 2 still owe machine lineage enforcement; 00 still owns SDA-007 closure.


## 2026-10-05 D06 — IC-069 SBL source-layer decomposition

- Durable receipt: `research/d06_18_public_sbl_source_layer_contract_20261005_v0_1.json`.
- Today's 15:20 live rate/depth slot stays UNKNOWN/MISSING; no backfill.
- Official-source review separates intraday quote book, executed fee/rate, EOD balance and true lendable inventory.
- Public historical transaction/balance replay cannot substitute for live best-five depth; displayed lend quantity cannot substitute for total lendable inventory.
- D06-18 remains L2/40%; no outcomes and no Formal change.
- Exact next: continue authorized live-machine-route discovery for a future date while preserving the frozen 2026-10-05 failure state.


## 2026-10-05 D06 — IC-069~070 TPEx dealer split prospective capture

- Room/domain: 05｜法人與籌碼研究室 / D06.
- Durable parent receipt: `research/d06_03_tpex_dealer_split_capture_20261005_v0_1.json`.
- At 2026-10-05T15:28:58+08:00 the official TPEx institutional stock-level source returned same-date 20261005 data.
- Coverage = 916 rows; 795 ordinary four-digit stocks.
- Source schema fingerprint = fnv1a64-utf8:6ca0bb5edbff5cd3.
- Content hash = fnv1a64-utf8:5bd324cc7136e2ca.
- Dealer proprietary + hedge arithmetic reconciled 916/916; foreign + trust + aggregate dealer reconciled to institutional total 916/916.
- Same-date structural falsification on 795 ordinary stocks: 165 had both dealer desks nonzero; 82/165 = 49.7% had opposite desk signs. Hedge-only activity = 285 stocks versus proprietary-only = 28. Aggregate dealer sign hid an opposing desk in 83 nonzero-aggregate rows.
- Interpretation: aggregate dealerNet materially compresses desk disagreement on this bounded date. This is semantic/structural evidence only; no predictive value, desk motive or return sign is established.
- TWSE was still before its frozen 18:00/20:00 source clocks; pre-clock no-data is PENDING_BY_CLOCK, not failure.
- D06-14 actual day-trading statistics T_PRELIM remains unobserved; DayTradeMark eligibility data are not a substitute.
- D06-05 same-generation TDCC join remains absent; do not attach the 2026-10-02 TDCC parent to a nonexistent 2026-10-05 research generation.
- D06 maturity remains 47.8%; outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
1. At/after TWSE 18:00 and 20:00 clocks capture same-date dealer proprietary/hedge split as a sibling market subreceipt without rewriting the TPEx firstKnownAt.
2. When the 2026-10-05 research generation actually exists, bind the immutable TDCC parent to D06-05/D06-06 same-generation rows.
3. Capture TPEx leverage EARLY 20:30 and LATE 22:30 exactly; no later backfill into EARLY.
4. Capture D06-14 T_PRELIM only from the actual stock-level day-trading statistics object.
5. Append PF-040 only after issuer units/PCF source date advances to 2026-10-05.
6. Keep D06-18 15:20 slot UNKNOWN/MISSING and all outcomes closed.


## 2026-10-05 D06 — IC-071 cross-domain price/volume parent lineage

- Room/domain: 05｜法人與籌碼研究室 / D06.
- Durable contract: `research/d06_core_crowding_crossdomain_parent_lineage_20261005_v0_1.json`.
- D06-06 CORE_CROWDING may consume PRICE_OHLC / VOLUME_TURNOVER only through the exact same-generation D02/canonical shared parent lineage; it may not create a second D06 primitive for the same information.
- Legacy planned id `D06-20261005-LIQUIDITY-PRICEVOLUME` is consumer-alias-only until exact shared parent primitiveReceiptId/hash/firstKnownAt are bound.
- No durable 2026-10-05 same-generation D02/shared price-volume parent receipt was found at freeze time, so D06-06 remains waiting instead of duplicating the parent.
- The price-flow reaction child contributes zero new independent evidence until D16 common-support residual incrementality is proven.
- This is SDA-007 remediation with SDA-001/SDA-003 dependency awareness; Room05 does not claim closure of those tickets.
- D06 maturity remains 47.8%; outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
1. Bind the exact shared 2026-10-05 D02/canonical PRICE_OHLC + VOLUME_TURNOVER parent when it becomes durable.
2. Continue the remaining 2026-10-05 frozen source lanes strictly at their actual clocks: TWSE dealer split, TPEx leverage EARLY/LATE, D06-14 T_PRELIM and PF-040 source refresh.
3. Complete same-generation TDCC attachment to D06-05/D06-06 when the corresponding research generation row exists.
4. Do not increase maturity from lineage governance alone.


## 2026-10-05 D06 — IC-072~073 / PF-041 evening evidence

- Room/domain: 05｜法人與籌碼研究室 / D06.
- TWSE 18:00 public non-block dealer split is now a genuine prospective receipt:
  - `research/d06_03_twse_dealer_split_capture_20261005_1800_v0_1.json`;
  - 1,344 rows / 1,344 numeric-valid;
  - 1,344/1,344 proprietary, hedge, aggregate-dealer and institutional-total arithmetic PASS;
  - 1,088 ordinary four-digit stocks;
  - 351 both dealer desks active; 150/351 = 42.7% opposite signs;
  - aggregate dealer nonzero in 677 rows; 150/677 = 22.2% contain opposing desk flow;
  - content fingerprint fnv1a64-utf8:be22e70f6ec9da3a;
  - schema fingerprint fnv1a64-utf8:334c6531bfaa2963.
- TWSE 20:00 including-block sibling TWTAIUC is official paid/not-authorized; public 18:00 T86 is not substituted.
- TPEx leverage EARLY 20:30 is durably UNKNOWN/MISSING:
  - `research/d06_07_08_09_tpex_leverage_early_20261005_v0_1.json`;
  - official pages/schema reachable, same-date rows unavailable through verified free machine path;
  - no zero imputation and no LATE backfill into EARLY.
- D06-14 T_PRELIM attempt at 20:33 remains variable-workflow pending:
  - `research/d06_14_tpex_daytrade_tprelim_attempt_20261005_v0_1.json`;
  - page reachable, actual same-date stock-level object not yet observed.
- PF-041 establishes D06-16 Taiwan PIT/source feasibility:
  - first decision generation 2026-10-05 was captured twice and stable;
  - second decision generation 2026-10-06 was prospectively captured twice with identical 0050/0056 hashes;
  - 0050 source hash fnv1a64-utf8:c7ae53391ed48cd9; reported unit change +20.5m;
  - 0056 source hash fnv1a64-utf8:07d4527644752dc1; reported unit change +14.5m;
  - cash-substitution and corporate-action guards preserved;
  - actual AP/constituent execution remains UNKNOWN.
- D06-16 promotes L2/40 -> L3/60 for source/PIT feasibility only; D06-11 remains L2.
- D06 aggregate maturity becomes 48.9%; whole 356-module tracker becomes 46.5%.
- D06-06 price/volume parent remains unbound: D02 PVE-241/242 are schema/admission evidence with CLEAN_DATE_ZERO; first genuine canonical receipt is deferred to PVE-243.
- Outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
1. TPEx leverage LATE at 22:30; never rewrite EARLY.
2. Retry D06-14 T_PRELIM later in the evening under its variable publication workflow.
3. Search for a genuine same-generation D06-05/D06-06 row before attaching the existing TDCC parent; no fabricated generation.
4. Wait for D02 PVE-243 genuine prospective canonical PRICE_OHLC/VOLUME_TURNOVER parent before D06-06 binding.
5. D06-16 L4 requires preregistered OOS/Shadow residual incrementality; no performance claim from L3 source readiness.


## 2026-10-05 D06 — IC-075~077 T_PRELIM and shared-parent correction

- Room/domain: 05｜法人與籌碼研究室 / D06.
- D06-14 first genuine TPEx T_PRELIM for trade date 2026-10-05 is now prospectively preserved:
  - receipt: `research/d06_14_tpex_daytrade_tprelim_capture_20261005_2210_v0_1.json`;
  - earlier 20:33:21 and 20:43:06 observations preserved as not-yet-observed;
  - by 22:10:01 same-date rows were visible;
  - empirical publication interval = (20:43:06, 22:10:01] Asia/Taipei, exact provider minute not invented;
  - 841 rows / 841 numeric-valid; 725 ordinary four-digit stocks; 0 duplicate symbols; 12 suspension-flag rows;
  - total day-trading shares 563,183,000;
  - total buy value NTD 139,035,902,050;
  - total sell value NTD 139,484,441,280;
  - canonical normalized-row fingerprint = fnv1a64-utf8:48e8edf2952b9b40.
- 22:15 same-generation re-read is identical under the same canonicalization:
  - `research/d06_14_tpex_daytrade_tprelim_same_day_stability_20261005_v0_1.json`;
  - an intermediate apparent hash mismatch was diagnosed as raw-display-vs-normalized hashing and is NOT a provider revision.
- Revision comparison guard frozen:
  - `research/d06_14_daytrade_revision_comparison_contract_v0_1.json`;
  - union-symbol denominator plus common support;
  - added/removed rows are explicit, missing is not zero, zero-base relative revision fails closed;
  - parser/schema changes must not be mislabeled provider revisions.
- D06-14 remains L2/40%; T+1/T+2 revision lineage remains required. No return/outcome data were read.
- D06-06 continuation was corrected after D02 PVE-243/PVE-244 readback:
  - `research/d06_06_shared_price_volume_parent_reassessment_20261005_v0_1.json`;
  - PVE-243 is genuine one-symbol 2330 / 1d / GENERIC_PROVENANCE_ONLY with informationRoot PRICE_PLUS_VOLUME_DERIVED, not a D06-compatible cross-sectional shared parent;
  - PVE-244 is SOURCE_BLOCKED for a decision-time-valid 15m Wave-1 receipt;
  - D06-06 now waits for compatible population/root lineage rather than a specific PVE number.
- D06-05 same-generation TDCC attachment was re-searched and remains absent; parent receipt stays unjoined.
- D06 maturity remains 48.9%; global tracker remains 46.5% / 356 modules at this readback.
- Outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
1. At 22:30 capture TPEx leverage LATE through the same authorized official source families; EARLY 20:30 remains immutable UNKNOWN/MISSING.
2. On 2026-10-06 capture D06-14 T1_REVISED for tradeDate 2026-10-05 and apply the union/common-support revision contract.
3. On 2026-10-07 capture T2_FINAL and compare T_PRELIM->T2 plus T1->T2.
4. D06-06 waits for a same-generation D06-population-compatible shared PRICE_OHLC/VOLUME_TURNOVER parent with exact lineage; no fixed PVE-number shortcut.
5. D06-05 waits for a genuine same-generation row before TDCC attachment.


## 2026-10-05 D06 — IC-078~079 leverage LATE and universe guard

- Room/domain: 05｜法人與籌碼研究室 / D06.
- TPEx leverage LATE was captured after the preregistered 22:30 target through the same official page families used for EARLY.
- Durable evidence:
  - `research/d06_07_08_09_tpex_leverage_late_20261005_v0_1.json`;
  - `research/d06_07_08_tpex_margin_late_snapshot_20261005_2340_v0_1.csv`;
  - `research/d06_08_09_tpex_sbl_late_snapshot_20261005_2340_v0_1.csv`;
  - `research/d06_07_08_09_tpex_leverage_late_stability_20261005_v0_1.json`;
  - `research/d06_08_09_tpex_margin_sbl_universe_guard_20261005_v0_1.json`.
- Margin table:
  - 918 rows, 918 numeric-valid, 802 ordinary four-digit stocks, no duplicates;
  - financing balance arithmetic 918/918 PASS;
  - margin-short balance arithmetic 918/918 PASS;
  - fingerprint fnv1a64-utf8:d86bcebd6469f4e3.
- SBL table:
  - 931 rows, 931 numeric-valid, 815 ordinary four-digit stocks, no duplicates;
  - margin-short balance arithmetic 931/931 PASS;
  - actual-SBL-short balance arithmetic 931/931 PASS;
  - fingerprint fnv1a64-utf8:e2f21cc9a06e570d.
- Same-evening re-read reproduced both fingerprints exactly.
- EARLY 20:30 remains immutable UNKNOWN/MISSING; no late backfill. Because no numeric EARLY snapshot exists, 2026-10-05 EARLY/LATE revision magnitude is unidentifiable.
- Common-source unit audit:
  - 918 common symbols;
  - previous/sell/buy/cash-repay/current margin-short fields match 918/918 after LOTS x1000 -> SHARES;
  - exact limit x1000 matches only 173/918;
  - floor(shareLimit/1000) equals displayed whole-lot limit on 918/918, proving a display-precision rule rather than source contradiction.
- Universe audit:
  - SBL table has 13 Y/not-credit-qualified rows absent from margin transactions;
  - all 13 have nonzero actual SBL-short balance;
  - 5 have same-day SBL sell;
  - 7 have same-day sell/return/adjustment activity.
- Therefore D06-08 margin-short and D06-09 actual SBL-short require separate denominators; an inner join to the margin-eligible universe would create structural selection bias.
- D06-07/08/09 remain L2/40 because the preregistered source/revision gate is only partially cleared: LATE readiness is proven, paired EARLY/LATE revision is not.
- D06 remains 48.9%; global tracker remains 46.5% / 356 modules at this write.
- SDA-007 remains open; this evidence does not identify motive or create independent votes.
- Outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
1. On 2026-10-06 capture D06-14 T1_REVISED for tradeDate 2026-10-05 under the frozen union/common-support revision contract.
2. On 2026-10-07 capture D06-14 T2_FINAL.
3. On the next genuine trading date repeat TPEx leverage EARLY near 20:30 and LATE near 22:30 using identical source/parser/unit semantics.
4. Keep D06-08 margin-eligible and D06-09 SBL universes separate; never convert margin absence to zero SBL.
5. D06-05 waits for a genuine same-generation TDCC child row.
6. D06-06 waits for a same-generation D06-population-compatible shared PRICE_OHLC/VOLUME_TURNOVER parent with exact lineage.


## 2026-10-06 D06 — IC-080~081 T+1 revision-clock follow-up

- Room/domain: 05｜法人與籌碼研究室 / D06.
- Latest restored D06 maturity at start: 48.9%; global tracker 46.5% / 356 modules.
- D06-14 2026-10-05 T_PRELIM parent remains authoritative:
  - 841 rows;
  - canonical fingerprint fnv1a64-utf8:48e8edf2952b9b40.
- First T+1 calendar-day readback at 2026-10-06T05:42:50+08:00:
  - official TPEx page still displays trade date 2026-10-05;
  - canonical parser = 841 rows / 841 numeric-valid / 725 ordinary four-digit / 0 duplicates;
  - union = 841 / common = 841;
  - unchanged = 841;
  - changed = 0 / added = 0 / removed = 0 / identity conflicts = 0;
  - all absolute revision metrics = 0;
  - fingerprint remains fnv1a64-utf8:48e8edf2952b9b40.
- This is deliberately NOT labeled T1_REVISED:
  - TPEx states T/T+1/T+2 updates occur after broker overall processing and transmission;
  - calendar rollover alone does not prove the T+1 update ran;
  - durable receipt: research/d06_14_tpex_daytrade_t1_calendar_early_readback_20261006_0542_v0_1.json.
- Revision clock guard frozen:
  - research/d06_14_daytrade_revision_clock_guard_v0_1.json;
  - page-query summary estimated 703 rows but canonical table parse returned 841; the summary count is rejected;
  - canonical parser/table controls revision evidence.
- Informative missingness guard frozen:
  - research/d06_14_daytrade_informative_missingness_guard_v0_1.json;
  - TPEx states securities adjusted to non-day-trading state stop appearing in the day-trading report until eligibility returns;
  - official altered-trading-security page exists and states such securities cannot day trade, margin trade or securities-lend;
  - REMOVED_IN_LATER must be cause-classified; removed row is never zero;
  - union/common-support reporting now adds eligibility-censoring / provider-revision / source-coverage / unknown-removal states.
- D06-05 blocker re-audit: no genuine 2026-10-05 after-market same-generation TDCC consumer row found; PREOPEN parent remains unjoined.
- D06-06 blocker re-audit: D02 PVE-245 is a System1 engineering remediation handoff for provenance/bootstrap/session continuity; it does not create a D06-compatible cross-sectional shared price-volume parent.
- SDA-007 readback: learning semantic remediation remains complete, but machine lineage enforcement, prospective one-receipt-many-consumers evidence, D16 residual validation and 00 closure remain pending.
- D06-14 remains L2/40; D06 remains 48.9%; no outcomes; Formal Core locked.
- New follow-up session: research/d06_20261006_revision_followup_session_v0_1.json.

### Exact next continuation
1. Later on 2026-10-06, after the TPEx T+1 reporting workflow is plausibly complete, recapture the 2026-10-05 day-trading table.
2. Apply union-support and common-support revision metrics plus removal/reappearance cause classification.
3. Preserve capturedAt and bounded firstKnownAt; do not invent an exact provider publication minute.
4. Only then append a T1_REVISED vintage.
5. On 2026-10-07 capture T2_FINAL under the provider's explicit finality rule.
6. D06-05, D06-06 and SDA-007 remain fail-closed at their current blockers.


## 2026-10-06 D06 — IC-082~083 date-pinned replay and second prospective date

- Official TPEx day-trading page exposes form input `date` and action `intraday/stat`.
- Date-pinned replay verified:
  - `?date=20261005` -> displayed 2026-10-05 / 841 rows;
  - `?date=2026%2F10%2F05` -> displayed 2026-10-05 / 841 rows.
- Canonical research query is frozen as `?date=YYYYMMDD`.
- This makes T1/T2 historical-date follow-up executable after the default page rolls forward, but does not recreate historical firstKnownAt.
- 2026-10-06 is a genuine trading date.
- At 06:11:31, pinned `?date=20261006` returned a valid page with 0 stock rows:
  - state = NOT_YET_PUBLISHED;
  - missing != zero/no-event/no-flow;
  - durable receipt = `research/d06_14_tpex_daytrade_preopen_20261006_v0_1.json`.
- Full 2026-10-06 prospective D06 session is frozen:
  - `research/d06_20261006_prospective_capture_session_v0_1.json`;
  - D06-18 15:20 live slot;
  - D06-03 after-market dealer split;
  - D06-07/08/09 TPEx 20:30/22:30 vintages;
  - D06-14 pinned current-date T_PRELIM plus pinned prior-date T1_REVISED.
- D02 PVE-246 was re-read: three root causes are certified, but no System1 FIX_IMPLEMENTED/PASS receipt exists; PVE-247 remains pending.
- Therefore D06-06 shared price/volume parent blocker is unchanged.
- D06 maturity remains 48.9%; global maturity remains 46.5% / 356 modules.
- Outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
1. 15:20 D06-18 official live borrow-economics capture.
2. After market D06-03 second-date dealer split.
3. D06-14 later today: pinned 20261005 T1_REVISED plus first actual pinned 20261006 T_PRELIM.
4. 20:30 / 22:30 TPEx leverage paired vintages.
5. Never award independent-date credit to rereads of the already-captured 2026-10-06 ETF decision generation.


## 2026-10-06 D06 — IC-084 live SBL route preflight

- D06-18 prior 2026-10-05 15:20 missing slot remains immutable UNKNOWN/MISSING.
- Official TWSE rendered SBL page is now machine-readable through the authorized retrieval channel.
- Official frontend route contract:
  - selected-security query key = `ch`;
  - `?ch=2330&lang=zhHant` rendered 台積電(2330);
  - page refreshes selected security periodically.
- A deterministic source-route pilot was frozen before the 15:20 observation:
  - selectable four-digit codes observed = 438;
  - pilot filtering excludes code<1101 and 91xx DR range, only for source-route feasibility;
  - five sorted-quantile pilot symbols = 1101 / 2451 / 3532 / 6187 / 9941;
  - all 5 physically matched selected identity and exposed core rate/depth labels.
- Pilot is NOT a representative market sample and carries no alpha inference.
- Frozen field schema:
  - FIXED_RATE: separate 10-day / 3-day / 1-day recall notice;
  - COMPETITIVE_BID: separate recall sections with total execution, displayed lend/borrow, latest execution rate/qty and best-five quote book;
  - NEGOTIATED: separate aggregate transaction family;
  - dash = NULL/source-no-value, not numeric zero.
- Guards remain:
  - displayed lend != total lendable inventory;
  - borrow != short sale;
  - fee/depth != bearish intent;
  - quote-book depth != own execution.
- D06-18 remains L2/40; route uncertainty is narrowed but no genuine 15:20 receipt exists yet.
- D06 remains 48.9%; global tracker remains 46.5% / 356 modules.

### Exact next continuation
1. At 2026-10-06 15:20 ±5m capture exactly 1101/2451/3532/6187/9941 through the verified official rendered route.
2. Preserve selected identity, source date, transaction family, recall condition, rate/depth values, capturedAt, content hash and NULL-vs-zero semantics.
3. If route fails or the slot is missed, record UNKNOWN/MISSING and never backfill later.
4. After market continue the already-frozen D06-03, D06-14 and TPEx leverage clocks.


## 2026-10-06 D06 — post-close SBL query after missed 15:20 slot

- Frozen D06-18 live target was 15:20±5m Asia/Taipei.
- User-triggered execution occurred at 19:10-19:15, after TWSE SBL service hours.
- The live 15:20 slot is therefore preserved as MISSED/UNKNOWN and is never backfilled.
- Durable post-close receipt:
  - `research/d06_18_twse_sbl_postclose_query_20261006_v0_1.json`.
- Frozen pilot routes all matched selected identity:
  - 1101 台泥;
  - 2451 創見;
  - 3532 台勝科;
  - 6187 萬潤;
  - 9941 裕融.
- Fixed-rate and competitive-bid 10/3/1-day sections:
  - totalQty 0 for all five;
  - rate/depth fields rendered as NULL/dash.
- Negotiated section:
  - 1101: 15:01:09.76 / totalQty 7000;
  - 2451: 15:01:32.23 / totalQty 1450;
  - 3532: 11:45:32.02 / totalQty 44;
  - 6187: 14:24:39.33 / totalQty 40;
  - 9941: no matchTime / totalQty 0.
- Security pages did not explicitly expose a source/trade date, so values are not date-certified 2026-10-06 live evidence.
- Negotiated lending quantity is not short-sale volume or bearish intent.
- D06-18 remains L2/40; D06 remains 48.9%.
- Global aggregate recalculated to 46.6% / 356 modules due parallel-room tracker changes; no D06 maturity increase caused this.
- Exact next today:
  1. D06-03 after-market dealer split;
  2. D06-14 pinned 20261005 T1 follow-up + pinned 20261006 T_PRELIM if published;
  3. TPEx leverage EARLY 20:30 / LATE 22:30.


## 2026-10-06 D06 — IC-085~087 evening capture

- D06-03 second prospective temporal date completed.
  - TPEx: 904/904 numeric-valid and arithmetic reconciliation; 70/143 both-active ordinary stocks have opposite proprietary/hedge signs = 49.0%.
  - TWSE: 1,340/1,340 numeric-valid and reconciliation; 152/334 = 45.5% opposite desk signs.
  - Across 2026-10-05 and 2026-10-06, persistent symbol-level disagreement is low: TPEx 26/126 = 20.6% of names with disagreement on either date; TWSE 55/247 = 22.3%.
  - Aggregate dealerNet remains structurally lossy, but one-day desk disagreement is not treated as a persistent symbol alpha state.
- D06-14:
  - 2026-10-05 T1_REVISED captured late T+1: 841/841 unchanged, no added/removed/changed rows, zero revision;
  - 2026-10-06 T_PRELIM captured: 843 rows, 727 ordinary four-digit, 0 duplicates, 13 flags, fingerprint fnv1a64-utf8:21c5de02d6096939;
  - T2_FINAL for 2026-10-05 remains mandatory on 2026-10-07; D06-14 remains L2/40.
- D06-07/08/09 2026-10-06 EARLY captured at 21:25:
  - margin snapshot 918 rows, financing/margin-short 918/918;
  - SBL snapshot 931 rows, margin-short/actual-SBL-short 931/931;
  - cross-source unit audit 918/918;
  - exact same 13 Y/not-credit-qualified SBL-only symbols persist across two dates, all with nonzero SBL-short balance;
  - D06-08 and D06-09 denominator separation is structural, not a one-day anomaly.
- LATE 22:30 remains pending; no D06-07/08/09 promotion yet.
- D06 maturity remains 48.9%; global aggregate 46.6% / 356 modules at this write.
- Outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
After 22:30 capture identical TPEx leverage LATE sources and compare against the frozen 21:25 EARLY snapshots on union/common support. Only then reassess D06-07/08/09 maturity.


## 2026-10-06 D06 — IC-090 paired leverage vintages promote D06-07/08/09 to L3

- Room/domain: 05｜法人與籌碼研究室 / D06.
- Preregistered TPEx leverage passGate required product-specific official semantics plus prospective readiness/revision through an authorized replayable route.
- 2026-10-06 EARLY:
  - captured 21:25:30;
  - margin 918 rows, all financing and margin-short arithmetic pass;
  - SBL 931 rows, all margin-short and actual-SBL-short arithmetic pass.
- PRE_LATE at 22:28:
  - full-row fingerprints already differed from EARLY;
  - frozen core balance/flow fields remained 918/918 and 931/931 unchanged;
  - proved that hash change alone is not an economically relevant revision.
- 2026-10-06 LATE:
  - captured 22:30:34;
  - margin rows 918;
  - SBL rows 931;
  - all arithmetic still passes.
- EARLY -> LATE field-level revision:
  - margin: 0/918 rows changed across all displayed fields;
  - SBL: 1/931 rows changed;
  - only 4527 方土霖:
    - nextBusinessDaySblShortLimitShares 0 -> 7,044;
    - note V -> blank;
    - all current-day SBL prev/sell/return/adjustment/balance fields unchanged.
- Official TPEx note semantics:
  - V = 不得借券交易且無借券餘額停止借券賣出.
- Interpretation:
  - observed later update is a next-business-day eligibility/limit state revision, not a current-day SBL flow revision.
- Timing:
  - later full-row state was first observed by 22:28;
  - first-known bound = (21:25:30, 22:28:06];
  - exact provider update minute remains UNKNOWN.
- Universe:
  - D06-08 margin universe 918;
  - D06-09 SBL universe 931;
  - 13 SBL-only Y rows remain persistent and all retain nonzero SBL balances;
  - denominators remain separate.
- Durable artifacts:
  - research/d06_07_08_tpex_margin_late_snapshot_20261006_2230_v0_1.csv;
  - research/d06_08_09_tpex_sbl_late_snapshot_20261006_2230_v0_1.csv;
  - research/d06_07_08_09_tpex_leverage_late_20261006_v0_1.json;
  - research/d06_07_08_09_tpex_paired_vintage_l3_decision_20261006_v0_1.json.
- Maturity promotions:
  - D06-07 L2/40 -> L3/60;
  - D06-08 L2/40 -> L3/60;
  - D06-09 L2/40 -> L3/60.
- D06 aggregate maturity:
  - 48.9% -> 52.2%.
- Global 356-module maturity:
  - 46.6% -> 46.7%.
- Scope limit:
  - L3 = Taiwan PIT/source/replay feasibility only;
  - no predictive alpha, return, MFE/MAE or Formal evidence.
- Additional same-cycle guards:
  - IC-088 reconfirmed D06-19 direct-retail stock-date directional source gap;
  - IC-089 separated cross-date D06-14 universe drift from same-date revision;
  - SDA-007 remains REMEDIATION_IN_PROGRESS.
- Outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
1. 2026-10-07: capture D06-14 T2_FINAL for tradeDate 2026-10-05.
2. 2026-10-07: capture D06-14 T1_REVISED for tradeDate 2026-10-06.
3. D06-07/08/09: continue multi-date EARLY/LATE revision-frequency stability; L4 requires preregistered OOS/Shadow residual incrementality.
4. D06-05: wait for genuine same-generation TDCC consumer row.
5. D06-06: wait for same-generation D06-population-compatible shared PRICE_OHLC/VOLUME_TURNOVER parent.
6. D06-18: execute a genuine in-slot live SBL receipt on the next valid date; 2026-10-06 15:20 remains MISSED/UNKNOWN.
7. D06-19: continue direct-retail source discovery only; stock-date natural-person direction remains UNKNOWN.
8. SDA-007: wait for System1/System2 machine lineage enforcement, prospective one-receipt-many-consumers evidence, D16 residual validation and independent 00 closure.


## 2026-10-06 D03 — TI-1147~1164 acceleration tranche: ADX/Bollinger external-evidence compression

- Room/domain: 03｜技術指標與趨勢動能研究室 / D03.
- User direction: accelerate learning progress without lowering research depth.
- This tranche does NOT reopen outcome access, does NOT create new indicator families, and does NOT change the five machine blockers frozen at TI-1146.
- Purpose: compress the future validation path for D03-09 ADX and D03-10 Bollinger by resolving the highest-value external-evidence and redundancy questions before machine gates open.

### External evidence readback

1. Shi (2025), Journal of Multinational Financial Management, "Technical indicators and aggregate stock returns: An updated look":
   - 105 technical signals can carry useful forecasting information when high-dimensional shrinkage/regularization is used;
   - the relevant lesson for D03 is NOT "more indicators = more votes";
   - the evidence instead strengthens the requirement to control collinearity/redundancy and to extract incremental information rather than count aliases.

2. Wu (2025), National Sun Yat-sen University, "An Empirical Study on Trading Strategies Combining Bollinger Bands and Technical Indicators: Evidence from Taiwan Listed Stocks":
   - sample covers Taiwan-listed stocks, 2015-2024;
   - Bollinger-based strategies combined with RSI/MACD filters can improve backtest metrics in that design;
   - this is retained as an external challenge case, NOT as proof of independent D03 alpha;
   - D03 must explicitly test whether any gain survives controls for direct returns, RSI/MACD family overlap, volatility state and pattern/trend state.

3. 2026 interpretable market-stress feature study:
   - correlation-based redundancy removal discarded several near-duplicate MA/Bollinger level features before model fitting;
   - Bollinger bandwidth survived as a more distinct volatility/compression descriptor;
   - supports D03's decomposition of Bollinger level/touch from Bollinger bandwidth and its anti-alias treatment.

4. Contemporary volatility modeling literature:
   - Bollinger bandwidth captures close-price dispersion/compression;
   - ATR captures high-low/gap true-range geometry;
   - their non-equivalence is structurally plausible, but complementary information must be tested against direct realized volatility and pattern compression before D03-10 can be promoted as an independent factor.

5. Taiwan Bollinger sign evidence remains asymmetric:
   - Ni et al. (2020), Taiwan 50, reports positive abnormal returns after lower-band events and momentum-compatible behavior at upper-band events in its sample;
   - this continues to reject the folklore rule upper-band=SELL and lower-band=BUY as a universal mapping.

### TI-1147~1153 — D03-09 ADX validation compression

- ADX remains directionless trend-strength information; high ADX can occur in both strong uptrends and strong downtrends.
- The most defensible residual hypothesis is narrowed further:
  1. ADX level must first compete against direct directional efficiency, MA slope/alignment, ret20/ret60, persistence and HH/HL/LH/LL progression.
  2. ADX slope is the only retained secondary transition hypothesis if ADX level is absorbed.
  3. +DI/-DI direction is not allowed to convert ADX into a second trend vote unless residual evidence survives.
- Kill criterion frozen for future evidence review:
  if ADX/ADX-slope adds no stable incremental information after the direct trend-quality controls, D03-09 is explanation/regime-only and receives no independent vote.
- No 20/25/40 threshold search is authorized.

### TI-1154~1161 — D03-10 Bollinger validation compression

- Split the family into:
  - bandwidth/compression;
  - standardized location (%B / MA-distance);
  - touch/event state.
- These three are not allowed to inherit one another's evidence.
- Future residual order is narrowed:
  1. BBW vs realized close volatility;
  2. add ATR/true-range geometry;
  3. add direct range-compression/VCP/Platform geometry;
  4. only then test whether BBW contributes residual information.
- %B/touch must first control MA-distance, direct return/trend, support-resistance/pattern lifecycle and gap/limit-state constraints.
- Upper/lower touch has no universal sign prior.
- Kill criterion frozen:
  if BBW residual collapses after realized-volatility + ATR + pattern compression controls, keep BBW as UI/explanation only; if %B/touch collapses after MA-distance/trend/pattern controls, no independent scoring role.

### TI-1162~1164 — acceleration decision

- This tranche reduces future degrees of freedom rather than adding them.
- It narrows the first post-gate empirical search space and prevents wasting prospective sample on textbook thresholds or multi-indicator majority voting.
- No maturity promotion is awarded because:
  - System2 runtime dedup diagnostics remain missing;
  - System1 explicit D03 redundancy diagnostics remain incomplete;
  - D16 D03 method/incrementality receipt remains absent;
  - raw source gate remains 2/3 and technicalObserverR1 BLOCKED;
  - PR #600 remains draft/open and no genuine cutoff-bearing post-deploy parent exists.
- D03 remains 56.7%; D03-09 and D03-10 remain L2/40; outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation

1. Re-read the five external blockers before each new D03 tranche.
2. If no blocker changes, do NOT add another governance-only document.
3. Highest-value allowed preparatory work is limited to evidence compression:
   - identify direct comparator variables already available in the current parent so the future ADX/Bollinger residual test requires zero unnecessary provider calls;
   - map comparator availability/missingness and continuity semantics outcome-blind;
   - prepare one compact field-level admission matrix for D03-09/D03-10 only if it does not duplicate existing contracts.
4. The first genuine maturity path remains:
   - D03-10 Bollinger first after genuine cutoff-bearing parent + exact 20 eligible-session continuity;
   - D03-09 ADX second after canonical FULL_REPLAY/trusted-state certification.
5. TI-005 KD-vs-RSI and TI-006 MACD-vs-direct-trend remain ahead of ADX/Bollinger for predictive incrementality.


## 2026-10-06 D03 — TI-1165~1172 comparator-availability acceleration

- Durable artifact: `research/D03_ADX_BOLLINGER_COMPARATOR_AVAILABILITY_20261006_V0_1.md`.
- Repository audit confirms the future ADX/Bollinger residual test is primarily a same-parent provenance problem, not a missing-formula or missing-OHLC problem.
- Already-computable/current-system controls include ret5/10/20/60, ATR%, volatility20, MA-distance/structure, gap context and pattern/compression ingredients.
- V8.15.3 C1 projection explicitly persisted atrPercent, ret20, maDistance20Pct and lateStage; richer controls such as ret60, volatility20, rangeCompressionSlope, trueRangeDryUp, VCP/Platform geometry and trendPersistence exist elsewhere but are not yet proven complete under the same immutable C1 generation required by D03.
- Frozen rule: AVAILABLE_IN_REPOSITORY != SAME_PARENT_ADMITTED.
- Frozen zero-new-call rule: do not request new ordinary daily market-provider calls for ADX/Bollinger comparator reconstruction until the existing canonical inputs are proven insufficient.
- No maturity promotion: D03 56.7%; D03-09/D03-10 L2/40; raw gate 2/3; technicalObserverR1 BLOCKED; outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
1. Re-read the five machine blockers.
2. On first genuine cutoff-bearing C1 parent, inventory actual persisted fields from that generation rather than inferring from source code.
3. Bind comparator reuse to generationId + decisionCutoffAt + source/continuity lineage + common support.
4. D03-10 remains first promotion target; D03-09 remains second and additionally needs canonical Wilder FULL_REPLAY/trusted-state certification.


## 2026-10-06 D03 — TI-1173~1182 same-parent admission matrix acceleration

- Durable machine artifact: `research/d03_adx_bollinger_same_parent_admission_matrix_20261006_v0_1.json`.
- Latest-main re-read before this tranche found no change in the five D03 external blockers; the intervening main delta concerned SDA-009 rather than D03.
- Field-level admission is now separated into:
  - SAME_PARENT_PROJECTED;
  - CONDITIONAL_PARENT_ONLY;
  - DERIVABLE_FROM_AUTHORIZED_HISTORY_NOT_PARENT_PERSISTED;
  - RESEARCH_OR_SYSTEM_AVAILABLE_NOT_C1_ADMITTED;
  - REPLAY_CERTIFICATION_REQUIRED;
  - UNKNOWN.
- Confirmed same-parent projected controls from the V8.15.3 C1 projection:
  - atrPercent;
  - ret20;
  - maDistance20Pct;
  - lateStage.
- ret60 and volatility20 are only conditionally persisted through the V8.17 membershipLiquidity path for bounded rejection/liquidity strata; they are NOT promoted to complete same-parent controls for the whole D03 parent population.
- Existing MA slope/alignment, path-efficiency, trendPersistence, HH/HL/LH/LL, rangeCompressionSlope, trueRangeDryUp and VCP/Platform semantics are treated as derivable/repository-available but not same-parent admitted until a genuine immutable generation proves exact binding.
- This prevents a subtle self-deception mode: mistaking source-code feature availability for causal parent availability.
- Zero-new-ordinary-daily-provider-call default remains frozen.
- D03-10 remains the first post-gate promotion target; D03-09 remains second and additionally requires Wilder H/L/C FULL_REPLAY or replay-certified trusted state.
- No maturity promotion: D03 56.7%; D03-09/D03-10 L2/40; raw gate 2/3; observer blocked; outcomes closed; Formal Core locked.

### Exact next continuation
1. Re-read latest main and the five external blockers.
2. On the first genuine cutoff-bearing C1 generation, apply the machine admission matrix to the actual persisted payload.
3. Any field not physically bound to generationId + decisionCutoffAt + source/continuity lineage + common support remains non-admitted.
4. If no external blocker changes, the next allowed acceleration path is to prepare deterministic field-admission acceptance cases against this matrix; do not expand the indicator zoo or invent new thresholds.


## 2026-10-06 D03 — TI-1183~1188 deterministic admission acceptance artifact

- Added `research/test_d03_adx_bollinger_same_parent_admission_matrix_v0_1.mjs`.
- The acceptance artifact enforces:
  - SAME_PARENT_PROJECTED fields still require complete generationId/decisionCutoffAt/sourceLineage/continuityState/commonSupportIdentity;
  - conditional V8.17 ret60/volatility20 cannot be promoted to full-population same-parent controls;
  - repository-only compression/trend fields are rejected as same-parent admitted until physically bound;
  - Wilder replay remains an explicit blocking requirement for D03-09;
  - maturity/raw-source/observer/outcome/Formal states cannot silently change.
- In-session structural assertion replay against the frozen matrix passed.
- Canonical repository Node execution of the new test artifact is still pending; do not mislabel the in-session structural replay as canonical CI.
- No maturity promotion: D03 remains 56.7%; D03-09/D03-10 remain L2/40.

### Exact next continuation
Re-read external blockers. If unchanged, execute the deterministic admission artifact in a canonical repository runner when available; otherwise immediately consume any newly landed genuine C1/D16/System1/System2 receipt through the frozen matrix. No new indicator family or threshold search.


## 2026-10-07 D03 — canonical admission runner evidence

- Canonical GitHub Actions run `37493819432` completed SUCCESS at head `ee3893e6c6c44ff3d845983ec9e9fc8bfdd41cfa`.
- Exact Node execution of `research/test_d03_adx_bollinger_same_parent_admission_matrix_v0_1.mjs` returned PASS with 15 fields, 4 SAME_PARENT_PROJECTED, 2 CONDITIONAL_PARENT_ONLY and 2 REPLAY_CERTIFICATION_REQUIRED.
- Isolation guard also PASS.
- Execution receipt written to `research/d03_adx_bollinger_same_parent_admission_execution_receipt_20261007_v0_1.json`.
- This converts the prior in-session-only structural replay into repository-native execution evidence.
- No market/outcome evidence added; no maturity promotion. D03 remains 56.7%.


## 2026-10-07 D06 — IC-094 00923 official historical rebalance replay

- Room/domain: 05｜法人與籌碼研究室 / D06.
- Durable artifact: `research/d06_11_00923_rebalance_replay_20261002_20261005_v0_1.json`.
- Official issuer historical date control for ETF 00923 successfully replayed both 2026-10-02 and 2026-10-05 fund states without substituting 2026-10-06 current data.
- 2026-10-02:
  - NAV TWD 39,868,035,542;
  - NAV/unit TWD 41.90;
  - outstanding units 951,423,000;
  - unit change 0;
  - deleted review names 2887 / 3533 / 6239 present;
  - added review names 2408 / 2409 / 3189 absent.
- 2026-10-05:
  - NAV TWD 39,893,722,029;
  - NAV/unit TWD 41.93;
  - outstanding units unchanged at 951,423,000;
  - unit change 0;
  - added review names 2408 / 2409 / 3189 present;
  - deleted review names 2887 / 3533 / 6239 absent.
- Falsification:
  - exact constituent rebalance occurred while primary-market unit count stayed unchanged;
  - ETF creation/redemption flow != index-review portfolio rebalance flow;
  - the two objects cannot be counted as independent passive-flow votes by default;
  - zero unit change does not imply zero rebalancing.
- Descriptive AUM×weight exposure only:
  - 2026-10-05 added-name end-state exposure about TWD 933.1m total;
  - 2026-10-02 deleted-name pre-event exposure about TWD 537.1m total;
  - these are not execution values, trade prices, market impact or alpha.
- PIT boundary:
  - historical date replay proves dated end-state observability;
  - exact original publication minute / firstKnownAt and intraday execution path remain UNKNOWN;
  - therefore D06-11 remains L2/40 and D06 remains 52.2%.
- SDA-007 strengthened: one fund portfolio state is one primitive receipt; units/holdings/index-event transforms may have many consumers but cannot manufacture duplicate votes.
- Outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
1. Use the already precommitted 2026-11 official index-review calendar for a genuine prospective D06-11 source-clock capture.
2. On the scheduled after-close public result, capture issuer AUM, outstanding units, unit delta, holdings/weights and exact observedAt/firstKnownAt before and after the effective transition.
3. Preserve any official multi-day transition window; never collapse staged rebalancing into one effective-day shock.
4. If prospective source timing is clean and replayable, reassess D06-11 for L3 Taiwan PIT/source feasibility.
5. In parallel, 2026-10-07 D06-14 still needs T2_FINAL for tradeDate 2026-10-05 and T1_REVISED for tradeDate 2026-10-06 after the relevant source workflow becomes observable.


## 2026-10-07 D06 — IC-095 D06-18 genuine in-slot TWSE live lending receipt

- Room/domain: 05｜法人與籌碼研究室 / D06.
- Durable receipt: `research/d06_18_twse_sbl_live_slot_20261007_v0_1.json`.
- Preregistered 15:20 ±5 minute live slot completed between 15:15:02 and 15:21:05 Asia/Taipei.
- Frozen pilot 1101 / 2451 / 3532 / 6187 / 9941 all matched requested identities and visible page date 2026-10-07.
- Genuine non-null rate example: 3532 台勝科 competitive-bid 3-day recall, match 14:57:19.04, qty 13, latest fee 4.00%, displayed lend/borrow qty 0/0.
- Negotiated totals remained a separate evidence object: 1101=11,234; 2451=211; 3532=12; 6187=0; 9941=0.
- Frozen semantic guards remain: borrow fee != bearish conviction; negotiated lending volume != short-sale volume; displayed zero depth != zero total supply; five-symbol pilot != market representation.
- D06-18 promotes L2/40 -> L3/60 for bounded TWSE borrow-cost/displayed-availability PIT/source feasibility.
- True utilization remains UNKNOWN because verified total lendable inventory is absent. TPEx parity and predictive alpha remain unvalidated.
- D06 aggregate maturity: 52.2% -> 53.3%. Global 356-module maturity remains 46.8% after rounding.
- Cross-room handoff created: `research/D06_18_TO_D20_13_LIVE_RECEIPT_HANDOFF_20261007_V0_1.md`; Room 13 owns any D20-13 reassessment.
- Outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
1. D06-18: accumulate independent in-slot trading dates under the same frozen schema; do not cherry-pick symbols after observing desired fee/depth states.
2. D06-18: true utilization remains UNKNOWN until a verified total-lendable-inventory denominator exists.
3. D06-18 L4 path: preregister OOS/Shadow residual incrementality against D06-09 actual-SBL-short, liquidity, direct price-volume, passive/index flow and market-regime controls.
4. D06-14: later on 2026-10-07, after TPEx T+1/T+2 workflow is plausibly complete, rerun canonical row-level parser for tradeDate 20261005 and 20261006 before assigning T2_FINAL/T1_REVISED.
5. D06-05 remains blocked by `sameGenerationJoin=false`; D06-06 remains blocked by compatible shared price-volume parent.


## 2026-10-07 D06 — IC-096 D06-19 direct-retail source exclusion matrix

- Durable artifact: `research/d06_19_direct_retail_source_exclusion_matrix_20261007_v0_1.json`.
- Current official TWSE/TPEx source surfaces were rescanned for the exact construct: domestic natural-person × stock × date × buy/sell direction.
- No verified public/replayable direct feed was found.
- Broker/branch trading reports are execution-channel data, not beneficial-owner identity.
- Foreign-natural-person aggregate flow has identity but wrong market grain and wrong domestic identity target.
- Foreign-investor stock-level flow has stock/date direction but wrong investor class.
- Historical order/execution product pages do not establish a domestic-natural-person identity field and remain UNVERIFIED rather than assumed usable.
- TPEx natural-person market-share statistics are aggregate context only.
- Personal investor record-query systems are individual access, not a marketwide research source.
- Forbidden substitutions frozen: margin, day trading, odd lot, branch/broker, total-minus-institution residual, market-level natural-person share, foreign-natural-person flow and emerging-stock trade-side labels.
- D06-19 remains L2/40. Negative source evidence strengthens the guard but does not promote maturity.
- D06 overall remains 53.3%; global 356-module maturity remains 46.8%.
- Outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
1. D06-14 remains the next time-dependent lane later on 2026-10-07: canonical row-level T2_FINAL for tradeDate 20261005 and T1_REVISED for tradeDate 20261006 after the TPEx revision workflow is plausibly complete.
2. D06-05 remains blocked: repository has the TDCC parent and preregistered lineage fields, but no genuine 2026-10-05 concentration-consuming research rows; do not fabricate a retrospective same-generation join.
3. D06-19 reopens only on an explicit official/authorized domestic-natural-person stock-date directional field contract.
4. D06-18 remains L3/60; accumulate future in-slot dates but do not inflate maturity from source repetition alone.


## 2026-10-07 Room11 — selection-aware validation chain / T48 governance

- Durable artifacts:
  - `research/D16_D18_SELECTION_AWARE_VALIDATION_CHAIN_20261007_V0_1.md`
  - `research/d16_d18_selection_family_receipt_contract_20261007_v0_1.json`
  - `research/D16_SDA016_T48_CLASSB_PROPOSAL_VALIDATION_20261007_V0_1.md`
- Unified post-selection validation into one hierarchy: genuine prospective > untouched chronological OOS > nested walk-forward > family-level search-adjusted diagnostics > descriptive/in-sample.
- White Reality Check, Hansen SPA, PBO-style and DSR are frozen as distinct diagnostics rather than substitute PASS gates.
- Outer holdout states now distinguish OUTER_UNTOUCHED vs OUTER_CONSUMED and require new forward evidence after post-outcome family expansion.
- D18 search degrees of freedom must preserve full regime/policy family history; winner-only reporting is invalid.
- SDA-016 T48 Class-B proposal was validated as semantically acceptable but not implemented; T48 remains OPEN.
- D16 remains 60%; D18 remains 52%; global tracker 46.8%; no maturity inflation.
- Economic outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
1. Validate T48 implementation/first genuine receipt if owner-authorized implementation lands.
2. Bind finalized C1 generation-set digest into SelectionFamilyReceipt/holdout-use identity.
3. Switch immediately to System2 physical Stage-1 / SDA022 / NC-T01 / genuine Formal-C1 evidence if any lands first.
4. Otherwise continue the next genuine System1 quality-acquisition episode and the 2026-10-08 00:10 opportunity reconciliation.


## 2026-10-07 D06 — IC-096~097 direct-retail source exclusions + D06-14 L3 revision-chain completion

- Room/domain: 05｜法人與籌碼研究室 / D06.
- IC-096 durable artifact: `research/d06_19_direct_retail_source_exclusion_matrix_20261007_v0_1.json`.
- D06-19 current official TWSE/TPEx source rescan found no verified domestic-natural-person × stock × date × buy/sell directional feed.
- Explicitly rejected as direct-retail substitutes: margin, day trading, odd lot, broker/branch flow, total-minus-institution residual, market-level natural-person share, foreign-natural-person flow and emerging-stock trade-side labels.
- D06-19 remains L2/40; negative source evidence strengthens the fail-closed boundary but does not increase maturity.
- D06-05 same-generation TDCC blocker was re-audited. The immutable parent `D06-20261005-TDCC-WEEKLY` exists with 4,078/4,078 reconciliation, but repository search still found no genuine 2026-10-05 concentration-consuming research rows carrying the required parent lineage. `sameGenerationJoin=false` remains correct; retrospective row fabrication is prohibited.

### D06-14 revision-chain completion

Durable receipts:
- `research/d06_14_tpex_daytrade_t2_final_20261005_captured_20261007_v0_1.json`;
- `research/d06_14_tpex_daytrade_t1_revised_20261006_captured_20261007_v0_1.json`;
- `research/d06_14_daytrade_l3_decision_20261007_v0_1.json`.

2026-10-05 complete same-trade-date chain:
- T_PRELIM 841 rows;
- T1_REVISED 841 rows;
- T2_FINAL 841 rows;
- 0 changed / 0 added / 0 removed rows;
- totals unchanged at 563,183,000 day-trade shares / TWD 139,035,902,050 buy / TWD 139,484,441,280 sell;
- canonical fingerprint remains `fnv1a64-utf8:48e8edf2952b9b40`.

2026-10-06 second-date replication:
- T_PRELIM 843 rows;
- T1_REVISED 843 rows;
- 0 changed / 0 added / 0 removed rows;
- totals unchanged at 530,117,000 shares / TWD 136,109,936,790 buy / TWD 136,525,764,410 sell;
- canonical fingerprint remains `fnv1a64-utf8:21c5de02d6096939`.

Parser authority:
- earlier extraction-layer 251/400 row counts are rejected;
- official fully rendered tables and official CSV both resolve to 841/843 rows;
- current official CSV was compared symbol-by-symbol and field-by-field against immutable T_PRELIM JSON receipts.

Maturity:
- D06-14 L2/40 -> L3/60 for Taiwan source/PIT/replay feasibility only;
- D06 aggregate 53.3% -> 54.4%;
- global 356-module tracker 46.8% -> 46.9%.
- No predictive alpha, retail identity, motive, overnight-inventory or standalone day-trading score claim follows.
- The 60% surveillance condition remains forbidden as an alpha threshold.
- Outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
1. On 2026-10-08 capture D06-14 T2_FINAL for tradeDate 2026-10-06; preserve the full append-only chain, but do not award more maturity merely for source replication.
2. D06-14 L4 requires preregistered OOS/Shadow residual incrementality on common support against liquidity, direct price-volume, institutional flow, leverage/shorting, passive/index flow and market regime with date-clustered inference.
3. D06-05 remains blocked by absence of genuine same-generation concentration-consuming research rows; do not fabricate a retrospective join.
4. D06-19 remains UNKNOWN for direct domestic retail direction until an explicit official/authorized stock-date investor-identity field contract exists.
5. D06-18 remains L3/60; future in-slot dates are replication, not automatic maturity increases.


## 2026-10-07 D06 — IC-098 D06-05 fresh same-generation ownership lineage

- Durable artifacts:
  - `research/d06_05_tdcc_same_generation_lineage_20261007_v0_1.json`;
  - `research/d06_05_tdcc_weekly_change_falsification_20260924_20261002_v0_1.json`;
  - `research/d06_05_ownership_l3_decision_20261007_v0_1.json`.
- Historical 2026-10-05 join remains immutable false; no retrospective reconstruction was performed.
- New outcome-blind generation `D06-20261007-TDCC-OWNERSHIP-LINEAGE-R1` binds 4,078 parsed concentration rows to official parent `D06-20261005-TDCC-WEEKLY`.
- Transport mirror raw bytes reproduce official parent fingerprint `fnv1a64-utf8:ad1a265c0a3dcaf8` exactly after BOM normalization; mirror authority remains false.
- Source integrity: 69,326 bracket rows / 4,078 securities / 4,078 reconciliation PASS / 0 missing grade sets.
- Child row-set hash `fnv1a64-utf8:e48be87cc678e625` recomputes exactly on GitHub readback.
- Weekly 2026-09-24 -> 2026-10-02 common support: 4,056 securities; ordinary four-digit common support 2,962. Ordinary 400+ concentration increase/decrease/unchanged = 956/873/1,133; median abs delta 0.02pp, p90 0.63pp, p99 3.26pp.
- Large weekly deltas remain economically ambiguous until capital/corporate-action/denominator continuity is controlled.
- D06-05 promotes L2/40 -> L3/60 for identity-agnostic large-holder ownership concentration source/PIT/replay feasibility only.
- Holder identity/passive share/active-institution share/motive remain UNKNOWN.
- D06 aggregate 54.4% -> 55.6%; global 356-module tracker remains 46.9% after rounding.
- Outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
1. Continue D06-15 public-bank proxy source-contract work: freeze official eight-bank policy set separately from broker execution proxy membership and current code mapping.
2. D06-05 waits for the next genuinely new TDCC sourceDate; repeated use of the 2026-10-02 vintage earns no additional evidence count or maturity.
3. Before D06-05 L4, freeze corporate-action/capital/denominator continuity and preregister vintage-clustered OOS/Shadow residual incrementality.
4. D06-11 remains prospective-November-clock gated; D06-13 remains full-universe authorization/cost gated; D06-19 remains direct domestic-natural-person source gated.


## 2026-10-07 D06 — IC-099 public-bank proxy source contract deepening

- Durable artifacts:
  - `research/d06_15_public_bank_proxy_source_contract_20261007_v0_1.json`;
  - `research/d06_15_l3_promotion_review_20261007_v0_1.json`.
- Official eight-public-bank set frozen separately from the broader public-financial-institution universe.
- Current TWSE 2026-10-07 broker mapping: 8 head offices + 151 active branches = 159 current execution identifiers across the eight public-bank-affiliated broker families.
- Fixed three-character prefix aggregation is falsified: Hua Nan Yong Chang current branch codes span 930x through 939x.
- Membership rule is now a dated explicit TWSE active-code set with versioning; FinMind free trader master is history/context only because it can retain closed or non-branch/self identifiers.
- TWSE broker-security buy/sell combines brokerage customer flow and proprietary activity; beneficial owner is not identified.
- FinMind Sponsor dataset `TaiwanStockGovernmentBankBuySell` has documented one-day replay, fields, date range, update schedule and missing-date contract.
- Direct no-credential probe correctly returned free-level access denial; no real government-bank rows were obtained.
- D06-15 remains L2/40. Source-contract ambiguity is largely resolved, but L3 still requires one legally authorized real provider receipt, actual firstKnownAt and provider-vs-underlying aggregation cross-check.
- Government-fund identity, policy/stabilization motive and bank-proprietary ownership remain UNKNOWN.
- Outcomes CLOSED; Formal Core LOCKED.

### Exact next continuation
1. D06-15: on a valid future trading date, obtain one legally authorized Sponsor receipt and run the frozen membership/clock/aggregation audit outcome-blind.
2. D06-11 remains the 2026-11 prospective review-clock lane.
3. D06-13 remains complete-universe authorization/cost gated.
4. D06-19 remains direct domestic-natural-person stock-date directional-source gated.
5. D06-05 remains at L3 and waits for a genuinely new TDCC sourceDate; repeated 2026-10-02 consumption earns no new evidence count.


## 2026-10-07 D06 — IC-100

D06-05 corporate-action / denominator guard completed. Durable artifacts: `research/d06_05_ownership_denominator_corporate_action_guard_v0_1.json`, `research/d06_05_weekly_pair_clean_support_audit_20260924_20261002_v0_1.json`, `research/d06_05_corporate_action_source_registry_v0_1.json`. D06-05 remains L3/60; outcomes remain closed. Exact next: build one complete replayable TWSE+TPEx corporate-action mask for a TDCC pair, join security-identity continuity, freeze event-clean exact-denominator support, then preregister clustered out-of-sample validation.


## 2026-10-07 D06 — IC-101 bounded TDCC pair event mask

- New artifact: `research/d06_05_pair_corporate_action_mask_20260924_20261002_v0_1.json`.
- Pair: 2026-09-24 -> 2026-10-02.
- Known hard masks: 1235, 1441, 2323, 2601, 4806, 6550.
- 2601/4806 already fail denominator continuity; 1235/1441/2323/6550 prove stable denominator does not imply event-clean.
- 2,962 ordinary common support -> 2,783 exact-denominator-stable -> 2,779 upper bound after currently known stable-denominator hard masks.
- 2,779 is NOT final clean N because exact TPEx ex-right/dividend and identity-transition pair rows are not yet materialized.
- System2 shared source lanes are physically validated, but lane-level totals cannot substitute for exact pair-row persistence.
- D06-05 stays L3/60; outcomes remain closed.
- Exact next: materialize the exact pair event list from the validated shared archive, freeze event-clean common-support row set + hash, then preregister vintage-clustered OOS/Shadow validation.


## 2026-10-07 D06 — IC-101
D06-05 first bounded pair corporate-action mask stored at `research/d06_05_pair_corporate_action_mask_20260924_20261002_v0_1.json`. Pair 2026-09-24→2026-10-02: known hard masks 1235/1441/2323/2601/4806/6550; exact-denominator support 2783 falls to an upper bound 2779 after currently materialized stable-denominator event masks. This is not final clean N because exact-pair TPEx ex-right/dividend and identity-transition rows are not yet materialized. D06-05 stays L3/60 and outcomes remain closed. Exact next: materialize full shared exact-pair event rows, freeze final event-clean row-set hash, then preregister vintage-clustered OOS/Shadow validation.
