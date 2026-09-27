# Technical Indicator ADX / Bollinger Redundancy Research V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / FALSIFICATION_SPEC
Formal Core: LOCKED

## Scope
Continue the dedicated technical-indicator lane after TI-018.
This tranche studies:
1. DMI / ADX versus existing trend-quality information;
2. Bollinger width / location versus ATR, realized volatility, range compression and VCP/Pattern geometry.

No forward outcomes are inspected here.

## TI-019 — DMI / ADX mechanism decomposition

### Mathematical information family
For a standard Wilder DMI/ADX implementation:
- +DM is derived from upward high-to-high directional movement when it dominates the competing downward movement.
- -DM is derived from downward low-to-low directional movement when it dominates the competing upward movement.
- +DI and -DI normalize smoothed directional movement by smoothed True Range.
- DX measures the absolute separation of +DI and -DI relative to their sum.
- ADX smooths DX.

Therefore:
- +DI/-DI contain direction + range-motion information;
- ADX is directionless trend-strength / directional-asymmetry information;
- ADX is downstream of price highs/lows and True Range, and has an intrinsic overlap with ATR-normalized trend strength.

ADX must NOT be treated as bullish because it is high. A strong downtrend can produce high ADX.

### Redundancy prior
ADX has a high prior overlap with:
- existing higher-high / higher-low / lower-high / lower-low progression;
- MA slope/alignment;
- trendPersistence;
- direct ret20/ret60;
- ATR-normalized extension;
- Pattern trend context;
- range efficiency / directional path efficiency.

The research question is not whether ADX can describe trend strength. It can.
The question is whether it adds incremental information after these direct trend-quality descriptors are already known.

## TI-020 — Frozen ADX falsification comparators

Primary baseline:
- Wilder DMI/ADX 14;
- formulaVersion and initialization must be explicit;
- no threshold optimization.

Store:
- plusDI;
- minusDI;
- diSpread = plusDI - minusDI;
- adx;
- adxSlope;
- directionalState = UP_DOMINANT / DOWN_DOMINANT / BALANCED;
- strengthState remains descriptive until evidence exists.

Mandatory comparators:
1. MA20 slope normalized by ATR or close;
2. MA20/MA60 alignment;
3. trendPersistence;
4. directional efficiency = absolute net move / cumulative absolute move over the same horizon;
5. HH/HL/LH/LL progression;
6. ret20/ret60;
7. Pattern prior-trend state.

Primary falsification:
If ADX adds no stable dispersion after the direct trend-quality controls above, ADX is retained for explanation/regime labeling only and is not scored.

Secondary hypothesis:
ADX slope may contain transition timing information even when ADX level is redundant. This must be tested separately and cannot inherit a positive prior from ADX popularity.

### Threshold firewall
Conventional values such as 20/25/40 are NOT assumed universal.
First-pass analysis must use continuous ADX and preregistered broad descriptive bins only for diagnostics.
No threshold sweep before baseline redundancy evidence.

## TI-021 — Taiwan ADX evidence status

Taiwan-specific evidence is currently weaker than for KD/RSI/MACD/Bollinger.
A 2019 National Central University thesis combines fundamental screening, MA and ADX on 37 Taiwan-listed/OTC companies over 2000-2017. This supports feasibility but is not sufficient for a standalone ADX alpha claim.

A 2026 Taiwan practitioner backtest reports that selecting high-ADX stocks without direction filtering also admits strong declining stocks and materially worsens drawdown, while combining ADX with +DI/-DI and breadth changes behavior. This is not peer-reviewed alpha evidence, but it is a useful current-regime counterexample to "high ADX = buy".

Research implication:
Direction and strength must remain separate fields. ADX-alone direction is a category error.

## TI-022 — Bollinger Band information decomposition

For the conventional 20-period, 2-standard-deviation form:
- middle = SMA20;
- upper = SMA20 + 2*sigma20;
- lower = SMA20 - 2*sigma20;
- bandWidth = (upper-lower)/middle = 4*sigma20/SMA20;
- percentB is a normalized price-location statistic inside/outside the band envelope.

Therefore:
- Bollinger Band Width (BBW) is fundamentally a rolling close-dispersion / volatility transform;
- %B / band location is closely related to standardized distance from the moving average;
- upper/lower touches do not create a unique information family by themselves.

### Redundancy prior
BBW overlaps strongly with:
- realizedVolatility20;
- close-return standard deviation;
- ATR percentage;
- rangeCompressionSlope;
- trueRangeDryUp;
- VCP/Platform compression geometry.

However it is not identical to ATR:
- BBW uses dispersion of closes around an average;
- ATR uses True Range and therefore captures intraday high-low range and gaps.
This difference is the main plausible source of incremental information.

## TI-023 — Bollinger versus ATR / VCP frozen falsification plan

Store:
- sma20;
- sigma20;
- upper/lower bands;
- bandWidthPct;
- percentB;
- bandWidthSlope;
- squeezeDuration using a preregistered percentile state only after history coverage is adequate.

