# Price-Volume Evidence Lane

Purpose: prospective evidence / DATA_QA after PV theory convergence at PV-200.

Formal Core: LOCKED.
PV Shadow schema: PV_SHADOW_V0_1.
All evidence below is descriptive / QA unless explicitly promoted by later governance.

# PVE-001 — Activation and First Runtime QA Receipt

## Activation run
GitHub Actions:
- workflow: `PV Shadow Class-A Enable`
- run id: 36144091642
- created: 2026-09-25 13:55 UTC / 21:55 Taipei
- conclusion: SUCCESS

Verified from job log:
- `PV_SHADOW_ENABLED=true`
- binding type = plain_text
- operation = ENABLED
- non-PV bindings preserved
- `formalIsolation=true`
- rollback not required

This proves activation succeeded and the Class-A enable guard observed unchanged Formal state.

## First read-only QA
GitHub Actions:
- workflow: `PV Shadow Class-A Read-Only QA`
- run id: 36144193465
- first attempt around 2026-09-25 21:56 Taipei
- conclusion: workflow SUCCESS

Runtime receipt:
- runtime = `8.11.0-pv-shadow-v0.1-log-only`
- pvShadowEnabled = true
- decisionImpact = false
- formalCoreImpact = false
- activeSourceHookAfterFormal = true
- ordinaryLiveCandleCallsAddedByPv = 0

D1 observability:
- D1 binding present = true
- direct D1 read = unavailable
- error = HTTP 403 / account not authorized to access D1 query service

Therefore:
workflow success != DATA_QA_PASS.

The QA report itself correctly returned:
- `qaPass=false`
- only recorded failure = `D1_DIRECT_READ_NOT_AUTHORIZED`

## First QA sample timing
At 21:56 Taipei:
- afterMarketWindow=false
- baseline rowCount=0
- snapshots row-level counts unavailable because D1 direct read unavailable
- currentAfterMarketScanDate=2026-09-24
- currentAfterMarketPvPresent=false

This was immediately after activation and before any eligible new trading-day after-market bootstrap.

Status:
ACTIVATION_VERIFIED / D1_ROW_QA_NOT_OBSERVABLE.

# PVE-002 — Holiday Negative-Control Receipt

## Re-run
The same existing read-only QA job was re-run safely after the 23:35 window:
- run id remains 36144193465, later attempt
- new job id 108293040440
- generated at 2026-09-26 07:55 Taipei
- conclusion: SUCCESS

Runtime remained:
- pvShadowEnabled=true
- decisionImpact=false
- formalCoreImpact=false
- zero extra ordinary live candle calls in PV helper

## Why 2026-09-25 after-market was skipped
Production Worker calendar explicitly contains:
- 2026-09-25 as a market holiday
- 2026-09-28 as a market holiday

The scheduled 23:35 run recorded:
- job_type=AFTER_MARKET_SCAN
- status=SKIPPED
- fugle_calls=0
- current scan stayed at 2026-09-24
- currentAfterMarketPvPresent=false

This is expected behavior, not a PV failure.

## Negative-control result
After Shadow activation on a non-trading day, the system:
- did not fabricate a new after-market scan;
- did not fabricate a PV baseline;
- did not make Fugle calls for the skipped scan;
- retained the previous valid scan date.

This is a useful outcome-blind QA success.

Status:
NON_TRADING_DAY_NO_FABRICATION_PASS.

# PVE-003 — First Natural Prospective Timing after Holiday Activation

## Bootstrap source audit
V8.11 code shows:
`bootstrapPvShadowBaselinesSafe`
runs only inside the successful after-market path after:
- Formal plan persistence;
- bridge/external delivery;
- daily push/report persistence.

Intraday `recordPvIntradayShadowSafe` does not bootstrap historical baseline on demand.

## Calendar sequence
- 2026-09-25 holiday
- 2026-09-26 weekend
- 2026-09-27 weekend
- 2026-09-28 holiday
- next ordinary eligible trading day = 2026-09-29

## Implication
### 2026-09-29 intraday
Shadow may record completed 15m snapshots for the existing monitored plan.

But because no prior after-market bootstrap has run since activation:
- same-slot baseline is expected to be missing/insufficient initially;
- such rows are DATA_QA / DATA_INSUFFICIENT observations, not H001/H002 alpha evidence.

The observed session may be rolled into the baseline at the current cron's final completed 13:00-start bar, but one session is far below the >=20 requirement.

### 2026-09-29 23:35
If the Formal after-market scan succeeds, V8.11 can bootstrap each selected/monitored Formal symbol using historical 15m candles through marketDate-1.

### 2026-09-30
Earliest natural date on which clean >=20-session intraday same-slot baselines can plausibly be available for the newly bootstrapped 9/29 Formal set.

This is the first candidate date for primary intraday PV DATA_QA, not yet alpha interpretation.

Status:
FIRST_CLEAN_BASELINE_CANDIDATE_DATE_2026_09_30.

# PVE-004 — D1 403 Is an Observability Defect, Not Evidence of Missing Runtime Rows

The QA workflow's Cloudflare token can:
- inspect Worker settings/content;
- read admin runtime endpoints.

But its direct D1 query call returns 403.

Therefore values such as:
- snapshot totalRows;
- duplicates;
- fingerprint mismatches;
- outcomes;
- D1 baseline rows
cannot currently be authoritatively audited through this workflow.

This does NOT prove those tables/rows are absent.

It proves:
`D1_ROW_LEVEL_QA_OBSERVABILITY = BLOCKED`.

## What remains observable without direct D1
Through the deployed admin readback:
- runtime version;
- current config/scan/live state;
- scan.pvShadow after successful after-market scan;
- live.pvShadow after monitoring;
- cron status.

This is enough for high-level runtime QA but not row-level immutability/duplicate/fingerprint proof.

Status:
RUNTIME_OBSERVABLE / ROW_LEVEL_D1_QA_BLOCKED.

# PVE-005 — QA Workflow Has Two Diagnostic Blind Spots

## Blind spot 1 — skipped cron reason is lost
`runAfterMarketScan(...onlyIfMissing:true)` can return:
- `reason=NOT_TRADING_DAY`
- `reason=ALREADY_SCANNED`
- `reason=AFTER_MARKET_RUNNING`

But `runScheduledWithAudit` writes:
`detail = result?.status || null`

It does not persist `result.reason`.

Therefore the cron table can show:
- SKIPPED
- detail=null

without explaining why.

The holiday diagnosis above required source-calendar inspection rather than cron receipt alone.

## Blind spot 2 — QA after-market assertion is not holiday-aware
`pv_shadow_readonly_qa.mjs` defines:
`afterMarketWindow = taipeiTime >= "23:45"`

If run after 23:45 on a holiday, it would require:
`scan.scanDate === taipeiDate`
although the correct production behavior is to skip the non-trading day.

Thus the QA script can false-fail on holidays after 23:45.

## Governance
These are research-diagnostics issues, not Formal strategy defects.

A future QA-only patch should:
- preserve cron skip reason;
- make after-market assertions trading-calendar aware.

Do not change Formal selection/BUY logic to solve this.

Status:
QA_DIAGNOSTIC_IMPROVEMENT_IDENTIFIED / NOT_IMPLEMENTED.

# PVE-006 — PVE-001 Current Readiness Decision

## Passed
- Shadow deployment present
- enable binding true
- Class-A decisionImpact=false
- Formal isolation at enable
- post-Formal source-hook ordering
- zero added ordinary live candle calls
- non-trading-day no-fabrication behavior

## Not yet passed / not observable
- D1 snapshot row counts
- duplicate-group count
- at-rest semantic fingerprint verification
- outcome fingerprint verification
- >=20 baseline rows in runtime
- first trading-day intraday coverage
- clean cohort-history provenance

## Decision
PVE-001 overall status:
`DATA_QA_PARTIAL`

Do NOT promote to:
- DATA_QA_PASS
- H001/H002 evidence
- any Formal optimization.

Next evidence hinge:
2026-09-29 trading session / after-market bootstrap,
then 2026-09-30 clean-baseline candidate session.
# PVE-007 — Admin Readback Can Verify After-Market PV, but Not Intraday Persistence

## Intraday execution order
V8.11 attaches a lightweight `result.pvShadow.session15` sidecar during analysis.

The Formal live snapshot is then:
1. built;
2. written to `v7_live_state`;
3. mirrored to KV.

Only **after** Formal signal/push/live-state persistence completes does:
`recordPvIntradayShadowSafe(...)`
run.

## Consequence
`/api/live` can expose:
- current result-level PV session15 sidecar;
- bar/session extraction state.

But it does NOT authoritatively prove:
- v7_pv_shadow_snapshots insert success;
- duplicate/mutation status;
- outcome insert success;
- baseline-table persistence.

The top-level `live.pvShadow` returned by `runBackgroundMonitor` occurs after the stored live snapshot and is not necessarily present in `v7_live_state`.

## After-market difference
The after-market scan summary is constructed after:
- bootstrapPvShadowBaselinesSafe;
- recordPvDailyShadowSafe.

Therefore `/api/scan/status` can expose:
- pvShadow.enabled;
- bootstrap requested/bootstrapped/results;
- daily stored/outcomes/details;
- zeroPvPushes/zeroPvActions;
without direct D1 SELECT.

## Evidence design
Use:
- scan/status for after-market bootstrap/daily runtime receipt;
- live/result sidecar for bar-extraction/freshness context;
- direct D1 read for row-level immutability/duplicate/outcome proof.

Status:
ADMIN_READBACK_PARTIAL / D1_REQUIRED_FOR_ROW_LEVEL_PROOF.

# PVE-008 — D1 Read 403 Is a Least-Privilege Observability Decision Point

## Observed fact
The GitHub Actions QA token can read:
- Worker settings;
- deployed Worker content;
- runtime admin endpoints.

The same token receives HTTP 403 from the Cloudflare D1 query API.

## Plausible classes of cause
- token lacks D1 read permission;
- token/account/database access scope does not cover the bound D1 resource;
- another Cloudflare authorization mismatch.

The current evidence does not distinguish these classes.

## Important separation
Worker runtime itself has a valid D1 binding and uses D1 successfully for:
- live state;
- cron records;
- leases;
- history cache.

Therefore QA-token D1 403 is not evidence that the runtime D1 binding is broken.

## Safe future options
A. grant the existing QA automation least-privilege D1 read access;
B. add a dedicated admin/read-only PV QA endpoint that queries D1 internally and returns sanitized aggregates;
C. continue using only scan/live receipts and defer row-level QA.

No option should require exposing raw secrets or mutating D1.

Status:
OBSERVABILITY_PERMISSION_GAP / RUNTIME_BINDING_NOT_IMPLICATED.

# PVE-009 — 2026-09-29 / 2026-09-30 Outcome-Blind QA Plan

## 2026-09-29 intraday
Expected:
- trading-day monitor resumes;
- pvShadowEnabled remains true;
- result-level session15 sidecar begins accumulating;
- before baseline bootstrap, core normalized fields may be DATA_INSUFFICIENT;
- no Formal behavior changes;
- no extra ordinary live candle calls from PV helper.

Pass criteria:
- monitor runs succeed;
- Formal fingerprints/behavior unchanged;
- no PV exception propagates;
- DATA_INSUFFICIENT is used instead of fabricated baseline values.

This day is **not** H001/H002 evidence.

## 2026-09-29 23:35 after-market
Expected:
- Formal scan executes rather than holiday-skip;
- scanDate=2026-09-29;
- scan.pvShadow.enabled=true;
- bootstrap requested equals eligible Formal plan count;
- each successful baseline has >=20 valid historical sessions;
- daily decisionImpact=false;
- zeroPvPushes=true;
- zeroPvActions=true.

If bootstrap partially fails:
- Formal scan remains successful;
- failed symbols remain research UNKNOWN;
- no retry logic may change Formal plan.

## 2026-09-30 intraday
Earliest candidate clean session:
- baseline from 9/29 after-market exists;
- same-slot/range/cumulative baselines can reach >=20 prior valid sessions;
- first H001/H002 DATA_QA-qualified intraday rows may appear.

Still no alpha inference until:
- clean cohort provenance;
- sample/date floors;
- row-level duplicate/fingerprint QA.

Status:
FIRST_TRADING_DAY_QA_PROTOCOL_FROZEN.

# PVE-010 — Read-Only QA Script Needs Trading-Day-Aware After-Market Assertions

## Current logic
The QA script defines:
`afterMarketWindow = taipeiTime >= "23:45"`

Then, if PV is enabled, it asserts:
`scan.scanDate === taipeiDate`.

## Failure mode
On an official holiday after 23:45:
correct production behavior is:
- no same-day scan;
- prior valid scan remains.

The QA script would incorrectly fail because it ignores trading-calendar state.

## Correct semantics
The strong same-day after-market assertions should require:
`afterMarketWindow && isTradingDate(taipeiDate)`.

On non-trading days:
verify instead:
- no fabricated same-day scan;
- skip reason/trading calendar is consistent;
- zero unwanted market calls where observable.

Status:
QA_FALSE_FAILURE_RISK_CONFIRMED / TEST_ONLY_DEFECT.

# PVE-011 — Cron Audit Loses the Reason for SKIPPED Jobs

## Current production path
`runAfterMarketScan(...onlyIfMissing:true)` returns a `reason` for skip states such as:
- NOT_TRADING_DAY;
- ALREADY_SCANNED;
- AFTER_MARKET_RUNNING.

But `runScheduledWithAudit` writes:
`detail: result?.status || null`.

## Result
A cron row can record:
- status=SKIPPED;
- skipped=1;
- detail=null;
while the actual runtime returned a useful reason.

## Research impact
Diagnosing expected holiday behavior required source-calendar inspection instead of the cron record itself.

## Desired diagnostic semantics
Preserve:
`detail = result.status || result.reason || null`

This is operational telemetry only.

Do not infer market state from missing detail.

Status:
CRON_SKIP_REASON_TELEMETRY_GAP_CONFIRMED.

# PVE-012 — PVE Evidence Provenance after Workflow Re-Run

## Authority hierarchy used
1. deployed runtime readback;
2. GitHub Actions job log;
3. production Worker source/patch semantics;
4. research checkpoint.

The evidence lane does not use:
- screenshot-only claims;
- inferred D1 row counts;
- workflow green check alone.

## Re-run method
The existing successful read-only QA job was re-run through GitHub Actions.
This avoided:
- new browser login;
- secret disclosure;
- code change;
- Cloudflare setting mutation.

The re-run produced a new QA artifact and runtime receipt.

Status:
READ_ONLY_REPRODUCIBLE_EVIDENCE_PATH_CONFIRMED.
# Imported Concurrent Evidence Index — PVE-013 through PVE-061

The PVE-013~061 work was completed by a parallel research lane and persisted first into `PRICE_VOLUME_CHECKPOINT.md` / `DEEP_LEARNING_CHECKPOINT.md`.
This index prevents false gaps in the evidence chronology; the checkpoint remains the detailed canonical record for those items.

## PVE-013~020 — observability / runtime receipt semantics
- scan/status PV values are runtime acknowledgements, not independent D1 at-rest verification;
- intraday PV result is not persisted as a top-level LAST_MONITOR_KEY receipt;
- generic Cron success does not imply recorder success;
- evidence ladder frozen: ENABLED_ONLY -> RUNTIME_RECEIPT -> FEATURE_AT_REST_VERIFIED -> CLEAN_COHORT_VERIFIED -> OUTCOME_MATURE -> DESCRIPTIVE_EVIDENCE_READY;
- 9/29 inherits stale 9/24 cohort lineage and is DATA_QA-only;
- D1 403 is AT_REST_QA_UNAUTHORIZED, not evidence of zero rows.

## PVE-021~028 — first session and Guard integrity
- 9/29 cold-start and 9/30 earliest-possible baseline candidate semantics;
- daily RVOL continuity is not proven by “last 20 available rows”;
- v0.1 liquidity Guard reverses Formal thousand/general thresholds and checks liquidityException with the wrong type assumption;
- corporate-action/gap/marketStructure plumbing is incomplete and VI is not actually observed;
- price-censor uses previousClose rather than exchange-adjusted reference;
- Guard-label correctness is a separate QA axis;
- first evidence window is falsification-first, not win-rate-first.

## PVE-029~036 — range semantics and H001 common support
- historical 09:00 trueRange uses the last observable prior 13:00 bar while live 09:00 uses quote.previousClose;
- missing intermediate historical slots can make range span more than one 15m interval;
- H001/H002 raw-volume evidence is separable from H003 range/response defects;
- Formal local previous-5 ratio and PV slot RVOL usually share the same current raw 15m source;
- primary common support begins only where the Formal prev5 comparator exists;
- missing-slot sessions can leave Formal local ratio numeric while PV session coverage is invalid.

## PVE-037~044 — fingerprint and baseline-count semantics
- snapshot semantic fingerprint incorrectly includes volatile sourceFetchedAt, so legitimate retries can create false mutation conflicts;
- existing idempotency fixtures do not test a changing fetch timestamp;
- outcome fingerprint is structurally cleaner because insertion timestamp is excluded;
- mutation conflict must be classified as semantic vs volatile-provenance-only vs unknown;
- baseline validSessions is session-object count, not proof all slots/prefix/range fields have 20 valid observations;
- bootstrap skip at >=20 is CACHE_POPULATED only, not feature-ready.

## PVE-045~055 — partial sessions, Acceptance drift and outcomes
- partial sessions can support an exact-slot volume while failing cumulative/range readiness;
- future readiness needs per-slot volume/prefix/range counts;
- stored PV Acceptance is an approximation rather than exact Formal replay due rounding and an A lower-shadow bullish-condition drift;
- 13:00 unresolved Acceptance is session-end censoring;
- stopFirst can be path-order ambiguous;
- B1/B2/B4 require verified slot continuity;
- daily horizons require symbol-session-aware suspension handling;
- H003/H004 have higher evidence gates than H001/H002.

## PVE-056~061 — point-in-time timestamp semantics
- intraday observedAt/Acceptance enteredAt are bar-start identity times, not feature-known times;
- daily observedAt=13:30 is a session anchor, not the later after-market decision-known timestamp;
- conservative featureKnownAt can be derived from sourceFetchedAt with barEnd checks;
- sourceFetchedAt is useful PIT provenance but must not define semantic snapshot identity.

Status:
PVE_013_061_IMPORTED_INDEX / DETAILED_CANONICAL_TEXT_IN_CHECKPOINT.

# PVE-062 — Daily Outcome Finalizer: Factual Path Fields vs Censored / Semantic Labels

## Source audit
V8.11 `pvFinalizeDailyOutcomes` scans prior PV snapshots with `anchorEligible=true` and builds:
- NEXT_OPEN
- NEXT_SESSION
- D1
- D3
- D5
- D10

It uses `pvFutureTradingRows`, which advances with the market-level `nextTradingDate()` calendar and requires a stock history row on every requested future market session.

## A. Fields that can be factual under verified continuity
When:
- anchor price is valid/comparable;
- every required future symbol session is present;
- no incompatible corporate-action price discontinuity contaminates the horizon;

then these are factual realized path summaries:
- `directionReturn`
- `mfe`
- `mae`
- NEXT_OPEN return

They still require a point-in-time/symbol-session quality overlay before primary evidence use.

## B. Symbol suspension creates censoring, not a zero/failure
If the exchange is open but the symbol is legitimately suspended, `pvFutureTradingRows` looks for the market-session date, finds no symbol bar, and returns null for the entire horizon.

Correct interpretation:
`SYMBOL_SESSION_CENSORED_OR_MISSING`

Not:
- zero return;
- false breakout;
- failed setup.

The current row alone cannot distinguish legitimate suspension from missing/stale source data; Corporate-Action/Symbol-Session provenance must do that.

## C. Daily `acceptanceResult` is not always Acceptance-lifecycle truth
After-market snapshots set:
`anchorEligible = anchorClose !== null`
for every recorded Formal plan.

Therefore labels such as:
- B_FAILED_REENTRY
- A_FAILED_REENTRY
- B_DAILY_D3
- A_DAILY_D5
on an AFTER_MARKET snapshot are better interpreted as:
**frozen plan-level close-threshold path labels**,
not proof that a prior intraday B/A acceptance event actually occurred.

For intraday anchor snapshots that genuinely carry an acceptance transition, the interpretation is closer to the intended lifecycle, subject to PVE-049/050 drift.

## D. `stopFirst` is only factual when path order is identifiable
Daily bars are even coarser than 15m bars.

If the first bar capable of resolving the contest touches both:
- stop;
- profitCheck;
the order is unknowable from daily OHLC.

Current code checks low<=stop before high>=profit and can label stopFirst=1 even when profit may have occurred first intraday.

Thus current stored `stopFirst` is eligible only when a replay proves path order unambiguous across bars.

Otherwise:
`STOP_TARGET_ORDER_AMBIGUOUS`.

## E. `rangeAtr`
Current daily outcome builder stores `rangeAtr=null`.
It must not be treated as missing-at-random measured ATR outcome.

Status:
DAILY_PATH_PARTIALLY_SALVAGEABLE / SYMBOL_SESSION_AND_PATH_ORDER_OVERLAY_REQUIRED.


# PVE-063 — Persistence Continuity Can Cross Unobserved Gaps

## Source audit
For both intraday and after-market persistence, v0.1 obtains:
the latest previous snapshot of the same observation type before the new observation.

`pvAdvancePersistence` checks:
- prior state;
- current normalized participation;
- comparable flag.

It does NOT require:
- same market date for INTRADAY_15M;
- adjacent 15m slot;
- previous expected symbol session for AFTER_MARKET;
- bounded gap age.

## Consequences

### Intraday
A symbol's last snapshot on one trading day can seed the next day's 09:00 persistence state.

Worse, if a symbol leaves monitoring and returns days later, the older persistence state can be resumed.

Possible false semantics:
- PERSISTENT across an overnight gap;
- REIGNITED after several unobserved days;
- peakRvol/currentToPeak referencing a stale episode.

### After-market
If a stock is not present in the Formal plan cohort on intervening dates, no daily PV snapshot is stored for those dates.
When it reappears, persistence can inherit the last observed selected-date state even though intervening daily RVOL was unobserved by the Shadow recorder.

## Theory-vs-implementation distinction
PV theory allowed missing/halted observations to **pause** an event only when missingness itself is known.

Here, absence may mean:
- not monitored/selected;
- no snapshot opportunity;
- data failure;
- suspension.

Those are not equivalent to one known missing comparable observation.

## v0.1 evidence rule
Use `pvPersistenceState` as clean evidence only when continuity is independently verified.

Suggested overlay:
- SAME_SESSION_ADJACENT_SLOT
- NEXT_EXPECTED_SYMBOL_SESSION
- OBSERVATION_GAP_UNVERIFIED
- SUSPENSION_GAP_VERIFIED
- NOT_APPLICABLE

For primary intraday persistence evidence, prefer same-session adjacent-slot continuity.
Cross-session persistence remains descriptive/guarded until explicitly specified.

Status:
PERSISTENCE_CONTINUITY_DEFECT_CONFIRMED / RAW_RVOL_UNAFFECTED.


# PVE-064 — Top-Level eventKey Mixes Two Different Event Families

## Source audit
Intraday snapshot top-level identity uses:
`eventKey = acceptance.eventKey || persistence.eventKey || null`.

But both underlying event keys are also preserved:
- `context.pvAcceptanceDetail.eventKey`
- `features.pvPersistenceDetail.eventKey`

## Problem
Acceptance and abnormal-participation persistence are different event concepts.

Example:
1. a volume shock begins -> persistence event PVP:A;
2. later the same wave triggers B_INITIAL_ACCEPTANCE -> acceptance event PVACC:B;
3. top-level eventKey switches from PVP:A to PVACC:B because Acceptance has priority.

If an analyst groups only by top-level eventKey:
one economic/participation episode can be split into multiple apparent events.

The reverse can also happen across session boundaries:
Acceptance resets by marketDate, while Persistence currently can carry forward; top-level key can fall back to an old persistence event.

## Correct v0.1 analysis
Do NOT use top-level `eventKey` as a universal independence unit.

Keep separate dimensions:
- `persistenceEventKey` from nested persistence detail;
- `acceptanceEventKey` from nested acceptance detail;
- `snapshotId` for immutable observation identity.

For H001/H002:
event de-duplication should be based on the relevant participation-event definition, after persistence continuity is verified.

For H003:
acceptance lifecycle may use its own event family, subject to PVE-049/050.

## Salvage
Because both nested event keys remain stored, existing v0.1 rows can be reclassified analytically without rewriting snapshots.

Status:
TOP_LEVEL_EVENTKEY_NOT_UNIVERSAL / NESTED_KEYS_SALVAGEABLE.


# PVE-065 — Exact First-Session QA Receipts for 2026-09-29 and 2026-09-30

## Known calendar / lineage
- 2026-09-25 holiday
- 2026-09-26~27 weekend
- 2026-09-28 holiday
- 2026-09-29 first ordinary post-enable session

The 9/29 intraday plan lineage derives from the recovered 9/24 Formal set, whose rolling-history selection provenance is known problematic from B-130.

Therefore 9/29 is never a clean H001~H004 inference date even if recorder mechanics are perfect.

## 2026-09-29 intraday receipt — recorder/data QA only

Required observations:
- normal INTRADAY_MONITOR cron success;
- PV enabled;
- no PV exception propagated into Formal;
- zero extra ordinary live candle calls;
- completed session15 sidecar has correct bar identities;
- baseline-dependent fields remain UNKNOWN/DATA_INSUFFICIENT rather than neutral fabricated values while cold;
- no claim of alpha;
- cohort overlay = KNOWN_BAD_OR_UNVERIFIED_SELECTION_LINEAGE.

Known v0.1 overlays:
- ILLIQUIDITY_WARNING untrusted (PVE-024);
- price-censor/corporate-action guard untrusted without external overlay (PVE-025/026);
- response/range labels higher-risk (PVE-029/030);
- snapshot mutation conflicts require volatile-provenance classification (PVE-037~042);
- persistence continuity unverified unless same-session adjacent (PVE-063).

## 2026-09-29 23:35 receipt — after-market runtime acknowledgement

If Formal plans >0:
require from `/api/scan/status`:
- scanDate=2026-09-29;
- pvShadow.enabled=true;
- decisionImpact=false;
- formalCoreImpact=false;
- bootstrap.ok=true or explicit per-symbol fail-open errors;
- bootstrap.requested = eligible Formal-plan opportunity count;
- daily.zeroPvPushes=true;
- daily.zeroPvActions=true;
- no PV error changes Formal completion.

Important:
`validSessions>=20` is CACHE_POPULATED only, not feature-ready (PVE-043~048).

If Formal plans = 0:
zero requested bootstrap/snapshots can be correct:
`ZERO_FORMAL_PLANS_VALID`.

Do not call it recorder failure without an opportunity denominator.

## 2026-09-30 intraday receipt — earliest baseline-ready candidate

For H001/H002 field-level QA, require per-row:
- exact current 15m bar provenance;
- common support for Formal local previous-5 ratio and pvSlotRvol20;
- `slotHistoryCount>=20`;
- no invalid current-session coverage;
- for H002 additionally `cumulativeHistoryCount>=20` and current cumulative continuity;
- sourceFetchedAt >= barEnd for feature-known-time overlay;
- no unresolved semantic mutation conflict.

For H003 response evidence additionally:
- `rangeHistoryCount>=20`;
- 09:00 range-anchor issue excluded/overlaid;
- Guard quality validated.

Even if all feature gates pass:
primary inference still requires clean 9/29 selection/cohort provenance.

## At-rest proof limitation
Because direct D1 SELECT remains unauthorized,
runtime/admin receipts cannot alone promote a row to FEATURE_AT_REST_VERIFIED.

Status:
FIRST_SESSION_RECEIPT_V2_FROZEN / OUTCOME_BLIND.


# PVE-066 — PV_SHADOW_V0_1 Evidence Salvage Matrix

## A. Usable now / potentially usable with analysis overlays only

### Raw immutable identity
- snapshotId
- symbol
- marketDate
- observationType
- source bar identity fields

Caveat:
`observedAt` is bar/session identity, not feature-known time.

### H001 core raw pair
Potentially salvageable when common support is proven:
- formalLocalVolumeRatio
- pvSlotRvol20
- slotHistoryCount
- current slot/source bar provenance

Known Guard/response-label defects do not automatically invalidate this raw-volume comparison.

### H002 cumulative pace
Potentially salvageable when:
- cumulativeHistoryCount>=20;
- current session has contiguous required slots;
- same source/unit semantics pass.

### Factual realized OHLC path
Potentially salvageable:
- directionReturn
- MFE
- MAE
when symbol-session continuity and corporate-action price comparability are externally verified.

### Nested event keys
Stored nested:
- persistence event key
- acceptance event key
can be separated offline.
Do not use top-level eventKey as universal grouping.

### Feature-known-time overlay
Can be conservatively derived from:
- sourceFetchedAt;
- barEnd;
without rewriting snapshots.

## B. Guarded / descriptive only in v0.1

- pvPersistenceState when observation adjacency is unverified;
- pvAcceptanceState due rounding and A-branch semantic drift;
- response/range state at 09:00 or gap-contaminated historical range cases;
- after-market acceptanceResult as plan-threshold path label rather than true acceptance lifecycle;
- validSessions as cache-populated indicator, not feature-readiness proof;
- 13:00 EXPIRED_AMBIGUOUS because of session-end censoring.

