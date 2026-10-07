# SC-062 — D10-01 Prospective Topology Receipt Contract V0.1

Status: RESEARCH_ONLY / CONTRACT_FROZEN / PROSPECTIVE_CAPTURE_READY / FORMAL_CORE_UNCHANGED
Date: 2026-10-07 Asia/Taipei
Owner: 07｜產業與供應鏈研究室
Domain: D10-01
Parents:
- research/SC057_TSMC_QUALIFIED_MULTISOURCE_TOPOLOGY_RECEIPT_20261007_V0_1.md
- research/SC058_TSMC_NAMED_WAFER_FIRST_TIER_NODE_REMOVAL_TOPOLOGY_20261007_V0_1.md
- research/SC059_TSMC_COMMON_MODE_DEPENDENCY_FIREWALL_20261007_V0_1.md
- research/SC060_TSMC_DROUGHT_REALIZED_REDUNDANCY_STRESS_TEST_20261007_V0_1.md
- research/SC061_MEDIATEK_MULTISOURCE_CONCENTRATION_ORTHOGONALITY_20261007_V0_1.md
Observed main before write: `fbb9d2ed9b2d0bf715a89b880a72b3faa5140c73`

## Purpose

Convert the accumulated topology semantics into one prospective, append-only, replayable receipt contract.

The contract must prevent four common errors:
1. supplier count being treated as resilience;
2. named alternatives being treated as qualified/capacity-sufficient alternatives;
3. first-tier redundancy being treated as full-network redundancy;
4. later supplier identities or relationships being backfilled into an earlier decision clock.

## Three orthogonal primitives

Every topology state is decomposed into:

### A. Connectivity primitive
Question:
does more than one source-supported path exist at the decision clock?

States:
- SINGLE_PATH_SUPPORTED
- MULTI_PATH_SUPPORTED
- PATH_IDENTITY_PARTIAL
- UNKNOWN

### B. Capacity / exposure primitive
Question:
if one path fails, is enough alternate economic capacity/exposure available?

States:
- ALTERNATE_CAPACITY_SUFFICIENT_SUPPORTED
- ALTERNATE_CAPACITY_PARTIAL
- CONCENTRATED_EXPOSURE
- CAPACITY_UNKNOWN
- UNKNOWN

Supplier count cannot fill missing capacity.

### C. Common-mode primitive
Question:
can nominally separate paths fail together because of shared upstream, geography, utility, process, equipment, logistics or regulation?

States:
- COMMON_MODE_IDENTIFIED
- COMMON_MODE_PARTIAL
- NO_COMMON_MODE_SUPPORTED only when evidence is sufficiently complete
- COMMON_MODE_UNKNOWN

Missing common-mode evidence never becomes NO_COMMON_MODE.

## Required receipt fields

Identity / clock:
- receiptId
- issuer
- issuerSymbol
- sourceId
- sourceUrl
- sourcePublishedAt
- capturedAt
- decisionClock
- evidencePeriod
- evidenceHash
- sourceVersion

Graph:
- nodeId
- nodeType
- edgeId
- fromNode
- toNode
- relationType
- materialOrProductScope
- effectiveFrom
- effectiveTo
- identityResolution

Qualification:
- substitutionState
- qualificationConstraint
- qualificationScope
- switchingLeadTime
- customerApprovalConstraint

Exposure / capacity:
- sourceCount
- procurementShare
- revenueExposure
- capacityShare
- spareCapacity
- allocationConstraint

Common-mode:
- geography
- utilityDependency
- upstreamSharedInput
- sharedEquipmentOrProcess
- logisticsDependency
- regulatoryDependency

Completeness:
- evidenceCompleteness
- missingFields
- unknownReasons

Derived states:
- connectivityState
- capacityRedundancyState
- commonModeState
- firstTierNodeRemovalState
- fullNetworkArticulationState

## Hard replay rules

1. Only evidence available by decisionClock may enter a receipt.
2. Later named suppliers cannot be backfilled.
3. Anonymous Supplier A/B identities cannot be guessed.
4. Missing procurement/capacity share cannot be replaced by equal weights.
5. MULTI_PATH_SUPPORTED does not imply ALTERNATE_CAPACITY_SUFFICIENT_SUPPORTED.
6. FIRST_TIER_REDUNDANCY_SUPPORTED does not imply FULL_NETWORK_RESILIENCE.
7. FULL_NETWORK_ARTICULATION_SAFE is not allowed unless the graph completeness required for that claim is itself supported.
8. Revision creates a new receipt linked to the prior receipt; it does not overwrite historical known state.
9. D07 concentration may be consumed as an exposure primitive but cannot be recast as a second topology vote.
10. D17 disruption/event propagation may consume this graph but cannot recreate structural topology from realized event outcomes.

## Prospective admission gate

A new receipt is ADMITTED only when:
- source is issuer-native, regulator/exchange official, or explicitly accepted authoritative industry source;
- capturedAt is immutable;
- source identity/version/hash is preserved;
- at least one topology primitive is directly observed;
- missing fields are explicit UNKNOWN;
- no outcome/stock-return information is used to choose graph structure.

Otherwise:
- state = BLOCKED or PARTIAL;
- no forced topology score.

## D10-01 L3 promotion preflight

Current state:
L2 / 40%.

Reconsider L3 only after all are true:
1. contract is frozen before the new observation;
2. at least one FUTURE independent issuer/source update is captured prospectively;
3. sourcePublishedAt/capturedAt/decisionClock pass;
4. old receipt can be replayed without using the future update;
5. identity UNKNOWN guards survive;
6. connectivity, capacity and common-mode states remain separately represented;
7. no Formal or stock outcome is used as promotion evidence.

The first prospective receipt may prove Taiwan PIT/replay feasibility.
It does not prove Alpha and does not authorize L4.

## Machine contract

Companion:
`research/sc062_d10_01_prospective_topology_receipt_contract_v0_1.json`

## Exact next continuation point

SC-063:
wait for or capture the next genuinely new issuer-native topology disclosure/event after this contract freeze.

Preferred first candidates:
- TSMC/UMC/MediaTek future annual/sustainability update;
- a new material-source diversification disclosure;
- a supplier/facility disruption with explicit alternate-path response.

Do not use a pre-existing historical document as the qualifying prospective L3 receipt merely because it has not yet been analyzed.

Formal Core unchanged.
