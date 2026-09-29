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
