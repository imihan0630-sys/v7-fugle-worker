# D01 DL-066 — D16 Suspension/Resumption Attribution Handoff V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes suspension/resumption structural semantics.
D16 owns future residual inference.

Question:
Does a response at an old zone survive stale-anchor, information-accumulation and reopening-price-discovery controls?

## 2. Required dual clocks

Preserve separately:
- eligibleTradingSessionAge;
- calendarInformationAge;
- suspensionCalendarDays;
- suspensionMarketSessions;
- sessionsSinceResumption.

Verified suspension sessions do not increment tradable-session age, but information time continues.

## 3. Required session semantics

Do not treat verified suspension as missing data.

No pseudo-bars, forward-filled close or zero-volume bar may be inserted.

Unknown suspension provenance remains blocked.

## 4. Resumption states

Keep separate:
- RESUMPTION_ORDER_ACCEPTANCE;
- RESUMPTION_INDICATIVE_STATE;
- RESUMPTION_FIRST_CALL_PRINT;
- POST_RESUMPTION_CONTINUOUS_TRADING;
- RESUMPTION_DELAYED_OR_DEFERRED.

The first call print is not a normal continuous touch.

## 5. Required comparator

G0 RESUMPTION_EVENT_AWAY_FROM_OLD_STRUCTURAL_ZONE
G1 RESUMPTION_EVENT_AT_OLD_STRUCTURAL_ZONE

Common support should include:
- suspension duration/type;
- firm news/information;
- market/sector/global move;
- corporate-action state;
- price-limit state;
- reopening auction/liquidity;
- old structural age/history.

## 6. Stale-price anchor

The final pre-suspension trade/close is a historical anchor, not proof of current equilibrium.

Report:
- last pre-suspension price;
- resumption reference/first print;
- gap;
- distance to old zone;
- market/sector move during suspension.

## 7. Gap handling

An opposite-side first resumption print is RESUMPTION_GAP_CROSSING.

No unobserved path through the zone may be invented.

## 8. Future ladder

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

## 9. Promotion boundary

SDA-001/SDA-002 remain open.

No ranking, gating, Top6, weight, threshold, capital or runtime change is authorized.

Formal Core remains LOCKED.


## 10. Reopening discovery-window refinement

Future inference must separate:
- first reopening call print;
- first continuous trade;
- preregistered discovery interval;
- later stabilized reference.

The first call print alone cannot establish structural reconfirmation.

Any first-5m / first-15m / first-30m / first-session discovery window used for attribution must be frozen before outcome inspection and all registered windows must remain in family accounting.

Same-session short halts and multi-session suspensions must not be pooled automatically.
