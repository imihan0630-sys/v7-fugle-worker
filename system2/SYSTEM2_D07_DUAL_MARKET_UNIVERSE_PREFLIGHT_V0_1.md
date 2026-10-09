# D07｜雙市場當日全母體 PIT 預檢 V0.1（僅研究）

## 目的

此階段只檢查來源與股票母體的**一致性與風險**，不代表正式全市場選股已有足夠資料。

- TWSE `A1_TWSE_DAILY_CLOSE` 不得低於 A1 官方適配器預設的 **600** 檔四碼普通股最低保護量。
- TPEx `A1_TPEX_DAILY_CLOSE` 不得低於 **450** 檔最低保護量。
- 來源與批次 SHA256 必須對上；當日兩市場均以 REQUIRED 來源參與，不准只用其中一市場補位或降低門檻。
- 正式判定不可使用 `minimumByMarket` 的測試值（例如 TWSE 1、TPEx 1）冒充完整股票池。
- 每筆股票的市場、日期、OHLC 一致性、當下可觀測時間、source row hash、批次內索引一致性都須核對。
- 來源可用時間、capturedAt 必須在決策時點內；過期或缺少來源只能 BLOCKED，不能視為零入選。
- 即使整個純程式預檢通過，回傳狀態仍只是 `READY_FOR_INDEPENDENT_PHYSICAL_PIT_REVALIDATION`；**絕非實際來源位元組驗證、真實 PIT 已通過、完整交易日母體、可正式選股或 D1 寫入許可。**
- 日期交易所日曆／停復牌／公司行動／實體 R2/D1 覆蓋／來源加密驗證仍需 DATA_LANE + AUDIT_LANE 實測。固定 600/450 是最低警戒，不是當日應有完整股票檔數的獨立證據。

## 與 15 關卡的關係

D07 可記 `DUAL_MARKET_UNIVERSE_INTEGRITY_PREFLIGHT_CODED_PARTIAL`，不得 `VERIFIED`。D06 的必要風險報酬因子缺口、B10 Hot D1 實體補足、B11 NC-T01 連續性、A07 額度限制、D08 當日真實候選決策與容量凍結都未因這項程式而自動解決。

所有修改只在 `system2/runtime`、`system2/tests` 等研究路徑；沒有 Worker、Cron、System1 Formal Core、下單／資金／推播或真實 Cloudflare 讀寫。
