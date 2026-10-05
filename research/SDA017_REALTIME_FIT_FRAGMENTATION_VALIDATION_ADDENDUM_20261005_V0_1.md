# SDA-017｜即時市場狀態擬合時鐘與事件段落碎裂驗證補充契約 V0.1

更新：2026-10-05 Asia/Taipei  
狀態：RESEARCH_ONLY / THIRD_ROUND_VALIDATION_ADDENDUM_FROZEN / NO_MATURITY_CHANGE  
主責研究室：11｜統計驗證與策略市場狀態研究室  
前置契約：
- `research/SDA017_REGIME_SUPPORT_EPISODE_VALIDATION_CONTRACT_20261005_V0_1.md`
- `research/SDA017_EPISODE_HORIZON_DEPENDENCE_VALIDATION_ADDENDUM_20261005_V0_1.md`
正式核心影響：NONE

## 1. 第三層風險 A：outcome-free 不等於 look-ahead-free

即使 Regime threshold / scaler / clustering / latent-state model 完全沒有使用未來報酬，
若它在決策日 t 使用了 t 之後的 covariate distribution 來 fit：
- full-sample mean/std；
- full-sample quantile；
- future rows included PCA / clustering；
- future-informed HMM fit；
- retrospective normalization；
仍然違反 decision-time deployability。

因此任何 learned/fitted Regime component 必須另外證明：
`FIT_KNOWLEDGE_CUTOFF <= DECISION_TIMESTAMP`.

目前 D18 V0.1 對未凍結 concentration/breadth 等維度保留 `CONTEXT_RAW` / `UNKNOWN` 是正確方向；本補充是限制未來新 fitted dimensions，不把現有 fixed semantic rules 誤判為失敗。

## 2. Fitted Regime receipt

任何不是固定常數／固定公式即可決定的 Regime transform，至少綁：

- `regimeFitId`;
- `fitMethodVersion`;
- `fitCreatedAt`;
- `fitKnowledgeCutoff`;
- `fitStartDate`;
- `fitEndDate`;
- `fitSourceDigest`;
- `fitPopulationHash`;
- `transformParametersHash`;
- `thresholdDefinitionHash`;
- `scalerStatisticsHash`;
- `futureRowsUsed=false`;
- `outcomesUsed=false`;
- `availableAt`.

Decision receipt 必須引用 exact fit receipt，不能只寫「rolling threshold」。

如果 threshold 是 expanding / rolling quantile：
- window rule 事前凍結；
- 只用當時已知 rows；
- missingness rule 事前凍結；
- threshold vintage 隨日期可變，但每個 decision 都必須綁自己的 threshold receipt。

## 3. 第三層風險 B：UNKNOWN / version split 會製造假 episode diversity

前版正確規定：
- UNKNOWN gap => structural episode split；
- version/source semantic boundary => structural episode split。

但如果 support engine 直接把每個 structural episode 都當成「一次新的 Regime 重現」，
資料缺口越多、版本切換越頻繁，episode N 反而越高。

因此分開：

### `structuralEpisodeN`
觀測層真正切出的連續已知片段數。

### `replicationEpisodeN`
有資格作「跨段重現」支援的保守事件段落數。

### `mechanicalFragmentN`
因下列原因被切開、但不能自動增加 replication credit：
- UNKNOWN / missing gap；
- clock-invalid gap；
- source outage；
- vector-version boundary；
- source/universe semantic migration；
- persistence readback gap。

每個 episode 必須帶：
- `episodeStartReason`;
- `episodeEndReason`;
- `splitCause`;
- `replicationClusterId`;
- `mechanicalFragment`;
- `witnessedDifferentStateSincePriorSameState`.

同 state 在 UNKNOWN/version gap 後重新出現：
仍是新 structural episode，
但預設留在同一 conservative replication cluster，除非有：
- 中間 witnessed different KNOWN state；或
- preregistered independent washout rule + D16 dependence clearance。

## 4. 第三層風險 C：threshold chatter

靠近 threshold 的小變動可能造成：
A -> B -> A -> B
短時間反覆切換。

這會灌大：
- transitionN；
- episodeN；
- apparent recurrence。

