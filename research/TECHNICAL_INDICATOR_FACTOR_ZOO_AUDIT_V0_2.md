# Technical Indicator Factor-Zoo Audit V0.2 — Filter / Recency / Price-Volume Derivatives

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / REDUNDANCY_AND_ROLE_AUDIT
Formal Core: LOCKED

## Scope
Continue the dedicated technical-indicator lane after TI-050.

This tranche audits additional popular indicators by information content rather than popularity:
- PPO / APO / Awesome Oscillator;
- Chande Momentum Oscillator (CMO);
- True Strength Index (TSI);
- TRIX;
- Detrended Price Oscillator (DPO);
- Aroon;
- Vortex;
- Ultimate Oscillator;
- CMF / Accumulation-Distribution / Chaikin Oscillator;
- Chaikin Volatility.

No forward outcomes are inspected.

## TI-051 — PPO is normalized MACD-family information

Standard PPO:
PPO = 100 * (EMA_fast - EMA_slow) / EMA_slow

Standard MACD DIF:
DIF = EMA_fast - EMA_slow

Therefore PPO is not a new mechanism.
It is a scale-normalized MACD-family representation.

Current technical-indicator research already froze cross-sectional normalized MACD representations such as DIF/close and histogram/close. PPO uses the slow EMA as denominator instead of close, so it is not numerically identical to DIF/close, but it remains the same filtered-trend spread family.

### Status
PPO = MACD_NORMALIZATION_ROBUSTNESS_COMPARATOR / NOT_INDEPENDENT_VOTE

APO (absolute price oscillator) is simply an absolute MA spread and is even more price-scale dependent.

APO = REJECTED_AS_INDEPENDENT_CROSS_SECTIONAL_FACTOR

Future use:
If MACD survives direct-trend redundancy testing, PPO may be a scale-normalization robustness comparator. It does not receive separate evidence weight.

## TI-052 — CMO is an RSI-family affine transform under matched smoothing

Let G = smoothed or aggregated positive price changes.
Let L = smoothed or aggregated absolute negative price changes.

RSI under the common gain/loss form:
RSI = 100 * G / (G + L)

CMO with the same gain/loss aggregation:
CMO = 100 * (G - L) / (G + L)

Therefore:
CMO = 2 * RSI - 100

when both use the same G/L smoothing/aggregation kernel.

Implementation variants matter:
- original Chande CMO may use finite-window sums;
- some libraries apply Wilder smoothing;
- RSI implementations also vary in initialization/smoothing.

But this only changes filtering, not the underlying information family.

### Status
CMO = REJECTED_OR_REDUNDANT_AS_NEW_FAMILY

A differently smoothed CMO is at most an RSI smoothing robustness comparator, not a new factor.

## TI-053 — TSI is a doubly smoothed signed-return balance

TSI:
m_t = C_t - C_(t-1)

TSI = 100 * EMA(EMA(m)) / EMA(EMA(|m|))

Information decomposition:
- numerator = doubly smoothed signed return;
- denominator = doubly smoothed absolute return;
- result = normalized smoothed momentum balance.

This is conceptually between:
- RSI/CMO signed gain/loss balance;
- MACD/EMA filtered trend;
- volatility-normalized momentum.

It introduces smoothing architecture, not a new market data source.

### Redundancy controls
- RSI/CMO;
- MACD normalized magnitude/histogram slope;
- ret5/10/20;
- returnVelocityShift5v20;
- realized volatility / ATR;
- trendPersistence.

### Status
TSI = REDUNDANCY_VERY_HIGH / LOW_PRIORITY_ROBUSTNESS_COMPARATOR

No separate score or threshold study.

## TI-054 — TRIX is ROC of triple-smoothed EMA

TRIX:
1. EMA1 = EMA(Close, n)
2. EMA2 = EMA(EMA1, n)
3. EMA3 = EMA(EMA2, n)
4. TRIX = one-period ROC of EMA3

Therefore TRIX is:
- a heavy low-pass smoothing of price;
- followed by a one-period rate-of-change.

It is a filtered return/trend-transition descriptor.

Overlap:
- MACD;
- PPO;
- MA slope;
- return velocity;
- trendPersistence.

Potential distinction:
triple smoothing may suppress high-frequency noise more aggressively, but it does so at the cost of lag.

### Status
TRIX = FILTER_ROBUSTNESS_COMPARATOR_ONLY / REDUNDANCY_HIGH

