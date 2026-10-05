# SDA-016｜Outcome Information Footprint / Overlap Validation Addendum V0.1

更新：2026-10-05 Asia/Taipei  
狀態：RESEARCH_ONLY / VALIDATION_OWNER_ADDENDUM_FROZEN / NO_MATURITY_CHANGE  
主責研究室：11｜統計驗證與策略市場狀態研究室  
基礎契約：`research/SDA016_HOLDOUT_CONSUMPTION_VALIDATION_CONTRACT_20261005_V0_1.md`  
正式核心影響：NONE

## 1. 為何既有 date-set overlap 還不夠

既有 SDA-016 V0.1 正確要求 exact independent decision-date set 與 partial-overlap lineage。

第二輪對抗驗證新增一個更嚴格問題：

> 兩個 holdout 即使 decision dates 不重疊，只要 outcome 的資訊視窗使用了重疊的未來市場 primitive，仍可能共享已被研究者看過的 outcome information。

例：
- H1：決策日 t，D+5 return；
- H2：決策日 t+1，D+5 return。

兩個 decision date 不同，但兩個多期報酬由高度重疊的單期市場變動組成。
因此只用 decision-date-set hash 會高估 holdout 的「新鮮度」。

這不是說所有重疊 horizon 都無法研究；而是不能把共享 outcome primitive 的資料稱為完全 untouched confirmation。

## 2. Canonical outcome information footprint

每個 experiment target / horizon 必須能推導：

`outcomeInformationFootprint`

至少包含實際用來形成 outcome 的 primitive identity。

### Close-to-close D+N return

對決策日 t、horizon N：
- reference session = t；
- outcome session = t+N；
- dependency session interval = t+1 ... t+N；
- 若以累積多期 return 為 outcome，這些單期 return increments 都屬資訊 footprint。

### MFE / MAE / path statistic

footprint 包含：
- t+1 ... t+N 全部 official sessions；
- 若使用 intraday high/low/bar ordering，需包含實際使用的 intraday primitive identity；
- target-first / stop-first 若同 bar 順序不明，保留 AMBIGUOUS，不得用事後假設縮小 footprint。

### Event / corporate-action / continuity dependent outcome

footprint 還必須綁：
- exact source/provenance version；
- corporate-action continuity semantics；
- symbol-session identity；
- missing / UNKNOWN rule；
- maturity cutoff。

## 3. Minimum machine-visible fields

Canonical holdout-use authority至少新增或可等價重建：

- `decisionDateSetHash`;
- `outcomeInformationFootprintHash`;
- `outcomeFootprintStartSession`;
- `outcomeFootprintEndSession`;
- `outcomeDependencySessionCount`;
- `decisionDateOverlapN`;
- `decisionDateOverlapRatio`;
- `outcomeSessionOverlapN`;
- `outcomeSessionOverlapRatio`;
- `priorConsumedOutcomeFootprintRefs`;
- `purgeRuleVersion`;
- `overlapDisposition`.

不得只靠 logical holdout id 或 dataset content digest 猜重疊。

## 4. Conservative overlap disposition

### `UNSEEN_NONOVERLAPPING`
- decision-date set 無重疊；
- outcome information footprint 亦無重疊；
- experiment family / target / horizon / governance 符合 preregistration；
- 才可進 untouched confirmatory eligibility。

### `DATE_OVERLAP_CONSUMED`
- decision dates 有重疊；
- 不得把重疊部分當新的獨立 confirmation evidence。

### `OUTCOME_FOOTPRINT_OVERLAP_CONSUMED`
- decision dates 可不重疊；
- 但 outcome information footprint 與已看過 holdout 重疊；
- 整個新版本不得宣稱為完全 untouched confirmation；
- 可作 exploratory/development analysis；
- 若要新的 confirmatory evidence，須事前建立 purge/embargo 後的非重疊 holdout。

### `UNKNOWN_OVERLAP`
- session lineage、horizon dependency、continuity 或 source identity不足以證明；
- fail closed；
- 不得稱 untouched OOS。

## 5. Purge / embargo interpretation

