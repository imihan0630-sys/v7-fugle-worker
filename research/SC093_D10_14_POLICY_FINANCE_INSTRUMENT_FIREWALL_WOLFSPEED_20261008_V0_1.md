# SC-093 — Policy-Finance Instrument Firewall: Wolfspeed Conditional Loan V0.1

Status: RESEARCH_ONLY / HISTORICAL_CALIBRATION_RELATIVE_TO_SC087 / POLICY_FINANCE_INSTRUMENT_TAXONOMY / PROSPECTIVE_N_UNCHANGED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-14
CapturedAt: 2026-10-08T15:27:19+08:00
Observed main before write: c793bfc86f70f47ebb20550b822ba6947c213f87

## Purpose

Prevent industrial-policy research from collapsing grants, tax credits, loans and equity-linked financing into one generic subsidy variable.

Primary official issuer source:
https://investor.wolfspeed.com/news/news-details/2026/Wolfspeed-Announces-Conditional-30-Year-1-5-Billion-Loan-Commitment-from-U-S--Department-of-War-to-Advance-Domestic-Wide-Bandgap-Supply-Chain/default.aspx

Source date: 2026-10-07.

SC-087 prospective D10-14 observation was frozen on 2026-10-08 05:55 Asia/Taipei.
Therefore this event predates SC-087 and MUST NOT increment post-SC087 prospective event N.

Permanent timing rule:
`NEW_TO_RESEARCH != NEW_AFTER_PROSPECTIVE_FREEZE`.

## Instrument facts

Wolfspeed disclosed a conditional commitment for up to US$1.5 billion of long-term financing through the U.S. Department of War Office of Strategic Capital.

Frozen instrument state:
- instrument = senior secured delayed-draw term loan facility;
- maximum commitment = US$1.5 billion;
- tenor = 30 years;
- state = CONDITIONAL_COMMITMENT;
- realized funded amount at this receipt = UNKNOWN / NOT_PROVEN;
- definitive agreements = NOT_YET_EXECUTED in the source disclosure;
- conditions include diligence, definitive documentation, financial/legal/investment conditions, approvals/authorizations and third-party consents;
- equity-linked term = warrants potentially covering up to 7.5% of fully diluted equity, issuable pro rata when financing tranches are funded.

The issuer explicitly states there is no assurance that definitive agreements will be executed or financing will be provided.

## Intended industrial-policy scope

Potential financing is intended to support domestic U.S. development/production of:
- silicon carbide materials;
- wide-bandgap power devices;
- gallium-nitride epitaxy and device capabilities;
- GaN-on-SiC radio-frequency epitaxial-wafer technology;
- radiation-hardening capabilities.

These intended uses are program scope, not proof that capacity has been created or utilized.

## Policy-finance taxonomy

Freeze distinct states:
1. DIRECT_GRANT_AWARD;
2. TAX_CREDIT_OR_REBATE_AUTHORIZED;
3. TAX_CREDIT_OR_REBATE_REALIZED;
4. CONDITIONAL_LOAN_COMMITMENT;
5. DEFINITIVE_LOAN_EXECUTED;
6. LOAN_TRANCHE_FUNDED;
7. EQUITY_OR_WARRANT_CONSIDERATION;
8. VERIFIED_CAPEX;
9. FACILITY_OR_EQUIPMENT_MILESTONE;
10. CUSTOMER_OR_PROCESS_QUALIFICATION;
11. VOLUME_PRODUCTION;
12. UTILIZATION.

These states are non-substitutable.

Permanent rules:
- `CONDITIONAL_LOAN_COMMITMENT != CASH_DISBURSEMENT`;
- `LOAN != GRANT`;
- `FINANCING_CAPACITY != MANUFACTURING_CAPACITY`;
- `POLICY_SUPPORT_AMOUNT != REALIZED_CAPEX`;
- `PROGRAM_INTENT != REALIZED_OUTPUT`;
- `EQUITY_LINKED_CONSIDERATION_MUST_NOT_BE_IGNORED_WHEN_COMPARING_POLICY_SUPPORT`.

## Comparison with GlobalWafers

GlobalWafers provides a different lifecycle state because issuer-native evidence later disclosed actual realized government support and physical qualification/production milestones.

Wolfspeed at this source clock is earlier in the lifecycle:
`CONDITIONAL_FINANCING_SUPPORT`, not realized funding/capacity.

Therefore policy-support cases must be compared by instrument state and realization state, not headline amount.

## Taiwan issuer mapping firewall

No Taiwan-listed issuer is assigned a benefit/harm sign from this U.S. policy event.

Potential competitive/substitution implications for Taiwan SiC, GaN, power-device or wafer suppliers remain UNKNOWN unless a Taiwan issuer supplies direct product/customer/geographic exposure evidence.

Do not infer:
- Taiwan SiC suppliers benefit because U.S. SiC investment rises;
- Taiwan competitors are harmed because Wolfspeed receives support;
- Wolfspeed's possible funding changes near-term global supply immediately.

## Maturity

D10-14 remains L3 / 60%.

Prospective post-SC087 event N is unchanged.
No L4 promotion.

## Exact next

Continue SC-088 prospective observation from the SC-087 freeze.
The first genuinely post-freeze industrial-policy financing/award/disbursement/scope/qualification/HVM/utilization event must preserve sourcePublishedAt, capturedAt, instrument type, conditionality, realized funding and physical realization as separate fields.

Formal Core unchanged.
