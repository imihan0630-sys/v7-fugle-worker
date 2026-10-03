# Curriculum Third-Round Hidden Overlap Audit 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: GOVERNANCE_SCAN_COMPLETE / HIDDEN_OVERLAP_CANDIDATES_FROZEN
Scope: 354 active curriculum modules
Formal Core impact: NONE
Curriculum count impact: NONE

## Purpose

This third-round audit intentionally ignores superficial title similarity and instead searches for hidden duplication across:
- common data/source families;
- common latent mechanisms;
- common decision effects;
- producer/consumer chains;
- component/composite chains;
- event/mechanism/outcome layers;
- repeated use of the same evidence as multiple apparent votes.

This is governance work only. No specialist empirical conclusion is manufactured here.

## Summary

- Immediate retirement: **NONE**
- Strong consolidation candidates: **4 clusters**
- Semantic split-or-merge candidates: **4 clusters**
- Scope de-duplication candidates: **4 clusters**
- Keep-separate dependency chains requiring explicit anti-double-count rules: **8 clusters**
- Total hidden-overlap clusters frozen: **20**
- Curriculum remains **22 domains / 354 modules**
- Formal Core remains LOCKED

---

# A. Strong consolidation candidates

## H01 — D09-13 <-> D09-14
- D09-13 Industry Structure / Porter Five Forces.
- D09-14 Market Share / Entry Barrier / Substitution / Competitive Strategy.
- Both current learning scopes are materially the same: competition intensity, entry barriers, substitutes, market share, prices, capacity, margins, customers and suppliers.
- Governance view: **STRONG_MERGE_CANDIDATE_AFTER_VALIDATION**.
- Likely survivor: D09-13 expanded to "Industry Structure / Competitive Dynamics".
- Keep D09-14 separate only if it proves a distinct longitudinal/firm-strategy decision contract beyond the Porter/industry-structure family.
- Route: 07｜產業與供應鏈研究室.

## H02 — D14-03 + D14-04 -> D14-17 family
- D14-03 Signal Price vs Fill Price.
- D14-04 Slippage.
- D14-17 Implementation Shortfall / Market-impact Cost.
- D14-03 is a price-identity primitive; D14-04 is a derived execution metric; D14-17 is the broader implementation-shortfall/cost family.
- Governance view: **STRONG_CONSOLIDATION_CANDIDATE_AFTER_VALIDATION**.
- Possible survivor: D14-17 renamed to cover Signal-to-Fill / Slippage / Implementation Shortfall / Impact Cost.
- Mature D14-03/D14-04 evidence must not be lost or automatically transferred as maturity to unvalidated broader semantics.
- Route: 10｜投組風控與交易執行研究室.

## H03 — D15-13 <-> D15-24
- D15-13 Expected Shortfall / Tail Risk.
- D15-24 VaR / Parametric-Historical VaR.
- These are closely related tail-risk measurement methods used within the same portfolio-risk family.
- Governance view: **STRONG_MERGE_CANDIDATE_AFTER_VALIDATION** into a unified "VaR / Expected Shortfall / Tail Risk Measures" module if specialist work shows no distinct policy owner.
- Expected Shortfall must not be reduced to VaR; both metric semantics and their known failure modes must survive.
- Route: 10｜投組風控與交易執行研究室.

## H04 — D12-14 <-> D12-15
- D12-14 IV-RV Spread.
- D12-15 Volatility Risk Premium.
- The economic concept and its operational proxy can easily be double-counted.
- Governance view: **STRONG_SEMANTIC_CONSOLIDATION_CANDIDATE**.
- Keep separate only if D12-14 is explicitly an operational observable/proxy and D12-15 owns a distinct ex-ante economic premium concept with a different expectation contract.
- Same option-chain / realized-volatility evidence may not become two independent votes.
- Route: 09｜衍生品與國際總經研究室.

---

# B. Semantic split-or-merge candidates

## H05 — D07-25 <-> D21-10
- D07-25 Forensic Accounting Red Flags.
- D21-10 Audit / Restatement / Internal Control.
- Split requirement:
  - D07-25 = statement-level accounting anomaly/red-flag detection.
  - D21-10 = audit opinion, restatement event, internal-control weakness and governance/control process evidence.
- Governance view: **SEMANTIC_SPLIT_REQUIRED / MERGE_OR_NARROW_IF_SAME_EVIDENCE**.
- Route: 06｜基本面與估值研究室 + 14｜公司治理與內部人研究室.

## H06 — D20-06 <-> D06-06
- D20-06 Herding / Social Proof.
- D06-06 Crowding.
- D06-06 owns observable position/flow concentration and unwind risk.
- D20-06 may survive only if it has a behavior-specific observable/falsifier beyond the same holdings/flow/crowding data.
- Governance view: **SEMANTIC_SPLIT_REQUIRED / BEHAVIORAL_IDENTIFIABILITY_FIREWALL**.
- If herding is inferred only from crowding itself, D20-06 should be narrowed/merged rather than become a duplicate behavioral vote.
- Route: 05｜法人與籌碼研究室 + 13｜行為金融與市場心理研究室.

