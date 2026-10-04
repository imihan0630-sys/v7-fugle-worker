# D01 DL-031 — Structural Aging vs Observability Censoring V0.1

Updated: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / AGING_CENSORING_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-030 separated structural-object persistence from repeated rolling-window rediscovery.

DL-031 asks the next question:

> When an old support/resistance object appears weaker or disappears from detector output, is that genuine structural aging/decay, repeated-use depletion, or merely loss of observability because the original anchors have moved outside the detector horizon?

These mechanisms must be separated before any future age-decay claim.

No return outcome is opened in this tranche.

## 2. External evidence and why one age clock is insufficient

Existing support/resistance evidence is compatible with at least two simultaneous effects.

Chung and Bellotti (2021) report:
- higher prior bounce counts are associated with a higher probability of another bounce;
- bounce probability also decreases with elapsed time.

Therefore:
- interaction history may strengthen or reinforce a level;
- elapsed time may weaken a level;
- these effects can coexist.

Henderson, Jacka, Liu and Maeda (2026) use a path-dependent support/resistance model with a transition from one regime toward a neutral regime after a waiting time. This supports aging as a plausible state-process mechanism but is not empirical D01 alpha evidence.

Survival-analysis methodology also warns that:
- right censoring is not failure;
- left truncation changes the risk set;
- time-varying covariates require time-aware risk-set treatment.

D01 therefore rejects a single "days old" scalar as the full aging state.

## 3. Four separate clocks

### A0 — CALENDAR_AGE_DAYS

Calendar difference:
asOf - firstConfirmedAt.

Purpose:
descriptive chronology only.

It is not promotion-grade by itself because weekends, holidays, suspensions and unavailable sessions differ across objects.

### A1 — ELIGIBLE_SESSION_AGE

Number of verified eligible symbol sessions since first confirmation through asOf.

Requires the canonical session/continuity owner.

This is the primary chronological market-time age.

### A2 — OBSERVABLE_SESSION_AGE

Number of sessions during which:
- required source/session data were complete;
- the structural root remained reconstructible under the detector's required horizon or persisted-root authority;
- the observation state was not UNKNOWN.

This is not equal to A1 when coverage gaps or detector horizon censoring occur.

### A3 — INTERACTION_OPPORTUNITY_AGE

Count of causally valid sessions/events where price had a predefined structural interaction opportunity.

Opportunity may use the DL-026 frozen crossing/opportunity semantics.

A day far from the zone is not evidence that the zone "failed to work."

Do not convert non-approach days into decay failures.

## 4. Interaction history is not age

Store separately:
- priorInteractionCount;
- priorBounceCount;
- priorBreakCount;
- priorReclaimCount;
- timeSinceLastInteractionEligibleSessions;
- timeSinceLastBounceEligibleSessions where known.

Do not collapse these with age into one score.

A level may be:
- old with few interactions;
- old with many successful bounces;
- young with many rapid retests;
- young and untouched.

These states are scientifically different.

## 5. Root age vs version age

DL-030 allows one structural root to acquire later causal versions.

Therefore freeze two clocks:

ROOT_AGE:
since root firstConfirmedAt.

VERSION_AGE:
since current structural-object version effectiveAt.

A later causal anchor extension:
- does NOT reset ROOT_AGE;
- DOES reset VERSION_AGE.

This prevents a refreshed boundary from making an old root look artificially young.

Future anchors may never alter an earlier root/version age.

## 6. Observability-state taxonomy

At each asOf classify exactly one state.

### O0 — OBSERVABLE_ACTIVE

Root identity is certified and the necessary follow-up state is observable.

### O1 — WINDOW_CENSORED_ROOT_PERSISTED

The detector's rolling source window no longer contains the original anchor history, but the already-certified root/boundary/lineage remains durably persisted.

Interpretation:
detector observability loss.

Not:
market invalidation.

A1 ROOT_AGE may continue.
Detector-specific A2 stops unless persisted-root follow-up is explicitly available.

