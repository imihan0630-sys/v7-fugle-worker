# F07 — 唯讀資料庫 Schema 與不可改寫觸發器驗證 V0.1

**目的：** 對將來隔離 System2 D1 執行的 append-only Outcome Archive，提供只透過 `SELECT sqlite_master` 和 `SELECT pragma_table_info(?)` 執行的讀回預檢。此檢查 **不執行遷移、不實際插入、不啟動策略、不授權寫入**。

- 22 個預期欄位、主鍵及 revision hash、(decision_id,lineage_hash,revision_number) 唯一鏈約束。
- 3 個必要查詢索引（decision/lineage、strategy/version、regime）與 2 個 `BEFORE UPDATE/DELETE RAISE(ABORT)` 觸發器均必須存在。
- 成本／PIT／選股認證旗標永遠預設為零且 SQL 中有 `CHECK(flag = 0)`；避免尚未經物理驗證卻被寫成「正式已認證」。
- 新模組 `system2/runtime/f07_outcome_archive_readonly_schema_preflight_v0_1.mjs` 僅可指定 `SYSTEM2_DB`，接受既有 D1 語意的 `prepare(...).bind(...).all()` 讀回介面。缺欄位、索引、觸發器、唯一約束，均回傳 `SCHEMA_MISSING_OR_INCONSISTENT`。
- 離線 CI 會先把 `system2/sql/0011_outcome_revision_archive_staged.sql` 實際套用記憶體 SQLite，測試修改、刪除及重複寫入全部拒絕，再從相同實際 DB 表結構取 `sqlite_master`／`pragma_table_info` 喂給唯讀模組做正反驗證。
- **完全不宣稱 Cloudflare D1 已套用 Schema。** `STRUCTURALLY_MATCHED_READONLY_UNCERTIFIED` 只表示提供的 schema catalog 符合規格。實際獨立資料庫身份、不可變 hash 預檢與來源證據，仍需 A07 額度協調、D1 實體操作和 AUDIT_LANE。

此工程交付計算為 F07 已有離線 Schema/trigger 與 CI 驗證，不增加實體套用／讀回／授權的完成數。無 System1 正式核心、Worker/Cron、交易資金、推播或付費服務更動。
