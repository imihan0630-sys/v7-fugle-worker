# D01 DL-064 — Prior-Zone Response vs Overnight Inventory / Opening Liquidity Imbalance V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / NO_EVENT_LIQUIDITY_ATTRIBUTION_FIREWALL / SDA_001_SDA_002_OPEN / FORMAL_CORE_LOCKED

## 1. Purpose

DL-063 separated prior-day structural memory from identified overnight information and opening-gap price discovery.

DL-064 handles the harder residual case:

> When no public event is identified, can a next-open reaction near a prior zone still be explained by inventory risk, residual order imbalance, opening liquidity conditions, private/unidentified information, or demand for immediacy?

The absence of an identified public event is not proof that no information or non-structural pressure exists.

## 2. Evidence context

Inventory-risk and market-microstructure research provides strong alternative mechanisms.

- The Federal Reserve Bank of New York "Overnight Drift" research links overnight reversals to prior closing order imbalances and dealer/intermediary inventory risk.
- Opening-auction research shows pre-open order imbalance can be resolved through opening price discovery.
- Order imbalance is not uniquely equivalent to private information; it can also reflect liquidity demand, inventory transfer or random demand shocks.

Therefore:

NO_PUBLIC_EVENT_IDENTIFIED != NO_INFORMATION.
NO_PUBLIC_EVENT_IDENTIFIED != STRUCTURAL_MEMORY_PROVEN.

## 3. Canonical owner boundaries

D01 consumes:

- D05-03 spread;
- D05-04 depth;
- D05-05 order-flow imbalance;
- D05-06 opening/closing auction state;
- D05-09 liquidity regime;
- D11-13 negative-evidence / no-event completeness;
- D17-01 source coverage;
- D17-02 first-known clocks;
- D17-13 scheduled/unscheduled event taxonomy;
- D12-10 night-futures context;
- D14 execution/liquidity consequences where applicable.

D01 does not infer trader identity or intent.

## 4. No-public-event evidence states

Freeze:

E0 PUBLIC_EVENT_IDENTIFIED

E1 NO_PUBLIC_EVENT_IDENTIFIED_COVERAGE_COMPLETE

E2 PUBLIC_EVENT_STATUS_UNKNOWN

E3 PUBLIC_EVENT_DISCOVERED_AFTER_OPEN

E4 SOURCE_COVERAGE_DATA_BLOCKED

To claim E1, owner receipts must demonstrate the required official/general source lanes and capture clocks were complete for the relevant overnight window.

If coverage is incomplete:
E2 or E4, never E1.

## 5. No-event does not identify private information

Even under E1, the causal source can remain:

LATENT_CAUSE_UNIDENTIFIED.

Prohibited:
- "smart money knew";
- "institutional inventory caused it";
- "retail caused it";
- "private information caused it";

unless an owner source identifies that mechanism.

Chart/price/order-book data alone do not identify intent.

## 6. Prior-close inventory / pressure context

When source-feasible, preserve:

- priorCloseOrderFlowImbalance;
- priorCloseSignedVolume;
- priorCloseSpread;
- priorCloseDepth;
- priorClosingAuctionState;
- priorCloseAuctionImbalance if natively observed;
- priorCloseLiquidityRegime;
- priorCloseVolatility;
- receiptKnownAt;
- source hash.

Historical absence remains UNKNOWN.

Do not reconstruct prior-close OFI from next-open return.

## 7. Opening liquidity / imbalance context

At or before predictor freeze, preserve only natively observed:

- opening trial bid/ask;
- displayed trial depth;
- displayed trial imbalance;
- full imbalance if explicitly supplied;
- opening spread;
- opening depth;
- opening delayed/constrained state;
- first continuous spread/depth after open.

Do not infer hidden full-book imbalance from top-five depth.

## 8. Inventory-risk state family

Freeze descriptive states:

I0 NO_CERTIFIED_INVENTORY_PRESSURE_CONTEXT

I1 PRIOR_CLOSE_SELL_PRESSURE_OBSERVED

I2 PRIOR_CLOSE_BUY_PRESSURE_OBSERVED

I3 PRIOR_CLOSE_AUCTION_PRESSURE_OBSERVED

I4 OPENING_LIQUIDITY_IMBALANCE_OBSERVED

I5 PRIOR_CLOSE_AND_OPENING_PRESSURE_CHAIN

I6 PRESSURE_DIRECTION_UNKNOWN

I7 INVENTORY_CONTEXT_DATA_BLOCKED

These are mechanism/context states, not alpha signals.

## 9. Public-event × liquidity matrix

Preserve the joint state, not only one axis.

Examples:

N0 EVENT_IDENTIFIED_PRESSURE_UNKNOWN

N1 NO_EVENT_COMPLETE_NO_PRESSURE_OBSERVED

N2 NO_EVENT_COMPLETE_PRESSURE_OBSERVED

N3 EVENT_IDENTIFIED_PRESSURE_OBSERVED

N4 EVENT_STATUS_UNKNOWN_PRESSURE_OBSERVED

N5 BOTH_EVENT_AND_PRESSURE_UNKNOWN

This prevents "no news" cases from silently becoming pure structural cases.

## 10. Opening price pressure vs structural interaction

A next-open price near a prior zone can reflect:

- residual inventory transfer;
- demand for immediacy;
- thin opening liquidity;
- opening order imbalance;
- unidentified information;
- structural reference effects;
- combinations.

