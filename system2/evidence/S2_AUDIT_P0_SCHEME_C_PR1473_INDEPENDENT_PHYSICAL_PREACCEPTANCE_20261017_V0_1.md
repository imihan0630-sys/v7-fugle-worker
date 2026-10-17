# System 2 AUDIT｜P0 Scheme C 每日研究候選 PR #1473 獨立實體預驗收 V0.1

- 稽核日期：2026-10-17 Asia/Taipei；正式 main 開始稽核當下 SHA：`d640a7580002eb108bf7012d9923790b2c9e639d`。
- 主責：AUDIT_LANE / Issue #1127，關聯 BUILD #1132、DATA #1068。Class A **獨立稽核證據而非主程式修改／上線**。
- 依據：使用者已核准 `system2/SYSTEM2_DAILY_NONPIT_THREE_STAGE_LAUNCH_OWNER_DIRECTIVE_V1_0.md` 與 Scheme C 三層產品契約；PR [#1473](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1473) 2026-10-17 09:33:06 UTC 合併 commit `972dc4822b59ab690040029b6936ead4844018fe`。
- 結論：**PR #1473 的實際真實 10/16 原始來源→具名非 PIT 研究報告、快照封存 PREACCEPTED_SCOPED_PASS。下一新交易日的自然 SOURCE→AUDIT→Scheme C Consumer 交付則 UNKNOWN/NOT YET PHYSICALLY ACCEPTED。** 不得把歷史 PR replay 當自然每日運作，亦非正式 Stage1／PIT-A／PIT-B／Frozen／Shadow／交易授權。

## 一、稽核直接存取的原始 GitHub 外部實體證據

| 區塊 | GitHub Run / 原生 Artifact ID | 稽核者重新下載原始 ZIP 實際 SHA256 | 核對結果 |
|---|---|---|---|
| 10/16 官方 A1 原始 61 個交易日、兩市場 raw .json.gz | SOURCE [#38934081985](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38934081985) / #12060640574 | `9a4cc56839b975385f052b7e804211994136c5e9db59bdf645e6198b29e2fe97` | PASS，122 原始 JSON 全部重新解壓／逐份原始 bytes SHA256／native payload date / stat 核對 |
| 原始 SOURCE 獨立稽核 + 當日價量預覽 | AUDIT [#38934321405](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38934321405) / #12060227504 | `84895faa60374370a6588801e9c99e1f56b58acbda42b8f866d467184c60f560` | PASS，independent audit hash 與後續 Scheme C 完全相同 |
| SOURCE event 原始雙時鐘 | AUDIT #38934321405 / #12058994846 | `c9d8456f2005874270954e32f98c0b03e206a6fcb40966d61bc1c160a5a92663` | 10/16 SOURCE 為真 `schedule`，**實際啟動延遲 267.667 分鐘**，沒有 23:45 準時交付 |
| 實際 PR #1473 10/16 report + SHA + 30 檔具名股票 + create-once research snapshot | Scheme C [#39021442273](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39021442273) / #12097420201 | `a3448afb6e9c3c9c3ae575f0c028020f7d5d4738a34760b8d2002a5a60ce0c0b` | PASS，original ZIP includes seven derived files |
| 同 PR 10/13 歷史負例／回放 | Scheme C #39021442273 / #12097445272 | `8a57ba5d462d332121f2363b074de19ad4763b1f2e05217e411d93c83e704261` | PASS，10/13 與 10/16 **不混日期**；仍 PR-only |

下載 ZIP 時，獨立比對 SHA256 為 GitHub 原生 Artifact digest。SHA 比對並非僅相信 BUILD 文字敘述。

### 真實 10/16 61-day 原始來源核對

- `shared-official-a1-manifest.json` 原始 SOURCE `effectiveTradingDay=2026-10-16`；交易日曆為真實列示 **61 個交易日**（2026-07-21—2026-10-16），來源原始 JSON **122 個 market/date blobs**，TWSE=61 / TPEx=61。
- 實際逐一 `gzip.decompress(blob)`；對各原始 bytes 計算 SHA256 與 manifest `originalSha256`、`originalBytes` 比對；全部 122/122 一致，失敗 0。
- 每個 JSON 原始 payload 根 `date` 均等於各來源描述日期的 `YYYYMMDD`，`stat`（大小寫標準化）均為 `ok`：**122/122** 一致。所列源網址分別是 TWSE MI_INDEX 與 TPEx dailyQuotes；驗證的是封存原始 provider payload／URL 語意與元資料，**不是稽核當下額外重抓官方 API、也不是證明 2017 至今的全歷史 PIT**。
- SOURCE manifest 的 `originalOfficialProvenanceHash=fbe36631c4f83c1f86bcd4efa7bbe92516c8031971803fadd9368f3ad9b5381f`；獨立 audit `auditHash=e5c4a283ad25a9a5eea30ebcb0a8ffb0f9c94151c0f94602fe16447db117e84b`。以上與原始 AUDIT source receipt、原始 preview、BUILD handoff 10/16 及 create-only research snapshot 一致。
- SOURCE **原始大檔只保留至 2026-10-23T16:44:24Z**；AUDIT 原始快照也將於 2026-10-23T16:45:33Z 過期。這是尚未消除的**長期獨立重現風險**，但不能變成 P0 研究名單展示新閘門。DATA #1068 保留及交接來源策略。

## 二、P0 八項獨立驗收狀態（每個 PASS 均限定實際觀察範圍）

| 使用者要求 | 本輪狀態 | 稽核實證 / 邊界 |
|---|---|---|
| 1. TWSE/TPEx 原始日期和真實性 | **PASS（10/16 原始封存）** | 61 交易日、TWSE+TPEx 每日原始 date/OK/bytes hash 完整；並非驗證明日自然推播 |
| 2. 61 日資料／欄位／SHA | **PASS（歷史來源完整性）** | 122/122 gzip+SHA+原始 JSON，manifest、audit、preview SHA 閉環；正式 61-factor 可用時點認證不在 P0 |
| 3. 自然排程、manual、LATE 區分 | **PASS（PR-only / SOURCE-schedule-晚到負例）／UNKNOWN（實際新 T 的自然 Consumer 與 manual）** | SOURCE 真正 10/16 event=schedule、267.667 分晚到；本次 Scheme C `event=pull_request`，`PR_HISTORICAL_REPLAY_ONLY`；不得驗收全自然 |
| 4. Scheme C 同 T 真來源 | **PASS（10/16）** | SOURCE/AUDIT/handoff/acceptance/visible report/snapshot 全部 T=2026-10-16，Run IDs 與多層來源 SHA 交叉核對 |
| 5. 具名股票／模型／條件／警告 | **PASS（10/16 可讀報告）** | `PRELIMINARY_DAILY_PRICE_VOLUME`，`PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_2`；close>raw SMA20、5 日原始報酬正、量及成交值正；30 個不同 market/symbol 的中文名稱、交易日、條件、狀態、CA/Class/Regime/Late 警示 |
| 6. 來源分母／符合／顯示 | **PASS（10/16 四碼來源範圍）** | source-four-digit=**1,972**；描述符合=**519**；顯示=**30**；逐層比對 report／handoff／observation／acceptance；**不是 1,972 個已獨立確認普通股**，也非正式 Top30 |
| 7. 真實 report/Artifact/SHA/到期 | **PASS（PR 原生保留）** | Run #39021442273 ZIP #12097420201 七檔含 Markdown、acceptance、origin、native-join、meta、JSON report、create-once observation；原生 Artifact 到期 `2026-11-16T09:31:34Z`，30 天；研究 observation `actualReportGeneratedAtUtc=2026-10-17T09:31:33.957Z`，報告 SHA `eeb49389f9479fa4582165ff2a730875609e367d410da5dce2eb29038bee8189`，snapshot SHA `f6bb7f56da10ccc3a2ce61deaee4ba6009cb8212a7adbfc24d17d79b5906eea7` |
| 8. 未把研究冒充正式選股／回測／零檔 | **PASS（PR 實體輸出）** | 10/16 `deliveryMode=PR_HISTORICAL_REPLAY_ONLY`，`lateSource=true`，`pitACertified=false`、`pitBCertified=false`、`selectedCount=null`、`zeroPickDay=null`、`frozenD1Written=false`、`officialStrategyScore=null`，未生成 BUY 或資金指示 |

**PR #1473 開發階段 Run #39021442273 是 `pull_request`，不是 10/19 實際市場日，也不是 `workflow_run` 自然交付；即使原始 SOURCE 10/16 確實 schedule，也不能借用其旗標替 BUILD consumer 取得自然成功。**

## 三、直接從 Artifact 重算的獨立細節

- 對 10/16、10/13 兩個 PR Artifact：使用程式實際 `decision_archive.mjs` 的鍵名排序 JSON canonical SHA256 語意重新計算 `receiptHash` / `deliveryOriginHash` / `acceptanceHash` / `snapshotHash`，**全數一致**。
- 報告 Markdown 真實檔案含結尾換行；按 BUILD 對報告輸入的 `remove exactly one final newline` 規則，分別計算原始報告 SHA：**10/16=eeb49389f9479fa4582165ff2a730875609e367d410da5dce2eb29038bee8189**；10/13=e871bc373597e517950a9b0efe06d82cfa917420a645c1b1f23c46363051a8d1；均符合 meta 與 observation，無需刪去所有換行或改寫原始檔案。
- 10/16 快照每一筆 30 名稱可在真實 Markdown 找到，market/symbol 無重複，來源市場與 T 相同，`aboveRawSma20=true` 且 `relativePriceFiveSessionsPct>0`，無正式訊號、策略總分。包含 3287 廣寰科的 `KNOWN_POSITIVE_CA_SOURCE_EVENT_REVIEW_REQUIRED` 風險標記；不得把 RAW 未調整跨除息價位視為正式突破策略證據。
- 10/13 獨立區分分母 1,974／描述符合 580／顯示 30、`PR_HISTORICAL_REPLAY_ONLY`，不混用 10/16 的分母和現行日期。
- GitHub PR head `f69ce4cb2f0a8fad9e11f9890ad23cd0855a45ea` 的 Scheme C 真實 PR-only `build_preview_from_existing_audit` 和 `verify_real_20261016_single_audit_zip`、Research CI、V8 Regression、Writer Census 均實際 SUCCESS；這是工程建置與實體歷史回放 PASS，不等於預先核准未來 T 的真實交付。

## 四、下一交易日獨立實體驗收待辦

新交易日預期 **2026-10-19（週一，仍以官方日曆與真實交易為準）**，獨立稽核 status: `P0_NEXT_TRADING_DAY_NATURAL_DELIVERY_UNKNOWN`，**不推定 SOURCE、AUDIT 或 Consumer 新 T 已有資料**。

- DATA_LANE #1068：確保新的 T 原始 GitHub SOURCE run/event/attempt/provider 日期，61 日 TWSE/TPEx 原始 122/122 及原始 SHA/官方日曆，提供獨立原始稽核 Run/Artifact、late/source-not-ready 訊息，不重抓先前已保存的原始資料。
- BUILD_LANE #1132：自然 audit→Consumer 真實新 T Run/Artifact（或另標 `MANUAL_RECOVERY`）；具名研究模型/股票/風險/來源分母、一致的 reported generation timestamp，optional snapshot 失敗**不得掩蓋已驗真實報告**；保持正式選股未認證。
- AUDIT_LANE #1127：在新 T 實際 Artifact 可用後重新下載原始 SOURCE/AUDIT／Consumer，逐一比對原始 SHA、同市場日期、原始事件時鐘、原生 Run ID、具名 30 或合法來源已驗 0 描述符合、來源不足與假 0 的區別、原始 Artifact expiry；**只對新 T 的實體結果作本日獨立判定**。
- PIT-A / PIT-B 各自獨立稽核，不作為 NON_PIT_PREVIEW 啟動條件；沒有擅自放寬 Stage1、Frozen、D1 配額、正式交易或 System1 V8 Formal Core。

**AUDIT FINAL CURRENT STATUS：`SCOPED_P0_20261016_SOURCE_AND_HISTORICAL_PR_PREVIEW_PASS`；`P0_NEXT_T_NATURAL_DELIVERY_PENDING_UNKNOWN`；`PIT_A/PIT_B/FORMAL/SHADOW/FROZEN_NOT_CERTIFIED`。** 不可由 BUILD 自產交付報告便自行宣稱獨立實體驗收；本 AUDIT 已另外取回 GitHub 原始 artifacts 並重算 122 原生哈希及交付 leaf hashes。
