# S2-07 daily immutable input/factor diagnostics V0.1

Updated: 2026-10-02 Asia/Taipei
Classification: Class A / isolated research diagnostics
Formal Core impact: NONE
Baseline main: a5323d7e74ecf2d3a6b162e50fc67301a15389a6

## Problem and resulting behavior

The existing daily source/history preflight and ranking/capacity assembler were disconnected from physical daily persistence. Both registered strategy assessors remain `ASSESSOR_POLICY_NOT_FROZEN`. An absent assessor cannot be treated as a legitimate zero-pick or used to produce capacity.

The new diagnostic orchestrator executes the authorized portion daily: official calendar -> official same-date full-market A1 -> isolated PIT-history coverage -> existing unweighted A1 factor primitives -> immutable source/diagnostic shards -> final completion marker -> readback. No strategy thresholds or scores are added.

## Execution and time contract

- GitHub Actions `System2 Daily Shadow Diagnostic` targets main only, using the existing `system2-research` environment and non-cancelling `system2-isolated-d1-writer` concurrency group.
- Scheduled at 18:35 Taipei on weekdays; push/manual runs provide physical acceptance. GitHub schedule can be delayed and is not an exact Decision Clock or guaranteed pre-19:00 delivery.
- Each invocation derives its market date from actual Taipei wall time. Before 13:30 it records a skip without market/calendar calls. Official non-trading dates record a skip; unavailable calendar fails closed.
- Source observation time is a diagnostic clock, never the authorized prospective Decision Clock or proof of official publication time. First-known fields explicitly mean this observation's upper bound only.
- Stale/undated/duplicate/future/incomplete market data are archived as diagnostics and cannot enter factor computation. Source audit includes raw row count, reported dates and payload hash, including stale HTTP-200 responses.
- History is read through the existing PIT eligibility/availability/revision guard. Only coverage-qualified symbols load prior bars. Today's corporate-action continuity remains `UNVERIFIED`; prior-history continuity does not establish current continuity.
- Raw metrics remain available for research. Existing factor primitives retain UNKNOWN/null for unavailable history or continuity. No factor values are relabeled as strategy scores or SUPPORTIVE/ADVERSE assessments.

## Immutable physical storage and failure semantics

- No schema migration: isolated schema V1.1 and 46 tables remain unchanged.
- Source-session rows use existing `s2_source_session_receipts`; operational diagnostic shards and completion markers use existing `s2_infrastructure_checks`.
- Source rows, source/history metadata, per-symbol primitive bundles and manifests are stored in small content-hashed shards. All shards must write and read back identically before the completion marker is written.
- The existing immutable persistence executor rejects changed rows for the same identity. No UPDATE, REPLACE, delete or historical rewrite is used.
- Run IDs include GitHub run ID and attempt. A completed identical run returns its original saved receipt without refetching. Changed revision/content conflicts fail closed. Interrupted runs never gain a completion marker; a new attempt has a separate identity and cannot overwrite partial prior evidence.
- The public GET `/api/system2/shadow/diagnostic` returns the latest completed diagnostic. Optional `marketDate=YYYY-MM-DD` reads a specific date; absence means `DIAGNOSTIC_NOT_YET_OBSERVED`. Reads never invoke source discovery or writes.
- GitHub artifacts are retained for 90 days as a convenience; D1 is the durable diagnostic authority. Public API exposes the aggregate diagnostic receipt, not credentials or raw provider errors.

## Authority gates and exact remaining work

Regime stays UNKNOWN until validated regime sources are wired. Strategy evaluation/ranking, frozen decisions/prediction snapshot and capacity are explicitly `NOT_PRODUCED`/blocked in this diagnostic lane. `zeroPickDay`, `selectedCount`, and `capacityRunId` remain null, not zero. These diagnostics do not count toward Decision Clock promotion evidence.

The next implementation unit remains preregistration/owner authorization of actual assessor mappings, validated regime/fundamental/industry sources, current continuity evidence, then wiring the already-built Limited Shadow strategy orchestrator and capacity assembler to isolated batch execution. Only an authorized, genuinely evaluated zero-pick may produce `s2_capacity_runs`. Diagnostics cannot seed the 19:00 watch pool.

General selection capture stays false. No Baseline/Challenger change, live push, capital, order or System1/V8 change. No extra Cloudflare Cron; its existing single System2 trigger and four System1 triggers remain unchanged.

## Verification

Targeted tests cover missing inputs/policy, UNKNOWN factors, source/history clock mismatch, before-close and holiday skips, calendar/source failures, interrupted shard writes, final-marker ordering, immutable reruns/conflicts, aggregate hash checks and read-only dated lookup. Existing capacity/persistence/preflight tests remain required. GitHub System2 Research CI and V8 Regression plus post-merge physical writer/Worker API readback are required before claiming deployment.

2026-10-02 13:53 Taipei local source read: TWSE and TPEx HTTP 200, both latest reported date `1151001` (2026-10-01). Target 2026-10-02 normalized ordinary count = 0. This is truthful incomplete input, not a zero-pick result. The 2026-10-02 19:00 new-format resonance audit had not occurred at this observation.

## 2026-10-02 S2-07 daily diagnostic physical acceptance

PR #303 merged as `632f1f47a189c7c5f6d51b21b847bb1abf7935c6`.

