# D01 DL-017 — PATTERN-RG2 Lifecycle Transition Event Contract V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / EVENT_IDENTITY_FROZEN / RUNTIME_NO_GO / FORMAL_CORE_LOCKED

## 1. Purpose

RG2 snapshots describe current state. Event research requires a different object.

A state can persist for many dates:
HOLDING_ABOVE on five daily snapshots is one continuing state, not five independent "hold events".

Freeze a first-transition event layer without inspecting any return, MFE, MAE or later trading result.

## 2. State snapshot != transition event

Snapshot:
what the RG2 relation looks like at one parent/as-of.

Transition event:
the first causal occurrence of one frozen lifecycle change under the same relationEpisodeKey and immutable boundary versions.

Repeated snapshots never create repeated first-transition events.

## 3. Event clocks are three separate clocks

eventOccurredAt:
the eligible symbol-session/date on which the structural transition occurred.

eventAvailableAt:
the earliest timestamp at which the finalized causal evidence was legitimately usable.

firstObservedAt:
the first prospective observer capture that actually froze the event.

createdAt:
storage time, if persistence is ever implemented later.

None are interchangeable.

A source event can have occurred earlier than it was first prospectively captured.
That does not authorize historical evidence fabrication.

## 4. First-transition taxonomy v0.1

Structural events:
- LOCAL_BREAK_CONFIRMED;
- FIRST_PARENT_ZONE_ENTRY_CLOSE;
- PARENT_BREAK_CONFIRMED;
- FIRST_POST_BREAK_OUTSIDE_CLOSE;
- PARENT_REENTRY;
- PARENT_FAILURE;
- PARENT_RECLAIM.

Observability event:
- FIRST_ORDINARY_OBSERVABLE_AFTER_CONSTRAINED_BREAK.

FIRST_POST_BREAK_OUTSIDE_CLOSE means:
the first later eligible ordinarily observable session after PARENT_BREAK_CONFIRMED whose close remains beyond the parent zone.

It is NOT:
- an N-bar acceptance threshold;
- proof of demand;
- proof of profitability;
- a BUY signal.

## 5. Exact first clocks required from canonical lifecycle history

Required causal clock bundle:
- localFirstBreakAt;
- firstParentZoneEntryAt;
- parentFirstBreakAt;
- parentFirstOrdinaryObservableAt;
- parentFirstPostBreakOutsideCloseAt;
- parentFirstReentryAt;
- parentFirstFailureAt;
- parentFirstReclaimAt.

The RG2 current-state calculator does not invent these clocks from today's state.

Clock authority must come from a prefix-invariant canonical lifecycle/path object over verified eligible symbol sessions in TECHNICAL_CONTINUITY.

## 6. Current observability gap

RG2 v0.2 / shared-child v0.4 preserve current geometry/lifecycle state but do not yet freeze all first-transition clocks above.

Therefore:
TRANSITION_EVENT_ANALYSIS = DESIGN_READY / PROSPECTIVE_CLOCK_CAPTURE_BLOCKED.

Current state cannot be reverse-engineered into a certified first event date.

## 7. Path-completeness guard

To certify a "first" event clock:
- symbol-session path must be complete through the event;
- TECHNICAL_CONTINUITY must be valid;
- no eligible intermediate session may be silently missing;
- boundary ID/version/coordinates must remain immutable.

Allowed clock certification:
- CERTIFIED_FIRST_CLOCK;
- UNCERTIFIED_PATH_GAP;
- DATA_BLOCKED_SESSION_UNKNOWN;
- DATA_BLOCKED_CONTINUITY_UNKNOWN;
- PROVENANCE_CONFLICT;
- NOT_OCCURRED_AS_OF.

If an eligible session could be missing:
do not call the first observed surviving record the true first event.

## 8. Causal ordering invariants

For an UP parent-zone lifecycle:

localFirstBreakAt may occur before, on, or after a parent-zone entry depending on geometry, but any claimed FIRST_PARENT_ZONE_ENTRY_CLOSE must be on/after localFirstBreakAt.

parentFirstPostBreakOutsideCloseAt must be strictly after parentFirstBreakAt.

parentFirstReentryAt must be after parentFirstBreakAt.

parentFirstFailureAt must be on/after parentFirstReentryAt because failure is a deeper subtype of return through the zone; they may occur on the same bar.

parentFirstReclaimAt must be after first reentry/failure.

parentFirstOrdinaryObservableAt must be on/after parentFirstBreakAt and gates ordinary post-break interpretation after a constrained break.

No future event may appear in an earlier as-of prefix.

## 9. Event identity excludes the event date

Frozen event key:

relationEpisodeKey
+ transitionContractVersion
+ eventType
+ eventOrdinal.

v0.1 eventOrdinal is always 1.

eventOccurredAt is deliberately NOT in the key.

Why:
if the same event identity later changes its first clock under the same immutable relation, that must become PROVENANCE_CONFLICT rather than silently generating a second event ID.

A new boundary version creates a new relationEpisodeKey and therefore a new lifecycle/event lineage.

