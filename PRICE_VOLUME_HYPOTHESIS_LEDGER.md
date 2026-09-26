# Price-Volume Hypothesis Ledger

Purpose: preserve every frozen PV hypothesis, including failed/inconclusive tests, so later research cannot silently rediscover or retune old ideas.

Formal Core: LOCKED
Current research schema: PV_SHADOW_V0_1

## Status vocabulary
- PLANNED
- DATA_QA
- TESTING
- SUPPORTED
- NOT_SUPPORTED
- INCONCLUSIVE
- ARCHIVED

## PV-H001 — Same-slot RVOL incremental value

- Origin: PV-005 / PV-057 / PV-083
- Schema: PV_SHADOW_V0_1
- Status: DATA_QA
- Frozen question: Does pvSlotRvol20 add incremental information beyond the existing local previous-5-bar volumeRatio for structural false/no-follow-through?
- Cohort: symbols already selected/monitored by Formal only
- Primary outcomes: frozen structural failure/no-follow-through labels
- Secondary: MFE/MAE, D1 where applicable
- Guards: exclude/stratify INVALID/GUARDED states per PV-066
- Comparators: model B vs C in the A->E sequence
- Threshold tuning: prohibited inside v0.1
- Current result: collection implementation complete; no prospective sample yet
- Decision: enter DATA_QA; no inference or Formal use

## PV-H002 — Cumulative-volume pace incremental value

- Origin: PV-005 / PV-057 / PV-083
- Schema: PV_SHADOW_V0_1
- Status: DATA_QA
- Frozen question: Does pvCumvolPace20 add information beyond pvSlotRvol20 by distinguishing isolated slot bursts from persistent session participation?
- Cohort: same as PV-H001
- Primary outcomes: structural failure/no-follow-through
- Secondary: MFE/MAE, persistence trajectory
- Comparator: model C vs D
- Current result: collection implementation complete; no prospective sample yet
- Decision: enter DATA_QA; no inference or Formal use

## PV-H003 — Latent response/acceptance/guard state incremental value

- Origin: PV-010 / PV-020 / PV-057 / PV-063-066
- Schema: PV_SHADOW_V0_1
- Status: DATA_QA
- Frozen question: Do pvResponseState, pvAcceptanceState and pvGuardState add information beyond numeric volume ratios and existing Formal context?
- Comparator: model D vs E
- Primary outcomes: structural acceptance/failure
- Secondary: MFE/MAE
- Important ambiguity: HIGH_EFFORT_LOW_PROGRESS is never assigned a directional sign ex ante
- Current result: collection implementation complete; no prospective sample yet
- Decision: enter DATA_QA; no inference or Formal use

## PV-H004 — Risk information without directional alpha

- Origin: PV-026 / PV-033
- Schema: PV_SHADOW_V0_1
- Status: DATA_QA
- Frozen question: Can abnormal participation predict realized range, MAE, stop-first or false confirmation even if future-return sign is weak?
- Primary outcomes: MAE / realized range / structural failure
- Directional return is reported separately
- Current result: collection implementation complete; no prospective sample yet
- Decision: enter DATA_QA; no inference or Formal use

## PV-093 implementation checkpoint

- V8.11.0 implements the frozen `PV_SHADOW_V0_1` collector as Class-A `LOG_ONLY` with `decisionImpact=false`.
- Status `DATA_QA` means infrastructure and deterministic fixtures are ready; it does not mean any hypothesis has prospective support.
- Thresholds, labels and the A→E comparison family remain frozen. Failed, inconclusive and supported results must continue to be retained here.

## Future hypothesis-entry template

### PV-Hxxx — Title
- Origin:
- Schema:
- Status:
- FirstFrozenAt:
- Frozen question:
- Feature definitions:
- Cohort:
- Primary outcome:
- Secondary outcomes:
- Exclusions/guards:
- Milestones:
- Variants tried:
- Result:
- Decision:
- Untouched confirmation period:

## PV-H005 — Dealer proprietary vs hedge flow

- Origin: PV-098 / PV-099 / PV-102 / PV-106
- Schema: future Tier-2 research version; NOT PV_SHADOW_V0_1
- Status: PLANNED
- Frozen question: Does dealer proprietary-flow streak provide cleaner incremental institutional-confirmation information than the current combined dealer flow, while dealer hedge flow primarily explains mechanical/risk context?
- Counter-hypothesis: Dealer hedge demand itself may carry useful directional information or persistent real cash demand; removing it may worsen performance.
- Data feasibility: TWSE/TPEx official institutional payloads already contain proprietary and hedge fields separately; expected incremental API cost = zero if the existing payload is preserved.
- Cohort: existing Formal selected/control cohorts only; do not alter cohort inclusion.
- Comparators:
  A. current combined dealerBuyDays
  B. proprietary-only dealerBuyDays
  C. hedge-only dealerBuyDays
  D. foreign/trust confirmation without dealer
  E. conditional combinations
