# Corporate Governance / Insider Checkpoint

Updated: 2026-10-04 Asia/Taipei
Scope: D21｜公司治理／經營者／內部人／控制權品質
Status: D21-01 L2 PARTIAL_PIT_REPLAY / D21-02 L3 TAIWAN_PIT_VALIDATED / D21-03 L2 CLUSTER_DEDUP_FROZEN / D21-04 L2 MECHANISM_FALSIFICATION_FROZEN / FORMAL_CORE_UNCHANGED

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


## 2026-10-03 evening durable continuation

### D21-02 board replay
- TSMC 2024 board reset is PIT-replayable: board approved 10 seats including 7 independent directors on 2024-02-06; candidate slate was publicly announced on 2024-04-12; AGM elected 10 directors including 7 independent directors on 2024-06-04 for a term through 2027-06-03; the new board elected C.C. Wei as both chairman and CEO the same day.
- TSMC 2024 capital stock was about NT$259.35 billion, placing it above the NT$100 billion threshold for the 2024 one-third independent-director rule upon board re-election. Chairperson/CEO duality also requires at least 4 independent directors. For a 10-seat board the reconstructed floor is 4; actual = 7, so 3 seats are above the binding numerical floor.
- Formosa Plastics 2024 board reset is PIT-replayable from official issuer election/board material: 12 directors including 4 independent directors, term 2024-06-20 through 2027-06-19; Wen-Pi Kuo was general manager at the AGM and was elected chairman by the new board on the same date; all four independent directors were appointed to remuneration functions.
- Formosa Plastics 2024 capital was about NT$63.657 billion, below the NT$100 billion threshold. Its 4 independent directors instead line up with the separate rule requiring at least 4 independent directors when chairperson and president/equivalent are the same person.
- Therefore raw independent-director ratio is confounded by regulation. Future research must separate legal floor, actual seats, excess seats and trigger type.
- D21-02 advances L2 -> L3 / 60%. Historical Taiwan board state and relevant regulation-vintage linkage are feasible for core fields. L4 remains closed because prospective/OOS return-risk evidence is absent.
- Decision role remains CONTEXT_ONLY / CONFIDENCE / GOVERNANCE_TAIL_RISK; no hard gate and no Formal Core change.

### D21-03 insider trading contract
- Freeze four distinct Taiwan insider evidence families: ex-ante transfer filing, delayed monthly holding change, pledge creation/release, and insider appointment/dismissal / related-person scope.
- Article 22-2 transfer filing is an intention/permission-to-transfer signal, not proof of execution. Exchange/OTC transfer generally begins at least 3 days after filing; under-10,000-share daily transfers can be exempt from this filing route.
- Article 25 monthly holding change is delayed net-holding evidence: insiders report prior-month changes by the 5th; issuer files by the 15th. Exact transaction timing can remain interval-censored.
- Purchases and sales therefore have asymmetric public clocks. Buy-versus-sell studies must not align both on the same filing-day semantics.
- Related-person aggregation includes spouse, minor children and nominee-held shares under the statutory scope.
- Mandatory falsification covers transfer method/reason, intention-vs-completion, trade size, insider role, multi-insider clustering, pledge stress, control-cash-flow structure, prior return/valuation, liquidity/attention and gift/trust/estate/tax explanations.
- D21-03 advances L0 -> L2 / 40%. L3 remains closed pending historical MOPS event replay.

## Exact next continuation
Build a historical D21-03 MOPS replay using at least one ex-ante transfer filing and one monthly holding-change case. Preserve original filing timestamp, event_clock_type, intended transfer amount/method, actual later holding delta when observable, related-person aggregation and pledge state. Demonstrate that sale-intent and monthly actual-change evidence are not collapsed into one timestamp. Then test whether multi-insider clustering adds information beyond event size and prior returns. D21-01 original MOPS annual-report first-known timestamp remains an unresolved dependency but does not block D21-03.

Formal Core impact: NONE.


## 2026-10-04 morning durable continuation

### D21-03 historical insider replay deepening
- Hon Hai 2317 has two same-day 2025-12-01 pre-transfer filings totaling 5,180 lots, each filed by a legal entity recorded as a major shareholder's nominee holder and each intending to transfer 100% of that entity's reported Hon Hai holding.
- The two filing entities belong to the same ultimate major-shareholder relationship network. Raw filer count = 2 must therefore not be interpreted as two independent insider signals.
- Relative to the ultimate major shareholder's publicly reported total Hon Hai position of about 1,742,198 lots, the 5,180-lot event is only about 0.30%, despite being 100% of each filing entity's own reported holding.
- Cluster research must preserve raw_filer_count, related_group_count, ultimate_controller_count and independent_information_source_count separately.
- Secondary MOPS-derived reconstruction indicates December 2025 market-sale net change of -5,180 lots and zero untransferred shares, consistent with full completion, but the original monthly MOPS first-known timestamp was not captured. These secondary records are reconstruction checks only.
- Exact monthly known_at remains UNKNOWN; D21-03 stays L2 / 40%.
- Future clustering tests must de-duplicate related entities and overlapping event windows, and control event size, prior return, firm size/liquidity, price position, transfer method, role, pledge state, controller structure and accounting/news context.

### D21-04 share pledging contract
- D21-04 advances L0 -> L2 / 40%.
- Pledge evidence is decomposed into liquidity/funding, margin-call/forced-sale risk, control-retention/agency, corporate-policy spillover and voting-right/regulatory mechanisms.
- Taiwan disclosure contract preserves both monthly pledge-change reporting and event-level pledge setup/release timing.
- Company Act Article 197-1 is relevant where a public-company director pledges more than half of the shares held at election; the excess pledged shares can lose voting-right exercise/counting under the statutory rule.
- Candidate pledge variables must normalize pledged shares to insider/controller-group holdings and shares outstanding, preserve setup/release events, related-group aggregation, concurrent insider sales, price drawdown/volatility/liquidity and controller/board context.
- A margin-call price must NEVER be estimated from pledge ratio alone. Without loan-to-value, maintenance ratio, collateral terms and required loan inputs, margin_call_threshold = UNKNOWN.
- Research role: RESEARCH_ONLY / GOVERNANCE_TAIL_RISK / CONFIDENCE. No hard gate and no Formal Core change.

## Exact next continuation
Build a historical D21-04 pledge PIT replay with at least one pledge setup and one release event, preferably for the same controller/issuer. Capture original known_at, pledged-share ratios at filer and controller-group levels, price path before/after, related insider transfers, corporate repurchase/financing context and Article 197-1 voting-right relevance. Keep D21-03 exact original monthly MOPS receipt as an unresolved dependency; do not let it block D21-04. Only after end-to-end historical pledge replay may D21-04 be considered for L3.

Formal Core impact: NONE.
