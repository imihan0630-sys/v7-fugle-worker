# D01 DL-055 — Structural Rejection vs Queue-Position / Latency / Hidden-Liquidity Execution Effects V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / EXECUTION_IDENTIFIABILITY_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-054 separated durable displayed liquidity from same-price replacement, cancellation/repost cycling and quote flicker.

DL-055 freezes the next execution-layer falsification:

> A structural-zone response can look strong because some passive orders at that price obtained favorable queue priority, because faster participants canceled/reposted before adverse moves, or because hidden / iceberg liquidity absorbed flow that was not visible in public depth.

These are execution/microstructure mechanisms, not proof of structural memory.

No return outcome is opened in this tranche.

## 2. Evidence context

Queue-position and latency research shows:
- same-price limit orders have different execution probability depending on queue ahead / order priority;
- latency changes whether an order reaches, retains or loses a favorable position;
- cancel/reinsert decisions interact with adverse selection and fill probability.

Hidden-liquidity literature shows:
- displayed depth can understate total executable liquidity;
- iceberg/reserve orders can replenish visible quantity after executions;
- repeated executions with weak price progress are compatible with hidden/replenishing liquidity, but public top-five data alone do not prove an iceberg.

Therefore:
PRICE_TOUCHED != HYPOTHETICAL_LIMIT_FILLED.
VISIBLE_DEPTH != TOTAL_LIQUIDITY.
REPEATED_FILL_PATTERN != ICEBERG_CONFIRMED.

## 3. Owner boundaries

D05 owns:
- queue/order priority semantics;
- QUEUE_AHEAD_PROXY;
- fill-probability / execution-confidence methodology;
- quote/trade event clock;
- own-order lifecycle if available;
- hidden-liquidity / iceberg inference boundary;
- spread, depth, markout and adverse-selection controls.

D01 owns:
- frozen structural zone;
- structural opportunity;
- relation between owner-certified execution context and zone geometry;
- structural-memory vs execution-mechanism interpretation.

D01 does not estimate exact personal queue rank from public top-five depth.

## 4. Four estimands must remain separate

### E0 — STRUCTURAL_DIRECTIONAL_RESPONSE
Did price respond around the frozen zone?

### E1 — EXECUTABLE_PRICE_QUALITY
What price was realistically available at decision/opportunity time?

### E2 — PASSIVE_FILL_FEASIBILITY
Could a hypothetical passive order plausibly fill under conservative queue/volume evidence?

### E3 — HIDDEN_LIQUIDITY_MECHANISM
Is observed execution/price behavior compatible with hidden/replenishing liquidity?

Passing one estimand does not imply another.

## 5. Queue position is not observable from top-five aggregate depth

Without own order ID / complete per-order sequencing:

Allowed:
- QUEUE_AHEAD_PROXY;
- displayedQuantityAheadProxy;
- tradedVolumeAtOrThroughPrice;
- timeExecutable;
- priceMovedThroughLimit;
- conservativeFillState.

Prohibited:
- EXACT_QUEUE_RANK;
- TRUE_FILL_PROBABILITY;
- guaranteed passive fill.

## 6. Conservative passive-fill states

F0 NOT_REACHED
Price never became executable under the frozen limit definition.

F1 TOUCHED_NOT_ENOUGH_EVIDENCE
Price touched, but queue/volume evidence is insufficient.

F2 TRADED_AT_PRICE_QUEUE_UNRESOLVED
Trades occurred at the price but hypothetical order queue priority is unknown.

F3 TRADED_THROUGH_CONSERVATIVE_FILL_CANDIDATE
Price/volume moved through the limit under a preregistered conservative fill rule.

F4 OWN_ORDER_FILL_VERIFIED
Only when actual broker/exchange order lifecycle proves execution.

D01 does not define the production fill model.

## 7. Low-touch backtest firewall

A candle low equal to a planned buy price does not prove passive execution.

Historical OHLC-only logic:
LOW_TOUCHED_LIMIT -> DESCRIPTIVE_ONLY.

It may not become:
VERIFIED_FILL.

