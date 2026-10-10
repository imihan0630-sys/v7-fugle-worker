# System 2 new-account D1 creation — UI evidence and GET-only reconciliation

Date: 2026-10-10 13:11 Asia/Taipei. Evidence scope: **OWNER-SUPPLIED DASHBOARD SCREENSHOT**, not authenticated account API, not a successful source→destination data migration.

## What the owner just did
- The owner manually pressed **Create** for intended `system2-research` D1 with Cloudflare location hint **Asia Pacific**. The preceding UI screenshot displayed those inputs, but not a confirmed account ID.
- Immediately afterwards the owner supplied a Cloudflare **Overview** screenshot showing `Number of Tables: 0`, `Rows read: 0`, `Rows written: 0`, `Total queries: 0`, and `Storage used (current): 12.29 kB` in the preceding 24-hour summary.
- The new screenshot does **not visibly include** the Cloudflare account selector, database name/UUID or D1 region. It is valid evidence that some D1 Overview is empty, **not** definitive proof the selected new account was `System2-Stock-Research`. Do not fabricate screenshot or account UUID from chat attachment.
- The owner had previously supplied successful authenticated cross-account GET-only Run [#38022384514](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38022384514): destination at that time contained 0 D1/Worker/KV/Cron and destination R2 was NotEntitled HTTP403 code10042. The earlier source `system2-research` D1 file size was 316,968,960 bytes.
- NEW physical provisioning step is **OWNER UI REPORTED / API RECEIPT PENDING**. New target database count is no longer assumed 0; source old account, original S2 data and source R2 archive stay unchanged until independently verified. No Schema/Data/Worker/Cron performed as part of this chat. Source backup and PIT manifest remain unknown; DATA_LANE Issue #1068 persists.

## Duplicate prevention applied to GitHub
**Draft PR #1074** containing the alternative target D1 resource creation workflow has been **closed unmerged**, with explanatory comment; DO NOT revive/merge/dispatch it. This avoids a second unintended resource creation. Issue #1073 remains open pending GET-only API proof and independent approval of the empty-resource acceptance.

## Exact next check (NO new write token needed)
The pre-existing manually dispatched GitHub Actions Workflow
[`System2 Cross-Account Inventory (READ ONLY)`](https://github.com/imihan0630-sys/v7-fugle-worker/actions/workflows/system2-cross-account-inventory-readonly.yml)
on formal `main`, with confirmation `INVENTORY_ONLY_NO_MUTATION`, can authenticate both existing account-scoped READ secrets, inventory D1 metadata with **GET** endpoints, and preserve sanitized source/destination fingerprints and resource names. The old target R2 NotEntitled error code10042 continues to permit a **partial** destination inventory; this is not a barrier to verifying D1 metadata. The existing workflow has no mutation, SQL, R2 download or data copy. It does **not** trigger by itself.

New offline evidence reviewer `system2/migration/destination_d1_postcreate_metadata_attestation_v0_1.mjs` compares *source BEFORE/AFTER* and *destination BEFORE/AFTER* sanitized inventories and the owner-observed UI facts:
- Same distinct source/destination hashed account fingerprints across the two GET-only runs; source resource set and protected `fugle-test` remain visible.
- Original target inventory D1 = 0, Worker/KV/Cron = 0; **new target inventory exactly 1 D1 named `system2-research`**, hashed target D1 identity distinct from source DB, new target Worker/KV/Cron = 0; destination R2 remains NotEntitled.
- Latest API receipts must be newer than old ones. Unexpected additional resources, source changes, missing account fingerprints, duplicates and stale/sanitized failures **block**.
- UI claims 0 tables, but API D1 metadata does **not** read schema tables or user-row hashes. Output state (when all checks succeed) is **`API_RESOURCE_READBACK_PASS_TABLES_UI_ONLY`**, `destinationTablesSqlVerified=false`, `sourceFrozenBackupVerified=false`, `physicalMigrationAccepted=false`, `workerDeployAuthorized=false`. Never mark production or Shadow accepted from only this receipt.
- All input IDs are hashed/digest-only; do not put Cloudflare account IDs, database UUIDs, tokens, holdings or backing rows into GitHub issues or logs.

## What remains
- Verify the user-created D1 account/name/metadata by ONE owner-manual GET-only inventory; attach Run/Job/Artifact/SHA to Issue #1073. This step has **not** occurred as of this document.
- Independent table=0 proof would require an explicitly authorized, quota-accounted D1 SQL **read** or trusted signed Cloudflare UI/API receipt; row counts, schema and decision hashes are NOT implied by the Overview. Do not query D1 gratuitously.
- DATA_LANE Issue #1068 supplies real source-table applied migration chain, frozen snapshots, historical R2 dependence, export/backup PIT with verified source System1 D1 quota reservation.
- Later schema import, source→target row migration, staging Worker and Cron all require their own explicit resource/credential/production approval.

This file is intentionally **evidence reconciliation, not a migration operation or a command to create another D1**.
