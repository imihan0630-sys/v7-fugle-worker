# D01 DL-096 — Cross-Witness Non-Equivalence Firewall V0.1

Updated: 2026-10-07 Asia/Taipei
Status: OUTCOME_BLIND / CROSS_WITNESS_FIREWALL_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent accidental cross-credit between two different 1101/TWSE witnesses:

A. D01 historical composability witness
- symbol: 1101
- targetDate: 2021-06-15
- purpose: R1-R7 historical pre-outcome interface composability
- exact window: 60 prior eligible symbol-sessions + target date
- outcome join: CLOSED

B. System2 NC-T01 current physical witness
- symbol: 1101
- marketDate: 2026-10-07
- purpose: Stage-1 physical strategy-path independence / continuity certification
- current state: exact-session history ready, continuity unverified
- real CLEAR_NO_ACTION receipt not yet observed

Same symbol does not make these witnesses interchangeable.

## Non-equivalence dimensions

Receipts are non-fungible when any of the following differ:
- target/asOf date;
- decision/interface cutoff;
- exact ordered eligible-session date set;
- expectedSessionHash;
- observedSessionHash;
- replayHash;
- sourceHistoryHash;
- raw-history admission receipt;
- source-generation version;
- corporate-action source window;
- suspension query window;
- price-limit rule/reference state;
- disposition/matching regime;
- firstObservableAt/knownAt basis.

Therefore:
SYSTEM2_2026_WITNESS_PASS != D01_2021_WITNESS_PASS.

A later real System2 CLEAR_NO_ACTION receipt for 1101/2026-10-07 may prove the shared machinery can work, but it cannot fill D01 R1-R6 for 2021-06-15.

## Latest-main readback

Latest main after DL-095 contains:
- a real System2 1101/TWSE exact-session history-ready witness on 2026-10-07;
- no real CLEAR_NO_ACTION receipt yet;
- fixture-only CLEAR_NO_ACTION_ELIGIBLE examples;
- a durable replay-identity export gap for the physical 2026 witness;
- a frozen bounded TWTAWU negative-completeness handoff for suspension/resumption.

The new TWTAWU contract materially strengthens the shared owner path:
- exact replay-window interval;
- raw-body/source digest;
- bounded completeness proof;
- explicit NO_SUSPENSION_IN_COMPLETE_BOUNDED_WINDOW state;
- no inference of absence from HTTP 200 or empty data.

D01 adopts this semantic requirement for its 2021 witness but does not self-implement the System2 producer.

## Cross-credit rules

Allowed:
- reuse common schema semantics;
- reuse exact-session hashing conventions;
- reuse continuity identity fields;
- reuse bounded negative-completeness semantics;
- reuse owner-certified source/parser versions.

Prohibited:
- copy 2026 session hashes into 2021;
- copy 2026 continuity receipt into 2021;
- infer 2021 no-suspension from 2026 no-suspension;
- infer 2021 normal matching from current normal matching;
- use same-symbol identity as evidence of same event state;
- use a System2 physical PASS as a substitute for D01 historical R1-R6.

## Current decision

SHARED_MACHINERY_REUSE = ALLOWED.
CROSS_WITNESS_RECEIPT_REUSE = PROHIBITED.
D01_2021_R1_R6 = STILL_PENDING.
SYSTEM2_2026_REAL_CLEAR_NO_ACTION = NOT_YET_OBSERVED.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.

## Exact next continuation

Freeze the D01-owned R7 observability admission schema now, while keeping actual R7 emission blocked until the exact 2021 R1-R6 bundle passes.
