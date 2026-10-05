# SDA-016｜同日多世代與權威父層選擇驗證補充契約 V0.1

更新：2026-10-06 Asia/Taipei  
狀態：RESEARCH_ONLY / FIFTH_ROUND_VALIDATION_ADDENDUM_FROZEN / NO_MATURITY_CHANGE  
主責研究室：11｜統計驗證與策略市場狀態研究室  
前置契約：
- `research/SDA016_HOLDOUT_CONSUMPTION_VALIDATION_CONTRACT_20261005_V0_1.md`
- `research/SDA016_INFORMATION_FOOTPRINT_VALIDATION_ADDENDUM_20261005_V0_1.md`
- `research/SDA016_INFORMATION_RELEASE_SELECTION_VALIDATION_ADDENDUM_20261005_V0_1.md`
- `research/SDA016_ADMISSION_SELECTION_IDENTIFICATION_VALIDATION_ADDENDUM_20261006_V0_1.md`
正式核心影響：NONE

## 1. 新風險：同一 scanDate 可以有多個 immutable C1 generations

V8.19 candidate PR #644 新增 generation inventory，明確證明資料模型允許同一 scanDate 對應多個 immutable generations。

這本身不是錯誤：
- retry；
- authorized stage-selection；
- direct-safe internal persistence；
- source/version evolution；
都可能留下不同 generation。

真正的研究風險是：
> D16 experiment parent 到底是哪一代？

如果 outcome 後才從同日多代中挑：
- 最完整；
- 最漂亮；
- 最接近正式選股；
- 最後一代；
- 第一代；
任何一個未事前凍結的選擇，都構成 generation-selection researcher degree of freedom。

## 2. 已有防線：不得抹殺

Current System1 C1/C2 collector 已存在重要 fail-closed guard：

1. first page 以 scanDate 讀取後即 pin exact `generationId`；
2. subsequent pages 必須維持同 generation；
3. collector 另讀 `/api/scan/status`；
4. `scan.researchC1Population.generationId` 必須精確等於 read generation；
5. saveOk/readbackVerified/count/contentDigest/universeDigest 必須一致；
6. mismatch -> `FORMAL_C1_GENERATION_UNLINKED`.

因此：
**collector 不會在 current readback 中靜默把任意 generation 冒充 Formal parent。**

本補充不重做、也不否定上述 PASS。

## 3. 尚未解決：latest pointer 不是 immutable historical parent ledger

目前 `/api/scan/status` 依賴 `LAST_SCAN_KEY` current summary。

現行 runtime：
- normal scheduled path 的 `onlyIfMissing` 可避免已成功日期被一般排程再次跑；
- 但 `LAST_SCAN_KEY` 是 current/latest state，而不是按 scanDate append-only Formal decision ledger；
- KV retention 為 14 天；
- authorized repair / refresh / non-onlyIfMissing paths可更新 current scan state；
- C1 generation table 本身可保留同日多代。

所以長期 OOS / calibration governance 需要一個 durable, immutable historical binding：

`AUTHORITATIVE_FORMAL_DECISION_RECEIPT <-> EXACT_C1_GENERATION`

而不是只依賴今天仍可讀到的 latest status pointer。

## 4. Canonical authoritative parent binding

未來 D16 promotion-grade C1 parent至少需要 machine-visible：

- `formalDecisionReceiptId`;
- `scanDate`;
- `planDate`;
- `formalDecisionAt`;
- `formalRuntimeVersion`;
- `formalSourceMainSha`;
- `formalResultDigest`;
- `formalSelectedSymbolsDigest`;
- `formalSelectedCount`;
- `c1GenerationId`;
- `c1DecisionAt`;
- `c1ContentDigest`;
- `c1UniverseDigest`;
- `c1PopulationN`;
- `c1ScanOriginKind`;
- `bindingCreatedAt`;
- `bindingDigest`;
- `parentSelectionRuleVersion`;
- `appendOnly=true`;
- `superseded=false` unless a separately governed correction chain exists.

Formal result digest 不表示 D16 以 selected-only 作母體。
它只是證明：
**這個 full C1 generation 就是當時該權威 Formal decision 所對應的 parent snapshot。**

D16-CAL-01 仍以 complete qualified C1 population 為研究母體。

## 5. Parent selection rule

D16 不得自己從 generation inventory 挑 parent。

Allowed:
- exact immutable Formal decision binding 指向某 generation；
- binding 在 economic outcome access 前已存在；
- generation itself passes C1 integrity / PIT / completeness gates。

Not sufficient alone:
- earliest generation；
- latest generation；
- lowest ordinal；
- AFTER_MARKET_SCAN_PIPELINE origin；
- selectionVerified=true；
- same selectedCount；
- same scanDate；
- current `/api/scan/status` pointer without durable historical binding。

