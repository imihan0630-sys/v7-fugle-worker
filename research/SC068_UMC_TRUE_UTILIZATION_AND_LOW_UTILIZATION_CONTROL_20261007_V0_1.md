# SC-068 — UMC True Utilization and Low-Utilization Control V0.1

Status: RESEARCH_ONLY / ISSUER_NATIVE_TRUE_UTILIZATION / LOW_UTILIZATION_CONTROL_ADDED / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-04
Date: 2026-10-07 Asia/Taipei
Observed main before write: `5d6c252c3784d3487f2543a3b9dba834ce25db27`

## Objective

Resolve the remaining D10-04 source-quality gap between:
- synthetic output/capacity ratios, and
- issuer-native disclosed capacity-utilization rates.

The exact pre-existing tracker requirement was:
- seek one issuer-disclosed true utilization-rate case;
- seek one delay/cancellation/low-utilization control;
- do not open L4 before prospective/common-support outcome evidence.

UMC provides both the true utilization-rate case and a low-utilization control inside the same issuer-native reporting family.

## Official issuer-native evidence

Primary UMC investor disclosures:

1. 2024Q1 — published 2024-04-24
   - wafer-fab capacity utilization: 65%
   - wafer shipments +4.5% QoQ
   - management explicitly states utilization edged down to 65%.

   Official source:
   https://www.umc.com/zh-TW/News/press_release/Content/investor/20240424

2. 2024Q4 — published 2025-01-21
   - wafer-fab capacity utilization: 70%.

   Official source:
   https://www.umc.com/zh-TW/News/press_release/Content/investor/20250121

3. 2025Q4 — published 2026-01-28
   - wafer-fab capacity utilization: 78%.

   Official source:
   https://www.umc.com/zh-TW/News/press_release/Content/investor/20260128

4. 2026Q1 — published 2026-04-29
   - wafer-fab capacity utilization: 79%.

   Official source:
   https://www.umc.com/zh-TW/News/press_release/Content/investor/20260429

5. 2026Q2 — published 2026-07-29
   - wafer-fab capacity utilization: 85%
   - management states wafer shipments rose 10.6% QoQ and pushed utilization to 85%.

   Official source:
   https://www.umc.com/zh-TW/News/press_release/Content/investor/20260729

## Frozen utilization receipt

```json
{
  "receiptId": "SC068_UMC_TRUE_UTILIZATION_20261007_V0_1",
  "issuer": "UMC",
  "issuerSymbol": "2303",
  "metric": "WAFER_FAB_CAPACITY_UTILIZATION_RATE",
  "metricType": "ISSUER_NATIVE_DISCLOSED",
  "observations": [
    {"period":"2024Q1","publishedAt":"2024-04-24","utilizationPct":65},
    {"period":"2024Q4","publishedAt":"2025-01-21","utilizationPct":70},
    {"period":"2025Q4","publishedAt":"2026-01-28","utilizationPct":78},
    {"period":"2026Q1","publishedAt":"2026-04-29","utilizationPct":79},
    {"period":"2026Q2","publishedAt":"2026-07-29","utilizationPct":85}
  ],
  "lowUtilizationControl": {
    "period":"2024Q1",
    "utilizationPct":65,
    "state":"LOWER_UTILIZATION_CONTROL"
  },
  "highUtilizationComparison": {
    "period":"2026Q2",
    "utilizationPct":85,
    "state":"HIGHER_UTILIZATION_COMPARISON"
  },
  "syntheticRatioUsed": false,
  "stockOutcomeOpened": false,
  "formalCoreChanged": false
}
```

## Why this is materially stronger than prior capacity proxies

Prior D10-04 controls included issuer capacity/production/HVM evidence, but some utilization context could only be represented by bounded throughput-to-capacity ratios.

SC-068 removes that ambiguity for one Taiwan issuer:
- the utilization rate is directly disclosed by UMC;
- it is not annualized from one quarter;
- it is not inferred from shipment/capacity division;
- it is not a macro-industry utilization proxy.

Permanent rule:
`ISSUER_NATIVE_UTILIZATION > SYNTHETIC_OUTPUT_TO_CAPACITY_PROXY`
for source-quality ranking, while both may remain useful as differently typed evidence.

## Low-utilization negative control

2024Q1 is retained as a deliberate low-utilization control:
- utilization = 65%;
- shipments increased QoQ, yet utilization remained relatively low.

This is useful because:
- shipment growth alone does not imply high utilization;
- positive revenue/volume direction cannot be substituted for an actual utilization state;
- capacity/utilization state must remain separately observed.

Permanent rule:
`SHIPMENT_GROWTH != HIGH_UTILIZATION`.

## Cross-time transition

Observed disclosed utilization sequence in this bounded set:
65% -> 70% -> 78% -> 79% -> 85%.

This is a source-quality and state-transition witness only.

It does NOT establish:
- a causal relation to stock return;
- a fixed threshold at which margins or prices must improve;
- a monotonic relation under all capacity additions;
- fab-specific utilization;
- node-specific utilization by process technology.

The metric is an issuer-level disclosed wafer-fab utilization rate.

## Capacity-expansion firewall

UMC also announced further fab expansion in 2026.

That does NOT authorize:
`CAPACITY_EXPANSION => HIGH_UTILIZATION`.

Future capacity changes and utilization must remain separate state variables because:
- new capacity can temporarily lower utilization;
- demand may change before ramp completion;
- different nodes/products can have different loading;
- utilization can rise before or after capacity additions.

## D10-04 maturity decision

D10-04 remains L3 / 60%.

Reason:
the exact source-quality blocker and low-utilization-control blocker are now resolved, but L4 still requires preregistered prospective/OOS economic evidence under common support.

This receipt strengthens the L3 evidence base without manufacturing an L4 promotion.

No Formal optimization candidate.
Formal Core unchanged.

## Exact next

SC-069:
freeze a forward D10-04 utilization receipt for UMC 2026Q3 before the 2026-10-28 earnings release:
- preregister expected source family;
- do not predict the utilization number;
- capture the issuer-native rate once published;
- preserve release time / capture time;
- compare only against the frozen prior state vector;
- keep stock outcomes closed.

Parallel optional control:
seek a second Taiwan issuer that discloses a true utilization rate, to test cross-issuer transportability without synthesizing the metric.
