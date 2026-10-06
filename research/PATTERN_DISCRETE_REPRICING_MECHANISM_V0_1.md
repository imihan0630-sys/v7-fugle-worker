# D01 DL-050 — Ordinary Zone Oscillation vs Discrete Repricing / Microstructure Bounce V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / MECHANISM_SEPARATION_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-043 separated overnight gap, opening auction, immediate post-open and later continuous-session mechanics.
DL-049 separated zone occupancy from directional churn/path disorder.

DL-050 addresses the remaining ambiguity:

> A price path that appears to cross, reject, revisit or bounce around a structural zone may be ordinary continuous-session oscillation, or it may be produced by auction clearing, price-limit constraints, volatility interruptions, event-driven discrete repricing, or bid-ask / quote microstructure effects.

These mechanisms cannot be pooled and called one structural bounce/churn effect.

No economic outcome is opened in this tranche.

## 2. Owner boundary

D01 owns:
- relation of a frozen structural zone to an observed price path;
- whether a path is continuously ordered, discretely repriced, constrained, or not evaluable;
- whether the apparent zone response can support ordinary structural-path interpretation.

D04/D05 own:
- auction state;
- continuous-trading state;
- price-limit state;
- volatility interruption / restart auction;
- halt/resumption;
- spread/depth/quote/trade microstructure primitives;
- any canonical bid-ask-bounce diagnostic.

D11/D17 own:
- public event instance;
- knownAt / release clock;
- event family;
- causal timing receipt.

D01 does not redefine those owner taxonomies or thresholds.

## 3. External / official mechanism context

Current TWSE material states that:
- regular trading uses continuous trading during trading hours with call auctions at market open and close;
- a volatility interruption may suspend continuous matching and resume through call auction;
- ordinary listed stocks generally have daily price fluctuation limits, with rule-defined exceptions.

Research on Taiwan price limits and auction-frequency changes shows that market-design constraints can alter price discovery, liquidity and volatility.

High-frequency econometrics separately warns that observed price jumps can reflect equilibrium-price jumps or market-microstructure noise.

Therefore D01 must fail closed when the path mechanism is not identified.

## 4. No hard-coded market-rule constants

D01 does NOT hard-code:
- 10% daily limits;
- a volatility-interruption percentage;
- auction clock times;
- special-security exceptions;
- tick tables.

Historical/current rule semantics are supplied by the canonical exchange / D05 owner receipt.

Missing as-of rule receipt:
MECHANISM_RULE_UNKNOWN.

## 5. Frozen transition mechanism classes

### M0 — UNCONSTRAINED_CONTINUOUS_OSCILLATION_CANDIDATE

Requirements:
- owner-certified CONTINUOUS trading state;
- complete/replay-safe event ordering for the relevant path if exact crossing is claimed;
- no active auction;
- no price-limit lock / constraint;
- no volatility interruption / restart call auction;
- no halt/resumption ambiguity;
- no corporate-action continuity break.

This is still a candidate class.
Absence of a known event does not prove there was no latent information shock.

### M1 — AUCTION_CLEARING_REPRICE

The relevant path transition is created by a call-auction clearing price rather than a verified continuous sequence.

Subtypes may include owner-certified:
- OPEN_CALL_AUCTION;
- CLOSE_CALL_AUCTION;
- VOLATILITY_INTERRUPTION_RESTART_AUCTION;
- RESUMPTION_CALL_AUCTION;
- OTHER_CANONICAL_CALL_AUCTION.

D01 consumes the subtype.

### M2 — PRICE_LIMIT_CONSTRAINED_PATH

The path is affected by an owner-certified price-limit state:
- limit locked;
- limit touched with constrained executable path;
- prior reference / limit boundary changes available price support.

This is not ordinary free-market oscillation.

### M3 — VOLATILITY_INTERRUPTION_REPRICE

A volatility-interruption state changes matching mechanics or inserts an auction/restart discontinuity.

If the restart auction itself creates the zone transition, M1 and M3 may both be true mechanism flags and the combined class is MIXED_MECHANISM.

### M4 — EVENT_COINCIDENT_DISCRETE_REPRICE

A D11/D17 event receipt has a causal clock compatible with the discrete move:
event known/released no later than the transition and after the prior reference state.

This is EVENT_COINCIDENT, not EVENT_CAUSED.

D01 never infers causal attribution from timing alone.

### M5 — MICROSTRUCTURE_BOUNCE_CANDIDATE

