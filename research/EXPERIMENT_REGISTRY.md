# 台股交易決策監控系統｜Research Experiment Registry

更新：2026-09-20  
治理狀態：RESEARCH ONLY / FORMAL CORE LOCKED

機器可讀鏡像：V8.7.5 的 RESEARCH_EXPERIMENT_CATALOG。Markdown 與程式定義若不一致，以新 experiment/version 明確修訂，不得靜默覆寫。

本檔用來固定研究假說、定義、反證條件與測試次數。任何漂亮結果都不得直接轉成正式選股規則；新參數、新窗口或新切法視為新的試驗，不得覆寫舊定義後只保留贏家。

## R01 成功突破 vs 假突破
- 假說：選股日仍守在突破基準之上的股票，若後續 3 個交易日收盤都守住基準，其後續路徑可能優於 3 日內收盤跌回基準者。
- 固定突破基準：選股日快照的 priorHigh20。
- 固定分類：HELD_3D＝未來 3 個交易日收盤皆 >= 基準；FAILED_CLOSE_WITHIN_3D＝3 日內任一收盤 < 基準。
- 反證：兩組 D5/D10 報酬、MFE/MAE 無穩定差異，或差異只存在單一 Regime/產業。
- 禁止：看到結果後改成 2 日、5 日或改用最低價判定，除非另立新 experiment ID。

### R01 v1.1 — Equal-date Breakout Path contrast
- PREREGISTERED before mature outcome interpretation; R01 v1.0 raw-row HELD/FAILED summaries remain descriptive.
- Primary effect: for each clean scanDate containing both HELD_3D and FAILED_CLOSE_WITHIN_3D mature D5 rows, compute `mean(HELD D5)-mean(FAILED D5)`; aggregate scanDate deltas with equal date weight.
- Dates missing either side are UNKNOWN for the paired contrast; do not zero-fill or borrow another date.
- Raw HELD/FAILED row means may still be shown as path summaries but cannot support Formal promotion.
- Machine guard: `research/cross_section_date_weighting_audit_v0_1.json`.

## R02 Selection Alpha vs Execution Alpha
- Selection Alpha：同一選股日 SELECTED 平均後續報酬減同日對照組平均後續報酬，再跨日彙總。
- Execution Alpha：首次正式 BUY 實際價相對選股日收盤價的價格改善；正值代表實際等待到較低價。
- 對照組：BROAD_CONTROL、QUALIFIED_NOT_SELECTED、NEAR_MISS、REJECTED_AFTER_BASE 分開報告，不混成一組。
- 反證：Selection Alpha 不穩定、Execution Alpha 只是少數極端值，或兩者只在單一市場狀態成立。
- 禁止：把未觸發 BUY 的股票當成 0% Execution Alpha。
- **2026-09-27 cohort-quality guard**：BROAD_CONTROL 現行為受前置 Shadow 抽樣 cap 影響的 quota-conditioned mixture；NEAR_MISS 的 nearScore 與 missingCount 完全冗餘，且 global top-12 truncation 可能造成 pool/channel coverage bias；REJECTED_AFTER_BASE 的 reason sampling 亦已確認舊版 reason-starvation。
- 因此在 cohort semantics / membership overlay 修復且 prospective QA 通過前，R02 對 BROAD_CONTROL、NEAR_MISS、REJECTED_AFTER_BASE 的結果只能標記 **COHORT_QUALITY_GUARDED / DESCRIPTIVE_ONLY**，不得作為 Formal promotion 證據。QUALIFIED_NOT_SELECTED 仍須另外報 sampling fraction/容量 cap。
- Durable guards：`research/broad_control_cohort_contamination_falsification_v0_1.json`、`research/near_miss_cohort_falsification_v0_1.json`、`research/rejected_after_base_sampling_falsification_v0_1.json`、`research/first_failure_attribution_falsification_v0_1.json`。

