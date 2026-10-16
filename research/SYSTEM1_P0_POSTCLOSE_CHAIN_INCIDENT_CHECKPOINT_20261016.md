# System 1 P0｜盤後選股／主監控／每日推播鏈路 checkpoint（2026-10-16）

Status: `INCIDENT_OPEN__FORMAL_PARENT_MISSING__NO_REPLAY`  
Authoritative repository: `imihan0630-sys/v7-fugle-worker`  
Authoritative branch: latest `main`  
Observed main at capture: `eaa5f5aac43d44a43fc86c3c24eae7f0cef049eb`  
Production runtime: `8.20.2-idempotent-d1-snapshots`

## 1. Scope and protected invariants

This checkpoint records read-only operational evidence only.

Preserve all existing Formal constraints:

- thousand-price pool at most 3 and non-thousand pool at most 3;
- no cross-pool filling and no forced six;
- Strategy A is pullback and Strategy B is breakout;
- formal signal confirmation remains completed 15-minute bars; 10-minute bars are auxiliary only;
- actual holdings, confirmed fills, capital, stop plans and position lifecycle are not overwritten by a new NONE-stage pool;
- no blind retry of an ambiguous business POST;
- failure or missing data is never reclassified as a successful zero-pick session.

No file in this checkpoint changes Worker code, the Formal comparator, pool quota, capital, orders, positions, Cron, KV/D1 data, 3Min data or phone delivery.

## 2. Verified production and main state

At the time of capture:

- latest GitHub `main`: `eaa5f5aac43d44a43fc86c3c24eae7f0cef049eb`;
- public `GET /api/version`: runtime `8.20.2-idempotent-d1-snapshots`, `testMode=false`, KV=true, D1=true, phonePush=true, threeMin=true, threeMinReadback=true, `requirements30Complete=false`;
- Cloudflare provider readback: four original Cron schedules are preserved;
- active deployment was created at `2026-10-13T14:51:21.517823Z`;
- the 2026-10-16 incident PRs did not deploy a new Worker.

Canonical provider diagnostic:

- GitHub Actions run: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38850582658
- verdict: `ORIGINAL_CRON_SETTINGS_PRESERVED__RUNTIME_EXECUTION_CAUSE_NOT_YET_PROVEN`;
- account-level D1 analytics are lagging lower bounds and do not prove remaining quota or a Cron-specific root cause.

## 3. Three-link readback for market date 2026-10-15

Canonical authenticated GET-only forensic:

- GitHub Actions run: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38850051127
- artifact: `system1-p0-original-forensic-38850051127`
- artifact digest: `sha256:776b82df84cfcaba0a6a270e8aa99bb089c81ed4954067e7691a7231bb0b9f12`

### A. Daily after-market Formal selection

Status: **FAIL / MISSING**

- official market cache is ready for 2026-10-15: TWSE 1032 and TPEx 850;
- source quality is ready with no missing required quality kinds;
- `scanDate=null`, `selectedCount=null`, and no same-date Formal attempt is visible;
- therefore this is not a proven zero-pick session.

### B. Primary monitoring write

Status: **FAIL / NO FORMAL PARENT**

- primary source is KV;
- stock count is 0;
- KV `updatedAt=2026-10-15T15:57:04.206Z`;
- exact Formal/KV symbol parity is false;
- no current plan date is present.

A zero-stock KV state without a confirmed Formal record must not be treated as a valid new plan and must not overwrite authenticated holdings.

### C. Daily push

Status: **ORPHAN ACCEPTED RECEIPT / NOT PHONE PROOF**

- exact signal id `DAILY_SELECTION:2026-10-15` has one outbox row;
- outbox state is `ACCEPTED`, HTTP 200;
- created `2026-10-15T15:36:59.075Z`, accepted `2026-10-15T15:36:59.504Z`;
- the row has no confirmed same-date Formal parent;
- canonical verdict is `DAILY_OUTBOX_ACCEPTED_WITHOUT_FORMAL_RECORD`;
- this is not proof that the phone received a valid plan.

## 4. Recent merged PRs

- #1326 — GET-only overnight Formal/KV/outbox audit; merged, regression green, no production write or deploy.
- #1384 — one-shot authenticated GET-only original incident forensic; merged, PR CI and main forensic succeeded.
- #1385 — orphan outbox chronology and market-cache readback; merged, PR CI and main forensic succeeded.
- #1387 — Cloudflare four-Cron/deployment/usage readback; merged, PR CI and main physical provider audit succeeded.

Relevant open candidates (#1288, #1303, #1312, #1313 and #1314) are stale/diverged or review-only. They are not production authority and must not be merged or deployed merely to manufacture a green result.

## 5. Root-cause status

Confirmed:

- official sources can be ready while the same-date Formal record is absent;
- primary KV can be empty without a verified Formal parent;
- an accepted outbox row can exist without a verified Formal parent;
- four Cloudflare Cron schedules and the existing active deployment remain present.

Not yet proven:

- which exact original Cloudflare scheduled invocation produced or failed to produce the 2026-10-15 Formal record;
- whether D1 quota, CPU/runtime failure, date semantics or another branch caused the missing Formal parent;
- whether the phone received any valid daily selection;
- whether any replay would be safe.

## 6. Exact next continuation point

1. Keep business replay disabled for 2026-10-15; do not POST a historical scan and do not resend the orphan push.
2. Obtain an exact scheduled-invocation receipt that binds trigger time, target market date, runtime version, pre-commit source readiness, D1/CPU result and Formal commit outcome.
3. On latest main, refresh only the smallest fail-closed operational guard supported by that receipt.
4. Require exact-head CI plus an independent read-only acceptance before any Worker deployment.
5. A production Worker change or deploy remains a protected action: preserve the four Cron schedules, current bindings, holdings, Formal rules and 15-minute semantics; require explicit owner approval for the concrete PR/deployment.
6. Close the incident only after a new genuine trading day proves the complete same-date chain:
   `Formal saved -> primary KV exact readback -> DAILY_SELECTION outbox accepted`.
   Phone receipt remains a separate acceptance item.

## 7. Current user-decision blockers

No secret is requested in chat.

Owner decision is required only for:

- approving a concrete versioned Worker code-change PR and production deploy;
- enabling any prior-day pinned recovery capability;
- authorizing any business scan replay, push resend, holding mutation, capital/risk change or paid-plan change.

Until then, safe work is limited to read-only diagnosis, offline guards/tests, checkpoint updates and review-only PRs.
