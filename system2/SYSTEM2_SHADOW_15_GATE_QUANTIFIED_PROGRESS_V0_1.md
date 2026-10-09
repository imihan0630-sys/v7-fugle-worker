# System 2｜15 個 Shadow 上線關卡量化進度 V0.1

> 2026-10-09 GitHub main 已合併證據基準。已納入 F07 PR #969、H05-C3 極端成交回歸 PR #973。本表為 **每關 5 個等權二元檢查點**，非工時估計、非選股績效，亦不是 70 項整體平台完成率。

## 總量化

- **15 個關卡 × 5 個檢查點 = 75 項。**
- **有合併程式／測試及正式 GitHub 證據：22 / 75（29.3%）。**
- **尚未取得完成證據：53 / 75（70.7%）。**
- **15 個完整上線關卡正式驗收：0 / 15**；次檢查點全部完成也不自動授權正式啟用。
- **零入選、來源可用性、真實 D1 Schema、股票績效、額度或交易授權**不可從上述百分比直接推導。

## 各關卡數字

| 關卡 | 已完成 | 剩餘 | 檢查點比例 | 整關正式驗收 |
|---|---:|---:|---:|---|
| A07 | **1/5** | 4 | 20% | 未通過 |
| B10 | **1/5** | 4 | 20% | 未通過 |
| B11 | **1/5** | 4 | 20% | 未通過 |
| D06 | **2/5** | 3 | 40% | 未通過 |
| D07 | **2/5** | 3 | 40% | 未通過 |
| D08 | **2/5** | 3 | 40% | 未通過 |
| E05 | **1/5** | 4 | 20% | 未通過 |
| E06 | **1/5** | 4 | 20% | 未通過 |
| E07 | **2/5** | 3 | 40% | 未通過 |
| F07 | **3/5** | 2 | 60% | 未通過 |
| F08 | **2/5** | 3 | 40% | 未通過 |
| H04 | **1/5** | 4 | 20% | 未通過 |
| H05 | **2/5** | 3 | 40% | 未通過 |
| H07 | **1/5** | 4 | 20% | 未通過 |
| H09 | **0/5** | 5 | 0% | 未通過 |

## 75 個檢查點與逐項證據

### A07｜1/5（20%）

- [x] `A07-C1` 共享 D1 額度缺口已登記並指派修復責任 — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/blob/main/system2/SYSTEM2_CORRECTION_QUEUE.json)
- [ ] `A07-C2` System1 優先的跨作業額度預留契約 — 尚未取得完成證據
- [ ] `A07-C3` 各寫入者預留／提交／釋放的原子協調 — 尚未取得完成證據
- [ ] `A07-C4` 超額／並發／中止負向測試全部 PASS — 尚未取得完成證據
- [ ] `A07-C5` 真實 D1 額度計數及獨立讀回 — 尚未取得完成證據

### B10｜1/5（20%）

- [x] `B10-C1` 兩市場最近行情的官方樣本及來源研究證據 — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/blob/main/system2/SYSTEM2_HISTORICAL_DATA_CHECKPOINT.md)
- [ ] `B10-C2` 最新指定日期雙市場 Hot D1 實際筆數回讀 — 尚未取得完成證據
- [ ] `B10-C3` 所有來源原始位元組與 firstKnownAt 證據 — 尚未取得完成證據
- [ ] `B10-C4` 當日官方完整股票母體對帳 — 尚未取得完成證據
- [ ] `B10-C5` 跨 R2/D1/PIT 獨立稽核通過 — 尚未取得完成證據

### B11｜1/5（20%）

- [x] `B11-C1` 官方交易日／NC-T01 連續性阻擋程式與離線測試 — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/blob/main/system2/tests/daily_shadow_nct01_continuity_binding_v0_1.test.mjs)
- [ ] `B11-C2` 最新期間交易所官方完整日期集合讀回 — 尚未取得完成證據
- [ ] `B11-C3` 停復牌、NO_EVENT、公司行動逐股驗證 — 尚未取得完成證據
- [ ] `B11-C4` 來源首次可知時間及連續性實體讀回 — 尚未取得完成證據
- [ ] `B11-C5` 反例與跨市場獨立稽核通過 — 尚未取得完成證據

### D06｜2/5（40%）

