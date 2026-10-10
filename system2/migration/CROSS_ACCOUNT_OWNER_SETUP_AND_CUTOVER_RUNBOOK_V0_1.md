# System 2 Cloudflare Cross-Account Owner Setup / Cutover Runbook V0.1

Date: 2026-10-10 Asia/Taipei
Status: DRAFT / NO_PHYSICAL_MIGRATION / NEW_ACCOUNT_AUTHORIZATION_NOT_CONFIGURED
Classification: Class A offline inventory preparation; Class B for deployment-pipeline review, owner-gated for account permissions/resource creation/cutover.
PR: #1058. Exact latest-main + PR head must be re-read before any protected operation.
No change to System1 Formal Core, Worker.js, root wrangler.toml, monitoring, signals, trade capital or production push.

## Why we cannot automatically finish the physical move yet
The owner created a separate Workers Free Cloudflare account named `System2-Stock-Research` and showed empty D1. This is UI-level proof only. GitHub's current `system2-research` environment is bound to the former account, and the existing workflows use `secrets.CLOUDFLARE_ACCOUNT_ID` for that account. Switching it in-place would risk unintended deploy, shared-quota decisions and source-data loss. The new account ID and a new minimal-scoped API credential are not in the tool context; do not ask the owner to paste API tokens here.

## ONE-TIME owner secret gate, not to run until Draft PR is reviewed
1. Cloudflare dashboard account switch: verify which is source account and which is `System2-Stock-Research` destination. Record account IDs **only inside secured GitHub environment secrets**, never issue/commit logs or chat.
2. In the Cloudflare API Tokens UI, create TWO separate account-restricted READ-only tokens (source and destination). For a complete metadata inventory, grants should be scoped to the relevant account: Workers Scripts Read, D1 Read, Workers R2 Storage Read, Workers KV Storage Read. If unavailable, stop and adjust requirements rather than giving account-wide Write.
3. GitHub repo Settings → Environments: create isolated `system2-migration` (owner permission required). Apply required reviewers if available; do not reuse/overwrite `system2-research` or production secrets.
4. Create four **environment secrets** (do not echo or upload values):
   - `S2_MIGRATION_SOURCE_ACCOUNT_ID`
   - `S2_MIGRATION_SOURCE_READ_TOKEN`
   - `S2_MIGRATION_DESTINATION_ACCOUNT_ID`
   - `S2_MIGRATION_DESTINATION_READ_TOKEN`
5. After the PR is reviewed/merged and the workflow is available on main, the owner may authorize a **single manual** run of `System2 Cross-Account Inventory (READ ONLY)` with exact confirm text `INVENTORY_ONLY_NO_MUTATION`. The job makes only GET requests; it never runs D1 SQL, reads object bytes, creates resources, changes Workers, runs Cron or emits Secrets.
6. Inspect the sanitized evidence artifact. The report intentionally never claims that physical backup or restoration has happened; route/domain data, per-row counts, object-key/byte census and cost require separate explicit verification.

## Separate high-risk steps, each requiring explicit owner consent
- Change Cloudflare resources / create new D1, R2, KV or Worker.
- Create/rotate any deployment WRITE token (must be dedicated to destination and least privilege).
- Expand D1 rows-read/-written beyond verified quota reservation or copy R2 bytes.
- Freeze old System2 writer and activate destination cron and workers.dev route.
- Retire/delete old System2 R2/D1 or rollback after new writes.

## Safe source-to-destination cutover
1. Capture SOURCE inventory, dependency graph and immutable manifests via DATA_LANE. Enumerate `s2_` table counts, row/value SHA-256, schema SHA-256, archived frozen-snapshot hash and R2 object count/bytes/full content hash, with PIT and availableAt. Preserve independently verified backup(s).
2. Keep source account and System1 untouched. New account must be provisioned with a separate GitHub environment and destination-scoped WRITE token, only after owner approval and gated source backup. New Worker begins with **no active Cron / no mutation/public push**, not the existing active resonance deploy workflow.
3. Apply destination schema only. Readback table definitions, triggers, indexes, count before any data copy.
4. Copy source data in chunks with idempotent create-only / append-only identities. Do not ever overwrite a frozen historical snapshot. On conflict, stop and preserve both source and destination receipts.
5. Verify every D1 table and R2 object (counts, bytes, hashes, PIT lineage) with `system2/migration/cross_account_storage_reconciliation_v0_1.mjs`; a local match is still `MATCHED_REVIEW_REQUIRED`, **not** a PASS or cutover permission.
6. Obtain independent audit signoff and owner cutover approval. Freeze source System2 writes at a controlled boundary, capture final delta, reconcile on destination, ensure at most one active writer/Cron. System1 never participates in System2 business approval.
7. During observation: API, bounded pool, 19:00 pre-check, source readiness 23:45/00:15 FUTURE TARGET only, PIT Shadow and quota monitoring independently validated. If rollback required after new destination writes, first reconcile immutable delta; do not blindly switch back.
8. Retain old source R2/D1 immutable data until a second, explicit retirement approval.

## Free plan hard capacity boundary
- Cloudflare D1 Free currently limits each individual database to **500 MB**, account aggregate 5 GB. The inventory tool performs a read-only GET of `file_size` for `system2-research`; UNKNOWN or size >= 500,000,000 bytes blocks the one-database Free plan. Measured schema/import overhead requires additional headroom, not blind exact-limit fitting. If blocked, owner must separately choose a verified data split/retention policy or cost-capped paid alternative, never delete frozen history to force migration.
- R2 Standard has monthly free thresholds but the old/new bucket usage, class A/B operations and any billing-enablement requirements remain UNKNOWN; do not assume an unverified zero-cost physical migration.

## Required non-secret evidence before invoking provisioning
- SOURCE database and Worker bindings; R2/KV, Cron/routes, last deployed version.
- DESTINATION account ID match, Free/usage, empty/non-empty authorized resource inventory.
- Full PIT immutable source backup and hash/manifests with complete market-date semantics.
- Data-lane read quota plan; account-specific quota budgeting changes reviewed by REMEDIATION/AUDIT.
- Destination-worker staging deployment configuration with disabled Cron/public writes.
- Independent review of GitHub Workflow names/environment boundaries and cost estimate.

## Authority and actual progress
- Latest main SHA at initial engineering baseline `5cb4aa8503adbf30fb9f18a37af492e562e9b030`; update before integration.
- `System2 Research CI` PASS + `V8 Regression` PASS on PR #1058 earlier implementation head `39ef9ee5a36909e65a9ff1032c4fc03c3c1f04dd`, later commits require fresh full-head CI.
- Migration physical acceptance: 0/13. Data copied: 0. D1 created at destination: 0. Activation: 0.
- Full System2 Shadow launch remains separate: official 15 gates / 75 checks tracked in `system2/SYSTEM2_SHADOW_15_GATE_QUANTIFIED_PROGRESS_V0_1.md`, snapshot 22/75 subchecks and 0/15 full acceptance as of its recorded baseline; do not infer updated acceptance without new main and evidence.
- Ownership: migration infrastructure lane implements preflight; BUILD_LANE owns System2 integration, DATA_LANE owns D1/R2 PIT backup/copy, REMEDIATION_LANE owns quota/CORR003 integration, AUDIT_LANE independent acceptance, System1 owns V8 live receipts.
