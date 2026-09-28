Warning: truncated output (original token count: 182302)
Total output lines: 22474

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

EXECUTION_NO_E…122302 tokens truncated…oday's sector score?

### Pattern-phase sector fields
- sectorReturnAtPatternStart
- sectorReturnAtMaturity
- sectorReturnSlope
- sectorBreadthAtStart
- sectorBreadthAtMaturity
- sectorBreadthSlope
- sectorTurnoverRatioAtStart
- sectorTurnoverRatioAtMaturity
- sectorTurnoverSlope
- sectorLeaderCount
- sectorNewHighBreadth
- sectorPatternMaturityBreadth
- stockVsSectorLeadLag
- sectorAutocorrelationStateResearch

### Synchronization states
SECTOR_LEADING_STOCK_FOLLOWING
- sector strengthens before stock pattern trigger.

STOCK_LEADING_SECTOR_CONFIRMING
- stock matures first, sector breadth/turnover later improves.

ISOLATED_STOCK
- stock pattern matures without sector confirmation.

SECTOR_DIVERGENCE
- stock reaches pivot while sector breadth/turnover deteriorates.

### Key hypothesis
A pattern may have higher continuation quality when:
- stock geometry matures,
- sector breadth improves,
- sector turnover/participation persists,
rather than when only the individual stock is strong.

But this must be tested after controlling the existing sector hard gate and ranking score.

## DL-002BY — Sector Momentum Life-Cycle Context

### External prior
Taiwan research on industry momentum life cycle reports an “early momentum” style (past winners with lower trading volume) outperforming a late-momentum style in its tested sample.

### Research interpretation
This is consistent with a possible distinction:
EARLY_SECTOR_ROTATION
- price leadership emerges before broad/high-volume crowding.

MATURE_SECTOR_ROTATION
- breadth and turnover broaden while trend persists.

LATE_CROWDED_SECTOR
- high turnover/attention after large prior gains.

### Pattern interaction
A stock-level VCP/cup/flag may mean different things depending on sector phase.

Candidate fields:
- sectorReturn20/60
- sectorTurnover20Trend
- sectorBreadthTrend
- sectorAttentionProxy
- sectorPhaseState
- stockPatternPhaseVsSectorPhase

### Redundancy
Current overheat / Quiet-Attention / sector-strength research already covers parts of this idea.
Only phase alignment that adds incremental value may survive.

## DL-002BZ — Sector Diffusion / Lead-Lag, Not Just Same-Day Correlation

### Question
Does strength diffuse across related stocks over several days rather than appearing simultaneously?

### Research fields
- daysFromSectorLeaderBreakoutToStockMaturity
- daysFromStockMaturityToSectorBreadthExpansion
- leaderReturnBeforeStockTrigger
- peerBreakoutCountPrior5
- peerFailureCountPrior5
- sectorDispersion
- sectorCorrelationState

### Mechanism
If industry information diffuses gradually, leaders can move first and peers follow.
If all peers surge simultaneously after a crowded catalyst, apparent “confirmation” may actually be late attention.

### Test
Compare:
- leader-first diffusion,
- broad simultaneous surge,
- isolated stock,
while controlling market regime and event context.

No production sector-timing rule is approved.



## DL-002CA — Path Complexity / Entropy as Diagnostic, Not Alpha

### External evidence
Information-theoretic research finds financial returns can contain nonlinear serial dependence and time-varying regularity.
However:
- Maasoumi & Racine (Journal of Econometrics, 2002) find small nonlinear dependence but fragile evidence of superior conditional predictability/profitability.
- Approximate/Sample Entropy studies show market regularity changes across regimes/turbulence.
- Higher-frequency data can exhibit different predictability than daily data.

### Research interpretation
Low entropy / high regularity does NOT mean bullish.
It means the recent path is more structured/repetitive.

High entropy / irregularity does NOT mean bearish.
It means geometry is noisier / less stable.

### Proposed descriptive fields
- returnSignEntropy
- rangeStateEntropy
- swingDirectionEntropy
- phaseEntropy
- entropyChangeIntoMaturity
- entropyChangeAtBreakout
- intradayEntropy15mResearch
- dailyVsIntradayEntropyGap

### Pattern hypotheses
VCP / handle:
- constructive tightening may reduce path irregularity into maturity.

Wide-loose / distribution:
- irregularity may remain high or rise.

Regime transition:
- entropy behavior may change around state changes, but sign is empirical.

### Critical safeguards
1. Do not rank stocks merely because entropy is low.
2. Compare entropy after controlling ATR/volatility; entropy and volatility are not identical.
3. Use enough observations for estimator stability.
4. Different entropy definitions are separate experiments.
5. Do not scan many entropy estimators and keep the best-performing one.

### Relation to existing DL-002
Entropy is a possible diagnostic for:
- geometry stability,
- wide-loose vs organized path,
- state transition,
not a replacement for explicit swing topology.

If it adds no information beyond:
- reversal count,
- efficiency ratio,
- volatility,
- Information Discreteness,
reject it as redundant.

## DL-002CB — Simplicity vs Complexity: Two Different Questions

### Important distinction
MODEL_COMPLEXITY:
How many parameters/features the predictive model uses.

PATH_COMPLEXITY:
How irregular the observed price path is.

Research showing complex ML models can improve return prediction does NOT imply complex/noisy chart paths are better.

### DL-002 principle
Keep the detector/model as simple as possible for a given evidence level, while allowing the observed path to be objectively complex.

Do not confuse:
“complex model may capture nonlinear relations”
with
“more complicated pattern deserves higher score.”

## DL-002CC — Intraday Regularity as Execution Research Only

### External prior
Information-theoretic studies find data frequency materially affects measured predictability; some intraday series show greater predictability than daily series.

### Project implication
Potentially study entropy/regularity on completed 15m bars around:
- breakout,
- retest,
- reclaim,
- failure.

Possible states:
- ORGANIZED_TREND_15M
- CHOPPY_RETEST_15M
- DISORDER_INCREASE
- ORDER_RESTORATION

### Boundary
This belongs to Execution Alpha only.
It cannot be used to improve the apparent Selection Alpha of the prior daily scan.

### Current priority
LOWER than explicit 15m price/volume/retest geometry because entropy estimators add complexity and can be unstable in short windows.

Status: EXPLORATORY_LOW_PRIORITY.



## DL-002CD — Variable-Length Segmentation Gains Direct Support from 2026 Taiwan HS Study

### New confirmation
The 2026 Taiwan HS paper explicitly notes a weakness in prior pattern research:
- Lo et al. used a 38-trading-day rolling window,
- Savin et al. widened this to 63 trading days,
- but fixed windows can miss patterns outside those durations and create computational/design constraints.

### Relation to DL-002
This independently supports DL-002AN:
compare fixed 20/60-day features with swing-defined variable-length structures.

### Research implication
Do not replace fixed horizons.
Use them as stable baseline controls.

The test is:
Does variable-length confirmed-swing topology add information beyond fixed 20/60-day features?

### Implementation priority
Higher than adding more named pattern labels, because segmentation quality affects:
- W,
- inverse HS,
- VCP,
- cup/handle,
- flags,
- support/resistance zones.

## DL-002CE — Pattern Shadow Data Model v0.1 (Design Only)

### Goal
Define a durable append-only research structure that can survive chat changes and support later program optimization without contaminating Formal Core.

### Table 1: pattern_shadow_snapshot
Primary research row per scan-date/symbol/detector version.

Fields:
- scan_date
- symbol
- formal_cohort
- detector_version
- swing_spec_version
- pattern_spec_version
- data_through_date
- history_start_date
- raw_bar_count
- adjusted_bar_count
- market_regime
- sector_state
- event_context
- data_quality_status
- latent_primitives_json
- pattern_states_json
- confidence_json
- first_observable_at
- selection_eligible
- execution_eligible
- created_at

Suggested uniqueness:
(scan_date, symbol, detector_version)

### Table 2: pattern_shadow_swing
- scan_date
- symbol
- scale
- sequence_no
- swing_type
- pivot_at
- confirmed_at
- pivot_price_adjusted
- pivot_price_raw
- threshold_at_start
- bars_in_leg
- amplitude_pct
- provisional
- detector_source

### Table 3: pattern_shadow_zone
- scan_date
- symbol
- zone_id
- zone_type
- lower_bound
- center_price
- upper_bound
- created_at_market_time
- last_updated_at_market_time
- constituent_swings_json
- touch_count_asof
- strength_state
- round_price_context
- provisional

### Table 4: pattern_shadow_event
Append-only lifecycle transitions:
- symbol
- event_at
- event_type
- family
- prior_state
- new_state
- key_level
- evidence_json
- first_observable_at

Examples:
MATURE
PIVOT_READY
BREAKOUT
RETEST
RECLAIM
FAILURE

### Table 5: pattern_shadow_outcome
Outcome append/update layer separated from original feature snapshot:
- scan_date
- symbol
- D1/D3/D5/D10/D20
- MFE/MAE
- R01
- stop_first
- first_breakout_date
- first_retest_date
- first_failure_date
- first_reclaim_date
- outcome_data_through

### Point-in-time rules
- original snapshot is immutable,
- later outcomes never rewrite original pattern state,
- later zone touches never strengthen historical zone snapshots,
- detector-version changes create new research versions, not retroactive overwrite.

### Formal isolation invariants
Pattern Shadow must not:
- modify candidate eligibility,
- modify Formal score/order,
- consume capital,
- enter formal monitoring,
- generate push,
- alter entry/stop/target logic.

### Engineering status
DESIGN_READY.
Implementation remains optional Class A only if fully isolated and regression-proven.
No code implementation is performed merely because the schema is designed.

## DL-002CF — Evidence-Tier Matrix Updated 2026-09-27

### Tier A — direct Taiwan academic evidence / highest current prior
1. Mechanically detected HS bottom / inverse-HS:
   - 2026 Pacific-Basin Finance Journal.
   - strong bottom/top asymmetry, historical extremeness interaction, turning-point confirmation, costs/multiple-testing checks.

2. Taiwan candlestick evidence:
   - multiple peer-reviewed studies, but specification-sensitive and older-regime.
   - useful as context, not standalone truth.

3. Market-state continuation/transition:
   - direct Taiwan evidence; strong importance for momentum/pattern conditioning.

4. Intraday vs overnight return composition:
   - direct Taiwan evidence; path composition matters.

5. Industry momentum / turnover/autocorrelation:
   - direct Taiwan evidence; sector persistence is heterogeneous.

6. Order-price clustering:
   - direct TWSE order-level evidence; supports tick/round-price context.

### Tier B — strong general pattern-method evidence + some Taiwan application
- double-bottom / generic topology recognition,
- bull flag / continuation template matching,
- support/resistance zone formalization,
- chart-image / nonlinear OHLC geometry,
- objective turning-point algorithms.

### Tier C — plausible but weaker direct academic validation
- named VCP formulation,
- classic cup-with-handle formulation,
- anchored VWAP as technical support,
- broad Sakata naming taxonomy.

### Rule
Tier determines prior research priority, not automatic Formal weight.
A Tier C concept can outperform prospectively.
A Tier A concept can fail in the current regime.

## DL-002CG — Failure-Precursor Hierarchy Without a Composite Score

### Goal
Identify early warnings before a pattern fails without creating another opaque weighted score.

### Pre-registered precursor groups
F1 STRUCTURAL_CONFLICT
- major resistance collision
- loss of higher-low progression
- expanding swing depth
- zone rejection progression

F2 PARTICIPATION_DIVERGENCE
- stock approaches pivot while sector breadth/turnover weakens
- Residual RS deteriorates
- informed-flow proxy deteriorates

F3 PRICE_ACCEPTANCE_WEAKNESS
- high-volume but poor close
- no post-breakout extension
- fast re-entry
- repeated pivot crossings

F4 ATTENTION / EXTENSION
- extreme historical high percentile for continuation setup
- large pre-event runup
- limit-hit/turnover attention spike
- overheat context

F5 PATH_INSTABILITY
- wide-loose structure
- rising entropy/irregularity
- range expansion after contraction
- repeated large rejection

### Test discipline
Do not sum F1-F5 initially.
Test each group separately and hierarchically:
1. existing Formal baseline
2. +F1
3. +F2 conditional on F1
4. +F3
5. +F4
6. +F5

Only retain groups with incremental evidence.

### Why no score
A weighted “failure score” would create many free parameters and make post-hoc tuning too easy.

## DL-002CH — Exact Continuation Point (2026-09-27)

1. Continue from the 2026 Taiwan HS paper and formalize inverse-HS topology using confirmed swings; do not create a separate primary hypothesis from the existing multi-trough reversal family.
2. Compare Directional-Change vs Bry-Boschan turning-point confirmation; agreement is a robustness diagnostic, not an automatic score.
3. Build point-in-time historical-price-percentile definitions and test redundancy vs drawdown/ret60/overheat.
4. Continue Pattern Shadow design only; do not implement until data requirements and detector definitions are frozen enough for a useful Class-A snapshot.
5. Resolve research-data requirements:
   - retain historical OPEN,
   - adjusted + raw OHLC,
   - >=120 bars,
   - corporate-action tags,
   - no fabricated volume-at-price.
6. For volume-at-price/cost research, do not infer holder cost from daily bars. True profile stays DATA_BLOCKED without intraday/tick price-volume data.
7. Continue sector synchronization research using persistence/turnover/breadth slope rather than duplicate current one-day sector gate.
8. Evaluate entropy/path complexity only as diagnostic; it remains low priority unless incremental beyond volatility/efficiency/DL-001.
9. Pre-register failure precursor groups F1-F5 without combining them into a score.
10. Keep primary hypothesis budget compact; every new named pattern should map into an existing latent/topology family where possible.
11. Formal Core remains LOCKED. No ranking, thresholds, capital, execution, monitoring or push changes without mature evidence + explicit owner approval.


## DL-002CI — Bry-Boschan Is Backward-Looking: Confirmation Delay Must Be Explicit

### Critical methodological issue
Bry-Boschan-style turning-point detection identifies local peaks/troughs using surrounding observations and duration/censoring rules.
Modern applications explicitly note that confirming a turning point at time t requires future observations after t.

Therefore a Bry-Boschan turning point has at least two dates:
- pivotAt: date of the local extreme,
- confirmedAt: later date when enough future observations exist to confirm it.

