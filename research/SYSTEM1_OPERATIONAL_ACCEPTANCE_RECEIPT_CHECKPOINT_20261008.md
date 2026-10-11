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

## 2026-10-11 Taipei — Issue #1024 migration-safe native receipt recheck

Baseline main `ce39441dd2db1adb552dd76d2f0ea4b8220f1d4e`; Class A documentation only.
Durable producer handoff: `research/SYSTEM1_ISSUE1024_READONLY_HANDOFF_20261011.md`;
machine receipt: `research/SYSTEM1_ISSUE1024_NATIVE_RECHECK_20261011_V0_1.json`;
original GitHub REST metadata snapshots: `research/issue1024-native-recheck-20261011/`.

12 Run / 12 Job / 11 Artifact-list responses, 8 original artifact digest records; recent Actions listing 266 distinct runs across 3 pages. ZIP/raw business log replay incomplete (API 401, browser download timeout/Job rendering error, supplemental API 403 rate limit). Historical costs are pinned-main inherited contents plus rechecked native provenance, not newly measured costs. Account whole day vs V7_DB whole day vs 23:35/23:55 per-operation costs remain separate; 09/21 and 09/22 account totals and 10/08 daily usage UNKNOWN in this intake. KV config/plan/report and D1 cron/lease require original same-generation Formal C1 lineage; an old plan or lease is insufficient.

P01 support 3/7, P02 3/7, P04 2/7 (8/21); physical 0/3, CORR-003 0/5, HIGH/VERIFYING. Both reserve authorizations false, numeric candidates/authorized rows null. No independent acceptance or correction closure is claimed. Next: after natural 2026-10-12 23:35 Taipei and conditional 23:55 if invoked, original authenticated per-operation costs, six-role matching readback and fresh account-wide UTC-day ledger/no-collision; D1 SQL requires qualified read headroom. REMEDIATION receives; AUDIT alone accepts. Zero Cloudflare/D1/R2/scan/dispatch/deploy operations by this review.