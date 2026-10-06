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
- 2021 TWSE: data coverage PASS / replay readiness PARTIAL;
- 2022 TWSE: data coverage PASS / replay readiness PARTIAL;
- 2022 TPEx: data coverage PASS / replay readiness PARTIAL.
- 2023 TWSE: data coverage PASS / replay readiness PARTIAL.
- 2023 TPEx: data coverage PASS / replay readiness PARTIAL.

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


## 2026-10-06 continuation after explicit 2021 TPEx revision block

Schema inspection confirms the current cold manifest contract is single-version per `(market, symbol, year, price_space)` via a UNIQUE constraint. It intentionally cannot accept a second canonical version by overwriting the first immutable pack. A future revision layer must therefore be separate from the baseline cold manifest and must preserve explicit observed/captured timing.

CORR-001 acceptance permits each later market-year to have either durable completion or an explicit blocked/deferred receipt. Therefore the 2021 TPEx canonical-revision blocker does not require DATA_LANE to stop annual population of independent later market-years.

Two active continuations are now valid and non-conflicting:
1. keep 2021 TPEx BLOCKED while revision-lineage/as-of semantics are engineered and verified;
2. continue annual cold-history population with 2022 TWSE, then 2022 TPEx, preserving the same physical acceptance standard and explicit blockers.

Immediate executable continuation: fresh workflow_dispatch `year=2022`, `market=TWSE` from latest main. Do not use rerun of run #18 because its inputs are 2021/TPEX. After 2022 TWSE terminal completion, perform full Physical verify/artifact/System1-isolation readback before acceptance.

Workflow URL: https://github.com/imihan0630-sys/v7-fugle-worker/actions/workflows/system2-historical-pack-2017-backfill.yml


## 2026-10-06 2022 TWSE fresh-dispatch run #19

Fresh workflow_dispatch was confirmed on branch `main` with run `37467099680` / #19.

- run head: `507fdd83ad9df9b3703cbc65e8940dda6b0c2662`;
- latest main at dispatch readback: same SHA `507fdd83ad9df9b3703cbc65e8940dda6b0c2662`;
- event: `workflow_dispatch`;
- migrate: SUCCESS;
- backfill: IN_PROGRESS at latest readback;
- Physical verify: PENDING;
- evidence artifact: PENDING;
- System1 isolation: PENDING.

The REST run payload does not expose workflow_dispatch input values. The requested continuation is 2022/TWSE, and the exact year/market inputs must be verified from the job log before acceptance. Do not accept or advance the market-year solely from run creation metadata.

Run URL: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37467099680


## 2026-10-06 run #19 execution-drift validation

While run #19 remained in annual backfill, execution-critical blobs were compared from run head `507fdd83ad9df9b3703cbc65e8940dda6b0c2662` to then-latest main `816219437798a93bb11eae15b2f795139e013dcd`.

Unchanged blobs:
- annual workflow: `98121be7b81b79feee939573d7ce2d58e0d8ffd1`;
- annual backfill script: `c21b59f1d3550601161dc2554ab25c534d26cd95`;
- physical verifier: `59ecad64c3fd24e9561ac82177609374da0c1e0c`;
- official historical range source: `c8528388ba82282461ba668dce8a4918122b3499`;
- official historical date source: `0e08275d8ec545fb4afe799a77fae7952f5d57e9`;
- current listing metadata source: `c1bf7b4ef8ba6b08b21fc61c991ab7adf6b810de`;
- remote D1 adapter: `aafef9b8ddf9de3f16cdeca139f574879419a6f2`;
- remote R2 adapter: `5a9fc975de62e1a10a803529e1db68bf943701d0`;
- cold-pack store: `5901e414ac8668a31c717ce9c70869fa9eacc888`.

Conclusion: later main movement does not change the execution semantics of run #19. At latest readback, migrate=SUCCESS, annual backfill=IN_PROGRESS, Physical verify/artifact/System1 isolation=PENDING. Continue from run URL: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37467099680


## 2026-10-06 2022 TWSE durable acceptance

Run `37467099680` / #19 completed SUCCESS on head `507fdd83ad9df9b3703cbc65e8940dda6b0c2662` with confirmed inputs `year=2022`, `market=TWSE`.

