# System 2 — 台股多策略智慧選股平台

Updated: 2026-09-29 Asia/Taipei
Status: BOOTSTRAP / DESIGN_AND_RESEARCH
System ID: SYSTEM2
Production trading: NOT ENABLED

## Mission

Build a separate multi-strategy Taiwan-equity selection and monitoring platform that independently performs stock selection, entry/exit planning, intraday monitoring, notifications, simulated position management and performance learning, while preserving independent risk controls and measurable strategy performance.

System 2 is not a loosened copy of V8.

## Core design

Market environment -> strategy activation -> factor engines -> independent candidate ranking -> strategy-specific entry/exit plan -> intraday monitoring/notification -> simulated execution/position state -> performance attribution -> validated strategy versioning.

## Required dimensions

- market/index regime;
- global/macroeconomic transmission;
- industry cycle and future growth;
- fundamentals;
- valuation;
- technical structure;
- price-volume relationships;
- institutions/chips/ownership concentration;
- capital flow;
- news/events/catalysts and event half-life;
- supply/demand/capacity/inventory;
- strategy-specific weighting and minimum floors;
- multi-factor confluence;
- daily frozen decision records;
- independent simulated portfolios and performance comparison.

## Initial strategy families

1. SHORT_MOMENTUM
2. SWING_GROWTH
3. INSTITUTIONAL_ACCUMULATION
4. BLACK_HORSE_ACCUMULATION
5. INDUSTRY_TREND
6. FUNDAMENTAL_GROWTH
7. EVENT_DRIVEN
8. VALUE_REVERSION (research lane; not assumed useful until validated)

Weights are not authoritative yet. Initial weights are hypotheses and must be validated.

## Decision authority

System 2 is self-contained. It does not ask System 1 whether a stock may be selected or whether an entry/exit may trigger.

System 1/V8 may be used only as:
- a source of reusable validated market knowledge;
- a source-contract/data-experience reference;
- an independent comparison benchmark.

V8 A/B, Top6/3+3, capital rules and live-state machine are never prerequisites for System 2 decisions.

## Position-management rules

- Actual holdings are continuously monitored in a dedicated POSITION_MONITOR and do not consume candidate/entry-monitor caps.
- Position decisions are symmetric: HOLD / REDUCE / EXIT and ADD / RE-ADD / RESTORE are all first-class actions.
- Re-add after a prior reduction is not rejected solely because current price is above the reduce price.
- Exact sizing/re-add thresholds remain research hypotheses until prospective validation.

## Capacity rules

- Global System 2 candidate/watch pool: max 12 unique symbols.
- Per strategy ACTIVE_INTRADAY_MONITOR: max 3 symbols.
- No forced filling.
- One symbol may belong to multiple strategies; it counts once in the global candidate pool but remains separately tracked per strategy for monitoring and performance.

## Non-goals

- Do not alter V8 Formal Core during System 2 bootstrap.
- Do not force a fixed number of stocks.
- Do not optimize to a promised monthly profit target.
- Do not use future information in historical decisions.
- Do not hide zero-pick, low-utilization, or losing periods.

## Canonical files

