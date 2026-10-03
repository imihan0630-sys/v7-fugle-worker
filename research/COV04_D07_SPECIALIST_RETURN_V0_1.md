# COV-04｜D07 Dividend / Payout Policy & Sustainability（股利／配發政策與永續性）專科回件 V0.1

- Candidate ID: COV-04
- Domain: D07
- Specialist room: 06｜基本面與估值研究室
- Return artifact path: research/COV04_D07_SPECIALIST_RETURN_V0_1.md
- Evidence cutoff: 2026-10-04 07:10 Asia/Taipei
- Specialist room checkpoint / source artifacts: research/dividend_payout_sustainability_pit_contract_v0_1.json; FUNDAMENTAL_INFORMATION_DYNAMICS_CHECKPOINT.md; FUNDAMENTAL_INFORMATION_DYNAMICS_RESEARCH.md; research/stock_market_learning_tracker_v0_1.json
- Current candidate class: TRUE_GAP_CANDIDATE
- Proposed terminal recommendation: ADD_MODULE

Formal Core impact: NONE / LOCKED  
System1 / System2 Formal impact: NONE  
Canonical curriculum impact from this return alone: NONE

## 1. Exact Knowledge Definition（精確知識定義）

本知識家族定義為：以決策當時可知的盈餘、現金流、資產負債表、法定可分配來源、股利決議與支付紀錄，判斷 ordinary cash dividend（普通現金股利）的 payout capacity（配發能力）、coverage（覆蓋能力）、retention（保留能力）、stability（穩定性）與 sustainability（永續性）。

它不是 D11 的除權息／參考價／支付日事件機制；不是 D21 的董事會治理與資本配置程序品質；不是 D08 的 dividend yield（股息殖利率）或 DDM（股利折現模型）估值；也不是 D07-02／05／06 原始盈餘、CFO／FCF（營業／自由現金流）、槓桿品質的第二份重複分數。

Observable unit（可觀測單位）：
- symbol × distributionEarningsPeriod × distributionDecisionVersion；
- cash dividend（現金股利）、stock dividend（股票股利）、capital/legal reserve distribution（資本／法定盈餘公積分派）分開；
- proposal（提案）、final approval（最終核准）、ex-date（除權息日）、payment（支付）分開。

核心公式：
- earnings cash payout ratio（盈餘現金支付率） = 同一盈餘期間 ordinary cash dividends declared / net income attributable to owners of parent（歸屬母公司業主淨利）。
- earnings dividend coverage（盈餘股利覆蓋） = 歸屬母公司業主淨利 / ordinary cash dividends declared。
- cash-settlement coverage（現金支付覆蓋） = 同一現金流期間 CFO / 該期間實際支付現金股利。
- FCF dividend coverage（自由現金流股利覆蓋） = PIT-safe FCF / 同期間實際支付現金股利；D07-05 尚未凍結 FCF／CAPEX（資本支出）可重播定義前維持 UNKNOWN（未知）。
- cash retention ratio（現金保留率） = 1 - earnings cash payout ratio；它不是 productive reinvestment（有效再投資）證據。
- DPS / EPS（每股現金股利／每股盈餘）只可作 per-share approximation（每股近似支付率），不能取代總金額比率。

Guard（防火牆）：
- 負盈餘、近零盈餘、期間不相容、分派來源不明 → 比率 UNKNOWN。
- capital/legal reserve-funded cash（公積來源現金）與 earnings-funded cash（盈餘來源現金）分開。
- stock dividend（股票股利）不是現金流出，不進 cash coverage。
- special dividend（特殊股利）只有 issuer/source（公司／來源）明確標示或正式規則可證時才能標 SPECIAL，不能因金額大就猜。
- 金融機構 generic（一般式） payout ratio 可描述，但 sustainability 必須加監理資本／清償能力；資料缺失則 UNKNOWN。
- payout stability（配發穩定性）按相同 distribution frequency（分派頻率）與 earnings period（盈餘期間）比較；季／半年／年配不可混為同一序列。

