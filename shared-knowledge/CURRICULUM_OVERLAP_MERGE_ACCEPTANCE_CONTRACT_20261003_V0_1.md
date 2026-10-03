# Curriculum Overlap Merge Acceptance Contract 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: OWNER_APPROVED_CONTINUATION / GOVERNANCE_ACCEPTANCE_CONTRACT_FROZEN
Scope: Priority-A overlap candidates from the 354-module second-round scan
Formal Core impact: NONE
Curriculum count impact: NONE

## Purpose

Freeze the decision criteria **before** specialist evidence returns, so a later keep/merge decision cannot move the goalposts after results are known.

This document does not perform specialist empirical research and does not retire any module.

Allowed terminal decisions for each candidate:
- `MERGE_ELIGIBLE`
- `KEEP_SEPARATE`
- `SCOPE_DEDUP_ONLY`
- `EVIDENCE_INSUFFICIENT`

Any actual retirement still requires:
1. specialist evidence;
2. Dependency Audit（依賴審查）;
3. anti-orphan verification;
4. latest-main re-read;
5. explicit owner approval.

## Common acceptance gates

A module pair may become `MERGE_ELIGIBLE` only when all applicable gates pass:

### G1 Semantic subsumption
Every material concept of the retiring module maps to a named parent/child concept under the surviving owner. No important theory, counterexample, failure mode or interpretation may disappear.

### G2 Observable/data contract
The retiring module must not require a materially distinct first-known clock, source family, universe, unit of analysis or data-quality contract that the survivor cannot represent.

### G3 Decision-role contract
The retiring module must not own a distinct decision role. A different label alone is insufficient; the test is whether it changes a different action, state, constraint, confidence channel or strategy-specific policy.

### G4 Incremental-evidence test
When both modules consume substantially the same observables, specialist validation must test whether the second module adds independent information after redundancy controls. Same-source re-expression is not independent evidence.

### G5 Falsification boundary
A merge must preserve useful negative controls and alternative explanations. If combining modules would make it impossible to tell which mechanism failed, keep the boundary.

### G6 Capability preservation
Historical evidence, formulas, metrics, schemas, reports, UI explanations, APIs, replay contracts and research utilities required by either module must have an explicit surviving owner.

### G7 No hidden Formal change
The merge itself cannot change selection, ranking, score, threshold, capital, entry/exit, execution, monitoring, signal or notification behavior.

### G8 Naming and routing
After merge, the surviving module name/scope and all room routing must cover the absorbed semantics without creating a misleading narrower title.

## Candidate A — D15-21 vs D15-22

### Current hypothesis
`STRONG_MERGE_CANDIDATE_AFTER_VALIDATION`

- D15-21: Active Portfolio Diagnostics／Tracking Error／Active Share／Performance Attribution.
- D15-22: Risk Attribution／Information Ratio.

### Required three-way check
D15-16 must also be checked because pre-trade optimization/risk-budget semantics belong there rather than being accidentally duplicated inside D15-22.

Ownership test:
- D15-16 = **pre-trade portfolio construction / optimization / risk-budget method family**.
- D15-21 = **benchmark-relative portfolio diagnostics and realized/expected attribution family**.
- D15-22 may remain standalone only if it owns a third distinct contract not representable by those two owners.

### MERGE_ELIGIBLE condition
D15-22 becomes merge-eligible into D15-21 when specialist validation shows:
1. Risk Attribution outputs can be expressed as child diagnostics under the same portfolio/benchmark/time-window identity used by D15-21.
2. Information Ratio is a benchmark-relative diagnostic derived from active return and tracking error rather than a separate policy engine.
3. Any ex-ante risk decomposition needed for construction is explicitly routed to D15-16, not duplicated in D15-22.
4. No unique source clock, replay contract, runtime capability or action state is owned only by D15-22.
5. Performance attribution and risk attribution can share one anti-double-count contract.

Likely post-merge owner:
**D15-21 Active Portfolio Diagnostics／Performance & Risk Attribution**, with D15-22 knowledge retained as named child methods.

### KEEP_SEPARATE condition
Keep D15-22 only if it demonstrates a distinct decision contract that:
- is neither pre-trade optimization/risk budgeting owned by D15-16;
- nor benchmark-relative diagnostic/attribution owned by D15-21;
- uses materially distinct inputs or produces a materially distinct actionable state;
- and preserves a falsification boundary that would be lost if merged.

### Required evidence packet from room 10
- capability matrix: D15-16 / D15-21 / D15-22;
- input/source/time identity comparison;
- output metric map;
- pre-trade vs post-trade role map;
- anti-double-count map;
- capability-preservation list;
- proposed survivor name/scope if merge is supported.

## Candidate B — D07-17 vs D21-12

### Current hypothesis
`SEMANTIC_SPLIT_REQUIRED / MERGE_IF_SAME_OBSERVABLES`

- D07-17: Management Guidance Quality.
- D21-12: Management Guidance Credibility.

### Required semantic boundary if both survive

