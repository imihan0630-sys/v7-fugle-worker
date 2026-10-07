# D01 DL-068 — Structural Response vs Disposition-Security Extended Matching Cadence V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / EXTENDED_MATCHING_CADENCE_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-067 separated ordinary continuous-trading technical structure from intraday volatility interruption.

DL-068 freezes another Taiwan-market attribution problem:

> Disposition securities and certain securities under altered trading methods may trade with extended matching intervals / periodic call auction. Sparse executions, long quote-accumulation intervals and periodic price jumps can mechanically alter K-line geometry.

A flat or stair-step pattern under periodic matching is not directly comparable with continuous-trading geometry.

No future outcome is opened in this tranche.

## 2. Official TWSE mechanism

Current TWSE disposition rules state that disposition measures may include manually controlled / extended matching intervals.

Official Article 6 examples:
- first occurrence within the most recent 30 business days:
  approximately every 2 minutes;
  altered-trading-method securities approximately every 10 minutes;
  altered-trading-method securities with periodic call auction approximately every 45 minutes.
- two or more occurrences within the most recent 30 business days:
  approximately every 2 minutes;
  altered-trading-method securities approximately every 25 minutes;
  altered-trading-method securities with periodic call auction approximately every 60 minutes.
- surveillance authorities may adjust matching time when necessary.

Official Operating Rule 58-9 treats disposition / altered-trading-method periodic-call-auction securities as securities with extended matching intervals.

Official sources:
https://twse-regulation.twse.com.tw/m/en/LawContent.aspx?FID=FL007225
https://twse-regulation.twse.com.tw/m/en/LawContent.aspx?FID=FL007304

D01 consumes official disposition / matching receipts.
D01 does not infer matching cadence from sparse bars.

## 3. Canonical distinction

Preserve separately:

- REGULAR_CONTINUOUS_MATCHING
- EXTENDED_MATCHING_APPROX_2M
- ALTERED_METHOD_APPROX_10M
- ALTERED_METHOD_APPROX_25M
- PERIODIC_CALL_APPROX_45M
- PERIODIC_CALL_APPROX_60M
- CANONICAL_CUSTOM_MATCHING_INTERVAL
- MATCHING_CADENCE_UNKNOWN

The actual official receipt controls the state.
The numeric examples above are not universal defaults.

## 4. Disposition state is not structural state

A disposition measure can be triggered by trading irregularity / attention rules.

Therefore:

DISPOSITION_STATUS != BEARISH_PATTERN
DISPOSITION_STATUS != BULLISH_PATTERN
DISPOSITION_STATUS != STRUCTURAL_STRENGTH

Disposition is regulatory / microstructure context.

Do not infer technical direction from the fact that a security is under disposition.

## 5. Periodic matching changes the observation clock

Under continuous trading:
many executable opportunities may exist per minute.

Under extended matching:
orders can accumulate while no execution occurs between scheduled match points.

Therefore freeze two clocks:

A. WALL_CLOCK_TIME

B. EXECUTABLE_MATCH_OPPORTUNITY_COUNT

They are not interchangeable.

A 45-minute no-trade interval under periodic call auction is not 45 minutes of accepted stable price.

## 6. No pseudo-bars / no forward-filled stability

Between scheduled periodic matches:
- do not fabricate OHLC bars;
- do not forward-fill last price and call it stable;
- do not interpret zero trades as no volatility;
- do not use repeated stale close values as support/resistance touches.

NO_EXECUTION_BETWEEN_MATCHES != PRICE_ACCEPTANCE.

## 7. Quote / indicative state vs executed trade

Extended-matching securities may have quote information / computed execution indications before the next actual match.

Preserve:
- quoteObservedAt;
- indicativeComputedPrice;
- indicativeVolume;
- bestBidAsk receipt where available;
- actualMatchAt;
- actualMatchPrice;
- actualMatchVolume.

Hard rule:

INDICATIVE_COMPUTED_PRICE != EXECUTED_TRADE.

A quote crossing a structural zone before the scheduled match is not an executed breakout/touch.

## 8. Bar-construction firewall

Standard one-minute / five-minute bars become structurally sparse under long matching intervals.

For each aggregated bar preserve:
- actualTradeCount;
- scheduledMatchOpportunityCount;
- executedMatchCount;
- quoteOnlyIntervalCount;
- staleCarryForwardUsed boolean.

Promotion-grade research requires:
staleCarryForwardUsed = false.

Bars with no actual trade may remain missing/non-executed rather than filled.

## 9. Matching-cadence normalized opportunity

Future structural opportunity studies should distinguish:

RAW_WALL_CLOCK_TOUCH_RATE

from

PER_EXECUTABLE_MATCH_OPPORTUNITY_TOUCH_RATE.

If a security can only execute every 45/60 minutes, raw touch frequency is mechanically lower.

Do not call lower touch frequency "stronger support" or "less noise" without cadence normalization.

## 10. Stair-step false breakout

Periodic call auction can create:

match at price A;
long no-execution interval;
next call auction match at price B beyond a zone.

This may look like an abrupt clean breakout on a conventional chart.

Classify:
PERIODIC_MATCH_GAP_CROSSING.

No continuous path through the zone is invented.

## 11. Flat-line false support

Repeated chart sampling can show:
same last price for many minutes
because no new execution occurred.

This can look like:
- flat support;
- low volatility;
- tight base;
- VCP contraction;
- price acceptance.

Hard rule:

STALE_LAST_PRICE_FLATNESS != OBSERVED_PRICE_ACCEPTANCE.

## 12. Extended-cadence volatility interruption interaction

TWSE Operating Rule 58-9 also applies price-stabilization logic around matching for extended-interval securities.

Therefore an extended-cadence security may experience:
- periodic matching;
- pre-match computed execution state;
- additional matching postponement if price-stabilization condition triggers.

DL-067 remains active.

Do not merge:
EXTENDED_MATCHING_INTERVAL
with
INTRADAY_VOLATILITY_INTERRUPTION.

They are separate mechanism layers.

## 13. Market-order / order-type restrictions

Extended-matching securities may have order-type restrictions under TWSE rules.

D01 consumes the canonical order-eligibility receipt.

Changes in:
- market-order eligibility;
- full-payment requirement;
- margin/short-sale availability;
- broker/order-size limits

may change participant behavior.

DL-068 treats these as controls, not structural confirmations.

## 14. First vs repeated disposition tier

Disposition severity / repeat occurrence can change matching cadence.

Preserve:
- dispositionEpisodeId;
- dispositionOccurrenceCountWithinCanonicalWindow;
- dispositionEffectiveFrom;
- dispositionEffectiveTo;
- matchingIntervalSeconds;
- alteredTradingMethodState;
- periodicCallAuctionState;
- officialMeasureVersion.

Do not infer tier from observed trade spacing alone.

## 15. Regime transition inside a structural root

A structural root can exist before disposition, during disposition and after disposition.

Do not automatically create a new root when cadence changes.

Instead preserve:
- structuralRootId;
- structuralVersionId;
- matchingRegimeEpisodeId.

A change in matching regime is not a structural-version event unless geometry itself changes under D01 root/version rules.

## 16. Structural interaction states

At a scheduled matching opportunity classify:

M0 NO_EXECUTABLE_MATCH_OPPORTUNITY

M1 QUOTE_ONLY_ZONE_RELATION

M2 SCHEDULED_MATCH_NO_EXECUTION

M3 EXECUTED_MATCH_INSIDE_ZONE

M4 EXECUTED_MATCH_CROSS_FROM_BELOW_TO_ABOVE

M5 EXECUTED_MATCH_CROSS_FROM_ABOVE_TO_BELOW

M6 PERIODIC_MATCH_GAP_CROSSING

M7 MATCH_POSTPONED_BY_STABILIZATION

M8 MATCHING_CADENCE_DATA_BLOCKED

Only actual execution states can establish an executed structural interaction.

## 17. Timeframe contamination

A 15-minute bar may contain:
- several continuous matches for a normal stock;
- zero or one scheduled match for a disposition stock.

Therefore "same 15-minute bar" does not imply comparable information density.

Future cross-sectional comparison must preserve:
- trade count;
- match opportunity count;
- matching regime;
- liquidity;
- quote activity.

## 18. Generic comparator

Primary comparator:

G0 NORMAL_CADENCE_AT_STRUCTURAL_ZONE

G1 EXTENDED_CADENCE_AT_STRUCTURAL_ZONE

Common support:
- realized volatility;
- liquidity;
- price level;
- relative tick;
- market/sector regime;
- structural age/history;
- disposition attention state where possible;
- actual trade/match opportunity counts.

If apparent structural persistence disappears after cadence normalization, it is microstructure explanation.

## 19. Away-from-zone comparator

H0 EXTENDED_CADENCE_AWAY_FROM_STRUCTURAL_ZONE

H1 EXTENDED_CADENCE_AT_STRUCTURAL_ZONE

This separates generic stair-step / sparse-trade behavior from old-zone response.

## 20. Before/during/after within-symbol comparator

Preferred longitudinal diagnostic:

B0 PRE_DISPOSITION_NORMAL_CADENCE
B1 DURING_DISPOSITION_EXTENDED_CADENCE
B2 POST_DISPOSITION_RETURNED_CADENCE

Same symbol / same structural lineage where causal continuity permits.

This can expose whether apparent pattern "strength" appears only when matching becomes sparse.

It is descriptive until D16 validates.

## 21. No-lookahead / SDA-002

Every matching-regime receipt requires:
- firstObservableAt;
- knownAt;
- effectiveFrom;
- effectiveTo or OPEN;
- matchingIntervalSeconds;
- measureVersion;
- predictorFreezeAt;
- replaySafe.

Later knowledge of disposition extension/termination cannot rewrite earlier predictor state.

