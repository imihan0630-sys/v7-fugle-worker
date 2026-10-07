# SC-061 — MediaTek Multi-Source / Concentration Orthogonality V0.1

Status: RESEARCH_ONLY / SECOND_ISSUER_CONTROL / MULTISOURCE_NOT_EQUAL_CAPACITY_REDUNDANCY / FORMAL_CORE_UNCHANGED
Date: 2026-10-07 Asia/Taipei
Owner: 07｜產業與供應鏈研究室
Domain: D10-01
Parent: research/SC060_TSMC_DROUGHT_REALIZED_REDUNDANCY_STRESS_TEST_20261007_V0_1.md
Observed main before write: `f7deeb91e7ec9fb300ea3a0b1778e72bc4a659f3`

## Objective

Test the false shortcut:

MULTIPLE_SUPPLIERS => ECONOMICALLY_REDUNDANT_SUPPLY.

Use an independent Taiwan issuer whose official annual report exposes:
- multiple named supply sources;
- supplier qualification/capability expectations;
- procurement concentration.

No stock outcome is opened.

## Official issuer-native evidence

MediaTek 2024 Annual Report states that wafers are its main raw materials and are primarily procured from foundries including:
- Taiwan Semiconductor Manufacturing Company Limited;
- United Microelectronics Corporation;
- GlobalFoundries.

The same report says these suppliers satisfy MediaTek requirements for product quality, process capability, supply quantity and cooperation. MediaTek also actively engages other potential suppliers to obtain more supply, quality and pricing choices.

However, the same report's key-supplier table shows:
- Supplier A = 67.21% of 2024 total purchases;
- Supplier B = 10.22%;
- Others = 22.57%.

Supplier identities in the concentration table are anonymized, so Supplier A must not be guessed to equal any named foundry.

Official source:
- MediaTek 2024 Annual Report.

## Frozen orthogonality receipt

```json
{
  "receiptId": "SC061_MEDIATEK_MULTISOURCE_CONCENTRATION_20261007_V0_1",
  "issuer": "MediaTek",
  "issuerSymbol": "2454",
  "materialOrProductScope": "WAFERS_FOUNDRY_SUPPLY",
  "namedSourceSet": [
    "TSMC",
    "UMC",
    "GlobalFoundries"
  ],
  "additionalPotentialSupplierSearch": true,
  "supplierCapabilityConstraint": "PRODUCT_QUALITY_PROCESS_CAPABILITY_SUPPLY_QUANTITY_COOPERATION",
  "procurementConcentration": {
    "supplierA_pct_2024": 67.21,
    "supplierB_pct_2024": 10.22,
    "others_pct_2024": 22.57
  },
  "identityJoinBetweenNamedFoundriesAndSupplierA": "UNKNOWN",
  "topologyRedundancy": "MULTISOURCE_SUPPORTED",
  "economicCapacityRedundancy": "NOT_PROVEN_HIGH_CONCENTRATION_CONTROL",
  "stockOutcomesOpened": false,
  "formalCoreChanged": false
}
```

## Research conclusion

MediaTek is an independent issuer control against source-count optimism.

The public disclosure supports multiple wafer/foundry sources, but procurement remains economically concentrated.

Therefore:

`MULTISOURCE_COUNT != PROCUREMENT_SHARE_REDUNDANCY`.

And:

`FIRST_TIER_CONNECTIVITY_REDUNDANCY != CAPACITY_OR_ALLOCATION_REDUNDANCY`.

A system that counts supplier nodes without preserving purchase/exposure concentration can materially overstate resilience.

## Anti-hindsight / identity firewall

The annual report anonymizes Supplier A / Supplier B in the concentration table.

Do not infer:
- Supplier A = TSMC;
- Supplier B = UMC or GlobalFoundries;
- named-source procurement shares from the anonymous table.

This prevents an attractive but unsupported identity join.

## Cross-issuer implication

TSMC evidence proves:
- named first-tier supplier multiplicity;
- qualification requirements;
- operational common-mode contingency.

MediaTek independently proves:
- named foundry multiplicity can coexist with strong procurement concentration.

Together they establish that a useful topology receipt requires at least two separate primitives:
1. connectivity / qualified-path state;
2. exposure / capacity / procurement-share state.

They cannot be collapsed into one resilience score.

## D10 maturity decision

D10-01 remains L2 / 40%.

Reason:
cross-issuer Taiwan data feasibility is now stronger, but the evidence is not yet a prospective append-only effective-dated graph series with independent future updates. L3 is therefore not promoted merely from retrospective annual-report evidence.

No D10 aggregate maturity promotion.
No Formal optimization candidate.

## Exact next continuation point

SC-062:
freeze a prospective append-only D10-01 topology receipt contract for future issuer updates.

Minimum required fields:
- issuer;
- decisionClock / capturedAt;
- sourcePublishedAt when verifiable;
- source identities;
- material/product scope;
- qualification state;
- source-count state;
- procurement/exposure concentration;
- alternate-path state;
- common-mode dependency state;
- switching/capacity UNKNOWN guards;
- parent evidence hash/version.

Promotion preflight:
D10-01 may be reconsidered for L3 only after at least one future independently captured issuer update can be replayed without backfilling and all UNKNOWN/identity firewalls survive.

Formal Core unchanged.
