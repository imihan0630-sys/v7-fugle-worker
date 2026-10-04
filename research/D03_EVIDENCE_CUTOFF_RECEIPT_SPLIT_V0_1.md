# D03 Evidence-Cutoff / Receipt-Created Split V0.1

Updated: 2026-10-04 Asia/Taipei
Lane: D03-09 / D03-10 -> shared TECHNICAL_CONTINUITY owner
Status: OUTCOME_BLIND / V0.3_TIMING_CANDIDATE / NO_RUNTIME_SCHEDULE_ADDED
Formal Core: LOCKED

## Purpose

Review the architecture explicitly left open by TI-657/TI-659:

> Can a continuity transform be computed after the immutable parent, while remaining promotion-grade causal evidence, if every source fact used by the transform was immutably frozen before the parent?

This is a timing-semantics review only. It does not weaken any formula, lineage, completeness or replay requirement.

## TI-661 — evidence availability and transform computation are different clocks

The existing v0.2 contracts use a single continuity-receipt `capturedAt` and require it no later than parent knownAt.

That is maximally conservative, but it couples:
- when source facts were causally available; and
- when a deterministic transform was materialized.

A later computation can remain PIT-safe only if it consumes **exclusively** an immutable pre-parent evidence cut.

The candidate split is:

- `evidenceCutoffAt`: latest source fact admitted to the immutable source cut;
- `receiptCreatedAt`: time the continuity transform/receipt is materialized.

Required causal ordering:

`source facts <= evidenceCutoffAt <= parentKnownAt`

while:

`receiptCreatedAt` may be after `parentKnownAt`.

This does not make post-parent facts legal.

## TI-662 — mandatory immutable evidence-cut identity

A valid candidate evidence cut requires:
- market-wide/full eligible-universe scope;
- immutable `evidenceCutId`;
- 64-hex source-cut manifest hash;
- exact expected/observed version-key equality;
- no query truncation;
- no budget truncation;
- zero UNKNOWN required lanes;
- owner-certified `noRevisionGapThroughCut=true`;
- owner-certified symbol-session completeness;
- zero late-discovered pre-cut versions.

The transform receipt must bind:
- the exact same `evidenceCutId`;
- `derivedOnlyFromEvidenceCut=true`;
- `postCutSourceFactCount=0`;
- an explicit evidence-cut manifest reference equal to the market-wide source-cut manifest hash;
- a separate symbol-transform input manifest hash;
- a hashed set of source-fact references;
- zero unbound source facts.

The market-wide source-cut manifest and the symbol-specific transform-input manifest are intentionally **not** required to be equal. They live at different provenance layers.

## TI-663 — every delivered bar remains bounded by the evidence cut

A post-parent computation cannot launder a post-cut history fetch.

Every delivered source bar must still carry a `sourceFetchedAt` no later than `evidenceCutoffAt`.

Thus:
- pre-parent source capture + post-parent deterministic transform may be valid;
- post-parent raw/history refresh + post-parent transform is blocked.

## TI-664 — v0.3 timing wrapper preserves v0.2 source/formula guards

The new research wrapper validates the timing envelope first.

Only after that PASS does it invoke the existing hardened:
- Bollinger v0.2 acceptance; or
- ADX v0.2 acceptance

using an internal causal timing projection anchored to `evidenceCutoffAt`.

No v0.2 formula/source-lineage rules are removed:
- exact Bollinger 20-session population remains required;
- ADX canonical-anchor FULL_REPLAY remains required;
- source/history hashes and raw-bar identities remain required;
- UNKNOWN/BLOCKED semantics remain fail-closed.

## TI-665 — physical deterministic falsification

The fixture must prove:
- pre-parent source cut + post-parent receipt creation can pass;
- late evidence cut blocks;
- unproven revision gap blocks;
- late-discovered pre-cut version blocks;
- wrong evidence-cut identity blocks;
- post-cut source fact blocks;
- source bar fetched after evidence cutoff blocks;
- wrong evidence-cut manifest reference blocks;
- unbound source facts block;
- valid Bollinger v0.2 remains valid;
- valid canonical ADX v0.2 remains valid.

No market outcome is inspected.

## TI-666 — maturity decision

Even if the v0.3 timing candidate passes its physical fixture:

- D03-10 remains L2/40;
- D03-09 remains L2/40;
- D03 remains 56.7%.

Reason:
the shared owner has not yet produced a genuine market-wide pre-parent evidence cut with:
- `noRevisionGapThroughCut=true`;
- symbol-session completeness;
- exact prospective MOPS version observations;
- first genuine V8.17 parent binding.

The candidate only removes the unnecessary requirement that the **transform computation itself** must finish before the parent, provided the evidence facts were already immutably frozen.

## Exact next continuation

Shared owner may choose the versioned split architecture only after review:
1. materialize immutable market-wide evidence cut before parent;
2. persist exact cut identity/hash and source/version population;
3. after parent, derive continuity only from that immutable cut;
4. bind receipt to parent and evidenceCutId;
5. reject any post-cut source fact or late-discovered pre-cut version;
6. run Bollinger v0.3 first across complete parent keyset;
7. ADX v0.3 only with canonical FULL_REPLAY;
8. no maturity promotion until genuine-session evidence exists.

Raw D03 source-version gate remains independently 2/3.
TI-005/TI-006 outcomes remain closed.
