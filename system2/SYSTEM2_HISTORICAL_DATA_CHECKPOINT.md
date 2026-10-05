# System 2 Historical Data Checkpoint

Updated: 2026-10-06 00:12 Asia/Taipei
Status: ACTIVE / DATA_LANE
Room: System 2｜歷史資料工程室
Governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Mission

Own System 2 historical market-data engineering without taking over strategy/system construction.

Primary scope:
- official TWSE/TPEx daily history;
- historical universe/listing/delisting/session coverage;
- R2/D1 cold-history storage;
- manifests/checkpoints/completion receipts;
- PIT/continuity/source provenance;
- aggregate market-year coverage;
- verified full-market historical replay inputs.

## Current priority

Assigned correction:
`S2-CORR-20261004-001`

Routing:
`DATA_LANE`

Correction lifecycle:
`FIX_IN_PROGRESS` — actual DATA_LANE corrective work is underway; this is not `FIX_IMPLEMENTED` and remains subject to the existing acceptance criteria and independent closure rules.

Physically accepted raw A1 market-years:
- 2017 TWSE / TPEx: data coverage PASS / replay readiness PARTIAL;
- 2018 TWSE / TPEx: data coverage PASS / replay readiness PARTIAL;
- 2019 TWSE / TPEx: data coverage PASS / replay readiness PARTIAL;
- 2020 TWSE / TPEx: data coverage PASS / replay readiness PARTIAL;
- 2021 TWSE: data coverage PASS / replay readiness PARTIAL.

2021 TPEx run `37326149826` / #17 is **not accepted**:
- migrate SUCCESS;
- annual backfill stopped at D1 checkpoint persistence;
- Cloudflare returned `D1 free tier daily row write limit exceeded`;
- Physical verify was skipped;
- System1 production isolation PASS;
- no physical acceptance artifact exists for this market-year;
- this is an infrastructure quota stop, not evidence of source-data corruption.

Resume safety is preserved by the cold-pack store:
- existing R2 objects are reused only after immutable metadata/hash checks;
- existing D1 manifests are compared on immutable fields;
- completed receipts use a verification fast-path;
- duplicate logical pack keys are prohibited;
- partial cold history must not be deleted or rewritten.

Durable blocker evidence:
- `system2/evidence/S2_HISTORICAL_TPEX_2021_D1_QUOTA_BLOCKER_V0_1.json`
- `system2/SYSTEM2_HISTORICAL_MARKET_YEAR_COVERAGE_MATRIX.json`

## Important current blocker

2021 TPEx is temporarily blocked by Cloudflare D1 free-tier daily row-write quota.

Observed:
- run: `37326149826` / #17;
- failure time: 2026-10-05T14:53:26Z;
- failure point: `writeCheckpoint()` in `historical_cold_pack_store_v0_1.mjs`;
- error: daily row write limit exceeded;
- Physical verify did not run.

Earliest safe retry under the free tier:
`2026-10-06T00:00:00Z` = `2026-10-06 08:00 Asia/Taipei`.

No paid upgrade is required for the planned continuation. Do not retry before the quota reset and do not delete/rewrite partial cold history.

## Protected boundaries

Do not change without existing approval:
- System 1 Formal Core;
- System 2 strategy/ranking/final-selection authority;
- production push;
- capital/order behavior;
- historical evidence into prospective evidence.

## Durable completion standard

A market-year is not complete from code/tests alone.

Require, as applicable:
- official source ingest;
- immutable R2 object readback/hash;
- D1 manifest/checkpoint reconciliation;
- completion receipt;
- expected session and historical-universe reconciliation;
- missing/UNKNOWN cause accounting;
- replay readability under PIT/continuity guards.

## Exact next action

After the Cloudflare D1 free-tier daily row-write quota resets at 2026-10-06T00:00:00Z (08:00 Asia/Taipei), fresh-dispatch 2021 TPEx from latest main. The rerun must resume/reconcile immutable partial state, finish annual backfill, complete Physical verify, upload evidence, and confirm System1 isolation before 2021 TPEx can be accepted. Only after durable acceptance advance to 2022 TWSE.


## 2026-10-06 pre-reset resume validation

Latest main re-read before continuation: `c3bf53e0fe195647ecd77c87e6ce77e7ee744635`.

2021 TPEx run #17 remains blocked only by the Cloudflare D1 free-tier daily row-write quota until `2026-10-06T00:00:00Z` = `2026-10-06 08:00 Asia/Taipei`. No retry was issued before reset.

Blob-level drift check from failed run head `ca90efab5a7d6d27cc3d05a545efcd1ce44db247` to latest main confirms the execution-critical continuation units are unchanged:
- `.github/workflows/system2-historical-pack-2017-backfill.yml`: `98121be7b81b79feee939573d7ce2d58e0d8ffd1`;
- `system2/scripts/historical_pack_year_backfill_v0_1.mjs`: `c21b59f1d3550601161dc2554ab25c534d26cd95`;
- `system2/scripts/historical_market_year_verify_v0_1.mjs`: `59ecad64c3fd24e9561ac82177609374da0c1e0c`;
- `system2/runtime/historical_cold_pack_store_v0_1.mjs`: `5901e414ac8668a31c717ce9c70869fa9eacc888`;
- `system2/deploy/provision_system2_d1.mjs`: `dc8f3376a771676222c99d2b17da5cf7a4cc1f43`.

Therefore the blocker remains infrastructure quota, not execution-code drift. The exact next action is unchanged: after 08:00 Asia/Taipei, fresh-dispatch `year=2021, market=TPEX` from latest main; resume/reconcile immutable partial state; require Physical verify + artifact + System1 isolation before acceptance. Do not rerun the old run merely to bypass fresh-main dispatch semantics.
