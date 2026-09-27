# Technical Indicator MACD Response Profile V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / MECHANICS_QA
Formal Core: LOCKED

## Purpose

Execute the previously frozen F1-F12 lag/noise response fixtures against the isolated MACD reference:

EMA12_26_SIGNAL9_FIRST_CLOSE_SEED_V0_1.

This is a filter-mechanics study.
No market-return outcomes, thresholds or trading optimization are used.

## TI-319 — F1 constant control

80 closes at 100.

Result:
- DIF = 0;
- Signal = 0;
- Histogram = 0;
- no sign flips.

This is the zero-response baseline.

## TI-320 — F2/F3 step response is transient, not permanent trend evidence

F2:
40 closes at 100, then 40 closes at 110.

Key results:
- first positive DIF/Histogram: step bar 40;
- Histogram peak: bar 43, 1.2158215871;
- DIF peak: bar 48, 2.7789545396;
- Histogram first turns negative: bar 54;
- at bar 60 DIF remains +1.6870304669 while Histogram is -0.3386643700.

Interpretation:
A negative Histogram after a positive level shift does not mean price trend has become negative.
It means DIF is below its own slower signal line / the filtered separation is decelerating.

F3 step-down is the sign mirror.

## TI-321 — F4/F5 steady ramp

F4 linear rise:
Close = 100 + 0.5*i.

At bar 79:
- DIF = 3.4857028870;
- Histogram = 0.0067169435;
- Histogram sign flips = 0.

The DIF approaches a stable positive separation while Histogram tends toward zero as Signal catches up.

F5 linear decline is the sign mirror.

Implication:
Histogram near zero can coexist with a persistent directional trend.
It is a transition/acceleration descriptor, not a trend-presence score.

## TI-322 — F6 slope acceleration

First segment slope +0.2; second segment slope +0.8.

Histogram:
- bar39 = 0.0544343154;
- rises after acceleration;
- peaks around bar52 at 0.6075220907.

DIF continues rising and reaches 5.2621398407 by bar79.

This confirms the mechanical interpretation:
Histogram is sensitive to change in filtered trend speed.

This does not establish alpha.

## TI-323 — F7 V reversal: Histogram leads DIF zero-cross

Synthetic path:
40-bar downtrend followed by 40-bar uptrend.

Observed:
- at reversal bar40:
  DIF=-6.3517331069;
  Histogram=-0.1897418931.
- first Histogram > 0: bar42.
- first DIF > 0: bar55.
- lead = 13 bars.
- bar45:
  DIF=-4.5914976456 while Histogram=+0.9700077807.

Therefore:
HISTOGRAM_POSITIVE
does NOT imply
DIF_POSITIVE / FILTERED_UPTREND_CONFIRMED.

The correct semantics are:
filtered trend deterioration/improvement relative to its signal smoother.

## TI-324 — F8/F9 noise sensitivity

F8 alternating 101/99 around zero drift:
- Histogram sign flips after warmup = 46;
- DIF sign flips after warmup = 40.

F9 rising trend + sinusoidal noise:
- DIF stays positive in the measured warm region;
- Histogram sign flips = 14.

Clean F4 rising trend:
- Histogram sign flips = 0.

Thus:
Histogram transition sensitivity is materially higher than stable trend-direction state.
A lower-lag transition signal carries a measurable false-turn/noise burden.

## TI-325 — F10/F11 one-bar shock / false break

F10:
40 closes at 100, one close at 110, then back to 100.

At shock bar40:
- DIF=+0.7977207977;
- Histogram=+0.6381766382.

Then:
- Histogram becomes negative by bar44;
- DIF becomes negative by bar49;
- even though price has already returned to the unchanged 100 baseline.

The filter can therefore create post-shock sign reversals while digesting a one-bar impulse.

F11 with a +5 shock has the same timing pattern at half the amplitude, demonstrating linear filter scaling.

Implication:
one-bar breakout/shock can generate MACD transition states without a durable trend.

## TI-326 — F12 constrained staircase

Synthetic limit-like staircase generates:
- large positive DIF and Histogram during successive step-ups;
- Histogram later turns negative while DIF remains positive as the staircase stops.

Numerically:
- Histogram peak around bar44 = 5.7138990435;
- DIF peak around bar48 = 16.2007417727;
- at bar60 DIF still +10.0007012715 while Histogram is -1.9774359984.

But the fixture is semantically CONSTRAINED.
MACD cannot infer whether price discovery was free or exchange-boundary constrained from Close history alone.

Price-limit state must remain an external interpretation guard.

## TI-327 — Response-profile conclusion

Established mechanically:
- DIF direction and Histogram transition are different states;
- Histogram can lead DIF zero-cross substantially in reversals;
- Histogram can turn negative inside an otherwise positive level-shift/ramp state;
- Histogram is much more flip-sensitive in chop/noise;
- one-bar shocks create lingering filter-state reversals;
- price-limit/constrained discovery is invisible to MACD formula itself.

Therefore:
MACD residual research should focus on transition information conditional on structural/regime context, while explicitly penalizing false-turn / noise / shock sensitivity.

No conclusion about predictive returns is made.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Preserve this F1-F12 suite as outcome-blind mechanics QA.
2. Do not treat Histogram positive/negative as standalone BUY/SELL state.
3. Future prospective MACD residual inference must compare transition lead against false-turn rate, execution opportunity cost and direct return/MA-transition controls.
4. ADX/Bollinger isolated QA and MACD mechanics are now ready for durable checkpointing.
5. Runtime observer remains NO_GO.
