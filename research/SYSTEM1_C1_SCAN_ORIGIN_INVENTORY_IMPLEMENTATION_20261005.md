# System 1 C1 scan-origin and generation inventory Class-B implementation

Date: 2026-10-05 Asia/Taipei
Status: IMPLEMENTED_BRANCH / LOCAL_REGRESSION_99_OF_99_PASS / PR_CI_PENDING
Branch: `codex/c1-inventory-20261005`
Owner approval: this task explicitly approves C1 Scan-Origin & Generation Inventory Class-B implementation.
Authority: latest GitHub main, freshly fetched at start and before submission: `bb2099909adaaf1462cb737b2fe8d3c5153288b8`.
Production read-only baseline: `8.18.0-valuation-source-vintage`; TEST_MODE=false; KV/D1=true; requirements30Complete=false.
Candidate: `8.19.0-c1-scan-origin-inventory`. Formal Core LOCKED. Merge/deploy are separate concrete production review boundaries.

## Current implementation and contact points

The existing guarded chain is Worker.js -> scripts/apply_v8_15_0.py (C1 generation/header/chunks/schema) -> V8.15.1 (safe capture, immutable equality and full readback) -> V8.16 (zero-pick child) -> V8.17 (shared parent / separate Shadow cohort and quality overlay) -> V8.18 (source vintage) -> new V8.19 instrumentation.

Runtime functions touched: `runAfterMarketScanCore`, `selectTomorrowCandidates`, `buildC1PopulationReceipt`, `persistC1PopulationReceipt`, `verifyC1StoredGeneration`; seven existing transport callsites receive constant origin labels. `persistCompletedC1Safe`, daily lease, calendar/closure admission, retrospective rejection, and membership storage retain their existing behavior. No new table, column, binding, network/provider request, Cron, external target, migration or backfill.

The immutable `scanInventory` header contains:

- Observed entry point: Cron, HTTP scan, preview, TEST_MODE finalize, import preview, staged recovery or Hybrid research preview. HTTP scan does not prove human/Actions identity. Actor identity stays NOT_PROVEN; unlabelled direct calls stay UNKNOWN.
- Requested clock versus actual request observation, NORMAL_SCAN / DRY_RUN / STAGED_CAPTURE; actual Cron string only for the Cron entry point. These are capture intent, not evidence of a completed Formal pipeline.
- Request-local market-source metadata for TWSE/TPEx, including observed cache/fallback source and row count. Missing metadata stays UNKNOWN/null; these fields do not certify provider authenticity.
- C1 generation id, original session/decision clock, generation source `REQUEST_LOCAL_C1_BUILDER_RANDOM_UUID`, build SHA and runtime version. Build SHA does not prove latest-main-at-scan; no historical parent is invented.
- Actual normalized-row inventory and feature denominator before history admission, child header presence and source-vintage state. Whole-exchange listing population and outcomes remain NOT_CAPTURED. Shadow membership requires its separate post-C1 persistence check. Child header presence is not child acceptance or economic evidence.

Before persistence, after existing child finalizers, a domain-separated SHA-256 binds the final inventory root into the first C1 row. The existing whole-population content digest therefore binds this header. Header tampering, foreign generation, D1 JSON/column divergence, missing current-version root, partial pagination and conflicting immutable replay are rejected. An additional 12 KB root / 10 MB receipt bound preserves storage limits. The module is SHA-pinned by the guarded patch.

Found and repaired a previous readback gap: C1 verified row digests but did not compare persisted identity/date/source/runtime/count columns with header_json. V8.19 checks those pairs before readback. This rejects divergence; it does not mutate or reconstruct old evidence.

The existing protected `/api/research/c1-population` GET exposes the stored header and pages. `collectVerifiedC1C2` and its CLI preserve independently verified `scanInventory` in the existing evidence artifact. Pre-V8.19 receipts remain LEGACY_NO_SCAN_INVENTORY / UNKNOWN; a genuine old receipt still reads and replays idempotently. New provenance cannot be backfilled into legacy versions. Existing structural C1/C2 and independently blocked child semantics remain intact.

