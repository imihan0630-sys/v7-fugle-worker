# D01 DL-051 — Zone Churn vs Volatility Clustering / Realized-Volatility Burst / Liquidity Deterioration V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / VOL_LIQUIDITY_CONFOUND_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-049 separated zone occupancy from directional churn/path disorder.
DL-050 separated ordinary continuous transitions from auction/limit/event/microstructure repricing.

DL-051 addresses the next confound:

> Repeated zone transitions can increase simply because volatility clusters, realized volatility bursts, bid-ask spreads widen, or displayed depth deteriorates.

Therefore raw churn cannot be interpreted as structural acceptance/rejection without volatility/liquidity context.

No economic outcome is opened in this tranche.

## 2. Owner boundary

D04 owns:
- volatility level;
- realized-volatility primitives;
- contraction / expansion / shock states;
- volatility persistence / clustering semantics;
- canonical volatility normalization.

D05 owns:
- bid-ask spread;
- displayed depth;
- quote freshness / reconnect semantics;
- liquidity-state components;
- transaction-vs-midquote noise diagnostics.

D03 owns:
- pathEfficiency10 / trend-quality primitives.

D01 owns:
- zone-local occupancy/churn/path geometry;
- opportunity-normalized structural transition descriptors;
- interpretation after consuming D04/D05 owner receipts.

D01 does not create a new volatility indicator, liquidity score or path-efficiency factor.

## 3. Evidence context

Volatility clustering is a canonical empirical property: large absolute price moves tend to cluster in time.

D04 research already freezes volatility clustering as persistence of magnitude, not persistence of direction.

Current D04/D05 preregistration further requires:
- same-support volatility controls;
- midquote local volatility when two-sided quotes are valid;
- transaction-price realized volatility only as a noise diagnostic;
- explicit spread/depth/freshness state;
- separate auction/VI/limit regimes.

Taiwan microstructure research also documents that intraday volatility, spread and depth are economically related to order choice and price discovery.

Therefore apparent D01 churn must be tested against these owner primitives.

## 4. Causal timing split

Two context blocks are mandatory.

### A. PRE_WINDOW_CONTEXT

Measured no later than churnWindowStartAt:
- preWindowVolatilityLevel;
- preWindowVolatilityClusterState;
- preWindowATR / normalized volatility;
- preWindowSpread;
- preWindowDepth;
- preWindowLiquidityState;
- preWindowQuoteFreshness;
- preWindowMechanismState;
- price/tick tier;
- market/sector regime.

This block may be used as baseline conditioning for a study that begins at churnWindowStartAt.

### B. WITHIN_WINDOW_MECHANISM

Observed from churnWindowStartAt through churnWindowEndAt:
- realizedVolatilityBurstState;
- withinWindowMidquoteRV;
- withinWindowTransactionRV;
- spreadDeteriorationState;
- depthDeteriorationState;
- quoteFreshnessDeterioration;
- reconnect / missingness state;
- DL-050 mechanism transitions.

This block is contemporaneous mechanism evidence.

It is NOT a valid baseline predictor for a decision frozen before it occurred.

## 5. No future-state backfill

If predictorFreezeAt < churnWindowEndAt:

WITHIN_WINDOW_MECHANISM is:
- mediator / mechanism / subsequent state;
- not a baseline predictor.

Future realized volatility, future spread widening or future depth thinning may not be backfilled into an earlier decision row.

If predictorFreezeAt >= churnWindowEndAt:
the completed window may be stored as historical state for a later decision, subject to normal PIT rules.

## 6. Volatility opportunity effect

A wider-amplitude price process naturally creates more chances to cross a fixed-width zone.

Therefore D01 must preserve:
- zoneWidthPrice;
- zoneWidthAtr using owner-supplied ATR/volatility scale;
- crossingOpportunityCount / receipt from existing opportunity semantics;
- transition count;
- side-flip count.

Raw transition count is not enough.

A descriptive normalization may report:
- transitionsPerOpportunity;
- sideFlipsPerOpportunity

only when the opportunity denominator is causally defined and non-zero.

These are exposure diagnostics, not alpha factors.

## 7. Volatility level vs burst vs clustering

Keep separate:

VOLATILITY_LEVEL:
current/pre-window amplitude.

