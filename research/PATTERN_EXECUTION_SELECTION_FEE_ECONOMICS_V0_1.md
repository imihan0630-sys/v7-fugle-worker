# D01 DL-056 — Structural Rejection vs Passive/Aggressive Execution Selection and Fee Economics V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / EXECUTION_SELECTION_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-055 separated structural rejection from queue priority, latency and hidden-liquidity execution effects.

DL-056 freezes the next selection firewall:

> When price appears to reject a structural zone, is the observed path partly selected by passive-versus-aggressive execution choice and its fee/friction economics rather than structural memory?

Execution style changes:
- fill probability;
- queue exposure;
- adverse-selection risk;
- spread paid/earned;
- timing;
- which opportunities become observed fills.

Therefore a passive-fill sample and an aggressive-fill sample are different selected populations.

No return outcome is opened in this tranche.

## 2. Taiwan venue boundary

Current TWSE ordinary-stock rules reviewed for this tranche establish:
- price priority and time priority for ordinary matching;
- securities brokers charge customer commissions under filed/published schedules.

Those rules do not by themselves establish a U.S.-style maker-taker rebate schedule for ordinary stock trading.

Therefore D01 must not import:
- maker rebate;
- taker fee;
- liquidity-provider rebate;
- exchange access fee split

unless a venue-specific / instrument-specific / date-specific owner receipt explicitly proves that regime.

Special liquidity-provider incentive programs, such as ETF liquidity-provider programs, are separate instrument/program contexts and cannot be generalized to ordinary equities.

## 3. Fee-regime states

Freeze:

F0 VENUE_FEE_REGIME_VERIFIED_NON_MAKER_TAKER
- owner receipt explicitly establishes the applicable fee regime and no maker/taker split is part of the tested execution cost.

F1 VENUE_MAKER_TAKER_REGIME_VERIFIED
- owner receipt explicitly establishes maker/taker fee or rebate economics for that instrument/venue/date.

F2 BROKER_COMMISSION_ONLY_KNOWN
- customer commission schedule is known but venue-side maker/taker treatment is not established.

F3 FEE_REGIME_UNKNOWN
- insufficient fee provenance.

No state is inferred from another market.

## 4. Execution-style states

Freeze:

E0 PASSIVE_EXECUTION_VERIFIED
- real submitted order;
- execution semantics show liquidity-providing/passive fill under owner-defined rules.

E1 AGGRESSIVE_EXECUTION_VERIFIED
- real submitted order;
- execution semantics show liquidity-taking/aggressive fill.

E2 MIXED_OR_PARTIAL_EXECUTION
- order receives passive/aggressive/partial behavior that cannot be collapsed.

E3 EXECUTION_STYLE_PROXY_ONLY
- only quote-relative or order-type proxy exists.

E4 EXECUTION_STYLE_UNKNOWN
- insufficient own-order / market-state evidence.

No hypothetical trade receives E0/E1.

## 5. Passive fill is a selected outcome

A passive order can fail to fill.

Observed passive fills are therefore selected by:
- queue position;
- incoming marketable flow;
- cancellation/repost;
- price path;
- adverse selection;
- latency;
- hidden liquidity;
- order lifetime.

A study that compares only passive fills with aggressive fills without preserving unfilled/cancelled opportunities can create fill-selection bias.

## 6. Aggressive execution is also selected

Aggressive execution may be chosen when:
- urgency is high;
- price is moving;
- spread/depth state differs;
- signal strength appears different;
- queue risk is unacceptable.

Therefore aggressive-vs-passive is not randomized.

Execution mode is context / treatment selection, not structural evidence.

## 7. Required opportunity denominator

For each structural decision opportunity preserve:
- PASSIVE_ORDER_SUBMITTED;
- PASSIVE_FILLED;
- PASSIVE_PARTIAL;
- PASSIVE_CANCELLED;
- PASSIVE_UNFILLED_STUDY_END;
- AGGRESSIVE_ORDER_SUBMITTED;
- AGGRESSIVE_FILLED;
- ORDER_REJECTED;
- NO_ORDER_SUBMITTED;
- EXECUTION_STATE_UNKNOWN.

Do not build evidence only from completed fills.

## 8. Hypothetical execution firewall

If no real order exists:
- do not infer passive fill from touch;
- do not infer aggressive fill from close/market price;
- do not claim actual commission;
- do not claim actual maker/taker economics;
- do not claim implementation shortfall.

Allowed:
- hypothetical executable-price scenario explicitly labeled as such;
- quoted spread / depth context;
- preregistered conservative execution proxy.

## 9. Fee components remain separate

Possible owner-certified components:
- customer broker commission;
- venue transaction/handling charge where economically borne/relevant;
- maker rebate;
- taker/access fee;
- transaction tax;
- other instrument-specific charges.

Do not combine them into one directional signal.

A lower execution cost does not imply better stock alpha.

## 10. Passive/aggressive economic comparison

Future execution-quality comparison may include:
- gross price response;
- spread paid/saved;
- commission;
- venue fee/rebate if verified;
- fill probability;
- partial-fill rate;
- cancel rate;
- post-fill markout;
- latency;
- opportunity cost of non-fill.

Signal quality and execution quality remain separate estimands.

## 11. Maker/taker external evidence boundary

External maker-taker research shows fee/rebate splits can affect:
- quote aggressiveness;
- routing/order type;
- execution probability;
- commissions;
- market depth.

This mechanism is valid as a research comparison.

