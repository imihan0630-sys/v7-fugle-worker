# D06-16 × D06-09 × D06-18 — ETF / Securities-Lending Cross-Mechanism Firewall（ETF／證券借貸跨機制防火牆） V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CROSS_MECHANISM_CONFOUND_FROZEN / ANTI_DOUBLE_COUNT_ACTIVE / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

## 核心問題
ETF creation/redemption（申購／買回）與 securities lending（證券借貸）在台灣制度上不是互相獨立的兩條線。某些 ETF 初級市場履約本身就可能使用借券。

因此當 ETF fund-size flow（基金規模流）與 borrowing activity（借券活動）同時出現時，兩者不能先驗地被當成兩個獨立方向訊號。

## 台灣制度交叉機制
### A. Minimum in-kind creation（最小實物申購）缺股補足
TWSE 規則允許參與證券商在投信同意下，先交付市值達 90% 以上之股票組合，短缺股票可在申購日次一營業日買進或借入補足。

因此 ETF creation（申購）附近的 borrowing increase（借券增加）可能是：
- 方向性放空；
- AP／申請人為補足 ETF 籃子而借券；
- 其他避險／套利；
- 多種機制混合。

沒有來源用途識別時保持 UNKNOWN（未知）。

### B. Redemption（買回）與 cash substitution（現金替代）
官方規則亦允許在買回對價中，基金未持有足夠特定股票且無法借得足夠股票時，以現金替代。

因此 lending availability（券源可借性）可能影響 ETF redemption settlement path（買回交付路徑），但不等於方向性股價訊號。

## 禁止的雙重計票
以下模式禁止：

`ETF_CREATION_POSITIVE_VOTE + BORROWING_INCREASE_NEGATIVE_VOTE`

若 borrowing increase 可能是同一 ETF creation 的履約需求，就不能先把它當第二個獨立市場觀點。

同樣禁止：
`PASSIVE_FLOW_SIGNAL + BORROW_SCARCITY_SIGNAL + ETF_EXECUTION_SIGNAL`
在三者都來自同一份 ETF 申贖／借券履約 primitive（原始證據）時形成三票。

## Canonical receipt linkage（權威憑證連結）
未來同一股票／ETF／交易日應建立可連結的 primitive IDs（原始憑證識別碼）：
- `etfEventReceiptId`：D11-14 指數事件（如有）；
- `etfUnitsPcfReceiptId`：D06-11／D06-16 ETF 單位與 PCF；
- `sblActivityReceiptId`：D06-09 借券／還券／實際借券賣出；
- `borrowEconomicsReceiptId`：D06-18 費率／供給／可借性。

如果 downstream（下游）狀態共享同一 primitive lineage（原始證據血緣），必須標記 dependency（依賴）而非 independent vote（獨立投票）。

## Candidate context states（候選情境狀態）
僅作 research-only（僅研究）語意，不對應 BUY／SELL：

- `ETF_CREATION_WITH_BORROW_FULFILLMENT_POSSIBLE`：ETF 申購與借券同時出現，且制度允許借券補足籃子；借券動機未知。
- `ETF_REDEMPTION_WITH_LENDING_CONSTRAINT_POSSIBLE`：買回流程可能受到券源可得性影響。
- `ETF_FLOW_AND_SBL_INDEPENDENCE_UNVERIFIED`：觀察到 ETF flow 與 SBL 變化，但缺少足夠資料判斷是否同一履約鏈。
- `ETF_SBL_MECHANICAL_LINK_EXCLUDED`：只有在能以 PIT（時點一致性）證據排除 ETF 申贖履約機制後，才可將借券訊號視為較獨立。

## 外部研究先驗
2026 Journal of Financial Economics（金融經濟學期刊）研究指出，benchmark-linked institutional holdings（基準連結機構持股）可同時影響 securities-lending supply（借券供給）與 shorting demand（放空需求）；因此被動／基準持股增加與借券費率、借券需求之間不存在固定單向機制。

此證據只用來支持『必須控制 benchmark/passive context（基準／被動情境）』，不直接移植其效果大小至台灣。

## 未來實證要求
當 outcome gate（結果門檻）開啟後，任何 D06-09／D06-18 借券訊號研究都應至少加入：
- ETF units delta（ETF 單位變化）；
- PCF use-date / cash substitution（PCF 使用日／現金替代）；
- benchmark event context（基準事件情境）；
- creation/redemption mode（申購買回模式）；
- actual SBL short sale（實際借券賣出），與 generic borrowing（一般借券）分離；
- liquidity / volatility / sector / regime（流動性／波動／產業／市場狀態）。

Negative control（負向控制）：
若 generic borrowing（一般借券）在加入 ETF primary-market context（ETF 初級市場情境）後效果消失，應優先解讀為 mechanical fulfillment / hedging confound（機械履約／避險混淆），而不是保留一個較弱的獨立看空因子。

## 成熟度與治理
- D06-09 維持 L2。
- D06-16 維持 L2。
- D06-18 維持 L2。
- 本檔屬 cross-factor identifiability（跨因子可識別性）與 anti-double-count（防重複計票）治理，不因文件完成提升成熟度。
- Formal Core（正式核心）保持 LOCKED（鎖定）。
- FORMAL_OPTIMIZATION_CANDIDATE（正式優化候選）: NONE（無）。

## 來源
- TWSE ETF 名詞與實物申購／現金替代規則：https://www.twse.com.tw/zh/products/securities/etf/overview/introduction.html
- TWSE ETF 申購買回作業要點：https://www.twse.com.tw/downloads/zh/announcement/download/market/1050308-1050002539-8.pdf
- Institutional investor mandates, securities lending, and short-selling constraints：https://doi.org/10.1016/j.jfineco.2026.104349

## Exact next
1. 下一交易日的 PF-040 與 D06-18 公開借券 receipt（憑證）必須可透過 primitive IDs 互相連結。
2. 在排除 ETF 申贖履約前，不把同日 borrowing increase（借券增加）視為獨立 bearish vote（看空票）。
3. 實際借券賣出與一般借券仍保持不同語意。
4. 所有 outcome（結果）仍封閉。
