# System 2 Historical Data Checkpoint

Updated: 2026-10-04 23:31 Asia/Taipei
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
- 2018 TWSE: data coverage PASS / replay readiness PARTIAL.

2018 TWSE durable state from run `37211022004` / #9:
- workflow SUCCESS on head `7ad031675605d5b276a7b1d8dda244bb57048759`;
- 247/247 official sessions;
- 943 R2 packs / 227,381 bars;
- 943/943 R2 HEAD and byte-GET SHA-256 checks;
- fresh official reconciliation: 227,381 cold == 227,381 fresh official, with 0 missing, 0 extra, 0 source-row-hash mismatch;
- official current/new-listing/delisting historical-universe union readiness PASS for data coverage;
- 944 symbols active during the 2018 denominator; 227,950 expected membership-sessions;
- 569 UNKNOWN symbol-session gaps retained fail-closed;
- observation semantics: VALID_OHLC 226,017; OFFICIAL_ZERO_TRADE_NO_PRICE 792; POSITIVE_ACTIVITY_NO_VALID_CLOSE 572;
- continuity remains UNVERIFIED on 227,381 rows;
- artifact `system2-historical-coverage-TWSE-2018` id `11307491716`, digest `sha256:d788354ab68f9005a7b758aab36912eef9e9104b3f81df06ef7585a3e92d00ff`;
- System1 production isolation PASS.

Durable evidence:
- `system2/evidence/S2_HISTORICAL_TWSE_2017_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/evidence/S2_HISTORICAL_TPEX_2017_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/evidence/S2_HISTORICAL_TWSE_2018_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/SYSTEM2_HISTORICAL_MARKET_YEAR_COVERAGE_MATRIX.json`

No 2017→present completeness claim is permitted yet.

## Important current blocker

No remaining raw A1 population blocker exists for 2017 TWSE, 2017 TPEx, or 2018 TWSE.

Remaining accepted-year replay debt is explicit:
- 2017 TWSE: 651 UNKNOWN symbol-session gaps; RAW technical continuity UNVERIFIED;
- 2017 TPEx: 458 UNKNOWN symbol-session gaps; historical delisting-union incomplete; RAW technical continuity UNVERIFIED;
- 2018 TWSE: 569 UNKNOWN symbol-session gaps; RAW technical continuity UNVERIFIED;
- non-price official observations remain explicit and are never fabricated into OHLC.

These debts are replay/readiness debt, not evidence of raw-source loss, and do not justify rewriting source-reconciled cold history.

The next DATA_LANE population target is 2018 TPEx under the same physical standard.

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

Dispatch 2018 TPEx through the completed-year annual workflow, physically verify R2/D1/source/universe/coverage evidence, durable-write the result, and only then advance to 2019 TWSE. Preserve all existing UNKNOWN/continuity/survivorship debt in the coverage matrix. The 2026 current year remains excluded from annual COMPLETE receipts and requires a separate incremental/current-year path.
