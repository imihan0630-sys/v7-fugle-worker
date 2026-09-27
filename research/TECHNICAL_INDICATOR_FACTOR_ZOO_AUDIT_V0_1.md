# Technical Indicator Factor-Zoo Redundancy Audit V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / ALGEBRAIC_REDUNDANCY_AUDIT
Formal Core: LOCKED

## Scope
Continue the technical-indicator lane after TI-035.
This tranche screens additional popular indicators before allocating any prospective Shadow evidence budget.

Principle:
If an indicator is algebraically equivalent to an existing feature, or is a deterministic composite of already-owned information families without a new mechanism, reject it as a new independent factor before outcome testing.

## TI-036 — Williams %R is an exact Stochastic rescaling

Fast Stochastic:
%K = 100 * (C - L_n) / (H_n - L_n)

Williams %R:
%R = -100 * (H_n - C) / (H_n - L_n)

Therefore:
%R = %K - 100

The two indicators contain the same information and produce the same line shape under a linear scale shift.

### Status
WILLIAMS_R = REJECTED_OR_REDUNDANT_AS_NEW_FACTOR

No new Shadow outcome study is justified for Williams %R if Fast Stochastic / range-location information is already represented.

## TI-037 — StochRSI is a nested derivative of RSI

StochRSI applies a Stochastic transform to the RSI series:
StochRSI = 100 * (RSI_t - min(RSI,n)) / (max(RSI,n) - min(RSI,n))

It may change sensitivity and event frequency, but it does not introduce a new source of market information.
It is a second-order transform of a price-derived oscillator.

Risks:
- extra lookback degree of freedom;
- RSI parameter + StochRSI parameter combinations;
- more extreme readings / more signals;
- multiple-testing and threshold-mining;
- double counting with RSI + KD.

### Status
STOCH_RSI = REDUNDANCY_VERY_HIGH / LOW_PRIORITY_ROBUSTNESS_COMPARATOR_ONLY

Do not create a StochRSI vote or score.

## TI-038 — CCI overlaps MA-distance plus volatility normalization

CCI uses Typical Price:
TP = (H + L + C)/3

CCI = (TP - SMA(TP,n)) / (0.015 * MeanDeviation(TP,n))

Information decomposition:
- distance from a moving center;
- normalized by recent dispersion;
- Typical Price adds intrabar high/low information.

It therefore overlaps:
- MA distance;
- Bollinger-style standardized location;
- realized/range volatility;
- ATR;
- structural extension / overheat;
- close/range location.

The only plausible residual information is whether Typical Price and mean-deviation normalization capture useful intrabar geometry beyond current close-based MA/Bollinger and range features.

### Status
CCI = REDUNDANCY_HIGH / ALPHA_UNKNOWN / LOW_PRIORITY

No outcome search before primary KD/RSI/MACD/ADX/BBW gates are resolved.

## TI-039 — MFI is RSI-like signed money-flow and belongs to Price-Volume

Money Flow Index:
1. TypicalPrice = (H+L+C)/3
2. RawMoneyFlow = TypicalPrice * Volume
3. classify positive/negative according to TypicalPrice change
4. aggregate positive and negative flow
5. normalize their ratio into a 0-100 oscillator

MFI therefore combines:
- price-direction classification;
- turnover-like price*volume magnitude;
- RSI-style positive/negative ratio normalization.

It is not an independent technical information family.
It belongs under Price-Volume.

Overlap:
- RSI;
- OBV;
- turnover value;
- RVOL;
- price response;
- close/range location;
- effort-vs-result;
- acceptance/rejection lifecycle.

### Status
MFI = PRICE_VOLUME_COMPARATOR_ONLY / REDUNDANCY_HIGH / DATA_SEMANTICS_SENSITIVE

Potential future value:
MFI may be a compact benchmark against richer Price-Volume states, but it must not receive an independent vote.

## TI-040 — Keltner Channel is a deterministic center + range envelope

