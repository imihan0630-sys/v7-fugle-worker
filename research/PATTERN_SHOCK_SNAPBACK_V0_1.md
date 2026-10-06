# D01 DL-052 — Persistent Structural Rejection vs Shock Snapback / Price-Discovery Completion V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / SHOCK_RECOVERY_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-051 separated zone churn from volatility clustering, realized-volatility bursts and liquidity deterioration.

DL-052 addresses the next confound:

> A fast reversal near a structural zone may be genuine persistent structural rejection, or it may simply be the recovery of a temporary liquidity-induced price error, bid/ask dislocation, volatility overshoot, or completion of an information-driven price-discovery process.

Immediate snapback is therefore not sufficient evidence of support/resistance memory.

No economic outcome is opened in D01.

## 2. Evidence context

Biais and Weill (2009), "Liquidity Shocks and Order Book Dynamics", show a liquidity shock can produce a sharp price decline and order-flow imbalance followed by gradual price recovery.

Lo and Hall (2015), "Resiliency of the limit order book", treat order-book resiliency as the replenishment/recovery process following liquidity shocks.

Yamada and Ito (2022), "Price Discovery and Liquidity Recovery: Forex Market Reactions to Macro Announcements", explicitly separate price discovery speed from liquidity recovery speed; the two adjustment processes need not share the same clock.

These results imply that post-shock price reversal can be a market-resilience / price-discovery phenomenon rather than a structural-zone mechanism.

They do not prove or disprove D01 structural memory.

## 3. Owner boundaries

D04 owns:
- volatility shock / burst semantics;
- volatility normalization;
- shock persistence / recovery primitives where defined.

D05 owns:
- spread / depth / quote freshness;
- order-book resiliency;
- transaction-vs-midquote noise;
- liquidity deterioration / recovery receipts.

D11 owns:
- external event identity and first-known timing.

D01 owns:
- the relation between the frozen structural zone and the shock/recovery path;
- opportunity identity;
- structural-vs-snapback research interpretation.

D01 does not create a new volatility shock, liquidity-recovery or price-discovery estimator.

## 4. Separate clocks

Every evaluable case preserves:

- shockStartedAt;
- shockKnownAt;
- shockPeakAt if owner-certified;
- structuralOpportunityAt;
- predictorFreezeAt;
- liquidityRecoveryAt if owner-certified;
- priceRecoveryAt if owner-certified;
- priceDiscoveryCompletionAt if owner-certified;
- outcomeEvaluationAt in future D16 work.

These timestamps have different causal roles.

Future recovery timestamps may never be backfilled into the predictor snapshot.

## 5. Baseline predictor state

At predictorFreezeAt, allowed context is limited to information already known:

- structuralRootId / version / frozen boundary;
- shockAlreadyKnown;
- shockDirection;
- owner-certified pre-opportunity volatility state;
- owner-certified pre-opportunity spread/depth/freshness;
- matching mechanism / auction / VI / price-limit state from DL-050;
- event context available by freeze;
- pre-shock reference receipt if already known;
- current distance / path state from prior D01 tranches.

Not allowed as baseline predictors:
- later liquidityRecoveryAt;
- later priceRecoveryAt;
- later priceDiscoveryCompletionAt;
- future maximum snapback;
- later spread/depth normalization.

These are post-opportunity mechanism / outcome states.

## 6. Pre-shock reference is not structural geometry

A temporary shock can push price away from a pre-shock reference and then reverse toward it.

Preferred reference when valid:
PRE_SHOCK_MIDQUOTE_REFERENCE.

Fallback descriptive proxy when exact midquote is unavailable:
PRE_SHOCK_TRANSACTION_REFERENCE_PROXY.

If only transaction price is available:
REFERENCE_NOISE_SEPARATION_INCOMPLETE.

A structural boundary that overlaps the pre-shock reference may still be valid, but future inference must separate:
- reversion toward the pre-shock reference;
- rejection from the structural boundary.

Numerical coincidence does not identify cause.

## 7. Shock timing classes

### S0 — NO_PREEXISTING_SHOCK_CONTEXT
No owner-certified shock is active/known before the structural opportunity.

