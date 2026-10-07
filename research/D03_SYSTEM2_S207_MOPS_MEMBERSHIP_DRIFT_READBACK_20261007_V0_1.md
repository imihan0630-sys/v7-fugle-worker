# D03 System2 S2-07 V1.6 prospective MOPS membership-drift readback

Updated: 2026-10-07 Asia/Taipei

## Decision

Accept V1.6 as genuine prospective exact-version observation evidence and as a falsification of single-capture expected-keyset completeness. Do not promote D03 maturity or technical continuity.

## Support

- Two successful prospective captures preserve the same stable 23-event semantic universe.
- Latest capture observes 161 global exact-version keys and covers all 23 frozen symbols.
- Common exact-version payload mutation count is 0.
- Global version identity includes stock code; source clock alone is not used as global identity.
- Dedicated workflow, System2 Research CI and V8 Regression pass.

## Counterevidence and alternative explanation

- The earlier capture observes 159 versions; the later capture gains 9 and loses 7.
- Population membership is therefore not stable even though common payload identity is stable.
- Symbol 4806 is among the earlier annual/month-query divergent symbols.
- A missing row in one capture can be a query-membership artifact, not proof that the version did not exist.
- One successful capture cannot freeze the complete expected MOPS keyset.
- `expectedMopsKeysetComplete`, `noRevisionGapThroughCut`, pre-parent readiness, symbol-session completeness and technical continuity all remain false.

## Validation and bias disposition

- PIT: prospective first observation is valid only as an upper bound; it does not prove earlier public availability.
- OOS / walk-forward: UNKNOWN, not opened.
- Selection bias: frozen low-volume 23-event universe; not a random market-wide sample.
- Look-ahead: earliest prospective observed-at must be preserved; later retrieval cannot backdate availability.
- Multiple testing / overfitting: no outcome, threshold or factor fit.
- Factor redundancy: provenance-only evidence; no independent alpha root.
- Date clustering: two captures are minutes apart on the same date.
- Cost, fillability and market-state dependence: UNKNOWN.

## Maturity

- D03 remains 56.7%.
- D03-09 and D03-10 remain L2/40.
- Raw source/version gate remains 2/3.
- Technical observer R1 remains BLOCKED.
- Outcomes remain CLOSED.
- Formal Core remains LOCKED.
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

## Exact next

Stop treating a single capture as the expected-keyset oracle. Wait for repeated-capture union/stability reconciliation that preserves the earliest observed-at for every immutable version, classifies membership drift by query path and exact version, and reaches bounded stabilization. Only then may the union be bound to the source-lane manifest and pre-parent cut; post-parent reconciliation must still prove `noRevisionGapThroughCut=true` before symbol-session or technical-continuity promotion.