Reason:
兩個 generations 可能同為 AFTER_MARKET_SCAN_PIPELINE、同日、都 selectionVerified=true，但使用不同 request-local data vintages。

## 6. Non-authoritative generations

### `STAGE_SELECTION_ROUTE`
不得因為是 authorized route 就自動成為 D16-CAL-01 parent。
只有它若另有 exact authoritative Formal decision binding 才可評估；dry-run / recovery computation 本身不是權威 parent proof。

### `DIRECT_SAFE_PERSISTENCE_CALLER`
預設 research/testing provenance，不能單憑存在成為 authoritative Formal parent。

### `AFTER_MARKET_SCAN_PIPELINE`
是必要 provenance clue，但不是唯一性證明。
同日多個 after-market generations 時仍需 exact decision binding。

## 7. Inventory completeness

V8.19 candidate正確標示：
`snapshotMutableUntilSessionComplete=true`.

因此 inventory query success ≠ final session generation set complete。

若研究要使用「當日一共有幾代」作 admission / ambiguity判斷，需要：
- deterministic session-finalization clock；或
- immutable inventory-finalization receipt；
- finalization rule不得 outcome-driven。

在 finalization 前：
`GENERATION_SET_NOT_FINALIZED`.

## 8. Legacy / historical boundary

Pre-V8.19 generations：
- 保留 `LEGACY_NO_SCAN_ORIGIN`;
- 不回填 origin；
這是正確 fail-closed 行為。

同理，若過去日期缺 authoritative Formal↔C1 binding：
- 不得依 selected symbols / timestamp proximity / latest generation 猜回；
- 狀態為 `PARENT_GENERATION_AMBIGUOUS` 或 `HISTORICAL_BINDING_NOT_PROVEN`;
- 可作 retrospective mechanics，不可冒充 genuine prospective D16-CAL-01 evidence。

## 9. 第五輪對抗驗收

41. 同日兩個 complete C1 generations，outcome 後挑績效較好那代：reject adaptive parent selection。
42. 以 `ORDER BY created_at DESC LIMIT 1` 當長期 experiment parent rule，沒有 immutable Formal binding：`PARENT_GENERATION_AMBIGUOUS`.
43. current collector讀到 latest generation，但 scan-status Formal proof指向另一代：既有正確行為應為 `FORMAL_C1_GENERATION_UNLINKED` fail closed。
44. 同日兩個 `AFTER_MARKET_SCAN_PIPELINE` generations皆 selectionVerified，僅靠 origin仍無法決定 authoritative parent：require exact binding。
45. stage-selection dry-run generation晚於 normal generation，inventory latest變成 stage generation：不得取代 Formal parent。
46. `LAST_SCAN_KEY` later update / expiry導致 historical Formal↔C1 pointer不可讀，而 D1 generations仍存在：不得猜 parent。
47. historical generation lacks durable binding但 selected symbols碰巧相同：不得用 selected-set equality推回 parent。
48. inventory尚標 `snapshotMutableUntilSessionComplete=true` 時宣稱當日 generation set完整：reject session-completeness claim。

## 10. PR #644 research-owner disposition

Candidate PR #644:
`USEFUL_PROVENANCE_PARTIAL_PASS / NOT_AN_SDA016_CLOSURE_RECEIPT`.

Credited:
- immutable scanOrigin on V8.19+ generation；
- no historical origin backfill；
- same-generation relabel conflict；
- same-date all-generation inventory；
- denominator vs returned rows；
- corrupt modern row visible/fail-closed；
- snapshot mutable-until-complete explicitly exposed；
- 12/12 dedicated engineering tests；
- exact-head Regression / Repair / isolated review PASS；
- no Formal logic change。

Still not provided by PR #644:
- merged/deployed runtime；
- genuine V8.19 production generation；
- immutable historical Formal-decision↔C1-generation binding；
- session-finalized generation-set receipt；
- shared SDA-016 consumption authority；
- V0.4 full oracle pass；
- Room00 closure。

## 11. Exact next

1. System1 parent owner may use PR #644 as provenance foundation after its own approval gates, but Room11 does not request merge/deploy.
2. Shared SDA-016 engineering should add durable authoritative Formal↔C1 parent binding or prove an equivalent already-immutable ledger.
3. D16-CAL-01 must consume that exact parent binding; it must never choose a generation by outcome, latest timestamp or inventory position.
4. Existing collector `FORMAL_C1_GENERATION_UNLINKED` guard remains accepted and should not be weakened.
5. Historical dates without provable binding stay UNKNOWN/retrospective-only.

FORMAL_OPTIMIZATION_CANDIDATE: NONE  
Formal Core: LOCKED
