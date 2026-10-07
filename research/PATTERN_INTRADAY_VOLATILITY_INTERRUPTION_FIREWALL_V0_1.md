# D01 DL-067 — Structural Response vs Intraday Volatility Interruption / Delayed Matching V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / INTRADAY_VOLATILITY_INTERRUPTION_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-066 separated multi-session suspension/resumption stale-price anchoring from structural response.

DL-067 freezes a different mechanism:

> TWSE intraday volatility interruption temporarily postpones matching when a potential execution price would move beyond a dynamic reference band, then restarts through call auction before returning to continuous trading.

This is an intraday price-stabilization / matching mechanism.
It is not equivalent to multi-session suspension, daily price limit, or ordinary continuous-trading support/resistance interaction.

No future outcome is opened in this tranche.

## 2. Official TWSE mechanism

Current TWSE regular-trading rules state:

- trigger condition: potential execution price would rise/fall by more than 3.5% relative to the current interruption reference price;
- matching is postponed for two minutes;
- trading resumes through call auction;
- continuous trading resumes afterward;
- during interruption, new market / IOC / FOK orders are not accepted;
- existing market orders remaining in the book are automatically deleted;
- limit ROD orders may be added during interruption;
- after the interruption call auction, that auction trade price becomes the interruption reference price for the following five minutes;
- after those five minutes, rolling five-minute weighted-average reference calculation resumes.

Official source:
https://www.twse.com.tw/en/products/system/trading.html

D01 consumes these mechanics as owner-certified market rules.
D01 does not reimplement the matching engine.

## 3. Owner boundaries

Canonical owners:
- D04/D05: order-book, matching, liquidity, auction and microstructure;
- D01: structural geometry / pattern interpretation;
- D09/D18: market/regime context;
- D16: residual / dependence-aware inference.

DL-067 only freezes the structural-attribution firewall.

## 4. Volatility interruption is not multi-session suspension

Hard rule:

INTRADAY_VOLATILITY_INTERRUPTION != MULTI_SESSION_SUSPENSION.

Differences include:
- interruption duration is intraday and short;
- reference-price rule is endogenous to recent transactions;
- order book is actively modified by the rule;
- reopening call auction occurs after a two-minute matching delay;
- trading resumes within the same session.

Do not reuse DL-066 stale-calendar-age semantics as if this were a multi-session no-trade interval.

## 5. Trigger candidate is not an executed price

The mechanism is triggered by a potential execution price relative to a reference price.

Therefore preserve separately:
- triggerPotentialExecutionPrice;
- interruptionReferencePrice;
- referenceWindowStartAt;
- referenceWindowEndAt;
- interruptionTriggeredAt;
- interruptionEndsAt;
- restartCallAuctionPrice;
- firstPostInterruptionContinuousTrade.

A potential execution price that triggered the interruption is not an executed breakout / support break / resistance break.

## 6. Dynamic reference-price lineage

Reference-price state is time-varying.

Freeze:

### V0 OPENING_REFERENCE_PHASE
9:00-9:05:
opening call-auction price, or opening auction reference if no opening price.

### V1 ROLLING_FIVE_MINUTE_REFERENCE
after 9:05:
five-minute weighted average of continuous-trading executions.

If no trade exists in the five-minute window:
use the most recent trade, or opening auction reference if no recent trade exists.

### V2 POST_INTERRUPTION_RESET_REFERENCE
for the first five minutes after interruption:
restart call-auction trade price, or most recent trade if no call-auction trade.

After that:
return to the rolling five-minute weighted-average regime.

Reference regime identity must be stored.
Do not compare trigger magnitude across phases without preserving the reference regime.

## 7. Interruption state machine

Freeze:

I0 NORMAL_CONTINUOUS_TRADING

I1 INTERRUPTION_TRIGGER_CANDIDATE
- potential price would exceed permitted band;
- not yet an executed trade.

I2 MATCHING_POSTPONED
- two-minute delay;
- no normal continuous matching.

I3 INTERRUPTION_ORDER_ACCEPTANCE
- order set changes under the rule;
- only permitted order types remain/add.

I4 RESTART_CALL_AUCTION

I5 RESTART_CALL_PRINT

I6 POST_INTERRUPTION_REFERENCE_RESET_WINDOW

I7 RETURN_TO_ROLLING_CONTINUOUS_REFERENCE

I8 INTERRUPTION_PROVENANCE_UNKNOWN

A state transition is a market-mechanism event, not an automatic structural event.

## 8. Order-set mutation firewall

During interruption:
- market orders are not accepted;
- existing market orders are deleted;
- IOC and FOK are not accepted;
- limit ROD may be added.

Therefore the restart call auction does not see an unchanged pre-trigger order set.

Do not claim:
"the same queue resumed."

