# D16 SDA-022 NC-T01 Strategy-Executable Witness Firewall 2026-10-08 V0.1

Updated: 2026-10-08 Asia/Taipei
Status: RESEARCH_ONLY / STRATEGY_READINESS_FALSE_PROMOTION_CONFIRMED / CORRECTION_ACCEPTANCE_FROZEN
Owner room: 11｜統計驗證與策略市場狀態研究室
Audit family: SDA-022
Affected oracle: S22-T13 / S22-T14 / S22-T16
Formal Core impact: NONE

## Purpose

Prevent a continuity-ready symbol from being promoted into a physically executable System2 strategy witness when strategy-required evidence is still incomplete.

The core firewall is:

`CONTINUITY_READY != STRATEGY_EVIDENCE_COMPLETE`.

and:

`STRATEGY_EVIDENCE_COMPLETE != RANK_ELIGIBLE`.

These are three different evidence claims.

## 1. Independent code readback

Current `system2/runtime/nct01_physical_receipt_v0_1.mjs` defines executableWitnesses using:
- state = ACCOUNTED;
- replayState = READY;
- continuityBindingState = READY;
- zero continuity blockers.

It does not require:
- strategyValidity != INCOMPLETE;
- or any equivalent strategy-evidence-complete predicate.

Current requiredInputsState becomes READY when:
- run is COMPLETE;
- baseUniverseCount > 0;
- accountedCount == eligibleCount;
- continuity-ready witness count > 0.

Current executionState becomes EXECUTED when:
- run is COMPLETE;
- continuity-ready witness count > 0.

Therefore one continuity-ready but strategy-INCOMPLETE witness can currently cause:
- requiredInputsState = READY;
- executionState = EXECUTED;
- candidateGenerationExecutable = true.

If candidate list is empty and other gates pass, the receipt can classify:
- LEGITIMATE_ZERO_PICK;
- PHYSICALLY_INDEPENDENT_PATH_OBSERVED.

This is a genuine semantic defect.

## 2. Four strategy-validity states

Canonical strategy evaluator states:
- VALID;
- WEAKENING;
- INVALIDATED;
- INCOMPLETE.

Interpretation for NC-T01 evidence completeness:

### VALID
Required evidence is complete and no hard invalidation/adverse-primary override blocks validity.

`EVIDENCE_COMPLETE_STRATEGY_EVALUATED = true`.

### WEAKENING
Required evidence is complete; adverse primary evidence weakens the thesis.

`EVIDENCE_COMPLETE_STRATEGY_EVALUATED = true`.

This is not rank-equivalent to VALID.

### INVALIDATED
Required evidence is complete enough to hit a hard invalidation.

`EVIDENCE_COMPLETE_STRATEGY_EVALUATED = true`.

This can be a legitimate evaluated rejection.

### INCOMPLETE
Required evidence is missing/unknown.

`EVIDENCE_COMPLETE_STRATEGY_EVALUATED = false`.

This state may never become a legitimate zero-pick witness.

## 3. Three witness layers

### W0 — CONTINUITY_READY_WITNESS

Requires:
- ACCOUNTED;
- replay READY;
- continuity READY;
- zero continuity blockers.

W0 proves replay/continuity admissibility only.

### W1 — STRATEGY_EXECUTABLE_WITNESS

Requires W0 plus:
- strategyValidity in {VALID, WEAKENING, INVALIDATED};
- strategyValidity != INCOMPLETE;
- strategy evaluation object produced under the frozen strategy contract;
- missing-required-evidence count = 0 or equivalent frozen proof;
- evaluation identity/hash bound to the same symbol/replay/factor snapshot.

W1 proves the strategy could actually be evaluated from its own required inputs.

### W2 — RANK_ELIGIBLE_WITNESS

Requires W1 plus the frozen ranking admission semantics:
- strategyValidity = VALID;
- entryReadiness satisfies the ranking/admission contract;
- rank inputs complete.

W2 is not required merely to prove physical independent strategy execution.

NC-T01 first physical independence is a W1 claim.
RANK-01 later is a W2 claim.

## 4. Why only requiring VALID would also be wrong

If every required input is present and the frozen strategy returns INVALIDATED or WEAKENING, the strategy was still genuinely evaluated.

Forcing NC-T01 to require only VALID would:
- condition physical-execution evidence on a favorable strategy state;
- bias the admissible sample toward bullish/qualifying states;
- turn hard-invalidated observations into apparent data failures;
- distort zero-pick and rejection denominators.

Therefore:
- physical execution requires W1;
- ranking requires W2.

For the first narrow NC-T01 witness, a VALID example is operationally preferable because it exercises the full positive path, but it is not the semantic definition of input completeness.

## 5. Required receipt accounting

Candidate-universe provenance must separately report:
- BASE_UNIVERSE_COUNT;
- ACCOUNTED_COUNT;
- CONTINUITY_READY_WITNESS_COUNT;
- STRATEGY_EXECUTABLE_WITNESS_COUNT;
- STRATEGY_VALID_COUNT;
- STRATEGY_WEAKENING_COUNT;
- STRATEGY_INVALIDATED_COUNT;
- STRATEGY_INCOMPLETE_COUNT;
- RANK_ELIGIBLE_WITNESS_COUNT if ranking is evaluated later.

Do not merge these counts.

## 6. requiredInputsState semantics

For NC-T01 physical independence:

`requiredInputsState = READY`

