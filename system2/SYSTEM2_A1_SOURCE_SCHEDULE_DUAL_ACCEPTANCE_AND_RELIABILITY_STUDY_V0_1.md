# System 2 A1 — Dual Source/Schedule Acceptance & Punctuality Diagnosis V0.1

**Research-only / Class A | 2026-10-16 Asia/Taipei | No Cron change, no PIT promotion.**
Owner request: accept “original A1 acquired” and “scheduler arrived before decision clock” separately, and analyze the best low-cost path to improve timing.

## 1. Separate measurable judgments, never a single green badge

- **SOURCE_INTEGRITY:** independent post-download original provider byte+date+calendar+SHA audit `122/122` (not merely source workflow SUCCESS).
- **SCHEDULER_PUNCTUALITY:** source event `github.event.schedule` expression, original GitHub REST `run.created_at`, job `started_at/completed_at`. Compute (a) nominal cron-to-created *inferred* dispatch gap, (b) run-created→runner-start queue, (c) runner runtime, and (d) total. `<=15 min` is a **research measurement SLO only**, not owner-approved formal requirement. GH does **not** supply an authoritative per-occurrence nominal schedule timestamp; infer most recent matching weekday occurrence only within 24h and disclose limitation. `push` and `workflow_dispatch` never enter scheduled rate denominators.
- **DECISION_SOURCE_CLOCK:** market session T, original actual job completed, independent receipt audited, Stage1 freeze time **all no later than 01:59:59.999 Asia/Taipei on calendar date T+1** and in evidence chronology; otherwise late. This is just source-deadline timing, **not PIT/ordinary class, CA NO_EVENT, completed strategy assessor, qualified selectedCount or Frozen**. Never backdate late replay into T.
- **FAIL CLOSED:** no source original 122/122, no GH exact run/job ID/branch/commit, no exact event CRON, unavailable metadata, retroactive clock, 121/122, corrupted signed receipt and cross-run identity → UNKNOWN/BLOCKED, not an apparent 0-pick or on-time record. Existing auditor's integrity result remains independent even if the optional schedule report fails.

## 2. Actual original GitHub Oct 15 trading date — timeline

All original provider Action Runs below had **GitHub event=`schedule` and `current_source` job**. Job times are taken from the actual GitHub REST `/actions/runs/{id}/jobs` original, **not guessed from planned cron**:

| Actual Taipei run-created | Run | GitHub created UTC | Job start UTC | Job end UTC | Enqueue→runner | Runner runtime | Independent status |
|---|---:|---|---|---|---:|---:|---|
| Oct16 01:04:48 | 38774319744 | 2026-10-15T17:04:48Z | 17:04:51Z | 17:06:27Z | **3 sec** | **96 sec** | 122/122 accepted, Stage1 observed before T+1 01:59, strategy still UNKNOWN |
| Oct16 03:23:15 | 38793471310 | 2026-10-15T19:23:15Z | 19:23:18Z | 19:25:01Z | **3 sec** | **103 sec** | 122/122 accepted, Stage1 rejected late as-of |
| Oct16 03:51:52 | 38797319008 | 2026-10-15T19:51:52Z | 19:51:55Z | 19:53:34Z | **3 sec** | **99 sec** | 122/122 accepted, Stage1 rejected late as-of |
| Oct15 21:08:04 | 38740138590 | 2026-10-15T13:08:04Z | 13:08:08Z | 13:10:02Z | 4 sec | 114 sec | Independent source-only; **push** and does not count toward Cron punctuality |

**Important:** Historical Actions Run/Job REST data does not preserve the `github.event.schedule` Cron string. Previous attribution of the three Oct16 Runs to specific 20:15/23:45/00:15 nominal slots is **not independently verified**. The *new* code retains that field from future source event payloads so we no longer infer its identity from actual start-time order. Even with the Cron expression, nominal occurrence timestamp is still inferred, not a first-party dispatch timestamp.