### R02 v1.1 — Pool-matched Selection Alpha
- 狀態：PREREGISTERED / COHORT_QUALITY_GUARDED / NO OUTCOME INSPECTION.
- R02 v1.0 原始同日 pooled 定義保留，不覆寫。
- Primary unit：`scanDate × pricePool`。
- 每一 pool 內先算 SELECTED 與同日同池 comparator；同日 consolidated 值以該池實際 SELECTED 數量加權，再跨 scanDate 等權彙總。
- 若某日某池缺同池 comparator，該 pool contrast = UNKNOWN；禁止拿另一池補。
- GENERAL、THOUSAND 必須分開報；consolidated 只作已匹配後的彙總。
- 理由：Formal 本身是 GENERAL/THOUSAND 獨立 3+3 且流動性門檻不同；單純同日 pooled 比較會有 pool-composition confounding。
- 仍受 Shadow cohort semantic / immutable provenance guard 約束；pool matching 不代表 cohort quality 已修復。
- Machine preregistration：`research/r02_pool_matching_falsification_v0_1.json`.


- **R02 outcome-quality guard**：D1/D3/D5/D10/D20、MFE/MAE、breakout hold/failure 只有在 symbol-session continuity 與 corporate-action continuity 有版本化證據時才可進 promotion-grade 統計。Generic `v7_history_cache` 的 next-available-bar slicing 不足以證明這件事。
- Current V8.12 history cache 為 `adjusted=false` raw daily candles；split / capital reduction 等不可直接用 raw close ratio 當策略報酬。Cash-dividend 則需預註冊 price-return vs total-return 口徑。
- 來源語意直接重用 History Source Revalidation、Corporate Actions / Symbol-Session 與 PV quality-overlay；R02 不自行從缺K或價差猜停牌／除權息。
- Machine guard：`research/r02_outcome_provenance_falsification_v0_1.json`.

## R03 產業輪動與 Persistence
- 假說：強勢產業 Top5 的連續留榜與市場 Regime transition 可能影響個股動能延續。
- 固定觀察：相鄰正式研究日 Top5 產業重疊率、各產業 Top5 最長連續天數、Regime transition count。
- 只使用前瞻正式研究日；UNKNOWN 與歷史重建市場狀態不得倒填。
- 反證：高 persistence 未對後續個股路徑提供增量，或效果被 Residual RS 完全解釋。

## R04 Residual RS
- 假說：扣除產業報酬後仍強的個股，比單純跟著強產業上漲的個股具有更獨立的動能。
- 現有欄位：price.residualSectorRs20。
- V8.7.4 第一階段：每個選股日 Shadow 橫截面以中位數切成 HIGH/LOW，只作描述性 D5 對照。
- 反證：HIGH/LOW 在 OOS、不同 Regime、不同年份無方向一致性，或與既有趨勢/突破品質高度冗餘。
- 禁止：Residual RS 與既有 RS 因子重複加權計票。

### R04 v1.1 — Equal-date Residual RS contrast
- PREREGISTERED before mature outcome interpretation; R04 v1.0 remains historical/descriptive.
- Keep the same within-date Residual RS median split.
- Primary effect: for each clean scanDate with both HIGH and LOW, compute `mean(HIGH D5)-mean(LOW D5)`; then aggregate date deltas with equal scanDate weight.
- Raw stock-row HIGH/LOW means may be shown only as descriptive path summaries.
- No new threshold or factor definition.

## R05 盤中動能 vs 隔夜動能
- 固定分解：下一交易日 Overnight = next open / scan close - 1；Intraday = next close / next open - 1。
- 假說：台股個股動能的有效成分可能主要出現在盤中而非隔夜，兩者不可混成單一日報酬。
- 反證：兩者差異不穩定、樣本太少、或只由跳空極端值造成。
- 後續：累積足夠樣本後再研究多日 overnight/intraday compounding；不得先挑最有利窗口。

