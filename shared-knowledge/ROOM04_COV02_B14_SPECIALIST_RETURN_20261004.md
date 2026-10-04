# Room04 Specialist Return — COV-02 + Priority-B B14 — 2026-10-04

Room: 04｜波動與市場微結構研究室
Formal Core: LOCKED
Maturity effect from this return: NONE
Module-count effect: NONE

## COV-02 — Closing Auction / Auction Imbalance

### 1. Exact knowledge definition
Closing auction = TWSE final call-auction price formation at the end of the regular session, distinct from normal continuous matching.

Observable families:
- final call-auction price;
- closing-auction executed volume;
- pre-close trial/indicative quote state where exposed;
- closing reference / final price displacement;
- mechanism-state transition from continuous session to closing call.

"Auction imbalance" must mean an actually observable, timestamped buy-vs-sell imbalance or equivalent indicative excess-demand state. Generic end-of-day volume is NOT auction imbalance.

### 2. Opening vs closing mechanism comparison
Opening and closing are both call-auction price-formation mechanisms, but differ in information set and economic use:
- opening aggregates overnight / pre-open information;
- closing aggregates same-day information and benchmark/end-of-day demand;
- closing interacts strongly with index/ETF rebalance, benchmark execution and end-of-day liquidity.

This difference does not require a separate owner if one auction-microstructure module can retain phase-specific state.

### 3. Taiwan data feasibility
Current evidence supports:
- official TWSE closing call-auction mechanism;
- final close/volume and mechanism timing;
- pre-close trial/indicative information in current-market feeds where available.

Current evidence does NOT establish a complete historical PIT replay of a closing-auction imbalance time series with exact pre-close knownAt.

Therefore historical closing imbalance remains PARTIAL / UNKNOWN when not natively observed.

### 4. PIT / replay contract
Required fields if future capture is enabled:
- marketDate;
- auctionPhase = OPENING / CLOSING;
- provider/exchange timestamp;
- capturedAt;
- trial/indicative price;
- indicative buy/sell size only if actually provided;
- final auction price;
- final auction volume;
- session/mechanism state;
- source receipt / replay hash;
- UNKNOWN if indicative imbalance is not observed.

Do not reconstruct pre-close imbalance from the final bar.

### 5. Owner-gap test
D05-06 already owns auction microstructure.
Closing auction requires phase-specific extension, not a new independent module.

Terminal recommendation:
**EXTEND_EXISTING_SCOPE → D05-06**

Recommended semantic rename:
"Opening / Closing Auction & Auction Imbalance（開收盤集合競價與不平衡）"

This is a scope extension only; no module count change and no maturity promotion from naming.

### 6. Anti-double-count
- D05-06 owns auction mechanism / imbalance primitive.
- D05-14 owns integrity interpretation (marking-close-like candidate, false-positive controls).
- D14 execution modules consume auction state for fill/slippage/benchmark quality.
- D11 event clocks own external event knownAt, not auction mechanics.

One auction primitive may be consumed by multiple modules but must not become multiple independent alpha votes.

### 7. Closing-only orphan audit
No orphan capability found if D05-06 is extended, provided D05-06 explicitly retains:
- opening vs closing phase;
- benchmark/end-of-day-flow context;
- pre-close trial/indicative state when observable;
- final-auction displacement and volume;
- missing imbalance = UNKNOWN.

---

## Priority-B B14 — D05-05 OFI vs D05-12 Adverse Selection / Toxicity

### 1. Semantic ownership
D05-05:
- observable order-flow / book-flow imbalance state;
- price-response and persistence context;
- no informed-intent inference.

D05-12:
- adverse-selection risk conditional on fills/order flow;
- signed post-fill markout;
- toxicity hypothesis only after additional controls;
- informed intent remains unobserved.

### 2. Shared observables
Potentially shared:
- signed trade pressure;
- book imbalance proxy;
- event/message intensity;
- spread;
- depth;
- local volatility;
- session state.

Shared source does NOT imply duplicate module.

### 3. Unique observables / tests for D05-12
D05-12 must add at least one falsifiable construct beyond imbalance:
- signed post-fill markout;
- passive/aggressive fill distinction;
- market/sector drift adjustment;
- spread/volatility/activity matched controls;
- same-OFI / different-markout examples;
- matched no-order or no-fill control where applicable.

If D05-12 uses only D05-05 imbalance and adds a narrative label "toxicity", it fails identifiability and should be narrowed/merged in the future.

### 4. Divergent-state examples
KEEP_SEPARATE is justified by observable divergence:

A. High OFI, low adverse selection:
- persistent buy pressure;
- price progresses upward;
- passive sell fills do not experience adverse post-fill markout after market/sector adjustment.

B. High OFI, high adverse selection:
- same buy-pressure magnitude;
- passive sell fills are followed by persistent adverse upward markout after controls.

C. Low OFI, adverse selection:
- aggregate imbalance is modest;
- a passive fill occurs just before a material information-driven move.

These states show imbalance and adverse-selection outcome are not semantically identical.

### 5. Alternative mechanisms
A high imbalance can arise from:
- liquidity demand;
- mechanical order splitting;
- inventory rebalancing;
- passive flow;
- market/sector shock;
- transient thin-book conditions.

Therefore:
OFI alone cannot identify toxicity or informed trading.

### 6. Replay requirements
D05-05 L3:
- complete prospective event/snapshot capture;
- missing-event/reconnect semantics;
- event-time + wall-clock replay;
- snapshotDeltaPressureProxy label unless true event completeness is proven.

D05-12 L3:
- all of D05-05 source quality where consumed;
- PLUS own fill/order lifecycle or clearly defined execution-conditioned events;
- post-fill markout clock;
- market/sector controls;
- replayable passive/aggressive classification.

### 7. Anti-double-count
- OFI primitive enters D05-12 at most once as an input/control.
- D05-12 cannot add a second independent "toxicity vote" from the same OFI transform.
- Incremental D05-12 evidence must be residual after D05-05 pressure + activity + spread + volatility controls.

Terminal recommendation:
**KEEP_SEPARATE / OBSERVABLE_INPUT_VS_LATENT_MECHANISM**

No merge now.
Future merge/narrowing becomes eligible only if D05-12 cannot demonstrate a distinct observable/falsifiable construct beyond OFI.

---

## Maturity audit for >50% request

Current room aggregate:
- D04 = 42.0% across 10 modules;
- D05 = 44.3% across 14 modules;
- room04 aggregate = 43.3% across 24 modules.

Each L2 -> L3 promotion adds 20 maturity points to one module, equal to ~0.83 percentage points at the room level.

To exceed 50%, at least 9 current L2 modules would need valid L3 promotion in one round.

Current blockers:
- D05: checkpoint explicitly states no L3 until own prospective PIT capture proves coverage/replay/missing-event semantics.
- D04 multi-session stock-volatility modules: official A1 historical endpoints are validated, but corporate-action TECHNICAL_CONTINUITY remains UNVERIFIED; current source contract preserves RAW data and requires UNKNOWN/provenance around contamination.
- D04 market RV: pure builder/PIT gate exists but live decision-clock persistence is still pending.

Conclusion:
**>50% cannot be reached honestly in this round without violating the frozen L3 definition.**

No maturity promotion is taken from COV-02/B14 governance cleanup.

Next legitimate acceleration path:
1. complete corporate-action TECHNICAL_CONTINUITY so multiple D04 daily-volatility modules can qualify for L3;
2. produce first real D04 market-RV prospective persisted dates;
3. owner-authorize and prove D05 prospective Books+Trades capture/replay, then promote spread/depth/session/liquidity modules only after actual coverage evidence.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
