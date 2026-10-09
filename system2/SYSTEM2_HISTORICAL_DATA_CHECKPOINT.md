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


## 2026-10-07 2024 TPEx run #30 D1 daily-write quota blocker / annual quota hardening

Fresh annual run `37611914140` / #30 used latest `main` head `cd99cd22f2019a8666c3fc25347d0e6fbbd2c595` with the repaired 120-minute backfill timeout, but it never entered backfill.

Terminal facts:
- checkout: PASS;
- migrate job failed inside `system2/deploy/provision_system2_d1.mjs`;
- Cloudflare D1 returned HTTP 400 `daily row write limit exceeded`;
- backfill was skipped;
- Physical verify and artifact generation were never reached;
- no 2024 TPEx market-year acceptance is claimed from run #30.

The annual workflow was unnecessarily re-running the full isolated-D1 provisioning path before every historical backfill. That path replays DDL and writes infrastructure sentinel rows even though the historical backfill script already fail-closes when `s2_schema_meta.schema_version != 1.1`.

DATA_LANE quota hardening:
- remove the redundant `migrate` provisioning job from the annual historical workflow;
- remove `needs: migrate`;
- retain the backfill script's read-only schema-version gate as the fail-closed readiness check;
- preserve the finite 120-minute annual backfill timeout;
- add regression guards forbidding annual-workflow calls to `provision_system2_d1.mjs` and future reintroduction of `needs: migrate`;
- keep dedicated provisioning/migration tooling intact for explicit schema changes.

This reduces avoidable D1 writes but does not bypass the Cloudflare free-tier daily quota. A not-yet-complete market-year still needs legitimate D1 manifest/checkpoint/receipt writes, so fresh physical execution must occur only after the quota resets. System1 Formal Core/runtime, strategy/ranking, capital/order, broker routing and production push behavior remain unchanged.


## 2026-10-07 post-quota read-only annual resume audit / preflight hardening

DATA_LANE performed a no-write audit after 2024 TPEx runs #28-#30.

Observed execution facts:
- run #28 failed during TPEx PRIMARY source acquisition before market-year persistence;
- canonical correction evidence for run #29 states the 60-minute cancellation occurred before source-range completion;
- annual script sequencing is full official range fetch -> deterministic pack build -> cold persistence, so source acquisition itself has no durable per-date resume checkpoint;
- run #30 failed in the former provisioning step before annual backfill started;
- therefore no 2024 TPEx COMPLETE receipt / physical acceptance may be inferred from #28-#30, and no partial source-range progress may be relabeled as durable market-year history.

Cold-store resume semantics revalidated:
- pack payload/object identity excludes `capturedAt`; a later retry with identical official bars produces the same payload/object hashes;
- `captured_at` is provenance metadata and is intentionally excluded from immutable manifest equality;
- existing identical manifests/R2 objects are reused rather than rewritten;
- changed source content or a changed expected checkpoint rolling hash fails closed as `IMMUTABLE_CONFLICT`;
- an interrupted manifest batch can therefore resume safely when the rebuilt official pack identity is unchanged.

New repository hardening:
- `system2/runtime/historical_annual_resume_preflight_v0_1.mjs` classifies CLEAN_START, PARTIAL_RESUME_CANDIDATE, COMPLETE_RECEIPT_PRESENT, COMPLETE_RECEIPT_CHECKPOINT_REPAIR_REQUIRED and BLOCKED_DURABLE_STATE_INCONSISTENT without authorizing D1 writes;
- `system2/scripts/historical_annual_resume_preflight_v0_1.mjs` reads only schema/receipt/checkpoint/manifests plus R2 HEAD metadata and emits an explicit resume receipt before annual backfill;
- annual workflow runs this read-only preflight before source/backfill;
- a receipt-before-final-checkpoint crash window is repaired: when an immutable COMPLETE receipt is valid but the final checkpoint was not sealed, the retry finalizes that checkpoint exactly once; already-complete retries do not add the repair write;
- regressions cover clean start, partial resume, complete state, checkpoint-repair state, R2-head failure and checkpoint finalization.

2025 continuation was also statically revalidated on the current annual path:
- 2025 remains an explicit completed-year option for TWSE/TPEX;
- 2026 remains excluded from the annual path;
- redundant annual D1 provisioning remains removed;
- 120-minute bounded timeout remains required;
- execution order stays 2024 TPEx acceptance -> 2025 TWSE -> 2025 TPEx -> 2026 segmented -> aggregate replay qualification.

No physical D1/R2 mutation was performed by this audit. System1 Formal Core/runtime, strategy/ranking, final selection, capital/order and broker authority remain unchanged.

Exact next physical continuation after quota reset: fresh latest-main `2024 / TPEX`; first consume the read-only resume preflight result, then allow source/backfill only if the durable state is not blocked.


## 2026-10-07 segmented-current-year dry audit / replay-gate readback

DATA_LANE continued with repository/read-only work only; no new physical D1/R2 ingestion was performed.

2026 segmented-current-year dry audit:
- active incomplete Taipei month remains excluded by `throughMonth=currentMonth-1`;
- monthly manifests remain uniquely keyed by market/symbol/year/month/price-space;
- immutable object/manifest conflict and R2 byte-hash verification remain covered;
- hybrid cold loader continues to prefer a completed annual pack over same-year segments, preventing annual+segment duplicate bars;
- current-year workflow still performs full D1 provisioning before segmented backfill, but that workflow-level quota coordination conflict is now owned by `S2-CORR-20261007-003 / REMEDIATION_LANE`; DATA_LANE did not seize or modify that conflict unit.

A DATA_LANE-local crash window was identified in segmented persistence:
- a COMPLETE segment receipt may exist if execution stops after receipt insertion but before the final checkpoint is sealed COMPLETE;
- the current-year script previously treated any COMPLETE receipt as `ALREADY_RECEIPTED` and skipped the month without repairing that checkpoint.

Repository hardening on the DATA_LANE branch:
- add receipt-driven segment checkpoint finalization;
- checkpoint identity/count/rolling-hash mismatch remains fail-closed as `IMMUTABLE_CONFLICT`;
- if the checkpoint is already COMPLETE, no repair write is emitted;
- if the checkpoint is missing/incomplete, the COMPLETE receipt is physically verified against manifests/R2 before exactly one final checkpoint repair;
- the current-year script invokes this finalizer before skipping an already-receipted month;
- regressions cover no-op complete rerun and receipt-before-final-checkpoint recovery.

Aggregate replay-input gate readback from
`system2/SYSTEM2_HISTORICAL_MARKET_YEAR_COVERAGE_MATRIX.json`
(`updatedAt=2026-10-07T11:55:29+08:00`):
- expected completed annual market-year legs for 2017-2025: 18;
- physically accepted annual legs: 15;
- remaining annual blockers are exactly: `2024/TPEX`, `2025/TWSE`, `2025/TPEX`;
- both 2026 current-year market rows remain PENDING;
- all 15 accepted annual legs still carry explicit replay debt (`replayReadinessState=PARTIAL`) from symbol-session UNKNOWN / continuity / non-price readiness semantics;
- those replay debts are not raw-source missing-row failures and must not be relabeled as full replay readiness.

This readback confirms there is no hidden fourth annual market-year blocker. Exact physical critical path remains:
`2024/TPEX -> 2025/TWSE -> 2025/TPEX -> 2026 segmented TWSE/TPEX -> aggregate present-scope replay qualification`.

System1 Formal Core/runtime, strategy/ranking/final selection, capital/order, broker routing and production push authority remain unchanged.


## 2026-10-07 2025 official-source retention boundary revalidation

DATA_LANE performed a read-only live retention check against the canonical official historical A1 endpoints before any 2025 physical writer is authorized.

Observed boundary samples:
- TWSE 2025-01-02: official `MI_INDEX` historical JSON present; target-date marker + security-code + close-price + data-array markers PASS;
- TWSE 2025-12-31: same markers PASS;
- TPEx 2025-01-02: official `dailyQuotes` historical JSON present; target-date + code + close + data-array markers PASS;
- TPEx 2025-12-31: same markers PASS.

The retrieval transport for this diagnostic was Firecrawl, but source authority is the official TWSE/TPEx endpoint itself. No third-party payload is promoted as market truth.

Interpretation:
- 2025 annual ingestion is not merely repository-ready; both canonical official endpoints still expose historical payloads at the beginning/end of the target year;
- this is a source-retention/schema preflight only, not a full-year completeness or physical-acceptance claim;
- full acceptance still requires the canonical annual range fetch, immutable cold persistence, Physical Verify, artifact, and System1-isolation checks;
- TPEx legacy `不含定價` remains canonical-ineligible.

