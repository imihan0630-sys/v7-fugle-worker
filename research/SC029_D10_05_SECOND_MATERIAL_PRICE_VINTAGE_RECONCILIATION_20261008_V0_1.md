# SC-029 — D10-05 Second Material / Output-Price Vintage Reconciliation V0.1

Status: RESEARCH_ONLY / EXISTING_OUTCOME_BLIND_VINTAGE_RECONCILED / FAILED_SAME_MONTH_PASS_THROUGH_CONTROL / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-05
Date reconciled: 2026-10-08 Asia/Taipei
Observed main before write: 389dddd34580baf4b121d9670381aff75b8e2415

## Purpose

Close the old SC-029 cursor using already-frozen evidence rather than recollecting or reclassifying data.

Parents:
- research/sc027_first_material_transmission_receipt_20260930_v0_1.json
- research/sc028_material_transmission_lag_prereg_v0_1.json
- research/sc036_steel_asymmetric_transmission_two_vintage_v0_1.json

## Second vintage satisfying the preregistered requirement

2026-09 Taiwan EAF chain, captured 2026-10-02T16:23:00+08:00:
- North Taiwan scrap benchmark = NT$10.2/kg, +4.1% MoM;
- mid-grade billet benchmark = NT$16,050/t, +3.8% MoM;
- Tung Ho H-beam distribution benchmark = NT$37,500/t, 0% MoM;
- vector = INPUT_UP / INTERMEDIATE_UP / DOWNSTREAM_FLAT.

Frozen lag windows remain unchanged:
- output price month 0 / +1 / +2;
- first and second compatible issuer reports after material knownAt;
- D5 / D20 / D60 only if a later outcome gate opens.

## Failed same-month pass-through control

At month 0, upstream scrap and billet both rose while the downstream H-beam benchmark remained flat.
Descriptor = UPSTREAM_PRESSURE_WITH_DOWNSTREAM_STICKINESS.

Permanent rule: INPUT_UP != SAME_MONTH_OUTPUT_PRICE_UP.

This is not a realized issuer-margin claim. Procurement cost, inventory vintage, electricity, yield, freight, product/customer mix, contract terms and realized ASP remain separate.

## Event dependence

2026-08 and 2026-09 are two monthly material vintages under the same steel route/source family.
They are independent time vintages but not independent industries.
Permanent rule: TWO_MONTHS_ONE_CHAIN != TWO_INDEPENDENT_INDUSTRY_MECHANISMS.

## Maturity

D10-05 remains L3 / 60%.
SC-029 is now COMPLETE as an evidence-collection cursor.
No L4 promotion follows from two same-chain monthly vintages.

## Exact next

SC-092: freeze an outcome-blind D10-05 material-price cohort / D16 handoff using the two monthly vintages, explicit chain clustering, lag multiplicity and POWER_INSUFFICIENT behavior; continue accumulating additional independent material events/chains without changing lag windows.

Formal Core unchanged.
