# System 2 Historical Data Checkpoint

Updated: 2026-10-04 19:03 Asia/Taipei
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

2017 TWSE physical acceptance is now durable:
1. fresh latest-main workflow run `37197090867` / run #7 completed SUCCESS on head `7f7eda36b1de31caa01817ce3b9570af8826fe15`;
2. annual backfill fast-path verified the existing COMPLETE receipt without rewriting data;
3. R2/D1 storage verification PASS: 920 packs, 222,194 bars, 920/920 HEAD checks and 920/920 byte GET SHA-256 checks;
4. fresh official TWSE 2017 refetch returned 246 trading dates and 222,194 rows;
5. cold history reconciled exactly to fresh official source: missing-from-cold=0, absent-from-fresh-official=0, source-row-hash-mismatch=0;
6. historical universe registry materialized 1,151 memberships (1,089 current + 62 delisted), 0 unknown starts, with 920 symbols active during 2017;
7. membership-session denominator is 222,845, leaving 651 explicit UNKNOWN symbol-session gaps across 44 symbols; these are not raw-source losses and remain fail-closed replay debt;
8. observation semantics remain explicit: VALID_OHLC 220,948; OFFICIAL_ZERO_TRADE_NO_PRICE 711; POSITIVE_ACTIVITY_NO_VALID_CLOSE 535;
9. continuity remains UNVERIFIED on 222,194 rows; PIT admission is conservative-session-finality PASS, but replay readiness is PARTIAL;
10. artifact `system2-historical-coverage-TWSE-2017` id `11301298928`, digest `sha256:6b535e6d32a7f768ca55bb5fe98b504efb6a7d770a3b5a11071760d673bc6618`, was uploaded successfully;
11. System1 production isolation PASS.

Durable evidence:
- `system2/evidence/S2_HISTORICAL_TWSE_2017_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/SYSTEM2_HISTORICAL_MARKET_YEAR_COVERAGE_MATRIX.json`

2017 TWSE disposition:
`DATA_COVERAGE_ACCEPTED_REPLAY_READINESS_PARTIAL`

This does **not** mean 2017→present history is complete and does **not** promote continuity/replay readiness to PASS.

## Important current blocker

No remaining execution blocker exists for 2017 TWSE raw A1 population/physical data coverage.

The remaining TWSE 2017 debt is semantic/replay debt:
- 651 UNKNOWN symbol-session gaps require further cause classification where authoritative evidence exists;
- RAW technical continuity remains UNVERIFIED;
- non-price official observations remain explicit and are not fabricated into OHLC.

These debts do not justify rewriting or refetching already reconciled raw A1 storage.

The next DATA_LANE population target is 2017 TPEx under the same physical standard.

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

Execute 2017 TPEx annual official A1 cold backfill from latest main, then require the same receipt/manifest/R2/source/universe/coverage verification before moving to 2018. Preserve the 2017 TWSE 651 UNKNOWN symbol-session gaps and continuity debt as explicit PARTIAL replay readiness; do not coerce them to zero/pass and do not restart TWSE raw backfill.
