# System 2 new-account D1 Schema-only — independent physical audit checkpoint

Audit date: 2026-10-11 Asia/Taipei. Main at intake: `7c508b3f66f5e27588a0b466acfdf1f5dd347283`.

## Audit disposition: **BLOCKED FOR FULL OBJECT-SET CERTIFICATION**

This is **not a failed physical install**. The new-account D1 actually executed an owner-authorized one-time Schema-only build. The **real authenticated** APPLY_ONCE receipt says 125/125 SQL statements, 55 prefixed tables, 63 prefixed indexes, schema version 1.1. The owner separately saw 55 tables in Cloudflare UI. Independent AUDIT_LANE still lacks the *exact actual 55/63 object-name inventory* and *all other object types* needed to certify the requested stronger exact-match/no-extra criterion.

### Independently read from original GitHub assets

- Canonical GitHub main at audit start `7c508b3f66f5e27588a0b466acfdf1f5dd347283`.
- VERIFY_ONLY: [Run #38068559602](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38068559602), Job `114261103226`, GitHub Artifact `11676361012`; **ZIP SHA256 independently recomputed** `3364b28aca9b877d4d038e5a89fcdc7ff6301b37b64640b48df09cf60587d1d4`. Receipt 125 planned / **0 applied**.
- APPLY_ONCE: [Run #38069750915](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38069750915), Job `114264577475`, GitHub Artifact `11675494971`; **ZIP SHA256 independently recomputed** `9ab4da826f679a757a27966fda51b4a569667ce28fd409bdca4f5d3ad277117e`. Receipt 125 planned/applied, 55 tables, 63 indexes, `1.1`. Both runs sealed by matching `planSequenceSha256=99a74747cbd3220afb84608c1ed8a9cf72e8eff71f2f23859227dbf7c56afe4f`.
- Main exactly identical executor blob `5ebd9922328e68024a12675f0d36708a65157cb9` at VERIFY and APPLY run heads; intervening GitHub changes only migration checkpoint and VERIFY evidence.
- Owner Cloudflare UI, merged [PR #1101](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1101) and [#1102](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1102): account daily October 10 written **285/100,000**, read **537/5,000,000**, **987.14 KB/5GB**, **1/10 D1**; one-database trailing-24h **298** written, **190** read, **128** queries, table count **55**. **The two written-row figures are different scopes/time windows**, not an exact bill of the 125 DDL/metadata statements.
- Audit acceptance matrix **25 criteria: 20 evidence-scoped PASS; 0 proven FAIL; 5 BLOCKED** (exact table names, exact index names, no unexpected other objects, exhaustive no-rerun history, independent physical source-account-after snapshot). See machine-readable evidence `system2/migration/evidence/S2_DEST_D1_SCHEMA_ONLY_INDEPENDENT_PHYSICAL_AUDIT_20261011_V0_1.json`.

### Why stage cannot yet be independently signed PASS at the requested strict granularity

Post-DDL executor queries only `type=table name LIKE 's2_%'` and `type=index name LIKE 'idx_s2_%'`, and checks **counts**, not canonical names. It does not query unexpected views/triggers/other prefixed or unprefixed schema objects at completion. Final sanitized GitHub Artifact stores counts/version, no canonical-name/digest comparison. A deterministic **synthetic-only** AUDIT_LANE test reproduces this evidence blind spot by returning 55/63 wrong object names while the existing count-only validator still returns `TARGET_D1_SCHEMA_ONLY_55_PHYSICAL_SQL_READBACK_PASS`. This test **does not assert real target corruption**.

### Remediation handoff

- [Evidence completeness Issue #1103](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1103) → **System 2｜Cloudflare 跨帳戶驗證工程室**: add **new manual READ-ONLY** postwrite `sqlite_schema` inventory and independently canonical-set-compare all 55/63 names, include one exact `_cf_KV`, no excess table/index/view/trigger or staged 0011; immutable D1 identity + Artifact hash/Run/Job; audit security negative tests; **never rerun APPLY_ONCE**.
- [Owner gate Issue #1079](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1079) stays OPEN for separate history/PIT/full migration/Shadow gates.
- [DATA_LANE Issue #1068](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1068) remains a separate data-migration blocker. Do **not** open data import, frozen snapshots or go-live based only on this stage.
- Re-present new authenticated READ-ONLY inventory Artifact to AUDIT_LANE for final **Schema-only phase** acceptance. No paid tier, Token, Secret, D1 DDL, new D1 resources, Worker, Cron, or System1 Formal Core change is authorized or performed by this audit.

This checkpoint is **append-only audit adjudication** and does not rewrite original physical receipt or downgrade verified owner work.

## 2026-10-11 09:11 Asia/Taipei — Issue #1103 independent real full-object D1 reverify

**AUDIT_LANE Issue #1103 verdict: PASS (complete named-object inventory verified)**. This supersedes the prior blocked exact-object proof only (old matrix C14, C15, C16), not the unresolved cross-account/whole-run secondary assurance checks.

Original GitHub [Run #38099562997](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38099562997), Job `114352494288`, Run attempt `1`, exact main `8c59bb9a8b53b4b8bb4cc608512ceadbb11844db` (2026-10-11 00:46 UTC) successfully ran a separately owner-dispatched **manual, destination-only, READ-ONLY** SQLite schema inventory. Independent AUDIT_LANE retrieved unmodified [Artifact #11687550030](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38099562997/artifacts/11687550030), ZIP SHA256 independently recomputed **`3f98f7256775c450e2ab19e68b513514052dd639112fbaa49178d76672686afe`**, matching GitHub's original digest. Uncompressed `receipt.json` contains 32,048 bytes.

Independent Python re-hash of original unzipped full receipt:
- **118/118 exact** canonical == physical `(type,name,tbl_name)` objects; **55/55 table names**, **63/63 index names and owning tables**; no duplicates or unknown objects
- exactly one additional reserved `(table,_cf_KV,_cf_KV)`, totaling **119** non-internal physical objects
- no extra table/index/view/trigger, no staged 0011, actual `schema_version=1.1`
- both physical and canonical 118-object canonical-json SHA256 independently recomputed to **`f9bb690e481b78183ec225f450673a90aec5d3ee637f55da0fa4154584c58c3c`**
- approved original 125-SQL bundle SHA **`99a74747cbd3220afb84608c1ed8a9cf72e8eff71f2f23859227dbf7c56afe4f`** preserved

Separate AUDIT_LANE test `system2/tests/audit_s2_issue1103_independent_canonical_physical_manifest_v0_1.test.mjs` reconstructs canonical table/index names and owner mapping from **raw first ten SQL migration files**, not from implementation lane's `canonicalObjects` array, and compares directly with the immutable compressed physical object manifest, including five adversarial negative mutations. No Cloudflare calls or D1 SQL by the auditor. Actual authenticated read-only workflow made two destination metadata GET requests plus two D1 HTTP-POST SQL SELECTs only; DDL/DML zero; original `APPLY_ONCE` was **not** rerun.

**Original 25-point audit matrix now = 23 evidence-scoped PASS / 0 FAIL / 2 remaining BLOCKED**:
- C19: cannot independently enumerate an *exhaustive* historical list of all possible Schema APPLY workflow runs/attempts with currently available GitHub connector. The known real original APPLY job and owner-observed single attempt remain supported, but not independently exhaustive.
- C21: no separate *post-APPLY* real physical GET inventory of SOURCE account. Strict destination account fingerprint, real target-only workflow and source-manifest isolation PASS, but this stronger after-snapshot proof remains unavailable.

**Conclusions must be distinguished**: Issue #1103's exact-object evidence gap is **PASS/RESOLVED**; strictly all-25-criteria Schema-only blanket acceptance remains **BLOCKED (2 independent evidence gaps)** until C19/C21 are supplied or formally resolved by authorized governance. Entire System 2 account migration, historical/Frozen/PIT, Worker/Cron and Shadow are NOT accepted. DATA_LANE Issue [#1068](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1068), owner gate [#1079](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1079) remain separate.

Independent immutable follow-up evidence: `system2/migration/evidence/S2_DEST_D1_ISSUE1103_INDEPENDENT_EXACT_SCHEMA_PHYSICAL_ACCEPTANCE_20261011_V0_1.json`. **No new owner permissions, APPLY_ONCE, tokens, secrets, paid R2, Worker/Cron, old System1 or Cloudflare writes were touched.**

## 2026-10-11 11:09 Asia/Taipei — FINAL Schema-only C19/C21 independent 25-point closure

**AUDIT_LANE decision: PASS — NEW ACCOUNT DESTINATION D1 Schema-only PHYSICAL STAGE ONLY.** The previously separate Issue #1103 exact-object names verification already PASS, and both remaining original audit criteria C19/C21 are now independently evidenced. This section supersedes the earlier C19/C21 **BLOCKED** note but not broader system/data migration gates.

**C19 / PASS.** AUDIT_LANE independently queried GitHub REST repository workflow-run full-period history `created=2026-10-10..2026-10-12&per_page=100&page=1..4`, all event types (query starts before initial original workflow merge). Original four live page counts **100 + 100 + 51 + 0** = **251** distinct run IDs; no duplicates, stable reported total 251. Original workflow `.github/workflows/system2-destination-schema-only-manual.yml` appears exactly **TWICE**: `VERIFY_ONLY` [#38068559602](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38068559602) and **single authorized** `APPLY_ONCE` [#38069750915](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38069750915). Each `workflow_dispatch`, `run_attempt=1`, successful. Scope: complete **currently GitHub-retained and accessible** specified period; does not assert logically impossible deleted or hidden records.

**C21 / PASS.** Original owner-manual metadata **GET-only** [Run #38105177481](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38105177481), Job `114369058630`, attempt 1, success; after-source observed 2026-10-11 02:27:05Z, later than original Schema `APPLY_ONCE` at 2026-10-10 16:57:19Z. Auditor independently downloaded original three after-run GitHub Artifact ZIPs and the source/destination baseline before-run ZIP, independently SHA256 recomputed, unzipped and parsed:
- AFTER inventory Artifact `11689306381` ZIP SHA256 `a583ac293a0ee565b80d7201b8952b3a70cfbcc8bdcd27bb853a56cf3d6d4422`
- AFTER auth Artifact `11689356218` ZIP SHA256 `9e4e903c0d64be846628a0f98c2fae8a658d1b22a7c98ef9b8de0906d428ab52`
- AFTER service Artifact `11689525935` ZIP SHA256 `c9719bfe0226ac79bf3df4234f5bc26374411a4894962e64ed8cf9b0a317756a`
- BEFORE baseline Artifact `11661270384`, [Run #38027260602](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38027260602), ZIP SHA256 `738b923b7ef142f15b45f623b7c99ecd73fcd7d9d29aaf650b73e26a5c24c671`

SOURCE source-inventory `verifiedAt` excluded, pre/post all remaining JSON keys and values **bitwise equal** (canonical normalized SHA256 `28e2a7eef8f3e57381c8022e5fcac44f94722ff9308c79e00b24540269c0fa46` on both): two D1 names/ID fingerprints, two Workers and System2 Worker binding names/types, one Cron `*/5 0-5,11 * * MON-FRI`, one KV namespace, one SOURCE R2 bucket, same SOURCE System2 D1 reported `316968960` bytes. Both account D1 READ preflight PASS. New DESTINATION retains same preexisting D1 ID fingerprint and name, post-schema storage 12,288 -> 987,136 bytes, still no destination Worker/Cron/KV. DESTINATION R2 403/code10042 **NOT_ENTITLED** before and after; intentional partial non-D1 R2 scope, *not* a D1 error or entitlement to enable billing. Owner-run service receipt reports `BLOCKED_SERVICE_READS` only due this classified, accepted R2 exception, SOURCE all granted, D1/Workers/KV granted on DEST.

**Final original 25-point matrix: 25/25 evidence-qualified PASS; 0 FAIL; 0 BLOCKED.** The exact 118/118 original D1 schema objects, 55 tables, 63 indexes/owners, one reserved `_cf_KV`, 1.1 and 125 sealed statements remain from earlier independent [PR #1109](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1109) and actual [Artifact #11687550030](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38099562997/artifacts/11687550030). New independent machine-readable evidence with all 251 Run IDs, source/destination resource fingerprints and constraints: `system2/migration/evidence/S2_C19_C21_SCHEMA_ONLY_INDEPENDENT_FINAL_ACCEPTANCE_20261011_V0_1.json`.

**Acceptance boundary:** This formally completes **new-account Schema-only physical build stage**, not entire System2 cross-account migration, Source D1 data/PIT/frozen correctness, source Worker runtime/transaction logic, destination R2 entitlement, history import, Frozen Snapshot migration, Shadow/production, Worker/Cron deployment or any new privileges. Source metadata equality does **NOT** prove row-level immutability or lack of transient resource changes outside two observation times. Old/new resource separation and Free D1 usage remain safe at the previously observed time only. **Never rerun APPLY_ONCE**.

**Next required work:** DATA_LANE [Issue #1068](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1068) first obtains actual independently budget-guarded source D1 applied schema, row counts, canonical immutable backup/export + restore/readback, PIT `firstKnownAt/availableAt` and frozen decision immutability; separately authenticate source R2 historical byte/object manifest. Formal System1 read/write reserves and shared account quotas/CORR-003 must be established before actual source D1 expensive reads. Only after independent audit and separate owner write authorization may controlled destination data migration planning be promoted. No data transfer, credentials, paid R2, Worker/Cron, source production or live signal changes by this audit.
