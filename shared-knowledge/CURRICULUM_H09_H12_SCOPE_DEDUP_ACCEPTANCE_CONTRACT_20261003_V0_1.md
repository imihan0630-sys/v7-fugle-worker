# Curriculum H09-H12 Scope De-duplication Acceptance Contract 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: OWNER_APPROVED_CONTINUATION / SCOPE_DEDUP_ACCEPTANCE_CONTRACT_FROZEN
Scope: Third-round hidden-overlap clusters H09-H12
Formal Core impact: NONE
Curriculum count impact: NONE

## Purpose

Freeze ownership boundaries for H09-H12 where the expected outcome is usually not retirement but removal of duplicated responsibilities, duplicated schemas, duplicated evidence and duplicated votes.

Allowed terminal classifications:
- `KEEP_SEPARATE`
- `SCOPE_DEDUP_ONLY`
- `MERGE_ELIGIBLE`
- `EVIDENCE_INSUFFICIENT`

## Common ownership rules

### O1 Single primitive owner
A generic primitive such as calibration, issuer exposure, option-chain parent rows or securities-lending observation should have one canonical owner.

### O2 Consumer does not re-own producer evidence
A downstream decision/execution/interpretation module may consume the upstream primitive, but may not re-score the same primitive as a second independent vote.

### O3 Residual scope must be explicit
If two modules remain, the downstream module must name exactly what remains after subtracting the upstream owner's semantics.

### O4 Shared schema / receipt reuse
Shared data contracts, provenance fields, prediction receipts, exposure maps and parent rows must be referenced, not cloned under new ownership.

### O5 Divergent-state test
Separate modules should be able to differ legitimately on the same PIT date.

### O6 Maturity isolation
Maturity only applies to the scope actually evidenced. Upstream maturity cannot promote downstream semantics.

### O7 Formal isolation
Scope cleanup alone does not change live behavior.

---

# H09 — D16-19 vs D16-25

## Modules
- D16-19 Machine Learning／Calibration — L0 / 0%.
- D16-25 Probabilistic Decision／Bayesian Updating／Uncertainty-aware Selection — L2 / 40%, L2 closed; real Taiwan calibration evidence pending.

## Frozen ownership boundary

### D16-19 owns model estimation and calibration methodology
Including:
- model training/estimation;
- calibration methods;
- probability calibration diagnostics as model-quality tools;
- leakage/nonstationarity/model-drift controls;
- comparison with simple baselines;
- feature/model validation.

### D16-25 owns decision policy over calibrated evidence
Including:
- probability-to-decision translation;
- Bayesian/base-rate updating at the decision layer;
- expected utility/value;
- uncertainty penalty;
- ABSTAIN/no-trade policy;
- evidence-role integration;
- risk-coverage and decision-level calibration consequences.

## SCOPE_DEDUP_ONLY target
Preferred result is:
- D16-19 outputs calibrated probabilities/distributions + calibration quality.
- D16-25 consumes them and applies decision policy.
- D16-25 may specify required calibration quality but does not own model-calibration implementation.
- D16-19 does not own portfolio/selection utility, ABSTAIN or decision-role aggregation.

## MERGE_ELIGIBLE
Full merge is allowed for owner review only if specialist validation proves there is no useful distinction between model-calibration methodology and decision policy, which is not the current working hypothesis.

## Required evidence packet
Room 11:
- producer/consumer interface;
- calibration method vs decision policy matrix;
- shared metrics vs owned metrics;
- prediction receipt ownership;
- model-drift vs decision-drift handling;
- divergent-state examples;
- no duplicate calibration scoring;
- terminal classification.

---

# H10 — D17-04 + D17-05 vs D10-12

## Modules
- D10-12 Industry-specific Transmission Model／Issuer Exposure Mapping — L3 / 60%.
- D17-04 Direct Beneficiary/Victim — L2 / 40%.
- D17-05 Indirect / Second-order Supply-chain Transmission — L2 / 40%.

## Frozen ownership boundary

### D10-12 owns durable structural exposure
Including:
- industry/product taxonomy;
- company/product/revenue exposure;
- upstream/downstream position;
- pricing power;
- inventory/capacity/order bridge;
- issuer-native disclosure evidence;
- effective-dated exposure map.

### D17-04/05 own event-specific attribution
They add:
- dated event/news identity;
- first-known clock;
- event direction/surprise;
- event half-life;
- direct vs second-order event path;
- event-specific applicability of the structural exposure.

## SCOPE_DEDUP_ONLY target
D17-04/05 must consume D10-12 exposure fields.
They may not rebuild issuer exposure from headlines as independent evidence.

## Merge eligibility
Only if event-specific attribution adds no distinct clock/path/state beyond the structural exposure map.

