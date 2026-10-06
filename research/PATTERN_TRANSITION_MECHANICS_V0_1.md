# D01 DL-050 — Ordinary Oscillation vs Auction / Limit / Event / Microstructure Repricing V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / TRANSITION_MECHANICS_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-049 separated zone occupancy from directional churn/path disorder.

DL-050 asks whether an observed zone-state transition is ordinary continuous-market oscillation or a mechanically different repricing event.

A close-state change near a structural zone can be produced by:
- ordinary continuous trading;
- opening call auction;
- closing call auction;
- intraday volatility-interruption reopening auction;
- daily price-limit constraint;
- bid-ask bounce / transaction-price alternation;
- verified external-event context;
- unresolved mechanism.

These mechanisms must remain visible separately before any zone-churn or acceptance interpretation.

No future-return outcome is opened in this tranche.

## 2. External evidence

Taiwan Stock Exchange current trading documentation states:
- regular-session first matching uses call auction;
- continuous trading operates intraday;
- the final period before close returns to call auction;
- intraday volatility interruption can postpone matching for two minutes and reopen through call auction;
- stocks generally trade within a daily price fluctuation range around the auction reference price, with explicit exceptions;
- legal tick size changes by price range.

Current D01 research consumes these rules through point-in-time market-mechanism receipts.
It does not hard-code today's rule set into historical samples.

TWSE evidence also shows trading-method changes can materially alter volatility, liquidity and price discovery.

Roll's bid-ask-spread model demonstrates that alternating trades at bid and ask can induce short-horizon negative serial dependence in observed transaction prices even without corresponding changes in underlying value.

Therefore repeated short-horizon price alternation is not automatically structural churn.

## 3. Owner boundaries

D01 owns:
- relation of observed price path to a frozen structural zone;
- zone-state transition semantics;
- mechanism labels consumed from canonical receipts;
- research comparison classes.

D04/D05 own:
- spread;
- depth;
- quote/trade microstructure;
- bid-ask bounce confirmation;
- volatility-interruption / microstructure context where routed.

D11 owns:
- event identity;
- first-known event timing;
- event-window semantics.

D01 does not infer investor intent or order-flow causality from OHLC alone.

## 4. Four orthogonal context axes

Do not force all transition mechanisms into one categorical cause.

Every transition carries four separate axes.

### A. MATCHING_MECHANISM

Allowed:
- CONTINUOUS;
- OPEN_CALL_AUCTION;
- CLOSE_CALL_AUCTION;
- VI_REOPEN_CALL_AUCTION;
- OTHER_CALL_AUCTION;
- UNKNOWN.

### B. PRICE_CONSTRAINT_STATE

Allowed:
- UNCONSTRAINED;
- DAILY_LIMIT_UP_CONSTRAINED;
- DAILY_LIMIT_DOWN_CONSTRAINED;
- SPECIAL_NO_LIMIT_REGIME;
- UNKNOWN.

### C. MICROSTRUCTURE_BOUNCE_STATE

Allowed:
- QUOTE_CONFIRMED_BID_ASK_BOUNCE;
- EXACT_EVENT_NOT_BOUNCE;
- CANDIDATE_UNVERIFIED;
- NOT_EVALUABLE.

### D. EVENT_CONTEXT

Allowed:
- VERIFIED_EVENT_CONTEXT;
- VERIFIED_NO_EVENT_CONTEXT;
- EVENT_CONTEXT_UNKNOWN.

These axes may coexist.
Example:
VI_REOPEN_CALL_AUCTION + UNCONSTRAINED + NOT_EVALUABLE + VERIFIED_EVENT_CONTEXT.

## 5. Point-in-time rule receipt

Every market-mechanism classification requires:
- venue;
- effectiveFrom / effectiveTo;
- sourceVersion;
- asOf;
- session segment;
- legal tick receipt;
- price-limit regime receipt;
- VI / auction receipt where applicable.

