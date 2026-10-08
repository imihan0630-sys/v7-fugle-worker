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


## Hypothesis readiness after PVE-127
- H001/H002 remain unchanged: WAITING_POST_ENABLE_LIVE_ROWS + WAITING_BASELINE_FRESHNESS_PROOF + WAITING_CLEAN_COHORT_PROVENANCE + WAITING_AT_REST_QA.
- PVE-121 strengthens the rule that `validSessions>=20` / QA `readyCount` is not field readiness.
- PVE-122 means persisted-row absence cannot be used as proof of zero mutation conflicts; runtime retry/conflict telemetry is a separate evidence requirement.
- PVE-123~124 require report-generation state and window denominators to be explicit before any evidence count is used.
- PVE-125 requires PV runtime-receipt presence before interpreting pvScan decisionImpact/formalCoreImpact flags as observed evidence.
- PVE-126 preserves measured zero versus unavailable/null as distinct evidence states.
- PVE-127 prevents D1_DIRECT_READ_NOT_AUTHORIZED from being treated as an authoritative cause unless the underlying HTTP/error evidence actually supports authorization denial.
- No H001~H006 hypothesis is upgraded, rejected or supported by these observability findings.
- Formal Core remains LOCKED.


## Hypothesis readiness after PVE-133
- H001/H002 remain evidence-gated exactly as before; no prospective clean live evidence has matured.
- The current run's D1 block is specifically AUTHZ_DENIED, but future D1 failures require independent cause classification.
- Baseline rowCount=0 / readyCount=0 in a D1-blocked artifact is NOT_OBSERVED, not evidence of zero baselines.
- Historical intraday mutation-conflict frequency remains unobservable from current read-only admin surfaces.
- QA evidence must now preserve MEASURED_ZERO, NOT_OBSERVED, ABSENT_RECEIPT, UNKNOWN_SEMANTICS and BLOCKED as distinct states.
- No H001~H006 hypothesis is supported/rejected by these QA-observability findings.
- Formal Core remains LOCKED.


## Hypothesis readiness after PVE-139
- PVE-134 supersedes the current-runtime interpretation of PVE-126: all-zero Fugle call objects are preserved in the present schema.
- Workflow conclusion, qaPass and check-level readiness are independent and must not be collapsed.
- Same runtime.version does not prove the same deployed executable; H001~H004 prospective evidence must pin activeContentSha256/report provenance.
- Whole-scan fingerprint drift is not automatically Formal semantic drift because timing and semantic fields are mixed in the hash.
- No hypothesis status changes: H001/H002 remain gated by live rows, baseline freshness, clean cohort provenance and at-rest QA; H003/H004 remain higher-gated; H006 remains execution-data-quality gated.
- Formal Core remains LOCKED.


## Hypothesis readiness after PVE-144
- PVE-140~142 correct a provenance overclaim: current QA `activeContentSha256` is a raw content/v2 response hash, not verified canonical executable identity.
- The observed raw-hash drift across QA reruns does not support a claim of Worker code drift.
- Future H001~H004 evidence must pin Worker version id/number + script etag when obtainable, plus QA artifact/head lineage.
- This correction does not weaken the enable-time extracted-source before/after isolation receipt; it narrows only cross-run interpretation of the QA raw hash.
- H001/H002/H003/H004/H006 readiness statuses remain unchanged and evidence-gated.
- Formal Core remains LOCKED.


## Hypothesis readiness after PVE-149
- Worker version/etag is the preferred future deployed-code identity; actual version-endpoint access with the current token remains unexecuted, so existing artifacts retain a provenance limitation.
- H001/H002 first-session interpretation is now preregistered to pass provenance, safety, acquisition, baseline and cohort gates before feature/outcome comparison.
- 2026-09-29 intraday remains DATA_QA-only under its known 2026-09-24 plan lineage unless independent symbol-session provenance proves otherwise.
- H003/H004 remain more restrictive than H001/H002 because of known v0.1 state/Guard/outcome defects.
- No hypothesis status is upgraded or rejected.
- Formal Core remains LOCKED.


## Hypothesis readiness after PVE-154
- 2026-09-29 intraday H001/H002 rows are explicitly INHERITED_KNOWN_STALE_SELECTION and remain primary-inference excluded.
- 2026-09-30 is the first potentially clean selection date for intraday evidence, not an automatically clean date.
- Clean eligibility now requires both row-level symbol-session provenance and pool-date integrity.
- Historical exact 3+3 displacement controls cannot be inferred from the current scan receipt; unknown controls must remain unknown rather than reconstructed with hindsight.
- H001/H002/H003/H004 statuses remain evidence-gated; H006 unchanged.
- Formal Core remains LOCKED.

