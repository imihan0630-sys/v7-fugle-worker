# 股市知識學習大地圖 — 22領域 / 356模組

Updated: 2026-10-04 11:40 Asia/Taipei
Status: CANONICAL_LEARNING_CURRICULUM_V0_1 / CROSS_SYSTEM  
Formal Core impact: NONE  
Authority boundary: 本檔負責「學習課綱與成熟度追蹤」；System 1 正式研究成熟度仍由 `RESEARCH_MASTER_MAP.md` 與 `research/research_master_map.json` 管理。

## 目的

把「我們還要學什麼、哪個聊天室負責、目前做到哪、什麼才算完成」固定成一張可計數地圖。  
本表不把文件數量當進度；每一模組必須按證據成熟度升級。

## 成熟度

- L0 = 0%：UNSTUDIED，尚未研究
- L1 = 20%：THEORY_UNDERSTOOD，理論與定義已理解
- L2 = 40%：MECHANISM_AND_FALSIFICATION_DEFINED，正向機制與反證條件已定義
- L3 = 60%：TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED，台股PIT資料來源／語意／重播可行
- L4 = 80%：PROSPECTIVE_SHADOW_OR_OOS_EVIDENCE，有前瞻Shadow或OOS證據
- L5 = 100%：ROBUSTNESS_COST_REDUNDANCY_MULTI_REGIME_VALIDATED，已通過多Regime、成本、冗餘、獨立日期與穩健性驗證

## 目前總覽

- 大領域：22
- 二級研究模組：356
- 新完整課綱成熟度：**46.3%**
- 注意：這個百分比與 System 1 現行21模組的46.7%不是同一分母；本表分母更大、更細。
- 100%不是「世界上再也沒有新知識」，而是本版課綱全部達L5；新增新知識時可版本化擴充分母。
- 七項汰留與能力移轉紀錄：`shared-knowledge/CURRICULUM_RETIREMENT_AND_CAPABILITY_LEDGER_V0_1.md`。退休模組不代表刪除其必要工程／研究能力。

| 編號 | 領域 | 模組數 | 完成度 | 專責聊天室 |
|---|---|---:|---:|---|
| D01 | K線／型態／價格結構 | 11 | 52.7% | 01｜K線與型態研究室 |
| D02 | 價量關係 | 12 | 60.0% | 02｜價量研究室 |
| D03 | 趨勢／動能／反轉／技術指標 | 12 | 56.7% | 03｜技術指標與趨勢動能研究室 |
| D04 | 波動率／波動狀態 | 10 | 58% | 04｜波動與市場微結構研究室 |
| D05 | 市場微結構／撮合／流動性 | 14 | 54.3% | 04｜波動與市場微結構研究室 |
| D06 | 法人／籌碼／槓桿／擁擠／被動資金 | 18 | 47.8% | 05｜法人與籌碼研究室 |
| D07 | 基本面／財報／資訊動態 | 34 | 14.1% | 06｜基本面與估值研究室 |
| D08 | 估值 | 19 | 27.4% | 06｜基本面與估值研究室 |
| D09 | 產業／族群／市場廣度／輪動 | 14 | 57.1% | 07｜產業與供應鏈研究室 |
| D10 | 供應鏈／產能／庫存／原物料傳導 | 13 | 56.9% | 07｜產業與供應鏈研究室 |
| D11 | 公司行動／重大事件／事件風險 | 19 | 56.8% | 08｜事件與新聞研究室 |
| D12 | 期貨／選擇權／衍生品 | 17 | 40% | 09｜衍生品與國際總經研究室 |
| D13 | 總體經濟／跨市場傳導 | 19 | 41.1% | 09｜衍生品與國際總經研究室 |
| D14 | 交易成本／執行品質／Execution Alpha | 18 | 33.3% | 10｜投組風控與交易執行研究室 |
| D15 | 投資組合／風險／資金利用／部位生命週期 | 21 | 36.2% | 10｜投組風控與交易執行研究室 |
| D16 | 統計驗證／PIT／Shadow／OOS／防過擬合 | 25 | 45.6% | 11｜統計驗證與策略市場狀態研究室 |
| D17 | 新聞／事件半衰期／受益受害傳導 | 14 | 52.9% | 08｜事件與新聞研究室 |
| D18 | 市場Regime×策略互動 | 15 | 37.3% | 11｜統計驗證與策略市場狀態研究室 |
| D19 | 資產定價／因子投資／市場異象 | 15 | 41.3% | 12｜資產定價與因子研究室 |
| D20 | 行為金融／投資人注意力／市場心理 | 13 | 12.3% | 13｜行為金融與市場心理研究室 |
| D21 | 公司治理／經營者／內部人／控制權品質 | 11 | 33.8% | 14｜公司治理與內部人研究室 |
| D22 | 信用市場／資本結構／融資壓力／股債傳導 | 12 | 0% | 15｜信用市場與資本結構研究室 |

## 母專案歸屬：自我進化學習研究室

- 所有 00～15 學習／研究專線統一歸入 ChatGPT Project（專案）**「自我進化學習研究室」**。
- 此母專案只負責「學習、研究、反證、驗證、知識累積與研究治理」。
- System 1 / System 2 的工程實作、部署、監控、正式策略與 Formal Core（正式核心）維持原系統專案，不移入本母專案。
- 已達對話上限的 `(x)` / `（x）` 聊天若 ChatGPT 顯示「移至專案」，可移入本母專案作為唯讀歷史研究來源；若介面不提供移動選項，保留原位置並以 GitHub checkpoint（續接點）作為正式承接。
- 新建立的研究聊天室必須直接從「自我進化學習研究室」內新增，避免研究再散落到其他專案或一般聊天。
- 聊天室達上限時，只替換聊天室本體；專線編號、Dxx模組、GitHub checkpoint 與成熟度不得重置。

## 聊天室生命週期規則

- 聊天室名稱前綴為 `(x)` 或 `（x）`：代表已達對話上限，狀態固定為 **ARCHIVED_FULL**。只能作為歷史證據／舊checkpoint來源，不得再安排任何新研究工作。
- 未帶 `(x)` / `（x）` 的聊天室不代表一定適合承接新主題；仍需符合本地圖的專線範圍。
- 舊聊天室若題目過寬或混合多領域，可標為 **LEGACY_ACTIVE**：允許完成既有工作，但新研究必須轉入00-15專責研究室。
- 新研究室若達對話上限，將原聊天室改標 `(x)`，並以同一專線編號建立續接聊天室；GitHub checkpoint 不變，避免重頭研究。
- 任何新聊天室開始研究前，必須先讀本地圖、該專線checkpoint與最新main，不得從聊天記憶猜進度。

### 已確認封存的舊研究聊天室

- `(x)台股研究移轉學習`：ARCHIVED_FULL，只保留歷史研究來源。
- `(x)深化價量選股研究`：ARCHIVED_FULL；其價量研究由 **02｜價量研究室** 續接。
- `（x)股票知識比較`：ARCHIVED_FULL；其跨領域內容由 **00｜研究總控室** 分流到各專線。
- `（6）完成盤後恢復驗證`：ARCHIVED_FULL；不得再承接 D01，新建 **01｜K線與型態研究室** 續接相關K線／型態研究。

## 聊天室路由規則

