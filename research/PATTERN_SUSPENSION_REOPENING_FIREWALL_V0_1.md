# D01 DL-066 — Suspension/Resumption Stale-Anchor & Reopening Price-Discovery Firewall V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / SUSPENSION_REOPENING_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-065 separated structural response from corporate-action mechanical price resets.

DL-066 freezes a distinct attribution firewall:

> A pre-suspension last trade, prior structural boundary, or apparent reopening gap can be stale because no executable price discovery occurred during the no-trade interval. The first tradable reopening price may jointly reflect accumulated information, overnight/cross-market movement, auction imbalance, reference-price rules, and genuine structural response.

D01 must not treat a stale pre-suspension anchor as continuously observed market consensus.

No future outcome is opened in this tranche.

## 2. Canonical distinction

Preserve separately:

- LAST_EXECUTED_PRICE_BEFORE_SUSPENSION
- LAST_CONTINUITY_STRUCTURAL_ANCHOR
- EXCHANGE_REOPENING_REFERENCE
- FIRST_REOPENING_AUCTION_PRICE
- FIRST_CONTINUOUS_TRADE_AFTER_REOPENING
- REOPENING_DISCOVERY_INTERVAL
- POST_REOPENING_STABILIZED_REFERENCE

These are not interchangeable.

The last traded price is an execution fact from the last active session.
It is not proof of a valid current fair-value anchor during a multi-session no-trade interval.

## 3. Taiwan exchange semantics

TWSE rules distinguish suspension/halting, order acceptance, resumption timing, call-auction reopening, and reference-price handling.

D01 consumes official suspension/resumption receipts fail-closed.

At minimum preserve:

- suspensionStartAt
- suspensionReasonClass
- suspensionEffectiveSessions
- resumptionAnnouncementAt
- resumptionEffectiveAt
- orderAcceptanceRestartAt
- firstMatchingAt
- reopeningMechanism
- reopeningReferencePrice
- lastTradingDayClose
- lastTradingDayAuctionReference
- priceLimitReference
- source/version/hash
- firstKnownAt
- replaySafe

Unknown or conflicting suspension/resumption state:
SUSPENSION_RESUMPTION_DATA_BLOCKED.

## 4. Stale anchor

A structural level created before suspension may remain causally relevant, but its market freshness decays while trading is impossible.

Freeze:

STRUCTURAL_ROOT_PERSISTS_CAUSALLY != EXECUTABLE_ANCHOR_REMAINS_FRESH.

For every pre-suspension root preserve:

- structuralRootId
- structuralVersionId
- lastObservedAt
- suspensionStartAt
- noTradeBusinessDays
- informationGapDuration
- staleAnchorState
- reopeningTransformVersion

Stale anchor states:

- NO_SUSPENSION_OVERLAP
- SAME_SESSION_SHORT_HALT
- ONE_BUSINESS_DAY_SUSPENSION
- MULTI_SESSION_SUSPENSION
- EXTENDED_SUSPENSION
- SUSPENSION_STATE_UNKNOWN

No automatic numeric decay score is defined.

## 5. No pseudo-bars

Suspended/no-trade sessions do not receive fabricated OHLC bars.

D01 must not:
- forward-fill last close as if it were an observed bar;
- create zero-volume pseudo-bars and then use them in pattern geometry;
- let moving-window geometry interpret no-trade sessions as stable price acceptance.

Calendar/session continuity and trade-price continuity are different objects.

## 6. Reopening gap decomposition

Observed reopening gap:

REOPENING_RAW_GAP =
FIRST_REOPENING_AUCTION_PRICE
minus
LAST_EXECUTED_PRICE_BEFORE_SUSPENSION.

This gap is not automatically pattern evidence.

Potential components include:

- INFORMATION_ACCUMULATION_DURING_SUSPENSION
- OVERNIGHT_OR_CROSS_MARKET_MOVE
- CORPORATE_ACTION_RESET
- EXCHANGE_REFERENCE_PRICE_MECHANICS
- OPENING_AUCTION_IMBALANCE
- LIQUIDITY_SCARCITY
- PRICE_LIMIT_CONSTRAINT
- GENUINE_STRUCTURAL_REPRICING
- UNKNOWN_COMPONENT

