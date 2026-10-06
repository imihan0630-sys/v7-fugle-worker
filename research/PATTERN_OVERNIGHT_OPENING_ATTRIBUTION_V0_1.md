# D01 DL-063 — Prior-Day Structural Memory vs Overnight Information / Opening-Gap Price Discovery V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / OVERNIGHT_OPENING_ATTRIBUTION_FIREWALL / SDA_001_SDA_002_OPEN / FORMAL_CORE_LOCKED

## 1. Purpose

DL-062 separated continuous-session structural state from opening/closing auction mechanics.

DL-063 asks:

> When the next session opens at, inside, or beyond a prior-day support/resistance zone, is that evidence that the old structure was tested, or did overnight information and opening price discovery simply relocate the price process before continuous trading began?

A gap can skip the zone without a continuous tradable path through it.

No outcome is opened in this tranche.

## 2. Canonical owner boundaries

D01 consumes and does not redefine:

### D01-09
Gap / limit-state pattern semantics.

### D05-06
Opening trial / opening call auction mechanics.

### D11-10
Overnight-gap event risk and corporate-action firewall.

### D12-10
Night-futures / overnight derivative context.

### D13 owner family
Prior U.S./global/FX/rates/commodity context and session alignment.

### D17-02 / D17-12 / D17-13
Event first-known clock, post-event gap path, scheduled-vs-unscheduled event taxonomy.

### D04-09
Tail / gap volatility context.

Missing owner evidence remains UNKNOWN.

## 3. Structural carry-forward identity

A prior-day structure may carry into the next session only if it was replay-safe before the prior session ended.

Required:
- structuralRootId;
- structuralVersionId;
- priorSessionDate;
- priorStructureConfirmedAt;
- priorStructureStateAtClose;
- frozenBoundaryLower;
- frozenBoundaryUpper;
- semanticSpace;
- continuity receipt.

The next session cannot retroactively create yesterday's structure.

## 4. Overnight information window

Freeze an explicit interval:

OVERNIGHT_START =
prior regular-session close / final auction boundary.

OVERNIGHT_END =
current-session predictor freeze before opening opportunity.

Possible owner-sourced context:
- after-hours / overnight issuer event;
- scheduled macro release;
- unscheduled news;
- U.S./global market move;
- sector/global peer move;
- USD/TWD / rates / commodity move;
- Taiwan night-futures move;
- corporate action / reference-price change;
- no certified event;
- context unknown.

No D01-owned synthetic "overnight score" is defined.

## 5. Corporate-action firewall

A raw prior-close to current-open price gap can be mechanical.

If:
- ex-dividend;
- ex-right;
- split;
- capital reduction;
- face-value change;
- other canonical reference-price adjustment

is unresolved:

OVERNIGHT_GAP_DATA_BLOCKED.

All structural and gap prices must use the canonical TECHNICAL_CONTINUITY space where applicable.

Do not interpret a mechanical reference-price change as support/resistance failure.

## 6. Opening-gap topology

Relative to the frozen prior-day zone:

G0 NO_MATERIAL_OPEN_GAP_CONTEXT
G1 GAP_INTO_ZONE
G2 GAP_FROM_BELOW_TO_ABOVE_ZONE
G3 GAP_FROM_ABOVE_TO_BELOW_ZONE
G4 GAP_AWAY_FROM_ZONE_SAME_SIDE
G5 OPEN_INSIDE_ZONE
G6 OPEN_AT_BOUNDARY
G7 GAP_PATH_UNKNOWN
G8 CORPORATE_ACTION_BLOCKED

The states are geometry/context labels, not alpha.

## 7. Gap-through is not a continuous retest

If prior continuous/final price was below resistance and opening call price is above the entire resistance zone:

GAP_FROM_BELOW_TO_ABOVE_ZONE.

There was no observed continuous-session price path through the zone during the overnight closure.

Likewise for support skipped downward.

Therefore:

GAP_THROUGH_EQUALS_INTRADAY_RETEST =
FALSE.

A gap-through may be:
- overnight information repricing;
- opening auction price discovery;
- derivative/global lead;
- event shock;
- liquidity discontinuity.

The prior structure may still be relevant as a reference level, but the opening move is not an ordinary continuous retest.