A 2026 rule may not be silently backfilled into an earlier date.

If the point-in-time rule is unresolved:
MARKET_MECHANISM_DATA_BLOCKED.

## 6. Auction repricing

Call-auction prices result from accumulated order books under auction matching rules.

A large price change between:
- prior continuous trade and closing auction;
- previous close and opening auction;
- pre-VI trade and VI reopening auction

is a discrete repricing transition.

Do not count the jump as multiple continuous crossings.

Do not infer the path through intermediate zone prices.

For a zone crossed by an auction jump:
AUCTION_CROSSED_ZONE may be recorded.
Exact continuous traversal count remains UNKNOWN.

## 7. Volatility-interruption reopening

VI reopening is not ordinary continuous churn.

Store:
- viTriggered;
- viStartAt;
- viEndAt;
- referencePrice;
- reopenAuctionPrice;
- frozen rule receipt.

A pre-VI state and post-reopen state may differ across the structural zone.

That is:
VI_REOPEN_REPRICING.

Do not label it repeated free-market oscillation.

## 8. Daily price-limit constraints

Price-limit hits can mechanically censor one side of the path.

A zone-state sequence near limit-up / limit-down may show:
- compressed movement;
- one-sided queueing;
- inability to traverse beyond the legal bound;
- next-session gap continuation/reversal.

D01 therefore records price-limit constraint separately.

No observation at a price limit is treated as ordinary acceptance/churn without constraint context.

No current ±10% rule is backfilled to dates with a different regime or to exempt securities.

## 9. Legal tick scale

A one-tick alternation at different price levels has different absolute price size.

Tick rules are point-in-time inputs.

Do not compare raw one-tick churn across:
- different price levels;
- different historical tick regimes;
- securities with different quoting rules

without normalization / common support.

D01 does not redefine the canonical tick table.

## 10. Bid-ask bounce

Bid-ask bounce is a microstructure explanation for alternating transaction prices.

D01 can classify:
QUOTE_CONFIRMED_BID_ASK_BOUNCE
only when the canonical D04/D05 receipt confirms:
- exact ordered trade/quote timestamps;
- trade-side / quote relation or equivalent microstructure evidence;
- replay-safe provenance;
- evidence available by the predictor clock.

OHLC bars or close-state alternation alone can produce only:
CANDIDATE_UNVERIFIED
or
NOT_EVALUABLE.

Do not infer bid/ask alternation from candles.

## 11. Bounce does not erase structural state

A quote-confirmed bounce can occur near a real structural zone.

Therefore:
- structural-zone presence;
- path/churn descriptor;
- bid-ask-bounce state

remain separate.

The correct question is whether structural/path representation adds residual information after microstructure-bounce controls.

## 12. Event context is not causal attribution

If D11 supplies a verified first-known event overlapping the transition:
EVENT_CONTEXT = VERIFIED_EVENT_CONTEXT.

This means only that a known event context exists.

It does NOT mean:
- the event caused the repricing;
- the zone became irrelevant;
- the price move is independent evidence.

Causal event attribution belongs to D11/D16 research.

## 13. Gap and discrete jump semantics

For any discrete mechanism:
- start state;
- end state;
- zone-crossed boolean;
- observed execution states;
- unobserved intermediate path flag

must be stored separately.

A jump from BELOW to ABOVE via opening auction does not prove price continuously traded through INSIDE.

Intermediate occupancy / dwell remains UNKNOWN.

## 14. Mechanism-stratified research classes

K0 ORDINARY_CONTINUOUS_UNCONSTRAINED

K1 OPEN_OR_CLOSE_AUCTION_REPRICING

K2 VI_REOPEN_REPRICING

K3 PRICE_LIMIT_CONSTRAINED

K4 QUOTE_CONFIRMED_BID_ASK_BOUNCE

K5 VERIFIED_EVENT_CONTEXT

K6 MIXED_MECHANISM

K7 NOT_EVALUABLE

