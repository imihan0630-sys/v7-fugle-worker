# D01 DL-063 — Structural Response vs Overnight Information / Previous-Close Anchoring V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / OVERNIGHT_OPENING_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-062 separated opening/closing auction mechanics from continuous trading.

DL-063 asks the next question:

> When price opens near, through, or away from an old support/resistance zone, is the opening response incremental structural memory, or simply overnight information accumulation, previous-close anchoring, pre-open derivative price discovery or order-flow dependence?

Taiwan spot stocks are not continuously tradable overnight, so information accumulated after the prior close can be incorporated discontinuously into the next opening auction.

No future return outcome is opened in this tranche.

## 2. Evidence context

Taiwan evidence is directly relevant.

Ho et al. (2023) separate intraday and overnight return information and argue that overnight information is concentrated into the next opening price because Taiwan listed stocks do not trade overnight. Their results also show overnight and intraday momentum components have different predictive behavior.

Taiwan pre-open derivative research shows index-option and index-futures information before the spot open can predict short-horizon spot/ETF behavior, demonstrating that price discovery can occur outside the cash-stock opening print.

Older Taiwan microstructure evidence reports that opening prices often lie near prior end-of-day quotes and that order-flow dependence contributes materially to overnight returns.

These results require D01 to treat previous close, overnight information and pre-open derivative signals as alternative explanations.

## 3. Owner boundaries

D01 does not build a new overnight-news or macro model.

Consume owner-certified receipts from:
- D08: corporate/news/event information and first-known timestamps;
- D09/D12: overnight international/futures/derivatives context where routed;
- D03: trend/momentum decomposition and timing semantics;
- D04/D05: opening microstructure, liquidity and pre-open order-book state;
- D18: regime context;
- D16: dependence-aware inference.

Missing receipts remain UNKNOWN.

## 4. Frozen overnight context states

O0 NO_VERIFIED_OVERNIGHT_RECEIPT

O1 VERIFIED_CORPORATE_OR_FIRM_NEWS

O2 VERIFIED_MARKET_OR_SECTOR_OVERNIGHT_MOVE

O3 VERIFIED_GLOBAL_MACRO_OR_CROSS_ASSET_MOVE

O4 PREOPEN_INDEX_FUTURES_SIGNAL

O5 PREOPEN_INDEX_OPTIONS_SIGNAL

O6 PREOPEN_SPOT_INDICATIVE_SIGNAL

O7 PREVIOUS_CLOSE_ANCHOR_NEAR_ZONE

O8 MULTIPLE_OVERNIGHT_CHANNELS

O9 OVERNIGHT_CONTEXT_UNKNOWN

These states are context, not independent confirmations.

## 5. Overnight window

Define the candidate overnight information window as:

priorRegularCloseKnownAt < overnightReceiptKnownAt <= predictorFreezeAt.

D01 does not assume all information released in this interval is price-relevant.

Owner receipt must identify:
- source;
- firstObservableAt / knownAt;
- event time;
- version/hash;
- replaySafe.

Information first known after predictorFreezeAt is POST_FREEZE_OVERNIGHT_CONTEXT and ineligible.

## 6. Previous-close anchoring

Previous close is a special reference price.

Store separately:
- priorClosePrice;
- zone-to-prior-close distance;
- opening-to-prior-close gap;
- opening-to-zone distance;
- prior closing auction context from DL-062.

If an old zone lies close to prior close, any opening response may be confounded by previous-close reference effects.

D01 defines no arbitrary "near prior close" threshold.

Continuous descriptors remain primary.

## 7. Overnight gap decomposition

Freeze:

OVERNIGHT_GAP_PRICE = openingFinalPrice - priorClosePrice.

For orientation-aware analysis also retain:
- signed gap relative to zone;
- absolute gap;
- gap in ATR units;
- gap in percent;
- whether opening print begins inside/above/below zone;
- whether prior close was inside/above/below zone.

No intraday path through the zone is invented.

## 8. Opening gap vs structural crossing

If prior close and opening print lie on opposite sides of the zone:
OPENING_GAP_CROSSING.

This remains inherited from DL-062.

