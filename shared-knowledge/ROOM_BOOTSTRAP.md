# ChatGPT 新聊天室輕量續接協定

Status: CANONICAL_ROOM_BOOTSTRAP_V0_1  
Updated: 2026-10-04 Asia/Taipei  
Repository: `imihan0630-sys/v7-fugle-worker`  
Authoritative branch: latest `main`

## 目的

聊天室因內容過長、模式切換或裝置／介面問題而必須移轉時，**不得再把完整研究歷史、規則、百分比、SHA、模組清單與舊聊天摘要全部貼進新聊天室**。

正常做法改為：

**短啟動詞 → 最新 GitHub main → 本檔 → Registry → 專屬 checkpoint → exact next continuation point。**

聊天只是執行介面；可持久研究／工程狀態必須保存在 GitHub，而不是依賴舊聊天室文字。

若判斷目前聊天室已接近長度／穩定性上限，應主動先寫回 checkpoint，再產生短啟動詞；不得等聊天室完全失效後才開始整理移交。

## 一、一般 Chat → Chat 移轉

### 舊聊天室離開前

若仍可正常操作：

1. 把尚未 durable 的實質進度、反證、阻塞、決策、exact next continuation point 寫回正式 checkpoint。
2. 寫回前重讀最新 SHA，合併並行進度，不得用舊內容覆蓋新進度。
3. 不另外製作數千字 handoff；除非有無法安全寫入 GitHub 的必要資訊。

### 新聊天室只需要短啟動詞

標準版：

> 接手「<聊天室名稱>」。依 GitHub 最新 main 與 ROOM_BOOTSTRAP 自動恢復，從正式 exact next continuation point 接續；禁止重頭研究、禁止重做、不要要求我重貼舊聊天。

極短版：

> 接手「<聊天室名稱>」，依最新 GitHub main 自動恢復並續接。

只要聊天室身份可唯一辨識，就不得要求韓哥再貼完整舊提示詞。

## 二、新聊天室恢復順序

新聊天室收到短啟動詞後：

1. 讀 `AGENTS.md`。
2. 讀本檔 `shared-knowledge/ROOM_BOOTSTRAP.md`。
3. 讀 `shared-knowledge/ROOM_BOOTSTRAP_REGISTRY.json`，用聊天室名稱／alias 找到身份、主責領域與 checkpoint。
4. 讀該身份的專屬 checkpoint／research files，取得最新 durable state 與 exact next continuation point。
5. 若是 01～15 研究室，讀 `shared-knowledge/RESEARCH_OUTPUT_CONTRACT.md`。
6. 需要正式成熟度／模組狀態時，讀 `research/stock_market_learning_tracker_v0_1.json` 的 aggregate 與本室負責 Dxx；不得用舊聊天室百分比。
7. 只有在跨研究室整合、課綱／owner 變更、模組路由不明或治理衝突時，才讀完整 `shared-knowledge/LEARNING_ROOM_ROUTER.md`／`SHARED_RESEARCH_MASTER_MAP.md`。一般續接不得把巨大 Router／Master Map 當成每次啟動的必要全文讀取。
8. 重新確認 latest `main`；舊提示詞中的 SHA、百分比、模組數、Level、status 只能當歷史線索，不能蓋過最新正式檔。

## 三、恢復確認

新聊天室完成恢復後，先用極短格式回報，不重述歷史：

```
【續接恢復】
- 身份：<聊天室／任務>
- latest main：<當次重新讀取的 SHA>
- 續接 checkpoint：<檔案>
- 下一步：<exact next continuation point>
```

確認後直接工作；除非韓哥要求，不得再輸出長篇舊進度摘要。

## 四、恢復完成後的行為

- 從 checkpoint 的 exact next continuation point 直接接續，不得重新總結已完成研究當作新進度。
- 不得要求韓哥搬運舊聊天室、重新提供 repo、重貼規則或手工重建百分比。
- 若 checkpoint 與 tracker 不一致，先查最新 main／commit／並行寫入並修復正式狀態，再繼續。
- 若真正缺少且無法從 GitHub 恢復的資訊，僅詢問「缺失的最小資訊」，不得退回要求整份舊提示詞。
- 一般移轉不把 observed SHA 寫死成未來權威；新聊天室永遠重新讀 latest main。

