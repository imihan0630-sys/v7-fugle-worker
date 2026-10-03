# COV-05｜D08 Sales-based / Enterprise Multiples（營收型／企業價值倍數）專科回件 V0.1

- Candidate ID: COV-05
- Domain: D08
- Specialist room: 06｜基本面與估值研究室
- Return artifact path: research/COV05_D08_SPECIALIST_RETURN_V0_1.md
- Evidence cutoff: 2026-10-04 07:10 Asia/Taipei
- Specialist room checkpoint / source artifacts: research/sales_enterprise_multiples_pit_contract_v0_1.json; VALUATION_RESEARCH.md; FUNDAMENTAL_INFORMATION_DYNAMICS_CHECKPOINT.md; research/stock_market_learning_tracker_v0_1.json
- Current candidate class: SCOPE_EXTENSION_CANDIDATE
- Proposed terminal recommendation: EXTEND_EXISTING_SCOPE

Formal Core impact: NONE / LOCKED  
System1 / System2 Formal impact: NONE  
Canonical module-count impact from this return alone: NONE

## 1. Exact Knowledge Definition（精確知識定義）

本知識家族是以 decision-time eligible（決策時點可用）的 equity value（股權價值）或 enterprise value（企業價值）相對於 PIT-safe sales/revenue（時點安全營收）衡量公司的 sales-based valuation（營收型估值）。

核心變數：

1. P/S（Price-to-Sales，股價營收比）
   = decision-time equity market value（決策時點股權市值） / PIT-safe trailing consolidated revenue（時點安全追蹤十二月合併營收）。
   每股表示法 price / sales-per-share（股價／每股營收）只有在 price、share count（股數）與 sales-per-share share basis（每股營收股數基礎）完全對齊時才等價，不能因形式簡單就視為更安全。

2. EV/Sales（Enterprise Value-to-Sales，企業價值營收比）
   = decision-time enterprise value / PIT-safe trailing consolidated revenue。

3. Forward P/S／Forward EV/Sales（預估股價／企業價值營收比）
   只有 authorized PIT forecast source（已授權時點一致預估來源）存在時才可計算；目前維持 SOURCE_BLOCKED（來源阻塞），禁止用今天的分析師預估重建歷史。

Enterprise Value（企業價值）候選語意：
equity market value
+ interest-bearing debt（有息負債）
+ economically senior preferred/non-common claims（具優先性的非普通股權利）
+ non-controlling interest（非控制權益，當分母採合併營收時）
+ 其他已明確凍結的 financing claims（融資性權利）
- cash and cash equivalents（現金及約當現金）。

但 exact debt taxonomy（精確債務分類）、lease liabilities（租賃負債）、excess investments（超額／非營運投資）、preferred claims（特別權利）仍受 D08-06 的來源契約約束；缺任何必要元件時 EV/Sales = UNKNOWN（未知），不得把 total liabilities（總負債）偷當 debt（債務）。

Revenue denominator（營收分母）第一版：
- TTM IFRS revenue（追蹤十二月 IFRS 營收）= 四個 compatible single-quarter revenue observations（相容單季營收）的和。
- YTD cumulative（年初至今累計）若要拆單季，必須使用 same-scope / same-vintage（同範圍／同版本）可證 subtraction（相減）；不得把重編後 Q3 與舊年度值拼出不存在的 Q4。
- Taiwan monthly revenue（台灣月營收）是更即時的 operating evidence（營運證據），但不能默默取代 IFRS TTM revenue。若未來使用，必須另命名 `monthlyRevenueTTM` 並完成 scope reconciliation（範圍調和）。
- acquisition/disposal（併購／處分）造成 consolidation scope（合併範圍）改變時保留 structural-break tag（結構斷點標記）。

P/S 與 EV/Sales 是同一 sales denominator family（營收分母家族）的不同 capital-structure view（資本結構視角），不是兩張獨立投票。

Supporting contract：
`research/sales_enterprise_multiples_pit_contract_v0_1.json`.

## 2. Existing-module Overlap Matrix（既有模組重疊矩陣）

