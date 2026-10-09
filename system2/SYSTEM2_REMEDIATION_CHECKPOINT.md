# System 2 Remediation Checkpoint

Updated: 2026-10-09 14:26 Asia/Taipei
Status: ACTIVE / REMEDIATION_LANE / FIX_IMPLEMENTED / PENDING_INDEPENDENT_AUDIT
Room: System 2｜補強修復室
Governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Active correction

`S2-CORR-20261007-003` — System2 isolated D1 writers lack global free-tier daily write-budget coordination.

Routing:
- severity: `HIGH`
- status: `FIX_IMPLEMENTED`
- routingClass: `REMEDIATION_LANE`
- assignedLane: `REMEDIATION_LANE`
- assignedRoom: `System 2｜補強修復室`
- modificationOwner: `SYSTEM2_REMEDIATION_ROOM`
- verification: `PENDING_INDEPENDENT_AUDIT`
- blockedBy: none

## Canonical implementation

PR #980 implemented the account-level D1 budget/reservation/priority correction and squash-merged to main:

`f3b7e30c00ae7d5407d8dd277753e32c59ce72b0`

Implementation head:
`edca9e0a037418499deb3b8f77ca8570ddee105e`

Checks:
- System2 Research CI `37893287729`: **PASS**
- V8 Regression `37893287751`: **PASS**
- incidental Actual Holdings Screenshot Import readonly workflow `37893287732`: PASS, not CORR-003 acceptance evidence
- latest-main drift immediately before merge: zero
- PR mergeable: true

Merged-main readback confirms the quota contract/runtime/workflow guards are physically present in GitHub main.

## Changed files — implementation PR #980

1. `.github/actions/system2-d1-budget-gate/action.yml`
2. `.github/workflows/system2-2026-twse-oct09-one-shot.yml`
3. `.github/workflows/system2-daily-shadow-diagnostic.yml`
4. `.github/workflows/system2-fugle-raw-hot-history-bootstrap.yml`
5. `.github/workflows/system2-historical-current-year-segment-backfill.yml`
6. `.github/workflows/system2-historical-d1-bounded-smoke.yml`
7. `.github/workflows/system2-historical-d1-physical-smoke.yml`
8. `.github/workflows/system2-historical-pack-2017-backfill.yml`
9. `.github/workflows/system2-historical-pack-real-source-smoke.yml`
10. `.github/workflows/system2-historical-tpex-2021-revision-recovery.yml`
11. `.github/workflows/system2-hot-history-bootstrap.yml`
12. `.github/workflows/system2-isolated-d1-provision.yml`
13. `.github/workflows/system2-recent-a1-hot-history-warmup.yml`
14. `.github/workflows/system2-resonance-deploy.yml`
15. `system2/SYSTEM2_D1_ACCOUNT_QUOTA_BUDGET_V0_1.md`
16. `system2/SYSTEM2_DAILY_SHADOW_DIAGNOSTIC_V0_1.md`
17. `system2/SYSTEM2_RECENT_A1_HOT_HISTORY_WARMUP_V0_1.md`
18. `system2/SYSTEM2_REMEDIATION_CHECKPOINT.md`
19. `system2/config/d1_account_writer_registry_v0_1.json`
20. `system2/deploy/ensure_system2_d1_ready.mjs`
21. `system2/evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json`
22. `system2/runtime/d1_account_quota_budget_v0_1.mjs`
23. `system2/scripts/run_d1_account_quota_gate_v0_1.mjs`
24. `system2/tests/d1_account_quota_budget_v0_1.test.mjs`
25. `system2/tests/d1_account_quota_workflow_guard_v0_1.test.mjs`

Evidence finalization also adds:
- `system2/evidence/S2_CORR_20261007_003_IMPLEMENTATION_EVIDENCE_20261009_V0_1.json`
- Correction Queue MD/JSON updates
- this final checkpoint

## Free-tier account contract

Canonical contract:
`system2/SYSTEM2_D1_ACCOUNT_QUOTA_BUDGET_V0_1.md`

Frozen account-level limits:
- 100,000 rowsWritten / UTC day
- 5,000,000 rowsRead / UTC day
- reset 00:00 UTC = 08:00 Asia/Taipei
- indexed writes count toward rowsWritten
- account-wide scope includes SYSTEM2_DB and V7_DB
- separate D1 database IDs do not isolate the Free quota
- automatic paid upgrade: **FORBIDDEN / NOT IMPLEMENTED**

