# System 2｜每日選股啟動條件比例性獨立稽核 V0.1

- 稽核日期：2026-10-17 Asia/Taipei。
- GitHub main 稽核基準：`d24f1aa5c1c84fef00d9b91b5a4eda1cff49e6bb`。
- 性質：**AUDIT_LANE / READ-ONLY POLICY REVIEW / 建議清單**；不修改 Stage1、策略版本、正式 Shadow/Frozen/系統一 V8、Cron 或 D1/R2。
- 原則：不得將「每日 NON_PIT_PREVIEW 看得見股票」「策略正式 PIT-A 認證」「PIT-B 歷史回測」「正式 Shadow 訊號/交易」混成一個關卡。
- 現有 Owner 已核准 **Scheme C 三層**：`NON_PIT_PREVIEW`、`PIT_A_PROSPECTIVE`、`PIT_B_HISTORICAL`；本案優先找實際不成比例的 *前置依賴*，而非放寬真實交易證據。

## 一、建議解除／移後／降級警示的非必要前置條件

| ID | 現有範疇 / 稽核判斷 | 所需修正（**僅建議、未實作**） | 適用層／限制 |
| --- | --- | --- | --- |
| L01 | 先完成全部 SOURCE→DEST D1 或 R2、PIT-B 才能開始當日研究選股：**不必要**。 | 排除在當日官方原始市場資料→唯讀研究名單之關鍵路徑外。 | A 預覽；B 的實際必要資料來源另計 |
| L02 | 要求舊年度 issuer CFI 每個歷史有效版本覆蓋 61 日，即使 SHORT_MOMENTUM 只使用 T 當下股票類別：**PIT-A 過度廣泛**。 | 正式 PIT-A 依使用因子檢查 T/cut 的真實普通股身分與交易有效性，僅策略真的使用歷史股票類別時才要求歷史 CFI vintage；保留未知與 TDR 排除。 | A 無需全球歷史 CFI；B 需 Owner Class B/C 策略版本授權 |
| L03 | 全兩市場六 CA source contracts／revision、suspension、authoritative NO_EVENT **全部先完整**，才能讓單一股票接受評估：**PIT-A 證據範圍過廣**。 | 對實際使用的時間窗和特徵索取相關 CA/停復牌事件、事件版本、可用時點；不能默認無事件。已知事件未處理，相關價格特徵仍擋。 | A 候選可加警示；B 需 Owner Class B/C |
| L04 | 上游 Stage1 CA 閘門僅允許 `CLEAR_NO_ACTION`，而下游正式因子 evaluator 已支援 `ADJUSTED_CONTINUITY`：**內部有效准入矛盾**。 | 為有事件股票設立有獨立原始佐證、截至 T 已知的調整價位或可驗證安全排除之**新版**准入；現有 2330 9/16、3287 8/26 除息未有完整 PIT-A，絕不可直接放行。 | B 版本化 Class B/C；不是停用 CA 防線 |
| L05 | 就算只要來源限定的 20 日價量研究初篩，亦要求 61 日 `122/122` 才允許**任何**候選顯示：**對 A 的用途過度嚴格**。 | 既有完整 61 日流水線繼續運作；可在**新增獨立、不冒充原版**的覆蓋受限 20 日預覽中，明示市場／證券／時窗分母、缺失及 `LIMITED_SOURCE_SCOPE`。MA60/ret60、完整全市場排序仍要求足夠的 61 日。 | A 未實作新路徑；B 全市場仍保持原 122/122 |
| L06 | 只有自然 `schedule→workflow_run` 全鏈條完成，才允許使用從已驗真實原始資料導出的候選：**混用自動化 SLA 與資料可讀性**。 | `workflow_dispatch` 人工補跑或晚到 `workflow_run`，只要原始來源／同源簽章一致可顯示 A；狀態 `MANUAL_RECOVERY`／`LATE_SOURCE`，不能宣稱準時自動執行或回填 T23:45。 | A 已有 #1456 / #1464 實作；需要真實下一交易日物理驗收 |
| L07 | 固定 23:45 T 凍結時間若過期即全部無顯示：**只對正式 T 決策適用**。 | 對 A 顯示真實形成時間與 T+1 LATE，決不假裝 T 時已知；B/T Frozen 仍需真實 cutoff 證據。 | A 已允許 late preview；B 不鬆 |
| L08 | 初步研究股票名單必須先完整完成 rank、名額配置、正式 D1 Frozen、6/6 Shadow acceptance：**層級誤用**。 | A 只產生來源限定的具名候選＋理由／日期／風險／來源 SHA；不得稱正式 selected 或策略排序。 | A 可立即運作；B 正式 Shadow/Frozen 仍按階段認證 |
| L09 | D1 帳號 quota/source-account migration 互鎖擋住所有**唯讀報表**：**若有如此路由則不必要**。 | 唯讀 GitHub Artifact / 原始官方資料路徑不向 SOURCE D1 申請 writer reservation；任何 D1 **真正寫入**仍需新帳號身份、每日配額和單 Writer 互鎖。 | 最新 `system2-daily-shadow-diagnostic.yml` 已有 DESTINATION 路由，10/12 舊 SOURCE 錯誤不可當成最新未修復事實；A consumer 自身無 D1 Writer |
| L10 | OOS、滑價、完整成交模擬、歷史績效和所有 14 面向因子完成才允許對人顯示**任何**價量研究候選：**不必要**。 | 依每個研究模型實際因子輸出簡明可審查觀察；禁止績效、BUY、交易建議承諾。策略的正式評級與績效驗證另留 B/C。 | A 可先；B 原策略必需因子不可偷偷刪除 |
| L11 | 全市場股票類別 CFI 缺少便連有來源的四碼**觀察名單**也不能顯示：**對 A 不必要**。 | A 可顯示 `INSTRUMENT_CLASS_UNKNOWN` 並排除已知 TDR/ETF等不適用品種，不得稱「普通股全市場精選」或「可交易」；B 入選須 T/cut 原始類別證據。 | A；B 不鬆 |
| L12 | SHORT_MOMENTUM 的七個觀測因子即使下游某謂詞只讀部分欄位，仍需要全部欄位 known：**可能存在因子冗餘，但不可直接刪除**。 | 維持當前已凍結 7/7；做版本化 used-input dependency graph 和正反差異、UNKNOWN、rank 遷移測試，再由 Owner 決定哪些可降為 context，而非擅改既定策略。 | 先 Class A 稽核，未獲准不得改 B/正式策略 |

