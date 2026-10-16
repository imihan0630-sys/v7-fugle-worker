# System 1 P0｜盤後選股／主監控／每日推播鏈路 checkpoint（2026-10-16）

Status: `INCIDENT_OPEN__FORMAL_PARENT_MISSING__NO_REPLAY`  
Authoritative repository: `imihan0630-sys/v7-fugle-worker`  
Authoritative branch: latest `main`  
Observed main at capture: `eaa5f5aac43d44a43fc86c3c24eae7f0cef049eb`  
Production runtime: `8.20.2-idempotent-d1-snapshots`

## 1. Scope and protected invariants

This checkpoint records read-only operational evidence only.

Preserve all existing Formal constraints:

- thousand-price pool at most 3 and non-thousand pool at most 3;
- no cross-pool filling and no forced six;
- Strategy A is pullback and Strategy B is breakout;
- formal signal confirmation remains completed 15-minute bars; 10-minute bars are auxiliary only;
- actual holdings, confirmed fills, capital, stop plans and position lifecycle are not overwritten by a new NONE-stage pool;
- no blind retry of an ambiguous business POST;
- failure or missing data is never reclassified as a successful zero-pick session.

No file in this checkpoint changes Worker code, the Formal comparator, pool quota, capital, orders, positions, Cron, KV/D1 data, 3Min data or phone delivery.

## 2. Verified production and main state

At the time of capture:

- latest GitHub `main`: `eaa5f5aac43d44a43fc86c3c24eae7f0cef049eb`;
- public `GET /api/version`: runtime `8.20.2-idempotent-d1-snapshots`, `testMode=false`, KV=true, D1=true, phonePush=true, threeMin=true, threeMinReadback=true, `requirements30Complete=false`;
- Cloudflare provider readback: four original Cron schedules are preserved;
- active deployment was created at `2026-10-13T14:51:21.517823Z`;
- the 2026-10-16 incident PRs did not deploy a new Worker.

Canonical provider diagnostic:

- GitHub Actions run: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38850582658
- verdict: `ORIGINAL_CRON_SETTINGS_PRESERVED__RUNTIME_EXECUTION_CAUSE_NOT_YET_PROVEN`;
- account-level D1 analytics are lagging lower bounds and do not prove remaining quota or a Cron-specific root cause.

## 3. Three-link readback for market date 2026-10-15

Canonical authenticated GET-only forensic:

- GitHub Actions run: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38850051127
- artifact: `system1-p0-original-forensic-38850051127`
- artifact digest: `sha256:776b82df84cfcaba0a6a270e8aa99bb089c81ed4954067e7691a7231bb0b9f12`

### A. Daily after-market Formal selection

Status: **FAIL / MISSING**

- official market cache is ready for 2026-10-15: TWSE 1032 and TPEx 850;
- source quality is ready with no missing required quality kinds;
- `scanDate=null`, `selectedCount=null`, and no same-date Formal attempt is visible;
- therefore this is not a proven zero-pick session.

### B. Primary monitoring write

Status: **FAIL / NO FORMAL PARENT**

- primary source is KV;
- stock count is 0;
- KV `updatedAt=2026-10-15T15:57:04.206Z`;
- exact Formal/KV symbol parity is false;
- no current plan date is present.

A zero-stock KV state without a confirmed Formal record must not be treated as a valid new plan and must not overwrite authenticated holdings.

### C. Daily push

Status: **ORPHAN ACCEPTED RECEIPT / NOT PHONE PROOF**

- exact signal id `DAILY_SELECTION:2026-10-15` has one outbox row;
- outbox state is `ACCEPTED`, HTTP 200;
- created `2026-10-15T15:36:59.075Z`, accepted `2026-10-15T15:36:59.504Z`;
- the row has no confirmed same-date Formal parent;
- canonical verdict is `DAILY_OUTBOX_ACCEPTED_WITHOUT_FORMAL_RECORD`;
- this is not proof that the phone received a valid plan.

## 4. Recent merged PRs

- #1326 — GET-only overnight Formal/KV/outbox audit; merged, regression green, no production write or deploy.
- #1384 — one-shot authenticated GET-only original incident forensic; merged, PR CI and main forensic succeeded.
- #1385 — orphan outbox chronology and market-cache readback; merged, PR CI and main forensic succeeded.
- #1387 — Cloudflare four-Cron/deployment/usage readback; merged, PR CI and main physical provider audit succeeded.