## C. Quarantine unless independently recomputed/overlaid

- ILLIQUIDITY_WARNING;
- corporate-action / price-censor Guard from raw previousClose;
- VI guard;
- marketStructure/disposition claims without authoritative upstream provenance;
- stopFirst when stop and target order is OHLC-ambiguous;
- daily horizons crossing symbol suspension without symbol-session provenance;
- snapshot mutationConflict before determining whether difference is only volatile sourceFetchedAt;
- FORMAL_SIGNAL_OBSERVED microstructure rows without same-symbol signal match.

## D. Requires future schema/recorder change for clean prospective semantics

- semantic fingerprint excluding volatile acquisition timestamp;
- explicit formalFrame15LatestTime / exact comparator-bar identity;
- explicit featureKnownAt;
- persistence continuity policy / episode gap fields;
- separate top-level persistenceEventKey and acceptanceEventKey;
- corrected Guard plumbing/semantics;
- full per-slot baseline readiness receipt if not otherwise queryable;
- symbol-session-aware daily horizon finalization;
- path-order-safe stop/target outcome state;
- corrected Acceptance replay if H003 is pursued as Formal-semantic evidence.

## E. Not a reason to change Formal
Every defect above is in research Shadow/evidence semantics unless separately proven otherwise.

No finding authorizes:
- A/B rule changes;
- BUY/ADD/REDUCE changes;
- ranking/capital/stop changes;
- push changes.

Status:
V0_1_RAW_VOLUME_EVIDENCE_PARTIALLY_SALVAGEABLE /
H003_H004_HIGHER_GATED /
FORMAL_UNCHANGED.
# PVE-067 — Minimal Clean H001 Row Contract

## Frozen H001 question
Does same-slot `pvSlotRvol20` add incremental information beyond the existing Formal previous-5-bar 15m volume ratio?

This is a raw-volume comparison, not a Guard/response-state test.

## H001 row eligibility

A v0.1 row may enter the first clean H001 descriptive sample only when all are true:

### Identity / schema
- observationType = INTRADAY_15M;
- schemaVersion = PV_SHADOW_V0_1;
- decisionImpact = false;
- symbol/date/snapshotId valid.

### Completed-bar / point-in-time
- source.completedBar = true;
- source.barStart = observedAt;
- source.barEnd is valid;
- sourceFetchedAt >= barEnd;
- baselineAsOfDate < marketDate.

### Common-support fields
- `formalLocalVolumeRatio` finite;
- `pvSlotRvol20` finite;
- `slotHistoryCount >= 20`;
- current slotKey is in the observable 15m slot universe.

Because Formal previous-5 volume ratio does not exist with full five-bar support in the earliest session slots, the primary H001 common-support sample begins only where the existing Formal comparator is valid. Earlier slot-RVOL rows are coverage/descriptive-only, not part of the primary incremental comparison.

### Current-session source continuity
Exclude from clean common support when current-session evidence indicates a missing/interrupted required 15m sequence that makes the two comparator constructions use materially different prior support.

This protects against PVE-036.

### Market-structure provenance
Primary clean analysis excludes or separately guards:
- disposition periodic-auction sessions;
- unsupported market structure;
- unresolved corporate-action/reference-price regimes when they affect the outcome interpretation.

For the raw volume metric relationship itself, price-censoring need not invalidate the measured slot volume, but outcome analysis must stratify/guard it.

### Cohort quality
Primary H001 inference additionally requires:
- clean Formal selection/pool provenance;
- no known stale-history selection lineage.

9/29 fails this cohort condition even if feature rows are mechanically valid.

## Comparator-bar provenance class
v0.1 does not persist an explicit `formalFrame15LatestTime`.

However code audit proves both:
- Formal frame15;
- PV session15
are derived from the same fetched raw 15m response in the normal 15m refresh path.

Therefore classify v0.1 rows as:
`COMMON_SOURCE_CODE_INVARIANT`
when all source/slot continuity conditions pass.

Do not call them:
`EXPLICIT_SAME_BAR_ID_VERIFIED`.

That stronger class requires a future schema field.

Status:
H001_MINIMUM_ROW_CONTRACT_FROZEN.


# PVE-068 — Minimal Clean H002 Row Contract

## Frozen H002 question
Does `pvCumvolPace20` add information beyond same-slot RVOL and the existing local previous-5 volume ratio?

## Nested sample rule
Primary H002 incremental comparison is a subset of H001 common support.

Therefore every H002 row must first pass PVE-067.

Additional requirements:
- `pvCumvolPace20` finite;
- `cumulativeHistoryCount >= 20`;
- current-session prefix from 09:00 through the current slot is complete under verified provider slot semantics;
- no MISSING_REQUIRED_SESSION_SLOT for the required prefix;
- historical cumulative denominator comes from prior sessions only.

## Why H002 is stricter
Exact-slot volume can be valid even if another slot in a historical session is missing.

Cumulative pace cannot safely use that session's prefix if an earlier slot is missing.

Thus:
H002 eligibility <= H001 eligibility.

## What is not required
H002 raw-volume analysis does not require:
- valid rangeHistoryCount;
- trusted pvResponseState;
- trusted ILLIQUIDITY_WARNING;
provided outcome/market-structure overlays are handled separately.

## First descriptive use
Before outcomes:
compare:
- H001 local ratio;
- slot RVOL;
- cumulative pace;
on exactly the nested eligible H002 sample.

Do not compare H001 and H002 performance using different hidden denominators without reporting the sample difference.

Status:
H002_NESTED_ROW_CONTRACT_FROZEN.


# PVE-069 — Independence / Event Accounting without the Mixed Top-Level eventKey

## Primary H001/H002 population
H001/H002 are not restricted to high-RVOL events.
Restricting only to high volume would recreate the selection/collider problem identified in PV-128.

Therefore the primary dataset retains the full eligible RVOL range.

## Dependence handling
Multiple 15m observations from:
- the same symbol;
- the same session;
- the same market date
are not independent.

Primary inference continues to use:
- date-level aggregation / date-block resampling;
- symbol/session clustering where model fitting is used.

## Secondary abnormal-volume episode analysis
When an abnormal participation episode is specifically studied:

Do NOT group by the v0.1 top-level eventKey.

Instead:
- use nested persistence event key only when continuity is independently verified;
OR
- reconstruct a session-local analysis event from eligible ordered raw RVOL rows under the already-frozen 1.3/hysteresis semantics.

Any reconstructed key is an **analysis overlay**, never a rewritten snapshot identity.

Suggested overlay:
`PVE:PERSISTENCE_SESSION:<date>:<symbol>:<firstEligibleBarStart>`.

If row coverage is incomplete:
episode grouping = UNKNOWN.

## Acceptance-event studies
Use:
`context.pvAcceptanceDetail.eventKey`
as the Acceptance family key, separately from participation persistence.

## No pseudo-independent inflation
A single snapshot may belong simultaneously to:
- a participation episode;
- an Acceptance episode.

That does not create two independent market observations.

Status:
EVENT_FAMILIES_SEPARATED / DATE_DEPENDENCE_PRIMARY.


# PVE-070 — Outcome Eligibility Is Field-Specific, Not One Boolean

## Problem
A row can have:
- valid D1 return;
- valid MFE/MAE;
- ambiguous stopFirst;
- guarded false-break semantics.

One global `outcomeValid=true/false` would discard useful evidence or overstate bad fields.

## Frozen field-level states

### Direction / return
- DIRECTION_VALID
- DIRECTION_CA_UNRESOLVED
- DIRECTION_SYMBOL_SESSION_CENSORED
- DIRECTION_SOURCE_GAP
- DIRECTION_NOT_MATURE

### MFE / MAE
- EXCURSION_VALID
- EXCURSION_CA_UNRESOLVED
- EXCURSION_SYMBOL_SESSION_CENSORED
- EXCURSION_SOURCE_GAP
- EXCURSION_NOT_MATURE

### Structural failure / falseBreak
- STRUCTURE_VALID
- STRUCTURE_ACCEPTANCE_SEMANTICS_GUARDED
- STRUCTURE_HORIZON_GAP
- STRUCTURE_SESSION_END_CENSORED
- STRUCTURE_NOT_MATURE

### stopFirst
- STOPFIRST_VALID_STOP_BEFORE_TARGET
- STOPFIRST_VALID_TARGET_BEFORE_STOP
- STOPFIRST_SAME_BAR_ORDER_AMBIGUOUS
- STOPFIRST_NO_STOP_DEFINED
- STOPFIRST_NOT_MATURE

## Same-session B horizons
`INCOMPLETE_SESSION_END` is a censored horizon, not a negative setup result.

Exact B1/B2/B4 requires verified slot continuity.

## Daily horizons
Require symbol-session-aware continuity.

If a legitimate suspension interrupts the market-session horizon:
do not silently advance to the next available stock bar under the same D-label.
Either:
- censor the original market-session horizon;
or
- define a separate future symbol-session horizon under a new preregistered label.

Status:
FIELD_SPECIFIC_OUTCOME_QUALITY_FROZEN.


# PVE-071 — Sample Accounting Receipt: No Silent Row Disappearance

## Purpose
Every report must explain how many potential observations were lost at each quality gate.

## Frozen funnel

1. RAW_SNAPSHOTS
2. SCHEMA_V0_1
3. DECISION_IMPACT_FALSE
4. COMPLETED_SOURCE_BAR
5. PIT_ELIGIBLE
6. H001_COMMON_SUPPORT_FIELDS
7. H001_SLOT_BASELINE_READY
8. CURRENT_SESSION_CONTINUITY_PASS
9. MARKET_STRUCTURE_PRIMARY_ELIGIBLE
10. COHORT_PROVENANCE_CLEAN
11. H001_PRIMARY_ELIGIBLE
12. H002_CUMULATIVE_READY
13. H002_PRIMARY_ELIGIBLE
14. OUTCOME_MATURE_BY_FIELD

## Required counts
For every gate report:
- rows entering;
- rows passing;
- rows failing;
- rows UNKNOWN;
- unique symbols;
- unique market dates.

## Exclusion reasons
A row may carry multiple reason codes.

Also assign one deterministic `primaryExclusionReason` using a preregistered precedence so totals reconcile.

Example precedence:
SOURCE_INVALID
-> PIT_INVALID
-> BASELINE_NOT_READY
-> SESSION_CONTINUITY
-> MARKET_STRUCTURE
-> COHORT_PROVENANCE
-> OUTCOME_NOT_MATURE.

## Never drop nulls silently
A regression/library default that removes null rows without a receipt is prohibited.

## Denominator transparency
H001 and H002 must show different denominators when H002 cumulative requirements remove rows.

Status:
SAMPLE_ACCOUNTING_RECEIPT_FROZEN.


# PVE-072 — First H001/H002 Report Shape Frozen before Outcome Inspection

## Part 1 — Data-quality / coverage
Show:
- raw snapshot count;
- H001 eligible count;
- H002 eligible count;
- independent dates;
- symbols;
- session-phase distribution;
- pool/channel distribution;
- baseline count distributions;
- source/PIT/cohort exclusion reasons.

No return statistics yet.

## Part 2 — Metric relationship
On H001 common support:
- distribution of formalLocalVolumeRatio;
- distribution of pvSlotRvol20;
- rank correlation;
- disagreement matrix using frozen semantic bands;
- same-date/symbol examples of large disagreement.

On H002 nested support:
- distribution of pvCumvolPace20;
- relationship to slot RVOL;
- identify one-slot spike vs persistent-session participation descriptively.

Do not call one metric “better” here.

## Part 3 — Pre-registered outcome comparison, only after maturity

Frozen sequence:
A. existing Formal/context baseline
B. + formal local previous-5 volume ratio
C. + pvSlotRvol20
D. + pvCumvolPace20

Report:
- structural failure/no-follow-through where field-valid;
- median MFE;
- median MAE;
- directionReturn where field-valid;
- coverage loss from each stage.

Use:
- equal-date-weighted primary summaries;
- count-weighted secondary summaries;
- leave-one-date-out/date-block uncertainty when sample size permits.

## Utility view
If a hypothetical warning/filter is explored later:
report adverse events captured **and** valid opportunities lost.

No winner, threshold change or Formal proposal from the first descriptive report.

## Multiple-testing rule
H001/H002 frozen family only.
No scanning dozens of alternative RVOL thresholds after results arrive.

Status:
FIRST_REPORT_PREREGISTERED / OUTCOME_BLIND_DESIGN.
# PVE-073 — Daily Outcome Semantics Depend on Snapshot Observation Type

## Source audit
`pvFinalizeDailyOutcomes` queries all PV snapshots with `anchorEligible=true`.
It does not restrict:
- AFTER_MARKET only;
- INTRADAY_15M only.

Thus daily horizons can be attached to both snapshot families.

## AFTER_MARKET anchor
Anchor close is the current daily close (or Formal close fallback).

Interpretation:
- NEXT_OPEN ~= close-to-next-open, subject to corporate-action/reference-price comparability;
- D1 ~= close-to-next-close;
- D3/D5/D10 are close-anchored future daily horizons.

## INTRADAY_15M anchor
Anchor close is the accepted intraday 15m bar close.

Then:
- NEXT_OPEN = intraday-anchor-close -> next-session open;
- D1 = intraday-anchor-close -> next-session close;
- D3 etc. likewise begin from the intraday anchor price.

These include price movement after the intraday anchor, but the daily outcome builder's MFE/MAE scans only future daily bars starting on the next market session.

Therefore for INTRADAY anchors:
- directionReturn spans anchor price to future close;
- MFE/MAE omit the remainder of the anchor-day intraday path.

They are factual next-session-bar excursions relative to the anchor,
not a complete continuous event-to-horizon MFE/MAE path.

## Analysis rule
Never pool AFTER_MARKET and INTRADAY_15M D1/D3/D5/D10 as if the anchor semantics were identical.

Always join outcomes back to the snapshot observationType.

Status:
OUTCOME_ANCHOR_TYPE_STRATIFICATION_REQUIRED.


# PVE-074 — NEXT_SESSION and D1 Are Numerically Redundant in v0.1

## Source audit
For both:
- NEXT_SESSION
- D1

`pvBuildDailyOutcome` sets future row count = 1.

Both therefore use the same next market-session daily OHLC.

For a given snapshot:
- directionReturn is identical;
- MFE is identical;
- MAE is identical;
- stopFirst path input is identical;
- falseBreak path input is identical.

Only acceptanceResult naming differs:
- `<channel>_NEXT_SESSION`
vs
- `<channel>_DAILY_D1`.

## Consequence
Do not count NEXT_SESSION and D1 as:
- two independent outcomes;
- two confirming horizons;
- two tests in a significance tally.

For v0.1 evidence they are one numerical horizon family with two labels.

## Reporting
Prefer one canonical numerical horizon:
`NEXT_SESSION/D1`
and report duplicate storage as a schema-semantic fact.

Status:
NEXT_SESSION_D1_DUPLICATE_HORIZON_CONFIRMED.


# PVE-075 — outcomeComplete=1 Can Mean Censored, Not Numerically Observed

## Same-session finalizer
When the session reaches the last observable 13:00-start bar and an anchor does not have enough future bars for B1/B2/B4, the builder returns:
- outcomeComplete=1;
- directionReturn=null;
- MFE=null;
- MAE=null;
- acceptanceResult=INCOMPLETE_SESSION_END.

## Interpretation
`outcomeComplete=1` means:
“the finalizer has reached a terminal state for this horizon.”

It does NOT necessarily mean:
“a valid numerical outcome was observed.”

## Required maturity dimensions
Separate:
- FINALIZATION_COMPLETE
- NUMERICAL_OUTCOME_OBSERVED
- CENSORED_SESSION_END
- PATH_ORDER_AMBIGUOUS
- SOURCE_GAP
- NOT_YET_MATURE

## Sample accounting
A query using only:
`WHERE outcome_complete=1`
will overstate usable outcome sample size.

Status:
FINALIZATION_STATUS_NOT_OUTCOME_VALIDITY_FROZEN.


# PVE-076 — Missing Daily Outcome Row Is Ambiguous

## Current daily finalizer behavior
If `pvFutureTradingRows` cannot produce every requested future market-date row, `pvBuildDailyOutcome` returns null.

No outcome row is inserted.

## Absence can mean
- horizon not mature yet;
- legitimate symbol suspension;
- stale/missing daily history;
- source ingestion failure;
- horizon beyond currently loaded cache;
- corporate-action/data path issue.

Therefore:
“no D5 row”
is not a single missingness mechanism.

## Evidence rule
Outcome maturity must be derived from:
- current date / official market calendar;
- expected symbol sessions;
- source-history availability;
- corporate-action provenance.

Then classify missing outcome explicitly.

Do not treat missing rows as:
- zero;
- failure;
- random missingness.

Status:
OUTCOME_ROW_ABSENCE_NEEDS_CAUSAL_MISSINGNESS_CLASSIFICATION.


# PVE-077 — 45-Day Finalizer Lookback Can Strand Long-Censored Snapshots

## Source audit
`pvFinalizeDailyOutcomes` only scans PV snapshots:
`market_date >= currentMarketDate - 45 calendar days`.

## Normal case
For ordinary trading and D10, 45 calendar days is generous.

## Edge case
A symbol can have:
- long suspension;
- prolonged source outage;
- unresolved history-quality gap.

The snapshot can age beyond the 45-day scan window before the intended horizon becomes resolvable.

Then the v0.1 finalizer will no longer revisit it.

## Interpretation
This is not a concern for normal D1/D3/D5/D10 maturity.
It matters specifically for:
- long censoring;
- operational recovery;
- post-hoc completeness accounting.

## Evidence rule
Do not interpret an old permanently missing outcome as market evidence.

A future outcome-completeness process should track explicit pending/censored state rather than rely only on a rolling snapshot lookback.

Status:
LONG_CENSORING_FINALIZER_WINDOW_LIMIT_IDENTIFIED.


# PVE-078 — Daily Plan Outcomes and Intraday Acceptance Outcomes Are Different Cohorts

## AFTER_MARKET snapshot inclusion
Daily snapshot:
`anchorEligible = anchorClose !== null`.

Thus essentially every valid recorded Formal plan can receive future daily outcomes.

## INTRADAY snapshot inclusion
Intraday anchorEligible is true only on the transition:
- B_INITIAL_ACCEPTANCE;
- A_REACCELERATION.

Thus its daily outcomes describe a much narrower, execution-state-conditioned cohort.

## Consequence
A pooled D1/D3/D5 table would mix:
- selected-plan path outcomes;
- confirmed/reaccelerated intraday-event outcomes.

That creates selection-conditioning differences before any PV metric is considered.

## Required cohort labels
At minimum:
- PLAN_AFTER_MARKET_ANCHOR
- INTRADAY_B_INITIAL_ACCEPTANCE_ANCHOR
- INTRADAY_A_REACCELERATION_ANCHOR

Do not compare their average returns as if the only difference were PV state.

Status:
DAILY_OUTCOME_COHORT_HETEROGENEITY_FROZEN.
# PVE-079 — Intraday Baseline Cache Is Mutable; Snapshot Ratios Are Frozen but Denominators Are Not

## Baseline table behavior
`v7_pv_intraday_baselines` keeps one mutable row per symbol.

`pvWriteBaseline` overwrites:
- valid_sessions;
- last_market_date;
- slot_stats_json;
- updated_at.

This is expected for a rolling cache.

## Snapshot behavior
A PV snapshot freezes:
- pvSlotRvol20;
- pvCumvolPace20;
- range/progress derived fields;
- baselineAsOfDate;
- coverage counts.

But it does NOT freeze:
- slotVolumeMedian20;
- cumulativeVolumeMedian20;
- slotRangeMedian20;
- the exact baseline session/date list used for that feature.

## Consequence
After the baseline cache rolls or is rebuilt:
the exact denominator behind an old stored ratio may no longer be reconstructable from the current baseline table alone.

The stored ratio remains immutable evidence of what v0.1 computed,
but independent denominator replay requires:
- archived source candles;
or
- a future baseline-receipt/fingerprint design.

## Analysis rule
Use old ratios as recorded values only when their row-level quality/provenance passes.

Do not claim:
“we independently reproduced the old baseline median”
from today's mutable cache unless a matching baseline vintage is available.

Status:
SNAPSHOT_RATIO_FROZEN / BASELINE_DENOMINATOR_VINTAGE_NOT_FROZEN.


# PVE-080 — Baseline Session Provenance Can Change by Merge Source

## Merge semantics
`pvMergeBaselineSessions(existing,incoming)` inserts:
1. existing sessions;
2. incoming sessions.

A same-marketDate incoming session overwrites the existing session in the Map.

## Potential source paths
A baseline session may originate from:
- historical Fugle 15m bootstrap;
- prospectively rolled observed session at the final 13:00 slot.

But `pvWriteBaseline` stores one baseline-level source label:
`FUGLE_HISTORICAL_15M`.

It does not preserve per-session source/vintage.

## Implication
If a later bootstrap is performed while validSessions<20, historical incoming data can replace an already rolled same-date session.

This is not automatically wrong:
historical and live candle values may legitimately agree.

But it means:
- per-session acquisition provenance is not auditable;
- provider revisions cannot be distinguished from original live observation;
- baseline cache is not an immutable point-in-time archive.

## Future clean design
Per-session baseline receipt should include:
- marketDate;
- source mode: LIVE_ROLL / HISTORICAL_BOOTSTRAP;
- fetchedAt;
- source fingerprint;
- slot coverage fingerprint.

v0.1 does not provide this.

Status:
BASELINE_SESSION_PROVENANCE_COARSE.


# PVE-081 — “Session” in v0.1 Baseline Means Observable PV Window, Not Full Exchange Day

## Current roll condition
`pvRollObservedSession` rolls a session when the latest PV bar is slot 13:00.

Current monitor does not capture the 13:15-start bar or closing-auction activity.

## Historical normalization
Historical sessions are also reduced to the same `PV_SHADOW_OBSERVABLE_SLOTS`.

Therefore the design is internally aligned:
both live and historical PV baselines describe the observable window.

## Required terminology
Use:
`PV_OBSERVABLE_SESSION`
or:
`09:00_TO_13:00_START_SLOT_WINDOW`

Do not describe baseline `lastMarketDate` as proving a complete full-market-day 15m record through the close.

## Benefit
This is not a defect for H001/H002:
same-slot comparison is deliberately restricted to the current monitor's observable window.

It becomes a defect only if someone later interprets:
- cumulative pace as full-day volume pace;
- baseline session as including close-auction activity.

Status:
OBSERVABLE_WINDOW_SEMANTICS_FROZEN.


# PVE-082 — Bootstrap Skip Has a Stale-Baseline Freshness Defect

## Source audit
`pvBootstrapSymbol` currently returns early when:
- schemaVersion matches;
- validSessions >= 20.

It does NOT test:
- lastMarketDate recency;
- expected prior symbol session;
- days since last monitored session;
- per-slot last valid date.

## Failure scenario
1. Symbol A is monitored and receives >=20 cached sessions.
2. Symbol A leaves the Formal monitored cohort for weeks/months.
3. Its PV baseline is not rolled while unmonitored.
4. Symbol A later re-enters the Formal plan.
5. after-market bootstrap sees validSessions>=20 and skips refresh.
6. next-day pvSlotRvol20 can compare current volume against an old historical window rather than the most recent prior sessions.

## Why this matters
The meaning of “RVOL20” is:
recent 20 prior valid comparable sessions.

A baseline with 20 old sessions is not equivalent to the recent 20-session baseline.

## Distinct from B-130
This is:
`PV_INTRADAY_BASELINE_FRESHNESS`

B-130 is:
`FORMAL_DAILY_HISTORY_FRESHNESS`.

They are separate data chains and both require quality control.

## Current evidence
No post-enable live sample has yet demonstrated this scenario.
The defect is source-code-proven and should be prospectively monitored.

Status:
PV_BASELINE_STALENESS_DEFECT_CONFIRMED_BY_CODE.


# PVE-083 — H001/H002 Need a Baseline Freshness Overlay, Not Just >=20 Counts

## New required quality dimension
For each PV row derive:
`baselineFreshnessState`.

Candidate states:
- CURRENT_EXPECTED_PRIOR_SESSION
- RECENT_WITH_VERIFIED_SUSPENSION
- STALE_BASELINE
- PRIOR_SLOT_MISSING_PROVENANCE_UNKNOWN
- UNKNOWN

## Evidence
Use:
- snapshot.baselineAsOfDate;
- marketDate;
- official exchange sessions;
- verified symbol-session suspension provenance;
- field-specific slot/prefix validity.

## Primary H001/H002 rule
`slotHistoryCount>=20`
is necessary but not sufficient.

Also require:
baselineAsOfDate consistent with the latest expected comparable prior session under the field's missing-session policy.

## Important nuance
Theory excludes legitimate missing/halted observations rather than zero-filling them.

Therefore a one-session lag can be valid only when:
- the missing slot/session is explicitly explained and allowed by the preregistered rule.

Unknown data gaps do not earn the same exemption.

Status:
BASELINE_FRESHNESS_OVERLAY_REQUIRED.


# PVE-084 — Bootstrap “skipped” Is Even Weaker Than Previously Classified

PVE-044 established:
`skipped + validSessions>=20`
means CACHE_POPULATED, not feature-ready.

PVE-082 adds:
it does not prove the cache is recent.

Therefore the hierarchy is:

1. CACHE_POPULATED
2. SLOT_COUNT_READY
3. PREFIX/RANGE_COUNT_READY
4. BASELINE_FRESHNESS_VERIFIED
5. FIELD_READY

A bootstrap receipt such as:
`{skipped:true, validSessions:40}`
cannot by itself establish any of levels 2~5.

## First 9/29 bootstrap nuance
For a truly empty new production baseline, the initial after-market bootstrap should fetch historical data and avoid this skip defect.

But any symbol with a pre-existing cache must still be checked by `lastMarketDate`, not assumed clean.

Status:
BOOTSTRAP_SKIP_NOT_FRESHNESS_PROOF.


# PVE-085 — Baseline Versioning Needs Content Identity, Not Only Schema Version

## Current baseline version
Baseline rows carry:
- schemaVersion = PV_SHADOW_V0_1.

That tells us the algorithm/schema family.

It does not identify:
- which 20 sessions;
- which source revision;
- which slot completeness;
- which acquisition vintage.

## Future evidence contract
A stronger baseline receipt can include:
- baselineContentFingerprint;
- ordered marketDate list;
- per-slot valid counts;
- last comparable date;
- source-vintage metadata.

Snapshot can then store:
- baselineContentFingerprint used at feature time.

## Why
Schema version answers:
“How was the baseline supposed to be built?”

Content fingerprint answers:
“Which exact baseline was actually used?”

Both are needed for independent reproducibility.

Status:
SCHEMA_VERSION_NOT_BASELINE_CONTENT_IDENTITY.
# PVE-086 — Bootstrap Runtime ok Does Not Mean >=20 Ready Sessions

## Source audit
`bootstrapPvShadowBaselinesSafe` reports:
`ok = results.every(x => !x.error)`.

A successfully fetched/saved symbol with:
- validSessions < 20
still has no `error`.

It is counted as:
`bootstrapped`
when it was fetched and saved.

## Consequence
Runtime receipt:
- bootstrap.ok=true;
- bootstrapped=N
proves the bootstrap code path completed without thrown errors.

It does NOT prove:
- >=20 sessions;
- per-slot >=20;
- cumulative >=20;
- range >=20;
- baseline freshness.

## QA terminology
Use:
- BOOTSTRAP_EXECUTION_OK
separately from:
- BASELINE_FIELD_READY.

Status:
BOOTSTRAP_OK_NOT_READINESS_FROZEN.


# PVE-087 — After-Market Bootstrap Omits the Selection-Day Session for Newly Selected Symbols

## Timing architecture
The after-market scan on date T creates the Formal plan set used for the next trading session.

V8.11 then calls:
`bootstrapPvShadowBaselinesSafe(env, stocks, T)`
on those newly selected Formal stocks.

## Historical fetch window
`pvBootstrapSymbol` fetches:
from T-180 calendar days
through:
`T-1`.

Thus the historical bootstrap explicitly excludes date T.

## When date T is still present
A symbol that was already monitored intraday on T may have had:
`pvRollObservedSession`
write the T observable session at the 13:00-start bar.

The later bootstrap merges:
- existing live-rolled T session;
- historical sessions through T-1.

This gives a fresh prior-session baseline for T+1.

## Newly selected symbol problem
If a symbol was NOT in the intraday monitored set on T but is newly selected after market on T:
- it has no live-rolled T session;
- historical bootstrap stops at T-1;
- baseline for T+1 omits the immediately prior trading session T.

## Concrete first-post-holiday implication
For a new 2026-09-29 after-market selection:
historical fetch ending 2026-09-28 effectively ends at the prior open session before the holiday block, likely 2026-09-24.

Therefore a 2026-09-30 first intraday row can have a baseline that omits 2026-09-29.

Status:
NEW_SELECTION_SELECTION_DAY_BASELINE_GAP_CONFIRMED_BY_CODE.


# PVE-088 — Baseline Freshness on T+1 Depends on Plan-Set Overlap

