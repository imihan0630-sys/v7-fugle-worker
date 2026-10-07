# D01 DL-066 — Structural Response vs Suspension/Resumption Stale-Price Anchoring V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / SUSPENSION_RESUMPTION_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-065 separated corporate-action mechanical reference resets from technical structure.

DL-066 freezes another structural-attribution problem:

> After a security is suspended for one or more sessions, the last pre-suspension price and structural zones may become economically stale while firm, market and sector information continues to evolve. The first resumption price may therefore be a new price-discovery event rather than a normal continuation of the old technical path.

A suspension interval is not ordinary missing data.

No future outcome is opened in this tranche.

## 2. Official Taiwan mechanism

TWSE suspension/resumption rules establish that:
- trading suspension/resumption timing follows official exchange execution/announcement;
- while trading is suspended, the exchange stops accepting new trading orders;
- unexecuted orders placed before a halt may be canceled or reduced under applicable rules;
- upon resumption, first matching may be conducted by call auction after an order-acceptance period;
- information-assessment suspensions exist specifically for material information disclosure / information asymmetry control;
- official suspension/resumption dates/times are exchange events, not inferred from absent bars.

D01 consumes canonical session/suspension receipts.

## 3. Owner boundaries

Canonical owner:
- Corporate Actions / symbol-session lane for verified suspension/resumption membership;
- D08 for material-news/event timing;
- D04/D05 for reopening order-book/liquidity/auction microstructure;
- D09/D12 for market/global/derivative context during the no-trade interval;
- D18 for regime;
- D16 for residual inference.

D01 owns only structural geometry and causal use of these receipts.

## 4. Suspension interval is not missing-bar data

Hard rule:

VERIFIED_SUSPENSION_SESSION != SOURCE_MISSING_SESSION.

For every expected market session inside a verified symbol suspension:
- do not fabricate OHLC;
- do not forward-fill previous close;
- do not insert zero-volume pseudo-bars;
- do not let stale-cache logic treat the session as an unexplained gap.

If suspension provenance is unknown:
SYMBOL_SESSION_OR_SUSPENSION_DATA_BLOCKED.

## 5. Two clocks continue differently

A structural root has at least two relevant clocks across suspension:

### A. ELIGIBLE_TRADING_SESSION_AGE

Counts only verified tradable symbol sessions.
It does not increment during verified suspension sessions.

### B. CALENDAR_INFORMATION_AGE

Elapsed real-world time since last tradable observation / last structural interaction.
It continues during suspension.

Also preserve:
- suspensionCalendarDays;
- suspensionMarketSessions;
- sessionsSinceResumption;
- calendarDaysSinceResumption.

A structure can be young in trading-session age but stale in information/calendar age.

## 6. Pre-suspension price is a stale anchor candidate

Store:
- lastPreSuspensionTradeAt;
- lastPreSuspensionClose;
- lastPreSuspensionStructuralState;
- lastPreSuspensionLiquidityState;
- lastPreSuspensionMarket/sector context.

After multi-session suspension:
PRE_SUSPENSION_PRICE_STALE_ANCHOR_CANDIDATE.

This is a reference state, not a current equilibrium price.

## 7. Information accumulation during suspension

Preserve owner-certified:
- firm-specific material information;
- corporate-action changes;
- market/sector move;
- global/cross-asset move;
- derivatives/futures context;
- index/ETF context where relevant;
- regime transition.

No SUSPENSION_NEWS_SCORE is defined.

Absence of a verified event receipt is not proof that no information accumulated.

## 8. Reopening / resumption price discovery

Freeze separate states:

R0 VERIFIED_SUSPENSION_ACTIVE

R1 RESUMPTION_ORDER_ACCEPTANCE

R2 RESUMPTION_INDICATIVE_STATE

R3 RESUMPTION_FIRST_CALL_PRINT

R4 POST_RESUMPTION_CONTINUOUS_TRADING

R5 RESUMPTION_DELAYED_OR_DEFERRED

R6 SUSPENSION_PROVENANCE_UNKNOWN

The first resumption call print is not equivalent to an ordinary continuous-trading touch.

## 9. Pre-suspension queue does not establish resumption queue

During a halt, pre-halt unexecuted orders may be canceled/reduced under the exchange mechanism.

Across multi-session suspensions, session-validity rules and new information make pre-suspension queue identity especially unsafe.

Do not claim:
"the old order queue resumed."

Require a fresh resumption/pre-open order-book receipt.

## 10. Structural zone crossing on resumption

If:
last pre-suspension price is below an old zone;
resumption first print is above the zone;

classify:
RESUMPTION_GAP_CROSSING.

No unseen path through the zone is invented.

This inherits DL-062/DL-063 opening-gap logic.

## 11. Old structure may persist, but evidence burden rises

Suspension does NOT automatically invalidate a structural root.

Root identity can persist if:
- corporate-action continuity is resolved;
- no canonical market-invalidating structural event occurred;
- the geometry remains semantically defined.

But a first resumption reaction at the old zone requires controls for information accumulation and stale-price anchoring before it can be attributed to structural memory.