Allowed only when D05 supplies a replay-safe microstructure receipt based on direct quote/trade primitives.

OHLC alone cannot identify bid-ask bounce.

D01 may consume owner fields such as:
- midquote displacement;
- last-trade displacement;
- spread;
- displayed depth;
- trade-side / quote-side alternation;
- owner-certified bounce-candidate state.

D01 does not invent a microstructure threshold.

### M6 — MIXED_MECHANISM

Two or more owner-certified mechanism families overlap in the relevant transition.

Examples:
- event + opening auction;
- event + price-limit lock;
- volatility interruption + restart auction;
- auction + liquidity anomaly.

Do not force a single story.

### M7 — MECHANISM_NOT_EVALUABLE

Required receipt or path ordering is missing, ambiguous or replay-unsafe.

UNKNOWN does not default to M0.

## 6. Continuous crossing vs discrete repricing

For frozen zone [L,U]:

CONTINUOUS_TRADE_THROUGH:
timestamped/replay-safe event sequence shows executed prices crossing the zone in continuous matching.

DISCRETE_GAP_ACROSS:
reference price before the transition and first later executable/clearing price are on opposite sides, with no verified continuous executed path through the zone.

AUCTION_CLEAR_AT_ZONE:
auction clearing price is within [L,U].

LIMIT_CONSTRAINED_AT_ZONE:
price-limit state overlaps the zone interaction.

OHLC_BAR_SPANS_ZONE:
bar high/low span the zone but intrabar ordering is unknown.

These are different path semantics.

## 7. No phantom continuous path

If prior observed price is below the zone and the next auction/opening print is above the zone:

D01 must not synthesize trades through intermediate prices.

The transition may cross the zone geometrically while executed path continuity is absent.

Therefore:
GEOMETRIC_SIDE_CHANGE != CONTINUOUS_EXECUTED_CROSS.

## 8. Event timing firewall

An event can be associated with a transition only if:
- event receipt is PIT/replay-safe;
- knownAt/releaseAt <= transitionAt;
- event did not become public only after the transition.

If eventKnownAt > transitionAt:
EVENT_POST_HOC_NOT_ELIGIBLE.

If only a calendar date is known and intraday ordering matters:
EVENT_CLOCK_UNKNOWN.

Coincidence remains non-causal.

## 9. Corporate-action firewall

Raw split/dividend/reference-price resets may create apparent jumps.

All structural comparisons require TECHNICAL_CONTINUITY semantic-space compatibility.

Unresolved continuity:
MECHANISM_NOT_EVALUABLE.

Corporate-action repricing is not:
- ordinary oscillation;
- event-gap alpha;
- support/resistance bounce.

## 10. Microstructure-bounce observability

A last-trade bounce near a zone can be caused by bid-ask alternation while the quote midpoint is relatively stable.

D01 cannot identify this from daily/intraday OHLC alone.

Three states:
- MICROSTRUCTURE_RECEIPT_AVAILABLE;
- MICROSTRUCTURE_RECEIPT_UNAVAILABLE;
- MICROSTRUCTURE_RECEIPT_BLOCKED.

Only the first may consume D05's bounce-candidate diagnostic.

Missing quote/trade receipt never maps to "no microstructure bounce."

## 11. Zone-churn interpretation

DL-049 churn descriptors remain valid descriptive geometry.

DL-050 adds mechanism conditioning:

same stateTransitionCount or sideFlipCount can arise from:
- free continuous oscillation;
- auction reset;
- price-limit pinning;
- event gap and reversal;
- bid-ask bounce;
- mixed mechanisms.

Therefore:
CHURN_COUNT_WITHOUT_MECHANISM_CONTEXT is insufficient for structural-memory interpretation.

## 12. D03 path-efficiency boundary

D03 remains owner of pathEfficiency10 / trend-quality primitives.

DL-050 does not create another trend/noise score.

Mechanism classes are context labels around D01 zone-path states, not trend factors.

## 13. Information lineage

Price-path and auction-clearing states remain descendants of the same price process unless a distinct owner primitive is used.

Default:
informationRoot = PRICE_OHLC;
effectiveIndependentEvidenceCount = 1;
independentVoteAllowed = false;
residualIncrementalityStatus = NOT_VALIDATED.

Direct quote/order-book receipts may add an owner-certified information primitive, but they still do not become a new independent vote automatically.

D16 owns residual incrementality.

## 14. Future comparison ladder

