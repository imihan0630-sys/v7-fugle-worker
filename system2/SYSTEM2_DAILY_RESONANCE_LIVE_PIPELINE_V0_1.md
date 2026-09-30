# System 2 Daily Resonance Live Pipeline V0.1

Updated: 2026-09-29 Asia/Taipei  
Status: IMPLEMENTATION / RESEARCH-SHADOW ONLY / NOT ARMED  
Governance: Class A isolated research-only  
System 1 / V8 Formal Core impact: NONE

## Purpose

Continue the bounded daily-K resonance monitor from calculation-only V0.1 into a safe repository-side intraday pipeline foundation without arming capture, push, Cron or orders.

The implemented chain is:

preselected bounded symbols (max 9)
→ normalized already-fetched quote snapshot
→ current-date daily OHLC bar adapter
→ daily EMA16 / EMA64 / Impulse MACD monitor
→ provisional / confirmed resonance snapshot
→ replayable resonance episode state
→ read-only UI/API view model.

This is not a full-market intraday scanner.

## 1. Live daily-bar adapter

File:
- `system2/runtime/daily_resonance_live_adapter_v0_1.mjs`

The adapter performs **no network request**. It consumes a normalized quote snapshot supplied by a future authorized market-data layer.

Required semantic contract:

`VERIFIED_SESSION_OHLC_CUMULATIVE_VOLUME_V0_1`

The input must explicitly carry:
- market date;
- observation time;
- optional provider timestamp;
- optional last-trade timestamp;
- session open / high / low / last price;
- cumulative volume in shares;
- source finality LIVE / FINAL;
- trial / halt / suspension flags;
- independent price-continuity state.

The adapter does not infer source semantics merely from field names.

### Confirmation firewall

A current daily bar can become `FINAL` only when all are true:
1. the normalized source says `sourceFinality=FINAL`;
2. `officialSessionCloseConfirmed=true`;
3. the observation is at/after the official 13:30 Asia/Taipei close;
4. no semantic, trial, halt, suspension or continuity blocker exists.

A source FINAL flag before the official close remains provisional.

A missing/no-trade current-date bar never reuses the prior day as today's state.

## 2. Resonance episode / dedup state

File:
- `system2/runtime/daily_resonance_episode_v0_1.mjs`

Purpose:
- preserve the sequence 1/3 → 2/3 → 3/3 without creating repeated logical episodes;
- distinguish provisional from confirmed resonance;
- allow a provisional 3/3 state to retract before close;
- allow confirmed state to release later;
- make opposite ENTRY/EXIT resonance a new episode;
- preserve deterministic sequence numbers.

Episode states:
- PROVISIONAL_ACTIVE
- CONFIRMED_ACTIVE
- RETRACTED
- RELEASED

Episode events:
- OPEN_PROVISIONAL
- OPEN_CONFIRMED
- CONFIRM
- RETRACT
- RELEASE

This V0.1 state machine explicitly sets:
- `shouldNotify=false`;
- `notificationImpact=false`;
- `orderImpact=false`.

It is a replay/dedup contract, not live push authorization.

## 3. Read-only UI/API model

File:
- `system2/runtime/daily_resonance_read_model_v0_1.mjs`

The read model combines:
- live-adapter quality state;
- daily resonance snapshot;
- episode state;
- existing chart model with K candles, EMA16, EMA64, Impulse MACD and resonance markers.

It is a pure object builder. No HTTP route is exposed in this implementation.

The future page/API can consume this model without changing signal semantics.

## 4. Bounded capacity

All live-adapter paths remain bounded to at most 9 unique symbols, matching the owner-requested 3+3+3 intraday monitor.

This does not change the separate System 2 global candidate/watch capacity of 12.

No weak symbol is added to fill nine slots.

## 5. 15-minute role

15-minute K remains execution/timing context only.

It can later help with:
- execution timing;
- extension/chase avoidance;
- slippage context;
- display of intraday execution points.

It cannot rewrite the daily EMA16/EMA64/Impulse-MACD resonance state.

## 6. Safety boundaries

Frozen V0.1 invariants:
- no full-market intraday discovery;
- no Fugle/other market-data network call inside these modules;
- no D1 persistence;
- no Worker Cron;
- no live push;
- no real order;
- no System 1/V8 runtime import;
- no Formal Core change;
- no strategy-weight or final-selection change.

All outputs remain research/shadow only.

## 7. Tests

Repository tests:
- `daily_resonance_live_adapter_v0_1.test.mjs`
- `daily_resonance_episode_v0_1.test.mjs`
- `daily_resonance_read_model_v0_1.test.mjs`

The existing System2 Research CI automatically includes these files.

Required PR verification:
- System2 Research CI PASS;
- V8 Regression PASS.

## 8. Next safe integration unit

After this repository-side foundation is verified, the next safe Class-A work is:
1. an isolated source-specific quote normalizer with exact source field/unit/timestamp semantics;
2. research-only D1 persistence for episode/read snapshots, using additive `s2_` tables;
3. a read-only System 2 route/page consuming the frozen read model;
4. prospective bounded Shadow collection.

Enabling an always-on Worker Cron or live notification remains a separate owner gate.
