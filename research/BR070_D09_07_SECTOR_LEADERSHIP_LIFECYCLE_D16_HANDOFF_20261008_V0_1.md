# BR-070 — D09-07 Sector Leadership Lifecycle D16 Handoff V0.1

Status: RESEARCH_ONLY / OUTCOME_BLIND_D16_HANDOFF / SIX_OFFICIAL_DATES / DATE_LEVEL_DEPENDENCE_FROZEN / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D09-07
Date: 2026-10-08 Asia/Taipei
Observed main before write: 7f255ab53645de07eaef670528b37e1b386ef53d

## Purpose

Freeze the validation design for sector-leadership persistence/reversal before any forward outcome is inspected.

Parents:
- research/br045_twse_sector_leadership_lifecycle_pit_v0_1.json
- research/br061_twse_sector_leadership_lifecycle_append_20261007_v0_1.json
- research/br045_twse_full_industry_rank_baseline_20261007_v0_1.json

## Frozen evidence set

Six official TWSE 34-industry total-return snapshots:
- 2026-09-23;
- 2026-09-24;
- 2026-09-30;
- 2026-10-01;
- 2026-10-02;
- 2026-10-07.

Participation-state thresholds remain unchanged:
- BROAD_PARTICIPATION: positive-industry share >= 75%;
- MIXED_PARTICIPATION: 40% <= positive-industry share < 75%;
- NARROW_PARTICIPATION: positive-industry share < 40%.

2026-10-07 remains MIXED at 25/34 = 73.53%; no threshold rounding is allowed.

## Independent-unit firewall

Primary independent unit:
`OFFICIAL_INDUSTRY_SNAPSHOT_DATE`.

The 34 industry rows within one date are cross-sectionally dependent and must not be counted as 34 independent event observations.

Repeated sector states across dates are also serially dependent.

Permanent rules:
- `34_INDUSTRIES_X_6_DATES != 204_INDEPENDENT_OBSERVATIONS`;
- `TOP3_MEMBER_COUNT != INDEPENDENT_EVENT_COUNT`;
- `SHARED_OFFICIAL_DATE_ROOT_MANY_CONSUMERS != MANY_EVIDENCE_ROOTS`.

Composite parent indices such as 電子工業 and 化學生技醫療 overlap economically with child categories. D16 must preserve that hierarchy rather than treat all 34 rows as mutually exclusive industries for causal inference.

## Preregistered lifecycle outcomes

Descriptive transition endpoints first:
- next-snapshot top-quartile retention;
- next-snapshot top-quartile exit;
- next-snapshot entry into top quartile;
- participation-state persistence / widening / narrowing;
- top3 turnover;
- deltaPercentileRank under comparable taxonomy.

Longer-horizon lifecycle endpoints:
- 5-session and 20-session leadership persistence only when future official snapshots exist;
- reversal defined symmetrically before outcome inspection;
- no stock-level outcome is inferred from sector-index persistence.

Stock-selection outcomes, if ever opened, are tertiary and require a separate D16 method plus common support.

## Cross-module deduplication

D09-06 owns continuous sector rank transition.
D09-07 owns leadership lifecycle persistence/churn.
D09-04 owns stock-count breadth.
D09-10 owns concentration.

One official 2026-10-07 industry-index snapshot is a shared parent root. Its reuse across D09-06 and D09-07 does not create two independent pieces of evidence.

## D16 requirements

Before any predictive/persistence efficacy claim, freeze:
- date-clustered dependence;
- serial dependence across adjacent/nearby sessions;
- overlapping-index hierarchy treatment;
- taxonomy-version comparability;
- multiplicity across retention, exit, entry, turnover, 5D and 20D endpoints;
- common-support controls for broad/mixed/narrow states;
- no post-outcome threshold or state redefinition;
- POWER_INSUFFICIENT fail-closed behavior when independent date N is too small.

## Current readiness

Source/PIT feasibility: READY.
Lifecycle semantics: READY.
Prospective append-only snapshots: READY_BOUNDED.
Independent date N: 6.
Predictive outcome access by Room07: 0.
Inference readiness: POWER_INSUFFICIENT.

## Maturity decision

D09-07 remains L3 / 60%.

No L4 promotion is authorized from six dates alone.

## Exact next

1. Room11/D16 freezes a date-clustered lifecycle method receipt outcome-blind.
2. Continue appending future official 34-industry snapshots under unchanged semantics.
3. Add member-level breadth/concentration only with effective-dated membership and same-clock lineage.
4. Reassess L4 only after genuinely prospective persistence/reversal outcomes mature under the frozen method.

Formal Core unchanged.