- 00｜研究總控室：只管理地圖、進度、依賴、重複研究與跨線整合，不自行深挖單一主題。
- 01｜K線與型態研究室：D01。
- 02｜價量研究室：D02。
- 03｜技術指標與趨勢動能研究室：D03。
- 04｜波動與市場微結構研究室：D04-D05。
- 05｜法人與籌碼研究室：D06。
- 06｜基本面與估值研究室：D07-D08。
- 07｜產業與供應鏈研究室：D09-D10。
- 08｜事件與新聞研究室：D11、D17。
- 09｜衍生品與國際總經研究室：D12-D13。
- 10｜投組風控與交易執行研究室：D14-D15。
- 11｜統計驗證與策略市場狀態研究室：D16、D18。
- 12｜資產定價與因子研究室：D19。
- 13｜行為金融與市場心理研究室：D20。
- 14｜公司治理與內部人研究室：D21。
- 15｜信用市場與資本結構研究室：D22。
- System 1 / System 2 工程聊天室：只能消費已研究成果、做系統專屬實作與驗證，不重複「從頭學」共享市場知識。

## 每個研究聊天室固定頁首

```
研究專線：
對應大地圖編號：
目前成熟度：
已完成模組：
正在研究模組：
下一個研究模組：
禁止跨入領域：
GitHub專屬checkpoint：
最後同步main SHA：
```

## 二級課綱

### D01｜K線／型態／價格結構 — 52.7%

專責：01｜K線與型態研究室  
證據錨點：`KLINE_PATTERN_CHECKPOINT.md`、`KLINE_PATTERN_RESEARCH.md`、`TARGET_RESISTANCE_RR_RESEARCH.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D01-01 | K棒資料、交易日與Session語意 | L3 台股PIT資料可行 | 60% |
| D01-02 | 單根K線型態 | L2 機制＋反證 | 40% |
| D01-03 | 多根K線組合 | L2 機制＋反證 | 40% |
| D01-04 | 支撐／壓力／區域拓樸 | L3 台股PIT資料可行 | 60% |
| D01-05 | 突破／假突破生命週期 | L3 台股PIT資料可行 | 60% |
| D01-06 | W底／M頭／雙底雙頂 | L3 台股PIT資料可行 | 60% |
| D01-07 | 杯柄／碗型／底部基地 | L2 機制＋反證 | 40% |
| D01-08 | VCP波動收斂型態 | L3 台股PIT資料可行 | 60% |
| D01-09 | 缺口與漲跌停限制型態 | L2 機制＋反證 | 40% |
| D01-10 | 多尺度／多週期型態一致性 | L3 台股PIT資料可行 | 60% |
| D01-11 | 目標價／阻力／RR幾何 | L3 台股PIT資料可行 | 60% |

### D02｜價量關係 — 48.3%

專責：02｜價量研究室  
證據錨點：`PRICE_VOLUME_CHECKPOINT.md`、`PRICE_VOLUME_RESEARCH.md`、`PRICE_VOLUME_EVIDENCE.md`、`PRICE_VOLUME_HYPOTHESIS_LEDGER.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D02-01 | 成交量單位與資料語意 | L3 台股PIT資料可行 | 60% |
| D02-02 | RVOL相對成交量與同時段正規化 | L3 台股PIT資料可行 | 60% |
| D02-03 | 突破量能確認 | L3 台股PIT資料可行 | 60% |
| D02-04 | 量縮整理／Volume Dry-up | L3 台股PIT資料可行 | 60% |
| D02-05 | 爆量／高潮量／分配量 | L3 台股PIT資料可行 | 60% |
| D02-06 | Effort-vs-Result量價努力與結果 | L3 台股PIT資料可行 | 60% |
| D02-07 | OBV能量潮 | L3 台股PIT資料可行 | 60% |
| D02-08 | 吸籌／出貨代理變數 | L3 台股PIT資料可行 | 60% |
| D02-09 | 價量背離 | L3 台股PIT資料可行 | 60% |
| D02-10 | 成交量狀態×趨勢互動 | L3 台股PIT資料可行 | 60% |
| D02-11 | 流動性量能門檻與例外 | L3 台股PIT資料可行 | 60% |
| D02-12 | 盤中量能曲線／Volume Profile | L3 台股PIT資料可行 | 60% |

### D03｜趨勢／動能／反轉／技術指標 — 56.7%

> D03 source/acceptance latest 2026-10-04: TI-594~610 physically resolve TPEx halt/resumption, ex-right/ex-dividend and capital-reduction machine sources with bounded JSON/CSV reconciliation, and physically PASS the frozen Bollinger first-parent acceptance logic. D03-10 remains L2/40 because the first genuine post-V8.17 Taiwan parent generation has not yet occurred; D03 stays 56.7%. Tracker is authoritative.

專責：03｜技術指標與趨勢動能研究室  
證據錨點：`TECHNICAL_INDICATOR_CHECKPOINT.md`、`TREND_MOMENTUM_REVERSAL_CHECKPOINT.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D03-01 | 均線排列／斜率／趨勢狀態 | L3 台股PIT資料可行 | 60% |
| D03-02 | ret5／ret20／ret60直接報酬動能 | L3 台股PIT資料可行 | 60% |
| D03-03 | 趨勢持續性與Persistence | L3 台股PIT資料可行 | 60% |
| D03-04 | 動能延續 | L3 台股PIT資料可行 | 60% |
| D03-05 | Pullback回檔與短期反轉 | L3 台股PIT資料可行 | 60% |
| D03-06 | KD隨機指標 | L3 台股PIT資料可行 | 60% |
| D03-07 | RSI相對強弱指標 | L3 台股PIT資料可行 | 60% |
| D03-08 | MACD指數平滑異同移動平均 | L3 台股PIT資料可行 | 60% |
| D03-09 | ADX平均趨向指標 | L2 機制＋反證 | 40% |
| D03-10 | Bollinger Bands布林通道 | L2 機制＋反證 | 40% |
| D03-12 | 指標背離／repaint-safe確認 | L3 台股PIT資料可行 | 60% |
| D03-13 | 多時間框架趨勢／動能衝突 | L3 台股PIT資料可行 | 60% |

> **D03-01 正式子題補充：均線扣抵** — 納入扣抵價、扣高／扣低、SMA 5／10／20／60／120 日未來 1／3／5 日扣抵序列、均線斜率轉正／轉負與翻揚／走平／下彎預判；EMA 另按遞迴權重語意研究。此子題須與 MA slope、MA alignment、retN、trend persistence、price-vs-MA 做冗餘驗證，不得重複加分。


### D04｜波動率／波動狀態 — 58%

專責：04｜波動與市場微結構研究室  
證據錨點：`VOLATILITY_REGIME_RESEARCH.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D04-01 | ATR平均真實波幅 | L3 台股PIT資料可行 | 60% |
| D04-02 | RV5／RV20已實現波動率 | L3 台股PIT資料可行 | 60% |
| D04-03 | 波動收縮 | L3 台股PIT資料可行 | 60% |
| D04-04 | 波動擴張／Shock | L3 台股PIT資料可行 | 60% |
| D04-05 | 波動Regime狀態轉換 | L3 台股PIT資料可行 | 60% |
| D04-06 | 市場波動×個股波動互動 | L3 台股PIT資料可行 | 60% |
| D04-07 | 波動與趨勢／突破交互作用 | L3 台股PIT資料可行 | 60% |
| D04-08 | 波動率縮放部位概念 | L2 機制＋反證 | 40% |
| D04-09 | 尾端／跳空波動風險 | L3 台股PIT資料可行 | 60% |
| D04-10 | 漲跌停對波動估計污染 | L3 台股PIT資料可行 | 60% |

### D05｜市場微結構／撮合／流動性 — 54.3%