### S1 — PREEXISTING_VOLATILITY_SHOCK
A D04-certified volatility shock is active/known before the opportunity.

### S2 — PREEXISTING_LIQUIDITY_SHOCK
A D05-certified liquidity shock is active/known before the opportunity.

### S3 — PREEXISTING_MIXED_SHOCK
Both volatility and liquidity stress are active.

### S4 — SHOCK_BEGINS_AFTER_OPPORTUNITY
The shock starts only after predictor freeze/opportunity.

It cannot be used to explain or condition the earlier predictor.

### S5 — SHOCK_CONTEXT_UNKNOWN
Required owner receipts are incomplete.

No structural-vs-snapback attribution is allowed.

## 8. Immediate reversal is only a response-shape descriptor

A quick move away from the zone after touch can be stored as:
IMMEDIATE_REVERSAL_OBSERVED
only in future outcome analysis.

It does not equal:
STRUCTURAL_REJECTION_CONFIRMED.

Possible explanations remain:
- temporary liquidity-impact recovery;
- bid/ask or discrete-price noise;
- volatility overshoot correction;
- auction/VI/limit repricing recovery;
- information-driven price discovery;
- genuine structural rejection;
- mixed mechanism.

D01 does not choose among these from price shape alone.

## 9. Liquidity recovery and price recovery are separate

Do not assume:
liquidityRecoveryAt == priceRecoveryAt.

Possible states:
- price recovers before liquidity normalizes;
- liquidity normalizes before price stabilizes;
- price never returns to pre-shock reference;
- liquidity remains impaired despite price stabilization.

Therefore a single "recovered" label is prohibited.

## 10. Temporary vs permanent price impact

Future D16 may classify a response only with preregistered owner-supported horizons / decomposition:

T0 TEMPORARY_IMPACT_RECOVERY_CANDIDATE
Price moves back toward pre-shock reference while shock/liquidity conditions normalize.

T1 PERMANENT_PRICE_DISCOVERY_CANDIDATE
Price stabilizes away from pre-shock reference after informative shock context.

T2 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE
A structural-zone response remains after temporary-impact, price-discovery, mechanism, volatility and liquidity controls.

T3 MIXED_RECOVERY_STRUCTURE_CANDIDATE
Both shock recovery and structural residual remain plausible.

T4 NOT_EVALUABLE
Provenance/common support insufficient.

None is a trading label or causal proof.

## 11. No fixed snapback horizon

D01 does not freeze:
- 1 bar;
- 5 minutes;
- 15 minutes;
- 3 bars;
- same-day close;
- N ATR

as the universal recovery horizon.

Future D16 must preregister horizon families or consume owner-defined recovery events before opening outcomes.

Best-horizon selection after observing returns is prohibited.

## 12. Midquote vs transaction-price firewall

Where valid two-sided quotes exist:
- midquote is preferred for temporary mispricing / recovery context;
- transaction prices may contain bid-ask bounce and discreteness.

A transaction-price snapback without valid quote evidence is:
SNAPBACK_NOISE_SEPARATION_INCOMPLETE.

Do not claim efficient-price recovery from last trade alone.

## 13. Price-discovery firewall

Event or informed-order-flow context can move the efficient price permanently.

A move through a zone followed by stabilization on the new side may represent price discovery rather than failure of the zone.

Conversely, a short reversal before final stabilization may be only transitional.

Future D16 must separate:
- immediate response;
- liquidity recovery;
- price stabilization;
- event / information context.

D11 event presence does not prove event causation.

## 14. Structural persistence test

A future structural-rejection claim is strongest only if the response survives after:

1. excluding / controlling auction, VI, price-limit and bid-ask-bounce cases;
2. controlling preexisting volatility/liquidity shocks;
3. separating pre-shock-reference snapback;
4. separating liquidity recovery from price recovery;
5. separating informative price-discovery context;
6. preserving common support;
7. replicating across independent dates / regimes.

Immediate touch-and-bounce alone never reaches this standard.

## 15. Opportunity and sample identity

One structural opportunity remains one causal parent even if it carries:
- structural-zone receipt;
- shock receipt;
- liquidity-recovery receipt;
- price-recovery receipt;
- price-discovery receipt.

