# Curriculum Coverage Execution Registry 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: COVERAGE_A_AND_B_PACKETS_READY / SPECIALIST_RETURNS_PENDING
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
| COV-01 | D01 | 01｜K線與型態研究室 | ACTIVE_CURRICULUM_OWNER_GAP | PARTIAL_EVIDENCE_RECEIVED | `research/COV01_D01_SPECIALIST_RETURN_V0_1.md` |
| COV-02 | D05 | 04｜波動與市場微結構研究室 | SCOPE_EXTENSION_CANDIDATE | CANONICAL_UPDATE_COMPLETE | `research/COV_02_CLOSING_AUCTION_SPECIALIST_RETURN_20261004_V0_1.md` |
| COV-04 | D07 | 06｜基本面與估值研究室 | TRUE_GAP_CANDIDATE | CANONICAL_UPDATE_COMPLETE | `research/COV04_D07_SPECIALIST_RETURN_V0_1.md` |
| COV-06 | D10 | 07｜產業與供應鏈研究室 | SCOPE_EXTENSION_CANDIDATE | PARTIAL_EVIDENCE_RECEIVED | `research/COV06_D10_SPECIALIST_RETURN_V0_1.md` |
| COV-07 | D12 | 09｜衍生品與國際總經研究室 | TRUE_GAP_CANDIDATE | PARTIAL_EVIDENCE_RECEIVED | `research/COV07_D12_SPECIALIST_RETURN_V0_1.md` |
| COV-10 | D20 | 13｜行為金融與市場心理研究室 | TRUE_GAP_CANDIDATE | PARTIAL_EVIDENCE_RECEIVED | `research/COV10_D20_SPECIALIST_RETURN_V0_1.md` |
| COV-11 | D21 | 14｜公司治理與內部人研究室 | TRUE_GAP_CANDIDATE | PARTIAL_EVIDENCE_RECEIVED | `research/COV11_D21_SPECIALIST_RETURN_V0_1.md` |
| COV-12 | D22 | 15｜信用市場與資本結構研究室 | SCOPE_EXTENSION_CANDIDATE | PENDING_SPECIALIST_RETURN | `research/COV12_D22_SPECIALIST_RETURN_V0_1.md` |

## Coverage-B registry

Packet:
`shared-knowledge/CURRICULUM_COVERAGE_B_SPECIALIST_VALIDATION_PACKETS_20261003_V0_1.md`

| Candidate | Domain | Room | Current class | Specialist state | Expected return path |
|---|---|---|---|---|---|
| COV-03 | D06 | 05｜法人與籌碼研究室 | TRUE_GAP_CANDIDATE | CANONICAL_UPDATE_COMPLETE | `research/COV03_D06_SPECIALIST_RETURN_V0_1.md` |
| COV-05 | D08 | 06｜基本面與估值研究室 | SCOPE_EXTENSION_CANDIDATE | CANONICAL_UPDATE_COMPLETE | `research/COV05_D08_SPECIALIST_RETURN_V0_1.md` |
| COV-08 | D16 | 11｜統計驗證與策略市場狀態研究室 | SCOPE_EXTENSION_CANDIDATE | PARTIAL_EVIDENCE_RECEIVED | `research/COV08_D16_SPECIALIST_RETURN_V0_1.md` |
| COV-09 | D19 | 12｜資產定價與因子研究室 | SCOPE_EXTENSION_CANDIDATE | PARTIAL_EVIDENCE_RECEIVED | `research/COV09_D19_SPECIALIST_RETURN_V0_1.md` |

Coverage-B packet readiness is not a structural curriculum decision.

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


## Pre-Intake partial evidence — 2026-10-03

Canonical ledger:
`shared-knowledge/CURRICULUM_COVERAGE_PREINTAKE_EVIDENCE_LEDGER_20261003_V0_1.md`