Require fresh order-book / auction receipts from D04/D05 for any queue-based interpretation.

## 9. Structural boundary crossing during delay/restart

If the trigger potential price is beyond an old structural zone:
TRIGGER_POTENTIAL_ZONE_CROSS.

This is not an executed structural break.

If restart call-auction price is on the opposite side of the zone:
RESTART_CALL_ZONE_CROSS.

No continuous path through the zone is invented.

If the first post-interruption continuous trade remains across the zone:
POST_INTERRUPTION_CONTINUOUS_CROSS_OBSERVED.

These three states are distinct.

## 10. First restart call print is not confirmed breakout

The restart call print is produced under:
- delayed matching;
- modified order eligibility;
- accumulated interruption-period orders;
- call-auction price formation;
- temporary reference-price reset.

Therefore:

RESTART_CALL_PRINT != CONFIRMED_BREAKOUT.

Any structural confirmation requires a preregistered post-interruption observation rule.

## 11. Post-interruption confirmation window

Candidate windows may include:
- first continuous trade;
- first 1 minute;
- first 5 minutes;
- first 15 minutes;
- remainder of session.

D01 does not choose the best-performing window after outcomes.

All registered windows stay in family accounting.

POST_OUTCOME_CONFIRMATION_WINDOW_SELECTION =
PROHIBITED.

## 12. Daily price-limit interaction

DL-064 remains active.

Intraday volatility interruption is not the daily price limit.

A security can be:
- far from daily limit but trigger intraday interruption;
- near daily limit and also trigger interruption;
- constrained by both.

Preserve:
- dailyPriceLimitState;
- interruptionReferencePrice;
- potentialExecutionPrice;
- distanceToDailyLimit;
- structuralZoneDistance.

Do not credit the same constrained move to multiple independent mechanisms.

## 13. Opening / closing auction interaction

The interruption mechanism has distinct rules near opening/closing and call-auction phases.

D01 consumes the canonical trading-phase receipt.

Do not interpret a mechanism-triggered call auction as an ordinary intraday bar.

## 14. Stale/paused path semantics

During the two-minute delay:
- no normal continuous-trading path exists;
- do not insert synthetic ticks;
- do not interpolate through the structural zone;
- do not treat the pause as price acceptance.

Elapsed clock time increases.
Continuous-trading transaction count does not.

## 15. Mechanism-induced false confirmation

Possible false-confirmation pattern:

1. trigger potential price appears beyond resistance;
2. interruption occurs before execution;
3. market orders are removed;
4. new limit ROD orders accumulate;
5. restart call auction prints beyond resistance;
6. later continuous trading reverts.

Without the interruption state, this can look like a clean breakout/retest sequence.

DL-067 requires the interruption mechanism to remain visible in the event lineage.

## 16. Generic comparator

Primary comparator:

G0 HIGH_VOLATILITY_MOVE_WITHOUT_INTERRUPTION_AT_STRUCTURAL_ZONE

G1 VOLATILITY_INTERRUPTION_AT_STRUCTURAL_ZONE

Common support should include:
- volatility level;
- recent five-minute return / range;
- liquidity;
- order imbalance where available;
- distance to structural zone;
- distance to daily limit;
- market/sector move;
- time-of-day;
- reference-price regime;
- auction/trading phase.

If G1 adds no residual representation over G0, the interruption mechanism explains the apparent structural event.

## 17. Away-from-zone comparator

Complementary comparator:

H0 VOLATILITY_INTERRUPTION_AWAY_FROM_STRUCTURAL_ZONE

H1 VOLATILITY_INTERRUPTION_AT_STRUCTURAL_ZONE

This separates generic interruption/restart behavior from old-zone interaction.

## 18. Event identity

One interruption episode has one immutable event identity:

- interruptionEventId;
- triggerAt;
- delayStartAt;
- delayEndAt;
- restartAuctionAt;
- firstCallPrintAt;
- referenceResetUntil;
- returnToRollingReferenceAt.

Repeated snapshots inside one episode do not create independent events.

Multiple interruption episodes in one day remain separate only if the exchange mechanism actually re-triggers and a new event identity exists.

## 19. No-lookahead / SDA-002

Every interruption receipt requires:
- firstObservableAt;
- knownAt;
- triggerAt;
- restartAuctionAt;
- firstCallPrintAt;
- predictorFreezeAt;
- referenceRegimeKnownAt;
- source/version/hash;
- replaySafe.

Later knowledge of the restart price cannot backfill the trigger snapshot.

Later continuous-trading reversal cannot redefine the restart call print as a false breakout in the original predictor state.

## 20. Same-root redundancy / SDA-001

