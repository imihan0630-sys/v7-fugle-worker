# SC-065 — D10/D17 Shared Exposure Primitive and No-Double-Vote Contract V0.1

Status: RESEARCH_ONLY / PRODUCER_CONSUMER_RECEIPT_FROZEN / SDA010_RESEARCH_SIDE_DEEPENED / OWNER_GATES_PRESERVED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domains: D10 producer, D17 consumer boundary
Audit linkage: SDA-010
Date: 2026-10-07 Asia/Taipei
Parents:
- research/SC064_D10_01_VERSIONED_GRAPH_TIMING_AND_SDA010_HANDOFF_20261007_V0_1.md
- research/sc064_d10_01_versioned_graph_timing_contract_v0_1.json
Observed main before write: `0dea61b453af81198bc2023605682ab57caabf02`

## Purpose

Freeze the research-side handoff shape required to prevent one structural exposure fact from becoming two independent votes when both D10 and D17 consume it.

The core object is one immutable structural primitive produced by D10 and referenced by D17.

D17 may add genuinely event-specific evidence, but it cannot recreate the D10 structural exposure as a new independent root.

This is research-only. H10 and COV-06 protected owner decisions remain unchanged.

## Shared primitive

```json
{
  "primitiveId": "D10_EXPOSURE:<issuer>:<scope>:<edgeId>:<graphVersion>",
  "primitiveType": "STRUCTURAL_EXPOSURE",
  "producerDomain": "D10",
  "exposureGraphId": "<graph id>",
  "graphVersion": "<version>",
  "edgeId": "<stable edge id>",
  "knownAt": "<source known clock>",
  "effectiveFrom": "<economic activation clock>",
  "effectiveTo": "<expiry or null>",
  "relationState": "SCHEDULED|ACTIVE|EXPIRED|CANCELLED|UNKNOWN",
  "qualificationState": "<state>",
  "capacityState": "<state>",
  "commonModeState": "<state>",
  "sourceReceiptId": "<lineage>",
  "dedupRootId": "<stable structural root>"
}
```

The same `primitiveId` may be referenced by many consumers.

Consumer multiplicity does not increase evidence-root count.

## D17 consumer reference

```json
{
  "eventAttributionId": "D17_EVENT:<event id>",
  "consumerDomain": "D17",
  "eventKnownAt": "<clock>",
  "structuralPrimitiveRefs": [
    "<D10 primitiveId>"
  ],
  "structuralRootVoteAuthority": "REFERENCE_ONLY",
  "eventSpecificEvidence": {
    "severity": "<independent event fact or UNKNOWN>",
    "duration": "<independent event fact or UNKNOWN>",
    "realizedPropagation": "<independent event fact or UNKNOWN>"
  }
}
```

The structural exposure portion has `REFERENCE_ONLY` authority in D17.

This means:
- D10 may own the structural exposure root;
- D17 may condition event attribution on that root;
- the same edge cannot contribute a second independent structural vote merely because an event occurred.

## Vote accounting

For one structural root:

```
numberOfConsumers >= 1
uniqueStructuralVoteRoots = 1
```

Permanent rule:

`ONE_STRUCTURAL_PRIMITIVE_MANY_CONSUMERS != MANY_INDEPENDENT_VOTES`.

A D17 event feature can be independent only if its evidence root is actually event-specific, e.g.:
- independently observed outage duration;
- independently observed production stoppage;
- independently observed shipment delay;
- independently observed recovery timing.

It cannot become independent merely by renaming:
- supplier exposure;
- customer exposure;
- product exposure;
- geographic exposure;
- alternate-source state.

## Counterexample A — known but not yet active edge

Historical semantic calibration:
ASPEED disclosed a two-year ASE capacity procurement contract with an effective start of 2027-01-01.

Hypothetical test event:
- eventKnownAt = 2026-12-15;
- contract edge was already publicly known;
- effectiveFrom = 2027-01-01.

Correct graph state:
`SCHEDULED_NOT_ACTIVE`.

Therefore the event consumer must NOT treat the ASE contract as an active alternate capacity path on 2026-12-15.

This proves:
`KNOWN_AT <= EVENT_CLOCK` alone is insufficient.

Both must hold:
- `knownAt <= eventKnownAt`;
- `effectiveFrom <= eventKnownAt < effectiveTo` when effectiveTo exists.

## Counterexample B — event reveals a previously unknown edge

Hypothetical test:
- pre-event graph contains no supplier X edge;
- event disclosure at T1 reveals issuer dependence on supplier X;
- source is credible and the relation becomes known at T1.

Correct handling:
1. D17 records the event evidence at T1.
2. D10 may append a new graph version with `knownAt=T1`.
3. The new edge may be used for decisions at or after T1, subject to effective-state rules.
4. The edge cannot be inserted into graph versions used for decisions before T1.

Prohibited:
using the event-revealed relationship to explain why a pre-T1 model "should have known" the exposure.

Permanent rule:
`EVENT_REVEALED_EDGE_CANNOT_EXPLAIN_PRE_EVENT_DECISION`.

## Counterexample C — multiple consumers

Suppose:
- D10-01 consumes the supplier relation;
- D10-12 consumes the same issuer exposure mapping;
- D17 consumes it for event attribution;
- a portfolio layer later consumes event attribution.

Correct evidence-root accounting:
- structural root count remains one;
- downstream references preserve `dedupRootId`;
- only genuinely distinct evidence roots can add independent contribution.

Consumer count is not evidence count.

## Missing-data behavior

If procurement share, spare capacity, switching lead time or common-mode dependency is not disclosed:
- remain UNKNOWN;
- D17 cannot fill the value from event magnitude;
- price reaction cannot be used to infer structural exposure;
- realized disruption severity cannot reverse-engineer capacity share.

This blocks another event-to-structure hindsight channel.

## SDA-010 research-side status

Now frozen on Room07 side:
- effective-dated relation semantics;
- knownAt vs effectiveFrom;
- append-only graph versions;
- pre-event graph selection;
- shared D10 structural primitive;
- D17 reference-only structural consumption;
- no event-driven historical backfill;
- no consumer-count-as-vote-count;
- UNKNOWN propagation.

Still not closed:
- H10 owner approval pending;
- COV-06 owner approval pending;
- canonical exposureGraphId implementation pending;
- System1/System2 shared receipt enforcement pending;
- genuine prospective divergent substitution/alternate-path evidence pending;
- D16 validation pending;
- Room00 independent closure pending.

SDA-010 therefore remains BLOCKED_DEPENDENCY.

## D10 maturity

D10-01 remains L2 / 40%.

The research semantics are now implementation-ready as a candidate contract, but L3 still requires the post-freeze genuine topology receipt defined in SC-062.

## Exact next

SC-066:
produce a source-trigger/admission matrix for the first genuine post-freeze topology mutation so the next disclosure can be admitted or rejected deterministically without redesign.

After SC-066, do not add further schema layers unless a real new receipt exposes a missing field. Shift effort to other open L2 lanes while the prospective gate waits.

Formal Core unchanged.
