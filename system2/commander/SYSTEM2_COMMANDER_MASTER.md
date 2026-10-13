# System 2｜跨工作室總指揮 V0.1

**正式主控台：[Issue #1229](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1229)**

## 使用者說「開始執行」時的真實動作

總指揮聊天代理使用已連線的 GitHub，於主控 Issue #1229 留下完整原文 `開始執行`。GitHub Actions `.github/workflows/system2-commander-dispatch.yml` 收到 **repo owner** 在該**唯一** Issue 的留言後，讀取最新 `main`，驗證 14 項 DAG，建立必要且未重複的各工作室 Issues，並在主控台留下本次 Run、版本、工單列表與 BLOCKED 的原因。使用者不必一間一間貼提示詞。這個 GitHub 指揮管道**不是** ChatGPT 跨聊天室的遠端喚醒 API；無法證明工作室聊天實例在 GitHub 建單時自動開始對話，不能虛報。

操作替代方式：repo owner 直接在 Issue #1229 留 `開始執行` 或 `/s2 start`；`/s2 status` 只回報不新增任務；GitHub Actions Run workflow 也有 start/status。GitHub Schedule 工作日台北 **10:20、18:20** 自動檢查並續派，GitHub schedule 允許延遲。這個排程 **與 Cloudflare 共振 Cron 完全無關**。

## 分工、依賴與量化

唯一 DAG：`system2/commander/dispatch_plan_v0_1.json`，M01–M14；已有真正工作單 Issue #1068（歷史）、#1128（搬遷總控）、#1132（每日選股）不得重複當新項目。每次最多建立 **8** 個工作單，每工作室最多 **2** 個尚未接受的任務，其餘進入待派發。總指揮按照優先序派工；主控單保留完整結果，可查證並防重複。

- DATA：System 2｜歷史資料工程室，原 D1 分批由既有單 Writer 排程處理、舊 R2 與營運資料盤點。
- CLOUD：System 2｜Cloudflare 跨帳戶驗證室，停用版 Worker、D1、Secrets、HTTP、Cron 切換、安全監控。
- BUILD：System 2｜建置總控室，正式每日選股、Frozen、有限股池共振、通知。
- REMEDIATION：System 2｜補強修復室，Cloudflare/GitHub 帳戶路由隔離、共用目的端 D1 Writer 配額和併發安全。
- AUDIT：System 2｜獨立稽核顧問室，獨立原始 Cloudflare、Run、Job、Artifact、SHA 驗收，不得由施工室自宣 PASS。

**每個 GitHub issue 並不等於已讓另一間 ChatGPT 聊天室執行。** 已連接 GitHub 的 Work/Codex/工作室在其執行環境可讀各自的正式工單、處理程式、提交 PR；GitHub 本身可持續派工與驗收追蹤。如果未來取得有文件且實際驗證過的 Codex 雲端 task dispatch 權限，再用獨立 PR 加入自動啟動執行代理，而不是假稱已有跨聊天室控制 API。無需為此申請新 OpenAI API Key 或付費服務。

## 驗收／授權

CI SUCCESS、Issue 已關閉、初步 580 檔價量觀察都不能算完成。工單只有在已獨立下載/驗證原始 Run/Job/Artifact/內容雜湊，且 repo owner 留下 `[S2CMD-INDEPENDENT-AUDIT-PASS Mnn]`、指定 Run URL、Artifact ID、64 碼 SHA-256、加上 `s2cmd:audited-pass` label 並關閉工單時，才被 dispatcher 視為通過後續的派工依賴。**自動化只是核對此簽核格式，並不取代人工獨立驗證實體內容。**

M05 新帳戶 **Cron 切換** 即使所有先修實體關卡接受，還要 repo owner 在主控台獨立留下完整 `[S2CMD-OWNER-LIVE-APPROVAL M05]` 才會建立**切換工單**；本 Actions 本身永不執行 Cloudflare 寫入。M14 等所有先修工單獨立驗收後才派給稽核。

永久保護 System 1 `fugle-test`、四組 Cron、Formal Core、V7_DB／STOCKS_KV、持倉、交易訊號、正式監控；來源 S2 Cron 保持 0。歷史 D1 Writer 維持原受權獨立排程，免費層單一帳戶寫入操作需遵守使用者設定的 **80,000 計費 rows_written / UTC 日**上限及真實原子 ledger；本指揮器沒有 Cloudflare credentials，也不能啟動新 Shadow、R2、收費或 Secret 擴權。

## 其他控制限制

GitHub Actions 需要 scoped `GITHUB_TOKEN` `issues:write` 建立工單和標籤，`contents:read` 讀正式 source；不需要 Secrets、Cloudflare 權限、OpenAI API Key、付費訂閱。真正讓 Codex/Work 自動接手還需要已設置/可驗證的 Agent 工作環境，這是下一階段功能而不是本版已完成。所有異常一律 fail-closed，保持主控台既有證據不改寫。
