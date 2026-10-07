# SC-058 — TSMC Named Raw-Wafer First-Tier Node-Removal Topology V0.1

Status: RESEARCH_ONLY / FIRST_TIER_NODE_REMOVAL_IDENTIFIABLE / DEEPER_GRAPH_ARTICULATION_UNKNOWN / FORMAL_CORE_UNCHANGED
Date: 2026-10-07 Asia/Taipei
Owner: 07｜產業與供應鏈研究室
Domain: D10-01
Parent: research/SC057_TSMC_QUALIFIED_MULTISOURCE_TOPOLOGY_RECEIPT_20261007_V0_1.md
Observed main before write: `bfce64ed048365cf5028645734a35223b7786366`

## Objective

Test the narrow SC-058 question:

Can an official Taiwan issuer disclosure identify at least two distinct supplier/path identities plus an explicit qualification constraint, such that removing one first-tier supplier node still leaves another source-supported route to the same material class?

This is a structural falsification exercise. No stock outcome is opened.

## Official issuer-native evidence

TSMC 2022 Annual Report, Raw Materials Supply section:
https://investor.tsmc.com/static/annualReports/2022/english/ebook/files/basic-html/page106.html

The page lists six major raw-wafer suppliers:
- FST
- GlobalWafers
- SEH
- Siltronic
- SK siltron
- SUMCO

The same official page states that:
- TSMC silicon-wafer suppliers must pass stringent quality certification procedures;
- TSMC procures wafers from multiple sources to ensure adequate volume supply and manage supply risk;
- each wafer supplier is subject to periodic quality-assurance-system audit;
- supplied products are regularly reviewed for specification and quality conformance.

## Clock and replay boundary

This is a historical issuer-native annual-report source.

Preserved clocks:
- evidencePeriod: 2022 annual report;
- sourceYear: 2022;
- currentCapturedAt: 2026-10-07 Asia/Taipei;
- exact original web publication timestamp: UNKNOWN in the current evidence packet.

Therefore this receipt is valid for topology/data-feasibility research at the current capture clock.

It is NOT authorized as an exact historical PIT trading receipt for an earlier 2023 decision timestamp unless an independent original publication/availability clock is later verified.

No later disclosure is backfilled into an earlier decision date.

## Frozen first-tier graph

```json
{
  "receiptId": "SC058_TSMC_RAW_WAFER_FIRST_TIER_NODE_REMOVAL_20261007_V0_1",
  "issuer": "TSMC",
  "issuerSymbol": "2330",
  "materialOrProductScope": "RAW_WAFERS",
  "consumerNode": "TSMC_RAW_WAFER_PROCUREMENT",
  "supplierNodes": [
    "FST",
    "GlobalWafers",
    "SEH",
    "Siltronic",
    "SK_siltron",
    "SUMCO"
  ],
  "relationType": "NAMED_MAJOR_SUPPLIER_CLASS_WITH_MULTISOURCE_PROCUREMENT",
  "qualificationConstraint": "STRINGENT_QUALITY_CERTIFICATION_PLUS_SPECIFICATION_CONFORMANCE",
  "nodeRemovalTestScope": "FIRST_TIER_ONLY",
  "firstTierNodeRemovalResult": "CONNECTIVITY_REMAINS_AFTER_ANY_SINGLE_NAMED_SUPPLIER_REMOVAL_AT_DISCLOSED_CLASS_LEVEL",
  "fullNetworkArticulationState": "UNKNOWN",
  "tier2Tier3SharedDependencies": "UNKNOWN",
  "supplierSpecificCapacity": "UNKNOWN",
  "supplierSpecificAllocation": "UNKNOWN",
  "switchingTime": "UNKNOWN",
  "effectiveHistoricalKnownAt": "UNKNOWN",
  "capturedAt": "2026-10-07 Asia/Taipei",
  "formalCoreChanged": false,
  "stockOutcomesOpened": false
}
```

## What is now identifiable

At the disclosed first-tier material-class graph:

- TSMC has more than one named raw-wafer supplier.
- Each usable supplier path is bounded by a qualification/specification constraint.
- Removing any one named supplier node does not erase all disclosed first-tier supplier connectivity, because other named supplier nodes remain.

Therefore the focal first-tier raw-wafer procurement node is not dependent on one sole named first-tier supplier in this disclosure.

This is the first Room07 topology witness that clears:
- distinct supplier identities;
- multiple source-supported first-tier paths;
- an explicit qualification constraint;
- a bounded node-removal test.

## What is NOT identifiable

The result must not be generalized into "TSMC raw-wafer supply has no single point of failure."

Unknowns include:
- whether multiple named suppliers depend on one common upstream raw-material source;
- whether multiple suppliers share one critical geography, utility, logistics route, tool supplier or process bottleneck;
- whether all six suppliers have sufficient spare capacity at the same decision clock;
- whether qualification is process-node/product-specific rather than universal;
- switching lead time;
- customer/product requalification delay;
- supplier-specific allocation priority during industry-wide shortage;
- tier-2 and tier-3 topology.

Therefore:
`FIRST_TIER_NODE_REDUNDANCY != FULL_NETWORK_RESILIENCE`.

## Strong falsification

The previous broad hypothesis:
"multiple qualified suppliers imply no articulation point"
is rejected.

The evidence only supports:
"within the disclosed first-tier raw-wafer supplier class, no single named supplier is the sole disclosed connection."

A hidden common upstream node can still be a true articulation point.

## D10 maturity decision

D10-01 remains L2 / 40%.

Reason:
SC-058 materially improves topology identifiability and demonstrates a replayable first-tier node-removal concept, but exact historical knownAt is not verified and deeper network path completeness is absent.

This is not enough for L3 Taiwan PIT/replay feasibility of full supply-network topology.

No D10 aggregate maturity promotion.
No Formal optimization candidate.

## System implications

System 1:
- no selection score, ranking bonus, veto, Top6, capital or signal change;
- do not translate supplier count into a resilience score.

System 2:
- may eventually consume a research-only topology primitive distinguishing:
  - FIRST_TIER_REDUNDANCY_SUPPORTED;
  - FULL_NETWORK_ARTICULATION_UNKNOWN;
- must not cast them as two independent bullish votes.

## Exact next continuation point

SC-059:
search for a Taiwan issuer-native case that exposes one deeper-layer/common-mode dependency capable of falsifying naive first-tier redundancy.

Preferred evidence classes:
1. multiple first-tier suppliers sharing one material, plant, geography, utility, logistics route or qualified process dependency;
2. issuer disclosure that an alternate supplier exists but switching requires qualification/customer approval/time;
3. a disruption case showing nominally multiple suppliers still fail under a shared bottleneck.

Acceptance:
- official issuer/regulator/industry primary source preferred;
- preserve event/source clocks;
- distinguish structural graph state from realized event propagation;
- no price/return outcome;
- if no deeper-layer identity is observable, freeze FULL_NETWORK_ARTICULATION_UNKNOWN rather than inferring safety.

Formal Core unchanged.
