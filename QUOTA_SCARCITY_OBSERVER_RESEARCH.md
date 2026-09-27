# Post-grade 3+3 Quota Scarcity Observer

Updated: 2026-09-27 Asia/Taipei  
Status: CLASS-A OBSERVER / OUTCOMES CLOSED  
Formal Core: LOCKED

This does not redesign PVE-156 or change 3+3. It converts the already-frozen B-217 semantics into a fail-closed pure computation over a **complete same-scan** decision-state population.

For each GENERAL / THOUSAND pool it reports qualifiedCount, selectedCount, unused slots, GATE_LIMITED / EXACTLY_FILLED / QUOTA_BINDING, complete rank4+ qualified rows, rank-3 cutline selected and rank-4 cutline next.

A new negative-control invariant is explicit: on a complete parent, selected symbols must equal deployed ranks 1..min(3, qualifiedCount). Any mismatch is `INVARIANT_VIOLATION`, not quota opportunity.

Cross-pool stranding requires one pool underfilled (<3 qualified) and the other quota-binding (>3 qualified). Merely seeing asymmetric selected counts is insufficient.

Legacy bounded QNS and historical mutable Shadow can never assert `completeSameScanPopulation=true`. Historical prevalence therefore remains UNKNOWN until PVE-156-style immutable full-pool receipts exist.

No outcome data and no Formal changes.
