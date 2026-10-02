# System 1 C3 live-data readiness / Class-B capture proposal — 2026-10-03

Status: REVIEW READY / NOT IMPLEMENTED / FORMAL CORE LOCKED
Parent: PR #321 (Class-A isolated C3/C4/C5 Shadow)
Scope: research data capture only. No selection, monitoring, signal, push, order, capital or System2 authority.

## Source audit

### Existing V8.8 execution recorder
Production build contains `trade_research_execution_snapshots` and
`/api/research/execution-recorder`.

Its fixed event cadence is sparse:
- OPEN_BASELINE
- FIRST_10M_COMPLETE
- FIRST_15M_COMPLETE
- FIRST_30M_COMPLETE
- FORMAL_SIGNAL_OBSERVED

The recorder stores the current frame10/frame15 latest bar at those event
times. It does not preserve every completed 15-minute bar for the full session.
The original V8.8.0 payload also declares openingGap/sessionVwap/spread/depth
fields UNKNOWN/null; later execution research may enrich coarse fields, but the
event cadence remains sparse. Therefore this table cannot be interpreted as a
complete no-retest path.

### Existing V8.11 PV Shadow
Production also contains immutable `v7_pv_shadow_snapshots` with
`INTRADAY_15M` snapshots and completed-session 15-minute bar extraction.
This is materially closer to C3 needs.

However, the PV monitor hook consumes the same intraday `results` as Formal
monitoring. Repository health tests explicitly assert that live result symbols
equal configured plan/monitoring symbols. Therefore PV Shadow captures
continuous 15-minute evidence only for existing Formal monitoring targets; it
does not provide the C2 Shadow-only denominator.

Reusing only Formal-selected PV rows would create selected-cohort bias and
would make the key question — opportunities rejected by Formal but admitted by
C2 — untestable.

### C1/C2
The paired collector can provide one immutable same-session full-population C1
generation and a C2 paired ledger. C5 can run directly from these artifacts.
C3 cannot, because C1/C2 do not contain next-session continuous intraday bars.
C4 can reproduce the Formal allocator on verified Formal plans, but Shadow
allocation comparison needs a frozen Shadow candidate set plus verified
entry/stop geometry.

## Minimal Class-B capture candidate: C3_RESEARCH_CAPTURE_V0_1

Purpose: collect next-session 15-minute bars for a bounded C2 research cohort
without adding those symbols to Formal monitoring.

### Allowed cohort
Only symbols from one cryptographically verified C1 generation whose matching
C2 row has:
- same generation/session;
- SHORT gate status PASS, or a separately labelled CONDITIONAL row if the only
  blockers are explicitly missing safety receipts;
- no Formal authority implied.

The capture cohort is frozen before the next session and expires after one
session. It is NOT a watchlist, selected list or trading target.

### Hard separation
The research cohort must never be inserted into:
- configured Formal plans;
- /api/live target set;
- evaluateOperationSignals;
- processSignalState;
- push/outbox;
- capital allocation;
- FIRST/ADD/REDUCE/SELL lifecycle;
- Hybrid formal/third-pool quotas;
- System2.

A distinct research-only collector reads quotes/candles for the bounded cohort
and writes only immutable research rows.

### Proposed stored receipt
For each completed 15-minute bar:
- generationId / parent C1 digest / C2 fingerprint;
- marketDate / symbol / barStart / barEnd;
- OHLCV;
- source timestamp / fetchedAt;
- completedBar=true;
- source freshness;
- prior-day frozen support/breakout/stop/target geometry where independently
  verified;
- volumeRatio only if its denominator is PIT and reproducible;
- depth/spread only if actually sourced and timestamped; otherwise UNKNOWN.

Never synthesize zero for unavailable depth/spread/volume denominator.

### Bounded resource controls
- only one-session retention cohort per verified generation;
- explicit max cohort size before activation;
- one fetch cadence aligned to completed 15m boundaries, not every minute;
- no duplicated calls for symbols already present in Formal monitoring;
- fail closed on unknown source/session/generation;
- API-call and latency receipt per run;
- no retries that can create duplicate business actions (there are no business
  actions in this collector).

A concrete max cohort size and call budget must be measured against current
provider quotas before activation; do not invent the number here.

## Why Class B

Although research-only, this adds scheduled/provider reads and persistent
shared research capture. It can change runtime/API usage and therefore is not
pure Class A. It requires owner approval before merge/deploy.

It is not Class C because no Formal decision, candidate ranking, capital,
entry/exit state, signal or push authority changes.

## What can proceed without this approval

1. Keep PR #321 isolated/draft.
2. C5 logic and same-generation overfilter reporting are complete.
3. C4 allocator comparators are complete offline.
4. C3 simulator contract and conservative fill/stop-first semantics are
   complete offline.
5. Audit provider-call budget and existing PV snapshot overlap.
6. Prepare exact tests for:
   - research cohort never enters Formal target list;
   - existing Formal target set bit-for-bit unchanged;
   - already-monitored symbol de-duplication;
   - immutable generation linkage;
   - expiry after one session;
   - no signal/push/order methods reachable;
   - missing bars remain UNKNOWN;
   - provider-call ceiling and fail-open research behavior.

## Activation acceptance after owner approval

A first real session is accepted only if:
- complete verified C1/C2 exists;
- capture cohort is generation-linked and frozen before session;
- Formal monitoring targets are identical pre/post;
- research-only bars cover expected completed 15m slots or explicitly enumerate
  missing slots;
- no push/order/signal/capital mutation occurs;
- next-bar fill simulator consumes only completed bars;
- C3 outputs preserve UNKNOWN when Formal baseline receipt or a required
  research bar is absent.

No C3 economic conclusion is permitted from candidate-count lift alone.

Rollback: disable/remove the research collector and retain immutable evidence.
Formal runtime plans/signals remain untouched.
