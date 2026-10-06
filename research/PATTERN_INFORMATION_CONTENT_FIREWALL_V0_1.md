# D01 DL-058 — Structural Rejection vs Information Content / Initiating-Order Alpha V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / INFORMATION_CONTENT_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-057 separated structural response from order-size / participation-rate market impact.

DL-058 freezes the next falsification:

> A trade initiated near a structural zone may move in the "correct" direction because the initiating decision itself contains information or predictive alpha, not because the zone caused the response.

Mechanical impact and information content must remain separate from structural-zone efficacy.

No return outcome is opened in this tranche.

## 2. Evidence context

Market microstructure literature distinguishes:
- mechanical price impact caused by order flow itself;
- informational components associated with trades that are correlated with future order flow / future price dynamics;
- adverse-selection effects faced by liquidity providers trading against better-informed flow.

Empirical work finds uninformed / isolated metaorders can exhibit temporary impact that decays more fully, while more informationally correlated order flow can leave more persistent price displacement.

These findings are mechanism evidence.
They do not prove that any given Taiwan order is informed.

## 3. Owner boundary

D05 owns:
- adverse selection;
- order-flow toxicity;
- post-trade markout semantics;
- order-book / trade clocks;
- microstructure receipt quality.

D10 owns execution-quality and implementation-shortfall semantics where applicable.

D01 owns only:
- whether structural-zone interpretation survives owner-certified information/adverse-selection context.

D01 does not infer informed trading from OHLCV alone.

## 4. Initiating decision identity

For a real order / decision preserve:
- initiatingDecisionId;
- parentDecisionId;
- side;
- decisionAt;
- orderSubmitAt;
- structuralOpportunityAt;
- predictorFreezeAt;
- strategySignalId if any;
- externalInformationReceiptId if any;
- initiatingSignalKnownAt;
- informationClass;
- replaySafe.

Information content cannot be inferred merely from later profitability.

## 5. Information classes

Frozen research states:

I0 INFORMATION_CONTENT_UNKNOWN
I1 EX_ANTE_SIGNAL_RECEIPT_PRESENT
I2 EXTERNAL_INFORMATION_RECEIPT_PRESENT
I3 MICROSTRUCTURE_ADVERSE_SELECTION_PROXY_PRESENT
I4 INFORMATION_PROXY_ONLY
I5 INFORMATION_RECEIPT_DATA_BLOCKED

These states describe observable pre-trade information context.
They are not proof of true private information.

## 6. Outcome-leakage firewall

Prohibited definitions:
- profitable trade = informed;
- permanent positive markout = informed;
- successful breakout = informed;
- persistent post-trade price move = informed.

Those are outcome-side observations.

Information classification must be frozen from fields known at or before predictorFreezeAt.

## 7. Mechanical vs informational decomposition

Keep separate:

MECHANICAL_IMPACT_CONTEXT
- order size;
- participation rate;
- urgency;
- execution schedule;
- liquidity/depth;
- own-impact alignment.

INFORMATION_CONTEXT
- ex-ante strategy signal;
- external event/news receipt;
- owner-certified adverse-selection proxy;
- pre-trade order-flow state;
- other PIT information receipt.

STRUCTURAL_CONTEXT
- root/version;
- role;
- zone geometry;
- age;
- path;
- regime.

No composite "smart money" score is defined.

## 8. Persistent price displacement

A persistent post-trade move can reflect:
- information;
- correlated external order flow;
- structural response;
- permanent market impact;
- regime drift;
- mixtures.

D01 does not define any permanent impact fraction as information truth.

## 9. Generic informed-order comparator

Future comparison:

G0 INFORMED_OR_SIGNALLED_ORDER_AWAY_FROM_ZONE
- similar ex-ante signal / information class;
- comparable side / size / participation / liquidity / regime;
- no target structural-zone interaction.

G1 INFORMED_OR_SIGNALLED_ORDER_AT_ZONE
- same context but occurs at the structural zone.

If G1 adds no residual representation beyond G0:
initiating-order information is sufficient.

## 10. Generic zone comparator without initiating signal

Complementary comparison:

Z0 ZONE_EVENT_NO_INFORMATION_RECEIPT
Z1 ZONE_EVENT_WITH_INFORMATION_RECEIPT

This asks whether structural response exists when the initiating information channel is absent / unknown.

UNKNOWN is not zero.
No-information-receipt does not mean truly uninformed.

## 11. Adverse-selection proxies

Owner-certified D05 proxies may include:
- post-trade markout labels;
- order-flow toxicity diagnostics;
- spread/depth reaction;
- counterparty-side context where legally/technically available.

But post-trade markout is outcome-side.

It may support mechanism decomposition, not pre-trade information classification.

## 12. Timing states

Preserve:
- informationKnownAt;
- decisionAt;
- predictorFreezeAt;
- orderSubmitAt;
- firstFillAt;
- executionEndAt;
- postTradeMarkoutKnownAt;
- outcomeKnownAt.

Hard rule:
informationKnownAt > predictorFreezeAt
=> POST_HOC_INFORMATION_NOT_ELIGIBLE.

