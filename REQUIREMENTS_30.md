# V7 30條需求與驗收紀錄

規格依本聊天室最新修正：千金股最多3檔＋非千金股最多3檔，空缺不得跨池補位；A拉回、B突破；15分K正式確認，10分K輔助；解除後再成立可以再通知。

本次是可回復的增量修復，**不是30條全部完成的宣告**。「已實作」不等於真實Cloudflare、行情與手機端都已驗收。既有正式環境基準為7.5.6，main先前為7.5.5；不能拿舊main当作現行基準。

|條|正式要求|實作位置／證據|仍需驗收或改善|
|---|---|---|---|
|1|0～6，不硬湊|selectTomorrowCandidates；假行情正常0檔测试|真實全市場掃描|
|2|資料完整後自動盤後掃描|既有18:10 Cron，保留不重設|部署後下一次Cron成功紀錄|
|3|TWSE＋TPEx普通股全市場|日期核對、普通股排除、兩市場官方日期API備援；新增正常管理員授權的GitHub Actions官方行情同步快取；公司基本／財報加入官方MOPS CSV備援|真實Cloudflare上市日期備援已通，上櫃呼叫302，需驗收Actions官方快取及兩市場覆蓋率|
|4|千金3＋非千金3，不跨池補位|獨立配額、formalClose分類、邊界測試|舊手動計畫缺正式收盤價，不能推定分類準確|
|5|主流產業優先且避免過熱|成交額／廣度／漲幅／量額比／領漲股，末升段排除|資金活躍度不是實際淨流入；目前仍排序用，未完整硬篩|
|6|法人籌碼潛伏掃描|法人快照連買與同步評分|集中度／分點完整資料未獨立接通，不得假裝已分析|
|7|A拉回、B突破|strategySetupState與channelPolicy|真實候選及盤中訊號|
|8|20日流動性300／1000張，明確例外|scoreCandidate及流動性例外|真實深度／價差來源與例外測試|
|9|市值四級門檻|scoreCandidate|10～30億例外理由需更完整；真實市值覆蓋率|
|10|OHLCV、均線、ATR、RS等粗篩|buildMarketFeatures；修正今日開盤價及未來日K洩漏|目前RS使用全市場平均代理，不等於實際大盤指數|
|11|財報、YoY／QoQ、催化劑、估值等精篩|fundamentalScore；缺資料不補中立分；月增率不冒充季增率|季度／去年同期歷史、催化劑、估值與族群RS仍未完整|
|12|品質＋波動＋位置＋量價＋產業＋RR|策略品質／ATR／RR門檻|產業硬篩與完整基本面仍未達完整規格|
|13|RR至少2，每單位風險排序|實質壓力算RR；rewardPerRisk主排序；正候選測試|目標壓力與實際可成交位置|
|14|15分K正式、10分K輔助|買／加／賣／停損／減碼；10分K不能正式停損|真實收棒與行情新鮮度|
|15|拉回止跌、下一根確認、重新確認加碼|evaluatePullback；同一15分K禁止加碼、未知第一筆時間禁止猜測|實際成交回填、跨日加碼與完整生命週期|
|16|突破量价確認，不超最大追價|evaluateMomentum；通知當下價格也檢查maxChase|真實回測與最大追價|
|17|六類手機主動推播|evaluateOperationSignals＋sendPush|真實Webhook接受與手機收到，模擬不算|
|18|連續一次，解除後再成立可再次通知|processSignalState與episode ID；失敗重試測試|多isolate並發／KV一致性壓力測試|
|19|通知直接給操作資訊|buildPushPayload；買加股數按當下金額換算；第一筆停損不賣全筆預計股數|實際成交股數與賣出回填；HTTP成功不等於手機送達|
|20|交易計畫同步監控卡片|完整plan schema與既有卡片；盤後未有新Live State時先顯示真實匯入計畫，明示不是行情或買進訊號|瀏覽器視覺與資料一致性驗收|
|21|總資金變更自動重算|管理頁預覽／儲存＋/api/capital；已持倉不覆寫；9/16真實管理員授權的20萬→30萬預覽成功，正式計畫與資金未變|儲存操作及頁面視覺驗收；不以測試覆寫正式資金|
|22|金額及零股股數|recalculatePlanCapital；floor股數及現金保留測試|真實價格及实际成交零股回填|
|23|依動作、等級、優先、RR等排序|compareResults|真實訊號排序、無持倉不宜進場狀態排名|
|24|A立即／B接近／C等待|buildMonitorStatus；與選股A／B分開|實際卡片狀態及持倉動作同步|
|25|每日自動產出隔日0～6|runAfterMarketScan；交易日曆，失敗不寫成0檔|完整基本面資料與正式掃描；持倉未對帳時保留舊計畫而停止覆寫|
|26|3Min自動送入並驗證|sendTo3Min；只使用已設定唯讀URL；新增正常管理員授權/api/three-min/verify，只讀既有紀錄而不重送；支援紀錄清單封装及精確欄位比對|9/16使用者已設定讀回URL；7.5.14待實測schema／權限；現有外部payload尚需補齊各筆金額、股數與正式收盤資料，不將部分契約當成完整規格|
|27|每日結果與0檔回報|每日選股手機訊息及去重；失敗專用警告|真實每日推播及手機端收到|
|28|核心自主，不依賴愛德恩|既有官方掃描獨立運行|外部交叉驗證匯入未完整|
|29|完整半自動決策系統|pipeline逐項選股／KV讀回／3Min／推播，complete嚴格核對|全鏈路正式環境未驗收，不得宣布全部完成|
|30|正式收盤價<10剔除，=10可篩|normalizeMarketRow／scoreCandidate／新plan正式價；邊界測試|舊手動匯入缺正式收盤價仍需補資料|

