# System 2 Ranking Research Plan V0.1

Updated: 2026-09-27 Asia/Taipei
Status: PREREGISTERED RESEARCH PLAN / NO RANKING FORMULA FROZEN

## Purpose

Research how System 2 should order already-qualified candidates when monitoring capacity is scarce.

Eligibility and ranking are separate questions.

A factor may be useful for:
- deciding whether a strategy thesis is valid;
- deciding whether entry is near;
- ordering several valid candidates;
- or none of the above.

Do not assume an eligibility factor automatically improves ranking.

## Non-negotiable boundary

There is no universal cross-strategy score in V0.1.

SHORT_MOMENTUM（短線動能） rank 1 is not directly comparable to SWING_GROWTH（波段成長） rank 1.

Ranking research must be performed:
1. inside each strategy first;
2. on common-support candidate sets;
3. with strategy-specific outcomes/horizons;
4. with redundancy and incremental-value checks;
5. before any global admission/displacement policy is promoted.

## Research sequence

### RANK-01 — Strategy-local baseline

For each strategy, freeze a simple interpretable baseline ordering using only already-approved strategy evidence.

Purpose:
establish a benchmark that more complex ranking methods must beat.

Do not use future outcomes to choose the baseline formula.

### RANK-02 — Entry-readiness increment

Test whether EntryReadiness（進場準備度） adds useful ordering information beyond strategy-local thesis quality.

Positive hypothesis:
candidates nearer a valid trigger use scarce active-monitor capacity more efficiently.

Counter-hypothesis:
entry proximity may over-favor late/extended names and reduce future reward/risk.

Measure separately:
- selected/qualified -> triggered conversion;
- MFE / MAE;
- stop-first;
- D1/D3/D5/... strategy horizon outcomes;
- TOO_EXTENDED / false-break rate.

### RANK-03 — Confluence increment

Test whether validated cross-family CONFLUENCE（共振） improves ordering after within-family redundancy is removed.

Counter-hypothesis:
confluence may merely count multiple transformations of the same price information.

No promotion if interaction terms do not beat their component families on independent dates.

### RANK-04 — Regime-aware priority

Test whether Market Regime（市場環境） should change:
- strategy activation;
- strategy-local ordering;
- global admission priority;
- or only desired monitoring intensity.

Do not assume the same role across strategies.

### RANK-05 — Incumbent retention vs replacement

Compare:
- retain-valid-incumbent baseline;
- replacement when a challenger is materially stronger under a frozen policy.

Measure:
- rank-12/rank-13 churn;
- later opportunity cost;
- time-to-trigger;
- monitoring turnover;
- stale-pool rate;
- regime-transition behavior.

Until evidence exists, current V0.1 capacity contract fills only genuine vacancies.

### RANK-06 — Multi-strategy overlap

Test whether a symbol supported by multiple genuinely distinct strategies deserves higher global admission priority.

Mandatory redundancy control:
two strategies relying on the same underlying evidence do not create two independent votes.

Compare:
- no overlap bonus;
- distinct-family overlap context;
- naive strategy-count baseline.

Naive strategy-count wins only if it shows incremental value after overlap/redundancy controls.

### RANK-07 — Concentration

Measure industry/size/regime concentration before considering a hard cap.

A warning is preferred over an arbitrary cap until evidence shows that concentration control improves risk-adjusted opportunity after opportunity-cost effects.

## Required controls

Every ranking experiment must report:
- total qualified candidates;
- independent decision dates;
- common-support sample;
- zero-candidate days;
- rank-position counts;
- strategy/regime/industry concentration;
- source-completeness rate;
- PIT validity;
- candidate turnover/churn;
- transaction cost/slippage where execution is modeled;
- multiple-testing family;
- baseline and ablation results.

## Ranking outcomes

Ranking quality is not judged only by average return.

At minimum evaluate:
- top-1 / top-3 outcome distribution;
- MFE（最大有利幅度）;
- MAE（最大不利幅度）;
- trigger conversion;
- profitable-trigger conversion;
- stop-first rate;
- opportunity cost of overflow names;
- pool churn;
- time spent occupying scarce monitoring capacity.

## Overflow control cohort

CAPACITY_OVERFLOW（容量溢出） names are a mandatory control cohort.

They are valid candidates that lost only because capacity was full.
Their future outcomes must be preserved.

This enables direct testing of:
- whether admitted names actually beat overflow names;
- whether the global ordering policy adds value;
- whether incumbent retention causes hidden opportunity cost.

## Rejection criteria

A proposed ranking factor/policy is REJECTED_OR_REDUNDANT if:
- it adds no incremental ordering value over the baseline;
- improvement disappears after common-support / PIT controls;
- benefit is concentrated in a few dates/sectors;
- it only increases turnover/churn;
- it improves trigger rate but worsens reward/risk materially;
- it depends on unavailable or unstable source semantics;
- it is a duplicate transformation of existing evidence.

## Promotion boundary

Only after prospective Shadow（影子模擬） / OOS（樣本外） evidence may a ranking policy become a versioned System 2 strategy-local ordering policy.

A future global admission/displacement policy is a separate versioned contract.

No outcome from this research changes System 1/V8.