### O2 — UNKNOWN_COVERAGE_GAP

Required source/session/provenance is incomplete.

No structural aging statement is permitted for the missing interval.

### O3 — DETECTOR_ABSENT_COMPLETE_SCAN

Coverage is complete and the root remains reconstructible, but the detector does not emit the object.

This is detector-state evidence.

It is not automatically structural decay or market invalidation.

### O4 — MARKET_INVALIDATED

An explicit lifecycle rule certifies structural invalidation.

This is a market-structure event and closes the current object episode.

### O5 — STUDY_END_RIGHT_CENSORED

The observation period ends while the object has no certified market invalidation.

This is administrative right censoring.

Not:
failure.

## 7. Window censoring is mechanically age-dependent

For a fixed rolling detector horizon, old anchors eventually leave the lookback window by construction.

Therefore a naive study restricted to "objects still emitted by the detector" induces mechanical survivor selection.

If older objects disappear from the analysis simply because their anchors aged out of the input window, an apparent age-decay curve may be detector architecture rather than market behavior.

Frozen rule:
WINDOW_CENSORED_ROOT_PERSISTED must be retained in the follow-up manifest.

Do not relabel it as:
- EXPIRED;
- FAILED;
- DECAYED;
- INVALIDATED.

## 8. Persisted-root follow-up

A structurally confirmed root may be followed after detector-window censoring only if the research observer has a causal persisted-root record containing:
- root identity;
- boundary/version history;
- semantic space;
- lifecycle state at last certified observation;
- source/session provenance;
- no future-rewritten anchors.

This follow-up asks how price later interacts with a previously certified object.

It does not pretend the rolling detector could rediscover the object from its current window.

Two states must remain distinct:
DETECTOR_RECONSTRUCTIBLE and ROOT_FOLLOWUP_AVAILABLE.

## 9. Left-truncation firewall

A decay cohort is promotion-grade only if first confirmation is causally certified.

If research observation begins after an object has already existed and its firstConfirmedAt/history cannot be reconstructed exactly, classify:

LEFT_TRUNCATED_FIRST_CONFIRMATION_UNKNOWN.

Such objects may appear in descriptive diagnostics.

They are not promotion-grade for age-decay estimation.

If exact first confirmation and preceding eligible-session history are replayable, historical replay may become evaluable; it is not automatically disqualified merely because it is historical.

## 10. Structural aging vs depletion vs reinforcement

Future outcome analysis must distinguish:

T — TIME_SINCE_CONFIRMATION
A1 eligible-session age.

U — USE / INTERACTION HISTORY
prior interactions, bounces, breaks, reclaims.

R — RECENCY OF LAST USE
time since last interaction/bounce.

Possible mechanisms:

TIME_DECAY:
older age reduces future structural response after controlling U/R/opportunity.

REINFORCEMENT:
more prior successful bounces increase future response after controlling age/opportunity.

DEPLETION:
more interactions reduce future response after controlling age/opportunity.

MIXED:
reinforcement at low interaction counts but depletion after repeated tests.

D01 does not choose a nonlinear shape or threshold.

No "third touch is best" rule is authorized.

## 11. Opportunity-based future estimand

The primary future response estimand should be defined at a causally valid interaction opportunity, not every elapsed day.

For one object/opportunity j, freeze predictor state immediately before the opportunity:
- ROOT_AGE;
- VERSION_AGE;
- prior interaction history;
- observability state;
- opportunity covariates from DL-026;
- volatility/liquidity;
- tick/round-price context;
- D02 acceptance/persistence;
- market/sector regime.

Then future D16 analysis may evaluate the post-opportunity structural response.

D01 does not define the outcome horizon here.

No outcome field belongs in the DL-031 manifest.

## 12. Detector absence is not an age event

A complete scan may stop emitting an otherwise reconstructible root because:
- detector thresholds changed;
- a newer candidate displaced it;
- topology segmentation changed;
- competing nearby anchors changed local structure.