### Implication for the 2026 Taiwan HS evidence
The finding that strict BB alignment improves HS event performance is valuable as a pattern-quality result.
It does NOT justify using ex-post BB labels as if the turning points were known on pivotAt.

### DL-002 implementation rule
For any BB-style detector:
- store pivotAt,
- store confirmedAt,
- store confirmationLagBars,
- selection-time usage allowed only if confirmedAt <= scanDate.

### Two-sided filter prohibition
Any smoothing/filter that uses future observations around date t is allowed only for:
- ex-post descriptive labeling,
- never for a historical as-of-date predictor.

If a BB implementation uses two-sided windows/filters, its signal date is the confirmation date, not the historical pivot date.

### Comparison with Directional Change
Directional Change:
- confirms after a threshold reversal,
- naturally provides event confirmation time.

Bry-Boschan:
- confirms local extrema via surrounding-window/duration logic,
- may provide cleaner topology but also later confirmation.

Research should compare:
- quality gain,
- confirmation delay,
- missed early-entry opportunity.

### New outcome
TURNING_POINT_QUALITY_VS_LATENCY:
Does cleaner turning-point confirmation improve false-pattern filtering enough to offset later observability?

This is directly relevant to Pattern Maturity design.

## DL-002CJ — Detection Latency as a First-Class Cost

### Problem
A detector can look excellent in an ex-post chart but become useless if it confirms too late.

### Fields
- pivotToConfirmBars
- patternStartToMaturityBars
- maturityToPivotReadyBars
- pivotReadyToBreakoutBars
- percentOfMoveElapsedAtConfirmation
- priceDistanceFromPivotAtConfirmation
- remainingUpsideProxyAtConfirmation

### Compare detectors
For DC, BB, and rule-shape agreement:
- false-pattern rate,
- confirmation lag,
- MFE remaining after confirmation,
- entry-zone reach,
- missed-breakout rate.

### Principle
The best detector is not the one with the cleanest historical chart.
It is the detector with the best tradeoff between:
- topology quality,
- timeliness,
- incremental outcome information.

## DL-002CK — Historical Extremeness Must Be Point-in-Time and Horizon-Aware

### 2026 Taiwan HS paper
The head percentile measures how extreme the detected head is relative to the stock’s own historical price distribution available before/at detection.

### Research design
Store multiple pre-registered horizons rather than one full-history number:
- percentile252
- percentile504
- percentileAllAvailable

Reason:
- all-history percentile can be dominated by ancient price regimes,
- 1y/2y percentiles may better represent current economic regime,
- but choosing the best horizon after outcomes would be data snooping.

### Corporate-action rule
Use adjusted morphology prices for historical percentile continuity.
Retain raw price separately for actual executable levels.

### New interaction
For reversal families:
- low historical percentile may strengthen reversal context.

For continuation families:
- very high percentile may mean either leadership or late-stage extension.

Therefore percentile is family-dependent context, not a universal quality score.



## DL-002CL — Triangle / Wedge Boundary Geometry v0.1

### Motivation
Formal chart-pattern literature shows that named patterns can be specified as relationships among extracted turning points.
Rather than adding dozens of names, DL-002 represents triangle/wedge families through boundary geometry.

### Boundary construction
Use confirmed swing highs/lows within the candidate consolidation.

Upper boundary:
- fit through recent confirmed swing highs.

Lower boundary:
- fit through recent confirmed swing lows.

Store:
- upperSlopePctPerBar
- lowerSlopePctPerBar
- upperSlopeATRPerBar
- lowerSlopeATRPerBar
- upperFitError
- lowerFitError
- boundaryConvergenceRate
- estimatedApexBars
- upperTouchCount
- lowerTouchCount
- alternatingTouchQuality
- rangeCompressionSlope

### Descriptive labels
SYMMETRICAL_TRIANGLE:
- upper boundary slopes down,
- lower boundary slopes up,
- range converges.

ASCENDING_TRIANGLE:
- upper boundary approximately flat,
- lower boundary rises.

DESCENDING_TRIANGLE:
- lower boundary approximately flat,
- upper boundary falls.

RISING_WEDGE:
- both boundaries rise,
- lower slope exceeds upper slope enough to converge.

FALLING_WEDGE:
- both boundaries fall,
- upper/lower geometry converges in the opposite configuration.

EXPANDING_STRUCTURE:
- boundaries diverge; adverse/control morphology.

### Do not hard-code “bullish pattern names”
Ascending triangle is not automatically bullish.
Falling wedge is not automatically bullish.
Direction comes from:
- breakout/acceptance,
- prior trend,
- regime/sector context,
- evidence.

### Fit quality
A boundary based on two arbitrary points is too easy to manufacture.
Store:
- confirmedTouchCount,
- fit residual,
- scale stability,
- whether a provisional last leg is used.

### Convergence quality
Measure:
- startWidthATR
- currentWidthATR
- widthShrinkRatio
- convergenceHalfLife
- apexDistanceBars

Do not assume “closer to apex is always better.”
Very late apex approach may represent stale compression.

### Relationship to existing primitives
Triangles/wedges mostly decompose into:
- COMPRESSION,
- SUPPORT,
- RESISTANCE,
- TIME,
- ACCEPTANCE.

Named labels are interpretability views unless they add incremental evidence.

## DL-002CM — Formal Pattern Taxonomy as Constraint Grammar

### External evidence
Wan & Si (Information Sciences, 2017) formally specify 53 chart patterns and group them into five structural categories.
A central motivation is that practitioner definitions are ambiguous and inconsistent.

### DL-002 principle
Represent patterns as a constraint grammar over:
- confirmed points,
- boundary relationships,
- duration,
- amplitude,
- curvature,
- candle relations.

### Proposed grammar primitives
POINT:
- confirmed high/low

RELATION:
- higher / lower / approximately equal

BOUNDARY:
- flat / rising / falling / converging / diverging

CURVE:
- rounded / V-shaped / asymmetric

SEQUENCE:
- alternating / repeated / contracting

CONTEXT:
- prior trend / regime / event / sector

TRIGGER:
- breakout / reclaim / retest / failure

### Benefit
New pattern names can be mapped to existing primitives without inventing new scoring dimensions.

### Example
Inverse HS:
LOW1 -> lower HEAD -> higher LOW3
with two neckline highs and breakout/acceptance.

Ascending triangle:
multiple highs near resistance zone + rising confirmed lows + narrowing width.

VCP:
alternating swings with declining amplitude and supply contraction near pivot.

### Engineering implication
If a future detector is built, encode reusable primitive functions first.
Do not build one separate bespoke function for every named pattern.

## DL-002CN — Pattern Ambiguity Is a Feature, Not an Error

### Problem
One price path may satisfy:
- ascending triangle,
- VCP,
- platform,
- cup handle,
at the same time.

Forcing exactly one class creates artificial certainty.

### Research output
multiLabelPatterns[]
patternOverlapCluster
sharedPrimitiveCount
uniquePrimitiveByPattern
classificationAmbiguity

### Hypothesis
Low ambiguity may indicate a clean textbook topology,
but high ambiguity could simply reflect that multiple labels describe the same strong compression.

Therefore classification ambiguity itself must not be treated as bad until tested.



## DL-002CO — Technical Morphology Has a Horizon Role, Not Total Dominance

### External evidence
Cakici & Zaremba (2025), Journal of International Financial Markets, Institutions and Money:
- technical data predicts returns better than accounting information in their international ML setting,
- technical edge is strongest at shorter horizons,
- technical strategies have higher turnover,
- accounting information performs better at longer horizons and lower implementation cost,
- both technical and accounting information retain independent content.

### Project implication
Do NOT interpret strong DL-002 evidence as a reason to weaken/remove fundamental quality controls.

Layer roles:
FUNDAMENTAL_QUALITY:
- business/earnings/valuation durability,
- longer-horizon quality and risk filter.

PATTERN_MORPHOLOGY:
- timing,
- maturity,
- support/resistance structure,
- short-horizon selection/execution context.

INTRADAY_EXECUTION:
- 15m entry/retest/acceptance.

### Evaluation horizon
Primary DL-002 endpoints should emphasize:
- D1/D3/D5/D10,
- MFE/MAE,
- R01 failure,
- stop-first,
because morphology is primarily a short/intermediate timing layer.

D20 remains useful, but should not be the sole criterion for whether a short-horizon pattern is informative.

### Turnover / implementation cost
Any later pattern-enhanced selector that materially increases candidate churn must report:
- turnover change,
- entry frequency,
- cost/slippage sensitivity,
- zero-pick/capital-utilization change.

A small gross predictive edge that requires much higher turnover may not be useful.

## DL-002CP — Information-Layer Independence Test

### Question
Does pattern information add beyond:
- fundamentals,
- valuation,
- institutional flow,
- sector context,
- existing A/B price/volume factors?

### Research hierarchy
Baseline 0:
existing Formal research variables.

Baseline 1:
+ DL-001 gradual path.

Baseline 2:
+ DL-002 primitive topology.

Baseline 3:
+ named pattern labels.

Baseline 4:
+ event/sector/flow interactions.

### Interpretation
If primitives improve but named labels do not:
keep primitives, retain names only for explanation.

If pattern information disappears after fundamentals/sector/RS:
reject the pattern as non-incremental.

If both fundamental and pattern layers remain informative:
preserve layered architecture rather than forcing one to replace the other.



## DL-002CQ — Measured-Move Targets vs Real Resistance

### Practitioner convention
Many chart patterns use “measured move” targets:
- W / inverse-HS: neckline plus pattern height,
- cup: breakout level plus cup depth,
- flag: breakout plus some fraction/full pole height,
- rectangle/triangle: breakout plus base height.

The 2026 Taiwan HS study also shows realized results are sensitive to the profit-target multiple.

### Current-system comparison
Current Formal uses nearestRealResistance() to estimate target/RR from observable resistance levels rather than blindly applying textbook measured moves.

### Research question
Does a pattern measured target contain useful information beyond real-resistance targeting?

Store:
- measuredTarget1x
- measuredTarget05x
- patternHeightPct
- nearestRealResistance
- targetConflictPct
- measuredTargetAboveResistance
- realizedMFEToMeasuredTarget
- realizedMFEToResistance

### Critical rule
Measured target is NOT allowed to replace real resistance in Formal RR during research.

### Conflict states
MEASURED_BELOW_REAL_RESISTANCE
MEASURED_NEAR_REAL_RESISTANCE
MEASURED_ABOVE_REAL_RESISTANCE
NO_VERIFIABLE_REAL_RESISTANCE

### Hypothesis
If measured targets systematically overstate reachable upside when major resistance intervenes, the current real-resistance approach is safer.

If measured targets add predictive information after resistance controls, they may be useful as a secondary research descriptor.

## DL-002CR — Pattern Invalidation Level vs Existing Stop Logic

### Pattern-specific invalidation examples
VCP:
- final contraction / key structural trough failure.

Cup handle:
- handle structural low / deeper cup deterioration.

W / inverse-HS:
- second bottom/right shoulder/head structure failure depending stage.

Flag/triangle:
- lower boundary / last confirmed higher low.

### Current Formal stop
Formal stop is based on current A/B support/breakout + ATR logic.

### Research comparison
Store:
- formalStop
- patternInvalidationLevel
- distanceFormalStopPct
- distancePatternStopPct
- whichStopIsTighter
- stopFirstFormal
- stopFirstPatternCounterfactual
- MFEAfterPatternStop
- MFEAfterFormalStop

### Important boundary
This is counterfactual research only.
Do not change actual Formal stops automatically.

### Goal
Determine whether topology supplies a cleaner invalidation point or merely creates tighter stops and more whipsaw.

## DL-002CS — Pattern Geometry Must Not Manufacture RR

### Risk
A flexible pattern detector could:
1. choose a convenient neckline/pivot,
2. derive an optimistic measured target,
3. produce an apparently attractive RR,
creating circular selection bias.

### Safeguards
- pivot/neckline must be frozen before target calculation,
- target formula frozen before outcomes,
- real resistance independently calculated,
- no choosing among multiple targets based on whichever gives RR >= 2,
- candidate failing Formal RR remains failed during research.

### Research output
Pattern RR can be stored as:
- descriptivePatternRR
- formalRR
- rrDifference
but decisionImpact=false.



## DL-002CT — Pattern Episode Identity / Duplicate-Event Control v0.1

### Direct chart-pattern evidence
Recent Financial Innovation research on mechanically detected chart patterns explicitly notes that rolling-window detection can identify the SAME completed pattern in multiple adjacent windows. The authors add a completion-timing restriction so the same pattern is not unintentionally counted multiple times.

This is directly relevant to daily Pattern Shadow:
a VCP/cup/W/triangle can remain detectable on many consecutive scan dates.

### Core rule
Repeated daily snapshots of the same underlying pattern episode are NOT independent pattern events.

### Episode object
Store:
- patternEpisodeId
- symbol
- family / overlapCluster
- episodeStartObservedAt
- firstStructureValidAt
- firstMatureAt
- firstPivotReadyAt
- firstBreakoutAt
- firstFailureAt
- firstReclaimAt
- episodeEndAt
- terminalState
- parentEpisodeId if nested
- detectorVersion

### Episode matching across daily scans
Two daily detections belong to the same episode when:
- same symbol,
- compatible pattern family / latent structure,
- key structural anchors materially overlap,
- pivot/zone drift remains within frozen tolerance,
- no terminal invalidation and genuinely new base formation occurred between them.

Do NOT define sameness by name alone; a cup handle can also be VCP on the same underlying episode.

### Daily snapshots remain useful
Keep daily snapshots because maturity evolves.
But for event-level inference:
- one pattern episode = one clustered event,
- repeated days are longitudinal observations nested within episode.

### Episode restart
A new episode requires an objective reset such as:
- terminal failure + later new base,
- breakout completion followed by a new independent consolidation,
- major structural swing reset,
- sufficiently new set of confirmed anchors.

Do not use an arbitrary “N days cooldown” as the primary reset without validation.

### Statistical consequence
Report:
- raw snapshot count,
- unique episode count,
- unique symbol count,
- unique scan-date count.

Never report raw daily snapshot count as independent N.

## DL-002CU — Pattern Lifecycle as Time-to-Event / Competing Risks

### Problem
A mature pattern can:
1. break out,
2. invalidate,
3. remain unresolved/stale,
4. transform into another structure.

