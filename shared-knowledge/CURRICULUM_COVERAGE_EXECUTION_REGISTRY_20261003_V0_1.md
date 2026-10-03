# Curriculum Coverage Execution Registry 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: COVERAGE_A_PACKETS_READY / SPECIALIST_RETURNS_PENDING
Parent audit:
`shared-knowledge/CURRICULUM_COVERAGE_AUDIT_20261003_V0_1.md`
Specialist packet:
`shared-knowledge/CURRICULUM_COVERAGE_A_SPECIALIST_VALIDATION_PACKETS_20261003_V0_1.md`

Formal Core impact: NONE
Curriculum count impact: NONE
Current canonical curriculum: 22 domains / 354 active modules
Current canonical maturity: 36.3%

## Purpose

Control-plane registry for Curriculum Coverage Audit specialist execution.
This registry tracks routing and return state; it does not itself decide module additions, scope extensions, merges or maturity changes.

## Coverage-A registry

| Candidate | Domain | Room | Current class | Specialist state | Expected return path |
|---|---|---|---|---|---|
| COV-01 | D01 | 01｜K線與型態研究室 | ACTIVE_CURRICULUM_OWNER_GAP | PENDING_SPECIALIST_RETURN | `research/COV01_D01_SPECIALIST_RETURN_V0_1.md` |
| COV-02 | D05 | 04｜波動與市場微結構研究室 | SCOPE_EXTENSION_CANDIDATE | PENDING_SPECIALIST_RETURN | `research/COV02_D05_SPECIALIST_RETURN_V0_1.md` |
| COV-04 | D07 | 06｜基本面與估值研究室 | TRUE_GAP_CANDIDATE | PENDING_SPECIALIST_RETURN | `research/COV04_D07_SPECIALIST_RETURN_V0_1.md` |
| COV-06 | D10 | 07｜產業與供應鏈研究室 | SCOPE_EXTENSION_CANDIDATE | PENDING_SPECIALIST_RETURN | `research/COV06_D10_SPECIALIST_RETURN_V0_1.md` |
| COV-07 | D12 | 09｜衍生品與國際總經研究室 | TRUE_GAP_CANDIDATE | PENDING_SPECIALIST_RETURN | `research/COV07_D12_SPECIALIST_RETURN_V0_1.md` |
| COV-10 | D20 | 13｜行為金融與市場心理研究室 | TRUE_GAP_CANDIDATE | PENDING_SPECIALIST_RETURN | `research/COV10_D20_SPECIALIST_RETURN_V0_1.md` |
| COV-11 | D21 | 14｜公司治理與內部人研究室 | TRUE_GAP_CANDIDATE | PENDING_SPECIALIST_RETURN | `research/COV11_D21_SPECIALIST_RETURN_V0_1.md` |
| COV-12 | D22 | 15｜信用市場與資本結構研究室 | SCOPE_EXTENSION_CANDIDATE | PENDING_SPECIALIST_RETURN | `research/COV12_D22_SPECIALIST_RETURN_V0_1.md` |

## Coverage-B queue

Coverage-B remains queued behind Coverage-A unless an assigned specialist room independently returns evidence earlier.

- COV-03 → 05｜法人與籌碼研究室
- COV-05 → 06｜基本面與估值研究室
- COV-08 → 11｜統計驗證與策略市場狀態研究室
- COV-09 → 12｜資產定價與因子研究室

No Coverage-B packet is promoted to structural decision by this registry.

## Intake states

Allowed execution states:
- PENDING_SPECIALIST_RETURN
- PARTIAL_EVIDENCE_RECEIVED
- RETURN_ACCEPTED_FOR_INTAKE
- COUNTERPART_OR_DEPENDENCY_REQUIRED
- DEPENDENCY_AUDIT_PENDING
- OWNER_APPROVAL_REQUIRED
- TERMINAL_DECISION_READY

Allowed terminal recommendations from specialist rooms:
- ADD_MODULE
- EXTEND_EXISTING_SCOPE
- MERGE_INTO_EXISTING
- NOT_A_GAP
- EVIDENCE_INSUFFICIENT

## Intake firewall

A specialist return is not a curriculum decision.

00｜研究總控室 must verify:
1. all required return-contract fields are present;
2. source/data claims are reproducible;
3. PIT/replay semantics are explicit;
4. existing-module overlap is tested rather than assumed;
5. anti-double-count rules are executable;
6. the proposed owner does not orphan existing capability;
7. any ADD_MODULE / EXTEND_EXISTING_SCOPE recommendation survives a new Dependency Audit and overlap recheck;
8. owner approval exists before canonical structural change.

## Canonical invariants while pending

- 22 domains.
- 354 active modules.
- maturity remains whatever the latest canonical tracker independently reports; packet creation does not change it.
- no 23rd domain.
- no automatic L0 creation until owner-approved ADD_MODULE is atomically committed.
- Formal Core LOCKED.
