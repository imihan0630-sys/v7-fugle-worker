# Technical Indicator ADX vs Direct Trend Quality Decomposition V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / PRIMARY_QUEUE_DECOMPOSITION
Formal Core: LOCKED

## Purpose

Advance the third primary technical-indicator comparison:
DMI/ADX versus direct trend-quality descriptors.

No forward outcomes are inspected.

## TI-241 — DMI/ADX information pipeline

Standard Wilder-style pipeline:

1. True Range (TR):
max(
  High_t - Low_t,
  abs(High_t - Close_(t-1)),
  abs(Low_t - Close_(t-1))
)

2. Directional Movement:
+DM captures dominant upward High progression.
-DM captures dominant downward Low progression.
The weaker competing direction is normally zeroed for the bar.

3. Wilder smoothing:
TR, +DM and -DM are smoothed.

4. Directional Indicators:
+DI = 100 * smoothed(+DM) / smoothed(TR)
-DI = 100 * smoothed(-DM) / smoothed(TR)

5. DX:
DX = 100 * abs(+DI - -DI) / (+DI + -DI)

6. ADX:
smoothed DX.

Therefore ADX is a nested, directionless transformation of:
- high/low directional movement;
- gap-aware True Range;
- recursive smoothing.

## TI-242 — Exact sign-loss: ADX cannot encode direction

Because DX uses abs(+DI - -DI):
the sign of directional dominance is discarded.

High ADX can occur in:
- a strong uptrend;
- a strong downtrend.

Direction belongs to:
- +DI versus -DI;
- direct price structure;
not ADX alone.

Status:
ADX_DIRECTION = NONE_BY_CONSTRUCTION.

"High ADX = bullish" is a category error.

## TI-243 — +DI/-DI crossover is direction, not trend-strength proof

+DI > -DI means upward directional movement dominates the smoothed comparison.
-DI > +DI means downward directional movement dominates.

A crossover can occur while ADX is low or falling.
Therefore:
- DI cross;
- ADX level/slope
answer different subquestions.

However they are still built from the same H/L/TR input family and cannot be counted as independent cross-family evidence.

## TI-244 — Semantic overlap with direct trend-quality

Current system already carries or researches:
- HH/HL/LH/LL progression;
- trendPersistence;
- MA slopes/alignment;
- ret20/ret60;
- pathEfficiency;
- structural trend state;
- ATR/range volatility;
- Pattern prior-trend state.

ADX begins with a high redundancy prior.

The unresolved question:
Does H/L directional movement normalized by True Range add stable information beyond close-path and swing-structure trend-quality descriptors?

## TI-245 — Why ADX is not algebraically identical to close-path efficiency

A direct close-path efficiency metric can be defined as:
abs(C_t - C_(t-N)) / sum(abs(C_i - C_(i-1))).

It uses Close only.

DMI/ADX uses:
- High progression;
- Low progression;
- previous Close via True Range;
- winner-takes-direction +DM/-DM logic;
- Wilder smoothing.

Therefore:
same Close path with different intraday High/Low geometry can produce:
- identical close-path efficiency;
- different DMI/ADX.

So ADX cannot be rejected as an exact alias.

But this extra OHLC range information may overlap B7/B6 and still fail incremental-value tests.

## TI-246 — Decomposition into direction, strength and normalization

Future DMI/ADX representation must keep separate:

DIRECTION:
- plusDI;
- minusDI;
- diSpread = plusDI - minusDI;
- directionalDominance.

STRENGTH:
- DX;
- ADX;
- adxSlope.

NORMALIZATION:
- smoothed True Range.

Do not collapse them into one "ADX bullish" state.

## TI-247 — Threshold firewall

Common charting guidance often mentions:
- ADX < 20 as weak/trendless;
- ADX > 25 as stronger trend.

These are descriptive conventions, not Taiwan-optimal thresholds.