- Primary outcomes: false-confirmation, D1/D3/D5, MFE/MAE.
- Utility outcomes: selected-name scarcity and capital-utilization impact.
- Controls: regime, sector, liquidity, price tier, PV acceptance, passive-flow/expiry/disposition context where available.
- Promotion rule: no Formal change until incremental value and untouched confirmation evidence pass governance.
- Current result: no test yet.
- Decision: remain PLANNED.

### PV-H005 protocol extension after PV-126/PV-128
- Gross participation and net direction are now frozen as separate constructs.
- Required dealer fields include buy/sell/net for proprietary and hedge, not net only.
- Derived research views:
  - gross side participation;
  - directional imbalance;
  - buy/sell streaks;
  - prop-vs-hedge sign state.
- Any side-participation share requires compatible source scope; daily institutional statistics must not be divided by intraday 15m volume.
- Primary H005 cohort uses the full existing Formal/control observation set across the RVOL distribution. Restricting only to high-RVOL events is secondary/descriptive because selection on high volume may create collider bias.
- High-RVOL subgroup findings are never sufficient causal evidence by themselves.
- Current status remains PLANNED; no capture implementation or Formal change yet.

## PV-H006 — Microstructure resolves HIGH_EFFORT_LOW_PROGRESS
- Origin: PV-151~160 / MICROSTRUCTURE_RESEARCH.md MS-023~MS-038
- Schema: future cross-lane research join; NOT a new Formal feature
- Status: PLANNED / EVIDENCE_GATED
- Frozen question: Among PV observations classified HIGH_EFFORT_LOW_PROGRESS, does prospectively captured microstructure state add incremental information for breakout retention, false-confirmation and MFE/MAE?
- Primary comparators:
  A. PV state + existing Formal context
  B. A + coarse spread/depth/execution state
  C. B + side-specific pressure
  D. C + replenishment/pressure-response state
- Current data availability:
  - existing V8.8.x execution recorder can potentially support B when timestamp coverage is valid;
  - C/D require denser prospective trade/book capture and cannot be reconstructed from OHLCV.
- Primary outcomes: +5m/+15m/+30m retention, structural failure, MFE/MAE, retracement fraction.
- Guards: exact as-of timestamp alignment, continuous-market regime only for clean cohort, no post-event nearest-neighbor hindsight.
- Falsification: archive dynamic layer if simple spread/depth/PV explains the result or sparse coverage drives findings.
- Formal impact: none.
- Decision: remain PLANNED.

### PV-H006 audit update after PV-161~167
- Existing execution-shadow-v2 capability is now audited precisely.
- Coarse H006-B can use spreadPct, best bid/ask, aggregate top-five share depth, depthImbalance, executionMarketState and freshness flags only if live coverage passes QA.
- H006-C/D remain DATA_GATED because current payload lacks trade-side pressure, transaction sequence, replenishment/depletion and dynamic book resiliency.
- The current field named lastTradeAt is actually derived from Fugle quote.lastUpdated; it must not be interpreted as actual last-trade time.
- FIRST_30M_COMPLETE is a milestone timestamp; current payload stores frame10/frame15, not a dedicated frame30.
- Current recorder endpoint is bounded by SQL LIMIT 500 and recent-row output, so it cannot prove full-window event completeness.
- Status: DATA_QUALITY_BLOCKED_PENDING_LIVE_COVERAGE_AUDIT.

## Global PV cohort-quality prerequisite after PV-175/PV-177
- H001~H004 use Formal selected/monitored cohorts by design. Primary inference now requires two independent quality dimensions:
  1. PV feature data quality;
  2. Formal cohort history-freshness quality.
- A clean 15m PV snapshot does not rescue a candidate that entered the cohort from stale/incomplete Formal daily history.
- Until production daily-history freshness is verified, rows with unverified cohort provenance remain DATA_QA / separate subgroup and are excluded from the primary clean H001~H004 inference.
- 2026-09-24 is specifically DATA_QUALITY_STALE_HISTORY for rolling-history-dependent Formal/PV research based on B-130 evidence.

### PV-H006 audit update after PV-168~183
- Future execution-shadow-v3 can improve H006-B and partially H006-C with zero extra Quote API calls by preserving referencePrice, true lastTrade time, cumulative trade totals, AtBid/AtAsk, transaction count and raw top-five levels.
- H006-D still requires denser prospective book/trade data for replenishment/resiliency.
- Current FORMAL_SIGNAL_OBSERVED recorder semantics are batch-triggered; rows without independently matched same-symbol notification are EVENT_SCOPE_AMBIGUOUS and excluded from signal-event inference.
- Interval pressure requires valid monotonic cumulative counters and explicit unclassified-volume coverage.
- Status remains PLANNED / DATA_QUALITY_BLOCKED.

