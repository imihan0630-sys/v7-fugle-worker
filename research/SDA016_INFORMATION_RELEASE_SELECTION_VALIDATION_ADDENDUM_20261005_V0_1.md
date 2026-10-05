# SDA-016｜資訊釋出鏈與選擇性缺失驗證補充契約 V0.1

更新：2026-10-05 Asia/Taipei  
狀態：RESEARCH_ONLY / THIRD_ROUND_VALIDATION_ADDENDUM_FROZEN / NO_MATURITY_CHANGE  
主責研究室：11｜統計驗證與策略市場狀態研究室  
前置契約：
- `research/SDA016_HOLDOUT_CONSUMPTION_VALIDATION_CONTRACT_20261005_V0_1.md`
- `research/SDA016_INFORMATION_FOOTPRINT_VALIDATION_ADDENDUM_20261005_V0_1.md`
正式核心影響：NONE

## 1. 第三層風險：不是只有「打開資料」才算看過 holdout

Adaptive reuse 的資訊污染不要求研究者看到完整 row-level outcome。

任何 outcome-derived release，只要足以影響下一個假說／門檻／版本選擇，都可能讓 downstream hypothesis 依賴已看過的 holdout。

因此下列都屬 holdout information release：
- PASS / FAIL；
- 正負方向；
- p-value / confidence interval；
- Sharpe / return / Brier / log-loss 等 scalar；
- plot / reliability curve / ranking；
- winner identity；
- 「哪個 Regime 最好」；
- 「接近門檻，再多收幾天」；
- 由另一個研究室或 agent 看過結果後給出的建議。

只隱藏 raw rows 不等於 untouched。

## 2. Canonical release lineage

每一次由 holdout outcome 衍生出的資訊釋出，至少建立：

- `releaseId`;
- `experimentFamilyId`;
- `experimentVersion`;
- `holdoutPhysicalIdentity`;
- `inspectionId`;
- `releasedAt`;
- `releaseClass`;
- `fieldsReturnedHash`;
- `resultDigest`;
- `recipientScope`;
- `parentReleaseIds`;
- `downstreamHypothesisRefs`;
- `consumptionStateAfterRelease`.

`releaseClass` 至少區分：
- `BOOLEAN_GATE_ONLY`;
- `SIGN_ONLY`;
- `SCALAR_METRIC`;
- `AGGREGATE_TABLE_OR_PLOT`;
- `ROW_LEVEL_OR_PATH_LEVEL`.

目前系統預設保守語意：
**任何 outcome-derived release 都算一次 inspection / information exposure。**

未來若要採 limited-exposure reusable-holdout protocol，必須另立 D16 explicit sequential/adaptive contract；不得由 consumer 自行把 PASS/FAIL 宣稱為「沒有看結果」。

## 3. Transitive cross-room contamination

若 Room A 看過 holdout 後，只把「建議改 threshold」告訴 Room B：

Room B 即使沒有看到原始 outcome，
其新 hypothesis 仍受該 holdout information 影響。

因此：
- contamination follows information lineage, not account/user/room identity；
- System1 / System2 / Room01~15 / 00 之間不能靠換 consumer 重置 untouched；
- downstream hypothesis 必須綁 `parentReleaseIds`；
- 無法證明 downstream decision 是否獨立於 prior release => fail closed / development-only。

## 4. Selection-by-admissibility / missingness risk

本專案已有 fail-closed missing/UNKNOWN 規則，但第三層風險是：

> 「只有成功 capture / 成功 mature / 成功 join 的日期被留下」本身可能不是隨機事件。

例如：
- source 在高波動日較容易失敗；
- suspension / corporate-action 日較容易 outcome UNKNOWN；
- 某 Regime 的 source coverage 較差；
- D+20 labels 在特殊事件較容易無法成熟。

如果只分析 complete cases，可能改變 target population。

所以 promotion-grade evidence 必須同時報：
- calendar candidate N；
- admission-eligible N；
- readback-pending N；
- parent-missing N；
- capture-disabled N；
- label-unknown N；
- immature N；
- cost-unknown N；
- 各 pre-outcome Regime / source-state / universe bucket 的 admission fraction；
- exclusion reason distribution。

若 evidence availability 對 pre-outcome state 明顯不均，至少標：
`ADMISSION_SELECTION_WARNING`.

沒有事前可辯護的 missingness / censoring 處理，不得把 complete-case result 當全母體效果。

## 5. Delayed-label / censoring firewall

Matured-label subset 不預設為 random sample。

若 label maturity / performanceEligible / continuity depends on：
- suspension；
- delisting；
- corporate action ambiguity；
- data-source outage；
- symbol-session break；
則須揭露其與 pre-decision state 的關係。

Primary result 必須同時顯示：
- prediction coverage；
- matured-label coverage；
- UNKNOWN-label coverage；
- time-to-maturity distribution；
- maturity state by preregistered strata。

不得：
- UNKNOWN -> 0；
- IMMATURE -> 0；
- 只報 matured winners；
- 等不利樣本消失後才 freeze evaluation cutoff。

Evaluation cutoff / maturity cutoff 必須事前凍結或由 deterministic clock 推導。

## 6. Multi-horizon family

D1 / D3 / D5 / D10 / D20 即使全都 preregistered，也不是五份完全獨立 confirmatory evidence。

若同一 hypothesis family 同時檢查多個 horizon：
- horizons 綁同一 `multipleTestingFamilyId`;
- outcome footprint overlap 必須揭露；
- primary horizon 事前凍結；
- secondary horizons 明確標 secondary；
- 看完後選最好 horizon 當 primary => adaptive family mutation + SDA-016 consumption。

## 7. 第三輪對抗驗收

23. 只釋出 holdout PASS/FAIL，再依該結果改 hypothesis：仍算 information exposure。
24. Room A 看 metric，Room B 只收到「改門檻」建議：Room B 新假說不得標 untouched。
25. 只釋出圖或排名、不釋出 raw rows：仍須 release receipt。
26. 同一 holdout 對多 agent / consumer 釋出不同摘要：共用 canonical consumption lineage。
27. output release 缺少 parent inspection / result digest：不得證明 untouched。
28. capture/admission missingness 集中在某 pre-outcome state：標 `ADMISSION_SELECTION_WARNING`，complete-case 不可直接 promotion。
29. matured-label availability 對 suspension / corporate-action / source state 不均：不得假設 non-informative censoring。
30. 同一 hypothesis 看 D5/D10/D20 後挑最好 horizon 改成 primary：new adaptive version + original holdout consumed。

## 8. 方法論錨點

Adaptive-data-analysis 文獻的核心不是「raw row 是否外洩」，而是 analyst 能從 holdout response 得到多少資訊、以及後續 hypothesis 是否依賴那些 response。

金融面板亦存在系統性 missing-data 結構；complete-case 並非自動代表原母體。

這些外部方法只支持治理原則，不直接證明任何台股策略有效。

## 9. Exact next

共享 SDA-016 authority 除原 22 項外，需追加 T23~T30。
最低新增 machine-visible fields：
- release lineage；
- recipient scope；
- downstream hypothesis references；
- admission-state accounting；
- maturity/censoring accounting；
- horizon-family identity。

未通過第三輪資訊釋出／選擇性缺失防火牆，不得送 00 作 closure。

FORMAL_OPTIMIZATION_CANDIDATE: NONE  
Formal Core: LOCKED
