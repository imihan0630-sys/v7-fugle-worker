# System 2｜免 Work/Codex 額度安全施工 V0.1

此版本在既有 Issue #1229 總指揮之上提供**能真正執行既定檢查程式**的 GitHub Actions 階段，但不是自主 AI 編程。正式工單 #1239 尚不可因本版完成而關閉。

## 自動施工器

- 工作流程：`.github/workflows/system2-commander-safe-executor.yml`
- 本版白名單：M08／Issue #1233（帳戶、Writer/Secret 路由靜態驗證）；M12／Issue #1238（目的端共用 Writer 配額／互斥負面檢驗）
- 對 14 項工作分類：`AUTO_EXECUTABLE`、`AI_REQUIRED`、`APPROVAL_REQUIRED`，由 `safe_job_registry_v0_1.json` 唯一決定。**僅 M08 和 M12**能被 offline Actions 主動執行。
- 觸發：Owner 在 #1229 留「開始執行」或「/s2 start」；GitHub Actions 手動啟動；工作日台北時間 10:35／18:35 安全自動檢查，與指揮系統原本 10:20／18:20 相隔 15 分鐘。
- 本機證據：獨立 Node 22 隔離子程序、固定六條測試指令、靜態原始資料 SHA-256、來源路由／帳戶環境只讀檢查、已知帳戶配額衝突樣本。真實 Run Job Artifact 自 GitHub 原生服務產生。
- 回報：GitHub Provider Artifact ID、GitHub SHA-256 與 Run URL 寫入原工作室 Issues 和主控 Issue #1229；對同一 main/相同結果採證據雜湊去重。**不會自行關閉工單、加入 audited-pass 或啟動下一關。**
- 前置 PR CI：`.github/workflows/system2-commander-safe-ci.yml`，僅 `contents: read`，負面測試及同一批白名單的真實 script subprocess Run。

## 免費與權限

GitHub runner 只擁有內建 `GITHUB_TOKEN` 的 contents:read、actions:read、issues:write，**不掛載任何 Cloudflare/GitHub App/付費 AI Secrets，也不提供寫入程式庫或 PR merge 權限**。各個現有歷史 D1 Writer 和其它 GH workflows 不被觸發或修改。GitHub Actions 自身執行時間、Storage 依現有方案額度計費政策，不能保證無限免費。只有被明確白名單的程式會自動執行。

## 已觀察需優先處理的 M12 風險

`.github/workflows/system2-owner-override-raw-d1-copy-20261012.yml` 的並行群組為 `s2-dest-owner-override-original-raw-copy-only`，而 `.github/workflows/system2-daily-shadow-diagnostic.yml` 的並行群組為 `system2-isolated-d1-writer`。它們**不相同**，因此單靠 GitHub concurrency 並不保證目的端 D1 跨 Workflow 單一 Writer。原 Registry `system2/config/d1_account_writer_registry_v0_1.json` 的範圍也不能自動當作目的端跨作業實體原子鎖。

2026-10-13 原歷史 Writer 71,322 計費列，舊 Shadow 診斷估算需預留 13,130：**71,322+13,130=84,452 > 80,000**，這僅為過去日同時執行的負面情境，不是今天帳戶已用額度。需由補強修復室 #1238 設計兩種可審計的替代方法：共用互斥 Gate（單一跨 workflows concurrency group，但注意 source/destination writer 的帳戶隔離）或資料庫原子帳戶日租約＋即時 D1 累積帳本；生效前暫不接受同日可並行的保證。

## 禁止虛假完成

此 runner 只能給出 `OFFLINE_CHECKS_PASS_NOT_PHYSICAL`、`FINDINGS_REMEDIATION_REQUIRED` 或 `BLOCKED_OFFLINE_TEST_FAILURE`。任何實體 Cloudflare D1/Worker/Cron 0 mutation 不等於 Cloudflare 本身健康，除非另外獲授權讀回取得原始 Provider 證據。本程式不連接 Work/Codex、不能喚醒其他 ChatGPT 聊天室。正式自動 AI 施工閉環仍須經已驗證的工程代理、PR/CI、獨立驗收及權限核准。

不得修改 System 1 V8 Formal Core，保留舊 System 2 Cron=0、來源資料與新帳戶 Shadow 的原有保護。
