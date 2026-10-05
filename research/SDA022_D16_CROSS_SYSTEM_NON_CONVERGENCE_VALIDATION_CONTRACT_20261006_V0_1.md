# SDA-022｜D16 跨 System1 / System2 非收斂、依賴與增量驗證契約 V0.1

更新：2026-10-06 Asia/Taipei  
狀態：RESEARCH_ONLY / D16_VALIDATION_CONTRACT_FROZEN / ENGINEERING_HANDOFF_READY / NO_MATURITY_CHANGE  
主責驗證：11｜統計驗證與策略市場狀態研究室 / D16  
架構 Owner：00｜研究總控室  
工程 Owner：System1 + System2  
Formal Core impact：NONE  
上位守則：`shared-knowledge/SYSTEM1_SYSTEM2_NON_CONVERGENCE_GUARD_V0_1.md`

## 1. D16 驗證問題

SDA-022 不問：
> 兩套系統是否常常選不同股票？

真正要問三件不同的事：

1. **Architectural executability independence**
   - System2 是否至少有一條候選生成／策略評估路徑，不依賴 System1 Top6 / rank output 才能運作？
   - System1 Formal 是否在移除 System2 outputs 後仍維持既有決策？

2. **Information dependence**
   - 兩套系統用了多少相同 primitive / factor-family / source / universe / gate roots？
   - 同一資訊是否只是換名稱後被當成第二份證據？

3. **Incremental decision information**
   - 在相同 target / horizon / comparable decision support 上，知道第二套系統的 state / score / membership 後，是否真的改善對 outcome 的 OOS prediction / decision loss？
   - 這才是「第二套確認資訊是否有增量」的統計問題。

三者不得互相替代。

## 2. Independence taxonomy

### A. `ARCHITECTURALLY_DISTINCT`

要求：
- policy lineage 不同；
- System2 至少一條 authorized strategy candidate path 能在不消費 System1 rank/Top6 的情況下產生合法 strategy-local state；
- System1 不消費 System2 strategy output 作為 Formal prerequisite；
- 無 silent gate/ranking mutation。

這只證明架構上不是 wrapper。

### B. `INFORMATIONALLY_OVERLAPPING`

如果共享：
- same raw market source；
- same OHLCV primitive；
- same issuer fundamentals；
- same D01-D22 semantic facts；
這不一定是問題。

共享真實資訊本來就應共用，不必為了看起來獨立而重造資料。

但 sharedInformationRootRatio / sharedHardGateRatio 必須可觀測。

### C. `STATISTICALLY_INCREMENTAL`

只有在：
- target/horizon/decision clock可比較；
- common support足夠；
- PIT / provenance / outcome footprint合法；
- dependence-aware D16 inference ready；
- fresh OOS / prospective evidence存在

時才可以評估。

Architecture distinct 不自動等於 statistically incremental。

## 3. Policy fingerprint contract

### System1 fingerprint

至少：
- `systemId=SYSTEM1`;
- `policyVersion`;
- `formalGenerationId`;
- `decisionAt`;
- `universeDefinitionHash`;
- `eligibleUniverseDigest`;
- `hardGateLineageHash`;
- `rankingPolicyHash`;
- `informationRootSetHash`;
- `informationRoots`;
- `selectedSymbolsDigest`;
- `selectedCount`;
- `formalPolicyReceiptHash`.

### System2 strategy fingerprint

每一 strategy 分開：
- `systemId=SYSTEM2`;
- `strategyId`;
- `strategyVersion`;
- `policyId`;
- `policyVersion`;
- `decisionAt`;
- `candidateUniverseDefinitionHash`;
- `candidateUniverseDigest`;
- `discoveryPathHash`;
- `consumedSystem1Output=false/true`;
- `requiredEvidenceFamilies`;
- `hardGateLineageHash`;
- `rankingPolicyHash`;
- `informationRootSetHash`;
- `informationRoots`;
- `activeSymbolsDigest`;
- `activeCount`;
- `capacityPolicyHash`;
- `strategyPolicyReceiptHash`.

System2 不能把不同 strategies 合成一個 universal fingerprint 後宣稱整個系統獨立。

## 4. Comparable-date pair receipt

每一可比較 decision date 產生 immutable pair receipt：