- Final PR head `800458338e01d22d579fea7c224b6f8c8db5dcf8`: System2 Research CI `36971394695` PASS; V8 Regression `36971394765` PASS.
- Main System2 Research CI `36971466568` PASS; main V8 Regression `36971466579` PASS.
- Isolated daily diagnostic writer `36971466598` PASS. Actual receipt: `S2-DAILY-DIAGNOSTIC:2026-10-02:36971466598:1`, observed clock `2026-10-02T06:00:28.662Z` (14:00:28 Taipei), state `INPUTS_NOT_READY`, exact immutable D1 readback verified. Source-session hash `3192c5bd2203c77610aae6f7fd0348dc762441a1e9b38eb7a26baf2c3c46eb86`; completion manifest contains one verified source/history metadata shard. Cloudflare reports 11 requests / 23,727 rows read / 12 rows written (includes index accounting; not 12 logical diagnostic records).
- Existing read-only preflight `36971466557` PASS; no source/history readiness promotion is claimed.
- Isolated Worker deployment `36971466584` PASS, including V1.1/46 tables, unchanged single System2 Cron, configured Fugle secret, public API/UI/schedule checks and unchanged System1 production files.
- Physical GET `/api/system2/shadow/diagnostic?marketDate=2026-10-02` returned HTTP 200, the exact writer run/revision above, `INPUTS_NOT_READY`, `capacityRunId=null`, `zeroPickDay=null`, and both assessors `ASSESSOR_POLICY_NOT_FROZEN`.
- Physical dated read for 2026-10-01 returned `DIAGNOSTIC_NOT_YET_OBSERVED`, not a fabricated historical run.
- Physical `/health`: `schemaVersion=1.1`, `captureState=CAPTURE_DISABLED`. Resonance operations remain `UPSTREAM_CAPACITY_RECEIPT_MISSING`, `upstreamCapacity=null`, `activeSymbolCount=0`, `lastPoolRefresh=null`.

Physical daily diagnostic persistence/read API are now VERIFIED. The 18:35 scheduled invocation is configured but has not yet occurred at this acceptance. The 2026-10-02 19:00 new-format audit also has not occurred; neither is counted as observed evidence. S2-07 selection-to-capacity remains INCOMPLETE pending authorized assessor mappings, validated regime/fundamental/industry/current-continuity sources and genuine daily evaluations. No diagnostic receipt is relabeled as zero-pick, frozen decision/prediction, or `s2_capacity_runs`.

## 2026-10-02 S2-07 prospective daily history wiring

Class A / isolated System2 research only. The daily diagnostic writer now persists READY same-date TWSE and TPEx observations into existing immutable historical A1 tables, before diagnostic completion. `PROSPECTIVE_OBSERVATION` means `availableAt = first saved observedAt`, classified `OBSERVED_AVAILABLE_UPPER_BOUND`; it is not proof of official publication time. Exact repeated official content reuses its original first-known time and bar identity. Changed source content creates an independent immutable revision; existing history replay ambiguity guards remain active. Both markets are validated before writes and every historical bar is read back before diagnostic completion. Missing/stale inputs do not populate this lane. Continuity remains UNVERIFIED; no schema migration, strategy scores, authority, capacity or zero-pick is introduced.

Targeted tests cover repeat observations, corrections, stale/future first-known clocks, missing source, historical readback loss and absent diagnostic completion. Remote CI and physical readback acceptance are pending for this increment; S2-07 remains incomplete. Assessor policies, validated regime and current continuity remain separate gates. The 2026-10-02 19:00 audit has not yet occurred at implementation time.


## 2026-10-02 prospective-history physical acceptance

PR #307 merged `011cc6b300ac99b350c187e7d7f3a2ca447780e2`. PR System2 CI 36978923523 and V8 Regression 36978923517 PASS; main System2 CI 36980736245 and V8 36980736227 PASS. Main diagnostic writer 36980736267 PASS with exact immutable D1 readback, run `S2-DAILY-DIAGNOSTIC:2026-10-02:36980736267:1`, observation `2026-10-02T07:51:13.036Z`. Actual A1 state SOURCE_ERROR, prospective history SKIPPED_SOURCE_NOT_READY with 0 rows; positive live historical ingest is NOT yet verified. Capacity/zero-pick/selected remain null. Source transport error codes are added to aggregate receipts; writer adds read-only public diagnostic/health/operations verification and readback artifacts. Existing generic Worker receipt reader requires no deployment or schema change. At 15:53 Taipei the 19:00 audit has not occurred. S2-07 remains incomplete with selection authority disabled.


## 2026-10-02 16:00 Taipei public readback VERIFIED

PR #308 merged `b5148bd121a1db1f9061e354afbd5513434be047`. PR System2 CI 36981377643 (rerun after concurrency cancellation) and V8 36981377677 PASS; main System2 CI 36981526267, V8 36981526271 and diagnostic writer 36981526309 PASS. Exact D1 receipt and all three public GETs (diagnostic, health, operations) verified HTTP 200. Run `S2-DAILY-DIAGNOSTIC:2026-10-02:36981526309:1`, actual observation `2026-10-02T08:00:02.600Z`.

TWSE and TPEx both returned HTTP 200 with reported date `1151001` (2026-10-01); raw counts 1380 and 11871 respectively. Today's normalized ordinary count is 0 because stale rows are correctly rejected, not because an assessor produced zero picks. Prospective history `SKIPPED_SOURCE_NOT_READY`; positive live historical ingest remains unverified. Operations `UPSTREAM_CAPACITY_RECEIPT_MISSING`, upstreamCapacity=null, activeSymbolCount=0; health CAPTURE_DISABLED, schema 1.1. Source, immutable persistence, public diagnostic readback and fail-closed skip are physically verified. S2-07 remains incomplete pending real same-date inputs, authorized assessors, validated regime and continuity; no capacity/zero-pick/selection claim. Full evidence: `system2/evidence/daily_prospective_history_physical_acceptance_20261002.json`. 19:00 audit has not yet happened at this observation.
