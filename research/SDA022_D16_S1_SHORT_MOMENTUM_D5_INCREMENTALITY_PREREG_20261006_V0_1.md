# SDA-022｜System1 vs SHORT_MOMENTUM D5 增量資訊預註冊 V0.1

更新：2026-10-06 Asia/Taipei
狀態：TARGET_ESTIMAND_PREREGISTERED / METHOD_MDE_OUTER_STREAM_PENDING / OUTCOMES_CLOSED / RESEARCH_ONLY
主責：11｜統計驗證與策略市場狀態研究室 / D16
票：SDA-022
Formal Core impact：NONE

## 1. 第一個高風險配對

Primary pair：
- System1：current Formal A/B short-horizon selection policy；
- System2：`SHORT_MOMENTUM / V0.1-CONTRACT`.

理由：
00 frozen architecture baseline 將此配對標為目前最高 structural convergence-risk surface。

本研究不把所有 System2 strategies 混在一起。

`SWING_GROWTH`、`INDUSTRY_TREND`、`EVENT_DRIVEN`、`VALUE_REVERSION`
若未來進入增量驗證，必須有各自 experiment/version/horizon identity。

## 2. Primary question

在相同 decision date、相容 information cutoff、相同 common support 上：

> System2 SHORT_MOMENTUM 的 pre-outcome strategy state，是否在 System1 frozen policy state 之外，對 D5 正報酬機率提供前瞻增量資訊？

Primary direction：
`SYSTEM2_INCREMENTAL_OVER_SYSTEM1`.

Symmetric reverse question：
`SYSTEM1_INCREMENTAL_OVER_SYSTEM2`
只作 secondary preregistered comparison；
不得在 primary 失敗後拿 reverse result 救援 primary claim。

## 3. Primary target

Target id：
`SDA022_S1_SM_D5_REFERENCE_CLOSE_POSITIVE_V0_1`.

Binary target：
- Y=1：精確第五個後續官方台灣交易日 close > decision-session common reference close；
- Y=0：<=；
- UNKNOWN：第五個合法 symbol-session 無法證明、price path 缺失、corporate-action / symbol continuity 未證明，或 reference close 語意不安全。

D5 以 official trading sessions 計，不用 calendar days。

Primary target 是 price-direction probability；
不是成交後淨利、MFE/MAE、停損先後、15m entry quality 或 portfolio diversification。

## 4. Decision-clock compatibility firewall

兩個 fingerprint 都存在只是必要條件，不是 clock compatibility。

Primary pair row/date 必須：
- 同一 decision session；
- System1 / System2 fingerprint 都 immutable；
- reference close 相同；
- `clockAlignmentState=COMMON_INFORMATION_CUTOFF_VERIFIED`;
- 用於 primary model 的每個 input root 都能證明在共同 cutoff 前 available；
- 不能讓較晚 policy 所新增資訊偷偷變成「策略增量」。

若兩邊 after-market clock 不同且 information-set equality 無法證明：
`CLOCK_INCOMPATIBLE_PRIMARY_EXCLUDED`.

該 date 保留在 coverage/accounting，不得靜默刪除。

## 5. Primary common-support population

Primary population 不是 selected-only。

每一 decision date，納入所有：
- 同時具有合法 System1 pre-outcome state；
- 同時具有合法 SHORT_MOMENTUM pre-outcome state；
- candidate-universe relationship 已知；
- clock-compatible；
- target eligibility 可定義
的 symbol rows。

必須保留：
- selected / active；
- eligible but not selected；
- natural zero；
- policy disabled；
- UNKNOWN / incomplete；
- missing/admission blocked。

System1-only 或 System2-only universe names：
保留在 descriptive source decomposition；
除非兩邊都能定義可比 policy state，否則不進 primary nested comparison。

## 6. Primary estimand

Primary metric family：
`DATE_BALANCED_BRIER_LOSS_IMPROVEMENT`.

Baseline arm：
`SYSTEM1_ONLY`.

Augmented arm：
`SYSTEM1_PLUS_SHORT_MOMENTUM`.

For each mature eligible decision date：
1. 在 identical common-support rows 計算 baseline mean Brier loss；
2. 計算 augmented mean Brier loss；
3. date delta =
   `Brier_augmented - Brier_baseline`;
4. 跨 dates 等權彙總。

Favorable direction：
delta < 0。

Row-weighted result：
DESCRIPTIVE_ONLY。

Primary conclusion 不能由 row-weighted 顯著、單一 symbol、單一 episode 或單一 sector 驅動。

## 7. Secondary diagnostics