If an unresolved pattern reaches the end of observation, labeling it “failure” is wrong.

### Survival-style representation
Origin can be:
- STRUCTURE_VALID timestamp,
- MATURE timestamp,
depending research question.

Potential events:
- BREAKOUT_ACCEPTED
- STRUCTURAL_FAILURE
- STALE_TERMINATION / STRUCTURAL_TRANSFORMATION

If none occurs by study horizon:
- RIGHT_CENSORED

### Why censoring matters
A pattern observed for 8 days without breakout is not equivalent to a pattern that explicitly broke support on day 8.
The former is unresolved; the latter failed.

### Candidate metrics
- timeMatureToPivotReady
- timeMatureToBreakout
- timeMatureToFailure
- timeBreakoutToRetest
- timeBreakoutToR01Failure
- censorReason
- observationEndDate

### Competing-risk caution
Treat breakout and failure as competing lifecycle outcomes rather than naively dropping the opposite event.
If later formal survival/competing-risk models are used, they are research diagnostics only and require adequate episode counts.

### Existing outcome preservation
Continue D1/D3/D5/D10/D20, MFE/MAE and R01.
Time-to-event analysis complements them; it does not replace the established outcome framework.

## DL-002CV — Overlapping Forward Windows / Clustered Dependence

### Finance-methodology evidence
Event-study research shows event-date clustering and cross-sectional correlation can materially overstate significance when observations are treated as independent. Longer event windows also increase exposure to contaminating information.

### Pattern-specific dependence
DL-002 has several dependence sources:
1. same episode observed on consecutive scan dates,
2. same stock can generate repeated episodes,
3. D5/D10/D20 windows overlap in calendar time,
4. many stocks in one sector react to the same event,
5. many candidates share the same market regime/date.

### Inference unit
Primary independent evidence should emphasize:
- unique scan dates,
- unique pattern episodes,
not raw stock-day rows.

### Required diagnostics
- uniqueEpisodeCount
- uniqueScanDateCount
- uniqueSymbolCount
- episodesPerSymbol
- snapshotsPerEpisode
- sectorConcentration
- forwardWindowOverlapRate

### Robustness
Use existing date-cluster / leave-one-date-out governance.
For later pattern-specific inference, cluster or otherwise account for:
- scan date,
- symbol/episode dependence,
when sample size permits.

### Same-date matching remains valuable
Comparing Pattern-strong vs Pattern-weak within the same scan date removes some common market shock, but does not make stock observations fully independent.

### No pseudo-replication
Five consecutive days of the same mature cup are not five confirmations of H3.

## DL-002CW — Nested / Parent-Child Pattern Episodes

### Problem
Patterns can be nested across scales:
- multi-month cup is parent,
- daily handle is child,
- handle itself may be a VCP/triangle,
- 15m retest is execution child event.

### Hierarchy
PARENT_BASE:
- long-duration cup / major base / multi-trough reversal.

CHILD_COMPRESSION:
- handle / VCP / flag / triangle within parent.

TRIGGER_EVENT:
- daily breakout / reclaim.

EXECUTION_CHILD:
- 15m breakout/retest/reacceleration.

### Fields
- episodeId
- parentEpisodeId
- relationType
- scale
- sharedAnchorRatio
- independentGeometryFlag

### Anti-double-counting
Nested child patterns do not automatically create independent bullish evidence.

Research question:
Does a child compression add incremental information conditional on parent maturity?

### Example
Cup parent + VCP handle:
test:
- mature cup without VCP handle,
- mature cup with VCP handle,
rather than scoring cup + VCP separately.



## DL-002CX — Inverse Head-and-Shoulders Confirmed-Swing Specification v0.1

### Goal
Define HS-bottom / inverse-HS using the same repaint-safe swing grammar as the rest of DL-002, without importing undocumented paper-specific thresholds.

### Required chronological anchors
LS = confirmed left-shoulder low
N1 = confirmed swing high after LS
H = confirmed head low
N2 = confirmed swing high after H
RS = confirmed right-shoulder low

Chronology:
LS < N1 < H < N2 < RS

For a fully formed pre-breakout structure, all five anchors must be observable/confirmed as of the scan date.
A provisional RS may be stored as FORMING, never as fully confirmed.

### Basic topology
- H must be structurally lower than LS and RS after tick/ATR tolerance.
- LS and RS should occupy a shoulder-comparable zone, but exact equality is NOT required.
- N1 and N2 define neckline geometry.
- neckline can slope upward/downward; do not force horizontal line.
- right shoulder must form after N2 and before a confirmed neckline breakout.

### Neckline zone
Use N1/N2 as structural inputs:
- necklineSlopePctPerBar
- necklineAtCurrentDate
- necklineZoneLower/Upper
- necklineFitError
- necklineSourceCount
- necklineTickWidth / ATR width

Breakout state is relative to the zone, not one ideal line.

### Geometry fields
- lsPrice
- headPrice
- rsPrice
- headBelowLsPct
- headBelowRsPct
- shoulderDifferencePct
- shoulderDifferenceATR
- shoulderDifferenceTicks
- lsToHeadBars
- headToRsBars
- timeSymmetry
- depthSymmetry
- n1Price
- n2Price
- necklineSlope
- headToNecklineHeightPct
- rsToNecklineHeightPct
- rightShoulderRecoveryStrength
- headHistoricalPercentile252/504/all
- scaleAgreement

### Volume / RS fields
Do not enforce textbook volume rules.
Store:
- volumeLS
- volumeHead
- volumeRS
- downVolumeLS/head/RS
- volumeTrendAcrossTroughs
- residualRS_LS
- residualRS_H
- residualRS_RS
- rsDivergenceHeadToRS

Hypothesis examples:
- lower price head + less selling pressure may indicate exhaustion,
- RS higher at RS than at head may provide positive divergence.

Both remain tests, not requirements.

### Maturity states
IHS_FORMING_LS
IHS_HEAD_FORMED
IHS_RIGHT_SIDE_FORMING
IHS_RS_CONFIRMED
IHS_PIVOT_READY
IHS_BREAKOUT_CONFIRMED
IHS_RETESTING
IHS_FAILED

### Failure states
- HEAD_CONTINUATION_LOWER_LOW
- RIGHT_SHOULDER_BREAKS_HEAD
- NECKLINE_REJECTION_REPEAT
- RS_SELLING_EXPANSION
- BREAKOUT_FAILURE_R01

### Detector agreement
For each anchor:
- DC confirmation
- BB-style confirmation
- agreement/disagreement
- confirmation lag

No BB alignment may be backdated to the pivot date.

### Relationship to W/double bottom
Both belong to H2 multi-trough reversal topology.

W:
L1 -> N -> L2.

Inverse-HS:
LS -> N1 -> H -> N2 -> RS.

Compare subfamilies inside H2; do not count them as independent hypotheses.

### Status
DEFINITION_FROZEN_V0_1.
Research/Shadow only.

## DL-002CY — Research Sampling Strategy / No Pretty-Chart Selection

### Principle
Pattern research must evaluate the detector on the same point-in-time candidate universe, not on hand-picked textbook examples.

### Primary cohorts
Reuse Shadow Archive:
- SELECTED
- QUALIFIED_NOT_SELECTED
- NEAR_MISS
- REJECTED_AFTER_BASE
- BROAD_CONTROL

### Pattern-analysis eligibility
A row can be pattern-analyzable only when:
- sufficient history for the detector family,
- required raw/adjusted fields exist,
- corporate-action status is known where needed,
- as-of-date integrity passes.

Insufficient history/data = UNKNOWN / NOT_ANALYZABLE, never “pattern absent.”

### Broad-control sampling
If full BROAD_CONTROL is computationally expensive, use a pre-registered stratified sample by:
- scan date,
- market (TWSE/TPEx),
- price tier,
- liquidity tier,
- sector,
- maybe Formal base-pass status.

Sampling seed/rule must be deterministic and stored.
Do not preferentially sample stocks with visually interesting charts.

### Weighting
If controls are sampled unequally, retain sampling probability / stratum weight so descriptive rates are not mistaken for full-universe prevalence.

### Minimum reports
For every pattern family:
- analyzable denominator,
- missing/not-analyzable count,
- pattern-positive count,
- unique episode count,
- cohort distribution,
- sector/price/liquidity distribution,
- date coverage.

### Avoid case-study bias
Individual charts are for detector debugging/explanation only.
They are not evidence of alpha.

## DL-002CZ — Pattern Prevalence vs Predictive Value

### Important distinction
A pattern can be:
- common but useless,
- rare but informative,
- rare because detector is too strict,
- common because detector is too loose.

Therefore report separately:
- prevalence,
- outcome conditional on pattern,
- incremental outcome vs matched controls,
- coverage cost.

### Variables
- patternPrevalencePct
- episodePrevalencePct
- maturePatternPrevalencePct
- patternPositivePerScanDate
- zeroPatternDateRate
- overlapWithFormalA/B
- overlapWithNearMiss
- incrementalCoverage

### Optimization relevance
A high-quality pattern that appears once every 6 months may have little impact on the current capital-idle problem.
A moderate-quality pattern with broad stable coverage might be more useful.

But coverage alone is never a reason to loosen quality.

### Required tradeoff
Later optimization review should show:
- incremental quality,
- incremental coverage,
- turnover,
- zero-pick impact,
- complexity cost.



## DL-002DA — Bearish Pattern Asymmetry / Shorting-Flow Context

### Taiwan evidence
Taiwan research shows:
- short-selling constraints can impair price efficiency in specific settings,
- shorting flows contain incremental predictive information for future returns,
- historical regulatory design creates asymmetry between positive and negative information incorporation.

### Interpretation boundary
This is a plausible market-structure mechanism for bullish/bearish pattern asymmetry.
It does NOT prove that short-sale rules cause HS-bottom patterns to outperform HS tops.

### Project use
Because the current system is long-oriented:
bearish topology should first serve as:
- avoidance,
- failure precursor,
- reduce/revalidation context.

Do not auto-create short signals.

### Research fields
Where point-in-time short-flow evidence is available:
- shortFlow5/20/60
- shortFlowAcceleration
- shortFlowPercentile
- shortFlowDuringPatternMaturity
- shortFlowOnFailedBreakout
- shortFlowDivergenceFromPrice

### Hypotheses
- bullish-looking pattern + rising informed short flow may have higher failure risk,
- failed breakout + persistent short flow may behave differently from failure without short-flow confirmation,
- bullish reversal at extreme low + declining short pressure may differ from reversal with increasing short pressure.

### Existing evidence boundary
Current project external short evidence distinguishes real shorting flow from generic securities lending.
Preserve source semantics; missing = UNKNOWN.

## DL-002DB — Episode-Aware Purged Walk-Forward Validation

### Why existing purging must be extended for pattern episodes
The project already purges training observations whose D+N outcome window crosses into holdout.
Pattern research adds another dependence:
- the same episode can span training and holdout dates.

### Split rule
A pattern episode must belong to one side of a validation boundary.

If:
- episode starts in training,
- but remains active/matures/breaks out in holdout,
then do not allow different daily snapshots of that episode to appear on both sides.

### Purge unit
Purge based on:
max(
  forwardOutcomeHorizon,
  episodeOverlap,
  detectorConfirmationLag
)

### Walk-forward sequence
For each fold:
1. discovery/training period,
2. purge/embargo boundary,
3. untouched validation/holdout period,
4. advance chronologically.

Never random-shuffle stock-day rows.

### Parameter discipline
Geometry definitions frozen before holdout.
If a parameter is tuned within training:
- it must be selected inside nested training only,
- holdout remains untouched,
- tuning family counts toward multiple testing.

### Group integrity
Keep together:
- same patternEpisodeId,
- same event cluster where practical,
- overlapping parent/child episode family.

### Reports
- train unique dates/episodes
- purged rows/episodes
- holdout unique dates/episodes
- overlap check = zero
- horizon used
- detector version

## DL-002DC — Rare-Pattern Evaluation: Base Rate Matters

### Problem
Some mature patterns may be rare.
Accuracy can be meaningless:
if only 5% of candidates succeed under a definition, a trivial model can look accurate by predicting “no event.”

### Metrics for pattern presence/value
- prevalence
- conditional success/failure rate
- lift vs matched base rate
- risk difference
- odds/risk ratio where appropriate
- precision / recall for breakout/failure events
- PR-AUC for rare binary outcomes if modeling
- calibration by confidence bucket
- coverage-adjusted utility

### Trading-oriented outcomes remain primary
Do not replace:
- D1/D3/D5/D10
- MFE/MAE
- R01
- stop-first
with classification metrics.

### Confidence calibration
If geometryFitConfidence increases from low -> medium -> high:
outcomes should improve monotonically/stably if the confidence measure has predictive meaning.

Otherwise:
confidence is only shape-fit, not useful ranking information.

## DL-002DD — Statistical vs Economic Significance

### Rule
A tiny stable return difference can be statistically significant but economically irrelevant after:
- spread,
- slippage,
- turnover,
- opportunity cost.

A larger raw difference can also be unreliable if driven by few dates.

### Report both
STATISTICAL:
- date/episode robust uncertainty,
- holdout direction,
- multiple-testing adjusted evidence.

ECONOMIC:
- D5/D10 difference,
- MFE/MAE shift,
- stop-first reduction,
- turnover/cost,
- additional eligible candidates,
- zero-pick/capital-utilization impact.

### Formal-review relevance
Only evidence that is both robust and economically meaningful can become an optimization candidate.



## DL-002DE — Fugle Research Data Capability Audit (2026-09-27)

### Official historical-candle capability
Fugle Historical Candles supports:
- daily / weekly / monthly OHLC,
- volume,
- turnover,
- change,
- adjusted=true/false,
- listed/OTC daily history back to 2010,
- each request range < 1 year,
- historical intraday candles from 2023-05-23.

### Consequence
DL-002 daily morphology data requirements are technically source-feasible:
- raw O/H/L/C,
- adjusted O/H/L/C,
- volume,
- turnover,
- >=120 trading bars.

The blocker is current system storage/schema, not source availability.

### Point-in-time caution
Current query of an adjusted historical series may reflect the vendor's current corporate-action adjustment state.
For research:
- preserve raw OHLC,
- preserve adjusted OHLC,
- preserve fetch timestamp and adjusted flag,
- use explicit corporate-action tags when crossing events,
- avoid claiming exact historical nominal pivot levels from a retrospectively adjusted series.