Durable evidence:
`system2/evidence/S2_HISTORICAL_2025_OFFICIAL_SOURCE_RETENTION_PREFLIGHT_20261007_V0_1.json`.

Physical execution order remains:
`2024/TPEX -> 2025/TWSE -> 2025/TPEX -> 2026 segmented -> aggregate replay qualification`.

No D1/R2 mutation, strategy/ranking/final-selection, System1 Formal/runtime, capital/order, broker routing or push authority change occurred.


## 2026-10-07 delisting effective-date exclusive-boundary hardening

DATA_LANE reconciled the latest D03 lifecycle-normalization contract with historical universe/coverage semantics.

Confirmed contract:
- listing/trading start date is inclusive;
- regulatory no-trading intervals are half-open `[stopDate,resumeDate)`;
- an official delisting effective date is an exclusive old-symbol membership boundary unless an official source explicitly says trading occurs on that date;
- observed-interval-only `effectiveTo` remains inclusive because it means last positively observed trading date, not a legal termination date.

Prior DATA runtime behavior used one generic inclusive test `effectiveTo >= marketDate`, so an `OFFICIAL_DELISTING_DATE` remained active on the delisting effective date itself. This could inflate the expected symbol-session denominator and manufacture one UNKNOWN gap per affected delisted symbol.

Repository hardening:
- add `historicalUniverseMembershipActiveOnDateV0_1`;
- keep stored official `delistingDate/effectiveTo` values unchanged, preserving registry source identity and immutable membership rows;
- interpret `endBasis=OFFICIAL_DELISTING_DATE` as exclusive at snapshot/coverage read time;
- preserve inclusive semantics for observed-interval-only `effectiveTo`;
- regression proves a symbol delisted on 2022-01-05 is absent from the 2022-01-05 replay snapshot and is not expected to have a price row on that date.

This is a denominator/lifecycle-semantics correction only. It does not synthesize OHLC, change source rows, alter cold R2 objects, or claim the broader regulatory-stop source blind spot is solved.

The larger lifecycle source gap remains:
- TWSE `TWTAWU` covers the official intraday/suspension class but does not cover all long-duration regulatory `停止買賣` cases;
- D03 research physically identified 2358/2443/8101/1701 and several TPEx cases as candidate official lifecycle explanations;
- canonical missingReasonCounts must not change for those intervals until DATA/BUILD materializes source-identified normalized lifecycle events and produces a before/after physical receipt.

System1 Formal Core/runtime, strategy/ranking/final selection, capital/order, broker routing and production push authority remain unchanged.


## 2026-10-07 TWSE regulatory lifecycle source materialization

DATA_LANE materialized the first official event-source union requested by the D03 Layer-B lifecycle normalization contract.

Official machine contracts pinned:
- announcement list: `https://www.twse.com.tw/rwd/zh/announcement/announcement` with `startDate/endDate/keyword/response=json`;
- announcement detail: `https://www.twse.com.tw/rwd/zh/announcement/announcement_detail?id=<announcementId>&response=json`;
- source authority is TWSE; browser/search transport used during discovery is not promoted as market authority.

Positive source witness:
- 2358/2443 official TWSE announcement id `05C3F55AF0ED11EEAA0D005056BE380E`;
- detail body states `併案停止買賣日期：民國113年4月8日`;
- the same list contract exposes later 2358/2443 delisting announcements;
- this confirms the prior TWTAWU-only verifier has an official event-class blind spot rather than raw A1 source loss.

Repository implementation:
- add `twse_regulatory_lifecycle_source_v0_1.mjs`;
- query only symbols still carrying `UNKNOWN_SYMBOL_SESSION_GAP` after the existing TWTAWU pass;
- announcement-list absence never certifies no event;
- only positive official list/detail evidence can create normalized lifecycle events;
- ordinary margin-financing suspensions / changed trading-method notices are not treated as no-price-bar events;
- stop/resume/delisting intervals use the D03 half-open convention `[stopDate,resumeOrDelistDate)`;
- historical announcement publication date is retained, but `sourceReportedAt` is not fabricated; Layer-C known-at remains explicitly unproven.

Physical verifier integration:
- compute baseline coverage first;
- target only baseline UNKNOWN symbols for official announcement lookup;
- union positive regulatory lifecycle intervals with existing TWTAWU intervals;
- recompute final coverage without changing cold OHLCV;
- emit lifecycle evidence with before/after UNKNOWN counts, before/after missingReasonCounts, event/interval samples, source receipts, partial-source counts and `reclassifiedUnknownBars`;
- verifier schema advances to `S2_HISTORICAL_MARKET_YEAR_PHYSICAL_VERIFICATION_V0_6`.

Initial deterministic regression cases include:
- 2358: stop 2024-04-08 -> delist 2024-11-19;
- 1701: share-conversion stop 2024-08-21 -> delist 2024-09-02;
- margin-financing-only suspension is ignored.

TPEx lifecycle-source expansion remains separate and unresolved; DATA_LANE has not inferred a TPEx source contract from TWSE semantics.

No D1/R2 mutation was required for this repository hardening. No System1 Formal Core/runtime, strategy/ranking/final-selection, capital/order, broker-routing or production-push authority changed.


## 2026-10-07 CORR-004 exact expected-session reconciliation implementation

DATA_LANE acknowledged and began `S2-CORR-20261007-004` (HIGH / DATA_LANE):
long-listed Daily Shadow history readiness could accept the latest 60 observed dates even when one required recent eligible session was missing and an older row silently substituted for it.

Implementation branch / PR:
- branch: `system2-data/corr004-exact-session-reconciliation-20261007`;
- PR: `#817`;
- status at this checkpoint: `FIX_IN_PROGRESS`;
- independent closure remains AUDIT_LANE-only after physical readback.

Implemented fail-closed semantics:
- derive each current symbol's exact required eligible prior-session set from official trading dates + official current listing date;
- exclude only positive certified lifecycle no-trading intervals; source absence never certifies no event;
- exact date-set equality is required for both long-listed and age-limited symbols;
- an older row cannot substitute for a missing expected recent session;
- per-symbol missing/unexpected counts, bounded samples, expected/observed session hashes and lifecycle-exclusion provenance are emitted;
- missing/unexpected exact sessions remain symbol-local INCOMPLETE; no whole-universe percentage veto is restored;
- history factor loading is bound to the expected session hash and fails closed on `EXPECTED_SESSION_HASH_MISMATCH`;
- TWSE lifecycle lookup is targeted only to full-count exact-session mismatches; TPEx source parity remains unresolved/fail-closed;
- immutable Daily Shadow diagnostics preserve lifecycle source receipts/intervals in `HISTORY_LIFECYCLE_EVIDENCE` shards.

Required regressions are implemented for:
- clean long-listed exact window;
- long-listed missing required recent session + older substitute;
- legitimate certified no-trading interval;
- new listing short legitimate window;
- missing expected-session contract;
- exact probe -> factor-load session hash binding;
- existing mixed-universe symbol-local readiness / partial denominator behavior.

Protected boundaries remain unchanged:
- no historical OHLC synthesis or rewrite;
- no continuity-state relabel to manufacture readiness;
- no System1 Formal Core/runtime;
- no strategy thresholds/weights/ranking changes;
- no final selection/live push/capital/order authority.

Physical acceptance is still pending. After merge, the existing `System2 Daily Shadow Input Preflight Readonly` workflow will be used to prove merged-main exact-session readback with `rowsWritten=0`; at least one real TWSE exact-window witness is required before DATA_LANE may mark CORR-004 `FIX_IMPLEMENTED`.


## 2026-10-07 CORR-004 merged-main physical readback

Merged implementation:
- PR `#817`;
- merge commit `625ea3d0bda28fcd06df4c3163a054573c3982f7`;
- Daily Shadow history reader now uses exact expected eligible symbol-session reconciliation and probe-to-load session-hash binding.

Merged-main physical evidence:
- workflow: `System2 Daily Shadow Input Preflight Readonly`;
- run: `37639310919`;
- job: `112853723927`;
- conclusion: `SUCCESS`;
- marketDate: `2026-10-07`;
- ordinary universe: `1,973`;
- exact-session reconciliation: `true`;
- history-ready: `46` versus pre-fix reference `51`;
- continuity-ready: `0`;
- D1 rows written: `0`;
- System1 production isolation: `PASS`.

Real witness:
- `1101 / TWSE` has only `SYMBOL_LOCAL_CONTINUITY_NOT_VERIFIED`;
- it does not carry `INSUFFICIENT_PIT_HISTORY` or an expected-session-missing blocker;
- therefore at least one real TWSE symbol passes the merged-main exact-window history gate while continuity remains correctly fail-closed.

