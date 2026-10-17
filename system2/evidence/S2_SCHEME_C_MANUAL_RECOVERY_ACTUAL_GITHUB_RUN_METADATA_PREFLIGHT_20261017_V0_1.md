# Scheme C BUILD｜真實稽核 Run 身分與手動復原驗證（來源零重抓）

2026-10-17｜Asia/Taipei｜Class A research-only.

## 未完的證據缺口

PR #1456 已把「原本上游 A1 稽核 Run 成功，但下游自然 workflow_run 漏送」的手動唯讀補跑流程放到 main，並用 synthetic REST JSON 正反案例測試。但那份 PR **沒有實際查詢 GitHub 存在的原生獨立稽核 Run metadata**，不能單憑 mock 宣稱 manual workflow_dispatch 全路徑可實用。GitHub Actions 真實 API `path`、`head_repository` 形狀必須實體驗證，不可因為回放的 ZIP 成功就宣稱上游身份查驗也成功。

## BUILD-only 最小改進

在 Scheme C **PR 限定**既有「2026-10-16 真正獨立 audit Run #38934321405 / 官方 122/122 同一 ZIP」真實資料回放 Job，先用已有 `GITHUB_TOKEN` 的唯讀 `gh api repos/<repo>/actions/runs/38934321405` 取得**原生** Run metadata，再呼叫與正式手動補跑完全相同的 `validate_scheme_c_manual_recovery_audit_run_readonly_v0_1.mjs` 逐欄驗證 ID、正式 repo/main、`workflow_run` 來源事件、確實的 independent audit Workflow 路徑、SUCCESS/completed 與 source head SHA。**驗證前不能下載 ZIP。**

若 metadata gate PASS，才執行原本 #1449 真實來源同 ZIP SHA/122/122/T/截止/CA/PIT 否認交接和可讀報告回放。這是對 #1456 **真實 GitHub API 容器運行輸入驗證**，不是手動 dispatch 事件本身的實機驗收；仍不可聲稱 10/19 新 T 自動營運成功。

附加 `system2/tests/scheme_c_actions_summary_visibility_v0_1.test.mjs` 反例：保證真實 metadata 原生讀取/validator 先於單 ZIP，且工作只在 PR research 回放、不能引入新排程、Cloudflare、額外行情 GET。

不改 System1 V8 Formal、20:15/23:45/00:15 A1 existing schedule、PIT-A/B admission、任何 Frozen/Shadow/正式信號、D1/R2、推播/下單。已保存的 2026-10-16 Source/Audit exact Run/Artifact 仍作此 PR 唯一原始證據來源。以物理 PR-head full CI + merged main readback 作驗收，DATA #1068 issuer-native CFI/CA/PIT 一樣由 DATA + AUDIT 負責。
