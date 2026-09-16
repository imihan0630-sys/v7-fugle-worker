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
