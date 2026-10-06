# D01 DL-047 — D16 Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOMES_CLOSED

D16 future validation must keep four contexts separate:
- D01 structural geometry;
- D02 VWAP-style transaction-weighted reference;
- D02 price-by-volume distribution;
- D05 fresh displayed order-book state.

Required ladder:
L0 structural baseline;
L1 add session/exact VWAP;
L2 add anchored VWAP;
L3 add volume profile;
L4 add fresh book context;
L5 de-duplicate and test residual contribution on common support.

Anchored VWAP must preserve anchor lineage and anchor-known clock.
A D01-event anchor is dependent on the D01 price event by default.

Trade-flow data and book snapshots must be available no later than predictor freeze.
Stale, late, incomplete and synthetic states remain non-evaluable.

VWAP is an observable transaction-weighted reference, not an ownership-inventory ledger.

D02 owns VWAP/profile semantics.
D05 owns live-book semantics.
Missing owner evidence must not be synthetically reconstructed.

SDA-001 and SDA-002 remain REMEDIATION_IN_PROGRESS.
Formal Core remains LOCKED.