## 8. First tradable opportunity after open

Separate:

O0 OPEN_AUCTION_ONLY
O1 FIRST_CONTINUOUS_BAR_APPROACH
O2 FIRST_CONTINUOUS_RETEST_AFTER_GAP
O3 NO_CONTINUOUS_RETEST
O4 CONTINUOUS_RECLAIM_AFTER_GAP
O5 LIMIT_OR_AUCTION_CONSTRAINED
O6 OPPORTUNITY_UNKNOWN

A proper continuous structural-response study should freeze the first eligible continuous opportunity after opening, not use the opening call print automatically.

## 9. Opening print is price-discovery outcome

The opening auction aggregates information accumulated during the overnight non-trading interval.

Therefore:

OPENING_PRICE =
PRICE_DISCOVERY_OUTCOME_CONTEXT.

It is not automatically:
PRIOR_STRUCTURE_RESPONSE.

If the opening print itself creates the relevant D01 state, the same print cannot be used as its own predictor.

## 10. Opening-trial data boundary

Follow D05-06:

- actual pre-open trial/indicative state may be used only if prospectively observed and replay-safe;
- missing historical trial trajectory remains UNKNOWN;
- final opening price cannot reconstruct the historical pre-open indicative path.

OPEN_PRICE_CAN_BACKFILL_PREOPEN_TRIAL =
FALSE.

## 11. Overnight event clocks

Every event/context receipt requires:

knownAt <= predictorFreezeAt.

Publication date alone is insufficient when intraday release time is unknown.

If only a date is known:
- follow the owner module's conservative availability rule;
- do not backdate into the overnight window.

Later-found news may not be used to explain an earlier opening ex ante.

## 12. Night-futures / global-lead context

D12-10 and D13 may provide:
- Taiwan night-futures move;
- U.S. broad-market move;
- U.S. semiconductor/technology move;
- FX/rates/commodity state;
- session-aligned global shock.

These are context families.

They do not automatically become independent confirmation votes.

Different markets can share the same initiating information.

## 13. Prior-day-close contamination

DL-062 showed the official close can contain auction pressure.

Therefore the prior-day structural state should preserve:
- last continuous price;
- final auction price;
- official close;
- whether prior-day structure confirmation existed before the close auction;
- prior close auction/passive context if available.

A structure confirmed only by yesterday's closing auction is not equivalent to one established in continuous trading.

## 14. Gap size descriptors

Allowed descriptive geometry:
- rawGapPrice;
- gapPct;
- gapAtr;
- gapTicks;
- distanceFromPriorZoneAtOpen;
- zoneSkippedCompletely boolean;
- openingSide;
- priorSide.

No fixed "large gap" threshold is defined by D01.

Continuous descriptors remain continuous unless D16 preregisters bins.

## 15. Overnight information vs structural memory comparator

Primary future comparison:

C0 SAME_OVERNIGHT_CONTEXT_AWAY_FROM_PRIOR_ZONE
C1 SAME_OVERNIGHT_CONTEXT_AT_OR_THROUGH_PRIOR_ZONE

If C1 adds no residual representation:
OVERNIGHT_INFORMATION_SUFFICIENT.

Complementary comparison:

S0 PRIOR_ZONE_WITH_LOW_CERTIFIED_OVERNIGHT_SHOCK
S1 PRIOR_ZONE_WITH_CERTIFIED_OVERNIGHT_SHOCK
S2 PRIOR_ZONE_OVERNIGHT_CONTEXT_UNKNOWN

No group is alpha by itself.

## 16. Gap-through vs continuous-cross comparator

A strong falsifier compares:

T0 GAP_THROUGH_WITHOUT_CONTINUOUS_CROSS
T1 CONTINUOUS_CROSS_OR_RETEST_AFTER_OPEN
T2 OPEN_GAP_THEN_CONTINUOUS_RECLAIM
T3 OPEN_GAP_THEN_NO_RETEST

If apparent structural failure exists mainly in T0:
opening repricing / path discontinuity is a sufficient alternative.

## 17. Limit / tradability constraints

Opening gaps may be constrained by:
- price limits;
- delayed open;
- VI / special auction state;
- absent liquidity;
- no executable path.

Preserve owner receipts.

