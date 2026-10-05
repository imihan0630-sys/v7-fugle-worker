# SDA-016｜外層序列假說流與持續研究錯誤預算補充契約 V0.1

更新：2026-10-06 Asia/Taipei  
狀態：RESEARCH_ONLY / SIXTH_ROUND_VALIDATION_ADDENDUM_FROZEN / NO_MATURITY_CHANGE  
主責研究室：11｜統計驗證與策略市場狀態研究室  
正式核心影響：NONE

## 1. 新盲點：內層序列合法，不代表外層研究流合法

既有 SDA-016 已凍結：
- fixed-N 中途偷看；
- preregistered sequential policy；
- repeated holdout consumption；
- family mutation；
- information-release lineage；
- horizon multiplicity；
- missingness / positivity；
- same-session C1 generation parent selection。

但自我進化研究系統還有另一個層級：

`H1 -> outcome -> H2 -> outcome -> H3 -> ...`

即使每個單一 experiment 內部都使用合法 fixed-sample 或 sequentially-valid 方法，
如果研究系統可以根據過去結果不斷提出新假說、重置 alpha、淘汰失敗者並只留下成功者，
整個研究流仍會累積 false discovery risk。

外部 online multiple testing 文獻將這區分為：
- inner sequential process：單一假說內，資料逐步到達；
- outer sequential process：不同假說一個接一個到達。

本契約處理後者。

## 2. Canonical research-stream identity

Promotion-grade 研究必須綁定一個 `researchStreamId`，至少包含：

- `streamScope`;
- `streamErrorObjective`;
- `streamErrorLevel`;
- `streamMethodId` / `streamMethodVersion`;
- `dependenceAssumptionId`;
- `hypothesisArrivalPolicyHash`;
- `alphaOrEvidenceBudgetPolicyHash`;
- `discoveryDefinitionHash`;
- `retirementRuleHash`;
- `streamStartAt`;
- `streamLedgerHeadHash`.

不得每建立新 `experimentFamilyId` 就把 family-wise / online error budget 當成全新、未使用。

## 3. Error objective 必須明確

允許研究層指定：
- FWER；
- FDR；
- mFDR；
- expected false discoveries；
- exploratory-only / no confirmatory error claim。

但是不得混淆。

例如：
- FDR-controlled result 不得表述成「任何一個錯誤發現的機率 <= alpha」；
- single-test Type-I error 不得表述成 whole-stream false-discovery control；
- sequentially-valid p-value 不得單獨表述成 online multiplicity control。

本契約不指定單一演算法，也不自動批准 LORD / SAFFRON / ADDIS / alpha-investing / e-value 方法。
任何方法只有在 assumptions、dependence、arrival/adaptation、stopping semantics 可被本系統證明時才可採用。

## 4. Hypothesis birth ledger

每一個新 hypothesis / experiment family 在第一次 outcome access 前必須留下：

- `hypothesisOrdinal`;
- `hypothesisId`;
- `experimentFamilyId`;
- `registeredAt`;
- `parentHypothesisRefs`;
- `priorOutcomeReleaseRefsKnownAtBirth`;
- `birthReasonCode`;
- `candidateSource`;
- `primaryClaimHash`;
- `nullHash`;
- `directionHash`;
- `analysisMethodHash`;
- `innerSequentialPolicyRef`;
- `outerErrorBudgetAllocation`;
- `allocationKnownAt`.

如果 H2 是看完 H1 後產生，這不一定非法；
但 H2 必須被視為 adaptive hypothesis arrival，而不能假裝 H1/H2 是事前固定 family。

## 5. Alpha / error budget reset firewall

禁止：

`new experimentFamilyId -> alpha reset to 0.05`

若整個 research stream 允許無限新增 confirmatory hypotheses，而沒有 outer multiplicity rule：
所有新 hypothesis 最多為 exploratory，不能靠「每一個單獨 p<0.05」累積成 promotion。

若採固定有限 family：
- family membership / maximum family definition 必須在 relevant outcomes 前凍結；
- family-wise method事前凍結。

若採 online method：
- allocation at time t 只能使用該方法允許的 past information；
- method state / wealth / budget 在每一假說前後都需 durable；
- 不得因某一結果漂亮而手動補發額外 alpha；
- 不得刪除失敗 hypothesis 以恢復 budget。

## 6. Doubly-sequential firewall

有些研究同時具：
1. 每個 experiment 內反覆 monitoring；
2. experiments 自身持續新增。

這是 doubly-sequential research stream。

合法性至少需要：
- inner sequential method valid；
- outer multiplicity method valid；
- 兩層 state 都 machine-visible；
- inner result不能自動當作 outer discovery；
- experiment stopping time 與 hypothesis arrival time分開記錄。

