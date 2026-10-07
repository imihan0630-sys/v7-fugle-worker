# SC-060 — TSMC Drought Realized Redundancy Stress Test V0.1

Status: RESEARCH_ONLY / REALIZED_UTILITY_REDUNDANCY_STRESS_TEST / CAUSAL_ATTRIBUTION_BOUNDED / FORMAL_CORE_UNCHANGED
Date: 2026-10-07 Asia/Taipei
Owner: 07｜產業與供應鏈研究室
Domain: D10-01
Parent: research/SC059_TSMC_COMMON_MODE_DEPENDENCY_FIREWALL_20261007_V0_1.md
Observed main before write: `f7deeb91e7ec9fb300ea3a0b1778e72bc4a659f3`

## Objective

Move topology research from static disclosure into one realized operating-stress case.

Primary question:
DOES_QUALIFIED_REDUNDANCY_SURVIVE_REALIZED_DISRUPTION?

This receipt uses water-supply stress as a common-mode input-path test. It remains outcome-blind with respect to stock returns.

## Official issuer evidence

TSMC sustainability / climate reporting freezes a drought contingency ladder:
- Yellow stage: water conservation plus water-truck drills;
- Orange stage: industrial water supply reduction and activation of water trucks, with 7%-20% water-consumption reduction;
- Red stage: district rationing plus activation of water trucks and 7%-20% water-consumption reduction.

TSMC also discloses diversified/alternative water-source development, including reclaimed water and purchased backup water sources.

Official sustainability indicators report zero production-interruption days due to climate disasters for the relevant reported periods including 2021.

Official source family:
- TSMC 2021/2022/2023 Sustainability Reports;
- TSMC Climate and Nature Reports.

## Frozen realized-stress receipt

```json
{
  "receiptId": "SC060_TSMC_DROUGHT_REALIZED_REDUNDANCY_20261007_V0_1",
  "issuer": "TSMC",
  "issuerSymbol": "2330",
  "dependencyClass": "WATER_UTILITY_INPUT",
  "stressType": "DROUGHT_AND_INDUSTRIAL_WATER_RESTRICTION",
  "primarySourcePath": "MUNICIPAL_OR_PARK_WATER_SUPPLY",
  "alternatePaths": [
    "WATER_TRUCKS",
    "RECLAIMED_WATER",
    "PURCHASED_BACKUP_WATER",
    "INTERNAL_WATER_CONSERVATION_AND_RECLAMATION"
  ],
  "switchingConstraint": "STAGED_WATER_SIGNAL_AND_AVAILABLE_TRUCK_OR_ALTERNATIVE_SOURCE_CAPACITY",
  "realizedOperatingOutcome": "ZERO_REPORTED_CLIMATE_DISASTER_PRODUCTION_INTERRUPTION_DAYS",
  "causalAttribution": "BOUNDED_NOT_IDENTIFIED",
  "reason": "Zero interruption is jointly produced by source diversification, conservation, internal buffers/reclamation, actual drought severity, infrastructure and operating response; it cannot be attributed to one alternate path.",
  "stockOutcomesOpened": false,
  "formalCoreChanged": false
}
```

## What this case proves

The case establishes that:
1. alternate input paths are not merely conceptual;
2. TSMC has an operational switching ladder that activates alternate water delivery under stronger restrictions;
3. the observed reporting period contains realized drought/climate stress with zero reported climate-disaster production-interruption days;
4. realized redundancy effectiveness can therefore be represented as an operational state rather than inferred from supplier count.

## What it does not prove

It does NOT prove:
- water trucks alone prevented interruption;
- the same design scales to every fab and every drought severity;
- alternate-water capacity was sufficient under every hypothetical failure;
- future droughts will have zero interruption;
- a utility-resilience state has stock-selection Alpha.

A zero-interruption aggregate is not a causal estimate.

Permanent rule:
`REALIZED_ZERO_INTERRUPTION != SINGLE_PATH_CAUSAL_SUCCESS`.

## D10 maturity decision

D10-01 remains L2 / 40%.

Reason:
this is a genuine realized stress witness with source-path semantics, but it is one issuer/common-mode class and current research still lacks a prospective append-only topology series with effective-dated path identities across independent issuers/dates.

No D10 aggregate maturity promotion.
No Formal optimization candidate.

## Exact next continuation point

SC-061:
build an independent Taiwan issuer counterexample where:
- multiple source identities exist;
- one source still dominates economic procurement/exposure;
- supplier count and concentration therefore disagree.

Purpose:
separate TOPOLOGY_REDUNDANCY from ECONOMIC_CAPACITY_REDUNDANCY and prevent source-count optimism.

Formal Core unchanged.
