# System 2 — Institutional Terminal Information Architecture V0.1

Updated: 2026-10-06 Asia/Taipei  
Status: IMPLEMENTED SHELL / READ-ONLY DATA BINDING  
Lane: BUILD_LANE  
Formal Core impact: NONE  
Trading authority: NONE

## Purpose

Implement the full first-pass System 2 operating surface before every downstream data family is ready, without inventing data or presenting target behavior as current capability.

The shell is intentionally stable enough that S2-07, performance, event, position and market-Regime modules can connect into existing surfaces rather than repeatedly redesigning the interface.

## Routes

- `/` — institutional terminal home.
- `/terminal` — same institutional terminal.
- `/resonance` — preserved dedicated resonance page.

Existing read APIs remain unchanged:
- `/health`
- `/api/system2/resonance`
- `/api/system2/resonance/pool`
- `/api/system2/resonance/operations`
- `/api/system2/shadow/diagnostic`

## Primary navigation

1. Market Command Center（市場總控）
2. Candidate Board（候選股）
3. Decision Workspace（決策工作台）
4. Virtual Positions（虛擬部位）
5. Resonance Center（共振中心）
6. Strategy Center（策略中心）
7. Performance Center（績效中心）
8. Event / Industry（事件 / 產業）
9. Evidence / System（證據 / 系統）

## Truthful-data rule

The UI uses three states:

- **LIVE / READY** — backed by an already verified read API or physically verified runtime.
- **SHADOW / DIAGNOSTIC** — research-only or monitoring data with no trading authority.
- **LOCKED / PENDING** — the surface exists, but the required source/API/promotion gate is not ready.

The interface must never populate a pending surface with synthetic values simply to make the page look complete.

## Current live bindings

The first shell directly binds:
- isolated System 2 health;
- bounded resonance payload;
- active bounded pool;
- resonance operations audit;
- daily Shadow diagnostic.

Candidate and decision surfaces may reuse rows from the currently verifiable bounded resonance/pool data only as monitored rows. They must not relabel diagnostic records as formally selected candidates.

## Deliberately locked surfaces

### Market Regime

The visual surface exists, but TAIEX/TPEx breadth, turnover, cross-market, sector rotation and regime state remain UNKNOWN until a validated read API exists.

### Actual holdings

Authorized source:
- `ACTUAL_HOLDINGS_SOURCE_AUTHORIZED=USER_UPLOADED_BROKER_SCREENSHOT`;
- `CHAT_ASSISTED_HOLDINGS_IMPORT_READY=CODE_TESTED_PENDING_REAL_OWNER_SNAPSHOT`;
- `ACTUAL_POSITION_MONITOR_VERIFIED=false` until a real Owner screenshot completes confirmation + persistence/readback.

The Actual Holdings panel is separate from Virtual Positions, Candidates, Watchlist and Simulated Fills. Signals, suggested shares, plans, candidates, simulated fills and virtual positions cannot be shown as actual holdings.

Current display before the first real import:
- Source: USER_UPLOADED_BROKER_SCREENSHOT;
- Last verified: NO VERIFIED SNAPSHOT;
- broker API: NOT AUTHORIZED;
- real orders: DISABLED.

### Performance

Performance cards and charts remain blank until trustworthy strategy/version prospective cohorts and outcome population exist.

### Event / industry

Timeline and cycle-stage surfaces exist, but no fake event score, firstKnownAt or beneficiary/victim mapping is emitted before a PIT-safe read contract exists.

## Visual behavior

- dark graphite / navy institutional base;
- restrained gold emphasis;
- Taiwan convention: red = up / gain / entry-side emphasis, green = down / loss / exit-side emphasis;
- blue/cyan = information/system state;
- amber = warning/pending;
- responsive desktop-first layout with a compact mobile command bar.

## Safety boundary

This implementation:
- does not modify System 1;
- does not alter any strategy score or assessor;
- does not create or modify `s2_capacity_runs`;
- does not create real or simulated orders;
- does not promote any strategy;
- does not enable push;
- does not change the existing resonance formula;
- does not authorize final selection or capital.

## Next UI wiring sequence

1. S2-07 frozen daily candidate/read API -> Candidate Board + Decision Card.
2. market Regime/breadth/sector read API -> Command Center.
3. virtual positions read API -> Virtual Positions.
4. frozen decision/history read API -> Decision Workspace evidence tabs.
5. performance/outcome read API -> Performance Center.
6. event/industry PIT-safe read API -> Event / Industry.
7. mobile usability and latency/readability acceptance.
