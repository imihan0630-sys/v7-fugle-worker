# D01 DL-055 — Structural Rejection vs Queue Priority / Latency / Hidden-Liquidity Execution Effects V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / EXECUTION_MECHANISM_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-054 separated durable displayed depth from same-price replacement / quote flicker.

DL-055 freezes the next mechanism firewall:

> When price appears to reject a structural zone, how much of that behavior could be explained by queue priority, execution latency, or hidden liquidity rather than structural memory?

A price level may appear "defended" because:
- earlier passive orders have time priority;
- later orders have lower fill probability;
- visible top-5 depth understates total executable liquidity;
- hidden / iceberg liquidity absorbs aggressive flow;
- execution frictions shape observed prints before any structural mechanism is needed.

No return outcome is opened in this tranche.

## 2. External evidence context

Queueing research shows:
- electronic limit order books operate under price-time priority;
- queue position affects waiting time / fill probability;
- exact queue rank requires order-level sequencing, not aggregate top-of-book depth.

Hidden-liquidity research shows:
- iceberg orders can replenish displayed size;
- hidden liquidity changes price/order-flow dynamics;
- repeated replenishment can reveal latent liquidity;
- visible depth is therefore not total liquidity.

These mechanisms can coexist with structural zones but do not prove them.

## 3. Owner boundaries

D05 owns:
- queue position / priority;
- queue-ahead proxy;
- own-order lifecycle;
- submit / ack / cancel / fill timestamps;
- fill probability / execution confidence;
- hidden-liquidity / iceberg inference boundaries;
- displayed vs latent liquidity;
- microstructure event-clock validity.

D01 owns:
- frozen structural-zone identity;
- structural opportunity identity;
- relation between D05 owner-certified execution states and the zone;
- structural-vs-execution interpretation.

D01 does not:
- infer exact queue rank from public top-5;
- infer own-order latency without own-order timestamps;
- call repeated replenishment a confirmed iceberg without D05-grade evidence;
- convert execution advantage into directional alpha.

## 4. Queue-priority states

Freeze:

### Q0 — EXACT_QUEUE_POSITION_KNOWN
Requires owner-grade order IDs / sequencing and own-order lifecycle.

### Q1 — QUEUE_AHEAD_PROXY_ONLY
Aggregate displayed depth / traded-through volume supports only a proxy.

### Q2 — QUEUE_POSITION_UNKNOWN
Public/sparse data cannot identify position.

Exact queue rank is never reconstructed from aggregate five-level snapshots.

## 5. Latency states

Separate:
- decisionTimestamp;
- orderSubmitTimestamp;
- exchangeAckTimestamp;
- firstExecutableTimestamp;
- fillTimestamp.

Possible states:
L0 LATENCY_KNOWN
L1 SUBMIT_LATENCY_PARTIAL
L2 ACK_LATENCY_UNKNOWN
L3 NO_OWN_ORDER_LIFECYCLE
L4 NOT_APPLICABLE

A market move before submit/ack is not evidence of structural failure/success for the hypothetical order.

## 6. Hidden-liquidity states

Freeze:

H0 DISPLAYED_ONLY_OBSERVED
- no hidden-liquidity evidence.

H1 HIDDEN_LIQUIDITY_CANDIDATE
- repeated execution / replenishment pattern is consistent with latent liquidity.

H2 OWNER_CONFIRMED_HIDDEN_LIQUIDITY
- only allowed when owner-grade data semantics actually identify hidden/iceberg order behavior.

H3 HIDDEN_LIQUIDITY_UNKNOWN
- public book cannot distinguish.

H1 is not H2.

## 7. Structural rejection vs execution absorption

A zone-local bounce can be consistent with:
- structural rejection;
- queue-ahead passive liquidity;
- hidden liquidity absorption;
- price-time priority concentrating fills;
- adverse selection / market impact;
- mixed mechanisms.

D01 does not force one story.

## 8. Exact queue position is not a stock-selection signal

D05 already freezes:
QUEUE POSITION = EXECUTION CONFIDENCE / FILL-PROBABILITY CONTEXT.

DL-055 preserves this.

Prohibited:
- add queue position as bullish/bearish Pattern vote;
- reward a stock because queue rank is favorable;
- infer alpha from passive-fill probability.

A directionally correct signal and a fillable passive limit are different questions.

## 9. Queue-ahead proxy

If exact order identity is absent, allowed proxy language:
QUEUE_AHEAD_PROXY.

Possible D05-owned inputs:
- displayed shares/notional ahead at the same price;
- traded volume through price after submit;
- cancellations ahead if event-level data are valid;
- time executable;
- price moved through order.

D01 may consume the receipt.
D01 does not define the fill model.

## 10. Hidden liquidity is not committed structural demand

Repeated prints with limited price movement and displayed-depth replenishment may be consistent with hidden liquidity.

But:
- hidden liquidity may be liquidity-motivated;
- hidden liquidity may be informed;
- hidden volume may exist away from the structural zone;
- detection may itself change aggressive trading.

Therefore:
HIDDEN_LIQUIDITY_CANDIDATE != STRUCTURAL_MEMORY.

## 11. Timing firewall

Mandatory clocks:
- structuralOpportunityAt;
- predictorFreezeAt;
- decisionTimestamp;
- orderSubmitTimestamp;
- exchangeAckTimestamp;
- firstExecutableTimestamp;
- hiddenLiquidityFirstIndicatedAt;
- hiddenLiquidityConfirmedAt;
- fillTimestamp;
- priceResponseKnownAt.