VOLATILITY_CLUSTER_STATE:
persistence of elevated/depressed volatility across prior windows.

REALIZED_VOLATILITY_BURST:
large same-window realized move/dispersion relative to the owner-defined protocol.

A high-volatility level can exist without a new burst.
A burst can occur after a quiet baseline.
Clustering concerns persistence, not direction.

No one state substitutes for another.

## 8. Midquote vs transaction realized volatility

Where two-sided quotes are valid:

- midquote local volatility is the primary microstructure control;
- transaction-price RV may include bid-ask bounce / price discreteness;
- the difference between transaction and midquote RV can be a noise diagnostic.

D01 does not define the estimator.

If only transaction RV is available:
VOLATILITY_NOISE_SEPARATION_INCOMPLETE.

Do not infer structural churn from transaction RV alone.

## 9. Spread deterioration

D05 owns spread measurement.

D01 consumes an owner-certified state such as:
- SPREAD_STABLE;
- SPREAD_WIDENING;
- SPREAD_STRESSED;
- SPREAD_UNKNOWN.

No D01 spread threshold is defined.

Spread widening can make small last-trade oscillations appear larger and can change executable traversal quality.

It is a control/context state, not a directional vote.

## 10. Depth deterioration

D05 owns displayed-depth measurement.

D01 consumes:
- depth level / normalized depth;
- top-five block where valid;
- depth deterioration state;
- freshness / coverage.

Displayed depth is not total latent liquidity.

Depth thinning may increase price impact and zone crossing frequency without implying structural rejection.

No D01 depth threshold or GOOD/BAD score is defined.

## 11. Liquidity stress vs structural churn

Frozen context states:

L0 STRUCTURAL_CHURN_RAW

L1 HIGH_VOLATILITY_CONTEXT

L2 REALIZED_VOLATILITY_BURST_CONTEXT

L3 SPREAD_DETERIORATION_CONTEXT

L4 DEPTH_DETERIORATION_CONTEXT

L5 VOLATILITY_LIQUIDITY_STRESS_MIXED

L6 STRUCTURAL_CHURN_RESIDUAL_CANDIDATE

L7 NOT_EVALUABLE

These are research contexts, not trading labels.

L6 is allowed only as a research candidate when:
- required owner receipts are valid;
- no major mechanism blocker exists;
- churn remains after common-support control.

It is not machine-proven by absence of flags alone.

## 12. Same-window liquidity deterioration may be mediator

If price begins to churn and liquidity then deteriorates, spread/depth changes can be:
- a cause;
- a consequence;
- a feedback loop.

D01 cannot identify direction from timestamped coexistence alone.

Future D16 must distinguish:
- PRE_WINDOW baseline liquidity;
- WITHIN_WINDOW contemporaneous deterioration;
- later outcome.

No causal arrow is assumed.

## 13. Missingness under stress

Quote/book missingness can worsen exactly when markets are stressed.

Therefore:
- stale quote != stable spread;
- missing book != zero depth;
- reconnect segment != continuous observation.

Owner receipt states:
- FRESH;
- STALE;
- RECONNECT_CROSSED;
- MISSING;
- UNKNOWN

must remain in the denominator.

Do not drop stressed missing windows.

## 14. Market-mechanism interaction

DL-050 mechanism states remain mandatory.

A volatility burst during:
- call auction;
- VI restart;
- price-limit lock

is not comparable to an unconstrained continuous burst without stratification/common support.

DL-051 does not overwrite DL-050.

## 15. Information lineage

Most volatility/churn descriptors are transformations of the same underlying price path.

Default:
informationRoot includes PRICE_OHLC;
effectiveIndependentEvidenceCount = 1;
independentVoteAllowed = false.

Spread/depth/quote primitives may add owner-certified market-microstructure information roots.

They still do not automatically become independent alpha votes.

D16 owns residual incrementality.

## 16. Future D16 ladder

V0 RAW_ZONE_CHURN

V1 PRE_WINDOW_VOL_LEVEL_CONTROLLED

V2 PRE_WINDOW_VOL_CLUSTER_CONTROLLED

V3 OPPORTUNITY_NORMALIZED

V4 WITHIN_WINDOW_RV_BURST_STRATIFIED