R0 RAW_ZONE_CHURN
- DL-049 geometry without mechanism split.

R1 EXCLUDE_AUCTION_AND_RESTART
- remove / stratify call-auction and volatility-interruption repricing.

R2 EXCLUDE_LIMIT_CONSTRAINED
- remove / stratify price-limit constrained paths.

R3 EVENT_CLOCK_CONTROLLED
- stratify event-coincident repricing and unknown event clocks.

R4 MICROSTRUCTURE_CONTROLLED
- direct quote/trade receipt where available; OHLC-only cases remain separate.

R5 UNCONSTRAINED_CONTINUOUS_ONLY
- owner-certified continuous, unconstrained, replay-safe path.

R6 MULTI_MECHANISM_ROBUST
- result remains on common support across valid mechanism strata.

## 15. Future interpretation states

Q0 AUCTION_MECHANISM_EXPLANATION

Q1 LIMIT_CONSTRAINT_EXPLANATION

Q2 EVENT_COINCIDENT_EXPLANATION

Q3 MICROSTRUCTURE_NOISE_COMPATIBLE

Q4 MIXED_MECHANISM_DEPENDENCE

Q5 UNCONSTRAINED_CONTINUOUS_RESIDUAL

Q6 MULTI_MECHANISM_ROBUST_PATTERN_CANDIDATE

Q7 NOT_EVALUABLE

None proves alpha or structural memory.

## 16. Common-support requirements

Future D16 comparison must report overlap in:
- zone geometry / structural age;
- volatility;
- liquidity / spread;
- relative tick;
- price tier;
- event state;
- market/sector regime;
- session mechanism;
- limit/VI/halt state;
- gap magnitude;
- DL-049 occupancy/churn;
- D03 path-efficiency control.

No extrapolation outside common support.

## 17. Required manifest fields

Per parent / zone transition:
- parentDecisionId;
- symbol;
- marketDate;
- structuralRootId;
- structuralVersionId;
- semanticSpace;
- frozenBoundaryLower;
- frozenBoundaryUpper;
- predictorFreezeAt;
- transitionStartAt;
- transitionAt;
- sessionMechanismReceipt;
- matchingMechanism;
- auctionSubtype;
- priceLimitState;
- volatilityInterruptionState;
- haltResumptionState;
- eventReceipt;
- eventClockState;
- corporateActionContinuityReceipt;
- exactTradeSequenceReceipt;
- quoteMicrostructureReceipt;
- microstructureBounceOwnerState;
- geometricCrossState;
- continuousExecutedCrossState;
- dl049PathReceipt;
- d03PathEfficiencyReceipt;
- mechanismFlags;
- mechanismClass;
- evaluabilityState;
- informationRoot;
- effectiveIndependentEvidenceCount;
- residualIncrementalityStatus;
- manifestVersion/hash.

No future response belongs in the predictor manifest.

## 18. Current decision

ZONE_CHURN_EQUALS_ORDINARY_OSCILLATION =
FALSE.

GEOMETRIC_SIDE_CHANGE_EQUALS_CONTINUOUS_EXECUTED_CROSS =
FALSE.

AUCTION_CLEARING_EQUALS_CONTINUOUS_PATH =
FALSE.

PRICE_LIMIT_CONSTRAINED_PATH_EQUALS_FREE_OSCILLATION =
FALSE.

EVENT_COINCIDENCE_EQUALS_EVENT_CAUSATION =
FALSE.

OHLC_CAN_IDENTIFY_BID_ASK_BOUNCE =
FALSE.

UNKNOWN_MECHANISM_DEFAULTS_TO_CONTINUOUS =
FALSE.

D01_HARDCODE_MARKET_RULE_THRESHOLDS =
PROHIBITED.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 19. Exact next continuation

1. Build deterministic mechanism classifier / continuous-cross eligibility guard.
2. Add adversarial tests for auction gap-through, VI restart, price-limit lock, event post-hoc timing, OHLC-only microstructure ambiguity and mixed mechanisms.
3. Preserve DL-043 session decomposition and DL-049 churn semantics without duplication.
4. Consume D05 auction/limit/microstructure receipts and D11/D17 event receipts.
5. Hand R0-R6 / Q0-Q7 common-support and residual inference to D16.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate discrete repricing persistence from immediate mechanical reversal / price discovery completion, so a one-bar snapback is not mistaken for durable structural rejection.
8. No runtime wiring / no Formal change.
