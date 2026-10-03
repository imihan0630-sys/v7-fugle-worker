# Curriculum Coverage-A Specialist Validation Packets 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: READY_FOR_SPECIALIST_EXECUTION
Parent audit:
`shared-knowledge/CURRICULUM_COVERAGE_AUDIT_20261003_V0_1.md`

Scope: Coverage-A high-priority candidates only.
Formal Core impact: NONE.
Curriculum module-count impact: NONE.
Maturity impact: NONE until normal specialist maturity gates independently support a change.

These packets validate whether a coverage candidate is a true missing module, a scope extension, a merge target, not a gap, or evidence-insufficient. Specialist rooms do not have authority to alter the canonical 354-module curriculum.

## Global return contract

Every packet must return all of the following:

1. Exact Knowledge Definition（精確知識定義）
2. Existing-module Overlap Matrix（既有模組重疊矩陣）
3. Why Current Scope Is Insufficient（目前課綱不足之處）
4. Taiwan Data Feasibility（台灣資料可行性）
5. PIT / Replay Implication（時點一致性／重播影響）
6. Decision Role（explanatory / validation / context / supportive / strategy evidence）
7. Anti-double-count Rule（防重複計票）
8. Proposed Owner（正式主責）
9. Maturity Starting Point（新增模組原則 L0；scope extension 不自動繼承較高成熟度）
10. Terminal Recommendation（終局建議），且只能是：
   - ADD_MODULE
   - EXTEND_EXISTING_SCOPE
   - MERGE_INTO_EXISTING
   - NOT_A_GAP
   - EVIDENCE_INSUFFICIENT

Mandatory evidence discipline:
- include positive mechanism and explicit falsification/counterevidence;
- distinguish current research existence from active curriculum ownership;
- define first-known timestamp and missing-data UNKNOWN semantics where applicable;
- do not infer investor intent from residual accounting alone;
- same-source re-expression cannot count as independent evidence;
- no Formal Core change;
- no module-count change;
- no maturity promotion solely from naming/scope cleanup.

## Packet COV-01 — 01｜K線與型態研究室

Candidate:
D01 — Continuation / Base Pattern Family（延續／基地型態家族）

Current class:
ACTIVE_CURRICULUM_OWNER_GAP

Existing likely neighbors:
- D01-05 突破／假突破生命週期
- D01-07 杯柄／碗型／底部基地
- D01-08 VCP 波動收斂型態
- named-pattern governance / System2 pattern research

Required validation:
1. Define an umbrella continuation/base-pattern ontology without creating one module per named pattern.
2. Build overlap matrix across flag, pennant, triangle, wedge, platform, high-tight-flag, cup/base and VCP semantics.
3. Test whether D01-07 can naturally absorb continuation/base families without becoming semantically incoherent.
4. Test whether D01-05 owns only breakout lifecycle and therefore cannot fully own pre-breakout base geometry.
5. Define observable geometry, confirmation point, failure state and replay-safe labeling; hindsight visual recognition is forbidden.
6. Separate morphology from breakout confirmation, volume confirmation and volatility contraction.
7. Identify unique data/decision contract, if any, that justifies a new umbrella module.
8. Return anti-double-count rules versus D01-05/D01-07/D01-08 and D02/D04 dependencies.

Preferred burden of proof:
EXTEND_EXISTING_SCOPE unless a distinct umbrella owner materially improves ownership clarity and has a unique validation contract.

## Packet COV-02 — 04｜波動與市場微結構研究室

Candidate:
D05 — Closing Auction / Auction Imbalance（收盤集合競價／集合競價不平衡）

Current class:
SCOPE_EXTENSION_CANDIDATE

Primary neighbor:
- D05-06 Opening Auction

Required validation:
1. Compare opening and closing auction mechanisms, matching rules, information sets and order-imbalance observables.
2. Verify Taiwan exchange source coverage and whether closing-auction imbalance is historically observable or only partially reconstructable.
3. Define first-known clock and whether indicative price/volume/imbalance exists before close.
4. Separate auction-price formation from generic end-of-day volume spikes and continuous-session microstructure.
5. Test whether one expanded Opening / Closing Auction & Auction Imbalance owner is semantically coherent.
6. Identify any closing-only execution/benchmark/contamination capability that would be orphaned by scope extension.
7. Freeze anti-double-count rules versus D14 execution-quality modules and D11 event clocks.

