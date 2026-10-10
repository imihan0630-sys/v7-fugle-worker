# System 2 Cloudflare Migration — Owner Delegated Low-Risk PR Merge Policy V0.1

Owner authorization date: 2026-10-10 (Asia/Taipei).
Authorization scope: This System1/System2 Cloudflare account separation infrastructure workstream, **GitHub low-risk research/offline diagnostic PRs only**.
The owner explicitly authorized directly merging non-substantive changes that do not alter overall architecture, System1/System2 business functionality, financial exposure or similarly significant risk, without per-PR renewed permission. This document translates that direction into fail-closed boundaries; it is not permission to deploy anything.

## Positive case / rationale
- Reduces owner approval interruptions in repetitive reproducible repairs; makes the next GitHub main checkpoint and CI evidence available rapidly.
- Encourages small, reviewable PRs with deterministic tests and traceable SHA; keeps unverified cloud prerequisites from blocking independent local research.
- Preserves explicit owner decisions for production, strategies, billing, privileged credentials and irreversible data integrity actions.

## Negative case / failure modes to prevent
- A YAML "test tweak" could create Cloudflare resources, activate a cron, disclose secret contents, or inadvertently target `fugle-test`.
- GitHub workflow triggers or privileges might silently increase usage or run on a schedule without an obvious UI warning.
- A versioned migration file could overwrite frozen snapshots or accidentally change PIT/availableAt, even if labelled 'maintenance'.
- Parallel lanes can change main HEAD; a previously green PR can become incompatible. Blind merges bypass independent audit/required owners.
- A minor account permission switch can expose business or trading records; billing/entitlement is not a trivial config checkbox.

## AUTO-MERGE ELIGIBLE only if ALL are true
1. This PR changes **only** migration-scoped docs, mock tests, read-only metadata collectors/diagnostics or a `workflow_dispatch`-only validation workflow. No source-code runtime behavior, public endpoints, routes, production Worker, Cron, strategy, schema, output decisions, frozen data, transaction engine or performance semantics.
2. No creation of Cloudflare D1/R2/KV/Worker, no change of account subscription, billing, API token or permission, GitHub Environment Secrets, application secrets, write grants, external destinations or backup/restore physical data.
3. Cloudflare calls in new/modified flow are GET only and prove redaction. Error 10042 may allow only a **partial** resource inventory; it is never an entitlement grant or a substitute for full migration acceptance.
4. Head commit and current main verified immediately before merge; changed paths inspected; any conflicting lane ownership, governance, uncertain side effects or overlapping edits triggers explicit review rather than automatic merge.
5. Latest PR HEAD passes **both** System2 Research CI and V8 Regression. All fail-closed negative tests and static production guard must be green. If the main advanced, check relevant differential and mergeability; refresh tests when appropriate.
6. Create isolated branch and PR, document source Run/artifact/sha, unresolved blockers and rollback. Merge using expected PR HEAD SHA; verify resultant main SHA and post-merge CI before claiming PASS.
7. Cost impact demonstrated **zero new billable service enablements**, and no activity that can expand usage materially. Unknown or unbounded cost means STOP.
8. No independent-audit signoff or CODEOWNER requirement is skipped. If governance says owner/other lane signoff, it supersedes this delegation.
9. Explicitly disclose physical migration stage and non-complete inventory; do not claim Shadow/production readiness from code-only CI.

## ALWAYS REQUIRE NEW EXPLICIT OWNER APPROVAL
- Any direct Cloudflare account creation/enablement, especially R2 subscription (even with free included tier), paid checkout, recurring billing, write credentials, secret creation/rotation, new permissions.
- Any D1/R2/KV physical schema/data import/export that might mutate state, bulk backup involving shared quotas, snapshot migration, retention/deletion, Worker deployment, cron/route/domain changes.
- System1 Formal Core, V8 signals, 3+3/Top6/position, monitoring, push, finance, or any System2 live strategy/score/trading parameters, frozen decision rules, data governance architecture.
- Stage promotion, cutover, rollback involving live writes, production or external users.
- PR with conflicts, failed/missing CI, unexpected side effects or uncertain cost.

