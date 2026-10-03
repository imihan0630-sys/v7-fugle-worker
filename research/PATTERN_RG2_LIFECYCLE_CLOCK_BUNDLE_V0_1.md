# D01 DL-018 — PATTERN-RG2 Canonical Lifecycle Clock Bundle V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / CANONICAL_CONSUMER_CONTRACT_FROZEN / UPSTREAM_RECEIPT_EXTENSION_REQUIRED / RUNTIME_NO_GO / FORMAL_CORE_LOCKED

## 1. Purpose

DL-017 froze first-transition event identity but deliberately did not authorize RG2 to reconstruct first clocks from current state.

DL-018 freezes one canonical clock-bundle consumer/adapter.

Principle:
RG2 does NOT implement a second breakout/reentry/failure engine.

It reuses the existing shared research lifecycle engine:
research/pattern_breakout_lifecycle_v0_1.mjs

and only adds RG2-specific relation clocks that the generic boundary engine does not own.

## 2. Canonical ownership

Shared breakout lifecycle engine owns:
- parentFirstBreakAt;
- constrained-break observability progression;
- parentFirstReentryAt;
- parentFirstFailureAt;
- parentFirstReclaimAt.

RG2 thin adapter owns only:
- firstParentZoneEntryAt after localFirstBreakAt;
- parentFirstPostBreakOutsideCloseAt;
- mapping into the DL-017 canonical clock-bundle field names.

Corporate Actions / symbol-session lane owns:
- expected eligible symbol-session set;
- verified suspensions/non-trading exclusions;
- TECHNICAL_CONTINUITY bars;
- continuity/session receipt lineage.

RG2 must not fork any of these.

## 3. Exact eligible-session set, not count only

A certified "first event" requires proving there is no silently missing eligible session before the claimed event.

Count equality is insufficient.

Example:
expected dates = A,B,C,D,E
observed dates = A,B,C,D,F

Both counts are 5 but E is missing and F is foreign.

Therefore promotion-grade clock bundle requires:
- expectedEligibleSessionDateSetHash;
- continuityBarDateSetHash;
- equality of the two hashes;
- zero duplicate dates;
- zero unresolved missing sessions;
- exact sessionCalendarVersion / symbolSessionContractVersion.

The hash domain/canonicalization belongs to the upstream shared continuity/session contract.

D01 only requires it as a consumer invariant.

## 4. Current upstream status

The existing Technical Indicator continuity handoff already freezes the semantic rule:
ELIGIBLE_RAW_AND_CONTINUITY_DATE_SETS_MUST_MATCH.

It also requires zero unresolved missing sessions.

However its current machine-readable v0.1 contract does not expose explicit:
- expectedEligibleSessionDateSetHash;
- continuityBarDateSetHash.

Therefore:
UPSTREAM_CONTINUITY_SEMANTICS = COMPATIBLE.
PROMOTION_GRADE_DATE_SET_RECEIPT = EXTENSION_REQUIRED.
PATTERN_CLOCK_BUNDLE_RUNTIME = BLOCKED.

This is not a request for D01 to modify the upstream owner.

## 5. Window receipt required by the clock adapter

Required:
- continuityReceiptId;
- symbolSessionContractVersion;
- sessionCalendarVersion;
- continuityEngineVersion;
- continuitySpace = TECHNICAL_CONTINUITY;
- expectedEligibleSessionDates or a certified equivalent set commitment;
- expectedEligibleSessionDateSetHash;
- continuityBarDateSetHash;
- unresolvedMissingSessions = 0;
- sourceBarsThrough <= asOf;
- relevant corporate-action continuity resolved.

Research helper fixtures may carry explicit date arrays so exact equality can be falsified without runtime storage.

## 6. Bar admission

For every bar used by the lifecycle clock bundle:
- date belongs to expected eligible symbol-session set;
- symbolSessionVerified = true;
- technicalContinuityVerified = true;
- corporateActionContinuityResolved = true;
- OHLC is internally valid.

A pseudo-bar for a verified suspension/non-session:
must not enter the eligible set.

A market-open date with unknown symbol trading/suspension provenance:
DATA_BLOCKED, not zero/no-event.

## 7. Parent clock derivation

The adapter calls the canonical breakout lifecycle for the immutable MAJOR parent zone.

For UP resistance:

parentFirstBreakAt =
canonical firstConfirmedBreakAt.

parentFirstOrdinaryObservableAt =
- parentFirstBreakAt when the break bar is ordinarily observable/unconstrained;
- canonical firstObservableAfterConstrainedBreakAt when the break was constrained;
- null while unresolved.

