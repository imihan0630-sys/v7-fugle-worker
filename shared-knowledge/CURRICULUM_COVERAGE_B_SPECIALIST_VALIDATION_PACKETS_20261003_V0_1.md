# Curriculum Coverage-B Specialist Validation Packets 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: READY_FOR_SPECIALIST_EXECUTION
Parent audit: `shared-knowledge/CURRICULUM_COVERAGE_AUDIT_20261003_V0_1.md`

Scope: Coverage-B medium-priority candidates only.
Formal Core impact: NONE.
Curriculum module-count impact: NONE.
Maturity impact: NONE.

## Global return contract

Each specialist return must provide:
1. Exact Knowledge Definition（精確知識定義）
2. Existing-module Overlap Matrix（既有模組重疊矩陣）
3. Why Current Scope Is Insufficient（現有範圍不足原因）
4. Taiwan Data Feasibility（台灣資料可行性）
5. PIT / Replay Implication（時點一致性／重播影響）
6. Decision Role（決策角色）: explanatory / validation / context / supportive / strategy evidence
7. Anti-double-count Rule（防重複計算規則）
8. Proposed Owner（建議主責）
9. Maturity Starting Point（成熟度起點）; any new module normally starts L0
10. exactly one terminal recommendation:
`ADD_MODULE`, `EXTEND_EXISTING_SCOPE`, `MERGE_INTO_EXISTING`, `NOT_A_GAP`, or `EVIDENCE_INSUFFICIENT`.

Specialist rooms may not change canonical module count.

## COV-03 — 05｜法人與籌碼研究室

Candidate: D06 — Retail / Individual Investor Flow（散戶／自然人資金流）
Current class: `TRUE_GAP_CANDIDATE`

Required validation:
1. Define what qualifies as directly observed retail/individual flow versus residual inference.
2. Inventory Taiwan public or licensed sources for investor-type buy/sell, account class, order-size or comparable proxies and their historical availability.
3. Freeze first-known/PIT clocks, revision semantics and market coverage.
4. Test whether total turnover minus institutional categories can identify retail flow; residual arithmetic alone must not imply investor identity or motive.
5. Separate retail participation, retail direction, retail crowding and behavioral interpretation.
6. Test overlap with D06 institutional flow, margin financing, securities lending and ETF/passive flow.
7. Define UNKNOWN when investor identity is not observable.
8. Establish whether the capability is explanatory/contextual or can support strategy evidence.

Burden of proof: `ADD_MODULE` only with durable, PIT-safe Taiwan observability. Otherwise `EVIDENCE_INSUFFICIENT` or clean scope absorption.

Expected return: `research/COV03_D06_SPECIALIST_RETURN_V0_1.md`

## COV-05 — 06｜基本面與估值研究室

Candidate: D08 — Sales-based / Enterprise Multiples（營收型／企業價值倍數；例如 P/S、EV/Sales）
Current class: `SCOPE_EXTENSION_CANDIDATE`

Required validation:
1. Define P/S, EV/Sales and related enterprise/sales multiples with numerator/denominator timing.
2. Compare ownership with D08-02 and D08-06 and other valuation-multiple modules.
3. Define enterprise value construction for Taiwan issuers, including debt, cash, preferred/non-common claims where relevant.
4. Define trailing/forward sales, fiscal-period alignment, restatement and first-known clocks.
5. Test sector usefulness and failure cases: financials, cyclicals, negative margins, acquisition-heavy issuers and structurally different gross-margin models.
6. Prevent P/S and EV/Sales from becoming correlated duplicate votes.
7. Separate valuation description from expected-return evidence.
8. Determine whether broadening an existing valuation-multiple owner preserves a clean ontology.

Preferred burden: `EXTEND_EXISTING_SCOPE` or `MERGE_INTO_EXISTING`; standalone `ADD_MODULE` requires distinct durable validation needs.

Expected return: `research/COV05_D08_SPECIALIST_RETURN_V0_1.md`

## COV-08 — 11｜統計驗證與策略市場狀態研究室

Candidate: D16 — Dependence-aware Resampling / Block Bootstrap（依賴結構重抽樣／區塊自助法）
Current class: `SCOPE_EXTENSION_CANDIDATE`

Required validation:
1. Define IID bootstrap failure under serial/cross-sectional dependence.
2. Define moving-block, stationary, circular or date-cluster resampling only to the extent needed by the research contract.
3. Compare with D16-06 Independent-Date / Date-cluster Inference and existing OOS/statistical validation capabilities.
4. Specify block-length selection, effective sample size and uncertainty reporting.
5. Define panel/cross-sectional dependence handling without pseudo-replication.
6. Test small-sample and regime-change failure cases.
7. Specify which claims require dependence-aware resampling versus simpler cluster-robust inference.
8. Freeze anti-double-count rules: multiple resampling variants are validation methods, not multiple evidence votes.

Preferred burden: absorb into D16-06 unless a distinct validation capability cannot be represented there.

Expected return: `research/COV08_D16_SPECIALIST_RETURN_V0_1.md`

## COV-09 — 12｜資產定價與因子研究室

Candidate: D19 — Multi-factor Benchmark Models（多因子基準模型；Fama-French、Carhart、q-style 等）
Current class: `SCOPE_EXTENSION_CANDIDATE`

Required validation:
1. Define benchmark-model purpose: risk adjustment, alpha attribution, spanning and omitted-factor diagnostics.
2. Compare ownership with D19-01 and D19-10 and existing factor construction/evaluation modules.
3. Define Taiwan factor-universe, weighting, rebalance, delisting, corporate-action and PIT requirements.
4. Distinguish imported academic factor definitions from Taiwan-reconstructed benchmarks.
5. Test whether factor-model families are benchmarks rather than separate strategy votes.
6. Specify multicollinearity, model-selection, multiple-testing and unstable-loading diagnostics.
7. Define when US-origin factor evidence is contextual rather than directly representative of Taiwan.
8. Determine whether benchmark construction needs an independent durable owner or an extension of existing factor modules.

Preferred burden: `EXTEND_EXISTING_SCOPE` / `MERGE_INTO_EXISTING`; `ADD_MODULE` only if benchmark construction has a distinct reproducible validation contract.

Expected return: `research/COV09_D19_SPECIALIST_RETURN_V0_1.md`

## Control-plane handoff

00｜研究總控室 performs intake only after a specialist return is committed.
Any structural recommendation still requires:
Dependency Audit（依賴審查） → overlap recheck（重疊複查） → anti-orphan（防能力孤兒） → owner approval（主責核准） → atomic canonical update（原子式正式更新）.

Until then:
- 22 domains remain unchanged;
- 354 active modules remain unchanged;
- no 23rd domain is authorized;
- Formal Core remains LOCKED.