- `system2/SYSTEM2_ARCHITECTURE.md`
- `system2/SYSTEM2_FACTOR_LIBRARY.md`
- `system2/SYSTEM2_STRATEGY_LIBRARY.md`
- `system2/SYSTEM2_PERFORMANCE_SPEC.md`
- `system2/SYSTEM2_BRIDGE_FROM_V8.md`
- `system2/SYSTEM2_CHECKPOINT.md`
- `system2/SYSTEM2_DATA_SOURCE_MATRIX.md`
- `system2/SYSTEM2_STORAGE_SCHEMA.md`
- `system2/SYSTEM2_STRATEGY_PREREGISTRY.md`
- `system2/SYSTEM2_LIMITED_SHADOW_PREREGISTRY_V0_1.md`
- `system2/SYSTEM2_SHADOW_RUN_PROVENANCE_V0_1.md`
- `system2/SYSTEM2_ISOLATED_PERSISTENCE_PLAN_V0_1.md`
- `system2/SYSTEM2_CLOUD_PERSISTENCE_READINESS_V0_1.md`
- `system2/SYSTEM2_PROSPECTIVE_SHADOW_CAPTURE_CONTRACT_V0_1.md`
- `system2/SYSTEM2_SOURCE_ARRIVAL_LATENCY_AND_DECISION_CLOCK_V0_1.md`
- `system2/SYSTEM2_SOURCE_ARRIVAL_LATENCY_AND_DECISION_CLOCK_V0_2.md`
- `system2/SYSTEM2_SOURCE_ARRIVAL_MEASUREMENT_VERIFICATION_V0_1.md`
- `system2/SYSTEM2_DECISION_CLOCK_EVIDENCE_AGGREGATION_V0_1.md`
- `system2/SYSTEM2_DECISION_CLOCK_REVIEW_PACKET_V0_1.md`
- `system2/SYSTEM2_SOURCE_ARRIVAL_MEASUREMENT_VERIFICATION_V0_2.md`
- `system2/SYSTEM2_RANKING_RESEARCH_PLAN_V0_1.md`
- `system2/SYSTEM2_STRATEGY_LOCAL_RANKING_BASELINES_V0_1.md`
- `system2/SYSTEM2_RANK02_ENTRY_READINESS_EXPERIMENT_V0_1.md`
- `system2/SYSTEM2_RANK03_CONFLUENCE_EXPERIMENT_V0_1.md`
- `system2/SYSTEM2_RANK04_REGIME_PRIORITY_EXPERIMENT_V0_1.md`
- `system2/SYSTEM2_RANK07_CONCENTRATION_EXPERIMENT_V0_1.md`
- `system2/SYSTEM2_RANK06_MULTI_STRATEGY_OVERLAP_EXPERIMENT_V0_1.md`
- `system2/SYSTEM2_RANK05_INCUMBENT_REPLACEMENT_EXPERIMENT_V0_1.md`
- `system2/SYSTEM2_CANDIDATE_CAPACITY_CONTRACT_V0_1.md`
- `system2/SYSTEM2_CANDIDATE_LIFECYCLE_CONTRACT_V0_1.md`
- `system2/SYSTEM2_EXECUTION_SIMULATOR_SPEC.md`
- `system2/SYSTEM2_POSITION_MANAGEMENT_ARCHITECTURE.md`
- `system2/SYSTEM2_MARKET_REGIME_V0.md`
- `system2/SYSTEM2_FACTOR_ENGINE_CONTRACT.md`
- `system2/SYSTEM2_STRATEGY_CONTRACT_V0.md`
- `system2/SYSTEM2_STRATEGY_SOURCE_READINESS_V0.md`
- `system2/SYSTEM2_SOURCE_CONTRACT_AUDIT.md`
- `shared-knowledge/SHARED_RESEARCH_MASTER_MAP.md`
- `system2/SYSTEM2_P1_IMPLEMENTATION_VERIFICATION.md`
- `system2/SYSTEM2_DAILY_RESONANCE_MONITOR_V0_1.md`
- `system2/SYSTEM2_DAILY_RESONANCE_LIVE_PIPELINE_V0_1.md`
- `system2/SYSTEM2_FUGLE_RESONANCE_QUOTE_SOURCE_CONTRACT_V0_1.md`
- `system2/SYSTEM2_DAILY_RESONANCE_GLOBAL_INTEGRATION_V0_1.md`
- `system2/SYSTEM2_BUILD_PROGRESS_MAP.md`
- `system2/SYSTEM2_DAILY_SHADOW_CAPACITY_ORCHESTRATION_V0_1.md`
- `system2/SYSTEM2_DAILY_SHADOW_INPUT_PREFLIGHT_V0_1.md`

## Bounded Daily Resonance runtime

The owner-authorized System 2 Daily Resonance lane is an isolated research/shadow runtime:

