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

## Approved activation completed — 2026-10-02 16:00 Asia/Taipei

- Owner explicitly replied 「批准」 for the C1-only Class-B deployment and listed public GitHub Actions research artifact destination.
- Approved candidate 23047336981f337a6abf2cf405b93f3ec7ea4549; latest main D01 contracts retained. PR #306 merge commit 892e1a3d6fffea38ac6681b586ac18e56dd94f01.
- Exact-head isolated CI 57/57 PASS (36978917820 / job 110748767170); Regression PASS (36978917810); Repair CI PASS (36978917829). Post-merge Regression PASS (36981111091). Engineering checks do not establish genuine-market acceptance.
- Guarded deployment PASS (36981111040 / job 110755607961). Runtime readback at 15:55:38–15:55:45 Taipei: 8.15.1-c1-capture-integrity. KV/D1 retained; TEST_MODE, configUpdatedAt and monitoring targets equal predeploy baseline; verified previous 8.15.0 Worker backup retained. Research dashboard readback PASS; rollback unnecessary.
- Cron readback changed=false: all four expressions unchanged: 0-24 5 * * MON-FRI; * 1-4 * * MON-FRI; 35,55 15 * * mon-fri; * 9 * * MON-FRI. Normal scan/fallback remain 23:35/23:55 Taipei. Bootstrap/history reconstruction/resend/business scan/cache/import/3Min recovery steps were skipped.
- system1-c1-evidence.yml now uses the paired read-only CLI at 00:10 Taipei for the prior session, with explicit date override. Always preserve verified C1+C2 or the non-secret readiness blocker. No token/full source pages/broker cash/holdings/fills are exported. Collector-only workflow updates also trigger a read-only main verification without deploying Worker code.
- Genuine full C1 and live paired C2 acceptance remain PENDING. Existing scan/status at 15:55 still reported 2026-09-29; no fresh full generation is established. The preflight during deployment reported historyReady=false; this does not prove the unique cause of the earlier failed scan. Missing generation does not mean zero picks.
- Exact next cursor: inspect the normal 2026-10-02 23:35 scan and existing 23:55 fallback, then collector run at 2026-10-03 00:10 Taipei. Require current-session Formal pipeline complete/config verified/researchC1Population saveOk+readbackVerified; same generation/date/source SHA/header; full pagination, unique population symbols, count and content/universe hash verification; then C2 from precisely that generation. If blocked, diagnose the saved system1-c1-readiness.json and GET-only scan/status/institution/quality evidence, repair with tests, rerun read-only validation. Do not reconstruct historical receipts or WATCH.
- Open: actual runtime CPU/memory/latency acceptance, first genuine C1 and C2, corporate-action/execution/account-risk evidence. Preserve PASS/FAIL/UNKNOWN/PIT and null missing fields. Formal A/B/ranking/3+3+3/capital/15m/signals/push/System2 remain locked.

## First activated collector readback — 2026-10-02 16:23 Taipei

- Receipt/update PR #311: MERGED at 3a398137dd7901e2981cc59b1e4540039eab0641; candidate 4060b68c1af5f28570fe52a7cc08ffaa6b620817. Regression 36983650109 and Repair CI 36983650189 PASS; post-merge Regression 36983767469 PASS. No Cloudflare deployment was triggered by the collector-only/doc update.
- Real GET-only collector run 36983767480 / job 110764009881 executed the activated paired CLI and intentionally failed closed: scanDate=2026-10-01, verificationFailure=C1_GENERATION_NOT_FOUND, category=FORMAL_SCAN_NOT_CONFIRMED, mayCountAsZeroPick=false, noPlanChanges=true. It did not produce C1/C2 success artifacts or fabricate a historical receipt. This validates the negative live path, not a successful new generation.
- Always-upload step PASS. Saved one readiness artifact: system1-c1-evidence-36983767480, artifact ID 11216068363, 552 bytes, ZIP SHA256 d36a5fd52914e711189187a282e6c870f30844cfabbf991c3da95e02a8b253a3, 90-day retention. Run: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/36983767480 . Failure therefore remains reviewable instead of silently becoming zero picks.
- Remaining acceptance cursor unchanged: genuine 2026-10-02 normal 23:35/23:55 scan, then scheduled collector 2026-10-03 00:10 Taipei. Determine any new upstream/capture failure from that session's preserved facts; never retroactively manufacture 10/01 WATCH/C1. No strategy switch is authorized.
