# Stock Selection Audit — Remaining HIGH Reconciliation 2026-10-05 V0.1

Status: REMAINING_HIGH_TICKETS_RECONCILED / MISSING_DELTAS_FROZEN
Scope: SDA-002 / SDA-008 / SDA-010 / SDA-012 / SDA-013 / SDA-018 / SDA-019
Formal Core impact: NONE
Parent queue: `shared-knowledge/STOCK_SELECTION_AUDIT_QUEUE.md`

## SDA-002 — D01 pattern hindsight / future-pivot confirmation

Existing controls accepted:
- D01 now freezes causal lifecycle state and explicitly separates root, structural version, role episode, first valid test opportunity and later response.
- later retest outcome is forbidden from defining role-flip eligibility.
- one breakout/root remains one causal unit even when it has multiple descriptors/episodes.
- D01 already separates baseline confounders from post-break mediators/selection variables and hands common-support inference to D16.
- COV-01 accepted pattern ontology, latent geometry, cross-pattern de-dup and repaint-safe confirmation/failure timing.

Missing delta:
- several recent D01 adversarial research tests are authored but still marked TEST_EXECUTION_PENDING in checkpoint state;
- generic System 1/System 2 future-pivot/episode lineage enforcement remains part of SDA-001 engineering;
- prospective outcome evidence remains unopened.

Decision:
`REMEDIATION_IN_PROGRESS / CAUSAL_PATTERN_SEMANTICS_STRONG / TEST_EXECUTION_AND_SYSTEM_GUARD_PENDING`.

## SDA-008 — D07/D08 financial and valuation PIT-vintage / historical-universe leakage

Existing controls accepted:
- D08 has a survivorship-safe TWSE historical-universe registry rather than current-list-only reconstruction.
- 44 monthly scan dates are preregistered before outcomes and the cohort has immutable hashes.
- D08 outcome join remains closed until date-specific valuation/control coverage and missingness receipts are materialized.
- current-list-only historical reconstruction is explicitly prohibited.
- D07/D08 research preserves source/filing availability blockers instead of treating later/revised values as historical truth.

Missing delta:
- complete date-specific D08 valuation/control snapshots and coverage receipts are still pending;
- TPEx historical inference remains outside scope until a PIT-safe history lane is verified;
- D07 general-industry prospective filing/CFO/balance-sheet coverage remains incomplete;
- no single System 1-wide generic financial/valuation sourceVintage + knownAt + universeVersion guard was found covering all future consumers.

Decision:
`REMEDIATION_IN_PROGRESS / D08_SURVIVORSHIP_GUARD_STRONG / CROSS_DOMAIN_FINANCIAL_VINTAGE_COVERAGE_PENDING`.

## SDA-010 — D10/D17 exposure-graph hindsight and structural/event double count

Existing controls accepted:
- H10 governance already freezes the producer/consumer split: D10 structural exposure -> D17 event attribution.
- D17 must consume structural exposure rather than recreate it as a second vote.
- COV-06 research has already identified effective-dated topology, critical-node, alternate-path, substitution and resilience semantics as the correct D10-01 extension.

Protected dependency:
- H10 remains OWNER_APPROVAL_REQUIRED for canonical scope wording.
- COV-06 remains OWNER_APPROVAL_REQUIRED for D10-01 scope extension.
- generic continuation does not approve either gate.

Missing delta:
- canonical effective-dated exposureGraphId/versioned graph implementation cannot be treated as accepted Formal/canonical scope before protected owner decisions;
- prospective pre-event graph coverage and divergent substitution/alternate-path evidence remain incomplete;
- System 1/System 2 shared producer/consumer receipt reuse still needs machine enforcement when the graph is implemented.

Decision:
`BLOCKED_DEPENDENCY / RESEARCH_BOUNDARY_READY / OWNER_GATES_AND_VERSIONED_GRAPH_EVIDENCE_PENDING`.

## SDA-012 — D12 same-chain derivatives stacking / expiry-roll leakage

Existing controls accepted:
- H11 same-parent residual work compares D12-07 simple skew/term baseline with D12-16 residual surface/curvature rather than assuming both are independent.
- COV-07 substantive contract-level TX replay now covers contract price/OI/volume, expiry provenance, curve/roll semantics and continuous-contract no-lookahead.
- derivatives governance already requires parent-row comparisons and contract provenance.

Protected dependencies:
- H11 remains OWNER_APPROVAL_REQUIRED for the canonical D12-07/D12-16 boundary.
- H04 remains OWNER_APPROVAL_REQUIRED for IV-RV spread vs volatility-risk-premium consolidation.
- COV-07 requires validator-complete specialist return/intake before any new canonical module action.

