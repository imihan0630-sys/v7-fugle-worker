# Technical Indicator Trendiness / Taiwan Sentiment / Composite Audit V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / REDUNDANCY_AND_ROLE_AUDIT
Formal Core: LOCKED

## Scope

Continue the technical-indicator lane after TI-136.

This tranche audits:
- VHF;
- Choppy/Noise style trendiness measures;
- Random Walk Indicator;
- Coppock;
- Intraday Momentum Index (IMI);
- BW MFI / Market Facilitation;
- Klinger / KO;
- volume-weighted MACD / volume oscillators;
- AR / BR;
- ACC;
- Q indicator;
- composite majority-vote Technical Score designs.

No forward outcomes are inspected.

## TI-137 — VHF is a path-efficiency robustness comparator

A standard VHF construction uses:

VHF_N =
(max(Close,N) - min(Close,N))
/
sum(abs(Close_i - Close_(i-1)), N)

The denominator is the same close-path length concept used by KAMA Efficiency Ratio / pathEfficiency10.

Difference:
- KAMA ER numerator = endpoint displacement |C_t - C_(t-N)|
- VHF numerator = full-window close range max(C)-min(C)

Therefore VHF and ER are not algebraically identical, but they occupy the same PATH_EFFICIENCY / TRENDINESS family.

### Key counterexample

Two paths can have:
- the same max-min range;
- different endpoints;
or
- the same endpoints;
- different max-min range.

Thus VHF can serve as a robustness comparator for how the numerator is defined.

### Status

VHF = PATH_EFFICIENCY_ROBUSTNESS_COMPARATOR
INDEPENDENT_VOTE = FORBIDDEN

Do not create a second trend-quality factor simply because VHF has a different name.

## TI-138 — Choppy / Noise measures are alternate trend-efficiency coordinates

Reviewed Choppy/Noise-style constructions compare some combination of:
- endpoint displacement;
- rolling high-low range;
- cumulative intrabar range or absolute path length;
- smoothing.

They ask essentially:
"How large is directional progress relative to total movement/noise?"

This is the same mechanism family as:
- pathEfficiency10;
- VHF;
- ADX trend quality;
- Pattern pole path efficiency;
- range/ATR compression.

Differences in numerator/denominator can be useful robustness checks, but not independent votes.

### Status

CHOPPY_TRENDINESS = PATH_EFFICIENCY_RANGE_COMPARATOR
NOISE_RATIO = PATH_EFFICIENCY_RANGE_COMPARATOR
ALPHA = UNKNOWN
PRIMARY_PRIORITY = LOW

## TI-139 — Random Walk Indicator is directional excursion normalized by volatility

RWI compares directional high/low excursion against a volatility scale, typically using True Range/ATR-like normalization over candidate horizons.

Information family:
- structural high/low excursion;
- volatility normalization;
- directional trend quality.

This overlaps:
- DMI/ADX;
- ATR;
- ret/trend persistence;
- prior high/low structure;
- path efficiency.

### Status

RWI = DIRECTIONAL_TREND_QUALITY_ROBUSTNESS_COMPARATOR
NO_INDEPENDENT_SCORE

If ADX survives direct-trend controls, RWI can later serve as alternate geometry robustness; otherwise it has no research priority.

## TI-140 — Coppock is a smoothed multi-horizon ROC bundle

Classic Coppock-style construction combines long-horizon rate-of-change terms and smooths their sum.

Therefore it is:
- multi-horizon return;
- plus smoothing/filtering.

This overlaps:
- ret horizons;
- KST;
- MACD/MA trend filters;
- returnVelocityShift;
- momentum persistence.

### Status

COPPOCK = MULTI_HORIZON_RETURN_FILTER / REDUNDANCY_VERY_HIGH
INDEPENDENT_VOTE = FORBIDDEN

Any monthly/long-term historical settings are not portable coefficients for the current daily selector.

## TI-141 — IMI is an RSI-like oscillator on candle-body movement

Intraday Momentum Index-style logic partitions each session by candle body:
- up body when Close > Open;
- down body when Close < Open;
then aggregates positive/negative body magnitudes into an RSI-like ratio.

This differs from ordinary RSI because:
- RSI uses close-to-close changes;
- IMI uses open-to-close body movement.

Therefore IMI may encode a different return component:
intraday body direction/magnitude rather than total close-to-close return.

But this information is already decomposable from raw OHLC and overlaps:
- candlestick body geometry;
- intraday vs overnight return decomposition;
- close location;
- Pattern candlestick layer.

### Status

IMI = CANDLE_BODY_MOMENTUM_COMPARATOR / POTENTIALLY_DISTINCT_BUT_REDUNDANCY_HIGH

It is NOT promoted to the main inference queue.

If later studied:
control direct open-to-close return/body metrics first.
If IMI adds nothing after those controls, reject it.