- COV-02 → PARTIAL_EVIDENCE_RECEIVED
- COV-07 → PARTIAL_EVIDENCE_RECEIVED
- COV-08 → PARTIAL_EVIDENCE_RECEIVED
- All other COV candidates remain PENDING_SPECIALIST_RETURN.
- Partial evidence is not an accepted specialist return and does not authorize curriculum structural change.


## Pre-Intake second harvest — 2026-10-03

Additional partial-evidence states:
- COV-01 → PARTIAL_EVIDENCE_RECEIVED
- COV-09 → PARTIAL_EVIDENCE_RECEIVED
- COV-10 → PARTIAL_EVIDENCE_RECEIVED

Combined partial-evidence set:
COV-01, COV-02, COV-07, COV-08, COV-09, COV-10.

Accepted specialist returns remain 0 / 12. No curriculum structural change is authorized.


## Pre-Intake third harvest — 2026-10-03

- COV-11 → PARTIAL_EVIDENCE_RECEIVED from existing D21 voting-rights / shareholder-meeting / PIT governance evidence.
- Combined partial-evidence set: COV-01, COV-02, COV-07, COV-08, COV-09, COV-10, COV-11.
- Accepted specialist returns remain 0 / 12.
- No curriculum structural change is authorized.


## Pre-Intake fourth harvest — 2026-10-03

- COV-06 → PARTIAL_EVIDENCE_RECEIVED from existing D10 named-edge graph, PIT edge provenance, bottleneck and transmission contracts.
- Combined partial-evidence set: COV-01, COV-02, COV-06, COV-07, COV-08, COV-09, COV-10, COV-11.
- Pending specialist returns without accepted partial evidence: COV-03, COV-04, COV-05, COV-12.
- Accepted specialist returns remain 0 / 12.
- No curriculum structural change is authorized.


## Remaining Coverage evidence deficits — 2026-10-03

Canonical matrix:
`shared-knowledge/CURRICULUM_COVERAGE_PENDING_EVIDENCE_DEFICIT_MATRIX_20261003_V0_1.md`

Remaining candidates without accepted partial evidence:
- COV-03 / D06 → direct retail/natural-person observable + Taiwan PIT source contract.
- COV-04 / D07 → payout/coverage/sustainability semantics + accounting/event clocks.
- COV-05 / D08 → P/S or EV/Sales formula + numerator/denominator/PIT ownership contract.
- COV-12 / D22 → debt seniority/collateral/recovery taxonomy + Taiwan document feasibility.

These are dispatch deltas only. States remain PENDING_SPECIALIST_RETURN until qualifying evidence arrives.


## Coverage specialist return intake contract — 2026-10-03

Canonical template:
`shared-knowledge/CURRICULUM_COVERAGE_SPECIALIST_RETURN_INTAKE_TEMPLATE_20261003_V0_1.md`

Machine-readable schema:
`shared-knowledge/curriculum_coverage_specialist_return_schema_v0_1.json`

A specialist return cannot become RETURN_ACCEPTED_FOR_INTAKE unless all fixed 10 fields, Taiwan data feasibility, PIT/replay, overlap, anti-double-count, owner and exactly one terminal recommendation are complete.


## Coverage governance state machine — 2026-10-03

Canonical contract:
`shared-knowledge/CURRICULUM_COVERAGE_GOVERNANCE_STATE_MACHINE_V0_1.md`

Machine-readable state graph:
`shared-knowledge/curriculum_coverage_governance_state_machine_v0_1.json`

No COV candidate may skip a listed governance transition. Partial evidence and specialist recommendations remain non-terminal until the required intake, dependency, overlap, anti-orphan and owner gates are satisfied.


## Canonical snapshot reconciliation — 2026-10-03

Authoritative tracker:
`research/stock_market_learning_tracker_v0_1.json`

Reconciliation receipt:
`shared-knowledge/CURRICULUM_COVERAGE_CANONICAL_SNAPSHOT_RECONCILIATION_20261003_V0_1.md`

Current canonical snapshot:
- 22 domains
- 354 active modules
- weighted maturity 38.2%

The prior 36.3% registry value was a historical snapshot, not a current maturity claim.