Common Keltner-family construction uses:
- a moving center based on price/Typical Price;
- a smoothed range or ATR-like width;
- upper/lower envelope = center +/- volatility width.

Therefore it is primarily a composition of:
- trend center;
- volatility/range;
- standardized price location.

Current system already owns:
- MA/EMA;
- ATR/range volatility;
- support/resistance;
- Bollinger width/location;
- Pattern compression/breakout.

### Status
KELTNER_CHANNEL = REJECTED_OR_REDUNDANT_AS_NEW_INFORMATION_FAMILY

A Keltner visualization may be useful, but a new score would duplicate existing primitives.

## TI-041 — Donchian Channel duplicates rolling structural highs/lows

Donchian Channel:
- upper = highest high over N periods;
- lower = lowest low over N periods;
- midpoint = (upper+lower)/2.

Current system already has:
- priorHigh20/priorHigh60;
- priorLow20;
- majorStructuralHigh/Low;
- breakout/pullback lifecycle;
- support/resistance zones;
- rolling range/compression.

Therefore a Donchian 20 breakout is essentially a named wrapper around existing rolling-high/low breakout geometry.

### Status
DONCHIAN_CHANNEL = REJECTED_OR_REDUNDANT_AS_NEW_FACTOR

It may remain an explainability label for a rolling-high/low event.

## TI-042 — Parabolic SAR belongs to position/trailing-stop research

Parabolic SAR is a path-dependent trailing stop-and-reverse system:
SAR_t = SAR_(t-1) + AF * (EP - SAR_(t-1))

Its information is heavily dependent on:
- current trend side;
- extreme point;
- acceleration factor;
- trailing-stop state.

Known mechanical issue:
range/sideways markets can create whipsaws.

Current system already separates:
- stock selection;
- 15m execution;
- stop/RR;
- position monitoring;
- reduce/re-add.

### Status
PARABOLIC_SAR_SELECTION_FACTOR = REJECTED_AS_ROLE_MISMATCH
PARABOLIC_SAR_TRAILING_STOP = POSITION_MANAGEMENT_RESEARCH_ONLY

Do not use SAR as an independent stock-selection vote.
If ever studied, compare it against existing stop/reduce/re-add state machines with transaction-cost and whipsaw controls.

## TI-043 — Ichimoku is a multi-horizon range-midpoint/trend composite

Ichimoku components are constructed from rolling high/low midpoints at multiple horizons plus shifted display coordinates:
- Tenkan: rolling high/low midpoint;
- Kijun: longer rolling high/low midpoint;
- Senkou A: average of Tenkan/Kijun shifted forward on chart;
- Senkou B: long-horizon range midpoint shifted forward;
- Chikou: close shifted backward for display.

Information overlap:
- rolling structural highs/lows;
- range midpoints;
- trend comparison;
- support/resistance;
- multi-horizon structure.

Current Pattern/Technical engines already retain richer explicit versions of these concepts.

### Critical PIT/display-coordinate hazard
Ichimoku's shifted plotting can create indexing mistakes in backtests:
- a value plotted at a future chart coordinate was computed from current/past data;
- a lagging span is current close displayed at an earlier coordinate.

Research code must store calculationAsOf separately from plotCoordinate.
Never interpret visual forward/backward placement as information availability.

### Status
ICHIMOKU = REDUNDANCY_HIGH / PIT_DISPLAY_HAZARD / EXPLANATION_ONLY_BY_DEFAULT

No scoring study unless a specific residual hypothesis survives direct structural controls.

## TI-044 — Heikin-Ashi is a transformed visualization, not raw price truth

Heikin-Ashi constructs synthetic OHLC from current and prior averaged values.
Benefits:
- visual smoothing;
- trend readability.

Costs:
- synthetic open/close are not executable market prices;
- gaps and raw candle geometry can be obscured;
- apparent candle continuity is partly created by the transform.

