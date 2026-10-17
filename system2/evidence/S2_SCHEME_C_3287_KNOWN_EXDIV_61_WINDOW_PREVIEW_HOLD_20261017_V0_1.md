# Scheme C｜3287 TPEx 已知除息「原始 61 日價位空間」唯讀風險提示

日期：2026-10-17 Asia/Taipei  
Owner: BUILD_LANE Class A pure research display/risk hold. DATA source originals and AUDIT independent PIT qualification unchanged.

## 發現的真實缺口

方案 C 原 `system2/runtime/three_layer_selection_preview_router_v0_1.mjs` 對 **2330/TWSE 2026-09-16 除息**已實作 source-only signed 61-date 橫跨風險擋下，惟最新 DATA #1068 的 **3287/TPEX 2026-08-26 真實原生現金除息 1.50** 尚未納入。同一個 source-only 原始 61 trading-day window 在 2026-10-16 包含 8/25（除息前一日）及 8/26（除息當日）；原始前收 **39.00**、官方除息參考價 **37.50**、除息當日原始收盤 **37.00**（官方原生 A1 + CA crosswalk、未經核准的全61日調整行情不可憑此得出）。若直接按原始 price-space 計算某些跨越斷點的 MA/return，會混進已知的價格連續性風險。

## 原始證據（不是 BUILD 新行情請求）

- DATA native **61／61 official TPEx A1 source-only physical anchor**: `system2/migration/evidence/S2_DATA_PITA_3287_TPEX_61_SOURCE_ONLY_PHYSICAL_ANCHOR_20261017_V0_1.json`，證據 Run #38934081985、原始 ZIP #12060640574，獨立 SOURCE Audit Run #38934321405（122／122）。
- DATA native original six-CA row and actual official 8/25→8/26 crosswalk: `system2/migration/issue1068_pita_3287_known_native_ca_crosswalk_v0_1.mjs`；native positive row `115/08/26` / `3287` / `1.50` / `除息`；`caObserved='2026-10-16T13:48:52.509Z'` 為 crosswalk 可重複核對的**保守物理觀察時點**。後來資料不可以倒填到 earlier T 決策。DATA PR #1454/#1455 曾使用真實既有 source Artifacts 完成 61-day price input crossing 與 19 metrics risk-only，不代表 PIT-A。
- 更早的原生 2026/10/14 正向事件群見 `system2/evidence/S2_M09_20261014_REAL_SIX_CA_NEGATIVE_EXPOSURE_20261015_V0_1.json`，但它是 current-source positive / negative-overlay review，不能替代 10/16 確認跨 source price-space 的物理時鐘，也不能證明 CA NO_EVENT。

## 本次直接修改內容

1. 當**真正 signed A1 61 官方 trading dates**包含 `2026-08-26`，且唯一 row venue=`TPEX`、symbol=`3287`，將 DATA 正向事件納入 **唯讀否決 overlay**。在物理 `firstObservedAtUtc=2026-10-16T13:48:52.509Z` 之後才可顯示 `KNOWN_POSITIVE_CA_SOURCE_EVENT_REVIEW_REQUIRED` / `CA_OR_CLOCK_REVIEW_HOLD`；之前仍標示 `LATE_DISCOVERED_CA_EVENT_NOT_BACKDATED`，不可稱事件在原 T 已知。
2. 新 T >2026-10-16 沒有原來源 signed 61 dates 的照原規則拒絕；已知事件從實際 61 dates 消失，就停止**此特定事件**的 hold，不表示其餘 CA 事件不存在；對 3287/TWSE 同四碼不同 market 不得誤套。
3. 舊的 **exact Oct16** source-only physical V0.2 receipt 尚未含 `source61TradingDates`，沿用舊 2330 同等的僅此日期 fallback；Oct13 historic receipt 不能藉此冒充當時 3287 已知事件，也不能外推任何 future T。
4. 生成的 router receipt 增加 `known3287ExdivDateInSource61Window` **診斷欄位**（true/false/null），不修改選股原因的正式結構與策略價格、正式分數/名次或 Frozen。
5. Scheme C PR CI 在 **router 本身與其測試**變更時也須跑真實 10/13 historic replay ＋ 真實 10/16 122/122 同一稽核 ZIP，避免風險分流程式變動卻漏掉 consumer Workflow 的專屬實體驗收。

## 非授權功能

完全不新增 TWSE/TPEx market GET、D1/R2/Worker、Cron、Token/paid service，不計算自製調整收盤、不把官方除息參考價倍數當實際已核准 61 日調整列，不宣告 3287 普通股歷史 CFI 有效、完整 CA NO_EVENT、PIT-A / PIT-B，無 BUY/SELL、entry、stop、targets、Frozen、Shadow、真實推播、績效。System1 V8 Formal Core 0 變動。正常價格/量先維持研究預覽，已知事件只增加 `CA_OR_CLOCK_REVIEW_HOLD`。

## 驗收

新增 5 組 3287 正反案例：Oct19 真實日期範圍 hold、Oct16 historic V0.2 fallback、Oct15 before observed clock 只可 late-positive、rolling 61-date 事件退出後不續標、相同代碼 TWSE venue mismatch 不誤標。原 2330 及其他 14 組測試應全數通過，另外 PR-head System2 Research CI、System1 V8 Regression、D1 Safety Census 必須 SUCCESS 才合併。真正 10/19 自動 source→audit→consumer 仍是待驗證的新交易日獨立 gate。