- input pool comes only from frozen System 2 capacity receipts and is capped at 9 unique symbols, max 3 per strategy; zero-pick days remain zero and no weak stock is added;
- intraday operation never discovers or scans the full market;
- the current-date unfinished daily bar is built from verified Fugle Quote/Ticker semantics plus cached adjusted finalized daily history;
- daily EMA16, EMA64 and Impulse MACD feed the existing 0/3 to 3/3 monitor without redefining its formula;
- an open daily bar can emit only PROVISIONAL resonance; CONFIRMED requires provider finality plus an independent at/after-13:30 Asia/Taipei close gate;
- simulated open System 2 positions resolve the existing HOLD lifecycle for EXIT_RESONANCE; otherwise the lifecycle is WATCH;
- episode/event persistence deduplicates repeated observations and preserves provisional retraction / close confirmation;
- isolated D1, read-only API and UI are the only live effects in V0.1; notification and order impact remain false;
- 15-minute K remains execution/timing context and cannot change the daily resonance state;
- System 1/V8 runtime, Formal Core, production monitoring/push and capital rules are outside this runtime and remain unchanged.

## Phase plan

P0 Bootstrap shared knowledge/network and project governance.
P1 Data-source inventory and PIT feasibility.
P2 Factor engine contracts.
P3 Strategy definitions and Shadow scoring.
P4 Frozen daily signal archive and simulated execution.
P5 Performance dashboard/attribution.
P6 OOS/forward validation and strategy-version promotion gates.
P7 Optional integration with V8 execution/monitoring through explicit interfaces only.

## Success metrics

Evaluate opportunity quality and capital utilization using:
- candidate count and trigger rate;
- return distribution;
- win rate;
- average win/loss;
- expectancy;
- profit factor;
- MFE/MAE;
- max drawdown;
- holding period;
- capital utilization;
- turnover/cost/slippage;
- regime robustness;
- strategy correlation/diversification;
- version-to-version improvement.

Monthly profit can be observed but is not a guaranteed or optimization-only target.

## Daily Resonance physical deployment state — 2026-09-30

The bounded Daily Resonance research/shadow lane is physically deployed.

- Main integration lineage: PR #262 -> PR #279.
- Current deployment commit: `6d6b4d5aafff55179397187fa69acefed428cd6e`.
- Deployment workflow run `36646552183`: PASS.
- System2 Research CI `36646479007`: PASS.
- V8 Regression `36646479081`: PASS.
- Isolated D1 schema V1.1: 46 tables, physical read/write verification PASS.
- Worker `system2-shadow-research` has one active Cron trigger `*/5 0-5,11 * * 1-5`.
- Runtime filtering keeps monitoring bounded to 08:55–13:40 Asia/Taipei and pool refresh to exactly 19:00.
- Fugle live quote secret is configured; health readback reports `fugleQuoteConfigured=true`.
- API/UI are live and read-only.
- Current empty-pool semantics remain fail-closed; no full-market scan or forced-fill behavior exists.
- Four System 1 production Cron triggers remain untouched.
- Live push, real orders, general System 2 selection capture and formal capital authority remain disabled.

## 2026-10-02 Daily Resonance operational integrity milestone

PR #295 (`03b9dd824d1efa85eee86b04ee68171563e9e523`) is deployed and verified: System2 Research CI `36930742222` PASS; V8 Regression `36930742371` PASS; deployment `36930843423` PASS.

- 19:00 pool refresh rejects stale/future-known `s2_capacity_runs` and emits an idempotent D1 audit even if the upstream capacity receipt is absent.
- Intraday watch-pool lookup is tied to the latest earlier durable refresh; an empty later refresh invalidates old pools. No change to the 9-symbol cap, resonance formulas, System 1, trading authority or Cloudflare Cron count.
- Public read-only operations API and UI expose upstream capacity, latest pool, last refresh, intraday cycle and explicit empty-pool reason.
- Physical readback on 2026-10-02: `UPSTREAM_CAPACITY_RECEIPT_MISSING`, `upstreamCapacity=null`, `activeSymbolCount=0`. The isolated Worker and Fugle binding are healthy; the absent upstream daily frozen capacity writer is the next integration dependency.
- The first new-format 19:00 audit is pending its actual scheduled occurrence; do not count deployment readback as a successful live stock-monitor cycle.

