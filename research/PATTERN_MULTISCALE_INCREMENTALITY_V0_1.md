# D01 DL-008 — 多週期型態的來源資訊、表示增量與預測增量防火牆

Updated: 2026-10-02 Asia/Taipei  
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / FORMAL_CORE_LOCKED

## 1. 研究問題

多週期分析常把 Weekly（週線）、Daily（日線）與 Intraday（盤中）同向視為「多重確認」。

本研究把這句話拆成三個不同問題：

1. Source Novelty（來源新穎性）：
   較高週期是否真的帶入新的市場原始資訊？
2. Representation Novelty（表示新穎性）：
   即使原始來源相同，較高週期的壓縮／拓樸表示是否形成目前基準沒有的有效結構摘要？
3. Predictive Incrementality（預測增量）：
   在既有日線長週期控制、價量、波動、Regime（市場狀態）等變數之後，該表示是否仍能改善未來結果？

前兩者可以在不看未來報酬時驗證。第三者目前維持 UNKNOWN。

## 2. 與 03 技術指標研究室的統一

本研究不另造一套多週期語意。

直接繼承：
- research/TECHNICAL_INDICATOR_MULTITIMEFRAME_AGGREGATION_V0_1.md
- research/technical_indicator_multitimeframe_contract_v0_1.json

共用原則：
- Weekly / Daily / 15m / 5m 是 hierarchy（階層脈絡），不是票數。
- SAME_EVENT_DUPLICATE、NESTED_HORIZON、SHARED_COMPONENT、DISTINCT_HORIZON_CONTEXT、DISTINCT_SESSION_INFORMATION 為共用 overlap class（重疊類別）。
- partial higher-timeframe bar（未完成高週期 K 棒）不可與 completed bar（已完成 K 棒）混用。
- 重疊窗口與多週期快照不能膨脹 effective N（有效樣本數）。
- timeframe（週期）與 bar-size（K 棒大小）選擇本身屬 multiple-testing family（多重檢定家族）。

D01 的新增部分只處理 Pattern topology（型態拓樸）特有的 parent-child（父子結構）與 major-zone（大型結構區）問題。

## 3. 數學層：週 K 不會增加原始 OHLC 資訊

若一週由五個已驗證有效日 K 組成：

Weekly Open = 第一個日 K Open  
Weekly High = 五日 High 的最大值  
Weekly Low = 五日 Low 的最小值  
Weekly Close = 最後一個日 K Close

因此，在 constituents（日線構成資料）完整存在時，週 OHLC 是日 OHLC 的 deterministic aggregation（確定性聚合）。

所以：

WEEKLY_FROM_DAILY != NEW_RAW_SOURCE.

更強的反證是 aggregation（聚合）為 many-to-one（多對一）。

可以存在兩條完全不同的日線路徑：
- Week A：第一天先衝高，再回落／修復；
- Week B：第二天才衝高，後面走另一條路；

但兩者最後具有完全相同：
Open=100, High=110, Low=99, Close=107。

因此週 K：
- 不可能增加 constituent daily path（構成日線路徑）沒有的原始價格資訊；
- 反而會丟失 path ordering（路徑順序）資訊；
- 所以週線不能取代日線；
- 也不能因為週線與日線「都看多」就當兩個獨立證據。

新增 executable research primitives（可執行研究原件）：
- research/pattern_multiscale_incrementality_v0_1.mjs
- research/test_pattern_multiscale_incrementality_v0_1.mjs
- research/pattern_multiscale_incrementality_contract_v0_1.json

## 4. 但「同來源」不等於「完全沒有研究價值」

這裡需要避免另一個極端錯誤：

「週線由日線組成」不代表週線拓樸必然沒有增量價值。

原因是目前 Formal / research baseline（正式／研究基準）不會把整段歷史日線 path 原封不動丟進決策，而是使用有限摘要，例如：
- priorHigh20 / priorHigh60；
- MA60 / MA120；
- ret20 / ret60；
- ATR / volatility；
- close location；
- lateStage / maxChase；
- Daily Pattern setup。

所以一個 confirmed weekly parent structure（已確認週線父結構）可能是一個 nonlinear compressed representation（非線性壓縮表示）。

它沒有增加 raw source information（原始來源資訊），但可能增加 representation information relative to the current baseline（相對現有基準的表示資訊）。

因此凍結三層判斷：

### Layer A — Source Novelty
- DETERMINISTIC_AGGREGATION_NO_NEW_RAW_INFO
- SHARED_ROOT_OVERLAPPING_OBSERVATIONS
- SAME_ROOT_DISTINCT_HORIZON_HISTORY
- DISTINCT_SOURCE_FAMILY_OUTSIDE_PATTERN_ROOT
- UNKNOWN

