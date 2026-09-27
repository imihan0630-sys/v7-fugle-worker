# Shadow Cohort Semantics / Membership — Class-B Production Proposal

Updated: 2026-09-27 Asia/Taipei  
Status: DESIGN_READY / OWNER_APPROVAL_REQUIRED / NOT_IMPLEMENTED  
Formal Core: LOCKED

## Why this proposal exists

The current Candidate Shadow archive remains useful, but recent falsification found four independent evidence-quality limitations:

1. `REJECTED_AFTER_BASE` old sampling can starve later rejection reasons.
2. `exclusion_reason` is a fail-fast **first failure**, not marginal gate contribution.
3. `NEAR_MISS` uses redundant `nearScore = 6 - missingCount`, ignores threshold distance, and globally truncates before pool sampling.
4. `BROAD_CONTROL` is quota-conditioned by prior sampled membership: sampled focal rows are excluded while unsampled rows from the same latent population remain eligible.

These can bias Selection Alpha or gate-relaxation research even though Formal trading behavior is untouched.

## Design principle

Separate three concepts that the current single `cohort` column partially conflates:

- **Formal state**: what the production selector actually did.
- **Research membership**: which comparison/sample frames a row belongs to.
- **Quality state**: whether later QA considers the captured evidence usable.

A symbol may legitimately have one Formal state and multiple research memberships.

## Reuse, do not duplicate

Complete qualified-list / cutline evidence remains owned by PVE-156.

This proposal does not create another pool-integrity design.
It references the PVE-156 immutable full qualified receipt and current comparator-version contract.

Current deployed comparator lineage:
`PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30`.

## Proposed additive storage

### 1. Population receipts

`trade_research_population_receipts`

Purpose:
immutable per-date/pool denominators and sampling frames.

Examples:
- firstFailureCount by exact reason;
- liquidity-admission counts;
- setup-first-failure pool/channel/check-pattern counts;
- broad-market control frame counts.

Insert once.
Same identity + same semantic fingerprint = idempotent.
Same identity + different fingerprint = provenance conflict, never overwrite.

### 2. Candidate membership overlay

`trade_research_candidate_memberships`

Allows overlapping research identities such as:
- Formal state = QUALIFIED_NOT_SELECTED;
- membership = INDEPENDENT_BROAD_MARKET_CONTROL.

This is required if Broad Market Control is truly independent.

A mutually-exclusive `RESIDUAL_CONTROL` remains possible, but it is a different estimand and must be named separately.

### 3. Cohort quality overlay

`trade_research_cohort_quality_overlays`

Append-only QA states:
- VALID;
- COHORT_SEMANTIC_CONTAMINATION;
- SOURCE_QUALITY_BLOCKED;
- PROVENANCE_CONFLICT;
- UNKNOWN.

Historical Shadow rows are never silently rewritten.

## Broad-control fork must be explicit

### Option A — INDEPENDENT_BROAD_MARKET_CONTROL

Use when the question is:
“Do Selected names outperform a broad eligible market baseline?”

Rules:
- freeze sampling frame before focal sample caps;
- deterministic outcome-free sample;
- overlapping membership allowed;
- report membership overlap matrix.

### Option B — RESIDUAL_CONTROL

Use when the question is:
“Do focal cohorts outperform rows outside all focal populations?”

Rules:
- classify all PIT rows first;
- remove full focal semantic populations;
- sample the residual;
- do not call it broad market.

The existing hybrid is not retained as the long-run research contract.

## First-failure guard

All exclusion counts are `firstFailureCount`.

They are not:
- all-fail counts;
- unique gate contribution;
- expected candidate increase if a gate is removed.

A separate PASS/FAIL/UNKNOWN/NOT_EVALUABLE gate-overlap observer can be research-only, but it never bypasses Formal.

## Near-miss repair

Do not change A/B thresholds.

Prospective evidence should preserve:
- A/B bitmasks;
- failed counts;
- nearest channel;
- raw margins to current thresholds;
- pool/channel/check-pattern denominators.

Sampling:
`pool × nearestChannel × failed-check-pattern` then deterministic hash.

