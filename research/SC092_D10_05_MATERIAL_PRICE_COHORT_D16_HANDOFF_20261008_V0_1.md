# SC-092 — D10-05 Material-Price Cohort / D16 Handoff V0.1

Status: RESEARCH_ONLY / OUTCOME_BLIND_D16_HANDOFF / TWO_MONTHLY_VINTAGES_ONE_CHAIN / POWER_INSUFFICIENT / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-05
Date: 2026-10-08 Asia/Taipei
Observed main before write: 04ada59c9a447aca6008994219744c0761e8e783

Parents:
- research/sc027_first_material_transmission_receipt_20260930_v0_1.json
- research/sc028_material_transmission_lag_prereg_v0_1.json
- research/sc036_steel_asymmetric_transmission_two_vintage_v0_1.json
- research/SC029_D10_05_SECOND_MATERIAL_PRICE_VINTAGE_RECONCILIATION_20261008_V0_1.md

## Prospective material vintages

E1 / 2026-08: scrap +2.1% MoM; billet -3.5% MoM; H-beam 0% MoM; vector = INPUT_UP / INTERMEDIATE_DOWN / DOWNSTREAM_FLAT.
E2 / 2026-09: scrap +4.1% MoM; billet +3.8% MoM; H-beam 0% MoM; vector = INPUT_UP / INTERMEDIATE_UP / DOWNSTREAM_FLAT.
Both were frozen before opening stock outcomes.

## Independent-unit rule

Primary unit = MATERIAL_PRICE_VINTAGE.
E1 and E2 are repeated monthly vintages of one Taiwan EAF steel chain, not two independent industries.
TWO_MONTHS_ONE_CHAIN != TWO_INDEPENDENT_INDUSTRY_MECHANISMS.
LAG0_LAG1_LAG2 != THREE_INDEPENDENT_OBSERVATIONS.
OUTPUT_BENCHMARK != REALIZED_ISSUER_ASP.
BENCHMARK_SPREAD != COMPANY_GROSS_MARGIN.

## Frozen lag family

Output-price transmission = month 0 / +1 / +2 only.
Issuer fundamentals = first and second compatible issuer-reported quarters after each material knownAt.
Market outcomes, if later authorized = D5 / D20 / D60 only.
No new lag may be added after outcome inspection.

## Route structure

Primary route = 2006 Tung Ho Steel / EAF / high direct scrap relevance.
Different-route control = 2002 China Steel / BF-BOF primary route plus secondary scrap.
Different route is not zero exposure.

## Outcome hierarchy

Primary economic endpoints:
1. month-0 / +1 / +2 downstream benchmark pass-through;
2. first compatible realized selling-price or product-mix state;
3. first compatible margin-direction state;
4. second compatible issuer report for persistence/reversal.
Stock outcomes are secondary and cannot rescue unsupported economic transmission.

## D16 requirements before any outcome access

Freeze month-level dependence and serial correlation.
Freeze chain clustering and route common-support fields.
Freeze market/sector/demand controls using pre-outcome clocks.
Multiplicity covers lag0/1/2 and D5/D20/D60.
No post-outcome route remap.
No post-outcome lag/horizon reselection.
Preserve UNKNOWN for inventory, electricity, yield, freight, mix and contract terms.
Return POWER_INSUFFICIENT when sample size is inadequate.

## Readiness

Prospective monthly vintages = 2.
Independent chains = 1.
Stock outcomes opened by Room07 = 0.
Realized issuer margin endpoints opened = 0.
Inference readiness = POWER_INSUFFICIENT.

## Maturity

D10-05 remains L3 / 60%.
No L4 promotion.

## Exact next

Room11/D16 freezes the material-price event method before any outcome access. Room07 accumulates additional independent material vintages and at least one different industry/chain while preserving the existing lag family.

Formal Core unchanged.
