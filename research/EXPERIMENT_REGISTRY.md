# 台股交易決策監控系統｜Research Experiment Registry

更新：2026-09-20  
治理狀態：RESEARCH ONLY / FORMAL CORE LOCKED

機器可讀鏡像：V8.7.5 的 RESEARCH_EXPERIMENT_CATALOG。Markdown 與程式定義若不一致，以新 experiment/version 明確修訂，不得靜默覆寫。

本檔用來固定研究假說、定義、反證條件與測試次數。任何漂亮結果都不得直接轉成正式選股規則；新參數、新窗口或新切法視為新的試驗，不得覆寫舊定義後只保留贏家。

## R01 成功突破 vs 假突破
- 假說：選股日仍守在突破基準之上的股票，若後續 3 個交易日收盤都守住基準，其後續路徑可能優於 3 日內收盤跌回基準者。
- 固定突破基準：選股日快照的 priorHigh20。
- 固定分類：HELD_3D＝未來 3 個交易日收盤皆 >= 基準；FAILED_CLOSE_WITHIN_3D＝3 日內任一收盤 < 基準。
- 反證：兩組 D5/D10 報酬、MFE/MAE 無穩定差異，或差異只存在單一 Regime/產業。
- 禁止：看到結果後改成 2 日、5 日或改用最低價判定，除非另立新 experiment ID。

## R02 Selection Alpha vs Execution Alpha
- Selection Alpha：同一選股日 SELECTED 平均後續報酬減同日對照組平均後續報酬，再跨日彙總。
- Execution Alpha：首次正式 BUY 實際價相對選股日收盤價的價格改善；正值代表實際等待到較低價。
- 對照組：BROAD_CONTROL、QUALIFIED_NOT_SELECTED、NEAR_MISS、REJECTED_AFTER_BASE 分開報告，不混成一組。
- 反證：Selection Alpha 不穩定、Execution Alpha 只是少數極端值，或兩者只在單一市場狀態成立。
- 禁止：把未觸發 BUY 的股票當成 0% Execution Alpha。

## R03 產業輪動與 Persistence
- 假說：強勢產業 Top5 的連續留榜與市場 Regime transition 可能影響個股動能延續。
- 固定觀察：相鄰正式研究日 Top5 產業重疊率、各產業 Top5 最長連續天數、Regime transition count。
- 只使用前瞻正式研究日；UNKNOWN 與歷史重建市場狀態不得倒填。
- 反證：高 persistence 未對後續個股路徑提供增量，或效果被 Residual RS 完全解釋。

## R04 Residual RS
- 假說：扣除產業報酬後仍強的個股，比單純跟著強產業上漲的個股具有更獨立的動能。
- 現有欄位：price.residualSectorRs20。
- V8.7.4 第一階段：每個選股日 Shadow 橫截面以中位數切成 HIGH/LOW，只作描述性 D5 對照。
- 反證：HIGH/LOW 在 OOS、不同 Regime、不同年份無方向一致性，或與既有趨勢/突破品質高度冗餘。
- 禁止：Residual RS 與既有 RS 因子重複加權計票。

## R05 盤中動能 vs 隔夜動能
- 固定分解：下一交易日 Overnight = next open / scan close - 1；Intraday = next close / next open - 1。
- 假說：台股個股動能的有效成分可能主要出現在盤中而非隔夜，兩者不可混成單一日報酬。
- 反證：兩者差異不穩定、樣本太少、或只由跳空極端值造成。
- 後續：累積足夠樣本後再研究多日 overnight/intraday compounding；不得先挑最有利窗口。

## R06 Market Regime Transition
- 固定資料：trade_research_days.market_json.regime 的前瞻正式序列。
- 觀察：Regime transition count、各 transition 下 Shadow/Selected 後續路徑。
- 反證：transition 分組樣本不足、轉換定義高度不穩定、或新增 regime 只為解釋過去結果。
- 禁止：用未來市場資訊回填選股日 regime。

## R07 Quiet Strength vs Attention Strength
- Attention proxy：volume.volumeTodayVsPrev5，只代表相對成交量，不等同新聞、搜尋量或社群注意力。
- Strength：price.residualSectorRs20。
- 固定第一階段切法：每個選股日 Shadow 橫截面各自以中位數切分，形成 Quiet Strength / Attention Strength / Quiet Weak / Attention Weak。
- 反證：Quiet Strength 未優於 Attention Strength，或結果只存在極少數日期。
- 禁止：事後改成 1.5x、1.8x、2.0x 等固定倍量門檻追求漂亮結果；新門檻必須另立 experiment ID。

## R08 Two-Engine Momentum
- 目的：檢驗同樣是強勢股，Quiet Underreaction 與 Attention Continuation 是否具有不同的後續路徑與 Regime 敏感度。
- 固定分類：沿用 R07，同一選股日以 residualSectorRs20 與 volumeTodayVsPrev5 的橫截面中位數切分；強勢且低相對量＝QUIET_UNDERREACTION_PROXY，強勢且高相對量＝ATTENTION_CONTINUATION_PROXY。
- 固定結果：D5 / D10 / D20 報酬、MFE、MAE，以及同日兩引擎平均差與 Market Regime 分布。
- 外部證據：月營收、融資融券、官方注意/處置只作 context / falsification metadata，不參與 R08 分類，不加分。
- 反證：兩引擎沒有穩定路徑差異、差異只由少數選股日或單一 Regime 驅動，或被 Residual RS / Breakout Quality 等既有因子完全解釋。
- 禁止：事後尋找 1.5x / 1.8x / 2.0x 量能、任意 RS 門檻或不同持有窗口來挑最好看的版本；任何新切法另立 experiment/version。

## Evidence Readiness Matrix
- V8.7.10 對 R01–R08 使用既有治理門檻顯示研究成熟度，不新增選股條件。
- 狀態：WAITING_DATA、ACCUMULATING、DESCRIPTIVE_READY、DATA_QUALITY_BLOCKED。
- D5 因子型研究沿用至少 60 筆成熟樣本與 15 個獨立選股日；同日配對研究沿用至少 20 個成熟配對日；Regime/Persistence 沿用至少 15 個可用正式研究日。
- DESCRIPTIVE_READY 只表示「可開始描述性解讀」，不是 promotion eligible，更不是交易訊號。
- 若 Shadow Archive 為 RESEARCH_DATA_GAP，相關實驗一律 DATA_QUALITY_BLOCKED，先修資料再解讀。

## 共通治理
- 證據獨立單位優先採「選股日」，不是單一股票筆數；同一選股日多檔股票視為群聚樣本。
- V8.7.8 起，7 組增量對照固定做 leave-one-scan-date-out 敏感度；這是既有預註冊假說的穩健性診斷，不另創造可挑選的新因子。
- 少於 20 個成熟「同日配對」日期：只標記 ACCUMULATING，不作方向性結論。
- 新參數/新窗口/新分類＝新試驗次數，必須保留舊結果。
- 必須同時查看 coverage、zero-pick、MFE、MAE、平均報酬、盈虧比、交易成本與滑價。
- Shadow 標的不監控、不配資金、不推播、不交易。
- 研究結果不得自動修改 Formal core；正式核心升級仍需獨立版本、OOS、purged holdout、冗餘檢查與人工策略審查。
