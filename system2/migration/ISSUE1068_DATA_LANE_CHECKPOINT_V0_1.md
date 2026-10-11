# Issue #1068 | DATA_LANE physical-source evidence checkpoint

Updated 2026-10-11, Asia/Taipei | Class A source-only, OFFLINE review; main at intake `54d0a4b28c9513b5e714c66d40032460e60c5f8d`.

## Current verified state (source GitHub main and issue #1068)

- Destination account **Schema-only** has formal independent AUDIT_LANE acceptance **25/25** as of 2026-10-11, matching target **55 tables / 63 named indexes / schema 1.1**. This is **not** a source D1 backup, source applied-migrations statement, PIT proof, immutable Frozen Snapshot or data import permit.
- SOURCE original GET-only Cloudflare Run `38022384514` shows existing D1 `system2-research` with database file size **316,968,960 bytes**. The file size has no determinable real row-count or full-table/hash completeness.
- Repo migration SQL contains 11 scripts / 56 table definitions; target schema has 55 application tables; neither proves source's physically applied migration chain or schema. SOURCE live table count, row totals, per-table bytes/content SHA, backup restore, physical PIT provenance and Frozen historical lineage: UNKNOWN / NOT ACCEPTED.
- Canonical `system2/evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json` still reports readReserveNumberAuthorized=false / authorizedReadReserveRows=null and reserveNumberAuthorized=false / authorizedReserveRows=null. The correct source D1 scan action is `READ_ONLY_D1_BUDGET_EVIDENCE_DEFER`. Lower-bound GraphQL observations and target-account D1 free-quota screenshots never authorize source full scans.
- SOURCE R2 bucket metadata presence does not prove **object list, byte SHA or immutable lifecycle**; target R2 `403/10042 NOT_ENTITLED` is an explicit separate paid/owner decision, never automatically upgraded.

## Newly staged offline protection (pending CI and GitHub PR acceptance)

- `system2/migration/issue1068_source_pit_frozen_restore_offline_v0_1.mjs` rejects invalid/incomplete physical-source manifest, PIT original revision version/hash/firstKnownAt/availableAt/observedAt vs decision cut; duplicate/missing keys; Frozen snapshots whose SHA chain or independently accepted previous prefix changes; archive restored bytes/schema/frozen chain mismatch; R2 object hash/coverage gaps; missing independently verified destination data readback.
- The offline gate intentionally always returns permissionToImport=false, shadowAuthorized=false, sourceD1BackupPhysicallyAccepted=false, pitPhysicallyAccepted=false, frozenPhysicallyAccepted=false, r2ContentPhysicallyAccepted=false and paidTierAuthorized=false. Full-shaped synthetic fixtures are only `OFFLINE_SHAPE_REVIEW_ONLY_NEVER_PHYSICAL_AUTHORIZATION`, not physical success.
- `system2/migration/run_issue1068_source_pit_frozen_restore_offline_v0_1.mjs` loads actual GitHub-tracked System1 reserve policy, can consume optional repo-local JSON evidence and emits sanitized blocker codes. It has no Cloudflare adapter/network/SQL/R2/secret or worker authority.
- `system2/tests/issue1068_source_pit_frozen_restore_offline_v0_1.test.mjs` tests a real-main-like no-reserve DEFER, non-authorizing mock review, and 24 adversarial cases across all four evidence categories. Test PASS means controls operate fail-closed; not data recovery proof.
- Evidence pre-registration: `system2/migration/evidence/S2_ISSUE1068_DATA_LANE_PRE_PHYSICAL_FAILCLOSED_PREREG_20261011_V0_1.json`.

## Real evidence required to move forward (none substituted by offline work)

1. Independent P01/P02 System1 source account read/write numeric reserve approval; same UTC day all-D1 account-bound rowsRead/rowsWritten ledger/analytics freshness/no rival jobs. Failing this, do not issue new source D1 SELECT.
2. On a separately qualified bounded quota: original source physical *applied* migrations and table/column/index readback, real exact table row counts and canonical content SHA, frozen s2_decisions count + true archived original payload hash lineage, recorded original Run/Job/Artifact/commit SHA and D1 SQL cost. A copy of source-only Oct08 official 11843 keys cannot fulfill any physical source table count.
3. Immutable full source physical data backup, independently restorably exercised on safe offline isolated storage and exact schema/table/frozen SHA compared; evidence signed/approved by AUDIT_LANE (self-declared booleans, fake manifests and schema-only PASS never enough).
4. Original revision firstKnownAt/availableAt/observedAt and source version crosswalk to every frozen decision cut, demonstrate no look-ahead and immutable historical snapshots across older independently archived anchor and new chain.
5. Source R2 exact key count / sizes / per-object byte digests and retained originals without deleting or overwriting; then only with separate owner-paid entitlement and safety approvals consider destination transfer and independent readback.
6. Quantify destination import theoretical minimum `ceil(realSourceRowTotal/100000)` UTC Free days only once real table row sum is known, excluding index amplification, retries, other writers, quota-day boundaries and reservations; do not infer from D1 file size. No Worker/Cron/Shadow activation.

**Result:** Source D1 physical 0 accepted; PIT 0 accepted; Frozen 0 accepted; migration data 0 accepted. Only source metadata + destination Schema-only stage accepted. All Class A work is non-mutating. Hand off to REMEDIATION_LANE for reserves and AUDIT_LANE for independent physical attestation. Never rerun target schema APPLY_ONCE.