## 安全與驗證

## 2026/09/16 真實部署與盤後驗收

- 正式runtime：7.5.13-official-market-cache；TEST_MODE=false，KV／D1綁定保留；實際程式及四項Cron均先備份，未重設舊設定。
- GitHub Actions：https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/35104762121 。部署、官方行情同步、真實掃描與V7設定讀回均成功。
- 台灣21:53完成9/16盤後掃描：上市1023、上櫃850，共1873檔；3檔非千金股：6706惠特、3006晶豪科、6505台塑化；千金股0，未跨池補位。這是目前已實作邏輯的真實結果，不是全30條完整分析的宣告。
- 設定saved=true、verified=true，updatedAt=2026-09-16T13:53:49.270Z；公開recommendations回報CURRENT、isCurrent=true。
- 3Min寫入HTTP202，sent=true；THREEMIN_VERIFY_URL未設定，verified=false，pipeline.complete=false。
- 每日推播HTTP200，sent=true、simulated=false；尚無手機端已收到的證據。
- 上櫃公司基本／營收／EPS／獲利資料由官方MOPS CSV成功補回；上櫃當日法人來源仍302，沒有當日完整D1快照備援，須繼續改善。RS代理、季度比較／估值／催化劑、完整產業品質與外部驗證等仍如上表未完成。
- 已查3Min官方API文件：https://3minapi.com/docs/integration 。POST與GET list使用同一既有data/{slug}端點；GET single須POST回覆的record ID。新verify URL需正常配置並核对实际回覆schema，不能拿V7本身讀回冒充3Min讀回。

### 保留原有安全邊界

### 2026/09/16 22:09 3Min讀回驗收

- 正式runtime更新為7.5.14-three-min-readback。驗收流程：https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/35106559731 。
- 3Min使用管理員已設定的既有THREEMIN_VERIFY_URL，GET HTTP200；實際schema為success/data/pagination，紀錄內payload承載計畫。
- 已核對9/17 planDate、20萬totalCapital、全部3檔與已送出計畫欄位一致。pipeline.complete=true僅代表此批選股／KV／3Min儲存讀回／推播HTTP傳輸通過，不代表全30條精篩完整或手機收到。
- 本次沒有重新選股、3MinPOST、手機推播或交易計畫變動。資金20萬→30萬只做preview，正式資金與全部標的不變。
- 首頁已在未有新LiveState時顯示已匯入計畫，明示不是即時行情或買進訊號；程式與HTTP文字驗收通過，瀏覽器視覺QA仍未完成。
- 初次驗收入口回覆NotFound，增加不寫入的GET路由生效核對後成功。未將初次非JSON回覆當成3Min授權問題或重送交易資料。

- 只更換Worker程式，不重置KV、D1、Cron、Webhook或其他既有環境設定。
- 新增GitHub Actions在台灣17:55、18:05同步官方當日行情作為備援；不改標的或下單，原Cloudflare18:10及其他Cron全數保留。GitHub排程可能延遲，不把設定成功冒充實際準時完成。
- snapshots/Worker_V7_7.5.6_SIGNAL_STATE_FIX.js保存現行版本參考；回復需確認真正部署版本，不能盲用舊main。
- GitHub與本機離線測試不呼叫真實推播／3Min；TEST_MODE不呼叫外部3Min。
- 公開/api/version只揭露版本、綁定與設定存在與否；公開/api/recommendations區分歷史、掃描失敗與最新，未輸出金鑰及内部URL。
- 真實管理員掃描／資金操作需要既有ADMIN_TOKEN正常授權；不得移除驗證或從別的憑證替代。
- 若提供給GitHub Actions，將既有管理員金鑰存成V7_ADMIN_TOKEN secret，不貼在聊天室；3Min唯讀網址應透過Cloudflare既有變數設定。