Executable validator merged in PR #407:
- `research/curriculum_coverage_return_validator_v0_1.mjs`
- `tests/test_curriculum_coverage_return_validator_v0_1.mjs`
- `.github/workflows/curriculum-coverage-validator.yml`

COV states are unchanged by this reconciliation.


## COV-04 / COV-05 formal Intake — 2026-10-04

Canonical audit:
`shared-knowledge/CURRICULUM_COVERAGE_COV04_COV05_INTAKE_DEPENDENCY_AUDIT_20261004_V0_1.md`

Machine audit:
`shared-knowledge/curriculum_coverage_cov04_cov05_intake_dependency_audit_20261004_v0_1.json`

Updated preflight receipt:
`research/curriculum_coverage_intake_preflight_receipt_20261004_v0_2.json`

Results:
- COV-04 → contract complete → ADD_MODULE survives Dependency / overlap / anti-orphan review → OWNER_APPROVAL_REQUIRED.
- COV-05 → contract complete → EXTEND_EXISTING_SCOPE into D08-06 survives Dependency / overlap / anti-orphan review → OWNER_APPROVAL_REQUIRED.
- No canonical structural mutation has been executed.
- COV-03 and COV-12 remain PENDING_SPECIALIST_RETURN.
- Accepted formal specialist returns: 2 / 12.
- Audit-time tracker snapshot: 22 domains / 354 active modules / 42.1% weighted maturity. The tracker remains authoritative and may advance independently.


## COV-04 / COV-05 owner approval + canonical update — 2026-10-04

Owner decision: **APPROVED BOTH**.

State transitions:
- COV-04: OWNER_APPROVAL_REQUIRED → TERMINAL_DECISION_READY → CANONICAL_UPDATE_COMPLETE.
- COV-05: OWNER_APPROVAL_REQUIRED → TERMINAL_DECISION_READY → CANONICAL_UPDATE_COMPLETE.

Canonical execution:
- COV-04 created D07-34 `Dividend / Payout Policy & Sustainability股利／配發政策與永續性` at L0 / 0%.
- COV-05 extended D08-06 to `EV/EBITDA／EV/Sales／P/S Enterprise & Sales Multiples企業價值與營收倍數`; D08-06 remains L2 / 40%, and the new sales-multiple sub-capabilities do not inherit validated maturity.

Post-update canonical tracker:
- 22 domains
- 355 active modules
- 42.3% weighted maturity
- D07 = 34 modules / 14.1%
- D08 = 19 modules / 27.4%

Receipts:
- `shared-knowledge/CURRICULUM_COV04_COV05_CANONICAL_UPDATE_RECEIPT_20261004_V0_1.md`
- `shared-knowledge/curriculum_cov04_cov05_canonical_update_receipt_20261004_v0_1.json`

No System1/System2 Formal change. Formal Core remains LOCKED.


## COV-03 formal Intake + Dependency Audit — 2026-10-04

Canonical audit:
`shared-knowledge/CURRICULUM_COVERAGE_COV03_INTAKE_DEPENDENCY_AUDIT_20261004_V0_1.md`

Machine audit:
`shared-knowledge/curriculum_coverage_cov03_intake_dependency_audit_20261004_v0_1.json`

Result:
- COV-03 formal return is accepted for Intake.
- `ADD_MODULE` survives Dependency Audit, overlap recheck, anti-double-count and anti-orphan review.
- Proposed module: **D06-19 Retail / Individual Investor Participation & Flow（散戶／自然人參與與流向）**.
- Proposed starting maturity: **L0 / 0%**.
- The supporting L1/20% artifact is explicitly superseded for structural execution by the canonical return plus the new-module maturity firewall.
- D06-17 is retired history absorbed into D06-16 and is not reusable.
- Domestic natural-person stock×date directional flow remains UNKNOWN / source-gated.
- No independent directional vote is authorized; initial role is context / validation / supportive.

State:
**OWNER_APPROVAL_REQUIRED**

