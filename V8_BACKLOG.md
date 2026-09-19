# V8 未完成工作與優化 Backlog

> 專案世代名稱：V8  
> 目前正式 runtime 技術字串：`8.0.1-requirement11-q4-eps`  
> 本文件只整理工作優先順序，不修改 Worker、不重新部署。

## P0｜先完成正式驗收

### 1. 下一交易日 18:10 正式盤後掃描驗收
- 確認完整資料準備、正式掃描、正式池寫入、3Min POST/GET readback、每日推播 HTTP、scan/status 全部成功。
- 確認 DATA_INCOMPLETE 時保留既有計畫，不誤寫成 0 檔。
- 確認動態觀察池首次真正產生 marketDate/generatedAt，且 <=12 檔、不與正式池重疊。

### 2. 盤中真實訊號端到端驗收
- BUY / ADD / REDUCE / STOP / PROFIT_CHECK / SELL 六類訊號需有真實行情案例。
- 驗證 15 分 K 正式、10 分 K 只輔助。
- 驗證解除後重新成立才產生新 episode。
- 驗證 actualShares / firstEntryConfirmedAt 缺失時不猜測。

### 3. 手機實收驗收
- 現有 `sent=true` 只能證明 webhook HTTP 接受。
- 需有獨立手機端實收證據或接收端 receipt/ack 機制，才能完成規則 17/27 的正式驗收。

### 4. 新完整 3Min payload 正式寫入驗收
- 下一次真正的新盤後選股，必須 POST 完整 V7_PLAN_2 / 現行計畫 schema。
- 再用既有 readback 驗證全部欄位一致。
- 不以重送舊計畫充數。

## 已完成｜V8.0.1

### 第 11 項財報完整化
- Q1～Q3 直接 MOPS 單季 EPS 保留。
- Q4 依 TWSE 財務比較 E 點通官方方法：Q4累計 EPS－Q3累計 EPS。
- Q1 前季 Q4 已可正式核對。
- EPS QoQ 僅在當季與前季都通過官方單季驗證後計算；負／0 基期不製造百分比。
- 2026/09/18 官方品質資料 acceptance 與唯讀精篩通過，第11項已從 incompleteRules 移除。

## P1｜資料品質／市場資料可繼續優化

### 6. 籌碼／主力資料品質
- TDCC 只能反映持股級距，不能當成主力身分。
- 若要增加「主力／分點」判斷，需要可驗證且合法穩定的來源。
- 沒有來源時維持現行保守設計，不捏造主力分數。

### 7. 大盤／產業比較再精緻化
- 上市用 TAIEX 已有實際資料。
- 可評估補上 TPEx 自有基準與更細的同產業相對強弱。
- 避免用代理值冒充正式 benchmark。

## P1｜V8 功能優化候選

### 8. 觀察池歷史紀錄
目前 watchlist 主要保存「最新狀態」；可新增：
- 每日觀察池 snapshot。
- 進池／續留／升回正式池／淘汰的日期與原因。
- watchScore 歷史。
- 後續 5/10/20 日報酬。
- 用於檢查觀察池真的有沒有增加勝率。

若新增此功能，依版本規則屬於新功能，下一版應為 **V8.1**。

### 9. 正式池＋觀察池整合儀表板
單頁顯示：
- 今日正式池。
- 觀察池。
- 資料完整度。
- 18:10 掃描狀態。
- 3Min 狀態。
- 推播狀態。
- Cron 最近成功時間。
- GitHub / Cloudflare runtime 狀態。

屬於功能新增，可作為 **V8.1** 候選。

### 10. 推播可觀測性
- 顯示 RESERVED / ACCEPTED / UNKNOWN / receiptVerified。
- 提供 signalId / episodeId 對應。
- 若手機接收端未支援 receipt，頁面明確顯示「HTTP 已接受，手機未驗證」。

### 11. 觀察池推播摘要
目前不逐檔推觀察池是正確設計；可增加一行摘要：
- 新增 X。
- 續留 X。
- 升回正式池 X。
- 淘汰 X。
- 附 watchlist URL。
不把 12 檔逐一塞進手機訊息。

## P2｜工程維護優化

### 12. 建立乾淨 V8 baseline source
目前 production build 仍由舊 baseline Worker.js 加多個 patch script 組成。
可在確認穩定後：
- 產生一份與正式 runtime 邏輯等價的乾淨 V8 baseline。
- 保留舊 patch / snapshot 作歷史。
- CI 對 baseline 做 hash / syntax / regression。
- 降低「GitHub root Worker 與實際 deployed build 不同」造成的混淆。

這屬工程重整；若不新增功能、只處理程式維護問題，可依規則視為 **V8.0.1** 類修正版。

### 13. Release manifest
每次部署自動產生：
- projectGeneration: V8
- runtimeVersion
- git SHA
- build time
- regression run
- deploy run
- Worker hash
- requirements30Complete
讓 GitHub / Cloudflare / 聊天室不再靠人工對版本。

### 14. 自動驗收報告
每次盤後把：
- 資料完整性
- 正式池
- 觀察池
- 3Min readback
- 推播 HTTP
- health check
整合成一份 D1 / GitHub artifact 報告，供隔日追查。

## 目前仍未完成的 30 條核心驗收

依現行正式紀錄，主要未完成／未完全驗收仍集中在：
- 17：六類真實手機操作訊號。
- 18：跨系統傳輸無法宣稱 exactly-once；目前採保守 reservation。
- 19：真實成交股數 / firstEntryConfirmedAt / 手機實收。
- 26：新完整 payload 下一次正式 POST + readback。
- 27：每日結果手機端實收。
- 28：外部交叉驗證來源尚未真正接入。
- 29：30 條完整正式端到端驗收仍未完成。

## 建議執行順序

1. 不先加新功能。
2. 下一交易日先驗收 18:10 正式掃描 + 觀察池 + 3Min + 每日推播。
3. 再驗收盤中真實訊號與手機實收。
4. 完成第 17／19／27 項的真實手機實收與成交／持股回填驗收。
5. 完成第 28 項外部交叉驗證，再收斂第 29 項完整端到端驗收。
6. 上述穩定後，再開始 V8.1 功能優化；最後做乾淨 V8 baseline 與 release manifest。
