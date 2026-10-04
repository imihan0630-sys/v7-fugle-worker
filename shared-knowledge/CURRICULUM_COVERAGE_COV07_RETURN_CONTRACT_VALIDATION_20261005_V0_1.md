# COV-07 Coverage Return Contract Validation 2026-10-05 V0.1

Status: PARTIAL_EVIDENCE_RECEIVED / SPECIALIST_CONTENT_COMPLETE / RETURN_CONTRACT_REPAIR_REQUIRED
Candidate: COV-07
Domain: D12
Specialist room: 09｜衍生品與國際總經研究室
Observed source return: `research/COV07_D12_SPECIALIST_RETURN_V0_1.md`
Evidence: `research/cov07_d12_tx_curve_replay_20261004_v0_1.json`
Validator: `research/curriculum_coverage_return_validator_v0_1.mjs`
Formal Core impact: NONE
Curriculum / maturity mutation: NONE

## 1. 00-room validation result

00｜研究總控室 re-read latest main and inspected the newly arrived COV-07 specialist artifact against the canonical Coverage Specialist Return contract.

The substantive research delta previously routed to Room09 is materially complete:
- immutable official TAIFEX TX contract-level historical price/OI/volume replay exists;
- source hashes and expiry/contract provenance are preserved;
- front/next/far futures-curve semantics are defined;
- calendar-spread and descriptive annualized roll-yield/carry sign conventions are frozen;
- continuous-contract construction prevents same-close look-ahead and retroactive back-adjustment leakage;
- real divergent states distinguish futures curve shape from D12-01 cash-futures basis and D12-02 OI concentration;
- expiry, session, liquidity and settlement/close fallback guards are explicit;
- outcome inspection remains closed;
- the specialist artifact contains exactly one allowed terminal recommendation token: `ADD_MODULE`.

Therefore the prior substantive readiness blocker `CONTRACT_LEVEL_FUTURES_CURVE_REPLAY_PENDING` is closed.

## 2. Why Intake is still blocked

The specialist Markdown does not conform to the executable Coverage Return contract.

Missing required header labels:
- Candidate ID
- Domain
- Specialist room
- Return artifact path
- Evidence cutoff
- Current candidate class
- Proposed terminal recommendation

Missing canonical section headings required by the validator:
- Existing-module Overlap Matrix
- Why Current Scope Is Insufficient
- Taiwan Data Feasibility
- PIT / Replay Implication
- Decision Role
- Proposed Owner
- Maturity Starting Point

The artifact contains semantically related material, but the validator intentionally requires the canonical headers/sections. Semantic similarity is not sufficient for `RETURN_CONTRACT_COMPLETE`.

00 must not silently author or infer specialist-owned fields such as evidence cutoff, decision role, proposed owner or starting maturity merely to make the validator pass.

Current legal state therefore remains:
`PARTIAL_EVIDENCE_RECEIVED`.

Readiness becomes:
`SPECIALIST_CONTENT_COMPLETE_RETURN_CONTRACT_REPAIR_REQUIRED`.

## 3. Format-only repair instruction to Room09

Do not repeat TX replay, source discovery, overlap research or outcome analysis.

Rewrite the same specialist evidence into the canonical Coverage Specialist Return template and include all seven required headers and all ten standard sections:
1. Exact Knowledge Definition
2. Existing-module Overlap Matrix
3. Why Current Scope Is Insufficient
4. Taiwan Data Feasibility
5. PIT / Replay Implication
6. Decision Role
7. Anti-double-count Rule
8. Proposed Owner
9. Maturity Starting Point
10. Terminal Recommendation

Preserve the already established evidence/hash/provenance and UNKNOWN semantics.

Retain `ADD_MODULE` only if that remains Room09's specialist recommendation after completing the canonical fields.

Run the executable validator/preflight before returning the artifact to 00.

No tracker/module/maturity/Router/Shared Master/System1/System2/Formal mutation is authorized by this repair.

## 4. ID / maturity firewall

Current active D12 identifiers are D12-01 through D12-17. D12-18 is retired and absorbed into D12-17 and must not be reused.

Repository search found no current D12-19 collision at this validation point. D12-19 is therefore only a possible future identifier if:
1. a validator-complete COV-07 specialist return is accepted for Intake;
2. ADD_MODULE survives 00 Dependency / overlap / anti-double-count / anti-orphan review;
3. the owner explicitly approves the structural mutation.

No identifier is canonically reserved or created by this receipt.

A new module must not inherit maturity from adjacent D12 modules; any starting maturity remains specialist-contract + 00-governance + owner-decision work. No maturity is changed here.

## 5. Exact next continuation

1. Room09 performs format-only repair of `research/COV07_D12_SPECIALIST_RETURN_V0_1.md` under the canonical Coverage return template.
2. Once a validator-complete artifact appears on latest main, 00 immediately performs Intake + Dependency / overlap / anti-double-count / anti-orphan review.
3. Until then COV-07 remains PARTIAL and is not added to the owner-approval queue.
4. Continue scanning latest main for other newly arrived complete specialist/source receipts rather than idling.
5. Existing protected owner gates remain protected; generic continuation is not approval.

Formal Core remains LOCKED.