Vendor/source evidence remains:
`system2/evidence/S2_CORR_20261007_003_CLOUDFLARE_FREE_TIER_CONTRACT_20261007_V0_1.json`.

## Writer registry / priority

Canonical registry:
`system2/config/d1_account_writer_registry_v0_1.json`

Merged-main count:
- workflows sharing `system2-isolated-d1-writer`: 16
- physical writers: 13
- read-only registered workflows: 3

Priority:
- P0 = protected operational / launch evidence
- P1 = necessary controlled bulk data
- P2 = discretionary warmup/bootstrap
- P3 = maintenance/smoke/schema/deploy
- READ_ONLY = no mutation authority

The registry regression scans the actual workflow directory. A workflow sharing the writer authority but absent from the registry causes test failure.

Concurrency remains serialization only. It is not interpreted as daily budget.

## Account usage / reservations

Live gate:
`system2/scripts/run_d1_account_quota_gate_v0_1.mjs`

The gate:
- reads account-wide D1 usage using Cloudflare GraphQL `d1AnalyticsAdaptiveGroups`;
- aggregates rowsWritten/rowsRead across databases in the same account;
- reads current-UTC-day outstanding reservation/result receipts;
- fails `QUOTA_BUDGET_DEFER` when account usage cannot be proven;
- never invents exact remaining quota.

Compact durable receipts reuse existing `s2_infrastructure_checks`:
- `SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1`
- `SYSTEM2_D1_ACCOUNT_BUDGET_RESULT_V0_1`

No new high-write ledger/table was created.

### Ledger self-cost

`s2_infrastructure_checks` has:
- table row
- PRIMARY KEY
- UNIQUE check_hash
- secondary time/type index

One inserted receipt can therefore touch four write structures.

Reservation + result reserve:
**8 rowsWritten**

The quota evaluator subtracts this overhead before granting/adapting a writer.

## System1 after-market reserve

Evidence:
`system2/evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json`

Current physical evidence:
- healthy after-market dates: 2
- dates: 2026-09-21, 2026-09-22
- observed whole-V7 daily rowsWritten: 1,635 and 2,825
- max observed: 2,825
- `reserveNumberAuthorized=false`
- `authorizedReserveRows=null`

Therefore:
**2,825 is NOT promoted into the shared account reserve.**

Until an independent evidence-qualified reserve is authorized:
- System2 physical mutation returns `QUOTA_BUDGET_DEFER`;
- lower-priority work cannot consume guessed headroom;
- no paid plan is assumed or purchased.

This is deliberate fail-conservative behavior, not a missing default.

System1 Formal Core / business timing / after-market logic were not modified.

## P0 protection

Measured scheduled Daily Shadow:
- run 37609474459
- rowsWritten = 13,130

The shared evaluator preserves this P0 reserve before P1/P2/P3 work when a physical reservation can otherwise be evaluated.

Future controlled launch acceptance may supply its own evidence-backed reserve; no arbitrary launch reserve is fabricated by this correction.

## Recent A1 quota adaptation

Measured calibration:
- logical bars = 9,640
- D1 rowsWritten = 57,880
- amplification ≈ 6.00x
- measured rowsWritten/date ≈ 11,576
- prior fixed max = 5 dates

New behavior:
- ordinary push = non-mutating tests/planning
- schedule/manual = shared account quota gate
- `adaptiveMaxDates = min(5, floor(protectedWriteHeadroom / 11,576))`
- if zero dates fit => `QUOTA_BUDGET_DEFER`

No 80%/90%/95% utilization threshold was introduced.

## Cross-workflow write protection

Physical writer classes now pass through the same gate.

Protected paths include:
- Daily Shadow diagnostic
- annual history
- current-year segmented history
- Recent A1 warmup
- bounded hot-history bootstrap
- Fugle raw hot-history bootstrap
- real-source smoke
- physical/bounded D1 smoke
- isolated D1 provision
- resonance conditional schema write
- TPEx 2021 revision recovery
- 2026-10-09 TWSE one-shot

P2/P3 ordinary push cannot silently perform physical D1 mutation.

