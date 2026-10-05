# SDA-022｜D16 政策指紋契約相容性稽核 V0.1

更新：2026-10-06 Asia/Taipei
狀態：RESEARCH_ONLY / CONTRACT_COMPATIBILITY_AUDIT_COMPLETE / OUTCOMES_CLOSED / NO_MATURITY_CHANGE
主責：11｜統計驗證與策略市場狀態研究室 / D16
上位正式契約：`shared-knowledge/CROSS_SYSTEM_POLICY_FINGERPRINT_CONTRACT_V0_1.md`
Formal Core：LOCKED

## 1. 目的

00 已凍結跨系統政策指紋正式契約。
Room11 先前已凍結 SDA-022 D16 V0.1 驗證契約與 16 項對抗測試。

本稽核不是改變統計問題，而是確認兩份契約在 machine receipt 欄位上能否一一對接，避免未來出現：
- engineering receipt 存在；
- 但 D16 無法還原政策身份、依賴來源或比較分母；
- 最後只能用人工猜測判斷獨立性。

## 2. 已一致欄位

### 系統／策略身份
00 與 D16 都要求：
- system identity；
- policy version；
- System2 strategyId / strategyVersion；
- decision-time identity；
- candidate-universe identity；
- hard-gate lineage；
- ranking-policy identity；
- information roots；
- selected / active output identity。

### 跨系統 pair
兩邊都要求：
- candidate-universe overlap；
- selected-set overlap/Jaccard；
- shared information roots；
- common-support rank comparison when meaningful；
- divergence reasons；
- no arbitrary overlap threshold。

## 3. D16 V0.1 必須補齊的正式欄位

00 canonical contract 比 D16 V0.1 oracle 更細，以下欄位不得被單一 hash 或 generic boolean 吞掉。

### 3.1 Fingerprint identity / source binding

新增強制：
- `fingerprintVersion`;
- `systemId`;
- `policyId`;
- `effectiveAt`;
- `decisionClockRole`;
- `sourceArtifactPaths`;
- `sourceArtifactDigests`.

理由：
只保存 policy hash 無法證明它由哪一版原始策略檔產生，也無法區分 clock-compatible 與 clock-incompatible receipt。

### 3.2 Candidate dependency 必須拆開

新增：
- `candidateUniverseMode`;
- `candidateUniverseSourceRefs`;
- `requiresOtherSystemCandidateOutput`;
- `requiresOtherSystemRankOutput`.

不得只用：
`consumedSystem1Output=true/false`.

原因：
依賴另一系統「候選集合」和依賴另一系統「排序結果」是不同程度的政策依賴，必須分開。

### 3.3 Gate / evidence family 可讀身份

除 hash 外新增：
- `hardGateIdsOrFamilies`;
- `requiredEvidenceFamilies`;
- `supportiveEvidenceFamilies`;
- `contextEvidenceFamilies`.

Hash 用來驗完整性；
明確清單用來做 shared-root / shared-hard-gate 比較。
兩者不能互相替代。

### 3.4 Ranking / capacity / lifecycle semantics

新增：
- `rankingPolicyId`;
- `rankingPolicyVersion`;
- `rankingMechanism`;
- `capacityPolicy`;
- `entryConfirmationPolicy`;
- `lifecyclePolicy`;
- `primaryHorizon`;
- `unknownFailClosedSemantics`;
- `authorityState`.

這些欄位是判斷「只是共用資料」還是「實際已共用決策政策」的核心。

## 4. Pair receipt 必須補齊

D16 V0.1 已有：
- pairReceiptId；
- decisionDate；
- fingerprint refs；
- clock/target/horizon compatibility；
- Jaccard；
- commonSupportN；
- sharedInformationRootRatio；
- sharedHardGateRatio；
- independent-discovery counts；
- SDA-016 refs。

依 00 canonical contract 再新增：
- `selectedSetOverlap`;
- `sharedInformationRoots`;
- `sharedHardGateFamilies`;
- `requiresUpstreamSystemOutput`;
- `system1OnlySymbols`;
- `system2OnlySymbols`;
- `overlapSymbols`;
- `comparableSupportDefinition`;
- `missingDenominatorN`;
- `unknownDenominatorN`.

只給比率、不給原始集合與分母，無法重算或查核。

## 5. Hash + semantic payload 雙軌規則

Canonical receipt 同時需要：
- semantic payload；
- digest/hash。

禁止只保存：
`informationRootSetHash`
而不保存 `informationRoots`.

禁止只保存：
`hardGateLineageHash`
而不保存 gate family list.

禁止只保存：
`selectedSymbolsDigest`
而在 comparison receipt 中沒有可驗證的 overlap symbol set / count。

原因：
D16 必須能重算 overlap、比對 lineage，也必須能檢查 digest 是否對應實際 payload。

## 6. 物理獨立性狀態

Architecture baseline：
- `CURRENT_SYSTEMS_IDENTICAL = FALSE`;
- `PHYSICAL_INDEPENDENCE_FULLY_PROVEN = FALSE`;
- `CURRENT_CONVERGENCE_RISK = MATERIAL`.

因此 fingerprint receipt 只能先證明 policy observability。
真正 physical independence 仍需 NC-T01。

System2 architecture 中寫著 independent 不得自行升級成：
`PHYSICALLY_INDEPENDENT`.

## 7. 新增對抗測試

### XSYS-T17
receipt 缺 sourceArtifactPaths / digests，但有 policy hash。
Expected：
`REJECT_UNTRACEABLE_POLICY_SOURCE_BINDING`.

### XSYS-T18
只用 consumedOtherSystemOutput 一個 boolean，未區分 candidate output / rank output。
Expected：
`REJECT_AMBIGUOUS_CROSS_SYSTEM_DEPENDENCY`.

### XSYS-T19
System2 只產生整個平台一張 fingerprint，沒有 per-strategy fingerprints。
Expected：
`REJECT_POOLED_SYSTEM2_POLICY_IDENTITY`.

### XSYS-T20
pair receipt 只有 Jaccard / ratios，沒有 raw sets/counts/UNKNOWN denominators。
Expected：
`REJECT_NON_RECOMPUTABLE_PAIR_RECEIPT`.

### XSYS-T21
effectiveAt / decisionClockRole 缺失。
Expected：
`CLOCK_COMPARABILITY_UNKNOWN`.

### XSYS-T22
fingerprint 宣稱 independent，但 candidateUniverseSourceRefs 指向 mandatory other-system candidate/rank output。
Expected：
`REJECT_FINGERPRINT_DEPENDENCY_CONTRADICTION`.

### XSYS-T23
informationRootSetHash / hardGateLineageHash 存在，但 semantic root/gate payload 缺失。
Expected：
`REJECT_HASH_ONLY_DEPENDENCE_OBSERVABILITY`.

### XSYS-T24
相同 policyVersion 下 sourceArtifactDigests 或 ranking/capacity/lifecycle semantic payload 改變。
Expected：
`REJECT_SILENT_POLICY_MUTATION`.

## 8. 結論

Room11 SDA-022 oracle 應升至 V0.2：
- T01-T16 原樣保留；
- T17-T24 增加 canonical schema compatibility；
- 共 24 項 blocking tests。

這不是提高 closure 標準，而是把 00 已凍結的正式 observability contract 映射成 D16 可執行驗收。

No empirical outcome opened.
No maturity change.
