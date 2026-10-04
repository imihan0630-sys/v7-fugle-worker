# COV-03｜D06 Retail / Individual Investor Participation & Flow（散戶／自然人參與與流向）專科回件 V0.1

- Candidate ID: COV-03
- Domain: D06
- Specialist room: 05｜法人與籌碼研究室
- Return artifact path: research/COV03_D06_SPECIALIST_RETURN_V0_1.md
- Evidence cutoff: 2026-10-04 08:45 Asia/Taipei
- Specialist room checkpoint / source artifacts: research/cov03_retail_individual_investor_flow_specialist_return_v0_1.md; research/cov03_retail_individual_investor_flow_specialist_return_v0_1.json; INSTITUTIONAL_CROWDING_RESEARCH.md; research/stock_market_learning_tracker_v0_1.json
- Current candidate class: TRUE_GAP_CANDIDATE
- Proposed terminal recommendation: ADD_MODULE

Formal Core impact: NONE / LOCKED  
System1 / System2 Formal impact: NONE  
Canonical curriculum impact from this return alone: NONE

## 1. Exact Knowledge Definition（精確知識定義）

本知識家族定義為：來源直接辨識為 natural person / individual investor（自然人／個人投資人）的 participation（參與）、ownership（持有）、directional flow（方向性流量）與 channel-specific activity（特定交易通道活動）。它不是用「市場總成交－法人交易」殘差推算的剩餘項，也不是把融資、當沖、零股或券商分點直接改名為散戶流量。

必須分開四種 observable（可觀測物）：participation（參與）、ownership（持有）、directional flow（方向流）、channel-specific activity（特定通道活動）。只有來源直接提供 investor class（投資人類別）且在決策時點已可知，才能建立 direct-retail receipt（直接自然人憑證）。

UNKNOWN（未知）規則：只有市場層級自然人占比時，個股自然人買賣仍為 UNKNOWN；只有融資、當沖、零股或分點資料時，自然人身分、方向與動機均不得由代理變數補值。

## 2. Existing-module Overlap Matrix（既有模組重疊矩陣）

| Existing module（既有模組） | Shared observable（共享可觀測） | Distinct observable（獨特可觀測） | Shared source（共享來源） | Double-count risk（重複風險） | Owner boundary（主責邊界） |
|---|---|---|---|---|---|
| D06-07 融資餘額／融資變化 | 信用交易、高自然人參與 | 直接自然人身分類別 | TWSE／TPEx 信用交易 | 高 | D06-07 owns leverage（槓桿）；新 owner owns investor identity（投資人身分） |
| D06-13 券商分點 | 經紀執行流 | 客戶自然人身分 | 券商／分點資料 | 高 | branch（分點）是執行通路，不是 beneficial owner（最終受益人） |
| D06-14 當沖率 | 短線交易活動 | 自然人身分與隔夜方向 | 當沖統計 | 高 | D06-14 owns turnover（換手）；新 owner owns direct investor class（直接投資人類別） |
| D06-10 TDCC 集保股權分散 | 持股結構 | 法律／帳戶類別自然人身分 | TDCC（集保） | 高 | D06-10 owns holding-size distribution（持股級距）；新 owner 不把級距直接等同自然人方向流 |
| D06-01～04 法人流 | 市場參與者方向流 | 自然人直接方向流 | 交易所投資人分類／法人資料 | 高 | 法人與自然人各自有 primitive（底層原始證據）；不得以殘差替代自然人 |
| D20 行為金融 | 散戶行為機制／偏誤 | D06 的可觀測自然人流 | 行為資料＋市場資料 | 高 | D06 owns observable（可觀測量）；D20 owns behavioral interpretation（行為解釋） |

Owner 判定：目前沒有一個既有 D06 模組能乾淨擁有「直接自然人身分可觀測量」並同時保留代理變數防火牆，因此不是單純改名即可吸收的缺口。

## 3. Why Current Scope Is Insufficient（現有範圍不足原因）

目前 D06 已能回答法人、融資、融券、借券、券商分點、當沖與持股級距，但無 canonical owner（正式主責）回答：「來源是否直接把交易者辨識為自然人？這個自然人資料是市場參與、持有、特定通道，還是個股方向性流量？」

沒有獨立 owner 時，最容易出現融資≈散戶、當沖≈散戶、零股≈散戶、分點≈特定投資人，以及把 total minus institutions（總量減法人）殘差冒充直接自然人淨流量。這些錯誤會把不同資料物件重複算票，也會把 UNKNOWN（未知）偽造為可觀測資料。

## 4. Taiwan Data Feasibility（台灣資料可行性）

