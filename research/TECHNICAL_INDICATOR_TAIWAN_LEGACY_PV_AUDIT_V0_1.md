# Technical Indicator Taiwan Price-Volume / Legacy Audit V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / REDUNDANCY_AND_ROLE_AUDIT
Formal Core: LOCKED

## Scope

Continue the technical-indicator lane after TI-122.

This tranche audits Taiwan/XQ-common legacy indicators:
- Force Index;
- EMV / Ease of Movement;
- VPT;
- VR / Volume Ratio;
- PVI / NVI;
- KST;
- Mass Index;
- RVI as published in the reviewed XQ script;
- Elder Ray;
- STARC channels.

No forward outcomes are inspected.

## TI-123 — Force Index is Price-Volume, not a new technical family

Published Force Index primitive:
Force_t = Volume_t * (Close_t - Close_(t-1))

Smoothed short/long averages are then compared.

Information content:
- signed close-to-close price change;
- price-change magnitude;
- volume magnitude;
- smoothing.

This is squarely a PRICE_VOLUME interaction.

Existing Price-Volume research already owns:
- return / response;
- RVOL;
- turnover;
- effort-vs-result;
- priceProgressPerVolume / response efficiency;
- persistence.

### Cross-sectional scale issue
Raw Force uses absolute price change, so it is affected by stock price scale and volume units.

A normalized version effectively moves toward return*volume/turnover-style measures already owned by Price-Volume.

### Status
FORCE_INDEX = PRICE_VOLUME_COMPARATOR_ONLY / REDUNDANCY_HIGH
INDEPENDENT_TECHNICAL_VOTE = FORBIDDEN

## TI-124 — EMV is a liquidity/price-impact proxy with strong confounding

Reviewed XQ EMV primitive:
midMove = midpoint_t - midpoint_(t-1)
range = High_t - Low_t
EMV ~ midMove * range / Volume

This asks whether price/range moved substantially with relatively little volume.

It is conceptually related to:
- price impact;
- Amihud-like illiquidity intuition;
- price progress per volume;
- response efficiency.

But low volume can reflect:
- true ease of movement;
- illiquidity;
- stale/no-trade risk;
- sub-lot/unit artifacts.

### Status
EMV = PRICE_VOLUME_LIQUIDITY_COMPARATOR_ONLY / CONFOUNDING_HIGH

It must be controlled by:
- liquidity;
- turnover value;
- spread/depth where available;
- price-limit state;
- volume-unit provenance.

No directional vote.

## TI-125 — VPT is cumulative return-weighted volume

Reviewed Taiwan/XQ VPT-like construction:
- compute a representative daily price;
- multiply its percentage change by volume;
- cumulatively add the result.

Information content:
- return sign/magnitude;
- volume;
- cumulative memory.

It is a magnitude-sensitive cousin of OBV/NVI/PVI.

Problems:
- arbitrary cumulative starting point;
- permanent memory of old shocks;
- direct volume-unit dependence;
- corporate-action/session sensitivity.

### Status
VPT_RAW_LEVEL = PRICE_VOLUME_ONLY / CUMULATIVE_MEMORY_HAZARD
VPT_SELECTION_FACTOR = REJECTED_AS_INDEPENDENT_FAMILY

Any bounded/windowed return-weighted-volume comparator would need to beat the richer Price-Volume engine.

## TI-126 — VR is almost a coordinate transform of signed-volume balance

Let:
U = sum volume on up-close days
D = sum volume on down-close days
F = sum volume on flat-close days

Classical Volume Ratio:
VR = U / D
(up to conventional scaling such as *100).

Frozen signedVolumeBalance20:
SVB = (U - D) / (U + D + F)

If F=0:
SVB = (VR - 1) / (VR + 1)
when VR is represented as U/D rather than percent.

Thus VR and signed-volume balance contain the same up-vs-down volume imbalance when flat-day treatment and window match.

When F>0:
SVB additionally retains flat-day volume in its denominator, so exact equivalence breaks unless the VR convention specifies how flat volume is allocated.

