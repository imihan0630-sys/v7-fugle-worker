# System 2 A1 — Ten Official-Session Cron Reliability Rollup V0.1

Status: **Class A research-only**, 2026-10-16 Asia/Taipei. Related owner instruction: separate actual source completeness from punctuality and investigate reliable start.

## Implementation and authority

This extension to [A1 three-axis audit](SYSTEM2_A1_SOURCE_SCHEDULE_DUAL_ACCEPTANCE_AND_RELIABILITY_STUDY_V0_1.md) creates a **fourth, trend-only receipt** in the existing `System2 Shared Official A1 Independent Source Audit (READ ONLY)` workflow. It does **not** add or move a GitHub Cron, install a Cloudflare Worker/Cron, call market providers again, add secrets, use paid services, modify System1 or authorize selection/Frozen.

- Source integrity: `independent122SourceIntegrity` = separate original SHA+date+122/122 readback, not workflow-green.
- Schedule punctuality: `deliveredPunctually` = original `github.event.schedule`, matching real original GitHub `run.created_at`, signed separate audit, nominated 15-minute **research** target. GitHub does NOT certify a particular nominal occurrence timestamp; it remains explicitly inferred.
- Decision time: `sourceAndIndependentAuditBeforeDecisionCutoff` = valid source/audit/Stage1 sequence before fixed T+1 01:59. Even successful source clock does **not** certify historical ordinary-share PIT or company-action continuity. `selectedCount=null` and no Frozen.
- Rolling tracking starts with **2026-10-16** trading date, after actual #1380 deployment. Only the latest up to 10 original official trading dates from the already independently audited A1 manifest form the denominator. **2026-10-15 historical runs are excluded** because their `github.event.schedule` was not preserved and their exact nominal slot cannot be proved by date-order guessing.
- Each observed matching schedule source Run (main, exact workflow path, event `schedule`, attempt-one success) must match a signed independent `dual-acceptance-receipt.json` from an actual successful downstream independent audit, exact runId+created timestamp+Cron and 15-minute classification. Only tiny ~1k-byte downstream artifacts are read. No 40MB source backfills are downloaded for the reliability rollup.
- `punctualityAmongAttributedRunsPct`, `acceptedSourceRateAmongAttributedRunsPct` and `sourceDecisionClockRateAmongAttributedRunsPct` are **three distinct fractions with the same observed/attributed run denominator**, not an all-schedules reliability rate. If denominator zero: `null`, not `0%`.
- Expected slots: 3 per official trading date. A slot matures only **48 hours after its nominal time**, and only after an exhaustively enumerated GitHub REST schedule census may it be marked `NOT_OBSERVED_AFTER_48H_FULL_CENSUS_NOT_CONFIRMED_DROPPED`. Even then **missingDeliveryConfirmed=false**: GitHub may have dropped or delayed an occurrence; provider does not expose perfect proof of a missed job. Incomplete REST paging, invalid receipt, unassigned schedule Run, duplicate source, pending time → **UNKNOWN / REVIEW**.
- Artifacts 90-day `s2-a1-ten-session-cron-reliability-<audit_run_id>`; signed `rollupHash`. GitHub Actions artifacts are a research record, not create-only D1 Frozen.

## Current physical baseline, original GitHub job timestamps

2026-10-15 T preceding instrumentation: all 3 original SOURCE schedule jobs began within **3 seconds of run creation** and each finished the job within **96–103 seconds**. Evidence [#38774319744](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38774319744), [#38793471310](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38793471310), [#38797319008](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38797319008). Two missed the owner T+1 01:59 deadline. Root cause inside GitHub dispatch **cannot be independently diagnosed from public GitHub REST**; do not attribute to runner queue or slow source data.

After original #1380 postmerge [#38842286840](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38842286840) actually produced a three-axis receipt for T=2026-10-15 with SOURCE 122/122 PASS, `NOT_APPLICABLE_NON_SCHEDULE` (producer source was a `push`), and OUTSIDE decision time. It MUST NOT enter future scheduled numerator. Rolling trends commence only with subsequent real official scheduled observations; don't call 0/0 a failed rate.

## Next operational comparison

Evaluate at least 10 original eligible trading days. Report: official sessions, expected 3×slots, matured slots, attributed source Run count, 15-minute on-time of attributed runs, 122/122 of attributed, timely decision source of attributed, unobserved slots **not proven dropped**, count of unattributed Runs, census completeness and failures. Preserve original per-day/schedule/run link.

If repeated **pre-Run-creation** delays remain greater than 15 min or miss 01:59, file actionable GitHub Support evidence; GitHub says scheduled jobs may be delayed/dropped under load, and current **:15/:45** clocks already avoid the top-of-hour peak. Moving to :17 without data is not a reliable fix. For hard-time startup, a truly independent clock could dispatch safely, but **requires explicit owner consent** on a new external scheduled service, scoped token/write permission or Cloudflare deployment, verified quotas, and independent PIT/no-double-run acceptance. No silent schedule, secret, Cloudflare or V8 changes.

Reference: [GitHub official schedule-event limits](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).
