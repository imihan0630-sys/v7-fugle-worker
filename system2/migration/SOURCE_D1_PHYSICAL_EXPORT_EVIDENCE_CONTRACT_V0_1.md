# System2 Cross-account D1 Physical Export: Evidence Contract V0.1

Date: 2026-10-10 Asia/Taipei  
Classification: OFFLINE RESEARCH / AUDIT PREPARATION ONLY  
Owns: migration infrastructure attestor. DATA_LANE remains owner of physical source export; AUDIT_LANE independently accepts real evidence.  
No Cloudflare API / secrets / D1 query / D1 write / Worker or Cron change.

## Real baseline and what is not yet known

- GitHub formal main initially `85ca841d7e99489609f29a437370f3e5ae637dc0` at research start; always re-read latest.
- Cloudflare true GET-only account inventory [#38022384514](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38022384514) and its artifacts: source D1 `system2-research` file size **316,968,960 bytes**; source System2 Worker, bucket and Cron identified; destination D1/Worker/KV count zero; destination R2 `HTTP403 code10042 NotEntitled`. This **does not** provide table row counts or a consistent D1 export.
- Current repository `system2/sql/` has **11 numbered migration SQL files and 56 distinct defined `s2_` tables** from source-level parsing. Previously deployed documentation mentions **46 physical tables**. Those two numbers are **different universes**: repo-defined tables versus an actually applied migration prefix. For illustration, first 7 SQL migration files define 46 tables; **this does not prove the live database has exactly the first 7 applied**. Require physical schema/migration-chain readback.
- These 56 definitions must not be auto-created in destination; schema deployment would be a separate owner-gated, independently reviewed phase.
- SOURCE `fugle-stock-config` KV is not assumed System2-owned, and source R2 archive remains active; do not copy, delete, truncate or overwrite on metadata evidence.

## Offline code and read-only commands

`system2/migration/source_d1_export_attestation_v0_1.mjs` analyzes versioned SQL migration DDL fingerprints and validates an optional, *separately generated physical D1 export receipt*.  
`system2/migration/run_source_d1_export_attestation_v0_1.mjs` can be run without any Cloudflare secrets:

```bash
node system2/migration/run_source_d1_export_attestation_v0_1.mjs
# expected: EVIDENCE_BLOCKED, exit code 2 (no physical manifest provided)

# AFTER DATA_LANE independently produces a source receipt:
node system2/migration/run_source_d1_export_attestation_v0_1.mjs path/to/physical-source-manifest.json
# Even a complete valid receipt returns OFFLINE_DOCUMENT_REVIEW_ONLY, never Cloudflare write authority
```

Only a source-level SQL schema fingerprint is available until a real evidence receipt is produced. The validator does not infer physical D1 table counts, D1 rows, index amplification or PIT support from SQL alone. It outputs sanitized status, not account IDs, token strings, row data, hashes of private values or holdings.

## REQUIRED physical source D1 evidence — DATA_LANE responsibility

A canonical `S2_CROSS_ACCOUNT_SOURCE_D1_EXPORT_V0_1` receipt must include:
- `verifiedFrom=SOURCE_D1_PHYSICAL_READ_ONLY_EXPORT`, `physicalReadback=true`, `databaseName=system2-research`, real `runId`, `artifactId`, `artifactSha256`, `exportSha256`, `schemaSha256`, `frozenSnapshotSha256`, and real `observedAt`.
- `migrationSqlSha256` fingerprint from versioned repo migration SQL, and `appliedMigrationPhysicalReadback=true` backed by real schema/metadata. `appliedMigrationFiles` must be a verified contiguous prefix of the 11 repo migration files. A subsequent missing/alternative lineage requires independent audit rather than a guess.
- `tables[]` with every **actually applied** `s2_` table exactly once: `name, rows, sha256, schemaSha256`. For each table, identity/hash must come from physical readback; a JSON fixture or file-size estimate is not evidence. No `V7_DB` / System1 tables.
- `frozenDecisionRowCount` exactly equals the `s2_decisions` row count; `frozenSnapshotPhysicalReadback=true`; link frozen decision hash roots to physical immutable decision/snapshot lineage. `availableAt`, `firstKnownAt` and PIT class require separate DATA/AUDIT provenance tests; this basic validator **does not** certify PIT correctness.
- `sourceReadBudget` with `readOnlyGuardPassed=true`, `system1ReadReserveVerified=true`, `accountHeadroomCertified=true`, actual `rowsRead`, `rowsWritten=0`, and verified UTC quota day. Current CORR-003 System1 read reserve is unapproved, so this requirement is **not currently fulfilled** and cannot be asserted from account metadata.
- `backupRetentionLocked=true`, `immutableSnapshotRetentionLocked=true`, physical independent backup retention and source readback. Backup content integrity and cloud artifact digest require **independent third-party or audit-lane comparison**, not merely self-declared JSON booleans.
- Artifact provenance: GitHub Run/Job SHA, exact Cloudflare D1 DB identity held only in protected job context (do not publish account ID), immutable storage path, table/column schema + indexes and physical read quota evidence. Source historical R2 object counts/byte hashes remain a **separate** required manifest, not waived by D1-only Phase 1.

## Capacity arithmetic and fail-closed result

Cloudflare D1 Free allows up to 100,000 rowsWritten per account per UTC day. The attestor computes **theoretical minimum** `ceil(sum(sourceTableRows)/100000)` days, *not* a write schedule or budget grant. The real cost can be much higher because D1 indexes, retries, schema writes, concurrent writers, day rollover and reserved system usage count separately. Every actual physical D1 statement must have separate explicit owner authorization, ACCOUNT-scoped verified reserve and immutable backup first.

A fully shaped mock source receipt can produce only `OFFLINE_DOCUMENT_REVIEW_ONLY`, never `READY_TO_IMPORT`. Missing any real source receipt produces `EVIDENCE_BLOCKED`. No type of attestation result authorizes new destination D1, importing data, enabling R2, creating a Worker, changing Cron, source retirement or System1 production changes.

## Latest handoff at this milestone

1. DATA_LANE independently gathers an account-budget-approved real read-only source schema and table/row digest manifest, or records `READ_ONLY_D1_BUDGET_EVIDENCE_DEFER` if System1 quota reserve remains unknown. Do NOT launch expensive D1 full-table reads merely to satisfy this checklist.
2. AUDIT_LANE validates integrity, completeness, immutable frozen decisions and PIT timestamp lineage; OWNER gives explicit authorization for actual resource provisioning and data writes.
3. Migration lane then uses the physical manifest with this attestor to produce a precise staged D1 write-budget/cold R2 dependency plan; System2 BUILD_LANE stages a disabled no-Cron Worker after resource permission.

Tracking: cross-account 13 physical gates remain under independent audit; full 15 Shadow launch gates remain separate. Never use code-only CI or source-only Oct08 11,843 keys to mark any physical gate PASS.
