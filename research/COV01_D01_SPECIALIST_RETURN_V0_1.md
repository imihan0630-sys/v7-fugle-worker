# COV-01 D01 Specialist Return V0.1

Updated: 2026-10-04 Asia/Taipei
Status: TERMINAL_RECOMMENDATION_READY
Formal Core impact: NONE
Module-count impact: NONE
Maturity impact: NONE

## Terminal recommendation
EXTEND_EXISTING_SCOPE

Proposed owner: D01-07, broadened to continuation/base morphology.

D01-07 owns pre-breakout morphology.
D01-05 remains breakout/failure lifecycle owner.
D01-08 remains VCP specialization.
D02 owns volume confirmation transforms.
D04/D05 own volatility/microstructure context.
Named labels are taxonomy views over shared geometry, not independent votes.

## Exact knowledge definition
Continuation/base morphology is replay-safe pre-breakout geometry represented by observable timestamped components rather than hindsight names. Families include platform/base, flag, pennant, triangle, wedge, high-tight-flag, cup/base and VCP as a D01-08 specialization.

## Ownership test
D01-05 cannot own the umbrella because it owns boundary challenge, breakout, retest and failure lifecycle rather than pre-breakout geometry.
D01-08 is intentionally narrow and cannot own generic flags, triangles, wedges, platforms or bases.
D01-07 already owns cup/base morphology and is the nearest coherent umbrella owner.

## Unique-contract test
No unique source, decision clock or replay primitive was found that would justify a new module. Existing D01 replay rules already cover confirmed swings, pivotAt/confirmedAt, as-of boundary fitting, provisional-leg restrictions, corporate-action continuity and missing-evidence UNKNOWN/BLOCKED semantics.

## Taiwan feasibility
Daily OHLCV and trading-day continuity can represent pole, boundary, touch, consolidation, rim, trough and pivot geometry. Historical OPEN limitations affect candlestick/gap families but do not create a unique contract for this umbrella.

## Anti-double-count
One structural parent may carry multiple candidate family labels but remains one parent observation.
Overlapping platform/flag/triangle/wedge labels are alternative descriptions, not independent votes.
D01-05 breakout evidence, D01-08 VCP contraction, D02 volume transforms and D04/D05 volatility context cannot be counted again as independent D01-07 votes.
Shared swings/boundaries retain shared provenance and effective sample identity.

## Maturity
Scope extension only. D01-07 keeps its current formal maturity and does not inherit maturity from neighboring modules. No promotion is authorized.

## Falsification
Strategy value is rejected if named labels add no residual information beyond shared geometry or existing Formal features, if effects vanish under same-date/regime/liquidity/sector controls, or if results depend on hindsight-finalized swings or duplicate labels.

## Final state
COV-01 specialist return: COMPLETE.
Terminal recommendation: EXTEND_EXISTING_SCOPE.
Formal Core: LOCKED.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Pattern alpha: UNKNOWN.
