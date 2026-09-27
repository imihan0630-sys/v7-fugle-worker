# System 2 Strategy-Local Ranking Baselines V0.1

Updated: 2026-09-27 Asia/Taipei
Status: PREREGISTERED RANK-01 BASELINE / RESEARCH-ONLY / NO OUTCOME TUNING / NO NUMERIC WEIGHTS

## Purpose

Create the first falsifiable Strategy-local Ranking Baseline（策略內排序基準） for:
- SHORT_MOMENTUM（短線動能）
- SWING_GROWTH（波段成長）

The baseline exists so later RANK-02+ experiments must beat something simple and preregistered.

It is not claimed to be optimal.

## Why Pareto tiers

V0.1 deliberately avoids:
- weighted sums;
- factor point systems;
- universal cross-strategy scores;
- outcome-tuned thresholds;
- arbitrary "A factor is worth twice B factor" assumptions.

Instead, the baseline uses Pareto dominance（帕累托支配） across a small set of already-approved evidence families.

Candidate A dominates Candidate B only when:
- A is no worse than B in every included family; and
- A is strictly better in at least one included family.

Non-dominated candidates form Pareto Tier 1.
Remove them and repeat to form Tier 2, Tier 3, etc.

A lower tier number means "not dominated by the remaining candidates under this baseline", not "expected return is X% higher".

## Family-state order

Within one evidence family only:

SUPPORTIVE（支持）
> NEUTRAL（中性）
> ADVERSE（不利）

INDETERMINATE（無法判定） is not ranked.

This ordinal is used only for within-family dominance comparison.
It is never summed into a total score.

## SHORT_MOMENTUM RANK-01 baseline

Policy:
`SM-PARETO-BASELINE / 0.1`

Included families:
1. TECHNICAL_STRUCTURE（技術結構）
2. PRICE_VOLUME（價量）
3. RISK_FRICTION（風險／交易摩擦）

Excluded from baseline on purpose:
- EntryReadiness（進場準備度） — reserved for RANK-02 incremental test;
- Market Regime（市場環境） — reserved for RANK-04;
- Confluence（共振） — reserved for RANK-03;
- chip/capital-flow support — not assumed to improve ordering before incremental tests.

Rationale:
the baseline represents the strategy's immediate structure/acceptance/risk quality without already baking the later research questions into the benchmark.

## SWING_GROWTH RANK-01 baseline

Policy:
`SG-PARETO-BASELINE / 0.1`

Included families:
1. FUNDAMENTAL_QUALITY（基本面品質）
2. INDUSTRY_THESIS（產業投資邏輯）

Excluded from baseline on purpose:
- EntryReadiness — RANK-02;
- Event/expectation surprise — current source semantics are incomplete;
- Valuation refinement — test later as an incremental ordering factor;
- Market Regime — RANK-04;
- technical/price-volume timing — timing support, not core growth-thesis ranking baseline.

Rationale:
the Limited Shadow version should not pretend that unavailable forward estimates or event-surprise data are known.

## Eligibility for ranking

A candidate can enter RANK-01 only when:
- strategyValidity = VALID;
- every baseline family has observationState = KNOWN;
- every baseline family has a determinate thesisState.

Otherwise:
`RANKING_INPUT_INCOMPLETE（排序輸入不足）`

Do not assign a fake low rank to missing data.

## Tie handling

Pareto tiers can contain multiple candidates with indistinguishable/economically non-dominated evidence.

V0.1 uses a deterministic Neutral Hash Tiebreak（中立雜湊平手決勝） based on:
- strategyId;
- strategyVersion;
- marketDate;
- symbol;
- ranking policy version.

Purpose:
- make the machine order reproducible;
- avoid symbol-code/alphabetic preference;
- avoid silently inventing an economic superiority claim.

Important:
the within-tier ordinal produced by the neutral tiebreak is NOT evidence that rank 1 is economically better than rank 2 inside the same Pareto tier.

Future outcome research must report results by:
- exact ordinal;
- Pareto tier;
- tie status.

## Required output

For every ranked candidate freeze:
- strategy-local rank;
- Pareto tier;
- baseline family states;
- tie-break hash;
- decisionId;
- EntryReadiness for later incremental comparison;
- ranking policy/version.

For every unranked candidate freeze the reason.

## RANK-02 comparison

The next experiment must compare:

Baseline A:
RANK-01 Pareto family baseline.

Versus:

Baseline B:
RANK-01 + EntryReadiness ordering.

Question:
Does entry proximity improve scarce monitoring-capacity use after controlling for thesis quality?

Counterexample to test:
entry proximity may over-rank late or extended candidates and worsen reward/risk.

## Rejection / revision rule

RANK-01 is a benchmark, not a permanent rule.

If it is unstable, source-fragile, or economically meaningless, replace it only with a new preregistered version and preserve this version's historical results.

No System 1/V8 behavior is affected.
