# System 2 Historical Data Checkpoint

Updated: 2026-10-05 09:56 Asia/Taipei
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

Physically accepted raw A1 market-years:
- 2017 TWSE: data coverage PASS / replay readiness PARTIAL;
- 2017 TPEx: data coverage PASS / replay readiness PARTIAL;
- 2018 TWSE: data coverage PASS / replay readiness PARTIAL;
- 2018 TPEx: data coverage PASS / replay readiness PARTIAL;
- 2019 TWSE: data coverage PASS / replay readiness PARTIAL.

2019 TWSE durable state from run `37251356804` / #11:
- workflow SUCCESS on head `5d0cb81bf85e8a10ffdbdde29545aef97802b0eb`;
- 242/242 official sessions;
- 953 R2 packs / 226,715 bars;
- 953/953 R2 HEAD and byte-GET SHA-256 checks;
- fresh official reconciliation: 226,715 cold == 226,715 fresh official, with 0 missing, 0 extra, 0 source-row-hash mismatch;
- official current/new-listing/delisting historical-universe union readiness PASS for data coverage;
- 953 symbols active during the 2019 denominator; 227,299 expected membership-sessions;
- 584 UNKNOWN symbol-session gaps retained fail-closed;
- observation semantics: VALID_OHLC 225,452; OFFICIAL_ZERO_TRADE_NO_PRICE 608; POSITIVE_ACTIVITY_NO_VALID_CLOSE 655;
- continuity remains UNVERIFIED on 226,715 rows;
- artifact `system2-historical-coverage-TWSE-2019` id `11321561727`, digest `sha256:4bce2e6040f0d1b9aecfaa930e17943896dcdbe99620167a3a37af76959e0e30`;
- System1 production isolation PASS.

Durable evidence:
- `system2/evidence/S2_HISTORICAL_TWSE_2017_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/evidence/S2_HISTORICAL_TPEX_2017_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/evidence/S2_HISTORICAL_TWSE_2018_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/evidence/S2_HISTORICAL_TPEX_2018_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/evidence/S2_HISTORICAL_TWSE_2019_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/SYSTEM2_HISTORICAL_MARKET_YEAR_COVERAGE_MATRIX.json`

No 2017→present completeness claim is permitted yet.

## Important current blocker

No remaining raw A1 population blocker exists for 2017 TWSE/TPEx, 2018 TWSE/TPEx, or 2019 TWSE.

Remaining accepted-year replay debt is explicit:
- 2017 TWSE: 651 UNKNOWN symbol-session gaps; RAW technical continuity UNVERIFIED;
- 2017 TPEx: 458 UNKNOWN symbol-session gaps; historical delisting-union incomplete; RAW technical continuity UNVERIFIED;
- 2018 TWSE: 569 UNKNOWN symbol-session gaps; RAW technical continuity UNVERIFIED;
- 2018 TPEx: 379 UNKNOWN symbol-session gaps; historical delisting-union incomplete; RAW technical continuity UNVERIFIED;
- 2019 TWSE: 584 UNKNOWN symbol-session gaps; RAW technical continuity UNVERIFIED;
- non-price official observations remain explicit and are never fabricated into OHLC.

These debts are replay/readiness debt, not evidence of raw-source loss, and do not justify rewriting source-reconciled cold history.

The next DATA_LANE population target is 2019 TPEx under the same physical standard.

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

Dispatch 2019 TPEx through the completed-year annual workflow, physically verify R2/D1/source/universe/coverage evidence, durable-write the result, and only then advance to 2020 TWSE. Preserve all existing UNKNOWN/continuity/survivorship debt in the coverage matrix. Continue year-by-year through 2025; keep 2026 excluded from annual COMPLETE receipts and handle it through the separate incremental/current-year path.
