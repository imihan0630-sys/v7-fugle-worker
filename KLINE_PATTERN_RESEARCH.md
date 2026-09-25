# K-line Pattern Research

Updated: 2026-09-25 Asia/Taipei

> Durable research log for K-line / chart-pattern learning. Research and Shadow only. Formal Core remains locked unless the owner later approves a specific production change.

## DL-002 — Pattern Maturity / Multi-stage K-line Structure

### Research question
Can explicit multi-stage chart morphology add incremental selection value beyond the current Formal A/B structure, especially by identifying high-quality setups that are still maturing before a classic breakout or pullback-entry condition becomes fully eligible?

### Evidence retained
- Lo, Mamaysky & Wang (Journal of Finance, 2000): chart patterns can be converted from subjective visual ideas into systematic pattern-recognition rules; several patterns such as double-bottoms carried incremental information in a large U.S. sample. Use this as evidence that morphology is researchable, not as proof that every named pattern works.
- Lu (Pacific-Basin Finance Journal, 2014): Taiwan stock daily OHLC data from 1992-2009 found four single-line candlestick patterns profitable after transaction costs, bootstrap, out-of-sample and sub-sample checks. Trend context matters and many candlestick patterns did not work.
- Lu, Shiu & Liu (Review of Financial Economics, 2012): on Taiwan 50 components, Piercing, Bullish Engulfing and Bullish Harami were the profitable bullish two-day reversal patterns in the tested sample; bearish reversals were weaker. Transaction costs and robustness checks were included. Pattern profitability still depends on trend definition and holding strategy.
- Wang & Chan (Expert Systems with Applications, 2007): bull-flag template matching was tested on NASDAQ and Taiwan Weighted Index, supporting formalization of continuation geometry.
- Fidelity Cup-with-Handle guidance: prior advance, rounded cup, right-side recovery, handle near upper half, limited handle retracement, handle volume dry-up, and increased breakout volume are measurable morphology components. Cup duration is commonly multi-week to multi-month, so a 20-day-only resistance view can be too local.
- Fidelity Double-Bottom guidance: two troughs alone are not confirmation; the middle peak/neckline must be broken.
- Sakata Five Methods are retained as a historical taxonomy (Three Mountains, Three Rivers, Three Gaps, Three Soldiers, Three Methods), but should be decomposed into measurable OHLC/sequence features rather than treated as standalone truth.

### Current-system comparison
Current Formal already uses meaningful K-line structure:
- MA20/MA60 trend and bullish stack
- priorHigh20 and recent highs
- pullbackPct and supportDistancePct
- volumeTodayVsPrev5 and 5-to-20-day volume contraction
- daily close position and upper-shadow ratio
- ATR / volatility
- ret20 / late-stage checks
- A pullback and B breakout gates

The likely incremental gap is topology and lifecycle:
- no explicit swing-leg segmentation
- no contraction sequence/count
- no base duration
- no cup roundness or rim symmetry
- no handle location/depth
- no neckline topology
- no flag pole/channel geometry
- no explicit pre-breakout maturity state
- no continuous pattern-fit confidence
- no failed-pattern lifecycle

### Pattern maturity lifecycle
Use a generic state machine:
FORMING -> STRUCTURE_VALID -> MATURE_PRE_BREAKOUT -> PIVOT_READY -> BREAKOUT_CONFIRMED -> RETEST_CONFIRMING -> FAILED

Central hypothesis: a continuous maturity state may preserve useful information that a binary A/B pass/fail gate loses.

## DL-002 feature families

### VCP / progressive contraction
Research fields:
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
- trendContext

Important rule: use non-overlapping swing legs. Overlapping rolling windows such as 5d/10d/20d can mechanically appear to shrink and create false VCPs.

### Cup / Cup-with-Handle
Research fields:
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

Lifecycle:
CUP_FORMING -> RIGHT_SIDE_RECOVERY -> HANDLE_FORMING -> HANDLE_TIGHT -> PIVOT_READY -> BREAKOUT_CONFIRMED -> FAILED

### Double-bottom / W-bottom
Research fields:
- leftLow / rightLow
- troughSimilarityPct
- bottomSpacingDays
- necklinePrice
- necklineHeightPct
- rightLowVsLeftLowPct
- secondBottomVolumeRatio
- undercutAndReclaim
- reclaimSpeedDays
- necklineBreakoutVolumeRatio

Do not assume “right foot higher” is automatically superior. Test separately:
A. right low higher than left
B. approximately equal lows
C. slight undercut followed by rapid reclaim

### Flag / Pennant / Platform
Research fields:
- poleReturnPct
- poleDurationDays
- consolidationDepthPct
- consolidationDurationDays
- channelSlope
- rangeCompressionSlope
- volumeDryUpSlope
- distanceToPriorHighPct
- breakoutVolumeRatio
- trendContext
- failedBreakoutWithin3D / within5D

### Candlestick / Sakata-derived sequence features
Use as contextual confirmation, not standalone strategies:
- real-body size normalized by ATR
- upper/lower wick ratio
- body overlap / engulfing ratio
- gap size
- close position
- sequence direction count
- volume confirmation
- prior trend state
- location versus support/resistance

Taiwan-specific first priorities: Piercing, Bullish Engulfing, Bullish Harami. This is a research priority only, not a claim that their historical edge persists in 2026.

## DL-002A — Repaint-safe Swing Segmentation

### Why this is foundational
VCP, W-bottom, cup/handle, flags and neckline structures all depend on local highs/lows. A conventional ZigZag can relocate the latest pivot after future prices arrive. A historical backtest that treats the final pivot date as though the pivot was known at that date leaks future information.

### Research rule
Every swing point must store:
- pivotAt: bar where the local extreme occurred
- confirmedAt: first later bar where the reversal rule made that pivot knowable

At decision date t:
- use a confirmed swing only if confirmedAt <= t
- never backdate information to pivotAt
- last forming leg can be PROVISIONAL but cannot be treated as confirmed historical structure

### Method direction
Directional-change research supports event-based swing confirmation after price reverses from an extremum by a pre-specified threshold. Recent trend-structure work also distinguishes event occurrence from confirmation. Practical ZigZag documentation explicitly warns that the latest pivot can redraw until confirmed.

Preferred first research design:
- use volatility/ATR-normalized directional-change segmentation instead of one fixed percentage across all stocks
- pre-register a small multi-scale family (MICRO / BASE / MAJOR)
- do not optimize the thresholds on future returns
- pattern detectors consume confirmed swing hierarchies, not arbitrary overlapping windows

### Additional current-system gap
Current B qualification is mainly anchored to priorHigh20, while longer resistance information exists elsewhere. Cup-with-handle and W-bottom structures can span far beyond 20 sessions. Therefore a 20-day breakout may be only a local breakout below an older rim/neckline, and a mature long base may be poorly described by the 20-day window.

Research comparison:
- priorHigh20
- priorHigh60
- swing-derived 40/60/120-day structural resistance
- pattern-specific rim/neckline/pivot

Do not replace priorHigh20 automatically; measure the incremental value first.

### Pattern-state integrity fields
Every detected pattern should store:
- patternFamily
- state
- stateAsOf
- pivot/reference levels known as of stateAsOf
- source swings with pivotAt + confirmedAt
- provisionalLegUsed
- noLookaheadVerified

A later successful breakout must never upgrade an earlier historical date after the fact.

## Bias / overfit controls
- Freeze definitions before inspecting future outcomes.
- Pattern state at date t uses only bars known through t.
- Pre-breakout maturity and post-breakout confirmation are distinct labels.
- No historical Shadow fabrication.
- Use walk-forward / non-overlapping out-of-sample blocks and date-clustered evaluation.
- Compare within the same scan date where possible; control for market regime, liquidity, price tier and sector.
- Evaluate incremental value after controlling for current Formal features rather than raw standalone win rate.
- Correct for multiple pattern tests / Factor Zoo risk.
- Include transaction costs and slippage in trading-rule experiments.
- Keep Selection Alpha separate from Execution Alpha.

## Validation design
Cohorts:
- Formal SELECTED
- Near-miss
- Rejected / Control

Outcomes:
- D1 / D3 / D5 / D10
- MFE / MAE
- stop-first rate
- breakout failure within 3D / 5D
- time-to-pivot / time-to-entry
- entry-zone reach
- zero-pick / capital-utilization impact for Shadow supplement only

Core comparisons:
1. Pattern-strong Near-miss vs pattern-weak Near-miss on same date.
2. Pattern-strong Rejected vs matched rejected controls.
3. Formal SELECTED with high pattern maturity vs without it.
4. Incremental effect after controlling ret20, ATR, volume contraction, breakout quality, support distance, Residual RS, overheat and DL-001 Information Discreteness.
5. Regime splits.

## Status
WORTH_SHADOW_RESEARCH.
No Formal Core, ranking, thresholds, capital, execution, monitoring or push change is approved or implied.

## Exact next continuation point
1. Compare directional-change segmentation versus fixed-window local-extrema segmentation for stability and confirmation lag.
2. Pre-register a small ATR-normalized multi-scale swing family; do not tune thresholds to outcomes.
3. Define VCP on non-overlapping confirmed swing legs and use a confidence score, not a single binary rule.
4. Define cup/handle topology on multi-month horizons and compare its rim/pivot with priorHigh20/priorHigh60.
5. Define W-bottom neckline lifecycle and the three right-low variants.
6. Quantify Taiwan candlestick formulas for Piercing, Bullish Engulfing and Bullish Harami after trend/ATR/volume normalization.
7. Map all DL-002 features against current Formal features and remove redundant variables before any coding proposal.
8. Freeze definitions, then validate same-date SELECTED / Near-miss / Rejected with D1/D3/D5/D10, MFE/MAE, stop-first and failure rates.


## DL-002B — Data Readiness Audit for Pattern Research

### Production history-cache limitation discovered
Current Worker historical warmup requests Fugle daily candles with fields including open/high/low/close/volume/turnover/change, but the mapping written into the D1 history cache keeps only:
- date
- close
- high
- low
- volumeShares
- tradeValue

The historical open is discarded.

Implication:
- current Formal can still use close/high/low/volume structure,
- but historical body/gap patterns such as Engulfing, Piercing, Harami, Morning Star and many Sakata-derived sequences cannot be reconstructed correctly from the current cache,
- therefore no candlestick-pattern backtest should fake or infer missing opens.

### History horizon limitation
Current constants use roughly 120 calendar days of warmup and persist the latest ~65 market-state bars per symbol.
This is sufficient for the current 20/60-day Formal structure but can be insufficient for:
- 1-6 month cup-with-handle bases,
- long W/double-bottom spacing,
- multi-stage major-base segmentation,
- long pattern-failure/recovery studies.

The research layer should therefore use a separate longer as-of-date cache rather than silently stretching the live Formal cache.

### Fugle source capability
Fugle historical candles support:
- open/high/low/close/volume
- adjusted=true for restored/adjusted daily/weekly/monthly price series
- ranges up to less than one year per request

Therefore the source can support a longer, adjusted pattern-research dataset without changing the trading logic.

### Corporate-action / adjustment risk
The current production historical-candle request does not specify adjusted=true.
Fugle documentation notes that daily change on ex-right/ex-dividend dates uses an adjusted previous-close basis, while adjusted=true returns an adjusted price series.

For pattern research this creates a critical distinction:
- raw prices are needed for actual tradable price levels and current execution plans,
- adjusted prices are preferable for multi-month topology, returns and gap/shape continuity across corporate actions,
- ex-right/ex-dividend events must not be mistaken for Sakata gaps, breakdowns or new swing legs.

Preferred research data design:
1. RAW_OHLC: executable nominal prices.
2. ADJUSTED_OHLC: morphology/return series for long pattern detection.
3. CORPORATE_ACTION_TAG: ex-right/ex-dividend/capital-event flag where available.
4. Never mix raw pivots with adjusted pivots in one geometry calculation.

### Daily OHLC path ambiguity
Daily high and low do not reveal intraday ordering. A bar can contain both a high and a low that cross a swing threshold, but OHLC alone cannot tell which occurred first.
For repaint-safe daily swing segmentation:
- prefer close-confirmed directional changes for confirmation chronology,
- retain high/low to locate the extreme inside the confirmed leg,
- if high/low-based confirmation is tested, require a rule that avoids same-bar ordering assumptions.

### Research cache proposal (not implementation approval)
A separate Pattern Research cache should retain at minimum:
- date
- rawOpen/rawHigh/rawLow/rawClose
- adjustedOpen/adjustedHigh/adjustedLow/adjustedClose
- volume / turnover
- corporateActionTag
- source / fetchedAt
- enough history for multi-month bases (target horizon to be pre-registered before outcome testing)

This is data infrastructure for research only. No Formal/Core/monitor/push behavior changes are approved.

### New blocking conditions
- Candlestick research is DATA_BLOCKED until historical open is retained.
- Long cup/major-base research is HORIZON_BLOCKED until the research dataset extends materially beyond the current ~65 bars.
- Gap/Sakata research is ADJUSTMENT_BLOCKED until raw-vs-adjusted corporate-action handling is explicit.



## DL-002C — Redundancy Map Against Current Formal K-line Features

### W-bottom: current system already contains a crude proxy
Current feature builder already computes:
- leftLow = minimum low in an earlier 10-session half-window,
- rightLow = minimum low in a later 10-session half-window,
- rightFootHigher = rightLow > leftLow,
- necklineProximityPct = close / priorHigh20.

Therefore the research must NOT add “right foot higher” as a new independent factor and score it again.

What is still missing:
- proof that leftLow and rightLow are distinct confirmed swing troughs,
- a confirmed intervening swing high between them,
- actual neckline defined from that intervening high,
- bottom spacing and symmetry,
- second-bottom volume behavior,
- undercut-and-reclaim timing,
- neckline breakout lifecycle.

Research hypothesis:
A topology-aware W detector may add information beyond the current split-window proxy, but only if it beats/makes incremental contribution over rightFootHigher + priorHigh20 proximity.

### VCP: substantial gap remains
Current system already has:
- volumeContraction5to20,
- platformRange20Pct,
- ATR / volatility20,
- higher-level trend gates.

Missing:
- sequence of non-overlapping contraction legs,
- monotonic shrinkage of contraction depth,
- duration shrinkage,
- higher-low sequence across confirmed legs,
- per-leg volume dry-up,
- final-tightness state near a pivot.

Therefore VCP research should focus on sequence topology, not create another generic “low volatility” score.

### Cup/handle: partial overlap, major topology gap
Current system already has:
- trend / MA stack,
- pullback depth from a recent high,
- support distance,
- priorHigh20 and priorHigh60,
- volume contraction,
- overheat / late-stage controls.

Missing:
- multi-month bowl geometry,
- left/right rim relationship,
- bottom roundness,
- right-side recovery,
- handle position in upper half of the cup,
- handle-specific depth and volume dry-up,
- cup/handle state lifecycle.

Important: priorHigh60 exists in research features and is used by nearestRealResistance, but the B breakout qualification itself is anchored to priorHigh20. Pattern research should test whether long-base pivots improve description without automatically changing the B gate.

### Candlestick/Sakata: data and redundancy boundaries
Current system can evaluate the latest day’s open/high/low/close features such as close position and upper-shadow ratio, but the historical D1 cache discards open.
Therefore:
- latest-bar body/wick context partly exists,
- historical multi-day candlestick sequences do not exist reliably,
- body/wick features must be checked for redundancy with dailyClosePosition and dailyUpperShadowRatio.

### Formal redundancy test before any Shadow coding
For each proposed pattern feature:
1. classify as EXISTING, DERIVED_FROM_EXISTING, or NEW_TOPOLOGY;
2. reject direct duplicates;
3. for derived features, test whether they explain outcomes after controlling their parent variables;
4. only NEW_TOPOLOGY or genuinely incremental derived features may proceed to Shadow validation.

Initial classification:
- rightFootHigher: EXISTING.
- generic volume contraction: EXISTING.
- 20d platform width: EXISTING.
- VCP contraction sequence: NEW_TOPOLOGY.
- actual W neckline between two confirmed troughs: NEW_TOPOLOGY.
- cup rim symmetry / roundness / handle position: NEW_TOPOLOGY.
- candlestick body/wick ratios: partly DERIVED_FROM_EXISTING, but historical sequence is currently DATA_BLOCKED.
- pattern maturity lifecycle: NEW_TOPOLOGY.



## DL-002D — Alignment with Existing Research Governance

### Do not create R09 yet
The formal research ledger already has frozen R01-R08 experiments and explicit multiple-testing accounting.
DL-002 is still in definition/data-readiness stage. Creating a new numbered experiment before the feature definitions are frozen would unnecessarily enlarge the Factor Zoo.

Decision:
- keep DL-002 as a deep-learning / pattern-research lane,
- do not register R09 yet,
- only propose a new frozen experiment after data blockers are solved, definitions are pre-registered, and redundancy mapping is complete.

### Reuse existing outcome definitions where possible
Existing research already defines:
- success vs failed breakout by whether the fixed breakout benchmark remains held on future closes over the frozen 3-day rule,
- D1/D3/D5/D10/D20 outcomes,
- MFE / MAE,
- stop/target ordering with AMBIGUOUS_SAME_DAY when intraday order is unknowable,
- Selection Alpha vs Execution Alpha.

Pattern research should reuse those outcomes instead of inventing new “pattern success” labels.

Pattern-specific additions may be descriptive only:
- maturity reached or not,
- pivot reached or not,
- breakout confirmed or not,
- retest confirmed or not,
- state transition timing.

For breakout families, R01’s frozen failed-close outcome remains the common falsification metric.

### Reuse existing cohorts
Shadow Candidate Archive already preserves:
- SELECTED
- QUALIFIED_NOT_SELECTED
- NEAR_MISS
- REJECTED_AFTER_BASE
- BROAD_CONTROL

DL-002 should attach as-of-date pattern diagnostics to these existing cohorts rather than creating a selectively curated “pretty chart” sample.

### Maturity gate
Any later claim that a pattern feature deserves a Formal review must still satisfy the existing research maturity gate:
- enough mature D5 samples,
- prospective complete snapshots,
- independent scan dates,
- multiple years,
- multiple market regimes,
- purged holdout,
- training/holdout directional consistency,
- no abnormal coverage or zero-pick deterioration,
- redundancy / transaction-cost / overfit checks.

Therefore a few visually convincing examples are evidence for debugging definitions only, never evidence for promotion.

### Integration principle
DL-002 is intended to answer:
“Does multi-stage price topology add information beyond the current A/B factors?”

It is NOT intended to answer:
“Which named chart pattern looks most attractive after we inspect future winners?”



## DL-002E — Taiwan Market-Regime Portability

### Structural breaks relevant to K-line research
Taiwan market microstructure is not stationary across the historical literature:
- 2015-06-01: TWSE daily stock price fluctuation limit was widened from 7% to 10%.
- 2020-03-23: continuous trading was launched during regular trading hours; before that, the market used periodic call auctions at five-second intervals.

Current Worker has no explicit 2015-06-01 or 2020-03-23 market-mechanism tag in the live Formal feature layer.

### Why this matters for pattern portability
Older Taiwan candlestick studies used samples ending in 2008/2009, entirely before both structural changes.
Therefore historical evidence that Piercing / Bullish Engulfing / Bullish Harami or single-line candlestick patterns were profitable is evidence that these formations are testable in Taiwan, NOT evidence that their return distribution persists unchanged in 2026.

Potential mechanism changes:
- a 7% limit mechanically capped daily body/range and increased limit-hit clustering relative to the current 10% regime;
- continuous trading changed intraday price discovery and order execution compared with periodic call auctions;
- gap, long-body, limit-up/down, breakout-distance and wick distributions can shift when market rules change.

### Research regime tags
Any long-history DL-002 test should carry at least:
- PRICE_LIMIT_REGIME_7PCT: date < 2015-06-01
- PRICE_LIMIT_REGIME_10PCT: date >= 2015-06-01
- MATCHING_REGIME_CALL_AUCTION: date < 2020-03-23
- MATCHING_REGIME_CONTINUOUS: date >= 2020-03-23

For a 2026 decision, primary transportability evidence should emphasize the 10%-limit + continuous-trading regime. Older regimes remain useful for mechanism and robustness, not for pooling blindly.

### Existing research interaction
The broader research system already treats market regime changes as a concern and tracks the 2020 continuous-trading boundary in external evidence work. DL-002 should reuse that discipline and additionally tag the 2015 price-limit break.

### No production implication
These tags are research provenance / stratification only. They do not alter Formal eligibility, scores, monitoring or push behavior.



## DL-002F — Candlestick Evidence Conflict and Pre-registration

### Important evidence conflict
Two Taiwan studies using overlapping pre-2010 eras produce materially different conclusions because their pattern universe and exit design differ.

A. Lu, Shiu & Liu, Review of Financial Economics (2012)
- Taiwan 50 component stocks, 2002-10-29 through 2008-12-31; out-of-sample 2009-01-05 through 2011-10-31.
- Tests three conventional bullish reversal patterns: Piercing, Bullish Engulfing, Bullish Harami, plus bearish counterparts.
- Uses variable holding: enter at the next open after a bullish pattern and hold until an opposite bearish pattern.
- Reports all three bullish reversal patterns profitable in its tested design, especially Piercing.
- Explicitly deletes observations involving ex-right/ex-dividend dates because those events create mechanically adjusted opening gaps.
- Identifies prior trend using monotonic 5-day moving average over six successive dates.

B. Lu & Shiu, Emerging Markets Finance & Trade (2012)
- Taiwan 50 component stocks, 2002-2009.
- Systematically enumerates 24 two-day open/close ordering patterns instead of only practitioner-named patterns.
- Uses fixed 1/5/10-day holding returns.
- Finds that conventional/practitioner patterns are not the robust winners; different four-price-order patterns (notably 1234 in a downtrend and 1324 in an uptrend) carried the strongest evidence after costs/robustness tests.
- Also shows trend context is essential; pooling all market episodes can erase profitability.

### Research interpretation
This is not a contradiction to “resolve” by choosing the prettier result. It is direct evidence that:
- candlestick alpha is specification-sensitive,
- trend definition matters,
- exit/holding rule matters,
- corporate-action handling matters,
- named-pattern taxonomy may be less informative than raw OHLC relational features.

Therefore DL-002 should not pre-select Piercing/Engulfing/Harami as privileged scoring factors merely because one historical Taiwan study reported profits.

### Better research design
Store both:
1. NAMED_PATTERN labels for interpretability.
2. RAW_RELATIONAL_PATTERN encoding for two-day OHLC relationships.

The raw encoding lets the data test morphology without forcing every useful sequence into a traditional name.

For a two-day pattern define normalized inputs:
- O1,C1,H1,L1,V1
- O2,C2,H2,L2,V2
- body1 = abs(C1-O1)
- body2 = abs(C2-O2)
- body1ATR = body1 / ATR20
- body2ATR = body2 / ATR20
- gapOpen = (O2-C1)/C1
- bodyContainment / engulfing ratios
- volumeRatio = V2 / rollingVolumeBaseline
- priorTrendState
- supportResistanceLocation
- priceLimitState
- corporateActionTag

### Conventional bullish formulas for research labels
Require prior downtrend context, then:

Piercing:
- C1 < O1
- C2 > O2
- O2 <= C1
- C2 > C1 + 0.5*(O1-C1)
- C2 < O1 for the strict classic label; if C2 >= O1 classify as Engulfing rather than Piercing.

Bullish Engulfing:
- C1 < O1
- C2 > O2
- O2 <= C1
- C2 >= O1

Bullish Harami:
- C1 < O1
- C2 > O2
- O2 > C1
- C2 < O1
- second real body is inside the first real body.
Research should additionally quantify body1/body2 size instead of relying on vague “long/small” words.

### Trend-context variants
Do not tune one trend definition after seeing outcomes. Pre-register a limited comparison:
- PAPER_MA5_MONOTONIC: six-date monotonic MA5 trend, matching the cited Taiwan studies.
- SYSTEM_TREND: current Formal trend context using MA20/MA60 and structure.
- SWING_TREND: repaint-safe confirmed swing lower-high/lower-low or higher-high/higher-low topology.

Goal: determine whether candlestick information is incremental under the system’s actual trend context, not reproduce an old paper’s exact trading rule.

### Outcome separation
Named candlestick research should first be Selection Alpha / conditional-return research using existing D1/D3/D5/D10 outcomes.
Do not adopt the historical paper’s “hold until opposite candle” as a production exit rule; that would confound pattern quality with a new execution strategy and would be a Formal/Execution change.

### Corporate-action requirement strengthened
The RFE study explicitly removed ex-right/ex-dividend observations because adjusted opens create false gap/reversal appearances. This independently validates DL-002B’s requirement that corporate actions be tagged or adjusted before gap/candlestick research.

### Current status
Candlestick lane remains DATA_BLOCKED for system-wide historical validation until historical OPEN and corporate-action-aware data are available.
Definitions can be frozen now; performance testing must wait for data readiness.



## DL-002G — Evidence Tiers by Pattern Family

### Tier 1 — direct academic evidence that chart topology can contain information
Strongest general evidence:
- Lo, Mamaysky & Wang (Journal of Finance, 2000): automatic, systematic chart-pattern recognition using nonparametric kernel regression; several patterns including double-bottom/head-and-shoulders families showed conditional return distributions different from unconditional returns in U.S. stocks.
- Wang & Chan (Expert Systems with Applications, 2007): bull-flag template matching tested on NASDAQ and Taiwan Weighted Index; better template fit was associated with better average returns, especially in TWI according to the reported results.

Interpretation:
There is credible support for researching topology/shape numerically. It does NOT prove every named chart pattern has alpha.

### Tier 2 — Taiwan-specific candlestick evidence, but specification-sensitive
- Multiple pre-2010 Taiwan studies find some candlestick information.
- Results vary materially by pattern universe, trend definition, entry/exit method and corporate-action treatment.
- This lane deserves testing, but requires strong pre-registration and modern-regime validation.

### Tier 3 — popular practitioner patterns with weaker direct academic validation
Cup-with-handle:
- well-defined in technical-analysis/practitioner literature (prior trend, rounded cup, similar rim highs, shallow handle, breakout),
- but direct peer-reviewed evidence on its standalone expectancy is much thinner than the evidence for generic pattern-recognition methods.
- Use morphology as a research hypothesis, not a presumed profitable rule.

VCP:
- conceptually attractive because sequential volatility contraction + supply dry-up may encode tightening supply,
- but direct academic validation of the named VCP formulation is weak/limited.
- Its strongest justification for our system is mechanistic and incremental: current Formal has generic contraction but not a sequence of shrinking confirmed swing legs.

### Research priority implication
Priority should not equal popularity.
Proposed evidence-weighted order:
1. repaint-safe swing topology / double-bottom / flag-type continuation structures,
2. VCP as a new-topology hypothesis,
3. cup/handle as multi-month morphology hypothesis,
4. candlestick sequences as contextual modifiers after data readiness,
5. Sakata names as interpretability labels, not privileged factors.

### Promotion discipline
A Tier-3 pattern can still become valuable if prospective Taiwan Shadow evidence is strong and incremental.
A Tier-1 pattern can still fail in the current Taiwan regime.
External literature sets prior plausibility; our as-of-date prospective evidence decides whether a pattern deserves later Formal review.



## DL-002H — Pre-registered Swing Segmentation Specification v0.1

### Objective
Create a repaint-safe, volatility-aware swing hierarchy that can feed VCP, W-bottom, cup/handle and flag detectors without using future information.

### Core event logic
Use adjusted CLOSE to confirm directional changes and adjusted HIGH/LOW to describe the extreme inside a leg.

For every confirmed swing store:
- swingType: HIGH or LOW
- pivotAt: date of the extreme
- confirmedAt: first date the opposite close move crossed the leg threshold
- pivotClose
- extremeHigh / extremeLow
- thresholdPct
- thresholdAtrMultiple
- legStartConfirmedAt
- barsInLeg
- amplitudePct
- volumeStats

A swing is usable for an as-of-date pattern only when confirmedAt <= asOfDate.

### Threshold design
Avoid one fixed percentage across all stocks.
Define a lagged volatility unit using information known before the leg:
- atrPctLag = ATR20(as of prior completed date) / priorClose
- freeze the threshold when the new leg begins
- thresholdPct = k * atrPctLag

Pre-register a small scale family rather than optimizing k to future returns:
- MICRO: k = 1
- BASE: k = 2
- MAJOR: k = 3

These are scale definitions, not competing trading rules. Robust topology should ideally persist across adjacent scales. If a pattern only exists at one knife-edge k, mark it LOW_STABILITY rather than choosing that k because its future return is better.

### Up-leg to confirmed swing high
1. Start after a confirmed swing low.
2. Track the highest adjusted high / highest adjusted close observed since leg start.
3. A HIGH pivot candidate is the latest extreme.
4. Confirm the HIGH only when a later adjusted close declines from the running peak by at least the frozen thresholdPct.
5. Record pivotAt at the extreme date and confirmedAt at the first qualifying later close.
6. Begin the down-leg using a new lagged threshold frozen at confirmation.

Mirror the logic for a LOW:
- track running low,
- confirm only after a later adjusted close rises by the frozen threshold.

### Same-day high/low ambiguity
Daily OHLC does not reveal whether the high occurred before the low.
Therefore:
- do not use same-day high/low ordering to confirm a reversal,
- close crossing controls confirmation chronology,
- high/low merely refines the extreme price/location within an already chronological leg.

### Why freeze the threshold within a leg
If a dynamic ATR threshold shrinks during a calm period, a pivot could be confirmed because the threshold moved rather than because price made a sufficiently large reversal.
Freezing the lagged threshold at leg start preserves a stable ex-ante event definition.

### Stability diagnostics
For every proposed pattern calculate:
- scaleAgreement: number of MICRO/BASE/MAJOR scales supporting compatible topology,
- pivotDateDispersionDays,
- keyLevelDispersionPct,
- stateAgreement,
- confirmationLagBars.

Interpretation:
- HIGH_STABILITY: topology survives neighboring scales with similar pivot dates/levels.
- MEDIUM_STABILITY: core structure survives but exact pivots move.
- LOW_STABILITY: exists only at one scale or depends on provisional legs.

No threshold family member is selected by future performance.

### Potential limitation
ATR itself contains gap effects and can be distorted by corporate actions in raw data. The segmentation volatility unit should therefore be computed on the adjusted morphology series with corporate-action handling from DL-002B.

### Literature relation
Directional Change literature commonly defines events by a pre-specified percentage reversal from a running extreme, and explicitly distinguishes the extreme from the later confirmation point. Dynamic-threshold research supports adapting thresholds to market state, but threshold optimization itself creates overfit risk. The v0.1 design uses a simple lagged ATR normalization and fixed 1/2/3 scale family to prioritize robustness over return optimization.



## DL-002I — VCP Detection Specification v0.1

### Goal
Define VCP as a sequence of confirmed, non-overlapping swing contractions rather than a generic low-volatility state.

### Input
Use the repaint-safe swing hierarchy from DL-002H on adjusted OHLC.
Primary scale for base geometry: BASE.
MICRO and MAJOR are stability checks, not separate trading rules.

### Candidate structure
A VCP candidate requires:
1. an established prior advance or at least a non-bearish higher-timeframe structure;
2. at least 2 completed peak-to-trough contraction legs after the prior advance;
3. contraction legs must be chronological and non-overlapping;
4. each contraction has a confirmed swing high and subsequent confirmed swing low;
5. latest structure remains below or near a defined pivot/reference high rather than already far extended.

### Measured fields
For contraction i:
- peakPrice_i
- troughPrice_i
- depthPct_i = (peakPrice_i - troughPrice_i) / peakPrice_i * 100
- durationBars_i
- recoveryPct_i = (nextPeakPrice - troughPrice_i) / (peakPrice_i - troughPrice_i)
- lowVsPriorLowPct_i
- avgVolume_i
- downLegVolume_i
- upLegVolume_i

Aggregate:
- contractionCount
- depthMonotonicity = fraction of adjacent contractions with depth_i+1 < depth_i
- strictDepthSequence = true only if every later depth is smaller
- lowProgressionScore = degree to which successive troughs are higher
- durationCompressionScore
- volumeDryUpSlope
- finalTightnessPct
- finalTightnessATR
- pivotPrice
- pivotDistancePct
- scaleAgreement
- confirmationLagBars

### Do not require perfect monotonicity initially
A real base may contract approximately rather than perfectly.
Therefore v0.1 does NOT define VCP as “every leg must be smaller.”
Instead store:
- strictDepthSequence
- depthMonotonicity
- contractionDepthCV
and evaluate whether partial monotonicity carries incremental information.

This avoids hard-coding an idealized textbook picture before outcome evidence exists.

### Volume logic
Separate three ideas:
1. base-wide volume trend,
2. down-leg selling-volume decay,
3. final-tight-area dry-up.

Do not collapse them into one volume score.

Candidate measures:
- baseVolumeSlope
- downLegVolumeDecay = normalized volume in each successive down leg
- finalDryUpRatio = final-tight-area median volume / earlier-base median volume
- breakoutVolumeRatio, only after breakout

A pre-breakout VCP can be mature without breakoutVolumeRatio because breakout has not happened yet.

### Pivot definition
Primary pivot candidate:
- highest confirmed swing high after the final completed contraction but before the current provisional leg,
or
- the most recent structural resistance shared by the last 2 contraction recoveries.

Store multiple candidate references if ambiguous:
- pivotPrimary
- pivotSecondary
- pivotDispersionPct

If pivot ambiguity is high, lower pattern confidence rather than force one exact price.

### Maturity states
VCP_FORMING:
- one contraction or insufficient confirmed structure.

VCP_VALID:
- at least two non-overlapping contractions, no major structural break.

VCP_MATURE:
- at least two contractions plus positive depthMonotonicity, improving lows and reduced volume/range.

VCP_PIVOT_READY:
- mature structure and current price within a pre-registered proximity band to pivot; proximity threshold to be frozen separately, not tuned on future returns.

VCP_BREAKOUT_CONFIRMED:
- price closes above pivot with existing Formal-style confirmation variables recorded, but breakout confirmation remains descriptive in Shadow.

VCP_FAILED:
- structural low/pattern invalidation breached before valid breakout or post-breakout R01 failure.

### Failure / falsification
Possible failure labels:
- STRUCTURE_BREAK: close below key confirmed trough.
- EXPANSION_FAILURE: later contraction becomes materially wider than earlier structure.
- VOLUME_REEXPANSION: selling volume rises materially through later contraction.
- PREMATURE_EXTENSION: price already too far above pivot before a valid retest/entry framework.
- BREAKOUT_FAILURE_R01: reuse the frozen R01 breakout-failure outcome after breakout.

Do not invent a new profitable/not-profitable label.

### Redundancy controls
Compare VCP fields directly against existing:
- volumeContraction5to20
- platformRange20Pct
- atrPercent
- volatility20
- ret20
- maxDrawdown20Pct
- breakoutQualityResearch
- overheatPenaltyResearch
- DL-001 Information Discreteness

The expected incremental variables are the sequence/topology terms:
- contractionCount
- depthMonotonicity
- lowProgressionScore
- downLegVolumeDecay
- pivot ambiguity/stability
- maturity lifecycle

If these do not explain outcomes beyond existing variables, VCP should be rejected as a redundant relabeling.

### Outcome test order
1. same-date Near-miss: high VCP maturity vs low/no VCP;
2. same-date Rejected-after-base matched controls;
3. Formal SELECTED stratified by VCP maturity;
4. regime split;
5. partial/incremental tests versus existing contraction/volatility factors;
6. only then consider a frozen Shadow experiment.

### Status
DEFINITION_FROZEN_V0_1 once committed.
No Formal rule or threshold is changed.



## DL-002J — Cup-with-Handle Detection Specification v0.1

### External anchors
Fidelity describes Cup-with-Handle as a bullish continuation structure with:
- a prior advance,
- a rounded/bowl-like cup,
- approximately similar highs on the two sides of the cup,
- a handle on the right side,
- handle retracement typically no more than about one-third of the cup advance,
- cup duration commonly about 1-6 months and handle roughly 1-4 weeks,
- increased volume on breakout.

Older Fidelity/ATP practitioner material is more specific, but its numeric ranges (for example cup correction, handle depth and breakout-volume percentages) should be treated as descriptive priors, not hard-coded truths.

Recent financial-time-series pattern-classification research explicitly notes that there is no industry-wide unambiguous definition for many named chart patterns, including Cup-with-Handle. Therefore DL-002 must avoid one brittle textbook rule set.

### Research principle
Do not define Cup-with-Handle by a single binary template.
Represent it as a topology + shape-quality + maturity state.

### Required topology
Using confirmed swings from DL-002H, a cup candidate needs:
1. left rim: confirmed swing high after a prior advance;
2. cup bottom region: one or more confirmed low swings materially below the left rim;
3. right-side recovery: later confirmed swing high approaching the left-rim zone;
4. optional handle: a shallower pullback occurring after right-side recovery and before breakout.

The cup can exist without a completed handle.
The handle cannot exist before right-side recovery.

### Horizon
Primary cup research horizon should support multi-month bases.
Do not constrain the cup to priorHigh20 or the current ~65-bar live cache.
Candidate research window should be capable of covering at least ~6 months of trading days plus context before the left rim.

The exact maximum lookback is a data-design decision and must be pre-registered before outcome testing.

### Cup geometry fields
- leftRimPrice
- leftRimAt
- cupBottomPrice
- cupBottomAt
- rightRimPrice
- rightRimAt
- cupDurationBars
- cupDepthPct = (leftRimPrice - cupBottomPrice) / leftRimPrice * 100
- rightRimRecoveryPct = (rightRimPrice - cupBottomPrice) / (leftRimPrice - cupBottomPrice) * 100
- rimDifferencePct = abs(rightRimPrice-leftRimPrice) / mean(rims) * 100
- leftDeclineBars
- rightRecoveryBars
- timeSymmetryRatio
- priceSymmetryScore
- baseVolumeSlope
- bottomVolumeRatio
- rightSideVolumeRecovery

### Roundness: do not use one fragile U-shape metric
A cup should be distinguishable from a sharp V reversal, but "roundness" is subjective.
Store multiple non-outcome-tuned descriptors instead of one optimized score:

1. bottomResidenceRatio
   - fraction of cup bars spent within a narrow band around the lower portion of the cup range.
   - a true rounded base should usually spend more time near the bottom than a one-day V reversal.

2. curvatureResidual
   - normalize time to [-1,1] and price to [0,1].
   - fit a simple symmetric quadratic / parabola as a descriptive baseline.
   - record normalized residual error; lower error means smoother bowl, but do not assume lower is always better.

3. slopeTransitionSmoothness
   - compare rolling-slope progression from negative -> flat -> positive.
   - abrupt sign reversal indicates V-shape; gradual transition supports rounded morphology.

4. swingCountInsideCup
   - count confirmed MICRO swings inside the BASE-scale cup.
   - one sharp down/up pair is V-like; multiple small oscillations can support a rounded base.

No single roundness descriptor is privileged before validation.

### Handle topology
A handle candidate starts only after right-side recovery.

Fields:
- handleStartAt
- handleStartPrice
- handleLow
- handleEndAt
- handleDurationBars
- handleDepthPct = (handleStartPrice-handleLow)/handleStartPrice*100
- handleDepthVsCupDepth = handleDepthPct / cupDepthPct
- handlePositionPct = normalized vertical position of handle low within cup range
- handleRangeCompression
- handleAtrCompression
- handleVolumeDryUpRatio
- handleHigherLow
- handleDownSlope
- handleSwingCount
- handleStabilityAcrossScales

### Upper-half concept
Practitioner descriptions usually expect the handle to form in the upper part of the cup.
Do not hard-code "upper half = pass".
Store continuous handlePositionPct:
- 0 = cup bottom
- 100 = rim level

Then test whether higher handle placement has incremental value.

### Pivot
Possible pivot references:
- max(leftRimPrice, rightRimPrice),
- handle resistance / most recent confirmed swing high,
- shared resistance zone across rim and handle highs.

Store:
- cupPivotPrimary
- cupPivotSecondary
- pivotDispersionPct
- pivotSource
- pivotDistancePct

If rim and handle resistance disagree materially, reduce pattern confidence rather than forcing one level.

### Maturity lifecycle
CUP_FORMING
- left rim and decline exist but right-side recovery incomplete.

CUP_BOTTOMING
- a bottom region exists with improving stabilization / roundness but no strong right recovery.

RIGHT_SIDE_RECOVERY
- price has recovered materially toward the left rim.

HANDLE_FORMING
- a shallower right-side pullback is occurring after recovery.

HANDLE_TIGHT
- handle range/ATR/volume are contracting while structural support holds.

CUP_PIVOT_READY
- mature handle/right-side structure is near a stable pivot.

CUP_BREAKOUT_CONFIRMED
- close confirms above the selected structural pivot; existing breakout diagnostics recorded.

CUP_FAILED
- structural invalidation before valid breakout or frozen R01 failure after breakout.

### Failure labels
- V_SHAPED_BASE: bottom residence/transition suggests abrupt reversal rather than a rounded base.
- RIGHT_SIDE_WEAK: recovery stalls far below left-rim zone.
- HANDLE_TOO_DEEP: recorded as a severity measure, not hard fail in v0.1.
- HANDLE_LOW_IN_BASE: handle forms too low relative to cup geometry.
- HANDLE_VOLUME_EXPANSION: selling volume rises rather than dries.
- RIM_DIVERGENCE: left/right rim prices are structurally inconsistent.
- STRUCTURE_BREAK: closes below key cup/handle support.
- BREAKOUT_FAILURE_R01: reuse frozen R01 outcome.

### Redundancy map
Existing Formal already captures:
- trend,
- pullback depth,
- volume contraction,
- priorHigh20/priorHigh60,
- ATR/volatility,
- overheat.

Expected new topology:
- cup duration beyond short windows,
- rounded-bottom descriptors,
- rim symmetry / recovery,
- handle location,
- handle-specific compression,
- cup-to-handle nested geometry,
- maturity lifecycle.

If these variables add no information after controlling existing factors, Cup-with-Handle should be classified as a descriptive relabeling, not a new factor.

### Evidence classification
The named Cup-with-Handle pattern has strong practitioner recognition and is algorithmically classifiable, including recent curve-pattern classification research, but direct peer-reviewed evidence of standalone trading alpha is weaker than the evidence that chart morphology in general can carry information.

Therefore status remains:
WORTH_SHADOW_RESEARCH / TIER_3_PRIOR.
No Formal promotion implication.



## DL-002K — Double-Bottom / W-Bottom Detection Specification v0.1

### External anchors
Fidelity technical-analysis material defines a double bottom as:
- two successive troughs,
- separated by an intervening peak,
- troughs usually around a similar support level,
- bullish confirmation only when price breaks above the intervening peak / resistance line.

Bulkowski's practitioner literature similarly emphasizes that an unconfirmed double bottom is not yet a valid reversal pattern; confirmation is more important than exact equality of the troughs.

Lo, Mamaysky & Wang include Double Bottom as one of the chart-pattern classes in systematic nonparametric pattern-recognition research, supporting the researchability of the topology without proving a fixed rule.

### Research principle
The current Formal proxy:
- leftLow = minimum in one fixed subwindow,
- rightLow = minimum in a later fixed subwindow,
- rightFootHigher = rightLow > leftLow,
- necklineProximityPct = close / priorHigh20,
is NOT sufficient to define a true W-bottom.

A topology-aware W requires:
LOW1 -> confirmed intervening HIGH -> LOW2 -> neckline test / breakout.

### Required topology
Using confirmed BASE-scale swings:
1. LOW1: confirmed swing low after a prior decline or damaged structure.
2. MID_HIGH: confirmed swing high occurring after LOW1.
3. LOW2: later confirmed swing low after MID_HIGH.
4. necklinePrice = MID_HIGH structural price.
5. neckline breakout can occur only after LOW2 is confirmed or the current leg is chronologically beyond LOW2.

No fixed window may substitute for the intervening swing high when classifying the actual W topology.

### Prior-trend context
A classic reversal double-bottom should have something to reverse.
Store:
- priorTrendState
- priorDeclinePct
- priorDeclineBars
- priorLowerHighCount
- priorLowerLowCount
- distanceBelowMA20 / MA60 at LOW1

Do not hard-gate prior decline in v0.1 because the same W-like topology can also appear as a continuation/re-accumulation base. Instead classify:
- REVERSAL_W
- CONTINUATION_W
and compare separately.

### Geometry fields
- low1Price / low1At / low1ConfirmedAt
- midHighPrice / midHighAt / midHighConfirmedAt
- low2Price / low2At / low2ConfirmedAt
- troughDifferencePct = (low2Price-low1Price)/low1Price*100
- troughSimilarityAbsPct = abs(troughDifferencePct)
- bottomSpacingBars
- necklinePrice
- necklineHeightPct = (midHighPrice-mean(low1Price,low2Price))/mean(low1Price,low2Price)*100
- low1ToMidHighBars
- midHighToLow2Bars
- timeSymmetryRatio
- rightLegRecoveryPct
- necklineDistancePct
- scaleAgreement
- confirmationLagBars

### Three right-low variants
Do not assume a higher right foot is best.

Variant A — HIGHER_LOW_W
- LOW2 > LOW1 by a positive normalized amount.

Variant B — EQUAL_LOW_W
- LOW2 approximately equals LOW1 inside a tolerance band.

Variant C — UNDERCUT_RECLAIM_W
- LOW2 trades below LOW1,
- later closes back above the LOW1 support zone within a defined reclaim window,
- the undercut/reclaim sequence must be recorded as its own morphology.

Important:
The tolerance and reclaim window must be pre-registered from volatility/ATR semantics before outcome analysis. Do not tune them to maximize return.

### Volume fields
- low1VolumeVs20
- rallyVolumeToMidHigh
- low2VolumeVs20
- low2VsLow1VolumeRatio
- secondBottomSellingDryUp
- reclaimVolumeRatio
- necklineBreakoutVolumeRatio

Hypotheses to test, not assumptions:
- LOW2 with lower selling volume may indicate supply exhaustion.
- Reclaim with stronger volume may strengthen an undercut-reclaim variant.
- Neckline breakout volume may improve confirmation quality.

### Maturity lifecycle
W_FORMING_LOW1
- first confirmed low exists, no intervening high yet.

W_MID_HIGH_CONFIRMED
- LOW1 + MID_HIGH exist.

W_SECOND_TEST_FORMING
- price revisits prior support zone but LOW2 not confirmed.

W_STRUCTURE_VALID
- LOW1 -> MID_HIGH -> LOW2 confirmed.

W_NECKLINE_APPROACH
- valid W and current price recovering toward neckline.

W_BREAKOUT_CONFIRMED
- close above neckline; breakout diagnostics recorded.

W_RETEST_CONFIRMING
- after breakout, price retests neckline/support and holds.

W_FAILED
- structure invalidated before confirmation or R01 breakout failure after confirmation.

### Failure labels
- NO_DISTINCT_MID_HIGH: two lows exist but no meaningful intervening confirmed high.
- SUPPORT_COLLAPSE: LOW2/next decline breaks structure without timely reclaim.
- WEAK_RECOVERY: price repeatedly fails far below neckline.
- NECKLINE_FALSE_BREAK: reuse R01 after breakout.
- TOO_SHALLOW_TO_BE_REVERSAL: descriptive warning when prior decline/neckline height is very small.
- TOO_EXTENDED_BEFORE_CONFIRMATION: price has already run materially beyond structural pivot before an actionable state.

### Neckline definition
Primary neckline = the confirmed MID_HIGH between LOW1 and LOW2.
Do not use priorHigh20 as the actual neckline unless the two coincide.

Store:
- trueNeckline
- priorHigh20
- necklineVsPriorHigh20Pct
- priorHigh60
- necklineVsPriorHigh60Pct

This directly measures whether current Formal breakout references are too local or accidentally approximate the true topology.

### Adam/Eve shape descriptors
Practitioner literature distinguishes narrow/spike-like troughs ("Adam") from broader/rounded troughs ("Eve").
Do not use those labels as trading rules.
Store morphology descriptors:
- lowResidenceBars
- troughCurvature
- localWickiness
- localATRCompression
to test whether broad vs sharp troughs matter.

### Confirmation discipline
Two troughs are morphology, not a confirmed bullish signal.
For research:
- pre-breakout W maturity may be useful for watch-listing,
- confirmation state requires neckline breakout,
- actionable execution remains governed by existing system rules unless a future Formal change is explicitly approved.

### Redundancy test
Existing fields:
- leftLow/rightLow
- rightFootHigher
- priorHigh20
- supportDistance
- trend / MA structure
- volume contraction

Expected new topology:
- distinct confirmed LOW1-MID_HIGH-LOW2 sequence,
- true neckline,
- bottom spacing,
- reversal vs continuation classification,
- undercut/reclaim morphology,
- per-leg volume behavior,
- lifecycle state.

If topology-aware W adds no incremental information over the crude split-window proxy, reject the added complexity.

### Status
DEFINITION_FROZEN_V0_1 after commit.
No Formal change.



## DL-002L — Platform / Bull Flag / Triangle Specification v0.1

### Why separate these structures
Current Formal has platformRange20Pct, priorHigh20, volume contraction and breakout checks, but these do not distinguish:
- a flat horizontal base,
- a bull flag after a sharp impulse,
- a symmetrical triangle with converging highs/lows.

These have different topology and should not be collapsed into one “consolidation” score.

### A. Horizontal Platform / Rectangle

#### Topology
A platform candidate requires:
- repeated resistance tests within a bounded horizontal zone,
- repeated support tests within a bounded horizontal zone,
- neither boundary showing a strong persistent slope,
- internal range generally contracting or stable rather than expanding.

Fields:
- platformStartAt / platformEndAt
- platformDurationBars
- resistanceLevel
- supportLevel
- platformHeightPct
- upperTouchCount
- lowerTouchCount
- resistanceDispersionPct
- supportDispersionPct
- upperSlope
- lowerSlope
- internalRangeSlope
- volumeSlope
- closeLocationWithinPlatform
- pivotDistancePct

Do not define a platform only by priorHigh20-priorLow20 width.
Touch structure and boundary stability are the expected incremental topology.

#### Maturity
PLATFORM_FORMING -> PLATFORM_VALID -> PLATFORM_TIGHT -> PLATFORM_PIVOT_READY -> PLATFORM_BREAKOUT_CONFIRMED -> PLATFORM_FAILED

### B. Bull Flag

#### External anchor
Taiwan-specific pattern-recognition research by Wang & Chan (Expert Systems with Applications, 2007) tested bull-flag template matching on the Taiwan Weighted Index and NASDAQ. The study supports formalizing the shape, but its index-level historical results do not prove current single-stock alpha.

Modern practitioner descriptions commonly define:
- a sharp preceding advance (“flagpole”),
- short consolidation,
- modest downward/sideways channel,
- declining volume during consolidation,
- breakout on stronger volume.

#### Required topology
1. FLAGPOLE:
   - strong upward impulse over a limited number of bars.
2. FLAG:
   - shorter consolidation following the pole,
   - upper and lower boundaries approximately parallel or mildly converging,
   - flat-to-downward channel preferred for classical bull flag,
   - consolidation should not erase most of the pole.
3. BREAKOUT:
   - close above flag resistance / channel boundary.

Fields:
- poleStartAt / poleEndAt
- poleReturnPct
- poleDurationBars
- poleSlope
- poleEfficiency = net advance / path length
- poleVolumeRatio
- flagStartAt / flagEndAt
- flagDurationBars
- flagDepthPct
- flagDepthVsPole
- flagUpperSlope
- flagLowerSlope
- flagParallelism
- flagRangeCompression
- flagAtrCompression
- flagVolumeDryUp
- breakoutLevel
- breakoutVolumeRatio
- throwbackOccurred
- throwbackHeld

#### Distinguish flag from generic pullback
A normal A-line pullback can occur without a sharp prior impulse.
A Bull Flag requires explicit pole geometry.
Therefore poleReturnPct / poleEfficiency / poleDurationBars are NEW_TOPOLOGY relative to current A pullback logic.

#### Maturity
FLAGPOLE_COMPLETE -> FLAG_FORMING -> FLAG_VALID -> FLAG_TIGHT -> FLAG_PIVOT_READY -> FLAG_BREAKOUT_CONFIRMED -> FLAG_FAILED

### C. Symmetrical Triangle

#### External anchor
Fidelity materials describe symmetrical triangles as:
- downward-sloping upper trend line,
- upward-sloping lower trend line,
- multiple touches on both boundaries,
- many false breakouts,
- breakout confirmation required.

#### Topology
Using confirmed swings:
- at least two descending swing highs,
- at least two ascending swing lows,
- fit upper and lower boundary lines using only confirmed points,
- boundaries must converge forward rather than diverge.

Fields:
- triangleStartAt
- triangleDurationBars
- upperSlope
- lowerSlope
- upperTouchCount
- lowerTouchCount
- upperFitResidual
- lowerFitResidual
- apexDateProjected
- apexDistanceBars
- initialHeightPct
- currentHeightPct
- compressionRatio = currentHeight / initialHeight
- volumeSlope
- atrCompression
- currentPositionWithinTriangle
- breakoutDirection
- breakoutVolumeRatio
- falseBreakR01

### Line-fitting discipline
Do not fit boundaries using future points after the as-of date.
For each as-of date:
- only confirmed swings with confirmedAt <= asOfDate may enter the line fit,
- projected apex is descriptive and can move as new confirmed swings arrive,
- store line-fit version / asOfDate so historical fits are not silently rewritten.

### Touch definition
A “touch” should be volatility-normalized distance from the fitted boundary, not exact equality.
Tolerance must be based on pre-registered ATR/price semantics, not optimized for returns.

### Triangle vs Flag vs Platform classifier
Use topology, not labels:
- PLATFORM: |upperSlope| and |lowerSlope| near flat, boundaries roughly horizontal.
- FLAG: both slopes similar direction / roughly parallel after a strong pole.
- SYMMETRICAL_TRIANGLE: upperSlope < 0 and lowerSlope > 0 with convergence.
- ASCENDING_TRIANGLE: upper boundary approximately flat, lower boundary rising.
- DESCENDING_TRIANGLE: lower boundary approximately flat, upper boundary falling.

v0.1 may store ascending/descending triangle as descriptive subclasses without creating separate trading rules.

### Cross-pattern ambiguity
One base can sometimes satisfy multiple visual labels.
Do not force one winner.

Store:
- candidatePatternFamilies[]
- familyConfidence[]
- sharedSwingIds
- topologyConflict flag

If a structure is simultaneously a shallow flag and a small triangle, preserve both labels and later test whether either label adds anything beyond the shared geometric fields.

### Failure / falsification
- RANGE_EXPANSION: consolidation widens instead of tightens.
- BOUNDARY_BREAK_WRONG_DIRECTION: breakout opposite expected continuation direction.
- FALSE_BREAK_R01: reuse frozen breakout-failure outcome.
- POLE_ERASED: flag retracement gives back most of prior impulse.
- NO_VOLUME_DRYUP: descriptive warning only in v0.1.
- LOW_TOUCH_COUNT: insufficient confirmed contacts to establish boundaries.

### Redundancy map
Current Formal already captures:
- priorHigh20,
- platformRange20Pct,
- volume contraction,
- strong close / upper shadow,
- ret20,
- ATR/volatility.

Expected incremental topology:
- pole geometry / efficiency,
- parallel-channel structure,
- confirmed boundary touches,
- converging upper/lower lines,
- line-fit residual / stability,
- projected apex,
- per-pattern maturity lifecycle.

### Evidence status
Bull Flag:
- TIER_1/2 hybrid evidence due to explicit pattern-recognition research including Taiwan Weighted Index, but external validity to current Taiwan single stocks remains unproven.

Triangles / Platforms:
- researchable and widely defined, but direct Taiwan single-stock modern evidence is limited.
- WORTH_SHADOW_RESEARCH only.

No Formal change.



## DL-002M — Sakata / Multi-Candle Sequence Research Specification v0.1

### Historical/provenance caution
Modern sources commonly group Sakata Five Methods into:
- Three Mountains
- Three Rivers
- Three Gaps
- Three Soldiers
- Three Methods

However, modern descriptions are not perfectly uniform.
Some sources map “Three Rivers” broadly to reversal candlestick sequences such as morning/evening-star families, while others describe repeated valleys / bottoming structure.
Modern educational sources also note that the Sakata framework is generally considered a later reconstruction rooted in Homma-related market philosophy rather than a preserved original set of exact candlestick formulas.

Research implication:
Do NOT encode Sakata names as authoritative binary factors.
Use them as taxonomy labels over measurable sub-patterns.

### A. Three Mountains family
Map into swing topology:
- triple-top-like repeated resistance,
- head-and-shoulders-like variant when middle peak is materially higher,
- neckline/support formed by intervening troughs.

Fields:
- peak1/peak2/peak3
- peakDispersionPct
- centerPeakExcessPct
- trough1/trough2
- necklineSlope
- necklineBreakState
- priorAdvanceContext
- volumeByPeak
- confirmationState

Expected overlap:
- substantial overlap with future head-and-shoulders / multi-peak topology research.
Do not create a separate score merely because the Sakata label is different.

### B. Three Rivers family
Because terminology is non-uniform, store at least two distinct subfamilies:

B1. MULTI_TROUGH_TOPOLOGY
- three-valley / triple-bottom-like structure,
- separate from W-bottom because there are three confirmed troughs.

B2. STAR_REVERSAL_SEQUENCE
- morning-star / evening-star-like 3-candle sequence,
- requires historical OPEN and is therefore DATA_BLOCKED until DL-002B is solved.

Do not merge B1 and B2 in statistics.

### C. Three Gaps
Three consecutive gaps can represent powerful momentum / exhaustion depending on context.

Research fields:
- gapCount
- gapDirection
- gapPct[]
- gapNormalizedByATR[]
- cumulativeMovePct
- priceLimitHitCount
- corporateActionTag
- gapFillWithin1D/3D/5D
- trendContext
- volumeByGap
- distanceFromMA20/MA60
- overheatState

Critical controls for Taiwan:
- ex-right/ex-dividend events must not be counted as market-generated gaps,
- limit-up/down mechanics can cluster extreme moves,
- 7% vs 10% price-limit regimes must be separated,
- old call-auction vs continuous-trading eras must not be blindly pooled.

Therefore Three Gaps is ADJUSTMENT_BLOCKED until corporate-action-aware raw/adjusted OHLC is available.

### D. Three Soldiers
Instead of only “three bullish candles” or “three bearish candles,” measure sequence quality.

Bullish sequence fields:
- bullishBodyCount3
- closeProgressionPct[]
- openWithinPriorBodyCount
- bodyAtrRatio[]
- upperWickRatio[]
- lowerWickRatio[]
- total3DReturn
- volumeProgression
- priorTrendState
- distanceFromSupport
- overheatState

Bearish mirror features likewise.

Why:
Three bullish candles near a depressed support zone may represent reversal/continuation strength.
Three huge bullish candles after an extended run may instead represent late-stage overheat.
The same visual label can have opposite risk depending on location/context.

### E. Three Methods / Rising Three Methods
Modern descriptions commonly define a bullish Rising Three Methods sequence as:
- initial strong bullish candle,
- several smaller counter-trend candles contained substantially within the first candle's range/body,
- final bullish candle resuming upward movement and closing beyond the first candle.

Research fields:
- impulseBodyAtr
- insideCounterBarsCount
- counterBodyAtrMean
- counterRangeContainmentPct
- counterVolumeDryUp
- finalResumeBodyAtr
- finalCloseBeyondImpulse
- priorTrendState
- sequenceDuration
- breakoutVolumeRatio

This structure is conceptually similar to a micro flag / pause.
Therefore redundancy with Bull Flag must be explicitly tested.

### F. Raw relational encoding
For any N-candle Sakata/candlestick sequence, preserve a pattern-agnostic representation:
- sign(C-O)
- body/ATR
- upperWick/ATR
- lowerWick/ATR
- gap from previous close/open
- close position within range
- H/L/C relative ranks across N bars
- volume ratios
- prior trend
- support/resistance location
- price-limit state
- corporate-action tag

Named pattern labels sit on top of this raw representation.
If a named label adds no information beyond raw features, retain it only for interpretability.

### Evidence caution
Taiwan and Chinese-market candlestick studies support the possibility of conditional predictive information, but results vary by:
- liquidity,
- firm size,
- trend context,
- holding horizon,
- pattern definition.

A 2016 Pacific-Basin Finance Journal study on Chinese stocks found bullish Harami, Engulfing and Piercing more effective in highly liquid small firms, while other reversal patterns behaved differently in lower-liquidity stocks.
This reinforces subgroup/regime testing and argues against one universal candlestick score.

### Sakata research status
- THREE_MOUNTAINS: TOPOLOGY_RESEARCHABLE
- THREE_RIVERS_MULTI_TROUGH: TOPOLOGY_RESEARCHABLE
- STAR_REVERSAL: DATA_BLOCKED_OPEN
- THREE_GAPS: ADJUSTMENT_BLOCKED
- THREE_SOLDIERS: DATA_BLOCKED_OPEN for full definition
- THREE_METHODS: DATA_BLOCKED_OPEN for full definition

No Formal implication.



## DL-002N — Cross-Pattern De-duplication / Latent Geometry Layer v0.1

### Problem
The same price structure can receive multiple traditional labels:
- a shallow Cup-with-Handle handle can also look like a Flag,
- a VCP final contraction can also look like a Platform or Triangle,
- a W-bottom can be nested inside a larger Cup,
- a Rising Three Methods sequence can be a micro-Flag,
- Three Mountains can overlap with Head-and-Shoulders / Triple Top.

If each named label becomes an independent score, the same underlying geometry will be counted multiple times.

### Research principle
Named patterns are interpretability labels.
The primary quantitative layer should be a smaller set of latent geometry dimensions.

### Proposed latent dimensions
1. TREND_CONTEXT
   - prior advance/decline
   - MA/swing trend
   - residual strength context

2. COMPRESSION
   - ATR/range contraction
   - sequential contraction
   - volume dry-up
   - duration compression

3. SUPPORT_RESISTANCE_TOPOLOGY
   - repeated highs/lows
   - horizontal vs sloped boundaries
   - neckline / rim / pivot clarity
   - distance to structural levels

4. SWING_PROGRESSION
   - higher lows / lower highs
   - contraction depth sequence
   - leg duration sequence
   - recovery quality

5. SHAPE_SYMMETRY
   - rim/valley similarity
   - time symmetry
   - bowl roundness
   - line-fit residuals

6. IMPULSE_QUALITY
   - flagpole strength
   - net-path efficiency
   - breakout range expansion
   - gap/limit-move dependence

7. VOLUME_STRUCTURE
   - selling-volume decay
   - base-wide volume slope
   - handle/final-tight-area dry-up
   - breakout-volume expansion

8. PIVOT_CLARITY
   - number of plausible pivots
   - pivot dispersion
   - scale agreement
   - boundary fit residual

9. MATURITY_STATE
   - FORMING / VALID / MATURE / PIVOT_READY / BREAKOUT / RETEST / FAILED

10. LOCATION_RISK
   - overheat / distance from MA
   - position in larger base
   - price-limit / gap dependence
   - resistance overhead

### Pattern labels become mappings
Examples:

VCP:
- high COMPRESSION
- positive SWING_PROGRESSION
- strong VOLUME_STRUCTURE dry-up
- high PIVOT_CLARITY

Cup-with-Handle:
- SHAPE_SYMMETRY / roundness
- right-side recovery
- nested shallow handle COMPRESSION
- rim/pivot topology

W-bottom:
- SUPPORT_RESISTANCE_TOPOLOGY
- two-trough SWING_PROGRESSION
- true neckline
- reclaim/confirmation lifecycle

Bull Flag:
- high IMPULSE_QUALITY
- short consolidation COMPRESSION
- parallel/downward boundary topology
- volume dry-up

Triangle:
- converging boundary topology
- COMPRESSION
- PIVOT_CLARITY / apex geometry

Sakata sequences:
- mostly short-horizon IMPULSE / LOCATION / raw relational OHLC features.

### No aggregate “Pattern Score” yet
Do not create one weighted 0-100 score at this stage.
Reason:
- weights would be arbitrary before validation,
- named-pattern overlap would be hidden,
- one large score encourages outcome-tuned weight fitting.

Store a feature vector + labels + maturity state first.

If a later Shadow experiment needs a summary, pre-register a simple non-outcome-tuned summary and compare it against the full vector. Do not optimize weights on the same sample.

### Pattern overlap record
For every as-of-date stock:
- patternLabels[]
- patternStates[]
- sharedSwingIds[]
- latentFeatureVector
- overlapMatrix
- dominantTopology = descriptive only
- conflictFlags[]

Example conflict:
- CUP_HANDLE + FLAG may share the same handle swings.
Mark shared geometry so they cannot later be treated as independent evidence.

### Multi-scale sensitivity
Recent chart-representation research shows pattern information can disappear as sequence simplification changes.
This reinforces the DL-002H rule:
- preserve MICRO / BASE / MAJOR views,
- record scaleAgreement,
- do not select the scale that produces the best forward return.

### Promotion requirement
A named pattern must demonstrate incremental information beyond:
1. its own latent geometry dimensions,
2. existing Formal variables,
3. other overlapping pattern labels.

If “Cup-with-Handle” adds no value after rim symmetry + compression + pivot clarity, the name remains UI/interpretability only.

### Status
ARCHITECTURE_FROZEN_V0_1.
Research-only. No production score created.



## DL-002O — Pattern Research Data Architecture / Validation Plan v0.1

### Official Fugle capability verified
Fugle Historical Candles documentation supports:
- TWSE/TPEx listed-stock daily data back to 2010,
- OHLCV and turnover/change fields,
- adjusted=true for adjusted daily/weekly/monthly series,
- each request range must be less than one year.

Therefore the source is sufficient for multi-month pattern research without modifying the Formal data source.

### Isolation principle
Do NOT extend or mutate the shared live Formal history cache merely for DL-002.
Reason:
- shared data structures are Class B risk,
- Formal currently only needs its existing shorter horizon,
- pattern research needs OPEN + longer adjusted history + explicit provenance.

Preferred architecture is a separate research-only cache / dataset.

### Minimum research record
Per symbol/date:
- date
- rawOpen/rawHigh/rawLow/rawClose
- adjustedOpen/adjustedHigh/adjustedLow/adjustedClose
- volumeShares
- turnover
- rawChange
- corporateActionSuspected / corporateActionTag if available
- source
- fetchedAt
- pointInTimeEligible
- queryAdjusted flags

Derived fields should be reproducible rather than permanently overwriting source OHLC.

### Retrieval strategy
Fugle requires <1-year request spans.
A long research range should be fetched in bounded date chunks and merged by date with:
- duplicate-date detection,
- monotonic date checks,
- adjusted flag verification,
- symbol/market validation,
- no silent empty-range substitution.

### Recommended research horizons
Do not retrieve all history merely because it exists.

Prospective pattern diagnostics:
- maintain enough trailing history to cover multi-month bases plus trend context.
- candidate starting target: 300-400 trading sessions, to be finalized before outcome testing.

Historical mechanism studies:
- can use longer 2010+ price histories, but remain separate from formal historical Shadow cohorts.

### Critical distinction: historical mechanics vs historical Shadow
The research governance forbids fabricating historical Shadow samples.

Allowed:
- take historical price series and ask purely price-based questions such as:
  “When an as-of-date W topology existed, what did future returns look like?”

Not allowed:
- retroactively label a 2022 stock as FORMAL_NEAR_MISS / REJECTED using today's full pipeline when that cohort was not prospectively archived with then-available evidence.

Therefore maintain two evidence tracks:

TRACK A — HISTORICAL_PATTERN_MECHANICS
- as-of-date OHLC-only or point-in-time-safe features,
- can provide mechanism plausibility and sample size,
- cannot be called historical Formal Selection Alpha.

TRACK B — PROSPECTIVE_FORMAL_COHORT_VALIDATION
- uses actual SELECTED / QUALIFIED_NOT_SELECTED / NEAR_MISS / REJECTED_AFTER_BASE / BROAD_CONTROL archives captured prospectively,
- primary evidence for whether DL-002 improves our system.

### Point-in-time rules
For any historical pattern state at date t:
- OHLC through t only,
- swing usable only if confirmedAt <= t,
- current provisional leg may remain provisional,
- no later breakout may revise earlier state,
- adjusted series must be generated from a method whose adjustment convention is documented; results should be checked for corporate-action artifacts.

### Corporate-action dual-series rule
Pattern geometry:
- use ADJUSTED_OHLC.

Execution/reference levels:
- use RAW_OHLC.

Do not compare an adjusted pivot directly to a raw live price.
If a pattern later becomes operationally relevant in research, map structural levels back to raw price scale as of the decision date using an explicit adjustment factor.

### Avoid unnecessary full-market storage
Pattern research does not initially need full 2010-present history for every stock in live D1.

Staged data priority:
1. current/prospective Formal + Shadow cohorts,
2. matched controls needed for same-date tests,
3. representative historical mechanics sample across regimes/sectors/liquidity,
4. broader full-market expansion only if justified by evidence needs.

### Selection-bias safeguard
For TRACK A historical mechanics, sampling only famous winners is prohibited.
Use pre-defined universe/date sampling such as:
- all eligible stocks on sampled dates, or
- deterministic stratified samples by year / liquidity / price tier / industry.

### Validation hierarchy
Stage 0 — detector correctness
- synthetic patterns and adversarial non-patterns,
- verify no look-ahead/repaint,
- verify state transition chronology.

Stage 1 — historical mechanics
- outcome-agnostic definitions frozen,
- broad historical sample,
- D1/D3/D5/D10/MFE/MAE and failure rates,
- market-regime stratification.

Stage 2 — prospective cohort incremental value
- same-date Formal/Shadow cohorts,
- partial/incremental tests versus existing factors,
- date-cluster robustness.

Stage 3 — research maturity review
- only when existing governance sample/date/regime/holdout gates mature.

Stage 4 — possible owner-reviewed Formal proposal
- never automatic.

### Current data blockers reclassified
OPEN_MISSING_IN_LIVE_CACHE:
- not a source blocker; research-architecture blocker.

LONG_HORIZON_MISSING_IN_LIVE_CACHE:
- not a source blocker; use isolated research cache.

ADJUSTMENT_HANDLING:
- source capability verified; implementation/reproducibility remains to be designed.

### Engineering classification
A separate isolated research-only data path with no Formal dependency can qualify as Class A if:
- no shared fetch/cache contract changes,
- no live selection/monitor/push dependency,
- protected Formal outputs are regression-identical.

Any modification to shared Formal historical cache remains Class B proposal-first.



## DL-002P — Detector Falsification / Adversarial Pattern Test Suite v0.1

### Principle
Before testing profitability, test whether the detector recognizes structure correctly and refuses look-alike noise.

A detector that only “finds” successful textbook examples is not validated.

### Synthetic positive and negative cases

#### VCP
Positive:
- prior advance,
- 3 non-overlapping contractions,
- depths 18% -> 10% -> 5%,
- improving lows,
- falling volume,
- stable pivot,
- no breakout yet.

Negative A — overlapping-window illusion:
- rolling 20/10/5-day range shrinks,
- but confirmed swing legs do not form sequential contractions.

Expected: NOT_VCP / generic compression only.

Negative B — volatility shrinks but lows deteriorate:
- 18% -> 10% -> 5% depth,
- each trough lower than prior trough.

Expected: low-quality or invalid topology, not mature VCP.

Negative C — final contraction expands:
- 15% -> 8% -> 14%.

Expected: EXPANSION_FAILURE.

Negative D — one-day crash/rebound:
- apparent contraction due one extreme bar.

Expected: LOW_STABILITY / not mature.

#### Cup-with-Handle
Positive:
- prior advance,
- broad rounded decline/recovery,
- right rim near left rim,
- shallow upper-half handle,
- handle volume/range compression.

Negative A — sharp V:
- one fast drop + one fast rebound to rim.

Expected: V_SHAPED_BASE, not high-roundness cup.

Negative B — handle forms in lower half:
Expected: HANDLE_LOW_IN_BASE.

Negative C — second deep selloff mislabeled as handle:
- handle depth near cup depth.

Expected: weak/invalid handle, likely new base leg.

Negative D — two rims far apart:
Expected: RIM_DIVERGENCE / low cup confidence.

Negative E — rounded base without prior advance:
Expected: distinguish continuation Cup from generic Rounded Bottom; do not force Cup-with-Handle label.

#### W / Double Bottom
Positive:
LOW1 -> MID_HIGH -> LOW2 -> neckline approach.

Negative A — two lows with no intervening high:
Expected: NO_DISTINCT_MID_HIGH.

Negative B — fixed-window rightFootHigher true but swings are not distinct:
Expected: crude proxy true, topology false.

Negative C — LOW2 breaks LOW1 and never reclaims:
Expected: SUPPORT_COLLAPSE.

Negative D — neckline is actually an unrelated older priorHigh20:
Expected: trueNeckline != priorHigh20; detector uses MID_HIGH.

Positive special:
- slight undercut of LOW1 followed by prompt reclaim.
Expected: UNDERCUT_RECLAIM_W, separate variant.

#### Bull Flag
Positive:
- strong efficient flagpole,
- short shallow parallel/down-sloping consolidation,
- declining volume.

Negative A — no flagpole:
Expected: generic channel/platform, not flag.

Negative B — deep consolidation erases most of impulse:
Expected: POLE_ERASED.

Negative C — consolidation duration longer than pole and becomes multi-month base:
Expected: reclassify as base/platform/triangle candidate.

Negative D — upward-sloping loose channel after pole:
Expected: low-quality flag / possible wedge, not classic bull flag.

#### Triangle
Positive:
- descending confirmed highs,
- ascending confirmed lows,
- at least multiple boundary contacts,
- boundaries converge.

Negative A — only one high and one low define lines:
Expected: LOW_TOUCH_COUNT.

Negative B — parallel lines:
Expected: channel/flag, not triangle.

Negative C — boundaries diverge:
Expected: broadening formation, not triangle.

Negative D — apparent convergence only after using future swings:
Expected: NO_LOOKAHEAD failure test.

#### Sakata / candlestick
Negative A — ex-dividend gap:
Expected: corporate-action event, not Three Gaps.

Negative B — three bullish candles after huge extended run:
Expected: THREE_SOLDIERS morphology may be true, but LOCATION_RISK overheat high; no automatic bullish conclusion.

Negative C — bullish engulfing without prior downtrend:
Expected: label can be stored morphologically, reversalContext=false.

### Chronology tests
For every synthetic sequence:
- snapshot detector at every day t,
- verify state as of t is identical whether the future suffix is present or removed,
- except PROVISIONAL state fields that are explicitly allowed to evolve.

This is the strongest simple anti-repaint test:
detector(history[0:t]) must equal historical state extracted from detector(fullHistory, asOf=t).

### Scale tests
Run MICRO / BASE / MAJOR segmentation.
Expected:
- topology may simplify at larger scales,
- no future-return-based selection of the “best” scale,
- scaleAgreement recorded.

### Adjustment tests
Construct a synthetic corporate-action factor:
- raw price gaps 20% mechanically,
- adjusted price continuous.

Expected:
- adjusted morphology sees no market gap,
- raw execution series preserves actual quoted prices,
- Three Gaps / swing detector does not treat corporate action as alpha signal.

### Property-based invariants
1. Price-scale invariance:
   multiplying all OHLC by a constant should not change normalized pattern labels/states.

2. Split-adjustment invariance:
   equivalent adjusted series should produce same morphology.

3. Prefix invariance:
   adding future bars must not change past confirmed states.

4. Monotonic-time invariance:
   reordered dates must be rejected.

5. Missing-data honesty:
   missing OPEN blocks full candlestick labels; it must not be imputed from close.

6. Duplicate-bar rejection:
   duplicate symbol/date bars must trigger data-quality error.

7. Pattern overlap transparency:
   one set of swings may support multiple labels but sharedSwingIds must expose overlap.

### Profitability is deliberately absent
This suite tests detector validity, not returns.
A detector must pass these tests before any outcome evaluation.

### Status
TEST_DESIGN_FROZEN_V0_1.
No code implemented yet.
No Formal change.



## DL-002Q — Multi-Peak / Multi-Trough Reversal Family v0.1

### Motivation
Traditional labels overlap heavily:
- Three Mountains
- Triple Top
- Head-and-Shoulders Top
- Three Rivers / Triple Bottom
- Inverse Head-and-Shoulders

Instead of independent scores, define one generic multi-extrema topology and derive interpretable subclasses.

### Generic top topology
HIGH1 -> LOW1 -> HIGH2 -> LOW2 -> HIGH3

Fields:
- peakPrices[3]
- troughPrices[2]
- peakSpacingBars[]
- peakDispersionPct
- centerPeakExcessPct
- necklineSlope
- necklineFitResidual
- necklineBreakState
- volumeByPeak[]
- volumeSlopeAcrossPeaks
- priorAdvancePct
- priorTrendState

Subclasses:
- TRIPLE_TOP: three peaks roughly similar.
- HEAD_SHOULDERS_TOP: center peak materially above outer peaks; outer peaks reasonably comparable.
- IRREGULAR_MULTI_TOP: topology valid but does not fit either named subclass cleanly.

### Generic bottom topology
LOW1 -> HIGH1 -> LOW2 -> HIGH2 -> LOW3

Fields mirror the top family:
- troughPrices[3]
- reactionHighs[2]
- troughSpacingBars[]
- troughDispersionPct
- centerTroughDepthPct
- necklineSlope
- necklineFitResidual
- necklineBreakState
- volumeByTrough[]
- priorDeclinePct
- priorTrendState

Subclasses:
- TRIPLE_BOTTOM
- INVERSE_HEAD_SHOULDERS
- IRREGULAR_MULTI_BOTTOM

### Neckline
For H&S:
- top neckline connects the two reaction LOWs;
- bottom neckline connects the two reaction HIGHs.

A pattern is morphologically formed before neckline break, but reversal confirmation is separate.
Store:
- necklineAtCurrentDate
- distanceToNecklinePct
- breakoutConfirmed
- retestState

Do not collapse FORMING and CONFIRMED.

### Shoulder/head proportionality
Do not use rigid textbook percentages.
Store:
- outerPeakSimilarity / outerTroughSimilarity
- headExcess / headDepth
- timeSymmetry
- shoulderDurationSimilarity
- scaleAgreement

Named subclass confidence is continuous.

### Volume
Practitioner literature often expects weakening volume across successive top peaks and stronger volume on bullish inverse-H&S breakout.
Research fields:
- volumePeak1/2/3
- volumeTrough1/2/3
- shoulderVolumeAsymmetry
- necklineBreakoutVolume

Do not hard-gate volume pattern in v0.1.
Test incrementally.

### Relation to Sakata
- Three Mountains maps to generic multi-top topology.
- Three Rivers multi-trough interpretation maps to generic multi-bottom topology.
- Head-and-Shoulders is a shape subclass, not a separate independent factor.

This prevents duplicated evidence.

### Relation to Formal
Potentially incremental:
- true neckline geometry,
- peak/trough sequence,
- head/shoulder proportionality,
- multi-touch reversal maturation.

Likely redundant:
- generic trend weakening,
- distance to MA,
- upper shadow,
- priorHigh20/60,
- rightFootHigher.

### Long-only system relevance
Bullish selection research priority:
1. INVERSE_HEAD_SHOULDERS
2. TRIPLE_BOTTOM
3. irregular multi-bottom recovery

Bearish top patterns are still valuable as:
- late-stage / avoid-chasing diagnostics,
- post-entry risk context,
but they must not automatically alter Formal sell/reduce logic without owner approval.

### Confirmation/failure
Use existing R01-style post-breakout failure metric for confirmed bullish neckline breaks where applicable.
For pre-confirmation:
- FORMING
- STRUCTURE_VALID
- NECKLINE_APPROACH
- BREAKOUT_CONFIRMED
- RETEST_CONFIRMING
- FAILED

### Evidence status
General chart-topology research supports systematic pattern recognition.
Named subclass performance in current Taiwan single stocks remains unproven.

WORTH_SHADOW_RESEARCH.
No Formal change.



## DL-002R — High Tight Flag / Extreme Momentum vs Overheat v0.1

### Why this pattern is strategically important
The system prefers strong stocks but explicitly avoids late-stage / overextended chasing.
High Tight Flag (HTF) sits exactly on that boundary:
- extreme prior momentum,
- short tight consolidation,
- possible continuation,
- but very high overheat / crash risk.

Therefore HTF is not merely another flag. It is a test of whether “extreme strength” sometimes remains constructive after controlling overheat.

### Evidence caution
Practitioner literature historically described HTF as a very strong continuation pattern.
However, updated practitioner research by Bulkowski later reported materially weaker relative performance than earlier editions and explicitly warned that the pattern no longer ranked near the top in updated samples.

Research implication:
HTF is a model-drift / historical-instability case study.
Do not trust early pattern statistics as timeless.

### Morphology fields
Reuse Bull Flag topology but add extreme-impulse descriptors:
- extremePoleReturnPct
- extremePoleDurationBars
- poleAcceleration
- poleEfficiency
- priorBaseDuration
- priorBaseQuality
- gapContributionPct
- limitUpContributionCount
- attentionSpikeCount
- turnoverExpansion
- postPoleFlagDepthPct
- postPoleFlagDurationBars
- postPoleTightness
- postPoleVolumeDryUp
- pivotDistancePct

### Classical prior as descriptive only
Older practitioner definitions often require roughly near-doubling over a short window followed by a relatively shallow/tight pause.
Do NOT hard-code 90% / 2 months as a Formal threshold.
Store continuous pole return and duration, and optionally a CLASSIC_HTF label for interpretability.

### Central research conflict
Current system has:
- ret20 late-stage controls,
- MA-distance overheat,
- overheatPenaltyResearch,
- maxChase constraints.

HTF hypothesis says:
“Some stocks that look objectively overextended may still have positive continuation if they undergo a sufficiently tight, low-supply consolidation.”

This must be tested as an interaction, not as a reason to remove overheat controls.

### Pre-registered interaction groups
Within extreme-momentum candidates:
A. HIGH_OVERHEAT + LOOSE_CONSOLIDATION
B. HIGH_OVERHEAT + TIGHT_CONSOLIDATION
C. MODERATE_OVERHEAT + TIGHT_CONSOLIDATION
D. MODERATE_OVERHEAT + LOOSE_CONSOLIDATION

Compare:
- D3/D5/D10
- MFE/MAE
- breakout failure
- stop-first
- gap-down risk
- regime dependence

Primary falsification:
If B does not materially improve on A after same-date / regime controls, “tight flag rescues overheat” is unsupported.

### Attention / discreteness interaction
HTF may overlap strongly with:
- DL-001 Information Discreteness,
- Attention Strength,
- large gaps / limit-up events,
- news catalysts.

Therefore test:
- gradual pole vs jump-concentrated pole,
- low-attention accumulation vs event-driven spike,
- number of price-limit days,
- gap contribution to total pole return.

A near-doubling caused by several limit-up/gap days may have different risk than a more continuous strong trend.

### Prior-base interaction
Older HTF literature often emphasizes that explosive movement can emerge from a prior substantial base.
Store:
- priorBaseDuration
- priorBaseCompression
- priorBaseBreakoutQuality
- priorBasePatternLabels

Hypothesis:
HTF after a mature prior base may differ from HTF occurring at the end of a long extended trend.

### Classification
HTF_VALID:
- extreme impulse + identifiable tight consolidation.

HTF_PIVOT_READY:
- tight consolidation near pivot.

HTF_BREAKOUT_CONFIRMED:
- breakout confirmed.

HTF_OVERHEAT_CONFLICT:
- morphology valid but location/overheat risk high.

HTF_FAILED:
- structure break or R01 post-breakout failure.

Important:
HTF_OVERHEAT_CONFLICT is not a buy/sell decision; it is the exact research state we want to study.

### Evidence status
PRACTITIONER_PATTERN_WITH_DOCUMENTED_PERFORMANCE_DRIFT.
High priority as a falsification/interaction study, not as a new bullish factor.

No Formal change.



## DL-002S — Pattern Maturity vs Existing 15-minute Execution Layer v0.1

### Question
If a stock has a mature daily chart pattern at selection time, does that improve the probability/timing of the existing 15-minute BUY confirmation without weakening the execution rules?

This directly addresses the system's sparse BUY / idle-capital problem while keeping selection and execution separate.

### Separation of roles
Daily pattern layer:
- identifies structural maturity / pivot readiness.

Existing execution layer:
- 15-minute K is formal confirmation.
- 10-minute K remains auxiliary.
- pullback / breakout-retest logic remains unchanged.

DL-002 must not silently convert PIVOT_READY into BUY.

### Key hypotheses

H1 — Mature patterns improve execution efficiency
Pattern-mature candidates may:
- enter the planned zone sooner,
- produce cleaner 15-minute reversals/retests,
- trigger BUY more often,
- have lower MAE before BUY.

H2 — Mature patterns may reduce execution opportunity
A very mature/strong pattern may:
- break out and never pull back into the current buy zone,
- exceed maxChase,
- remain strong but generate NO-BUY under conservative execution.

If H2 dominates, the bottleneck is not stock selection quality but compatibility between daily setup geometry and the current execution style.

H3 — Different pattern families may pair with different execution modes
Examples to test descriptively:
- W / inverse-H&S may align naturally with PULLBACK confirmation.
- VCP / platform / flag may align more with breakout-retest confirmation.
- Cup handle may straddle both depending on whether the scan occurs before or after pivot.

Do not hard-map pattern -> execution rule before evidence.

### Required per-plan research fields
At scan date:
- patternLabels[]
- patternStates[]
- latentFeatureVector
- pivotDistancePct
- patternConfidence / scaleAgreement descriptors
- Formal channel A/B
- buy zone / breakout / maxChase

Next-session execution outcomes:
- entryZoneReached
- firstEntryZoneTime
- pivotCrossed
- maxChaseExceededBeforeEntry
- formal15BuyTriggered
- formal15BuyTime
- timeFromOpenToBuyMinutes
- early10mAlertOccurred
- noBuyReason
- intradayMFEBeforeBuy
- intradayMAEBeforeBuy
- nextCloseReturn
- executionDataComplete

### NO-BUY reason taxonomy
Do not treat NO-BUY as one failure.

Possible reasons:
- NEVER_REACHED_BUY_ZONE
- BROKE_OUT_WITHOUT_RETEST
- MAXCHASE_EXCEEDED
- ENTERED_ZONE_NO_STABILIZATION
- ENTERED_ZONE_BUT_VOLUME_BAD
- RETEST_FAILED
- PLAN_INVALIDATED
- DATA_COVERAGE_UNKNOWN
- MARKET_HALTED / non-normal market state
- BUY_TRIGGERED

This taxonomy is essential to distinguish:
“pattern was wrong”
from
“pattern was right but execution intentionally did not chase.”

### Core comparisons
1. Formal SELECTED + PIVOT_READY vs Formal SELECTED + FORMING.
2. Near-miss high-maturity vs near-miss low-maturity, selection outcomes only.
3. A channel by pattern family.
4. B channel by pattern family.
5. BUY-triggered vs NO-BUY split by pattern maturity.
6. Pattern-mature NO-BUY names: future return/MFE to quantify opportunity cost of conservative execution.

### No absence-as-zero
Existing execution-recorder research already established that missing rows may reflect coverage/truncation, not true NO-BUY.
DL-002S must inherit that rule:
- only classify NO-BUY when target-date execution coverage is independently complete,
- otherwise execution outcome = UNKNOWN.

### Potential optimization interpretations later
Only after mature evidence:
A. Pattern improves selection but not BUY rate:
   possible execution mismatch.

B. Pattern improves BUY rate but not post-BUY return:
   pattern may merely predict easy triggers, not alpha.

C. Pattern improves both selection outcomes and BUY quality:
   strongest later candidate for a formal review.

D. Pattern improves neither:
   reject/retain for interpretability only.

E. Pattern catches big runners that Formal never buys because of maxChase:
   investigate opportunity cost, but do not automatically loosen maxChase.

### Status
WORTH_PROSPECTIVE_SHADOW_LINKAGE.
No Formal execution change.



## DL-002T — False Break / Spring / Upthrust Structural Events v0.1

### Evidence posture
Horizontal support/resistance can be identified systematically from historical local extrema, and academic evidence suggests such levels can contain some information about trend interruption. However, support/resistance rules alone did not reliably generate abnormal returns versus simple benchmarks in one long U.S. study.

Therefore false-break structures are EVENT FEATURES, not standalone alpha assumptions.

### Generic acceptance/rejection framework
For a structural level L, define two distinct events:

BREAK_ACCEPTANCE:
- price moves beyond L,
- subsequent closes remain beyond L for a defined confirmation horizon / existing R01 semantics.

BREAK_REJECTION:
- price trades/closes beyond L,
- then returns back through L before acceptance is established.

Do not assume rejection implies an immediate opposite trend.

### Bullish support undercut / Spring-like event
Candidate sequence:
1. confirmed support zone exists from prior swing lows / base boundary;
2. price penetrates below support;
3. penetration depth is measured in ATR/percent terms;
4. price reclaims the support zone within a bounded number of bars;
5. subsequent behavior is observed separately.

Fields:
- supportLevel
- supportSource
- undercutLow
- undercutDepthPct
- undercutDepthATR
- barsBelowSupport
- reclaimAt
- reclaimCloseDistancePct
- reclaimVolumeRatio
- reclaimBodyStrength
- nextResistanceDistancePct
- priorTrendState
- baseMaturityState

### Bearish resistance Upthrust-like event
Mirror structure:
1. confirmed resistance exists;
2. price penetrates above resistance;
3. price fails to establish acceptance;
4. closes return beneath resistance.

Fields:
- resistanceLevel
- overshootHigh
- overshootPct / ATR
- barsAboveResistance
- rejectionAt
- rejectionVolume
- upperWick / close-position features
- priorTrend / overheat state

### Critical distinction: intraday probe vs close failure
Store separately:
- INTRADAY_PROBE: high/low crosses level but close stays inside.
- CLOSE_BREAK_RECLAIM: close breaches then a later close reclaims.
- MULTIDAY_ACCEPTANCE_FAILURE: initial closes beyond level, later failure.

These may have different implications.

### Interaction with existing W-bottom
UNDERCUT_RECLAIM_W from DL-002K is a specialized Spring-like event:
- structural support = LOW1 zone,
- LOW2 undercuts,
- reclaim occurs,
- neckline remains separate confirmation.

Do not double-score both “Spring” and “W undercut/reclaim.”
Store shared event IDs.

### Interaction with existing B breakout
Current Formal B already requires:
- breakout above priorHigh20,
- volume,
- strong close,
- limited upper shadow,
- later 15-minute breakout/retest confirmation.

DL-002T should study:
- which daily breakout candidates later become R01 failures,
- whether overshoot size, close position, volume, pivot clarity, multi-touch resistance, pattern maturity, or overheat explain false breaks.

This may improve understanding of breakout quality without adding a new rule.

### Pre-registered falsification variables
Possible predictors of failed breakout:
- pivotDispersionPct high
- resistanceTouchCount
- breakoutDistancePct
- breakoutVolumeRatio
- upperWickRatio
- closePosition
- overheatPenalty
- ret20 / ret60
- gapContribution
- limitUpState
- marketRegime
- sectorPersistence
- patternMaturity
- DL-001 discreteness

Do not scan arbitrary combinations and choose the best after outcomes.

### Acceptance horizons
Reuse existing frozen R01 breakout-failure outcome wherever possible.
If additional horizons are explored (e.g. 1D/5D), they are descriptive until separately pre-registered; they must not replace R01 because one performs better.

### Support/resistance source comparison
Compare:
- fixed-window priorHigh20/priorLow20,
- confirmed swing levels,
- W neckline,
- cup rim,
- platform boundary,
- triangle/flag boundary.

Question:
Does topology-derived level clarity improve acceptance/rejection classification beyond fixed-window extrema?

### Volume interpretation caution
High volume on a breakout may represent genuine demand OR climactic activity.
Low volume on a test may represent lack of supply OR lack of participation.
Therefore volume is an interaction variable, not a one-direction truth.

### Status
WORTH_SHADOW_EVENT_RESEARCH.
No Formal change.



## DL-002U — Multi-Timeframe Pattern Context v0.1

### Strategic fit
The current system already separates:
- daily bars for after-market selection,
- 15-minute bars for formal execution confirmation,
- 10-minute bars for auxiliary observation.

DL-002 adds a possible WEEKLY structural context layer for research, not a second decision engine.

### Role separation
WEEKLY:
- primary / large-base context,
- major trend and long structural levels,
- multi-month cup / head-and-shoulders / major W context.

DAILY:
- pattern maturity,
- swing topology,
- pivot / neckline / handle / flag details,
- after-market selection context.

15-MINUTE:
- actual tactical confirmation under existing execution rules.

10-MINUTE:
- auxiliary early observation only, unchanged.

### Why weekly may add information
Long patterns can be fragmented by daily noise.
Weekly aggregation may:
- simplify multi-month bases,
- expose larger structural resistance,
- distinguish a daily bullish setup inside a deteriorating major structure,
- reduce sensitivity to one-day noise.

But weekly bars also lose timing detail and can duplicate MA60 / long-horizon daily information.

Therefore weekly context must prove incremental value.

### Weekly research fields
- weeklySwingTrend
- weeklyHigherHighCount
- weeklyHigherLowCount
- weeklyMajorResistance
- weeklyMajorSupport
- weeklyBaseDurationWeeks
- weeklyPatternLabels[]
- weeklyPatternStates[]
- weeklyATRPercent
- weeklyVolumeTrend
- weeklyCloseVsMA10W / MA30W equivalents as descriptive context
- dailyWeeklyPatternAgreement
- dailyPivotVsWeeklyResistancePct

Do not automatically reuse practitioner MA periods as hard gates.

### Cross-timeframe pattern relationship
Examples:

NESTED:
- weekly cup + daily handle
- weekly W + daily VCP
- weekly base + daily flag

ALIGNED:
- same bullish topology visible on weekly and daily.

CONFLICT:
- daily bullish breakout approaching weekly major resistance,
- daily pattern mature while weekly structure remains lower-high/lower-low.

INDEPENDENT:
- daily short-term setup has no meaningful weekly named pattern.

### De-duplication rule
Weekly and daily versions of the same underlying swings must not count as independent factors.

Store:
- parentPatternId
- childPatternId
- sharedPriceRegion
- sharedStructuralLevel
- timeframeRelationship

### Hypotheses
H1:
Daily pattern maturity has better outcomes when weekly trend/context is supportive.

H2:
Weekly resistance proximity explains some daily false breakouts.

H3:
Weekly context is redundant once MA60, priorHigh60, ret60 and Residual RS are controlled.

H3 is a serious null hypothesis; weekly context should be rejected if it adds no information.

### Validation
Within same date / pattern family:
- weekly aligned vs weekly neutral vs weekly conflict.

Outcomes:
- D3/D5/D10
- MFE/MAE
- R01 breakout failure
- 15-minute BUY trigger rate
- maxChase/no-retest opportunity cost

Control:
- MA60 relationship
- priorHigh60
- ret60
- volatility
- sector / market regime

### Weekly bar construction
Prefer source-provided adjusted W candles or deterministic aggregation from adjusted daily data.
If aggregating:
- weekly open = first trading-day adjusted open,
- high = max highs,
- low = min lows,
- close = last trading-day adjusted close,
- volume = sum volume,
- week boundaries must use Taiwan trading calendar.

Do not mix raw and adjusted series.

### Status
WORTH_SHADOW_CONTEXT_RESEARCH.
No Formal or execution change.



## DL-002V — Gap / Three-Gap / Island-Reversal Research v0.1

### Taiwan-specific motivation
Recent Taiwan evidence distinguishes information contained in intraday returns from overnight returns:
- intraday momentum evidence is associated with underreaction,
- overnight momentum can behave differently and has been linked to overreaction / later correction,
- opening prices in Taiwan are especially meaningful because overnight information is incorporated at the opening call auction.

Therefore “gap” is not one generic bullish/bearish object.

### Distinguish two gap concepts

A. OPENING_GAP
- open_t vs close_{t-1}
- can exist even if the two daily ranges overlap.

openingGapPct = (open_t / close_{t-1} - 1) * 100

B. TRUE_RANGE_GAP
Bullish true gap:
- low_t > high_{t-1}

Bearish true gap:
- high_t < low_{t-1}

gapZone:
- bullish = [high_{t-1}, low_t]
- bearish = [high_t, low_{t-1}]

These must be stored separately.

### Core fields
- openingGapPct
- openingGapATR
- trueGapDirection
- trueGapSizePct
- trueGapSizeATR
- gapZoneLow / gapZoneHigh
- gapFilledIntraday
- gapFillCloseState
- daysToPartialFill
- daysToFullFill
- volumeRatio
- turnoverRatio
- priceLimitState
- corporateActionTag
- overnightReturnComponent
- intradayReturnComponent
- DL001Discreteness
- patternContext
- marketRegime

### Three Gaps / Sakata Three Gaps
Define only after corporate-action filtering.

For consecutive gaps:
- gapSequenceCount
- sequenceDirection
- gapSizesATR[]
- cumulativeOpeningReturn
- cumulativeIntradayReturn
- limitHitCount
- volumeSequence
- fillStateByGap
- distanceFromMA20/MA60
- overheatState

Do not assume the third gap is automatically exhaustion.
Test:
- continuation vs reversal conditional on overheat, price-limit clustering, volume, regime and gap composition.

### Gap composition
A 20% multi-day rise can be formed by:
- large overnight gaps + weak intraday closes,
- small gaps + strong intraday follow-through,
- limit-up clustering,
- continuous intraday advance.

This overlaps directly with DL-001 Information Discreteness / Gradual Price Path.

Research interaction:
- GAP_DOMINATED_PATH
- INTRADAY_DOMINATED_PATH
- MIXED_PATH

Do not score gap features independently from DL-001 before redundancy testing.

### Island reversal
A classic island-like structure conceptually requires:
1. gap away from prior price range,
2. isolated trading cluster,
3. opposite-direction gap that leaves the cluster separated from surrounding price ranges.

Research fields:
- entryGapZone
- islandStartAt
- islandEndAt
- islandDurationBars
- islandRangePct
- exitGapZone
- gapZoneOverlap
- islandVolumeProfile
- priorTrendState
- overheat / panic state

Critical:
- corporate actions must be excluded,
- daily OHLC must actually show non-overlapping ranges,
- an opening gap alone is insufficient.

### Price-limit interaction
Taiwan 10% daily limits can produce clustered gaps/limit closes.
Store:
- limitUp / limitDown state per day,
- number of consecutive limit events,
- next-day opening gap,
- next-day intraday follow-through.

Question:
Does a “Three Gaps” sequence still contain independent information once price-limit mechanics and overnight/intraday decomposition are controlled?

### Corporate actions
All gap research is invalid without explicit handling of:
- cash dividends,
- stock dividends / rights,
- capital reductions / splits where relevant.

Use adjusted series for morphology continuity, while raw series preserves traded prices.
If raw series shows a gap but adjusted series does not, classify:
CORPORATE_ACTION_GAP, not MARKET_GAP.

### Regime portability
Split at least:
- 7% price-limit era,
- 10% price-limit era,
- pre/post continuous trading.

Primary relevance for 2026 is 10% limit + continuous intraday trading.

### Outcomes
Use:
- D1/D3/D5/D10
- MFE/MAE
- gap fill probability/time
- R01 failure when gap accompanies breakout
- intraday vs overnight continuation decomposition

### Evidence status
Taiwan overnight/intraday literature gives strong reason to decompose gap returns.
Named Three-Gap / Island-Reversal profitability remains unproven.

WORTH_SHADOW_RESEARCH after adjustment-ready data.
No Formal change.



## DL-002W — Price-Volume Structure / Effort-vs-Result v0.1

### Evidence posture
Broad academic evidence does NOT support a universal monotonic rule that “more volume predicts higher returns.”
A 2021 meta-analysis across 44 studies / 468 estimates reports:
- material publication bias,
- smaller true effects than naive literature impressions,
- strong heterogeneity by market, asset type, frequency and methodology.

Taiwan-specific evidence also links trading volume to differential information-adjustment speed / lead-lag behavior, but this is not equivalent to “high volume is bullish.”

Therefore volume must be modeled conditionally with price path, location and regime.

### Existing Formal volume fields
Already present:
- avgVolume20Lots
- avgAmount20
- volumeRatio (5d vs 20d)
- volumeTodayVsPrev5
- volumeContraction5to20
- liquidity gates
- some breakout-volume checks

DL-002 must not duplicate these as new factors.

### New conditional volume dimensions

#### 1. Base-wide activity trend
- volumeSlopeBase
- turnoverSlopeBase
- medianVolumeFirstHalf
- medianVolumeSecondHalf
- volumeCompressionRatio

Purpose:
measure whether activity gradually contracts through a base.

#### 2. Down-leg supply behavior
For each confirmed downswing:
- downLegVolumeTotal
- downLegVolumePerBar
- downLegMedianVolume
- downLegTurnover
- downLegReturnPct
- downLegVolumePerAbsReturn

Across contractions:
- sellingVolumeDecay
- sellingTurnoverDecay
- downLegEffortResultTrend

Hypothesis:
later pullbacks may show less selling effort or less price damage.

#### 3. Up-leg demand behavior
For each confirmed upswing:
- upLegVolumeTotal
- upLegVolumePerBar
- upLegReturnPct
- upLegVolumePerReturn
- positiveVolumeShare

Compare:
- upVsDownVolumeRatio
- upVsDownReturnEfficiency

#### 4. Final dry-up
Do not define dry-up as “volume below average” alone.

Record:
- finalDryUpVolumeRatio
- finalDryUpTurnoverRatio
- finalRangeCompression
- finalATRCompression
- finalCloseLocation
- distanceToPivot

A dry-up far below resistance during a weak decline is not the same as a dry-up in a tight high-level base.

#### 5. Breakout effort vs result
On breakout:
- breakoutVolumeRatio
- breakoutTurnoverRatio
- breakoutRangeATR
- breakoutClosePosition
- breakoutDistanceBeyondPivot
- breakoutNextDayAcceptance
- breakout3D_R01

Derived descriptive cases:
A. HIGH_EFFORT_HIGH_RESULT
B. HIGH_EFFORT_LOW_RESULT
C. LOW_EFFORT_HIGH_RESULT
D. LOW_EFFORT_LOW_RESULT

Do not presuppose which one is best.
Example falsification:
High volume + tiny price progress / long upper wick may be absorption/exhaustion rather than strength.

#### 6. Volume-price divergence
Pre-register simple, transparent diagnostics:
- priceSlope > 0 while volumeSlope < 0
- priceRangeCompression while volume contracts
- price flat while turnover expands
- new high on lower/higher volume relative to previous high

These are descriptors, not signals.

### Signed-volume proxy caution
Daily bars do not reveal buyer-initiated vs seller-initiated trade flow.
Classifying all volume on an up-close day as “buy volume” is only a proxy.

If used:
- call it UP_DAY_VOLUME / DOWN_DAY_VOLUME,
- never call it actual buying/selling pressure.

Potential fields:
- upDayVolumeRatio
- downDayVolumeRatio
- upDayTurnoverRatio
- downDayTurnoverRatio

### Turnover vs raw volume
Raw share volume is affected by:
- shares outstanding,
- stock price,
- liquidity regime.

Turnover value can be more comparable across price levels, while turnover rate relative to free float would be better if point-in-time shares/free-float data are reliable.

Do not invent historical free-float values.

### Volume context by pattern
VCP:
- successive down-leg volume decay + final dry-up.

Cup/Handle:
- handle-specific volume dry-up versus cup baseline.

W:
- LOW2 selling volume versus LOW1.

Flag:
- pole high participation + flag contraction.

Triangle/Platform:
- volume contraction into narrowing range.

HTF:
- extreme pole participation versus post-pole contraction.

Gap:
- overnight jump must be separated from intraday turnover response.

### Relation to attention
Large turnover/volume may be:
- information flow,
- attention,
- disagreement,
- forced trading,
- institutional participation.

DL-002W must be compared with existing Quiet/Attention research rather than calling volume “Smart Money.”

### Taiwan-specific hypothesis
Older Taiwan work suggests high-volume portfolios can lead low-volume portfolios in returns, consistent with different speeds of information adjustment.
Test only as context:
- high vs low activity within same liquidity bucket,
- do not mix this with absolute illiquidity.

### Redundancy / falsification
Control against:
- volumeTodayVsPrev5
- volumeContraction5to20
- avgVolume20
- avgAmount20
- volatility
- ret20
- Information Discreteness
- Quiet/Attention
- institutional flows

If detailed leg-volume features add no incremental value, retain only current simple volume metrics.

### Status
WORTH_SHADOW_RESEARCH.
No universal bullish/bearish interpretation assigned.
No Formal change.



## DL-002X — Pennant / Triangle Subclasses / Wedges v0.1

### Principle
These formations should be represented primarily by boundary geometry.
Named labels are subclasses of the DL-002N latent dimensions, not independent scores.

### Ascending Triangle
Geometry:
- upper boundary approximately horizontal,
- lower boundary rising,
- repeated resistance tests,
- higher lows,
- convergence.

Fields:
- upperSlope
- lowerSlope
- upperTouchCount
- lowerTouchCount
- resistanceDispersionPct
- supportFitResidual
- triangleCompressionRatio
- volumeSlope
- pivotDistancePct
- breakoutDirection
- R01Acceptance

Important:
Do not assign bullish outcome before breakout.
Practitioner material often observes upward breakouts more frequently, but downward breaks and false breaks occur.
Research must condition on actual breakout direction and acceptance.

### Descending Triangle
Mirror geometry:
- lower boundary approximately horizontal,
- upper boundary falling.

Fields mirror ascending triangle.
For a long-only system this is more likely a risk/context structure, but an upside breakout can still occur.
No automatic bearish exclusion is approved.

### Pennant
Pennant = short converging consolidation after a clear impulse/pole.

Required:
- explicit pole / impulse,
- short post-pole convergence,
- upper boundary descending,
- lower boundary ascending,
- contraction in range/ATR,
- volume behavior recorded.

Fields:
- poleReturnPct
- poleDurationBars
- poleEfficiency
- pennantDurationBars
- pennantInitialHeightPct
- pennantCurrentHeightPct
- upperSlope/lowerSlope
- convergenceRate
- pennantVolumeDryUp
- breakoutDirection
- breakoutVolumeRatio

Distinguish from Symmetrical Triangle:
- pennant requires a prior pole and shorter duration;
- symmetrical triangle does not require a pole.

Do not hard-code a duration cutoff until pre-registered independently of outcomes.

### Falling Wedge
Geometry:
- upper boundary falling,
- lower boundary also falling,
- boundaries converge,
- upper line usually declines faster than lower line.

Fields:
- upperSlope < 0
- lowerSlope < 0
- slopeDifference
- convergenceRate
- lowerLowSequence
- lowerHighSequence
- momentumDecay
- volumeSlope
- breakoutDirection
- priorTrendState

Traditional interpretation often treats falling wedge as bullish after resistance breakout.
Research interpretation:
- FALLING_WEDGE_TOPOLOGY is neutral until breakout/acceptance.
- classify REVERSAL_CONTEXT vs CONTINUATION_CONTEXT separately.

### Rising Wedge
Mirror:
- both boundaries rise,
- lower boundary rises faster,
- range narrows.

Traditionally considered bearish risk, but do not use as an automatic sell rule.
For long-only research it may serve as:
- exhaustion / late-stage diagnostic,
- failed-breakout context,
- overheat interaction.

### Boundary fit
All boundary subclasses use:
- confirmed swings only,
- robust line fitting,
- fit residual,
- touch count,
- volatility-normalized touch tolerance,
- as-of-date line versioning.

No future swings may improve a historical line.

### Classification rules
Given fitted upper/lower slopes:

PLATFORM:
- both approximately flat.

ASCENDING_TRIANGLE:
- upper ~ flat, lower > 0.

DESCENDING_TRIANGLE:
- lower ~ flat, upper < 0.

SYMMETRICAL_TRIANGLE:
- upper < 0, lower > 0.

FALLING_WEDGE:
- upper < 0, lower < 0, converging.

RISING_WEDGE:
- upper > 0, lower > 0, converging.

FLAG:
- upper/lower roughly parallel after pole.

PENNANT:
- symmetrical convergence after pole, short relative to pole/base context.

### Ambiguous geometry
If slope confidence intervals / fit residuals make two classes plausible:
- preserve both labels,
- lower label confidence,
- do not force a categorical winner.

This is a core anti-overfit behavior.

### Evidence posture
Ascending triangles and wedges are well-established practitioner classifications.
Direct modern Taiwan single-stock evidence is limited.
Their research value is mainly:
- structural compression,
- boundary slope,
- pivot clarity,
- failure/acceptance behavior.

### Redundancy
Most raw geometry already lives in DL-002N:
- compression
- support/resistance topology
- swing progression
- pivot clarity.

Therefore named subclasses should add little/no weight by themselves.

### Status
TOPOLOGY_SUBCLASSES_FROZEN_V0_1.
No Formal change.



## DL-002Y — Pattern Confidence / Ambiguity Profile v0.1

### Why no single score
A single PatternScore encourages:
- arbitrary weights,
- hidden double counting,
- outcome tuning,
- false precision.

v0.1 therefore uses a profile of independent confidence dimensions.

### Confidence dimensions

#### 1. DATA_QUALITY
Fields:
- openAvailable
- adjustedSeriesVerified
- rawSeriesVerified
- corporateActionStatusKnown
- dateContinuity
- duplicateFree
- sufficientHistory
- pointInTimeEligible

Status:
- COMPLETE
- PARTIAL
- BLOCKED

A BLOCKED critical field prevents the affected pattern family from being fully classified.

#### 2. NO_LOOKAHEAD_INTEGRITY
Fields:
- allSwingConfirmedAsOfDate
- provisionalLegUsed
- futureSuffixInvariant
- stateReplayVerified

Status:
- VERIFIED
- PROVISIONAL
- FAILED

FAILED invalidates the research observation.

#### 3. SCALE_STABILITY
Fields:
- microSupport
- baseSupport
- majorSupport
- scaleAgreementCount
- pivotDateDispersion
- structuralLevelDispersionPct

Status:
- HIGH_STABILITY
- MEDIUM_STABILITY
- LOW_STABILITY

#### 4. GEOMETRY_FIT
Pattern-specific raw descriptors:
- line residuals,
- rim symmetry,
- neckline clarity,
- contraction monotonicity,
- roundness descriptors,
- pole/channel fit.

Do not compress into one cross-pattern score.
Store:
- geometryFitComponents{}
- criticalGeometryViolation[]

#### 5. LEVEL_CLARITY
Fields:
- pivotCandidateCount
- pivotDispersionPct
- supportCandidateCount
- resistanceCandidateCount
- boundaryTouchCount
- necklineAmbiguity

Status:
- CLEAR
- MODERATE
- AMBIGUOUS

#### 6. MATURITY
Use family-specific state machine:
- FORMING
- STRUCTURE_VALID
- MATURE_PRE_BREAKOUT
- PIVOT_READY
- BREAKOUT_CONFIRMED
- RETEST_CONFIRMING
- FAILED

Maturity is not confidence.
A very clear pattern can still be immature.

#### 7. PATTERN_OVERLAP
Fields:
- patternLabels[]
- sharedSwingIds[]
- overlapCount
- latentFeatureOverlap
- contradictoryLabels[]

Status:
- UNIQUE
- NESTED
- OVERLAPPING
- CONFLICTED

#### 8. CONTEXT_COMPATIBILITY
Descriptive only:
- weekly/daily relationship
- trend context
- overheat conflict
- sector/market regime
- liquidity context
- attention/discreteness context

Do not treat “compatible” as proven alpha.

#### 9. EVIDENCE_TIER
External prior:
- TIER_1: stronger systematic/academic pattern-recognition support
- TIER_2: market-specific but specification-sensitive evidence
- TIER_3: practitioner hypothesis with weaker direct peer-reviewed alpha evidence

Evidence tier is NOT a stock-level score.
It describes confidence in the research hypothesis family.

### Summary object
A stock/pattern observation may expose:

patternConfidenceProfile = {
  dataQuality,
  noLookaheadIntegrity,
  scaleStability,
  levelClarity,
  maturity,
  overlapStatus,
  contextFlags[],
  evidenceTier
}

No total score in v0.1.

### Critical blockers
A pattern observation cannot be used for performance inference if:
- NO_LOOKAHEAD_INTEGRITY = FAILED
- pointInTimeEligible = false
- required OHLC fields missing
- corporate-action ambiguity directly affects the pattern
- insufficient history for the pattern family

Mark UNKNOWN/BLOCKED, never zero/negative.

### Pattern comparison
When comparing two patterns/stocks:
Do not say one has “higher confidence” unless the exact dimensions are stated.

Example:
- Stock A: clearer pivot, lower scale stability.
- Stock B: more stable across scales, but cup rim ambiguity.

This avoids an opaque ordinal ranking.

### Later research option
If a compact score becomes operationally necessary:
- pre-register it before forward outcomes,
- use transparent weights or a simple rule,
- benchmark against the raw profile,
- count it as a new experiment,
- do not optimize weights on the same validation sample.

### Status
CONFIDENCE_PROFILE_FROZEN_V0_1.
No aggregate score.
No Formal change.



## DL-002Z — Pattern Failure Timing / Acceptance Lifecycle v0.1

### Problem
A binary “breakout succeeded / failed” label hides materially different paths:
- same-day rejection,
- next-day failure,
- clean breakout followed by failed retest,
- initial continuation followed by delayed collapse,
- temporary failure followed by rapid reclaim.

These paths may have different implications for selection quality and execution.

### Keep frozen R01 as primary outcome
R01 remains the canonical research definition for successful vs false breakout over its fixed 3-day close-hold framework.

DL-002Z adds descriptive timing fields.
It does NOT replace R01.

### Breakout event timeline
At breakout date B0 store:
- pivotLevel
- breakoutClose
- breakoutExtensionPct
- breakoutVolumeRatio
- breakoutClosePosition
- patternStateAtBreak

Subsequent daily states:
B0_SAME_DAY
B1
B2
B3
and later descriptive continuation where data permits.

### Failure timing fields
- firstCloseBackInsideAt
- barsUntilFirstCloseBackInside
- firstCloseBelowPivotAt
- barsUntilBelowPivot
- maxExtensionBeforeFailurePct
- MFEBeforeFailure
- MAEBeforeFailure
- failureDepthPct
- failureDepthATR
- failureVolumeRatio
- retestOccurred
- retestAt
- retestHeld
- reclaimAfterFailure
- barsToReclaim
- newHighAfterReclaim

### Descriptive failure classes

IMMEDIATE_REJECTION
- breakout cannot hold through same/next close context.

EARLY_FAILURE
- initial break occurs but level fails within early post-break window.

RETEST_FAILURE
- breakout holds initially,
- price returns to pivot,
- retest closes/structures fail.

DELAYED_FAILURE
- meaningful extension occurs first,
- later returns below pivot after initial apparent success.

FAILED_THEN_RECLAIMED
- break fails,
- later reclaims pivot within tracked window.

ACCEPTED
- R01 success and no early structural rejection within primary window.

These labels are descriptive and must be mapped to frozen R01 rather than redefine success.

### Pattern-specific invalidation vs breakout failure
Separate:

PATTERN_INVALIDATION_PRE_BREAK
- structure breaks before valid breakout.

BREAKOUT_ACCEPTANCE_FAILURE
- valid breakout occurred, then failed.

EXECUTION_NO_ENTRY
- pattern may succeed, but Formal 15m rules never produced BUY.

TRADE_FAILURE
- actual entry occurred and later stop/exit outcome failed.

These are four different layers.

### Why this matters
A pattern can be:
- good Selection Alpha,
- poor Execution Alpha,
- or a genuine false structure.

Without timing separation those can be mistakenly combined.

### Retest quality fields
If a retest occurs:
- retestLowVsPivotPct
- retestCloseVsPivotPct
- retestVolumeRatio
- retestDurationBars
- retestRangeATR
- retestHigherLow
- retestReversalStrength
- daysFromBreakout

Do not assume low-volume retest is always good; test conditionally.

### Opportunity-cost path
For pattern-mature NO-BUY cases:
- if price breaks and never retests, mark BROKE_WITHOUT_ENTRY;
- track D1/D3/D5/MFE to estimate opportunity cost of conservative execution;
- do not relabel it a failed execution unless coverage is complete.

### R01 compatibility
Store:
- R01Outcome
- failureTimingClass
- timingFields{}

Example:
R01 = FAIL
failureTiming = RETEST_FAILURE

or:
R01 = SUCCESS
laterState = DELAYED_FAILURE after primary R01 window

This preserves comparability.

### No horizon shopping
Do not choose a 1D, 3D or 5D success rule because it produces the best pattern statistics.
R01 remains fixed.
Additional horizons are descriptive sensitivity analyses.

### Status
FAILURE_LIFECYCLE_FROZEN_V0_1.
No Formal change.



## DL-003A — Pattern Detection Algorithm Architecture Comparison v0.1

### Research question
Which detection architecture best fits this system's requirements:
- no look-ahead / repaint,
- as-of-date replay,
- transparent explanations,
- variable pattern duration,
- multi-scale stability,
- low overfit risk,
- direct redundancy testing against existing Formal features,
- practical compute cost for a Taiwan-stock research universe?

### Methods compared

#### A. Directional Change / confirmed swing segmentation
Mechanism:
- maintain a running price extreme,
- confirm reversal only after price moves by a pre-defined threshold in the opposite direction,
- separate the historical extremum (pivotAt) from the later confirmation point (confirmedAt).

External support:
Directional Change literature explicitly distinguishes extrema from later confirmation points and treats price moves beyond a threshold as event-time observations rather than fixed-clock samples.

Strengths:
- strongest chronology discipline for no-look-ahead research,
- naturally produces the HIGH/LOW sequence required by W, VCP, triangles, H&S and structural levels,
- easily records pivotAt vs confirmedAt,
- transparent and auditable,
- naturally multi-scale through pre-registered thresholds,
- low computational cost,
- easy to replay one bar at a time.

Weaknesses:
- threshold-sensitive,
- confirmation lag is unavoidable,
- very smooth/rounded structures may be reduced to only a few pivots,
- a volatility-normalized threshold still requires careful pre-registration.

Fit for our system:
PRIMARY SEGMENTATION CANDIDATE.

#### B. Perceptually Important Points (PIP)
Mechanism:
- iteratively select points whose geometric distance from the current simplified representation is largest,
- compress a long price path into a smaller set of visually important points.

Evidence:
Fu et al. use PIPs so sequences/templates of different lengths can be compared.
A later comparative segmentation study evaluated PIP, PAA, PLA and Turning Points and reported especially strong pattern-matching performance for PIP combined with rule-based/hybrid approaches.

Strengths:
- good dimensionality reduction,
- preserves human-visible shape,
- useful for variable-length pattern comparison,
- can simplify cups/flags/triangles cleanly,
- strong independent comparator to swing segmentation.

Weaknesses:
- classic full-window PIP can be hindsight-sensitive: adding future observations can change which earlier points are selected,
- number of PIPs is a parameter,
- a compressed “important” point is not automatically an economically confirmed swing,
- as-of-date replay must recalculate on each prefix; final-window PIPs cannot be backdated.

Fit:
SECONDARY RESEARCH DETECTOR / CROSS-CHECK.
Never treat full-history PIP points as if known historically.

#### C. Fixed-window Turning Points / local extrema
Mechanism:
- local high/low defined by N bars before/after.

Strengths:
- simple,
- intuitive,
- cheap,
- common in research preprocessing.

Weaknesses:
- using future bars to certify a local maximum/minimum creates explicit look-ahead if the pivot is timestamped at the extreme,
- fixed N behaves differently across volatility regimes,
- window length can create brittle pattern labels.

Fit:
BENCHMARK ONLY unless confirmation timestamp is shifted to the first date the future-window requirement is actually satisfied.
Not preferred as primary engine.

#### D. Rule-based topology
Mechanism:
- use explicit inequalities / geometry rules on segmented points:
  e.g. LOW1 -> MID_HIGH -> LOW2, boundary slopes, rim similarity, contraction sequence.

Evidence:
Formal chart-pattern-classification research has translated natural-language chart patterns into machine-readable rule specifications and shown rule-based identification can compete with template, Euclidean and DTW methods.

Strengths:
- highly interpretable,
- exact reason for pattern state can be stored,
- natural integration with our pattern maturity lifecycle,
- easy to identify overlap/redundancy,
- easy to enforce corporate-action/no-lookahead constraints.

Weaknesses:
- definitions can become brittle or hand-tuned,
- many inequalities create Factor-Zoo risk,
- natural-language patterns often have no universal numeric definition.

Fit:
PRIMARY CLASSIFICATION LAYER on top of confirmed swings.
Use continuous descriptors where possible, not dozens of hard pass/fail thresholds.

#### E. Template matching
Mechanism:
- compare normalized price shape to prototype/template.

Strengths:
- intuitively maps to visual charting,
- tolerates some deviation from exact textbook rules,
- useful for similarity benchmarking.

Weaknesses:
- template choice is subjective,
- normalization and pattern length can materially change matches,
- multiple templates per family can create hidden multiple testing,
- less transparent than topology rules when explaining why a stock was selected.

Fit:
SECONDARY BENCHMARK, not primary decision architecture.

#### F. Dynamic Time Warping (DTW)
Mechanism:
- nonlinearly align two sequences in time to minimize distance,
- can match similar shapes occurring at different speeds/durations.

Evidence:
Financial pattern-recognition research uses subsequence DTW and DTW-based representations because the method accommodates temporal shifts/warping.
One NYSE charting study found significant bearish-class prediction but not significant bullish performance, illustrating that algorithmic pattern matching does not imply universal directional alpha.

Strengths:
- handles variable speed/duration well,
- robust to temporal displacement,
- can find analogous shapes without hard swing definitions,
- useful independent benchmark.

Weaknesses:
- flexible warping can make structurally different paths appear similar,
- difficult to map distance back to a transparent trading rationale,
- warping constraints/normalization/template library create many tuning degrees of freedom,
- computationally heavier,
- risk of nearest-neighbor/data-snooping effects if historical future returns are used to select templates.

Fit:
RESEARCH BENCHMARK / NEAREST-SHAPE COMPARATOR.
Not primary Formal-facing detector.

#### G. Nonparametric Kernel Regression
Mechanism:
- smooth price series nonparametrically,
- identify geometric features/patterns from the smoothed path.

Evidence:
Lo, Mamaysky & Wang (Journal of Finance, 2000) used nonparametric kernel regression to automate detection of classic chart patterns and found several patterns carried incremental information relative to unconditional return distributions in their historical U.S. sample.

Strengths:
- important academic benchmark,
- smooths micro-noise,
- supports continuous shape recognition rather than exact point rules,
- useful for validating that topology findings are not artifacts of one swing algorithm.

Weaknesses:
- bandwidth selection matters materially,
- endpoint behavior near the latest bar is difficult,
- symmetric smoothing can accidentally use future neighbors unless one-sided/as-of-date implementation is enforced,
- harder to explain than swing topology,
- compute cost higher for broad rolling replay.

Fit:
ACADEMIC BENCHMARK / ROBUSTNESS CHECK.
If used historically, require one-sided/as-of-date smoothing for the current endpoint.

#### H. ML / neural / fuzzy classifiers
Mechanism:
- learn pattern representation or classification from labelled examples.

Strengths:
- can model complex nonlinear morphology,
- can combine price/volume/context,
- may reduce reliance on hand-written textbook definitions.

Weaknesses:
- labels themselves may be subjective,
- current prospective Formal/Shadow sample is small,
- high overfit risk,
- opaque feature interactions,
- difficult to prove incremental value versus existing Formal features,
- can silently learn future/regime artifacts if dataset construction is imperfect.

Fit:
DEFERRED.
Do not start here.
Only reconsider after a large, clean, point-in-time-labelled dataset exists.

### Architecture decision v0.1

PRIMARY PIPELINE:
1. adjusted/raw research OHLC with point-in-time provenance,
2. repaint-safe Directional Change / confirmed swing engine,
3. transparent rule/topology feature extraction,
4. continuous latent geometry descriptors,
5. pattern-family labels + maturity state,
6. confidence/ambiguity profile,
7. validation against existing Formal/Shadow outcomes.

SECONDARY INDEPENDENT CHECKS:
- PIP + rule/hybrid classifier,
- one-sided Kernel Regression morphology benchmark.

TERTIARY / EXPLORATORY:
- constrained DTW similarity.

DEFERRED:
- ML/neural/fuzzy learned classifier.

### Why this architecture fits the current trading system
The purpose of DL-002/003 is not to build a separate black-box stock picker.
It is to determine whether chart topology contains incremental information beyond current A/B logic.

Confirmed swings + transparent topology allow direct answers such as:
- “the stock has 3 progressively smaller contractions,”
- “the true W neckline is 4.2% above priorHigh20,”
- “the cup handle is in the upper 78% of the base,”
- “two candidate pivots disagree by 3.1%,”
instead of only:
- “DTW similarity = 0.87.”

This is essential for later redundancy/falsification work.

### No-lookahead requirements by method
Directional Change:
- pivotAt + confirmedAt mandatory.

PIP:
- recompute per as-of-date prefix; do not reuse final-window points.

Turning Points:
- confirmation timestamp must include the required future-window lag.

Rule-based:
- consume only point-in-time-eligible inputs.

DTW/template:
- query window ends at asOfDate; reference library may use only historical templates whose labels/outcomes would have been available under the experiment design.

Kernel regression:
- no symmetric future smoothing at the live endpoint; use causal/one-sided endpoint handling.

ML:
- purged temporal splits + point-in-time labels + no cross-window leakage mandatory.

### Algorithm comparison metrics before any return test
- prefixInvariance / repaint rate
- pivot/state confirmation delay
- pattern detection stability across scales
- cross-method agreement
- false positive rate on adversarial synthetic set
- computational cost
- pattern ambiguity rate
- data-blocked rate
- explainability coverage

Only after detector correctness is established should D1/D3/D5/D10/MFE/MAE be examined.

### Cross-method evidence design
For each as-of-date sample store:
- primarySwingPatternLabels
- pipPatternLabels
- kernelPatternLabels
- dtwNearestFamily (exploratory)
- crossMethodAgreement
- disagreementReason

Strongest research case:
a topology effect survives materially different detectors.

Weak case:
the “pattern” exists only under one brittle segmentation/template choice.

### Status
DETECTOR_ARCHITECTURE_FROZEN_V0_1.
No production detector implemented yet.
No Formal Core change.


## DL-003B — Isolated Pattern Research Data Schema / Replay Contract v0.1

### Objective
Design a research-only storage contract that can reproduce any historical pattern state exactly as it was knowable on date t, without mutating the shared Formal history cache.

This is a specification only. No production schema is created by this research note.

### Isolation requirements
The Pattern Research data path must:
- not feed Formal A/B selection,
- not alter v7_history_cache,
- not alter live monitor data,
- not alter 3+3+3 pools,
- not alter capital or push logic,
- remain removable without changing formal outputs.

If implemented under these constraints it can be treated as Class A research infrastructure. Reusing/changing shared Formal cache would be Class B.

### Proposed logical tables

#### 1. pattern_price_bars
Purpose:
point-in-time source OHLC and adjusted morphology series.

Logical key:
(symbol, trade_date, adjustment_mode, source_version)

Fields:
- symbol
- market
- trade_date
- adjustment_mode: RAW / ADJUSTED
- open
- high
- low
- close
- volume_shares
- turnover
- change
- adjustment_factor if explicitly available/derived reproducibly
- source_name
- source_query_from
- source_query_to
- fetched_at
- source_payload_hash
- corporate_action_status
- corporate_action_type
- point_in_time_eligible
- data_quality_flags_json

Rules:
- RAW and ADJUSTED bars are separate rows or logically separate fields; never overwrite one with the other.
- duplicate symbol/date/mode is rejected or reconciled by explicit source-version policy.
- missing OPEN remains null/blocked; never infer from close.

#### 2. pattern_swing_events
Purpose:
repaint-safe confirmed swing hierarchy.

Logical key:
(symbol, scale, confirmed_at, swing_sequence)

Fields:
- symbol
- scale: MICRO / BASE / MAJOR
- swing_sequence
- swing_type: HIGH / LOW
- pivot_at
- confirmed_at
- pivot_price_adjusted
- pivot_price_raw_mapped
- extreme_high
- extreme_low
- threshold_at_leg_start_pct
- threshold_at_leg_start_atr
- leg_start_at
- leg_start_confirmed_at
- bars_in_leg
- amplitude_pct
- volume_stats_json
- provisional=false for persisted confirmed swing rows
- detector_version
- data_snapshot_hash

Critical:
confirmed_at is the first date the swing became knowable.
Queries for as-of t must filter confirmed_at <= t.

#### 3. pattern_structural_levels
Purpose:
store point-in-time support/resistance/neckline/rim/pivot hypotheses.

Fields:
- symbol
- as_of_date
- level_id
- level_type
- pattern_family
- adjusted_level
- raw_level_mapped
- source_swing_ids_json
- touch_count
- fit_residual
- dispersion_pct
- clarity_status
- provisional
- detector_version
- snapshot_hash

Examples:
- W_NECKLINE
- CUP_LEFT_RIM
- CUP_RIGHT_RIM
- VCP_PIVOT
- PLATFORM_RESISTANCE
- TRIANGLE_UPPER_AT_ASOF
- WEEKLY_MAJOR_RESISTANCE

#### 4. pattern_state_snapshots
Purpose:
canonical as-of-date detector output.

Logical key:
(symbol, as_of_date, detector_version)

Fields:
- symbol
- as_of_date
- detector_version
- bar_data_through
- pattern_labels_json
- pattern_states_json
- latent_geometry_json
- confidence_profile_json
- overlap_map_json
- context_json
- blocked_reasons_json
- source_swing_ids_json
- structural_level_ids_json
- no_lookahead_verified
- data_snapshot_hash
- generated_at

This is the primary replay/audit object.

#### 5. pattern_detector_replay_audit
Purpose:
prove historical state reproducibility.

Fields:
- symbol
- as_of_date
- detector_version
- original_snapshot_hash
- replay_snapshot_hash
- exact_match
- mismatch_paths_json
- input_bar_hash
- input_swing_hash
- replayed_at

Any non-explained mismatch is a detector integrity failure, not an investment result.

#### 6. pattern_method_comparison
Purpose:
compare primary swing/rule detector with independent research methods.

Fields:
- symbol
- as_of_date
- primary_labels_json
- pip_labels_json
- kernel_labels_json
- dtw_nearest_family_json
- agreement_status
- disagreement_reason_json
- method_versions_json

No method is selected by future return.

#### 7. pattern_outcome_link
Purpose:
link frozen pattern snapshots to existing research outcomes without modifying those outcomes.

Fields:
- symbol
- scan_date/as_of_date
- cohort_type
- formal_pool
- existing_research_row_id or stable reference
- R01_outcome
- D1/D3/D5/D10/D20 references
- MFE/MAE references
- execution_coverage_status
- formal15_buy_status
- link_generated_at

Important:
prefer references to canonical outcome records rather than copying/recomputing them differently.

### Source snapshot hashing
Every detector state should be tied to deterministic input hashes:
- bar hash
- swing hash
- structural-level hash
- detector config/version hash

Purpose:
if a later source correction changes a historical bar, the research system can tell whether a changed pattern state came from:
- corrected source data,
- changed detector code,
- changed parameters,
rather than silently rewriting history.

### Detector versioning
Example semantic identity:
PATTERN_DETECTOR_0_1

Freeze:
- swing threshold semantics,
- scale set,
- topology definitions,
- maturity-state definitions,
- corporate-action handling,
- raw/adjusted mapping,
- line fitting rules.

Changing any of these produces a new detector version.
Do not overwrite old state snapshots.

### As-of-date replay contract
For any symbol S and date T:

REPLAY(S,T,V) must:
1. load only bars with trade_date <= T,
2. use the same source/adjustment semantics as version V,
3. rebuild confirmed swings where confirmed_at <= T,
4. derive structural levels only from eligible swings,
5. run topology detectors,
6. produce state snapshot,
7. match the stored snapshot hash for S,T,V.

Future bars may not alter the stored historical snapshot under the same detector version.

### Prefix-invariance test
For a full history ending Tn:
For each historical T:
- stateA = detect(history <= T)
- stateB = detect(fullHistory, asOf=T)

Require:
stateA == stateB
for all confirmed/non-provisional fields.

This becomes a mandatory detector regression test.

### Corporate-action provenance
If adjusted history can be revised by the data vendor after future corporate actions, preserve enough provenance to know which adjusted series/version was used.

Preferred:
- store raw bars permanently,
- store adjusted bars/factor as actually fetched,
- hash source payload,
- do not silently regenerate an old snapshot from a newly revised adjustment convention and claim it is identical evidence.

### Retention / size discipline
Do not store every possible derived field as a new SQL column initially.
Prefer:
- core keys/provenance columns,
- versioned JSON for feature vectors,
until the feature set stabilizes.

This reduces schema churn and avoids shared-runtime pressure.

### Replay observability
Research dashboard/report should expose:
- bar coverage %
- OPEN coverage %
- adjusted/raw pair coverage %
- corporate-action-known %
- replay exact-match %
- no-lookahead verified %
- detector-blocked %
- scale-stability distribution
- cross-method disagreement %
- compute duration

These are evidence-quality metrics, not alpha metrics.

### Status
DATA_SCHEMA_AND_REPLAY_CONTRACT_FROZEN_V0_1.
Specification only.
No D1 schema or Worker runtime changed.


## DL-003C — Detector Implementation Order / Evidence Gates v0.1

### Principle
Do not implement all named patterns at once.
Build from lowest-level invariant components upward so each layer can be falsified independently.

### Phase 0 — Data contract
Build/validate only in isolated research path:
- RAW OHLC
- ADJUSTED OHLC
- volume/turnover
- corporate-action status
- source/provenance/hash
- long enough trailing horizon
- point-in-time eligibility

Exit gate:
- date continuity verified,
- duplicate-free,
- required OPEN coverage for candlestick lanes,
- raw/adjusted mapping reproducible,
- no shared Formal output changes.

### Phase 1 — Swing engine
Implement DL-002H only:
- MICRO / BASE / MAJOR
- pivotAt / confirmedAt
- frozen lagged-ATR threshold per leg
- provisional last leg
- prefix-invariance replay

Exit gate:
- synthetic swing cases pass,
- prefix-invariance exact for confirmed states,
- same-day OHLC ambiguity cannot create impossible ordering,
- scale-stability diagnostics emitted,
- no future suffix changes historical confirmed swings.

No named patterns yet.

### Phase 2 — Structural levels
From confirmed swings derive:
- support/resistance zones
- true W neckline
- repeated horizontal boundaries
- sloped boundary candidates
- pivot ambiguity
- level clarity

Exit gate:
- all levels cite source swing IDs,
- no line uses a swing confirmed after asOfDate,
- adversarial unrelated old-high cases do not overwrite true neckline,
- raw/adjusted level mapping is explicit.

### Phase 3 — Highest-priority topology
Implement first:
1. W / Double Bottom
2. VCP
3. Horizontal Platform

Reason:
- directly addresses current-system gaps,
- does not require historical OPEN,
- topology is relatively transparent,
- W has stronger general chart-pattern research pedigree,
- VCP tests genuinely new contraction sequence information,
- Platform directly compares against existing platformRange20Pct.

Exit gate per family:
- positive synthetic examples detected,
- negative/adversarial examples rejected,
- overlap with current Formal fields reported,
- state replay exact,
- no returns inspected for threshold tuning.

### Phase 4 — Long-base / continuation topology
Implement:
4. Cup / Cup-with-Handle
5. Bull Flag
6. Symmetrical/Ascending/Descending Triangle
7. Pennant / Wedges
8. multi-peak/multi-trough reversal family

Prerequisite:
- longer research horizon available.
- cross-pattern shared-swing mapping working.

Exit gate:
- nested patterns can coexist without duplicate evidence,
- ambiguous families preserved rather than forced,
- line-fit/pivot ambiguity exposed.

### Phase 5 — Multi-timeframe context
Build weekly context from adjusted daily/weekly data:
- weekly swings
- major support/resistance
- parent/child pattern relationship

Exit gate:
- weekly context adds no duplicate count,
- daily state does not depend on future weekly close,
- week aggregation respects Taiwan trading calendar.

### Phase 6 — Candlestick / gap families
Implement only after OPEN + corporate-action readiness:
- Piercing / Engulfing / Harami
- Morning/Evening Star
- Soldiers / Three Methods
- Opening gap / true gap / Three Gaps / island structures

Exit gate:
- ex-right/ex-dividend synthetic tests pass,
- corporate-action gaps are excluded,
- named labels and raw relational OHLC representation both stored.

### Phase 7 — Independent detector benchmarks
Add:
- PIP + rule/hybrid
- one-sided/as-of-date Kernel Regression
- constrained DTW exploratory similarity

Purpose:
robustness, not replacement.

Exit gate:
- cross-method agreement/disagreement available,
- no detector selected based on forward returns.

### Phase 8 — Prospective Shadow linkage
Only after detector correctness:
- append research snapshot diagnostics to prospective existing Shadow cohorts,
- no eligibility/ranking impact,
- link to existing outcome framework.

Exit gate:
- protected Formal outputs byte/semantically identical on frozen inputs,
- research data gaps never become BAD/0,
- point-in-time lineage complete.

### Phase 9 — Outcome evaluation
Use existing:
- D1/D3/D5/D10/D20
- MFE/MAE
- R01
- execution coverage / BUY status

Do not create R09 until:
- detector definitions frozen,
- data coverage sufficient,
- redundancy mapped,
- cohort linkage prospective and stable.

### Detector observability / health metrics
Every research run should report:

DATA:
- symbols requested
- symbols with complete raw/adjusted bars
- OPEN coverage
- corporate-action-known coverage
- horizon coverage

INTEGRITY:
- replay exact-match rate
- prefix-invariance failures
- no-lookahead failures
- duplicate/date errors
- blocked observations

STRUCTURE:
- swing count by scale
- confirmation-lag distribution
- low-stability share
- pivot-ambiguity share
- pattern overlap/conflict rate

METHOD ROBUSTNESS:
- primary vs PIP agreement
- primary vs kernel agreement
- exploratory DTW family agreement
- method-disagreement rate

COMPUTE:
- bars processed
- symbols/sec
- storage growth
- API calls
- runtime failures

OUTCOME metrics are deliberately not part of detector health.

### Stop conditions
A detector family should NOT advance to outcome testing if:
- replay mismatch exists,
- future-prefix invariance fails,
- required source data are missing,
- synthetic false positives are unresolved,
- definition changed after looking at outcomes without registering a new version.

### Status
IMPLEMENTATION_ORDER_AND_GATES_FROZEN_V0_1.
No research code deployed.
No Formal change.


## DL-003D — 2026-09-24 As-of-Date Sanity Check Exposed a Formal History-Freshness Defect

### Purpose
Use current 2026-09-24 Formal selections only as outcome-free detector/data sanity examples. No future 2026-09-29 trading outcome was used and no pattern parameter was tuned to returns.

Symbols checked:
- 2006 東和鋼鐵 — Formal B selection
- 4977 眾達-KY — Formal A selection
- 6683 雍智科技 — Hybrid WATCH context

Source:
Fugle adjusted/raw daily candles through 2026-09-24.

### Swing-scale sanity falsification
The pre-registered swing v0.1 family k=1/2/3 × lagged ATR was run without inspecting future returns.

Observed confirmed-swing counts in 2026 YTD:
- 2006: k1=20, k2=8, k3=3
- 4977: k1=22, k2=8, k3=4
- 6683: k1=25, k2=6, k3=6

Problem:
For high-volatility names the larger scales produced frozen thresholds around 15%-30%. In 6683, k2 and k3 produced almost the same major sequence, so the labels MICRO/BASE/MAJOR are not yet justified as comparable structural scales across stocks.

Conclusion:
- v0.1 swing chronology remains useful,
- but fixed k=1/2/3 ATR multiples are NOT yet validated scale semantics,
- do not tune k from future returns,
- next calibration should use detector-only targets such as event-frequency/stability across volatility buckets or another pre-registered scale construction.

### Unexpected Formal data discrepancy
The production 2026-09-24 research snapshot for 2006 recorded:
- breakoutReferencePriceResearch = 84
- ret5 = 8.6633663366
- ret10 = 8.6633663366
- ret20 = 9.75
- volumeTodayVsPrev5 = 1.7670162029
- volumeContraction5to20 = 0.6384707904
- atrPercent = 2.3690205011

Complete Fugle daily candles show:
- 2026-09-18 high = 89
- therefore true priorHigh20 at 2026-09-24 = 89, not 84.

Raw and adjusted 2026-08-01..2026-09-24 bars agree on this; no recent corporate-action difference explains it.

### Exact stale-cache reconstruction
Take the complete Fugle history, remove trading dates:
- 2026-09-14
- 2026-09-15
- 2026-09-16
- 2026-09-17
- 2026-09-18
- 2026-09-21
- 2026-09-22
- 2026-09-23
and then append 2026-09-24.

This reconstructed sequence reproduces the production research snapshot EXACTLY for both 2006 and 4977 on:
- ret5
- ret10
- ret20
- priorHigh20
- volumeTodayVsPrev5
- volumeContraction5to20
- ATR percent

All compared numeric differences were exactly zero within floating-point representation.

This establishes that the production 9/24 selection features were calculated from a history sequence effectively ending 9/11 plus the 9/24 current bar.

### Root cause in source
runHistorySeed rebuilds its daily queue when marketDate changes, but its completeCached definition checks only:
- symbol is in target set,
- history is an array,
- history.length >= 60.

It does NOT require:
- latest cached bar date == marketDate,
- recent trading-date continuity,
- no missing recent trading sessions.

Therefore an old 60+ bar cache can be treated as complete on a later trading date and excluded from refresh.

The 18:10 scan then explicitly performs no emergency history warmup and merges cachedHistory into enrichment, so current-day market data can be appended to a stale historical sequence.

### Formal impact test
Recompute the current Formal A/B K-line gates from complete raw Fugle daily candles using the same code formulas.

2006:
Stale reconstructed history:
- B trend=true
- breakout=true
- volume=true
- strongClose=true
- upperShadow=true
- notLate=true
- B.pass=true

Complete history:
- priorHigh20=89
- close=87.8
- volumeTodayVsPrev5=0.5794
- B breakout=false
- B volume=false
- B.pass=false
- A.pass=false

Therefore 2006 would NOT pass the current Formal A/B technical setup gate with complete daily history.

4977:
Stale:
- A.pass=true
- ret20=+6.6456%

Complete:
- A.pass=true
- ret20=-1.7493%
- support/ATR/volume metrics materially differ.

Thus 4977 remains technically A-eligible under this narrow gate recreation, but its full ranking/RR/final selection must be recomputed with complete history before claiming the original final selection remains valid.

### Research integrity consequence
The 2026-09-24 Formal result must not be used as clean evidence for K-line/pattern research without a DATA_QUALITY_STALE_HISTORY tag.

Especially:
- 2006 cannot be treated as a valid B-breakout example for DL-002.
- Any 9/24 factor/outcome analysis depending on the corrupted rolling history must be revalidated after data repair.
- This issue is data integrity, not negative market evidence.

### Engineering classification
Fixing the shared Formal history-refresh/freshness contract is Class B:
- shared runtime/data path,
- can change future candidate eligibility,
- proposal/branch/test allowed,
- production merge/deploy requires owner approval.

### Minimal safe fix direction
At daily seed queue rebuild, cached history must not be considered complete solely by bar count.
At minimum require current-date freshness semantics.
Prefer an explicit function returning:
- barCountSufficient
- latestBarDate
- expectedMarketDate
- recentContinuityStatus
- staleReason

Candidate selection should fail closed/UNKNOWN for stale recent history rather than calculate rolling features across a multi-session gap.

No Formal thresholds need to change.

### Status
CONFIRMED_DATA_INTEGRITY_DEFECT.
2006_2026_09_24_B_SETUP_INVALID_UNDER_COMPLETE_HISTORY.
Formal Core rules themselves remain unchanged.


## DL-002J — Cup-with-Handle / Coffee-Cup Topology v0.1

### Goal
Turn the visual “cup / coffee cup / cup-with-handle” idea into an as-of-date topology that can be tested without hindsight.

### Structural anchors
Use confirmed BASE/MAJOR swings from DL-002H on adjusted OHLC.
A candidate cup requires chronological anchors:
L = left rim confirmed swing high
B = cup-bottom region / confirmed swing low cluster
R = right-side recovery high or current recovery leg
H = optional handle trough after R
P = pivot / rim resistance

Do not scan a future-complete window and then backdate the cup start.

### Prior-trend requirement
A cup is a continuation/base hypothesis, not merely any U-shaped recovery after a collapse.
Record before L:
- priorAdvancePct
- priorAdvanceDuration
- MA20/MA60 state
- Residual RS if available
- majorSwingTrend
Do not hard-code one pass threshold yet; test whether prior trend is necessary after controlling current Formal trend factors.

### Cup depth
cupDepthPct = (rimReference - bottomReference) / rimReference.
Store depth continuously; do not pre-select one “ideal” depth from practitioner literature.
Also normalize:
- cupDepthATR
- cupDepthVsPriorAdvance
- maxDrawdownWithinCup

### Rim relationship
leftRim = L price.
rightRim = confirmed recovery high R if known; otherwise current recovery is PROVISIONAL.
Measure:
- rimDiffPct = abs(R-L)/L
- rightRimVsLeftPct
- rightSideRecoveryPct
- daysLeftToBottom
- daysBottomToRight
A visually symmetric cup is a hypothesis, not a requirement.

### Roundness — avoid subjective U vs V labels
Represent bottom shape numerically:
1. bottomResidenceRatio: fraction of cup duration spent in the lower X% of cup depth.
2. recoveryAsymmetry: abs(daysLeftToBottom - daysBottomToRight) / cupDuration.
3. bottomTurnCount: number of confirmed MICRO swings around the bottom region.
4. slopeChangeSmoothness: dispersion of rolling normalized slopes around B.
5. vShapeScore: speed of decline + speed of immediate recovery with little bottom residence.
6. roundnessScore: composite descriptive score from residence/slope/turn structure, not a trading score.

Do not choose X or composite weights from forward returns; pre-register geometric variants before testing.

### Handle topology
Handle can exist only after substantial right-side recovery.
Handle anchors:
R = right-side high
H = subsequent confirmed/provisional pullback low
P = rim/pivot reference

Measure:
- handleDepthPct = (R-H)/R
- handleDepthVsCupDepth
- handleDurationDays
- handlePositionInCup = (H-B)/(rimReference-B)
- handleRangeCompression
- handleVolumeDryUp
- handleDownVolumeRatio
- handleHigherLow vs recent right-side structure
- handleDistanceToPivotPct

Practitioner guidance often prefers a shallow handle in the upper half and drying volume. These remain hypotheses to test, not assumed alpha.

### Handle-free cup
Do not force every valid cup to have a handle.
Keep separate labels:
- CUP_ONLY
- CUP_WITH_HANDLE
This permits testing whether the handle adds incremental information rather than defining success by tradition.

### Pivot
Candidate pivot references:
- left rim,
- right rim,
- resistance cluster from confirmed swing highs,
- volume-weighted resistance cluster if later justified.

Store:
- pivotPrimary
- pivotSecondary
- pivotDispersionPct
- pivotSource
If left/right rim disagreement is large, confidence decreases; do not force a precise pivot.

### Lifecycle
CUP_FORMING
-> BOTTOM_FORMING
-> RIGHT_SIDE_RECOVERY
-> CUP_VALID
-> HANDLE_FORMING (optional)
-> HANDLE_TIGHT
-> PIVOT_READY
-> BREAKOUT_CONFIRMED
-> RETEST_CONFIRMING
-> FAILED

A later breakout must never retroactively label an earlier date PIVOT_READY unless the required state was knowable then.

### Failure modes
- DEEPENING_BASE: new low materially expands cup depth.
- RIGHT_SIDE_FAILURE: recovery fails and structure breaks before rim approach.
- HANDLE_TOO_DEEP: descriptive flag; threshold to be pre-registered, not outcome-tuned.
- HANDLE_VOLUME_EXPANSION: selling volume expands during handle.
- PIVOT_AMBIGUITY: resistance references disagree materially.
- LOCAL_ONLY_BREAKOUT: closes above priorHigh20 but remains below older cup rim / major structural resistance.
- BREAKOUT_FAILURE_R01: reuse existing R01 failure outcome.

### Key hypothesis versus current Formal B
Current B breakout uses priorHigh20 as an important qualification reference, while cup topology may span much longer.
The critical test is NOT “replace priorHigh20.”
Test:
- B breakout above priorHigh20 but below cup/major pivot;
- breakout above both;
- cup pivot breakout without a clean 20d textbook setup;
and compare D1/D3/D5/D10, MFE/MAE and R01 failure.

This directly tests whether some current “breakouts” are only local breakouts under older supply.

### Redundancy map
Likely existing/derived:
- prior trend
- pullback depth
- volume contraction
- priorHigh20/priorHigh60
- support distance
- ATR / volatility
New topology:
- rim relationship
- bottom residence / roundness
- recovery asymmetry
- handle position relative to full cup
- cup-vs-handle depth relationship
- local breakout vs major cup pivot conflict
- lifecycle maturity

### Status
DEFINITION_FROZEN_V0_1 after commit.
Research/Shadow only. No Formal change.

## DL-002K — W / Double-Bottom Topology v0.1

### Goal
Replace the current crude split-window “leftLow/rightLow” proxy with a true chronological two-trough topology, while explicitly testing whether topology adds information beyond the existing proxy.

### Required anchors
L1 = first confirmed swing low
N = confirmed intervening swing high
L2 = second confirmed swing low
P = neckline at N or a resistance cluster centered on N

Chronology must be L1 < N < L2.
Both lows must be confirmed as-of-date under DL-002H. Current forming L2 can be PROVISIONAL but cannot be treated as a confirmed W.

### Core measurements
- low1Price
- necklinePrice
- low2Price
- bottomSpacingDays
- firstLegRecoveryPct
- secondLowVsFirstPct
- troughSimilarityPct
- necklineHeightPct
- secondBottomVolumeRatio
- secondBottomSellingVolumeRatio
- reclaimSpeedDays
- pivotDistancePct
- necklineBreakoutVolumeRatio
- scaleAgreement
- confirmationLagBars

### Three right-foot hypotheses
Do not assume the current preference for rightFootHigher is universally superior.
Classify:
A. HIGHER_LOW: L2 > L1 by a pre-registered tolerance.
B. EQUAL_ZONE: L2 approximately equals L1.
C. UNDERCUT_RECLAIM: L2 undercuts L1, then rapidly reclaims the L1 zone.

Undercut-and-reclaim may represent stop/liquidity sweep or may simply be structural weakness. Test both possibilities.

### Neckline
Current system's necklineProximityPct uses priorHigh20 as an approximation.
DL-002K neckline is the actual confirmed intervening swing high N.
Also store:
- priorHigh20
- actualNeckline
- necklineVsPriorHigh20Pct
- priorHigh60
This allows direct measurement of whether priorHigh20 is a good proxy or materially wrong.

### Volume hypotheses
Test separately:
- L2 volume lower than L1: possible selling exhaustion.
- L2 down-volume lower than L1 down-volume.
- neckline breakout volume expansion.
Do not combine into one score initially.

### Lifecycle
W_FIRST_BOTTOM
-> W_NECKLINE_FORMED
-> W_SECOND_BOTTOM_FORMING
-> W_SECOND_BOTTOM_CONFIRMED
-> W_PIVOT_READY
-> W_BREAKOUT_CONFIRMED
-> W_RETEST_CONFIRMING
-> FAILED

### Failure modes
- LOWER_LOW_CONTINUATION: L2 undercut does not reclaim and decline continues.
- NECKLINE_DEGRADES: later resistance structure invalidates the original neckline interpretation.
- SECOND_BOTTOM_SELLING_EXPANSION.
- BREAKOUT_FAILURE_R01.
- TOO_SHORT_NOISE / TOO_LONG_REGIME_CHANGE as descriptive duration flags; thresholds must be pre-registered.

### Incremental test against current proxy
Within the same date compare:
1. current rightFootHigher=true + true W topology;
2. current rightFootHigher=true but no true W topology;
3. true W topology with EQUAL_ZONE or UNDERCUT_RECLAIM where rightFootHigher=false;
4. neither.

This is the cleanest way to determine whether the new topology adds value or merely renames the existing feature.

### Status
DEFINITION_FROZEN_V0_1 after commit.
Research/Shadow only. No Formal change.


## DL-002L — Flag / Pennant / Platform Continuation Topology v0.1

### Goal
Separate genuine continuation compression after an impulse from ordinary sideways noise or late-stage exhaustion.

### Impulse / pole
Identify a confirmed upward impulse preceding consolidation.
Measure:
- poleReturnPct
- poleDurationDays
- poleReturnPerDay
- poleVolumeExpansion
- poleATRExpansion
- priorBaseBreakoutContext
- residualRSDuringPole

Do not require an arbitrary huge pole; retain continuous values.

### Consolidation geometry
From pole high to current/base end:
- consolidationDepthPct
- consolidationDurationDays
- upperBoundarySlope
- lowerBoundarySlope
- rangeCompressionSlope
- volumeDryUpSlope
- downDayVolumeRatio
- distanceToPoleHighPct
- lowerBoundaryHigherLowRate

Classify geometry descriptively:
- FLAG_DOWN_CHANNEL
- PENNANT_CONVERGING
- FLAT_PLATFORM
- EXPANDING_RANGE
The last is a negative/control morphology, not a bullish named pattern.

### Continuation quality hypotheses
Potentially constructive:
- impulse strength without late-stage overheat,
- consolidation shallower than impulse,
- declining volume during consolidation,
- contracting range,
- price remains relatively near the pole high,
- selling-volume decay,
- breakout with renewed range/volume expansion.

Potentially adverse:
- deep retracement,
- expanding range,
- repeated high-volume selloffs,
- lower lows,
- long stagnation that converts a continuation setup into a different base/regime,
- breakout under older structural resistance.

### Platform relationship to current Formal
Current Formal already has platformRange20Pct and B breakout logic.
Therefore a new “platform=true” variable is redundant.
Incremental candidates are:
- preceding impulse/pole quality,
- boundary slopes,
- contraction trajectory,
- consolidation depth relative to pole,
- selling-volume decay,
- older-resistance conflict,
- continuation lifecycle.

### Lifecycle
IMPULSE
-> CONSOLIDATING
-> COMPRESSION_VALID
-> PIVOT_READY
-> BREAKOUT_CONFIRMED
-> RETEST_CONFIRMING
-> FAILED

### Failure
Reuse R01 after breakout.
Before breakout:
- IMPULSE_ERASED
- RANGE_EXPANSION
- SELLING_VOLUME_EXPANSION
- STRUCTURAL_LOWER_LOW
- STALE_BASE

No Formal change.

## DL-002M — Pattern Confidence Is Not Pattern Score

### Principle
Do not create one opaque “K-line score” by summing VCP + cup + W + flag + candles.
Many named patterns can describe the same underlying path and would double-count the same price/volume information.

### Separate three dimensions
1. FIT_CONFIDENCE:
How well observed geometry matches the frozen pattern definition.
2. STABILITY_CONFIDENCE:
Whether the pattern persists across neighboring swing scales / small definition perturbations.
3. INCREMENTAL_EVIDENCE:
Whether the feature adds outcome information after controlling existing Formal and DL-001 variables.

Only the third dimension can eventually justify a production-review proposal.

### Pattern overlap graph
Record overlap between pattern families:
- VCP <-> platform/pennant
- cup handle <-> VCP in handle
- W bottom <-> cup bottom
- flag <-> short platform
- candlestick confirmation <-> daily close/wick quality

For every candidate/date store all matching families rather than forcing one label.
Later estimate whether one family contributes after conditioning on the others.

### No double reward
If a cup handle is also a VCP, that is not automatically “two bullish votes.”
It may be one underlying compression phenomenon expressed through two taxonomies.

### Negative-pattern controls
Build explicit adverse morphology controls:
- EXPANDING_VOLATILITY
- LOWER_HIGH_LOWER_LOW
- HIGH_VOLUME_DISTRIBUTION
- FAILED_BREAKOUT_CLUSTER
- LATE_STAGE_WIDE_LOOSE
- V_SHAPED_UNSTABLE_RECOVERY

Positive pattern research without negative controls risks merely selecting volatile winners after the fact.

### Research implication
The eventual Pattern Shadow output should look like a diagnostic vector, e.g.:
patternFamiliesMatched
maturityByFamily
fitConfidenceByFamily
stabilityByFamily
adverseMorphologyFlags
overlapCluster
incrementalEvidenceStatus

It should not output a production BUY score during the research phase.


## DL-002N — Sakata / Candlestick Sequence Research Framework v0.1

### Position
Sakata and candlestick names are treated as a historical taxonomy and interpretability layer. The research object is the underlying OHLC sequence conditional on trend, location, volatility and volume.

### Feature normalization
For each bar t:
- bodyPct = abs(C-O)/priorClose
- bodyATR = abs(C-O)/ATR20_lag
- upperWickATR = (H-max(O,C))/ATR20_lag
- lowerWickATR = (min(O,C)-L)/ATR20_lag
- closeLocation = (C-L)/(H-L)
- gapFromPrevCloseATR = (O-Cprev)/ATR20_lag
- rangeATR = (H-L)/ATR20_lag
- volumeVs20
- turnoverVs20
- priceLimitProximity
- corporateActionTag

For sequences retain relational ordering rather than only names.

### Named patterns as labels
Examples to encode after OPEN data readiness:
- Bullish/Bearish Engulfing
- Piercing / Dark Cloud Cover
- Harami
- Hammer / Hanging Man
- Morning / Evening Star
- Three White Soldiers / Three Black Crows
- Rising / Falling Three Methods
- gap sequences related to Three Gaps

Each label must specify:
- exact OHLC inequalities,
- body/range minimums if used,
- required prior trend,
- location context,
- whether gaps are required,
- corporate-action exclusion.

### Sakata Five Methods mapping
Three Mountains:
- research as repeated-top / head-and-shoulders / multi-peak topology, not a mystical fixed formation.

Three Rivers:
- research as repeated-bottom / inverse-head-and-shoulders / multi-trough topology.

Three Gaps:
- research as sequential gap events, with strict corporate-action and price-limit controls.

Three Soldiers:
- research as directional multi-bar body sequence with body/wick/range/volume normalization.

Three Methods:
- research as trend -> controlled counter-move/consolidation -> continuation sequence.

### Context interaction
A candle sequence may have opposite meaning depending on location.
Required contextual tags:
- priorTrendState
- distanceToSupport
- distanceToResistance
- patternMaturityContext (e.g. inside handle, at W second bottom, after breakout)
- marketRegime
- liquidityTier
- priceTier

Research question:
Does a candle sequence add information as a confirmation event inside a larger topology?
Example:
Bullish Engulfing at W second bottom may be different from the same two bars in the middle of a random range.

### Interaction testing discipline
Do not enumerate every candle x every pattern x every regime combination.
Pre-register a small mechanism-driven set:
1. bullish reversal candle at confirmed support / second bottom;
2. bullish reversal candle during handle/pullback after volume dry-up;
3. bearish rejection candle at pivot/resistance;
4. continuation sequence after breakout/retest.

This controls combinatorial Factor-Zoo growth.

### Data blocker remains
Historical OPEN is required. No performance claim until the research dataset is repaired/extended.

## DL-002O — Research Data Specification v0.1

### Separate from live Formal cache
Do not mutate the live trading cache merely to make research convenient.
Build/derive a research dataset with as-of-date provenance.

Minimum per daily bar:
- symbol
- date
- raw O/H/L/C
- adjusted O/H/L/C
- volume
- turnover
- corporateActionTag
- market regime tags
- source
- fetchedAt

Target history:
- enough for at least 120 trading sessions before each as-of-date for multi-month topology;
- preferably longer for prior-trend context, but the exact fetch horizon must be fixed before outcome analysis.

### Derived fields must be as-of-date reproducible
- lagged ATR
- lagged moving averages
- confirmed swings with pivotAt/confirmedAt
- pattern states
- key levels
- provisional flags
- data-quality flags

### Missingness
UNKNOWN stays UNKNOWN.
Do not coerce missing OPEN, corporate-action status or insufficient history into false/zero.

### Auditability
Each Pattern Shadow snapshot should preserve:
- detectorVersion
- dataThroughDate
- historyStartDate
- barCount
- adjustedSeriesUsed
- corporateActionHandling
- swingSpecVersion
- patternSpecVersion
- noLookaheadVerified
- missingFields

### First implementation class if later approved
Research-only snapshot writer / backfill tool = Class A if it has no decision impact.
Any change to Formal candidate eligibility, ranking, capital, execution, monitoring or push = Class C and requires owner approval.


## DL-002P — Failed Pattern / False-Breakout Taxonomy v0.1

### Goal
Study failure as a first-class morphology rather than treating every failed bullish pattern as a generic stop-out.

### Why failure deserves its own lane
A bullish setup can fail in several mechanically different ways:
1. no real breakout acceptance,
2. breakout occurs but immediately re-enters the base,
3. breakout holds briefly then loses the pivot,
4. pattern degrades before breakout,
5. breakout succeeds locally but collides with older resistance,
6. high-volume expansion is actually late-stage exhaustion.

These mechanisms should not be collapsed into one FAILED flag.

### Universal breakout-failure states
PRE_BREAKOUT_INVALIDATION
- key structural low/handle low/second-bottom low breaks before breakout.

INTRABAR_POKE_ONLY
- high exceeds pivot but close does not establish acceptance above pivot.
- descriptive only on daily data; do not assume intraday sequence.

CLOSE_BREAKOUT_NO_FOLLOWTHROUGH
- close clears pivot but subsequent closes fail to expand/hold.

FAST_REENTRY
- after breakout, close returns inside the prior base/pattern within a short pre-registered horizon.

PIVOT_LOSS_AFTER_RETEST
- breakout occurred, retest reaches pivot zone, then closes materially below it.

OLDER_RESISTANCE_COLLISION
- clears local priorHigh20/pattern pivot but stalls below a higher major structural resistance.

LATE_STAGE_EXHAUSTION
- breakout occurs after already-extended price path with wide range / high volume / poor close acceptance.

R01_BREAKOUT_FAILURE
- retain existing frozen R01 three-day breakout failure as the common formal research outcome.

### Do not redefine success
Pattern failure taxonomy is descriptive.
Outcome success/failure continues to use the existing frozen research outcomes (R01, D1/D3/D5/D10, MFE/MAE, stop-first).

## DL-002Q — Volume Is Context, Not a Single Confirmation Threshold

### Evidence conflict
Practitioner guidance commonly treats high breakout volume as confirmation.
However:
- high participation at a breakout can represent committed demand,
- but high volume after an extended move can also be climax/exhaustion,
- broad backtest evidence suggests adding generic volume-confirmation filters often reduces trade frequency more reliably than it improves edge.

Therefore “volume > X = good breakout” is not assumed.

### Separate volume contexts
1. PRE_BREAKOUT_DRY_UP
- volume contracts while price/range tightens near pivot.

2. BREAKOUT_PARTICIPATION
- breakout-day/session volume relative to an appropriate baseline.

3. RETEST_SUPPLY
- volume during pullback/retest; low selling volume may be constructive.

4. FOLLOW_THROUGH_DEMAND
- participation on post-breakout advance bars.

5. CLIMAX_RISK
- very high volume + extended price path + wide range + poor close/failure to extend.

### Research variables
- breakoutVolumeRatio5
- breakoutVolumeRatio20
- breakoutTurnoverRatio20
- retestDownVolumeRatio
- followThroughVolumeRatio
- volumeDryUpSlope
- volumeShockZ
- closeLocationOnVolumeShock
- priceExtensionAtVolumeShock
- rangeATRAtVolumeShock

### Key hypothesis
The same high volume can have opposite meaning depending on:
- distance from base/pivot,
- prior 20/60-day return,
- close location,
- range expansion,
- next-day follow-through,
- retest quality.

This must be tested as an interaction, not a universal bullish threshold.

### Formal overlap
Current B already requires volumeTodayVsPrev5 >= 1.3.
DL-002Q does NOT propose changing it.
Research question:
Does contextual volume interpretation explain which B breakouts later fail despite passing the existing 1.3x volume condition?

## DL-002R — Trap / Re-entry Mechanics v0.1

### Hypothesis
A failed breakout can contain information beyond simply “trade lost” because traders who entered above resistance may become trapped when price re-enters the base.

### Observable trap features
- breakoutCloseAbovePivotPct
- maxExcursionAbovePivotBeforeFailure
- barsUntilReentry
- reentryDepthPct
- reentryCloseLocation
- failureVolumeRatio
- trappedRangeTurnover
- priorBreakoutVolumeRatio
- retestAttemptCount

### Do not assume reversal alpha
A failed breakout does NOT automatically become a short signal.
Test three outcomes separately after re-entry:
- continuation down,
- mean reversion / range return,
- reclaim and second breakout.

### Reclaim state
FAILED_BREAKOUT
-> REENTRY
-> RECLAIM_ATTEMPT
-> RECLAIM_CONFIRMED or SECOND_FAILURE

This is relevant to the broader system because a stock rejected after one failed breakout might later become valid again; failure should not create a permanent blacklist.

## DL-002S — Negative Morphology Library v0.1

### Purpose
Create explicit counterexamples so positive-pattern detectors are falsifiable.

### Families
WIDE_LOOSE_BASE
- repeated large swings without progressive compression.

EXPANDING_RANGE
- later swing amplitudes increase.

HIGH_VOLUME_DISTRIBUTION
- down legs carry increasing volume / turnover and weak closes.

LOWER_HIGH_LOWER_LOW
- confirmed bearish swing sequence.

FAILED_RIGHT_SIDE
- cup/right-side recovery stalls well before rim and rolls over.

HANDLE_BREAKDOWN
- handle loses its own structural low before pivot breakout.

W_UNDERCUT_NO_RECLAIM
- second trough undercuts first and fails to recover promptly.

VCP_EXPANSION
- a later contraction materially exceeds prior contraction size.

BREAKOUT_REJECTION
- breakout bar closes poorly / long upper rejection, then loses pivot.

LOCAL_BREAKOUT_MAJOR_RESISTANCE
- local 20d breakout into unresolved longer-term supply.

### Research comparison
For every positive pattern family, maintain matched negative/control morphology from the same date and liquidity/price/sector bucket.

This helps answer:
“Is the positive geometry actually informative, or are we just selecting stocks already in strong regimes?”

## DL-002T — Failure Research Test Matrix

### Same-date comparisons
1. B breakouts that pass existing volume gate:
   - contextual-confirmed vs climax-risk.
2. VCP mature:
   - successful breakout vs pre-breakout expansion failure.
3. Cup/handle:
   - handle dry-up vs handle selling-volume expansion.
4. W bottom:
   - higher/equal/undercut-reclaim vs undercut-no-reclaim.
5. Local breakout:
   - no older resistance vs major-resistance collision.

### Outcomes
Reuse:
- R01 breakout failure
- D1/D3/D5/D10
- MFE/MAE
- stop-first
- time-to-reentry
- time-to-reclaim

### Priority hypothesis
A contextual failure library may have higher practical value than adding more bullish score because it can potentially reduce false positives while preserving the locked Formal definitions during research.

No Formal exclusion rule is approved at this stage.



## DL-002U — Breakout Retest Is a Trade-off, Not a Free Confirmation

### Key counter-evidence
Practitioner logic often treats a breakout retest as a superior confirmation step: old resistance becomes support, pullback volume contracts, then price resumes upward.
However, a 2026 pre-registered study of 1,425 breakout events across 760 S&P 600 small-cap companies reported that the breakout-and-retest filter underperformed the breakouts it discarded.

This does NOT prove retests are useless in Taiwan.
It does prove that “wait for retest” has an opportunity cost and should not be treated as universally superior.

### Relevance to current system
Current Formal B execution already uses a breakout -> retest/hold -> renewed-strength logic on 15-minute bars.
Therefore DL-002 must evaluate BOTH:
1. false-breakout reduction from waiting for retest;
2. missed-opportunity cost from breakouts that never retest and continue immediately.

### Retest state taxonomy
NO_RETEST_CONTINUATION
- breakout occurs and price continues without revisiting the pivot zone.

SHALLOW_RETEST
- pullback approaches but does not materially touch pivot.

PIVOT_RETEST_HOLD
- price revisits pivot zone and closes/turns while maintaining structural support.

TEMPORARY_UNDERCUT_RECLAIM
- price briefly closes/trades below pivot but rapidly reclaims it.

DEEP_RETEST
- pullback penetrates materially into prior base but later recovers.

FAILED_RETEST
- price loses pivot and does not promptly reclaim.

### Metrics
- barsToRetest
- minDistanceToPivotPct
- maxUndercutPct
- retestDurationBars
- retestDownVolumeRatio
- retestRangeATR
- reclaimBars
- resumptionStrength
- followThroughMFE
- missedNoRetestMFE
- avoidedFalseBreakoutRate

### Opportunity-cost test
For all valid B-style breakouts, compare:
A. entry at initial breakout event;
B. entry only after current Formal-style 15m retest confirmation;
C. no entry if no retest.

Measure:
- signal coverage
- entry delay
- entry price slippage vs breakout
- D1/D3/D5
- MFE/MAE
- stop-first
- R01 failure
- missed winners with NO_RETEST_CONTINUATION

This is Execution Alpha research, not a Formal rule change.

### Volume during retest
Low retest volume is a plausible “supply dried up” mechanism, but remains a hypothesis.
Test retestDownVolumeRatio incrementally against:
- breakout volume
- prior base dry-up
- market regime
- price extension
- current 15m confirmation fields

### Reclaim nuance
A close below pivot does not always imply the broader trend is dead.
Keep TEMPORARY_UNDERCUT_RECLAIM separate from FAILED_RETEST.
This aligns with the broader research principle that a failed first attempt can later revalidate.

### No production implication
No change to current 15m B execution semantics is approved.
This research specifically measures whether the retest requirement improves quality enough to justify its opportunity cost.

## DL-002V — Follow-through Quality After Breakout v0.1

### Rationale
Breakout-day features alone may be insufficient. What happens immediately after the breakout can reveal whether price is being accepted above the pivot.

### Descriptive fields
- day1CloseVsPivotPct
- day2CloseVsPivotPct
- consecutiveClosesAbovePivot
- maxCloseBelowPivotPct
- postBreakoutHigherLow
- postBreakoutVolumePersistence
- postBreakoutRangeCompression
- postBreakoutCloseQuality
- firstWeakCloseDay
- firstReclaimDay

### Positive hypotheses
- multiple closes accepted above pivot;
- higher low forms above/near pivot;
- retest occurs on lighter selling volume;
- subsequent up-bars regain range/volume.

### Failure hypotheses
- breakout bar has high volume but poor close;
- next bar cannot extend;
- immediate close back into range;
- repeated pivot crossings / whipsaw;
- widening range with no net progress.

### Anti-hindsight rule
Follow-through features are only usable at the date they become observable.
They cannot be attached retroactively to the original selection date as if known then.
Use them for execution/revalidation research, not Selection Alpha at t0.



## DL-002W — Pattern Time Structure / Staleness v0.1

### Goal
Model pattern duration and aging as continuous information rather than assuming one universal “ideal number of days.”

### Why duration matters
A pattern that forms too quickly may be noise or one volatile reversal.
A pattern that drags on too long may span multiple regimes, stale supply/demand conditions, or a different structural process.

Practitioner references disagree materially on duration ranges. This disagreement is evidence against using one textbook duration as a hard truth.

### Universal time fields
For every pattern family store:
- patternStartDate
- stateAsOf
- ageTradingDays
- barsSinceLastConfirmedSwing
- barsSinceMaturity
- barsSincePivotReady
- barsSinceFirstBreakoutAttempt
- barsSinceFailure
- confirmationLagBars
- provisionalAgeBars

### Family-specific time fields
VCP:
- contractionDurations[]
- timeBetweenContractions
- finalTightAreaAge

Cup:
- leftRimToBottomDays
- bottomResidenceDays
- bottomToRightRimDays
- cupDurationDays
- handleDurationDays

W:
- low1ToNecklineDays
- necklineToLow2Days
- bottomSpacingDays

Flag/platform:
- poleDurationDays
- consolidationDurationDays
- consolidationToPoleDurationRatio

### Staleness hypotheses
Potentially stale:
- many bars near pivot with repeated failed breakout attempts;
- base duration becomes very long while relative strength deteriorates;
- pattern matures but price never approaches pivot;
- repeated high-volume reversals at the same resistance;
- market/sector regime changes after pattern formation.

Potentially constructive:
- pattern persists while volatility and supply continue to contract;
- maturity is recent and relative strength remains intact;
- pivot attempts are few rather than repeatedly rejected.

### Repeated-attempt count
Store:
- pivotTouchCount
- failedCloseAbovePivotCount
- failedBreakoutCount
- daysSinceFirstPivotTouch

Research question:
Does repeated testing weaken resistance (absorption) or signal persistent supply / exhaustion?
Do not assume one direction before testing.

### Time normalization
Also express duration relative to volatility/trend context:
- ageVsATRRegime
- consolidationDurationVsPriorImpulse
- patternAgeVsSectorCycle proxy if available

### No hard duration gate yet
Do not reject a cup merely because it exceeds 6 months or a handle because it exceeds 4 weeks.
First test duration as a continuous/descriptive variable and look for stable monotonic or nonlinear effects in prospective data.

### Staleness state
FRESH
MATURE_FRESH
AGING
STALE
REACTIVATED

REACTIVATED requires a genuinely new structural event (e.g. fresh contraction/reclaim), not merely passage of time.

### Interaction with Formal
A stale-pattern flag may eventually help explain false positives, but it is Research/Shadow only.
No Formal time cutoff is changed.

## DL-002X — Failed Attempt Count / Resistance Absorption Question

### Competing hypotheses
H1 Absorption:
Repeated approaches to resistance consume available supply and increase breakout odds.

H2 Exhaustion:
Repeated failed attempts reveal persistent overhead supply, weaken momentum, and increase reversal odds.

Both stories are plausible. Therefore count attempts and observe outcomes rather than choosing one narrative.

### Variables
- resistanceTestCount
- averageRejectionPct
- averageUpperWickRatioAtTests
- testVolumeTrend
- interTestSpacingDays
- higherLowBetweenTests
- closeProgressionAcrossTests
- RSProgressionAcrossTests
- breakoutAttemptCount
- failedBreakoutCount

### Mechanism splits
Possible absorption signature:
- higher lows,
- smaller rejection depth,
- declining sell volume,
- closes progressively nearer resistance.

Possible exhaustion signature:
- lower highs,
- expanding upper wicks,
- rising sell volume,
- weakening RS,
- wider pullbacks after each attempt.

This may provide richer information than the raw count itself.



## DL-002Y — Pattern × Relative Strength Interaction v0.1

### Goal
Test whether pattern topology becomes more informative when paired with relative-strength trajectory, without double-counting existing Residual RS.

### External prior
Large practitioner pattern statistics suggest a potentially important distinction:
- absolute RS level before a pattern,
- RS direction/change into breakout,
may not have the same information content.
In one large chart-pattern dataset, patterns whose relative-strength line improved into breakout compared favorably with cases where relative strength deteriorated.

This is hypothesis-generating evidence, not proof for Taiwan or our Formal system.

### Existing-system overlap
Current research already contains:
- Residual RS
- sector persistence
- Quiet/Attention diagnostics
- sector ranking / market regime

Therefore do NOT add “high RS = bullish” as a new factor.

### Potential incremental variables
- rsSlopeAtPatternStart
- rsSlopeAtMaturity
- rsSlopeChange
- residualRSSlopeChange
- sectorRSSlopeChange
- rsNewHighBeforePriceBreakout
- priceBreakoutBeforeRSBreakout
- rsDivergenceState
- rsPersistenceDuringHandle/VCP

### Mechanism hypotheses
1. LEADER_PERSISTENCE:
   high RS remains high through pattern maturity.

2. EMERGING_LEADER:
   mediocre/weak RS improves materially as pattern matures.

3. DETERIORATING_LEADER:
   strong RS weakens into breakout; possible late-stage risk.

4. FALSE_RS:
   price pattern improves but sector/residual RS does not confirm.

### Pattern-specific interactions
VCP:
- Does residual RS stay stable/rise while volatility contracts?

Cup/handle:
- Does RS improve on the right side and remain firm through the handle?

W:
- Does RS make a higher low even when price retests/undercuts the first bottom?

Flag:
- Does RS remain strong during shallow consolidation?

Failed breakout:
- Is RS deterioration already visible before pivot failure?

### Key test
Compare topology features with:
- level of Residual RS,
- slope/change in Residual RS,
- interaction topology × RS change.

If interaction adds nothing after controlling current RS variables, reject it as redundant.

### No production implication
Research/Shadow only. No ranking or selection change.



## DL-002Z — Taiwan Tick-Size / Price-Limit Normalization v0.1

### Why this matters
Taiwan stocks have discrete price ticks that vary by price band, and ordinary stocks are subject to a daily ±10% fluctuation limit around the opening reference price.
Therefore pattern geometry measured only in percentages can be distorted across price tiers.

Examples:
- a 1-tick move in a NT$30 stock is not equivalent to a 1-tick move in a NT$1,500 stock;
- a “0.2% breakout” may be only one tick for a high-priced stock;
- narrow handles or equal W-bottom lows can be mechanical consequences of price discretization;
- price-limit sessions truncate observed daily ranges.

### Research normalization
For every key level / distance store all three:
1. percent distance,
2. ATR-normalized distance,
3. tick-count distance.

Fields:
- tickSizeAtPrice
- pivotDistanceTicks
- handleDepthTicks
- rimDiffTicks
- troughSimilarityTicks
- breakoutDistanceTicks
- undercutTicks
- stopDistanceTicks
- rangeTicks

### Price-limit state
Tag:
- nearUpperLimit
- nearLowerLimit
- lockedUpperLimit / lockedLowerLimit if observable
- limitConstrainedRange
- noLimitNewListingWindow where applicable

A bar constrained by the daily limit should not be interpreted as an unconstrained natural range contraction/expansion.

### Pattern implications
VCP:
- finalTightness must exceed pure tick granularity; a 1–2 tick “tight area” may be discretization, not supply contraction.

Cup/W:
- rim similarity and trough similarity need tick-aware tolerance.

Breakout:
- require descriptive breakout distance in ticks as well as %/ATR; do not treat a one-tick close over resistance as equivalent across price tiers.

### Research-only
This is normalization / data-quality work only. No Formal threshold change.



## DL-002AA — Healthy Compression vs Dead Liquidity v0.1

### Core problem
Narrow range + low volume can mean:
A. supply is drying up while demand remains latent (potentially constructive), or
B. the stock is simply illiquid / ignored / difficult to trade.

The two can look similar in a chart.

### Taiwan-specific caution
Taiwan evidence suggests trading-volume and price-limit mechanics materially affect common illiquidity measures. Therefore generic U.S. liquidity interpretations should not be transplanted directly.

### Required separation
HEALTHY_COMPRESSION candidate:
- range/ATR contracts,
- volume contracts moderately,
- turnover remains above minimum viable levels,
- spread/tick granularity does not dominate,
- relative strength holds/improves,
- lows do not deteriorate,
- occasional demand response remains visible.

DEAD_LIQUIDITY candidate:
- range is narrow because few trades occur,
- turnover collapses,
- many bars are only a few ticks wide,
- price impact per unit turnover is high,
- gaps/ticks dominate geometry,
- RS/sector participation weakens,
- breakout participation absent.

### Research fields
- avgTurnover20
- turnoverContraction5to20
- zeroOrNearZeroVolumeDays
- rangeTicksMedian
- rangeATRMedian
- percentRangeMedian
- AmihudLikeImpact = abs(return)/turnover (research diagnostic only)
- tickDominanceRatio
- volumeParticipationPercentile
- sectorTurnoverRelative
- RSChangeDuringCompression
- breakoutParticipationAfterCompression

### Key interaction
Do not reward compression unless:
- morphology is stable across ATR/tick normalization,
- liquidity remains sufficient for executable trading,
- the tightening is not explained primarily by dead turnover.

### Formal overlap
Current Formal already has liquidity gates.
DL-002AA must test incremental value after controlling existing liquidity eligibility.
If “dead liquidity” is already fully excluded by current gates, reject the new feature as redundant.

### No production change
Research/Shadow only.



## DL-002AB — Common Latent Structure vs Named Pattern Labels

### Core question
Are VCP, cup/handle, W-bottom, flags and platforms truly independent predictors, or are they overlapping descriptions of a smaller set of latent price-path structures?

### External evidence
- Lo, Mamaysky & Wang (2000) showed that systematic chart geometry can carry incremental information, but this does not imply each practitioner label is independent.
- A 2017 Information Sciences paper formally represented 53 chart patterns and grouped them into 5 categories based on underlying properties. This supports the idea that many named patterns share structural primitives.
- 2024 Journal of Financial Economics evidence (“Charting by machines”) finds nonlinear predictive information in historical price paths distinct from standard momentum, reversal and extant technical signals.
- A 2026 ablation study of chart-image CNNs finds OHLC price geometry is the dominant predictive component; moving-average overlays are largely redundant and volume bars add relatively little incremental information.

### Research implication
The system should model a small set of common structural primitives first, then treat named patterns as combinations of those primitives.

### Candidate latent primitives
1. TREND_CONTEXT
   - prior directional state
   - higher/lower swing sequence
   - residual/sector RS trajectory

2. COMPRESSION
   - range contraction
   - ATR contraction
   - swing-depth contraction
   - duration contraction
   - tick-normalized tightness

3. SUPPORT_PROGRESS
   - higher lows
   - undercut-and-reclaim
   - support-test stability

4. RESISTANCE_GEOMETRY
   - one dominant pivot
   - clustered pivots/rims
   - neckline
   - older resistance conflict

5. RECOVERY_SHAPE
   - V recovery
   - rounded recovery
   - stair-step recovery
   - asymmetric recovery

6. SUPPLY_DEMAND_VOLUME
   - selling-volume decay
   - dry-up
   - breakout participation
   - retest supply
   - climax risk

7. TIME_STRUCTURE
   - pattern age
   - contraction cadence
   - confirmation lag
   - staleness

8. ACCEPTANCE_AFTER_BREAK
   - closes above pivot
   - retest behavior
   - reclaim / failure

### Named-pattern decomposition
VCP ≈ TREND_CONTEXT + COMPRESSION + SUPPORT_PROGRESS + RESISTANCE_GEOMETRY + SUPPLY_DEMAND_VOLUME.

Cup-with-handle ≈ TREND_CONTEXT + RECOVERY_SHAPE + RESISTANCE_GEOMETRY + optional COMPRESSION in handle + TIME_STRUCTURE.

W / double-bottom ≈ SUPPORT_PROGRESS + RESISTANCE_GEOMETRY + RECOVERY_SHAPE + optional undercut/reclaim.

Flag/platform ≈ TREND_CONTEXT + COMPRESSION + RESISTANCE_GEOMETRY + TIME_STRUCTURE.

Candlestick/Sakata ≈ short-horizon OHLC GEOMETRY + LOCATION_CONTEXT + ACCEPTANCE/REVERSAL.

### Anti-double-counting rule
A stock matching three named patterns does not equal three independent positive signals.
Pattern names become interpretable views over shared primitives.

### Research output hierarchy
Level 1: raw OHLC / volume / tick / time fields.
Level 2: latent structural primitives.
Level 3: named pattern labels.
Level 4: pattern maturity / lifecycle.
Level 5: incremental outcome evidence.

Formal promotion, if ever proposed, should prefer the smallest stable primitive set that explains the evidence rather than a large collection of pattern labels.

## DL-002AC — Dimension Reduction / Factor-Zoo Control

### Motivation
Harvey, Liu & Zhu (2016) argue that hundreds of tested return factors create severe multiple-testing problems and require much higher evidentiary hurdles.
Modern asset-pricing research similarly emphasizes dimension reduction and out-of-sample regularization when candidate predictors proliferate.

Pattern research is especially exposed to this risk because:
- each pattern can have many thresholds,
- each threshold can interact with trend, volume, regime and duration,
- many labels describe overlapping geometry.

### Pre-registered reduction process
Before outcome testing:
1. classify every candidate feature into one latent primitive;
2. mark direct duplicates;
3. mark deterministic transforms;
4. mark strongly conceptually overlapping variables;
5. retain a small representative set per primitive.

After prospective data accumulates:
6. compute pairwise and conditional redundancy;
7. use within-date de-meaning / partial-correlation diagnostics already available in research governance;
8. use leave-one-date-out stability;
9. test whether named labels add anything after primitive controls;
10. prefer simpler feature sets when predictive performance is similar.

### No winner-picking from a large grid
Do not run 100 VCP thresholds and keep the best.
Do not test dozens of cup-depth bands and select the one with highest D5 return.
Each materially different definition counts as a separate experiment.

### Minimum question
For every candidate:
“What information does this feature contain that the current Formal system, DL-001, and other DL-002 primitives do not already contain?”

If the answer cannot be demonstrated, reject as REDUNDANT even if raw returns look good.

## DL-002AD — OHLC Geometry Priority

### New evidence-driven priority
Recent chart-image research indicates raw OHLC geometry can carry more predictive information than moving-average overlays, with volume adding less incremental information in at least one modern ablation study.

### Implication for our system
Current Formal already contains several moving-average features.
DL-002 should therefore prioritize:
- swing geometry
- curvature/recovery shape
- compression sequence
- pivot topology
- undercut/reclaim
- acceptance/failure path

before inventing additional moving-average crosses or slope variants.

### Caution
The cited evidence is not Taiwan-specific and uses ML/image frameworks, so it does not prove the exact same hierarchy in Taiwan.
Treat it as a research-priority signal, not a production rule.



## DL-002AE — Pattern Family Decomposition / Minimal Primitive Set v0.1

### Objective
Reduce named-pattern proliferation into a small, auditable primitive set before any outcome optimization.

### Proposed primitive groups
P1 TREND:
- confirmed swing trend state
- MA context (existing)
- Residual/sector RS context (existing research)

P2 COMPRESSION:
- swing-depth contraction
- ATR/range contraction
- duration contraction
- tight-area stability

P3 SUPPORT:
- higher-low progression
- equal-low zone
- undercut/reclaim behavior
- support test quality

P4 RESISTANCE:
- pivot clustering
- neckline / rim geometry
- local-vs-major resistance conflict
- failed-attempt progression

P5 RECOVERY_SHAPE:
- V-shaped
- rounded/U-shaped
- stair-step
- asymmetric recovery

P6 FLOW:
- selling-volume decay
- volume dry-up
- breakout participation
- retest supply
- climax/distribution context

P7 TIME:
- age
- cadence
- confirmation lag
- staleness
- failed-attempt count

P8 ACCEPTANCE:
- close acceptance above pivot
- follow-through
- retest/reclaim
- fast re-entry / failure

### Named labels become views
VCP = P1 + P2 + P3 + P4 + P6 + P7
Cup/Handle = P1 + P4 + P5 + P7 + optional P2/P6 in handle
W = P3 + P4 + P5 + P7
Flag/Platform = P1 + P2 + P4 + P7
Candlestick/Sakata = local OHLC geometry + location inside P3/P4/P8

### Research priority
Test primitives first.
A named label is worth retaining only if it adds information beyond its primitive components.

### Practical effect
If “cup-with-handle” adds no outcome information after:
- recovery shape,
- rim geometry,
- handle compression,
- time structure,
then the named cup label should be retained only for interpretability, not as a predictor.

## DL-002AF — Multiple Testing Budget / Reality-Check Discipline

### Risk
Pattern research can explode combinatorially:
- 5 pattern families
- multiple swing scales
- many duration/depth thresholds
- multiple volume variants
- regime splits
- RS interactions
- retest variants

Testing all combinations and reporting the best creates classic data snooping.

### Evidence
Finance literature on the factor zoo and technical-rule reality checks shows that repeated testing materially inflates false discoveries. Asian-market studies applying White Reality Check / Hansen SPA often find apparently profitable technical rules weaken substantially after data-snooping adjustment.

### Research rules
1. Every materially different detector definition receives a version and experiment count.
2. Thresholds are frozen before forward-outcome inspection.
3. Neighboring scales are used as stability checks, not as a return-optimized tournament.
4. No “best of 50 variants” result may be promoted unless the entire search family is included in multiplicity accounting.
5. Favor mechanism-driven comparisons over exhaustive grids.
6. Use existing independent-date / holdout / transaction-cost / leave-one-date-out controls.
7. If later sample size supports it, add a family-level Reality Check / SPA-style diagnostic for pattern variants rather than relying on individual p-values.

### Practical experiment budget
Initial DL-002 validation should cap the number of primary hypotheses:
H1 VCP sequence topology adds beyond generic contraction.
H2 true W neckline topology adds beyond rightFootHigher/priorHigh20.
H3 cup recovery/handle topology adds beyond trend+pullback+volume contraction.
H4 continuation pole+compression topology adds beyond platformRange20.
H5 failure/context features explain false breakouts beyond breakout volume alone.
H6 pattern maturity interacts with RS change incrementally.
H7 retest confirmation trades lower false-breakout rate against missed no-retest winners.

Everything else is exploratory/descriptive until one of these survives.

## DL-002AG — Rule-Based vs Shape-Matching Detectors

### Evidence
Formal chart-pattern research has compared logical/rule specifications with Euclidean/template and Dynamic Time Warping approaches. Rule systems can identify interpretable named structures; shape-matching methods can capture approximate geometry.

### Proposed dual detector design
Detector A: INTERPRETABLE_RULES
- confirmed swings
- explicit topology
- auditable inequalities
- easy no-lookahead verification

Detector B: SHAPE_SIMILARITY_RESEARCH
- normalized path representation
- distance to archetype / cluster
- research-only diagnostic

### Why not use shape matching first
A flexible similarity model can silently fit noise and makes it harder to know why a stock matched.
Start with interpretable primitives and use shape similarity only as a falsification/comparison tool.

### Agreement diagnostic
Store:
- ruleMatch
- shapeSimilarity
- ruleShapeAgreement

Research question:
Do high-confidence cases where both agree have better stability/outcomes, or does shape matching merely duplicate rule features?

No ML detector may influence Formal selection during DL-002 research.



## DL-002AH — Shape Similarity / DTW as a Secondary Research Lens

### Motivation
Stock chart patterns can have similar morphology despite different amplitudes and durations. Rule-based detectors may miss deformed but structurally similar cases.

### External evidence
Research on financial chart recognition has used:
- PIP / turning-point segmentation,
- template/rule matching,
- Dynamic Time Warping (DTW),
- SAX symbolic representations,
- curve fitting / shape classification.

Subsequence-DTW studies explicitly allow similar historical patterns to occur at different price levels and lengths.

### Research role
Shape similarity is a SECONDARY detector only.

Primary:
- repaint-safe confirmed swings,
- explicit latent primitives,
- named-pattern rule views.

Secondary:
- normalized path similarity.

### Normalization required
Before similarity comparison:
- normalize price level,
- preserve direction,
- use adjusted price series for morphology,
- normalize amplitude carefully,
- retain duration separately rather than erasing it completely,
- keep tick/ATR context outside the normalized shape.

### Why duration cannot be fully warped away
If DTW is unconstrained, a 10-day sharp V can be made to look like a 100-day rounded cup.
But duration itself may contain information.
Therefore:
- constrain warping,
- store warpingCost,
- store originalDurationRatio,
- reject extreme temporal distortion.

### Similarity fields
- shapeDistance
- warpingCost
- durationRatio
- amplitudeRatio
- turningPointAgreement
- ruleShapeAgreement
- nearestHistoricalArchetype
- nearestHistoricalOutcomeDistribution (research only, strict as-of-date archive)

### Anti-leakage
Historical nearest-neighbor library for date t may contain only patterns completed before t.
No future pattern/outcome may enter the similarity database.

### Key falsification
If shape similarity adds no incremental information after latent primitives, discard it.
Do not retain ML/DTW merely because it sounds sophisticated.

## DL-002AI — Scale / Amplitude / Duration Invariance Boundaries

### Problem
Pattern recognition often wants invariance:
- same pattern at NT$50 vs NT$1,500,
- same cup over 30 vs 90 days,
- same amplitude at different volatility.

Too much invariance destroys potentially useful information.

### Preserve both normalized and absolute descriptors
Normalized morphology:
- z/relative-price path
- ATR-normalized amplitudes
- relative duration positions

Absolute/context:
- trading days
- actual % depth
- tick depth
- ATR regime
- turnover/liquidity
- price tier

### Research principle
Use normalized representation for “shape identity.”
Use absolute/context variables for “economic meaning.”

Example:
Two cups can have the same normalized U shape, but:
- one is 8% deep over 40 days,
- one is 45% deep over 180 days.
They should not be treated as identical economic setups.

## DL-002AJ — Pattern Discovery vs Pattern Validation

### Separate tasks
DISCOVERY:
Find recurring path structures or clusters without claiming profitability.

VALIDATION:
Test frozen structures on forward outcomes.

Do not discover and validate on the same outcome sample.

### Discovery options
- interpretable swing primitives,
- unsupervised shape clustering,
- SAX/DTW similarity,
- shapelets,
- rule taxonomy.

### Validation requirements
Once a new structure is discovered:
1. freeze definition/version,
2. assign experiment count,
3. wait for independent/prospective sample or untouched holdout,
4. test same-date matched controls,
5. apply multiple-testing discipline.

### Reason
A discovered cluster will almost always look meaningful in the data that created it.
Only an untouched sample can tell whether it has predictive value.



## DL-002AK — Local Segment Importance / Pattern Phase Decomposition v0.1

### Core question
Within a full pattern, which phase carries the actual incremental information?

A full cup, W, VCP or flag can span many bars. If predictive information is concentrated in the final maturation segment, averaging the entire pattern may dilute it.

### Phase decomposition
For every pattern family, split history into:

PHASE_0_PRECONDITION
- trend / prior advance / earlier regime before the pattern begins.

PHASE_1_FORMATION
- initial base formation / first contraction / first bottom / initial decline and recovery.

PHASE_2_MATURATION
- later contractions, right-side recovery, second bottom, flag compression.

PHASE_3_TRIGGER_ZONE
- final tight area / handle / neckline approach / pivot approach / last support test.

PHASE_4_POST_TRIGGER
- breakout, retest, follow-through, failure, reclaim.

### Research hypothesis
The predictive information may not be evenly distributed.
Candidate possibilities:
- VCP: last 1-2 contractions matter more than the first contraction.
- Cup: right-side recovery + handle may matter more than left-side decline.
- W: second bottom + reclaim + neckline approach may matter more than first bottom.
- Flag: late compression near pole high may matter more than the whole flag.
- Candlestick: local reversal geometry matters mainly when it appears in PHASE_3 near structural support/resistance.

### Phase features
For each phase compute:
- return
- duration
- ATR/range change
- volume/turnover trend
- RS change
- low/high progression
- distance to pivot/support
- directional efficiency
- drawdown
- recovery speed
- tick-normalized tightness

### Ablation design
For each pattern detector compare:
A. full-pattern feature set;
B. remove PHASE_0;
C. remove early formation PHASE_1;
D. trigger-zone only PHASE_3;
E. PHASE_2 + PHASE_3;
F. primitive-only controls without named pattern label.

Do not select the best ablation on the same validation sample.
Use discovery sample to freeze candidate phase comparisons, then untouched holdout/prospective dates.

### Interpretation
If PHASE_3-only performs as well as full-pattern features:
- long historical morphology may be useful mainly for context,
- execution/selection engineering could remain simpler.

If full history adds incremental value:
- longer research horizon is justified.

## DL-002AL — Directional Efficiency and Path Smoothness

### Motivation
Two stocks can have the same return and same endpoints but reach them through different paths.

Define path efficiency:
- efficiencyRatio = abs(C_end - C_start) / sum(abs(C_t - C_t-1))

High efficiency:
- cleaner directional progression.

Low efficiency:
- noisy back-and-forth path.

### Research use
Measure separately by phase:
- priorAdvanceEfficiency
- rightSideRecoveryEfficiency
- handleEfficiency
- breakoutFollowThroughEfficiency

Also measure:
- adverseExcursionWithinPhase
- reversalCount
- signedReturnConsistency
- pathLengthNormalizedByATR

### Interaction hypotheses
- high right-side recovery efficiency + low-volatility handle may signal organized demand;
- excessively high prior-advance efficiency may instead indicate late-stage extension;
- low efficiency inside handle may mean churn/distribution rather than healthy digestion.

Therefore efficiency is contextual, not universally bullish.

### Relation to DL-001
DL-001 Information Discreteness / Gradual Price Path may overlap strongly with path efficiency.
Before retaining this feature, test redundancy directly.
If efficiency simply re-expresses DL-001, reject as duplicate.

## DL-002AM — Shapelet-Style Local Motifs

### Concept
Instead of asking whether the entire chart matches a named pattern, ask whether short local subsequences (“motifs” / shapelets) recur before certain outcomes.

Examples:
- undercut -> rapid reclaim -> tight close cluster;
- high-volume rejection -> weak bounce -> second rejection;
- contraction -> brief range expansion -> immediate absorption;
- right-side acceleration -> shallow low-volume handle.

### Research discipline
Do not mine thousands of motifs against forward returns in the same sample.

Safe process:
1. discover recurring motifs without outcome labels or on a discovery subset;
2. translate motifs into interpretable OHLC/swing rules where possible;
3. freeze motif definition;
4. validate on untouched dates.

### Why useful
Named patterns may be too coarse.
A short motif could explain why some cups succeed and others fail.

### Why dangerous
Outcome-guided shapelet discovery is an extreme data-snooping risk.
Any supervised motif discovery must have strict nested train/validation/holdout separation.

## DL-002AN — Variable-Length Windows vs Fixed 20/60-day Windows

### External prior
Recent chart-pattern research groups candlesticks into waves before prediction specifically to avoid relying only on fixed windows.
DTW/subsequence research likewise searches variable-length historical segments.

### Current-system comparison
Formal features rely heavily on fixed horizons:
- 5/10/20/60 days,
- priorHigh20/priorHigh60,
- volume 5 vs 20.

These are stable and interpretable, but may slice through patterns at arbitrary places.

### Research comparison
For the same as-of date build:
1. FIXED_WINDOW features (existing 20/60-day style);
2. SWING_DEFINED variable-length phase features;
3. HYBRID = fixed baseline + swing phases.

Question:
Does variable-length segmentation add incremental information after fixed windows?

### Decision rule
If swing-defined features do not improve incremental diagnostics, keep the simpler fixed-window system.
Complexity is not a benefit by itself.



## DL-002AO — Local Motif Falsification Set v0.1

### Goal
Create a small, mechanism-driven motif library before any outcome-guided motif mining.

### Constructive motifs
M1 UNDERCUT_RECLAIM_TIGHTEN
- local support undercut
- prompt close reclaim
- subsequent range contraction
- no immediate selling-volume expansion

M2 RIGHT_SIDE_ACCELERATION_HANDLE
- improving recovery slope
- approach to resistance
- shallow pullback
- handle range/volume contraction

M3 PIVOT_TEST_HIGHER_LOW
- resistance retest
- pullback forms higher low
- close progression returns toward pivot
- rejection depth decreases

M4 BREAKOUT_RETEST_REACCELERATION
- close breakout
- retest with reduced sell pressure
- renewed close/range strength

### Adverse motifs
N1 UNDERCUT_NO_RECLAIM
- support undercut
- weak/slow reclaim or no reclaim
- continued lower lows

N2 HIGH_VOLUME_REJECTION_REPEAT
- repeated pivot tests
- long upper rejection / weak closes
- high or rising volume
- no close progression

N3 EXPANSION_AFTER_TIGHTNESS
- tight area
- sudden downside range expansion
- selling-volume expansion

N4 BREAKOUT_REENTRY_WEAK_BOUNCE
- breakout
- fast re-entry into base
- weak bounce fails below pivot
- second deterioration

### Why pre-register these
They are derived from already-defined mechanisms, not selected because their future returns looked attractive.

### Validation
For each constructive motif, compare with its adverse mirror on the same date and similar:
- liquidity
- price tier
- sector
- regime
- parent pattern maturity

Use existing D1/D3/D5/D10, MFE/MAE, R01 and stop-first outcomes.

## DL-002AP — Parent Pattern vs Local Motif Hierarchy

### Question
Does the local motif add value independent of the parent pattern?

Example:
- A cup may be mature.
- A right-side acceleration + shallow handle motif appears.
Does the motif improve outcomes within already-mature cups?

### Hierarchical tests
1. Parent pattern only.
2. Motif only.
3. Parent + motif.
4. Primitive controls + motif.
5. Primitive controls + parent label + motif.

Interpretation:
- if motif survives primitive controls and parent label, it is a genuine local incremental candidate;
- if parent loses significance after motif controls, the full named pattern may mostly be context;
- if neither survives primitive controls, discard both as redundant descriptions.

### Avoid hierarchy leakage
Motifs occurring after the selection timestamp cannot explain Selection Alpha.
They may only enter revalidation/execution research from the date they become observable.

## DL-002AQ — Boundary between Selection Alpha and Execution Alpha in Pattern Research

### Selection-time information
Allowed at scan date:
- confirmed daily swings
- pattern maturity as-of close
- local motif states already completed
- pivot distance
- RS / volume / time structure known then

### Execution-time information
Only after scan date:
- intraday breakout quality
- 15m retest
- follow-through
- temporary undercut/reclaim
- post-breakout local motifs

### Rule
Do not let post-selection motifs make the original selector look smarter in hindsight.

Store:
- firstObservableAt
- eligibleForSelectionResearch
- eligibleForExecutionResearch

### Importance
This preserves the current project distinction between Selection Alpha and Execution Alpha and prevents look-ahead contamination.



## DL-002AR — Support/Resistance as Zones, Not Magic Lines

### Core idea
Support and resistance should be modeled as price regions with width, strength and provenance, not as a single exact number.

### Evidence
- Recent algorithmic S/R research explicitly constructs zones around candidate levels to reduce chart-drawing subjectivity.
- Empirical work finds wider support/resistance zones can be associated with higher bounce probability, while also warning that this does not automatically imply a profitable strategy.
- Taiwan order-price clustering is pervasive; round-price and size clustering occur systematically in TWSE orders. Therefore discrete price/tick behavior can create local order concentration around nearby prices rather than one mathematically exact level.
- Other order-book research finds clustered orders/depth can contribute to the emergence of support/resistance behavior.

### Zone object
For each structural support/resistance region store:
- centerPrice
- lowerBound
- upperBound
- widthPct
- widthATR
- widthTicks
- sourceType
- sourceSwings[]
- touchCount
- rejectionCount
- breakCount
- lastTouchDate
- ageDays
- volume/turnover context
- roundNumberProximity
- scaleAgreement
- strengthConfidence

### Source types
- SWING_HIGH_CLUSTER
- SWING_LOW_CLUSTER
- W_NECKLINE
- CUP_RIM
- VCP_PIVOT
- PLATFORM_BOUNDARY
- MAJOR_PRIOR_HIGH
- MAJOR_PRIOR_LOW
- ROUND_PRICE_CLUSTER
- VOLUME_AT_PRICE_CLUSTER (research only if reliable data exists)

### Zone construction
Do not pick width from forward returns.
Candidate ex-ante width basis:
- max of tick-based minimum width and ATR-based tolerance,
- capped by local swing dispersion.
If multiple nearby structural levels overlap, merge into one composite zone and retain constituent sources.

### Why this matters
A close 0.1% above a single line may still be inside a genuine resistance zone.
Likewise a retest slightly below a nominal pivot may still be holding the broader support zone.

### Break / acceptance state
APPROACHING_ZONE
IN_ZONE
FIRST_CLOSE_ABOVE_ZONE
ACCEPTED_ABOVE_ZONE
RETESTING_ZONE
HELD_ZONE
FAILED_BACK_INSIDE
BROKE_BELOW_ZONE

State transitions become more meaningful than binary “above pivot yes/no.”

### No production rule change
Current Formal buyLow/buyHigh and breakout levels remain unchanged.
Zone research is Shadow only.

## DL-002AS — Support/Resistance Strength: Touches Are Ambiguous

### Competing mechanisms
Repeated touches can imply:
1. absorption: supply/demand is being consumed;
2. persistent barrier: repeated rejection confirms strong overhead supply/support;
3. self-fulfilling clustering: participants repeatedly place orders around salient levels.

Therefore raw touch count alone is not directional.

### Required context per touch
- approachSlope
- distanceTraveledBeforeTouch
- rejectionDepth
- closeLocation
- volumeAtTouch
- turnoverAtTouch
- wickRatio
- timeSincePriorTouch
- higherLow/lowerHigh between touches
- RS change between touches

### Absorption-like progression
- rejection depth shrinks,
- lows rise,
- closes finish nearer zone top,
- selling volume at rejection falls,
- time between attempts may shorten without deterioration.

### Barrier-strength progression
- repeated wide rejections,
- upper-wick expansion,
- selling volume increases,
- RS weakens,
- pullbacks deepen.

### Research field
touchProgressionState:
- ABSORPTION_LIKE
- BARRIER_PERSISTENT
- MIXED
- UNKNOWN

Do not infer from count alone.

## DL-002AT — Round-Number / Tick Clustering in Taiwan

### Taiwan evidence
TWSE research documents pervasive order-price and order-size clustering.
Round prices can therefore act as behavioral/order-placement anchors independent of classical chart geometry.

### Research variables
- distanceToRoundPriceTicks
- nearestRoundUnit
- pivotCoincidesWithRoundPrice
- zoneRoundPriceDensity
- breakoutCrossesRoundPrice
- retestAroundRoundPrice

### Important caution
Round-number clustering does not automatically equal exploitable support/resistance.
Some markets show clustering but weak actual barrier effects.

Therefore use round-number proximity as provenance/context, not as a standalone bullish/bearish signal.

## DL-002AU — Local vs Major Zone Conflict

### Problem
A local 20-day breakout can occur directly into a larger multi-month resistance zone.

### Conflict states
LOCAL_CLEAR_MAJOR_CLEAR
LOCAL_CLEAR_MAJOR_NEAR
LOCAL_CLEAR_MAJOR_INSIDE
LOCAL_CLEAR_MAJOR_REJECTED

### Key measurements
- localPivot
- majorZoneLower/Upper
- distanceLocalToMajorPct
- distanceLocalToMajorATR
- postLocalBreakoutRoomPct
- nearestRealResistance existing value
- patternSpecificMajorResistance

### Research question
Does “available air” between local breakout and major resistance explain why some technically valid B breakouts have poor follow-through?

This may connect directly to current reward/risk logic, but remains research-only until incremental evidence exists.



## DL-002AV — Overnight Gap vs Intraday Progression v0.1

### Taiwan-specific evidence
Pacific-Basin Finance Journal (2023) evidence from Taiwan finds past intraday and overnight returns contain different predictive information:
- intraday-return momentum is positive and persistent,
- overnight-return momentum is negative / reversal-like,
with an interpretation of daytime underreaction versus overnight overreaction.

This does not imply every individual overnight gap should be faded, but it is strong evidence that total close-to-close return should be decomposed.

### Pattern implication
A stock that reaches the same right-rim/pivot distance through:
A. large overnight gaps,
B. steady intraday progression,
may have different continuation quality.

### Research fields
- overnightReturn = open / priorClose - 1
- intradayReturn = close / open - 1
- overnightShareOfDailyMove
- cumulativeOvernightReturn5/20
- cumulativeIntradayReturn5/20
- gapCountInPattern
- positiveGapShare
- gapFillRateWithinDay if intraday data supports
- limitConstrainedGap flag
- corporateActionGap flag

### Pattern interactions
VCP:
- repeated overnight gaps inside a “tight” pattern may mean the daily-close path hides intraday discontinuity.

Cup/right side:
- recovery driven mostly by overnight gaps may differ from persistent intraday demand.

Breakout:
- gap-over-pivot breakout vs intraday-through-pivot breakout should be separate states.

W:
- undercut/reclaim occurring intraday differs from overnight opening below support then recovery.

### No mechanical fade rule
The Taiwan evidence is portfolio-level and historical.
Use overnight/intraday composition as context, not an automatic reversal signal.

## DL-002AW — Gap Taxonomy v0.1

### Gap types
STRUCTURAL_GAP
- gap associated with a major price-path transition / breakout.

CONTINUATION_GAP_CANDIDATE
- gap occurs within an established directional progression and price acceptance follows.

EXHAUSTION_GAP_CANDIDATE
- gap occurs after extended path, high attention/volume, poor close/follow-through.

COMMON_NOISE_GAP
- small gap within range without structural consequence.

CORPORATE_ACTION_GAP
- ex-right/ex-dividend/split-related; exclude from normal pattern interpretation.

LIMIT_MECHANISM_GAP
- previous limit-hit / price-limit mechanism likely constrained prior information incorporation.

### Fields
- gapPct
- gapATR
- gapTicks
- gapVsPriorRange
- gapIntoResistance
- gapAbovePivot
- closeVsOpenAfterGap
- closeVsPivot
- gapDayVolumeRatio
- priorExtension
- nextDayAcceptance
- priceLimitPriorDay
- corporateActionTag

### Research question
Is “gap breakout” quality explained by:
- gap size itself,
- intraday acceptance after the gap,
- position relative to older resistance,
- prior extension,
rather than by the traditional gap name?

## DL-002AX — Taiwan Price-Limit State as Pattern Context

### Evidence
Taiwan research shows price limits can delay information incorporation, affect serial correlation, and create continuation overnight followed by reversal during subsequent trading in older 7% regimes.
High-frequency TWSE work also documents acceleration toward the upper price limit (“magnet effect”).
Later research shows changing the price-limit band affects order aggressiveness, spreads, volatility, depth and execution quality.

### Modern relevance caution
Much classic evidence was collected under the old 7% regime, while current ordinary-stock limit is ±10%.
Use mechanism as prior evidence, but validate only within the current 10% regime for 2026 relevance.

### Pattern fields
- limitHitToday
- limitHitPrior1/2/3Days
- nearLimitClose
- limitHitFrequency20/60
- consecutiveLimitHits
- intradayUnlockedAfterLimit if observable
- postLimitOvernightMove
- postLimitIntradayMove

### Interpretation
A limit-up close is not equivalent to an unconstrained strong close:
- true equilibrium price may be above the cap,
- observed wick/range/close-location is mechanically censored,
- next-day gap may carry delayed information.

Therefore:
- do not classify limit-constrained bars with ordinary range/close-quality rules without a tag,
- do not call a limit-up “perfect no-upper-wick breakout” as if it were unconstrained.

### No production change
Research context only.



## DL-002AY — Phase-Specific Informed Flow vs Generic Institutional Streak

### External evidence
Taiwan market research finds:
- professional institutional trades can contain information related to future stock returns;
- institutional order aggressiveness / larger professional orders have stronger price contribution per order;
- foreign institutional order-imbalance volatility has predictive relationships in Taiwan;
- investor-type heterogeneity matters.

### Existing-system overlap
Current Formal already tracks foreign/trust/dealer streaks and institutional alignment.
Therefore DL-002 must NOT add another generic “institutional buying = good” score.

### Incremental question
Does WHERE informed/institutional participation appears inside a pattern matter?

### Phase-specific fields
For each pattern phase:
- foreignNetByPhase
- trustNetByPhase
- dealerNetByPhase
- institutionalAlignmentByPhase
- institutionalAccelerationIntoMaturity
- flowDivergenceFromPrice
- flowDuringHandle
- flowDuringSecondBottom
- flowDuringFinalContraction
- flowOnBreakout
- flowOnRetest

Where order-level research data later exists:
- orderAggressiveness
- largeOrderShare
- buySellImbalance
- orderImbalanceVolatility

### Mechanism hypotheses
ACCUMULATION_BEFORE_PRICE:
- institutional/large-order demand improves while price remains in mature compression.

CONFIRMING_FLOW:
- price approaches pivot and professional demand strengthens.

DIVERGENCE_WARNING:
- price pattern improves while professional flow deteriorates.

LATE_CHASE:
- institutional flow arrives only after extended breakout; may add less value or indicate crowded attention.

### Redundancy test
Compare phase-specific flow against:
- existing institutional streaks,
- price/volume primitives,
- Residual RS,
- Quiet/Attention.

Only retain if timing inside the pattern adds incremental information.

### No production implication
Research/Shadow only.

## DL-002AZ — Price-Flow Divergence v0.1

### Constructive divergence hypothesis
Price flat/tight while informed-flow proxy improves:
- possible hidden accumulation.

### Adverse divergence hypothesis
Price makes higher highs / approaches pivot while informed-flow proxy weakens:
- possible distribution / weak sponsorship.

### Fields
- priceSlopePhase
- flowSlopePhase
- priceFlowSlopeDifference
- priceFlowSignAgreement
- flowLeadBars
- priceLeadBars
- divergencePersistence

### Falsification
A divergence may simply reflect noisy/incomplete institutional data.
Require:
- point-in-time valid flow coverage,
- minimum history,
- UNKNOWN when missing,
- no current-data backfill into historical dates.

## DL-002BA — Flow Persistence vs One-Day Shock

### Question
Is gradual/persistent sponsorship more useful than a single large flow day?

### Fields
- positiveFlowDayRatio
- maxSingleDayFlowShare
- flowConcentration
- consecutivePositiveFlow
- phaseFlowPersistence
- flowShockZ
- postShockPriceResponse

### Relation to DL-001
This parallels Information Discreteness:
- gradual flow path vs one-shot attention event.
Test whether flow persistence adds beyond price-path discreteness.



## DL-002BB — Event-Driven vs Endogenous Pattern Formation v0.1

### Core question
Did the pattern mature because of gradual endogenous supply/demand evolution, or was the structure dominated by a discrete information event?

### Taiwan relevance
Taiwan-listed firms disclose monthly revenue, creating recurring salient information events.
Recent Taiwan evidence shows record-high monthly-revenue announcements can generate:
- short-term reversal around the next-day opening, especially after strong pre-announcement run-ups,
- but positive longer-horizon post-announcement drift over roughly 20 trading days.
Other Taiwan work finds analyst forecast revisions and earnings-related information can also exhibit delayed price adjustment.

### Research implication
A breakout around an event can have very different mechanics from a non-event breakout.

### Event-context tags
- monthlyRevenueAnnouncement
- earningsAnnouncement
- analystRevisionEvent
- materialInformationEvent
- exRightDividendEvent
- regulatoryAlertEvent
- eventDateKnownAtAsOf
- eventProximityDays
- preEventRunupPct
- eventGapPct
- eventIntradayReturn
- postEventDriftState

### Pattern categories
ENDOGENOUS_MATURATION
- no salient known event near trigger; compression/recovery develops gradually.

EVENT_CATALYZED
- mature pattern exists before event, event triggers breakout.

EVENT_CREATED
- pattern/breakout appears mainly because a sudden event discontinuity creates the geometry.

EVENT_DISTORTED
- corporate action/regulatory/price-limit event makes normal morphology unreliable.

### Key tests
1. mature pattern + event catalyst vs mature pattern without event;
2. event breakout without mature pattern vs event + mature pattern;
3. strong pre-event runup vs modest pre-event runup;
4. overnight event gap vs intraday acceptance.

### Why this matters
Without event tags, the research may falsely conclude:
“cup breakout predicted the move,”
when the actual driver was a revenue/earnings information shock.

Likewise, the event alone may not explain which stocks sustain the move; pre-event pattern maturity may condition the post-event response.

### No production implication
Event context is research provenance/interaction only.

## DL-002BC — Pre-Event Runup / Attention Risk

### Evidence prior
Recent Taiwan research on record-high monthly revenue announcements reports stronger short-term reversals after strong pre-announcement runups.
Other Taiwan work around monthly-revenue periods links investor attention / lottery-like demand to pre-announcement price behavior.

### Research variables
- preEventReturn5/10/20
- preEventATRExpansion
- preEventLimitHitCount
- preEventTurnoverExpansion
- preEventRSChange
- preEventPatternMaturity
- eventSurpriseProxy if point-in-time valid

### Hypothesis
A beautiful technical breakout after a large pre-event runup may be more vulnerable to attention-driven short-term reversal than the same pattern with modest pre-event extension.

This overlaps current overheat controls and must pass redundancy testing.

## DL-002BD — Event × Pattern Interaction Matrix

### Possible states
NO_PATTERN_NO_EVENT
PATTERN_NO_EVENT
EVENT_NO_PATTERN
PATTERN_PLUS_EVENT

### Outcomes
Compare same-date / matched controls on:
- D1/D3/D5/D10/D20
- overnight vs intraday return
- MFE/MAE
- R01 failure
- stop-first
- post-event drift

### Interpretation
If PATTERN_PLUS_EVENT dominates EVENT_NO_PATTERN after controls, pattern maturity may condition how information is absorbed.
If no difference remains after event surprise/runup controls, technical morphology may be secondary.



## DL-002BE — Pattern × Market-State Continuation/Transition v0.1

### Taiwan evidence
Pacific-Basin Finance Journal evidence finds Taiwan momentum behaves very differently when the market remains in the same state versus transitions:
- positive momentum during market-state continuation,
- reversal during state transitions.
The frequent transitions help explain why unconditional Taiwan momentum can look weak.

### Pattern implication
A technically mature bullish pattern may be more likely to persist when the broader market state is stable/continuing, and more vulnerable when the market is transitioning.

### Reuse existing regime framework
Do not invent a new market regime if the research system already has durable BULL_BROAD / MIXED / BEAR_BROAD or equivalent labels.

Add:
- regimeAtPatternStart
- regimeAtMaturity
- regimeAtBreakout
- regimeTransitionDuringPattern
- daysSinceRegimeChange
- breadthChangeDuringPattern
- marketRSChangeDuringPattern

### Core comparisons
For each pattern/primitive:
1. same-state continuation;
2. transition into stronger state;
3. transition into weaker state;
4. persistently mixed/choppy state.

### Hypotheses
- compression + improving RS during a stable bull state may represent constructive continuation;
- the same compression during a weakening transition may be mere hesitation before failure;
- W/reversal structures may behave differently during transitions than continuation patterns.

### Do not pool blindly
Report pattern results by regime continuation/transition before any unconditional average.

## DL-002BF — Pattern Family × Regime Role

### Continuation-oriented structures
- VCP
- flag/platform
- cup/handle

Primary hypothesis:
better in continuing/up-improving regimes.

### Reversal-oriented structures
- W / double bottom
- undercut-reclaim
- bullish reversal candlesticks

Primary hypothesis:
may have more relevance near regime transitions, but this is not assumed.

### Test interaction
Do not conclude:
“W works in bear markets”
from intuition.
Test:
pattern primitive × regime state × regime transition direction.

### Multiple-testing control
Only a limited pre-registered interaction matrix is allowed:
- continuation patterns × continuation vs weakening transition;
- reversal patterns × transition vs stable bear/mixed;
- failure motifs × weakening transition.

## DL-002BG — Market Breadth Confirmation vs Redundancy

### Existing overlap
Current research already tracks market/sector breadth and sector persistence.

### Incremental question
Does breadth change specifically during pattern maturation matter beyond breadth level?

Fields:
- breadthAtPatternStart
- breadthAtMaturity
- breadthSlope
- sectorBreadthSlope
- breadthDivergenceFromStock
- breadthTransitionBeforeBreakout

### Constructive hypothesis
Stock pattern matures while sector/market breadth improves.

### Warning hypothesis
Stock reaches pivot while breadth deteriorates.

### Redundancy rule
If breadthSlope adds nothing beyond existing sector persistence/regime variables, discard it.



## DL-002BH — Support/Resistance Role Reversal Must Be Proven, Not Assumed

### Practitioner claim
Old resistance often becomes support after breakout, and old support becomes resistance after breakdown.

### Research position
Treat role reversal as a testable state transition, not a law.

### Zone transition
RESISTANCE_ACTIVE
-> FIRST_BREAK_ABOVE
-> ACCEPTED_ABOVE
-> RETEST_FROM_ABOVE
-> ROLE_REVERSAL_CONFIRMED or FAILED_BACK_INSIDE

Mirror for support breakdown.

### Confirmation fields
- closesAboveZoneBeforeRetest
- barsUntilRetest
- retestDepthIntoZone
- retestCloseLocation
- retestVolumeContext
- subsequentHigherLow
- reclaimAfterTemporaryUndercut

### Anti-leakage
The zone strength at date t can use only touches/events known through t.
Future successful retests must never be backfilled to make the historical zone look stronger.

### Research question
Does proven role reversal add execution information beyond current 15m hold/retest logic?
No assumption of automatic polarity flip.

## DL-002BI — Fit Confidence vs Predictive Probability

### Critical distinction
Pattern-fit confidence answers:
“How closely does this chart match the frozen geometry?”

It does NOT answer:
“What is the probability the stock will rise?”

A perfect textbook cup can still fail.

### Separate outputs
- geometryFitConfidence
- dataQualityConfidence
- stabilityConfidence
- evidenceMaturityStatus
- observedOutcomeRateBucket (research report only after sufficient samples)

Never label a 90% geometry fit as “90% chance of success.”

### Calibration
After adequate prospective samples, bucket detector outputs by confidence and test:
- monotonic D5/MFE improvement,
- R01 failure rate,
- stop-first rate,
- confidence calibration stability across dates/regimes.

If higher fit confidence does not improve outcomes monotonically/stably, the fit score is cosmetic and should not be used for decision ranking.

## DL-002BJ — Universe / Survivorship / Listing-Age Controls

### Historical-risk
A chart-pattern backtest built only from stocks that are listed today creates survivorship bias:
failed/delisted firms disappear, making historical patterns look better.

### Required historical-universe semantics
For each as-of date:
- include only securities genuinely eligible/listed at that date,
- retain later-delisted securities when source data permits,
- apply contemporaneous listing status,
- do not use future market-cap/liquidity membership.

### Listing-age
Long patterns require sufficient history.
For newly listed stocks:
- insufficientHistory = UNKNOWN / INELIGIBLE_FOR_PATTERN_ANALYSIS,
- never classify “no cup” merely because 120 bars do not exist.

### IPO / new-listing special behavior
IPO/new listing periods can have:
- no mature historical resistance,
- unusual price limits/trading rules,
- unstable ATR,
- large gaps.
Keep a separate NEW_LISTING context and do not force normal multi-month topology.

## DL-002BK — Point-in-Time Zone Construction

### Problem
A historical resistance cluster is easy to draw after seeing all future touches.
That is look-ahead.

### Rule
At every as-of date rebuild zones only from confirmed swings available then.
Store:
- zoneCreatedAt
- constituentLevelsKnownAtCreation
- constituentConfirmedAt[]
- zoneUpdatedAt
- updateReason
- touchCountAsOf
- zoneVersion

### Zone evolution
Zones may widen/narrow/merge as new confirmed structure arrives.
Historical snapshot must retain the older version; do not rewrite history.

### Example
If two future swing highs later form a beautiful triple-top resistance, the first historical date may have had only one weak swing high.
The detector must preserve that uncertainty.

## DL-002BL — Prospective Pattern Shadow Architecture

### Goal
Create a durable research layer that can continue across chats and accumulate point-in-time evidence without touching Formal Core.

### Daily Pattern Shadow snapshot
For every stored research candidate/control:
- scanDate
- symbol
- Formal cohort
- dataThroughDate
- detectorVersion
- swingSpecVersion
- patternSpecVersion
- latent primitives
- named pattern states
- zones
- motifs
- fit/stability confidence
- regime/event/flow context
- data-quality flags
- firstObservableAt
- selectionVsExecution eligibility

### Outcome updater
Later append:
- D1/D3/D5/D10/D20
- MFE/MAE
- R01
- stop-first
- breakout/retest/reclaim lifecycle

Never alter the original snapshot.

### Formal isolation
Pattern Shadow:
- no capital
- no push
- no formal ranking
- no monitoring eligibility change
- no Formal thresholds
- no auto-promotion

### Engineering class
An isolated new research table/API/snapshot path is Class A under current governance if regression tests prove zero impact on Formal outputs.



## DL-002BM — Multi-Timeframe Coherence v0.1

### Core question
Does agreement across higher-, selection-, and execution-timeframes add incremental information, or merely repeat trend variables already present?

### External evidence
- Taiwan research using daily/weekly/monthly/intraday technical indicators reports materially different performance across frequencies; frequency choice itself matters.
- Taiwan theses using weekly/monthly “signal resonance” report that combinations across horizons can outperform daily-only variants in their tested samples.
- Broader finance research on trend factors and multi-horizon forecasting also supports the idea that short-, intermediate- and long-horizon price information can differ.

These findings support testing multi-horizon coherence, not assuming that more timeframe agreement is always better.

### Proposed hierarchy
HIGHER_CONTEXT:
- weekly / ~60-120d swing structure
- major resistance/support
- regime / sector state

SELECTION_FRAME:
- daily pattern maturity / primitives

EXECUTION_FRAME:
- 15m formal confirmation
- 10m auxiliary only, preserving current system semantics

### Coherence states
ALIGNED_UP:
- higher context constructive
- daily setup constructive

DAILY_EARLY_WEEKLY_NEUTRAL:
- daily pattern matures before weekly structure fully turns.

DAILY_CONFLICT_WEEKLY_DOWN:
- attractive daily pattern inside deteriorating higher timeframe.

WEEKLY_STRONG_DAILY_PULLBACK:
- higher structure strong while daily forms support/recovery.

### Research fields
- weeklySwingTrend
- weeklyCompressionState
- weeklyResistanceZone
- dailyPatternMaturity
- dailyVsWeeklyPivotConflict
- dailyVsWeeklySupportConflict
- higherTimeframeRoomPct
- timeframeAlignmentState
- timeframeTransitionState

### Key test
Compare daily pattern outcomes with and without higher-timeframe alignment after controlling:
- current MA20/MA60 trend,
- ret60,
- priorHigh60,
- regime,
- Residual RS.

If weekly context adds nothing after these controls, reject it as redundant.

### Anti-double-counting
Do not add:
“weekly bullish + daily bullish + MA bullish = three votes.”
They may be the same trend information at different aggregations.

### Role of intraday
15m confirmation remains Execution Alpha.
Weekly/daily agreement may condition which daily candidates are structurally attractive, but cannot use later intraday data in Selection Alpha.

## DL-002BN — Multi-Timeframe Conflict May Be Informative

### Why conflict matters
A daily breakout into weekly resistance is not the same as a daily breakout with clear weekly space.

Conversely, a daily W-bottom within a strong weekly uptrend may be a continuation pullback rather than a major reversal.

### Conflict variables
- dailyBreakoutIntoWeeklyZone
- dailyWInsideWeeklyUptrend
- dailyBullishWeeklyBearish
- dailyMaturityBeforeWeeklyTurn
- weeklyTrendDeteriorationDuringDailyPattern

### Research hypotheses
H1 alignment improves continuation-pattern follow-through.
H2 early daily improvement before weekly confirmation may capture earlier entries but more false positives.
H3 daily bullish structure against weekly deterioration may have poor follow-through.
H4 reversal patterns should be interpreted differently depending on higher-timeframe trend.

No assumption is promoted without same-date matched evidence.

## DL-002BO — Timeframe Aggregation Consistency

### Problem
A weekly bar hides the order of daily events; a daily bar hides intraday order.

Therefore “weekly cup” and “daily cup” are not automatically equivalent representations.

### Rule
Higher-timeframe features must be computed from only completed source bars.
At Friday close, the current week becomes completed.
Before then, current-week weekly OHLC is PROVISIONAL and cannot be backfilled as completed.

### Research storage
- timeframe
- barCompletedAt
- provisional
- dataThrough
- firstObservableAt

This preserves point-in-time integrity across timeframe aggregation.



## DL-002BP — Volume-at-Price / Cost-Zone Research Feasibility

### Concept
Time-based volume tells WHEN trading occurred.
Volume-at-price tells WHERE trading occurred.

This may improve support/resistance-zone research by measuring historical acceptance around prices rather than relying only on swing touches.

### Source capability verified
Fugle currently provides:
- intraday volumes endpoint with exact current-day price buckets:
  - price
  - cumulative volume
  - volumeAtBid
  - volumeAtAsk
- historical intraday candles from 2023-05-23 onward at 1/3/5/10/15/30/60-minute intervals.
- historical minute candles provide OHLC, volume and cumulative average price, but not exact historical trade-by-price buckets.

### Critical data-integrity distinction
EXACT_CURRENT_PROFILE:
- direct current-day intraday volume-by-price endpoint.
- can be prospectively snapshotted.

APPROX_HISTORICAL_PROFILE:
- reconstructed from minute candles by assigning minute volume to a representative price/range.
- this is NOT exact volume-at-price because intraminute trade-price distribution is unknown.

Do not mix the two without provenance.

### Prospective research opportunity
For Formal/Shadow candidates only, an isolated research process could prospectively store the end-of-day exact volume-by-price profile:
- profileDate
- symbol
- priceBucket
- totalVolume
- volumeAtBid
- volumeAtAsk
- source
- capturedAt

This would create genuine forward data for future support/resistance research without altering trading behavior.

### Cost/acceptance zone candidates
From exact stored profiles:
- pointOfControlPrice
- highVolumeNode zones
- lowVolumeNode zones
- profileConcentration
- volumeWeightedMedianPrice
- volumeAboveCurrentPrice
- volumeBelowCurrentPrice
- bidAskImbalanceByZone
- pivotOverlapWithHighVolumeNode
- supportOverlapWithHighVolumeNode
- breakoutThroughLowVolumeArea

### Hypotheses
1. A price pivot overlapping a high-participation zone may behave differently from a visually similar pivot with little historical participation.
2. Breakout with little volume-at-price overhead (“thin air”) may have more room than breakout directly into a high-volume overhead zone.
3. High volume at a price can mean acceptance/position inventory, not automatically support; context and side-of-market matter.

### Practitioner-evidence caution
Volume Profile is widely used as a support/resistance map, but strong peer-reviewed evidence for its standalone equity alpha is limited.
Therefore treat it as a zone/context feature requiring prospective validation.

### Engineering classification
Prospectively snapshotting an isolated research-only volume profile for research cohorts can be Class A if:
- it does not alter Formal fetch timing/output,
- it uses a separate table/path,
- failures remain UNKNOWN and never block trading,
- regression confirms zero Formal impact.

No implementation in this research note itself.

## DL-002BQ — Historical Volume-Profile Approximation Must Be Marked Approximate

### If historical minute reconstruction is used
Possible allocation methods:
- all minute volume at close;
- all minute volume at average;
- distribute across [low, high] using a simple kernel.

Each method creates artificial structure.

### Rule
Any reconstructed profile must store:
- profileMethod
- sourceTimeframe
- approximation=true
- bucketWidth
- allocationRule

### Robustness requirement
A historical volume-profile finding is not credible unless it is stable across at least two reasonable allocation methods.

### Preferred evidence order
1. prospective exact price-by-volume snapshots;
2. historical trade-level data if later available;
3. minute-candle approximations only as exploratory evidence.

## DL-002BR — VWAP / Average-Price Context Boundaries

### Source capability
Fugle minute candles expose the field average, documented as cumulative average transaction price from the open.

### Research use
This can support intraday execution context such as:
- current price vs session cumulative average,
- breakout/retest relative to session average,
- acceptance above/below the session’s traded average.

### Do not overclaim
This is session cumulative average data.
It should not be labeled arbitrary Anchored VWAP from a historical pattern pivot unless that quantity is explicitly reconstructed from sufficiently granular data.

### Candidate execution fields
- priceVsSessionAveragePct
- pivotVsSessionAveragePct
- retestVsSessionAverage
- sessionAverageSlope
- acceptanceAboveSessionAverageBars

These are Execution Alpha features only.

### Redundancy
Compare against existing 15m close/reversal/volume fields.
If session-average context adds nothing, reject it.


## DL-002BS — Entropy / Path Complexity as a Diagnostic, Not a Buy Signal

### External evidence
- Journal of Econometrics research finds small but significant nonlinear serial dependence in stock returns using entropy-based measures, while conditional profit predictability remains fragile.
- Permutation-entropy research shows financial-market efficiency/predictability varies over time and market state.
- Entropy can discriminate ordered versus random price dynamics, but low entropy alone does not imply a profitable direction.

### Pattern use
Use path complexity to characterize whether a pattern phase is:
- orderly directional progression,
- noisy churn,
- mechanically constrained by ticks/price limits,
- illiquid/stale.

### Candidate fields
- permutationEntropy20/60
- directionalSymbolEntropy
- returnSignEntropy
- swingDirectionEntropy
- entropyChangeFormationToMaturity
- entropyChangePreBreakout
- complexityVsLiquidity
- complexityVsTickDominance

### Hypotheses
1. Healthy compression may show reduced local disorder while liquidity remains viable.
2. Dead liquidity can also show low entropy; liquidity/tick controls are mandatory.
3. Breakout preparation may involve lower path complexity followed by controlled expansion.
4. Extremely low entropy after repeated limit hits may be mechanical, not predictive.

### Redundancy
Directly compare against:
- directionalEfficiency
- DL-001 Information Discreteness
- volatility/range contraction
- positiveDayRatio
- liquidity/tick variables

If entropy adds no independent information, discard it.

### No directional assumption
LOW_ENTROPY is not inherently bullish.
HIGH_ENTROPY is not inherently bearish.
Entropy is a complexity/state descriptor.

## DL-002BT — Pattern State Transition / Hazard Research

### Motivation
The useful question may be:
“How likely is a mature pattern to transition soon?”
rather than only:
“Does the pattern exist?”

### State-duration fields
- daysInCurrentState
- daysSinceStructureValid
- daysSinceMature
- daysSincePivotReady
- numberOfFailedTransitions
- priorStateSequence
- stateReentryCount

### Transition events
FORMING -> VALID
VALID -> MATURE
MATURE -> PIVOT_READY
PIVOT_READY -> BREAKOUT
PIVOT_READY -> INVALIDATED
BREAKOUT -> RETEST
RETEST -> RESUME
RETEST -> FAIL
FAIL -> RECLAIM

### Research questions
- Does breakout hazard rise then fall as a mature pattern ages?
- Do repeated failed transitions signal absorption or staleness?
- Does regime/RS/volume context shift transition rates?

### Important caution
A high breakout hazard is not automatically high expected return.
Transition probability and post-transition payoff are different objects.

### Validation
Estimate only after sufficient prospective samples.
Until then store durations/transitions descriptively.

## DL-002BU — Measurement Uncertainty Around Pattern Levels

### Problem
A pivot/neckline/rim/zone is estimated from noisy discrete prices.
Treating it as exact creates false precision.

### Store uncertainty
For each key level:
- pointEstimate
- lowerZone
- upperZone
- sourceCount
- sourceDispersionTicks
- sourceDispersionATR
- scaleDispersion
- confidenceClass

### Consequence
A close one tick above pointEstimate but still inside the uncertainty zone is not a clean structural break.

### Research comparison
POINT_LEVEL logic vs ZONE_ACCEPTANCE logic:
- false-breakout rate
- missed-breakout rate
- retest behavior
- execution delay

No Formal threshold changes during research.



## DL-002BV — Sector Pattern Synchrony vs Generic Sector Strength

### External evidence
- Classic Journal of Finance research finds industry momentum explains a substantial portion of individual-stock momentum.
- Peer-reviewed Taiwan evidence documents an industry momentum effect and links it to industry return autocorrelation.
- Recent Taiwan research continues to study factor/industry momentum as a distinct component of short-term return persistence.

### Existing overlap
The system already has:
- sector score
- breadth
- sector persistence
- Residual RS
- industry ranking

Therefore do NOT create another generic “strong sector” factor.

### Incremental question
Does the number/quality of peer stocks simultaneously entering similar structural states add information beyond sector returns/breadth?

### Pattern-synchrony fields
- sectorPatternMaturePct
- sectorPivotReadyPct
- sectorBreakoutConfirmedPct
- sectorFailurePct
- peerCompressionPct
- peerRSImprovingPct
- leaderPatternState
- medianPeerPatternAge
- patternDispersionWithinSector
- stockVsSectorPatternLeadLag

### States
ISOLATED_STOCK_PATTERN
- stock matures while few peers do.

SECTOR_SYNCHRONIZED
- multiple peers mature/approach pivots.

LEADER_FIRST
- stock reaches maturity/breakout before sector peers.

LAGGARD_CATCHUP
- sector already advanced; stock pattern matures later.

SECTOR_EXHAUSTION
- peers have already broken out/extended while stock is only now approaching pivot.

### Competing hypotheses
H1 synchronized maturation reflects broad fundamental/information diffusion and improves continuation.
H2 leader-first can capture the strongest stock before sector breadth catches up.
H3 laggard-catchup may offer remaining room or may be late-cycle residual chasing.
H4 broad simultaneous breakouts may also represent crowded attention/exhaustion.

Test rather than choose a story.

### Redundancy controls
Compare with:
- sector return
- sector breadth
- sector persistence
- Residual RS
- Attention/Quiet state
- overall market regime

If pattern synchrony adds no incremental information, discard it.

## DL-002BW — Pattern Lead/Lag Within Sector

### Goal
Measure whether a stock structurally leads or lags peers.

### Fields
- daysAheadOfSectorMedianMaturity
- daysAheadOfSectorMedianBreakout
- rsLeadLag
- compressionLeadLag
- flowLeadLag
- peerFollowThroughAfterLeader

### Research questions
- Do early leaders have better D5/D10 continuation?
- Do late pattern maturities suffer from reduced remaining upside?
- Does sector confirmation after a leader breakout improve revalidation confidence?

### Relation to existing overheat research
A laggard pattern in an already-extended sector may look technically early at stock level but economically late at sector-cycle level.
Test against overheat/remaining-upside variables.

## DL-002BX — Sector Synchrony Point-in-Time Integrity

### Rule
Sector pattern breadth on date t may only use peer pattern states known by t.

No future peer breakout may be backfilled to say:
“the sector was synchronized.”

### Universe controls
Use contemporaneous sector membership when available.
If historical classification is unavailable, record classificationProvenance and avoid overstating exact historical sector membership.

No Formal change.



## DL-002BY — Double-Bottom Strong Falsification Prior

### New counter-evidence
A 2026 SSRN preprint (“The Double Bottom Under the Microscope”) reports roughly 13,704 mechanically detected double-bottom events across six liquid futures markets over about seven years.

Reported result:
- formation, confirmation and neckline-break entries did not consistently beat random entries at the same moment;
- common quality filters such as symmetry, volume, prior trend and low similarity did not show robust forward information;
- the apparent strength of neckline-break confirmation could be mechanically contaminated by measuring a move that is already underway rather than remaining forward return from an actionable timestamp.

### Limitations
- futures, not Taiwan equities;
- preprint, not treated as final peer-reviewed truth;
- detector definitions may differ from DL-002K;
- market structure and horizons differ.

### Why retain this evidence
It directly falsifies the casual assumption:
“a cleaner double bottom + neckline break must have edge.”

### Stronger DL-002K test
For every W state distinguish:
- FORMATION_RETURN: move from second low toward neckline;
- CONFIRMATION_RETURN_ALREADY_REALIZED: return embedded before the neckline break becomes observable;
- FORWARD_ACTIONABLE_RETURN: return only after first actionable confirmation timestamp.

Primary evidence for selection usefulness must be FORWARD_ACTIONABLE_RETURN, not total low-to-post-breakout move.

### Baseline requirement
Compare to matched/random same-date entries, not just positive raw return.
A bull market can make every neckline break look profitable.

### Consequence
W morphology remains a hypothesis.
It earns no privileged status merely because it is a classic chart pattern.

## DL-002BZ — Pattern Confirmation Mechanical-Return Bias

### General problem
Many pattern definitions require price to move in the predicted direction before “confirmation.”
Examples:
- W neckline break,
- cup rim breakout,
- flag breakout,
- head-and-shoulders neckline break.

If performance measurement begins at the earlier pivot/low, the detector receives credit for return that was required to define the pattern in the first place.

### Required timestamps
- earliestFormationObservableAt
- maturePreBreakoutObservableAt
- confirmationObservableAt
- firstActionablePriceAfterConfirmation

### Outcome attribution
PRE_CONFIRMATION_MOVE
POST_CONFIRMATION_FORWARD_RETURN
TOTAL_PATTERN_MOVE

Only POST_CONFIRMATION_FORWARD_RETURN is valid for judging confirmation-entry edge.

### Selection research
Pre-breakout maturity can be evaluated from scan date without waiting for confirmation.
This is one reason Pattern Maturity may be more informative than a fully completed textbook label.

## DL-002CA — Pattern-Measured Targets Are Separate Hypotheses

### Practitioner convention
Technical-analysis texts often project:
- W height above neckline,
- cup/base height above breakout,
- flagpole length from breakout,
- triangle/range height.

### Evidence boundary
The existence/predictive value of a chart pattern does not validate its traditional measured-move target.
Academic evidence supporting pattern-conditioned return predictability is not the same as evidence that “pattern height = future move.”

### Research comparison
For each confirmed pattern compute descriptively:
- classicalMeasuredTarget
- nearestRealResistance (existing system concept)
- fixed forward MFE horizons
- ATR-normalized target distances

Evaluate:
- target hit before invalidation
- time to target
- overshoot/undershoot
- whether measured target lies beyond known major resistance
- calibration by pattern family/regime

### No Formal target change
Current target/RR logic remains locked.
Traditional measured moves are a research benchmark only.

## DL-002CB — Structural Invalidation vs Current Stop Research

### Distinguish
PATTERN_INVALIDATION_LEVEL:
- level at which frozen morphology is no longer valid.

CURRENT_FORMAL_STOP:
- existing system stop based on support/ATR and plan logic.

They need not be equal.

### Research fields
- patternInvalidationPrice
- formalStopPrice
- stopVsInvalidationPct
- invalidationOccursFirst
- stopOccursFirst
- recoverAfterFormalStopButPatternValid
- patternFailsBeforeFormalStop

### Research purpose
Understand whether pattern topology contains risk information.
Do not change stop placement automatically.

### Engineering boundary
Any use of pattern invalidation to alter real stop/position logic is Class C and requires explicit owner approval.



## DL-002CC — Support/Resistance Decay and Bounce Evidence

### External evidence
1. Applied Financial Economics (2012):
   - rule-based horizontal support/resistance levels identified from historical local extrema;
   - support levels were better than resistance at predicting trend interruption;
   - nevertheless the resulting rules did not generate systematic excess returns versus buy-and-hold.

2. Chung & Bellotti (2021 preprint):
   - intraday support/resistance zones showed statistically significant temporary reversal behavior;
   - zones with more prior bounces were more likely to bounce again;
   - bounce probability decayed as the level aged.

### Research implications
A zone can have:
- descriptive predictive relevance,
without
- sufficient economic edge after costs / opportunity cost.

Therefore separate:
ZONE_REACTION_PROBABILITY
from
FORWARD_RETURN_EDGE.

### Zone-strength fields strengthened
- priorBounceCount
- priorBreakCount
- timeSinceCreation
- timeSinceLastBounce
- bounceDepthHistory
- bounceStrengthDecay
- zoneAgeAdjustedStrength
- touchRecencyWeightedCount

### Decay hypothesis
A zone formed long ago with no recent interaction may be less relevant than a similarly strong recent zone.

### Counter-hypothesis
Very old major highs/lows may remain psychologically salient.
Do not impose monotonic decay as a law; test recency-weighted vs unweighted strength.

## DL-002CD — Dynamic Trendlines vs Horizontal Zones

### Why separate them
Horizontal support/resistance is defined by repeated price regions.
Trendlines/channels encode changing support/resistance over time.

### Research-only dynamic geometry
- risingSupportSlope
- fallingResistanceSlope
- channelWidthATR
- touchCountDynamic
- slopeStability
- lineFitError
- breakoutDistanceFromLine
- horizontalZoneConflict

### Use
Primarily for:
- flags
- wedges
- channels
- tightening triangles.

### Caution
Two points always define a line.
A valid research trendline should require:
- at least 3 confirmed structural contacts or a fitted swing-based boundary,
- point-in-time availability,
- bounded fit error,
- no hindsight selection of the “best-looking” line.

### Comparison
For continuation patterns compare:
- horizontal pivot only,
- dynamic boundary only,
- both.

If dynamic trendlines add no incremental information, discard them.

## DL-002CE — Zone Reaction Is Not Automatically Trade Edge

### Principle
A support zone can increase the chance of a small bounce while still producing poor expected returns if:
- upside is capped,
- downside tails are larger,
- transaction/slippage costs absorb the bounce,
- the bounce arrives too late.

### Required outcomes for zone research
- probabilityOfReaction
- medianReactionMFE
- medianReactionMAE
- timeToReaction
- followThroughAfterReaction
- R multiple vs current risk framework
- cost-adjusted value

This prevents “statistically significant bounce” from being mislabeled a good trade.



## DL-002CF — Taiwan Closing-Auction Distortion Around Daily Breakouts

### Taiwan market microstructure
TWSE uses a five-minute closing call auction in the final pre-close interval (13:25-13:30).
Research on Taiwan finds:
- the closing call reduced some closing volatility/noise relative to prior mechanisms;
- transparency reforms in 2012 improved market quality and reduced possible closing-price manipulation;
- nevertheless month-end, quarter-end and index-futures-expiration effects have historically concentrated in the final closing interval.

### Why this matters
Current Formal B uses the daily close relative to priorHigh20.
A daily close above resistance can arise in two distinct ways:
A. price traded/accepted above resistance before the closing auction;
B. the final closing auction alone lifts the official close above resistance.

These may have different follow-through quality.

### Research fields using historical minute data
From 2023-05-23 onward Fugle historical minute candles permit:
- preClosingCallPrice = last completed minute before 13:25
- officialClose = final closing auction price / final bar
- closingAuctionReturnPct
- preCallVsPivotPct
- officialCloseVsPivotPct
- breakoutCreatedByClosingAuction
- breakoutStrengthenedByClosingAuction
- closingAuctionVolumeShare if inferable from minute volumes
- finalFiveMinuteRange / volume context

### Context tags
- monthEnd
- quarterEnd
- indexFuturesExpirationDay if calendar is available
- rebalanceEvent if point-in-time known

### Key tests
Compare B-style daily breakout candidates:
1. PRECALL_ALREADY_ABOVE_PIVOT
2. AUCTION_CREATED_BREAKOUT
3. AUCTION_RESCUED_WEAK_CLOSE
4. AUCTION_REJECTED_BREAKOUT

Outcomes:
- next-day overnight return
- next-day intraday return
- D1/D3/D5
- R01 failure
- 15m execution reach / retest

### Hypothesis
A close-only breakout created by the auction may have weaker natural price acceptance than one already established before 13:25.
This is plausible but not assumed.

### Important caution
The closing auction is the official equilibrium-setting mechanism and can improve price discovery.
Do not classify every auction-driven move as manipulation or bad quality.

### Research boundary
This is a research explanation for daily-close breakout quality only.
No Formal B close condition changes.

## DL-002CG — Closing Price Quality / Last-Interval Decomposition

### Broader idea
Daily candle features such as:
- closeLocation
- upper wick
- breakout close
may be sensitive to the final auction.

### Research decomposition
- preCallDailyCloseLocation proxy
- officialDailyCloseLocation
- closeLocationChangeFromAuction
- upperWickChangeFromAuction
- breakoutStatusPreCall
- breakoutStatusOfficialClose

### Benefit
Distinguishes:
“strong all-day close”
from
“strong official close generated in the final auction.”

### Data horizon
Historical minute evidence begins in 2023, so this is a modern-regime research lane and should not be backfilled before data availability.



## DL-002CH — Technical-Pattern Edge Decay / Adaptive-Market Risk

### Strong external counter-evidence
Financial Markets and Portfolio Management (2023) tests 6,406 technical trading rules across 23 developed and 18 emerging equity markets over long histories using Stepwise Superior Predictive Ability tests to control data snooping.

Main findings relevant to DL-002:
- many markets show in-sample technical predictability;
- predictive ability declines sharply over time;
- moderate transaction costs erase many apparent advantages;
- rules selected as recent best performers do not show persistent out-of-sample superiority and often underperform buy-and-hold.

### Implication
Even a genuinely historical pattern effect can decay as:
- market structure changes,
- participants learn/adopt it,
- liquidity/transaction technology changes,
- regulation changes.

### Pattern research must test stability over calendar time
Fields / diagnostics:
- effectByYear
- effectByRollingWindow
- recentVsOldEffect
- directionConsistencyAcrossYears
- effectHalfLifeDescriptive
- transactionCostSensitivity
- turnoverSignalFrequency
- latestRegimeEffect

### No automatic retuning
Do NOT respond to decay by continuously tuning thresholds to the most recent winners.
That creates a moving overfit target.

Preferred process:
1. freeze detector;
2. accumulate prospective evidence;
3. evaluate rolling stability;
4. retire/de-emphasize stale research factors if evidence disappears;
5. any new definition becomes a new experiment version.

### 2026 relevance
For any literature effect discovered in older data:
OLD_EVIDENCE supports mechanism plausibility.
RECENT_PROSPECTIVE_EVIDENCE determines current usefulness.

## DL-002CI — Pattern Research Requires Economic, Not Only Statistical, Significance

### Required layers
STATISTICAL:
- effect direction / uncertainty
- date-cluster robustness
- multiple-testing adjusted evidence

ECONOMIC:
- D5/D10 magnitude
- MFE/MAE improvement
- false-positive reduction
- coverage lost
- entry delay
- turnover
- transaction cost / slippage
- capital utilization

### Example
A filter may reduce false breakouts from 30% to 28% but remove half the valid candidates.
That may be statistically detectable yet economically harmful.

### Relation to current system
Because sparse BUY / idle capital is already a known research issue, every pattern filter must report:
- candidateCoverageDelta
- zeroPickDelta
- capitalUtilizationDelta
in addition to quality outcomes.

No “better win rate” result is sufficient by itself.

## DL-002CJ — Research Factor Retirement Rule

### Purpose
The research system needs a way to discard ideas, not only add them.

Candidate status lifecycle:
PROPOSED
-> DEFINITION_FROZEN
-> ACCUMULATING
-> DESCRIPTIVE_READY
-> VALIDATION_READY
-> WORTH_REVIEW
or
-> REDUNDANT
-> UNSTABLE
-> ECONOMICALLY_WEAK
-> STALE_EDGE
-> REJECTED

### Retirement triggers
- no incremental effect after controls;
- direction unstable across independent dates/regimes;
- effect disappears in recent/prospective data;
- transaction costs erase value;
- coverage/capital-utilization damage is disproportionate;
- high implementation/data burden for negligible value.

Retirement is a successful research outcome, not a failure.



## DL-002CK — Broader Technical-School Triage

### Purpose
The research program should learn broadly but implement selectively.
Popularity is not evidence.
Every technical-analysis school is classified by:
- quantifiability,
- incremental information,
- empirical evidence,
- redundancy with current primitives,
- data burden,
- overfit risk.

### 1. Fibonacci Retracement — DEPRIORITIZE / NEGATIVE PRIOR
Strong empirical evidence from an automated three-equity-market study:
- Fibonacci zones were not statistically more likely to produce bounces than non-Fibonacci zones;
- Fibonacci trading rules did not outperform random non-Fibonacci S/R zones;
- they also underperformed simple buy-and-hold benchmarks in the study.

Research implication:
- do not add 23.6/38.2/50/61.8% retracement ratios as privileged support/resistance.
- if a Fibonacci level overlaps a genuine swing/volume/round-number zone, credit the underlying zone, not the Fibonacci label.

Status:
REJECT_AS_PRIMARY_FACTOR unless new Taiwan-specific prospective evidence emerges.

### 2. Elliott Wave — LOW PRIORITY / HIGH SUBJECTIVITY
Evidence is mixed and often focused on fractal interpretation rather than actionable out-of-sample prediction.
Historical literature notes substantial subjectivity in wave counting; different analysts can label the same path differently.

Research implication:
- do not encode 1-2-3-4-5 / A-B-C counts as a primary factor now.
- useful underlying primitives already exist:
  - multi-scale swings,
  - trend/correction alternation,
  - amplitude ratios,
  - maturity/extension,
  - fractal/multi-timeframe structure.

If Elliott-style information has value, it should first appear through those objective primitives.

Status:
INTERPRETABILITY_ONLY / NOT PRIORITY.

### 3. Wyckoff — PRIMITIVE EXTRACTION, NOT COMPOSITE-OPERATOR CLAIMS
Direct high-quality peer-reviewed evidence for the full named Wyckoff accumulation/distribution schema is limited relative to its practitioner popularity.

Potentially useful measurable substructures:
- selling climax / range expansion,
- automatic rally,
- secondary test,
- spring = undercut + reclaim,
- upthrust = false breakout + re-entry,
- sign of strength/weakness,
- last-point-of-support / last-point-of-supply,
- volume/range interaction through phases.

These strongly overlap existing DL-002 primitives and motifs.

Research rule:
- do not infer hidden institutional intent (“smart money is accumulating”) from chart shape alone.
- encode observable price/volume events and test them.

Status:
WORTH_PRIMITIVE_RESEARCH, not a standalone score.

### 4. Point & Figure — SECONDARY EVENT-BASED REPRESENTATION
Peer-reviewed futures research formalized Point & Figure and found mixed statistical significance: some rules worked, many did not.

Conceptual overlap:
- filters out small moves,
- records only material directional price changes,
- ignores clock time.

This resembles DL-002H Directional Change / swing segmentation.

Research question:
Does Point & Figure add information beyond our volatility-normalized event-based swings?

Status:
LOW-MEDIUM PRIORITY comparison; likely redundant unless box/reversal representation shows incremental stability.

### 5. Ichimoku — EVIDENCE MIXED / LIKELY REDUNDANT
Peer-reviewed multi-market research finds some profitable Ichimoku rules in earlier subperiods but inconsistent value later; parameter sweeps can recover apparent profitable variants, raising overfit concerns.
Taiwan-specific thesis evidence exists but is not sufficient for Formal promotion.

Underlying components are combinations of:
- rolling high/low midpoints,
- trend,
- support/resistance cloud,
- lag/lead transforms.

Current system already captures trend, highs/lows, support/resistance and multi-timeframe context.

Status:
REDUNDANCY_TEST_ONLY, not priority.

### 6. Market/Volume Profile — DATA-CONSTRAINED CONTEXT
Potential value:
- price acceptance/cost zones,
- overhead inventory,
- thin/high-volume zones.

Evidence as standalone alpha is weaker than practitioner usage.
Exact historical price-by-volume data is currently unavailable retrospectively from the existing cache.

Status:
PROSPECTIVE_SHADOW candidate only, already documented in DL-002BP.

### 7. Renko / Price-Only Event Bars — LIKELY DIRECTIONAL-CHANGE REDUNDANCY
Renko discards time and records fixed price moves.
Core idea overlaps event-based swing/Point & Figure/Directional Change.

Research priority:
only compare representation stability if needed; do not build another parallel detector now.

### 8. Dow Theory — CONCEPTUALLY ABSORBED
Core ideas:
- primary/intermediate/secondary trends,
- confirmation,
- volume,
- higher highs/lows.

These are already represented through:
- multi-scale swings,
- multi-timeframe coherence,
- volume context,
- market/sector confirmation.

Status:
CONCEPTUALLY_COVERED; no separate factor.

## DL-002CL — Popularity Does Not Grant Experiment Budget

### Rule
A technical method receives coding/experiment budget only if at least one is true:
1. it introduces a genuinely new measurable primitive;
2. strong external evidence justifies a focused replication;
3. it directly addresses a known system weakness;
4. it serves as a strong falsification benchmark.

Otherwise retain as literature knowledge only.

### Current triage
HIGH RESEARCH VALUE:
- repaint-safe swing topology
- VCP sequence
- pattern maturity
- failure/reclaim
- support/resistance zones
- multi-timeframe conflict
- event/flow/regime context
- exact prospective volume-at-price

MEDIUM:
- Point & Figure comparison
- Wyckoff observable motifs
- shape similarity / DTW

LOW / DEPRIORITIZED:
- Fibonacci ratios
- Elliott labels
- generic Ichimoku scoring
- extra moving-average systems
- Renko duplicate implementation



## DL-002CM — Effort vs Result / Price-Impact Primitive v0.1

### Why study this
Wyckoff’s “Effort vs Result” idea has a useful measurable core:
- effort = trading activity / turnover / participation,
- result = directional price progress / range / acceptance.

The narrative claim that large interests are accumulating or distributing is not directly observable and must not be inferred from price-volume shape alone.

### External evidence boundary
- Practitioner Wyckoff literature interprets unusually high volume with little price progress as possible absorption, but direction depends on location/context.
- Finance literature shows volume and price movement have complex relations; unusual volume can proxy attention as well as information.
- Taiwan-specific Pacific-Basin Finance Journal evidence shows the return-to-volume Amihud construct’s pricing in Taiwan can be dominated by a mispricing/volume component rather than a pure illiquidity component, with price limits materially affecting interpretation.
- Taiwan institutional order-imbalance research shows order-flow information can matter, but simple aggregate volume is not equivalent to informed flow.

### Define effort
Keep multiple observable versions:
- volumeVs20
- turnoverVs20
- volumeShockZ
- turnoverShockZ
- exactVolumeAtPriceConcentration (prospective only)
- bidAskImbalance / institutional-flow proxies when point-in-time valid

### Define result
Separate:
- netReturnATR = abs(close-open or close-priorClose) / ATR
- directionalProgress = signed close-to-close progress / ATR
- barRangeATR
- closeLocation
- pivotProgress = movement toward/through a structural zone
- followThroughProgress over later observable bars
- acceptanceState

### Four descriptive quadrants
HIGH_EFFORT_HIGH_RESULT
- activity produces material directional progress.

HIGH_EFFORT_LOW_RESULT
- large activity with limited net progress.
- indicates opposing liquidity / disagreement / absorption-like behavior, but direction is UNKNOWN until context/follow-through.

LOW_EFFORT_HIGH_RESULT
- large price progress on little activity.
- may represent thin liquidity, gap, low supply, or fragile movement.

LOW_EFFORT_LOW_RESULT
- inactivity / dead liquidity / balanced trade.

### Location is mandatory
For HIGH_EFFORT_LOW_RESULT store:
- atSupportZone
- atResistanceZone
- insideBase
- afterExtension
- atBreakout
- atRetest
- nearPriceLimit
- nearRoundNumber
- eventContext

Interpretation is conditional:
- near support + later upside departure may be absorption-like;
- near resistance + later downside departure may be distribution-like;
- before departure, label only EFFORT_RESULT_DIVERGENCE.

### Follow-through validation
Possible later labels:
- DIVERGENCE_RESOLVED_UP
- DIVERGENCE_RESOLVED_DOWN
- DIVERGENCE_UNRESOLVED
- DIVERGENCE_WHIPSAW

Never backdate the resolved direction to the original high-effort bar.

### Taiwan-specific caution
Do not use a raw return/volume ratio as a direct “liquidity” or “absorption” score in Taiwan.
Price limits, mispricing/attention and tick effects can alter the meaning.
Control:
- priceLimitState
- tickDominance
- liquidity tier
- event/attention state
- exact/inexact order-flow provenance

### Redundancy
Compare against:
- existing volumeTodayVsPrev5
- volumeContraction5to20
- closeLocation
- upper-shadow ratio
- turnover/liquidity
- Quiet/Attention
- DL-001 price discreteness
- failure/reclaim motifs

Expected incremental component is the interaction between ACTIVITY and PRICE_PROGRESS at a structural location, not volume alone.

## DL-002CN — Wyckoff Spring / Upthrust as Observable Motifs

### Principle
Keep observable event geometry; discard unverifiable intent narratives.

### SPRING label
A support-zone spring candidate:
1. price trades/closes below a previously known support zone;
2. undercut magnitude is recorded in %/ATR/ticks;
3. price later re-enters/reclaims the zone within a frozen time window;
4. subsequent state may tighten or advance.

Store:
- undercutDepth
- undercutVolumeContext
- reclaimBars
- reclaimCloseLocation
- reclaimVolume
- supportZoneStrengthAsOf
- postReclaimTightness
- postReclaimMFE/MAE

First observable “spring confirmed” timestamp is the reclaim, not the low.

### UPTHRUST label
Mirror at resistance:
1. price breaches known resistance;
2. fails acceptance and re-enters the zone/range;
3. later direction remains unknown until observed.

Store:
- overshootDepth
- breachVolume
- reentryBars
- reentryCloseQuality
- resistanceZoneStrengthAsOf
- postReentry path

### Relation to existing DL-002 motifs
Spring overlaps:
- UNDERCUT_RECLAIM_TIGHTEN
- W UNDERCUT_RECLAIM

Upthrust overlaps:
- BREAKOUT_REENTRY
- HIGH_VOLUME_REJECTION
- FAILED_BREAKOUT

Therefore Wyckoff labels are primarily interpretability aliases unless they add incremental timing/context information.

### SOS / SOW
SIGN_OF_STRENGTH:
- directional expansion through resistance + acceptance/follow-through.

SIGN_OF_WEAKNESS:
- directional expansion through support + acceptance/follow-through.

These are not inferred institutional actions; they are observable structural transitions.

### LPS / LPSY
LAST_POINT_OF_SUPPORT / SUPPLY can be represented as:
- post-break/reclaim retest of a zone,
- reduced adverse progress,
- renewed directional departure.

Do not call a point “last” until a later path proves it was last; historical label must be:
- LPS_CANDIDATE at the time,
- LPS_CONFIRMED only later.
This avoids hindsight naming.

## DL-002CO — High Effort / Low Progress Needs Directional Resolution

### Central falsification
If HIGH_EFFORT_LOW_RESULT were inherently bullish “absorption,” it should predict positive forward returns regardless of location.
That is implausible and contradicted by the same pattern appearing near distribution/resistance.

### Test matrix
Within same-date matched groups:
1. high effort / low result at support;
2. high effort / low result at resistance;
3. high effort / high positive result;
4. high effort / high negative result;
5. low effort / low result controls.

Stratify by:
- market regime
- liquidity
- event proximity
- price-limit state
- parent pattern
- RS trend

### Outcomes
- D1/D3/D5/D10
- MFE/MAE
- zone reaction
- zone break
- R01 if breakout-related
- reclaim/failure transition

### Interpretation
The expected value may come from LOCATION × EFFORT_RESULT interaction, not the raw ratio.

## DL-002CP — Aggregate Volume Is Not Order Flow

### Distinction
Daily total volume:
- measures activity.

Signed/order-level flow:
- measures directional aggressor imbalance or participant type.

They are not interchangeable.

### Taiwan evidence
Institutional order-imbalance volatility, particularly foreign institutional activity, has documented predictive relationships in Taiwan markets.

### Research hierarchy
Lowest information:
- total volume only.

Better:
- turnover + price result + close quality.

Better when valid:
- bid/ask split / price-by-volume side,
- institutional net flow,
- order imbalance.

Best but data-limited:
- account/order-level aggressiveness or trade classification.

### Rule
Never describe a high-volume daily bar as “institutional absorption” unless direct participant/order-flow evidence exists.
Use:
POSSIBLE_ABSORPTION_GEOMETRY
rather than
INSTITUTIONAL_ACCUMULATION.



## DL-002CQ — Historical Price Extremes as Behavioral Reference Points

### Taiwan-specific evidence
Taiwan research has examined 5-day, 20-day, 60-day and 52-week highs as reference points and finds the relation between nearness to past highs and future returns depends on broader market conditions.
Separate Taiwan 52-week-high research finds mixed anchoring/recency evidence and substantial time/regime dependence.

### Implication for pattern research
A prior high may matter for more than geometric resistance:
- investors may anchor to it,
- attention/volume can rise when price revisits/crosses an old extreme,
- the age/recency of the extreme can change its salience.

### Fields
For each relevant high:
- highPrice
- highDate
- ageTradingDays
- distancePct
- distanceATR
- distanceTicks
- timesRevisited
- lastRevisitAge
- volumeAtOriginalHigh if available
- eventAtOriginalHigh
- regimeAtOriginalHigh
- currentRegime
- highType: 20D / 60D / 120D / 252D / swingMajor

### Reference-point context
RECENT_HIGH
- formed relatively recently.

STALE_HIGH
- old high not revisited for long period.

FREQUENTLY_TESTED_HIGH
- multiple point-in-time valid approaches.

FIRST_RETURN_TO_OLD_HIGH
- first revisit after a long interval.

### No assumption
An old high can act as:
- resistance,
- attention catalyst,
- breakout anchor,
- irrelevant stale history.
Test by age/context rather than hard-coding.

## DL-002CR — Crossing Old Extremes Can Trigger Volume/Attention

### External evidence
Management Science large-sample evidence reports trading volume rises substantially when prices cross prior trading-range extremes, with stronger effects when the extreme is older, firms are smaller, individual-investor interest is higher, and valuation ambiguity is greater.

### Pattern implication
A breakout-volume spike near an old high can be partly a behavioral attention/reference-point response, not necessarily fresh fundamental/institutional demand.

### Research fields
- extremeCrossingEvent
- ageOfExtreme
- volumeShockAtCross
- retailAttentionProxy if available
- institutionalFlowAtCross
- priceAcceptanceAfterCross
- postCrossVolumeDecay
- oldHighVsPatternPivotAlignment

### Key distinction
VOLUME_ON_BREAKOUT can arise from:
1. informed/committed demand,
2. behavioral attention triggered by crossing a salient high,
3. trapped-holder/supply turnover,
4. mechanical/algorithmic threshold orders.

Aggregate volume alone cannot separate these.

### Test
Compare old-extreme crossings:
- high volume + strong acceptance;
- high volume + weak acceptance;
- low/moderate volume + strong acceptance;
while controlling age/size/liquidity/event state.

## DL-002CS — Reference-Point Age vs Zone Age

### Distinction
Zone age and reference-point age overlap but are not identical.

ZONE_AGE:
- time since structural support/resistance zone became knowable.

REFERENCE_POINT_AGE:
- time since a salient extreme price was printed.

A zone may evolve from several highs; the oldest/most salient high can still influence attention even after zone geometry changes.

### Fields
- zoneAgeDays
- dominantExtremeAgeDays
- ageDispersionAmongZoneSources
- firstTouchAfterLongAbsence
- recencyScoreDescriptive

### Interaction question
Does the first revisit of a long-unseen high behave differently from repeated recent tests?

No fixed decay function is assumed.

## DL-002CT — 20/60-Day High vs Long-Horizon High Incremental Test

### Relevance
Current Formal already uses priorHigh20 and priorHigh60.
Long-horizon pattern research may add 120/252-day reference points.

### Minimal test
Do not automatically add more high windows.
Compare:
1. priorHigh20 only;
2. priorHigh20 + priorHigh60;
3. swing-derived major zone;
4. long-horizon 120/252-day extreme;
5. all combined.

### Outcomes
- R01 failure
- D1/D3/D5/D10
- MFE/MAE
- availableRoomToNextMajorZone
- breakout-volume interpretation
- candidate coverage

### Simplicity preference
If swing major zones already capture long-horizon extremes, fixed 120/252-day highs are redundant and should be dropped.



## DL-002CU — Turnover / Attention as Pattern-Life-Cycle Context

### External evidence
Lee & Swaminathan (Journal of Finance, 2000) show past trading volume/turnover helps distinguish momentum life-cycle states:
- turnover contains information about the magnitude and persistence of momentum;
- high-volume winners reverse faster in their long-horizon evidence;
- volume helps link underreaction and later overreaction.

Taiwan research/thesis evidence also reports low-turnover “early momentum” versus high-turnover “late momentum” style differences, though thesis evidence is lower-quality than peer-reviewed evidence and must be treated accordingly.

### Pattern interpretation
A visually similar breakout can occur in:
EARLY_ATTENTION
- pattern matures while turnover remains relatively quiet/moderate.

ATTENTION_RISING
- turnover rises into trigger.

HIGH_ATTENTION_MATURE
- pattern is already widely traded / high turnover before breakout.

ATTENTION_CLIMAX
- extreme turnover + extension + poor incremental price progress.

### Research fields
- turnoverPercentile20/60/252
- turnoverSlopeDuringPattern
- turnoverAtPatternStart
- turnoverAtMaturity
- turnoverAtBreakout
- turnoverConcentration
- volumeShockCount
- priceProgressPerTurnover
- QuietAttentionState existing research mapping

### Hypothesis
Pattern edge may depend not merely on volume confirmation, but on where the stock sits in an attention/turnover life cycle.

### Redundancy
Must compare directly against existing Quiet/Attention research and overheat controls.
If no incremental information remains, retire this as redundant.

## DL-002CV — “High Volume Breakout” Can Be Early Confirmation or Late Attention

### Competing stories
EARLY_CONFIRMATION:
- moderate prior attention,
- tightening structure,
- first meaningful participation surge,
- strong acceptance/follow-through.

LATE_ATTENTION:
- already high turnover,
- extended price path,
- repeated public breakouts/limit hits,
- another large volume surge,
- weak marginal price progress.

### Fields
- priorTurnoverLevel
- breakoutTurnoverShock
- extensionBeforeBreakout
- numberOfRecentAttentionEvents
- effortResultState
- followThrough
- olderResistanceRoom

### Research question
Does breakout volume interact nonlinearly with prior attention?
A 2x volume breakout from a quiet base may differ from a 2x volume breakout after weeks of elevated turnover.

## DL-002CW — New Counter-evidence for DL-001 Information Discreteness

### Important Taiwan counter-evidence
Taiwan market-dynamics research reports that Da-style Information Discreteness did not isolate return predictability once market continuation/transition dynamics were considered; momentum profits across information-discreteness groups were insignificant in that conditional analysis.

### Reconciliation with prior DL-001 evidence
Existing DL-001 retained Taiwan evidence that gradual/continuous information can matter in other settings, including earnings momentum.
The new evidence means:
- Information Discreteness is NOT a universally dominant Taiwan factor;
- its usefulness may depend on the target phenomenon (earnings momentum vs general price momentum);
- market-state continuation/transition can be a more important conditioning variable.

### Research consequence
DL-001 remains WORTH_SHADOW_RESEARCH, but its prior is weakened/conditioned.

Required interaction:
- InfoDiscreteness × MarketStateContinuation
- InfoDiscreteness × PatternMaturity
- InfoDiscreteness × Attention/Turnover

Do not promote DL-001 independently without showing incremental value after regime controls.

### General lesson
A factor can be supported in one Taiwan context and fail in another.
Research state should preserve both evidence and counter-evidence rather than choosing one paper.



## DL-002CX — Holder Cost Basis / Capital-Gains Overhang as Resistance Context

### Mechanism
Technical “overhead supply” can have a behavioral interpretation:
holders compare current price with reference/cost prices, and gain/loss status can influence selling.

### Strong evidence
- Taiwan account-level evidence documents a strong aggregate disposition effect: investors are substantially more likely to realize winners than losers; the effect differs by investor type.
- Grinblatt & Han (Journal of Financial Economics, 2005) model and empirically proxy aggregate investor reference price/cost basis using historical price and turnover. Their capital-gains-overhang measure predicts returns beyond raw past return in their sample.

### Pattern implication
A resistance zone may contain:
GEOMETRIC_SUPPLY:
- prior swing highs / rejected pivots.

HOLDER_COST_SUPPLY:
- prices where substantial surviving ownership may have acquired shares and where gain/loss reference behavior can change selling pressure.

These can overlap or differ.

### Research fields
- estimatedReferencePrice
- currentPriceVsReferencePct
- capitalGainsOverhangProxy
- estimatedHolderProfitShare
- estimatedHolderLossShare
- referencePriceZone
- referenceZoneOverlapWithPivot
- referenceZoneOverlapWithCupRim
- referenceZoneOverlapWithMajorResistance

### Important data-quality distinction
Exact investor cost basis is not observable from normal OHLCV.
Any historical-volume reconstruction is a proxy.

Store:
- costBasisMethod
- lookbackHorizon
- turnoverAssumption
- adjustedPriceHandling
- approximation=true

### Prospective exact price-profile complement
Future exact volume-at-price snapshots can improve local participation maps, but they still do not reveal whether shares remain held.
Do not equate historical traded volume with current holder inventory.

## DL-002CY — Disposition Pressure Can Be Asymmetric Around Zones

### Taiwan evidence
Taiwan aggregate investors show stronger propensity to sell winners than losers, while mutual funds/foreign investors showed different behavior in the historical account-level study.

### Research hypotheses
PRICE_ABOVE_REFERENCE:
- more holders in gain territory;
- realizations may create supply but can also represent healthy turnover.

PRICE_BELOW_REFERENCE:
- more holders in loss territory;
- reluctance to sell may reduce supply initially, but a recovery toward cost basis may release trapped supply.

RECOVERY_TO_REFERENCE:
- price approaches estimated holder cost after a decline;
- possible breakeven selling pressure.

BREAK_ABOVE_REFERENCE:
- successful acceptance above a cost zone may remove part of overhead supply.

### Fields
- distanceToReferenceZone
- approachDirection
- turnoverOnReferenceCross
- acceptanceAboveReference
- rejectionAtReference
- institutionalVsRetailFlowAroundReference if available
- zoneAge
- referencePriceAge

### No deterministic “trapped holders” claim
Without actual ownership records, label:
ESTIMATED_OVERHANG
not
KNOWN_TRAPPED_SHARES.

## DL-002CZ — Historical Volume at Price Does Not Equal Current Inventory

### Common technical-analysis error
A high-volume price region is often described as “many people hold shares here.”
That is only partly justified.

Shares can change hands repeatedly after the original trade.
Historical turnover can therefore overstate surviving ownership at old prices.

### Research solution
Distinguish:
TRADED_VOLUME_DENSITY
from
ESTIMATED_SURVIVING_COST_BASIS.

Possible surviving-weight model:
- older traded volume decays as subsequent turnover implies shares may have changed hands.
- use an explicit turnover-based survival approximation similar in spirit to capital-gains-overhang literature.

### Required sensitivity
Cost-basis proxy must be tested across:
- reasonable lookback horizons,
- survival/turnover assumptions,
- raw vs adjusted price handling.

No one estimator is treated as ground truth.

## DL-002DA — Cost Basis × Pattern Interaction

### Key comparisons
1. breakout pivot below/inside/above estimated cost zone;
2. cup rim overlaps major cost zone;
3. W neckline overlaps cost zone;
4. VCP tightens below cost zone;
5. retest holds above previously crossed cost zone.

### Hypotheses
- pattern breakout into heavy estimated overhang may face more supply;
- acceptance above both geometric resistance and cost zone may be stronger evidence than clearing only one;
- cost-zone crossing could generate volume due to disposition/reference behavior, so high volume there is not automatically fresh demand.

### Redundancy controls
Compare cost-basis proxy against:
- prior highs / zones
- long-horizon high
- volume profile
- turnover/attention
- historical return
- Residual RS
- event context

If it is merely a complicated reconstruction of past return/volume with no incremental value, retire it.



## DL-002DB — Intraday Order-Book / Trade-Flow Research Feasibility

### Source capability verified
Fugle real-time stock quote provides:
- best five bid levels and sizes,
- best five ask levels and sizes,
- cumulative trade value/volume,
- cumulative tradeVolumeAtBid / tradeVolumeAtAsk,
- last trade bid/ask/price/size,
- current average price.

Intraday trades provide trade price, size, timestamp and contemporaneous bid/ask fields when available.

### Research opportunity
For Pattern Shadow candidates only, prospectively observe microstructure around:
- pivot approach,
- breakout,
- retest,
- reclaim/failure.

### Candidate fields
BOOK:
- bestBid / bestAsk
- spreadTicks
- bidDepth5
- askDepth5
- topLevelImbalance = (bidDepth5-askDepth5)/(bidDepth5+askDepth5)
- depthConcentrationTop1
- depthSlopeBid / depthSlopeAsk

TRADE FLOW:
- cumulativeAtAskShare
- cumulativeAtBidShare
- rollingAggressorImbalance
- tradeSizeDistribution
- tradeCountRate
- turnoverRate

PRICE RESPONSE:
- priceChangePerNetAggressorVolume
- pivotDistance
- priceVsSessionAverage
- microFollowThrough

### Critical limitation
A five-level book is a snapshot, not latent demand truth.
Displayed orders can:
- cancel,
- move,
- replenish,
- be strategic.
Therefore one static imbalance should never become a buy signal.

## DL-002DC — Order-Book Imbalance Must Be Dynamic

### Stronger research object
Instead of one snapshot, measure persistence/change:
- imbalanceAtT0
- imbalanceChange
- imbalancePersistenceSeconds
- depthReplenishmentAfterTrade
- askDepletionRate
- bidDepletionRate
- spreadRecovery
- priceResponseToSameSignedFlow

### Absorption-like observable behavior
Possible support absorption:
- aggressive sells occur,
- bid liquidity repeatedly replenishes,
- price makes little downward progress,
- later price departs upward.

Possible resistance absorption:
- aggressive buys occur,
- ask liquidity replenishes,
- price makes little upward progress,
- later price departs downward.

Before later departure:
label only FLOW_ABSORPTION_CANDIDATE, direction unresolved.

### Data requirement
This requires repeated snapshots/trades during the event window.
It cannot be reconstructed from one final quote.

## DL-002DD — Taiwan Order Flow Evidence and Investor Heterogeneity

### Taiwan evidence
- Research on institutional order-imbalance volatility finds foreign institutional imbalance contains predictive relationships in Taiwan.
- 2026 Journal of Banking & Finance research using about five years of comprehensive TWSE limit-order-book data finds buy-sell order imbalance reflects behavioral demand patterns and differs materially by investor type.
- Historical Taiwan account-level evidence shows individual aggressive trading and institutional trading have different performance characteristics.

### Implication
“Net buying pressure” is not homogeneous.
Participant type and aggressiveness can matter.

### Research hierarchy
If only aggregate quote/trade data:
- label AGGREGATE_FLOW.

If institutional daily data:
- label INSTITUTIONAL_DAILY_FLOW.

Never pretend aggregate five-level imbalance identifies foreign/institutional demand.

## DL-002DE — Microstructure Confirmation Must Compete Against 15m Simplicity

### Current system
Formal execution already uses completed 15-minute candles and 10-minute auxiliary confirmation.

### Research question
Does order-book/trade-flow context add enough incremental value to justify complexity beyond:
- 15m price acceptance,
- 15m volume,
- higher low,
- retest/reversal,
- quote freshness?

### Comparison
BASELINE:
current 15m research fields.

PLUS_BOOK:
baseline + dynamic five-level imbalance.

PLUS_TRADE_FLOW:
baseline + aggressor-flow measures.

PLUS_BOTH:
baseline + book + flow.

### Economic metrics
- false BUY avoided
- valid BUY lost
- lead/lag in confirmation
- request/data cost
- operational fragility
- coverage
- R01 / D1 / D3 / MFE / MAE

### Simplicity gate
If incremental value is small or unstable, reject microstructure layer.
A complex input is not better merely because it is granular.

## DL-002DF — Microstructure Data Is Prospective-Only

### No historical fabrication
Current accessible historical candles cannot reconstruct historical best-five queues.

Therefore:
- firstObservationDate must be explicit,
- missing historical book = UNKNOWN,
- no retrospective “what the queue must have looked like.”

### Prospective snapshot design
For selected research symbols around trigger windows:
- observedAt
- quoteSerial/lastUpdated
- bids/asks
- totals
- patternState
- pivot/zone
- Formal decisionImpact=false

### Engineering classification
An isolated prospective recorder can be Class A if:
- separate from Formal decision path,
- async/failure-tolerant,
- no additional latency/blocking of live monitor,
- no push/capital/eligibility impact,
- regression proves protected outputs identical.

Any insertion into Formal 15m gate is Class C.



## DL-002DG — Volatility Level Is Not the Same as Volatility Contraction

### Conflicting evidence
External evidence on volatility and momentum is not one-directional:
- some research finds high realised volatility during formation weakens momentum effects;
- other research finds stronger short/intermediate momentum among high idiosyncratic-volatility stocks, along with faster/larger later reversals;
- international evidence often finds market-volatility state conditions momentum profitability.

### Implication
Do not interpret VCP as:
“low volatility stocks are better.”

VCP hypothesis is:
“the PATH of volatility contraction within an otherwise constructive structure may contain information.”

### Separate variables
LEVEL:
- atrPercent
- realisedVol20/60
- idiosyncraticVol proxy
- marketVolState
- sectorVolState

TRAJECTORY:
- atrSlope
- rangeSlope
- swingDepthSlope
- volOfVol
- contractionMonotonicity
- finalTightnessVsEarlierBase

RELATIVE:
- stockVolVsSector
- stockVolVsOwnHistoryPercentile
- finalTightnessVsPriceTier
- finalTightnessTicks

### Test
VCP sequence topology must show incremental value after absolute volatility level controls.
If contraction sequence is only another way to select low-vol stocks, its claimed mechanism is weakened.

## DL-002DH — Volatility Regime Transition Around Breakout

### Pattern hypothesis
Many constructive bases appear to move:
HIGHER_VOL_FORMATION
-> DECLINING_VOL_MATURITY
-> LOW_VOL_TIGHT_ZONE
-> CONTROLLED_VOL_EXPANSION_ON_BREAK

But failed patterns may show:
LOW_VOL
-> DOWNSIDE_VOL_EXPANSION
or
LOW_VOL
-> CHAOTIC_TWO_SIDED_EXPANSION.

### Fields
- volAtPatternStart
- volAtMaturity
- volAtTrigger
- breakoutRangeATR
- postBreakoutVol
- upsideRangeExpansion
- downsideRangeExpansion
- volDirectionality
- expansionCloseQuality

### Key distinction
VOLATILITY_EXPANSION is not bullish.
Directional acceptance determines whether expansion is constructive or failure.

## DL-002DI — Volatility-of-Volatility / Stability of Compression

### Problem
A “low ATR” snapshot can hide unstable alternation:
quiet -> huge bar -> quiet -> huge bar.

### Fields
- atrVolatility
- rangeVariance
- contractionStability
- largeRangeBarCount
- downsideShockCount
- upsideShockCount
- rangeOutlierShare

### Hypothesis
A mature VCP may require not just low final range but stable compression without repeated shock resets.

### Counterpoint
Too-stable low range can be dead liquidity.
Always interact with DL-002AA liquidity/tick controls.

## DL-002DJ — Volatility State Is a Context, Not a Formal Filter

### Economic caution
Volatility-managed portfolio research can improve risk-adjusted portfolio outcomes, but position scaling and portfolio volatility targeting are different questions from selecting a stock pattern.

### Boundary
DL-002 volatility research asks:
- pattern quality / failure probability / timing.

It does NOT authorize:
- volatility-based position sizing,
- changing capital allocation,
- changing stop distance.

Those would be Formal/portfolio decisions requiring separate approval.



## DL-002DK — Taiwan Lottery/Attention Overheat Around Patterns

### Strong Taiwan evidence
Journal of Financial Markets evidence shows the ordinary MAX measure is distorted by Taiwan price limits.
A modified MAX using limit-hit intensity predicts lower future returns for high-lottery-like stocks in the historical TWSE sample.

Other Taiwan evidence shows:
- positive-skewness / lottery preference is associated with lower future returns in some cross-sectional settings;
- the effect varies by market state;
- attention and distance from the 52-week high interact with lottery preference.

### Pattern implication
A visually powerful setup with repeated limit-up events may be:
- genuine leadership,
- OR attention-driven late-stage overpricing.

Therefore repeated extreme upside days should not be interpreted as pure strength.

### Candidate fields
- upLimitHitCount20/60
- downLimitHitCount20/60
- netLimitHitRate
- daysSinceLastUpLimit
- maxDailyReturnAdjustedForLimitState
- positiveSkewnessProxy
- attentionShockCount
- turnoverShockCount
- patternMaturityAtFirstLimitHit
- numberOfLimitHitsAfterPatternMaturity
- distanceTo52WeekHigh

### States
EARLY_LEADERSHIP_EXTREME
- first/early extreme move from a quiet developing base.

ATTENTION_BUILDING
- repeated large/limit moves with rising turnover.

LOTTERY_OVERHEAT_RISK
- repeated extreme upside events + high attention + extension + weak incremental progress.

LIMIT_CENSORED_MOMENTUM
- price is repeatedly capped, so observed daily shape understates latent intraday demand; direction remains context-dependent.

### Redundancy
Current research already has:
- overheat penalty research,
- limit-hit context,
- Attention/Quiet,
- ret20 / lateStage.

Modified-MAX style measures proceed only if they add information beyond those.

## DL-002DL — Extreme Positive Return Is Not the Same as Constructive Breakout

### Constructive breakout candidate
- mature base before move,
- available room above,
- strong acceptance,
- manageable prior extension,
- sector/RS confirmation,
- no attention-climax pattern.

### Lottery-like extreme candidate
- little structural base,
- sudden large/limit return,
- abnormal turnover/attention,
- positive skewness / repeated extreme days,
- poor risk/reward after extension.

### Research question
Does pattern maturity BEFORE the first extreme positive day distinguish durable leadership from attention-driven lottery behavior?

This is a direct test of “structure before momentum” rather than “large return = strength.”

## DL-002DM — 52-Week High × Lottery/Attention Interaction

### Taiwan evidence
Recent Taiwan evidence finds lottery anomaly behavior depends on distance from the 52-week high and investor attention; the 52-week high can act as a salient perceived ceiling.

### Research fields
- distanceTo52WeekHigh
- age52WeekHigh
- modifiedMaxProxy
- attentionState
- extremeCrossingEvent
- volumeShockAt52WeekCross
- acceptanceAbove52WeekHigh

### Hypotheses
1. high attention far below old high may reflect lottery chasing without structural acceptance.
2. approaching a salient old high can change investor behavior and turnover.
3. successful acceptance beyond a 52-week high may differ from repeated limit-hit speculation below it.

### No production implication
No MAX/limit-hit exclusion is added to Formal.
This is an overheat/failure context candidate only.



## DL-002DN — Shorting Flow × Pattern Maturity

### Taiwan evidence
Pacific-Basin Finance Journal (2023) reports both short- and long-term shorting flows predict future Taiwan stock returns, consistent with informed shorting.
Earlier Taiwan work also finds heavily shorted stocks exhibit negative subsequent abnormal returns in historical samples.

### Existing research overlap
The broader project already records research-only:
- margin short evidence,
- actual SBL short-sales evidence,
with source-semantics warnings.

DL-002 should not create a generic short-interest score.

### Incremental question
Does shorting FLOW CHANGE during specific pattern phases contain information about pattern failure/success?

### Phase fields
- shortFlowAtPatternStart
- shortFlowAtMaturity
- shortFlowAtPivot
- shortFlowOnBreakout
- shortFlowOnRetest
- shortFlowSlopeDuringMaturity
- shortFlowShock
- shortFlowDivergenceFromPrice
- shortFlowDivergenceFromInstitutionalLongFlow

### Hypotheses
CONSTRUCTIVE:
- bullish pattern matures while informed shorting pressure declines.

WARNING:
- price approaches/breaks pivot while shorting flow accelerates.

SQUEEZE_CANDIDATE:
- high prior short exposure + strong acceptance + short flow not expanding / covering evidence.
But do not infer actual short covering without suitable flow/balance changes.

### Outcomes
- R01 failure
- D1/D3/D5/D10
- MFE/MAE
- breakout acceptance
- reclaim/failure

## DL-002DO — Securities Borrowing Is Not Short Selling

### Official TWSE semantics
Borrowed securities may be used for:
- short sale,
- hedging,
- arbitrage,
- returning prior loans,
and other purposes.

Therefore:
SBL_TRANSACTION_VOLUME != SHORT_SALE_VOLUME.
SBL_BALANCE != SHORT_SALE_BALANCE.

### Research data hierarchy
Preferred:
1. actual borrowed-securities short-sale flow;
2. short-sale balance;
3. margin short flow/balance with its distinct retail/credit semantics;
4. generic borrowing volume only as context, not directional shorting evidence.

### Missingness
If only borrowing data is available:
shortFlow = UNKNOWN,
not inferred from SBL borrowing.

This preserves existing research governance.

## DL-002DP — Short Flow vs Visible Bearish Price Morphology

### Question
Does informed shorting lead visible technical deterioration, coincide with it, or arrive after it?

### Compare timing
- firstShortFlowDeteriorationAt
- firstRSDeteriorationAt
- firstNegativeMotifAt
- firstStructureBreakAt
- firstFailedBreakoutAt

### Possible lead/lag states
SHORT_FLOW_LEADS
PRICE_PATTERN_LEADS
SIMULTANEOUS
NO_RELATION

### Practical research value
If short flow consistently leads failed patterns prospectively, it may become an independent warning candidate.
If it merely reacts after price breaks, it is redundant for selection.

### No Formal implication
Any real exclusion/filter based on short flow would require later evidence and explicit approval.



## DL-002DQ — Hurst / Fractal-Dimension Triage

### Evidence
Taiwan market research documents multifractal/multiscaling properties in TAIEX and large Taiwan stocks.
However, methodological literature strongly warns:
- finite random samples can produce Hurst estimates above 0.5;
- estimator choice materially changes H;
- short-range dependence can be mistaken for long memory;
- H != 0.5 is not by itself evidence of exploitable predictability or market inefficiency.

### Current status
LOW_PRIORITY_DIAGNOSTIC.

Do not add:
- H > 0.5 => trend buy,
- H < 0.5 => mean reversion,
as trading rules.

### Possible research use
Only if later needed as a descriptive regime/complexity measure:
- hurstEstimate
- estimatorType
- windowLength
- confidenceBand / simulated null
- stabilityAcrossEstimators

### Redundancy
Likely overlaps:
- entropy
- directional efficiency
- volatility regime
- autocorrelation
- market state
- swing persistence

Must prove incremental value before experiment budget.

## DL-002DR — Multifractality Is a Market Property, Not Automatically a Stock Signal

### Distinction
Evidence that returns are multifractal means scaling behavior can vary by horizon.
It does NOT imply a specific bullish/bearish forecast for one stock.

### Potential relevance
Could support:
- multi-scale modeling,
- caution against one fixed horizon,
- nonlinear relationships between volatility and pattern geometry.

These ideas are already captured by:
- MICRO/BASE/MAJOR swings,
- multi-timeframe coherence,
- variable-length phase features.

### Conclusion
No separate multifractal feature engineering is justified yet.

## DL-002DS — Complexity Budget Triage Update

HIGH PRIORITY:
- swing topology
- pattern maturity
- zone geometry
- failure/reclaim
- volatility contraction trajectory
- holder cost/overhang
- event/regime/sector/flow interactions

MEDIUM / PROSPECTIVE:
- exact price-by-volume
- dynamic order-book/trade-flow
- Wyckoff observable motifs
- shape similarity

LOW:
- Hurst/fractal dimension
- Fibonacci
- Elliott labels
- generic Ichimoku
- Renko duplicate representation

Reason:
research complexity must compete for limited sample size and multiple-testing budget.



## DL-002DT — Popular Indicator Redundancy Triage

### Principle
Most classic indicators are deterministic transforms of the same OHLCV data.
Adding many indicators can create the illusion of independent confirmation while double-counting the same path.

### Bollinger Bands
Mathematical content:
- moving average location
- rolling standard deviation / band width
- normalized distance from mean

Existing overlap:
- MA10/20/60
- ATR
- volatility20
- range compression
- VCP contraction
- support/resistance location

Taiwan evidence:
a historical Taiwan 50 event study finds positive abnormal returns around upper/lower Bollinger-band events in its sample.
But this does not establish that Bollinger squeeze independently predicts breakouts in our setting.

Status:
BENCHMARK / REDUNDANCY_TEST_ONLY.

Possible field:
- bollingerBandwidth20
only as a benchmark against swing-based contraction.

If VCP topology adds nothing beyond Bollinger bandwidth/ATR, VCP is weakened.
If Bollinger adds nothing beyond current volatility fields, discard it.

### MACD
Mathematical content:
- difference between two exponential moving averages,
- signal-line smoothing.

Existing overlap:
- trend
- MA stack/turn
- return momentum
- multi-horizon slope.

Status:
LOW PRIORITY / likely redundant.

### RSI
Mathematical content:
- ratio of average gains vs average losses over a fixed window.

Existing overlap:
- positive-day ratio
- return path
- momentum/overheat
- directional efficiency.

Status:
LOW PRIORITY / benchmark only.

### KD/Stochastic
Mathematical content:
- close location within recent high-low range + smoothing.

Existing overlap:
- daily close position
- recentHigh/recentLow
- pullback/support distance
- overheat.

Status:
STRONGLY_REDUNDANT candidate.

## DL-002DU — OBV Is Not Informed Flow

### Definition problem
OBV assigns the ENTIRE day’s volume:
- positive if close > prior close,
- negative if close < prior close.

It ignores:
- how far price moved,
- intraday buy/sell split,
- where trades occurred,
- institutional identity,
- closing-auction effects.

### Existing better data
Our environment can potentially use:
- tradeVolumeAtBid/Ask prospectively,
- exact price-by-volume prospectively,
- daily institutional flows,
- price response / Effort vs Result.

### Research status
OBV may be used only as a simple benchmark.

If sophisticated flow/context features cannot beat OBV, complexity is questionable.
But OBV itself should not be labeled “smart money.”

## DL-002DV — MFI / Chaikin / Accumulation-Distribution Triage

### Shared issue
These indicators combine price-location and volume using hand-designed formulas.

Potential overlap:
- closeLocation
- range
- volume ratio
- turnover
- exact prospective bid/ask split
- Effort vs Result
- support/resistance context

### Status
LOW PRIORITY.
Do not add unless external/prospective evidence shows incremental value after primitive controls.

### Reason
A hand-crafted OHLCV flow proxy is less attractive when direct flow/price-location features can be stored separately and tested transparently.

## DL-002DW — Indicators as Benchmarks, Not Feature Zoo

### Benchmark set
If DL-002 later enters validation, retain a SMALL conventional benchmark:
- Bollinger bandwidth
- RSI
- MACD
- OBV

Purpose:
ask whether the new topology engine actually improves on simple familiar transforms.

### Do not stack
No:
VCP + BB squeeze + RSI + MACD + KD + OBV = six confirmations.

Instead compare:
SIMPLE_INDICATOR_BASELINE
vs
LATENT_PRIMITIVES
vs
PRIMITIVES_PLUS_PATTERN_TOPOLOGY.

### Evidence standard
The complex model must justify itself through:
- incremental out-of-sample performance,
- stability,
- false-positive reduction,
- coverage/capital-use balance,
not visual sophistication.



## DL-002DX — Float / Tradable-Supply Normalization

### Motivation
“Volume dry-up” should ideally be interpreted relative to the amount of stock actually available to trade, not only raw shares or lots.

### Evidence boundary
Taiwan evidence supports a relationship between ownership structure and liquidity, but the relation is nonlinear and heterogeneous.
There is no basis to assume:
high ownership concentration = bullish scarcity.

### Candidate variables when point-in-time data is available
- sharesOutstanding
- estimatedFreeFloatShares
- institutionalOwnershipPct
- blockholderOwnershipPct
- turnoverOfSharesOutstanding
- turnoverOfFreeFloat
- patternVolumeAsPctOfFloat
- breakoutVolumeAsPctOfFloat
- handleVolumeAsPctOfFloat

### Use
Normalize:
- volume dry-up,
- breakout participation,
- turnover shock,
- volume-at-price concentration.

### Caution
Free-float definitions can differ across data providers.
Store provenance/date.
Do not backfill current ownership/free float into historical pattern dates.

## DL-002DY — Ownership Concentration Is Context, Not “Tight Chips”

### Common narrative risk
Practitioners may describe concentrated holdings as “籌碼集中” and infer lower selling pressure.

### Research position
Ownership concentration can also be associated with:
- lower liquidity,
- greater price impact,
- governance/information effects,
- higher volatility in some contexts.

Therefore:
OWNERSHIP_CONCENTRATION has no automatic bullish sign.

### Test only interactions
- concentration × healthy compression
- concentration × dead liquidity
- concentration × breakout participation
- institutional ownership × sector/liquidity commonality

### Redundancy
Control:
- market cap
- average turnover
- liquidity gate
- institutional flow
- volatility
- price tier

## DL-002DZ — Liquidity Commonality as Pattern Context

### Taiwan evidence
Institutional ownership is related to commonality in liquidity on TWSE; the relation varies by institution type, firm size and market declines.

### Pattern question
During a sector/market liquidity shock, a stock’s apparent:
- volume dry-up,
- spread widening,
- breakout failure,
may be market-wide rather than stock-specific.

### Fields
- stockLiquidityChange
- sectorLiquidityChange
- marketLiquidityChange
- residualLiquidityChange
- liquidityCommonalityState

### Hypothesis
Stock-specific constructive compression should be distinguished from market-wide liquidity withdrawal.

### Practical implication
If volume collapses because the entire market/sector liquidity collapses, do not automatically label it supply dry-up.

No Formal change.



## DL-002EA — Point-in-Time Zone Clustering Algorithm v0.1

### Objective
Convert confirmed swing highs/lows and other point-in-time structural anchors into reproducible support/resistance ZONES without hand-drawing and without using future touches.

### External-method prior
Published S/R research has used:
- modified K-means,
- Gaussian mixture models,
- extrema heuristics,
- volume-weighted/stochastic zone models.

Taiwan limit-order research independently shows round/even-price clustering creates genuine price barriers, so behavioral/tick anchors should remain explicit provenance rather than being erased inside one generic clustering model.

### Design choice
Primary detector should NOT begin with vanilla K-means because:
- K must be chosen in advance;
- every point is forced into a cluster;
- isolated/noisy pivots receive a cluster assignment even when they should remain noise;
- cluster center can be sensitive to scale/outliers.

Primary v0.1:
ONE-DIMENSIONAL DENSITY / AGGLOMERATIVE ZONE BUILDING on confirmed structural prices.

K-means/GMM remain benchmark detectors, not default truth.

### Candidate anchors
RESISTANCE candidates:
- confirmed BASE/MAJOR swing highs
- W neckline
- cup rim
- VCP/pattern pivot
- priorHigh20/priorHigh60 as explicit benchmark anchors
- long-horizon confirmed extreme
- round-price anchor if sufficiently near structural evidence
- exact prospective high-volume-node anchor if available

SUPPORT candidates:
- confirmed BASE/MAJOR swing lows
- W lows
- handle low
- post-break retest low
- priorLow20/major low benchmark
- round-price / exact prospective volume node if structurally relevant

Support and resistance candidates are clustered separately at creation time.
A role reversal later changes zone state; it does not retroactively change its origin.

### Point-in-time gate
A candidate level is eligible on date t only if:
- sourceConfirmedAt <= t
- required bar/data source was observable by t
- corporate-action adjustment/provenance is valid
- dataQuality != UNKNOWN for the required source

### Distance metric
For candidate prices p_i and p_j define descriptive normalized distances:
- pctDistance
- tickDistance
- atrDistance using lagged adjusted ATR known at candidate creation

Do not use one universal NT$ distance.

### Initial neighborhood tolerance
Use a pre-registered uncertainty envelope rather than outcome-tuning:
candidateWidth_i = max(
  minimumTickWidth_i,
  ATR-based uncertainty_i,
  sourceDispersion if source itself is a cluster
)

No future return is used to set width.

### Primary grouping procedure
1. Sort eligible candidate anchors by adjusted price.
2. Start with each anchor as an independent proto-zone.
3. Iteratively merge adjacent proto-zones only when their uncertainty envelopes overlap or their normalized distance is within the pre-registered neighborhood tolerance.
4. Isolated anchors remain SINGLE_SOURCE zones; they are not forced into another zone.
5. Preserve all constituent anchor IDs/provenance.
6. Compute zone center using a robust estimator (weighted median preferred over simple mean).
7. Compute lower/upper bounds from constituent uncertainty envelopes and observed dispersion, subject to a pre-registered maximum-width sanity cap.
8. Mark very wide/multimodal clusters AMBIGUOUS rather than forcing one zone.

### Why weighted median
A mean can be dragged by one extreme pivot.
Median/weighted median is robust and keeps the zone tied to actual historical prices.

Weights at v0.1 are STRUCTURAL only, not outcome-trained:
- MICRO / BASE / MAJOR scale identity retained
- source type retained
- recency/touch count stored separately rather than automatically converted into return-optimized weights

Do not assign “major swing = 3 points” because it backtested better.

### Output
zoneId
zoneVersion
zoneTypeOrigin
centerPrice
lowerBound
upperBound
widthPct
widthATR
widthTicks
candidateCount
constituentAnchorIds[]
constituentPrices[]
constituentConfirmedAt[]
sourceTypes[]
scaleSet[]
priceDispersion
ageDays
createdAt
updatedAt
dataThrough
ambiguityFlag
noLookaheadVerified

### Baseline comparison
Detector A:
simple priorHigh20/priorHigh60 / swing extrema baseline.

Detector B:
1D agglomerative/density zone v0.1.

Detector C:
K-means benchmark.

Detector D:
GMM benchmark.

Future exact volume-at-price may enable:
Detector E:
volume-weighted zone model.

No method is selected by same-sample forward return.

## DL-002EB — Zone Merge / Split / Evolution Rules

### Core principle
Zones evolve as NEW information arrives.
Historical zone snapshots are immutable.

### MERGE
Two live zones may merge at date t when:
- their uncertainty envelopes overlap materially,
- OR new confirmed anchors bridge the gap.

Create:
newZoneVersion / mergedZoneId
with:
- parentZoneIds
- effectiveAt = t

Do not rewrite the parents’ historical snapshots.

### SPLIT
A zone may be flagged for split when:
- constituent prices become clearly bimodal,
- width exceeds the pre-registered maximum relative to ATR/ticks,
- new evidence repeatedly reacts at two distinct subregions.

Split produces child zones effective from the new observation date.
Never backdate the split.

### DRIFT
A zone center may drift as new confirmed structural contacts arrive.
Store:
- previousCenter
- newCenter
- centerShiftTicks/ATR
- updateReason

Large drift lowers stability confidence.

### RETIRE
A zone is not deleted because price crossed it once.
Possible states:
ACTIVE
WEAKENING
BROKEN
ROLE_REVERSAL_CANDIDATE
ROLE_REVERSAL_CONFIRMED
STALE
RETIRED_FROM_ACTIVE_SET

Historical record remains.

### Staleness
Age alone does not erase a zone.
Use descriptive:
- age
- recent contacts
- source age dispersion
- later structural supersession

Do not outcome-tune a “zone expires after N days” rule.

## DL-002EC — Zone Strength Without Future Leakage

### Strength is multidimensional
Do NOT collapse immediately into one scalar score.

Store components:
STRUCTURAL_DENSITY
- number of independent confirmed anchors.

SCALE_AGREEMENT
- MICRO/BASE/MAJOR overlap.

REACTION_HISTORY
- point-in-time valid prior bounces/rejections only.

RECENCY
- time since creation / last interaction.

DISPERSION
- tighter constituent clustering vs wide ambiguity.

ROUND_PRICE_OVERLAP
- Taiwan behavioral/tick context.

VOLUME_PROFILE_OVERLAP
- exact prospective only unless approximation explicitly tagged.

COST_BASIS_OVERLAP
- estimated/approximate holder reference-price context.

### Touch independence
Multiple adjacent daily highs from the same failed attempt are NOT necessarily independent evidence.

Define a contact episode:
- one approach/rejection sequence separated from the next by a minimum structural departure, not merely another bar.

This prevents “five consecutive highs near 100” from being counted as five independent confirmations.

### Strength at time t
Can only use episodes completed before/on t.
Future reactions do not improve historical strength.

### Predictive calibration later
After prospective sample accumulation:
- test each component separately,
- test monotonicity,
- test whether a combined score adds value.

No current “zone strength 85/100” probability claim.

## DL-002ED — Zone Algorithm Falsification Matrix

### Competing algorithms
A. fixed-window prior highs/lows
B. confirmed-swing single levels
C. 1D agglomerative/density zones
D. K-means
E. GMM
F. volume-weighted zones when exact data exists

### Evaluate two different tasks

TASK 1: REACTION DETECTION
- bounce/rejection probability
- distance before reaction
- false zone rate
- zone stability

TASK 2: ECONOMIC VALUE
- D1/D3/D5
- MFE/MAE
- R01
- availableRoom
- execution delay
- cost-adjusted value

A method can be good at predicting tiny reactions yet economically useless.

### Complexity penalty
If complex clustering only marginally improves reaction detection and adds no actionable value versus priorHigh20/60 or simple confirmed swings:
REJECT_COMPLEXITY.

### Taiwan-specific robustness
Stratify by:
- price/tick band
- round-price overlap
- liquidity
- market regime
- thousand-stock vs general pool
- limit-hit context

### Current status
ZONE_CLUSTERING_V0_1_DEFINITION_FROZEN.
No Formal support/breakout level is changed.



## DL-002EE — Pattern Research Data-Readiness Matrix v0.1

### Purpose
DL-002 now contains many hypotheses with very different data requirements.
Do not let data availability silently determine truth.
Every feature family must state whether it is:
- READY_CURRENT
- READY_WITH_SEPARATE_RESEARCH_FETCH
- PROSPECTIVE_ONLY
- DATA_BLOCKED
- REDUNDANT / DEPRIORITIZED

### READY_CURRENT — usable from existing point-in-time daily research fields/history, subject to current ~65-bar horizon
Can study now on shorter structures:
- current MA/trend context
- priorHigh20 / priorHigh60
- priorLow20
- current rightFootHigher proxy
- daily high/low/close geometry
- ATR / volatility20
- volume 5/20 relationships
- daily close position / upper shadow for current bar
- ret20/ret60
- current liquidity / sector / institutional context already stored point-in-time
- existing R01/D1/D3/D5/D10/MFE/MAE outcomes
- failure/retest outcomes where recorder coverage is proven

Limits:
- current history cache omits historical open
- current live cache horizon is too short for many multi-month bases
- not enough to validate full DL-002

### READY_WITH_SEPARATE_RESEARCH_FETCH — source supports it, but isolate from live cache
Required for:
- raw historical OPEN
- adjusted OHLC
- 120/252-day or longer morphology
- long cup/handle
- long W spacing
- long-horizon extrema / 52-week references
- historical candlesticks
- capital-gains-overhang / cost-basis proxies
- weekly completed-bar reconstruction
- modern historical intraday minute analysis from 2023-05-23 onward
- closing-auction decomposition
- gap/intraday-vs-overnight decomposition

Design:
separate research fetch/cache so the live Formal history path is untouched.

### PROSPECTIVE_ONLY — cannot credibly reconstruct full historical state
- exact current-day volume-at-price snapshots
- bid/ask volume-by-price side
- dynamic best-five order-book imbalance
- queue depletion/replenishment
- exact trade-flow around a future pivot/retest
- prospective Pattern Shadow state snapshots
- any future point-in-time ownership/free-float data not available historically

Rule:
firstObservationDate must be stored; no historical fabrication.

### EXTERNAL_POINT_IN_TIME_REQUIRED
Possible only with trustworthy date-stamped external evidence:
- corporate actions
- monthly revenue / earnings event timestamp
- true SBL short-sale flow
- margin financing/short balances
- ownership/free float
- institutional ownership
- sector membership
- regulatory attention/disposition labels

Current-value backfill into historical dates is prohibited.

### DATA_BLOCKED until source semantics are solved
- historical exact five-level queue
- historical exact volume-at-price before prospective collection if no trade-level archive
- exact investor cost basis
- investor identity from aggregate volume
- intraday high/low ordering from daily OHLC alone

### REDUNDANT / DEPRIORITIZED
No dedicated data engineering for:
- Fibonacci ratios
- Elliott labels
- generic Ichimoku
- Renko
- Hurst/fractal features
- large indicator zoo

Unless new evidence changes priority.

## DL-002EF — Minimum Viable Pattern Shadow v1

### Goal
Start with the smallest research layer that can answer the highest-value questions without waiting for every advanced data source.

### v1 required inputs
Separate research daily history:
- raw O/H/L/C
- adjusted O/H/L/C
- volume
- turnover
- at least 252 trading days when available
- source/fetchedAt/dataThrough
- corporate-action handling/provenance
Existing point-in-time research context:
- Formal cohort / reasons
- liquidity
- regime
- sector
- Residual RS when valid
- institutional point-in-time fields
- existing outcome updater

### v1 detectors
1. repaint-safe MICRO/BASE/MAJOR swings
2. 1D S/R zone clustering
3. latent primitives P1-P8
4. VCP v0.1
5. W v0.1
6. cup/handle v0.1
7. flag/platform v0.1
8. positive/negative motifs
9. pattern maturity/lifecycle
10. local-vs-major resistance conflict
11. data/stability confidence

### Explicitly NOT in v1
- order book
- exact volume profile
- complex ML/DTW production scoring
- cost basis as a required gate
- Hurst/fractal
- Fibonacci/Elliott
- new Formal score
- live push/monitoring changes

### Why
This isolates whether TOPOLOGY itself adds value before spending complexity budget on microstructure.

### v1 output
For every existing research cohort row:
- primitive vector
- matching pattern families
- maturity state
- key zones
- negative morphology flags
- scale stability
- no-lookahead status
- missingness/data quality
- decisionImpact=false

### v1 success question
Does point-in-time topology improve explanation of forward outcomes beyond the existing Formal/research feature set?

Not:
“Can we build the fanciest pattern detector?”

## DL-002EG — Pattern Shadow v2 / v3 Sequencing

### v2 only after v1 evidence
Add:
- event interactions
- short flow
- holder-cost proxy
- sector pattern synchrony
- turnover/attention lifecycle
- closing-auction quality

### v3 only if incremental evidence justifies data burden
Add prospective:
- exact volume-at-price
- dynamic order book
- trade-flow absorption
- constrained shape similarity / motif discovery

### Kill switch
If v1 topology itself shows no stable incremental value:
do not build v2/v3 merely because data is available.

## DL-002EH — Research Architecture Principle: Evidence Before Data Complexity

### Rule
Higher-resolution data is not automatically higher-value information.

Daily topology can fail.
Minute data can fail.
Order-book data can fail.

The correct sequence is:
1. simple baseline
2. topology
3. context
4. microstructure

At each step require incremental evidence before advancing.

This prevents engineering complexity from outrunning statistical evidence.



## DL-002EI — Margin Financing / Retail Leverage × Pattern Maturity

### Taiwan evidence
Taiwan-specific research finds individual-investor margin-long activity can contribute to positive mispricing and predict lower subsequent returns in historical TWSE samples.
TWSE 2026 market commentary reports margin trading remains overwhelmingly dominated by domestic individual investors (>98%), even as the overall cash market becomes more institutional.

### Pattern implication
A breakout with rising margin financing can mean:
- broad speculative participation,
- retail attention/crowding,
- leverage chasing,
not necessarily informed confirmation.

### Candidate fields
- marginPurchaseBalance
- marginPurchaseBalanceChange1/5/20
- marginPurchaseUtilization / eligible shares if available
- marginBuyVolume
- marginBalanceVsFreeFloat
- marginAccelerationDuringPattern
- marginShockAtBreakout
- marginChangeOnRetest
- marginChangeAfterFailure
- marginVsInstitutionalFlowDivergence

### States
QUIET_MARGIN_BASE
- pattern matures without abnormal margin buildup.

MARGIN_CONFIRMATION_CANDIDATE
- margin rises moderately with price acceptance; descriptive only.

RETAIL_LEVERAGE_CHASE
- sharp margin acceleration after/into an extended breakout.

MARGIN_DIVERGENCE
- margin rises while institutional/price acceptance deteriorates.

DELEVERAGING_PRESSURE
- margin balance falls sharply during/after breakdown.

### Hypotheses
H1 mature structure before margin expansion may differ from margin-led price spikes.
H2 abrupt margin buildup after a large runup may increase failure/overheat risk.
H3 margin deleveraging can amplify downside failure but may also clean positioning before reclaim.
H4 the interaction with institutional flow is more informative than margin level alone.

### Redundancy
Control against:
- turnover/attention
- modified MAX / limit-hit intensity
- ret20/lateStage
- institutional flow
- market regime
- liquidity
- event catalyst

If margin merely proxies attention/turnover, retire it as a distinct pattern feature.

## DL-002EJ — Margin Long vs Short Flow Are Not Symmetric Information Signals

### Evidence
Taiwan literature suggests:
- individual margin long activity often reflects sentiment/speculation/mispricing;
- informed short selling can have different informational content;
- margin and short activities affect adverse selection / bid-ask spreads.

### Research rule
Do not combine:
marginLong - shortFlow
into one generic “bull-bear balance” without testing participant/source semantics.

Store separately:
- retailLeverageLong
- marginShort
- actualSBLShortSale
- institutionalLongFlow

### Pattern matrix
PRICE_STRONG + MARGIN_LONG_UP + INSTITUTIONAL_UP
PRICE_STRONG + MARGIN_LONG_UP + INSTITUTIONAL_DOWN
PRICE_STRONG + SHORT_FLOW_UP
PRICE_WEAK + MARGIN_LONG_STUCK_HIGH
PRICE_RECLAIM + MARGIN_DELEVERAGED

These are contextual states, not automatic signals.

## DL-002EK — Crowding / Leverage Can Alter Failure Severity

### Question
Does leverage/crowding influence only the probability of failure, or also the severity after failure?

### Outcomes
- failure probability
- MAE after failure
- gap-down frequency
- time-to-reclaim
- downside volume expansion
- volatility expansion
- stop-first rate

### Hypothesis
A crowded leveraged breakout may not fail more often, but when it fails, forced deleveraging could worsen the left tail.

This must be tested separately from average D5 return.

### Tail-risk metrics
- 5th percentile forward return
- worst D5/D10
- downside semideviation
- MAE tail
- conditional MAE among R01 failures

### No production change
Margin/crowding remains research-only context.



## DL-002EL — Statistical Validation Contract for Pattern Research

### Core unit of independence
Stocks observed on the same scan date share:
- market regime,
- macro shock,
- sector shocks,
- broad liquidity/attention conditions.

Therefore N stocks != N fully independent observations.

Primary independence unit:
INDEPENDENT_SCAN_DATE.

Report:
- row count
- unique scan dates
- unique sectors
- median rows per date
- outcome-mature scan dates

### Primary comparison order
1. WITHIN-DATE matched / demeaned comparison.
2. Date-clustered aggregate effect.
3. Leave-one-date-out stability.
4. Purged forward holdout.
5. Calendar/regime split.

Raw pooled averages are descriptive only.

### Same-date matched controls
For a pattern-positive candidate, prefer controls from the same scan date with similar:
- Formal cohort
- liquidity tier
- price tier / thousand vs general
- sector when enough peers exist
- ret20 / volatility / overheat
- Residual RS
- existing A/B setup status

Do not match on future information.

### Effect estimates
For each primary hypothesis report:
- mean/median outcome difference
- robust spread / confidence interval
- date-level sign consistency
- partial/cross-sectional association after controls
- coverage
- effect by regime

Do not report one p-value as proof.

## DL-002EM — Overlapping Forward Returns / Purging

### Problem
D5/D10/D20 outcomes from adjacent scan dates overlap in calendar time.
Treating them as independent inflates apparent evidence.

### Rules
- retain scan-date clustering;
- for holdout split, purge training dates whose forward outcome windows overlap holdout;
- embargo where needed around boundary;
- outcome horizon defines purge length.

### Separate horizons
D1
D3
D5
D10
D20

Each has a different effective sample size.
Do not say “60 samples” without stating which horizon is mature.

### Event overlap
A symbol appearing on multiple dates can also create dependence.
Store:
- symbolClusterCount
- consecutiveObservationRuns
- repeatedPatternEpisodeId

A single long cup observed for ten days is not ten independent cups.

## DL-002EN — Pattern Episode Identity

### Problem
Daily snapshots of one continuing VCP/base can duplicate one economic event.

### Episode model
Assign patternEpisodeId when:
- same symbol
- same structural anchors / zone family
- state evolves without structural reset.

Start a NEW episode only after:
- structural invalidation and later reformation,
- materially new base after a major move,
- prior episode fully resolved and reset criteria met.

### Benefits
Report both:
SNAPSHOT-level:
what was knowable each day.

EPISODE-level:
how many genuinely distinct patterns existed.

### Outcomes
Episode-level metrics avoid overstating sample count by repeated daily observations.

## DL-002EO — Competing Risks for Pattern Life Cycle

### Pattern can resolve in several mutually competing ways
From PIVOT_READY:
- BREAKOUT
- PRE_BREAKOUT_FAILURE
- STALE_WITHOUT_TRIGGER
- EVENT_RESET / DATA_CENSORING

From BREAKOUT:
- SUSTAINED_ACCEPTANCE
- FAST_REENTRY
- RETEST_HOLD
- RETEST_FAIL
- CENSORED

### Why simple averages are insufficient
A pattern that never triggers should not be treated as zero return from a nonexistent entry.
A stale/censored pattern differs from a failed breakout.

### Research model
At minimum store:
- timeToFirstResolution
- resolutionType
- censored flag

If sample later becomes adequate, competing-risk / survival analysis can estimate transition incidence.

### No forced model now
With small sample, use descriptive transition tables first.
Do not fit complex hazard models prematurely.

## DL-002EP — Cross-Sectional Association Is Not Causality

### Language rule
Allowed:
“pattern maturity is associated with lower R01 failure after controls.”

Not allowed:
“VCP causes higher returns.”

Chart structure may proxy:
- information arrival,
- investor attention,
- sector fundamentals,
- liquidity,
- institutional positioning,
- market state.

### Goal
Predictive incremental value is sufficient for selection research.
Causal stories remain hypotheses unless identification supports them.

## DL-002EQ — Calibration and Monotonicity Test

### If a continuous primitive/fit metric is useful
Higher values should preferably show stable, ordered changes in outcomes.

Test buckets pre-registered:
- low
- medium
- high
or quantiles defined on training only.

Evaluate:
- D5/D10
- R01 failure
- MFE/MAE
- stop-first
- coverage

### Warning
A U-shaped effect may be real.
Do not force monotonic score if evidence is nonlinear.

### Out-of-sample binning
Cut points learned on training must be frozen for holdout.
No rebucketing holdout to make monotonicity look better.

## DL-002ER — Permutation / Randomization Baseline

### Purpose
Ask whether observed separation is larger than what could arise by chance under the same date structure.

### Safe permutation
Shuffle pattern labels WITHIN scan date and appropriate cohort/strata.
Preserve:
- date sizes
- market regime
- outcome distribution by date
- cohort counts

### Uses
- sanity check raw separation
- benchmark complex detector against chance
- estimate false-discovery pressure

### Limitation
Permutation is not a substitute for holdout/prospective evidence.

## DL-002ES — Evaluation Metrics for Rare Pattern States

### Problem
Some mature patterns may be rare.
Accuracy is meaningless when negatives dominate.

### For binary research outcomes
Prefer:
- precision
- recall
- false-positive rate
- base rate
- lift over base rate
- PR-style summaries when sample sufficient

### For ranking/continuous metrics
- rank correlation within date
- top-vs-bottom bucket spread
- calibration
- coverage

### For trading relevance
- MFE/MAE
- stop-first
- cost-adjusted return
- capital utilization
- missed-winner opportunity cost

No single metric is enough.



## DL-002ET — Dual Price Space: Morphology vs Tradable Reference Levels

### Source semantics
Fugle supports adjusted=true for daily/weekly/monthly historical candles.
The adjusted series retroactively adjusts pre-corporate-action history while post-event prices remain on the current scale.

### Core problem
Different research questions need different price semantics.

MORPHOLOGY / RETURN question:
“How did the economic price path evolve without mechanical corporate-action jumps?”
Use ADJUSTED price space.

TRADABLE / BEHAVIORAL question:
“What nominal price did traders actually see and place orders around at that time?”
Use RAW / event-aware nominal price space.

Do not mix them inside one distance calculation.

### Two-space model
For each bar store:
RAW:
- rawOpen/high/low/close

ADJUSTED:
- adjOpen/high/low/close

CORPORATE ACTION:
- actionType
- exDate
- adjustmentFactor / cash entitlement when source supports
- source/provenance

### Morphology calculations
Use adjusted:
- swing segmentation
- return path
- ATR/volatility for long topology
- cup/W/VCP geometry
- long-horizon return
- gap detection only after excluding corporate-action mechanical gaps

### Execution / current-plan calculations
Use raw current tradable prices:
- buyLow/high
- stop
- quote comparison
- live pivot execution
- tick distance
- actual limit prices

### Historical S/R requires bridging
A historical raw resistance of NT$100 before a corporate action is not directly comparable with a post-action current price of NT$90.

For cross-action comparison create:
- historicalRawLevel
- equivalentCurrentScaleLevel
- conversionFactorKnownAt/afterAction
- levelSpace = RAW_AT_TIME / CURRENT_EQUIVALENT / ADJUSTED_MORPHOLOGY

Never compare old raw level directly to current raw price across an adjustment event.

## DL-002EU — Behavioral Reference Price Across Corporate Actions

### Competing considerations
1. Investors experienced the old nominal price and may remember it.
2. After cash dividends/splits/capital changes, rational comparison requires economic adjustment.
3. Brokerage charts often display adjusted or unadjusted history depending settings, changing visual salience.

### Research handling
Do not assume one perfect “psychological” level.

Maintain:
NOMINAL_MEMORY_LEVEL:
- historical raw observed price.

ECONOMIC_EQUIVALENT_LEVEL:
- corporate-action converted level on current price basis.

ADJUSTED_CHART_LEVEL:
- level on the adjusted morphology series.

### Research question
Which representation better explains future reactions after corporate actions?

This is exploratory and likely needs sufficient post-action revisit cases.

### No retrospective knowledge leak
The conversion for a corporate action becomes valid only once the event terms are known.
Historical pre-event decision snapshots cannot use a future corporate action.

## DL-002EV — Corporate-Action Boundary Splits Pattern Episodes

### Problem
A multi-month pattern can span an ex-dividend/split/capital-reduction event.

### Rule
Adjusted morphology may preserve continuity, but event context must be explicit.

Store:
- patternCrossesCorporateAction
- actionInsidePatternPhase
- pre/post action raw-scale discontinuity
- adjustedContinuityCheck

### Pattern interpretation
If corporate action occurs inside:
- cup bottom
- handle
- W second bottom
- VCP contraction
the pattern may remain valid in adjusted morphology, but:
- raw gap/candle labels are invalid around the event,
- nominal S/R must be converted,
- volume/event effects may be atypical.

### Candlestick rule
Bars immediately affected by ex-right/ex-dividend mechanics are excluded from normal gap/candlestick labels unless using an explicitly adjusted definition.

## DL-002EW — Adjustment Integrity Tests

### Data QA
For every corporate-action boundary:
1. raw series shows expected mechanical price discontinuity if applicable;
2. adjusted series removes/reduces the mechanical discontinuity consistently;
3. volume units remain consistent;
4. no duplicate/missing trading date;
5. pre/post return calculation uses the intended series.

### Detector QA
Run a synthetic test where:
- identical economic price path contains a cash-dividend discontinuity in raw prices.
Expected:
- adjusted swing/pattern geometry stays stable;
- raw gap detector flags CORPORATE_ACTION_GAP, not bearish breakdown;
- current-equivalent zone conversion preserves economic level.

### Status
DUAL_PRICE_SPACE_REQUIRED for Pattern Shadow v1 data layer.
No Formal live-price behavior changes.



## DL-002EX — Pattern Shadow Sampling Frame / Selection-Bias Control

### Critical question
What population is Pattern Shadow trying to improve?

Primary v1 objective:
incremental optimization of the CURRENT selection funnel.

Therefore v1 does not need to scan every listed stock with every expensive pattern detector.
But it must not observe only winners/selected candidates.

### Required cohorts
Attach Pattern Shadow to the existing point-in-time archive:
- SELECTED
- QUALIFIED_NOT_SELECTED
- NEAR_MISS
- REJECTED_AFTER_BASE
- BROAD_CONTROL

### Why BROAD_CONTROL is mandatory
If pattern features are computed only for SELECTED/Near-miss:
- pattern prevalence is conditioned on current Formal filters;
- false-positive/base-rate estimates are distorted;
- “beautiful pattern” may look rare only because controls were never measured.

### Scope interpretation
v1 answers:
“Within and around the current Formal funnel, does topology add incremental information?”

It does NOT yet answer:
“Could a completely independent pattern-first scanner replace the current funnel?”

That second question would require a broader full-market sampling design and a new experiment family.

### Deterministic control sampling
If BROAD_CONTROL is sampled rather than exhaustive:
- sampling must be deterministic/reproducible for a scan date;
- sampling rule frozen before outcomes;
- retain inclusion probability / sampling stratum if applicable;
- do not choose controls because their future path looked useful.

## DL-002EY — Immutable Pattern Snapshot Schema v0.1

### Snapshot table concept
pattern_shadow_snapshot
- scan_date
- symbol
- formal_cohort
- formal_pool
- detector_version
- data_through
- history_start_date
- raw_bar_count
- adjusted_bar_count
- corporate_action_status
- market_regime
- sector
- price_tier
- liquidity_tier
- primitive_json
- pattern_state_json
- negative_morphology_json
- confidence_json
- missingness_json
- created_at
- decision_impact = false

Primary key concept:
(scan_date, symbol, detector_version)

### Rule
Original feature snapshot is immutable.
If detector definition changes:
new detector_version, new row/version.
Do not rewrite old feature values with newer rules.

### Outcome table
pattern_shadow_outcome
- scan_date
- symbol
- detector_version
- horizon
- mature_at
- return
- mfe
- mae
- stop_first
- r01_state
- target_state
- outcome_data_quality
- updated_at

Outcomes append/update as horizons mature.
Features do not mutate.

## DL-002EZ — Structural Object Tables

### Why separate objects
One giant JSON makes auditing hard.
For debugging/research preserve structural objects.

SWING object:
- symbol
- as_of
- scale
- swing_id
- type
- pivot_at
- confirmed_at
- extreme_price_adjusted
- equivalent_raw/current price where relevant
- threshold_at_leg_start
- provisional
- source bars checksum/version

ZONE object:
- zone_id
- zone_version
- origin_type
- center
- lower/upper
- level_space
- created_at/effective_at
- parent_zone_ids
- constituent_anchor_ids
- state
- no_lookahead_verified

PATTERN_EPISODE:
- episode_id
- family
- first_observable_at
- state
- anchors
- state_history
- resolved_at
- resolution_type

### Storage trade-off
Implementation may denormalize for cost/performance, but conceptual provenance must remain recoverable.

## DL-002FA — Detector Versioning Contract

### A detector version freezes
- data semantics
- swing thresholds/scales
- zone clustering rule
- pattern topology
- motif definitions
- confidence fields

Example:
DL002_PATTERN_V1_0

### Version change required when
- threshold definition changes,
- pattern state definition changes,
- zone merge rule changes,
- data adjustment semantics change,
- new information is allowed into the feature.

### No version change required for
- additional future outcomes,
- bug-free report formatting,
- documentation typo.

### Bug fix
If a detector bug changes historical feature values:
create corrected version and preserve old version as INVALIDATED_BY_BUG.
Do not silently rewrite evidence.

## DL-002FB — Research Compute Budget / Staged Evaluation

### Stage 1 cheap daily
For existing cohorts:
- extended OHLC fetch/cache
- swings
- zones
- primitives
- named patterns
- maturity

### Stage 2 conditional
Only for relevant candidate states:
- minute-data closing-auction diagnostics
- event context
- short/margin context
- cost-basis proxy

### Stage 3 prospective expensive
Only around selected research trigger windows:
- exact volume-at-price
- repeated quote/order-book snapshots
- trade-flow

### Benefit
Avoid spending expensive data/compute on features that have not proven incremental value.

### Safety
Research compute must never delay or block Formal scan/monitor.
If research fails:
Formal remains unaffected,
research data quality = UNKNOWN / FAILED_FETCH.



## DL-002FC — Extended Historical Data Acquisition Contract

### Fugle source constraints verified
Historical daily candles:
- TWSE/TPEx listed-stock daily history available back to 2010.
- single request interval must be strictly less than one year.
- adjusted=true available for D/W/M.
- historical intraday candles available from 2023-05-23.
- rate limits vary by API plan and return HTTP 429 when exceeded.

### Research requirement
Pattern Shadow v1 needs roughly:
- 252 trading days for long-horizon reference / base morphology,
plus
- warmup for lagged ATR / prior trend before the earliest pattern anchor.

Therefore calendar coverage may exceed one API request even though 252 trading days is roughly one market year.

### Fetch design
Use deterministic chunks each < 1 year:
- chunk boundaries fixed by date,
- fetch ascending or normalize ordering after fetch,
- merge by (symbol,date),
- reject conflicting duplicate bars,
- verify continuity against trading calendar where possible.

### Required fields
Explicitly request:
- open
- high
- low
- close
- volume
- turnover
- change

Fetch both:
RAW adjusted=false
ADJUSTED adjusted=true

Do not depend on endpoint defaults.

### Cache identity
Key research cache by:
- symbol
- date
- adjustedFlag
- sourceVersion / fetchedAt

Avoid coupling to live v7_history_cache.

### Completeness
Store:
- requestedFrom
- requestedTo
- returnedFirstDate
- returnedLastDate
- barCount
- duplicateCount
- missingTradingDateCount
- sourceStatus
- chunkCount

Insufficient history = explicit status, not empty/no-pattern.

## DL-002FD — Rate-Limit / Failure Isolation

### API reality
Fugle rate limits depend on plan; exceeding them returns 429.

### Research rule
Do NOT assume a numeric rate limit from documentation unless account plan proves it.

### Safe behavior
- bounded concurrency
- retry only transient/429 with backoff
- cache successful historical chunks
- no repeated re-fetch of immutable old chunks
- resume from checkpoint
- research fetch failure never blocks Formal scan/monitor

### Data priority
1. existing research cohorts / controls
2. missing extended history only
3. advanced intraday context conditionally

No full-market brute-force historical download until capacity and benefit justify it.

## DL-002FE — Point-in-Time Historical Stats Caveat

### Fugle historical stats endpoint
Provides current 52-week high/low for a requested symbol.

### Important research limitation
A current historical-stats response is NOT automatically a point-in-time 52-week high for an old scan date.

For historical scan-date research:
derive the 52-week high/low from bars available through that historical date.

### Rule
Never backfill today’s week52High/week52Low into an old snapshot.

This preserves point-in-time integrity.

## DL-002FF — Research Data Checksum / Reproducibility

### Need
External providers can correct historical data.
A later re-fetch may differ from the bars originally used.

### Snapshot provenance
For each research calculation store:
- source
- fetchedAt
- dataThrough
- barRange
- adjusted flag
- deterministic checksum/hash of input bars where practical
- detectorVersion

### If source history changes
Do not silently mix old feature snapshot with newly corrected bars.

Possible statuses:
ORIGINAL_SOURCE_SNAPSHOT
RECOMPUTED_ON_CORRECTED_DATA

Research reports should disclose which.



## DL-002FG — Unified Swing-Zone Topology Graph

### Motivation
Separate implementations for:
- VCP
- cup/handle
- W
- flag/platform
can duplicate the same swing/zone calculations and drift into inconsistent definitions.

### Proposed representation
Build ONE point-in-time structural graph per symbol/as-of date.

NODES:
SWING_HIGH
SWING_LOW
RESISTANCE_ZONE
SUPPORT_ZONE
ROUND_PRICE_ANCHOR
VOLUME_PROFILE_NODE (prospective/context)
EVENT_NODE (context, not price node)

Each node stores:
- id
- type
- price / zone bounds
- pivotAt
- confirmedAt
- scale
- confidence
- provenance
- provisional
- levelSpace
- dataQuality

EDGES:
UP_LEG
DOWN_LEG
RETEST
RECLAIM
BREAK
ROLE_REVERSAL
ZONE_APPROACH

Each edge stores:
- start/end
- durationBars
- amplitudePct
- amplitudeATR
- amplitudeTicks
- volume/turnover stats
- RS change
- efficiency
- volatility trajectory
- firstObservableAt

### Named patterns become graph queries
W:
LOW -> HIGH -> LOW with neckline zone at intervening HIGH.

VCP:
alternating HIGH/LOW edges with declining down-leg amplitudes and tightening structure near resistance.

Cup:
HIGH -> extended recovery structure -> LOW region -> recovery toward old HIGH, optional handle subgraph.

Flag:
strong UP_LEG -> shallow/compressing corrective subgraph -> resistance approach.

### Benefit
- one source of truth for swings/zones;
- shared no-lookahead semantics;
- easier pattern overlap analysis;
- easier versioning;
- less duplicate computation;
- easier falsification.

## DL-002FH — Partial Graph Matching = Pattern Maturity

### Key insight
A pattern does not suddenly appear only at completion.

Pattern maturity can be represented by:
how much of a frozen topology template is already observable.

### Example W
State graph:
L1 confirmed
-> N confirmed
-> L2 forming
-> L2 confirmed
-> neckline approach
-> breakout

### Example VCP
contraction1 confirmed
-> contraction2 confirmed
-> possible third/final leg
-> pivot approach

### Maturity output
- requiredNodesObserved
- requiredEdgesObserved
- optionalStructureObserved
- conflictingStructurePresent
- provisionalDependencies
- completionFractionDescriptive
- nextExpectedStructuralEvent

### Critical caution
completionFraction is NOT success probability.

### Why useful
A graph-based maturity engine naturally supports:
- pre-breakout watch,
- no retroactive labeling,
- episode identity,
- state transitions.

## DL-002FI — Graph Conflict / Invalidating Evidence

### Positive template matching alone is dangerous
A chart can partially match a W while simultaneously having:
- major lower highs,
- expanding downside volume,
- older resistance overhead,
- weakening sector state.

### Graph stores conflict edges/flags
- bearish lower-high chain
- support break
- volume distribution
- failed reclaim
- major-zone collision
- regime deterioration

### Pattern result
Return BOTH:
supportingEvidence[]
conflictingEvidence[]

No “pattern detected” without its contradictions.

### Research test
Does conflict-adjusted topology outperform pure fit quality?

## DL-002FJ — Topology Graph Enables Pattern Deduplication

### Overlap example
A cup handle can contain a small VCP.
A W can form the bottom of a cup.
A platform can be the final tight area of a VCP.

### Graph overlap fields
- sharedNodeRatio
- sharedEdgeRatio
- sharedZoneRatio
- sameEpisode
- nestedPattern
- parentPatternId

### Rule
If two named patterns share most structural objects:
treat as NESTED / ALIAS evidence, not independent votes.

### Future validation
Compare:
- named-label count
vs
- number of independent structural primitives/episodes.

Hypothesis:
independent structural evidence matters more than number of pattern names.

## DL-002FK — Graph-Based Shape Similarity Later

### Secondary future option
Once topology graph is stable, shape similarity can compare:
- node sequence
- edge amplitudes/durations
- zone arrangement
rather than raw every-bar prices.

Potential benefits:
- lower dimensionality
- better interpretability
- less sensitivity to noisy bars

Possible methods:
- graph edit distance
- sequence distance over swing legs
- constrained DTW over edge features

### Priority
NOT v1.
Rule-based graph queries first.
Similarity only if it adds incremental evidence.