Do not allocate a primary Shadow outcome budget before MACD-vs-direct-trend is resolved.

## TI-055 — Awesome Oscillator is another MA-spread family member

Awesome Oscillator:
medianPrice = (H + L) / 2
AO = SMA_fast(medianPrice) - SMA_slow(medianPrice)

This is a moving-average spread like MACD/APO, using median price and SMA rather than close and EMA.

Potential difference:
- uses intrabar midpoint;
- different smoothing kernel.

But it is still a filtered-trend spread.

### Status
AWESOME_OSCILLATOR = REJECTED_AS_NEW_INFORMATION_FAMILY

If ever used, it is a robustness comparator for MA-spread construction, not an independent vote.

## TI-056 — DPO is historical cycle visualization with a timing-coordinate hazard

Common DPO:
DPO = Close_(t - (n/2+1)) - SMA_n(t)

or equivalently a past price compared with a displaced moving average, depending on platform convention.

Key property:
DPO is displaced left so the visual series aligns historical cycle peaks/troughs.
Fidelity explicitly notes it does not compute to the present bar in the conventional plotted form.

### Consequence
DPO is poorly matched to current after-market stock selection because:
- it is intentionally centered/displaced toward historical cycle analysis;
- chart-coordinate placement can be confused with information-availability time;
- selecting a cycle length creates a large tuning degree of freedom.

### Status
DPO = CYCLE_RESEARCH_ONLY / ROLE_MISMATCH_FOR_CURRENT_SELECTION / PIT_DISPLAY_HAZARD

It must not be read from the plotted coordinate as if the value were known then.
Any future cycle research requires explicit calculationAsOf versus plotCoordinate.

## TI-057 — Aroon exposes a potentially distinct primitive: extreme recency

Aroon:
AroonUp = 100 * (n - barsSinceNPeriodHigh) / n
AroonDown = 100 * (n - barsSinceNPeriodLow) / n

Unlike most price indicators, Aroon measures TIME SINCE EXTREME rather than amplitude.

This creates a potentially distinct information question:
Given the same ret20, MA slope, distance-to-high and breakout state, does the recency of the latest structural extreme add information?

### Repository overlap audit
Current repository already contains:
- priorHigh20 / priorHigh60;
- priorLow20;
- local pivots with dates in resistance research;
- Pattern lifecycle/duration concepts;
- Price-Volume freshness/age concepts.

However no canonical general technical field equivalent to:
- daysSinceHigh20;
- daysSinceLow20;
was found in the active technical feature set.

Therefore the named Aroon signal is not promoted, but its recency primitive is NOT dismissed as a duplicate.

### Frozen system-native comparator
To avoid introducing a new 25-day lookback merely because canonical Aroon often uses 25:
- first research comparator uses the existing 20-session structural window;
- daysSinceHigh20 = number of eligible symbol sessions since the most recent occurrence of the 20-session highest high;
- daysSinceLow20 = number of eligible symbol sessions since the most recent occurrence of the 20-session lowest low.

Tie rule:
use the MOST RECENT occurrence of an equal extreme.

No calendar-day counting.
Verified suspension/non-symbol sessions are not ordinary elapsed trading bars.

Optional descriptive normalization:
highRecency20 = 1 - daysSinceHigh20 / 19
lowRecency20 = 1 - daysSinceLow20 / 19

This normalization is descriptive only.

### Required controls
- distance to priorHigh20/priorLow20;
- ret5/20/60;
- MA slope/alignment;
- Pattern lifecycle;
- breakout/failure state;
- volatility;
- overheat/lateStage;
- Price-Volume acceptance;
- market/sector regime.

### Primary falsification
If extreme recency adds no stable information after direct structural distance and Pattern lifecycle controls, reject it as redundant.

### Status
EXTREME_RECENCY_20 = WORTH_FALSIFICATION / STRUCTURE_RECENCY_HYPOTHESIS / ALPHA_UNKNOWN
AROON_NAMED_SIGNAL = NOT_PROMOTED

This is the only new residual information question promoted from this Factor-Zoo tranche.

## TI-058 — Vortex is a DMI/ATR cousin, not a new direction family

Vortex:
+VM = |H_t - L_(t-1)|
-VM = |L_t - H_(t-1)|
+VI = Sum(+VM,n) / Sum(TR,n)
-VI = Sum(-VM,n) / Sum(TR,n)

This uses:
- cross-bar high/low reach;
- True Range normalization;
- directional comparison.