因此至少報：
- transition density；
- one-session episode N；
- two-session-or-short episode N；
- threshold distance / state margin（若 dimension 有 threshold）；
- chatter cluster count；
- hysteresis / minimum-duration rule version（若有）。

任何 hysteresis / minimum-duration：
- 必須 outcome 前凍結；
- 不能看績效後為了減少 losing transitions 才加入；
- 若新增／修改，屬新 Regime family，並觸發 SDA-016 consumption。

沒有一個 universal 最短持續日數被本契約宣稱為真理。
本契約只要求「不能把 threshold noise 直接當 independent replication」。

## 5. 第三層風險 D：active episode right-censoring

樣本結束時仍在持續的 episode 是 right-censored，而不是不存在。

Primary `DECISION_STATE_CONDITIONAL`：
- 只要某 decision 的 D+N outcome 已合法 mature，不要求其 episode 已結束；
- 不得因 episode 還 active 就刪除該 decision。

Episode-duration / persistence analysis：
- active episode 必須標 censored；
- 不得把 active 當 completed；
- 也不得只分析 completed episodes 後宣稱完整 population performance。

必須報：
- activeEpisodeN；
- completedEpisodeN；
- rightCensoredEpisodeN；
- maturedDecisionNInsideActiveEpisodes；
- excludedBecauseEpisodeIncompleteN（primary 應為 0，除非 target 本身就是 episode-duration estimand）。

## 6. 第三層風險 E：Regime-dependent capture/admission

如果某 Regime 的 source 較容易 UNKNOWN / capture failure，
只在已知 Regime dates 做 performance 會改變 evaluation population。

每個 intended state family 至少報：
- candidate calendar dates；
- KNOWN dates；
- UNKNOWN dates；
- capture/readback blocked dates；
- state-specific admissibility fraction；
- missing-reason distribution。

若某 state 的 observability 系統性較差：
`REGIME_OBSERVABILITY_SELECTION_WARNING`.

不得把高 missingness state 靜默移除後再說 policy 在「所有 Regime」有效。

## 7. 第三輪對抗驗收

31. 全樣本 quantile / mean / std 包含未來日期，再回填歷史 Regime：reject look-ahead。
32. PCA / clustering / HMM / scaler fit 使用 decision date 後 covariates，即使 outcomes 完全沒用：reject look-ahead。
33. fit window / normalization / threshold rule 在看 outcome 後修改：new family + SDA-016 consumption。
34. UNKNOWN gap 把 same state 切成兩個 structural episodes：structuralEpisodeN 增加，但 replicationEpisodeN 不可自動 +1。
35. vector/source version migration 把 same state 切段：不得自動取得新 replication credit。
36. threshold 附近 A-B-A-B 短週期 chatter 產生很多 episodes：需 chatter warning，不得等同多次獨立重現。
37. active end-of-sample episode 被丟掉：episode-level support report fail。
38. primary decision-state analysis只保留 completed episodes：reject right-censor selection。
39. capture/UNKNOWN fraction 在某 Regime 明顯較高卻只報 known-state performance：`REGIME_OBSERVABILITY_SELECTION_WARNING`，不得 standalone promotion。
40. Regime fit population 本身使用 post-decision eligibility / future-known membership：reject PIT eligibility。

## 8. 方法論錨點

一般 time-series evaluation 不能讓 training / fitting 使用 future observations；即使只做 preprocessing，先對完整資料 fit quantile transform 也會造成 data leakage。

近期 point-in-time equity research亦強調：每一個 input 不只要有值，還要能證明在策略使用時已 observable / admissible / executable。

外部方法只支持防 look-ahead 的治理，不直接證明任何 Regime policy 有經濟價值。

## 9. Exact next

System2 SDA-017 episode/support observer需在原 30 項之外追加 T31~T40。
新增最低 machine-visible fields：
- exact fitted-Regime receipt / knowledge cutoff；
- structuralEpisodeN vs replicationEpisodeN；
- splitCause / mechanicalFragmentN / replicationClusterId；
- chatter diagnostics；
- right-censor accounting；
- state-specific observability/admissibility coverage。

第三輪規則不改 Formal ranking / Top6 / capital / push / live weights。

FORMAL_OPTIMIZATION_CANDIDATE: NONE  
Formal Core: LOCKED
