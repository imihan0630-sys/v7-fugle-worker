# System 2 S2-07 Pre-Parent Evidence Cut V1.4

Updated: 2026-10-07 Asia/Taipei  
Lane: BUILD_LANE / shared TECHNICAL_CONTINUITY owner  
Status: RESEARCH_ONLY / MANIFEST_AND_FALSIFICATION_IMPLEMENTATION  
Formal Core: LOCKED  
Scheduler: NOT ADDED  
Trading authority: NONE

## Purpose

Continue directly from the physically accepted V1.3 exact-reference availability observer.

V1.3 proved that a prospective exact official row can carry a causal `availableAt`, while a late observation cannot be backdated into an earlier parent cutoff. V1.4 binds those observations into the next shared-owner provenance layer: an immutable pre-parent evidence-cut manifest plus a two-point no-revision-gap falsifier.

This version does **not** claim that the current single 4806 sample is a market-wide cut. The actual V1.3 sample must fail closed until a market-wide / exchange-wide / full-eligible source population and complete expected keyset are physically captured.

## Pre-parent manifest contract

`buildPreParentEvidenceCutManifestV1_4` requires:

- explicit `scanDate` and `evidenceCutoffAt`;
- scope class `MARKET_WIDE`, `EXCHANGE_WIDE`, or `FULL_ELIGIBLE_UNIVERSE`;
- required-market scope equals covered-market scope;
- selected-only capture is forbidden;
- all required source lanes are READY, query-complete, non-truncated, and hash-bearing;
- expected exact-version keyset is explicitly certified complete;
- every admitted V1.3 observation is genuine `PROSPECTIVE_EXACT_VERSION_OBSERVER` evidence;
- every observation `availableAt <= evidenceCutoffAt`;
- expected and observed exact-version keysets match exactly;
- no query truncation or budget truncation.

The manifest freezes:

- `evidenceCutId`;
- `sourceCutManifestHash`;
- expected/observed exact-version keys;
- payload/source-row hashes;
- availability clocks;
- required-lane hashes;
- market scope.

A valid pre-cut manifest still keeps `noRevisionGapThroughCut=false` until the later reconciliation is executed.

## Two-point no-revision-gap falsification

`reconcileNoRevisionGapThroughCutV1_4` compares the immutable pre-cut population to a later bounded-complete reconciliation.

It blocks when:

- the pre-cut manifest was not actually ready;
- post reconciliation is not after the cut;
- post population completeness is not certified;
- post population identity is unstable or truncated;
- any pre-cut version disappears;
- the same exact version key changes payload hash;
- a newly discovered version has `sourceReportedAt <= evidenceCutoffAt`.

The last case is:

`LATE_DISCOVERED_PRE_CUT_VERSION`.

Historical source-reported time is used only as a **falsification clock** here. It is not allowed to positively inject a missing historical version back into the old cut.

A later version whose source-reported time is after the cut is allowed as genuinely later information.

## Certification boundary

A clean reconciliation may set:

- `noRevisionGapThroughCut=true`;
- `noRevisionGapThroughCutCertified=true`;
- `certificationScope=EXACT_EVIDENCE_CUT_ONLY`.

It still does not certify:

- symbol-session completeness;
- TECHNICAL_CONTINUITY;
- all-history continuity;
- strategy/ranking/candidate authority;
- notification/push authority;
- capital/order authority;
- System 1 Formal Core changes.

## Physical diagnostic for current main

The dedicated read-only probe binds the accepted V1.3 4806 observation into V1.4.

Expected current result is intentionally negative:

- only one TPEX exact-reference observation exists;
- both TWSE and TPEX are required for the current dual-market System 2 source scope;
- the expected market-wide exact-version keyset is not yet certified complete;
- selected-only/single-sample scope is not authorized.

Therefore the actual V1.3 sample must remain `PRE_PARENT_EVIDENCE_CUT_BLOCKED` and cannot certify `noRevisionGapThroughCut`.

Synthetic unit tests separately prove the positive full-scope contract and the late-discovered-pre-cut falsification path without using market outcomes.

## Next gate

After V1.4 repository/physical acceptance:

1. construct a genuine market-wide / exchange-wide / full-eligible pre-parent capture from the already verified official source lanes;
2. freeze its expected exact-version population before the parent cutoff;
3. persist the immutable cut identity and source hashes;
4. after the parent, run bounded-complete reconciliation;
5. only if `noRevisionGapThroughCut` passes may symbol-session completeness and continuity receipts be bound to a genuine parent generation.

No scheduler or production authority is introduced by V1.4.
