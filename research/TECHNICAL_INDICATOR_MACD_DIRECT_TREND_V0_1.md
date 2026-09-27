# Technical Indicator MACD vs Direct Trend Decomposition V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / PRIMARY_QUEUE_DECOMPOSITION
Formal Core: LOCKED

## Purpose

Advance the second primary technical-indicator comparison:
MACD versus direct trend / return-path descriptors.

The question is not whether MACD is useful visually.
The question is whether any MACD component contains incremental information beyond the direct EMA/MA/return/trend quantities already available.

No forward outcomes are inspected in this tranche.

## TI-226 — MACD component decomposition

Frozen implementation:
- fast EMA12;
- slow EMA26;
- DIF = EMA12 - EMA26;
- Signal = EMA9(DIF);
- Histogram = DIF - Signal.

All components are deterministic transforms of Close history.

Semantic ownership:
- B4 FILTERED_TREND_TRANSITION.

MACD introduces no new raw market-data source.

## TI-227 — Exact redundancy: zero-line state

DIF > 0
iff
EMA12 > EMA26.

DIF = 0
iff
EMA12 = EMA26.

DIF < 0
iff
EMA12 < EMA26.

Therefore:
MACD_ZERO_LINE_STATE is an exact alias of FAST_SLOW_EMA_ALIGNMENT.

It cannot be scored independently from EMA12/26 alignment.

Status:
MACD_ZERO_LINE_STATE = EXACT_ALIAS / NON_INDEPENDENT_VOTE.

## TI-228 — Exact redundancy: signal crossover and histogram sign

Histogram = DIF - Signal.

Therefore:
Histogram > 0
iff
DIF > Signal.

Histogram = 0
iff
DIF = Signal.

Histogram < 0
iff
DIF < Signal.

Thus:
- MACD "golden/death crossover" state; and
- Histogram sign

are the same binary relationship.

They may be represented separately for UI/explanation, but cannot count as two pieces of evidence.

Status:
MACD_SIGNAL_CROSS_STATE = EXACT_ALIAS_OF_HISTOGRAM_SIGN.

## TI-229 — Raw DIF magnitude is price-scale dependent

If all prices are multiplied by a positive constant a:
EMA12 and EMA26 scale by a,
so DIF scales by a.

Therefore raw DIF magnitude is not cross-sectionally comparable.

A NT$2 DIF means something different for:
- a NT$20 stock;
- a NT$2,000 stock.

The already-frozen primary normalized representation remains:
macdDifPct = 100 * DIF / Close.

Histogram:
macdHistogramPct = 100 * Histogram / Close.

PPO-style normalization is a related robustness comparator, not a new family.

## TI-230 — MACD is a difference-of-filters, not an independent momentum source

Recent operator analysis characterizes MACD as a smoothed derivative / band-pass-like operator built from moving averages.

System interpretation:
- DIF represents separation between a faster and slower filtered price path;
- Signal adds another smoothing layer;
- Histogram measures DIF relative to its smoother.

This explains why MACD may appear to capture "momentum" or "acceleration" while remaining structurally downstream of price trend filters.

No future-information claim is justified.

## TI-231 — What could still be incremental?

Components that are NOT automatically exact aliases of current simple trend labels:

1. normalized DIF magnitude;
2. DIF slope;
3. normalized Histogram magnitude;
4. Histogram slope;
5. expansion/contraction persistence.

But these still begin with a high redundancy prior versus:
- EMA/MA slope;
- MA alignment;
- ret5/10/20/60;
- returnVelocityShift5v20;
- trendPersistence;
- Pattern transition/breakout lifecycle;
- lateStage/overheat.

The residual hypothesis is transition timing / filtered curvature, not direction itself.

## TI-232 — Frozen direct-trend comparator set

Primary controls:
- ret5;
- ret10;
- ret20;
- ret60;
- MA20 slope;
- MA60 slope where available;
- EMA12/EMA26 alignment;
- normalized distance to MA20/60;
- trendPersistence;
- returnVelocityShift5v20 when prospectively valid;
- Pattern lifecycle;
- regime / sector / liquidity;
- overheat / lateStage.

MACD must beat these controls on common support.

## TI-233 — Response-profile confound

A MACD component may "signal earlier" than another trend indicator simply because its filter response differs.

Therefore future comparison must separate:
A. semantic information;
B. filter response.

Required outcome-blind mechanics from the frozen F1-F12 suite:
- response50Bars;
- response90Bars;
- firstStateTransitionBar;
- stateFlipCount;
- outputVarianceOnNoise;
- shockDecayBars.

If MACD transition is earlier but also materially noisier, that is a speed/noise tradeoff, not automatic incremental value.

## TI-234 — Synthetic state equivalences

Mechanical assertions to test in executable fixtures:

A. monotonic rise:
- DIF positive after transition;
- zero-line state equals EMA12>EMA26.

B. monotonic fall:
- DIF negative;
- zero-line state equals EMA12<EMA26.

C. flat:
- DIF ~0;
- Histogram ~0.

D. slope acceleration:
- Histogram can expand before a conventional signal-line crossover completes;
- this is a filter-state transition, not future information.

