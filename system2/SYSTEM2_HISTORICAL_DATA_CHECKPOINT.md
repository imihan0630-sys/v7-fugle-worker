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
- 2021 TPEx: data coverage PASS / replay readiness PARTIAL;
- 2022 TWSE: data coverage PASS / replay readiness PARTIAL;
- 2022 TPEx: data coverage PASS / replay readiness PARTIAL.
- 2023 TWSE: data coverage PASS / replay readiness PARTIAL.
- 2023 TPEx: data coverage PASS / replay readiness PARTIAL.
- 2024 TWSE: data coverage PASS / replay readiness PARTIAL.

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


## 2026-10-07 2021 TPEx PIT revision recovery implementation ready

The DATA_LANE priority is temporarily switched from 2024 annual population back to the explicit 2021 TPEx canonical-source revision blocker.

Implementation now present on main:
- additive isolated-D1 revision-lineage migration: `system2/sql/0008_historical_revision_lineage.sql` (global schema remains 1.1);
- PIT revision evaluator / selector: `system2/runtime/historical_revision_lineage_v0_1.mjs`;
- PIT replay resolves versions by `availableAt` and remains fail-closed on same-availability conflicts;
- bounded overlay script: `system2/scripts/historical_tpex_2021_revision_overlay_v0_1.mjs`;
- verifier V0.5 accepts canonical mismatch only when persisted pre/post PIT lineage is physically READY;
- dedicated recovery workflow: `.github/workflows/system2-historical-tpex-2021-revision-recovery.yml`.

The overlay is bounded to `2021 / TPEX / 2021-01-14` and asserts the frozen blocker signature before writing: 780 source-row revisions, 698 canonical A1 revisions, 82 source-only revisions, one revised market date. It preserves the immutable cold baseline and writes revised rows as `PROSPECTIVE_OBSERVATION` versions. Partial retries reuse the first persisted prospective availability timestamp instead of creating another revision version.

Validation completed before physical execution:
- System2 Research CI `37550297713`: SUCCESS on the idempotent overlay implementation;
- earlier lineage / PIT pre-post selection tests: PASS;
- System1 Formal Core / production files are not modified by the recovery workflow.

Exact next action: run the dedicated recovery workflow from latest main. It will migrate the additive isolated-D1 tables, capture the 2021 TPEx revision overlay, then immediately run Physical verify V0.5. Do not run the generic annual backfill and do not overwrite/delete the 2021 cold packs.

Recovery workflow URL: https://github.com/imihan0630-sys/v7-fugle-worker/actions/workflows/system2-historical-tpex-2021-revision-recovery.yml

Acceptance gate: overlay result must be `PASS_TPEX_2021_REVISION_LINEAGE`, verifier must be terminal SUCCESS with `effectiveDataIntegrityState=PASS_WITH_PIT_REVISION_LINEAGE`, Data Coverage PASS, System1 isolation PASS. Only then may 2021 TPEx move from BLOCKED to PASS/PARTIAL and annual continuation return to 2024 TWSE.


## 2026-10-07 2021 TPEx revision-lineage recovery ready for execution

DATA_LANE priority is temporarily switched from 2024 annual continuation back to the unresolved 2021 TPEx canonical source revision blocker.

Implemented recovery path:
- generic PIT revision-lineage evaluator: `system2/runtime/historical_revision_lineage_v0_1.mjs`;
- PIT replay now resolves the latest version whose `availableAt <= decisionTimestamp`, while same-availability conflicting revisions remain fail-closed;
- bounded 2021-01-14 TPEx overlay persistence: `system2/scripts/historical_tpex_2021_revision_overlay_v0_1.mjs`;
- overlay preserves immutable cold baseline and writes official revised values only as a second hot-A1 version with `availabilityBasis=PROSPECTIVE_OBSERVATION` and revision first-known timestamp;
- frozen blocker signature is enforced: 780 source-row revisions / 698 canonical A1 changes / 82 source-only revisions / one market date 2021-01-14;
- annual physical verifier V0.5 accepts canonical changes only when physical persisted lineage proves baseline/revised coverage and deterministic pre/post as-of selection;
- no D1 schema migration was required; existing `s2_historical_a1_bars` multi-version semantics are reused;
- dedicated recovery workflow: `.github/workflows/system2-historical-tpex-2021-revision-recovery.yml`.

