# System 2 Daily Resonance Global Integration V0.1

Updated: 2026-09-29 Asia/Taipei  
Status: PHYSICALLY DEPLOYED / BOUNDED RESONANCE SCHEDULE ACTIVE / RESEARCH_SHADOW_ONLY  
Governance: owner-authorized 00.1 global-control-room integration  
System 1 / V8 Formal Core impact: NONE

## Purpose

Connect the already-frozen Daily Resonance calculation, live-adapter, episode, chart, read-model and Fugle-normalizer modules to an isolated System 2 Worker, D1 history and read-only UI/API without changing their resonance formula or enabling trading authority.

## Runtime flow

1. The 19:00 Asia/Taipei schedule reads the latest frozen `s2_capacity_runs` receipt.
2. `active_assignments_json` is deduplicated into one bounded watch pool: max 3 symbols per strategy and max 9 unique symbols total.
3. An absent capacity receipt, an empty assignment or an over-cap pool fails closed. The runtime never fills vacancies and never scans the full market.
4. On the next eligible session, the Worker runs every five minutes only inside 08:55–13:40 Asia/Taipei.
5. Each watched symbol loads one session-cached Fugle Ticker plus adjusted finalized daily history and refreshes Fugle Intraday Quote each cycle.
6. Adjusted-history continuity is verified against the current session reference price before the daily monitor is eligible.
7. The current quote updates today's unfinished daily OHLC/volume bar; the existing EMA16, EMA64 and Impulse MACD monitor returns 0/3–3/3 state.
8. Before close, a 3/3 signal is PROVISIONAL. CONFIRMED requires both Fugle `isClose` finality and the independent at/after-13:30 Asia/Taipei clock gate.
9. Existing System 2 open simulated positions resolve the monitor's HOLD lifecycle and therefore enable its existing EXIT_RESONANCE semantics; otherwise the lifecycle is WATCH.
10. Snapshot, latest state, episode and episode-event rows are persisted to isolated System 2 D1. Repeated observations do not create repeated logical episode events.
11. Read-only API and UI expose the current daily K, EMA16, EMA64, Impulse MD/signal/histogram, BUY/EXIT markers, finality and 0/3–3/3 state.

## D1 schema V1.1

Migration `system2/sql/0007_daily_resonance_integration.sql` adds seven isolated `s2_` tables:

- `s2_resonance_watch_pools`;
- `s2_resonance_session_cache`;
- `s2_resonance_runs`;
- `s2_resonance_snapshots`;
- `s2_resonance_latest`;
- `s2_resonance_episodes`;
- `s2_resonance_episode_events`.

After physical migration, the expected isolated schema is V1.1 with 46 System 2 tables. No System 1 table or production binding is referenced.

## Worker and schedules

Worker: `system2-shadow-research`  
Binding: `SYSTEM2_DB` only for database state; `SYSTEM2_HISTORY_BUCKET` remains the separate historical research binding.  
Secret: `FUGLE_API_KEY`, stored only as a Worker/GitHub environment secret.

Schedule in UTC:

- `*/5 0-5,11 * * 1-5` is the single Cloudflare Cron trigger for this lane.
- The runtime-local filter admits only 08:55–13:40 Asia/Taipei for bounded monitoring and exactly 19:00 Asia/Taipei for the next-session pool refresh; 19:05–19:55 and other envelope invocations exit without market-data calls.
- Read-only account inventory on 2026-09-30 found four existing Cron triggers, all on System 1 `fugle-test`. None are removed or modified; the single System 2 trigger uses the fifth Free-plan slot.

General System 2 prospective selection capture remains `SYSTEM2_CAPTURE_ENABLED=false`; this authorization arms only the bounded Daily Resonance schedule.

All GitHub workflows that write the isolated System 2 D1 share one non-cancelling concurrency group, so migration/backfill/smoke/deploy jobs cannot replay versioned migrations over each other concurrently.

## Read surfaces

- `/health` — schema, capture, bounded-resonance and source-secret readiness;
- `/api/system2/resonance` — latest market-date states;
- `/api/system2/resonance?marketDate=YYYY-MM-DD` — historical date read;
- `/api/system2/resonance/pool` — active bounded pool or explicit empty state;
- `/api/system2/resonance/{symbol}` — one-symbol read;
- `/resonance` — auto-refreshing chart/status UI.

The V0.1 UI/API is the automatic reminder surface. Live push remains disabled.

## Safety boundaries

- research/shadow only;
- no real order and no capital-allocation effect;
- no notification/push effect;
- no full-market intraday scanner;
- no forced nine-stock fill;
- no final System 2 selection-policy invention;
- 15-minute K cannot alter daily resonance;
- System 1/V8 `Worker.js`, root `wrangler.toml`, A/B, Top6/3+3, Formal Core and production monitoring/push are unchanged.

## Remaining gates

- The upstream daily orchestrator must actually persist an authorized `s2_capacity_runs` receipt. Until then the runtime truthfully returns `NO_ACTIVE_PRESELECTED_POOL` and monitors nothing.
- Live notification requires a separate owner gate plus prospective evidence for repaint, whipsaw, Trend/Range, Regime, transaction cost, MFE/MAE and redundancy.
- Promotion into formal selection, simulated capital decisions or any real-money path is not authorized by this integration.
- Physical D1/Worker/Cron/API/UI status must be updated only from post-merge deployment readback evidence.