Define:
`PLAN_OVERLAP_T = symbol monitored intraday on selection date T AND selected again for T+1`.

## Overlap symbol
Likely path:
- T session rolled from live data;
- after-market bootstrap merges older history;
- T+1 baseline can include T.

Still requires all other field-quality checks.

## New symbol
Path:
- no T live roll;
- bootstrap fetch ends at T-1;
- T+1 baseline latest date is stale by at least the selection session.

## Re-entering symbol with old cache
Additional risk from PVE-082:
if old cache already has validSessions>=20, bootstrap may skip entirely even when much older.

## Evidence requirement
First H001/H002 report must stratify:
- CONTINUING_MONITORED_PLAN
- NEW_AFTER_MARKET_SELECTION
- REENTERED_WITH_EXISTING_CACHE
- UNKNOWN_LINEAGE.

Do not assume a single bootstrap quality state across all selected names.

Status:
PLAN_OVERLAP_BASELINE_FRESHNESS_INTERACTION_FROZEN.


# PVE-089 — baselineAsOfDate Can Quarantine the Selection-Day Gap

## Existing stored field
Every intraday snapshot stores:
`coverage.baselineAsOfDate`.

This gives an important v0.1 salvage path.

## For date T+1
Derive:
`expectedLatestComparableSession`
using:
- exchange calendar;
- verified symbol-session suspensions;
- field-specific missing-slot rules.

Then compare:
`baselineAsOfDate`.

## Example
For a normal symbol on 2026-09-30:
expected latest prior symbol session = 2026-09-29.

If snapshot baselineAsOfDate = 2026-09-24:
classify:
`STALE_BASELINE_SELECTION_DAY_OMITTED`.

## Limitation
baselineAsOfDate is based on the last20 exact-slot row set.
It does not freeze the entire date list or denominator.

Therefore it can detect obvious staleness,
but not prove full 20-session continuity by itself.

Status:
V0_1_STALE_BASELINE_DETECTION_PARTIALLY_SALVAGEABLE.


# PVE-090 — Future Bootstrap Semantics Needed for Newly Selected Next-Day Plans

## Desired semantic objective
At T after market, prepare the baseline for T+1 using all prior comparable sessions available by then, including T if T is a completed eligible session.

## Safe conceptual options

### A. Historical fetch through T after close
For newly selected symbols:
fetch historical 15m through T once provider data availability is verified after market.

### B. Capture a broader prospective control/eligible universe intraday
Then T's live session may already exist before after-market selection.

This is more expensive and changes research collection scope.

### C. Hybrid
Reuse live T session if available;
otherwise fetch T historical after close.

## Governance
Any future change must:
- preserve no-look-ahead;
- verify provider T-day historical availability timing;
- keep zero/controlled API budget;
- version baseline semantics;
- not modify Formal selection.

No implementation is authorized here.

Status:
NEXT_DAY_BASELINE_SEMANTIC_FIX_REQUIRED_FOR_FUTURE_VERSION.


# PVE-091 — 2026-09-30 Is Not Automatically a Uniform Baseline-Ready Session

Earlier planning called 9/30 the first possible baseline-ready day.

PVE-087/088 now refine that statement.

## 9/30 eligibility classes

### Potentially fresh
Symbols monitored on 9/29 and retained in the 9/29 after-market plan,
provided:
- 9/29 session rolled;
- bootstrap/merge succeeded;
- per-slot counts/freshness pass.

### Likely selection-day-gap
Symbols newly selected after market on 9/29 and not monitored intraday on 9/29.

### Potentially stale re-entry
Symbols carrying a >=20-session old cache that causes bootstrap skip.

## Conclusion
9/30 remains the earliest **candidate date**,
but row-level `baselineAsOfDate` and plan lineage decide eligibility.

No date-level blanket “baseline ready” flag is valid.

Status:
FIRST_BASELINE_DATE_MUST_BE_ROW_SPECIFIC.
# PVE-092 — Old-Monitor vs New-Plan Overlap Is Reconstructable from Existing Admin Readbacks

## Existing endpoints
`/api/live` returns the last persisted intraday live snapshot, including its result symbols.

`/api/scan/status` returns the latest after-market summary, including the newly selected Formal `stocks`.

The after-market scan does not overwrite the intraday live snapshot.

## Therefore after the T scan
Compute:
- `intradaySymbolsT = live.results.symbol`
- `nextPlanSymbols = scan.stocks.symbol`

Classify:
- CONTINUING_MONITORED_PLAN = intersection
- NEW_AFTER_MARKET_SELECTION = nextPlan - intraday
- DROPPED_AFTER_MARKET = intraday - nextPlan

This is enough to identify the major PVE-087 baseline lineage class without direct D1.

## Limitation
The readback must itself be:
- date/time matched;
- not stale from an earlier day;
- captured before a later intraday session overwrites live state.

Status:
PLAN_OVERLAP_ADMIN_READBACK_FEASIBLE.


# PVE-093 — First-Day Baseline Lineage Classes

For each next-plan symbol after scan T:

## Class A — CONTINUING_MONITORED_PLAN
Evidence:
- symbol in T intraday live results;
- symbol in new scan.stocks.

Expected baseline path:
T may have been live-rolled at 13:00-start completion.

Still verify:
- roll actually occurred;
- bootstrap result;
- next-day baselineAsOfDate.

## Class B — NEW_AFTER_MARKET_SELECTION
Evidence:
- symbol not in T intraday results;
- symbol in new scan.stocks.

Expected v0.1 path:
historical bootstrap through T-1 only.
Thus current T session is omitted unless an older cache independently contains it, which is not expected for a genuinely new uncached symbol.

## Class C — REENTERED_WITH_EXISTING_CACHE
A new-plan symbol may have old PV cache from an earlier monitoring period.

If bootstrap returns:
`skipped=true, validSessions>=20`
it may belong here.

Freshness is not established by the skip receipt.

## Class D — ZERO_PLAN
No selected Formal stock.
No baseline opportunity exists.

## Class E — UNKNOWN_LINEAGE
Live/scan dates mismatch or readback is incomplete.

Status:
FIRST_DAY_BASELINE_LINEAGE_FROZEN.


# PVE-094 — Bootstrap Skip Receipt Hides the Most Important Freshness Field

## Non-skipped result
`pvBootstrapSymbol` returns:
- symbol;
- skipped=false;
- stored;
- validSessions;
- lastMarketDate.

## Skipped result
When cache count>=20 it returns only:
- symbol;
- skipped=true;
- validSessions.

It omits:
- lastMarketDate;
- updatedAt;
- baseline content/vintage.

## Consequence
The after-market scan receipt can directly assess recency for a newly bootstrapped symbol,
but cannot assess recency for the symbol most likely to suffer PVE-082 stale-cache re-entry.

## Evidence rule
`skipped=true` =>
`BASELINE_FRESHNESS_UNKNOWN_FROM_SCAN_RECEIPT`.

Do not interpret as:
`BASELINE_READY`.

Next-day snapshot.baselineAsOfDate can partially recover this information.

Status:
SKIPPED_BOOTSTRAP_OBSERVABILITY_BLIND_SPOT.


# PVE-095 — Baseline Freshness Age Must Use Expected Symbol Sessions

## Calendar-day age is wrong
A four-calendar-day lag across:
- weekend;
- official holiday
may still be fully fresh.

## Proposed measure
For current observation date T:

`missingRecentExpectedSessions =
count(expected symbol sessions d where baselineAsOfDate < d < T)`.

Interpretation:
- 0 = baseline reaches the latest expected prior comparable session;
- 1 = one expected recent session absent;
- >1 = increasingly stale;
- UNKNOWN if suspension provenance is unresolved.

## Slot-specific nuance
A symbol may trade on the prior session but the exact slot can be missing from provider data.

Then:
- session exists;
- H001 slot freshness is not automatically valid.

Reason code:
`EXPECTED_SESSION_SLOT_MISSING_UNEXPLAINED`.

Legitimate verified non-trading/suspension sessions do not count as missing.

Status:
BASELINE_AGE_IN_SYMBOL_SESSIONS_FROZEN.


# PVE-096 — Exact 9/29 Night QA Receipt without D1 Direct Read

After the successful 2026-09-29 after-market scan, collect read-only:

## A. Cron
- scheduled after-market row;
- status;
- Fugle calls;
- scan completion timestamp.

## B. /api/live
- live snapshot market date / generatedAt;
- prior intraday result symbols.

## C. /api/scan/status
- scanDate;
- planDate;
- selected stocks;
- pipeline completion;
- pvShadow.enabled;
- pvShadow.bootstrap;
- pvShadow.daily;
- zeroPvPushes;
- zeroPvActions.

## D. Derive plan overlap
Per PVE-092/093.

## E. For each bootstrap result
If non-skipped:
- validSessions;
- lastMarketDate.

Classify:
- current through T;
- selection-day omitted;
- insufficient count.

If skipped:
freshness remains UNKNOWN_FROM_RECEIPT.

## F. Daily snapshot runtime
Record:
- stored;
- outcomesStored;
- per-symbol save result/errors.

Do not equate runtime stored count with at-rest duplicate/fingerprint proof.

## G. Formal safety
Confirm:
- plan/push pipeline completed independently;
- PV errors, if any, did not change Formal status.

Status:
FIRST_AFTER_MARKET_EVIDENCE_RECEIPT_FROZEN.


# PVE-097 — Non-Skipped Bootstrap Result Can Directly Reveal the Selection-Day Gap

For a non-skipped 9/29 bootstrap result:

### If lastMarketDate = 2026-09-29
This implies the baseline merged an existing live-rolled 9/29 session.

Likely:
CONTINUING_MONITORED_PLAN.

### If lastMarketDate < 2026-09-29
For an ordinary non-suspended new plan symbol:
the baseline is missing the selection-day session.

On 2026-09-30:
H001/H002 baseline freshness fails until separately refreshed/repaired.

### If validSessions < 20
Count readiness also fails.

## Strong advantage
This diagnosis uses the existing scan runtime receipt;
it does not require D1 query permission.

Status:
NON_SKIPPED_BOOTSTRAP_FRESHNESS_OBSERVABLE.


# PVE-098 — Daily Feature Validity and Daily Outcome Anchor Validity Can Diverge

## Source audit
If cached daily history lacks the current marketDate:
- `daily.current = null`;
- pvDailyRvol20 = null;
- guard includes INVALID_SOURCE_DATA.

But daily context uses:
`anchorClose = daily.current.close || plan.formalClose`.

If Formal plan has a valid `formalClose`:
`anchorEligible=true`
and future daily outcomes may later be finalized.

## Interpretation
The row can have:
- invalid daily PV feature;
- but a potentially valid frozen Formal plan anchor price.

Therefore:
feature quality != outcome-anchor quality.

## Evidence rule
Do not discard factual plan-path outcomes solely because pvDailyRvol20 was invalid.

Likewise:
do not treat a valid future outcome as proof the original daily PV feature was valid.

Status:
FEATURE_VALIDITY_OUTCOME_ANCHOR_VALIDITY_SEPARATED.


# PVE-099 — Evidence Status immediately before the 9/29 Live Session

## Proven
- deployed V8.11 LOG_ONLY;
- feature flag enabled;
- decisionImpact=false;
- Formal isolation at enable;
- holiday skip/no fabrication;
- zero ordinary live candle calls added by PV helper.

## Code-proven v0.1 quality risks
- D1 direct QA unauthorized;
- Guard plumbing defects;
- range/trueRange issues;
- semantic fingerprint volatile sourceFetchedAt;
- Acceptance drift;
- persistence gap continuity;
- mixed top-level eventKey;
- daily outcome horizon/censoring semantics;
- baseline cache freshness skip defect;
- selection-day omission for newly selected plans.

## Not yet observed prospectively post-enable
- first real intraday snapshot on 9/29;
- first after-market bootstrap;
- first next-day baselineAsOfDate;
- actual plan overlap;
- at-rest duplicate/mutation counts.

## Decision
The evidence lane remains:
`DATA_QA_PARTIAL / FALSIFICATION-FIRST`.

No alpha inference is currently justified.

Status:
PRE_FIRST_SESSION_EVIDENCE_BASELINE_FROZEN.


# PVE-100 — Evidence Phase I Convergence before First Live Trading-Day Sample

## What PVE-001~100 has achieved
Before the first eligible post-enable trading day, the research has:
- verified deployment/activation;
- separated runtime acknowledgement from at-rest proof;
- documented D1 observability limits;
- frozen H001/H002 clean-row contracts;
- mapped H003/H004 higher-risk semantics;
- classified outcome censoring/duplication;
- identified persistence/eventKey issues;
- audited baseline count, per-field coverage, vintage and freshness;
- found the selection-day omission and stale-reentry baseline defects;
- preregistered first-session receipts and first report.

## What comes next
The next information gain must come from actual 9/29 and 9/30 receipts.

Priority:
1. observe, do not tune;
2. classify each row against frozen gates;
3. preserve failures;
4. do not repair v0.1 mid-sample unless a separate version/change is explicitly authorized.

## No interpretation drift
A result being inconvenient is not a reason to:
- loosen slotHistoryCount;
- redefine freshness;
- move thresholds;
- exclude a date post hoc;
- change H001/H002 outcome family.

Status:
PVE_PHASE_I_PRELIVE_CONVERGED / WAIT_ACTUAL_POST_ENABLE_TRADING_DATA.
# PVE-101 — Baseline Row Lifetime Is Unbounded Even Though Content Retention Is 80 Sessions

## Source audit
V8.11 freezes:
`PV_SHADOW_BASELINE_KEEP_SESSIONS = 80`.

Each baseline payload keeps only the most recent 80 session objects.

However:
- `v7_pv_intraday_baselines` has one row per symbol;
- no DELETE / expiry / TTL path exists in the V8.11 patch.

## Consequence
A symbol that was monitored once can retain its baseline row indefinitely.

Thus two different concepts must be separated:

### Content retention
At most 80 stored session objects.

### Row freshness / lifetime
Potentially unlimited until the symbol is updated again or the table is manually changed.

A months-old row can still report:
- validSessions=80;
- schemaVersion=PV_SHADOW_V0_1.

That does not make it recent.

## Re-entry risk
This materially strengthens PVE-082:
the early-return condition `validSessions>=20` can keep a stale row alive through long periods outside monitoring.

Status:
BASELINE_ROW_PERSISTENCE_UNBOUNDED / CONTENT_CAPPED_80.


# PVE-102 — Current-Day Self-Contamination Is Correctly Prevented

## Source audit
Within `recordPvIntradayShadowSafe`, the order is:

1. `pvBuildIntradaySnapshot`
2. `pvInsertSnapshotImmutable`
3. `pvFinalizeSameSessionOutcomes`
4. `pvRollObservedSession`

The baseline used to calculate the current snapshot is therefore read before the current observed session is rolled into the baseline.

## Consequence
At the 13:00-start bar:
- today's pvSlotRvol20 / cumulative pace are computed from prior baseline sessions;
- only after the snapshot is frozen is today's observable session added to the cache.

This avoids:
- current-session denominator leakage;
- self-normalization of the current observation.

## Evidence meaning
This is a positive no-look-ahead property of v0.1 and should be preserved in any future version.

Status:
CURRENT_SESSION_SELF_BASELINE_LEAKAGE_NOT_PRESENT.


# PVE-103 — Plan Overlap Is a Baseline-Roll Opportunity, Not Proof the Roll Happened

## Source audit
`recordPvIntradayShadowSafe` skips a result entirely when:
`!result.ok`
or it belongs to the excluded AIDEEN pool.

Only processed results can reach:
`pvRollObservedSession`.

## Consequence
A symbol may be present in:
- the day's monitored plan;
- the 9/29 intraday live symbol set;
yet still fail to roll its session if the result itself was not OK on the relevant 13:00 completion cycle.

## Therefore
PVE-092 overlap classification should be interpreted as:

### CONTINUING_MONITORED_PLAN
There was an **opportunity** for live T-session roll.

It is not:
`T_SESSION_ROLL_VERIFIED`.

## Stronger proof
Require one of:
- non-skipped bootstrap result with lastMarketDate=T;
- next-day snapshot baselineAsOfDate=T;
- authoritative baseline D1 receipt.

Status:
PLAN_OVERLAP_OPPORTUNITY_NOT_ROLL_PROOF.


# PVE-104 — A Partial Current Session Can Be Rolled into the Baseline

## Source audit
`pvExtractCompletedSession15` records:
`MISSING_REQUIRED_SESSION_SLOT`
when any expected slot before the latest bar is absent.

But `pvRollObservedSession` checks only:
`latest.slotKey === "13:00"`.

It does NOT inspect:
- session.coverageReasons;
- MISSING_REQUIRED_SESSION_SLOT;
- prefix completeness.

## Consequence
A session can:
- miss an intermediate 15m slot;
- still contain a 13:00 bar;
- be written as one baseline session;
- increment `validSessions`.

## Field impact
### Exact-slot volume
A later H001 slot can still use this session if the exact target slot exists.

### Cumulative pace
For any slot after the missing bar, `cumulativeValid=false`, so it should not contribute to cumulativeHistoryCount.

### Range
Range semantics remain vulnerable to PVE-030:
the normalized previous bar can span the missing interval.

## Key distinction
A session object being retained is not the same as:
“full session valid for every PV field.”

Status:
PARTIAL_SESSION_BASELINE_ROLL_CONFIRMED.


# PVE-105 — Baseline Field Windows Are Coupled to the Last 20 Exact-Slot Sessions

## Source audit
For target slot S:
1. baseline selects sessions containing slot S;
2. takes the latest 20 such rows;
3. volume count uses those 20;
4. range count filters those same 20;
5. cumulative count filters those same 20 for `cumulativeValid=true`.

It does NOT search farther back for additional range/cumulative-valid rows once the last 20 slot rows are chosen.

## Consequence
Example:
- latest 20 sessions all have the target slot;
- 3 of them have invalid cumulative prefix.

Then:
- slotHistoryCount=20;
- cumulativeHistoryCount=17;
- cumulative median unavailable.

Even if sessions 21~23 in the past had valid cumulative prefixes, they are not used to “top up” the cumulative sample.

## Interpretation
This is conservative for H002:
the cumulative comparison remains tied to the same recent slot-volume window rather than silently using an older, different 20-session support set.

## Trade-off
- positive: stronger recency/common-window consistency;
- negative: H002 readiness can drop sharply after a few partial sessions.

This is a design semantic, not automatically a bug.

Status:
FIELD_SUPPORT_WINDOW_COUPLED_TO_SLOT_WINDOW_FROZEN.


# PVE-106 — validSessions Counts Session Objects, Including Partial Ones

## Baseline write
`valid_sessions = sessions.length`.

No complete-session predicate is applied before this count.

Because PVE-104 partial sessions can be rolled or historically normalized:
`validSessions`
can include session objects that are unusable for some slots/prefixes/ranges.

## Evidence hierarchy reinforced
Never interpret:
`validSessions=80`
as:
- 80 valid 09:00 observations;
- 80 valid 13:00 cumulative prefixes;
- 80 full sessions.

Only field-specific counts support field readiness.

Status:
VALIDSESSIONS_IS_CONTAINER_COUNT_NOT_FIELD_COUNT.


# PVE-107 — Corporate-Action Reset Can Be Bypassed by the Bootstrap Early Return

## Source audit
`pvBootstrapSymbol` sequence:

1. read existing cache;
2. if schema matches and `validSessions>=20`, return skipped;
3. only if not skipped, merge using:
   `cache.corporateActionResetAt || plan.corporateActionResetAt || null`.

## Consequence
If:
- an old cache already has >=20 session objects;
- a newly selected plan carries a newer corporateActionResetAt;
then the bootstrap returns before applying the new plan reset marker.

Further, `pvBuildIntradaySnapshot` reads resetAt from the baseline cache itself.

Thus a new plan-level reset cannot protect the next intraday feature unless the cache was first refreshed/reset through another path.

## Current production relevance
The present project does not yet have fully trusted corporate-action reset plumbing into every plan, so this path may be dormant or sparsely populated.

But the early-return ordering is code-proven and would be unsafe once authoritative reset metadata is introduced.

## Governance
A future baseline refresh decision must evaluate:
- schema;
- freshness;
- reset-version compatibility;
before count-based skip.

Status:
BOOTSTRAP_EARLY_RETURN_CAN_BYPASS_NEW_RESET_METADATA.


# PVE-108 — Baseline QA Receipt Must Separate Five Independent Properties

A future authoritative receipt should never reduce baseline quality to one `ready` flag.

For each symbol/observation, report separately:

1. **ROW_EXISTS**
   - baseline row present?

2. **CONTENT_COUNT**
   - session-object count / retention count.

3. **FIELD_COVERAGE**
   - slotHistoryCount;
   - cumulativeHistoryCount;
   - rangeHistoryCount.

4. **FRESHNESS**
   - baselineAsOfDate vs latest expected comparable session.

5. **RESET_COMPATIBILITY**
   - baseline corporateActionResetAt / reset provenance matches the current plan/event state.

Optional sixth:
6. **CONTENT_IDENTITY**
   - baseline content fingerprint/vintage.

Only the specific field analysis decides which combination is required.

Status:
BASELINE_MULTIAXIS_QA_CONTRACT_FROZEN.
# PVE-109 — Current Read-Only QA Artifact Cannot Reconstruct Plan Overlap

## Source audit
The QA script fetches:
- /api/config
- /api/scan/status
- /api/cron/status
- /api/live

But the emitted JSON report does NOT persist:
- live.results symbol list;
- config.stocks symbol list;
- scan.stocks symbol list.

Instead it persists hashes such as:
- configFingerprint;
- scanFingerprintWithoutPv;
- liveFingerprintWithoutPv.

Hashes prove identity/stability only when compared to another known payload.
They cannot be inverted to recover the symbol set.

## Consequence
PVE-092 remains true at the API layer:
old-monitor vs new-plan overlap is reconstructable from the endpoints.

But:
the current sanitized QA artifact does not preserve enough information to calculate that overlap after the run.

Status:
OVERLAP_API_FEASIBLE / CURRENT_ARTIFACT_INSUFFICIENT.


# PVE-110 — New After-Market Plan Symbols Are Partially Recoverable from PV Bootstrap Results

## Existing artifact field
When after-market PV runs:
`scan.pvShadow.bootstrap.results`
contains per-symbol bootstrap receipts.

Therefore the new Formal plan symbol set is often indirectly visible as:
the symbols in bootstrap results.

## Limitations
- If PV is disabled, this path is absent.
- If the scan has zero Formal plans, results are empty by design.
- This does not reveal the prior intraday monitored symbol set.
- A bootstrap error still identifies the requested symbol, but not old-monitor overlap.

## Use
The artifact can answer:
“which next-plan symbols had a bootstrap opportunity?”

It cannot answer:
“which of them were already monitored intraday?”

Status:
NEW_PLAN_SYMBOLS_PARTIALLY_OBSERVABLE / OVERLAP_STILL_UNRESOLVED.


# PVE-111 — Current QA After-Market Assertion Can Overstate Baseline Readiness

## Current test
After 23:45, when PV is enabled, the QA script asserts:
`pvScan.bootstrap.ok === true`.

PVE-086 proved:
bootstrap.ok only means no per-symbol thrown error.

It does not require:
- validSessions>=20;
- lastMarketDate freshness;
- per-slot/prefix/range readiness.

When direct D1 is unavailable, the stronger baseline assertions are skipped.

## Consequence
A run can satisfy:
- bootstrap.ok=true
while every requested baseline is:
- insufficient;
- stale;
- selection-day-gap;
- skipped old cache.

Thus:
`after-market QA runtime pass`
must not be labeled:
`BASELINE_DATA_QA_PASS`.

## Correct terminology
Current artifact can establish:
`BOOTSTRAP_EXECUTION_ACKNOWLEDGED`.

Field readiness requires separate receipt.

Status:
QA_BOOTSTRAP_ASSERTION_TOO_WEAK_FOR_READINESS.


# PVE-112 — D1 Permission Failure Masks All At-Rest Assertions as Null, Not Failures

## Current script behavior
When D1 SELECT throws:
- d1ReadAvailable=false;
- D1_DIRECT_READ_NOT_AUTHORIZED added to qaFailures;
- baselines/snapshots/outcomes remain empty arrays.

The report then uses null for:
- totalRows;
- duplicateGroups;
- fingerprint mismatches;
- outcomeRows;
- nonzeroDecisionImpact;
- mutationConflictAtRest.

## Correct interpretation
null = NOT_OBSERVED.

It is not:
- zero duplicates;
- zero rows;
- zero mismatches.

## Reporting rule
Any dashboard/report must preserve the distinction:
- 0 = measured zero;
- null = unavailable;
- UNKNOWN = semantic classification not resolved.

Status:
NULL_IS_NOT_ZERO_FROZEN.


# PVE-113 — Artifact Can Inspect Non-Skipped lastMarketDate but Not Skipped-Cache Freshness

## Available
The afterMarket section preserves:
`pvScan.bootstrap`
including per-symbol results.

For non-skipped bootstrap:
result includes:
- validSessions;
- lastMarketDate.

This enables PVE-097 selection-day-gap diagnosis from the artifact.

## Unavailable
For skipped cache:
result omits lastMarketDate by implementation.

Therefore the artifact cannot distinguish:
- fresh 40-session cache;
- months-old 40-session cache.

## Evidence priority on 9/29 night
1. inspect every non-skipped result immediately;
2. classify selection-day gap via lastMarketDate;
3. classify skipped result as freshness UNKNOWN;
4. wait for next-day snapshot.baselineAsOfDate / D1 evidence for skipped symbols.

Status:
ARTIFACT_FRESHNESS_PARTIAL_NOT_COMPLETE.


# PVE-114 — Existing QA Artifact Is Good for Safety, Weak for Cohort Lineage

## Strong evidence in current artifact
- deployed version;
- PV flag;
- binding presence/type;
- active code fingerprint;
- Formal config/scan/live fingerprints;
- decisionImpact/formalCoreImpact;
- zeroPvPushes/zeroPvActions;
- PV bootstrap runtime receipts;
- daily PV runtime receipts;
- latest cron/runtime metadata.

## Weak/missing evidence
- old intraday symbol set;
- new scan stock list as explicit canonical array;
- plan-overlap class;
- per-row baseline freshness when skipped;
- D1 at-rest row quality under current token;
- exact cohort history provenance.

## Conclusion
Use current artifact primarily for:
`SAFETY_AND_RUNTIME_RECEIPT`.

Do not stretch it into:
`CLEAN_RESEARCH_COHORT_RECEIPT`.

Status:
QA_ARTIFACT_PURPOSE_BOUNDARY_FROZEN.
# PVE-115 — Fingerprint QA Becomes Windowed after 1000/2000 Rows

## Source audit
If direct D1 read is authorized, the QA script loads:
- latest 1000 PV snapshots;
- latest 2000 PV outcomes.

It recalculates semantic fingerprints only for those fetched rows.

## Full-table checks
Separately, the script uses aggregate SQL across the full snapshot table for:
- duplicate semantic identity groups;
- row counts by date/type;
- nonzero decisionImpact counts.

## Consequence
Once total history exceeds the fetch limits:

### Full-table conclusions remain possible
- duplicate row count;
- nonzero decisionImpact count;
- snapshot count summaries.

### Fingerprint conclusions become windowed
- snapshotFingerprintMismatches=0
means:
“no mismatch among the latest <=1000 fetched snapshots.”

- outcomeFingerprintMismatches=0
means:
“no mismatch among the latest <=2000 fetched outcomes.”

They no longer prove all-history integrity.

## Required report metadata
Future QA should include:
- fingerprintRowsChecked;
- totalSnapshotRows;
- fingerprintCoveragePct;
- outcomeRowsChecked;
- totalOutcomeRows / coverage where available.

Status:
FINGERPRINT_QA_WINDOWED_AT_SCALE.


# PVE-116 — guardCounts Is Also a Latest-1000 Distribution, Not a Full-History Distribution

## Source audit
`guardCounts` is accumulated by iterating the fetched `snapshots` array.

That array is:
`ORDER BY created_at DESC LIMIT 1000`.

## Consequence
Before 1000 rows:
guardCounts may represent the full snapshot population.

After 1000 rows:
it represents only the most recent window.

## Risk
A later report could mistakenly interpret:
“10% DATA_INSUFFICIENT”
as a full-history rate when it is actually a recent-window rate.

## Rule
Label:
`guardCountsWindowedLatestN`
or explicitly report the numerator/denominator/time span.

Status:
GUARD_DISTRIBUTION_WINDOW_MUST_BE_EXPLICIT.


# PVE-117 — Enable-Time Formal Isolation and Read-Only Formal Fingerprints Are Different Evidence

## Enable workflow — paired isolation evidence
The enable workflow captures before enabling:
- Worker source hash;
- Formal config fingerprint;
- Formal scan fingerprint;
- binding shape.

After enabling PV_SHADOW_ENABLED=true it re-reads them and asserts:
- Worker source unchanged;
- non-PV bindings unchanged;
- Formal config fingerprint unchanged;
- Formal scan fingerprint unchanged.

If an assertion fails after patching the flag:
the workflow attempts rollback.

Therefore the 2026-09-25 enable receipt provides genuine:
`ENABLE_TOGGLE_PAIRED_ISOLATION`
for the observed state at activation.

