# D16 / D18｜2026-10-05 Prospective Evidence Admissibility Audit V0.1

更新：2026-10-05 Asia/Taipei  
狀態：RESEARCH_ONLY / ADMISSIBILITY_AUDIT_FROZEN / NO_MATURITY_CHANGE  
主責：11｜統計驗證與策略市場狀態研究室  
正式核心影響：NONE

## 1. 目的

本文件處理一個跨 D16 / D18 的共同風險：

> 缺少當時可驗證的 prospective receipt，不可事後以 reconstructed data 補成「當時已存在的前瞻證據」；但 readback 尚未完成，也不可粗暴地把 UNKNOWN 當成零樣本或策略失敗。

這是 SDA-016 holdout / provenance governance 與 SDA-017 prospective Regime policy evidence 的共同 admission gate。

## 2. Evidence-state taxonomy

### `PROSPECTIVE_ADMISSIBLE`
必須同時證明：
- receipt / generation 在 decision time 真實產生；
- immutable identity / provenance 完整；
- readback 可驗證；
- outcome 尚未用於改動 prediction / state / policy；
- 相關 source / continuity / support gate 合格。

### `READBACK_PENDING`
已存在正式 runtime / capture contract，但目前尚未取得可驗證 genuine-session readback。

規則：
- 不算成功；
- 不算失敗；
- 不算 zero-pick；
- 不算樣本數；
- 後續若能證明 receipt 當時已 immutable persisted，才可轉 `PROSPECTIVE_ADMISSIBLE`；
- 後續新建的 retrospective reconstruction 不得轉為 prospective。

### `INELIGIBLE_PARENT_MISSING`
當時所需 parent generation / cohort / registration 明確未成立。

規則：
- 該研究 lane 不得把該日納入 prospective denominator numerator；
- later backfill 只能 exploratory / retrospective；
- 不得把缺失改寫為 BAD/0/zero-pick。

### `INELIGIBLE_CAPTURE_DISABLED`
決策時點所需 capture path 明確關閉或未授權，且不存在另一個已凍結可驗證的 prospective path。

規則：
- later reconstruction 永久不能把該 historical date 升成該 policy lane 的 genuine prospective receipt；
- 可作 methodology replay，但必須標 retrospective。

### `RETROSPECTIVE_ONLY`
資料可在事後取得，但沒有 decision-time immutable capture proof。

### `UNKNOWN_ADMISSIBILITY`
證據不足以判定當時是否存在合法 prospective receipt。

預設 fail closed，不得 promotion。

## 3. D16 / C1 status as of 2026-10-05 evening readback

Canonical System 1 deployment file仍記錄：
`FIRST_GENUINE_SESSION_READBACK_PENDING`.

最新 main 搜尋未找到 2026-10-05 genuine post-V8.17 C1/cohort acceptance receipt。
Room04/D05 的獨立 checkpoint 另記錄：
- `FORMAL_SCAN_NOT_CONFIRMED`;
- `C1_GENERATION_NOT_FOUND`;
- 2026-10-05 無 valid prospective C3 registration；
- retrospective quote/depth retrieval cannot repair prospective registration。

重要區分：
上述 D05/C3 證據足以判定 **D05 的 2026-10-05 cohort lane 不合格**，
但不能單獨證明「D16-CAL-01 所需的 2026-10-05 after-close C1 generation 絕對不存在」。

因此 D16-CAL-01 對 2026-10-05 的狀態凍結為：

`READBACK_PENDING / NOT_COUNTABLE_YET`.

只有後續能證明：
- genuine V8.17+ C1 generation 當時已產生並 immutable persisted；
- decisionAt / scanDate / source SHA / population hashes / full qualified `actualRankingTuple.priorityScore` coverage 完整；
- generation 不是 outcome 後重建；
才可把該 generation 納入 D16-CAL-01。

若只能用之後重新跑 code / today-spec reconstruction 生成歷史 C1，則：
`RETROSPECTIVE_ONLY`。

## 4. D18 status as of 2026-10-05 evening readback

System 2 canonical checkpoint仍保留：
- `CAPTURE_DISABLED`;
- prospective Shadow capture contract repository-side存在；
- production/always-on scheduled prospective decision capture尚未開啟；
- D18 activation-frame目前有 builder / tests，但 latest-main 搜尋未找到 2026-10-05 genuine strategy activation frame 或 genuine `regimeStateReceipt`。

因此 2026-10-05 對 D18 prospective policy evidence 的狀態凍結為：

`INELIGIBLE_CAPTURE_DISABLED / NO_CANONICAL_PROSPECTIVE_POLICY_FRAME`.

這不表示：
- strategy failure；
- POLICY_DISABLED；
- NATURAL_ZERO_PICK；
- DATA_UNKNOWN policy result；
- Regime 無效。

它只表示：
**該日沒有足夠 canonical evidence 可以被算成 genuine prospective D18 policy-validation date。**

任何後續依 2026-10-05 歷史資料重建的 Regime vector / activation frame：
- 可用於 deterministic replay / engineering test；
- 不得標 prospective；
- 不得增加 prospective episode N；
- 不得增加 prospective independent date N；
- 不得用於 D18 L4 promotion。

## 5. Cross-ticket implications

### SDA-016
若 later consumer 嘗試把事後重建的 2026-10-05 receipt 標成 untouched / prospective：
- 觸發 provenance mismatch；
- 依 oracle T12 / T19 fail closed；
- 若使用 outcome 後規格重建，視為 development evidence。

### SDA-017
若 later D18 engine 使用 2026-10-05 historical reconstruction 當 genuine prospective episode：
- 觸發 oracle T14；
- structuralEpisodeN / prospectiveDateN 不得增加；
- 若 state definition 又是 outcome 後才形成，另觸發 T01/T02/T28 與 SDA-016 consumption。

## 6. Negative-evidence principle

缺資料本身是治理資訊，不是經濟效果。

應保留：
- capture/readback failure；
- parent-missing reason；
- capture-disabled state；
- exact observedAt/readbackAt；
- system/version；
- what could and could not be proven。

禁止：
- failure -> zero pick；
- missing -> negative return；
- no receipt -> no signal；
- reconstructed receipt -> prospective receipt。

## 7. Current admission ledger

| Domain | Date | Lane | State | Count as prospective? |
|---|---|---|---|---|
| D16 | 2026-10-05 | D16-CAL-01 C1 probability | `READBACK_PENDING` | NO, until genuine immutable readback |
| D05 | 2026-10-05 | C3-derived Wave-1 | `INELIGIBLE_PARENT_MISSING` | NO |
| D18 | 2026-10-05 | prospective activation/policy frame | `INELIGIBLE_CAPTURE_DISABLED` | NO |

D05 is recorded only as corroborating cross-domain evidence; Room11 does not own D05 maturity.

## 8. Exact next

1. D16: on first canonical C1/cohort readback, inspect whether persistence actually predates any outcome access and whether full qualified priorityScore coverage matches D16-CAL-01. Do not accept a reconstruction.
2. D18: first eligible prospective policy date must occur only after an authorized/frozen capture path can generate immutable decision-time regime/activation receipts; the first date cannot be backdated.
3. SDA-016/017 engineering deltas remain separately required; empirical receipt availability cannot bypass the 22/30 oracle gates.
4. No maturity promotion from this negative/admissibility audit.

FORMAL_OPTIMIZATION_CANDIDATE: NONE  
Formal Core: LOCKED
