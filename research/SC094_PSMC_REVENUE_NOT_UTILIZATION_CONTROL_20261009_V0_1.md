# SC-094 — PSMC Revenue-Growth Does Not Identify Utilization V0.1

Status: RESEARCH_ONLY / SECOND_ISSUER_PROXY_FALSIFICATION / ISSUER_NATIVE_REVENUE / UTILIZATION_UNKNOWN / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-04
Date: 2026-10-09 Asia/Taipei
Observed main before write: 292615c3402e551ac40a799d092bdd2195709faa

## Objective

Add a second Taiwan foundry issuer as a negative-control for utilization inference without fabricating a utilization percentage.

UMC already supplies issuer-native true utilization percentages. PSMC supplies a strong recent revenue sequence but no comparable utilization percentage in the monthly-revenue source.

## Official PSMC revenue sequence

Official source family:
- https://www.powerchip.com/zh-tw/financials/index/monthly-revenues-2026
- https://www.powerchip.com/zh-tw/insights/press-releases

Issuer-native monthly revenue, NTD thousand:
- 2026-04: 5,045,881;
- 2026-05: 5,770,374, +14.36% MoM;
- 2026-06: 6,473,929, +12.19% MoM;
- 2026-07: 6,668,883, +3.01% MoM;
- 2026-08: 7,008,845, +5.10% MoM;
- 2026-09: 7,665,064, +9.36% MoM.

September 2026 revenue was published on 2026-10-08.

## Utilization state

The observed monthly-revenue source does not disclose a directly comparable wafer-fab capacity-utilization percentage.

Therefore:
`PSMC_2026_09_UTILIZATION_PCT = UNKNOWN`.

Do not infer utilization from revenue growth.

Revenue can change because of multiple non-equivalent mechanisms, including:
- shipment volume;
- realized selling price / product mix;
- technology/product migration;
- capacity/resource reallocation;
- foreign exchange;
- customer and memory-cycle mix.

Permanent rule:
`REVENUE_GROWTH != IDENTIFIED_UTILIZATION`.

Also:
`CONSECUTIVE_REVENUE_GROWTH != PROOF_OF_FULL_UTILIZATION`.

## Cross-issuer role

UMC remains the positive true-utilization issuer because it directly discloses utilization percentages.

PSMC is a negative proxy-control:
strong issuer-native monthly revenue does not authorize synthesizing a utilization percentage.

This improves source discipline but is not a second true-utilization observation.

## D10-04 maturity

D10-04 remains L3 / 60%.

SC-094 closes one proxy-abuse channel but does not replace the optional second-issuer true-utilization target and does not create L4 evidence.

## Exact next

1. Keep the UMC 2026Q3 >90% preregistration frozen for the 2026-10-28 official release.
2. Continue seeking a second Taiwan issuer that directly reports a comparable utilization percentage.
3. Preserve revenue, shipments, ASP, capacity and utilization as separate state variables.
4. Never synthesize utilization from revenue alone.

Formal Core unchanged.
