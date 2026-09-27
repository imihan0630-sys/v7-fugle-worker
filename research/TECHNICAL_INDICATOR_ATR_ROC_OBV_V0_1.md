# Technical Indicator ATR / ROC / OBV Redundancy Research V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / FALSIFICATION_SPEC
Formal Core: LOCKED

## Scope
Continue the dedicated technical-indicator lane after TI-026.
This tranche studies:
1. ATR as volatility/risk normalization versus a directional signal;
2. ROC / Momentum versus already-existing return and trend features;
3. OBV as a Price-Volume auxiliary comparator versus direct price-volume state.

No forward outcomes are inspected here.

## TI-027 — ATR role decomposition

ATR measures magnitude of True Range and is directionless by construction.
Its strongest plausible roles are:
- volatility normalization;
- stop-distance/risk geometry;
- abnormal-range context;
- volatility expansion/contraction;
- position/risk scaling.

It is not a directional predictor by itself.

### Existing-system overlap is already structural
Current Formal already uses ATR through multiple paths:
- atrPercent admission gate;
- channel-specific stop construction;
- stop distance -> reward/risk;
- reward/risk gate;
- reward/risk contribution to ranking/capital logic.

Therefore adding a new independent "ATR bullish/bearish score" would double-count a variable that already materially changes candidate survivorship and ranking.

### Primary research conclusion
ATR should be treated as RISK_NORMALIZER / VOLATILITY_CONTEXT first.
Any claim of incremental selection alpha must control for the existing ATR->stop->RR pathway, or selection conditioning will contaminate the result.

## TI-028 — ATR cross-lane firewall

ATR overlaps three existing research families:
- VOLATILITY_REGIME: stock volatility and market volatility;
- PATTERN: ATR-normalized swing/extension/geometry;
- FORMAL RR: stop and reward/risk construction.

Mandatory future comparisons:
- ATR% vs realized close-return volatility;
- ATR% vs Bollinger Band Width;
- ATR% vs trueRangeDryUp/rangeCompression;
- ATR% vs lateStage/overheat;
- ATR% vs selected/not-selected outcome after controlling RR geometry.

Do not ask "does high ATR outperform?" without decomposing the existing gate and RR selection path.

### Taiwan evidence retained
A 2025 NCU Taiwan-index-futures study combines Bollinger Bands and ATR mainly as volatility/risk and exit-setting tools. It supports practical risk-management use but is not direct stock-selection alpha evidence.

A 2026 Taiwan momentum study covering 1993-2025 finds volatility-scaled momentum variants outperform conventional variants across its performance measures. This is important positive evidence for VOLATILITY MANAGEMENT, not proof that raw ATR should become a directional stock-selection factor.

### Frozen implication
VOLATILITY SCALING and DIRECTIONAL ALPHA are different hypotheses.
Do not promote ATR as a bullish/bearish vote.

## TI-029 — ROC is algebraically redundant with retN

Standard price ROC:
ROC_N = 100 * (C_t / C_(t-N) - 1)

Current system return features use the same percentage-return geometry over fixed horizons.

Therefore, when the same price series and same horizon are used:
ROC_N == retN

This is not merely a high-correlation warning.
It is an algebraic duplicate.

### Status
ROC_LEVEL:
REJECTED_OR_REDUNDANT_AS_NEW_FACTOR

No separate ROC score should be created when equivalent ret5/ret10/ret20/ret60 already exist.

### Momentum absolute difference
Some software defines Momentum_N = C_t - C_(t-N).

Raw absolute Momentum is price-unit dependent:
- NT$5 movement on a NT$20 stock is not economically comparable to NT$5 on a NT$2,000 stock.

After normalizing by C_(t-N), it collapses to ROC/return geometry.

Therefore raw Momentum level is not a valid cross-sectional factor by itself.

## TI-030 — Residual ROC/Momentum question: acceleration only

Although ROC level duplicates retN, higher-order transition descriptors remain a separate hypothesis:
- rocSlope;
- deltaROC;
- momentumAcceleration;
- deceleration;
- sign change;
- cross-horizon curvature, e.g. ret5 - scaled ret20;
- persistence versus abrupt reversal.

These are not automatically useful.
They may merely restate:
- MA curvature;
- MACD histogram change;
- trendPersistence;
- recent return acceleration;
- breakout lifecycle;
- lateStage/overheat.

