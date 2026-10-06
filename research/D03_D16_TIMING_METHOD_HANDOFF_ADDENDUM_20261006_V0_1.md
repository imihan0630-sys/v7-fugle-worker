# D03 -> D16 Timing / Lead-Lag Method Handoff Addendum V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: D03
Method owner: D16 / Room11
Parent: TI-749~1074
Status: RESEARCH_ONLY / METHOD_HANDOFF_FROZEN / OUTCOMES_CLOSED
Formal Core: LOCKED

## Purpose

Extend the D03->D16 method handoff with timing, temporal-noninterference and lag-memory requirements without dictating one universal statistical model.

## TI-1075 — D03 owns timing semantics; D16 owns inference

D03 freezes:
- factor-known clock;
- decision cutoff;
- execution clock;
- legal/forbidden offset families;
- ancestry controls;
- common-support semantics;
- temporal-noninterference tests;
- memory/aggregation confounds;
- causal-language boundary.

D16 owns:
- regression/conditional-independence model;
- lag-profile estimator;
- studentization;
- block/cluster/HAC/bootstrap method;
- filtered/state-space method where needed;
- uncertainty for peak/interval/plateau;
- multiplicity/selective inference.

## TI-1076 — timing method receipt binds exact factor timing profile

Required identity:
- timingMethodReceiptVersion;
- factorId/factorVersion;
- timingProfileId/version;
- factorTimingReceiptHash;
- lineageRegistryHash;
- signalKnownAtRule;
- decisionCutoffRule;
- executionClockRule;
- legalOffsetFamilyId;
- endpointFamilyId;
- targetPopulationHash;
- commonSupportHash;
- consumerScopeHash.

Any factor/profile mismatch:
`VERSION_INCOMPATIBLE`.

## TI-1077 — method receipt binds temporal-noninterference evidence

Required:
- temporalNoninterferenceContractVersion;
- registeredPerturbationFamilySetHash;
- latestTwoRunValidationReceiptHash;
- unresolvedLeakageState;
- futureSentinelPolicy.

If a known leakage channel is unresolved:
`TEMPORAL_NONINTERFERENCE_BLOCKED`.

D16 may not statistically "adjust away" a proven future dependency.

## TI-1078 — lag-memory fields are mandatory for lag interpretation

Required:
- memoryClass;
- memoryKernelOrReplayVersion;
- rawRootControlHash;
- lagCandidateSetHash;
- temporalAggregationVersion;
- lagCorrelationDiagnostics;
- outcomeFootprintOverlapDiagnostics.

A lag peak without memory/aggregation disposition cannot be METHOD_READY for exact-delay interpretation.

## TI-1079 — lag-profile target is preregistered

D16 freezes before target outcomes:
- lag grid;
- horizon grid;
- primary timing estimand;
- point-vs-interval-vs-profile inference;
- neighbor-lag comparison;
- boundary-peak policy;
- plateau policy;
- max-statistic/multiplicity method.

No lag-range extension because the observed peak lands on the boundary.

## TI-1080 — same-close and overlapping-interval outcomes are rejected at method intake

If the feature uses the close that also appears inside the proposed tradable outcome interval:
`CONTEMPORANEOUS_ONLY`
or
`COST_OR_FILLABILITY_INVALIDATES`.

D16 does not rescue it by robust standard errors.

Timing identification precedes standard-error choice.

## TI-1081 — D03-04 remains outcome relation only

D16 may analyze D03-04 as a future outcome relation.

It may not return a predictor-ready timing receipt for D03-04.

Required terminal:
`OUTCOME_RELATION_NOT_SIGNAL`
for predictor consumption.

## TI-1082 — ADX method receipt must carry state certification

D03-09 requires:
- canonical factor version;
- FULL_REPLAY/trusted-state status;
- temporal aggregation version;
- memory-confound diagnostics.

If state certification is absent:
`WARMUP_OR_REPLAY_BLOCKED`.

## TI-1083 — Bollinger method receipt carries exact continuity and raw-root controls

D03-10 requires:
- exact 20 eligible-session continuity;
- direct price-vs-SMA / return control;
- volatility control;
- lag-overlap diagnostics.

If an apparent lag effect disappears under those controls:
`RAW_ROOT_EXPLAINS_EFFECT`.

## TI-1084 — divergence method receipt begins at firstObservableAt

D03-12 method receipt binds:
- pivot identities/versions;
- confirmation clocks;
- base-indicator version;
- confirmation-lag cost.

No inference starting at pivotAt is accepted.