## 五、Work／Codex 模式切換

Work／Codex 仍需要完整交接「語意」，但**完整不等於冗長貼文**。

優先流程：

1. 先把當前任務狀態 durable 化到既有 checkpoint；若屬一次性大型任務且沒有合適 checkpoint，建立一份 task-specific handoff checkpoint。
2. 新聊天室提示詞只保留：
   - 任務／聊天室名稱；
   - 建議模式、模型、思考強度；
   - repo 與 latest-main 規則；
   - task-specific checkpoint 路徑；
   - 目前唯一目標；
   - exact next action；
   - 必要批准邊界。
3. 已存在 GitHub 的背景、規則、測試歷史、研究成果不得整段複製到提示詞。
4. 只有在 GitHub 無法存取、無法安全寫入 checkpoint，或有「目前聊天室獨有且尚未 durable」的重要資訊時，才退回完整自包含長 handoff。

Work／Codex 短移交範本：

> 接手「<任務名稱>」。模式：<Work／Codex>，模型／強度：<建議值>。  
> 先讀 GitHub 最新 main、`shared-knowledge/ROOM_BOOTSTRAP.md` 與 `<task checkpoint>`；以 checkpoint 的 exact next action 接續，禁止重頭做。  
> 目標：<一句話>。批准邊界：<一句話；若無額外邊界則寫依既有治理>。

## 六、例外與失敗保護

若舊聊天室已無法操作，直接由新聊天室依 GitHub 恢復；不得因缺少舊聊天室而自行重頭研究。

若最後一段工作尚未寫回 GitHub 且舊聊天室也不可讀，該段狀態標 UNKNOWN，不得臆測已完成。

若新聊天室無 GitHub 權限／工具可讀，才使用長版 self-contained handoff 作為 fallback；不得把 fallback 當預設。

## 七、資源原則

- **狀態存 GitHub，不存提示詞。**
- **提示詞只識別身份與目標，不複製歷史。**
- **專屬 checkpoint 承擔完整續接責任。**
- **巨大 Router／Master Map 按需讀，不做日常啟動全文。**
- **任何規則更新只改 canonical files，不複製到每個新聊天室。**

## 八、不中斷執行與防靜默停滯（MANDATORY）

本節適用於一般 Chat、Work、Codex，以及 System 1、System 2、01～15 研究室與其他使用本 repository 的研究／工程聊天室。

### 1. 里程碑立即 durable 化

- 每完成一個可獨立驗證的 milestone，應儘快寫回既有 checkpoint、commit／PR 或其他正式 durable state；不得把多個大型階段全部留在單一聊天回合記憶中。
- 已完成且已 durable 的成果，後續中斷時不得重做；恢復時從 exact next continuation point 接續。
- 若尚未完成 commit，但已產生重要實質結果，至少先把 branch、變更檔案、測試結果、blocker 與 next action 寫入正式 checkpoint。

### 2. 禁止無聲等待與假性背景執行

- 只要任務仍在進行，不得因等待 CI、workflow、merge 狀態、外部來源或工具回應而長時間無聲停住。
- 長鏈任務原則上每約 2～3 次工具操作或約 15 秒應提供一次簡短進度更新；若此時沒有新的實質結果，至少明確說明目前正在等待什麼、已完成什麼、下一個可執行動作是什麼。
- 等待 GitHub Actions 或其他外部結果時，應優先執行不衝突的安全工作；若確實沒有其他安全工作可做，必須明確標示為「僅等待外部結果」，不得讓使用者誤以為仍有其他背景工作正在進行。
- ChatGPT 不得宣稱會在背景繼續工作或稍後自行交付；所有實際工作必須在當前可執行回合中完成，或留下 durable continuation state。

### 3. 「已說繼續卻未進入下一步」視為異常中斷

若已對使用者表示「繼續」、「接著做」、「不停」、「正在執行」或等價承諾，但實際上沒有發動下一個必要工具／研究／工程動作，應視為：

`ABNORMAL_INTERRUPTION`

恢復時第一件事必須如實回報：

