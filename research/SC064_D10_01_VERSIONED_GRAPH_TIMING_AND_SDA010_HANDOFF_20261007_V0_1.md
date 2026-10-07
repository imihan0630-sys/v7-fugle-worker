# SC-064 — D10-01 Versioned Graph Timing and SDA-010 Handoff V0.1

Status: RESEARCH_ONLY / VERSIONED_GRAPH_RESEARCH_CONTRACT / SDA010_BOUNDARY_DEEPENED / OWNER_GATES_PRESERVED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-01
Audit linkage: SDA-010
Date: 2026-10-07 Asia/Taipei
Parents:
- research/SC062_D10_01_PROSPECTIVE_TOPOLOGY_RECEIPT_CONTRACT_20261007_V0_1.md
- research/SC063_FIRST_POST_FREEZE_PROSPECTIVE_NULL_OBSERVATION_20261007_V0_1.md

## Purpose

Close a research ambiguity that can create exposure-graph hindsight:

when a relationship is announced at time T0 but becomes operational at T1, the graph must preserve both clocks.

The announcement may be known before the relationship is active.
The relationship may later expire or be cancelled.
Event attribution must consume the correct graph version instead of reconstructing topology after the event.

This is research-only and does NOT approve the protected H10/COV-06 canonical owner gates.

## Source-class observability matrix

### 1. Timestamped material announcement
Best at:
- source-reported announcement clock;
- counterparty identity;
- contract/event identity;
- contract start/end dates when disclosed;
- explicit reason/purpose.

Often weak or absent:
- exact procurement share;
- spare capacity;
- qualification details;
- tier-2/tier-3 topology;
- common-mode dependencies.

### 2. Issuer annual report
Best at:
- named supplier sets where disclosed;
- procurement concentration;
- qualification/procurement strategy;
- period-level topology.

Weakness:
- usually retrospective/coarser timing;
- cannot be backfilled into earlier decisions simply because it describes an earlier business relationship.

### 3. Sustainability / business-continuity report
Best at:
- geographic concentration;
- utility/common-mode risk;
- supplier audit/qualification processes;
- alternate-resource planning.

Weakness:
- supplier/path identities and economic weights are often incomplete.

### 4. Issuer press release / investor presentation
Best at:
- event-specific facts;
- facility/location/capacity milestones;
- planned supplier/customer relationships when named.

Weakness:
- disclosure field set is non-standard;
- forward-looking plan must not be treated as realized state.

Conclusion:
no single public source class reliably supplies all topology primitives.
Safe graph fusion therefore requires clocked, source-specific fields rather than a narrative merge.

## Historical calibration — scheduled relation is not active relation

A pre-freeze historical calibration is the 2026-09-14 ASPEED supplier-capacity contract disclosure.

Reported facts:
- issuer: ASPEED Technology Inc. / 5274;
- counterparty: Advanced Semiconductor Engineering, Inc.;
- purpose: stable capacity supply;
- contract period: 2027-01-01 through 2028-12-31;
- announcement/source-reported time visible in public MOPS mirrors: 2026-09-14 17:36:01 Asia/Taipei.

Because this was not captured prospectively by SC-062, the exact historical public-availability second remains `REPORTED_NOT_PROSPECTIVELY_VERIFIED`.

The calibration nevertheless proves the semantic distinction:

```json
{
  "relationship": "ASPEED_TO_ASE_CAPACITY_PROCUREMENT",
  "knownAtReported": "2026-09-14T17:36:01+08:00",
  "knownAtCertainty": "REPORTED_NOT_PROSPECTIVELY_VERIFIED",
  "effectiveFrom": "2027-01-01T00:00:00+08:00",
  "effectiveTo": "2028-12-31T23:59:59+08:00",
  "stateAfterKnownAtBeforeEffectiveFrom": "SCHEDULED_NOT_ACTIVE",
  "stateDuringEffectiveIntervalIfNotCancelled": "ACTIVE_DISCLOSED_CONTRACT",
  "procurementShare": "UNKNOWN",
  "spareCapacity": "UNKNOWN",
  "qualificationScope": "UNKNOWN"
}
```

Permanent rule:
`KNOWN_RELATION != ACTIVE_RELATION`.

## Versioned graph research schema

Every graph mutation must append a new version:

```json
{
  "exposureGraphId": "D10_GRAPH:<issuer>:<scope>",
  "graphVersion": "<monotone version>",
  "parentGraphVersion": "<prior version or null>",
  "generatedAt": "<research receipt time>",
  "decisionClock": "<as-of time>",
  "mutation": {
    "operation": "ADD_SCHEDULED_EDGE|ACTIVATE_EDGE|AMEND_EDGE|EXPIRE_EDGE|CANCEL_EDGE|NO_CHANGE",
    "edgeId": "<stable relation id>",
    "knownAt": "<when evidence became known>",
    "effectiveFrom": "<when relation becomes economically valid>",
    "effectiveTo": "<expiry if known>",
    "sourceReceiptId": "<single authoritative primitive>"
  }
}
```

Historical versions are immutable.

A later disclosure can append:
- correction;
- cancellation;
- newly discovered identity;
- actual activation evidence.

It cannot rewrite what was knowable at a prior decision clock.

## Pre-event graph firewall

For an event at `eventKnownAt`:

1. select the latest graph version whose `decisionClock <= eventKnownAt`;
2. include only edges economically active at the event clock;
3. scheduled future edges remain non-active;
4. expired/cancelled edges remain non-active;
5. missing edge weights/capacity remain UNKNOWN;
6. D17 consumes the selected graph receipt;
7. D17 must not create a second structural exposure primitive from the same event narrative.

Frozen rule:
`EVENT_ATTRIBUTION_CONSUMES_PRE_EVENT_GRAPH; EVENT_DOES_NOT_BACKFILL_PRE_EVENT_GRAPH`.

## Structural/event deduplication

D10 owns:
- structural issuer/product/supplier relation;
- qualification/substitution state;
- exposure/capacity state;
- common-mode topology;
- graph version/effective dates.

D17 may own:
- event occurrence;
- event severity;
- propagation path actually realized;
- duration/recovery;
- event-specific attribution conditional on the D10 graph.

If the event reveals a previously unknown supplier relation:
- D17 may record the event evidence;
- D10 may append a new graph version with `knownAt = event disclosure time`;
- that relation cannot be used to explain decisions before that knownAt.

This removes the most direct hindsight loop.

## SDA-010 effect

Research-side boundary is strengthened:
- effective-dated graph semantics: frozen;
- knownAt vs effectiveFrom: frozen;
- append-only versioning: frozen;
- pre-event graph selection: frozen;
- D10 producer / D17 consumer reuse: frozen;
- event-driven historical backfill: prohibited.

Still pending and explicitly NOT claimed:
- H10 owner approval;
- COV-06 owner approval;
- canonical machine implementation;
- System1/System2 shared receipt enforcement;
- genuinely prospective divergent substitution/alternate-path evidence;
- D16 validation;
- 00 closure.

Therefore SDA-010 remains BLOCKED_DEPENDENCY.

## D10-01 maturity

Keep L2 / 40%.

Research semantics are materially deeper, but the promotion contract requires a genuine post-freeze topology update and replayable source clocks.

## Exact next

SC-065:
freeze a research-only producer receipt / consumer reference object that can later be implemented after owner approval.

Required proof:
- one structural primitive id;
- one graph version;
- one event consumer reference;
- zero duplicated independent vote;
- counterexample showing a newly revealed edge cannot be used before knownAt.

Formal Core unchanged.