專責：04｜波動與市場微結構研究室  
證據錨點：`MICROSTRUCTURE_CHECKPOINT.md`、`MICROSTRUCTURE_RESEARCH.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D05-01 | 台股Tick跳動單位 | L3 台股PIT資料可行 | 60% |
| D05-02 | 漲跌停與限制價格機制 | L3 台股PIT資料可行 | 60% |
| D05-03 | Bid-Ask Spread買賣價差 | L3 台股PIT資料可行 | 60% |
| D05-04 | Order-book Depth委買賣深度 | L3 台股PIT資料可行 | 60% |
| D05-05 | Order Flow Imbalance訂單流失衡 | L2 機制＋反證 | 40% |
| D05-06 | Opening / Closing Auction & Auction Imbalance（開收盤集合競價與競價不平衡） | L3 台股PIT資料可行 | 60% |
| D05-07 | 盤中撮合／VI與異常撮合狀態 | L3 台股PIT資料可行 | 60% |
| D05-08 | 零股與整股執行差異 | L3 台股PIT資料可行 | 60% |
| D05-09 | 流動性狀態分類 | L3 台股PIT資料可行 | 60% |
| D05-10 | 停牌／無交易日／pseudo-bar語意 | L3 台股PIT資料可行 | 60% |
| D05-11 | Market Impact市場衝擊機制 | L2 機制＋反證 | 40% |
| D05-12 | Adverse Selection／Order-flow Toxicity逆向選擇與訂單流毒性 | L2 機制＋反證 | 40% |
| D05-13 | Queue Position／Order Priority委託排隊位置與優先權 | L2 機制＋反證 | 40% |
| D05-14 | Market Integrity／Abnormal Trading Patterns市場完整性與異常交易型態 | L3 台股PIT資料可行 | 60% |


### D06｜法人／籌碼／槓桿／擁擠／被動資金 — 47.8%

專責：05｜法人與籌碼研究室  
證據錨點：`INSTITUTIONAL_CROWDING_RESEARCH.md`、`LEVERAGE_SHORTING_CHECKPOINT.md`、`PASSIVE_FLOW_INDEX_REBALANCING_CHECKPOINT.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D06-01 | 外資現貨流 | L3 台股PIT資料可行 | 60% |
| D06-02 | 投信流 | L3 台股PIT資料可行 | 60% |
| D06-03 | 自營商自營／避險拆分 | L3 台股PIT資料可行 | 60% |
| D06-04 | 法人連買／持續性 | L3 台股PIT資料可行 | 60% |
| D06-05 | 持股集中度／Ownership | L2 機制＋反證 | 40% |
| D06-06 | Crowding擁擠交易 | L3 台股PIT資料可行 | 60% |
| D06-07 | 融資餘額／融資變化 | L2 機制＋反證 | 40% |
| D06-08 | 融券餘額／Margin Short | L2 機制＋反證 | 40% |
| D06-09 | 借券與實際借券賣出 | L2 機制＋反證 | 40% |
| D06-10 | TDCC集保股權分散 | L3 台股PIT資料可行 | 60% |
| D06-11 | ETF／指數被動資金與再平衡 | L2 機制＋反證 | 40% |
| D06-12 | 法人流對流動性／價格反應正規化 | L3 台股PIT資料可行 | 60% |
| D06-13 | 券商分點／主力代理變數 | L2 機制＋反證 | 40% |
| D06-14 | 當沖率／短線換手 | L2 機制＋反證 | 40% |
| D06-15 | 官股行庫／特定資金流 | L2 機制＋反證 | 40% |
| D06-16 | ETF Mechanics：Creation／Redemption／AP／Premium-Discount／Tracking／Liquidity ETF申贖、參與券商、溢折價、追蹤與流動性 | L2 機制＋反證 | 40% |
| D06-18 | Securities Lending Economics／Borrow Fee／Availability／Utilization借券經濟、費率、可借量與使用率 | L2 機制＋反證 | 40% |
| D06-19 | Retail / Individual Investor Participation & Flow（散戶／自然人參與與流向） | L2 機制＋反證已定義 | 40% |


### D07｜基本面／財報／資訊動態 — 14.1%

專責：06｜基本面與估值研究室  
證據錨點：`FUNDAMENTAL_INFORMATION_DYNAMICS_CHECKPOINT.md`、`FUNDAMENTAL_INFORMATION_DYNAMICS_RESEARCH.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D07-01 | 月營收與YoY／MoM | L3 台股PIT資料可行 | 60% |
| D07-02 | 季度EPS與獲利成長 | L2 機制＋反證 | 40% |
| D07-03 | 毛利率／營益率變化 | L2 機制＋反證 | 40% |
| D07-04 | ROE／ROIC資本報酬 | L2 機制＋反證 | 40% |
| D07-05 | 營業／自由現金流 | L2 機制＋反證 | 40% |
| D07-06 | 資產負債表與槓桿品質 | L2 機制＋反證 | 40% |
| D07-07 | 盈餘品質／應計項目 | L2 機制＋反證 | 40% |
| D07-08 | PIT財報Vintage與first-known時間 | L3 台股PIT資料可行 | 60% |
| D07-09 | 成長加速度／基本面Surprise | L2 機制＋反證 | 40% |
| D07-10 | 資料可用性與fundamentalScore混淆 | L2 機制＋反證 | 40% |
| D07-11 | 分析師預估／預期修正 | L2 機制＋反證 | 40% |
| D07-12 | Business Model／Revenue Engine商業模式與收入引擎 | L0 未研究 | 0% |
| D07-13 | Competitive Advantage／Moat競爭優勢與護城河 | L0 未研究 | 0% |
| D07-14 | Unit Economics／Operating Leverage單位經濟與營業槓桿 | L0 未研究 | 0% |
| D07-15 | Customer／Product／Geography Concentration客戶產品地區集中 | L0 未研究 | 0% |
| D07-16 | Product Lifecycle／TAM／Penetration產品生命週期與滲透率 | L0 未研究 | 0% |
| D07-17 | Management Guidance Quality管理層展望品質 | L0 未研究 | 0% |
| D07-18 | WACC／Cost of Capital加權平均資金成本 | L0 未研究 | 0% |
| D07-19 | Capital Budgeting／NPV／IRR／Real Options資本預算與實質選擇權 | L0 未研究 | 0% |
| D07-20 | Integrated Three-statement Forecast三大財報聯動預測 | L0 未研究 | 0% |
| D07-21 | Revenue／Margin／OPEX Driver Forecast營收毛利費用驅動預測 | L0 未研究 | 0% |
| D07-22 | Working Capital／CAPEX／FCF Forecast營運資金資本支出與自由現金流預測 | L0 未研究 | 0% |
| D07-23 | Scenario／Sensitivity Analysis情境與敏感度分析 | L0 未研究 | 0% |
| D07-24 | Revenue Recognition／Accounting Policy Quality收入認列與會計政策品質 | L0 未研究 | 0% |
| D07-25 | Forensic Accounting Red Flags鑑識會計與財報紅旗 | L0 未研究 | 0% |
| D07-26 | Income Tax／Deferred Tax／Effective Tax Rate所得稅遞延稅與有效稅率 | L0 未研究 | 0% |
| D07-27 | Lease Accounting／Off-balance Commitments租賃會計與表外承諾 | L0 未研究 | 0% |
| D07-28 | Pension／Share-based Compensation退休金與股份支付 | L0 未研究 | 0% |
| D07-29 | Diluted EPS／Share-count Dilution稀釋每股盈餘與股數稀釋 | L0 未研究 | 0% |
| D07-30 | Multinational Operations／FX Translation跨國營運與外幣換算 | L0 未研究 | 0% |
| D07-31 | Business Combination／Goodwill／Impairment企業合併商譽與減損 | L0 未研究 | 0% |
| D07-32 | Financial Institutions Operating Metrics銀行保險等金融機構營運與資產負債指標 | L0 未研究 | 0% |
| D07-33 | Intangible Capital／R&D／Innovation Accounting無形資本、研發與創新會計 | L0 未研究 | 0% |
| D07-34 | Dividend / Payout Policy & Sustainability股利／配發政策與永續性 | L0 未研究 | 0% |


### D08｜估值 — 27.4%

專責：06｜基本面與估值研究室  
證據錨點：`VALUATION_RESEARCH.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D08-01 | 官方當日PE／PB資料語意 | L3 台股PIT資料可行 | 60% |
| D08-02 | 產業相對PE | L2 機制＋反證 | 40% |
| D08-03 | 歷史PE／PB百分位 | L3 台股PIT資料可行 | 60% |
| D08-04 | Forward PE預估本益比 | L2 機制＋反證 | 40% |
| D08-05 | PEG本益成長比 | L2 機制＋反證 | 40% |
| D08-06 | EV/EBITDA／EV/Sales／P/S Enterprise & Sales Multiples企業價值與營收倍數 | L2 機制＋反證 | 40% |
| D08-07 | FCF Yield自由現金流殖利率 | L2 機制＋反證 | 40% |
| D08-08 | 成長×估值聯合判斷 | L2 機制＋反證 | 40% |
| D08-09 | 同業／產業Peer正規化 | L2 機制＋反證 | 40% |
| D08-10 | 負EPS／週期低點／價值陷阱 | L2 機制＋反證 | 40% |
| D08-11 | 估值×市場Regime互動 | L2 機制＋反證 | 40% |
| D08-12 | 除權息／增減資對估值分母防火牆 | L2 機制＋反證 | 40% |
| D08-13 | DCF／FCFF／FCFE現金流折現估值 | L0 未研究 | 0% |
| D08-14 | DDM股利折現模型 | L0 未研究 | 0% |
| D08-15 | Residual Income剩餘利益估值 | L0 未研究 | 0% |
| D08-16 | SOTP分部加總估值 | L0 未研究 | 0% |
| D08-17 | Liquidation／Asset-based Value清算與資產價值 | L0 未研究 | 0% |
| D08-18 | Financial Institution Valuation／P-TBV／Embedded Value金融機構專屬估值 | L0 未研究 | 0% |
| D08-19 | Reverse DCF／Market-Implied Expectations／Expectations Gap反向DCF、市場隱含預期與預期差 | L0 未研究 | 0% |


