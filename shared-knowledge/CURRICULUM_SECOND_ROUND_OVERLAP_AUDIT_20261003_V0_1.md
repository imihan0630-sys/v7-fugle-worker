# Curriculum Second-Round Overlap Audit 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: GOVERNANCE_SCAN_COMPLETE / SPECIALIST_VALIDATION_ROUTED
Scope: 354 active curriculum modules
Formal Core impact: NONE
Curriculum count impact: NONE — remains 22 domains / 354 modules

## Purpose

This audit is a governance-level duplicate/overlap screen, not specialist empirical research.

The 354 active modules were screened for:
1. name/semantic similarity;
2. common observable/data source;
3. common mechanism;
4. common decision use;
5. existing parent/child or producer/consumer dependency;
6. risk of duplicate evidence weighting;
7. anti-orphan requirements if a future merge is proposed.

A high textual similarity score alone is never sufficient for retirement.

## Result summary

- Immediate retirement: **NONE**
- Strong future merge candidates requiring specialist validation: **1 pair**
- Semantic split-or-merge candidates: **1 pair**
- Scope de-duplication candidate without full module retirement: **1 pair**
- High-overlap pairs retained with explicit owner boundaries: **13 pairs**
- Current curriculum remains **22 domains / 354 modules**
- No maturity upgrade, no Formal Core change and no new Hard Gate are authorized.

## Priority A — strong future merge candidate

### D15-21 <-> D15-22
- D15-21: Active Portfolio Diagnostics / Tracking Error / Active Share / Performance Attribution.
- D15-22: Risk Attribution / Information Ratio.
- Overlap concern: both are portfolio diagnostic/attribution layers, both explain active portfolio outcomes relative to a benchmark, and neither should independently vote on stock eligibility.
- Current D15-21 is already a MERGED_SCOPE_OWNER because D15-20 was absorbed into it.
- Governance view: **STRONG_MERGE_CANDIDATE_AFTER_VALIDATION**.
- Likely surviving owner if validated: D15-21, expanded to performance + risk attribution + Information Ratio.
- Must preserve: risk contribution decomposition, benchmark-relative risk, Information Ratio semantics, historical evidence and any machine/UI capability.
- Validation required before owner merge decision: show whether D15-22 has any distinct decision contract that cannot be represented as a child method/output of D15-21.
- Route: 10｜投組風控與交易執行研究室.

## Priority A — semantic split-or-merge candidate

### D07-17 <-> D21-12
- D07-17: Management Guidance Quality.
- D21-12: Management Guidance Credibility.
- Overlap concern: both can collapse to the same observable history of management guidance, revisions and realized outcomes.
- Required semantic split if both survive:
  - D07-17 owns **guidance content quality / forecast usefulness**: specificity, range width, revision behavior, forecast error, relation to operating/fundamental outcomes.
  - D21-12 owns **governance credibility / disclosure-behavior context**: repeated bias, consistency, incentive/conflict context, disclosure integrity and management trustworthiness.
- Governance view: **SEMANTIC_SPLIT_REQUIRED / MERGE_IF_SAME_OBSERVABLES**.
- If specialist research cannot establish independent observables or independent decision use, merge into one owner and retain governance context as a cross-domain dependency rather than a second vote.
- Route: 06｜基本面與估值研究室 + 14｜公司治理與內部人研究室.

## Priority A — scope de-duplication without full retirement

### D16-11 <-> D16-21
- D16-11: Data Provenance.
- D16-21: Alternative Data Provenance / Selection Bias.
- Generic provenance, first-known, versioning, replay and source lineage already belong to D16-11.
- D16-21 still has independent value for **alternative-data-specific selection/coverage bias, leakage, text/model drift and representativeness**.
- Governance view: **KEEP_BOTH / REMOVE_GENERIC_PROVENANCE_DUPLICATION**.
- D16-21 should consume D16-11 provenance primitives rather than re-own them.
- Route: 11｜統計驗證與策略市場狀態研究室.

## Priority B — retain with explicit owner boundary

### D05-08 <-> D14-08
- D05-08 owns odd-lot/round-lot **market mechanics, observability, queue/liquidity behavior**.
- D14-08 owns resulting **cost, slippage, fill and implementation consequences**.
- Decision: KEEP_BOTH / PRODUCER_CONSUMER_BOUNDARY.

### D05-06 <-> D14-14
- D05-06 owns opening-auction **matching rules and microstructure**.
- D14-14 owns auction/special-matching **execution cost and implementation quality**.
- Decision: KEEP_BOTH / PRODUCER_CONSUMER_BOUNDARY.

### D11-08 <-> D17-02
- D11-08 owns official material-event first-known clocks.
- D17-02 owns news/publication-source first-known clocks and capture latency.
- Generic clock/provenance semantics should reuse D16 governance primitives.
- Decision: KEEP_BOTH / SOURCE_FAMILY_BOUNDARY.

### D04-05 <-> D18-11
- D04-05 owns **volatility-specific** state transitions.
- D18-11 owns **composite market-regime** transitions across trend/range, volatility, breadth, rotation and risk-on/off.
- Decision: KEEP_BOTH / COMPONENT_TO_COMPOSITE_DEPENDENCY.