Morphology ratios on a consistently scaled pre-event segment can remain stable, but raw executable levels must always come from raw prices.

### Data provenance fields
- source = FUGLE_HISTORICAL_CANDLES
- fetchedAt
- adjusted
- fromDate
- toDate
- timeframe
- fieldsRequested
- apiVersion

## DL-002DF — Prospective True Intraday Volume-at-Price Capture

### Official capability
Fugle Intraday Volumes provides current-day price-level distribution:
- price,
- cumulative volume at price,
- volumeAtBid,
- volumeAtAsk.

The documentation notes bid/ask classified volume excludes the opening first transaction, so volumeAtBid + volumeAtAsk can differ from total volume.

### Critical limitation
The endpoint is intraday/current-day oriented and does not expose a historical-date parameter.

Therefore:
- TRUE historical volume-at-price before capture start remains unavailable from this endpoint,
- prospective Pattern Shadow can capture it from now onward on selected research observations.

### Prospective fields
- snapshotDate
- symbol
- capturedAt
- priceLevel
- volumeAtPrice
- volumeAtBid
- volumeAtAsk
- openingTradeExcludedFromSideClassification = true
- sourceSemanticsVersion

### Research-derived zones
Only after capture:
- intradayPOCPrice
- highVolumeNodes
- lowVolumeNodes
- bidAskImbalanceByPrice
- volumeConcentrationNearPivot
- volumeAboveBelowPivot

### Interpretation boundary
These are transaction-distribution features for that captured day.
They are NOT shareholder cost basis and NOT institutional cost.

### Sampling priority
Do not capture full-market price-level data if resource-heavy.
Prospective research candidates can include:
- Formal SELECTED,
- Near-miss high Pattern Maturity,
- matched controls,
using a pre-registered sampling rule.

No decision impact.

## DL-002DG — Historical Intraday Counterfactual Replay vs Actual Live Signals

### Opportunity
Fugle historical intraday candles are available from 2023-05-23.
This can support historical replay of:
- 15m bars,
- 10m bars,
- breakout/retest paths,
- completed-bar semantics.

### Strict semantic split
ACTUAL_LIVE_EVIDENCE:
- recorder/monitor event genuinely observed by the production system at the time.

COUNTERFACTUAL_REPLAY:
- later reconstruction using historical market data and frozen rules.

Never label replay as:
“the system sent BUY that day”
or
“a historical live signal existed.”

### Replay questions
Given a frozen historical plan available at that date:
- would the current/frozen 15m rule have triggered?
- at what first observable completed bar?
- what was the counterfactual entry?
- did no-retest continuation occur?
- did retest confirmation reduce failure or miss winners?

### Anti-lookahead requirements
- plan parameters must be truly historical/as-of-date,
- only intraday bars up to each decision timestamp can be used,
- current rule version must be recorded,
- if replay uses a rule not deployed historically, label CURRENT_RULE_REPLAY or RULE_VERSION_X_REPLAY.

### Missing-plan boundary
Do not reconstruct an old Formal plan from future-selected winners merely to create replay samples.
Eligible replay requires:
- durable historical SELECTED/Shadow plan,
or
- a clearly defined independent historical research cohort.

### Relation to B-128/B-129 recorder limitation
Replay can provide counterfactual Execution research where actual recorder coverage is UNKNOWN.
It cannot convert UNKNOWN live evidence into historical ACTUAL BUY/NO-BUY.

## DL-002DH — Historical 1m-to-15m Reconstruction Integrity

### Aggregation
When replaying historical intraday data:
- aggregate only completed 1m bars into exact exchange-aligned 10m/15m windows,
- preserve first/last timestamps,
- validate OHLC ordering and summed volume,
- do not use partial final bars.

### Session rules
Respect:
- trading session boundaries,
- auction/opening mechanics,
- halts where observable,
- continuous-trading regime.

### Reconciliation
Where Fugle directly supplies historical 15m bars and 1m data exists:
compare:
- direct 15m endpoint,
- reconstructed 1m->15m.

Differences must be investigated before large-scale replay.

### Output provenance
- sourceTimeframe
- targetTimeframe
- reconstructionMethod
- barCount
- reconciliationStatus



## DL-002DI — Rounding-Bottom / Saucer Counterevidence

### Important falsification evidence
Zapranis & Tsinaslanidis (Expert Systems with Applications, 2012) developed a rigorous rule-based detector for rounding bottoms (saucers) and resistance levels in U.S. tech stocks.

Their reported results:
- simple resistance levels outperformed saucer patterns,
- statistically significant excess returns appeared only in earlier subperiods,
- the saucer edge declined or disappeared in more recent portions of their sample.

### Research implication
Do not grant “rounded cup / saucer shape” an intrinsic premium merely because it is visually appealing.

For DL-002 cup research, test in this order:
1. resistance/rim structure,
2. right-side recovery,
3. handle/compression,
4. only then bottom roundness.

### Falsification criterion
If bottomRoundnessScore adds no incremental outcome information after:
- rim/zone geometry,
- recovery path,
- duration,
- volatility,
- handle state,
then roundness is REDUNDANT / INTERPRETABILITY_ONLY.

### Time-decay warning
Even a historically documented pattern can decay.
Any positive result must survive:
- later subperiod,
- modern Taiwan regime,
- prospective Shadow.

## DL-002DJ — Detector Perturbation / Jitter Robustness v0.1

### Goal
A meaningful pattern should not disappear because one historical bar shifts by one tick or one pivot moves by one day, unless that move truly changes topology.

### Perturbation tests
Without using forward returns, perturb inputs within market-plausible bounds:
- +/- 1 tick on selected pivot prices,
- +/- small fraction of lagged ATR,
- shift a confirmed pivot date by one bar where ties/near-ties exist,
- remove one non-anchor bar,
- vary adjacent swing scale (MICRO/BASE/MAJOR).

### Robustness fields
- patternSurvivalRate
- stateSurvivalRate
- pivotDispersionUnderPerturbation
- zoneDispersionUnderPerturbation
- maturityDispersion
- familyLabelStability
- latentPrimitiveStability

### Interpretation
HIGH_ROBUSTNESS:
same core topology survives small perturbations.

BOUNDARY_CASE:
pattern classification flips under small changes.

### Rule
Boundary cases remain valid observations but carry lower geometry stability.
Do not silently move thresholds to rescue them.

### No outcome tuning
Perturbation magnitude is based on tick/ATR mechanics, not chosen by future performance.

## DL-002DK — Missing Bars / Suspensions / Calendar Gaps

### Problem
Stock-specific trading suspension or missing source bars creates a difference between:
- calendar duration,
- observed trading-bar duration.

A 30-calendar-day handle with 10 missing trading days is not equivalent to 30 actively traded sessions.

### Fields
- observedTradingBars
- calendarDays
- missingExpectedBars
- maxCalendarGapDays
- suspensionOrMissingDataFlag
- continuityStatus

### Pattern-duration rule
Primary morphology duration uses observed completed trading bars.
Also retain calendar duration/gaps as context.

### Data-quality states
COMPLETE
KNOWN_SUSPENSION
SOURCE_MISSING
UNKNOWN_GAP

Known suspension should not be interpreted as low-volume compression.

### Maturity effect
A pattern spanning a long suspension may require:
- post-resumption revalidation,
rather than carrying pre-suspension maturity forward unchanged.

### Formal impact
None. Research integrity only.

## DL-002DL — Adjusted/Raw Price Duality and Vintage Safety

### Purpose
Use adjusted series for continuous morphology while preserving raw prices for executable levels.

### Storage
For each bar:
- rawOpen/High/Low/Close
- adjustedOpen/High/Low/Close
- adjustmentFlag
- fetchedAt
- corporateActionTag if known

### Derived-level rule
Morphology level:
- computed on adjusted series.

Execution/reference level:
- mapped/stored in raw nominal price terms for that historical date.

### Vintage warning
Vendor-adjusted history may be revised after later corporate actions.
Therefore:
- never claim that a retrospectively downloaded adjusted nominal price was the literal number traders saw then,
- use raw series for literal historical traded prices,
- use adjusted series for scale-consistent shape/returns,
- record fetch vintage.

### Strongest future design
Prospective Pattern Shadow should snapshot raw + adjusted inputs on the day so later re-fetch revisions can be detected.



## DL-002DM — Temporal Stability / Edge-Decay Governance

### Conflicting high-quality evidence
Evidence on technical predictability is not one-directional:

NEGATIVE / caution:
- A true fresh-data out-of-sample study of classic technical rules finds little/no predictive ability when exact historically successful rules are carried forward, strongly warning about sample-selection/data-mining bias.
- Asian-market data-snooping studies using Reality Check / SPA show many apparent technical profits weaken after correcting multiple testing, non-synchronous trading and costs.
- Rule profitability can be episodic and decay over time.

POSITIVE / modern:
- 2023 Global Finance Journal evidence finds a set of technical indicators retains cross-sectional return information after standard controls.
- 2024 JFE “Charting by machines” finds nonlinear price-path information distinct from standard momentum/reversal/technical signals.
- Some literature finds useful technical information shifts across frequency rather than disappearing entirely.

### DL-002 conclusion
Never ask:
“Does technical analysis work?”

Ask:
“Does this frozen morphology feature have incremental value in this market, timeframe and regime, now?”

### Temporal-stability reports
For each mature candidate feature:
- effectByYear
- effectByRegime
- effectByRollingWindow
- effectByMarketStructureEra
- recentHalfVsOlderHalf
- prospectiveVsHistoricalReplay
- detectorVersionStability

### Edge-decay states
STABLE
RECENTLY_STABLE
DECAYING
REGIME_SPECIFIC
UNSTABLE
INSUFFICIENT_DATA

These are research labels only.

### Promotion requirement
A candidate with strong old-history evidence but weak recent/prospective evidence cannot be proposed for Formal promotion merely because full-sample average is positive.

## DL-002DN — Frequency Migration: Daily Selection vs Intraday Execution

### External prior
Some studies find daily technical-rule performance decays while higher-frequency variants remain informative; other modern work emphasizes high-frequency intraday structure.

### Project relevance
Current architecture already separates:
- daily selection,
- 15m formal execution,
- 10m auxiliary.

This is an advantage.

### Research question
If a daily pattern is mature but its standalone D5 edge is modest, can it still improve:
- which intraday setups deserve monitoring,
- how 15m confirmation is interpreted,
without becoming a daily hard gate?

### Candidate architecture
DAILY_MORPHOLOGY:
context / structural map.

15M_EXECUTION:
entry acceptance / retest / failure.

Do not collapse daily and 15m into one opaque score.

### Tests
1. daily pattern alone,
2. 15m execution alone within historical eligible plans,
3. daily pattern × 15m execution interaction.

### Interpretation
If interaction is strong but daily main effect is weak:
pattern may be an execution-context enhancer rather than a selector.

This is useful because it avoids unnecessarily narrowing Formal after-market selection.

## DL-002DO — Historical Replay vs Prospective Evidence Weight

### Evidence hierarchy
Highest for current optimization:
1. prospective Pattern Shadow under frozen definitions,
2. untouched chronological holdout,
3. historical as-of-date replay with clean PIT data,
4. older external literature,
5. practitioner examples/anecdotes.

### Rule
Large historical replay N does not outweigh a contradictory prospective sample automatically.

### Reconciliation
If historical replay positive but prospective weak:
status = NOT_REPLICATED / WAITING_MORE_DATA.

If prospective positive but historical mixed:
investigate regime/frequency differences before promotion.

## DL-002DP — Modern Evidence Does Not Rescue Poorly Specified Old Patterns

### Principle
“Charting by machines works” cannot be used as blanket proof that:
- cup-with-handle,
- VCP,
- Sakata,
- any chosen named pattern,
works.

Modern ML evidence supports existence of nonlinear price-path information.
Each named pattern still requires its own incremental validation.

### Reverse implication
If a named pattern fails, that does NOT prove all price-path information is useless.
Its primitives or other nonlinear geometry may still contain information.



## DL-002DQ — Formal 15m Volume Baseline Creates an Early-Session Observability Gate

### Direct source-code finding
Current buildBar(frame) computes 15m/10m volumeRatio only when five PRIOR bars exist:
- index >= 5,
- avg5Volume = previous 5 bars,
- volumeRatio = current volume / avg5Volume.

Current B breakout confirmation requires:
- close >= breakout*1.003,
- volumeRatio != null,
- volumeRatio >= 1.3,
- strongClose,
- upperShadowRatio < 0.45.

Therefore the first five completed bars of the day can never satisfy the Formal B breakout-volume condition because volumeRatio is null.

### Timing implication for 15m
Assuming normal 09:00 session-aligned 15m bars:
- bars 1-5 cannot have 5-bar baseline,
- bar 6 is the first bar with volumeRatio.

This creates an explicit early-session observability/eligibility delay for B breakout confirmation.

A pullback A can be delayed further because the BUY path uses:
- previous bar volumeRatio <= 0.9,
- then latest higher-low/turn-up confirmation.

### Why this may matter
Taiwan intraday research documents strong time-of-day seasonality:
- opening volume/volatility is unusually high,
- informative trading is concentrated near open in older samples.

Thus the first usable trailing-5 baseline can itself contain high opening volume, potentially making a later-morning 1.3x “attack volume” threshold harder to reach.

### This is NOT yet a flaw conclusion
Possible benefits:
- naturally filters noisy opening bursts,
- requires enough intraday history before acting,
- may reduce false breakouts.

Possible costs:
- misses strong early breakouts,
- contributes to sparse BUY signals,
- trailing-5 baseline has time-of-day composition bias.

Both must be measured.

### Status
HIGH_PRIORITY_EXECUTION_RESEARCH_CANDIDATE.
No Formal change.

## DL-002DR — Intraday Time-of-Day Normalized Volume Research

### Problem
Raw trailing-5 volume ratio compares a bar with the immediately preceding 75 minutes (for 15m), but intraday expected volume is not stationary across the session.

### Alternative research baselines
Do NOT replace Formal baseline.
Replay alternatives descriptively:

A. CURRENT_TRAILING5
- existing Formal definition.

B. SAME_SLOT_HISTORY
- current 15m volume / median or mean volume for the same clock-time slot over prior N trading days.