## 22. Same-root redundancy / SDA-001

These representations share PRICE_OHLC ancestry:
- flat stale last price;
- periodic gap;
- breakout label;
- support/resistance state;
- VCP/contraction state derived from sparse executed prices.

Default:
informationRoot = PRICE_OHLC;
effectiveIndependentEvidenceCount = 1.

Matching-regime receipt is context, not an automatic independent vote.

## 23. Future D16 ladder

C0 RAW_PATTERN_RESPONSE

C1 DISPOSITION_EPISODE_IDENTIFIED

C2 MATCHING_CADENCE_RECEIPT_CONTROLLED

C3 WALL_CLOCK_VS_MATCH_OPPORTUNITY_SEPARATED

C4 QUOTE_VS_EXECUTION_SEPARATED

C5 PSEUDO_BAR_FORWARD_FILL_EXCLUDED

C6 PERIODIC_GAP_CROSSING_CONTROLLED

C7 VOLATILITY_INTERRUPTION_NESTED_MECHANISM_CONTROLLED

C8 ORDER_TYPE_AND_MARGIN_RESTRICTIONS_CONTROLLED

C9 LIQUIDITY_AND_TRADE_COUNT_CONTROLLED

C10 BEFORE_DURING_AFTER_SYMBOL_COMPARATOR_CONTROLLED

C11 NORMAL_CADENCE_COMPARATOR_CONTROLLED

C12 AWAY_FROM_ZONE_EXTENDED_CADENCE_CONTROLLED

C13 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE

C14 MULTI_TIER_MULTI_SYMBOL_MULTI_REGIME_REPLICATION

## 24. Interpretation states

Q0 SPARSE_MATCHING_EXPLANATION

Q1 STALE_LAST_PRICE_FLATNESS_EXPLANATION

Q2 PERIODIC_CALL_GAP_EXPLANATION

Q3 INDICATIVE_QUOTE_NOT_EXECUTED_EXPLANATION

Q4 NESTED_VOLATILITY_INTERRUPTION_EXPLANATION

Q5 ORDER_RESTRICTION_EXPLANATION

Q6 LIQUIDITY_ATTENTION_EXPLANATION

Q7 STRUCTURAL_RESPONSE_RESIDUAL

Q8 MATCHING_REGIME_UNKNOWN

Q9 NOT_EVALUABLE

None proves alpha.

## 25. Required manifest fields

Per parent/opportunity:
- parentDecisionId;
- symbol;
- dispositionEpisodeId;
- dispositionMeasureVersion;
- dispositionEffectiveFrom;
- dispositionEffectiveTo;
- occurrenceCountWithinCanonicalWindow;
- alteredTradingMethodState;
- periodicCallAuctionState;
- matchingIntervalSeconds;
- matchingCadenceClass;
- scheduledMatchOpportunityAt;
- quoteObservedAt;
- indicativeComputedPrice;
- actualMatchAt;
- actualMatchPrice;
- actualMatchVolume;
- actualTradeCountInBar;
- scheduledMatchOpportunityCountInBar;
- executedMatchCountInBar;
- staleCarryForwardUsed;
- structuralRootId;
- structuralVersionId;
- structuralBoundaryLower;
- structuralBoundaryUpper;
- zoneRelationState;
- volatilityInterruptionReceipt;
- orderEligibilityReceipt;
- marginPaymentRestrictionReceipt;
- liquidityReceipt;
- marketSectorRegimeReceipt;
- informationRoot;
- effectiveIndependentEvidenceCount;
- replaySafe;
- evaluabilityReason;
- manifestVersion/hash.

No future response outcome field.

## 26. Current decision

NO_EXECUTION_BETWEEN_MATCHES_EQUALS_PRICE_ACCEPTANCE =
FALSE.

INDICATIVE_COMPUTED_PRICE_EQUALS_EXECUTED_TRADE =
FALSE.

STALE_LAST_PRICE_FLATNESS_EQUALS_SUPPORT =
FALSE.

PERIODIC_MATCH_GAP_EQUALS_CONTINUOUS_BREAKOUT =
FALSE.

MATCHING_CADENCE_CHANGE_EQUALS_NEW_STRUCTURAL_ROOT =
FALSE.

WALL_CLOCK_TIME_EQUALS_EXECUTABLE_OPPORTUNITY_COUNT =
FALSE.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 27. Exact next continuation

1. Build deterministic matching-cadence / quote-vs-execution / periodic-gap / pseudo-bar classifier and adversarial tests.
2. Preserve official disposition episode/version and exact matching-interval receipt rather than inferring from observed trade gaps.
3. Consume D04/D05 order/auction/liquidity and disposition-measure owner receipts.
4. Hand C0-C14 / Q0-Q9 cadence-attribution inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate structural response from disposition ancillary restrictions (full-payment collection, margin/short-sale suspension, order-size constraints) that change participant composition even after matching cadence is controlled.
7. No outcome join / no runtime wiring / no Formal change.
