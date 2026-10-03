# Corporate Governance / Insider Research

Updated: 2026-10-02 23:21 Asia/Taipei
Scope: D21
Status: D21-01 L2 MECHANISM_AND_FALSIFICATION_DEFINED / PIT_REPLAY_PENDING / FORMAL_CORE_UNCHANGED

This lane studies control rights, boards, insiders, pledging, related-party transactions, incentives, capital allocation, audit/internal-control quality, succession and management-guidance credibility as potential governance-risk or quality evidence.

## D21-01 Ownership / Control Structure — research contract v0.1

### 1. Core distinction

Ownership structure must separate at least four concepts rather than compress them into one score:

1. Direct equity ownership: directly held economic stake in the listed company.
2. Ultimate cash-flow rights: economic exposure of an ultimate controller after tracing all ownership chains. Under the classic chain method, cash-flow rights on one path are the product of ownership percentages along that path; multiple valid paths are summed with explicit de-duplication.
3. Ultimate control / voting rights: ability to influence corporate decisions after tracing control chains. The classic East-Asia literature commonly uses the weakest-link rule: path-level control is the minimum voting stake along that path, and multiple control paths are summed subject to the stated methodology.
4. Board / management control: chairperson, CEO, board-seat or management participation is a separate control channel and must not be silently substituted for voting rights. Detailed board composition remains owned by D21-02.

Primary separation variable:
- control-cashflow wedge = ultimate control rights minus ultimate cash-flow rights.
- ratio versions are secondary diagnostics only and are undefined / unstable when cash-flow rights are zero or very small.

### 2. Mechanisms to test

Alignment mechanism:
- Greater cash-flow ownership increases the controller's own exposure to firm value and may strengthen monitoring incentives and reduce agency costs.
- Therefore concentrated ownership is not intrinsically bad.

Entrenchment / private-benefit mechanism:
- When control rights materially exceed cash-flow rights, the controller can retain strong decision power while bearing less of the economic cost of value destruction.
- This can increase incentives or opportunities for tunneling, related-party transfers, inefficient investment, payout distortion or other minority-shareholder conflicts.

Non-linearity:
- Taiwan evidence is not consistent with a simple monotonic rule such as more family control = worse. Family control can carry both monitoring / information benefits and entrenchment costs.
- Any future feature must therefore test level, wedge, controller type and possibly interactions rather than force a one-direction governance score.

### 3. Measurement falsification

The weakest-link method is a research baseline, not ground truth.

Mandatory robustness comparators before any scoring proposal:
- direct first-tier ownership;
- classic weakest-link ultimate voting rights;
- ultimate cash-flow rights;
- control-cashflow wedge;
- alternative control-power measure when data make it feasible;
- board-seat / chair / CEO control as a separate D21-02 dependency.

Reason: later methodological work shows weakest-link control can materially mis-measure actual voting power. A result that exists only under one control-right definition is fragile and cannot be promoted.

### 4. Taiwan disclosure/source contract

Primary official sources:
- FSC annual-report regulations and their historical versions;
- MOPS annual reports / shareholder-meeting documents;
- MOPS company-governance and ownership tables, including top-shareholder relationships, board organization/basic information, insider/major-shareholder holdings, transfers and pledge information;
- TWSE/TPEx corporate-governance rules and historical versions.

Current annual-report rules establish:
- major shareholder list: shareholders at 5% or more; if fewer than 10, disclose through the top 10;
- director legal-person representation requires additional look-through disclosure of the legal-person shareholder's top shareholders;
- listed / OTC companies currently upload the annual-report electronic file 14 days before the shareholders' meeting.

Current corporate-governance best-practice rules define major shareholders for governance monitoring as 5% or more or top 10 and require companies to track major shareholders and their ultimate controllers.

Historical timing warning:
- annual-report upload deadlines changed over time. Current 14-day rules must never be backfilled onto older years.
- each historical observation must use the regulation and filing practice actually in force for that year.

### 5. PIT / replay contract

Minimum record fields:
- issuer;
- disclosure_type;
- measurement_as_of;
- known_at;
- filing_timestamp_source;
- source_document_id / URL;
- source_rule_version;
- direct_holder;
- ultimate_controller;
- controller_type;
- direct_ownership_pct;
- chain_edges with ownership / voting percentages;
- ultimate_cashflow_rights;
- ultimate_control_rights_classic;
- control_cashflow_wedge;
- reconstruction_method_version;
- stale_flag;
- quality_status.

Rules:
1. known_at is the first verifiable public availability time, preferably the MOPS filing timestamp. Publication year or fiscal year is not a substitute.
2. Current ownership must never be backfilled into earlier decision dates.
3. Annual-report data may be carried forward only as a stale-labeled snapshot until a newer valid disclosure is known; a known control-changing event terminates blind carry-forward.
4. Relationship labels, legal-person ownership and controller-family aggregation must use the historical document vintage, not a current company profile.
5. Missing chain links are UNKNOWN, not zero.
6. Ownership graphs with loops / cross-holdings require explicit cycle handling; do not force a simple-tree calculation.
7. Historical regulation version is part of the evidence because disclosure thresholds and filing deadlines can change.

