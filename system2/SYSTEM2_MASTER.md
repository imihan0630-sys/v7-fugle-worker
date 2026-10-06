# System 2 — 台股多策略智慧選股平台

Updated: 2026-10-04 Asia/Taipei
Status: BOOTSTRAP / DESIGN_AND_RESEARCH
System ID: SYSTEM2
Production trading: NOT ENABLED

## Mission

Build a separate multi-strategy Taiwan-equity selection and monitoring platform that independently performs stock selection, entry/exit planning, intraday monitoring, notifications, simulated position management and performance learning, while preserving independent risk controls and measurable strategy performance.

System 2 is not a loosened copy of V8.


## Owner North Star — 操盤決策角色

System 2 的終局角色不是單純的選股器、因子排名器或研究儀表板，而是成為一套 **以台股為核心、可驗證、可持續學習的多策略操盤決策系統**。

它應在不同市場 Regime、不同持有週期與不同策略條件下，盡可能提高「可實際交易後仍具正期望值」的選股與持倉決策品質，並主動回答以下問題：

- **選誰**：從全市場或授權候選宇宙中找出最值得交易的個股，不強迫湊數；短線、波段與其他策略分開判斷，不用單一總分硬塞所有股票。
- **為什麼選**：說明市場／產業／基本面／估值／技術／價量／籌碼／事件／供需／Regime 與多因子共振，並保留反證、風險與 invalidation。
- **何時進場**：提供 strategy-specific entry zone、trigger、不得追價條件、stop、targets、max holding period 與進場失效條件；不得把訊號價等同成交價。
- **持有中怎麼做**：對每一個已持有標的持續輸出 HOLD / ADD / RE-ADD / RESTORE / REDUCE / EXIT / WARNING 等可行動狀態，而不是只有買進訊號。
- **何時改變看法**：偵測趨勢轉弱、價量背離、籌碼惡化、產業循環反轉、事件 half-life 衰退、估值過熱、Regime 切換、流動性與風險異常，並在 thesis 失效前後給出明確警示。
- **共振何時發生**：對 owner-approved 共振模型持續盤中監控；一旦達到有效訊號條件，應在資料與 finality 條件允許下儘快產生可追溯的提醒／推播事件，不得因研究架構而任意延遲。
- **事後是否真的有效**：所有 daily pick、signal、trigger、fill、加減碼、退出、警示與未觸發結果都必須 frozen、可回放、可歸因，並用真實可成交條件、成本、滑價、稅費、gap、漲跌停與 AMBIGUOUS sequencing 評估績效。

### Optimization objective

Owner 的實際目標是：**讓 System 2 儘可能選出成功機率高、風險報酬合理、成本後仍有正期望值的交易機會，並在持有期間持續改善進出場與風險管理決策。**

因此，系統不得把「勝率最高」理解成單一最佳化目標。高勝率若伴隨巨大尾部虧損、過度追價、低 payoff、過度交易、成本侵蝕、Regime 脆弱或過度擬合，不能視為成功。正式研究與版本比較至少共同考慮：

- calibrated hit / win rate；
- expectancy；
- payoff ratio；
- profit factor；
- max drawdown；
- MAE / MFE；
- realized slippage / fees / tax；
- turnover 與 capital utilization；
- trigger-to-fill 與 fill feasibility；
- holding-period efficiency；
- regime / industry / date robustness；
- false-positive / missed-opportunity rate；
- entry / add / reduce / exit decision quality；
- warning lead time；
- resonance alert latency 與 missed-alert rate。

### Profit-seeking, not profit-guaranteeing

System 2 的設計目的明確是 **提升可交易決策品質、追求長期正期望值與更好的實際資金結果**。

但任何策略都不得宣稱保證獲利、固定月收益或必然選中上漲股票；不確定性、虧損期、零選股日與策略失效都必須如實保留。

「帶著 owner 賺錢」在工程語意上，應被落實為：

**提高高品質機會辨識率 + 改善進出場與持倉管理 + 及時風險警示 + 快速共振提醒 + 嚴格成本後績效驗證 + 持續淘汰失效策略。**

它不能被簡化成回測勝率、漂亮報酬曲線或事後挑選成功案例。

## Contextual decision synthesis

System 2 must convert accumulated research knowledge into **scenario-dependent judgment**, not a universal checklist.

For each candidate, the engine identifies the current setup / strategy context, routes the relevant evidence families, separates HARD_GATE from PRIMARY / SUPPORTIVE / CONTRADICTORY evidence, preserves UNKNOWN / NOT_APPLICABLE semantics, evaluates interactions and redundancy, then produces an actionable decision.

