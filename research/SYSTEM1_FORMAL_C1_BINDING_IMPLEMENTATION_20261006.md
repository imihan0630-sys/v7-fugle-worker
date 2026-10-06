# System1 V8.20.0｜SDA-016 Formal→C1 Authoritative Binding Class-B Implementation

更新：2026-10-06 Asia/Taipei  
候選版本：`8.20.0-formal-c1-binding-ledger`  
狀態：CLASS-B IMPLEMENTED / ENGINEERING ACCEPTED / MERGE+DEPLOY APPROVAL PENDING / NOT MERGED / NOT DEPLOYED  
Formal Core：LOCKED

## 目的

將每一次 verified System1 Formal decision 永久綁定到真正產生該決策的 exact immutable C1 generation。

本功能只建立 research provenance authority，不改變任何選股、排序、資金、訊號、推播或交易行為。

## 實裝

### Runtime patch

`scripts/apply_v8_20_0.py`

接續最新正式 patch chain：

`V8.19.0 -> PVE-248 -> PVE-250 -> V8.20.0`

V8.20 將 runtime 技術版本升為：

`8.20.0-formal-c1-binding-ledger`

### Frozen binding module

`research/system1_formal_c1_binding_v8_20_0.mjs`

module Git blob SHA：

`1e4518a92d561ee99d89a95b4efbf7faa0cb45d2`

功能：
- canonical recursive key-sort JSON；
- SHA-256 Formal decision digest；
- deterministic `formalDecisionReceiptId`；
- deterministic `bindingId`；
- binding receipt build / verify；
- append-only persistence；
- protected readback。

## D1 authoritative binding table

新增：

`trade_research_formal_c1_bindings`

核心約束：
- `binding_id` PRIMARY KEY；
- `formal_decision_receipt_id` UNIQUE；
- `c1_generation_id` UNIQUE；
- runtime 沒有 UPDATE；
- runtime 沒有 DELETE；
- same Formal decision 不可 rebound 到另一 generation；
- same C1 generation 不可 rebound 到另一 Formal decision。

現有 `v8_plan_archive` 不升格成 authority，因為它以 `scan_date` 為 PK 且同日會 `ON CONFLICT ... DO UPDATE`。

## Formal decision identity

Formal identity 使用 verified `saveStockConfig` readback 所回傳的 exact ordered Formal plans。

digest material：
- scanDate；
- planDate；
- Formal/C1 shared decisionAt；
- effective runtime version；
- source main SHA；
- ordered Formal plan objects。

另保存 ordered symbol + strategyPool digest。

不納入：
- 3Min delivery；
- push delivery；
- future fill；
- future return；
- research outcome。

## C1 parent authority

V0.1 只接受：

`AFTER_MARKET_SCAN_PIPELINE`

以下不具自動 parent authority：
- `STAGE_SELECTION_ROUTE`;
- `DIRECT_SAFE_PERSISTENCE_CALLER`.

writer 只有 normal after-market flow。

建立 binding 前必須：
1. Formal config save/readback verified；
2. C1 status VERIFIED；
3. C1 saveOk=true；
4. C1 readbackVerified=true；
5. exact generation id 等於 request-local C1 receipt；
6. stored C1 whole-generation verification PASS；
7. scanDate / decision clock / runtime / source SHA / content digest / universe digest 完全一致；
8. scanOrigin = AFTER_MARKET_SCAN_PIPELINE。

## Fail semantics

若 binding 失敗：

- Formal selection 照常；
- Formal config 不回滾；
- 3Min / daily push 不因 binding 失敗而停止；
- A/B / Top6 / 3+3 / capital / 15m / lifecycle 不變；
- research evidence = DATA_QUALITY_BLOCKED；
- no historical backfill；
- no parent inference。

## Protected readback

`GET /api/research/formal-c1-binding`

需要 ADMIN_TOKEN。

必須二選一：
- `formalDecisionReceiptId`
- `scanDate`

scanDate 若有多筆 binding：
**全部回傳**，不選 latest。

輸出明示：
- authoritativeParentSelection = EXPLICIT_BINDING_ONLY；
- latestHeuristicUsed = false；
- inventoryOrdinalHeuristicUsed = false；
- selectedSetEqualityInferenceUsed = false；
- historicalBackfillPerformed = false。

## Acceptance

`tests/test_system1_formal_c1_binding_v8_20_0.mjs`

覆蓋：
- BIND-T01 exact replay idempotent；
- BIND-T02 Formal rebound conflict；
- BIND-T03 C1 rebound conflict；
- BIND-T04 same-day multiple C1 generations；
- BIND-T05 later stage-selection generation；
- BIND-T06 mutable latest pointer loss；
- BIND-T07 legacy no-binding / no-backfill；
- BIND-T08 research failure fail-open to Formal；
- BIND-T09 mutable v8_plan_archive overwrite isolation；
- BIND-T10 scanDate multi-binding all-return；
- protected auth/route/schema；
- Formal protected function parity；
- provider-call delta = 0；
- System2 untouched。

## CI / deploy wiring

已加入候選 branch：
- V8 Regression Tests；
- V8 Repair CI；
- System1 C1 C2 isolated offline repair review；
- V8 Cloudflare Deploy patch chain。

Cloudflare workflow 只會在 runtime PR merge 進 main 後觸發；目前未合併，因此未部署。

## 權限邊界

Owner 於 2026-10-06 明確批准：

`SDA-016 Formal→C1 Binding Class-B 實裝，Formal Core 維持鎖定。`

本次授權涵蓋：
- Class-B engineering；
- branch / PR；
- deterministic tests；
- exact-head CI。

依既有治理，具體 PR merge + Production deploy 仍須在候選完成後另行批准。

Class-C 永不由此授權推定。

## Engineering acceptance

Validated engineering head:

`c75d4a40ade378e4f1fdbf18ec08b626b5decb79`

PASS:
- V8 Regression Tests `37479305244`;
- V8 Repair CI `37479305145`;
- System1 C1 C2 isolated offline repair review `37479305270`;
- D02 PVE-250 Approved Integration CI `37479305394`.

這些 PASS 建立的是 Class-B engineering acceptance，不建立 Production authority。

## 下一步

1. 對本 governance-only acceptance sync head 再跑 final exact-head CI；
2. 若 main 前進，先做 path overlap / reconcile；
3. 停在 PR #680 merge / Production deploy approval gate；
4. 只有 owner 另行批准後才可 Merge + deploy；
5. 部署後才做 genuine Formal→C1 readback。


## Merge / Production authorization — 2026-10-06

Owner explicitly authorized:

`批准 PR #680 Merge + V8.20 Production 部署，Formal Core 維持鎖定。`

Authorization scope:
- PR #680 merge;
- V8.20 Production deployment;
- post-deploy runtime/readback verification;
- genuine Formal→C1 binding verification when a legitimate post-deploy Formal decision exists.

Still forbidden:
- any Formal Core mutation;
- A/B, Top6/3+3, comparator, capital, 15m, lifecycle, push/order changes;
- System2 policy changes;
- historical binding backfill or synthetic genuine evidence.

A fresh exact-head CI pass after the latest-main lease remains mandatory before merge.


Final merge lease base: `146e4cae4717bda92192cae5bfd919b3d7d28011`.