### Status
VR = SIGNED_VOLUME_IMBALANCE_FAMILY / NO_INDEPENDENT_VOTE

Required first step for any comparison:
freeze flat-day handling.

Do not outcome-test VR and signedVolumeBalance as two separate factors.

## TI-127 — PVI/NVI are conditional cumulative return paths

Reviewed XQ semantics:
- PVI updates return only when today's volume > yesterday's;
- NVI updates return only when today's volume < yesterday's;
- otherwise each cumulative series carries forward.

Therefore PVI/NVI encode:
- return;
- binary volume-change condition;
- cumulative path.

They do NOT identify informed versus uninformed traders by construction.

The traditional narrative that low-volume days represent "smart money" is not a measurement result.

### Existing overlap
- daily return;
- volume acceleration/deceleration;
- RVOL;
- Price-Volume interaction;
- persistence.

### Status
PVI_NVI = PRICE_VOLUME_CONDITIONAL_RETURN_COMPARATOR / NARRATIVE_CAUSALITY_FORBIDDEN
RAW_CUMULATIVE_LEVEL = STARTING_POINT_SENSITIVE

If studied, use bounded/windowed conditional-return decomposition rather than raw cumulative levels.

## TI-128 — KST is a weighted smoothed ROC bundle

Reviewed XQ KST:
- smoothed ROC12;
- smoothed ROC20;
- smoothed ROC30;
- smoothed ROC40;
- weighted 1:2:3:4.

Therefore KST contains:
- multi-horizon returns;
- moving-average smoothing;
- arbitrary fixed weights.

Current system already owns:
- ret5/10/20/60;
- momentum/trend persistence;
- returnVelocityShift;
- MACD/MA trend filters.

### Status
KST = MULTI_HORIZON_RETURN_FILTER / REDUNDANCY_VERY_HIGH
INDEPENDENT_VOTE = FORBIDDEN

The historical 12/20/30/40 and 1/2/3/4 specification is not a Taiwan-proven optimal parameter set.

## TI-129 — Mass Index is range-volatility expansion, directionless

Reviewed Mass Index:
1. smooth High-Low range;
2. smooth it again;
3. ratio of first-smoothed to second-smoothed range;
4. sum the ratio over a window.

It is explicitly directionless.

Information family:
- intraday range expansion/contraction;
- smoothed volatility acceleration.

Overlap:
- ATR;
- Chaikin Volatility;
- BBW;
- rangeCompressionSlope;
- trueRangeDryUp;
- volatility regime.

### Status
MASS_INDEX = VOLATILITY_COMPARATOR_ONLY / REDUNDANCY_HIGH

No universal reversal threshold is accepted.
The published threshold pairs are practitioner heuristics and must not be promoted.

## TI-130 — RVI name is ambiguous across platforms

"RVI" can refer to different indicators in technical-analysis software, notably:
- Relative Volatility Index;
- Relative Vigor Index.

The reviewed XQ 2019 script uses a Relative-Volatility-style construction:
- rolling close standard deviation;
- assign volatility to up/down state depending on close direction;
- recursively smooth up/down volatility;
- normalize as upVol / (upVol + downVol);
- then apply an additional high/low midpoint operation in that script.

This is NOT interchangeable with Relative Vigor Index formulas based on open/close/high/low vigor.

### Governance
Indicator acronym alone is invalid provenance.

Required:
- full indicator name;
- exact formula;
- source/platform;
- formulaVersion.

### Information overlap for reviewed XQ RVI
- RSI-like sign partition;
- realized volatility;
- smoothing.

### Status
RVI_ACRONYM = FORMULA_PROVENANCE_HAZARD
XQ_RELATIVE_VOLATILITY_VARIANT = RSI_VOLATILITY_NESTED / REDUNDANCY_HIGH

## TI-131 — Elder Ray is high/low distance from EMA

Bull Power:
High - EMA(Close,n)