C. INTRADAY_PARTICIPATION
- current cumulative/slot volume relative to stock-specific historical participation curve.

D. HYBRID
- trailing-5 abnormality + same-slot abnormality.

### Pre-registration
Use a small fixed family, not many N values.
Candidate history windows can be frozen before outcomes, e.g.:
- 20 prior trading days as primary,
- 60 as robustness,
not outcome-optimized.

### Fields
- trailing5VolumeRatio
- sameSlotVolumeRatio20
- sameSlotVolumeRatio60
- timeOfDayExpectedVolume
- volumeSurpriseSameSlot
- barSlotIndex
- minutesFromOpen

### Key questions
1. How often does existing B reject an otherwise qualifying breakout solely because trailing5 volume <1.3?
2. Are those rejected bars abnormal vs same-time historical baseline?
3. Does same-slot normalization improve R01/D5/MFE without increasing false breakouts?
4. Does it materially increase BUY coverage?
5. Are effects concentrated in early session?

### Formal-change gate
Any actual modification to the >=1.3 rule/baseline is Class C and requires owner approval after mature evidence.

## DL-002DS — Early Breakout Opportunity-Cost Cohort

### Cohort
Historical/as-of plans where price makes first valid pivot/breakout attempt before Formal 15m volumeRatio becomes available.

Classify:
EARLY_BREAKOUT_CONTINUES
- never gives Formal later retest entry yet produces large MFE.

EARLY_BREAKOUT_RETESTS_LATER
- early move later returns and Formal can enter.

EARLY_BREAKOUT_FAILS
- opening/early move reverses.

EARLY_BREAKOUT_NEUTRAL

### Outcomes
- firstBreakoutTime
- firstFormalVolumeAvailableTime
- MFE before Formal eligibility
- MAE
- laterRetestAvailable
- eventualFormalReplaySignal
- D1/D3/D5
- R01

### Research purpose
Quantify the exact tradeoff:
opening-noise protection vs missed early continuation.

This directly relates to the current BUY-sparsity research funnel.

## DL-002DT — Current Pullback-A Intraday Volume Delay

### Current rule path
A BUY can require:
- previous entered buy zone,
- previous held,
- previous volumeRatio <= 0.9,
- previous reversal/strong close,
- latest higher low,
- latest turn-up.

Because previous volumeRatio needs its own 5 prior bars, a fully qualified A sequence cannot generally occur in the earliest bars.

### Research questions
- earliest possible A BUY by clock time under current data construction,
- distribution of actual/counterfactual A signal time,
- missed early reversal MFE,
- false signals avoided by waiting.

### No assumption
Later confirmation may be desirable.
The issue is to measure, not loosen.


## DL-003W — Cross-Lane Reconciliation + Source-Semantic Falsification (2026-09-27)

### 1. Canonical ownership correction
The newly noted 15m same-slot volume / early-session observability issue overlaps materially with the dedicated Price-Volume lane.

Canonical ownership:
- PRICE_VOLUME_CHECKPOINT.md / PV Shadow owns same-slot RVOL, cumulative-volume pace, response/acceptance/persistence and 15m volume-seasonality research.
- Pattern lane may consume clean PV fields later as controls/moderators only.

Therefore prior K-line notes DL-002DQ..DT are CROSS-LANE POINTERS, not separate Pattern hypotheses and not independent experiment counts.

Pattern must not fork an alternative same-slot volume specification.

### 2. Corporate-action endpoint has future-event visibility
Fugle Corporate Actions dividend/capital-change endpoints allow queries containing future dates and can return announced future event rows.

Point-in-time hazard:
a present-day research pull may expose an event that had not been known at a historical decision timestamp.

Rule:
- TECHNICAL_CONTINUITY adjustment may apply only to events effective on/before the as-of date under a verified event contract.
- An event with future effective/ex-date must never be used as a historical predictor unless a separate point-in-time announcement/availability timestamp proves it was known then.
- eventDate <= asOfDate is safe for realized mechanical continuity processing; it does NOT prove earlier announcement knowledge.

### 3. Corporate-action data is not a complete historical session calendar
Capital-change rows expose haltDate/resumeDate for covered capital events.

This can validate those event-specific non-trading intervals, but:
- it does not enumerate all possible suspension/halt causes,
- current intraday/tickers?isHalted is current-state metadata, not a historical symbol-session archive.

Therefore historical symbol-session completeness remains a distinct dependency.

### 4. Cross-source volume-unit mismatch
Official Fugle Historical Candles docs define:
- regular-stock daily/weekly/monthly volume in shares,
- intraday candles in lots for regular stocks.

Existing Pattern FCNT000002 real-source QA found that source's volume is lots.

Consequences:
- field name volume is not a unit contract,
- source adapter must carry volumeUnit,
- conversion is permitted only when security/session semantics make it valid,
- zero lots with positive amount can represent sub-lot/odd-lot activity and must not become zero trading.

Required fields:
- volumeRaw
- volumeUnit
- volumeSharesComparable
- volumeMagnitudeReady
- volumeSubLotRemainderRisk
- sourceId

### 5. Fail-closed semantics
Pattern context requiring exact volume magnitude is BLOCKED when:
- source unit unknown,
- stock unit changes across capital action without verified continuity,
- sub-lot activity can make lot volume misleading,
- symbol session is unverified where source pseudo-bars exist.

This invalidates the Pattern volume interpretation only; it does not invalidate the Formal stock.

### 6. Data-source hierarchy
For Pattern research:
RAW_EXECUTION:
- verified raw traded OHLC source + exact source semantics.

TECHNICAL_CONTINUITY:
- Corporate Actions lane semantic transform/provenance.

VOLUME:
- source-specific unit contract + session membership + supply/unit-change semantics.

Do not create a new Pattern-owned corporate-action engine.

### Status
OUTCOME_BLIND_SOURCE_QA_PROGRESS.
Pattern alpha remains UNKNOWN.
Formal Core unchanged.

## DL-003X — Symbol-Session Provenance / Exchange-Mechanism Boundary (2026-09-27)

### 1. Market trading date is not symbol-session eligibility
A valid TWSE/TPEx market trading date does not prove one security had an ordinary tradable session.

Pattern/PV/Execution must distinguish:
- MARKET_OPEN_DATE: exchange calendar open;
- SYMBOL_SESSION_ELIGIBLE: the security was eligible to trade in the relevant mechanism/time interval;
- SYMBOL_SUSPENDED: official suspension/stop;
- SYMBOL_RESUMED_SPECIAL: resumed under special collection/matching mechanics;
- SESSION_DELAYED_OPEN;
- SESSION_DELAYED_CLOSE;
- SESSION_VOLATILITY_INTERRUPTION;
- SESSION_PROVENANCE_UNKNOWN.

### 2. TWSE historical suspension source
TWSE official historical Suspended Securities query explicitly states data is available from 2011-10-03.

Implication:
- for strict TWSE symbol-session provenance, dates before 2011-10-03 are not automatically covered by that historical source;
- 2010 through 2011-10-02 Pattern studies must be marked SESSION_HISTORY_COVERAGE_LIMITED unless another authoritative source closes the gap;
- provider candle presence/absence cannot substitute for official session membership.

### 3. TPEx historical suspension/resumption source
TPEx official historical halt page exposes security code/name plus suspension date/time and resumption date/time.

Use it as an official TPEx symbol-session evidence source where date coverage is available.
Do not infer unverified earliest coverage; store sourceCoverageStart = UNKNOWN until independently established.

### 4. Mid-session resumption is not an ordinary continuous session
TWSE official rules state that after a security resumes ordinary trading, orders are first collected and the first match occurs 30 minutes later by call auction before continuous trading resumes.

Therefore a resumption-day intraday bar can mix:
- no-trade suspension interval;
- reopening order-collection interval;
- reopening call-auction print;
- later continuous trading.

It must not be compared blindly with an ordinary same-clock-time 15m baseline.

### 5. Security-specific delayed open/close
Modern TWSE/TPEx price-stability rules can delay one security's opening by 2 minutes when pre-open simulated-price instability or qualifying cancellation/modification conditions trigger.
Closing can also be delayed to 13:33 under the closing stability rule.

Thus:
- expectedFirstRegularMatchAt is security/session specific;
- expectedCloseAt can be 13:30 or 13:33;
- absence of a 09:00 print is not automatically missing data;
- a closing bar that extends through delayed close cannot be treated as a standard fixed-duration bar without a guard.

### 6. Cross-lane ownership
Pattern does NOT own intraday auction/VI/session-normalization logic.

Canonical responsibilities:
- Price-Volume lane: same-slot RVOL, cumulative pace, pvSessionPhase, pvGuardState, AUCTION_MIXED/PRICE_CENSORED interpretation;
- Microstructure lane: continuous-vs-auction/volatility-interruption mechanics and execution-state semantics;
- Pattern lane: consume verified session/guard semantics and block geometry/volume interpretation when required.

### 7. Pattern daily-bar behavior
For daily morphology:
- a verified full-session suspension date is not a zero-range/zero-volume candle;
- provider pseudo-bars on suspended dates must be removed/blocked from continuity geometry;
- observed-trading-bar duration counts eligible trading observations, not calendar days;
- resumption/corporate-action boundaries require TECHNICAL_CONTINUITY provenance.

### 8. Pattern intraday behavior
If Pattern later consumes intraday execution context, each bar needs at minimum:
- symbolSessionState;
- firstTradeAt / lastTradeAt when available;
- sessionPhase;
- auctionMixed;
- volatilityInterruptionState;
- barDurationActual;
- sessionProvenanceSource.

Missing reliable mechanism provenance => GUARD/UNKNOWN, not NORMAL_MARKET.

### 9. Outcome-blind status
This resolves part of the symbol-session source design but does not make Pattern runtime-ready.
Alpha remains UNKNOWN; no outcome inspection; no Formal change.

## DL-003Y — Trading-Unit / Volume-Unit Provenance (2026-09-27)

### 1. Ordinary-stock rule is broad but not a sufficient historical adapter contract
Current TWSE rules state ordinary listed stocks are generally 1 trading unit = 1,000 shares.
Current TPEx mainboard rules likewise state ordinary securities are generally 1,000 shares/units per trading unit, with stated exceptions.

However, TPEx market-data technical specifications explicitly carry a trading-unit field and document that a value such as 500 means one trading unit represents 500 shares.

Therefore:
- market rules support 1,000 as the common case;
- source metadata proves that trading unit is still a first-class data field;
- a research adapter must not hard-code 1,000 as a timeless universal conversion rule.

### 2. Fugle ticker metadata does not expose tradingUnit
Fugle intraday/ticker documents exchange, market, securityType, reference/limit prices and other attributes, but no tradingUnit field.

Therefore Fugle ticker alone cannot establish point-in-time lot-to-share conversion.

### 3. Required volume contract
For every volume-bearing source, persist:
- volumeRaw;
- volumeUnit: SHARES | LOTS | UNKNOWN;
- sharesPerTradingUnit;
- sharesPerTradingUnitSource;
- sharesPerTradingUnitAsOf;
- volumeSharesComparable;
- conversionConfidence;
- subLotRemainderRisk;
- sourceId.

### 4. Conversion rule
LOTS -> SHARES conversion is allowed only when sharesPerTradingUnit is verified for the security/date/mechanism.

If unverified:
- retain raw lots;
- set volumeSharesComparable = UNKNOWN;
- block any Pattern statistic that requires cross-date/share-magnitude comparability;
- allow price-only geometry to continue when other semantics are valid.

### 5. Odd-lot/sub-lot handling
A regular-lot source can report zero lots even when positive traded amount exists through sub-lot/odd-lot activity.

Therefore:
- zero regular-lot volume != zero trading;
- do not classify such a bar as perfect volume dry-up;
- preserve amount/odd-lot evidence and set subLotRemainderRisk.

### 6. Cross-lane ownership
Trading-unit/corporate-action semantics should be sourced from the Corporate Actions / market-data semantics lanes.
Pattern consumes the verified conversion result and must not invent a separate adjustment/unit engine.

### 7. Status
This tightens the remaining VOLUME semantic blocker.
Pattern runtime remains NO_GO; alpha UNKNOWN; Formal Core unchanged.

## DL-003Z — Pattern Parent Provenance Reconciliation (2026-09-27)

### New cross-lane falsification
Later global research has proven that legacy trade_research_shadow_candidates is not promotion-grade immutable parent evidence.

Known limitations:
- primary key scan_date + symbol;
- one mutually exclusive cohort field;
- bounded REJECTED_AFTER_BASE sampling;
- same-date DELETE then row-by-row INSERT/UPSERT rewrite;
- no immutable generation / semantic fingerprint parent;
- one-symbol used-set can cause research memberships to displace one another;
- bounded reader with LIMIT 5000, no pagination, no truncation flag and potential partial-date loss.

### Consequence for Pattern observer design
The frozen Pattern persistence contract's parent_snapshot_hash is necessary but not sufficient if the parent population itself can be rewritten or incompletely read.

Pattern must distinguish two evidence grades:

LEGACY_PARENT_QA:
- existing Shadow archive may be used for detector/data QA and non-promotion descriptive work when exact captured parent hash is preserved;
- cannot claim complete historical cohort population merely from current archive readback.

IMMUTABLE_PARENT_REQUIRED:
- prospective promotion-grade Pattern evidence must attach to the future immutable per-symbol decision-state receipt/generation architecture;
- Pattern child must reference parentDecisionReceiptId + captureGeneration + semantic fingerprint;
- overlapping Pattern memberships cannot mutate/displace the parent decision state.

### Parent population completeness
A Pattern run receipt may declare COMPLETE only if its expected parent population came from a completeness-proven generation.

Forbidden:
- derive expectedParentCount from a reader known to be truncated;
- treat LIMIT 5000 return as complete;
- accept a partial date;
- silently ignore symbols omitted by bounded legacy cohort sampling.

Required parent receipt fields:
- decisionGenerationId;
- scanDate;
- expectedSymbolCount;
- persistedSymbolCount;
- completeDate;
- comparator/formal-version identity;
- source semantic fingerprint;
- parentDecisionReceiptId per symbol;
- capturedAt;
- completenessStatus.

### Pattern child identity revision
Future promotion-grade child key should include:
- parentDecisionReceiptId;
- captureGeneration;
- symbol;
- asOfDate;
- detectorVersion;
- semanticContractVersion.