### Layer B — Representation Novelty
- REENCODING_OR_OVERLAPPING_REPRESENTATION
- CROSS_SCALE_RELATION_REPRESENTATION_CANDIDATE
- HIERARCHICAL_CONTEXT_REPRESENTATION_CANDIDATE
- CROSS_LANE_REPRESENTATION_REQUIRES_SEPARATE_GOVERNANCE
- UNKNOWN

### Layer C — Predictive Incrementality
目前唯一合法狀態：
UNKNOWN_REQUIRES_PREREGISTERED_OUTCOME_TEST

沒有任何 outcome-free（不看結果）測試可以把 Layer C 自動改成正向 alpha。

## 5. D01-10 真正值得保留的多尺度問題

不建立 multiTimeframeScore（多週期分數）。

只保留以下 relation descriptors（關係描述子）：

1. parent-child relation：
   CONTAINS / REFINES / CONTRADICTS。
2. child trigger vs parent major boundary：
   例如 daily local breakout 是否直接撞進 weekly major resistance。
3. parent maturity vs child lifecycle：
   只作 descriptor（描述），不得新增票數。
4. shared trigger / shared anchor：
   明確標記同一事件或同一錨點，供去重。
5. normalized distance to parent structural boundary：
   僅作 PATTERN-RG2 nested-resistance（巢狀壓力）既有假說的候選描述。

不新增 R09。

未來 outcome study（結果研究）仍併入既有：
PATTERN-RG2 nested resistance.

## 6. 必要 baseline controls（基準控制）

任何週線／日線增量研究至少控制：

- priorHigh60 or majorStructuralHigh；
- MA60 / MA120（若資料可用）；
- ret20 / ret60 或相同 real-time horizon（實際時間跨度）的報酬；
- ATR / realized volatility（實現波動）；
- close location（收盤位置）；
- daily Pattern major-zone state（日線大型結構區狀態）；
- D02 Price-Volume acceptance（價量接受度，適用時）；
- sector / market regime（產業／市場狀態）；
- liquidity（流動性）；
- current daily setup quality（日線當前型態品質）。

核心 falsification（反證）：

如果 weekly parent state（週線父結構狀態）在以上控制後沒有 stable residual value（穩定殘差價值），它只能保留在：
EXPLANATION / CONTEXT（說明／脈絡），不能進 scoring（計分）。

## 7. Equal-horizon control（等時間跨度控制）

「Weekly 比 Daily 好」很可能只是 effective horizon（有效時間跨度）不同。

所以 outcome 前先凍結兩種比較：

A. same bar count / different clock horizon  
相同 K 棒數，不同實際時間跨度。

B. similar clock horizon / different aggregation  
接近相同實際時間跨度，不同聚合方式。

例：
- calendar weekly return（曆週報酬）
vs
- rolling 5-session return（滾動五交易日報酬）。

若結果差異只在 horizon（跨度）而不是 aggregation（聚合），不得宣稱「週線共振有效」。

## 8. Bar-boundary placebo（K 棒邊界安慰劑）

Weekly calendar boundary（週線曆法邊界）本身是一個任意聚合算子。

未來 PATTERN-RG2 結果研究需預註冊至少一個 boundary placebo（邊界安慰劑），例如：
- calendar week；
- rolling equivalent horizon。

目的不是尋找最好設定，而是反證效果是否過度依賴某個方便的 K 棒切法。

禁止 outcome 後再掃 Mon-Fri / Tue-Mon / N-session 週期找最好結果。

## 9. Effective N（有效樣本數）防膨脹

同一個 weekly Cup parent（週線杯型父結構）可能連續五個 daily scans（日線掃描日）都存在。

這不是五個獨立 parent patterns（父型態）。

有效推論單位至少需 cluster（群聚）於：
- scan date；
- parent episode；
- child episode；
- relation family。

Daily snapshots（每日快照）可以保存 maturity evolution（成熟演變），但不能把 snapshot count（快照數）當 independent event count（獨立事件數）。

Ahn, Hambusch & Hong (2026) 顯示 overlapping returns（重疊報酬）會機械式累積 autocorrelation（自相關）並誇大 time-series momentum（時間序列動能）強度。這不是 Pattern 研究的直接 alpha 證據，但它強化了本研究的 overlapping-window firewall（重疊窗口防火牆）。

DOI: 10.3390/jrfm19010046

## 10. 多時間尺度的正面證據

Xue et al. (2026), Pacific-Basin Finance Journal, DOI 10.1016/j.pacfin.2026.103201：
- 以 2010-2025 中國市場 monthly data（月資料）建立 wavelet multi-timescale（小波多時間尺度）+ shrinkage（收縮）模型；
- 多尺度分解確實可能改善 forecast structure（預測結構）；
- 但 predictor performance（預測因子表現）具有明顯 heterogeneity（異質性）；
- technical indicators（技術指標）相對不穩定；
- short-term components（短期成分）在不同尺度中仍占主導。

