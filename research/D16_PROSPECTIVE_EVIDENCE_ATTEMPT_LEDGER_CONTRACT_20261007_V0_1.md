# D16｜前瞻證據嘗試帳本與可觀測性幸存者防火牆 V0.1

更新：2026-10-07 Asia/Taipei
狀態：RESEARCH_ONLY / PRE-OUTCOME ATTEMPT-LEDGER CONTRACT FROZEN
主責：11｜統計驗證與策略市場狀態研究室 / D16
Formal Core impact：NONE
成熟度影響：NONE

## 1. 問題

既有 D16 admission funnel 已要求保存 calendarCandidateN、parentCapturedN、readbackVerifiedN 等分母，但若系統只在「成功產生研究 evidence」時建立研究 receipt，失敗的 scheduled collection attempt 可能不進研究帳本。

這會產生 survivorship bias：
只看得到成功可研究的日期，看不到因 parent missing、source readiness、clock mismatch、authorization、network 或 infrastructure failure 而沒有 evidence 的日期。

因此：
**每一次預期的 prospective evidence collection attempt 都必須是一級治理事件。**

它和「最終可納入研究的 row/date」是兩個不同分母。

## 2. 兩種分母必須分開

### Operational attempt denominator

只要研究收集工作真正被 schedule / manual dispatch / push trigger 啟動，就進 attempt ledger。

這回答：
「研究基礎設施有多少次嘗試？有多少成功／失敗？失敗在哪一層？」

### Research target denominator

只有在 preregistered target population / official-session / source-clock 條件成立後，才決定是否進 calendarCandidateN / targetPopulationEligibleN。

因此：
- workflow failure != strategy failure；
- parent missing != zero-pick；
- non-session scheduled run != missing alpha observation；
- authorization/network failure != negative outcome；
- research-ineligible date 不得從 operational history 消失。

## 3. Attempt identity

每筆至少保存：
- attemptId；
- workflowName；
- workflowRunId；
- workflowJobId；
- triggerType；
- scheduledFor / startedAt / completedAt；
- headSha；
- intendedScanDate；
- officialSessionState；
- artifactId / artifactName / artifactDigest；
- collectorVersionHash；
- validatorVersionHash。

attemptId 不得因 rerun / alias / new filename 重置既有歷史。

## 4. Stage-wise lifecycle

至少依序記：
1. TRIGGERED；
2. VALIDATOR_READY；
3. PARENT_READ_ATTEMPTED；
4. PARENT_VERIFIED 或 PARENT_BLOCKED；
5. INVENTORY_VERIFIED / NOT_REACHED；
6. FORMAL_C1_BINDING_VERIFIED / NOT_REACHED；
7. EVIDENCE_EMITTED / BLOCKER_EMITTED。

不得只保存 final success。

## 5. Failure taxonomy

Terminal attempt state 至少分：
- EVIDENCE_ADMISSIBLE；
- INELIGIBLE_PARENT_MISSING；
- INELIGIBLE_SOURCE_NOT_READY；
- INELIGIBLE_CLOCK_OR_LINEAGE_MISMATCH；
- INELIGIBLE_SESSION_NOT_PROVEN；
- AUTHORIZATION_BLOCKED；
- NETWORK_OR_INFRA_FAILURE；
- VALIDATOR_CONTRACT_FAILURE；
- UNKNOWN_BLOCKER。

注意：
同一 attempt 可以同時有 observed readiness facts 與 terminal admission disposition，但不能在證據不足時自動把 observed facts 升格成 root cause。

## 6. Observed blocker != causal attribution

保存：
- observedBlockerCategory；
- verificationFailure；
- readinessFacts；
- causalAttributionState；
- causalAttributionRefs。

causalAttributionState：
- OBSERVED_FACTS_ONLY；
- PARTIAL_CAUSAL_CHAIN；
- CAUSAL_CHAIN_PROVEN；
- CONFLICTING_EVIDENCE；
- UNKNOWN。

例如：
10/06 同時觀測到 C1_GENERATION_NOT_FOUND、Formal scan 未確認、qualityReady=false、FINANCIAL / QUARTER_EPS 缺失。

在沒有完整執行鏈證明「缺財務資料 -> Formal scan 未完成 -> C1 不存在」前，只能記：
OBSERVED_FACTS_ONLY 或 PARTIAL_CAUSAL_CHAIN。

不得直接把缺失資料欄位宣稱為唯一根因。

## 7. Statistical-role flags

每筆 attempt 必須顯式保存：
- countInOperationalAttemptDenominator；
- countInResearchCalendarCandidateDenominator；
- countInTargetPopulationEligibleDenominator；
- countInProspectiveEvidenceN；
- countAsZeroPick；
- countAsNegativeOutcome；
- countAsStrategyFailure；
- countInMissingnessAccounting。

預設 fail-closed：
若 parent / session / lineage 不完整：
- countAsZeroPick=false；
- countAsNegativeOutcome=false；
- countAsStrategyFailure=false；
- countInProspectiveEvidenceN=false。

是否進 calendarCandidate / targetPopulationEligible 必須由獨立 session + prereg target semantics 證明，不由 workflow schedule 本身推定。

## 8. Rerun semantics

同一 intended scan date 的 rerun：
- 每次 execution 都保留自己的 attemptId；
- 但 research opportunity identity 不可重複計數；
- rerun success 不得刪除原 failure；
- 若 rerun 使用後來才知道的資料，需另記 knowledge cutoff；
- retrospective repair 不得改寫原 prospective failure 為「當時成功」。

## 9. 10/02 與 10/06 的反例

已知兩次都出現：
FORMAL_SCAN_NOT_CONFIRMED / C1_GENERATION_NOT_FOUND。

但：
- 10/02 已有既有研究紀錄指出 qualityReady=true；
- 10/06 artifact 顯示 qualityReady=false，缺 FINANCIAL / QUARTER_EPS。

所以高階 blocker code 相同，不代表 causal mechanism 相同。

這正是 attempt ledger 必須保存 readiness facts 與 causal-state 的原因。

## 10. Promotion boundary

Attempt ledger 可以提高：
- missingness honesty；
- infrastructure observability；
- denominator auditability；
- selection-bias diagnosis。

它不能單獨提高：
- Alpha；
- predictive incrementality；
- holdout maturity；
- D16 maturity；
- Formal optimization readiness。

第一筆 genuine Formal↔C1 binding sample 仍需完全合法的 parent / lineage / session / generation / binding evidence。

## 11. Exact next

1. 將 2026-10-06 run 37495670280 作為第一筆 machine attempt receipt；
2. 後續每個 scheduled prospective evidence run 都 append；
3. 第一筆 admissible evidence 出現時，仍保留之前所有 blocked attempts；
4. 以 attempt ledger 與 admission funnel 聯結，估計 operational availability 與 research admission fraction；
5. 不在 evidence 未足時做 root-cause 過度歸因；
6. 不改 Formal Core。
