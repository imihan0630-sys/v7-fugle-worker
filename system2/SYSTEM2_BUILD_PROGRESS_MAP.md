# System 2 Build Progress Map

Updated: 2026-10-04 Asia/Taipei  
Status: CANONICAL_BUILD_PROGRESS_MAP  
Scope: System 2 engineering/research build sequence  
System 1 / V8 Formal Core impact: NONE

## Purpose

This file is the canonical engineering progress map for System 2. It separates:
- repository/design complete;
- physically deployed;
- prospective evidence accumulating;
- implementation pending;
- owner-gated production authority.

GitHub `main` remains authoritative. Chat summaries are context only.

## Status legend

- ✅ COMPLETE / VERIFIED — implemented and, where relevant, physically verified.
- 🟡 IN PROGRESS / PARTIAL — useful components exist, but the end-to-end lane is not complete.
- ⏳ PLANNED / WAITING EVIDENCE — preregistered or mapped, not yet promoted.
- 🔒 OWNER GATE — explicit owner approval required before activation.
- ❌ NOT BUILT — no trustworthy implementation exists yet.

## End-to-end System 2 map

| ID | Layer | Status | Current truth / next dependency |
|---|---|---|---|
| S2-01 | Governance / System isolation | ✅ | Shared Knowledge + System 1/System 2 isolation established. |
| S2-02 | Data-source contracts / PIT clocks | 🟡 | Core source contracts exist; additional sources continue through PIT/availability verification. |
| S2-03 | Historical infrastructure | 🟡 | D1/R2, manifests, checkpoints, receipts, PIT Replay/Bulk Backtest primitives exist; full 2017-present cold history completion remains separate work. |
| S2-04 | Market Regime / shared 22-domain / 354-module research | 🟡 | Shared research network active; not every research finding is a production factor. |
| S2-05 | Factor Engine / family assessments / UNKNOWN semantics | 🟡 | Core contracts and research plumbing exist; richer validated factors remain incremental. Contextual Evidence Router North-Star contract now defines scenario-dependent knowledge routing and over-constraint diagnostics; runtime synthesis is not yet complete. |
| S2-06 | Multi-strategy contracts | 🟡 | Strategy families and Shadow contracts exist; exact live weights/thresholds remain evidence-gated. |
| S2-07 | Daily PIT-safe Shadow Orchestrator | 🟡 | Strategy-run -> RANK-01 -> revalidation -> capacity assembler is built; official A1 current-source + isolated D1 PIT-history read-only preflight is now repository-implemented. Daily source/history/factor diagnostic D1 writes and read API are physically verified via PR #303. Exact strategy assessor policies and scheduled physical daily `s2_capacity_runs` remain pending; diagnostic receipts cannot seed the pool. |
| S2-08 | Frozen Daily Decision / immutable archive | 🟡 | Schema/runtime primitives exist; depends on S2-07 for real daily prospective cohorts. |
| S2-09 | Ranking / capacity / overlap / concentration | 🟡 | Research engines and receipts exist; daily physical production depends on S2-07. |
| S2-10 | 19:00 next-session bounded pool | ✅ | Physically deployed; same-date/PIT freshness guarded; stale pools fail closed; max 9 unique, no forced filling. |
| S2-11 | User-video Daily Resonance baseline | ✅ | EMA16 + EMA64 + Impulse MACD; 0/3 to 3/3; intraday PROVISIONAL, closed-day CONFIRMED; bounded pool only. |
| S2-12 | Resonance Challenger comparison lane | 🟡 | Immutable common-input/version/PIT pairing core implemented; actual Challenger formula/preregistration and live paired capture remain pending. No execution/performance/promotion evidence yet. |
| S2-13 | Fugle live bounded monitor | ✅ | Worker secret configured; Ticker/adjusted history/Quote path deployed; no intraday full-market scan. |
| S2-14 | Resonance D1 persistence / episodes / operations audit | ✅ | Schema V1.1, 46 isolated `s2_` tables; snapshots/latest/runs/episode events and 19:00 operations audit deployed. |
| S2-15 | System 2 Worker / Cron | ✅ | `system2-shadow-research`; one consolidated Cron; four System 1 Cron triggers untouched. |
| S2-16 | UI / read API | 🟡 | Resonance UI/read APIs remain live. Actual Holdings UI contract now has a dedicated `USER_UPLOADED_BROKER_SCREENSHOT` source/read-model path, visually separate from VIRTUAL POSITIONS / CANDIDATES / WATCHLIST / SIMULATED FILLS. A real Owner snapshot has not yet been physically imported, so Actual Holdings current data remains empty/locked. |
| S2-17 | Execution simulation / position lifecycle | 🟡 | `VIRTUAL_POSITION_READY` remains unchanged. Screenshot Actual Holdings validation/snapshot/reconciliation/persistence runtime and additive isolated schema are implemented on the build lane; `ACTUAL_POSITION_MONITOR_VERIFIED=false` until a real Owner screenshot is confirmed and read back. Broker API/order routing/real capital remain disabled. |
| S2-18 | Strategy performance engine | 🟡 | Metrics/spec/storage concepts exist; trustworthy prospective sample population depends on S2-07 and downstream outcomes. |
| S2-19 | PIT Replay / Bulk Backtest | 🟡 | Engines exist; broad historical dataset and multi-strategy evidence expansion remain incomplete. |
| S2-20 | OOS / Forward / Prospective Shadow promotion evidence | ⏳ | Requires independent dates/regimes, cost/slippage, redundancy, overfit/multiple-testing and date-clustering checks. |
| S2-21 | Strategy version promotion / live capital / real order | 🔒 | Not authorized; requires evidence packet + explicit owner approval. |

## Position Monitor readiness boundary

Current capability state for `S2-CORR-20261004-002`:

- `DESIGN_APPROVED`: actual-vs-desired exposure and actual-holdings-outside-candidate-capacity architecture.
- `VIRTUAL_POSITION_READY`: simulated fills / virtual `s2_positions` / virtual `POSITION_MONITOR` lifecycle.
- `ACTUAL_HOLDINGS_SOURCE_AUTHORIZED=USER_UPLOADED_BROKER_SCREENSHOT`.
- `CHAT_ASSISTED_HOLDINGS_IMPORT_READY=CODE_TESTED_PENDING_REAL_OWNER_SNAPSHOT`.
- `ACTUAL_POSITION_MONITOR_VERIFIED=false`.
- Broker API holdings, real orders, live capital authority and broker order routing remain `NOT AUTHORIZED / DISABLED`.

No actual-holdings UI/API label is authorized from signal, suggested-share, plan, candidate or simulated-fill records. Any broker-holdings or System 1/V8 shared-holdings integration is a future `OWNER_DECISION_REQUIRED` gate.

## Resonance comparison lane — Baseline vs Challenger

### Role separation

**Baseline**  
`USER_VIDEO_RESONANCE_V0_1`

- owner-specified monitoring logic;
- current deployed reference lane;
- daily EMA16 / EMA64 / Impulse MACD;
- 0/3 -> 3/3 progression;
- PROVISIONAL before daily finality;
- CONFIRMED only after provider finality plus independent close-time gate.

**Challenger**  
`SYSTEM2_RESONANCE_CHALLENGER_V0_1`

- research-only alternate monitor designed by System 2;
- starts from the general architecture: Trend + Momentum + Price/Structure Confirmation;
- exact indicator family, lookback and threshold parameters are **NOT frozen by this map**;
- parameters must be preregistered before prospective comparison and cannot be changed retroactively after outcomes are known;
- cannot alter the Baseline signal, pool membership, capital, push, or order behavior.

### Mandatory fair-comparison contract

Both lanes must observe the **same**:
- bounded preselected stock pool;
- symbol membership and strategy membership;
- market date and observation timestamps;
- raw market-data/source vintage;
- current daily-bar finality semantics;
- corporate-action/adjustment semantics;
- transaction-cost/slippage assumptions for outcome evaluation;
- outcome horizons and MFE/MAE calculation window;
- Regime labels used for stratification.

No lane may receive a better data vintage or hindsight-only feature.

### Minimum immutable record

For every symbol / market date / observation clock / resonance version:
- monitor version;
- formula/parameter version;
- source receipt hash;
- pool id / capacity run id;
- 0/3–3/3 or equivalent component states;
- PROVISIONAL / CONFIRMED / RETRACTED state;
- first trigger timestamp;
- trigger price reference;
- final daily close state;
- signal retraction / whipsaw state;
- 1/3/5/10/20 trading-day forward returns when available;
- MFE / MAE;
- transaction-cost/slippage-adjusted outcome;
- Trend/Range and broader market Regime;
- whether the signal preceded, matched, lagged or disagreed with the other lane.

Historical records are immutable. A new parameter set requires a new Challenger version.

### Comparison questions

The lane exists to answer:
1. Which version triggers earlier?
2. Which version retracts or whipsaws more often?
3. Which version has better MFE/MAE geometry after trigger?
4. Which version survives costs better?
5. Which version behaves better in Trend vs Range and Risk-on vs Risk-off?
6. Does the Challenger add residual information beyond the Baseline, or is it merely a correlated restatement of EMA/MACD?
7. Are any apparent gains concentrated in one date cluster, industry or Regime?
8. Does either version reduce opportunity/capital utilization excessively?

### Promotion rule

The Challenger begins as **Shadow-only**.

It cannot replace, modify, veto, or add conditions to `USER_VIDEO_RESONANCE_V0_1` merely because backtest results look better. Promotion requires:
- preregistered version;
- PIT-safe replay and prospective Shadow;
- OOS and independent-date evidence;
- Trend/Range + Regime robustness;
- repaint/whipsaw analysis;
- cost/slippage;
- MFE/MAE;
- redundancy/incremental-value evidence;
- overfit / multiple-testing controls;
- explicit owner approval.

