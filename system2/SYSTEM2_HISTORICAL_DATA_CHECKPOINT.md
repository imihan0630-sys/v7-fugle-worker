# System 2 Historical Data Checkpoint

Updated: 2026-10-04 21:20 Asia/Taipei
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

2017 TWSE and 2017 TPEx raw A1 data coverage are now physically accepted under the same standard.

2017 TWSE durable state:
- 246/246 sessions;
- 920 R2 packs / 222,194 bars;
- 920/920 byte-hash readback;
- fresh official reconciliation: 0 missing, 0 extra, 0 source-row-hash mismatch;
- 651 UNKNOWN historical-universe symbol-session gaps retained;
- data coverage PASS / replay readiness PARTIAL.

2017 TPEx durable state from run `37201834701` / #8:
- workflow SUCCESS on head `b0a445e0cff7a4a9035cf706cc1fc8da139bd9f9`;
- 246/246 official sessions;
- 753 R2 packs / 180,806 bars;
- 753/753 R2 HEAD and byte-GET SHA-256 checks;
- fresh official reconciliation: 180,806 cold == 180,806 fresh official, with 0 missing, 0 extra, 0 source-row-hash mismatch;
- conservative observed-interval universe: 753 memberships; 673 official-current-in-2017 members plus 80 historical-observed-only members;
- 458 UNKNOWN symbol-session gaps retained fail-closed;
- TPEx official delisting-union is not yet complete, so survivorship/replay readiness remains PARTIAL;
- observation semantics: VALID_OHLC 176,518; OFFICIAL_ZERO_TRADE_NO_PRICE 2,879; POSITIVE_ACTIVITY_NO_VALID_CLOSE 1,409;
- continuity remains UNVERIFIED on 180,806 rows;
- artifact `system2-historical-coverage-TPEX-2017` id `11304212419`, digest `sha256:48d2cac27deaacc95bb5a03ea6072dff76d39ca60804943dc6948c76fa2be20d`;
- System1 production isolation PASS.

Durable evidence:
- `system2/evidence/S2_HISTORICAL_TWSE_2017_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/evidence/S2_HISTORICAL_TPEX_2017_PHYSICAL_VERIFICATION_V0_1.json`
- `system2/SYSTEM2_HISTORICAL_MARKET_YEAR_COVERAGE_MATRIX.json`

2017 aggregate disposition:
`TWSE_DATA_PASS_PARTIAL_REPLAY / TPEX_DATA_PASS_PARTIAL_REPLAY`

This does **not** mean 2017→present history is complete and does **not** promote continuity, TPEx survivorship completeness, or replay readiness to PASS.

## Important current blocker

No remaining raw A1 population blocker exists for 2017 TWSE or 2017 TPEx.

Remaining 2017 replay debt is explicit:
- TWSE: 651 UNKNOWN symbol-session gaps; RAW technical continuity UNVERIFIED;
- TPEx: 458 UNKNOWN symbol-session gaps; historical delisting-union incomplete; RAW technical continuity UNVERIFIED;
- non-price official observations remain explicit and are never fabricated into OHLC.

These debts are replay/readiness debt, not evidence of raw-source loss, and do not justify rewriting already source-reconciled 2017 cold history.

The next DATA_LANE population target is 2018 TWSE followed by 2018 TPEx under the same physical standard.

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

The completed-year annual workflow is parameterized for 2017-2025 and rejects the current/incomplete calendar year. Dispatch 2018 TWSE first, physically verify and durable-write its evidence, then dispatch 2018 TPEx under the same standard. Preserve all 2017 UNKNOWN/continuity/survivorship debt in the coverage matrix. Handle 2026 later through a separate incremental/current-year receipt path so an incomplete year can never be frozen as an annual COMPLETE receipt.
