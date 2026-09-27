# Technical Indicator TECHNICAL_CONTINUITY Handoff V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / CROSS-LANE CONTRACT_FROZEN / RUNTIME_NO_GO
Formal Core: LOCKED

## Purpose

Define the exact handoff that a future Technical Indicator observer must consume from the shared Corporate Actions / symbol-session lane.

The Technical Indicator lane must NOT create:
- its own corporate-action adjustment engine;
- its own suspension calendar;
- its own factor reconstruction;
- a provider-adjusted shortcut relabeled as TECHNICAL_CONTINUITY.

## TI-328 — RAW_HISTORY_ADMISSION and TECHNICAL_CONTINUITY_CERTIFICATION are different gates

V8.12 HISTORY_SOURCE_REVALIDATION materially improves the raw daily-history path:
- explicitly requests adjusted=false daily OHLCV fields;
- checks source/freshness admission;
- requires historyFreshness.usable===true before Formal market-feature construction.

This proves neither:
- corporate-action price continuity;
- point-in-time action-vintage correctness;
- symbol-specific suspension completeness.

Therefore:

RAW_HISTORY_ADMISSION_PASS
!=
TECHNICAL_CONTINUITY_CERTIFIED.

A future Technical Indicator row needs both when its lookback crosses a relevant event boundary.

## TI-329 — Symbol-session denominator

Expected eligible sessions are:

official market sessions
minus
VERIFIED symbol-specific suspension/non-trading sessions.

Rules:
- verified suspension absence is NOT missing-source data;
- an unverified missing symbol bar on a market-open day is UNKNOWN/MISSING, not suspension;
- weekend/holiday is not an eligible session;
- pseudo-bars representing suspension/no-trade are prohibited from indicator input;
- unknown suspension provenance fails closed.

This same symbol-session contract must be shared with Pattern and Price-Volume research.

## TI-330 — Point-in-time event-version rule

For a target decision timestamp T, a continuity transform may use only an event version whose:
- knownAt / firstKnownAt <= T;
- effectiveDate <= targetDate for a transformation crossing the event;
- later corrections do not overwrite what was known at T.

Future effective events:
- are excluded from technical-history transformation;
- may belong to Event Risk;
- cannot alter past indicator history before effective date.

A current provider endpoint exposing future event dates is not sufficient historical PIT evidence by itself.

## TI-331 — Relevant-event window

Given cleanHistoryStartDate and asOfDate:

event is continuity-relevant only when:
cleanHistoryStartDate < effectiveDate <= asOfDate.

For every relevant price-reset event:
- technicalPriceFactor must exist;
- factor > 0;
- factor provenance must be verified;
- event-version must be PIT-valid.

Missing factor:
BLOCKED / UNKNOWN.

factor=1:
allowed only when explicitly supported by event semantics;
never as a missing-data default.

## TI-332 — Preserve residual market gaps

TECHNICAL_CONTINUITY neutralizes the mechanical corporate-action reset.

It must NOT automatically erase all event-day price movement.

Conceptual decomposition:

raw observed discontinuity
=
mechanical reset component
+
residual market price movement.

Only the verified mechanical component is bridged.

Residual non-mechanical gap remains information.

This is required for:
- True Range / ATR / ADX;
- gap/candlestick research;
- overnight/intraday decomposition;
- Pattern continuity.

## TI-333 — Price semantic spaces remain separate

RAW_EXECUTION:
actual traded OHLC; execution/reference prices.

TECHNICAL_CONTINUITY:
PIT continuity OHLC for technical path features.

PRICE_INDEX_COMPARABLE:
price-return comparison semantics.

TOTAL_RETURN_COMPARABLE:
total-return comparison semantics.

Do not:
- use TOTAL_RETURN_COMPARABLE in place of technical continuity;
- use price-index factor as technical factor by convenience;
- compare raw and continuity indicator values as though they were the same observation.

## TI-334 — Continuity handoff receipt identity

Future receipt identity should include:

- symbol;
- asOf;
- cleanHistoryStartDate;
- sourceFamilyVersion;
- sourceHistoryHash;
- rawHistoryAdmissionReceiptId/hash;
- symbolSessionContractVersion;
- sessionCalendarVersion;
- continuityEngineVersion;
- corporateActionRegistryVersion;
- continuitySpace = TECHNICAL_CONTINUITY;
- continuityTransformHash;
- receiptVersion.

Derived immutable:
continuityReceiptId = hash(the complete identity tuple).

Same identity + same semantic hashes:
IDEMPOTENT.

Same identity + changed semantic hash:
PROVENANCE_CONFLICT / NEW_VERSION,
never silent overwrite.

## TI-335 — Receipt coverage accounting

Required counts:

- expectedMarketSessions;
- verifiedSymbolSuspensionSessions;
- expectedEligibleSymbolSessions;
- observedRawBars;
- continuityBars;
- transformedPriceBars;
- unresolvedMissingSessions;
- unresolvedRelevantEvents;
- pseudoBarsRejected;
- priceLimitConstrainedBars.

Invariant:

