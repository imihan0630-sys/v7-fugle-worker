# F08／CORR-012：原子 Compare-and-Swap Outcome 追加寫入契約 V0.1

**BUILD_LANE｜離線程式驗證，未部署實體 Cloudflare D1。**

此模組 `system2/runtime/f08_outcome_atomic_cas_append_plan_v0_1.mjs` 接收已驗證的不可變 Outcome 修訂收據，產生**單一、參數化**的 SQLite `INSERT ... SELECT ... WHERE ... RETURNING` 限制性 SQL 計畫，不直接執行任何 SQL。

## 原子性與防競態

- 原始 `s2_decisions` 的決策雜湊、策略身份、策略版本、股票、日期、決策時點及 Regime 關聯，必須**在同一 INSERT 語句內**對實體父列匹配。
- 原始 `s2_market_regime_snapshots` Regime 雜湊、日期、時點同時驗證。
- Genesis 第 1 筆修訂要求該決策／lineage 尚無任何既存修訂；第 N 筆修訂要求前一版確實存在、版本正好為 N−1、receipt_json/outcome_json 完全相符，且沒有已插入的同級或較高修訂。防止 fork、憑空續接及同版覆寫。
- 數值、版本及 payload 都先使用既有 `verifyS2FrozenOutcomeRevisionV0_1`／`toS2FrozenOutcomeRevisionRowV0_1` 檢查；同一 lineage 的成熟修訂還需通過 `validateMonotonicOutcomeUpdateV0_1`。
- **不使用** `INSERT OR IGNORE`、`REPLACE` 或 `ON CONFLICT DO UPDATE`。返回 0 列只能代表**需要再次獨立核對或拒絕**，絕不可直接當成成功／冪等寫入回執。
- SQLite 兩個不同連線重送同一筆：第一筆確實插入、第二筆返回 0；改掉父決策/Regime Hash、缺上一版、試圖 UPDATE 原始證據都無法通過。測試是本機 SQLite 驗證，**不是 Cloudflare D1 實體競態與真實 quota 驗證**。

## 仍須完成後才能進入真實 D1

1. REMEDIATION_LANE／AUDIT_LANE：A07 已經有 A1～A6 source 修補，但全帳戶 System1 優先 reserve、多寫入者實體 grant/result 尚未獨立驗收，必須 fail closed。
2. BUILD_LANE：未建立、未啟用真正 Cloudflare D1 writer；還缺可核實配額成本、獨立 Schema 讀回、傳輸及隔離身分、受保護的 D1 寫入／寫後全資料讀回、事務誤差處理。
3. AUDIT_LANE：實體 PIT、官方交易日、來源 firstKnownAt、公司行動與不可變版本鏈結的獨立驗收。模擬執行 SHA 不能冒充正式成交。

**量化 15 關卡：** F08-C3 指的是「已授權額度且可用的原子追加寫入器」，本 PR 只完成**離線 CAS 準備**，所以不得把 F08 的 2/5 升為 3/5。全專案 22/75、正式 0/15 也不會因此自動加分。

**安全邊界：** 沒有 System1 Formal Core、V8 訊號、Cloudflare Worker/Cron、正式選股、推播、券商下單、資金或付費方案變更。
