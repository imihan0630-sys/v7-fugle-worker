# H05-C3｜模擬成交極端情境對抗性測試 V0.1

**工程歸屬：** BUILD_LANE / CORR-013 支持證據；不是 AUDIT_LANE 獨立正式結案。

## 驗收標準

`system2/tests/h05_extreme_execution_adversarial_matrix_v0_1.test.mjs` 對現有未改動的 `execution_simulator_v0_1.mjs` 和 `execution_denominator_guard_v0_1.mjs` 執行 **17 個確定性合成案例**，包含：

- 進場當根同時觸停利停損、下一根同觸停利停損、進場當根觸停損；全部不得偷選最有利先後序列。
- 跳空跌破停損、跳空超越停利；真正模型價格必須反映開盤價而非偷用止損／停利理想價格，成本後結果不具獨立認證。
- 漲停買盤無法成交、觸發日停牌、跌停賣盤無法成交、賣出日停牌；不得偷偷用觸價當作成交。
- OHLC 缺值與純合成未觸發，不能偽裝成具官方日曆與 PIT 證據的零成交分母。
- 買賣滑價不得超過官方漲跌停上下限；只於賣出收取模擬證交稅。
- 公司行動未知須 BLOCKED；違反官方漲跌停價的行情直接拒絕；模擬執行時尚未可用的來源行情直接拒絕。
- **每一個案例**都確認 downstream `classifyS2ExecutionDenominatorV0_1` 不授予 `denominatorEligible`、`confirmedNoFillCount`、`certifiedTradeReturn` 等資料認證。

## 不包含

**不**宣稱 2026-10-08 官方上市櫃交易日集合、停復牌、交易中斷、價格限額、原始行情位元組、第一個真實可知時間、D1/R2 實體讀回或獨立稽核驗證。模擬 `CLOSED` 不等於券商實際成交。

**量化規則：** 只有 CI PASS 且合併 main 後，才可對 75 項驗收帳本的 **H05-C3（同根K、停復牌、極端漲跌停反例）** 計 +1；H05 其餘 C2/C4/C5 還需真正官方與 AUDIT_LANE 實驗；H05 整關維持 `verified=false`、`H05-C5` 不能直接結案。

本檔僅研究測試；未改動 System 1 正式核心、Cloudflare Worker、Cron、正式推播、資金、券商下單、真實 Cloudflare D1/R2 或付費方案。