1. 上次最後一個真正完成的 durable milestone；
2. 上次實際停住的位置；
3. 是否存在未 commit／未 merge／未驗證的工作；
4. exact next continuation point。

不得把停止狀態描述成仍在背景處理。

### 4. main 漂移只同步，不重做

- 長任務期間若 latest `main` 被其他研究室或工程支線推進，先重新讀 latest main 並比較差異。
- 若新 commit 與本任務無衝突，採同步／rebase／重新建立 branch 等安全方式續接，不得因此重做已完成研究。
- 只有在實際檔案、schema、規則或語意衝突時才重新驗證受影響部分。
- 永遠不得以舊 SHA 覆蓋較新的正式成果。

### 5. 長工程拆成可驗證的小批次

- 長 GitHub 工程優先拆成可獨立測試、可 rollback、可 merge 的小 milestone，而不是把來源探索、parser、archive、schema、驗證、runtime、promotion 全塞進單一超長回合。
- 每一批次完成後記錄：branch／PR／commit、tests、readback、blocker、next action。
- 拆批不得改變研究完整性；不得為了快速結束而跳過反證、PIT、OOS、成本、UNKNOWN 或 Formal 邊界檢查。

### 6. 模式切換門檻

- 一般研究、判斷、規則設計與反證優先留在 Chat。
- 當任務已明顯成為大型 repository 改檔、連續測試、rebase／merge、跨檔工程或大量自動化操作時，應主動判斷 Codex 是否較適合；大型跨領域長任務則判斷 Work。
- 需要切換時，必須先 durable 化現況，並依本檔「Work／Codex 模式切換」產生完整但精簡的 handoff 與建議聊天室名稱；不得只叫韓哥自行切換。
- 未達必要門檻時，不得為了方便而消耗 Work／Codex 額度。

### 7. 唯一續接點必須可恢復

任何未完成的長鏈研究／工程，在結束一個可執行回合前，應盡可能讓正式狀態能回答：

- latest observed main SHA；
- 最後完成／merged 的 PR 或 commit；
- 已通過與未通過的 tests／checks；
- 當前 blocker；
- 未 commit 或未 merge 的工作（若有）；
- exact next continuation point。

若上述資訊已存在專屬 checkpoint，不必重複建立新文件，但必須更新原 checkpoint。

### 8. 中斷後自動恢復原則

- 使用者輸入「繼續」時，若前一輪屬未完成任務，應優先恢復前述 exact next continuation point，而不是重新規劃。
- 若 GitHub 可恢復狀態，不得要求使用者重貼舊內容。
- 除 MFA、Secret、新增權限、重大策略／Formal Core／production 風險決策，或所有安全替代方案均失敗外，不得把一般工具錯誤或流程中斷轉嫁給使用者。

### 9. 核心判準

**工作可以因工具或回合邊界暫停，但不得無聲失聯、不得假裝仍在背景執行、不得遺失續接點、不得因中斷而重做已 durable 的成果。**



## 九、選股自欺／盲點稽核（MANDATORY）

Canonical audit map:
`shared-knowledge/STOCK_SELECTION_SELF_DECEPTION_AUDIT_V0_1.md`.

適用：00、01～15、System 1、System 2 與相關 execution lane。

規則：
- 01～15 研究室恢復後，必須讀 `shared-knowledge/STOCK_SELECTION_AUDIT_QUEUE.md`（或 machine registry）並只取本室主責 Dxx 的未關閉 SDA 工單；在既有 exact next continuation point 不被破壞的前提下，把對應 audit row / SDA ticket 當成持續反證與修復責任；不得只追成熟度百分比。
- System 1 / System 2 涉及選股、排名、共振、因子、Regime、事件、資料 vintage、執行或策略整合時，必須讀取 `STOCK_SELECTION_AUDIT_QUEUE.md`、audit map 與 `SYSTEM_ALPHA_LINEAGE_AND_DOUBLE_COUNT_GUARD_V0_1.md`，優先處理分派給自身的未關閉 SDA 工單，實作可機器驗證的防堵，而不是只靠研究文字提醒。
- 學習室負責語意、機制、反證、代理變數邊界；D16 負責 common-support、incrementality、OOS/Shadow、多重檢定；00 負責跨領域稽核與關閉；工程聊天室負責 lineage/clock/provenance/receipt/test 等執行層防線。
- blind spot 不得因文件寫了就視為 CLOSED；需有對應研究修正、工程 guard/test 或 D16 evidence，再由 00 readback 關閉。
- 此稽核不授權 Formal Core 變更；任何會改 A/B、ranking、Top6、weight、threshold 或交易行為的動作仍須明確 owner approval。


