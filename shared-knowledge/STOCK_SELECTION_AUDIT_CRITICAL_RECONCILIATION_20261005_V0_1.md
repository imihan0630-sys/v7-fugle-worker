# Stock Selection Audit — Critical Reconciliation 2026-10-05 V0.1

Status: CRITICAL_TICKETS_RECONCILED / REMEDIATION_DELTAS_FROZEN
Scope: SDA-001 / SDA-004 / SDA-009 / SDA-016 / SDA-017
Formal Core impact: NONE

## Purpose

Credit controls already present on latest main and freeze only the missing deltas. Do not restart completed research.

## SDA-001 — D01/D02/D03 same-root multi-vote

Existing controls accepted:
- D03 research explicitly states EMA16/64 + Impulse remain the same price-derived family until residual value survives direct-return/trend/structure/Regime controls.
- D03 same-horizon ROC was already retired as a standalone curriculum module because it is exactly redundant with same-horizon retN.
- Pattern research already carries shared PRICE_OHLC / cross-scale redundancy warnings.
- Canonical engineering specification now exists in `SYSTEM_ALPHA_LINEAGE_AND_DOUBLE_COUNT_GUARD_V0_1.md`.

Missing delta:
- no machine implementation of `featureLineageId`, `redundancyGroupId`, `effectiveIndependentEvidenceCount` or `dedupedShadowScore` was found in current-main search;
- no end-to-end raw-vote vs deduped-vote Top6 diagnostic receipt yet exists.

Decision:
`REMEDIATION_IN_PROGRESS / RESEARCH_SEMANTICS_PARTIAL_COMPLETE / ENGINEERING_IMPLEMENTATION_PENDING`.

Route:
System 1 + System 2 build lanes; D16 validates residual incrementality. No Formal score replacement without owner approval.

## SDA-004 — D03 indicator zoo / aliases / parameter snooping

Existing controls accepted:
- D03 research/checkpoint contains a durable redundancy registry and high-redundancy classifications.
- ROC alias duplication has already caused an actual curriculum consolidation/retirement.
- EMA/MACD/Impulse independence is explicitly not assumed.
- Research Experiment Registry already states new parameter/window/classification = new experiment/version and preserves old results.

Missing delta:
- no centralized machine alias/parameter-family registry was found that can prevent duplicate registration across System 1/System 2;
- no deterministic engineering test currently proves that adding a cosmetic/monotonic alias cannot increase effective evidence count;
- promotion-grade D16 residual/OOS evidence remains distinct from conceptual redundancy knowledge.

Decision:
`REMEDIATION_IN_PROGRESS / RESEARCH_REDUNDANCY_CONTROL_EXISTS / MACHINE_ALIAS_GUARD_PENDING`.

Route:
03 research room preserves frozen family semantics; System 1/System 2 implement alias/parameter registry; D16 owns multiple-testing/incrementality.

## SDA-009 — D09 circular industry-strength reward

Existing controls accepted:
- D09 already distinguishes stock RS × sector state and studies residual sector RS.
- Research recognizes industry momentum and sector persistence as separate hypotheses.
- Formal sector gate/score has not been changed by this audit.

Missing delta:
- current-main search did not find a frozen leave-one-out / excluding-self industry-strength contract;
- no engineering diagnostic was found that reports each candidate's own contribution to the sector score used to reward that candidate;
- no Top6/rank sensitivity receipt exists comparing ordinary sector strength versus self-excluded sector strength.

Decision:
`ROUTED / RELATED_RESEARCH_EXISTS / EXACT_CIRCULARITY_REMEDIATION_PENDING`.

Route:
07 research room freezes leave-one-out semantics; System 1 implements self-contribution diagnostics; D16 compares common-support rank/selection effects.

## SDA-016 — D16 validator self-confirmation / repeated OOS

Existing controls accepted:
- Research Experiment Registry preregisters hypotheses and requires new parameter/window/classification to become a new experiment/version.
- negative/failed variants are retained in the experiment family.
- D16-CAL-01 freezes a concrete target, base-rate challenger and chronological OOS design before genuine C1 outcomes.
- D16 research explicitly rejects repeated peeking and requires preregistered evidence checkpoints or a sequentially valid method.

Missing delta:
- current-main search did not find a canonical machine `holdout-use ledger`;
- no generic immutable target/benchmark mutation-rejection mechanism was found across all experiment families;
- no generic outcome-lock was found that marks a repeatedly inspected holdout as consumed/development data.

Decision:
`REMEDIATION_IN_PROGRESS / RESEARCH_PREREGISTRATION_STRONG / GENERIC_HOLDOUT_CONSUMPTION_GUARD_PENDING`.

Route:
11 research room defines generic holdout-consumption semantics; System 1/System 2 experiment infrastructure implements ledger/lock; 00 performs independent closure. D16 may not self-close this ticket.

## SDA-017 — D18 post-hoc Regime mining

Existing controls accepted:
- System 2 Market Regime V0 is preregistered, decision-clock aware and does not outcome-tune thresholds.
- D16/D18 checkpoint explicitly says Regime is an as-of covariate, not an ex-post story.
- attribution vs policy estimands are separated.
- multiplicity family, episode dependence, MDE, exposure-matched negative control, next-session timing and no-smoothed-state-for-decisions are already frozen.
- current checkpoint explicitly reports the named System 2 regime builder is not yet executable and forbids inferring a historical regime stream from the spec.

Missing delta:
- executable market-level regime builder / immutable regimeState receipt is not yet present for the complete intended state family;
- prospective policy evidence is absent;
- generic system enforcement of minimum support / unsupported-state ABSTAIN must remain machine-visible.

Decision:
`REMEDIATION_IN_PROGRESS / RESEARCH_GOVERNANCE_STRONG / EXECUTABLE_PROSPECTIVE_EVIDENCE_PENDING`.

Route:
11 research room continues exact PIT/episode/support contract; System 2 build lane implements only the preregistered observer/builder under existing lane governance; System 1 consumes regime only after evidence/approval.

## Overall result

No CRITICAL ticket is CLOSED.

What is already done must not be repeated:
- D03 ROC alias/consolidation;
- D03 price-derived-family semantic warning;
- D16 experiment preregistration principles;
- D18 ex-ante Regime governance and policy-vs-attribution split.

Immediate engineering gaps:
1. factor lineage / de-duplicated evidence diagnostics;
2. centralized indicator alias/parameter-family enforcement;
3. D09 candidate self-contribution / leave-one-out sector diagnostic;
4. generic holdout-use / outcome-lock infrastructure;
5. executable immutable Regime observer/builder with support/UNKNOWN semantics.

Any implementation that changes Formal A/B, ranking, Top6, weight or thresholds remains Class C and requires explicit owner approval.
