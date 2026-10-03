# D02 Daily Volume Continuity Adapter Validation V0.1

Updated: 2026-10-04 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / EXECUTABLE_REPLAY_PASS
Formal Core: LOCKED / unchanged
Evidence cursor: PVE-239

## Executable artifacts

- research/d02_daily_volume_continuity_adapter_v0_1.mjs
- tests/test_d02_daily_volume_continuity_adapter_v0_1.mjs

Independent local Node execution:
- runtime: Node.js v22.16.0
- final result: PASS
- fixture count: 14

This is research-only executable validation. It is not Production wiring and it does not create prospective Shadow evidence.

## Important test-discovered correction

The first executable run failed F03.

Initial defect:
a late-known corporate-action correction was correctly tagged as late-known, but the adapter then also used that future-known event to classify the historical UNIT_SCALE path.

That would have contaminated decision-time state with future information.

Fix:
- when corporate-action event information was not known by featureKnownAt, the event semantics are not applied to the historical decision;
- the historical state fails closed as CORPORATE_ACTION_LATE_KNOWN_AT_DECISION / UNKNOWN_BLOCKED;
- no future-known unit/supply event may retrospectively transform the decision-time state.

After this anti-look-ahead correction, all 14 fixtures PASS.

## Fixture matrix

F01 clean complete owner receipts -> PASS.

F02 missing corporate-action coverage -> UNKNOWN_BLOCKED.

F03 late-known corporate-action correction -> UNKNOWN_BLOCKED; future event semantics not applied.

F04 3593-like UNIT_SCALE factor 0.6 crossing without verified bridge/reset-clean window -> DATA_BLOCKED.

F05 8422-like UNIT_SCALE factor 10 crossing -> DATA_BLOCKED even if a downstream threshold might not flip.

F06 8454-like SUPPLY_CHANGE:
- RAW_ACTIVITY -> PASS;
- COMPARABLE_PARTICIPATION with mixed unnormalized pre/post-supply window -> UNKNOWN_BLOCKED.

F07 5314-like verified suspension pseudo-bar present in provider rows -> DATA_BLOCKED.

F08 factual zero-volume expected session -> retained as a real member of the exact denominator; PASS.

F09 missing expected session -> DATA_BLOCKED; older-row substitution forbidden.

F10 duplicate source date -> DATA_BLOCKED.

F11 comparable-session hash -> deterministic to input order / duplicate list entries.

F12 signedVolumeBalance algebra oracle -> PASS.

F13 two legal same-type/same-scale confirmed pivots + clean price/volume continuity -> pivot volume eligible.

F14 legal pivots + blocked volume path -> D02-09 stays blocked; pivot legality cannot rescue invalid volume continuity.

## D02-07 consequence

The bounded OBV-family comparator signedVolumeBalance is now executable under:
- explicit SHARES volume unit;
- exact expected symbol sessions;
- fail-closed missing/duplicate/pseudo-bar semantics;
- decision-time corporate-action knownAt firewall;
- UNIT_SCALE and SUPPLY_CHANGE separation.

This closes the L3 data-feasibility blocker.

It does NOT prove independent alpha.
D02-07 remains a merge candidate / comparator-only family pending residual incremental-value evidence.

Decision:
D02-07 L2/40 -> L3/60.

## D02-09 consequence

The divergence price side already has repaint-safe confirmed-pivot ownership from D03/Pattern.
The executable adapter now makes the volume-path side causally replayable and blocks invalid paths.

This closes the explicit D02-09 L3 blocker:
daily-volume unit/corporate-action/session continuity is now research-replayable without Production wiring.

Decision:
D02-09 L2/40 -> L3/60.

Still not L4:
- no clean prospective outcome cohort;
- no incremental divergence evidence;
- Gate 7 remains CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