Audit-time authoritative tracker:
- domains: 22
- active modules: 355
- weighted maturity: 43.5%
- D06 remains unchanged until approval.

COV-12 remains PENDING_SPECIALIST_RETURN.
No tracker/module/router/master/Formal mutation was performed by this audit.


## COV-03 owner approval + canonical update — 2026-10-04

Owner decision: **APPROVED**.

State transitions:
- COV-03: OWNER_APPROVAL_REQUIRED → TERMINAL_DECISION_READY → CANONICAL_UPDATE_COMPLETE.

Canonical execution:
- Created D06-19 `Retail / Individual Investor Participation & Flow（散戶／自然人參與與流向）` at L0 / 0%.
- Canonical maturity firewall: earlier supporting L1/20% is not used; new module starts L0/0%.
- Direct-retail identity is separated from margin/day-trade/odd-lot/broker/residual proxies.
- Domestic natural-person stock×date directional flow remains UNKNOWN/source-gated.
- Initial decision role is context / validation / supportive; no independent directional Alpha vote.

Post-update canonical tracker snapshot:
- 22 domains
- 356 active modules
- 43.4% weighted maturity
- D06 = 18 modules / 45.6%

COV-12 remains PENDING_SPECIALIST_RETURN.
No System1/System2 Formal change. Formal Core remains LOCKED.


## COV-02 formal Intake + Dependency Audit — 2026-10-04

Canonical audit:
`shared-knowledge/CURRICULUM_COVERAGE_COV02_INTAKE_DEPENDENCY_AUDIT_20261004_V0_1.md`

Machine audit:
`shared-knowledge/curriculum_coverage_cov02_intake_dependency_audit_20261004_v0_1.json`

Result:
- formal 10-field specialist return accepted for Intake;
- `EXTEND_EXISTING_SCOPE → D05-06` survives Dependency Audit, overlap recheck, PIT/replay recheck, anti-double-count and anti-orphan review;
- proposed name: `Opening / Closing Auction & Auction Imbalance（開收盤集合競價與競價不平衡）`;
- module count unchanged;
- D05-06 maturity unchanged by this governance action;
- historical pre-close imbalance remains UNKNOWN where timestamped observations do not exist;
- no independent auction alpha vote is authorized.

Current state:
**OWNER_APPROVAL_REQUIRED**

Formal Core remains LOCKED.


## COV-02 owner approval + canonical update — 2026-10-04

Owner decision: **APPROVED**.

State transitions:
- COV-02: OWNER_APPROVAL_REQUIRED → TERMINAL_DECISION_READY → CANONICAL_UPDATE_COMPLETE.

Canonical execution:
- D05-06 renamed/expanded to `Opening / Closing Auction & Auction Imbalance（開收盤集合競價與競價不平衡）`.
- D05-06 remains L2 / 40%.
- active module count unchanged.
- historical pre-close trial/imbalance remains UNKNOWN when timestamped evidence is absent.
- final close/volume and generic EOD volume are not accepted substitutes.
- no independent auction directional Alpha vote.

Formal Core remains LOCKED. No System1/System2 Formal change.


Canonical receipt:
- `shared-knowledge/CURRICULUM_COV02_CANONICAL_UPDATE_RECEIPT_20261004_V0_1.md`
- `shared-knowledge/curriculum_cov02_canonical_update_receipt_20261004_v0_1.json`


## Late-afternoon Coverage registry reconciliation — 2026-10-04

Latest canonical Tracker snapshot:
- 22 domains;
- 356 active modules;
- 45.6% weighted maturity;
- tracker updatedAt = 2026-10-04T16:47:00+08:00.

This reconciliation corrects stale summary/table fields only. It does not change any specialist recommendation or curriculum structure.

Canonical COV execution states:
- CANONICAL_UPDATE_COMPLETE: COV-02, COV-03, COV-04, COV-05.
- PARTIAL_EVIDENCE_RECEIVED: COV-01, COV-06, COV-07, COV-08, COV-09, COV-10, COV-11.
- PENDING_SPECIALIST_RETURN: COV-12 only.

