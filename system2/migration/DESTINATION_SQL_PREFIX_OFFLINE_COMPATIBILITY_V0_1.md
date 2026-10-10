# System2 destination D1 SQL prefix compatibility — OFFLINE ONLY (V0.1)

Date: 2026-10-10 Asia/Taipei  
Status: RESEARCH/ENGINEERING CANDIDATE, no schema/data Cloudflare permissions or writes.  
Formal source: latest main at investigation `0e4e6129db499019af930c4b8e7a20b8d281c109`. Work exclusively in System2 migration lane; System1 formal / source Cloudflare account remain untouched.

## Proven, distinct schema scopes

1. **Repository-defined SQL inventory**: 11 numbered `system2/sql/0001..0011` files; **56** unique `s2_` tables, **66** named explicit indexes, **2** triggers.
2. **Existing source provisioning *intent***: the actual `system2/deploy/provision_system2_d1.mjs` migrationFiles array applies exactly `0001..0010` (**10 files; 55 tables; 63 explicit indexes; 0 triggers**) and validates `schema_version=1.1`. That code also performs D1 resource CREATE and a write sentinel; **NEVER repurpose or invoke that file on the new account**. It is bound to the original/source account's GitHub Environment in the original Workflow.
3. **Former bounded resonance prefix** `0001..0007`: 7 files / 46 defined tables / 49 explicit indexes / schema_version 1.1 in a clean local SQLite memory test. This matches an older documented count of 46 tables **numerically only**; it is NOT proof that the physical source currently has exactly those migrations applied. Do not infer live DB migration state from coincident table totals.
4. **Staged `0011_outcome_revision_archive_staged.sql`**: 1 new append-only outcomes revision archive table, 3 indexes and 2 UPDATE/DELETE denial triggers. This file is present in the repository and applied by the *all SQL* general CI dry-run, but **is deliberately not in the old source provisioning flow**. It cannot be auto-promoted to destination without separate independent PIT/performance/correction audit and owner approval.

## What was actually tested

`system2/migration/destination_schema_prefix_offline_v0_1.mjs` inspects the live HEAD repository's source provisioner array, all current SQL file names and content hashes, and the **real** owner-postcreated destination D1 GET-only evidence in `system2/migration/evidence/S2_DEST_D1_POSTCREATE_REAL_GETONLY_RECONCILIATION_20261010_V0_1.json`.

`system2/tests/destination_schema_prefix_offline_v0_1.test.mjs` uses a **new SQLite :memory: database** and real SQL file bytes (never a Cloudflare account) to apply exactly the first 10 and first 7 SQL scripts and verify table/index/trigger counts, schema version and key frozen/historical/resonance table presence. Adversarial tests block staged script inclusion, source migration array divergence, duplicate tables, unexpected statements/destructive/production artifacts and altered destination resource inventory.

- The parser/probe intentionally emits `OFFLINE_APPROVED_PREFIX_CANDIDATE_ONLY`, not a D1 import command.
- The code SHA proves repository SQL content, **not** the source physical schema or Cloudflare D1 runtime compatibility.
- SQLite memory dry-run only proves syntax, table/index creation and initial `s2_schema_meta`; it does **not** prove D1 batch API limits, rowsWritten amplification, source table parity, 317 MB cold history fit, PIT, transactions, replay or immutable live frozen decisions.
- Owner's target D1 is independently verified via GitHub GET-only Run #38027260602, Artifact #11661270384, distinct from original source Run #38022384514. New D1 is a *blank resource*. UI shows zero tables; no D1 SQL query was made.
- Source database has recorded 316,968,960 bytes (metadata), but **source real physical applied migration prefix/row counts/backup remain UNKNOWN**; in particular System1 after-market READ/WRITE reserved rows both unapproved.

## Practical staged decision for faster launch (not yet authorized)

Before proposing any destination SQL import, DATA_LANE #1068 must provide a budget-qualified source readback/backup manifest and AUDIT_LANE must review exact migration lineage and frozen/PIT evidence. An account-specific destination-only D1 write token and separate owner approval remain necessary for actual schema statements; these are **not authorized in the current chat**.

A small, well-defined initial set `0001..0007` is a possible isolated research **candidate** for bounded EMA16/EMA64 resonance because its SQLite schema includes 46 tables including resonance tables; **whether it can actually work** depends on live D1 data/runtime binding and disabled Worker smoke. It cannot be selected based on table count alone. For parity with existing source provisioner, `0001..0010` currently matches its code intent. Research must explicitly decide one of these after measuring source physical schema, preserving append-only historical state and multi-strategy Shadow requirements. Do not apply `0011` by accident.

Physical progression remains separately gated: authenticated metadata for an empty destination D1 **PASS**; imported destination SQL **0**, migrated data **0**, destination Workers/Cron **0**, full independent migration/Shadow acceptance not met.
