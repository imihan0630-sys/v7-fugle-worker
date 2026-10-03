# System1 Zero-Pick Counterfactual Comparator V0.1 — 2026-10-03

Status: CLASS-A RESEARCH-ONLY / FORMAL CORE LOCKED / LIVE DATA GAP REMAINS

Parent:
- shared-knowledge/SYSTEM1_ZERO_PICK_COUNTERFACTUAL_DATA_GAP_20261003_V0_1.md
- shared-knowledge/system1_zero_pick_counterfactual_data_gap_20261003_v0_1.json

## Purpose

Close the software-design portion of the zero-pick comparator gap without pretending
that today's live C1/C2 evidence contains the missing ranking tuple.

This prototype is usable only when a future prospective row carries a complete,
same-decision ranking tuple plus PIT provenance.

## Frozen comparator

Version:
PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30

Descending fields:
1. postConsensusPriorityScore
2. rewardPerRisk
3. marketConsensusScore
4. setupQuality
5. sectorFlow
6. relativeStrength

Final deterministic tie:
preSortOrdinal ascending.

Pool policy:
- GENERAL max 3
- THOUSAND max 3
- no cross-pool transfer
- total max 6

## Fail-closed input contract

Each row must provide:
- SYSTEM1_ZERO_PICK_COUNTERFACTUAL_RANK_INPUT_V0_1
- scanDate / symbol / pool / captureGeneration / decisionAt
- exact rankComparatorVersion
- complete six-field ranking tuple
- preSortOrdinal
- rankingTupleKnownAt <= decisionAt
- rankingTupleProvenance
- rankingTupleFingerprint

Mixed decision generations, duplicate symbols, duplicate same-pool pre-sort ordinals,
missing numeric tuple fields, wrong comparator versions and future-known tuples are rejected.

## Output boundary

The prototype returns research-only counterfactual 3+3 membership.

It does not:
- create WATCH or BUY;
- allocate capital;
- simulate execution;
- compare with cash;
- infer economic superiority;
- alter any Formal selector/ranker/gate;
- write Worker/D1;
- push or place orders.

economicSuperiority remains UNKNOWN.
formalOptimizationCandidate remains NONE.

## Evidence boundary

Current live C1/C2 still lacks the full authenticated rejected-row ranking tuple.
Therefore this prototype does not make historical zero-pick dates reconstructable.

The correct next evidence step remains prospective capture of the complete tuple.
That would be Class B and requires a separate proposal/approval before Worker/D1 changes.

## Exact continuation

1. Validate this Class-A prototype in CI.
2. Keep it research-only.
3. On future approval of a minimal Class-B tuple receipt, persist the complete tuple
   contemporaneously for P1-A F9 rows.
4. Only then run the frozen 3+3 counterfactual selection.
5. After selection is frozen, apply allocation, execution/cost and mature outcomes.
6. Never use all-F9 average return as a substitute for the quota-limited challenger.