Mandatory controls:
1. ATR20Pct;
2. realized close-return volatility20;
3. trueRangeDryUp;
4. rangeCompressionSlope;
5. VCP contraction count/depth;
6. Platform widthCompression / boundary geometry;
7. MA20 distance;
8. Pattern lifecycle;
9. price-volume dry-up / acceptance;
10. market volatility regime.

Primary questions:
A. Does BBW add compression information after ATR + direct realized volatility?
B. Does BBW add anything after VCP/Platform latent geometry is known?
C. Does %B add information beyond MA-distance / close-location / structural resistance?
D. Are upper/lower band touches sign-dependent on trend/lifecycle rather than universal reversal states?

Primary falsification:
If BBW is subsumed by ATR/realized-volatility/range-compression/VCP controls, retain it only as UI/explanation.

## TI-024 — Taiwan Bollinger counterevidence

Ni, Day, Huang & Yu (2020), Physica A, Taiwan 50 constituents, 2007-2016:
- reported positive abnormal returns after lower-band events in their design;
- also reported that upper-band events supported long/momentum interpretation rather than the textbook symmetric contrarian sell interpretation.

This is strong sign-firewall evidence:
upper band != automatic SELL.

It does not establish a current post-2020 production rule because:
- sample ends in 2016;
- Taiwan market structure changed materially afterward;
- event-study evidence does not by itself prove incremental value beyond current Pattern/Trend/Price-Volume controls.

A 2025 National Central University thesis studies Bollinger + ATR on Taiwan index futures through 2024. It supports continued practical relevance of combining volatility/location concepts, but it does not resolve stock-selection redundancy and is not directly portable from futures to the equity selector.

## TI-025 — Combined interpretation firewall

Rejected design defaults:
- ADX high = bullish;
- ADX below 20/25 = automatically non-trending for every Taiwan stock;
- +DI cross alone = BUY;
- upper Bollinger touch = SELL;
- lower Bollinger touch = BUY;
- BB squeeze = bullish;
- ADX + BB agreement = two independent votes.

Preferred semantic roles:
- ADX: trend-strength / state-quality descriptor;
- +DI/-DI: directional-movement descriptor;
- BBW: close-dispersion / compression descriptor;
- %B: standardized location descriptor.

Cross-family use is allowed only after redundancy is residualized.

## TI-026 — Outcome-blind adversarial fixtures to add

ADX/DMI:
1. monotonic uptrend;
2. monotonic downtrend;
3. choppy range with large True Range;
4. smooth low-volatility trend;
5. V reversal;
6. gap continuation;
7. price-limit constrained sequence.

Expected mechanical assertions:
- monotonic up and down can both produce high ADX;
- choppy wide-range movement can raise TR while directional dominance remains weak;
- smooth trend can show high directional efficiency even with modest raw volatility.

Bollinger:
1. constant close + widening intraday H/L range;
2. volatile closes + small intraday range;
3. VCP-like contracting closes and ranges;
4. upper-band breakout that continues;
5. upper-band spike that fails;
6. lower-band undercut/reclaim;
7. corporate-action continuity break.

Expected assertions:
- ATR and BBW can diverge because they consume different volatility geometry;
- upper-band contact has no fixed directional sign;
- corporate-action discontinuity must block ordinary band/ATR interpretation unless continuity is valid.

## Current status

ADX_DMI: MECHANISM_DEFINED / REDUNDANCY_PRIOR_HIGH / TAIWAN_ALPHA_UNKNOWN
BOLLINGER: MECHANISM_DEFINED / SIGN_FIREWALL_SUPPORTED / REDUNDANCY_WITH_VOLATILITY_AND_PATTERN_HIGH / CURRENT_REGIME_ALPHA_UNKNOWN
FORMAL_OPTIMIZATION_CANDIDATE: NONE

## Exact next continuation
1. Extend isolated technical_indicator_core with Wilder DMI/ADX14 and conventional Bollinger20x2 only in research files, no Worker wiring.
2. Add deterministic TI-026 fixtures and prefix/replay tests.
3. Preserve current snapshot contract and add raw DMI/ADX/Bollinger components only after versioned schema review.
4. No outcome joins until primary prospective parent coverage is complete.
5. Later inference order remains:
   a. KD vs RSI residual value;
   b. MACD vs direct trend;
   c. ADX vs direct trend-quality;
   d. BBW vs ATR/realized-vol/range-compression/VCP.
6. No threshold sweep.
7. Formal Core remains LOCKED.

## Evidence anchors
- Tseng, Yu-Hao (2019), National Central University, "An Empirical Study of Algorithm Trading by Using Fundamental Analysis and Technical Analysis with Applications to Taiwan Stocks."
- Ni, Y., Day, M.-Y., Huang, P., & Yu, S.-R. (2020), "The profitability of Bollinger Bands: Evidence from the constituent stocks of Taiwan 50", Physica A 551, 124144. DOI 10.1016/j.physa.2020.124144.
- Hung, Chien-Hsuan (2025), National Central University, "Analysis of Bollinger Bands and ATR Trading Strategies: Evidence from Taiwan Index Futures."
- FinLab (2026), Taiwan 11-year ADX practitioner backtest. Used only as current-regime counterexample/mechanical stress evidence, not peer-reviewed alpha proof.