## Hypothesis readiness after PVE-159
- H001/H002 remain WAITING_POST_ENABLE_LIVE_ROWS + WAITING_BASELINE_FRESHNESS_PROOF + WAITING_CLEAN_COHORT_PROVENANCE + WAITING_AT_REST_QA.
- PVE-155 prevents the sampled Candidate Shadow archive from being misread as a complete 3+3 pool receipt. Its first six per-pool QNS rows may support bounded cutline diagnostics only.
- A clean H001/H002 control cannot be selected using future return, MFE/MAE, BUY trigger, PV response/acceptance, or outcome availability. Control identity is frozen from pre-outcome pool membership/rank evidence.
- The primary independent evidence count is CLEAN_SCAN_DATES, not stock rows. >=20 clean dates is only the first DESCRIPTIVE_READY floor and does not imply hypothesis support/rejection.
- H003/H004 inherit these cohort/dependence gates plus their existing stronger Guard/response/outcome semantics restrictions.
- H006 remains DATA_QUALITY_BLOCKED pending execution-recorder completeness and exact signal-event mapping.
- No hypothesis is upgraded, rejected or supported by PVE-155~159.
- Formal Core remains LOCKED.



## H001/H002 preregistered falsification overlay after PVE-160 — 2026-09-28
- No outcome status change: H001/H002 remain evidence-gated.
- Raw abnormal volume has no universal directional sign. Continuation, reversal, liquidity shock, speculative turnover and broad market/sector activity remain competing mechanisms.
- Any future C/D improvement in the frozen A/B/C/D sequence must survive a separately reported contextual/residual check using PIT-valid price state, volatility, liquidity and market/sector activity controls where available.
- Missing contextual controls remain UNKNOWN; rows are not retained by coercing missing evidence to neutral/zero.
- High-volume/strong-price-response and high-volume/weak-or-rejected-price-response must be reported separately before directional interpretation.
- If raw RVOL/cumulative pace loses its effect after contextual/residual adjustment, classify it CONTEXT_PROXY or REDUNDANT, not incremental alpha.
- If the sign materially changes across regimes/events/liquidity states, classify REGIME_OR_CONTEXT_DEPENDENT and prohibit post-hoc global threshold tuning.
- This overlay was frozen before the first potentially clean 2026-09-30 cohort and therefore does not use future outcomes to choose the controls.
- Formal Core remains LOCKED.


## Long-block hypothesis refinement after PVE-161~167 — 2026-09-28

### H001 — same-slot RVOL incremental value
Status unchanged: EVIDENCE_GATED.
Additional falsifiers frozen before outcomes:
- no unconditional HIGH_VOLUME sign;
- must survive common-support comparison with Formal local volume ratio;
- any apparent gain is provisional until market/sector/context proxy explanations are checked with PIT-valid controls;
- if context adjustment removes the effect => CONTEXT_PROXY/REDUNDANT.

### H002 — cumulative pace / persistence
Status unchanged: EVIDENCE_GATED.
- cumulative pace must add beyond slot RVOL/local ratio;
- persistence states are within-event trajectories, not independent observations;
- continuity gaps quarantine trajectory inference;
- repeated rows cannot inflate primary N.

### H003 — response / acceptance / Guard states
Status remains HIGHER_GATED.
New anti-circularity requirement:
- compare PRICE_ONLY_RESPONSE vs PRICE_PLUS_VOLUME_RESPONSE on identical future-only outcomes;
- same-bar price geometry cannot count as future alpha;
- acceptance transitions reusing Formal geometry are not independent PV evidence;
- if price-only performs equivalently, classify PV response layer REDUNDANT.

### D02-04 dry-up interpretation
LOW participation is not a bullish label. Constructive dry-up requires intact pre-outcome structure/liquidity plus later independently observed demand re-expansion; otherwise classify WEAK_DEMAND, ILLIQUID/UNKNOWN or merely DESCRIPTIVE.

### D02 module redundancy
D02-05/08/09/10 must be evaluated as views over PARTICIPATION_RESIDUAL -> EFFORT_RESULT -> PERSISTENCE_ACCEPTANCE before any additive scoring proposal. OBV/CMF/MFI/narrative accumulation-distribution labels require independent incremental evidence to escape REDUNDANT status.

No hypothesis is upgraded to SUPPORTED/REJECTED by this design/literature block. Formal Core remains LOCKED.


## D02 refinement after PVE-168~173 — 2026-09-28
- Four price-volume quadrants are descriptive strata; no fixed directional sign.
- D02-08 accumulation/distribution remains mechanism-UNKNOWN from OHLCV alone; liquidity, rebalancing, event shocks and disagreement remain competing explanations.
- H001-H004 results must remain horizon-specific.
- D02-03 separates volume necessity from incremental breakout quality; future value requires improvement beyond price-only geometry on common support.
- D02-04 dry-up is a timestamped two-leg lifecycle: candidate first, later demand-return confirmation or failure/unknown. Hindsight relabelling is prohibited.
- No hypothesis promotion. Formal Core remains LOCKED.


## Hypothesis readiness after PVE-174~180 — 2026-09-28

### H001 — same-slot RVOL vs Formal local ratio
Status: unchanged / EVIDENCE_GATED.
- Raw slot RVOL remains field-level salvageable when source, completed-bar, same-slot denominator, baseline freshness, exact-bar common support and cohort provenance are clean.
- Do not require trusted illiquidity/price-censor labels merely to measure the raw H001 metric relationship.
- Guard-input absence cannot be relabeled NORMAL.

