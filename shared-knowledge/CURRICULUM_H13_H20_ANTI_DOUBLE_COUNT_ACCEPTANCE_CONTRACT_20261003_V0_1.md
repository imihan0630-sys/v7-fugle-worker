# Curriculum H13-H20 Anti-Double-Count Acceptance Contract 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: OWNER_APPROVED_CONTINUATION / ANTI_DOUBLE_COUNT_CONTRACT_FROZEN
Scope: Third-round hidden-overlap clusters H13-H20
Formal Core impact: NONE
Curriculum count impact: NONE

## Purpose

Freeze dependency ownership and anti-double-count rules for eight clusters that should remain separate unless future evidence proves strict subsumption.

Default classification:
`KEEP_SEPARATE / DEPENDENCY_CHAIN`

Allowed terminal classifications:
- `KEEP_SEPARATE`
- `SCOPE_DEDUP_ONLY`
- `MERGE_ELIGIBLE`
- `EVIDENCE_INSUFFICIENT`

## Common rules

### A1 One primitive receipt
A shared raw event/input/return path is recorded once.

### A2 Different transformation is not automatically independent evidence
A downstream transform must prove residual information before it can contribute an independent Alpha/risk vote.

### A3 Producer-consumer linkage
Downstream modules reference upstream evidence IDs rather than clone source ownership.

### A4 Context vs signal separation
Mechanics, accounting inputs, event clocks and risk-state transforms are not automatically directional signals.

### A5 Maturity isolation
A mature upstream primitive does not promote a downstream method or strategy.

### A6 Formal isolation
This governance work changes no live behavior.

---

# H13 — D07-06 vs D22-03

## Boundary
- D07-06 = accounting balance-sheet / leverage quality.
- D22-03 = credit/funding-context net debt and leverage structure.

## Keep-separate rule
D22-03 must add at least one credit-specific dimension beyond reused accounting ratios, such as debt maturity/funding mix/market credit context or issuer-specific debt structure.

## Anti-double-count
The same debt/equity or leverage ratio is one primitive accounting receipt; D22-03 can transform it into credit structure context but cannot count it again as independent evidence.

## Merge eligibility
Only if D22-03 proves no residual credit/funding semantics beyond D07-06.

---

# H14 — D06-11 vs D11-14

## Boundary
- D11-14 owns index-adjustment event identity, announcement/effective clocks and event lifecycle.
- D06-11 owns observed passive/index fund flows and rebalancing stock/flow.

## Anti-double-count
One index rebalance event cannot be one event vote plus a second identical flow vote unless the realized flow adds independent information beyond the known event.

## Divergent-state requirement
Examples must include:
- index event known but realized passive flow weak/unknown;
- passive flow observed without a new index-adjustment event.

---

# H15 — D11-10 / D04-09 / D17-12

## Boundary
- D11-10 = event-linked overnight gap risk.
- D04-09 = gap/tail volatility risk as distributional state.
- D17-12 = post-event continuation/reversal path.

## Anti-double-count
The opening gap itself is one observation.
It may feed:
1. event-risk identity;
2. volatility/tail-state transformation;
3. subsequent path analysis.
It is not three independent votes at time zero.

## Independent evidence condition
D17-12 only becomes additional evidence from post-gap evolution after the initial gap observation.

---

# H16 — D05-02 / D11-11 / D01-09 / D04-10

## Four-layer price-limit chain
- D05-02 = exchange price-limit mechanics.
- D11-11 = multi-day exit/orderability risk caused by limits.
- D01-09 = chart/pattern/gap semantics under limit constraints.
- D04-10 = volatility-estimator contamination.

## Anti-double-count
One limit-hit session is a shared primitive event.
Each downstream module must reference that event and contribute only its own transformation.

## Hard-invalidation boundary
Only factual orderability/exit impossibility may be studied as a strategy-specific hard constraint; the limit event itself is not a generic bullish/bearish gate.

---

# H17 — D07-18 / D22-04 / D13-06

## Compositional cost-of-capital chain
- D13-06 = sovereign/risk-free yield curve.
- D22-04 = issuer debt cost / refinancing spread/risk.
- D07-18 = enterprise WACC / cost-of-capital composite.

## Anti-double-count
A rate shock propagating through all three layers cannot be counted three times.
D22-04 must isolate issuer spread/refinancing effects beyond risk-free rate.
D07-18 must combine cost-of-debt and cost-of-equity components rather than repeat the raw yield-curve move.

## Divergent-state requirement
- stable risk-free rate / widening issuer credit spread;
- rising risk-free rate / unchanged issuer spread;
- WACC changing through equity-risk or capital-structure channel without identical debt-cost change.

---

# H18 — D07-19 vs D21-07

## Boundary
- D07-19 = project/capital-budget economics: NPV, IRR, real options.
- D21-07 = management incentives and observed capital-allocation quality.

## Anti-double-count
D21-07 may evaluate whether management selected/implemented good projects, but cannot count the same NPV calculation as separate governance evidence.

## Divergent-state requirement
Examples:
- attractive projects exist but management allocates poorly;
- management governance/incentives improve while project opportunity set remains weak.

---

# H19 — D03-04 / D19-04 / D19-09

## Momentum family ownership
- D03-04 = within-security/time-series momentum continuation.
- D19-04 = cross-sectional momentum factor/rank.
- D19-09 = residual/factor-neutral momentum after neutralization.

## Anti-double-count
The same return history cannot automatically create three Alpha votes.

## Independent evidence gates
- D19-04 must be compared against D03-04 and prove cross-sectional/ranking semantics rather than relabeling raw momentum.
- D19-09 must prove residual signal after factor/market/industry neutralization.
- common-support, PIT, costs and capacity are mandatory.

## Maturity firewall
D03-04 and D19-04 L2 evidence does not promote D19-09 L0.

---

# H20 — D02-03 / D01-05 / D04-07

## Breakout evidence family
- D01-05 = price-structure breakout/failure lifecycle.
- D02-03 = volume confirmation.
- D04-07 = volatility/trend/breakout interaction.

## Anti-double-count
A single breakout episode is one event anchor.
Price structure, volume and volatility may become distinct evidence only if each contributes incremental information after conditioning on the others.

## Independent evidence gates
- D02-03 must outperform/modify the price-only breakout baseline.
- D04-07 must add state interaction beyond price+volume.
- failure cases must show when one component disagrees with the others.

---

## Specialist return standard

For H13-H20 each relevant room must return:
1. primitive evidence owner;
2. downstream transformation owner;
3. shared evidence ID/receipt plan;
4. divergent-state examples;
5. incremental-value test;
6. anti-double-count rule;
7. maturity implication;
8. terminal classification;
9. Formal Core unchanged confirmation.

## Current state

H13-H20 remain separate.
No retirement, count change or maturity change.
Formal Core remains LOCKED.