Formal specialist returns physically present on main:
- COV-02;
- COV-03;
- COV-04;
- COV-05.

No formal specialist return exists yet for COV-01, COV-06, COV-07, COV-08, COV-09, COV-10, COV-11 or COV-12.
Partial evidence must not be mislabeled as a specialist return.

Formal Core remains LOCKED.


## COV-08 / COV-09 return-readiness reconciliation — 2026-10-04

Both candidates remain formally `PARTIAL_EVIDENCE_RECEIVED` because Coverage governance requires a committed specialist return before 00 Intake.

### COV-08 — D16 dependence-aware resampling

Readiness:
`SPECIALIST_RETURN_READY_PENDING_TERMINAL_RECOMMENDATION`.

Already established:
- naive iid inference is invalid under regime persistence / overlapping horizons / position carry / volatility clustering / common shocks;
- stationary and moving/block bootstrap are accepted candidate dependence-aware methods;
- HAC/cluster-robust inference remains a simpler alternative when assumptions fit;
- block length/bandwidth is an inference parameter and must be documented/sensitivity-tested, never outcome-tuned;
- multiple resampling variants are diagnostics, not multiple evidence votes;
- D16-06 is the natural module-level owner.

Exact remaining specialist delta:
1. freeze when cluster-robust/HAC is enough versus block bootstrap required;
2. freeze minimum sample / effective-sample / block-length sensitivity reporting;
3. give exactly one terminal recommendation;
4. commit `research/COV08_D16_SPECIALIST_RETURN_V0_1.md`.

No maturity or Formal change.

### COV-09 — D19 multi-factor benchmark models

Readiness:
`SPECIALIST_RETURN_READY_PENDING_TERMINAL_RECOMMENDATION`.

Already established:
- D19-15 owns benchmark construction/methodology;
- D19-01 owns benchmark-relative alpha/residual interpretation;
- D19-10 owns exposure/multicollinearity/spanning diagnostics;
- Fama-French / profitability-investment / q-style evidence and Taiwan heterogeneity are already researched;
- benchmark vintage, PIT universe, corporate actions, delistings, costs and multiple testing are required;
- benchmark models are risk-adjustment/attribution tools, not automatic strategy votes.

Exact remaining specialist delta:
1. freeze D19-15 as benchmark-model construction owner versus D19-01/D19-10 consumers;
2. state whether Taiwan inference requires Taiwan-reconstructed benchmark portfolios rather than imported U.S. factors;
3. give exactly one terminal recommendation;
4. commit `research/COV09_D19_SPECIALIST_RETURN_V0_1.md`.

No maturity or Formal change.


## COV-01 return-readiness reconciliation — 2026-10-04

COV-01 remains formally `PARTIAL_EVIDENCE_RECEIVED` because Coverage governance requires a committed specialist return before 00 Intake.

Readiness:
`SPECIALIST_RETURN_READY_PENDING_TERMINAL_RECOMMENDATION`.

Already established by Room01:
- Platform / Bull Flag / Triangle / Pennant / Wedge / High Tight Flag / Cup / VCP families;
- latent-geometry and cross-pattern de-duplication;
- named patterns are interpretation labels, not independent votes;
- causal confirmation/failure lifecycle and repaint-safe clocks;
- D01-05 owns breakout/failure lifecycle;
- D01-08 retains VCP specialization;
- morphology, breakout, volume confirmation and volatility contraction are separate layers;
- no hindsight visual labeling or current-data backfill.

Exact remaining specialist delta:
1. explicitly compare D01-07 as umbrella continuation/base morphology owner versus a distinct umbrella owner;
2. prove whether D01-07 can absorb platform/flag/triangle/wedge/base families without semantic incoherence;
3. state whether any unique data/replay/decision contract justifies a new module;
4. give exactly one terminal recommendation;
5. commit `research/COV01_D01_SPECIALIST_RETURN_V0_1.md`.

No maturity, module-count or Formal change.
