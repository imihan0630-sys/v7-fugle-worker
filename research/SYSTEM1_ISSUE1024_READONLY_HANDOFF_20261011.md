# Issue #1024 — native evidence recheck / migration-safe handoff

Observed: 2026-10-11 Asia/Taipei. Baseline main: `ce39441dd2db1adb552dd76d2f0ea4b8220f1d4e`.
Class A documentation and offline evidence intake. This is producer reconciliation, not independent physical acceptance.

## What was independently retrieved

Receipt: `research/SYSTEM1_ISSUE1024_NATIVE_RECHECK_20261011_V0_1.json`.
Original public GitHub REST response bytes: `research/issue1024-native-recheck-20261011/`.
Each response has a local SHA256 in the receipt, separate from GitHub's original artifact ZIP digest.

12 original Run metadata responses, 12 Job responses, 11 Artifact-list responses and 8 native ZIP digest records were retrieved. Three recent-run pages contain 266 distinct executions for the GitHub filter `created=2026-10-10..2026-10-11`. This listing is an Actions inventory, not a complete inventory of Cloudflare Cron invocations.

The metadata recheck agrees with the existing main Run/Job/head SHA/digest chain for PVE271/272/263/264, Oct08 and Oct09 C1, the holiday sync/mirror/health, and the Oct10 public-runtime observation. PVE251 also has a complete metadata triplet; PVE262 has Run/Job metadata only. The exact timestamps, SHA, IDs, workflow conclusions and job steps are in the receipt.

**Limits:** Original ZIP API download returned 401. The browser download timed out. The expanded PVE271 Job UI rendered `Error:` instead of business log lines. Supplemental unauthenticated API queries reached 403 rate limit. Therefore original ZIP byte replay and raw business log replay were **not completed in this turn**. Historical numeric contents below are inherited from pinned canonical main, with native metadata provenance rechecked; they are not newly measured Cloudflare costs. A digest match alone cannot independently certify artifact contents or reserve values.

## Cost scopes must remain separate

| UTC quota day | V7_DB whole day writes / reads | Other database / whole-account scope | 23:35 / conditional 23:55 costs |
|---|---:|---|---|
| 2026-09-21 | 2,825 / 133,037 | Full-account all-database totals UNKNOWN in this intake | Both read/write UNKNOWN |
| 2026-09-22 | 1,635 / 19,533 | Full-account all-database totals UNKNOWN in this intake | Both read/write UNKNOWN |
| 2026-10-07 | 1,869 / 431,323 | SYSTEM2_DB 124,629 / 3,943,636; reported combined account 126,498 / 4,374,959 | Primary quota failure; recovery lease witnessed; both per-operation costs UNKNOWN |
| 2026-10-08 | UNKNOWN | Whole-account daily usage UNKNOWN | Neither successful recovery nor later healthy persistence qualified |

09/21 Cron row 1893 at 15:35:35Z and 09/22 row 2173 at 15:35:31Z are old Cron SUCCESS observations, not complete generation-matched business acceptance. Both occur at 23:35 Taipei on the same UTC quota date. Neither two-day maxima nor daily subtraction supplies defensible primary/recovery costs, failed-statement costs, index/query amplification or reserve margins.

10/07 primary failed at 23:36:10 Taipei. The 15:55:03.803Z lease is 23:55 Taipei and does not prove successful recovery. Missing D1 Cron audit rows cannot prove non-invocation when the business attempt and lease coexist with quota failure. The historical combined-account write witness supports a collision diagnosis, not fresh spendable headroom; complete current account membership, delayed analytics, competing-writer reservations and source/destination account separation remain unqualified.

## Persistence, generation and trading-date checks

Pinned main source topology and existing evidence distinguish KV config, latest plan, report and attempt from D1 Cron audit and lease. This source reading is not attestation of the current deployed source hash. The Cron INSERT has no automatic generation identity that would make date proximity a sufficient join.

Physical P04 needs original receipts for KV config/plan/report, D1 Cron/lease and Formal C1, with exact trading date, producer content lineage, original source SHA/digest, successful pipeline, verified Formal-C1 parent and one successful business scan. An invocation lease, collector workflow SUCCESS, external mirror, or mocked matching fixture cannot substitute for that chain.

Oct08 C1 run 37808995747 / job 113420649062 / artifact 11565090033 is a scheduled failure; inherited original business classification is `C1_GENERATION_NOT_FOUND / UPSTREAM_ARTIFACT_MISSING`. This is not zero picks and does not prove the upstream Worker was never invoked.

Oct09 C1 run 37958877283 targets an official nontrading date per existing calendar evidence. Holiday sync 37956058324 skipped business stages. Mirror 37956199815 refers to the old 09/29 plan in canonical evidence. Public metadata run 38032440861 / job 114156019956 / artifact 11662631499 reports old 09/29 storage in inherited evidence; it does not prove absence of unseen Cron or partial operations.

The recent 266-run listing adds three System2 scheduled metadata observations (38010753671, 38038910258, 38099715538), not newly qualified System1 ordinary-session persistence. Destination schema and source metadata/migration inventory workflows, and Issue1068 offline DEFER run 38108616165, do not establish System1 per-operation cost, natural P04 success, source-byte backup/PIT/frozen acceptance, or quota authorization. No later naturally completed System1 business receipt was qualified by this review.

## Quantitative state and exact next step

- P01: supporting checks 3/7; physical qualified false.
- P02: supporting checks 3/7; physical qualified false.
- P04: supporting checks 2/7; physical qualified false.
- Supporting total 8/21 (38.10%); physical P01/P02/P04 0/3; CORR-003 P01–P05 0/5.
- Write/read reserve authorizations remain false; both authorized rows and numerical candidates remain null.
- Original 19 criteria remain unclosed; correction remains HIGH/VERIFYING, AUDIT_LANE owned.

The next ordinary-session candidate window in the existing calendar is **2026-10-12 23:35 Taipei (15:35Z)**, with **23:55 (15:55Z) only if actually invoked**. This is a future opportunity, not a guaranteed success or dispatch authorization. After natural execution, retrieve original authenticated Run/Job/ZIP bytes and provider operation metadata including failed/retried statements; verify six-role same-generation readback and the whole UTC quota-day account ledger/analytics freshness/no-collision. Any new D1 SQL requires independently qualified read headroom. If an original field is absent, retain UNKNOWN. REMEDIATION integrates; AUDIT alone accepts physical gates and closes the correction.

This review made zero Cloudflare calls, D1 SQL reads/writes, R2 byte reads, workflow dispatches, synthetic scans, deployments, paid-tier changes or credential extraction. Runtime, Formal Core and schedules were not modified. GitHub document publication and ordinary offline CI are the only intended effects.