| Existing module（既有模組） | Shared observable（共享可觀測） | Distinct observable（獨特可觀測） | Shared source（共享來源） | Double-count risk（重複風險） | Owner boundary（主責邊界） |
|---|---|---|---|---|---|
| D08-02 產業相對PE | relative multiple（相對倍數） | sales denominator、EV numerator | 價格／財報／peer（同業） | 中 | D08-02 不宜成為各種倍數的公式 owner；相對化交給 D08-09 |
| D08-06 EV/EBITDA | enterprise value numerator | EV/Sales、P/S、margin decomposition（利潤率分解） | 市值＋財報 | 高 | 最自然的 owner；擴充成 enterprise/revenue multiple family（企業／營收倍數家族） |
| D08-09 同業／產業Peer正規化 | peer group（同業群）與 relative ranking（相對排序） | raw P/S／EV/Sales 建構 | 產業＋估值 | 高 | D08-09 owns normalization；D08-06 extended scope owns raw ratio semantics |
| D08-10 負EPS／週期低點／價值陷阱 | value-trap guards（價值陷阱防火牆） | sales-cycle and margin traps（營收週期／利潤率陷阱） | 財報／估值 | 中 | D08-10 consumes P/S context, but does not own formula |
| D08-12 公司行動估值分母防火牆 | share count／capital action（股數／公司行動） | sales multiple construction | 交易所／公司行動 | 高 | D08-12 owns denominator integrity；extended D08-06 consumes PIT-safe share state |
| D07-01 月營收 | revenue level/growth（營收水準／成長） | value per revenue dollar（每元營收估值） | MOPS | 高 | D07 owns operating revenue; D08 owns valuation relative to revenue |
| D07-03／14 毛利營益率／Unit Economics（單位經濟） | margin quality（利潤率品質） | valuation multiple | 財報 | 高 | margin explains justified sales multiple; cannot become duplicate valuation vote |
| D07-31 M&A／Goodwill（併購／商譽） | consolidation-scope change | EV/Sales break context | 財報／事件 | 中 | D07 owns M&A accounting; D08 only tags scope discontinuity |
| D08-18 金融機構專屬估值 | financial-sector valuation | generic P/S/EV-Sales | 金融財報 | 高 | banks/insurers stay with D08-18; generic sales multiples fail closed |

結論：
D08 已有 enterprise-value ownership（企業價值主責）在 D08-06，另有 peer normalization（同業正規化）D08-09 與 denominator firewall（分母防火牆）D08-12。COV-05 不需要新增一個平行估值模組；最乾淨的做法是擴充 D08-06 的 scope（範圍），讓它從單一 EV/EBITDA 擴為 enterprise/revenue multiple family，並把 P/S 視為同一營收型家族的 equity-value view（股權價值視角）。

## 3. Why Current Scope Is Insufficient（現有範圍不足原因）

現有 D08-06 只有名稱與研究主線上的 EV/EBITDA，沒有正式凍結：
- P/S 的 equity market value（股權市值）與 revenue denominator（營收分母）；
- EV/Sales 的 enterprise-value component（企業價值元件）與 scope matching（範圍匹配）；
- TTM sales（追蹤十二月營收）如何由季度資料建立；
- Taiwan monthly revenue 與 IFRS revenue 的 reconciliation（調和）；
- negative-margin（負利潤）、low-margin distributor（低毛利通路）、cyclical sales peak（景氣高峰營收）與 M&A scope break（併購範圍斷點）；
- P/S 與 EV/Sales 不得成為兩票的 anti-double-count（防重複）規則。

因此缺的是 D08-06 的明確 scope extension（範圍擴充），不是缺一個全新的 owner。

## 4. Taiwan Data Feasibility（台灣資料可行性）

### Source table（來源表）

