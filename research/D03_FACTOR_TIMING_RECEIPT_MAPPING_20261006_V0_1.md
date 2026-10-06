# D03 Consumer-Ready Factor Timing Receipt Mapping V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Parent contracts: TI-701~1000
Status: RESEARCH_ONLY / OUTCOME_CLOSED / CONSUMER_TIMING_MAPPING_FROZEN
Formal Core: LOCKED
Tickets: SDA-001 / SDA-004

## Purpose

Convert the D03 timing hierarchy into a consumer-ready machine contract for System 1, System 2 and D16 without changing any runtime or Formal behavior.

Every active D03 factor family receives an explicit timing profile. The profile answers:
- when the factor can first be known;
- which decision clock can legally consume it;
- when execution/outcome evaluation can begin;
- which offset family is legal;
- which ancestry controls remain mandatory;
- which special continuity/finality blockers apply.

## TI-1001 — one receipt envelope, multiple timing profiles

All current D03 factor receipts share one envelope but not one clock.

Required identity:
- receiptVersion;
- factorId/factorVersion;
- timingProfileId/timingProfileVersion;
- featureLineageId;
- informationRoot;
- redundancyGroupId;
- parameterFamilyId;
- sourceLineageHash;
- consumerScopeHash.

Required timing:
- signalKnownAtRule;
- decisionCutoffRule;
- executionClockRule;
- legalOffsetFamilyId;
- forbiddenFutureOffsetFamilyId;
- endpointFamilyId.

Required inference binding:
- ancestryBaselineHash;
- commonSupportHash;
- purgeEmbargoRuleVersion;
- dependenceMethodRef;
- multipleTestingFamilyId;
- researchStreamId;
- selectionPipelineHash;
- costFillabilityContractHash.

Missing required fields fail closed.

## TI-1002 — completed-session daily profile

Applies by default to:
- D03-01;
- D03-02;
- D03-03;
- D03-06;
- D03-07;
- D03-08.

Clock:
`signalKnownAt = AFTER_REQUIRED_SESSION_FINALIZATION`.

Execution:
`FIRST_EXECUTABLE_EVENT_AFTER_SIGNAL_KNOWN_AT`.

Same-close execution is forbidden when the final close/high/low completes the factor.

Legal offsets:
- latest legally completed state;
- preregistered older eligible-session states.

Illegal offsets:
- any future state relative to the decision cutoff except quarantined leakage sentinels.

## TI-1003 — D03-09 ADX uses completed-session timing plus state certification

D03-09 inherits completed-session timing but is not ready merely because the current daily bar is final.

Additional gate:
`ADX_STATE_CERTIFICATION = FULL_REPLAY_OR_TRUSTED_PRIOR_STATE`.

If the exact canonical Wilder state cannot be certified:
`WARMUP_OR_REPLAY_BLOCKED`.

A later chart-rendered ADX value cannot be backfilled as though it was certified at the historical decision.

## TI-1004 — D03-10 Bollinger uses completed-session timing plus exact-window continuity

D03-10 inherits completed-session timing with:
`EXACT_20_ELIGIBLE_SESSION_CONTINUITY`.

Required:
- exact close window;
- formula version;
- continuity state;
- no pseudo/non-session bars;
- source semantics.

A current numeric band value without the exact eligible window is not promotion-grade timing evidence.

## TI-1005 — D03-04 is not a predictor timing profile

D03-04 is the post-decision momentum-continuation outcome relation.

Machine state:
`OUTCOME_RELATION_NOT_SIGNAL`.

It cannot emit:
- signalKnownAt for ranking;
- executionClock;
- independent evidence vote.

Its future horizon belongs to the outcome contract, not to predictor timing.

## TI-1006 — D03-05 causal pullback/reversal uses episode confirmation time

D03-05 uses its causal episode clock.

Required:
`signalKnownAt = CONFIRMATION_CLOCK`.

A seed/pullback extremum before confirmation is historical geometry, not an actionable completed signal unless a separate provisional hypothesis is preregistered.

Execution begins after the confirmation is observable.

## TI-1007 — D03-12 divergence uses firstObservableAt

For D03-12:
`signalKnownAt = max(pivot confirmations, indicator availability, continuity/parent receipts)`.

Explicitly forbidden:
`signalKnownAt = pivotAt`.

The movement from pivotAt to confirmation remains confirmation-lag cost and cannot be credited to post-signal performance.

## TI-1008 — D03-13 uses latest required component finality

For Weekly/Daily/M15 interaction:
`signalKnownAt = MAX_OF_REQUIRED_COMPONENT_KNOWN_AT`.

Weekly:
calendar-aware completed/partial semantics.

Daily:
PROVISIONAL and CONFIRMED are separate timing versions.

M15:
bar completion + source knowledge time.

Current zero-extra-call M15 closing-slot gap remains unobserved and cannot be silently filled from daily final close.

## TI-1009 — provisional and final states never share one factor version silently

Any factor that supports both:
- provisional/live state; and
- finalized state

must distinguish versions.

A final value cannot overwrite the historical provisional state.

Required fields:
- finalityState;
- factorVersion;
- firstObservableAt;
- sourceVersion;
- parent receipt.

## TI-1010 — offset-family identity is factor-family specific

Canonical timing families:

`OF_DAILY_COMPLETED_NONFUTURE_V0_1`
for completed daily factor states.

