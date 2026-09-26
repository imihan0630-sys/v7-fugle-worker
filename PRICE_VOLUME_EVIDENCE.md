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

