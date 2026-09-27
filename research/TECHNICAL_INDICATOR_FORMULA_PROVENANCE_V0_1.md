# Technical Indicator Formula Provenance / Cross-Platform Parity Audit V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / FORMULA_CONTRACT_AUDIT
Formal Core: LOCKED

## Purpose
Audit why the same named indicator can produce different values across the isolated research core, TA-Lib-like libraries, XQ/XS, broker charting platforms and other software.

A formula name such as "MACD 12/26/9" is incomplete provenance.

## TI-092 — Complete formula identity tuple

Promotion-grade formula identity should include:

1. indicator family;
2. input price/value series;
3. lookback periods;
4. smoothing kernel;
5. initialization/seed method;
6. warm-up/output-start policy;
7. zero-denominator/equal-price handling;
8. missing-bar/session handling;
9. corporate-action continuity space;
10. volume unit where applicable;
11. tie rule for rolling extremes;
12. implementation/version.

Two indicators with the same display name but different tuple values are not numerically guaranteed to match.

## TI-093 — Current isolated core audit

Current file:
research/technical_indicator_core_v0_1.mjs

Current formula versions:
- KD = TAI_KD_RSV9_K3_D3_INIT50_V0_1
- RSI = WILDER_RSI14_SMA_SEED_V0_1
- MACD = EMA12_26_SIGNAL9_FIRST_CLOSE_SEED_V0_1

### KD core
Input:
- high / low / close
- period 9
- initial K=50, D=50
- zero-range RSV=50
- recursive K = 2/3 prior K + 1/3 RSV
- recursive D = 2/3 prior D + 1/3 K

Output policy:
- first 8 bars are WARMUP/null;
- first ready value is bar 9.

### RSI core
Input:
- close-to-close change
- period 14
- first average gain/loss = simple average of first 14 deltas
- subsequent Wilder smoothing alpha = 1/14
- flat gains/losses => RSI 50
- loss=0 => 100
- gain=0 => 0

### MACD core
Input:
- close

EMA seed:
- first EMA value = first close
- signal EMA starts from first DIF value

Periods:
- fast=12
- slow=26
- signal=9

Internal readiness:
- warmupBars = slow + signal - 1 = 34

This is internally deterministic and prefix-invariant under the current tests.
It is NOT automatically cross-platform canonical.

## TI-094 — KD comparison with published XQ semantics

XQ published Stochastic/KD logic shows:
- RSV = 100*(Close-Lowest)/(Highest-Lowest);
- zero range => RSV=50;
- K/D initial values = 50;
- common 9,3,3 configuration;
- K and D recursive 1/3 smoothing.

Therefore the isolated core materially aligns with the published Taiwan/XQ convention on:
- source OHLC roles;
- RSV geometry;
- 50/50 initialization;
- 1/3 recursive smoothing.

Remaining parity question:
The published XQ script initializes K/D at CurrentBar=1 and then recursively updates, while the isolated core withholds output until a full 9-bar window exists.

Do NOT claim exact early-history parity without a direct fixture comparing:
- partial-window Highest/Lowest behavior;
- first published K/D timestamp;
- SetTotalBar/history preload behavior.

Status:
KD_FORMULA_FAMILY_ALIGNMENT_WITH_XQ = MATERIAL
KD_EXACT_PLATFORM_PARITY = NOT_PROVEN

## TI-095 — MACD input-series divergence is first-order

Published XQ MACD examples use:
WeightedClose = 0.5*Close + 0.25*High + 0.25*Low

Then:
DIF = XAverage(WeightedClose,12) - XAverage(WeightedClose,26)
MACD signal = XAverage(DIF,9)

The isolated research core uses:
Close
for both EMA12 and EMA26.

Consequences:
If H/L are symmetric around Close, WeightedClose may equal Close and the paths can align closely.
If the close is not centered within the bar, WeightedClose differs from Close and the MACD paths can differ even with identical EMA seed rules.

Therefore:
MACD_SOURCE_CLOSE and MACD_SOURCE_WEIGHTED_CLOSE are distinct formula contracts.

A chart mismatch must not be called a bug before input-series identity is checked.

## TI-096 — EMA seed divergence is also first-order

TA-Lib default EMA documentation:
- alpha = 2/(n+1);
- initial EMA = SMA of first n inputs.

Fidelity documentation likewise describes SMA use for the first EMA calculation.

XQ XAverage published logic:
- CurrentBar=1 => XAverage = current input price;
- subsequent values use EMA recursion.

TA-Lib also documents compatibility modes where first-input seeding exists.

Therefore:
SMA_SEED and FIRST_VALUE_SEED are both real conventions.

They converge asymptotically but are not exactly identical at a finite date.

## TI-097 — Warm-up length is not cross-platform parity certification

For EMA26:
lambda = 25/27 ~= 0.925926

A pure seed-state difference decays as:
error_k = lambda^k * error_0

After 33 updates:
lambda^33 ~= 0.0789

So about 7.9% of the original seed-state difference remains in the slow EMA component under this simple state-error model.

After 59 updates:
lambda^59 ~= 0.0107

This is a mathematical decay illustration only.

It proves:
"34 bars are available" is not equivalent to:
"first-value-seeded and SMA-seeded MACD are numerically identical."

