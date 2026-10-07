# SC-073 — Policy-to-Capacity Realization and Scope-Reset Control V0.1

Status: RESEARCH_ONLY / POSITIVE_DISBURSEMENT_AND_PHYSICAL_MILESTONE / NEGATIVE_SCOPE_RESET_CONTROL / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-14
Date: 2026-10-07 Asia/Taipei
Observed main before write: `9b3e407cb4dbf50e54d9454a24ccefb0c2ced9cb`

## Objective

Resolve the exact D10-14 remaining evidence gap:

1. obtain fresh official GlobalWafers physical milestone and/or actual subsidy-disbursement evidence;
2. add a Taiwan-issuer policy-support negative control showing that policy support does not guarantee the originally announced project scale, timing or capacity realization.

No stock outcome is opened.

---

## Positive control — GlobalWafers 6488

### Policy award

GlobalWafers' 2024 CHIPS award states that the U.S. Department of Commerce will provide up to US$406 million of direct funding for Sherman, Texas and St. Peters, Missouri, with disbursement tied to completion of project milestones over multiple years.

Official issuer source:
https://www.sas-globalwafers.com/en/gwc_news_en_20241217/

### Actual subsidy realization

GlobalWafers' official 2026Q1 results state:
- its U.S. subsidiaries, principally GlobalWafers America, had received approximately US$317.8 million during 2026Q1 from the Advanced Manufacturing Investment Credit and other government subsidies;
- the Italy project had received its first approved government-support payment of nearly EUR30 million in March 2026.

Official issuer source:
https://www.sas-globalwafers.com/gwc_news_20260505/

This changes the policy state from merely:
`AWARD_AUTHORIZED`
to:
`ACTUAL_FINANCIAL_SUPPORT_REALIZED`.

### Physical/qualification realization

GlobalWafers' official 2026Q2 results state:
- the Sherman, Texas facility had received qualifications from multiple Tier-1 customers;
- Micron further supported the U.S. advanced-wafer supply relationship through a long-term agreement and strategic funding support;
- the St. Peters, Missouri 12-inch SOI line was progressively entering volume production;
- Japan Utsunomiya new capacity had been fully brought online with high utilization.

Official issuer source:
https://www.sas-globalwafers.com/en/gwc_news_en_20260804/

This creates distinct physical lifecycle states:
- `CUSTOMER_QUALIFICATION_PASSED`;
- `LONG_TERM_CUSTOMER_COMMITMENT_OBSERVED`;
- `VOLUME_PRODUCTION_ENTERING`;
- `CAPACITY_ONLINE_HIGH_UTILIZATION`.

These states must remain separate from the subsidy state.

---

## Negative control — Hon Hai / Foxconn 2317 Wisconsin policy-support scope reset

### Original policy scale

Wisconsin Economic Development Corporation official materials described the original Foxconn Wisconsin project as:
- planned capital investment: up to US$10 billion;
- expected direct jobs: approximately 13,000;
- major state incentive package.

Official WEDC historical materials:
https://wedc.org/wp-content/uploads/2024/04/FY18-WEDC-Annual-Report-0419-Update-1.pdf

### Formal scope reset

WEDC's current official 2025 amendment release states:
- the 2021 amended contract used a planned US$672 million investment and 1,454 jobs by end-2025;
- the 2025 amendment increases total planned capital investment to US$1.2 billion and total planned jobs to 2,616 through end-2029;
- by end-2024, WEDC had verified nearly US$717 million of investment and 1,242 jobs.

Official WEDC source:
https://wedc.org/wedc-foxconn-announce-additional-569-million-investment-in-racine-county/

A separate WEDC official page explicitly describes the 2021 renegotiation as addressing shortcomings of the previous deal and reducing taxpayer exposure by US$2.77 billion.

Official WEDC source:
https://wedc.org/celebration-of-historic-investments-in-mount-pleasant-datacenter-global-co-innovation-lab-and-ai-solutions-for-wisconsin-manufacturers/

## Interpretation

This is not classified as a total cancellation.

It is a policy-supported `SCOPE_RESET` / `ORIGINAL_SCALE_NOT_REALIZED_AS_ORIGINALLY_FRAMED` control.

Permanent rules:

`POLICY_AWARD != ORIGINAL_PROJECT_SCALE_GUARANTEE`

`ORIGINAL_ANNOUNCED_CAPEX != IMMUTABLE_REALIZED_CAPEX`

`ORIGINAL_JOB_TARGET != IMMUTABLE_REALIZED_JOB_COUNT`

`CONTRACT_RENEGOTIATION_IS_A_STATE_CHANGE, NOT A DATA_ERROR`

The revised contract becomes a new policy-capacity vintage; the old terms remain historical evidence and cannot be silently overwritten.

---

## D10-14 lifecycle refinement

Freeze independent states:

1. `POLICY_PROPOSAL`
2. `POLICY_AUTHORIZATION`
3. `AWARD_EXECUTED`
4. `DISBURSEMENT_OR_TAX_CREDIT_REALIZED`
5. `CAPEX_COMMITTED`
6. `CAPEX_VERIFIED`
7. `FACILITY_OPENED`
8. `CUSTOMER_QUALIFICATION`
9. `VOLUME_PRODUCTION`
10. `UTILIZATION_STATE`
11. `SCOPE_REVISED`
12. `DELAYED`
13. `SUSPENDED_OR_CANCELLED`

A project can move forward on some states while moving backward or resetting on others.

No scalar `POLICY_SUCCESS_SCORE` is authorized from these states.

---

## Cross-case conclusion

GlobalWafers proves that:
- public policy can translate into actual realized financial support;
- customer qualification and volume-production milestones can subsequently become observable.

Foxconn Wisconsin proves that:
- policy support and signed incentive arrangements do not guarantee the original announced project scale;
- contract scope can be materially renegotiated;
- the correct research object is an effective-dated policy/project vintage, not one immutable headline.

Therefore:

`POLICY_SUPPORT -> CAPACITY`

must be represented as a lifecycle with state transitions, not as a binary causal arrow.

---

## D10-14 maturity decision

D10-14 remains L3 / 60%.

Reason:
the positive disbursement/milestone gap and one meaningful policy-support negative control are now materially resolved, but L4 still requires prospective/common-support economic or selection validation.

No stock outcome.
No Formal optimization candidate.
Formal Core unchanged.

## Exact next

SC-074:
build a prospective policy-to-capacity realization receipt for the next new subsidy/disbursement/project-scope event after this freeze.

Required fields:
- policy/program;
- issuer;
- award amount;
- realized disbursement/tax credit;
- original project scope;
- current project scope;
- verified capex;
- facility state;
- qualification state;
- HVM/volume-production state;
- utilization state;
- revision reason if disclosed;
- knownAt/effectiveAt;
- source lineage.

Do not promote a policy announcement directly into capacity or earnings exposure.