### R05 v1.1 — Equal-date Intraday-minus-Overnight contrast
- PREREGISTERED before mature outcome interpretation; R05 v1.0 row-pooled component summaries remain descriptive.
- Primary effect: within each clean scanDate, compute the mean of each stock's `intradayPct-overnightPct`; then aggregate scanDate means equally.
- Overnight and intraday component-level row distributions remain descriptive diagnostics.
- No change to D1 definitions or timing windows.
- Machine guard: `research/cross_section_date_weighting_audit_v0_1.json`.

## R06 Market Regime Transition
- 固定資料：trade_research_days.market_json.regime 的前瞻正式序列。
- 觀察：Regime transition count、各 transition 下 Shadow/Selected 後續路徑。
- 反證：transition 分組樣本不足、轉換定義高度不穩定、或新增 regime 只為解釋過去結果。
- 禁止：用未來市場資訊回填選股日 regime。

## R07 Quiet Strength vs Attention Strength
- Attention proxy：volume.volumeTodayVsPrev5，只代表相對成交量，不等同新聞、搜尋量或社群注意力。
- Strength：price.residualSectorRs20。
- 固定第一階段切法：每個選股日 Shadow 橫截面各自以中位數切分，形成 Quiet Strength / Attention Strength / Quiet Weak / Attention Weak。
- 反證：Quiet Strength 未優於 Attention Strength，或結果只存在極少數日期。
- 禁止：事後改成 1.5x、1.8x、2.0x 等固定倍量門檻追求漂亮結果；新門檻必須另立 experiment ID。

### R07 v1.1 — Equal-date Quiet vs Attention contrast
- PREREGISTERED before mature outcome interpretation; R07 v1.0 raw-row group means remain descriptive.
- Keep the same within-date Residual RS and volumeTodayVsPrev5 median split.
- Primary effect: for each clean scanDate with both QUIET_STRENGTH and ATTENTION_STRENGTH, compute same-date mean difference and aggregate dates equally.
- Four-quadrant summaries must report equal-date means/coverage; no missing-group zero fill or cross-date substitution.
- Machine guard: `research/r04_r07_date_weighting_falsification_v0_1.json`.

## R08 Two-Engine Momentum
- 目的：檢驗同樣是強勢股，Quiet Underreaction 與 Attention Continuation 是否具有不同的後續路徑與 Regime 敏感度。
- 固定分類：沿用 R07，同一選股日以 residualSectorRs20 與 volumeTodayVsPrev5 的橫截面中位數切分；強勢且低相對量＝QUIET_UNDERREACTION_PROXY，強勢且高相對量＝ATTENTION_CONTINUATION_PROXY。
- 固定結果：D5 / D10 / D20 報酬、MFE、MAE，以及同日兩引擎平均差與 Market Regime 分布。
- 外部證據：月營收、融資融券、官方注意/處置只作 context / falsification metadata，不參與 R08 分類，不加分。
- 反證：兩引擎沒有穩定路徑差異、差異只由少數選股日或單一 Regime 驅動，或被 Residual RS / Breakout Quality 等既有因子完全解釋。
- 禁止：事後尋找 1.5x / 1.8x / 2.0x 量能、任意 RS 門檻或不同持有窗口來挑最好看的版本；任何新切法另立 experiment/version。

- **R08 date-weighting clarification**：現行 `researchTwoEngineStudy().paired` 已先做同日 Quiet−Attention 差再跨日統計，保留為 primary paired estimand；`byEngine` 的 raw-row 平均僅作描述，不作主要 effect estimate。其他 cohort/outcome provenance guards 照常適用。

## Evidence Readiness Matrix
- V8.7.10 對 R01–R08 使用既有治理門檻顯示研究成熟度，不新增選股條件。
- 狀態：WAITING_DATA、ACCUMULATING、DESCRIPTIVE_READY、DATA_QUALITY_BLOCKED。
- D5 因子型研究沿用至少 60 筆成熟樣本與 15 個獨立選股日；同日配對研究沿用至少 20 個成熟配對日；Regime/Persistence 沿用至少 15 個可用正式研究日。
- DESCRIPTIVE_READY 只表示「可開始描述性解讀」，不是 promotion eligible，更不是交易訊號。
- 若 Shadow Archive 為 RESEARCH_DATA_GAP，相關實驗一律 DATA_QUALITY_BLOCKED，先修資料再解讀。

