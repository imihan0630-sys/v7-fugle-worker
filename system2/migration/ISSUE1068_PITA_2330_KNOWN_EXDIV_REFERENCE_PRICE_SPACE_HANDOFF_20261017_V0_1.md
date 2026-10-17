# DATA_LANE｜2330 單一已知除息事件官方參考價連續性：原始資料與方案測試

- 日期：2026-10-17 Asia/Taipei；Owner 方案 C 三層研究架構已生效。
- Status：**SOURCE-ORIGINAL-BOUND RESEARCH PROPOSAL — NON-PIT / NO APPROVED STRATEGY ADJUSTMENT / NO NEGATIVE CA COMPLETENESS**。
- 管轄：System 2 DATA_LANE #1068，BUILD #1132 負責策略因子與實際進場語意，AUDIT_LANE 必須獨立檢查價量與所有 relevant 事件。絕不觸及 System 1 V8 Formal。
- 官方參考：[TWSE 除權除息計算結果表及公式](https://www.twse.com.tw/zh/announcement/ex-right/twt49u.html)。證交所說明 `權值+息值 = 除權息前收盤價 − 除權息參考價`。本次官方個股原始事件是純「息」：2026-09-15 close = 2,385；2026-09-16 除息參考價 = 2,377.99，當日原始 close = 2,380。**官方參考價不等於官方核可的 61 日日 K 還原股價序列，也不應用未經核對的名目股息 7.000001 取代實際參考價差 7.01**。

## 已存在原始資料，不再重抓

1. 已保存之 TWSE 61 個原始交易日母體：原始 10/15 Run #38797319008 / Artifact #12002806667，署名 receipt `ff5aa17607fa9cc191599111b27b762a02f599456992f1baf7ee7b854387cfd9`。
2. 官方 2026/10/16 2330 價量原始 Run #38908458028 / Artifact #12049690326，署名 receipt `074c5e83afde3e4dd7dfb7295eb7483215848a84edb5b78493fd673592d9f18a`。
3. 61 筆原始價量逐日獨立重驗 Run #38909699033 / Artifact #12049278372，署名 receipt `773e65085186e0b6a019f320d4b2bdd3a07d8480ad70efc0f8e8e455f8d136e9`。
4. 官方 9/16 除息前後兩日價量與原始 CA 日期/列 SHA 比對，原始 Run #38917089196 / Artifact #12052549252，署名 receipt `502dfbf79003573d4c58009dce44e62de673ef3648ad1a892a90c6503b04a3d7`。實際 CA 原始首次觀測於 2026/10/16 21:48 台北，不能改稱 9/16 當時已觀測。

所有上游物理來源/署名/股票身份/61 個交易日/觀察時點須一對一配對，不能把 10/17 凌晨 M09 30 CFI / 6 CA 混入 10/16 的 23:45 截止點。

## 真實資料所支持的最小 **研究候選**

本 PR 的 DATA-only 函式 `makeSingleKnownExdivReferenceCandidateV0_1` 在只對**已知 9/16 單一事件**建構「參考價空間銜接候選」時，提出 `r = 2377.99 / 2385 ≈ 0.9970607966`。如需研究同一參考價空間，**可供審查**：對 9/15 與更早的 41 個 OHLC 值乘 r，從 9/16 起共 20 個交易日保留原始 OHLC。此係**模型候選**，不是交易所公布的完整還原股價標準，也尚未獲策略及獨立稽核同意。

校驗示例：9/15 候選 close = 2377.99；9/16 原始 close = 2380；以除息參考價計算兩日變動 **+0.084525%**，未調整原始 close 對 close 則是 **−0.209644%**。使用錯誤空間會連漲跌方向都判錯。

以真實 61 筆原始價量／source-row SHA 對應輸出供 AUDIT／BUILD 評估；原始成交股數和成交金額**不隨價格倍率自動改寫**。

## 精確 FAIL-CLOSED 缺口

- `authoritativeOtherActionsExcluded=false`：其他公司行動是否存在，仍無權威排除證明，**不能因六個現況表沒有 2330 列就聲稱 NO_EVENT**。
- `originalHistoricalIssuerPublicationOnEventDateProven=false`：10/16 擷取之 CA 不能倒填為 9/16 已公告版次。
- `independentlyAuditedAdjustmentFormula=false`、`full61DayAdjustedFeatureContinuityAudited=false`：公式及 61 日完整調整序列尚未經 AUDIT／BUILD 驗收。
- `totalReturnOrOfficialAdjustedSeriesClaimed=false`：不稱總報酬還原、不稱 TWSE 官方 61 日調整資料。
- 適用策略 7/7 used-factor manifest 和 legacy Stage1 gate：BUILD 擁有，**資料層不執行 MA/ATR/ret60、評分/排名、不擅改 CA Gate**。用此候選不得直接把 2330 PIT-A 從 0 變 1。
- 正式選股、Shadow、Frozen、推播、D1、System 1 皆未授權、不執行。

下一個真正可以減少阻塞的工作：AUDIT 對此候選做正反證，確認 61 日**所有實際會影響七項因子**的原生 CA、減資、停復牌與價量調整；BUILD 依經批准新版本是否採納且不可混用 raw/ratio 價格空間。若無來源足以證明其他事件沒有發生，該股票相關因子保留 UNKNOWN。