## Physical deployment verification — 2026-09-30 Asia/Taipei

Repository and deployment evidence:
- PR #278 merged as `7e51190bdf0e51d55917c091462068a90724f211` and added a read-only Cloudflare Cron inventory.
- Inventory run `36646278083` PASS: four existing Cron triggers, all on System 1 Worker `fugle-test`; no Cron mutation was performed.
- PR #279 merged as `6d6b4d5aafff55179397187fa69acefed428cd6e`.
- PR #279 System2 Research CI run `36646479007` PASS.
- PR #279 V8 Regression run `36646479081` PASS.
- Post-merge Daily Resonance deployment run `36646552183` PASS.
- Isolated D1 schema V1.1 read/write verification PASS with 46 System 2 tables.
- Cloudflare deployed exactly one System 2 Cron trigger: `*/5 0-5,11 * * 1-5`.
- Worker secret `FUGLE_API_KEY` upload PASS.
- Runtime readback PASS at `https://system2-shadow-research.imihan0630.workers.dev`.
- `/health` reports `schemaVersion=1.1`, `resonanceState=BOUNDED_RESONANCE_SCHEDULED`, `captureState=CAPTURE_DISABLED`, `fugleQuoteConfigured=true`, `resonanceMaxUniqueSymbols=9`, `resonanceFullMarketScan=false`, and `system1RuntimeUsed=false`.
- `/api/system2/resonance`, `/api/system2/resonance/pool`, and `/resonance` are publicly readable.
- Immediate readback before the next 19:00 pool-refresh window returned `NO_ACTIVE_PRESELECTED_POOL` for 2026-09-30. This is the required fail-closed state and does not fabricate a watchlist.
- Deployment verification confirms System 1 production files remained unchanged.

The bounded Daily Resonance runtime is therefore physically armed for schedule-driven research/shadow monitoring. Live push, real orders, final strategy-selection authority, and general System 2 prospective selection capture remain disabled.

## V0.1.1 prospective pool-freshness and operations guard — 2026-10-02

Status: physically deployed and readback verified; upstream daily frozen capacity is absent.

- The 19:00 refresh now accepts **only** a same-market-date `s2_capacity_runs` record whose decision and capture timestamps are not later than that scheduled 19:00 clock. A stale or future-known receipt cannot silently seed a watch pool.
- Each scheduled 19:00 outcome is recorded idempotently in existing isolated `s2_resonance_runs`: `POOL_REFRESH_ACTIVE`, `POOL_REFRESH_ZERO_PICK_ACTIVE`, or `POOL_REFRESH_NO_CAPACITY_RECEIPT`. No extra Cron, D1 migration or external credentials are needed.
- Intraday pool lookup is anchored to the most recent preceding **durably recorded refresh**. If that refresh had no capacity receipt, older pools are invalidated; absent audit evidence fails closed.
- `/api/system2/resonance/operations` exposes latest upstream capacity metadata, most recent pool, last 19:00 refresh audit, last successful or blocked intraday cycle, and an explicit empty-pool readiness state. It does not expose API keys, trigger orders, send push, or scan the full market.
- The read-only UI shows the upstream/refresh diagnostic when monitoring remains empty. The existing 9-symbol bounded cap, existing resonance mathematics, System 1 Formal Core and all four System 1 Cron triggers remain unchanged.
- This is operational data-integrity/readability work, **not** authorization to invent a final selection policy, enable general Shadow capture, or create a populated capacity receipt without strategy evidence.

## V0.1.1 physical deployment and missing-upstream proof — 2026-10-02

- PR #295 merged to main commit `03b9dd824d1efa85eee86b04ee68171563e9e523`.
- Final-head System2 Research CI `36930742222`: PASS; V8 Regression `36930742371`: PASS.
- Main deployment `36930843423`: PASS. D1 V1.1/46 tables, the existing one System 2 Cron and `FUGLE_API_KEY` binding verified; unchanged System 1 production files PASS.
- Physical `/health` confirms `schemaVersion=1.1`, `fugleQuoteConfigured=true`, bounded resonance armed, general capture disabled, and no System 1 runtime usage.
- New physical `/api/system2/resonance/operations` confirms `state=UPSTREAM_CAPACITY_RECEIPT_MISSING`, `upstreamCapacity=null`, `latestPool=null`, and `activeSymbolCount=0` at the 2026-10-02 early-morning readback. This is positive evidence of missing upstream capacity data, not a UI or Fugle secret defect.
- A 19:00 refresh is now durably audited even when there is no capacity receipt; no such **new-format** refresh audit has yet been observed at this readback, so the first real post-deployment 19:00 outcome still requires observation.
- Next global-control-room engineering unit: integrate a PIT-qualified, preregistered daily System 2 Shadow source/orchestration pipeline that can produce immutable strategy ordering and `s2_capacity_runs` receipts without inventing score weights or activating final selection. Existing decision-clock/capture owner gates remain intact.
