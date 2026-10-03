# D06-18 / H12 — 借券經濟、費率、可借量與使用率 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: MECHANISM_AND_FALSIFICATION_DEFINED / SOURCE_DENOMINATOR_PARTIAL / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

## 研究問題
如何把 securities lending（證券借貸）的價格、供給與可借性，和單純的借券成交／借券餘額／實際借券賣出分開，避免同一筆借券 primitive（原始證據）被重複解讀成多張看空訊號？

## 官方制度證據
TWSE 有價證券借貸制度至少包含三種不同交易型態：
- 定價交易：固定費率；TWSE FAQ 目前列示年利率 3.5%。
- 競價交易：借券人／出借人自訂費率後撮合，最高年利率 16%。
- 議借交易：雙方自行議定費率與其他條件，最高年利率 16%。

官方資訊揭露規則還顯示：
- 定價交易會揭示固定費率、成交總量、出借未成交總量、借券未成交總量。
- 競價交易會揭示成交證券／數量／成交費率，以及出借與借券最佳五檔數量／費率與總量。
- 議借交易至少揭示借券餘額。

Sources:
- https://www.twse.com.tw/zh/products/sbl/qa.html
- https://twse-regulation.twse.com.tw/TW/law/DOC01_print.aspx?FLCODE=FL007044&FLNO=28
- https://twse-regulation.twse.com.tw/TW/law/DOC01_print.aspx?FLCODE=FL007044&FLNO=47

## D06-09 與 D06-18 的 canonical ownership（權威責任）
D06-09 借券與實際借券賣出擁有：
- borrowing transaction volume（借券成交量）；
- borrowing balance（借券餘額）；
- return volume（還券量）；
- actual SBL short-sale volume（實際借券賣出量）；
- actual SBL short-sale balance（借券賣出餘額）。

D06-18 借券經濟擁有：
- borrow fee / matched rate（借券費率／成交費率）；
- displayed lend supply（揭示出借供給）；
- displayed borrow demand（揭示借券需求）；
- spread / depth / fee pressure（費率差／深度／費率壓力）；
- availability state（可借性狀態）；
- utilization（使用率）僅在有合法供給分母時。

同一筆市場資料只建立一份 evidence receipt（證據憑證）。D06-18 可衍生供需／成本狀態，但不得重新把 D06-09 的借券成交量或餘額算成第二張 directional vote（方向票）。

## Borrow fee（借券費率）語意
借券費率是取得券源的價格，不是單純的 bearishness score（看空分數）。

正向機制假說：
- 在可比較交易型態、期限與條件下，費率升高可能表示借券需求相對供給變緊。
- 高費率可能提高建立／維持空方部位的持有成本。

反證與混淆：
- 定價 3.5%、競價成交費率與議借費率的形成機制不同，不能直接混成同一連續稀缺指標。
- 議借條件還包含擔保、期限、提前還券等契約條件；費率差異不一定只反映方向性放空需求。
- 借券用途包含避險、套利、還券、履約等；高借券費率不能自動翻譯成未來下跌。
- 公司行動、權益補償、券源結構與市場制度也可能影響費率。

## Availability（可借量／可借性）
TWSE 的未成交出借量與最佳五檔出借數量是可觀測供給的一部分，可用來描述 displayed availability（揭示可借供給）。

但禁止：
`DISPLAYED_UNMATCHED_LEND_QTY = TOTAL_LENDABLE_INVENTORY`。

原因：
- 市場可能還有議借、證券商或證金公司等其他券源；
- 未掛出的潛在供給不是零；
- 不同交易型態、期限與提前還券條件不可直接視為同質供給。

因此 availability state 可以建立，但必須帶 sourceScope（來源範圍），不得稱為全市場總可借量。

## Utilization（使用率）防火牆
真正的 utilization 至少需要：
`borrowed_or_on_loan / verified_lendable_inventory`。

借券餘額、借券賣出餘額、借券賣出額度都不是合格的 total lendable inventory（總可借庫存）分母。

若只有借券餘額與揭示未成交出借量，最多可以研究 bounded pressure ratio（有界供需壓力比），不得命名為 utilization。

