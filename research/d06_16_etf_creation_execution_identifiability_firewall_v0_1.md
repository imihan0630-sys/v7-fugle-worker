# D06-16 ETF Mechanics（ETF 運作機制）— Creation-to-Execution Identifiability Firewall（申贖到實際成交可識別性防火牆） V0.1

Updated: 2026-10-03 Asia/Taipei
Status: TAIWAN_MECHANISM_FALSIFICATION_ADVANCED / EXECUTION_IDENTIFIABILITY_FIREWALL_FROZEN / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

## 研究問題
即使已知 ETF 受益權單位變化與 PCF（申購買回清單），能否把它直接解讀為同日成分股實際市場買賣？

結論：不能。

## 台灣官方制度直接反證
TWSE（臺灣證券交易所）ETF 規則明確允許多條不需要「同日完整市場買進整籃成分股」的路徑：

### 1. Existing holdings（既有持股）可直接交付
實物申購本質上是以 PCF 定義的一籃子股票加現金差額交換 ETF 受益權單位。申請人或參與證券商若本來就持有成分股，可以直接使用既有庫存，不需要因這次申購而在市場新增買進。

### 2. Collective in-kind creation（集合實物申購）
官方名詞定義允許不超過三位申請人把各自既有持股集合成申購所需股票組合，再由其中一人負責現金差額並共同委託一家參與證券商申購。

因此：
`ETF_CREATION != NEW_SECONDARY_MARKET_BUY_OF_ALL_COMPONENTS`。

### 3. Minimum in-kind creation basket（最小實物申購組合）
參與證券商自行辦理實物申購時，經投信同意，可先交付按市值計算達 90% 以上的股票組合，不足股票以保證金處理，並於申購日次一營業日再買進或借入補足。

因此同一申購事件可以產生：
- 申購日已有庫存交付；
- 申購日部分市場買進；
- 次一營業日再買進；
- 以借入股票補足。

單靠 T 日 units delta（受益權單位變化）無法識別這些路徑。

### 4. Cash substitution（現金替代）
官方規則允許特定股票因法令限制、停止買賣、投信指定，或買回時基金持股不足且無法借得足夠股票等情形改採現金替代。

因此：
`PCF_BASKET_SHARE_REQUIREMENT != ACTUAL_PHYSICAL_DELIVERY_FOR_EVERY_COMPONENT`。

### 5. T-day PCF update（T 日 PCF 更新）
2026 ETF 申贖作業流程顯示參與證券商有 T 日更新 PCF 查詢作業，發行人亦可在指定時間窗重新傳送 PCF。

因此任何 modeled basket exposure（模型化籃子曝險）都必須保存同一使用日與同一版本的 PCF，不得用較晚下載版本回填較早決策時點。

## 因果分解
對一檔實物型 ETF 的 units delta（單位變化），應拆成至少四層：

1. `FUND_UNIT_CHANGE`：基金受益權單位變化。
2. `PRIMARY_MARKET_DELIVERY_OBLIGATION`：初級市場依 PCF 形成的交付義務。
3. `AP_INVENTORY_AND_FINANCING_PATH`：參與證券商／申請人的庫存、借券、現金替代與資金安排。
4. `ACTUAL_SECONDARY_MARKET_EXECUTION`：實際在次級市場何時、買賣多少成分股。

現有公開資料較能觀測第 1 層與部分第 2 層；第 3、4 層若沒有額外執行資料，必須保持 UNKNOWN（未知）。

## 模型化籃子曝險的允許與禁止
允許的研究狀態：
`MODELED_PRIMARY_BASKET_EXPOSURE`（模型化初級市場籃子曝險）

但必須附帶：
- units delta（單位變化）及 operational adjustment（作業調整）語意；
- creation unit size（申贖基數）；
- 同世代 PCF；
- cash substitution（現金替代）；
- corporate action（公司行動）；
- minimum-basket / shortage-stock route（最小組合／短缺股票補足路徑）可用性；
- firstKnownAt（首次可知時間）；
- source/version/hash（來源／版本／雜湊）。

禁止命名：
- `ACTUAL_PASSIVE_STOCK_BUY`；
- `ACTUAL_PASSIVE_STOCK_SELL`；
- `SAME_DAY_COMPONENT_EXECUTION`；
- `FULL_BASKET_MARKET_DEMAND`。