## 十、全域外部 Web 工具政策（MANDATORY）

所有使用本 repository/shared-knowledge bootstrap 的聊天室（00、01～15、System 1、System 2、Chat／Work／Codex 與跨專案 continuation）都必須讀取：

`shared-knowledge/GLOBAL_EXTERNAL_WEB_TOOL_POLICY_V0_1.md`

核心規則：
- **TinyFish 對所有新任務停用。** 不得再把 TinyFish 當成新網頁研究／抓取／頁面解析工具。
- 需要外部網頁 discovery / crawl / page extraction / reading 時，**Firecrawl 為預設替代工具**。
- 若當前聊天室尚未連接 Firecrawl，不得暗中退回 TinyFish；可先用 ChatGPT 原生 web/search/browser，若任務確實需要 Firecrawl 才能完成，則只在實際連線邊界停住並說明。
- 已有的官方 API、repository-owned Playwright collector、CI/runtime collector 不因這條規則被強制改寫；工程資料擷取仍以可重現、PIT、source lineage 為準。
- 舊 evidence 若真實記錄過 TinyFish，只能保留歷史 provenance，不得竄改；「歷史上曾用過」不等於「現在仍授權」。
- Firecrawl 只是 retrieval channel，不等於官方來源；官方 primary source 仍優先。


## 十一、跨專案 System 1 / System 2 非同質化規則（MANDATORY）

所有使用本 repository/shared-knowledge 恢復狀態的主要系統建置聊天室，不論位於哪一個 ChatGPT Project，都必須讀取：

`shared-knowledge/SYSTEM1_SYSTEM2_NON_CONVERGENCE_GUARD_V0_1.md`

並遵守：

- System 1 與 System 2 可以共用 raw data、D01-D22 研究、PIT、source lineage、SDA、D16 驗證基礎；
- 不得因此默默共用候選生成、hard gate、ranking policy、Top picks、進出場／持倉邏輯；
- System 2 不得把 System 1 A/B、Top6/3+3、Formal ranking、15m Formal confirmation 當成隱藏前提；
- System 1 不得把 System 2 strategy-local rank、Regime、confluence、max-12/max-3 lifecycle 等默默吸收成 Formal 規則；
- 同一檔股票被兩套系統選中不等於兩個獨立確認；需經 SDA-022 / D16 dependence-incrementality 驗證；
- 不得為了「看起來不同」而強迫兩套選不同股票；
- 任何跨系統角色／決策政策收斂都必須以 SDA-022 顯式呈現，不能靠聊天默認；
- ChatGPT Project 邊界不構成治理豁免：只要使用本 repo/shared bootstrap，就套用同一規則。

完全不讀本 repo/shared bootstrap 的獨立 Project 無法被此檔自動強制；若要納入同一治理，必須先把該 Project 的主要建置聊天室接到本 bootstrap/registry。


## 十二、使用者可操作網址／入口連結規則（MANDATORY）

本節適用於所有使用本 repository／shared bootstrap 恢復的聊天室，包括新聊天室、跨 Project continuation、00、01～15、System 1、System 2、各 execution lane，以及 Chat／Work／Codex。

### 1. 有穩定網址就必須一起提供

當回覆要求韓哥開啟、登入、查看、確認、操作或前往任何具體頁面，只要存在已知且穩定的使用者可開啟網址，**必須在同一則回覆中直接提供可點擊網址／連結**；不得只說「去 GitHub」、「到 Actions」、「開 Cloudflare」、「看 PR」或要求韓哥自行尋找入口。

典型範圍包括但不限於：
- GitHub repository、Actions、特定 workflow、workflow run、PR、commit、issue、檔案；
- Cloudflare dashboard／具體產品或設定入口；
- 官方文件、登入頁、設定頁；
- 其他需要使用者實際點擊或操作的官方／可信頁面。

