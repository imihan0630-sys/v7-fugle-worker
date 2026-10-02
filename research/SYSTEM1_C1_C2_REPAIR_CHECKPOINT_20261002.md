# System 1 C1/C2 continuation — S1-C1-005 / S1-C2-002

Saved 2026-10-02 15:03 Asia/Taipei. Status: ENGINEERING_VERIFIED / LIVE_BLOCKED.
Canonical base main: c9548bc30699a9e032b71d4618b4ba0e5b49db7a.
Remote engineering commit: c452642dcccad6f0d7608629889e69b18661393b.
Draft PR: https://github.com/imihan0630-sys/v7-fugle-worker/pull/306
Branch: research/system1-c1-c2-continuation-20261002.
This checkpoint's documentation commit is its Git history; code and fixture evidence refer to the engineering commit above.

## Recovery of prior progress

The C1/C2 20261002 checkpoints are on open draft PRs #292/#293, not main.
Their existing classifiers, ledger, tests and historical checkpoint text were carried forward onto latest main, preserving parallel research and System2 changes.
No new version was assigned to Production: 8.15.1 is an isolated repair candidate only.

## C1 confirmed code defects and repair

1. Stage-selection calls the same scanner with dryRun=true, then persists Formal plans. Original C1 persistence runs only for non-dry-run scans; the stage route never stored its C1 generation. This is a confirmed code coverage gap, not proof of the sole cause of the 10/01 outage.
2. Original immutable replay returned verified success without inspecting stored chunks; insertion readback checked counts, not content. Same-row-count corruption could appear verified.
3. Original chunk bound measured JavaScript characters, not UTF-8 bytes, and permitted 250,000 characters. D1 text values require a smaller byte bound. The synthetic ordinary 2,000-row witness did not itself exceed this bound; the old implementation remained unsafe for larger/multibyte rows.
4. C1 construction was synchronous and unguarded inside the Formal selector. A research exception could abort Formal selection.

Candidate `scripts/apply_v8_15_1.py` adds:
- an exception firewall around C1 construction, with original scoring/ranking/selection retained;
- request-local, non-enumerable receipt handoff for stage-selection, without serializing full receipts into KV/public preview;
- safe normal/staged persistence after verified selection; current Taipei session, post-13:30 decision clock and no future/backdated decision required;
- past-session recovery explicitly NON_PROSPECTIVE_SESSION_CAPTURE, never a manufactured historical WATCH;
- 90,000 UTF-8 byte chunks and explicit oversized-row rejection;
- full stored SHA-256/universe/count/chunk verification on insert, immutable replay and first export page; header conflicts rejected;
- failed/unverified saved/chunk quantities are null, never measured zero; research failure cannot change Formal strategy or authorize trade/push.

No recovery/selection/delivery POST was invoked. Normal failed upstream scans remain blocked, not zero-pick observations. C1 does not supply independent corporate-action, execution or broker-risk attestations; those remain UNKNOWN.

## C2 binding

`research/system1_c1_c2_collection_v0_1.mjs` consumes a single pinned, complete, digest-verified C1 generation. It checks all relevant headers across pages, session clocks, unique symbols and complete counts, then requires the same-date completed Formal pipeline/config and matching verified C1 generation/counts/digests before producing a paired ledger.
The ledger preserves Formal first failure, independent PASS/FAIL/UNKNOWN gates, unknown Formal qualification/selection counts, safety deficits, and buyAuthorized=false/allocation=0/signal=null. Unknown qualification is not a rejected candidate. Conditional SHORT gate coverage is not WATCH or performance.
`tests/collect_system1_c1_c2_evidence.mjs` is a dormant owner-gated CLI. No workflow references it. Existing C1 collector, scheduled evidence workflow and production deployment workflow are byte-identical to main. New workflow executes offline fixtures only and uploads test exit codes, not production data.

## Verified tests and CI

Remote code-head CI:
- isolated offline candidate build + complete regression: 57/57 PASS, run 36976181250, job 110740409899;
- existing V8 Regression: PASS, run 36976181202;
- existing V8 Repair CI: PASS, run 36976181151.

New storage/clock/UTF-8 adversarial assertions: 28 PASS. Paired collector assertions: 20 PASS. Prior isolated assertions: 71 PASS; C1 readiness: 28 PASS; C2 ledger: 19 PASS. All fixture-only, not market performance evidence.
456 existing function bodies remain text-identical. Formal selector differs only in the C1 capture firewall and error return; A/B, ranking, 3+3+3, allocation, 15m execution, signals, push and System2 remain locked.
Windows local suite was 56/57 because sandbox Node spawnSync returned EPERM in the D18 nested test; the D18 test passed directly. Linux CI independently passed the unchanged nested test and all 57 commands. Local validation adapted the unavailable patch executable to git apply only in the disposable build copy and used LF output; no production source patch chain workaround was committed.

## Live status and approval boundary

Production GET /api/version: 8.15.0-c1-population-receipts; testMode=false; KV/D1=true. Public recommendations and the existing Regression workflow's authorized read-only diagnostic still show the 2026-09-29 staged result, deferred daily report and an incomplete pipeline; public last attempt is 2026-09-30 INCOMPLETE. This does not establish a clean 10/01 cohort.
No new full live C1 receipt or live C2 ledger is claimed. No return/fill/cost/utilization or optimization maturity uplift.
Automatic approval review rejected changing the production deploy workflow and adding live production-artifact uploads to public GitHub. Those actions were removed. Publishing the isolated branch was allowed only after readback proved the existing production collector/deploy workflows unchanged and the new workflow fixture-only.
PR #306 stays DRAFT / NO MERGE / NO DEPLOY. Because research/tests changes on main can trigger shared Production deployment, a merge is not harmless. The current production chain still ends at 8.15.0; do not claim this PR activates 8.15.1.

## Exact continuation

1. Read latest main and PR #306 head/checks; preserve concurrent changes. Do not restart #292/#293.
2. Owner review: approve the C1-only shared runtime deployment integration and the exact research artifact destination/payload. Concrete review packet: SYSTEM1_C1_C2_CLASS_B_ACTIVATION_REVIEW_20261002.md. Formal strategy deployment remains forbidden.
3. After approval, update all guarded build chains consistently and use the existing deployment/backup/rollback path. Verify version, bindings, TEST_MODE, Cron, targets and existing plans. Do not trigger a business scan, resend or historical recovery solely for acceptance.
4. Observe the next genuinely completed same-day Formal scan. Require its researchC1Population.status=VERIFIED, saveOk/readbackVerified=true, full paginated C1 hashes/counts and same-generation Formal linkage. Record upstream failures as explicit blockers; diagnose them separately rather than fabricating receipts.
5. Only then invoke the dormant paired collector with the existing normal administrator authorization. Save outputs to the explicitly approved destination. Keep CA/execution/account risk UNKNOWN until independently attested.
6. Record first true live C1/C2 generation identifiers, scan/source clocks, commit/version, hashes, coverage and negative cases. Forward outcomes and any C3/C4 or Formal switch require their own frozen controls and approval.

Rollback: discard/revert the isolated candidate before activation; no Production rollback needed now. After an approved activation, use existing code-only rollback and preserve immutable research generations.