Supporting contract（支援契約）：
`research/dividend_payout_sustainability_pit_contract_v0_1.json`.

## 2. Existing-module Overlap Matrix（既有模組重疊矩陣）

| Existing module（既有模組） | Shared observable（共享可觀測） | Distinct observable（獨特可觀測） | Shared source（共享來源） | Double-count risk（重複風險） | Owner boundary（主責邊界） |
|---|---|---|---|---|---|
| D07-02 季度EPS與獲利成長 | 淨利、EPS | payout／earnings coverage | MOPS 財報 | 高 | D07-02 owns raw earnings；新 owner 只算配發覆蓋 |
| D07-05 營業／自由現金流 | CFO、FCF | cash／FCF dividend coverage | MOPS 現金流 | 高 | D07-05 owns cash-flow quality；新 owner owns payout capacity |
| D07-06 資產負債表與槓桿品質 | 現金、負債、流動性 | payout constraint | MOPS 資產負債表 | 中 | D07-06 owns balance-sheet quality；新 owner consumes context |
| D07-19 Capital Budgeting（資本預算） | 再投資與資本需求 | 分派能力 | 財報／公司揭露 | 中 | D07-19 owns investment decisions；新 owner 不判斷投資案好壞 |
| D07-22 Working Capital／CAPEX／FCF Forecast（營運資金／資本支出／自由現金流預測） | 未來現金流 | payout sustainability state | 財報／預測來源 | 高 | D07-22 owns forecast construction；新 owner 只使用 PIT-safe inputs |
| D08-07 FCF Yield（自由現金流殖利率） | FCF | 股利覆蓋而非價格相對估值 | 財報＋價格 | 高 | D08 owns valuation；新 owner 不以股價定義 sustainability |
| D08-14 DDM（股利折現模型） | 股利序列 | 是否有能力維持股利 | 股利揭露 | 高 | D08-14 owns present-value valuation；新 owner supplies independent payout state |
| D11 dividend event mechanics（股利事件機制） | 董事會／股東會／除權息／支付時鐘 | 盈餘與現金流支撐 | MOPS／TWSE | 高 | D11 owns event timing/reaction；新 owner uses clocks for PIT only |
| D21 capital-allocation governance（資本配置治理） | 董事會／股東會分配政策 | accounting/economic capacity | MOPS／公司治理 | 高 | D21 owns process/governance；新 owner owns sustainability capacity |

結論：沒有既有 D07 模組能同時保存「分派來源、盈餘／現金覆蓋、決議版本、普通／特殊、週期與法定配發能力」。強塞 D07-05 會把 cash-flow quality（現金流品質）與 payout policy（配發政策）混在一起；放 D21 則把治理程序與支付能力混為一談。

## 3. Why Current Scope Is Insufficient（現有範圍不足原因）

現在課綱能回答「賺多少、現金流多少、負債多少、股利事件何時發生、董事會怎麼決議」，但沒有 owner 回答：「這次與未來幾期的普通現金股利，是由什麼來源支持？其對應盈餘／CFO／FCF 覆蓋、保留比例、削減／停發紀錄與週期壓力如何？這種配發能力是否可能延續？」

這是 operational capability（可執行能力）缺口，不是名稱缺口。沒有專屬 owner 時，股利資訊會散落在事件、估值、治理與現金流模組，無法建立不重複且 PIT-safe（時點安全）的 sustainability state（永續性狀態）。

## 4. Taiwan Data Feasibility（台灣資料可行性）