These are research contexts, not alpha labels.

## 15. Mixed mechanisms

Mechanisms can overlap.

Examples:
- event + opening call auction;
- event + limit-up;
- VI reopening + wide spread;
- structural retest + quote-confirmed bounce.

Do not force one "winner."

Store the full context vector and derive MIXED_MECHANISM only as a descriptive grouping.

## 16. Relation to DL-049

DL-049 churn descriptors are not discarded.

Instead each path observation receives mechanism context.

Future analyses must compare:
- all churn;
- ordinary continuous churn only;
- auction/VI/limit excluded;
- quote-confirmed bounce excluded or controlled;
- event-context stratified.

If an apparent churn effect disappears after these exclusions:
MECHANISM_CONFOUND is strengthened.

## 17. Information lineage

OHLC state path:
informationRoot = PRICE_OHLC.

Exact event / quote mechanics can additionally involve:
TRADE_TIME;
QUOTE_TIME;
ORDER_BOOK;
VENUE_RULE.

These are not automatically independent alpha roots.

Default:
effectiveIndependentEvidenceCount = 1;
independentVoteAllowed = false;
residualIncrementalityStatus = NOT_VALIDATED.

## 18. Future D16 questions

Q1:
Does DL-049 churn survive restriction to K0 ordinary continuous unconstrained transitions?

Q2:
How much apparent churn is attributable to auction / VI / price-limit mechanics?

Q3:
Does quote-confirmed bid-ask bounce explain short-horizon side-flip patterns?

Q4:
Does structural-zone information remain after bounce/spread/liquidity controls?

Q5:
Do event-context transitions differ from non-event transitions on common support?

Q6:
Do bar-level findings survive exact-event reconstruction?

Q7:
Does any mechanism-stratified descriptor add residual information after PRICE_OHLC de-duplication?

## 19. Required manifest fields

Per transition:
- parentDecisionId;
- symbol;
- venue;
- timeframe;
- semanticSpace;
- structuralRootId;
- structuralVersionId;
- zoneLower;
- zoneUpper;
- transitionAt;
- startZoneState;
- endZoneState;
- matchingMechanism;
- priceConstraintState;
- microstructureBounceState;
- eventContextState;
- viTriggered;
- auctionReceiptId;
- priceLimitReceiptId;
- tickRuleReceiptId;
- microstructureReceiptId;
- eventReceiptId;
- crossedZone;
- intermediatePathObserved;
- exactSequenceAvailable;
- replaySafe;
- predictorFreezeAt;
- informationRoots;
- effectiveIndependentEvidenceCount;
- residualIncrementalityStatus;
- manifestVersion/hash.

No future-return field belongs in this manifest.

## 20. Current decision

ALL_ZONE_CHURN_IS_ORDINARY_OSCILLATION =
FALSE.

CALL_AUCTION_JUMP_EQUALS_CONTINUOUS_TRAVERSAL =
FALSE.

VI_REOPEN_EQUALS_ORDINARY_CHURN =
FALSE.

PRICE_LIMIT_OBSERVATION_EQUALS_UNCONSTRAINED_PATH =
FALSE.

OHLC_ALTERNATION_PROVES_BID_ASK_BOUNCE =
FALSE.

VERIFIED_EVENT_CONTEXT_PROVES_EVENT_CAUSATION =
FALSE.

CURRENT_RULE_BACKFILL_TO_HISTORY =
PROHIBITED.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 21. Exact next continuation

1. Build deterministic transition-mechanism classifier with point-in-time receipt guards.
2. Add adversarial cases for auction jumps, VI reopenings, limit constraints, tick changes, quote-confirmed bounce and event-context coexistence.
3. Preserve multi-axis context rather than forcing single-cause classification.
4. Hand K0-K7 / Q1-Q7 common-support and residual inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate structural-zone churn from volatility clustering / realized-volatility bursts and from spread/depth deterioration.
7. No runtime wiring / no Formal change.
