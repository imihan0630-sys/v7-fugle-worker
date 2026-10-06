# SDA-022｜D16 增量機率可識別性與校準來源防火牆 V0.1

更新：2026-10-06 Asia/Taipei
狀態：RESEARCH_ONLY / OUTCOMES_CLOSED / CALIBRATION_IDENTIFIABILITY_GAP_FROZEN / NO_MATURITY_CHANGE
主責：11｜統計驗證與策略市場狀態研究室 / D16
Formal Core impact：NONE

## 1. 續接依據

依 latest main 與：
- shared-knowledge/SDA022_D16_VALIDATION_REQUEST_V0_1.md
- shared-knowledge/SDA022_ACCEPTANCE_ORACLE_V0_1.md
- research/SDA022_D16_S1_SHORT_MOMENTUM_D5_INCREMENTALITY_PREREG_20261006_V0_1.md
- research/SDA022_ROOM11_D16_PREREG_VALIDATION_RETURN_20261006_V0_1.md
- research/SDA022_D16_FINGERPRINT_CONTRACT_COMPATIBILITY_AUDIT_20261006_V0_1.md

目前 S22-T25~T28 已由 Room11 驗證 4/4 PASS；S22-T01~T16 仍等待實體 fingerprint / NC-T01；outcomes 維持 CLOSED。

## 2. 新發現：primary estimand 存在 calibration identifiability gap

既有 primary estimand 為 DATE_BALANCED_BRIER_LOSS_IMPROVEMENT。

Brier loss 的輸入必須是可解讀為事件機率的數值。
但 System1 Formal policy state 與 System2 SHORT_MOMENTUM policy state 目前尚未證明原生輸出 calibrated probability。

因此：
- rank、tier、selected flag、score、gate state 不得直接當 probability；
- 0/1 selected flag 直接塞入 Brier 會把「政策選擇」誤當「事件機率」；
- 任意 min-max / sigmoid / rank-percentile 映射都會新增未登錄自由度；
- 若映射方法在 D5 outcome 開啟後挑選，primary estimand 會被 data snooping 污染。

結論：
在 machine fingerprints 落地並證明實際 policy-state cardinality / score semantics 前，不應假裝 exact estimator 已可凍結。

## 3. 校準來源契約

若兩套系統沒有原生、事前凍結且可驗證的 probability output，後續 baseline / augmented probability 必須由獨立 calibration layer 產生。

必要欄位：
- calibrationPolicyId / version；
- trainingStart / trainingEnd；
- knownAt / frozenAt；
- input semantic identities；
- outcome target identity；
- fitting sample population receipt；
- missingness / admission disposition；
- estimator family；
- regularization state；
- calibration artifact digest；
- applicable decision-date interval。

禁止：
- 用 primary holdout / outer confirmatory dates 重新校準；
- 看完 D5 outcome 再選 encoding；
- 用 full-sample calibration 後回填 earlier dates；
- 將 current fitted mapping 套回歷史並稱 PIT；
- 將 selected flag 直接視為 probability。

## 4. 方法選擇延後不是空白授權

在 fingerprints 尚未揭露 policy-state 語意前，ModelMethodReceipt 應保持：
METHOD_CONDITIONALLY_FROZEN_FEATURE_SEMANTICS_PENDING

而不是：
METHOD_FREE_TO_OPTIMIZE_AFTER_OUTCOMES。

一旦 fingerprints 落地，D16 只能依事前決策樹選方法：

A. 若兩系統均有原生 frozen probability：
- baseline = System1 probability；
- augmented = preregistered combination model，仍需 prior-only fitting。

B. 若 System1 有 probability、SHORT_MOMENTUM 僅 categorical state：
- baseline 使用 System1 probability；
- augmented 只允許事前凍結的低自由度 categorical increment；
- fitting 僅使用 prior eligible dates。

C. 若兩邊都只有 categorical / ordinal state：
- 建立 baseline / augmented 的 prior-only probabilistic mapping；
- 不允許把 rank 或 selected flag 當 probability；
- feature encoding 必須由 fingerprint semantic payload 決定。

D. 若 score semantics 不穩定、版本跨期不可比或樣本不足：
- primary probability incrementality = NOT_IDENTIFIABLE_YET；
- 不以替代 metric 救援 primary claim。

## 5. 時間順序與 nested fitting 防火牆