Relevant open candidates (#1288, #1303, #1312, #1313 and #1314) are stale/diverged or review-only. They are not production authority and must not be merged or deployed merely to manufacture a green result.

## 5. Root-cause status

Confirmed:

- official sources can be ready while the same-date Formal record is absent;
- primary KV can be empty without a verified Formal parent;
- an accepted outbox row can exist without a verified Formal parent;
- four Cloudflare Cron schedules and the existing active deployment remain present.

Not yet proven:

- which exact original Cloudflare scheduled invocation produced or failed to produce the 2026-10-15 Formal record;
- whether D1 quota, CPU/runtime failure, date semantics or another branch caused the missing Formal parent;
- whether the phone received any valid daily selection;
- whether any replay would be safe.

## 6. Exact next continuation point

1. Keep business replay disabled for 2026-10-15; do not POST a historical scan and do not resend the orphan push.
2. Obtain an exact scheduled-invocation receipt that binds trigger time, target market date, runtime version, pre-commit source readiness, D1/CPU result and Formal commit outcome.
3. On latest main, refresh only the smallest fail-closed operational guard supported by that receipt.
4. Require exact-head CI plus an independent read-only acceptance before any Worker deployment.
5. A production Worker change or deploy remains a protected action: preserve the four Cron schedules, current bindings, holdings, Formal rules and 15-minute semantics; require explicit owner approval for the concrete PR/deployment.
6. Close the incident only after a new genuine trading day proves the complete same-date chain:
   `Formal saved -> primary KV exact readback -> DAILY_SELECTION outbox accepted`.
   Phone receipt remains a separate acceptance item.

## 7. Current user-decision blockers

No secret is requested in chat.

Owner decision is required only for:

- approving a concrete versioned Worker code-change PR and production deploy;
- enabling any prior-day pinned recovery capability;
- authorizing any business scan replay, push resend, holding mutation, capital/risk change or paid-plan change.

Until then, safe work is limited to read-only diagnosis, offline guards/tests, checkpoint updates and review-only PRs.


## 8. 2026-10-16 續接：main 靜態程式控制流程的獨立核對（無正式環境寫入）

**證據範圍**：直接讀取 `main:Worker.js`，並與原生 Actions GET-only Run `38850051127`、Cloudflare provider read-only Run `38850582658` 核對。此段僅是控制流程鑑識，**不是**重現正式 Cloudflare Cron 執行、不代表確認 10/15 根因、不代表驗收成功。

### A. 已確認的非原子成功鏈與回執時間

`runAfterMarketScanCore` 在非 dry-run 的正常路徑中依序：
1. 寫 `MARKET_STATE_KEY`、`saveStockConfig` 寫監控 KV 並做讀回；
2. `sendTo3Min`；
3. `sendPush(DAILY_SELECTION)` 並在 sent 時寫 `V7_DAILY_REPORT:date`；
4. 建立 `summary`，**最後才** `STOCKS_KV.put(LAST_SCAN_KEY, summary)`；
5. 返回外層 `runAfterMarketScan` 後，才會 `persistSignalStateLease(...SUCCESS...)`，再寫 `V7_LAST_SCAN_ATTEMPT:SUCCESS`。

因此，**推播已接受但 `LAST_SCAN_KEY` 尚未成功保存**是既有控制流程容許的一個失敗窗口；此事實只能建立有缺口的可能路徑，**不能推定** 10/15 真正失敗步驟或當時外部手機收件狀態。

原生 GET-only 事後讀回之時間線（均轉換為 Asia/Taipei）：
- `DAILY_SELECTION:2026-10-15` outbox 建立 2026-10-15 **23:36:59.075**，標示 ACCEPTED 於 **23:36:59.504**；無確認之同日 Formal parent。
- 主監控 KV `updatedAt` 為 2026-10-15 **23:57:04.206**，`stocks=0`，也沒有可確認的當日 Formal parent。
- `scanDate=null`、`selectedCount=null`、同日 Attempt 未獲證明；**絕不翻譯為選出 0 檔成功**。

上述兩個時間點與既有 23:35、23:55 台北預期排程接近，但**不是**單次 scheduled invocation 的原始關聯證據，亦不能僅由時間接近判定 2 次都成功觸發。

### B. 現行 Cron 回執的觀測缺口

`runScheduledWithAudit` 在 `runAfterMarketScan` 返回/拋錯後才呼叫 `writeCronRun`；該方法在 D1 schema/session/INSERT 失敗時，**catch 後回傳 `{stored:false,error:...}` 而不拋出**，呼叫方未檢查 `stored`。故「查不到 Cron row」不等於「原排程一定沒觸發」，也不能因無錯誤冒認 Cron 寫入已成功。

`readRecentCronRuns` 目前最多回讀最近 100 列，常見 GET forensic 只列最近 20 列；Run `38850051127` 的 20 列已被後續運作擠出 10/15 時段，不可用空清單做歷史未啟動證據。

Cloudflare 只讀 Run `38850582658` 真實驗證原四個 Cron 保持設定與單一正式部署存在；其 Worker aggregate 掃描的是**另一天的短回看區間**，不含 10/15 23:35/23:55 的 invocation-level 原始綁定，無法排除 D1/CPU/日期分支等任何單一假說。

### C. 下一關卡：僅讀取、可否證、無歧義的 scheduled-invocation 回執

要對 10/15 結案，必須從 **原生 Cloudflare / D1 時點證據**取得每一預期 scheduled invocation 的：`scheduledTimeUtc`、`cron`、`actualStartUtc`、正式 `runtimeVersion`、`targetMarketDate`、當時資料 readiness、D1/CPU 執行狀態、選股資料提交/讀回、`LAST_SCAN_KEY` 父紀錄及推播 signal-id 關聯。

若舊 provider retention 無法取回完整原始時點證據，應標為 `HISTORIC_INVOCATION_NOT_PROVEN`；下一次真實交易日的觀測 **不得回填成 10/15 的已驗證結果**。不得執行正式歷史 scan POST、重送 orphan 推播、改交易持股或推測 quota 用量；既有四 Cron、3+3/不跨池/15m 條件不變。

**驗收 gate**：
- 缺 parent ⇒ 狀態 `FORMAL_MISSING`，不等同成功 0 檔，且 outbox 接受不等於手機接收。
- 有 parent ⇒ 同一 marketDate 的 Formal 摘要 + primary KV 精確 symbols/readback + outbox signal-ID 才可標示 chain accepted。
- 手機端可證明 delivery 另立驗收；僅 HTTP 200 或 outbox ACCEPTED 不合格。
- 任何正式 Worker 測點/寫入順序修補需先提出獨立 PR、exact-head CI/離線反例測試與唯讀驗收，再取得 owner 明確同意，**本次 PR 只更新鑑識文件**。
