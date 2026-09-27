# Technical Indicator Bollinger Width vs ATR / VCP Decomposition V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / PRIMARY_QUEUE_DECOMPOSITION
Formal Core: LOCKED

## Purpose

Advance the fourth primary technical-indicator comparison:
Bollinger Band Width / %B versus ATR, realized volatility, range compression and VCP/Pattern geometry.

No forward outcomes are inspected.

## TI-253 — Bollinger Band algebraic decomposition

For the conventional baseline:
- middle = SMA20(Close)
- upper = middle + k * sigma20(Close)
- lower = middle - k * sigma20(Close)
- k = 2 in the conventional reference.

Then:

BandWidth =
(upper - lower) / middle
=
2*k*sigma20(Close) / SMA20(Close).

For k=2:
BandWidth = 4*sigma20(Close) / SMA20(Close).

Therefore conventional BBW is a scaled coefficient-of-dispersion of **price levels around their moving average**.

It is not a new raw-information source.

## TI-254 — %B is a standardized MA-distance transform

Percent B:
%B = (Close - LowerBand) / (UpperBand - LowerBand).

With symmetric k-standard-deviation bands:

%B =
1/2 + (Close - SMA) / (2*k*sigma).

For k=2:

%B =
1/2 + (Close - SMA) / (4*sigma).

Thus %B is a monotone affine transform of standardized distance from the moving average.

Status:
PERCENT_B_LOCATION = REDUNDANT_WITH_STANDARDIZED_MA_DISTANCE_WITHIN_FORMULA_VERSION.

%B may be useful for UI/explanation but cannot be independently counted together with the same standardized MA-distance primitive.

## TI-255 — BBW is not identical to close-to-close return volatility

Important semantic distinction:

BBW uses dispersion of the **price level** inside a rolling window.

Typical realized volatility20 uses dispersion of **close-to-close returns**.

A smooth trend can produce:
- low variability of daily returns;
- but a wide spread of price levels around the rolling mean.

Conversely a mean-reverting sequence can produce:
- substantial daily return variability;
- while price levels remain confined around a center.

Therefore BBW and return-volatility are related but not algebraically identical.

This is one reason to avoid calling every width measure simply "volatility" without definition.

## TI-256 — BBW versus ATR: different geometry

ATR uses True Range:
- intraday High-Low;
- High versus previous Close;
- Low versus previous Close.

BBW baseline uses Close-level dispersion around SMA.

Therefore:

Case A:
nearly unchanged Closes + large intraday High/Low excursions
=> BBW can remain narrow while ATR is high.

Case B:
smooth monotonic Close trend + small daily High/Low range
=> ATR can remain modest while BBW widens because rolling Close levels spread around the SMA.

This is the core plausible incremental-information channel.

## TI-257 — BBW versus Pattern/VCP compression

VCP/Pattern compression should retain direct structural geometry such as:
- swing-depth contraction;
- range-width contraction;
- higher lows;
- contraction leg count;
- volume dry-up where valid;
- boundary geometry;
- Pattern lifecycle.

BBW only sees Close dispersion relative to an SMA.

Potential failure modes:
- wide intraday ranges but closes clustered -> false "squeeze" appearance;
- trending closes can widen bands without disorder;
- corporate-action discontinuity can blow out sigma;
- price-limit-constrained closes can artificially compress observed dispersion.

Therefore:
BBW squeeze != VCP by definition.

## TI-258 — Direct compression comparators

Mandatory controls:

B6 volatility:
- ATR20Pct;
- realized close-return volatility20;
- trueRangeDryUp;
- Yang-Zhang components when provenance-valid.

Pattern compression:
- widthCompression;
- contractionCount;
- contractionDepthPct;
- rangeCompressionSlope;
- Pattern lifecycle / VCP maturity.

Trend:
- MA20 slope;
- ret20;
- trendPersistence.

Price-volume:
- volumeDryUp;
- acceptance/rejection.

BBW must beat these direct representations.

## TI-259 — Formula-version risk

Bollinger implementations can differ in:
- SMA vs EMA center;
- population vs sample standard deviation;
- lookback;
- band multiplier k;
- treatment of missing bars;
- adjusted/raw/continuity price space.

Therefore every BBW/%B observation requires:
- formulaVersion;
- centerType;
- stdDefinition;
- lookback;
- multiplier;
- continuitySpace.

No cross-platform parity claim without exact matching semantics.

