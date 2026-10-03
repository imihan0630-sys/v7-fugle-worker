# Curriculum Coverage Return Validator Checkpoint 2026-10-03

Updated: 2026-10-03 22:51 Asia/Taipei
Status: RESEARCH_GOVERNANCE_VALIDATOR_IMPLEMENTED
Scope: 00｜研究總控室 curriculum-coverage governance only.

## Purpose

Make the frozen Coverage return contract and governance state machine executable.

## Artifacts

- `research/curriculum_coverage_return_validator_v0_1.mjs`
- `tests/test_curriculum_coverage_return_validator_v0_1.mjs`
- `shared-knowledge/CURRICULUM_COVERAGE_SPECIALIST_RETURN_INTAKE_TEMPLATE_20261003_V0_1.md`
- `shared-knowledge/curriculum_coverage_specialist_return_schema_v0_1.json`
- `shared-knowledge/CURRICULUM_COVERAGE_GOVERNANCE_STATE_MACHINE_V0_1.md`
- `shared-knowledge/curriculum_coverage_governance_state_machine_v0_1.json`

## Validator contract

The validator fails closed when:
- a required return header is missing;
- any of the 10 mandatory sections is missing or empty;
- terminal recommendation is absent, invalid or ambiguous;
- candidate/domain/artifact path mismatches the expected route;
- UNKNOWN is explicitly coerced to 0/BAD/no-event;
- a state transition is not in the frozen graph;
- a structural recommendation skips owner approval;
- a canonical structural update lacks dependency, overlap, anti-orphan, owner-approval or commit metadata.

Warnings are separate from blockers for weak source/PIT/anti-double-count wording.

## Governance

This validator:
- does not create specialist evidence;
- does not approve a COV candidate;
- does not modify curriculum counts or maturity;
- does not touch System1/System2 Formal behavior;
- does not unlock Formal Core.

Current curriculum snapshot remains:
- 22 domains;
- 354 active modules;
- 36.3% maturity baseline;
- accepted specialist returns 0 / 12.

Formal Core remains LOCKED.