The comparison should **not** combine both lanes into a stricter four/five/six-condition live rule by default; that would risk recreating a low-trigger "always waiting" system without evidence.

## Phase placement

- **P3 Strategy / Shadow scoring:** preregister Challenger formula/version and comparison hypothesis.
- **P4 Frozen archive / simulated execution:** persist side-by-side immutable observations and outcomes.
- **P5 Performance / attribution:** expose Baseline vs Challenger performance, timing, retraction and Regime splits.
- **P6 OOS / Forward validation:** decide whether Challenger is incremental, redundant, regime-specific or rejected.
- **P7 / Owner gate:** only an explicitly approved version may affect user-visible formal monitoring authority.

## Current continuation priority

1. Finish S2-07 physical daily pipeline: verify the new A1/history preflight -> preregister strategy assessor policies -> wire assessments -> execute isolated D1 batches -> produce physical daily `s2_capacity_runs`.
2. Observe the first truthful 19:00 pool-refresh audit and next-session bounded monitor cycle.
3. Implement S2-12 Challenger preregistration + immutable paired capture on exactly the same bounded pool.
4. Accumulate paired prospective samples before any Challenger promotion decision.
5. Continue historical/PIT/OOS/performance infrastructure in parallel.

No step above authorizes real orders, live capital allocation, System 1 Formal changes, or forced stock selection.

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


## Owner North-Star additions — contextual synthesis and institutional UI

### Contextual synthesis
Canonical contract:
`system2/SYSTEM2_CONTEXTUAL_DECISION_SYNTHESIS_V0_1.md`

Required future build behavior:
- scenario/setup detection;
- dynamic evidence-family routing;
- HARD_GATE vs PRIMARY / SUPPORTIVE / CONTRADICTORY role separation;
- interaction and redundancy handling;
- over-constraint / opportunity-starvation diagnostics;
- actionable decision output with entry/stop/target/add/reduce/exit/warning semantics.

This is not authority to invent thresholds. Assessor and strategy policies remain evidence/version gated.

### Institutional monitoring UI
Canonical contract:
`system2/SYSTEM2_INSTITUTIONAL_MONITORING_UI_V0_1.md`

Required final experience:
- market command center;
- candidate board;
- holdings board;
- central decision chart workspace;
- action card;
- resonance center;
- alert center;
- performance center;
- professional dark terminal visual language with Taiwan red-up / green-down semantics;
- desktop-first plus compact mobile monitoring;
- visible source freshness / PIT / frozen-version provenance.

Current deployed resonance UI is an operational research surface, not the finished institutional terminal.


## 2026-10-04 MOPSOV month-shard reconciliation acceptance

S2-07 source-contract evidence advanced through PR #446 / merge `636305f79ecde412b27177dc677578d6116bc7d6`.

Physical control:
- 2330 / ROC 115 / months 1–9;
- full-query prefix = 151 rows;
- monthly union = 151 rows;
- no keyset differences;
- no duplicate month-shard keys;
- exactKeysetReconciliation=true;
- read-only boundary PASS.

This reduces query truncation/fragmentation uncertainty for the frozen control only. Revision completeness, knownAt clocks, suspension completeness and technical continuity remain blocked.

Next engineering target: multi-control month-shard reconciliation on the frozen correction/cancellation matrix, followed by empty-month/pagination semantics and historical knownAt validation.


## 2026-10-04 MOPSOV multi-control reconciliation acceptance

PR #448 / `8c1f9746ffe0593797403a5bc45c1cfbd68e0a35` expanded the month-shard source-contract guard to all four companies / five controls in the frozen MOPS correction/cancellation matrix.

Physical result:
- 4/4 companies exact-keyset PASS;
- 5/5 frozen controls covered;
- no only-full-query keys;
- no only-month-shard keys;
- no duplicate month-shard keys;
- read-only boundary PASS.

Remaining S2-07 continuity blockers are unchanged: empty-month semantics, higher-row-count truncation, knownAt certification, exchange-side cancellation/revocation coverage, suspension/resumption completeness, symbol-session completeness and technical continuity.

## 2026-10-04 MOPSOV empty-month characterization

PR #450 / `af1d526cb628ecaba64375a15e99ba0fbaaa6831` physically characterized the official zero-row company-month response.

Observed across four frozen empty controls:
- HTTP 200 / HTML;
- 2540-byte identical payload;
- SHA-256 `9d2e63bf800085e3953d9e675f72cd95131758de64546ad898a5beee56a39e5d`;
- rowCount=0;
- normalized text `公開資訊觀測站 資料庫中查無需求資料`.

Three same-endpoint positive controls remained non-empty and structurally distinct. Characterization PASS does not yet equal certification; `emptyMonthSemanticsCertified=false` remains authoritative.

Next engineering target: endpoint-specific certification with exact signature + positive controls + fail-closed drift behavior.

## 2026-10-04 MOPSOV empty-month certification V0.2

PR #452 / `35c7448baf7ef5790b0d5798e23d0ee4653207d1` promoted only the endpoint-specific empty-company-month semantics from characterized to physically certified.

Physical result:
- `MOPSOV_EMPTY_MONTH_SEMANTICS_CERTIFIED`;
- 4/4 empty controls PASS;
- 3/3 positive controls PASS;
- fail-closed drift/error tests PASS;
- `emptyMonthSemanticsCertified=true`.

The broader revision/continuity gates remain blocked. Next: higher-row-count truncation stress -> historical knownAt semantics -> exchange-side cancellation/revocation coverage.

## 2026-10-04 MOPSOV high-row pagination/truncation stress

PR #455 / `3772f6332465a5912d1ca32314c322b455685d18` physically stressed the official MOPSOV company-history endpoint on a frozen 11-company universe.

Top 3 by pre-cutoff row count:
- 2891 = 391;
- 3711 = 383;
- 2881 = 300.

All three reconciled exactly to Jan-Sep month shards with no one-sided or duplicate keys. No visible pagination hint was observed. This closes the currently planned frozen-sample high-row transport integrity gate, not revision completeness.

Next engineering target: historical version knownAt semantics.

## 2026-10-04 S2-07 revision provenance / clock integration milestone

Physical gates now available:
- PR #471: MOPS source-reported version clock semantics 5/5 PASS; exact public knownAt still blocked.
- PR #475: direct SFB/FSC 1342 cash-capital-increase revocation evidence observed.
- PR #480: prospective availability observation adapter implemented; retrospective leakage rejection physically PASS on 9 rows; no schedule added.
- PR #483: frozen cross-authority routing matrix 5/5 PASS; issuer/regulator/exchange roles kept separate.

Narrow true flags:
- `sourceReportedVersionClockSemanticsCertified=true`;
- `historicalKnownAtCandidateClockAvailable=true`;
- `frozenAuthorityRoutingCoverageComplete=true`.

Still false:
- public availability latency;
- exact knownAt;
- authority revision completeness;
- revision completeness;
- NO_EVENT;
- suspension/session completeness;
- technical continuity;
- all trading authority.

Next engineering target: bounded supplemental revision provenance receipt with explicit blocker decomposition, followed by shared suspension/session integration.

## 2026-10-04 S2-07 six-lane revision blocker receipt

PR #487 / `b75376bb4741ea6ca7eec6c7f09bd32056dcf162` converted revision incompleteness into a machine-readable six-lane blocker receipt.

All 6 final-result lanes are ready. MOPS query integrity and source-reported clock semantics are ready. The remaining work is now explicitly:
- prospective public-availability / exact knownAt evidence: 6 lanes;
- bounded authority revision coverage: 6 lanes;
- bounded revision-history coverage: 6 lanes;
- representative authority routing: 4 lanes.

Next target: representative authority routing for TWSE par-value and the three TPEx lanes, then shared suspension/session coverage.

## 2026-10-04 representative authority breadth advanced to 3/6

- PR #497: corrected bounded discovery; only 3152 was a valid new representative revision-chain candidate.
- PR #502: MOPS V0.3 + authority V0.2 physically promoted 3152; 6/6 frozen controls PASS; TPEx effective date exactly 2026-06-30.
- PR #503: canonical supplemental receipt V0.2 physically advanced representative authority coverage from 2/6 to 3/6.

Remaining representative gaps:
- TWSE par-value;
- TPEx ex-right/dividend;
- TPEx par-value.

All six lanes still retain knownAt and bounded-completeness blockers.

## 2026-10-04 representative authority breadth advanced to 4/6

- PR #518: expanded official-event discovery found one new valid candidate, 6548 長科*, for TPEx par-value change; TWSE par-value remained negative and the first 24 TPEx ex-right/dividend candidates remained negative.
- PR #520: 6548 physically promoted with MOPS 7/7, source clock 7/7, authority 7/7, exact TPEx effective date 2022-09-05.
- Supplemental revision receipt V0.3 now records representativeAuthorityReadyCount=4.

Remaining representative gaps:
- TWSE par-value change;
- TPEx ex-right/dividend.

All six lanes still retain knownAt and bounded-completeness blockers.

## 2026-10-04 representative authority breadth advanced to 5/6

- PR #528: final-two discovery negative; TWSE par-value final-result candidate path exhausted for supported 2020..2026 set and 2010..2019 endpoint exposed no events.
- PR #531: 6184 wrong-exchange false positive rejected.
- PR #533: 5356 協益 physically validated as a TPEx dividend correction chain with exact 2026-07-08 exchange event.
- PR #535: MOPS V0.5 / authority V0.4 / receipt V0.4 physically PASS, representativeAuthorityReadyCount=5.

