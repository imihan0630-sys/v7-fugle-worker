# D16｜巢狀資料取得缺失與上游阻斷傳播契約 V0.1

更新：2026-10-07 Asia/Taipei
狀態：RESEARCH_ONLY / NESTED_ACQUISITION_MISSINGNESS_CONTRACT_FROZEN
主責：11｜統計驗證與策略市場狀態研究室 / D16
Formal Core impact：NONE
成熟度影響：NONE

## 1. 觸發

2026-10-07 System1 品質恢復流程已證明：
- FINANCIAL 階段先執行；
- FINANCIAL 需從 MOPS batch financial endpoint 取得完整 body；
- FINANCIAL 成功後建立 financialSnapshot；
- QUARTER_EPS 階段後續才執行；
- 部分 QUARTER_EPS 邏輯直接依賴 financialSnapshot 的已驗證欄位。

真實 run 37556241467 在 FINANCIAL transport retry exhausted 後停止，因此：
- FINANCIAL = OBSERVED transport/body failure；
- QUARTER_EPS = NOT_REACHED；
- QUARTER_EPS independent source failure 未被證明。

## 2. 核心規則

上游 acquisition failure 導致下游未到達時，下游不得記成 independent source failure、independent acquisition episode、second missingness event、second transport failure 或 second provider-unavailability observation。

只能記：`DOWNSTREAM_NOT_REACHED_UPSTREAM_BLOCKED`。

## 3. Episode identity

每個 acquisition episode 至少保存：
- acquisitionEpisodeId；
- runId/jobId；
- dataset/stage；
- parentAcquisitionEpisodeId；
- dependencyPathHash；
- attemptedAt；
- endpoint identity；
- transport state；
- body state；
- parse state；
- semantic state；
- persistence state；
- terminal state。

若 stage 未被執行：
- attemptedAt = null；
- transport/body/parse/semantic/persistence = NOT_REACHED；
- independentEpisodeN increment = 0。

## 4. Failure propagation graph

必須區分：
- ROOT_OBSERVED_FAILURE；
- DERIVED_DOWNSTREAM_BLOCK；
- INDEPENDENT_OBSERVED_FAILURE；
- RECOVERED_AFTER_UPSTREAM_SUCCESS；
- UNKNOWN_DEPENDENCY_STATE。

一個 root failure 可傳播到多個 downstream blocked datasets，但 rootFailureN 不可因 downstream 數量倍增。

## 5. Missingness denominator

至少同時報：
- acquisitionAttemptedDatasetN；
- acquisitionObservedFailureN；
- downstreamNotReachedN；
- independentAcquisitionEpisodeN；
- blockedDatasetN；
- recoveredDatasetN。

禁止把 FINANCIAL missing + QUARTER_EPS missing 當成兩個可交換、獨立的 transport failure。

## 6. Conditional estimand

QUARTER_EPS transport reliability 的可識別分母，只能使用：`QUARTER_EPS_STAGE_ACTUALLY_ATTEMPTED`。

不能把上游 FINANCIAL 失敗而未到 QUARTER_EPS 的 run 放進 QUARTER_EPS transport failure denominator。

若要評估整條 pipeline 對 QUARTER_EPS availability 的 end-to-end reliability，可使用 pipeline estimand，但必須明確標為 `END_TO_END_QUARTER_EPS_AVAILABILITY`，而不是 `QUARTER_EPS_SOURCE_TRANSPORT_RELIABILITY`。

## 7. Positivity

若 QUARTER_EPS 只在 FINANCIAL 成功後才可被測試，則 QUARTER_EPS source reliability 對 FINANCIAL-failed strata 沒有觀測 support。

因此：
- 不可直接 IPW 推回未測試 strata；
- 不可假設 conditional reliability 等於 marginal end-to-end reliability；
- zero support 保持 `ACQUISITION_POSITIVITY_NOT_ESTABLISHED`。

## 8. Recovery semantics

後續某 run 若 FINANCIAL 成功並真正到達 QUARTER_EPS：
- 建立新的 acquisition episode；
- 保留舊 FINANCIAL root failure；
- 不覆寫舊 QUARTER_EPS NOT_REACHED；
- 新 QUARTER_EPS 成功／失敗只屬新 episode；
- 不把 recovery 回填成 2026-10-06 prospective success。

## 9. First physical witness

Run：37556241467。

FINANCIAL：
- attempted = true；
- source = MOPS /ajax_t163sb04；
- retries = 3；
- terminal = MOPS_BATCH_FINANCIAL_TRANSPORT_RETRY_EXHAUSTED；
- role = ROOT_OBSERVED_FAILURE。

QUARTER_EPS：
- attempted = false；
- transport = NOT_REACHED；
- terminal = DOWNSTREAM_NOT_REACHED_UPSTREAM_BLOCKED；
- parent = FINANCIAL acquisition episode；
- independent failure proven = false。

## 10. Canonical oracle mapping

Supplemental only：
- SDA016-T28 admission missingness；
- SDA016-T31 complete-case/target mismatch；
- SDA016-T33 positivity failure；
- SDA016-T39 outcome-tuned missingness model。

不增加 SDA016 V0.5 的 58 項正式測試數。

## 11. Exact next

1. 下一次 live recovery 若 FINANCIAL 成功，驗證 QUARTER_EPS 是否真的獨立進入 transport。
2. 若 QUARTER_EPS 被嘗試，建立新的 acquisition episode。
3. 分開報 source-conditional reliability 與 pipeline end-to-end availability。
4. 保留所有 parent/child episode lineage。
5. 不改 Formal Core、不開 outcome。