每一個待評估 decision date 的 probability mapping，只能使用該 date 以前 eligible 且 consumption-valid 的成熟 outcomes。

若 calibration / estimator 需要調參：
- inner fitting/tuning 僅在 prior block；
- outer date 不參與 encoding、regularization、threshold、model-family 選擇；
- overlapping D5 footprint 需依 D16-06 / SDA-016 purge/embargo 語意處理；
- model artifact 必須可重播到該 decision date。

若 early dates 沒有足夠 prior sample：
- 標記 CALIBRATION_WARMUP_INELIGIBLE；
- 保留在 coverage denominator；
- 不得以 current mapping 回填。

## 6. MDE / precision 的正確凍結順序

數值 MDE 不應在可用獨立日期數、date-delta dispersion、replication-cluster 結構尚完全未知時任意指定。

先凍結：
1. primary effect unit = date-balanced Brier delta；
2. favorable direction = < 0；
3. effective independent date floor = 40（既有治理 floor，不是 power guarantee）；
4. no single replication cluster domination；
5. uncertainty must respect date/temporal dependence；
6. fixed maximum prospective analysis horizon / information budget 必須在 outcome 開啟前登錄。

真正 numerical MDE 可在 outcome-blind pilot variance source 存在時凍結；
若沒有合法 pilot variance：
- 使用 precision target / maximum-width rule；
- 或維持 exploratory；
- 不得用 primary outcomes 先估 variance 再宣稱原本就有 confirmatory power。

## 7. 停止規則防火牆

禁止：
- 每新增幾天就偷看 primary D5 Brier delta，看到顯著就停；
- support 不佳時無限延長直到結果轉正；
- primary 失敗後切 D1/D3/D10 救援。

合法停止只能來自事前凍結條件，例如：
- fixed maximum eligible decision-date count；
- fixed calendar cutoff；
- precision target with alpha-spending / sequential method explicitly preregistered；
- hard data-quality stop independent of economic direction。

在 outer research-stream error-control 尚未凍結前，最安全狀態仍為 exploratory / outcomes closed。

## 8. D18 交叉防火牆

Regime stratification 仍是 secondary non-rescuing diagnostic。
只有在：
- regime label PIT-safe；
- replication clusters 足夠；
- inclusion/observability by regime 不失衡；
- no single regime episode domination；
- no post-outcome regime taxonomy change
時才可解讀。

若 primary overall incrementality 不成立，單一 favorable regime cell 不得直接升格為新 primary claim；必須 new experiment/version + multiplicity accounting。

## 9. 支持機制、反證、替代解釋、失效條件

支持機制：
若 SHORT_MOMENTUM policy state 含 System1 未使用的可重播資訊，prior-only calibrated augmented probability 應在相同 common support 上降低 date-balanced Brier loss。

反證：
- 增量在 shared-root control 後消失；
- 僅 selected rows 有效、完整母體無效；
- 僅單一 regime/sector/episode 驅動；
- calibration mapping 跨版本不穩；
- dependence-adjusted uncertainty 跨零；
- 成本或 admission/missingness sensitivity 後效果消失。

替代解釋：
- 共同 trend/price-volume primitive；
- universe / liquidity / sector composition；
- decision-clock mismatch；
- calibration flexibility；
- missingness / support selection；
- overlapping forward windows。

失效條件：
若無法形成 PIT-safe calibration receipt，primary Brier incrementality 暫時不可識別，不得改用事後方便的 proxy 來宣稱通過。

## 10. Exact next

1. 重新讀 latest main。
2. 若 System1 fingerprint receipt 落地，只驗 S22-T01~T05。
3. 若 System2 per-strategy fingerprints 落地，只驗 S22-T06~T10，並讀取 SHORT_MOMENTUM 真實 score/state semantics。
4. 若 NC-T01 physical receipt 落地，只驗 S22-T11~T16。
5. 三者尚未落地時，不空轉：準備 calibration receipt schema / method decision tree，但 outcomes 保持 CLOSED。
6. fingerprints 落地後，依本檔 A/B/C/D 決策樹凍結 exact ModelMethodReceipt；不得事後改 encoding。
7. outer research-stream state、MDE/precision、stopping rule 完成前，不開 primary economic outcome。

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
No outcome inspected.
No maturity change.
Formal Core LOCKED.
