# System 2 S2-07 Pre-Parent Evidence Cut V1.4.1

Updated: 2026-10-07 Asia/Taipei  
Lane: BUILD_LANE  
Status: RESEARCH_ONLY / IDENTITY_DOMAIN_CORRECTION  
Formal Core: LOCKED  
Trading authority: NONE

## Why V1.4.1 exists

Post-merge integration audit found V1.4 used V1.3 official reference-row `stableReferenceKey` in the generic exact-version keyset while the downstream `noRevisionGapThroughCut` contract uses MOPS disclosure-version `versionKey/sourceReportedAt` semantics. Those are different identity domains and must never be reconciled as if they were interchangeable.

No authority was granted by V1.4 and its physical result remained blocked, so no historical replay or selection result was contaminated. V1.4.1 supersedes V1.4 for pre-parent identity semantics.

## Frozen separation

V1.4.1 separates three evidence classes:

1. `requiredSourceLanes` — eight market-wide source lanes required by the existing D03 owner contract. They freeze whole-source payload/range/parser provenance.
2. `mopsVersionObservations` — prospective exact MOPS disclosure versions. Only this identity domain participates in expected/observed MOPS keyset equality and `noRevisionGapThroughCut`.
3. `referenceAvailabilityObservations` — V1.3 exact official corporate-action reference rows. These prove bounded reference availability by cutoff but explicitly do not count toward the MOPS keyset or no-revision-gap certification.

The manifest exposes:
- `referenceIdentityDomainCountsTowardMopsKeyset=false`;
- `mopsIdentityDomainCountsTowardNoRevisionGap=true`.

## MOPS version identity

A MOPS observation must preserve:
- `versionKey` from the certified source-reported date/time/sequence identity;
- an exact-version `versionPayloadHash`;
- `sourceReportedAt`;
- genuine prospective `firstObservedAt` / `firstObservedAvailableAt` no later than the evidence cutoff.

Historical `sourceReportedAt` remains one-directional falsification only. It cannot positively backfill a version into an earlier cut.

## Eight-lane gate

The owner pre-parent source cut must contain exactly eight unique required source lanes. Each lane must be READY, hash-bearing, observed by the cutoff, parser-complete, query-complete and non-truncated. Range-sensitive lanes additionally require verified range identity.

## V1.3 interoperability

V1.3 reference observations remain useful and are retained in the immutable manifest as a separate population. A V1.3 reference observation can never satisfy a missing MOPS disclosure version.

## Physical diagnostic

The current physical diagnostic deliberately feeds the accepted V1.3 4806 reference observation without the required eight source lanes or prospective MOPS population. Acceptance requires:
- the reference observation is retained;
- MOPS observation count remains zero;
- the reference key does not enter the MOPS keyset;
- the cut remains blocked on source-lane and MOPS-completeness gates;
- all trading and System1 authorities remain false.

## Next gate

After V1.4.1 acceptance, build the genuine event-driven market-wide cut using the already verified official lanes plus prospective MOPS exact-version observations for the frozen event population. Only the MOPS version domain may feed the later no-revision-gap reconciliation. Then, and only then, bind symbol-session/technical-continuity receipts to a genuine parent generation.
