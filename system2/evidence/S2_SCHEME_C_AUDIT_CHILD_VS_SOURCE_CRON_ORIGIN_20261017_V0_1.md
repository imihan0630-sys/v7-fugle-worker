# System 2｜方案 C 自動稽核子事件 ≠ 原行情 Cron：實體交付來源收據 V0.1

日期：2026-10-17 Asia/Taipei  
工程責任：BUILD_LANE Class A，只讀 NON_PIT_PREVIEW；DATA 原始 source 收集 / AUDIT source-PIT 驗證 / System 1 V8 正式核心皆不變。

## 實際錯誤風險

既有 GH source collector 可以透過 `schedule`、`workflow_dispatch`、被路徑鎖定的 `push` 啟動；獨立 A1 Auditor 一律以 `workflow_run` 事件接成功來源；Scheme C 又以 `workflow_run` 接獨立 AUDIT。**因而「Scheme C 消費者收到 audit workflow_run」只能證明 *audit→consumer* 已自動傳遞，不能證明最原始資料抓取一定是 Schedule Cron，也不能用這證據替 10/19 自動行情準時率加 1。** GitHub 相同 audit event 無法單獨追溯原 source-run `event.schedule` 及真正 source-audit run ID lineage。PR 測試、人工補跑則必須更明確不混入正式自動交付分母。

## 已實作的保守分類

- `system2/runtime/scheme_c_delivery_origin_v0_1.mjs`：由 GH 真實 event type、exact upstream audit Run ID、其成功/main/repo/原獨立 audit 原事件及既有 signed `handoffReceiptHash` 建立唯讀 SHA256 衍生收據。對三類觸發做嚴格區分：
  - `workflow_run` 且父 A1 audit 為 main-success 的 `workflow_run` → `AUTO_AUDIT_CHILD_RECEIVED__SOURCE_CRON_ORIGIN_UNVERIFIED`，只代表自然 audit-child 事件。
  - `workflow_dispatch` 且前置操作已經獨立驗證真實 main 的 completed SUCCESS A1 audit → `OPERATOR_MANUAL_REPLAY_NOT_AUTOMATIC`。
  - `pull_request`（真 2026-10-13/16 Artifact 回放）→ `PR_HISTORICAL_PROOF_ONLY`。
- 三者均**不能**藉由單一 audit child 設 `sourceCollectorScheduledOriginIndependentlyVerified=true`：一律 `null`，`completedDailyAutomaticSourceChainCertified=false`；`selectedCount=null`、`zeroPickDay=null`、PIT-A/B/Frozen/BUY/push/off，絕不推論昨日之名單為今日。
- `system2/scripts/run_scheme_c_delivery_origin_readonly_v0_1.mjs`：從 **已二次驗過原始來源 SHA + 獨立 audit SHA 的 handoff JSON** 得到市場 T 和 exact ID，寫出 `daily-delivery-origin.json`；建立/寫檔使用 create-only `wx`。沒有網路 GET、外部 scheduler、D1/Cloudflare。
- 現有 `.github/workflows/system2-scheme-c-daily-audit-preview-consumer.yml` 於同一輪報告成功生成後補簽衍生交付來源收據，按路徑保留在原來唯一衍生 Artifact（含 JSON／MD／meta）；Summary 顯示 `本輪觸發分類` 與「來源最初 Cron 觸發：UNKNOWN」。人工補跑和 PR 歷史資料照舊，不變更既有自然 `workflow_run`、來源 Cron、Source GET 數、時間 Cut 或 PIT gate。
- `system2/tests/scheme_c_delivery_origin_v0_1.test.mjs`：自然子事件／手動／PR、錯誤事件、fake repo/branch/source SHA、假失敗 audit、假 marketDate 正反案例。Workflow 測試額外確保不會把最初原來源的 Schedule 順序冒充已驗證。
- 缺的證據 **由 DATA/AUDIT 分工，不可由 BUILD 假造**：只有對原 source-run id/name/event/`github.event.schedule`（或其已簽章 `source-github-origin.json`）和上游 audit_Run 來源 lineage 做獨立鏈結後，才可以在其他版本評估 `scheduledOriginIndependentlyVerified=true`。本 PR **不擅自改 DATA 附件或稽核 schema**；這也是不把下一交易日的來源排程驗收草率視為通關的原因。

## 驗收與仍未完成

以已經真正成功的 **2026-10-16 上游真實 122/122 A1 同 Run 一份 Artifact #12060227504** 與舊 10/13 pinned 來源，跑既有真實 CI；本次 GitHub 筆數必須仍 519 descriptive matches／30 顯示，不改價格、分數或公司行動。新 `daily-delivery-origin.json` 不包含原始 OHLCV；API/Cron/Cloudflare/V8 Formal 完全不變。

2026-10-19 真交易日的真正自動 Source→Audit→Consumer 物理驗收仍需要到時才有來源。自然 audit-child SUCCESS ≠ original source collector `schedule` confirmed；兩者必須分開計量。PIT-A 2330/3287 0/2、PIT-B 與 Frozen 不因這次自動交付收據變更。