- `pairReceiptId`;
- `decisionDate`;
- `system1FingerprintRef`;
- `system2StrategyFingerprintRef`;
- `clockAlignmentState`;
- `targetCompatibilityState`;
- `horizonCompatibilityState`;
- `universeRelationshipState`;
- `candidateUniverseOverlap`;
- `selectedSetJaccard`;
- `commonSupportN`;
- `commonSupportRankCorrelation` when meaningful;
- `sharedInformationRootRatio`;
- `sharedHardGateRatio`;
- `system2IndependentDiscoveryN`;
- `system2IndependentDiscoveryRate`;
- `system1OnlyPickN`;
- `system2OnlyPickN`;
- `overlapPickN`;
- divergence reason counts;
- `outcomeFootprintRef`;
- `sda016ConsumptionRef`.

No arbitrary threshold is frozen in V0.1.

## 5. Output overlap is descriptive, not the independence verdict

### High overlap

Possible interpretations:
- same market truth independently leads both policies to same symbol；
- shared primitives dominate both systems；
- System2 secretly consumes System1 output；
- both policies are exposed to same latent factor。

Therefore high Jaccard alone cannot choose among them.

### Low overlap

Possible interpretations:
- genuine objective/horizon differences；
- capacity differences；
- forced disagreement；
- different missingness；
- different universes；
- random/noisy selection。

Therefore low Jaccard alone is not evidence of diversification.

No pass/fail Jaccard cutoff is authorized.

## 6. Rank correlation

Only calculate common-support rank correlation when:
- both systems genuinely rank the same comparable objects；
- rank semantics are monotone/comparable；
- common support is not outcome-selected；
- ties / partial orders are handled explicitly。

System2 RANK-01 currently uses strategy-local Pareto tiers.
Do not coerce a partial order into a fake exact scalar rank merely to compute Pearson/Spearman.

Allowed:
- comparable ordinal tier analysis；
- pairwise dominance/concordance；
- rank correlation only when a legitimate total-order projection already exists before outcome inspection。

## 7. Information-root dependence

`sharedInformationRootRatio` is a provenance diagnostic, not an automatic penalty.

Example：
System1 and System2 both use the same official close.
This should count as one shared information root, but should not be duplicated just to manufacture independence.

Need report:
- root overlap；
- root-specific policy transformation；
- whether shared root enters a hard gate；
- whether one system's output is itself an input root to the other。

Strongest dependency state：
`DIRECT_CROSS_SYSTEM_DECISION_OUTPUT_CONSUMPTION`.

If System2 uses System1 Top6/rank as mandatory parent:
`INDEPENDENT_DISCOVERY_NOT_PROVEN`.

## 8. Incrementality estimand

### 8.1 Same-target conditional information test

Only when both policies can be mapped to the same pre-registered target/horizon.

Baseline:
`Outcome ~ System1 information state`

Challenger:
`Outcome ~ System1 information state + System2 strategy state`

and symmetrically:

`Outcome ~ System2 strategy state`

vs

`Outcome ~ System2 strategy state + System1 state`.

The exact statistical model is NOT frozen by this contract.
D16-19 / D16-06 owns method choice and dependence-aware inference.

Primary requirement:
- same target；
- same date weighting；
- same matured outcome set；
- same cost semantics if economic outcome；
- same PIT cutoff；
- same common-support population。

If adding System2 improves only row-weighted but not date-balanced OOS loss:
no standalone incremental claim.

### 8.2 Pick-source descriptive decomposition

Always report, when support exists:
- overlap subset；
- System1-only；
- System2-only；
- neither / eligible control where defined。

But raw performance difference across these groups is **not causal incrementality** because membership is selected by different policies.

Label:
`DESCRIPTIVE_SELECTION_DECOMPOSITION`.

### 8.3 Diversification claim

A diversification claim needs strategy-return/exposure semantics, not just pick overlap.

At minimum:
- aligned strategy return series；
- exposure / capital normalization；
- cost parity；
- downside co-movement；
- drawdown co-occurrence；
- dependence-aware uncertainty；
- no post-outcome portfolio weighting search。

Without these:
`DIVERSIFICATION_NOT_IDENTIFIED_FROM_PICK_OVERLAP`.

## 9. Divergence attribution

Every System1/System2 disagreement must be assignable, possibly multi-label, to:
- DIFFERENT_OBJECTIVE；
- DIFFERENT_HORIZON；
- DIFFERENT_UNIVERSE；
- DIFFERENT_HARD_GATE；
- DIFFERENT_EVIDENCE_FAMILY；
- DIFFERENT_REGIME_STATE；
- DIFFERENT_ENTRY_READINESS；
- UNKNOWN_OR_MISSING_DATA；
- CAPACITY_OR_LIFECYCLE；
- DIRECT_POLICY_DEPENDENCE；
- UNEXPLAINED。