Only representative gap:
- TWSE par-value change.

KnownAt and bounded-completeness blockers remain unchanged.

## 2026-10-04 TWSE par-value U04 alternate-source result

- PR #577: U04 source/serializer physical checks PASS.
- Four frozen 2025 TWSE par-value events queried in company + listed-market scopes.
- issuerEvidenceCandidateCount=0.
- revisionParValueCandidateCount=0.
- representative authority remains 5/6.
- exact U04 path is now an exhausted negative route unless new source evidence changes the premise.

Next: distinct official-source family inventory -> bounded alternate-source probes -> structural-unavailability disposition if all materially distinct historical routes remain negative.

## 2026-10-05 representative-routing research dispositioned at 5/6

- PR #594: TWTB7U historical-date semantics negative.
- PR #596: TWSE 公文公告 historical query contract physically established.
- PR #597: bounded 2025 official-document search negative after all frozen operational references were recovered and query completeness checked.
- PR #598: six-route final-gap disposition physically PASS.

Result:
- representative authority remains 5/6;
- one TWSE par-value representative gap remains but its current historical search program is dispositioned;
- blind repetition of exhausted routes is disabled;
- new official evidence may reopen the search.

Next BUILD_LANE target:
bounded authority/revision-history completeness -> shared suspension/session integration -> expected-session/RAW A1 lineage -> technical continuity.

KnownAt, revision completeness, NO_EVENT, session completeness and all trading authority remain false.

## 2026-10-05 bounded revision-history low-volume census

PR #610 physically froze 23 low-volume final corporate-action events for 2026-04-05..2026-10-02 and verified 23/23 issuer transport, 23/23 action-family history observability and 23/23 pre-effective issuer evidence.

Revision hints were present on 6/9 TWSE capital-reduction events and 6/9 TPEx capital-reduction events; both par-value lanes had zero revision hints in the bounded event set.

Next BUILD_LANE target:
event-to-version linkage + per-symbol query-integrity/no-revision/cancellation semantics. No revision-completeness flag is promoted yet.


## 2026-10-05 S2-07 bounded revision event linkage V0.2 physical result

Authoritative physical execution:
- commit: `fc3eac9e35fe6eacf8fef9805e6578ed91fe1701`;
- workflow: `System2 Bounded Revision Event Linkage V0.2 Readonly`;
- run: `37287352394`;
- job: `111689298076`;
- conclusion: PASS.

Observed result:
- eventCount = 23;
- `REVISION_CHAIN_OBSERVED = 6`;
- `AMBIGUOUS_MULTIPLE_ACTION_GROUPS = 15`;
- `AMBIGUOUS_MULTIPLE_VERSION_CHAINS = 2`;
- resolvedCount = 6;
- ambiguousCount = 17;
- `eventLinkageCoverageComplete=false`;
- `boundedRevisionHistoryCoverageComplete=false`;
- `correctionHistoryComplete=false`;
- `cancellationHistoryComplete=false`;
- `knownAtVersionClockCertified=false`;
- `revisionCoverageComplete=false`.

Interpretation boundary:
- the 6 observed revision chains are bounded diagnostic evidence only;
- 17 events remain unresolved / ambiguous;
- this does not prove revision completeness, NO_EVENT, exact knownAt, technical continuity, session completeness, or any trading authority;
- cancellation absence is not inferred from lack of a cancellation row;
- normalized subject stem is not sufficient promotion linkage evidence because distinct corporate-action episodes for the same issuer can share a similar normalized stem.

Exact BUILD_LANE continuation:
1. narrower follow-up for the 17 ambiguous events;
2. per-symbol query-integrity;
3. event-specific linkage disambiguation using explicit event anchors, with subject stem only as supporting evidence;
4. cancellation / no-cancellation evidence;
5. shared suspension/resumption + symbol-session integration;
6. RAW A1 lineage.

This is BUILD_LANE checkpoint/evidence progression, not a REMEDIATION_LANE correction.


## 2026-10-05 S2-07 ambiguous-event narrowing V0.3 physical result

Authoritative physical execution:
- merge commit: `8252a0b8417cf63fd317bb645c3f835a55d7e976`;
- workflow: `System2 Bounded Revision Event Linkage V0.3 Readonly`;
- run: `37328246286`;
- job: `111824389195`;
- conclusion: PASS.

The 17 V0.2 ambiguous events narrowed into:
- `AMBIGUOUS_NO_EVENT_SPECIFIC_ANCHOR = 10`;
- `PER_SYMBOL_QUERY_INTEGRITY_NOT_CERTIFIED = 7`;
- queryIntegrityCertifiedCount = 10;
- eventAnchoredCount = 0.

The 10 query-integrity-certified events reconciled company-history keys exactly against month shards over their bounded 400-day pre-effective windows. Seven events exposed year-vs-month shard discrepancies and therefore remain fail-closed before any negative or linkage claim.

All promotion/completeness flags remain false, including event linkage completeness, bounded revision-history completeness, correction history completeness, cancellation history completeness, exact knownAt clock certification, revision coverage, technical continuity and trading authority.

Interpretation: V0.3 disproves the sufficiency of normalized subject stem as an event key. No ambiguous event obtained a direct effective-date title anchor. The next diagnostic must inspect the seven keyset discrepancies at row level and use official-event subtype/detail plus issuer disclosure chronology/stage as candidate event-specific anchors; no promotion linkage may be made from subject normalization alone.


## 2026-10-05 S2-07 linkage diagnostics V0.4 physical result

Authoritative physical execution after transport retry + diagnostic-variable fix:
- merge commit: `664fc36ab2a35dfd7e930e1bd0d05f37d4bb3fdc`;
- workflow: `System2 S2-07 Linkage Diagnostics V0.4 Readonly`;
- run: `37330025545`;
- job: `111830481109`;
- conclusion: PASS;
- System2 Research CI run `37330025009`: PASS.

Physical summary:
- eventCount = 17;
- v03ExactCount = 10;
- discrepancyEventCount = 7;
- discrepancyOnlyAllTotal = 0;
- discrepancyOnlyMonthTotal = 9;
- officialSubtypePresentCount = 12;
- officialDetailPresentCount = 17;
- promotionLinkageEstablishedCount = 0.

Important diagnostic finding:
- the V0.3 whole-company year-vs-month mismatch is too broad to be treated as corporate-action history incompleteness;
- the 9 month-only rows include unrelated issuer-name-change notices and par-value recurring notice rows;
- symbol 3591 reconciled 40=40 on the V0.4 rerun although V0.3 had shown 40 vs 30, demonstrating that source-query snapshots can change across observation times;
- therefore the next query-integrity gate must reconcile issuer + target action-family rows, retain observation-time provenance, and fail closed for target-family discrepancies instead of treating unrelated company disclosures as blockers.

Official-event evidence is richer than title stems: all 17 have official detail, 12/17 have subtype, and the detail carries stop/resume dates or par-value conversion terms. These fields can support event-specific disambiguation together with issuer-scope action-family chronology; normalized subject stem remains insufficient by itself.

All completeness, NO_EVENT, exact-knownAt, cancellation-completeness, technical-continuity, session-completeness and trading-authority flags remain false.


## 2026-10-05 S2-07 event-specific linkage V0.5 physical result

Authoritative physical execution:
- merge commit: `50aac2717c47f6e1bc6fd29d29dd867267d09887`;
- workflow: `System2 S2-07 Event-Specific Linkage V0.5 Readonly`;
- run: `37331662930`;
- job: `111836005547`;
- conclusion: PASS.

Regression evidence around the same BUILD_LANE sequence:
- V8 Regression Tests run `37331377958`: PASS;
- V0.4 diagnostic rerun `37331377874`: PASS.

Physical summary:
- eventCount = 17;
- actionFamilyQueryIntegrityExactCount = 13;
- periodicNoticeOnlyDivergenceCount = 3;
- eventSpecificAnchorCandidateCount = 13;
- correctionObservedCount = 5;
- cancellationObservedCount = 0;
- promotionLinkageEstablishedCount = 0.

The four remaining action-family query-integrity divergences are all PAR_VALUE_CHANGE events: 6949 / 2026-09-07, 8937 / 2026-04-13, 5904 / 2026-08-10, and 4747 / 2026-08-31.

The 13 exact events have issuer + target-action-family keyset reconciliation and diagnostic event-specific anchors based on official event identity/detail plus issuer chronology. These remain bounded research candidates, not promotion-grade linkage and not trading authority.

Positive correction evidence is observed for five events: 3356, 3591, 1441, 6241, 4806. No cancellation disclosure was observed inside the V0.5 semantic episode candidates, but absence is not negative proof: `cancellationHistoryComplete=false` and no-cancellation may not be claimed.

All completeness / exact-clock / technical-continuity / trading-authority flags remain false.

Next exact BUILD_LANE continuation:
1. resolve the four PAR_VALUE_CHANGE source-divergence semantics at row/provenance level;
2. formalize cancellation state as positive-observed vs not-certified, never NO_CANCELLATION by absence;
3. determine which bounded event-specific candidates meet promotion evidence requirements without subject-stem dependence;
4. then continue shared suspension/resumption + symbol-session integration;
5. then RAW A1 lineage.


## 2026-10-06 S2-07 V0.3 ambiguous-event narrowing physical result

Authoritative execution:
- main commit: `8252a0b8417cf63fd317bb645c3f835a55d7e976`;
- workflow: `System2 Bounded Revision Event Linkage V0.3 Readonly`;
- run: `37328246286`;
- job: `111824389195`;
- conclusion: PASS.