Validation completed before execution:
- System2 Research CI run `37550297713`: SUCCESS on the idempotent recovery implementation;
- V8 Regression run `37550326757`: SUCCESS on annual workflow integration;
- V8 Regression run `37550329803`: SUCCESS after dedicated recovery workflow addition;
- latest-main critical runtime/test/verifier/overlay blobs remain byte-identical to the CI-PASS implementation.

Exact execution action: fresh-dispatch the dedicated `System2 Historical 2021 TPEx Revision Recovery` workflow. It performs overlay persistence -> V0.5 physical re-verification -> evidence upload -> System1 isolation. No year/market input is required.

Workflow URL: https://github.com/imihan0630-sys/v7-fugle-worker/actions/workflows/system2-historical-tpex-2021-revision-recovery.yml

Do not advance to 2024 TWSE until this dedicated recovery reaches terminal verification. Do not rerun old run #18 as a substitute.


## 2026-10-07 2021 TPEx transport-semantics root cause / fresh recovery required

Recovery run `37552411600` / #1 failed closed before writing any revision overlay because the frozen blocker expected 698 canonical A1 mismatches, while the current canonical PRIMARY TPEx source returned 0 canonical mismatches.

Root cause is now established as non-equivalent official TPEx transport semantics, not a verified canonical A1 source revision:
- PRIMARY endpoint title: `上櫃股票行情`;
- legacy endpoint title: `上櫃股票每日收盤行情(不含定價)`;
- representative 1240 PRIMARY = volume 18,564 / value 1,005,344 / tx 22, while legacy = 18,000 / 974,800 / 15;
- representative 3228 PRIMARY = 793,962 / 182,271,509 / 665, while legacy = 780,000 / 179,040,000 / 554;
- run #18 artifact retained fresh mismatch values matching the legacy `不含定價` endpoint;
- current PRIMARY reconciliation returns canonical A1 equality with the immutable cold baseline while source-row identity still differs.

Remediation:
- canonical TPEx A1 transport policy is now `PRIMARY_ONLY_FAIL_CLOSED_NON_EQUIVALENT_LEGACY`;
- legacy fallback remains diagnostic-only and cannot satisfy canonical A1 ingestion;
- recovery overlay now writes zero revision rows when PRIMARY canonical values equal cold baseline, and emits a source-semantics recovery receipt instead;
- System2 Research CI `37554545204`: SUCCESS;
- System1 Formal Core / production runtime remains untouched.

Durable evidence: `system2/evidence/S2_HISTORICAL_TPEX_2021_TRANSPORT_SEMANTICS_ROOT_CAUSE_V0_1.json`.

Fresh recovery is required because run #1 is bound to pre-fix head. Do not use Re-run on run #1. Launch a new workflow_dispatch from latest main:
https://github.com/imihan0630-sys/v7-fugle-worker/actions/workflows/system2-historical-tpex-2021-revision-recovery.yml

Acceptance gate: source-semantics recovery PASS, Physical verifier V0.5 SUCCESS, Data Coverage PASS, System1 isolation PASS. Only then reclassify 2021 TPEx to PASS/PARTIAL and resume 2024 TWSE.


## 2026-10-07 2021 TPEx durable acceptance after transport-semantics recovery

Recovery run `37555975307` / #3 completed SUCCESS on head `55f6463b9686fa3e9b0515a6a1613fa24e455b56`.

The prior 2021-01-14 canonical-revision diagnosis is superseded. Direct official-source comparison proved that the old legacy fallback reports `上櫃股票每日收盤行情(不含定價)` and is not canonical-equivalent to PRIMARY `上櫃股票行情`. The apparent 698 canonical changes in run #18 matched the legacy fallback semantics rather than a verified official canonical correction.

Recovery facts:
- source-semantics recovery result: `PASS_TPEX_2021_SOURCE_SEMANTICS_RECOVERY`;
- canonical transport: PRIMARY only / fail-closed;
- target-date cold/fresh rows: 780 / 780;
- target-date source-row differences: 780;
- target-date canonical A1 mismatches: 0;
- persisted revision rows written: 0;
- immutable cold history mutated: false.