**Proven bottleneck:** GH creates each delayed run then assigns runner **within three seconds**; A1 read and hash source work is roughly 1.6–1.9 minutes. Improving Node execution by seconds cannot remedy hours of pre-run-creation lag. Attribution points upstream of runner assignment to GitHub's schedule dispatch/service; this is consistent with GitHub's own best-effort scheduling warning, but the specific GH internal root cause is not visible here.

Original GitHub evidence: [01:04 Run](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38774319744), [03:23 Run](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38793471310), [03:51 Run](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38797319008).

## 3. Punctuality improvement alternatives — priority, risk, cost

1. **Implement truthful source-vs-time telemetry FIRST** — **this PR**. Preserve event Cron expression, original job REST clocks, audit source acceptance and deadline as separate immutable-by-hash 90-day *GitHub Actions artifacts* (these are still not physical create-only D1 Frozen). Gather first ten **real subsequent trading days**, count eligible schedule slots, actually dispatched slots, `<=15min` occurrences, and within-source-deadline captures. Missing scheduled runs count as **unknown/missed** only after verifying expected weekday/session and querying the complete GitHub schedule census; a missing last-100 result is not definitive.
2. **Keep the already-authorized three independent read-only source attempts and 122/122 SHA cache**. Their nominal slots are offset `:15/:45` from top-of-hour; a minute tweak alone has no evidence-based guarantee. Do not widen the 01:59 PIT window to make late runs look successful. Continue accepting real main `push` readbacks as *source-only*, but do not create artificial commits to bypass schedule or count `push` as Cron punctuality.
3. **Escalate to GitHub Support with exact original run/job/nominal-Cron evidence** if repeated multi-hour dispatch lag persists; check GitHub Actions status, workflow enabled/default branch, queued/concurrency and runner job evidence. GitHub Docs: scheduling can delay/drop under load; moving away from the start of the hour helps, but :15/:45 already meet that suggestion. [GitHub official reference](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).
4. **For actual hard-time SLA, consider a genuinely independent clock** (Cloudflare Cron or another bounded scheduler + scoped `workflow_dispatch`/repository dispatch) *only after separate owner approval*. This adds new trusted scheduler/deployment or a GitHub write-scope token, plus least-privilege, secret, audit, idempotency and money/quotas evaluation. Even dispatch acceptance does not guarantee runner instant start. Do NOT self-authorize new GitHub Cron slots, Cloudflare Worker/Cron, secrets, provider spend or System1 V8 Formal behavior.
5. **Fallback must be source/payload date-gated and non-Frozen by default**. Its true availableAt and first observed timestamp must be preserved. Even perfect dispatch punctuality cannot solve historical ordinary-equity class PIT (actual 0/1,972) or six-family CA revision/NO_EVENT coverage. M09 S0–S5 remains 0/6 until separate independent strategy/Frozen gates are met.

## 4. Engineering files and reproducibility

- `system2/scripts/record_shared_a1_github_schedule_origin_v0_1.mjs`: persist event Cron identity and digest alongside original source Artifact.
- `system2/runtime/a1_source_schedule_dual_acceptance_v0_1.mjs`: separately classify 122/122 integrity, GitHub dispatch and runner delays, actual T+1 cutoff.
- `system2/scripts/audit_shared_a1_dual_acceptance_v0_1.mjs`: separate auditor obtains real GH REST run and job, recomputes signed source/audit lineage and timing.
- `system2/tests/a1_source_schedule_dual_acceptance_v0_1.test.mjs`: genuine-run-shaped fixture regressions, 121/122, late audit, cross-run/cross-SHA, cron misclassification and false Frozen.
- Existing `system2-shared-official-a1-incremental-readonly.yml` and `system2-shared-official-a1-independent-audit.yml` add no new Cron and no Cloudflare writes. Independent dual receipt is a 90-day GitHub Artifact; official source 7-day cache is unchanged.

**Acceptance boundary:** PR-head CI ≠ first physical schedule-triggered dual report. Only a subsequently observed true source→auditor run with `dual-acceptance-receipt.json`, original GitHub run/job and digest can be called operational. If no new scheduled run fires, there is no measured punctuality success.
