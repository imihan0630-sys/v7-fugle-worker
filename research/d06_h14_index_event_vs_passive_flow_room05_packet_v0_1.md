# H14 Room-05 Specialist Packet — D06-11 Passive Flow vs D11-14 Index Adjustment Event

Updated: 2026-10-03 Asia/Taipei
Owner room: 05｜法人與籌碼研究室
Status: ROOM05_EVIDENCE_PACKET_COMPLETE / COUNTERPART_REQUIRED / FORMAL_CORE_LOCKED

## Terminal recommendation from Room 05
`KEEP_SEPARATE / PRODUCER_CONSUMER_EVENT_FLOW_BOUNDARY / SINGLE_EVENT_RECEIPT`

## Frozen ownership
### D11-14 owns event identity
- index-provider review/event identity;
- announcement/publication time;
- effective date / effective close;
- added/deleted/weight-change event lifecycle;
- event revision and event-universe completeness.

### D06-11 owns realized passive/index fund flow
- observed ETF/index-fund fund-size flow when PIT-valid;
- tracker exposure and rebalancing stock/flow context;
- realized/measured flow state around known events;
- passive-flow contamination state for interpreting institutional/price-volume observations.

### D06-16 owns ETF mechanics
- creation/redemption mechanism;
- AP participation mechanics;
- PCF basket, premium-discount, tracking and underlying-liquidity transmission;
- mechanism/friction transformation, not a second directional flow vote.

## Event expectation vs realized flow
An announced benchmark change creates expected mechanical demand/supply, but expected flow is not realized flow.

Likewise realized ETF fund-size change can occur with no new benchmark event because investor subscriptions/redemptions change fund size under an unchanged benchmark.

Therefore:
`INDEX_EVENT != REALIZED_PASSIVE_FLOW != ETF_MECHANICS`.

## Divergent-state examples required by H14
### A. Event known / realized flow weak or UNKNOWN
An index provider announces an addition/deletion, but tracker units/AUM/PCF first-known coverage is missing or fund-size changes are small. D11-14 event state is known; D06-11 realized-flow state remains weak/UNKNOWN. The event cannot manufacture a second observed-flow vote.

### B. Realized passive fund-size flow / no new index event
A domestic equity ETF experiences net creation/redemption while its benchmark membership and weights are unchanged. D06-11 can observe fund-size flow; D11-14 has no new event. This is a valid divergent state.

### C. Same event, different realized flow
Two benchmark events with similar target-weight changes can produce different realized pressure because tracker AUM/units, cash substitution, AP inventory, liquidity and implementation timing differ. D11-14 event magnitude and D06-11 realized/measured flow therefore cannot be assumed identical.

## Receipt lineage
One canonical index-event receipt:
- provider/index family/universe;
- event identity/version;
- announcement/publication firstKnownAt;
- effectiveAt/effectiveClose;
- member/weight changes;
- completeness state.

Downstream D06-11 flow receipt references eventReceiptId and separately preserves:
- fund/tracker identity;
- units delta / fund-size flow state;
- PCF/use-date where relevant;
- tracker exposure;
- capturedAt/firstKnownAt;
- source/vintage/coverage;
- operational/corporate-action adjustments;
- actual-vs-modeled distinction.

D06-16 mechanics references the same receipts and does not clone them.

## Anti-double-count rules
1. Known event direction/magnitude is counted once under D11-14.
2. D06-11 may become incremental only from realized/measured flow information beyond the event expectation.
3. If D06-11 flow is entirely imputed from the event itself, it is not an independent vote.
4. D06-16 mechanism state may alter confidence/friction/liquidity interpretation but cannot re-count the same units delta as another directional signal.
5. Missing passive-flow evidence remains UNKNOWN, never 'no flow'.

## Current Taiwan evidence boundary
PF-035/036 provide bounded MSCI Global Standard Taiwan membership add/delete event semantics, but not broad no-passive-flow evidence.
PF-037~039 provide prospective ETF units/PCF flow mechanics, but exact actual constituent execution remains unobserved.
Thus the event and flow lanes are demonstrably different but still data-gated for outcome alpha.

## Maturity implication
D06-11 remains L2 / 40%. H14 scope de-dup improves governance but does not add OOS/prospective outcome evidence.
D11-14 maturity remains owned by Room 08; no cross-room maturity inheritance.

## Required counterpart
Room 08 should confirm D11-14 event receipt ownership and event-lifecycle schema, then total control can validate the producer-consumer interface and shared receipt.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core unchanged.