### 2. 優先提供最深層、最直接入口

- 已知特定 workflow URL 時，應給特定 workflow，不只給 repository 首頁。
- 已知 PR／run／commit／file URL 時，應給該具體頁面，不只給 GitHub 首頁。
- 若必須先登入，再操作特定頁面，應同時給登入／入口網址與登入後的目標頁網址（若兩者可穩定提供）。
- 多個網址用途不同時，要以簡短文字標示各自用途。

### 3. 不得虛構或洩漏敏感網址

- 不得為了滿足「要給網址」而猜測不存在的深層 URL。
- 若無法可靠取得深層網址，提供最近一層的穩定入口網址，並附最短選單路徑。
- 不得在聊天中暴露 token、secret、signed URL、一次性敏感 query string 或其他認證資訊。
- 需要 MFA、Secret、新增權限或登入授權時，仍依既有治理要求韓哥介入，但同時提供可用入口網址。

### 4. 新聊天室繼承

本規則屬 ROOM_BOOTSTRAP 的 canonical 全域行為規則。任何依本 bootstrap／registry 恢復的新聊天室均自動繼承，不需韓哥再次提醒。

### 5. 核心判準

**只要回覆中的下一步需要韓哥「點某個地方」，而那個地方有可安全公開且穩定的網址，就把網址一起給韓哥。網址不是可省略的排版細節，而是操作交付的一部分。**


## 十三、回覆結尾日期／台北時間規則（MANDATORY / FAIL-CLOSED）

本規則適用於 00、01～15、System 1、System 2、各 execution lane，以及使用本 bootstrap 的新聊天室、續接聊天室與 Chat／Work／Codex 工作。

### 1. 適用範圍提升為「每一則使用者可見的專案回覆」

不是只有正式報告才需要。凡屬本 repository／Project 的使用者可見回覆，一律必須在**整則回覆最末尾**附上當次日期與台北時間，包括但不限於：
- 新聊天室第一則續接恢復；
- 簡短「收到／繼續／已接手／已完成」；
- 中途狀態更新；
- 研究／工程／稽核／部署／資料回補；
- 錯誤診斷與下一步；
- 階段性結論與最終結論。

### 2. 固定格式與時間來源

固定格式：
`日期：YYYY/MM/DD｜台北時間：HH:mm`

- 時區固定：`Asia/Taipei`；
- 24 小時制；
- 必須使用「當次回覆」的目前時間；
- 不得沿用 checkpoint、commit、舊聊天室、上一則訊息或先前工具結果中的舊時間。

### 3. 新聊天室無例外

新聊天室收到短啟動詞後，在送出第一則使用者可見專案回覆前，就必須先套用本 gate。不能以「尚未完整恢復」「只是先確認接手」「訊息很短」為理由省略。

### 4. 送出前硬性檢查（RESPONSE_EPILOGUE_GATE）

每次送出使用者可見專案回覆前，最後一步必須檢查：
1. 回覆最後一行是否存在；
2. 是否完全符合 `日期：YYYY/MM/DD｜台北時間：HH:mm`；
3. 是否為 `Asia/Taipei` 的當次時間；
4. 是否只出現一次最終 footer，避免多個相互矛盾時間。

任一項不符合：
`RESPONSE_EPILOGUE_GATE_FAIL`

在修正前不得把該回覆視為完整交付。

### 5. 核心判準

**任何本專案使用者可見回覆若沒有「日期＋台北時間」作為最末行，即視為輸出格式不完整。此規則不因換聊天室、換 Project、換模式、訊息很短或只做狀態更新而失效。**


## 十四、聊天室責任模組數量進度回報規則（MANDATORY）

本節適用於 00、01～15、System 1、System 2、各 execution lane，以及所有依本 bootstrap／registry 恢復且具有正式「模組／工作單元 inventory」的聊天室。

### 1. 正式回報除了百分比，必須同時報模組數

任何研究／工程／稽核／續接回合，只要回覆中有「本輪結束、進度、完成、階段性結論、checkpoint 更新」等正式進度回報，除既有成熟度／進度百分比外，必須額外列出本聊天室正式責任範圍的：

