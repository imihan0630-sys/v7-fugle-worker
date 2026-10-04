# D03 Pre-Parent Continuity Source-Cut Handoff V0.1

Updated: 2026-10-04 Asia/Taipei
Lane: D03-09 / D03-10 -> shared TECHNICAL_CONTINUITY owner
Status: OUTCOME_BLIND / OWNER_HANDOFF_READY / NO_RUNTIME_SCHEDULE_ADDED
Formal Core: LOCKED

## Purpose

Continue from TI-650 without duplicating the shared source observer.

The remaining blocker is not indicator mathematics. It is a cutoff-safe shared source cut that can be consumed by the first genuine V8.17 immutable parent.

This tranche freezes what D03 needs from the owner and tests the causal acceptance logic. It does not implement a System2/Production polling schedule.

## TI-651 — parent eligibility needs first-observed availability, not latency precision

The owner MOPSOV adapter distinguishes:
- firstObservedAvailableAt / firstObservedAt;
- precisionEligible (prior NOT_OBSERVED <=5 minutes);
- publicAvailabilityLatencyCertified.

For D03 parent causality, the necessary positive condition is:
`exact version firstObservedAt <= parentKnownAt`.

A prior <=5-minute NOT_OBSERVED is useful for latency estimation, but is not required merely to prove that a version was already observable by the parent cutoff.

Therefore high-frequency MOPS polling is not intrinsically required for Bollinger/ADX L3 parent eligibility.

This does not authorize a schedule. It narrows the owner requirement.

## TI-652 — selected-only pre-parent querying is structurally invalid

The immutable C1 parent population does not exist until the normal scan.

A source observer that waits for selected/parent symbols and then queries them cannot prove pre-parent availability without backdating.

Therefore the owner source cut must be:
- market-wide/exchange-wide; or
- full eligible-universe scoped before the parent.

Selected-only source capture is rejected.

## TI-653 — existing market-wide official lanes can form the base cut

Existing physical source work already provides:
- six range-verified TWSE/TPEx actual corporate-action result lanes;
- TWSE daily material-information OpenAPI;
- TPEx daily material-information OpenAPI;
- direct official MOPSOV historical/version transport.

Official public APIs currently identify TWSE `/opendata/t187ap04_L` as 上市公司每日重大訊息. The TPEx `mopsfin_t187ap04_O` endpoint is already physically used by the D17 source-only pilot.

The daily disclosure feeds are current snapshots, not historical complete version archives. They can participate in a prospective source cut only with immutable capture hashes/times and append-only version handling.

## TI-654 — event-driven source cardinality is bounded enough for owner engineering, not yet a schedule

Physical read-only run `37190871367` over 2026-08-15..2026-10-02:
- six official actual-result lanes PASS;
- total corporate-action event rows = 294;
- unique event keys = 294;
- event-bearing dates = 31;
- mean events per event-bearing date ~= 9.48;
- busiest effective date = 33 events/symbols;
- TWSE ex-right/dividend = 149;
- TPEx ex-right/dividend = 129;
- capital reduction = 7 + 7;
- par-value change = 1 + 1.

This shows an event-driven exact-version lookup design is materially smaller than querying the full market universe by symbol.

It does not prove a production call budget. No request may be silently dropped if a budget is exceeded.

## TI-655 — frozen source-cut acceptance

A future shared-owner source cut is parent-eligible only if:
- scanDate matches the parent;
- scope is market-wide/full eligible universe, never selected-only;
- all required market-wide lanes succeed with payload hashes;
- range lanes verify the requested range;
- parser completeness is true;
- cut completedAt <= actual parent knownAt;
- every required MOPS exact-version key is prospectively observed;
- every firstObservedAt <= parent knownAt;
- expected/observed version keysets reconcile exactly;
- no query truncation;
- no budget truncation;
- no UNKNOWN required lane;
- noRevisionGapThroughCut is owner-certified.

Historical sourceReportedAt alone cannot fill a missing prospective observation.

## TI-656 — precisionEligible is deliberately decoupled

Deterministic acceptance proves:
- firstObservedAt before parent with precisionEligible=false can be parent-eligible;
- late firstObservedAt is blocked;
- retrospective readback is blocked.

This preserves the distinction between availability-by-cutoff evidence and publication-latency measurement.

D03 does not require the second to establish the first.

## TI-657 — receipt computation time is not silently redefined

The current Bollinger/ADX v0.2 contracts require an owner continuity receipt with capturedAt <= parent knownAt.

This tranche does not weaken or reinterpret that field.

If the owner wants to compute a symbol-specific continuity transform after the parent using only pre-parent immutable source inputs, that requires a separately versioned owner contract distinguishing evidenceCutoffAt from receiptCreatedAt.

Until such a contract exists, D03 continues to require the current v0.2 owner receipt semantics.

## TI-658 — noRevisionGapThroughCut remains the hardest owner claim

A single successful pre-parent snapshot proves what was observed then.

It does not by itself prove:
- no relevant version was omitted;
- no hidden pagination/truncation;
- no version became public before parent but propagated to the collector later.

Therefore owner certification of `noRevisionGapThroughCut=true` still requires:
- complete source population semantics;
- append-only exact version identity;
- prospective observation policy;
- reconciliation/falsification of late-discovered pre-parent versions.

D03 does not self-certify this flag.

## TI-659 — two practical owner architectures remain valid candidates

Candidate A — pre-parent market-wide source cut:
- dedicated shared-owner research capture before normal parent;
- actual observedAt controls eligibility;
- late scheduler => fail closed for that date;
- no Formal dependency.

Candidate B — versioned evidence-cutoff/receipt-created split:
- freeze market-wide source facts before parent;
- later transform only from those immutable facts;
- requires a new owner contract and D03 v0.3 review before use.

D03 does not choose or deploy either architecture here.

## TI-660 — maturity decision

This tranche closes:
- the false belief that <=5-minute high-frequency polling is mandatory for parent eligibility;
- the selected-only pre-parent-query loophole;
- uncertainty about rough event-driven source cardinality;
- the exact owner source-cut acceptance boundary.

It does not create a genuine cutoff-safe source receipt.

Therefore:
- D03-10 Bollinger remains L2/40;
- D03-09 ADX remains L2/40;
- D03 remains **56.7%**.

Next honest transition remains Bollinger L3 -> 58.3%, then ADX L3 -> 60.0%.

## Exact next continuation

Shared continuity owner must implement/execute one versioned pre-parent architecture and physically return:
1. cutoff-safe market-wide/full-universe source cut;
2. exact prospective MOPS version observations;
3. noRevisionGapThroughCut certification under owner rules;
4. symbol-session completeness;
5. symbol continuity receipts for the genuine C1 parent keyset.

D03 then:
- runs the already-physical parent binding;
- executes Bollinger v0.2 for every expected parent;
- requires COMPLETE reconciliation;
- only then considers 58.3%.

ADX remains after canonical FULL_REPLAY.

Raw D03 3-session gate remains independently 2/3.
TI-005/TI-006 outcomes remain closed.
