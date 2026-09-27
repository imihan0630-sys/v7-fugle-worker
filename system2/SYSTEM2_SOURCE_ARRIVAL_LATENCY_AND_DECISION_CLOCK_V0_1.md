# System 2 Source Arrival Latency（資料來源到達延遲）與 Decision Clock（決策時間點）契約 V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH MEASUREMENT CONTRACT / DECISION CLOCK UNFROZEN / CAPTURE DISABLED
Scope: System 2 only; read-only official-source observation

## Purpose

在啟用任何 AFTER_CLOSE_DECISION_CAPTURE（盤後決策凍結）排程前，先用前瞻、可稽核且不寫入交易系統的方式量測：

1. 官方資料在每個交易日最早何時可被 System 2 實際讀到；
2. 回傳日期、欄位與最低覆蓋是否同時符合契約；
3. 哪些來源會限制盤後 Decision Clock（決策時間點）；
4. 哪些缺口仍使決策鐘無資格凍結。

這個契約不啟用 Worker capture（資料擷取），不建立 Cron（排程），不寫 System 2 D1，也不讀寫 System 1/V8 runtime。

## Measurement truth

`firstReadyAt` 是「量測器第一次觀察到 READY 的時間上界」，不是來源官方發布時間。

若 14:00 仍為 NOT_READY、14:05 首次 READY，唯一可聲稱的是：

- 到達時間下界：14:00 之後；
- 到達時間上界：14:05 以前；
- 觀測區間寬度：5 分鐘。

不可把 14:05 寫成精確發布時間。

以下資料不得進入延遲統計：

- 在目標交易日之後回頭查詢到的歷史資料；
- 只有 HTTP 成功但日期、schema（欄位結構）或最低覆蓋不符；
- 來源錯誤、逾時或 403/5xx；
- 盤中尚未收盤但資料日期已等於當日的暫態資料。

## V0.1 observed official sources

| Probe ID | Source family | Official read-only endpoint class | Clock role | Minimum verified coverage |
|---|---|---|---|---:|
| A1_TWSE_DAILY_CLOSE | A1 daily OHLCV | TWSE OpenAPI `STOCK_DAY_ALL` | REQUIRED_DAILY_GATE | 600 ordinary symbols |
| A1_TPEX_DAILY_CLOSE | A1 daily OHLCV | TPEx OpenAPI `tpex_mainboard_daily_close_quotes` | REQUIRED_DAILY_GATE | 450 ordinary symbols |
| A2_TAIEX_CLOSE | A2 TAIEX | TWSE `FMTQIK` | CONTEXT_OBSERVATION | target-date index row |
| A3_TWSE_INSTITUTION_FLOW | A3 institutions | TWSE `T86` | OPTIONAL_OBSERVATION | 600 ordinary symbols |
| A3_TPEX_INSTITUTION_FLOW | A3 institutions | TPEx `dailyTrade` | OPTIONAL_OBSERVATION | 450 ordinary symbols |
| A6_TWSE_VALUATION | A6 PE/PB | TWSE `BWIBBU_d` | OPTIONAL_OBSERVATION | 600 ordinary symbols |
| A6_TPEX_VALUATION | A6 PE/PB | TPEx `tpex_mainboard_peratio_analysis` | OPTIONAL_OBSERVATION | 450 ordinary symbols |

All requests are GET-only. Raw payloads are not stored in the measurement artifact; the artifact stores source ID, timestamps, HTTP status, payload date, verified record count, semantic state and error class.

## Probe states

- `READY`: target date, schema, minimum coverage and after-close finality all pass.
- `NOT_READY`: source responded with valid schema but target-date data is absent, or the observation is before the 13:30 close.
- `SOURCE_ERROR`: network/timeout/non-success HTTP. This is not evidence that data was unpublished.
- `INVALID_PAYLOAD`: source responded but schema or coverage violates the contract.
- `NOT_APPLICABLE`: reserved for periodic sources on dates where no publication is expected.

Missing remains UNKNOWN through explicit non-READY states; it never becomes zero or negative evidence.

## Daily clock gates and periodic dependencies

V0.1 can directly measure the same-session A1 TWSE and TPEx close-data gates.

It does not yet prove the two other required dependencies for the first two Limited Shadow（有限影子模擬） lanes:

- `A5_QUARTERLY_FINANCIALS`: requires a separate filing-vintage/publication-event observer. Quarterly data is not a daily same-session arrival series.
- `B2_INDUSTRY_THESIS_PROSPECTIVE`: requires a derived prospective industry-thesis snapshot observer with frozen universe/classification provenance.

Therefore V0.1 daily measurements may identify an operational lower bound, but the full first decision clock remains `BLOCKED_DEPENDENCIES` until A5 and B2 measurement coverage exists.

## Decision-clock preregistration

The measurement code freezes these research gates before outcomes:

- 10 complete independent trading dates: at most `PROVISIONAL_ELIGIBLE`;
- 20 complete independent trading dates: may become `FREEZE_ELIGIBLE`;
- both A1 TWSE and A1 TPEx must be READY on every included trading date;
- observation intervals for required daily gates must be no wider than 5 minutes for freeze eligibility;
- A5 and B2 dependency coverage must be explicitly true;
- candidate time = worst observed required-source upper bound + 15-minute safety buffer, rounded up to the next 5 minutes.

Even `FREEZE_ELIGIBLE` is not automatic authorization. The output always keeps:

- `candidateIsAuthorizedDecisionClock=false`;
- `exactCronFrozen=false`;
- `cronAuthorized=false`.

The owner must separately approve the exact decision clock and later separately approve Cron activation.

## Read-only workflow

Workflow:
`.github/workflows/system2-source-arrival-readonly.yml`

Properties:

- `workflow_dispatch` only;
- no `schedule` block;
- repository permission is `contents: read`;
- no Cloudflare secret is used;
- no Worker/D1/KV API is called;
- no POST/PUT/PATCH/DELETE request exists;
- no System 1/V8 endpoint or runtime is used;
- result is stored only as a GitHub Actions artifact and job summary;
- the workflow does not request capture arming or mutate Cron. The independent
  `system2-worker-state-audit.yml` remains authoritative for live cloud state.

For a real arrival interval, start a bounded manual run on the target trading date shortly after the 13:30 close, with 5-minute polling. Starting after all sources are already ready yields only a loose upper bound and cannot recover the true earlier arrival time.

## Non-trading days

Weekend/holiday smoke runs must set `expected_trading_day=false`. They may verify connectivity and schema behavior, but:

- `dailyGateComplete=false`;
- they do not count as independent trading dates;
- they cannot influence the candidate decision clock.

## Safety invariants

1. System 2 Worker capture stays disabled.
2. System 2 Worker Cron remains zero.
3. System 2 D1 is not written by this workflow.
4. System 1/V8 Formal Core, runtime, Worker, D1, KV, Cron, monitoring, notification and selection behavior are untouched.
5. No historical lookup can masquerade as prospective arrival evidence.
6. Source errors remain source errors; they never become NOT_READY or zero evidence.
7. No exact clock is frozen from a single day or a retrospective query.

## Current conclusion

`DECISION_CLOCK_STATUS = UNFROZEN / BLOCKED_DEPENDENCIES / WAITING_PROSPECTIVE_MEASUREMENTS`

The next evidence step is prospective same-day measurement on independent trading dates, plus dedicated A5 filing-vintage and B2 derived-industry-snapshot observers. Cron activation remains outside this contract.