除非另有可驗證的實際執行資料。

## ETF premium-discount（ETF 溢折價）與 arbitrage（套利）反證
ETF 的初級市場申購／買回與參與證券商套利機制可促使 ETF 市價靠近 NAV（淨資產價值），但「設計上提供套利機會」不等於「任何溢折價都會立即、完整地轉成成分股交易」。

外部一般機制研究只作 falsification prior（反證先驗），不是台灣成效證據：
- SEC（美國證券交易委員會）說明 Authorized Participant（參與機構）可利用申贖套利使 ETF 價格靠近 NAV。
- Federal Reserve（美國聯準會）ETF 研究指出 liquidity（流動性）是套利有效性的重要決定因子。
- COVID-19 債券 ETF 經驗顯示，即使 AP 實際進行套利，資產負債表、波動與 adverse selection（逆向選擇）成本仍可能使價差不能立即收斂。

研究 implication（含意）：
premium-discount（溢折價）應先視為 arbitrage pressure / friction state（套利壓力／摩擦狀態），不是直接方向訊號。

## D06-11 / D06-16 / D11-14 防重複計票
- D11-14：擁有 index event（指數事件）身份與公告／生效生命週期。
- D06-11：擁有 realized passive/index fund flow（已觀測被動／指數基金流量）。
- D06-16：擁有 creation/redemption mechanics（申購贖回機制）、AP、溢折價、追蹤與成分資產流動性傳導。

同一 units receipt（單位憑證）不得在 D06-11 與 D06-16 同時形成兩張方向票。

## PIT（時點一致性）最低契約擴充
在 PF-039 基礎上新增：
- existingInventoryPossible（可使用既有庫存）；
- collectiveCreationAllowed（集合實物申購可用）；
- minimumBasketAllowed（最小實物申購組合可用）；
- minimumBasketThresholdPct（最小組合市值門檻）；
- shortageStockBuyOrBorrowDeadline（短缺股票買進／借入期限）；
- cashSubstitutionByComponent（逐成分現金替代狀態）；
- pcfGenerationId（PCF 世代識別）；
- modeledVsActualExecution（模型化或實際執行）。

## 成熟度結論
D06-16 維持 L2 / 40%。
本輪大幅提升因果識別與反證完整性，但沒有新增多日期 prospective（前瞻）receipt、OOS（樣本外）或實際成分股執行資料，因此不得升 L3。

FORMAL_OPTIMIZATION_CANDIDATE（正式優化候選）: NONE（無）。
Formal Core（正式核心）: LOCKED（鎖定）。

## 官方與研究來源
- TWSE ETF 發行及上市機制：https://www.twse.com.tw/zh/products/securities/etf/overview/issuing.html
- TWSE ETF 名詞／實物申購規則：https://www.twse.com.tw/zh/products/securities/etf/overview/introduction.html
- TWSE ETF 申購買回作業要點：https://www.twse.com.tw/downloads/zh/announcement/download/market/1050308-1050002539-8.pdf
- TWSE 2026 ETF 申贖作業流程：https://dsp.twse.com.tw/public/static/downloads/tradingDepartment/20260109.0116-115%E5%B9%B4ETF%E7%94%B3%E8%B4%96%E4%BD%9C%E6%A5%AD%E6%B5%81%E7%A8%8B%E8%AA%AA%E6%98%8E%E6%9C%83_20260107163006.pdf
- SEC ETF arbitrage primer：https://www.sec.gov/file/etfspdf
- Federal Reserve ETF arbitrage/liquidity study：https://www.federalreserve.gov/econres/feds/arbitrage-and-liquidity-evidence-from-panel-of-exchange-traded-funds.htm

## Exact next
1. PF-040 仍保留給下一個真正獨立交易日的 units-delta + PCF prospective receipt（前瞻憑證），不以週末回填取代。
2. 未來 modeled basket exposure（模型化籃子曝險）必須攜帶 inventory / substitution / minimum-basket uncertainty（庫存／替代／最小組合不確定性）。
3. 若沒有 AP 或實際成交資料，actual execution（實際執行）保持 UNKNOWN。
4. 不因本輪機制深化調整 Formal 分數、門檻或排名。