Preferred burden of proof:
EXTEND_EXISTING_SCOPE to D05-06 unless a distinct closing-auction data/replay contract is demonstrated.

## Packet COV-04 — 06｜基本面與估值研究室

Candidate:
D07 — Dividend / Payout Policy & Sustainability（股利／配發政策與永續性）

Current class:
TRUE_GAP_CANDIDATE

Boundary neighbors:
- D11 dividend event mechanics
- D21 capital-allocation governance
- D07 earnings / cash-flow / balance-sheet fundamentals

Required validation:
1. Define payout ratio, cash-dividend coverage, free-cash-flow coverage, retention ratio, payout stability and sustainability.
2. Distinguish board/shareholder-meeting/ex-date/event mechanics from fundamental sustainability.
3. Distinguish governance capital-allocation quality from accounting/earnings capacity to sustain payouts.
4. Identify Taiwan statement/disclosure sources and exact vintage clocks.
5. Define treatment of stock dividends, special dividends, negative earnings, cyclical earnings and one-off cash distributions.
6. Test whether existing D07 modules can absorb this family without losing a clear owner.
7. Define explanatory versus strategy-evidence roles; high dividend yield alone is not sufficient.
8. Freeze anti-double-count rules with D08 valuation and D21 governance.

Burden of proof:
ADD_MODULE is allowed only if no existing D07 owner can preserve the full sustainability capability cleanly.

## Packet COV-06 — 07｜產業與供應鏈研究室

Candidate:
D10 — Supply-chain Network Centrality / Single-point Failure / Resilience（供應鏈網路中心性／單點失效／韌性）

Current class:
SCOPE_EXTENSION_CANDIDATE

Primary neighbors:
- D10-01 supply-chain map
- D10-12 issuer exposure / transmission-related scope

Required validation:
1. Define graph nodes/edges, direction, weight, time-varying supplier/customer relationships and alternate-source semantics.
2. Distinguish simple supply-chain mapping from network centrality, bottleneck criticality, single-point failure and resilience.
3. Test whether Taiwan public disclosures support effective-dated graph construction at useful coverage.
4. Define UNKNOWN when supplier/customer percentages or alternate sources are not disclosed.
5. Specify centrality/resilience metrics only if they are economically interpretable and replayable.
6. Test whether topology metrics add information beyond concentration ratios, issuer exposure and qualitative bottleneck labels.
7. Provide failure cases where centrality appears high but substitution makes economic risk low, and vice versa.
8. Freeze anti-double-count rules with D07 concentration, D09 industry structure and D17 event propagation.

Preferred burden of proof:
EXTEND_EXISTING_SCOPE unless network topology proves a distinct durable data/decision contract.

## Packet COV-07 — 09｜衍生品與國際總經研究室

Candidate:
D12 — Futures Term Structure / Calendar Spread / Roll Yield（期貨期限結構／跨月價差／轉倉收益）

Current class:
TRUE_GAP_CANDIDATE

Existing neighbors:
- futures basis
- open interest
- expiry
- options term structure

Required validation:
1. Define futures curve by contract tenor, calendar spread, annualized carry/roll yield and expiry-transition semantics.
2. Separate spot-futures basis from inter-contract curve shape.
3. Define continuous-contract construction without look-ahead or back-adjustment leakage.
4. Verify TAIFEX historical contract-level prices/OI/volume and expiry calendars with PIT/replay feasibility.
5. Define near-expiry liquidity/price-limit/session contamination.
6. Test whether curve information has explanatory/context value independent of basis and OI.
7. Distinguish hedging pressure/carry interpretation from causal claims.
8. Freeze anti-double-count rules with D13 macro/carry context and options term-structure modules.

Burden of proof:
ADD_MODULE only if contract-level historical curve and replay contract are feasible; otherwise EVIDENCE_INSUFFICIENT or scope extension.

## Packet COV-10 — 13｜行為金融與市場心理研究室

