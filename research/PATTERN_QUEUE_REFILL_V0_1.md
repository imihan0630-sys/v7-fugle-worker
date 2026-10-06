# D01 DL-053 — Persistent Structural Rejection vs Inventory Replenishment / Queue Refill V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / BOOK_REFILL_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-052 separated structural rejection from temporary shock snapback and price-discovery completion.

DL-053 asks:

> If displayed depth reforms near a structural zone after a liquidity shock, is that evidence of structural support/resistance, or ordinary order-book resiliency / inventory replenishment?

Displayed depth recovery is not automatically structural defense.

No economic outcome is opened in D01.

## 2. Evidence context

Lo and Hall (2015) show limit-order-book depth and spread can recover after liquidity shocks.

Xu et al. (limit-order-book resiliency after effective market orders) report that depth and spread can revert toward normal after aggressive order shocks, with recovery dynamics depending on shock type.

Other resiliency work shows that spread recovery and depth replenishment may occur on different timescales and may be supplied by different participant classes.

Therefore:
- queue refill is a normal market-resiliency process;
- observed refill near a zone does not by itself identify structural memory;
- a zone-specific claim must beat generic matched refill behavior.

## 3. Owner boundary

D05 owns:
- displayed depth;
- spread;
- quote freshness;
- cancellation / replenishment receipts where observable;
- exact order-book resiliency primitives.

D04 owns:
- volatility shock context.

D01 owns:
- the relation of those receipts to the frozen structural zone;
- zone-specific versus generic refill comparison semantics.

D01 does not create a new depth/liquidity score.

## 4. Displayed depth is not latent liquidity

Displayed best-five or visible book depth is:
- cancellable;
- partial;
- price-level specific;
- timestamp sensitive.

It is not:
- committed defense;
- latent/hidden liquidity;
- iceberg quantity unless directly observed under a canonical owner contract;
- investor intent.

D01 therefore prohibits labels such as:
DEFENDED_BY_BUYERS
or
INSTITUTIONAL_SUPPORT
from displayed depth alone.

## 5. Queue refill is not structural rejection

A post-shock refill can occur at any salient executable price.

Future inference must compare:

B0 GENERIC_REFILL_NONSTRUCTURAL
- matched shock/context;
- visible depth replenishes;
- no certified structural-zone coincidence.

B1 STRUCTURE_REFILL_COINCIDENT
- same context;
- refill occurs at/inside the structural zone.

B2 STRUCTURE_REFILL_RESIDUAL_CANDIDATE
- zone coincidence adds representation after generic resiliency, spread, depth, volatility, tick, mechanism and price-reference controls.

B3 REFILL_FRAGILE_OR_CANCELLED
- visible depth reappears but cancels/vanishes before meaningful interaction.

B4 NOT_EVALUABLE
- book/freshness/queue provenance insufficient.

## 6. Pre-shock / depleted / refill clocks

Preserve:
- preShockBookAt;
- shockStartedAt;
- depletedBookAt;
- structuralOpportunityAt;
- predictorFreezeAt;
- refillStartedAt;
- refillMeasuredAt;
- spreadNormalizedAt;
- depthNormalizedAt.

Later refill/recovery clocks may not be backfilled into the earlier predictor state.

## 7. Side-specific semantics

For a support-role opportunity:
- bid-side displayed depth is the directly relevant visible-side context.

For a resistance-role opportunity:
- ask-side displayed depth is directly relevant.

Opposite-side depth remains context and may matter for imbalance, but it is not silently summed into one "wall strength" number.

## 8. Refill amount and refill persistence

Allowed descriptive fields where D05 receipts are valid:
- preShockSameSideDepth;
- depletedSameSideDepth;
- refillSameSideDepth;
- refillFractionOfPreShockDepth;
- refillLatency;
- spreadAtRefill;
- quoteFreshness;
- cancellationObserved;
- executionObservedAtRefillPrice.

These are context/mechanism descriptors.

No universal refill threshold or persistence threshold is frozen by D01.

## 9. Cancellation / fleeting-depth firewall

Visible depth that appears and rapidly cancels is not equivalent to executed absorption.

Possible research states:
- REFILL_VISIBLE_STABLE_CONTEXT;
- REFILL_VISIBLE_FLEETING_CONTEXT;
- REFILL_EXECUTION_INTERACTION_OBSERVED;
- REFILL_CANCELLATION_UNKNOWN.

Exact thresholds belong to D05/D16 preregistration.

No spoofing/manipulation accusation is inferred from cancellation alone.

## 10. Generic resiliency control

The primary falsifier is not "did depth refill?"