### H002 — cumulative pace
Status: unchanged / EVIDENCE_GATED.
- Requires H001-quality source/cohort gates plus verified current-session prefix and cumulative denominator continuity.
- Guard defects do not automatically invalidate raw cumulative pace, but boundary/event interpretations remain separately gated.

### H003 — response / acceptance / Guard states
Status: HIGHER_GATED, strengthened.
- `PRICE_CENSORED` is not exchange-exact under v0.1.
- several Guard inputs are absent from the audited selected-plan contract and missing values can collapse to false/normal;
- missing reference price after 09:00 is not currently flagged unresolved;
- price-only vs price+volume anti-circularity remains mandatory.

Therefore v0.1 Guard/state labels cannot be treated as clean ground truth without independent overlays.

### H004 — risk/path outcomes
Status: higher-gated / no directional conclusion.
- factual future price paths may be retained;
- hypothesis-clean use requires symbol-session continuity, corporate-action comparability, boundary/reference quality and existing within-bar path-order guards.

### Daily RVOL lane
`pvDailyRvol20` is specifically quarantined across unresolved corporate-action/trading-unit continuity because the current daily builder does not implement the reset contract and the snapshot persists reset provenance as null.

No H001~H006 hypothesis is upgraded to SUPPORTED or REJECTED. No Formal optimization candidate is created. Formal Core remains LOCKED.


## H003/H004 readiness refinement after PVE-181~186 — 2026-09-29 pre-market

### H003 — Acceptance / response / Guard incremental value
Status: HIGHER_GATED / EVENT_DENOMINATOR_CORRECTED.

New code-proven falsifiers:
- PRE_EVENT -> EXPIRED_AMBIGUOUS at 13:00 can create a raw Acceptance eventKey even when no breakout/pullback trigger occurred;
- Acceptance advances without the INVALID Guard pause used by Persistence;
- anchorEligible is not Guard-gated.

Therefore future H003 event accounting must distinguish:
- RAW_ACCEPTANCE_KEY_COUNT;
- ACTIVE_ACCEPTANCE_LIFECYCLE_COUNT;
- H003_HYPOTHESIS_CLEAN_EVENT_COUNT.

Only the third denominator is maturity-eligible. PRE_EVENT-only expiry is session censoring, not an Acceptance event outcome.

### H004 — path/risk outcomes
Status: HIGHER_GATED / OUTCOME_STORAGE_NOT_ELIGIBILITY.

The existence of B1/B2/B4 or daily outcomes for an anchor does not validate the originating state. An INVALID-Guard anchor can store factual future paths, but such rows remain excluded from primary H004 inference until field-level Guard/input/PIT/cohort overlays pass.

### 2026-09-29 first-session rule
All 9/29 intraday rows remain DATA_QA-only for primary H001~H004 due inherited 9/24 cohort lineage. H003/H004 clean-event/anchor counts are therefore zero for primary inference regardless of observed future price paths.

No hypothesis is promoted or rejected. Formal Core remains LOCKED.


## H001~H004 readiness after PVE-187~193 — 2026-09-29 evening

### H001 — same-slot RVOL incremental value
Status: EVIDENCE_GATED / 2026-09-29 PRIMARY_INFERENCE_EXCLUDED.
The 21:31 production read-only receipt independently confirms the intraday cohort was still sourced from the 2026-09-24 saved plan. Therefore no 9/29 H001 return/path result may enter primary inference. Row-level RVOL capture/readiness remains NOT_OBSERVED until an at-rest/receipt path exposes it.

### H002 — cumulative pace
Status: EVIDENCE_GATED / 2026-09-29 PRIMARY_INFERENCE_EXCLUDED.
Same cohort exclusion as H001. 9/29 can still contribute recorder/data-QA observations if later verified, but not clean prospective alpha evidence.

### H003 — response / Acceptance / Guard
Status: HIGHER_GATED / QA_DENOMINATORS_NOW_OBSERVABLE.
PR #258 adds read-only diagnostic counters for raw Acceptance transitions/keys, active lifecycles, PRE_EVENT-only expiries/phantom keys, raw anchors and INVALID anchors. These counts are QA-only; H003 maturity still requires cohort/PIT/Guard/continuity/price-only-vs-price+volume overlays.

### H004 — risk/path outcomes
Status: HIGHER_GATED / OUTCOMES_CLOSED.
No 9/29 outcome superiority is inspected. Factual paths, if captured, remain separate from hypothesis eligibility.

### Prospective coverage rule
Manual `workflow_dispatch` QA artifacts cannot establish complete prospective date/event coverage and do not advance the clean-date maturity clock by themselves. A manual run can diagnose rows already stored; missing manual runs remain ABSENT_DIAGNOSTIC, not measured zero.

### Decision-clock rule
Before the scheduled 23:35 after-market scan, prior `scanDate=2026-09-24` is an expected prior-plan state. After the completion window, a 9/29 receipt is required to evaluate the 9/30 selection/bootstrap cohort.