### D09-06 <-> D18-05
- D09-06 owns the observed sector-rotation phenomenon.
- D18-05 owns how a frozen sector-rotation state interacts with strategy performance/policy.
- Decision: KEEP_BOTH / STATE_TO_STRATEGY_INTERACTION.

### D17-08 <-> D20-10
- D17-08 owns **news-text/event sentiment** tied to publication clocks and event half-life.
- D20-10 owns broader **investor sentiment proxies** and behavioral interpretation subject to structural/microstructure counterfactuals.
- Decision: KEEP_BOTH_FOR_NOW / SEMANTIC_BOUNDARY_REQUIRED.
- D20-10 must not simply repackage D17-08 news sentiment as an independent behavioral vote.

### D07-23 <-> D16-23
- D07-23 owns corporate/fundamental forecast scenario and sensitivity analysis.
- D16-23 owns model/risk stress, reverse stress and distributional validation.
- Decision: KEEP_BOTH / OBJECT_MODEL_VS_VALIDATION_METHOD.

### D13-18 <-> D18-15
- D13-18 owns business-cycle measurement and first-known macro indicators.
- D18-15 owns strategy effectiveness conditional on a frozen business/credit-cycle state.
- Decision: KEEP_BOTH / MACRO_STATE_TO_STRATEGY_INTERACTION.

### D08-19 <-> D17-06
- D08-19 owns long-horizon market-implied expectations from valuation/pricing assumptions.
- D17-06 owns event/news consensus-versus-realization surprise.
- Decision: KEEP_BOTH / HORIZON_AND_SOURCE_BOUNDARY.

### D10-13 <-> D13-17
- D10-13 owns policy/geopolitical transmission through supply-chain, capacity, cost, lead time and issuer exposure.
- D13-17 owns macro financial conditions, cross-border capital-flow and broad-market transmission.
- Decision: KEEP_BOTH / TRANSMISSION_LAYER_BOUNDARY.

### D06-06 <-> D19-11
- D06-06 owns security/investor-position crowding and unwind risk.
- D19-11 owns factor-portfolio crowding, capacity and turnover.
- Decision: KEEP_BOTH / UNIT_OF_ANALYSIS_BOUNDARY.

### D01-08 <-> D04-03
- D04-03 owns volatility contraction as a primitive state.
- D01-08 owns VCP as a specific price-pattern lifecycle requiring additional structure and confirmation.
- Decision: KEEP_BOTH / PRIMITIVE_TO_PATTERN_DEPENDENCY.
- VCP must not double-count the same contraction evidence as a separate independent vote.

### D14-11 <-> D15-11
- D14-11 owns REDUCE -> RE-ADD friction/cost consequences.
- D15-11 owns the position lifecycle policy/state transition.
- Decision: KEEP_BOTH / COST_INPUT_TO_LIFECYCLE_POLICY.

### D05-05 <-> D05-12
- D05-05 owns observable order-flow imbalance.
- D05-12 owns adverse-selection/toxicity mechanism and risk.
- Decision: KEEP_BOTH / OBSERVABLE_INPUT_VS_LATENT_MECHANISM.
- Toxicity must not be inferred from OFI alone.

## False-positive similarity examples

The scan also produced lexically similar pairs that are not governance duplicates, such as:
- D07-05 free cash flow vs D08-07 FCF Yield;
- D06-05 ownership concentration vs D21-01 ownership/control structure;
- D19-07 low-volatility factor vs D19-08 idiosyncratic-volatility anomaly;
- D12-06 implied volatility vs D12-15 volatility risk premium / D12-16 volatility surface.

These remain separate because their object, transformation, mechanism or decision use differs materially.

## Specialist validation order

P1:
1. D15-21 vs D15-22 — room 10.
2. D07-17 vs D21-12 — rooms 06 + 14.
3. D16-11 vs D16-21 — room 11.

P2:
4. D17-08 vs D20-10 — rooms 08 + 13.
5. D05-08 vs D14-08 and D05-06 vs D14-14 — rooms 04 + 10.
6. D04-05 vs D18-11 — rooms 04 + 11.
7. D09-06 vs D18-05 — rooms 07 + 11.
8. D07-23 vs D16-23 — rooms 06 + 11.
9. D13-18 vs D18-15 — rooms 09 + 11.
10. D08-19 vs D17-06 — rooms 06 + 08.
11. D10-13 vs D13-17 — rooms 07 + 09.
12. D06-06 vs D19-11 — rooms 05 + 12.
13. D01-08 vs D04-03 — rooms 01 + 04.
14. D14-11 vs D15-11 — room 10.
15. D05-05 vs D05-12 — room 04.
16. D11-08 vs D17-02 — room 08.

## Merge acceptance rule

No pair may be merged merely because:
- names are similar;
- both use the same source;
- both correlate with the same outcome;
- one is currently L0;
- one is inconvenient to maintain.

A merge requires:
1. same or strictly subsumed semantic contract;
2. surviving owner can preserve all knowledge/functions;
3. no orphaned data/runtime/UI/replay responsibility;
4. no loss of useful falsification boundary;
5. no hidden change to selection/ranking/risk/execution;
6. explicit owner approval after specialist validation.

## Current decision

This audit changes no module count and performs no retirement.

Current canonical curriculum remains **22 domains / 354 modules**.
Formal Core remains LOCKED.
