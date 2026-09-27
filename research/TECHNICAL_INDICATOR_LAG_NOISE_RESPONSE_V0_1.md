# Technical Indicator Lag–Noise / Response Audit V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / FILTER_RESPONSE_SPEC
Formal Core: LOCKED

## Purpose

After freezing the B1-B8 semantic basis, this tranche studies a second source of false novelty:

> Different smoothing/filter constructions can look like different indicators even when they consume the same semantic basis.

A "faster" indicator is not automatically more informative.
It may simply trade smoothing/noise rejection for faster response.

This audit is about signal-processing behavior and research methodology, not trading alpha.

## TI-190 — Average age is not turning-point detection latency

For a length-N SMA with equal weights, the average age / center-of-mass of the samples is:

(N - 1) / 2 bars.

For a conventional EMA using alpha = 2/(N+1), the weight distribution has approximately the same average age.

But average age is NOT identical to:
- turning-point detection delay;
- crossover timing;
- step-response settling time;
- phase delay at every frequency.

Published market-timing research explicitly warns that average lag can be manipulated while worsening the smoothness-versus-turning-point tradeoff.

Therefore:
No indicator may claim "lower lag" from a single average-age number.

## TI-191 — The relevant tradeoff is response speed versus noise / false transitions

Smoothing filters reduce short-horizon variation by averaging past observations.
Stronger smoothing generally:
- reduces high-frequency fluctuation;
- stabilizes state;
- delays response to genuine path changes.

Reducing lag generally changes one or more of:
- noise pass-through;
- overshoot;
- phase distortion;
- false crossover/turn count;
- sensitivity to single bars.

There is no free assumption that lower delay = better signal quality.

### Research consequence
For any "low-lag" technical indicator, compare:
1. response speed;
2. noise sensitivity;
3. false-transition rate;
4. shape distortion;
5. transaction-turnover implications.

Do not compare entry timing alone.

## TI-192 — Frozen response metrics

For filter-like indicators, V0.1 diagnostics are outcome-blind.

### A. Step-response delay
Synthetic price changes from a stable level to a new stable level.
Measure:
- bars to 50% response;
- bars to 90% response;
- overshoot if any.

### B. Ramp / trend response
Synthetic constant-slope trend.
Measure:
- steady-state tracking error;
- slope-estimate bias;
- response to slope change.

### C. V-reversal response
Synthetic downtrend -> reversal -> uptrend.
Measure:
- first causal sign/state transition;
- confirmation delay;
- post-turn oscillation.

### D. Noise sensitivity
Add zero-mean high-frequency perturbations to the same latent trend.
Measure:
- state flips;
- crossover count;
- output variance;
- deviation from the noiseless reference.

### E. Shock sensitivity
Inject one abnormal bar/gap.
Measure:
- peak distortion;
- decay time;
- whether state remains contaminated after the shock.

These are detector/filter mechanics, not profit outcomes.

## TI-193 — SMA / EMA interpretation

SMA:
- finite window;
- equal weights;
- abrupt entry/exit of observations at the window boundary;
- symmetric finite impulse response in its trailing-window weight geometry.

EMA:
- exponentially decaying infinite-memory weights;
- more weight on recent observations;
- smoother recursive update.

Using conventional alpha=2/(N+1), SMA and EMA can have similar average sample age while still differing in frequency response and shock decay.

Therefore:
"EMA is faster than SMA of the same named period" is not sufficient as a universal technical rule.
The exact response metric must be named.

## TI-194 — MACD is a difference-of-filters transition descriptor

MACD DIF is:
EMA_fast(price) - EMA_slow(price).

The signal line smooths DIF again.
The histogram is DIF minus the smoothed signal.

Implications:
- DIF expresses filtered trend separation;
- the signal line adds smoothing and delay;
- the histogram emphasizes changes in DIF relative to its smoother.

The histogram can appear "earlier" than a signal-line crossover because it is a difference from a lagged smoother.
That does not mean it contains future information.

### Frozen falsification
MACD transition value must be compared with simpler causal alternatives:
- MA slope change;
- direct return-velocity shift;
- trendPersistence change;
- Pattern lifecycle change.

If the earlier transition is only a different filter response with higher false-turn/noise cost, no independent alpha is established.

## TI-195 — Low-lag MA variants are nested filter engineering

Examples include:
- DEMA;
- TEMA;
- HMA;
- zero-lag EMA variants;
- adaptive MA variants.

They may reduce some response delay metric.
But they remain B4 FILTERED_TREND_TRANSITION unless a genuinely new input/mechanism is introduced.

### Default status
LOW_LAG_MA_FAMILY = NESTED_FILTER_TRANSFORMS / NOT_NEW_SEMANTIC_INFORMATION