| Source（來源） | Authority（權威） | Granularity（粒度） | History（歷史） | first-known semantics（首次可知） | Replay status（重播） | Limitation（限制） |
|---|---|---|---|---|---|---|
| MOPS 月營業收入 | 官方 | 公司×月份 | 歷史查詢存在 | 月營收公告／firstObservedAt | SOURCE_FAMILY_FEASIBLE | 不得默認等同 IFRS quarterly consolidated revenue |
| MOPS IFRS 損益表／XBRL | 官方 | 公司×季度×statement vintage（財報版本） | D07 已有 PIT 研究 | filing/publication／firstObservedAt | PROSPECTIVE_PIT_FEASIBLE | 舊歷史 exact filing time 並非全部已證 |
| MOPS／TWSE 公司行動與股數／資本變更 | 官方 | 公司×事件／版本 | 既有 corporate-action research（公司行動研究） | event knownAt + effective session | PARTIAL_PIT_CONTRACT_EXISTS | 完整歷史 share denominator（股數分母）仍需逐來源驗證 |
| TWSE／TPEx 交易價格 | 官方 | 公司×交易日 | 歷史資料存在 | exchange session close／決策時鐘 | REPLAY_FEASIBLE | market cap 必須和 PIT share count 同時點 |
| MOPS 資產負債表 | 官方 | 公司×季度×版本 | source family 已證 | filing／firstObservedAt | SOURCE_FAMILY_FEASIBLE | debt/cash/NCI/non-common claims taxonomy 尚未全部 normalized |
| 分析師／公司營收預估 | 非單一官方來源 | 公司×forecast horizon（預估期間） | 視授權來源 | publishedAt／firstObservedAt | SOURCE_BLOCKED | 未取得 canonical authorized PIT history，Forward P/S／EV-Sales 保持 UNKNOWN |

台灣 public data（公開資料）足以建立 trailing P/S（追蹤股價營收比）的來源家族；EV/Sales 的完整 PIT 則受 D08-06 enterprise-value component contract（企業價值元件契約）約束。Forward sales multiples（預估營收倍數）目前沒有授權 PIT 預估來源，維持 UNKNOWN。

## 5. PIT / Replay Implication（時點一致性／重播影響）

凍結以下時鐘：
- `priceKnownAt`：決策時點可用交易價格。
- `shareCountKnownAt`：公司行動／交易所可證的 PIT share denominator。
- `revenueKnownAt`：季度 IFRS revenue 的 filing/firstObservedAt；月營收另用 MOPS 公告時鐘。
- `balanceSheetKnownAt`：EV debt/cash/NCI/non-common component 的相容資產負債表版本。
- `capturedAt`：研究 observer 實際取得時間。

Replay rules（重播規則）：
1. current shares（目前股數）不得倒填歷史 market cap（市值）。
2. later restated revenue（後來重編營收）不得覆寫較早 replay state（重播狀態）。
3. YTD cumulative revenue 不能與 single-quarter revenue 混算。
4. monthly revenue 不得無條件替代 IFRS TTM revenue。
5. acquisition/disposal 的 consolidation-scope transition（合併範圍轉換）須標記；其造成的 sales jump（營收跳升）不是 organic growth（有機成長）。
6. enterprise-value components 必須各自满足 knownAt <= asOf；缺元件時 EV/Sales = UNKNOWN。
7. Forward P/S／EV-Sales 在 analyst forecast source（分析師預估來源）未驗證前 = UNKNOWN。
8. UNKNOWN 不得轉成 0、cheap（便宜）或 no valuation（無估值）。

## 6. Decision Role（決策角色）

Primary role：context（情境）。

Secondary roles：validation（驗證）、supportive（輔助）、explanatory（解釋）。

P/S／EV-Sales 可以在虧損公司、尚未形成穩定 EBITDA（稅息折舊攤銷前盈餘）的公司提供一個仍可計算的 operating-scale valuation（營運規模估值）視角，但「可計算」不等於「可當獨立買進訊號」。

Strategy evidence（策略證據）只有在 OOS／Shadow（樣本外／影子）證明：
- 超越 raw PE/PB/EV-EBITDA；
- 控制 margin（利潤率）、growth（成長）、capital structure（資本結構）、sector（產業）、Regime（市場環境）；
- 且沒有 coverage（覆蓋）、turnover（換手）與 cost（成本）問題，
才有資格提出後續升級審查。

## 7. Anti-double-count Rule（防重複計算規則）

防重複原則：同一 sales denominator（營收分母）、同一 EV numerator（企業價值分子）、同一 corporate-action denominator（公司行動分母）或同一 margin/growth control（利潤率／成長控制）不得 duplicate（重複）成多張獨立投票；shared evidence（共享證據）只能形成一個 coordinated family view（協調式家族視圖）。