No hypothesis is promoted/rejected and no Formal optimization candidate is created. Formal Core remains LOCKED.


## H001~H004 readiness after PVE-194~202 — 2026-09-30 morning

### H001 — same-slot RVOL incremental value
Status: EVIDENCE_GATED / 2026-09-30 PRIMARY_INFERENCE_EXCLUDED.
The 9/29 ordinary after-market selection/bootstrap prerequisite for a clean 9/30 cohort failed. The operational plan was persisted next morning through historical dry-run recomputation, and ordinary PV bootstrap readiness is not proven. Any 9/30 slot RVOL row is QA-only unless used strictly for recorder/data semantics.

### H002 — cumulative pace / persistence
Status: EVIDENCE_GATED / 2026-09-30 PRIMARY_INFERENCE_EXCLUDED.
Same cohort exclusion as H001, with the additional cumulative-prefix/baseline requirements unchanged. No clean-date counter advances on 9/30.

### H003 — response / Acceptance / Guard
Status: HIGHER_GATED / 2026-09-30 DATA_QA_ONLY.
9/30 rows may be useful for the already-frozen phantom PRE_EVENT expiry, INVALID-Guard transition and anchor diagnostics. They cannot enter the hypothesis-clean event denominator because cohort PIT provenance fails before response-state interpretation.

### H004 — future path / risk outcomes
Status: HIGHER_GATED / GATE_7_CLOSED.
Factual future paths may be stored by the recorder, but no 9/30 path is eligible for primary inference from this recovered cohort. Outcome existence cannot repair the after-cutoff selection lineage.

### Recovery and overlap rule
A historical recovery that recomputes the same symbols as the prior plan does not become prospective evidence. Symbol overlap is descriptive only; decision-time source vintage and cohort construction must independently pass.

### planDate rule
The observed recovery planDate=scanDate violates the ordinary Formal nextTradingDate construction invariant. Until the recovery-specific cause is understood, that receipt cannot be used as authoritative cohort timing.

No hypothesis is promoted or rejected. No FORMAL_OPTIMIZATION_CANDIDATE is created. Formal Core remains LOCKED.


## H001~H004 readiness after PVE-203~216 — 2026-10-02

### H001 — same-slot RVOL incremental value
Status: EVIDENCE_GATED / CLEAN_DATE_COUNT_ZERO.

Formal/PV source audit now proves the existing local previous-five ratio is the same primitive in both paths before rounding. This clarifies the comparator:
H001 asks whether historical same-slot RVOL adds information beyond a local five-bar relative-volume measure, not whether two implementations of the same local ratio differ.

For the frozen A/B/C/D comparison, full B/C/D common support cannot begin before 10:15 because B needs five prior completed 15m bars.

### H002 — cumulative pace / persistent participation
Status: STRUCTURAL_FALSIFICATION_ADVANCED / EVIDENCE_GATED.

New preregistered facts:
1. 09:00 cumulative pace equals same-slot RVOL exactly on common valid support. Incremental D-vs-C information at that slot is zero by construction.
2. 09:00 is also OPEN_AUCTION_MIXED.
3. Full A/B/C/D common support begins no earlier than 10:15.
4. Later-slot cumulative pace is not algebraically determined by current slot RVOL.
5. Missing an earlier slot invalidates later cumulative pace even if same-slot RVOL remains available.
6. H002 must demonstrate incremental value beyond the existing persistence state, not only beyond current-slot RVOL.

Primary H002 outcome testing is therefore frozen to:
- slot >=10:15;
- cumulativeValid=true;
- >=20 cumulative-history sessions;
- matched symbol/date/slot common support;
- D compared with C and persistence-state controls;
- no threshold tuning.

### H003 — response / Acceptance / Guard
Status: HIGHER_GATED / DATA_QA_ONLY UNTIL NEW CLEAN PLAN.

No 9/30 or 10/1 clean selection generation has been established.
Any 10/2 rows produced from the stale/recovered plan lineage remain suitable only for recorder/guard/Acceptance QA.

### H004 — future path / risk outcomes
Status: HIGHER_GATED / GATE_7_CLOSED.

No return, MFE, MAE, false-break or opportunity-retention comparison is opened.
Production pipeline failure must never be encoded as a zero-return or zero-pick outcome.

### Pipeline provenance overlay
- 9/30 recovery: failed at scan-preview with Cloudflare 1102 before persistence.
- 10/1 first recovery: quality ready, single POST unconfirmed 503, no blind retry.
- 10/1 second sync: timeout.
- 10/2 00:00 mirror: success but scanDate still 9/29.
- 10/2 00:01 health: job success but business check skipped.
- 10/2 00:23 C1 collector: C1_GENERATION_NOT_FOUND.

No hypothesis is promoted/rejected on economic outcomes.
No FORMAL_OPTIMIZATION_CANDIDATE is created.
Formal Core remains LOCKED.


## Pre-PVE-228 D02-05/08/09 identifiability overlay — 2026-10-02