| Source（來源） | Authority（權威性） | Granularity（粒度） | History（歷史） | first-known semantics（首次可知） | Replay status（重播狀態） | Limitation（限制） |
|---|---|---|---|---|---|---|
| MOPS 股利分派情形／股利分派頻率與決議層級 | 官方 | 公司×期間×決議版本 | 歷史查詢存在 | 申報 timestamp／firstObservedAt | SOURCE_FAMILY_FEASIBLE | 完整歷史機器版本鏈仍待凍結 |
| MOPS 財務報告／三表 | 官方 | 公司×財報期間×statement vintage（財報版本） | 已有 D07 PIT 研究 | filing/publication time | PROSPECTIVE_PIT_FEASIBLE | FCF 尚未完整凍結；parent legal capacity 與 consolidated earnings 不完全等同 |
| MOPS 歷史重大訊息／董事會決議／股東會議案決議 | 官方 | 公司×事件 | 歷史查詢存在 | 公告 timestamp | REPLAY_FEASIBLE_WITH_CAPTURE | proposal/final 需狀態機 |
| TWSE 除權除息預告／計算結果 | 官方 | 公司×effective date | 計算結果自民國92/05/05 | exchange publication/effective clocks | EVENT_SOURCE_FEASIBLE | D11 主責，不能代替 sustainability denominator |
| TWSE Data E-Shop 除權除息資訊 | 官方付費 | 每日公司行為機器檔 | 商品歷史 | 產製時鐘 | LICENSED_LANE_AVAILABLE | 付費／授權限制 |
| 公司法 §228-1／§240／§241 | 官方法規 | 法定機制 | 現行／歷史法規 | law effective date | LEGAL_SEMANTICS_READY | 法規不是公司實際決議資料 |

台灣資料並非 DATA_UNAVAILABLE（資料不可得）。公司法 §228-1 允許章程訂明季度／半年度盈餘分派，公開發行公司應依會計師查核或核閱財報；§240 使某些公開發行公司現金股息可依章程授權由董事會決議並報告股東會；§241 允許符合條件的法定盈餘公積／特定資本公積以現金或新股分派。這使「現金股利 = 當期盈餘分派」的簡化假設不成立。

## 5. PIT / Replay Implication（時點一致性／重播影響）

凍結以下 clock（時鐘）：
1. `financialStatementKnownAt`：相容分派期間財報的首次可知時間。
2. `boardProposalKnownAt`：董事會提出／決議分派方案首次公開時間。
3. `finalDistributionDecisionKnownAt`：依公司章程與法律判定最終決議層級；不能假定永遠是股東會或董事會。
4. `exDate`：除權息生效日，D11 主責。
5. `paymentDate`：現金支付日，只用於 cash-settlement coverage 的期間對齊。
6. `capturedAt`：研究 observer（觀察器）實際取得時間。

版本規則：
- proposal → approval → amendment/correction 全部 append-only（追加保存）。
- 後來最終股利不得倒填較早日期。
- 財報重編不得覆寫當時 denominator。
- current webpage（當前網頁）的舊資料若缺 first-known provenance，只能 ex-post validation（事後驗證）。
- 季／半年／年度分派不能混用 economic horizon。
- 股票股利不進 cash coverage；公積來源與盈餘來源分欄。
- UNKNOWN 不得轉為 0、BAD（不佳）或 no dividend（無股利）。

## 6. Decision Role（決策角色）

Primary role（主要角色）：validation（驗證）。

Secondary roles（次要角色）：context（情境）、explanatory（解釋）、supportive（輔助）。

未來可研究成 feature（特徵），但在 prospective／OOS（前瞻／樣本外）證據證明其超越 profitability（獲利能力）、cash-flow quality（現金流品質）、leverage（槓桿）、valuation（估值）、sector（產業）與 Regime（市場環境）前，不能成為獨立策略投票。高 dividend yield（股息殖利率）本身不構成正向證據；高 payout 也不自動等於品質高。

## 7. Anti-double-count Rule（防重複計算規則）

