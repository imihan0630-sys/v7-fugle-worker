# HISTORY_SOURCE_REVALIDATION_V2 — research-only falsification note

Date: 2026-09-26 Asia/Taipei  
Status: FORMAL_OPTIMIZATION_CANDIDATE / CLASS-B IMPLEMENTATION REQUIRES OWNER APPROVAL  
Formal Core: LOCKED / unchanged

## Question

Can the B-130 stale-history defect be repaired without the false rejection introduced by PR #100's strict market-session continuity rule?

## Positive evidence

- B-130 proves a stale 60+ bar cache can materially alter existing Formal A/B feature results and eligibility.
- Current history-seed logic already has a bounded batch refetch path.
- Fugle Historical Candles supports explicit `adjusted=false`; the research contract pins raw-price semantics instead of relying on an undocumented default.
- Current after-market selection is already intersected with today's official market rows, so a symbol with no current traded bar cannot become a Formal candidate that day.

## Counterevidence that falsifies PR #100 as a final design

Strict `latest prior bar == previous market session` and exact last-60 market-session continuity is not a valid *final* admission rule:
- TWSE 8422 has a verified multi-session suspension before its 2025-11-17 resumption.
- TPEx 5314 has a verified 2025-03-20..2025-03-28 suspension before 2025-03-31 resumption.
- No-transaction sessions can also create legitimate calendar gaps.

Those cases may look identical to stale cache when only dates are inspected.

## V2 design under test

1. Treat market-session mismatch as a **suspicion trigger only**.
2. If the cache is structurally healthy and exactly aligned, keep the zero-call fast path.
3. If suspicious, refetch that symbol's historical daily bars with explicit `adjusted=false`.
4. Validate the freshly fetched series as an **actual-bar sequence**:
   - valid dates;
   - strict order;
   - no duplicates;
   - no future leakage;
   - at least the required prior bars.
5. Do **not** require every market session to have a bar in the fresh provider series.
6. Fresh provider failure/ambiguity => UNKNOWN/DATA_INCOMPLETE, never stale-cache fallback.
7. Strategy filters (price >= 10, ETF/etc exclusions) must not define raw bar-presence truth.

## Important source-boundary correction

Current `normalizeMarketRow()` is unsuitable as a historical bar-presence denominator because it applies Formal eligibility filters, including `close < MIN_CLOSE_PRICE`. Presence/revalidation evidence must be sourced before those filters.

## Why this is not yet a Formal optimization candidate

This prototype still needs:
- executable deterministic CI evidence;
- performance/call-budget analysis for revalidation queues;
- integration design against the current history-seed state machine;
- proof that clean-cache cases preserve current Formal outputs;
- bounded failure/rollback semantics;
- explicit separation from the corporate-action price-continuity problem.

No Worker.js/runtime/D1/KV/selection/ranking/threshold/capital/monitor/push behavior is changed by this branch.


## V2.1 gap-reconciliation strengthening

The first Class-A prototype falsified PR #100's strict market-session continuity as a final admission rule, but it still trusted a fresh Fugle response too quickly.

New counterexample:
- a provider can return 60 ordered/raw bars and still omit one recent official traded session;
- a naive "fresh response + >=60 bars" test would accept that shifted window and silently change rolling features.

V2.1 therefore adds a bounded official-gap reconciliation rule:
1. fresh provider response must still be explicit `adjusted=false`;
2. compare the provider's required rolling window against official market sessions;
3. inspect only market-session dates absent from the provider window;
4. for each gap, require a COMPLETE official raw daily presence receipt built before Formal eligibility filters;
5. official traded row present => `FRESH_PROVIDER_MISSING_OFFICIAL_BAR` / reject;
6. complete official source with no actual traded row => legitimate symbol-session gap;
7. missing/incomplete official source => UNKNOWN / fail closed.

This design does not need to infer why the symbol did not trade. Corporate-action cause and price-continuity semantics remain separate lanes.

Additional falsification guards:
- sub-NT$10 historical traded rows remain presence=true;
- incomplete official market row counts cannot prove absence;
- provider failure and official-gap proof failure never fall back to suspicious cache;
- no Worker/runtime/D1/KV/Formal behavior changes.

Status remains FALSIFICATION_IN_PROGRESS until executable CI passes for V2.1 and operational call-budget/integration/rollback evidence is quantified.


## V2.2 bounded operational-cost model

Known production architecture:
- history seed window: 17:00-17:59 Taipei;
- max warmup batch: 6 symbols per invocation;
- therefore theoretical provider-call capacity inside the existing one-hour seed window is 60 x 6 = 360 symbol-history calls/day.

V2.2 freezes these operational rules:
1. healthy exact-continuity cache remains zero-call fast path;
2. suspicious symbols reuse the existing seed queue/refetch path; no parallel emergency warmup;
3. provider-call overflow remains pending/UNKNOWN and must never fall back to stale history;
4. official gap verification is deduplicated by (exchange,date), because each official daily endpoint is market-wide;
5. a future prospective raw-presence ledger can turn already-captured gap dates into local reads; shared runtime/storage implementation would be Class B and is not implemented here.

