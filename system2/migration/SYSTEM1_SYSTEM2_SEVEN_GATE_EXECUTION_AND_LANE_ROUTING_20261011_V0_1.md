# 00 建置總控室｜System 1 × System 2 Cloudflare 跨帳號七大「實體」驗收與分工 V0.1

基準：2026-10-11，`main` `5a17a0c643e0a9d58ae9f2e81614333e6c7e6e60`；每輪續接必須重讀 **當下 main**，不得用這個 SHA 假裝最新。
總工單：[Issue #1128](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1128)；機器矩陣：[`SYSTEM1_SYSTEM2_SEVEN_GATE_PHYSICAL_ACCEPTANCE_20261011_V0_1.json`](SYSTEM1_SYSTEM2_SEVEN_GATE_PHYSICAL_ACCEPTANCE_20261011_V0_1.json)。
分類：Class A（文件／離線唯讀統籌）。正式系統改動必須另循 Class B/C 與獨立授權。**不是**自動發動任何 Cloudflare 流量、SQL、資料搬遷、Worker 或 Cron 切換。

## 已核實且不能誤用的實體基線

1. 原始帳號／新帳號資源唯讀 Run `38027260602`、`38105177481`（含可獨立重算的 GitHub Artifact 原始雜湊）支持來源正常資源與目標帳號分離的 **盤點階段**。新帳號 R2 `403 / code10042` = `NOT_ENTITLED`；不能宣稱 R2 可用。
2. 目的 D1 的已批准一次性 `APPLY_ONCE` Run `38069750915`，真實讀回 Run `38099562997`，獨立 AUDIT_LANE 在 PR #1116 接受 **Schema-only 25/25**：**55 表、63 索引、118 物件完全相符**，另有 Cloudflare 系統保留 `_cf_KV`；Schema v1.1。只允許讀取既有證據，**絕不重跑建表工作**。
3. SOURCE `system2-research` D1 在先前經驗證的唯讀中 `file_size=316,968,960 bytes`，**不是筆數或備份**。SOURCE 的實際套用 Schema、每表資料列、內容雜湊、Frozen／PIT、R2 原始 bytes 與還原驗證，均尚未實體接受。
4. [#1068](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1068) 真實 `main` 安全測試 Run `38108616165` 只證明沒有經授權的原帳號 D1 `rowsRead` 額度保留時，讀取程式會正確 `DEFER`；**不是成功備份**。
5. [CORR-003 #1024/#1026](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1024) 原始物理 `0/5`，支援證據 `15/38`。P01=3/7、P02=3/7、P03=3/8、P04=2/7、P05=4/9。舊帳號 `rowsRead/rowsWritten` 正式保留仍 false/null，無權衍生新核准數值。
6. 新帳號 D1 目前僅 Schema，來源歷史／Frozen 資料搬入 `0`；新帳號 Worker／Cron 觀測 `0`。建立一個不同帳號或空 D1 **不等於** System 1／2 在兩個帳號內獨立運作。

## 七組可量化驗收包

| 編號 | 實體證據範圍 | 主責 | 狀態 | 已通過／驗收分母 |
|---|---|---|---|---|
| G1 | 來源／目的帳號身份、D1／Worker Bindings／KV／R2／Cron 的**遷移前**資源唯讀盤點 | 跨帳戶驗證 | **PASS：限前置盤點** | 跨帳號前後 2／2 來源資料受獨立稽核；路由切換屬 G6 |
| G2 | 目的 D1 **Schema-only** 原始執行、完整名稱、索引、版本、獨立複驗 | 跨帳戶驗證＋獨立稽核 | **PASS：限空 Schema** | 25／25；55／55 表、63／63 索引 |
| G3 | 來源 D1 全表筆數＋雜湊＋備份可還原、PIT／Frozen、R2 bytes | 歷史資料工程室 | **BLOCKED** | 四大來源實體證據家族 0／4；列數分母 UNKNOWN |
| G4 | 真正目的 D1 資料搬入、Frozen 保持、R2／備份還原、逐表比對 | 歷史資料工程室＋跨帳戶驗證 | **BLOCKED** | 已驗證搬入資料列 0；來源應搬筆數 UNKNOWN |
| G5 | System1 原帳號 D1 額度保留、23:35／條件式 23:55 真實持久化、CORR-003 | System1 建置總控室＋補強修復室 | **BLOCKED** | 實體 P01–P05 0／5；支援 15／38；Hot Scout 0／36、Full 0／11,843 |
| G6 | 新帳號 Worker D1 Binding／Cron／URL、單一 active S2 writer，S1 完全不受影響 | 跨帳戶驗證＋建置總控室 | **BLOCKED** | 新帳號 Worker 0，Cron 0；實體切換未授權 |
| G7 | 七關獨立稽核＋正式風險決策、回滾、實際雙帳號配額與營運驗證 | 獨立稽核顧問室 | **BLOCKED** | 最終雙帳號獨立營運 0／1 |

**七關彙總**：2 PASS（限定前置階段）、0 PENDING、5 BLOCKED、0 FAIL。**最終兩套各自獨立活躍 0/1**。這個七關矩陣是新管理包，不取代正式遷移原有的 **13 個依序執行條件**、System2 Shadow 15 門檻或 CORR-003 的 19 原始判準。

## 平行派工，不偽裝成跨聊天室直接執行

**Cloudflare 跨帳戶驗證工程室（G1、G2、G6）**
- 只需重用 C19/C21、Issue #1103 和 #1116 的真實唯讀收據；做 source/dest D1、Worker、bindings、Cron、KV、R2、路由及 GitHub Deployment Environment 安全差異表。
- 以最新 main 核對 destination-only **Cron Disabled** staging 規格、原帳號 S2 Cron 的遷移閘、帳號別額度，不可把共帳號 gate 直接改一個 ID 後當成正確。
- 新帳號 Worker 尚未正式建置，不能憑來源程式碼、mock smoke 或 Schema PASS 宣告 G6。未獲所有依賴核准前只准離線實作。**不可重跑 #38069750915**。

**歷史資料工程室（G3、G4、G5-P03/P05）**
- 主工單 #1068、#1026；沿用 PR #1124 未合併的離線 restore／PIT frozen-cut crosswalk 工具，避免主檔衝突。
- 仍有安全工作：離線 SQLite 備份可還原測試、原始 D1 manifest 規格、每表資料 canonical SHA 算法、第一個 `availableAt/firstKnownAt` 截止與 Frozen append-only 反證。
- 真實來源 D1 SQL 必須先取得經證明的帳戶 read headroom、System1 read reserve、P0 保留、lag/no collision；否則輸出 `READ_ONLY_D1_BUDGET_EVIDENCE_DEFER`，轉做其他離線工作。不能因為想做 36-key Scout，就繞過限制。

**System1 建置總控室（G5）**
- #1024／PR #1121：保存十二筆時間欄位不可變原始 Run；**使用新正確台北時間更正收據**，不可再引用原錯誤衍生欄位。
- 在真正自然交易日後記錄 23:35 和實際觸發的 23:55 的個別計費、整個 UTC 配額日、重試／失敗成本；KV／D1／C1 同一 Generation＋真正 D1 持久化讀回、source deployed hash；現有 CI／成功 Lease 均不得代替。
- 下個自然候選 `2026-10-12 23:35 Asia/Taipei`；`23:55` 僅實際觸發才算；須核對官方交易日與當日實際執行情況，絕不人工補掃或修改 Formal Core。

**補強修復室（G5 CORR-003＋共同禁繞規則）**
- 在 #1024/#1026 與 PR #1122 既有證據匯流；同一份原始 Run/Job/ZIP 的 scope hash／時間語意固定，對帳多 writer ledger 不得多算；跨帳號新 schema 不可沖銷舊帳號配額。
- 維持 19 個原始驗收項、5 個物理關與 38 個支援檢查獨立計數。只有 AUDIT_LANE 才有權由 `HIGH/VERIFYING` 升級。

**獨立稽核顧問室（G1～G7 物理最終決定）**
- 以 #1127 及原獨立稽核證據為起點，**只追加新驗收表**，不覆蓋已簽 Schema-only 25/25。
- 原始資料在 GitHub Artifact ZIP 中可直接讀取時，重算 ZIP SHA／子檔 SHA／真正 source-physical schema data hash；若只拿到檔案清單或 mock，保持 UNKNOWN，不給 PASS。
- 每個關卡 PASS 必有 `provider source / runId / jobId / artifactId / exact SHA / UTC / Taipei / source account role / source-dest scope / actual test / independent result`。有正式停損點時明寫 fail-closed，不能進行下一個有破壞性的切換。

## 目前已確認的關鍵阻塞、允許的工作

- **B01**：System1 舊帳號讀／寫保留 false/null，且 D1 analytics freshness／所有 writers 尚未核准；影響 G3/G5。
- **B02**：來源 D1 原始全表一致性備份、逐表雜湊、還原、Frozen／PIT 和 R2 bytes 未驗；影響 G3/G4。
- **B03**：新帳號 R2 403/10042，任何付費或另採 D1-only 歷史保留設計均需單獨決策；影響 G4。
- **B04**：尚無真實新帳號 Worker Binding/Cron 和原帳號 S2 Cron 受控關閉／不得雙寫證據；影響 G6/G7。
- **B05**：CORR-003 P01–P05 0/5 實體受認證，未取得日後自然盤後 C1 同世代完整鏈；影響 G5/G7。
- **B06**：資料寫入、Cron 切換、切流及最終來源清理尚未經 separate owner authorization；影響 G4/G6/G7。

**可立刻持續**：重查 GitHub main／原始 CI與 Artifact metadata；已有核准的 Cloudflare metadata GET；離線源端 manifest 和恢復驗證工具；靜態 Binding/Cron 風險矩陣；PR 之間的衝突檢查；原稽核 ZIP 能合法取得時的 hash 比對。每個工作室採隔離分支＋PR＋CI＋原始證據；總控室只負責路由，不可代 AUDIT_LANE 宣告實體 PASS。

## 正式核准、切換與退役紅線

任何 Cloudflare mutation（新增／搬入資料、開啟新帳號 R2、Worker deployment、Cron/route 切換）、GitHub secret 權限變更、source R2/D1 清理、可能影響 System1 V8 的改動，皆不在本輪許可。正式申請另依治理、最新主檔、成本/回滾、PIT/Frozen 恢復與獨立稽核走關卡。Rollback 不得覆寫不可變決策；只可根據核准的切流狀態機恢復單一 writer，保留舊資料至額外來源清理核准。

## 與其他 PR/issue 並行安全邊界

- Producer [PR #1121](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1121)：時間戳更正和 10/12 自然會話規格，**未合併**。
- Remediation [PR #1122](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1122)：CORR-003 事證匯流，**未合併**。
- DATA [PR #1124](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1124)：實體回復與 PIT 防偷看離線框架，**未合併**。
- AUDIT [PR #1127](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1127)：獨立實體否決與舊證據核查，**未合併**。
- 不與以上不同工作室共改相同 checkpoint 或 code。改成新增 `system2/migration/SYSTEM1_SYSTEM2_SEVEN_GATE_...` 獨立總控文件，避免並行覆寫。

**續接精確步驟**：讀最新 main → 依五個工作室之 Issue／PR 找未合併／已更新收據 → 實體證據核對並附 original source → 更新七關狀態與分母／原因 → 原主責提交且 AUDIT 獨立判定 → 依正式授權擇下一關。任何一次 CI PASS 只能說驗收矩陣的機器 guard PASS，不是 Cloudflare 搬遷 PASS。
