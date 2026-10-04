# System 2 Historical Data Checkpoint

Updated: 2026-10-04 15:58 Asia/Taipei
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

Current known continuation:
1. the repaired historical-calendar path is already on main;
2. manual run `36574839220` on 2026-09-29 proved the 2017 TWSE path now advances beyond calendar resolution and into cold-object persistence;
3. that run failed closed on a transient `R2 HEAD failed: HTTP 502` before a canonical annual completion receipt existed;
4. PR #522 merged as `7d35e8693d8ecfefd2f43fabbdde8b501f585857`, adding bounded retry/backoff for retryable R2 HTTP/transport failures while preserving 404/412/non-retryable 4xx and immutable-object semantics;
5. execute a fresh 2017 TWSE annual external-cold backfill from latest main;
6. verify completion receipt, D1 manifests/checkpoints, R2 object hashes, universe/session/bar coverage and UNKNOWN/continuity states;
7. only after TWSE 2017 acceptance, execute 2017 TPEx;
8. continue staged market-year population to present;
9. maintain a machine-readable aggregate coverage matrix;
10. do not claim complete history until all required market-years are complete or explicitly blocked.

Latest DATA_LANE validation:
- System2 Research CI run `37187368126`: SUCCESS;
- V8 Regression run `37187368095`: SUCCESS;
- the 502 transport defect is hardened, but the 2017 TWSE annual backfill itself remains incomplete until a fresh latest-main run produces and verifies its durable receipt.

## Important current blocker

The connected GitHub interface can inspect/rerun Actions but still has no action for creating a new `workflow_dispatch` run. Re-running run `36574839220` is not acceptable because it is bound to old head SHA `df3c680d94f5b8ec06d474ba1d120e3c2ed60d58`, before the R2 retry hardening and later schema changes.

The controlled browser profiles currently have no recorded GitHub sign-in. A fresh latest-main manual dispatch therefore remains the execution-channel blocker.

This is not permission to redesign the historical pipeline or to mark the backfill complete.

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

Resume `S2-CORR-20261004-001` by dispatching `.github/workflows/system2-historical-pack-2017-backfill.yml` from latest main with `market=TWSE`. Verify the complete annual receipt/manifests/R2 hashes/coverage before TPEX. Do not restart source/storage architecture research.