D01 解讀：
「多尺度可以有用」不等於「較高週期天然更有用」，更不等於「週＋日同向就加分」。

Dai, Zhu & Kang (2021), International Review of Economics & Finance, DOI 10.1016/j.iref.2020.09.006：
wavelet de-noising（小波去噪）後的技術表示能改善部分預測。

D01 解讀：
同一價格來源的 transformed representation（轉換表示）可能有增量，因此不能因 deterministic transform（確定性轉換）就直接宣判無用；但必須做 baseline-residual test（基準殘差檢驗）。

Lin (2018), Journal of Financial Markets, DOI 10.1016/j.finmar.2017.09.003：
aligned technical index（對齊技術指數）透過 PLS（偏最小平方法）整合技術訊號，在其美國市場設計中具有 OOS（樣本外）預測力。

D01 解讀：
representation aggregation（表示整合）可能去除個別訊號噪音，但這不是多週期票數邏輯，且不可直接移植為台股 Pattern alpha。

## 11. 反面證據與 overfit（過度擬合）風險

Yang et al. (2019), Pacific-Basin Finance Journal, DOI 10.1016/j.pacfin.2018.08.003：
在 data-snooping corrections（資料探勘修正）下，大量 technical rule（技術規則）的優勢可消失；其 15,376 規則的測試明確說明搜尋空間本身就是風險來源。

Psaradellis et al. (2023), International Journal of Forecasting, DOI 10.1016/j.ijforecast.2021.10.002：
18,410 個 technical trading rules（技術交易規則）搭配 false-discovery control（錯誤發現控制）後，不同資產類別的穩健程度差異很大。

D01 解讀：
timeframe pair（週期配對）、bar alignment（K 棒對齊方式）、lookback（回看長度）、parent/child relation（父子關係）都必須計入 multiple-testing family，不能事後挑最漂亮組合。

Kole et al. (2017), Journal of Financial Econometrics：
在 VaR（風險值）研究中，temporal aggregation（時間聚合）本身會改變 forecast quality（預測品質），且 daily data（日資料）在其設計中優於較低頻率聚合。

D01 解讀：
aggregation operator（聚合算子）會造成 information loss（資訊損失）；higher timeframe（較高週期）不是免費的 denoising（去噪）。

## 12. 預註冊的未來結果檢驗

不現在執行 outcome join（結果連結）。

未來 Pattern prospective evidence（型態前瞻證據）成熟後：

B0 baseline（基準模型）：
現有 daily long-horizon controls（日線長週期控制）+ D02 + regime + liquidity。

B1 challenger（挑戰模型）：
B0 + frozen cross-scale relation representation（凍結的跨尺度關係表示）。

Primary estimand（主要估計量）：
B1 相對 B0 的 paired / equal-date incremental value（配對／同日期增量），不是 B1 單獨勝率。

必要 robustness（穩健性）：
- independent scan dates（獨立掃描日）；
- episode/date clustering（事件／日期群聚）；
- regime / industry split（市場狀態／產業分層）；
- equivalent-horizon comparator（等跨度對照）；
- boundary placebo（邊界安慰劑）；
- cost / opportunity-cost（成本／機會成本，若影響交易）；
- purged holdout / OOS（清洗式保留集／樣本外）；
- multiple-testing control（多重檢定控制）。

## 13. 本輪治理判定

D01 maturity remains 51.7%.

D01-10 原本已是 L3，因此本輪的 specification / executable contract（規格／可執行契約）強化不足以升級成熟度。

No forward Pattern outcomes inspected.
No historical Pattern Shadow fabrication.
No runtime wiring.
No R09.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 14. Exact next continuation

1. 將 DL-008 executable contract（可執行契約）送入可重播 Node（節點執行環境）驗證；未執行前不得宣稱 16/16 PASS。
2. Deepen PATTERN-RG2 nested resistance（巢狀壓力）：
   明確凍結 local boundary（局部邊界）與 major parent boundary（大型父邊界）的 identity / distance / lifecycle 定義。
3. 建立 equal-horizon / bar-boundary placebo（等跨度／K 棒邊界安慰劑）規格，不掃描最佳 timeframe。
4. 將 weekly parent relation（週線父關係）映射到現有 Formal priorHigh60 / MA60 / major-zone controls，先做 outcome-blind redundancy map（不看結果的冗餘圖）。
5. Pattern runtime 仍等待 PIT RAW_EXECUTION + TECHNICAL_CONTINUITY + explicit symbol-session + fit-for-purpose volume semantics。
6. Prospective outcome join 仍等待 COMPLETE immutable Pattern parent/run receipts。
7. Formal Core unchanged.