Natural scan_date+symbol remains descriptive compatibility only, not sufficient immutable identity.

### Historical limitation
Do not retrofit immutable parent status onto legacy Shadow rows.
Historical rows remain LEGACY_MUTABLE_ARCHIVE unless independent first-known generation evidence exists.

### Governance
This is an architecture/provenance finding only.
Implementing immutable shared-runtime persistence is Class B proposal-first.
No runtime implementation is authorized by this note.

### Status
PATTERN_PARENT_PROVENANCE = LEGACY_QA_OK / PROMOTION_GRADE_BLOCKED.
Pattern alpha remains UNKNOWN; Formal Core unchanged.


## DL-004A — Volume-at-Price / Cost-Zone Research Boundary (2026-09-27)

### Question
Can historical trading concentration by price improve support/resistance interpretation beyond swing zones and round-number clustering?

### Evidence
Practitioner Volume Profile tools are explicitly reactive: they show where trading activity previously concentrated by price. This is useful as structural context, but not itself forward-looking proof.
Taiwan empirical evidence provides a stronger microstructure prior: limit-order prices cluster at integer/round prices, clustering can create price barriers, and investor types differ in clustering behavior. This supports “price zones with concentrated participation” as a plausible mechanism.

### Critical data limitation
Daily OHLCV is insufficient to reconstruct a true historical volume-at-price distribution.
Allocating each day’s entire volume uniformly across high-low, or assigning all volume to close/VWAP, would fabricate microstructure.

Therefore:
- TRUE_VOLUME_PROFILE requires intraday trade/price-distribution data or exchange-grade volume-at-price evidence.
- DAILY_APPROX_PROFILE is allowed only as a clearly labeled weak proxy and cannot be treated as true cost basis.
- If intraday history is unavailable, Pattern research should prefer confirmed swing/round-price zones over invented volume nodes.

### Research objects if reliable data later exists
- pointOfControlPrice
- highVolumeNodes[]
- lowVolumeNodes[]
- valueAreaLow / valueAreaHigh
- nodeAge
- nodeTurnover
- currentPriceVsNode
- patternPivotCoincidesWithHVN
- breakoutIntoLVN
- retestAtHVN
- nodeMigrationOverTime

### Hypotheses
1. Breakout into a low-volume area may move faster because less historical inventory is concentrated overhead.
2. A high-volume node may behave as acceptance/fair-value area rather than always support/resistance.
3. Pattern pivot overlapping a round-price + swing-zone + historical high-volume node may be structurally stronger, but this is a confluence hypothesis, not a guaranteed barrier.
4. A node’s meaning may flip only after price acceptance/retest; role reversal must remain state-based per DL-002BH.

### Anti-storytelling rule
Do not call a high-volume node “institutional cost” unless actual investor-position/cost data supports that statement.
Volume at price = historical traded activity, not verified current holder cost.

### Status
RESEARCHABLE_WITH_DATA_LIMITATION.
No Formal change.

## DL-004B — Sector/Industry Synchronization as Pattern Context (2026-09-27)

### Taiwan evidence
Peer-reviewed Taiwan evidence finds industry momentum can be hidden in industries with positive return autocorrelation, and turnover/fund transfer helps explain that persistence.
Other Taiwan studies show industry-momentum evidence is sample- and horizon-dependent, so sector strength cannot be assumed universally persistent.

### Existing overlap
Current research already has:
- sector score / breadth,
- Residual RS,
- sector persistence,
- supply-chain research lanes.

Therefore generic “strong sector = plus” is redundant.

### Incremental question
Does the timing of peer/industry pattern maturation relative to the stock’s own pattern matter?

### Fields
- sectorPatternBreadth
- sectorMaturePatternShare
- peerBreakoutShare5d
- peerFailureShare5d
- sectorCompressionShare
- sectorRSChangeDuringPattern
- leaderLagState
- stockVsSectorPatternLeadDays
- supplyChainPatternLeadLag
- sectorTurnoverPersistence

### States
LEADER_EARLY:
- stock pattern matures before sector peers, while sector evidence is improving but not yet broad.

BROAD_CONFIRMATION:
- multiple peers mature/break out within a narrow time window.

LATE_CROWD:
- sector already widely extended/broken out before stock reaches pivot.

ISOLATED_STOCK:
- stock pattern matures while sector peers weaken/fail.

### Competing hypotheses
H1 Broad confirmation improves follow-through.
H2 Early leaders outperform because broad confirmation arrives too late.
H3 Late-crowd setups carry overheat/attention risk.
H4 Isolated strength may be idiosyncratic alpha or simply fragile noise.

Do not assume H1 wins.

### Same-date controls
Compare stocks within the same sector/date:
- early leader vs late follower;
- broad-confirmed vs isolated;
- peer success vs peer failure context.

### Redundancy
Test after controlling sector score, Residual RS, market regime and stock pattern maturity.

### Status
WORTH_SHADOW_RESEARCH.

## DL-004C — Pattern Complexity / Entropy Without Mysticism (2026-09-27)

### External prior
Entropy research finds nonlinear dependence can exist in stock returns while economically exploitable conditional predictability remains fragile.
This is a useful warning: “complex-looking path” and “predictable/profitable path” are not synonyms.

### Question
Does path complexity itself distinguish organized accumulation from noisy/random-looking bases?

### Candidate diagnostics
- returnSignEntropy
- swingDirectionEntropy
- transitionEntropy
- compressionEntropyChange
- pathPermutationEntropy
- rangeStateEntropy
- volumeStateEntropy
- motifDiversity
- reversalDensity

### Mechanism interpretation
LOW complexity can mean:
- clean trend / organized progression;
or
- dead liquidity / mechanically constrained movement.

HIGH complexity can mean:
- healthy two-sided price discovery;
or
- unstable churn/distribution.

Therefore entropy must be conditioned on liquidity, RS, volume and regime.

### Pattern-phase use
Compare entropy from:
- PHASE_1 formation
to
- PHASE_3 trigger zone.

Hypothesis:
Constructive maturation may show falling range/swing complexity while maintaining liquidity and RS.
But if entropy falls because trading dies, classify DEAD_LIQUIDITY instead.

### Relation to existing research
Must test redundancy against:
- DL-001 Information Discreteness,
- Directional Efficiency,
- volatility/ATR,
- reversal count,
- positive-day ratio.

If entropy adds no conditional information, reject it.

### No black-box promotion
Entropy is a diagnostic primitive, not a “smart money score.”

## DL-004D — Complexity Can Help Models, But Pattern Governance Still Prefers Parsimony (2026-09-27)

### Evidence tension
Modern return-prediction research shows flexible/high-dimensional models can outperform simple models in some settings.
At the same time, technical-analysis evidence and factor-zoo research warn that unconstrained complexity creates severe data-snooping and instability.

### Reconciliation
Model complexity and hypothesis complexity are different.

Allowed:
- a flexible model that combines a small, pre-specified set of economically meaningful primitives under strict holdout.

Not allowed:
- hundreds of hand-crafted pattern thresholds selected by best historical D5 outcome.

### Governance rule
The research layer may later test nonlinear combinations of the frozen primitive set, but:
- primitive definitions remain stable;
- training/holdout dates are separated;
- no post-hoc feature generation from holdout failures;
- variable importance/stability must be reported;
- simple benchmark remains mandatory.

### Benchmark stack
B0 existing Formal research fields only.
B1 + frozen DL-002/004 primitives.
B2 nonlinear model over same frozen primitives.

A nonlinear model is only interesting if B2 improves untouched holdout versus B1, not merely in-sample.

## DL-004E — Price Clustering as Structural Zone Provenance, Not a Score (2026-09-27)

### Taiwan evidence
TWSE limit-order studies find:
- price clustering at integer/even/0/5-ending prices;
- clustering differs by investor type and order aggressiveness;
- nonmarketable orders cluster more;
- price clustering can create actual price barriers;
- strategic order placement/front-running appears around clustered prices.

### Pattern implication
A swing pivot near a salient round/tick price may have a plausible order-book mechanism behind repeated reactions.

### Required fields
- zoneRoundnessClass
- distanceToNearestClusterPriceTicks
- repeatedClusteredTouchCount
- clusterBreakAcceptance
- frontRunSideProximity
- clusterCoincidesWithSwingZone
- clusterCoincidesWithPatternPivot

### Critical caution
The clustering studies use limit-order data.
Daily OHLC alone cannot reproduce order-book depth or identify front-running.
Therefore daily Pattern Shadow can tag round-price coincidence, but must not claim actual current queued depth.

### Hypothesis
Round-price coincidence may strengthen zone provenance, but predictive value must be demonstrated prospectively after swing-zone and tick-size controls.

### Status
MECHANISM_SUPPORTED / ALPHA_UNKNOWN.


## DL-004F — Support/Resistance Predictive Value vs Tradable Alpha (2026-09-27)

### External falsification
An empirical study using two decades of adjusted NYSE/NASDAQ daily prices found locally constructed horizontal support/resistance levels could help identify trend interruptions, but did not generate excess returns versus simple buy-and-hold.

### Implication
A structurally meaningful level can be useful without creating standalone alpha.

For Pattern research:
- support/resistance zones may improve state description,
- they may improve risk placement / failure detection,
- but they must not be assumed to increase expected return by themselves.

### Evaluation split
STRUCTURAL_USEFULNESS:
- bounce/rejection probability,
- failure localization,
- stop/retest interpretation,
- role-reversal state.

ALPHA_USEFULNESS:
- incremental D5/D10,
- MFE/MAE,
- R01 failure reduction,
- transaction-cost-adjusted improvement.

A zone feature can pass the first and fail the second.

### Engineering consequence
Even if zones prove structurally useful, they should enter Formal ranking only if alpha/reliability evidence survives the existing maturity gate.
No change now.

## DL-004G — Sector Persistence Must Be Conditional, Not Global (2026-09-27)

### Taiwan evidence
Fu & Kang (2009) report that industry momentum in Taiwan is not uniformly visible across all industries; it appears more strongly in industries with positive autocorrelation, and turnover/fund-transfer behavior helps explain persistence.

### Pattern implication
“Sector confirmation” should not be one universal binary flag.

### Conditional context
For each sector/date estimate research-only:
- sectorReturnAutocorrState
- sectorTurnoverPersistence
- sectorMomentumPersistenceState
- sectorBreadthPersistence
- sectorFailurePersistence

### Hypothesis
A stock pattern inside a sector with currently positive persistence may benefit more from peer confirmation than the same pattern in a mean-reverting sector.

### Counter-hypothesis
Strong sector autocorrelation can be regime-specific and unstable; using long historical autocorrelation may lag turning points.

### Guard
Use rolling/as-of-date estimates only.
Do not label a sector “persistent” from full-sample future data.

## DL-004H — Lead/Lag Inside Sector and Supply Chain (2026-09-27)

### Question
When several related stocks form similar structures, who leads and who follows?

### Research objects
- firstPatternMaturityDate among peers
- firstBreakoutDate
- peerMedianMaturityDate
- leaderLagDays
- leaderRS
- leaderTurnoverAcceleration
- followerEntryRoom
- peerFailureBeforeStockTrigger

### States
TRUE_LEADER:
- matures/breaks early with strong RS and peers later confirm.

EARLY_FALSE_LEADER:
- matures first but peers fail to confirm and stock later fails.

HEALTHY_FOLLOWER:
- peers confirm first, stock still has adequate room and is not overextended.

LATE_FOLLOWER:
- peers already extended while stock only reaches pivot.

### Research question
Does lead/lag position explain outcome after controlling own pattern quality and sector state?

### Supply-chain extension
For linked upstream/downstream firms, keep lead/lag descriptive unless relationship is point-in-time verified.
Do not infer supply-chain causality from price co-movement alone.

## DL-004I — Complexity/Entropy Is a Diagnostic, Not a Shortcut to Predictability (2026-09-27)

### External evidence
Entropy research detects nonlinear serial dependence in returns but finds conditional predictive profitability fragile across model choices and periods.

### Pattern implication
If entropy/complexity looks statistically interesting but does not improve stable out-of-sample outcomes, reject it.

### Required evidence ladder
1. distributional dependence exists;
2. effect survives liquidity/regime controls;
3. effect adds to frozen primitives;
4. effect survives independent dates/holdout;
5. economic magnitude exceeds costs.

Failing any stage prevents promotion.

### Specific falsification
If falling entropy during pattern maturation merely tracks falling ATR, lower reversal count or dead liquidity, classify REDUNDANT.

## DL-004J — Confluence Is Not the Sum of Indicators (2026-09-27)

### Common mistake
Technical systems often “confirm” a setup by stacking:
- pivot,
- round number,
- volume node,
- MA,
- sector strength,
- RS,
- volume,
- pattern label.

Many are correlated manifestations of the same underlying process.

### Confluence framework
For each apparent confirmation, tag provenance primitive:
- PRICE_GEOMETRY
- LIQUIDITY
- ORDER_CLUSTERING
- FLOW
- SECTOR
- REGIME
- EVENT
- EXECUTION_ACCEPTANCE

Count unique provenance families, not raw indicator count.

### Example
Cup rim + priorHigh20 + round price:
- cup rim/priorHigh20 may both be PRICE_GEOMETRY,
- round price is ORDER_CLUSTERING.
This is closer to 2 independent evidence families, not 3.

### Research variable
- rawConfluenceCount
- independentProvenanceCount
- dominantProvenanceShare
- confluenceDiversity

### Hypothesis
Diverse independent provenance may be more informative than many correlated confirmations.

### Counter-hypothesis
Even diverse confluence may simply select already-obvious crowded trades and reduce early-entry advantage.

Test prospectively.



## DL-004K — Pattern Shadow Minimum Viable Research Schema (2026-09-27)

### Goal
Define the smallest isolated research schema that can accumulate prospective Pattern evidence without touching Formal behavior.

### Parent identity
Promotion-grade rows require immutable parent decision provenance:
- parentDecisionReceiptId
- captureGeneration
- scanDate
- symbol
- parentCohort
- parentCompletenessStatus
- formalVersion
- sourceSemanticFingerprint

Legacy mutable Shadow archive may be used only for QA/descriptive work, not promotion-grade evidence.

### Pattern snapshot identity
Primary identity proposal:
(parentDecisionReceiptId, detectorVersion, semanticContractVersion)