DL-063 adds attribution:
- overnight information may explain the displacement;
- previous-close anchoring may explain the opening location;
- pre-open derivatives may lead the cash open.

A structural interpretation requires residual evidence beyond those channels.

## 9. Opening predictor clock

If the predictor uses the final opening print:
openingFinalPrintKnownAt <= predictorFreezeAt < endpointWindowStart.

The same opening print cannot be simultaneously:
- predictor;
- first response outcome;
- evidence that the zone worked.

If endpointWindowStart <= predictorFreezeAt:
OUTCOME_WINDOW_CLOCK_INVALID.

## 10. Pre-open indicative state

Pre-open simulated prices/volumes are indicative context, not executed trades.

A sequence of indicative snapshots may be stored only with exact knownAt timestamps.

Do not replace earlier indicative values with the final opening print.

Do not treat indicative movement through a zone as a completed structural crossing.

## 11. Pre-open derivatives and cash open

Possible owner-certified prior price-discovery channels include:
- index futures return/basis;
- index options implied-volatility/imbalance signals;
- overseas market/index move;
- ADR / cross-listed instrument move where owner-certified;
- FX/rate/commodity move where causally relevant.

They are baseline context only when known before predictor freeze.

Same-direction movement does not create an independent vote.

## 12. Overnight information is not one scalar

Do not create an OVERNIGHT_SCORE.

Preserve separate dimensions:
- firm-specific event;
- market/sector move;
- macro/cross-asset move;
- futures signal;
- options signal;
- pre-open spot indicative signal;
- previous-close anchor geometry;
- liquidity/order-flow state.

D16 decides future adjustment/inference.

## 13. "No news" is not "no overnight information"

Absence of an owner receipt does not prove no relevant overnight information existed.

NO_VERIFIED_OVERNIGHT_RECEIPT means:
no verified receipt available.

It does NOT mean:
NO_OVERNIGHT_CAUSAL_INFLUENCE.

UNKNOWN stays UNKNOWN.

## 14. Generic comparator

Primary comparator:

G0 OVERNIGHT_SHOCK_AWAY_FROM_ZONE
- verified overnight/pre-open context;
- opening displacement;
- no structural opportunity at the tested zone.

G1 OVERNIGHT_SHOCK_AT_ZONE
- matched context;
- opening displacement reaches/straddles the zone.

If G1 adds no residual representation over G0, overnight/opening context is sufficient.

## 15. Previous-close comparator

Complementary comparator:

P0 PRIOR_CLOSE_ANCHOR_AWAY_FROM_ZONE

P1 PRIOR_CLOSE_ANCHOR_NEAR_ZONE

This asks whether apparent structure response is mostly reference-price anchoring.

"Near" must be a preregistered continuous/common-support analysis decision owned by D16, not a D01 post-outcome threshold.

## 16. Opening overreaction / correction caution

Taiwan research suggests overnight information may be overreacted to at the open and later corrected.

Therefore an opening bounce/reversal near a structural zone can be explained by:
- correction of opening overreaction;
- liquidity normalization;
- previous-close anchoring;
- structural response.

D01 cannot assign causality from price path alone.

## 17. Order-flow dependence

Opening order imbalance may reflect:
- overnight information;
- queued retail/institutional orders;
- stale-price catch-up;
- pre-open derivative information;
- simple inventory/liquidity effects.

Consume D04/D05 owner receipts.

High opening volume alone does not identify informed trading.

## 18. Common support

Future D16 comparison should preserve overlap in:
- overnight gap size;
- prior-close-to-zone distance;
- opening-to-zone distance;
- overnight event class;
- futures/options signal state;
- market/sector/global move;
- liquidity/order-flow state;
- volatility/regime;
- auction state;
- structural age/history.

No extrapolation outside common support.

## 19. Future D16 ladder

N0 RAW_OPENING_ZONE_RESPONSE

N1 OPENING_AUCTION_PHASE_CONTROLLED

N2 PRIOR_CLOSE_ANCHOR_GEOMETRY_CONTROLLED

N3 OVERNIGHT_GAP_SIZE_CONTROLLED

N4 FIRM_SPECIFIC_OVERNIGHT_EVENT_CONTROLLED

