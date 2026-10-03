# D14-15｜市價／限價與委託類型選擇研究契約 V0.1

更新：2026-10-03 Asia/Taipei
狀態：L2_MECHANISM_FALSIFICATION_DEFINED / PIT_REPLAY_PENDING / FORMAL_CORE_UNCHANGED
正式核心：LOCKED

## 研究問題

在固定同一個正式訊號、同一標的、同一決策時間與同一目標股數下，市價、限價、IOC、FOK 與 ROD 的選擇，是否能在「成交機率、成交速度、滑價、部分成交、機會成本、逆向選擇與市場衝擊」之間產生可重播且具經濟意義的差異？

本模組只研究 execution choice，不新增選股訊號，不改 PriorityScore、BUY、ADD、REDUCE、RE-ADD、Top6／3+3、資金上限或推播條件。

## 台灣市場機制基線

依臺灣證券交易所目前公開交易制度：

- 開盤與收盤採集合競價；盤中一般交易原則採逐筆交易。
- 集合競價時段僅接受限價 ROD；市價、IOC、FOK 不適用。
- 逐筆交易時段可使用限價 ROD、限價 IOC、限價 FOK、市價 ROD、市價 IOC、市價 FOK。
- 市價申報在價格優先上優先於限價申報；同價位再依時間優先。
- IOC 可立即成交全部或部分，未成交部分取消；FOK 必須立即全部成交，否則全部取消。
- 盤中瞬間價格穩定措施會改變可成交／取消語意，因此不得把所有盤中時間視為同一撮合狀態。
- 盤中零股具有離散撮合機會，不能直接套用整股逐筆交易的連續等待時間模型。

官方來源：
- https://www.twse.com.tw/zh/products/system/trading.html
- https://twse-regulation.twse.com.tw/eng/en/law/DOC01.aspx?FLCODE=FL007304&FLNO=58-8

## 正向機制假說

H1｜急迫訊號下，積極型委託可能降低未成交與訊號衰減造成的機會成本，但代價可能是較差成交價格與較高市場衝擊。

H2｜非急迫訊號下，限價委託可能改善條件式成交價格，但必須把未成交、晚成交與被逆向選擇的成本一起計入；只比較已成交樣本會產生 selection bias。

H3｜IOC／FOK 的經濟效果高度依賴可見深度、目標數量與訊號半衰期。FOK 對「必須一次完整建立」的交易有語意價值，但可能犧牲成交率；IOC 可降低殘單暴露，但可能提高部分成交與後續補單成本。

H4｜同一委託類型在整股、零股、集合競價、逐筆交易、瞬間價格穩定措施期間不可直接合併估計。

## 必做反證

C1｜「市價一定比限價差」：錯。若限價未成交而價格快速遠離，機會成本可能大於市價滑價。

C2｜「限價成交價較好，所以執行品質較好」：不足。這是只看 conditional-on-fill 的選擇偏誤；必須把未成交與延遲納入。

C3｜「市價一定立即全數成交」：不得假設。市場深度、價格穩定措施、可交易狀態與委託存續條件都可能影響結果。

C4｜「同一訊號可用收盤價比較不同委託」：禁止。反事實比較必須從同一 decision timestamp、同一可觀測 order book／機制狀態出發。

C5｜「最佳委託類型可跨股票、跨 regime 固定」：未證明。價差、深度、波動、股價層級、零股／整股、訊號衰減速度與市場狀態都可能造成交互作用。

## 反事實比較契約

每個樣本固定：
- signalEventId
- symbol
- side
- decisionAt
- signalPrice/referencePrice
- targetShares
- lotType
- matchingMechanism
- volatilityInterruptionState
- bestBid/bestAsk 與可取得的 depth snapshot
- orderType
- limitPrice（若適用）
- submittedAt
- acknowledgedAt
- fills[]：fillAt、fillPrice、fillQty、broker provenance
- cancel/expire/reject reason
- terminal horizon

禁止：
- 用 plan preview shares 代替 live quantity；
- 用 push suggestedShares 代替 broker order；
- 用 signal price 代替 fill price；
- 用模擬撮合代替 broker fill；
- 將 UNKNOWN 當成未成交或 0 成本。

## 評估指標

成交面：
- fill rate
- time-to-first-fill
- time-to-complete
- fill ratio
- partial-fill count
- cancel/reject rate

價格與成本面：
- arrival-price shortfall
- spread capture/cost
- realized slippage
- explicit commission/tax（需 provenance）
- market impact（資料足夠時）
- opportunity cost of unfilled shares
- implementation shortfall

所有成本必須維持 ACTUAL / PARTIAL_ACTUAL / MODELED / UNKNOWN 分層。

## PIT／OOS／Walk-forward 與偏誤防火牆

- PIT：只能使用 decisionAt 當下可知的行情、撮合狀態、訊號與委託資訊。
- OOS：委託選擇規則先凍結，再在後續獨立日期驗證。
- Walk-forward：若參數依流動性／波動分層校準，必須只用過去視窗更新。
- selection bias：未成交樣本必須保留。
- survivorship bias：不得只取目前仍上市且資料完整者。
- data snooping／multiple testing：委託類型、價差門檻、急迫性門檻與 horizon 必須預註冊。
- regime dependence：至少分離一般逐筆、集合競價、瞬間價格穩定措施、零股機制。
- sample size：不得因單一成功案例升級為經濟優勢。
- fill provenance：沒有 broker-confirmed fill 的樣本不得宣稱 realized execution edge。

## 失效條件

若無法取得 decisionAt 的機制狀態與足夠行情快照，只能研究 broker-side realized outcome，不能做嚴格 order-choice counterfactual。

若只有成交樣本、沒有未成交／取消／拒單樣本，禁止比較 fill probability 與總 implementation shortfall。

若訊號本身在不同委託策略下會因延遲而改變，必須另建 policy-level simulation；不得把固定訊號反事實誤稱為完整策略反事實。

## 與既有 D14 模組的邊界

- D14-03／04：提供 signal-vs-fill 與 slippage 語意。
- D14-05：提供 partial fill 語意。
- D14-07：提供 latency 語意。
- D14-08／14：提供零股／集合競價機制差異。
- D14-12：最終 execution alpha 歸因。
- D14-16：未來比較 VWAP／TWAP／Participation 等執行方法。
- D14-17：implementation shortfall／market impact 成本分解。
- D14-18：alpha decay／urgency 決定何時價格改善值得犧牲成交速度。

D14-15 的責任是「委託類型選擇契約」，不得重複建立上述成本定義。

## 本輪結論

正向機制成立於理論與交易制度層級：委託類型確實改變價格優先、存續方式、部分成交與未成交風險。

但沒有任何證據支持一個全域最佳委託類型。最重要反證是：只看已成交限價單的價格改善會忽略未成交與逆向選擇；只看市價成交速度又會忽略滑價與市場衝擊。

因此 D14-15 可由 L0 升為 L2：機制、反證、資料需求與驗證契約已定義。L3 仍關閉，直到完成台股 PIT 可重播樣本與來源驗證。

## 精確下一續接點

建立至少 3 個獨立台股交易日的 prospective read-only order-choice receipt：
1. 同時保留 executed 與 unexecuted/cancelled/rejected opportunities；
2. 分離整股逐筆、零股離散撮合與集合競價；
3. 保存 decisionAt 行情／機制 provenance；
4. 正向連結 broker-confirmed fills；
5. 預註冊 marketable-limit 與 market/IOC comparator；
6. 先做 replay determinism，再評估是否具備 L3 readiness。

三個日期只觸發 readiness review，不自動升級。

Formal Core unchanged.
