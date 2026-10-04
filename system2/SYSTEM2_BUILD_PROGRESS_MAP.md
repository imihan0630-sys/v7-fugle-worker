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
| S2-04 | Market Regime / shared 18-domain research | 🟡 | Shared research network active; not every research finding is a production factor. |
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
| S2-16 | UI / read API | 🟡 | Resonance UI, pool API, operations API, health live. Institutional Monitoring UI/UX North-Star contract now defines the final professional command-center experience; full multi-strategy candidate/holdings/performance interface remains pending. |
| S2-17 | Execution simulation / position lifecycle | 🟡 | Minimum research runtime exists; automated future-session outcome loop remains incomplete. |
| S2-18 | Strategy performance engine | 🟡 | Metrics/spec/storage concepts exist; trustworthy prospective sample population depends on S2-07 and downstream outcomes. |
| S2-19 | PIT Replay / Bulk Backtest | 🟡 | Engines exist; broad historical dataset and multi-strategy evidence expansion remain incomplete. |
| S2-20 | OOS / Forward / Prospective Shadow promotion evidence | ⏳ | Requires independent dates/regimes, cost/slippage, redundancy, overfit/multiple-testing and date-clustering checks. |
| S2-21 | Strategy version promotion / live capital / real order | 🔒 | Not authorized; requires evidence packet + explicit owner approval. |

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
