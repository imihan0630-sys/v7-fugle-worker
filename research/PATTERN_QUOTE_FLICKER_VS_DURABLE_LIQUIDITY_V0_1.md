# D01 DL-054 — Persistent Structural Rejection vs Quote Flicker / Cancel-Repost Cycling V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / QUOTE_PERSISTENCE_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-053 separated structural rejection from generic queue/depth refill.

DL-054 asks a stricter microstructure question:

> When displayed depth repeatedly appears near a frozen structural zone, is it economically durable passive liquidity, or fleeting quote activity produced by rapid cancellation / reposting?

Repeated snapshots can make liquidity look persistent even when individual orders are short-lived.

No return outcome is opened in this tranche.

## 2. Evidence context

Modern limit-order-book evidence documents:
- high cancellation rates;
- fleeting orders / flickering quotes;
- rapid submit-cancel-repost cycles;
- queue-position and adverse-selection driven order revisions;
- raw book imbalance contamination from transient displayed liquidity.

Therefore:
DISPLAYED_DEPTH_REPEATEDLY_VISIBLE != DURABLE_LIQUIDITY.

A quote can repeatedly reappear without representing a persistent executable commitment.

## 3. Owner boundaries

D05 owns:
- order / quote event clock;
- additions, cancellations and executions where observable;
- displayed-depth persistence;
- quote lifetime;
- cancellation / repost semantics;
- queue-position and event completeness;
- hidden-liquidity caveats.

D01 owns:
- frozen structural zone;
- structural opportunity;
- relation between owner-certified quote persistence and zone geometry;
- structural-memory vs transient-display interpretation.

D01 does not invent a cancellation estimator from OHLCV or sparse depth snapshots.

## 4. Three different persistence concepts

### P0 — SNAPSHOT_PRESENCE

Depth is visible in one or more snapshots.

This is the weakest state.

### P1 — EVENT_STREAM_DISPLAY_PERSISTENCE

Owner-certified event stream shows displayed liquidity remains present across a defined event/time interval.

This is stronger than repeated snapshots.

### P2 — ECONOMIC_SURVIVAL_THROUGH_PRESSURE

Displayed liquidity remains / replenishes under actual opposing marketable flow or owner-certified pressure.

This is different from merely sitting untouched.

DL-054 preserves these separately.

## 5. Cancel-repost cycling

A price level can show apparently stable aggregate depth while underlying orders:
- cancel;
- move;
- re-enter;
- refresh priority;
- fragment;
- rotate across participants.

Define descriptive state:
CANCEL_REPOST_CYCLING_CANDIDATE

only when owner-certified event data can identify sufficient cancellation / new-order activity.

Do not infer participant identity or intent.

## 6. Quote flicker

FLEETING_DISPLAY_CANDIDATE requires owner-grade quote lifetime / event evidence.

No universal foreign-market millisecond threshold is imported into Taiwan.

D01 freezes no:
- 1 ms;
- 10 ms;
- 50 ms;
- 100 ms;
- N-event
flicker cutoff.

Any persistence horizon belongs to D05 methodology / future preregistration.

## 7. Sparse snapshot firewall

If only periodic best-five snapshots are available:

Allowed:
- displayedDepthObserved;
- snapshotDepthChange;
- snapshotPresenceFraction;
- snapshotDeltaPressureProxy if D05 permits.

Prohibited:
- true cancellation count;
- true repost count;
- individual quote lifetime;
- queue survival;
- cancel-repost cycling;
- flicker classification.

State:
QUOTE_PERSISTENCE_IDENTIFIABILITY_BLOCKED.

## 8. Durable liquidity is not the same as size

Two levels can show the same mean depth:

A. large displayed size repeatedly canceled/reposted;
B. smaller displayed size that survives incoming pressure.

The second can be more economically durable despite lower snapshot depth.

Therefore no scalar "depth strength" score is frozen.

## 9. Survival under pressure

Preferred future mechanism test:

At a valid structural opportunity, distinguish:
- depth present but untested;
- depth consumed quickly;
- depth survives opposing pressure;
- depth repeatedly cancels before pressure;
- depth replenishes only after depletion;
- unknown event semantics.

Do not call untested displayed depth "absorptive."

## 10. Structural-zone localization

Owner-certified persistence / cancellation activity may be localized relative to the frozen zone:
- eventPrice;
- zoneDistance;
- insideZone;
- side relative to orientation.

Spatial localization is descriptive only.

No proximity threshold is allowed to establish structural memory.

## 11. Generic flicker / persistence comparator

Primary falsification:

G0 GENERIC_PERSISTENCE_PROFILE
- matched market/session/tick/liquidity context at salient non-structural locations.

G1 ZONE_PERSISTENCE_PROFILE
- comparable context at the structural zone.

If G1 is not distinguishable from G0, generic liquidity mechanics are sufficient.

## 12. Timing firewall

Mandatory clocks:
- predictorFreezeAt;
- firstDisplayedAt;
- lastDisplayedAt;
- firstCancellationAt;
- repostObservedAt;
- firstOpposingPressureAt;
- survivalAssessmentAt;
- structuralOpportunityAt.

Only information known by predictorFreezeAt may enter baseline.

Quote lifetime / survival observed later is post-treatment mechanism evidence.