Lifecycle behavior:
- 2 TWSE exact-session mismatch candidates were queried;
- lifecycle state remained `OBSERVED_POSITIVE_EVENTS_UNCERTIFIED_ABSENCE`;
- `lifecycleIntervalCount=0`;
- empty/uncertified lifecycle search did not certify absence and did not wash gaps into PASS.

Durable receipt:
`system2/evidence/S2_CORR_20261007_004_PHYSICAL_READBACK_V0_1.json`.

DATA_LANE disposition:
`S2-CORR-20261007-004 = FIX_IMPLEMENTED`.

Because severity is HIGH, DATA_LANE does not self-close. Independent AUDIT_LANE verification is still required before `VERIFIED_CLOSED`.

No System1 Formal Core/runtime, strategy thresholds/weights/ranking, historical OHLC, final selection, live push, capital or order authority changed.


## 2026-10-07 TPEx historical cmode structured-source contract

DATA_LANE pinned a date-scoped official TPEx structured source for the lifecycle blind spot not covered by `sprcHis`.

Structured machine contract:
- official dataset: 上櫃股票變更交易、分盤交易、管理股票與停止交易資訊;
- historical endpoint:
  `https://www.tpex.org.tw/web/stock/aftertrading/cmode/chtm_result.php?l=zh-tw&o=json&d=<ROC YYY/MM/DD>`;
- response rows are carried by `aaData`;
- historical date parameter `d` uses ROC `YYY/MM/DD`;
- relevant fixed row position is the `停止交易` field;
- current TPEx OpenAPI lineage exposes the corresponding `/tpex_cmode` dataset.

Historical endpoint behavior is supported by a public reproducibility witness that queried this official endpoint across archived dates after 2018 and compared returned `aaData` rows against stored daily files. This establishes the historical date-scoped contract for repository implementation, but merged-main physical source acceptance is still required.

Repository implementation on branch `system2-data/tpex-cmode-history-source-20261007`:
- `tpexCmodeRocDateV0_1` converts ISO dates to the official ROC request date;
- `parseTpexCmodePositiveStopSessionsV0_1` accepts only source-date-identified responses;
- only an explicit whitelisted positive `停止交易` marker (or text carrying positive stop semantics) produces a one-session lifecycle interval; unknown/non-recognized markers remain unclassified;
- each accepted row has an independent canonical SHA-256 row hash plus the enclosing payload hash;
- source absence / empty markers never certify NO_EVENT;
- coverage now emits unique `unknownSessionDates`, allowing targeted source lookup instead of scanning the whole calendar.

Physical verifier v0.7 integration:
1. run existing TPEx `sprcHis` positive interval pass;
2. compute baseline market-year coverage;
3. query cmode only for dates still containing `UNKNOWN_SYMBOL_SESSION_GAP`;
4. union only positive cmode stop-session evidence;
5. recompute coverage and emit before/after UNKNOWN counts plus bounded per-date source receipts.

Transport/schema/date-identity failures remain PARTIAL and contribute no lifecycle interval. Cold OHLCV is never synthesized or rewritten.

Known official positive witnesses remain consistent with this source class:
- 4806 / 2023 regulatory stop interval candidate `[2023-04-10,2023-10-12)`;
- 3089 / 2021 regulatory stop interval candidate `[2021-01-20,2021-07-20)`.

These cases are not yet canonical reclassifications from this branch alone. First live acceptance is expected from the next TPEX Physical Verify on merged main; the already-required fresh `2024/TPEX` annual run after D1 quota reset can exercise the source without adding a separate D1 writer.

No System1 Formal Core/runtime, strategy/ranking/final-selection, capital/order, broker-routing or production-push authority changed.


## 2026-10-08 05:54 DATA_LANE Stage-1 launch-critical parallel override — TWSE bounded continuity evidence

Observed main before write:
`41289fa941413887c04fa33456e5386bd79dc645`.

This block does **not** cancel the durable annual historical critical path:
`2024/TPEX -> 2025/TWSE -> 2025/TPEX -> 2026 segmented -> aggregate replay qualification`.

It adds a higher marginal-impact Stage-1 launch task that is read-only/artifact-only and may proceed in parallel whenever it does not contend with an active D1/R2 writer.

### Launch-critical DATA objective

Produce the first real source-honest TWSE continuity evidence package that can support NC-T01:

1. derive the exact query interval from the real NC-T01 replay/prefetch window;
2. prove bounded TWSE suspension completeness for that exact interval;
3. combine with the three existing TWSE exact-range corporate-action families;
4. emit a real hash-bound `CLEAR_NO_ACTION` receipt if and only if all evidence is complete;
5. otherwise preserve `CONTINUITY_UNKNOWN`.

Canonical contracts:
- `system2/evidence/S2_STAGE1_NCT01_TWSE_SUSPENSION_NEGATIVE_COMPLETENESS_HANDOFF_20261007_V0_1.json`;
- `system2/evidence/S2_STAGE1_TWTAWU_BOUNDED_JSON_CSV_PARITY_HANDOFF_20261008_V0_2.json`.

### Frozen TWTAWU positive control

Prior physical run:
- workflow: `System2 S2-07 Symbol Session Integration V0.8 Readonly`;
- run: `37488505236`;
- job: `112354734503`;
- official bounded TWTAWU all-listed population: 383 rows;
- sourceArtifactHash:
  `10a78954777b94f838ad4996bad02891ef1e97597f684434b4c7b36d5a659857`.

Real positive row:
- symbol: `1218`;
- suspendedFrom: `2026-08-13`;
- resumedOn: `2026-08-14`;
- sourceRowHash:
  `40fbafe3fac0f7bafc60f08ca7cb873da716cdce846decfadcd5122ff8197927`.

This is a physical official-source row, not a synthetic fixture.

### Exact DATA_LANE continuation for this launch gate

1. Capture the **actual official TWSE export request contract** used by the TWTAWU page for CSV/HTML export; do not guess the URL.
2. First run bounded all-listed JSON-vs-official-export parity on an interval containing the real 1218 positive row.
3. Require:
   - identical requested interval/scope;
   - accepted source-specific status/schema;
   - normalized row-set parity or deterministic representation equivalence;
   - no pagination/truncation ambiguity;
   - immutable raw hashes for both representations;
   - reproduction of the real 1218 row identity.
4. Freeze the successful export/query contract **before** applying it to the actual NC-T01 witness.
5. Use the exact replay-window start/end from the real prefetch/replay evidence; do not substitute a generic 60-day or annual window.
6. If the bounded certified query has no overlapping suspension for the witness, classify:
   `NO_SUSPENSION_IN_COMPLETE_BOUNDED_WINDOW`.
   Otherwise preserve the positive event or UNKNOWN state.
7. Combine the bounded suspension receipt with:
   - TWSE TWT49U ex-right/dividend actual-result range;
   - TWSE TWTAUU capital-reduction actual/reference range;
   - TWSE TWTB8U par-value-change actual/reference range.
8. Only when the corporate-action completeness receipt is complete may
   `buildNct01TwseClearNoActionPromotionReceiptV0_1`
   emit the first real `CLEAR_NO_ACTION` receipt.
9. Bind all official response hashes / parity receipt / exact replay identity into immutable sourceEvidenceRefs.
10. No D1 mutation is required for this NC-T01 evidence task.

### Fail-closed boundaries

- page text saying CSV exists is not a machine completeness proof;
- HTTP 200 or empty JSON/CSV alone is not enough;
- uncertified export contract -> UNKNOWN;
- representation mismatch -> UNKNOWN;
- pagination/truncation/scope ambiguity -> UNKNOWN;
- positive-only announcement absence is not no-event evidence;
- do not backdate a later observation into the original decision clock;
- no strategy/ranking/final-selection/push/capital/order mutation;
- System1 Formal Core/runtime untouched.

Priority rule:
this read-only NC-T01 continuity evidence task is Stage-1 launch-critical and should be advanced ahead of nonblocking broad-history expansion when safe; annual history writer work remains preserved and resumes according to writer/quota governance.


## 2026-10-08 06:03 CORR-007 cross-lane guard — DATA may prove suspension completeness but final CLEAR_NO_ACTION waits for provenance binding

Observed main before write:
`b5286bbc0b6d54bc37901a59d4a8437f8f1559fd`.

New correction:
`S2-CORR-20261008-007` — HIGH / BUILD_LANE.

DATA_LANE ownership does not change:
- capture the real TWTAWU export request contract;
- prove positive JSON/export parity using the real 1218 witness;
- freeze bounded completeness semantics;
- apply to the exact replay window;
- produce immutable raw/parity/bounded-suspension evidence;
- continue the three TWSE corporate-action historical range families.