Purge 的目的不是讓數字好看，而是避免 train/development outcome information 滲入 confirmatory window。

對 D+N outcome：
- 前一個 consumed/development window 的 outcome dependency footprint 不得伸入新的 untouched confirmatory window；
- 新 confirmatory decision window 的第一個可用日期須由 frozen purge rule 事前決定；
- 不得看完結果後再選一個較有利的 embargo 長度。

若 target 使用 path-dependent outcome，purge 必須依完整 path footprint，不得只看 endpoint date。

## 6. Cross-sectional dependence

同一 scanDate 的多股票 rows：
- decision-date overlap 視為完全共享 date unit；
- 不得因 symbol 不同就當成獨立 holdout usage。

不同 scanDate 但 outcome windows 重疊：
- 即使 symbol 不同，仍至少共享 market-session information；
- D16-06 dependence-aware inference 仍需處理共同市場衝擊；
- footprint guard 不取代 cluster/HAC/block-bootstrap，它只防止把重複資訊標成「全新 holdout」。

## 7. Cross-System canonical authority

System 1 / System 2 共用 physical evidence 時，canonical authority 至少以：
- experiment family lineage；
- target/horizon semantics；
- decision date set；
- outcome information footprint；
- outcome lock；
識別重複消費。

不同 logical id、不同 consumer、不同 repository path 都不能重置 consumption。

## 8. Adversarial acceptance extensions

新增 SDA-016 第二輪驗收：

13. H1 decision dates A,B；H2 decision dates C,D，日期不重疊但 D+N outcome session intervals 重疊：H2 不得標完全 untouched。
14. H1/H2 endpoint dates不同，但 cumulative return 使用相同 underlying sessions：必須偵測 footprint overlap。
15. MFE/MAE 使用相同 path sessions，但兩邊只比較 endpoint hash：驗收失敗。
16. 同一 decision dates 換 D5 -> D10：屬 horizon mutation + expanded outcome footprint；同 holdout 不得重置 OOS。
17. 不同 symbols、同 scanDate：不能當兩份獨立 date evidence。
18. System 1 / System 2 對同一 physical footprint 使用不同 holdout id：canonical authority 必須合併 consumption。
19. outcome footprint lineage 不完整：必須 `UNKNOWN_OVERLAP`，不能假設無重疊。
20. purge/embargo 長度在看 outcome 後改動：新版本屬 adaptive family，原 holdout development-consumed。
21. 新 holdout 經事前 purge 後完全避開 consumed outcome footprint：可重新取得 unseen eligibility，但仍需其他 SDA-016 preregistration gates。
22. overlap guard PASS 不代表 statistical independence；最終 uncertainty 仍由 D16-06 決定。

## 9. Validation interpretation

本 addendum 把 SDA-016 的核心從：

「同一批 decision dates 不可反覆叫做 OOS」

提升為：

「同一批 outcome information 不可藉平移 horizon、換 logical id、換 consumer 或換股票列重新叫做 OOS」。

因此目前 System 1 exact-dataset guard 的 G1 blocker 應擴充為：

`PARTIAL_DATE_OVERLAP + OUTCOME_INFORMATION_FOOTPRINT_OVERLAP`.

這是 11 室 validation ownership 的正式補充，不是新的交易規則。

## 10. Engineering acceptance boundary

工程不需要改 Formal Core。

只需讓 canonical ledger / consumer guard：
1. 接受 machine-readable decision-date set；
2. 接受 target-specific outcome footprint；
3. 計算 overlap；
4. fail closed on unknown lineage；
5. 產生 deterministic overlap disposition；
6. 將 overlap state 傳給 research evaluator。

若需要共享持久化／跨 System authority，依既有治理走 Class B；11 室不自行授權部署。

FORMAL_OPTIMIZATION_CANDIDATE: NONE  
Formal Core: LOCKED

## 11. Exact next

System 1 / System 2 補 shared consumption authority 時，11 室除了原 V0.1 測試，必須追加本文件 13–22 項。
未通過 outcome-footprint overlap，不得送 00 作 SDA-016 closure。
