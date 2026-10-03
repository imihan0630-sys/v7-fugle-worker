# COV-02 Specialist Return — Closing Auction / Auction Imbalance

Updated: 2026-10-04 Asia/Taipei  
Status: SPECIALIST_RETURN_CONTRACT_COMPLETE / READY_FOR_00_INTAKE  
Formal Core impact: NONE  
Canonical curriculum impact: NONE / SPECIALIST_RECOMMENDATION_ONLY

## Formal Intake Header

- Candidate ID: `COV-02`
- Domain: `D05`
- Specialist room: `04｜波動與市場微結構研究室`
- Return artifact path: `research/COV_02_CLOSING_AUCTION_SPECIALIST_RETURN_20261004_V0_1.md`
- Evidence cutoff: `2026-10-04T07:45:00+08:00`
- Specialist room checkpoint / source artifacts:
  - `MICROSTRUCTURE_RESEARCH.md`
  - `MICROSTRUCTURE_CHECKPOINT.md`
  - TWSE Trading Mechanism / investor Q&A
  - TWSE Operating Rules Article 58-3
- Current candidate class: `SCOPE_EXTENSION_CANDIDATE`
- Proposed terminal recommendation: `EXTEND_EXISTING_SCOPE`

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


## Mandatory Source Table

| Source | Authority | Granularity | History | first-known semantics | Replay status | Limitation |
|---|---|---|---|---|---|---|
| TWSE Operating Rules Article 58-3 | Taiwan Stock Exchange | auction price-formation rule | versioned rule text | rule version/effective date | RULE_REPLAYABLE | rule does not itself provide historical indicative imbalance snapshots |
| TWSE Trading Mechanism / investor Q&A | Taiwan Stock Exchange | opening/closing auction mechanism and 13:25–13:30 trial state | current official mechanism | observable trial state only when actually captured | PROSPECTIVE_SOURCE_FEASIBLE | current page cannot reconstruct historical first-known trial snapshots |
| TWSE final daily close/volume source | Taiwan Stock Exchange | symbol-session final close/volume | historical daily | after final official session close | FINAL_OUTCOME_REPLAYABLE | final close/volume cannot reconstruct the pre-close imbalance path |
| Current real-time market-data trial/best-quote state | exchange/provider market-data contract | intraday symbol quote/book | prospective | provider/source timestamp and capturedAt | PROSPECTIVE_PARTIAL | complete historical pre-close archive not proven |
| MICROSTRUCTURE_RESEARCH / CHECKPOINT | room04 research corpus | semantic/mechanism contract | research-versioned | Git commit / checkpoint time | RESEARCH_REPLAYABLE | not a market-data substitute |

Access:
- official TWSE rule/mechanism surfaces are public/free;
- prospective provider access is subject to the existing market-data contract;
- no paid source is required for the structural recommendation itself.

Missingness:
- missing historical pre-close trial/imbalance state = `UNKNOWN`;
- never impute from final close, final auction volume, or generic end-of-day volume.

## Mandatory Overlap Table

| Existing module | Shared observable | Distinct observable | Shared source | Double-count risk | Owner boundary |
|---|---|---|---|---|---|
| D05-06 Opening Auction | call-auction rules, trial/indicative state | overnight information set vs end-of-day information set | TWSE auction mechanism | HIGH if separate modules each count auction state | D05-06 owns opening + closing auction primitive |
| D05-03/04/05 spread/depth/OFI | bid/ask/depth/pressure | call-auction mechanism and trial state | market quote/book | MEDIUM | continuous-session primitives remain their own owners; D05-06 owns auction regime |
| D05-14 Market Integrity | unusual closing behavior | integrity interpretation / false-positive controls | auction primitive can be shared | HIGH | D05-14 consumes D05-06 primitive; no second auction vote |
| D14 execution-quality modules | fill/cost around close | execution consequence, not auction mechanism | market/order data | MEDIUM | D14 consumes mechanism state; does not own exchange rule |
| D11/D17 event clocks | event/news timing | cause/context of order-flow change | event sources differ | LOW/MEDIUM | event rooms own event clocks, not auction formation |
| D02 end-of-day volume | aggregate volume spike | pre-close trial/imbalance path | daily/intraday volume | HIGH | D02 volume cannot be relabeled as closing imbalance without residual evidence |

## Mandatory Counterevidence Table

| Claim | Countermechanism | Falsification test | Current status |
|---|---|---|---|
| closing imbalance is a new standalone alpha family | same call-auction mechanism as D05-06 opening owner | compare unique data/decision contract after stripping shared auction rules | NOT SUPPORTED; scope extension preferred |
| final close/volume reconstructs pre-close imbalance | many different order paths can generate same final close/volume | require timestamped pre-close trial/book observations | FALSIFIED; historical missing state remains UNKNOWN |
| EOD volume spike equals closing-auction demand | continuous-session late volume/news/passive flow can create same spike | separate 13:25–13:30 auction primitive from prior continuous volume | FALSIFIED AS IDENTITY |
| closing auction behavior is inherently manipulative | index/ETF rebalance, benchmark execution, hedging and genuine demand are legitimate | control event/passive-flow calendar and D05-14 false-positive states | NOT IDENTIFIABLE FROM AUCTION STATE ALONE |
| closing auction needs a new module | D05-06 can preserve shared auction mechanics plus distinct substates | anti-orphan review of closing-specific execution/benchmark capabilities | CURRENT EVIDENCE SUPPORTS EXTEND_EXISTING_SCOPE |

## Intake-state boundary

This specialist room does **not** set `RETURN_ACCEPTED_FOR_INTAKE`.

Current legal state:
`SPECIALIST_RETURN_CONTRACT_COMPLETE / READY_FOR_00_INTAKE`.

Only 00｜研究總控室 may validate the return against the intake gates and transition the COV state machine.
Structural adoption still requires Dependency Audit → overlap recheck → anti-orphan → owner approval → atomic canonical update.
