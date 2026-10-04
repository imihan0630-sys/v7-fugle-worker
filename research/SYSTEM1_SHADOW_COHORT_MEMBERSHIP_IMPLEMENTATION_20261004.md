# System 1 Shadow Cohort Membership V8.17.0 candidate

Status: IMPLEMENTED_LOCAL_REVIEW_86_OF_86_PASS / REMOTE_CI_PENDING / PRODUCTION_APPROVAL_REQUIRED
Branch: `codex/system1-shadow-cohort-membership`
PR: https://github.com/imihan0630-sys/v7-fugle-worker/pull/454 (open; do not merge without owner Production approval).
Fresh implementation baseline: `0aab87e2295385ab325ba8e3a30dc40184a42219`.
Production baseline independently read: `8.16.0-zero-pick-prospective-capture`, TEST_MODE=false, KV/D1=true.
Owner explicitly approved Shadow Cohort Membership Class-B implementation in the controlling handoff and current Codex session. The owner explicitly requires stopping at the concrete PR's Production approval gate.

## First tranche implemented

The immutable C1 generation is the only full-population decision parent. No duplicate candidate snapshot table, new scoring path or qualified-list/cutline owner is introduced. PVE-156 retains qualified-list/cutline ownership.

The guarded `apply_v8_17_0.py` appends to V8.16.0 and never edits the repository's baseline Worker directly. This additive research capability uses feature version V8.17.0 under VERSIONING.md. Changes to existing functions are restricted to `buildC1PopulationReceipt` and `persistCompletedC1Safe`.

C1 adds the actual `applyMarketConsensus` result tuple for qualified rows (six comparator fields, consensus sources/bonus, pool insertion ordinal). Rejected zero-pick tuples keep their separate V8.16 counterfactual semantics. Setup first-failure rows retain full A/B check patterns and raw setup metrics before research sample truncation. Liquidity rejected/low-volume rows retain additional same-request institutional inputs and ret60/volatility20 when available. Missing fields stay null/UNKNOWN. No source-event timestamp is invented.

New additive tables:

- `trade_research_population_receipts`: one first-known generation per scan date and membership schema, parent C1 digest, full reason x pool counts, frozen frames, expected sample counts, overlap matrix and semantic fingerprint.
- `trade_research_candidate_memberships`: overlapping symbol/family identities referencing exact C1 generation and per-row canonical SHA-256. No independent rescoring or copying of the parent feature snapshot.
- `trade_research_cohort_quality_overlays`: append-only QA keyed by generation, symbol, membership, quality rule and observation time. Same identity/same fingerprint is idempotent; different content is a conflict.

The proposed date/version identity is implemented through the unique parent date/schema plus generation child foreign keys. This retains the first complete generation on same-date reruns rather than replacing it with the newest C1 generation. A later conflicting scan may have its own valid C1 receipt but cannot overwrite cohort evidence.

Population plus memberships commit in one atomic D1 batch. Readback verifies fingerprints, exact expected/persisted family x pool counts, complete membership digest, complete C1 digest and exact parent row hashes. No delete/upsert/update of historical memberships or legacy Shadow rows. A cohort failure is contained inside successful C1 persistence and cannot change Formal plans, push or execution.

## Frozen sampling/estimands

The existing Class-A semantic classifier and stratified hash sampler are reused, with the classifier's prototype ranks explicitly discarded. Actual tuples come only from the same selector's C1 result, never a second scoring pass. The patch SHA-pins existing Class-A dependencies.

- SELECTED is retained (max three per pool); QNS is sampled per pool.
- FIRST_FAILURE uses exact reason x pool strata, with full counts before caps. Counts are descriptive ordered first failures, never marginal gate contribution.
- CHANNEL_NEAR_MISS uses pool x nearest channel x full A/B failed-check pattern; UNKNOWN patterns remain labeled UNKNOWN. No global top-12 or outcome distance score.
- INDEPENDENT_BROAD_MARKET_CONTROL uses the frozen legacy eligibility frame (feature admitted, history>=60, close>=10, original pool minLots) **before** focal caps. Membership overlap is allowed and reported.
- RESIDUAL_CONTROL uses that frame minus complete preregistered focal populations: qualified, setup first-failure, base-passed downstream, and the three liquidity-rejection families. Generic FIRST_FAILURE is a descriptive audit sample, not an additional focal estimand. Broad and residual are separately named, counted and sampled.
- The first consumer includes all three exact liquidity rejection reasons plus a descriptive low-volume exception-pass sample. No liquidity threshold changes or claim of recovered Formal candidates. Missing spread/depth does not become exception PASS.

Sampling cap is frozen at six per stratum (selected three), with at most 600 memberships. Frame receipts/individual stored values are bounded at 90,000 UTF-8 bytes; an overlay bundle must be <10 MB. Exceeding a budget blocks research only and preserves full C1/Formal execution. Quality appends have a 5,000-per-generation admission guard. Production CPU/storage observation remains required; local timings are not a platform guarantee.

## Readback/collector

Protected endpoints use normal ADMIN_TOKEN authorization:

- GET `/api/research/shadow-cohort`: explicit date or immutable generation; complete membership pagination, whole-generation verification, coverage and pinned quality watermark.
- POST `/api/research/shadow-cohort-quality`: bounded QA codes/state only, exact immutable parent hash, append/idempotency/readback. No business scan or provider request.

Quality watermark is an append sequence, so a later annotation with an earlier observedAt cannot leak into already-pinned pages. Each page's quality rows join exactly its membership keyset.

The existing C1/C2 collector appends a `shadowCohort` artifact section, independently recomputes expected frames/memberships/fingerprints from the same verified C1 generation and joins the existing C1 gate-overlap observations. It rejects changed generations, truncated populations, fingerprints and quality snapshots. Legacy C1 without the capture marker triggers no new endpoint request. Failed new readback does not alter existing C1/C2/C3 behavior. The daily workflow and schedule are unchanged.

`captureIntegrity=HEALTHY` means complete verified persistence, not economic validity. Independent gates remain the existing C1 observer's PASS/FAIL/UNKNOWN evidence, never first-failure reinterpretation. `evidenceQualityEligibility=UNKNOWN`, `eligibleForInference=false`, `promotionEligibility=false`; quality findings are explicit annotations, not automatic promotion.

## Local milestone evidence

- Guarded build and Worker syntax PASS.
- Dedicated runtime/SQLite-D1/collector test PASS: immutable replay/conflict, atomic injected failure, first-known generation retention, append-only quality, watermark pagination, full parent linkage, broad cap invariance, overlap, residual separation, reason strata, near-miss strata, zero/UNKNOWN, legacy no backfill and provider tripwire.
- Actual selector fixtures with six and zero selections retain identical plans/capital/diagnostics. Capture failure injection retains Formal results. All runtime outside the two precise plumbing functions, new isolated modules/routes and version label is byte-identical to V8.16.0, including old Shadow writer/reader, scoreCandidate, applyMarketConsensus, rankFn, signals, 15m, push and order.
- Existing zero-pick collector and C1/C2 collection tests PASS.

| Full C1 rows | C1 UTF-8 bytes | Maximum C1 chunk | New memberships | Overlay bytes |
|---|---:|---:|---:|---:|
| 500 | 2,294,828 | 87,165 | 30 | 47,856 |
| 1,000 | 4,588,581 | 87,165 | 30 | 47,886 |
| 2,000 | 9,176,082 | 87,165 | 30 | 47,824 |

Scale fixtures contain COMPLETE zero-pick tuples plus qualified actual tuples and Chinese names; actual D1 persistence/readback is exercised. Separate mixed-population fixtures exercise larger overlapping membership counts. Counts/timings above are fixtures, never prospective market samples.

Local complete isolated review: 86/86 PASS, including all Regression test commands. Remote Regression, Repair CI and isolated review plus the final exact PR/head must be checked before presenting the approval packet.

## Scope limitations and rollback

No standalone ATR/target/fundamental study, historical migration, external provider capture, forward-outcome join, new outcome schedule, or inference/promotion is added. Legacy Shadow remains explicitly LEGACY_MUTABLE_ARCHIVE and is not repaired retrospectively. Independent source authenticity/CA/execution/account gaps remain UNKNOWN. Formal Core and System 2 are untouched.

The concrete PR changes the guarded runtime and deploy workflow, so merging main would trigger Production deployment. **Do not merge or dispatch deployment without explicit approval of this PR.**

Rollback: use the existing code-only deployment backup/rollback path to the verified pre-change V8.16.0 artifact, preserving KV, D1, targets, configuration and all four Cron expressions. Additive cohort tables may remain unused; do not delete captured evidence or downgrade by re-scanning. C1 and legacy Shadow continue on the prior code. Backup/version/readback verification remains mandatory on any approved deployment.

`FIRST_PROSPECTIVE_SHADOW_COHORT_READBACK=PENDING_PRODUCTION_APPROVAL_AND_GENUINE_TRADING_SESSION`
`FIRST_PROSPECTIVE_C1_CHILD_READBACK=PENDING_NEXT_GENUINE_TRADING_SESSION`
`economicSuperiority=UNKNOWN`; `formalOptimizationCandidate=NONE`; Formal Core LOCKED.

## Exact next action

Implementation, full local 86/86 review, branch publication and PR #454 are complete. Initial remote Regression (37169555932) and isolated review (37169555837) passed. Repair CI (37169555830) exposed a missing V8.17 apply step in its separately enumerated build chain (ENOENT pre-V8.17 artifact); the workflow step is repaired and a three-workflow lineage guard now covers Regression/Repair/Deploy.

Continue by checking all three CI workflows on the current exact PR #454 head; diagnose/retry any failure, then stop for explicit owner Production approval. The PR description is the durable final CI/head approval packet, so read it and the current head rather than rerunning already-passing local work. No merge, deploy, genuine capture or economic result has been claimed. Concurrent main changes through `65f39d47881d12d7b5a191f253c0247f8f71c7bf` were research/System2 changes with no System1 runtime conflict.

Monitor: https://fugle-test.imihan0630.workers.dev/
