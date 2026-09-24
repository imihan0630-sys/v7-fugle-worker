# V7 專案時間軸與聊天室整合紀錄

> 目的：把分散在不同 ChatGPT 聊天室、桌面版／網頁版，以及 GitHub/Cloudflare 實際執行紀錄中的 V7 專案資訊，依時間整理成可長期接續的專案歷史。
>
> 本文件是「整理後的專案脈絡」，不是逐字聊天備份。遇到衝突時，優先順序為：
> 1. `REQUIREMENTS_30.md` 的最新正式規格與未完成項目
> 2. `AGENTS.md` 的最新連續性／安全規則
> 3. 本文件的時間軸
> 4. 舊版程式註解、舊聊天室或舊檔案
>
> GitHub repository: https://github.com/imihan0630-sys/v7-fugle-worker  
> Cloudflare Worker: https://fugle-test.imihan0630.workers.dev  
> 正式版查詢: https://fugle-test.imihan0630.workers.dev/api/version

---

## 2026-09-10｜V7 正式規格基準形成

- V7 原始正式需求確認為 29 項，核心包含：
  - TWSE＋TPEx 全市場掃描。
  - 盤後自動選股、0～6 檔、不硬湊。
  - 產業、技術、法人、RR、資金配置、10/15 分K、手機推播。
  - 盤後自動送入 Cloudflare / 3Min 監控流程。
- 同日新增第 30 項硬條件：
  - 正式收盤價 **<10 元直接剔除**。
  - =10 元仍可進入篩選。
- 後續正式覆蓋規則：
  - 千金股（正式收盤 >=1000）最多 3 檔。
  - 非千金股最多 3 檔。
  - 兩池不可跨池補位。
  - 最終仍可為 0～6 檔。

## 2026-09-13｜7.5.5 與 GitHub 自動部署雛形

- 產出 `7.5.5-final-3plus3-200k-capital`。
- 核心基準：
  - 3+3 兩池。
  - 預設總資金 NT$200,000。
  - 單一標的資金上限 35%。
  - 18:10 台灣時間盤後掃描。
  - Cloudflare D1 為盤中狀態來源；網頁只讀 D1。
- 建立 GitHub Actions 自動部署雛形：
  - main / Worker.js 更新或手動觸發。
  - JavaScript syntax check。
  - Cloudflare API 部署 `fugle-test`。
  - 公開 endpoint 驗證。
- 當時 3Min 串接仍有授權／讀回問題，尚未完成整條驗收。

## 2026-09-15｜7.5.7～7.5.10：股池生命週期與 TPEx 修復

### 7.5.7
- 修復跨日股池生命週期：
  - 舊交易日股池不可當成今天有效。
  - 盤後掃描失敗時，不可把舊股池假裝成今日新結果。
  - recommendation 與 monitoring state 分離。

### 7.5.8
- 增加 TPEx 官方 JSON fallback 與 redirect 防護。

### 7.5.9
- 修復 TPEx subrequest 問題。

### 7.5.10
- 增加 TPEx MIS fallback / row validation。
- 保留推播與測試端點。

### 盤後事故
- 18:10 Cron 有實際觸發，但曾因 TPEx redirect / D1 歷史資料不足而失敗。
- 此階段開始明確要求「缺資料不能當成成功 0 檔」。

## 2026-09-16｜30 條規格重新核對與正式資料鏈路修復

### 規格更新
- A 線正式定義為 **拉回承接**。
- B 線正式定義為 **突破後承接**。
- 15 分K = 正式確認。
- 10 分K = 輔助。
- 連續同一訊號只推一次；解除後重新成立，可產生新 episode 再推播。
- 千金 3 + 非千金 3、不得跨池補位，正式覆蓋原始「兩池共同競爭」版本。

### 7.5.11
- 本地修復草稿完成：
  - 15 分K正式、10 分K輔助。
  - 訊號解除後可再成立。
  - 資金重算與防覆寫。
- 當時尚未完成 TPEx、3Min 回讀、每日回報等正式驗收。

### 7.5.13｜真實盤後掃描
- 正式 runtime：`7.5.13-official-market-cache`。
- 9/16 真實盤後掃描成功：
  - 上市 1023。
  - 上櫃 850。
  - 合計 1873 檔普通股。
- 最終 3 檔非千金股：
  - 6706 惠特
  - 3006 晶豪科
  - 6505 台塑化
- 千金池 0 檔，沒有跨池補位。
- 3Min 寫入 HTTP 202，但當時 readback 尚未驗證完成。
- 每日推播 HTTP 200；HTTP 接受不等於手機實收。

### 7.5.14｜3Min readback
- 既有 9/17 計畫、20 萬資金、3 檔內容 GET 讀回一致。
- `pipeline.complete=true` 僅代表這一批的選股/KV/3Min/推播 HTTP 鏈路，不代表 30 條全部完成。

