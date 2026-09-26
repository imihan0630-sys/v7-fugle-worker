# Pattern Latent Geometry Contract v0.1

Updated: 2026-09-26 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_FREE / FROZEN_V0_1
Formal Core: LOCKED

## Purpose

Define the transparent quantitative layer below named chart-pattern labels.

The contract exists to prevent:
- textbook label sign from becoming a score;
- duplicated scoring of overlapping patterns;
- outcome-tuned thresholds;
- hidden look-ahead through unconfirmed pivots;
- arbitrary scale selection.

The executable research implementation lives on Draft PR #103.

## 1. Confirmed boundary geometry

Function:
`analyzeConfirmedBoundaryGeometry`

Inputs:
- as-of bars;
- caller-supplied swing set;
- only anchors with confirmedAt <= asOfDate.

Outputs:
- upper/lower confirmed touch counts;
- upper/lower fitted slopes;
- price-scale-normalized slopes;
- fitted-line RMSE and normalized RMSE;
- fitted boundary width at first/last anchor;
- compression ratio;
- projected apex index/distance where mathematically defined;
- orientation from slope signs;
- exact confirmed anchor IDs.

No return-based triangle/platform/flag threshold is applied.

Interpretation:
- inward slopes + shrinking width = convergence geometry;
- same-direction slopes = channel-like geometry;
- near-horizontal slopes can support platform-like interpretation;
- these descriptions do not imply return direction.

## 2. Cup / bowl anchor geometry

Function:
`analyzeCupGeometryFromAnchors`

Requires explicitly confirmed:
HIGH(left rim) -> LOW(bottom) -> HIGH(right rim)

Outputs:
- depth;
- rim difference;
- left-decline / right-recovery duration;
- time symmetry;
- right-side recovery ratio;
- bottom residence in a predeclared lower-band fraction;
- normalized quadratic/bowl residual;
- exact anchor IDs.

The v0.1 bottom-band fraction defaults to 20% of bowl depth and is a descriptive implementation parameter, not a profitable/not-profitable cutoff. Any future use of a different band in outcome analysis is a counted variant.

The quadratic residual is descriptive only. A lower residual is not assumed to be better.

## 3. Impulse / consolidation geometry

Function:
`analyzeImpulseConsolidationGeometry`

Explicit anchors:
- pole start;
- pole end;
- consolidation end.

Outputs:
- pole return;
- pole path efficiency;
- pole duration/range;
- consolidation duration/range;
- consolidation depth from pole end;
- consolidation range relative to pole range;
- close retracement relative to pole;
- consolidation median volume relative to pole median;
- consolidation true range relative to pole.

No pole-strength threshold, depth cutoff or flag direction is assigned.

## 4. Repeated resistance progression

Frozen C8 remains as the old adversarial oracle:
same touch count can represent different progression.

New continuous function:
`analyzeResistanceTestProgression`

Outputs:
- low-to-resistance distance slope per test;
- close-to-resistance distance slope per test;
- fit residuals;
- pairwise improvement ratios;
- first/last rejection distance;
- rejection compression ratio;
- volume/turnover slope where present.

Touch count is unsigned.

A sequence approaching resistance with rising lows and shrinking close-distance may be described as absorption-like geometry, but this does not receive an ex-ante bullish score.

## 5. Two-day candlestick relational geometry

Function:
`analyzeTwoDayCandlestickMorphology`

Requires:
- OPEN;
- TECHNICAL_CONTINUITY semantic space;
- explicit as-of date.

Outputs:
- body/range;
- ATR-normalized body/range;
- wick ratios;
- close location;
- body overlap;
- containment/engulfment;
- open relation;
- penetration into previous body;
- prior-trend context;
- optional descriptive Engulfing/Harami/Piercing body-relation labels.

Named labels are taxonomy only.

## 6. Major-zone lifecycle

Function:
`analyzeMajorZoneLifecycle`

States:
- BELOW_MAJOR_ZONE
- APPROACH_MAJOR_ZONE
- FIRST_BREAK_ABOVE_MAJOR_ZONE
- HOLDING_ABOVE_MAJOR_ZONE
- REENTERED_MAJOR_ZONE
- FAILED_MAJOR_ZONE_BREAK

Continuous state fields include:
- first/last break date;
- break count;
- above-zone close streak;
- reentry count;
- first reentry;
- first failed-below date.

No N-close acceptance threshold is embedded.

## 7. Episode identity and overlap

Episode identity is based on:
- symbol;
- detector version;
- semantic contract version;
- family;
- scale;
- ordered structural anchor IDs;
- first confirmation date.

Same anchors with a later maturity label remain one episode.

Cross-family overlap is measured by:
- shared anchor count;
- union anchor count;
- Jaccard overlap;
- each episode's containment share.

No overlap cutoff declares labels independent.

## 8. Current Formal/PV redundancy controls

The latent Pattern layer must be compared against existing:
- ret20 / ret60;
- persistence / Residual RS;
- priorHigh20 / priorHigh60;
- dailyClosePosition;
- dailyUpperShadowRatio;
- breakoutQualityResearch;
- ATR / volatility20;
- platformRange20Pct;
- volumeContraction5to20;
- volumeTodayVsPrev5;
- overheat;
- market/sector regime;
- PV Shadow response/effort fields when clean.

This is critical because several Pattern descriptors are alternative representations of information already present in Formal/PV.

## 9. Scale / method governance

Primary detector:
confirmed Directional-Change swings with lagged ATR-frozen MICRO/BASE/MAJOR scales.

Secondary robustness:
PIP/rule and one-sided kernel only after primary QA.

Tertiary:
DTW exploratory.

ML:
deferred independent benchmark after clean prospective data maturity.

Never select method/scale based on future-return ranking.

## 10. Economic evidence status

Passing detector QA proves:
- deterministic computation;
- provenance;
- no-lookahead;
- scale invariance where expected;
- reproducible geometry.

It does NOT prove:
- predictive alpha;
- a bullish/bearish sign;
- net economic value after costs;
- selection-system improvement.

Current:
DETECTOR_QA = PASS
PROSPECTIVE_PATTERN_COVERAGE = NOT AVAILABLE
PATTERN_ALPHA = UNKNOWN
FORMAL IMPACT = NONE