Current system already has:
- raw OHLC provenance;
- candlestick morphology;
- trend persistence;
- moving averages;
- Pattern lifecycle.

### Status
HEIKIN_ASHI = VISUALIZATION_ONLY / NO_EXECUTION_PRICE_AUTHORITY / REDUNDANCY_HIGH

Never use Heikin-Ashi synthetic OHLC as an actual fill, stop, gap or support/resistance price.

## TI-045 — Indicator-zoo triage

### Algebraically/deterministically redundant — reject as new factors
- Williams %R -> Fast Stochastic rescaling.
- standard ROC_N -> retN.
- Donchian Channel -> rolling high/low breakout wrapper.
- Keltner Channel -> moving center + range/ATR envelope.
- normalized Momentum -> return/ROC geometry.

### Nested transforms — very low priority
- StochRSI -> stochastic transform of RSI.
- Supertrend-style constructs -> price center + ATR + path-state.
- multiple smoothed oscillator variants without new mechanism.

### Cross-family comparators only
- MFI -> Price-Volume.
- OBV -> Price-Volume.
- CCI -> trend/volatility standardized-location comparator.

### Role mismatch for selection
- Parabolic SAR -> trailing stop / position management.
- Heikin-Ashi -> visualization/trend smoothing.

### Structural composite / explanation layer
- Ichimoku -> multi-horizon structural range midpoint/trend visualization.

## Research-governance consequence

The technical-indicator lane should NOT become a catalog-completion project.
A popular indicator does not deserve a test merely because it exists.

Evidence budget should be reserved for unresolved information questions:
1. KD vs RSI residual difference;
2. MACD transition content beyond direct trend;
3. ADX strength content beyond trend quality;
4. BBW content beyond ATR/realized-vol/VCP;
5. one minimal return-acceleration descriptor;
6. normalized signed-volume / MFI/OBV only if modern Price-Volume states leave residual information.

## Current status

WILLIAMS_R = REJECTED_OR_REDUNDANT
STOCH_RSI = LOW_PRIORITY_REDUNDANT
CCI = LOW_PRIORITY_REDUNDANCY_HIGH
MFI = PRICE_VOLUME_COMPARATOR_ONLY
KELTNER = REJECTED_OR_REDUNDANT
DONCHIAN = REJECTED_OR_REDUNDANT
PARABOLIC_SAR = POSITION_MANAGEMENT_ONLY
ICHIMOKU = EXPLANATION_ONLY_BY_DEFAULT / PIT_DISPLAY_HAZARD
HEIKIN_ASHI = VISUALIZATION_ONLY

FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Do not add rejected indicator families to prospective Shadow capture.
2. Add an alias/redundancy registry so exact duplicates cannot accidentally be scored twice in System 2.
3. Map Williams %R -> Stochastic range-location family.
4. Map ROC -> return family.
5. Map Donchian -> structural-level/breakout family.
6. Map Keltner -> trend+volatility envelope family.
7. Map MFI/OBV -> Price-Volume family.
8. Map Parabolic SAR -> Position Management.
9. Map Heikin-Ashi -> Visualization only.
10. Keep primary outcome inference queue unchanged; no new Factor Zoo expansion.

## Formula/evidence anchors
- Fidelity Williams %R / Fast Stochastic guides: identical line geometry with different scaling.
- Fidelity StochRSI guide: Stochastic normalization of RSI values.
- Fidelity CCI guide: Typical Price deviation from SMA normalized by Mean Deviation.
- Fidelity MFI guide: Typical Price * Volume positive/negative money-flow ratio normalized as an oscillator.
- Fidelity Keltner Bands guide: moving center plus high-low/range envelope.
- Fidelity Parabolic SAR guide: acceleration-factor trailing stop-and-reverse, with whipsaw risk in sideways markets.
- Fidelity Ichimoku guide: rolling high/low midpoint components with forward/backward chart shifts.