expectedEligibleSymbolSessions
=
expectedMarketSessions
-
verifiedSymbolSuspensionSessions.

For inference-grade VALID:
- unresolvedMissingSessions = 0;
- unresolvedRelevantEvents = 0;
- pseudoBarsRejected = 0 in the delivered input series;
- observed eligible bar dates and continuity bar dates match exactly.

## TI-336 — Per-event transform provenance

Every relevant transformed event should retain:

- eventKey;
- actionFamilyId;
- eventStage;
- actionType;
- eventVersion;
- firstKnownAt / knownAt;
- effectiveDate;
- technicalPriceFactor;
- factorSource;
- factorQuality;
- reference semantics;
- transformApplied;
- transformRange / bars affected;
- conflictReasons;
- unknownReasons.

The Technical Indicator observer consumes this provenance.
It does not derive a replacement factor.

## TI-337 — Window payload contract

The observer needs a causal window payload:

- bars[] in TECHNICAL_CONTINUITY space;
- each bar has:
  date,
  open/high/low/close,
  observedRawBarIdentity,
  symbolSessionVerified,
  technicalContinuity=true,
  corporateActionContinuityResolved=true,
  priceLimitConstrained,
  sourceBarHash;
- windowReceipt fields from TI-334/335;
- ordered relevantEventReceipts[];
- sourceBarsThrough <= asOf.

For indicator formulas that require Open:
observed/fitted provenance must be explicit.
A Close fallback masquerading as Open is prohibited.

## TI-338 — Memory-class consumption rule

Finite-window indicator:
may consume a certified exact continuity window directly.

Recursive IIR indicator:
must combine:
- certified continuity input;
- canonical replay lineage or replay-certified trusted prior state.

Cumulative indicator:
requires windowed/rebased representation or full recomputation.

Path-state indicator:
requires state-machine replay.

Therefore:
a VALID continuity window is necessary but not sufficient for recursive-state certification.

## TI-339 — Status model

VALID:
- raw admission valid;
- symbol-session coverage complete;
- every relevant event PIT-ready;
- technicalPriceFactor ready;
- continuity transform exact/replayable;
- no unresolved missing session/event.

BLOCKED:
- known hard data/provenance failure.

UNKNOWN:
- required evidence not available.

CONSTRAINED:
- continuity valid but one or more price-limit-constrained sessions are inside the feature window; ordinary interpretation requires separate stratum.

Do not coerce:
UNKNOWN -> VALID,
BLOCKED -> zero,
missing event -> NO_EVENT,
missing factor -> 1.

## TI-340 — Interaction with parent Shadow lineage

Technical evidence attaches only after parent decision-state identity is frozen.

Required link:
- parentDecisionReceiptId;
or
- scanDate + symbol + parentSnapshotHash + captureGeneration.

Technical indicator receipt also stores:
- continuityReceiptId;
- formulaVersion;
- stateLineageId.

Thus a future observation is identified by:
parent decision state
x
continuity history state
x
indicator formula/state lineage.

No separately truncated parent/evidence reader is allowed.

## TI-341 — Runtime readiness

Current facts:
- V8.12 raw-history admission: deployed / materially available.
- Corporate Actions TECHNICAL_CONTINUITY semantics: research spec/prototype ready.
- production shared TECHNICAL_CONTINUITY runtime path: BLOCKED / unapproved.
- symbol-session complete prospective runtime coverage: PARTIAL / not yet certified.
- immutable modern Shadow parent lineage: governance work in progress.

Therefore:
TECHNICAL_INDICATOR_CONTINUITY_HANDOFF = CONTRACT_READY.
PROSPECTIVE_TECHNICAL_OBSERVER_RUNTIME = NO_GO.

This is an infrastructure dependency, not an alpha finding.

## Current status

RAW_HISTORY_ADMISSION = MATERIAL_PASS
TECHNICAL_CONTINUITY_RESEARCH_SEMANTICS = FROZEN_SHARED
TECHNICAL_CONTINUITY_RUNTIME = BLOCKED
SYMBOL_SESSION_RUNTIME_COMPLETENESS = PARTIAL
CONTINUITY_HANDOFF_CONTRACT = FROZEN_V0_1
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Add machine-readable continuity handoff contract.
2. Link the snapshot-v0.2 proposal to continuityReceiptId rather than duplicating event fields.
3. Do not implement another adjustment engine.
4. Do not arm prospective technical capture until the shared Corporate Actions runtime continuity path and exact parent lineage are approved/ready.
5. Isolated formula QA may continue without market outcomes.
6. Formal Core remains unchanged.

## Canonical cross-lane sources

- CORPORATE_ACTION_REGISTRY_VALIDATION_SPEC.md
- CORPORATE_ACTIONS_CAPITAL_SUPPLY_RESEARCH.md
- CORPORATE_ACTIONS_CAPITAL_SUPPLY_CHECKPOINT.md
- research/PATTERN_OBSERVER_PERSISTENCE_V0_1.md
- SHADOW_COHORT_SEMANTICS_CLASS_B_PROPOSAL.md
- V8.12 HISTORY_SOURCE_REVALIDATION implementation/contract
