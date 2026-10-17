# System 2 BUILD｜Scheme C source-scheduler origin and first-deployment chronology physical proof V0.1

As of: 2026-10-17, Asia/Taipei
Scope: Class A read-only BUILD integration; no provider market GET, new Cron, Cloudflare D1/R2, current Stage1 gate, trade or System1 Formal change.

## Newly verified underlying causal timeline

DATA #1068 PR #1466 re-read native GitHub REST run/job and exact original source/audit/dual receipts, confirming **SOURCE Run #38934081985** actually had native GitHub \`event=schedule\`, original Cron \`15 12 * * 1-5\` (20:15 Taipei nominal), GitHub run created **2026-10-17 00:42:40 Taipei**, 267.667-minute enqueue delay, and exact independently audited **122/122** original TWSE/TPEx 61-session market/date pairs. Its independent original AUDIT **Run #38934321405** was created 2026-10-17 00:44:34 Taipei and completed 2026-10-17 00:45:39 Taipei. This misses the **2026-10-16 T23:45** cutoff, and no same-cut Strategy PIT/Shadow/Frozen is certified.

A separate critical timeline: the downstream Scheme C GitHub \`workflow_run\` workflow first joined main in commit [f18c761ee4bc82eb32b27f0ac5a7523cfaaf9ed0](https://github.com/imihan0630-sys/v7-fugle-worker/commit/f18c761ee4bc82eb32b27f0ac5a7523cfaaf9ed0), dated **2026-10-17 02:25:23 UTC = 10:25:23 Taipei**, nearly ten hours **after** the October 16 audit finished. Therefore the absence of a natural Oct16 Scheme C consumer run is **not** evidence that a deployed listener missed that parent; it was not installed at parent completion. PR historical replay and operator manual recovery are not equivalent to postdeployment spontaneous workflow-run delivery.

## This BUILD change

- \`system2/runtime/scheme_c_source_cron_natural_chain_readiness_v0_1.mjs\`: pure hash-bound Class A join of DATA's independently reconciled original scheduled source and audit metadata, immutable original \`workflow_run\` audited evidence, first-on-main workflow deploy commit and optional future actual consumer plus signed BUILDER delivery receipts. **Absent supplied child is not exhaustive negative proof.**
- \`system2/scripts/run_scheme_c_source_cron_natural_chain_readiness_readonly_v0_1.mjs\`: offline existing-file-only \`wx\` JSON receipt, no network.
- \`system2/tests/scheme_c_source_cron_natural_chain_readiness_v0_1.test.mjs\`: eight suites, including false manual/PR consumer, forged GH source schedule, swapped audit, cut lying, tampered SOURCE and BUILD signatures, and fabricated historical predeployment child.
- \`.github/workflows/system2-build-scheme-c-source-cron-deployment-proof.yml\`: **PR-only, no schedule or workflow_dispatch**, exercises archived DATA native SHA artifact from actual PR-head Run #39016618423 plus fresh GitHub REST original runs and exact first main workflow commit. Creates an independent compact readable signed BUILD chronology Artifact. None of these steps requests market data or touches D1, R2, Worker or Cron.

## Exact new-trading-day P0 future acceptance

For 2026-10-19 (only if an officially eligible Taiwan trading day), later SOURCE native schedule event must independently match the source original, official same-T 61 sessions × two markets 122/122, successful exact source→independent audit, **a downstream natural Scheme C \`workflow_run\` after listener deployed**, the precise consumer run and signed handoff/delivery-origin/visible report/acceptance Artifact. If late, present as LATE_SOURCE, not as a T23:45 as-of decision. Merely observing a consumer run without the downstream signed artifact or having DATA's true scheduler event independently is insufficient for full P0 acceptance.

Result categories are exclusive: \`PARENT_AUDIT_FINISHED_BEFORE_SCHEME_C_WORKFLOW_DEPLOYMENT\`; \`PARENT_AFTER_DEPLOYMENT__NO_CHILD_EVIDENCE_SUPPLIED\`; \`NATURAL_CHILD_GITHUB_RUN_ONLY__ARTIFACT_CHAIN_PENDING\`; \`CRON_SOURCE_TO_NATURAL_NONPIT_DELIVERY_RECONCILED\`. Even the last means only that read-only receipts have been reconciled: **full new-market day P0 acceptance, PIT-A, selection count, zero-pick, Shadow and physical Frozen remain separately controlled**. Current actual 2026-10-16 PIT-A real two-symbol acceptance remains 0/2, same-day ordinary-share denominator UNKNOWN.

No need for a new hourly poll, source GET, automatic retry, paid plan, or owner-gated Cloudflare write. Next BUILD continuation on official actual market T: read SOURCE native exact GitHub run provenance and independent AUDIT artifact, then reconcile live natural Scheme C child and human-readable report. If not dispatched despite being deployed, separately diagnose GitHub event and workflow policy without assuming an outage. DATA #1068 remains source original owner; BUILD #1132/#1234 remains consumer; AUDIT independently certifies physicals.
