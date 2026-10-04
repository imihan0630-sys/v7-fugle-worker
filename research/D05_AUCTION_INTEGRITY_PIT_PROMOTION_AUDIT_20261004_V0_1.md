# D05-06 / D05-14 Taiwan PIT Feasibility Promotion Audit — 2026-10-04 V0.1

Updated: 2026-10-04 Asia/Taipei
Room: 04｜波動與市場微結構研究室
Status: OUTCOME_BLIND_L3_FEASIBILITY_AUDIT
Formal Core impact: NONE
L4 / alpha claim: NONE

## Canonical maturity boundary

L2 = mechanism + falsification defined.
L3 = Taiwan PIT source / clock / semantics / replay feasibility validated.
L4 = genuine prospective Shadow or untouched chronological OOS evidence.

This audit does not inspect economic outcomes and does not authorize strategy mapping.

---

## D05-06 Opening / Closing Auction & Auction Imbalance — PASS L2 -> L3

### Mechanism ownership already accepted

COV-02 has already been accepted as:
EXTEND_EXISTING_SCOPE -> D05-06.

D05-06 is the canonical owner of:
- OPEN_CALL;
- OPEN_TRIAL;
- CLOSE_CALL_ACCUMULATION;
- CLOSE_TRIAL;
- CLOSE_DELAYED;
- CLOSE_FINAL;
- observed auction imbalance / indicative state when natively available.

No new module is added.

### Taiwan prospective source feasibility

Current stock WebSocket / quote source semantics expose:
- isTrial;
- isContinuous;
- isDelayedOpen;
- isDelayedClose;
- isOpen;
- isClose;
- top-five bids/asks for Books;
- trade/quote time;
- trial information where supported.

Current Fugle stock Books documentation exposes best-five bids/asks and isTrial/isContinuous.
Current stock Trades/Aggregates documentation exposes trial/close/delayed-close state and timestamped trial/final information.

Therefore a prospective closing-auction parent can freeze:
- symbol;
- marketDate;
- providerTimestamp;
- capturedAt;
- auctionPhase;
- isTrial;
- bids/asks during trial when natively observed;
- final close tick / final auction price;
- delayed-close state;
- source receipt hash.

This is sufficient for Taiwan PIT/replay feasibility from the first prospective capture date.

### Critical historical boundary

No current source proves a complete historical timestamped pre-close trial/imbalance series for dates that were not captured prospectively.

Therefore:
- missing historical pre-close trial state = UNKNOWN;
- missing historical imbalance = UNKNOWN;
- final close/final volume cannot backfill pre-close imbalance;
- EOD volume spikes cannot be relabeled auction imbalance.

### Imbalance semantic boundary

A true imbalance variable requires actually observed timestamped buy-vs-sell excess demand / trial book state.
Top-five trial books can support bounded displayed-book imbalance descriptors, but not hidden full-book excess demand unless the source explicitly supplies it.

Allowed:
- DISPLAYED_TRIAL_DEPTH_IMBALANCE;
- TRIAL_BEST_BID_ASK_STATE;
- FINAL_AUCTION_DISPLACEMENT;
- FINAL_AUCTION_VOLUME.

Prohibited without native source:
- FULL_AUCTION_IMBALANCE;
- HISTORICAL_PRE_CLOSE_IMBALANCE_BACKFILL.

### Anti-double-count

- D05-06 owns auction primitives.
- D05-14 may consume auction state for integrity interpretation.
- D14 may consume the same parent for execution quality.
- D11/D17 may provide external event clocks.
- no consumer receives an extra alpha vote from re-expressing the same auction parent.

### Decision

D05-06 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED_PROSPECTIVE_ONLY /
HISTORICAL_PRE_CLOSE_IMBALANCE_UNKNOWN.

No L4 claim.
No directional alpha claim.

---

## D05-14 Market Integrity / Abnormal Trading Patterns — PASS L2 -> L3 WITH NON-ACCUSATORY SCOPE

### Official surveillance source feasibility

TWSE public official pages provide:
- Announcement of Attention Securities;
- Announcement of Disposition Securities;
- date-range queries;
- CSV download;
- database coverage from January 2001.

The Attention page states the information is updated daily at 17:00.
A separate TWSE Data E-Shop product states daily Attention/Disposition statistics are generated at 19:00; this is a later conservative official production clock for that commercial file, not a reason to backdate public-page availability.

Current surveillance rules are versioned in the TWSE regulation directory, including amendment dates and legislative history.

### PIT replay contract

For public-page replay, use a conservative source contract:
- announcementDate;
- securityCode;
- officialAttentionState;
- officialDispositionState;
- disposition period/measure/reason when present;
- ruleVersionEffectiveDate;
- sourceUrl;
- capturedAt;
- page/CSV hash;
- knownAtNotBefore = official daily update boundary when exact earlier timestamp is unavailable.

Historical records may be replayed by announcement date, but must never be considered known before the applicable official publication/update boundary.

If exact historical publication time cannot be independently verified:
- intradayKnownAt = UNKNOWN;
- only after-market eligibility is allowed.

### Public observable anomaly family

The module can prospectively replay non-accusatory observable states using PIT market data:
- abnormal price/volume/turnover state;
- official attention/disposition state;
- spread/depth/trial/limit/session context;
- public cancellation-like snapshot patterns only when capture semantics support them.

### Actor-intent firewall remains

L3 feasibility does NOT make the following observable:
- beneficial-owner identity;
- collusive agreement;
- manipulative intent;
- exact spoof intent;
- coordinated account linkage;
- wash-trade attribution.

Those remain UNKNOWN without authoritative account/order/legal evidence.

Allowed L3 machine states remain:
- OFFICIAL_ATTENTION;
- OFFICIAL_DISPOSITION;
- OBSERVED_STATISTICAL_ANOMALY;
- EXPLAINED_ABNORMALITY;
- INTEGRITY_PATTERN_CANDIDATE;
- UNKNOWN.

Prohibited without authoritative finding:
- MANIPULATOR;
- ILLEGAL_TRADING_CONFIRMED;
- FRAUD_CONFIRMED;
- INFORMED_TRADER_CONFIRMED.

### False-positive controls remain mandatory

Any future pattern study must control:
- corporate actions;
- earnings/news;
- index/ETF/rebalance;
- derivatives expiry/hedging;
- VI/price limit/disposition;
- opening/closing auction;
- odd-lot/special session;
- free float/cap/price-tick/liquidity;
- market/sector common shocks.

### Decision

D05-14 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED_BOUNDED /
ACTOR_INTENT_AND_ACCOUNT_LINKAGE_UNKNOWN.

L4 requires actual prospective/OOS pattern/event evidence after a preregistered parent.
No legal finding is inferred.

---

## Maturity effect

Before:
D05 = 51.4286% = 720 / 1400.

Two L2 -> L3 promotions add 40 points:
D05 = 760 / 1400 = 54.2857% -> 54.3%.

D04 remains 58.0%.

Room04 weighted:
(580 + 760) / 24 = 55.8333% -> 55.8%.

This is L3 source/clock/replay feasibility only.
No L4, no alpha, no Formal optimization candidate.

## Sources

- TWSE Announcement of Attention Securities public database, historical from January 2001, CSV export, daily 17:00 update note.
- TWSE Announcement of Disposition Securities public database, historical from January 2001, CSV export.
- TWSE Directions for Announcement or Notice of Attention to Trading Information and Dispositions, current rule version amended 2026-08-03 and legislative history.
- Fugle stock WebSocket Books / Trades / Aggregates documentation, current trial/continuous/close/delayed-close semantics.
