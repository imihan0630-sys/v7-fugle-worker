# System 1｜原始 V8 選股引擎：僅限 Dry-run 的 EPS 安全隔離接線候選

Owner 2026-10-17 已核准個股 EPS 未驗證隔離作為正式修復候選，但明確要求先 Shadow、回歸及持股保護，沒有批准正式 Worker 立即部署或解除交易限制。

**本分支：Class B review-only／DRAFT PR。** 變更 Worker.js 的 dry-run 實驗路徑，未合併 main、未部署 Cloudflare、未改四項 Cron、D1/KV、3Min、推播或實際持股；沒有歷史業務掃描或買賣。

## 原版 V8 的改造位置與安全閘門

1. 原版 scoreCandidate 全部原封不動；diagnostics.epsReviewUniverse 仍保留隔離前完整初選母群，不刻意掩蓋缺資料股票。
2. 指定 options.epsQuarantineShadow 的選項，必須同時 dryRun=true 且 epsReviewOnly=false 才可能接線；正式非 dry-run 永遠維持原始 EPS 缺失阻擋。
3. 必須先驗原始季度 EPS 整份快照日期、年度、季度、筆數與股票映射，不能把全資料集不完整當成單股問題；兩市場、60 日日K、法人、基本面等原有檢查不變。
4. 原始 scoring 完成後、兩股池各取三名之前，獨立篩掉不符合既有 MOPS C 合併原版解析器、單季 EPS、及前季直接驗證的個股。5340 A 個別報表仍隔離，不以 PDF 數字改成 C。
5. 非千金股使用原本 scored，千金股使用原本 thousandScored；兩套原分數、RR-first comparator、A拉回／B突破、3+3、收盤價底線、15m 正式確認語意不變。
6. preview diagnostics 紀錄初選母群、隔離代號及原因、最後候選，明示 zeroPicksCertified=false；全數隔離絕不當作成功正式零檔。
7. 正式持股、停損、資金、推播與下單無可由此選項啟動的寫入路徑；測試無 Cloudflare Secrets。

## 關聯實證與尚未通過的關卡

- [PR #1490](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1490) 已有 66 項隔離／持股及 49 項原始 V8 排名／流程的離線斷言成功；並非真實 D1 時點與正式來源接受。
- 本分支另設原始 Worker dry-run 嚴格關閉預設，及單元測試。新 PR 的 exact-head CI / V8 Regression / Repair / C1/C2 需獨立驗證，不得先宣稱全數成功。
- 待驗 [PR #1489](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1489) 原始 D1 九檔逐股資料、5340 法定 A-only 及 PIT、同日原版與隔離版真實唯讀 paired scan、Cloudflare 真實 CPU、正常交易日 Formal parent→KV→每日通知。
- 同日真實來源尚無法完整回放時，必須明標 UNKNOWN；不能從後來找到的 EPS 當作 10/16 當時已存在，或將研究 dry-run 當成真實正式復原。

**持續接點：** 審閱本 DRAFT 的 exact-head CI、資源與保持原始 Formal 等價性；直到獨立 AUDIT + owner 逐 PR 核准部署，任何正式業務系統與持倉皆保持不變。
