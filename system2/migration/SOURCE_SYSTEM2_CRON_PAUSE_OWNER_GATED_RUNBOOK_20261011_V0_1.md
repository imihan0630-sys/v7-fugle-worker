# SOURCE System2 Cron Pause — Owner-Gated Protection Runbook V0.1

Date: 2026-10-11 Asia/Taipei
Lane: System 2 Cloudflare Cross-Account Verification / G6, Issues #1128 and #1130.
Status: OFFLINE_PLAN_ONLY / SOURCE_CRON_NOT_CHANGED / OWNER_APPROVAL_REQUIRED
Base verified GitHub main: `043247220a4b359487ec7c1599d3c9e13b15fc75`.
Protected non-target: old source account System 1 `fugle-test`, `v7-live`, V8 Formal Core/monitor/notifications, routes and secrets. None may be edited.
Target proposal: old SOURCE account Worker `system2-shadow-research` **Cron triggers only**. No Worker code, bindings, data, R2, KV, API routes, source retirement, destination activation or System1 operation is in the mutation scope.

## Why this requires separate owner approval

- Original authenticated GitHub `workflow_dispatch` Run [#38105177481](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38105177481), Job `114369058630`, 2026-10-11 02:26:49–02:27:10 UTC, proves SOURCE includes `fugle-test`, `system2-shadow-research`, `v7-live`, source `system2-research`, and configured SOURCE System2 Cron `*/5 0-5,11 * * MON-FRI`. DESTINATION has an independent schema-only D1 and zero destination Workers/Cron in **that** inventory; later live state remains UNKNOWN.
- The cron is UTC: Monday–Friday Taiwan time 08:00–13:55 and 19:00–19:55, five-minute interval. Cron **configuration is proven**, but actual current invocations, data writes and exact quota expense are **not** physically attributed.
- Source `system2/deploy/worker.mjs` `scheduled()` invokes `handleScheduledResonance()`, which can call `persistResonancePoolRefreshAuditV0_1`, `persistResonanceWatchPoolV0_1`, and `runBoundedDailyResonanceWorkerCycleV0_1` against the `SYSTEM2_DB` binding. This is a potential D1 writer, not a purely read-only timer. Exact deployed Worker version and binding identity need fresh readback.
- New main PR [#1134](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1134) adds `system2/config/source_account_d1_writer_quarantine_v0_1.json` with `active=true`; it blocks **common-quota-gate GitHub writer reservations**, not already deployed independent Cron. Source S1 reserve is still not physically authorized.
- Only owner-approved D1 backup/copy scope exists in #1128; no permission to mutate source Worker Cron was granted by this scope. STOP until separate owner authorization and least-privilege execution environment.
- Suspending the source Cron also pauses source System2 time-based resonance monitoring, while retaining the Worker and its data; acceptance of that intended functional impact is an owner decision.

## Must-pass pre-pause gates — any UNKNOWN => STOP, no mutation

1. **Fresh SOURCE identity**: independently authenticate GET-only old source account identity, one exact Worker `system2-shadow-research`, its script version/hash, settings, all D1/R2/KV bindings, route mapping and schedule set. Confirm no alias to `fugle-test`, V8, source `v7-live` binding, or other Worker. Log only masked fingerprints.
2. **Fresh schedule**: `GET /accounts/{source_account_id}/workers/scripts/system2-shadow-research/schedules` returns the exact expected sole cron `*/5 0-5,11 * * MON-FRI`; zero/unexpected/multiple triggers = STOP and reassess (do not erase unknown schedules). Verify existing System1 Worker schedules separately, and preserve before-snapshot evidence.
3. **Runtime/usage**: read existing available Cron Events/Worker invocation logs and account-wide UTC-day D1 read/write usage plus source System1 reserve, without D1 SQL table scans. A missing cost proof does NOT authorize any source export, and a Cron config alone is not proof of recent executions. Preserve evidence of pending/in-flight tasks.
4. **Collision guard**: the source-bound `.github/workflows/system2-resonance-deploy.yml` can deploy from `push` or manual and includes the same Cron in generated Wrangler config. Separate protected review must **prevent this workflow from redeploying/reinstating the cron** during the paused state. Do not repoint its environment to DESTINATION; do not run the legacy provisioner `system2-isolated-d1-provision.yml`.
5. **Authority gate**: owner explicitly approves *only* removing the cron(s) from this single old SOURCE `system2-shadow-research` Worker, recognizes its temporary S2 resonance downtime, and approves a protected source-account Workers Scripts Write scope or approved account-UI operation. Cloudflare credential itself must never be pasted into chat or GitHub evidence. An owner-approved D1-copy action is not sufficient permission.
6. **Independent check / backup continuity**: DATA_LANE confirms planned point-in-time boundary, last pre-pause event capture requirements and rollback; AUDIT_LANE verifies V8 isolation and evidence contract. Pausing a cron never implies source D1 is quiescent from *all* possible writers and never proves a verified backup.

## Proposed controlled operation — NOT AUTOMATICALLY EXECUTABLE HERE

- Under a specifically approved operator/environment only, use the Cloudflare Worker **schedules-only** change, not Worker deletion/redeploy or D1 mutation: update `/accounts/{source_account_id}/workers/scripts/system2-shadow-research/schedules` to an **empty schedule list `[]`**, after a final GET exact-match assertion and protected owner permission. Vendor API `PUT .../schedules` needs `Workers Scripts Write`. This is a Cloudflare mutation and must never be run solely because a PR/test passes.
- Cloudflare documentation: https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/schedules/methods/update/ ; https://developers.cloudflare.com/workers/configuration/cron-triggers/ . Wrangler-managed workers should manage Cron through explicit `crons = []` in a separately reviewed deployment configuration; **omitting** a `crons` key or commenting it out does not remove a deployed Cron, and old `system2-resonance-deploy.yml` is unsafe to re-run as-is.
- Never call `wrangler deploy`, change Worker script code/settings, disable `fugle-test`, edit its route, run SOURCE SQL or import, delete source resources, touch DESTINATION Worker/Cron, or enable paid R2 in this operation.
- If endpoint response is unexpected or a resource identity drifts between last GET and PUT, STOP. Never guess or retry a partial/UNKNOWN change without fresh independent GET + owner authorization.

## Post-pause evidence and rollback

1. Immediately re-GET source S2 Worker schedules, expect **exactly zero**; save Run/Job/times, normalized before/after snapshots, hashes, return code and redacted request scope.
2. Re-GET both Worker/DB metadata and independent V8 Worker routes/schedules/bindings; all non-target fingerprints must match except known volatile metadata; keep source S2 D1/R2/KV intact. If uncertain, status `PAUSE_EFFECT_UNKNOWN`, not PASS.
3. Cloudflare changes can propagate for **up to 15 minutes**; observe fresh Cron Events/analytics after that delay and account quota separately. Empty schedules readback is configuration evidence, not absolute proof that no prior invocation remains in flight.
4. Retain exact original cron string and schedule snapshot as a **rollback recipe only**, not automatic permission to re-enable it. Rollback after downstream writes requires backup/delta reconciliation and a separate owner safety decision; never risk two active System2 writers.
5. Keep DESTINATION Worker/Cron **disabled/absent** until independently verified source backup/restore/PIT/Frozen and separate cutover authorization. Source data must remain intact for restoration.
6. AUDIT_LANE alone issues physical `SOURCE_S2_CRON_PAUSED` acceptance. Before that: `PENDING_OWNER_AUTH_AND_FRESH_READBACK`; G6 remains BLOCKED, full cross-account migration incomplete. 
