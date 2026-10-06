# System 2 Historical Data Checkpoint

Updated: 2026-10-06 00:12 Asia/Taipei
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

Correction lifecycle:
`FIX_IN_PROGRESS` — actual DATA_LANE corrective work is underway; this is not `FIX_IMPLEMENTED` and remains subject to the existing acceptance criteria and independent closure rules.

Physically accepted raw A1 market-years:
- 2017 TWSE / TPEx: data coverage PASS / replay readiness PARTIAL;
- 2018 TWSE / TPEx: data coverage PASS / replay readiness PARTIAL;
- 2019 TWSE / TPEx: data coverage PASS / replay readiness PARTIAL;
- 2020 TWSE / TPEx: data coverage PASS / replay readiness PARTIAL;
- 2021 TWSE: data coverage PASS / replay readiness PARTIAL.

2021 TPEx run `37326149826` / #17 is **not accepted**:
- migrate SUCCESS;
- annual backfill stopped at D1 checkpoint persistence;
- Cloudflare returned `D1 free tier daily row write limit exceeded`;
- Physical verify was skipped;
- System1 production isolation PASS;
- no physical acceptance artifact exists for this market-year;
- this is an infrastructure quota stop, not evidence of source-data corruption.

Resume safety is preserved by the cold-pack store:
- existing R2 objects are reused only after immutable metadata/hash checks;
- existing D1 manifests are compared on immutable fields;
- completed receipts use a verification fast-path;
- duplicate logical pack keys are prohibited;
- partial cold history must not be deleted or rewritten.

Durable blocker evidence:
- `system2/evidence/S2_HISTORICAL_TPEX_2021_D1_QUOTA_BLOCKER_V0_1.json`
- `system2/SYSTEM2_HISTORICAL_MARKET_YEAR_COVERAGE_MATRIX.json`

## Important current blocker

2021 TPEx is **no longer blocked by the D1 quota**. Run #18 completed the annual backfill and immutable storage verification, but Physical verify attempt 2 produced a durable blocker:

- storage verification: PASS;
- completion receipt: COMPLETE;
- R2 HEAD / byte hash: 795 / 795 PASS;
- cold rows = fresh official rows = 191,643;
- missing-from-cold = 0; absent-from-fresh = 0;
- official source revision concentrated on 2021-01-14;
- source-row hash mismatches = 780;
- canonical A1 value mismatches = 698;
- source-revision-only rows = 82;
- verifier state: `SOURCE_REVISION_WITH_CANONICAL_A1_CHANGE`;
- data coverage: BLOCKED;
- System1 production isolation: PASS.

The 100 retained canonical mismatch samples all differ in `volumeShares`, `tradeValue`, and `transactions` while OHLC/change stay equal; this sample must not be generalized beyond the retained sample without further evidence.

Durable evidence:
- `system2/evidence/S2_HISTORICAL_TPEX_2021_REVISION_BLOCKER_V0_1.json`
- artifact: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37401612529/artifacts/11409737982
- workflow: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37401612529

Do not overwrite immutable cold history and do not accept the market-year by ignoring canonical revisions. The next engineering task is revision-lineage / as-of semantics for canonical A1 source revisions.

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

Resolve the 2021 TPEx canonical A1 source revision blocker before accepting the market-year:

1. inspect existing historical storage/version contracts for revision overlay or supersession support;
2. preserve the original immutable cold capture and later official revision as separate source versions;
3. define deterministic PIT/as-of selection so replay cannot silently use a later revision before it was known;
4. add machine-verifiable regression tests for revision lineage and immutable-history preservation;
5. re-run Physical verify and only accept 2021 TPEx if the revised provenance contract passes.

Do not blind-rerun run #18 again. Do not advance the coverage claim to PASS until revision semantics are explicit.


## 2026-10-06 pre-reset resume validation

Latest main re-read before continuation: `c3bf53e0fe195647ecd77c87e6ce77e7ee744635`.

2021 TPEx run #17 remains blocked only by the Cloudflare D1 free-tier daily row-write quota until `2026-10-06T00:00:00Z` = `2026-10-06 08:00 Asia/Taipei`. No retry was issued before reset.

Blob-level drift check from failed run head `ca90efab5a7d6d27cc3d05a545efcd1ce44db247` to latest main confirms the execution-critical continuation units are unchanged:
- `.github/workflows/system2-historical-pack-2017-backfill.yml`: `98121be7b81b79feee939573d7ce2d58e0d8ffd1`;
- `system2/scripts/historical_pack_year_backfill_v0_1.mjs`: `c21b59f1d3550601161dc2554ab25c534d26cd95`;
- `system2/scripts/historical_market_year_verify_v0_1.mjs`: `59ecad64c3fd24e9561ac82177609374da0c1e0c`;
- `system2/runtime/historical_cold_pack_store_v0_1.mjs`: `5901e414ac8668a31c717ce9c70869fa9eacc888`;
- `system2/deploy/provision_system2_d1.mjs`: `dc8f3376a771676222c99d2b17da5cf7a4cc1f43`.