Physical result over the 17 V0.2 ambiguous events:
- eventCount = 17;
- `AMBIGUOUS_NO_EVENT_SPECIFIC_ANCHOR = 10`;
- `PER_SYMBOL_QUERY_INTEGRITY_NOT_CERTIFIED = 7`;
- queryIntegrityCertifiedCount = 10;
- eventAnchoredCount = 0.

The 10 exact per-symbol company-history vs month-shard reconciliations are: 6176, 1563, 3356, 1441, 6550, 6129, 3710, 8277, 4806, 3086.

The 7 query-integrity mismatches requiring direct diagnostic follow-up are:
- 3591: all=40 / monthUnion=30 / onlyAll=10 / onlyMonth=0;
- 6949: all=72 / monthUnion=73 / onlyAll=0 / onlyMonth=1;
- 5381: all=58 / monthUnion=60 / onlyAll=0 / onlyMonth=2;
- 6241: all=57 / monthUnion=60 / onlyAll=0 / onlyMonth=3;
- 8937: all=49 / monthUnion=50 / onlyAll=0 / onlyMonth=1;
- 5904: all=44 / monthUnion=45 / onlyAll=0 / onlyMonth=1;
- 4747: all=42 / monthUnion=43 / onlyAll=0 / onlyMonth=1.

Interpretation:
- V0.3 successfully separated query-integrity from event-linkage ambiguity;
- no event acquired promotion-grade event anchoring;
- an effective-date token in the issuer subject is too strict and produced zero anchored events, so it must not be treated as a completeness gate;
- normalized subject stem remains supporting evidence only and must never be the sole corporate-action episode key.

All authority flags remain false: eventLinkageCoverageComplete, boundedRevisionHistoryCoverageComplete, correctionHistoryComplete, cancellationHistoryComplete, knownAtVersionClockCertified, revisionCoverageComplete, technicalContinuityCertified, and tradingAuthority.

Next BUILD_LANE continuation:
1. diagnose the 7 per-symbol all-query vs month-shard mismatches, including repeated-snapshot stability;
2. replace title-only effective-date anchoring with event-specific disambiguation evidence tied to source event identity / issuer / action family / effective date and, where available, official detail fields;
3. cancellation / no-cancellation evidence;
4. shared suspension/resumption + symbol-session integration;
5. RAW A1 lineage.


## 2026-10-06 S2-07 V0.4 per-symbol query-integrity physical result

Authoritative execution:
- commit: `bf94fcd267c0f87ca42df24935a4be5052247ac6`;
- workflow: `System2 Bounded Revision Query Integrity V0.4 Readonly`;
- run: `37376748993`;
- job: `111987637837`;
- conclusion: PASS.

Physical classification of the seven V0.3 query-integrity mismatches:
- `EXACT_KEYSET_RECONCILIATION = 1` (3591);
- `MONTH_SHARD_SUPERSET = 6` (6949, 5381, 6241, 8937, 5904, 4747).

Repeated `month=all` snapshots were stable. Therefore the six residual mismatches are not transient all-query nondeterminism in this run; the bounded month-shard union exposed additional rows that the stable all-query omitted. These six remain query-integrity unresolved for negative-history claims.

Important boundary:
- 3591 may advance only its per-symbol query-integrity gate;
- the six MONTH_SHARD_SUPERSET symbols do not support a negative no-revision/no-cancellation inference from `month=all`;
- none of this proves event linkage, revision completeness, cancellation completeness, NO_EVENT, exact knownAt, technical continuity, session completeness, or trading authority.

Next BUILD_LANE step: event-specific linkage disambiguation packets must use source event identity + issuer + action family + effective date + authority/detail evidence and preserve candidate rows separately. Normalized subject stem may be retained only as supporting text and must never be the sole episode key.


## 2026-10-06 S2-16 institutional terminal shell V0.1

BUILD_LANE implemented the first complete System 2 operating-interface shell from the existing Institutional Monitoring UI North-Star contract.

New read-only terminal surfaces:
- Market Command Center;
- Candidate Board;
- Decision Workspace;
- Virtual Positions;
- Resonance Center;
- Strategy Center;
- Performance Center;
- Event / Industry;
- Evidence / System.

Routes:
- `/` and `/terminal` -> new institutional terminal;
- `/resonance` -> existing dedicated resonance page preserved.

The shell binds only existing verified read APIs: health, bounded resonance, active pool, operations audit and daily Shadow diagnostic. Pending Regime, actual holdings, performance and event/industry data remain visibly UNKNOWN / LOCKED rather than being synthesized.

Authority boundary remains unchanged: no strategy/assessor change, no capacity mutation, no push, no orders, no actual holdings claim, no final-selection authority and no System 1 Formal Core change.

Next S2-16 wiring order follows S2-07 frozen candidate/read API -> Regime/market context -> virtual positions -> frozen decision/history -> performance -> PIT-safe event/industry.


## 2026-10-06 S2-16 institutional terminal shell V0.1 — PHYSICALLY VERIFIED