## 二、仍應保留的必要防線

1. 官方真實資料、有效 T 日期、來源可追溯 SHA、實際觀察時間、避免未來資料冒用及跨日拼接；即使 A 是「非 PIT」，也不能造假當日行情。
2. 對 **實際用到的資料**採用必要的時點、真實 T 股票身份、可交易狀態、個股 CA/除息等價格可比性。2330 2026-09-16 和 3287 2026-08-26 已知事件不得無調整直接當正常突破。
3. 缺來源資料應表示 UNKNOWN 或 SOURCE_NOT_READY，不得用 0 假裝「今天零檔」，不能假設無企業事件。
4. 「正式 Shadow/投資決策」需要可追溯且 create-only Frozen 真實保存／讀回、策略版本、已核准 rank/capacity/買賣條件；A 的描述性報表不能冒充 B。
5. D1 真實寫入需要新帳號綁定、真實 provider 日計費、重試與索引成本、唯一 Writer；舊來源 System2 Cron 不可偷偷重啟，System 1 Formal Core 不可碰。
6. OOS、成本、成交模擬與多 Regime 穩健度是**正式績效或策略升級**必要條件，不是 A 預覽的前置。

## 三、優先順序與 Owner 決策

- **P0｜已核准 Scheme C / Class A，可不改既有正式 Gate**：建置總控室 #1132 消費實際新市場 T 的單一已稽核 A1 原始報表，顯示具名、來源限定、Late/UNKNOWN 的 `NON_PIT_PREVIEW`；DATA #1068 提供來源；AUDIT 只稽核實體來源與明示分母；不等 G3/G4/PIT-B/OOS/Frozen，也不重抓一份相同資料。先以現有 61-session pipeline 運作，L05 20 日簡化則為後續新路線，不應延誤現有 Preview。
- **P1｜需 Owner 明確 Class B/C 決策**：L02+L03+L04，針對 SHORT_MOMENTUM 使用因子限定的 CFI/CA 准入與 `ADJUSTED_CONTINUITY` 差異，提具體版本、受影響集合、未處理除息反例、對照 OOS/Shadow；未核准不更動既有 Stage1。
- **P2｜審慎研究**：L05 受限 20 日資料 A 預覽、L12 因子 known 冗餘、B 的排名與 Frozen 流程成本效益；不干擾 P0。
- **PIT-B 歷史版次／R2 搬遷／全歷史回測** 持續，但不阻塞 P0。