| Source（來源） | Authority（權威性） | Granularity（粒度） | History / frequency（歷史／頻率） | Access（存取） | Direct retail identity（直接自然人身分） | Limitation（限制） |
|---|---|---|---|---|---|---|
| TWSE 投資人類別成交統計 | 官方 | 市場×投資人類別 | 歷史彙總統計 | 公開 | YES | 市場層級，不是個股方向流 |
| TWSE 盤中零股投資人別統計 | 官方 | 市場／交易通道×投資人類別 | 統計／研究資料 | 公開 | YES | 零股通道，不代表全市場個股流向 |
| TWSE 信用交易投資人結構 | 官方 | 市場×投資人類別 | 市場結構統計 | 公開 | YES | 只描述信用交易通道 |
| TWSE Fact Book Domestic Individual Share-ownership（證交所年報本國自然人持股） | 官方 | 市場持有×自然人級距 | 年度 | 公開 | YES | ownership（持有），不是每日方向流 |
| TWSE 外國專業投資機構／自然人交易類別資料 | 官方 | 市場×投資人類別 | 日／產品依契約 | 部分付費 | YES for foreign natural persons（外國自然人） | 不能替代本國自然人個股方向流 |
| Broker / branch BSR（券商／分點買賣） | 官方／交易所產品 | 個股×券商／分點 | 日 | 公開查詢／完整產品付費 | NO | 執行中介，不是最終受益人分類 |

目前可重現結論：DIRECT_NATURAL_PERSON_OBSERVABILITY = VERIFIED_AT_MARKET_OR_CHANNEL_LEVEL；但 DOMESTIC_NATURAL_PERSON_STOCK_DATE_DIRECTIONAL_FLOW = NOT_VERIFIED / SOURCE_GAP。

這裡的「未驗證」不是宣稱資料不存在，而是本輪與既有官方來源盤點尚未找到符合個股×日期×本國自然人買進／賣出／淨額、可保存 PIT（時點一致性）來源契約的官方資料路徑。

## 5. PIT / Replay Implication（時點一致性／重播影響）

任何未來自然人資料契約都必須保存 investorClassDefinition（投資人類別定義）、market／segment（市場／通道）、sourceDate（來源日期）、producedAt（產製時間）、capturedAt（實際擷取時間）、firstKnownAt（首次可知時間）、revision／finality（修訂／最終性）、sourceVersion（來源版本）與 contentHash（內容雜湊）。

規則：年度／月度市場層級自然人統計可重播市場結構，但不得倒填成歷史某日某股的自然人方向流；現在下載到舊日期資料不等於知道當年 firstKnownAt（首次可知時間）；沒有直接個股自然人來源時，個股自然人方向流保持 UNKNOWN；後來出現更完整的來源，不得回頭製造歷史 Shadow（影子）樣本。

## 6. Decision Role（決策角色）

Primary role（主要角色）：context（情境）。Secondary roles（次要角色）：validation（驗證）、supportive（輔助）。

第一階段用途是驗證融資、當沖、零股、券商分點等 proxy（代理變數）到底能否代表自然人參與，以及描述市場層級 retail participation regime（自然人參與狀態）。只有未來取得直接個股方向流且通過 PIT（時點一致性）、OOS（樣本外驗證）與 Shadow（影子驗證）後，才可研究其是否成為 strategy evidence（策略證據）。目前不得成為獨立方向票。

## 7. Anti-double-count Rule（防重複計算規則）

一筆信用交易、當沖、零股、券商分點或 TDCC（集保）資料只能由其原始 owner（主責模組）擁有一次。COV-03 只有在來源直接提供自然人分類時，才可建立 direct-retail receipt（直接自然人憑證）。

禁止把 total market minus institutional flow（市場總量減法人流）、margin financing（融資）、day trading（當沖）、odd-lot（零股）、broker branch（券商分點）重新命名成 direct retail flow（直接自然人流）。若 D20 使用同一自然人 receipt（憑證）研究 herding／attention／disposition effect（從眾／注意力／處分效果），只能建立 behavioral transform（行為轉換），不得把相同底層自然人流量再算一張獨立票。

## 8. Proposed Owner（建議主責）

Proposed domain（建議領域）：D06 法人／籌碼／槓桿／擁擠／被動資金。

Proposed new module（建議新增模組）：Retail / Individual Investor Participation & Flow（散戶／自然人參與與流向）。

Dependencies（依賴）：D06-07 融資、D06-10 TDCC、D06-13 券商分點、D06-14 當沖，以及 D20 行為金融。

不建議吸收進 D06-07：融資只是高度自然人化的槓桿通道，無法代表所有自然人交易。不建議吸收進 D20：投資人身分／流量首先是市場資料物件，行為動機才是 D20 的下游解釋。

## 9. Maturity Starting Point（成熟度起點）

若 owner-approved（主責核准）新增模組，建議 L0／0%。

