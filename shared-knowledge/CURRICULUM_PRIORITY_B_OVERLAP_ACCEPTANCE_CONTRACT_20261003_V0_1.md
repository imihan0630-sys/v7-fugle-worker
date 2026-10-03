# Curriculum Priority-B Overlap Acceptance Contract 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: OWNER_APPROVED_CONTINUATION / PRIORITY_B_ACCEPTANCE_CONTRACT_FROZEN
Scope: 14 high-overlap pairs retained in the 354-module second-round scan
Formal Core impact: NONE
Curriculum count impact: NONE

## Purpose

Freeze the validation boundary for the 14 Priority-B overlap pairs before specialist evidence is returned.

Default posture is **KEEP_SEPARATE unless strict subsumption is proven**.

The purpose is not to maximize curriculum compression. The purpose is to:
- prevent duplicate evidence weighting;
- preserve producer/consumer and state/strategy-interaction boundaries;
- avoid orphaning source, replay, execution, UI or risk capabilities;
- allow a later merge only when one module is truly subsumed by another.

Allowed outcomes:
- `KEEP_SEPARATE`
- `SCOPE_DEDUP_ONLY`
- `MERGE_ELIGIBLE`
- `EVIDENCE_INSUFFICIENT`

No retirement is executed by this contract.

## Common Priority-B merge firewall

A Priority-B pair is **not** mergeable merely because:
- both use related data;
- one consumes the other;
- both discuss the same market episode;
- both are derived from price/order/news/fundamental data;
- both correlate with the same outcome.

A future `MERGE_ELIGIBLE` result requires all of:
1. one semantic contract strictly subsumes the other;
2. no distinct source clock/universe/unit/action state remains;
3. producer/consumer or state/policy separation is unnecessary;
4. no useful falsification boundary is lost;
5. all historical/replay/runtime/UI capabilities have an explicit surviving owner;
6. no duplicate vote becomes hidden inside the survivor;
7. no Formal Core behavior changes;
8. owner approval after Dependency Audit.

---

## B01 — D05-08 vs D14-08

### Frozen boundary
- D05-08 owns odd-lot/round-lot market mechanics: matching, liquidity, queue/observability and venue behavior.
- D14-08 owns execution consequences: cost, spread/slippage, fill probability, partial fill and implementation quality.

### Default result
`KEEP_SEPARATE / PRODUCER_CONSUMER_BOUNDARY`

### Scope de-dup rule
D14-08 must consume D05-08 mechanics rather than restating exchange mechanics as independent execution evidence.

### Merge eligibility
Only if specialist research proves there is no meaningful mechanics layer independent of cost/fill outputs and D14-08 can preserve all market-mechanics semantics without losing causal diagnosis.

### Required packet
Rooms 04 + 10: mechanics-to-cost field map; shared observables; distinct outputs; replay ownership; anti-double-count rule.

---

## B02 — D05-06 vs D14-14

### Frozen boundary
- D05-06 owns opening-auction and special matching rules/microstructure.
- D14-14 owns auction/special-matching execution cost and implementation quality.

### Default result
`KEEP_SEPARATE / PRODUCER_CONSUMER_BOUNDARY`

### Merge eligibility
Only if all auction-mechanics knowledge is needed solely to calculate execution cost and there is no independent market-state/microstructure use.

### Required packet
Rooms 04 + 10: rule-state map; auction observables; cost outputs; failure cases where rules change but cost does not, and vice versa.

---

## B03 — D11-08 vs D17-02

### Frozen boundary
- D11-08 owns official material-event first-known clocks and event lifecycle timestamps.
- D17-02 owns news/publication first-known clocks, publication/capture latency and source propagation.
- Generic provenance primitives remain a D16 responsibility.

### Default result
`KEEP_SEPARATE / SOURCE_FAMILY_BOUNDARY`

### Scope de-dup rule
Both must reuse shared timestamp/provenance primitives and must not each reinvent generic first-known semantics.

### Merge eligibility
Only if one unified event/news clock contract can represent official corporate-event lifecycle and external news publication/capture without losing source-family-specific failure modes.

### Required packet
Room 08: source-family matrix; timestamp taxonomy; revision semantics; latency differences; cross-source duplicate-event resolution.

---

## B04 — D04-05 vs D18-11

### Frozen boundary
- D04-05 owns volatility-regime state transitions.
- D18-11 owns transitions in the composite market-regime state that may include trend/range, volatility, breadth, rotation, size leadership and risk conditions.

### Default result
`KEEP_SEPARATE / COMPONENT_TO_COMPOSITE_DEPENDENCY`

### Anti-double-count rule
The volatility transition component may feed D18-11 once; D18-11 may not create a second independent volatility vote from the same transition.

### Merge eligibility
Only if the composite regime framework is formally reduced to volatility-only, which is not the current curriculum design.

