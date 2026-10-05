# SDA-016｜可納入選擇敏感度、識別性與缺失結果界限補充契約 V0.1

更新：2026-10-06 Asia/Taipei  
狀態：RESEARCH_ONLY / FOURTH_ROUND_VALIDATION_ADDENDUM_FROZEN / NO_MATURITY_CHANGE  
主責研究室：11｜統計驗證與策略市場狀態研究室  
前置契約：
- `research/SDA016_HOLDOUT_CONSUMPTION_VALIDATION_CONTRACT_20261005_V0_1.md`
- `research/SDA016_INFORMATION_FOOTPRINT_VALIDATION_ADDENDUM_20261005_V0_1.md`
- `research/SDA016_INFORMATION_RELEASE_SELECTION_VALIDATION_ADDENDUM_20261005_V0_1.md`
正式核心影響：NONE

## 1. 第四層風險：完整案例不是自動代表原始母體

Promotion-grade analysis 不得因為只有某些日期／symbol／Regime 的 receipt、join、label、cost 可以完成，就把「可觀測子母體」默認成原本 preregistered target population。

完整案例分析可以被報告，但必須先回答：
- 它估的是原始 target population，還是 observed/admitted subpopulation？
- admission / label maturity 是否與 pre-outcome state 有關？
- conditioning on admission 是否可能造成 selection / collider bias？
- 是否存在近零／零 admission probability 的 strata？

若無法證明 complete cases 對原 target population 具可辯護代表性，完整案例結果只能標：
`OBSERVED_SUBPOPULATION_ESTIMAND`.

不得直接 promotion 成：
`TARGET_POPULATION_ESTIMAND`.

## 2. Admission indicator 必須是 first-class research variable

每一個 preregistered candidate row/date 至少要有：
- `targetPopulationEligible`;
- `parentCaptured`;
- `readbackVerified`;
- `predictionAvailable`;
- `outcomeMatured`;
- `performanceEligible`;
- `costEligible`;
- `finalAnalysisAdmitted`;
- 每一步 exclusion reason；
- 對應 decision-time source / Regime / universe / continuity state。

不能只保留最後的 finalAnalysisAdmitted=true rows。

## 3. Selection-sensitivity tier

### Tier A — raw observed-subpopulation analysis

只分析可合法成熟的 rows，但明確標：
`OBSERVED_SUBPOPULATION_ONLY`.

它是描述基準，不自動外推到完整 target population。

### Tier B — preregistered admission-weighted sensitivity

若研究者主張 selection 可由 decision-time observed covariates 合理解釋，可以建立 admission / censoring probability model。

最低規則：
- model features 僅能使用 decision-time available variables；
- 不得使用 future Regime path、future return、outcome sign、post-decision eligibility；
- model specification / regularization / clipping / trimming 規則在 economic outcome interpretation 前凍結；
- 必須報 overlap / positivity diagnostics；
- 必須報 weight distribution、max weight、weight concentration、weighted effective support；
- 必須檢查 weighted covariate balance / admission-strata balance；
- 不得因 weighted result 不漂亮就重選 admission model。

### Tier C — partial-identification / worst-case sensitivity

若 missingness mechanism 無法合理識別，或 positivity 明顯失敗，不得假裝 weighting 可以恢復完整 target population。

對 bounded outcomes 優先報 assumption-light bounds。

D16-CAL-01 binary target example：
- target eligible N = `N`;
- observed matured N = `O`;
- observed positive count = `S`;
- 無額外 missingness assumption 時，population success-rate lower bound = `S/N`;
- upper bound = `(S + N - O)/N`.

如果 directional conclusion 在合法 sensitivity bounds 內可跨過 null / decision boundary：
`DIRECTION_NOT_IDENTIFIED_UNDER_MISSINGNESS`.

## 4. Proper-score missing-outcome sensitivity

D16-CAL-01 同時使用 Brier / log-loss。

### Brier
Brier loss 對 binary outcome 在 probability p ∈ [0,1] 時有界，因此 missing rows 可建立 worst/best-case sensitivity。

### Log-loss
若允許 p=0 或 p=1，錯誤 label 的 log-loss 可發散。

