# System 2 Corporate-Action Continuity Archive Core V0.1

Status: RESEARCH_ONLY / REPOSITORY_CORE
Updated: 2026-10-03 Asia/Taipei
System 1 Formal Core: LOCKED

## Purpose

This core is the next S2-07 step after official TWSE / TPEx continuity-source transport and exact-range identity were physically verified.

It implements the archive semantics from the existing shared corporate-action research without yet changing the isolated System2 D1 schema or performing a continuity transform.

## What V0.1 freezes

### Immutable source captures

Each source capture preserves:
- source ID and URL;
- exchange and action family;
- source class;
- fetchedAt;
- payload hash;
- parser version;
- source status;
- record count;
- requested historical range;
- response-range verification state.

Capture IDs are content-addressed and old captures are never rewritten.

### Immutable event versions

Each event version preserves:
- exchange / symbol / action family;
- stable eventKey supplied by the source-specific parser;
- event stage;
- effective date;
- ACTIVE or CANCELLED state;
- continuity-effect payload and verification state;
- source capture / payload / row hashes;
- supersedesVersionId;
- actual-result verification;
- readiness reasons.

Corrections and cancellations append a new version. They never overwrite prior truth.

### Knowledge-time semantics

Three explicit modes exist:

1. PROSPECTIVE_OBSERVED
   - firstKnownAt = first System2 observation time;
   - availableAt = the same observed time;
   - class = OBSERVED_AVAILABLE_UPPER_BOUND.

2. VERIFIED_SOURCE_TIMESTAMP
   - requires an independently verified source timestamp;
   - firstKnownAt / availableAt remain explicit.

3. HISTORICAL_UNKNOWN
   - firstKnownAt = null;
   - availableAt = null;
   - historical first-known time is not fabricated;
   - event-signal PIT replay is disabled.

Historical actual-result rows may still be usable as technical-continuity evidence when their effective date and continuity effect are separately verified. This is not permission to use later-known event information as an earlier trading signal.

### Revision / duplicate / cancellation handling

Reconciliation:
- preserves every immutable observation;
- collapses semantically identical repeat observations only for current-state interpretation;
- requires revisions/cancellations to reference the superseded event version;
- fails closed on invalid supersession;
- fails closed when multiple distinct terminal states remain.

### Completeness and NO_EVENT firewall

NO_EVENT is allowed only when:
- the point-in-time universe coverage is complete;
- every required historical actual-result source contract covers the exact requested range;
- the parser is complete;
- revision coverage is complete;
- no source dates are missing;
- a zero-row response is used only when that source's empty-range semantics are separately certified;
- event-version reconciliation is unambiguous.

Otherwise the symbol state is EVENT_COVERAGE_UNKNOWN.

A symbol outside the PIT universe is OUT_OF_SCOPE, not NO_EVENT.

### Suspension / session boundary

The core records exchange-level suspension coverage separately.

Even when event coverage is complete, it exposes only:

symbolSessionCompletenessEvidenceReady

It does not set:

symbolSessionCompletenessCertified

because certification must still bind verified suspension/resumption evidence to expected symbol sessions.

## Hard authority firewall

V0.1 always leaves these false:
- symbolSessionCompletenessCertified;
- technicalContinuityCertified;
- continuityTransformPerformed;
- historyMutationPerformed;
- strategyEvaluationPerformed;
- capacityRunProduced;
- zeroPickClaimed;
- selectionAuthority;
- finalSelectionEnabled;
- livePushEnabled;
- capitalImpact;
- orderImpact;
- system1RuntimeUsed.

## Storage decision

No D1 migration is introduced in V0.1.

Reason:
the current schema has no semantically correct corporate-action raw/event-version table. Reusing infrastructure checks or strategy event theses would blur evidence meaning. A future physical persistence lane should be introduced only after source-specific parsers and the exact immutable record contract are proven.

## Next engineering gates

1. Build source-specific parsers for the six physically verified historical actual-result lanes.
2. Prove field mapping and stable eventKey construction from real TWSE / TPEx payloads.
3. Determine verified-empty semantics per endpoint before any zero-event certification.
4. Add suspension/resumption source capability and exchange-complete coverage.
5. Design isolated append-only persistence from the proven record contract.
6. Bind the archive to RAW A1 history without mutating RAW bars.
7. Only then evaluate symbol-session completeness and technical-continuity promotion.

No assessor, strategy ranking, capacity run, live push, capital or order path is authorized by this core.