Acceptance facts:
- annual backfill: PASS / YEAR_BACKFILL_COMPLETE;
- official trading dates: 246;
- cold/fresh official rows: 237,941 / 237,941;
- packs / symbols: 985 / 985;
- R2 HEAD / byte-GET verification: 985 / 985 PASS;
- missing-from-cold / absent-from-fresh: 0 / 0;
- source-row hash mismatch / canonical A1 mismatch: 0 / 0;
- source version: STABLE;
- historical-universe readiness: PASS_OFFICIAL_CURRENT_NEWLISTING_DELISTING_UNION;
- expected membership-session bars: 238,640;
- actual bars: 237,941;
- UNKNOWN symbol-session gaps: 699;
- data coverage: PASS;
- replay readiness: PARTIAL;
- System1 production isolation: PASS.

Durable evidence: `system2/evidence/S2_HISTORICAL_TWSE_2022_PHYSICAL_VERIFICATION_V0_1.json`.

Artifact: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37467099680/artifacts/11416932962

Run: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37467099680

Disposition: 2022 TWSE is accepted for raw A1 data coverage with replay readiness explicitly PARTIAL; UNKNOWN gaps are retained fail-closed and are not treated as raw-source loss.

Next annual continuation: fresh workflow_dispatch `year=2022`, `market=TPEX` from latest main. Keep the separate 2021 TPEx canonical-revision blocker open in parallel; do not overwrite its immutable cold history.


## 2026-10-06 2022 TPEx fresh-dispatch run #20

Fresh workflow_dispatch run `37473405416` / #20 was confirmed on branch `main`.

- run head: `f5f33c9f006e249c604f3f19067bf33f2a106117`;
- event: `workflow_dispatch`;
- migrate: SUCCESS;
- annual backfill: IN_PROGRESS at latest readback;
- Physical verify / evidence artifact / System1 isolation: PENDING.

Execution-drift validation from run head to then-latest main confirmed the annual workflow, backfill script, verifier, official historical sources, listing metadata source, D1 adapter, R2 adapter and cold-pack store are byte-identical. Later main movement therefore does not change the execution semantics of run #20.

The GitHub API does not expose workflow_dispatch inputs in the run payload and the in-progress job log blob is not yet available for readback. The requested continuation is 2022/TPEX; exact year/market inputs must be confirmed from the job log before market-year acceptance.

Run URL: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37473405416


## 2026-10-06 2022 TPEx durable acceptance

Run `37473405416` / #20 completed SUCCESS on head `f5f33c9f006e249c604f3f19067bf33f2a106117` with confirmed inputs `year=2022`, `market=TPEX`.

Acceptance facts:
- annual backfill: PASS / YEAR_BACKFILL_COMPLETE;
- official trading dates: 246;
- cold/fresh official rows: 195,840 / 195,840;
- packs / symbols: 815 / 815;
- R2 HEAD / byte-GET verification: 815 / 815 PASS;
- missing-from-cold / absent-from-fresh: 0 / 0;
- source-row hash mismatch / canonical A1 mismatch: 0 / 0;
- source version: STABLE;
- historical-universe readiness: PARTIAL_OBSERVED_INTERVAL_NO_OFFICIAL_DELISTING_UNION;
- expected membership-session bars: 196,015;
- actual bars: 195,840;
- UNKNOWN symbol-session gaps: 175;
- data coverage: PASS;
- replay readiness: PARTIAL;
- System1 production isolation: PASS.

Durable evidence: `system2/evidence/S2_HISTORICAL_TPEX_2022_PHYSICAL_VERIFICATION_V0_1.json`.

Artifact: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37473405416/artifacts/11419964963

Run: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37473405416

Disposition: 2022 TPEx is accepted for raw A1 data coverage with replay readiness explicitly PARTIAL. The remaining debt is 175 explicit UNKNOWN symbol-session gaps plus incomplete official TPEx historical delisting-union coverage; none of this is coerced to raw-source completeness.

Next annual continuation: fresh workflow_dispatch `year=2023`, `market=TWSE` from latest main. Keep the separate 2021 TPEx canonical-revision blocker open in parallel.


## 2026-10-06 2023 TWSE universe blocker / fix pending CI

Run `37482307633` / #21 was a fresh 2023/TWSE dispatch and completed annual backfill successfully, but Physical verify failed closed with `BLOCKED_MARKET_YEAR_VERIFICATION`.