### Required packet
Rooms 04 + 11: component vector; composite-state builder; transition identity; examples where volatility regime changes but composite regime does not, and vice versa.

---

## B05 — D09-06 vs D18-05

### Frozen boundary
- D09-06 owns observed sector rotation and its PIT state.
- D18-05 owns strategy behavior/performance conditional on a frozen sector-rotation state.

### Default result
`KEEP_SEPARATE / STATE_TO_STRATEGY_INTERACTION`

### Anti-double-count rule
Sector rotation state is an input/context to D18-05, not a second copy of D09-06 alpha.

### Merge eligibility
Only if strategy interaction is abandoned and D18-05 contains no policy/performance conditionality beyond describing rotation itself.

### Required packet
Rooms 07 + 11: rotation-state definition; strategy interaction matrix; same-state/different-strategy examples; same-strategy/different-state examples.

---

## B06 — D17-08 vs D20-10

### Frozen boundary
- D17-08 owns news/event-text sentiment tied to publication clock, source and event half-life.
- D20-10 owns broader investor-sentiment measurement and behavioral proxies with structural/microstructure counterfactuals.

### Default result
`KEEP_SEPARATE_FOR_NOW / SEMANTIC_BOUNDARY_REQUIRED`

### Keep-separate condition
D20-10 must demonstrate at least one sentiment proxy/data family beyond repackaged news sentiment, plus a distinct behavioral interpretation/falsification contract.

### Merge eligibility
If D20-10 ends up using only D17-08 news sentiment and produces no distinct observable behavioral state, merge or narrow D20-10 rather than creating a duplicate sentiment vote.

### Required packet
Rooms 08 + 13: sentiment-source matrix; unique proxy list; structural counterfactuals; event half-life distinction; redundancy test.

---

## B07 — D07-23 vs D16-23

### Frozen boundary
- D07-23 owns enterprise/fundamental scenario and sensitivity modeling: revenue, margin, capex, cash flow and business assumptions.
- D16-23 owns stress/reverse-stress and model-risk validation methodology.

### Default result
`KEEP_SEPARATE / OBJECT_MODEL_VS_VALIDATION_METHOD`

### Scope de-dup rule
D07-23 may define economic scenarios; D16-23 validates stress design, model assumptions, tail behavior and reverse-stress logic. D16-23 must not re-own company forecast construction.

### Merge eligibility
Not expected unless one of the two loses its distinct object-versus-method role.

### Required packet
Rooms 06 + 11: scenario object map; validation-method map; shared assumptions; failure examples; handoff schema.

---

## B08 — D13-18 vs D18-15

### Frozen boundary
- D13-18 owns business-cycle measurement, leading/coincident/lagging indicators and first-known macro state.
- D18-15 owns strategy effectiveness conditional on frozen business/credit-cycle state.

### Default result
`KEEP_SEPARATE / MACRO_STATE_TO_STRATEGY_INTERACTION`

### Anti-look-ahead rule
D18-15 may only consume a cycle state that was PIT-known at the decision clock; ex-post NBER-style or revised cycle labels cannot be used as historical strategy state without a frozen replay rule.

### Merge eligibility
Only if D18-15 ceases to own strategy interaction and becomes merely a duplicate business-cycle classifier.

### Required packet
Rooms 09 + 11: cycle-state contract; first-known clock; revision policy; strategy interaction table; replay guardrail.

---

## B09 — D08-19 vs D17-06

### Frozen boundary
- D08-19 owns market-implied expectations from valuation/pricing assumptions, usually medium/long horizon.
- D17-06 owns event/news consensus-versus-realization surprise, typically event horizon.

### Default result
`KEEP_SEPARATE / HORIZON_AND_SOURCE_BOUNDARY`

### Scope de-dup rule
The word “expectations” does not imply one evidence family. Market-implied valuation expectations and event consensus surprise must not be added as two independent votes without horizon/redundancy control.

### Merge eligibility
Only if both are operationalized with the same expectation baseline, same horizon, same source family and same decision output.

### Required packet
Rooms 06 + 08: expectation-source map; horizon map; implied-vs-consensus distinction; common-support redundancy test.

---

## B10 — D10-13 vs D13-17

### Frozen boundary
- D10-13 owns trade policy/export controls/sanctions transmission through supply chain, capacity, cost, lead time, pricing and issuer exposure.
- D13-17 owns broad macro/geopolitical/capital-flow transmission through financial conditions, currencies, cross-border flows and market context.

### Default result
`KEEP_SEPARATE / TRANSMISSION_LAYER_BOUNDARY`

### Cross-link rule
The same geopolitical event can generate both lanes, but each lane must document a different causal path. Event identity alone cannot create two votes.

### Merge eligibility
Only if specialist evidence shows the two lanes cannot be distinguished by causal path, unit of analysis or output.