Physical verifier V0.5 acceptance facts:
- official trading dates: 244;
- cold/fresh full-year rows: 191,643 / 191,643;
- packs / R2 HEAD / byte checks: 795 / 795 / 795 PASS;
- missing-from-cold / absent-from-fresh: 0 / 0;
- source-row hash mismatch / canonical A1 mismatch: 0 / 0;
- effective data integrity: PASS;
- expected membership-session bars: 192,055;
- actual bars: 191,643;
- UNKNOWN symbol-session gaps: 412;
- unexpected bars: 0;
- data coverage: PASS;
- replay readiness: PARTIAL;
- System1 production isolation: PASS.

Accepted evidence: `system2/evidence/S2_HISTORICAL_TPEX_2021_PHYSICAL_VERIFICATION_V0_1.json`.

Historical blocker provenance remains preserved and must not be deleted:
- `system2/evidence/S2_HISTORICAL_TPEX_2021_REVISION_BLOCKER_V0_1.json` — superseded false canonical-revision diagnosis;
- `system2/evidence/S2_HISTORICAL_TPEX_2021_TRANSPORT_SEMANTICS_ROOT_CAUSE_V0_1.json` — root-cause evidence.

Run: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37555975307

Artifact: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37555975307/artifacts/11455912132

Next annual continuation: fresh workflow_dispatch `year=2024`, `market=TWSE` from latest main. 2021 TPEx is no longer an active annual-history blocker.


## 2026-10-07 2021 TPEx latest-main recovery confirmation

Recovery run `37563020090` / #6 completed SUCCESS on latest-main head `9b145291e04e6c3fcb2a8408a6f7a983d80e4f02` after the listing-metadata schema fix and its regression synchronization were merged.

Confirmation facts:
- source-semantics recovery: `PASS_TPEX_2021_SOURCE_SEMANTICS_RECOVERY`;
- target-date signature: 780 source-row differences / 0 canonical A1 differences / 780 source-only differences;
- persisted revision rows written: 0;
- immutable cold history mutated: false;
- Physical verify V0.5: `PASS_MARKET_YEAR_DATA_PARTIAL_REPLAY_READINESS`;
- storage: 795 packs / 191,643 bars / 795 R2 HEAD + byte checks;
- full-year cold/fresh rows: 191,643 / 191,643;
- full-year source-row / canonical A1 mismatch: 0 / 0;
- System1 production isolation: PASS.

Run: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37563020090

Artifact: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37563020090/artifacts/11458710901

Artifact digest: `sha256:c8a051d94dba13525525f7cf9645ad74c69ae1bc4f5d488e40106658339fa262`.


## 2026-10-07 2024 TWSE durable acceptance

Annual run `37564954928` / #26 completed SUCCESS on latest-main head `6f50f29de3fd90259dadcb94a3964917af4b13c3` with confirmed inputs `year=2024`, `market=TWSE`.

Acceptance facts:
- annual backfill: PASS / `YEAR_BACKFILL_COMPLETE`;
- official trading dates: 242;
- cold/fresh official rows: 246,037 / 246,037;
- packs / symbols: 1,038 / 1,038;
- R2 HEAD / byte verification: 1,038 / 1,038 PASS;
- missing-from-cold / absent-from-fresh: 0 / 0;
- source-row / canonical A1 mismatch: 0 / 0;
- source version: STABLE;
- historical-universe readiness: `PASS_OFFICIAL_CURRENT_NEWLISTING_DELISTING_UNION`;
- membership-session denominator: 246,515;
- actual bars: 246,037;
- UNKNOWN symbol-session gaps: 478;
- unexpected bars: 0;
- data coverage: PASS;
- replay readiness: PARTIAL;
- System1 production isolation: PASS.

Durable evidence: `system2/evidence/S2_HISTORICAL_TWSE_2024_PHYSICAL_VERIFICATION_V0_1.json`.

Run: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37564954928

Artifact: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37564954928/artifacts/11460055754

Artifact digest: `sha256:3ff4f18b7fee67b2ebc3ef9f41597e6ef3f594d7ec8e6c745c520b161b30df5b`.

Next annual continuation: fresh workflow_dispatch `year=2024`, `market=TPEX` from latest main. CORR-001 remains `FIX_IN_PROGRESS` until all required market-years are completed or explicitly blocked/deferred and independent closure criteria are satisfied.


