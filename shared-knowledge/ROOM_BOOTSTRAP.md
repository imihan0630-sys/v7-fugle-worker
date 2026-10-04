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