## Maturity firewall
D10-12 L3 does not promote D17-04/05.
D17-04/05 L2 does not alter D10-12 structural-exposure maturity.

## Required packet
Rooms 07 + 08:
- exposure schema ownership;
- event attribution overlay schema;
- first-known clock split;
- direct/second-order path logic;
- shared evidence receipts;
- divergent-state cases;
- terminal classification.

---

# H11 — D12-07 vs D12-16

## Modules
- D12-07 Skew／Term Structure — L2 / 40%.
- D12-16 Volatility Surface／Smile — L2 / 40%.

## Frozen ownership boundary

### D12-07 owns simple interpretable surface summaries
- skew/slope-style simple features;
- term-structure summaries;
- directly interpretable low-dimensional option-state baselines.

### D12-16 owns residual complex surface structure
- smile/curvature;
- richer cross-strike/cross-maturity shape;
- surface fitting/quality controls;
- no-static-arbitrage and interpolation diagnostics where applicable;
- complex factors only after comparison to D12-07.

## SCOPE_DEDUP_ONLY target
The same option-chain parent rows are ingested once.
D12-16 must prove residual information beyond D12-07 simple summaries.

## MERGE_ELIGIBLE
If D12-16's useful outputs collapse to skew/term-structure summaries after quote-quality and common-support controls, it becomes merge/narrowing eligible.

## KEEP_SEPARATE
Keep both if complex surface shape has:
- distinct valid observables;
- stable replay semantics;
- divergent states;
- incremental OOS value after D12-07 controls.

## Required packet
Room 09:
- parent-row lineage;
- simple-feature vs complex-surface map;
- surface-fit quality contract;
- residual feature tests;
- divergent-state examples;
- incremental-value design;
- terminal classification.

---

# H12 — D06-09 / D06-18 / D14-19 / D20-13

## Four-layer shorting ontology

### Layer 1 — D06-09 observed borrowing/short-sale activity
Owns:
- reported lending/borrowing stock and flow;
- actual securities-lending short-sale observations;
- PIT source/replay semantics;
- observed activity without assuming motive.

### Layer 2 — D06-18 securities-lending economics
Owns:
- borrow fee;
- availability;
- utilization;
- supply/demand economics;
- distinction among hedging, arbitrage and directional demand where identifiable.

### Layer 3 — D14-19 short-sale execution lifecycle
Owns:
- whether a short can be established;
- maintainability;
- recall;
- forced buy-in;
- squeeze/exit execution risk;
- strategy-specific orderability.

### Layer 4 — D20-13 limits to arbitrage / noise-trader risk
Owns:
- economic reason mispricing may persist despite theoretical arbitrage;
- capital, funding, borrow and noise-trader constraints;
- research/falsification context rather than direct directional signal.

## SCOPE_DEDUP_ONLY target
All four remain only if each layer preserves a distinct object and decision use.

## Hard anti-double-count rules
- D06-09 lending flow is not automatically a bearish directional vote.
- D06-18 high borrow fee/low availability is not a second independent bearish vote if derived from the same lending condition.
- D14-19 may use D06-18 to determine short feasibility but cannot re-score borrow scarcity as alpha.
- D20-13 may cite D06/D14 constraints to explain arbitrage limits but cannot become a fourth directional signal.
- One lending observation may have multiple downstream consequences but one primitive evidence receipt.

## Conditional HARD_INVALIDATION boundary
Only D14-19 may study strategy-specific hard invalidation when a required short position is factually not establishable/maintainable under the frozen strategy contract.
This does not authorize a generic stock-selection hard gate.

## MERGE_ELIGIBLE
Any layer becomes merge-eligible only if specialist research proves it has no residual semantics beyond another layer.

## Required packet
Rooms 05 + 10 + 13:
- four-layer schema;
- canonical source/receipt owner;
- borrow economics field map;
- short feasibility state machine;
- limits-to-arbitrage context map;
- examples where layers diverge;
- anti-double-count tests;
- capability inventory;
- terminal classification per layer.

---

## Execution sequence

1. Specialist rooms read this contract.
2. Return the frozen evidence packet.
3. 00｜研究總控室 verifies ownership and duplicate-removal completeness.
4. Dependency Audit checks downstream consumers.
5. Owner approval is required before any merge/retirement.
6. If only `SCOPE_DEDUP_ONLY`, module IDs remain and scopes/router/schema ownership are updated without maturity inflation.

## Current state

- H09: preferred SCOPE_DEDUP_ONLY; validation pending.
- H10: preferred SCOPE_DEDUP_ONLY; validation pending.
- H11: preferred KEEP_SEPARATE_FOR_NOW / SCOPE_DEDUP_ONLY; validation pending.
- H12: preferred KEEP_ALL / SCOPE_DEDUP_ONLY; validation pending.
- No module count change.
- No maturity change.
- Formal Core remains LOCKED.
