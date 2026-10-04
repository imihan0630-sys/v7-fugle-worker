# System 2 Historical Data Checkpoint

Updated: 2026-10-05 02:33 Asia/Taipei
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
- 2018 TPEx: data coverage PASS / replay readiness PARTIAL.

2018 TPEx durable state from run `37223028925` / #10:
- workflow SUCCESS on head `b1ed6a60a0792ebd57bcf4c7f24bb22f893d12d0`;
- 247/247 official sessions;
- 773 R2 packs / 186,350 bars;
- 773/773 R2 HEAD and byte-GET SHA-256 checks;
- fresh official reconciliation: 186,350 cold == 186,350 fresh official, with 0 missing, 0 extra, 0 source-row-hash mismatch;
- conservative observed-interval universe: 773 memberships, 704 official-current-in-2018 members, 69 historical-observed-only members;
- TPEx official delisting-union remains incomplete, so survivorship/replay readiness remains PARTIAL;
- 186,729 expected membership-sessions versus 186,350 source rows leaves 379 UNKNOWN symbol-session gaps retained fail-closed;
- observation semantics: VALID_OHLC 180,685; OFFICIAL_ZERO_TRADE_NO_PRICE 4,077; POSITIVE_ACTIVITY_NO_VALID_CLOSE 1,588;
- continuity remains UNVERIFIED on 186,350 rows;
- artifact `system2-historical-coverage-TPEX-2018` id `11311721304`, digest `sha256:84f33f09df6a04ab1980ca60b1ddaf5d11025940a3cbe3cb1e55ac62631981dd`;
- System1 production isolation PASS;
- run #10 contained a text-only TPEx suspension limitation label saying `for 2017`; merge `c7e8156c96b82a252510b3fc8f07cfd93425acd6` corrected future runs to bind the selected year. Data, hashes and readiness states were unaffected.

Durable evidence:
- `system2/evidence/S2_HISTORICAL_TWSE_2017_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/evidence/S2_HISTORICAL_TPEX_2017_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/evidence/S2_HISTORICAL_TWSE_2018_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/evidence/S2_HISTORICAL_TPEX_2018_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/SYSTEM2_HISTORICAL_MARKET_YEAR_COVERAGE_MATRIX.json`

2018 aggregate disposition:
`TWSE_DATA_PASS_PARTIAL_REPLAY / TPEX_DATA_PASS_PARTIAL_REPLAY`

No 2017→present completeness claim is permitted yet.

## Important current blocker

No remaining raw A1 population blocker exists for 2017 or 2018 TWSE/TPEx.

Remaining accepted-year replay debt is explicit:
- 2017 TWSE: 651 UNKNOWN symbol-session gaps; RAW technical continuity UNVERIFIED;
- 2017 TPEx: 458 UNKNOWN symbol-session gaps; historical delisting-union incomplete; RAW technical continuity UNVERIFIED;
- 2018 TWSE: 569 UNKNOWN symbol-session gaps; RAW technical continuity UNVERIFIED;
- 2018 TPEx: 379 UNKNOWN symbol-session gaps; historical delisting-union incomplete; RAW technical continuity UNVERIFIED;
- non-price official observations remain explicit and are never fabricated into OHLC.

These debts are replay/readiness debt, not evidence of raw-source loss, and do not justify rewriting source-reconciled cold history.

The next DATA_LANE population target is 2019 TWSE followed by 2019 TPEx under the same physical standard.

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

Dispatch 2019 TWSE through the completed-year annual workflow, physically verify R2/D1/source/universe/coverage evidence, durable-write the result, then dispatch 2019 TPEx under the same standard. Preserve all existing UNKNOWN/continuity/survivorship debt in the coverage matrix. Continue year-by-year through 2025; keep 2026 excluded from annual COMPLETE receipts and handle it through the separate incremental/current-year path.