## Read-only QA — current-state evidence
The later QA script computes current:
- configFingerprint;
- scanFingerprintWithoutPv;
- liveFingerprintWithoutPv;
- decisionImpact/formalCoreImpact metadata.

But it does not:
- turn PV off;
- re-run Formal;
- compare the same market inputs OFF vs ON.

Therefore this is:
`CURRENT_FORMAL_STATE_FINGERPRINT`,
not a fresh paired counterfactual isolation test.

## Combined interpretation
Strong evidence currently consists of:
1. implementation regression fixtures OFF vs ON;
2. enable-time before/after state isolation;
3. runtime decisionImpact=false / post-Formal hook ordering.

Do not overstate each read-only QA run as a new OFF-vs-ON experiment.

Status:
FORMAL_ISOLATION_EVIDENCE_TYPES_SEPARATED.


# PVE-118 — Enable-Time Isolation Did Not Exercise a Live Market Monitor Cycle

## Enable workflow behavior
The workflow changes only the Worker binding and immediately re-reads:
- source;
- config;
- scan state.

It does not wait for / trigger a normal live market monitor cycle under both OFF and ON states.

## Therefore
Enable-time paired isolation proves:
the act of changing the flag did not mutate persisted Formal config/scan state.

It does not by itself prove:
a future market monitor calculation would be numerically identical OFF vs ON.

## That stronger claim is supported separately by
- deterministic regression/Formal-isolation tests;
- code ordering;
- prospective monitoring of Formal behavior.

## Evidence language
Use:
“activation state isolation passed”
not:
“every future Formal market calculation was empirically A/B-tested live.”

Status:
ENABLE_ISOLATION_SCOPE_FROZEN.


# PVE-119 — Current D1 Baseline Assertions Would Still Miss Staleness

## Source audit
If D1 becomes readable, current QA asserts for each baseline:
- schema_version == PV_SHADOW_V0_1;
- valid_sessions >= 20;
- last_market_date < taipeiDate.

## What this catches
- wrong schema;
- too few cached session objects;
- current/future-session leakage.

## What it does NOT catch
- lastMarketDate weeks/months too old;
- selection-day omission;
- partial session objects;
- per-slot/prefix/range insufficiency;
- corporate-action reset mismatch.

## Consequence
Fixing D1 permission alone will not make the current QA baseline test sufficient.

The QA logic itself needs the PVE-083/095/108 freshness and field-coverage semantics before it can claim:
`BASELINE_FIELD_READY`.

Status:
D1_ACCESS_NECESSARY_NOT_SUFFICIENT.


# PVE-120 — Future QA Must Label Full-Table, Windowed and Runtime Evidence Separately

## Three scopes

### FULL_TABLE
Examples:
- duplicate identity aggregate;
- decisionImpact aggregate;
- counts grouped by date/type.

### WINDOWED_AT_REST
Examples:
- latest 1000 snapshot fingerprints;
- latest 2000 outcome fingerprints;
- recent guard distributions.

### RUNTIME_RECEIPT
Examples:
- scan.pvShadow bootstrap/daily result;
- zeroPvActions/Pushes;
- live/cron admin state.

## Reporting contract
Every metric should carry:
- evidenceScope;
- rowsChecked / denominator;
- time window;
- source;
- read authorization state.

## Why
A single `qaPass` Boolean cannot truthfully summarize these heterogeneous scopes.

Recommended future summary:
- safetyStatus;
- runtimeStatus;
- atRestAggregateStatus;
- atRestFingerprintWindowStatus;
- baselineFieldReadinessStatus;
- cohortProvenanceStatus.

Status:
MULTISCOPE_QA_REPORTING_FROZEN.



# PVE-121 — baseline.readyCount Is a Coarse Session-Count Label, Not Field Readiness

## Source audit
The read-only QA report currently emits:
`readyCount = baselines.filter(valid_sessions >= 20).length`.

PVE-106/PVE-108/PVE-119 already proved that `validSessions` is only a retained session-object count. It does not prove:
- exact-slot history count;
- cumulative-prefix continuity;
- range-history continuity;
- baseline freshness;
- corporate-action reset compatibility.

## Consequence
The field name `readyCount` overstates what was measured.

For evidence interpretation, treat it as:
`sessionCountGe20Rows`
or:
`COARSE_CONTAINER_COUNT_GE20`.

It must never be used as `BASELINE_FIELD_READY`.

Status:
QA_READYCOUNT_LABEL_OVERSTATES_READINESS.


# PVE-122 — mutationConflictAtRest=0 Is Hard-Coded, Not an At-Rest Conflict Measurement

## Source audit
The QA report currently emits:
`mutationConflictAtRest: d1ReadAvailable ? 0 : null`.

No D1 query derives that zero.

The same report correctly notes that rejected conflicts are intentionally not persisted as rows and points to:
`scan.pvShadow.daily.details`
for mutation-conflict telemetry.

## Consequence
When D1 is readable, `mutationConflictAtRest=0` means only:
“no persisted row-level field is being used here to represent rejected conflicts.”

It does NOT prove:
- no daily mutation conflict occurred historically;
- no intraday retry conflict occurred;
- no volatile-provenance-only conflict occurred.

Runtime conflict telemetry and persisted-row integrity are separate evidence domains.

Status:
AT_REST_MUTATION_CONFLICT_ZERO_NOT_MEASURED.


# PVE-123 — outcomeRows Is a Latest-2000 Window Size, Not Total Persisted Outcome Count

## Source audit
The QA script fetches outcomes using:
`ORDER BY completed_at DESC LIMIT 2000`.

The report then emits:
`outcomeRows = outcomes.length`.

Unlike snapshot `totalRows`, there is no full-table aggregate count for outcomes.

## Consequence
`outcomeRows=2000` must be interpreted as:
`outcomeRowsCheckedWindow=2000`,
not:
“there are exactly 2000 persisted outcomes.”

A future full-table outcome denominator requires an independent aggregate query.

Status:
OUTCOME_ROW_COUNT_IS_WINDOWED_NOT_TOTAL.


# PVE-124 — qaPass Does Not Enumerate Hard-Assertion Failures

## Source audit
The script maintains a soft `qaFailures` array for conditions such as:
- PV_SHADOW_ENABLED not true;
- D1 read acquisition failure.

But many checks use hard `assert`, including:
- duplicate persisted rows;
- nonzero decisionImpact;
- fingerprint mismatch;
- baseline schema/count/date checks;
- after-market scan/runtime assertions.

The JSON report and `qaPass` are written only after those assertions.

## Consequence
If a hard assertion throws:
- the workflow step fails;
- report generation may never reach the final write;
- therefore no `qaPass=false` field is guaranteed to exist for that failure.

So:
`qaPass`
is not a complete failure taxonomy.

Interpretation must distinguish:
1. REPORT_GENERATED + qaPass=true;
2. REPORT_GENERATED + qaPass=false;
3. SCRIPT_ABORTED_BEFORE_REPORT / workflow failure.

Status:
QAPASS_IS_NOT_TOTAL_FAILURE_ENUMERATION.


# PVE-125 — Missing pvScan Can Be Rendered as False Formal-Impact Values

## Source audit
The report emits:
`decisionImpact: pvScan?.decisionImpact ?? false`
and:
`formalCoreImpact: pvScan?.formalCoreImpact ?? false`.

If `pvScan` is absent, both fields become `false`.

By contrast, zeroPvPushes/zeroPvActions preserve absence as `null`.

## Consequence
A missing PV after-market runtime receipt can look identical to an observed:
`decisionImpact=false / formalCoreImpact=false`
receipt.

The safe interpretation requires an explicit presence gate:
`pvRuntimeReceiptPresent = Boolean(pvScan)`.

Only when that is true may pvScan-level impact flags be treated as observed runtime evidence.

Status:
PVSCAN_ABSENCE_MUST_NOT_RENDER_AS_OBSERVED_PASS.


# PVE-126 — Zero Live Fugle Calls Collapse to null in the Sanitized Artifact

## Source audit
The report emits:
`latestLiveReported: live.fugleCallsThisRun || null`.

JavaScript logical-OR converts a legitimate numeric zero to `null`.

## Consequence
A measured:
`0 Fugle calls`
cannot be distinguished from:
“field absent/unavailable”
through this artifact field.

This matters especially for:
- skipped/non-trading runs;
- zero-opportunity diagnostics;
- call-budget evidence.

A future schema should preserve zero with nullish semantics:
`live.fugleCallsThisRun ?? null`.

Status:
ZERO_CALL_RECEIPT_COLLAPSES_TO_NULL.


# PVE-127 — D1 Error Classification Conflates Authorization, Schema and Query Failures

## Source audit
One broad `try/catch` wraps:
- table discovery;
- required-table assertions;
- all D1 SELECT queries.

Any thrown error enters the same catch, which sets:
- `d1ReadAvailable=false`;
- `D1_DIRECT_READ_NOT_AUTHORIZED`.

## Counterexample
The same label would be produced if:
- a required table were missing;
- a query failed for schema reasons;
- a response shape violated an assertion;
- authorization were actually denied.

## Consequence
Current evidence cannot infer:
`AUTHORIZATION_DENIED`
from that label alone without checking the captured error text.

Future evidence should classify at least:
- AUTHZ_DENIED;
- SCHEMA_MISSING;
- QUERY_FAILED;
- ASSERTION_FAILED;
- UNKNOWN_D1_READ_FAILURE.

Status:
D1_FAILURE_TAXONOMY_CURRENTLY_CONFLATED.


## Exact continuation after PVE-127
1. PVE-128: freeze a non-mutating D1 failure-classification contract using existing error text/status only.
2. PVE-129: define an always-emitted sanitized QA envelope so hard failures remain observable without weakening workflow failure behavior.
3. PVE-130: freeze exact evidence-field renames/metadata for coarse baseline counts, windowed outcome rows, runtime-receipt presence and mutation-conflict observability.
4. PVE-131: audit whether any existing read-only admin surface retains historical intraday PV mutation-conflict telemetry; do not infer absence from persisted rows.
5. PVE-132: produce the pre-9/29 QA interpretation matrix that separates measured zero, null/unobserved, UNKNOWN semantics and hard workflow failure.
6. No runtime, Formal, threshold, token, permission or deployment change.


# PVE-128 — Run 36144193465 Is Specifically AUTHZ_DENIED, Even Though the Generic Catch Is Broader

## Direct workflow evidence
The latest inspected `PV Shadow Class-A Read-Only QA` job for run:
`36144193465`
completed successfully as a workflow job and emitted a sanitized report.

The report records:
- `d1DirectReadAvailable=false`;
- `d1DirectReadError="D1 SELECT HTTP 403: The given account is not valid or is not authorized to access this service"`;
- `qaPass=false`;
- `qaFailures=["D1_DIRECT_READ_NOT_AUTHORIZED"]`.

## Interpretation
PVE-127 remains the general code-audit conclusion:
the broad catch can misclassify other D1 failures.

But for this specific run, the captured HTTP 403/error body independently supports:
`D1_FAILURE_CLASS=AUTHZ_DENIED`.

Do not generalize that causal classification to future runs without inspecting their underlying error evidence.

Status:
RUN_36144193465_D1_AUTHZ_DENIED_VERIFIED.


# PVE-129 — Future QA Needs an Always-Emitted Failure Envelope Without Weakening Hard-Fail Semantics

## Problem
PVE-124 showed that hard assertions can abort before the final JSON report is written.

That creates an observability gap precisely when a severe invariant fails.

## Frozen research-only design
A future QA schema should separate:
- `workflowConclusion`;
- `reportGenerated`;
- per-check `status` = PASS / FAIL / BLOCKED / UNKNOWN;
- `failureClass`;
- `failureMessageSanitized`;
- `evidenceScope`;
- `fatal`.

The script may still exit non-zero after writing the sanitized report.

Therefore:
- observability is preserved;
- workflow failure remains a failure;
- no assertion is softened into success.

Status:
ALWAYS_EMITTED_FAILURE_ENVELOPE_DESIGN_FROZEN.


# PVE-130 — QA Evidence Field-Scope Rename Contract Frozen

To prevent later alpha analysis from consuming misleading labels, the following semantic renames are frozen for future report versions:

| Current field | Evidence-safe meaning / replacement |
| --- | --- |
| baseline.readyCount | baseline.sessionContainerGe20Count |
| snapshots.outcomeRows | outcomes.rowsCheckedWindow |
| snapshots.snapshotFingerprintMismatches | snapshots.fingerprintMismatchesWindowed |
| snapshots.outcomeFingerprintMismatches | outcomes.fingerprintMismatchesWindowed |
| snapshots.guardCounts | snapshots.guardCountsWindowed |
| snapshots.mutationConflictAtRest | remove as measured count; report persistence observability separately |
| formalIsolation.decisionImpact | pvRuntimeReceipt.decisionImpact, only when receiptPresent=true |
| formalIsolation.formalCoreImpact | pvRuntimeReceipt.formalCoreImpact, only when receiptPresent=true |
| runtime.d1DirectReadAvailable | runtime.d1QueryPathAvailable plus failureClass |
| calls.latestLiveReported | preserve numeric/object zero; never logical-OR zero into null |

Required metadata:
- evidenceScope;
- rowsChecked;
- denominator if known;
- time/date window;
- source;
- authorization state;
- receiptPresent.

Status:
QA_FIELD_SCOPE_NAMING_CONTRACT_FROZEN.


# PVE-131 — Historical Intraday Mutation-Conflict Telemetry Is Not Recoverable from Current Read-Only Admin Surfaces

## Existing evidence
PVE-014 proved the persisted live/KV snapshot is written before the execution/PV recorder stage.

Current read-only surfaces provide:
- `/api/live`: live snapshot / LAST_MONITOR fallback;
- `/api/cron/status`: generic execution metadata;
- `/api/scan/status`: after-market scan receipt, including daily PV details when present.

The QA artifact's mutation telemetry pointer:
`scan.pvShadow.daily.details`
is therefore an after-market daily path.

## Consequence
Current read-only admin surfaces do not provide an authoritative historical series of:
- intraday PV snapshot save conflicts;
- retry classifications;
- volatile-provenance-only conflicts.

Persisted rejected rows cannot fill that gap because rejected conflicts are intentionally not stored as successful rows.

Therefore historical intraday mutation-conflict rate is:
`UNOBSERVABLE_WITH_CURRENT_ADMIN_SURFACES`.

No zero rate may be inferred.

Status:
INTRADAY_MUTATION_CONFLICT_HISTORY_UNOBSERVABLE.


# PVE-132 — D1-Blocked Runs Render Some Empty Containers as False Zeros

## Direct artifact evidence
In run 36144193465:
- `d1DirectReadAvailable=false`;
- underlying D1 error is HTTP 403 authorization denial.

Yet the report emits:
- `baseline.rowCount=0`;
- `baseline.readyCount=0`;
- `baseline.symbols=[]`;
- `snapshots.guardCounts={}`;
- `calls.recentCronRuns=[]`.

These values arise because the arrays were initialized empty before the D1 query attempt and are still serialized after the read is blocked.

## Consequence
For D1-dependent fields:
- `0`, `[]`, and `{}` are not necessarily observed zeros/empties;
- they can mean NOT_OBSERVED because the acquisition path failed.

Every D1-derived container/count must be gated by:
`d1QueryPathAvailable=true`.

Otherwise report:
`null` plus a failure class.

Status:
EMPTY_CONTAINER_IS_NOT_OBSERVED_ZERO.


# PVE-133 — Pre-9/29 Evidence-State Matrix Frozen

Before the first ordinary post-enable market session, evidence must use the following state semantics:

| State | Meaning | Example |
| --- | --- | --- |
| MEASURED_ZERO | Source was available and measured value is zero | holiday/skipped cron `fugle_calls=0` from an observed cron receipt |
| NOT_OBSERVED | Required source unavailable / field not acquired | D1 row counts under verified 403 |
| ABSENT_RECEIPT | Runtime domain did not emit that receipt | `afterMarket=null` / no pvScan receipt |
| UNKNOWN_SEMANTICS | Data exists but causal/quality interpretation unresolved | skipped-cache baseline freshness without lastMarketDate |
| BLOCKED | Known prerequisite prevents the check | D1 at-rest QA under current token |
| HARD_CHECK_FAILURE | QA invariant threw/failed | future assertion failure that must remain workflow-failing |
| VERIFIED_PASS | Check executed on the stated scope and passed | active source hook ordering / enable flag observation |
| VERIFIED_FAIL | Check executed on the stated scope and failed | explicit nonzero decisionImpact if ever observed |

Rules:
1. Never coerce NOT_OBSERVED or ABSENT_RECEIPT into zero/pass.
2. Never promote UNKNOWN_SEMANTICS to clean evidence.
3. Every count/distribution must carry its evidence scope.
4. Workflow success is not equivalent to research-readiness pass.
5. None of these states authorizes a Formal change.

Status:
PRE_FIRST_SESSION_EVIDENCE_STATE_MATRIX_FROZEN.


## Exact continuation after PVE-133
1. PVE-134: audit whether the current QA workflow/job conclusion can diverge from `qaPass` in both directions and freeze the state machine.
2. PVE-135: inspect the earlier artifact from the same run/rerun lineage and test whether report fields are stable across reruns without new market data.
3. PVE-136: define a deterministic artifact-to-artifact diff receipt for safety/runtime fields only.
4. PVE-137: separate environment drift, market-state drift and code drift in QA comparisons.
5. PVE-138: freeze what may be compared across non-trading reruns without accidentally treating time-dependent admin state as mutation.
6. No runtime/Formal/token/permission/deployment change.


# PVE-134 — Correction: PVE-126 Overstated the Current Zero-Collapse Defect

## Re-inspection
PVE-126 noted:
`latestLiveReported: live.fugleCallsThisRun || null`
and warned that a numeric zero would collapse to null.

The preserved artifacts show the current runtime shape is an object:
`{ quote: 0, candles: 0, total: 0, freePlanLimitPerMinute: 60 }`.

An object is truthy in JavaScript even when all contained counters are zero.

## Correction
Therefore the current deployed schema DOES preserve the observed all-zero call receipt.

The real issue is narrower:
if `fugleCallsThisRun` ever changes schema to a numeric `0`, logical-OR would collapse it to null.

PVE-126 is superseded for current-runtime interpretation by:
`CURRENT_OBJECT_ZERO_RECEIPT_PRESERVED / TYPE_DEPENDENT_FUTURE_RISK`.

Status:
PVE_126_CURRENT_DEFECT_CLAIM_CORRECTED.


# PVE-135 — Workflow Job Success and Research qaPass Are Independent Axes

## Observed evidence
For run 36144193465, the GitHub Actions job conclusion is:
`success`.

The emitted report simultaneously has:
- `qaPass=false`;
- `qaFailures=["D1_DIRECT_READ_NOT_AUTHORIZED"]`.

Therefore:
`WORKFLOW_SUCCESS != RESEARCH_QA_PASS`
is directly observed.

## Reverse direction
The reverse divergence is structurally possible:
the QA script could emit `qaPass=true`, then a later workflow/action step such as artifact upload or runner infrastructure could fail.

That reverse case is not claimed as observed here.

## State model
Track independently:
- workflow/job conclusion;
- reportGenerated;
- qaPass;
- check-level PASS/FAIL/BLOCKED/UNKNOWN.

Status:
WORKFLOW_AND_QA_STATE_AXES_SEPARATED.


# PVE-136 — Same Workflow Run Lineage Produced Different Runtime-State Artifacts

## Compared artifacts
Both artifacts belong to workflow run:
`36144193465`
and repository head:
`262dc359bcb125845d093dead5036108622083af`.

Older artifact:
- artifact id 10868777263;
- generated 2026-09-25T13:56:49.246Z;
- activeContentSha256 = `d10ff4c13f95abb5910f7f06b7b05e9846c469913ac5fd7c911a25966d2e018c`.

Newer artifact:
- artifact id 10893170584;
- generated 2026-09-25T23:55:40.623Z;
- activeContentSha256 = `757056c146f880c12428e3151065c1c040f39adfbd94c5dfd4bcc3ca5d607e81`.

Stable across both:
- runtime.version;
- PV enable/binding state;
- D1 403 authorization block;
- Formal config fingerprint;
- live fingerprint;
- qaPass=false / same D1 failure.

Changed:
- active Worker content hash;
- scanFingerprintWithoutPv;
- latest cron receipt;
- report date/time.

## Consequence
A workflow run id/head SHA does not uniquely identify the external deployed Worker/admin state observed by a rerun.

Artifact identity must include at least:
- artifact id;
- generatedAt;
- repository head SHA;
- activeContentSha256.

Status:
RERUN_ARTIFACT_RUNTIME_STATE_NOT_IMMUTABLE.


# PVE-137 — Runtime Version String Is Not Sufficient Code Identity

## Direct evidence
Across the two PVE-136 artifacts:
`runtime.version`
remained:
`8.11.0-pv-shadow-v0.1-log-only`.

But:
`activeContentSha256`
changed.

## Interpretation boundary
The artifacts prove source-content drift under the same reported version string.

They do NOT by themselves prove:
- which source lines changed;
- whether the change was PV-related;
- whether Formal semantics changed.

## Evidence rule
For reproducible research, pin both:
- human-readable runtime version;
- exact active content hash.

Version equality alone cannot establish executable-code equality.

Status:
VERSION_STRING_NOT_CODE_IDENTITY.


# PVE-138 — scanFingerprintWithoutPv Drift Is Not Self-Explaining Semantic Drift

## Source definition
The QA script hashes:
- scanDate;
- generatedAt;
- selectedCount;
- totalCapital;
- stocks;
- pipeline;
- config.

The two artifacts show:
- currentAfterMarketScanDate remained 2026-09-24;
- configFingerprint remained unchanged;
- scanFingerprintWithoutPv changed.

## Limitation
The sanitized artifact does not preserve the full Formal scan payload or sub-hashes.

Therefore the changed scan fingerprint cannot be decomposed after the fact into:
- volatile timestamp drift;
- plan/stock drift;
- pipeline drift;
- config-in-scan drift.

## Rule
Do not interpret a changed whole-scan fingerprint as a Formal semantic mutation without component evidence.

Future safe comparison should separate:
- scanSemanticFingerprint excluding volatile timestamps;
- scanTimingFingerprint;
- stock-plan fingerprint;
- pipeline fingerprint.

Status:
WHOLE_SCAN_FINGERPRINT_DRIFT_AMBIGUOUS.


# PVE-139 — Safe Cross-Rerun Comparison Matrix Frozen

For non-trading/pre-first-session reruns, compare fields by class:

| Field class | Cross-rerun use |
| --- | --- |
| artifact id / generatedAt | provenance identity; expected to differ |
| repository head SHA | workflow code provenance only |
| runtime.version | descriptive label; insufficient for code identity |
| activeContentSha256 | exact deployed source identity |
| PV binding enabled/type | deployment-setting evidence |
| D1 failure class/error | acquisition-path evidence |
| configFingerprint | Formal config-state identity |
| liveFingerprintWithoutPv | live-state identity only when the same live state is expected |
| scanFingerprintWithoutPv | whole-scan drift detector only; semantic cause unresolved |
| cron.latest | time-dependent operational receipt; expected to advance |
| afterMarketWindow | report-time context; not an invariant |
| qaPass | aggregate research state; must be interpreted with workflow conclusion and check-level causes |

## Pre-9/29 rule
A rerun that changes only expected dynamic fields is not a mutation event.

A changed activeContentSha256 is CODE_DRIFT and must be provenance-pinned.

A changed whole-scan fingerprint is SCAN_STATE_DRIFT_UNKNOWN until decomposed.

Status:
CROSS_RERUN_COMPARISON_MATRIX_FROZEN.


## Exact continuation after PVE-139
1. PVE-140: audit whether active Worker source drift can be mapped to an authorized deployment/commit lineage without changing runtime.
2. PVE-141: determine whether the two artifacts' scan drift can be reconstructed from existing repository/admin receipts; if not, preserve UNKNOWN.
3. PVE-142: define the minimum provenance tuple every post-enable PV observation/report must carry for reproducibility.
4. PVE-143: separate workflow source commit, deployed Worker source and research-document commit as three independent lineage axes.
5. PVE-144: freeze a no-hindsight provenance receipt template for 9/29 and 9/30.
6. Continue data-quality/falsification only; no alpha threshold tuning or Formal promotion.


# PVE-140 — QA activeContentSha256 Is a Raw content/v2 Response Hash, Not Canonical Worker Source Identity

## Repository proof
The QA workflow head for the preserved artifacts is:
`262dc359bcb125845d093dead5036108622083af`.

That commit is titled:
`ops: compare Worker source independent of binding metadata`.

It adds `extractWorkerSource(content)` to the PV enable workflow specifically to:
- detect multipart boundaries;
- isolate the JavaScript part containing `const VERSION =`;
- hash the extracted Worker source instead of the entire `content/v2` response.

However, the current `tests/pv_shadow_readonly_qa.mjs` still hashes:
`hash(activeContent)`
where `activeContent` is the raw response text from:
`GET /workers/scripts/fugle-test/content/v2`.

## External API evidence
Cloudflare documents `content/v2` as a binary Response surface, while Worker Versions expose:
- unique version id;
- sequential version number;
- `resources.script.etag`, explicitly documented as hashed script content.

Official references:
- https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/content/methods/get/
- https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/versions/
- https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/versions/methods/get/

## Consequence
The QA field currently named:
`activeContentSha256`
must be interpreted as:
`rawContentV2ResponseSha256`.

A change in that field does NOT by itself prove executable/source code drift.

PVE-137's earlier stronger statement is superseded to this extent.

Status:
RAW_CONTENT_RESPONSE_HASH_NOT_CANONICAL_SOURCE_IDENTITY.


# PVE-141 — Enable Evidence and QA Raw Hashes Are Not Comparable on the Same Semantic Basis

## Same repository head, different hash definitions
At head `262dc359...`:

### Enable workflow
Hashes:
`hash(extractWorkerSource(content))`.

Observed during enable:
- before = `1829cadb375d4fe1b2b7423f02a230ac75c8f8696f229be28c80a4d97f17dba0`;
- after = same value.

### Read-only QA
Hashes:
`hash(activeContent)`
over the raw response text.

Observed roughly one minute later:
- `d10ff4c13f95abb5910f7f06b7b05e9846c469913ac5fd7c911a25966d2e018c`.

A later rerun emitted:
- `757056c146f880c12428e3151065c1c040f39adfbd94c5dfd4bcc3ca5d607e81`.

## Correct interpretation
These values are not an apples-to-apples source-hash series.

The enable receipt still proves source isolation across the binding toggle using its extracted-source method.

The two QA raw hashes prove only raw response representation drift between observations.

They do not prove a Worker code deployment occurred between them.

Status:
ENABLE_SOURCE_HASH_VALID_WITHIN_METHOD / QA_RAW_HASH_CROSSRUN_CODE_DRIFT_UNPROVEN.


# PVE-142 — Cloudflare Version ID + Script etag Is the Preferred Executable Identity Tuple

## Official capability
Cloudflare Worker Versions provide:
- version `id`;
- version `number`;
- metadata timestamps/source;
- `resources.script.etag` documented as hashed script content.

The versions list returns latest first, and the version detail endpoint returns the script etag.

## Frozen provenance preference
For future PV evidence, executable identity should prefer:

1. deployed Worker version id;
2. Worker version number;
3. script etag;
4. runtime VERSION string as a descriptive label;
5. optional extracted-source hash as a secondary reproducibility check.

Raw `content/v2` response hash is not authoritative unless its representation is canonicalized first.

## Current limitation
The existing artifact does not preserve version id/number/script etag.

Therefore old artifacts cannot be retroactively upgraded to exact executable identity from their raw hash alone.

Status:
WORKER_VERSION_ETAG_PROVENANCE_CONTRACT_FROZEN.


# PVE-143 — Three Independent Lineage Axes Must Be Preserved

Every prospective evidence receipt must distinguish:

### A. Research-document lineage
- commit containing PRICE_VOLUME_EVIDENCE / checkpoint / ledger state.

### B. QA-code lineage
- GitHub workflow run id;
- workflow head SHA;
- artifact id;
- exact QA script/workflow version.

### C. Deployed-runtime lineage
- Cloudflare Worker version id/number;
- script etag;
- runtime VERSION label;
- binding/config state relevant to the observation.

These axes can advance independently.

A research commit after an observation does not change the observed runtime.
A workflow rerun at an old GitHub head can observe a newer external Worker.
A runtime VERSION string can remain unchanged across non-code settings/version operations.

Status:
THREE_AXIS_PROVENANCE_MODEL_FROZEN.


# PVE-144 — 9/29 and 9/30 No-Hindsight Provenance Receipt Frozen

Before inspecting any return/MFE/MAE outcome, each 9/29 or 9/30 observation/report must preserve, when available:

## Observation identity
- marketDate;
- symbol;
- observationType;
- observedAt/bar identity;
- featureKnownAt/sourceFetchedAt;
- schemaVersion.

## QA lineage
- workflow run id;
- artifact id;
- generatedAt;
- GitHub head SHA.

## Runtime lineage
- Worker version id/number;
- script etag;
- runtime VERSION label;
- PV_SHADOW_ENABLED state;
- PV runtime receipt presence.