It is not algebraically identical to DMI because DMI uses competing high-to-high / low-to-low directional movement rules.

But it occupies the same economic information family:
volatility-normalized directional range movement.

### Status
VORTEX = DMI_ROBUSTNESS_COMPARATOR / REDUNDANCY_HIGH

Required future question:
If ADX/DMI shows incremental value, does Vortex preserve that result under an alternate directional-range definition?
It does not receive separate score weight.

## TI-059 — Ultimate Oscillator is multi-horizon close-in-true-range momentum

Per bar:
BP = Close - min(Low, PreviousClose)
TR = max(High, PreviousClose) - min(Low, PreviousClose)

Then compute BP/TR-style aggregated ratios at 7, 14 and 28 sessions and combine with fixed weights 4:2:1.

Information decomposition:
- close location versus true low;
- True Range normalization;
- three momentum horizons;
- weighted recency.

Overlap:
- closeLocation;
- ATR/True Range;
- KD/range-location oscillators;
- direct multi-horizon returns;
- returnVelocityShift;
- Pattern acceptance/rejection.

### Status
ULTIMATE_OSCILLATOR = REDUNDANCY_HIGH / LOW_PRIORITY

The 7/14/28 and 4/2/1 design is a practitioner specification, not a Taiwan-proven coefficient set.
No threshold or divergence study is justified before direct components are resolved.

## TI-060 — CMF is a stronger Price-Volume comparator than raw cumulative ADL, but still not a technical vote

Chaikin Money Flow uses a close-location value:
CLV = ((C-L) - (H-C)) / (H-L)
    = (2C-H-L)/(H-L)

and weights it by volume over a window:
CMF = Sum(CLV * Volume) / Sum(Volume)

This preserves information OBV discards:
- where the close sits inside each bar's high-low range.

Therefore CMF is not identical to signedVolumeBalance20.

But it remains entirely PRICE_VOLUME information.

### Direct overlap
- closeLocation;
- volume;
- RVOL / turnover;
- effort-vs-result;
- price-response efficiency;
- acceptance/rejection.

### Important counterexample
Accumulation/Distribution-style measures can rise on a day that gaps sharply down if that day's close is near the top of its own intraday range.
Therefore "positive money flow" cannot be equated with positive close-to-close return or institutional accumulation.

### Status
CMF = PRICE_VOLUME_COMPARATOR_ONLY / PLAUSIBLE_RICHER_BASELINE_THAN_OBV / ALPHA_UNKNOWN

If Price-Volume later needs a compact benchmark, CMF is a more information-preserving comparator than raw OBV because it retains within-bar close location.
It still cannot bypass the richer canonical Price-Volume states.

## TI-061 — ADL and Chaikin Oscillator are cumulative/nested CMF-family transforms

Accumulation/Distribution Line:
ADL_t = ADL_(t-1) + CLV_t * Volume_t

Problems for cross-sectional use:
- arbitrary cumulative starting point;
- permanent memory of historical shocks;
- volume-unit/session continuity dependence.

Chaikin Oscillator:
applies a MACD-like fast/slow EMA difference to ADL.

Therefore it is a nested transform:
close-location x volume -> cumulative line -> MACD filter.

### Status
ADL_RAW_LEVEL = NOT_CROSS_SECTIONALLY_COMPARABLE / PRICE_VOLUME_ONLY
CHAIKIN_OSCILLATOR = NESTED_PRICE_VOLUME_FILTER / REDUNDANCY_VERY_HIGH

No independent technical vote.

## TI-062 — Chaikin Volatility is range-acceleration, already owned by volatility research

Chaikin Volatility:
HL_t = High_t - Low_t
E_t = EMA(HL, n)
CVI = 100 * (E_t - E_(t-m)) / E_(t-m)

This is simply:
- smoothed intraday range;
- followed by ROC of that range.

Overlap:
- ATR;
- realized volatility;
- rangeCompressionSlope;
- trueRangeDryUp;
- Bollinger width;
- volatility expansion/contraction.

It excludes gap information that ATR contains, which may make it a narrow robustness comparator but not a new family.

### Status
CHAIKIN_VOLATILITY = REJECTED_OR_REDUNDANT_AS_NEW_FACTOR

## TI-063 — Filter-family taxonomy

The reviewed indicator zoo collapses into a small number of primitive information families.

