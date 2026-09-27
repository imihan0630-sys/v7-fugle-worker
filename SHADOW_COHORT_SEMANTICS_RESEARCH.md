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


## SC-007 — two valid control estimands

A row belonging to another Formal-state cohort is not automatically forbidden from a broad-market control.

The deeper defect is **conditional overlap**:
- if a qualified/rejected/near row is sampled earlier, `used` removes it from BROAD_CONTROL;
- if an otherwise identical semantic row is not sampled earlier because the cohort cap was reached, it remains eligible for BROAD_CONTROL.

Thus current BROAD_CONTROL is a **quota-conditioned mixture**.

Its composition can change when only Shadow sample caps change, even though:
- the feature universe is identical;
- Formal decisions are identical;
- market outcomes are identical.

Two coherent designs are possible.

### A. Independent BROAD_MARKET_CONTROL

Purpose:
compare selected names with a frozen broad eligible market baseline.

Rules:
- freeze the broad sampling frame independently;
- sample by deterministic date+symbol key before focal cohort sample caps;
- allow the same symbol to carry both Formal-state membership and broad-control membership;
- persist membership flags/array or a separate membership table.

The current `(scan_date,symbol)` single primary cohort representation cannot express this overlap cleanly.

### B. Mutually exclusive RESIDUAL_CONTROL

Purpose:
compare focal cohorts with rows outside all focal semantic populations.

Rules:
- classify every PIT row first;
- exclude complete semantic populations, not only sampled members;
- sample the explicit residual;
- call it RESIDUAL_CONTROL, not broad market.

### Forbidden hybrid

Do not:
- remove only sampled members of a semantic group;
- leave unsampled members of the same semantic group eligible;
- then interpret the result as either an independent broad market baseline or a clean residual.

## SC-008 — historical evidence guard

Until control estimand is frozen:
- Selected-vs-BROAD_CONTROL historical results are descriptive;
- sensitivity to upstream cohort caps must be reported;
- older BROAD_CONTROL rows should not be silently rewritten.

A versioned membership/quality overlay is the safe correction path.


## SC-TIE-001 — semantic classifier must not invent a symbol tie-break

The deployed Formal comparator has no final symbol tie-break. When all six comparator fields tie, it returns zero and JavaScript stable sort preserves the original pre-sort order.

The Class-A semantic prototype previously diverged from that behavior by adding:
`String(a.symbol).localeCompare(String(b.symbol))`.

That made the prototype deterministic, but not Formal-exact. Two genuinely tied qualified rows could be reordered by ticker and assigned a fabricated exact `formalPoolRank`.

Repair is fail-closed:
- non-tied complete comparator rows remain `CERTIFIED`;
- a full tie with unique `preSortOrdinal` is `CERTIFIED`;
- a full tie without unique tie lineage keeps only `observedPoolRank`, while `formalPoolRank=null` and `rankCertification=TIE_LINEAGE_UNKNOWN`;
- incomplete comparator inputs similarly set `formalPoolRank=null`.

This aligns the executable prototype with the already-frozen SR-007 / PVE-156 requirement for pre-sort ordinal and exact tie lineage.

Machine artifact:
`research/shadow_semantic_rank_tie_lineage_falsification_v0_1.json`.

Status:
`PROTOTYPE_SYMBOL_TIEBREAK_FALSIFIED / EXACT_TIE_LINEAGE_FAIL_CLOSED / FORMAL_UNCHANGED`.


### SC-TIE-002 — comparator completeness is pool-level, not row-level

A second falsification tightens SC-TIE-001.

Absolute pool rank is a **joint** estimand. If any Formal-qualified competitor in the same price pool is missing one comparator input, that competitor's true position is unknown and can shift the ranks of otherwise complete rows.

Therefore:
- one incomplete qualified row makes exact `formalPoolRank` UNKNOWN for **all** qualified rows in that pool;
- those rows are tagged `POOL_RANK_INPUT_INCOMPLETE`;
- another independent price pool with complete inputs remains certifiable;
- descriptive `observedPoolRank` may still be shown, but cannot be promoted to Formal-exact rank.

This prevents a subtle false-certification where only the incomplete row was nulled while its complete peers retained exact-looking ranks.

Status:
`POOL_LEVEL_RANK_INTEGRITY_FAIL_CLOSED / FORMAL_UNCHANGED`.