## Resonance Baseline / Challenger build lane — 2026-10-02

The canonical build map now includes a paired resonance comparison lane:

- Baseline: `USER_VIDEO_RESONANCE_V0_1` = the owner-specified/deployed EMA16 + EMA64 + Impulse MACD daily monitor.
- Challenger: `SYSTEM2_RESONANCE_CHALLENGER_V0_1` = research-only alternate Trend + Momentum + Price/Structure Confirmation architecture; exact formula/parameters are **not frozen yet**.
- Both versions must use the same bounded pool, market-data vintage, observation clock, finality semantics, costs and outcome windows.
- Paired observations/outcomes must be immutable and versioned; no retroactive parameter edits after outcomes are known.
- Challenger cannot modify/veto the Baseline, add live conditions, send push, change capital, or route orders without PIT/OOS/Forward evidence plus explicit owner approval.
- Implementation placement: P3 preregistration -> P4 paired frozen archive/outcomes -> P5 comparison dashboard/attribution -> P6 OOS/Forward promotion evidence.

See `system2/SYSTEM2_BUILD_PROGRESS_MAP.md` for the canonical status and comparison contract.

## S2-07 daily Shadow capacity orchestration — 2026-10-02

Repository implementation now covers the deterministic middle of the daily pipeline:
completed same-clock Limited Shadow strategy runs -> strategy-local RANK-01 receipts -> prior-pool revalidation -> owner-approved max-12/max-3 capacity -> immutable capacity/persistence batch.

Key boundaries:
- no universal numeric cross-strategy score;
- new admission V0.1 is limited to VALID + BUY_ELIGIBLE + RANK-01-rankable decisions, matching existing QUALIFIED_NOT_SELECTED semantics;
- INCOMPLETE prior memberships are retained without active-monitor authority because UNKNOWN cannot be inferred bearish;
- cross-strategy scarcity with no approved global priority policy fails closed and emits no capacity receipt;
- zero-pick is a legitimate capacity receipt, distinct from missing upstream execution;
- no scheduling, D1 execution, push, real capital or System 1 change is included.

Physical S2-07 remains incomplete until PIT-qualified real source/assessment adapters and isolated D1 persistence execution are wired and verified.

## S2-07 input readiness preflight — 2026-10-02

Repository implementation now includes a read-only upstream preflight before any daily capacity write:
- official TWSE/TPEx A1 current-day source fetch -> existing A1 snapshot contract;
- isolated D1 PIT-history reader requiring `pit_replay_eligible=1` and `available_at <= decisionTimestamp`;
- 60-prior-session history/continuity coverage diagnostics and revision-ambiguity fail-closed handling;
- explicit strategy-assessor registry showing SHORT_MOMENTUM and SWING_GROWTH as `ASSESSOR_POLICY_NOT_FROZEN`;
- zero-pick and capacity writes remain unauthorized while assessor policy is missing;
- a read-only physical workflow can measure current source/history readiness without D1 mutation, Worker mutation, Cron changes or System 1 use.

This closes another engineering gap without inventing entry thresholds. Exact assessor mapping from observations to thesis/readiness states remains a strategy-version decision, not an engineering default.

## 2026-10-02 S2-07 immutable daily diagnostic wiring V0.1

The authorized source/history/factor-observation portion is now wired to an isolated daily diagnostic writer and public read API. See `system2/SYSTEM2_DAILY_SHADOW_DIAGNOSTIC_V0_1.md` for the complete contract and acceptance state.