No outcome-tuned single “near distance score” is introduced.

## Historical handling

Pre-existing `trade_research_shadow_candidates` remains the historical capture record.

Do not mutate it to make the past look clean.

Later knowledge is attached through membership/quality overlays only where PIT state is provable.
Otherwise mark UNKNOWN.

Pre-V8.13 exact current-comparator replay remains unavailable when ranking provenance was not frozen.

## Acceptance matrix

Before any Production implementation could merge:

- no Formal candidate/ordering change;
- no 3+3/Top6 change;
- no capital/entry/stop/monitor/signal/push change;
- zero new market-data calls;
- independent Broad Control unchanged when focal sample caps change;
- overlapping membership supported;
- reason starvation impossible under per-reason sampling;
- first-failure semantics explicit;
- Near-miss pool/channel starvation removed;
- immutable receipt idempotency/conflict tests pass;
- old Shadow rows remain unchanged;
- full Regression + Repair CI pass.

## Governance

Because the clean design requires additive D1 tables and shared research persistence paths, classify implementation conservatively as **Class B proposal-first**.

No implementation or deploy is authorized by this document.

PR #117 and #121 remain useful validated prototypes for two subproblems, but neither should be interpreted as the complete cohort-semantics repair.

## Optimization status

This is evidence infrastructure, not a `FORMAL_OPTIMIZATION_CANDIDATE`.

Its value is to prevent false promotion of:
- liquidity relaxation;
- A/B threshold changes;
- RR/target changes;
- factor reweighting;
- Selection Alpha conclusions

that might otherwise be artifacts of cohort sampling/semantics.


## Persistence / first-known hardening

Fresh audit of the current Candidate Shadow writer confirms an additional evidence-risk layer.

Current legacy writer:
1. `DELETE FROM trade_research_shadow_candidates WHERE scan_date=?`;
2. insert rows one-by-one;
3. outer caller catches research-write failure and lets Formal continue.

No explicit transaction/batch was found around the delete + insert loop.

Therefore:
- same-date rerun can replace first-known evidence;
- failure after DELETE and before the last INSERT can leave a partial date;
- current research integrity can still report HEALTHY when SELECTED count matches and at least one BROAD_CONTROL exists, even if other expected cohort families are missing.

Machine falsification:
`research/shadow_archive_persistence_falsification_v0_1.json`.

### Required Production acceptance additions

Any implementation of this proposal must also prove:

- immutable population/membership receipts are insert-once;
- same identity + same semantic fingerprint is idempotent;
- same identity + different fingerprint is `PROVENANCE_CONFLICT`, never overwrite;
- first-known generation is retained;
- a write failure cannot erase a prior complete generation;
- expected population/sample denominator counts are compared with persisted counts by date/pool/family;
- `HEALTHY` for the new framework means expected-vs-persisted completeness, not merely SELECTED/BROAD_CONTROL existence;
- legacy `trade_research_shadow_candidates` rows are labeled `LEGACY_MUTABLE_ARCHIVE` unless immutable provenance can independently be proven.

No migration may rewrite old rows to manufacture first-known history.


## Decision-state provenance must precede sampling

A further patch-chain audit found a decision-state mismatch in the legacy archive.

Production Formal:
`scoreCandidate -> applyMarketConsensus -> scored/ranked list`.

Legacy Shadow:
- SELECTED / QUALIFIED_NOT_SELECTED reuse post-consensus Formal items;
- NEAR_MISS / REJECTED re-run `scoreCandidate` but remain rejects, so consensus is irrelevant;
- BROAD_CONTROL re-runs bare `scoreCandidate`.

Because current BROAD_CONTROL is quota-conditioned, an unsampled Formal-ok/QNS symbol can spill into BROAD_CONTROL. For that row the research snapshot may record:
- pre-consensus priorityScore;
- missing consensus score/source/bonus;
while the same symbol's real decision-time Formal state had post-consensus values.

Machine witness:
`research/shadow_consensus_provenance_falsification_v0_1.json`.

### Required architecture rule

Before bounded cohort sampling, create/freeze one per-symbol **decision-state receipt** from the actual selector path.