## Data acquisition state
- D1 query-path availability;
- D1 failure class if blocked;
- evidence scope = FULL_TABLE / WINDOWED_AT_REST / RUNTIME_RECEIPT;
- rowsChecked/denominator where applicable.

## Baseline/cohort lineage
- plan old/new overlap class;
- baselineAsOfDate / lastMarketDate when observable;
- field-specific history counts;
- expected-symbol-session freshness state;
- corporate-action/reset compatibility;
- clean-cohort provenance state.

## Interpretation state
- MEASURED_ZERO / NOT_OBSERVED / ABSENT_RECEIPT / UNKNOWN_SEMANTICS / BLOCKED / VERIFIED_PASS / VERIFIED_FAIL.

No outcome field may be used to repair, redefine or waive these pre-outcome provenance gates.

Status:
NO_HINDSIGHT_FIRST_SESSION_PROVENANCE_RECEIPT_FROZEN.


## Exact continuation after PVE-144
1. PVE-145: audit whether the existing token/read-only paths can query Worker Versions/etag without any permission expansion or runtime mutation.
2. PVE-146: if readable, define a Class-A version/etag receipt; if blocked, preserve VERSION_IDENTITY_UNOBSERVED and do not request broader permissions automatically.
3. PVE-147: audit whether extracted-source hashing can be added to future QA as documentation/proposal without changing current runtime.
4. PVE-148: define a componentized scan fingerprint that separates generatedAt/timing from stocks/pipeline/config semantics.
5. PVE-149: freeze the exact 9/29 night comparison order so runtime safety is evaluated before baseline/cohort readiness and before outcomes.
6. Formal Core remains LOCKED; no production deployment or hypothesis promotion.


# PVE-145 — Worker Versions/etag Uses the Same Documented Read Permission Class, but Current Token Access Is Not Yet Execution-Verified

## Official permission comparison
Cloudflare documents both:
- `GET /accounts/{account_id}/workers/scripts/{script_name}/content/v2`;
- `GET /accounts/{account_id}/workers/scripts/{script_name}/versions/{version_id}`

as accepting at least one of:
- Workers Tail Read;
- Workers Scripts Write;
- Workers Scripts Read.

The existing QA token already succeeds on `content/v2`.

## What this supports
Without any requested permission expansion, version/etag retrieval is:
`ACCESS_EXPECTED_UNDER_DOCUMENTED_PERMISSION_CLASS`.

## What this does not prove
The current artifact has never executed the versions endpoint.
Therefore actual route/account/token behavior remains:
`NOT_EXECUTION_VERIFIED`.

No permission or token change is justified merely to close this observation gap.

Status:
VERSION_ETAG_ACCESS_EXPECTED_SAME_PERMISSION_CLASS / NOT_EXECUTION_VERIFIED.


# PVE-146 — Version/etag Read Receipt Semantics Frozen

If a future existing-token, read-only call is executed, the receipt should capture:

- endpoint;
- HTTP status;
- read-only method GET;
- version id;
- version number;
- version metadata.created_on / modified_on / source where available;
- `resources.script.etag`;
- `last_deployed_from` where available;
- capture timestamp;
- token-permission state = unchanged;
- runtime mutation count = zero.

Classification:
- 2xx + version id + etag -> `VERSION_IDENTITY_OBSERVED`;
- 401/403 -> `VERSION_IDENTITY_AUTHZ_BLOCKED`;
- 404 -> `VERSION_IDENTITY_NOT_FOUND_OR_ROUTE_SCOPE`;
- other transport/API error -> `VERSION_IDENTITY_QUERY_FAILED`;
- no call performed -> `VERSION_IDENTITY_UNOBSERVED`.

Do not map any blocked/unobserved class to code identity equality.

Status:
VERSION_ETAG_RECEIPT_CONTRACT_FROZEN.


# PVE-147 — Extracted-Source Hash Is a Valid Secondary QA Proposal, Not a Replacement for Version Identity

## Repository precedent
Commit `262dc359...` already implements `extractWorkerSource()` in the enable workflow and uses it for before/after source-isolation hashing.

That means the repo has a tested precedent for removing multipart response representation from the compared Worker source.

## Future QA proposal
A future read-only QA artifact may emit:
- `workerVersionId`;
- `workerVersionNumber`;
- `workerScriptEtag`;
- `extractedSourceSha256`;
- `rawContentResponseSha256` only for diagnostics.

Hierarchy:
1. version id + script etag = primary deployed identity;
2. extracted source hash = secondary content reproducibility;
3. raw response hash = transport/representation diagnostic only.

## Boundary
This is an observability/schema proposal.
No current QA/runtime/Worker code is changed in this research step.

Status:
EXTRACTED_SOURCE_HASH_SECONDARY_PROVENANCE_PROPOSAL_FROZEN.


# PVE-148 — Componentized Formal Scan Fingerprint Contract Frozen

The current whole-scan hash mixes timing and semantic state.
A future read-only report should retain separate fingerprints:

1. `scanTimingFingerprint`
   - scanDate;
   - generatedAt.

2. `scanSelectionFingerprint`
   - selectedCount;
   - ordered stock/plan projection.
   - preserve ranking order where ranking order itself is semantic.

3. `scanPipelineFingerprint`
   - pipeline only.

4. `scanEmbeddedConfigFingerprint`
   - scan.config only.

5. `scanCapitalFingerprint`
   - totalCapital and allocation-relevant scan summary only.

6. `scanCompositeFingerprint`
   - optional overall canonical hash over the five components.

Interpretation:
- timing-only drift != selection drift;
- pipeline-only drift != stock-plan drift;
- composite drift with unchanged components is impossible and becomes a QA defect;
- missing component payload -> UNKNOWN, not equality.

Status:
COMPONENTIZED_SCAN_FINGERPRINT_CONTRACT_FROZEN.


# PVE-149 — First Post-Enable Session Evaluation Order Frozen Before Outcomes

For 2026-09-29 night and 2026-09-30 intraday, evaluate in this order:

## Gate 0 — Provenance
Pin QA artifact/head + deployed Worker identity receipt.
If exact Worker version/etag is unobserved, preserve that limitation.

## Gate 1 — Safety / Formal isolation
Check:
- PV flag enabled;
- decisionImpact=false;
- formalCoreImpact=false;
- zero PV actions/pushes where runtime receipt exists;
- PV hook remains after Formal;
- no unauthorized runtime/config mutation.

Failure here stops research-readiness escalation.

## Gate 2 — Market/operation context
Classify:
- official trading session vs holiday;
- cron/scan execution versus legitimate skip;
- zero-plan semantics;
- runtime receipt presence.

## Gate 3 — Acquisition observability
Classify:
- D1 read available/blocked;
- FULL_TABLE / WINDOWED_AT_REST / RUNTIME_RECEIPT scope;
- measured zero versus not observed.

## Gate 4 — Baseline lineage/readiness
For each symbol:
- continuing/new/re-entered lineage;
- bootstrap result;
- baselineAsOfDate/lastMarketDate;
- field-specific history counts;
- expected-symbol-session freshness;
- reset compatibility.

## Gate 5 — Cohort provenance
Verify selection-time daily history and pool integrity.
The known 9/24-derived 9/29 intraday cohort remains DATA_QA-only unless independently rehabilitated by valid provenance evidence.

## Gate 6 — Feature QA
Only now assess H001/H002 field eligibility/common support.
H003/H004 remain under their stronger label/outcome gates.

## Gate 7 — Outcomes
Do not inspect outcome superiority, threshold choice or promotion until the preregistered evidence/maturity conditions are met.

Status:
FIRST_POST_ENABLE_EVALUATION_ORDER_PREREGISTERED.


## Exact continuation after PVE-149
1. PVE-150: audit the precise 2026-09-29 lineage transition from 9/24 plan -> 9/29 after-market selection -> 9/30 monitor, including holiday boundaries.
2. PVE-151: define clean/unclean/unknown cohort labels for each side of that transition.
3. PVE-152: freeze symbol-session freshness inputs needed to rehabilitate any cohort row.
4. PVE-153: audit whether pool displacement can be reconstructed read-only for the 3+3 quota.
5. PVE-154: freeze a pool-date integrity receipt so one stale candidate cannot silently contaminate QUALIFIED_NOT_SELECTED controls.
6. Do not inspect outcomes or tune thresholds; Formal Core remains LOCKED.


# PVE-150 — 2026-09-24 -> 09-29 -> 09-30 Cohort Transition Is Structurally Determined

## Trading-calendar boundary
The production calendar hard-codes:
- 2026-09-25 as a market holiday;
- 2026-09-28 as a market holiday.

The after-market scheduled path calls `runAfterMarketScan(...,{onlyIfMissing:true})`.
For a non-trading date it returns:
`SKIPPED / NOT_TRADING_DAY`
before producing a new selection.

Weekend schedules are not ordinary Mon-Fri scan runs.

## Plan persistence
Intraday monitoring loads the current plan through:
`loadStockConfig(env)`.

A successful after-market scan saves the newly selected plans via:
`saveStockConfig(..., "Phase 4.3 A/B Strategy Rebase After-market Scan", ...)`.

Therefore, absent an independent manual plan mutation:

### 2026-09-29 intraday
Uses the last successfully saved Formal plan from 2026-09-24.

This is the already-known stale-history cohort lineage.
Its PV intraday rows are:
`DATA_QA_ONLY / PRIMARY_COHORT_UNCLEAN`.

### 2026-09-29 after-market
A successful Formal scan can create/save the next plan.
Only after Formal plan/push persistence does PV:
- bootstrap baselines;
- record daily shadow.

### 2026-09-30 intraday
Uses the 2026-09-29 saved plan if the after-market scan succeeded.

This is the first session whose selection cohort can potentially be clean, but:
- selection-time symbol-session history still needs proof;
- new-symbol baseline may omit 9/29 under the previously identified T-1 bootstrap gap;
- re-entered/skipped cache freshness remains row-specific.

Status:
FIRST_POST_ENABLE_COHORT_TRANSITION_FROZEN.


# PVE-151 — Row-Level Cohort Lineage Labels Frozen

Use one of these labels before H001/H002 eligibility:

1. `INHERITED_KNOWN_STALE_SELECTION`
   - example: 9/29 intraday rows inherited from 9/24.
   - primary inference: excluded; DATA_QA only.

2. `CONTINUING_FROM_PRIOR_MONITOR`
   - symbol was monitored in the immediately prior valid session and remains selected.
   - still requires clean selection-history and baseline freshness proof.

3. `NEW_AFTER_MARKET_SELECTION`
   - newly enters after the latest successful scan.
   - baseline selection-day omission risk must be checked.

4. `REENTERED_WITH_EXISTING_CACHE`
   - not in prior monitor set, but baseline cache already exists.
   - freshness UNKNOWN until baseline age/reset checks pass.

5. `ZERO_PLAN_VALID`
   - no Formal plan exists by valid selection outcome.
   - zero PV opportunity is not recorder failure.

6. `UNKNOWN_LINEAGE`
   - old/new sets or timestamps cannot be reconstructed.

Final research eligibility is separate:
- CLEAN;
- UNCLEAN;
- UNKNOWN.

A lineage class alone never implies CLEAN.

Status:
COHORT_LINEAGE_AND_ELIGIBILITY_SEPARATED.


# PVE-152 — Symbol-Session Freshness Rehabilitation Inputs Frozen

A row previously blocked by market-session-only freshness can be rehabilitated only from point-in-time evidence of:

1. official exchange sessions for the relevant market/date range;
2. symbol market/listing identity at that time;
3. verified symbol-specific suspension/non-trading sessions;
4. observed daily-history session dates actually used by Formal;
5. latest expected comparable symbol session;
6. unexplained missing expected sessions;
7. corporate-action effective/reset dates relevant to price/history comparability;
8. history source/capture vintage or immutable digest where available.

Core equation:
`EXPECTED_SYMBOL_SESSIONS = OFFICIAL_EXCHANGE_SESSIONS - VERIFIED_SYMBOL_SUSPENSION_SESSIONS`.

Rules:
- verified suspension can explain an otherwise missing bar;
- unknown suspension provenance cannot;
- unexplained missing expected sessions => fail-closed UNKNOWN/UNCLEAN according to the affected computation;
- current corporate-action knowledge may not be backfilled as if known at selection time.

Status:
SYMBOL_SESSION_REHABILITATION_INPUTS_FROZEN.


# PVE-153 — Exact 3+3 Pool Displacement Is Not Reconstructable from the Current Scan Receipt

## What current code preserves
The scan diagnostics preserve:
- pool quotas;
- selected counts;
- unused slots;
- aggregate eligibility/exclusion counts;
- selected stocks;
- thousand-stock selected shortlist;
- a symbol/name EPS-review universe;
- some near-miss diagnostics.

## What exact displacement requires
To answer:
“if stale candidate X had been excluded, which candidate Y would have entered the 3-seat pool?”
we need the complete point-in-time ordered qualified list for that pool, including:
- rank tuple used by `rankFn`;
- pool membership;
- all candidates beyond the top-3 cutline;
- history-quality provenance for each candidate.

That complete ranked list is not persisted in the current scan receipt.

## Consequence
Exact counterfactual displacement for a historical pool-date is:
`NOT_RECONSTRUCTABLE_FROM_CURRENT_RECEIPT`
unless an independent immutable point-in-time candidate archive contains the full ranking inputs.

Re-running today's code/data against historical dates is not an acceptable substitute unless all point-in-time inputs are frozen and version-matched.

Status:
POOL_DISPLACEMENT_COUNTERFACTUAL_CURRENTLY_UNKNOWN.


# PVE-154 — Pool-Date Integrity Receipt Frozen

A future research receipt for each scan date and pool should preserve:

## Pool identity
- scanDate;
- pool = GENERAL / THOUSAND;
- quota;
- selection-rule/version identity.

## Complete qualified ordering
For every qualified candidate:
- symbol;
- pool membership basis / reference close;
- full frozen `rankFn` tuple **for the scan-date comparator version**;
- for deployed V7.5.30+ / current V8.14 lineage this is:
  - post-consensus priorityScore;
  - raw rewardPerRisk;
  - marketConsensusScore;
  - setupQuality;
  - sectorFlow;
  - relativeStrength;
- persist `rankComparatorVersion` (current: `PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30`) rather than assuming one tuple applies to every historical lineage;
- deterministic tie-break state;
- pool rank;
- selected boolean;
- cutline rank.

## Data-quality overlay
- selection-history quality;
- symbol-session freshness state;
- corporate-action/reset state;
- point-in-time source provenance.

## Counterfactual support
Research may later derive:
- first excluded clean candidate;
- selected stale candidate;
- potential displaced control.

But the receipt itself does not alter Formal ranking or selection.

## Integrity status
A pool-date is `CLEAN_POOL_SELECTION` only if:
- every selected candidate has clean selection provenance;
- no unknown/stale candidate occupies a quota seat;
- the full ordered qualified list needed for control construction is available.

Otherwise:
- `POOL_SELECTION_CONTAMINATED`; or
- `POOL_SELECTION_INTEGRITY_UNKNOWN`.

Status:
POOL_DATE_INTEGRITY_RECEIPT_FROZEN.


## Exact continuation after PVE-154
1. PVE-155: audit whether any existing candidate-shadow/archive table already contains the complete per-pool ordered qualified list required by PVE-154, without conflating it with PV Shadow.
2. PVE-156: if incomplete, freeze the minimum additive Class-A research schema for future pool-integrity evidence; do not implement yet.
3. PVE-157: define clean-control construction for SELECTED vs QUALIFIED_NOT_SELECTED without collider leakage or post-outcome filtering.
4. PVE-158: define date-level dependence/cluster handling when six selected rows share one market regime.
5. PVE-159: freeze the minimum clean-date count and event-count reporting needed before the first descriptive H001/H002 outcome table.
6. Formal Core remains LOCKED; no threshold/ranking/push change.

# PVE-155 — Existing Candidate Shadow Is a Bounded Cutline Archive, Not a Complete Pool-Integrity Receipt

## Source audit
Current build lineage defines `trade_research_shadow_candidates` in `scripts/apply_v8_7_2.py`.

The table stores:
- scan_date / symbol / cohort / cohort_rank / selected_flag / pool;
- snapshot_json;
- exclusion_reason;
- created_at / updated_at.

`buildShadowCandidateArchive()` preserves:
- all SELECTED rows;
- at most 6 QUALIFIED_NOT_SELECTED rows per GENERAL / THOUSAND pool;
- at most 6 NEAR_MISS rows per pool;
- at most 6 REJECTED_AFTER_BASE rows per pool;
- at most 6 BROAD_CONTROL rows per pool.

Therefore this archive is intentionally sampled around the decision boundary. It is not the complete qualified population required by PVE-154.

## Rank reproducibility audit
Formal `rankFn` is:
1. rewardPerRisk descending;
2. priorityScore descending;
3. setupQuality descending;
4. sectorFlow descending;
5. relativeStrength descending.

There is no explicit final symbol/id tie-break in the comparator.

The Candidate Shadow snapshot is insufficient to recompute that exact tuple:
- `rewardPerRisk` is raw in Formal ranking, but snapshot stores `rewardRisk` rounded to 2 decimals;
- `priorityScore` participates in Formal ranking but is not persisted by `buildResearchSnapshot()`;
- `setupQuality`, `sectorFlow`, and `relativeStrength` are retained, but not enough to reconstruct the missing tuple components;
- pre-sort source ordinal is not persisted, so an exact comparator tie cannot be reconstructed from the archive alone.

`cohort_rank` is also not an absolute pool rank:
- SELECTED rank is assigned after the two Formal pools are merged and globally sorted;
- QUALIFIED_NOT_SELECTED rows are first sliced per pool, then numbered across the concatenated GENERAL + THOUSAND sampled list.

## Bounded salvage
The archive is still useful.

Because QUALIFIED_NOT_SELECTED rows are sorted by the same Formal comparator before the per-pool top-6 slice, their within-pool order preserves a bounded view of the first six post-cutline candidates.

This can support a restricted statement such as:
- “candidate X was among the first archived rows immediately outside the pool cutline”;
- and, under no-rescoring / no-tie ambiguity, the first archived QNS row is a plausible one-seat displacement candidate.

It cannot prove:
- the complete qualified ordering;
- absolute pool rank for every archived row;
- complete candidate-set integrity;
- exact tie resolution;
- a clean historical 3+3 counterfactual.

## Mutability limitation
`persistShadowCandidateArchive()` deletes the existing scan_date rows before re-inserting/upserting the archive.

Therefore current rows are not an immutable first-known receipt.
A later rewrite of the same scan_date is structurally possible.

Historical use must preserve:
`CURRENT_ARCHIVE_STATE != IMMUTABLE_SELECTION_TIME_TRUTH`
unless independent commit/runtime/receipt provenance proves otherwise.

Status:
BOUNDED_CUTLINE_SALVAGE / COMPLETE_POOL_INTEGRITY_NOT_AVAILABLE.


# PVE-156 — Minimum Additive Class-A Pool-Integrity Schema Frozen

No implementation is authorized in this step.
The schema is research-only / additive / decisionImpact=false.

## Receipt level
A future immutable pool receipt needs:
- schemaVersion;
- scanDate;
- pool = GENERAL / THOUSAND;
- quota;
- selectionRuleVersion;
- Formal/Worker identity receipt;
- scan generatedAt / capturedAt;
- qualifiedCount;
- selectedCount;
- cutlineRank;
- rankComparatorVersion or source digest;
- receipt semantic fingerprint;
- source provenance state.

## Candidate level — every qualified candidate, no top-N truncation
For each pool-date candidate:
- symbol / name;
- referenceClose and pool-membership basis;
- preSortOrdinal;
- observedPoolRank;
- selectedFlag;
- selectionState = SELECTED / QUALIFIED_NOT_SELECTED;
- raw `rewardPerRisk` used by comparator;
- exact stored `priorityScore` used by comparator;
- raw `setupQuality` used by comparator;
- exact `sectorFlow` used by comparator;
- exact `relativeStrength` used by comparator;
- comparatorTieState;
- historyQuality;
- symbolSessionFreshnessState;
- corporateActionResetState;
- point-in-time source / knownAt provenance;
- candidate semantic fingerprint.

## Why both observedPoolRank and preSortOrdinal are required
The current comparator has no explicit last tie-break field.
Future research must reproduce what actually happened without changing Formal ranking semantics.
Persisting the observed rank plus pre-sort ordinal provides evidence for exact-tie lineage without inventing a new production tie-break.

## Immutability contract
Future Class-A research persistence should:
- insert once;
- verify semantic fingerprint on duplicate observation;
- never DELETE-and-rebuild a historical pool-date as the normal path;
- record conflicts separately;
- never include future outcome fields in the selection-time receipt.

Unknown provenance remains UNKNOWN; later knowledge is append-only annotation, not replacement of the selection-time record.

Status:
POOL_INTEGRITY_V0_1_SCHEMA_FROZEN / NOT_IMPLEMENTED.


# PVE-157 — Clean SELECTED vs QUALIFIED_NOT_SELECTED Control Construction Frozen

The objective is descriptive/falsification evidence, not a causal “selection treatment effect”.

## Sampling frame
For each clean pool-date:
- sampling frame = the complete point-in-time qualified list before outcomes;
- SELECTED = exact Formal selected rows;
- QUALIFIED_NOT_SELECTED = exact rows beyond the Formal cutline;
- pool and date must remain fixed.

No row may enter or leave the control set because of later:
- return;
- MFE / MAE;
- stop-first;
- BUY trigger;
- PV response / acceptance;
- outcome availability beyond ordinary maturity rules.

Conditioning on post-selection/common-effect variables can induce selection/collider bias; therefore control eligibility must be frozen from pre-outcome information only.

## Two preregistered control views
1. `ALL_QNS`
   - all clean qualified-not-selected rows in the same pool-date.

2. `CUTLINE_NEXT`
   - the exact next ranked row immediately outside the cutline.
   - if that row is UNCLEAN / UNKNOWN / tie-ambiguous, the boundary comparison for that pool-date is unavailable.
   - do not substitute rank+2 merely because it is cleaner or has a mature/better outcome.

## Additional guards
- no post-outcome nearest-neighbour matching;
- no replacement of missing outcomes with another control;
- no filtering by future PV feature quality to construct the control identity;
- H001/H002 common-support filtering occurs only after control identity is frozen and must be reported as coverage loss;
- exact cutline ties without a frozen ordering receipt => CUTLINE_TIE_UNKNOWN.

Method note:
collider/selection-bias literature shows that conditioning on a common effect can create non-causal associations; this motivates the pre-outcome-only eligibility rule.

Status:
CONTROL_CONSTRUCTION_PREREGISTERED / NO_OUTCOME_INSPECTION.


# PVE-158 — Date-Level Dependence and Cluster Handling Frozen

Rows from the same scan date share:
- market regime;
- index shock;
- liquidity environment;
- sector rotation;
- event calendar;
- Formal model/version state.

They are not treated as independent replications.

## Primary aggregation
1. compute row-level eligible outcomes/features;
2. compute pool-date summaries;
3. combine eligible pools into one scan-date summary with equal date weight;
4. aggregate across scan dates.

Primary sample size:
`N_PRIMARY = CLEAN_SCAN_DATES`

Secondary denominators must still report:
- clean pool-dates;
- eligible rows/events;
- unique symbols;
- recurrent-symbol count;
- mature outcomes.

A day with six selected stocks does not count as six independent market experiments.

## Inference boundary
The first H001/H002 table remains descriptive:
- no row-level naive t-test;
- no p-value-based promotion;
- no “significant” label from many rows concentrated in few dates.

If regression/inferential work is later justified, the default dependence unit is scanDate and cluster-aware uncertainty is required. Repeated symbols create a possible second dependence dimension, but multi-way inference is deferred until enough independent dates/clusters exist.

Method note:
Cameron & Miller (2015) document that within-cluster correlation can make default standard errors materially too small and that few clusters are a distinct inference problem. Abadie et al. (2017/2022) further frame clustering as a design question.

Status:
SCAN_DATE_CLUSTER_IS_PRIMARY / FIRST_TABLE_DESCRIPTIVE_ONLY.


# PVE-159 — Minimum Clean-Date and Event Accounting before First H001/H002 Descriptive Table

The existing research code already uses:
`pairedDates >= 20 ? DESCRIPTIVE_READY : ACCUMULATING`

To avoid inventing a new post-hoc threshold, retain 20 independent clean scan dates as the first descriptive-readiness floor.

## Readiness rule
`DESCRIPTIVE_READY` requires:
- >=20 CLEAN scan dates for the exact comparison;
- each included date passes the preregistered provenance/safety/acquisition/baseline/cohort gates;
- common-support rows are identical across compared A/B/C/D specifications for the metric being compared;
- each included selected-vs-control pool-date has at least one eligible selected row and one frozen eligible control where that contrast is reported;
- outcome maturity is field-specific and reported explicitly.

A large row count from fewer than 20 dates cannot substitute for 20 clean dates.

## Mandatory denominators
Every first table must show:
- raw snapshots;
- DATA_QA-eligible rows;
- hypothesis-clean rows;
- clean scan dates;
- clean pool-dates;
- unique symbols;
- mature outcome rows for each horizon/field;
- missing/blocked/unknown counts by reason;
- H001/H002 common-support retention.

## Frozen first comparison
Only after readiness:
A = Formal context
B = A + previous-5 volume ratio
C = B + same-slot RVOL
D = C + cumulative volume pace

Compare without threshold tuning:
- false-confirmation;
- MFE;
- MAE;
- opportunity retention.

20 clean dates permits the first descriptive table only.
It does not by itself promote H001/H002 to SUPPORTED or REJECTED.

Status:
FIRST_DESCRIPTIVE_FLOOR_FROZEN_20_CLEAN_DATES.


## Exact continuation after PVE-159
1. Stop additional pre-outcome methodology expansion unless a concrete contradiction is found.
2. Preserve PVE-155 bounded-salvage semantics: current Candidate Shadow is useful near the cutline but cannot certify full pool integrity.
3. Do not implement PVE-156 without the owner-approved research engineering path.
4. The next Price-Volume information hinge is the first post-enable ordinary market sequence:
   - 2026-09-29 intraday = DATA_QA-only inherited 9/24 cohort;
   - 2026-09-29 after-market = first new selection/bootstrap receipt;
   - 2026-09-30 intraday = first potentially clean selection cohort, subject to all gates.
5. On that hinge, execute the already-preregistered PVE-149 order before looking at outcomes.
6. H001~H004 remain evidence-gated; Formal Core remains LOCKED.



## PVE-155 comparator correction — 2026-09-27

The old PVE-155 RR-first comparator description reflected an earlier/base Worker lineage and is not the deployed V7.5.30+ ordering.

Current/deployed comparator:
`post-consensus priorityScore -> rewardPerRisk -> marketConsensusScore -> setupQuality -> sectorFlow -> relativeStrength`.

V8.13 prospectively freezes these fields and comparatorVersion.
Pre-V8.13 Shadow rows do not gain exact comparator replay merely because the current formula is known; missing PIT ranking provenance remains UNKNOWN.

Any QNS / CUTLINE_NEXT / pool-displacement study must join the comparator version that was valid on the selection date.


# PVE-174~180 — Pre-live implementation-semantics audit (2026-09-28)

## Code-proven findings

### Daily RVOL reset gap
Current `pvBuildDailyFeature(history,marketDate)` selects the last 20 earlier positive-volume daily rows with no corporate-action/reset input. The AFTER_MARKET snapshot writes `corporateActionResetAt:null`. Existing corporate-action test coverage applies to intraday `pvBaselineStats`, not the daily denominator.

Evidence classification:
- raw daily current volume: potentially factual if source/session is valid;
- `pvDailyRvol20`: QUARANTINED across unresolved structural volume-unit/corporate-action boundaries;
- missing reset provenance: UNKNOWN, never neutral.

### Price-censor contract gap
Current `pvPriceCensored` uses `previousClose*1.099/0.901`. Current TWSE rules use auction reference price at market opening plus legal tick/minimum-tick semantics, with no ordinary ±10% limit for qualifying newly listed common stocks during their first five trading days.

Evidence classification:
- `PRICE_CENSORED`: heuristic only in v0.1;
- raw slot OHLCV: not automatically invalidated by this label defect;
- boundary-dependent response/outcome interpretation: requires exchange-consistent overlay.

### Selected-plan Guard-input mismatch
Audited `allocateAndBuildPlans()` does not emit avgVolume20Lots, liquidityException, marketStructure, corporateActionResetAt or pvGapDominated, while the PV patch attempts to consume those fields from `result.plan`. Repository search finds no current producer assignment for pvGapDominated.

Observed coercion paths:
- missing avgVolume20Lots -> pvIlliquidityWarning=false;
- missing marketStructure -> not ESB;
- missing pvGapDominated -> false;
- missing plan corporateActionResetAt cannot seed a new baseline reset.

Therefore ABSENT_INPUT is distinct from VERIFIED_FALSE/NORMAL.

### Reference unresolved asymmetry
REFERENCE_PRICE_UNRESOLVED is emitted only for 09:00 when referenceClose is null. Later missing reference values cause pvPriceCensored to return false without the unresolved flag. Later-slot boundary interpretation with missing reference is UNKNOWN.

