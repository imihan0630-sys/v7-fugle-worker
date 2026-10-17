# System 2｜方案 C：來源稽核與預覽真實截止延遲透明化（BUILD Class A）

日期：2026-10-17 Asia/Taipei  
狀態：**研究預覽營運時鐘揭露／唯讀**。GitHub 既有排程與 23:45 截止原封不動。絕不自行新增 Cron、第三方排程、新 Token、Cloudflare Worker/D1/R2、正式策略/Frozen/Shadow/交易。

## 實務問題

DATA #1068 已證明 2026/10/16 官方 A1 3/3 次 122/122 SOURCE audit 完整，但三個 scheduled-origin capture runs 的實際 GH 建立時間均晚於 T23:45（這類**GH 排程歸因**應持續由 DATA 特定 source-origin 真實 API 證據獨立證明）。BUILD 的 #1449 真實同一稽核 ZIP 已生成 1972 四碼來源／519 描述符合／30 顯示，這是 source-only 且 **LATE** 的真實 10/16 研究預覽。此前使用者可讀報告只顯示 `LATE_SOURCE`，缺乏可以直接量化的研究收據實際時間／截止差。

## 本次 Class A 完成項目

- `system2/runtime/scheme_c_daily_visible_report_v0_1.mjs`：在驗證 signed 手交接 receipt 與其 nested preview SHA 後，維持既有固定 T **23:45 Taipei = T 15:45 UTC**，用**獨立來源稽核 `auditedAtUtc`**與**實際預覽 `originalObservedAtUtc`**計算有正負號的 `independentAuditOffsetMinutes`、`previewObservationOffsetMinutes`（正數：晚於截止；負數：提前）。顯示完整台北時間及對應分鐘數，新增 `preferredCutAtUtc`、`researchReceiptCutStatus` 至唯讀衍生 metadata。若沒有準備好的來源，仍列出實際稽核相對截止，預覽時間保持 `null`。
- **防時點假象**：簽章雖有效，但若 nested preview 的觀察時點比 signed upstream audit 早，或 preview 宣稱 `SOURCE_BOUNDED_NON_PIT_PREVIEW` 卻在 T23:45 之後才被稽核或觀察到，顯示端必須 fail-closed；不允許標成截止前已形成預覽。過去真實 T+1 / `LATE_SOURCE` 仍可**研究回顧**，不能被轉成 T 截止前的前瞻績效。
- `.github/workflows/system2-scheme-c-daily-audit-preview-consumer.yml`：原有 Actions Summary 和真實 10/16 同 Audit ZIP physical replay 均加註兩個真實 clock delta，並以 jq 檢查報告 metadata 符合正值／非交易權限，仍由原 workflow_run 事件觸發，不增加其他作業。
- `system2/tests/scheme_c_daily_visible_report_v0_1.test.mjs`、`system2/tests/scheme_c_actions_summary_visibility_v0_1.test.mjs`：加入早／晚／blocked 當日時點反證、負時間差、預覽時間不早於獨立稽核、假裝 on-time fail-closed、Summary 實際數字與沒有 GitHub/provider 歸因測試。

## 嚴格語意

單憑 **簽章 A1 AUDIT 與預覽觀察時鐘** 只能說明「來源在 T23:45 截止前後何時完成」，**不能**區分 GH scheduler dispatch 排隊、上游官方資料發行、資料完整解析耗時、審核耗時。故 `schedulerDispatchDelayMinutes=null`、`officialProviderPublicationAtUtc=null`，不得將報告的正數誤稱「GitHub 本身晚到 X 分鐘」。DATA 可用已有獨立 `#1445` scheduled vs created origin evidence另列排程結果，但不能自動混進這個無來源歸因的報告。無更動 DATA 提供的原始時點。

本報告本身不承認已核准普通股母體、未取得的公司行動 NO_EVENT、完整策略因子/評分、`selectedCount`、`zeroPickDay`、PIT-A/B、Frozen、Shadow、推播/訂單或任何策略績效。只以原 **2026/10/13 實體 source replay**及 **2026/10/16 真實同一 Audit ZIP** 測試安全，周末的 10/17 不能當新 trading T；2026/10/19 真正自動主支線 **source→audit→consumer** delivery / CUT 實體驗收仍待跑完才可宣稱上線。
