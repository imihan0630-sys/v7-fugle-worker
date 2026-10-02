# System 1 C1 readiness continuation — 2026-10-02 Taipei

Status: CLASS-A ISOLATED DRAFT / NO MERGE / FORMAL LOCKED
PR: https://github.com/imihan0630-sys/v7-fugle-worker/pull/292
Base main: c09db6bce03ec6a52ff8bfaa2b3bf997da8486e5
Checkpoint: S1-C1-004. This is an engineering continuation of
`research/SYSTEM1_SELECTION_ISOLATED_CHECKPOINT.md`, not a claim of completed
first live evidence or of strategy superiority.

## Confirmed failed 2026-10-01 session
- 2026-10-01 23:39 Taipei, Official Market Data Sync run 36886021172:
  quality steps reported success, guarded recovery issued a single POST and got
  HTTP 503; /api/scan/status did not independently confirm the date.
  No repeated business POST was attempted.
- 2026-10-01 23:58 Taipei, Official Market Data Sync run 36888421751:
  official institutional readback showed 2026-10-01 ready (1,867 symbols),
  but later official-quality synchronization timed out. Recovery step skipped.
- 2026-10-02 00:23 Taipei, C1 Prospective Evidence run 36891658021:
  HTTP 200 with ok:false, error:C1_GENERATION_NOT_FOUND; no evidence artifact.
- The available logs cannot establish that the sync timeout or HTTP 503 is
  the sole root cause. No authenticated current session C1 receipt was recovered.
  Record this date as DATA_QUALITY_BLOCKED / RESEARCH_INELIGIBLE, never zero-pick.

## Implemented on isolated branch only
- New pure C1 readiness classifier distinguishes no confirmed Formal scan,
  incomplete pipeline, missing official evidence, unknown source readback,
  missing immutable C1 capture, authorization failure and generic read errors.
- The on-failure collector uses three authorized read-only GET endpoints with
  bounded timeouts; never retries a business POST, changes plans or mints a
  retrospective PIT generation.
- Missing-receipt and other read-failure paths emit a non-secret
  `artifacts/system1-c1-readiness.json` alongside a failing CI job.
  The workflow uploads either success evidence or blocker JSON even on failure.
- Synthetic tests cover date clocks, missing generations, source mismatch,
  missing data, authentication and GET-only behavior. Existing successful C1
  evidence path and the Formal strategy remain unchanged.

## Evidence and safety
- Initial PR validation: V8 Repair CI run 36929503236 PASS;
  V8 Regression Tests run 36929502862 PASS at PR head
  e289bcb6018dfdb23fb86cab872714dc13c128b6.
  Later documentation commits may trigger a fresh check.
- No live C1 generation, C2 opportunity lift, fills, costs, drawdown or capital
  utilization result is claimed. CA/execution/account-risk receipts are still
  UNKNOWN in existing C1, so Shadow may not treat them as PASS.
- The current `.github/workflows/v7-cloudflare.yml` triggers production
  deployment on `tests/**` changes merged into main; this draft PR MUST NOT
  be merged without separate authorized deployment-path review, despite its
  research-only runtime behavior. No merge or production change made here.

## Exact continuation
1. Read new main SHA and successful/full production decision receipt.
2. Review the draft PR and verify final CI. Preserve Class-B shared-deploy
   review before merging; keep Formal Core locked.
3. After the next completed Formal scan, obtain its immutable C1 generation,
   verify same-date/hash/full-population pagination, and classify all failed
   gates and early rejects. If no generation, use the safe blocker artifact
   to discriminate scan/data/source/capture problems.
4. Feed only complete prospective C1 receipts into a paired C2 Short-vs-Formal
   admission ledger; do not promote incomplete safety sources or retrospective
   WATCH. Freeze cost/fill and holdout assumptions before outcomes.
5. Any shared source, production scanner, Cron or schema repair beyond the
   previously approved C1 capture scope is Class B; Formal strategy switch
   is Class C and requires separate explicit approval.

Rollback: close PR #292 and delete its isolated branch; production is unchanged.

## S1-C1-005 continuation — 2026-10-02
Latest-main continuation and C1 integrity repair candidate are preserved in draft PR #306, engineering commit c452642dcccad6f0d7608629889e69b18661393b.
Linux isolated candidate tests 57/57 PASS; existing Regression/Repair CI PASS. No merge/deploy or live receipt claim.
Read `SYSTEM1_C1_C2_REPAIR_CHECKPOINT_20261002.md` for confirmed staged-path/UTF-8/readback defects, approval blockers and exact continuation; activation review packet is `SYSTEM1_C1_C2_CLASS_B_ACTIVATION_REVIEW_20261002.md`.