### D09｜產業／族群／市場廣度／輪動 — 57.1%

> 2026-10-04 BR-062：D18 市場狀態建構器依賴已達 L3，但缺與真實官方廣度同 marketDate／decisionTimestamp 的持久化聯合收據；測試 fixture 與事後歷史重建均不得替代，因此 D09-12 維持 L2。

> 2026-10-04 BR-045：以 TWSE 34 個官方產業報酬指數的 2026-09-23、09-24、09-30、10-01、10-02 五個獨立收盤建立主流族群領導生命週期；參與狀態可重播、領導集合可追蹤，D09-07 升至 L3。個股領導生命週期與預測效果仍未成立。

> 2026-10-03 H01 專科驗證完成並已送總控收件：D09-13 已有晶圓代工、鋼鐵、PCB 三個台灣產業結構 PIT 控制；D09-14 已有半導體／鋼鐵／電動車公司策略動作、失敗／中止控制與原生結果狀態契約。兩者維持 L3/60%，專科建議 KEEP_SEPARATE，但共用市占／產能／價格／毛利父證據不得重複計分；下一步 BR-057／BR-058。

專責：07｜產業與供應鏈研究室  
證據錨點：`MARKET_BREADTH_ROTATION_CHECKPOINT.md`、`MARKET_BREADTH_ROTATION_RESEARCH.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D09-01 | 產業分類與分類Vintage | L3 台股PIT資料可行 | 60% |
| D09-02 | Sector RS產業相對強弱 | L3 台股PIT資料可行 | 60% |
| D09-03 | Residual RS殘差相對強弱 | L3 台股PIT資料可行 | 60% |
| D09-04 | 漲跌家數／Advance-Decline | L3 台股PIT資料可行 | 60% |
| D09-05 | Above-MA廣度 | L2 機制＋反證 | 40% |
| D09-06 | Sector Rotation族群輪動 | L3 台股PIT資料可行 | 60% |
| D09-07 | 領導股／主流族群生命週期 | L3 台股PIT資料可行 | 60% |
| D09-08 | 大型股vs小型股領導 | L3 台股PIT資料可行 | 60% |
| D09-09 | 橫截面報酬離散度 | L3 台股PIT資料可行 | 60% |
| D09-10 | 產業成交值／集中度 | L3 台股PIT資料可行 | 60% |
| D09-11 | 題材股與正式產業分類橋接 | L3 台股PIT資料可行 | 60% |
| D09-12 | Breadth×Regime交互作用 | L2 機制＋反證 | 40% |
| D09-13 | Industry Structure／Competitive Dynamics／Porter Five Forces（產業結構／競爭動態／波特五力） | L3 台股PIT資料可行 | 60% |
| D09-14 | Firm Competitive Strategy／Strategic Actions（公司競爭策略／策略行動） | L3 台股PIT資料可行 | 60% |


### D10｜供應鏈／產能／庫存／原物料傳導 — 60.0%
> 2026-10-07 SC-077／SC-078 成熟度一致性校正：依全域 L3 = TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED 定義，D10-01 已具跨公司 issuer-native 節點／邊／資格限制、effective-dated append-only graph 語意、UNKNOWN 防火牆與現行 TWSE 官方來源唯讀前瞻觀測能力；D10-02 已具事前固定 1M／2M／3M、六個鋼鐵版本、銅箔→CCL→PCB 實體鏈、MOEA 原生產品碼／單位與 deterministic replay、current release-frontier 時鐘語意。兩者由 L2/40% 升至 L3/60%。這是 PIT 資料可行性升級，不代表通用固定 lag 成立、不代表完整全網路供應圖譜、不代表 L4 前瞻/OOS 成立。D10 由 56.9% 升至 60.0%。


> 2026-10-04 SC-050／SC-054：D10-02 完成事前固定 1M／2M／3M 候選落後期的六個鋼鐵版本重播。廢鋼→小鋼胚方向一致率由短窗 1M 的 2/2 擴窗後降為 3/5；2M=2/4、3M=1/3，固定 lag 未成立。電子產品外銷訂單→電子零組件→電腦電子光學生產亦顯示方向翻轉與共同 AI/HPC/cloud 需求混淆。D10-02 維持 L2；D10-09 維持 L3。

> 2026-10-04 SC-052：以台積電、中鋼、環球晶建立跨公司／跨半導體與鋼鐵的產能來源契約；名目產能、實際產量、出貨、高量產與正式稼動率分離，缺失值維持 UNKNOWN。D10-04 升至 L3，但仍無 L4 前瞻結果。

> 2026-10-04 SC-047／SC-048：SC-047 追加 BIS 政策版本中的最終母公司／使用者與具名授權語意，但明確標示並非前瞻收據；SC-048 以 6488 環球晶加入第二家公司政策→產能控制，實際撥款與目前高量產仍 UNKNOWN，因此 D10-13／D10-14 維持 L3。

> 2026-10-04 SC-045／SC-046：貿易政策／出口管制與產業政策／補貼兩個新課綱模組均已建立台灣公司 PIT 可重播收據，D10-13／D10-14 升至 L3。SC-045 保留規則撤回、核准名單與授權延續等負向對照；SC-046 明確分離核定上限、實際撥款、建廠、資格認證與高量產。

> 2026-10-02 SC-040／SC-041／SC-042：D10-07 已有 2026-07～09 三個獨立 NDC/CIER PMI release vintages與 bounded issuer product-scope bridge；SC-042 以明確 shortage/allocation、交期、價格、庫存與反例建立缺貨／供需缺口 PIT event contract，使 D10-08 升至 L3。公司營收曝險權重、survey membership、issuer-native backlog 與 OOS/Shadow outcomes 仍未成立。

專責：07｜產業與供應鏈研究室  
證據錨點：`SUPPLY_CHAIN_LEAD_LAG_RESEARCH.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D10-01 | 上下游供應鏈圖譜 | L3 台股PIT資料可行 | 60% |
| D10-02 | 供應鏈Lead-Lag領先落後 | L3 台股PIT資料可行 | 60% |
| D10-03 | 庫存週期 | L3 台股PIT資料可行 | 60% |
| D10-04 | 產能／擴產／稼動率 | L3 台股PIT資料可行 | 60% |
| D10-05 | 原物料／報價傳導 | L3 台股PIT資料可行 | 60% |
| D10-06 | Pricing Power定價能力 | L3 台股PIT資料可行 | 60% |
| D10-07 | 訂單／交期／Backlog | L3 台股PIT資料可行 | 60% |
| D10-08 | 缺貨／供需缺口事件 | L3 台股PIT資料可行 | 60% |
| D10-09 | 上游與下游不對稱傳導 | L3 台股PIT資料可行 | 60% |
| D10-10 | 供應鏈事件PIT時間戳 | L3 台股PIT資料可行 | 60% |
| D10-12 | Industry-specific Transmission Model／Issuer Exposure Mapping產業專屬傳導模型與公司曝險映射 | L3 台股PIT資料可行 | 60% |
| D10-13 | Trade Policy／Export Controls／Sanctions Supply-chain Transmission貿易政策出口管制制裁供應鏈傳導 | L3 台股PIT資料可行 | 60% |
| D10-14 | Industrial Policy／Subsidy／Geopolitical Bottleneck產業政策補貼與地緣瓶頸 | L3 台股PIT資料可行 | 60% |