Current core warmupBars=34 is an INTERNAL readiness convention, not a platform-parity guarantee.

No arbitrary convergence tolerance is frozen here.

## TI-098 — Cross-platform parity tiers

### Tier P0 — internal deterministic parity
Same code + same input rows + same formulaVersion -> exact replay.

Current core:
PASS in existing synthetic replay tests.

### Tier P1 — mathematical contract parity
Same:
- input series;
- periods;
- smoothing;
- seed;
- missing-data rules;
- warm-up;
- continuity space.

Requires formula-level fixture equality.

### Tier P2 — platform parity
Target platform's hidden/public implementation is matched exactly.

Requires:
- documented or empirically proven platform contract;
- enough source history;
- exact field semantics.

Do not infer P2 from matching period labels alone.

### Tier P3 — economic equivalence
Even if values differ slightly, strategy classifications/outcomes may be invariant.

This is a later robustness question.
It cannot be assumed from visual similarity.

## TI-099 — Formula-version schema fields to add in future research-only V0.2

Proposed metadata:
- indicatorId;
- inputSeriesId;
- inputSeriesFormula;
- periodTuple;
- smoothingKernel;
- seedMethod;
- outputStartPolicy;
- zeroDivisionPolicy;
- flatPricePolicy;
- rollingExtremeTiePolicy;
- eligibleSessionPolicy;
- continuitySpace;
- implementationVersion;
- compatibilityTarget = INTERNAL / TALIB_DEFAULT / XQ_PUBLISHED / OTHER;
- platformParityStatus = UNKNOWN / PARTIAL / PROVEN.

This is research metadata only.
No Worker/runtime wiring is authorized.

## TI-100 — Adversarial parity fixtures frozen

### F1 — WeightedClose vs Close divergence
Create asymmetric H/L bars with the same Close path.
Expected:
Close-based MACD and WeightedClose-based MACD differ.

### F2 — Symmetric bar control
H and L symmetric around Close.
Expected:
WeightedClose = Close exactly; source-series difference disappears.

### F3 — EMA seed divergence
Same source series:
- version A first-value seed;
- version B SMA seed.
Expected:
early values differ and converge gradually, not instantly.

### F4 — 34-bar false-certainty control
At 34 bars, do not assert seed-method equality merely because current core marks MACD ready.

### F5 — long-history convergence
Long stable history should reduce seed discrepancy materially.
No universal exact-equality horizon is claimed.

### F6 — KD early-window alignment
Compare:
- full-window-only isolated KD;
- platform convention using early partial history if applicable.
Expected:
later convergence may occur but early timestamp/value parity remains implementation-dependent.

### F7 — flat-range KD
H=L=C throughout.
Expected core RSV=50/K=50/D=50; compare platform zero-range policy.

## TI-101 — Research conclusion

Current isolated formulas are valid RESEARCH REFERENCE IMPLEMENTATIONS.

They are not "the one true KD/RSI/MACD."

The most important current cross-platform issue is MACD:
- source series differs across platforms;
- seed conventions differ across libraries;
- warm-up/output policies differ.

Therefore future empirical research must compare outcomes using one frozen internal formula first.
Do not mix platform outputs inside one cohort unless formula identity is proven.

Cross-platform parity testing is QA/robustness work, not alpha evidence.

## Current status

KD_INTERNAL_REFERENCE = FROZEN / XQ_FAMILY_ALIGNMENT_MATERIAL / EXACT_PLATFORM_PARITY_UNKNOWN
RSI_INTERNAL_REFERENCE = WILDER14_SMA_SEED / STANDARD_FAMILY_ALIGNMENT
MACD_INTERNAL_REFERENCE = CLOSE_FIRST_VALUE_SEED / INTERNAL_EXACT_REPLAY_PASS
MACD_XQ_PARITY = NOT_PROVEN_DUE_TO_WEIGHTED_CLOSE_AND_PLATFORM_CONTRACT
MACD_TALIB_DEFAULT_PARITY = NOT_PROVEN_DUE_TO_SEED_DIFFERENCE
FORMAL_OPTIMIZATION_CANDIDATE = NONE

Formal Core remains LOCKED.

## Exact next continuation

1. Keep current internal formulas unchanged for research comparability unless a separately versioned V0.2 comparator is created.
2. Never silently change seed/input semantics inside the same formulaVersion.
3. If cross-platform validation is needed, create explicit comparator implementations rather than altering the reference core.
4. Add formula provenance fields to future research snapshot schema only after schema review.
5. Use F1-F7 fixtures before claiming parity with XQ/TA-Lib/broker charts.
6. Keep alpha/outcome testing on one frozen formula version per cohort.
7. Formal Core unchanged.

## Evidence anchors
- XQ official KD/Stochastic script and RSV documentation: 9/3/3 family, RSV close-location, K/D init 50 and recursive smoothing.
- XQ official MACD script/function: WeightedClose input with XAverage fast/slow/signal.
- XQ XAverage published code: first input as initial EMA state.
- TA-Lib EMA/MACD default: SMA seed; compatibility modes may use first-value seeding.
- Fidelity EMA: first calculations use SMA; recursive EMA thereafter.
- StockCharts RSI: first 14-period average gain/loss is simple average, subsequent Wilder smoothing.
