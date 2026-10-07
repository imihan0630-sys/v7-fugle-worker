# SC-069 — UMC 2026Q3 Utilization Forecast-Realization Preregistration V0.1

Status: RESEARCH_ONLY / PREREGISTERED_BEFORE_2026Q3_RELEASE / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-04
Date frozen: 2026-10-07 Asia/Taipei
Observed main before write: `7199af3f5f9c6d6988763f1a5ff16f74c2a6e67f`
Parent:
- research/SC068_UMC_TRUE_UTILIZATION_AND_LOW_UTILIZATION_CONTROL_20261007_V0_1.md

## Purpose

Create a genuinely prospective issuer-native utilization observation before the next UMC quarterly result.

This is not a stock-return experiment.

The research target is:
- preserve the prior issuer guidance;
- preserve the future release schedule;
- capture the realized issuer-native utilization rate after publication;
- compare forecast state vs realized state without changing the rule after seeing the number.

## Pre-existing official guidance

UMC 2026Q2 official financial-results release dated 2026-07-29 states:
- 2026Q2 wafer-fab capacity utilization = 85%;
- 2026Q3 capacity utilization is expected to exceed 90%.

Official source:
https://www.umc.com/zh-TW/News/press_release/Content/investor/20260729

UMC official investor-events page currently schedules:
- 2026Q3 earnings release / investor conference call: 2026-10-28.

Official source:
https://www.umc.com/en/IR_Event/ir_events

## Frozen prior state

```json
{
  "issuer": "UMC",
  "issuerSymbol": "2303",
  "forecastMadeAt": "2026-07-29",
  "forecastTargetPeriod": "2026Q3",
  "forecastMetric": "WAFER_FAB_CAPACITY_UTILIZATION_RATE",
  "forecastRelation": "GT",
  "forecastThresholdPct": 90,
  "lastRealizedPeriod": "2026Q2",
  "lastRealizedUtilizationPct": 85,
  "nextScheduledReleaseDate": "2026-10-28",
  "preregisteredAt": "2026-10-07 Asia/Taipei"
}
```

## Admission rule on 2026Q3 release

When the 2026Q3 official result becomes public, freeze:
- source URL;
- sourcePublishedAt if available;
- capturedAt;
- realized utilization percentage;
- wafer-shipment QoQ direction/percentage when disclosed;
- ASP direction when disclosed;
- gross margin when disclosed;
- process-mix state when disclosed.

Do not use:
- stock price;
- post-release analyst target prices;
- later-quarter revisions;
- later management commentary not present at first capture.

## Forecast-realization state

The state is determined mechanically:

- `GUIDANCE_MET` if realized utilization > 90%;
- `GUIDANCE_NOT_MET` if realized utilization <= 90%;
- `UNRESOLVED` if issuer does not disclose a comparable utilization metric;
- `SOURCE_DELAYED` if scheduled release is postponed and no official result exists.

No tolerance band is added after seeing the result.

## Economic interpretation firewall

Even if guidance is met:
- do not infer stock Alpha;
- do not infer margin improvement automatically;
- do not infer pricing power automatically;
- do not infer process-node utilization uniformity.

Even if guidance is not met:
- do not automatically classify the issuer as deteriorating;
- inspect demand, capacity additions, mix, maintenance and timing only as separately disclosed states.

Permanent rules:
- `UTILIZATION_GUIDANCE_MET != STOCK_ALPHA`;
- `UTILIZATION_GUIDANCE_NOT_MET != AUTOMATIC_NEGATIVE_SIGNAL`.

## Why this is prospective

At the freeze clock:
- 2026Q3 official realized utilization is not yet public;
- the comparison threshold is already determined by issuer guidance (>90%);
- the source family and scheduled release date are already known;
- the evaluation rule is frozen before realized data.

This eliminates post-hoc threshold choice.

## D10-04 maturity

D10-04 remains L3 / 60% now.

The future SC-069 realization receipt may strengthen prospective PIT/replay evidence, but L4 remains blocked until D16-compatible prospective/OOS economic validation exists.

No Formal optimization candidate.
Formal Core unchanged.

## Exact next

SC-070:
on or after the first official UMC 2026Q3 release:
1. capture the official first-known result;
2. freeze clocks;
3. evaluate only the preregistered >90% utilization guidance;
4. preserve all unavailable fields as UNKNOWN;
5. do not open stock outcomes;
6. then decide whether D10-04 has enough prospective source evidence to hand a bounded validation candidate to D16.
