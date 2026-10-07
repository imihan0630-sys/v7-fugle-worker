# BR-069 — D09-14 Strategic-Action Cohort D16 Handoff V0.1

Status: RESEARCH_ONLY / OUTCOME_BLIND_D16_HANDOFF / FIVE_ACTIONS_FOUR_ISSUERS / HETEROGENEITY_PRESERVED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D09-14
Date: 2026-10-08 Asia/Taipei
Observed main before write: 5496eecebb3f543dc231fc73359a3b545480051a

## Purpose

Freeze the validation structure for the five-action prospective strategic-action cohort before any stock/economic outcome is opened.

Parents:
- research/br058_prospective_strategic_action_cohort_v0_1.json
- research/br060_strategic_action_cohort_expansion_v0_1.json
- research/BR064_VIS_VSMC_PROSPECTIVE_CAPITAL_INJECTION_STRATEGIC_ACTION_20261007_V0_1.md

## Frozen cohort

1. UMC 2303 — 2026-07-29 — phased capacity expansion with long-term customer commitment.
2. Hon Hai 2317 — 2026-04-24 — automotive-business joint-operation MOU with Mitsubishi Electric.
3. TSMC 2330 — 2026-08-11 — definitive Sony JV agreement.
4. TSMC 2330 — 2026-09-08 — ASML large-mask technology-platform initiative.
5. VIS 5347 — 2026-10-07 — VSMC US$100m JV-level capital injection.

Action count = 5.
Issuer count = 4.
TSMC contributes two actions and therefore creates within-issuer dependence.

## Heterogeneity firewall

Do not pool the five actions as one homogeneous treatment.

Action-family strata:
- CAPACITY_COMMITMENT;
- MOU_PRE_DEFINITIVE;
- DEFINITIVE_JOINT_VENTURE;
- TECHNOLOGY_PLATFORM_INITIATIVE;
- JV_CAPITAL_INJECTION.

Permanent rule:
`STRATEGIC_ACTION_COUNT != HOMOGENEOUS_TREATMENT_COUNT`.

## Independent unit

Primary event root:
`ISSUER_STRATEGIC_ACTION_VINTAGE`.

But:
- two TSMC actions share one issuer cluster;
- later milestones inherit the original action root;
- D10 physical-capacity milestones are references, not new independent D09 treatment roots.

Permanent rules:
- `MILESTONE_COUNT != INDEPENDENT_ACTION_COUNT`;
- `D10_PHYSICAL_MILESTONE_REFERENCE != SECOND_D09_STRATEGY_VOTE`.

## Outcome hierarchy

Operational outcomes first:
- definitive agreement / closing when relevant;
- capital paid-in when relevant;
- project/facility/tool implementation;
- customer/process qualification;
- HVM / commercial launch;
- cancellation / scope revision / delay.

Financial outcomes second:
- first two compatible reported quarters after material implementation;
- next four compatible reported quarters where scope remains comparable;
- revenue/margin/capex only when issuer-native scope matches the frozen action.

Relative-position outcomes third:
- 12-month and 24-month market-share/relative-position change only with compatible denominator.

Stock outcomes last:
- D20 / D60 / D120 only under a separate D16 method receipt;
- stock returns cannot define whether an operational strategy succeeded.

## Current maturity/readiness

All five actions are pre-outcome frozen.
No stock outcomes have been opened by Room07.
Some actions have long implementation clocks extending to 2027-2033.
Current operational follow-up is therefore right-censored for several actions.

Current inference readiness:
`DESIGN_READY / OUTCOME_COHORT_IMMATURE / HETEROGENEOUS_ACTIONS / POWER_INSUFFICIENT`.

## D16 method requirements

Before any cohort-level outcome access, D16 must freeze:
- issuer-clustered dependence;
- action-family stratification;
- no cross-family pooled average unless a justified estimand exists;
- right-censoring treatment for long-horizon projects;
- common-support fields available before outcome;
- market/sector controls frozen pre-outcome;
- no post-outcome action reclassification;
- no conversion of D10 milestones into independent D09 votes;
- multiplicity across operational / financial / relative-position / D20-D60-D120 outcomes;
- POWER_INSUFFICIENT fail-closed behavior.

## Maturity decision

D09-14 remains L3 / 60%.

L4 is not authorized because prospective outcome evidence is not mature enough and no D16 cohort method receipt exists yet.

## Exact next

1. Room11/D16 freezes the cohort method receipt outcome-blind.
2. Continue issuer-native milestone append only.
3. Do not interpret bounded silence as failure.
4. When a milestone/outcome matures, attach it to the original action root.
5. Reassess L4 only after prospective outcome evidence exists under the frozen method.

Formal Core unchanged.
