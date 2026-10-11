# Issue #1024 — next ordinary trading-day natural evidence collection (read-only / no automatic scan)

Status: **PREPARED_OFFLINE_ONLY / NOT_YET_OBSERVED / PRODUCTION_UNCHANGED**
Owner: SYSTEM1_LANE (producer). Receiving REMEDIATION_LANE. Independent acceptance: AUDIT_LANE.
Related: [Issue #1024](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1024), [CORR-003 remediation](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1024), [System2 P03/P05 #1026](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1026).

## Clock/date boundary and no-look-ahead
- Candidate ordinary cash-equity session date `2026-10-12` **subject to official TWSE/TPEx market calendar and actual business execution**. It is future as of preparing this runbook on `2026-10-11`; this file does not prove the session happened.
- Existing natural after-market primary target `2026-10-12T23:35:00+08:00` = `2026-10-12T15:35:00Z`.
- Conditional recovery window `2026-10-12T23:55:00+08:00` = `2026-10-12T15:55:00Z`; do not infer invocation or success from existence of a schedule/lease. Non-invoked requires original window evidence.
- Later prospective C1 collector must use the **actual observed Run/Job start and correct market date**, not an assumed delay/time or the Run creation timestamp. Compare the next calendar date in Taipei without treating it as a different market day.
- Account-wide Cloudflare D1 quota uses UTC date boundary: for the above natural primary and recovery, the quota date is `2026-10-12` (UTC); do not confuse it with an Asia/Taipei calendar or an unrelated next-day collector.
- Record every timestamp with `timestampKind` (`RUN_CREATED`, `JOB_STARTED`, `CRON_INVOKED`, `LEASE_ACQUIRED`, `KV_PERSISTED`, `D1_EXECUTED`, `C1_COLLECTED`) and original `...Z`; derived local display must preserve the instant.
- **Original 12 Run timestamp correction:** `research/SYSTEM1_ISSUE1024_12_TIMESTAMP_CORRECTIONS_20261011_V0_1.json` is authoritative for the legacy intake's display fields.

## Original evidence acquisition, only after actual natural execution
1. Read canonical latest `main`, deployed Worker version, immutable workflow `run_id`, `job_id`, SHA, original Artifact ID/content digest, run event (`schedule`/natural execution, not manually forced), and original URL. Native response and download digest are distinct; a published digest without archived bytes is insufficient for independent raw replay.
2. Record actual 23:35 primary `INVOKED/SUCCESS/FAILED/UNKNOWN`; distinguish *source readiness*, *attempt*, *KV plan commit*, *D1 cron/lease audit*, external 3Min and *C1 parent*. For 23:55 record `ACTUALLY_INVOKED / VERIFIED_NOT_INVOKED / UNKNOWN`, lease and final outcome separately. Deduplicate one business success per generation and market date.
3. Obtain genuine provider **per-operation** `rowsWritten`, `rowsRead` (including failed requests where billable/measurable), D1 query count/index write amplification, retries/recovery amplification, Worker/query attribution to `V7_DB`, and Cloudflare provider timing/metric identity. If not exposed, store `null/UNKNOWN`; whole-day usage is **not** operation-level telemetry.
4. Separately record (a) `V7_DB` **whole UTC day** writes/reads, (b) `SYSTEM2_DB` whole UTC day writes/reads only if still co-accounted, (c) **all-D1-databases account-wide** actual writes/reads, other writers and evidence of account membership/Cloudflare analytics observation latency. Do not simply add two DBs unless provider membership/completeness is proven.
5. Reconcile system-wide budget: current account limits/plan, provider fresh usage, GraphQL lag, indexed write and retry costs, protected System1 expected read/write reservations, any System2 writer reservations. **Never infer authorized write/read reserve amounts from healthy-day maximum, a one-day snapshot, or a passed schema migration.** Both reserve `authorized=false`, `rows=null` until separate formal authorization and independent audit.
6. P04 six original source roles: (`STOCKS_KV`) config/latest plan/daily report/last attempt; (`V7_DB`) cron audit and after-market lease; independent original Formal-C1/generation parent. The final outcome requires exact market date, source SHA/digest, matching generation/content fingerprint, successful write/readback and at most one successful business scan. A timestamp correlation or Cron SUCCESS alone is not cross-store linkage.
7. Verify non-trading date behavior, partial failure, missing C1 generation, 3Min external readback and `zeroPick=false` when unknown; no synthetic replay, manual production scan or workarounds that weaken fail-closed behavior.
8. Evidence must be independently verifiable before raising physical acceptance; pass/fail remains AUDIT_LANE authority. Error/401/403/timeout should be preserved with method and timestamp, not silently dropped.

## Report fields / REQUIRED UNKNOWN preservation

```json
{
  "issue": 1024,
  "marketDate": "2026-10-12",
  "quotaUtcDate": "2026-10-12",
  "naturalPrimaryInvocation": "UNKNOWN",
  "conditionalRecoveryInvocation": "UNKNOWN",
  "primaryRowsWritten": null,
  "primaryRowsRead": null,
  "recoveryRowsWritten": null,
  "recoveryRowsRead": null,
  "failedAndRetryRowsWritten": null,
  "failedAndRetryRowsRead": null,
  "indexWriteAmplification": null,
  "v7DbUtcDayRowsWritten": null,
  "v7DbUtcDayRowsRead": null,
  "wholeAccountUtcDayRowsWritten": null,
  "wholeAccountUtcDayRowsRead": null,
  "accountMembershipVerified": false,
  "analyticsFreshnessVerified": false,
  "writeReserveNumberAuthorized": false,
  "authorizedWriteReserveRows": null,
  "readReserveNumberAuthorized": false,
  "authorizedReadReserveRows": null,
  "sameGenerationKvD1C1PersistenceVerified": false,
  "quotaNoCollisionVerified": false,
  "physicalP01Accepted": false,
  "physicalP02Accepted": false,
  "physicalP04Accepted": false,
  "originalEvidence": [],
  "remarks": "Template only, no future evidence yet; no D1 physical I/O authorized by this file."
}
```

## Strict safety gate
- Existing READ-only GitHub/provider metadata first. Any **new** physical D1 query requires qualified source-account read headroom and approved permission **before** access; avoid cross-account migration race. No R2 data download unless already authorized.
- No new Cloudflare Worker deployment, secrets, Cron, workflow dispatch that causes physical writes, artificial formal scan, System1 Formal Core/monitor/notifications changes, or cloud paid-plan change.
- Origin/target-account migration metadata (schema-only, read-only inventory, empty D1) cannot prove source System1 P04 or authorize account-wide reserves; do not move main lineage into a different account.
- **Producer** adds original observation receipts, **REMEDIATION** integrates evidence, **AUDIT** alone independently accepts. If no natural source business execution occurred, report a true failure/UNKNOWN, not success or zero picks.

Current P01 source support `3/7`; P02 `3/7`; P04 `2/7`; **8/21 evidence-only**, **0/3 independently physical accepted**, CORR-003 **0/5** as of this preparation. No new numbers are authorized here.
