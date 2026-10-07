# D01 DL-088 — First-Wave Taiwan PIT Empirical Data Readiness Audit V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / DATA_READINESS_AUDIT / FORMAL_CORE_LOCKED

## Purpose

Audit whether D01-02, D01-03, D01-07 and D01-09 can move from frozen L3 point-in-time specifications into the preregistered L4 OOS/prospective validation portfolio.

This audit distinguishes:
- raw historical price availability;
- point-in-time universe membership;
- symbol-session lifecycle completeness;
- technical continuity across corporate actions;
- price-limit/reference-price state;
- disposition/matching-regime state;
- actual causal replay readiness.

Data existence is not equivalent to causal replay readiness.

## Authoritative repository evidence snapshot

Observed from latest main during this tranche:
- System2 historical market-year coverage matrix spans TWSE and TPEx, 2017-2026.
- Accepted raw daily A1 history currently reaches TWSE 2024 and TPEx 2023.
- 2024 TPEx remains not accepted; the newest attempt was blocked before ingest by the D1 free-tier daily write quota after earlier transport/timeout failures. This is not evidence of source-data corruption.
- 2025 annual market-years remain pending; 2026 segmented path is repository-ready but physical execution pending.

### TWSE raw-price layer

For 2018-2024:
- dataCoverageState = PASS in every year;
- pitReadiness = PASS_CONSERVATIVE_SESSION_FINALITY in every year;
- historical universe readiness = PASS_OFFICIAL_CURRENT_NEWLISTING_DELISTING_UNION in every year;
- official delisting union complete = true in every year;
- replayReadinessState = PARTIAL in every year;
- continuityReadiness = PARTIAL_UNVERIFIED in every year;
- technicalPriceReadiness = PARTIAL_NONPRICE_OBSERVATIONS in every year;
- symbolSessionReadiness = PARTIAL_UNKNOWN_GAPS in every year.

Unknown symbol-session gaps across TWSE 2018-2024 total 4,036.

Interpretation:
RAW PRICE COVERAGE IS STRONG.
CAUSAL TECHNICAL REPLAY IS NOT YET COMPLETE.

2017 is not used in the bounded candidate manifest because the current aggregate matrix does not expose the same explicit universe-readiness fields for that row. This is a conservative manifest decision, not evidence that 2017 universe reconstruction is wrong.

### TPEx raw-price layer

For 2017-2023:
- dataCoverageState = PASS;
- pitReadiness = PASS_CONSERVATIVE_SESSION_FINALITY;
- replayReadinessState = PARTIAL;
- continuityReadiness = PARTIAL_UNVERIFIED;
- technicalPriceReadiness = PARTIAL_NONPRICE_OBSERVATIONS;
- symbolSessionReadiness = PARTIAL_UNKNOWN_GAPS.

However:
- universeReadiness = PARTIAL_OBSERVED_INTERVAL_NO_OFFICIAL_DELISTING_UNION;
- officialDelistingUnionComplete = false.

Unknown symbol-session gaps across TPEx 2017-2023 total 2,533.

2024 TPEx remains PENDING / NOT ACCEPTED.
2025-2026 remain pending.

Interpretation:
TPEx cannot currently define the primary full-Taiwan OOS denominator.

## Symbol-session lifecycle gate

The current market-year verifier historically classified missing expected symbol-sessions primarily through supplied suspension intervals. A confirmed blind spot exists for:
- regulatory stop trading;
- resumption;
- delisting;
- share conversion;
- market migration.

A normalized lifecycle contract now exists and TWSE regulatory lifecycle source implementation has been added, with positive official witnesses.

However:
- physical before/after market-year rerun evidence has not yet closed the historical UNKNOWN population;
- TPEx lifecycle-source expansion remains separately unresolved;
- absence from bounded suspension feeds cannot certify NO_SUSPENSION.

Therefore:
SYMBOL_SESSION_LIFECYCLE_COMPLETE = FALSE.

## Corporate-action continuity gate

D01 already has a corporate-action continuity firewall.

Current cross-lane evidence proves:
- mechanical ex-right/ex-dividend/capital-reduction/par-value resets can materially alter technical features;
- current provider-adjusted history is not automatically PIT-safe;
- price and share/volume continuity use separate semantics;
- NO_EVENT is legal only after event-source completeness;
- point-in-time event clocks must be retained.