Preregistered but non-rescuing：
- date-balanced log loss；
- calibration-in-the-large；
- outcome prevalence；
- overlap / System1-only / System2-only descriptive paths；
- symmetric System2-only vs System2+System1 predictive comparison；
- Regime / sector stratification only when support permits。

Secondary 不得替換 primary metric。

## 8. Model-method firewall

本檔凍結：
- pair；
- target；
- horizon；
- population；
- primary metric；
- primary direction；
- date weighting。

本檔尚未凍結：
- exact encoding of System1 state；
- exact encoding of SHORT_MOMENTUM state；
- estimator/calibrator；
- regularization；
- finite-sample inference method；
- numerical MDE / precision target。

因此在 separate D16 ModelMethodReceipt + effect target freeze 前：
`OUTCOMES_MUST_REMAIN_CLOSED`.

禁止先看 outcome 再選：
- selected indicator vs score vs tier；
- nonlinear transform；
- interaction；
- Regime；
- horizon；
- calibration method。

## 9. Dependence contract

Primary inference 必須繼承：
- D16-06 date-cluster / temporal dependence governance；
- repeated symbols；
- overlapping D5 forward windows；
- sector clustering；
- Regime / replication-cluster concentration；
- SDA-016 outcome-footprint consumption；
- admission / missingness / positivity accounting。

No IID row-level primary inference。

## 10. Support states

`WAITING_POLICY_FINGERPRINTS`
- machine fingerprints 尚未完成。

`WAITING_COMMON_CUTOFF_RECEIPTS`
- fingerprints 有，但 common information cutoff 未證明。

`PROSPECTIVE_ACCUMULATION`
- immutable pair states 正常累積，outcomes 尚未用於 model selection。

`METHOD_NOT_FROZEN`
- model method / MDE 尚未凍結，不得打開 outcome inference。

`EXPLORATORY_SUPPORT`
- support 尚不足 primary claim。

`PRIMARY_VALIDATION_ELIGIBLE`
至少需要：
- >=40 effective independent decision dates under D16 dependence contract；
- adequate both-class support；
- multiple replication clusters / episodes；
- no single cluster domination；
- complete coverage denominators；
- SDA-016 untouched/consumption-valid evidence；
- frozen ModelMethodReceipt；
- frozen effect target / stopping rule；
- outer research-stream state permits confirmatory interpretation。

40 是既有 D16 governance floor，不是普遍數學常數。

## 11. Multiple-comparison boundary

V0.1 primary family only includes：
`SYSTEM1 vs SHORT_MOMENTUM / D5 / SYSTEM2_INCREMENTAL_OVER_SYSTEM1`.

D1/D3/D10 不可在看到 D5 後拿來救援。
其他 System2 strategies 不可事後併入同一 primary claim。

任何新增 horizon / strategy / predictor family：
new experiment/version + SDA-016 research-stream accounting。

## 12. Outer research-stream boundary

Current Room11 outer stream audit state：
`CROSS_ROOM_OUTER_STREAM_NOT_MODELED`.

因此本 experiment 雖然 outcome-blind preregistered，
在 outer error-control method / stream enrollment 凍結前仍不得稱 confirmatory evidence。

Current state：
`OUTER_STREAM_ENROLLMENT_PENDING`.

不得事後看到好結果才選一個有利的 outer error budget。

## 13. Diversification boundary

這個 D5 probability experiment 最多回答：
「SHORT_MOMENTUM 是否對 System1 有 predictive incrementality」。

它不能回答：
「兩個系統組合後是否有 portfolio diversification」。

Diversification 仍需要：
- aligned strategy returns；
- exposure normalization；
- cost parity；
- downside co-movement；
- drawdown co-occurrence；
- separate preregistered portfolio estimand。

## 14. 方法論錨點

- forecast-encompassing / conditional predictive-ability literature 支持比較 baseline 與 augmented forecasts，而不是用輸出不同率代替增量預測檢驗；
- Brier score 為 binary probability forecast 的 strictly proper scoring rule；
- nested forecast comparison 需要注意 model-selection 與 finite-sample inference；
- 本研究仍以 D16 自有 dependence / PIT / consumption contracts 為正式治理。

## 15. Exact next

1. 等待 System1 / System2 machine policy fingerprints；
2. 執行 NC-T01；
3. 建立 outcome-blind prospective pair receipts；
4. D16 在任何 outcome inference 前凍結 ModelMethodReceipt、MDE/precision target、stopping rule；
5. 綁定 outer researchStreamId 或明確維持 exploratory；
6. 只有完成上述前置條件後才允許成熟 D5 outcome 進入 inference；
7. 00 為 SDA-022 唯一 closure authority。

No outcome inspected.
No maturity change.
Formal Core LOCKED.