理由：本回件已證明自然人是台灣官方可直接分類的投資人類別，也證明現有 D06 代理變數不能取代直接自然人資料；但核心的 domestic natural-person stock×date directional flow（本國自然人個股×日期方向流）資料契約尚未驗證，且尚無 prospective receipt（前瞻憑證）、OOS（樣本外）或 Shadow（影子）證據。

因此新模組不得繼承 D06-07／10／13／14 的成熟度；也不因為「自然人類別存在」就從 L1 起跳。

## 10. Terminal Recommendation（終局建議）

**ADD_MODULE**

COV-03 是 true capability gap（真實能力缺口），不是既有名稱缺口。最強正向證據是台灣官方確實直接辨識本國自然人／個人投資人，證明 retail identity（自然人身分）是可觀測資料類別；最強反證則是本輪尚未驗證到可重播的本國自然人「個股×日期×買進／賣出／淨額」來源，因此不能把市場層級自然人占比、融資、當沖、零股、券商分點或法人殘差冒充直接散戶流向。建議由 D06 新增專屬 owner，從 L0／0% 起步，先擁有資料語意、PIT（時點一致性）與代理變數防火牆，再等待直接方向流來源與前瞻證據。

Strongest positive evidence（最強正向證據）：TWSE（證交所）官方市場結構、交易通道與持股統計直接區分自然人，證明自然人不是只能靠殘差推估的類別。

Strongest counterevidence（最強反證）：目前未驗證到權威且可重播的本國自然人個股×日期買／賣／淨額來源契約；券商、融資、當沖、零股與 residual（殘差）均不能建立 beneficial-owner identity（最終受益人身分）。

Unresolved blocker（未解阻塞）：直接本國自然人 stock-level directional source（個股方向來源）、firstKnown/revision（首次可知／修訂）語意、TWSE／TPEx（上市／上櫃）市場對等性與前瞻不可變憑證尚未驗證。

### A. Source table（來源表）

| Source | Authority | Granularity | History | first-known semantics | Replay status | Limitation |
|---|---|---|---|---|---|---|
| TWSE 投資人類別成交統計 | 官方 | 市場×投資人類別 | 歷史彙總 | publication/capture（發布／擷取） | AGGREGATE_REPLAY_FEASIBLE | 非個股方向流 |
| TWSE 零股投資人別統計 | 官方 | 通道×投資人類別 | 統計歷史 | publication/capture | SEGMENT_REPLAY_PARTIAL | 零股不代表全市場 |
| TWSE 信用交易投資人結構 | 官方 | 市場×投資人類別 | 市場結構 | publication/capture | AGGREGATE_REPLAY_FEASIBLE | 僅槓桿通道 |
| TWSE Fact Book 自然人持股 | 官方 | 市場×持有人類別 | 年度 | publication year | OWNERSHIP_REPLAY_FEASIBLE | 非每日流量 |
| 券商／分點資料 | 官方／交易所產品 | 個股×分點 | 日 | product clock（產品時鐘） | EXECUTION_REPLAY_DEPENDS_ON_PRODUCT | 無受益人類別 |

### B. Overlap table（重疊表）

| Existing module | Shared observable | Distinct observable | Shared source | Double-count risk | Owner boundary |
|---|---|---|---|---|---|
| D06-07 | 信用活動 | 自然人身分 | 信用交易統計 | high | leverage vs investor identity |
| D06-10 | 持股結構 | 自然人類別 | TDCC／市場持股統計 | high | holding-size vs investor class |
| D06-13 | 經紀執行 | beneficial owner class（受益人類別） | 券商資料 | high | routing vs identity |
| D06-14 | 短線換手 | 自然人身分／方向 | 當沖統計 | high | turnover vs identity |
| D20 | 散戶行為 | 市場資料 primitive（底層原始量） | 多來源 | high | D06 primitive / D20 interpretation |

### C. Counterevidence table（反證表）

| Claim | Countermechanism | Falsification test | Current status |
|---|---|---|---|
| 融資就是散戶流向 | 融資只是一個槓桿通道 | 對照直接 investor-class source（投資人類別來源） | IDENTITY_EQUIVALENCE_REJECTED |
| 當沖高就是散戶追價 | 不同投資人都可參與；當沖是 round-trip turnover（當日往返換手） | investor class × day-trade | STOCK_LEVEL_UNKNOWN |
| 分點可辨認散戶／主力 | 一分點多客戶、一客戶多分點 | beneficial-owner classified source | REJECTED |
| 總成交減法人就是散戶 | 會混入定義差異、其他類別與未分類交易 | 與直接 investor-class source 勾稽 | REJECTED |
| 零股代表全部散戶 | 零股是特定交易通道 | 全市場直接自然人資料對照 | GENERALIZATION_REJECTED |