A new research finding must not automatically become a new required condition. Over-constraint and opportunity starvation are measurable model defects and must be studied through near-miss / bottleneck / missed-opportunity diagnostics.

A legitimate zero-pick day remains allowed. The system must never loosen rules merely to fill a quota.

Canonical contract:
`system2/SYSTEM2_CONTEXTUAL_DECISION_SYNTHESIS_V0_1.md`.

## Institutional monitoring interface North Star

The final System 2 monitoring interface must operate as a professional institutional trading decision terminal: clear, fast, easy to understand, low-friction to operate and visually premium.

It must prioritize actionability:
market Regime -> capital / sector rotation -> candidate / holding priority -> recommended action -> entry / trigger / stop / target -> warnings / resonance -> drill-down evidence -> frozen history / performance.

The professional visual direction is dark graphite / navy with restrained premium gold / amber accents, Taiwan-market red-up / green-down semantics, high-contrast typography and minimal decorative noise. The desired "wealth / success" atmosphere must come from precision and confidence, not casino-like presentation.

Canonical contract:
`system2/SYSTEM2_INSTITUTIONAL_MONITORING_UI_V0_1.md`.

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

Capability/readiness must be explicit:

- `TARGET_ONLY` / `DESIGN_APPROVED`: once an owner-authorized actual-holdings source and reconciliation path exist, verified actual holdings belong to a dedicated POSITION_MONITOR layer outside candidate/entry-monitor caps, with symmetric HOLD / REDUCE / EXIT and ADD / RE-ADD / RESTORE decisions.
- `VIRTUAL_POSITION_READY`: the current implemented System 2 position lifecycle is simulated/virtual. `SIM_FILLED -> POSITION_MONITOR` and open `s2_positions` represent System 2 simulated positions, not owner actual holdings.
- `ACTUAL_HOLDINGS_SOURCE_NOT_WIRED`: System 2 currently has no authorized actual-holdings ingestion/reconciliation contract or physically verified quantity/cost/fill/ownership readback.
- `ACTUAL_POSITION_MONITOR_VERIFIED=false`: actual holdings must not be presented as continuously monitored today.
- Signal prices, suggested shares, plan snapshots and simulated fills must never be promoted into actual holdings. System 1/V8 holdings must not be imported without explicit owner authorization.
- Re-add after a prior reduction is not rejected solely because current price is above the reduce price; this remains an approved design rule whose exact sizing/re-add thresholds require prospective validation.

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
- `system2/SYSTEM2_CONTEXTUAL_DECISION_SYNTHESIS_V0_1.md`
- `system2/SYSTEM2_INSTITUTIONAL_MONITORING_UI_V0_1.md`
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


## 2026-10-04 MOPSOV month-shard source-contract milestone

PR #446 physically verified exact 2330/2026 Jan–Sep reconciliation between the official MOPSOV company-year query and bounded month shards: 151 vs 151 keys, no only-one-side keys and no duplicate shard keys. System2 CI, V8 regression and the dedicated read-only probe all PASS.

This is source-contract evidence only. It does not promote revision completeness, knownAt certification, technical continuity, selection authority, live push, capital or order authority.


## 2026-10-04 MOPSOV multi-control reconciliation milestone

PR #448 physically verified exact full-query vs Jan–Sep month-shard reconciliation across all four companies represented by the five frozen MOPS correction/cancellation controls. 4/4 companies passed with no one-sided or duplicate keys. This remains source-contract evidence only; revision completeness and all trading authorities remain locked.

## 2026-10-04 MOPSOV empty-month characterization milestone

PR #450 physically established the official MOPSOV zero-row company-month signature on four frozen empty controls: HTTP 200 HTML, 2540-byte identical payload, zero parsed rows and the visible official message `資料庫中查無需求資料`. Three positive controls remained non-empty and distinct.

This is characterization, not certification. `emptyMonthSemanticsCertified`, revision completeness, knownAt certification, technical continuity and all trading authorities remain false.

## 2026-10-04 MOPSOV empty-month certification V0.2 milestone

PR #452 physically certified the frozen official MOPSOV empty-company-month signature with four empty controls, three same-endpoint positive controls and fail-closed drift tests. `emptyMonthSemanticsCertified=true` is now valid only for this narrow source contract.

Global revision completeness, no-event authority, technical continuity, selection, push, capital and order authority remain false.

## 2026-10-04 MOPSOV high-row transport milestone

PR #455 physically verified exact full-query versus month-shard reconciliation for the three highest-row companies in a frozen 11-company MOPSOV sample: 2891 (391 rows), 3711 (383) and 2881 (300). No one-sided/duplicate keys or pagination hints were observed.

