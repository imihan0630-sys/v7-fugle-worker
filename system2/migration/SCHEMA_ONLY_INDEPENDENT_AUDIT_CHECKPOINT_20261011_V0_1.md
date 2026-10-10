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