New guard:
until CORR-007 is merged and independently verified, DATA_LANE must **not** treat
`suspensionCoverageByExchange.TWSE=COMPLETE`
alone as sufficient for final `CLEAR_NO_ACTION` promotion.

The DATA artifact should expose enough immutable identity for BUILD to bind:
- exact interval;
- sourceId / source family/version;
- bounded suspension/parity receiptId;
- 64-hex receipt/artifact digest;
- raw official response hashes;
- observedAt;
- availability semantics / availableAt when applicable;
- completeness state;
- normalized event/interval classification.

After CORR-007, the final promotion path must require that exact suspension evidence identity in both:
1. the corporate-action completeness receipt hash; and
2. a matching continuity `sourceEvidenceRef`.

If DATA finishes parity before BUILD finishes CORR-007, preserve the result as:
`SUSPENSION_BOUNDED_COMPLETENESS_EVIDENCE_READY / FINAL_CLEAR_NO_ACTION_PROMOTION_BLOCKED_CORR007`.

No D1 mutation is required for this read-only evidence task.


## 2026-10-08 06:22 DATA/BUILD interface refinement for CORR-007

DATA_LANE source work remains independent of the BUILD correction, but its real bounded suspension receipt must expose the immutable identity BUILD now requires.

Canonical interface:
`system2/evidence/S2_CORR_007_SUSPENSION_PROVENANCE_BINDING_HANDOFF_20261008_V0_1.json`.

For the eventual exact replay-window TWSE suspension receipt, preserve:
- exact startDate/endDate;
- stable sourceId and source family/version;
- immutable bounded/parity receipt digest;
- underlying official response/artifact hashes;
- observedAt;
- availability semantics and availableAt where applicable;
- COMPLETE only after the frozen positive-control parity + exact-window completeness contract passes.

Do not infer no suspension from empty rows alone.
Do not guess the official export URL.
Do not hard-code the witness.
No D1 mutation is required for this evidence task.


## 2026-10-08 2024 TPEx annual physical acceptance — Run #31

Fresh latest-main annual run:
- workflow: `System2 Historical Pack Annual Backfill`;
- run number: `#31`;
- run id: `37714783081`;
- job id: `113108678259`;
- head: `2efda20852d4083a4d57faab3643455f9f166dde`;
- conclusion: `SUCCESS`;
- inputs: `2024 / TPEX`.

Resume behavior:
- read-only annual resume preflight PASS;
- prior durable partial state: 500 manifests / 119720 bars;
- expected complete state: 844 packs / 198856 bars;
- no duplicate logical manifest keys;
- no R2 HEAD failures;
- preflight D1 rowsWritten = 0;
- state `PARTIAL_RESUME_CANDIDATE`, resume authorized.

Annual backfill:
- `YEAR_BACKFILL_COMPLETE`;
- 242 official trading dates;
- 198856 official rows;
- 844 packs / 844 symbols;
- 344 new R2 objects + 500 immutable identical objects;
- 344 new manifests + 500 immutable identical manifests;
- D1 rowsWritten = 2482.

Physical storage/source verification:
- completion receipt `S2HCR-67fa033b62de1ed7fcf7984d0238184461cbbc40a8d5ad579e172a4852dfaf11` COMPLETE;
- manifest rolling hash matches the receipt;
- checkpoint COMPLETE;
- R2 HEAD verified `844/844`;
- R2 byte-GET verified `844/844`;
- cold rows = fresh official rows = `198856`;
- missing-from-cold = 0;
- absent-from-fresh = 0;
- source-row-hash mismatch = 0;
- canonical A1 value mismatch = 0;
- source revision-only = 0;
- source version = `STABLE`.

Coverage:
- membership-session denominator = `199209`;
- actual bars = `198856`;
- missing = `353`;
- UNKNOWN = `353`;
- unexpected bars = `0`;
- data coverage = `PASS`;
- replay readiness = `PARTIAL`;
- universe readiness = `PARTIAL_OBSERVED_INTERVAL_NO_OFFICIAL_DELISTING_UNION`;
- official TPEx delisting union remains incomplete.

TPEx halt/lifecycle evidence:
- `sprcHis` positive interval state = `OBSERVED_POSITIVE_INTERVALS_UNCERTIFIED_HISTORY`, 19 intervals;
- cmode supplement state = `PARTIAL_POSITIVE_SESSION_EVIDENCE`;
- cmode queried 242 dates, but every date remained source-date-identity uncertified because the HTTP-200 payloads did not expose a response-level `reportDate`;
- cmode reclassified UNKNOWN bars = `0`;
- before/after UNKNOWN = `353 -> 353`;
- therefore no unresolved gap was opportunistically relabeled.

Artifact:
- id `11524379580`;
- digest `sha256:7f28194f94130db89b2f9d28677d3570ef3a7e921a6e3d307fb71ec31547f2b1`;
- durable repository evidence:
  `system2/evidence/S2_HISTORICAL_TPEX_2024_PHYSICAL_VERIFICATION_V0_1.json`.

System1 production isolation PASS.

DATA_LANE disposition:
`2024/TPEX = DATA_COVERAGE_ACCEPTED_REPLAY_READINESS_PARTIAL`.

Aggregate annual status for completed calendar years 2017-2025:
- expected annual market-year legs: 18;
- accepted: 16;
- remaining annual blockers: exactly `2025/TWSE` and `2025/TPEX`.

Exact annual continuation:
`2025/TWSE -> 2025/TPEX -> 2026 segmented -> aggregate replay qualification`.

The separate TPEx cmode date-identity defect remains a lifecycle-source refinement issue; it does not invalidate the accepted 2024/TPEX raw/cold physical coverage.

No System1 Formal Core/runtime, strategy/ranking/final-selection, capital/order, broker-routing or production-push authority changed.


## 2026-10-08 2025 TWSE physical acceptance — Run #32

- Workflow run #32 / ID 37720726697 concluded SUCCESS at 2026-10-08 11:49:34 Asia/Taipei; job 113127496102.
- Annual 243 official sessions, 254854 official rows, 1070 packs/symbols; storage receipt S2HCR-4b01e356aae94e5b1be6c40732602c342bc3ba9c43c1851b1cf6778d3063a29d COMPLETE.
- R2 HEAD and byte-GET: 1070/1070 PASS; D1 manifests/checkpoint COMPLETE; cold/fresh official row parity 254854/254854, source-row hash and canonical A1 mismatches 0.
- Membership-session 255068; 214 gaps = 138 official suspension classified + 76 UNKNOWN retained; no unexpected bars. Data coverage PASS / replay readiness PARTIAL; PIT conservative session finality PASS; continuity remains PARTIAL_UNVERIFIED.
- Historical universe official current/newlisting/delisting union PASS. System1 production isolation PASS.
- Artifact: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37720726697/artifacts/11527595746 ; digest `sha256:41ab589d5f38e667f8fb61427d2053d38d9f62d23e044d22a8c7e0f441cd56df`.
- Durable evidence: `system2/evidence/S2_HISTORICAL_TWSE_2025_PHYSICAL_VERIFICATION_V0_1.json`.
- 2017–2025 annual legs accepted 17/18; sole remaining annual market-year: 2025 TPEX. Next: 2025/TPEX annual physical backfill, subject to D1 quota / single-writer safeguards; then 2026 segmented and aggregate replay qualification.
- No System1 Formal/runtime or strategy/ranking/final-selection/capital/order/push authority changed.


## 2026-10-08 2025 TPEx physical acceptance — Run #33

- Workflow run #33 / ID 37730512780 concluded SUCCESS at 2026-10-08 13:55:54 Asia/Taipei, job 113158337294; official requested 2025/TPEX.
- Annual official 243 sessions, 206790 rows, 879 packs/symbols; storage receipt S2HCR-2403bb779359941d16a00352f60981c6b182429411eecf1e4f8b40207fc39d5d COMPLETE.
- R2 HEAD and byte-GET 879/879 PASS; D1 manifests/checkpoint COMPLETE; cold/fresh official source 206790/206790; source row hashes and canonical A1 mismatches zero.
- Membership/session denominator 207067; gaps 277 = 7 official suspension + 270 UNKNOWN preserved, unexpected 0. Data coverage PASS / replay readiness PARTIAL; PIT conservative session finality PASS; continuity PARTIAL_UNVERIFIED; official TPEx delisting union still incomplete.
- System1 isolation PASS. Artifact: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37730512780/artifacts/11531765477; digest `sha256:ca403a31bd6c6e9f577027f0c1d50681c42956bd17a33407643e40372b753a12`. Durable evidence `system2/evidence/S2_HISTORICAL_TPEX_2025_PHYSICAL_VERIFICATION_V0_1.json`.
- Aggregate 2017–2025 raw historical annual market-year coverage accepted: 18/18. This does NOT imply complete continuity, no UNKNOWN, complete historical-universe replay, or Stage-1 launch authorization.
- Exact subsequent DATA_LANE work: 2026 segmented history (no annual current-year dispatch), aggregate replay qualification, and launch-critical hot-history/NC-T01 continuity evidence. Preserve single D1 writer and D1 quota safeguards.
- No System1 Formal/runtime, strategies, final selection, capital/order or live push authority changed.


