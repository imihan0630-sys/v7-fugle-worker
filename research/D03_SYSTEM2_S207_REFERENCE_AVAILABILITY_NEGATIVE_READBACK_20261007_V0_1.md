# D03 System2 S2-07 reference-event availability negative readback

Updated: 2026-10-07 Asia/Taipei

## Decision

Accept V1.2 as promotion-relevant negative gate evidence. The exact TPEx 4806 reference-event version is pinned, but its historical public availability before the replay cutoff is not proven.

## Support

- The bounded semantic episode has 18 family rows and 8 relevant MOPS rows.
- All 8 relevant rows have valid source-reported chronology.
- Stable TPEx semanticHash and sourceRowHash are pinned.
- Observation eventVersionId is explicitly not used as stable identity because it may change across retrievals while the semantic/source-row identity remains stable.
- Dedicated workflow and System2 Research CI pass.

## Counterevidence and alternative explanation

- All 8 MOPS observations are retrospective source-clock-only rows.
- Independent exact-version availability evidence count is 0.
- No winning evidence exists; firstKnownAt and availableAt remain null.
- Issuer disclosure chronology proves the episode existed, not when the exact exchange reference-price row became publicly available.
- Source-reported time cannot be promoted to public availableAt; retrospective retrieval cannot become firstObservedAt.

## Validation and bias disposition

- PIT: blocked fail-closed.
- OOS / walk-forward: UNKNOWN, not opened.
- Selection bias: one preselected V1.0-positive lineage case.
- Look-ahead: historical timestamp backfill explicitly rejected.
- Multiple testing / overfitting: no outcome or factor fit.
- Factor redundancy: no new independent information root.
- Date clustering: one event episode only.
- Cost, fillability and market-state dependence: UNKNOWN.

Repository-wide V8 Regression run 37538083218 failed at an unrelated SDA-016 governance-sync token assertion. The initial dedicated V1.2 workflow 37538083182 and System2 Research CI 37538083135 passed; merged-main workflow 37538787809 and merged-main System2 Research CI 37538787638 also passed after stable-identity correction. D03 accepts only the bounded dedicated negative-gate evidence and does not treat the earlier repository regression as green.

## Maturity

- D03 remains 56.7%.
- D03-09 and D03-10 remain L2/40.
- Raw source/version gate remains 2/3.
- Technical observer R1 remains BLOCKED.
- Outcomes remain CLOSED.
- Formal Core remains LOCKED.
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

## Exact next

Stop blind historical-clock promotion attempts for this event. Reopen only if independent evidence binds the stable TPEx semanticHash and sourceRowHash to either a genuine prospective observation or an authoritative publication-time contract no later than the replay cutoff. Observation eventVersionId must not be used as stable cross-fetch identity. Continue waiting for the other four external D03 blockers.