Minimum identity/provenance:
- scan_date + symbol;
- formal worker/rule/comparator versions;
- Formal state;
- first failure if rejected;
- post-consensus ranking tuple if qualified;
- semantic fingerprint;
- source-quality state.

All later research memberships reference that receipt/hash.

Do not recompute a partial scoring path merely because the symbol is later sampled into another research cohort.

Acceptance test:
for any symbol present in the actual same-date scored list, every attached research membership must resolve to an identical post-consensus ranking tuple.


## Reader completeness / pagination

The current counterfactual reader is also capacity-bounded:
`ORDER BY scan_date ASC, cohort ASC, cohort_rank ASC LIMIT 5000`.

It has:
- no pagination;
- no total-row precheck;
- no truncation flag;
- no protection against partial-date reads.

As research cohorts expand, a requested 90/120-day window can exceed 5000 rows. Because ordering is oldest-first, newest prospective evidence is the first to disappear.

Machine witness:
`research/shadow_reader_capacity_falsification_v0_1.json`.

Any replacement reader must:
- paginate to complete the requested keyspace;
- preserve whole-date completeness or mark `PARTIAL_DATE`;
- return requested/returned date and row coverage;
- fail promotion-grade inference when truncated;
- join evidence overlays against the exact same parent keyset.

Do not fix this by only increasing the hard-coded limit.


## External-evidence parent linkage

Legacy `trade_research_external_evidence` has the same mutable date/symbol identity problem:
- capture is generated from in-memory Shadow rows;
- Shadow and external evidence persist separately;
- external evidence also uses same-date DELETE + row-by-row INSERT/UPSERT;
- evidence rows do not store immutable parent snapshot hash / parent generation.

Readers then independently query:
- parent Shadow: date + cohort/rank, `LIMIT 5000`;
- external evidence: date + symbol, `LIMIT 5000`.

When a hard limit cuts through one date, the two different secondary sort orders can return different symbol subsets.

Required:
- external evidence receipt references parentDecisionReceiptId / parentSnapshotHash / captureGeneration;
- evidence is read by the exact complete parent keyset, not a separately truncated date-range query;
- expected parent/evidence counts are reconciled;
- missing join reason is explicit rather than a generic null.

Machine guard:
`research/external_evidence_parent_keyset_falsification_v0_1.json`.

## Canonical market identity

V8.7.11 currently derives `sourceMarket` from which monthly-revenue map contains the symbol.

But the Formal normalized row already knows market identity (`row.market`) and preserves it through enrichment.
That canonical exchange identity is dropped before the external-evidence collector.

This couples unrelated evidence availability:
a known TWSE symbol missing from monthly revenue can become `UNKNOWN_MARKET`, which then makes margin / SBL / attention / disposition UNKNOWN too.

Required:
- persist canonical TWSE/TPEX market from Formal normalized input in the decision-state receipt;
- use it to route market-specific evidence;
- preserve evidence-source market separately;
- source mismatch => provenance conflict, not identity replacement;
- provider/symbol missing affects only that evidence family.

Machine guard:
`research/external_evidence_market_identity_falsification_v0_1.json`.

## Research Readiness quality overlay

Current V8.7.10 Readiness Matrix is primarily a coverage/count maturity matrix.
Its global quality blocker only fires when legacy `shadowIntegrity.status === RESEARCH_DATA_GAP`.

Newly confirmed evidence-quality blockers are not yet machine inputs, so high row/date counts can still produce `DESCRIPTIVE_READY` or `ALL_DESCRIPTIVE_READY`.

Do not change the old sample thresholds based on outcomes.

Instead separate:
1. `coverageReadiness` — existing frozen row/date thresholds;
2. `evidenceQualityEligibility` — immutable parent, cohort semantics, pool matching, outcome quality, reader completeness and experiment-specific estimator validity;
3. `promotionEligibility` — existing stricter OOS/cost/redundancy/governance layer.

A quality blocker must not globally block unrelated experiments; guards are mapped by experiment.

Machine guard:
`research/readiness_quality_gate_falsification_v0_1.json`.