### Required packet
Rooms 07 + 09: causal DAG/chain; issuer-vs-market unit map; same-event dual-path examples; redundancy firewall.

---

## B11 — D06-06 vs D19-11

### Frozen boundary
- D06-06 owns security/investor-position crowding and unwind/liquidity risk.
- D19-11 owns factor-portfolio crowding, capacity and turnover.

### Default result
`KEEP_SEPARATE / UNIT_OF_ANALYSIS_BOUNDARY`

### Scope de-dup rule
When factor crowding is constructed from the same holdings/flow data used in D06-06, it must prove an incremental factor-portfolio transformation rather than count the source twice.

### Merge eligibility
Only if D19-11 contains no factor-level portfolio/capacity semantics beyond the same security-level crowding state.

### Required packet
Rooms 05 + 12: unit-of-analysis matrix; transformation lineage; capacity/turnover outputs; incremental-value test.

---

## B12 — D01-08 vs D04-03

### Frozen boundary
- D04-03 owns volatility contraction as a primitive state.
- D01-08 owns VCP as a structured pattern lifecycle that includes contraction plus price geometry/sequence/confirmation.

### Default result
`KEEP_SEPARATE / PRIMITIVE_TO_PATTERN_DEPENDENCY`

### Anti-double-count rule
VCP cannot receive an independent “contraction vote” if the same contraction has already been counted as D04 evidence. Only residual pattern structure beyond primitive contraction may be separately evaluated.

### Merge eligibility
If VCP specialist research finds no incremental structural information beyond generic volatility contraction plus ordinary breakout confirmation, D01-08 becomes a future merge/narrowing candidate.

### Required packet
Rooms 01 + 04: VCP decomposition; contraction baseline; residual geometry features; common-support incremental-value test; failure examples.

---

## B13 — D14-11 vs D15-11

### Frozen boundary
- D14-11 owns transaction friction/cost consequences of REDUCE -> RE-ADD.
- D15-11 owns portfolio/position lifecycle state and policy for REDUCE / RECOVERY / RE-ADD.

### Default result
`KEEP_SEPARATE / COST_INPUT_TO_LIFECYCLE_POLICY`

### Scope de-dup rule
D15-11 consumes D14-11 cost estimates; it must not re-estimate the same transaction friction as separate lifecycle evidence.

### Merge eligibility
Only if the lifecycle module has no independent state/policy semantics and exists solely to report friction cost, which is not the current design.

### Required packet
Room 10: lifecycle state machine; cost handoff; policy-versus-cost distinction; examples where policy changes but cost does not.

---

## B14 — D05-05 vs D05-12

### Frozen boundary
- D05-05 owns observable order-flow imbalance.
- D05-12 owns adverse-selection/order-flow-toxicity mechanism and risk.

### Default result
`KEEP_SEPARATE / OBSERVABLE_INPUT_VS_LATENT_MECHANISM`

### Identifiability firewall
Order-flow imbalance alone cannot prove toxicity, informed trading or intent. D05-12 must require additional observables/tests capable of distinguishing adverse selection from liquidity demand, inventory management, mechanical order splitting or other alternatives.

### Merge eligibility
If D05-12 cannot establish any observable or falsifiable toxicity construct beyond D05-05 imbalance itself, it becomes merge/narrowing eligible rather than preserving an unidentifiable narrative module.

### Required packet
Room 04: toxicity observables; alternative mechanisms; identifiability test; same-OFI/different-toxicity examples; replay requirements.

---

## Priority-B routing order

### P2-A — highest duplicate-vote risk
1. D17-08 vs D20-10.
2. D01-08 vs D04-03.
3. D05-05 vs D05-12.
4. D06-06 vs D19-11.
5. D08-19 vs D17-06.

### P2-B — producer/consumer and state/policy boundaries
6. D05-08 vs D14-08.
7. D05-06 vs D14-14.
8. D04-05 vs D18-11.
9. D09-06 vs D18-05.
10. D14-11 vs D15-11.

### P2-C — source/method/transmission boundaries
11. D11-08 vs D17-02.
12. D07-23 vs D16-23.
13. D13-18 vs D18-15.
14. D10-13 vs D13-17.

## Specialist evidence packet minimum

Every pair must return:
1. semantic ownership table;
2. source/clock/universe/unit-of-analysis table;
3. shared vs unique observables;
4. decision-role comparison;
5. at least one divergent-state example if KEEP_SEPARATE is claimed;
6. redundancy/anti-double-count rule;
7. falsification/alternative mechanism;
8. capability-preservation list;
9. proposed terminal classification;
10. no-Formal-change confirmation.

## Current governance result

All 14 pairs remain in the curriculum pending specialist validation.

No module count change.
No maturity change.
No Formal Core change.
Current canonical curriculum remains 22 domains / 354 modules.
