# COV-03 Specialist Return — Retail / Individual Investor Flow（散戶／自然人投資人流） V0.1

Updated: 2026-10-04 Asia/Taipei
Candidate ID: COV-03
Domain: D06
Specialist room: 05｜法人與籌碼研究室
Current candidate class: TRUE_GAP_CANDIDATE
Proposed terminal recommendation: ADD_MODULE
Canonical curriculum impact: NONE until 00-room intake/owner approval
Formal Core impact: NONE

## 1. Exact Knowledge Definition（精確知識定義）
Retail / Individual Investor Flow 指可由來源直接識別為自然人／個人投資人之參與、成交、持有或方向性流量，不是以「市場總量－法人量」殘差推估的剩餘項。

必須分開四種 observable（可觀測物）：
- participation（參與）：自然人成交額／成交戶數／占比；
- ownership（持有）：自然人持股人數／持有市值或持股分布；
- directional flow（方向流）：自然人買進、賣出、淨買賣；
- channel-specific activity（特定通道活動）：信用、零股、當沖等自然人參與。

UNKNOWN（未知）規則：只有市場層級自然人占比時，個股自然人流向仍為 UNKNOWN；只有融資／當沖／券商分點時，也不能升級為自然人身分或動機。

## 2. Existing-module Overlap Matrix（既有模組重疊矩陣）

| Existing module | Shared observable | Distinct observable | Double-count risk | Owner boundary |
|---|---|---|---|---|
| D06-07 融資 | 信用交易、高自然人參與 | 直接自然人身分類別 | 把融資量重算成散戶流量 | D06-07 owns leverage; COV-03 owns direct natural-person identity/flow |
| D06-13 券商分點 | 經紀執行流 | 客戶自然人身分 | 把分點當散戶／大戶身分 | branch = venue/proxy, not owner identity |
| D06-14 當沖 | 短線交易活動 | 自然人身份與隔夜方向 | 把當沖率重算成散戶情緒 | day trading owns turnover composition |
| D06-10 TDCC | 持股結構 | 法律／帳戶類別自然人身分 | 把小額持有人直接標散戶交易流 | TDCC bracket owns holding-size distribution |
| D06-01~04 法人流 | 機構方向流 | 自然人直接方向流 | 用 total-institution residual 假造散戶 | institutional flows remain separate |
| D20 行為金融 | 散戶行為機制／偏誤 | D06 可觀測自然人 flow | 同一自然人 flow 再算一張情緒票 | D06 owns observable; D20 owns behavioral interpretation |

## 3. Why Current Scope Is Insufficient（現有範圍不足原因）
目前 D06 有法人、融資、借券、當沖、分點與持股分散，但沒有一個 canonical owner（權威主責）專門區分「直接自然人身分可觀測量」與「高自然人占比的代理量」。

如果沒有獨立模組，研究很容易把：融資≈散戶、當沖≈散戶、零股≈散戶、券商分點≈特定投資人，甚至 `total - institutions` 殘差，混成一個不存在的 retail flow（散戶流向）。

## 4. Taiwan Data Feasibility（台灣資料可行性）

| Source | Authority | Granularity | History / frequency | Access | Direct retail identity | Limitation |
|---|---|---|---|---|---|---|
| 集中市場投資人類別成交統計 | TWSE | market × investor class | long historical aggregate statistics | public publications | YES：本國自然人／外國自然人 | market-level; not stock directional flow |
| 盤中零股投資人別統計 | TWSE | market/segment × investor class | published studies/statistics | public | YES | zero-lot segment; not whole-stock market directional flow |
| 信用交易投資人結構 | TWSE | market × investor class | contemporary market-structure analysis | public | YES | leverage channel only; does not identify all retail trading |
| Domestic Individual Share-ownership | TWSE Fact Book | market ownership × natural-person size | annual | public | YES | ownership, not daily directional flow |
| 外國專業投資機構買賣金額表 | TWSE eShop | market × foreign institution/natural person | daily from 2004-02-19 | paid | YES for foreign natural persons | not domestic natural-person stock-level flow |
| Broker/branch BSR | TWSE | stock × broker/branch | daily; complete product paid | paid/current query | NO | execution intermediary, not beneficial-owner class |

Evidence result:
`DIRECT_NATURAL_PERSON_OBSERVABILITY = VERIFIED_AT_MARKET_OR_CHANNEL_LEVEL`
but
`DOMESTIC_NATURAL_PERSON_STOCK_DATE_DIRECTIONAL_FLOW = NOT_VERIFIED / SOURCE_GAP`.