## TI-142 — BW MFI / Market Facilitation is effort-vs-result / liquidity geometry

Bill Williams Market Facilitation Index-style primitive:

MFI_BW = (High - Low) / Volume

This is range produced per unit volume.

It directly overlaps:
- priceProgressPerVolume;
- effort-vs-result;
- liquidity/illiquidity;
- true range response;
- EMV.

### Critical confounders

High range/low volume can indicate:
- efficient directional movement;
- thin liquidity;
- price-limit or stale-book effects;
- event gap/range;
- bad volume-unit semantics.

### Status

BW_MFI = PRICE_VOLUME_LIQUIDITY_COMPARATOR_ONLY
OWNER = PRICE_VOLUME

No independent technical vote.

## TI-143 — Klinger/KO is signed-volume plus moving-average filtering

Klinger/KO-style oscillators:
- infer a directional sign from a price/typical-price trend state;
- assign volume/volume-force accordingly;
- compare fast and slow smoothed series.

Information decomposition:
- price direction/trend classification;
- volume magnitude;
- moving-average filter.

This overlaps:
- OBV/signed-volume family;
- VPT/Force;
- volume trend;
- MACD-like filtering.

### Status

KLINGER_KO = NESTED_PRICE_VOLUME_FILTER / REDUNDANCY_VERY_HIGH
OWNER = PRICE_VOLUME

No independent technical vote.

## TI-144 — Volume-weighted MACD is a cross-family interaction, not a new family

Volume-weighted MACD variants replace or weight the moving-average input using volume-sensitive prices/averages.

This combines:
- trend filtering;
- volume weighting.

It is a TECHNICAL_TREND x PRICE_VOLUME interaction.

Potential value, if any, must be tested against:
- ordinary MACD/MA trend;
- direct volume/turnover;
- Price-Volume acceptance/response.

### Status

VW_MACD = CROSS_FAMILY_COMPARATOR_ONLY / NOT_INDEPENDENT

Do not count MACD + VW-MACD as two trend confirmations.

## TI-145 — Volume Oscillator is volume acceleration/filtering

A common Volume Oscillator:
shortMA(volume) - longMA(volume)
or a normalized percentage version.

Current Price-Volume engine already owns:
- relativeVolume5/20/60;
- volumeAcceleration/deceleration;
- volumePersistence;
- same-slot RVOL / cumulative pace.

### Status

VOLUME_OSCILLATOR = PRICE_VOLUME_REDUNDANT_COMPARATOR

No new factor.

## TI-146 — AR measures open-anchored upper/lower range asymmetry

Published Taiwan/XQ AR:

AR_N =
sum(High - Open, N)
/
sum(Open - Low, N)

This is not direct "market psychology" measurement.
It is an aggregate OHLC geometry ratio around the OPEN anchor.

For a bullish candle:
High-Open contains body + upper excursion;
Open-Low is lower excursion.

For a bearish candle:
High-Open is upper excursion;
Open-Low contains body + lower excursion.

Therefore AR compresses:
- candle-body direction;
- upper/lower excursion;
- open-relative range asymmetry.

Current overlap:
- candlestick body/wicks;
- close/open relation;
- high/low range;
- Pattern candlestick morphology.

### Status

AR = OPEN_ANCHORED_RANGE_ASYMMETRY_COMPARATOR / REDUNDANCY_HIGH

No universal bullish sign is assumed.

## TI-147 — BR is prior-close-anchored directional reach

Published Taiwan/XQ BR:

BR_N =
sum(High - PreviousClose, N)
/
sum(abs(PreviousClose - Low), N)

This anchors range reach to the PREVIOUS CLOSE rather than today's open.

It therefore mixes:
- overnight gap;
- intraday high/low reach;
- true-range-like directional asymmetry.

Overlap:
- gapPct;
- ATR/True Range;
- overnight/intraday decomposition;
- high/low excursion;
- candlestick/Pattern context.

### Status

BR = PREVCLOSE_ANCHORED_RANGE_ASYMMETRY_COMPARATOR / REDUNDANCY_HIGH

AR and BR are not independent "sentiment votes."
They are two anchor choices for range asymmetry.

Any future research must compare the raw primitive components before the ratios.

## TI-148 — ACC is momentum of momentum

Published XQ ACC explicitly applies another momentum operation to MTM.

Therefore ACC is a second-order return/momentum transform.

It belongs to the same residual question already frozen as return acceleration / returnVelocityShift.

### Status

ACC = RETURN_ACCELERATION_FAMILY / NO_NEW_FACTOR

Do not allocate a separate ACC outcome study.
If return acceleration is later tested, ACC may be a formula robustness comparator only.

## TI-149 — Q indicator is provenance-incomplete