- raw earnings（原始盈餘）只由 D07-02 擁有；新模組只使用其 coverage 角色。
- CFO／FCF 只由 D07-05 擁有；不可改名再加一次分。
- leverage/liquidity（槓桿／流動性）只由 D07-06 擁有；新模組只形成 payout constraint。
- dividend yield／DDM 由 D08 擁有；新模組不使用股價定義 sustainability。
- board/shareholder/ex-date/payment event 建立一份 canonical receipt（權威事件收據）；D07、D11、D21只能建立 child view（子視圖），不得把同一事件算三票。
- capital reserve cash distribution 不得同時計 ordinary earnings payout 與 special payout。
- stock dividend 不得與 cash dividend 相加成「現金支付率」。
- buyback／cash capital reduction（庫藏股／現金減資）若未來納入 total shareholder payout（股東總支付），需依賴既有治理／公司行動來源，不由本模組重造第二套事件。

## 8. Proposed Owner（建議主責）

Proposed domain：D07 基本面／財報／資訊動態。

Proposed new module：
`Dividend / Payout Policy & Sustainability（股利／配發政策與永續性）`.

Dependencies：
D07-02 earnings、D07-05 CFO／FCF、D07-06 balance sheet、D07-08 PIT financial vintage、D11 dividend-event clocks、D21 governance/capital-allocation process；金融業 sustainability 另依賴 D07-32 regulatory metrics（監理指標）。

Owner 不應放 D11，因 D11 不負責付款能力；不應放 D21，因治理程序不能取代財務覆蓋；不應放 D08，因永續性是估值的 input／validation（輸入／驗證）而不是價格相對量。

## 9. Maturity Starting Point（成熟度起點）

若 owner-approved（主責核准）新增模組，建議 **L0／0%**。

理由：本回件已證明知識缺口、語意與台灣來源家族可行，但尚未形成正式模組的完整歷史 PIT、source parser（來源解析器）、prospective receipt（前瞻收據）、OOS／Shadow（樣本外／影子驗證）與 incremental value（增量價值）證據。不得繼承 D07-02／05／06 的成熟度。

## 10. Terminal Recommendation（終局建議）

**ADD_MODULE**

現有 D07 模組能提供盈餘、現金流與資產負債表 primitive（基礎變數），D11 提供股利事件時鐘，D21 提供治理程序，但沒有 owner 能乾淨保存「普通／特殊／公積來源、同期間 earnings/CFO/FCF coverage、retention、配發頻率、停發／削減與週期永續性」完整能力。台灣 MOPS、TWSE 與公司法又提供可觀測的決議、財報、除權息與法定來源語意，支持建立獨立 owner。最強反證是股利政策同時受企業生命週期、成長機會、稅制、投資人需求、控制權與替代式 payout 影響，因此新模組只能研究 fundamentals-based sustainability（基本面永續性），不能把「高股利」直接轉成買進訊號。

Strongest positive evidence（最強正向證據）：台灣官方資料可把股利決議層級、股利來源與財報 denominator 分開觀察，而現行 D07 沒有 owner 對三者做覆蓋／永續整合。

Strongest counterevidence（最強反證）：高 payout 可能只是成熟／投資機會不足；低 payout 可能來自高成長再投資、財務壓力或替代式 shareholder payout；穩定股利也可能由公積來源而非當期盈餘支撐。

Unresolved blocker（未解阻塞）：完整歷史 MOPS proposal/final/version 機器重播契約、FCF coverage 定義與金融機構監理資本分流尚未完成。這些不否定 owner gap，但阻止任何 L1+ 成熟度或策略效果主張。

### A. Source table（來源表）

