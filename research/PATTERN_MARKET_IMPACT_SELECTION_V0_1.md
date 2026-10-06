# D01 DL-057 — Structural Rejection vs Order-Size / Participation-Rate Market-Impact Selection V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / MARKET_IMPACT_SELECTION_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-056 separated passive/aggressive execution selection and fee economics from structural rejection.

DL-057 freezes the next falsification:

> A price move away from a structural zone after an order is submitted can be caused partly by the trader's own order size, participation rate, urgency and execution schedule.

Without this separation, a mechanically induced price move can be misclassified as support/resistance efficacy.

No return outcome is opened in this tranche.

## 2. Evidence context

Market-impact literature supports several robust mechanism facts:

- executed buy flow tends to move price upward and sell flow downward;
- impact grows with executed quantity and commonly follows a concave square-root-like relationship over broad regimes;
- participation rate can change the impact path, especially at high execution intensity;
- impact can partially decay after execution;
- simultaneous metaorders and correlated order flow can confound naive attribution.

These findings do not prove a universal exact law for Taiwan equities or every order type.

D01 therefore uses them as falsification mechanisms only.

Local venue/instrument/date evidence is required before any numerical market-impact model is treated as calibrated.

## 3. Owner boundary

D05 remains the microstructure owner for:
- order book state;
- spread/depth;
- queue dynamics;
- order/trade event clocks;
- realized execution sequence;
- liquidity and resiliency receipts.

D10 remains execution/risk owner where portfolio execution semantics apply.

D01 owns only the relationship between owner-certified execution/impact state and the frozen structural zone.

D01 does not reconstruct market impact from candles.

## 4. Structural opportunity vs execution intervention

Freeze two clocks:

STRUCTURAL_OPPORTUNITY_AT
- the first causally valid zone interaction opportunity.

EXECUTION_INTERVENTION_AT
- when the actual order/metaorder starts affecting the market.

The structural predictor snapshot must be frozen before execution intervention whenever the research question asks whether the zone itself has predictive content.

If execution begins before predictor freeze:
STRUCTURAL_BASELINE_CONTAMINATED_BY_EXECUTION.

## 5. Market-impact exposure fields

For real submitted orders/metaorders store where owner receipts support them:

- side;
- orderSizeShares;
- orderNotional;
- executedQuantity;
- executedVolumeFraction;
- participationRate;
- executionDuration;
- childOrderCount;
- aggressiveQuantity;
- passiveQuantity;
- averageSpread;
- visibleDepth;
- volatilityScale;
- startPrice;
- endPrice;
- executionVWAP;
- marketVWAP;
- impactMeasurementClock;
- marketImpactModelReceipt;
- localCalibrationStatus.

No hypothetical order receives verified realized-impact fields.

## 6. Participation rate

ParticipationRate is conceptually:
executed trader volume / contemporaneous market volume over the execution interval.

It is not:
shares / daily volume by default.

The denominator must match the owner-defined execution interval and data clock.

Missing interval market volume:
PARTICIPATION_RATE_UNKNOWN.

No imputation from daily ADV is promotion-grade unless explicitly preregistered as a proxy.

## 7. Order size and participation rate are separate

Two orders can have equal total size but different execution intensity.

Therefore preserve:
TOTAL_SIZE_EFFECT
and
PARTICIPATION_RATE_EFFECT
as separate mechanism families.

Do not collapse them into one "large order" flag.

No universal threshold for:
- large order;
- high participation;
- aggressive participation
is defined in D01.

## 8. Impact measurement states

Possible states:

M0 NO_REAL_ORDER
M1 ORDER_SUBMITTED_IMPACT_UNMEASURED
M2 IMPACT_MEASUREMENT_PARTIAL
M3 LOCAL_IMPACT_RECEIPT_VALID
M4 IMPACT_MODEL_PROXY_ONLY
M5 IMPACT_DATA_BLOCKED

A structural rejection study that only has M0/M1 cannot claim realized execution impact.

## 9. Baseline vs post-treatment fields

### Baseline-eligible

Known at/before predictor freeze:
- planned order size;
- planned participation cap;
- ex-ante execution policy;
- current spread/depth/liquidity receipt;
- volatility state;
- zone geometry;
- parent structural state.

### Post-treatment

Known only after execution begins:
- realized executed quantity;
- realized participation rate;
- realized fills;
- realized implementation shortfall;
- peak impact;
- temporary/permanent impact estimate;
- post-execution reversion;
- realized cancellation/repost path.

Post-treatment fields may be used in mechanism decomposition but cannot be backfilled into the structural predictor baseline.

## 10. Own-impact contamination state

A structural response window can be:

I0 PRE_EXECUTION_RESPONSE
- price response observed before any submitted order could have materially intervened.

I1 EXECUTION_OVERLAP_RESPONSE
- structural response overlaps actual execution.

I2 POST_EXECUTION_DECAY_WINDOW
- response measured after execution completion while impact may still be decaying.

I3 NO_EXECUTION_REFERENCE
- no real order submitted.

I4 CONTAMINATION_UNKNOWN
- event clock insufficient.

These must not be pooled silently.

## 11. Directional contamination

For a buy order near support:
own impact can mechanically push price upward.

For a sell order near resistance:
own impact can mechanically push price downward.

These directions can mimic "successful rejection."

Opposite-side orders can instead weaken or mask a structural response.

Therefore store:
alignmentWithExpectedStructuralResponse =
ALIGNED / OPPOSED / NEUTRAL_OR_UNKNOWN.

Alignment is a contamination descriptor, not evidence strength.