- 模組總數；
- 已完成模組數；
- 尚未完成模組數。

固定最低格式：

```
【本室責任模組進度】
- 負責領域：<Dxx 或正式工作域>
- 模組總數：N
- 已完成：X
- 尚未完成：Y
- 模組完成率：X / N = Z%
```

其中必須滿足：
`N = X + Y`。

不得只回成熟度百分比而省略模組數；也不得只列本輪有碰到的模組而冒充全室責任模組總數。

### 2. 01～15 研究室的正式分母與完成判準

01～15 的模組總數與狀態一律重新讀取最新：
`research/stock_market_learning_tracker_v0_1.json`
並依 `ROOM_BOOTSTRAP_REGISTRY.json` 中該聊天室正式負責的 Dxx 加總；不得使用舊聊天室、舊 Learning Map、舊提示詞或記憶中的模組數覆蓋最新 tracker。

為避免「模組是否完成」與成熟度百分比混淆，固定採以下二元口徑：

- **已完成模組**：該模組目前至少達 `L2`（MECHANISM_AND_FALSIFICATION_DEFINED；機制＋反證已定義）；
- **尚未完成模組**：該模組仍為 `L0` 或 `L1`；
- `L3`、`L4`、`L5` 均屬已完成基礎研究的模組，但仍可繼續提升成熟度。

因此「模組完成率」只回答研究廣度是否已完成基本機制＋反證覆蓋，不等於成熟度，也不等於已取得可交易 Alpha、PIT、OOS、Shadow、多 Regime、成本或 Formal promotion 證據。

例：
- 12/12 模組至少 L2，可回報「已完成 12、未完成 0、模組完成率 100%」；
- 若這 12 個模組都只在 L3，領域成熟度仍可能只有 60%，不得把模組完成率 100% 誤寫成成熟度 100%。

### 3. 多 Dxx 聊天室

若一個聊天室負責多個 Dxx（例如 D04+D05、D07+D08），結尾必須：

1. 逐 Dxx 列出總數／已完成／未完成；
2. 再列本聊天室合計。

不得只挑成熟度較高的 Dxx，也不得跨入其他聊天室的 Dxx 補數。

### 4. 00／System 1／System 2／execution lane

若聊天室沒有 Dxx learning-module（學習模組）分母，禁止硬套 356 個研究模組。

- 若該聊天室已有正式 machine-readable（機器可讀）工作單元 inventory（例如 correction queue、launch gate、正式 implementation inventory），使用該聊天室自己被治理文件明確定義的工作單元，並清楚標示計數口徑。
- 若目前沒有唯一 canonical inventory 或「完成」狀態不能可靠二元化，必須回報：
  `MODULE_COUNT_NOT_CANONICALLY_DEFINED`（模組數尚無唯一正式定義）
  並列出目前採用的正式進度／gate／queue；不得為了滿足格式虛構總數。

00 負責稽核各聊天室是否遵守此規則，但不得自行替專科室修改其模組成熟度。

### 5. 回覆與 GitHub 一致性

- 每次回報模組數前重新讀 latest main 的正式 tracker／inventory。
- 若 tracker 與舊 Learning Map、checkpoint 或聊天室文字數量不同，以最新 canonical tracker／inventory 為準，並修復鏡像文件，而不是沿用舊數字。
- 若本輪新增／合併／刪除正式模組，必須先完成 curriculum governance，再重新計算 N/X/Y；不得先用新分母宣傳進度。
- 工程完成、CI PASS、PR merge 不得自動把研究模組標成完成；研究模組完成仍依 L2+ 口徑，成熟度仍依 L0～L5 權重。
- Formal Core 變更權限不受本格式規則影響。

### 6. 新聊天室自動繼承

本規則屬 ROOM_BOOTSTRAP canonical 全域規則。任何未來新建／續接聊天室，只要依本 bootstrap／registry 恢復，都自動繼承，不需韓哥再次提醒。

核心判準：

**每次正式進度回報不只要回答「做到幾％」，還要回答「這個聊天室到底負責幾個模組、已完成幾個、還剩幾個」。**