Candidate:
D20 — Belief-updating Bias umbrella（信念更新偏誤傘狀模組）
covering Confirmation Bias / Belief Perseverance / Conservatism

Current class:
TRUE_GAP_CANDIDATE

Existing neighbors:
- prospect theory
- disposition effect
- overconfidence
- anchoring
- representativeness
- herding
- attention

Required validation:
1. Define confirmation bias, belief perseverance and conservatism as distinct mechanisms under one belief-updating family.
2. Build overlap matrix versus anchoring, representativeness, attention and overconfidence.
3. Require observable behavioral proxies; price action alone cannot prove a psychological mechanism.
4. Identify Taiwan data candidates such as analyst revisions, forecast dispersion, attention/search/news consumption, order behavior or survey/experimental evidence, with source limitations.
5. Define structural/microstructure counterfactuals that can explain the same price pattern without psychology.
6. Specify whether the module is explanatory/validation/context rather than direct strategy evidence.
7. Prevent three named biases from becoming three correlated votes.
8. Return whether one umbrella module is warranted or existing D20 scope can absorb it.

Burden of proof:
Prefer one umbrella owner if a genuine owner gap exists; never create separate modules for each named bias without distinct data contracts.

## Packet COV-11 — 14｜公司治理與內部人研究室

Candidate:
D21 — Shareholder Rights / Stewardship / Activism / Voting（股東權利／盡職治理／股東行動／表決）

Current class:
TRUE_GAP_CANDIDATE

Boundary neighbors:
- D11 tender/proxy/event mechanics
- D21 ownership/board/insider/control-quality modules

Required validation:
1. Define shareholder-rights architecture, voting rights, meeting proposals, proxy voting, stewardship codes and activism.
2. Separate recurring governance rights from one-off tender/proxy event mechanics.
3. Map Taiwan sources: company bylaws/articles where public, MOPS meeting notices/materials/minutes, voting results, stewardship disclosures and institutional voting/stewardship reports.
4. Define PIT clocks for agenda publication, proposal changes, voting results and stewardship disclosures.
5. Distinguish formal rights from actual control concentration and board structure.
6. Identify measurable mechanisms and avoid normative scoring without evidence.
7. Define capability boundaries versus minority-shareholder risk and related-party governance.
8. Freeze anti-double-count rules with D06 ownership flow and D11 events.

Burden of proof:
ADD_MODULE only if rights/stewardship/voting form a durable capability not cleanly owned by existing D21 modules.

## Packet COV-12 — 15｜信用市場與資本結構研究室

Candidate:
D22 — Debt Seniority / Collateral / Recovery Waterfall（債務順位／擔保／回收瀑布）

Current class:
SCOPE_EXTENSION_CANDIDATE

Primary neighbors:
- D22-07 Covenant / Default
- D22-12 Distress / Recovery

Required validation:
1. Define secured/unsecured/subordinated ranking, collateral package, guarantees, structural subordination and recovery waterfall.
2. Distinguish contractual default triggers from post-default claim priority/recovery allocation.
3. Verify Taiwan issuer-level data availability across bond prospectuses, loan disclosures, guarantees/collateral notes, court/restructuring records and rating materials.
4. Define PIT and document-vintage semantics for debt terms and amendments.
5. Test whether instrument-level granularity is sufficient to support a distinct owner.
6. Define UNKNOWN where private bank-loan ranking/collateral is not disclosed.
7. Test incremental explanatory value beyond leverage, covenant/default and generic distress-recovery modules.
8. Freeze anti-double-count rules with D07 balance-sheet leverage and D21 pledging/control.

Preferred burden of proof:
EXTEND_EXISTING_SCOPE to D22-12/D22-07 unless instrument-level data and recovery mechanics justify a distinct module.

## Control-plane handoff

00｜研究總控室 performs intake only after a specialist return is committed.

For any return recommending ADD_MODULE or EXTEND_EXISTING_SCOPE, 00 must still perform:
Dependency Audit
→ overlap recheck
→ anti-orphan capability audit
→ owner approval
→ atomic tracker/map/router update.

Until then:
- domains remain 22;
- active modules remain 354;
- no 23rd domain is authorized;
- Formal Core remains LOCKED.
