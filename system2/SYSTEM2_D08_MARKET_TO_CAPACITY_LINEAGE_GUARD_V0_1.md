# D08｜雙市場母體 → 策略評估 → 候選容量一致性檢核 V0.1

**狀態：** BUILD_LANE / RESEARCH-ONLY / FAIL-CLOSED / NOT DEPLOYED。

本模組 `system2/runtime/d08_capacity_universe_lineage_gate_v0_1.mjs` 是現有 D07 雙市場來源驗證與 `daily_shadow_capacity_orchestrator_v0_1.mjs` 之間的獨立唯讀交叉稽核，不會修改既有容量引擎或對 D1/R2 讀寫。它禁止把來源不完整的策略批次當成真正的「零入選日」。

### 防護條件

- 對相同 marketDate / decisionTimestamp 重新執行 D07 全母體來源雜湊、TWSE/TPEx 兩市場最低覆蓋與日內 PIT 檢查；若 D07 已 BLOCKED，D08 不可能通關。
- **每個策略版本**皆應覆蓋同一份 A1 完整當日股票母體：每隻股票要有且僅有一筆正式研究評估，或明確的排除原因；不允許缺少資料後悄悄縮小排名輸入，亦不允許同一股一邊排除、一邊參與排名。
- 核對每個原始策略 run 的 `orchestrationHash`、`a1BatchHash`、`sourceSessionHash`、執行時間、策略 ID/版本、runReceipt 與 INCOMPLETE 分母，不信任孤立的 `runState=COMPLETE`。
- 核對容量收據 `capacityHash`、selectionDenominator `provenanceHash`、所有 contributing strategy run accounting hashes、候選容量 **全域最多 12，單策略最多 3** 及候選個股是否屬於當日母體。
- 若策略有資料 UNKNOWN／INCOMPLETE、缺少股票評估、來源時點錯誤、雙市場遺失或存在偽造 `CAPACITY_ZERO_PICK_READY`，回傳 `BLOCKED_UNIVERSE_OR_DENOMINATOR`。
- 即使所有**合成測試**完全一致，最高狀態仍是 `RESEARCH_ACCOUNTED_PENDING_PHYSICAL_SOURCE_VERIFICATION`，且 `canonicalZeroPickDay=null`、`zeroPickCertified=false`、`d1WriteAuthorized=false`、`finalSelectionEnabled=false`。
- 本模組不代表已做到官方當日**完整上市櫃股票母體**、PIT 來源實體讀回、有效進場報酬風險比、正式策略 Alpha／因子門檻、D1 寫入原子性或獨立稽核。600/450 僅為最低守門，不等於完整證券清單。

### 測試及下一步

負向測試含：1050 筆（TWSE 600＋TPEx 450）合成雙市場正例、一股漏評、排除與排名雙計數、跨日策略、策略必要資料 INCOMPLETE 卻宣稱 clean-zero、外部代號塞進候選容量、缺少 TPEx 來源及篡改 A1 batch hash。使用真正研究容量建構器驗證合成 `CAPACITY_ZERO_PICK_READY` 仍**不得**升格為正式零入選。

D08 正式 PASS 尚需 B10/B11 真實來源、PIT/NC-T01、D06 完整策略評估、A07 共享 D1 額度、容量實體 D1 原子寫入與讀回，以及 AUDIT_LANE 獨立驗收。程式合併後只能將 D08 標記為 **PARTIAL**。

System 1 V8、Worker/Cron、正式推播、券商下單、資金與付費服務均不改變。