### D11｜公司行動／重大事件／事件風險 — 56.8%

專責：08｜事件與新聞研究室  
證據錨點：`CORPORATE_ACTIONS_CAPITAL_SUPPLY_CHECKPOINT.md`、`EVENT_RISK_CHECKPOINT.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D11-01 | 除權息／Reference Price調整 | L3 台股PIT資料可行 | 60% |
| D11-02 | 現金增資／權利發行 | L3 台股PIT資料可行 | 60% |
| D11-03 | 減資／股票分割／面額變更 | L3 台股PIT資料可行 | 60% |
| D11-04 | 可轉債／CB事件 | L3 台股PIT資料可行 | 60% |
| D11-05 | 庫藏股 | L3 台股PIT資料可行 | 60% |
| D11-06 | 併購／處分／重大交易 | L3 台股PIT資料可行 | 60% |
| D11-07 | 停牌／復牌 | L3 台股PIT資料可行 | 60% |
| D11-08 | 重大訊息first-known時間 | L2 機制＋反證 | 40% |
| D11-09 | 財報／月營收／法說事件窗 | L3 台股PIT資料可行 | 60% |
| D11-10 | Overnight Gap跳空事件風險 | L3 台股PIT資料可行 | 60% |
| D11-11 | 漲跌停造成多日退出風險 | L3 台股PIT資料可行 | 60% |
| D11-12 | Corporate-action歷史連續性防火牆 | L3 台股PIT資料可行 | 60% |
| D11-13 | 負面證據／無事件的完整性證明 | L2 機制＋反證 | 40% |
| D11-14 | 指數調整事件與被動流 | L3 台股PIT資料可行 | 60% |
| D11-15 | IPO／Listing／Bookbuilding首次上市與詢價圈購 | L3 台股PIT資料可行 | 60% |
| D11-16 | Lock-up Expiry／Insider Supply禁售期到期與內部人供給 | L2 機制＋反證 | 40% |
| D11-17 | Secondary Offering／Private Placement後續發行與私募 | L3 台股PIT資料可行 | 60% |
| D11-18 | Tender Offer／Going Private／Delisting公開收購私有化與下市 | L3 台股PIT資料可行 | 60% |
| D11-19 | Spin-off／Merger Arbitrage／Deal-break Risk分拆併購套利與破局風險 | L3 台股PIT資料可行 | 60% |


### D12｜期貨／選擇權／衍生品 — 40%

專責：09｜衍生品與國際總經研究室  
證據錨點：`DERIVATIVES_VOLATILITY_CHECKPOINT.md`、`DERIVATIVES_VOLATILITY_RESEARCH.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D12-01 | 台指期Basis基差 | L2 機制＋反證 | 40% |
| D12-02 | 期貨未平倉OI | L2 機制＋反證 | 40% |
| D12-03 | 外資期貨部位 | L2 機制＋反證 | 40% |
| D12-04 | PCR賣權買權比 | L2 機制＋反證 | 40% |
| D12-05 | TAIEX VIX台灣波動率指數 | L2 機制＋反證 | 40% |
| D12-06 | Implied Volatility隱含波動率 | L2 機制＋反證 | 40% |
| D12-07 | Skew偏斜／Term Structure期限結構 | L2 機制＋反證 | 40% |
| D12-08 | Gamma Exposure／Dealer Gamma | L2 機制＋反證 | 40% |
| D12-09 | 到期／結算效應 | L2 機制＋反證 | 40% |
| D12-10 | 夜盤期貨與隔夜資訊 | L2 機制＋反證 | 40% |
| D12-11 | 選擇權流動性／微結構 | L2 機制＋反證 | 40% |
| D12-12 | 衍生品狀態對個股／大盤的增量價值 | L2 機制＋反證 | 40% |
| D12-13 | Greeks：Delta／Gamma／Vega／Theta | L2 機制＋反證 | 40% |
| D12-14 | IV-RV Spread隱含與實現波動差 | L2 機制＋反證 | 40% |
| D12-15 | Volatility Risk Premium波動率風險溢酬 | L2 機制＋反證 | 40% |
| D12-16 | Volatility Surface／Smile波動率曲面與微笑 | L2 機制＋反證 | 40% |
| D12-17 | Option Payoff Structures／Put-Call Parity／Synthetic Positions／Strategies選擇權損益結構、買賣權平價、合成部位與策略 | L2 機制＋反證 | 40% |


### D13｜總體經濟／跨市場傳導 — 41.1%