Rules:
- post-freeze hidden-liquidity inference is mechanism/outcome-side information;
- fill outcome may not be backfilled into pre-fill predictor;
- future queue depletion may not define earlier queue position.

## 12. Hypothetical vs real orders

If no real submitted order exists:
- no exact own queue rank;
- no actual submit-to-ack latency;
- no implementation shortfall;
- no true fill probability.

Allowed:
- execution proxies;
- queue-ahead proxy;
- executable-price context.

Any hypothetical touch=fill rule is prohibited.

## 13. Generic execution comparator

Primary falsification:

G0 GENERIC_EXECUTION_ADVANTAGE
- matched queue/latency/hidden-liquidity context away from structural zones.

G1 ZONE_ASSOCIATED_EXECUTION_ADVANTAGE
- comparable execution context at frozen structural zones.

If G1 adds no residual representation, generic execution mechanics are sufficient.

## 14. Common-support dimensions

Future D16 controls include:
- relative tick;
- price tier;
- spread;
- displayed depth;
- trade/message intensity;
- queue-ahead proxy;
- latency state;
- hidden-liquidity state;
- session/auction/VI/limit state;
- volatility/liquidity regime;
- structural age;
- DL-052 shock state;
- DL-053 refill state;
- DL-054 persistence/flicker state.

No extrapolation outside support.

## 15. SDA-001 anti-double-counting

One structural opportunity may carry:
- zone state;
- queue proxy;
- latency state;
- displayed depth;
- hidden-liquidity candidate;
- fill/execution receipt.

These are linked mechanism receipts.

Default:
effectiveIndependentEvidenceCount = 1.

Execution-context richness does not multiply Pattern evidence votes.

## 16. SDA-002 timing

Every execution receipt stores:
- firstObservableAt;
- knownAt;
- predictorFreezeAt;
- replaySafe.

Any queue/hidden-liquidity state known only after the opportunity is post-treatment.

## 17. Future D16 ladder

E0 RAW_ZONE_REJECTION
E1 DL054_DEPTH_PERSISTENCE_CONTROLLED
E2 QUEUE_PRIORITY_CONTEXT_CONTROLLED
E3 LATENCY_CONTEXT_CONTROLLED
E4 HIDDEN_LIQUIDITY_CONTEXT_CONTROLLED
E5 GENERIC_EXECUTION_ADVANTAGE_CONTROLLED
E6 OWN_ORDER_LIFECYCLE_CONFIRMED
E7 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE
E8 MULTI_DATE_MULTI_TICK_TIER_REPLICATION

Interpretations:
Q0 QUEUE_PRIORITY_EXPLANATION
Q1 LATENCY_EXPLANATION
Q2 HIDDEN_LIQUIDITY_EXPLANATION
Q3 GENERIC_EXECUTION_MECHANICS_EXPLANATION
Q4 FILL_SELECTION_SENSITIVE
Q5 OWN_ORDER_DATA_REQUIRED
Q6 STRUCTURAL_REJECTION_RESIDUAL
Q7 NOT_EVALUABLE

None proves causal memory or alpha.

## 18. Required manifest fields

Per structural opportunity:
- parentDecisionId;
- structuralRootId;
- structuralVersionId;
- predictorFreezeAt;
- structuralOpportunityAt;
- d05QueueState;
- queueAheadProxyReceipt;
- exactQueuePositionKnown;
- decisionTimestamp;
- orderSubmitTimestamp;
- exchangeAckTimestamp;
- firstExecutableTimestamp;
- hiddenLiquidityState;
- hiddenLiquidityReceipt;
- displayedDepthReceipt;
- dl054PersistenceReceipt;
- realOrderSubmitted;
- fillReceipt;
- timingRole per receipt;
- replaySafe;
- effectiveIndependentEvidenceCount;
- residualIncrementalityStatus;
- manifestVersion/hash.

No return outcome belongs in this manifest.

## 19. Current decision

PUBLIC_TOP5_CAN_IDENTIFY_EXACT_QUEUE =
FALSE.

HYPOTHETICAL_TOUCH_EQUALS_FILL =
FALSE.

HIDDEN_LIQUIDITY_CANDIDATE_EQUALS_ICEBERG_CONFIRMED =
FALSE.

QUEUE_POSITION_IS_DIRECTIONAL_ALPHA =
FALSE.

POST_FREEZE_HIDDEN_LIQUIDITY_AS_BASELINE =
PROHIBITED.

OWN_ORDER_LIFECYCLE_REQUIRED_FOR_EXACT_EXECUTION_CLAIMS =
TRUE.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 20. Exact next continuation

1. Build deterministic queue/latency/hidden-liquidity eligibility helpers and adversarial tests.
2. Preserve exact queue / queue proxy / unknown as separate states.
3. Preserve displayed / candidate-hidden / owner-confirmed-hidden / unknown liquidity as separate states.
4. Reject hypothetical touch-as-fill and post-freeze hidden-liquidity backfill.
5. Hand E0-E8 / Q0-Q7 common-support and execution-selection inference to D16.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate structural rejection from maker/taker fee economics and passive-vs-aggressive execution selection around the zone.
8. No runtime wiring / no Formal change.