Confirmed non-blockers:
- cold storage / completion receipt: PASS;
- fresh official reconciliation: STABLE;
- missing-from-cold / absent-from-fresh: 0 / 0;
- source-row hash mismatch / canonical A1 mismatch: 0 / 0;
- System1 production isolation: PASS.

Actual blocker:
- `unexpectedBars = 205`;
- retained unexpected sample begins `2023-03-06|6873` and continues through the historical period;
- official TWSE evidence shows 6873 began TWSE Innovation Board trading on 2023-03-06 and later changed to regular listed trading on 2024-09-26;
- the D08 TWSE universe builder used the CURRENT company basic-data listing date for current memberships and used NEWLISTING history only for DELISTED pairing, so an Innovation-Board-to-mainboard current company could inherit the later listing date and lose earlier continuous TWSE membership.

Durable blocker evidence: `system2/evidence/S2_HISTORICAL_TWSE_2023_UNIVERSE_BLOCKER_V0_1.json`.

Implementation:
- runtime fix commit: `a0bf42f81fa46fc3854d2c8cf844851327966a9b`;
- regression-test commit: `045d40399c7845ef76cea4051b4a05b2599e1be2`;
- reconciliation is conservative: same symbol + normalized same company identity (including `-創` suffix normalization) + earlier official NEWLISTING date; different-company same-code rows are not stitched;
- verifier fail-closed semantics remain unchanged.

Validation gate: System2 Research CI run `37490564826` is pending at latest readback. Do not fresh-dispatch 2023/TWSE until this CI passes. After PASS, fresh-dispatch 2023/TWSE from then-latest main; do not rerun old run #21 because it is bound to pre-fix head `30a1f9e7b7bf7e344f0cd44242efb701e56b6f4b`.

Run #21: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37482307633
Fix CI: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37490564826


## 2026-10-07 2023 TWSE post-fix fresh re-verification run #22

Fresh post-fix workflow_dispatch run `37493424179` / #22 is active on branch `main`.

- run head: `4f0033fba02603fa0edc7b33e8f38e1cb4c3b6e8`;
- run head matched latest main at readback;
- migrate: SUCCESS;
- annual backfill: SUCCESS;
- Physical verify: IN_PROGRESS;
- evidence artifact / System1 isolation: PENDING.

The run contains the same fix/test/verifier/workflow blobs as the CI-PASS fix-bearing reference `751f57afe31c9a618c3866def24843efc8bfc7f8`, including runtime blob `3066601a564e49f0267b56b81ba67bc62e19e1ca` and regression-test blob `fadd8d80edca670211494fea0dcc5718093f1544`.

Do not mark 2023 TWSE accepted until run #22 reaches terminal success and the verifier confirms the prior 205 unexpected bars are resolved without weakening fail-closed semantics.

Run URL: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37493424179


## 2026-10-07 2023 TWSE run #22 failure / second fix CI pass

Run `37493424179` / #22 completed FAILURE at Physical verify while annual backfill and System1 isolation both PASSed.

Run #22 confirmed that the first listing-start repair was insufficient:
- storage receipt: COMPLETE;
- packs / bars: 1,003 / 234,727;
- R2 HEAD / byte verification: 1,003 / 1,003 PASS;
- cold rows = fresh official rows = 234,727;
- source-row / canonical A1 mismatches: 0 / 0;
- official trading dates: 239;
- historical universe membership count: 1,101;
- `currentListingStartReconciledCount = 0`;
- expected membership-session bars: 235,140;
- matched actual bars: 234,522;
- missing / UNKNOWN bars: 618 / 618;
- unexpected bars: 205, still beginning with `2023-03-06|6873`;
- data coverage / replay readiness: BLOCKED / BLOCKED.

Root cause refinement: CURRENT company rows use the legal company name while TWSE NEWLISTING rows use the company short name. The first repair compared only one normalized name field, so the same company did not match even though the symbol and earlier Innovation Board date were correct.

Second repair:
- runtime commit: `6a227f96cb0af9d6c1620402be25b93167eb4e16`;
- regression commit: `64d2f7e8ecf923e0b133101e340c78222facddef`;
- matcher now requires same symbol plus non-empty alias intersection across legal name / company short name after conservative normalization; `-創` is normalized; same-code/different-company remains rejected;
- System2 Research CI run `37495340984`: SUCCESS.

