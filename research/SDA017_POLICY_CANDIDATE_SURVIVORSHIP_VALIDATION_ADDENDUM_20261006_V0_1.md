# SDA-017｜策略候選池存活偏誤與冠軍更替驗證補充契約 V0.1

更新：2026-10-06 Asia/Taipei  
狀態：RESEARCH_ONLY / SIXTH_ROUND_VALIDATION_ADDENDUM_FROZEN / NO_MATURITY_CHANGE  
主責研究室：11｜統計驗證與策略市場狀態研究室  
跨票連結：SDA-016 outer hypothesis stream  
正式核心影響：NONE

## 1. 新盲點：Regime 固定不代表 policy candidate universe 固定

既有 SDA-017 主要防止：
- post-hoc Regime mining；
- episode inflation；
- future persistence leakage；
- fit-clock leakage；
- observability selection；
- replication fragility。

但即使 Regime 完全 ex-ante，仍可能在 policy 候選池產生 survivor / champion bias：

- 不斷新增策略候選；
- 表現差的候選被淘汰；
- 表現好的候選留在 dashboard；
- 每期都把目前最佳者稱為「Regime 最適策略」；
- 最後只回看現存候選。

這會讓 policy universe 的歷史失敗分母消失。

## 2. Canonical policy-candidate universe

每個 D18 policy comparison 必須綁：

- `policyUniverseId`;
- `policyUniverseVersion`;
- `candidateSetHashAtDecision`;
- `candidateBirthLedgerHash`;
- `candidateRetirementLedgerHash`;
- `championSelectionRuleHash`;
- `baselinePolicyId`;
- `commonSupportRuleHash`;
- `selectionAt`;
- `freshEvaluationStartAt`;
- `sda016ResearchStreamRef`.

每一 candidate 至少有：

- `policyCandidateId`;
- `policyFamilyId`;
- `policyVersion`;
- `bornAt`;
- `birthReason`;
- `parentPolicyRefs`;
- `retiredAt`;
- `retirementReason`;
- `outcomeAccessCountAtBirth`;
- `regimeFamilyId`;
- `activationRuleHash`.

## 3. Champion selection 不是 validation

同一資料期間比較 A/B/C，再選 B 為 champion：

A/B/C 的比較期間是 selection/development evidence。

B 要成為 promotion-grade champion，仍需：
- frozen champion rule；
- fresh post-selection evidence；
- SDA-016 consumption clearance；
- common-support / D16 dependence clearance。

不能把「B 是三個裡面最強」等同「B 有 untouched OOS validation」。

## 4. Candidate retirement preservation

retired candidates 必須保留在：
- candidate birth ledger；
- tested candidate denominator；
- outcome-inspected count；
- selection history。

不得因為 underperformance、support insufficient、Regime mismatch、cost failure 或 operational inconvenience 而從 historical candidate universe 刪除。

刪除只影響 future activation，不改歷史 multiplicity。

## 5. Champion turnover

若每個期間都重新選 champion：

`C_t = argmax performance(candidate set)`

則「champion strategy」本身是一個 adaptive meta-policy。

必須記：
- championAt t；
- candidate set at t；
- selection metric；
- lookback window；
- switching rule；
- turnover / cost；
- fresh evaluation boundary。

只報每期冠軍的 realized performance，而不計 selection process：
`CHAMPION_SELECTION_BIAS`.

## 6. Incumbent advantage / survival duration

長期仍存活的 candidate 可能只是：
- 被測得比較久；
- 經歷較有利 Regime；
- 早期 lucky path；
- losers 已被刪除。

因此需報：
- candidate exposure duration；
- number of evaluation opportunities；
- Regime support；
- entry cohort；
- retirement process。

不能直接把「存活最久」當「最穩健」。

## 7. Common-support champion comparison

如果 candidate A 只在 TREND 開啟，candidate B 只在 RANGE 開啟，直接比較各自 activated performance 不是公平 champion race。

Primary comparison需：
- 明確 estimand；
- paired/common decision support where claim needs it；
- disabled opportunity cost；
- activation opportunity denominator；
- same cost semantics。

若 common support 不存在：
`POLICY_CHAMPION_NOT_IDENTIFIED_ON_COMMON_SUPPORT`.

## 8. 第六輪對抗驗收

49. 只保留現存 policy candidates、已淘汰 losers 從 denominator 消失：`REJECT_POLICY_SURVIVORSHIP_ACCOUNTING`.
50. A/B/C 同期比較後 B 勝出，直接把同一期間當 B 的 untouched validation：`SELECTION_PERIOD_DEVELOPMENT_CONSUMED`.
51. 每月重選最佳 candidate，串接每月冠軍收益後宣稱單一策略績效：`CHAMPION_META_POLICY_REQUIRES_OWN_PREREGISTRATION`.
52. champion rule / ranking metric 在看到 outcomes 後改變：`NEW_META_POLICY_FAMILY_AND_SDA016_CONSUMPTION`.
53. retired loser 用新 id 重返且無 parent lineage：`REJECT_POLICY_ID_ALIAS_RESET`.
54. surviving candidate 表現較佳但 exposure duration / Regime support 與 losers 不同且未報：`SURVIVAL_DURATION_CONFOUNDING_WARNING`.
55. candidates activation opportunities 不同，卻只比較各自 enabled dates：`POLICY_CHAMPION_NOT_IDENTIFIED_ON_COMMON_SUPPORT`.
56. champion change 次數、candidate births、retirements 與 SDA-016 hypothesis stream ledger 對不上：`CROSS_LEDGER_MULTIPLICITY_MISMATCH`.

## 9. Support interpretation

新增 D18 policy-selection states：
- `POLICY_UNIVERSE_ACCOUNTING_INCOMPLETE`;
- `SELECTION_PERIOD_DEVELOPMENT_CONSUMED`;
- `POLICY_CHAMPION_NOT_IDENTIFIED_ON_COMMON_SUPPORT`;
- `CHAMPION_SELECTION_BIAS`;
- `FRESH_CHAMPION_VALIDATION_PENDING`;
- `POLICY_CHAMPION_VALIDATION_ELIGIBLE`.

這些狀態不取代既有 episode / replication support states；兩者都需要通過。

## 10. 方法論錨點

模型選擇與金融 backtest literature 的共同警示：
- 在多個 alternatives 中挑最佳者後，naive inference 會低估 selection uncertainty；
- 多策略搜尋與只報 winner 會放大 false discovery / backtest overfitting；
- valid policy claim 必須把 candidate-selection process 本身納入推論或使用 fresh post-selection evidence。

## 11. Exact next

1. SDA-017 oracle 下一版納入 T49-T56。
2. 建立 D18 policy-candidate universe receipt。
3. policy candidate birth/retirement/selection 必須連回 SDA-016 `researchStreamId`.
4. System2 episode/support engine 未來若做 policy selection，需同時保存 candidate-universe denominator。
5. 不改 Formal ranking / weight / threshold / trading action。

FORMAL_OPTIMIZATION_CANDIDATE: NONE  
Formal Core: LOCKED