### 6. Falsification cases frozen

Any future claim that the control-cashflow wedge predicts risk or return must survive at least these alternatives:
- family ownership can reduce information asymmetry and lengthen investment horizon;
- high control with high cash-flow ownership can align rather than entrench;
- the wedge may proxy for business-group membership, size, age, industry, leverage, valuation or profitability;
- board dominance may be the actual mechanism rather than voting-right separation;
- control chains can be mis-reconstructed when nominees, trusts, related persons or cross-holdings are incomplete;
- control thresholds such as 10% or 20% are conventions, not universal truths;
- weakest-link measurement itself may create the apparent relation;
- survivorship and current-structure backfill can manufacture historical predictive power.

Therefore future tests must compare multiple control definitions, pre-register control variables and keep missing structure as UNKNOWN.

### 7. Evidence synthesis

Foundational international evidence:
- La Porta, Lopez-de-Silanes and Shleifer (1999): many large firms outside strongly protected markets have identifiable ultimate owners; control often exceeds cash-flow rights through pyramids and management participation.
- Claessens, Djankov and Lang (2000): East Asian firms frequently exhibit voting rights above cash-flow rights via pyramids / cross-holdings.
- Claessens et al. (2002): firm value increases with largest-holder cash-flow ownership but decreases when control rights exceed cash-flow ownership, consistent with competing alignment and entrenchment channels.
- Edwards and Weichenrieder (2009): weakest-link control measurement has important weaknesses and should not be treated as a theoretically definitive measure.

Taiwan-specific evidence:
- Taiwan studies report concentrated ultimate ownership, family control, pyramids / cross-holdings and substantial management / board participation by controlling families.
- Yeh, Lee and Woidtke (2001) report a non-linear relation between family control and relative performance, directly rejecting a simple monotonic family-control score.
- Yeh and Woidtke (2005) find board affiliation interacts with control/cash-flow divergence, supporting separation of D21-01 ownership structure from D21-02 board structure.
- Later Taiwan work continues to find economically relevant associations between excess control rights and firm outcomes, but these are hypothesis evidence rather than guaranteed trading alpha.

### 8. System 1 / System 2 implication

Current status: research hypothesis only.

Potential future feature family:
- controller identity / type;
- cash-flow ownership;
- classic control rights;
- control-cashflow wedge;
- structural complexity / path count;
- change in controller or wedge;
- interaction with board control, related-party transactions, pledging and capital allocation.

No feature is approved for Formal Core. Before any optimization candidate:
- prove historical Taiwan PIT extraction and replay;
- compare measurement definitions;
- test redundancy versus D06 ownership flow, D07 fundamentals and D11 event risk;
- perform OOS / prospective Shadow;
- evaluate coverage and missingness bias;
- test multi-regime robustness and transaction / implementation relevance.

## D21-01 maturity decision

Advance from L0 to L2 / 40%:
- L1 satisfied: core theory and ownership/control definitions established.
- L2 satisfied: competing mechanisms, measurement alternatives and falsification cases are explicitly frozen.
- L3 not satisfied: official Taiwan sources are identified, but historical first-known timestamps and end-to-end replay have not yet been validated on archived company-year samples.

Exact next continuation:
Build a small historical Taiwan PIT replay prototype for D21-01 using at least two listed-company years with materially different ownership structures. Capture actual MOPS public-known timestamps, annual-report vintage, top-shareholder relationships and legal-person look-through chains; reconstruct cash-flow rights and classic weakest-link control rights, record UNKNOWN links, then verify that replay as of the decision date does not use later ownership information. Compare 10% and 20% control-threshold classifications and one direct-ownership baseline before considering L3.

Formal Core impact: NONE.

## D21-01 Historical Taiwan PIT replay prototype v0.1

Date: 2026-10-03 Asia/Taipei
Status: PARTIAL_REPLAY / EXACT_MOPS_KNOWN_AT_BLOCKED / NO_L3_PROMOTION

### Sample A — TSMC 2330, 2024 annual report
- Annual-report major-shareholder snapshot: ADR-Taiwan Semiconductor Manufacturing Company Ltd. 20.49%; National Development Fund 6.38%.
- Official investor information identifies the ADR program as a depositary structure. The 20.49% ADR line must not be treated mechanically as one ultimate beneficial controller.
- 2025 AGM date: 2025-06-03. The historical filing rule supplies a latest-required-publication bound for qualifying large listed companies, but not the exact first-known MOPS receipt.
- Threshold falsification: a naive direct-holder >=20% controller rule can create a false positive from a depositary/omnibus line.
- Exact original MOPS first-public timestamp remains UNKNOWN. No L3 promotion.