Therefore the blocker remains infrastructure quota, not execution-code drift. The exact next action is unchanged: after 08:00 Asia/Taipei, fresh-dispatch `year=2021, market=TPEX` from latest main; resume/reconcile immutable partial state; require Physical verify + artifact + System1 isolation before acceptance. Do not rerun the old run merely to bypass fresh-main dispatch semantics.


## 2026-10-06 post-reset dispatch readiness

At 2026-10-06 08:12 Asia/Taipei, the documented D1 free-tier reset boundary had passed. The quota wait blocker is therefore no longer the reason to defer execution.

Fresh workflow dispatch remains required by the checkpoint semantics. The connected GitHub toolset exposes workflow read/rerun operations but no workflow_dispatch creation action. The available browser automation profiles currently have no recorded GitHub authenticated session, so a latest-main fresh dispatch cannot be truthfully claimed from this room without GitHub sign-in/authorization.

Do not substitute rerun of failed run 37326149826, because that run is bound to old head ca90efab5a7d6d27cc3d05a545efcd1ce44db247 rather than the latest main. Once authenticated dispatch is available, execute year=2021 / market=TPEX from latest main and continue through Physical verify, evidence artifact/readback and System1 isolation.


## 2026-10-06 2021 TPEx fresh-dispatch run #18

Fresh dispatch was successfully started from latest-main head `a7561639b8d07ab23bfd1f1cd961b753ee561249`:
- workflow run: `37401612529` / run #18;
- event: `workflow_dispatch`;
- requested target: 2021 TPEx annual historical pack;
- migrate job: SUCCESS;
- backfill job: IN_PROGRESS at latest readback;
- Physical verify: PENDING;
- physical coverage artifact: not yet present;
- System1 isolation step: PENDING.

Do not mark 2021 TPEx accepted until the workflow reaches terminal SUCCESS and Physical verify, evidence artifact/readback, completion receipt/coverage reconciliation, and System1 isolation all pass. Exact next continuation point: read back run 37401612529 when terminal, verify acceptance evidence, then advance DATA_LANE to 2022 TWSE only if accepted.

Run URL: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37401612529


## 2026-10-06 2021 TPEx run #18 attempt 1 failure / attempt 2 retry

Run URL: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37401612529

Attempt 1 terminal result: FAILURE, but annual backfill itself PASSed and System1 production isolation PASSed. Backfill receipt reported 2021 TPEX / 244 trading dates / 191643 official rows / 795 packs / 795 symbols, with 670 inserted objects plus 125 identical existing objects and no System1 runtime change.

The failing step was Physical verify. The verifier ran from 02:24:38Z to 02:37:25Z and then terminated with a raw DOMException TimeoutError. Because the verifier exited before writing /tmp/system2-historical-coverage-TPEX-2021.json, upload-artifact reported no file and no physical evidence artifact was produced. This failure is transport/read-path verification failure, not evidence of source-row mismatch, hash mismatch, D1 quota exhaustion, or System1 contamination.

Before retry, nine execution-critical blobs were compared between run head a7561639b8d07ab23bfd1f1cd961b753ee561249 and latest main; workflow, backfill script, verifier, official historical range/date source, current-listing source, D1 adapter, R2 adapter and cold-pack store were unchanged. Therefore failed-job retry is execution-equivalent and does not bypass a newer relevant implementation.

Attempt 2 was started through GitHub failed-job rerun. At latest readback: run_attempt=2, migrate=SUCCESS, backfill=IN_PROGRESS. Acceptance remains blocked until terminal SUCCESS + Physical verify PASS + evidence artifact + System1 isolation PASS. If attempt 2 reproduces TimeoutError, do not loop retries; open/route a DATA_LANE verifier-resiliency correction with stage-level diagnostics/retry hardening before another annual continuation.


## 2026-10-06 2021 TPEx canonical revision blocker

Run #18 attempt 2 produced artifact `11409737982` and conclusively changed the blocker classification from infrastructure quota / transient timeout to `SOURCE_REVISION_WITH_CANONICAL_A1_CHANGE`. The D1 quota blocker is resolved; the market-year remains unaccepted because 698 canonical A1 rows changed on official date 2021-01-14. Evidence path: `system2/evidence/S2_HISTORICAL_TPEX_2021_REVISION_BLOCKER_V0_1.json`. Exact continuation is revision-lineage engineering, not another blind retry.
