# System 2 Historical Data Checkpoint

Updated: 2026-10-05 21:11 Asia/Taipei
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
- 2020 TWSE: data coverage PASS / replay readiness PARTIAL.

2020 TWSE durable state from run `37274480646` / #13:
- workflow SUCCESS on head `2ad1312d9de26c37d0ab343239f3b9fce88d33c9`;
- 245/245 official sessions;
- 958 R2 packs / 231,961 bars;
- 958/958 R2 HEAD and byte-GET SHA-256 checks;
- fresh official reconciliation: 231,961 cold == 231,961 fresh official, with 0 missing, 0 extra, 0 source-row-hash mismatch;
- official TWSE historical-universe union readiness PASS for data coverage;
- 232,475 expected membership-sessions versus 231,961 source rows leaves 514 UNKNOWN symbol-session gaps retained fail-closed;
- observation semantics: VALID_OHLC 231,195; OFFICIAL_ZERO_TRADE_NO_PRICE 416; POSITIVE_ACTIVITY_NO_VALID_CLOSE 350;
- continuity remains UNVERIFIED on 231,961 rows;
- artifact `system2-historical-coverage-TWSE-2020` id `11331320701`, digest `sha256:e330cd8df13332cea813550a71fbf88c159300e3706893f2624bbc1ee165eaae`;
- System1 production isolation PASS.

Durable evidence:
- `system2/evidence/S2_HISTORICAL_TWSE_2020_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/SYSTEM2_HISTORICAL_MARKET_YEAR_COVERAGE_MATRIX.json`

No 2017→present completeness claim is permitted yet.

## Important current blocker

No remaining raw A1 population blocker exists for 2017-2019 TWSE/TPEx or 2020 TWSE.

Accepted-year replay debt remains explicit:
- all accepted market-years retain UNKNOWN symbol-session gaps and RAW technical continuity UNVERIFIED;
- TPEx historical delisting-union remains incomplete where noted;
- 2020 TWSE retains 514 UNKNOWN symbol-session gaps;
- non-price official observations remain explicit and are never fabricated into OHLC.

These are replay/readiness debts, not raw-source loss.

2020 TPEx cold-pack population is complete, but fresh physical revalidation is pending after source-revision-aware verifier fix `4cd31c569886faaa8e3cb3522ae28b72e9346724`.

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

Fresh-dispatch 2020 TPEx on latest main using verifier V0.4. The prior run #14 / `37283878520` must not be treated as accepted because its V0.3 source-row rule blocked on 773 full-row hash changes from 2020-02-27. R2 storage, key coverage and row counts passed; immutable cold history must not be rewritten. Accept 2020 TPEx only if V0.4 proves canonical A1 values stable (source revision only) or otherwise keep it BLOCKED if canonical A1 values changed. After durable acceptance, advance to 2021 TWSE.