## Build-lineage resolution
Base `Worker.js` intentionally does not contain all patch-produced runtime code. Deployment and regression workflows apply the ordered V7/V8 patch chain, including `apply_v8_11_0.py`, before syntax/contract checks and deployment. Workflow assertions require the PV schema constant/tables in the built Worker. Base-file absence is therefore NOT a runtime-removal finding.

## Field-level eligibility overlay
- H001 raw slot RVOL: salvageable with bar/source/baseline/cohort/common-support quality even when unrelated Guard labels are untrusted.
- H002 cumulative pace: same plus prefix continuity and cumulative-history quality.
- H003 response/acceptance/Guard: higher-gated; affected Guard inputs must be PRESENT/verified or the state is descriptive/quarantined.
- H004 market path: factual paths may be stored, but hypothesis eligibility requires session/corporate-action/boundary/outcome overlays.
- daily RVOL: denominator continuity across structural volume-regime changes is mandatory.

## External mechanism prior
Lee & Swaminathan (2000) and Medhat & Schmeling (2022) provide evidence that volume/turnover interacts with momentum/reversal differently across horizons/states. These sources do not validate Taiwan PV alpha. They reinforce horizon/state stratification and prohibit importing a universal high-volume sign.

Status:
`RAW_VOLUME_FIELD_LEVEL_SALVAGE / DAILY_RVOL_CA_QUARANTINE / GUARD_INPUT_CONTRACT_INCOMPLETE / PRICE_BOUNDARY_GUARD_HEURISTIC / PROSPECTIVE_ALPHA_UNKNOWN / FORMAL_UNCHANGED`.


# PVE-181~186 — Acceptance event/anchor semantics audit (2026-09-29 pre-market)

## Code-proven new defects

### PRE_EVENT expiry can manufacture Acceptance events
`pvAdvanceAcceptance()` applies its 13:00 expiry transition even when the state never left B_PRE_EVENT / A_PRE_EVENT. Because eventKey creation follows any transition to a non-initial state, PRE_EVENT -> EXPIRED_AMBIGUOUS can create a PVACC key without an actual breakout/pullback trigger.

Research interpretation:
- raw acceptance event-key count is inflated by no-trigger session censoring;
- genuine active Acceptance lifecycle requires evidence in stateHistory that a pre-outcome trigger state was entered before expiry;
- PRE_EVENT-only expiry is `NO_TRIGGER_SESSION_CENSOR`, not failure/acceptance evidence.

### Acceptance is not Guard-paused
`pvAdvancePersistence()` receives `comparable: guard.pvInterpretability !== "INVALID"`.
`pvAdvanceAcceptance()` receives no Guard/comparable argument and executes unconditionally.

Therefore INVALID source/baseline/reference states can still advance Acceptance geometry if bar/plan fields happen to be present.

### Anchor eligibility is not Guard-gated
`anchorEligible` depends on the Acceptance transition/state only. It does not require a non-INVALID Guard. Same-session and later daily outcomes may consequently be stored for an anchor whose originating PV state is not hypothesis-clean.

This is permitted as factual path storage only under the frozen salvage principle:
`OUTCOME_EXISTS != FEATURE_ELIGIBLE != HYPOTHESIS_CLEAN`.

## First-session 9/29 QA overlay
Because 2026-09-29 intraday is already primary-inference excluded by inherited 9/24 selection lineage, no alpha conclusion is allowed. The first-session report must still count separately:
- RAW_SNAPSHOTS;
- GUARD_INVALID / GUARDED / VALID;
- RAW_ACCEPTANCE_TRANSITIONS;
- ACTIVE_ACCEPTANCE_LIFECYCLES;
- PRE_EVENT_ONLY_EXPIRIES;
- RAW_ANCHOR_ELIGIBLE;
- HYPOTHESIS_CLEAN_ANCHORS.

For primary H003/H004 on 9/29, HYPOTHESIS_CLEAN_ANCHORS remains zero regardless of future price outcomes.

## Event denominator contract
H003 maturity uses only `H003_HYPOTHESIS_CLEAN_EVENT_COUNT`, not raw acceptance keys. Activation is determined solely by timestamped pre-outcome stateHistory and contemporaneous quality evidence; future return/MFE/MAE cannot activate or remove an event.

Status:
`PHANTOM_ACCEPTANCE_EVENT_CONFIRMED / INVALID_GUARD_ACCEPTANCE_LEAK_CONFIRMED / ANCHOR_STORAGE_SEPARATED_FROM_INFERENCE / FORMAL_UNCHANGED`.


# PVE-187~193 — First live lineage receipt + QA coverage audit (2026-09-29 evening)

## Observed production receipt before the 23:35 after-market scan
A read-only production diagnostic from PR #258 regression observed at approximately 21:31 Asia/Taipei:
- runtime `8.14.0-sector-gate-provenance-shadow`;
- TEST_MODE=false;
- read-only admin preflight authorized;
- `/api/scan/status.scanDate = 2026-09-24`;
- selectedCount=2;
- saved/verified config updated from the 9/24 after-market run;
- no 9/29 after-market scan had yet occurred at the observation clock.

This converts the 9/29 inherited-plan lineage from code-derived expectation into live observed evidence. It does not prove 9/29 PV D1 row capture.

## Phase-aware interpretation
Before the 23:35 decision clock, prior scanDate is `EXPECTED_PRIOR_SCAN_STATE`, not stale-scan failure. A same-day after-market failure can be diagnosed only after the scheduled completion window with cron/scan receipts.

## Manual-QA coverage limitation
Both PV read-only QA workflows are manual `workflow_dispatch` only. A manually selected diagnostic can verify captured rows but cannot establish a complete prospective evidence stream. Manual artifacts are `DIAGNOSTIC_ONLY` for maturity coverage; expected-date/attempt provenance remains separately required.

## Acceptance QA observability implementation
PR #258 merged as `ea6f89115825ee0fb3c04cbbedfd61cd2105d679` after V8 Repair CI and V8 Regression Tests passed.
The isolated ephemeral read-only QA now exposes per-date counts for Guard validity, Acceptance transitions, active lifecycle rows/keys, PRE_EVENT-only expiries/phantom keys, raw anchors and INVALID anchors. Output is explicitly `QA_ONLY_NOT_HYPOTHESIS_CLEAN`.

No production Worker/Formal/Cron/push/capital/trading behavior changed.

## Legacy QA version drift
The legacy direct QA script still hard-asserts runtime `8.11.0-pv-shadow-v0.1-log-only` while production is independently observed at V8.14. A failure caused solely by this assertion is `QA_TOOL_VERSION_DRIFT`, not recorder/data failure.

## PVE-149 gate state at ~21:31 Taipei
- Gate 0 provenance: PARTIAL_PASS.
- Gate 1 safety/Formal isolation: PARTIAL_PASS.
- Gate 2 operation context: PASS_FOR_CURRENT_PHASE.
- Gate 3 row-level acquisition observability: NOT_OBSERVED.
- Gate 4 baseline readiness: NOT_YET_EVALUABLE before 23:35 bootstrap.
- Gate 5 cohort: 9/29 intraday UNCLEAN / inherited 9/24 plan confirmed.
- Gate 6 feature QA: DATA_QA_ONLY; row eligibility unobserved.
- Gate 7 outcomes: CLOSED.

Status:
`FIRST_LIVE_LINEAGE_RECEIPT_OBSERVED / MANUAL_QA_NOT_PROSPECTIVE_COVERAGE / ACCEPTANCE_QA_OBSERVABILITY_READY / AFTER_MARKET_HINGE_PENDING / FORMAL_UNCHANGED`.


# PVE-194~202 — 2026-09-29 after-market recovery lineage audit (2026-09-30 morning)

## Natural decision-time path
The scheduled 2026-09-29 23:35 AFTER_MARKET_SCAN is directly observed as SKIPPED with no error. The current cron receipt does not expose its exact skip reason. Therefore the later recovered scanDate=2026-09-29 must not be substituted for the missing ordinary decision-time receipt.

## Recovery sequence
At approximately 05:11~05:12 Taipei, official quality datasets were recovered/verified and a single guarded historical /api/scan attempt was made. It still returned skipped=true and selectedCount=0.

At approximately 05:18 Taipei, the staged recovery route then persisted a historical selection by recomputing:
`runAfterMarketScan(...,{dryRun:true})`
for marketDate 2026-09-29 and writing the verified preview.

Persisted Formal symbols:
- 2006;
- 4977.

This occurred after the intended 9/29 decision cutoff. It is therefore not a clean prospective selection receipt.

## PV bootstrap consequence
The ordinary V8.11 after-market PV bootstrap/daily hooks execute only in the ordinary non-dry-run post-Formal flow. The stage-selection route contains no invocation of:
- `bootstrapPvShadowBaselinesSafe()`;
- `recordPvDailyShadowSafe()`.

Therefore no ordinary 9/29 PV baseline bootstrap/daily receipt is established by staged recovery. A possible intraday baseline roll for continuing symbols is a separate path and remains row-level unobserved here.

## Cohort consequence
2026-09-30 is now:
`DATA_QA_ONLY / PRIMARY_H001_H004_UNCLEAN`.

The earlier “earliest potentially clean 9/30” statement was conditional on a successful ordinary 9/29 selection/bootstrap. Its prerequisite failed.

## Full overlap is not rehabilitation
Recovered 9/29 symbols are the same 2/2 names as the prior 9/24 Formal plan. Full name overlap does not prove equal ranking inputs, source vintages, decision clocks, baseline freshness or pool integrity.

## planDate invariant contradiction
Formal construction is code-proven to set:
`planDate=nextTradingDate(scanDate)`.

For scanDate 2026-09-29, the ordinary rule implies 2026-09-30. The staged-recovery production readback instead reported planDate=2026-09-29.

V8.14.1 changes only TDCC share reconciliation; it does not redefine planDate or the trading calendar. The root cause of the recovery receipt discrepancy remains unknown, so the finding is scoped to the recovery lineage and is not generalized into a production-wide bug.

For D02, this is sufficient to fail cohort-clock trust.

## Cross-room history-admission dependency
`research/br030_history_admission_dependency_20260930_v0_1.json` independently reports 1883/1883 unusable symbols for the 9/29 admission check:
- 1872 OFFICIAL_GAP_PROOF_UNAVAILABLE;
- 11 INSUFFICIENT_PRIOR_BARS;
with repeated gapDate 2026-07-10.

The repeated date is a legitimate BAVI whole-market typhoon closure not represented in the static planned-holiday map. This independently blocks clean selection provenance. It is not claimed as the exact cause of the natural 23:35 cron SKIPPED result.

## Frozen evidence classification
- 9/29 intraday: inherited 9/24 plan, DATA_QA-only.
- 9/29 ordinary after-market: no completed ordinary receipt.
- 9/29 staged selection: historical recovery recomputation after cutoff.
- 9/30 intraday: DATA_QA-only / primary H001~H004 excluded.
- first future clean cohort date: UNSPECIFIED until ordinary selection + ordinary PV bootstrap + PIT/history/cohort gates pass.
- outcomes: CLOSED.

Machine-readable receipt:
`research/d02_20260929_recovery_lineage_receipt_v0_1.json`.

Status:
`RECOVERY_LINEAGE_AUDITED / FIRST_CLEAN_DATE_INVALIDATED / ORDINARY_PV_BOOTSTRAP_NOT_PROVEN / PLAN_DATE_RECOVERY_INVARIANT_VIOLATION / OUTCOMES_CLOSED / FORMAL_UNCHANGED`.


# PVE-203~216 — pipeline readiness and cumulative-pace structural falsification (2026-10-02)

## 9/30 did not become a recovered clean cohort
The 2026-09-30 recovery workflow had official quality ready and verified the 2026-07-10 closure proof, but `/api/scan-preview` terminated with Cloudflare HTTP 503 / Error 1102 due Worker CPU or memory resource limits. The stage-selection step was never reached.

Therefore no 9/30 plan persistence or ordinary PV bootstrap can be inferred.

## 10/1 also did not produce a verified new cohort
The first late-evening recovery had all named quality families ready but its single recovery POST was not confirmed and returned 503. The workflow correctly refused blind retry.

A later sync failed during quality synchronization timeout.

At 00:00 the encrypted plan mirror workflow succeeded only because the existing mirror was already verified. Its business payload explicitly read scanDate=2026-09-29.

At 00:01 the health workflow itself returned skipped=true because it ran after midnight and was outside its verified trading-day/window. Its green job result is therefore not evidence for the prior trading day's scan.

The V8.15 C1 collector started later and returned:
`C1_GENERATION_NOT_FOUND`.

Combined state:
- no verified 9/30 selection;
- no verified 10/1 selection;
- latest explicit mirrored plan remains 9/29;
- clean D02 prospective date count remains zero.

## Local-volume primitive audit
Formal intraday `buildBar()` and PV `pvEnrichSessionBars()` both compute the same primitive:
current bar volume divided by the mean of the previous five completed bars.

Formal rounds the ratio to two decimals; PV retains the unrounded value.

Research consequence:
do not call these two separate factors.
H001 is specifically the incremental test of historical same-slot RVOL beyond this local five-bar primitive.

## Common-support timing
Because five prior bars are required, the local ratio is unavailable for:
09:00, 09:15, 09:30, 09:45 and 10:00.

The earliest full A/B/C/D common-support slot is 10:15.

## Exact first-slot H002 redundancy proof
At 09:00:
`cumulativeVolume = slotVolume`
for the current session and each cumulative-valid historical session.

Thus:
`median20(cumulativeVolume_09:00) = median20(slotVolume_09:00)`.

Therefore:
`pvCumvolPace20_09:00 = pvSlotRvol20_09:00`
exactly.

This is an algebraic identity, not a sample estimate.
The first slot is also `OPEN_AUCTION_MIXED`.

## Later-slot constructive non-equivalence
Using twenty identical historical sessions with 100 units in each of the first six slots gives 10:15 baseline cumulative volume=600.

Four current paths:
- [200,200,200,200,200,200] -> slot=2.00, cumulative=2.00, local5=1.00;
- [100,100,100,100,100,300] -> slot=3.00, cumulative=1.33, local5=3.00;
- [300,300,300,100,100,100] -> slot=1.00, cumulative=2.00, local5≈0.45;
- [100,100,100,300,100,300] -> slot=3.00, cumulative=1.67, local5≈2.14.

Thus cumulative pace can represent session-prefix participation not uniquely recoverable from the current slot alone.

## Missing-prefix asymmetry
`pvEnrichSessionBars()` freezes `prefixValid=false` after an earlier expected slot is missing.
Later current-slot RVOL may still be computable, while cumulative pace becomes invalid/null.

Therefore D common support is naturally narrower than C.
Missing D rows must not be recoded as neutral participation.

## Persistence redundancy burden
The existing persistence state already compresses sequential RVOL into shock/persistent/decay/reignition/normalization states.

Cumulative pace can still differ for paths that map to the same coarse state because it retains magnitude-weighted prefix information.
That establishes possible non-redundancy, not alpha.

H002 must therefore beat both:
- C: same-slot RVOL;
- the existing persistence state.

Status:
`PIPELINE_CLEAN_DATE_ZERO / FIRST_SLOT_H002_EXACT_REDUNDANCY / LATER_SLOT_NON_IDENTITY / COMMON_SUPPORT_FROM_10_15 / OUTCOMES_CLOSED / FORMAL_UNCHANGED`.


# 2026-10-02 pre-PVE-228 addendum — latent mechanism identifiability

## Why “爆量不漲” cannot be labeled distribution from OHLCV alone
The same final OHLCV can arise from different event paths:
- aggressive buyers repeatedly consume asks while passive sellers replenish;
- aggressive sellers repeatedly consume bids while passive buyers replenish;
- both sides trade aggressively with little net progress;
- event/rebalance flow raises activity without one stable directional mechanism.

Therefore volume + price response identify observed effort/result, not the hidden side-specific cause.

## Why classic volume indicators do not solve this
OBV, A/D, CMF, MFI and Volume Oscillator are deterministic transformations of price/volume variables.

If two latent event paths generate identical OHLCV, those indicators also generate identical values.

Thus:
- indicator divergence can be tested as a predictive transform;
- it cannot by itself prove accumulation/distribution motive;
- stacking several such transforms must pass redundancy tests against the underlying primitives.

## Current source/recorder split
Current execution-shadow-v2 records:
- spread;
- best bid/ask;
- top-five aggregate depth;
- static depth imbalance;
- provider average-price proxy;
- coarse market-state flags.

It does not persist the official Quote cumulative AtBid/AtAsk/transaction totals or actual lastTrade event.

Official Fugle documentation shows those fields exist upstream, and also provides per-trade and price-level inside/outside data.

Therefore the current limitation is a recorder/evidence-availability boundary, not source impossibility.

## Classified-volume coverage
Future interval pressure must not assume all volume has a side classification.

Freeze:
`classifiedVolumeCoverage = (deltaAtBid + deltaAtAsk) / deltaTradeVolume`.

Fugle explicitly documents that the opening first trade is excluded from inside/outside-volume classification because the opening call auction has different supply-demand semantics.

Consequently:
- opening pressure belongs to a separate auction regime;
- classified coverage may be <1 by design;
- missing/unclassified volume cannot be forced into buy/sell pressure.

## Identifiability ladder
OHLCV -> participation/response only.
OHLCV + cumulative AtBid/AtAsk -> coarse provider pressure.
+ sparse books -> static liquidity context.
+ dense trade/book events -> candidate replenishment/resiliency/OFI research.

Only the last stage can directly study dynamic absorption mechanics; even then causal motive is not guaranteed.

Status:
`D02_05_08_09_IDENTIFIABILITY_FROZEN / NO_MATURITY_UPLIFT / OUTCOMES_UNUSED / FORMAL_UNCHANGED`.


# 2026-10-02 pre-PVE-228 addendum — H003 representation incrementality control

Source audit proves pvResponseState and pvAcceptanceState are deterministic transforms of already-observed OHLCV, Formal geometry, localVolumeRatio, guard inputs and prior state/path. They may encode useful nonlinear/path representations, but they are not independent raw-source votes.

Future H003 must separate SOURCE NOVELTY, REPRESENTATION NOVELTY and PREDICTIVE INCREMENTALITY. Model D vs E alone is insufficient if E bundles deterministic transforms. On identical common support, test decomposed primitives before adding Response state, then decomposed Acceptance transition inputs/prior state before adding Acceptance state/path. Guard is an eligibility/stratification control first.

A state that loses value after its components/path controls are included is REPRESENTATION_REDUNDANT, not a new factor. A surviving state is at most REPRESENTATION_INCREMENTAL until source novelty is independently established.

Durable research note: `research/d02_h003_representation_incrementality_control_20261002.md`.

No outcomes inspected; no maturity uplift; PVE cursor remains 227; Formal unchanged.


# PVE-228~239 — 2026-10-02 after-market lineage + H20 breakout anti-double-count

## 10/02 did not create a clean generation
The 00:24 C1/C2 readiness artifact for scanDate 2026-10-02 reports:
- C1_GENERATION_NOT_FOUND;
- FORMAL_SCAN_NOT_CONFIRMED;
- formalScanDate=2026-09-29;
- formalPipelineComplete=false;
- institutionReady=true for 2026-10-02;
- qualityReady=true for 2026-10-02;
- missingQuality=[];
- eligibleForResearch=false;
- mayCountAsZeroPick=false.

Thus the date is missing evidence, not zero opportunity.

## Late fallback chronology
23:40 run:
QUARTER_EPS read-only source review returned HTTP 503 three times; recovery was not reached.

23:58 run:
institution and all named official-quality families became ready for 10/02.

00:01:
the old recovery script recomputed local “today” after midnight, switched its target to 10/03 and exited outside the same-day recovery window.

This directly explains why the fully-ready fallback failed to recover 10/02.
It does not independently prove the original Worker 23:35/23:55 failure mechanism.

## Green checks are field-specific evidence
The subsequent mirror succeeded with scanDate still 9/29.
The health job succeeded by skipping business action outside the verified window.

Neither success is evidence of a new Formal generation.

## Future repair is not historical repair
The owner-approved Class-B PR #318 freezes the intended market date across a delayed fallback and preserves one guarded business POST.
It was activated on 10/03 without backfilling 10/02.

Therefore:
10/02 stays research-ineligible forever for clean Prospective Shadow use.

## H20 shared breakout receipt
One breakout episode is one primitive event.

D01-05 = event identity / price structure.
D02-03 = volume transform on that event.
D04-07 = volatility-state interaction on that event.

Suggested shared key:
`H20_BREAKOUT:<marketDate>:<symbol>:<anchorBarStart>`.

Knowledge clock:
the event/volume state is usable no earlier than the completed anchor bar's barEnd plus a valid sourceFetchedAt/featureKnownAt overlay.

## D02 incremental test
A price-only baseline must exist first.

Then test:
A price only;
B + existing local five-bar volume ratio;
C + same-slot historical RVOL;
D + cumulative participation pace on valid common support.

Do not count C/D as another event occurrence.

Primary outcomes, only after clean maturity:
- field-valid false-break/follow-through;
- MFE;
- MAE;
- opportunity retention;
- cost/slippage effect.

## Falsification states
- normal-volume successful breakouts disprove universal “must have volume” necessity;
- high-volume failed breakouts disprove “high volume is sufficient”;
- extreme volume can reflect event shock/climax/crowding rather than confirmation;
- the useful question is residual discrimination beyond price geometry.

Status:
`PVE_239 / CLEAN_DATE_COUNT_ZERO / H20_ANTI_DOUBLE_COUNT_FROZEN / OUTCOMES_CLOSED / FORMAL_UNCHANGED`.


# Pre-PVE-240 — OBV exact redundancy and divergence PIT boundary (2026-10-03)

## Exact identity
On common eligible rows:

`normalizedOBVChangeN == signedVolumeBalanceN`.

Both are:
`Σ(sign(close change) * volume) / Σ(volume)`.

Therefore they are one observable, not two features.

Endpoint OBV slope is also only a scaled version of the same signed-volume numerator.

Generic OLS-vs-endpoint `obvSlope` semantics are not frozen, so the name is not promotion-grade provenance.

## Pivot divergence identity
Raw OBV is unnecessary for the primary divergence geometry.

Bearish:
higher price high + negative between-pivot signed volume.

Bullish:
lower price low + positive between-pivot signed volume.

A bounded interval representation:
`pivotSignedVolumeBalance = signedVolumeSum / totalVolume`
preserves the sign without arbitrary OBV starting level.

## PIT / repaint rule
Reuse D03/Pattern:
- consecutive;
- confirmed;
- same-type;
- same-scale pivots;
- availability at confirmation, not pivot date.

Confirmation lag is an economic cost.

## Current blocker
D02 daily volume continuity is still not clean across corporate-action/trading-unit boundaries.
A valid pivot clock does not make an invalid/mixed volume path PIT-clean.

Therefore:
D02-09 remains L2/40.

## Semantic separation
- D02-06 = contemporaneous effort/result.
- D02-07 = signed-volume comparator.
- D02-09 = relational divergence transform.
- D02-08 = hidden-mechanism interpretation, requiring independent microstructure evidence.

Do not count all four from one episode.

Status:
`OBV_DUPLICATE_PRUNED / DIVERGENCE_TYPED / D02_09_PIT_VOLUME_LINEAGE_BLOCKED / OUTCOMES_UNUSED / FORMAL_UNCHANGED`.

# Pre-PVE-240 addendum — Daily volume continuity semantics (2026-10-03)

This addendum consumes no PVE number. Evidence cursor remains PVE-239.

## Direct code evidence

Current daily builder:
- filters `volumeShares` through a strictly-positive helper;
- selects the last 20 surviving prior rows;
- does not bind those rows to the verified expected symbol-session set;
- does not receive a corporate-action/unit-continuity receipt.

Therefore a count of 20 can be numerically complete while semantically incomplete.

New falsification:
a valid zero-volume session, a verified suspension/non-session, and a missing expected source row are not the same state and must not collapse into one absence category.

## Fresh external source-contract evidence

Fugle Historical Candles documentation, revalidated 2026-10-03, states:
- regular-stock intraday candle volume is in lots;
- regular-stock daily/weekly/monthly historical candle volume is in shares.

This supports the daily `volumeShares` unit mapping but falsifies any unguarded absolute daily-vs-intraday volume equivalence.

Daily aggregate odd-lot inclusion is not explicitly established by the cited unit statement; exact daily/intraday odd-lot reconciliation remains UNKNOWN.

## Cross-lane corporate-action evidence

Existing Corporate Actions research proves:
- pure SUPPLY_CHANGE does not invalidate factual RAW_SHARE_VOLUME;
- UNIT_SCALE requires a share-unit continuity rule;
- these transformations must not be pooled.

D02 consequence:
- UNIT_SCALE => bridge-verified or reset-clean; otherwise magnitude path BLOCKED.
- SUPPLY_CHANGE => raw activity can remain factual, but participation-intensity comparability requires denominator normalization or a fully post-break baseline.

## Evidence classification

`DAILY_VOLUME_CONTINUITY_CONTRACT_FROZEN / CURRENT_DAILY_BUILDER_NOT_COMPLIANCE_PROVEN / OUTCOMES_UNUSED / FORMAL_UNCHANGED`.

D02-09 remains L2/40.
No clean prospective date is created.
No historical sample is promoted into H001/H002/H20 clean denominators.

# Pre-PVE-240 addendum — Daily continuity replay validation (2026-10-03)

No PVE number consumed.

Historical mechanics / code-semantic replay validates the frozen contract:
- SUPPLY_CHANGE raw-share validity and participation-normalization ambiguity are separable;
- UNIT_SCALE validity gate is independent of whether a downstream Boolean threshold flips;
- verified suspension pseudo-bars are excluded from expected symbol sessions;
- positive-only filtering can create denominator identity drift while preserving a misleading count of 20.

Important negative control:
8422 has a 10x UNIT_SCALE distortion but no frozen breakout Boolean flip. This falsifies any outcome-dependent data-validity rule.

Synthetic code-semantic counterexample:
latest-20 expected volumes `[0,100..118]` have median 108.5. If the zero is dropped and an older 10000 row is pulled in, the surviving 20-row median becomes 109.5 while the numeric history count still reads 20.

Classification:
`CONTRACT_REPLAY_PASS / OUTCOMES_UNUSED / RUNTIME_COMPLIANCE_UNPROVEN / PVE_239 / FORMAL_UNCHANGED`.

# Pre-PVE-240 addendum — D02-10 / D02-12 PIT readiness evidence (2026-10-04)

No PVE number consumed. Forward outcomes remain unused.

## D02-10
Evidence establishes a legal PIT join:
- prior eligible-session D03 trend parent;
- current completed-slot D02 participation parent;
- explicit max-known-at clock;
- producer/consumer ownership and fail-closed missing-parent semantics.

Negative controls prohibit:
- same-bar price-response circularity;
- treating uptrend+high-volume as universally bullish;
- treating downtrend+high-volume as universally bearish;
- duplicate trend + volume + interaction event votes.

Classification:
`D02_10_L3_PIT_FEASIBLE / ALPHA_UNKNOWN / FORMAL_UNCHANGED`.

## D02-12
Evidence establishes two distinct data families.

TIME_OF_DAY_VOLUME_CURVE:
- current + historical 15m Taiwan data;
- same-slot/cumulative normalization;
- completed-bar PIT clock;
- bounded current-monitor coverage only through 13:00.

PRICE_BY_VOLUME_PROFILE:
- current-day prospective price-level volume source exists;
- bid/ask classification coverage is explicitly incomplete at the opening by provider design;
- no historical profile backfill is claimed.

Negative controls prohibit:
- interpreting ordinary midday seasonality as universal dry-up;
- treating open/close concentration as directional proof;
- claiming full-day curve completeness from the current 13:00 monitor ceiling;
- assigning unclassified volume to buy/sell pressure.

Classification:
`D02_12_L3_PIT_FEASIBLE / ALPHA_UNKNOWN / FULL_CLOSE_AND_HISTORICAL_PROFILE_NOT_PROVEN / FORMAL_UNCHANGED`.

D02 aggregate becomes 51.7% if and only if tracker/router canonical readback confirms both promotions.

# Pre-PVE-240 addendum — four-module L3 PIT-readiness closure (2026-10-04)

No PVE number consumed.
No forward outcomes inspected.

## D02-05
`EXTREME_PARTICIPATION_STATE` is PIT-observable from completed-slot RVOL plus response/Guard context.
The distribution-motive label remains UNKNOWN.
Classification:
`D02_05_L3_PIT_FEASIBLE / LATENT_DIRECTION_UNIDENTIFIED / ALPHA_UNKNOWN`.

## D02-11
Long-horizon capacity fields and current quote/depth context have legal PIT clocks.
Exact Formal exception coverage remains partly UNKNOWN and cannot be inferred from the defective PV illiquidity helper.
Classification:
`D02_11_L3_PIT_FEASIBLE / FORMAL_THRESHOLD_OPTIMALITY_UNKNOWN / REJECTED_CONTROL_OUTCOMES_PENDING`.

## Executable daily-volume continuity validation

Artifacts:
- research/d02_daily_volume_continuity_adapter_v0_1.mjs
- tests/test_d02_daily_volume_continuity_adapter_v0_1.mjs

Final independent Node result:
14/14 PASS.

The first run failed because a late-known corporate-action event was still being applied to the historical path.
After correction, future-known event semantics are not applied retrospectively.

