# System 2｜BUILD｜Scheme C SOURCE 真實排程→獨立稽核→報告同源交叉核對 V0.1

日期：2026-10-17 Asia/Taipei。權限 Class A 僅唯讀原生實體證據組合；不是正式每日選股或 PIT-A/B 放行。

## 立即解決什麼

先前的 `S2_SCHEME_C_DAILY_DELIVERY_ACCEPTANCE_V0_1` 正確將 SOURCE 原始 Cron 觸發標成未驗證，因為一個自動 Audit-child 事件不能證明原始採集啟動方式。DATA 於已合併的 [PR #1466](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1466) 對 2026-10-16 的真正 SOURCE Run #38934081985（GitHub REST event=`schedule`，排程 `15 12 * * 1-5`）、源檔、原始稽核 Run #38934321405、實體 122/122 原始資料與另一份獨立 Dual receipt 完成重新驗證。新 BUILD 唯讀 join 將 DATA 簽署收據與現有 Scheme C 的 *同市場日期、同 audit Run、同人類報告 SHA* 做重算驗證。

DATA 所辨識的排程參考時間 2026-10-16 20:15 台北時間；實際工作起動 2026-10-17 00:42:40 台北時間，推入延遲 267.667 分鐘。原 T=10/16 23:45 已過，該資料是 **LATE_SOURCE 非 PIT 描述性研究**，不能以事件 `schedule` 推翻真實時點。

### 已新增的驗證工具

- `system2/runtime/scheme_c_native_source_delivery_join_v0_1.mjs`：驗證 DATA `S2_DATA_A1_NATIVE_CRON_SOURCE_AUDIT_CHAIN_V0_1` `receiptHash`、原始 GitHub Cron metadata 的已獨立核對結果、122/122，並重新核算 Scheme C `handoffReceiptHash` / `deliveryOriginHash` / 報告內容 SHA / `acceptanceHash`；對同一 audit Run ID / 市場 T / T23:45 及原稽核實際 UTC 時點作交叉比對。
- `system2/scripts/run_scheme_c_native_source_delivery_join_readonly_v0_1.mjs`：僅讀取既存六件簽署或原文輸入，以 `wx` 新檔輸出 signed `daily-native-source-delivery-join.json`，拒絕覆寫，無 provider GET/Cloudflare。
- `system2/tests/scheme_c_native_source_delivery_join_v0_1.test.mjs`：八組反例，含 PR、人工、自然晚到、即使全部時點正常仍未獨立核對完整 consumer GitHub REST、Run/T 錯置、篡改時鐘/hash、推回 T23:45、以及禁用任何 PIT/選股/Frozen/交易權限。
- 既有 `.github/workflows/system2-scheme-c-daily-audit-preview-consumer.yml` **只有 PR 內的真實 10/16 歷史資料驗證工作**，重用 DATA #1466 成功 Artifact `s2-data-native-a1-cron-source-audit-chain-39016618423` 和原稽核的現存同一 ZIP，產出 `daily-delivery-acceptance.json` 再執行這個 join，並提供 GitHub Summary 與可下載 derived receipt。沒有新 Schedule，沒有增開來源 GET。

### 不能偷換的驗收字眼

- `sourceScheduledEventVerified=true` 意指原 SOURCE Cron 已由 DATA 透過原生 REST 與原始 receipts 獨立核對；**不是** `fullDailyScheduledChainAccepted=true`。
- PR 與 manual replay 不算自然每日執行；即使 SOURCE 日期與審查全部一致，也只算 **PR_REPLAY_NOT_AUTOMATIC**／**MANUAL_REPLAY_NOT_AUTOMATIC**。
- 真正自然 `workflow_run` 是必要但還不充分：對完成的 BUILD consumer GitHub REST 原生事件、狀態、實體單一 Artifact 的後續獨立查核仍未做，故本 V0.1 的 `fullDailyScheduledChainAccepted=false` 永遠不會自行轉為 true。
- 2026-10-16 已知真實 SOURCE 122/122、非 PIT 價量描述符合 519、顯示 30；這不是正式策略排序。PIT-A 2330/3287 尚 0/2，普通股全市場母體仍 UNKNOWN，`selectedCount=null`、`zeroPickDay=null`、Shadow S0–S5 0/6、Frozen D1 0，System1 V8 不變。
- 下一個實際市場日 T（預期 2026-10-19 但需交易所資料確認）才有可能完成真正新日 SOURCE 自動→Audit→BUILD child 自動、完成時間與 Artifact 原生回讀；當日資料若晚於 T23:45 仍只能標 `LATE_SOURCE`。

接力：BUILD #1132/#1234；DATA #1068 保持原始證據及原始 Cron 查核權限；AUDIT 獨立驗收；REMEDIATION #1238 才能處理未來正式 D1 Writer。所有正式 Stage1 准入修改 Class B/C 必須另行授權。