1. P/S 與 EV/Sales 共用 sales denominator，禁止作兩張獨立投票；最多是一個 family state（家族狀態）中的 capital-structure decomposition（資本結構分解）。
2. EV/Sales 與 EV/EBITDA 共用 EV numerator，禁止因分母不同直接當兩個獨立 alpha（超額報酬）票；需以 margin decomposition（利潤率分解）理解差異。
3. raw revenue growth／surprise 由 D07-01／09 擁有；D08 只擁有 price/EV relative to revenue。
4. margin／unit economics 由 D07-03／14 擁有；D08 把它們當 justified multiple（合理倍數）的控制，而不是複製品質分數。
5. peer normalization 由 D08-09 擁有；D08-06 extended scope 只產生 PIT-safe raw multiple（時點安全原始倍數）。
6. capital-action denominator integrity 由 D08-12 擁有；不得在 P/S 實作中再造第二套 share-count history。
7. financial institutions（金融機構）不從 generic sales multiple family 取得獨立票，交給 D08-18。

## 8. Proposed Owner（建議主責）

Proposed owner：**D08-06**。

建議把 D08-06 從狹義 `EV/EBITDA` 擴充為一個 coordinated enterprise/revenue multiples capability（協調式企業／營收倍數能力），可包含：
- EV/EBITDA；
- EV/Sales；
- P/S 作為 equity-value sales view；
- enterprise-value numerator contract；
- sales-denominator alignment；
- margin/growth decomposition。

D08-09 繼續主責 peer/sector normalization；D08-12 主責公司行動／估值分母；D08-18 主責金融機構。

沒有必要新增 D08 新模組，也不建議擴到 D08-02，因 D08-02 現在語意是「產業相對 PE」；把所有倍數公式都塞進 D08-02 會混淆 raw multiple construction（原始倍數建構）與 peer normalization（同業正規化）。

## 9. Maturity Starting Point（成熟度起點）

本回件建議 **不改 D08-06 現行 L2／40%**。

理由：
- `EXTEND_EXISTING_SCOPE` 不是把新能力自動視為 L2；
- EV/EBITDA 既有成熟度不能自動轉移給 P/S／EV-Sales；
- 新 sales-multiple sub-capability（營收倍數子能力）證據起點視同 L0，需另做 source/replay（來源／重播）、PIT、Shadow／OOS 驗證；
- canonical tracker（正式進度追蹤器）在 00-room owner audit（主責審查）前不應因本回件改值。

## 10. Terminal Recommendation（終局建議）

**EXTEND_EXISTING_SCOPE**

建議將 COV-05 納入 D08-06，而不是新增平行模組。D08-06 已是 enterprise-value multiple（企業價值倍數）天然 owner，P/S／EV-Sales 與 EV/EBITDA 又共享 revenue/margin/capital-structure economics（營收／利潤率／資本結構經濟邏輯）；新建模組會提高同一估值機制重複投票的風險。最強正向證據是台灣官方月營收與 IFRS 財報提供 replayable source family（可重播來源家族），使 trailing sales multiple（追蹤營收倍數）在資料上可研究；最強反證是 raw P/S 在不同毛利率、資本結構、產業與週期下沒有共同的「便宜」含義，EV/Sales 雖改善槓桿視角也仍高度依賴 margin/growth/WACC（利潤率／成長／資金成本）。因此它應成為 D08-06 的擴充能力與 context/validation（情境／驗證）工具，而不是新的單獨估值票。

Strongest positive evidence（最強正向證據）：MOPS 同時提供月營收與 IFRS 財報來源，既有 D08 又已有企業價值、同業正規化與公司行動分母防火牆；缺口可以用 D08-06 scope extension 補齊，不需新 owner。

Strongest counterevidence（最強反證）：同一 P/S 倍數對低毛利通路、高毛利科技、虧損成長公司與週期股的經濟含義可完全不同；低 P/S 可能只是低 margin、資本密集、景氣高峰或財務困境，而不是低估。

Unresolved blocker（未解阻塞）：EV/Sales 完整 PIT 仍受 debt/cash/NCI/non-common claims 與 lease taxonomy（債務／現金／非控制權益／非普通權利／租賃分類）限制；月營收與 IFRS TTM revenue 的 scope reconciliation 尚未凍結；Forward Sales 仍缺 authorized PIT forecast source。

### A. Source table（來源表）

