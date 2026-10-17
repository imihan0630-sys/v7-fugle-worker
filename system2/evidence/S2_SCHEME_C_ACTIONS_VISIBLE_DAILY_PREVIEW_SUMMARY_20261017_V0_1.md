# Scheme C P0.4｜GitHub Actions 原生摘要可直接閱讀每日研究觀察

日期：2026-10-17（Asia/Taipei）  
範圍：BUILD_LANE Class A 唯讀研究顯示修復；未新增主動資料 GET、Cloudflare Worker、D1/R2、Cron、Secret、正式 PIT/Frozen/Shadow/交易或推播。

## 為何做

已合併的 #1440 每輪會產生衍生 Markdown 報告和 JSON 附件，但使用者須下載 Artifact 才能看到。這個變更沿用原有 `.github/workflows/system2-scheme-c-daily-audit-preview-consumer.yml` 並在全部 SHA、交易日、權限與 PIT false assertions 通過之後，直接把**相同那份受驗證的** `daily-nonpit-preview.md` 附到 GitHub Actions 原生 Summary。

## 真實工作路徑

在已存在的 A1 獨立稽核完成（main、成功、實際來源 workflow_run）時，Scheme C 唯讀子流程讀取原本唯一的審核 Artifact，驗證 `audit-receipt.json` 和 `preliminary-pv-watch.json`，執行原有 `scheme_c_daily_audit_handoff_v0_1`。經 `scheme_c_daily_visible_report_v0_1` SHA 標準、原始 marketDate 與公司行動現場風險、非正式 PIT flag、正式 selectedCount null 驗證後：

1. 儲存 `daily-nonpit-preview.json`、`daily-nonpit-preview.md`、`daily-nonpit-preview-meta.json` 在原有同一個衍生 Artifact。
2. 同步在該單次 CI Run 的 Actions Summary 顯示來源 T 日期、實際晚到狀態、描述性價量符合筆數、顯示候選數、PIT-A/B 未認證與正式 selectedCount UNKNOWN；後接已簽章的完整可讀中文報告。
3. 來源未就緒時報告仍是 `SOURCE_NOT_READY`，不是正式零入選；不能將舊日期當今日選股。
4. PR 實體驗收（2026-10-13 原來源）醒目標註 **歷史回放而非最新交易日**；正式新 T 日 Source/Audit/Child Run/Artifact 需要另依 #1132/#1234 的 P0 DoD 物理驗證。

## 驗收

新增 `system2/tests/scheme_c_actions_summary_visibility_v0_1.test.mjs` 檢查摘要追加次序、真實報告內容、防舊資料冒充今日，以及 workflow 只能 `actions: read, contents: read`、不引入新 `schedule:` 或 Cloudflare 部署。PR 專屬真人可讀 Summary 內容和原有衍生 Artifact 均需從 GitHub Run 實際確認，且 System2 Research、V8 Regression、D1 Writer Census 全通過方合併。

**注意：** 這是 BUILD P0 可使用性改善，不表示 PIT-A 第一檔已通關，也不表示下一個真實交易日完成每日預覽自動營運驗收。資料來源證據仍屬 DATA #1068、獨立稽核屬 AUDIT；BUILD 只接資料和顯示結果。
