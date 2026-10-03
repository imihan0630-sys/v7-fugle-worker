# D06-16 / PF-039 — ETF 運作機制與申贖資料語意反證 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: MECHANISM_AND_FALSIFICATION_DEFINED / PIT_RECEIPT_REQUIRED / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

## 研究問題
ETF 受益權單位變化、PCF（申購買回清單）、溢折價與追蹤差異，哪些是可觀測的機械性狀態，哪些不能被直接翻譯成個股實際被動買賣？

## 官方機制證據
- TWSE ETF 發行／上市機制明確區分實物申購買回與現金申購買回。實物型 ETF 每日公布 PCF，申購／買回只能按一個申請基數或其整數倍進行。
- TWSE 115 年 ETF 申贖作業流程說明會凍結了 ISSUES-DIFF（交易差異數）的作業公式：T-1 初審成功申購減 T-1 初審成功贖回，再扣回 T-2 複審失敗申購、加回 T-2 複審失敗贖回，並加入 T-1 雙幣 ETF 轉換合計增減股數。
- 同一官方流程亦顯示 PCF 可以在 T 日 08:00 至信託契約申購買回截止時間重新傳送；成分股 T 日更新另有 08:00~08:30 作業，參與證券商需查詢更新檔。PCF 因此是有版本時鐘的資料，不是 timeless final truth（無時點的最終真相）。

Primary sources:
- https://www.twse.com.tw/zh/products/securities/etf/overview/issuing.html
- https://dsp.twse.com.tw/public/static/downloads/tradingDepartment/20260109.0116-115%E5%B9%B4ETF%E7%94%B3%E8%B4%96%E4%BD%9C%E6%A5%AD%E6%B5%81%E7%A8%8B%E8%AA%AA%E6%98%8E%E6%9C%83_20260107163006.pdf

## PF-039 核心反證：units delta 不是純粹當日淨申贖
先前研究把 netUnitsDelta（受益權單位淨變化）視為比 AUM 變化更乾淨的基金規模變化指標，這一點保留；但現在必須再縮窄語意。

ISSUES-DIFF 可能混入：
1. 前一營業日初審成功的申購／贖回；
2. 前兩營業日複審失敗的回沖；
3. 雙幣 ETF 的單位轉換。

因此禁止：
`ISSUES_DIFF = SAME_DAY_NET_PRIMARY_CREATION_REDEMPTION`。

更安全的語意是：
`ISSUES_DIFF = REPORTED_OUTSTANDING_UNIT_CHANGE_WITH_OPERATIONAL_ADJUSTMENTS`。

## 2026-10-01 bounded issuer examples
元大投信公開 PCF 提供兩個 outcome-blind（不看未來結果）例子：
- 0050 元大台灣50：已發行受益權單位差異數 = 0；每實物申購單位 = 500,000。
- 0056 元大高股息：已發行受益權單位差異數 = +27,500,000；每實物申購單位 = 500,000，表面上等於 55 個 creation-unit-equivalent（申購基數等值）。

但 +55 基數等值不能被命名為 55 筆實際 gross creations（毛申購），因為 ISSUES-DIFF 可包含複審回沖／轉換等作業調整；同理 0050 的 0 不能證明 gross creation 與 redemption 都是 0，因為同日總申購與總贖回可能互抵。

Sources:
- https://yuantaetfs.com/tradeInfo/pcf/0050
- https://yuantaetfs.com/tradeInfo/pcf/0056

## PCF stock-level bridge
對國內實物型 ETF，只有在以下條件同時成立時，才能建立 research-only（僅研究）的 MODELED_PRIMARY_BASKET_EXPOSURE（模型化初級市場籃子曝險）：
- 同一 PIT generation（時點世代）的 units delta；
- creation unit size（申贖基數單位數）；
- 同一使用日／版本的 PCF；
- 每檔成分股股數；
- cash substitution（現金替代）狀態；
- split/reverse-split（分割／反分割）與其他會改變單位數的 corporate action（公司行動）已排除或調整。

近似式：
`modeledBasketShares_i = (reportedUnitsDelta / creationUnitSize) * pcfBasketShares_i`

這個值仍禁止命名為 ACTUAL_STOCK_PASSIVE_FLOW（實際個股被動資金流），因為 AP（參與券商）可以使用既有庫存、其他交易／避險安排，且實際執行時間不由 units delta 單獨識別。

## Premium / Discount 與套利機制
TWSE 的制度設計指出，ETF 的初級市場申購買回機制可讓市場價格與基金淨值收斂。研究上因此可以把 premiumDiscount（溢折價）視為套利壓力／價格偏離狀態，但不能直接視為未來方向訊號。

反證：
- 溢價可能因流動性／估值時差／海外市場未開盤而存在，不必然代表成分股即將被買。
- 折價可能靠 ETF 次級市場價格調整收斂，不必然需要成分股立刻被賣。
- units delta 可以變動而 ETF 溢折價很小；也可以溢折價擴大但當日 units delta 為 0。

## D06-11 / D11-14 / D06-16 去重邊界
- D11-14 擁有 index event（指數調整事件）身份、公告／生效時鐘與事件生命週期。
- D06-11 擁有 observed passive/index fund flow（已觀測被動／指數基金流量）與再平衡 stock/flow。
- D06-16 擁有 creation/redemption mechanism（申贖機制）、AP、premium-discount、tracking difference（追蹤差異）、underlying liquidity（成分資產流動性）與申贖套利傳導。

Anti-double-count（防重複計票）：
同一 index rebalance event（指數再平衡事件）只建立一份事件 receipt（憑證）；D06-11 若觀測到 realized flow（實現流量）只能在證明其提供事件本身以外的增量資訊後，才可額外成為證據。D06-16 不得把同一 units delta 再當第二張方向票；它只能提供 mechanism / friction / liquidity（機制／摩擦／流動性）轉換。

## PIT receipt（時點憑證）最低欄位
- fundCode / fundType / benchmark
- creationRedemptionMode
- sourceDate / publishDate / dataTime / capturedAt / firstKnownAt
- outstandingUnits / issuesDiff
- creationUnitSize
- pcfUseDate / pcfVersion / pcfHash
- basketRows / cashSubstitutionState
- splitReverseSplitFlag / unitCorporateActionFlag
- parserVersion / schemaVersion / sourceHash
- pointInTimeEligible / unknownReasons

## Research roles
目前 D06-16 只允許：RESEARCH_ONLY（僅研究）、CONTEXT（情境）、SUPPORTIVE_CANDIDATE_AFTER_VALIDATION（驗證後輔助候選）。
禁止：從 units delta、溢折價或 PCF 單獨建立 directional hard gate（方向硬門檻）。

## 成熟度判定
理論、官方機制、正向傳導、反證、PIT 契約與跨模組去重已定義，足以達到 L2「機制＋反證已定義」。
仍不足 L3：尚缺多日期 prospective（前瞻）同世代 units-delta + PCF receipt、公司行動對齊、版本穩定性與可重播證據。

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

Exact next:
1. PF-040：累積至少第二個獨立交易日的國內實物型 ETF units-delta + PCF 同世代 receipt。
2. 對每個 receipt 保存 PCF 更新版本與 cash-substitution 狀態。
3. 只在 receipt 成熟後研究 modeled basket exposure；actual stock execution 保持 UNKNOWN。
4. 與 D11-14 共用 index-event receipt，不重複計票。
5. Formal Core 保持 LOCKED。