parentFirstReentryAt =
canonical firstReentryAt.

parentFirstFailureAt =
canonical firstFailureAt.

parentFirstReclaimAt =
canonical firstReclaimAt.

No state is reconstructed from future bars because the lifecycle engine is called with asOfDate.

## 8. firstParentZoneEntryAt

RG2-specific close-based relation clock.

Search causally from localFirstBreakAt through asOf over certified eligible TECHNICAL_CONTINUITY bars.

First bar whose Close is inside [parentLower,parentUpper] freezes:
firstParentZoneEntryAt.

If price jumps directly from below the zone to a close above parentUpper:
there is no close-based zone-entry event before the parent break.

Do not invent an "entry" from intrabar crossing unless a separately preregistered intrabar event contract exists.

## 9. parentFirstPostBreakOutsideCloseAt

This replaces loose language such as "first hold".

Definition:
the first eligible, ordinarily observable, unconstrained session STRICTLY AFTER parentFirstBreakAt whose close remains above parentUpper, before any first reentry/failure.

This is a persistence observation.

It is NOT:
- accepted breakout;
- two/three/N close confirmation;
- future return proof.

If the first ordinary session after a constrained break reenters/fails:
parentFirstPostBreakOutsideCloseAt remains null.

A later reclaim does not retroactively become the missing first post-break hold.

## 10. Prefix invariance

Given a full future bar array plus asOf=t:
the produced clock bundle must equal the bundle from the true prefix ending at t.

Future reentry/failure/reclaim:
cannot populate earlier t clocks.

The adapter must pass through the canonical lifecycle's boundary version and as-of guards.

## 11. Boundary lineage

Clock bundle identity binds:
- relationEpisodeKey;
- localBoundaryId/version;
- parentZoneId/version;
- structuralIdentityFingerprint;
- semantic space;
- lifecycleClockProducerVersion;
- continuity/session receipt lineage.

Same relation/boundary version with changed coordinates:
PROVENANCE_CONFLICT.

New parentZoneVersion:
new relation lineage / new clock bundle.

## 12. Constrained session handling

Price-limit-constrained eligible bars remain chronological observations.

A constrained parent break:
preserves parentFirstBreakAt.

Ordinary post-break interpretation waits until an eligible unconstrained bar.

Constrained sessions do not create:
parentFirstPostBreakOutsideCloseAt,
ordinary reentry/failure interpretation,
unless the canonical shared lifecycle explicitly permits that state under its frozen contract.

## 13. Clock-bundle output

Required output fields:
- lifecycleClockContractVersion;
- relationEpisodeKey;
- asOf;
- sourceBarsThrough;
- expectedEligibleSessionDateSetHash;
- continuityBarDateSetHash;
- localFirstBreakAt;
- firstParentZoneEntryAt;
- parentFirstBreakAt;
- parentFirstOrdinaryObservableAt;
- parentFirstPostBreakOutsideCloseAt;
- parentFirstReentryAt;
- parentFirstFailureAt;
- parentFirstReclaimAt;
- lifecyclePathCompletenessState;
- continuityReceiptId;
- sessionCalendarVersion;
- symbolSessionContractVersion;
- continuityEngineVersion.

No outcome fields.

## 14. Hash implementation boundary

The isolated research helper may compute deterministic SHA-256 date-set hashes for synthetic QA.

That does NOT define the production upstream hash algorithm.

The upstream session/continuity owner must freeze its canonical hash domain/version before Class-B wiring.

Pattern may consume the certified upstream commitments once available.

## 15. Current decision

CANONICAL_LIFECYCLE_ENGINE_REUSE = REQUIRED.
RG2_SECOND_FAILURE_ENGINE = REJECTED.
COUNT_ONLY_SESSION_COMPLETENESS = REJECTED.
EXACT_DATE_SET_COMMITMENT = REQUIRED_FOR_PROMOTION_GRADE_CLOCKS.
CURRENT_UPSTREAM_DATE_SET_HASH_FIELDS = NOT_EXPOSED.
CLOCK_BUNDLE = RESEARCH_EXECUTABLE_DESIGN / RUNTIME_BLOCKED.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 16. Exact next continuation

1. Run the isolated clock-bundle fixtures only when a reproducible Node execution path is available; authored tests alone are not PASS.
2. Hand the exact date-set commitment requirement to the shared continuity/session owner; do not fork that owner in D01.
3. Hand the canonical clock bundle to D16 before structural-event outcome research.
4. Keep runtime wiring blocked until upstream exact set commitments and immutable parent/Pattern ROOT persistence are real.
5. No N-bar acceptance rule / no R09 / no Formal change.
