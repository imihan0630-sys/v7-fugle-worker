# System 1｜正式選股恢復與選股優化：兩軌驗收 V0.1

建立：2026-10-17（Asia/Taipei）。最新主線來源查核：main；正式 Worker 仍 8.20.2-idempotent-d1-snapshots。
執行分類：研究／原始資料唯讀稽核，**不是**正式 Core 放行、D1 寫入或實盤交易授權。

## 已經證實的根因鏈

1. 2026/10/16 23:35:47 / 23:55:47（台北時間）正式 Cron 原始兩次 `SKIPPED`，原始 detail 均符合 `候選缺當季實際EPS複核(3236,5340,3147,4167,6122)`，不得把 `SKIPPED` 視為無事，也不得視為正式選出 0 檔。證據：[Run 39018028837](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39018028837)。
2. 10/16 相同交易日原始授權 GET `/api/quality-status`（2 次上限、單次 25 秒）成功：INDEX 52、TDCC 2,963（as-of 10/08）、FINANCIAL 1,881、VALUATION 1,967、ANNOUNCEMENTS 130、QUARTER_EPS **9**（as-of 10/16）。數字只能證實該資料集快照存在，**無法證明五個需要的股票就在九筆內**。證據：[Run 39022875387](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39022875387)。
3. 同五股原始 MOPS 2026Q2 + Q1 核對：[Run 39000635978](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39000635978)。**4167、3236、3147、6122** 的 C 表與既有程式原版 EPS 解析均 PASS；**5340** 官方 A-only 個別表存在、原 C-only parser 拒絕。原始 TWSE PDF Q2 EPS 0.54（證據 [Run 39008514300](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39008514300)），但當期 A 報表適用資格與 historical firstKnownAt 未獨立認證。
4. `runAfterMarketScanCore` 只消費同日期 D1 `QUARTER_EPS` stock-map，不會因另一個 GitHub source-only probe 驗出四股就自動補入正式 D1。D1 `writeQualitySnapshot` 目前是整份 `ON CONFLICT ... SET snapshot_json=excluded.snapshot_json`，只傳四股會**覆寫原來九股的整份快照**，禁止當捷徑。
5. **實際已檢查的 CPU 修復**：草稿 PR [#1460](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1460)，完整 V8 75 步重建、時間格式化器只減重複工作、無改 A/B 或 90s/10/15m/D1 lease；既有 no-deploy CI 綠，不代表實際 Cloudflare 10ms 資源問題已消失。

## DATA → AUDIT → BUILD 的正確修復順序

| 環節 | 必須實證 | 刻意不做 |
|---|---|---|
| DATA 1：確認原始 D1 的 9 檔 EPS stock keys | 同日期 v7-live 限定 SELECT、原始 SHA/版本、9 檔涵蓋對照、資料未被其他寫入者變更 | 不接受只靠 aggregate count 推測五檔 |
| DATA 2：四檔原始 C 報表補齊 | 官方原始 Q2+Q1 bytes/SHA、原版生產 parser PASS、來源可取得時點、待寫入 payload；保留九檔同日期內容 | 禁止直接以四股新 packet 整份覆寫 |
| AUDIT：5340 | 2026Q2 個別財報合法適用性、發行人當期有無子公司／持股控制、來源首次可取得時間、報表版本 | 不可將 `REPORT_ID=A` 假裝為 C；不可由現在搜尋回填 10/16 PIT |
| BUILD 1：合併及並發保存 | 官方資料通過後才允許無損合併，同一 D1 row CAS/樂觀鎖、每 symbol 衝突拒絕、嚴格 readback、保留原有九股 | 不改正式打分、排名、配額、持倉與訊號 |
| BUILD 2：盤後運算 CPU | 維持本來 23:35/23:55 Cron、經真實 Cloudflare CPU/失敗率、fallback 和閉市 15m 安全驗收 | 不能把本次 EPS 阻擋混同 CPU 根因 |
| OPS：真正恢復 | 下一個合法交易日完整正規 Formal→D1 parent→KV config→正式每日回報／手機驗收，必須 READBACK；有 0 檔亦需完整成功憑證 | 不重跑歷史商業掃描、不捏造 0、不能只是 GH 研究候選 |

## 選股條件優化（獨立於修復，不互相冒充）

- **近期可先跑、不可交易**：A 拉回 / B 突破的 Short/Swing 改良，沿用 C1/C2 verified paired cohort、研究版支援性基本面與估值、訊號 A/B 僅顯示實際達 B 以上的研究候選、盤中 15 分 K 確認仍為 Formal 必要條件。保持 10 元價格底線、3 千金＋3 非千金不跨池、RR/反末升段與風險規則。
- **不能偷換「優化完成」**：必須測同日舊 Formal vs Shadow 的 after-cost 表現、MFE/MAE、停損先觸及、行情狀態、量縮整理／放量突破、獨立日期集群和實際資金成本；候選變多或單一成功案例不是優化勝出。
- 既有版本 `C2_SHORT_ADMISSION_V0_1` 的正式 Class-C 切換門檻（60 筆 mature D5、30 個完整 prospective、15 個獨立掃描日、2 年與 2 regimes、date-cluster >=70% 等）仍存在；**可立即做研究、不得宣稱已達正式切換門檻**。必要時另請 owner 逐條重新審視門檻合理性，不擅自改核心。
- 非正式候選可以提供研究報表，但不得冒充正式推薦、不得觸發 BUY/ADD/STOP 信號或改實際持倉。

## 可立即複查的工程產物

- [#1461](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1461) 原始 GET-only Cron/D1 品質摘要核對 + source-only 無損補齊計畫 `research/system1_p0_quarter_eps_safe_merge_v0_1.mjs`。源真實數字：9 筆；**8 項新合併反證測試通過**（正向合併、原始資料保留、重複衝突、不同期別、A-only 拒絕、原生 D1 readback 強制）。
- [Run 39023254519](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39023254519)：上述純研究證據與來源保存測試 PASS。該測試使用**合成九股＋四股 fixture**，產物 13 筆僅是示例，**不是**真實 10/16 新 EPS 筆數，也不是任何已寫入的數量。
- [#1463](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1463) 原始 D1 Cron／lease 限定 SELECT 草稿仍為 manual-only，不得默默派發。
- [#1451](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1451) 5340 官方 A-only／TWSE PDF 的合法性與 PIT 研究草稿。

**總狀態：10/16 Formal 未恢復；官方來源四檔已核對；5340 與 D1 正式無損保存及法定時點仍未解除；CPU 候選已離線驗收但未部署；選股改良尚未獲經濟勝出實測。**

本檔不是變更正式 Worker、D1/KV、Cron、3Min、交易或推播的批准文件。
