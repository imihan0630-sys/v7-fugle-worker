# System1 Opportunity-Loss Bridge V0.2 — 2026-10-07

Status: CLASS-A RESEARCH-ONLY / DENOMINATOR REPAIR / FORMAL CORE LOCKED

V0.2 fixes the maxChase denominator ambiguity identified after the selected-to-BUY cause classifier was completed.

## Correct denominator

One symbol/plan may encounter both:
- MAX_CHASE_15M_BLOCK_B;
- MAX_CHASE_QUOTE_BLOCK;

and may encounter either cause repeatedly across monitor runs.

Therefore these are three different quantities:

1. unique symbols/plans affected;
2. cause-layer memberships;
3. block events.

They must never be substituted for one another.

H5 structuralN now uses **unique symbol count**.
Layer memberships and repeated event counts are reported separately.

Duplicate complete cause rows for the same symbol + planIdentity are rejected rather than added.

No strategy threshold, A/B rule, maxChase value, retest rule, ranking, capital, signal, push, order or System2 behavior changes.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