### Frozen falsification
Primary question:
Does return acceleration add incremental information after direct ret5/10/20/60, MACD histogram slope, MA slope change, Pattern lifecycle and market regime are controlled?

If no:
ROC/Momentum family becomes explanation-only.

### Taiwan regime evidence
Taiwan momentum is state-dependent rather than one-sign:
- Lin et al. (2016): positive momentum under market-state continuation and reversal under market transitions.
- Ho et al. (2023): past intraday returns and overnight returns have opposite future-return implications in Taiwan.
- 2022 NTU evidence after the 2015 price-limit widening reports coexistence of short-term momentum and reversal conditional on turnover.
- 2026 Taiwan momentum evidence supports volatility-scaled variants.

Therefore a generic ROC threshold has low prior portability.
Return origin, regime, turnover/liquidity and volatility context must be controls.

## TI-031 — ROC threshold firewall

Rejected assumptions:
- ROC > 0 = BUY;
- larger positive ROC is monotonically better;
- ROC oversold/overbought thresholds are stable across Taiwan regimes;
- positive ROC + MACD positive = two independent votes.

Current Formal already has:
- ret20/ret60;
- relative strength;
- lateStage/overheat;
- Pattern breakout context;
- trend persistence.

ROC cannot bypass this redundancy firewall.

## TI-032 — OBV information decomposition

Standard OBV update:
- if close_t > close_(t-1): OBV_t = OBV_(t-1) + Volume_t;
- if close_t < close_(t-1): OBV_t = OBV_(t-1) - Volume_t;
- if unchanged: carry forward.

Equivalent conceptual form:
OBV_t = cumulative sum of sign(close return) * volume.

Therefore OBV combines:
1. daily price direction sign;
2. total daily volume;
3. cumulative memory.

It discards:
- return magnitude;
- intraday path;
- gap vs intraday origin;
- close location;
- upper/lower rejection;
- same-slot seasonality;
- turnover value;
- effort-vs-result efficiency;
- institutional origin.

### Key redundancy prior
The existing Price-Volume engine already contains richer primitives:
- RVOL 5/20/60;
- same-slot RVOL;
- cumulative volume pace;
- volume expansion/dry-up/persistence;
- price response;
- close location;
- effort-versus-result;
- acceptance/rejection lifecycle;
- Pattern location context.

OBV therefore starts with a HIGH REDUNDANCY prior.

## TI-033 — Taiwan OBV evidence and counterevidence

Taiwan-specific evidence is mixed and old-period:
- a 2012 NSYSU thesis on Taiwan electronic/financial stocks found KD+OBV outperformed KD alone in its sample and that certain MA/KD/OBV combinations beat buy-and-hold after the financial crisis.
- an older Taiwan electronics study found OBV performance better than KD/MACD but below RSI in its sample.
These results support the possibility that signed-volume information can add context to price oscillators.

However:
- these studies predate the current post-2020 continuous-trading market;
- indicator combinations do not identify whether OBV adds information beyond modern direct volume/price-response features;
- old trading-rule performance cannot establish incremental value in the current selector.

A 2018 NCKU thesis explicitly addresses data-snooping with RSI/OBV/VHF across index futures and finds some technical rules retain predictability under robustness checks, but this is multi-market futures evidence, not direct current Taiwan stock-selection evidence.

### Frozen implication
OBV is not rejected outright, but it belongs to PRICE_VOLUME as a comparator, not an independent technical vote.

## TI-034 — OBV falsification plan

Primary representations:
- obvSlopeN;
- normalizedOBVChangeN = signed cumulative volume over N / total volume over N;
- obvPriceDivergence using the existing repaint-safe Pattern pivot chronology only;
- obvBreakoutLeadLag as a descriptive state, not a directional score.

Why normalize:
Absolute OBV depends on arbitrary starting point and cumulative history length.
Raw cross-sectional OBV level is not comparable.

Mandatory controls:
1. direct signed return;
2. total volume / turnover;
3. RVOL5/20/60;
4. same-slot/cumulative pace where relevant;
5. price response efficiency;
6. close location;
7. Pattern lifecycle;
8. effort-vs-result state;
9. liquidity;
10. regime/sector context.

