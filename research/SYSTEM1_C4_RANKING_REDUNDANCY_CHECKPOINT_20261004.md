# System 1 C4 ranking redundancy audit V0.1

Date: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY_IMPLEMENTED / FIXTURE_VERIFIED / CI_PENDING / FORMAL_CORE_LOCKED

## Purpose

Measure the actual decision incidence of System 1's repeated ranking influences without changing admission, Formal weights, pool quotas, capital, signals, or Production.

The audit answers two distinct questions while holding the same qualified candidate set fixed:

1. How often does each later lexicographic comparator actually decide pair order or the Top3 cutline?
2. If one PriorityScore component is removed while its gate and any raw later comparator remain unchanged, does selected membership/order change?

This is structural falsification, not a recommendation to remove a factor.

## Authority and data contract

Current Formal comparator lineage:
`PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30`.

Primary implementation:
`research/system1_c4_ranking_redundancy_v0_1.mjs`.

The audit consumes the same immutable V8.17+ C1 generation and requires, for every Formal-qualified row:

- `formalResult.actualRankingTuple` captured from the actual post-consensus Formal result;
- `zeroPickRankObservation.rankInput` from the same decision request;
- matching symbol / pool / generation / decisionAt / preSortOrdinal;
- complete frozen decomposition for pre-consensus PriorityScore.

It fails closed if the counterfactual decomposition cannot exactly reproduce the actual Formal ranking tuple. It never repairs, imputes, or recomputes old generations with later data.

## Baseline parity firewall

Before any ablation, the module reconstructs current Formal order using:

1. post-consensus `priorityScore`;
2. raw `rewardPerRisk`;
3. `marketConsensusScore`;
4. `setupQuality`;
5. `sectorFlow`;
6. `relativeStrength`;
7. deterministic same-pool `preSortOrdinal` fallback.

It applies GENERAL max 3 and THOUSAND max 3 independently with no cross-pool fill.

The rebuilt selected set must equal the immutable stored Formal selected flags. Any mismatch aborts the audit.

## Tie-break ablations

Each later comparator is removed one at a time while current PriorityScore remains untouched:

- `DROP_RR_TIEBREAK`;
- `DROP_CONSENSUS_TIEBREAK`;
- `DROP_SETUP_TIEBREAK`;
- `DROP_SECTOR_TIEBREAK`;
- `DROP_RS_TIEBREAK`.

Outputs include selected-membership changes, order changes, per-pool cutline changes, and pairwise first-differing-key incidence.

A later comparator existing in code does not imply material influence; it matters only when all earlier keys tie.

## PriorityScore component ablations

Each score contribution is removed one at a time with no weight renormalization:

- `REMOVE_SETUP_SCORE_COMPONENT`;
- `REMOVE_SECTOR_SCORE_COMPONENT`;
- `REMOVE_INSTITUTIONAL_SCORE_COMPONENT`;
- `REMOVE_FUNDAMENTAL_SCORE_COMPONENT`;
- `REMOVE_RS_SCORE_COMPONENT`;
- `REMOVE_RR_SCORE_COMPONENT`;
- `REMOVE_CONSENSUS_BONUS`.

All existing admission gates remain conceptually fixed. Raw later comparators remain present when that concept has one.

This isolates the score layer only. It does not combine gate loosening, score deletion, and comparator deletion in one experiment.

## Fixture verification

Dedicated fixture test:
`tests/test_system1_c4_ranking_redundancy_v0_1.mjs`.

Local deterministic verification passed before repository write.

Covered cases include:
- exact baseline selected-set parity;
- independent 3+3 pool quotas / no cross-fill;
- deterministic ordinal fallback;
- an RR tie-break deciding the General Top3 cutline;
- dropping only RR tie-break swapping cutline membership;
- removing only the Setup score component changing membership while leaving the setup gate/tie-break concept intact;
- exact decomposition rebuild of pre/post-consensus PriorityScore;
- corrupted actual-vs-counterfactual tuple rejection;
- incomplete decomposition rejection;
- stored-selection parity failure rejection;
- `economicSuperiority=UNKNOWN` and no Formal authority.

## Interpretation guards

The audit must never report:
- layer count as a pseudo-weight;
- candidate-count change as success;
- score-ablation selection change as economic improvement;
- a fixture result as market evidence;
- a single future date as sufficient optimization evidence.

Actual outcome evaluation still requires prospective independent dates, costs, path risk, regime/sector controls, purged/OOS validation, and the existing Formal-switch maturity gates.

## Formal boundary

No Worker, guarded runtime patch, D1 schema, provider, Cron, Production, System2, Formal A/B, gate, ranker, Top6/3+3, capital, BUY/ADD/REDUCE/SELL/STOP, 15-minute, push or order behavior is changed.

`economicSuperiority=UNKNOWN`
`formalOptimizationCandidate=NONE`
Formal Core: LOCKED

## Exact next continuation

1. Merge only after Regression and Repair CI pass on the exact PR head.
2. Do not deploy Production; this tranche is research/test/workflow only.
3. After the first genuine V8.17+ trading-session C1 generation, run this audit on that exact immutable generation.
4. Record:
   - pairwise first-differing comparator frequencies;
   - each pool's cutline deciding key;
   - per-ablation selected membership/order changes;
   - coverage/data-quality blockers.
5. Accumulate independent dates before joining forward outcomes.
6. Only after prospective outcome maturity may any duplicated layer become a Class-C Formal optimization candidate.