| Source | Authority | Granularity | History | first-known semantics | Replay status | Limitation |
|---|---|---|---|---|---|---|
| MOPS 月營業收入 | 官方 | 公司×月份 | 歷史查詢 | announcement／firstObservedAt | SOURCE_FAMILY_FEASIBLE | 不等同 IFRS TTM revenue，需 scope reconciliation |
| MOPS IFRS 損益表／XBRL | 官方 | 公司×季度×版本 | 歷史／prospective | filing／firstObservedAt | PROSPECTIVE_PIT_FEASIBLE | historical exact filing clock 不完整 |
| MOPS 資產負債表 | 官方 | 公司×季度×版本 | source family 已證 | filing／firstObservedAt | SOURCE_FAMILY_FEASIBLE | EV component taxonomy 未全凍結 |
| TWSE／TPEx 價格 | 官方 | 公司×交易日 | 歷史 | session decision clock | REPLAY_FEASIBLE | market cap 需 PIT share count |
| Corporate-action/share denominator sources | 官方／既有研究契約 | 公司×事件／股數版本 | 部分已證 | knownAt + effective session | PARTIAL_PIT | 全歷史 coverage 非完整 |
| Analyst/issuer sales forecasts | 視來源 | 公司×forecast horizon | 未驗證 | publishedAt／revision lineage | SOURCE_BLOCKED | 未授權 canonical PIT history |

### B. Overlap table（重疊表）

| Existing module | Shared observable | Distinct observable | Shared source | Double-count risk | Owner boundary |
|---|---|---|---|---|---|
| D08-06 | EV numerator | EV/Sales + P/S family | price + financials | high | extend D08-06 |
| D08-09 | peer normalization | raw formula | industry + valuation | high | D08-09 normalizes only |
| D08-10 | value trap/cycle guards | raw sales multiple | financials | medium | guard vs construction |
| D08-12 | share denominator | sales multiple | corporate action | high | D08-12 denominator authority |
| D07-01 | revenue | valuation relative to revenue | MOPS | high | operations vs valuation |
| D07-03/14 | margin/unit economics | justified sales multiple | financials | high | quality vs valuation |
| D08-18 | financial valuation | generic P/S/EV-Sales | financial statements | high | financials specialist owner |

### C. Counterevidence table（反證表）

| Claim | Countermechanism | Falsification test | Current status |
|---|---|---|---|
| 低 P/S = 便宜 | 低毛利、資本密集、困境 | 控制 margin/ROIC/growth/sector | REJECT_UNIVERSAL_RULE |
| P/S 適合所有虧損公司 | 虧損可能沒有可達盈利路徑 | 加 unit economics/operating leverage | CONTEXT_ONLY |
| EV/Sales 解決 P/S 所有問題 | EV component taxonomy／lease／NCI 可錯 | 完整 PIT EV component QA | SOURCE_GATED |
| 月營收可直接做 IFRS TTM Sales | reporting scope／修正／合併範圍可能不同 | monthly-vs-quarterly reconciliation | NOT_EQUIVALENT_UNTIL_PROVEN |
| 同樣 EV/Sales 可跨產業直接比 | margin、growth、WACC、capital intensity 不同 | coherent peer normalization | FALSIFIED_AS_UNIVERSAL |
| P/S + EV/Sales 是兩個獨立訊號 | 同一 sales denominator／高度相關機制 | residualization／family orchestration | DOUBLE_COUNT_PROHIBITED |
| 低週期 P/S = 價值 | peak sales 可使分母暫時過高 | cycle-normalized revenue control | VALUE_TRAP_RISK |

## Evidence references（證據參照）

- Taiwan official（台灣官方）：MOPS 月營業收入、IFRS 財報／XBRL 與公司資訊。
- Valuation literature（估值文獻）：sales multiples 的合理水準依 profit margin（利潤率）、growth（成長）、risk/cost of capital（風險／資金成本）而變；P/S 在 loss firms（虧損公司）可提供仍可計算的尺度，但 leverage（槓桿）與 business-model（商業模式）會改變解讀。
- Taiwan research（台灣研究）：台股曾有 P/S／sales-to-price 與報酬的實證研究，但歷史分組結果只屬 mechanism/context evidence（機制／情境證據），不能直接匯入本系統門檻。


<!-- intake-preflight-trigger: 2026-10-04 room06; no semantic change -->
