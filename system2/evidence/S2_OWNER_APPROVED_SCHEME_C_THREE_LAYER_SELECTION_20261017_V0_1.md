# System 2｜方案 C 雙軌、三層研究選股正式產品決議與 BUILD 第一階段接線

日期：2026-10-17（Asia/Taipei）  
狀態：**OWNER APPROVED PRODUCT DIRECTION / Class A isolated research entrypoint implementation**  
GitHub main 為正式依據。**非 System1 V8、非 System2 PIT 閘門改版、非交易或 Cloudflare 部署授權。**

## 使用者決議

2026-10-17，使用者明確同意 **方案 C「非 PIT 研究預覽 + PIT 正式驗證」**，並明確同意 **三層選股架構**。本次授權範圍是新增可落地的 System 2 獨立選股模式與研究/資料呈現入口，**不是**降低既有 Stage1 PIT-A 資格、啟動 D1 Frozen、正式推播或覆寫 System1 V8 Formal Core。其他市場/公司事件原始資料仍由 DATA_LANE 取得，獨立驗證由 AUDIT_LANE 執行。

之前的 [`SYSTEM2_LAYERED_DAILY_PRELIMINARY_PIT_BACKTEST_V0_1.md`](../SYSTEM2_LAYERED_DAILY_PRELIMINARY_PIT_BACKTEST_V0_1.md) 已於 2026-10-14 owner-approved，並已實際運行來源限定的 `PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_2`；此次 **不重新建構**其盤後行情資料採集、61 日來源稽核或簡單價量描述規則，而是把現存的預覽能力接到明確可隔離的方案 C 三層入口。

## 三層產品契約

| Layer | 對使用者 | Gate | 不能越界 |
|---|---|---|---|
| `NON_PIT_PREVIEW` | 來源限定的當日價量研究候選（非正式買進名單） | 原始盤後預覽報表（已附來源 hash、正向資料/缺漏警告） | 不得稱 PIT、正式策略選股、全市場普通股 Top6 或合法可買 |
| `PIT_A_PROSPECTIVE` | 每日真實決策的可用時點認證 | 真正交易日 T、策略使用因子、官方原始來源 SHA/firstKnownAt/availableAt、CA 連續性、交易狀態與獨立稽核、經授權版本 | 不得用 Preview 冒充 PIT-A；不得覆蓋未知因子或選股 |
| `PIT_B_HISTORICAL` | 歷史版次、完整回測及成本/OOS 檢查 | 原始歷史時間版本 + 真實交易成本/模擬成交 + Holdout/OOS/Regime 反證 | 不得用今天所知回填過去、不得以抽樣績效外推 |

PIT-A 與 PIT-B 仍是獨立的認證流程，不會因 `NON_PIT_PREVIEW` 有資料而被執行、跳過或改寫；正式 Shadow/Frozen/自動推播與真實下單仍需另外核准。

## 重用已存在的實體成果

- `system2/runtime/preliminary_daily_pv_watch_v0_1.mjs` 已提供 `S2_PRELIMINARY_PV_WATCH_V0_2` 有來源 hash 的四碼證券觀察名單，透過已核對的 61 官方日來源和上游稽核報表呈現 **描述性** close>SMA20、5 日報酬正、當日量/額正。這不是正式 SHORT_MOMENTUM 策略分數、正式多策略因子共振，也不是完整普通股身份判定。
- [2026-10-13 實體研究預覽](https://github.com/imihan0630-sys/v7-fugle-worker/blob/main/system2/evidence/S2_P0_V02_DAILY_PRELIMINARY_TDR_PHYSICAL_20261014_V0_1.json) 官方原始來源的 **1974 個四碼證券、580 筆價量描述性符合、顯示 30 筆**，仍 **普通股全市場分母未認證**、CA/PIT 不合格。上述為歷史特定日實際成果，**不代表 2026-10-16 或目前最新交易日的結果**，亦不能挪到其他日期當分母。
- `system2/runtime/three_layer_selection_preview_router_v0_1.mjs` 是新增的 **只讀路由和模式隔離**。只有 `NON_PIT_PREVIEW` 接收真實已存在來源報表形狀；其它兩層明確顯示必須另外呼叫現存認證流程，不能接收預覽報表冒充 PIT。
- 這裡不重算價量因子、不套用尚未 PIT 合格的正式 `BUY_ELIGIBLE`、不調整策略權重、不輸出 trigger/stop/targets。

## 預覽資料完整性及「不能當正式選股」保障

1. 每次讀入原始 `PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_2` 須驗證完整原有 receipt SHA、版號、市場日期、來源來源 hash、列表分母、顯示筆數及 `selectedCount=null` / `zeroPickDay=null` / 無 Frozen/push/order。
2. 觀察候選仍保有原來源 raw 5 日漲幅、aboveSMA20 與風險警示，**`formalStrategyRank=null`**。顯示序號不代表正式 rank；四碼證券也不保證全是普通股；目前 DR name 風險繼續排除。
3. 已知正向 CA 可 **加上阻擋**，絕不可從未發現事件推導不存在事件。版本保守內建實體已知：2330 於 2026-09-16 有除息，官方 CA 原始資料 2026-10-16 21:48 Taipei 實際觀察；對 **2026-10-16** 預覽中 2330，符合真實截止的 positive event 必進 `CA_OR_CLOCK_REVIEW_HOLD`。早於取得時點的決策只會標示事後發現，**不回填當時可知**。這不是有資格的除息調整、也非先前所有其它 CA 都無事件的證明。
4. 盤後來源在要求的決策時間之後才第一次觀察到，標記 `LATE_SOURCE_DESCRIPTIVE_PREVIEW_ONLY`；即使原始價量可見，也不得倒填當日任何正式或可認證績效。
5. PIT 和績效永遠分別保存；**上游「當日預覽」不等於正式 Paper Trading Frozen**。需要另行設計 create-only immutable 時點存證、起算的 future sessions、actual source/PIT 成本檢查和獨立 readback，才可開始前瞻收益評估。
6. 根據現有報表提供原「顯示筆數/描述性符合數/四碼證券總數」；若僅顯示 30/580，不能宣稱完整已掃描所有普通股且 Top30 是正式策略順位。
7. 預覽與 PIT-A/PIT-B 都不會修改 System1 V8 Formal、正式 Cloudflare runtime、監控排程、交易訊號或真實資金配置。

## Phase 1 確認範圍

本 PR：新三層 Router + 測試 + 已核對舊實體 preview 的沿用文件。  
下一個 BUILD 任務：在有 **同交易日** 的可靠原始預覽報表時，接至使用者可見的研究選股列表；明確區分市場/產業 Regime 與各策略，不要讓短動能策略代替所有多頭策略。  
DATA/AUDIT 持續 PIT-A 所需真實使用因子/除息與停復牌/原始時點稽核，PIT-B 歷史驗證獨立進行。

**本次並非「正式每天已產生最新選股」的驗收；目前只完成架構整合中的一個 BUILD 里程碑。**
