# System 2 S2-07 Technical Continuity Bridge V1.1

Updated: 2026-10-07 Asia/Taipei  
Status: RESEARCH_ONLY / BUILD_LANE / PHYSICAL_EXECUTION_PENDING  
Scope: 4806 only  
Formal Core: LOCKED  
Trading authority: NONE

## Purpose

Continue only the single V1.0-positive RAW A1 lineage case, 4806 / TPEX / CAPITAL_REDUCTION, into a bounded event-boundary technical-continuity bridge.

V1.1 does not build an adjusted historical series. It joins:

1. V1.0 bounded RAW A1 lineage;
2. the official TPEx capital-reduction actual-result/reference source;
3. the RAW pre-suspension session bar;
4. the RAW resume-session bar.

The objective is to separate the official mechanical reference-price reset from the residual observed market move without rewriting RAW history.

## Required official source

Source contract:

- sourceId: `TPEX_CAPITAL_REDUCTION_REFERENCE`
- official endpoint family: TPEx `bulletin/revivt`
- required event family: `CAPITAL_REDUCTION`
- required effective/resume date: 2026-10-02
- required fields already frozen by the official continuity parser:
  - `最後交易日之收盤價格`
  - `減資恢復買賣開始日參考價格`

The parser must produce:

- `actualResultVerified=true`
- `continuityEffectState=VERIFIED`
- `technicalContinuityEvidenceEligible=true`
- positive `preActionClose`
- positive `officialReferencePrice`
- positive `referencePriceRatio`

## Boundary calculation

For the bounded event boundary only:

`officialReferencePriceRatio = officialReferencePrice / officialPreActionClose`

The pre-suspension RAW close is checked against the official pre-action close.

A non-persisted research bridge derives:

`transformedPreSuspensionCloseInReferenceSpace = rawPreSuspensionClose × officialReferencePriceRatio`

This value must reconcile to the official reference price.

Residual observed market movement is then described against the official resume reference price:

- `residualOpenGapRate = resumeRawOpen / officialReferencePrice - 1`
- `residualCloseMoveRate = resumeRawClose / officialReferencePrice - 1`

These residuals are descriptive research outputs, not alpha labels or trade signals.

## PIT firewall

The existing official historical actual-result parser deliberately records:

- `knowledgeTimeMode=HISTORICAL_UNKNOWN`
- `firstKnownAt=null`
- `availableAt=null`
- `pitEventReplayEligible=false`

Therefore a physically valid event-boundary bridge may be:

`BOUNDED_CONTINUITY_BRIDGE_READY_PIT_BLOCKED`

This means the mechanical reset geometry is physically evidenced today, but it is **not** certified as a historically available PIT transform at the 2026-10-02 replay clock.

V1.1 must not backdate the current official retrieval.

## Certification semantics

V1.1 may set:

- `boundedTechnicalContinuityBridgeReady=true`
- `mechanicalResetNeutralizedForBoundaryResearch=true`
- `residualMoveSeparatedFromMechanicalReset=true`
- `technicalContinuityScope=EVENT_BOUNDARY_ONLY`

V1.1 must keep:

- `technicalContinuityCertified=false`
- `allHistoryContinuityCertified=false`
- `continuityTransformPerformed=false`
- `historyMutationPerformed=false`
- `adjustedHistoryPersisted=false`
- `selectionAuthority=false`
- `finalSelectionEnabled=false`
- `livePushEnabled=false`
- `capitalImpact=false`
- `orderImpact=false`
- `system1RuntimeUsed=false`

## Fail-closed blockers

Examples:

- `RAW_A1_LINEAGE_NOT_READY`
- `OFFICIAL_EVENT_IDENTITY_MISMATCH`
- `OFFICIAL_EVENT_EFFECTIVE_DATE_MISMATCH`
- `OFFICIAL_REFERENCE_PAIR_NOT_VERIFIED`
- `OFFICIAL_REFERENCE_PAIR_INCOMPLETE`
- `OFFICIAL_REFERENCE_RATIO_INCONSISTENT`
- `PRE_SUSPENSION_RAW_BAR_MISSING`
- `RESUME_RAW_BAR_MISSING`
- `PRE_SUSPENSION_CLOSE_OFFICIAL_MISMATCH`
- `MECHANICAL_RESET_BRIDGE_MISMATCH`
- RAW OHLC / provenance / price-space identity blockers.

## Physical probe

`system2/scripts/probe_s2_07_technical_continuity_bridge_readonly_v1_1.mjs`

The probe will:

1. read the durable V1.0 physical receipt;
2. accept only 4806;
3. fetch the official TPEx capital-reduction result source for the bounded date range;
4. parse exactly one 4806 / 2026-10-02 event;
5. read only the two existing RAW A1 boundary rows from isolated D1;
6. evaluate the bridge;
7. assert zero D1 writes and all authority firewalls.

## Next gate

If the bridge is physically ready but PIT-blocked, the next problem is no longer price geometry. It is historical availability/version-clock provenance for the official reference event.

No strategy, factor, ranking or historical replay may silently consume this bridge until that PIT gate is separately resolved.