It is not automatically applicable to TWSE ordinary stock trading.

Venue transfer requires a verified local fee receipt.

## 12. Structural-zone comparator

Primary falsification:

G0 GENERIC_EXECUTION_SELECTION
- comparable passive/aggressive/fee context away from structural zones.

G1 ZONE_ASSOCIATED_EXECUTION_SELECTION
- comparable execution context at frozen structural zones.

If G1 adds no residual representation, execution selection is sufficient.

## 13. Pre-decision vs post-decision clocks

Mandatory:
- structuralOpportunityAt;
- predictorFreezeAt;
- executionDecisionAt;
- orderSubmitAt;
- exchangeAckAt;
- firstFillAt;
- finalFillAt;
- cancelAt;
- feeKnownAt;
- postFillMarkoutKnownAt.

Rules:
- fill, fee actually realized, cancel and markout known after freeze are post-treatment/outcome-side;
- ex-ante fee schedule may be baseline only when known by predictorFreezeAt;
- realized rebate/fee may not be backfilled.

## 14. Fee schedule versioning

Every fee receipt requires:
- venue/instrument;
- effectiveFrom/effectiveTo;
- source/version;
- knownAt;
- commission schedule ID if broker-specific;
- maker/taker program ID if applicable.

Current schedule may not be used for historical backfill without PIT validity.

## 15. Common-support controls

Future D16 controls:
- side;
- structural orientation;
- queue state;
- latency;
- hidden-liquidity state;
- spread/depth;
- relative tick;
- price tier;
- volatility/liquidity regime;
- urgency / order type where observed;
- order size / participation;
- session/auction/VI/limit state;
- structural age;
- DL-052 to DL-055 mechanism receipts.

No extrapolation outside support.

## 16. SDA-001 anti-double-counting

Execution style, queue state, fee schedule and fill receipt are linked execution-mechanism evidence.

They do not create multiple Pattern confirmations.

Default:
effectiveIndependentEvidenceCount = 1.

## 17. SDA-002 no-lookahead

Every fee/execution receipt retains:
- firstObservableAt;
- knownAt;
- predictorFreezeAt;
- replaySafe.

Realized fills/fees/markouts cannot become earlier predictors.

## 18. Future D16 ladder

X0 RAW_ZONE_REJECTION
X1 DL055_QUEUE_LATENCY_HIDDEN_CONTROLLED
X2 EXECUTION_STYLE_SELECTION_CONTROLLED
X3 UNFILLED_CANCELLED_DENOMINATOR_INCLUDED
X4 EX_ANTE_FEE_REGIME_CONTROLLED
X5 REALIZED_EXECUTION_COST_SEPARATED
X6 GENERIC_EXECUTION_SELECTION_CONTROLLED
X7 STRUCTURAL_REJECTION_RESIDUAL_CANDIDATE
X8 MULTI_DATE_MULTI_BROKER_OR_FEE_REGIME_REPLICATION

Interpretations:
Q0 PASSIVE_FILL_SELECTION_EXPLANATION
Q1 AGGRESSIVE_URGENCY_SELECTION_EXPLANATION
Q2 NONFILL_OPPORTUNITY_COST_EXPLANATION
Q3 FEE_ECONOMICS_EXPLANATION
Q4 EXECUTION_COST_ONLY
Q5 VENUE_TRANSFER_NOT_VALID
Q6 STRUCTURAL_REJECTION_RESIDUAL
Q7 NOT_EVALUABLE

None proves causal memory or alpha.

## 19. Required manifest fields

Per structural opportunity:
- parentDecisionId;
- structuralRootId;
- structuralVersionId;
- predictorFreezeAt;
- structuralOpportunityAt;
- executionDecisionAt;
- realOrderSubmitted;
- executionStyleState;
- orderLifecycleState;
- queueReceipt;
- latencyReceipt;
- hiddenLiquidityReceipt;
- feeRegimeState;
- feeScheduleId;
- feeKnownAt;
- brokerCommissionReceipt;
- venueFeeReceipt;
- makerTakerProgramReceipt;
- fillReceipt;
- cancelReceipt;
- nonFillReason;
- timingRole per receipt;
- replaySafe;
- effectiveIndependentEvidenceCount;
- residualIncrementalityStatus;
- manifestVersion/hash.

No return outcome belongs in this manifest.

## 20. Current decision

IMPORT_FOREIGN_MAKER_TAKER_TO_TWSE =
PROHIBITED.

PASSIVE_FILL_SAMPLE_IS_RANDOM =
FALSE.

AGGRESSIVE_EXECUTION_IS_RANDOM =
FALSE.

TOUCH_EQUALS_PASSIVE_FILL =
FALSE.

LOWER_EXECUTION_COST_EQUALS_ALPHA =
FALSE.

UNFILLED_OPPORTUNITIES_CAN_BE_DROPPED =
FALSE.

REALIZED_FEE_AS_PRE_FREEZE_PREDICTOR =
PROHIBITED.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 21. Exact next continuation

1. Build deterministic fee-regime / execution-style / opportunity-denominator helpers and adversarial tests.
2. Preserve submitted/filled/partial/cancelled/unfilled/no-order states.
3. Require PIT fee schedule/version receipts; prohibit foreign maker-taker transfer without local proof.
4. Hand X0-X8 / Q0-Q7 fill-selection and cost-separation inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate structural rejection from order-size / participation-rate market-impact selection around the zone.
7. No runtime wiring / no Formal change.