專責：09｜衍生品與國際總經研究室  
證據錨點：`MACRO_CROSS_MARKET_CHECKPOINT.md`、`MACRO_CROSS_MARKET_RESEARCH.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D13-01 | 美股Broad Market前一交易日 | L2 機制＋反證 | 40% |
| D13-02 | 美國科技／半導體指數 | L2 機制＋反證 | 40% |
| D13-03 | 日股／韓股混合時間窗 | L2 機制＋反證 | 40% |
| D13-04 | USD/TWD美元台幣 | L3 台股PIT資料可行 | 60% |
| D13-05 | DXY美元指數 | L2 機制＋反證 | 40% |
| D13-06 | 美債利率／殖利率曲線 | L2 機制＋反證 | 40% |
| D13-07 | 油價 | L2 機制＋反證 | 40% |
| D13-08 | 金屬／原物料／稀有元素 | L2 機制＋反證 | 40% |
| D13-09 | CPI／PPI／非農／失業率 | L2 機制＋反證 | 40% |
| D13-10 | Fed／CBC央行利率決策 | L2 機制＋反證 | 40% |
| D13-11 | Macro Surprise與公告時鐘 | L2 機制＋反證 | 40% |
| D13-12 | 全球Shock與台股Residual反應 | L2 機制＋反證 | 40% |
| D13-13 | 時區／休市／Session對齊 | L2 機制＋反證 | 40% |
| D13-14 | Fiscal Policy／Deficit／Government Spending財政政策赤字與政府支出 | L2 機制＋反證 | 40% |
| D13-15 | Monetary Transmission／Financial Conditions貨幣傳導與金融條件 | L2 機制＋反證 | 40% |
| D13-16 | Central-bank Balance Sheet／System Liquidity央行資產負債表與系統流動性 | L2 機制＋反證 | 40% |
| D13-17 | Trade／Geopolitical Risk／Capital-flow Transmission貿易地緣風險與資金流傳導 | L2 機制＋反證 | 40% |
| D13-18 | Business Cycle／Leading-Coincident-Lagging Indicators景氣循環與領先同時落後指標 | L2 機制＋反證 | 40% |
| D13-19 | Capital Market Expectations／Long-run Growth Drivers資本市場預期與長期成長驅動 | L2 機制＋反證 | 40% |


### D14｜交易成本／執行品質／Execution Alpha — 33.3%

專責：10｜投組風控與交易執行研究室  
證據錨點：`TRADING_FRICTIONS_CHECKPOINT.md`、`EXECUTION_ALPHA_RESEARCH.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D14-01 | 券商手續費Provenance | L3 台股PIT資料可行 | 60% |
| D14-02 | 證交稅／當沖稅別Provenance | L3 台股PIT資料可行 | 60% |
| D14-03 | Signal Price vs Fill Price | L3 台股PIT資料可行 | 60% |
| D14-04 | Slippage滑價 | L2 機制＋反證 | 40% |
| D14-05 | Partial Fill部分成交 | L2 機制＋反證 | 40% |
| D14-06 | Counterfactual Orderability反事實可下單性 | L2 機制＋反證 | 40% |
| D14-07 | 訊號到成交Latency | L2 機制＋反證 | 40% |
| D14-08 | 零股／整股成本差異 | L2 機制＋反證 | 40% |
| D14-09 | Turnover換手成本 | L2 機制＋反證 | 40% |
| D14-10 | Opportunity Cost機會成本 | L2 機制＋反證 | 40% |
| D14-11 | REDUCE→RE-ADD摩擦成本 | L2 機制＋反證 | 40% |
| D14-12 | Execution Alpha歸因 | L3 台股PIT資料可行 | 60% |
| D14-14 | 集合競價／特殊撮合成本 | L2 機制＋反證 | 40% |
| D14-15 | Market vs Limit Order／Order-type Choice市價限價與委託類型選擇 | L0 未研究 | 0% |
| D14-16 | VWAP／TWAP／Participation Execution成交量加權時間加權與參與率執行 | L0 未研究 | 0% |
| D14-17 | Implementation Shortfall／Market-impact Cost執行落差與市場衝擊成本 | L0 未研究 | 0% |
| D14-18 | Alpha Decay／Execution Urgency訊號衰減與執行急迫性 | L0 未研究 | 0% |
| D14-19 | Short-sale Execution／Recall／Forced Buy-in／Squeeze Risk放空執行、召回、強制回補與軋空風險 | L0 未研究 | 0% |


### D15｜投資組合／風險／資金利用／部位生命週期 — 36.2%

專責：10｜投組風控與交易執行研究室  
證據錨點：`PORTFOLIO_RISK_CHECKPOINT.md`、`PORTFOLIO_RISK_RESEARCH.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D15-01 | Capital Concentration資金集中 | L3 台股PIT資料可行 | 60% |
| D15-02 | Risk Concentration風險集中／HHI | L3 台股PIT資料可行 | 60% |
| D15-03 | Correlation相關性 | L2 機制＋反證 | 40% |
| D15-04 | Covariance Shrinkage共變異縮減 | L2 機制＋反證 | 40% |
| D15-05 | Hierarchical Clustering階層分群 | L2 機制＋反證 | 40% |
| D15-06 | Effective Bets有效獨立下注數 | L2 機制＋反證 | 40% |
| D15-07 | Portfolio Heat投組熱度 | L3 台股PIT資料可行 | 60% |
| D15-08 | Cash Attribution現金原因歸因 | L3 台股PIT資料可行 | 60% |
| D15-09 | Stop-risk Geometry停損距離風險 | L3 台股PIT資料可行 | 60% |
| D15-10 | FIRST／ADD／FULL生命週期 | L2 機制＋反證 | 40% |
| D15-11 | REDUCE／RECOVERY／RE-ADD | L2 機制＋反證 | 40% |
| D15-12 | 35% Cap／千元格／股數量化誤差 | L3 台股PIT資料可行 | 60% |
| D15-13 | Expected Shortfall／Tail Risk | L2 機制＋反證 | 40% |
| D15-14 | PriorityScore後選股資金傾斜 | L3 台股PIT資料可行 | 60% |
| D15-15 | 3+3／多Pool跨池風險 | L3 台股PIT資料可行 | 60% |
| D15-16 | Portfolio Optimization：Mean-Variance／Efficient Frontier／Risk Budgeting／Risk Parity／Black-Litterman投組最佳化方法 | L0 未研究 | 0% |
| D15-19 | Kelly／Fractional Kelly凱利與分數凱利 | L0 未研究 | 0% |
| D15-21 | Active Portfolio Diagnostics／Tracking Error／Active Share／Performance Attribution主動投組診斷與績效歸因 | L0 未研究 | 0% |
| D15-22 | Risk Attribution／Information Ratio風險歸因與資訊比率 | L0 未研究 | 0% |
| D15-23 | Derivative Hedging／Overlay／Beta-Tail Risk Control衍生品避險、曝險覆蓋與尾端風險控制 | L0 未研究 | 0% |
| D15-24 | Value at Risk／Parametric-Historical VaR風險值與參數歷史法VaR | L0 未研究 | 0% |


### D16｜統計驗證／PIT／Shadow／OOS／防過擬合 — 45.6%

專責：11｜統計驗證與策略市場狀態研究室  
證據錨點：`RESEARCH_WORKLIST.md`、`research/EXPERIMENT_REGISTRY.md`、`research/research_master_map.json`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D16-01 | Point-in-Time資料時間一致性 | L4 前瞻/OOS證據 | 80% |
| D16-02 | Prospective Shadow前瞻影子樣本 | L4 前瞻/OOS證據 | 80% |
| D16-03 | OOS樣本外驗證 | L4 前瞻/OOS證據 | 80% |
| D16-04 | Purged Holdout清洗保留集 | L4 前瞻/OOS證據 | 80% |
| D16-05 | Multiple Testing多重測試 | L4 前瞻/OOS證據 | 80% |
| D16-06 | Independent-Date／日期群聚推論 | L4 前瞻/OOS證據 | 80% |
| D16-07 | Factor Redundancy因子冗餘 | L4 前瞻/OOS證據 | 80% |
| D16-08 | 交易成本敏感度 | L3 台股PIT資料可行 | 60% |
| D16-09 | Coverage／Zero-pick防火牆 | L4 前瞻/OOS證據 | 80% |
| D16-10 | Negative Controls負向控制 | L3 台股PIT資料可行 | 60% |
| D16-11 | Data Provenance資料來源／世代證明 | L3 台股PIT資料可行 | 60% |
| D16-12 | Experiment Registry實驗登錄 | L4 前瞻/OOS證據 | 80% |
| D16-13 | Shadow Cohort抽樣／Membership語意 | L3 台股PIT資料可行 | 60% |
| D16-14 | Generation Alignment跨資料表世代對齊 | L3 台股PIT資料可行 | 60% |
| D16-15 | Maturity Gate成熟度與升級門檻 | L4 前瞻/OOS證據 | 80% |
| D16-16 | Time-series Models時間序列模型 | L0 未研究 | 0% |
| D16-17 | Panel／Cross-sectional Models面板與橫截面模型 | L0 未研究 | 0% |
| D16-18 | Regularization／Feature Selection正則化與特徵選擇 | L0 未研究 | 0% |
| D16-19 | Machine Learning／Calibration機器學習與校準 | L2 機制＋反證已定義 | 40% |
| D16-20 | Causal Inference因果推論 | L0 未研究 | 0% |
| D16-21 | Alternative Data Provenance／Selection Bias替代資料來源與選樣偏誤 | L0 未研究 | 0% |
| D16-22 | NLP／LLM Financial-text Feature Validation自然語言與大型語言模型財經文本特徵驗證 | L0 未研究 | 0% |
| D16-23 | Stress Test／Scenario／Reverse Stress Test壓力測試、情境與反向壓力測試 | L0 未研究 | 0% |
| D16-24 | Monte Carlo Simulation／Distributional Validation蒙地卡羅模擬與分布驗證 | L0 未研究 | 0% |
| D16-25 | Probabilistic Decision／Bayesian Updating／Uncertainty-aware Selection機率式決策、貝氏更新與不確定性選股 | L2 機制＋反證已定義 | 40% |


### D17｜新聞／事件半衰期／受益受害傳導 — 52.9%

專責：08｜事件與新聞研究室  
證據錨點：`EVENT_RISK_CHECKPOINT.md`、`SUPPLY_CHAIN_LEAD_LAG_RESEARCH.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D17-01 | 新聞來源可靠度分級 | L2 機制＋反證 | 40% |
| D17-02 | 新聞first-known／發布時間 | L2 機制＋反證 | 40% |
| D17-03 | News Half-life資訊半衰期 | L2 機制＋反證 | 40% |
| D17-04 | 直接受益／直接受害辨識 | L3 台股PIT資料可行 | 60% |
| D17-05 | 間接受益／供應鏈二階傳導 | L2 機制＋反證 | 40% |
| D17-06 | Expectation vs Surprise預期差 | L3 台股PIT資料可行 | 60% |
| D17-07 | Priced-in已反映程度 | L3 台股PIT資料可行 | 60% |
| D17-08 | 新聞Sentiment情緒 | L2 機制＋反證 | 40% |
| D17-09 | 重複新聞／同事件Cluster去重 | L3 台股PIT資料可行 | 60% |
| D17-10 | 消息來源交叉驗證 | L3 台股PIT資料可行 | 60% |
| D17-11 | Sector Propagation族群擴散 | L3 台股PIT資料可行 | 60% |
| D17-12 | 事件後Gap／延續／反轉 | L3 台股PIT資料可行 | 60% |
| D17-13 | Scheduled vs Unscheduled已知／未知事件 | L3 台股PIT資料可行 | 60% |
| D17-14 | Policy／Regulatory Event Clock／Surprise政策法規事件時鐘與預期差 | L3 台股PIT資料可行 | 60% |