## Current 2026-10-10 application
Real owner-driven GET-only Run #38021761468 source four service READ granted; destination D1/WORKERS/KV granted, R2 returned `HTTP 403 code 10042 NotEntitled`.
Implement an isolated **partial-only** resource inventory that skips *destination R2 bucket listing only* on attested 10042 while preserving source full metadata. `complete=false`, `r2BucketsVerified=false`, `r2Status=NOT_ENTITLED` are mandatory on destination. No D1/R2 copy, cost or permission change.
The owner may use this standing authorization to merge this precise bounded class of offline fix after CI, but not to enable R2, create a D1 database, deploy a Worker or perform any live migration.

## Operational continuity
The assistant cannot keep working after its turn ends without user reactivation. This policy reduces requests for PR approvals while preserving that product limitation. Keep dated checkpoint and exact main SHA as source of truth.


## 2026-10-10 owner addendum — autonomy for matching *low-risk GitHub merges*, NOT cloud writes

Owner expressly answered `批准，這一種低風險程度的批准活動，我授權給你自動執行` to a request for **PR #1088 to merge after independent review**, and allowed similarly low-risk approval actions to proceed without repeated per-PR owner questions. This addendum records the owner's prior consent to the **GitHub merge decision** for that narrowly defined class. It does not transform new privileges or physical mutations into low risk.

### Additional narrowly eligible class (code-only, OWNER-PREAPPROVED MERGE AFTER AUDIT)

In addition to the earlier automatic eligible documentation/GET-only subset, a correction to an **isolated, dormant and explicitly owner-manual Schema-only executor** can be merged without a repeat owner confirmation only when all of the following are independently attested:

1. It is a *bounded safety/correctness fix*, limited to an already-approved destination D1 Schema-only manual workflow and its isolated executor/tests; it must **not** change the frozen target account/database fingerprint, add permissions, replace the sealed 125-SQL bundle/plan hash semantics, expand DDL statement classes, change the user-triggered `VERIFY_ONLY` and `APPLY_ONCE` manual checks, invoke the workflow, enable any automatic schedule, deploy any Worker or activate existing production logic.
2. An **external AUDIT_LANE** or other genuinely independent reviewer has provided a traceable review of the exact PR and security boundary. The authoring assistant's own mock tests or self-review are not a substitute. Any required CODEOWNER/branch protection check remains mandatory. No signoff means HOLD, not an automatic override.
3. CI at the exact current PR head reports both **System2 Research CI PASS** and **V8 Regression PASS**, relevant negative and isolation tests PASS, and GitHub current main/head/changed files are checked immediately before merge. Main drift must be reconciled. Merge with expected-head SHA and verify main readback + postmerge CI.
4. Actual Cloudflare impact of **merging code** is zero: there are no writes, no destination SQL execution, no resource or secret change, no workflow dispatch, no R2 entitlement/billing and no System1 Formal Core/runtime/push/trading change. Future manual invocations with write access are a **separate high-risk authorization boundary**.
5. An explicit issue/PR receipt records: owner standing grant, scoped diff, reviewer signoff, CI IDs, main/PR SHAs, evidence, new blocker/rollback, physical acceptance status and why it was Class B safe-to-merge **without cloud execution**.

The **first specifically approved case** is [PR #1088](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1088), the exact `_cf_KV` reserved-table prewrite check and mock-negative-test correction. Owner approval to merge was recorded separately, but **independent AUDIT_LANE approval was not present as of this addendum**, so merging it must remain on hold until that required review is genuinely recorded. The owner-approved original D1 schema work does not authorize this assistant to run `APPLY_ONCE`.

### High-risk exclusions that cannot be silently inferred from the word "low risk"

No standing merge grant authorizes: Cloudflare account/resource creation; D1/R2/KV/schema/data **physical** changes; `APPLY_ONCE`; source PIT/frozen backup and source quota grants; write-capable Token or GitHub Environment creation/rotation; paid tier or R2 activation; Worker/Cron/route/runtime deployment; strategy ranking, signals, real capital, orders or production changes; audit bypass; accepting ambiguous partial writes; changes to target identity, SQL bundle, permission or workflow triggers. New material Class B/Class C decisions outside this tightly bounded PR class still require explicit approval.

### Operational meaning

During an active task, autonomously diagnose, stage, test and merge eligible PRs without pausing for repeated approval requests. At the end of a chat turn, do **not** claim background execution or that another chat was started automatically. Continue on next owner message from latest GitHub main. This is a specific update to the permitted GitHub-only approval workflow and does not relax the formal System 1/2 production acceptance gates.
