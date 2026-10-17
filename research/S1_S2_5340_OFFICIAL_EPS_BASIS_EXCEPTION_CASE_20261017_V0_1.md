# System1 × System2｜5340 官方財報格式例外與個別/個體報表適用性查證 V0.1

- 查證日期：2026-10-17 Asia/Taipei
- 證據級別：**REAL_OFFICIAL_SOURCE_A_ORIGINAL_OBSERVED / HISTORIC_ISSUER_BASIS_SUPPORT / CURRENT_2026_Q2_LEGAL_APPLICABILITY_STILL_UNVERIFIED**
- 狀態：**research/source-only; formal A/B/Top6, System2 PIT/Frozen 不得自動放行**
- 共同派工：[#1446](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1446)
- 發現於 System1：[draft #1443](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1443)
- 共用純驗證器：[draft #1450](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1450)

## 一、已完成實際物理來源讀取：不是搜尋摘要推測

| 公司 | 2026Q2 | 2026Q1 | 原版 C-only parser |
|---|---|---|---|
| 3147 | MOPS REPORT_ID=C / 合併綜合損益表 | C | PASS |
| 3236 | C | C | PASS |
| 4167 | C | C | PASS |
| 6122 | C | C | PASS |
| **5340 建榮** | **MOPS REPORT_ID=A / 個體綜合損益表** | **A / 個體綜合損益表** | **REJECTED by original C-only predicate** |

物理原始來源（GitHub Runner 對 MOPS 公開表單的唯讀取證）：
- [五檔兩季 Run 39000635978](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39000635978)
- [5340 再次獨立識別 Run 39000827857](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39000827857)
- 5340 Q2 原始 MOPS HTML SHA256：`c8b8d9f6fa2d26c6f588b14052a73a0e7442f4598a8ebedaf6ba1108c30e58ac`
- 5340 Q1 原始 MOPS HTML SHA256：`fca217ca6a1c4586f268bec4c718cd44835fb9381d5f7dc37d92fd3b0d06`

以上原始內容 hash 只是識別，**不是** PIT 首次公布時間證明、個別報表適用性證明或正式選股結果。

## 二、網路搜尋找到獨立的發行人官方線索與法規

1. **發行人官網**：建榮財務資訊頁將歷年季報列為「個別財報」，但檢索頁尚不足以確認 2026Q2 當期全部子公司狀態。
   - https://www.baotek.com.tw/index.php?action=financial
2. **發行人 2024 年永續報告書**：該報告書說明其財務資料依個別財務報告編製，且記載建榮為 NITTO BOSEKI CO., LTD. 子公司，當時「無合併財務報告」；這是**2024 年的歷史情況**，不可不經核實外推為 2026Q2 當期法律/組織適用性。
   - https://www.baotek.com.tw/upload/113%E5%B9%B4%E6%B0%B8%E7%BA%8C%E5%A0%B1%E5%91%8A%E6%9B%B8.pdf
3. **金管會證券發行人財務報告編製準則第 7 條**：無子公司發行人依規定編製「個別財務報告」。**法規的「個別」與公開網頁程式顯示的「個體」名稱不可以僅憑字串推定等同**；必須取得 2026Q2 原始財報及法定編製基礎再確認。
   - https://law.fsc.gov.tw/LawContent.aspx?id=FL007203
4. **2026Q2 公司公告（第三方轉載，僅供定位）**：董事會 2026-08-06 16:00:29 公告 Q2 財報，半年基本 EPS 1.00；**公告時間僅能先當來源定位線索**，不能自動當作當期原始 PDF/HTML 每一內容版本的官方 publication timestamp。
   - https://news.cnyes.com/news/print/6562502

**結論（兩層）：**
- 已證：存在 5340 官方 MOPS A-only 原始報表，舊 C-only 解析器會拒絕，不能冒充「沒有 EPS」。
- 未證：2026Q2 是否依法可使用個別報表、該期 A-only EPS 與原合併核心等價、正式時點 PIT、以及能否安全納入 System1 Formal 或 System2 任何實際評分。**一律不自動放行**。

## 三、共用資料契約、候選與拒絕語意

第一階段：官方 MOPS/TWSE/TPEx 既有來源正常則不搜尋，不重複支付 API 額度；資料缺漏/異常時對受影響股票啟動小範圍來源搜尋。外部新聞、券商與一般搜尋引擎僅用來找「官方原始連結」。

| 狀態 | 研究工作 | 交易與歷史回測 |
|---|---|---|
| `CONSOLIDATED_C_SOURCE_PARSER_PASS` | 可取得原版 C 來源證據 | **不能單憑此狀態放行** |
| `INDIVIDUAL_A_REQUIRES_SEPARATE_POLICY_REVIEW` | 找 2026 年當期個別財報適用性、原始版本、獨立 A parser | **禁止自動替代 C** |
| `OFFICIAL_REPORT_BASIS_CONFLICT` | 拒絕並稽核異常原始 HTML | **禁止** |
| `POST_CUTOFF_DISCOVERY_HISTORICAL_PIT_UNPROVEN` | 明示搜尋時間晚於決策時間 | **禁止倒灌 PIT** |
| `OFFICIAL_ORIGINAL_MISSING_OR_UNVERIFIED` | 保留 UNKNOWN，記錄來源 URL/版本/時點/反證 | **不得產生 0 檔** |

### 當期 A 適用性認可前的必要證據（P1 受控研究）
- 5340 2026Q2 法定原始報告中的編製基礎、公司關係/子公司狀態；不能用它是別人子公司來推定它有或沒有自己的子公司。
- 同一原始頁 Q2、Q1、前一年度 Q2 比較欄及**基本 vs 稀釋 EPS**、真正單季 vs 累計、單位、重編/更正、原始文件版本一致性。
- 官方披露時間 `filingPublishedAt` 與第一筆真實觀測 `observedAt` 分別留證；不把新聞轉載時間或本次資料取得時間代稱公告時間。
- 2026Q2 個別口徑若正式核准，必須走**版本化獨立 parser / 等價性審核**，不能做字串取代 `A`→`C` 或直接標記 `quarterEpsVerified=true`。
- System2 A5 A/B 的 source basis、filing vintage 與 PIT 門檻要各自稽核，任何 `NON_PIT_PREVIEW` 的觀察都不能當 PIT-A/Frozen/正式買進信號。

## 四、DATA/BUILD/AUDIT 路由

- **S1 P0 Research**：與雲端正式資源超限/無 Formal parent 分開追查；本研究不做正式商業 POST、D1/KV 寫入、3Min 推播或交易。
- **S2 DATA_LANE (#1068)**：正式原始來源/報告版次/basis/issuer-company at cutoff/firstKnownAt 原始證據，沿用既有 PIT-A/PIT-B 分工；來源採集專責。
- **S2 BUILD_LANE (#1132/#1234)**：只讀消費 DATA + AUDIT 簽名證據，呈現 `SCHEMA_CHANGED / BASIS_MISMATCH / SOURCE_MISSING / PIT_TIME_UNKNOWN`；不改已核准 SHORT_MOMENTUM／三層 NON_PIT 預覽交付優先順序。
- **AUDIT**：以 3236 C、5340 A、年份/季度錯置、晚於 cutoff 才抓到歷史資料、重編新舊版本作獨立反證。

**本文件不是批准合併 #1450、上線搜尋 API 或改正式選股引擎。**