Do not infer a fill at the prior zone simply because the opening price skipped through it.

## 18. SDA-001 dependence guard

Prior-day structure, gap geometry, opening print, night futures, global index and event-linked price moves may share one initiating information shock.

Different instruments / sessions do not automatically create independent evidence.

Within one causal parent:
effectiveIndependentEvidenceCount = 1 by default
until D16 validates residual/dependence structure.

SDA-001 remains open.

## 19. SDA-002 no-lookahead guard

Required:
- priorStructureConfirmedAt;
- overnightReceiptKnownAt;
- preopenTrialFirstObservedAt;
- openingFinalAt;
- predictorFreezeAt;
- firstContinuousOpportunityAt;
- replaySafe.

Later continuous bars cannot define the opening predictor.
Later-discovered news cannot be backdated.
Opening final cannot backfill pre-open trial state.

SDA-002 remains open.

## 20. Future D16 ladder

O0 RAW_NEXT_OPEN_ZONE_CLASSIFICATION

O1 PRIOR_STRUCTURE_TIMING_CONTROLLED

O2 PRIOR_CLOSE_AUCTION_CONTEXT_CONTROLLED

O3 CORPORATE_ACTION_REFERENCE_PRICE_CONTROLLED

O4 OPENING_AUCTION_PHASE_CONTROLLED

O5 CERTIFIED_OVERNIGHT_EVENT_CONTROLLED

O6 NIGHT_FUTURES_GLOBAL_LEAD_CONTROLLED

O7 GAP_SIZE_AND_DIRECTION_CONTROLLED

O8 GENERIC_OVERNIGHT_COMPARATOR_CONTROLLED

O9 FIRST_CONTINUOUS_OPPORTUNITY_CONTROLLED

O10 GAP_THROUGH_VS_CONTINUOUS_CROSS_CONTROLLED

O11 STRUCTURAL_MEMORY_RESIDUAL_CANDIDATE

O12 PROSPECTIVE_MULTI_DATE_MULTI_EVENT_REPLICATION

## 21. Future interpretations

Q0 CORPORATE_ACTION_ARTIFACT
Q1 OPENING_PRICE_DISCOVERY_EXPLANATION
Q2 OVERNIGHT_EVENT_EXPLANATION
Q3 NIGHT_FUTURES_GLOBAL_LEAD_EXPLANATION
Q4 GAP_PATH_DISCONTINUITY_EXPLANATION
Q5 LIMIT_TRADABILITY_CONSTRAINT_EXPLANATION
Q6 PRIOR_CLOSE_AUCTION_CONTAMINATION
Q7 CONTINUOUS_RETEST_RESIDUAL
Q8 STRUCTURAL_MEMORY_RESIDUAL
Q9 OVERNIGHT_CONTEXT_UNKNOWN
Q10 NOT_EVALUABLE

## 22. Current decision

GAP_THROUGH_EQUALS_INTRADAY_RETEST =
FALSE.

OPENING_PRICE_EQUALS_PRIOR_STRUCTURE_RESPONSE =
FALSE.

OPEN_PRICE_CAN_BACKFILL_PREOPEN_TRIAL =
FALSE.

LATER_NEWS_CAN_EXPLAIN_EARLIER_OPEN_EX_ANTE =
FALSE.

ZONE_SKIPPED_AT_OPEN_IMPLIES_FILL_AT_ZONE =
FALSE.

CORPORATE_ACTION_UNRESOLVED =
DATA_BLOCKED.

DIFFERENT_MARKETS_EQUAL_INDEPENDENT_VOTES =
FALSE.

OUTCOME_JOIN =
CLOSED.

SDA_001_STATUS =
OPEN.

SDA_002_STATUS =
OPEN.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 23. Exact next continuation

1. Build deterministic prior-zone/open-gap topology, owner-clock and first-continuous-opportunity helper plus adversarial tests.
2. Preserve corporate-action blocking and opening-trial UNKNOWN without historical reconstruction.
3. Preserve prior-close auction contamination state from DL-062.
4. Hand O0-O12 / Q0-Q10 inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate prior-zone response from overnight inventory/risk-transfer and opening liquidity imbalance when no public information event is identified.
7. No outcome join / no runtime wiring / no Formal change.