### Explosive/climax/distribution volume
Status: DESCRIPTIVE_STATE_ONLY / DIRECTIONAL_MECHANISM_UNIDENTIFIED.

Abnormal RVOL can identify unusual participation.
It does not determine whether the mechanism is distribution, absorption or exhaustion.

Directional mechanism claims require an additional side-pressure data family plus market-structure guards.

### Accumulation/distribution proxy family
Status: LATENT_MECHANISM_DATA_GATED.

OHLCV-only labels must remain descriptive hypotheses.
No OBV/A-D/CMF/MFI value is accepted as direct proof of accumulation/distribution.

A future provider-side pressure proxy may refine the state, but:
- it is not true OFI;
- unclassified volume must be measured;
- dynamic absorption additionally requires replenishment/resiliency evidence.

### Price-volume divergence
Status: COMPARATOR_ONLY UNTIL_INCREMENTAL_VALUE.

Preferred primitive comparisons:
- price progress vs same-slot RVOL;
- price progress vs cumulative pace;
- price progress vs persistence/Acceptance;
- later, price progress vs prospectively captured tradePressureProxy.

Classic-indicator divergence can be included only as a comparator after common-support/redundancy controls.

### No new hypothesis family
Do not create a separate “smart money” factor family from these labels.
Reuse:
PARTICIPATION -> RESPONSE -> PERSISTENCE/ACCEPTANCE -> MICROSTRUCTURE PRESSURE/LIQUIDITY.

No outcome inspection, no hypothesis promotion/rejection, no FORMAL_OPTIMIZATION_CANDIDATE.
PVE evidence cursor remains 227 pending the after-market generation audit.


## H001~H004 and D02-03 readiness after PVE-228~239 — 2026-10-03

### 2026-10-02 cohort
Status: RESEARCH_INELIGIBLE / DATA_QA_ONLY.

The date does not advance any clean evidence counter:
- no verified same-session Formal generation;
- no C1 generation;
- Formal scan date remained 9/29;
- pipeline incomplete;
- later source readiness cannot retroactively create the missing decision-time generation.

Missing generation is not zero-pick.

### Cross-midnight repair semantics
Status: FUTURE_ACQUISITION_REPAIR / NO_RETROSPECTIVE_EVIDENCE.

PR #318 changes future late-fallback date pinning only.
No 10/02 hypothesis evidence is rehabilitated.

### D02-03 breakout-volume confirmation
Status: CONDITIONAL_INCREMENTAL_HYPOTHESIS / H20_SHARED_EVENT.

Two claims remain separate:
1. NECESSITY — breakout requires high volume.
2. INCREMENTAL QUALITY — volume adds discrimination beyond price-only breakout geometry.

The first is explicitly falsifiable by successful normal/low-volume breakouts.
The second remains the relevant research question.

No D02 event count is created independently from the D01 breakout event.
Volume/volatility are transforms on one shared event receipt.

Frozen future comparison:
A price-only;
B + local previous-five ratio;
C + same-slot RVOL;
D + cumulative pace.

D04 volatility interaction enters as a dependency/control layer and cannot be counted as D02 maturity.

### H001/H002
Still EVIDENCE_GATED.
Clean prospective date count remains 0.

### H003/H004
Still HIGHER_GATED.
Gate 7 remains CLOSED.

No hypothesis promotion/rejection on economic outcomes.
No FORMAL_OPTIMIZATION_CANDIDATE.
Formal Core remains LOCKED.


## Pre-PVE-240 OBV / divergence overlay — 2026-10-03

### D02-07 OBV
Status: COMPARATOR_ONLY / EXACT_DUPLICATE_PRUNING_REQUIRED.

Do not separately test:
- raw normalizedOBVChange20;
- signedVolumeBalance20;
when computed on the same rows, because they are exactly identical.

Do not outcome-test a generic `obvSlope` until slope estimator semantics are frozen.

Primary V0.1 residual comparator:
`signedVolumeBalance20`.

Future residual sequence:
A price path;
B + direct volume/RVOL/turnover;
C + response/persistence/acceptance;
D + signedVolumeBalance20.

Only D-vs-C measures residual OBV-family value.

### D02-09 divergence
Status: RELATIONAL_TRANSFORM / NO_PRIMITIVE_VOTE / PIT_VOLUME_LINEAGE_BLOCKED.

Primary typed families:
- PIVOT_SIGNED_VOLUME;
- PARTICIPATION_TRAJECTORY.

PIVOT_SIGNED_VOLUME must reuse D03/Pattern confirmed-pivot chronology and legal confirmation clock.

No visual/hindsight pivot choice.
No all-pair scan.
No best-window search.
No pivot-to-confirmation return credited as post-signal outcome.

D02-09 does not advance to L3 because daily volume corporate-action/unit continuity is unresolved.

### D02-08 accumulation/distribution
Status remains:
INDEPENDENT_MECHANISM_DATA_GATED.

If the evidence input is only:
- Effort-vs-Result;
- signed volume / OBV;
- price-volume divergence;
then D02-08 adds narrative interpretation rather than a new observable.

