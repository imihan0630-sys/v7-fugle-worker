# D02 latent volume-mechanism identifiability addendum — 2026-10-02

Status: RESEARCH_ONLY / OUTCOME_BLIND / FORMAL_UNCHANGED
Main read before write: `8101ea81b3fc8abe2c3514628ac52e5b7e311cf6`
Scope: D02-05 爆量／高潮量／分配量; D02-08 吸籌／出貨代理變數; D02-09 價量背離
PVE cursor impact: NONE. PVE-228 remains reserved for the genuine 2026-10-02 after-market generation audit.

## 1. Central falsification: OHLCV cannot identify a unique hidden trading mechanism

A bar or short sequence with high volume and weak price progress is observationally compatible with multiple latent mechanisms:
- aggressive buying absorbed by replenishing passive sell liquidity;
- aggressive selling absorbed by replenishing passive buy liquidity;
- two-sided disagreement/high turnover;
- event/rebalance flow;
- liquidity thinning followed by rapid replenishment;
- exhaustion after one side has already paid through available liquidity.

These mechanisms can generate the same or near-identical OHLCV path.

Therefore:
`HIGH_EFFORT_LOW_PROGRESS` is a result-state descriptor.
It is not, by itself, evidence of accumulation, distribution or absorption direction.

## 2. Deterministic OHLCV indicators cannot solve information that OHLCV does not contain

OBV, A/D, CMF, MFI, Volume Oscillator and similar indicators are deterministic transformations of price and volume inputs.

If two underlying order-flow paths map to the same OHLCV sequence, any deterministic OHLCV-only indicator also maps them to the same indicator sequence.

Consequences:
- an OBV/CMF/MFI divergence may be a useful descriptive comparator;
- it cannot independently prove hidden buying/selling motive;
- stacking several OHLCV-derived indicators does not create independent mechanism evidence;
- D02-08 narrative labels need an additional data family, not more OHLCV transforms.

## 3. Current production research recorder capability

Current execution-shadow-v2 persists useful coarse state:
- previousClose/openPrice;
- provider avgPrice proxy;
- best bid/ask;
- spreadPct;
- top-five bidDepth5/askDepth5;
- static depthImbalance;
- market-state flags.

It does NOT currently preserve:
- cumulative tradeVolumeAtBid;
- cumulative tradeVolumeAtAsk;
- cumulative transaction count;
- actual lastTrade object/time/serial;
- full dynamic book update sequence;
- additions/cancellations/replenishment;
- true event-level OFI.

The previously designed execution-shadow-v3 remains proposal/design only on current main.

## 4. Official Fugle source capability is richer than the current recorder

Public Fugle stock APIs document:
- Intraday Quote: cumulative tradeVolume, tradeVolumeAtBid, tradeVolumeAtAsk, transaction count, lastTrade, top-five bids/asks;
- Intraday Trades: per-trade bid, ask, price, size, time, serial;
- Intraday Volumes: price-level cumulative volumeAtBid and volumeAtAsk;
- WebSocket books/trades: prospective best-five and trade events.

This proves source-level feasibility for stronger prospective research, but not current recorder availability.

## 5. Inside/outside volume has explicit unclassified-volume semantics

Fugle documents that opening first-trade volume is removed from inside/outside-volume calculation because opening call auction may not represent supply/demand in the same way.

Therefore a future pressure proxy must preserve:
`classifiedVolumeCoverage = (deltaAtBid + deltaAtAsk) / deltaTradeVolume`

Rules:
- use interval deltas, never raw cumulative totals as independent observations;
- require monotonic same-session counters;
- if deltaTradeVolume <= 0 or counters reset, pressure state = UNKNOWN;
- if classifiedVolumeCoverage is materially below 1, pressure sign/strength is guarded;
- opening auction is a separate regime and must not be normalized as ordinary continuous trading.

## 6. Minimum future coarse pressure proxy

If execution-shadow-v3 is ever implemented, a coarse provider-pressure descriptor can be:

`pressureProxy = (deltaAtAsk - deltaAtBid) / (deltaAtAsk + deltaAtBid)`

Interpretation:
- positive: more provider-classified outside/ask-side volume in the interval;
- negative: more provider-classified inside/bid-side volume;
- zero-ish: balanced classified flow.

Naming restriction:
this is `tradePressureProxy`, not true OFI and not ground-truth aggressor side.

It cannot by itself identify passive-side replenishment.

## 7. Identifiability ladder

Stage A — OHLCV only
Can identify:
- participation intensity;
- price response/efficiency;
- persistence;
- acceptance/rejection geometry.
Cannot identify:
- aggressor side;
- replenishment;
- absorption direction.

Stage B — cumulative AtBid/AtAsk + transaction totals
Adds:
- coarse interval trade-pressure proxy;
- classified-volume coverage;
- transaction intensity / average classified trade-size style diagnostics.
Still cannot identify:
- queue replenishment;
- cancellation;
- true event-level OFI.

Stage C — sparse top-five book snapshots
Adds:
- spread/depth/static imbalance context.
Still cannot identify:
- between-snapshot replenishment/resiliency;
- event ordering.

Stage D — dense prospective trades + book events
Potentially supports:
- explicit trade classification;
- event-level imbalance;
- replenishment/resiliency;
- side-specific absorption candidate studies.
Requires separate microstructure governance, cadence, storage and coverage proof.

## 8. D02 module consequences

### D02-05 爆量／高潮量／分配量
RVOL extremity can establish abnormal participation.
It cannot establish distribution direction.
A future climax study must condition on price response, location, persistence, event/auction state and, if claiming directional mechanism, pressure data.

### D02-08 吸籌／出貨代理變數
Current OHLCV/PV fields cannot identify accumulation/distribution as a latent mechanism.
Keep narrative labels unresolved.
Use measurable descriptors instead:
- HIGH_EFFORT_LOW_PROGRESS;
- EFFICIENT_UP/DOWN;
- persistence;
- acceptance/rejection;
- future pressureProxy only when captured prospectively.

### D02-09 價量背離
A divergence based on OBV/CMF/MFI is a transformed price-volume relationship, not independent evidence of hidden smart-money behavior.
Primary research should compare observable primitive divergence:
- price progress vs same-slot/cumulative participation;
- price progress vs future pressureProxy;
- price progress vs persistence/acceptance.
Classic-indicator divergence remains comparator-only unless it adds value beyond those primitives.

## 9. Maturity decision

No module promotion this turn.

Reason:
- source-level feasibility exists;
- current production recorder still lacks the prospective side-pressure/event path needed to resolve the latent mechanism;
- actual prospective coverage, same-slot normalization, source resets, auction/VI guards and incremental outcome value are not yet validated.

D02-05, D02-08 and D02-09 therefore remain L2 / 40%.

## 10. Next evidence hinge

Do not implement recorder v3 from this room during the current production-lineage instability.

First:
1. inspect the genuine 2026-10-02 23:35/23:55 ordinary scan and 2026-10-03 00:10 collector under PVE-228;
2. preserve Gate 7 closed;
3. once core PV cohort provenance stabilizes, reuse the Microstructure lane for any pressure/replenishment capture proposal;
4. do not create a separate D02 order-flow collector that duplicates Microstructure ownership.

Formal Core remains LOCKED.