- [x] `D06-C1` SHORT_MOMENTUM、SWING_GROWTH 策略版本與必要因子預註冊 — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/blob/main/system2/runtime/strategy_contracts_v0_1.mjs)
- [x] `D06-C2` A1 PIT 因子完整性／UNKNOWN 必要來源攔截，CI PASS — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/pull/960)
- [ ] `D06-C3` RISK.REWARD_RISK 獨立來源及進出場風險驗證 — 尚未取得完成證據
- [ ] `D06-C4` SWING 基本面／產業 PIT 來源接入 — 尚未取得完成證據
- [ ] `D06-C5` 策略參數定版、OOS/Shadow 反證與稽核 — 尚未取得完成證據

### D07｜2/5（40%）

- [x] `D07-C1` TWSE／TPEx A1 股票母體與同日快照適配器 — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/blob/main/system2/runtime/a1_symbol_snapshot_adapter.mjs)
- [x] `D07-C2` 兩市場最低覆蓋、日期、來源雜湊及 PIT 預檢 CI PASS — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/pull/962)
- [ ] `D07-C3` 最新完整雙市場母體實體來源重驗 — 尚未取得完成證據
- [ ] `D07-C4` 經實證的 D06 策略逐股評估完整接入 — 尚未取得完成證據
- [ ] `D07-C5` 前瞻無偷看資料選股輸出與獨立稽核 — 尚未取得完成證據

### D08｜2/5（40%）

- [x] `D08-C1` 容量／排名／分母不可變收據與 12/3 安全上限測試 — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/blob/main/system2/tests/daily_shadow_capacity_orchestrator_v0_1.test.mjs)
- [x] `D08-C2` D07→D08 每股評估／排除／零入選一致性負向 CI PASS — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/pull/965)
- [ ] `D08-C3` 真實全母體與各策略 PIT 評估結果一致 — 尚未取得完成證據
- [ ] `D08-C4` 實體 D1 容量凍結、追加寫入及重讀雜湊 — 尚未取得完成證據
- [ ] `D08-C5` 實體零入選／部分覆蓋／跨市場獨立驗收 — 尚未取得完成證據

### E05｜1/5（20%）

- [x] `E05-C1` 23:45 來源時點 Gate 離線契約與測試 — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/blob/main/system2/runtime/post_market_clock_gate_v0_1.mjs)
- [ ] `E05-C2` 23:45 真正官方來源 PIT 再查 — 尚未取得完成證據
- [ ] `E05-C3` 當日策略及候選母體凍結防偷看連結 — 尚未取得完成證據
- [ ] `E05-C4` 安全派送與持久化完整運作 — 尚未取得完成證據
- [ ] `E05-C5` 真實交易日獨立驗收 — 尚未取得完成證據

### E06｜1/5（20%）

- [x] `E06-C1` 00:15 跨日條件恢復 Gate 離線契約與測試 — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/blob/main/system2/runtime/post_market_clock_gate_v0_1.mjs)
- [ ] `E06-C2` 上一阻擋決策及 SHA 實體親緣驗證 — 尚未取得完成證據
- [ ] `E06-C3` 跨日與下一官方交易日來源再驗證 — 尚未取得完成證據
- [ ] `E06-C4` 合法補查派送、不可覆寫及讀回 — 尚未取得完成證據
- [ ] `E06-C5` 假日／跨年／缺盤負向稽核 — 尚未取得完成證據

### E07｜2/5（40%）

- [x] `E07-C1` 不可變策略決策與 Frozen Snapshot 模組 — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/blob/main/system2/runtime/decision_archive.mjs)
- [x] `E07-C2` 研究 Shadow 每日決策資料結構及凍結哈希測試 — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/blob/main/system2/runtime/limited_shadow_run_assembler_v0_1.mjs)
- [ ] `E07-C3` 真實每日含排除與未知分母候選凍結 — 尚未取得完成證據
- [ ] `E07-C4` 實體 D1 不可回寫存證與回讀 — 尚未取得完成證據
- [ ] `E07-C5` 全交易日與追溯原始來源獨立稽核 — 尚未取得完成證據

### F07｜3/5（60%）

- [x] `F07-C1` 追加式 Outcome 修訂資料表 0011 SQL 已預備 — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/pull/954)
- [x] `F07-C2` 記憶體 SQLite 防 UPDATE／DELETE／重複寫入測試 PASS — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/pull/954)
- [x] `F07-C3` 22 欄、3 索引、2 觸發器的 D1 唯讀結構檢核 CI PASS — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/pull/969)
- [ ] `F07-C4` 獨立 System2 D1 實際 Schema 套用及來源認證讀回 — 尚未取得完成證據
- [ ] `F07-C5` 限額、觸發器、不可變歷史實體獨立驗收 — 尚未取得完成證據