Only a separate PIT-valid microstructure family may reopen standalone-mechanism identifiability.

No hypothesis promotion on outcomes.
No FORMAL_OPTIMIZATION_CANDIDATE.
PVE cursor remains 239.


### Compact comparator budget — SVB first, CMF robustness only

For D02-07 residual inference, freeze one primary compact benchmark:
`signedVolumeBalance20`.

CMF remains a secondary robustness comparator because:
`CLV = 2*closePosition - 1`,
so CMF is a volume-weighted close-location compression of primitives already owned by D02.

SVB and CMF are not identical, but they are not independent market-data families.

Do not spend scarce prospective dates testing:
SVB + CMF + raw OBV + multiple OBV slopes as separate alpha candidates.

Any later SVB-vs-CMF challenger comparison must be preregistered before outcomes.

## Pre-PVE-240 daily-volume continuity overlay — 2026-10-03

No H001~H006 outcome status changes.

### H001 / H002
H001/H002 remain intraday participation hypotheses. Their regular-stock intraday candle magnitude is LOTS under the documented provider contract, while the daily D1 lane is SHARES.

Rules:
- compare H001/H002 features on their own frozen same-slot/cumulative common support;
- do not use daily-vs-intraday absolute magnitude as a hidden consistency test without an explicit unit/odd-lot adapter;
- daily continuity defects do not automatically destroy field-valid intraday RVOL evidence, but any cross-lane control must preserve unit provenance.

### D02-07 / D02-09
signedVolumeBalance20 and pivot signed-volume divergence require verified daily volume-magnitude continuity.

Freeze:
- UNIT_SCALE: bridge or reset-clean; unresolved => DATA_BLOCKED.
- SUPPLY_CHANGE: RAW_ACTIVITY remains factual, but COMPARABLE_PARTICIPATION requires denominator normalization or a fully post-break 20-session baseline.
- exact expected symbol sessions, not merely 20 surviving rows, define the denominator.
- factual zero volume is not missing.
- missing expected session cannot be backfilled by an older row.

No hypothesis is SUPPORTED or REJECTED.
No FORMAL_OPTIMIZATION_CANDIDATE is created.
Formal Core remains LOCKED.

## Pre-PVE-240 D02-10 / D02-12 maturity overlay — 2026-10-04

This is a data-feasibility maturity change only.

### D02-10
L3 PIT feasibility is accepted using:
- pre-session D03-owned trend context;
- completed-slot D02 volume state;
- explicit firstKnownAt join.

No interaction direction is SUPPORTED or REJECTED.
Future alpha testing must compare:
A direct trend;
B direct participation;
C trend + participation;
D C + explicit interaction transform;
on identical common support and with market/sector/liquidity/event/regime controls.

### D02-12
L3 PIT feasibility is accepted after splitting:
- TIME_OF_DAY_VOLUME_CURVE;
- PRICE_BY_VOLUME_PROFILE.

The first has historical + live Taiwan minute data under a bounded 09:00~13:00 current-monitor window.
The second has a prospective current-day source but no claimed historical profile archive.

No volume-profile alpha hypothesis is promoted.
No closing-auction or historical price-profile completeness is implied.
No FORMAL_OPTIMIZATION_CANDIDATE.
Formal Core remains LOCKED.

## Pre-PVE-240 D02-05 / 07 / 09 / 11 maturity overlay — 2026-10-04

### D02-05
L3 data feasibility accepted for EXTREME_PARTICIPATION_STATE only.
DISTRIBUTION remains latent and may not be inferred from OHLCV/RVOL alone.
No directional hypothesis is promoted.

### D02-07
L3 data feasibility accepted after executable daily-volume continuity replay.
Primary compact comparator remains signedVolumeBalance20.
Governance remains:
OBSERVATION / RESEARCH_ONLY / MERGE_CANDIDATE / PRICE_VOLUME_COMPARATOR_ONLY.
L4 requires incremental evidence beyond direct price, volume/RVOL and PV response/persistence.

### D02-09
L3 data feasibility accepted after:
- repaint-safe confirmed-pivot dependency was already frozen;
- volume path now has executable continuity eligibility.
Typed families remain:
- PIVOT_SIGNED_VOLUME;
- PARTICIPATION_TRAJECTORY.
No generic divergence boolean.

### D02-11
L3 data feasibility accepted for volume-capacity + prospective execution-liquidity context.
Formal threshold/exception effectiveness is not validated.
No threshold sweep is authorized.

### D02-08
Remains L2.
Independent microstructure data completeness is still not proven.
API capability alone is insufficient.

No H001/H002/H20 outcome status changes.
Gate 7 CLOSED.
No FORMAL_OPTIMIZATION_CANDIDATE.

## Pre-PVE-240 D02-08 + L4 readiness overlay — 2026-10-04

### D02-08
Status after L3 promotion:
OBSERVATION / RESEARCH_ONLY / PROXY_ONLY / INTENT_UNIDENTIFIED.

Allowed:
- providerTradePressureProxy;
- classificationCoverage;
- unclassifiedVolume;
- pressure x price-response coordinate;
- D05 spread/depth/liquidity-state context when PIT-valid.