N5 MARKET_SECTOR_GLOBAL_OVERNIGHT_MOVE_CONTROLLED

N6 PREOPEN_FUTURES_SIGNAL_CONTROLLED

N7 PREOPEN_OPTIONS_SIGNAL_CONTROLLED

N8 PREOPEN_SPOT_INDICATIVE_STATE_CONTROLLED

N9 OPENING_ORDER_FLOW_LIQUIDITY_CONTROLLED

N10 GENERIC_OVERNIGHT_SHOCK_COMPARATOR_CONTROLLED

N11 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE

N12 MULTI_DATE_MULTI_SYMBOL_MULTI_OVERNIGHT_REGIME_REPLICATION

## 20. Interpretation states

Q0 PREVIOUS_CLOSE_ANCHOR_EXPLANATION

Q1 OVERNIGHT_INFORMATION_EXPLANATION

Q2 PREOPEN_DERIVATIVE_PRICE_DISCOVERY_EXPLANATION

Q3 OPENING_AUCTION_ORDER_FLOW_EXPLANATION

Q4 OPENING_OVERREACTION_CORRECTION_EXPLANATION

Q5 MULTIPLE_OVERNIGHT_CHANNELS

Q6 STRUCTURAL_RESPONSE_RESIDUAL

Q7 OVERNIGHT_CONTEXT_UNKNOWN

Q8 NOT_EVALUABLE

None proves alpha.

## 21. SDA-001 information-root boundary

Previous close, opening print and D01 structure all share PRICE_OHLC ancestry.

Pre-open derivative/news receipts are context, not automatic independent votes.

Default:
effectiveIndependentEvidenceCount = 1 within one parent until D16 validates residual dependence structure.

## 22. SDA-002 no-lookahead

Every receipt requires:
- firstObservableAt;
- knownAt;
- predictorFreezeAt;
- source/version/hash;
- replaySafe.

Later news classification, final opening data or later derivative states cannot rewrite the predictor snapshot.

## 23. Required manifest fields

Per opening opportunity:
- parentDecisionId;
- symbol;
- sessionDate;
- priorClosePrice;
- priorCloseKnownAt;
- openingFinalPrice;
- openingFinalPrintKnownAt;
- predictorFreezeAt;
- endpointWindowStart;
- structuralRootId;
- structuralVersionId;
- boundaryLower/Upper;
- priorCloseZoneDistance;
- openingZoneDistance;
- overnightGapPrice;
- overnightGapAtr;
- overnightGapPct;
- openingGapCrossing;
- overnightContextStates;
- corporateEventReceipt;
- marketSectorReceipt;
- globalMacroReceipt;
- futuresReceipt;
- optionsReceipt;
- preopenIndicativeReceipt;
- openingLiquidityReceipt;
- regimeReceipt;
- informationRoot;
- effectiveIndependentEvidenceCount;
- replaySafe;
- evaluabilityReason;
- manifestVersion/hash.

No future return field.

## 24. Current decision

OVERNIGHT_GAP_EQUALS_STRUCTURAL_RESPONSE =
FALSE.

PREVIOUS_CLOSE_ANCHOR_EQUALS_STRUCTURE =
FALSE.

PREOPEN_INDICATIVE_CROSSING_EQUALS_EXECUTED_CROSSING =
FALSE.

OPENING_PRINT_CAN_BE_PREDICTOR_AND_SAME_OUTCOME =
FALSE.

NO_VERIFIED_NEWS_EQUALS_NO_OVERNIGHT_INFORMATION =
FALSE.

SAME_DIRECTION_PREOPEN_DERIVATIVE_SIGNAL_EQUALS_CONFIRMATION =
FALSE.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 25. Exact next continuation

1. Build deterministic overnight-context / prior-close geometry / opening-gap clock helpers and adversarial tests.
2. Preserve firm/news, market/sector/global, futures, options, indicative spot and previous-close channels separately.
3. Consume D08/D09/D12/D03/D04/D05/D18 owner receipts rather than inventing a D01 overnight model.
4. Hand N0-N12 / Q0-Q8 residual inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate structural response from daily price-limit carryover and limit-hit queue mechanics across overnight/opening transitions.
7. No outcome join / no runtime wiring / no Formal change.