## Clean-cohort readiness gate after PV-184~200
- H001/H002 primary inference status: WAITING_CLEAN_COHORT_PROVENANCE.
- Intraday PV feature rows may continue DATA_QA, but primary prospective comparison requires verified selection-time symbol-session history quality for the Formal cohort.
- Market-session-only freshness is insufficient; verified symbol-specific suspension sessions must be removed from expected sessions.
- PR #100 as currently drafted is not treated as production-ready because later Corporate Action research falsified market-session-only continuity.
- H003/H004 inherit the same clean-cohort prerequisite.
- H006 additionally requires authoritative execution-recorder coverage and verified symbol-specific Formal signal event mapping.
- No hypothesis is rejected or supported by these data-quality findings; evidence interpretation is deferred until prerequisites are met.

## PVE readiness evidence — 2026-09-26

### H001 / H002
- Evidence state: WAITING_CLEAN_COHORT_PROVENANCE.
- PV enable/formal-isolation: PASS.
- PV D1 content QA: BLOCKED by read authorization.
- Post-enable completed market dates: 0.
- Existing pre-enable research Shadow archive: 62 rows / 2 dates, but selection-time symbol-session provenance is UNVERIFIED.
- Verified clean primary cohort dates: 0.
- Outcome comparison: NOT STARTED.
- No support/rejection conclusion.

### H003 / H004
- Inherit the same clean-cohort and post-enable-data gates.
- No support/rejection conclusion.

### H006
- Coarse execution fields exist, but exact-date recorder completeness remains unproved.
- Current FORMAL_SIGNAL_OBSERVED rows also require independent same-symbol signal matching.
- State: DATA_QUALITY_BLOCKED.
- Existing trade-journal BUY truth is not invalidated by this recorder limitation.
- No support/rejection conclusion.

### Null/blocked-result preservation
These blocked-readiness findings are themselves durable evidence:
- workflow success != qaPass;
- archive existence != clean cohort;
- missing recorder row != NO_BUY;
- zero post-enable trading days != zero PV signals.

They must not be erased once later clean data arrive.

## PVE namespace/readiness clarification
- Candidate Shadow Archive and PV Shadow are distinct evidence systems.
- The observed 62-row archive is NOT H001/H002 PV feature evidence.
- Current PV at-rest row count remains UNKNOWN.
- H001/H002 can accumulate prospective PV feature QA after enable, but primary inference remains WAITING_CLEAN_COHORT_PROVENANCE.
- H003/H004 inherit the same gate.
- H006 remains DATA_QUALITY_BLOCKED pending exact-date execution-recorder completeness.
- Zero-plan dates are legal zero-opportunity dates and must not be counted as PV recorder failures.
- Readiness layers must be reported separately: runtime receipt, at-rest feature QA, cohort provenance, outcome maturity.

## Evidence-quality update after PVE-013~028
- PVE evidence remains outcome-gated. Runtime enable/isolation is proven, but PV D1 at-rest truth remains UNKNOWN because the read-only workflow receives HTTP 403 on direct D1 SELECT.
- First ordinary post-enable session is 2026-09-29, but its intraday plan lineage inherits the known-stale 2026-09-24 selection. Therefore 2026-09-29 intraday PV is DATA_QA-only for H001~H004.
- Because historical 15m baseline bootstrap is attached to after-market scanning, 2026-09-29 intraday is expected cold-start / DATA_INSUFFICIENT. 2026-09-30 is only the earliest possible baseline-ready intraday session if 9/29 bootstrap succeeds.
- Known PV_SHADOW_V0_1 research-label defects now block treating Guard labels as ground truth:
  - liquidity thresholds reversed versus Formal (thousand/general);
  - Formal liquidityException is a string while PV checks boolean true;
  - corporateActionResetAt / pvGapDominated / marketStructure upstream plumbing unverified;
  - VI confounder hardcoded false;
  - price-censor logic uses raw previousClose instead of exchange-consistent reference price.
- These defects do not alter Formal decisions. Raw RVOL/cumulative/raw bar-response fields may remain research-usable under independent source quality, but any study using affected Guard labels is quarantined until corrected/versioned or quality-overlay-adjusted.
- H001~H004 primary status remains WAITING_CLEAN_COHORT_PROVENANCE / DATA_QA.
- H006 remains DATA_QUALITY_BLOCKED.