requires:
- runComplete = true;
- base/eligible/accounted identity satisfies the frozen accounting contract;
- at least one W1 STRATEGY_EXECUTABLE_WITNESS;
- all other T11/T12/T15 evidence prerequisites are separately satisfied where applicable.

A W0-only witness cannot promote requiredInputsState.

## 7. executionState semantics

`executionState = EXECUTED`

requires:
- at least one W1 witness entered the actual frozen SHORT_MOMENTUM evaluator;
- the evaluator emitted a terminal non-INCOMPLETE strategyValidity state;
- evaluation identity belongs to the same coherent evidence cut.

If every W0 witness is strategy INCOMPLETE:
- executionState = BLOCKED_INPUTS;
- candidateGenerationExecutable = false.

## 8. Legitimate zero-pick semantics

A zero-pick day is legitimate only when:
- at least one W1 witness exists;
- no W1 evaluation produced an admitted candidate under the frozen strategy semantics;
- no hidden System1 dependency;
- no missing required typed digest;
- no runtime failure;
- no capacity/global-priority substitution;
- all applicable physical evidence gates pass.

Examples of legitimate evaluated zero-pick:
- all W1 witnesses INVALIDATED;
- all W1 witnesses WEAKENING/WATCH under frozen policy;
- VALID witnesses exist but none meet the frozen entry/admission state.

Examples that are NOT zero-pick:
- all continuity-ready witnesses are INCOMPLETE;
- continuity receipt missing;
- required family unknown;
- strategy evaluator did not run;
- hidden fallback audit incomplete;
- typed provenance incomplete.

## 9. Candidate identity firewall

Any generated candidate counted in the NC-T01 receipt must trace to a W1 witness from the same coherent evidence cut.

A decision snapshot from:
- an INCOMPLETE strategy row;
- a different runner head;
- a different continuity receipt;
- a different factor snapshot;
may not enter generatedCandidates.

Required mapping:
`generatedCandidateSymbol -> W1 witness -> evaluationHash -> factorSnapshotHash -> replayHash -> continuityReceiptHash`.

## 10. Required correction regressions

### SR-T01 all continuity-ready, all strategy INCOMPLETE
Expected:
- continuityReadyWitnessCount > 0;
- strategyExecutableWitnessCount = 0;
- requiredInputsState = INCOMPLETE;
- executionState = BLOCKED_INPUTS;
- candidateGenerationExecutable = false;
- zeroPickDisposition = INPUT_INCOMPLETE;
- resultClassification = EVIDENCE_INCOMPLETE.

### SR-T02 mixed W0, one VALID W1
Expected:
- strategyExecutableWitnessCount >= 1;
- physical execution may proceed subject to all other gates.

### SR-T03 mixed W0, one INVALIDATED W1
Expected:
- strategy execution is proven;
- zero candidate can be legitimate if all other gates pass;
- do not relabel as data failure.

### SR-T04 mixed W0, one WEAKENING W1
Expected:
- strategy execution is proven;
- ranking eligibility remains separate.

### SR-T05 continuity changes only, strategy remains INCOMPLETE
Expected:
- no promotion to W1 / physical independence.

### SR-T06 one W1 candidate but candidate evaluation identity does not match W1 witness
Expected:
- EVIDENCE_INCOMPLETE.

### SR-T07 W1 exists but generated candidate comes from INCOMPLETE symbol
Expected:
- fail closed.

### SR-T08 strategyValidity missing/unknown
Expected:
- treat as INCOMPLETE, not executable.

### SR-T09 all W1 hard-invalidated
Expected:
- execution can be EXECUTED;
- zero-pick may be legitimate if all T11-T15 gates pass.

### SR-T10 W1 VALID but hidden-fallback gate UNKNOWN
Expected:
- physical result remains EVIDENCE_INCOMPLETE.

### SR-T11 W1 VALID but real continuity digest missing
Expected:
- no physical PASS.

### SR-T12 W1 VALID, complete coherent hash chain, hidden-fallback PASS, real continuity PASS
Expected:
- eligible for S22-T13/T14/T16 evaluation.

## 11. D16 denominator consequences

### D16-09 coverage / zero-pick

Preserve separate counts:
- continuity-ready;
- strategy-executable;
- strategy-incomplete;
- evaluated-zero-pick.

Never divide zero-pick by continuity-ready dates/symbols when strategy completeness is not satisfied.

### D16-11 provenance

Strategy evaluation identity is a separate provenance layer from replay and continuity identity.

### D16-14 generation alignment

Physical generation identity must bind strategy executable witnesses, not merely continuity-ready witnesses.

### SDA-022

A physical independence claim requires one coherent cut where:
- selection dependency is absent;
- data/replay/continuity is admissible;
- strategy evidence is complete enough to evaluate;
- the strategy actually executes.

## 12. Maturity decision

No D16 maturity change.

This defect blocks S22-T13/T14/T16 physical promotion until corrected and physically re-run.

D16-14 remains L3/60.
D16-09 remains L4/80 historically for its broader coverage framework, but this new NC-T01 zero-pick subclaim is NOT promotion-grade until SR-T01~T12 are satisfied.

## Exact next

1. Route/observe the engineering correction without Room11 modifying runtime.
2. Verify W0/W1/W2 counts are distinct.
3. Verify strategyValidity=INCOMPLETE can never promote requiredInputsState/executionState.
4. Verify INVALIDATED/WEAKENING are evaluated states but not rank-equivalent to VALID.
5. Combine with CORR-005 hidden-fallback evidence and real CLEAR_NO_ACTION continuity.
6. Recompute S22-T13/T14/T16 on one coherent immutable physical cut.
