# System 2 Historical Data Checkpoint

Updated: 2026-10-05 21:46 Asia/Taipei
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
- 2020 TWSE / TPEx: data coverage PASS / replay readiness PARTIAL.

2020 TPEx durable acceptance from fresh run `37318143684` / #15:
- workflow SUCCESS on head `cd3f616fa4d26bfd81d316b26dabd467f62814cd`;
- verifier V0.4 / reconciliation contract `S2_HISTORICAL_SOURCE_RECONCILIATION_V0_1`;
- 245/245 official sessions;
- 794 R2 packs / 189,746 bars;
- 794/794 R2 HEAD and byte-GET SHA-256 checks;
- fresh official reconciliation: 189,746 cold == 189,746 fresh official;
- missing-from-cold 0 / absent-from-fresh 0 / full-row hash mismatch 0;
- canonical A1 value mismatch 0;
- sourceVersionState `STABLE`;
- conservative observed-interval universe: 794 memberships; TPEx official delisting-union remains incomplete;
- 190,154 expected membership-sessions versus 189,746 source rows leaves 408 UNKNOWN symbol-session gaps retained fail-closed;
- observation semantics: VALID_OHLC 185,243; POSITIVE_ACTIVITY_NO_VALID_CLOSE 1,421; OFFICIAL_ZERO_TRADE_NO_PRICE 3,082;
- continuity remains UNVERIFIED on 189,746 rows;
- artifact `system2-historical-coverage-TPEX-2020` id `11349482735`, digest `sha256:6fad4807366e4d9c462eef22272d74f353b04310133930f3d76b1284e5759004`;
- System1 production isolation PASS.

Prior run `37283878520` / #14 remains preserved as blocker evidence:
- V0.3 observed 773 full-source-row hash mismatches concentrated on 2020-02-27;
- storage and key coverage were intact;
- fresh latest-main V0.4 revalidation did not reproduce the mismatch;
- cold history was never rewritten;
- blocker evidence remains at `system2/evidence/S2_HISTORICAL_TPEX_2020_REVISION_BLOCKER_V0_1.json`.

Durable acceptance evidence:
- `system2/evidence/S2_HISTORICAL_TPEX_2020_PHYSICAL_VERIFICATION_V0_2.json`
- `system2/SYSTEM2_HISTORICAL_MARKET_YEAR_COVERAGE_MATRIX.json`

No 2017→present completeness claim is permitted yet.

## Important current blocker

No remaining raw A1 population blocker exists for 2017-2020 TWSE/TPEx.

Accepted-year replay debt remains explicit:
- all accepted market-years retain UNKNOWN symbol-session gaps and RAW technical continuity UNVERIFIED;
- TPEx historical delisting-union remains incomplete where noted;
- 2020 TPEx retains 408 UNKNOWN symbol-session gaps;
- prior #14 source-row discrepancy remains preserved as non-reproduced upstream evidence;
- non-price official observations remain explicit and are never fabricated into OHLC.

These are replay/readiness/provenance debts, not raw-source loss.

The next DATA_LANE population target is 2021 TWSE followed by 2021 TPEx.

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

Dispatch 2021 TWSE through the completed-year annual workflow, physically verify R2/D1/source/universe/coverage evidence, durable-write the result, then dispatch 2021 TPEx under the same standard. Preserve all existing UNKNOWN/continuity/survivorship/source-revision debt in the coverage matrix. Continue year-by-year through 2025; keep 2026 excluded from annual COMPLETE receipts and handle it through the separate incremental/current-year path.