### D18｜市場Regime×策略互動 — 37.3%

專責：11｜統計驗證與策略市場狀態研究室  
證據錨點：`system2/SYSTEM2_MARKET_REGIME_V0.md`、`TREND_MOMENTUM_REVERSAL_CHECKPOINT.md`、`MARKET_BREADTH_ROTATION_CHECKPOINT.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D18-01 | Market Regime市場狀態Taxonomy | L2 機制＋反證 | 40% |
| D18-02 | Trend vs Range策略互動 | L2 機制＋反證 | 40% |
| D18-03 | High/Low Volatility策略互動 | L2 機制＋反證 | 40% |
| D18-04 | Breadth參與度×策略 | L2 機制＋反證 | 40% |
| D18-05 | Sector Rotation×策略 | L2 機制＋反證 | 40% |
| D18-06 | Large-cap vs Small-cap領導×策略 | L2 機制＋反證 | 40% |
| D18-07 | Risk-on／Risk-off狀態 | L2 機制＋反證 | 40% |
| D18-08 | 策略啟用／停用規則 | L2 機制＋反證 | 40% |
| D18-09 | 策略權重動態配置 | L2 機制＋反證 | 40% |
| D18-10 | 多策略相關性／Ensemble | L2 機制＋反證 | 40% |
| D18-11 | Regime Transition狀態轉換 | L2 機制＋反證 | 40% |
| D18-12 | Drawdown-aware策略降載 | L2 機制＋反證 | 40% |
| D18-13 | 策略績效Regime Attribution | L2 機制＋反證 | 40% |
| D18-14 | Walk-forward市場狀態驗證 | L2 機制＋反證 | 40% |
| D18-15 | Business／Credit Cycle × Strategy Regime景氣信用循環與策略市場狀態互動 | L0 未研究 | 0% |


### D19｜資產定價／因子投資／市場異象 — 41.3%

專責：12｜資產定價與因子研究室  
證據錨點：`ASSET_PRICING_FACTOR_CHECKPOINT.md`、`ASSET_PRICING_FACTOR_RESEARCH.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D19-01 | CAPM／Beta／Alpha與Benchmark Residual | L2 機制＋反證 | 40% |
| D19-02 | Size規模因子 | L2 機制＋反證 | 40% |
| D19-03 | Value價值因子 | L2 機制＋反證 | 40% |
| D19-04 | Cross-sectional Momentum橫截面動能因子 | L2 機制＋反證 | 40% |
| D19-05 | Quality／Profitability品質與獲利能力因子 | L2 機制＋反證 | 40% |
| D19-06 | Investment／Asset Growth投資與資產成長因子 | L2 機制＋反證 | 40% |
| D19-07 | Low Volatility／Low Beta低波動低Beta因子 | L2 機制＋反證 | 40% |
| D19-08 | Idiosyncratic Volatility特質波動異象 | L2 機制＋反證 | 40% |
| D19-09 | Residual Momentum／Factor Neutralization殘差動能與因子中性化 | L2 機制＋反證 | 40% |
| D19-10 | Factor Exposure／Multicollinearity因子曝險與共線性 | L2 機制＋反證 | 40% |
| D19-11 | Factor Crowding／Capacity／Turnover因子擁擠容量與換手 | L2 機制＋反證 | 40% |
| D19-12 | Seasonality／Calendar Anomalies季節性與日曆異象 | L3 台股PIT資料可行性（有限範圍） | 60% |
| D19-13 | Relative Value／Pairs Trading／Cointegration／Residual Mean Reversion相對價值、配對交易、共整合與殘差均值回歸 | L2 機制＋反證 | 40% |
| D19-15 | Index／Benchmark Construction／Methodology指數與基準建構方法 | L2 機制＋反證 | 40% |
| D19-16 | Liquidity Premium／Illiquidity Factor流動性溢酬與非流動性因子 | L2 機制＋反證 | 40% |

### D20｜行為金融／投資人注意力／市場心理 — 12.3%