Missing delta:
- no final canonical machine-wide DERIVATIVES lineage/parentChainId/rollVersion integration can be credited across all consumers yet;
- prospective residual efficacy and thin-contract/liquidity robustness remain unproven.

Decision:
`BLOCKED_DEPENDENCY / SAME_PARENT_AND_ROLL_RESEARCH_STRONG / OWNER_GATES_AND_PROSPECTIVE_INCREMENTALITY_PENDING`.

## SDA-013 — D13 macro vintage/timezone hindsight and Regime input duplication

Existing controls accepted:
- D13 research explicitly demonstrates revision contamination with official NDC evidence and refuses cross-vintage splicing.
- Fed SEP release timing is converted to Taipei decision availability; projection revisions are kept distinct from market surprise.
- unavailable constituents remain UNKNOWN rather than reconstructed.
- D18 treats Regime as an as-of covariate and forbids ex-post labels.
- shared governance already says macro component evidence must be tested beyond Taiwan price/sector and rates/USD/global controls rather than creating duplicate composite votes.

Missing delta:
- authorized/native first-known vintage archives remain incomplete for several macro lanes;
- a generic machine macroReceiptId/sourceVintage/releaseClock/exposure lineage shared by D13 and D18 is not yet established across the full intended source set;
- heterogeneous issuer/industry exposure and prospective incremental selection value remain unproven.

Decision:
`REMEDIATION_IN_PROGRESS / REVISION_AND_CLOCK_FIREWALL_STRONG / CANONICAL_RECEIPT_AND_INCREMENTAL_EVIDENCE_PENDING`.

## SDA-018 — D19 Factor Zoo / momentum overlap / survivorship

Existing controls accepted:
- D19 research explicitly requires neutralization against D03/D04/D05/D07/D08/D09 before independent-alpha claims.
- D19-04 exact next already requires compatible D03/D09 redundancy and D14 component-cost provenance.
- D19-12 keeps high data-mining risk explicit; broader calendar scopes remain blocked by knownAt/vintage evidence.
- no L4 is allowed without prospective/OOS outcomes, transaction costs, multiple-testing controls and robustness.
- current tracker keeps almost all D19 modules at L2; maturity is not being used as proof of Alpha.

Missing delta:
- six intended D19 factor-layer receipts are still not implemented in code according to current research audit;
- full TPEx historical universe/continuity dependency remains open;
- System 1 Challenger admission and factor-lineage/turnover diagnostics are not yet complete;
- no independent OOS incremental factor evidence beyond existing core families exists.

Decision:
`REMEDIATION_IN_PROGRESS / FACTOR_ZOO_GOVERNANCE_STRONG / FACTOR_RECEIPTS_AND_CHALLENGER_OOS_PENDING`.

## SDA-019 — D20 behavioral story without identifiable observables

Existing controls accepted:
- H06 is closed with D06 observable crowding separated from D20 bounded public-forum social herding.
- H07 is closed with D03 observable reversal separated from D20 event-conditioned overreaction candidate; later reversal cannot define the decision-time behavioral parent.
- H08 is closed with D09 membership, D17 event propagation and D20 social/narrative diffusion separated.
- D20 explicitly keeps unresolved behavioral cause UNKNOWN and rejects price-only psychology.
- primary prospective social sampling is deterministic, missed scheduled captures remain UNKNOWN, ad-hoc samples are demoted to secondary, and zero-engagement parents are retained rather than selected away.
- shared social primitives cannot become multiple D20-06/D20-07/D20-11 votes.

Missing delta:
- promotion-grade primary prospective social coverage remains near zero/very early for several D20 lanes;
- D20-13 remains source-gated for genuine live borrow-rate/displayed-supply evidence;
- residual behavioral incrementality beyond D03/D06/D17 controls remains prospective/OOS debt.

Decision:
`VALIDATION_PENDING / BEHAVIOR_IDENTIFIABILITY_FIREWALL_STRONG / PRIMARY_PROSPECTIVE_AND_RESIDUAL_EVIDENCE_PENDING`.

## Overall result

All HIGH tickets are now reconciled against latest-main controls.

Protected owner decisions are preserved:
- SDA-010 does not approve H10 or COV-06.
- SDA-012 does not approve H04, H11 or any COV-07 canonical action.

No ticket is CLOSED.
No Formal Core, selection, ranking, Top6, score, weight, capital, execution or notification behavior changed.