- Official calendar and current A1 sources -> PIT-history coverage -> existing unweighted factor primitives -> immutable source/diagnostic shards -> completion marker last -> exact D1 readback.
- Existing isolated schema V1.1/46 tables; no migration. GitHub daily diagnostic observation at 18:35 Taipei, using existing isolated writer concurrency. No additional Cloudflare Cron.
- `ASSESSOR_POLICY_NOT_FROZEN` remains authoritative. UNKNOWN regime/families are not scored, and diagnostic runs do not create frozen strategy decisions, prediction snapshots or capacity. `zeroPickDay`, `selectedCount` and `capacityRunId` stay null.
- Read-only `/api/system2/shadow/diagnostic` distinguishes no completed invocation from completed but blocked input/policy diagnostics. The 19:00 resonance path still requires real authorized `s2_capacity_runs`; diagnostics cannot populate its pool.
- General capture/final selection/push/capital/orders remain disabled; System1/V8 and Baseline/Challenger formulas remain unchanged.

Repository targeted tests PASS. Physical post-merge writer/deployment readback is pending and must be recorded from actual Actions/API evidence. Local 13:53 Taipei official source observation returned HTTP 200 with 2026-10-01 data, zero target-date rows: INPUTS_NOT_READY, not zero-pick. Today's 19:00 new-format audit has not occurred.

Exact continuation: physically verify the daily diagnostic writer/read API; preregister/authorize assessor policies and validated regime/fundamental/industry/current-continuity inputs before connecting authorized strategy evaluations/ranking/immutable capacity persistence. Do not invent policy to fill the pool.

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


## 2026-10-02 S2-12 common-input comparison core

Repository core implemented in `resonance_comparison_frame_v0_1.mjs`; contract `SYSTEM2_RESONANCE_COMPARISON_FRAME_V0_1.md`. One existing bounded pool/clock/source vintage/adjustment/finality/input payload binds unchanged user-video Baseline and future preregistered Challenger transport. Immutable frames, formula-version registration records and pair readback use existing isolated infrastructure tables; no migration. Missing real Challenger is CHALLENGER_NOT_PREREGISTERED. Hash-bound pairing is not verified Challenger execution or promotion evidence; outcomeEvaluationReady=false and all authorities false. Unknown cost/regime remains explicit; no indicator/threshold/weight is authored. Synthetic tests cover unfair pairings, future inputs, post-observation registration, outcome exclusion, identity/version conflicts and lost readback. Live paired capture/API/formula/preregistration remain NOT DEPLOYED / NOT FROZEN. System1, Baseline and Worker/Cron remain unchanged. Remote CI acceptance pending. This advances S2-12 independently of S2-07's current-source/assessor gates; 19:00 audit not yet observed.


## 2026-10-02 S2-12 repository core acceptance VERIFIED

PR #313 merged `22baa1dbe0ad45da99072c784e524994f45f693c`. Final PR head `3181c43652de9c060866db7e7311c6f31ef195ae`: System2 Research CI 36985165883 and V8 Regression 36985165926 PASS. Main System2 Research CI 36985338857 PASS. Common input/version/PIT/finality gates and immutable mock persistence/readback are repository-verified. Evidence: `system2/evidence/resonance_comparison_core_acceptance_20261002.json`.

This is a technical comparison kernel, not deployed paired capture: no real Challenger formula/parameters/preregistration, no verified Challenger execution, no physical comparison persistence and zero actual paired samples. Baseline and System1 unchanged; all authorities and promotion evidence flags remain false. Continue with a reviewed real Challenger contract/implementation and same-cache capture adapter before physical paired persistence; do not relabel synthetic transport fixtures as research results. S2-07 current-source/assessor/continuity gates remain separate. The 19:00 audit has not yet occurred at this acceptance.

## 2026-10-03 System 2 Cron weekday semantics correction — PHYSICALLY VERIFIED

A real scheduling defect was identified from the missing Friday 2026-10-02 19:00 pool-refresh audit. The prior single System 2 Cron was `*/5 0-5,11 * * 1-5`. Under Cloudflare Workers Cron weekday semantics, numeric weekdays map from Sunday, so `1-5` covered Sunday-Thursday and excluded Friday. The runtime-local Friday/weekday classification was correct; the Cloudflare envelope was not invoked on Friday.

