# D03 System2 S2-07 technical-continuity incremental readback

Updated: 2026-10-07 Asia/Taipei

## Decision

The System2 V1.1 physical run is accepted as a bounded external machine delta for corporate-action contamination control, but not as promotion-grade PIT technical continuity.

## Support

- One physical TPEX 4806 capital-reduction boundary reconciles the RAW pre-suspension close 10.4 to the official reference price 14.87 through the official ratio 1.4298076923076921.
- The bridge separates the mechanical reset from the resume open/close residuals without RAW-history mutation or adjusted-history persistence.
- Dedicated tests, physical probe, read-only guard and System1 isolation all PASS.

## Counterevidence and alternative explanation

- Official event `firstKnownAt` and `availableAt` are null; `knowledgeTimeMode=HISTORICAL_UNKNOWN`.
- Therefore PIT replay remains blocked and no historical decision-time transform is authorized.
- One positive symbol/event boundary cannot certify all-history continuity or generalize across symbols, event families or market states.
- Residual open/close movement is descriptive and is not ADX, Bollinger, momentum, reversal or alpha evidence.

## Bias and validation disposition

- PIT: blocked fail-closed.
- OOS / walk-forward: UNKNOWN, not opened.
- Selection bias: one V1.0-positive lineage case only.
- Look-ahead: blocked from replay rather than silently backdated.
- Multiple testing / overfitting: no outcome or threshold fit was performed.
- Factor redundancy: no new independent information root.
- Date clustering: single event date, not generalizable.
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

Wait for prospectively timestamped official-event version evidence with `firstKnownAt` / `availableAt` before the decision cutoff. Bind only then to a genuine cutoff-bearing parent and complete expected-parent reconciliation. Do not generalize this one-symbol event-boundary bridge to all-history technical continuity.
