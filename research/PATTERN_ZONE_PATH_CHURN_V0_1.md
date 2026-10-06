# D01 DL-049 — Zone Acceptance vs Directional Churn / Path Disorder V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / ZONE_PATH_FIREWALL / FORMAL_CORE_LOCKED

## Purpose

DL-048 separated time-at-price, traded-volume weighting and participant-position observability.

DL-049 asks whether repeated zone visits mean stable acceptance or simply noisy oscillation.

Repeated visits alone are ambiguous:
- calm residence near a zone;
- repeated side-to-side crossings;
- one-way traversal;
- volatile whipsaw;
- constrained price-limit / auction mechanics.

No directional alpha sign is assumed.

## Owner boundary

D03 owns fixed-window pathEfficiency10 / trend-quality primitives.

D01 does not duplicate D03 path efficiency.

D01 owns zone-local structural path semantics:
- relation to a frozen structural zone;
- side transitions;
- close-state changes;
- bar-span ambiguity;
- event-level exact crossings where data permit.

## Zone state

For completed bar close C and frozen zone [L,U]:

BELOW if C < L.
INSIDE if L <= C <= U.
ABOVE if C > U.

Close state is observable at completed-bar clock.

A bar whose low < L and high > U:
BAR_SPANS_ENTIRE_ZONE.

Its intrabar crossing order is UNKNOWN from OHLC alone.

Do not infer below-to-above or above-to-below ordering from high/low only.

## Two path families

### P0 CLOSE_STATE_PATH_PROXY

Uses completed bar close states only.

Allowed descriptors:
- eligibleStateCount;
- insideCloseCount;
- insideCloseShare;
- stateTransitionCount;
- sideFlipCount;
- outsideSideFlipCount;
- consecutiveInsideMax;
- firstInsideAt;
- lastInsideAt;
- netStartEndState.

This is a coarse path proxy.

### P1 EVENT_CROSSING_SEQUENCE

Requires timestamped price/trade/quote event sequence with replay-safe ordering.

Allowed:
- exact entry count;
- exact exit count;
- exact below-to-above crossings;
- exact above-to-below crossings;
- exact time inside zone where duration semantics are frozen.

P1 may not be synthesized from OHLC bars.

## Side-flip semantics

A side flip is a completed-state change:
BELOW -> ABOVE
or
ABOVE -> BELOW.

If an intermediate INSIDE state exists:
BELOW -> INSIDE -> ABOVE
records a cross-zone transition sequence but not an instantaneous side flip.

Store both:
- stateTransitionCount;
- outsideSideFlipCount.

Do not convert either into bullish/bearish votes.

## Acceptance vs churn

D01 freezes continuous descriptors rather than thresholds.

Acceptance-like geometry may involve:
- higher insideCloseShare;
- longer consecutiveInsideMax;
- lower side-flip rate;
- lower zone-normalized travel.

Churn-like geometry may involve:
- repeated side changes;
- short inside runs;
- repeated full-zone traversals;
- high travel relative to net displacement.

These are mechanism descriptions only.

No high/low acceptance threshold is frozen.

## Bar-span ambiguity

One OHLC bar can span both zone edges.

From OHLC alone D01 may store:
- barSpansEntireZone=true.

It may NOT assign:
- number of intrabar crossings;
- crossing direction sequence;
- time inside;
- first edge touched.

Exact event sequence is required.

## Zone-local travel

Allowed with completed closes:
- cumulativeAbsCloseTravel;
- netCloseDisplacement;
- zoneWidth;
- cumulativeTravelPerZoneWidth;
- netDisplacementPerZoneWidth.

A derived close-path efficiency may be described only as a local diagnostic and must be explicitly compared with D03 pathEfficiency10.

D01 does not create an independent trend-quality factor.

## Entropy caution

Information-theoretic or categorical entropy can summarize state disorder but:
- depends on state alphabet and window;
- can reflect volatility or microstructure noise;
- does not supply direction automatically;
- creates another parameter family.

V0.1 does not freeze a Shannon-entropy factor.

State-transition counts remain the minimal basis.

## Market-mechanics controls

Churn interpretation requires:
- legal tick regime;
- price-limit state;
- auction / continuous-session identity;
- volatility-interruption state;
- liquidity / spread context;
- corporate-action continuity.

Price-limit or auction-constrained oscillation is not ordinary free-market churn.

## Relation to DL-048

Time occupancy and path disorder are separate.

Two episodes can have equal visitedBarShare but different transition structure.

Two episodes can have equal transition count but different time/volume intensity.

Therefore D16 must test occupancy and path descriptors jointly.

## Information lineage

OHLC-derived zone path:
informationRoot=PRICE_OHLC.

Exact event crossing:
informationRoot can include TRADE_TIME or QUOTE_TIME.

All remain dependent on the same price process.

Default:
effectiveIndependentEvidenceCount=1;
independentVoteAllowed=false;
residualIncrementalityStatus=NOT_VALIDATED.

## Comparison classes

Z0 STRUCTURAL_ONLY
Z1 HIGH_OCCUPANCY_LOW_CHURN_CONTEXT
Z2 HIGH_OCCUPANCY_HIGH_CHURN_CONTEXT
Z3 LOW_OCCUPANCY_HIGH_TRAVERSAL_CONTEXT
Z4 EVENT_EXACT_CROSSING_CONTEXT
Z5 CONSTRAINED_MECHANICS_CONTEXT
Z6 NOT_EVALUABLE

Labels are descriptive research states; thresholds remain unfrozen in v0.1.

## Future D16 questions

Q1 occupancy beyond structural geometry.
Q2 churn/path beyond occupancy.
Q3 occupancy beyond churn/path.
Q4 whether apparent structural response disappears after D03 trend/path-efficiency controls.
Q5 whether bar-proxy effects survive exact event-sequence validation.
Q6 whether effects survive tick/limit/auction/liquidity controls.
Q7 whether any combined occupancy/churn representation adds residual information after de-duplication.

## Current decision

REPEATED_VISITS_EQUAL_ACCEPTANCE=FALSE.
OHLC_BAR_SPAN_EQUALS_EXACT_CROSSING_SEQUENCE=FALSE.
HIGH_CHURN_HAS_FIXED_DIRECTIONAL_SIGN=FALSE.
D01_DUPLICATE_D03_PATH_EFFICIENCY=PROHIBITED.
ENTROPY_FACTOR_V0_1=NOT_DEFINED.
DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT=1.
OUTCOME_JOIN=CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE=NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Build deterministic close-state path helper and exact-crossing eligibility guard.
2. Add adversarial pairs with equal occupancy but different churn and equal churn but different occupancy.
3. Preserve OHLC bar-span ambiguity.
4. Hand Z0-Z6 / Q1-Q7 residual/common-support inference to D16.
5. Keep D03 pathEfficiency10 as a control/owner primitive, not a D01 duplicate.
6. Next D01 science: separate churn caused by ordinary oscillation from event/auction/limit-driven discrete repricing and microstructure bounce.
7. No runtime wiring / no Formal change.