Correction:
- PR #329 merged as `5abf334015f2d37c27a3e9b53e9021d38a06472a`;
- physical Cron is now exactly `*/5 0-5,11 * * MON-FRI`;
- System2 Research CI `37089765932` PASS;
- V8 Regression `37089765935` PASS;
- isolated Worker deployment `37089823064` PASS;
- post-deploy Worker State Audit rerun `37089823066` PASS with `cronCount=1` and the exact `MON-FRI` expression;
- D1 remains schema V1.1 / 46 tables; Fugle secret remains configured; `CAPTURE_DISABLED`; System 1 production files and four System 1 Cron triggers were not changed.

No manual historical refresh is fabricated for the missed 2026-10-02 invocation. The next prospective acceptance point is the next real weekday 19:00 Asia/Taipei run, which must leave a durable `POOL_REFRESH_*` receipt even when upstream capacity is absent.

Evidence: `system2/evidence/resonance_cron_weekday_physical_acceptance_20261003.json`.

## 2026-10-03 S2-07 official corporate-action continuity milestone — SOURCE/PARSER PHYSICALLY VERIFIED, CERTIFICATION STILL LOCKED

S2-07 advanced from unknown corporate-action source transport to a physically verified official-source parser lane without changing System1 or enabling System2 selection authority.

### Official source capability
- PR #375 established keyless read-only TWSE / TPEx continuity-source capability.
- PR #376 added defensive legacy TPEx HTML-envelope parsing after the legacy transport initially returned HTTP 200; a later physical HTTP 520 made that route unstable, so it was retired rather than hidden behind retries.
- PR #378 replaced the active legacy TPEx reduction route with modern official range JSON endpoints and added strict response-range identity.
- Physical run 37120129869: 8/8 active official source lanes STRUCTURE_READY; 6/6 historical actual-result range lanes matched the exact requested 2026-04-05..2026-10-02 interval. This proves transport/structure/range identity only, not event completeness or technical continuity.

### Immutable continuity archive core
- PR #393 merged as `9453279dfaf4141477fb312c7f3f31a37c0ead53`.
- Added `corporate_action_continuity_archive_v0_1.mjs` with immutable source captures and event versions, append-only revision/cancellation semantics, duplicate-observation reconciliation, explicit prospective/verified/historical-UNKNOWN knowledge clocks, and fail-closed NO_EVENT rules.
- Historical firstKnownAt / availableAt are never fabricated.
- NO_EVENT requires complete PIT universe + every required exact-range source contract + parser completeness + revision coverage + no missing source dates + certified empty-range semantics where applicable + unambiguous event versions.
- No D1 schema migration was introduced because existing generic tables are not semantically correct for raw corporate-action event archival.
- PR System2 Research CI 37131834282 PASS; V8 Regression 37131834291 PASS.

### Real official event parser
- PR #396 merged as `71f95e08bbafedc5da8012f8ae4f23ae77d1bc95`.
- Six historical official result lanes now normalize to immutable corporate-action event versions:
  - TWSE TWT49U ex-right/ex-dividend actual;
  - TWSE TWTAUU capital-reduction resume/reference;
  - TWSE TWTB8U par-value-change resume/reference;
  - TPEx exDailyQ ex-right/ex-dividend actual;
  - TPEx revivt capital-reduction resume/reference;
  - TPEx pvChgRslt par-value-change resume/reference.
- PR checks: System2 Research CI 37132693815 PASS; V8 Regression 37132693770 PASS; Official Continuity Event Parser Readonly 37132693820 PASS.
- Physical frozen-range result: 6/6 parsers ready, 0 parse failures, 1,465 normalized ordinary-equity events, and all 1,465 had usable official pre-action-close/reference-price pairs for continuity evidence.
- Historical event-signal PIT remains protected: all 1,465 normalized historical events kept firstKnownAt=null / availableAt=null / pitEventReplayEligible=false.

### Still not certified
The following remain deliberately false:
- revisionCoverageComplete;
- emptyRangeSemanticsCertified;
- noEventMayBeClaimed;
- symbolSessionCompletenessCertified;
- technicalContinuityCertified;
- continuityTransformPerformed;
- historyMutationPerformed;
- strategyEvaluationPerformed;
- capacityRunProduced;
- zeroPickClaimed;
- selectionAuthority / finalSelectionEnabled / livePushEnabled;
- capitalImpact / orderImpact;
- system1RuntimeUsed.