High `UNEXPLAINED` rate is observability failure, not proof of independence.

## 10. V0.1 D16 adversarial tests

### XSYS-T01
System2 receives identical raw receipts but System1 Top6/rank is removed.
Expected:
at least one authorized System2 strategy path remains executable when its own required inputs are ready; otherwise `INDEPENDENT_DISCOVERY_NOT_PROVEN`.

### XSYS-T02
System1 receives same inputs with System2 outputs removed.
Expected:
Formal output remains unchanged absent explicit owner-approved integration.

### XSYS-T03
Same stock selected by both through separately fingerprinted paths.
Expected:
`OVERLAP_WITH_DISTINCT_PATHS`, not automatic double confirmation and not automatic failure.

### XSYS-T04
Different stocks selected but System2 candidate parent is System1 Top6.
Expected:
`OUTPUT_DIVERGENCE_WITH_POLICY_DEPENDENCE`; low overlap cannot establish independence.

### XSYS-T05
Both systems consume same OHLCV primitive under different factor names.
Expected:
same information root, no double independent-evidence credit.

### XSYS-T06
System2 independent candidate discovered outside System1 Top6.
Expected:
counts toward independent-discovery observability only; not automatically alpha evidence.

### XSYS-T07
System1 rank is total order; System2 is Pareto partial order.
Expected:
do not fabricate scalar common-support rank correlation.

### XSYS-T08
High Jaccard on a strong market day with distinct paths.
Expected:
no fail threshold triggered from overlap alone.

### XSYS-T09
Low Jaccard produced by forced exclusion of System1 names from System2.
Expected:
`FORCED_DISAGREEMENT_INVALIDATES_INDEPENDENCE_CLAIM`.

### XSYS-T10
System1-only picks outperform overlap/S2-only on raw rows, but result disappears under equal-date support.
Expected:
no D16 incrementality claim.

### XSYS-T11
System2 adds predictive loss improvement to System1 on fresh same-target common-support dates, but outcome footprints overlap prior development data.
Expected:
SDA-016 consumption blocks untouched confirmation.

### XSYS-T12
Incremental improvement comes entirely from one market episode / replication cluster.
Expected:
D16-06 / SDA-017 fragility blocks standalone claim.

### XSYS-T13
Selected-set overlap is low but aligned strategy returns are highly co-dependent.
Expected:
no diversification claim from picks.

### XSYS-T14
Selected-set overlap is high but normalized strategy returns / losses show stable incremental differences under separate objectives.
Expected:
overlap alone cannot reject incremental value.

### XSYS-T15
Cross-system combined policy is created after inspecting separate-system outcomes.
Expected:
new adaptive experiment family under SDA-016; original data development-consumed.

### XSYS-T16
One system changes fingerprint lineage after outcome access but keeps same policy version.
Expected:
reject immutable-policy identity.

## 11. Machine terminal states

- `WAITING_POLICY_FINGERPRINTS`;
- `ARCHITECTURAL_INDEPENDENCE_NOT_PROVEN`;
- `ARCHITECTURALLY_DISTINCT_INCREMENTALITY_UNKNOWN`;
- `DIRECT_CROSS_SYSTEM_DECISION_DEPENDENCE`;
- `COMMON_SUPPORT_INSUFFICIENT`;
- `DEPENDENCE_ANALYSIS_PENDING`;
- `INCREMENTALITY_NOT_PROVEN`;
- `INCREMENTAL_INFORMATION_CANDIDATE`;
- `DIVERSIFICATION_NOT_IDENTIFIED_FROM_PICK_OVERLAP`;
- `SDA022_D16_VALIDATION_READY_FOR_00_READBACK`.

None of these authorizes Formal/System2 policy changes.

## 12. Closure boundary

Room11 may validate:
- fingerprints；
- paired receipts；
- dependence；
- common support；
- incremental/OOS analysis；
- no-overclaim semantics。

Room11 does not close SDA-022.

Closure requires:
- System1 fingerprint implementation；
- System2 strategy fingerprint implementation；
- System2 independent-discovery proof；
- prospective overlap/divergence receipts；
- D16 analysis under this contract；
- 00 independent readback。

## 13. Exact next

1. Route fingerprint field contract to System1/System2 engineering lanes.
2. When first prospective pair receipts exist, validate XSYS-T01~T16.
3. Do not set arbitrary overlap/rank-correlation thresholds before outcome inspection.
4. Any future combined System1+System2 policy must be separately preregistered under SDA-016 outer research stream.
5. Formal Core remains LOCKED.