因此若要對 missing labels 做 finite worst-case log-loss bound：
- probability floor/ceiling 必須在 outcome 前凍結；
- clipping epsilon 不得由 holdout 表現調整；
- clipping 本身屬 scoring contract；
- 沒有 preregistered finite clipping 時，不得宣稱 finite worst-case robustness bound。

此規則不要求 D16-CAL-01 現在立刻採某一 epsilon；它要求未來若聲稱 bounded log-loss sensitivity，先凍結其數學前提。

## 5. Positivity / overlap firewall

如果某個 preregistered stratum 幾乎沒有或完全沒有 admitted observations：
- full-population recovery 可能不可識別；
- extreme inverse-probability weights 不得被當成「已修復」；
- 必須顯示 minimum / quantiles of admission propensity、max weight、weight concentration、stratum support。

若改採:
- trimming；
- truncation；
- overlap weighting；
- restricted-support estimand；
必須改寫 estimand identity。

不得：
`RESTRICTED_SUPPORT_RESULT -> FULL_TARGET_POPULATION_CLAIM`.

## 6. Evaluation cutoff / delayed maturity

Evaluation cutoff 必須是：
- preregistered calendar rule；或
- deterministic maturity rule。

禁止看完已成熟 outcomes 後才決定「再等幾天」或「今天就停」來改變樣本組成。

若 cutoff 受已觀察 outcome 影響：
- adaptive inspection；
- same family consumption；
- ordinary fixed evaluation claim 失效。

## 7. Imputation firewall

Imputation 不是免費創造真實 outcome。

任何 imputation / prediction of missing labels：
- model family / predictors / tuning rule / multiple-imputation count 或 deterministic alternative 必須事前凍結；
- outcome-driven model selection = adaptive family mutation；
- imputed result 必須和 complete-case / weighted / worst-case sensitivity並列；
- single imputed value 不得消除 imputation uncertainty；
- 如果結論高度依賴一種不可驗證 missingness assumption，必須 fail closed for promotion。

## 8. 第四輪對抗驗收

31. complete-case result 在 admission 與 pre-outcome Regime 顯著相關時仍宣稱 full population：拒絕。
32. admission model 使用 decision date 後才知道的變數：拒絕 PIT。
33. 某 preregistered stratum admission probability 為 0／近 0，仍用極端 IPW 宣稱完整母體已恢復：阻斷。
34. weight trimming / overlap weighting 後仍沿用原 full-population estimand 名稱：估計目標不一致。
35. binary missing-outcome worst/best bounds跨過決策邊界，仍宣稱方向穩健：阻斷。
36. paired Brier advantage 在合法 missing-outcome bounds 下可翻號，仍 promotion：阻斷。
37. log-loss 未凍結 finite probability clipping 卻宣稱 finite worst-case missing-label robustness：阻斷。
38. evaluation / maturity cutoff 依已觀察 outcome 決定：adaptive consumption。
39. admission / imputation model 規格因 holdout economic performance 被重選：new family + consumption。
40. single imputation 後忽略 imputation uncertainty 並當作 observed truth：阻斷。

## 9. 方法論錨點

Missing-data / selection 文獻支持：
- complete-case validity 取決於 selection / missingness 結構，而不是「缺失比例小就一定安全」；
- inverse-probability weighting 可以處理某些可辯護 missingness mechanisms，但需要 overlap / positivity；
- near-zero probabilities 會產生 extreme weights；
- trimming / overlap weighting 會改變 target estimand；
- 當 assumptions 不足以 point-identify full-population effect 時，partial-identification / bounds 比硬猜單一值更誠實。

這些方法論只支持驗證治理，不直接提供任何台股 Alpha。

## 10. Exact next

SDA-016 validation oracle 下一版應納入 T31~T40。

新增 minimum machine outputs：
- stage-wise admission indicators；
- selection model identity / knowledge cutoff；
- propensity / weight diagnostics；
- estimand identity before/after trimming；
- missing-outcome sensitivity bounds；
- scoring clipping contract；
- deterministic evaluation cutoff；
- imputation contract / uncertainty accounting。

未通過 selection sensitivity / identification firewall，不得由 complete-case 結果直接 promotion。

FORMAL_OPTIMIZATION_CANDIDATE: NONE  
Formal Core: LOCKED