## H001-H004 evidence-contract refinement after PVE-029~061
- H001/H002 are now explicitly decoupled from range/response-state defects. They may use raw slot RVOL / cumulative pace only under field-scoped quality gates, clean cohort provenance and adequate at-rest evidence.
- H001 primary comparison uses common-support observations only: Formal previous-5 ratio and pvSlotRvol20 must both be available and refer to the same completed bar. Early-slot RVOL availability is reported separately as coverage, not predictive superiority.
- Formal local volumeRatio is the actual rounded 2-decimal production value; PV slot RVOL is unrounded. Precision differences must not be mistaken for alpha.
- H003 readiness is more restrictive because v0.1 response/acceptance/Guard labels have identified fidelity defects: historical opening-range anchor, missing-slot range continuity, liquidity-Guard bug, unverified guard plumbing, raw previousClose reference, Formal replay rounding mismatch and A lower-shadow drift.
- H004 additionally requires exact horizon continuity, symbol-session-aware daily outcomes and path-order ambiguity handling. Same-bar stop+target is UNKNOWN for ordering from OHLC.
- Snapshot mutation conflicts in v0.1 must be classified before use: sourceFetchedAt can change on legitimate retries and is currently included in semantic fingerprint. A nonzero conflict count is not automatically semantic corruption.
- Point-in-time analysis must use featureKnownAt derived from sourceFetchedAt/barEnd; v0.1 observedAt/acceptance enteredAt are bar-start identities, not knowledge time.
- H001/H002/H003/H004 remain unsupported/unrejected; evidence collection and QA continue.

## Prospective evidence status after PVE-001~006
- H001: WAITING_FIRST_CLEAN_BASELINE + WAITING_CLEAN_COHORT_PROVENANCE.
- H002: WAITING_FIRST_CLEAN_BASELINE + WAITING_CLEAN_COHORT_PROVENANCE.
- H003: DATA_QA_ONLY; response/acceptance state code exists but no clean prospective evidence yet.
- H004: DATA_QA_ONLY; risk outcomes not yet eligible for inference.
- H005: remains PLANNED / implementation deferred.
- H006: remains DATA_QUALITY_BLOCKED pending recorder coverage and exact signal-event mapping.
- Runtime activation evidence does not count as hypothesis support.
- Non-trading-day no-fabrication is a system QA pass, not a market-signal result.

## Evidence denominator/readiness refinement after PVE-062~075
- Outcome rows are market-path records, not automatic research-eligibility receipts. Every outcome must join back to snapshot quality, cohort provenance and horizon/path-quality overlays.
- NEXT_SESSION and D1 are numerically duplicate one-session endpoints in v0.1 and are never treated as independent hypotheses.
- rangeAtr is not implemented in v0.1; H004 cannot claim ATR-normalized outcome evidence from current prospective rows.
- Persistence can cross sessions by design but lacks explicit gap provenance; outage/missing-session continuity must be quarantined separately from expected overnight/holiday gaps.
- H001/H002 event counts use participation-domain event identity; H003 uses acceptance-domain identity. The top-level union eventKey is not a universal denominator.
- Evidence milestones now use separate counters: raw snapshots, DATA_QA-eligible observations and hypothesis-clean events. Distinct-date maturity counts clean evidence dates only.
- H001 first comparison must report per-slot common-support/coverage before any predictive metric.
- Current research-side defects do not imply any Formal Core change. All hypotheses remain OBSERVER/evidence-gated.

## Hypothesis readiness after PVE-062~066
- H001 remains WAITING_FIRST_CLEAN_COMMON_SUPPORT + WAITING_CLEAN_COHORT_PROVENANCE + WAITING_AT_REST_QA.
- H002 inherits H001 gates and additionally requires cumulativeHistoryCount>=20 plus verified current-session prefix continuity.
- H003 remains HIGHER_GATED because response/range/Guard and Acceptance semantics have known v0.1 defects.
- H004 realized direction/MFE/MAE can be field-salvaged only under symbol-session/corporate-action continuity; stopFirst is quarantined when within-bar order is ambiguous.
- pvPersistenceState and top-level eventKey are not accepted as clean independence variables without continuity/event-family overlays.
- No hypothesis status upgraded to SUPPORTED/NOT_SUPPORTED from these QA findings.

## Hypothesis readiness after PVE-100
- H001: WAITING_POST_ENABLE_LIVE_ROWS + WAITING_BASELINE_FRESHNESS_PROOF + WAITING_CLEAN_COHORT_PROVENANCE + WAITING_AT_REST_QA.
- H002: same as H001 plus verified cumulative-prefix readiness.
- H003: remains HIGHER_GATED because range/Guard/Acceptance semantics are not clean enough for primary evidence.
- H004: direction/MFE/MAE can be field-salvaged only under outcome-specific continuity; stopFirst remains ambiguity-gated.
- H005: PLANNED / implementation deferred behind core DATA_QA.
- H006: DATA_QUALITY_BLOCKED pending authoritative execution-recorder coverage and exact signal-event mapping.
- Baseline validSessions>=20 is not freshness proof; baselineAsOfDate/plan lineage must be evaluated.
- No hypothesis has been upgraded to SUPPORTED or NOT_SUPPORTED.