## 共通治理
- 證據獨立單位優先採「選股日」，不是單一股票筆數；同一選股日多檔股票視為群聚樣本。
- V8.7.8 起，7 組增量對照固定做 leave-one-scan-date-out 敏感度；這是既有預註冊假說的穩健性診斷，不另創造可挑選的新因子。
- 少於 20 個成熟「同日配對」日期：只標記 ACCUMULATING，不作方向性結論。
- 新參數/新窗口/新分類＝新試驗次數，必須保留舊結果。
- 必須同時查看 coverage、zero-pick、MFE、MAE、平均報酬、盈虧比、交易成本與滑價。
- 外部證據擴充（如 V8.7.11 的 TPEx 月營收、TWSE 實際 SBL 賣出）不自動形成新 experiment；若未來要測 5/20/60 日 shorting-flow 或營收 persistence 門檻，必須另行預註冊，不能從 raw metadata 直接挑窗口。
- Shadow 標的不監控、不配資金、不推播、不交易。
- 研究結果不得自動修改 Formal core；正式核心升級仍需獨立版本、OOS、purged holdout、冗餘檢查與人工策略審查。


## D16-CAL-01｜C1 前瞻機率校準：基準率 vs 優先分數
- 狀態：PREREGISTERED_BEFORE_FIRST_GENUINE_C1_OUTCOME / RESEARCH_ONLY。
- 正式詳細規格：`research/D16_19_25_C1_PROBABILITY_PREREG_20261005_V0_1.md`。
- 母體：真正前瞻、不可變 C1 完整母體中的正式 qualified rows；必須有 `actualRankingTuple.priorityScore`。不得只用 SELECTED／Top6 或 bounded Shadow 樣本。
- 主要目標：`D16_C1_D5_REFERENCE_CLOSE_POSITIVE_V0_1`；精確第五個後續官方交易日收盤高於決策日 reference close 為 1，否則為 0；交易日／symbol continuity／corporate-action 語意不能證明則 UNKNOWN。
- 基準臂：`C1_D5_BASE_RATE_BETA11_V0_1`，Beta(1,1) 起始，只用當次決策前已成熟標籤。
- 挑戰臂：`C1_D5_PRIORITY_LOGISTIC_MONOTONE_V0_1`，唯一 predictor 是 `actualRankingTuple.priorityScore`；training-only 標準化，一維 logistic，斜率非負，不搜尋其他排名欄位、Regime 或窗口。
- 冷啟動：少於 20 個獨立成熟 scan dates 僅允許 base-rate；20～39 日可進 exploratory prospective score fitting；primary validation 需至少 40 個有效獨立日期並通過 D16-06 dependence / episode / dominance gates。
- Primary OOS estimand：每個 scanDate 內先算 Brier／log-loss，再以等日期權重比較 challenger−base-rate；row-weighted 指標只作描述。
- 雙分母：完整 C1 母體 coverage、prediction-frozen coverage、matured-label coverage 必須分開；結果成熟不得改寫 frozen prediction。
- 反證：挑戰臂在 untouched chronological OOS 無法優於 base-rate、斜率反覆歸零、效果只存在 row-weighted 或單一日期／episode、或需事後換 target／score／window，皆不得宣稱校準增益。
- 禁止：在 V0.1 加入 rewardPerRisk、marketConsensusScore、setupQuality、sectorFlow、relativeStrength、Regime、isotonic／Beta／多特徵模型；任何新增皆另立 experiment/version 並計入 multiple-testing family。
- Formal Core：LOCKED；System 1／System 2 決策不受影響；D16-19、D16-25 成熟度不因預註冊而提高。