Primary falsification:
If OBV slope/divergence adds no information after direct volume + price-response controls, retain OBV for UI/explanation only.

### Unit/provenance blocker
Unlike KD/RSI/MACD, OBV depends directly on volume magnitude.
Therefore:
- shares vs lots;
- sub-lot activity;
- trading-unit changes;
- suspension/no-trade pseudo-bars;
- corporate-action continuity
are first-order data-quality gates.

If volume magnitude is semantically unresolved, OBV magnitude is DATA_BLOCKED.

## TI-035 — Cross-family anti-double-counting map

ATR:
- owner: volatility/risk normalization;
- no directional vote by default.

ROC:
- level = retN duplicate;
- reject as separate score.

Momentum absolute difference:
- price-unit dependent;
- normalized form collapses to return/ROC.

ROC acceleration:
- research-only transition descriptor;
- must beat MACD/MA/ret-path controls.

OBV:
- owner: Price-Volume;
- signed-volume comparator only;
- must beat direct participation/response features.

### Multi-indicator majority voting remains rejected
Examples of invalid scoring:
- ROC positive + MACD positive + RSI high = 3 bullish votes;
- ATR low + BBW low = 2 compression votes;
- OBV up + RVOL high = 2 volume votes.

These are correlated transforms and must be aggregated/residualized within information families first.

## Current status

ATR:
RISK_NORMALIZER_CONFIRMED_ROLE / DIRECTIONAL_ALPHA_UNPROVEN / EXISTING_FORMAL_COUPLING_HIGH

ROC_LEVEL:
REJECTED_OR_REDUNDANT_AS_NEW_FACTOR

ROC_ACCELERATION:
RESEARCH_HYPOTHESIS / REDUNDANCY_HIGH / ALPHA_UNKNOWN

OBV:
PRICE_VOLUME_COMPARATOR_ONLY / REDUNDANCY_HIGH / DATA_SEMANTICS_SENSITIVE / ALPHA_UNKNOWN

FORMAL_OPTIMIZATION_CANDIDATE:
NONE

## Exact next continuation

1. Keep ATR out of any new directional score; treat volatility-scaling/risk-normalization as a separate research question.
2. Mark standard ROC_N as an alias of equivalent retN in the technical-indicator schema; never persist both as independent evidence.
3. Freeze one minimal acceleration descriptor before outcomes; do not parameter-sweep multiple ROC lookbacks.
4. Keep OBV under Price-Volume ownership.
5. Define normalized signed-volume comparator and compare it directly with existing RVOL/response/acceptance features.
6. OBV divergence must reuse the repaint-safe Pattern pivot chronology; no independent visual pivot selection.
7. Require explicit volumeUnit, symbol-session and sub-lot completeness before OBV inference.
8. Continue primary inference order already frozen: KD-vs-RSI -> MACD-vs-trend -> ADX-vs-trend-quality -> BBW-vs-ATR/VCP. ROC level does not enter the queue because it is already redundant.
9. After those gates, study ROC acceleration and OBV only if they address unresolved residual information.
10. Formal Core remains LOCKED.

## Evidence anchors

- Fidelity Rate of Change technical guide: standard ROC is percentage change between current close and close N periods ago.
- Lin, Ko, Feng & Yang (2016), Pacific-Basin Finance Journal: Taiwan momentum positive in market continuations and reversal in market transitions.
- Ho, Hsiao, Lo & Yang (2023), Pacific-Basin Finance Journal: Taiwan intraday-return momentum positive, overnight-return momentum negative.
- Ke (2022), NTU thesis, Short-Term Momentum in Taiwan Stock Market: post-2015 price-limit period shows short-term momentum and reversal coexist conditional on turnover.
- Huang, Pan & Wang (2026), Journal of Risk and Financial Management: volatility-scaled Taiwan momentum strategies outperform conventional variants in their 1993-2025 sample.
- Chang (2012), NSYSU thesis: KD+OBV outperformed KD alone in sampled Taiwan electronics/financial stocks.
- Jeng (2018), NCKU thesis: RSI/OBV/VHF technical-rule study with data-snooping robustness across index futures.
- Hung (2025), NCU thesis: Bollinger + ATR Taiwan index-futures strategy study; treated as risk-management/feasibility evidence, not stock-selection alpha proof.