## H07 — D03-05 <-> D20-09
- D03-05 Pullback / Short-term Reversal.
- D20-09 Overreaction / Reversal.
- D03-05 owns the observable price phenomenon.
- D20-09 claims a behavioral mechanism.
- Governance view: **PHENOMENON_VS_CAUSE_SPLIT_REQUIRED**.
- D20-09 survives separately only with independent behavioral proxies/alternative-mechanism falsification; price reversal alone is insufficient.
- Route: 03｜技術指標與趨勢動能研究室 + 13｜行為金融與市場心理研究室.

## H08 — D17-11 / D20-11 / D09-11
- D17-11 Sector Propagation.
- D20-11 Narrative / Theme Diffusion.
- D09-11 Theme-stock <-> Formal-industry Bridge.
- Required split:
  - D09-11 = taxonomy/membership bridge.
  - D17-11 = event/news propagation across named firms/sectors.
  - D20-11 = behavioral narrative diffusion requiring attention/social/narrative evidence beyond event membership.
- Governance view: **THREE_WAY_SEMANTIC_SPLIT_REQUIRED**.
- If D20-11 is only renamed event propagation or D09 theme mapping, it becomes merge/narrowing eligible.
- Route: 07｜產業與供應鏈研究室 + 08｜事件與新聞研究室 + 13｜行為金融與市場心理研究室.

---

# C. Scope de-duplication candidates

## H09 — D16-19 <-> D16-25
- D16-19 Machine Learning / Calibration.
- D16-25 Probabilistic Decision / Bayesian Updating / Uncertainty-aware Selection.
- Frozen split:
  - D16-19 = model-estimation/calibration methods and model validation.
  - D16-25 = decision-level calibrated probability, utility, uncertainty, ABSTAIN and evidence-role integration.
- Governance view: **KEEP_BOTH / REMOVE_CALIBRATION_OWNERSHIP_DUPLICATION**.
- D16-25 consumes calibrated model outputs; D16-19 does not own the portfolio/selection decision utility layer.
- Route: 11｜統計驗證與策略市場狀態研究室.

## H10 — D17-04 + D17-05 <-> D10-12
- D17-04 direct beneficiary/victim.
- D17-05 indirect / second-order supply-chain transmission.
- D10-12 industry-specific transmission / issuer exposure mapping.
- Frozen split:
  - D10-12 = durable structural issuer-exposure map.
  - D17-04/05 = event-specific attribution using the structural map plus event clock and surprise.
- Governance view: **KEEP / SCOPE_DEDUP_ONLY**.
- News/event modules must consume D10-12 exposure evidence rather than recreate the same issuer-exposure logic as separate votes.
- Route: 07｜產業與供應鏈研究室 + 08｜事件與新聞研究室.

## H11 — D12-07 <-> D12-16
- D12-07 simple Skew / Term Structure.
- D12-16 full Volatility Surface / Smile.
- Existing derivatives research already requires the complex surface to be compared with simpler D12-07 features on the same parent rows.
- Governance view: **KEEP_SEPARATE_FOR_NOW / BASELINE_VS_COMPLEX_SURFACE**.
- D12-07 acts as interpretable baseline; D12-16 may justify separate existence only through residual surface shape/curvature information after D12-07 controls.
- If complex-surface outputs collapse to the same skew/term information, merge/narrow later.
- Route: 09｜衍生品與國際總經研究室.

## H12 — D06-09 / D06-18 / D14-19 / D20-13
- D06-09 = observed borrowing / actual securities-lending short-sale stock/flow.
- D06-18 = borrow fee / availability / utilization economics.
- D14-19 = ability to establish, maintain and exit a short; recall/forced buy-in/squeeze execution.
- D20-13 = theoretical limits-to-arbitrage/noise-trader risk.
- Governance view: **KEEP_ALL / FOUR_LAYER_SHORTING_CHAIN / SCOPE_DEDUP_ONLY**.
- This extends the earlier three-layer freeze by explicitly inserting D06-09 as the observed position/flow layer.
- The same borrowing data cannot be counted four times.
- Route: 05｜法人與籌碼研究室 + 10｜投組風控與交易執行研究室 + 13｜行為金融與市場心理研究室.

---

# D. Keep-separate dependency chains with explicit anti-double-count rules

## H13 — D07-06 <-> D22-03
- D07-06 = accounting balance-sheet/leverage quality.
- D22-03 = net debt/leverage structure in a credit/funding-risk context.
- Decision: **KEEP_SEPARATE / ACCOUNTING_INPUT_TO_CREDIT_STRUCTURE**.
- D22-03 must prove information beyond simple D07 accounting leverage and must not become a second leverage vote using the same ratios.

## H14 — D06-11 <-> D11-14
- D06-11 = passive fund/index flow and rebalancing measurement.
- D11-14 = index adjustment event lifecycle and event-time passive-flow impact.
- Decision: **KEEP_SEPARATE / EVENT_TO_FLOW_CHAIN**.
- D11 owns event identity/announcement/effective clocks; D06 owns flow/stock measurement. One rebalance cannot create two independent directional votes.