### Family A — Return / signed change
RSI, CMO, TSI, ROC, Momentum, returnVelocityShift.

### Family B — Moving-average / low-pass trend filters
MACD, PPO, APO, TRIX, Awesome Oscillator, MA slope.

### Family C — Range location / structural position
KD/Stochastic, Williams %R, Ultimate Oscillator, CCI, Bollinger %B.

### Family D — Directional range / trend strength
DMI/ADX, Vortex.

### Family E — Volatility / dispersion
ATR, BBW, Chaikin Volatility, realized volatility, range compression.

### Family F — Price-volume
OBV, signedVolumeBalance, MFI, CMF, ADL, Chaikin Oscillator.

### Family G — Structural recency/time
Aroon/extreme recency.

### Family H — Position management / visualization
Parabolic SAR, Heikin-Ashi, some Supertrend/Chandelier constructions.

The existence of dozens of named indicators therefore does not imply dozens of independent evidence families.

## TI-064 — Research-budget consequence

Prospective outcome evidence is scarce and date-clustered.
It should not be consumed testing algebraic aliases or deterministic wrappers.

Primary evidence queue remains:
1. KD vs RSI residual value;
2. MACD vs direct trend;
3. ADX vs direct trend quality;
4. BBW vs ATR / realized volatility / VCP.

Newly promoted residual after those primary gates:
5. EXTREME_RECENCY_20 (Aroon-derived primitive), because repository audit suggests recency-of-extreme is not yet a canonical technical field.

Already frozen later residuals:
6. returnVelocityShift5v20;
7. signedVolumeBalance20 or, if Price-Volume governance prefers a richer benchmark, CMF-style close-location-weighted volume comparator.

No other indicator from this tranche receives an outcome-testing priority.

## Current status

PPO = MACD_NORMALIZATION_COMPARATOR
CMO = REJECTED_OR_REDUNDANT
TSI = LOW_PRIORITY_REDUNDANT
TRIX = FILTER_COMPARATOR_ONLY
AWESOME_OSCILLATOR = REJECTED_AS_NEW_FAMILY
DPO = CYCLE_RESEARCH_ONLY / PIT_DISPLAY_HAZARD
EXTREME_RECENCY_20 = WORTH_FALSIFICATION / ALPHA_UNKNOWN
VORTEX = DMI_ROBUSTNESS_COMPARATOR
ULTIMATE_OSCILLATOR = LOW_PRIORITY_REDUNDANT
CMF = PRICE_VOLUME_COMPARATOR_ONLY
ADL = PRICE_VOLUME_ONLY
CHAIKIN_OSCILLATOR = NESTED_PRICE_VOLUME_FILTER
CHAIKIN_VOLATILITY = REJECTED_OR_REDUNDANT

FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Add EXTREME_RECENCY_20 to the research hypothesis ledger only, not runtime/score.
2. Freeze exact as-of/session semantics and adversarial fixtures for daysSinceHigh20/daysSinceLow20:
   - equal-high tie;
   - suspension inside window;
   - corporate-action boundary;
   - consecutive limit-up sequence;
   - new high today;
   - old high with same distance but different age.
3. Compare Aroon-derived recency against Pattern lifecycle freshness and target-resistance age concepts before declaring it unique.
4. Do not create PPO/CMO/TSI/TRIX/Vortex/UO/Chaikin Shadow rows as separate independent factor families.
5. Extend the machine-readable redundancy registry with this tranche.
6. Primary empirical queue remains unchanged until prospective coverage matures.
7. Formal Core remains unchanged.

## Formula/evidence anchors
- TA-Lib PPO: fast/slow moving-average difference divided by slow MA.
- Fidelity/TA-Lib CMO: gain/loss balance; matched-kernel CMO is affine-equivalent to RSI.
- TA-Lib/StockCharts TSI: double-smoothed signed price change divided by double-smoothed absolute change.
- Fidelity/TradingView TRIX: ROC of triple exponentially smoothed price.
- Fidelity DPO: displaced price-minus-SMA cycle oscillator; conventional plot does not extend to present bar.
- Fidelity Aroon: time since rolling high/low.
- StockCharts Vortex: cross-bar high/low movements normalized by summed True Range.
- Fidelity Ultimate Oscillator: weighted 7/14/28 buying-pressure / True-Range ratios.
- Fidelity CMF/Accumulation Distribution: within-bar close location weighted by volume.
- Fidelity Chaikin Volatility: ROC of EMA(high-low range).
