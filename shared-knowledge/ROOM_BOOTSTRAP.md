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

