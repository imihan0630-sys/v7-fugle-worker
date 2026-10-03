# D06-18 Securities Lending Economics（證券借貸經濟）— Borrow-Fee Identifiability & Rule Vintage（借券費率可識別性與制度版本） V0.1

Updated: 2026-10-03 Asia/Taipei
Status: FEE_IDENTIFIABILITY_ADVANCED / 20260601_PAYMENT_VINTAGE_FROZEN / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

## 研究問題
borrow fee（借券費率）或 lending-related fee cashflow（借券相關費用現金流）能不能直接當成 short-demand signal（放空需求訊號）？

結論：不能。至少要拆成「成交／約定費率」、「供給」、「需求」、「搜尋／議價摩擦」、「契約條件」與「付款結算時鐘」。

## 2026-06-01 台灣制度版本斷點
TWSE（臺灣證券交易所）公告的借券費用付款機制自 2026-06-01 起調整：

- 未了結借券部位的相關費用改採每月計算／支付。
- 議借交易即使全部或部分提前還券，相關費用也改為月結集中處理。
- 定價／競價交易在提前還券部分仍維持還券後次一營業日支付。

這是 payment/settlement clock（付款／結算時鐘）的制度變更，不等於借券成交費率本身同日發生相同變更。

因此未來資料欄位必須分開：
- `borrowRateAtTrade`（成交／約定借券費率）；
- `accruedBorrowFee`（應計借券費用）；
- `feeSettlementDate`（費用結算日）；
- `feePaymentDate`（費用支付日）。

禁止：
`DAILY_FEE_PAID = DAILY_SHORT_DEMAND`。

## 為什麼這個斷點很重要
TWSE 2025 年資料顯示，證交所借券系統交易值中議借約占 98%；外資借券交易值近年長期占總量九成以上。

因此 2026-06-01 後若研究者使用每日實際支付／結算的借券費用現金流，月初集中結算可能製造非常大的 calendar artifact（曆日假象）。

正確做法是優先研究 trade-time rate / supply / demand（成交時費率／供給／需求）與 position state（部位狀態），並把 payment cashflow（付款現金流）視為會計／結算欄位，而不是方向性市場訊號。

## Borrow fee（借券費率）的可識別性分解
借券費率可能同時受到：
1. shorting demand（放空需求）；
2. lendable supply（可借供給）；
3. search/friction（搜尋／交易摩擦）；
4. transaction type（定價／競價／議借型態）；
5. tenor / early-return / collateral terms（期限／提前還券／擔保條件）；
6. benchmark/index ownership（基準／指數持股）對供給與需求的雙向影響；
7. market liquidity / volatility（市場流動性／波動）；
8. regulation/rule vintage（法規／制度版本）。

因此：
`HIGH_BORROW_FEE => HIGH_SHORT_DEMAND` 不能單獨成立。

## 外部研究反證先驗
以下僅作一般機制 prior（先驗），不是直接移植成台灣 2026 Alpha（超額報酬）：

- Jones & Lamont（2002）顯示高做空成本與後續低報酬在其歷史美國樣本相關，支持 short-sale constraints（放空限制）可伴隨高估；但這是不同市場／年代。
- Kaplan 等供給研究脈絡顯示 loan fee（借券費率）反映供給與需求交互作用；當供給成為 binding constraint（約束）時，費率與可借性不能只解讀為需求。
- Chague 等（2017）發現即使同一股票同一天，不同借券人的 search cost（搜尋成本）也會造成不同借券費率，證明 fee 不是純粹股票層級的 bearishness（看空程度）。
- 2026 Journal of Financial Economics（金融經濟學期刊）研究進一步指出 benchmarked institutional capital（基準化機構資金）可能同時提高 lending supply（出借供給）與 shorting demand（放空需求）；benchmark exposure（基準曝險）對費率的淨效果取決於供給傳導是否完整。

研究含意：
若某股票因指數納入／被動持股增加而同時出現更多可借股票與更多放空需求，borrow fee（借券費率）的方向不能靠單一邏輯預判。

