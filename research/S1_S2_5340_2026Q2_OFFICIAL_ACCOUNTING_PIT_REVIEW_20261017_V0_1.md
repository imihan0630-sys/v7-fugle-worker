# System 1 × System 2｜5340 建榮 2026Q2 原始 PDF：會計政策與 PIT 三時點證據查核 V0.1

- 日期：2026-10-17（Asia/Taipei）
- 任務：[#1446](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1446)、System1 P0 #1397、System2 DATA #1068、BUILD #1132。
- 位置：研究草稿 [PR #1451](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1451)，**研究／官方唯讀取證，未 merge、未部署、未改 Formal/PIT/Frozen**。

## 已取得且可複查的原始資料

1. **TWSE 官方電子書原始文件**：`202602_5340_AI2.pdf`，大小 **700181 bytes**，SHA256=`9728d6ad33ba7c066e88378cb724a17f772797a65d445588fec35249414fcef2`。
2. **官方登錄上傳時間**：民國115年8月6日 **16:36:32 台北時間**。原始來源 URL：`https://doc.twse.com.tw/server-java/t57sb01?co_id=5340&colorchg=1&mtype=A&step=1&year=115`。程式從官方索引讀回檔名與秒數；因 HTML 標籤/編碼差異，**索引欄位的 `IFRSs個別財報` 並未由原始 HTML 解析器直接核准**（`indexBasisTextVerified=false`），不得將標籤寫成機器實證。其他同官方來源 MOPS 原始 HTML 兩季 `REPORT_ID=A` 個體，已有 [Run #39000827857](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39000827857)。
3. **原始 PDF 的 EPS 行**（9750 基本、9850 稀釋）驗證：2026Q2 **0.54**、2025Q2 **0.11**、2026H1 **1.00**、2025H1 **0.37** 元。PDF 原始 SHA/報告期別/公司/核閱/兩種 EPS 表格核對已通過 [Run #39005200368](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39005200368)，不是新聞摘要或半年數值相減臆測。
4. **原始 PDF 會計政策附註**：明載遵循「證券發行人財務報告編製準則」及 IAS 34「期中財務報導」；存在會計師核閱報告、公司沿革、通過財報的程序章節。當期董事會通過發布日期為 **2026-08-06**（PDF 直接擷取）。原始真實 Run：[39006893895](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39006893895)。

## 三種時間必須分開

| 類型 | 5340 2026Q2 觀察值 | 能證明什麼 | 不能推論 |
|---|---|---|---|
| `boardApprovedOn` | **2026-08-06** | 原始 PDF 所載的董事會通過日 | 不能視為首次外部公開或版本發布秒數 |
| `registeredUploadAt` | **2026-08-06 16:36:32+08:00** | 當前官方電子書索引所記載的上傳時間 | **不能自動轉為歷史 `firstKnownAt`/原始內容當日存在證據** |
| `firstKnownAt / availableAt` | **UNKNOWN / null** | 未有獨立原始歷史版本／可取得時間封存收據 | 禁止用本輪 2026-10-17 搜尋／GET 結果倒灌 2026-08 或其他歷史 as-of 決策 |

此外，公開第三方於 2026-08-06 16:00:29 轉載公司董事會公告，屬**找來源線索**；當時公告的**上半年累計** EPS 1.00，不能當作當時單季 EPS 0.54 或當時原始 PDF bytes 已可取得的證明。

## 2026Q2 個別／個體財報法定適用性：目前尚未通過

- 2026Q2 PDF 的公司沿革指稱 **NITTO BOSEKI CO., LTD.** 是建榮的母公司；**建榮是別人的子公司，不能用來推定建榮自己「有」或「沒有」子公司**。
- 原始 2026Q2 PDF 未發現可直接支持「建榮當期無子公司」的明確陳述。內容包含 IAS/IFRS 準則提及「子公司」，那是準則名稱，**不能將它誤當建榮持有子公司的證據**。
- 建榮 [歷史永續報告書](https://www.baotek.com.tw/upload/113%E5%B9%B4%E6%B0%B8%E7%BA%8C%E5%A0%B1%E5%91%8A%E6%9B%B8.pdf) 曾說明其採用個別財報、當時無合併財報；這是**2024 年度**的資訊，不能直接證成 **2026 Q2**。
- 對照金管會 [證券發行人財務報告編製準則](https://law.fsc.gov.tw/LawContent.aspx?id=FL007203) 之「無子公司」條件，仍需取得 **2026Q2 當期發行人投資/子公司狀態** 或同時期法定原始分類憑證，並由 AUDIT 釐清 MOPS `REPORT_ID=A` / TWSE 類型標籤與合法採用哪個報表的關係。**不能在資料查詢/搜尋時對 5340 的 A 或 C 做硬改字串**。

## 研究程式及拒絕閘門

- `research/system1_5340_2026q2_individual_pdf_eps_review_v0_1.mjs`：僅確認原始 PDF EPS 數值與原始來源 SHA、表格期間。
- `research/system1_5340_2026q2_official_pdf_basis_pit_audit_v0_1.mjs`：將官方登錄上傳時刻、董事會日期、公司沿革、編製準則證據及未核實的 `firstKnownAt` **分開**；即使有負面子公司文字，也不由單一字串直接判定法定核准。
- System1：`formalEligible=false`，未授權納入現行正式選股；Cloudflare `exceededResources`、Formal 資料保存失敗是獨立問題，仍未解。
- System2：`PIT_A=false`、`PIT_B=false`、`Frozen=false`、`canTrade=false`，保留 `NON_PIT_PREVIEW` 與 `selectedCount=null` 的必要區分。

## 2026 Q2 原始附註第十二項：新的當期負證線索（2026-10-17 新補查）

在 TWSE 同一份官方原始 PDF（SHA256 仍為 `9728d6ad33ba7c066e88378cb724a17f772797a65d445588fec35249414fcef2`）中，程式已讀出：

- 第十二項「附註揭露事項」下記載 **「母子公司間業務關係及重大交易往來情形：無」**。
- **「轉投資事業相關資訊：無」**。
- **「大陸投資資訊：無」**。
- 關係人附註列有 **NITTO BOSEKI 為建榮母公司**，另列兄弟公司。這些不是建榮自己投資設立子公司的證明。
- 財報的 IAS/IFRS 未來準則標題出現「子公司」字眼，也不代表本發行人有子公司。
- 沒有發現單一句法明確且能自動定論的「本公司無子公司」聲明。負揭露更支持 2026Q2 **沒有轉投資事業資料**，但仍須資料稽核確認此格式/披露完整性及 IFRS10 控制事實。

物理取證：[GitHub Run #39008514300](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39008514300)。研究分類器 `research/system1_5340_2026q2_subsidiary_and_vintage_evidence_v0_1.mjs` 使用上述 **原始 PDF 的表內負揭露** 作為輔助證據；對「有無子公司」或「合法個別財報」永遠輸出 `Certified=false`，禁止自動放行。

仍待的獨立 AUDIT：核對當期官方投資持股附表、是否存在其他子公司／經控制實體及期內更正，並分開 2026/08/06 董事會日期、16:36:32 上傳登錄、真正原始版最早可讀時點。

## DATA → AUDIT → BUILD 下一個真實驗收點

1. **DATA_LANE**：以不影響原 PIT-A/CFI/CA 主線為前提，取得建榮 2026Q2 會計/子公司狀態的**官方時點版來源**，對比最新官方名冊、公告當時內容及更正/撤銷，保存原始 SHA/官方版本/firstKnownAt/availableAt 閘門，不得只記搜尋當下時間。
2. **AUDIT**：獨立重現建榮 A-only 正向來源、3236 C-only 對照、未證實當期無子公司／索引 Basis HTML 解析失敗的負面反證、公告日在 PDF 上傳前與更正/異動反證。
3. **BUILD_LANE**：只能消費 DATA/AUDIT 已核准的原始證據；不得自行造 `issuerFirstPublishedAt` 或解除 PIT / Frozen。Formal C-only 政策如要調整，需另案 owner 正式授權。

**研究 PASS ≠ 法定報表類型通過 ≠ PIT 通過 ≠ 盤後選股成功。**