These are context/mechanism observations, not independent votes.

Default effectiveIndependentEvidenceCount = 1.

## 16. Future D16 ladder

R0 RAW_TOUCH_RESPONSE

R1 DL050_MARKET_MECHANICS_CONTROLLED

R2 PREEXISTING_VOLATILITY_SHOCK_CONTROLLED

R3 PREEXISTING_LIQUIDITY_SHOCK_CONTROLLED

R4 PRE_SHOCK_REFERENCE_SNAPBACK_CONTROLLED

R5 LIQUIDITY_RECOVERY_VS_PRICE_RECOVERY_SEPARATED

R6 PRICE_DISCOVERY_CONTEXT_CONTROLLED

R7 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE

R8 MULTI_DATE_MULTI_REGIME_REPLICATION

## 17. Future interpretation states

Q0 AUCTION_LIMIT_MICROSTRUCTURE_EXPLANATION

Q1 VOLATILITY_SHOCK_SNAPBACK_EXPLANATION

Q2 LIQUIDITY_SHOCK_RECOVERY_EXPLANATION

Q3 PRE_SHOCK_REFERENCE_REVERSION_EXPLANATION

Q4 PRICE_DISCOVERY_COMPLETION_EXPLANATION

Q5 MIXED_SHOCK_STRUCTURE_MECHANISM

Q6 STRUCTURAL_REJECTION_RESIDUAL

Q7 NOT_EVALUABLE

None proves alpha.

## 18. Required manifest fields

Per parent/opportunity:
- parentDecisionId;
- symbol;
- marketDate;
- structuralRootId;
- structuralVersionId;
- semanticSpace;
- zoneLower;
- zoneUpper;
- structuralOpportunityAt;
- predictorFreezeAt;
- shockContextState;
- volatilityShockReceipt;
- liquidityShockReceipt;
- shockStartedAt;
- shockKnownAt;
- shockPeakAt;
- preShockReferenceType;
- preShockReferencePrice;
- preShockReferenceKnownAt;
- structuralDistanceToPreShockReference;
- preOpportunitySpreadReceipt;
- preOpportunityDepthReceipt;
- preOpportunityQuoteFreshness;
- dl050MechanismReceipt;
- d11EventReceipt;
- liquidityRecoveryReceipt;
- liquidityRecoveryAt;
- priceRecoveryReceipt;
- priceRecoveryAt;
- priceDiscoveryReceipt;
- priceDiscoveryCompletionAt;
- timingRole for each receipt;
- midquoteAvailable;
- noiseSeparationState;
- effectiveIndependentEvidenceCount;
- residualIncrementalityStatus;
- manifestVersion/hash.

Future recovery/response fields do not belong in an earlier predictor snapshot.

## 19. Current decision

IMMEDIATE_SNAPBACK_EQUALS_STRUCTURAL_REJECTION =
FALSE.

LIQUIDITY_RECOVERY_EQUALS_PRICE_RECOVERY =
FALSE.

RETURN_TO_PRE_SHOCK_REFERENCE_EQUALS_SUPPORT_MEMORY =
FALSE.

TRANSACTION_PRICE_REVERSAL_EQUALS_EFFICIENT_PRICE_RECOVERY =
FALSE.

PRICE_DISCOVERY_COMPLETION_EQUALS_STRUCTURAL_FAILURE =
FALSE.

POST_OPPORTUNITY_RECOVERY_AS_BASELINE_PREDICTOR =
PROHIBITED.

FIXED_UNIVERSAL_SNAPBACK_HORIZON =
NOT_DEFINED.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 20. Exact next continuation

1. Build deterministic shock-timing / reference / recovery-timing guards and adversarial tests.
2. Preserve pre-shock reference, liquidity recovery, price recovery and price-discovery clocks separately.
3. Keep midquote-vs-transaction noise separation explicit.
4. Hand R0-R8 / Q0-Q7 common-support and mechanism-separation inference to D16.
5. Keep D04/D05/D11 ownership explicit and do not duplicate their estimators.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate persistent rejection from inventory replenishment / queue refill around the zone, especially when displayed depth reforms after the shock.
8. No runtime wiring / no Formal change.
