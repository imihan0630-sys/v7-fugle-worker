# Market Consensus B-186 Observability Audit

Date: 2026-09-27 Asia/Taipei
Class: A research/documentation only
Formal Core: unchanged

V8.13 prospective Shadow persists post-consensus priorityScore, rewardPerRisk, rewardRisk, marketConsensusScore, marketConsensusSources, marketConsensusBonus, setupQuality, sectorFlow, relativeStrength and definition/comparator labels.

Important negative evidence:
- A separate pre-consensus base score/rank is not frozen.
- postScore - bonus is exact only when postScore < 100. At 100, clamp creates interval censoring; e.g. bonus 7 and final 100 means base >=93, not base=93.
- Candidate Shadow is a bounded cutline archive, so full-pool pre/post rank delta is not identifiable.
- Planned allocation is not a general Shadow-candidate field. Selected-only journal allocation cannot identify full-pool counterfactual sizing without selection bias.
- Repository/workflow receipts expose archive summaries but no durable row-level V8.13 sample usable in this run; observed sourceCount/bonus frequencies therefore remain UNKNOWN.
- Source independence remains UNKNOWN under B-184 provenance limits.

Safe future salvage if row-level D1 becomes available:
1. sourceCount/bonus frequency by scanDate;
2. exact unsaturated base only where postScore < 100;
3. saturated base as interval, never point-filled;
4. bounded comparator/tie incidence labeled bounded, never generalized to full pool.

Status: DATA_QUALITY_BLOCKED / FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY.
No forward outcomes inspected. No runtime, Production, score, threshold, ranking, capital, signal, monitoring or push change.
No FORMAL_OPTIMIZATION_CANDIDATE.