Durable blocker evidence: `system2/evidence/S2_HISTORICAL_TWSE_2023_UNIVERSE_BLOCKER_V0_2.json`.

Exact next action: fresh workflow_dispatch `year=2023`, `market=TWSE` from a latest main whose runtime/test/verifier/workflow blobs remain identical to the CI-PASS second-fix reference. Do not rerun old run #22. Acceptance requires Physical verify to remove the 205 unexpected bars without weakening fail-closed semantics.

Run #22: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37493424179
Second-fix CI: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37495340984


## 2026-10-07 2023 TWSE durable acceptance after universe repair

Fresh run `37534409279` / #23 completed SUCCESS on head `676c26a53f59aa8cb6b07afbd0453ba3e06d8112` with confirmed inputs `year=2023`, `market=TWSE`.

The second historical-universe repair was live-validated rather than inferred from CI alone:
- `currentListingStartReconciledCount = 4`;
- reconciled symbols: `2465, 2482, 2486, 6873`;
- prior `unexpectedBars = 205` reduced to `0`;
- verifier fail-closed semantics were not relaxed.

Acceptance facts:
- annual backfill / storage: PASS;
- packs / bars: 1,003 / 234,727;
- R2 HEAD / byte verification: 1,003 / 1,003 PASS;
- official trading dates: 239;
- cold/fresh official rows: 234,727 / 234,727;
- missing-from-cold / absent-from-fresh: 0 / 0;
- source-row hash mismatch / canonical A1 mismatch: 0 / 0;
- source version: STABLE;
- historical-universe readiness: PASS_OFFICIAL_CURRENT_NEWLISTING_DELISTING_UNION;
- membership-session denominator: 235,345;
- actual bars: 234,727;
- UNKNOWN symbol-session gaps: 618;
- unexpected bars: 0;
- data coverage: PASS;
- replay readiness: PARTIAL;
- System1 production isolation: PASS.

Durable evidence: `system2/evidence/S2_HISTORICAL_TWSE_2023_PHYSICAL_VERIFICATION_V0_1.json`.

Run: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37534409279

Artifact: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37534409279/artifacts/11446466007

Prior blocker evidence V0_1/V0_2 remains immutable historical provenance and is superseded operationally by this accepted run; it must not be deleted.

Next annual continuation: fresh workflow_dispatch `year=2023`, `market=TPEX` from latest main. The separate 2021 TPEx canonical-revision blocker remains open in parallel.


## 2026-10-07 2023 TPEx durable acceptance

Run `37537013825` / #24 completed SUCCESS on head `608384f9638989c78d97475fe9417bbfdfa51ade` with confirmed inputs `year=2023`, `market=TPEX`.

Acceptance facts:
- annual backfill: PASS;
- official trading dates: 239;
- cold/fresh official rows: 193,327 / 193,327;
- packs / symbols: 824 / 824;
- R2 HEAD / byte verification: 824 / 824 PASS;
- missing-from-cold / absent-from-fresh: 0 / 0;
- source-row hash mismatch / canonical A1 mismatch: 0 / 0;
- source version: STABLE;
- historical-universe readiness: PARTIAL_OBSERVED_INTERVAL_NO_OFFICIAL_DELISTING_UNION;
- expected membership-session bars: 193,722;
- actual bars: 193,327;
- UNKNOWN symbol-session gaps: 395;
- unexpected bars: 0;
- data coverage: PASS;
- replay readiness: PARTIAL;
- System1 production isolation: PASS.

Durable evidence: `system2/evidence/S2_HISTORICAL_TPEX_2023_PHYSICAL_VERIFICATION_V0_1.json`.

Independent audit cross-check: `system2/evidence/S2_CORR_20261004_001_AUDIT_PROGRESS_20261007_V0_1.json` independently confirmed physical acceptance and identified only canonical sync debt; no duplicate correction was created.

Run: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37537013825

Artifact: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37537013825/artifacts/11448741341

Next annual continuation: fresh workflow_dispatch `year=2024`, `market=TWSE` from latest main. The separate 2021 TPEx canonical-revision blocker remains open in parallel.
