# D1 copy-first safety gate V0.1 — System 2 (offline research only)

Owner approved **cross-account System 2 D1 backup and copy** on 2026-10-11 16:30 Asia/Taipei; canonical receipt [BUILD #1128](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1128#issuecomment-6107178655) and [DATA #1068](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1068#issuecomment-6107179048). It is **conditional authorization** and does not equate to physical evidence, quota reservation, newly scoped Secret, billable R2, deployment or cutover.

## Intended workflow — no API effects in this PR

1. **PRE_EXPORT:** use a true current source-account UTC quota-day account-wide read/write headroom observation; separately accepted System 1 read/write reserve and quota ledger; verified separate source/destination identities; coordinate zero in-flight source System 2 D1 queries/writes and the original Worker/Cron. Cloudflare confirms database export blocks other requests while running and must be continually polled. Do not force source production or System 1 business to stop just to pass.
2. Run owner-authorized original D1 export only through a *separately reviewed physical executor* with correct protected permissions and original-source backup retention; compute immutable original SQL artifact SHA, restorable copy, actual physical tables/data SHA, PIT revision/decision clock and Frozen hash chain. Cloudflare's full D1 SQL export is a polling **POST** operation; it blocks queries to that SOURCE D1 while in progress. Check true physical source virtual-table absence first (Cloudflare export does not support FTS5/virtual tables); a mere repo grep cannot prove absence. Follow the original export `at_bookmark` until status `complete`, download the private signed SQL URL within **one hour**, and preserve original SQL bytes and SHA without publishing the URL or SQL content to GitHub. Independently inspect potential SQLite int64/JavaScript 52-bit precision loss and prove isolated offline restore. New offline guard `d1_export_download_receipt_v0_1.mjs` assesses only sanitized receipt metadata; its result never grants Cloudflare operations. This PR does not create or invoke any physical executor.
3. **PRE_IMPORT:** after the source export has been independently verified, restored and frozen, copy only its offline immutable data into destination. **No new source D1 SQL or refreshed System1-account quota reservation is needed for this destination-only import**; enforce the independent destination-account P0 quota and actual data-write budget instead. Destination D1 already exists and has its schema applied; never replay original APPLY_ONCE, never import CREATE TABLE without verified target parity, never overwrite frozen/historical decisions. Compare physical source/target exact schema/unique table universe. Source originally reported only 316,968,960 bytes metadata; this is not physical schema count, table rows, guaranteed export size or post-import size.
4. Independently budget all destination-account rowsWritten **including index amplification**, rowsRead and daily UTC headroom. The DESTINATION has a separate quota ledger and must reserve its own System2 P0 read/write workload; **do not require or borrow System1 source-account reserve in the destination**. Check the **500 MB Free per-database limit** with independently reviewed projected file size and existing target rows 0, with cron/push/worker and routes inactive. Import is a separate physical stage with backup and audit receipts, not started here.
5. Independently compare destination per-table row count/hash, exact PIT/Frozen lineage and immutable source; preserve originals. **D1-only success must not imply R2 archival completeness** (target R2 403/10042, NOT_ENTITLED), dual-account runtime separation, or Shadow readiness.

## Exact current blockers, with separate denominators

- G1 inventory prep PASS; G2 destination Schema-only 25/25 PASS. G3–G7 blocked; final operating separation 0/1.
- SOURCE account System 1 read and write reserve false/null; real physical SOURCE backup, offline restore, PIT/Frozen 0/4 independently accepted.
- Source S2 Cron and historical D1 still in source account. Destination currently had schema-only but no copied historical rows and Worker/Cron 0 in last authenticated snapshot. Re-inventory prior to real operation.
- Neither source SQL export nor destination D1 import is executed or allowed by this file.

## Fail-closed code

`system2/migration/d1_copy_stage_preflight_v0_1.mjs` exports:

- `assessSystem2D1CopyPreExportV0_1({ owner, source, destination, sourceQuota, sourceOperations, evaluatedAtUtc })`
- `assessSystem2D1CopyPreImportV0_1({ ...preExportInputs, backup, sourceReceipt, target, destinationQuota, destinationImportPlan })`

Both consume *untrusted structured evidence* and return only `BLOCKED` or `OFFLINE_REVIEW_ONLY`, **never** `permissionToExport=true` or `permissionToImport=true`. A maliciously fabricated receipt can satisfy a shape check but cannot supply original Cloudflare Run/Job/Artifact bytes or independent AUDIT_LANE approval. **An actual executor MUST independently verify the provider receipts and must not interpret this module's output as permission to mutate.** Do not print account IDs or auth tokens in logs.

Run focused negative tests: `node --test system2/tests/d1_copy_stage_preflight_v0_1.test.mjs system2/tests/d1_export_download_receipt_v0_1.test.mjs`;  System2 Research CI and V8 Regression must run on exact PR head; independent AUDIT_LANE review required before considering merge.

Official vendor documentation: https://developers.cloudflare.com/d1/best-practices/import-export-data/ and https://developers.cloudflare.com/d1/platform/limits/ and https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/export/

Classification: **Class A offline contract only**; no modifications to root Worker.js, wrangler.toml, legacy source-account workflows, System 1, D1, R2 or Cloudflare.