## TI-260 — Squeeze percentile is a second transform, not a new family

bandWidthPercentile compares current BBW with its own historical distribution.

This may help self-normalize across stocks.
But it is a nested transform of BBW and introduces:
- percentile lookback;
- history coverage;
- regime dependence.

It cannot be counted in addition to raw BBW as independent evidence.

No percentile lookback optimization is authorized.

## TI-261 — Taiwan sign-firewall evidence

Ni, Day, Huang & Yu (2020) study Taiwan 50 constituent stocks over 2007-2016 and report:
- positive abnormal returns after lower-band events in their design;
- upper-band events also supported long/momentum interpretation rather than a simple short/contrarian interpretation.

This directly rejects:
UPPER_BAND_TOUCH = AUTOMATIC_SELL.

But it does NOT establish:
- post-2020 current-regime portability;
- incremental value beyond Pattern/Trend/Price-Volume controls;
- a universal lower-band buy rule.

Band events remain context-dependent.

## TI-262 — Frozen adversarial mechanics

Future executable fixtures:

A. SAME_CLOSE_WIDE_RANGE
- same/near-flat Closes;
- widening High/Low range.
Expected:
  BBW low/narrow;
  ATR high.

B. SMOOTH_TREND_TIGHT_RANGE
- steadily rising Closes;
- small intraday range.
Expected:
  BBW can widen;
  ATR modest.

C. VCP_TRUE_COMPRESSION
- shrinking swing depth and range.
Expected:
  BBW and ATR may both contract.

D. CLOSE_CLUSTER_INTRADAY_NOISE
- clustered closes;
- large wicks.
Expected:
  BBW squeeze candidate but Pattern/VCP quality weak.

E. GAP_SHOCK
- previous-close/open discontinuity.
Expected:
  ATR reacts immediately;
  BBW response depends on close path.

F. CORPORATE_ACTION_RESET
- raw mechanical price reset.
Expected:
  ordinary BBW/ATR interpretation BLOCKED without TECHNICAL_CONTINUITY.

G. PRICE_LIMIT_STAIRCASE
- constrained consecutive closes.
Expected:
  observed width/range may understate latent pressure; CONSTRAINED stratum.

No outcomes are part of these fixtures.

## TI-263 — Frozen future incremental ladder

M0 BASE:
- trend;
- direct returns;
- Pattern lifecycle;
- market/sector regime;
- liquidity;
- Price-Volume state.

M1 DIRECT_VOL:
M0 + ATR + realized volatility + direct range compression.

M2 PATTERN_COMPRESSION:
M1 + VCP/Platform latent compression geometry.

M3 BBW:
M2 + BBW continuous level/slope.

M4 LOCATION:
M3 + standardized band location only if not already represented by equivalent MA-distance z-state.

Questions:
- Does BBW add beyond direct volatility?
- Does it add after VCP/Platform compression geometry?
- Does band location add beyond standardized MA distance / structural location?

No squeeze threshold optimization.

## TI-264 — Current conclusion

Established:
- conventional BBW is proportional to Close-level standard deviation divided by SMA;
- %B is a standardized MA-distance transform;
- BBW is not algebraically identical to return volatility or ATR;
- BBW and ATR can diverge because Close dispersion differs from intraday/gap True Range;
- BBW squeeze is not equivalent to VCP/Pattern contraction;
- upper-band touch has no universal bearish sign in Taiwan evidence.

Unknown:
- whether BBW adds incremental information after ATR/realized-vol/direct compression/VCP controls;
- whether any band-location information survives standardized MA-distance and structure controls;
- current post-2020 Taiwan effect size.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Freeze BBW/%B alias and formula-version metadata.
2. Add the seven adversarial fixture classes to future isolated response/mechanics QA.
3. Do not add a squeeze score before direct-volatility and Pattern-compression redundancy tests.
4. With all four primary theory decompositions complete, the next technical-indicator bottleneck becomes prospective state construction / data readiness, not more indicator theory.
5. Formal Core remains unchanged.

## Evidence anchors

- Fidelity Bollinger Band Width guide: width = (upper-lower)/middle; same SMA period and standard-deviation multiplier as Bollinger Bands.
- Fidelity %B guide: %B = (Price-Lower)/(Upper-Lower).
- Ni, Day, Huang & Yu (2020), Physica A 551, Taiwan 50 Bollinger-band study.
- Existing project Pattern and Volatility research define the direct VCP/range/ATR/Yang-Zhang comparators.
