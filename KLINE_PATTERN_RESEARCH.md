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