Any future study must compare on common input:
- turning-point delay;
- false-turn rate;
- noise amplification;
- turnover/cost;
- regime robustness.

No "fastest wins" rule.

## TI-196 — Oscillator smoothing has the same problem

KD:
- raw RSV is highly responsive range location;
- K/D smoothing reduces fluctuation but delays changes.

RSI:
- Wilder smoothing embeds memory in gain/loss balance.

StochRSI:
- adds another normalization layer and often increases sensitivity/extreme frequency.

Therefore threshold/crossover timing differences can come from:
- smoothing kernel;
- lookback;
- normalization;
not from new market information.

Future KD-vs-RSI research must separate:
A. different semantic input (B2 range location vs B3 signed-return balance);
B. different filter latency/noise.

Otherwise an apparent winner may simply be "faster" rather than incrementally informative.

## TI-197 — ADX has compounded smoothing latency

DMI/ADX typically:
1. computes directional movement and True Range;
2. smooths those components;
3. forms directional ratios / DX;
4. smooths DX into ADX.

Therefore ADX trend-strength confirmation is expected to be delayed relative to direct path-efficiency or directional-movement primitives.

This is not necessarily a defect:
- delay can filter transient noise;
- but may arrive too late for short-horizon entry timing.

Primary ADX-vs-trend-quality test must report:
- incremental state stability;
- transition delay;
- false-strength/false-transition rate;
not only return separation.

## TI-198 — Basis + response profile forms the proper technical feature identity

A technical indicator should no longer be identified only by its name.

Minimum research identity:
- semanticBasisIds[];
- formulaVersion;
- lookback / smoothing parameters;
- transformClass;
- responseProfileVersion;
- data continuity/session semantics.

Two indicators in the same basis can differ materially in response profile.
That can justify a robustness comparison.
It still does not make them independent evidence families.

## TI-199 — No-delay marketing firewall

Rejected claims without explicit diagnostics:
- "zero-lag";
- "faster than MACD";
- "earlier RSI";
- "more responsive trend";
- "less lag and smoother" simultaneously.

Required questions:
1. Faster under which response metric?
2. Smoother under which noise metric?
3. Is the comparison at equal effective memory / equal noise attenuation?
4. Does it use only causal data?
5. Does reduced delay increase state flips or turnover?
6. Does the indicator introduce a genuinely new semantic input?

If no new semantic input exists, classify it as filter engineering within an existing basis.

## TI-200 — Frozen outcome-blind filter fixture suite

Future executable research fixture classes:
F1_CONSTANT
F2_STEP_UP
F3_STEP_DOWN
F4_LINEAR_UP
F5_LINEAR_DOWN
F6_SLOPE_ACCELERATION
F7_V_REVERSAL
F8_CHOPPY_ZERO_DRIFT
F9_TREND_PLUS_NOISE
F10_SINGLE_GAP_SHOCK
F11_FALSE_BREAK_ONE_BAR
F12_LIMIT_CONSTRAINED_STAIR_STEP

For each candidate filter/indicator record:
- firstValidAt;
- warmupBars;
- response50Bars;
- response90Bars;
- firstStateTransitionBar;
- stateFlipCount;
- outputVarianceOnNoise;
- maxShockDistortion;
- shockDecayBars;
- prefixInvariant;
- replayExact.

No market outcomes are part of this fixture suite.

## Current status

FILTER_RESPONSE_AUDIT_V0_1 = FROZEN
LOW_LAG_VARIANTS = SAME_BASIS_UNLESS_NEW_INPUT_PROVEN
SPEED_ALONE = NOT_INCREMENTAL_VALUE
PRIMARY_DIRECTIONAL_QUEUE = UNCHANGED
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Add responseProfile semantics to the machine-readable technical basis/admission contract.
2. Do not add DEMA/TEMA/HMA/zero-lag variants to the outcome queue.
3. When the existing isolated technical core is next extended, use F1-F12 to compare mechanics before outcomes.
4. KD-vs-RSI must decompose semantic difference from latency/noise difference.
5. MACD-vs-trend must include response delay and false-transition diagnostics.
6. ADX-vs-trend-quality must include stability-versus-delay diagnostics.
7. Formal Core remains unchanged.

## Evidence anchors

- Zakamulin (2016), Moving Averages for Market Timing: average lag time is not the same as turning-point detection delay, and lower average lag can worsen the smoothness/delay tradeoff.
- Letchford, Gao & Zheng (2013), International Journal of Machine Learning and Cybernetics: financial smoothing filters face a noise-reduction versus lag tradeoff.
- Ehlers (2013), Cycle Analytics for Traders: compares SMA/EMA and interprets filters through frequency/lag behavior.
- Zhuo & coauthors (2021), JRFM MACD parameter study: MACD is based on lagging moving averages; increasing sensitivity can increase false signals, while reducing false signals can miss opportunities.