## 四、目前可證明的狀態，不能過度宣稱

- 已有真正 2026-10-16 官方來源獨立原始 A1 **122/122**，來源限定 **519 筆描述性價量觀察、30 筆顯示**（Scheme C 日報重播）；不是 519 檔正式策略通過或當日 23:45 Frozen。
- 最新方案 C 的 **簽章交付驗收** #1464 已合併；自然來源排程本身與自然 consumer 子鏈實際成功在下一個交易日的證明仍要補。
- PIT-A 對 2026-10-16 的已知 2330/TWSE、3287/TPEX 二檔範例為 **0/2 局部完整認證**，不是全部市場零入選。正式 `selectedCount=null`、`zeroPickDay=null`、Shadow S0–S5 0/6、Frozen D1 0，未獲證據前不得上調。
- Latest shared original `SOURCE_ACCOUNT_SYSTEM1_V8_PROTECTION_QUARANTINE` 仍是舊來源 D1 Writer 隔離；目前目的地 diagnostic workflow 的 `SYSTEM2_D1_ACCOUNT_ROLE=DESTINATION` 已存在。稽核未重新執行真實 target quota request，不宣稱現時每日 Writer 可用或故障消失。

## 五、可核查的正式依據

- [Scheme C Owner decision](../evidence/S2_OWNER_APPROVED_SCHEME_C_THREE_LAYER_SELECTION_20261017_V0_1.md)
- [Scheme C fast launch](../evidence/S2_SCHEME_C_DATA_BUILD_FAST_LAUNCH_HANDOFF_20261017_V0_1.md)
- [七因子／CA／CFI 正式閘門影響研究](../evidence/S2_BUILD_PITA_SEVEN_FACTOR_GATE_IMPACT_REVIEW_20261017_V0_1.md)
- [PIT-A used-input source 修正提案](../migration/PIT_A_USED_INPUT_SCOPE_CORRECTION_PROPOSAL_V0_1.md)
- [Stage1 CA gate](../runtime/stage1_ca_pit_evidence_gate_v0_1.mjs)
- [Stage1 CFI gate](../runtime/stage1_instrument_class_pit_gate_v0_1.mjs)
- [現行每日 Shadow workflow](../../.github/workflows/system2-daily-shadow-diagnostic.yml)
- [Scheme C consumer workflow](../../.github/workflows/system2-scheme-c-daily-audit-preview-consumer.yml)
- [當日真實資料檢驗與 Source clock](../scripts/run_shared_official_a1_stage1_readonly_v0_1.mjs)

**本案僅稽核建議，未移除或放寬任何執行門檻、未修改生產程式。需 Owner 另行明確核准的項目不得藉此文件自動上線。**