Forbidden:
- accumulation/distribution identity;
- true OFI;
- smart-money intent;
- passive absorption;
- iceberg/spoofing inference.

### L4
No D02 hypothesis is promoted to L4.

Reason:
L4 needs Prospective Shadow or genuine OOS evidence.
Current clean prospective date count is zero and Gate 7 is CLOSED.

No economic hypothesis is SUPPORTED or REJECTED from this round.
No FORMAL_OPTIMIZATION_CANDIDATE.

## Pre-PVE-240 Wave-1 executable gate overlay — 2026-10-04

H001 / D02-02:
primary C-vs-B admission is now machine-checkable.
No outcome status change.

H20 / D02-03:
D01-05 remains the only primitive breakout-event owner.
Event-identity mismatch fails closed.
No outcome status change.

H003 / D02-06:
PRICE_PLUS_VOLUME_RESPONSE vs PRICE_ONLY_RESPONSE remains the primary contrast.
Outcome must begin strictly after the feature bar/first-known clock.
PRE_EVENT_ONLY_EXPIRY remains QA-only.
No outcome status change.

Maturity rule:
DESCRIPTIVE_ONLY != L4_EVIDENCE_ELIGIBLE != L4_PROMOTION_REVIEW.

No hypothesis is supported/rejected from economic outcomes in this stage.
Gate 7 remains CLOSED.
No FORMAL_OPTIMIZATION_CANDIDATE.

## Pre-PVE-240 Wave-1 isolation fix + Wave-2 admission overlay — 2026-10-04

### Wave-1
The previous program-level evidence counter was too permissive because H001/H20/H003 could share a pooled count.
Corrected rule:
each hypothesis must satisfy its own evidence floor.
Cross-hypothesis sample borrowing is forbidden.

### Wave-2
D02-04:
dry-up candidate identity must be frozen before later demand re-expansion.

D02-05:
EXTREME participation is observable; distribution/absorption motive remains UNKNOWN.

D02-07:
signedVolumeBalance20 remains the sole primary compact OBV-family comparator; no raw-OBV duplicate vote.

D02-08:
provider pressure remains proxy-only; true OFI/intent labels remain forbidden.

D02-09:
only PIVOT_SIGNED_VOLUME and PARTICIPATION_TRAJECTORY are admissible.

D02-10:
only residual interaction beyond direct trend + participation may count.

D02-11:
no threshold optimization; reason-stratified rejected controls are mandatory.

D02-12:
time curve and price-by-volume profile remain separate; price profile is prospective-only.

No economic hypothesis changes status.
No L4 promotion.
No FORMAL_OPTIMIZATION_CANDIDATE.

## Pre-PVE-240 D02-01 semantic-governance overlay — 2026-10-04

D02-01 L4 question is not directional alpha.

Primary future evidence:
prospective semantic/provenance defects plus counterfactual classification delta under the frozen adapter.

Positive semantic-governance evidence means:
a legal prospective row demonstrates that the frozen governance changes or prevents a classification that the ungoverned frozen counterfactual would have admitted.

It does not mean:
the governed path has higher returns.

All 12 D02 modules now have executable L4-admission firewalls.
No economic hypothesis changes status.
No L4 promotion.
No FORMAL_OPTIMIZATION_CANDIDATE.

## Pre-PVE-240 D02→D16 validation ownership overlay — 2026-10-04

D02 does not own statistical sample-adequacy certification.

Wave-1 retains its frozen descriptive/evidence checkpoints.
Wave-2 does not inherit 100/30 as a universal rule.

For each evidence key:
D02 first admits genuine prospective/OOS rows.
D16 then determines dependence-aware sample adequacy against a preregistered effect/precision target.

Allowed positive D16 outputs for D02 review:
- VALIDATION_PASS_CANDIDATE;
- SEMANTIC_GOVERNANCE_CANDIDATE.

These are review candidates only.
They are not automatic maturity promotions.

No hypothesis status changes.
No FORMAL_OPTIMIZATION_CANDIDATE.

## Pre-PVE-240 effect-target binding overlay — 2026-10-04

The D02→D16 handoff now separates three objects:

1. D02 admission receipt:
   Is the observation legal and PIT-safe?

2. D02 EffectTargetReceipt:
   What exact effect/precision/materiality target was frozen before outcomes?

3. D16 validation receipt:
   Is the evidence statistically adequate relative to that exact frozen target?

No object may substitute for another.

Current target state:
all 14 evidence keys are TARGET_VALUE_PENDING_FREEZE.

No fixture value is a research threshold.
No economic hypothesis changes support status.
No L4 promotion.
No FORMAL_OPTIMIZATION_CANDIDATE.

## Pre-PVE-240 effect-target derivation / freeze-precondition overlay — 2026-10-05

Target selection itself is now a preregistered research object.

Allowed derivation:
cost-benefit / theory bound / prior independent planning evidence / explicit precision requirement / D02-01 semantic policy.