## 12. Reopening reference price

Opening/resumption auction-reference semantics must be owner-certified.

Do not assume:
resumptionReferencePrice == lastPreSuspensionClose.

Corporate actions, exchange rules or special resumption conditions may alter the reference.

Missing reference provenance:
RESUMPTION_REFERENCE_DATA_BLOCKED.

## 13. Stale-zone distance

At resumption preserve:
- resumptionPriceToOldZoneDistance;
- lastPreSuspensionPriceToOldZoneDistance;
- marketBenchmarkMoveDuringSuspension;
- sectorBenchmarkMoveDuringSuspension;
- continuity-space market move;
- cumulative calendar days no trade.

No arbitrary stale-duration threshold is frozen by D01.

## 14. Generic suspension comparator

Primary comparator:

G0 RESUMPTION_EVENT_AWAY_FROM_OLD_STRUCTURAL_ZONE
- verified suspension/resumption;
- comparable information/market move/duration;
- no old-zone opportunity.

G1 RESUMPTION_EVENT_AT_OLD_STRUCTURAL_ZONE
- matched context;
- resumption/early-post-resumption price reaches old zone.

If G1 adds no residual representation over G0, suspension/repricing mechanics are sufficient.

## 15. News-driven suspension comparator

Complementary split:

N0 LOW_OR_UNKNOWN_VERIFIED_INFORMATION_CHANGE

N1 MATERIAL_INFORMATION_DISCLOSURE_VERIFIED

This is context stratification only.

Do not infer news severity from price gap magnitude.

## 16. Same-day halt vs multi-session suspension

Do not pool automatically.

A same-day halt/resumption can preserve much more of the order-book and information environment than a multi-session information suspension.

Preserve:
- suspensionType;
- suspensionStartAt;
- suspensionEndAt;
- number of market sessions suspended;
- whether session crossed overnight;
- whether order validity boundary occurred.

## 17. Corporate-action interaction

If suspension overlaps:
- ex-right/ex-dividend;
- capital reduction;
- par-value change;
- replacement-share listing;
- other price-reset event;

DL-065 continuity receipt is mandatory before structure interpretation.

Suspension and corporate-action reset are separate causal layers.

## 18. Price-limit interaction

If resumption print is near or at a daily limit:
DL-064 limit-state receipt is required.

A resumption jump can be jointly constrained by:
- stale-price catch-up;
- material news;
- daily price limit;
- structural zone.

Do not credit all channels as independent confirmations.

## 19. Resume-auction interaction

DL-062 auction semantics remain mandatory.

If the first resumption price is from a call auction:
RESUMPTION_FIRST_CALL_PRINT.

It is not a continuous breakout/retest event.

## 20. No-lookahead / SDA-002

Every suspension/resumption receipt requires:
- firstObservableAt;
- knownAt;
- suspensionStartAt;
- suspensionEndAt or OPEN;
- predictorFreezeAt;
- source/version/hash;
- replaySafe.

Later knowledge of the suspension reason, final transaction terms or subsequent news cannot rewrite an earlier predictor snapshot.

## 21. Information-root / SDA-001

Old zone, stale pre-suspension price, resumption print and opening gap all share PRICE_OHLC ancestry.

News/order-book/market context are controls, not automatic independent confirmations.

Default:
effectiveIndependentEvidenceCount = 1 within one parent until residual dependence is established.

## 22. Future D16 ladder

S0 RAW_RESUMPTION_ZONE_RESPONSE

S1 VERIFIED_SUSPENSION_INTERVAL_CONTROLLED

S2 ELIGIBLE_SESSION_VS_CALENDAR_AGE_SEPARATED

S3 PRE_SUSPENSION_STALE_ANCHOR_CONTROLLED

S4 FIRM_INFORMATION_DURING_SUSPENSION_CONTROLLED

S5 MARKET_SECTOR_GLOBAL_MOVE_CONTROLLED

S6 CORPORATE_ACTION_CONTINUITY_CONTROLLED

S7 RESUMPTION_REFERENCE_AND_AUCTION_CONTROLLED

S8 PRICE_LIMIT_CONTEXT_CONTROLLED

S9 REOPENING_ORDER_FLOW_LIQUIDITY_CONTROLLED

S10 GENERIC_SUSPENSION_COMPARATOR_CONTROLLED

S11 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE

S12 MULTI_DURATION_MULTI_EVENT_MULTI_SYMBOL_REPLICATION

## 23. Interpretation states

Q0 STALE_PRICE_ANCHOR_EXPLANATION

Q1 INFORMATION_ACCUMULATION_EXPLANATION

Q2 REOPENING_PRICE_DISCOVERY_EXPLANATION

Q3 CORPORATE_ACTION_RESET_EXPLANATION

Q4 PRICE_LIMIT_CATCHUP_EXPLANATION

Q5 REOPENING_LIQUIDITY_EXPLANATION

Q6 MULTIPLE_SUSPENSION_MECHANISMS

Q7 STRUCTURAL_RESPONSE_RESIDUAL

Q8 SUSPENSION_PROVENANCE_UNKNOWN