## 13. External event/news receipts

If a decision is linked to public information:
- source;
- release timestamp;
- first-known timestamp;
- ingest timestamp;
- event identity;
- semantic category;
- replaySafe.

Late-ingested or later-revised news may not rewrite the earlier predictor.

D11 remains event-clock owner where applicable.

## 14. Strategy-signal receipts

If initiating alpha comes from another research/system signal:
- source system;
- signal version;
- signal generatedAt;
- informationRoot;
- lineage;
- replaySafe.

Same underlying PRICE_OHLC signal cannot be treated as independent evidence from the D01 structural pattern unless residual incrementality is validated.

## 15. Information-root firewall

Examples:
- D01 pattern signal from PRICE_OHLC;
- D03 trend signal from PRICE_OHLC;
- initiating momentum signal from PRICE_OHLC.

These may be different representations but share one information root.

A correct initiating signal does not become independent evidence simply because it has another name.

SDA-001 remains active.

## 16. Information content vs execution impact

Four mechanism states are useful:

M0 LOW/UNKNOWN INFORMATION + LOW/UNKNOWN OWN IMPACT
M1 HIGHER INFORMATION PROXY + LOW OWN IMPACT
M2 LOW/UNKNOWN INFORMATION + HIGH OWN IMPACT
M3 HIGHER INFORMATION PROXY + HIGH OWN IMPACT

These are research cells, not thresholds or scores.

D16 owns eventual inference.

## 17. Future D16 ladder

Y0 RAW_ZONE_RESPONSE
Y1 DL057_MARKET_IMPACT_CONTROLLED
Y2 EX_ANTE_SIGNAL_CLASS_CONTROLLED
Y3 EVENT/NEWS_INFORMATION_CONTROLLED
Y4 ADVERSE_SELECTION_CONTEXT_CONTROLLED
Y5 SAME_INFORMATION_ROOT_DEDUPED
Y6 GENERIC_INFORMED_ORDER_COMPARATOR_CONTROLLED
Y7 NO_INFORMATION_RECEIPT_ZONE_REFERENCE
Y8 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE
Y9 MULTI_DATE_MULTI_SYMBOL_MULTI_INFORMATION_CLASS

Future interpretation:

Q0 INITIATING_SIGNAL_EXPLANATION
Q1 EXTERNAL_INFORMATION_EXPLANATION
Q2 ADVERSE_SELECTION_EXPLANATION
Q3 SAME_INFORMATION_ROOT_ALIAS
Q4 INFORMATION_PLUS_MECHANICAL_IMPACT
Q5 STRUCTURAL_REJECTION_RESIDUAL
Q6 INFORMATION_STATUS_UNKNOWN
Q7 NOT_EVALUABLE

None authorizes Formal alpha.

## 18. Opportunity denominator

Preserve:
- zone opportunities with no order;
- real orders with information unknown;
- real orders with ex-ante signal receipt;
- real orders with external information receipt;
- proxy-only information cases;
- data-blocked information cases;
- no-fill / partial / fill / cancel states from DL056/057.

Do not restrict to profitable or persistent-price cases.

## 19. SDA-001 / SDA-002

SDA-001:
all price-derived initiating signals and D01 geometry retain common PRICE_OHLC lineage by default.

SDA-002:
information and signal receipts require:
- firstObservableAt / knownAt;
- predictorFreezeAt;
- replaySafe;
- no future revision leakage.

## 20. Required manifest fields

- parentDecisionId;
- initiatingDecisionId;
- structuralRootId;
- structuralVersionId;
- symbol;
- side;
- structuralOpportunityAt;
- predictorFreezeAt;
- decisionAt;
- orderSubmitAt;
- informationClass;
- informationKnownAt;
- externalInformationReceiptId;
- strategySignalId;
- strategySignalVersion;
- strategySignalGeneratedAt;
- signalInformationRoot;
- adverseSelectionProxyState;
- mechanicalImpactState;
- ownImpactAlignment;
- postTradeMarkoutKnownAt;
- replaySafe;
- dataBlockReason;
- manifestVersion/hash.

No future return / profitability field belongs in this manifest.

## 21. Current decision

PROFITABLE_ORDER_EQUALS_INFORMED =
FALSE.

PERSISTENT_POST_TRADE_MOVE_EQUALS_INFORMATION =
FALSE.

POST_TRADE_MARKOUT_IS_BASELINE_INFORMATION =
FALSE.

SAME_PRICE_SIGNAL_DIFFERENT_NAME_EQUALS_INDEPENDENT_EVIDENCE =
FALSE.

INFORMATION_UNKNOWN_EQUALS_UNINFORMED =
FALSE.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 22. Exact next continuation

1. Build deterministic information-receipt eligibility / timing / lineage helper and adversarial tests.
2. Preserve mechanical impact, information context and structural context separately.
3. Preserve UNKNOWN vs no-receipt vs proxy-only information states.
4. Hand Y0-Y9 / Q0-Q7 information-content residual inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate structural rejection from correlated external order-flow / crowding so same-direction follow-through is not attributed to one initiating decision or one zone.
7. No runtime wiring / no Formal change.