### 7.5.15｜法人資料
- 同日 TWSE / TPEx 官方法人資料校驗成功。
- 9/16：1832 檔。
- 9/15：1851 檔。
- 9/14：1854 檔。
- `/api/institution-status` ready=true。
- 同步前後正式計畫保持不變。

### 7.5.16｜完整未來計畫 payload
- 新版 3Min 契約加入：
  - 金額。
  - 零股股數。
  - 正式收盤與日期。
  - 千金／非千金池。
  - A/B 策略。
  - RR 與入選原因。
- 舊計畫僅 readback，不為測試重送。

## 2026-09-17｜正式資料品質、推播一致性、監控頁與市場共識

### 7.5.23
- 正式資料／讀回驗收進一步完成。
- 真實 D1 資料包含：
  - INDEX 55。
  - TDCC 2955（9/11）。
  - FINANCIAL 1882。
  - VALUATION 1967。
  - ANNOUNCEMENTS 151。
  - QUARTER_EPS 候選逐檔複核。
- 真實唯讀精篩仍維持 30 條未全部驗收。
- 新增 `v7-health.yml`，盤中與盤後做只讀健康驗證。

### 7.5.24
- 推播改成 durable episode reservation：
  - Webhook POST 前先用 D1 lease 保存 RESERVED。
  - 不明回覆／中斷不盲目重送。
  - 真正解除後才允許新 episode。
- 此設計偏保守：避免重複送，但網路中斷時可能漏通知；不能宣稱跨系統 exactly-once。

### 7.5.25
- 持續修復第 11 項財報。
- Q2/Q3 會直接讀官方前一季單季 EPS。
- 不使用「累計 EPS 相減」假裝單季 EPS。
- Q1 前一季 Q4 與跨季股數／面額可比性仍保留限制。

### 7.5.28
- 修正舊交易日 live state 在新交易日顯示成可執行訊號的風險。
- 等待今日資料時仍保留完整計畫，但鎖住 BUY / ADD 等即時判斷。

### 7.5.29
- 正式部署 `7.5.29-full-plan-pending-card`。
- 恢復完整交易計畫卡片，同時鎖定缺今日 Quote / 10m / 15m 時的即時判斷。

### 7.5.30
- 新增 market consensus radar。
- 市場共識只可對已通過硬條件的候選加分。
- 至少 2 個獨立來源才加分，最高 +7。
- 不得用外部共識救回不合格標的。

## 2026-09-18｜7.5.31 推播語意與 GitHub 自動部署成功

### 7.5.31
- 版本：`7.5.31-push-receipt-clarity`。
- 明確區分：
  - `sent=true` = Webhook HTTP 接受。
  - `receiptVerified=false` = 尚未獨立證明手機實際收到。
- 新增正式環境安全的 `/api/push-test`。
- GitHub Actions `V7 Cloudflare Deploy` run #33 成功部署。
- 同日另有 one-time production-safe push test / pool finalize 工作流驗證。

## 2026-09-19｜7.5.32 DATA_INCOMPLETE 與 7.5.33 動態觀察池

### 7.5.32｜DATA_INCOMPLETE graceful
- 盤後 Cron 曾因缺：
  - 正式季度財報比較。
  - 估值。
  - 公告查核。
  而丟出 `DATA_INCOMPLETE`，造成盤後流程中止、沒有正常推播。
- 改為 graceful handling：
  - 缺資料時不再當成成功 0 檔。
  - 不覆蓋既有好計畫。
  - 保留現有監控設定。
  - 以 `INCOMPLETE` 狀態記錄。
  - 可發系統提醒「資料不完整，保留既有計畫」。
- 正式 runtime 曾確認為 `7.5.32-data-incomplete-graceful`。

### 7.5.33｜動態觀察池
- 使用者確認新增動態觀察池。
- 正式池維持：
  - 千金最多 3 檔。
  - 非千金最多 3 檔。
- 觀察池：
  - **最多 12 檔**。
  - 不分千金／非千金配額。
  - 每天盤後全數重審。
  - 評估技術、基本面、籌碼、產業、市場金流、市場趨勢。
  - 續留 / 升回正式池 / 淘汰。
  - 滿 12 檔時汰弱留強。
  - 不等於正式進場推薦。
- 盤後手機推播只推正式池。
- 觀察池只提供查看連結，不把 12 檔全部塞進手機通知。
- 新增：
  - `/watchlist`
  - `/api/watchlist`

### GitHub → Cloudflare 自動部署恢復
- 發現 GitHub main 與 Cloudflare runtime 曾不同步：
  - GitHub 自動部署鏈停在 7.5.31。
  - Cloudflare 已人工到 7.5.32。
  - 7.5.33 尚未納入 GitHub。
