# COV-02 Specialist Return — Closing Auction / Auction Imbalance

Updated: 2026-10-04 Asia/Taipei  
Room: 04｜波動與市場微結構研究室  
Packet: COV-02  
Status: SPECIALIST_RETURN_COMPLETE  
Formal Core impact: NONE  
Curriculum authority: specialist recommendation only; 00｜研究總控室 intake/owner approval still required.

## 1. Exact Knowledge Definition

Closing Auction / Auction Imbalance means the market state in which regular continuous matching has ended and orders are accumulated for the closing call auction, together with any causally observable trial/indicative price, volume and bid/ask state before the final closing match.

It is not:
- generic end-of-day volume;
- the last continuous trade;
- an after-the-fact close-minus-last-trade statistic relabeled as pre-close imbalance;
- a directional stock-selection signal.

Primary objects:
- auction mechanism state;
- accumulated eligible orders;
- indicative/trial price state where disseminated;
- visible bid/ask trial state where disseminated;
- final call-auction price/volume;
- delayed-close state where applicable.

## 2. Existing-module Overlap Matrix

| Object | D05-06 current Opening Auction | Proposed closing scope | Other owner |
|---|---|---|---|
| call-auction matching rule | YES | SAME CORE RULE FAMILY | D05-06 |
| pre-match trial/indicative state | YES conceptually | YES | D05-06 |
| continuous-session spread/OFI | NO | NO | D05-03/04/05 |
| execution cost / fill quality | context only | context only | D14 execution modules |
| event/news first-known clock | NO | NO | D11/D17 |
| integrity interpretation of unusual close | NO | consumer only | D05-14 |
| benchmark/valuation use of official close | context only | context only | downstream consumers |

Opening and closing auctions share call-auction price formation. They differ in information set and economic role:
- opening aggregates overnight information before first trade;
- closing aggregates the final five-minute order flow and creates the official close benchmark.

The difference is large enough to require explicit sub-states, but not a separate owner.

## 3. Why Current Scope Is Insufficient

D05-06 is named Opening Auction and therefore does not explicitly own:
- 13:25-13:30 closing call-auction accumulation;
- delayed close / 13:33 state;
- closing trial/indicative quote semantics;
- closing-only benchmark contamination / execution context;
- missing-history semantics for auction imbalance.

Current research already separates opening/closing/VI regimes, but ownership naming and replay contract are incomplete.

## 4. Taiwan Data Feasibility

Official TWSE evidence:
- regular close uses accumulated orders during the last five minutes and one closing call auction;
- 13:25-13:30 information is trial/simulated, not actual trades;
- if closing trial price moves beyond the volatility-interruption condition, final matching may be delayed to 13:33;
- TWSE/MIS disseminates trial information in real time.

Current practical source boundary:
- final daily close/volume is historically available;
- current real-time trial/best-quote state is source-feasible prospectively;
- a complete historical archive of every pre-close imbalance/trial snapshot is NOT currently proven in this repository.

Therefore:
`CLOSING_AUCTION_MECHANICS = SOURCE_FEASIBLE`
`PROSPECTIVE_TRIAL_STATE = SOURCE_FEASIBLE`
`HISTORICAL_PRE_CLOSE_IMBALANCE_REPLAY = PARTIAL_OR_UNKNOWN`.

Missing trial history must remain UNKNOWN. It cannot be reconstructed from final close/volume.

## 5. PIT / Replay Implication

Required clocks:
- order/trial observation timestamp;
- auction-state start 13:25;
- scheduled final close 13:30;
- delayed-close state and actual final match time when applicable;
- sourceFetchedAt / firstObservedAt;
- final official close timestamp/state.

Rules:
- a trial price observed at 13:28 cannot be used at 13:26;
- final 13:30/13:33 price cannot backfill the pre-close imbalance path;
- missing pre-close trial snapshots stay UNKNOWN;
- current MIS retrieval cannot fabricate historical first-known snapshots.

## 6. Decision Role

Primary:
- microstructure context;
- auction-price formation;
- execution/benchmark context;
- integrity/false-positive context.

Not authorized:
- independent bullish/bearish alpha vote;
- automatic BUY/SELL gate.

## 7. Anti-double-count Rule

- D05-06 owns one canonical auction primitive for opening and closing.
- D05-14 may consume the closing primitive for integrity interpretation but cannot create a second auction alpha vote.
- D14 execution modules may consume auction state to estimate fill/cost but cannot re-own exchange mechanics.
- D11/D17 event clocks may explain why order flow changed but do not own auction mechanics.
- generic end-of-day volume from D02 cannot be counted again as a distinct closing-imbalance vote unless residual pre-close information is proven.

## 8. Proposed Owner

`D05-06` expanded owner:

**Opening / Closing Auction & Auction Imbalance（開收盤集合競價與競價不平衡）**

Substates:
- OPEN_CALL;
- OPEN_TRIAL;
- NORMAL_CONTINUOUS;
- CLOSE_CALL_ACCUMULATION;
- CLOSE_TRIAL;
- CLOSE_DELAYED;
- CLOSE_FINAL;
- UNKNOWN.

## 9. Maturity Starting Point

Scope extension only.

No maturity increase solely from renaming/ownership cleanup.

Existing D05-06 maturity remains subject to normal evidence gates. Any future L3 promotion must prove Taiwan PIT source/semantic/replay feasibility for the expanded scope, with missing historical pre-close imbalance preserved as UNKNOWN.

## 10. Terminal Recommendation

`EXTEND_EXISTING_SCOPE`

Reason:
opening and closing call auctions share one coherent exchange-mechanics owner. A separate closing module would duplicate call-auction price-formation rules and create producer/consumer double-count risk. Closing-only differences are best represented as explicit substates and data-quality/replay constraints inside D05-06.

No module-count change.
No Formal Core change.

## Specialist evidence anchors

- TWSE Operating Rules Article 58-3 call-auction price formation.
- TWSE Trading Mechanism / investor Q&A: 13:25-13:30 trial information, final closing auction, delayed 13:33 close.
- Current room research: MICROSTRUCTURE_RESEARCH.md / MICROSTRUCTURE_CHECKPOINT.md.