專責：13｜行為金融與市場心理研究室  
證據錨點：`BEHAVIORAL_FINANCE_CHECKPOINT.md`、`BEHAVIORAL_FINANCE_RESEARCH.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D20-01 | Prospect Theory／Loss Aversion展望理論與損失趨避 | L2 機制＋反證 | 40% |
| D20-02 | Disposition Effect處分效果 | L2 機制＋反證 | 40% |
| D20-03 | Overconfidence過度自信 | L0 未研究 | 0% |
| D20-04 | Anchoring／Reference Dependence錨定與參考點依賴 | L2 機制＋反證 | 40% |
| D20-05 | Representativeness／Recency代表性與近因偏誤 | L0 未研究 | 0% |
| D20-06 | Herding／Social Proof從眾與社會證明 | L0 未研究 | 0% |
| D20-07 | Investor Attention／Salience投資人注意力與顯著性 | L2 機制＋反證 | 40% |
| D20-08 | Underreaction／Post-event Drift反應不足與事件後漂移 | L0 未研究 | 0% |
| D20-09 | Overreaction／Reversal過度反應與反轉 | L0 未研究 | 0% |
| D20-10 | Investor Sentiment情緒測量與代理變數 | L0 未研究 | 0% |
| D20-11 | Narrative／Theme Diffusion敘事與題材擴散 | L0 未研究 | 0% |
| D20-12 | Behavioral-vs-Structural Falsification行為解釋與結構性反證 | L0 未研究 | 0% |
| D20-13 | Limits to Arbitrage／Noise-trader Risk套利限制與雜訊交易者風險 | L0 未研究 | 0% |


### D21｜公司治理／經營者／內部人／控制權品質 — 3.6%

專責：14｜公司治理與內部人研究室  
證據錨點：`CORPORATE_GOVERNANCE_INSIDER_CHECKPOINT.md`、`CORPORATE_GOVERNANCE_INSIDER_RESEARCH.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D21-01 | Ownership／Control Structure所有權與控制權結構 | L2 機制＋反證 | 40% |
| D21-02 | Board／Independent Directors董事會與獨立董事 | L0 未研究 | 0% |
| D21-03 | Insider Ownership／Trading內部人持股與交易 | L0 未研究 | 0% |
| D21-04 | Share Pledging大股東與董監質押 | L0 未研究 | 0% |
| D21-05 | Related-party Transactions關係人交易 | L0 未研究 | 0% |
| D21-07 | Management Incentives／Capital Allocation Quality管理層誘因與資本配置品質 | L0 未研究 | 0% |
| D21-09 | Succession／Key-person Risk接班與關鍵人風險 | L0 未研究 | 0% |
| D21-10 | Audit／Restatement／Internal Control審計重編與內控制度 | L0 未研究 | 0% |
| D21-11 | Tunneling／Minority Shareholder Risk利益輸送與小股東風險 | L0 未研究 | 0% |
| D21-12 | Management Guidance Credibility管理層展望可信度 | L0 未研究 | 0% |
| D21-13 | ESG／Climate／Social Materiality環境氣候社會重大性風險 | L0 未研究 | 0% |


### D22｜信用市場／資本結構／融資壓力／股債傳導 — 0%

專責：15｜信用市場與資本結構研究室  
證據錨點：`CREDIT_CAPITAL_STRUCTURE_CHECKPOINT.md`、`CREDIT_CAPITAL_STRUCTURE_RESEARCH.md`

| 模組 | 課題 | 成熟度 | 百分比 |
|---|---|---|---:|
| D22-01 | Debt Maturity Wall／Refinancing Schedule債務到期與再融資時程 | L0 未研究 | 0% |
| D22-02 | Interest Coverage／Debt Service利息保障與償債能力 | L0 未研究 | 0% |
| D22-03 | Net Debt／Leverage Structure淨負債與槓桿結構 | L0 未研究 | 0% |
| D22-04 | Cost of Debt／Refinancing Risk債務成本與再融資風險 | L0 未研究 | 0% |
| D22-05 | Credit Rating／Rating Migration信用評等與遷移 | L0 未研究 | 0% |
| D22-06 | Credit Spread／Bond Yield信用利差與債券殖利率 | L0 未研究 | 0% |
| D22-07 | Liquidity／Covenant／Default Risk流動性契約與違約風險 | L0 未研究 | 0% |
| D22-08 | Fixed／Floating Rate Exposure固定浮動利率曝險 | L0 未研究 | 0% |
| D22-09 | Equity-Credit Divergence股債背離 | L0 未研究 | 0% |
| D22-10 | Capital Structure／Funding Mix資本結構與融資組合 | L0 未研究 | 0% |
| D22-11 | Credit Cycle／Bank Lending Conditions信用週期與銀行放款條件 | L0 未研究 | 0% |
| D22-12 | Distress／Recovery／Equity Tail Risk財務困境回收與股權尾端風險 | L0 未研究 | 0% |


## 進度治理

1. 每次研究只能升級「有新證據」的模組；閱讀更多相同理論不等於升級。
2. L3以上必須能指出台股資料來源、時間戳、PIT資格與資料品質。
3. L4必須有前瞻或真正OOS證據，不得用事後回填的Shadow冒充。
4. L5必須通過成本、冗餘、獨立日期、不同Regime與反證。
5. UNKNOWN不得記成0或失敗；資料阻塞與研究成熟度分開管理。
6. 新發現若橫跨兩領域，由一個Primary owner負責，其他領域只交叉引用，避免雙重計算進度。
7. Formal Core不因學習進度自動修改；正式優化仍走既有Optimization Bridge與owner approval。

## 時程解讀

- L0→L2主要受研究工作量影響，可平行推進。
- L2→L3主要受台股資料來源、PIT語意與可重播性影響。
- L3→L4受前瞻樣本與OOS累積速度影響，不能靠多開聊天室縮短市場日曆時間。
- L4→L5受獨立日期、多Regime、成本、冗餘與必要時跨年度證據影響。
- 因此「全356模組達L5」不能承諾一個短固定日期；未來應同時報告（A）可主動研究剩餘量與（B）等待市場資料累積量。

## 下一步

1. 對現有研究聊天室逐一掛上專線編號。
2. 各專線只領取自己尚未達L3的模組，先把可主動完成的知識補齊。
3. 對已到L3但等待前瞻資料的模組，切換成「等待證據」，不要浪費聊天室反覆讀同一主題。
4. 研究總控室每次匯總 GitHub 最新main後重新計算22領域與356模組進度。

## 15項候選治理分類 — 韓哥批准 2026-10-03

完整 Dependency Audit（依賴審查）與後續驗證契約：
`shared-knowledge/CURRICULUM_15_ITEM_DEPENDENCY_AUDIT_20261003_V0_1.md`

目前治理分類：
- 正式保留課綱：D05-13、D19-13。
- 保留但限制為 Context／Capability（情境／能力）：D06-15、D14-16、D14-19、D21-02。
- Observation／RESEARCH_ONLY（觀察／僅研究）：D02-07、D02-08、D12-08、D19-08、D19-12、D19-16、D20-03、D20-05。
- 驗證後強合併候選：D15-19。
- 立即退休：0。

本次只改治理角色與下一驗證責任，不改 L0-L5 成熟度，不改模組數，不授權任何 System 1／System 2 Formal Core（正式核心）變更。課綱維持 22 領域／354 模組。



## H01 owner-approved scope dedup — 2026-10-04

H01 is formally **KEEP_SEPARATE / SCOPE_DEDUP_ONLY**.

- D09-13 = Industry Structure／Competitive Dynamics／Porter Five Forces（產業結構／競爭動態／波特五力）, L3/60%.
- D09-14 = Firm Competitive Strategy／Strategic Actions（公司競爭策略／策略行動）, L3/60%.
- D09-13 owns industry structural state; D09-14 owns issuer-specific strategic-action lifecycle.
- Shared market-share/capacity/price/margin/customer/supplier evidence has one parent receipt and cannot become two independent votes.
- Module count, maturity and Formal Core are unchanged.


## H09 canonical producer-consumer boundary — 2026-10-04

Owner-approved H09 scope de-dup:
- D16-19 owns model/calibrator fitting, probability-quality diagnostics, calibration/model drift and immutable `CalibrationReceipt`.
- D16-25 consumes calibrated probabilities/distributions and owns prior/Bayesian decision update, uncertainty, utility, risk-coverage and ABSTAIN.
- D16-25 may require calibration quality but cannot fit a second calibrator or create a second probability authority.
- both remain L2/40%; no module-count or maturity change from H09.

The D16-19 table row is synchronized here to the already-canonical Tracker L2/40%; this is not a new maturity promotion.