It is:

> Did depth refill at the structural zone more strongly or more persistently than at matched non-structural prices under comparable shock and market state?

Future matching/common support includes:
- shock severity/type;
- same side of book;
- spread;
- depth;
- volatility;
- relative tick;
- market mechanism;
- event context;
- price distance from midquote;
- DL-052 pre-shock reference state;
- liquidity recovery phase.

## 11. Structural-zone coincidence

Keep separate:
- structural boundary;
- current best bid/ask;
- refill price level;
- pre-shock midquote/reference.

A refill price inside the structural zone is:
BOOK_REFILL_ZONE_COINCIDENCE.

It is not:
STRUCTURAL_SUPPORT_CONFIRMED.

## 12. Information lineage

Possible roots:
- PRICE_OHLC;
- LIVE_ORDER_BOOK;
- QUOTE_TIME;
- TRADE_TIME.

Even though live-book data add non-OHLC information, they do not become a second alpha vote automatically.

Default:
effectiveIndependentEvidenceCount = 1;
independentVoteAllowed = false;
residualIncrementalityStatus = NOT_VALIDATED.

D16 owns residual incrementality.

## 13. Future D16 ladder

Q0 RAW_ZONE_REFILL

Q1 SHOCK_TYPE_CONTROLLED

Q2 PRE_SHOCK_DEPTH_SPREAD_CONTROLLED

Q3 GENERIC_NONSTRUCTURAL_REFILL_CONTROLLED

Q4 CANCELLATION_FLEETING_DEPTH_CONTROLLED

Q5 EXECUTION_INTERACTION_CONTROLLED

Q6 DL052_RECOVERY_PHASE_CONTROLLED

Q7 STRUCTURE_SPECIFIC_REFILL_RESIDUAL

Q8 MULTI_DATE_MULTI_REGIME_REPLICATION

## 14. Interpretation states

R0 GENERIC_BOOK_RESILIENCY_EXPLANATION

R1 SPREAD_RECOVERY_EXPLANATION

R2 DEPTH_RECOVERY_EXPLANATION

R3 FLEETING_DISPLAYED_DEPTH_EXPLANATION

R4 EXECUTED_ABSORPTION_CONTEXT

R5 STRUCTURE_SPECIFIC_REFILL_RESIDUAL

R6 MIXED_MECHANISM

R7 NOT_EVALUABLE

No state proves alpha.

## 15. Required manifest fields

Per parent/opportunity:
- parentDecisionId;
- symbol;
- marketDate;
- structuralRootId;
- structuralVersionId;
- role;
- zoneLower;
- zoneUpper;
- structuralOpportunityAt;
- predictorFreezeAt;
- preShockBookReceipt;
- shockReceipt;
- depletedBookReceipt;
- refillReceipt;
- preShockSameSideDepth;
- depletedSameSideDepth;
- refillSameSideDepth;
- refillFractionOfPreShockDepth;
- refillLatency;
- refillPrice;
- refillInsideStructuralZone;
- spreadAtRefill;
- quoteFreshness;
- cancellationState;
- executionAtRefillPriceState;
- liquidityRecoveryPhaseReceipt;
- mechanismReceipt;
- informationRoots;
- effectiveIndependentEvidenceCount;
- residualIncrementalityStatus;
- manifestVersion/hash.

No future return field belongs in the predictor manifest.

## 16. Current decision

DISPLAYED_DEPTH_REFILL_EQUALS_STRUCTURAL_DEFENSE =
FALSE.

QUEUE_REFILL_EQUALS_INDEPENDENT_CONFIRMATION =
FALSE.

FLEETING_DEPTH_EQUALS_EXECUTED_ABSORPTION =
FALSE.

BOOK_REFILL_AT_ZONE_EQUALS_SUPPORT_RESISTANCE_MEMORY =
FALSE.

VISIBLE_DEPTH_EQUALS_LATENT_LIQUIDITY =
FALSE.

BEHAVIORAL_INTENT_FROM_BOOK_SNAPSHOT =
PROHIBITED.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 17. Exact next continuation

1. Build deterministic book-refill timing / zone-coincidence helper and adversarial tests.
2. Preserve pre-shock depth, depleted depth, refill depth, cancellation and execution-interaction states separately.
3. Hand Q0-Q8 / R0-R7 generic-resiliency versus zone-specific residual inference to D16.
4. Keep D05 ownership explicit and prohibit D01 depth thresholds.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate visible queue refill from actual executed absorption / replenishment under hidden-liquidity uncertainty.
7. No runtime wiring / no Formal change.
