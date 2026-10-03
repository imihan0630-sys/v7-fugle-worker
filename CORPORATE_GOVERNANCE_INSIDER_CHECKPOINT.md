# Corporate Governance / Insider Checkpoint

Updated: 2026-10-03 Asia/Taipei
Scope: D21｜公司治理／經營者／內部人／控制權品質
Status: D21-01 L2 PARTIAL_PIT_REPLAY / D21-02 L2 MECHANISM_FALSIFICATION_FROZEN / FORMAL_CORE_UNCHANGED

## Governance
- Canonical continuation checkpoint for D21.
- Separate governance structure, disclosed insider actions and management-quality hypotheses from D06 ownership flow, D07 accounting quality and D11 event clocks.
- Require PIT disclosure timing and avoid current-governance backfill into historical decisions.
- Formal Core remains LOCKED.

## D21-01 durable progress
- Ownership structure has been decomposed into direct ownership, ultimate cash-flow rights, ultimate control/voting rights, and board/management control.
- Classic cash-flow calculation: product of ownership percentages along each valid chain, summed across valid paths with explicit de-duplication.
- Classic control calculation baseline: weakest-link voting right along each chain, summed across control paths under a documented methodology.
- Weakest-link control is explicitly frozen as a baseline rather than ground truth because methodological literature shows material measurement weaknesses.
- The primary research object is the control-cashflow wedge, but no monotonic score is permitted.
- Alignment and entrenchment mechanisms are both retained; concentrated/family ownership is not automatically GOOD or BAD.
- Taiwan official source map frozen: FSC annual-report rules + historical versions, MOPS annual reports / shareholder-meeting material, MOPS ownership/governance tables, TWSE/TPEx governance rules.
- Current annual-report disclosure includes >=5% shareholders or top 10 when fewer than ten; current listed/OTC annual-report filing deadline is 14 days before shareholders' meeting. Historical rule versions must be used for older years.
- PIT contract frozen: measurement_as_of != known_at; first verifiable public filing time governs eligibility; current ownership may not be backfilled; carry-forward must be stale-labeled and interrupted by known control-changing events; missing chain links remain UNKNOWN.
- Falsification set frozen: non-linear family-control effect, high cash-flow alignment, business-group/size/age/industry/leverage/valuation/profitability confounding, board-control channel, incomplete ownership chains, threshold sensitivity, weakest-link model risk, survivorship/current-structure backfill.
- D21-01 advances L0 -> L2 / 40%. L3 is not claimed because historical Taiwan first-known and replay feasibility have not yet been demonstrated end-to-end.
- Research record: CORPORATE_GOVERNANCE_INSIDER_RESEARCH.md.

## 2026-10-03 durable continuation
- D21-01 remains L2 / 40% after a two-company historical replay prototype.
- TSMC: a 20.49% ADR depositary/omnibus line shows why naive direct-holder thresholds can falsely label a custody structure as one ultimate controller.
- Formosa Plastics: visible related group entities are individually below 10%, showing why a naive single-holder 10% rule can miss a control network.
- A roughly 32.43% sum of visibly related Formosa Plastics top-holder lines is retained only as a network-concentration diagnostic, NOT ultimate control rights.
- Exact original MOPS first-known timestamp remains UNKNOWN for the tested annual-report vintages. Print dates and statutory deadlines are not substitutes.
- Third-party mirror filing metadata is UNTRUSTED_FOR_KNOWN_AT unless reconciled to original MOPS receipts.
- Historical rule vintage frozen: in the relevant 2024/2025 regime, listed/OTC companies generally filed 7 days before AGM, while those with paid-in capital >= NT$2 billion or foreign/PRC holdings >=30% filed 14 days before. Later universal 14-day rules must not be backfilled.
- D21-02 advances L0 -> L2 / 40%. Taiwan regulation defines independent-director/audit-committee minimum structure, but Taiwan empirical evidence is mixed; a monotonic 'more independent directors = better' score is rejected.
- D21-02 candidate dimensions: controller affiliation, forced-vs-voluntary appointment, replacement/addition context, director busyness, accounting/finance and industry expertise, tenure, committee role, CEO-chair duality, attendance/dissent/recusal where reliable.
- D21-02 role remains CONTEXT_ONLY / CONFIDENCE / GOVERNANCE_TAIL_RISK. Formal Core remains LOCKED.

## Exact next continuation
Build a two-company historical board PIT replay for D21-02. Capture election/appointment known_at, actual term, controller/family affiliation, committee role, accounting/finance or industry expertise, director busyness and CEO-chair duality using contemporaneous evidence. Compare forced versus voluntary appointment context under the regulation version then in force. Keep D21-01 exact original MOPS annual-report first-known timestamp as an unresolved dependency, but do not idle on it while D21-02 is executable. Only after reliable historical board replay may D21-02 be considered for L3.

Formal Core impact: NONE.
