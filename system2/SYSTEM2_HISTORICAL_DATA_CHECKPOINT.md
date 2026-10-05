# System 2 Historical Data Checkpoint

Updated: 2026-10-05 22:29 Asia/Taipei
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
- 2017 TWSE / TPEx: data coverage PASS / replay readiness PARTIAL;
- 2018 TWSE / TPEx: data coverage PASS / replay readiness PARTIAL;
- 2019 TWSE / TPEx: data coverage PASS / replay readiness PARTIAL;
- 2020 TWSE / TPEx: data coverage PASS / replay readiness PARTIAL;
- 2021 TWSE: data coverage PASS / replay readiness PARTIAL.

2021 TWSE durable state from run `37320600966` / #16:
- workflow SUCCESS on head `d74b7bda9acfe40fb52fb2a031ffb32cafd6d8f0`;
- verifier V0.4 / source reconciliation STABLE;
- 244/244 official sessions;
- 968 R2 packs / 232,956 bars;
- 968/968 R2 HEAD and byte-GET SHA-256 checks;
- fresh official reconciliation: 232,956 cold == 232,956 fresh official;
- missing-from-cold 0 / absent-from-fresh 0 / full-row hash mismatch 0 / canonical A1 mismatch 0;
- TWSE official current/new-listing/delisting historical-universe union readiness PASS;
- 233,530 expected membership-sessions versus 232,956 source rows leaves 574 UNKNOWN symbol-session gaps retained fail-closed;
- observation semantics: VALID_OHLC 232,382; POSITIVE_ACTIVITY_NO_VALID_CLOSE 348; OFFICIAL_ZERO_TRADE_NO_PRICE 226;
- continuity remains UNVERIFIED on 232,956 rows;
- artifact `system2-historical-coverage-TWSE-2021` id `11352061154`, digest `sha256:4bee3d3b9698b1fc9cdf52e230eeaa19f4b8c686587abe8fc87486483ceedc19`;
- System1 production isolation PASS.

Durable evidence:
- `system2/evidence/S2_HISTORICAL_TWSE_2021_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/SYSTEM2_HISTORICAL_MARKET_YEAR_COVERAGE_MATRIX.json`

No 2017→present completeness claim is permitted yet.

## Important current blocker

No remaining raw A1 population blocker exists for 2017-2020 TWSE/TPEx or 2021 TWSE.

Accepted-year replay debt remains explicit:
- all accepted market-years retain UNKNOWN symbol-session gaps and RAW technical continuity UNVERIFIED;
- TPEx historical delisting-union remains incomplete where noted;
- 2021 TWSE retains 574 UNKNOWN symbol-session gaps;
- non-price official observations remain explicit and are never fabricated into OHLC.

These are replay/readiness debts, not raw-source loss.

The next DATA_LANE population target is 2021 TPEx.

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

Dispatch 2021 TPEx through the completed-year annual workflow, physically verify R2/D1/source/universe/coverage evidence, durable-write the result, then advance to 2022 TWSE. Preserve all existing UNKNOWN/continuity/survivorship/source-revision debt in the coverage matrix. Continue year-by-year through 2025; keep 2026 excluded from annual COMPLETE receipts and handle it through the separate incremental/current-year path.
