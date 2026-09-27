# Technical Indicator ADX14 / Bollinger20x2 Formula Parity Contract V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / FORMULA_SPEC_FROZEN / NO_RUNTIME_CHANGE
Formal Core: LOCKED

## Purpose

Freeze exact system-native research formula semantics for:
- Wilder DMI/ADX14;
- Bollinger Bands / BandWidth / %B 20x2.

The purpose is reproducible isolated QA and future prospective parity.
It is not a trading-rule authorization.

## TI-289 — ADX14 formulaVersion

Frozen research baseline:

WILDER_ADX14_TALIB_STYLE_NO_ROUNDING_V0_1

Inputs:
- observed High;
- observed Low;
- observed Close;
- eligible symbol sessions only.

Period:
14.

Integer rounding:
NONE.

Extra TA-Lib unstable-period extension:
0 in the system-native baseline.

## TI-290 — One-period TR / +DM / -DM

For bar t > first eligible bar:

upMove = High_t - High_(t-1)
downMove = Low_(t-1) - Low_t

+DM1 =
upMove if upMove > 0 AND upMove > downMove,
else 0.

-DM1 =
downMove if downMove > 0 AND downMove > upMove,
else 0.

Tie:
if positive upMove == positive downMove,
both +DM1 and -DM1 = 0.

True Range:
TR1 = max(
  High_t - Low_t,
  abs(High_t - Close_(t-1)),
  abs(Low_t - Close_(t-1))
).

## TI-291 — Wilder smoothing semantics

TA-Lib-style initialization:
- seed prevTR / prev+DM / prev-DM using the first period-1 one-bar transitions;
- for each of the next period bars, apply one Wilder update first:
  S_t = S_(t-1) - S_(t-1)/14 + x_t;
- compute one DX after that update;
- the first ADX is the arithmetic mean of those first 14 DX slots.

This is not identical to simply summing 14 DM observations once and then beginning DX calculations.

Then:
+DI14 = 100 * (+DM14 / TR14)
-DI14 = 100 * (-DM14 / TR14)

when TR14 > 0.

DX14 =
100 * abs(+DI14 - -DI14) / (+DI14 + -DI14)

when the denominator is positive.

Zero-denominator behavior must be deterministic and versioned.
TA-Lib-style baseline:
- if smoothed TR is zero, no valid DI/DX update is applied;
- if (+DI + -DI) is effectively zero, no valid DX update is applied;
- during first-ADX accumulation, such a slot contributes nothing to sumDX but the first ADX still divides by period;
- after first ADX exists, an invalid DX slot leaves prior ADX unchanged rather than smoothing ADX toward zero.
The executable fixture must validate this behavior before parity claims.

## TI-292 — First ADX output / lookback

First ADX14:
arithmetic mean of the first 14 valid DX14 readings.

Subsequent ADX:
ADX_t =
((ADX_(t-1) * 13) + DX_t) / 14.

TA-Lib reference lookback with period=14 and unstablePeriod=0:
27 input positions before first output.

Equivalent practical interpretation:
- first ADX output appears at zero-based index 27;
- 28 eligible OHLC bars are required for the first output.

This is FIRST_CALCULABLE only.

It is NOT a seed-stability claim.

## TI-293 — ADX initial instability / parity warning

ADX has cascaded memory:
- Wilder-smoothed TR/+DM/-DM;
- nonlinear DI/DX;
- Wilder-smoothed ADX.

Therefore numerical parity is sensitive to input history depth and initialization lineage.

External documentation notes that short-history ADX can differ materially from longer-history ADX.

Project rule:
- do not convert "150 periods" or any similar practitioner guidance into a production threshold;
- use canonical replay lineage / trusted prior state;
- preserve initialization provenance;
- compare parity on identical input history.

## TI-294 — ADX output payload

Future isolated output should preserve:

- tr14Smoothed;
- plusDM14Smoothed;
- minusDM14Smoothed;
- plusDI14;
- minusDI14;
- diSpread;
- dx14;
- adx14;
- adxSlope;
- firstCalculable;
- formulaVersion;
- inputBarCount;
- stateLineageId;
- priceLimitConstrained;
- dataQualityState.

Do not emit:
- bullish=true from ADX level;
- buy/sell signal;
- optimized threshold state.

## TI-295 — ADX parity/adversarial fixtures

A. MIRRORED_MONOTONIC_UP_DOWN
Expected:
- +DI/-DI swap direction under symmetric mirror;
- ADX trend-strength path approximately mirrors/equal under exact symmetric geometry.

B. FLAT_ZERO_RANGE
Expected:
- deterministic zero-direction behavior;
- no NaN coercion into bullish/bearish state.

