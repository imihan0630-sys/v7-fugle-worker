# Shadow Cohort Semantics Research

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED

## SC-001 — Sampling membership is not semantic membership

Current archive uses one `used` set.

A symbol is added to `used` only when it is actually serialized into a bounded Shadow sample.

This means bounded sampling happens before BROAD_CONTROL semantics are enforced.

The result is a research-firewall problem:
**not sampled earlier != semantically a broad control.**

## SC-002 — Qualified spillover

Suppose 10 GENERAL candidates pass full scoreCandidate and 3 are formally selected.

Seven are true QUALIFIED_NOT_SELECTED.
The archive keeps at most six GENERAL qualified rows.

The seventh:
- is not selected;
- is not serialized into QUALIFIED_NOT_SELECTED;
- is not in `used`;
- can satisfy BROAD_CONTROL history/price/minLots;
- can therefore be stored as BROAD_CONTROL.

This is deterministic semantic contamination.

## SC-003 — Rejected spillover

The same problem applies to bounded downstream rejects.

A row that is truly:
- setup-first-failure;
- fundamental reject;
- ATR reject;
- target-null;
- RR<2;
- signal-grade C;

can enter BROAD_CONTROL if it was not included in the bounded prior sample and meets broad-control base filters.

The existing hash makes selection outcome-independent, but does not make cohort semantics correct.

## SC-004 — Correct order

Research cohort construction should be:

1. classify semantic state for every eligible PIT feature row;
2. compute full denominators;
3. create mutually exclusive population masks;
4. only then sample within each population.

BROAD_CONTROL must exclude the full semantic populations, not just rows already sampled.

Machine falsification:
`research/broad_control_cohort_contamination_falsification_v0_1.json`.

## SC-005 — historical handling

Do not rewrite old immutable Shadow rows.

If a historical BROAD_CONTROL row can be proven from its PIT snapshot to have been:
- Formal-qualified;
- setup-first-failure;
- downstream-rejected;

mark it through a versioned quality overlay:
`COHORT_SEMANTIC_CONTAMINATION`.

If source completeness is insufficient:
`COHORT_STATE_UNKNOWN`.

Do not silently relabel.

## SC-006 — optimization relevance

This is not a stock-selection optimization by itself.

It is evidence infrastructure required before comparing:
- Selected vs Broad Control;
- Near-miss vs Broad Control;
- gate-rejected vs Broad Control.

A cleaner control can strengthen, weaken or reverse earlier apparent Selection Alpha. That is precisely why the repair must occur before using those comparisons to alter Formal.

No Formal behavior changed.
