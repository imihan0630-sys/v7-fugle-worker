# BR-107｜D09 跨系統母資料誤接與時鐘反證（2026-10-17）
狀態：研究限定；Formal Core LOCKED；無成熟度升級。
基準 main：fe2653a684ebf3b1be04b49bcf00b7af123c9432。

## 新增反證
System 2 2026-10-16 官方 A1 122/122 source audit 與晚於 23:45 的描述性預覽，不等於 System 1 D09-05 所需真正 C1 普通股母體，也不等於 D09-09/10 2026-10-07 的 A1+B5 同觀測 1,973 筆逐列匯出。不同系統同名 A1 不可互換；來源完整≠普通股身份、公司行動、母體雜湊、截止前可得或正式准入。

支持：真實來源稽核改善來源可觀測性。
反證：未見 System1 R3A1 合格 C1 新普通交易日收據，且 System2 來源晚於自身 23:45 截止。
替代解釋：排程、官方首次公布、擷取、母體過濾、公司行動與產業版本不同。
失效條件：缺 C1、A1+B5、原始 SHA 或時鐘時不可改填 0/BAD；晚到只供描述，不能回填決策。
共同根：D09-09／10 消費同一 A1+B5 雜湊，不因兩個模組增加獨立 N。

## 機器化防線
本輪本地執行 `room07_provenance_asof_guard_v0_1.mjs` 與其測試：跨 D09/D10 合計 24/24 確定性測試通過。涵蓋 System1 C1 vs System2 A1、A1+B5 同觀測、不可變雜湊、sourcePublishedAt/capturedAt/cutoff、晚到只描述、UNKNOWN 保留、跨月供應鏈誤接。此為合成負控制，非實體 C1 驗收，非 24 筆市場樣本。

## 驗證限制
PIT：缺 System1 真實 C1 與 BR-043 A1+B5 逐列匯出。
OOS／逐步前推：未開啟 D1/D5/D20/D60 結果；D16 日期群聚、共通支持、多重檢定、冗餘、成本與市場狀態方法收據待補。
正式成熟度：D09 58.6%；D09-05 L2/40；D09-09／10 L3/60，均不變。
下一續接：等待新普通交易日 System1 R3A1 C1 真實收據及既有驗收；等待 BR-043 DATA_LANE A1+B5 同一逐列匯出；不得由 System2 A1 或舊日資料代替。
來源：MARKET_BREADTH_ROTATION_CHECKPOINT.md；2026-10-17 System2 #1452 主分支提交；research/stock_market_learning_tracker_v0_1.json。