The opening print remains an auction outcome.

A structural hypothesis must survive these alternatives on common support.

## 11. No reverse engineering of imbalance

Prohibited:

- infer opening imbalance from opening return;
- infer prior-close imbalance from overnight reversal;
- infer hidden book pressure from final open;
- infer actual inventory from price reversal;
- infer trader class from direction.

Observed price response is not a substitute for causal order-flow receipt.

## 12. Reversal is not proof of inventory

An opening move that reverses later is consistent with temporary price pressure, but can also reflect new information correction, liquidity normalization or structural reaction.

Therefore:

OPENING_REVERSAL_EQUALS_INVENTORY_EFFECT = FALSE.

Inventory interpretation requires actual owner context.

## 13. Generic comparator families

### G0
Same opening liquidity/imbalance state away from a valid prior zone.

### G1
Same opening liquidity/imbalance state at a valid prior zone.

### H0
Prior zone with E1 no-event-complete and no observed pressure.

### H1
Prior zone with E1 no-event-complete and observed pressure.

### H2
Prior zone with event/pressure status UNKNOWN.

If G1 adds no residual representation beyond G0:
OPENING_LIQUIDITY_MECHANICS_SUFFICIENT.

## 14. Residual no-event cohort

Only a strict residual cohort may be called:

NO_PUBLIC_EVENT_AND_NO_OBSERVED_PRESSURE.

Requirements:
- E1 source coverage complete;
- D05 pressure context coverage complete;
- no identified event;
- no observed qualifying pressure;
- corporate-action resolved;
- opening-auction context replay-safe.

Even then:
NO_OBSERVED_PRESSURE != NO_LATENT_PRESSURE.

The causal mechanism remains partially unidentified.

## 15. Timing firewall

Every owner receipt requires:

knownAt <= predictorFreezeAt.

Later order-flow reconstruction, later news discovery or later classification cannot enter the opening predictor.

SDA-002 remains open.

## 16. SDA-001 dependence guard

Prior-zone geometry, prior-close order flow, opening imbalance, opening return and later reversal are connected by one cross-session price/order-flow process.

They are not independent votes.

Default:
effectiveIndependentEvidenceCount = 1.

Residual independence requires D16 validation.

SDA-001 remains open.

## 17. Future D16 ladder

L0 RAW_PRIOR_ZONE_OPENING_RESPONSE

L1 PUBLIC_EVENT_COMPLETENESS_CONTROLLED

L2 PRIOR_CLOSE_PRESSURE_CONTROLLED

L3 OPENING_AUCTION_IMBALANCE_CONTROLLED

L4 OPENING_SPREAD_DEPTH_LIQUIDITY_CONTROLLED

L5 NIGHT_FUTURES_GLOBAL_CONTEXT_CONTROLLED

L6 GENERIC_OPENING_PRESSURE_COMPARATOR_CONTROLLED

L7 EVENT_X_PRESSURE_MATRIX_CONTROLLED

L8 STRICT_NO_EVENT_NO_OBSERVED_PRESSURE_COHORT

L9 STRUCTURAL_MEMORY_RESIDUAL_CANDIDATE

L10 PROSPECTIVE_MULTI_DATE_REPLICATION

## 18. Future interpretations

Q0 PUBLIC_EVENT_EXPLANATION

Q1 PRIOR_CLOSE_INVENTORY_PRESSURE_EXPLANATION

Q2 OPENING_ORDER_IMBALANCE_EXPLANATION

Q3 OPENING_LIQUIDITY_EXPLANATION

Q4 MULTIPLE_PRESSURE_CHANNELS

Q5 NO_PUBLIC_EVENT_BUT_CAUSE_UNIDENTIFIED

Q6 STRUCTURAL_MEMORY_RESIDUAL

Q7 SOURCE_COVERAGE_INCOMPLETE

Q8 NOT_EVALUABLE

## 19. Current decision

NO_PUBLIC_EVENT_IDENTIFIED_EQUALS_NO_INFORMATION =
FALSE.

NO_PUBLIC_EVENT_IDENTIFIED_EQUALS_STRUCTURAL_MEMORY =
FALSE.

OPENING_REVERSAL_EQUALS_INVENTORY_EFFECT =
FALSE.

PRICE_RETURN_CAN_RECONSTRUCT_ORDER_IMBALANCE =
FALSE.

TOP_FIVE_DEPTH_EQUALS_FULL_BOOK_IMBALANCE =
FALSE.

NO_OBSERVED_PRESSURE_EQUALS_NO_LATENT_PRESSURE =
FALSE.

TRADER_INTENT_FROM_PRICE_OR_BOOK =
PROHIBITED.

OUTCOME_JOIN =
CLOSED.

SDA_001_STATUS =
OPEN.

SDA_002_STATUS =
OPEN.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 20. Exact next continuation

1. Build deterministic event-coverage / inventory-pressure / opening-liquidity classifier and adversarial tests.
2. Require D11-13 / D17 coverage receipts before labeling no-public-event-complete.
3. Preserve observed vs latent/unidentified pressure semantics.
4. Hand L0-L10 / Q0-Q8 residual inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate structural response from stale/non-synchronous opening prices and illiquidity-driven apparent zone touches in thinly traded stocks.
7. No outcome join / no runtime wiring / no Formal change.