## 2026-10-08 2026 TWSE segmented backfill #1 — fail-closed source diagnostic and recovery candidate

Canonical execution:
- workflow `System2 Historical Current-Year Segmented Backfill`, Run #1 / ID `37740634959`, head `f2f60fe1c3c8719d115593045af13295b6d6d51b`;
- completed 2026-10-08 17:52:57 Asia/Taipei with conclusion `FAILURE`;
- isolated System2 D1 additive schema migration PASS;
- backfill step FAIL after about 2h54m, exact error `official historical daily table not found for TWSE` from `official_historical_a1_source_v0_1.mjs:283`;
- upload step was completed but found no diagnostic JSON, therefore no artifact was retained;
- System1 production isolation PASS.

**No successful 2026 TWSE month-count claim is justified by this workflow log.** Prior completed month receipts, if any, are not disproven by the workflow failure, but need independent D1 read-only inventory; do not imply zero months or all nine months complete.

Root-cause status: `OFFICIAL_SOURCE_DAILY_TABLE_UNRECOGNIZED / EXACT_DATE_UNKNOWN`. The original run printed neither the failing date/month nor source `stat`/table envelope. Possible calendar overinclusion, official schema/status response, or transient source availability must remain hypotheses pending physical readback.

DATA_LANE isolated remediation on `system2-data/2026-segment-fail-closed-recovery-20261008`:
- use TWSE official FMTQIK **exact requested-month trading dates**, including for TPEx's shared exchange-session calendar; deny uncertified date lists;
- bind that exact date list into historical A1 fetch, preserving strict source-date and OHLC identity checks;
- pace day requests, log completed dates/months and read-only source request identity;
- on failure write `BLOCKED_FAIL_CLOSED_SEGMENT_BACKFILL` with failed stage, month, last requested official date, source status/table envelope and any previously completed monthly receipts; upload via existing `always()` evidence step;
- preserve existing receipt-aware skipping and immutable manifest/R2 byte verification; do not relax parser/zero-fill/synthesize missing data.

Immutable diagnosis:
`system2/evidence/S2_2026_TWSE_SEGMENT_RUN1_FAILURE_DIAGNOSTIC_20261008_V0_1.json`.

Acceptance to proceed: review CI + V8 regression, merge candidate, verify exact official monthly FMTQIK preflight; controlled retry only after checking the single D1 writer and durable prior receipts. If source/date failure recurs, extract exact date and source envelope from artifact and classify before modifying any semantics. 2025 historical annual raw coverage remains `18/18 PASS_DATA_PARTIAL_REPLAY`; 2026 segmentation and aggregate replay NOT ACCEPTED.

Protected boundaries: System1 Formal/runtime, strategies, signal semantics, ranking, capital, order, broker routing, production push untouched.


## 2026-10-08 2026 TWSE Run #1 recovery: D1 read-only six-month inventory and unscheduled closure witness

Read-only GitHub Action `System2 Historical Inventory Readonly` run #2 / `37766622566` succeeded, artifact #11544273832 (SHA-256 `dcaf789a94d73d56b46716c54c5b95bd1148c173dc5071228494dbc6c2758b87`), D1 `rowsWritten=0`, System1 runtime unused.

**Verified from actual isolated D1 (not an inference from workflow green/red):** 2026 TWSE January through June each has a COMPLETE receipt, COMPLETE checkpoint and manifest counts/bar counts/rolling hashes matching its receipt. January 22,419 rows / 1,071 packs; February 12,861 / 1,072; March 23,586 / 1,075; April 21,490 / 1,078; May 21,577 / 1,082; June 22,717 / 1,083. July–September have no complete D1 month receipts. Read-only D1 control-plane proof is **not** independent R2 byte-GET or official-source reconciliation; no complete 2026 segmented acceptance claim yet.

Independent event witness: CNA reported TWSE and TPEx closed on **2026-07-10** due to Typhoon Bavi (published 2026-07-09 20:32 Asia/Taipei, `https://www.cna.com.tw/news/afe/202607090360.aspx`); TWSE-hosted ETF disclosure also identifies 2026-07-10 as a typhoon-induced non-business day. Since #1 reached the July range and its old holiday-only calendar can include emergency closures, this is a **high-confidence candidate root cause** for `official historical daily table not found for TWSE`. The original run did not record the failing date, so causal identity remains unproven until live exact-calendar validation.

Recovery is on main (`7498c206786be8fad05f42388be2bd720a1e5fed`): exact FMTQIK official monthly sessions, per-day logs, durable failed-date/status evidence, paced requests, prior-receipt resume. Next safe execution: one controlled 2026 TWSE segmented workflow_dispatch on latest main, only with no competing D1 writer; confirm six prior monthly receipts remain immutable, verify new July–September R2 physical evidence and System1 isolation, then record completed run artifact. Do not dispatch TPEx concurrently.

Durable evidence: `system2/evidence/S2_2026_TWSE_SEGMENT_RUN1_D1_MONTHLY_INVENTORY_20261008_V0_1.json`. No System1 Formal/runtime, strategy, ranking, capital/order or production push changes.


## 2026-10-08 DATA_LANE PIT clock integrity follow-up before 2026 segment rerun

Independent read-only inventory from GitHub Run `37766622566` found six TWSE 2026 January–June COMPLETE receipts all bearing the identical `completed_at=2026-10-08T06:59:08.074Z` (the initial workflow timestamp), despite six months being sequentially ingested and the full failed job lasting about three hours. Source inspection confirms the original current-year segment script reused one batch-start `capturedAt` as **every** official daily `observedAt`, pack capture time and month receipt completion time. This is a PIT/provenance clock-integrity problem: later observed facts cannot be asserted available at the start of an extended job.

DATA_LANE fix candidate `system2-data/2026-segment-observedat-pit-clock-fix-20261008`:
- add opt-in `observedAtFactory` to historical daily range ingestion, invoked after each successful official payload arrives (existing callers retain their explicit frozen observation time when no factory is supplied);
- issue fresh per-day observedAt and per-month pack/persistence capturedAt during segmented ingestion;
- mint durable `completed_at` only after R2 objects/manifests are persisted, just before the segment receipt is committed;
- add behavioral regression tests for post-fetch clock semantics and non-backdated receipt completion timestamps.

This change has **no retrospective write**: January–June immutable receipts remain exactly as originally recorded. Treat their old observed/completion clock provenance as `PRE_FIX_PROVENANCE_REQUIRES_INDEPENDENT_AUDIT`; D1 manifest/receipt count parity does not certify historically accurate observation clocks, R2 physical bytes, or aggregate replay readiness. July–September must use the fixed clocks on the next controlled retry and undergo source/physical checks.

Evidence: `system2/evidence/S2_2026_SEGMENT_OBSERVATION_CLOCK_FIX_HANDOFF_20261008_V0_1.json`.

No System1 Formal Core/runtime, strategies, ranking, final selection, capital, orders, or production push changed.


## 2026-10-08 19:23 Asia/Taipei — TWSE current-year segmented Run #2 D1 daily quota stop; zero-write preflight correction