These are all PRICE_OHLC-derived representations unless independent lineage is demonstrated:
- old structural zone;
- trigger potential price relation;
- restart call crossing;
- post-interruption momentum;
- short-horizon breakout label.

Default:
informationRoot = PRICE_OHLC;
effectiveIndependentEvidenceCount = 1.

Auction imbalance / order-book state belongs to D04/D05 and is not automatically an independent vote.

## 21. Future D16 ladder

V0 RAW_STRUCTURAL_RESPONSE

V1 VOLATILITY_INTERRUPTION_EVENT_IDENTIFIED

V2 TRIGGER_POTENTIAL_VS_EXECUTED_PRICE_SEPARATED

V3 REFERENCE_PRICE_REGIME_CONTROLLED

V4 MATCHING_DELAY_CONTROLLED

V5 ORDER_SET_MUTATION_CONTROLLED

V6 RESTART_CALL_AUCTION_CONTROLLED

V7 POST_INTERRUPTION_REFERENCE_RESET_CONTROLLED

V8 DAILY_PRICE_LIMIT_CONTEXT_CONTROLLED

V9 TIME_OF_DAY_AND_TRADING_PHASE_CONTROLLED

V10 GENERIC_HIGH_VOLATILITY_COMPARATOR_CONTROLLED

V11 AWAY_FROM_ZONE_INTERRUPTION_COMPARATOR_CONTROLLED

V12 LIQUIDITY_ORDER_FLOW_CONTROLLED

V13 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE

V14 MULTI_EVENT_MULTI_SYMBOL_MULTI_REGIME_REPLICATION

## 22. Interpretation states

Q0 TRIGGER_WITHOUT_EXECUTION_EXPLANATION

Q1 MATCHING_DELAY_EXPLANATION

Q2 ORDER_SET_MUTATION_EXPLANATION

Q3 RESTART_AUCTION_EXPLANATION

Q4 REFERENCE_RESET_EXPLANATION

Q5 DAILY_LIMIT_INTERACTION_EXPLANATION

Q6 GENERIC_HIGH_VOLATILITY_EXPLANATION

Q7 LIQUIDITY_ORDER_FLOW_EXPLANATION

Q8 STRUCTURAL_RESPONSE_RESIDUAL

Q9 INTERRUPTION_PROVENANCE_UNKNOWN

Q10 NOT_EVALUABLE

None proves alpha.

## 23. Required manifest fields

Per interruption episode:
- parentDecisionId;
- symbol;
- interruptionEventId;
- tradingDate;
- tradingPhase;
- interruptionTriggeredAt;
- delayStartAt;
- delayEndAt;
- interruptionReferencePrice;
- referenceRegime;
- referenceWindowStartAt;
- referenceWindowEndAt;
- triggerPotentialExecutionPrice;
- triggerPotentialDistancePct;
- restartAuctionAt;
- restartCallPrice;
- restartCallPriceKnownAt;
- firstPostInterruptionContinuousTradeAt;
- firstPostInterruptionContinuousTradePrice;
- referenceResetUntil;
- returnToRollingReferenceAt;
- oldStructuralRootId;
- oldStructuralVersionId;
- structuralBoundaryLower;
- structuralBoundaryUpper;
- triggerPotentialZoneRelation;
- restartCallZoneRelation;
- postContinuousZoneRelation;
- dailyPriceLimitState;
- distanceToDailyLimit;
- liquidityReceipt;
- orderBookReceipt;
- marketSectorContextReceipt;
- informationRoot;
- effectiveIndependentEvidenceCount;
- replaySafe;
- evaluabilityReason;
- manifestVersion/hash.

No future response outcome field.

## 24. Current decision

TRIGGER_POTENTIAL_PRICE_EQUALS_EXECUTED_BREAKOUT =
FALSE.

INTRADAY_INTERRUPTION_EQUALS_MULTI_SESSION_SUSPENSION =
FALSE.

RESTART_CALL_PRINT_EQUALS_CONFIRMED_BREAKOUT =
FALSE.

TWO_MINUTE_DELAY_EQUALS_PRICE_ACCEPTANCE =
FALSE.

PRE_TRIGGER_QUEUE_EQUALS_RESTART_QUEUE =
FALSE.

POST_OUTCOME_CONFIRMATION_WINDOW_SELECTION =
PROHIBITED.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 25. Exact next continuation

1. Build deterministic interruption/reference-regime/order-set/restart-cross classifier and adversarial tests.
2. Preserve trigger-potential price separately from executed restart/continuous prices.
3. Consume D04/D05 trading-phase, auction, liquidity and order-book receipts.
4. Hand V0-V14 / Q0-Q10 mechanism-attribution inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate structural response from disposition-security periodic matching / altered matching cadence, where apparent persistence may be a microstructure artifact.
7. No outcome join / no runtime wiring / no Formal change.