Current corporate-action research also states that full replayable historical whole-market registry/completeness remains incomplete or partial across source families.

Therefore:
CORPORATE_ACTION_CONTINUITY_COMPLETE_FOR_FIRST_WAVE = FALSE.

A small set of positive mechanics witnesses is not a market-wide clean/no-action certificate.

## Suspension/resumption gate

Official TWSE and TPEx suspension/resumption source lanes have been physically observed for bounded periods.

But:
- bounded source non-match does not certify NO_SUSPENSION;
- all-history completeness is not certified;
- a 17-event integration run produced zero exact generic halt/resume matches and explicitly prohibited converting non-match into no-suspension;
- corporate-action-native stop/resume schedules can belong to a separate source family.

Therefore:
SUSPENSION_PROVENANCE_COMPLETE = FALSE.

## Price-limit / reference-price gate

D01 L3 research has verified:
- current Taiwan price-limit rule families;
- special-reference-price regimes;
- official reference/limit price source feasibility;
- limit-up/down boundary touching cannot be interpreted as ordinary free price discovery.

But daily OHLC alone cannot prove:
- historical queue lock;
- executable fill;
- complete special-day legal boundary state.

For the first-wave historical OOS dataset, a replay-bound per-symbol/per-session price-limit/reference-state receipt has not yet been materialized across the target years.

Therefore:
PRICE_LIMIT_REFERENCE_STATE_DATASET_READY = FALSE.

D01-09 is especially blocked from pattern-specific OOS claims until this state is present.

## Disposition / altered matching gate

D01 DL-068 requires a point-in-time disposition receipt containing the altered matching cadence and associated rule state.

Periodic matching can mechanically change:
- apparent persistence;
- print count;
- bar shape;
- touch count;
- jump size;
- volume aggregation.

Current research evidence establishes the mechanism but does not establish a replay-complete historical disposition/matching-cadence receipt for every first-wave symbol-session.

Therefore:
DISPOSITION_MATCHING_STATE_DATASET_READY = FALSE.

Unknown cannot be treated as ordinary continuous matching.

## First-wave module readiness

### D01-02 single-candle morphology
- raw OHLC geometry: READY on accepted raw rows;
- completed-bar clock: READY;
- historical universe: TWSE bounded READY / full Taiwan NOT READY;
- symbol-session lifecycle: BLOCKED;
- corporate-action continuity: BLOCKED;
- price-limit state: BLOCKED for clean contextual classification;
- disposition/matching state: BLOCKED where applicable;
- OOS outcome join: CLOSED.

State:
RAW_FEATURE_READY / CAUSAL_OOS_BLOCKED.

### D01-03 multi-candle sequences
All D01-02 dependencies apply, plus complete causal adjacency across multiple eligible symbol-sessions.

State:
SEQUENCE_FEATURE_READY / CAUSAL_OOS_BLOCKED.

### D01-07 cup/base/handle
Longer structural episodes amplify continuity/lifecycle risk and require stable membership plus no-backpaint lifecycle reconstruction.

State:
DETECTOR_CONTRACT_READY / CAUSAL_OOS_BLOCKED.

### D01-09 gaps / price limits
Raw previous-close/current-open gaps are available where valid opens exist, but mechanical resets, suspension/resumption, special reference prices and price-limit delayed discovery must be identified.

State:
RAW_GAP_READY / CAUSAL_OOS_BLOCKED.

## Audit conclusion

PRIMARY_FULL_TAIWAN_FIRST_WAVE_DATASET = BLOCKED.
TWSE_RAW_PRICE_SUBSTRATE = STRONG.
TWSE_BOUNDED_CAUSAL_REPLAY = BLOCKED_ON_CONTEXT_RECEIPTS.
TPEX_FULL_HISTORICAL_UNIVERSE = BLOCKED.
OUTCOME_JOIN = CLOSED.
NO_L4_PROMOTION = TRUE.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Freeze a bounded TWSE pre-outcome dataset manifest without opening outcomes.
2. Freeze years/folds/holdout now so later data repair cannot move the goalposts.
3. Mark every mandatory continuity/context receipt that must turn PASS before execution.
4. Preserve a separate full-Taiwan primary manifest; do not append TPEx into a TWSE result after outcomes.
5. Route exact data blockers to existing owners rather than rebuilding source infrastructure in D01.
