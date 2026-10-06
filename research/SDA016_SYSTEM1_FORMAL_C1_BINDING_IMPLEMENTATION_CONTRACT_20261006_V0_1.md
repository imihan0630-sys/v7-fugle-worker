# SDA-016｜System1 Authoritative Formal→C1 Binding Implementation Contract V0.1

更新：2026-10-06 Asia/Taipei  
狀態：CLASS_A_CONTRACT_FROZEN / CLASS_B_IMPLEMENTATION_PENDING  
Formal Core：LOCKED / impact NONE

## 目的

把一個已驗證的 System1 Formal decision，永久綁定到**真正產生它的 exact immutable C1 generation**。

這不是另一套選股邏輯，也不是把 C1 變成交易 authority。它只解決 SDA-016 的 parent identity 問題：

`AUTHORITATIVE_FORMAL_DECISION_RECEIPT <-> EXACT_C1_GENERATION`

## 已確認的現況

1. V8.19 已提供 immutable C1 `scanOrigin` 與 generation inventory。
2. current collector 已用 `FORMAL_C1_GENERATION_UNLINKED` 防止 current-session 任意 generation 冒充 Formal parent。
3. `LAST_SCAN_KEY` 仍只是 current/latest pointer，且有限 retention，不是歷史 append-only ledger。
4. `v8_plan_archive` 也不能直接當 authoritative ledger：
   - primary key = `scan_date`;
   - same-date write 使用 `ON CONFLICT ... DO UPDATE`;
   - 因此它是可更新的 operational archive，不符合 immutable parent-binding 要求。

## V0.1 最小設計

新增獨立、append-only research provenance table：

`trade_research_formal_c1_bindings`

它只保存 Formal decision identity ↔ C1 generation identity，不保存第二份完整 universe，也不取代 `trade_research_c1_generations`。

### 必備 binding material

- formalDecisionReceiptId
- scanDate / planDate
- formalDecisionAt
- formalRuntimeVersion / formalSourceMainSha
- formalResultDigest
- formalSelectedSymbolsDigest / formalSelectedCount
- c1GenerationId / c1DecisionAt
- c1ContentDigest / c1UniverseDigest / c1PopulationN
- c1ScanOriginKind
- parentSelectionRuleVersion
- bindingCreatedAt / bindingDigest
- appendOnly=true
- superseded=false

## 建立時點

只有以下兩邊都已經 durable verified 才能寫 binding：

1. Formal `saveStockConfig` readback verified = true；
2. C1 persistence = VERIFIED + saveOk + readbackVerified。

另外 V0.1 只接受 normal `AFTER_MARKET_SCAN_PIPELINE`。

`STAGE_SELECTION_ROUTE` 與 `DIRECT_SAFE_PERSISTENCE_CALLER` 不會因為存在或時間較晚就變成 authoritative parent。

### 時鐘

`formalDecisionAt` 必須沿用同一次 request-local Formal/C1 decision clock。

`bindingCreatedAt` 只是 persistence audit time，**不能**拿來改寫 decision clock。

## Formal result digest

不要把 3Min/push delivery 狀態放進 decision identity。

Canonical payload 至少包含：

- scanDate；
- planDate；
- formalDecisionAt；
- runtime version；
- source main SHA；
- verified `saveStockConfig` 後的 ordered Formal plan objects。

遞迴 key-sort JSON → UTF-8 → SHA-256。

另外保存 ordered selected-symbol digest，並保留 pool/order identity。

## Conflict 規則

- identical replay → IDEMPOTENT；
- same formalDecisionReceiptId → different C1 generation → CONFLICT；
- same C1 generation → different Formal decision → CONFLICT；
- legacy date without binding → HISTORICAL_BINDING_NOT_PROVEN；
- 不准用 latest generation、inventory ordinal、selected-set equality 補猜。

## 失敗語意

這是 research provenance，所以：

- binding persistence failure **不得回滾或改變 Formal selection**；
- 不得改 A/B、Top6/3+3、capital、15m、BUY/ADD/REDUCE/SELL/STOP、push/order；
- business path fail-open；
- research evidence fail-closed，回報 `researchFormalC1Binding=DATA_QUALITY_BLOCKED`。

## Protected readback

未來 protected GET 可按：

- formalDecisionReceiptId；或
- scanDate。

scanDate 若有多筆，一律**全部回傳**，consumer 不得自動挑 latest。

Promotion-grade research consumer 必須 pin exact `formalDecisionReceiptId`。

## 不在 V0.1 解決

- same-session generation-set finalization；
- System1/System2 shared holdout-consumption authority；
- outer sequential hypothesis stream；
- genuine post-deploy V8.19 session evidence；
- Room00 closure。

## 驗收

Machine contract：
`research/sda016_system1_formal_c1_binding_contract_v0_1.json`

至少 BIND-T01~T10 全過，並且證明：
- `v8_plan_archive` 的 mutable overwrite 不能改變 binding；
- no historical backfill；
- provider-call delta = 0；
- Formal business behavior byte/semantic parity；
- System2 untouched。

## 權限邊界

目前只批准 Class-A contract / offline test。

真正新增 D1 table、runtime writer、protected route、Production deploy 都屬 **Class-B implementation**，需要另外依治理 gate 執行。

任何讓 binding 反過來影響選股、資金、訊號、推播或交易 lifecycle 都是 Class-C，不在本契約授權範圍。
