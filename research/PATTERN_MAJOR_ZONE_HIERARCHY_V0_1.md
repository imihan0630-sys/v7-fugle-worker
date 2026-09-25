# Pattern Major-Zone Hierarchy v0.1 — Outcome-Free Pre-registration

Status: FROZEN_FOR_DETECTOR_QA / RESEARCH_ONLY / decisionImpact=false

## Purpose
Define one transparent nested-resistance hierarchy before any D1/D3/D5/D10, MFE/MAE or R01 outcome is inspected.

The hierarchy is descriptive context only. It does not veto a Formal breakout, change A/B, alter ranking, or create a buy/sell rule.

## Semantic space
- Geometry is computed in Corporate Actions lane `TECHNICAL_CONTINUITY`.
- Execution/reference prices remain `RAW_EXECUTION`.
- Economic outcome work may separately use `TOTAL_RETURN_COMPARABLE`.
- Pattern must not create a competing corporate-action adjustment engine.

If the required semantic-space provenance is UNKNOWN, nested-resistance state is DATA_BLOCKED rather than guessed.

## Hierarchy

### L0 — Formal local reference (comparator only)
- Existing `priorHigh20`.
- Existing Formal breakout truth is preserved exactly.
- L0 is NOT treated as a Pattern structural zone.
- Purpose: measure whether Pattern adds information beyond the current selector.

### L1 — BASE structural resistance
- Source swings: confirmed BASE Directional-Change scale, `k=2`.
- Threshold: `k * lagged ATR20%, frozen at the start of each leg.
- Lookback: last 120 expected symbol trading sessions as-of t.
- Minimum anchors: 2 confirmed swing highs.
- A swing may participate only when `confirmedAt <= asOfDate`.
- Distinct anchors must be separate confirmed swing events; consecutive daily bars near the same high do not count as multiple touches.

### L2 — MAJOR structural resistance
- Source swings: confirmed MAJOR Directional-Change scale, `k=3`.
- Same frozen lagged-ATR chronology.
- Lookback: last 260 expected symbol trading sessions as-of t.
- Minimum anchors: 2 confirmed swing highs.
- Designed to represent multi-month / roughly annual structural supply rather than a rolling maximum.

### L3 — 52-week / 260-session anchor comparator
- Simple rolling 260-session high and distance.
- Descriptor/control only, not a structural zone and never a hard veto.
- Purpose: test redundancy against Taiwan 52-week-high anchoring evidence and against L2 topology.

## Zone identity and immutable versioning
A zone version is identified by:
- symbol,
- scale,
- ordered constituent confirmed swing IDs,
- source semantic-space version,
- detector version.

Initial zone creation time is the confirmation time of the second qualifying constituent swing.
A later confirmed touch may create a successor zone version. It must not rewrite historical width/center/creation time.

## Zone center
Use the median constituent pivot price in TECHNICAL_CONTINUITY space.

Median is chosen ex ante for robustness to one extreme anchor. It is not selected using outcomes.

## Zone half-width v0.1
Freeze at zone creation:

`halfWidth = max(tickFloorWidth, atrToleranceWidth, constituentDispersionWidth)`

where:
- `tickFloorWidth = 2 * contemporaneousTickSize`;
- `atrToleranceWidth = 0.25 * ATR20_at_zone_creation`;
- `constituentDispersionWidth = max(abs(pivotPrice_i - zoneCenter))`.

Notes:
- 0.25 ATR and 2 ticks are detector-engineering constants, not alpha claims.
- If a future research version tests alternative widths, each alternative is a new detector version / multiple-testing definition. The v0.1 width may not be changed after seeing returns.
- Corporate-action mapping/tick-size source must be point-in-time safe.

## Descriptive outputs
For each as-of snapshot store:
- `localBreakout20` (existing Formal truth copied, never redefined);
- `nearestBaseZoneCenter/lower/upper`;
- `nearestMajorZoneCenter/lower/upper`;
- `baseZoneDistancePct`;
- `majorZoneDistancePct`;
- `availableAirPct` to the nearest zone lower bound above current price;
- `zoneAgeSessions`;
- `anchorRecencySessions`;
- `touchCount`;
- `repeatedTouchProgression`;
- `rejectionPersistence`;
- `zoneRelation = BELOW_ZONE | INSIDE_ZONE | ABOVE_ZONE | NO_ZONE | UNKNOWN`;
- `nestedConflictState`.

## Conflict semantics
`nestedConflictState` is descriptive, not a rejection rule.

If `localBreakout20=true`:
- nearest major zone ABOVE current price => `LOCAL_BREAKOUT_BELOW_MAJOR_ZONE`;
- current price inside major zone => `LOCAL_BREAKOUT_INSIDE_MAJOR_ZONE`;
- current price clearly above the frozen major zone => `LOCAL_BREAKOUT_ABOVE_MAJOR_ZONE`;
- no valid major zone => `LOCAL_BREAKOUT_NO_MAJOR_ZONE`;
- missing/provenance-guarded data => `UNKNOWN`.

No fixed 3%, 5% or other future-return-optimized air threshold is part of v0.1.
The C6 synthetic fixture's "small available-air" threshold is an adversarial test convenience only, not the research feature definition.

## Repeated-test progression
Touch count alone has no direction.

For successive confirmed resistance tests store:
- trough progression between tests,
- close/recovery progression,
- rejection distance from zone,
- rejection persistence,
- time between tests.

Only descriptive labels are allowed:
- `ABSORPTION_LIKE`;
- `BARRIER_PERSISTENT`;
- `AMBIGUOUS`;
- `INSUFFICIENT_TOUCHES`.

These labels do not imply bullish/bearish expected return until prospective evidence exists.

## Redundancy controls
Any later outcome study must condition on / compare with:
- `priorHigh60`;
- `MA60` distance;
- `ret20`;
- overheat penalty;
- R01 breakout quality/failure framework;
- simple 260-session-high distance.

If L2/L1 fields lose effect after these controls, nested resistance is rejected as redundant.

## Falsification
Reject predictive promotion if:
1. apparent effect disappears after current-system controls;
2. effect is dominated by one or two scan dates;
3. sign flips across BASE/MAJOR scales without mechanism;
4. effect exists only in pre-2020 or another obsolete regime;
5. alternative width variants are needed to rescue the result;
6. strong leaders are systematically rejected by a hard resistance interpretation;
7. corporate-action/suspension provenance explains the apparent zone interaction.

## Outcome firewall
No future outcome is allowed in:
- swing extraction;
- zone creation;
- zone width;
- zone identity;
- local/major relation;
- available-air computation.

Only after detector correctness, replay exactness, prefix invariance and data QA pass may frozen fields be linked to existing Shadow outcomes.

Formal Core remains LOCKED.
