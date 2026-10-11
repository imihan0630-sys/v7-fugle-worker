# Issue #1068 / CORR-003 P03 + P05 | Offline backup and integrity safety runbook

Date: 2026-10-11 Asia/Taipei  
Owner: DATA_LANE | Class A / OFFLINE DESIGN ONLY  
Evidence class: SPECIFICATION_AND_ADVERSARIAL_TESTS_NOT_SOURCE_PHYSICAL_ATTESTATION  
Scope: source D1 `system2-research`, historical PIT, immutable frozen decisions, source R2. System1 Formal Core is untouched.

## Source-of-truth / current gate

Read GitHub main and Issue #1068 / #1026 before any physical action. Real GitHub Run #38108616165, Job #114379309976, Artifact #11690790704 has already proven the original-main **negative** quota-authorization case: System1 read/write reserve both false/null, `READ_ONLY_D1_BUDGET_EVIDENCE_DEFER`. This is not a backup.
Source D1 GET-only inventory Run #38022384514 reports file size 316,968,960 bytes; **not** physical source table/row/hash evidence. Destination target schema-only 25/25 PASS is disjoint from original data import. Source actual applied SQL migrations, frozen original bytes, PIT revisions, and source R2 object bytes remain UNKNOWN / unaccepted.

Until independently accepted original-source read headroom, System1 read reserve, UTC-day quota ledger, Analytics freshness/lag guard and writer exclusion exist: **issue zero source SQL queries**, zero export API calls, zero R2 object reads and zero data/import writes. P03 must not manufacture a read grant from GraphQL lower bounds. Preserve `physicalMissingKeys=UNKNOWN` for P05 Hot D1.

## Parallel offline work packages (no source account dependency)

| Work package | Input / deliverable | Negative cases (fail-closed) |
| --- | --- | --- |
| B1 backup plan | Physical export manifest contract + isolated restore acceptance checklist | Source filesize as row count; archive hash without restored bytes; partial schema; WAL/inconsistent snapshot; unverifiable artifact SHA |
| B2 PIT crosswalk | Exact source-version hash + firstKnownAt, availableAt, observedAt and each frozen decisionCutAt | Revision first known / available / observed **after that specific decision**, even if eligible for a later decision |
| B3 frozen immutability | Original s2_decisions row digest + full chain + independent prior accepted prefix anchor | Historical row replacement/deletion, reordered events, duplicate source refs, mismatched previous prefix, recomputed forged chain without original bytes |
| B4 integrity and safety | Per-table canonical digest, R2 object bytes, restored replay receipt, destination deferred readback contract | Duplicate keys, incomplete tables, R2 HEAD/ETag mistaken for SHA256 of fetched bytes, invented destination equality |
| B5 P03/P05 coexistence | Existing registered writer receipts and 36-key/11,843-key census **offline** comparisons | GraphQL lower bound as live headroom, missing authorized System1 reserve, physicalMissingKeys guessed zero |

B2 now includes a **per-snapshot** PIT clock crosswalk guard; checking `sourceVersion.selectionCutAt` alone is insufficient when a revision is reused by an older Frozen Snapshot.

## New actual offline integrity implementation (safe to run locally)

`python3 system2/migration/issue1068_sqlite_offline_integrity_v0_1.py --db /path/to/ISOLATED-RESTORED-COPY.sqlite`

- **Only** an existing, isolated, self-contained, local restored SQLite copy. Never point at live Cloudflare/source storage. No D1 or R2 bindings, no secrets/network, `mode=ro`, `query_only`, a read transaction; rejects missing/symlink inputs, WAL/SHM/journal sidecars, unstable file bytes, malformed SQLite, integrity / foreign-key errors and unsupported virtual tables.
- Computes complete local SQLite schema SHA256 including indexes/triggers, type-tagged and length-prefixed row bytes (NULL vs text/BLOB/int/IEEE-754 REAL), SHA256 of each row, sorted multiset row-hashes in bounded temporary chunks, per-table SHA256, actual local file SHA256 and count. Duplicate rows remain counted; row insertion/physical iteration order does not affect logical multiset digest. Temporary chunks contain only hashes and are deleted.
- Result is **local logical consistency of one untrusted offline copy**, **not** source physical provenance, PIT validation, Frozen chain verification, independent restore acceptance, R2 proof or migration permission. Local source role and original Run/Job/Artifact/SHA must be separately authenticated by independent AUDIT_LANE. Report intentionally pins all authorization booleans false.
- Test locally using `python3 system2/migration/test_issue1068_sqlite_offline_integrity_v0_1.py`; System2 CI invokes this via `system2/tests/issue1068_sqlite_offline_integrity_v0_1.test.mjs`.
- Free-tier import-days estimate is **not emitted** from an untrusted local fixture; only separate quota-gated and independent physical row acceptance may qualify it.

