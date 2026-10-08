# System 2 — Post-market Clock Gate V0.1 Implementation Handoff

Updated: 2026-10-09 Asia/Taipei
Status: BUILD_LANE / OFFLINE RESEARCH PREFLIGHT ONLY / NO PRODUCTION DEPLOYMENT
Canonical owner-approved time policy: \`system2/SYSTEM2_POST_MARKET_DATA_READINESS_AND_POOL_CLOCK_V0_1.md\`.

## Implemented

- \`system2/runtime/post_market_clock_gate_v0_1.mjs\`: side-effect-free asynchronous preflight, producing a canonical SHA-256 receipt with actual decision timestamp and explicit \`PRELIMINARY_ONLY\`, \`BLOCKED_REQUIRED_SOURCE\` or \`READY_FOR_DOWNSTREAM_REVALIDATION\` state.
- \`system2/tests/post_market_clock_gate_v0_1.test.mjs\`: adversarial, entirely synthetic evidence and source-clock fixtures.
- No Worker, schedule, database, webhook, API, Secret, migration or System 1 production module modified.
- Every result explicitly fixes \`finalFrozen=false\`, \`capacityWriteEnabled=false\`, \`selectionEnabled=false\`, \`livePushEnabled=false\`, \`capitalImpact=false\`, \`orderImpact=false\`, \`actualSourceVerified=false\`.

## Scope and limitations

This V0.1 gateway verifies *shapes and invariants of upstream-attested receipts*, not raw provider response bytes. \`sourceReceiptVerified\` is an upstream assertion and never independent cryptographic re-verification. It cannot qualify real market dates for production, unlock \`s2_capacity_runs\`, certify a true zero-pick or activate the 23:45/00:15 schedule. Such acceptance remains with DATA_LANE source proofs, authorized assessor/capacity pipeline, complete denominator/provenance, isolated persistence, and independent physical audit.

Synthetic readiness is \`READY_FOR_DOWNSTREAM_REVALIDATION\` only, not \`FINAL_FROZEN\`.

Clock restrictions:
- 19:00 is preliminary no matter how many source receipts are READY.
- The local 23:45 / T+1 00:15 minute is checked for the target session T. A delayed invocation is blocked from reusing the scheduled decision clock until a new actual-time decision is authorized and independently validated.
- Recovery requires a prior blocked and hash-identified 23:45 observation of T; no recomputation of target T based on the current calendar date.
- The *next eligible session* must come from an upstream official trading-calendar receipt; a weekend/holiday is not guessed by adding one weekday.
- Observed first-ready is only an upper bound on source availability, never an invented official publication timestamp.
- Incomplete or paid-only required sources are excluded; unrelated strategy source sets can still be independently evaluated for downstream revalidation, but no capacity is written.
- Real duplicate writes/conflicts, physical D1 quota exhaustion and calendar receipt cryptographic proof are downstream work, not falsely claimed to be solved.

## Next required integration

1. DATA_LANE: supply exact source-date and first-observed PIT receipts, including independent raw response hash verification and full TWSE/TPEx coverage/continuity, without extra paid APIs.
2. REMEDIATION_LANE: certify global D1 write-budget and replay safety for shared free-tier account.
3. BUILD_LANE: separately wire this preflight into actual authorized strategy assessment/ranking/capacity with preservation of receipt hashes and cross-midnight dates.
4. AUDIT_LANE: independently reproduce stale HTTP-200, late timestamp, future source, missing paid source, partial coverage, midnight drift, and tampered receipt negatives.
5. Only afterward pursue protected System2 Worker/Cron change with physical source observations, isolated D1 readback, System2 CI and V8 regression. System1 23:35/23:55 must remain unchanged.
