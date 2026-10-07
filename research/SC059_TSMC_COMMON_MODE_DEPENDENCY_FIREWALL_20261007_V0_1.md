# SC-059 — TSMC Common-Mode Dependency Firewall V0.1

Status: RESEARCH_ONLY / COMMON_MODE_FIREWALL_FROZEN / FULL_NETWORK_ARTICULATION_UNKNOWN / FORMAL_CORE_UNCHANGED
Date: 2026-10-07 Asia/Taipei
Owner: 07｜產業與供應鏈研究室
Domain: D10-01
Parent: research/SC058_TSMC_NAMED_WAFER_FIRST_TIER_NODE_REMOVAL_TOPOLOGY_20261007_V0_1.md
Observed main before write: `719aeae64b9bd2f4060da2ad6f4e6aab2589ef8f`

## Objective

Falsify the naive inference:

FIRST_TIER_MULTISOURCE => FULL_NETWORK_RESILIENCE.

SC-058 established that TSMC disclosed multiple named raw-wafer suppliers plus qualification constraints. SC-059 tests whether issuer-native risk disclosures require additional common-mode dependency dimensions that are invisible to supplier count alone.

No stock outcome is opened.

## Official issuer-native evidence

### Supply-chain risk assessment

TSMC sustainability reporting states that supplier assessment considers supplier product/service categories and locations, and that significant-supplier screening includes risk indicators such as single procurement source or market share.

This means geographic/source concentration is a distinct risk primitive; supplier count alone is insufficient.

Official source family:
- TSMC Sustainability Report / Responsible Supply Chain reporting
- https://esg.tsmc.com/en-US/file/public/2024-TSMC-Sustainability-Report-e.pdf
- https://esg.tsmc.com/file/public/2024-TSMC-Responsible-Supply-Chain-Report-e.pdf

### Company-wide business continuity common modes

TSMC 2025 annual-report material identifies business-continuity risks including:
- earthquakes;
- droughts;
- supply-chain disruption;
- failure of critical facilities/equipment;
- utility disruptions including water, electricity and natural gas.

Official source:
- https://investor.tsmc.com/sites/ir/annual-report/2025/2025%20Annual%20Report_E.pdf

These are not proof that the six raw-wafer suppliers share one exact hidden node. They are issuer-native evidence that common-mode risk can sit outside the first-tier supplier-identity graph and must therefore be represented separately.

## Frozen topology firewall

```json
{
  "receiptId": "SC059_TSMC_COMMON_MODE_FIREWALL_20261007_V0_1",
  "issuer": "TSMC",
  "issuerSymbol": "2330",
  "parentState": "FIRST_TIER_REDUNDANCY_SUPPORTED",
  "commonModeDimensionsRequired": [
    "SUPPLIER_LOCATION",
    "SINGLE_PROCUREMENT_SOURCE",
    "UPSTREAM_SHARED_INPUT",
    "WATER",
    "ELECTRICITY",
    "NATURAL_GAS",
    "CRITICAL_FACILITY_OR_EQUIPMENT",
    "LOGISTICS_OR_GEOGRAPHIC_HAZARD"
  ],
  "specificSharedDependencyAmongAllNamedWaferSuppliers": "UNKNOWN",
  "fullNetworkArticulationState": "UNKNOWN",
  "rule": "SUPPLIER_COUNT_CANNOT_CLOSE_COMMON_MODE_RISK",
  "formalCoreChanged": false,
  "stockOutcomesOpened": false
}
```

## Research conclusion

SC-058 proved a bounded first-tier redundancy state.

SC-059 proves that topology research must preserve a separate common-mode layer.

The correct hierarchy is:

1. supplier identity count;
2. qualification/substitution status;
3. first-tier node-removal connectivity;
4. supplier-location concentration;
5. shared upstream input/process/tool dependency;
6. utility/facility/logistics/geographic common modes;
7. only then full-network articulation/resilience.

If levels 4-6 are unknown, level 7 cannot be inferred from levels 1-3.

Permanent firewall:

`FIRST_TIER_REDUNDANCY_SUPPORTED + COMMON_MODE_UNKNOWN => FULL_NETWORK_RESILIENCE_UNKNOWN`.

## Counterevidence and limits

This evidence does NOT prove:
- all named wafer suppliers use the same water/electricity/gas network;
- all named wafer suppliers share one geography;
- a specific hidden tier-2 node is an articulation point;
- one common-mode disruption would disable every alternate source.

Therefore the common-mode layer is REQUIRED but the actual full-network articulation remains UNKNOWN.

## D10 maturity decision

D10-01 remains L2 / 40%.

Reason:
the semantic topology is now materially stronger and naive supplier-count resilience is falsified, but a complete effective-dated Taiwan issuer network with deeper-layer identities is still unavailable.

No D10 aggregate maturity promotion.
No Formal optimization candidate.

## Exact next continuation point

SC-060:
move from structural topology semantics to a bounded issuer-event test.

Seek one official Taiwan issuer event where:
- a disclosed supplier/source/facility/material disruption occurs;
- at least one alternate source/path is disclosed or attempted;
- qualification, capacity, geography or switching delay determines whether redundancy actually works;
- knownAt and event timing are preservable.

Primary question:
DOES_QUALIFIED_REDUNDANCY_SURVIVE_REALIZED_DISRUPTION?

This is still outcome-blind with respect to stock returns.

If no such bounded primary-source case can be found, preserve:
STRUCTURAL_REDUNDANCY_FEASIBLE / REALIZED_REDUNDANCY_EFFECTIVENESS_UNKNOWN.

Formal Core unchanged.
