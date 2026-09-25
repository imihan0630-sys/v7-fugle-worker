# Corporate Action Registry Validation Specification

Updated: 2026-09-25 Asia/Taipei
Status: RESEARCH_ONLY / DETERMINISTIC_VALIDATION
Formal Core: LOCKED

## Purpose

Define deterministic gates for corporate-action registry records before any technical-feature or RS Shadow use.

A record is never trusted merely because it exists.

## 1. Schema validity

Required:
- schemaVersion supported;
- actionFamilyId non-empty;
- eventKey unique;
- symbol is a valid 4-digit Taiwan common-stock symbol for this pilot;
- eventStage/actionType non-empty;
- eventVersion non-empty;
- effectiveDate valid YYYY-MM-DD;
- sourceQuality/factorQuality/firstKnownQuality non-empty;
- readiness object present;
- sourceUrls array present;
- unknownReasons array present.

Reject duplicate eventKey.

## 2. Version/vintage validity

For every event version:
- firstKnownAt, when present, must be <= finalScheduleKnownAt when finalScheduleKnownAt exists;
- finalScheduleKnownAt must be <= effectiveDate for a schedule to be considered ex-ante final;
- supersedes entries must have knownAt <= finalScheduleKnownAt;
- a historical replay may select only the latest version whose knownAt/firstKnownAt <= decision timestamp;
- a later correction must never overwrite an earlier version in historical replay.

If only a date is known:
- it is sufficient for a later-date after-market decision;
- it is NOT sufficient to prove same-day intraday availability.

## 3. Window relevance

Given historyStartDate and targetDate, an event is relevant only if:

historyStartDate < effectiveDate <= targetDate.

Events:
- <= historyStartDate: no bar in the supplied window crosses the event; do not transform;
- > targetDate: future event; exclude from technical/RS history.

Future-known events may belong to Event Risk, not this transformation.

## 4. Price-factor validity by mode

Required return modes:
- TECHNICAL_CONTINUITY;
- PRICE_INDEX_COMPARABLE;
- TOTAL_RETURN_COMPARABLE.

For every relevant price-reset event:
- the requested mode factor must exist and be > 0;
- do not substitute a factor from another mode;
- factors must have source/provenance;
- factor must not be selected from later price outcomes.

Special cases:
- ordinary cash dividend: Technical and Total-Return factor may differ from Price-Index factor;
- mixed cash+stock/right events require explicit mode-specific factor derivation;
- factor=1 is allowed only when explicitly justified by event semantics, not as missing-data default.

## 5. Reference provenance

Do not collapse these fields:
- previousRawClose;
- economicAdjustmentReference;
- exchangeOpeningReference;
- providerAdjustedAnchor;
- dailyChangeReference.

If two sources disagree:
- preserve both;
- record referenceConflictReasons;
- choose a factor only for the use whose semantics are supported.

Missing exchangeOpeningReference does not block Technical Price readiness when economic factor is verified, but blocks claims about opening-gap/price-limit reference.

## 6. Volume-transform validity

Allowed:
- NONE;
- UNIT_SCALE;
- SUPPLY_CHANGE;
- UNKNOWN.

UNIT_SCALE:
- shareUnitFactor must exist and be > 0;
- pre-event share volume may be converted to current-window units by the verified factor.

NONE:
- raw share-volume unit remains comparable for this event stage.

SUPPLY_CHANGE:
- do NOT mechanically rescale old daily trading volume;
- rolling volume comparability is incomplete until point-in-time listed shares/float/turnover denominator is available if the supply event falls inside the volume feature window.

UNKNOWN:
- Technical Volume readiness = false.

## 7. Lifecycle consistency

A single economic action can have multiple records.

Examples:
- stock dividend: EX_RIGHT_PRICE_EVENT then NEW_SHARES_LISTED;
- cash capital increase: EX_RIGHT_PRICE_EVENT then NEW_SHARES_LISTED;
- capital reduction/par-value change: unit conversion/resumed trading may be one effective event if price and share units change simultaneously.

Do not merge lifecycle stages solely because actionFamilyId matches.

## 8. Readiness derivation

SCHEMA_VALID:
all structural checks pass.

POINT_IN_TIME_READY:
the event/version used for the target decision was known by the decision time, with no later revision backfilled.

TECHNICAL_PRICE_READY:
every relevant price-reset event has a verified technicalPriceFactor.

TECHNICAL_VOLUME_READY:
every relevant event has:
- NONE; or
- valid UNIT_SCALE;
and no unresolved SUPPLY_CHANGE crosses the volume comparison window.

PRICE_RS_READY:
all relevant priceIndexComparableFactor values are verified and official TAIEX Price Index endpoints are exact-date complete.

TOTAL_RS_READY:
all relevant totalReturnComparableFactor values are verified and official TAIEX Total Return endpoints are exact-date complete.

INFERENCE_READY:
all dimensions required by the research question pass AND the sampled denominator/universe is demonstrably complete.

Convenience-selected registry samples can never be INFERENCE_READY.

## 9. Cross-field sanity checks

When previousRawClose and economicAdjustmentReference exist:
technicalPriceFactor should agree with economicAdjustmentReference / previousRawClose within declared rounding tolerance unless a documented formula says otherwise.

For UNIT_SCALE:
shareUnitFactor must match the verified unit conversion, not merely the economic share-supply increase.

For price-only lifecycle events:
volumeTransformMode must not be UNIT_SCALE unless actual tradable units convert on that effective date.

## 10. Fail-closed research semantics

Invalid/missing:
- stays UNKNOWN;
- never becomes 0;
- never becomes factor 1 by default;
- never becomes NO_EVENT;
- never becomes NO_IMPACT.

Validation failures must be surfaced in coverage manifests.

## 11. Formal boundary

This specification is Research/Shadow only.

It does not:
- change historical bars used by Formal;
- change A/B checks;
- change RS;
- change ranking;
- change capital or monitoring;
- deploy a runtime collector.

Any future Formal technical-history correction remains Class B proposal-first.
Any future RS/benchmark definition change requires separate explicit owner decision.