Additional:
- asOfDate
- capturedAt
- dataThroughDate
- historyStartDate
- barCount
- sourceCoverage

### Primitive payload
Store compact fields, not huge duplicated chart JSON:
- swingSummary
- zoneSummary
- compressionSummary
- supportProgressSummary
- resistanceSummary
- recoveryShapeSummary
- flowSummary
- timeSummary
- acceptanceSummary
- regime/event/sector context
- data-quality flags

### Named-label payload
- matchedFamilies[]
- maturityByFamily
- fitConfidence
- stabilityConfidence
- adverseMorphologyFlags
- motifStates

### Outcome payload
Append-only or separate child table:
- D1/D3/D5/D10/D20
- MFE/MAE
- R01
- stopFirst
- breakoutLifecycle
- retestLifecycle
- reclaimLifecycle

Original selection-time snapshot must never be overwritten by future outcomes.

### Isolation
No Pattern field is read by:
- formal candidate eligibility,
- formal score/ranking,
- capital,
- buy/add/reduce/sell/stop,
- monitoring eligibility,
- push.

This is the central Class-A isolation invariant.

## DL-004L — Pattern Research Data-Readiness Matrix (2026-09-27)

### Purpose
Avoid pretending a detector is ready when required semantics/data are absent.

### Components
SWING_GEOMETRY:
- requires adjusted OHLC, completed bars, corporate-action semantics.
Status: BLOCKED until research-grade adjusted/open-preserving history is verified.

CANDLESTICK:
- requires historical OPEN + corporate-action handling.
Status: BLOCKED.

LONG_BASE:
- requires > current live ~65-bar horizon.
Status: BLOCKED in live cache; feasible in separate research history.

VOLUME_CONTEXT:
- requires verified volume units/trading-unit provenance and odd-lot semantics.
Status: PARTIALLY_BLOCKED.

SECTOR_CONTEXT:
- requires point-in-time industry mapping and complete peer population.
Status: READY only where provenance is complete.

EVENT_CONTEXT:
- requires first-known event timestamps.
Status: READY only for sources with point-in-time availability metadata.

ZONE/ROUND_PRICE:
- price-only round/tick zone feasible from verified adjusted/raw prices.
- true volume-at-price is BLOCKED without intraday distribution data.

PATTERN_ALPHA:
- requires prospective immutable parent evidence + mature outcomes.
Status: BLOCKED/ACCUMULATING.

### Rule
A detector with missing prerequisite semantics cannot emit FALSE.
It emits UNKNOWN / DATA_BLOCKED.

## DL-004M — Failure-Mode Prioritization for Practical Value (2026-09-27)

### Why prioritize failure filters
The current system’s central problem is sparse BUY/idle capital, so blindly tightening every gate could worsen utilization.
Positive pattern additions risk more Factor-Zoo complexity.

A research-only failure diagnostic may be more useful if it:
- identifies obvious false-breakout conditions,
- does not reject healthy no-retest winners indiscriminately,
- explains R01 failures incrementally.

### Highest-value failure questions
F1 local breakout directly into major resistance zone.
F2 breakout volume shock + poor close + no follow-through.
F3 pattern tightness caused by dead liquidity.
F4 RS/sector deterioration during apparent maturity.
F5 repeated high-volume pivot rejection.
F6 price-limit/corporate-action distortion masquerading as clean geometry.
F7 event-created breakout after extreme pre-event runup.
F8 15m retest rule opportunity cost: false-breakout avoidance vs missed immediate continuation.

### Guard
A failure diagnostic is not an exclusion rule until:
- effect is prospective,
- incremental,
- stable across dates/regimes,
- coverage/zero-pick impact acceptable.

## DL-004N — Candidate Optimization Handoff Criteria for Pattern Research (2026-09-27)

A future FORMAL_OPTIMIZATION_CANDIDATE may be proposed only when all are true:
1. definition frozen before outcome inspection;
2. data semantics READY;
3. immutable prospective parent snapshots available;
4. mature outcome count passes existing gate;
5. independent scan-date count passes;
6. at least two regimes / years as required by governance;
7. purged holdout direction agrees with training;
8. incremental value survives current Formal fields + DL-001 + overlapping DL-002 primitives;
9. transaction cost / slippage relevance checked;
10. coverage and zero-pick impact measured;
11. no single date/sector dominates;
12. simpler baseline cannot explain result.

### Proposal must state
- exact feature/change,
- mechanism,
- evidence,
- counter-evidence,
- expected benefit,
- missed-opportunity cost,
- coverage impact,
- engineering Class,
- rollback/test plan.

Passing this gate only permits a proposal to the owner, not automatic Formal modification.

## DL-004O — Current Pattern Research Conclusion After Deep Dive (2026-09-27)

### What remains most promising
1. topology-aware swing sequence instead of additional moving-average rules;
2. local-vs-major resistance conflict;
3. true W neckline vs crude split-window rightFootHigher;
4. VCP sequential contraction vs generic low volatility;
5. late-stage / failed-breakout morphology;
6. pattern maturity × RS/sector change;
7. execution trade-off around retest vs no-retest continuation;
8. phase-local motifs near trigger zones.

### What is lower priority / likely redundant
- extra moving-average crosses,
- generic volume-confirmation score,
- raw “right foot higher” duplicate,
- generic platform flag,
- raw pattern-name count,
- unconditioned support/resistance touch count,
- round-number proximity by itself,
- entropy by itself.

### What is blocked by data semantics
- historical candlestick/Sakata validation,
- true volume-at-price/cost profile,
- multi-month adjusted topology using current live cache,
- promotion-grade historical Pattern evidence from legacy mutable parent archive.

### Current stance
The deep-dive has NOT produced enough evidence to change Formal Core.
It has materially improved the research specification and falsification plan.

PATTERN_RESEARCH_STATUS = SPECIFICATION_MATURE / DATA_AND_PROSPECTIVE_EVIDENCE_NOT_YET_MATURE.
FORMAL_CORE_STATUS = UNCHANGED.

## Exact continuation point — 2026-09-27

1. Do not restart named-pattern definitions. They are already decomposed and versioned.
2. Next research priority is data-semantic readiness + prospective Pattern Shadow evidence architecture, not inventing more pattern names.
3. First empirical priorities once data is ready:
   a. VCP sequential topology vs generic contraction;
   b. true W neckline vs current proxy;
   c. local-vs-major resistance conflict;
   d. failure-context features for existing B breakouts;
   e. retest opportunity-cost cohort.
4. Use current existing outcomes and cohorts; do not create R09 until features/data are frozen and ready.
5. Keep Formal Core locked.


## DL-004P — Momentum Life-Cycle Context for Pattern Maturity (2026-09-27)

### Taiwan evidence
Taiwan research on the Momentum Life Cycle reports that an “early momentum” portfolio (past winners with relatively lower trading volume) was more profitable/reliable than a late-momentum construction in the tested sample.

### Important counter-evidence
Later international work revisiting the Momentum Life Cycle argues that volume-based stage identification can be partly spurious and that alternative characteristics may classify early/late momentum better.

### Pattern implication
“Low-volume winner = early stage” is NOT a universal rule.
However, the early-vs-late concept remains useful as a research question.

### Pattern-stage variables
- patternMaturityAge
- priorRunup
- turnoverExpansionFromBase
- volumeShockTiming
- RSStage
- sectorCrowding
- limitHitCount
- failedPivotAttempts
- distanceFromMajorBase
- remainingResistanceRoom

### Hypotheses
EARLY_STRUCTURAL:
- maturing topology, improving RS, moderate participation, large remaining room.

LATE_ATTENTION:
- mature/extended topology, high turnover shock, crowded peer breakouts, repeated limit-up/attention events, little remaining room.

### Redundancy
Must be tested against current overheat/lateStage controls, Attention/Quiet research and DL-001.
If stage variables simply reproduce existing overheat, reject them.

## DL-004Q — Persistency Is More Important Than Raw Momentum in Taiwan (2026-09-27)

### External evidence
Pacific-Basin Finance Journal (2023) revisits Taiwan momentum and reports that high turnover among conventional winner/loser portfolios helps attenuate standard momentum, while a persistency-based momentum strategy shows significant intermediate-term profitability.

### Pattern implication
A one-day or one-leg surge is less interesting than persistent structure.

### Research fields
- positiveStructureDayRatio
- persistenceOfHigherLows
- persistenceOfRSImprovement
- persistenceOfSectorConfirmation
- persistenceOfFlow
- singleShockContribution
- largestMoveShareOfPatternReturn

### Link to existing work
This directly reinforces:
- DL-001 gradual/discrete path,
- VCP multi-leg topology,
- phase-specific flow persistence,
- avoidance of one-day event/volume shocks.

### Key falsification
If persistence metrics add no information beyond DL-001 + Residual RS + current trend variables, do not keep a new persistence score.

## DL-004R — Residual Momentum vs Raw Price Momentum as Pattern Context (2026-09-27)

### Evidence
Cross-Asian evidence including Taiwan reports residual momentum to be more consistent than conventional price momentum in the studied markets.

### Existing overlap
Residual RS / Residual Momentum is already an active research lane.
Therefore Pattern should consume it rather than recreate it.

### Incremental question
Does residual-strength trajectory during pattern maturation explain outcomes beyond raw chart geometry?

### Interaction states
GEOMETRY_STRONG_RESIDUAL_STRONG
GEOMETRY_STRONG_RESIDUAL_WEAK
GEOMETRY_WEAK_RESIDUAL_STRONG
BOTH_WEAK

### Hypothesis
A mature pattern with improving residual strength may reflect stock-specific demand rather than market/sector beta.

### Counter-hypothesis
Residual-strength improvement may already be captured by existing selector quality and sector-neutral research.

### Rule
No duplicate Residual Momentum score inside Pattern.

## DL-004S — Sector/Factor Momentum Attribution Before Calling It “Pattern Alpha” (2026-09-27)

### New Taiwan evidence
A 2026 Taiwan master’s thesis studies whether factor momentum can explain short-term industry momentum over 2005-2024.

### Research implication
When many “good patterns” cluster in one industry/factor regime, their apparent success may be driven by common factor continuation rather than pattern geometry.

### Attribution ladder
For any Pattern cohort outcome compare:
1. raw return;
2. market-adjusted;
3. sector-adjusted;
4. residual/factor-adjusted where point-in-time model is valid.

### Question
Does pattern maturity predict residual outcome after common factor/sector continuation is removed?

### Why this matters
Without attribution, a wave of AI-server or ABF names breaking out together could make every chart detector look brilliant even if it only rediscovered the hot sector.

### No causal overclaim
Factor-adjusted performance remains model-dependent; report model/version and never call residual return “pure pattern causality.”

## DL-004T — Early Leader vs Late Follower: Joint Stage Framework (2026-09-27)

### Combine prior findings
Use:
- stock pattern maturity,
- sector pattern breadth,
- sector turnover persistence,
- Residual RS trajectory,
- overheat/attention,
- remaining resistance room.

### Four-stage context
EARLY_LEADER:
stock matures first; residual RS improves; sector begins to strengthen.

CONFIRMED_LEADER:
stock already broke/held; sector breadth confirms; still adequate room.

HEALTHY_FOLLOWER:
sector confirms first; stock maturing with non-extended path.

LATE_CROWD_FOLLOWER:
sector/peers already extended; stock arrives late with high attention/turnover and limited room.

### Key test
Same-date/sector matched comparisons.
Do not infer one stage is best until outcomes mature.

### Practical relevance
This framework may eventually distinguish:
- “主流補漲” that still has room,
from
- “最後一棒” late catch-up.

But it remains Shadow research until prospective evidence passes governance.


## DL-004U — Same-Date Matched-Control Design for Pattern Alpha (2026-09-27)

### Goal
Separate pattern information from market-day effects.

### Why same-date matching matters
If all selected patterns occur during a strong market week, raw forward return overstates pattern-specific value.

### Matching dimensions
For each pattern-strong stock, match controls from the same scan date on:
- market/pool
- price tier
- liquidity tier
- sector where sample permits
- ret20 / ret60
- ATR / volatility
- Residual RS
- market/sector regime
- Formal cohort class

### Comparison hierarchy
1. unmatched raw;
2. same-date matched;
3. same-date + sector matched;
4. partial/residual model;
5. purged holdout.

### Interpretation
Only effects that remain directionally stable across increasingly strict controls are candidates for genuine incremental Pattern information.

## DL-004V — Cross-Sectional Ranking vs Absolute Pattern Thresholds (2026-09-27)

### Question
Should Pattern research eventually use fixed thresholds or relative same-day ranking?

### Risks of fixed thresholds
A “tight” 4% base can mean something different across volatility regimes.

### Risks of cross-sectional ranking
Ranking can force a best stock even when all setups are poor, conflicting with the system’s no-force-fill principle.

### Research design
Compare:
ABSOLUTE_STATE:
- fixed geometry definitions / maturity state.

RELATIVE_QUALITY:
- percentile/rank among same-day eligible universe.

HYBRID:
- absolute minimum state first, rank only among valid cases.

### Guard
No forced selection.
A day can have zero Pattern-valid stocks.

### Hypothesis
Hybrid may preserve regime adaptivity without turning every day into a contest that must produce winners.

## DL-004W — Economic Significance Before Statistical Significance (2026-09-27)

### Problem
A tiny average D5 improvement can be statistically significant in a large sample but useless after:
- spread,
- slippage,
- delayed 15m entry,
- missed no-retest winners,
- stop execution.

### Required outputs
- gross D1/D3/D5/D10
- net after conservative round-trip cost assumptions
- entry-delay adjusted return
- MFE/MAE change
- stop-first change
- coverage change
- capital-utilization change

### Practical criterion
A candidate should improve either:
- expectancy,
- tail/risk behavior,
- or capital utilization,
without unacceptable deterioration elsewhere.

### No one-metric promotion
Higher win rate with much worse average loss is not improvement.
Lower false-breakout rate with severe missed-winner cost is not automatically improvement.

## DL-004X — Pattern Filters Can Worsen Idle-Capital Problem (2026-09-27)

### Context
Current research problem includes sparse BUY signals / idle capital.

### Implication
A new failure filter can look excellent on selected trades while reducing usable opportunities too aggressively.