Q9 NOT_EVALUABLE

None proves alpha.

## 24. Required manifest fields

Per resumption opportunity:
- parentDecisionId;
- symbol;
- suspensionType;
- suspensionStartAt;
- suspensionEndAt;
- suspensionCalendarDays;
- suspensionMarketSessions;
- lastPreSuspensionTradeAt;
- lastPreSuspensionClose;
- lastPreSuspensionStructuralRootId;
- lastPreSuspensionStructuralVersionId;
- eligibleTradingSessionAge;
- calendarInformationAge;
- predictorFreezeAt;
- resumptionReferencePrice;
- resumptionReferenceReceipt;
- resumptionIndicativePrice;
- resumptionFirstPrint;
- resumptionFirstPrintKnownAt;
- resumptionPhase;
- resumptionGapPrice;
- resumptionGapAtr;
- resumptionPriceToOldZoneDistance;
- marketMoveDuringSuspension;
- sectorMoveDuringSuspension;
- corporateActionReceipt;
- priceLimitReceipt;
- newsEventReceipt;
- orderBookReceipt;
- informationRoot;
- effectiveIndependentEvidenceCount;
- replaySafe;
- evaluabilityReason;
- manifestVersion/hash.

No future response outcome field.

## 25. Current decision

VERIFIED_SUSPENSION_EQUALS_MISSING_DATA =
FALSE.

SUSPENSION_SESSION_GETS_PSEUDO_BAR =
FALSE.

TRADING_SESSION_AGE_EQUALS_INFORMATION_AGE =
FALSE.

PRE_SUSPENSION_LAST_PRICE_EQUALS_CURRENT_EQUILIBRIUM =
FALSE.

RESUMPTION_FIRST_CALL_PRINT_EQUALS_CONTINUOUS_TOUCH =
FALSE.

RESUMPTION_GAP_EQUALS_STRUCTURAL_CROSSING =
FALSE.

OLD_QUEUE_IDENTITY_PERSISTS_ACROSS_MULTI_SESSION_SUSPENSION =
FALSE.

SUSPENSION_AUTOMATICALLY_INVALIDATES_STRUCTURAL_ROOT =
FALSE.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 26. Exact next continuation

1. Build deterministic suspension-interval / dual-age / resumption-phase / gap classifier and adversarial tests.
2. Preserve verified suspension sessions as non-trading sessions rather than pseudo-bars or missing-source failures.
3. Consume Corporate Actions/D08/D04-D05/D09-D12/D18 owner receipts.
4. Hand S0-S12 / Q0-Q9 suspension-attribution inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate structural response from intraday volatility interruption / delayed matching / dynamic price-stabilization mechanics, which are not the same as multi-session suspension.
7. No outcome join / no runtime wiring / no Formal change.


## 27. Reopening discovery interval and anchor-freshness refinement

DL-066 also freezes a distinct post-resumption price-discovery layer.

Preserve separately:
- LAST_EXECUTED_PRICE_BEFORE_SUSPENSION;
- EXCHANGE_REOPENING_REFERENCE;
- FIRST_REOPENING_AUCTION_PRICE;
- FIRST_CONTINUOUS_TRADE_AFTER_REOPENING;
- POST_REOPENING_STABILIZED_REFERENCE.

These fields may coincide numerically, but they are not semantically interchangeable.

Stale-anchor classes are descriptive:
- SAME_SESSION_SHORT_HALT;
- ONE_MARKET_SESSION_SUSPENSION;
- MULTI_SESSION_SUSPENSION;
- CANONICAL_EXTENDED_SUSPENSION;
- SUSPENSION_FRESHNESS_UNKNOWN.

D01 does not invent an outcome-tuned duration threshold for "stale enough."

The first reopening call print may cross an old structural boundary, but:
FIRST_REOPENING_AUCTION_PRICE != CONFIRMED_BREAKOUT.

A structural reconfirmation after suspension requires a separately preregistered post-resumption observation rule and must occur after the first reopening price becomes observable.

Candidate discovery windows may include first auction, first 5m, first 15m, first 30m or first session only when frozen before outcome inspection. The winning window may not be selected ex post.

Root reopening states:
- ROOT_PERSISTS_BUT_STALE;
- ROOT_REBASED_BY_MECHANICAL_EVENT;
- ROOT_RECONFIRMED_AFTER_REOPENING;
- ROOT_BREACHED_DURING_REOPENING_DISCOVERY;
- ROOT_INVALIDATED_BY_NEW_INFORMATION;
- ROOT_STATE_UNKNOWN.

These lifecycle states do not change the rule that a verified suspension receives no pseudo-bars.

## 28. Additional current decisions

FIRST_REOPENING_AUCTION_EQUALS_CONFIRMED_BREAKOUT =
FALSE.

DISCOVERY_WINDOW_BEST_AFTER_OUTCOME =
PROHIBITED.

ROOT_RECONFIRMATION_FROM_FIRST_CALL_ONLY =
PROHIBITED.

STALE_DURATION_SCORE =
NOT_DEFINED.