E. one-bar shock:
- DIF/Histogram distortion must decay according to filter memory;
- shock response must be measured, not interpreted as trend change by default.

F. choppy zero-drift:
- crossover count / false-transition rate is a key diagnostic.

## TI-235 — EMA seed/readiness audit

Current MACD core seeds EMA states with the first Close.

For a conventional EMA span N:
alpha = 2/(N+1)
and initial seed-state influence decays roughly as:
(1-alpha)^m.

For EMA26:
seed weight after m updates = (25/27)^m.

Approximate implications:
- first formula value exists immediately, but is not seed-stable;
- current research core conservatively labels MACD ready after 34 bars;
- at 34 total bars, the EMA26 first-close seed still has about 7.9% linear weight;
- at ~61 total bars, EMA26 seed influence falls below ~1%;
- at the current 65-bar D1 cache, the EMA26 seed weight is ~0.726%.

Thus the current 65-bar cache is materially more comfortable for MACD12/26 seed decay than for locally re-seeded RSI14.

Important:
this is seed-state weight, not a claim about exact MACD numeric error.

## TI-236 — MACD state-construction modes

As with RSI, future research must declare:

CONTINUOUS_STATE:
carry EMA12/26 and Signal state prospectively;

DEEP_HISTORY_RECOMPUTE:
recompute from sufficiently deep causal history;

FIXED_LOCAL_WINDOW_FORMULA:
define the local cache start/seed as part of the formula identity.

Platform parity requires matching initialization semantics.

No silent mixing across modes.

## TI-237 — Taiwan evidence remains frequency/sample dependent

Taiwan research has reported:
- MACD stronger than KD at weekly frequency in one 2003-2009 study;
- RSI/MACD strong sample-period results in a 2009-2014 stock-universe study;
- 2023 White Reality Check work finds some multi-indicator strategies survive OOS and transaction-cost tests for specific stocks;
- older Taiwan Reality Check evidence finds technical-rule economic profits can disappear after data-snooping, non-synchronous-trading and transaction-cost controls.

Therefore:
MACD popularity or historical sample performance does not establish a universal current daily-selection edge.

Frequency, population and validation method matter.

## TI-238 — Frozen future incremental ladder

M0 BASE:
direct returns + MA/EMA trend + trendPersistence + Pattern + PV + regime + liquidity.

M1 DIF_MAG:
M0 + normalized DIF magnitude.

M2 TRANSITION:
M0 + DIF slope + normalized Histogram / Histogram slope.

M3 FULL_MACD:
M0 + preregistered non-alias MACD residual fields.

Questions:
- Does normalized DIF add beyond direct EMA alignment/slope?
- Does Histogram transition add beyond returnVelocityShift / MA-slope change?
- Does any MACD residual survive noise/false-transition and cost controls?

Do NOT add:
- zero-line state separately from EMA alignment;
- crossover separately from Histogram sign;
- raw DIF magnitude cross-sectionally.

## TI-239 — Directional sign firewall

Positive DIF is not automatically BUY.
Negative DIF is not automatically SELL.

MACD can lag:
- breakout;
- reversal;
- failed breakout;
- shock recovery.

A crossover in a bearish structural state can be a temporary rebound.
A negative Histogram during a strong accepted trend can be deceleration rather than reversal.

Interpretation must remain conditional on:
- Pattern lifecycle;
- structural location;
- market/sector regime;
- PV acceptance;
- overheat/lateStage.

## TI-240 — Current conclusion

Established:
- zero-line state = EMA12/26 alignment exactly;
- signal crossover state = Histogram sign exactly;
- raw MACD magnitudes are price-scale dependent;
- MACD is a nested filtered-trend/transition family;
- remaining plausible residual is transition timing/curvature, not independent trend direction;
- 65 daily bars are enough to reduce EMA26 first-close seed influence below ~1%, under the current formula semantics.

Unknown:
- whether normalized DIF magnitude adds beyond direct trend controls;
- whether Histogram transition adds beyond direct acceleration/MA-slope-change controls;
- whether any benefit survives modern Taiwan regime, costs and false-transition burden.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Freeze machine-readable exact-alias relations for MACD zero-line/crossover fields.
2. Add F1-F12 expected MACD response assertions to research fixtures.
3. Keep outcome inference blocked until prospective state-construction semantics are frozen.
4. Then advance to ADX vs direct trend-quality with the same decomposition:
   direction, strength, normalization, smoothing latency and redundancy.
5. Formal Core remains unchanged.

## Evidence anchors

- Li (2025), Operator Analysis of MACD, arXiv:2509.21326: MACD as smoothed-derivative/band-pass-like filter structure.
- Wu (2010), Taiwan thesis, KD and MACD with White Reality Check: sample/frequency sensitivity.
- Chen (2023), NTU, White's Reality Check on Taiwan technical strategies.
- Chen, Huang & Lai (2011), Data Snooping on Technical Analysis: Evidence from the Taiwan Stock Market.
- JRFM (2021), MACD parameter/trading-rule study: lag and false-signal tradeoffs remain material.
