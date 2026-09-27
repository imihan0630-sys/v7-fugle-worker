# System 2 RANK-02 Entry Readiness Experiment V0.1

Updated: 2026-09-27 Asia/Taipei
Status: PREREGISTERED CHALLENGER / RESEARCH-ONLY / NO OUTCOME TUNING

## Research question

Does EntryReadiness（進場準備度） add incremental ordering value after controlling for the RANK-01 Pareto thesis-quality tier?

Do not assume yes.

Potential positive mechanism:
scarce monitoring slots may be better used by candidates that are closer to a valid strategy-specific trigger.

Potential counter-mechanisms:
- proximity can favor late/extended moves;
- readiness may be a repackaging of the same technical/price-volume evidence already inside RANK-01;
- frequent readiness changes may increase churn;
- earlier WATCH candidates may have better reward/risk before the crowd arrives.

## Baseline

RANK-01:
- SHORT_MOMENTUM: Pareto tiers from TECHNICAL_STRUCTURE + PRICE_VOLUME + RISK_FRICTION.
- SWING_GROWTH: Pareto tiers from FUNDAMENTAL_QUALITY + INDUSTRY_THESIS.
- neutral deterministic hash only for within-tier machine tie handling.

## Challenger A — GLOBAL_ADMISSION

Policy family:
`RANK02_ENTRY_PROXIMITY_BINARY / 0.1`

Keep Pareto tier primary.

Within the same Pareto tier:
- PROXIMATE: NEAR_ENTRY / ACTIVE_ENTRY_MONITOR / BUY_ELIGIBLE
- NON_PROXIMATE: all other valid readiness states

PROXIMATE is ordered before NON_PROXIMATE.

No distinction among the three proximate states in Challenger A.

Purpose:
test the smallest possible "closer to entry" increment without asserting a precise readiness hierarchy.

## Challenger B — ACTIVE_INTRADAY_MONITOR

Policy family:
`RANK02_ENTRY_READINESS_ORDINAL / 0.1`

Only candidates already eligible for active monitoring participate.

Within the same Pareto tier, preregister the hypothesis:

BUY_ELIGIBLE
> ACTIVE_ENTRY_MONITOR
> NEAR_ENTRY

This is a hypothesis, not a fact.

Neutral hash breaks remaining ties.

## What must remain unchanged

RANK-02 does not:
- change strategy validity;
- turn WAIT/TOO_EXTENDED/CONFLICT/BLOCKED into eligible active-monitor states;
- alter factor-family assessments;
- change strategy thresholds;
- create a cross-strategy score;
- override global max-12 or per-strategy max-3 capacity;
- alter System 1/V8.

## Required comparison

For the same market date / strategy / candidate common-support set, preserve both:
- RANK-01 order;
- RANK-02 challenger order.

Later compare:
- trigger conversion;
- profitable-trigger conversion;
- MFE（最大有利幅度）;
- MAE（最大不利幅度）;
- stop-first rate;
- reward/risk;
- time-to-trigger;
- capacity occupancy;
- churn;
- overflow opportunity cost.

## Redundancy test

EntryReadiness can be promoted only if it adds information beyond the RANK-01 family states.

Required ablations:
1. RANK-01 only.
2. RANK-01 + binary proximity.
3. RANK-01 + ordinal readiness for active monitoring.
4. simple readiness-only baseline.

If 2/3 do not beat 1 after PIT/common-support controls, EntryReadiness should not receive ranking priority.

## Rejection rule

Reject or downgrade the challenger if:
- trigger conversion improves but MFE/MAE/reward-risk worsens materially;
- gains are explained by the same technical/PV inputs already in RANK-01;
- churn rises without net opportunity benefit;
- effect is concentrated in a few dates/regimes/sectors;
- active-monitor ordinal order is unstable;
- source/semantic gaps create selective samples.

No outcome is known or used to define V0.1.
