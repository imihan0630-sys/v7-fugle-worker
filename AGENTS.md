# V8 project continuity and safety

Read `VERSIONING.md` before assigning any new version number. Version level is determined by architecture vs feature vs bug-fix scope, not by commit count.\n\nRead `PROJECT_HISTORY.md` after `REQUIREMENTS_30.md` when recovering context from a new ChatGPT thread. It contains the chronological cross-chat project history; GitHub/runtime evidence overrides remembered chat state.\n\nRead REQUIREMENTS_30.md in full before changes. It records the user's latest authoritative specification and explicit incomplete acceptance items. Older Worker comments and prior versions are not the specification.

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



## Deep-learning continuity
- Scheduled or manual 台股深度學習 must read `DEEP_LEARNING_CHECKPOINT.md` first, then the latest `RESEARCH_CHECKPOINT.md`, `RESEARCH_WORKLIST.md`, and `RESEARCH_ENGINEERING_GOVERNANCE.md` before continuing.
- `DEEP_LEARNING_CHECKPOINT.md` is the durable cursor for deep-learning progress across ChatGPT threads. Do not restart from scratch when a chat changes or becomes too long.
- Every substantive deep-learning run must write its evidence, counter-evidence, redundancy/bias checks, candidate handoff status, and exact next continuation point back to that file before ending. Re-read its latest SHA before write and merge concurrent progress rather than overwriting it.
- Deep-learning findings remain research-only until they pass the existing governance path; this continuity rule does not authorize Formal Core changes.

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


## Latest continuity: V8.0.1, 2026-09-19 Taipei

- Project generation is V8. Current production runtime is `8.0.1-requirement11-q4-eps`.
- Requirement 11 is complete and removed from `incompleteRules`. Remaining incomplete rules are 17,18,19,26,27,28,29.
- Q1-Q3 candidate EPS uses verified direct MOPS single-quarter statements. Q4 uses the TWSE Financial Comparison E點通 documented method: same-company/year Q4 cumulative EPS minus Q3 cumulative EPS, with method marker `MOPSFIN_OFFICIAL_Q4_CUMULATIVE_MINUS_Q3`.
- Q1 previous-quarter Q4 uses that same verified method. EPS QoQ is allowed only when current and previous single-quarter values are verified; negative/zero prior EPS does not produce a percentage.
- The older 7.5.25 statement that Q4 is unsupported is historical and superseded by V8.0.1.
- Production build chain now ends with `scripts/apply_v8_0_1.py` after the 7.5.33 patch.
- Official quality acceptance run 35434378057 succeeded without changing formal plans, without 3Min POST, and without phone push.
- Do not claim all 30 rules complete: `requirements30Complete=false` remains correct.


## Latest continuity: V8.0.2, 2026-09-19 Taipei

- Current production runtime is `8.0.2-requirement26-acceptance`.
- Requirement 26 remains incomplete until a genuine new after-market `V7_PLAN_2` is POSTed to 3Min and the configured readback returns an exact match. V8.0.2 persists that proof and only then removes rule 26.
- Historical 2026-09-18 scan had a valid full V7_PLAN_2 payload but 3Min write HTTP 401, so sent=false/verified=false. Do not reinterpret it as acceptance.
- 3Min service-side account inspection showed the old endpoint was deleted on 2026-09-17 by Free-plan 7-day cleanup; an attempted 2026-09-18 call to the deleted URL was rejected.
- New endpoint: V8 今日標的與交易計畫推送, id `01a0b909-9427-7fa9-810e-4c4383187ce9`, URL `https://api.3minapi.com/api/v1/data/cum6sm2952x3sz9gph52w`, deployed to production and independently accepted a production test POST (202).
- Collaboration key `V8 Cloudflare Worker` exists with create+read. Never put its raw key in chat or GitHub. Current blocker is updating Cloudflare THREEMIN_API_URL, THREEMIN_VERIFY_URL and THREEMIN_API_TOKEN to the new endpoint/key through the normal protected settings path.
- Free-plan endpoints are automatically deleted after 7 days. Do not call this a durable long-term repair unless the plan/storage design changes.
