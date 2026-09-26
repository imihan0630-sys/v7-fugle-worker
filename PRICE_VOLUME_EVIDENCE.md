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

