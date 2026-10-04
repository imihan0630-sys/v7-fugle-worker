# System 2 Remediation Checkpoint

Updated: 2026-10-05 02:07 Asia/Taipei
Status: ACTIVE / REMEDIATION_LANE / FIX_IN_PROGRESS
Room: System 2｜補強修復室
Governance: `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

## Mission

Serve as System 2's focused remediation/SWAT lane for cross-module, recurrent, orphaned, false-completion and explicitly routed remediation work. This room is not a generic bug inbox.

## Active correction

`S2-CORR-20261004-004` — Whole-universe history/continuity gate can block all Shadow evaluation because of symbol-local UNKNOWNs.

Routing:
- severity: `HIGH`
- status: `FIX_IN_PROGRESS`
- routingClass: `REMEDIATION_LANE`
- assignedLane: `REMEDIATION_LANE`
- assignedRoom: `System 2｜補強修復室`
- modificationOwner: `SYSTEM2_REMEDIATION_ROOM`
- blockedBy: none

Other corrections:
- `S2-CORR-20261004-001` remains `DATA_LANE` ownership and is not touched.
- `S2-CORR-20261004-002` and `S2-CORR-20261004-003` are independently `VERIFIED_CLOSED` and are not reopened.

## Canonical problem statement

The current S2-07 upstream gate collapses symbol-local missingness into a whole-universe failure:

1. `daily_shadow_history_reader_v0_1.mjs` reports READY only when every current-universe symbol is history-ready and continuity-ready.
2. `daily_shadow_input_preflight_v0_1.mjs` then requires whole-universe history state READY before any authorized strategy evaluation/capacity path can continue.
3. One new listing, one symbol-local history gap, one local continuity/provenance UNKNOWN, or one symbol-local required-evidence gap can therefore starve otherwise clean symbols.
4. Downstream semantics already support symbol-local `INCOMPLETE / BLOCKED` without converting UNKNOWN into negative evidence.

## Required correction boundary

Separate **global observation integrity** from **symbol-local evaluation readiness**.

Global fail-closed remains mandatory for whole-universe/source/clock defects such as:
- wrong source date / decision clock;
- market-wide source corruption;
- whole-batch provenance failure;
- source-wide revision ambiguity;
- missing mandatory market-wide source identity.

Symbol-local missingness must remain local:
- insufficient history / new listing;
- continuity not verified;
- symbol-local PIT/provenance gap;
- symbol-local REQUIRED evidence UNKNOWN.

Ready symbols may continue through authorized Shadow evaluation / Frozen Decision / Ranking / Capacity.
Incomplete symbols must remain explicitly accounted, `INCOMPLETE / BLOCKED`, never BUY_ELIGIBLE / ACTIVE_ENTRY_MONITOR / capacity-admitted.

No arbitrary whole-market coverage threshold may be introduced.

## Zero-pick boundary

Partial denominator coverage must never be promoted to a clean zero-pick truth.

The corrected path must distinguish a fully-accounted clean no-selection result from a partial-coverage no-selection state such as `PARTIAL_COVERAGE_NO_SELECTION` (or equivalent fail-safe semantics).

## Protected boundaries

Do not change:
- System 1 Formal Core or runtime;
- System 2 live/final-selection authority;
- production push/runtime;
- capital/order behavior;
- strategy weights;
- formal entry/exit thresholds;
- assessor policy itself;
- PIT/UNKNOWN semantics.

## Active conflict units

Initial owned conflict units:
- `system2/runtime/daily_shadow_history_reader_v0_1.mjs`
- `system2/runtime/daily_shadow_input_preflight_v0_1.mjs`
- downstream accounting/capacity glue only where required to distinguish partial denominator vs clean zero-pick;
- associated System 2 tests;
- correction queue MD/JSON;
- this remediation checkpoint;
- canonical docs only if runtime semantics require corresponding truth updates.

## Tests / evidence required

Pending:
- mixed-universe test: A ready; B insufficient history; C continuity UNKNOWN; D required evidence UNKNOWN;
- A continues through evaluation while B/C/D remain INCOMPLETE/BLOCKED;
- all current-universe symbols denominator-accounted;
- INCOMPLETE never becomes BUY_ELIGIBLE / ACTIVE_ENTRY_MONITOR / capacity admission;
- partial denominator no-selection is not CLEAN zero-pick;
- source-wide/global corruption still blocks globally;
- PIT/availableAt/firstKnownAt/revision/continuity/provenance UNKNOWN semantics preserved;
- System2 Research CI;
- V8 Regression;
- latest-main drift/readback.

## Exact next continuation point

1. Read the exact history-reader/preflight/capacity contracts and existing tests.
2. Implement the minimum state-shape change that separates global blockers from per-symbol readiness without inventing coverage thresholds.
3. Add mixed-universe and global-corruption regression coverage.
4. Run targeted tests, then full System2 Research CI and V8 Regression.
5. Re-read latest main and reconcile shared Queue/checkpoint drift without overwriting DATA_LANE/AUDIT_LANE work.
6. Update CORR-004 to `FIX_IMPLEMENTED` with durable evidence only after all checks pass.
7. Merge and hand back to AUDIT_LANE; do not self-mark `VERIFIED_CLOSED`.