This firewall is mandatory for any future zone-rejection event study involving hypothetical entry prices.

## 8. Queue-ahead proxy timing

QUEUE_AHEAD_PROXY is valid only if:
- captured before order-decision / opportunity cutoff;
- source coverage is valid;
- session/tick state is known;
- no later cancellations/executions are backfilled.

Later queue depletion is an execution-path outcome/mediator.

## 9. Latency

Latency can change:
- whether observed depth still exists when an order arrives;
- queue priority;
- cancellation/reinsert opportunity;
- marketable-vs-passive execution state.

D01 does not assume a universal microsecond threshold.

Future analysis may use owner-certified:
- observationToDecisionLatency;
- decisionToOrderLatency;
- marketDataAgeAtDecision;
- quoteAge;
- staleQuote flag;
- latency regime.

Missing latency provenance -> LATENCY_CONTEXT_UNKNOWN.

## 10. Latency advantage is not stock alpha

Faster access can improve execution without improving directional selection.

Future inference must not convert:
lower latency -> stronger stock-selection signal.

Latency belongs to execution/mechanism conditioning.

## 11. Hidden liquidity / iceberg boundary

Public evidence can support:

HIDDEN_LIQUIDITY_CANDIDATE when:
- executed volume materially exceeds displayed quantity under valid event sequencing;
- visible quantity repeatedly replenishes after executions;
- price progress remains weak relative to aggressive flow;
- alternative public-depth explanations are controlled.

But:
HIDDEN_LIQUIDITY_CONFIRMED is prohibited without authoritative order-type / exchange evidence.

## 12. Iceberg replenishment and queue reset

Some venues/order types can refresh displayed iceberg quantity with altered time priority.

Therefore visible replenishment can change queue position even while the hidden parent order remains economically related.

D01 stores owner receipt only.
It does not infer venue-specific priority unless officially documented for the relevant market/order type.

## 13. Structural-zone comparator

Primary falsification:

G0 GENERIC_EXECUTION_ADVANTAGE
- comparable queue/fill/latency/hidden-liquidity context at non-structural or matched salient price locations.

G1 ZONE_EXECUTION_CONTEXT
- comparable context at the frozen structural zone.

If G1 adds no representation beyond G0, execution mechanics can explain the apparent zone advantage.

## 14. Hidden-liquidity vs structural-memory comparator

Possible future states:

H0 PUBLIC_DEPTH_SUFFICIENT
Observed executions/price response are explainable by visible depth.

H1 HIDDEN_LIQUIDITY_COMPATIBLE
Behavior exceeds public-depth explanation but is not directly identified.

H2 OWNER_VERIFIED_HIDDEN_LIQUIDITY
Only authoritative source proves hidden/iceberg order type.

H3 NOT_IDENTIFIABLE
Event sequencing/source coverage insufficient.

Do not collapse H1 into H2.

## 15. Timing firewall

Mandatory clocks:
- structuralOpportunityAt;
- predictorFreezeAt;
- quoteCapturedAt;
- decisionAt;
- hypotheticalOrderAt;
- firstExecutableAt;
- firstTradeAtLimitAt;
- queueDepletionObservedAt;
- conservativeFillKnownAt;
- hiddenLiquidityPatternKnownAt.

Only fields known by predictorFreezeAt may be baseline.

Later fill / queue depletion / hidden-liquidity pattern is post-treatment mechanism/outcome evidence.

## 16. Session / priority-rule firewall

TWSE continuous trading / auctions / VI / price limits have different execution mechanics.

Queue/fill analysis must preserve:
- matching mechanism;
- price priority;
- time priority where applicable;
- auction state;
- odd-lot / regular-lot state;
- tick band;
- price-limit state.

Do not transfer one queue model across mechanisms silently.

## 17. Future D16 ladder