Only residual structure after required controls may become a structural-response candidate.

## 7. Reopening call auction is price discovery

The first reopening auction aggregates orders after acceptance restarts.

Therefore the auction print is an endogenous price-discovery event, not merely another ordinary continuation bar.

D01 must preserve:
- auction start/end;
- visible order/imbalance receipt where owner-certified;
- first match;
- immediately subsequent continuous trades;
- reopening volatility;
- liquidity state.

Queue/depth interpretation remains owned by D04/D05.

## 8. Same-session halt vs multi-session suspension

Do not pool them.

Same-session short halt:
- prior price may be relatively fresh;
- market-wide information gap is shorter;
- unexecuted-order handling and intraday resumption rules matter.

Multi-session suspension:
- last trade can become materially stale;
- non-trading information accumulation is larger;
- cross-market and benchmark moves must be controlled;
- first reopening auction carries a larger price-discovery burden.

Separate strata are mandatory.

## 9. Cross-market information gap

For multi-session suspension preserve external context over the no-trade interval:

- market index return;
- industry/peer return;
- ADR/depositary receipt where applicable;
- sector ETF/proxy where applicable;
- FX/rates/commodity context if economically relevant;
- material announcements/events.

D01 does not infer causality from these.
D09/D12/D08 own their respective canonical contexts.
D16 controls them in residual inference.

## 10. Price-limit interaction

On reopening, price-limit/reference-price rules can constrain immediate price discovery.

A limit hit near reopening may represent:
- accumulated information still not fully incorporated;
- mechanical legal bound;
- latent demand/supply;
- structural zone co-location.

DL-064 price-limit firewall remains active.

No reopening limit event is an automatic confirmation of structural strength.

## 11. Corporate-action interaction

If suspension overlaps ex-right/ex-dividend, capital reduction, demerger, par-value change or another verified mechanical reset, DL-065 continuity semantics apply first.

Reopening raw gap is not interpretable until:
- corporate-action reference mechanics are resolved;
- technical continuity factor is verified;
- raw and continuity spaces are separated.

## 12. Structural root lifecycle

A pre-suspension root can have one of these reopening states:

- ROOT_INVALIDATED_BY_NEW_INFORMATION
- ROOT_PERSISTS_BUT_STALE
- ROOT_REBASED_BY_MECHANICAL_EVENT
- ROOT_RECONFIRMED_AFTER_REOPENING
- ROOT_BREACHED_DURING_REOPENING_DISCOVERY
- ROOT_STATE_UNKNOWN

Do not infer reconfirmation from first reopening print alone.

Reconfirmation requires post-reopening observable interaction under a preregistered rule.

## 13. Reopening discovery interval

Freeze a distinct reopening discovery window.

Candidate research windows may include:
- first auction only;
- first 5 minutes;
- first 15 minutes;
- first 30 minutes;
- first full session.

D01 does not choose the winning window ex post.

Future validation must preregister one or more windows and report all registered windows.

## 14. Hindsight firewall / SDA-002

A root may appear "respected" only after later bars reveal reversal.

Predictor state must preserve:
- root knownAt;
- suspension receipt knownAt;
- reopening reference knownAt;
- first auction knownAt;
- confirmationAt;
- invalidationAt;
- predictorFreezeAt.

Later reopening behavior cannot backfill the initial label.

## 15. Same-root redundancy / SDA-001

Pre-suspension root, reopening gap, first-auction breakout, and early momentum all inherit PRICE_OHLC ancestry unless an independent information root is explicitly demonstrated.

Default:
informationRoot = PRICE_OHLC;
effectiveIndependentEvidenceCount = 1.

Auction imbalance/depth is not automatically independent; D04/D05 lineage controls apply.

## 16. Primary future comparator

