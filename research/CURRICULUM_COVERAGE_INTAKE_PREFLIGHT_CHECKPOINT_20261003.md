# Curriculum Coverage Intake Preflight Checkpoint 2026-10-03

Status: RESEARCH_GOVERNANCE_PREFLIGHT_IMPLEMENTED
Scope: 00｜研究總控室 COV（課綱覆蓋候選）收件治理。

## Purpose

Automatically scan the 12 canonical specialist-return paths and run the frozen return-contract validator against every return that is actually present.

## Artifacts

- `research/curriculum_coverage_intake_preflight_v0_1.mjs`
- `tests/test_curriculum_coverage_intake_preflight_v0_1.mjs`
- `.github/workflows/curriculum-coverage-intake-preflight.yml`

Dependency:
- `research/curriculum_coverage_return_validator_v0_1.mjs`

## Fail-closed semantics

- Missing return file = NOT_PRESENT, not failure.
- Present + valid return = RETURN_CONTRACT_COMPLETE.
- Present + invalid return = CI failure.
- Contract complete never means RETURN_ACCEPTED_FOR_INTAKE.
- The preflight never changes registry state, module count, maturity, owner mapping or Formal Core.

## Canonical return routes

COV-01/D01, COV-02/D05, COV-03/D06, COV-04/D07, COV-05/D08, COV-06/D10,
COV-07/D12, COV-08/D16, COV-09/D19, COV-10/D20, COV-11/D21, COV-12/D22.

## Current governance state at implementation

- 12 routes registered.
- 8 candidates have PARTIAL_EVIDENCE_RECEIVED in the governance registry.
- 4 candidates remain PENDING_SPECIALIST_RETURN without accepted partial evidence.
- Formal specialist returns accepted by 00 room: 0 / 12.
- No curriculum structural change.
- Formal Core remains LOCKED.