D07-17 must own **guidance content quality / forecast usefulness**, such as:
- specificity and measurable content;
- range width / precision;
- revision frequency and direction;
- forecast error against later operating outcomes;
- relation between guidance and revenue/margin/capex/business-driver realization;
- usefulness for fundamental expectation formation.

D21-12 must own **governance credibility / disclosure-behavior context**, requiring evidence beyond the same forecast-error series, such as:
- persistent directional bias conditional on incentives/conflicts;
- selective disclosure or inconsistency across disclosure channels;
- governance/incentive context linked to disclosure behavior;
- management turnover/control context;
- audit/internal-control or related governance evidence when relevant;
- credibility deterioration that is not merely “forecast was inaccurate”.

### KEEP_SEPARATE condition
Keep both only if specialist rooms establish:
1. at least one materially distinct observable/data family for D21-12 beyond the D07-17 guidance-content/realization record;
2. distinct decision roles: D07-17 fundamental expectation evidence versus D21-12 governance/context/confidence;
3. an anti-double-count rule when both use the same guidance event;
4. a case where one module changes while the other legitimately does not;
5. separate falsification tests.

### MERGE_ELIGIBLE condition
Merge when:
- both modules use essentially the same guidance/revision/realization history;
- D21-12 adds no independently observable governance evidence;
- both produce the same confidence/direction interpretation after controls;
- separate IDs would mainly create duplicate evidence or duplicate narrative.

If merge is supported, specialist rooms must propose the surviving owner based on semantic coverage. No survivor is pre-authorized by this governance contract.

### EVIDENCE_INSUFFICIENT condition
If management credibility requires data that is conceptually distinct but not currently observable with reliable PIT/replay, keep both temporarily but mark D21-12 as research-only/UNKNOWN rather than filling the gap with D07-17 data.

### Required evidence packet from rooms 06 + 14
- shared-event field map;
- unique-observable map;
- examples of divergent states;
- decision-role map;
- PIT/source/replay requirements;
- redundancy test design;
- proposed survivor/child semantics if merge is supported.

## Candidate C — D16-11 vs D16-21

### Current hypothesis
`KEEP_BOTH / REMOVE_GENERIC_PROVENANCE_DUPLICATION`

- D16-11: Data Provenance.
- D16-21: Alternative Data Provenance／Selection Bias.

### Frozen ownership boundary

D16-11 is the **generic provenance primitive owner**:
- source identity;
- source generation/version;
- first-known / available-at / captured-at semantics;
- lineage;
- replayability;
- missingness/UNKNOWN;
- source substitution/change control;
- generic coverage and provenance integrity.

D16-21 is the **alternative-data-specific bias/validation owner**:
- vendor or platform selection bias;
- panel/coverage entry-exit bias;
- survivorship/availability bias specific to alternative data;
- sampling/label leakage;
- text/model-derived data drift;
- representativeness;
- alternative-data-specific missing-not-at-random mechanisms;
- model/vendor methodology change effects not reducible to generic lineage alone.

### SCOPE_DEDUP_ONLY acceptance condition
This is the default target if specialist validation confirms:
1. D16-21 consumes D16-11 generic provenance fields rather than redefining them.
2. D16-21 retains a distinct alternative-data bias/falsification layer.
3. Shared provenance code/schema stays owned once.
4. Alternative-data-specific selection bias cannot be represented by generic provenance alone.

### MERGE_ELIGIBLE condition
Full merge into D16-11 is allowed for owner review only if specialist validation shows that **all** D16-21 residual topics are merely generic provenance/data-quality checks and there is no distinct selection-bias/leakage/representativeness contract.

### KEEP_SEPARATE condition
Keep both with narrowed scopes if alternative-data-specific selection/coverage/leakage/model-drift tests remain materially distinct.

### Required evidence packet from room 11
- generic vs alternative-specific field matrix;
- shared-schema ownership map;
- selection-bias and leakage falsifiers;
- examples generic provenance cannot diagnose;
- proposed D16-21 narrowed name/scope;
- duplicate-code/schema removal plan if applicable.

## Decision sequencing

1. Specialist room produces the required packet.
2. 00｜研究總控室 verifies packet completeness only.
3. Dependency Audit checks every consumer/producer/capability.
4. Compare against the frozen conditions in this file.
5. Classify as `MERGE_ELIGIBLE`, `KEEP_SEPARATE`, `SCOPE_DEDUP_ONLY` or `EVIDENCE_INSUFFICIENT`.
6. Report to owner.
7. No curriculum retirement or ID removal until owner explicitly approves the final action.
8. After approval, update tracker/map/router/ledger atomically and re-read latest main.

## Current state

- D15-21 vs D15-22: acceptance contract frozen; specialist validation pending.
- D07-17 vs D21-12: acceptance contract frozen; specialist validation pending.
- D16-11 vs D16-21: acceptance contract frozen; specialist validation pending.
- Module count remains 354.
- Formal Core remains LOCKED.