R0 RAW_ZONE_RESPONSE
R1 DL054_PERSISTENCE_CONTROLLED
R2 EXECUTABLE_PRICE_CONTROLLED
R3 QUEUE_AHEAD_PROXY_CONTROLLED
R4 PASSIVE_FILL_FEASIBILITY_SEPARATED
R5 LATENCY_CONTEXT_CONTROLLED
R6 PUBLIC_DEPTH_VS_HIDDEN_COMPATIBILITY_SEPARATED
R7 GENERIC_EXECUTION_ADVANTAGE_CONTROLLED
R8 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE
R9 OWN_ORDER_OR_INDEPENDENT_REPLICATION

Interpretations:
Q0 TOUCH_FILL_BIAS
Q1 QUEUE_PRIORITY_EXPLANATION
Q2 LATENCY_EXECUTION_EXPLANATION
Q3 HIDDEN_LIQUIDITY_COMPATIBLE
Q4 GENERIC_EXECUTION_MECHANICS_SUFFICIENT
Q5 STRUCTURAL_REJECTION_RESIDUAL
Q6 EXECUTION_NOT_IDENTIFIABLE
Q7 NOT_EVALUABLE

## 18. Common support

Future comparisons require overlap in:
- tick tier;
- session / matching mechanism;
- spread;
- displayed depth;
- transaction intensity;
- queue-ahead proxy;
- latency / quote age;
- volatility/liquidity regime;
- structural opportunity direction;
- DL-052/053/054 mechanism state.

## 19. SDA-001 / sample identity

Structural response, queue context, fill feasibility and hidden-liquidity receipts belong to one causal opportunity.

They are not independent confirmation votes.

effectiveIndependentEvidenceCount remains 1 by default.

## 20. SDA-002 / no-lookahead

Later:
- trades through the limit;
- queue depletion;
- fill verification;
- hidden-liquidity pattern recognition

cannot become pre-freeze predictors.

A future-confirmed fill pattern cannot explain the earlier decision state.

## 21. Required manifest fields

Per opportunity:
- parentDecisionId;
- structuralRootId;
- structuralVersionId;
- frozenBoundaryLower/Upper;
- orientation;
- structuralOpportunityAt;
- predictorFreezeAt;
- matchingMechanism;
- sessionState;
- tickBand;
- quoteCapturedAt;
- quoteAgeAtFreeze;
- displayedDepth;
- queueAheadProxy;
- queueProxyProvenance;
- hypotheticalLimitPrice;
- firstExecutableAt;
- firstTradeAtLimitAt;
- tradedVolumeAtLimit;
- priceMovedThroughLimit;
- conservativeFillState;
- conservativeFillKnownAt;
- ownOrderFillVerified;
- latencyReceipt;
- hiddenLiquidityReceipt;
- hiddenLiquidityState;
- hiddenLiquidityPatternKnownAt;
- replaySafe;
- timingRole;
- manifestVersion/hash.

No future return outcome belongs in the research manifest.

## 22. Current decision

LOW_TOUCH_EQUALS_FILL =
FALSE.

PUBLIC_TOP5_EQUALS_TOTAL_LIQUIDITY =
FALSE.

QUEUE_AHEAD_PROXY_EQUALS_EXACT_QUEUE_RANK =
FALSE.

HIDDEN_LIQUIDITY_CANDIDATE_EQUALS_CONFIRMED_ICEBERG =
FALSE.

LATENCY_ADVANTAGE_EQUALS_SELECTION_ALPHA =
FALSE.

POST_FILL_INFORMATION_AS_BASELINE =
PROHIBITED.

D05_OWNER_EXECUTION_RECEIPT_REQUIRED =
TRUE.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 23. Exact next continuation

1. Build deterministic conservative-fill / queue-proxy / hidden-liquidity identifiability guards and adversarial tests.
2. Preserve directional response, executable-price quality, fill feasibility and hidden-liquidity mechanism as distinct estimands.
3. Reject LOW_TOUCHED_LIMIT as verified fill.
4. Hand R0-R9 / Q0-Q7 common-support and execution-mechanism inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate structural rejection from adverse-selection markout after passive fills, because a filled bid near support can be followed by negative drift even when the structural level eventually holds.
7. No runtime wiring / no Formal change.