- 將 7.5.32 + 7.5.33 合併回 deterministic patch chain。
- 自動部署流程現在包含：
  1. syntax check。
  2. behavioral regression。
  3. 正式環境現況 snapshot。
  4. Cloudflare secrets 檢查。
  5. 正式 Worker 與 Cron 備份。
  6. anti-downgrade guard。
  7. Cloudflare API code-only deploy。
  8. `/api/version` 與既有設定驗證。
  9. 驗證失敗時 automatic rollback。
- 第一輪 anti-downgrade guard 因 Python urllib 對 Cloudflare `/api/version` 收到 HTTP 403 而中止，部署未執行。
- 改用 Node fetch 後重新跑。
- Regression：成功。
- Cloudflare Deploy：成功。
- 部署後驗證：
  - runtime = `7.5.33-dynamic-watchlist-12`。
  - TEST_MODE=false。
  - KV=true。
  - D1=true。
  - quote / phonePush / threeMin / threeMinReadback readiness=true。
- `/api/watchlist` 已公開可讀：
  - maxStocks=12。
  - 初始 count=0。
- `/watchlist` 頁面已上線。
- 觀察池首次真正建立需等待下一個正式交易日的盤後掃描。
- scheduled health 也加入觀察池檢查：
  - <=12 檔。
  - 不與正式池重疊。
  - 每檔達留池門檻。
  - 必須是當日盤後複審結果。

---

# 目前正式狀態

## Runtime
- Cloudflare Worker：`fugle-test`
- 正式版本：`8.0.2-requirement26-acceptance`
- TEST_MODE：false
- KV / D1：正常綁定

## 正式池
- 千金最多 3。
- 非千金最多 3。
- 不跨池補位。
- 0～6 檔，不硬湊。

## 觀察池
- 最多 12。
- 每日盤後重新複審。
- 手機不逐檔推播。
- 查看：
  - https://fugle-test.imihan0630.workers.dev/watchlist
  - https://fugle-test.imihan0630.workers.dev/api/watchlist

## 自動部署
- GitHub `main` 變更符合 workflow path 時，自動建置並部署。
- 目前 production build 不是單看 root `Worker.js` 的版本字串，而是：
  - baseline Worker.js
  - + `apply_v7_5_27.py`
  - + `apply_v7_5_30.py`
  - + `apply_v7_5_31.py`
  - + `apply_v7_5_33.py`
  - + `apply_v8_0_1.py`
  形成正式部署檔。
- 每次部署前備份正式 Worker / Cron。
- 防止舊版覆蓋新版。
- 部署後驗證失敗會自動 rollback。

## 尚未宣告完成
- `requirements30Complete=false` 仍是正式狀態。
- 30 條需求仍有真實端到端／資料完整性項目未全部驗收。
- Webhook HTTP 接受不能等同手機實收。
- 觀察池目前程式與 endpoint 已完成，但首次正式盤後資料仍待下一交易日產生。

---

# 跨聊天室接續規則

為避免 ChatGPT 桌面版／網頁版／新 thread 導致脈絡斷裂：

1. **GitHub 是專案單一真實來源（source of truth）。**
2. 新聊天室接手 V7 時，先讀：
   - `AGENTS.md`
   - `REQUIREMENTS_30.md`
   - `PROJECT_HISTORY.md`
3. 再查：
   - GitHub main 最新 commit。
   - GitHub Actions 最近一次 Regression / Cloudflare Deploy。
   - https://fugle-test.imihan0630.workers.dev/api/version
4. 不應只靠聊天記憶推測目前正式版本。
5. 任何新版本完成後，都要把重大決策、事故、版本、驗收結果追加到本文件。


## 2026-09-19｜版本編號規則正式化

- 主版本：股池架構或選股架構變更時，V7 → V8。
- 功能版本：核心股池／選股架構不變，新增／修改／刪除功能時，V7.0 → V7.1。
- 修正版：既有架構與功能不變，僅修程式 BUG、串接或連動問題時，V7.1 → V7.1.1。
- 歷史已部署版本名稱保留不回改；新版本起依 `VERSIONING.md` 判定。


## 2026-09-19｜V7.5.33 名稱晉升為 V8

- 使用者指定將現行 V7.5.33 **只做名稱晉升**，正式稱為 **V8**。
- 本次沒有改 Worker 程式、選股架構、股池架構、API、Cron 或部署內容。
- Cloudflare 現行 runtime 技術版本字串仍維持 `7.5.33-dynamic-watchlist-12`，僅專案世代稱呼改為 V8。
- 後續新功能版本由 V8 往下編，例如 V8.1；BUG 修正則為 V8.1.1。


## 2026-09-19｜V8.0.1 完成第11項財報驗收

