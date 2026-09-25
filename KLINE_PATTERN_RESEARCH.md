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