Run: [37769681911](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37769681911), started 2026-10-08 19:23:08 Asia/Taipei, terminal FAILURE at 19:23:20, head `f839e8ee961b85f3ec6af939455d6a023e759c0f`.
- `migrate` job failed before `backfill` could start; `backfill` SKIPPED.
- Exact Cloudflare D1 HTTP 400: **Your account has exceeded D1's free tier daily row write limit**. The exhausted operation occurred inside `system2/deploy/provision_system2_d1.mjs` at line 111, while the segmented workflow unnecessarily repeated complete schema provisioning and write/read sentinels per dispatch.
- This run created **no new 2026 segment backfill acceptance**. Previously confirmed 2026/TWSE January–June D1 complete receipts from read-only inventory run `37766622566` remain the latest verified control-plane baseline; July–September still require physical completion.
- D1 free-tier reset named by provider: **midnight UTC / 2026-10-09 08:00 Asia/Taipei**. Do **not** upgrade billing without owner approval and do not blindly dispatch more write-heavy workflows before reset.
- Controlled DATA_LANE fix `system2-data/2026-segments-zero-write-preflight-20261008`: remove repeated D1 migration/provisioning from current-year backfill dispatch, replace with **zero-write read-only verification** of existing isolated `system2-research` schema version 1.1 and required segmented tables/columns. Fail closed when a table/column/version is missing; independent authorized migration remains separate. New dedicated unit and guard tests protect this boundary.
- Canonical failure evidence: `system2/evidence/S2_2026_TWSE_SEGMENT_RUN2_D1_QUOTA_PREFLIGHT_RECOVERY_20261008_V0_1.json`.
- Acceptance gates: PR CI PASS + V8 regression PASS, merge and read back latest main; only after D1 quota reset and single-writer/no-collision confirmation execute one controlled 2026 TWSE segmented rerun; validate old receipts are reused without modification and July–September R2 byte-GET/official date identity/evidence are PASS.
- System1 Formal Core, V8 production runtime, orders, capital, push, signals and source-integrity semantics remain untouched.



## 2026-10-08 19:41 Asia/Taipei — January–June 2026 TWSE independent D1/R2 physical byte proof PASS

