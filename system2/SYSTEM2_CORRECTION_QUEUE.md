# System 2 Correction Queue

Updated: 2026-10-09 20:27 Asia/Taipei
Status: ACTIVE
Governance: `system2/SYSTEM2_CORRECTION_GOVERNANCE_V0_1.md`
Machine-readable companion: `system2/SYSTEM2_CORRECTION_QUEUE.json`
Execution-lane governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Queue rules

- GitHub main is canonical.
- Every directive uses an immutable `S2-CORR-YYYYMMDD-NNN` ID.
- CRITICAL/HIGH items are not self-closed by the implementation role.
- `FIX_IMPLEMENTED` is not equivalent to `VERIFIED_CLOSED`.
- Original evidence is never deleted when status changes.
- Protected Class B/Class C or Formal-Core decisions require owner approval.
- Severity and routing are separate. Do not send every HIGH item to remediation.
- One conflict unit has one active modification owner.

## Open directives

### S2-CORR-20261004-001 — Historical daily-market backfill stalled after first 2017 TWSE annual attempt

- createdAt: 2026-10-04T15:13:33+08:00
- severity: HIGH
- status: FIX_IN_PROGRESS
- latest verified scope (00 audit 2026-10-09 11:39): 2017–2025 TWSE+TPEx raw annual physical 18/18 PASS; 2024 TPEx and 2025 both exchanges already accepted. Remaining 2026 segmented/PIT/continuity/aggregate qualification; 10/01–10/08 dual-market official 12/12 source-only, D1 hot presence unverified. Original run #28–#30 failures below are historical evidence, not current blockers. Preserve status FIX_IN_PROGRESS.
- routingClass: DATA_LANE
- assignedLane: DATA_LANE
- assignedRoom: System 2｜歷史資料工程室
- modificationOwner: SYSTEM2_HISTORICAL_DATA_ROOM
- blockedBy: 2017–2025 annual TWSE/TPEx raw-market-year data coverage was physically accepted 18/18, including 2024 TPEx run #31, 2025 TWSE #32 and 2025 TPEx #33. Remaining scope is 2026 segmented TWSE/TPEx storage, historical/PIT/continuity and aggregate replay qualification; 2026-10-08 current-session hot D1 source-to-storage completeness remains unverified. S2-CORR-20261007-003 D1 account-wide write/read quota coordination is an active separate blocker. Do not repeat old 2024 TPEx quota/date failure as current.
- affectedScope: S2-03 Historical infrastructure / P0 2017-present TWSE+TPEx daily A1 cold history
- detectedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- canonicalRequirement: System 2 historical infrastructure must physically populate and verify the staged official 2017-present Taiwan-equity daily history before it can be described as complete or used as complete full-market replay evidence.
- observedProblem: Historical raw A1 coverage is accepted through TWSE 2024 and TPEx 2023. 2024 TPEx remains unaccepted: run #28 failed twice on intermittent PRIMARY transport timeouts, and fix-bearing fresh run #29 then reached the workflow's configured 60-minute job timeout before full-year source acquisition completed. Because annual source acquisition precedes pack/persistence, run #29 produced no Physical verify or coverage artifact. CORR-001 remains FIX_IN_PROGRESS for a bounded DATA_LANE repair and subsequent fresh physical acceptance, then 2025/2026 continuation and aggregate replay qualification.
- evidence:
  - Fresh annual run `37611914140` (#30) failed in `migrate` before backfill because Cloudflare D1 returned HTTP 400 free-tier daily row-write limit exceeded.
  - Run #30 backfill and Physical verify were skipped; no coverage artifact was produced. This is NOT evidence of a 2024 TPEx source/data failure because annual ingest never started.
  - Free-tier reset is no earlier than `2026-10-08T00:00:00Z` = `2026-10-08 08:00 Asia/Taipei`; no paid-plan upgrade is authorized.
  - Recurrent cross-workflow quota coordination is separately routed to `S2-CORR-20261007-003` / REMEDIATION_LANE.
  - 2024 TPEx fresh run `37593983170` (#29) used fix-bearing head `5c50a246bf91f9b1bc37c99f082bdfec467d5f09` and confirmed `year=2024 / market=TPEX`.
  - Run #29 backfill was cancelled at the configured `timeout-minutes: 60`; elapsed job time was approximately one hour. Physical verify was skipped, no coverage artifact was produced, and System1 isolation PASSed.
  - Annual script fetches the full official market-year range before pack construction / R2 / D1 persistence, so the source-fetch stage currently has no durable resume checkpoint. Blind rerun is not accepted as a repair.
  - SYSTEM2_CHECKPOINT: run 36545375167 failed before annual ingest.
  - SYSTEM2_CHECKPOINT: repaired continuation required manual 2017 TWSE rerun, then TPEx only after TWSE coverage/hash/manifest/receipt verification.
  - GitHub Actions run `36574839220`: 2017 TWSE reached the cold-object write path and failed on `R2 HEAD failed: HTTP 502`; migrate job passed and no completion receipt was produced.
  - PR #522 / merge `7d35e8693d8ecfefd2f43fabbdde8b501f585857`: DATA_LANE added bounded R2 retry/backoff for 408/425/429/5xx and transient timeout/network failures while retaining fail-closed integrity and authorization semantics.
  - System2 Research CI `37187368126` and V8 Regression `37187368095`: SUCCESS.
  - SYSTEM2_BUILD_PROGRESS_MAP: S2-03 remains 🟡; full 2017-present cold history completion remains separate work.
  - SYSTEM2_MVP_SHADOW_STATUS_V0_1: 2017 full-market cold backfill is not claimed complete and staged annual population remains pending.
  - GitHub Actions run `37197090867` (#7): SUCCESS on head `7f7eda36b1de31caa01817ce3b9570af8826fe15`.
  - 2017 TWSE storage verification: 920 packs / 222,194 bars / 920 HEAD + 920 byte-GET SHA checks PASS.
  - Fresh official TWSE 2017 reconciliation: 246 sessions / 222,194 rows / 0 missing-from-cold / 0 extra / 0 row-hash mismatch.
  - Historical-universe expected membership sessions 222,845; 651 UNKNOWN gaps across 44 symbols retained fail-closed; data coverage PASS, replay readiness PARTIAL.
  - Artifact `11301298928`, digest `sha256:6b535e6d32a7f768ca55bb5fe98b504efb6a7d770a3b5a11071760d673bc6618`.
  - GitHub Actions run `37201834701` (#8): SUCCESS on head `b0a445e0cff7a4a9035cf706cc1fc8da139bd9f9`.
  - 2017 TPEx storage verification: 753 packs / 180,806 bars / 753 HEAD + 753 byte-GET SHA checks PASS.
  - Fresh official TPEx 2017 reconciliation: 246 sessions / 180,806 rows / 0 missing-from-cold / 0 extra / 0 row-hash mismatch.
  - Conservative TPEx universe denominator 181,264; 458 UNKNOWN symbol-session gaps retained; data coverage PASS, replay readiness PARTIAL.
  - TPEx historical delisting-union remains incomplete and is explicitly PARTIAL, not inferred complete.
  - Artifact `11304212419`, digest `sha256:48d2cac27deaacc95bb5a03ea6072dff76d39ca60804943dc6948c76fa2be20d`.
  - GitHub Actions run `37211022004` (#9): SUCCESS on head `7ad031675605d5b276a7b1d8dda244bb57048759`.
  - 2018 TWSE storage verification: 943 packs / 227,381 bars / 943 HEAD + 943 byte-GET SHA checks PASS.
  - Fresh official TWSE 2018 reconciliation: 247 sessions / 227,381 rows / 0 missing-from-cold / 0 extra / 0 row-hash mismatch.
  - Historical-universe expected membership sessions 227,950; 569 UNKNOWN symbol-session gaps retained fail-closed; data coverage PASS, replay readiness PARTIAL.
  - Artifact `11307491716`, digest `sha256:d788354ab68f9005a7b758aab36912eef9e9104b3f81df06ef7585a3e92d00ff`.
  - GitHub Actions run `37223028925` (#10): SUCCESS on head `b1ed6a60a0792ebd57bcf4c7f24bb22f893d12d0`.
  - 2018 TPEx storage verification: 773 packs / 186,350 bars / 773 HEAD + 773 byte-GET SHA checks PASS.
  - Fresh official TPEx 2018 reconciliation: 247 sessions / 186,350 rows / 0 missing-from-cold / 0 extra / 0 row-hash mismatch.
  - Conservative TPEx universe expected membership sessions 186,729; 379 UNKNOWN symbol-session gaps retained fail-closed; data coverage PASS, replay readiness PARTIAL.
  - Artifact `11311721304`, digest `sha256:84f33f09df6a04ab1980ca60b1ddaf5d11025940a3cbe3cb1e55ac62631981dd`.
  - TPEx limitation text hard-coded to 2017 in run #10 was metadata-only and corrected for future runs by merge `c7e8156c96b82a252510b3fc8f07cfd93425acd6`.
  - GitHub Actions run `37251356804` (#11): SUCCESS on head `5d0cb81bf85e8a10ffdbdde29545aef97802b0eb`.
  - 2019 TWSE storage verification: 953 packs / 226,715 bars / 953 HEAD + 953 byte-GET SHA checks PASS.
  - Fresh official TWSE 2019 reconciliation: 242 sessions / 226,715 rows / 0 missing-from-cold / 0 extra / 0 row-hash mismatch.
  - Historical-universe expected membership sessions 227,299; 584 UNKNOWN symbol-session gaps retained fail-closed; data coverage PASS, replay readiness PARTIAL.
  - Artifact `11321561727`, digest `sha256:4bce2e6040f0d1b9aecfaa930e17943896dcdbe99620167a3a37af76959e0e30`.
  - GitHub Actions run `37265660775` (#12): SUCCESS on head `83944fb3534f1a865d23d7eb775f4748d8083b91`.
  - 2019 TPEx storage verification: 785 packs / 186,311 bars / 785 HEAD + 785 byte-GET SHA checks PASS.
  - Fresh official TPEx 2019 reconciliation: 242 sessions / 186,311 rows / 0 missing-from-cold / 0 extra / 0 row-hash mismatch.
  - Conservative TPEx universe expected membership sessions 186,617; 306 UNKNOWN symbol-session gaps retained fail-closed; data coverage PASS, replay readiness PARTIAL.
  - Artifact `11328115392`, digest `sha256:f7f678ad230ae34ebc20d83277035b20a70486eeac5cde06bce016daf2a8116f`.
  - GitHub Actions run `37274480646` (#13): SUCCESS on head `2ad1312d9de26c37d0ab343239f3b9fce88d33c9`.
  - 2020 TWSE storage verification: 958 packs / 231,961 bars / 958 HEAD + 958 byte-GET SHA checks PASS.
  - Fresh official TWSE 2020 reconciliation: 245 sessions / 231,961 rows / 0 missing-from-cold / 0 extra / 0 row-hash mismatch.
  - Historical-universe expected membership sessions 232,475; 514 UNKNOWN symbol-session gaps retained fail-closed; data coverage PASS, replay readiness PARTIAL.
  - Artifact `11331320701`, digest `sha256:e330cd8df13332cea813550a71fbf88c159300e3706893f2624bbc1ee165eaae`.
  - 2020 TPEx run `37283878520` (#14): backfill/storage PASS; 794/794 R2 byte checks; 189,746 cold rows == 189,746 fresh official rows; 0 missing/extra keys; V0.3 blocked on 773 full-source-row hash changes on 2020-02-27.
  - Source revision is not being silently ignored or used to rewrite cold history. Verifier V0.4 merged in `4cd31c569886faaa8e3cb3522ae28b72e9346724` compares canonical A1 values separately and preserves revision lineage.
  - Blocker evidence: `system2/evidence/S2_HISTORICAL_TPEX_2020_REVISION_BLOCKER_V0_1.json`.
  - GitHub Actions run `37318143684` (#15): SUCCESS on head `cd3f616fa4d26bfd81d316b26dabd467f62814cd` using verifier V0.4.
  - 2020 TPEx storage verification: 794 packs / 189,746 bars / 794 HEAD + 794 byte-GET SHA checks PASS.
  - Fresh official TPEx 2020 reconciliation: 245 sessions / 189,746 rows / 0 missing-from-cold / 0 extra / 0 full-row hash mismatch / 0 canonical A1 value mismatch.
  - Source version state is `STABLE`; the 773 full-source-row mismatches from prior run #14 were not reproduced and cold history was never rewritten.
  - Conservative TPEx universe expected membership sessions 190,154; 408 UNKNOWN symbol-session gaps retained fail-closed; data coverage PASS, replay readiness PARTIAL.
  - Artifact `11349482735`, digest `sha256:6fad4807366e4d9c462eef22272d74f353b04310133930f3d76b1284e5759004`.
  - GitHub Actions run `37320600966` (#16): SUCCESS on head `d74b7bda9acfe40fb52fb2a031ffb32cafd6d8f0`.
  - 2021 TWSE storage verification: 968 packs / 232,956 bars / 968 HEAD + 968 byte-GET SHA checks PASS.
  - Fresh official TWSE 2021 reconciliation: 244 sessions / 232,956 rows / 0 missing-from-cold / 0 extra / 0 full-row hash mismatch / 0 canonical A1 mismatch.
  - Historical-universe expected membership sessions 233,530; 574 UNKNOWN symbol-session gaps retained fail-closed; data coverage PASS, replay readiness PARTIAL.
  - Artifact `11352061154`, digest `sha256:4bee3d3b9698b1fc9cdf52e230eeaa19f4b8c686587abe8fc87486483ceedc19`.
  - GitHub Actions run `37326149826` (#17): migrate SUCCESS; annual backfill stopped at D1 `writeCheckpoint()` with free-tier daily row-write limit exceeded; Physical verify skipped; System1 isolation PASS.
  - Earliest free-tier retry: `2026-10-06T00:00:00Z` = `2026-10-06 08:00 Asia/Taipei`.
  - Partial cold state is resume-safe and must not be deleted or rewritten; existing R2 objects/manifests remain immutable-checked on retry.
  - Blocker evidence: `system2/evidence/S2_HISTORICAL_TPEX_2021_D1_QUOTA_BLOCKER_V0_1.json`.
  - 2021 TPEx run `37401612529` (#18): annual backfill/storage PASS and System1 isolation PASS; attempt 2 Physical verify produced durable artifact `11409737982` but blocked on `SOURCE_REVISION_WITH_CANONICAL_A1_CHANGE`.
  - 2021 TPEx storage facts: COMPLETE receipt / 795 packs / 191,643 bars / 795 HEAD + 795 byte-GET SHA checks PASS / zero missing or extra fresh-official keys.
  - Source revision is concentrated on `2021-01-14`: 780 source-row hash changes, 698 canonical A1 value changes, 82 source-revision-only rows.
  - Durable revision evidence: `system2/evidence/S2_HISTORICAL_TPEX_2021_REVISION_BLOCKER_V0_1.json`; artifact digest `sha256:32a98f1528ea1cdc8154eaa2e31b43e9d2905e92d0a43606c4cf29abd1d2f621`.
  - 2022 TWSE run `37467099680` (#19): SUCCESS; 985 packs / 237,941 bars / 985 R2 HEAD + byte-GET SHA checks PASS; 246 official sessions; 0 missing/extra fresh-official keys; 0 source-row-hash or canonical A1 mismatch; source version STABLE.
  - 2022 TWSE membership-session denominator 238,640 leaves 699 explicit UNKNOWN symbol-session gaps; data coverage PASS / replay readiness PARTIAL.
  - 2022 TWSE durable evidence: `system2/evidence/S2_HISTORICAL_TWSE_2022_PHYSICAL_VERIFICATION_V0_1.json`; artifact `11416932962`, digest `sha256:4718df9b1232cbe7e359a9ea2bdf9a31f03cd9574d744eaedd502293a65baddd`; System1 isolation PASS.
  - 2022 TPEx run `37473405416` (#20): SUCCESS; 815 packs / 195,840 bars / 815 R2 HEAD + byte-GET SHA checks PASS; 246 official sessions; 0 missing/extra fresh-official keys; 0 source-row-hash or canonical A1 mismatch; source version STABLE.
  - 2022 TPEx membership-session denominator 196,015 leaves 175 explicit UNKNOWN symbol-session gaps; data coverage PASS / replay readiness PARTIAL; TPEx historical-universe readiness remains `PARTIAL_OBSERVED_INTERVAL_NO_OFFICIAL_DELISTING_UNION`.
  - 2022 TPEx durable evidence: `system2/evidence/S2_HISTORICAL_TPEX_2022_PHYSICAL_VERIFICATION_V0_1.json`; artifact `11419964963`, digest `sha256:b4c2cfe61389d95865d0b7da358ee83275840d3e512830f2eae62af0ed83c76a`; System1 isolation PASS.
  - 2023 TWSE run `37482307633` (#21): backfill/storage PASS, Physical verify BLOCKED, artifact `11423484682`, System1 isolation PASS; raw source/storage reconciliation is clean with zero source/canonical mismatches.
  - Structural blocker: 205 `unexpectedBars`; retained sample begins `2023-03-06|6873`. Official TWSE history shows 6873 began Innovation Board trading on 2023-03-06 and later changed to regular listed trading on 2024-09-26.
  - Durable blocker evidence: `system2/evidence/S2_HISTORICAL_TWSE_2023_UNIVERSE_BLOCKER_V0_1.json`.
  - Fix `a0bf42f81fa46fc3854d2c8cf844851327966a9b` + regression guard `045d40399c7845ef76cea4051b4a05b2599e1be2`; fresh 2023/TWSE dispatch waits for fix-bearing System2 Research CI PASS.
  - Run #22 `37493424179` post-first-fix reverify still BLOCKED with 205 unexpected bars; `currentListingStartReconciledCount=0` proved the first matcher did not hit live source rows.
  - Refined cause: CURRENT rows use legal company names while NEWLISTING rows use company short names. Second runtime fix `6a227f96cb0af9d6c1620402be25b93167eb4e16` uses conservative legal-name/short-name alias intersection; realistic regression `64d2f7e8ecf923e0b133101e340c78222facddef` preserves same-code/different-company rejection.
  - System2 Research CI `37495340984` PASS. Durable evidence: `system2/evidence/S2_HISTORICAL_TWSE_2023_UNIVERSE_BLOCKER_V0_2.json`. Fresh 2023/TWSE reverify is still required; do not rerun old run #22.
  - 2023 TWSE fresh post-second-fix run `37534409279` (#23): SUCCESS on head `676c26a53f59aa8cb6b07afbd0453ba3e06d8112`; confirmed inputs `year=2023 / market=TWSE`.
  - Live universe reconciliation now reports `currentListingStartReconciledCount=4` for `2465 / 2482 / 2486 / 6873`; prior `unexpectedBars=205` is reduced to `0` while fail-closed verifier semantics remain unchanged.
  - 2023 TWSE storage/source PASS: 1,003 packs / 234,727 bars / 1,003 R2 HEAD + byte checks; 234,727 cold rows = 234,727 fresh official rows; 0 missing/extra/source-row/canonical mismatches; source version STABLE.
  - Membership-session denominator 235,345 leaves 618 explicit UNKNOWN symbol-session gaps; data coverage PASS / replay readiness PARTIAL.
  - Accepted evidence: `system2/evidence/S2_HISTORICAL_TWSE_2023_PHYSICAL_VERIFICATION_V0_1.json`; artifact `11446466007`, digest `sha256:83e771a65d4853677210303b5b30b5141e3b9a3902dfbbcb83ef1ad4eb459e27`. Prior blocker evidence V0_1/V0_2 remains preserved as historical provenance.
  - 2023 TPEx run `37537013825` (#24): SUCCESS; 824 packs / 193,327 bars / 824 R2 HEAD + byte checks; 239 official sessions; 0 missing/extra/source-row/canonical mismatches; source version STABLE.
  - 2023 TPEx denominator 193,722 leaves 395 explicit UNKNOWN symbol-session gaps; `unexpectedBars=0`; data coverage PASS / replay readiness PARTIAL.
  - TPEx historical-universe readiness remains `PARTIAL_OBSERVED_INTERVAL_NO_OFFICIAL_DELISTING_UNION`; official delisting union is not inferred complete.
  - Durable evidence: `system2/evidence/S2_HISTORICAL_TPEX_2023_PHYSICAL_VERIFICATION_V0_1.json`; artifact `11448741341`, digest `sha256:b69cc4faa66b236cbf3de3afa7807f64f4232ed7494dfb84a29a0c255ffbd4ee`.
  - Independent audit progress receipt `system2/evidence/S2_CORR_20261004_001_AUDIT_PROGRESS_20261007_V0_1.json` independently confirmed the same physical acceptance and found only canonical sync debt inside existing CORR-001; no duplicate correction was opened.
  - 2021 TPEx recovery run `37552411600` (#1) failed before revision persistence because current PRIMARY reconciliation returned `canonicalA1ValueMismatchCount=0` instead of the frozen 698; System1 isolation PASSed.
  - Direct official-source comparison proves transport semantics differ: PRIMARY `上櫃股票行情` includes values such as 1240 volume/value/tx `18,564 / 1,005,344 / 22`, while legacy `上櫃股票每日收盤行情(不含定價)` returns `18,000 / 974,800 / 15`. Run #18 mismatch samples match the legacy values.
  - Canonical TPEx historical A1 transport is now `PRIMARY_ONLY_FAIL_CLOSED_NON_EQUIVALENT_LEGACY`; legacy fallback is diagnostic-only and cannot satisfy canonical ingestion.
  - System2 Research CI `37554545204` PASSed after the source-policy/recovery fix. Durable evidence: `system2/evidence/S2_HISTORICAL_TPEX_2021_TRANSPORT_SEMANTICS_ROOT_CAUSE_V0_1.json`.
  - Fresh post-fix recovery dispatch is required; old run #1 must not be Re-run because it is bound to the pre-fix head.
  - 2021 TPEx is fail-closed BLOCKED, not rewritten. The coverage matrix preserves the old quota blocker as resolved historical provenance and now records the canonical revision blocker.
- riskIfUnfixed: Historical replay, factor validation, multi-year backtests, regime robustness and strategy comparison can be mistaken for being backed by a complete market history when only bounded/smoke datasets exist. This creates a false-completion and evidence-coverage risk on a P0 dependency.
- requiredCorrection:
  1. Resume from the repaired historical-calendar implementation; do not restart architecture design.
  2. Execute manual isolated 2017 TWSE annual cold backfill.
  3. Verify R2 object hashes, D1 manifests/checkpoints/completion receipt, expected symbol/date coverage, survivorship/delisting membership, UNKNOWN/continuity states and immutable rerun behavior.
  4. Only after TWSE 2017 is independently accepted, execute and verify 2017 TPEx.
  5. Continue year-by-year through the authorized Core Base horizon to present, preserving yearly completion receipts and explicit gaps.
  6. Produce an aggregate coverage matrix showing market × year × expected sessions × symbols × bars × missing/UNKNOWN causes.
  7. Run the first real full-market PIT replay only after the required history slice is physically qualified.
  8. Keep incomplete years/markets visibly incomplete; never infer completion from code/tests/smoke packs.
- acceptanceCriteria:
  - 2017 TWSE completion receipt physically exists and independently reconciles to manifests/R2 objects and coverage expectations.
  - 2017 TPEx is accepted under the same standard after TWSE.
  - Each later year has a durable market-specific completion or explicit blocked/deferred receipt.
  - Aggregate 2017-present coverage is machine-readable and identifies all unresolved gaps rather than coercing them to zero/pass.
  - A full-market replay consumes only verified historical registry/cold packs with PIT/continuity guards.
  - System 1 Formal Core and production runtime remain unchanged.
- protectedBoundaries: System 1 Formal Core; System 2 live selection authority; production push; capital/order impact; no retrospective data relabeled as prospective evidence.
- ownerDecisionRequired: false for the currently authorized isolated research backfill/resumption; any new paid source, new permissions, secrets, production/runtime change or protected Class B/C change requires owner approval.
- implementationEvidence:
  - Latest main re-read confirms repaired `system2-historical-pack-2017-backfill.yml` remains manual `workflow_dispatch`, isolated to `system2-research`, with TWSE-first/TPEX-second ordering.
  - Current annual script fast-path verifies an existing COMPLETE receipt and referenced R2 objects before accepting `ALREADY_COMPLETE`; otherwise it fetches official historical A1, builds external cold packs, writes immutable R2 objects/D1 manifests, and issues receipt-last completion.
  - Manual run `36574839220` proved the repaired calendar path reaches R2 persistence; its terminal defect was transient `R2 HEAD failed: HTTP 502`, not calendar/source-schema failure.
  - PR #522 merged as `7d35e8693d8ecfefd2f43fabbdde8b501f585857`: the R2 adapter now re-signs and performs bounded retries for 408/425/429/5xx and transient fetch timeout/network failures; 404 missing-object, 412 put-if-absent, non-retryable 4xx and immutable hash/manifest checks retain prior semantics.
  - System2 Research CI run `37187368126` and V8 Regression run `37187368095` both passed.
  - GitHub connector available to this room has read/rerun actions but no new `workflow_dispatch` action. Re-running run `36574839220` is rejected because it is bound to old head SHA `df3c680d94f5b8ec06d474ba1d120e3c2ed60d58`, before the R2 retry hardening and later schema changes.
  - Controlled browser profiles currently have no recorded GitHub sign-in, so a fresh latest-main web dispatch still requires owner login authorization.
  - Exact next executable action after GitHub browser sign-in: run `.github/workflows/system2-historical-pack-2017-backfill.yml` from latest `main` with `market=TWSE`, then independently verify receipt/manifests/R2 hashes/coverage before allowing TPEX.
- verificationEvidence:
  - Run `37197090867` migrate/backfill/physical verify/artifact upload/System1 isolation: SUCCESS.
  - Completion receipt `S2HCR-98d7cf6888e3069a2a170c20dbe8acee1cd7d5cb9bc7d9afa33319eb816fe97a`: COMPLETE.
  - Manifest rolling hash `98d7cf6888e3069a2a170c20dbe8acee1cd7d5cb9bc7d9afa33319eb816fe97a`.
  - 2017 TWSE disposition: `DATA_COVERAGE_ACCEPTED_REPLAY_READINESS_PARTIAL`.
- finalDisposition: PENDING
- updatedAt: 2026-10-06T00:12:00+08:00


  - 2021 TPEx recovery run `37555975307` (#3): SUCCESS; source-semantics recovery, Physical verifier V0.5, artifact upload and System1 isolation all PASS.
  - Full-year 2021 TPEx reconciliation: 191,643 cold rows = 191,643 fresh official rows; 0 missing/extra/source-row/canonical A1 mismatches; effective integrity PASS.
  - Coverage: 244 sessions; denominator 192,055; actual 191,643; 412 explicit UNKNOWN symbol-session gaps; unexpectedBars=0; Data Coverage PASS / Replay Readiness PARTIAL.
  - Accepted evidence: `system2/evidence/S2_HISTORICAL_TPEX_2021_PHYSICAL_VERIFICATION_V0_1.json`; artifact `11455912132`, digest `sha256:b26787f62a240bc39dc39d2f82b7a2bc30b4bfcd07f708d3ebffc6713ae4ff46`.
  - Prior canonical-revision interpretation is superseded by transport-semantics root cause evidence; old blocker evidence remains immutable provenance.
  - Latest-main 2021 TPEx confirmation run `37563020090` (#6): SUCCESS on head `9b145291e04e6c3fcb2a8408a6f7a983d80e4f02`; source-only signature remained `780 / 0 / 780`, zero revision rows were persisted, immutable cold history was not mutated, Physical verifier V0.5 and System1 isolation PASSed.
  - 2024 TWSE run `37564954928` (#26): SUCCESS on head `6f50f29de3fd90259dadcb94a3964917af4b13c3`; 1,038 packs / 246,037 bars / 1,038 R2 HEAD + byte checks; 242 official sessions; 0 missing/extra/source-row/canonical mismatches; source version STABLE.
  - 2024 TWSE denominator 246,515 leaves 478 explicit UNKNOWN symbol-session gaps; `unexpectedBars=0`; data coverage PASS / replay readiness PARTIAL.
  - Durable evidence: `system2/evidence/S2_HISTORICAL_TWSE_2024_PHYSICAL_VERIFICATION_V0_1.json`; artifact `11460055754`, digest `sha256:3ff4f18b7fee67b2ebc3ef9f41597e6ef3f594d7ec8e6c745c520b161b30df5b`.
  - Annual continuation advances to `2024 / TPEX`; CORR-001 remains `FIX_IN_PROGRESS` pending remaining market-years and independent closure criteria.

### S2-CORR-20261006-003 — Candidate Board presents monitored bounded rows as candidates without resolvable strategy identity

- createdAt: 2026-10-06T21:01:27+08:00
- severity: MEDIUM
- status: VERIFIED_CLOSED
- routingClass: BUILD_LANE
- assignedLane: BUILD_LANE
- assignedRoom: System 2｜建置總控室
- modificationOwner: SYSTEM2_BUILD_CONTROL_ROOM
- blockedBy: none
- affectedScope: S2-16 Candidate Board / Decision Workspace monitored-row semantics / strategy attribution
- detectedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- canonicalRequirement: Until S2-07 exposes a real frozen daily candidate/read API, bounded resonance/pool rows may be reused only as explicitly monitored rows. They must not be presented as formally selected candidates, and strategy filtering/labels must not claim strategy attribution that the read path cannot actually resolve.
- observedProblem: `terminal_page.mjs::candidateRows()` populates the Candidate Board from `/api/system2/resonance` rows and, when those are absent, falls back to `/api/system2/resonance/pool` symbols. This contradicts the page text saying the board will remain empty when S2-07 has not produced formal candidates. In addition, `strategyOf()` only reads strategyId/strategy/strategyName/primaryStrategy, while the bounded pool carries strategy attribution under `strategyMemberships` and the resonance read model drops strategy membership entirely. As a result monitored rows can appear on a page titled Candidate Board while strategy identity resolves to `UNRESOLVED_STRATEGY`, and the visible strategy tabs cannot reliably perform the claimed per-strategy separation.
- evidence:
  - `SYSTEM2_INSTITUTIONAL_TERMINAL_IA_V0_1.md`: candidate/decision surfaces may reuse bounded resonance/pool rows only as monitored rows; they must not relabel diagnostic records as formally selected candidates.
  - Same IA document lists the next wiring step as S2-07 frozen daily candidate/read API -> Candidate Board + Decision Card.
  - `terminal_page.mjs`: Candidate Board copy says S2-07 formal candidates will leave the board empty, but `candidateRows()` returns resonance rows and then pool rows.
  - `terminal_page.mjs::strategyOf()` does not read `strategyMemberships` and falls back to `UNRESOLVED_STRATEGY`.
  - `daily_resonance_read_model_v0_1.mjs` exposes symbol/finality/lifecycle/resonance fields but no strategy identity.
  - `daily_resonance_integration_v0_1.mjs` builds pool rows with explicit `strategyMemberships`, so strategy provenance exists upstream but is not consumed by the terminal fallback.
  - Existing terminal tests do not cover candidateRows fallback, unresolved strategy identity, or strategy-tab correctness.
- riskIfUnfixed: Operators can interpret monitored pool/resonance rows as System 2 strategy candidates before the S2-07 candidate authority/read model exists, while the UI simultaneously implies per-strategy attribution that the actual data path cannot resolve. This creates false-completion and provenance ambiguity even though no trading authority is granted.
- requiredCorrection:
  1. Separate formal candidate rows from monitor-only bounded resonance/pool rows in the terminal state model.
  2. Until a frozen S2-07 candidate/read API exists, Candidate Board must either stay explicitly empty for formal candidates or render monitor rows in a clearly separate monitor-only section/state that cannot be mistaken for formal selection.
  3. Do not use `UNRESOLVED_STRATEGY` monitored rows as if they satisfy per-strategy Candidate Board filtering.
  4. If monitor rows are shown, preserve strategy provenance from pool `strategyMemberships` only as monitor provenance; do not promote it into formal candidate strategy authority.
  5. Strategy tabs must not claim working per-strategy candidate filtering unless the underlying row has canonical strategy identity from an authorized candidate source.
  6. Decision Workspace must preserve the same distinction: selecting a monitored row must not imply formal candidate selection/frozen-decision readiness.
  7. Add regression tests covering: no formal candidate API -> formal candidate board empty/pending; pool/resonance fallback remains monitor-only; unresolved strategy cannot pass a strategy tab as if resolved; pool strategyMemberships are not promoted into formal candidate authority.
  8. Preserve S2-16 read-only shell, resonance formula/state machine, bounded pool, strategy logic, assessor policy, ranking/capacity, final/live selection, push/orders, and System1 Formal Core.
- acceptanceCriteria:
  - UI can no longer present resonance/pool fallback rows as formal candidates when no S2-07 frozen candidate/read API is available.
  - Formal Candidate Board state is explicitly PENDING/EMPTY until authorized candidate data exists, or monitor-only rows are visibly segregated from formal candidates.
  - Strategy filtering does not rely on `UNRESOLVED_STRATEGY` or infer formal strategy identity from monitor-only evidence.
  - Any displayed monitor strategy provenance is explicitly labeled as pool/monitor provenance, not frozen candidate authority.
  - Decision Workspace does not upgrade a monitored-row selection into formal candidate/frozen-decision readiness.
  - Regression tests protect candidate-source and strategy-attribution boundaries.
  - No protected strategy/trading authority changes are introduced.
- protectedBoundaries: S2-07 assessor/frozen-candidate authority; strategy logic; strategy contracts/preregistration; ranking/capacity; resonance formula/state machine; final/live selection authority; notification/push; capital/orders; System1 Formal Core.
- ownerDecisionRequired: false for truthful UI/read-model separation only; creating or promoting the actual S2-07 frozen candidate authority remains separately governed.
- implementationEvidence:
  - PR #686 merged as `fa9c433cf84d61f400c935cbd70019c7c9d39878` after zero-drift pre-merge conflict-unit check.
  - Formal Candidate Board now remains `FORMAL CANDIDATE PENDING / EMPTY`; `formalCandidateRows()` returns no rows until an authorized S2-07 frozen candidate/read source exists.
  - Bounded resonance rows and active-pool fallback rows are isolated under `MONITOR-ONLY｜Bounded Pool / Resonance` with `__rowAuthority="MONITOR_ONLY"` and explicit `MONITOR / RESEARCH` source semantics.
  - Formal strategy tabs are disabled/pending and no longer filter monitor rows as if they were authorized per-strategy candidates.
  - `UNRESOLVED_STRATEGY` and `strategyOf()` are removed from candidate attribution; unresolved monitor provenance is represented as `MONITOR_PROVENANCE_UNRESOLVED` rather than a formal candidate strategy.
  - `daily_resonance_read_model_v0_1.mjs` now exposes `monitorStrategyMemberships`, `strategyAttributionAuthority=MONITOR_POOL_PROVENANCE_ONLY`, and `formalCandidateStrategyId=null`; pool memberships remain monitor provenance only.
  - Selecting a monitor row opens Decision Workspace with `MONITOR ROW · NOT FORMAL CANDIDATE`, formal candidate state `NOT_AVAILABLE`, and formal action remains `NO_FROZEN_DECISION`.
  - Targeted `institutional_terminal_page_v0_1.test.mjs` PASS and `daily_resonance_read_model_v0_1.test.mjs` PASS inside System2 Research CI run `37469475340` / job `112288878394`.
  - System2 Research CI run `37469475340` PASS; V8 Regression run `37469475238` PASS; merged-main System2 Research CI run `37469704138` PASS.
  - Merged-main readback verified all candidate/monitor separation invariants, followed by latest-main drift check showing zero drift across terminal page, terminal test, resonance read model, and read-model test.
  - No S2-07 assessor/frozen-candidate authority, strategy logic/contracts/preregistration, ranking, capacity, resonance formula/state machine, final/live selection authority, push/notification, capital/order, or System1 Formal Core was changed.
- verificationEvidence: PENDING — handoff to SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- finalDisposition: PENDING — implementation complete; independent verification required before closure
- updatedAt: 2026-10-06T21:18:28+08:00

## Closed directives
- governance status reconciliation (2026-10-08 18:50 Asia/Taipei): status synchronized with pre-existing canonical JSON `VERIFIED_CLOSED`; original historical discovery notes remain preserved, no new closure claim or evidence invented.


### S2-CORR-20261006-004 — Institutional terminal can surface prior-session resonance as current-day monitor data

- createdAt: 2026-10-06T21:12:49+08:00
- severity: MEDIUM
- status: VERIFIED_CLOSED
- routingClass: BUILD_LANE
- assignedLane: BUILD_LANE
- assignedRoom: System 2｜建置總控室
- modificationOwner: SYSTEM2_BUILD_CONTROL_ROOM
- blockedBy: none
- affectedScope: S2-16 terminal freshness / Candidate Board / Decision Workspace / Today Focus / Resonance Center
- detectedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- canonicalRequirement: Current-session terminal surfaces must fail closed on market-date mismatch. Prior-session resonance history may remain queryable as history, but it must not be silently reused as today's Candidate Board, Decision Workspace, Today Focus or active resonance monitor state.
- observedProblem: The terminal loads `/api/system2/resonance` without `marketDate`. The Worker passes a null marketDate to `readLatestResonanceApiV0_1()`, which explicitly resolves the most recent persisted `market_date` via `ORDER BY market_date DESC LIMIT 1`. By contrast, `/api/system2/resonance/pool` and `/api/system2/resonance/operations` default to the current Taipei market date. The terminal then prefers `S.resonance.symbols` in Candidate Board and reuses those rows in Decision Workspace, Today Focus and Resonance Center without validating that `S.resonance.marketDate` equals the current/pool/operations market date. A prior-session resonance snapshot can therefore appear on a current-day terminal even when today's active pool is absent or fail-closed.
- evidence:
  - `terminal_page.mjs::load()` calls `/api/system2/resonance` without a marketDate query parameter.
  - `worker.mjs`: `/api/system2/resonance` forwards null marketDate, while pool/operations default to `taipeiMarketDateV0_1(new Date())`.
  - `readLatestResonanceApiV0_1()`: when marketDate is absent, selects `SELECT market_date FROM s2_resonance_latest ORDER BY market_date DESC LIMIT 1`.
  - `terminal_page.mjs::candidateRows()` prefers `S.resonance.symbols` over pool fallback.
  - `selectedRow()`, Decision Workspace, Today Focus and Resonance Center consume these rows without a current-market-date equality guard.
  - UI text says current bounded data is used and stale pool is not reused, so silent prior-session resonance reuse contradicts the stated freshness boundary.
  - Existing tests cover pool freshness but do not protect terminal resonance market-date alignment.
- riskIfUnfixed: Operators may interpret yesterday's or an earlier session's research monitor signal/chart as current-day System 2 monitor evidence. Backend decision/order authority remains false, but the operator-facing stale-state ambiguity can distort situational awareness and invalidate freshness-dependent audit evidence.
- requiredCorrection:
  1. Bind terminal current-session resonance reads to the current Taipei market date, or explicitly reject/mask resonance payloads whose marketDate differs from the terminal's current/pool/operations market date.
  2. Current-session Candidate Board, Decision Workspace, Today Focus and Resonance Center must not consume prior-session resonance rows as active monitor state.
  3. If historical/latest-any-date resonance remains supported by the API, keep it as an explicit historical query behavior and do not silently use it on current-session terminal surfaces.
  4. Add a visible STALE / PREVIOUS_SESSION / NOT_CURRENT_SESSION state if old data is intentionally shown for history/reference; it must not count toward current candidate/monitor counts.
  5. Align `decisionTime`, chart/asOf and displayed marketDate so the user can tell which session the data belongs to.
  6. Add regression tests where today's pool/operations are empty but yesterday has resonance snapshots; the terminal must remain current-session empty/pending rather than display yesterday's rows.
  7. Add regression coverage for same-day payload acceptance and explicit historical-date query behavior.
  8. Preserve resonance formula/state machine, bounded pool freshness semantics, S2-07 candidate authority, strategy logic, ranking/capacity, push/orders, and System1 Formal Core.
- acceptanceCriteria:
  - Current-session terminal never silently displays resonance rows whose marketDate differs from today's Taipei market date/current terminal clock.
  - A prior-session snapshot cannot populate Candidate Board, Decision Workspace, Today Focus or active Resonance Center without an explicit historical/stale presentation state.
  - Same-session resonance remains visible and functional.
  - Pool/operations/resonance dates are either aligned or the mismatch is fail-closed and visible.
  - Regression tests cover prior-session contamination, same-day success and explicit historical-query behavior.
  - No protected strategy/trading authority changes are introduced.
- protectedBoundaries: resonance formula/state machine; bounded-pool freshness logic; S2-07 candidate authority; strategy logic; ranking/capacity; final/live selection authority; notification/push; capital/orders; System1 Formal Core.
- ownerDecisionRequired: false for current-session freshness enforcement; any future cross-session historical replay UI remains separately scoped.
- implementationEvidence:
  - PR #690 merged as `b18457b4de892ed3beb8502155adfdee1a038ca4`.
  - Terminal now computes the current `Asia/Taipei` market date and requests `/api/system2/resonance`, `/api/system2/resonance/pool`, and `/api/system2/resonance/operations` with the same explicit `marketDate`.
  - Terminal performs a second three-way session alignment check; mismatch or missing session provenance yields `SESSION_DATE_MISMATCH` / `SESSION_ALIGNMENT_UNVERIFIED`, clears current selection, and blocks stale/current-state row reuse.
  - Current-session resonance rows must match terminal marketDate, chart marketDate, row updatedAt Taipei date, and chart asOf Taipei date before entering Today Focus, MONITOR-ONLY rows, Decision Workspace, current monitor counts, or active Resonance Center.
  - Decision Workspace now exposes Market Date, Row updatedAt, and Chart asOf while formal candidate remains NOT_AVAILABLE and formal action remains NO_FROZEN_DECISION.
  - `readLatestResonanceApiV0_1` preserves no-date latest-any-date history behavior but marks it `LATEST_AVAILABLE_DATE`; explicit `marketDate` queries are marked `EXPLICIT_MARKET_DATE` with `requestedMarketDate` and `latestAnyDateFallbackUsed` provenance.
  - New `daily_resonance_current_session_freshness_v0_1.test.mjs` proves explicit current-date query does not fall back to prior-session data, explicit historical-date query remains available, and latest-any-date history is visibly marked.
  - Targeted freshness test, institutional terminal test, and existing pool freshness audit all PASS in System2 Research CI run `37472705542` / job `112300052873`.
  - System2 Research CI run `37472705542` PASS and V8 Regression run `37472705541` PASS.
  - System2 Daily Resonance Deploy run `37473038743` PASS: Worker deployed, public read API/UI/schedules verified, Worker version `17a5e3c7-b9ac-4277-aaa4-bfea685b2846`, runtime URL `https://system2-shadow-research.imihan0630.workers.dev`, and System1 production files unchanged PASS.
  - Merged-main System2 Research CI run `37473038918` PASS.
  - Merged-main readback verified explicit current-session queries, stale-row guards, decision time fields, and explicit-vs-latest date-selection semantics; subsequent latest-main drift check showed zero drift across all four correction conflict units.
  - No resonance EMA16/EMA64/Impulse MACD, 0/3–3/3, PROVISIONAL/CONFIRMED/RETRACTED, lifecycle state machine, pool freshness/invalidation, denominator provenance, bounded max-9/fullMarketScan=false, S2-07 candidate authority, strategy logic, ranking/capacity, push/notification, capital/orders, or System1 Formal Core was changed.
- verificationEvidence:
  - Independent AUDIT_LANE re-read latest GitHub main and did not rely on BUILD_LANE's completion claim.
  - PR #690 merged as b18457b4de892ed3beb8502155adfdee1a038ca4 and changed only terminal_page.mjs, daily_resonance_persistence_v0_1.mjs, daily_resonance_current_session_freshness_v0_1.test.mjs, and institutional_terminal_page_v0_1.test.mjs.
  - Terminal now computes the current Asia/Taipei market date and queries resonance, pool, and operations with the same explicit marketDate.
  - Terminal session alignment rejects mismatched/missing source dates and clears current selection; stale or previous-session rows are blocked from current Candidate/Decision/Today Focus/Resonance surfaces.
  - Current-session resonance rows must match terminal marketDate, chart marketDate, row updatedAt Taipei date, and chart asOf Taipei date before they can enter current monitor surfaces.
  - Decision Workspace now exposes Market Date, Row updatedAt, and Chart asOf so session provenance is visible.
  - readLatestResonanceApiV0_1 preserves no-date latest-any-date historical behavior but marks it LATEST_AVAILABLE_DATE; explicit marketDate queries are marked EXPLICIT_MARKET_DATE and do not fall back.
  - Freshness regression proves yesterday-only data does not populate an explicit current-day query, explicit historical-date query remains available, and latest-any-date history remains visibly marked.
  - System2 Research CI run 37472705542 / job 112300052873 PASS.
  - V8 Regression run 37472705541 / job 112300052650 PASS.
  - Merged-main System2 Research CI run 37473038918 / job 112301366833 PASS.
  - System2 Daily Resonance Deploy run 37473038743 / job 112301210286 PASS, including public read API/UI/schedule checks and System1 production-file isolation.
  - From FIX_IMPLEMENTED writeback commit 05084853bbf37669b738f276aea6792d9b0b87f4 through audit time, latest main is identical for all four correction conflict units; zero drift invalidated the fix.
  - No resonance formula/state-machine, bounded-pool freshness semantics, denominator provenance, S2-07 candidate authority, strategy logic, ranking/capacity, notification/push, capital/order behavior, or System1 Formal Core was changed.
  - Independent verification receipt: `system2/evidence/s2_corr_20261006_004_independent_verification.json`
- finalDisposition: VERIFIED_CLOSED — current-session terminal surfaces now fail closed on cross-session resonance date mismatch while explicit historical resonance remains separately queryable; protected strategy/trading authorities remain unchanged.
- verifiedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- verifiedAt: 2026-10-06T21:55:42+08:00
- updatedAt: 2026-10-06T21:55:42+08:00

### S2-CORR-20261006-002 — Institutional terminal converts research-only resonance into ENTER/EXIT action authority

- createdAt: 2026-10-06T19:12:00+08:00
- severity: MEDIUM
- status: VERIFIED_CLOSED
- routingClass: BUILD_LANE
- assignedLane: BUILD_LANE
- assignedRoom: System 2｜建置總控室
- modificationOwner: SYSTEM2_BUILD_CONTROL_ROOM
- blockedBy: none
- affectedScope: S2-16 Candidate Board / Decision Workspace / Today Focus action semantics
- detectedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- canonicalRequirement: Daily Resonance V0.1 is a research/shadow monitoring signal only. User-facing UI must preserve that boundary and must not relabel BUY_RESONANCE / EXIT_RESONANCE as authoritative ENTER / EXIT trading actions unless a distinct frozen-decision authority explicitly supplies such an action.
- observedProblem: `system2/deploy/terminal_page.mjs::actionOf()` maps `BUY_RESONANCE -> ENTER` and `EXIT_RESONANCE -> EXIT`. The resulting labels appear in Candidate Board's 「動作」 column and Decision Workspace's ACTION CARD, while the underlying resonance contract explicitly says BUY_RESONANCE is not validated production BUY authority and runtime read models carry `decisionImpact=false`, `notificationImpact=false`, `orderImpact=false`. The same page also calls these rows `actionable resonance`, creating a user-facing authority overclaim.
- evidence:
  - `SYSTEM2_DAILY_RESONANCE_MONITOR_V0_1.md`: BUY_RESONANCE is a research/shadow candidate signal and is not yet validated production BUY authority.
  - `daily_resonance_monitor_v0_1.mjs`: snapshots state that the output is a research/shadow candidate, not validated production trading authority.
  - `daily_resonance_read_model_v0_1.mjs`, `daily_resonance_worker_cycle_v0_1.mjs`, and related runtime outputs retain `decisionImpact=false`, `notificationImpact=false`, and `orderImpact=false`.
  - `terminal_page.mjs::actionOf`: BUY_RESONANCE returns ENTER; EXIT_RESONANCE returns EXIT.
  - Candidate Board renders this derived value under a column named 「動作」.
  - Decision Workspace renders the same derived value inside an `ACTION CARD`.
  - Today Focus text refers to `actionable resonance`.
  - S2-16 checkpoint says full daily candidate/frozen-decision population remains pending and no final-selection authority is promoted.
- riskIfUnfixed: Operators can reasonably mistake a research monitor signal for an authorized System 2 entry/exit decision. This weakens the separation between monitor evidence, frozen decision, final-selection authority, notification authority and order authority even though backend trading impact remains disabled.
- requiredCorrection:
  1. Stop converting resonance-only `BUY_RESONANCE` / `EXIT_RESONANCE` into bare `ENTER` / `EXIT` actions.
  2. Preserve monitor semantics in user-visible labels, e.g. `BUY_RESONANCE`, `ENTRY_RESONANCE`, `EXIT_RESONANCE`, or another clearly monitor-only wording.
  3. Separate monitor signal from frozen-decision action in Decision Workspace. When no frozen decision exists, the formal action field must remain UNKNOWN / NOT_AVAILABLE / NO_FROZEN_DECISION rather than inheriting resonance ENTER/EXIT.
  4. Candidate Board must not label monitor-only output as authoritative 「動作」 without an explicit research/monitor qualifier; rename or qualify the field if needed.
  5. Replace or qualify `actionable resonance` wording so it cannot be read as live trade authority.
  6. Add regression tests proving resonance-only rows cannot render bare ENTER/EXIT as formal decision authority and that no frozen-decision data means no formal action.
  7. Preserve the underlying resonance formula, BUY_RESONANCE / EXIT_RESONANCE runtime semantics, provisional/confirmed state machine, bounded-pool behavior, and chart markers.
  8. Do not modify strategy logic, assessor policy, strategy preregistration, ranking/capacity, final/live selection authority, notification/push authority, capital/orders, or System 1 Formal Core.
- acceptanceCriteria:
  - Resonance-only BUY_RESONANCE / EXIT_RESONANCE are shown as monitor/research signals, not bare ENTER/EXIT formal actions.
  - Decision Workspace formal action remains explicitly unavailable when no frozen decision exists.
  - Candidate Board clearly distinguishes monitor signal from formal decision/action authority.
  - The terminal contains no user-facing wording that upgrades research resonance into live/validated trading authority.
  - Regression tests fail if resonance-only evidence is again mapped to formal ENTER/EXIT authority.
  - Existing resonance calculations, state machine, read APIs, bounded-pool constraints and protected trading authorities remain unchanged.
- protectedBoundaries: resonance formula/state machine; strategy logic; assessor policy; preregistration; ranking/capacity; final/live selection authority; notification/push; capital/orders; System1 Formal Core.
- ownerDecisionRequired: false for truthful UI semantics only; any future promotion from resonance monitor evidence to formal trading action requires separate validated authority and governance.
- implementationEvidence:
  - PR #673 merged as `36afa057bdc2e88238f5c37b926bea9f821b05d9` after latest-main zero-drift check.
  - Candidate Board now labels the field `監控訊號（RESEARCH）` and preserves `BUY_RESONANCE` / `EXIT_RESONANCE` instead of converting them to bare ENTER / EXIT.
  - Decision Workspace now separates monitor signal from formal frozen-decision action; without frozen decision data the formal action is `NO_FROZEN_DECISION`.
  - `actionable resonance` wording was removed and replaced with research-monitor wording.
  - Targeted `institutional_terminal_page_v0_1.test.mjs` PASS in System2 Research CI run `37458264775` / job `112251116356`.
  - System2 Research CI run `37458264775` PASS; V8 Regression run `37458264777` PASS.
  - Merged-main readback confirms no `actionOf()` mapping, no `return "ENTER"`, no `return "EXIT"`, and separate monitor/formal fields.
  - Daily Resonance runtime files are byte-identical to the pre-fix base: monitor `a39fd428e54ce800600e96d23f178ea024f86d98`, read model `d5989e563c6995a9b8bb5110ce1ee8ab8e4aa4b4`, worker cycle `245044b7878360680854b11fda7f8f221d973d33`.
  - Merged-main System2 Research CI run `37458445915` PASS and System2 Daily Resonance Deploy run `37458445783` PASS.
  - No strategy logic, assessor policy, preregistration, weights, thresholds, ranking, capacity, final/live selection authority, notification/push authority, capital/order, or System1 Formal Core was changed.
- verificationEvidence:
  - Independent audit re-read latest GitHub main and did not rely on BUILD_LANE's completion claim.
  - PR #673 merged as 36afa057bdc2e88238f5c37b926bea9f821b05d9 and changed only system2/deploy/terminal_page.mjs plus system2/tests/institutional_terminal_page_v0_1.test.mjs.
  - Candidate Board now labels the field 監控訊號（RESEARCH） and preserves BUY_RESONANCE / EXIT_RESONANCE monitor semantics instead of converting them to bare ENTER / EXIT.
  - Decision Workspace now separates monitor signal from formal Frozen Decision Action; without frozen decision authority, the formal action remains NO_FROZEN_DECISION.
  - User-facing actionable resonance wording was removed; empty-state wording now refers to research monitor resonance.
  - Targeted terminal regression asserts BUY_RESONANCE stays BUY_RESONANCE, EXIT_RESONANCE stays EXIT_RESONANCE, NO_FROZEN_DECISION remains the formal action, and bare ENTER/EXIT mappings are absent.
  - System2 Research CI run 37458264775 / job 112251116356 PASS.
  - V8 Regression run 37458264777 / job 112251116263 PASS.
  - Merged-main System2 Research CI run 37458445915 / job 112251710622 PASS.
  - System2 Daily Resonance Deploy run 37458445783 / job 112251709625 PASS, including public read API/UI/schedule checks and System1 production-file isolation.
  - Latest-main blob SHAs for daily_resonance_monitor_v0_1.mjs, daily_resonance_read_model_v0_1.mjs and daily_resonance_worker_cycle_v0_1.mjs remain a39fd428e54ce800600e96d23f178ea024f86d98, d5989e563c6995a9b8bb5110ce1ee8ab8e4aa4b4 and 245044b7878360680854b11fda7f8f221d973d33 respectively, matching the pre-fix runtime blobs.
  - From FIX_IMPLEMENTED queue merge c1fb873c9b499e1d5a7f9b5c5e954ab32616198a through audit time, main advanced 41 commits and none touched the correction conflict units; no later drift invalidated the fix.
  - No strategy logic, assessor policy, preregistration, weights, thresholds, ranking, capacity, final/live selection authority, notification/push authority, capital/order behavior, or System1 Formal Core was changed.
  - Independent verification receipt: `system2/evidence/s2_corr_20261006_002_independent_verification.json`
- finalDisposition: VERIFIED_CLOSED — resonance remains research/shadow monitor evidence; the terminal no longer converts it into formal ENTER/EXIT authority, and protected strategy/trading authorities remain unchanged.
- verifiedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- verifiedAt: 2026-10-06T20:54:24+08:00
- updatedAt: 2026-10-06T20:54:24+08:00

### S2-CORR-20261006-001 — Institutional terminal labels unapproved research strategies as SHADOW

- createdAt: 2026-10-06T07:38:30+08:00
- severity: MEDIUM
- status: VERIFIED_CLOSED
- routingClass: BUILD_LANE
- assignedLane: BUILD_LANE
- assignedRoom: System 2｜建置總控室
- modificationOwner: SYSTEM2_BUILD_CONTROL_ROOM
- blockedBy: none
- affectedScope: S2-16 institutional terminal / Strategy Center capability truthfulness
- detectedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- canonicalRequirement: User-facing System 2 surfaces must distinguish implemented Shadow capability from research-only / owner-review-pending strategy concepts. A strategy may not be labeled SHADOW unless its canonical contract/preregistration/readiness actually permits Shadow activation.
- observedProblem: `system2/deploy/terminal_page.mjs` renders `INSTITUTIONAL_ACCUMULATION` and `BLACK_HORSE_ACCUMULATION` with a `SHADOW` status badge. Canonical strategy governance says INSTITUTIONAL_ACCUMULATION remains owner-review pending and must not activate before owner approval; BLACK_HORSE_ACCUMULATION remains a research lane whose distinctness is not proven and is not preregistered as an active Limited Shadow strategy. The terminal therefore overstates operational maturity for two strategy lanes.
- evidence:
  - `SYSTEM2_STRATEGY_CONTRACT_V0.md`: INSTITUTIONAL_ACCUMULATION = owner review pending; BLACK_HORSE_ACCUMULATION = research lane / distinctness not proven.
  - `SYSTEM2_LIMITED_SHADOW_PREREGISTRY_V0_1.md`: INSTITUTIONAL_ACCUMULATION must not activate before owner approval; BLACK_HORSE distinctness is not proven.
  - `SYSTEM2_STRATEGY_PREREGISTRY.md`: BLACK_HORSE is not preregistered as a fourth strategy until distinctness from IA is demonstrated.
  - `SYSTEM2_STRATEGY_SOURCE_READINESS_V0.md`: INSTITUTIONAL_ACCUMULATION machine contract remains blocked by owner-review status; BLACK_HORSE remains research lane.
  - `terminal_page.mjs`: both strategies currently display `<span class="status shadow">SHADOW</span>`.
  - Existing S2-16 checkpoint otherwise claims truthful UNKNOWN / LOCKED presentation and no fake authority.
- riskIfUnfixed: An operator can reasonably interpret SHADOW as an activated Shadow strategy lane, creating false-completion/capability perception and weakening the strategy-version/owner-approval boundary even though no live trading authority is granted.
- requiredCorrection:
  1. Replace the INSTITUTIONAL_ACCUMULATION UI state with a canonical non-active label such as `OWNER REVIEW PENDING` / `NOT ACTIVATED`.
  2. Replace the BLACK_HORSE_ACCUMULATION UI state with `RESEARCH ONLY` / `DISTINCTNESS NOT PROVEN` or equivalent non-active wording.
  3. Do not label either strategy SHADOW until canonical preregistration/owner gates actually permit it.
  4. Add/strengthen terminal regression tests so canonical non-active strategy states cannot silently regress to SHADOW.
  5. Keep existing truthful states for SHORT_MOMENTUM / SWING_GROWTH and other strategy lanes unless canonical evidence says otherwise.
  6. Do not change strategy logic, assessor policy, preregistration, weights, thresholds, ranking, capacity, production push, orders, or System 1 Formal Core.
- acceptanceCriteria:
  - Terminal Strategy Center no longer presents INSTITUTIONAL_ACCUMULATION or BLACK_HORSE_ACCUMULATION as SHADOW.
  - UI wording matches canonical strategy-contract/preregistration/readiness state.
  - Automated tests fail if these two lanes are again rendered as active SHADOW without canonical promotion.
  - No strategy activation or trading authority is introduced by the UI correction.
  - S2-16 read-only/UNKNOWN/LOCKED semantics and System1 isolation remain intact.
- protectedBoundaries: strategy contracts/preregistration; assessor policy; strategy weights/thresholds; ranking/capacity; final/live selection authority; production push; capital/orders; System1 Formal Core.
- ownerDecisionRequired: false for truthful UI labeling only; actual strategy activation remains separately owner/evidence gated.
- implementationEvidence:
  - PR #663 merged as `df25510a602e64d7e2ef08d0241ad9d4dbbb717e` after latest-main no-conflict drift check.
  - Terminal readback on merged main shows INSTITUTIONAL_ACCUMULATION = `OWNER REVIEW PENDING` with explicit not-activated wording.
  - Terminal readback on merged main shows BLACK_HORSE_ACCUMULATION = `RESEARCH ONLY` with distinctness-not-proven / not-activated Limited Shadow wording.
  - SHORT_MOMENTUM and SWING_GROWTH remain `ASSESSOR PENDING`.
  - Targeted `institutional_terminal_page_v0_1.test.mjs` PASS inside System2 Research CI run `37393052475` (job `112042418180`).
  - System2 Research CI run `37393052475` PASS.
  - V8 Regression run `37393052777` PASS.
  - Merged-main regression guards preserve Regime UNKNOWN, Actual Holdings LOCKED, Performance SAMPLE GATED, Event/Industry READ API PENDING, DATA/PIT GATED, `Formal Core: LOCKED`, and `Real orders: DISABLED`.
  - No strategy logic, assessor policy, preregistration, weights, thresholds, ranking, capacity, final/live selection authority, production push, capital/order, or System1 Formal Core was changed.
- verificationEvidence:
  - Independent audit confirmed the canonical handoff on latest main was `FIX_IMPLEMENTED` with independent verification still pending before the AUDIT_LANE transition through `VERIFYING`.
  - Audit base `05cfe0f0fc4b857dc089355f6fccd7a8ec8100f0` was fetched from GitHub main; canonical strategy contract, Limited Shadow preregistry, initial preregistry and source-readiness map all keep INSTITUTIONAL_ACCUMULATION owner-review pending/not activated and BLACK_HORSE_ACCUMULATION research-only with distinctness not proven.
  - PR #663 merged as `df25510a602e64d7e2ef08d0241ad9d4dbbb717e`; its implementation diff changes only `terminal_page.mjs` and `institutional_terminal_page_v0_1.test.mjs`.
  - Latest-main terminal readback renders INSTITUTIONAL_ACCUMULATION as `OWNER REVIEW PENDING` with explicit not-activated wording and contains no SHADOW label inside that strategy card.
  - Latest-main terminal readback renders BLACK_HORSE_ACCUMULATION as `RESEARCH ONLY` with explicit distinctness-not-proven/not-activated Limited Shadow wording and contains no SHADOW label inside that strategy card.
  - SHORT_MOMENTUM and SWING_GROWTH remain `ASSESSOR PENDING`; INDUSTRY_TREND, FUNDAMENTAL_GROWTH and VALUE_REVERSION remain `DATA GATED`; EVENT_DRIVEN remains `PIT GATED`.
  - Independent targeted rerun of `institutional_terminal_page_v0_1.test.mjs` from an isolated `origin/main` archive PASS.
  - PR checks PASS: System2 Research CI `37393052475` / job `112042418180`; V8 Regression `37393052777` / job `112042419105`.
  - Merged-main checks PASS: System2 Research CI `37393144821` and System2 Daily Resonance Deploy `37393144541` on merge SHA `df25510a602e64d7e2ef08d0241ad9d4dbbb717e`.
  - Most recent applicable main System2 Research CI `37401738108` PASS on `af7921f3d7e754b2e9c1ea83212a437d2dea18cd`; subsequent audit-base commits do not touch this correction's System2 conflict units.
  - Physical public terminal readback returned HTTP 200 at 2026-10-06T10:09:52+08:00 and exposed the corrected IA/BLACK_HORSE labels plus unchanged SHORT_MOMENTUM/SWING_GROWTH states.
  - Regime UNKNOWN, Actual Holdings LOCKED, Performance SAMPLE GATED, Event/Industry READ API PENDING, DATA/PIT gates, `Formal Core: LOCKED` and `Real orders: DISABLED` remain present.
  - Seven later main commits changed eight files after the implementation merge, but none touched the terminal/test/canonical strategy conflict units or `Worker.js`; latest-main drift does not invalidate the fix.
  - No strategy activation, assessor policy, preregistration, weights, thresholds, ranking, capacity, live/final-selection authority, production push, capital/order or System1 Formal Core change was introduced.
  - Independent verification receipt: `system2/evidence/s2_corr_20261006_001_independent_verification.json`
- finalDisposition: VERIFIED_CLOSED — the terminal now truthfully distinguishes non-activated IA and BLACK_HORSE research capability from active Shadow status; all protected strategy and trading authorities remain unchanged.
- verifiedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- verifiedAt: 2026-10-06T10:11:33+08:00
- updatedAt: 2026-10-06T10:11:33+08:00

### S2-CORR-20261005-001 — Capacity persistence loses partial-denominator provenance before downstream resonance/performance

- createdAt: 2026-10-05T02:54:16+08:00
- severity: MEDIUM
- status: VERIFIED_CLOSED
- routingClass: REMEDIATION_LANE
- assignedLane: REMEDIATION_LANE
- assignedRoom: System 2｜補強修復室
- modificationOwner: SYSTEM2_REMEDIATION_ROOM
- blockedBy: none
- affectedScope: S2-09 capacity persistence / S2-10 resonance pool provenance / future performance and promotion evidence
- detectedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- canonicalRequirement: A persisted capacity decision must preserve whether its selection denominator was COMPLETE, PARTIAL or UNKNOWN and must be cryptographically/auditably linked to the Shadow run accounting that justified that state. Downstream consumers may monitor clean admissions under partial coverage, but they must not lose the fact that the pool was produced from partial coverage.
- observedProblem: CORR-004 introduced in-memory states such as `CAPACITY_READY_PARTIAL_COVERAGE` and a `selectionDenominator` summary, but `buildCandidateCapacityReceipt` does not include denominator state or contributing Shadow-run provenance in the capacity receipt/hash, and `toCapacityRunRow` therefore does not persist it in `s2_capacity_runs`. The 19:00 resonance path loads only `s2_capacity_runs` and binds its `capacity_hash`; it does not formally join back to `s2_shadow_runs`. Consequently a downstream pool cannot determine from its authoritative source capacity receipt whether it came from complete or partial selection coverage.
- evidence:
  - `candidate_capacity_receipt.mjs`: capacity receipt/hash contains allocation/pool fields but no `selectionDenominator`, coverage state, contributing Shadow run IDs or Shadow accounting hashes.
  - `storage_rows.mjs::toCapacityRunRow`: persists pool/allocation/count fields and `capacity_hash`, but no denominator/provenance link.
  - `s2_shadow_runs` separately persists `eligible_count`, `accounted_count`, `completion_rate`, `state_counts_json`, `unaccounted_symbols_json`, and `symbol_accounts_json`.
  - `daily_shadow_capacity_orchestrator_v0_1.mjs`: partial coverage state exists only in the orchestration return value; a capacity row is still persisted when at least one clean admission exists.
  - `daily_resonance_persistence_v0_1.mjs`: 19:00 reads capacity_run_id / market_date / decision_timestamp / active_assignments_json / capacity_hash / captured_at only.
  - `daily_resonance_integration_v0_1.mjs`: watch-pool identity carries sourceCapacityRunId/sourceCapacityHash but no upstream selection-denominator state or Shadow-accounting linkage.
  - `resonance_comparison_frame_v0_1.mjs`: comparison provenance binds only pool/capacity IDs/hashes, so partial-vs-complete upstream evidence is not visible there either.
- riskIfUnfixed: Ready symbols can be monitored correctly, but downstream UI, performance attribution, replay, comparison and future promotion evidence can treat a partial-coverage capacity pool as if it were based on a complete denominator. This can create false completeness, selection-bias blindness and unverifiable promotion evidence even though the original Shadow run accounting was preserved elsewhere.
- requiredCorrection:
  1. Make capacity persistence explicitly commit to selection-denominator state and provenance.
  2. Persist at least COMPLETE/PARTIAL/UNKNOWN, unresolved counts/states, and immutable linkage to the contributing Shadow run receipt(s) or accounting hash(es).
  3. Include the denominator/provenance payload in the capacity receipt/hash or in an equally immutable linked receipt whose identity is carried by the capacity row.
  4. Propagate the upstream coverage/provenance state into resonance watch-pool provenance so downstream audit/UI/comparison can distinguish COMPLETE from PARTIAL without heuristic clock-only joins.
  5. Preserve CORR-004 behavior: partial coverage with clean admissions remains allowed; INCOMPLETE symbols remain blocked; partial coverage with no selection still must not create a capacity row.
  6. Legacy V0.1 capacity rows that lack denominator provenance must read as UNKNOWN / LEGACY_PROVENANCE_INCOMPLETE, never silently COMPLETE.
  7. Do not introduce a new minimum-coverage percentage or use denominator provenance as an unapproved trading threshold.
  8. Add regression tests showing identical admitted symbols under COMPLETE vs PARTIAL denominator produce distinguishable persisted provenance and downstream pool provenance.
  9. Keep System 1 Formal Core, System 2 live/final-selection authority, production push, capital/order, strategy thresholds and assessor policy unchanged.
- acceptanceCriteria:
  - A persisted new-version capacity run self-describes COMPLETE/PARTIAL/UNKNOWN denominator state or carries an immutable explicit link that resolves it without heuristic joins.
  - Capacity identity/hash commits to denominator provenance directly or through a hash-bound linked receipt.
  - Downstream resonance pool provenance preserves the upstream denominator state/link.
  - PARTIAL capacity with clean admissions remains monitorable and is visibly PARTIAL.
  - PARTIAL no-selection continues to produce zeroPickDay=null and no `s2_capacity_runs`.
  - Legacy rows are UNKNOWN, not assumed COMPLETE.
  - Performance/comparison consumers can distinguish complete vs partial denominator provenance from persisted evidence.
  - No arbitrary coverage threshold or protected trading authority change is introduced.
- protectedBoundaries: System 1 Formal Core; System 2 final/live selection authority; production push/runtime; capital/order; strategy weights/thresholds; assessor policy; CORR-004 UNKNOWN semantics.
- ownerDecisionRequired: false for additive research/provenance hardening; any later use of coverage state as a live admission threshold requires separate evidence/owner decision.
- implementationEvidence:
  - PR #601 implemented this correction and squash-merged to main as `1aa5bc86a4e4b47178b890e70c5542562202e752`.
  - Capacity receipt schema is now `S2_CAPACITY_V0_2`; denominator provenance schema is `S2_SELECTION_DENOMINATOR_PROVENANCE_V0_1`.
  - Capacity provenance preserves `COMPLETE / PARTIAL / UNKNOWN`, unresolved counts/states, blocker codes, contributing Shadow run IDs/strategy versions, canonical `shadowAccountingHash`, optional fingerprint hash and a dedicated provenance hash.
  - `capacityHash` commits to the full denominator provenance. Identical admitted symbols with COMPLETE vs PARTIAL provenance produce distinct immutable capacity identities.
  - New provenance persists inside existing `s2_capacity_runs.counts_json`; physical isolated D1 schema remains V1.1, so no migration/deployment is required.
  - Legacy rows lacking `selectionDenominator` normalize to `UNKNOWN / LEGACY_PROVENANCE_INCOMPLETE`, never COMPLETE.
  - Resonance resolves provenance by exact `source_capacity_run_id + source_capacity_hash` linkage and carries it into pool hash, refresh audit diagnostics, operations API, UI and immutable comparison frames.
  - Regression covers same admissions under COMPLETE vs PARTIAL, legacy UNKNOWN, and unchanged CORR-004 partial-no-selection (`zeroPickDay=null`, `capacityReceipt=null`, no `s2_capacity_runs`).
  - No 80/90/95% coverage threshold or other new admission/trading threshold was introduced.
  - System2 Research CI `37238471951` PASS; V8 Regression `37238471968` PASS on head `b0e8f0b29c8c2d6a23d863d30091252abc519c6d`; latest-main drift was zero before merge.
  - Merged-main readback on `1aa5bc86a4e4b47178b890e70c5542562202e752` confirmed all capacity/resonance/comparison/UI provenance guards and protected boundaries.
- verificationEvidence:
  - Independent audit re-read latest main and the implementation runtime/tests rather than relying on the remediation-room completion claim.
  - PR #601 merged as 1aa5bc86a4e4b47178b890e70c5542562202e752; changed-file scope is limited to System2 capacity/resonance provenance contracts, runtime, UI and tests plus remediation checkpoint.
  - candidate_capacity_receipt.mjs now builds S2_SELECTION_DENOMINATOR_PROVENANCE_V0_1 with COMPLETE/PARTIAL/UNKNOWN, unresolvedCount, unresolvedByState, blockerCodes, contributing Shadow runs, provenanceHash and S2_CAPACITY_V0_2.
  - capacityHash is computed only after selectionDenominator provenance is included in the capacity receipt base; same admissions under COMPLETE vs PARTIAL therefore produce different capacityHash values.
  - daily_shadow_capacity_orchestrator_v0_1.mjs computes canonical shadowAccountingHash from the immutable Shadow run receipt and fails closed on mismatch with an existing fingerprint accounting hash.
  - toCapacityRunRow persists selectionDenominator inside the existing counts_json envelope without D1 schema migration; physical schema remains V1.1.
  - Legacy capacity rows without selectionDenominator normalize to UNKNOWN with LEGACY_PROVENANCE_INCOMPLETE and are never inferred COMPLETE.
  - daily_resonance_persistence_v0_1.mjs reads counts_json/schema_version and active-pool readback links pool to capacity by exact source_capacity_run_id plus source_capacity_hash, not by marketDate/decisionTimestamp heuristic matching.
  - daily_resonance_integration_v0_1.mjs propagates sourceDenominatorState, sourceDenominatorProvenanceHash and full provenance into the watch pool; poolHash commits to those fields.
  - Operations/read API and resonance UI expose upstream/active-pool denominator provenance, and resonance_comparison_frame_v0_1.mjs binds the same provenance into immutable comparison evidence.
  - Regression tests prove identical admitted symbols under COMPLETE vs PARTIAL remain distinguishable by provenanceHash/capacityHash/poolHash, and legacy rows remain UNKNOWN.
  - CORR-004 semantics are preserved: PARTIAL with clean admissions remains monitorable; PARTIAL with no ready selection keeps zeroPickDay=null, capacityReceipt=null and no s2_capacity_runs persistence.
  - No arbitrary 80/90/95 percent or other coverage threshold was introduced and denominator state was not converted into new trading/admission authority.
  - PR #601 formal checks: System2 Research CI 37238471951 PASS; V8 Regression 37238471968 PASS.
  - Evidence closeout PR #602 merged as 282b2b33b2a52ea4fa140acd6c3bc25fdc38b384; System2 Research CI 37238725112 PASS; V8 Regression 37238725105 PASS.
  - From implementation merge through audit time, 102 later main commits changed 75 files but none touched the CORR-20261005-001 core conflict units; no concurrent drift invalidated the verification.
  - Non-blocking hardening observation: downstream normalization validates denominator state/hash shape but does not recompute provenanceHash from counts_json at read time. Current acceptance still passes because new rows are created from a hash-bound receipt and persisted through immutable insert-or-identical semantics; read-time hash recomputation should remain an Audit Watchlist hardening item.
  - Independent verification receipt: `system2/evidence/s2_corr_20261005_001_independent_verification.json`
- finalDisposition: VERIFIED_CLOSED — capacity persistence and downstream resonance/comparison now preserve COMPLETE/PARTIAL/UNKNOWN denominator provenance; protected trading authority remains unchanged.
- verifiedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- verifiedAt: 2026-10-05T09:29:13+08:00
- updatedAt: 2026-10-05T09:29:13+08:00

### S2-CORR-20261004-004 — Whole-universe history/continuity gate can block all Shadow evaluation because of symbol-local UNKNOWNs

- createdAt: 2026-10-04T22:51:00+08:00
- severity: HIGH
- status: VERIFIED_CLOSED
- routingClass: REMEDIATION_LANE
- assignedLane: REMEDIATION_LANE
- assignedRoom: System 2｜補強修復室
- modificationOwner: SYSTEM2_REMEDIATION_ROOM
- blockedBy: none
- affectedScope: S2-07 Daily Shadow preflight / PIT-history readiness / per-symbol UNKNOWN semantics / strategy evaluation / capacity generation
- detectedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- canonicalRequirement: Symbol-local missing history, continuity or required evidence must remain symbol-local INCOMPLETE/UNKNOWN when the source itself is valid. Global fail-closed blocking is reserved for defects that invalidate the whole observation universe or decision clock. System 2 must not turn one symbol's missing data into a universal no-evaluation gate.
- observedProblem: `probePitHistoryCoverageV0_1` reports READY only when historyReadyCount equals the entire current universe and continuityReadyCount equals the entire current universe. `buildDailyShadowInputPreflightV0_1` then requires historyCoverage.state=READY before any strategy evaluation or capacity write is authorized. Therefore one symbol-local history/continuity gap can block all otherwise evaluable symbols. This conflicts with the downstream strategy runtime, which already maps missing required evidence to per-symbol `INCOMPLETE/BLOCKED`, freezes incomplete decisions, and preserves incomplete prior memberships without treating UNKNOWN as negative evidence.
- evidence:
  - `daily_shadow_history_reader_v0_1.mjs`: state becomes HISTORY_COVERAGE_INCOMPLETE when historyReadyCount < currentCount and CONTINUITY_NOT_VERIFIED when continuityReadyCount < currentCount.
  - `daily_shadow_input_preflight_v0_1.mjs`: sourceAndHistoryReady requires historyCoverage.state === READY; otherwise all assessor evaluation/capacity is globally blocked.
  - `strategy_evaluator.mjs`: missing required evidence maps that symbol to strategyValidity=INCOMPLETE and entryReadiness=BLOCKED.
  - `limited_shadow_v0_1.mjs`: INCOMPLETE is a valid frozen decision state rather than a system-wide failure.
  - `SYSTEM2_LIMITED_SHADOW_PREREGISTRY_V0_1.md`: INCOMPLETE / WATCH / REJECTED / QUALIFIED_NOT_SELECTED records must all be frozen; missing REQUIRED evidence is INCOMPLETE + BLOCKED.
  - `daily_shadow_capacity_orchestrator_v0_1.mjs`: prior memberships with INCOMPLETE are preserved but are not active-monitor eligible; non-qualified new candidates are diagnosed rather than globally crashing capacity.
- riskIfUnfixed: A newly listed stock, a symbol-specific missing bar, unresolved corporate-action continuity, or one local provenance gap can indefinitely prevent all S2-07 strategy evaluation and physical `s2_capacity_runs`, producing opportunity starvation and preventing prospective Shadow evidence from accumulating even for clean symbols. This is a critical-path design contradiction rather than a legitimate zero-pick day.
- requiredCorrection:
  1. Separate global infrastructure/source integrity from symbol-level evaluation readiness.
  2. Keep global fail-closed blocking for whole-universe defects such as invalid source date, broken decision clock, source-wide corruption, unreconciled global revision ambiguity, or missing mandatory market-wide source identity.
  3. Convert symbol-local history/continuity/missing-evidence gaps into per-symbol readiness states that flow to `INCOMPLETE/BLOCKED` decisions instead of globally blocking every symbol.
  4. Allow otherwise-ready symbols to proceed through authorized assessor -> frozen decision -> ranking/capacity when their own required evidence is valid.
  5. Preserve complete accounting for every current-universe symbol: evaluated, INCOMPLETE, invalidated, excluded, or otherwise explicitly classified.
  6. Do not invent a new arbitrary market-wide coverage percentage threshold merely to make the pipeline run.
  7. Separate capacity readiness from zero-pick truth. If some symbols remain INCOMPLETE and no ready symbol is selected, do not falsely claim a clean zero-pick day; record partial/incomplete denominator semantics explicitly.
  8. Preserve per-symbol PIT, availableAt, continuity and revision guards. This correction must not downgrade evidence quality or turn UNKNOWN into PASS/0.
  9. Add regression tests for mixed universes: clean symbols + one newly listed/incomplete symbol + one continuity-blocked symbol, proving clean symbols can evaluate while incomplete symbols remain blocked and fully accounted.
- acceptanceCriteria:
  - A symbol-local history/continuity gap no longer forces all otherwise-ready symbols into INPUTS_NOT_READY.
  - Whole-universe/source-integrity failures still fail closed globally.
  - Every symbol remains denominator-accounted with explicit readiness/reason provenance.
  - INCOMPLETE symbols cannot become BUY_ELIGIBLE, ACTIVE_ENTRY_MONITOR, or capacity admissions.
  - Ready symbols can reach authorized Shadow evaluation/capacity without imputing missing evidence for blocked symbols.
  - zeroPickDay is not asserted when denominator completeness required for that claim is unresolved; partial coverage is explicit.
  - No arbitrary coverage threshold is introduced without separate preregistration/evidence.
  - System 1 Formal Core, System 2 production selection authority, live push, capital and orders remain unchanged.
- protectedBoundaries: System 1 Formal Core; System 2 live/final-selection authority; production push/runtime; capital/order; PIT/UNKNOWN semantics; no invented thresholds.
- ownerDecisionRequired: false for restoring canonical per-symbol UNKNOWN semantics in research/shadow; any later production minimum-coverage policy remains separately owner/evidence gated.
- implementationEvidence:
  - PR #585 implemented CORR-004 and squash-merged to main as `b6dd5bff357d6c678825ca212afae6a533da68c8`.
  - `daily_shadow_history_reader_v0_1.mjs` separates aggregate coverage from `globalIntegrityState` and preserves explicit per-symbol readiness/blocker/denominator accounting.
  - `daily_shadow_input_preflight_v0_1.mjs` globally blocks only global A1/history-integrity failures and exposes symbol-local eligible/blocked accounting instead of turning local gaps into `PIT_HISTORY_GLOBAL` blockers.
  - No arbitrary whole-market coverage threshold was added; PIT/provenance/continuity UNKNOWN remains explicit and is not converted to zero/pass/neutral or forward-filled.
  - Prediction Snapshot now distinguishes `CLEAN_ZERO_PICK`, `PARTIAL_COVERAGE_NO_SELECTION`, and denominator-unknown no-selection; `zeroPickDay=null` unless the required no-selection denominator is complete.
  - Capacity allows ready admissions under partial coverage as `CAPACITY_READY_PARTIAL_COVERAGE`, while INCOMPLETE symbols remain blocked and cannot enter active monitor/capacity admission.
  - Partial denominator with no ready admission returns `CAPACITY_PARTIAL_COVERAGE_NO_SELECTION`, `capacityReceipt=null`, and writes no `s2_capacity_runs`, preventing downstream false `ZERO_PICK_ACTIVE`.
  - Mixed-universe regression covers A ready, B insufficient history, C continuity unverified, D required evidence UNKNOWN: A proceeds; B/C/D remain `INCOMPLETE/BLOCKED`; all symbols remain accounted.
  - Global-failure regression verifies source-wide revision ambiguity remains `INPUTS_NOT_READY`, with capacity/zero-pick authorization false.
  - First CI failure (`37223831928`) was an obsolete test expectation for an INCOMPLETE prior membership; second (`37223878523`) was an in-place sort of a frozen test output. Both test issues were corrected without weakening the runtime guard.
  - Final implementation head `7ee02cc98913e79fc981da4d21e39b54b48b4983`: System2 Research CI `37224012433` PASS; V8 Regression `37224012419` PASS.
  - Merged-main readback on `b6dd5bff357d6c678825ca212afae6a533da68c8` confirmed all CORR-004 runtime guards and no 95/90/80% threshold logic.
  - Protected boundaries unchanged: no System 1 Formal Core/runtime, System 2 live/final-selection authority, production push/runtime, capital/order, strategy weight, formal entry/exit threshold, or assessor-policy change.
- verificationEvidence:
  - Independent audit re-read latest main and CORR-004 runtime/tests rather than relying on remediation-room claims.
  - PR #585 is merged as b6dd5bff357d6c678825ca212afae6a533da68c8 and changed only System2 Shadow research runtime/contracts/tests plus remediation checkpoint; no System1 Formal Core/runtime or trading authority file was changed.
  - daily_shadow_history_reader_v0_1.mjs now separates descriptive aggregate coverage from globalIntegrityState and emits per-symbol readinessState, blockerCodes, evaluationInputReady and denominatorAccounted.
  - daily_shadow_input_preflight_v0_1.mjs uses global source/history integrity for global blocking while exposing symbol-local eligible/blocked lists; symbol-local HISTORY/CONTINUITY gaps no longer create PIT_HISTORY_GLOBAL blockers.
  - Mixed-universe regression proves A=ready can proceed while B=insufficient history, C=continuity unverified and D=required evidence UNKNOWN remain INCOMPLETE/BLOCKED, non-admitted and individually accounted.
  - strategy_evaluator missing-required-evidence semantics remain unchanged: symbol-local UNKNOWN cannot become BUY_ELIGIBLE and maps to INCOMPLETE/BLOCKED.
  - Global fail-closed behavior remains present for current-source errors, calendar/clock failures, history-probe/query failures, universe-accounting failures and explicit source-wide/global integrity BLOCKED states.
  - No 95%/90%/80% or other arbitrary market-wide coverage threshold was introduced; readiness remains categorical and provenance-based.
  - daily_shadow_capacity_orchestrator_v0_1.mjs emits CAPACITY_READY_PARTIAL_COVERAGE only when at least one clean symbol is legitimately admitted; INCOMPLETE symbols are not in capacity/active-monitor assignments.
  - Partial denominator with no ready admission returns CAPACITY_PARTIAL_COVERAGE_NO_SELECTION with zeroPickDay=null, capacityReceipt=null and no s2_capacity_runs persistence, preventing a false downstream ZERO_PICK_ACTIVE.
  - Prediction Snapshot independently distinguishes CLEAN_ZERO_PICK, PARTIAL_COVERAGE_NO_SELECTION and DENOMINATOR_UNKNOWN_NO_SELECTION and leaves zeroPickDay=null when denominator completeness is unresolved.
  - Denominator truth is durably preserved in s2_shadow_runs via eligible_count/accounted_count/completion_rate/state_counts_json/unaccounted_symbols_json/symbol_accounts_json and in frozen decisions. The capacity row itself is not self-describing for partial coverage, but this is a non-blocking observability hardening opportunity because denominator evidence is separately immutable at the same decision clock and partial-no-selection writes no capacity row.
  - Final implementation head 7ee02cc98913e79fc981da4d21e39b54b48b4983 passed System2 Research CI 37224012433 and V8 Regression 37224012419.
  - From PR #585 merge through audit time, 23 later main commits did not touch any CORR-004 runtime/test conflict unit; no concurrent drift invalidated the verification.
  - Independent verification receipt: `system2/evidence/s2_corr_20261004_004_independent_verification.json`
- finalDisposition: VERIFIED_CLOSED — symbol-local UNKNOWN/INCOMPLETE no longer globally blocks clean Shadow evaluation; global integrity and denominator-safe zero-pick behavior remain fail-closed.
- verifiedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- verifiedAt: 2026-10-05T02:45:47+08:00
- updatedAt: 2026-10-05T02:45:47+08:00

### S2-CORR-20261004-003 — Correction routing governance contradiction can cause BUILD_LANE to seize work assigned to other lanes

- createdAt: 2026-10-04T20:26:00+08:00
- severity: UNKNOWN
- status: VERIFIED_CLOSED
- routingClass: REMEDIATION_LANE
- assignedLane: REMEDIATION_LANE
- assignedRoom: System 2｜補強修復室
- modificationOwner: SYSTEM2_REMEDIATION_ROOM
- blockedBy: none
- affectedScope: System 2 canonical correction-routing governance / SYSTEM2_MASTER / correction governance semantics / bootstrap-checkpoint-registry consistency / semantic regression guard
- detectedBy: OWNER_HANDOFF_TO_REMEDIATION_LANE
- canonicalRequirement: Execution Lane Governance is authoritative for implementation ownership. Severity is independent from routing. `routingClass / assignedLane / modificationOwner` determine the implementation owner. BUILD_LANE may execute only assigned `LOCAL_FIX / BUILD_LANE` corrections and may not seize DATA_LANE or REMEDIATION_LANE work because severity is HIGH/CRITICAL.
- observedProblem: `SYSTEM2_MASTER.md` still states that CRITICAL/HIGH directives may be implemented by the build/control room. That conflicts with `SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`. `SYSTEM2_CORRECTION_GOVERNANCE_V0_1.md` also retains generic “builder” wording that can blur the distinction between BUILD_LANE and the formally assigned implementation lane.
- evidence:
  - SYSTEM2_MASTER: “CRITICAL/HIGH directives may be implemented by the build/control room”.
  - Execution Lane Governance: severity and routing are independent dimensions.
  - Execution Lane Governance: BUILD executes only LOCAL_FIX / BUILD_LANE items assigned to it.
  - Execution Lane Governance: BUILD must not seize DATA_LANE or REMEDIATION_LANE work merely because it is HIGH.
  - SYSTEM2_CHECKPOINT and ROOM_BOOTSTRAP_REGISTRY already carry the newer assignment semantics.
- riskIfUnfixed: A future BUILD_LANE session can cite the older Master sentence to take modification ownership from DATA_LANE or REMEDIATION_LANE, creating duplicate mutation, merge conflicts, lost evidence or false ownership/closure claims.
- requiredCorrection:
  1. Make Execution Lane Governance the explicit implementation-routing authority in SYSTEM2_MASTER.
  2. Separate severity, routing/assignment and verification authority in canonical wording.
  3. Clarify generic “builder” wording to mean the formally assigned implementation lane, not BUILD_LANE.
  4. Require formal `routingClass / assignedLane / modificationOwner` update before ownership transfer.
  5. Add a semantic regression guard preventing severity from implying BUILD ownership.
  6. Audit canonical bootstrap/checkpoint/registry surfaces for equivalent stale wording.
  7. Apply the separately authorized LOW/LOCAL_FIX documentation sync from “shared 18-domain research” to “22-domain / 354-module” without expanding runtime scope.
- acceptanceCriteria:
  - SYSTEM2_MASTER no longer states or implies CRITICAL/HIGH severity grants BUILD_LANE implementation ownership.
  - Correction Governance distinguishes the assigned implementation lane from BUILD_LANE and preserves independent closure authority.
  - Execution Lane Governance, Master, Checkpoint and ROOM_BOOTSTRAP_REGISTRY agree that BUILD executes only assigned LOCAL_FIX/BUILD_LANE corrections.
  - Ownership transfer requires a formal routing/assignment/modification-owner change.
  - CRITICAL/HIGH assigned implementation lanes may reach FIX_IMPLEMENTED, but the same implementation role cannot self-VERIFIED_CLOSED.
  - Semantic regression guard detects future severity-implies-BUILD wording.
  - SYSTEM2_BUILD_PROGRESS_MAP says 22-domain / 354-module rather than shared 18-domain research.
  - Protected System 1/System 2 trading boundaries remain unchanged.
- protectedBoundaries: System 1 Formal Core; System 2 strategy/ranking/final-selection; capital/order; production push; production runtime.
- ownerDecisionRequired: false
- implementationEvidence:
  - Owner explicitly assigned S2-CORR-20261004-003 to REMEDIATION_LANE while latest main did not yet contain the directive; the queue record materializes that owner handoff without inventing a severity classification.
  - Repo-wide canonical scan found the direct contradiction only in SYSTEM2_MASTER and ambiguous generic “builder” wording in SYSTEM2_CORRECTION_GOVERNANCE_V0_1; SYSTEM2_CHECKPOINT and ROOM_BOOTSTRAP_REGISTRY already carried the correct assignment-gated semantics.
  - SYSTEM2_MASTER now states that severity does not grant implementation ownership; `routingClass / assignedLane / modificationOwner` determine the mutation owner; BUILD_LANE may implement only formally assigned `LOCAL_FIX / BUILD_LANE` corrections.
  - SYSTEM2_MASTER now requires a formal Correction Queue routing/assignment/modification-owner update before implementation ownership can transfer between rooms.
  - SYSTEM2_CORRECTION_GOVERNANCE_V0_1 now uses “formally assigned implementation lane” for HIGH implementation and FIX_IMPLEMENTED semantics, separates severity / implementation ownership / verification authority, and prohibits chat-based self-seizure of another lane's conflict unit.
  - CRITICAL/HIGH independent closure semantics remain intact: an assigned implementation lane may reach FIX_IMPLEMENTED, but the same implementation role cannot advance directly to VERIFIED_CLOSED.
  - SYSTEM2_BUILD_PROGRESS_MAP LOW/LOCAL_FIX drift corrected from `shared 18-domain research` to `shared 22-domain / 354-module research` only; no research/runtime authority changed.
  - Added `system2/tests/correction_routing_governance_semantics.test.mjs` to guard Master, Correction Governance, Execution Lane Governance, System2 Checkpoint, Room Bootstrap Registry and Build Progress Map against future severity-implies-BUILD drift.
  - PR #556 initial implementation head `5fc3b9c43ea0f79fe6fa5b714dae53d868ab69f2`: System2 Research CI `37202451095` PASS (20:32:36 Asia/Taipei); V8 Regression `37202451081` PASS (20:33:00 Asia/Taipei).
  - PR #556 changed-file scope is governance/documentation/test only; no production/runtime/trading logic file is changed.
  - Latest-main drift check before evidence finalization: base `d199a70b14dc56374a5f51433ee5648b5ae6ce7d` remained current; no concurrent conflict-unit drift was present.
  - Final PR #556 head `fcfabf757a0b3b5eb1241037a92bebb800ac89d4`: System2 Research CI `37202660117` PASS; V8 Regression `37202660107` PASS; mergeable=true immediately before merge.
  - PR #556 squash-merged to main as `f507b9a8714e53f9bf42235cb70824a545ffefae`.
  - Merged-main readback confirmed: stale Master severity-implies-BUILD sentence absent; severity / implementation ownership / verification authority split present; BUILD anti-seizure rules preserved in Execution Lane Governance, System2 Checkpoint and Room Bootstrap Registry; Build Progress Map reports `22-domain / 354-module`.
- verificationEvidence:
  - Independent audit re-read latest main before closure and did not rely solely on the remediation-room completion claim.
  - SYSTEM2_MASTER no longer contains the stale rule that CRITICAL/HIGH directives may be implemented by the build/control room; it now states that severity does not grant implementation ownership.
  - SYSTEM2_CORRECTION_GOVERNANCE_V0_1 explicitly separates severity, implementation ownership and verification authority, and binds mutation ownership to routingClass / assignedLane / modificationOwner.
  - SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1 still requires BUILD_LANE to execute only assigned LOCAL_FIX / BUILD_LANE items and forbids seizing DATA_LANE / REMEDIATION_LANE work merely because severity is HIGH.
  - SYSTEM2_CHECKPOINT and ROOM_BOOTSTRAP_REGISTRY retain the same assignment-gated BUILD_LANE semantics.
  - Ownership transfer now requires formal Correction Queue routingClass / assignedLane / modificationOwner changes before mutation; chat-based self-seizure is prohibited.
  - CRITICAL/HIGH independent closure semantics remain intact: the assigned implementation lane may reach FIX_IMPLEMENTED but the same implementation role cannot self-VERIFIED_CLOSED.
  - The semantic regression test system2/tests/correction_routing_governance_semantics.test.mjs directly guards Master, Correction Governance, Execution Lane Governance, Checkpoint, Room Bootstrap Registry and the research-universe wording.
  - PR #556 changed governance/documentation/test surfaces only and did not modify System1 Formal Core, System2 strategy/ranking/final-selection, capital/order, production push or production runtime.
  - PR #556 final head fcfabf757a0b3b5eb1241037a92bebb800ac89d4: System2 Research CI 37202660117 PASS and V8 Regression 37202660107 PASS.
  - Build Progress Map now uses shared 22-domain / 354-module research and the obsolete shared 18-domain wording is absent from canonical progress state.
  - Superseded audit-opening PR #554 was confirmed never merged and was closed during independent audit to prevent stale duplicate queue mutation.
  - CORR-003 severity remains UNKNOWN because canonical main never received the earlier unmerged MEDIUM classification; this explicit UNKNOWN does not affect the repaired routing semantics or closure evidence.
  - Independent verification receipt: `system2/evidence/s2_corr_20261004_003_independent_verification.json`
- finalDisposition: VERIFIED_CLOSED — routing-governance contradiction corrected; BUILD_LANE remains assignment-gated and severity does not grant cross-lane mutation ownership.
- verifiedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- verifiedAt: 2026-10-04T20:52:58+08:00
- updatedAt: 2026-10-04T20:52:58+08:00

### S2-CORR-20261004-002 — POSITION_MONITOR target behavior is presented as current operational capability

- createdAt: 2026-10-04T16:30:15+08:00
- severity: MEDIUM
- status: VERIFIED_CLOSED
- routingClass: REMEDIATION_LANE
- assignedLane: REMEDIATION_LANE
- assignedRoom: System 2｜補強修復室
- modificationOwner: SYSTEM2_REMEDIATION_ROOM
- blockedBy: none
- affectedScope: System 2 position-management documentation / storage/runtime capability state / UI-readiness semantics
- detectedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- canonicalRequirement: Canonical documentation must distinguish approved target architecture from physically implemented/runtime-verified capability. Actual holdings must not be claimed as continuously monitored unless an authorized actual-holdings source, reconciliation path, persistence/runtime behavior and evidence exist.
- observedProblem: SYSTEM2_MASTER and SYSTEM2_ARCHITECTURE state in present tense that actual holdings are continuously monitored in a dedicated POSITION_MONITOR. SYSTEM2_CHECKPOINT describes the position-management architecture as owner-approved with exact thresholds still unfrozen. SYSTEM2_STORAGE_SCHEMA defines s2_positions as System 2 virtual positions only and explicitly not V8 live holdings. Repository search found candidate lifecycle and resonance reads of virtual s2_positions, but no complete authorized actual-holdings ingestion/reconciliation runtime contract or physical evidence that user actual holdings are continuously monitored by System 2.
- evidence:
  - SYSTEM2_MASTER: "Actual holdings are continuously monitored in a dedicated POSITION_MONITOR".
  - SYSTEM2_ARCHITECTURE: "Existing positions are continuously monitored in POSITION_MONITOR".
  - SYSTEM2_CHECKPOINT: position-management architecture is owner-approved; exact thresholds remain unfrozen pending Shadow validation.
  - SYSTEM2_STORAGE_SCHEMA: s2_positions = System 2 virtual positions only; never V8 live holdings.
  - Existing runtime references query s2_positions for simulated/open System 2 position lifecycle; no complete actual-holdings source/reconciliation runtime was found in the bounded audit.
- riskIfUnfixed: The owner and downstream modules can mistake a future architecture invariant for a currently operational capability, causing false-completion claims, UI mislabeling, or later position/capital research to assume actual holdings provenance that does not exist.
- requiredCorrection:
  1. Reconcile canonical wording so target architecture, virtual/simulated position support and physically operational actual-holdings monitoring are separate states.
  2. Define the authorized source/reconciliation contract required before System 2 may call a position "actual holding".
  3. Ensure storage/API/UI/runtime cannot relabel s2_positions virtual positions as actual holdings.
  4. If an actual-holdings adapter already exists under another path, surface its exact provenance, tests and physical readback instead of duplicating it.
  5. Add explicit readiness state such as TARGET_ONLY / VIRTUAL_POSITION_READY / ACTUAL_HOLDINGS_SOURCE_NOT_WIRED / ACTUAL_POSITION_MONITOR_VERIFIED.
- acceptanceCriteria:
  - SYSTEM2_MASTER, SYSTEM2_ARCHITECTURE, POSITION_MANAGEMENT contract, storage schema and build/progress surfaces describe the same capability state.
  - Virtual/simulated positions remain distinguishable from owner actual holdings.
  - No UI/API/runtime claims actual holdings are monitored unless actual-holdings source + reconciliation + physical evidence are present.
  - Any future actual-holdings source preserves fill/quantity/cost/reconciliation provenance and does not silently import System 1/V8 holdings without explicit authorization.
  - System 1 Formal Core, capital/order behavior and production monitoring remain unchanged.
- protectedBoundaries: System 1 Formal Core; System 1 holdings/runtime; System 2 capital/order authority; production push; no inferred fills/holdings.
- ownerDecisionRequired: false for semantic reconciliation and research-only readiness contract; true later if a protected shared/live holdings integration is proposed.
- implementationEvidence:
  - REMEDIATION_LANE accepted ownership on latest main, corrected the stale idle remediation checkpoint, and restricted conflict ownership to canonical position-readiness surfaces plus one semantic regression test.
  - Bounded repository audit found no complete authorized System 2 actual-holdings adapter/reconciliation/readback chain. Current runtime evidence is virtual-only: candidate lifecycle enforces `SIM_FILLED -> POSITION_MONITOR`; daily resonance persistence reads open `s2_positions`; MVP status explicitly says simulated open positions supply HOLD semantics and no real position/order is created.
  - Canonical readiness is now separated across MASTER / ARCHITECTURE / POSITION_MANAGEMENT / STORAGE_SCHEMA / BUILD_PROGRESS / CHECKPOINT / UI / candidate lifecycle/capacity / strategy identity: `TARGET_ONLY`, `DESIGN_APPROVED`, `VIRTUAL_POSITION_READY`, `ACTUAL_HOLDINGS_SOURCE_NOT_WIRED`, `ACTUAL_POSITION_MONITOR_VERIFIED=false`.
  - `s2_positions` is explicitly guarded as virtual/simulated only. Quantity/cost in that table are simulation accounting, not broker ownership evidence. The schema forbids overloading it with actual holdings.
  - Actual-holding labels are fail-closed: a future authorized integration must preserve source/account scope, as-of time, reconciled quantity, cost only when sourced, confirmed-fill provenance where used, ownership provenance, reconciliation/UNKNOWN state, and durable persistence/readback.
  - Signal/trigger prices, suggested/requested shares, plan snapshots, candidate state and simulated fills are explicitly insufficient to establish actual ownership. System 1/V8 holdings cannot be silently imported.
  - Institutional UI contract now requires virtual positions to be labeled SIMULATED / VIRTUAL and forbids populating an owner actual-holdings board while `ACTUAL_POSITION_MONITOR_VERIFIED=false`.
  - Added `system2/tests/position_monitor_capability_semantics.test.mjs` to prevent regression back to false operational claims and to bind docs to current runtime/storage evidence.
  - First System2 Research CI attempt failed only because the new test regex incorrectly flagged the explicit prohibition sentence itself; the guard was corrected to assert required fail-closed wording rather than word proximity.
  - Corrected PR head `67151b901029b17b567cf1f29b4a74c349460996`: System2 Research CI run `37197332296` PASS; V8 Regression run `37197332187` PASS.
  - Final PR #536 head `d0f97bded1e88965d75b9db804cc5264e1220ebe`: System2 Research CI `37197495890` PASS; V8 Regression `37197495893` PASS; mergeable=true before merge.
  - PR #536 squash-merged to `main` as `0774a356377efc6892e72bf60c202561d227e47b`; merged-main readback preserved `FIX_IMPLEMENTED`, virtual-only storage truth, and `ACTUAL_POSITION_MONITOR_VERIFIED=false`.
  - Changed-file scope contains only System 2 canonical documentation, correction/checkpoint state and the new System 2 semantic test; no System 1 Formal Core, System 1 holdings/runtime, capital/order logic or production push file is modified.
  - Remaining UNKNOWN / future gate: no actual-holdings source is wired or physically verified. Any broker-holdings or System 1 shared-holdings integration remains `OWNER_DECISION_REQUIRED` and is not implemented by this correction.
- verificationEvidence:
  - Independent audit re-read latest main before closure (audit branch base 4b988fbb762bc5ada1b1c7d6651ad6bcc217e549) rather than relying on the remediation-room completion claim.
  - Canonical Master/Architecture/Position Management/Storage/Build Progress/Checkpoint/UI/candidate lifecycle/capacity/strategy identity surfaces consistently separate TARGET_ONLY / DESIGN_APPROVED / VIRTUAL_POSITION_READY / ACTUAL_HOLDINGS_SOURCE_NOT_WIRED / ACTUAL_POSITION_MONITOR_VERIFIED=false.
  - Latest-main search confirms the former misleading present-tense operational claims are absent from live capability statements. Remaining exact phrase occurrences are confined to correction history, explicit prohibitions/negative assertions, or the semantic regression test.
  - SYSTEM2_STORAGE_SCHEMA explicitly keeps s2_positions virtual/simulated only, forbids overloading it with actual holdings, and requires owner-authorized provenance/reconciliation before any future actual-holdings store/adapter.
  - Candidate lifecycle and current runtime evidence remain virtual-only: SIM_FILLED -> POSITION_MONITOR and resonance persistence reads s2_positions; this is not relabeled as owner actual holdings.
  - Institutional UI contract requires SIMULATED / VIRTUAL labels and forbids populating an owner actual-holdings board while ACTUAL_POSITION_MONITOR_VERIFIED=false.
  - PR #536 changed only System 2 canonical docs/state plus system2/tests/position_monitor_capability_semantics.test.mjs; no System 1 file was changed. PR #540 changed only the correction queue MD/JSON and remediation checkpoint.
  - PR #536 System2 Research CI 37197495890 PASS and V8 Regression 37197495893 PASS. PR #540 System2 Research CI 37197938887 PASS and V8 Regression 37197938899 PASS.
  - Protected boundaries remain intact: no System1 Formal Core/holdings/runtime mutation, no capital/order authority, no production push, and no inferred actual fills/holdings.
  - Residual limitation is explicit and acceptable for this correction: no actual-holdings source/reconciliation/runtime is wired or physically verified. Any future broker or System1 shared-holdings integration remains OWNER_DECISION_REQUIRED.
  - Independent verification receipt: `system2/evidence/s2_corr_20261004_002_independent_verification.json`
- finalDisposition: VERIFIED_CLOSED — capability-state mismatch corrected; actual owner-holdings monitoring remains NOT WIRED / NOT VERIFIED and is outside this closure.
- verifiedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- verifiedAt: 2026-10-04T19:30:03+08:00
- updatedAt: 2026-10-04T19:30:03+08:00

## Next action

When the independent correction auditor identifies a material issue, append the directive here and update the JSON companion in the same change.


## S2-CORR-20261006-003 — VERIFIED_CLOSED

Independent verification:
- receipt: `system2/evidence/s2_corr_20261006_003_independent_verification.json`;
- implementation merge: `fa9c433cf84d61f400c935cbd70019c7c9d39878`;
- System2 Research CI `37469475340` PASS;
- V8 Regression `37469475238` PASS;
- merged-main System2 Research CI `37469704138` PASS.

Verified boundaries:
- formal Candidate Board remains pending/empty until an authorized S2-07 candidate source exists;
- resonance/pool rows are visibly segregated as MONITOR_ONLY;
- monitor strategy provenance is not formal candidate strategy authority;
- unresolved provenance is not promoted to a formal strategy identity;
- Decision Workspace keeps formal candidate state NOT_AVAILABLE and formal action NO_FROZEN_DECISION;
- no strategy/ranking/capacity/final-selection/push/order/System1 Formal authority changed.

Final disposition:
`VERIFIED_CLOSED`.

This closure does not resolve `S2-CORR-20261006-004`, which is a separate current-session date-alignment defect.


## S2-CORR-20261007-001 — FIX_IMPLEMENTED / MEDIUM / DATA_LANE

- 2026-10-08 DATA_LANE code fix: PR #887 merged to `main` as `2e27483d586c52e15d8f1b288fdf5da5c4638e24`.
- System2 Research CI / V8 regression PASS; latest main read-only preflight PASS.
- Shared Stage-1 canonical primary/exact-date source selector now drives prospective A1 collector; earliest READY uses actual post-source observation bound.
- Original 13-file V0.3 freeze preserved; distinct 15-file V0.4 epoch preregistered, old/new observation histories cannot pool.
- Durable evidence: `system2/evidence/S2_CORR_20261007_001_A1_SHARED_SOURCE_SELECTION_V0_4_IMPLEMENTATION_20261008_V0_1.json`.
- **Still pending:** future trading-date real exact-date fallback physical proof and independent AUDIT_LANE verification. This is **not** VERIFIED_CLOSED.


- title: Prospective Decision Clock A1 collector diverges from Stage-1 exact-date source path
- detectedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- affectedScope:
  - System2 prospective Decision Clock / source-arrival evidence collector;
  - A1 first-READY timing measurement;
  - source-selection contract consistency between research clock evidence and Stage-1 ingestion.
- canonicalRequirement:
  Prospective Decision Clock/source-arrival evidence must measure the same versioned source-selection semantics used by the current Stage-1 A1 ingestion path, or explicitly document and justify a different contract. A stale/non-JSON latest OpenAPI response must not be misclassified as market-wide A1 unavailability when the authorized exact-date official path is READY. Prospective firstReadyAt/availableAt must remain actual observed upper bounds.
- observedProblem:
  - prospective clock run `37577209442` exhausted 30 attempts under latest-OpenAPI-only `official_source_probes.mjs` semantics;
  - later scheduled Daily Shadow Diagnostic run `37609474459` physically proved the current Stage-1 A1 ingestion path READY on 2026-10-07 by using the already-implemented exact-date official fallback;
  - TWSE primary remained on 2026-10-06, then `A1_TWSE_MI_INDEX_EXACT_DATE_PROSPECTIVE` succeeded for 2026-10-07 with 1,086 normalized ordinary rows;
  - TPEx primary returned HTTP 200 / `NON_JSON_RESPONSE`, then `A1_TPEX_DAILY_QUOTES_EXACT_DATE_PROSPECTIVE` succeeded for 2026-10-07 with 887 normalized ordinary rows;
  - total Stage-1 A1 symbol count = 1,973; preflight `capacityWriteAuthorized=true`; prospective history readback and immutable D1 readback both verified;
  - strategy evaluation remained diagnostic-only and capacity was not produced, so the remaining downstream gap is not an A1 acquisition failure.
- evidence:
  - Daily Shadow Diagnostic run `37609474459` (#22): SUCCESS on head `4854ca2a00b1d8536ad26cbb07c73b7e84109cf2`;
  - artifact `11476921489`, digest `sha256:fcce5882ba1a49a9c50e1523d65ed351c5dd5c850db4e292dd2de6cde126fa91`;
  - `prospectiveHistory=PROSPECTIVE_HISTORY_READBACK_VERIFIED`, rowCount `1973`, persistence `IMMUTABLE_D1_READBACK_VERIFIED`;
  - durable reclassification evidence: `system2/evidence/S2_CORR_20261007_001_SCOPE_RECLASSIFICATION_20261007_V0_1.json` @ `30d1e3e01f137495e1018d2a8c01bbcf766fc05f`;
  - previous run `37577209442` and all earlier source-readback evidence remain preserved as collector-failure provenance.
- riskIfUnfixed:
  Prospective clock/source-arrival research can understate same-day A1 readiness and bias first-ready latency evidence relative to the real Stage-1 source path. Current evidence does NOT show that this divergence blocks Stage-1 ingestion itself.
- requiredCorrection:
  1. Reuse one versioned A1 source-selection contract between prospective source-arrival measurement and Stage-1 ingestion, or explicitly version intentional differences.
  2. When latest OpenAPI is stale or HTTP-200/non-JSON, allow the already-validated exact-date official path to be measured without hiding source identity or timing.
  3. Preserve primary/fallback identities, failure reason, source-date evidence, row coverage and actual observed first-ready time.
  4. Never reuse historical `SESSION_CLOSE_FINALITY` as prospective firstKnownAt/availableAt.
  5. Add real-trading-date physical evidence for stale/non-JSON primary with exact-date source READY.
  6. Do not change strategy/ranking/final-selection/push/capital/order/System1 authority.
- acceptanceCriteria:
  - collector and Stage-1 source selection are contract-consistent or intentionally version-separated with explicit rationale;
  - a real trading-date stale/non-JSON-primary case records A1 READY when the exact-date official source is genuinely READY;
  - firstReadyAt remains the actual prospective observation upper bound;
  - UNKNOWN/transport/source-date/schema failures remain fail-closed and source-honest;
  - System1 Formal Core and System2 final-selection/live-push/capital/order authority remain unchanged.
- routingClass: DATA_LANE
- assignedLane: DATA_LANE
- assignedRoom: System 2｜歷史資料工程室
- modificationOwner: SYSTEM2_HISTORICAL_DATA_ROOM
- ownerDecisionRequired: false
- blockedBy: null
- implementationEvidence: []
- verificationEvidence: []
- finalDisposition: PENDING
- updatedAt: 2026-10-07T19:16:52+08:00

### S2-CORR-20261007-001 independent secondary-source diagnosis

00 performed a second read-only diagnostic channel after the terminal prospective run. This evidence is diagnostic only and does not substitute for the canonical prospective collector.

- TWSE `STOCK_DAY_ALL`:
  - HTTP 200;
  - content type `application/json`;
  - complete valid JSON;
  - 1,381 rows;
  - observed date remained `1151006` = 2026-10-06.
  - Interpretation: at that observation, TWSE failure class is genuine target-date publication/readiness lag, not JSON transport failure.

- TPEx `tpex_mainboard_daily_close_quotes`:
  - HTTP 200;
  - content type `application/json`;
  - complete valid JSON;
  - approximately 4.67 MB / 12,245 rows;
  - observed date `1151007` = 2026-10-07.
  - Interpretation: current-day TPEx data did exist by the later observation; earlier GitHub-runner `NON_JSON_RESPONSE` events are consistent with transient acquisition/body-integrity failure, not absence of current-day publication.

- Official TWSE E-shop states its daily-closing product is produced approximately at 14:00, 15:30 and 17:30 each trading day.
  - This does NOT prove the exact free `STOCK_DAY_ALL` OpenAPI endpoint follows the same publication schedule.
  - It DOES prohibit treating a collector that exhausts before 17:30 as proof of end-of-day source unavailability.

Correction consequence:
- TWSE: prioritize later observation/finality semantics; retries alone cannot turn a genuinely prior-date payload into current-date data.
- TPEx: test bounded fail-closed acquisition/body-completeness retry while retaining target-date/schema/coverage/PIT guards.
- Do not apply one undifferentiated transport fix to both failure classes.



### 2026-10-07 16:54 independent live source readback

- TWSE `STOCK_DAY_ALL`: HTTP 200 / `application/json`; observed payload date remained `1151006` (2026-10-06). At this observation, target-date 2026-10-07 was still not published on this endpoint. This is source-readiness lag, not JSON transport failure.
- TPEx `tpex_mainboard_daily_close_quotes`: HTTP 200 / `application/json`; observed date `1151007` (2026-10-07) was present, but the independent Firecrawl client reported a truncated body / invalid complete JSON. This is diagnostic evidence of acquisition/body-integrity variability; it does not prove source absence.
- Consequence: keep TWSE publication-lag handling separate from TPEx bounded body/transport recovery. Do not solve both with one undifferentiated retry rule, and do not weaken target-date/schema/PIT checks.

### 2026-10-07 18:43 independent late-session source readback

- TWSE `STOCK_DAY_ALL`: HTTP 200 / `application/json`; payload date still `1151006` (2026-10-06). For this endpoint, 2026-10-07 remained genuinely NOT_READY at this observation.
- TPEx `tpex_mainboard_daily_close_quotes`: payload date `1151007` (2026-10-07) was visible. Firecrawl warned that the page was too long to process in full; therefore Firecrawl truncation is a client/tool processing limitation and must NOT be cited as proof that the official TPEx response itself was truncated.
- Consequence: canonical collector must independently establish complete-body parse integrity. TWSE publication lag and TPEx acquisition/body-integrity handling remain separate failure classes.

### 2026-10-07 18:43 alternate official A1 source diagnosis

- TWSE `STOCK_DAY_ALL` still exposed `1151006`, but official `MI_INDEX?date=20261007&type=ALLBUT0999` simultaneously returned HTTP 200 / JSON / `stat=OK` with an explicit 2026-10-07 daily-close table. Therefore the market's current-day official close data existed; the current prospective endpoint was lagging.
- TPEx official `afterTrading/dailyQuotes?date=2026/10/07` simultaneously returned HTTP 200 / JSON with explicit 2026-10-07 success and per-stock daily-close rows. This is already System 2's accepted historical A1 primary source for TPEx.
- Repository readback confirms TWSE `MI_INDEX` and TPEx `dailyQuotes` historical A1 parsers already enforce requested-date matching, ordinary-symbol uniqueness, OHLC integrity and normalized RAW fields.
- Important PIT boundary: historical receipts explicitly state `historicalPublicationTimestampProven=false`. Their fixed `SESSION_CLOSE_FINALITY` availableAt is historical replay semantics, NOT proof of prospective publication time and must not be backdated into firstKnownAt.
- Required repair direction: evaluate a versioned prospective A1 contract over these already-validated official one-date sources; prove same-date canonical-field / ordinary-symbol coverage equivalence before switching/fallback; collect actual first-READY timestamps on future real trading dates; preserve fail-closed date/schema/PIT guards.

### S2-CORR-20261007-002 — Global Decision Clock over-gates SHORT_MOMENTUM with unrelated B2/A5 dependencies

- createdAt: 2026-10-07T16:40:34+08:00
- severity: HIGH
- status: REJECTED_WITH_EVIDENCE
- routingClass: BUILD_LANE
- assignedLane: BUILD_LANE
- assignedRoom: System 2｜建置總控室
- modificationOwner: SYSTEM2_BUILD_CONTROL_ROOM
- blockedBy: NONE
- affectedScope:
  - System2 Stage-1 Decision Clock / prospective readiness;
  - SHORT_MOMENTUM first-launch path;
  - strategy-specific source dependency semantics;
  - physical NC-T01 S22-T13 and downstream capacity eligibility.
- detectedBy: 00_RESEARCH_AUDIT_CONTROL
- canonicalRequirement:
  Launch-critical readiness must be evaluated against the frozen strategy/stage dependency contract. A global source gate must not require source families that the strategy does not consume merely because another strategy needs them. UNKNOWN/missing strategy-irrelevant sources must not globally suppress an otherwise truthfully evaluable strategy.
- observedProblem:
  Current global Decision Clock computes `sameSessionClockReady` / `candidateTimestamp` from A1 TWSE + A1 TPEx + B2, and also requires A5 availability by the candidate boundary for global `requiredReady`. Latest frozen Stage-1 semantics state that SHORT_MOMENTUM launch-required families are TECHNICAL_STRUCTURE + PRICE_VOLUME + RISK_FRICTION; MARKET_REGIME is not a launch-required family, and B2 INDUSTRY_THESIS plus A5 FUNDAMENTAL evidence belong to SWING_GROWTH / other dependency lanes. D16 already records `GLOBAL_REQUIRED_SET != SHORT_MOMENTUM_NON_INCOMPLETE_REQUIRED_SET`. Therefore the global clock can keep SHORT_MOMENTUM blocked for a source family it does not require, defeating the approved single-independent-strategy Stage-1 path.
- evidence:
  - `system2/SYSTEM2_DECISION_CLOCK_EVIDENCE_AGGREGATION_V0_1.md`: candidate timestamp uses A1 TWSE + A1 TPEx + B2 and then enforces A5 by candidate boundary;
  - `system2/runtime/decision_clock_daily_evidence.mjs`: B2 participates directly in `sameSessionClockReady`;
  - `research/D16_STRATEGY_STAGE_CLOCK_DEPENDENCY_AUDIT_V0_1.md`: explicitly freezes `GLOBAL_REQUIRED_SET != SHORT_MOMENTUM_NON_INCOMPLETE_REQUIRED_SET`;
  - `research/D18_POLICY_ONLY_VS_REGIME_EVIDENCE_BOUNDARY_20261007_V0_1.md`: SHORT_MOMENTUM launch policy does not require MARKET_REGIME; SWING_GROWTH requires PIT-valid INDUSTRY_THESIS + FUNDAMENTAL_QUALITY;
  - `system2/SYSTEM2_STAGE1_ASSESSOR_POLICY_FREEZE_V0_1.md`: frozen Stage-1 per-strategy assessor policies;
  - 2026-10-07 terminal prospective run `37577209442`: A5 coverage true / B2 false / global requiredReady false, demonstrating the practical over-gating risk;
  - Project dynamic-priority governance explicitly allows a single genuinely independent launch strategy to satisfy Stage-1 before a second strategy is ready.
- riskIfUnfixed:
  Even after A1 is physically READY and #762 / NC-T01 are resolved, SHORT_MOMENTUM can remain globally blocked by B2 or A5 despite not requiring them. This would create artificial opportunity starvation, make the single-strategy launch path non-executable, and conflate one strategy's missing thesis evidence with another strategy's readiness.
- requiredCorrection:
  1. Preserve the existing global cross-strategy Decision Clock artifact for the estimand/use-cases that genuinely require A1+B2+A5; do not retroactively reinterpret its historical evidence.
  2. Add or expose a strategy/stage dependency-aware readiness evaluation for Stage-1 execution instead of weakening the global artifact in place.
  3. SHORT_MOMENTUM readiness may depend only on its frozen strategy/stage required inputs plus universal source/PIT/session/integrity safeguards.
  4. SWING_GROWTH must continue to fail closed on missing B2 INDUSTRY_THESIS / A5-derived FUNDAMENTAL_QUALITY as required; no source may be imputed or dropped merely to create picks.
  5. Preserve explicit per-strategy candidate/readiness clocks and immutable dependency identities; no favorable rerun/cherry-picking.
  6. Do not authorize different economic thresholds, ranking weights, selection policy, final-selection, push, capital or orders as part of this correction.
  7. Add regression tests proving: B2/A5 missing can block SWING_GROWTH while a clean SHORT_MOMENTUM instance remains evaluable; missing A1 still blocks SHORT_MOMENTUM; universal integrity/PIT failures still fail closed for every strategy.
  8. Physical acceptance requires a real trading-date prospective receipt showing strategy-specific readiness semantics; synthetic tests alone are insufficient.
- acceptanceCriteria:
  - strategy/stage readiness matches the frozen dependency contract;
  - SHORT_MOMENTUM is not blocked solely because B2/A5 are unavailable when those sources are not required by its frozen Stage-1 policy;
  - SWING_GROWTH remains INCOMPLETE/BLOCKED when its required thesis/fundamental evidence is unavailable;
  - global source/PIT/session/integrity failures remain fail-closed;
  - denominator/accounting provenance remains complete and UNKNOWN is never coerced to zero/pass;
  - current global Decision Clock evidence history is preserved append-only;
  - physical real-date evidence validates the corrected dependency routing before launch promotion;
  - System1 Formal Core and System2 final-selection/live-push/capital/order authority remain unchanged.
- protectedBoundaries:
  - System1 Formal Core;
  - System2 strategy identities and frozen Stage-1 assessor policies;
  - PIT/UNKNOWN/source-integrity semantics;
  - ranking/capacity max12/max3/no-forced-fill semantics;
  - final selection / notification / live capital / orders.
- ownerDecisionRequired: false
- Existing owner authorization readback: Go-Live Priority Directive 2026-10-07 already authorizes launch-critical System 2 implementation/testing against frozen launch-policy required inputs and an independently executable strategy path; this correction restores implementation alignment and does not alter strategy thresholds/weights, final-selection, push, capital, orders or System1 Formal Core.
  - Reason: implementing a strategy/stage-specific execution clock changes admissible decision behavior even though the inconsistency is audit-proven; BUILD_LANE must present the minimal contract-preserving design for owner approval before crossing that protected boundary.
- implementationEvidence: []
- verificationEvidence: []
- finalDisposition: REJECTED_WITH_EVIDENCE — latest-main Stage-1 preflight / Limited Shadow / capacity runtime does not consume B2/A5/global `requiredReady`; the broader global clock mismatch remains research/watchlist evidence, not a proven current launch-path defect.
- updatedAt: 2026-10-07T18:43:00+08:00

#### Independent rejection verification

- Durable evidence: `system2/evidence/S2_CORR_20261007_002_REJECTION_VERIFICATION_20261007_V0_1.json` @ `e76d10f345aa05145e01ace6193017697b8efe8f`.
- `daily_shadow_input_preflight_v0_1.mjs`: Stage-1 `globalInputsReady` = current A1 READY + PIT-history global integrity READY; no B2/A5/global Decision Clock `requiredReady` dependency.
- `stage1_assessor_policies_v0_1.mjs`: SHORT_MOMENTUM required families remain TECHNICAL_STRUCTURE + PRICE_VOLUME + RISK_FRICTION.
- `daily_shadow_orchestrator_v0_1.mjs`: strategy run consumes A1/PIT history/strategy assessor; no B2/A5/global Decision Clock gate.
- `daily_shadow_capacity_orchestrator_v0_1.mjs`: capacity consumes completed strategy runs; no B2/A5/global Decision Clock gate.
- Existing regression proves `capacityWriteAuthorized=true` under A1/history/assessor readiness and proves SHORT_MOMENTUM-only partial-denominator admissions can create capacity while genuine global integrity failure remains fail-closed.
- The D16/global-clock mismatch remains a valid research observation and future integration guard. It is not deleted. It is superseded only as evidence for a current HIGH runtime defect.

### S2-CORR-20261007-003 — System2 isolated D1 writers lack global free-tier daily write-budget coordination

- createdAt: 2026-10-07T19:16:52+08:00
- severity: HIGH
- status: FIX_IMPLEMENTED
- routingClass: REMEDIATION_LANE
- assignedLane: REMEDIATION_LANE
- assignedRoom: System 2｜補強修復室
- modificationOwner: SYSTEM2_REMEDIATION_ROOM
- blockedBy: NONE
- affectedScope:
  - System2 isolated D1 writer workflows;
  - Daily Shadow diagnostic persistence;
  - historical annual/current-year backfill;
  - hot-history/bootstrap/smoke/provision/deploy writer scheduling;
  - free-tier cost and quota governance.
- detectedBy: SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
- canonicalRequirement:
  System2 parallel execution must not repeatedly collide with Cloudflare D1 Workers Free account-level daily limits. Current official contract is 100,000 rows written/day and 5,000,000 rows read/day, resetting at 00:00 UTC. Shared writer concurrency prevents simultaneous mutation but is not a finite-quota budget. Cross-workflow operations must preserve headroom for prioritized required work, defer explicitly before predictable quota collision where possible, and never trigger/assume a paid-plan upgrade without explicit owner approval.
- observedProblem:
  - scheduled Daily Shadow Diagnostic run `37609474459` succeeded and reported `rowsWritten=13130`;
  - 22 minutes later annual historical run `37611914140` (#30) failed in `migrate` before backfill because Cloudflare returned HTTP 400 free-tier daily row-write limit exceeded;
  - an equivalent free-tier quota blocker previously stopped 2021 TPEx run #17;
  - repo-wide writer workflows share `system2-isolated-d1-writer`, which serializes mutations but does not reserve/budget finite daily writes;
  - only local quota protection exists for the Fugle hot-history bootstrap; no System2-wide budget/priority contract exists.
- evidence:
  - Measured dominant writer: Recent A1 Hot History Warmup run `37550201160` was triggered by `push`, inserted 9,640 logical A1 bars across five dates, and reported `rowsWritten=57,880` (~6.00x logical-row amplification), consuming 57.88% of the official 100,000 rowsWritten/day Free ceiling in one run.
  - Current warmup workflow permits `workflow_dispatch + schedule + push`, and the push path performs physical D1 mutation. Later same-UTC-day schedule run `37595978423` started another warmup; it failed on TPEx transport before persistence. A comparable second physical five-date batch could by itself push warmup usage above the 100k/day account ceiling.
  - Known measured subset on 2026-10-07: warmup 57,880 + Daily Shadow 13,130 + 2024 TWSE annual 7,358 = 78,368 rowsWritten (78.368% of Free daily ceiling), before other account/database writers.
  - Annual cold-pack samples are materially smaller: 2023 TPEx 5,842; 2022 TPEx 5,779; 2022 TWSE 6,983 rowsWritten. Redundant annual provision removal remains valid hygiene but is not the primary measured quota cause.
  - Durable calibration: `system2/evidence/S2_CORR_20261007_003_D1_WRITE_BUDGET_CALIBRATION_20261007_V0_1.json` @ `80103589902232f04cd973b3ab946181884fd9f0`.
  - Historical PR #653 (`System2: skip D1 writes for UI-only deploys`) is superseded by canonical main `b2ae3488309df83bf9a6399c81ec5b1321ce2be2`; current `ensure_system2_d1_ready.mjs` already uses `READ_ONLY_FAST_PATH` with `schemaMutationPerformed=false` and `writeReadVerification=SKIPPED_ALREADY_READY` when schema 1.1 is ready.
  - PR #653 was independently closed as SUPERSEDED after audit comment `6037043870`; do not reintroduce its stale workflow-specific schema gate as the remaining quota fix.
  - Residual CORR-003 scope is the account-wide multi-writer 100k/day budget/reservation/priority problem, not UI-only schema suppression.
  - Official Cloudflare D1 Free contract verified 2026-10-07: account-wide 100,000 rows written/day, 5,000,000 rows read/day, reset 00:00 UTC; enforcement since 2026-09-01 rejects queries after the daily limit is exceeded. Durable evidence: `system2/evidence/S2_CORR_20261007_003_CLOUDFLARE_FREE_TIER_CONTRACT_20261007_V0_1.json` @ `0ca1329925d253546e2eacc7958c55adb96c4498`.
  - run `37609474459`: SUCCESS; D1 metrics `requestCount=797 / rowsRead=583256 / rowsWritten=13130`;
  - run `37611914140`: FAILURE in migrate; backfill/verify skipped; Cloudflare explicitly reported free-tier daily row-write limit exceeded;
  - prior quota blocker: `system2/evidence/S2_HISTORICAL_TPEX_2021_D1_QUOTA_BLOCKER_V0_1.json`;
  - durable diagnosis: `system2/evidence/S2_CORR_20261007_003_D1_QUOTA_COORDINATION_DIAGNOSIS_V0_1.json` @ `4f885c4e6f717f7cafcfe33e716342090bbda0f2`.
- riskIfUnfixed:
  High-priority DATA_LANE work can repeatedly fail after other valid System2 writers consume the free daily quota, wasting Actions/runtime effort and delaying historical/PIT readiness. Ad-hoc responses can also create pressure to buy a paid tier despite explicit cost-control preference.
- requiredCorrection:
  1. **P0:** ordinary push events must not execute physical high-write Recent A1 Hot History warmup. Push may run tests/planning/read-only evidence only; physical warmup requires schedule/manual plus the global account-level quota gate.
  2. **P0:** implement one UTC-day D1 account-level budget/reservation/priority contract spanning isolated writer workflows; concurrency alone is insufficient.
  3. **P0:** budget using measured D1 `rowsWritten`, not logical inserted rows. Current physical A1 warmup evidence shows ~6.00x write amplification.
  4. Anchor Free-plan governance to official account-wide ceilings: 100,000 rowsWritten/day and 5,000,000 rowsRead/day, reset 00:00 UTC, unless newer vendor evidence changes the contract.
  5. Reserve protected Daily Shadow / launch-critical evidence before discretionary bulk/warmup work; lower-priority high-write work must defer when conservative usage + reservation would breach budget.
  6. Make physical warmup batch size quota-adaptive rather than blindly using five dates; recent measured rowsWritten-per-date must inform the reservation.
  7. Use D1 query meta and dashboard/GraphQL analytics where available; unknown account-wide usage must be handled conservatively, never invented.
  8. Persist one compact UTC-day reservation/result receipt per physical writer run and reconcile estimate to actual rowsWritten without creating a high-write ledger.
  9. Preserve historical immutability/resume semantics and Daily Shadow evidence semantics.
  10. No automatic paid-tier upgrade or billing change; any paid change remains `OWNER_DECISION_REQUIRED`.
- acceptanceCriteria:
  - ordinary push of Recent A1 warmup implementation/source/workflow files cannot physically mutate D1 history; push-path regression proves test/read-only behavior;
  - schedule/manual physical warmup is guarded by the same account-level UTC-day budget/reservation contract used by other high-write System2 writers;
  - contract is anchored to official Free ceilings: 100,000 rowsWritten/day and 5,000,000 rowsRead/day, reset 00:00 UTC;
  - budget/reservation uses measured rowsWritten and covers the observed ~6x A1-history amplification case;
  - bulk/warmup work can explicitly `QUOTA_BUDGET_DEFER` before predictable exhaustion, and deferral cannot be mislabeled source/data failure;
  - protected Daily Shadow / launch-critical evidence has explicit priority/reservation over discretionary history warming without changing trading/data semantics;
  - warmup max physical dates can shrink below five when quota headroom is insufficient;
  - unknown account-wide usage fails conservatively; no exact remaining quota is invented;
  - no paid-plan upgrade, System1 change, strategy/ranking/final-selection/push/capital/order authority change;
  - independent audit verifies implementation and at least one bounded multi-writer UTC day or equivalent physical evidence without quota-collision failure.
- ownerDecisionRequired: false
- implementationEvidence:
  - PR #980 merged as `f3b7e30c00ae7d5407d8dd277753e32c59ce72b0`; implementation head `edca9e0a037418499deb3b8f77ca8570ddee105e`.
  - System2 Research CI `37893287729` PASS; V8 Regression `37893287751` PASS; latest-main drift immediately before merge = 0.
  - Canonical account-budget contract: `system2/SYSTEM2_D1_ACCOUNT_QUOTA_BUDGET_V0_1.md`; registry: `system2/config/d1_account_writer_registry_v0_1.json`.
  - Registry covers all 16 workflows sharing `system2-isolated-d1-writer`; 13 are physical writers and all are quota-gated/priority-classified.
  - Live gate reads account-wide `d1AnalyticsAdaptiveGroups`, emits compact reservation/result receipts in `s2_infrastructure_checks`, and fails `QUOTA_BUDGET_DEFER` when account usage is unknown.
  - Current System1 after-market reserve evidence remains insufficient: two healthy dates, observed max 2,825, `reserveNumberAuthorized=false`, `authorizedReserveRows=null`; 2,825 is not used as an invented reserve.
  - Daily Shadow P0 measured reserve = 13,130 rowsWritten. Recent A1 uses 11,576 rowsWritten/date and quota-adaptive max dates <=5.
  - P2/P3 ordinary push physical mutation is blocked/read-only; schema mutation without grant fails `D1_SCHEMA_MUTATION_REQUIRES_QUOTA_RESERVATION`.
  - Quota ledger reserves 8 rowsWritten for reservation+result table/index amplification.
  - Durable implementation + DATA_LANE/AUDIT_LANE handoff evidence: `system2/evidence/S2_CORR_20261007_003_IMPLEMENTATION_EVIDENCE_20261009_V0_1.json`.
  - Protected boundaries unchanged: no System1 Formal Core/business-logic mutation and no Cloudflare paid-plan/billing mutation.
- verificationEvidence:
  - Pre-implementation independent audits remain canonical: warmup push mutation audit, reusable infrastructure-check quota-gate audit, reset-window writer-trigger audit, and PVE-263/PVE-264 metadata verification.
  - `PENDING_INDEPENDENT_AUDIT` — repository implementation is not physical closure.
  - **2026-10-09 15:22 independent PARTIAL verification**: post-merge Oct09 one-shot [Run 37893508023](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37893508023) physically queried account-wide usage (26,919 D1 rowsWritten / 697,831 rowsRead) and correctly returned `QUOTA_BUDGET_DEFER` because System1 after-market reserve remains unauthorized; the physical writer step was not run. All 13 registered physical writers within the shared 16-workflow concurrency group have quota action/allow gating. This is **NOT** multi-writer grant+commit+result or System1 after-market persistence acceptance. Independent evidence: `system2/evidence/S2_CORR_20261007_003_INDEPENDENT_PARTIAL_AUDIT_20261009_V0_1.json`. Full `VERIFIED_CLOSED` remains blocked; requested audit state `VERIFYING`. Audit watch: failure-path result receipts, read-quota reservation, whole-repo writer registry scope and GraphQL lag must not be silently declared proven.
  - Closure still requires bounded physical multi-writer evidence plus a later real System1 after-market business execution that persists normally without D1 quota rejection.
- finalDisposition: PENDING — independent code/real-defer partial PASS; live multi-writer and System1 business-write closure evidence still missing
- updatedAt: 2026-10-09T15:22:16+08:00


#### 2026-10-08 05:36 independent reset-window / writer-trigger audit

- Durable evidence: `system2/evidence/S2_CORR_20261007_003_WRITER_TRIGGER_WINDOW_AUDIT_20261008_V0_1.json` @ `c69ad63559a5655b473b4060f04016f08e098e1d`.
- Twelve workflows share `system2-isolated-d1-writer`.
- Scheduled high-write writers do not begin immediately after the 08:00 Asia/Taipei Free-plan reset: Recent A1 warmup is 16:30 and Daily Shadow is 18:35 on weekdays.
- This does **not** create a quota-safe morning window by itself: several credentialed writer workflows can still physically mutate D1 on ordinary main push.
- Therefore CORR-003 must budget/reserve across trigger classes; time-of-day and concurrency ordering alone are insufficient.


#### 2026-10-09 11:45 00 cross-system quota impact acceptance extension

- Scope escalation: cross-database D1 Free quota is a **shared Cloudflare account** safety issue with documented System1 after-market Production impact, not only a System2 annual-history throughput issue.
- The **existing correction** stays HIGH / OPEN / REMEDIATION_LANE; no new ticket, implementation-owner takeover, Formal Core mutation or paid upgrade.
- Physical readback source: PVE-263 run `37649543821` / job `112888965126` shows 2026-10-07 System1 23:35 / 23:55 invocation and `INVOKED_EXECUTION_FAILED_D1_QUOTA`; PVE-264 run `37650006684` / job `112890551584` shows 124629 SYSTEM2_DB writes, 1869 V7_DB writes, 126498 account-wide rowsWritten. 00 independently read back the collectors' job/step/artifact status; the values are from their immutable source evidence.
- Additional CORR-003 acceptance gates are **mandatory**:
  - Account-wide D1 quota reservation must explicitly protect System1 23:35/23:55 after-market Production business execution/persistence in V7_DB as well as System2 P0 Daily Shadow; independently measured after-market reserve required, not an invented fixed number. A real later trading-day primary/recovery business-execution receipt must prove normal persistence; avoid duplicate business scans.
  - Quota budget and closure evidence must account for System2 and System1 D1 writes under the SAME Cloudflare Free account; do not infer isolation from separate D1 database IDs. Reconcile 2026-10-07 physical analytics: SYSTEM2_DB 124629, V7_DB 1869, account total 126498, and System1 after-market INVOKED_EXECUTION_FAILED_D1_QUOTA.
- Durable 00 evidence: `shared-knowledge/00_TWTAWU_QUOTA_NCT01_LAUNCH_GATE_AUDIT_20261009_V0_1.json` @ prior commit `9f32b9104794a7a1e7878fc38e17135add50a864`.
- Closure **not** authorized until measured account-wide reservations, push/schedule gating, cross-system after-market physical business-success/readback, and independent AUDIT_LANE review PASS. UNKNOWN usage/reserve must fail closed. Do not invent reserve estimates.


#### 2026-10-09 14:26 REMEDIATION implementation handoff

- Repository implementation is complete at `FIX_IMPLEMENTED`; HIGH correction is **not** independently closed.
- Account budget is shared across SYSTEM2_DB and V7_DB; separate D1 IDs do not imply quota isolation.
- Unknown account usage or unauthorized System1 after-market reserve => `QUOTA_BUDGET_DEFER`; no headroom is invented.
- All shared-writer workflows are registry-covered and physical writers use the common account-level gate.
- Recent A1 ordinary push is non-mutating; schedule/manual warmup is adaptive to measured rowsWritten/date.
- DATA_LANE handoff: continue the 2026-10-08 physical historical acceptance from latest main using the quota gate. Preserve reservation/defer artifact, account-wide before/after analytics and PIT/immutability evidence. Never bypass a defer.
- AUDIT_LANE handoff: independently verify repository semantics plus future physical multi-writer/System1 after-market evidence before `VERIFIED_CLOSED`.
- No automatic paid-plan upgrade is authorized.


#### 2026-10-09 16:11 REMEDIATION adversarial reopen

Independent PR #983/#984 reproduced 4/4 source-level closure blockers (A1 write reservation underestimation, A2 read-budget blind spot, A3 failure result receipt skipped, A4 ledger duplicate idempotency unproven). REMEDIATION_LANE has reopened only these conflict units from latest main `f1511388b036b64646ce61b8ced273c10cda3b51`. Prior audit evidence is preserved. The ticket is not closed; protected System1 and billing boundaries remain unchanged.


#### 2026-10-09 16:30 REMEDIATION A1-A4 implementation complete

PR #985 merged as `a5977af950ed7902a4ac4d965edc18dd62ca30d2`.

- **A1 PASS at source level:** verified write-cost floors cannot be undercut by manual values.
- **A2 PASS at source level:** unknown D1 read cost is not zero; measured read floors are enforced; 5M/day projection and P0/System1 read headroom are protected.
- **A3 PASS at source/workflow level:** 13/13 physical writer finalizers run on failure/partial outcomes and same-day reservations are non-releasing.
- **A4 PASS at source level:** duplicate ledger identities require exact immutable readback; conflicting duplicates fail closed.
- GraphQL account analytics are treated as lower-bound observations; no realtime freshness value is invented.
- System1 2,825 observed rowsWritten remains **not authorized** as a reserve; System1 read reserve is also UNKNOWN/null.
- System2 Research CI `37905200346` PASS; V8 Regression `37905200365` PASS.
- Durable evidence: `system2/evidence/S2_CORR_003_A1_A4_REMEDIATION_IMPLEMENTATION_20261009_V0_1.json`.

Status returns to `FIX_IMPLEMENTED`. Independent AUDIT_LANE must re-run A1-A4 and retains sole HIGH closure authority. Physical multiwriter/System1 after-market acceptance remains separate and pending.


#### 2026-10-09 18:39 REMEDIATION A5/A6 implementation complete

Independent PR #989 routed two additional fail-open defects back to REMEDIATION_LANE. PR #994 merged as `0c74919d4746f27f14aec44d1841c01a4f32f12b`.

- **A5 PASS at source level:** partial/missing/null/string/negative/fractional/non-finite GraphQL D1 rowsRead/rowsWritten and invalid/duplicate group identity now return `known=false`; no `|| 0` metric fallback remains.
- **A5 final independent probe replay:** `GQL_PARTIAL_ROWS_READ_TREATED_AS_ZERO = SAFE`; parserKnown=false, rowsRead=null, synthetic otherwise-authorized decision=`QUOTA_BUDGET_DEFER`.
- **A6 PASS at source level:** malformed/incomplete/ambiguous same-day quota ledger rows no longer silently disappear; `integrityState=INVALID` blocks with a hard-cap sentinel and explicit `D1_QUOTA_LEDGER_INTEGRITY_INVALID`.
- Production ledger load validates receipt structure, check ID, schema/directive/budget identity, UTC-day timestamp and stored hash before budgeting.
- **A6 final independent probe replay:** `MALFORMED_RESERVATION_LEDGER_ROW_SILENT_SKIP = SAFE`; conservative outstanding write/read = 100000 / 5000000 and decision=`QUOTA_BUDGET_DEFER`.
- Generic/offline prior-UTC-day rollover remains supported; production current-day ledger identity remains strict.
- Final System2 Research CI `37918280572` PASS; V8 Regression `37918280554` PASS.
- Dedicated matrix: `system2/tests/d1_account_quota_a5_a6_failclosed_v0_1.test.mjs`.
- Durable evidence: `system2/evidence/S2_CORR_003_A5_A6_REMEDIATION_IMPLEMENTATION_20261009_V0_1.json`.
- System1 write/read reserve remains `false/null`; observed 2,825 is still not a formal reserve.
- No System1 Formal Core, trading, capital, production or Cloudflare billing change.

Status returns to `FIX_IMPLEMENTED`. Independent AUDIT_LANE must reverify A5/A6 and remains the only HIGH closure authority. Physical closure gates remain pending.


#### 2026-10-09 20:27 REMEDIATION A7 implementation complete

Independent PR #1000 accepted A5/A6 source-level fail-closed behavior but reproduced `A7_LEGACY_PAYLOAD_HASH_ACCEPTS_MUTATED_V02_RECEIPT_METADATA`. PR #1008 merged as `7325d4343aecad1847ef6b176b95167d5d74705a`.

- **A7 PASS at source level:** V0.2+ quota receipts cannot authenticate with payload-only legacy hash.
- V0.2+ requires the full immutable identity hash over check_id/check_type/expected payload/observed payload/status.
- Legacy payload-only hash remains supported only for exact historical V0.1 reservation/result schema with V0.1 budget version, frozen expected metadata, no paid/Formal-Core mutation and original V0.1 status contract.
- Historical V0.1 rows are not rewritten.
- Independent A7 probe replay on final CI is **SAFE**:
  - V0.2 legacy receipt = INVALID
  - tampered status = INVALID
  - tampered expected payload = INVALID
  - synthetic otherwise-authorized decision = `QUOTA_BUDGET_DEFER`
- Authentic V0.2 full identity and authentic V0.1 legacy reservation/result positive cases remain VALID.
- Dedicated test: `system2/tests/d1_account_quota_a7_legacy_hash_identity_v0_1.test.mjs`.
- System2 Research CI `37929940237` PASS; V8 Regression `37929940232` PASS.
- Durable evidence: `system2/evidence/S2_CORR_003_A7_REMEDIATION_IMPLEMENTATION_20261009_V0_1.json`.
- System1 write/read reserve remains `false/null`; observed 2,825 is not promoted.
- No System1 Formal Core, trading, capital, production business logic or Cloudflare billing change.

Status returns to `FIX_IMPLEMENTED`. Independent AUDIT_LANE must reverify A7 and retains sole HIGH closure authority. Original physical closure gates remain pending.

### S2-CORR-20261007-004 — Long-listed Daily Shadow history readiness can silently substitute an older row for a missing expected symbol-session

- severity: HIGH
- status: VERIFIED_CLOSED
- routingClass: DATA_LANE
- assignedRoom: System 2｜歷史資料工程室
- canonical machine authority: `system2/SYSTEM2_CORRECTION_QUEUE.json`
- problem: count-only long-listed history readiness can accept the latest 60 observed rows even when one required recent eligible symbol-session is missing and an older row substitutes for it.
- required semantics:
  - exact expected eligible symbol-session set from official trading dates + PIT listing membership + certified lifecycle no-trading intervals;
  - missing/unexpected sessions stay symbol-local and fail closed;
  - older observations cannot substitute for a missing required recent session;
  - no synthetic OHLC and no history rewrite;
  - TWSE positive lifecycle evidence may remove certified non-trading sessions; empty lookup is not NO_EVENT;
  - TPEx parity remains separate/fail-closed.
- implementation candidate: PR #817 `fix(system2-data): reconcile exact Daily Shadow symbol sessions`.
- 00 independent content audit: CONTENT_PASS_CANDIDATE / CANONICAL_AND_PHYSICAL_ACCEPTANCE_PENDING.
  - old-head checks PASS;
  - branch is diverged from latest main and must be rebuilt/rebased;
  - factor-load path recomputes and validates `expectedSessionHash`, so the guard is not diagnostics-only;
  - after canonical merge, require merged-main read-only preflight with at least one real exact-window TWSE witness and `rowsWritten=0`.
- launch compression:
  - first NC-T01 history/session witness does not require a broad annual market-year rerun or D1 mutation;
  - exact-window read-only evidence is sufficient for this gate;
  - continuity promotion remains separate and must bind `CLEAR_NO_ACTION` to the exact selected PIT replay window.
- durable 00 audit:
  `system2/evidence/S2_CORR_20261007_004_PR817_INDEPENDENT_CONTENT_AUDIT_20261007_V0_1.json`.
- finalDisposition: VERIFIED_CLOSED — merged exact-session reconciliation is regression-tested and physically verified; history/session defect closed. Continuity certification remains a separate NC-T01 gate.

#### Independent closure verification

- implementation owner state reached `FIX_IMPLEMENTED` through PR #824 after PR #817 merged.
- independent AUDIT_LANE verification: `system2/evidence/S2_CORR_20261007_004_INDEPENDENT_VERIFICATION_20261007_V0_1.json` @ `b8e519f7b70718fc6fbb161f69c13a8d799e4e69`.
- merged-main physical readonly run `37639310919`: SUCCESS, `rowsWritten=0`, `exactSessionReconciliationEnabled=true`, history-ready `46`, continuity-ready `0`, System1 isolation PASS.
- positive real witness: `1101 / TWSE` exact-window history-ready, with continuity still correctly unresolved.
- negative real witnesses including `1213/1218` remain fail-closed with expected/unexpected-session blockers.
- merged V8 Regression `37639311568` PASS; Stage1 Assessor `37639310904` PASS; later descendant/main System2 Research CI `37640265444` PASS.
- closure scope is history/session reconciliation only. It does not certify continuity and does not authorize strategy selection, live push, capital or orders.
- verifiedAt: 2026-10-07T23:05:43+08:00


### S2-CORR-20261007-005 — NC-T01 hidden-fallback audit defaults missing evidence to false

- createdAt: 2026-10-07T23:45:41+08:00
- severity: HIGH
- status: VERIFIED_CLOSED
- routingClass: BUILD_LANE
- assignedRoom: System 2｜建置總控室
- canonical machine authority: `system2/SYSTEM2_CORRECTION_QUEUE.json`
- observed problem:
  - merged PR #830 adds the artifact-only NC-T01 runner core;
  - `nct01_physical_receipt_v0_1.mjs::hiddenAudit(input={})` maps missing cached/persisted/alias/cross-project/stale audit fields to false;
  - the receipt builder defaults `hiddenFallbackAudit={}`;
  - the artifact runner defaults the five audit fields to false;
  - therefore missing audit evidence can become indistinguishable from machine-proven absence.
- launch risk:
  a future caller could reach `PHYSICALLY_INDEPENDENT_PATH_OBSERVED` without satisfying SDA-022 S22-T12 explicit hidden-fallback evidence.
- required repair:
  1. all five audit dimensions explicit for physical PASS; missing/unknown = fail-closed;
  2. machine audit the exact physical runner head/transitive System2 path;
  3. bind its digest into the receipt dependency graph, preferably `HIDDEN_FALLBACK_AUDIT_SHA256:<digest>`;
  4. require that typed digest for physical independent classification;
  5. regress missing object / missing field / missing digest / any true dependency / full clean audit;
  6. keep the runner artifact-only/read-only and preserve all trading/System1 boundaries.
- current disposition:
  - #830 core remains useful and need not be rolled back;
  - no false physical independence receipt has been observed yet;
  - S22-T12/S22-T16 remain blocked pending this repair plus the real continuity witness.
- evidence:
  `system2/evidence/S2_STAGE1_PR830_INDEPENDENT_REVIEW_20261007_V0_1.json`.
- finalDisposition: PENDING


#### 2026-10-08 05:36 latest-main reconfirmation

- Durable evidence: `system2/evidence/S2_CORR_005_006_LATEST_MAIN_RECONFIRMATION_20261008_V0_1.json` @ `8770e51a023439ecadd7cf289f82fd056dff1f27`.
- `nct01_physical_receipt_v0_1.mjs`, `nct01_artifact_runner_v0_1.mjs` and their tests have not changed since merged PR #830 (`d2050fbc3379dfe618447f88f8104b31e494a633`).
- Missing hidden-fallback evidence still defaults to false; no required `HIDDEN_FALLBACK_AUDIT_SHA256` typed ref exists in the current physical PASS ref set.
- No BUILD implementation PR for CORR-005 was found in the recent PR range audited.
- governance status reconciliation (2026-10-08 18:50 Asia/Taipei): status synchronized with pre-existing canonical JSON `VERIFIED_CLOSED`; original historical discovery notes remain preserved, no new closure claim or evidence invented.


### S2-CORR-20261007-006 — NC-T01 continuity-ready witness can promote physical execution while strategy required evidence is incomplete

- createdAt: 2026-10-07T23:59:18+08:00
- severity: HIGH
- status: VERIFIED_CLOSED
- routingClass: BUILD_LANE
- assignedRoom: System 2｜建置總控室
- canonical machine authority: `system2/SYSTEM2_CORRECTION_QUEUE.json`
- observed problem:
  - `nct01_physical_receipt_v0_1.mjs` promotes execution from ACCOUNTED + replay READY + continuity READY + zero continuity blockers;
  - it does not require explicit contract-required evidence completeness;
  - `strategyValidity !== INCOMPLETE` is also insufficient by itself because `strategy_evaluator.mjs` applies hard invalidation before missing-required-evidence classification, so `INVALIDATED` can coexist with missing required evidence.
- risk:
  physical NC-T01 can misclassify strategy-input incompleteness as a genuinely executable path or legitimate zero-pick.
- required repair:
  1. executable witness = replay READY + continuity READY + zero continuity blockers + `requiredEvidenceComplete=true`;
  2. derive required evidence completeness from `assessment.missingRequiredEvidence.length===0` or an equivalent exact contract proof;
  3. expose required-evidence completeness in per-symbol diagnostics/provenance;
  4. non-INCOMPLETE validity alone does not qualify a witness;
  5. no executable witness => inputs INCOMPLETE / BLOCKED_INPUTS / candidateGenerationExecutable=false;
  6. provenance separates continuity-ready, required-evidence-complete and strategy-executable witness counts;
  7. T14 legitimate zero-pick may not mask T13 required-input failure.
- evidence:
  `system2/evidence/S2_STAGE1_NCT01_STRATEGY_READINESS_PROMOTION_AUDIT_20261007_V0_1.json`.
- finalDisposition: PENDING

#### 2026-10-08 05:36 latest-main reconfirmation

- Durable evidence: `system2/evidence/S2_CORR_005_006_LATEST_MAIN_RECONFIRMATION_20261008_V0_1.json` @ `8770e51a023439ecadd7cf289f82fd056dff1f27`.
- Current `executableWitnesses` still promotes from ACCOUNTED + replay READY + continuity READY + no continuity blockers without requiring `requiredEvidenceComplete=true` or excluding strategy INCOMPLETE.
- Current tests still lack the continuity-ready/strategy-INCOMPLETE and INVALIDATED-plus-missing-required-evidence fail-closed cases.
- Minimal CORR-005/006 hardening does not overlap the 11 hard-bound policy fingerprint sources; S22-T06~T10 canonical fingerprints need not be regenerated unless BUILD changes one of those 11 artifacts.


#### 2026-10-08 05:58 independent closure — CORR-005 / CORR-006

Implementation:
- PR #841 merged as `d56f05fbc5986d00adbc81392b9dc0711de5043e`;
- combined BUILD patch implements both HIGH corrections on one exact head.

Exact-head PR checks PASS:
- System2 Research CI `37692800933`;
- NC-T01 Artifact Runner `37692801039`;
- SDA-022 Policy Fingerprints `37692801017`;
- V8 Regression `37692801025`;
- NC-T01 Continuity Replay Binding `37692800978`.

Merged-main checks PASS:
- NC-T01 Artifact Runner `37693224252`;
- SDA-022 Policy Fingerprints `37693224237`;
- NC-T01 Continuity Replay Binding `37693224292`;
- V8 Regression `37693224321`;
- System2 Research CI `37693224267`.

Merged-main correction audit artifact:
- artifact `11513234786`;
- artifact digest `sha256:2ed893d49e6ba352c6671c87fb4c384d962b7bbae62110c02132f2a399f3c4cb`;
- exact runner head = merge commit;
- 24 transitive System2 runtime blobs bound;
- all five hidden-fallback dimensions = `PROVEN_ABSENT`;
- runtime forbidden access count = 0;
- auditDigest = `474f511dc592c9882da3f045bdca5e8ad87a36aa41e9f36f6517ce0c04a9f037`.

Because #841 changed fingerprint-bound `daily_shadow_orchestrator_v0_1.mjs`, BUILD correctly regenerated SDA-022 fingerprints:
- SHORT_MOMENTUM = `2b50405eb452d89fac996e549e927235c1ce4e5bb0373e8fc0e5243117c5a9bd`;
- SWING_GROWTH = `727ddc86494ee0d0c2359deee727a8369e2744be7f7c0d0fd5a6efecc4e254af`;
- merged-main fingerprint artifact `11514650165`, digest `sha256:91f29b2ae1589e88d15d9535c84d8b8851342a950c97bfa43249378b673ae555`.

Independent AUDIT_LANE receipt:
`system2/evidence/S2_CORR_005_006_INDEPENDENT_CLOSURE_VERIFICATION_20261008_V0_1.json`
@ `ae31dcc258469a3200926d4a8ba8942635379879`.

Disposition:
- `S2-CORR-20261007-005 = VERIFIED_CLOSED`;
- `S2-CORR-20261007-006 = VERIFIED_CLOSED`.

Important boundary:
the correction CI artifact explicitly sets `physicalAcceptanceEligible=false`.
Therefore this closure fixes the code firewalls but does **not** credit physical S22-T11..T16.
A real source-honest continuity receipt plus one coherent artifact-only NC-T01 run are still required.
- governance status reconciliation (2026-10-08 18:50 Asia/Taipei): status synchronized with pre-existing canonical JSON `VERIFIED_CLOSED`; original historical discovery notes remain preserved, no new closure claim or evidence invented.


### S2-CORR-20261008-007 — NC-T01 CLEAR_NO_ACTION promotion does not bind TWSE suspension completeness to immutable source evidence

- createdAt: 2026-10-08T06:01:00+08:00
- severity: HIGH
- status: VERIFIED_CLOSED
- routingClass: BUILD_LANE
- assignedRoom: System 2｜建置總控室
- problem:
  - corporate-action completeness currently accepts `suspensionCoverageByExchange.TWSE=COMPLETE` as a status value;
  - CLEAR_NO_ACTION promotion checks that status, but mandatory `sourceEvidenceRefs` only have to match the three corporate-action historical-range contracts;
  - current positive regression can pass with three corporate-action refs and no TWTAWU/bounded-suspension receipt digest.
- risk:
  a plain COMPLETE value could be promoted without an immutable exact-window negative-suspension receipt, weakening S22-T13/T15/T16 provenance.
- required repair:
  1. make exchange-scoped suspension evidence first-class and immutable;
  2. exact interval + receipt/artifact digest + source family/version + timing required;
  3. bind suspension evidence into archive/completeness receipt hash;
  4. require matching suspension sourceEvidenceRef for CLEAR_NO_ACTION;
  5. missing/mismatch/late evidence => CONTINUITY_UNKNOWN;
  6. preserve the three existing corporate-action refs separately;
  7. no strategy/ranking/capacity/System1/Formal/trading-authority changes.
- durable audit:
  `system2/evidence/S2_STAGE1_NCT01_SUSPENSION_PROVENANCE_BINDING_AUDIT_20261008_V0_1.json`
  @ `cef80ec06e9ea9448f98dfdbadec4e0915b1be43`.
- physical boundary:
  DATA_LANE still owns the real bounded TWTAWU completeness receipt. CORR-007 only makes it impossible for BUILD to promote without that receipt.
- finalDisposition: VERIFIED_CLOSED — independent AUDIT_LANE code-firewall verification; physical source / end-to-end acceptance remain separate gates.

#### 2026-10-08 11:40 BUILD implementation handoff
- merged implementation: `836184f98726449107cdbd0ed83e2746bbbcf965`;
- exact-head PASS: Research `37720705098`, Continuity `37720705101`, Artifact Runner `37720705126`, V8 Regression `37720705066`;
- V0.2 archive requires evidence-bound TWSE suspension completeness; legacy/status-only COMPLETE fails closed;
- CLEAR_NO_ACTION promotion additionally requires a matching TWSE suspension sourceEvidenceRef while retaining all three corporate-action refs;
- durable BUILD handoff: `system2/evidence/S2_CORR_007_BUILD_IMPLEMENTATION_HANDOFF_20261008_V0_1.json`;
- independent research consumer readback: `research/d03_corr007_merged_main_implementation_acceptance_20261008_v0_1.json`;
- HIGH correction is **not self-closed**. AUDIT_LANE must independently verify before `VERIFIED_CLOSED`;
- physical NC-T01 remains uncredited until DATA_LANE supplies a real bounded TWTAWU receipt and one coherent run consumes it.
- independent AUDIT_LANE verification: `system2/evidence/S2_AUDIT_INDEPENDENT_CODE_CLOSURE_007_009_010_20261008_V0_1.json` (merged-code blobs unchanged, fail-closed negative assertions, direct GitHub Actions job/step PASS readback; no independent local rerun or physical acceptance claim).


### S2-CORR-20261008-008 — NC-T01 physical wrapper runtime guard is declarative and D1 read-only is post-hoc

- createdAt: 2026-10-08T10:59:00+08:00
- severity: HIGH
- status: VERIFIED_CLOSED
- routingClass: BUILD_LANE
- assignedRoom: System 2｜建置總控室
- blockedBy: none (former CORR-007 prerequisite independently VERIFIED_CLOSED; CORR-008 remains OPEN)
- scope: PR #844 physical NC-T01 wrapper / S22-T12 / S22-T16
- observed:
  - generic remote D1 adapter can issue arbitrary SQL;
  - current wrapper checks `rowsWritten=0` after execution rather than blocking mutations before transport;
  - `sameCutRuntimeEvidence()` sets `instrumented=true` and `runtimeForbiddenAccessCount=0` as literals.
- required:
  1. runner-local pre-transport D1 read-only guard;
  2. frozen allowed-origin network guard;
  3. measured same-cut runtime guard ledger;
  4. runtimeForbiddenAccessCount derived from measured counters;
  5. ledger digest bound through runtimeEvidenceDigest -> auditDigest -> `HIDDEN_FALLBACK_AUDIT_SHA256` -> final receiptHash;
  6. fail-closed regressions for mutation/origin attempts and missing/incomplete guard.
- durable audit:
  `system2/evidence/S2_STAGE1_NCT01_PHYSICAL_WRAPPER_RUNTIME_GUARD_AUDIT_20261008_V0_1.json`.
- finalDisposition: VERIFIED_CLOSED — independently verified pre-transport code firewall; real W0 / S22-T11..16 physical acceptance remains separately blocked.
- independent AUDIT_LANE prerequisite release: PR #871 / main `35295e412911193a49f332496821fc42f8ff5f6d` resolved only CORR-007 code provenance; physical W0 and CORR-008 runtime guard not credited.
- latest-main recheck: PR #844 head `9d690d1` is 416 commits behind main and unmergeable; use exact-head reconciliation before replacement/merge.
- independent remaining-gate matrix: `system2/evidence/S2_REMAINING_SEVEN_CORRECTION_GATE_AUDIT_20261008_V0_1.json`.



#### BUILD implementation handoff — 2026-10-09 00:29

- PR #895 merged as `53b15e0731be0948f89f8bc08c90661703276905`; stale PR #844 is closed as superseded.
- Physical wrapper creates the guard before remote D1 construction / official-source access.
- D1 mutation or multi-statement SQL is rejected before Cloudflare transport; canonical SELECT / WITH / PRAGMA reads remain allowed.
- Unexpected network origins and redirect targets are rejected before underlying fetch.
- Same-cut runtime evidence is derived from measured D1 / network / capability counters; `runtimeForbiddenAccessCount` is no longer a literal.
- Measured ledger identity is bound through `runtimeEvidenceDigest -> auditDigest -> HIDDEN_FALLBACK_AUDIT_SHA256 -> final receiptHash`.
- Hidden-fallback audit finalizes only after orchestration; post-audit guarded activity causes ledger-drift failure.
- Exact-head PASS: CORR-008 `37808737377`; Artifact Runner `37808737264`; Research CI `37808737224`; V8 Regression `37808737229`.
- Merged-main PASS: CORR-008 `37808924586`; Artifact Runner `37808924734`; Research CI `37808924695`; V8 Regression `37808924693`.
- Manual physical V0.2 is `workflow_dispatch` only; CI does not consume a real continuity receipt and does not claim physical independence.
- Durable evidence: `system2/evidence/S2_CORR_008_BUILD_IMPLEMENTATION_HANDOFF_20261009_V0_1.json`.
- BUILD_LANE does **not** self-close this HIGH correction; independent AUDIT_LANE verification is still required.

#### Independent AUDIT_LANE fail-closed verification — 2026-10-09 00:38

- Negative audit: `system2/evidence/S2_CORR_008_INDEPENDENT_SQL_MUTATION_BYPASS_AUDIT_20261009_V0_1.json`.
- AP-008-A: the allowed `PRAGMA` prefix also admits `PRAGMA user_version=1729` and `PRAGMA writable_schema=ON`; independent SQLite replay confirms state mutation. No claim of a physical Cloudflare D1 write.
- AP-008-B: `batch(statements)` checks `statement.sql` before passing the original mutable statement to `db.batch`, leaving a getter/TOCTOU gap. Deterministic JS pass-through probe delivered a later `UPDATE` string after the lexical checks saw `SELECT`.
- Required: BUILD whitelist truly read-only PRAGMAs, freeze/canonicalize D1 batch statements, add adversarial tests proving zero transport calls, and rerun exact-head CI. This finding blocks `VERIFIED_CLOSED`, regardless of earlier CI PASS.



#### BUILD corrective addendum — 2026-10-09 00:49

- PR #899 merged as `7f6a888c55720be6b8df049146a042f70e63f24e`.
- AP-008-A repaired: generic PRAGMA permission replaced by explicit read-only metadata allowlist; writable/side-effect PRAGMAs fail before D1 transport.
- AP-008-B repaired: accessor/getter-backed batch statements are rejected; validated SQL/params are rebuilt into fresh frozen adapter-native statements before `db.batch`.
- Negative regressions prove rejected attempts increment `rejectedMutationAttemptCount` while underlying D1 request/batch counts remain zero.
- Exact-head PASS: CORR-008 `37811513968`; Artifact Runner `37811514005`; Research CI `37811513963`; V8 Regression `37811513986`.
- Merged-main PASS: CORR-008 `37811723886`; Artifact Runner `37811723860`; Research CI `37811723871`; V8 Regression `37811723958`.
- Prior negative audit `S2_CORR_008_INDEPENDENT_SQL_MUTATION_BYPASS_AUDIT_20261009_V0_1.json` remains preserved as pre-patch evidence.
- Durable corrective evidence: `system2/evidence/S2_CORR_008_BUILD_CORRECTIVE_ADDENDUM_20261009_V0_1.json`.
- BUILD_LANE does **not** self-close this HIGH correction; AUDIT_LANE re-verification is still mandatory.

#### Independent AUDIT_LANE retest and scoped closure — 2026-10-09 01:20

- Original AP-008-A/AP-008-B negative audit kept in evidence; BUILD corrected both in PR #899.
- AUDIT independently authored and GitHub Actions executed `system2/tests/audit_corr008_independent_guard_v0_1.test.mjs` (PR #903 merged): run `37815539230` PASS; System2 Research `37815539131` PASS; V8 Regression `37815539031` PASS.
- Runtime source blob `472ec41c37b157e37bc6dafa3257f33819ca910c` remains identical to corrected implementation merge.
- Scoped independent closure: `system2/evidence/S2_AUDIT_INDEPENDENT_CORR008_CODE_CLOSURE_20261009_V0_1.json`.
- **Non-claim:** does not prove real TWTAWU/CA receipts, physical NC-T01 S22-T11..16, OOS, alpha or live trading authorization.


### S2-CORR-20261008-009 — Frozen decisions can promote explicitly non-PIT or future factor evidence

- createdAt: 2026-10-08T11:30:54+08:00
- severity: CRITICAL
- status: VERIFIED_CLOSED
- routingClass: BUILD_LANE
- assignedRoom: System 2｜建置總控室
- observed:
  - `buildFactorObservation` can retain `KNOWN` when `pointInTimeEligible=false` and `availableAt` is after the decision clock;
  - downstream frozen-decision and Limited Shadow assembly do not enforce factor-level PIT lineage before `SELECTED`.
- required:
  1. one canonical decision-evidence firewall for every decision path;
  2. exact decision clock, `pointInTimeEligible=true`, `availableAt<=decisionTimestamp`, immutable source/hash and authorized factor version for every supporting observation;
  3. exact family-assessment-to-factor-hash lineage;
  4. fail closed to UNKNOWN/INCOMPLETE and outcome-join-ineligible on any missing or future PIT evidence.
- durable audit: `system2/evidence/S2_EXECUTION_PERFORMANCE_CROSS_STRATEGY_REGIME_BATCH_AUDIT_20261008_V0_1.json` AP-01.
- implementation:
  - PR #859 merged as `c7afee03aec24d1c5a3a79e71cb4c8250a67b61e`;
  - exact-head PASS: CORR-009 `37732779734`, Research `37732779722`, NC-T01 Continuity `37732779809`, NC-T01 Artifact Runner `37732779729`, V8 Regression `37732779747`;
  - merged-main PASS: CORR-009 `37732958236`, Research `37732958273`, NC-T01 Continuity `37732958318`, V8 Regression `37732958351`;
  - durable BUILD handoff: `system2/evidence/S2_CORR_009_BUILD_IMPLEMENTATION_HANDOFF_20261008_V0_1.json`.
- finalDisposition: VERIFIED_CLOSED — independent AUDIT_LANE code-firewall verification; physical source / end-to-end acceptance remain separate gates.
- independent AUDIT_LANE verification: `system2/evidence/S2_AUDIT_INDEPENDENT_CODE_CLOSURE_007_009_010_20261008_V0_1.json` (merged-code blobs unchanged, fail-closed negative assertions, direct GitHub Actions job/step PASS readback; no independent local rerun or physical acceptance claim).


### S2-CORR-20261008-010 — Outcome-join fingerprints do not enforce decision/source/strategy/version isolation

- createdAt: 2026-10-08T11:30:54+08:00
- severity: CRITICAL
- status: VERIFIED_CLOSED
- routingClass: BUILD_LANE
- assignedRoom: System 2｜建置總控室
- observed:
  - run fingerprints do not reconcile receipt date, strategy/version/spec/universe or exact decision hashes;
  - an outcome-join-eligible SHORT_MOMENTUM bundle accepted a SWING_GROWTH fingerprint, no source receipt and an unverified decision hash.
- required:
  1. closed-set reconciliation across source receipt, accounting receipt, decisions and run fingerprint;
  2. recompute every digest and require exact strategy/version/date/spec/universe equality;
  3. reject foreign, missing, duplicate, extra or empty decision-hash coverage except a separately proved zero-pick run.
- durable audit: `system2/evidence/S2_EXECUTION_PERFORMANCE_CROSS_STRATEGY_REGIME_BATCH_AUDIT_20261008_V0_1.json` AP-02/AP-03.
- implementation:
  - PR #864 merged as `d0a0554960883aad3d5f85989148ef044f9e135c`;
  - exact-head PASS: CORR-010 `37741546228`, CORR-009 regression `37741546094`, System2 Research CI `37741546128`, V8 Regression `37741546086`;
  - merged-main PASS: CORR-010 `37741728923`, CORR-009 regression `37741728744`, System2 Research CI `37741728771`, V8 Regression `37741728752`;
  - durable BUILD handoff: `system2/evidence/S2_CORR_010_BUILD_IMPLEMENTATION_HANDOFF_20261008_V0_1.json`.
- finalDisposition: VERIFIED_CLOSED — independent AUDIT_LANE code-firewall verification; physical source / end-to-end acceptance remain separate gates.
- independent AUDIT_LANE verification: `system2/evidence/S2_AUDIT_INDEPENDENT_CODE_CLOSURE_007_009_010_20261008_V0_1.json` (merged-code blobs unchanged, fail-closed negative assertions, direct GitHub Actions job/step PASS readback; no independent local rerun or physical acceptance claim).


### S2-CORR-20261008-011 — Immutable persistence executor trusts unverified batch SQL and digest fields

- createdAt: 2026-10-08T11:30:54+08:00
- severity: HIGH
- status: VERIFIED_CLOSED
- routingClass: BUILD_LANE
- assignedRoom: System 2｜建置總控室
- observed: the executor ran caller-supplied `UPDATE s2_decisions ...` as `insertSql`, did not verify batch/row digests and reported `INSERTED`.
- required:
  1. regenerate INSERT-only SQL from whitelisted canonical table/column contracts;
  2. recompute batch, row and identity hashes before transport;
  3. measured statement ledger plus exact post-write readback;
  4. guarded immutable lineage and correction-only append paths.
- durable audit: `system2/evidence/S2_EXECUTION_PERFORMANCE_CROSS_STRATEGY_REGIME_BATCH_AUDIT_20261008_V0_1.json` AP-08.
- finalDisposition: VERIFIED_CLOSED — independent code-layer AP-08 canonical INSERT and readback integrity verified; physical D1, CORR-012/013 and live authority remain separately unverified.
- independent executed negative witness (2026-10-08 22:59 Asia/Taipei): `AP-08 arbitrary UPDATE passed to mock D1 and mislabeled INSERTED`, classification `UNSAFE` from real GitHub Actions System2 Research CI run `37796797844`, job `113378243808` (V8 regression run `37796797829` success). Four dry-run probes are archived in `system2/evidence/S2_AUDIT_HIGH_DYNAMIC_REPRO_011_012_013_20261008_V0_1.json`. This evidence confirms the **OPEN** defect, not its repair; implementation remains BUILD_LANE-owned.



#### BUILD implementation handoff — 2026-10-09 00:52

- PR #901 merged as `98fa1f0d562a4e479d9a0e0eaa2e6dfd8f06a882`.
- Caller persistence batches are treated as untrusted and canonically rebuilt from whitelisted table/column contracts before the first D1 prepare/transport.
- SQL plans, row digests, identity digests, operation count and batch hash are recomputed; only regenerated INSERT statements execute.
- Every immutable insert receives exact post-write readback; statement ledger measures read/write/transport/readback counts and hashes.
- Decision -> factor/regime, correction -> decision, order -> decision, fill -> order and outcome -> decision lineage is guarded.
- AP-08 caller UPDATE-as-insert is rejected before `db.batch`.
- Exact-head PASS: CORR-011 `37814281548`; System2 Research CI `37814281345`; V8 Regression `37814281392`.
- Merged-main PASS: CORR-011 `37814464487`; System2 Research CI `37814464192`; V8 Regression `37814464250`.
- Durable evidence: `system2/evidence/S2_CORR_011_BUILD_IMPLEMENTATION_HANDOFF_20261009_V0_1.json`.
- BUILD_LANE does **not** self-close this HIGH correction; AUDIT_LANE must independently verify before `VERIFIED_CLOSED`.


#### BUILD implementation handoff — 2026-10-09 01:11

- PR #901 merged as `98fa1f0d562a4e479d9a0e0eaa2e6dfd8f06a882`.
- Caller batches are rebuilt canonically from whitelisted table/column contracts before any DB prepare/transport; supplied SQL, row digests, identity fields and batch hash are verification inputs only, never execution authority.
- AP-08 caller UPDATE-as-insert is rejected before `db.batch`; tampered SQL/hash/identity/table/column and concurrent/post-write divergence fail closed.
- Exact post-write readback verifies every inserted immutable row.
- Decision/factor/regime and order/fill/outcome parent lineage are fail-closed; decision corrections remain append-only through `s2_decision_corrections`.
- CORR-012 monotonic outcome maturation semantics are intentionally unchanged here.
- Exact-head PASS: CORR-011 `37814281548`; Research CI `37814281345`; V8 Regression `37814281392`.
- Merged-main PASS: CORR-011 `37814464487`; Research CI `37814464192`; V8 Regression `37814464250`.
- Durable evidence: `system2/evidence/S2_CORR_011_BUILD_IMPLEMENTATION_HANDOFF_20261009_V0_1.json`.
- BUILD_LANE does **not** self-close this HIGH correction; AUDIT_LANE verification is mandatory before `VERIFIED_CLOSED`.

#### AUDIT_LANE independent AP-08 closure — 2026-10-09 01:25

- Dedicated independent test merged through PR #905, run `37816240636` PASS; System2 Research `37816240323` PASS; V8 Regression `37816240412` PASS.
- Tampered caller INSERT SQL, batch hash/row digest and unauthorized column fail before database prepare/transport; valid INSERT receives exact readback; concurrent divergent post-write state rejected.
- Merged implementation blobs re-read from current main, all equal to BUILD PR #901 merge.
- Durable evidence: `system2/evidence/S2_AUDIT_INDEPENDENT_CORR011_CODE_CLOSURE_20261009_V0_1.json`.
- CORR-012 outcome maturation/cost provenance, CORR-013 sequence/NO_FILL, and real D1 guarded-writer physical protection remain separately blocked or unverified.


### S2-CORR-20261008-012 — Outcome monotonic updates can rewrite cost/performance provenance and erase excursions

- createdAt: 2026-10-08T11:30:54+08:00
- severity: HIGH
- status: OPEN
- routingClass: BUILD_LANE
- assignedRoom: System 2｜建置總控室
- observed: monotonic validation accepted MFE/MAE erasure, holding-session rewrite and replacement of strategy/cost provenance in `outcome_json`.
- required:
  1. bind every outcome to decision, strategy/version, Regime, execution, price-space, corporate-action and cost-model hashes;
  2. define exact per-field maturation monotonicity;
  3. use distinct versioned outcome records for assumption changes;
  4. keep signal-return scenarios separate from simulated fill net-after-cost results.
- durable audit: `system2/evidence/S2_EXECUTION_PERFORMANCE_CROSS_STRATEGY_REGIME_BATCH_AUDIT_20261008_V0_1.json` AP-05.
- finalDisposition: PENDING
- independent executed negative witness (2026-10-08 22:59 Asia/Taipei): `AP-05 MFE/MAE nulled and holding/cost/strategy lineage rewritten without blockers`, classification `UNSAFE` from real GitHub Actions System2 Research CI run `37796797844`, job `113378243808` (V8 regression run `37796797829` success). Four dry-run probes are archived in `system2/evidence/S2_AUDIT_HIGH_DYNAMIC_REPRO_011_012_013_20261008_V0_1.json`. This evidence confirms the **OPEN** defect, not its repair; implementation remains BUILD_LANE-owned.

#### AUDIT_LANE additional independent edge matrix — 2026-10-09 01:32

- Evidence: `system2/evidence/S2_AUDIT_CORR012_013_NINE_NEGATIVE_EDGE_MATRIX_20261009_V0_1.json`.
- PR #908 independently authored/merged; Actions `37817121691` ran all 5 cost/strategy/closed-holding/MFE/MAE rewrite probes; all classified `UNSAFE`.
- Research `37817122614` and V8 Regression `37817121306` succeeded, meaning the probe execution was valid, **not** that the vulnerability was fixed.
- Status stays `OPEN`, assigned to BUILD_LANE. Neither original acceptance nor physical/production readiness is credited.


### S2-CORR-20261008-013 — Execution/outcome session validation can misclassify unknown entry windows and accept reversed dates

- createdAt: 2026-10-08T11:30:54+08:00
- severity: HIGH
- status: OPEN
- routingClass: BUILD_LANE
- assignedRoom: System 2｜建置總控室
- observed:
  - an all-null OHLC entry window became `NO_FILL` with `DATA_UNKNOWN` quality;
  - execution and outcome paths accepted strictly numbered sessions whose market dates ran backwards.
- required:
  1. valid, unique, strictly increasing market dates tied to an official session calendar;
  2. distinguish proof-complete NO_FILL from DATA_UNKNOWN/HALT/LIMIT/LIQUIDITY blocked states;
  3. expose blocker intervals and denominator eligibility to performance aggregation.
- durable audit: `system2/evidence/S2_EXECUTION_PERFORMANCE_CROSS_STRATEGY_REGIME_BATCH_AUDIT_20261008_V0_1.json` AP-06.
- finalDisposition: PENDING
- independent executed negative witness (2026-10-08 22:59 Asia/Taipei): `AP-06 missing OHLC falsely finalized NO_FILL; reversed market dates accepted`, classification `UNSAFE` from real GitHub Actions System2 Research CI run `37796797844`, job `113378243808` (V8 regression run `37796797829` success). Four dry-run probes are archived in `system2/evidence/S2_AUDIT_HIGH_DYNAMIC_REPRO_011_012_013_20261008_V0_1.json`. This evidence confirms the **OPEN** defect, not its repair; implementation remains BUILD_LANE-owned.

#### AUDIT_LANE additional independent edge matrix — 2026-10-09 01:32

- Evidence: `system2/evidence/S2_AUDIT_CORR012_013_NINE_NEGATIVE_EDGE_MATRIX_20261009_V0_1.json`.
- PR #908 independently authored/merged; Actions `37817121691` ran all 4 invalid/duplicate/unqualified calendar and partial-OHLC probes; all classified `UNSAFE`.
- Research `37817122614` and V8 Regression `37817121306` succeeded, meaning the probe execution was valid, **not** that the vulnerability was fixed.
- Status stays `OPEN`, assigned to BUILD_LANE. Neither original acceptance nor physical/production readiness is credited.

#### 2026-10-09 AUDIT_LANE second independent AP-06 calendar and unknown-NO_FILL matrix

- Nine offline adverse cases returned `UNSAFE` in GitHub Actions run `37861039940`. Passing CI means successful reproduction, not CORR-013 correction.
- Date failures: nonexistent date, noncanonical date, weekend without official session proof, reversed dates, duplicated dates, and skipped official sessions without provenance.
- Price evidence failures: all OHLC unknown, high unknown, or low unknown in the eligible entry window yielded `state=NO_FILL`, even with `fillQuality=DATA_UNKNOWN` for the last three cases.
- Independent test: `system2/tests/audit_corr013_calendar_unknown_no_fill_matrix_v0_2.test.mjs`.
- Detailed receipt: `system2/evidence/S2_AUDIT_CORR013_CALENDAR_UNKNOWN_NOFILL_NINE_CASES_20261009_V0_2.json`.
- Required BUILD fix: authoritative exchange calendar/date binding, strict chronological session evidence and explicit `proofCompleteNoFill`, preserving `INCOMPLETE/DATA_UNKNOWN` rather than false non-fill denominator. Remains `OPEN`, no System1 or physical trade authorization.

#### AUDIT_LANE causal UNKNOWN then later CLOSE — 2026-10-09 10:42 Asia/Taipei

- Formal evidence: `system2/evidence/S2_AUDIT_CORR013_UNKNOWN_INTERVAL_LATER_CLOSE_4_CASES_20261009_V0_3.json`; independent test PR #943, Actions `37875799902` completed successfully with **4/4 UNSAFE** negative witnesses.
- Missing ENTRY/EXIT OHLC or unknown executable liquidity can be silently followed by `state=CLOSED`, `performanceEligible=true`, and a nonnull positive or negative after-cost simulated return. Prior `blockedObservations` is retained but not used to veto downstream performance.
- This is a new path-dependent AP-06 continuation blocker, **not** a new counted directive, no real execution and not a successful repair. BUILD_LANE must fail closed on unresolved causal unknown intervals while preserving genuinely observed closed-position controls.


### S2-CORR-20261008-014 — Bulk backtest can accept forged completion checkpoints and unproven PIT universes

- createdAt: 2026-10-08T11:30:54+08:00
- severity: CRITICAL
- status: VERIFIED_CLOSED
- routingClass: BUILD_LANE
- assignedRoom: System 2｜建置總控室
- observed:
  - a forged checkpoint with invalid `checkpointHash`, all dates completed and zero samples returned `allRequestedDatesComplete=true` without invoking loaders/evaluators;
  - universe rows have no required historical membership, availability or source lineage.
- required:
  1. recompute and reconcile checkpoint hash, partitions, samples, date summaries and rolling digest;
  2. immutable PIT universe receipt per date with listing/delisting and unknown-state handling;
  3. bind dataset, policy registration, evaluator/code, factors, Regime, execution and cost assumptions into run identity;
  4. reject zero-sample completion without a proved empty PIT universe.
- durable audit: `system2/evidence/S2_EXECUTION_PERFORMANCE_CROSS_STRATEGY_REGIME_BATCH_AUDIT_20261008_V0_1.json` AP-04.
- finalDisposition: VERIFIED_CLOSED — independently verified original code firewall; no physical/OOS/production acceptance.



#### BUILD implementation handoff — 2026-10-08 19:20

- PR #868 merged as `4dfa01cb3dd47845ed768e261f6a3d3d9191a9f7`.
- Backtest plan identity binds dataset/policy/evaluator/factor/Regime/execution/cost assumptions.
- Every replay date requires a hash-bound PIT universe receipt; checkpoint/date/partition/sample/rolling-digest accounting is recomputed before resume.
- Zero-sample completion is allowed only when a PIT universe receipt proves an empty universe.
- AP-04 forged completed checkpoint is rejected before loaders/evaluators execute.
- Exact-head PASS: CORR-014 `37743894631`; System2 Research CI `37743894530`; V8 Regression `37743894466`.
- Merged-main PASS: CORR-014 `37744022901`; System2 Research CI `37744022808`; V8 Regression `37744023076`.
- Durable evidence: `system2/evidence/S2_CORR_014_BUILD_IMPLEMENTATION_HANDOFF_20261008_V0_1.json`.
- Old handoff PR #869 is stale and must not replay its older governance files over current main.
- BUILD_LANE does **not** self-close this CRITICAL correction; AUDIT_LANE must independently verify before `VERIFIED_CLOSED`.
- independent AUDIT_LANE verification: `system2/evidence/S2_AUDIT_INDEPENDENT_CODE_CLOSURE_014_015_20261008_V0_1.json` (merged-code identity, targeted adversarial tests and GitHub Actions PASS, with explicit limits).


### S2-CORR-20261008-015 — D18 regime vectors can certify future/non-PIT optional contexts as PIT eligible

- createdAt: 2026-10-08T11:30:54+08:00
- severity: CRITICAL
- status: VERIFIED_CLOSED
- routingClass: BUILD_LANE
- assignedRoom: System 2｜建置總控室
- observed: a future 2030, `pointInTimeEligible=false` global-transmission context became a KNOWN RISK_ON dimension inside a 2026 vector marked PIT eligible.
- required:
  1. one uniform PIT/source/hash validator for every Regime dimension;
  2. dimension-level eligibility rather than a vector-wide boolean certification;
  3. fail affected activation, attribution and transition policy to UNKNOWN;
  4. verify component and vector hashes before downstream use.
- durable audit: `system2/evidence/S2_EXECUTION_PERFORMANCE_CROSS_STRATEGY_REGIME_BATCH_AUDIT_20261008_V0_1.json` AP-07.
- finalDisposition: VERIFIED_CLOSED — independently verified original code firewall; no physical/OOS/production acceptance.


#### BUILD implementation handoff — 2026-10-08 19:15

- PR #877 merged as `591728bfc1a2569e0bd5eb0d10ce71f8dd3e8055`.
- Uniform per-dimension PIT/source/hash validation covers KNOWN and CONTEXT_RAW Regime evidence; invalid optional evidence remains dimension-local UNKNOWN.
- Component receipt hashes, dimension evidence hashes and final vector receipt hashes are recomputed before downstream activation / attribution / transition use.
- Cross-strategy dependence comparison treats contaminated Regime attribution as MISSING common support, never zero or valid performance evidence.
- AP-07 future/non-PIT GlobalTransmission is UNKNOWN and cannot produce POLICY_ENABLED / POLICY_DISABLED.
- 36 optional-dimension negative cases cover future-date, wrong-clock, non-PIT, missing availableAt, missing hash and tampered receipt.
- Exact-head PASS: CORR-015 `37768619935`; System2 Research CI `37768619939`; V8 Regression `37768620380`; V8 Repair CI `37768620096`.
- Merged-main PASS: CORR-015 `37768765685`; System2 Research CI `37768765738`; V8 Regression `37768765666`.
- Durable evidence: `system2/evidence/S2_CORR_015_BUILD_IMPLEMENTATION_HANDOFF_20261008_V0_1.json`.
- BUILD_LANE does **not** self-close this CRITICAL correction; AUDIT_LANE must independently verify before `VERIFIED_CLOSED`.
- independent AUDIT_LANE verification: `system2/evidence/S2_AUDIT_INDEPENDENT_CODE_CLOSURE_014_015_20261008_V0_1.json` (merged-code identity, targeted adversarial tests and GitHub Actions PASS, with explicit limits).


## 2026-10-09 18:09 Asia/Taipei — CORR-003 independent A1–A4 reverify; A5/A6 new blockers

- Source-level A1–A4 prescribed positive/negative boundary tests independently PASSed on PR #989 (System2 Research CI `37915666601` PASS; V8 Regression `37915666467` PASS; 273 System2 test files). This is **not physical D1 acceptance**.
- Independent negative `GQL_PARTIAL_ROWS_READ_TREATED_AS_ZERO`: **UNSAFE** — actual quota gate GraphQL parser accepts an HTTP-200 partial metric group without `rowsRead` as known `rowsRead=0`; synthetic otherwise-evidence-authorized P0 evaluator then grants a physical reservation. This is a source-level fail-closed gap, not evidence Cloudflare delivered such a payload.
- Independent negative `MALFORMED_RESERVATION_LEDGER_ROW_SILENT_SKIP`: **UNSAFE** — actual ledger summarizer discards an unparsable reservation, returning outstanding read/write reservation zero; synthetic otherwise-authorized P0 evaluator then grants. This is a source-level potential underbudget, not observed physical corruption.
- Full evidence: `system2/evidence/S2_CORR003_INDEPENDENT_POST_FIX_REVERIFY_20261009_V0_1.json`; test: `system2/tests/audit_corr003_post_fix_independent_reverify_20261009_v0_1.test.mjs`.
- **Status routed back to `FIX_IN_PROGRESS` / `REMEDIATION_LANE`**, same existing HIGH directive; conflict units `system2/scripts/run_d1_account_quota_gate_v0_1.mjs` (A5 GraphQL validation) and `system2/runtime/d1_account_quota_budget_v0_1.mjs` (A6 ledger integrity). AUDIT_LANE must independently reverify corrections; no auditor-owned runtime modifications.
- Write/read System1 reserves remain `false/null`; measured `2,825` stays observational only. Physical closure still requires evidence-qualified System1 reserve, bounded real multiwriter UTC day, next real System1 23:35/23:55 normal persistence without quota collision, and all original physical acceptance criteria. No change to System1 Formal Core, trading signals, capital, production runtime, or billing.

## 2026-10-09 AUDIT_LANE — CORR-003 PR994 A5/A6 independent reverify, new A7 blocker

- Independent A5 GraphQL malformed/partial/null/string/wrong-date/duplicate group, account cardinality and explicit unknown-budget deferral: **SOURCE-LEVEL PASS for enumerated inputs**.
- Independent A6 malformed ledger and current full-identity hash tamper: **SOURCE-LEVEL PASS for enumerated inputs**.
- **NEW A7 UNSAFE:** actual current production `loadQuotaLedger` accepts `sha256(observed payload)` as legacy-hash compatibility for a V0.2 receipt. The same payload-only hash allows mutated `status` and `expected_payload_json` to pass as integrity VALID; a synthetic otherwise-authorized P0 writer can be granted a budget. There is no evidence that a real physical D1 receipt was tampered; this is a reproducible source-level trust-boundary bug.
- Independent PR [#1000](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1000); System2 Research CI [37924636321](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37924636321) PASS (276 test files) with explicit `S2_CORR003_ADDITIONAL_PROBE: UNSAFE`; V8 Regression [37924636337](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37924636337) PASS.
- Test: `system2/tests/audit_corr003_a5a6_independent_legacy_hash_reverify_20261009_v0_1.test.mjs`; evidence: `system2/evidence/S2_CORR003_A5_A6_INDEPENDENT_REVERIFY_A7_20261009_V0_1.json`.
- Route **same HIGH CORR-003** to **FIX_IN_PROGRESS / REMEDIATION_LANE**. Only REMEDIATION owns `system2/scripts/run_d1_account_quota_gate_v0_1.mjs`. The auditor does not alter this conflict unit. Separate fix must require full identity hashing for V0.2+ and only allow verifiable, bounded historical legacy compatibility.
- System1 reserved write/read values remain **false/null**. Observed 2,825 rowsWritten is not an authorized reserve. No physical D1, R2, System1 Formal Core, production, billing, trading signal or capital mutation performed. Physical multiwriter UTC-day / System1 23:35 and 23:55 real persistence / original closure gates **remain open**.

## 2026-10-09 20:51 Asia/Taipei — CORR-003 A7 independent source-level verification

- REMEDIATION PR #1008 merge `7325d4343aec` independently audited against latest main, without adopting implementation-owner assertions.
- AUDIT_LANE PR #1013 executed the actual D1 ledger loader under controlled fake D1 inputs, Research CI **37932644800 PASS** (280 System2 test files) and V8 Regression **37932644642 PASS** (12/12).
- **A7 independent source-level PASS**: V0.2 payload-only legacy hash, status mutation, and expected-payload mutation all fail closed; authentic V0.2 full-identity receipt VALID; independently assembled historical V0.1 reservation and reservation/result pair VALID; five V0.1 metadata/schema/budget/paid tamper cases INVALID.
- A5 malformed GraphQL and A6 corrupted ledger source-level replays remain PASS. A1–A4 established boundaries remain in the CI suite; not reclassified as physical.
- Independent source-level evidence: `system2/evidence/S2_CORR003_A7_INDEPENDENT_SOURCELEVEL_REVERIFY_20261009_V0_1.json`. Test: `system2/tests/audit_corr003_a7_post_remediation_independent_20261009_v0_1.test.mjs`.
- **HIGH directive transitions to VERIFYING, not VERIFIED_CLOSED.** Real bounded same-UTC-day multiwriter physical grant/result/no-collision acceptance, independently evidence-qualified System1 D1 write/read reserves, and subsequent real Taiwan trading-day System1 23:35/23:55 normal persisted business operation are still absent. Original physical acceptance criteria remain fully binding.
- System1 write/read reserves remain **false/null** and observed `2825` rowsWritten is **not** an approved reserve. No D1/R2 production mutation, trading signal, System1 Formal Core, capital, Cloudflare billing or paid tier change was used for this audit.

## 2026-10-09 23:52:49 Asia/Taipei — AUDIT_LANE final physical closeout decision for CORR-003

- Exact latest source-level A1–A7 independent acceptance stays intact; this audit does **not** repeat remediation or rewrite previous historical decisions.
- Independent readback of all **19 canonical original acceptance criteria**, matched exactly against Correction Queue: **15 source-level independently accepted**, **3 (#10, #14, #15) prospective physical positive requirements still unfulfilled**, **1 (#16) real historical collision NEGATIVE witness reconciled**. Historical quota failure is NOT post-fix no-collision acceptance.
- Independent **P01–P05 = 0/5 physical gates accepted**; supporting observations documented 15/38, not physical passes.
- P01/P02: only two genuine healthy whole V7_DB days (2026-09-21 2825/133037 rowsWritten/rowsRead; 09-22 1635/19533), no per-run attributable 23:35 or conditional 23:55 physical usage, approved reserve write/read still false/null.
- P03: direct raw GitHub logs confirm five genuine registered-writer daily events, all **QUOTA_BUDGET_DEFER / PUSH_READ_ONLY_ONLY**, not real authenticated GRANT → physical mutation → result receipts.
- P04: 2026-10-07 real 126498 rowsWritten combined shared-account quota collision and failed primary; 2026-10-08 C1 scheduled readback **C1_GENERATION_NOT_FOUND / UPSTREAM_ARTIFACT_MISSING**; no later naturally successful, same-generation System1 KV+D1 business persistence. As of October 9, October 12 ordinary trading-day proof is future and cannot be fabricated.
- P05: genuine Oct08 12/12 official-source dates and 11,843/11,843 source keys accepted **SOURCE ONLY**; real physical Hot D1 scout 0/36, full census 0/11,843, missing keys UNKNOWN; actual CLI quota preflights DEFER and repair guard blocks incomplete census.
- **Final verdict: NOT_ELIGIBLE_FOR_VERIFIED_CLOSED.** Keep existing HIGH / VERIFYING and official implementation lane unchanged. No runtime/cloud quota permission inferred.
- Durable AUDIT_LANE verdict: `system2/evidence/S2_CORR003_AUDIT_5_PHYSICAL_19_ORIGINAL_FINAL_DISPOSITION_20261009_V0_1.json`; adversarial proof firewall: `system2/tests/audit_corr003_5physical_19criteria_verdict_v0_1.test.mjs`.
- Producer handoff remains Issue [#1024](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1024) to System1 for P01/P02/P04, Issue [#1026](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1026) to DATA for P03/P05. AUDIT_LANE alone can consider eventual VERIFIED_CLOSED only with newly qualified real physical receipts across all gates.
- No Cloudflare D1 SQL/paid billing, System1 Formal Core, production trading logic, capital, pushes or Cron actions were performed during this audit.
