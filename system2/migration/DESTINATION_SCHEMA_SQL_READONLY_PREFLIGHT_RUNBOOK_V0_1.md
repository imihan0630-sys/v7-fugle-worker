# Destination new-account D1 physical EMPTY SQL preflight without new Write token (V0.1)

Scope: System 2 Cloudflare account split ONLY. Owner expressly approved Schema-only **engineering** on 2026-10-10. Original System 1/2 source account remains independent and untouched.

## Problem resolved
The first prepared Schema-only installation workflow required an entirely new destination `D1 Edit` token even for its *VERIFY_ONLY* stage. The already-attested existing `system2-migration` GitHub Environment has a **destination-only D1 READ token** that previously passed Cloudflare API GET metadata verification, and the official Cloudflare `POST /accounts/{account_id}/d1/database/{db_id}/query` endpoint accepts D1 Read **or** D1 Write for querying. A hard-coded `SELECT sqlite_schema` with destination D1 READ token can therefore independently verify the physical schema is still empty, without waiting for the owner to create a new write credential.

Official API: https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/

## Independent, strictly READ-only module

`system2/migration/destination_schema_sql_readonly_preflight_v0_1.mjs` uses:
- Hard-pinned destination Account ID hash `27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55`, explicit original account DENY `3a6732b4f599575098949e818ef9266c324929cf38644387bddc09e05497243b`, and destination D1 uuid hash `95f48f4d37b8eb4c16919d037259a5ebc30a8057e1933db39a6e8f759b9874b9` from real owner-run GET inventory `38027260602` vs baseline `38022384514`.
- Cloudflare GET `/d1/database?page=1&per_page=100` (exactly one `system2-research`), GET `/d1/database/{uuid}` (size <= 32 KiB), **one** Cloudflare `POST /query` with fixed SELECT only:

```sql
SELECT type, name FROM sqlite_schema
WHERE name NOT LIKE 'sqlite_%'
ORDER BY type, name
```

- Response must have Cloudflare success envelope and one D1 query result object containing `results`; zero schema objects qualifies `DESTINATION_D1_PHYSICAL_EMPTY_SQL_VERIFIED`. If any other object exists, status `DESTINATION_D1_NONEMPTY_BLOCK_SCHEMA_IMPORT` and job intentionally fails. Wrong account/DB, absent READ token, changed D1 file size, missing repo Schema prefix, unexpected response shape, connection failure all **fail closed**. The SELECT returns only schema object names and types, **not any holdings, stock decision records, rows or frozen PIT history**.
- The runner only receives secrets `S2_MIGRATION_DESTINATION_ACCOUNT_ID` and `S2_MIGRATION_DESTINATION_READ_TOKEN` from existing `system2-migration` Environment, never receives the source token or a D1 Write credential. Sanitized job artifact contains only counts, timestamps and planned SQL digest; no raw account IDs, UUIDs, token, full SQL rows or source evidence.
- The workflow is **manual workflow_dispatch only**, branch `main`, exact acknowledgement `DEST_SCHEMA_EMPTY_SQL_READONLY_ONLY`, contents read-only and same concurrency group as destination Schema WRITE workflow so it cannot overlap. It will NOT run automatically when merged.
- Even though D1 uses HTTP POST for SELECT, there are **zero database-mutating SQL commands or Cloudflare administrative POSTs**. No DB creation, DDL, historic/frozen row writes, old System 1 account action, Workers, Cron, R2, KV or paid subscription. Mock tests verify exact API URLs, statement allowlist, nonempty rejection and at least ten adversarial probes. D1 SELECT may consume a tiny number of **destination account rowsRead**, so it does not claim zero usage, but the query is strictly bounded to the empty database's metadata.

## Manual step after merge (does NOT require new Secrets)

Existing owner environment secrets already used for successful metadata inventory; owner manually runs [System2 Destination D1 SQL Empty Preflight (READ ONLY)](https://github.com/imihan0630-sys/v7-fugle-worker/actions/workflows/system2-destination-schema-sql-readonly-preflight.yml):
- Branch `main`
- `confirm` = `DEST_SCHEMA_EMPTY_SQL_READONLY_ONLY`
- Click `Run workflow` once, then share only Run URL or say `已執行`; inspect GitHub CI & sanitized artifact.

A successful receipt means physical new D1 currently has zero user-defined schema objects and the 125-statement Schema-only source plan remains unchanged; it does **not** install 55 tables or certify whole migration. Actual new-account CREATE TABLE/INDEX stage `APPLY_ONCE` still requires owner's separate DESTINATION-only D1 Edit token, protected GitHub Environment `system2-schema-only`, Free account usage check and manual command through `.github/workflows/system2-destination-schema-only-manual.yml`.

The original sources' DATA_LANE #1068 frozen snapshot/backups/rows remain independent and must NOT be guessed from empty new D1. PR that adds this read-only workflow is **not evidence** the workflow has been dispatched.