Synthetic stress guards:
- 120 suspicious + 30 baseline calls fits the 360-call envelope;
- 100 symbols sharing one TWSE gap date require one official market-day lookup, not 100;
- a complete presence ledger reduces network gap lookups for covered dates to zero;
- a 2,000-symbol stale blast radius exceeds the one-hour capacity by 1,640 calls and must fail closed rather than silently use stale history.

Still UNKNOWN:
- current live suspicious-symbol incidence;
- current distinct gap-date incidence;
- exact production latency distribution under network retries.

These require read-only production observability before EVIDENCE_READY. No production mutation is authorized by this note.


## V2.3 reusable gap-ledger fast path

Operational falsification found a repeat-cost problem in V2.1: a legitimate suspension/no-trade gap remains inside the rolling 60-actual-bar window for many sessions, so a strict market-session mismatch trigger would repeatedly refetch the same symbol.

V2.3 therefore reuses COMPLETE official no-trade gap receipts during cache validation:
- provider/cache gap + COMPLETE official traded=false => explained symbol-session gap; cache may remain fast-path valid;
- provider/cache gap + COMPLETE official traded=true => CACHE_MISSING_OFFICIAL_BAR / refetch required;
- no complete receipt => REVALIDATE;
- provider bar outside official market-session proof => UNKNOWN source/calendar conflict.

This preserves the useful zero-call fast path even for previously verified suspension/no-transaction windows and prevents repeated daily provider refetches solely because a legitimate gap has not yet rolled out of the 60-bar window.

The receipt is factual bar-presence evidence, not a corporate-action-cause inference. Corporate-action technical-continuity adjustment remains a separate prerequisite when relevant.

Status remains FALSIFICATION_IN_PROGRESS pending CI for V2.3 and production-observability/incidence evidence.


## FORMAL_OPTIMIZATION_CANDIDATE — HISTORY_SOURCE_REVALIDATION_V2.3

Candidate class: Class B shared-runtime/data-integrity change.  
Promotion meaning: evidence-backed proposal worth explicit owner review; NOT authorization to merge or deploy.

### Exact Formal behavior that would change
- Formal after-market feature construction may use a symbol history only after freshness/source validation.
- Suspicious cached history is revalidated from explicit raw provider history and official raw gap-presence evidence.
- Stale/missing-provider histories become DATA_INCOMPLETE/UNKNOWN instead of entering A/B feature calculations.
- Verified official no-trade gaps remain eligible and are reusable via gap receipts; they are not falsely rejected as stale.

No A/B definition, factor weight, score, threshold, ranking comparator, 3+3 quota, capital, BUY/ADD/REDUCE, monitoring, signal or push rule changes.

### Expected benefit
- Prevent recurrence of B-130 class false eligibility caused by stale rolling history.
- Avoid PR #100 class false rejection of legitimate TWSE/TPEx suspension/no-transaction gaps.
- Make rolling MA/ATR/platform/volume features auditable against explicit raw-source semantics.

### Counterevidence and failure modes retained
- Historical/current suspicious-symbol incidence is still UNKNOWN because production D1 observability is incomplete.
- Extreme blast radius can exceed the existing 360 provider-call/hour seed envelope; overflow must remain pending/UNKNOWN.
- Official raw gap source failure cannot be converted to NO_TRADE.
- Corporate-action price-continuity semantics are separate and are not solved by bar-presence validation.
- Additional shared-runtime storage/read path for durable gap receipts creates operational complexity and requires regression/rollback evidence.

### Falsification evidence
- Real B-130 witness: stale history materially altered existing Formal technical eligibility.
- TWSE 8422 and TPEx 5314: strict market-session continuity false-rejects legitimate symbol-session gaps.
- Fresh-provider missing-bar counterexample: >=60 ordered fresh bars can still omit one official traded session; V2.1 rejects it.
- Strategy-filter leakage counterexample: sub-NT$10 traded rows must remain bar-presence truth even though Formal later excludes them.
- Provider failure, incomplete official receipt, duplicate/out-of-order/future bars and provider/calendar conflicts fail closed.
- V2.3 proves verified no-trade gaps can be reused in the fast path instead of causing repeated provider refetches.
- V2.2 cost stress preserves the 360-call one-hour seed envelope, deduplicates official gap calls by exchange/date, and exposes overflow rather than hiding it.

### Executable CI
- Research History Source Revalidation V2: repeated SUCCESS through V2.3.
- V8 Regression Tests: SUCCESS.
- V8 Repair CI: SUCCESS.
- Draft PR #105 remains unmerged and un-deployed.

### Protected invariants
Formal formulas/ranking/quotas/capital/trading/monitoring/push are unchanged by the research prototype.
A future Class-B implementation must prove the same frozen-output invariants on clean input and may change only data admission/repair outcomes where input integrity differs.

### Rollback
- Keep V2.3 implementation behind a dedicated Class-B branch/PR.
- Preserve pre-change Worker/runtime version and history-seed schema.
- Rollback by reverting the Class-B patch and restoring the previous schema/read path; do not reuse V2-produced UNKNOWN states as negative signals.

### Owner decision boundary
This candidate is now eligible to be proposed for Class-B implementation/integration testing.
It is not Production-ready by status alone and must not be merged/deployed without explicit owner approval.
