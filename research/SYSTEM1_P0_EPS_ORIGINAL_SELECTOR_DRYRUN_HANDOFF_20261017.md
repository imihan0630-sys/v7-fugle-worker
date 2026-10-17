# System 1｜原始 V8 選股引擎：僅限 Dry-run 的 EPS 安全隔離接線候選

Owner 2026-10-17 已核准個股 EPS 未驗證隔離作為正式修復候選，但明確要求先 Shadow、回歸及持股保護，沒有批准正式 Worker 立即部署或解除交易限制。

**最新修正：Class A/安全工程 review-only／DRAFT PR。** 原始 Worker.js 已恢復與正式 main byte-exact 一致；正式 75-step 補丁建置不能接受直接手改 Worker.js。現改由 ops/system1_p0_eps_quarantine_worker_candidate_reviewonly_v0_1.mjs 基於指定原始 Git blob SHA、六處唯一錨點，僅在 artifacts/reviewonly 產出預設關閉的 dry-run 候選檔，再以候選檔執行測試。原始 Worker.js 不變、未合併 main、未部署 Cloudflare、未改四項 Cron、D1/KV、3Min、推播或實際持股。

## 原版 V8 的改造位置與安全閘門

1. 原版 scoreCandidate 全部原封不動；diagnostics.epsReviewUniverse 仍保留隔離前完整初選母群，不刻意掩蓋缺資料股票。
2. 指定 options.epsQuarantineShadow 的選項，必須同時 dryRun=true 且 epsReviewOnly=false 才可能接線；正式非 dry-run 永遠維持原始 EPS 缺失阻擋。
3. 必須先驗原始季度 EPS 整份快照日期、年度、季度、筆數與股票映射，不能把全資料集不完整當成單股問題；兩市場、60 日日K、法人、基本面等原有檢查不變。
4. 原始 scoring 完成後、兩股池各取三名之前，獨立篩掉不符合既有 MOPS C 合併原版解析器、單季 EPS、及前季直接驗證的個股。5340 A 個別報表仍隔離，不以 PDF 數字改成 C。
5. 非千金股使用原本 scored，千金股使用原本 thousandScored；兩套原分數、RR-first comparator、A拉回／B突破、3+3、收盤價底線、15m 正式確認語意不變。
6. preview diagnostics 紀錄初選母群、隔離代號及原因、最後候選，明示 zeroPicksCertified=false；全數隔離絕不當作成功正式零檔。
7. 正式持股、停損、資金、推播與下單無可由此選項啟動的寫入路徑；測試無 Cloudflare Secrets。

## 關聯實證與尚未通過的關卡

- [PR #1490](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1490) 已有 66 項隔離／持股及 49 項原始 V8 排名／流程的離線斷言成功；並非真實 D1 時點與正式來源接受。
- 本分支另設原始 Worker dry-run 嚴格關閉預設，及單元測試。新 PR 的 exact-head CI / V8 Regression / Repair / C1/C2 需獨立驗證，不得先宣稱全數成功。
- 待驗 [PR #1489](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1489) 原始 D1 九檔逐股資料、5340 法定 A-only 及 PIT、同日原版與隔離版真實唯讀 paired scan、Cloudflare 真實 CPU、正常交易日 Formal parent→KV→每日通知。
- 同日真實來源尚無法完整回放時，必須明標 UNKNOWN；不能從後來找到的 EPS 當作 10/16 當時已存在，或將研究 dry-run 當成真實正式復原。

**持續接點：** 審閱本 DRAFT 的 exact-head CI、資源與保持原始 Formal 等價性；直到獨立 AUDIT + owner 逐 PR 核准部署，任何正式業務系統與持倉皆保持不變。

## 最新 2026-10-17 CI 接續補記

- 初始直接修改 Worker.js 的版本，雖 32 項乾跑測試通過，但 V8 正式 Repair / Regression / C1C2 因 scripts/apply_v7_5_30.py 錨點失效而 FAIL；本分支已撤回直接 Worker 修改，不得忽略該負面測試。
- 已建 **byte-exact** candidate artifact 產生器；原始 Worker blob SHA 固定且變更源唯一，正式 Worker.js diff=0。重新驗證 32 項整合 candidate 測試：[CI 39045369508](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39045369508) SUCCESS。常態三組修復／回歸必須以更新後 exact-head CI 判斷。
- 此 adapter 只提供研究驗證、不可交易；後續真正在正式原版 75-step build 導入功能必須建立獨立對應 patch stage，經原檔 SHA 與反證、效能、真實合法交易日讀回、再經 owner 核准部署；本 PR 不是該授權。

## 2026-10-18 00:12 Taipei｜原始 V8 兩股池一致性對照

- 新增 `tests/test_system1_p0_eps_original_selector_paired_offline_v0_1.mjs`：從 main 原始 Worker.js 及 bytes-verified candidate artifact **直接擷取 `selectTomorrowCandidates` 函式本體**，讓同一組固定的九檔合成 scoreCandidate 成功母群分別經過兩套完整池別排序／配額控制流程。
- 特別界定：此測試以 isolated feature/scoring stubs 提供固定 synthetic rows；檢驗真實函式本體的排序、兩次池評分、3+3 各自擇優、source quarantine 插入位置、整包隔離非正式零檔，不是完整 price-feature formation／真實 D1／MOPS 時點／Cloudflare /api/scan 正式交易日驗收。
- 同源九檔合格時：原始與 candidate 無 Shadow 選項結果完全等價，啟用隔離版且無缺失時選出同一 Top6。
- 缺一般股第一順位、千金股第一順位、全部一般股、全部九檔、5340 A-only 個別報表、前季缺資料、EPS 零與負數均有獨立反證。
- 本輪原版對照初次 CI 因**基準期望名單把第四名一般股錯誤列入**而 FAIL；修正測試期望符合正式 3+3 原始實際排序，非變更篩選邏輯。
- 精確提交 `0368bf6afb040f6e24acdf5c59d0b42d3193b05b`：原始 selector paired harness 35 項 + 既有 dry-run 32 項，合計 **67 assertions PASS**：[CI #39048332336](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39048332336)；同一 commit 的 [V8 Repair #39048332348](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39048332348)、[V8 Regression #39048332360](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39048332360)、[C1/C2 #39048332378](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39048332378) 均 SUCCESS。
- 本次正式 Worker.js / main、四 Cron、3Min/D1/KV、持股/停損、15m 信號未變，無 merge/deploy、無正式 business POST、無推播重送，System 2 不受影響。

**尚未取得的必要證據（DATA → AUDIT → BUILD）：** 10/16 原始 D1 QUARTER_EPS 九筆股票鍵與各項 C 來源及時點真實讀回（PR #1489 完成審查後才有權獨立手動 main SELECT）；5340 A-only 法定可用性；同一合法交易日完整官方來源下真實配對 read-only replay；績效/CPU 與既有持股獨立檢查。此前正式 P0 不得宣告完成，也不得把 Shadow 全隔離當作真實 zero-pick。
