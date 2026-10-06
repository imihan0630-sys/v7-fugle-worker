# D16｜前瞻研究機會義務帳本與交易日覆蓋完整性契約 V0.1

更新：2026-10-07 Asia/Taipei
狀態：RESEARCH_ONLY / EXPECTED-OPPORTUNITY LEDGER CONTRACT FROZEN
主責：11｜統計驗證與策略市場狀態研究室 / D16
Formal Core impact：NONE
成熟度影響：NONE

## 核心問題

Attempt ledger 只能保存真的有執行的 workflow attempt。若某個應有研究收集義務的交易日完全沒有 run，該日期仍可能從研究分母消失。

因此必須分開：
- Expected-opportunity ledger：哪些市場日應存在收集義務；
- Attempt ledger：實際執行了哪些 run/job 以及 terminal state。

兩者以 immutable opportunityId 聯結。

## Opportunity 不能由 cron 次數倒推

System1 C1 workflow 現況：
- UTC cron 為 16:10 Monday-Friday；
- 台北時間相當於 Tuesday-Saturday 00:10；
- blank scan date 使用 previousTaipeiDate()；
- previousTaipeiDate() 是前一台北曆日，不是官方前一交易日。

因此一次 scheduled run 不必然等於一個新的 research opportunity。
合法 opportunity 必須由 preregistered market-date window + official-session identity 獨立生成。

## Market-session identity 也必須有 provenance

Repo 已存在 2026-07-10 臨時全市場休市被預載 planned-holiday calendar 漏掉的反例。
所以每個 opportunity 必須保存 marketDate、session state、calendar source、observedAt、payload digest、rule version、emergency-closure overlays 與 marketSessionIdentityHash。

若 planned calendar 與 later authoritative closure evidence 衝突，狀態為 MARKET_SESSION_IDENTITY_CONFLICT，不可 silent rewrite。

## Attempt-one anchor

吸收 System2 coverage-integrity 已驗證原則：
- 每個 opportunity 只認第一個 scheduled execution attempt 作 immutable coverage anchor；
- later rerun 只能 diagnostic；
- later success 不得刪除或修復 attempt-one failure；
- manual dispatch / push run 不得自動取代 scheduled anchor。

## Coverage states

EXPECTED_TRADING_SESSION_ATTEMPT 必須落到：
- ATTEMPT_ONE_SUCCESS_ADMISSIBLE
- ATTEMPT_ONE_SUCCESS_RESEARCH_INELIGIBLE
- ATTEMPT_ONE_FAILED_BLOCKER_PRESERVED
- NO_SCHEDULED_ATTEMPT_OBSERVED
- SCHEDULED_RUN_NO_ARTIFACT
- SCHEDULED_RUN_ARTIFACT_INVALID
- DUPLICATE_OR_RERUN_DIAGNOSTIC_ONLY
- ATTEMPT_OPPORTUNITY_DATE_MISMATCH
- SESSION_IDENTITY_CONFLICT
- PENDING_COVERAGE_FINALIZATION

任何 NO_SCHEDULED_ATTEMPT_OBSERVED 都必須留在 coverage gap 分母。

## 分母防火牆

至少分開：
- expectedTradingOpportunityN
- operationalAttemptOneObservedN
- prospectiveEvidenceAdmissibleN

Promotion-grade coverage fraction 的分母至少要用 expectedTradingOpportunityN，不能只用 observed runs/artifacts。

## 非交易日與臨時休市

官方確認非交易日不建立交易日研究義務；即使 workflow 有跑，也只列 operational diagnostic。
若 session identity 尚 unknown，先保留 unknown，不提前算 gap。

後來 authoritative emergency-closure evidence 到達時，只能 append correction chain，保存 firstKnownAt、correctedAt、authority refs、outcomeExposureState；不得直接覆寫原歷史。

## 對抗案例

O01 官方交易日完全沒有 scheduled run -> NO_SCHEDULED_ATTEMPT_OBSERVED。
O02 attempt one 失敗、rerun 成功 -> 第一次失敗仍是 coverage anchor。
O03 manual 成功、scheduled 缺失 -> 不得修復 promotion coverage。
O04 non-trading day 有 scheduled run -> diagnostic only。
O05 previousTaipeiDate 指向非交易日 -> date mismatch / non-session diagnostic。
O06 planned calendar 後來被臨時休市證據推翻 -> append session correction。
O07 artifact market date 不符 opportunity -> fail closed。
O08 push artifact 更完整 -> 不得取代 attempt one。
O09 分母只由 observed artifacts 生成 -> reject survivorship denominator。
O10 unknown session 直接算 missing attempt -> reject premature gap。
O11 outcome 後 rerun 修復 first attempt -> adaptive contamination。
O12 failures 後縮短 prospective window -> new version + consumption review。

## Exact next

工程端若實裝，只能做 research-only coverage observer，不改 Formal Core。
Room11 未來只驗實際 readback，並保留 no-run gaps、non-trading days、reruns、date mismatch 與 calendar correction history。
Room00 保持唯一 closure authority。
## V0.2 scheduler provenance extension

GitHub Actions official schedule semantics add a separate platform layer:
- scheduled events can be delayed under high Actions load;
- under sufficiently high load, queued scheduled jobs may be dropped;
- schedule triggers only when the workflow file exists on the default branch;
- scheduled workflows run from the latest default-branch commit.

Therefore `NO_SCHEDULED_ATTEMPT_OBSERVED` is an observation, not an automatic root-cause attribution.

Every no-run gap must preserve scheduler-causal state:
- PLATFORM_TRIGGER_STATE_UNKNOWN;
- PLATFORM_SCHEDULE_DELAY_OR_DROP_POSSIBLE;
- WORKFLOW_NOT_ON_DEFAULT_BRANCH;
- WORKFLOW_DISABLED_OR_NOT_ACTIVE;
- REPOSITORY_SIDE_TRIGGER_BLOCKED;
- INTERNAL_COLLECTOR_NOT_REACHED;
- CAUSAL_CHAIN_PROVEN.

Promotion governance may count the gap in expected-opportunity coverage before its root cause is known, but may not label it strategy failure, source failure, or internal collector failure without supporting evidence.

Method anchors: GitHub Actions official `schedule` event and troubleshooting documentation, rechecked 2026-10-07.