C. INSIDE_BARS
Expected:
- +DM1=-DM1=0 when neither directional extension dominates.

D. EQUAL_OUTSIDE_EXPANSION
Expected:
- equal positive up/down extension => both DM=0.

E. GAP_WITH_SMALL_INTRADAY_RANGE
Expected:
- TR captures previous-close gap.

F. ONE_LARGE_WICK
Expected:
- H/L directional and TR response differs from close-only trend quality.

G. PRICE_SCALE_MULTIPLICATION
Expected:
- +DI/-DI/DX/ADX invariant within floating tolerance.

H. CORPORATE_ACTION_RESET
Expected:
- inference BLOCKED without TECHNICAL_CONTINUITY.

I. PRICE_LIMIT_STAIRCASE
Expected:
- VALID_BUT_CONSTRAINED / separate stratum.

## TI-296 — Bollinger formulaVersion

Frozen system-native research baseline:

BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1

Input:
Close only.

Center:
SMA20.

Standard deviation:
population standard deviation over the same 20 eligible closes:

sigma20 =
sqrt(
  (1/20) * sum((Close_i - SMA20)^2)
).

Equivalent computational form may be used only if replay-exact within declared floating tolerance.

Multiplier:
k=2.

Upper:
SMA20 + 2*sigma20.

Lower:
SMA20 - 2*sigma20.

This matches the TA-Lib population-variance convention for the frozen research baseline.

It is NOT a claim of universal chart-platform parity.

## TI-297 — BandWidth and %B

bandWidthRatio =
(Upper - Lower) / SMA20
when SMA20 != 0.

bandWidthPct =
100 * bandWidthRatio.

percentB =
(Close - Lower) / (Upper - Lower)
when Upper > Lower.

Zero-width flat series:
- percentB = null;
- interpretationReason = ZERO_BAND_WIDTH_UNDEFINED_LOCATION.

Do NOT silently coerce zero-width %B to 0, 0.5 or 1.

Flat-band location may be described separately as:
Close == SMA20.

## TI-298 — Bollinger readiness

Finite-window formula:
- first calculable after 20 eligible closes;
- no recursive seed lineage after the complete 20-bar window is known.

However inference still requires:
- exact eligible symbol sessions;
- TECHNICAL_CONTINUITY;
- no pseudo-bars;
- formulaVersion;
- source-history identity.

A prior contaminated close ceases direct influence once it leaves the 20 eligible-bar window, provided the continuity transform itself is correct.

## TI-299 — Bollinger parity/adversarial fixtures

A. CONSTANT_CLOSE
Expected:
- SMA constant;
- sigma=0;
- upper=lower=SMA;
- BBW=0;
- %B undefined/null.

B. PRICE_SCALE_MULTIPLICATION
Expected:
- bandWidthRatio and %B invariant.

C. POSITIVE_AFFINE_SHIFT
Expected:
- %B invariant;
- bandWidthRatio generally changes because the denominator SMA shifts additively.

D. SAME_CLOSE_WIDE_INTRADAY_RANGE
Expected:
- BBW unchanged from close path;
- ATR can change materially.

E. SMOOTH_TREND_TIGHT_RANGE
Expected:
- BBW can widen even with modest ATR.

F. SAMPLE_VS_POPULATION_STD
Expected:
- deliberate mismatch witness proving why stdDefinition must be versioned.

G. CORPORATE_ACTION_RESET
Expected:
- BLOCKED without TECHNICAL_CONTINUITY.

H. PRICE_LIMIT_STAIRCASE
Expected:
- constrained interpretation.

## TI-300 — Formula parity conclusion

ADX14:
FORMULA_SPEC_FROZEN /
FIRST_OUTPUT_SEMANTICS_FROZEN /
CASCADED_SEED_LINEAGE_REQUIRED /
CORE_NOT_IMPLEMENTED.

Bollinger20x2:
FORMULA_SPEC_FROZEN /
POPULATION_STD_BASELINE_FROZEN /
FINITE_WINDOW /
CORE_NOT_IMPLEMENTED.

No thresholds, scores, BUY/SELL states or Formal changes are authorized.

FORMAL_OPTIMIZATION_CANDIDATE:
NONE.

Formal Core remains LOCKED.

## Exact next continuation

1. Build machine-readable formula contracts and fixture expectations.
2. Update snapshot-contract proposal with stateLineage/seed/formula-readiness fields.
3. Theory is no longer the bottleneck; isolated executable QA is next.
4. Any code work remains research-only and must not touch Worker.js.
5. Runtime observer remains NO_GO until TECHNICAL_CONTINUITY and parent lineage are ready.