Current public XQ documentation exposes:
- a price-change accumulation period;
- a smoothing period;
- a noise-smoothing period.

The reviewed public page does not expose enough exact formula semantics to independently reproduce:
- the accumulated-price-change definition;
- the noise definition;
- initialization;
- zero handling.

### Governance consequence

A named indicator with incomplete public formula contract is not eligible for promotion-grade research just because a platform can draw it.

Status:

Q_INDICATOR = FORMULA_CONTRACT_INCOMPLETE / DATA_SEMANTICS_UNKNOWN
SCORING = FORBIDDEN
OUTCOME_INFERENCE = BLOCKED

Revisit only when an exact reproducible formula/provenance source is established.

## TI-150 — Composite technical majority voting is structurally confounded

Current XQ documentation exposes a TechScore that sums 14 named indicators:
Aroon, RWI, CCI, CMO, RSI, MACD, MTM, KD, DMI, AR, ACC, TRIX, SAR and MA.

This is useful as an external practitioner benchmark.
It is NOT evidence that the 14 components are independent.

Our audit has already shown:
- CMO is RSI-family;
- MTM/ACC are return/acceleration family;
- MACD/TRIX/MA are filtered-trend family;
- KD/CCI are range-location/standardized-location family;
- Aroon is structural recency;
- RWI/DMI are directional trend-quality;
- SAR is position/path state;
- AR is OHLC range asymmetry.

Therefore raw vote count can overweight price-derived families many times.

### Frozen policy

COMPOSITE_MAJORITY_VOTE = REJECTED_AS_DEFAULT_ARCHITECTURE

If TechScore is ever benchmarked:
- treat it as one external composite;
- do not decompose its count into 14 independent evidentiary votes;
- compare it against family-aggregated architecture;
- require same-date/OOS/cost/redundancy controls.

## TI-151 — Residual primitive outcome

No new high-priority primitive emerged from TI-137..TI-150.

VHF/Choppy/Noise:
robustness comparators for PATH_EFFICIENCY_10.

RWI:
robustness comparator for ADX/direct trend quality.

IMI:
low-priority candle-body momentum comparator; direct open-to-close primitive must be tested first.

AR/BR:
low-priority anchored range-asymmetry comparators.

BW MFI/Klinger/VW-MACD/Volume Oscillator:
Price-Volume-owned comparators.

ACC:
same acceleration family as already-frozen returnVelocityShift.

Q:
formula-contract blocked.

TechScore:
external composite benchmark only.

Therefore existing research priority remains unchanged.

## Current status

VHF = PATH_EFFICIENCY_ROBUSTNESS_COMPARATOR
CHOPPY_NOISE = PATH_EFFICIENCY_RANGE_COMPARATOR
RWI = DIRECTIONAL_TREND_QUALITY_COMPARATOR
COPPOCK = REDUNDANCY_VERY_HIGH
IMI = LOW_PRIORITY_CANDLE_BODY_COMPARATOR
BW_MFI = PRICE_VOLUME_ONLY
KLINGER_KO = PRICE_VOLUME_NESTED
VW_MACD = CROSS_FAMILY_COMPARATOR
VOLUME_OSCILLATOR = PRICE_VOLUME_REDUNDANT
AR = LOW_PRIORITY_RANGE_ASYMMETRY
BR = LOW_PRIORITY_RANGE_ASYMMETRY
ACC = RETURN_ACCELERATION_ALIAS_FAMILY
Q_INDICATOR = FORMULA_CONTRACT_INCOMPLETE
TECHSCORE = EXTERNAL_COMPOSITE_BENCHMARK_ONLY

FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Extend redundancy registry with TI-137..TI-151.
2. Do not add VHF/Choppy/Noise as extra primary path-quality factors; use them only as robustness comparators for pathEfficiency10 if that residual survives.
3. Do not add RWI separately unless ADX/direct-trend-quality evidence first establishes a residual directional-trend question.
4. Keep IMI below direct open-to-close/overnight-intraday decomposition in the evidence hierarchy.
5. Treat AR/BR as derived OHLC asymmetry summaries; first test direct primitive geometry if ever needed.
6. Q remains blocked until exact formula contract is reproducible.
7. TechScore may later be an external benchmark against family-aggregated technical architecture, never a design authority.
8. Primary empirical queue remains unchanged.
9. Formal Core remains unchanged.

## Evidence anchors

- XQ AR: sum(High-Open)/sum(Open-Low).
- XQ BR: sum(High-PrevClose)/sum(abs(PrevClose-Low)).
- XQ ACC: momentum applied again to MTM.
- XQ TechScore: 14-indicator composite count.
- XQ VHF: trend-versus-horizontal filter.
- XQ Q: public parameter interface for price-change/smoothing/noise-smoothing, exact reproducible formula currently incomplete in the reviewed documentation.