## Protected boundary and validation

All runtime outside the five listed plumbing functions, isolated module/version and literal origin options is byte-identical to V8.18 after exact normalization. The Formal selector and scan core are separately byte-identical after removing only additive argument/context plumbing. This protects A/B, current comparator, Top6/independent 3+3, capital, BUY/ADD/REDUCE/SELL/STOP, formal completed 15m, monitoring/push and System2.

Full local regression: 99/99 PASS. Dedicated integration exercises actual Worker functions with SQLite through a D1 adapter, transactional persistence, three-page readback, shared Shadow cohort persistence, legacy receipt read/idempotence, JSON/column mismatch, mutated header, conflict, clock/retrospective rejection, digest/D1 failure and UNKNOWN provenance. Source parity and the three exact-version/patch-order workflow guards PASS. These are engineering/fixture results, not live market or Cloudflare resource acceptance.

The old integrity fixture formerly changed only decisionAt after building its provenance; it now freezes time before capture. The old staged-recovery assertion now requires its explicit new origin label and unchanged dryRun flag. Historical V8.18 parity tests still exercise their frozen pre-V8.19 artifact, while the dedicated V8.19 test checks the actual candidate.

Local Windows validation used an isolated copy with UTF-8/LF and `git apply -p0` for the existing embedded GNU-patch dependency. Repository build scripts and Worker.js are unchanged except the new guarded patch; Linux exact-head CI remains required. No claims of phone delivery, source authenticity, full 30-rule completion, OOS uplift or promotion.

## Readback evidence and limitations

Checked-in `research/system1_c1_scan_inventory_local_readback_20261005.json` is a genuine SQLite persistence/readback result using synthetic inputs, explicitly LOCAL_SQLITE_D1_ADAPTER_READBACK_NOT_PRODUCTION. It shows scan origin, generation source and inventory provenance for the same immutable generation and content digest. It is not an actual market scan.

Existing genuine read-only collector run [37067696964](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37067696964), artifact 11252813915, observed 2026-10-03 05:35:23 Taipei for scanDate 2026-10-02, returned C1_GENERATION_NOT_FOUND / FORMAL_SCAN_NOT_CONFIRMED. Formal scanDate was 2026-09-29 and pipelineComplete=false, while institution/quality dates were ready for 2026-10-02. This is negative live evidence, not a successful C1 or zero-pick. The original non-secret readback is preserved at `research/system1_c1_scan_inventory_prior_live_readback_20261005.json`.

Current production inventory acceptance is pending: this task has not merged/deployed V8.19 or triggered a business scan. Missing C1 generation cannot be repaired by manufacturing historical PIT rows. A fresh GET-only collector may confirm a genuine existing generation or preserve an explicit blocker.

## Exact next continuation

1. Verify all exact-head PR checks (Regression, Repair CI, isolated review); reconcile latest main without overwriting parallel progress.
2. Surface the concrete passing PR for its separately required merge/Production approval. Do not auto-merge or dispatch deploy.
3. After authorization, use the existing code-only guarded deploy/backup/rollback; verify version, unchanged KV/D1/config/targets/four Cron and testMode.
4. Inspect the next genuine normal scan and GET-only collector: require same C1 generation/header/source/date/digests, scanInventory, actual child states and separate cohort watermark. Observe real CPU/latency/storage; do not synthesize acceptance scans, rescan history, mutate holdings/capital or resend pushes.
5. If an actual current-session upstream capture fails, repair that evidenced cause in the approved engineering lane with regressions. Keep DATA_QUALITY_BLOCKED and mayCountAsZeroPick=false until the full established acceptance contract passes.

Rollback: revert V8.19 plumbing/build/collector changes through existing code-only backup path; preserve all immutable C1 rows, bindings/config/targets/Cron and actual positions. No data deletion or schema rollback.

Monitor: https://fugle-test.imihan0630.workers.dev/