V0.1 research:
- preserve continuous ADX;
- use conventional bands only as descriptive QA if needed;
- no 20/25/40 threshold sweep;
- no threshold promotion without PIT/OOS/regime evidence.

## TI-248 — Lag/stability tradeoff is first-class

ADX is multi-stage smoothed:
- smooth TR/+DM/-DM;
- compute DI and DX;
- smooth DX again.

It is therefore expected to confirm trend strength later than direct path/swing measures.

Potential benefit:
- greater stability / fewer transient state flips.

Potential cost:
- confirmation delay;
- missed early trend transition.

Future ADX study must jointly measure:
- state stability;
- transition delay;
- false-strength episodes;
- false-transition count;
- opportunity delay.

Return separation alone is insufficient.

## TI-249 — Data semantics are stricter than close-only indicators

DMI/ADX requires High, Low and previous Close.

Mandatory guards:
- observed/validated H/L;
- TECHNICAL_CONTINUITY;
- corporate-action continuity;
- verified symbol-session membership;
- suspension/no-trade pseudo-bar exclusion;
- price-limit-constrained state.

A corporate-action jump can contaminate:
- TR;
- +DM/-DM;
- DI;
- ADX.

A price-limit session may show censored range/directional movement.
Such observations require a separate constrained stratum.

## TI-250 — Taiwan evidence interpretation

A 2019 National Central University thesis combines:
- fundamental screening;
- MA;
- ADX
for 37 Taiwan-listed/OTC companies over 2000-2017 and reports strong strategy performance.

This demonstrates feasibility of ADX in a combined rule set.
It does NOT isolate ADX incremental value versus MA, fundamentals or direct trend-quality.

Taiwan-specific standalone modern-regime ADX evidence remains insufficient for promotion.

## TI-251 — Frozen future incremental ladder

M0 BASE:
- ret5/10/20/60;
- MA slope/alignment;
- HH/HL/LH/LL;
- trendPersistence;
- pathEfficiency;
- ATR/volatility;
- Pattern lifecycle;
- market/sector regime;
- liquidity.

M1 DI_DIRECTION:
M0 + continuous DI spread/dominance.

M2 ADX_STRENGTH:
M0 + ADX level/slope.

M3 DMI_ADX:
M0 + preregistered non-redundant direction + strength representation.

Questions:
- Does DI direction add beyond direct swing/trend structure?
- Does ADX strength add beyond path efficiency/trend persistence?
- Does any residual survive response-delay and OHLC-range controls?

No optimized ADX thresholds.

## TI-252 — Current conclusion

Established:
- ADX is directionless by construction;
- high ADX is compatible with strong up and strong down trends;
- DI and ADX answer direction vs strength subquestions but share the same underlying H/L/TR family;
- ADX is not algebraically identical to close-path efficiency because it consumes H/L/TR geometry;
- multi-stage smoothing creates an explicit stability-versus-delay tradeoff;
- data semantics are more demanding than close-only RSI/MACD.

Unknown:
- whether DI adds beyond direct structural direction;
- whether ADX adds beyond direct trend-quality/path-efficiency;
- whether the extra H/L/TR information has modern Taiwan incremental value;
- whether any benefit survives price-limit/regime/cost controls.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Freeze DMI/ADX semantic field ownership and alias/redundancy mappings.
2. Do not promote standard ADX thresholds.
3. Future executable mechanics should use F1-F12 plus mirrored up/down fixtures.
4. Advance next to Bollinger Width vs ATR/realized-vol/VCP.
5. Formal Core remains unchanged.

## Evidence anchors

- Fidelity DMI/ADX technical guide: +DI/-DI directional movement, DX absolute directional separation, ADX smoothing; ADX describes trend strength rather than direction.
- Tseng (2019), National Central University, fundamental + MA + ADX strategy on Taiwan stocks; combined-strategy evidence only.
- Existing project Trend/Pattern/Volatility research provides the required direct comparators.