G0 SUSPENSION_REOPENING_AWAY_FROM_STRUCTURAL_ZONE

G1 SUSPENSION_REOPENING_AT_STRUCTURAL_ZONE

Common support must preserve:
- suspension duration;
- suspension reason;
- benchmark/industry move during suspension;
- corporate-action overlap;
- reopening reference mechanics;
- price-limit distance;
- liquidity;
- volatility/regime;
- structural age/history;
- event/news intensity.

## 17. Raw falsifier

Future analysis must report:

- apparent breakout on first reopening auction but failure after discovery interval;
- apparent support break on stale raw anchor but continuity/context-adjusted preservation;
- reopening move explained by benchmark/industry move;
- reopening move explained by corporate-action reset;
- reopening move constrained by daily price limit;
- residual structural interaction after all controls.

These are attribution findings, not alpha.

## 18. Future D16 ladder

R0 PRE_SUSPENSION_RAW_ZONE_RESPONSE
R1 SUSPENSION_INTERVAL_IDENTIFIED
R2 POINT_IN_TIME_SUSPENSION_RECEIPT_CONTROLLED
R3 NO_TRADE_INTERVAL_EXCLUDED_FROM_PATTERN_GEOMETRY
R4 CORPORATE_ACTION_OVERLAP_CONTROLLED
R5 REOPENING_REFERENCE_MECHANICS_CONTROLLED
R6 PRICE_LIMIT_CONSTRAINT_CONTROLLED
R7 BENCHMARK_AND_INDUSTRY_GAP_CONTROLLED
R8 EVENT_NEWS_CONTEXT_CONTROLLED
R9 OPENING_AUCTION_DISCOVERY_CONTROLLED
R10 POST_REOPENING_DISCOVERY_WINDOW_CONTROLLED
R11 STALE_ANCHOR_FRESHNESS_STRATIFIED
R12 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE
R13 MULTI_DURATION_MULTI_REASON_MULTI_REGIME_REPLICATION

## 19. Interpretation states

Q0 STALE_PRICE_ANCHOR_EXPLANATION
Q1 INFORMATION_ACCUMULATION_EXPLANATION
Q2 CROSS_MARKET_CATCHUP_EXPLANATION
Q3 CORPORATE_ACTION_RESET_EXPLANATION
Q4 REOPENING_AUCTION_IMBALANCE_EXPLANATION
Q5 PRICE_LIMIT_CONSTRAINT_EXPLANATION
Q6 LIQUIDITY_SCARCITY_EXPLANATION
Q7 STRUCTURAL_RESPONSE_RESIDUAL
Q8 SUSPENSION_DATA_UNKNOWN
Q9 NOT_EVALUABLE

None proves alpha.

## 20. Current decision

PRE_SUSPENSION_LAST_TRADE_EQUALS_CURRENT_FAIR_VALUE = FALSE.

NO_TRADE_SESSION_EQUALS_ZERO_RETURN_BAR = FALSE.

FIRST_REOPENING_AUCTION_EQUALS_CONFIRMED_BREAKOUT = FALSE.

REOPENING_GAP_EQUALS_PATTERN_GAP = FALSE.

STRUCTURAL_ROOT_CAUSAL_PERSISTENCE_EQUALS_FRESH_EXECUTABLE_ANCHOR = FALSE.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT = 1.

OUTCOME_JOIN = CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.

Formal Core remains LOCKED.

## 21. Exact next continuation

1. Build deterministic suspension-session exclusion and reopening-anchor classifier.
2. Add adversarial cases for pseudo-bar contamination, stale-anchor persistence, corporate-action overlap, benchmark catch-up, price-limit reopening, and first-auction false breakout.
3. Hand R0-R13 / Q0-Q9 residual inference to D16.
4. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
5. Next D01 science: quantify structural-anchor half-life/freshness without inventing an arbitrary time-decay score; compare session-count, information-arrival and volatility-scaled freshness definitions.
6. No outcome join / no runtime wiring / no Formal change.
