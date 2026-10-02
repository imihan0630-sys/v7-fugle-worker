# Corporate Governance / Insider Checkpoint

Updated: 2026-10-02 23:21 Asia/Taipei
Scope: D21｜公司治理／經營者／內部人／控制權品質
Status: D21-01 L2 / MECHANISM_FALSIFICATION_FROZEN / PIT_REPLAY_PENDING / FORMAL_CORE_UNCHANGED

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

## Exact next continuation
Build a historical Taiwan PIT replay prototype for D21-01 using at least two listed-company years with materially different ownership structures. For each sample, capture actual MOPS filing/public-known timestamp, document vintage, top-shareholder relationships and legal-person look-through; reconstruct ultimate cash-flow rights and classic weakest-link control rights while preserving UNKNOWN links. Verify no later ownership data leak into the historical decision timestamp. Compare 10% and 20% control-threshold classifications plus a direct-ownership baseline. Only after successful replay may D21-01 be considered for L3.

Formal Core impact: NONE.
