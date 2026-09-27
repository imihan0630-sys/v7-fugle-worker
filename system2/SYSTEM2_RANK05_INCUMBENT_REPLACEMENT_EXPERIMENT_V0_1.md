# System 2 RANK-05 Incumbent Retention vs Replacement Experiment V0.1

Updated: 2026-09-27 Asia/Taipei
Status: PREREGISTERED SHADOW COMPARISON / NO LIVE DISPLACEMENT POLICY / NO OUTCOME TUNING

## Research question

When the global candidate pool is full, does retaining a still-valid incumbent reduce destructive churn, or does it create stale opportunity cost versus a newly qualified challenger?

Current production-independent baseline:
RETAIN_VALID_INCUMBENT（保留仍有效舊候選）.

RANK-05 does not assume that either retention or replacement is better.

## Mechanism in favor of retention

A valid incumbent may:
- still be waiting for a high-quality trigger;
- preserve earlier discovery advantage;
- avoid repeated rank-12/rank-13 churn;
- avoid replacing a thesis with a merely newer but not better signal;
- preserve observation value across multiple sessions.

## Counter-mechanism

Retention can become stale:
- the incumbent can occupy scarce capacity while a stronger new opportunity emerges;
- a thesis can remain technically valid while expected opportunity deteriorates;
- regime/industry rotation can make yesterday's good candidate less attractive without creating a hard invalidation;
- new information can improve a challenger before the incumbent formally fails.

Therefore "valid" is necessary for retention, but may not be sufficient evidence that retention is optimal.

## V0.1 isolation rule

The first replacement experiment is deliberately narrow.

Only compare:
- one incumbent with exactly one surviving strategy membership;
- one challenger with exactly one strategy membership;
- same strategyId;
- same strategyVersion;
- both StrategyValidity（策略有效性） = VALID;
- both have complete RANK-01 strategy-local baseline tiers.

Reason:
a multi-strategy incumbent consumes one global slot but may carry several independent theses.
Evicting it for a single-strategy challenger would confound replacement quality with multi-strategy overlap value.

Cross-strategy and multi-strategy displacement are deferred to RANK-06 / later global-priority research.

## Experimental arms

### Arm A — retention baseline

Keep the valid incumbent.
Challenger remains CAPACITY_OVERFLOW（容量溢出） control.

This is the current V0.1 capacity behavior.

### Arm B — strict Pareto-tier challenger, Shadow only

A pair is eligible for a hypothetical displacement comparison only when:

challenger Pareto tier < incumbent Pareto tier.

This means the challenger is in a strictly better RANK-01 Pareto layer under the same strategy.

Same-tier neutral-hash order is NOT sufficient evidence for replacement.
The neutral hash is machine determinism only and must never create a displacement claim.

Arm B creates:
SHADOW_DISPLACEMENT_COMPARISON（影子替換比較）

It does NOT mutate the actual candidate pool.

## EntryReadiness exclusion in V0.1

EntryReadiness（進場準備度） is recorded but does not decide RANK-05 V0.1 replacement eligibility.

Reason:
RANK-02 is still an unproven incremental hypothesis.
Using it here would mix two unvalidated mechanisms.

A later RANK-05.1 may test:
strict Pareto improvement + readiness constraint,
but only after enough prospective RANK-02 evidence exists.

## Candidate age

candidatePoolSessions / candidateEpisodeAge is recorded but does not create an age penalty in V0.1.

Reason:
"old" does not automatically mean stale.
Age may represent either:
- stale capacity occupancy; or
- valuable early discovery still waiting for confirmation.

Its incremental value must be tested.

## Pair classification

For every comparable same-strategy pair:

- CHALLENGER_STRICTLY_BETTER_TIER
- SAME_TIER_NO_ECONOMIC_ORDER
- CHALLENGER_WORSE_TIER
- INPUT_INCOMPLETE

Blocked cohorts:
- INCUMBENT_MULTI_STRATEGY
- CHALLENGER_MULTI_STRATEGY
- STRATEGY_MISMATCH
- VERSION_MISMATCH
- STRATEGY_NOT_VALID

Blocked pairs remain preserved for coverage accounting.

## Required future outcome comparison

For Arm A incumbent and Arm B challenger, from the same decision timestamp measure:
- triggered within D1/D3/D5/D10;
- profitable-trigger conversion;
- MFE（最大有利幅度）;
- MAE（最大不利幅度）;
- stop-first;
- D1/D3/D5/D10 return;
- time-to-trigger;
- sessions occupying a global slot;
- later invalidation;
- simulated turnover/cost only if a replacement execution policy is later modeled.

Do not compare outcomes from different starting timestamps.

## Churn accounting

A replacement policy must report:
- replacements per decision date;
- average candidate episode length;
- rank-12/rank-13 boundary turnover;
- same-symbol re-entry frequency;
- replacement reversals;
- number of replacements where the removed incumbent later outperformed the challenger.

A policy that improves raw return but causes unstable high turnover may still fail.

## Falsification

Reject a replacement rule if:
- overflow challengers do not outperform retained incumbents on common-support pairs;
- gains are date/sector/regime concentrated;
- improvement disappears after candidate-age controls;
- it mainly replaces multi-session early-discovery names just before their trigger;
- turnover/cost or monitoring churn offsets the benefit;
- the apparent gain depends on neutral-hash within-tier order;
- PIT/source completeness differs materially between incumbent and challenger cohorts.

## Current decision

Retain-valid-incumbent remains the actual research baseline.

Strict same-strategy Pareto-tier replacement is Shadow comparison only.

No live displacement, no automatic eviction, no cross-strategy replacement, and no age penalty are authorized in V0.1.