## TI-1085 — multi-timeframe method receipt binds component finality and aggregation

D03-13 receipt binds:
- Weekly/Daily/M15 component versions;
- latest component known-at;
- calendar version;
- current M15 coverage state;
- provisional/final separation;
- aggregation model.

Generic direction inference on asynchronously finalized components is blocked.

## TI-1086 — future leads are method sentinels only

D16 may evaluate forbidden future offsets only in a dedicated leakage audit.

They:
- cannot enter candidate selection;
- cannot set thresholds;
- cannot become a baseline that changes factor tuning;
- cannot be described as tradable upper bounds.

Any consumer path exposure:
`FUTURE_OFFSET_FORBIDDEN`.

## TI-1087 — bidirectional predictive dependence does not create a causal claim

If forward and reverse legal histories both add predictive information:
`BIDIRECTIONAL_PREDICTIVE_DEPENDENCE`.

D16 may quantify directionality but structural causality stays false by default.

## TI-1088 — time-reversal use is assumption-bound

If D16 uses time-reversal:
receipt states:
- model/process class;
- stationarity/dependence assumptions;
- reversal construction;
- direction statistic;
- inference method;
- sensitivity limitations.

No generic "time-reversal passed => causal" state exists.

## TI-1089 — filtered/downsampled methods must declare representation compatibility

For smoothed or multi-timeframe indicators:
D16 declares whether its direction/lag method is valid for:
- filtering;
- downsampling;
- moving-average components;
- nonlinear state transforms.

If not established:
`FILTER_DIRECTIONALITY_SENSITIVE`
or
`TEMPORAL_AGGREGATION_CONFOUND`.

## TI-1090 — valid blocking terminal states are scientific results

Allowed:
- TIMING_METHOD_READY;
- OUTCOME_RELATION_NOT_SIGNAL;
- CONTEMPORANEOUS_ONLY;
- TEMPORAL_NONINTERFERENCE_BLOCKED;
- SIGNAL_CLOCK_UNCERTIFIED;
- FINALITY_BLOCKED;
- WARMUP_OR_REPLAY_BLOCKED;
- COMMON_SUPPORT_INSUFFICIENT;
- DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE;
- LAG_MEMORY_CONFOUND_UNRESOLVED;
- TEMPORAL_AGGREGATION_CONFOUND;
- LAG_PEAK_UNIDENTIFIED;
- BOUNDARY_PEAK_SEARCH_INCOMPLETE;
- RAW_ROOT_EXPLAINS_EFFECT;
- FILTER_DIRECTIONALITY_SENSITIVE;
- SUPPORT_THIN_AT_LAG;
- COST_OR_FILLABILITY_INVALIDATES;
- VERSION_INCOMPATIBLE.

D03 must not redesign formulas merely to convert a valid block into READY.

## TI-1091 — METHOD_READY still does not equal predictive evidence

`TIMING_METHOD_READY` means:
- timing semantics are admissible;
- D16 method is ready for permitted outcome evaluation when all higher-level gates open.

It does not mean:
- predictive incrementality proven;
- lag peak real;
- alpha proven;
- third evidence unit granted;
- production authorization.

## TI-1092 — method receipt binds search genealogy and SDA-016

Required:
- multipleTestingFamilyId;
- researchStreamId;
- selectionPipelineHash;
- SDA-016 consumption ref;
- holdout identity;
- lag/horizon candidate-set hash.

Timing research cannot create a new budget outside existing search/holdout governance.

## TI-1093 — structural-causality field is always explicit

Required:
`structuralCausalityClaimAllowed = false`
for current D03 timing methods.

If a future project seeks structural causal identification, it requires a separate governance contract and cannot inherit D03 timing PASS automatically.

## TI-1094 — current handoff state

Frozen:
`D03_D16_TIMING_METHOD_HANDOFF = READY_FOR_METHOD_RECEIPT_NOT_OUTCOME_EXECUTION`.

Current blockers remain:
- D16 D03 method receipt not yet returned;
- raw source gate 2/3;
- System1 diagnostic schema implementation pending;
- System2 runtime dedup diagnostics missing;
- protected PR #600 owner-gated;
- D03 outcomes CLOSED.

No maturity promotion.
Formal Core remains LOCKED.

## Exact next continuation point

1. Freeze machine timing-method receipt schema and deterministic acceptance fixture.
2. Run only method/contract tests; do not open economic outcomes.
3. Re-read external System1/System2/D16 lanes after writeback.
4. Any actual D03 maturity increase requires genuine prospective/raw-source or external machine evidence.