## 5. PIT / Replay Implication（時點一致性／重播影響）
任何未來自然人資料契約都必須保存 investorClassDefinition（投資人分類定義）、market/segment、sourceDate、producedAt、capturedAt、firstKnownAt、revision/finality、source version/hash。

年度／月度官方統計可證明自然人類別存在與歷史參與結構，但不能被回填成某歷史日某個股的決策時點流量。沒有直接個股自然人來源時，狀態必須是 UNKNOWN，不得用殘差補值。

## 6. Decision Role（決策角色）
Primary role: context（情境）。
Secondary roles: validation（驗證）、future supportive research（未來輔助研究）。

第一階段用途是判斷市場／通道的自然人參與 regime（狀態）以及驗證融資、當沖、零股等代理變數的身分混淆。未來若真的取得個股方向流，才可研究其對價格反應、擁擠與反向風險的增量價值。

## 7. Anti-double-count Rule（防重複計算）
一筆信用交易、當沖、分點或零股資料只能由其原模組擁有一次。COV-03 只有在來源**直接提供自然人分類**時，才可建立 direct-retail receipt（直接散戶憑證）。

`total market - institutional flow`、margin financing（融資）、day trading（當沖）、odd-lot（零股）、broker branch（分點）不得被重新命名成 direct retail flow（直接散戶流）並另計一票。

若 D20 使用相同自然人 receipt 解釋 herding／attention／disposition effect（從眾／注意力／處分效果），只可作 behavioral transform（行為轉換），不得複製底層流量票。

## 8. Proposed Owner（建議主責）
Owner domain: D06.
Recommendation: new dedicated module under 05｜法人與籌碼研究室，暫名 `Retail / Individual Investor Participation & Flow（散戶／自然人參與與流向）`。

Dependencies: D06-07／13／14／10 and D20.
不建議吸收進 D06-07，因融資只是高度自然人化的槓桿通道；也不吸收進 D20，因投資人身分／流量是市場資料物件，行為動機屬 D20。

## 9. Maturity Starting Point（成熟度起點）
Proposed start: L1 / 20%, pending 00-room owner audit.

理由：自然人／法人類別的官方直接市場層級證據與定義已存在，因此不是 UNSTUDIED（未研究）；但核心 stock × date × directional flow（個股×日期×方向流）來源尚未驗證，不能給 L2/L3。

## 10. Terminal Recommendation（終局建議）
`ADD_MODULE`

COV-03 是真缺口。最強正面證據是台灣官方確實直接分類本國自然人，並在集中市場成交結構、零股、信用交易與持股統計中提供可觀測資料；最強反證則是這些資料並沒有形成目前所需的個股×日期直接自然人淨買賣來源。缺口不能由融資、當沖、分點或法人殘差替代。建議由 D06 新增獨立模組，從 L1 起，先擁有自然人身份／參與資料語意與 source gap（來源缺口），等待真正個股方向資料契約。

## Counterevidence Table（反證表）

| Claim | Countermechanism | Falsification test | Current status |
|---|---|---|---|
| 融資就是散戶流向 | 自然人占信用交易很高，但融資只涵蓋槓桿通道 | 控制融資後比較直接自然人交易 | REJECT IDENTITY EQUIVALENCE |
| 當沖高代表散戶追價 | 當沖可由不同投資人參與且是 round-trip turnover（當日往返換手） | 直接 investor class × daytrade data | UNKNOWN at stock level |
| 分點可辨認散戶／大戶 | 一分點多客戶、一客戶多分點 | beneficial-owner classified source | REJECT |
| 總成交減法人就是散戶 | 會混入其他法人、未分類帳戶、交易通道與定義差 | 與直接 investor-class source reconciliation | REJECT |
| 零股可代表全體散戶 | 零股自然人占比高但只是特定交易通道 | whole-market direct natural-person comparison | REJECT GENERALIZATION |

Strongest positive evidence: TWSE directly reports domestic-individual investor participation in market structure and segment analyses; natural persons accounted for about 52% of market trading value in 2026 Jan-Jul and over 98% of credit trading, while intraday odd-lot historical statistics show 82.5% domestic-individual trading-value share.

Strongest counterevidence: No authoritative replayable stock × date domestic-natural-person buy/sell/net data contract was identified; broker, margin, day-trade and residual proxies do not establish beneficial-owner identity.

Unresolved blocker: direct domestic natural-person stock-level directional source, first-known/revision semantics, and market parity remain unverified.

Evidence cutoff: 2026-10-04 Asia/Taipei.
Formal Core: LOCKED.
System1/System2 Formal impact: NONE.
