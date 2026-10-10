# System 2 destination-only D1 Schema import — OWNER-GATED DRAFT

Date: 2026-10-10 Asia/Taipei  
Current repository base main: `afd53e680035097fd1042728c651a4d4fffea487`  
Status: **OFFLINE SQL PAYLOAD PREPARATION ONLY; NEVER EXECUTED ON CLOUDFLARE**  
Owner decision: NOT REQUESTED AS AN IMPLICIT "繼續" ACTION. Explicit separate authority needed for *any* schema write, new Cloudflare token, or GitHub Environment.

## Grounded physical baseline

Real postcreate Cloudflare GET-only [Run #38027260602](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38027260602) vs baseline #38022384514 and evidence merge [PR #1076](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1076) show exactly **one independent new-account `system2-research` D1** (12,288 bytes), zero new Worker/Cron/KV, source account unchanged. The owner UI showed zero tables. No physical destination SQL readback has been performed.

Source `system2-research` D1 is 316,968,960 bytes and existing historical R2 remains in original account; real source applied migration chain, table row counts and immutable frozen snapshot hashes remain **UNKNOWN** (DATA_LANE #1068). System1 read reserve is `false/null`. **Do not claim database backup or data migration from source-only SQL.**

## Exact proposed schema statement set

The source provisioner `system2/deploy/provision_system2_d1.mjs` lists **`0001..0010`**, containing:
- **55** new `s2_` tables;
- **63** named indexes;
- **7** `s2_schema_meta` version upserts;
- **125** SQL statements in total; final schema meta version `1.1`.
- The `0011_outcome_revision_archive_staged.sql` appendix (one extra table, three indexes, two immutability triggers) stays **excluded**.

These counts are tested against real SQL files executed in SQLite memory [PR #1077](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1077). They are **repository SQL expectations**, not a verified physical source schema. The 7-file/46-table resonance subset is research-only and requires separate dependency selection evidence if chosen.

`system2/migration/destination_schema_only_offline_payload_v0_1.mjs` builds a content-hashed ordered 125-statement bundle using actual GitHub SQL files and the owner's target D1 receipt. It explicitly rejects any destructive or production SQL, source-provisioner drift, missing files, changed target identity, unexpected live destination Worker/Cron or staged 0011 inclusion. It **does not contain a Cloudflare API client or execution entrypoint.**

## Next separately authorized, future production-capable operation

1. Owner chooses **only schema import into new account's already-created EMPTY `system2-research`**, excluding data and frozen snapshots, with **no new D1 resource**, no Worker/route/Cron, no R2, no paid upgrade or original System1 changes.
2. Owner grants a protected **destination-only D1 Write API Token** (new permission), a separate protected GitHub Environment distinct from source, and provides a securely stored deny-only original account ID. Never paste secrets into chat or issue.
3. Auditor independently verifies the authenticated destination *account and DB* fingerprints immediately before any write, an empty physical SQLite schema before SQL, actual current-UTC-day destination D1 rowsWritten/rowsRead headroom and reserved quota, a one-time payload SHA matching audited main, GitHub Environment reviewer and absence of source secret inheritance.
4. Any actual import must be separately gated and evidence-based. Because each SQL statement may cause quota-charged writes, no optimistic/automatic retry; record each statement identity/hash and GET/authorized D1 query readback. On timeout or partial write, halt with `UNKNOWN_PARTIAL_SCHEMA_DO_NOT_REPEAT` for manual independent table inventory reconciliation.
5. Verify target D1 actually has the selected 55 tables, 63 explicit indexes and schema version 1.1; readback must be physical, not the offline SQLite result. Verify no imported data rows, no Cron/Worker, no R2 subscription, no source account mutations.
6. **Separate later phase** DATA_LANE physical source backup/PIT immutable frozen decisions and R2 historical object dependencies before any copy, then disabled Worker runtime smoke and owner-approved controlled Shadow activation.

This is NOT a request to turn on a write-capable workflow now. Actual migration acceptance remains separately governed and unclaimed. User-approved low-risk auto-merge does not authorize new Cloudflare D1 SQL permissions, data writes or paid service.