## 10. Source-event-group de-dup

Different semantic labels can arise from the same source close/bar.

Freeze sourceEventGroupKey from:
relationEpisodeKey + source-observation family + eventOccurredAt.

Examples:
- LOCAL_BREAK_CONFIRMED and PARENT_BREAK_CONFIRMED can share one source group if the same finalized close crosses both immutable boundaries.
- PARENT_FAILURE is also a severe PARENT_REENTRY when the same close traverses the full zone; both labels may be stored, but they share one sourceEventGroupKey.
- FIRST_ORDINARY_OBSERVABLE_AFTER_CONSTRAINED_BREAK and FIRST_POST_BREAK_OUTSIDE_CLOSE can share one source observation.

Therefore:
named transition label count != independent source-event count.

Every event record carries:
independentEventVoteEligible = false.

## 11. Failure is nested inside reentry

PARENT_REENTRY:
first post-break close inside or through the zone.

PARENT_FAILURE:
first post-break close beyond the adverse edge of the full zone.

A direct close from above the zone to below the lower edge can set:
parentFirstReentryAt == parentFirstFailureAt.

This is one bar / one source event group with two severity semantics.

Never count it as two independent confirmations.

## 12. Reclaim does not erase failure/reentry

After PARENT_REENTRY or PARENT_FAILURE, a later close above the same immutable parent boundary can create PARENT_RECLAIM.

The first reentry/failure clocks remain immutable.

Reclaim is a later event, not a rewrite of the earlier event.

Second and later reentry/reclaim cycles are descriptive sequence data only in v0.1.
They do not create promotion-grade independent N without a new preregistered experiment.

## 13. Price-limit constrained breaks

A price-limit-constrained PARENT_BREAK_CONFIRMED remains a real structural break clock.

But ordinary acceptance/hold interpretation remains unresolved until:
FIRST_ORDINARY_OBSERVABLE_AFTER_CONSTRAINED_BREAK.

Constrained eligible sessions preserve chronology but do not manufacture ordinary hold/reentry/failure evidence.

## 14. Decision-time vs future-event firewall

An event occurring after parent decisionCutoffAt must NOT be written back into that parent's decision-time Pattern child.

Example:
10/01 parent is ABOVE / no failure.
10/05 PARENT_FAILURE occurs.

Correct:
- 10/01 child remains unchanged;
- append a 10/05 transition event when first prospectively observed;
- a later outcome analysis may join that event as a future structural outcome for 10/01 under its own outcome contract.

Incorrect:
retroactively update the 10/01 child with firstFailureAt=10/05.

This is future leakage.

## 15. Append-only event ledger semantics

If runtime persistence is ever approved later:
- transition events are append-only;
- same event key + same immutable payload = idempotent;
- same event key + changed first clock/boundary fingerprint = PROVENANCE_CONFLICT;
- later source revision creates new source-quality/revision lineage, never UPDATE of the old first-known event.

No historical event ledger may be fabricated from current full history and relabeled prospective.

## 16. Event-study sample identity

One first transition type per relationEpisodeKey in v0.1.

Repeated daily snapshots after the event:
do not increase event count.

PARENT_REENTRY + PARENT_FAILURE on the same sourceEventGroupKey:
two semantic labels, one source-event group.

Event-study inference later must still respect:
- scanDate/common market shocks;
- symbol dependence;
- relationEpisode dependence;
- overlapping forward windows.

DL-015/D16 governance remains authoritative.

## 17. Shared-child v0.5 design requirement

Decision-time Pattern child should preserve only clocks causally known as of that parent:
- lifecycleClockContractVersion;
- lifecyclePathCompletenessState;
- localFirstBreakAt;
- firstParentZoneEntryAt;
- parentFirstBreakAt;
- parentFirstOrdinaryObservableAt;
- parentFirstPostBreakOutsideCloseAt;
- parentFirstReentryAt;
- parentFirstFailureAt;
- parentFirstReclaimAt.

Future clocks remain null/NOT_OCCURRED_AS_OF in earlier prefixes.

This is prospective schema design only, not runtime authorization.

## 18. Current status

RG2_TRANSITION_EVENT_IDENTITY = FROZEN_V0_1.
FIRST_CLOCK_CAUSALITY = FROZEN_V0_1.
SOURCE_EVENT_GROUP_DEDUP = FROZEN_V0_1.
FUTURE_EVENT_BACKFILL = PROHIBITED.
REPEATED_CYCLE_ALPHA = NOT_REGISTERED.
PROSPECTIVE_CLOCK_CAPTURE = BLOCKED_NOT_IMPLEMENTED.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 19. Exact next continuation

1. Obtain/define one canonical lifecycle clock-bundle producer rather than reconstructing clocks independently inside RG2.
2. Add prospective clock fields only through a future shared Pattern child implementation proposal after runtime prerequisites clear.
3. Hand D16 event-study identity/source-group de-dup rules before any structural-event outcome analysis.
4. Do not create an N-bar acceptance rule.
5. Do not inspect outcomes or change Formal Core.