## H15 — D11-10 / D04-09 / D17-12
- D11-10 = overnight event-gap risk.
- D04-09 = tail/gap volatility risk as a distribution/risk state.
- D17-12 = post-event gap/continuation/reversal outcome dynamics.
- Decision: **KEEP_SEPARATE / EVENT_RISK_TO_VOLATILITY_TO_POST_EVENT_PATH**.
- Same gap observation must be assigned once to event identity and then analyzed through separate risk/outcome roles, not triple-counted.

## H16 — D05-02 / D11-11 / D01-09 / D04-10
- D05-02 = exchange price-limit mechanics.
- D11-11 = multi-day exit risk caused by limits.
- D01-09 = observable pattern/gap semantics under limit constraints.
- D04-10 = volatility-estimator pollution from limits.
- Decision: **KEEP_SEPARATE / FOUR_LAYER_PRICE_LIMIT_CHAIN**.
- One limit event is a shared primitive, not four independent signals.

## H17 — D07-18 / D22-04 / D13-06
- D13-06 = sovereign/risk-free rate curve input.
- D22-04 = issuer debt cost/refinancing spread/risk.
- D07-18 = enterprise WACC/cost-of-capital composite.
- Decision: **KEEP_SEPARATE / COMPOSITIONAL_COST_OF_CAPITAL_CHAIN**.
- A rate shock must not be re-counted as independent evidence at all three layers without residualization.

## H18 — D07-19 <-> D21-07
- D07-19 = project/capital-budget economics (NPV/IRR/real options).
- D21-07 = management incentives and observed capital-allocation quality.
- Decision: **KEEP_SEPARATE / PROJECT_ECONOMICS_VS_MANAGEMENT_DECISION_QUALITY**.
- D21-07 evaluates decision quality/incentives/outcomes, not the same NPV calculation a second time.

## H19 — D03-04 / D19-04 / D19-09
- D03-04 = time-series/within-security momentum continuation.
- D19-04 = cross-sectional momentum factor.
- D19-09 = residual/factor-neutral momentum.
- Decision: **KEEP_SEPARATE / MOMENTUM_FAMILY_ANTI_DOUBLE_COUNT**.
- The same return history cannot generate three independent Alpha votes; D19-04 must be compared to D03, and D19-09 must prove residual information after factor neutralization.

## H20 — D02-03 / D01-05 / D04-07
- D01-05 = breakout/failure price-structure lifecycle.
- D02-03 = breakout volume confirmation.
- D04-07 = volatility interaction with trend/breakout.
- Decision: **KEEP_SEPARATE / MULTI-EVIDENCE_BREAKOUT_FAMILY**.
- These may be combined as orthogonal evidence only after proving each component adds incremental information; one breakout episode is not automatically three votes.

---

## Priority routing

### P3-A — strongest consolidation/retirement potential
1. D09-13 vs D09-14 — room 07.
2. D14-03 + D14-04 vs D14-17 — room 10.
3. D15-13 vs D15-24 — room 10.
4. D12-14 vs D12-15 — room 09.

### P3-B — identifiability / duplicate narrative risk
5. D07-25 vs D21-10 — rooms 06 + 14.
6. D20-06 vs D06-06 — rooms 13 + 05.
7. D03-05 vs D20-09 — rooms 03 + 13.
8. D17-11 / D20-11 / D09-11 — rooms 08 + 13 + 07.
9. D16-19 vs D16-25 — room 11.
10. D17-04/05 vs D10-12 — rooms 08 + 07.

### P3-C — dependency-chain / anti-double-count normalization
11. D12-07 vs D12-16 — room 09.
12. D06-09 / D06-18 / D14-19 / D20-13 — rooms 05 + 10 + 13.
13. D07-06 vs D22-03 — rooms 06 + 15.
14. D06-11 vs D11-14 — rooms 05 + 08.
15. D11-10 / D04-09 / D17-12 — rooms 08 + 04.
16. D05-02 / D11-11 / D01-09 / D04-10 — rooms 04 + 08 + 01.
17. D07-18 / D22-04 / D13-06 — rooms 06 + 15 + 09.
18. D07-19 vs D21-07 — rooms 06 + 14.
19. D03-04 / D19-04 / D19-09 — rooms 03 + 12.
20. D02-03 / D01-05 / D04-07 — rooms 02 + 01 + 04.

## Specialist evidence packet minimum

For any candidate seeking a merge/narrowing decision:
1. semantic ownership matrix;
2. exact shared vs unique observables;
3. source/clock/universe/unit identity;
4. decision-role/output comparison;
5. at least one divergent-state example;
6. anti-double-count rule;
7. competing-mechanism/falsification tests;
8. capability-preservation inventory;
9. proposed survivor and renamed scope if applicable;
10. confirmation that Formal behavior is unchanged.

## Current governance decision

No module is retired in this audit.

All 20 hidden-overlap clusters are routed for specialist validation or explicit boundary preservation.

Current canonical curriculum remains **22 domains / 354 modules**.
Current maturity remains unchanged by this audit.
Formal Core remains LOCKED.