## 2026-10-07 2025 annual-history preflight ready

2025 annual-history execution has been preflighted while 2024 TPEx run #28 remains active. No 2025 writer has been launched yet.

Preflight facts:
- annual workflow explicitly exposes `2025` for both TWSE and TPEx;
- annual script allows completed calendar years through `taipeiCalendarYear - 1`; at 2026 runtime, 2025 is valid and 2026 remains excluded to the incremental path;
- annual workflow semantics test explicitly guards years 2017-2025 and excludes 2026;
- System2 Research CI on run #28 head `9dff76fb235e8da38e8f07c38e355c7be6046d5a`, run `37587792086`, completed SUCCESS;
- TWSE verifier path continues to require the official current + NEWLISTING + DELISTING union with zero unknown starts and full replay-eligible membership before data-coverage acceptance;
- TPEx verifier path remains intentionally `PARTIAL_OBSERVED_INTERVAL_NO_OFFICIAL_DELISTING_UNION`; it does not fabricate complete historical delisting coverage;
- TPEx canonical historical A1 source policy is `PRIMARY_ONLY_FAIL_CLOSED_NON_EQUIVALENT_LEGACY`; the legacy `不含定價` endpoint cannot satisfy canonical ingestion;
- the bounded 2021 TPEx revision-lineage step is conditional on `year=2021 / market=TPEX` and will be skipped for 2025;
- 2025 TWSE and 2025 TPEx coverage-matrix rows remain `PENDING`, as required before physical execution;
- annual execution uses `system2-isolated-d1-writer` concurrency, so no 2025 annual writer should be launched while 2024 TPEx run #28 still owns the writer lane.

Execution order after run #28 terminal acceptance:
1. finish 2024 TPEx Physical verify / artifact / System1-isolation readback and canonical acceptance;
2. fresh-dispatch `2025 / TWSE` from then-latest main;
3. accept or explicitly block 2025 TWSE from physical evidence;
4. fresh-dispatch `2025 / TPEX`;
5. accept or explicitly block 2025 TPEx;
6. only after both 2025 markets are resolved, advance to the separate 2026 incremental-history path and aggregate full-market replay qualification.

This preflight does not claim 2025 data completion and does not modify System1 Formal Core or production runtime.


## 2026-10-07 2026 current-year segmented cold path repository ready

The 2026 current-year history gap now has a repository-implemented segmented-cold design. Physical execution is intentionally NOT started while the 2024 TPEx annual writer is active.

Why a separate path is required:
- completed-year annual cold manifests are immutable and enforce `UNIQUE (market, symbol, year, price_space)`;
- writing a partial 2026 annual pack and later extending it would violate the immutable annual-pack contract;
- large row-wise D1 current-year population would reintroduce the row-write amplification/quota risk already observed during historical population.

Implemented repository path:
- migration `system2/sql/0010_current_year_segmented_cold_store.sql`;
- segmented manifest/checkpoint/receipt tables keyed by market/symbol/year/month;
- runtime `system2/runtime/historical_segmented_cold_store_v0_1.mjs` with create-only R2 objects, immutable manifest conflict detection, receipt-last semantics, R2 HEAD + byte-SHA verification and segment query readback;
- script `system2/scripts/historical_current_year_segment_backfill_v0_1.mjs` that writes only fully completed Taipei calendar months of the current year and never writes the active incomplete month;
- workflow `.github/workflows/system2-historical-current-year-segment-backfill.yml`, manual one-market-at-a-time, using the same `system2-isolated-d1-writer` concurrency lock as annual history;
- historical replay loader now reads segmented manifests only for years that do not yet have a complete annual pack; once an annual pack exists for that year, annual storage supersedes segments to prevent duplicate bars;
- existing hot/prospective history lanes remain the bridge for the current incomplete month; they are not relabeled as completed-month cold evidence;
- after the calendar year closes, 2026 can be compacted into the normal annual pack without deleting segment provenance.

Repository validation:
- System2 Research CI `37590126168`: SUCCESS;
- `historical_current_year_segment_workflow_guard.test.mjs`: PASS;
- `historical_segmented_cold_store_v0_1.test.mjs`: PASS;
- syntax validation: PASS;
- research SQL validation: PASS;
- production-isolation guard: PASS.

