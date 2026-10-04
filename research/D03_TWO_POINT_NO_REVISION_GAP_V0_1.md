# D03 Two-Point No-Revision-Gap Certifier Candidate V0.1

Updated: 2026-10-04 Asia/Taipei
Lane: D03 -> shared TECHNICAL_CONTINUITY owner
Status: OUTCOME_BLIND / OWNER_CERTIFIER_CANDIDATE / D03_SELF_CERTIFICATION_FORBIDDEN
Formal Core: LOCKED

## Purpose

Operationalize the exact hard blocker left by TI-658:

`noRevisionGapThroughCut`.

D03 does not claim owner authority to certify it. This artifact freezes a falsifiable two-point candidate that the shared owner may review/adopt.

## TI-667 — pre-cut and post-cut populations serve different purposes

Pre-cut population proves what exact versions were prospectively observed no later than the evidence cutoff.

Post-parent bounded reconciliation tests whether the later complete bounded population reveals:
- a pre-cut version that was omitted;
- mutation of an already observed version;
- loss of a previously observed version.

A post-cut version with sourceReportedAt after the cutoff is later information and does not invalidate the earlier cut.

## TI-668 — certification candidate requirements

Candidate certification requires:
- market-wide/full-eligible scope;
- no pre-cut query truncation;
- no required UNKNOWN lane;
- immutable source-cut manifest hash;
- every pre-cut version has firstObservedAt <= evidenceCutoffAt;
- post reconciliation happens after the cutoff;
- post bounded population is certified complete;
- post population identity is stable;
- no post truncation;
- every pre-cut version remains present;
- same versionKey retains the same payload hash;
- no newly discovered post row has sourceReportedAt <= evidenceCutoffAt.

If any condition fails, `noRevisionGapThroughCut` is not certified.

## TI-669 — later post-cut revisions are allowed

A new version discovered after the cut does not invalidate the cut when its sourceReportedAt is later than the evidence cutoff.

It is recorded as later information.

This avoids the impossible rule that no company may publish any later correction after the parent.

## TI-670 — late-discovered pre-cut version is fatal

If post reconciliation contains a version absent from the pre-cut set and its sourceReportedAt <= evidenceCutoffAt:

`LATE_DISCOVERED_PRE_CUT_VERSION`

The source cut is blocked for promotion-grade use.

This remains conservative because historical sourceReportedAt alone is never used to positively admit the missing row into the old cut.

## TI-671 — version-key mutation is a provenance conflict

A pre-cut versionKey must retain an identical payload hash in post reconciliation.

Same key + changed payload:
`VERSION_PAYLOAD_MUTATION`.

This cannot be silently rewritten.

## TI-672 — D03 cannot self-certify owner completeness

The executable returns:
- `ownerCertificationRequired=true`;
- `d03SelfCertificationAuthority=false`.

Even a deterministic PASS is only a candidate proof rule.

Shared continuity owner must bind it to:
- bounded population-completeness semantics;
- source/version key construction;
- official source clock contract;
- symbol-session completeness;
- immutable evidence cut.

## TI-673 — maturity

No maturity increase.

The new candidate closes an algorithm-design gap around `noRevisionGapThroughCut`, but there is still no genuine prospective cut/parent/reconciliation execution.

Current:
- D03-10 Bollinger L2/40;
- D03-09 ADX L2/40;
- D03 aggregate 56.7%;
- raw source-version gate 2/3;
- outcomes closed.

## Exact next continuation

1. Shared owner reviews/adopts or rejects the candidate.
2. First genuine trading session: build pre-parent market-wide evidence cut.
3. After parent, perform bounded complete version reconciliation.
4. Owner returns noRevisionGapThroughCut only if the candidate invariants and owner completeness contracts pass.
5. Use the evidence-cut/receipt-created split to derive continuity without post-cut facts.
6. Bind every derived receipt to the genuine parent.
7. Execute Bollinger first; ADX only with canonical FULL_REPLAY.
