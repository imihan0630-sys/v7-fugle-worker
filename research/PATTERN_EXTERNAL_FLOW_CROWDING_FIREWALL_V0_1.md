# D01 DL-059 — Structural Rejection vs Correlated External Order Flow / Crowding / Co-Impact V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / EXTERNAL_FLOW_CROWDING_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-057 separated structural response from own-order market impact.
DL-058 separated structural response from information content of the initiating order.

DL-059 freezes the next falsification:

> Same-direction follow-through near a structural zone may be driven by correlated external order flow, institutional crowding, common-factor flow, passive-basket flow, mechanical hedging or cross-impact rather than by the zone itself.

No return outcome is opened in this tranche.

## 2. Evidence context

Research on institutional metaorders and order-flow formation shows:
- metaorders from different investors can be correlated;
- simultaneous same-direction flow can create crowding and co-impact;
- order-flow imbalances can amplify price movements;
- correlated flow can make observed price impact appear more persistent;
- price/order-flow cross-impact can propagate across assets.

These findings are mechanism evidence only.
They do not prove that any Taiwan structural event is crowded.

## 3. Owner boundaries

D02 owns:
- volume-origin taxonomy;
- leverage crowding;
- passive basket flow;
- mechanical hedge flow;
- discretionary directional flow;
- common-factor flow;
- attribution-confidence semantics.

D05 owns:
- event-level order flow;
- trade pressure;
- microstructure timing;
- order-book / transaction clocks;
- market impact and liquidity receipts.

D03 owns trend/momentum semantics where relevant.

D01 owns only:
- whether structural-zone interpretation survives owner-certified external-flow/crowding context.

D01 does not reconstruct crowding from OHLCV.

## 4. External-flow identity

Separate:
A. INITIATING_ORDER_FLOW
B. EXTERNAL_SAME_SYMBOL_FLOW
C. COMMON_FACTOR_OR_BASKET_FLOW
D. CROSS_ASSET_FLOW

The initiating order is not the same object as external market flow.

But distinct objects do not automatically imply statistically independent evidence.

## 5. Frozen crowding / flow context states

Owner-certified states may be mapped into:

F0 EXTERNAL_FLOW_UNKNOWN
F1 SAME_SYMBOL_DIRECTIONAL_FLOW_PRESENT
F2 SAME_SYMBOL_OPPOSING_FLOW_PRESENT
F3 MULTI_PARTICIPANT_CROWDING_PRESENT
F4 PASSIVE_BASKET_FLOW_PRESENT
F5 MECHANICAL_HEDGE_FLOW_PRESENT
F6 LEVERAGE_CROWDING_PRESENT
F7 COMMON_FACTOR_FLOW_PRESENT
F8 CROSS_ASSET_COIMPACT_CONTEXT_PRESENT
F9 MIXED_OR_CONFLICTING_FLOW
F10 FLOW_DATA_BLOCKED

These are context states, not D01 alpha signals.

## 6. No OHLC inference shortcut

Prohibited:
- strong candle = crowded buying;
- high volume = institutional crowding;
- repeated breakout = correlated metaorders;
- synchronized stocks = passive flow;
- large intraday move = cross-impact.

Such labels require owner-grade receipts.

## 7. Timing firewall

For every external-flow receipt preserve:
- firstObservableAt;
- knownAt;
- flowWindowStart;
- flowWindowEnd;
- predictorFreezeAt;
- sourceVersion;
- replaySafe.

If knownAt > predictorFreezeAt:
POST_HOC_EXTERNAL_FLOW_NOT_BASELINE_ELIGIBLE.

Future flow after the structural opportunity cannot be backfilled into baseline context.

## 8. Baseline external flow vs post-opportunity flow

### Baseline-eligible
Only flow state causally known by predictor freeze.

### Post-opportunity
Flow occurring after structural opportunity/predictor freeze may be:
- mediator;
- co-movement mechanism;
- outcome-side amplification.

It is not a baseline confounder automatically.

## 9. Same-symbol external-flow comparator

Primary comparison:

G0 EXTERNAL_FLOW_EVENT_AWAY_FROM_ZONE
- similar external flow/crowding state;
- comparable symbol/liquidity/regime;
- no target structural-zone interaction.

G1 EXTERNAL_FLOW_EVENT_AT_ZONE
- comparable external flow state at the structural zone.

If G1 adds no residual representation:
generic external flow/crowding is sufficient.

## 10. Zone events with different flow states

Complementary comparison:

Z0 ZONE_EVENT_FLOW_UNKNOWN_OR_ABSENT_RECEIPT
Z1 ZONE_EVENT_EXTERNAL_FLOW_PRESENT
Z2 ZONE_EVENT_MIXED_OR_OPPOSING_FLOW

No receipt != no actual flow.
UNKNOWN remains UNKNOWN.

## 11. Crowding vs participation

High total market volume does not prove crowding.

Crowding requires evidence of:
- concentration;
- correlated same-direction participation;
- participant/category overlap;
- persistence;
- or owner-defined leverage/passive/mechanical state.

D01 defines no universal concentration threshold.

## 12. Common-factor flow

A stock can move with:
- sector basket;
- index rebalance;
- ETF creation/redemption;
- broad foreign flow;
- market-wide risk-on/off.

If broad/common flow explains the same-direction move:
STRUCTURAL_SPECIFICITY_WEAKENS.

D01 consumes D02/D13/D18 owner receipts rather than rebuilding a factor model.

## 13. Passive basket / mechanical hedge

