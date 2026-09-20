# 台股交易決策監控系統｜暫時研究工作清單

更新：2026-09-20

## 1. 正式選股研究資料層
狀態：IMPLEMENTED（V8.7.1）

每次正式盤後入選保存 research-only factor snapshot。歷史可驗證標的只重建選股日以前的價量欄位；市場、產業、法人、基本面缺值不得用現在資料倒填。

已保存／研究：
- 產業超額 RS / Residual RS
- Persistence Score
- 台股 Tick 距離與漲跌停狀態
- ATR / 波動率 / 波動收斂
- 突破品質 / 過熱懲罰
- 法人品質 / 基本面品質 / 產業排名 / 成交量型態

原則：只記錄，不直接影響正式選股分數、持股、推播或資金配置。

## 2. 正式入選股後續路徑
狀態：IMPLEMENTED（V8.7.1）

追蹤：
- D+1 / 3 / 5 / 10 / 20 交易日報酬
- MFE / MAE
- 第一個目標價 / 停損觸發日
- 同一日同時觸發時標記 AMBIGUOUS_SAME_DAY，不猜先後

## 3. Shadow Candidate Archive
狀態：IMPLEMENTED（V8.7.2；V8.7.3+ 持續累積）

每個正式盤後選股日，前瞻保存：
- SELECTED
- QUALIFIED_NOT_SELECTED
- NEAR_MISS
- REJECTED_AFTER_BASE
- BROAD_CONTROL

保存未入選原因、pool、當時 research snapshot。Shadow 標的不監控、不配資金、不推播、不交易，不影響正式排名。禁止偽造歷史 Shadow 樣本。

同日安全重跑採 scan_date 先清除再重寫，避免 stale cohort 殘留。

## 4. Counterfactual Outcome / Selection vs Execution
狀態：IMPLEMENTED / ACCUMULATING（V8.7.4）

Shadow 後續結果：
- D+1 / 3 / 5 / 10 / 20 報酬、MFE、MAE
- 同一選股日配對的 Selection Alpha
- 首次正式 BUY 價相對選股日收盤的 Execution Alpha
- 成功突破 vs 假突破固定 3 日收盤守基準定義
- 下一交易日 Overnight / Intraday 動能拆解
- Residual RS 高低組
- Quiet Strength vs Attention Strength
- Regime Transition / Top5 產業 Persistence

少於 20 個成熟同日配對日期只標記 ACCUMULATING，不下方向性結論。所有定義與反證條件記錄於 research/EXPERIMENT_REGISTRY.md。

## 5. 驗證與防過度擬合
狀態：IMPLEMENTED / CONTINUOUS（V8.7.3+）

- PURGED_FORWARD_HOLDOUT：D+N 結果窗跨過第一個 holdout 日期的 training date 必須 purge。
- 追蹤 factor definition / experiment count。
- UNKNOWN 不當 BAD。
- 新參數、新窗口、新分類視為新的試驗。
- 檢查 coverage、zero-pick、MFE/MAE、盈虧比、成本與滑價、因子冗餘、複雜度。
- 研究結果不得因單次漂亮回測自動升級。
- 若只在單一年度、單一產業、單一 Regime 有效，視為反證警訊。
- V8.7.5：R01–R07 進入機器可讀 experiment ledger；14 個既有 factor definitions + 7 個 frozen experiments 一併納入 multiple-testing 計數。
- V8.7.5：自 2026-09-21 起比對正式選股日與 Shadow archive，監控缺檔、SELECTED 覆蓋不符、BROAD_CONTROL 缺失；只標記研究資料異常，不阻斷交易。
- V8.7.6：新增 FULL_FORMAL_SCAN 因子 pairwise redundancy 診斷、SELECTED D5 30/60/100bps round-trip 成本壓力測試，以及保守的機器化 research maturity gate；任何缺口只會鎖住「提出正式升級審查」資格，不影響正式交易。

## 6. 正式核心升級
狀態：LOCKED

研究因子僅在同時滿足下列條件後「有資格提出正式升級審查」：
- 5 日成熟樣本至少 60 筆
- 其中至少 30 筆是前瞻正式完整快照
- 至少 15 個獨立正式選股日
- 至少 2 個年度
- 至少 2 種市場狀態
- purged 後 training 選股日至少 10 日
- holdout 至少 5 個正式選股日
- training / holdout 效果方向一致
- 不造成 Candidate Coverage 顯著下降或 Zero-Pick Rate 異常上升
- 通過冗餘、交易成本、過度優化與 Baseline/Formal 增量檢查

即使全部通過，系統也不會自動修改正式核心；仍需獨立版本、完整回歸測試與重要策略決策。
