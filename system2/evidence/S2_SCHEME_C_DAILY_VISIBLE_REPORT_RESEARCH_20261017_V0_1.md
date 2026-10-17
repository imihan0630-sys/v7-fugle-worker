# System 2｜方案 C 第三段接線：每日選股研究預覽可閱讀報告

日期：2026-10-17 Asia/Taipei  
狀態：Class A BUILD, RESEARCH_DISPLAY_ONLY, NOT DAILY_PRODUCTION_ACCEPTED  
與 DATA #1068、BUILD #1132/#1234 分工一致；不變更 PIT-A/B、既有 Stage1 assessor 或 System1 V8。

## 工作性質

沿用已合併 GitHub main #1432 三層路由、#1434 同 run 官方 A1 122/122 source-only audit 與研究觀察交接，**新增純顯示層**。不重算價量、不再次請求 TWSE/TPEx、不產生正式選股分數或交易資格，也不新增新的定時 Cron。

- `system2/runtime/scheme_c_daily_visible_report_v0_1.mjs`：強制驗證 signed Scheme C handoff + nested source preview 的來源日期/來源SHA/審核SHA/計數/分類與無正式授權旗標，才生成可閱讀 Markdown 和報告 SHA metadata。
- `system2/scripts/run_scheme_c_visible_report_readonly_v0_1.mjs`：讀 signed daily handoff JSON，將 `daily-nonpit-preview.md`、`daily-nonpit-preview-meta.json` 以檔案不存在才建立的模式保留於本次 CI 目錄；沒有 D1、Cloudflare、broker、真實資金操作。
- `system2/tests/scheme_c_daily_visible_report_v0_1.test.mjs`：真實報表結構的回歸、已知 CA positive hold、晚到 T+1 視覺警告、来源不足 SOURCE_NOT_READY、簽章/資格偽造、重複股票與插入改寫表格反例。
- `.github/workflows/system2-scheme-c-daily-audit-preview-consumer.yml`：沿用**已有的成功 A1 source audit → Scheme C 子 workflow_run**，在原 `daily-nonpit-preview.json` 之外多產出 Markdown 與 SHA metadata，一起上傳到 GitHub Actions 既有 30 日衍生 Artifact，沒有新增任何實際市場 GET 或 Cron。

## 報告內容與防混淆

- 市場交易日 T（非假定「今天」）、實際 AUDIT 時間、PREVIEW 觀察時間（台北）、T/T+1 晚到標記；不能將 2026-10-13 T+1 觀察事後稱為已於當天 23:45 Frozen。
- 真實來源的四碼證券總數／描述性價量符合總數／本次顯示筆數（例如**僅限**既有 2026-10-13 研究回放 1974/580/30，不能移植到 10/16 或未來 T）；代號、名稱、市場、原始 5 日價變動、說明。
- 已知正向除息/CA 事件以 **資料／事件待查**標記；CA UNKNOWN、普通股資格未獨立驗證、Regime 未認證均顯示。不會從沒有正事件資料而推論 `NO_EVENT` 或取得合格普通股分母。
- 來源缺漏輸出顯著 `SOURCE_NOT_READY`，不假報 0 picks，也不默認拿昨天的 T 名單代替今天。
- `selectedCount=null`、`zeroPickDay=null`、PIT-A/B unverified、Frozen/Shadow/push/orders=false；預覽順序是原始五日價描述，不是正式 strategy rank、買進順位或可執行放空。

## 實體驗收條件

PR-head 專屬真實舊資料 10/13 回放、單元正反測試、System2 Research CI、System1 V8 Regression 和 D1 Writer 安全清查全部通過後才合併；再從最新 main 實體讀回程式碼。該 PR **仍不能聲稱下一個交易日的定期預覽已實際成功**：需新 T 日 upstream 122/122 獨立 source audit 與成功的實際 child `workflow_run`、原始 Artifact SHA/時點/內容連動；DATA 的 PIT-A 2330 第一次真正 used-input 資料審核繼續，PIT-B 不阻擋這項研究觀察報告功能。

以上維持完全唯讀的工程隔離；正式選股、Frozen、Shadow、交易、正式 Cloudflare 或推播仍需各自授權與獨立驗證。