V5 SPREAD_DEPTH_FRESHNESS_CONTROLLED

V6 DL050_MECHANISM_CONTROLLED

V7 RESIDUAL_ZONE_CHURN_CANDIDATE

V8 MULTI_DATE_MULTI_REGIME_REPLICATION

## 17. Future interpretation states

Q0 VOLATILITY_LEVEL_EXPLANATION

Q1 VOLATILITY_CLUSTER_EXPLANATION

Q2 CROSSING_OPPORTUNITY_EXPLANATION

Q3 REALIZED_BURST_EXPLANATION

Q4 LIQUIDITY_DETERIORATION_EXPLANATION

Q5 MICROSTRUCTURE_MISSINGNESS_SENSITIVE

Q6 MARKET_MECHANISM_SENSITIVE

Q7 STRUCTURAL_CHURN_RESIDUAL

Q8 NOT_EVALUABLE

None proves structural memory or alpha.

## 18. Common-support requirements

Future analysis must report overlap in:
- zone width / normalized zone width;
- pre-window volatility;
- volatility cluster state;
- price/tick tier;
- spread/depth;
- quote freshness;
- event activity;
- session/auction/VI/limit state;
- market/sector regime;
- DL-049 occupancy/churn;
- D03 pathEfficiency10;
- crossing-opportunity denominator.

No extrapolation outside common support.

## 19. Required manifest fields

Per parent / churn window:
- parentDecisionId;
- symbol;
- marketDate;
- structuralRootId;
- structuralVersionId;
- semanticSpace;
- zoneLower;
- zoneUpper;
- zoneWidthPrice;
- churnWindowStartAt;
- churnWindowEndAt;
- predictorFreezeAt;
- preWindowVolatilityReceipt;
- preWindowVolatilityClusterState;
- preWindowATR;
- preWindowSpreadReceipt;
- preWindowDepthReceipt;
- preWindowLiquidityState;
- preWindowQuoteFreshness;
- withinWindowMidquoteRVReceipt;
- withinWindowTransactionRVReceipt;
- realizedVolatilityBurstState;
- spreadDeteriorationState;
- depthDeteriorationState;
- quoteFreshnessDeteriorationState;
- crossingOpportunityReceipt;
- transitionCount;
- sideFlipCount;
- transitionsPerOpportunity;
- sideFlipsPerOpportunity;
- dl050MechanismReceipt;
- d03PathEfficiencyReceipt;
- timingRole;
- evaluabilityState;
- informationRoots;
- effectiveIndependentEvidenceCount;
- residualIncrementalityStatus;
- manifestVersion/hash.

No future response field belongs in the predictor manifest.

## 20. Current decision

RAW_CHURN_EQUALS_STRUCTURAL_CHURN =
FALSE.

HIGH_VOLATILITY_EQUALS_STRUCTURAL_FAILURE =
FALSE.

REALIZED_VOLATILITY_BURST_EQUALS_PRE_WINDOW_PREDICTOR =
FALSE.

SPREAD_WIDENING_EQUALS_DIRECTIONAL_SIGNAL =
FALSE.

DEPTH_THINNING_EQUALS_DIRECTIONAL_SIGNAL =
FALSE.

MISSING_BOOK_EQUALS_ZERO_DEPTH =
FALSE.

TRANSACTION_RV_EQUALS_CLEAN_EFFICIENT_PRICE_VOLATILITY =
FALSE.

D01_CREATES_NEW_VOLATILITY_OR_LIQUIDITY_FACTOR =
PROHIBITED.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 21. Exact next continuation

1. Build deterministic causal-timing guard for pre-window vs within-window volatility/liquidity receipts.
2. Build opportunity-normalized churn helper with zero/UNKNOWN denominator guard.
3. Add adversarial pairs: same churn/different volatility, same volatility/different churn, same churn/different spread/depth, stress missingness, transaction-vs-midquote RV.
4. Hand V0-V8 / Q0-Q8 residual/common-support inference to D16.
5. Preserve D04/D05 ownership and D03 path-efficiency ownership.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate persistent structural rejection from immediate snapback / price-discovery completion after volatility or liquidity shock.
8. No runtime wiring / no Formal change.