| Source | Authority | Granularity | History | first-known semantics | Replay status | Limitation |
|---|---|---|---|---|---|---|
| MOPS 股利分派／決議層級 | 官方 | 公司×期間×版本 | 歷史查詢存在 | 申報 timestamp／firstObservedAt | SOURCE_FAMILY_FEASIBLE | 完整歷史機器版本鏈待凍結 |
| MOPS 財報／三表 | 官方 | 公司×財報期間×版本 | D07 已研究 | filing/publication time | PROSPECTIVE_PIT_FEASIBLE | FCF、parent legal capacity 仍需分流 |
| MOPS 重大訊息／股東會決議 | 官方 | 公司×事件 | 歷史查詢 | 公告 timestamp | REPLAY_FEASIBLE_WITH_CAPTURE | proposal/final 狀態需明確 |
| TWSE 除權除息資料 | 官方 | 公司×effective date | 計算結果自民國92/05/05 | publication/effective clocks | EVENT_SOURCE_FEASIBLE | D11 主責 |
| TWSE Data E-Shop 公司行為資料 | 官方付費 | 每日機器檔 | 商品歷史 | production clock | LICENSED_LANE_AVAILABLE | 付費／授權 |
| 公司法 §228-1／§240／§241 | 官方法規 | 法定機制 | 現行／歷史 | effective date | LEGAL_SEMANTICS_READY | 不是公司實際決議 |

### B. Overlap table（重疊表）

| Existing module | Shared observable | Distinct observable | Shared source | Double-count risk | Owner boundary |
|---|---|---|---|---|---|
| D07-02 | net income / EPS | payout + earnings coverage | MOPS 財報 | high | raw earnings vs coverage |
| D07-05 | CFO / FCF | cash/FCF dividend coverage | MOPS 現金流 | high | cash-flow quality vs payout capacity |
| D07-06 | cash/debt/liquidity | payout constraint | MOPS 資產負債表 | medium | balance-sheet quality vs sustainability |
| D08-14 | dividend stream | valuation present value | dividend disclosure | high | sustainability vs valuation |
| D11 | dividend clocks | financial capacity | MOPS/TWSE | high | event mechanics vs fundamentals |
| D21 | board/shareholder process | accounting/economic capacity | MOPS/governance | high | governance process vs payout sustainability |

### C. Counterevidence table（反證表）

| Claim（主張） | Countermechanism（反機制） | Falsification test（反證測試） | Current status（目前狀態） |
|---|---|---|---|
| 高 payout = 高品質 | 成熟、缺少投資機會、代理問題 | 控制 growth/CAPEX/ROIC | REJECT_UNIVERSAL_RULE |
| 低 payout = 不友善股東 | 高成長再投資、財務壓力、替代式 payout | 加入 growth opportunities、buyback/capital reduction context | DIRECTION_UNKNOWN |
| 穩定 DPS = 永續 | 公積分派、借款、週期高峰盈餘 | 分派來源＋coverage＋leverage | NOT_SUFFICIENT |
| 高 dividend yield = 安全 | 股價下跌會機械推高 yield | 與 D08 valuation 分離 | PROHIBITED_INFERENCE |
| stock dividend = cash payout | 股票股利無現金流出 | cash coverage 分子只接受現金 | FALSIFIED_AS_CASH_EQUIVALENT |
| consolidated profit = legal distributable capacity | 母公司法定可分配盈餘／公積限制不同 | parent legal accounts + consolidated economics 雙軌 | SEPARATE_SEMANTICS_REQUIRED |
| 金融業可用一般 FCF coverage | 銀行／保險監理資本與現金流語意不同 | D07-32 specialist branch | GENERIC_RULE_REJECTED |

## Evidence references（證據參照）

Taiwan official（台灣官方）：MOPS 股利分派／財報／重大訊息／股東會決議；TWSE 除權除息與 Data E-Shop；Company Act §228-1、§240、§241。

Research counterevidence（研究反證）：Wang, Ke, Liu & Huang (2011) Taiwan dividend life-cycle evidence；Huang & Lin (2017) Taiwan imputation-tax/dividend policy evidence；Liu, Chiou & Yang (2014) Taiwan cash-dividend/repurchase/capital-reduction payout evidence；DeAngelo, DeAngelo & Stulz (2006) life-cycle theory；Fama & French (2001) dividend-paying propensity and firm characteristics.
