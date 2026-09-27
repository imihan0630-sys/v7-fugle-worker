# Technical Indicator Corporate-Action Contamination Matrix V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / DATA-SEMANTICS_FALSIFICATION
Formal Core: LOCKED

## Purpose

Quantify how one purely mechanical price-reset boundary can contaminate different technical-indicator families when raw unbridged prices are used.

This is not a market-return study.

Synthetic economic truth:
- the underlying economic path is flat;
- there is no trend, momentum, volatility expansion or reversal;
- a 2:1-style mechanical reset changes quoted raw price from 100 to 50 at event index 50;
- post-event economic price remains flat.

Canonical TECHNICAL_CONTINUITY comparator:
- all bars are represented on the post-event 50 price scale;
- High/Low remain +/-1% around Close.

If an indicator reacts on the raw path, the reaction is known to be mechanical contamination.

## TI-342 — Frozen synthetic reset witness

100 bars.

RAW_EXECUTION-like path:
- indices 0..49: Close=100, High=101, Low=99;
- indices 50..99: Close=50, High=50.5, Low=49.5.

TECHNICAL_CONTINUITY comparator:
- indices 0..99: Close=50, High=50.5, Low=49.5.

No economic return, trend or volatility event exists in the comparator.

Event index:
50.

This fixture does not attempt to model one specific Taiwanese corporate action.
It isolates the generic piecewise price-scale discontinuity mechanism.

## TI-343 — Continuity comparator stays neutral

On the TECHNICAL_CONTINUITY path after warm-up:

KD:
- K=50;
- D=50.

RSI14:
- 50.

MACD:
- DIF=0;
- Histogram=0.

ADX14:
- +DI=0;
- -DI=0;
- ADX=0.

Bollinger20x2:
- BandWidth=0;
- %B=NULL due zero width.

This is the known economic baseline.

## TI-344 — Raw KD contamination is hybrid finite + recursive

At raw reset event offset 0:
- K=33.6569579288;
- D=44.5523193096.

Offset 5:
- K=5.2752140850;
- D=13.8838946822.

Offset 8:
- K=18.5892759461;
- D=11.5199948307.

Once the 9-bar rolling range contains only post-reset bars, raw RSV returns to 50, but K/D still retain recursive memory.

Offset 19:
- K=49.6368599928;
- D=48.2236185329.

Offset 40:
- K=49.9999271956;
- D=49.9991342300.

Interpretation:
- the rolling-extreme contamination is finite;
- the K/D smoothing tail is recursive;
- "the reset left the 9-day range" is not enough to prove exact state equality.

## TI-345 — Raw RSI can remain falsely pinned at zero

At event offset 0:
RSI14=0.

Offsets 1,5,8,9,13,19,20,30,40,49:
RSI14 remains 0.

Reason:
- the mechanical 100->50 delta enters avgLoss;
- no subsequent positive delta occurs on the flat post-event path;
- avgLoss decays but remains positive;
- avgGain stays exactly zero;
- the RSI formula therefore remains 0.

This is a decisive falsification of:
"one bad daily return will naturally wash out after 14 bars."

For Wilder RSI, a one-off contaminated boundary can retain a categorical extreme state indefinitely on a flat path until a positive gain occurs or state is recomputed from corrected continuity history.

Repair:
canonical replay, not waiting N bars.

## TI-346 — Raw MACD has a long decaying level-memory tail

At event:
- DIF=-3.9886039886;
- Histogram=-3.1908831909.

Offset 5:
- DIF=-13.1572165645;
- Histogram=-5.3247462309.

Offset 13:
- DIF=-12.2006805651;
- Histogram=-0.0195817678.

Offset 19:
- DIF=-8.9574780438;
- Histogram=+1.5943266031.

Offset 40:
- DIF=-2.0780474733;
- Histogram=+0.8731575901.

Offset 49:
- DIF=-1.0542735222;
- Histogram=+0.4718087252.

Economic truth remains flat.

Two false narratives can therefore coexist:
- DIF says persistent negative filtered trend;
- Histogram later says positive improvement/acceleration.

Both are merely filter recovery from a mechanical level shift.

## TI-347 — Raw ADX can become more extreme long after the mechanical reset

At event:
- -DI=64.8150795106;
- ADX=7.1428571429.

Offset 5:
- -DI=59.8908561435;
- ADX=35.8950007012.

Offset 13:
- -DI=49.9699528596;
- ADX=64.5664689780.

Offset 19:
- -DI=41.3869681389;
- ADX=77.2853351868.

Offset 30:
- -DI=25.8226789089;
- ADX=89.9474830170.

Offset 40:
- -DI=14.8331457633;
- ADX=95.2089800225.

Offset 49:
- -DI=8.3751751123;
- ADX=97.5409586514.

Meanwhile:
- +DI remains 0;
- economic price is flat.

Mechanism:
when only one directional side remains non-zero,
DX = 100*abs(+DI--DI)/(+DI+-DI)
can remain near 100 even as the absolute DI magnitude decays.

ADX then continues smoothing toward high trend-strength values.

This is not an implementation bug.
It is a consequence of the DMI normalization.

Critical interpretation:
ADX level alone cannot distinguish:
- a genuine persistent directional trend;
- residual normalized one-sided directional memory after a large mechanical shock.

This strengthens the requirement to control:
- continuity;
- direct pathEfficiency/trendPersistence;
- current DI magnitudes;
- structural state.

## TI-348 — Raw Bollinger contamination is finite and exact-window bounded

At event:
BandWidthPct=44.7066558312.

Offset 5:
BandWidthPct=107.8253104695.

Offset 9:
BandWidthPct=133.3333333333.

Offset 13:
BandWidthPct=141.0023290756.

Offset 19:
BandWidthPct=0.

Why:
Bollinger20 is finite-window.
At event+19 the 20-close window contains only post-reset closes.

Therefore the mechanical boundary disappears exactly once all pre-event scale observations leave the window.

This is fundamentally different from RSI/MACD/ADX recursive memory.

## TI-349 — Indicator-specific certification consequence

Bollinger20 / finite-window:
- exact clean 20-eligible-session continuity window can certify current state.

KD:
- needs clean rolling range plus replay-certified recursive K/D state.

RSI:
- needs canonical corrected return path and recursive gain/loss replay.

MACD:
- needs canonical corrected price path and EMA/signal replay.

ADX:
- needs canonical corrected H/L/C path and complete Wilder/DX/ADX replay.

One universal rule such as:
"wait 20 days after a corporate action"
is invalid.

## TI-350 — Data-semantic conclusion

Established by a known-truth synthetic witness:

Using raw piecewise price scales can create:
- false KD oversold state;
- RSI pinned at 0;
- long-lived negative MACD DIF followed by positive Histogram recovery;
- ADX rising toward extreme trend-strength values while economic price is flat;
- temporary huge Bollinger width that disappears only when the finite window clears.

The same economic path represented in TECHNICAL_CONTINUITY stays neutral.

Therefore TECHNICAL_CONTINUITY is not optional cosmetic normalization for technical-indicator research.
It is a first-order validity requirement.

No alpha inference is made.
No production threshold is changed.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Preserve this reset fixture as a permanent isolated semantic regression test.
2. Add per-indicator memory/certification class to the future snapshot contract.
3. Do not use elapsed-calendar-day or generic N-bar waiting as continuity repair.
4. Continue toward a prospective observer only after shared runtime continuity receipts exist.
5. Formal Core remains unchanged.