This supplies executable fail-closed replay for:
- UNIT_SCALE 3593-like mechanics;
- UNIT_SCALE 8422-like negative-control mechanics;
- SUPPLY_CHANGE 8454-like raw-vs-participation semantics;
- 5314-like suspension pseudo-bar;
- zero-vs-missing expected sessions;
- duplicates;
- deterministic session-set identity;
- signed-volume algebra;
- clean/blocked pivot-volume eligibility.

Classification:
`D02_07_D02_09_L3_CONTINUITY_REPLAY_PASS / ALPHA_UNKNOWN / PRODUCTION_WIRING_NOT_REQUIRED_FOR_L3 / FORMAL_UNCHANGED`.

D02-08 remains L2 because the independent microstructure evidence family is not completeness-proven.

# Pre-PVE-240 addendum — D02-08 provider-pressure L3 and L4 ceiling (2026-10-04)

No PVE number consumed.

## D02-08 executable evidence

Research-only adapter:
`research/d02_provider_trade_pressure_proxy_v0_1.mjs`

Test:
`tests/test_d02_provider_trade_pressure_proxy_v0_1.mjs`

Independent Node.js v22.16.0 result:
14/14 PASS.

The adapter validates:
- same identity;
- independent provider/fetch clocks;
- cumulative counter monotonicity;
- classified <= total volume;
- explicit unclassified coverage;
- no round/odd-lot mixing;
- trial-state blocking;
- no-classified-volume UNKNOWN;
- optional preregistered coverage floor;
- pressure-response observation without intent inference.

Classification:
`D02_08_L3_PIT_FEASIBLE / PROVIDER_PRESSURE_PROXY_ONLY / INTENT_UNIDENTIFIED / ALPHA_UNKNOWN`.

## L4 audit

Repository-wide D02 outcome readiness still reports:
- CLEAN_DATE_ZERO;
- Gate 7 CLOSED;
- PVE-240 pending;
- no Formal optimization candidate.

H20 explicitly lacks clean prospective residual outcomes.
Signed-volume/OBV outcomes remain untested.
Divergence outcomes remain untested.
Liquidity counterfactual coverage remains incomplete.
Volume-profile efficacy remains prospective-only/unobserved.

Classification:
`D02_ALL_MODULES_AT_LEAST_L3 / NO_L4_PROMOTION / PROSPECTIVE_OR_OOS_EVIDENCE_REQUIRED`.

Target aggregate after canonical sync:
60.0%.

# Pre-PVE-240 addendum — executable Wave-1 L4 admission gate (2026-10-04)

No PVE number consumed.
No predictive return outcome inspected.

Executable validator result:
19/19 PASS.

Key boundary now machine-enforced:
- DESCRIPTIVE_ONLY at >=20 CLEAN scan dates;
- L4_EVIDENCE_ELIGIBLE only at >=30 CLEAN scan dates AND >=100 completed eligible events.

Independent-date protection:
same-day multi-symbol observations count as one scanDate.

Outcome protection:
- H003 outcome must begin strictly after feature firstKnownAt / completed feature bar;
- CENSORED / UNKNOWN is never a completed event;
- duplicate event identity is a fatal-integrity condition.

Hypothesis-specific protections:
- H001 slot <10:15 is ineligible;
- H20 primitive D01 event identity mismatch is ineligible;
- common-support mismatch is ineligible.

No maturity promotion is authorized by this evaluator.
Current D02 evidence remains prospective-data blocked, not design blocked.

# Pre-PVE-240 addendum — Wave-1 isolation correction + Wave-2 admission (2026-10-04)

No PVE number consumed.
No economic outcome inspected.

Wave-1 correction:
- 23/23 tests PASS;
- hypothesis-specific evidence accounting;
- H001 evidence cannot promote H20/H003 eligibility;
- 99 H20 events + 1 H001 event remains 99 H20 events;
- review receipts are hypothesis-specific.

Wave-2:
- 32/32 tests PASS;
- D02-04/05/07/08/09/10/11/12 structural admission is machine-checkable;
- maturityPromotionAuthorized=false;
- l4SampleAdequacyAuthorized=false;
- formalCoreChangeAuthorized=false.

D02-11 receives a specific dataset-level blocker:
without both ADMITTED and reason-stratified LIQUIDITY_REJECTED_CONTROL observations, its source-admission lane remains blocked.

D02-09 and D02-12 preserve separate typed subfamilies rather than collapsing them into one generic flag.

No L4 promotion occurs from this engineering/research stage.

# Pre-PVE-240 addendum — D02-01 semantic admission + 12/12 L4 admission coverage (2026-10-04)

No PVE number consumed.
No economic outcome inspected.

D02-01:
18/18 executable semantic-governance tests PASS.

The research object is prospective classification integrity, not alpha.
A valid future receipt may show whether frozen semantic governance changes eligibility/classification relative to an ungoverned frozen counterfactual.
It may not be translated into a return claim.

With this artifact:
all 12 D02 modules now have executable next-level evidence-admission rules.

This does not create:
- one clean prospective date;
- one L4 module;
- one Formal optimization candidate.

PVE remains 239.
Gate 7 remains CLOSED.

# Pre-PVE-240 addendum — D02 consumes D16 validation receipts, not self-made sample thresholds (2026-10-04)

No PVE number consumed.
No economic outcome inspected.

24/24 executable guard tests PASS.

New rule:
D02 may define feature semantics and evidence admission, but promotion-grade statistical adequacy must be returned by D16.

The D16 receipt must bind:
- exact D02 evidence key;
- exact admission / experiment / outcome versions;
- common support;
- independent scan dates and symbols;
- date dependence method;
- small-cluster treatment;
- overlap/purge control;
- coverage/missingness;
- preregistered MDE / precision / semantic-materiality target;
- sample adequacy;
- effective sample;
- multiple-testing review;
- concentration review;
- cost/liquidity review for positive economic candidates.

Cross-module receipt reuse is fatal integrity.

No D02 L4 maturity change occurs from this interface alone.

# Pre-PVE-240 addendum — effect-target preregistration loophole closed (2026-10-04)

No PVE number consumed.
No economic outcome inspected.

Audit result:
the prior D16 consumer guard did not bind a numerical effect/precision target strongly enough.

Correction:
- historical V0.1 restored and replayable, 24/24 PASS;
- V0.2 created separately, 39/39 PASS;
- fixture target values explicitly declared non-research;
- complete target ID/version/hash binding now mandatory.

A promotion-grade target must freeze:
metric + unit + direction + numerical criterion + comparator + horizon + cost treatment + freeze clock + hash.

Current repository truth:
no formal numerical D02 target is yet frozen.

Therefore:
14/14 D02 evidence keys = TARGET_VALUE_PENDING_FREEZE.

This blocks promotion-grade outcome interpretation, not PIT/admission capture.

D02 remains 60.0%.
Gate 7 remains CLOSED.

# Pre-PVE-240 addendum — target derivation and freeze-precondition closure (2026-10-05)

No PVE number consumed.
No prospective economic outcome inspected.

New machine guard:
D02_L4_TARGET_FREEZE_PRECONDITION_V0_1.
Independent execution: 24/24 PASS.

It prevents target freeze from:
- current prospective results;
- post-outcome metric/horizon winner selection;
- fixture values;
- unjustified generic benchmarks;
- UNKNOWN costs converted to zero;
- cross-key borrowing.

Target registry V0.2 now carries derivation readiness and partial shell state for all 14 evidence keys.

Numerical target state:
0 FROZEN / 14 PENDING.

Wave-1 outcome-family state is narrower than before:
- H001 structural failure/no-follow-through;
- H20 breakout structural failure/no-follow-through;
- H003 structural acceptance/failure.

PV-084 effect-size family and PV-086 utility trade-off remain authoritative reporting constraints.

No canonical B1/B2/B4 primary horizon exists.
Post-outcome horizon selection is forbidden.

No L4 promotion occurs.

# Pre-PVE-240 addendum — Wave-1 metric/horizon and D16 method selection frozen (2026-10-05)

No PVE number consumed.
No prospective economic outcome inspected.

Executable evidence:
- D02_WAVE1_METRIC_HORIZON_GUARD_V0_1 = 23/23 PASS;
- D02_D16_WAVE1_METHOD_GUARD_V0_1 = 21/21 PASS.

Frozen primary statistical metric:
DATE_BALANCED_BRIER_LOSS_IMPROVEMENT.

Frozen primary horizons:
- H001 = B2;
- H20 = B2;
- H003 = active Acceptance lifecycle to first terminal success/failure or 13:00 censor.

Non-rescue rule:
- H001/H20 B1/B4 are sensitivities only;
- H003 B horizons are diagnostics only.

D16-19 method receipt is now a mandatory pre-outcome dependency.
Actual frozen Wave-1 method receipts: 0/3.

No numerical target is frozen.
Target registry remains 14/14 pending because no justified numerical Brier MDE/precision target or D02-01 semantic tolerance exists, and D14 universal after-cost evidence remains incomplete.

This is validation-design closure, not L4 evidence.


# PVE-240 — Historical minute-bar provenance and participation-intent firewall (2026-10-05)

Status: PIT_PROVENANCE_EVIDENCE / OUTCOME_BLIND / NO_PROMOTION / SDA_001_SDA_003_ALIGNED.

Purpose:
Establish whether future D02 prospective receipts can bind historical minute-bar availability, timestamp, volume-unit and participation-proxy semantics without inspecting promotion-grade economic outcomes.

Authoritative/source evidence reviewed:
- Fugle MarketData historical candles documentation: https://developer.fugle.tw/docs/data/http-api/historical/candles/
- Fugle MarketData intraday volumes documentation: https://developer.fugle.tw/docs/data/http-api/intraday/volumes/
- TWSE OpenAPI catalogue: https://openapi.twse.com.tw/
- TWSE historical information service description: https://eshop.twse.com.tw/en/category/main/41
- TWSE ex-right/ex-dividend reference data: https://www.twse.com.tw/en/announcement/ex-right/twt49u.html

Durable findings:
1. Fugle historical minute bars are documented from 2023-05-23 onward; minute timestamps are ISO-8601 with +08:00 timezone. Historical data are documented as updated by 16:30 after each trading day.
2. Volume unit is timeframe-dependent: regular-lot minute bars use lots, while regular-lot daily/weekly/monthly bars use shares. Any D02 join across minute and daily data must normalize units explicitly before RVOL/participation computation.
3. adjusted=true applies only to daily/weekly/monthly bars. Minute-bar prospective evidence therefore must not silently inherit adjusted-price semantics from daily controls.
4. Fugle intraday volumeAtBid/volumeAtAsk excludes the opening auction's first matched trade by design; therefore bid/ask-side cumulative volume is not a complete-volume identity and cannot be interpreted as true investor motive or true OFI.
5. TWSE exposes official daily trading and corporate-action/reference-price data, while richer historical intraday quote/trade/order-book products are separately described by TWSE Data E-Shop. Source tier and field provenance must therefore remain explicit; public daily authority does not retroactively prove every minute-field primitive.
6. Ex-right/ex-dividend reference prices are mechanically adjusted by TWSE rules. Price-response controls crossing corporate-action dates must bind a corporate-action flag/reference-price provenance rather than treating the mechanical gap as ordinary price discovery.

SDA-001 control:
- PRICE_OHLC-derived breakout/return/response transforms remain one price-information root.
- PVE-240 authorizes provenance capture only; it does not create an independent price vote.
- Volume/turnover may be tested only as residual/incremental information on identical common support against the price-only parent.

SDA-003 control:
- participation != motive.
- volumeAtBid/volumeAtAsk, RVOL, turnover, signed trade-pressure proxies and price-volume response remain participation/proxy observables unless independently identified.
- labels such as accumulation, distribution, informed buying, informed selling, smart money or true OFI remain forbidden from these primitives alone.

Admission consequences for future clean receipts:
- require source + endpoint + retrieval/freeze timestamp;
- require exchange/session/symbol/date/timeframe;
- require timezone and completed-bar status;
- require raw volume unit + normalized volume unit;
- require adjusted/unadjusted price semantics and corporate-action flag where relevant;
- require PRICE_OHLC vs VOLUME_TURNOVER informationRoot separation;
- require proxyClass and explicit intentIdentified=false unless an independent intent source exists;
- reject cross-timeframe joins with unproven unit conversion;
- reject opening-auction side-volume completeness assumptions;
- reject corporate-action mechanical gaps as ordinary breakout/response evidence.

Counter-evidence / limitation:
- Documentation establishes availability and semantics, not predictive alpha.
- Historical availability today does not prove the field was observable at the original decision time unless the future receipt binds firstKnownAt/availableAt or a valid decision-time source.
- Provider historical reconstruction can support replay/provenance, but cannot by itself establish prospective live observability.
- No D16 method receipt or numerical target was created here.

Result:
PVE-240 is accepted as provenance/admission evidence only.
It does not count as a clean prospective selection date and does not authorize L4 promotion.

Current state after PVE-240:
- PVE cursor: PVE-240.
- clean prospective selection dates: 0.
- D02 maturity: 60.0% unchanged.
- Gate 7: CLOSED.
- FORMAL_OPTIMIZATION_CANDIDATE: NONE.
- Formal Core: LOCKED.

Exact next continuation point:
PVE-241 — freeze the executable prospective receipt schema for minute/daily unit normalization, corporate-action contamination, source availability clocks and participation-intent classification; remain outcome-blind and do not create numerical targets or D16 model methods.


# PVE-241 — Prospective provenance receipt schema freeze (2026-10-05)

Status: OUTCOME_BLIND / SCHEMA_FROZEN / NO_PROMOTION / FORMAL_UNCHANGED.

Durable artifacts:
- `research/d02_prospective_pv_provenance_receipt_schema_v0_1.json`;
- `research/d02_pve_241_prospective_receipt_schema_freeze_20261005.md`.

Frozen receipt boundary:
- source/provider/endpoint/retrieval time/raw payload hash;
- availableAt/firstKnownAt/decisionCutoff;
- completed-bar identity and Asia/Taipei clock;
- raw and normalized volume units with explicit conversion;
- adjustment semantics and corporate-action lineage;
- information-root identity;
- participation proxy class with intentIdentified=false;
- fail-closed admission booleans/reasons.

Allowed V0.1 normalization is intentionally narrow:
SHARES identity, or regular-lot LOTS x1000 to SHARES.
Anything else remains UNKNOWN/BLOCKED until separately versioned.

The schema closes the design degree of freedom but does not prove runtime compliance.
A planned 14-case fail-closed fixture matrix was not durably created in this round because the repository write was blocked; therefore executable guard validation is still pending.

PVE-241 does not create a clean prospective date, numerical EffectTargetReceipt, D16 method receipt, L4 promotion or Formal change.

Current state:
PVE-241 / CLEAN_DATE_ZERO / Gate 7 CLOSED / D02 60.0%.

Exact next continuation:
PVE-242 — implement and independently validate the fail-closed executable guard/fixture set against the frozen PVE-241 schema, then capture the first genuine prospective receipt without opening promotion-grade outcomes.


# PVE-241 — Executable prospective receipt schema freeze (2026-10-05)

Status: OUTCOME_BLIND / EXECUTABLE_RECEIPT_SCHEMA_PASS / NO_MATURITY_CHANGE / FORMAL_UNCHANGED.

New durable artifacts:
- research/d02_pve241_prospective_receipt_guard_v0_1.mjs
- tests/test_d02_pve241_prospective_receipt_guard_v0_1.mjs
- research/D02_PVE241_PROSPECTIVE_RECEIPT_CONTRACT_V0_1.md
- research/d02_pve241_prospective_receipt_validation_v0_1.json

Independent executable validation:
33/33 tests PASS.

Frozen receipt protections:
1. sourceAvailableAt <= featureFirstKnownAt <= decisionCutoffAt;
2. non-replay decision sources must be prospectively captured;
3. HISTORICAL_REPLAY_ONLY may support replay/provenance but cannot prove original decision-time observability or become promotion-eligible;
4. MINUTE regular-lot volume must be LOTS, DAILY volume must be SHARES, and normalized comparison volume must be SHARES;
5. LOTS to SHARES requires explicit factor 1000 and value consistency;
6. cross-timeframe joins require unitNormalizationPass;
7. every row binds corporateActionClass; UNKNOWN cannot be ELIGIBLE;
8. EX_RIGHT_DIVIDEND requires mechanical reference-price control and cannot be ordinary price discovery;
9. UNIT_SCALE and SUPPLY_CHANGE require explicit continuity/comparability proof;
10. PRICE_OHLC and VOLUME_TURNOVER remain separate information roots; price-derived transforms cannot create a second independent vote;
11. future promotion claims require residual incrementality on common support;
12. participation/proxy observables do not identify motive without an independent decision-time source;
13. BID_ASK_SIDE_VOLUME / PROVIDER_TRADE_PRESSURE cannot become TRUE_OFI or claim complete-volume identity;
14. BID_ASK_SIDE_VOLUME cannot claim opening-auction completeness;
15. duplicate event identity is a fatal dataset-integrity condition.

SDA alignment:
- SDA-001 now has an executable D02-side no-second-price-vote receipt gate.
- SDA-003 now has an executable participation != motive / TRUE_OFI overclaim gate.
These are research-side controls only; audit tickets remain subject to D16 and 00 closure requirements.

Permanent authorization limits:
- outcomeAccessAuthorized=false;
- numericalTargetAuthorized=false;
- d16MethodSelectionAuthorized=false;
- maturityPromotionAuthorized=false;
- formalCoreChangeAuthorized=false.

PVE-241 creates no clean prospective date and no L4 promotion.

Current evidence:
PVE-241 / CLEAN_DATE_ZERO / Gate 7 CLOSED.

D02 remains 60.0%.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core LOCKED.

Exact next continuation point:
PVE-242 — bind the PVE-241 receipt guard to the existing D02 L4 admission lanes, prioritizing D02-02:H001, D02-03:H20, D02-06:H003 and D02-08, and prove that no admitted row can bypass source-clock, volume-unit, corporate-action, information-root or participation-intent checks. Remain outcome-blind.


# PVE-242 — Canonical schema reconciliation and admission bridge (2026-10-05)

Status: OUTCOME_BLIND / CANONICAL_SCHEMA_RECONCILED / ADMISSION_BRIDGE_PASS / NO_PROMOTION / FORMAL_UNCHANGED.

Concurrency reconciliation:
- a nested canonical PVE-241 schema and a later flat executable PVE-241 guard were created concurrently;
- the frozen canonical authority is research/d02_prospective_pv_provenance_receipt_schema_v0_1.json;
- the flat V0.1 guard/contract is retained only as historical implementation evidence and explicitly marked superseded as a receipt contract;
- there is now one receipt authority, not two.

New durable artifacts:
- research/d02_pve241_canonical_guard_v0_2.mjs;
- tests/test_d02_pve241_canonical_guard_v0_2.mjs;
- research/D02_PVE242_CANONICAL_RECEIPT_ADMISSION_BRIDGE_20261005_V0_1.md;
- research/d02_pve242_canonical_admission_bridge_validation_v0_1.json.

Independent executable validation:
27/27 tests PASS.

Canonical guard consequences:
- exact schemaVersion D02_PROSPECTIVE_PV_PROVENANCE_RECEIPT_V0_1 is required;
- source hash / provider / endpoint / clocks are fail-closed;
- completed-bar chronology is enforced;
- intraday regular-lot LOTS -> SHARES x1000 and daily SHARES identity are enforced;
- historical-provider data cannot self-prove original prospective decision-time observability;
- corporate-action UNKNOWN and mechanical contamination fail closed;
- intentIdentified must remain false under canonical V0.1;
- BID_ASK_SIDE_VOLUME cannot claim opening-auction completeness;
- eligibility cannot be true when any admission component fails.

Admission bridge now binds canonical receipts to:
- D02-02:H001;
- D02-03:H20;
- D02-06:H003;
- D02-08.

SDA-001:
Wave-1 bridge explicitly preserves PRICE_OHLC and VOLUME_TURNOVER lineage, requires common support + residual incrementality, and fixes priceDerivedIndependentVote=false.

SDA-003:
D02-08 bridge fixes trueOfiEligible=false, participantIntentEligible=false and dynamicAbsorptionEligible=false while preserving typed opening-auction completeness.

No economic outcome was opened.
No numerical target or D16 model method was created.
No clean prospective date was created.
No L4 promotion or Formal Core change is authorized.

Current evidence:
PVE-242 / CLEAN_DATE_ZERO / Gate 7 CLOSED.
D02 remains 60.0%.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core LOCKED.

Exact next continuation point:
PVE-243 — capture the first genuine prospective canonical receipt using the frozen schema plus V0.2 canonical guard, without opening promotion-grade outcomes. If no decision-time-valid source is available, record BLOCKED/UNKNOWN instead of retroactively admitting historical data.


# PVE-243 — First genuine prospective canonical provenance receipt (2026-10-05)

Status: PROSPECTIVE_CANONICAL_RECEIPT_PASS / GENERIC_PROVENANCE_ONLY / OUTCOME_CLOSED / NO_CLEAN_SELECTION_DATE / FORMAL_UNCHANGED.

Source capture:
- symbol 2330;
- marketDate 2026-10-05;
- official TWSE STOCK_DAY row;
- trade volume 26,800,187 SHARES;
- open/high/low/close 2550/2580/2545/2575;
- change +75;
- source row SHA-256 49bf802c95362145385a7e12ad58d2c212045437e48ed5f45914f1b3e7d5eae9;
- firstKnownAt 2026-10-05T20:41:42+08:00;
- decisionCutoff 2026-10-05T20:50:00+08:00.

Corporate-action cross-check:
- no 2330 match in the current TWSE TWT48U ex-right/ex-dividend forecast at capture;
- TWSE market-report semantics mark ex-right/ex-dividend/new-listing/resumption as N/A for change comparison;
- 2330 has a normal +75 change, not N/A;
- connected Fugle recent-important-dates data updated 2026-10-05 reports cshDivDate 2026-12-10, not 2026-10-05.

Source fallback audit:
- connected Fugle real-time quote was unavailable because real-time quote access is not enabled;
- FCNT000013 returned historical three-day price/volume, but its payload did not explicitly bind the volume unit;
- FCNT000154 returned no usable raw data for the requested capture;
- neither historical connector path was substituted for decision-time source proof.

Executable result:
- canonical receipt guard: PASS;
- PVE-242 GENERIC_PROVENANCE lane: PASS;
- H001 lane: FAIL_CLOSED as expected because the receipt is 1d rather than 15m.

Durable artifacts:
- research/d02_pve243_first_prospective_canonical_receipt_20261005_v0_1.json;
- research/D02_PVE243_FIRST_PROSPECTIVE_CANONICAL_RECEIPT_20261005_V0_1.md;
- research/d02_pve243_first_prospective_receipt_validation_v0_1.json.

Interpretation:
This is the first real prospective canonical provenance receipt.
It is not an H001/H20/H003/D02-08 clean event and does not increment clean prospective selection-date counters.

Current evidence:
PVE-243 / CLEAN_SELECTION_DATE_ZERO / Gate 7 CLOSED.
D02 remains 60.0%.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core LOCKED.

Exact next continuation point:
PVE-244 — obtain the first decision-time-valid 15m canonical receipt for Wave-1, beginning with H001 only at slot >=10:15 and only when baseline/history/current-slot/common-support requirements all pass. If a live 15m source cannot be proven, record BLOCKED/UNKNOWN rather than after-the-fact historical evidence.


# PVE-244 — Physical live 15m receipt audit (2026-10-05)

Status: LIVE_15M_CAPTURE_PROVEN / H001_FAIL_CLOSED / CANONICAL_SOURCE_BINDING_INCOMPLETE / SESSION_CAPTURE_PARTIAL / NO_PROMOTION / FORMAL_UNCHANGED.

Durable evidence:
- `research/D02_PVE244_LIVE_15M_READONLY_AUDIT_20261005_V0_1.md`;
- `research/d02_pve244_live_15m_readonly_audit_v0_1.json`;
- `.github/workflows/d02-pve244-d1-readonly.yml`.

Successful isolated read-only physical run:
- GitHub Actions run 37334245340;
- runtime 8.18.0-valuation-source-vintage;
- PV_SHADOW_ENABLED=true;
- mutationCount=0;
- temporary diagnostic Worker/subdomain cleaned up.

Physical 2026-10-05 D1 result:
- 8 INTRADAY_15M rows;
- one symbol: 2454;
- slots 09:00 through 10:45;
- all decisionImpact=0.

H001-eligible-time rows exist at 10:15, 10:30 and 10:45, but all fail closed:
- slotHistoryCount=1;
- pvSlotRvol20=null;
- pvGuardState=DATA_INSUFFICIENT;
- pvInterpretability=INVALID.

Physical baseline table:
- 2006 valid_sessions=2;
- 2454 valid_sessions=1;
- 4977 valid_sessions=2.

Frozen implementation intends a 180-day historical 15m bootstrap when validSessions<20 and skips only after validSessions>=20.
Therefore the physical baseline is not accepted as naturally ready; bootstrap root cause remains UNKNOWN.

Canonical-source gap:
physical 15m rows contain sourceFamily/barStart/barEnd/sourceFetchedAt/completedBar/semanticFingerprint, but rawPayloadHash, endpoint and provider are null.
semanticFingerprint is not relabeled as rawPayloadHash.
No PVE-241 canonical H001 receipt is created.

Runtime continuity counter-evidence:
- physical INTRADAY_MONITOR audit rows continue only to approximately 11:08 Asia/Taipei;
- no later intraday monitor row is observed before history warmup;
- this explains why no completed 11:00 slot was persisted;
- current source/spec expects intraday monitoring through 13:24;
- 23:35 Asia/Taipei is physically recorded as INTRADAY_MONITOR / SKIPPED although source scheduling semantics classify Taiwan hour>=18 as after-market.
Root cause remains uncertified.

PVE-244 falsification result:
live 15m prospective observability is physically proven, but H001 canonical admission remains blocked independently by:
1. insufficient same-slot historical baseline;
2. incomplete raw-source provenance;
3. partial/semantically inconsistent runtime schedule evidence.

No clean prospective date is added.
D02 remains 60.0%.
Gate 7 CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core LOCKED.


# PVE-245 — System 1 runtime remediation handoff (2026-10-05)

Status: ROUTED / RESEARCH_BLOCKER / NO_PRODUCTION_CHANGE_AUTHORIZED / FORMAL_UNCHANGED.

Durable handoff:
`research/D02_PVE245_SYSTEM1_RUNTIME_REMEDIATION_HANDOFF_20261005_V0_1.md`.

Cross-room durable routing:
`RESEARCH_CHECKPOINT.md` now carries the System 1 intake.

Three remediation families:
1. prospective source provenance persistence:
   provider + endpoint + rawPayloadHash at decision-time capture, separate from semanticFingerprint;
2. historical 15m baseline bootstrap:
   diagnose why intended 180-day bootstrap leaves only 1-2 valid sessions, expose explicit failure reason and require >=20 before H001;
3. scheduled capture continuity:
   verify a full future 09:00-13:24 intraday session and reconcile the observed 23:35 INTRADAY_MONITOR/SKIPPED readback against after-market semantics.

Governance:
- read-only diagnosis may proceed as Class A;
- production persistence/schema/bootstrap/runtime/schedule changes require engineering classification/authorization;
- D02 did not modify Formal production behavior;
- 2026-10-05 is permanently excluded from retrospective clean-date relabeling after repair.

Current evidence:
PVE-245 / CLEAN_SELECTION_DATE_ZERO / Gate 7 CLOSED.
D02 remains 60.0%.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core LOCKED.

Exact next continuation point:
PVE-246 — consume the durable System 1 remediation readback when available, then capture the first future decision-time-valid 15m H001 canonical receipt under the corrected path. Until all provenance/baseline/runtime gates pass, H001 prospective admission remains fail-closed.


# PVE-246 — Premarket remediation readback + certified root cause (2026-10-06)

Status: PREMARKET_READBACK_COMPLETE / ROOT_CAUSE_CERTIFIED / SYSTEM1_REMEDIATION_PENDING / H001_FAIL_CLOSED / NO_PROMOTION / FORMAL_UNCHANGED.

Durable evidence:
- `research/D02_PVE246_ROOT_CAUSE_CERTIFICATION_20261006_V0_1.md`;
- `research/d02_pve246_root_cause_certification_v0_1.json`;
- `.github/workflows/d02-pve246-premarket-readonly.yml`.

Successful read-only Production run:
- GitHub Actions run 37378253538;
- head SHA 56efe4cce4fdbf811f6c4b1597bd7bf260bd3591;
- runtime 8.18.0-valuation-source-vintage;
- TEST_MODE=false;
- no business POST, D1 mutation, re-selection or push.

System 1 durable-fix readback:
- PVE-245 intake exists;
- no FIX_IMPLEMENTED/PASS remediation receipt exists yet;
- SDA-003 remains VALIDATION_PENDING.

Physical scan readback:
- latest stored scan version 8.14.3-closure-receipt-memo;
- scanDate 2026-09-29;
- pipeline.complete=false;
- pvShadow absent on that stored result.