Resonance deploy special handling:
- Worker/UI deploy may continue
- push schema check remains read-only
- schema mutation without a quota grant fails `D1_SCHEMA_MUTATION_REQUIRES_QUOTA_RESERVATION`

## Deterministic regression evidence

`d1_account_quota_budget_v0_1.test.mjs` verifies:
- official hard limits and account-wide scope
- unknown usage -> defer
- unauthorized System1 reserve -> defer
- synthetic evidence-authorized P0 reservation behavior
- P2 push -> read-only-only
- adaptive warmup shrinks from five to two dates in constrained headroom
- observed 78,368 same-day usage causes lower-priority warmup to defer before Cloudflare hard rejection
- caller-required unknown write cost -> defer
- near-limit bulk writer -> defer
- READ_ONLY paths retain no mutation authority

`d1_account_quota_workflow_guard_v0_1.test.mjs` verifies:
- registry completeness against all shared-writer workflows
- each physical writer binds the common quota action
- P2/P3 push mutation protection
- adaptive Recent A1 wiring
- Daily Shadow gate/result wiring
- schema mutation guard
- GraphQL account usage path
- reservation/result receipt types
- unregistered-writer failure
- no billing/subscription/payment/plan-upgrade implementation
- System1 reserve remains evidence-honest UNKNOWN

Formal CI:
- System2 Research CI `37893287729`: **PASS**
- V8 Regression `37893287751`: **PASS**

## Protected boundaries

Unchanged:
- System 1 Formal Core
- System 1 production business logic
- System 1 23:35 / 23:55 formal windows
- System 2 PIT / UNKNOWN / history immutability
- System 2 strategy / ranking / final-selection semantics
- production push / capital / order authority
- Cloudflare plan / billing

No automatic paid-tier upgrade was performed or implemented.

## Remaining UNKNOWN / physical acceptance gap

Repository implementation is complete, but this HIGH correction is not physically closed.

Still required:
1. Evidence-authorized System1 after-market reserve. Current n=2 evidence is insufficient.
2. A bounded post-merge multi-writer UTC-day acceptance, or equivalent physical evidence, showing reservation/result reconciliation and no Cloudflare quota collision.
3. A later real trading-day System1 23:35/23:55 primary/recovery business-execution receipt that persists normally with no D1 quota rejection.
4. DATA_LANE 2026-10-08 historical physical acceptance continuation through this new gate.
5. Independent AUDIT_LANE verification.

These are not grounds to invent a reserve or bypass the gate.

## DATA_LANE handoff — 2026-10-08 physical acceptance

Target room:
`System 2｜歷史資料工程室`

After this evidence checkpoint is on latest main, DATA_LANE should:

1. Re-read latest main and its own `SYSTEM2_HISTORICAL_DATA_CHECKPOINT.md`.
2. Read `SYSTEM2_D1_ACCOUNT_QUOTA_BUDGET_V0_1.md` and the writer registry.
3. Continue the already-preregistered 2026-10-08 historical source/D1 acceptance; do not restart research architecture.
4. Before any physical D1 mutation, use the registered writer workflow and shared quota gate.
5. Preserve the gate reservation/defer artifact.
6. Preserve account-wide rowsWritten/rowsRead before/after evidence when a write is granted.
7. Preserve exact source-key/PIT/conflict-quarantine/immutability evidence.
8. If the System1 reserve is still unauthorized, accept `QUOTA_BUDGET_DEFER` as the correct fail-safe outcome; do not bypass it and do not substitute 2,825.
9. Do not purchase or assume a paid Cloudflare tier.
10. Return physical evidence to Correction Queue / AUDIT_LANE; DATA_LANE does not self-close CORR-003.

Durable handoff:
`system2/evidence/S2_CORR_20261007_003_IMPLEMENTATION_EVIDENCE_20261009_V0_1.json`

## Exact next continuation point

- **DATA_LANE:** continue 2026-10-08 physical historical acceptance using the merged quota gate and capture physical reservation/defer + D1 account analytics evidence.
- **AUDIT_LANE:** independently verify the repository implementation now; final `VERIFIED_CLOSED` remains blocked on the required physical multi-writer/System1 after-market evidence.
- **REMEDIATION_LANE:** do not change this HIGH correction to `VERIFIED_CLOSED`. Reopen only a specifically failed implementation conflict unit if independent audit returns one.