Physical deployment acceptance:
- UI implementation merge: `95c85a4dfea513394caa265cb13b56fcabcbcc1f` (PR #654);
- D1 read-only deploy fast-path merge: `b2ae3488309df83bf9a6399c81ec5b1321ce2be2` (PR #655);
- terminal verification repair merge: `92b565c0effe217d0bf10188b2409728e727673c` (PR #656);
- deployment workflow: `System2 Daily Resonance Deploy` run `37389121118` / job `112029719361` = PASS.

Verified runtime facts:
- public Worker: `https://system2-shadow-research.imihan0630.workers.dev`;
- `/` and `/terminal` serve the institutional System 2 terminal shell;
- `/resonance` remains the dedicated resonance page;
- health, resonance, operations, daily diagnostic and terminal UI checks passed in the deployment workflow;
- System 2 D1 readiness used `READ_ONLY_FAST_PATH` with schemaVersion `1.1`, tableCount `46`, requiredTablesPresent=true, schemaMutationPerformed=false and writeReadVerification=`SKIPPED_ALREADY_READY`;
- one System 2 Cron remains `*/5 0-5,11 * * MON-FRI`;
- `captureState=CAPTURE_DISABLED` and `resonanceState=BOUNDED_RESONANCE_SCHEDULED`;
- `system1RuntimeUsed=false`;
- System 1 production files were verified unchanged.

Current UI truth boundary:
- complete operating shell / navigation / responsive layout is physically deployed;
- existing verified read APIs are live-bound;
- Market Regime, full daily candidate/frozen-decision population, virtual-position read API, performance cohorts, and PIT-safe event/industry read APIs remain pending and must display UNKNOWN / LOCKED / PENDING rather than synthetic data;
- actual holdings remain locked under `ACTUAL_HOLDINGS_SOURCE_NOT_WIRED` and `ACTUAL_POSITION_MONITOR_VERIFIED=false`;
- no strategy, selection, capital, push, order or Formal Core authority was promoted.


## 2026-10-06 S2-07 Par-Value Divergence V0.6 physical result

Authoritative execution:
- merge commit: `97cd68011fd6a938d39a23b77e1eafb43404b269`;
- workflow: `System2 S2-07 Par-Value Divergence V0.6 Readonly`;
- run: `37479166318`;
- job: `112322457257`;
- conclusion: PASS.

Physical summary:
- eventCount = 4;
- yearAllSubsetOfMonthUnionCount = 4;
- monthOnlyRowCount = 4;
- `MONTH_ONLY_RECURRING_NOTICE_COPY = 3`;
- `MONTH_ONLY_STOP_DATE_FACE_VALUE_NOTICE = 1`;
- cancellationDisclosureObservedCount = 0;
- noCancellationCertifiedCount = 0;
- sourceSemanticsCertified = false;
- monthShardCoverageComplete = false;
- promotionLinkageEstablishedCount = 0;
- knownAtVersionClockCertified = false;
- technicalContinuityCertified = false;
- tradingAuthority = false.

Row-level disposition:
- 6949 / 2026-09-07 -> one month-only recurring face-value notice;
- 8937 / 2026-04-13 -> one month-only stop-date face-value notice;
- 5904 / 2026-08-10 -> one month-only recurring face-value notice;
- 4747 / 2026-08-31 -> one month-only recurring face-value notice.

Boundary:
the four V0.5 source divergences are now explained at bounded row/provenance classification level, but the extra rows remain lineage and cannot be discarded. Absence of cancellation disclosure is still history-incomplete, not NO_CANCELLATION.

Next exact BUILD_LANE continuation:
1. freeze promotion-evidence requirements that do not depend on normalized subject stem;
2. evaluate the 13 V0.5 exact event-specific candidates against that contract;
3. exclude the four V0.6 divergence cases from promotion-grade linkage until separately source-certified;
4. shared suspension/resumption + symbol-session integration;
5. RAW A1 lineage.


## 2026-10-06 S2-07 Promotion Linkage V0.7 physical result

Authoritative execution:
- repair merge: `84c0bc0c66a68eb3f01b5f2fddd3e658dd3cf81a` (PR #698);
- workflow: `System2 S2-07 Promotion Linkage V0.7 Readonly`;
- run: `37481645101`;
- job: `112330996478`;
- conclusion: PASS.

Physical summary:
- eventCount = 17;
- promotionEvidenceReadyCount = 7;
- promotionEvidenceBlockedCount = 10;
- promotionLinkageEstablishedCount = 7;
- cancellationObservedCount = 0;
- noCancellationCertifiedCount = 0;
- blockerCounts: TRANSPORT_NOT_READY=8, PAGINATION_NOT_CERTIFIED=8, SOURCE_QUERY_INTEGRITY_NOT_EXACT=6, EVENT_SPECIFIC_ANCHOR_NOT_ESTABLISHED=6, SEMANTIC_EPISODE_NOT_CERTIFIED=2.

Ready bounded events:
1563, 1441, 6550, 5381, 6241, 4806, 3086.

Important boundary:
`promotionLinkageEstablished=true` is only bounded event-linkage evidence grade. It does not establish full history completeness, exact knownAt, technical/session continuity, strategy/candidate authority, push/order/capital or trading authority. All corresponding authority/completeness flags remain false.

The initial V0.7 push failed because a PAR_VALUE_CHANGE unit fixture omitted chronology/aligned-episode fields while expecting promotion=true; the evaluator correctly failed closed. PR #698 repaired the fixture and tightened the chronology gate. The authoritative V0.7 physical workflow then passed.

Next exact BUILD_LANE continuation:
1. shared suspension/resumption + symbol-session integration;
2. preserve event-linkage vs continuity separation;
3. RAW A1 lineage after continuity provenance is explicit.


## 2026-10-06 S2-07 Symbol-Session Integration V0.8 physical result

Authoritative execution:
- implementation merge: `d7e7a99a032b99a1b6ba9911886912e89b6f0797` (PR #708);
- workflow: `System2 S2-07 Symbol Session Integration V0.8 Readonly`;
- run: `37488505236`;
- job: `112354734503`;
- conclusion: PASS;
- System2 Research CI `37488505308` PASS;
- V8 Regression `37488505279` PASS.

Physical result:
- eventCount = 17;
- promotionReadyCount = 7;
- boundedSymbolSessionEvidenceReadyCount = 0;
- blockedCount = 17;
- resumeDateObservedCount = 0;
- EVENT_LINKAGE_PROMOTION_NOT_READY = 10;
- SUSPENSION_RESUMPTION_MATCH_NOT_OBSERVED = 17;
- noSuspensionCertifiedCount = 0;
- suspensionCoverageComplete = false;
- symbolSessionCompletenessCertified = false;
- technicalContinuityCertified = false.

Source evidence:
- official market trading dates = 125 over 2026-04-05..2026-10-02;
- TWSE TWTAWU bounded population = 383 rows, artifact hash `10a78954777b94f838ad4996bad02891ef1e97597f684434b4c7b36d5a659857`;
- TPEx sprcHis bounded population = 30/30 rows, artifact hash `184c07e8cfd61f20a8cbf65ab49d2ab86ddac276da450eeed3938ec08c2ffe18`;
- neither source lane certifies all-history absence.

Interpretation:
the generic exchange halt/resumption population does not provide an exact resume-date match for any of the 17 frozen corporate-action events. This is negative source-family evidence, not NO_SUSPENSION evidence and not a reason to relax matching.

Next exact BUILD_LANE continuation:
1. extract corporate-action-native stop/resume schedule evidence from the already verified official continuity reference/detail lanes;
2. retain source-family identity instead of relabeling it as generic halt evidence;
3. bind only positive provenance-bearing schedule intervals to official market sessions;
4. unmatched cases remain `SUSPENSION_PROVENANCE_UNKNOWN`;
5. RAW A1 lineage only after bounded symbol-session evidence is positive.


## 2026-10-07 S2-07 Native Schedule Integration V0.9 — PHYSICAL PASS

- PR #713 / merge `44212a6f3d8556d2ffc98a0f85b7d0e97b65f269`
- main readonly run `37492646263` / job `112369057180`: PASS
- System2 Research CI `37492646329`: PASS
- V8 Regression `37492646417`: PASS
- 17 events -> 10 source-native schedules certified -> 4 combined bounded symbol-session positives
- ready symbols: 3086, 4806, 5381, 6241
- blockers retained: promotion not ready (10); TWSE native detail not self-describing (7)
- RAW A1 lineage remains unbound; technical continuity and all selection/trading authority remain false

Next BUILD_LANE cursor:
`S2-07 RAW A1 LINEAGE — BOUNDED FOUR-CASE ONLY`.


## 2026-10-07 S2-07 RAW A1 Lineage V1.0 physical result

Authoritative execution:
- implementation merge: `4c2350b499f3412b6a2be650c5d601ace2eea760` (PR #718);
- workflow: `System2 S2-07 RAW A1 Lineage V1.0 Readonly`;
- run `37496251790` / job `112381430570` = PASS;
- System2 Research CI `37496251753` = PASS;
- V8 Regression `37496251698` = PASS.

Physical result:
- bounded case count = 4;
- `rawA1LineageReadyCount = 1`;
- READY = 4806;
- BLOCKED = 5381, 6241, 3086;
- blocker counts: `PRE_SUSPENSION_RAW_A1_BAR_MISSING=3`, `RESUME_RAW_A1_BAR_MISSING=3`;
- D1 read-only metrics: requestCount=6, rowsRead=12, rowsWritten=0.

4806:
- previous official session = 2026-09-22;
- native stop/resume interval = 2026-09-23 -> 2026-10-02;
- exactly two provenance-bearing RAW A1 rows exist at the bounded endpoints;
- zero RAW A1 rows exist on the certified suspended official sessions;
- both endpoint rows remain `continuityState=UNVERIFIED`;
- `rawA1LineageBound=true` only for this bounded case.

5381 / 6241 / 3086:
- current isolated D1 contains zero RAW A1 rows in each bounded pre-suspension-to-resume query window;
- these are persisted-history coverage blockers, not proof of technical-continuity failure;
- BUILD_LANE must not ad-hoc backfill them; historical population remains DATA_LANE-owned.

Authority boundary remains:
`rawBarsMutated=false`, `adjustedPriceGenerated=false`, `continuityTransformPerformed=false`, `technicalContinuityCertified=false`, selection/final-selection/push/capital/order=false, System1 unused.

Next exact BUILD_LANE continuation:
1. freeze a bounded technical-continuity contract for 4806 only;
2. require independent adjustment/reference-price provenance rather than inferring continuity from price shape;
3. keep 5381 / 6241 / 3086 blocked until canonical DATA_LANE RAW A1 coverage exists;
4. do not generalize 4806 to the remaining event population.


## 2026-10-07 S2-07 Technical Continuity Bridge V1.1 physical result

Authoritative execution:
- implementation/trigger merge: `2250ba518e4e6b0e64d2df31406ffe51a9b752df` (PR #724);
- workflow: `System2 S2-07 Technical Continuity Bridge V1.1 Readonly`;
- merged-main run `37534597007` / job `112512227519` = PASS;
- merged-main System2 Research CI `37534597078` = PASS;
- PR V8 Regression `37534399074` = PASS.

Physical result for the only V1.0-ready case, 4806:
- official pre-action close = 10.4;
- official reference price = 14.87;
- official reference ratio = 1.4298076923076921;
- RAW pre-suspension close = 10.4;
- transformed pre-suspension close = 14.87;
- RAW resume open / close = 13.7 / 13.4;
- residual open gap = -7.86819098856758%;
- residual close move = -9.885675857431064%;
- bridge state = `BOUNDED_CONTINUITY_BRIDGE_READY_PIT_BLOCKED`;
- bridge blockers = none.

PIT boundary:
- official `knowledgeTimeMode=HISTORICAL_UNKNOWN`;
- `firstKnownAt=null`;
- `availableAt=null`;
- `pitEventReplayEligible=false`;
- `pitReplayBlocker=OFFICIAL_EVENT_KNOWLEDGE_CLOCK_HISTORICAL_UNKNOWN`.

Read-only / authority boundary:
- D1 requestCount=3 / rowsRead=9 / rowsWritten=0;
- raw history mutated=false;
- adjusted history persisted=false;
- continuity transform performed=false;
- `technicalContinuityCertified=false`;
- all-history continuity=false;
- selection/final-selection/push/capital/order=false;
- System1 runtime unused.

5381 / 6241 / 3086 remain DATA_LANE RAW A1 coverage-blocked and do not inherit 4806's positive result.

Next exact BUILD_LANE continuation:
1. investigate official reference-event historical availability/version-clock provenance only;
2. do not infer or backdate `firstKnownAt` / `availableAt`;
3. if historical availability cannot be independently proven, keep PIT replay blocked;
4. no strategy/ranking/candidate authority may consume this bridge before the PIT gate is resolved.


## 2026-10-07 S2-07 V1.2 — reference-event availability negative gate

Physical receipt:
- PR #729 merged V1.2 runtime into main as `777b5876917774a5ad4c32eac3e563df2b3acfe5`.
- Receipt PR #732 rebased the physical check on that merged main state.
- Dedicated workflow run `37538390532`, job `112525069738`: PASS.
- System1 isolation guard: PASS.
- exact stable reference identity uses `semanticHash + sourceRowHash`, not capture-specific `eventVersionId`.
- stable semantic hash: `b6a4c97fdf3ded2bdae7048852540e4f58c1a64da4cbc012e350d5227e20d869`.
- stable source-row hash: `518fcdf6b0f3d5dc8ffaafba59556c86da3cda76dd0e46c528217740c33ae92b`.
- observed eventVersionId for this run: `S2-CA-EVENT:82da757e780d7be2c3474f5ca505d385b55705d44b520f291dc7383f88c391ca`; this is receipt provenance only.
- MOPS capital-reduction family rows: 18.
- 2026 event semantic seed: `2026-02-24|16:28:25|3`.
- semantic-aligned 2026 episode rows: 8 / 8 source-clock eligible / 8 retrospective-only.
- independent historical public-availability evidence: 0.
- state: `REFERENCE_EVENT_HISTORICAL_AVAILABILITY_NOT_PROVEN`.
- PIT blocker: `OFFICIAL_REFERENCE_EVENT_HISTORICAL_AVAILABILITY_UNPROVEN`.
- `firstKnownAt=null`, `availableAt=null`, `pitEventReplayEligible=false`.
- no history mutation, no adjusted-history persistence, no selection/push/capital/order authority, System1 unused.

Accepted conclusion:
V1.2 closes the **investigation ambiguity**, not the PIT gate. Current official/MOPS evidence does not authorize reconstructing a historical public-availability clock for the exact TPEx 4806 reference-price row. 4806 therefore remains bounded research geometry only; PIT replay continuity stays blocked unless new independent exact-source availability evidence appears.

Next BUILD_LANE rule:
- do not repeat blind historical-clock promotion attempts for 4806 without new evidence class;
- continue non-conflicting S2-07/build work;
- 5381 / 6241 / 3086 remain DATA_LANE RAW A1 coverage-owned blockers;
- all trading/selection authority remains false.


## 2026-10-07 S2-07 V1.3 — prospective exact-reference observer

Physical acceptance:
- PR #733 dedicated workflow run `37539208003`, job `112527770695`: PASS.
- System2 Research CI run `37539207913`: PASS.
- no-scheduler/read-only/System1 isolation: PASS.
- exact reference: 4806 / TPEX / CAPITAL_REDUCTION / effective 2026-10-02.
- stable semantic hash: `b6a4c97fdf3ded2bdae7048852540e4f58c1a64da4cbc012e350d5227e20d869`.
- stable source-row hash: `518fcdf6b0f3d5dc8ffaafba59556c86da3cda76dd0e46c528217740c33ae92b`.
- genuine current prospective observation: `2026-10-06T22:13:44.304Z` (2026-10-07 06:13:44.304 Asia/Taipei).
- evidence class: `PROSPECTIVE_EXACT_VERSION_OBSERVER`.
- current-row public availability is proven by that observation time only; exact publication latency remains uncertified.
- applying this late observation to the historical 4806 replay cutoff 2026-10-02 15:30 Asia/Taipei returns `REFERENCE_PUBLIC_AVAILABILITY_NOT_PROVEN_BY_CUTOFF`.
- applying the same receipt at its actual observation cutoff returns `REFERENCE_PUBLICLY_OBSERVED_BY_CUTOFF`.
- this proves the adapter preserves causal time and refuses backdating.

Boundary:
- `eventVersionId` is still receipt provenance only; stable identity remains `semanticHash + sourceRowHash`.
- no high-frequency polling is required merely for by-cutoff causality.
- no selected-only post-parent capture is authorized.
- no Cron/scheduler was added.
- full market-wide/full-eligible source cut is not yet implemented.
- `noRevisionGapThroughCut=false` / not certified.
- symbol-session completeness and TECHNICAL_CONTINUITY remain uncertified.
- no strategy/ranking/candidate/push/capital/order authority; System1 untouched.

Next exact BUILD_LANE continuation:
1. bind V1.3 exact-reference observations into a shared-owner pre-parent evidence-cut manifest;
2. preserve market-wide/exchange-wide or full-eligible scope; selected-only remains forbidden;
3. reconcile expected vs observed exact-version keysets with append-only provenance;
4. implement late-discovered-pre-cut version falsification for `noRevisionGapThroughCut`;
5. only after that, bind symbol-session completeness and continuity receipts to genuine parent generations.


## 2026-10-07 S2-07 Pre-Parent Evidence Cut V1.4 physical acceptance

Authoritative implementation:
- PR #734 merged as `deb426f5611a500826b212346c7f846bfe72b568`.
- dedicated `System2 S2-07 Pre-Parent Evidence Cut V1.4 Readonly` run `37542639896` / job `112539041612`: PASS.
- System2 Research CI run `37542639932`: PASS.
- base..head comparison changed only five new System2 V1.4 files; System1/Formal files changed = 0.

Current physical diagnostic intentionally fails closed:
- V1.3 exact-reference observation stable key = `ef283de5c542e277e42105f12115cffe4d35a5a3b85fcb4c2f3db5c66fb5ba94`;
- evidence cut state = `PRE_PARENT_EVIDENCE_CUT_BLOCKED`;
- blockers = `EVIDENCE_CUT_SCOPE_INVALID`, `SELECTED_ONLY_CAPTURE_FORBIDDEN`, `MARKET_SCOPE_COVERAGE_MISMATCH`, `EXPECTED_VERSION_KEYSET_NOT_CERTIFIED_COMPLETE`;
- evidenceCutId = `S2-ECUT:b202ee83c3919878238a802c28c0e599b6032ae00e1fd5ef227a9d2a844a36f5`;
- sourceCutManifestHash = `609acccecf41544cb841eda3b64d0148348bdbd30bc26d89b4890d048902e1ec`;
- `preCutManifestReady=false`;
- `noRevisionGapThroughCut=false`.

The two-point reconciler is physically exercised and remains blocked on the current single-sample input. Unit tests separately prove the positive complete-scope contract, late-observation rejection, late-discovered-pre-cut falsification, allowed genuinely later versions, and payload-mutation rejection. Historical `sourceReportedAt` is permitted only as a falsification clock, never for positive historical admission.

V8 Regression run `37542639814` fails only at the pre-existing main test `tests/test_sda016_formal_c1_binding_governance_sync_v0_1.mjs`: it still expects `V0_5_58_TEST_ORACLE` while current main SDA-016 readiness is already `V820_PRODUCTION_VERIFIED_FIRST_SCHEDULED_DATE_INELIGIBLE_GENUINE_BINDING_PENDING_T48_OPEN_SHARED_AUTHORITY_PENDING`. `PRICE_VOLUME_CHECKPOINT.md` already records this exact stale baseline assertion and instructs other lanes not to mutate SDA-016 merely to force green CI. V1.4 does not modify that System1 conflict unit.

Authority boundary:
- no scheduler/Cron added;
- history mutation=false;
- symbol-session completeness=false;
- technical continuity=false;
- selection/final-selection/push/capital/order=false;
- System1 runtime unused;
- Formal Core unchanged.

Next exact BUILD_LANE continuation:
1. implement a genuine market-wide / exchange-wide / full-eligible pre-parent capture from verified official source lanes;
2. freeze the complete expected exact-version population before the parent cutoff;
3. persist immutable evidence-cut identity and source hashes;
4. run post-parent bounded-complete reconciliation;
5. only after `noRevisionGapThroughCut` passes bind symbol-session completeness and continuity receipts to genuine parent generations.


## 2026-10-07 S2-07 Pre-Parent Evidence Cut V1.4.1 identity-domain correction — PHYSICAL PASS

V1.4 post-merge integration audit found an identity-domain mismatch: V1.3 official reference-row `stableReferenceKey` had been accepted into a generic exact-version keyset while downstream `noRevisionGapThroughCut` uses MOPS disclosure-version `versionKey/sourceReportedAt` semantics. These identities are not interchangeable.

PR #736 merged as `4748b4dd6e3a9c91cfa1567c0c6c0bf21d3eca69` and supersedes V1.4 for pre-parent identity semantics. No authority was ever granted by V1.4 and its physical cut was blocked, so no replay, selection, push, capital or order result was contaminated.

Physical verification:
- dedicated V1.4.1 run `37543866544`: PASS;
- System2 Research CI `37543866598`: PASS;
- physical diagnostic retains one accepted V1.3 reference observation but zero MOPS observations;
- `referenceIdentityDomainCountsTowardMopsKeyset=false`;
- `mopsIdentityDomainCountsTowardNoRevisionGap=true`;
- current cut remains `PRE_PARENT_EVIDENCE_CUT_BLOCKED`;
- blockers: `REQUIRED_MARKET_WIDE_LANE_COUNT_MISMATCH`, `EXPECTED_MOPS_KEYSET_NOT_CERTIFIED_COMPLETE`;
- `preCutManifestReady=false`;
- `noRevisionGapThroughCut=false`.

V1.4.1 now freezes three separate evidence domains:
1. exactly eight required market-wide source lanes;
2. prospective MOPS exact disclosure versions, including exact-version payload hash, `sourceReportedAt` and first-observed clock;
3. V1.3 official reference-row availability observations, retained only as bounded reference evidence.

Only domain (2) may enter the MOPS expected/observed keyset and later no-revision-gap reconciliation. Historical `sourceReportedAt` remains falsification-only and cannot positively backfill a missing historical version.

V8 Regression `37543866464` reproduces the already documented pre-existing SDA-016 stale assertion and is outside BUILD_LANE ownership; no System1/Formal file changed.

Next exact BUILD_LANE continuation:
1. build the genuine eight-lane market-wide source cut;
2. prospectively capture MOPS exact versions for the frozen event population;
3. use exact-version row/content hashes, not page-level hashes, for version mutation detection;
4. freeze the complete expected MOPS keyset before parent cutoff;
5. post-parent run bounded-complete MOPS reconciliation;
6. only after `noRevisionGapThroughCut` passes bind symbol-session and technical-continuity receipts.

## 2026-10-07 S2-07 Eight-Lane Market-Wide Source Cut V1.5 — PHYSICAL PASS

Authoritative implementation:
- PR #738 merged as `34455da7f47016ee149ffeaa963f798251e9fe3d`;
- dedicated `System2 S2-07 Eight-Lane Market-Wide Source Cut V1.5 Readonly` run `37545155428` / job `112547281624`: PASS;
- System2 Research CI run `37545155258`: PASS;
- physical artifact `11450381019`, digest `sha256:24f955376900366f929ec9739f42ea07fa6db1fc102ec5ce7ae7f00a265e6157`;
- V8 Regression `37545155314` reproduced only the already documented SDA-016 stale assertion and did not implicate any V1.5/System2 file.

Physical source cut:
- interval = 2026-04-05..2026-10-07;
- evidenceCutoffAt = `2026-10-06T23:12:23.799Z` (2026-10-07 07:12:23.799 Asia/Taipei);
- state = `EIGHT_LANE_MARKET_WIDE_SOURCE_CUT_READY`;
- sourceCutId = `S2-8LANE:55289262efdd48b2004494d86979873207e256ef645bea2a5d358b9fafed606d`;
- sourceLaneManifestHash = `1e8e4db2699a0e214123087c08ce390af85c547be71229b53ff6ea552f57b863`;
- 8/8 lanes eligible; TWSE=4 / TPEx=4; blockers=[].

Frozen lane results:
- TWSE ex-right/dividend actual: 1,131 rows / 836 ordinary symbols / exact range PASS;
- TWSE capital-reduction reference: 10 / 10 / exact range PASS;
- TWSE par-value-change reference: 1 / 1 / exact range PASS;
- TPEx ex-right/dividend actual: 936 / 614 / exact range PASS;
- TPEx capital-reduction reference: 11 / 11 / exact range PASS;
- TPEx par-value-change reference: 4 / 4 / exact range PASS;
- TWSE daily material information: 54 rows / 46 ordinary symbols / whole-snapshot parser PASS;
- TPEx daily material information: 29 rows / 21 ordinary symbols / whole-snapshot parser PASS.

Boundary:
- this closes the eight-lane whole-source snapshot gate only;
- `expectedMopsKeysetComplete=false`;
- `noRevisionGapThroughCut=false`;
- `preParentEvidenceCutReady=false`;
- symbol-session completeness=false;
- technical continuity=false;
- no scheduler/Cron, history mutation, selection/final-selection, push, capital or order authority;
- System1 runtime unused and Formal Core unchanged.

Durable evidence:
`system2/evidence/S2_07_EIGHT_LANE_MARKET_WIDE_SOURCE_CUT_V1_5_PHYSICAL_20261007.json`.

Next exact BUILD_LANE continuation:
1. prospectively capture MOPS exact disclosure versions for the frozen event population;
2. use exact-version row/content hashes, source-reported clock and first-observed clock;
3. freeze the complete expected MOPS version-key set before the parent cutoff;
4. bind V1.5 source-lane manifest + V1.4.1 MOPS version domain into the pre-parent evidence cut;
5. after the parent, run bounded-complete MOPS reconciliation and require `noRevisionGapThroughCut=true`;
6. only then bind symbol-session and technical-continuity receipts to genuine parent generations.

## 2026-10-07 S2-07 MOPS Exact-Version Population V1.6 — PHYSICAL PASS / MEMBERSHIP STABILITY BLOCKED

Implementation:
- PR #749 merged as `bc405245870d6e986cbbf709562ce93c320bb327`;
- superseded PR #742 was closed after its successful physical result was retained as an earlier prospective observation;
- latest-main dedicated V1.6 run `37548011614` / job `112556594405`: PASS;
- System2 Research CI `37548011621`: PASS;
- V8 Regression `37548011620`: PASS;
- latest artifact `11451716945`, digest `sha256:691e66ec3f279ef969b605ff8361052f4bc8c85d5b95655876b643d23786341a`.

Latest physical capture:
- frozen event scope = 23 events / 23 unique symbols;
- stable semantic event-universe hash = `b7941323ed1969a17697bc58be3d549b7e244f4dfc45b81a0bc6d5645fc305b0`;
- global MOPS version identity includes stock code + source-reported clock + seqNo;
- 161 unique global exact-version keys observed;
- all 23 frozen symbols covered;
- annual/month-shard exact keyset = 21/23 events;
- year-only versions = 7;
- month-only versions = 0;
- source-clock key collision count = 0;
- divergent latest-run events: 1441 (1 year-only) and 3086 (6 year-only);
- common annual/month versions have no payload-hash mismatch.

Repeated-capture falsification:
- prior successful V1.6 run `37547303476` / artifact `11451296954` observed 159 versions, 17/23 exact events, 9 month-only and 8 year-only;
- latest successful run observed 161 versions, 21/23 exact events, 0 month-only and 7 year-only;
- between successful runs, latest gained 9 exact-version identities and lost 7;
- common version payload mutation count = 0;
- therefore exact-version content identity is stable where the version is returned, but historical query membership is not stable enough to freeze the complete expected MOPS keyset from one capture.

Identity clarification:
- legacy V0.1 eventUniverseHash `3e31779c36582bd70378d4b393ce0d4b2510bb84fe557686a0e51d3a2f604049` included capture-specific `eventVersionId`;
- V1.6 `stableEventUniverseHash` intentionally hashes stable semantic event fields only and is not expected to equal the legacy receipt-bound hash.

Authority boundary remains locked:
- `sourceSemanticsCertified=false`;
- `monthShardCoverageComplete=false`;
- `expectedMopsKeysetComplete=false`;
- `noRevisionGapThroughCut=false`;
- `preParentEvidenceCutReady=false`;
- symbol-session completeness=false;
- technical continuity=false;
- no scheduler/Cron, history mutation, selection/final-selection, push, capital or order authority;
- System1 runtime unused; Formal Core unchanged.

Durable evidence:
`system2/evidence/S2_07_MOPS_EXACT_VERSION_POPULATION_V1_6_PHYSICAL_20261007.json`.

Next exact BUILD_LANE continuation:
1. implement repeated-capture exact-version union/stability reconciliation;
2. preserve the earliest observed-at upper bound across immutable receipts, never overwrite it with a later run;
3. classify membership drift by source query path and exact version;
4. require bounded repeated-capture stabilization before any complete expected MOPS keyset freeze;
5. only then bind the MOPS keyset with the accepted V1.5 eight-lane source manifest into the V1.4.1 pre-parent cut;
6. post-parent reconcile and require `noRevisionGapThroughCut=true` before symbol-session / technical-continuity binding.

## 2026-10-07 Owner holdings-source decision

Owner explicitly selected the current System 2 actual-holdings source:
`USER_UPLOADED_BROKER_SCREENSHOT`.

Build scope:
- structured extraction contract, not a general OCR engine;
- fail-closed deterministic validation;
- explicit review/confirmation;
- immutable snapshot + idempotency;
- previous/current reconciliation;
- dedicated actual-holdings read model;
- dedicated isolated `s2_actual_holdings_*` storage;
- no reuse of virtual `s2_positions` as ownership evidence.

Protected boundary:
- broker API = NOT AUTHORIZED;
- broker token/certificate = NOT REQUIRED / NOT AUTHORIZED;
- real orders = DISABLED;
- live capital authority = DISABLED;
- broker order routing = NOT AUTHORIZED;
- System 1 holdings auto-import = NOT AUTHORIZED.

First real Owner screenshot physical import/readback remains a separate acceptance gate.

## 2026-10-07 Physical implementation acceptance

Implementation:
- PR #775 merged as `28a42d5d49dce00a42dacf18797b45a904fc6dc3`.
- Dedicated Actual Holdings workflow run `37587329198` / job `112680392792`: PASS.
- System2 Research CI run `37587329275`: PASS.
- V8 Regression run `37587329189`: PASS.
- physical contract artifact `11466623799`, digest `sha256:ba59fa9a0d0a23ebf42f52f493a11da2c4193f03876ba5b0fdf3e7350e08404b`.
- additive SQLite migration verification: PASS; 52 isolated `s2_` tables; global schema remains 1.1.

Accepted implementation truth:
- `USER_UPLOADED_BROKER_SCREENSHOT` is the Owner-authorized current Actual Holdings source.
- validation / confirmation / immutable snapshot / idempotency / reconciliation / read-model separation are code-tested.
- `s2_positions` remains virtual/simulated only.
- low confidence / ambiguity remains `REVIEW_REQUIRED`; invalid core values can fail as `REJECTED`; unresolved review issues cannot be persisted as Actual Holdings.
- snapshot reconciliation never invents exact trade price, trade time or broker order ID.

Important physical limitation:
- verification used synthetic structured fixtures only;
- no real Owner broker screenshot was imported;
- guarded isolated-D1 provisioning was not invoked by this acceptance workflow, so migration 0009 is code/schema validated and wired into the provisioner but not claimed physically applied here;
- therefore `ACTUAL_OWNER_SNAPSHOT_IMPORTED=false` and `ACTUAL_POSITION_MONITOR_VERIFIED=false`.

Permanent current authority boundary:
- broker API = NOT AUTHORIZED;
- broker adapter/token/certificate = NOT AUTHORIZED / NOT REQUIRED;
- real orders = DISABLED;
- live capital authority = DISABLED;
- broker order routing = NOT AUTHORIZED;
- System 1 holdings auto-import = NOT AUTHORIZED.

Durable evidence:
`system2/evidence/S2_ACTUAL_HOLDINGS_SCREENSHOT_IMPORT_V0_1_PHYSICAL_20261007.json`.

Next holdings-specific physical gate:
`FIRST_REAL_OWNER_SCREENSHOT_CONFIRM_PERSIST_READBACK`.


## 2026-10-07 Physical implementation acceptance — final merged head

PR #772 merged as `14f67ddba88604e73a2488d4a561a571393f026b`. Final merged implementation head `5ce2c1bffc514405dd5ce5129f436e0933c37830` passed dedicated workflow run `37579261319` / job `112654963433`, artifact `11463608550`, digest `sha256:4552781daf18eddfb9cd8595a941a144be9c64d394cefd962ee2f7b594280f16`. Earlier run `37578018310` belonged to a superseded PR head that still performed a fourth live recapture and is retained only as historical provenance, not final-code acceptance.

Accepted physical result:
- state = `MOPS_APPEND_ONLY_UNION_READY_STABILIZATION_PENDING`;
- captureCount = 3;
- unionVersionKeyCount = 168;
- latestCaptureVersionKeyCount = 163;
- unionMissingFromLatestCount = 5;
- earliestObservedPreserved = true;
- latestObservedPreserved = true;
- payloadConflictCount = 0;
- monthOnlyDriftVersionCount = 21;
- trailingIdenticalTransitions = 0;
- boundedStabilizationCandidate = false;
- unionHash = `2f599d5599f383eedc71de8f3b0ec039e6dbac3689a43bd7dd620153120521ff`.

Interpretation: append-only provenance repair is physically accepted, but bounded stabilization is not yet satisfied. `expectedMopsKeysetComplete=false` and `noRevisionGapThroughCut=false` remain locked. Source semantics / month-shard completeness remain separate gates. No scheduler, selection, push, capital, order or System 1 Formal Core authority changed.

Durable evidence:
`system2/evidence/S2_07_MOPS_REPEATED_CAPTURE_UNION_STABILITY_V1_7_PHYSICAL_20261007.json`.

Next exact BUILD_LANE continuation:
1. continue bounded repeated capture stabilization from the durable 168-version union seed;
2. independently resolve month-shard/source semantics;
3. do not freeze a complete expected MOPS keyset until both provenance stability and source semantics pass;
4. only then bind the MOPS keyset with the accepted V1.5 eight-lane source manifest into the V1.4.1 pre-parent cut;
5. post-parent reconcile and require `noRevisionGapThroughCut=true` before symbol-session / technical-continuity promotion.


## 2026-10-08 05:53 Stage-1 launch-critical BUILD override — NC-T01 before preserved S2-07 cursor

Observed main before write:
`aec848a138af10c3b928a047c63f489383ce768e`.

The previous S2-07 MOPS stabilization cursor remains valid but is temporarily lower priority than the current Stage-1 launch blocker.

### BUILD_LANE active launch-critical work

**S2-CORR-20261007-005 — HIGH / OPEN**
- physical NC-T01 hidden-fallback evidence is not fail-closed;
- absent audit dimensions can default to false;
- exact-head static + runtime forbidden-access evidence is required;
- `HIDDEN_FALLBACK_AUDIT_SHA256` must be bound into the physical receipt.

**S2-CORR-20261007-006 — HIGH / OPEN**
- W0 continuity-ready is not equivalent to W1 strategy-executable;
- explicit required-evidence completeness is required;
- W0-only strategy-INCOMPLETE rows cannot promote requiredInputsState / executionState / candidateGenerationExecutable / legitimate zero-pick.

Combined patch contract:
`system2/evidence/S2_CORR_005_006_COMBINED_BUILD_HANDOFF_20261008_V0_1.json`.

Latest-main reconfirmation:
`system2/evidence/S2_CORR_005_006_LATEST_MAIN_RECONFIRMATION_20261008_V0_1.json`.

Physical gate:
`system2/evidence/S2_STAGE1_NCT01_PHYSICAL_ACCEPTANCE_MATRIX_20261008_V0_2.json`.

### Ordered launch path

1. BUILD: one combined CORR-005 + CORR-006 exact-head patch.
2. BUILD: exact-head regressions + System2 Research CI + applicable V8; merge.
3. DATA (parallel owner): real TWSE bounded suspension completeness + three corporate-action families -> source-honest CLEAR_NO_ACTION or CONTINUITY_UNKNOWN.
4. BUILD: one real read-only/artifact-only SHORT_MOMENTUM NC-T01 using the real continuity receipt and corrected hidden-fallback/W1 gates.
5. 00: independent T11..T16 recomputation.
6. REMEDIATION/D1 governance: CORR-003 persistence headroom before persisted SHORT_MOMENTUM -> RANK-01 -> `s2_capacity_runs`.
7. Then return to the preserved S2-07 MOPS repeated-capture/source-semantics continuation.

Optimization:
minimal CORR-005/006 patch is outside the 11 hard-bound SDA-022 policy-fingerprint source set; do not regenerate S22-T06..T10 fingerprints unless one of those 11 artifacts actually changes.

Formal Core remains LOCKED.


## 2026-10-08 06:02 Stage-1 BUILD priority — CORR-007 suspension provenance binding

CORR-005/006 are independently VERIFIED_CLOSED after merged PR #841.

Active BUILD blocker:
`S2-CORR-20261008-007` HIGH / OPEN / BUILD_LANE.

Defect:
TWSE suspension coverage COMPLETE can currently enter CLEAR_NO_ACTION promotion without a mandatory immutable bounded-suspension receipt digest/source ref.

Ordered path:
1. BUILD implements CORR-007 exact interval + digest + source/timing binding.
2. DATA concurrently completes TWTAWU V0.2 parity and real bounded receipt.
3. BUILD consumes only a matching real suspension evidence identity with the three existing corporate-action refs.
4. Real artifact-only NC-T01.
5. 00 independent T11..T16 verification.
6. Then CORR-003 persistence headroom and subsequent rank/capacity work.
7. Resume preserved S2-07 cursor after launch-critical chain.

Durable audit:
`system2/evidence/S2_STAGE1_NCT01_SUSPENSION_PROVENANCE_BINDING_AUDIT_20261008_V0_1.json`.

Formal Core remains LOCKED.


## 2026-10-08 06:22 Launch-critical order refinement — CORR-007 -> PR #844

Current code-firewall state:
- CORR-005 = VERIFIED_CLOSED;
- CORR-006 = VERIFIED_CLOSED;
- physical S22-T11..T16 = NOT YET PASSED.

Current BUILD blockers:
1. CORR-007 suspension-provenance binding:
   `S2_CORR_007_SUSPENSION_PROVENANCE_BINDING_HANDOFF_20261008_V0_1.json`.
2. PR #844 physical wrapper hardening:
   - reject mutating D1 SQL before transport;
   - runtime network/capability guard ledger;
   - derive runtimeForbiddenAccessCount from actual counters;
   - bind ledger identity into hidden-fallback audit/final receipt.

Order:
CORR-007 canonical merge -> #844 rebase/latest-main checks -> #844 merge -> physical fail-closed smoke -> real DATA continuity receipt -> real NC-T01 -> 00 T11..T16 audit.

Do not credit CI/synthetic evidence as physical independence.
Do not resume lower-priority S2-07 work until this launch-critical chain is cleared unless it can proceed without delaying the NC-T01 blocker.


## 2026-10-08 11:40 Stage-1 BUILD status — CORR-007 FIX_IMPLEMENTED

Launch-critical code firewall status:
- CORR-005 = VERIFIED_CLOSED;
- CORR-006 = VERIFIED_CLOSED;
- CORR-007 = FIX_IMPLEMENTED / independent AUDIT_LANE closure pending;
- CORR-008 = OPEN / blockedBy CORR-007;
- physical NC-T01 S22-T11..T16 = NOT YET PASSED.

CORR-007 implementation:
- merge `836184f98726449107cdbd0ed83e2746bbbcf965`;
- V0.2 evidence-bound TWSE suspension completeness;
- exact-window suspension digest/source/version/timing identity;
- additive matching suspension sourceEvidenceRef;
- legacy/status-only COMPLETE fail-closed;
- exact-head Research / Continuity / Artifact Runner / V8 Regression all PASS.

Durable BUILD handoff:
`system2/evidence/S2_CORR_007_BUILD_IMPLEMENTATION_HANDOFF_20261008_V0_1.json`.

Next launch-critical gate is independent CORR-007 closure. CORR-008 remains intentionally blocked until that gate is cleared. Real physical independence still additionally requires DATA_LANE source-honest TWTAWU/continuity evidence and one coherent read-only NC-T01 run.

Formal Core remains LOCKED.

## 2026-10-08 13:34 BUILD_LANE handoff — CORR-009 FIX_IMPLEMENTED

Implementation:
- PR #859 merged as `c7afee03aec24d1c5a3a79e71cb4c8250a67b61e`.
- Canonical decision evidence firewall now binds exact factor version, PIT eligibility, availableAt<=decision clock, source identity/hash and family-to-factor observation hashes.
- Unsafe/non-PIT/future evidence forces the frozen decision to `INCOMPLETE`, clears rank/score, blocks strategy readiness and prevents outcome join.
- AP-01 is reproduced and fail-closed.

Exact-head PASS:
- CORR-009 Decision PIT Firewall `37732779734`;
- System2 Research CI `37732779722`;
- NC-T01 Continuity `37732779809`;
- NC-T01 Artifact Runner `37732779729`;
- V8 Regression `37732779747`.

Merged-main PASS on `c7afee03aec24d1c5a3a79e71cb4c8250a67b61e`:
- CORR-009 `37732958236`;
- System2 Research CI `37732958273`;
- NC-T01 Continuity `37732958318`;
- V8 Regression `37732958351`.

Disposition:
- `S2-CORR-20261008-009 = FIX_IMPLEMENTED`;
- CRITICAL correction remains pending independent AUDIT_LANE verification before `VERIFIED_CLOSED`;
- durable evidence: `system2/evidence/S2_CORR_009_BUILD_IMPLEMENTATION_HANDOFF_20261008_V0_1.json`.

Next BUILD priority:
1. continue the next unblocked CRITICAL correction from the canonical queue;
2. CORR-008 remains blocked by CORR-007 independent closure;
3. preserve physical NC-T01 and System1 Formal Core boundaries.