The next S2-07 revision-source blocker is historical version knownAt semantics. Revision completeness and all trading authorities remain false.

## 2026-10-04 S2-07 revision provenance and clock milestone

S2-07 now has physically verified MOPS source-reported clock semantics (PR #471), direct SFB/FSC regulator revocation evidence for the frozen 1342 control (PR #475), a fail-closed prospective availability observer that refuses retrospective knownAt fabrication (PR #480), and a 5/5 cross-authority issuer/regulator/exchange routing matrix (PR #483).

This materially narrows the revision-source blocker but does not certify exact public availability or bounded revision completeness. `knownAtVersionClockCertified=false`, `revisionCoverageComplete=false`, session/technical continuity and all trading authorities remain locked.

## 2026-10-04 S2-07 six-lane blocker decomposition milestone

PR #487 physically confirmed all six official final-result lanes are READY and isolated the real remaining revision blockers: prospective availability/knownAt on 6/6 lanes, bounded authority/revision-history coverage on 6/6 lanes, and missing representative authority routing on 4/6 lanes. Revision completeness, NO_EVENT, session/technical continuity and all trading authorities remain false.

## 2026-10-04 S2-07 representative authority 3/6 milestone

Corrected discovery PR #497 found one valid new representative control, 3152 璟德. PR #502 physically verified its cross-month MOPS original/correction chain and exact TPEx capital-reduction effective date 2026-06-30, advancing representative exchange coverage to three lanes. PR #503 then versioned the canonical six-lane receipt to representativeAuthorityReadyCount=3.

The remaining representative gaps are TWSE par-value change, TPEx ex-right/dividend and TPEx par-value change. Exact knownAt, bounded revision completeness, session/technical continuity and all trading authorities remain locked.


## Independent correction / audit governance

System 2 uses an independent correction loop to detect and remediate goal drift, design contradictions, false completion, silent abandonment, validation gaps, cross-module disconnects, provenance defects and authority leaks.

Canonical governance:
- `system2/SYSTEM2_CORRECTION_GOVERNANCE_V0_1.md`
- `system2/SYSTEM2_CORRECTION_QUEUE.md`
- `system2/SYSTEM2_CORRECTION_QUEUE.json`

Before substantive System 2 build continuation, the build/control room must inspect the correction governance and all active directives affecting the current task.

Severity does not grant implementation ownership. `routingClass / assignedLane / modificationOwner` determine which lane may mutate a correction conflict unit. BUILD_LANE may implement only corrections formally assigned to `LOCAL_FIX / BUILD_LANE`; it must not seize `DATA_LANE` or `REMEDIATION_LANE` work because a directive is CRITICAL/HIGH.

If implementation ownership changes, the Correction Queue must first record the new `routingClass / assignedLane / modificationOwner`; a room cannot self-transfer ownership in chat.

For CRITICAL/HIGH directives, the formally assigned implementation lane may progress the directive through `FIX_IMPLEMENTED`, but the same implementation role cannot self-declare `VERIFIED_CLOSED`. Independent verification or an explicit owner override remains required.

`FIX_IMPLEMENTED` is not equivalent to `VERIFIED_CLOSED`.

This governance is process-only and does not authorize any System 1 Formal Core change, System 2 live selection authority, production push, capital or order impact.


## Parallel execution lanes

Canonical ownership:
`system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

Permanent execution/audit structure:
- BUILD_LANE — `System 2｜建置總控室`: architecture, strategy/integration/UI/API/performance construction and tightly coupled local fixes.
- DATA_LANE — `System 2｜歷史資料工程室`: historical TWSE/TPEx ingestion, R2/D1 cold history, coverage, PIT/continuity and replay-input qualification.
- REMEDIATION_LANE — `System 2｜補強修復室`: cross-module, recurrent, orphaned, false-completion and explicitly routed remediation work.
- AUDIT_LANE — independent correction adviser: issue/routing classification and CRITICAL/HIGH closure verification.

Severity does not imply assignment. HIGH/CRITICAL corrections are routed to the lowest-risk owner rather than automatically to remediation.

Parallel work must preserve one active modification owner per conflict unit. Upstream incomplete data must never be treated as complete by downstream build work.

Current historical-backfill correction `S2-CORR-20261004-001` is assigned to DATA_LANE.

## 2026-10-04 S2-07 representative authority 4/6 milestone

Expanded discovery PR #518 found one new valid representative candidate: 6548 長科* for TPEx par-value change. PR #520 physically verified its exact MOPS original/correction chain and TPEx effective date 2022-09-05, advancing representative exchange coverage from 3/6 to 4/6.

Remaining representative-routing gaps are TWSE par-value change and TPEx ex-right/dividend. Exact knownAt, bounded revision completeness, session/technical continuity and all trading authorities remain locked. HIGH correction S2-CORR-20261004-001 separately remains ACKNOWLEDGED for the 2017 historical cold-backfill resumption and is not considered resolved by this S2-07 progress.

## 2026-10-04 S2-07 representative authority 5/6 milestone

PR #528 established another valid negative discovery pass. Wrong-exchange candidate 6184 was rejected in closed PR #531. PR #533 physically validated 5356 協益 as a true TPEx ex-right/dividend issuer-correction + exchange-event pair, and PR #535 promoted it into MOPS V0.5 / authority V0.4 / supplemental receipt V0.4.

Representative authority coverage is now 5/6. The only remaining representative-routing gap is TWSE par-value change. Exact knownAt, bounded revision completeness, session/technical continuity and all trading authorities remain locked.

## 2026-10-04 S2-07 TWSE par-value U04 negative milestone

PR #577 physically validated the MOPS U04 transport/serializer route and queried company plus listed-market scopes for the four frozen 2025 TWSE par-value events. No qualifying issuer revision/par-value row was observed, so the sole representative-routing gap remains TWSE par-value change.

This negative result is preserved. The system must not repeat the same path or weaken evidence criteria merely to force 6/6. Next work is alternate official-source discovery or a formal structural-unavailability disposition. Exact knownAt, bounded revision completeness, session/technical continuity and all trading authorities remain locked.

## 2026-10-05 S2-07 representative-routing search disposition milestone

S2-07 has formally ended blind representative-control discovery at an honest 5/6 rather than weakening evidence criteria to fill the sixth lane.

Final TWSE par-value evidence added:
- PR #594: TWTB7U does not expose historical-date content despite echoing the requested date;
- PR #596: TWSE official 公文公告 historical machine endpoint physically established with a known positive control;
- PR #597: complete bounded 2025 search recovered all frozen operational controls and found zero par-value revision rows;
- PR #598: machine-readable final-gap disposition PASS.

Authoritative state:
- representativeAuthorityReadyCount=5;
- representativeRoutingResearchDispositionComplete=true;
- remaining TWSE par-value gap is dispositioned, not promoted;
- representativeRoutingCoverageComplete=false;
- new official evidence may reopen the search.

Next S2-07 focus is bounded revision completeness plus shared suspension/session integration. Exact knownAt and all trading authority remain locked.

## 2026-10-05 S2-07 bounded revision-history census milestone

After representative-routing research was dispositioned at 5/6, S2-07 entered bounded completeness work.

PR #610 froze the 2026-04-05..2026-10-02 low-volume final-event universe (23 events / 23 symbols) and physically observed MOPS issuer-side action-family history plus pre-effective issuer evidence for all 23 events.

This is 23/23 observability, not exhaustive revision completeness. The next gate is event-to-version linkage and negative no-revision/cancellation qualification. Exact public knownAt and all trading authorities remain locked.


## 2026-10-07 S2-07 reference-event clock boundary

S2-07 V1.2 is physically accepted as a fail-closed historical-availability gate for the bounded 4806 / TPEX / CAPITAL_REDUCTION / 2026-10-02 reference event.

The stable cross-capture identity is `semanticHash + sourceRowHash`. `eventVersionId` remains observation-receipt provenance and is not used as a stable source key.

Physical run `37538390532` / job `112525069738` found 18 MOPS capital-reduction lineage rows, aligned the active 2026 episode to seed `2026-02-24|16:28:25|3`, and retained 8/8 rows as retrospective source-clock evidence only. There is zero independent exact-source historical public-availability evidence.

Therefore `firstKnownAt=null`, `availableAt=null`, `pitEventReplayEligible=false`, blocker `OFFICIAL_REFERENCE_EVENT_HISTORICAL_AVAILABILITY_UNPROVEN`. No System1/runtime/trading authority changed. Evidence: `system2/evidence/S2_07_REFERENCE_EVENT_AVAILABILITY_V1_2_PHYSICAL_20261007.json`.


## 2026-10-07 S2-07 prospective reference observation boundary

S2-07 V1.3 adds the shared-owner candidate adapter for genuine prospective first-observed evidence on exact official continuity reference rows.

Physical run `37539208003` / job `112527770695` observed the exact 4806 TPEx capital-reduction reference row at `2026-10-06T22:13:44.304Z`. Stable identity remains `semanticHash + sourceRowHash`; `eventVersionId` is observation provenance only.

The physical receipt proves the key causal firewall: the observation is valid evidence that the row was public by its actual observation time, but it does not unlock the earlier 2026-10-02 replay cutoff. No scheduler was added. Full pre-parent source-cut completeness, noRevisionGapThroughCut, symbol-session completeness, TECHNICAL_CONTINUITY and all trading authorities remain false.

Evidence: `system2/evidence/S2_07_OFFICIAL_REFERENCE_AVAILABILITY_OBSERVER_V1_3_PHYSICAL_20261007.json`.


## 2026-10-07 S2-07 pre-parent evidence-cut boundary

V1.4 is merged and physically verified as the shared-owner manifest/falsification layer after V1.3. It freezes evidence-cut identity, market scope, required source-lane hashes, prospective exact-version keysets, and a two-point `noRevisionGapThroughCut` reconciler.

The current physical V1.3 single 4806 sample correctly remains `PRE_PARENT_EVIDENCE_CUT_BLOCKED`; selected-only capture, incomplete dual-market scope and uncertified expected keysets cannot be promoted into a market-wide cut. This is the intended fail-closed result, not a strategy failure.

Dedicated V1.4 run `37542639896` and System2 Research CI `37542639932` PASS. V8 Regression has an independently documented pre-existing SDA-016 stale governance assertion and V1.4 changes no System1/Formal file.

No scheduler, selection, push, capital or order authority is enabled. Next BUILD_LANE work is the genuine pre-parent full-scope source cut, followed by bounded-complete post-parent reconciliation before any symbol-session/technical-continuity binding.


## 2026-10-07 S2-07 V1.4.1 identity-domain correction

V1.4.1 supersedes V1.4 pre-parent identity semantics after detecting that official reference-row keys and MOPS disclosure-version keys had been conflated. The corrected contract keeps eight market-wide source lanes, MOPS prospective exact versions and official reference observations as separate populations. Only MOPS disclosure versions may certify `noRevisionGapThroughCut`.

PR #736 / merge `4748b4dd6e3a9c91cfa1567c0c6c0bf21d3eca69`; dedicated run `37543866544` PASS; System2 Research CI `37543866598` PASS. Current physical input remains honestly blocked because the genuine eight-lane cut and complete prospective MOPS version population do not yet exist. Formal Core and all trading authority remain locked.

## 2026-10-07 S2-07 V1.5 eight-lane source-cut boundary

PR #738 / merge `34455da7f47016ee149ffeaa963f798251e9fe3d` physically captured the frozen eight official market-wide source lanes in dedicated run `37545155428` / job `112547281624` (PASS). All 8/8 lanes are cutoff-ready with TWSE=4 / TPEx=4; the six corporate-action historical lanes have exact range identity and the two daily material-information feeds are whole-snapshot parser-complete. Source cut identity is `S2-8LANE:55289262efdd48b2004494d86979873207e256ef645bea2a5d358b9fafed606d` with manifest hash `1e8e4db2699a0e214123087c08ce390af85c547be71229b53ff6ea552f57b863`.

This advances only the whole-source snapshot layer. MOPS exact-version expected-keyset completeness, noRevisionGapThroughCut, pre-parent evidence-cut readiness, symbol-session completeness and TECHNICAL_CONTINUITY all remain false. No scheduler or trading authority was added; System1/Formal Core remain unchanged. Next BUILD_LANE gate is prospective MOPS exact-version population capture and complete expected-keyset freeze.

## 2026-10-07 S2-07 V1.6 prospective MOPS exact-version boundary

PR #749 / merge `bc405245870d6e986cbbf709562ce93c320bb327` establishes globally unique, stock-code-scoped MOPS exact-version observations with canonical row-content hashes and genuine prospective observation clocks for the frozen 23-event / 23-symbol low-volume universe.

Latest-main physical run `37548011614` PASS observed 161 exact versions and covered all 23 symbols. However, comparison with earlier successful run `37547303476` (159 versions) found 9 versions newly present and 7 previously observed versions absent, while common exact-version payload hashes had zero mutations. Therefore historical query membership is not stable enough to certify a complete expected MOPS keyset from a single successful capture.

V1.6 is accepted as a prospective exact-version observation layer only. `expectedMopsKeysetComplete`, `noRevisionGapThroughCut`, pre-parent readiness, symbol-session completeness, TECHNICAL_CONTINUITY and all trading authorities remain false. Next BUILD_LANE gate is repeated-capture union/stability reconciliation with earliest-observed preservation.