### Exact continuation
1. verify endpoint-specific empty-range semantics before any zero-event inference;
2. establish revision/correction coverage;
3. add exchange-complete suspension/resumption evidence;
4. design isolated append-only persistence only after the immutable record contract is stable;
5. bind verified event/suspension evidence to expected symbol sessions and RAW A1 lineage without mutating RAW bars;
6. only after history + continuity are READY address the separate `ASSESSOR_POLICY_NOT_FROZEN` gate and then Strategy -> Ranking -> Capacity -> real `s2_capacity_runs`.

System2 stage remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.



## 2026-10-03 S2-07 official empty-range semantics — PHYSICALLY CERTIFIED / NO_EVENT STILL LOCKED

The endpoint-specific empty-response semantics gate is now physically verified on top of the existing official corporate-action source/parser lane.

- PR #404 merged as `a1e2e2a065dce9f82f73d0f1b7e1681781a1666b`.
- Final PR checks after evidence write-back:
  - Official Continuity Empty Range Readonly `37133887169`: PASS;
  - System2 Research CI `37133887214`: PASS;
  - V8 Regression `37133887175`: PASS.
- Frozen empty target: 2026-10-03.
- Source-level result: `certifiedEmptySourceCount=6/6`.
- `emptyRangeSemanticsCertified=true` is now valid for the six frozen official historical source contracts when their endpoint-specific signatures match.

Certification is intentionally endpoint-specific:
- TWSE par-value-change and all three TPEx historical lanes require exact requested-range identity + the frozen official success status + the expected row envelope + zero rows.
- TWSE ex-right/ex-dividend actual and TWSE capital-reduction actual return only the official no-data status when empty, so they additionally require same-endpoint positive controls:
  - ex-right/ex-dividend: 2026-04-08, exact range verified, 1 row;
  - capital reduction: 2026-06-29, exact range verified, 1 row.
- Any signature drift fails closed.

This closes only the source-level empty-range semantics blocker. The following remain false:
- `sourceCoverageComplete=false`;
- `revisionCoverageComplete=false`;
- `noEventMayBeClaimed=false`;
- `suspensionCoverageComplete=false`;
- `symbolSessionCompletenessCertified=false`;
- `technicalContinuityCertified=false`;
- `historyMutationPerformed=false`;
- `strategyEvaluationPerformed=false`;
- `capacityRunProduced=false`;
- `selectionAuthority=false`;
- `finalSelectionEnabled=false`;
- `livePushEnabled=false`;
- `capitalImpact=false`;
- `orderImpact=false`;
- `system1RuntimeUsed=false`.

### Exact continuation
1. establish revision/correction coverage for the required corporate-action lanes;
2. add exchange-complete suspension/resumption evidence;
3. design isolated append-only persistence only after the record/coverage contract is stable;
4. bind event/suspension evidence to expected symbol sessions and RAW A1 lineage without mutating RAW bars;
5. only after history + continuity are READY address the independent `ASSESSOR_POLICY_NOT_FROZEN` gate, then Strategy -> Ranking -> Capacity -> real `s2_capacity_runs`.

System2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.


## 2026-10-03 S2-07 revision/correction coverage — NEGATIVE GATE PHYSICALLY VERIFIED

The revision/correction completeness boundary is now machine-enforced and physically verified.

- PR #409 merged as `9dfdedfe908db529dad0b0b2558ab73d626e879e`.
- Final checks after evidence write-back:
  - Official Continuity Revision Coverage Readonly `37134615903`: PASS_NEGATIVE_GATE;
  - System2 Research CI `37134615895`: PASS;
  - V8 Regression `37134615891`: PASS.
- Frozen interval: 2026-04-05 through 2026-10-02.
- requiredLaneCount=6.
- finalResultReadyCount=6.
- supplementalRevisionReadyCount=0.
- revisionCoverageComplete=false.