只處理內層 optional stopping，不代表外層 multiplicity 被處理。

## 7. Dependence / asynchronous assumptions

不同 hypotheses 常共享：
- 同一市場日期；
- 同一 C1 population；
- 同一 outcome footprint；
- 同一 factors / signals；
- 同一 Regime episodes。

因此 online procedure 的 dependence assumptions 必須 machine-visible。

若選用的方法只在 independence / local dependence / positive dependence 等條件下成立，
系統不能用未知的 cross-hypothesis dependence 強行宣稱控制。

狀態：
`ONLINE_ERROR_CONTROL_ASSUMPTIONS_UNPROVEN`.

如果方法具更強 dependence robustness，也仍需證明其 input evidence semantics 適用，不得只靠方法名稱。

## 8. Negative / inconclusive hypotheses 永久保留

Stream ledger 必須保存：
- reject / not reject；
- negative；
- inconclusive；
- insufficient support；
- data-quality blocked；
- retired；
- superseded。

不得只保留 discoveries 或 current champions。

`ledgerHypothesisCount` 必須與所有實際 outcome-inspected hypotheses 可核對。

## 9. Hypothesis retirement 不能洗白

淘汰一個失敗 hypothesis：
- 可以停止繼續投入資料；
- 不會把它從 multiplicity history 移除；
- 不會恢復「從未測試過」狀態；
- 不會讓其 child hypothesis 自動變成獨立新 family。

如果新 hypothesis 是由舊失敗模式啟發，
必須保留 parent / release lineage。

## 10. 第六輪對抗驗收

49. 每一新 experiment 都使用 nominal 0.05，但 stream 無 outer multiplicity rule：`NO_CONFIRMATORY_STREAM_CONTROL`.
50. 每個 experiment 有合法 anytime-valid p-value，但一百個 experiments 只挑顯著者 promotion：`INNER_VALID_OUTER_MULTIPLICITY_FAIL`.
51. H2 在 H1 outcome 後產生但 registry 宣稱 H1/H2 都是 ex-ante independent families：`REJECT_HYPOTHESIS_BIRTH_LINEAGE_MISMATCH`.
52. failed hypothesis 從 stream ledger 刪除、hypothesis count下降：`REJECT_STREAM_LEDGER_ATTRITION`.
53. retired hypothesis 後重開同一 claim with new id and fresh alpha：`SAME_ADAPTIVE_STREAM_NO_ALPHA_RESET`.
54. online procedure 使用 dependence assumptions，但 hypotheses 共享 market-date/outcome footprint 且 dependence 未證明：`ONLINE_ERROR_CONTROL_ASSUMPTIONS_UNPROVEN`.
55. outer method state / alpha wealth只保存目前值，缺歷史 transition ledger：`REJECT_UNAUDITABLE_ERROR_BUDGET_STATE`.
56. outcome 後手動提高下一 hypothesis allocation：`REJECT_NONPREDICTABLE_ERROR_ALLOCATION`.
57. FDR control 被報告為 FWER / single-false-positive guarantee：`REJECT_ERROR_OBJECTIVE_OVERCLAIM`.
58. doubly-sequential stream只證明 inner stopping-validity、未證明 outer multiplicity：`OUTER_STREAM_CONTROL_PENDING`.

## 11. 方法論錨點

- Johari / Pekelis / Walsh 類 always-valid inference：處理 continuous monitoring 下的 data-dependent stopping。
- Robertson 等 online multiple hypothesis testing review：明確區分 sequential data collection 與 hypotheses arriving in a stream，並討論 LORD / SAFFRON / ADDIS 等 online error-control families。
- Foster / Stine alpha-investing：示範 sequential hypothesis stream 需要可追蹤的 error wealth/accounting。
- Bailey / López de Prado 類 backtest-selection literature：大量策略搜尋與只選最佳者會產生 selection bias / overfitting。

方法論不直接證明任何台股策略有效；只支持研究治理。

## 12. Exact next

1. SDA-016 oracle 下一版納入 T49-T58。
2. 建立 `D16_ONLINE_EXPERIMENT_STREAM_RECEIPT_CONTRACT`.
3. System1/System2 shared consumption authority未來應同時承載 hypothesis-birth / outer-error state，而不是只記 holdout use。
4. 在 outer stream control未證明前，新研究可以 exploratory，但不得因單一 experiment individually valid 就 promotion。
5. 00仍為唯一 closure authority。

FORMAL_OPTIMIZATION_CANDIDATE: NONE  
Formal Core: LOCKED