## D16-SDA022-01｜System1 vs System2 SHORT_MOMENTUM D5 增量資訊
- 狀態：PREREGISTERED / OUTCOMES_CLOSED / EXPLORATORY_OUTER_STREAM_ENROLLED / FORMAL_CORE_LOCKED。
- 票：`SDA-022`。
- 研究流：`ROOM11_CROSS_SYSTEM_INCREMENTALITY_STREAM_20261006_V0_1`。
- Primary pair：System1 current Formal A/B short-horizon policy vs System2 `SHORT_MOMENTUM / V0.1-CONTRACT`。
- Primary target：`SDA022_S1_SM_D5_REFERENCE_CLOSE_POSITIVE_V0_1`；精確第五個後續官方台灣交易日 close 高於共同 decision-session reference close。
- Primary estimand：`DATE_BALANCED_BRIER_LOSS_IMPROVEMENT`，比較 `SYSTEM1_ONLY` vs `SYSTEM1_PLUS_SHORT_MOMENTUM`；date delta = augmented Brier − baseline Brier，負值為有利方向。
- Primary population：共同資訊截點可證明、兩邊 policy state 可定義的 common-support rows；selected-only 禁止；UNKNOWN / incomplete / admission-blocked 保留分母。
- Multiple-comparison boundary：D5 + `SYSTEM2_INCREMENTAL_OVER_SYSTEM1` 為唯一 primary；D1/D3/D10 不得救援；其他 System2 strategy 必須另立 experiment/version。
- Dependence：沿用 D16-06，涵蓋 date clustering、repeated symbols、overlapping D5 windows、sector clustering、Regime / replication-cluster concentration、SDA-016 outcome-footprint consumption、missingness / positivity。
- Current outer-stream objective：`EXPLORATORY_ONLY`；不得宣稱 confirmatory FWER/FDR/mFDR 控制。
- Stopping：`SINGLE_PRIMARY_LOOK`；不允許 efficacy / futility outcome peeking；只有 pre-outcome readiness / integrity checks 可持續進行。
- Primary opening gate：System1 fingerprint 5/5、System2 fingerprint、physical NC-T01、prospective pair receipts、common cutoff、exact model-state encoding、ModelMethodReceipt、MDE/precision target、>=40 effective independent decision dates、class/replication/coverage/consumption gates、explicit outer-stream state 全部完成。
- Current verified：System1 `S22-T01~T05 = 5/5 PASS`；D16 prereg `S22-T25~T28 = 4/4 PASS`。
- Current pending：System2 `S22-T06~T10`、physical NC-T01 `S22-T11~T16`、prospective `S22-T17~T24`、MDE/precision target。
- Model method freeze：`research/D16_SDA022_D5_MODEL_METHOD_FREEZE_20261007_V0_1.md` / `research/d16_sda022_d5_model_method_receipt_20261007_v0_1.json`。Primary encoding = coarse System1 policy state + SHORT_MOMENTUM entry-readiness state；ridge logistic lambda=1 primary，0.1/10 non-rescuing sensitivity；identity calibration；no interaction / rank / Regime / gate-vector expansion；date-balanced Brier remains primary。
- Human prereg：`research/SDA022_D16_S1_SHORT_MOMENTUM_D5_INCREMENTALITY_PREREG_20261006_V0_1.md`。
- Machine prereg：`research/SDA022_D16_S1_SHORT_MOMENTUM_D5_INCREMENTALITY_PREREG_20261006_V0_1.json`。
- Outer-stream enrollment：`research/D16_SDA022_OUTER_STREAM_ENROLLMENT_20261006_V0_1.json`。
- Stopping rule：`research/D16_SDA022_D5_STOPPING_RULE_20261006_V0_1.md` / `research/D16_SDA022_D5_STOPPING_RULE_20261006_V0_1.json`。
- 禁止：在 model method / precision target freeze 前開經濟結果；把 output overlap 當 independent confirmation；把 low overlap 當 diversification；事後改 horizon/strategy/predictor family；刪除失敗 hypothesis 或換 id 重置研究流歷史。