### Sample B — Formosa Plastics 1301, 2024 annual report
- Major-holder snapshot includes Chang Gung Medical Foundation 9.44%, Formosa Chemicals & Fibre 7.65%, a custody account 6.26%, Nan Ya Plastics 4.63%, Chindwell 4.16%, Vanson 3.05%, Formosa Petrochemical 2.07%, Ming Chi University of Technology 1.43%, plus other holders.
- Relationship/look-through disclosures indicate a dense related group network even though each visible direct group holder is below 10%.
- 2025 AGM date: 2025-06-11. Exact original MOPS first-public timestamp remains UNKNOWN.
- Threshold falsification: a naive single-holder 10% rule can create a false negative for a network-controlled group.
- Summing visibly related top-holder percentages produces about 32.43%, but this is only a network-concentration diagnostic, NOT ultimate control rights. The structure includes loops, foundations, related legal persons, foreign holding companies and incomplete ultimate-beneficial-owner paths.

### Source-provenance falsification
- A third-party mirror labels one 2024 Formosa Plastics annual-report artifact with a 2024-12-23 filing date while the rendered audited report contains a 2025-03-13 audit-report date.
- That chronology is incompatible with interpreting the mirror date as the first-public time of the audited document. Third-party mirror metadata is therefore UNTRUSTED_FOR_KNOWN_AT unless reconciled to an original MOPS receipt/timestamp.
- Document print date and statutory filing deadline are bounds/context, not substitutes for exact known_at.

### Historical filing-rule vintage
- In the relevant 2024/2025 regime, listed/OTC companies generally filed annual reports 7 days before AGM; companies with latest fiscal-year paid-in capital of NT$2 billion or more, or foreign/PRC ownership of at least 30%, filed 14 days before.
- A later universal 14-day listed/OTC rule must not be backfilled into earlier years.

### D21-01 maturity decision
- Keep D21-01 at L2 / 40%.
- Two structurally different company-year cases now freeze both false-positive and false-negative failure modes of naive ownership thresholds.
- L3 remains blocked by missing authoritative historical first-known MOPS receipts.

## D21-02 Board / Independent Directors — research contract v0.1

Date: 2026-10-03 Asia/Taipei
Status: L2 MECHANISM_AND_FALSIFICATION_DEFINED / PIT_BOARD_REPLAY_PENDING / CONTEXT_ONLY

### Regulatory baseline
- Taiwan Securities and Exchange Act Article 14-2: where independent directors are required, there must be at least two and at least one-fifth of total board seats; independence, professional qualification, shareholding and concurrent-post restrictions apply.
- Article 14-4: an audit committee, where required, consists entirely of independent directors, at least three members, one convener, and at least one member with accounting or finance expertise.

### Competing mechanisms
- Monitoring/minority-protection: directors independent of controlling families may improve oversight, financial-report monitoring and challenge to controller-favoring decisions.
- Expertise: accounting/finance or firm-relevant technical expertise may increase oversight quality.
- Supply/displacement/compliance-cost: mandated independent seats may replace incumbent directors; a limited qualified-director pool can increase busyness and cost without adding superior firm-specific expertise.
- Formal independence does not guarantee practical independence from controllers.

### Taiwan evidence synthesis
- Yeh and Woidtke (2005) associate controlling-family-affiliated boards with poorer governance and show board affiliation interacts with control-cashflow divergence.
- Fan, Jiang, Kao and Liu (2020), using regulation-mandated board changes as a quasi-natural experiment, report a negative effect of increased board independence on firm value/profitability and document replacement, cost and busyness mechanisms.
- Other Taiwan observational studies report positive associations for board independence or separation of CEO/chair roles, but selection/endogeneity remains a competing explanation.
- Therefore 'more independent directors = better' is rejected as a monotonic scoring rule.

### Candidate variables for future PIT testing
- controller/family affiliation of each director;
- voluntary versus regulation-forced appointment context;
- board size and whether an independent seat replaced or added a director;
- director busyness / concurrent positions;
- accounting/finance expertise;
- industry/technology expertise match;
- tenure;
- committee roles;
- CEO-chair duality interaction;
- attendance, dissent and recusal records where first-known historical data are reliable.

### PIT / replay contract
- Use election/appointment announcement known_at, shareholder-meeting/election vintage and actual term dates; do not reconstruct older boards from the current roster.
- Preserve director identity mapping through name and legal-person-representative changes.
- Controller affiliation must use contemporaneous ownership/relationship evidence, not current group membership.
- Forced-versus-voluntary classification must use the regulation version then in force.
- Missing expertise, busyness, affiliation, attendance or dissent evidence is UNKNOWN, not zero.

### Role and maturity decision
- Advance D21-02 L0 -> L2 / 40%: theory, competing mechanisms, Taiwan positive/negative evidence and falsification requirements are defined.
- L3 remains closed until historical Taiwan board composition/election/replacement data can be replayed with reliable first-known timing.
- Owner-approved role remains CONTEXT_ONLY / CONFIDENCE / GOVERNANCE_TAIL_RISK; no short-horizon hard gate and no Formal Core change.

### Exact continuation
- Build a two-company historical board PIT replay for D21-02: capture election/appointment known_at, terms, controller affiliation, committee roles, expertise, busyness and CEO-chair duality at the decision timestamp.
- Keep D21-01 exact MOPS filing timestamp as an unresolved dependency; do not idle on it while D21-02 is executable.