Passive or hedge flow can create predictable directional demand/supply without discretionary structural interpretation.

Store:
- flowType;
- event identity;
- effectiveAt;
- knownAt;
- expected direction if owner-certified;
- affected basket/universe;
- confidence level.

Do not infer hedge/passive cause from timing coincidence alone.

## 14. Cross-impact

Order flow in related assets can move the target asset.

Examples:
- index futures / constituent equities;
- ETF / constituents;
- sector leaders / followers;
- related share classes;
- derivatives / underlying where owner-certified.

D01 does not define cross-impact coefficients.

D16/D05/D13 owners may supply cross-impact context later.

## 15. Co-impact and crowding

If multiple independent investors execute same-direction metaorders concurrently, total observed price movement is not attributable to one trader or one structural zone.

Required future fields where available:
- concurrentFlowCount;
- sameDirectionFlowShare;
- participantConcentration;
- externalNetFlow;
- externalGrossFlow;
- flowPersistence;
- crowdingOwnerState.

Missing participant identity:
CROWDING_IDENTITY_UNKNOWN.

## 16. Correlated flow can mimic persistence

Price continuation after the first order can arise because:
- many traders share the same signal;
- one institution splits a metaorder;
- multiple institutions herd;
- passive baskets execute;
- hedging continues;
- common information drives order flow.

Therefore persistent follow-through != structural memory.

## 17. Information-root caution

External flow can be a distinct information root candidate.

But if it is itself derived from the same PRICE_OHLC signal or same systematic rule:
the apparent distinct source may still be dependent.

Default:
INDEPENDENT_EVIDENCE_NOT_VALIDATED.

D16 owns residual/dependence validation.

## 18. Opportunity denominator

Preserve:
- zone opportunities with external flow unknown;
- same-direction flow;
- opposing flow;
- mixed flow;
- passive flow;
- hedge flow;
- leverage crowding;
- common-factor flow;
- co-impact context;
- data blocked.

Do not analyze only crowded winners.

## 19. Future D16 ladder

C0 RAW_ZONE_RESPONSE
C1 DL057_OWN_IMPACT_CONTROLLED
C2 DL058_INITIATING_INFORMATION_CONTROLLED
C3 SAME_SYMBOL_EXTERNAL_FLOW_CONTROLLED
C4 MULTI_PARTICIPANT_CROWDING_CONTROLLED
C5 PASSIVE_HEDGE_LEVERAGE_FLOW_CONTROLLED
C6 COMMON_FACTOR_FLOW_CONTROLLED
C7 CROSS_ASSET_COIMPACT_CONTROLLED
C8 GENERIC_EXTERNAL_FLOW_COMPARATOR_CONTROLLED
C9 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE
C10 MULTI_DATE_MULTI_SYMBOL_MULTI_FLOW_REGIME

Interpretation:

Q0 SAME_SYMBOL_FLOW_EXPLANATION
Q1 CROWDING_EXPLANATION
Q2 PASSIVE_OR_HEDGE_FLOW_EXPLANATION
Q3 COMMON_FACTOR_FLOW_EXPLANATION
Q4 CROSS_IMPACT_EXPLANATION
Q5 MIXED_FLOW_NOT_IDENTIFIED
Q6 STRUCTURAL_REJECTION_RESIDUAL
Q7 FLOW_STATUS_UNKNOWN
Q8 NOT_EVALUABLE

None authorizes Formal alpha.

## 20. SDA-001 / SDA-002

SDA-001 remains open:
external-flow receipts, D01 geometry, D02 volume origin and D03 momentum may share correlated information.
No automatic multi-vote.

SDA-002 remains open:
flow receipts require firstObservableAt / knownAt / predictorFreezeAt / replaySafe.
Later crowding state cannot rewrite earlier predictors.

## 21. Required manifest fields

- parentDecisionId;
- structuralRootId;
- structuralVersionId;
- symbol;
- structuralOpportunityAt;
- predictorFreezeAt;
- externalFlowState;
- flowType;
- flowFirstObservableAt;
- flowKnownAt;
- flowWindowStart;
- flowWindowEnd;
- sameDirectionFlowState;
- participantConcentrationState;
- crowdingOwnerState;
- passiveFlowState;
- hedgeFlowState;
- leverageCrowdingState;
- commonFactorFlowState;
- crossImpactContextState;
- ownerDomain;
- attributionConfidence;
- replaySafe;
- independentEvidenceStatus;
- dataBlockReason;
- manifestVersion/hash.

No future return field belongs in this manifest.

## 22. Current decision

HIGH_VOLUME_EQUALS_CROWDING =
FALSE.

SAME_DIRECTION_FOLLOW_THROUGH_EQUALS_STRUCTURAL_MEMORY =
FALSE.

EXTERNAL_FLOW_RECEIPT_EQUALS_INDEPENDENT_EVIDENCE =
FALSE.

UNKNOWN_FLOW_EQUALS_NO_FLOW =
FALSE.

POST_OPPORTUNITY_FLOW_IS_BASELINE =
FALSE.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 23. Exact next continuation

1. Build deterministic external-flow eligibility / timing / crowding-context helper and adversarial tests.
2. Preserve initiating order, external same-symbol flow, common-factor flow and cross-asset flow separately.
3. Consume D02/D05 owner taxonomy rather than invent duplicate crowding labels.
4. Hand C0-C10 / Q0-Q8 external-flow residual inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate structural rejection from cross-sectional leader/follower propagation and sector/index synchronization so apparent zone response is not just common price discovery.
7. No runtime wiring / no Formal change.