### Required counterfactual
For every proposed Pattern exclusion:
- how many historical/prospective candidates removed?
- how many losers avoided?
- how many winners lost?
- change in selection coverage?
- change in BUY-trigger coverage?
- change in deployed-capital days?
- replacement opportunity quality?

### Coverage metrics
- candidateRetentionRate
- buyOpportunityRetentionRate
- avoidedFailureCount
- missedWinnerCount
- netMFEContribution
- idleCapitalDaysDelta

### Rule
Pattern research must optimize decision quality AND opportunity preservation, not only precision.

## DL-004Y — Pattern Features for Ranking vs Hard Gates (2026-09-27)

### Research distinction
A useful feature does not automatically belong as a hard rejection rule.

Possible future roles:
1. HARD_GATE — strongest governance burden.
2. SOFT_RISK_PENALTY.
3. TIE_BREAKER.
4. SHADOW_WARNING only.
5. EXECUTION_REVALIDATION context.

### Evidence burden
Hard gate requires evidence that failure risk is strong/stable enough to justify missed opportunities.
Tie-breaker/diagnostic requires less invasive evidence but still must be incremental.

### Likely initial landing zone
If Pattern evidence matures, the safest first proposal may be:
- research-only warning,
- or tie-break/risk context,
rather than rewriting A/B definitions.

No production change is proposed now.


# DL-005 — Core-Family Unification, False-Break Lifecycle, and Sakata Decomposition (2026-09-28)

## DL-005A — Six mandatory D01 themes unified without label voting

This tranche explicitly keeps all mandatory room themes:
- K-line / candlestick morphology;
- Sakata Five Methods;
- W/M;
- Cup / Cup-with-Handle;
- VCP;
- breakout / false breakout.

They are now organized into four quantitative layers:

1. MACRO_TOPOLOGY
   - W/M;
   - Cup/bowl;
   - large repeated-support/resistance structures.

2. COMPRESSION_PROGRESSION
   - VCP;
   - Cup handle;
   - Platform/Flag/Triangle-like tightening.

3. LOCAL_CANDLE_SAKATA
   - one/two/multi-candle OHLC morphology;
   - Sakata local sequences.

4. TRIGGER_LIFECYCLE
   - approach;
   - first break;
   - retest;
   - reentry;
   - failure;
   - reclaim.

Critical rule:
NAMED LABEL COUNT != DISTINCT STRUCTURAL OBJECT COUNT != INDEPENDENT INFORMATION COUNT.

Breakout is a lifecycle state of a versioned structural boundary, not another pattern vote.

Durable contracts:
- research/PATTERN_CORE_FAMILY_UNIFICATION_V0_1.md
- research/pattern_core_family_unification_v0_1.json

## DL-005B — Executable cross-family de-duplication

New pure research helper:
- research/pattern_evidence_dedup_v0_1.mjs
- research/test_pattern_evidence_dedup_v0_1.mjs

Outcome-free adversarial fixtures PASS.

Verified cases:

### Same-anchor multi-label
W + Cup using the same scale / semantic space / exact anchor set:
- rawNamedLabelCount = 2;
- exactAnchorGroupCount = 1;
- rootProvenanceCount = 1.

The second label does not create a second independent vote.

### Nested W inside broader Cup
Partial anchor overlap is retained as continuous Jaccard overlap.
No arbitrary overlap threshold classifies the pair as independent/dependent.

### Cup Handle + VCP + Platform
When all three labels share the same exact contraction anchors:
- 3 names;
- 1 exact anchor group;
- 1 root PRICE_OHLC provenance family.

### Shared breakout boundary
W / Cup / VCP can refer to the same versioned boundary and same firstBreakAt.
That is one observed trigger event even when three named families reference it.

### Sakata motif inside breakout
A Sakata Three-Soldiers-like local sequence and a breakout lifecycle can occupy different structural layers while still sharing PRICE_OHLC as the same root information family.

### Sakata Three Mountains vs M/top
Exact shared peak/trough anchors collapse to one exact-anchor macro structural group.

### Sakata Three Methods vs short Flag
Exact shared impulse/consolidation anchors collapse to one structural group.

The helper intentionally emits:
scoringVoteCount = null.

It never manufactures an "independent confirmation count."

## DL-005C — Causal breakout / false-break taxonomy

New pure research lifecycle:
- research/pattern_breakout_lifecycle_v0_1.mjs
- research/test_pattern_breakout_lifecycle_v0_1.mjs
- research/PATTERN_BREAKOUT_FALSE_BREAK_LIFECYCLE_V0_1.md

The loose phrase "false breakout" is decomposed into causal states.

UP-side examples:

REJECTED_UPPER_PIERCE
- intraday High pierces resistance;
- Close does not confirm above;
- no prior confirmed close break.
- This is not a failed confirmed breakout.

CLOSE_BREAK_ABOVE
- Close confirms above a versioned boundary.
- This is a structural event only, not acceptance/profit proof.

RETESTING_FROM_ABOVE
- Low revisits the upper zone;
- Close remains above.
- Retest != failure.

REENTERED_ZONE
- Close returns inside the same boundary zone.

FAILED_BELOW_ZONE
- Close traverses the whole zone and finishes below its lower edge.

RECLAIMED_ABOVE
- a previously reentered/failed structure later closes above the same immutable boundary again.

DOWN-side states are the exact mirror for M/top or support-break structures.

No fixed 3-day / 5-day failure window is embedded.
barsToReentry remains continuous.

"No follow-through" is explicitly not equal to false breakout if price never reenters/fails the structural boundary.

## DL-005D — Price-limit, session, prefix and boundary-version firewalls

### Price-limit constrained breakout
A structural break on a constrained session preserves:
- firstConfirmedBreakAt;
- structuralBreakObserved.

But ordinary acceptance remains:
UNRESOLVED.

The first later eligible unconstrained symbol-session becomes the first normal observability point.

This is consistent with the earlier 5314 real-source stress witness.

### Non-symbol-session / suspension pseudo-bar
An ineligible pseudo-bar cannot:
- create break;
- create reentry/failure;
- shorten barsToReentry.

### Prefix invariance
The lifecycle now supports asOfDate.

Adversarial test:
- 9/2 confirmed break;
- 9/3 still above;
- 9/4 later failure.

Querying the full array as of 9/3 reproduces the exact 9/3 state from a physically truncated prefix.
The later 9/4 failure cannot rewrite the historical 9/3 state.

PASS.

### Boundary versioning
Continuation allowed only when:
- boundaryId identical;
- version identical;
- lower/upper coordinates identical.

States:
- CONTINUE_SAME_BOUNDARY;
- RESET_REQUIRED_NEW_BOUNDARY_VERSION;
- PROVENANCE_CONFLICT_SAME_VERSION_MUTATED;
- NEW_BOUNDARY_OBJECT.

A later-refined neckline/rim/pivot cannot silently inherit the old breakout chronology.

PASS.

## DL-005E — Sakata Five Methods are heterogeneous, not one factor

New durable contracts:
- research/PATTERN_SAKATA_DECOMPOSITION_V0_1.md
- research/pattern_sakata_decomposition_v0_1.json

### Three Mountains
Layer:
MACRO_TOPOLOGY.

Overlaps:
- M/top;
- triple top;
- Head-and-Shoulders-like peak topology;
- repeated resistance.

Same peaks => no extra Sakata vote.

### Three Rivers
Modern descriptions are not perfectly uniform.

Contract therefore requires:
definitionVariant.

Possible variants:
- MULTI_TROUGH_TOPOLOGY;
- LOCAL_MULTI_CANDLE_REVERSAL.

Do not persist family=THREE_RIVERS without its actual quantitative definition.

### Three Gaps
Layer:
GAP / DISCONTINUITY MECHANICS + lifecycle.

Requires:
- historical OPEN;
- RAW_EXECUTION vs TECHNICAL_CONTINUITY separation;
- corporate-action guard;
- symbol-session / price-limit context.

Third gap does not automatically mean exhaustion/reversal.

### Three Soldiers
Layer:
LOCAL_CANDLE_SAKATA.

Strong overlap prior with:
- three positive/negative closes;
- close location;
- short-horizon momentum;
- body/range expansion;
- breakout follow-through.

Its independent value remains UNKNOWN.

### Three Methods
Layers:
COMPRESSION_PROGRESSION + TRIGGER_LIFECYCLE.

High overlap prior with:
- Flag;
- micro Platform;
- impulse/consolidation geometry;
- VCP final leg.

Rising/Falling Three Methods cannot become an extra confirmation simply because the same impulse/consolidation already received another label.

### Key conclusion
SAKATA_FIVE_METHODS is a historical taxonomy umbrella.
It is not one homogeneous quantitative factor.

Single Sakata score is rejected.

## DL-005F — External-evidence interpretation

Lo-Mamaysky-Wang-style systematic chart research supports objective geometric detection and shows that some chart patterns can alter conditional return distributions.

It does NOT support:
more matching names = more alpha.

Taiwan candlestick research reports profitability for only a subset of tested candlestick patterns after costs/robustness checks in historical samples.

That supports empirical study of OHLC morphology.

But the principal Taiwan samples are pre-modern-regime relative to:
- current 10% limit structure;
- 2020 continuous intraday trading.

Therefore:
modern current-regime Sakata/candlestick sign remains UNKNOWN.

No return outcome was inspected in this D01 tranche.

## DL-005G — Maturity decision

No tracker maturity upgrade is made in this tranche.

Reasons:
- D01-05 already L3; lifecycle semantics improved but no prospective alpha evidence.
- D01-06 remains L3; W/M dedup improved but no new prospective outcome evidence.
- D01-07 remains L2; Cup geometry improved conceptually but long-history / continuity runtime is still not promotion-ready.
- D01-08 remains L3; VCP overlap semantics improved but alpha remains UNKNOWN.
- D01-12 remains L2; Sakata taxonomy is better defined but modern Taiwan PIT/prospective evidence is not mature.

D01 overall maturity remains 51.7%.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact continuation point — after DL-005

1. Keep the four-layer core-family hierarchy frozen; do not expand the named-pattern catalog.
2. Next outcome-free research priority:
   nested multi-scale structure graph:
   weekly Cup / daily W / daily VCP / local Sakata motif must preserve parent-child scale relationships without duplicate votes.
3. Extend breakout lifecycle with continuous no-follow-through / time-above-boundary / extension / reclaim descriptors, still without a tuned N-bar threshold.
4. Continue Three-Gaps / gap semantics only where OPEN + corporate-action + symbol-session provenance is valid.
5. Keep all label signs UNKNOWN until modern prospective evidence exists.
6. Continue source-semantic blockers:
   TECHNICAL_CONTINUITY,
   symbol-session completeness,
   volume/trading-unit semantics,
   current price-limit mechanics.
7. No historical Pattern Shadow fabrication.
8. Prospective Pattern outcome inference still requires complete immutable parent/run receipts.
9. When clean data eventually exists, use only preregistered Pattern comparisons plus frozen redundancy controls; do not create label-count voting.
10. Formal Core remains unchanged.

# DL-006A–D — Nested graph, continuous breakout paths and Three-Gaps guards (2026-09-28)

Full outcome-blind specification and positive/negative cases: `research/PATTERN_NESTED_STRUCTURE_AND_GAP_V0_1.md`. Weekly/daily/local relations use causal typed edges and verified source-bar ancestry. Transitive containment/overlap does not imply evidence independence. Continuous breakout paths expose eligible symbol-session denominators, observability, break-bar-inclusive extension and null for unavailable information, without fixed failure windows. Three-Gaps requires independently valid OPEN, TECHNICAL_CONTINUITY, corporate-action and symbol-session provenance; overnight gap and non-overlap gap are different definitions. Current directional effect is UNKNOWN. No prospective outcomes, no historical Shadow, no tracker promotion, no Formal changes. Next: isolated synthetic graph/prefix tests and descriptor prototype, then source witness audit before a gap detector.

# DL-007A–E — Executable nested graph, path descriptors and Three-Gaps source falsification (2026-09-28)

Full evidence and counterevidence: `research/PATTERN_NESTED_GRAPH_PATH_QA_V0_1.md`.

The exact DL-006 continuation is now executable in isolated Class-A research code. The multi-scale graph admits only as-of-confirmed objects with verified eligible source bars, distinguishes completed from partial weeks, creates only direct typed edges, reports continuous anchor overlap, and fails closed on semantic-space or same-version boundary conflicts. Adversarial prefix replay proves that a Friday weekly parent cannot rewrite a Monday daily observation and that W↔VCP overlap does not transitively manufacture Cup↔VCP equivalence.

Continuous breakout path descriptors now separate eligible sessions from observable unconstrained sessions, break-bar-inclusive from post-break extension, reentry/failure from later reclaim, and raw price distance from PIT-verified ATR-normalized distance. Constrained/unavailable observations cannot manufacture persistence; they also cannot be silently dropped without exposing the denominator. `noFollowThroughDescriptor` remains descriptive with `tunedNDayThreshold=null`.

Official source audit finds that OPEN and corporate-action reference fields are available, but end-to-end Three-Gaps semantics are not ready. Current shared history drops requested OPEN, the previously audited connector did not honor adjusted=false metadata, provider-adjusted history is not automatically an immutable PIT vintage, corporate-action endpoints can expose future events, and security-specific session history is incomplete. Therefore no Three-Gaps detector was implemented. Machine state is frozen in `research/pattern_three_gaps_source_readiness_v0_1.json`.

All four targeted/new regression commands pass. No returns, no fabricated Shadow, no R09, no maturity promotion, no Formal optimization candidate. D01 remains 51.7%; direction remains UNKNOWN; Formal Core LOCKED.

## Exact continuation point — after DL-007

1. Freeze graph/path v0.1 and named-family catalog.
2. If continuing gaps, build only a detector-free precondition validator that fails closed on raw-mode, OPEN, continuity version, event clocks and explicit symbol-session membership.
3. Audit reuse of canonical History Source Revalidation session receipts; do not fork competing no-trade/session logic.
4. OPEN retention or continuity/session persistence in shared runtime is Class B proposal-first; no implementation without owner review.
5. Prospective graph/path outcomes remain blocked until COMPLETE immutable parent/run receipts exist; eventual tests must condition on frozen momentum, prior-high, close-location, ATR, price-volume, 15m execution and regime controls.
6. Pattern direction UNKNOWN; no R09; Formal Core unchanged.
