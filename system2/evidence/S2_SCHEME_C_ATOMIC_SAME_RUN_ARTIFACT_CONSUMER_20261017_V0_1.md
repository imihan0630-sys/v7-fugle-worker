# System 2 Scheme C｜正式每日來源接線單一 Artifact 原子讀取（BUILD）

日期：2026-10-17 Asia/Taipei  
層級：BUILD Class A／研究預覽唯讀效率與來源一致性。DATA 的原始來源、稽核權限、PIT-A/PIT-B 判定及 System1 V8 皆保持獨立。

## 查出的工程缺口

前版 `.github/workflows/system2-scheme-c-daily-audit-preview-consumer.yml` 對正式 `workflow_run` 事件執行兩次 `actions/download-artifact@v4`，都指向**完全相同的上游 A1 獨立來源稽核 Run ID、完全相同的 Artifact 名稱**。這不是市場 API 請求，而是 **額外 GitHub API/ZIP download/解壓**，使原子來源交接多一個額外失敗點。SOURCE audit 上游已把 `audit-receipt.json` 和 `preliminary-pv-watch.json` 一起封入其唯一 source-only Artifact，所以讀兩次無意義。

## BUILD-only 低風險更正

- 正式新交易日 `workflow_run`：保留 **一次**由原 workflow_run.id 精確綁定的 native Audit Artifact GET；`PREVIEW_DIR` 改用與 audit receipt **同一個實體解壓目錄**。兩份簽章收據在下游依既有 `scheme_c_daily_audit_handoff_v0_1` 再次獨立核對 marketDate、source SHA、audit SHA、官方 122/122、實際 available/observed 時間。
- PR 研究用的 2026-10-13 實體舊來源：當初獨立 audit Run #38469057567 和後來實際生成 V0.2 watch 的 Run #38477169340 是**兩個不同 Run**。僅在 `pull_request` 才允許下載第二份早期 V0.2 Artifact，保留原有固定 lineage / sha / late T+1 physical replay，不假稱這一對是單一原始 source Audit Artifact。
- 完整驗證 ZIP 解壓後 A1 audit receipt 必須存在且唯一，V0.2 watch 也必須存在且唯一，不接受空檔或混資料夾；若任何 hash、時鐘、交易日不一致，繼續 fail-closed / SOURCE_NOT_READY / selectedCount=NULL / 無 Frozen。
- 不新增來源 GET、新 Cron、Cloudflare D1/R2 Writer、價格調整、正式 Strategy rank/BUY/Frozen/Shadow 或任何 System1 V8 生產程式。
- 新增 `system2/tests/scheme_c_actions_summary_visibility_v0_1.test.mjs` 原子同源 / historical replay / native main event 與真實來源 success 條件回歸。

## 判準

PR 專屬真實舊 10/13 Audit/Preview Artifacts 回放及全套 CI 須 PASS，合併 main 之後再 physical readback。下個真正交易日才可由主分支 run 實際確認一個同 run 原始 ZIP 的兩份收據；**PR 物理舊回放不等於 2026-10-19 新交易日運營驗收**。繼續依 #1132 / #1234 / #1068 的 DATA/BUILD/AUDIT 交接。