## 12. Generic market-impact comparator

Future comparison should include:

G0 GENERIC_IMPACT_EVENT
- real order/metaorder of comparable size/participation/liquidity context away from the target structural zone.

G1 ZONE_ASSOCIATED_IMPACT_EVENT
- comparable execution near the structural zone.

If G1 adds no residual representation beyond G0:
generic market impact is sufficient.

## 13. No impact-model laundering

A fitted square-root or other impact model is not ground truth.

Preserve:
- model family;
- calibration sample;
- venue/instrument;
- calibration date range;
- out-of-sample status;
- residual diagnostics;
- model version.

Foreign-market parameters may not be imported as Taiwan calibration.

## 14. Simultaneous order-flow confounding

Other traders may execute correlated or opposing metaorders at the same time.

If external concurrent order-flow coverage is unavailable:
OTHER_METAORDER_CONFOUND_UNKNOWN.

Do not attribute all observed price movement to the user's/metaorder's own impact.

## 15. Post-execution decay

Impact can relax after execution.

Therefore a bounce that reverses after the order ends may represent:
- transient market impact;
- structural response;
- information content;
- correlated order flow;
- some combination.

D01 defines no universal permanent-impact fraction.

No fixed 2/3 or 1/2 permanence assumption is imported.

## 16. Opportunity denominator

Preserve:
- structural opportunities with no order;
- planned but not submitted orders;
- submitted unfilled;
- partial;
- fully filled;
- cancelled;
- rejected;
- execution-overlap;
- post-execution windows;
- data-blocked cases.

A fill-only denominator is prohibited.

## 17. Future D16 ladder

Future inference should preserve:

X0 RAW_ZONE_RESPONSE
X1 DL055_QUEUE_LATENCY_HIDDEN_CONTROLLED
X2 DL056_EXECUTION_SELECTION_FEE_CONTROLLED
X3 ORDER_SIZE_CONTROLLED
X4 PARTICIPATION_RATE_CONTROLLED
X5 EXECUTION_OVERLAP_TIMING_CONTROLLED
X6 OWN_IMPACT_ALIGNMENT_CONTROLLED
X7 POST_EXECUTION_DECAY_CONTROLLED
X8 GENERIC_IMPACT_COMPARATOR_CONTROLLED
X9 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE
X10 MULTI_DATE_MULTI_SYMBOL_LOCAL_CALIBRATION

Future interpretation:

Q0 ORDER_SIZE_EXPLANATION
Q1 PARTICIPATION_RATE_EXPLANATION
Q2 OWN_IMPACT_ALIGNMENT_EXPLANATION
Q3 TEMPORARY_IMPACT_DECAY_EXPLANATION
Q4 GENERIC_MARKET_IMPACT_EXPLANATION
Q5 CONCURRENT_ORDER_FLOW_UNRESOLVED
Q6 STRUCTURAL_REJECTION_RESIDUAL
Q7 LOCAL_CALIBRATION_NOT_VALID
Q8 NOT_EVALUABLE

None authorizes Formal alpha.

## 18. SDA-001 / SDA-002

SDA-001 remains open:
- order size;
- participation rate;
- impact;
- queue;
- fill;
- fee;
- structural zone

are linked mechanism observations from the same parent.

effectiveIndependentEvidenceCount remains 1 by default.

SDA-002 remains open:
all execution/impact receipts retain:
- firstObservableAt;
- knownAt;
- predictorFreezeAt;
- executionStartAt;
- replaySafe.

Future realized impact cannot rewrite the baseline predictor.

## 19. Required manifest fields

Per parent/opportunity:
- parentDecisionId;
- structuralRootId;
- structuralVersionId;
- symbol;
- venue;
- instrument;
- structuralOpportunityAt;
- predictorFreezeAt;
- executionDecisionAt;
- orderSubmitAt;
- executionStartAt;
- executionEndAt;
- side;
- plannedOrderSize;
- plannedParticipationCap;
- realizedExecutedQuantity;
- realizedParticipationRate;
- executionDuration;
- impactMeasurementState;
- ownImpactAlignment;
- startPrice;
- endPrice;
- executionVWAP;
- marketVWAP;
- modelFamily;
- localCalibrationStatus;
- concurrentOrderFlowStatus;
- responseWindowClass;
- replaySafe;
- dataBlockReason;
- manifestVersion/hash.

No future stock-return field belongs in this manifest.

## 20. Current decision

OWN_ORDER_FLOW_CAN_MIMIC_STRUCTURAL_REJECTION =
TRUE.

ORDER_SIZE_EQUALS_PARTICIPATION_RATE =
FALSE.

HYPOTHETICAL_TOUCH_EQUALS_REAL_IMPACT =
FALSE.

FOREIGN_IMPACT_PARAMETERS_ARE_LOCAL_CALIBRATION =
FALSE.

REALIZED_IMPACT_IS_BASELINE_PREDICTOR =
FALSE.

FILL_ONLY_SAMPLE_ALLOWED =
FALSE.

FIXED_PERMANENT_IMPACT_FRACTION =
NOT_DEFINED.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 21. Exact next continuation

1. Build deterministic impact-exposure / timing-contamination classifier and adversarial tests.
2. Preserve order size, participation rate, execution timing and impact decay separately.
3. Keep real-order vs hypothetical cases fail-closed.
4. Hand X0-X10 / Q0-Q8 market-impact residual inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate structural rejection from information content / alpha of the initiating order so informed trading is not misread as zone efficacy.
7. No runtime wiring / no Formal change.