### F08｜2/5（40%）

- [x] `F08-C1` executionHash／成本稅率版本化雜湊鏈測試 PASS — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/pull/951)
- [x] `F08-C2` D1 決策／Regime／前版績效父層唯讀檢查 CI PASS — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/pull/958)
- [ ] `F08-C3` 額度預留的原子追加寫入器及競態防護 — 尚未取得完成證據
- [ ] `F08-C4` 真實 D1 同版／新版本寫入與讀回驗證 — 尚未取得完成證據
- [ ] `F08-C5` 獨立 PIT、成本、來源不可覆寫稽核 — 尚未取得完成證據

### H04｜1/5（20%）

- [x] `H04-C1` CORR-012 成本／績效不可變負向測試已納入 CI — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/pull/954)
- [ ] `H04-C2` AUDIT_LANE 完整獨立對抗性測試 — 尚未取得完成證據
- [ ] `H04-C3` 實體決策／Regime／成本／PIT 父層核對 — 尚未取得完成證據
- [ ] `H04-C4` 正式接受回執與衝突工單解除 — 尚未取得完成證據
- [ ] `H04-C5` Correction Queue 獨立 VERIFIED_CLOSED — 尚未取得完成證據

### H05｜2/5（40%）

- [x] `H05-C1` NO_FILL／未知時序與交易日異常的離線負向測試 — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/blob/main/system2/tests/daily_shadow_nct01_continuity_binding_v0_1.test.mjs)
- [ ] `H05-C2` 官方交易日集合的全期間實體匹配 — 尚未取得完成證據
- [x] `H05-C3` 同根 K 停利停損／停復牌／極端漲跌停反例 — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/pull/973)
- [ ] `H05-C4` 選出／觸發／獲利分母一致性獨立稽核 — 尚未取得完成證據
- [ ] `H05-C5` CORR-013 獨立 VERIFIED_CLOSED — 尚未取得完成證據

### H07｜1/5（20%）

- [x] `H07-C1` Shadow 資料→策略→容量離線分段組裝與 CI — [GitHub 證據](https://github.com/imihan0630-sys/v7-fugle-worker/blob/main/system2/tests/daily_shadow_capacity_orchestrator_v0_1.test.mjs)
- [ ] `H07-C2` 連續多個真實交易日官方資料與策略評估 — 尚未取得完成證據
- [ ] `H07-C3` 每日凍結＋模擬成交＋成本後結果實體入庫 — 尚未取得完成證據
- [ ] `H07-C4` 歷史版本、零入選與盈虧驗收 — 尚未取得完成證據
- [ ] `H07-C5` 完整前瞻 Shadow 端到端獨立簽核 — 尚未取得完成證據

### H09｜0/5（0%）

- [ ] `H09-C1` 保護性啟用清單全部關卡認證收齊 — 尚未取得完成證據
- [ ] `H09-C2` System1 核心隔離及安全監控驗收 — 尚未取得完成證據
- [ ] `H09-C3` 使用者確認首批策略／時段／資源限制 — 尚未取得完成證據
- [ ] `H09-C4` 明確 Shadow go/no-go 授權 — 尚未取得完成證據
- [ ] `H09-C5` 受控啟用後獨立日誌與復原演練 — 尚未取得完成證據

## 研究測試與正式稽核界線

- **H05-C3 本輪 +1 分**：17 個合成極端成交負向情境成功通過 System2 與 V8 測試 ([#973](https://github.com/imihan0630-sys/v7-fugle-worker/pull/973))。但 H05-C2 官方交易日、H05-C4 獲利與未成交分母獨立驗證、H05-C5 工單結案仍待完成。
- F07 離線 Schema 驗證 3/5 不代表已在 Cloudflare D1 套用；F08 仍受 A07 額度協調及實際原子追加寫入限制。
- 每一個勾選項目必須附當前 main 已合併 PR 或檔案證據；任一新成果必須先調整 JSON 機器帳本，再由 CI 重新推導所有百分比，不能手動灌進度。

正式資料來源：`SYSTEM2_SHADOW_15_CRITICAL_GATE_LEDGER_V0_1.json`、`SYSTEM2_CHECKPOINT.md`、`SYSTEM2_CORRECTION_QUEUE.json`。
