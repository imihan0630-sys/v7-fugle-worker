# BR-059A D09-13 ABF Forecast-vs-Realized Revenue Firewall — 2026-10-07

Status: FORECAST_VS_REALIZED_FIREWALL_FROZEN / NANYA_ABF_PROJECT_BENEFIT_VALUES_NOT_REALIZED_REVENUE / 3189_8046_ABF_REALIZED_NUMERATOR_UNKNOWN / OUTCOMES_CLOSED

Owner room: 07｜產業與供應鏈研究室
Domain/module: D09 / D09-13
Task: BR-059A
Date: 2026-10-07 Asia/Taipei

## Objective

Continue issuer-native ABF numerator search and explicitly distinguish:
- realized product revenue;
- projected project sales value;
- capacity / shipment / application evidence.

No forward stock outcome was opened.

## New evidence — Nan Ya PCB historical annual-report project benefits

Issuer-native historical annual-report disclosure contains expected economic benefits for ABF capacity-expansion projects.

Reported planned project values include examples such as:
- Shulin ABF substrate phase-1 expansion: projected sales value NTD 4,320,528 thousand;
- Shulin ABF substrate phase-2 expansion: projected sales value NTD 5,627,640 thousand;
- Kunshan ABF substrate phase-2 expansion: projected sales value NTD 4,446,300 thousand.

These values are tied to investment-project expected benefits / projected production and sales assumptions.

They are NOT realized ABF revenue.

## Frozen semantic firewall

`PROJECTED_PROJECT_SALES_VALUE != REALIZED_PRODUCT_REVENUE`

A project-benefit table may be issuer-native, numeric and ABF-specific while still being invalid as an observed realized-revenue numerator.

The following evidence types remain separate:

1. `REALIZED_PRODUCT_REVENUE`
   - actual recognized revenue for a mutually exclusive ABF product category;
   - acceptable numerator if denominator is compatible.

2. `PROJECTED_PROJECT_SALES_VALUE`
   - expected project benefit / planned sales value;
   - useful for ex-ante capacity economics;
   - forbidden as realized ABF numerator.

3. `CAPACITY_OR_TECHNOLOGY_STATE`
   - production capacity, expansion schedule, technology roadmap;
   - supports supply/strategic-state research;
   - not a revenue numerator.

4. `APPLICATION_REVENUE_OR_EXPOSURE`
   - AI/HPC/server/network/automotive application sales or exposure;
   - not interchangeable with ABF product revenue unless the issuer proves one-to-one mapping.

## 8046 current evidence hierarchy

2025 realized disclosure:
- broad "circuit board" product category only;
- ABF-specific realized revenue remains UNKNOWN.

Historical ABF project expected-sales values:
- ABF-specific but forecast/project-benefit semantics;
- not realized revenue.

2025/2026 product development disclosures:
- ABF is explicitly a core product family and targets AI PC processors, custom AI ASIC, graphics, data-center processors, switch/router, WiFi and ADAS applications;
- application roadmap supports strategic/product relevance;
- still does not supply realized ABF revenue.

Therefore:

`NANYA_8046_ABF_REALIZED_REVENUE_NUMERATOR = UNKNOWN`

and the project forecast values are retained only as:
`ABF_CAPACITY_PROJECT_EXPECTED_BENEFIT_EVIDENCE`.

## 3189 current evidence hierarchy

2025 realized disclosure:
- substrate operating segment revenue exists;
- ABF-specific realized revenue does not.

Issuer-native current strategic disclosure:
- high-end FCBGA / SiP focus;
- large-area high-layer-count ABF substrate capability;
- ABF market/capacity positioning.

This supports product/strategy-state evidence but not a realized ABF numerator.

Therefore:

`KINSUS_3189_ABF_REALIZED_REVENUE_NUMERATOR = UNKNOWN`.

## Cross-company consequence

The research system must not rank ABF exposure by mixing:
- 3189 realized substrate-segment revenue;
- 8046 broad circuit-board revenue;
- 8046 historical projected ABF project sales values;
- AI/HPC application mix.

These live on different semantic axes:
- realized vs projected;
- product vs application;
- narrow vs broad taxonomy.

Any composite built from them without a formal measurement model would create false precision.

## Positive research value

The absence of a compatible ABF realized numerator is itself informative:
- issuer-native strategic/product evidence is strong;
- accounting-level product granularity is insufficient;
- ABF exposure remains partially latent and must remain UNKNOWN rather than estimated from incompatible categories.

This is preferable to introducing sell-side estimates into the canonical issuer-native parent evidence.

## Counter-evidence / limitations

- A later investor deck may disclose actual product mix.
- A future annual report may expose ABF vs PP revenue.
- A management presentation may disclose shipment or mix percentages that become compatible after exact denominator review.
- Historical projected project values may be useful for D09-14/D10 capacity strategy research, but not D09-13 realized product revenue.

## Maturity decision

D09-13 remains L3 / 60.
D09 remains 57.1%.

No promotion:
- measurement boundary improved;
- realized ABF numerator remains unknown;
- no prospective/OOS stock-selection evidence.

## Exact next

`BR-059B`:
search issuer-native 2025-2026 investor-presentation and annual-report narrative tables for actual realized product mix:
- ABF vs PP vs other substrate;
- mutually exclusive percentages or revenues;
- explicit denominator and period.

If only projected project value, application exposure, capacity, shipment or roadmap appears, classify it under the appropriate non-revenue evidence state and retain realized ABF numerator UNKNOWN.

SDA-009 remains interrupt-priority if a genuine System1 R3A1 receipt appears.