## Taiwan historical evidence（台灣歷史證據）的正確使用
台灣 1991-2004 歷史研究曾發現高 short interest（放空部位）與後續負向異常報酬相關，而且高 short interest + 高 margin trading（融資交易）組合與 opinion dispersion（意見分歧）／高估關係更強。

但該研究：
- 使用的是舊制度下的 short-interest 類變數，不是 2026 borrow-fee 微觀資料；
- 不足以證明現行借券費率本身有相同預測力；
- 不能把歷史門檻或效果大小移植到 2026。

因此 D06-18 outcome design（結果檢驗設計）必須比較：
- borrow fee（借券費率）；
- displayed supply（揭示供給）；
- borrowing activity（借券活動）；
- actual SBL short sale（實際借券賣出）；
- margin-long / margin-short（融資／融券）；
- liquidity / volatility / regime（流動性／波動／市場狀態）；
並做 residual incremental value（殘餘增量價值）檢驗。

## 2026-06-01 前後的 replay contract（重播契約）
每筆費率／費用資料至少保存：
- sourceDate（來源日期）；
- transactionType（交易型態）；
- borrowRateAtTrade（成交費率）；
- agreedAt / firstKnownAt（約定／首次可知時間）；
- accruedFeeBasis（應計費用基礎）；
- settlementRuleVintage（結算規則版本）；
- feeSettlementDate（結算日）；
- feePaymentDate（支付日）；
- returnDate / partialReturnFlag（還券日／部分還券旗標）；
- quantity / balance / displayedSupply（數量／餘額／揭示供給）；
- contentHash / parserVersion（內容雜湊／解析器版本）。

Rule vintage（制度版本）至少切分：
- `PRE_2026_06_01`；
- `POST_2026_06_01`。

任何跨版本研究若使用 fee cashflow（費用現金流）而未做制度調整，一律視為 schema-confounded（資料結構混淆）。

## H12 防重複計票補強
- D06-09 的 quantity / balance（數量／餘額）是 canonical primitive（權威原始證據）。
- D06-18 的 fee / availability / scarcity（費率／可借性／稀缺）是從同一市場狀態衍生的經濟層。
- D14-19 只使用這些資料判斷 short execution feasibility（空方執行可行性）。
- D20-13 只使用它解釋 limits to arbitrage（套利限制）。

同一高借券費率不能同時在 D06-18、D14-19、D20-13 變成三張 bearish vote（看空票）。

## 成熟度結論
D06-18 維持 L2 / 40%。
本輪新增制度版本、費率可識別性與跨模組反證，但沒有 prospective（前瞻）費率／供需 receipt、真正 lendable inventory（可借庫存）分母、TPEx（櫃買）對等資料或 OOS（樣本外）結果，因此不足 L3。

FORMAL_OPTIMIZATION_CANDIDATE（正式優化候選）: NONE（無）。
Formal Core（正式核心）: LOCKED（鎖定）。

## 來源
- TWSE 2026 借券市場與費用支付機制調整：https://www.twse.com.tw/market_insights/en/detail/8a8216d69d2e8217019d71967af60155
- Taiwan short-sale historical study：https://doi.org/10.1016/j.qref.2008.07.002
- Jones & Lamont short-sale constraints：https://doi.org/10.1016/S0304-405X(02)00224-6
- Chague et al. loan-fee search costs：https://doi.org/10.1016/j.jfineco.2016.12.011
- Institutional mandates / lending / short-selling constraints 2026：https://doi.org/10.1016/j.jfineco.2026.104349

## Exact next
1. 前瞻保存 trade-time rate（成交時費率）而不是只保存 payment cashflow（付款現金流）。
2. 下一有效交易日若能取得官方公開 borrow-rate / displayed-supply（借券費率／揭示供給）資料，先做 outcome-blind（不看結果）的 schema／coverage／hash 稽核。
3. 對 2026-06-01 制度切換做 rule-vintage guard（制度版本防火牆）。
4. 沒有 verified lendable inventory（已驗證可借庫存）前，true utilization（真實使用率）維持 UNKNOWN。
5. 不因 fee（費率）或 scarcity（稀缺）單獨建立方向硬門檻。
