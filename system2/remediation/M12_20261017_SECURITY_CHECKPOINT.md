# System 2 REMEDIATION_LANE | M12 #1238 | Checkpoint 2026-10-17

Repository canonical baseline at construction: `d640a7580002eb108bf7012d9923790b2c9e639d` (recheck `main` before merge). This sidecar deliberately does NOT overwrite `system2/SYSTEM2_REMEDIATION_CHECKPOINT.md` because legacy REMEDIATION PR #1122 still owns an unmerged change to that conflict unit. No DATA or BUILD files edited.

## Scope and actual source-level remediation

- Main already guards 4 named D1-capable GitHub writers: RAW_COPY, DAILY_DIAGNOSTIC, RECENT_A1_WARMUP, MANUAL_SCHEMA_APPLY. Existing job concurrency `s2-dest-d1-historical-and-diagnostic-writer` + read-only GH current/prior UTC-day run census + near-reset bounded guard are retained unchanged. The destination credential workflow census currently identifies 14 references to `S2_SCHEMA_DEST_D1_WRITE_TOKEN` (4 guarded writer-class, 10 classified other); this is NOT account-wide Cloudflare actor authority proof.
- Independent defect class: prior static assertions relied in places on unanchored `code.includes()` substring matches for interlock command/lock/credential, which can match comments or non-executed blocks and fail to notice a bypassed `if`, early secret injection, wrong writer ID, inactive concurrency, or a divergent budget action. The four formal writer workflows themselves are *not shown physically bypassed* by this finding.
- New remediation-owned offline module `system2/remediation/m12_active_step_writer_interlock_integrity_v0_1.mjs` structurally inspects the selected actual active Job and each real Step (not commented text); validates the exact job-level lock, `cancel-in-progress:false`, destination environment, main/manual gates, expected writer identity, single active `day_interlock` command, precedence before any destination D1 token, owner manual APPLY_ONCE isolation, real shared quota action and all target-token steps' `if` barriers. Added `system2/tests/m12_active_step_writer_interlock_integrity_v0_1.test.mjs` with **21 adversarial bypass cases plus two positive baseline tests**; regression must fail before any GitHub PR could merge new unsafe step.
- This fix is *Class A anti-bypass detection for four known Github writer workflows*, not a formal Cloudflare-native atomic lock, not all-CF-writer census, and not D1 quota ledger authorization. The owner **80,000 billed rowsWritten / UTC day** ceiling remains unchanged.

## Physical and next gates

- #1238 M12 cannot become audited-pass until AUDIT_LANE independently authenticates provider-based **account-wide D1 rowsWritten billing / freshness and writer registry / original true atomic lease or equivalent operator-exclusive enforcement**; old GH source code/CI does not establish physical provider atomicity.
- Original destination D1 historical data was **47,420 of 84,688** source A1 rows physically transported at last source-of-truth DATA receipt, leaving **37,268**; this is a time-scoped last-known observation, not a fresh 10/17 readback. Frozen physical destination records still zero in that known receipt; PIT-A per-symbol 2330 and 3287 remain 0/2 accepted at the owner three-track handoff.
- BUILD P0 daily `NON_PIT_PREVIEW` is explicitly **independent** from old D1 copy / PIT-A / PIT-B / complete Frozen. This remediation adds no new preview launch gate and does not alter Scheme C, market-source fetching, build selection policies or its consumer workflow. Native next market-day SOURCE/AUDIT → Scheme C preview remains a separate BUILD deliverable.
- No Cloudflare API/SQL executed, no new D1 write or migration action dispatched, no Schema, Worker/Cron, Secret, paid tier, System1 V8 Formal, live strategy / capital / push modified. No auto-claim of M12 independent audit PASS.

## Handoff

1. AUDIT_LANE: replay original four active workflow structures and 21 negative cases; independently examine original GraphQL/Cloudflare writer actor scope before closure; do not label `s2cmd:audited-pass` based only on offline CI.
2. DATA_LANE: continue existing owner-approved quota/day-gated single writer migration only under its own original positive authorization; no competing historical RAW_COPY rerun by remediation.
3. BUILD_LANE: continue NON_PIT_PREVIEW research now; no D1 migration dependency added by remediation.
4. REMEDIATION_LANE: investigate provider-native account-level atomic lease and unregistered non-GitHub writers with least-privilege read-only evidence when authorized. Do not invent realtime spendable 80k headroom from lagged Analytics.

Status: **SOURCE_LEVEL_BYPASS_FIREWALL_PROPOSED / M12_PHYSICAL_ATOMIC_PENDING** until merged+independent audit. Never mark M12 complete from source-only tests.
