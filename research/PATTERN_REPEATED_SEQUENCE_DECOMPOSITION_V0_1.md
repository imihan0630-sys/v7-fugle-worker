# D01 DL-024 — Repeated-Cycle Sequence Decomposition V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / FORMAL_CORE_LOCKED

## 1. Research question

DL-023 preserves repeated source-event groups, counts, exposure and gap times.

Does the full repeated-event sequence add information beyond those summaries?

Under the frozen repeated-cycle state machine:

READY_FOR_RETURN
-> RETURN_GROUP
-> OPEN_RETURN
-> RECLAIM_GROUP
-> READY_FOR_RETURN

the coarse RETURN/RECLAIM alternation is structurally constrained.

Therefore a raw sequence string such as:
RETURN -> RECLAIM -> RETURN -> RECLAIM
is mostly a deterministic restatement of completedCycleCount + openCycle.

## 2. Where residual sequence information can still exist

Failure is nested severity inside a return episode.

Different paths can share:
- recurrentReturnGroupCount;
- recurrentFailureGroupCount;
- recurrentReclaimGroupCount;
- completedRepeatedCycleCount;
- openRepeatedCycle;
- exposure;
- recurrent group timestamps/gaps

but differ in WHICH return cycle carries failure severity.

Example:

Path A:
cycle 2 return is immediate PARENT_FAILURE.

Path B:
cycle 3 return is immediate PARENT_FAILURE.

Counts and coarse alternation can match.
Failure-placement memory differs.

A second distinction:
failure may occur:
- on the same source group as reentry;
- later, after an earlier reentry and before reclaim.

That severity-escalation lag is not represented by a simple failure count.

## 3. Frozen decomposition

S0_COARSE_ALTERNATION
- return/reclaim state-machine progression.
Mostly deterministic from cycle count/open-cycle state.

S1_FAILURE_PLACEMENT
For each repeated cycle:
- NO_FAILURE;
- FAILURE_ON_RETURN_GROUP;
- FAILURE_AFTER_REENTRY;
- OPEN_RETURN_NO_FAILURE_YET;
- OPEN_RETURN_FAILURE_OBSERVED.

S2_SEVERITY_TIMING
- eligible-session lag from return start to first failure severity within that cycle;
- null if no failure through reclaim/asOf.

S3_FULL_SOURCE_GROUP_LEDGER
- exact ordered recurrent source groups for audit/replay.

Predictive research, if ever opened, should test S1/S2 beyond DL-023 R1/R2 summaries.
S3 is audit authority first, not a factor family.

## 4. No arbitrary sequence labels

Rejected:
- "double fakeout";
- "triple rejection";
- "choppy breakout";
- "strong reclaim sequence";
- any post-outcome named sequence catalogue.

These are derived interpretations and create hidden multiple testing.

Use source-group identities + severity placement/timing instead.

## 5. Coarse-order redundancy

Given:
- completedRepeatedCycleCount;
- openRepeatedCycle;
- valid pairing state;

the RETURN/RECLAIM alternation is known by construction.

Therefore:
COARSE_SEQUENCE_ORDER_NOVELTY = NONE.

Only severity placement/timing can remain a residual sequence representation in v0.1.

## 6. Same-count / same-gap counterexample

Two synthetic episodes may have identical recurrent group dates:

t1 RETURN
t2 RECLAIM
t3 RETURN
t4 RECLAIM

and both have:
- 2 return groups;
- 2 reclaim groups;
- 1 failure group;
- same exposure;
- same gap vector.

If failure is attached to t1 in one episode and t3 in the other,
R1/R2 summaries match but severity placement differs.

This proves representation novelty relative to counts + unlabeled gaps.

It does NOT prove predictive value.

## 7. Within-cycle escalation

A cycle can begin:
RETURN_GROUP at t1 with PARENT_REENTRY only.

Later at t2 before reclaim:
PARENT_FAILURE severity may occur.

This later failure group is not a second return-cycle start.

Store:
- cycleOrdinal;
- returnStartedAt;
- failureFirstObservedAt;
- failureEscalationLagEligibleSessions;
- reclaimAt.

This retains severity progression without inflating cycle count.

## 8. Censoring

If a cycle remains open at asOf:
- severity may still be NO_FAILURE_YET;
- reclaimAt is null;
- future failure/reclaim cannot be written into current parent.

Open-cycle severity state is right-censored through asOf.

UNKNOWN path completeness remains distinct from open/no-failure-yet.

## 9. Minimal sequence candidate

RSEQ_MIN_V0_1:
- cycleOrdinal;
- failurePlacementClass;
- failureEscalationLagEligibleSessions;
- open/closed cycle state.

Do not add raw categorical names beyond these frozen semantics.

## 10. Current decision

COARSE_RETURN_RECLAIM_ORDER =
DETERMINISTIC / NON_NOVEL.

FAILURE_PLACEMENT_TIMING =
PATH_MEMORY_CANDIDATE_RELATIVE_TO_COUNTS_GAPS.

FULL_SEQUENCE_LEDGER =
AUDIT_REPLAY_AUTHORITY / NOT_DEFAULT_PREDICTOR.

SEQUENCE_ALPHA =
UNKNOWN.

OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 11. Exact next continuation

1. Build an outcome-blind sequence decomposition helper.
2. Add same-count/same-gap/different-failure-placement counterexamples.
3. Keep full ledger for audit even if minimal predictive representation is smaller.
4. Next science: landmark/risk-set semantics for repeated-cycle predictors to prevent future leakage and immortal-time selection.
5. No outcome join / no Formal change.