Forbidden:
current outcome / best metric after results / best horizon after results / fixture / unexplained benchmark / UNKNOWN cost=0 / cross-key target borrowing.

Wave-1:
- outcome families frozen;
- PV-084 effect-size reporting family frozen;
- horizon semantics frozen;
- singular metric rule still pending;
- multihorizon decision rule still pending;
- numerical MDE/precision values still pending.

No hypothesis changes support status.
No FORMAL_OPTIMIZATION_CANDIDATE.

## Pre-PVE-240 Wave-1 metric/horizon/method overlay — 2026-10-05

H001:
- primary metric = equal-date Brier-loss improvement;
- primary horizon = B2;
- B1/B4 cannot rescue B2;
- D16-19 method receipt pending.

H20:
- same metric and B2 hierarchy;
- identical D01-owned breakout event is mandatory;
- D16-19 method receipt pending.

H003:
- same statistical metric;
- primary outcome clock = active lifecycle to first terminal or 13:00 censor;
- terminal failure = B/A_FAILED_REENTRY;
- terminal success = B/A_REACCELERATION;
- expiry / PRE_EVENT-only expiry / UNKNOWN = censor;
- D16-19 method receipt pending.

No target value is selected.
No hypothesis changes support status.
No L4 promotion.
No FORMAL_OPTIMIZATION_CANDIDATE.


## PVE-270~276 Wave-1 freshness and downstream-consumption overlay — 2026-10-08

### H001 / D02-02
Status remains EVIDENCE_GATED / CLEAN_DATE_COUNT_ZERO.

PVE-270 requires two independent future physical prerequisites:
1. owner-approved/deployed PVE-261 baseline refresh must prove authoritative exact prior-slot freshness and provenance;
2. CORR-003 quota remediation must independently protect System1 after-market execution and a future real trading day must produce exactly one successful business scan.

Neither 2026-10-07 nor any earlier failed date can be repaired retrospectively into clean evidence.

### H20 / D02-03
Status remains CONDITIONAL_INCREMENTAL_HYPOTHESIS / OUTCOME_CLOSED.

New finding: legacy H20 admission can pass without same-slot RVOL baseline freshness. PVE-273 closes this bypass.
Future H20 evidence must prove fresh exact-slot RVOL baseline on the identical D01-owned breakout event before outcome use.

No statement that high volume is necessary or sufficient is upgraded.

### H003 / D02-06
Status remains HIGHER_GATED / OUTCOME_CLOSED.

New finding: PRICE_ONLY_RESPONSE vs PRICE_PLUS_VOLUME_RESPONSE requires symmetric price-geometry support and independently fresh volume effort support. Stale range baseline can contaminate both P/PV; stale volume baseline can contaminate only PV and create false apparent incrementality.

PVE-274 requires clean/fresh price-range and volume baselines, identical rows/event/outcome and volume-only challenger increment.

### Wave-1 program
PVE-275 makes strengthened H001/H20/H003 prerequisites non-bypassable at pre-outcome admission.
PVE-276 binds the exact PVE-275 admitted dataset to downstream D16 input by immutable hash.

No outcome inspection.
No hypothesis supported/rejected.
No L4 promotion.
No FORMAL_OPTIMIZATION_CANDIDATE.
Formal Core LOCKED.


## PVE-277~279 Wave-2 dependency-specific admission overlay — 2026-10-08

Wave-2 outcome status remains CLOSED / ALPHA_UNKNOWN across D02-04/05/07/08/09/10/11/12.

New integrity findings:
- D02-04 LOW participation requires fresh same-slot participation baseline.
- D02-05 EXTREME participation/response requires fresh volume and range baselines.
- D02-07 and D02-09 PIVOT_SIGNED_VOLUME require exact daily continuity receipts, not a median-freshness proxy.
- D02-08 provider-pressure primary source remains independent; registered comparator controls must be fresh.
- D02-09 PARTICIPATION_TRAJECTORY and D02-10 interaction require declared participation lineage with matching slot/cumulative/persistence evidence.
- D02-11 rolling-20 liquidity capacity requires exact latest prior eligible-session freshness.
- D02-12 time curve requires historical denominator + control freshness; prospective price-by-volume profile requires control freshness at comparison.

PVE-278 is now the Wave-2 pre-outcome anti-bypass overlay.
PVE-279 binds its exact admitted dataset to D16 input.

No outcomes inspected.
No hypothesis supported/rejected.
No maturity promotion.
No Formal optimization candidate.


## PVE-280~281 all-D02 downstream lineage overlay — 2026-10-08

D02-01 semantic evidence now has the same exact admitted-dataset -> D16-input binding principle already frozen for Wave-1 and Wave-2.

PVE-281 is the canonical all-D02 D16 entry for all 14 evidence keys.

This changes no H001/H20/H003/Wave-2 economic status.
It only removes dataset substitution as a future source of false validation.

Next research blocker moves to EffectTargetReceipt and D16 ModelMethodReceipt readiness.
No L4 promotion.
No FORMAL_OPTIMIZATION_CANDIDATE.
Formal Core LOCKED.