- Canonical readonly physical Action: [Run #37771226567](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37771226567), job `113291014214`, head `e6a1feec8e9185c583b17aefcdbff9d3d094dd49`; workflow concluded SUCCESS on 2026-10-08 19:40:59 Asia/Taipei.
- Existing six D1 COMPLETE receipts (Jan–Jun 2026 TWSE), their checkpoints, manifests and manifest rolling hashes independently match after R2 HEAD + complete byte GET.
- Monthly packs / bars: Jan `1,071 / 22,419`; Feb `1,072 / 12,861`; Mar `1,075 / 23,586`; Apr `1,078 / 21,490`; May `1,082 / 21,577`; Jun `1,083 / 22,717`.
- Aggregate `6,461/6,461` R2 HEAD and `6,461/6,461` independent byte SHA-256 PASS; `124,650` cold bars checked against frozen physical storage receipts.
- Isolated D1 this audit: rowsRead `38,778`, rowsWritten `0`; R2 PUT `0`. System1 production isolation PASS. No price/history rewritten.
- Artifact `11547382438` digest `sha256:84800b204b198757cd1f316579e10201a15e3cd512150b5efd5dd28bfdb55b40`.
- Durable evidence: `system2/evidence/S2_2026_TWSE_JAN_JUN_INDEPENDENT_R2_BYTE_VERIFICATION_20261008_V0_1.json`.
- Scope warning: this independent physical audit does **not** reconfirm freshly served official daily price rows, prove original `observedAt` or `completed_at` accuracy (Jan–Jun pre-fix timestamps remain flagged), certify corporate-action continuity, prove recent 60-session Stage-1 history, or unlock aggregate strategy replay.
- July–September 2026 TWSE still need receipt creation/physical verification when D1 budget allows; 2017–2025 annual historical 18/18 raw coverage already accepted. 2026 TPEx segmented separately pending. D1 budget ownership stays in REMEDIATION_LANE; no duplicated account-level quota gate here.

Protected boundaries: V8/System1 Formal Core, formal runtime, strategy/selection/push/capital/order unchanged.


## 2026-10-08 DATA_LANE CORR-20261007-001 A1 Decision Clock / Stage-1 source-selection convergence

Problem: prospective Decision Clock collector used latest OpenAPI only; earlier physical clock run 37577209442 observed 30/30 NOT_READY for A1, while Stage-1 Daily Shadow run 37609474459 later proved canonical exact-date 2026-10-07 TWSE (1086 ordinary rows) and TPEx (887 ordinary rows) READY. The differing collection time remains important: prior NOT_READY is not retroactively changed.

Code candidate branch system2-data/corr-20261007-001-a1-collector-exact-date-20261008 reuses existing Stage-1 resolveMarketPayload selector in official_source_probes and the existing canonical exact-date date/row/OHLC parser. If latest OpenAPI is stale, non-JSON or transport-failed, clock collector may observe verified exact-date TWSE MI_INDEX or TPEx dailyQuotes; obsolete legacy TPEx source stays ineligible. The clock receipt stores both source identities, URL, primary/fallback failures and exact source date. ObservedAt/firstReady upper bound is generated AFTER selected response, never taken from retrospective SESSION_CLOSE_FINALITY.

IMPORTANT FROZEN EPOCH: the original 13-file contracts/decision_clock_collector_freeze_v0_1.json remains bit-for-bit unchanged. A separate 15-file collector V0.4 contract and freeze_v0_2.json bind shared Stage-1 selector, canonical daily date parser and clock bundle implementation, with evidenceEpoch S2_CLOCK_A1_STAGE1_EXACT_DATE_ALIGNMENT_EPOCH_V0_4. Existing old prospective receipts cannot be altered or pooled with the V0.4 sample; next allowed evidence date must be a future independently confirmed official trading day AFTER merge.

Evidence: system2/evidence/S2_CORR_20261007_001_A1_SHARED_SOURCE_SELECTION_V0_4_IMPLEMENTATION_20261008_V0_1.json
Contract: system2/SYSTEM2_DECISION_CLOCK_A1_SHARED_SOURCE_SELECTION_V0_4.md

Status at implementation handoff: CODE_CANDIDATE_PENDING_CI_AND_V8, not physical fallback acceptance. Required: CI, V8, merge/readback, subsequent real-date source-selection evidence, independent correction closure. Historical 2026 TWSE Jan-Jun independent R2 physical bytes and 2017-2025 18/18 data coverage remain accepted separately; continuity / exact PIT / final selection unchanged.

Protected: System1 Formal/runtime, System2 strategy, ranking, live push, orders, capital and trade authority untouched.

## 2026-10-09 06:40 Asia/Taipei — 2026-10-08 recent60 PIT-vs-hot-D1 physical diagnostic

GitHub merged DATA_LANE PR #898 (`39145babc3f29b3e0afb33ac629d224d46428978`) created per-symbol source-honest exact-session gap taxonomy. The first post-merge read-only run 37854347400 executed at 06:35 before the **2026-10-09** trading session, observed zero current-day A1 symbols and therefore did not legitimately produce a 2026-10-09 market coverage distribution. Do not reinterpret that as missing 1972 stocks.

DATA_LANE PR #915 (`d19c65e0e30dd9d75005030b20d6b20edc35e61a`) added separate bounded **retrospective** hot-D1 vs PIT-eligible row readback. Main Action Run [37854849181](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37854849181), job 113576451531, SUCCESS and immutable artifact 11583895434 (`sha256:36c24b4b8b908afaa27247791fae7d478a584d953cebaf60066137bf08b81242`). Merged-main System2 CI, V8 regression and physical readback PASS.

Observed for **completed 2026-10-08 market date**, fetched at 2026-10-09 ~06:40 Asia/Taipei (NOT a prospective 2026-10-08 decision-time receipt):
- current ordinary symbols: 1,972;
- exact eligible prior-session history READY: 46;
- independently continuity-ready: 0;
- mutually exclusive primary gap classes: `EXPECTED_PIT_SESSION_MISSING=1926`, `CONTINUITY_PROOF_MISSING=46`; all other first-cause categories 0;
- bounded hot-D1 physical crosscheck: 96 sampled exact market-symbol-prior-date identities, **96/96 `HOT_D1_ROW_ABSENT`**, zero sampled present-row PIT exclusions;
- D1 rowsRead 489,866, rowsWritten **0**. No R2 write or production change.

**Evidence limit:** absence is established only for these 96 **hot D1** market-symbol-date rows; cold R2 archives or exchange originals may still hold data. These samples do not identify full-universe per-date physical absences, nor certify PIT knowledge on 2026-10-08. Old 2026 Jan–Jun cold R2 byte PASS remains a separate storage fact, not hot recent60 readiness.

**Next DATA_LANE action:** bounded read-only hot D1 versus cold R2 pack/sample reconciliation; before any persistent warmup, obtain REMEDIATION_LANE account-level D1 write-budget/priority gate, preserve old PIT/frozen metadata, then rerun exact-session and continuity checks. For the 46 history-ready symbols, NC-T01 cannot move without independent exact-window complete corporate-action and lifecycle evidence. Historical corporate-action NO_EVENT must NOT be inferred from no rows.

Durable evidence: `system2/evidence/S2_RECENT60_20261008_HOT_D1_VS_PIT_PHYSICAL_SAMPLE_V0_1.json`.

Protected boundaries unchanged: System1 Formal Core/runtime, System2 selection/ranking, capital, orders, production push and strategy performance all untouched.

## 2026-10-09 06:45 Asia/Taipei — Full immutable Action artifact readback clarifies 60-session hot gap coverage

After PR #915/#916, independently opened immutable GitHub Action artifact `11583895434` from run `37854849181` (digest `sha256:36c24b4b8b908afaa27247791fae7d478a584d953cebaf60066137bf08b81242`). This is a **retrospective 2026-10-08 market-date investigation** run 2026-10-09, not a replay-time/prospective availability receipt.

Complete exact-session *PIT-eligible* gap taxonomy:
- TWSE: current 1,086; 22 history-ready; 1,064 expected-session-missing symbols; **24,431 missing expected PIT symbol-sessions**.
- TPEx: current 886; 24 history-ready; 862 expected-session-missing symbols; **19,825 missing expected PIT symbol-sessions**.
- Combined: 1,972 current symbols, 46 history-ready, **0 independently continuity-ready**, 1,926 symbol-first-blocker PIT-session missing; **44,256 missing expected PIT symbol-sessions**.
- **1,451 symbols had unexpected selected PIT dates**: strong old-date-substitution diagnostic; do not count 60 arbitrary historical bars as exact last-60-session readiness. These categories overlap with expected-date missing and must not be added as separate missing-symbol totals.
- Other taxonomy: 13 listing-age-limited, 0 ambiguous-revision symbols under this observation; required prior-session window 60.

Sampled physical hot D1 identity readback: worst exact-session missing symbols, six per market (`TWSE:1563,6949,2321,3356,3591,6550` and `TPEX:3710,4747,6129,8059,8277,6461`). The 8 examined dates per symbol were **2026-07-14, 07-15, 07-16, 07-17, 07-20, 07-21, 07-22, 07-23**, hence **96/96 hot D1 RAW source identities absent** (not randomly sampled). This does **not** prove cold R2 / official source absence or PIT first-known on the examined prior date. The readback consumed 489,866 D1 reads and **0 writes**.

Durable detailed proof: `system2/evidence/S2_RECENT60_20261008_FULL_GAP_ARTIFACT_READBACK_20261009_V0_1.json`. Source raw GitHub artifact remains separate and immutable.

Priorities: (1) inspect 2026 early-July month cold R2 receipts and hot D1 ingestion coverage before costly writes, (2) preserve expected-versus-observed exact date-set hashes (avoid older-row substitution), (3) involve REMEDIATION_LANE for account D1 write budget (no unapproved overlapping writers), (4) pursue real exact-window corporate-action/lifecycle completeness for 46 history-ready symbols (NC-T01 still blocked).

## 2026-10-09 07:23 Asia/Taipei — Recent60 July 2026 source-only physical A1 proof 4/4, D1 READ quota blocking 96/96 cross-layer comparison

DATA_LANE PR #919 merged main `2a772080d329f9259d864e97d1eb0a1b94d8d065`: bounded frozen twelve-symbol × eight-date hot D1 / July cold R2 / official A1 read-only reconciliation with unit and V8 regression PASS. Merged-main physical Run [`37858652385`](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37858652385), job `113588851058`, exited FAIL-CLOSED before reading any of the 96 identities because Cloudflare D1 returned **daily row READ quota exceeded** (HTTP 400), not a source or data-integrity failure. Blocked artifact `11584838697`, sha256 `99c52c6b57e478306d66220ef3502729f8fa75ade16bf50b4f13d0f9d442fb2a`. Zero D1 writes; no new hot/cold/R2 absence claim. This is distinct from the earlier D1 row-WRITE quota exhaustion. REMEDIATION_LANE continues to own account quota and competing writers; no automatic paid upgrade.

With D1 reads unavailable, DATA_LANE PR #920 merged main `2f03b5007af3c823e7176c07d246ba43d2804f3e`. Its separate **zero-Cloudflare-call** official A1 read-only workflow Run [`37859091830`](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37859091830), job `113590286029`, PASS, artifact `11585735521`, digest `sha256:22444513308e60383bf9a42a3e9c89da4556a8086496bdc8ad78fb8200f83716`.

Real physical official canonical exact-date July observations (post-facto **2026-10-09 07:22:58** Taipei, NOT July firstKnownAt): TWSE `2026-07-14` **6/6** frozen sample symbols, TWSE `2026-07-23` **6/6**, TPEx `2026-07-14` **6/6**, TPEx `2026-07-23` **6/6**. Total 4/4 official market-date GET results and 24/24 frozen sampled market-symbol-date appearances; D1 reads/writes 0, R2 reads/writes 0, System1 isolation PASS. These positive results falsify a claim that those two dates' sampled symbols have no official historical source, but do not prove all eight sample dates, original July source publication clocks, PIT eligibility, or July D1/R2 segment presence.

Durable source-positive evidence: `system2/evidence/S2_RECENT60_JULY_2026_OFFICIAL_POSTFACTO_PHYSICAL_20261009_V0_1.json`. Durable D1 READ quota failure: `system2/evidence/S2_RECENT60_JULY_20261009_D1_ROW_READ_QUOTA_BLOCKED_V0_1.json`.

After reset at midnight UTC = 08:00 Asia/Taipei, independently check D1 READ budget / single-writer with REMEDIATION_LANE, then retry the bounded #919 merged-main hot/cold physical run once (not an all-market backfill). If needed, reduce physical read surface only through separately tested source-honest change; no HOT/PIT backdating, corporate-action `NO_EVENT` inference, or NC-T01 promotion. 46 currently history-ready symbols still have 0 independent continuity-ready; the full NC-T01 continuity source receipts remain a separate prerequisite.

Protected System1 V8 Formal Core/runtime, capital, push, selection and orders untouched.

## 2026-10-09 07:29 Asia/Taipei — FULL 96/96 frozen July official A1 symbol/date source witness PASS (POST FACTO only)

DATA_LANE PR #922 merged as `656affbff08c5671c20aaf0d376e99cfea36ddca`; System2 Research CI + V8 Regression PASS. Its independent zero-Cloudflare writer/reader official-source Action [Run #37859630615](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37859630615), job `113592009517`, SUCCESS. Immutable Artifact `11585263592`, sha256 `6e18d1cd6209ccdea06721ba81d1c27fe3830e37ff375aaa0713b625bb66f030`, retained 90 days.

Original frozen high-missing 2026-10-08 Hot D1 sample from Run #37854849181 was **12 named stocks × 8 exact 2026-07-14..23 trading dates = 96 market-symbol-date identities** physically absent from isolated Hot D1 when checked earlier on 2026-10-09. The new **retrospective** official canonical exact-date GET check independently fetched all TWSE eight dates plus TPEx eight dates: 16/16 official dates source-ready, six sampled ordinary symbols per market/date, **96/96 official symbol-date presences confirmed NOW**; 0 source-date mismatch and 0 missing sampled identities among successful official responses. The workflow used **0 Cloudflare D1 reads/writes, 0 R2 reads/writes**, and System1 production isolation PASS.

**Do not promote PIT from this positive evidence:** this proves official historical source *currently* has the original frozen 96 sample bars, not that each was published/known at the original July cutoff. It does not certify the other ~44,160 missing PIT eligible symbol-session identities, current Hot D1 readiness, 2026 July Cold R2 month receipts/manifests, full historic universe, MOPS/lifecycle/suspension NO_EVENT, corporate-action continuity, NC-T01 or replay. Sample is deliberately priority-selected, not random.

Account free D1 **ROW READ** quota still blocked the merged-main hot/cold physical Run #37858652385 (artifact 11584838697) before any of the 96 dates could be rechecked. Do not pay/upgrade or blindly dispatch. After 2026-10-09 08:00 Asia/Taipei quota reset, first coordinate REMEDIATION_LANE budget/read contention; then make one bounded read-only hot/cold reconciliation of the exact previously frozen sample and retain both observation timestamps without rewriting the source archive.

Immutable physical source evidence: `system2/evidence/S2_RECENT60_JULY_2026_ALL96_OFFICIAL_SOURCE_POSTFACTO_20261009_V0_1.json`. Earlier 4/4 source evidence and D1 quota blocker remain separately preserved in main; no overwrite.

Protected: System1 Formal Core, A/B Top6, signals, push, 15-minute K, capital, orders, Cloudflare production runtime unchanged.


## 2026-10-09 DATA_LANE — 60-session D1 query-cost containment candidate (PIT unchanged)

Cloudflare isolated System2 D1 READ quota refused the last read-only July frozen 96-identity physical audit (Run `37858652385`) before source/storage readback. Query review showed `probePitHistoryCoverageV0_1` first scanned all historically PIT-eligible A1 rows prior to the market date and grouped/ranked them, although the caller already supplies an exact official 180-calendar-day trading-session window for each recent-60 preflight.

DATA_LANE Class A bounded optimization (branch `system2-data/recent60-exact-calendar-bounded-d1-read-20261009`) adds a parameterized SQL lower bound `market_date >= earliest exact official priorTradingDates` **only when** listing metadata READY and the supplied verified prior session list contains at least the required 60 sessions. Missing/too-short calendar or listing metadata leaves the original unbounded query untouched; every row must still pass PIT eligibility, availability-at-decision and exact expected session/revision checks. No continuity, NC-T01 or strategy READY promotion.

Deterministic tests cover bounded SQL binds, no-history missing results, unchanged 60-row history readiness without continuity, missing/short calendar fallback, and missing metadata fallback. Evidence: `system2/evidence/S2_RECENT60_PIT_COVERAGE_SQL_BOUNDED_READ_PLAN_20261009_V0_1.json`.

At PR creation this is **code candidate, not physical D1 read savings PASS**. CI, V8 regression, merge and post-reset bounded independent D1 row-read observations remain gates; no billing upgrade or physical rerun without available account read quota and REMEDIATION_LANE coordination.

System1 Formal Core/runtime, production Cron, A/B, Top6, signals, push, capital, orders untouched.


## 2026-10-09 DATA_LANE — existing-index symbol-batched 60-session PIT coverage read candidate

Review of PR #928's date-only lower bound against the actual schema `system2/sql/0002_historical_store.sql` found both existing historical A1 D1 indexes are **symbol-leading**. An isolated local SQLite EXPLAIN plan under the existing index definitions still reports a full table SCAN for date-only predicates; with `symbol IN (...)`, `price_space` and `market_date` predicates the static model switches to a symbol-first index SEARCH. This is a query-plan falsification of any premature claim that the #928 date-floor alone solved real D1 READ quota exhaustion. Physical Cloudflare savings have not been measured.

Separate Class A read-only candidate `system2-data/recent60-symbol-index-scoped-read-20261009` now limits the coverage query to the current A1 frozen snapshot's ordinary symbols in batches of at most 50, using only parameter-bound SQL, while retaining the exact existing per-market/symbol/date revision, PIT `available_at`, 60-session ranking, and continuity tests. Every batch must succeed before any readiness artifact is returned; failed D1 reads remain errors, never counted as missing bars/zero-pick. A 101-symbol deterministic multi-batch test confirms 50+50+1 SELECT batches; failed second batch blocks the entire result.

Evidence: `system2/evidence/S2_RECENT60_PIT_COVERAGE_SYMBOL_INDEX_SCOPED_READ_PLAN_20261009_V0_1.json`. **Not yet physically validated:** actual D1 rows-read savings, time/cost and live 1972-symbol completeness. Do not execute another write/read-heavy Cloudflare probe until account-wide quota reset and REMEDIATION_LANE scheduling. NC-T01 and 60-day continuity remain unpromoted.

No System1 Formal Core/runtime, strategy thresholds, final selection, signals, push, capital or orders changed.


## 2026-10-09 DATA_LANE — fixed 2026-10-08 D1 indexed READ physical-cost measurement gate

PR #933 merged as `f7d12dbd21632ea14c702117dcfcf74b41aef559`; exact-head System2/V8 PASS and latest main readback contains parameter-bound 50-current-symbol batches. The first post-merge daily preflight was run before 2026-10-09 market opened; it observed currentUniverse=0 and D1 rowsRead=0, so it is **not** physical throughput/latency evidence. Other post-merge diagnostics also encountered unavailable source/quota conditions; no physical rows-read savings were claimed.

DATA_LANE now provides a separate **manual-only** read-only workflow `system2-recent60-indexed-d1-read-cost-readonly.yml` pinned to completed 2026-10-08 marketDate. Runner strictly refuses to contact Cloudflare before the 2026-10-09 **08:00 Asia/Taipei / 00:00 UTC** daily quota reset; once available it records a real isolated System2 D1 `rowsRead` count and request total, requires no writes and a sufficiently complete contemporaneously queried ordinary market universe (at least 1,800 symbols), and preserves a PASS/BLOCKED Artifact. No push/schedule triggers or automatic retries.

**Do not launch without REMEDIATION_LANE quota/single-reader coordination.** This is a retrospective physical cost probe, not a rerun of original PIT first-known data and never upgrades history/continuity, corporate-action no-event, NC-T01, zero-pick or strategy replay. Evidence: `system2/evidence/S2_RECENT60_INDEXED_READ_COST_POST_RESET_MANUAL_GATE_20261009_V0_1.json`.

System1 Formal Core/runtime, A/B Top6, 15-minute K signal, push, capital and orders untouched.

## 2026-10-09 DATA_LANE — TWTAWU positive JSON/CSV export-contract discovery without Cloudflare

Frozen NC-T01 witness contract still lacks authoritative bounded TWSE TWTAWU suspension **negative completeness**. The previously verified 1218 泰山 event (suspension 2026-08-13; resumption 2026-08-14) is an ideal falsification-first positive witness. Previous DATA_LANE handoff requires reproducing this real row in an independent official export representation before attempting empty-range certification.

New Class A bounded no-secret read-only candidate `system2-data/twtawu-positive-json-csv-diagnostic-20261009`: preserve the existing TWSE official JSON TWTAWU request, and **experimentally** request the same parameters with `response=csv` (not asserted to be a verified official CSV transport until actual source evidence). Hash full response bodies, strictly compare normalized source symbol/suspension/resumption sets and require the same known real 1218 row. An HTML/error/incomplete/changed row result stays BLOCKED and artifact evidence is retained. The workflow runs on a `main` merge, with no Cloudflare credentials, D1/R2 requests, Worker deployment or paid data services.

**Absolute negative-completeness firewall:** even matched positive JSON/CSV is only a diagnostic of rowset parity on the specific two-date range; these may share the same incomplete backend. `exactRangeCompletenessProven=false`, `absenceCertifiesNoSuspension=false`, `noEventMayBeClaimed=false`, `ncT01PromotionAuthorized=false`, old August firstKnownAt unproven. Independent verified export route / range query identity / truncation / revisions / full required family and prospective PIT still required. This does not fill the 44,256 symbol-session recent60 gaps or the 0 continuity READY blocker.

Docs: `system2/SYSTEM2_TWTAWU_POSITIVE_JSON_CSV_PARITY_READONLY_V0_1.md`.
Preregistered evidence: `system2/evidence/S2_TWTAWU_POSITIVE_JSON_CSV_PARITY_DIAGNOSTIC_PREREG_20261009_V0_1.json`.

System1 Formal Core, production runtime/Cron, selection strategy, push, capital and orders unchanged.

## 2026-10-09 DATA_LANE — TWTAWU JSON positive PASS / MS950 CSV charset blocker diagnosed

After PR #936 merged `ffc70aac82c10812a1c1b5cc49081210a4df1cee`, the no-secret public TWTAWU positive-parity physical Action `37868242821` was correctly fail-closed, NOT an NC-T01 pass. Official JSON exact positive-control interval 2026-08-13..14 returned HTTP 200, accepted official schema, 1 event row including real 1218 suspension/resumption. CSV export candidate returned HTTP 200, `Content-Type: text/csv;charset=ms950`; V0.1 used `Response.text()` default UTF8, so the Chinese CSV column contract was unreadable (`CSV official header not proven`). Original reported CSV hash applied to decoded/re-encoded UTF8 text and MUST NOT be reused as a real source-byte digest. Artifact #11588654924 sha256 `208f6be2673f96ad7f1ddf7531a4bdb3be4dd3a3e2ff577d18c9bacaee937841` preserved with BLOCKED.

Independent DATA_LANE correction `system2-data/twtawu-ms950-raw-byte-parity-fix-20261009` obtains true bytes via `Response.arrayBuffer`, hashes the original bytes before charset transformation, decodes explicit MS950/CP950/Big5 through `TextDecoder('big5',{fatal:true})`, and fails closed on other content types, unsupported or corrupt encodings. Deterministic Big5 fixture/regression was added. Re-run once via existing no-Cloudflare post-merge workflow after CI PASS; do not manually dispatch a duplicate.

Evidence: `system2/evidence/S2_TWTAWU_MS950_CSV_ENCODING_BLOCKER_20261009_V0_1.json`. Source export provenance, range exhaustiveness, absence/no suspension and original PIT clocks are unproven, even if re-run CSV row sets match. Corporate-action continuity / NC-T01 promotion remain blocked; System1 production/Formal, capital, orders and push unchanged.