## 13. Cancellation is not spoofing

Rapid cancellation can reflect:
- adverse-selection avoidance;
- queue-position optimization;
- inventory / risk management;
- information updates;
- latency competition;
- benign price discovery;
- manipulative activity.

Chart / public order-book data alone do not identify intent.

Labels such as SPOOFING_CONFIRMED are prohibited without appropriate external authority / evidence.

## 14. Same aggregate depth, different event lineage

Aggregate depth snapshots can hide turnover.

Future owner receipts should, where possible, separate:
- surviving displayed quantity;
- newly added quantity;
- canceled quantity;
- executed quantity;
- unknown/unattributed changes.

D01 consumes these receipts; it does not reconstruct them.

## 15. Future mechanism states

L0 SNAPSHOT_ONLY_UNKNOWN_PERSISTENCE
L1 PERSISTENT_UNTESTED_DISPLAY
L2 PRESSURE_SURVIVING_LIQUIDITY_CANDIDATE
L3 CANCEL_REPOST_CYCLING_CANDIDATE
L4 FLEETING_DISPLAY_CANDIDATE
L5 DEPLETION_REFILL_CANDIDATE
L6 EVENT_CLOCK_NOT_EVALUABLE

None is a BUY/SELL state.

## 16. Future D16 ladder

R0 RAW_ZONE_RESPONSE
R1 DL052_SHOCK_CONTROLLED
R2 DL053_REFILL_CONTROLLED
R3 SNAPSHOT_SIZE_CONTROLLED
R4 QUOTE_PERSISTENCE_CONTROLLED
R5 CANCEL_REPOST_TURNOVER_CONTROLLED
R6 PRESSURE_SURVIVAL_CONTROLLED
R7 GENERIC_LOCATION_COMPARATOR_CONTROLLED
R8 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE
R9 MULTI_DATE_TICK_TIER_REPLICATION

Interpretations:
Q0 SNAPSHOT_DEPTH_ILLUSION
Q1 GENERIC_QUOTE_PERSISTENCE
Q2 FLICKER_CANCEL_REPOST_EXPLANATION
Q3 PRESSURE_SURVIVAL_ASSOCIATION
Q4 STRUCTURAL_REJECTION_RESIDUAL
Q5 QUOTE_PERSISTENCE_NOT_IDENTIFIABLE
Q6 NOT_EVALUABLE

## 17. Common support

Future comparison must overlap in:
- session / auction state;
- relative tick / price tier;
- spread;
- baseline depth;
- transaction intensity;
- volatility/liquidity regime;
- shock state;
- opportunity direction;
- quote-event coverage quality.

No extrapolation outside support.

## 18. SDA-001 / sample identity

One structural opportunity remains one parent.

Multiple observations of:
- depth;
- persistence;
- cancellations;
- reposts;
- replenishment
do not create independent confirmation votes.

effectiveIndependentEvidenceCount remains 1 by default.

## 19. SDA-002 / no-lookahead

A later-observed quote lifetime or pressure-survival result cannot be inserted into the pre-opportunity signal.

If persistence is only knowable after the opportunity:
timingRole = POST_TREATMENT_MECHANISM.

## 20. Required manifest fields

Per opportunity:
- parentDecisionId;
- structuralRootId;
- structuralVersionId;
- frozenBoundaryLower/Upper;
- orientation;
- structuralOpportunityAt;
- predictorFreezeAt;
- d05EventClockValidity;
- sourceMode;
- snapshotPresenceReceipt;
- firstDisplayedAt;
- lastDisplayedAt;
- cancellationReceipt;
- firstCancellationAt;
- repostReceipt;
- repostObservedAt;
- pressureReceipt;
- firstOpposingPressureAt;
- survivalReceipt;
- survivalAssessmentAt;
- eventPrice;
- zoneDistance;
- sessionState;
- relativeTick;
- priceTier;
- replaySafe;
- timingRole;
- manifestVersion/hash.

No future return / bounce outcome belongs in this manifest.

## 21. Current decision

REPEATED_SNAPSHOT_DEPTH_EQUALS_DURABLE_LIQUIDITY =
FALSE.

QUOTE_SIZE_EQUALS_QUOTE_PERSISTENCE =
FALSE.

RAPID_CANCELLATION_EQUALS_SPOOFING =
FALSE.

UNTESTED_DEPTH_EQUALS_ABSORPTION =
FALSE.

SPARSE_SNAPSHOT_CAN_IDENTIFY_CANCEL_REPOST =
FALSE.

POST_OPPORTUNITY_SURVIVAL_AS_BASELINE =
PROHIBITED.

D05_OWNER_EVENT_RECEIPT_REQUIRED =
TRUE.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 22. Exact next continuation

1. Build deterministic event-clock / persistence / cancel-repost identifiability guards and adversarial tests.
2. Preserve snapshot presence, event-stream persistence and pressure survival as distinct evidence grades.
3. Reject flicker / cancel-repost labels under sparse snapshot-only data.
4. Hand R0-R9 / Q0-Q6 mechanism-separation inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate genuine pressure-surviving liquidity from price-level migration of the displayed queue (liquidity follows price instead of defending a fixed structural boundary).
7. No runtime wiring / no Formal change.
