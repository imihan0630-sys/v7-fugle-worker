# HISTORY_UNSCHEDULED_CLOSURE_PROOF — Class C Data-Integrity Repair Proposal

Updated: 2026-09-30 Asia/Taipei
Owner lane: shared history/source admission / System 1 engineering
Origin dependency: 07｜產業與供應鏈研究室 BR-030
Status: PROPOSAL_READY / OWNER_APPROVAL_REQUIRED / NOT_IMPLEMENTED
Formal Core changed: NO

## 1. Problem statement

The first expected V8.14 prospective sector-gate cohort on 2026-09-29 was invalid because production history admission reported:

- usableSymbols = 0
- unusableSymbols = 1,883
- OFFICIAL_GAP_PROOF_UNAVAILABLE = 1,872
- INSUFFICIENT_PRIOR_BARS = 11

The sampled common unresolved gap date was 2026-07-10.

Independent official evidence establishes that 2026-07-10 was a legitimate whole-market closure date associated with BAVI typhoon closure in Taipei and TWSE closure semantics. Therefore this date must not be treated as an unexplained missing trading bar.

## 2. Exact code-path diagnosis

Current production code has two distinct mechanisms:

1. `MARKET_CALENDARS` / `isTradingDate()` decides which calendar weekdays are expected market sessions.
2. `HISTORY_PRESENCE_V1` receipts prove whether an individual symbol traded on an otherwise expected market date.

The defect is at the boundary between those mechanisms:

- `MARKET_CALENDARS` contains a preloaded 2026 planned-holiday set.
- `loadTradingCalendar(env, year)` returns immediately when the year already exists in `MARKET_CALENDARS`.
- The preloaded planned schedule does not include the later unscheduled 2026-07-10 typhoon closure.
- `historyStructuralShape()` therefore classifies 2026-07-10 as an expected session and emits it as a gap.
- Formal `buildHistoryAdmissionMap()` calls `validateHistorySourceRevalidation(... allowNetwork:false ...)`.
- That path can only read a cached per-market/date `HISTORY_PRESENCE_V1` receipt.
- A whole-market closure cannot naturally satisfy the ordinary presence-receipt minimum of hundreds of listed symbols because there are no market trades to enumerate.
- Missing receipt then becomes `OFFICIAL_GAP_PROOF_UNAVAILABLE`, which fails closed for every affected symbol.

The current architecture handles:
- scheduled holidays;
- weekends;
- individual symbol no-trade/suspension gaps on an open market.

It does **not** yet have a first-class proof type for:
- unscheduled whole-market closures.

## 3. Why this is Class C

A repair can change whether historical bars are admitted into Formal feature construction. On the same frozen inputs, correcting a false market-closure gap may change:
- feature availability;
- Formal candidate eligibility;
- selected symbols downstream.

Therefore this is not a research-only Class A change. It requires explicit owner approval before implementation/merge/deploy.

This proposal does not recommend any A/B, ranking, score, quota, capital, entry/exit, monitoring or push-rule change.

## 4. Proposed repair architecture

Add a separate receipt family:

`UNSCHEDULED_MARKET_CLOSURE_RECEIPT_V1`

Minimum fields:
- schemaVersion;
- marketDate;
- marketScope = TWSE / TPEx / BOTH;
- closureType = TYPHOON / NATURAL_DISASTER / EMERGENCY / OTHER_OFFICIAL;
- authority;
- officialSourceUrls[];
- sourcePublishedAt if available;
- capturedAt;
- effectiveFrom / effectiveTo when applicable;
- rawEvidenceHashes[];
- complete;
- supersedes / supersededBy;
- provenance notes.

The receipt is **not** a traded-symbol receipt.

## 5. Admission decision order

For a weekday that appears missing from provider history:

1. If official calendar says non-trading day -> exclude from expected sessions.
2. Else if a valid `UNSCHEDULED_MARKET_CLOSURE_RECEIPT_V1` proves the entire relevant market was closed -> classify `VERIFIED_MARKET_CLOSURE` and exclude that date from required symbol sessions.
3. Else treat the date as an expected open-market session.
4. On an open-market session:
   - use existing `HISTORY_PRESENCE_V1` to distinguish a legitimate symbol-specific no-trade gap from a missing official traded bar.