This is detector behavior.

Do not count "days since detector disappearance" as structural decay without a separate object-lifecycle event.

## 13. Competing event and censoring distinction

MARKET_INVALIDATED is an event.

STUDY_END_RIGHT_CENSORED is censoring.

WINDOW_CENSORED_ROOT_PERSISTED is detector-observability censoring, not necessarily structural censoring if persisted-root follow-up remains possible.

UNKNOWN_COVERAGE_GAP is missingness/uncertain observability.

Future D16 inference must not pool these into one "inactive" label.

## 14. No assumed exponential half-life

The literature suggests temporary predictability and theoretical waiting-time state changes.

That does not justify hard-coding:
- exponential decay;
- linear decay;
- fixed half-life;
- age buckets;
- N-session expiry.

Future D16 analysis must compare preregistered flexible age representations and a no-age null on common support.

D01 freezes semantics, not a decay curve.

## 15. Required manifest fields

Per root/asOf snapshot:
- structuralRootId;
- structuralVersionId;
- objectEpisodeId;
- symbol;
- semanticSpace;
- timeframe;
- firstConfirmedAt;
- currentVersionEffectiveAt;
- asOf;
- calendarAgeDays;
- eligibleSessionAge;
- observableSessionAge;
- detectorReconstructible;
- rootFollowupAvailable;
- observabilityState;
- priorInteractionCount;
- priorBounceCount;
- priorBreakCount;
- priorReclaimCount;
- timeSinceLastInteractionEligibleSessions;
- timeSinceLastBounceEligibleSessions;
- opportunityReceipt if an interaction opportunity exists;
- session/continuity provenance;
- censoring/event reason;
- manifestVersion/hash.

No future-return field.

## 16. Falsification ladder

Future research classification:

A0_APPARENT_DECAY_ONLY_WHILE_DETECTOR_VISIBLE
Effect disappears when persisted-root follow-up includes window-censored roots.
Interpretation:
detector-horizon artifact.

A1_TIME_DECAY_REDUNDANT_WITH_INTERACTION_HISTORY
Age effect disappears after prior interactions/bounces/retests are controlled.
Interpretation:
use-history rather than clock-time mechanism.

A2_INTERACTION_EFFECT_REDUNDANT_WITH_AGE
Touch/bounce effect disappears after age/opportunity controls.
Interpretation:
apparent reinforcement/depletion may be age confounding.

A3_AGE_AND_INTERACTION_BOTH_REMAIN
Time and interaction history have separable representation value.
Interpretation:
candidate mixed structural-memory dynamics.

A4_NOT_EVALUABLE
Insufficient first-confirmation/session/follow-up provenance or common support.

None is Formal alpha.

## 17. Current decision

CALENDAR_AGE_AS_SOLE_DECAY_CLOCK =
REJECTED.

ELIGIBLE_SESSION_AGE =
PRIMARY_CHRONOLOGICAL_AGE.

WINDOW_CENSORING_IS_DECAY =
FALSE.

NON_APPROACH_DAY_IS_FAILURE =
FALSE.

ROOT_AGE_RESETS_ON_CAUSAL_EXTENSION =
FALSE.

VERSION_AGE_RESETS_ON_CAUSAL_EXTENSION =
TRUE.

FIXED_DECAY_HALF_LIFE =
NOT_DEFINED.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 18. Exact next continuation

1. Build deterministic aging/observability state helper and adversarial tests.
2. Preserve root age, version age, observability age and interaction history separately.
3. Preserve window-censored roots in the research follow-up manifest.
4. Hand left-truncation/right-censoring/opportunity-based inference semantics to D16.
5. Execute DL-022..DL-031 research Node tests only through a reproducible approved research-test path; V8 CI is not their receipt.
6. Next D01 science: separate structural aging from regime migration / volatility-scale migration so a level does not look "old" merely because the market price process changed scale.
7. No outcome join / no runtime wiring / no Formal change.
