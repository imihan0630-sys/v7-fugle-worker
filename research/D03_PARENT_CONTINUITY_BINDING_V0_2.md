# D03 Parent × Evidence-Cut Continuity Binding V0.2

Updated: 2026-10-04 Asia/Taipei
Status: OUTCOME_BLIND / V0.3_TIMING_INTEGRATION / NO MATURITY PROMOTION
Formal Core: LOCKED

## Purpose

Complete the provenance join for the candidate architecture:

pre-parent immutable evidence cut
× explicit parent decision cutoff
× post-parent deterministic continuity materialization.

V0.1 binding remains correct for a continuity receipt physically completed before the parent.
V0.2 adds a separate path for the evidence-cut / receipt-created split.

## TI-677 — parent decision cutoff is part of binding identity

Binding identity now includes:
- immutable parent generation;
- parent snapshot hash;
- `decisionCutoffAt`;
- `decisionAt`;
- parent knownAt;
- evidenceCutId;
- evidenceCutoffAt;
- source-cut manifest hash;
- timing-identity hash;
- continuity receipt identity;
- transform-input manifest hash;
- source-fact-reference set hash;
- source-history / transform hashes;
- exact eligible date-set hashes.

Changing parent generation, cutoff, evidence cut or continuity lineage changes bindingId.

## TI-678 — post-parent receipt creation is allowed only through validated timing envelope

V0.2 binding does not compare `receiptCreatedAt` directly to the parent decision.

Instead it requires the evidence-cut timing validator to prove:
- evidence facts frozen no later than `decisionCutoffAt`;
- no post-cut source facts;
- no unbound source facts;
- exact evidence-cut identity/reference.

Only then may a later deterministic receipt be bound.

## TI-679 — v0.3 indicator wrappers retain all v0.2 guards

After binding PASS:
- Bollinger calls the hardened finite-window v0.2 evaluator;
- ADX calls the hardened canonical FULL_REPLAY v0.2 evaluator.

No formula, continuity-lineage, raw-bar, session, anchor or replay rule is removed.

## TI-680 — deterministic end-to-end acceptance

Required fixture:
- post-parent Bollinger derivation from pre-cut evidence -> VALID;
- post-parent ADX FULL_REPLAY derivation from pre-cut evidence -> VALID;
- different parent generation -> different bindingId;
- missing decisionCutoffAt -> blocked;
- evidence cut after decision cutoff -> blocked;
- symbol mismatch -> blocked;
- eligible date-set mismatch -> blocked;
- binding created before derived receipt -> blocked.

## TI-681 — maturity

No maturity promotion.

This closes the integration-design gap between the new timing semantics and parent binding, but the real shared owner has not produced:
- persisted decisionCutoffAt;
- genuine pre-parent source cut;
- owner-certified noRevisionGapThroughCut;
- genuine first parent and complete keyset.

D03 remains 56.7%.

## Exact next

1. Owner must review/adopt the stricter cutoff/source-cut/no-gap contracts.
2. Persist decisionCutoffAt in a genuine parent generation.
3. Produce genuine pre-cut evidence.
4. Post-parent reconcile no gap.
5. Derive continuity only from that cut and bind with V0.2 identity.
6. Run complete Bollinger population first.
7. ADX remains canonical FULL_REPLAY.
