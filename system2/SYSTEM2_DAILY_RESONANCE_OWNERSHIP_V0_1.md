# System 2 Daily Resonance Room Ownership V0.1

Updated: 2026-09-29 Asia/Taipei  
Status: ACTIVE GOVERNANCE / ROOM-SCOPED  
Owner chatroom: Daily Resonance / bounded intraday monitor workstream  
Global control room: `00.1｜System2 建置總控室`

## Purpose

Prevent parallel System 2 chatrooms from independently changing shared architecture, storage, deployment or canonical progress files in conflicting directions.

This room is a **specialist workstream**, not the global System 2 engineering controller.

## Global single-writer rule

The following are owned and coordinated only by `00.1｜System2 建置總控室`:

- `system2/SYSTEM2_MASTER.md`
- `system2/SYSTEM2_CHECKPOINT.md`
- `system2/SYSTEM2_MVP_SHADOW_STATUS_V0_1.md`
- all System 2 D1 schema / migration ownership and migration ordering
- System 2 Worker deployment configuration and deployment behavior
- System 2 Worker Cron / scheduled capture activation
- global System 2 orchestrator wiring
- global candidate/final-selection policy activation
- global P0/P1 engineering sequencing

Specialist rooms must not directly redefine or overwrite those global responsibilities.

## What this room may change

This room may implement and maintain only its own scoped artifacts, including:

- `system2/SYSTEM2_DAILY_RESONANCE_*.md`
- `system2/SYSTEM2_FUGLE_RESONANCE_*.md`
- resonance-specific files under `system2/runtime/`
- resonance-specific files under `system2/tests/`
- isolated research-only source contracts and read models owned by this workstream

Any new file must preserve the existing System 2 safety boundary and must not silently alter global architecture.

## What this room must not do

Without explicit routing back through the global control room, this room must not:

- add or reorder D1 migrations;
- create or change shared System 2 tables;
- arm Worker Cron;
- change Worker deployment bindings or production behavior;
- change System 2 global candidate-pool capacity;
- activate final selection;
- change strategy-wide weights, thresholds or capital rules;
- change the global P0/P1 continuation point;
- rewrite canonical master/checkpoint status;
- merge a stale branch that is behind current `main` without rebasing/recreating from latest `main`.

## Handoff rule

When this room completes a meaningful specialist unit:

1. write the scoped design/runtime/tests in this room's own files;
2. validate against current `main`;
3. require System2 Research CI and V8 Regression where applicable;
4. merge only the scoped specialist change;
5. report the merged commit/PR and exact integration dependency;
6. `00.1｜System2 建置總控室` decides when/how to register the result into:
   - `SYSTEM2_MASTER.md`;
   - `SYSTEM2_CHECKPOINT.md`;
   - `SYSTEM2_MVP_SHADOW_STATUS_V0_1.md`;
   - D1 schema/migrations;
   - Worker deployment/orchestration.

This prevents two rooms from independently claiming different global next steps.

## Current resonance boundary

Current specialist ownership includes:

- daily-K EMA16 / EMA64 trend state;
- Impulse MACD research implementation;
- 1/3 → 2/3 → 3/3 resonance progression;
- PROVISIONAL vs CONFIRMED daily-bar semantics;
- bounded monitoring of preselected symbols only;
- resonance episode/dedup state;
- chart/read model;
- Fugle Quote/Ticker normalization semantics;
- 15-minute K as execution/timing context only.

Current room does **not** own:

- D1 persistence integration;
- live Worker fetch loop;
- scheduled capture;
- notification authority;
- global final-selection policy;
- order routing.

Those require global-control-room integration.

## Conflict resolution

GitHub `main` is authoritative.

If a specialist branch and `main` diverge:
- do not merge the stale branch directly;
- recreate/rebase the intended scoped change from latest `main`;
- preserve newer global changes;
- if the change touches global-control-room-owned surfaces, stop specialist implementation and hand the dependency back to `00.1｜System2 建置總控室`.

## System 1 boundary

System 1 / V8 Formal Core remains LOCKED.

Nothing in this room authorizes changes to:
- A/B formal definitions;
- Top6 / 3+3 structure;
- capital allocation;
- BUY / ADD / REDUCE / SELL / STOP;
- formal 15-minute confirmation semantics;
- production monitoring/push;
- Cloudflare production runtime.

