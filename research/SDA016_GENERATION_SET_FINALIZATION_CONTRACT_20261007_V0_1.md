# SDA-016｜同日 C1 世代集合完成收據語意契約 V0.1

更新：2026-10-07 Asia/Taipei
狀態：RESEARCH_ONLY / T48 FINALIZATION SEMANTICS FROZEN
主責：11｜統計驗證與策略市場狀態研究室 / D16
Formal Core impact：NONE
成熟度影響：NONE

## 1. 目的

V8.19 generation inventory 正確揭露：
`snapshotMutableUntilSessionComplete=true`.

因此：inventory query 成功 ≠ 當日 generation set 已完整。

SDA016-T48 的目標不是決定 Formal parent；V8.20 explicit Formal→C1 binding 已處理 parent identity。

T48 要回答的是：某 scanDate 的 generation inventory 何時可以被合法稱為「完整且不再期待正常新增」？

## 2. Finalization receipt 必須是獨立權威

禁止以下推論：
- 現在沒有新 row，所以 final；
- latest generation 已超過 N 分鐘，所以 final；
- Formal binding 已存在，所以全日 generation set final；
- inventory returnedCount == generationCount，所以 session final；
- 只看到 AFTER_MARKET_SCAN_PIPELINE，所以 final。

合法 finalization 必須有獨立 receipt，且 receipt 在 outcome 使用前建立。

## 3. Finalization identity

Machine-visible minimum：
- finalizationReceiptId；
- scanDate；
- sessionIdentityHash；
- finalizationRuleVersion；
- producerRegistryVersion；
- producerSetHash；
- expectedProducerClasses；
- producerCutoffRuleHash；
- finalizedAt；
- knowledgeCutoff；
- generationCount；
- generationSetDigest；
- generationIds；
- originCounts；
- pendingProducerRefs；
- failedProducerRefs；
- unresolvedProducerRefs；
- postFinalizationViolationCount；
- superseded=false；
- historicalBackfillPerformed=false。

## 4. Producer registry

finalization 不能只看目前 inventory rows。
它必須先知道有哪些 runtime path 有權在這個 session 產生 C1 generation。

Current observed producer classes include：
- AFTER_MARKET_SCAN_PIPELINE；
- STAGE_SELECTION_ROUTE；
- DIRECT_SAFE_PERSISTENCE_CALLER。

是否每一類在 Production 都可於該 session 產生 generation，必須由 producer registry/version 定義，不由 D16 猜測。

如果 producer set 不完整：`FINALIZATION_PRODUCER_SET_UNKNOWN`.

## 5. Deterministic closure rule

合法 finalization rule 必須 pre-outcome 且 deterministic。

至少證明：
- official session identity 已確定；
- 所有當日允許 producer windows / retry / recovery windows 已關閉；
- 沒有仍在執行的 producer job；
- 沒有已排程但未決的 allowed retry/recovery；
- 所有 producer attempt 的 terminal state 可讀；
- inventory read non-truncated；
- integrityComplete=true；
- modernOriginCoverageComplete=true；
- generation rows digest 完整。

不能因為 outcome 快成熟而提前 finalization。

## 6. Generation-set digest

generationSetDigest 應由 canonical ordered set 產生。
每個 generation 至少包含：
- generationId；
- sessionDate；
- decisionAt；
- runtimeVersion；
- originKind；
- pathKind；
- contentDigest；
- universeDigest；
- populationN；
- integrity state。

排序規則必須固定，不能靠資料庫目前 row order。
generationCount 必須等於 canonical set 長度。

## 7. Formal binding relationship

Finalization receipt 必須能連結該日所有 explicit Formal↔C1 binding；每個 bound c1GenerationId 必須存在 generation set。

若 binding 指向 set 外 generation：`FINALIZATION_BINDING_SET_MISMATCH`.

但反過來不成立：未被 Formal 綁定的 generation 仍可能合法存在 inventory set，不能被 finalization receipt 刪掉。

## 8. Late generation after finalization

Finalization receipt 不得被 silent overwrite。

若 finalization 後出現新的 same-scanDate generation：
- 原 receipt 保留；
- append `POST_FINALIZATION_GENERATION_VIOLATION`；
- promotion-grade session finalization 失效；
- 不得單純重算 digest 後假裝原 finalization 從未存在。

若未來治理允許 correction chain，必須有 parentFinalizationReceiptId、correctionReason、firstKnownAt、outcomeExposureState、consumption impact。

在 V0.1，預設 fail closed。

## 9. Multiple Formal decisions

同一 scanDate 若有多個 legitimate Formal decisions/bindings：
- finalization receipt 仍描述完整 session generation set；
- 不把一個 binding 錯當成一個 session；
- scanDate query 應能連結所有 bindings；
- parent identity 與 set completeness 維持兩個不同概念。

## 10. T48 acceptance cases

F01 inventory mutable flag true + no finalization receipt：`GENERATION_SET_NOT_FINALIZED`。
F02 returnedCount == generationCount but producer windows still open：`NOT_FINALIZED`。
F03 parent binding verified but no producer closure：`PARENT_VALID_SET_NOT_FINALIZED`。
F04 producer registry incomplete：`FINALIZATION_PRODUCER_SET_UNKNOWN`。
F05 finalization before pending retry/recovery resolved：`REJECT_EARLY_FINALIZATION`。
F06 finalization receipt + all producer attempts terminal + canonical digest：`FINALIZED_VERIFIED`。
F07 late generation appears after finalization：`POST_FINALIZATION_GENERATION_VIOLATION`。
F08 finalization silently replaced after late generation：`REJECT_MUTABLE_FINALIZATION_HISTORY`。
F09 Formal binding points outside final set：`FINALIZATION_BINDING_SET_MISMATCH`。
F10 outcome observed before finalization rule frozen, then rule tuned：`ADAPTIVE_FINALIZATION_RULE_REJECTED`。

## 11. D16 statistical interpretation

Finalization controls inventory-completeness claims and generation-multiplicity denominators。

It does not by itself prove Alpha、independent dates、outcome independence、holdout freshness、source readiness 或 policy incrementality。

T48 pass is necessary governance evidence, not performance evidence。

## 12. Exact next

1. System1 engineering may implement an append-only finalization receipt under its lane/approval。
2. Room11 later validates only actual implementation/readback against F01~F10。
3. Do not modify V8.20 authoritative parent semantics。
4. First valid finalization receipt must be prospective; do not synthesize historical finalization。
5. Room00 remains closure authority。