# System 2 Historical Data Checkpoint

Updated: 2026-10-04 Asia/Taipei
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
1. use the repaired historical-calendar path already on latest main;
2. execute 2017 TWSE annual external-cold backfill;
3. verify completion receipt, D1 manifests/checkpoints, R2 object hashes, universe/session/bar coverage and UNKNOWN/continuity states;
4. only after TWSE 2017 acceptance, execute 2017 TPEx;
5. continue staged market-year population to present;
6. maintain a machine-readable aggregate coverage matrix;
7. do not claim complete history until all required market-years are complete or explicitly blocked.

## Important current blocker

The correction record currently notes that the connected GitHub interface available to the prior control-room execution could not create a fresh workflow_dispatch run, and the controlled browser had no recorded GitHub sign-in.

This is an execution-channel blocker, not permission to redesign the historical pipeline or to mark the backfill complete.

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

Resume `S2-CORR-20261004-001` from the first executable 2017 TWSE annual backfill on latest main. Do not restart source/storage architecture research.