5. If neither whole-market closure proof nor sufficient symbol-presence proof exists -> remain fail-closed UNKNOWN.

This preserves the original V8.12 safety principle.

## 6. Evidence hierarchy for an unscheduled closure

A closure receipt should require authoritative evidence, preferably at least one market/exchange-level source plus corroboration where available.

Strong evidence:
- TWSE/TPEx official closure/non-business-day statement;
- official exchange schedule update;
- competent government closure announcement together with documented exchange closure rule.

Corroborating evidence:
- official index history has no session;
- central-bank/clearing/banking closure announcement;
- Central Weather Administration disaster/typhoon evidence.

Absence of an index row alone is not sufficient proof.

## 7. Do not hardcode 2026-07-10 as the fix

A one-date patch would repair the witness but leave the architectural defect.

The implementation must support future:
- typhoon closures;
- earthquakes;
- emergency government closures;
- other officially declared market-wide non-trading days.

2026-07-10 is the regression fixture, not the business rule.

## 8. Required regression / adversarial tests

### Positive fixtures
- 2026-07-10: verified whole-market closure -> not an unexplained missing bar.
- ordinary scheduled holiday -> continues to be excluded through calendar logic.
- individual stock suspension/no-trade on an open session -> existing presence-receipt path still works.

### Negative / adversarial fixtures
- ordinary open trading day + missing provider bar + official traded-symbol presence -> `MISSING_OFFICIAL_TRADED_BAR`.
- ordinary open trading day + no sufficient proof -> `OFFICIAL_GAP_PROOF_UNAVAILABLE`.
- closure receipt with wrong date -> reject.
- wrong exchange/market scope -> reject.
- stale or malformed receipt -> reject.
- self-authored/untrusted source without authoritative provenance -> reject.
- future-dated evidence not known at decision/revalidation time -> reject for PIT use.

### Protected invariants
- A/B formulas unchanged.
- Sector gate 40% / -1% / 0.5 unchanged.
- Ranking/comparator unchanged.
- 3+3/Top6 behavior unchanged except where candidates were previously blocked solely by a falsely classified closure gap.
- Capital/BUY/ADD/REDUCE/SELL unchanged.
- Monitoring/signals/push semantics unchanged.
- Genuine missing traded bars remain blocked.
- UNKNOWN remains fail-closed.

## 9. Deployment verification if owner approves

Before merge/deploy:
1. branch + rollback point;
2. unit/adversarial tests;
3. replay 2026-09-29 read-only preview;
4. verify 2026-07-10 resolves as `VERIFIED_MARKET_CLOSURE`;
5. verify remaining history failures by reason;
6. compare protected Formal logic/settings;
7. no production write during preview;
8. only after regression evidence, follow normal authorized production deployment path;
9. read back deployed version and history admission;
10. record rollback SHA and receipts.

## 10. Expected benefit / risk

Expected benefit:
- prevent a legitimate emergency market closure from falsely invalidating an entire universe's history;
- restore the intended V8.12 distinction between real missing K bars and legitimate no-trade dates;
- allow BR-030 and all other prospective research to count dates only after genuinely valid history admission.

Primary risk:
- an over-permissive closure proof could admit a genuinely missing traded session.

Therefore proof must be authoritative, date/market-scoped, versioned and fail-closed.

## 11. Current decision

`PROPOSAL_READY / OWNER_APPROVAL_REQUIRED / NOT_IMPLEMENTED`

This is a correctness/data-integrity repair proposal, not evidence that any trading strategy improves returns and not a `FORMAL_OPTIMIZATION_CANDIDATE` for alpha.

Related receipts:
- `research/br030_first_prospective_admission_receipt_20260929_v0_1.json`
- `research/br030_history_admission_dependency_20260930_v0_1.json`