`OF_EPISODE_CONFIRMED_NONFUTURE_V0_1`
for pullback/reversal and confirmed episodic states.

`OF_DIVERGENCE_CONFIRMED_NONFUTURE_V0_1`
for divergence.

`OF_MULTITIMEFRAME_FINALITY_NONFUTURE_V0_1`
for D03-13.

`OF_OUTCOME_RELATION_NOT_APPLICABLE_V0_1`
for D03-04.

Future offsets remain sentinel-only.

## TI-1011 — offset families do not create new factor independence

Multiple legal stale offsets of the same factor:
- remain the same factor lineage;
- remain the same redundancy family;
- enter timing-search multiplicity;
- cannot increase effective independent evidence count.

A stable stale-lag curve can support robustness but does not create extra votes.

## TI-1012 — ancestry baseline is mandatory for every predictive timing receipt

The receipt does not claim timing incrementality without its strongest ancestry controls.

At minimum, depending on family:
- direct return;
- price/trend;
- D01 price geometry;
- D04 volatility/range;
- D18 regime;
- D02 price/participation decomposition where applicable.

Missing ancestry baseline:
`ANCESTRY_BASELINE_UNBOUND`.

## TI-1013 — common support is a receipt identity, not a later reporting choice

Every timing receipt binds one commonSupportHash.

Observed factor, legal lag comparators, ancestry baseline and outcome comparison use the same parent population unless a different estimand was preregistered.

Consumer-side filtering after receipt creation cannot silently change common support.

## TI-1014 — purge/embargo and dependence are required even when timing is valid

PIT-valid timing does not imply valid inference.

Required:
- purgeEmbargoRuleVersion;
- dependenceMethodRef;
- scan-date/common-shock handling;
- overlapping-outcome handling.

Missing any of these:
`INFERENCE_BINDING_INCOMPLETE`.

## TI-1015 — multiplicity and research stream travel with the receipt

Every timing hypothesis binds:
- multipleTestingFamilyId;
- researchStreamId;
- selectionPipelineHash.

Changing lag family, horizon family, provisional/final version or timing representation after outcome access cannot reset these identities without explicit new-family governance.

## TI-1016 — execution timing is separate from feature timing

The receipt exposes:
- signalKnownAt;
- decisionCutoff;
- executionEligibleAt.

A factor may be validly known but not immediately executable because of:
- market close;
- suspension;
- price-limit state;
- next-session timing;
- liquidity/fillability constraint.

No consumer may replace executionEligibleAt with signal reference time.

## TI-1017 — cost/fillability binding is mandatory for tradable claims

Any receipt used for a trading-performance claim binds costFillabilityContractHash.

If the factor is known only after a close:
- same-close fill is rejected;
- the research execution price begins at the first legal executable event.

If no tradable outcome is claimed, the receipt may use a declared NON_TRADING_DIAGNOSTIC cost scope.

## TI-1018 — consumer scope prevents clock reuse across systems

The same factor timing receipt cannot be reused blindly if:
- System 1 consumes completed daily states;
- System 2 consumes a provisional live state;
- a research experiment consumes confirmed close only.

consumerScopeHash binds the exact consumption semantics.

Consumer scope mismatch:
`CONSUMER_SCOPE_MISMATCH`.

## TI-1019 — D03-04 consumer use is explicitly blocked

Because D03-04 is an outcome relation:
- System 1 ranking use = forbidden;
- System 2 resonance vote use = forbidden;
- D16 outcome-analysis use = allowed under the frozen experiment contract.

This closes a subtle path where a future outcome relation could accidentally be exposed as a factor.

## TI-1020 — structural causality remains false by default

Every timing receipt contains:
`structuralCausalityClaimAllowed = false`.

A timing receipt may become:
`predictivePrecedenceEligible = true`
only after timing/inference gates.

Neither state changes Formal Core.

## TI-1021 — allowed terminal states

Allowed:
- TIMING_RECEIPT_READY;
- OUTCOME_RELATION_NOT_SIGNAL;
- SIGNAL_CLOCK_UNCERTIFIED;
- FINALITY_BLOCKED;
- CONTINUITY_BLOCKED;
- WARMUP_OR_REPLAY_BLOCKED;
- ANCESTRY_BASELINE_UNBOUND;
- COMMON_SUPPORT_INSUFFICIENT;
- INFERENCE_BINDING_INCOMPLETE;
- MULTIPLICITY_UNBOUND;
- COST_FILLABILITY_UNBOUND;
- CONSUMER_SCOPE_MISMATCH;
- FUTURE_OFFSET_FORBIDDEN;
- VERSION_INCOMPATIBLE.

A blocking state is a valid scientific/machine result.

## TI-1022 — current decision

Frozen:
`D03_FACTOR_TIMING_RECEIPT = CONSUMER_READY_FACTOR_SPECIFIC_FAIL_CLOSED`.

No factor receives a predictive or independent evidence upgrade from this mapping.

No outcomes opened.
No Formal behavior changed.
D03 remains 56.7%.

## Exact next continuation point

1. Freeze machine registry/schema for all 12 active modules.
2. Add deterministic adversarial fixture validating factor-specific profiles and consumer restrictions.
3. Execute the fixture against exact canonical blobs and store a receipt if execution infrastructure is available.
4. Then deepen the timing lane into two-run temporal-noninterference and lag-memory/aggregation falsification.