- 正式 runtime 升為 `8.0.1-requirement11-q4-eps`；本次不改 3+3 股池、不改 A/B 選股架構。
- 證交所財務比較 E 點通公開規則確認：上市／上櫃 Q1～Q3 為公司申報單季；Q4 因無獨立單季申報，以 Q4 累計減 Q3 累計計算單季。
- V8.0.1 因此新增 Q4 EPS 官方方法 `MOPSFIN_OFFICIAL_Q4_CUMULATIVE_MINUS_Q3`，Q1 的前季 Q4 也可正式核對。
- EPS QoQ 僅在當季＋前季均完成官方單季驗證後計算；前季 <=0 不產生百分比，保留變動額／轉盈／虧損變化。
- PR #44 經 V8 Repair CI 與 V8 Regression Tests 通過後合併。
- 主線 commit：`2ed47d0f0cb87a7f58e8235fa92ce6a184dccc57`。
- 正式部署 run：`35434312862` 成功。
- 再執行官方資料品質 acceptance run：`35434378057` 成功；2026/09/18 資料讀回 INDEX57、TDCC2956、FINANCIAL1882、VALUATION1965、ANNOUNCEMENTS147、QUARTER_EPS6。
- 唯讀精篩：TWSE1035＋TPEx844＝1879 普通股，selectedCount=3；quarterEpsReview.ready=true、missingSymbols=[]、previousQuarterReviewedCount=6。
- 驗收期間未改正式計畫、未 3Min POST、未推手機。
- 第11項自未完成清單移除；剩餘 incompleteRules = [17,18,19,26,27,28,29]，所以 requirements30Complete 仍為 false。


## 2026-09-19｜V8.0.2 第26項 3Min 驗收修復

- 正式 runtime：`8.0.2-requirement26-acceptance`。
- PR #45 完成 evidence-driven Rule26：只有本交易日完整 `V7_PLAN_2` 真實 POST + 外部 exact readback 才移除第26項。
- V8 Repair CI run 35434990403 與 V8 Regression run 35434990345 成功；main deploy run 35435019381 成功。
- 另加入只讀診斷，deploy run 35435247629 成功，未重新選股、未 3Min POST、未推播。
- 診斷 2026/09/18 盤後紀錄：3Min HTTP 401，`sent=false`、`verified=false`；完整 payload 本身已是 V7_PLAN_2、scanDate 2026/09/18、planDate 2026/09/21、3 檔。
- 3Min 服務端確認舊端點「V7 今日標的與交易計畫推送」已於 2026/09/17 因 Free plan 7 日清理刪除，9/18 舊 URL 仍被呼叫而拒絕。
- 新建並部署「V8 今日標的與交易計畫推送」，API URL：`https://api.3minapi.com/api/v1/data/cum6sm2952x3sz9gph52w`；production 測試 POST 202。
- 建立 collaboration key「V8 Cloudflare Worker」（create + read）。明碼只在 3Min dashboard，不進聊天或 GitHub。
- 目前 blocker：Cloudflare Worker 尚須把 3Min URL/verify URL/token 切到新端點。完成後由下一次正式新盤後掃描自動驗收第26項。
- Free plan endpoint 仍有 7 日自動清理限制；若不升級方案或換 durable 外部儲存，日後仍會重現。


## 2026-09-25｜9/24 盤後故障恢復完成（V8.9.9）

- 9/24 原盤後流程因官方品質複核／長請求資源限制中止；不是「0 檔」。
- 修復採分段恢復，不改 Formal A/B、3+3+3 配額、門檻或資金規則。
- 正式 runtime：`8.9.9-staged-delivery`。
- 9/24 官方品質資料恢復完成後，同版本只讀選股確認：
  - FORMAL_GENERAL：2 檔（2006 東和鋼鐵、4977 眾達-KY）。
  - FORMAL_THOUSAND：0 檔。
  - HYBRID_THOUSAND_SHADOW：0 檔。
  - HYBRID_WATCH：1 檔（6683 雍智科技），不占第三池3席、不占20萬。
- 2026/09/25 07:37 台北時間 staged recovery 已正式持久化；讀回 `selectionPersisted=true`。
- 每日 3+3+3 補發 Webhook HTTP 200，`deliveryState=ACCEPTED`；手機實收仍不可由 HTTP 2xx 推定，`receiptVerified=false`。
- 外部計畫採先 GET 精確讀回再決定是否 POST；結果已找到完全相同既有紀錄，`externalPostPerformed=false`、`threeMinVerified=true`，避免重複寫入。
- 最終 `/api/recommendations`：`resultType=CURRENT`、`pipeline.complete=true`。
- Cloudflare Error 1102 已確認：同一請求重算全市場可能超過 Worker CPU/記憶體限制；故障恢復不得再依賴單一長 HTTP 請求，優先使用已驗證的 staged selection → delivery/readback 分段流程。