Current disposition: REPOSITORY_READY / PHYSICAL_EXECUTION_PENDING.

Do not physically run this 2026 path until both 2025 markets are resolved and no annual writer owns the isolated D1/R2 writer lane. The first physical 2026 execution must run TWSE first, verify segment receipts/object hashes/readback, then TPEX, with explicit evidence before aggregate current-year history is considered usable for replay.


## 2026-10-07 2024 TPEx transport failure / resilient fresh reverify ready

Annual run `37587943578` / #28 used confirmed inputs `year=2024 / market=TPEX` and failed twice before any market-year physical acceptance.

Attempt 1:
- annual backfill stopped on TPEx PRIMARY transport timeout for `2024-04-26`;
- legacy `不含定價` fallback remained forbidden;
- Physical verify was skipped;
- System1 isolation PASS.

Attempt 2:
- failed-job rerun was permitted only as an execution-equivalent transient retry on the same old head;
- annual backfill stopped on TPEx PRIMARY transport timeout for a different date, `2024-01-15`;
- Physical verify was skipped;
- System1 isolation PASS.

The date shift proves an intermittent GitHub-runner ↔ TPEx PRIMARY transport failure rather than a deterministic corrupt market date. Blind reruns of #28 are stopped.

Transport-resilience remediation is now on main:
- `system2/runtime/official_historical_backfill_source_v0_1.mjs` adds one bounded range-level recovery round only after inner PRIMARY transport exhaustion;
- data-integrity/schema/date/OHLC failures remain fail-closed and are never retried into success;
- TPEx legacy endpoint remains canonical-ineligible;
- receipt exposes `transportRecoveryRound` / `transportRecoveryCount` and policy `PRIMARY_ONLY_RETRY_AFTER_TRANSPORT_EXHAUSTION`;
- regression proves the first PRIMARY round may exhaust and the second round may recover while every request stays on PRIMARY.

Validation: System2 Research CI `37590871628` SUCCESS on head `e46f3a2049cc774a64b15eea360a4f6ea79fe494`.

Disposition: 2024 TPEx remains PENDING / NOT ACCEPTED. Old run #28 must not be rerun again because it is bound to pre-fix head `9dff76fb235e8da38e8f07c38e355c7be6046d5a`.

Exact next execution: fresh workflow_dispatch from latest main, `year=2024`, `market=TPEX`. Acceptance still requires annual backfill PASS + Physical verify PASS + artifact + System1 isolation PASS.

Workflow: https://github.com/imihan0630-sys/v7-fugle-worker/actions/workflows/system2-historical-pack-2017-backfill.yml


## 2026-10-07 2024 TPEx run #29 timeout diagnosis / bounded timeout hardening

Fresh annual run `37593983170` / #29 used confirmed inputs `year=2024 / market=TPEX` on head `5c50a246bf91f9b1bc37c99f082bdfec467d5f09`.

Terminal facts:
- migrate: SUCCESS;
- annual backfill ran from 2026-10-07T08:28:55Z until the GitHub Actions job limit;
- backfill job was CANCELLED after exceeding the configured `timeout-minutes: 60`;
- Physical verify was skipped;
- no physical coverage JSON/artifact was produced;
- System1 production isolation: PASS;
- no market-year acceptance is claimed from run #29.

This changes the blocker classification from source transport failure to workflow execution-budget insufficiency for the resilient path. The bounded PRIMARY transport-recovery implementation remained fail-closed; the job simply did not have enough wall-clock headroom to complete annual ingest plus downstream physical verification.

DATA_LANE hardening:
- annual backfill job timeout increased from 60 to 120 minutes;
- timeout remains finite and applies only to the isolated System2 annual-history writer job;
- strategy/ranking/final-selection, System1 Formal Core, production push, capital/order behavior and broker routing are unchanged;
- regression guard now requires the bounded 120-minute annual timeout so the transport-recovery path cannot silently regress to the known 60-minute cutoff.

After this hardening is merged and CI is green, the exact physical continuation is a new fresh workflow_dispatch from latest main with `year=2024 / market=TPEX`. Do not rerun #29 because it is bound to the pre-timeout-hardening head. Acceptance still requires annual backfill PASS + Physical verify PASS + artifact + System1 isolation PASS.