Bear Power:
Low - EMA(Close,n)

Information:
- trend center;
- current high/low range location relative to center.

Overlap:
- MA distance;
- upper/lower excursion;
- wick/range morphology;
- ATR-normalized extension;
- support/resistance.

Raw values are price-unit dependent.

### Status
ELDER_RAY = STRUCTURAL_RANGE_AROUND_MA_COMPARATOR / REDUNDANCY_HIGH

A normalized version might be a descriptive range asymmetry, but no new evidence family exists.

## TI-132 — STARC channel is another MA ± ATR envelope

Published STARC:
- center = SMA;
- upper/lower = SMA ± constant*ATR.

This is the same information architecture as:
- Keltner-like trend/volatility envelope;
- MA center;
- ATR volatility width.

### Status
STARC = REJECTED_OR_REDUNDANT_AS_NEW_INFORMATION_FAMILY

No separate outcome study.

## TI-133 — Price-Volume ownership map

Move under PRICE_VOLUME governance:
- Force Index;
- EMV;
- VPT;
- VR;
- PVI/NVI.

Reason:
all require price-volume interaction and several require exact volume-unit/session semantics.

Technical-indicator lane may retain them only as compact comparators.

## TI-134 — Cumulative-line firewall

Raw cumulative indicators:
- OBV;
- VPT;
- PVI/NVI;
- ADL;
- some CV/CVI variants

share a structural problem:
absolute level depends on starting history and can retain old events indefinitely.

For cross-sectional inference prefer:
- bounded windowed ratios;
- slopes/changes with explicit horizon;
- exact source/provenance;
- rebase/replay rules.

No raw cumulative level may be treated as directly comparable across stocks.

## TI-135 — Magnitude-vs-sign decomposition

Price-volume legacy indicators can be grouped:

Sign-only:
- OBV style: sign(return)*volume.

Magnitude-sensitive:
- Force: absolute delta price*volume.
- VPT: percentage change*volume.

Conditional:
- PVI/NVI: return only on volume-up/down days.

Range/liquidity:
- EMV: midpoint move*range/volume.

Bar-location:
- CMF/ADL: close location within range * volume.

These are alternate compressions of richer raw OHLCV.
They must be compared within one Price-Volume family, not voted independently.

## TI-136 — Legacy-indicator research-budget decision

No indicator in TI-123..TI-135 is promoted to a new primary alpha hypothesis.

Useful compact comparators:
- CMF versus signedVolumeBalance/OBV-style;
- Force/VPT only if Price-Volume needs a magnitude-sensitive benchmark;
- EMV only as liquidity-efficiency robustness.

Rejected or downgraded:
- KST as return/filter bundle;
- Mass Index as volatility bundle;
- STARC as MA+ATR envelope;
- Elder Ray as MA/range descriptor;
- XQ RVI as nested sign+volatility oscillator.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Extend redundancy registry with TI-123..TI-136 ownership.
2. Do not allocate independent Shadow families to legacy Price-Volume indicators.
3. If Price-Volume later selects one compact benchmark, choose at most one per information role before outcomes.
4. Explicitly record RVI full-name/formula provenance to prevent cross-platform acronym collisions.
5. Continue audit of remaining Taiwan-common indicators only where a genuinely unresolved primitive may exist.
6. Formal Core unchanged.

## Evidence anchors
- XQ Force Index: volume*(close-close[1]) and smoothed variants.
- XQ EMV: midpoint movement * high-low range / volume.
- XQ VPT: representative-price return * volume accumulated.
- XQ VR docs: up-day volume divided by down-day volume.
- XQ NVI/PVI: cumulative returns conditional on lower/higher volume.
- XQ KST: weighted smoothed ROC bundle.
- XQ Mass Index: smoothed high-low range ratio accumulation.
- XQ RVI reviewed script: volatility assigned by price direction and smoothed.
- XQ Elder Ray: High-EMA and Low-EMA.
- XQ STARC: SMA ± ATR multiple.
