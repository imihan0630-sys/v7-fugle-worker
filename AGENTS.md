# V7 project continuity and safety

Read REQUIREMENTS_30.md in full before changes. It records the user's latest authoritative specification and explicit incomplete acceptance items. Older Worker comments and prior versions are not the specification.

- Thousand-price pool: official close >=1000, at most3. Non-thousand: official close <1000, at most3. No cross-pool filling, no forced six. Official close <10 excludes; =10 may qualify.
- Strategy A is pullback; B is breakout. Formal buy/add/reduce/sell/stop confirmation is15-minute;10-minute only auxiliary. Continuous signal once; released then reactivated can notify again with a new episode ID.
- Current after-market schedule is18:10 Taipei (10:10 UTC). Preserve existing four Cron expressions, KV, D1, configuration and push settings. Do not rebuild or clear them to fix code.
- Preserve actual positions and their risk plans. Do not overwrite holdings with tomorrow's new NONE-stage pool. Do not issue add on the same formal bar as the first-entry notification or guess missing fill timing.
- Source/runtime divergence existed: GitHub main was7.5.5 while Cloudflare was7.5.6. snapshots/Worker_V7_7.5.6_SIGNAL_STATE_FIX.js is a reference, not proof the deployed source is unchanged. Resolve exact deployed version before rollback.
- Run node tests/test_requirements_repair.mjs with V7_TEST_WORKER_PATH pointing to Worker.js. CI and mock HTTP acceptance are not real phone delivery, real market scans or full30-rule completion.
- Deploy through existing code-only Cloudflare Actions. Require regression success, verify /api/version against source, existing bindings, TEST_MODE and original targets. Keep incomplete requirements explicit.
- Live administrator operations require the existing ADMIN_TOKEN through normal authorization. GitHub Actions may use the normally configured V7_ADMIN_TOKEN secret. Never expose tokens, extract values from Cloudflare, repurpose deployment credentials as admin authorization, or add authentication bypasses.
- 3Min write acceptance and readback consistency are distinct. Use only the owner's existing configured THREEMIN_VERIFY_URL and verified schema; do not invent an endpoint. TEST_MODE must not write to external3Min or send real push.
- Data missing is not successful0 picks. Failed scans retain prior good configuration and are clearly labeled. Never replace missing financial/benchmark facts with neutral scores and call all30 complete.
- Every monitoring import/update handoff includes https://fugle-test.imihan0630.workers.dev/ . Do not claim globally permanent chat memory; checked-in project instructions are the continuity basis when this repo is available.

User authorizes continuing repairs without repeated OK confirmations. Stop for genuine authorization or protected-workflow blockers and state the exact required step without asking for secrets in chat.

Latest repairs7.5.21: read REQUIREMENTS_30.md latest-state section before its historical table. Actual dated INDEX/TDCC/FINANCIAL/VALUATION/ANNOUNCEMENTS snapshots and latest3 institution dates gate selection; missing inputs must fail without replacing existing good plans. Only verified same-day closing cache may precede direct fetches. Currentdata source confidence is not proof of full30 completion.

- IAS33 cumulative EPS subtraction is NOT genuine quarter EPS (weighted shares differ). Quarter EPS/growth remain null unless actual official duration and split/restatement comparability are verified; never reintroduce estimated growth to pass screening.
- Production signal state uses D1 atomic lease and snapshot, not KV-only dedup. Isolation test keys may verify storage without pushes; never test on actual symbol keys. Delivery ambiguity/crash still prevents claims of cross-system exactly-once.
- Fugle timestamps are documented Unix microseconds; actual formal candles must be same-day completed15m, quote age<=90sec, nontrial/nonhalt.10m auxiliary only. Notification is not a fill; require real firstEntryConfirmedAt and actualShares. Never replace missing actual shares with planned total shares.
- Existing4 Cloudflare Cron remain; Actions17:55/18:05 prepare inputs and18:20 conditional recovery. A single normal /api/scan onlyIfMissing POST, daily D1 lock, trading-day gate; ambiguous writes are never blindly retried. Do not invoke recover_after_market.mjs from deployment acceptance.
- This repair's deployment acceptance is official-data-only, isolated signal storage, readonly scan-preview, existing3Min GET and unsaved capital preview. Do not trigger actual re-selection,3Min POST,phone push,capital save or guessed holding mutations solely to make acceptance pass.

## Latest continuity: 7.5.23, 2026-09-17 Taipei

- Deployment and real data-only/readback acceptance succeeded in Actions run35158307940. Preserve current3 targets and200000 capital. Latest-state section of REQUIREMENTS_30.md overrides historical acceptance.
- Before14:00 Taipei, official quality synchronization uses the latest completed trading date. Explicit marketDate query for quality-status must match injected data.
- Genuine single-quarter EPS: advertised MOPS form/ajax_t164sb04, exact consolidated company/year/quarter statement, actual single-period EPS and same-statement comparator. Raw HTML is independently validated server-side before D1 normalization. Do not infer single-quarter EPS by subtracting cumulative values.
- Candidate EPS review includes all provisional qualifiers BEFORE independent3+3 quotas; only readonly epsReviewOnly preview may skip the hard final quarter-review gate. Real scans require complete review. Current Q4 actual single-period source and adjusted QoQ remain unsupported; disclose, never fabricate.
- tests/scheduled_health.mjs and .github/workflows/v7-health.yml check real recurring operations at09:20/13:10/18:45 Taipei. Outside-market checks skip explicitly; scheduled configuration is not proof a future run succeeded. Never issue synthetic phone signals or invoke business scans from health verification.
- Actual phone receipt and first full V7_PLAN_2 external POST/readback remain pending. Signal lease handles concurrency, but an ambiguous webhook response or crash after provider acceptance still risks repeat delivery. Next concrete repair: persist an episode delivery reservation BEFORE webhook POST and suppress blind retries of unknown outcomes, with mock crash/timeout tests; preserve release/reactivation semantics and no-webhook retry behavior.
- This agent turn verified synchronous work; do not tell the owner the agent keeps running after a final reply. Persistent background tasks are only the verified deployed Cloudflare/GitHub workflows.

## Delivery reservation repair: 7.5.24

Signal sending now persists pendingDeliveries per episode before external POST under the existing D1 lease. Unknown responses, rejection, or a crash before ACK persistence suppress continuous-episode retries. Stale execution metadata does not release prior fired/pending signals. Genuine release permits a new episode. Missing webhook does not reserve. Mock ambiguity/crash/403/staleness/reactivation cases pass; no real phone acceptance claim. Conservative at-most-one send attempt can miss a notification when interrupted before POST; do not call this exactly-once or invent a receiver query/idempotency contract. Rules17/18/19/27 still need real end-to-end acceptance.

## Rule11 continued: 7.5.25

Official candidate EPS review now fetches the previous actual quarter for Q2/Q3 and validates company/year/quarter/duration independently server-side. Final selection requires both direct reported quarter values. Q1 prior Q4 remains unsupported, not a requirement for nonexistent future quarters. Negative/zero same-year comparison bases retain null YoY percentages and explicit separate turnaround/loss flags. Actual comparison readiness is separate from percentage readiness. Previous EPS availability does not prove split/restatement comparability: adjusted QoQ remains null, not used for scoring. Rule11 remains partially complete pending that evidence; preserve current plans/capital and use data-only deployment acceptance.
