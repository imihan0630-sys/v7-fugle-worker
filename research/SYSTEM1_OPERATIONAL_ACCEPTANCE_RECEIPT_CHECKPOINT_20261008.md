# System1 Operational Acceptance Receipt V0.1 — 2026-10-08

Status: CLASS-A READ-ONLY ACCEPTANCE / FORMAL CORE LOCKED / NO RUNTIME MUTATION

## Purpose

Produce one deterministic PASS/BLOCKED receipt for the genuine scheduled System1 after-market evidence chain.

This receipt is not the SDA-016 T48 generation-set finalization receipt and does not replace it.

## Genuine prospective rule

OPERATIONAL_RECOVERY_PASS is possible only when all of the following hold:

1. The collector event is GitHub schedule, never workflow_dispatch or push.
2. The schedule is exactly the existing 00:10 Taipei prospective collector: 10 16 * * 1-5 UTC.
3. The evidence session is exactly the previous Taipei calendar date at observation time.
4. C1 is complete, source-SHA pinned, digest-pinned, linked to a complete non-dry-run Formal pipeline.
5. C2 is the complete matched cohort for the exact same generation, source SHA and digests.
6. Generation inventory is complete/non-truncated and the exact parent origin is AFTER_MARKET_SCAN_PIPELINE.
7. V8.20+ Formal-C1 binding is VERIFIED, explicit, exact-parent, non-heuristic and non-backfilled.
8. H1-H5 readiness exists for the same generation and remains research-only with no optimization authority.
9. Evidence collection is contemporaneous with the decision session.
10. Formal selected count matches the binding. A verified zero-pick is allowed and is not a failure.

## Anti-forgery consequences

A later manual rerun can never create a genuine prospective PASS.

A prior failed date such as 2026-10-06 or 2026-10-07 cannot later be upgraded merely by reconstructing or backfilling artifacts, because it will fail the scheduled previous-Taipei-date rule and/or historical-backfill guard.

STAGE_SELECTION_ROUTE or any non-authoritative C1 generation cannot pass operational acceptance.

T1 H4/H5 may legitimately remain pending immediately after the scan; pending next-session entry evidence does not block normal System1 operational recovery.

## Workflow

The existing System 1 C1 Prospective Evidence workflow runs the acceptance builder only for scheduled executions, after C1/C2 and H1-H5 processing.

Artifact:
- artifacts/system1-operational-acceptance.json

Manual or push-triggered collectors do not execute the acceptance builder.

## Safety

No Worker, D1 schema, selection, A/B, comparator, ranking, Top6/3+3, capital, 15m semantics, maxChase, signal, push, trade, order or System2 behavior changes.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## Upstream failure receipt

Scheduled collection now runs the acceptance builder with an always-guard.

If C1, C2, generation inventory, binding, or H1-H5 artifacts are missing because an upstream scheduled step failed, the builder must still write `system1-operational-acceptance.json` with:

- status = BLOCKED;
- genuineProspective = false;
- firstBlocker = UPSTREAM_ARTIFACT_MISSING;
- exact missing artifact names/paths;
- upstream readiness status and verification failure when available.

The builder then exits non-zero, so the workflow remains failed while the diagnostic receipt is still preserved.

This closes the previous observability gap where an upstream failure could prevent the final acceptance receipt from existing at all.