## After separate real read-budget acceptance (NOT authorized by this document)

1. **Freeze source evidence identity**: record exact original account/database fingerprint, run/job/attempt/commit UTC clocks, reservation and read-only grant IDs, budget max, other writers and Analytics lag. An independent gate must explicitly allow only a bounded physical source read.
2. **Establish source SQLite applied schema from original bytes/readback**: capture `sqlite_master` / migration metadata, physical tables, columns and indexes, including all `s2_` members. Never substitute repo SQL definitions or target blank schema.
3. **Consistent physical export**: choose and document a provider-supported point-in-time export or equivalent transactional snapshot mechanism **only after its permissions, cost and snapshot consistency semantics are verified**. Record the unmodified raw archive byte size + SHA256, generation clocks, export run/job/artifact and source DB fingerprint. Fail if source is not transactionally consistent; do not guess SQLite WAL checkpoint semantics.
4. **Isolated offline restore**: on a **separate local SQLite instance**, verify SQLite `integrity_check`, `foreign_key_check` (interpret violations with recorded schema), applied migrations, table/column/index inventory and all physical row counts. Compute canonical per-table digests over defined type-tagged SQLite values (NULL/integer/real/text/blob), stable primary-key order or explicitly stored full-row order where no unique key; document encoding, ordering, duplicate-row rules and SHA256 stream framing. Do not use `SELECT *` against live D1 as an unbudgeted shortcut.
5. **PIT and Frozen replay**: extract original source revision hashes/timestamps and `s2_decisions` raw payloads from restored bytes; reconcile each decision's referenced revision under its **own** `decisionCutAt`; compare SHA256 chain and previously independently archived anchor. Old snapshot history is immutable; never rewrite prior source/payload due to later revisions.
6. **Separate source R2 inventory**: list the original immutable object keys, sizes, versions/ETags and fetch/read original object content only with independent R2 access and capacity authorization. SHA256 **actual object bytes**; HEAD/ETag is supporting metadata, not byte proof. Never delete/overwrite source cold packs.
7. **Archive evidence**: preserve original immutable ZIP/SQLite artifact SHA256, all per-table SHA256, row/frozen digest, PIT crosswalk receipt, restoration CI/test logs, UTC/Taipei clocks and independent AUDIT_LANE challenge notes. Offline code output alone is only `DOCUMENT_REVIEW_ONLY`.
8. **P05 staged read census**: only after separate authorized read guard, 36-key Hot D1 scout first, followed by 11,843-key source/D1 physical census only if fresh headroom still qualifies; freeze missing/duplicate/version hashes, UNKNOWN causes and conflict quarantine, without correction by hindsight.
9. **P03 multiwriter physical stage**: separate explicit quota reservation granted, actual same-day account rowsRead/written and per-writer D1 meta, failure/retry non-release and P0 protection proven. No new physical writer for this runbook.
10. **Destination costs / post-copy**: derive `ceil(realSourceRowSum / 100000)` **minimum theoretical** Free quota days only from physical counts, clearly excluding indexes, retries, other writers and read limits. Data import, destination R2 subscription, Worker/Cron/Shadow require separate owner approval and independent audit.

## Acceptance and handoff

- DATA_LANE: offline contracts/tests may be prepared in parallel; keeps P03/P05 and Issue #1068 physical state **PENDING / READ_ONLY_D1_BUDGET_EVIDENCE_DEFER** until real data.
- REMEDIATION_LANE: owns independently qualified System1 P01/P02 read/write reserves, full account-wide same-UTC-day quota state and writer coordination.
- AUDIT_LANE: independently authenticates original physical Run/Job/Artifact/SHA and accepts or rejects each source backup, PIT, Frozen and R2 family; a source-only synthetic PASS is never physical acceptance.
- BUILD_LANE: must not enable strategy Shadow, source-history import, Worker/Cron or Formal Core changes from this artifact.

No Cloudflare API calls, live SQL, R2 byte reads, billing/subscription or destination data writes are authorized or performed by this runbook.
