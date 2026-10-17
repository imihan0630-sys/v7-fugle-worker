# System 2｜方案 C：既有官方 A1 來源稽核 → 每日非 PIT 預覽自動交接

日期：2026-10-17 Asia/Taipei  
狀態：BUILD Class A read-only / 由既有 workflow_run 完成事件觸發的研究型 consumer，**沒有新增 Cron、TWSE/TPEX GET、正式策略決策、D1/R2 writes、Cloudflare Worker/推播或 System1 修改**。

## 本輪實作目標

[Owner 三層決策及第一階段 PR #1432](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1432) 已讓系統能讀已存在的 `preliminary-pv-watch.json`，但那次只驗證 2026-10-13 真實 T+1 舊報表，**沒有把每天新產生的真實來源流程接入**。

本輪新增**第二階段日常資料接線**。使用既有 [System2 Shared Official A1 Independent Source Audit (READ ONLY)](https://github.com/imihan0630-sys/v7-fugle-worker/blob/main/.github/workflows/system2-shared-official-a1-independent-audit.yml) 本來就保存的 `audit-receipt.json`、`preliminary-pv-watch.json`，透過新 `workflow_run` 在既有獨立 122/122 source audit 本身完成後消費，且只允許 main/來源 success/真實父 workflow_run。這不是新增一個時間排程；不會自行重新執行來源取得或改動既有 audit 工作流程。來源全日不足 ⇒ 僅回報 BLOCKED，不產生假選股或假零選股。

## 所有檔案

- `system2/runtime/scheme_c_daily_audit_handoff_v0_1.mjs`：來源日/官方資料 122/122/61 calendar、單一 AUDIT receipt SHA 原樣驗證、兩種簽章資料的原始來源 hash/date/audit hash/時間連動，再呼叫已通過的 `three_layer_selection_preview_router_v0_1.mjs`。
- `system2/scripts/run_scheme_c_daily_audit_handoff_readonly_v0_1.mjs`：輸入已保存的兩份 JSON，自動輸出非 PIT 研究 receipt；不需 Cloudflare Secret。
- `system2/tests/scheme_c_daily_audit_handoff_v0_1.test.mjs`：source complete/incomplete, missing source, no backdate, tampering, audit pair cross-source rejection，永不自動升級 PIT/Frozen。
- `.github/workflows/system2-scheme-c-daily-audit-preview-consumer.yml`：成功完成的既有 audit 本來就輸出的一個 ZIP 足以提供兩份 input；PR 階段只利用 2026-10-13 真實獨立稽核 #38469057567 與實體 V0.2 watch #38477169340 做 exact lineage/cut 的保守重播，另產生 read-only 新 artifact。

## 明確能做／不能做的區別

1. `NON_PIT_PREVIEW` 是來源特定 61 日價量條件的 **描述性研究觀察**，不等於現行 `SHORT_MOMENTUM V0.1-CONTRACT` 七項因子全部綜合評分，更不等於多策略全市場選股成功。某次只有 30 筆顯示不代表那是正式前三十名。
2. 不可用四碼券當成已完全驗證的普通股 universe；公司行動的原始來源 zero-row 也不能用來認證沒有事件。2330 已知 2026-09-16 除息仍由第一階段的受限 warning/hold 處理。
3. 真實來源延遲取得時，標示為延後研究，不可倒算成 T 日 23:45 已產生的已凍結候選股，且即使非延後也不能未經獨立 create-only 先驗存證就宣稱 Forward/Paper 收益有效。
4. 正式 PIT-A 需要決策時點 used input+獨立 AUDIT 簽章與經批准 gate 版本；PIT-B 歷史公司行動時間版本、回測、OOS 與成本另走舊流程；本輪沒有權限觸發這兩層的資格成功。
5. `selectedCount=null`、`zeroPickDay=null`、`frozenD1Written=false`、`pitACertificationGranted=false`、`pitBCertificationGranted=false`、`fullMarketOrdinaryShareCount=null`；無任何交易、通知或資金分配。
6. 即使 workflow_run 開始自動消費，實際能否順利產出每個交易日報告仍取決於既有來源 122/122、時間和來源稽核是否完成。**尚未有每個最新交易日都成功完整出名單的證據**。此階段先驗證工程路徑與失敗語意。

## 後續任務

BUILD：每日來源受阻如何在產品介面上揭露、若缺市場來源如何只顯示具完整證據股池並標示 market denominator unknown；依現有策略庫逐步開發不同策略的非 PIT 預覽觀察邏輯；再讓多策略 Regime、產業／籌碼等有實際來源的資料獨立逐項接入。不能用純價量觀察替代真正的 Strategy scoring。

DATA 與 AUDIT 繼續按 #1068 的真正 PIT-A 完整使用資料突破，和 PIT-B 史料工程，不需要因方案 C 重做已成功的 61 日原始來源檔。