Certified root cause A — after-market Cron identity:
- runtime expects exact `35 15 * * MON-FRI`;
- actual Cloudflare schedule is `35,55 15 * * mon-fri`;
- 2026-10-05 23:35 and 23:55 both physically logged as INTRADAY_MONITOR / SKIPPED;
- `scripts/apply_v8_7_12.py` changed after-market recognition to exact `35 15 * * mon-fri` and removed the previous Taipei-hour >=18 fallback by replacing it with `return false`.
Therefore the configured combined primary+recovery Cron cannot match the runtime's exact after-market identity.

Certified root cause B — 15m baseline bootstrap starvation:
- `scripts/apply_v8_11_0.py` invokes the 180-day historical 15m PV bootstrap only after a successful Formal after-market scan reaches the post-Formal PV hook;
- the current 23:35/23:55 schedule identity never reaches that after-market path;
- the only fallback baseline-growth path, `pvRollObservedSession`, writes only when the latest slot is exactly 13:00;
- 2026-10-05 physical monitoring stopped around 11:08, so that date could not roll into baseline.
The documented Fugle endpoint supports 15m history and the requested 180-day range, so endpoint capability itself is not the certified blocker.

Certified root cause C — raw provenance dropped before persistence:
- the raw 15m provider response is available at the fetch/analyze boundary;
- `pvExtractCompletedSession15` converts it to normalized `session15`;
- the persisted PV snapshot source object omits provider / endpoint / rawPayloadHash;
- semanticFingerprint remains separate and is not accepted as raw-source identity.

PVE-246 consequence:
- the three PVE-245 blockers are now root-cause certified rather than UNKNOWN;
- remediation is still not implemented;
- no H001 canonical receipt or clean prospective date exists;
- 2026-10-05 remains permanently excluded from retrospective clean-date relabeling;
- D02 remains 60.0%;
- Gate 7 CLOSED;
- FORMAL_OPTIMIZATION_CANDIDATE: NONE;
- Formal Core LOCKED.

Exact next continuation point:
PVE-247 — consume System 1 implementation/readback for the certified Cron identity, baseline bootstrap and fetch-boundary provenance fixes. Only after physical readback proves all three may D02 capture the first future decision-time-valid 15m H001 canonical receipt.


# PVE-247 — Executable remediation acceptance oracle (2026-10-06)

Status: ACCEPTANCE_ORACLE_IMPLEMENTED / CI_PASS / SYSTEM1_FIX_NOT_YET_IMPLEMENTED / H001_FAIL_CLOSED / NO_PROMOTION / FORMAL_UNCHANGED.

Durable artifacts:
- `research/d02_pve247_remediation_acceptance_oracle_v0_1.mjs`;
- `tests/test_d02_pve247_remediation_acceptance_oracle_v0_1.mjs`;
- `.github/workflows/d02-pve247-remediation-oracle.yml`;
- `research/D02_PVE247_REMEDIATION_ACCEPTANCE_ORACLE_20261006_V0_1.md`;
- `research/d02_pve247_remediation_oracle_validation_v0_1.json`.

Validation:
- local deterministic fixtures: 15/15 PASS;
- dedicated CI run 37381110086: SUCCESS.

The oracle separates:
1. `remediationReady` — schedule identity + >=20 same-slot baseline + fetch-boundary raw provenance;
2. `h001ReceiptEligible` — remediationReady plus future date, canonical receipt guard, H001 lane guard, common support and cohort/generation/Formal-isolation.

This prevents engineering repair from being misread as H001 evidence or a maturity promotion.

Non-retroactivity is executable:
marketDate <= 2026-10-05 is rejected from the first repaired H001 evidence path.

New falsification / self-deception finding:
the legacy V8.7.12 regression validates the single 23:35 marker and removal of the broad evening fallback, while the Cloudflare schedule updater/recovery updater already accepts the combined 23:35+23:55 Cron. The runtime contract test does not prove `isAfterMarketSchedule` recognizes that combined Cron. Therefore legacy regression can pass while Production misclassifies both scheduled events.

Current Production verdict remains:
- schedule FAIL;
- baseline FAIL;
- provenance FAIL;
- remediationReady=false;
- h001ReceiptEligible=false.

No clean prospective date is added.
D02 remains 60.0%.
Gate 7 CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core LOCKED.

Exact next continuation point:
PVE-248 — prepare/consume the bounded System 1 Class-B repair candidate and its tests without merge/deploy; owner approval remains required before Production promotion.


# PVE-248 — Class-B repair candidate validation (2026-10-06)

Status: CLASS_B_CANDIDATE_PREPARED / ISOLATED_CI_PASS / FULL_CI_BLOCKED_BY_PREEXISTING_BASE_FAILURE / DRAFT_PR_651_OPEN / UNMERGED / NOT_DEPLOYED.

Durable validation:
- `research/D02_PVE248_CLASS_B_CANDIDATE_20261006_V0_1.md`;
- `research/d02_pve248_class_b_candidate_validation_v0_1.json`.

Candidate branch:
`research/d02-pve248-class-b-candidate-20261006`.

Active draft PR:
`#651`.

Superseded PR `#650` was automatically closed during a safe branch reconstruction when the head temporarily equaled the base; it was never merged or deployed.

Candidate scope:
- combined 23:35/23:55 after-market runtime recognition while retaining existing `onlyIfMissing:true` and D1 lease idempotence;
- Cron audit reason persistence;
- fail-open PV baseline warmup sidecar independent of Formal scan success;
- explicit bootstrap receipt in existing baseline JSON;
- exact 15m HTTP response-text SHA-256 provenance before JSON parse.

Candidate-isolated validation:
- push run `37386567610` SUCCESS;
- PR run `37386696263` SUCCESS.

Full PR checks:
- Regression `37386695299` FAILURE;
- Repair CI `37386695246` FAILURE.

Both fail before the PVE-248 runtime test at existing:
`tests/test_system1_zero_pick_evidence_collector_v0_1.mjs`
with `collector CLI failed`.

Independent main run `37382689408`, with no PVE-248 candidate, fails at the same collector test.
Therefore:
`PREEXISTING_BASE_CI_BLOCKER_NOT_PVE248`.

PVE-248 does not modify the unrelated System 1 collector to manufacture a green candidate.

Candidate remains:
- owner approval NOT GRANTED;
- merged NO;
- deployed NO;
- remediationReady=false until approved deployment + physical readback;
- H001 receipt eligible=false;
- clean prospective dates=0;
- D02 60.0%;
- Gate 7 CLOSED;
- Formal Core LOCKED.

Exact next continuation point:
PVE-249 — System 1 resolves the pre-existing zero-pick collector base-CI failure and returns a durable green base receipt. Then rerun PR #651 full Regression + Repair CI. Only when candidate-isolated and applicable repository-wide checks are green may explicit Class-B merge/deploy approval be requested.


# PVE-249 — Green candidate owner gate (2026-10-06)

Status: BASE_CI_REPAIRED / CANDIDATE_RESEQUENCED_V8_19_1 / ALL_APPLICABLE_CHECKS_PASS / DRAFT_PR_651_CLEAN / OWNER_APPROVAL_REQUIRED / UNMERGED / NOT_DEPLOYED.

Canonical evidence:
- `research/D02_PVE249_GREEN_CANDIDATE_OWNER_GATE_20261006_V0_1.md`;
- `research/d02_pve249_green_candidate_owner_gate_v0_1.json`.

Base-CI repair:
- zero-pick collector failure root cause = stale pre-V8.19 test fixture missing the new generation-inventory GET contract;
- Class-A fixture-only repair commit `c3bf53e0fe195647ecd77c87e6ce77e7ee744635`;
- main Regression `37387343385` SUCCESS;
- no Worker/Formal runtime change.

Candidate sequencing correction:
- the intermediate pre-V8.19 candidate placement was rejected by the V8.18 historical byte-identity invariant;
- the invariant was not weakened;
- final candidate is `scripts/apply_v8_19_1_pve248_candidate.py` applied after V8.19;
- final guard is `tests/test_v8_19_1_pve248_runtime_candidate.mjs`.

Final candidate:
- branch `research/d02-pve248-class-b-candidate-20261006`;
- head `e26e0e8e7786e25505714942e82a64e4cb8cec09`;
- draft PR `#651`;
- open / mergeable / clean;
- unmerged / not deployed;
- Production deploy wiring absent.

Final green checks:
- Candidate CI `37387779756` SUCCESS;
- System1 C1/C2 isolated review `37387779711` SUCCESS;
- Repair CI `37387779433` SUCCESS;
- Regression `37387779413` SUCCESS;
- isolated push candidate CI `37387775656` SUCCESS.

Technical candidate review is complete.
Class-B Production integration remains OWNER_APPROVAL_REQUIRED.

No Production repair is claimed.
No H001 canonical receipt is created.
Clean prospective dates remain 0.
D02 remains 60.0%.
Gate 7 CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core LOCKED.
2026-10-05 remains permanently non-retroactive.

Exact next continuation point:
PVE-250 — explicit owner decision on Class-B Production integration of PR #651. Only after approval may the candidate be wired into the Production build/deploy chain, revalidated, merged/deployed and physically read back under the PVE-247 oracle.


# PVE-250 — Latest-main rebased Class-B candidate owner gate (2026-10-06)

Status: LATEST_MAIN_REBASED_CANDIDATE_ALL_CHECKS_PASS / DRAFT_PR_668 / OWNER_APPROVAL_REQUIRED / UNMERGED / NOT_DEPLOYED / H001_FAIL_CLOSED / NO_PROMOTION / FORMAL_UNCHANGED.

Canonical evidence:
- `research/D02_PVE250_REBASED_CANDIDATE_OWNER_GATE_20261006_V0_1.md`;
- `research/d02_pve250_rebased_candidate_owner_gate_v0_1.json`.

Active candidate:
- draft PR #668;
- branch `research/d02-pve250-rebased-candidate-20261006`;
- base main at creation `05cfe0f0fc4b857dc089355f6fccd7a8ec8100f0`;
- head `5877f82db1579a02091c7011e1525ea3f4490bad`;
- mergeable=true;
- merged=false;
- deployed=false.

PR #651 is superseded and closed without merge or deploy.

Latest-main validation:
- Candidate push CI `37403479188` SUCCESS;
- Candidate PR CI `37403498580` SUCCESS;
- Repair CI `37403498568` SUCCESS;
- Regression `37403498495` regression job SUCCESS.

Candidate Production deploy is not wired.
PVE-247 oracle remains authoritative.
No clean prospective date is added.
D02 remains 60.0%.
Gate 7 CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core LOCKED.

Exact next continuation point:
OWNER_APPROVAL_REQUIRED — explicit approval for Class-B Production integration of PR #668. Without approval remain draft/unmerged/un-deployed.


# PVE-256 — Same-slot baseline-clean is a provenance/freshness state, not a count-derived boolean (2026-10-07)

## Question

Can the first post-remediation 2026-10-07 intraday row be admitted to H001 solely because it has `slotHistoryCount>=20` and finite `pvSlotRvol20`?

Answer: no.

## Canonical dependency chain

The existing evidence contract already separates:
1. exact-slot count readiness;
2. exact-slot baseline freshness;
3. missing-session / missing-slot provenance;
4. corporate-action/reset continuity;
5. current-session continuity;
6. cohort/common-support eligibility.

PVE-083 requires `baselineAsOfDate` to be consistent with the latest expected comparable prior session. PVE-095 further requires session-age reasoning to use expected symbol sessions, not calendar-day age, and requires unexplained missing exact slots to remain non-clean. PVE-089 identifies persisted `coverage.baselineAsOfDate` as the existing exact-slot freshness salvage field.

Therefore:
`slotHistoryCount>=20 + finite RVOL`
is necessary but not sufficient for
`sameSlotBaselineClean=true`.

## Runtime/source trace

`pvBaselineStats(cache,marketDate,slotKey)`:
- filters baseline sessions strictly before the current market date;
- applies `corporateActionResetAt`;
- selects the exact requested `slotKey` within each prior session;
- takes the final 20 exact-slot observations;
- derives `baselineAsOfDate` from the last element of that exact-slot set.

The intraday snapshot already persists `baselineAsOfDate` in `coverage_json`, but current Production does not persist `sameSlotBaselineClean`.

This explains the PVE-255 `null` without converting it to either PASS or FAIL.

## Tri-state rule

Research guard V0.1:
`research/d02_pve256_same_slot_baseline_clean_guard_v0_1.mjs`.

States:
- PASS: every required pre-outcome proof is affirmative;
- FAIL: an explicit violation is observed;
- UNKNOWN: a required proof is absent.

Mandatory positive evidence before PASS:
- `slotHistoryCount>=20`;
- original `pvSlotRvol20` value is a finite number;
- `baselineAsOfDate < marketDate`;
- `baselineAsOfDate == expectedLatestComparableSlotDate`;
- corporate-action continuity is positively classified clean/bridged/reset-clean;
- exact-slot historical validity is positively PASS.

Current-session prefix/continuity remains a separate common-support gate and is intentionally not hidden inside this baseline-clean state.

## Falsification fixture

`tests/test_d02_pve256_same_slot_baseline_clean_guard_v0_1.mjs` covers:
- fully proven PASS;
- missing baseline date -> UNKNOWN;
- missing expected latest comparable date -> UNKNOWN;
- stale date mismatch -> FAIL;
- unresolved corporate-action continuity -> UNKNOWN;
- known exact-slot invalidity -> FAIL;
- history count below 20 -> FAIL;
- null RVOL -> FAIL;
- PVE-255 durable receipt with missing clean-proof fields -> UNKNOWN;
- explicit UNKNOWN reason preservation.

A first implementation using numeric coercion was rejected because JavaScript `Number(null)===0`; missing values must not become finite zero by coercion. Final validation passes 10 assertions locally.

## PVE-255 result

PVE-255 remains:
`SAME_SLOT_BASELINE_CLEAN_UNKNOWN / H001_FAIL_CLOSED`.

No clean date is added.
No outcome access is opened.
No maturity change is authorized.

## Outcome-access incident quarantine

A support lookup intended to verify prior-session availability returned a broader current-day price/volume payload that contained post-feature outcome-bearing fields while the preregistered state was `OUTCOME_ACCESS_CLOSED`.

Control response:
- discard the exposed outcome values from this research decision;
- do not persist them here;
- do not inspect/tune thresholds, models, slots or horizons from them;
- keep the affected 2026-10-07 H001 candidate inadmissible;
- use only pre-outcome persisted D1 baseline/provenance fields for PVE-257.

This incident cannot create positive evidence.

## Status

`TRI_STATE_BASELINE_CLEAN_GUARD_FROZEN / PVE255_UNKNOWN / OUTCOME_ACCESS_QUARANTINED / H001_FAIL_CLOSED / FORMAL_UNCHANGED`.

Exact next:
PVE-257 must surface the persisted exact-slot baseline evidence read-only and compute a deterministic baseline content identity; expected comparable-slot freshness remains UNKNOWN unless an authoritative symbol-session/suspension source proves it.


# PVE-257~260 — Minimum sample sufficiency does not imply same-slot baseline freshness (2026-10-07)

## PVE-257: exact-slot baseline content is internally reproducible

The persisted 2454 baseline was reconstructed from D1 without reading outcomes or mutating Production.

For the 2026-10-07 11:45 snapshot:
- persisted snapshot `baselineAsOfDate` = 2026-10-05;
- reconstructed last-20 exact-slot `baselineAsOfDate` = 2026-10-05;
- exact-slot content identity and snapshot identity agree;
- baseline update time predates the snapshot;
- exact-slot history validity passes;
- deterministic content fingerprint = `1ca5ac53a1d04f422eb6676bbc79c65141d66b1243787d06523e85d6c5490d6e`.

This proves the stale date is not a report rendering bug. It is the actual baseline content used by the snapshot.

## PVE-258: 2026-10-06 was a real comparable 11:45 session for 2454

The sanitized provider probe is deliberately narrow and outcome-blind relative to the 2026-10-07 feature:
- symbol 2454 only;
- date 2026-10-06 only;
- 15-minute identity only;
- no price/outcome fields emitted.

Successful receipt:
- run `37638102686`;
- provider HTTP 200;
- 19 source rows;
- exactly one 11:45 row;
- exact-response SHA-256 `47f54378d28df65ffca0741342013a73db3040863c0ea090c1d3252b83f4e9e0`;
- no mutation.

Thus the latest expected comparable exact slot for 2026-10-07 11:45 is 2026-10-06, while the actual baseline stops at 2026-10-05.

PVE-256 classification is therefore:
`FAIL / BASELINE_FRESHNESS_MISMATCH`.

The unresolved corporate-action continuity source cannot turn a known freshness mismatch into PASS or UNKNOWN.

## PVE-259: root cause is a freshness hole preserved by a count-only skip

Physical D1 readback of 2026-10-06 found only four 2454 intraday PV snapshots:
09:00, 09:15, 09:30, 09:45.

There is no 13:00 snapshot.

Current runtime only calls the baseline roll write successfully when the current session has reached the exact 13:00 slot. Therefore the 2026-10-06 session was never rolled into the intraday baseline through that path.

Later historical bootstrap created an 80-session baseline ending 2026-10-05. On the following day, `pvBootstrapSymbol()` treats matching schema + `validSessions>=20` as sufficient to skip historical refresh.

This conflates:
- sample sufficiency: enough observations exist to calculate a statistic;
with
- temporal freshness: the most recent expected comparable observation is actually present.

A system may satisfy the first while violating the second.

## PVE-260: repair invariant

The research-only refresh decision guard makes freshness an independent non-bypassable state.

A baseline may skip historical refresh only if:
1. schema is valid;
2. minimum history is satisfied;
3. latest expected comparable exact-slot date is known;
4. exact-slot `baselineAsOfDate` equals that expected date;
5. exact-slot historical validity passes.

If the exact-slot baseline is stale, `validSessions>=20` has no authority to bypass refresh.

Physical case:
`80 sessions + baseline 2026-10-05 + expected 2026-10-06 => REFRESH_REQUIRED`.

## Anti-self-deception

- Do not repair the 2026-10-07 feature retrospectively into a clean H001 date.
- Do not inspect outcomes to choose the refresh rule.
- Do not substitute baseline-wide `lastMarketDate` for exact-slot freshness.
- Do not infer corporate-action cleanliness from an incomplete “no rows found” source.
- Do not count a future repaired baseline as alpha evidence until a genuinely prospective feature/outcome lifecycle exists.
- Do not merge the separate 23:35/23:55 schedule candidate merely because this freshness defect is now certified.

## Status

`SAME_SLOT_BASELINE_CLEAN_FAIL / ROOT_CAUSE_CERTIFIED / REFRESH_INVARIANT_FROZEN / CLEAN_H001_DATES_0 / D02_60_PERCENT / FORMAL_UNCHANGED`.

Exact next:
PVE-261 should define the owner-gated Production remediation acceptance contract and future-session physical readback requirements, without changing Formal selection logic.


# PVE-261~269 — Two independent blockers now separate D02 baseline validity from cross-system execution capacity (2026-10-08)

## PVE-261: baseline-refresh repair is now preregistered before implementation

The PVE-260 finding established a specific causal defect:
minimum sample count can be satisfied while the latest expected exact-slot observation is absent.

PVE-261 converts that finding into an owner-gated Production-remediation acceptance contract rather than directly editing Production.

Executable artifacts:
- `research/d02_pve261_baseline_refresh_acceptance_v0_1.mjs`;
- `tests/test_d02_pve261_baseline_refresh_acceptance_v0_1.mjs`;
- dedicated validation run `37648991883` SUCCESS.

Twenty-two falsification assertions freeze:
- Class-B/owner-gate boundary;
- freshness over count sufficiency;
- authoritative pre-outcome expected-slot binding;
- bounded historical refresh through the expected prior session;
- current-session and future-data exclusion;
- exact provider-response hash provenance;
- corporate-action/reset preservation;
- explicit missing-slot fail-closed semantics;
- prospective post-deploy physical readback;
- no retroactive clean-date creation.

This is design evidence only. Production remediation is not accepted until a future physical receipt passes.

## Natural after-market family: absence of D1 cron rows was not absence of invocation

After 2026-10-07 23:35 and 23:55 were naturally due:
- PVE-251 run `37649041814` observed the configured family but no persisted family rows.
- PVE-262 run `37649249573` directly queried the raw D1 interval 23:20–00:10 Asia/Taipei and still found zero cron rows.

That eliminated a filtering bug but left two competing explanations:
1. trigger was never invoked;
2. trigger was invoked but the D1 audit sink could not persist.

PVE-263 resolved the ambiguity.

## PVE-263: independent side effects prove invocation plus D1 quota failure

Read-only run `37649543821` physically observed:
- `V7_LAST_SCAN_ATTEMPT.status=FAILED`;
- requestedDate 2026-10-07;
- generatedAt 23:36:10 Asia/Taipei;
- explicit Cloudflare D1 Free daily row-write-limit error;
- failure alert sent;
- after-market lease updated at 23:55:03 Asia/Taipei.

Thus the 23:35 primary path entered business execution and the 23:55 recovery path also left independent side-effect evidence.

Current `writeCronRun()` swallows its own D1 persistence error. Once D1 quota is exhausted, the audit record can therefore disappear while independent KV/lease evidence proves invocation.

Evidence semantics must not collapse:
`NO_D1_CRON_ROW`
into
`NO_TRIGGER`.

For this date the correct state is:
`INVOKED_EXECUTION_FAILED_D1_QUOTA`.

## PVE-264: quota exhaustion is account-wide and cross-system

Cloudflare analytics readback for UTC 2026-10-07:
- SYSTEM2_DB rowsWritten = 124,629;
- V7_DB rowsWritten = 1,869;
- account rowsWritten = 126,498;
- SYSTEM2_DB share ≈ 98.52%;
- V7_DB share ≈ 1.48%.

The canonical vendor contract already frozen in `S2-CORR-20261007-003` is 100,000 rowsWritten per UTC day on the Free account.

Therefore:
- separate D1 IDs are storage isolation, not Free-quota isolation;
- V7_DB can be denied writes because another D1 in the same account exhausted the shared limit;
- the System1 after-market failure is materially downstream of account-wide consumption, not evidence that System1 itself generated the dominant write load.

## Existing correction ownership prevents duplicate remediation

Latest canonical System2 governance already assigns:
`S2-CORR-20261007-003`
to REMEDIATION_LANE with HIGH / OPEN status.

Its existing evidence independently identifies the same account-level quota-governance defect and measures:
- 9,640 logical Recent A1 bars -> 57,880 rowsWritten (~6.00x write amplification);
- scheduled Daily Shadow = 13,130 rowsWritten;
- later Daily Shadow push = 1,296 rowsWritten;
- a 2024 TWSE annual sample = 7,358 rowsWritten.

D02 therefore contributes cross-system impact evidence but does not create a second correction or seize implementation authority.

## PVE-265/PVE-266: query-level insight was insufficient; table-level physical attribution was informative

PVE-265 successfully called D1 Insights but returned an empty query-level top-write list.

Because PVE-264 proves 124,629 SYSTEM2_DB rowsWritten, the empty Insights list is classified as:
`QUERY_LEVEL_ATTRIBUTION_INSUFFICIENT`,
not zero write activity.

PVE-266 then used read-only table-window attribution.

Successful run `37651086323` observed UTC 2026-10-07:
- `s2_historical_a1_bars`: 18,460 newly captured logical rows;
- `s2_historical_a1_pack_manifests`: 1,538;
- `s2_historical_ingest_batches`: 21 with declaredRows sum 20,433;
- `s2_resonance_runs`: 1;
- `s2_resonance_snapshots`: 0.

This independently supports the existing CORR-003 calibration that indexed historical-A1 insertion is a dominant write-amplification family. It does not allocate all 124,629 physical write rows to a single workflow, because SQLite index/page effects and other writers remain part of account usage.

## PVE-267: cross-system material-impact handoff

Durable handoff:
`research/D02_PVE267_CROSS_SYSTEM_D1_QUOTA_IMPACT_HANDOFF_20261008_V0_1.md`
at commit `f09c9c69a43c97c37d6cfc075a7070797742bab5`.

The new D02 contribution is not a new defect class. It extends observed impact:
System2 write consumption can consume shared account headroom required for System1's critical after-market persistence.

Recommended acceptance extension, subject to AUDIT_LANE governance:
- protect System1 after-market write headroom explicitly;
- lower-priority System2 bulk writers must not consume that reserve;
- unknown account usage must fail conservatively;
- future physical acceptance must show the quota gate active before after-market, primary/recovery invocation, exactly one successful business execution and normal persisted receipts.

## PVE-268: cross-system quota acceptance contract

Research-only guard and fixtures:
- `research/d02_pve268_cross_system_d1_quota_acceptance_v0_1.mjs`;
- `tests/test_d02_pve268_cross_system_d1_quota_acceptance_v0_1.mjs`;
- run `37651460612` SUCCESS;
- 22 assertions PASS.

The guard deliberately does not invent a System1 reserve amount.
A positive reserve must come from evidence.

Budget states:
- `UNKNOWN_BLOCK`;
- `QUOTA_EXHAUSTED`;
- `QUOTA_BUDGET_DEFER`;
- `QUOTA_RESERVATION_ADMISSIBLE`.

Physical closure evidence additionally requires no quota rejection, exactly one successful after-market business scan and no strategy/Formal/capital/order/billing change.

## PVE-269: schedule evidence is now multi-source, not D1-row-only

Research-only schedule fusion:
- `research/d02_pve269_schedule_evidence_fusion_v0_1.mjs`;
- `tests/test_d02_pve269_schedule_evidence_fusion_v0_1.mjs`;
- run `37651678046` SUCCESS;
- 17 assertions PASS.

States distinguish:
`UNOBSERVED`,
`INVOKED_AUDIT_ROW_UNAVAILABLE`,
`INVOKED_EXECUTION_FAILED`,
`INVOKED_EXECUTION_FAILED_D1_QUOTA`,
`BUSINESS_EXECUTION_SUCCESS`
and duplicate execution.

This closes a research-evidence blind spot:
failure of the audit sink itself must not erase independent invocation evidence.

The 2026-10-07 family is classified:
`INVOKED_EXECUTION_FAILED_D1_QUOTA`.

## Economic hypothesis status

No D02 economic hypothesis is promoted, supported or rejected from these engineering/provenance findings.

Reasons:
- baseline freshness failed on the only current H001 candidate;
- schedule execution failed under shared-account quota exhaustion;
- clean prospective H001 dates remain zero;
- outcome access remains closed;
- no future post-remediation feature/outcome lifecycle has completed.

D02 stays 60.0%.
All 12 D02 modules remain L3.
Gate 7 remains CLOSED.
Formal Core remains LOCKED.
FORMAL_OPTIMIZATION_CANDIDATE remains NONE.

## Exact next

PVE-270 is a dual-prerequisite prospective reopening boundary:
1. a future owner-approved PVE-261 baseline-refresh remediation must physically produce a clean exact-slot baseline with authoritative freshness and full provenance;
2. existing `S2-CORR-20261007-003` must later be independently remediated/verified so account quota reservation protects System1 after-market execution, followed by a future real trading day classified by PVE-269 as exactly one successful business execution.

Neither prerequisite may be satisfied retrospectively from 2026-10-07.


# PVE-270~276 — Wave-1 baseline/execution anti-bypass evidence chain (2026-10-08)

The continuation after PVE-269 identified that fixing the original H001 defect alone would leave two different bypass classes:
1. sibling Wave-1 lanes can consume the same stale baseline family without H001's freshness checks;
2. downstream D16 receipts can validate data admitted only by the legacy Wave-1 gate.

PVE-270 first froze H001's dual prerequisite: baseline remediation and account-level D1 execution capacity are independent necessary conditions. Thirty-two falsifiers passed.

PVE-271/272 then attempted to evidence-bind the System1 after-market D1 reserve instead of inventing one. Read-only physical history found only two healthy after-market dates in all available cron history, 2026-09-21 and 2026-09-22. Their whole-V7_DB daily writes were 2,825 and 1,635. This is insufficient for a reservation contract; `reserveNumberAuthorized=false`. The finding reduces uncertainty without fabricating headroom.

PVE-273 reproduced an H20 admission defect: the legacy H20 PVE-242 bridge passes event identity/anchor/horizon with no same-slot baseline freshness fields. Because H20's challenger is same-slot RVOL20, that is a genuine stale-baseline path. The 22-fixture overlay closes it.

PVE-274 reproduced the analogous but structurally different H003 defect. P/PV compare price-only response against identical price geometry plus volume effort. V8.11 source binds pvSlotRvol20 to a historical slot-volume median and range-expansion/signed-progress to a historical slot-range median. Therefore both common price-range baseline validity and PV-only volume-baseline validity must be proven; asymmetry can masquerade as volume incrementality. Twenty-six fixtures pass.

PVE-275 composes H001/H20/H003 into one Wave-1 pre-outcome firewall. PVE-276 then binds D16's exact input dataset hash to the PVE-275 admitted dataset hash. Existing D16 V0.2 semantics remain statistically authoritative, but direct consumption of legacy Wave-1 admission is no longer sufficient under current D02 evidence governance.

No economic result changed. These findings lower false-positive admission risk; they do not demonstrate alpha.

D02 remains 60.0%; all modules L3; clean prospective dates 0; Gate 7 CLOSED; Formal Core LOCKED.

Next: PVE-277 Wave-2 baseline dependency/bypass audit.