All six TWSE/TPEx historical actual-result lanes were physically readable with exact range identity and complete parsers, but all six are now explicitly classified as `FINAL_RESULT_RANGE_ONLY`.

No lane exposed a complete immutable correction/cancellation/version history or historical knownAt version clock. Every lane therefore remains blocked by:

`SUPPLEMENTAL_REVISION_HISTORY_CHANNEL_INCOMPLETE`

This is an accepted negative result, not an implementation failure. It prevents a complete current/final result page from being silently upgraded into historical revision completeness.

The supplemental channel contract is now frozen. A lane can become revision-complete only when an official supplemental source for the same exchange/action family and exact interval proves all of:
- revision/correction/cancellation history coverage;
- exact interval identity;
- parser completeness;
- immutable versions preserved;
- knownAt version clock coverage;
- correction history complete;
- cancellation history complete;
- no missing source dates.

Independent gates remain false:
- `noEventMayBeClaimed=false`;
- `suspensionCoverageComplete=false`;
- `symbolSessionCompletenessCertified=false`;
- `technicalContinuityCertified=false`;
- `historyMutationPerformed=false`;
- `strategyEvaluationPerformed=false`;
- `capacityRunProduced=false`;
- `selectionAuthority=false`;
- `finalSelectionEnabled=false`;
- `livePushEnabled=false`;
- `capitalImpact=false`;
- `orderImpact=false`;
- `system1RuntimeUsed=false`.

### Exact continuation
1. discover and physically validate supplemental official revision/correction/cancellation version-history channels; Shared research already identifies MOPS filings/corrections and exchange official-document announcements as candidates, but no endpoint is accepted before physical contract verification;
2. add exchange-complete suspension/resumption evidence;
3. design isolated append-only persistence only after the record/coverage contracts are stable;
4. bind verified event/revision/suspension evidence to expected symbol sessions and RAW A1 lineage without mutating RAW bars;
5. only after history + continuity are READY address `ASSESSOR_POLICY_NOT_FROZEN`, then Strategy -> Ranking -> Capacity -> real `s2_capacity_runs`.

System2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.


## 2026-10-03 S2-07 MOPS revision-source capability — PHYSICALLY OBSERVED

A supplemental official revision-history candidate is now physically verified at capability level.

- PR #415 merged as `42142a4278dadbe8fb8b9fc9b72b9e7aee04c2b2`.
- Final checks after evidence write-back:
  - MOPS Revision Source Capability Readonly `37135267184`: PASS_CAPABILITY_OBSERVED;
  - System2 Research CI `37135267177`: PASS;
  - V8 Regression `37135267247`: PASS.
- Official MOPS gateway returned HTTP 200 / code 200 and an allowlisted official history URL.
- Frozen positive control: 2467 志聖, ROC 115/05, event date 2026-05-22.
- Official history response preserved two distinct records for the same ex-dividend subject family:
  - 16:34:06 / seqNo=2 / original;
  - 17:42:13 / seqNo=4 / correction.
- `revisionHistoryCapabilityObserved=true`.

This proves the MOPS historical material-information lane can preserve an original disclosure and a later correction as separate historical records instead of overwriting the original.

It does **not** yet satisfy the supplemental revision-history completeness contract:
- `boundedIntervalCoverageComplete=false`;
- `actionFamilyCoverageComplete=false`;
- `cancellationHistoryComplete=false`;
- `knownAtVersionClockCertified=false`;
- `revisionCoverageComplete=false`;
- `noEventMayBeClaimed=false`;
- `technicalContinuityCertified=false`;
- `selectionAuthority=false`.

### Exact continuation
1. expand MOPS validation from one positive control to bounded multi-company / multi-action-family coverage;
2. add explicit cancellation/revocation controls and verify their historical representation;
3. validate source-reported date/time/sequence semantics before using them as version knownAt clocks;
4. join exchange official-document announcements as exchange-side evidence where MOPS alone is insufficient;
5. only after the supplemental contract is complete may the six-lane revision coverage receipt be reconsidered.

System2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.