因此目前：
`MARKET_WIDE_TRUE_UTILIZATION = UNKNOWN / SOURCE_DENOMINATOR_NOT_VERIFIED`。

## Borrowing != Shorting
TWSE 官方明確指出，借券成交不等於借券放空。借券可用於避險、套利、還券、履約等用途；研究實際空方壓力時，必須另外使用借券賣出量／餘額。

因此：
- high borrowing balance != bearish;
- high borrow fee != bearish;
- low displayed availability != bearish;
- actual short sale is closer to directional pressure but仍可能受到避險／套利混淆。

## H12 四層 producer-consumer（產生者／使用者）架構
Layer 1 — D06-09 observed lending/short activity（已觀測借券／空方活動）
- canonical primitive owner for borrowing/return/actual-short quantities and balances.

Layer 2 — D06-18 borrow economics（借券經濟）
- consumes the same canonical receipt plus rate/order-book/supply metadata;
- outputs cost/scarcity/availability states;
- no second directional vote from the same lending quantity.

Layer 3 — D14-19 short execution lifecycle（空方執行生命週期）
- consumes D06-18 to decide establish / maintain / recall / forced buy-in / exit feasibility;
- only factual inability to establish/maintain a required short may become strategy-specific HARD_INVALIDATION（策略專屬硬否決）;
- borrow scarcity is not re-scored as alpha.

Layer 4 — D20-13 limits to arbitrage（套利限制）
- uses funding/borrow/execution constraints to explain why mispricing may persist;
- context/falsification only unless independent behavioral evidence is later validated.

## Divergent-state examples
1. Borrow balance high + borrow fee low + displayed supply ample：活動高，但稀缺性低；D06-09 high, D06-18 not scarce.
2. Borrow balance modest + auction fee high + displayed supply thin：部位不大但 marginal borrow scarcity（邊際券源稀缺）可能高。
3. Borrow fee high + actual short-sale flow low：券源昂貴不等於當日放空壓力大。
4. Actual short-sale flow high + fee low：方向性空方活動可高，但建立成本未必緊。
5. Borrow unavailable under a strategy requiring short entry：D14-19 may emit execution infeasibility even if D06-09 direction is UNKNOWN.

## PIT / replay（時點／重播）契約
至少保存：
- market / product / transactionType
- sourceDate / requestedAt / capturedAt / firstKnownAt
- matchedBorrowRate / fixedRate
- displayedLendQty / displayedBorrowQty / bestBidAskRateDepth when available
- borrowTransactionQty / borrowBalance / returnQty
- actualShortSaleQty / actualShortSaleBalance when joined
- tenor / earlyReturnTerms / collateral semantics where applicable
- sourceScope / parserVersion / schemaVersion / contentHash
- denominatorDefinition if any utilization-like metric is computed
- unknownReasons

## Research role
D06-18 目前只允許 RESEARCH_ONLY（僅研究）、CONTEXT（情境）、EXECUTION_FEASIBILITY_INPUT（執行可行性輸入）與未來驗證後的 SUPPORTIVE（輔助）角色。
禁止單靠借券費率／可借量／使用率狀態做 directional hard gate（方向硬門檻）。

## 成熟度判定
官方制度、費率形成、供需可觀測量、usage semantics（用途語意）、availability／utilization 防火牆、H12 去重架構與正反例均已定義，足以達 L2「機制＋反證已定義」。

仍不足 L3：
- 真正全市場可借庫存分母尚未證明；
- 尚缺 prospective（前瞻）費率／供需 receipt；
- TPEx 對等券源經濟資料覆蓋未完成；
- 尚未做任何 outcome（結果）或 OOS（樣本外）檢驗。

Terminal classification for Room 05 side of H12:
`KEEP_ALL / SCOPE_DEDUP_ONLY / COUNTERPART_VALIDATION_REQUIRED_FROM_ROOMS_10_AND_13`.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

Exact next:
1. prospectively capture a bounded TWSE borrow-rate / displayed-supply receipt without outcomes;
2. do not call any metric utilization unless the verified lendable-inventory denominator exists;
3. keep D06-09 quantities and D06-18 economics in one linked primitive receipt;
4. hand H12 counterpart requirements to Rooms 10/13 through the frozen governance packet;
5. Formal Core remains LOCKED.
