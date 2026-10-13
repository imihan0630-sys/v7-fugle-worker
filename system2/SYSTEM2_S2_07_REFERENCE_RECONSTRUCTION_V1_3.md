# System 2 S2-07 Reference-Price Reconstruction Gate V1.3

Updated: 2026-10-07 Asia/Taipei  
Status: RESEARCH_ONLY / BUILD_LANE / PHYSICAL_EXECUTION_PENDING  
Scope: 4806 / TPEX / CAPITAL_REDUCTION only  
Formal Core: LOCKED  
Trading authority: NONE

## Purpose

V1.2 proved that the MOPS historical list itself does not contain the official 14.87 reference price. A read-only detail replay then showed that the official MOPS full announcement does contain the approved reduction ratio before the last trading session.

V1.3 tests whether two independently sourced inputs can mechanically reconstruct the official 14.87 reference price without falsely promoting PIT availability:

1. approved share factor from the timestamped MOPS detail;
2. pre-action closing price from bounded RAW A1 lineage.

## Frozen 4806 input chain

Official MOPS approved plan:
- version key: 2026-09-08|17:03:24|1
- approved reduction ratio: 30.038878%
- each 1,000 old shares -> 699.6112203 new shares
- planned/approved new-share listing date: 2026-10-02
- MOPS source-reported clock: 2026-09-08 17:03:24 Asia/Taipei
- sourceReportedAt alone does not certify exact public availableAt.

RAW A1 pre-action close:
- market date: 2026-09-22
- close: 10.4
- availability class: OBSERVED_AVAILABLE_UPPER_BOUND
- actual availableAt in current archive: 2026-10-04T15:49:07.565Z
- therefore it cannot be backdated to support the 2026-10-02 resume-open replay.

Mechanical formula:
- approved share factor = 699.6112203 / 1000
- raw reconstructed reference = 10.4 / share factor
- decimal-2 reconstructed reference = 14.87
- official TPEx reference price = 14.87

The geometry may be exact while PIT remains blocked.

## States

Current physical target:

`REFERENCE_RECONSTRUCTION_MECHANICALLY_PROVEN_PIT_BLOCKED`

A future input-clock improvement may at most produce:

`REFERENCE_RECONSTRUCTION_CLOCK_CANDIDATE_REVIEW_REQUIRED`

Neither state grants `knownAtVersionClockCertified`, PIT replay, technical continuity certification, selection authority, push, capital or order authority.

## Required PIT gates

Both must be independently satisfied before a later review may consider promotion:

1. approved-ratio public availability must be certified beyond MOPS sourceReportedAt alone;
2. pre-action close must have canonical availability no later than the frozen resume-open cutoff.

Current prospective A1 observation from 2026-10-04 does not satisfy gate 2.

## Protected boundaries

No RAW bar mutation, adjusted-history persistence, corporate-action timestamp rewrite, S2-07 candidate authority, strategy/ranking/capacity, notification/push, capital/order, or System1 Formal Core change is authorized.
