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


## D21-02 Historical Board PIT Replay v0.2

Date: 2026-10-03 Asia/Taipei
Status: L3 TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED / CONTEXT_ONLY / FORMAL_CORE_UNCHANGED

### Sample A — TSMC 2330, 2024 board reset

Historical event chain:
- 2024-02-06: the board approved that the 2024 AGM would elect 10 directors including 7 independent directors.
- 2024-04-12: TSMC publicly announced the 10 board candidates: 3 regular directors, 4 incumbent independent directors, and 3 new independent-director candidates.
- 2024-06-04: the AGM elected all 10 directors, including 7 independent directors. The term began on 2024-06-04 and ends on 2027-06-03.
- Immediately after the AGM, the newly elected board elected C.C. Wei as both chairman and CEO.
- The 2024 board therefore has 70% independent directors. The three new independent directors were Ursula M. Burns, Lynn L. Elsenhans and Chuan Lin.
- The 2024 annual-report capital stock was approximately NT$259.35 billion.

Regulatory-context reconstruction:
- Securities and Exchange Act Article 14-2 provides the baseline minimum of at least 2 independent directors and at least one-fifth of total board seats.
- The 2024 TWSE governance implementation additionally required listed companies with paid-in capital of at least NT$10 billion to reach at least one-third independent directors upon board re-election.
- The TWSE board-establishment directions also required at least 4 independent directors where the chairperson and president/equivalent are the same person, unless an even larger-board rule applies.
- For a 10-member TSMC board, the binding numerical floor after the 2024 election is therefore at least 4 independent directors. Actual independent seats = 7, leaving 3 seats above the reconstructed regulatory floor.
- Classification: REGULATED_BASE + VOLUNTARY_EXCESS_INDEPENDENCE. Do not classify the entire 70% ratio as purely regulation-forced.

PIT evidence:
- Candidate identities are publicly observable before the election.
- Election result, board size, independent-director count, term and chairman/CEO duality are date-stamped by issuer materials on the election date.
- Professional background and concurrent positions are disclosed in candidate/annual-report material, making expertise and busyness variables reconstructable with document vintage controls.

### Sample B — Formosa Plastics 1301, 2024 board reset

Historical event chain:
- 2024-05-08 board material identifies the candidate slate; the official AGM notice also discloses the 8 regular-director and 4 independent-director election structure and named independent-director candidates.
- 2024-06-20: the AGM completed the full board election.
- The first meeting of the new board on the same date unanimously elected Wen-Pi Kuo as chairman and appointed the four independent directors Wei Chi-Lin, Wu Ching-Ji, Shih Yen-Shiang and Yeh Ching-Tse to the remuneration committee.
- The reconstructed board has 12 members, including 4 independent directors; term 2024-06-20 through 2027-06-19.
- The AGM minutes identify Wen-Pi Kuo as general manager before he was elected chairman, creating chairperson-president duality at the board reset.
- Formosa Plastics paid-in capital was approximately NT$63.657 billion in 2024, below the NT$100 billion large-cap threshold for the 2024 one-third rule.

Regulatory-context reconstruction:
- Because paid-in capital was below NT$100 billion, the 2024 large-cap one-third mandate was not the applicable trigger.
- However, the TWSE rule for a chairperson and president/equivalent being the same person required at least 4 independent directors.
- Actual independent seats = 4. The observed increase from 3 to 4 independent directors is therefore consistent with a binding duality-related regulatory floor.
- Formosa Plastics describes the increase as strengthening supervision, but that issuer narrative cannot be treated as causal evidence of voluntary governance improvement when a binding rule points in the same direction.
- Classification: REGULATION_BINDING / NO_IDENTIFIABLE_EXCESS_INDEPENDENCE at the 2024 board reset.

Affiliation / expertise / busyness reconstruction:
- The board includes representatives of related group companies, including Formosa Chemicals & Fibre, Nan Ya Plastics and Formosa Petrochemical, plus other group-linked directors.
- Official candidate materials disclose current outside positions for independent-director candidates, making a historical busyness proxy feasible.
- The four independent directors serve on audit and remuneration functions, providing a committee-role layer distinct from the raw independent-director count.

### Cross-case falsification result

A raw independent-director ratio mixes at least three mechanisms:
1. minimum legal compliance;
2. rule-specific incremental requirements such as chairperson-president duality;
3. voluntary seats above the applicable floor.

Therefore any future feature must decompose:
- applicable_legal_floor;
- actual_independent_seats;
- excess_independent_seats = actual minus applicable floor;
- regulatory_trigger_type;
- independent_ratio;
- controller_affiliation_ratio;
- executive_board_ratio;
- board_committee_independent_coverage;
- expertise and busyness.

A company-level binary FORCED/VOLUNTARY flag is too coarse. Classification must be marginal-seat / requirement-aware.

### D21-02 maturity decision

Advance D21-02 from L2 / 40% to L3 / 60%.

Reason:
- Two Taiwan listed-company board resets can be replayed with date-specific issuer evidence.
- Core board fields are PIT-feasible: candidate slate, election date, effective term, board size, independent-director count, chairperson/president duality, major juristic-person affiliation and committee assignment.
- Historical regulation vintage materially changes interpretation and can be linked to each board reset.
- Remaining limitations do not block L3 but do block L4: historical dissent/recusal detail, exact public timestamp for every candidate-material field, and broader multi-company coverage remain incomplete.
- No return prediction or Alpha claim has been established.

System role remains CONTEXT_ONLY / CONFIDENCE / GOVERNANCE_TAIL_RISK.
Formal Core impact: NONE.

## D21-03 Insider Ownership / Trading — research contract v0.1

Date: 2026-10-03 Asia/Taipei
Status: L2 MECHANISM_AND_FALSIFICATION_DEFINED / HISTORICAL_MOPS_REPLAY_PENDING / RESEARCH_ONLY

### Taiwan insider-event taxonomy

Do not treat all insider holding changes as one event family.

A. Ex-ante transfer filing under Securities and Exchange Act Article 22-2
- Applies to directors, supervisors, managerial officers and shareholders holding more than 10%.
- For exchange/OTC transfer under the filing route, transfer may occur at least 3 days after filing.
- Daily transfer below 10,000 shares can be exempt from this filing route.
- This is an intended transfer / sale signal, not proof that the announced shares were actually sold.

B. Monthly holding-change filing under Article 25
- Insiders report prior-month holding changes to the company by the 5th day of the following month.
- The issuer compiles and files by the 15th day.
- This is delayed net-holding evidence. The exact transaction date can be interval-censored inside the prior month unless another source provides transaction-level timing.
- A monthly decrease may arise from market sale, specific-person transfer, gift, trust/estate planning or other non-directional mechanisms.

C. Pledge creation / release
- The pledgor must notify the company promptly and the issuer files/publicly announces the pledge status within 5 days.
- Pledge is owned primarily by D21-04, but it is a mandatory confounder for D21-03 because financing stress can change the motive and informativeness of insider sales.

D. Appointment / dismissal and related-person scope
- Listed-company filing rules require new appointment/dismissal of insiders to be disclosed within 2 days.
- Related-person holdings include spouses, minor children and shares held through nominee arrangements under the statutory definition.

### Critical clock asymmetry

Public insider-buy and insider-sell signals do NOT share the same event clock:
- many material sale/transfer intentions are disclosed ex ante;
- purchases are generally observed through later holding changes unless another reporting regime creates an earlier event;
- monthly net changes are not exact transaction timestamps.

Therefore:
- never compare buy-versus-sell abnormal returns using the filing date as if both represent the same economic time;
- never backfill a monthly holding change to a guessed trade date;
- store event_clock_type and timing_precision explicitly.

### Mechanisms to test

Informational advantage:
- insiders may possess superior information about future cash flow or earnings quality.

Contrarian / valuation mechanism:
- insider purchases can reflect perceived undervaluation after price weakness rather than unpublished fundamental information.

Liquidity / diversification mechanism:
- insider sales can reflect personal liquidity, diversification, tax, estate, gift or trust motives and therefore need not be bearish.

Governance / financing-stress interaction:
- Taiwan evidence indicates insider-sale timing and profitability can be stronger when cash-flow rights are lower, share pledging is higher, control-cash-flow divergence is larger, or the insider also serves in management.

Accrual / reporting-quality interaction:
- Taiwan evidence documents links between abnormal accrual behavior and abnormal insider trading, so an apparent insider signal can overlap with D07 accounting-quality evidence rather than provide independent Alpha.

Attention / market-efficiency interaction:
- later Taiwan evidence suggests insider-trading predictiveness can weaken as disclosure, enforcement and market efficiency improve. Any historical effect must be tested for time-decay and market-regime stability.

### Falsification requirements

Before treating an insider event as directional evidence, test:
- event is intention versus actual completed holding change;
- transfer method and stated purpose;
- buy/sell timing-clock asymmetry;
- event size relative to pre-event insider holdings, free float and market cap;
- one insider versus multi-insider cluster;
- executive insider versus non-executive director versus 10% shareholder;
- spouse/minor/nominee aggregation;
- pledge ratio and recent pledge changes;
- prior returns and valuation;
- liquidity / attention / firm size;
- earnings, corporate actions and related news around the event;
- gift, trust, inheritance, tax, estate planning or internal restructuring;
- partial or non-execution of a pre-filed transfer;
- repeated filings by the same insider;
- small transfers excluded from ex-ante filing, creating selection bias.

UNKNOWN motive or execution status must remain UNKNOWN.

### Candidate research features

- event_clock_type;
- event_known_at;
- timing_precision;
- insider_role;
- related_person_group;
- transfer_method;
- stated_reason;
- intended_transfer_shares;
- intended_transfer_to_preholding_ratio;
- realized_monthly_holding_delta;
- cluster_insider_count;
- cluster_net_change_ratio;
- pledge_ratio / pledge_change;
- controller_cashflow_rights / control_cashflow_wedge dependency;
- prior_return / valuation / attention / liquidity context;
- completion_status: CONFIRMED / PARTIAL / UNCONFIRMED / UNKNOWN.

No feature is approved as a hard gate.

### Taiwan evidence synthesis

- Taiwan studies using pre-filed insider sales find price run-up before filing and decline after filing, consistent with informative timing, while profitability is related to personal incentives and pledge/control structure.
- Event studies of Taiwan insider transfer filings report negative abnormal returns around some transfer announcements, but the aggregate effect varies by transfer type and firm characteristics.
- Other Taiwan evidence reports positive post-purchase abnormal returns and poorer long-horizon performance after insider sales, while later work also documents declining predictive power over time.
- These findings reject both simplistic rules: insider buy = always bullish and insider sell = always bearish.

### D21-03 maturity decision

Advance D21-03 from L0 to L2 / 40%.

L1 satisfied:
- Taiwan legal/event taxonomy and economic mechanisms are defined.

L2 satisfied:
- competing explanations, timing asymmetry, selection-bias channels, pledge/accounting interactions and explicit falsification conditions are frozen.

L3 remains closed:
- no end-to-end historical MOPS replay has yet established event-level first-known timestamps, transfer type, monthly holding change and completion semantics on archived Taiwan cases.

Exact next continuation:
Build a historical D21-03 MOPS replay using at least one ex-ante transfer filing and one monthly holding-change case. Preserve original filing timestamp, event_clock_type, intended transfer amount/method, actual later holding delta when observable, related-person aggregation and pledge state. Demonstrate that the sale-intent event and monthly actual-change event are not merged into one timestamp. Then test whether multi-insider clustering adds information beyond event size and prior returns.

Formal Core impact: NONE.


## D21-03 Historical Insider Replay v0.2

Date: 2026-10-04 Asia/Taipei
Status: HISTORICAL_REPLAY_PARTIAL / CLUSTER_CONTROLLER_DEDUP_FROZEN / EXACT_MONTHLY_MOPS_KNOWN_AT_BLOCKED / RESEARCH_ONLY

### Case — Hon Hai 2317, 2025-12-01 ex-ante transfer filings

Two same-day pre-transfer filings are visible for Hon Hai:
- Cheng Feng Investment Co., Ltd.: status recorded as a major shareholder's nominee holder; original holding 2,409 lots; intended general-market transfer 2,409 lots; transfer window 2025-12-04 through 2026-01-03.
- Hung Wei Co., Ltd.: same nominee-holder status; original holding 2,771 lots; intended general-market transfer 2,771 lots; same transfer window.
- Combined intended transfer = 5,180 lots.

The two filing entities are related to the same ultimate major-shareholder network rather than two independent insiders. Public reporting links both entities to the same representative / controller family context.

Scale-denominator falsification:
- At the filer-entity level, each filing represents 100% of that entity's reported Hon Hai holding.
- Relative to the ultimate major shareholder's reported total Hon Hai holdings of about 1,742,198 lots, 5,180 lots is only about 0.30%.
- Therefore event size must be normalized to multiple denominators: filer holding, related-group holding, ultimate-controller holding, free float and market capitalization where feasible.
- A large filer-level percentage is not automatically a large controller-level information event.

Secondary monthly reconstruction:
- A MOPS-derived secondary data page reports December 2025 insider market-sale net change of -5,180 lots for two persons/entities and no other-reason change, consistent with full completion of the combined intended transfer.
- Another secondary MOPS-derived page reports zero untransferred shares for the December transfer.
- These are reconstruction checks only. Because the interactive MOPS query could not be captured in this run, the exact original monthly MOPS first-known timestamp remains UNKNOWN.
- The monthly evidence therefore must not be used as an authoritative event timestamp for backtests until reconciled to original MOPS receipt/timestamp data.

### Cluster-signal falsification and pre-registration

Raw filing count is not an information-source count.

Required cluster fields:
- raw_filer_count;
- related_group_count;
- ultimate_controller_count;
- independent_information_source_count;
- related_group_id / ultimate_controller_id;
- same_day_cluster_flag and rolling-window cluster definition;
- aggregate_intended_transfer_shares;
- aggregate_realized_holding_delta where authoritative monthly evidence exists.

Rules:
1. Multiple legal entities under one ultimate controller are one controller group unless contemporaneous evidence proves independent economic control.
2. Same issuer/date observations must not be treated as independent statistical samples merely because several filing rows exist.
3. Event-window overlap must be controlled; one continuing transfer program cannot manufacture multiple independent cluster events.
4. Multi-insider clustering must be tested after controlling event size, prior return, firm size/liquidity, 52-week price position, transfer method, insider role, pledge state, controller cash-flow/control wedge and accounting-quality/news context.
5. Purchases and sales remain on asymmetric public clocks. Cluster-buy and cluster-sell tests require clock-specific definitions.
6. Related-person / nominee duplication must be collapsed before testing cluster alpha.

Evidence synthesis:
- Peer-reviewed international evidence reports that insider trades cluster, especially among close colleagues, and that clustered purchases can contain more information than isolated purchases in some samples.
- Other evidence finds stronger negative information around clustered sales than clustered purchases, while recent methodological work warns that overlapping event observations can exaggerate cluster significance.
- Taiwan evidence on pre-disclosed insider sales is heterogeneous: both positive and negative abnormal reactions appear, with effects varying by firm size, transfer type and price context. This rejects a universal 'cluster sell = bearish' rule.

### D21-03 maturity decision after replay

Keep D21-03 at L2 / 40%.

Positive progress:
- One concrete Taiwan case demonstrates ex-ante intention, later reconstructed monthly outcome and the necessity of controller-level de-duplication.
- Source contracts for daily transfer, untransferred-status and monthly post-report data are identified.

Why L3 remains closed:
- Exact original MOPS monthly first-known timestamp was not captured in this run.
- The completion check currently relies on secondary MOPS-derived reconstruction rather than an original receipt.
- A second independent case with a clearly different transfer motive/type is still needed before claiming broad replay feasibility.

No return-prediction or selection-alpha claim is established.

## D21-04 Share Pledging — research contract v0.1

Date: 2026-10-04 Asia/Taipei
Status: L2 MECHANISM_AND_FALSIFICATION_DEFINED / HISTORICAL_PLEDGE_REPLAY_PENDING / RESEARCH_ONLY / GOVERNANCE_TAIL_RISK

### Taiwan disclosure and legal semantics

Taiwan insider pledge evidence has at least two clocks:
- monthly insider holding / pledge-change reporting;
- event-level pledge setup/release disclosure, for which the company must file/publicly announce within the applicable statutory period after receiving notice.

Company Act Article 197-1 also creates a governance consequence: for a public company director, shares pledged in excess of one-half of the shares held at the time of election are excluded from voting-right exercise/counting under the statutory rule.

Therefore pledged shares are not only a financing-risk variable; at high levels they can interact with actual voting power and board-control interpretation.

### Competing mechanisms

Liquidity / funding motive:
- Share pledging can provide liquidity without selling stock and may be economically benign when leverage is modest and collateral buffers are large.

Margin-call / forced-sale risk:
- Falling stock prices can tighten collateral constraints and create pressure for additional collateral, refinancing, price support or forced sale.
- The risk is path-dependent and cannot be inferred from pledge ratio alone.

Control-retention / agency motive:
- A controller can retain voting exposure while monetizing personal wealth through pledging, potentially increasing the control-cash-flow wedge in economic terms and increasing minority-shareholder conflicts.

Corporate-policy spillover:
- Taiwan evidence links controller pledging to repurchase decisions, cash-holding value, investment policy and financing costs. Personal collateral stress can therefore spill into corporate decisions.

Regulatory / governance channel:
- Very high director pledging can reduce exercisable voting rights under Article 197-1, so pledge levels can alter the mapping from nominal ownership to effective control.

### Taiwan evidence synthesis

- Taiwan research using 2000-2015 data links controlling-shareholder pledges to margin-call pressure and to corporate repurchase behavior; pledge-related repurchase announcements are interpreted differently from ordinary repurchases.
- Taiwan listed-firm evidence links pledging with a lower marginal value of cash holdings, consistent with risk-aversion / agency channels, while repurchases can partly mitigate crash-risk concerns in some settings.
- Taiwan regulatory-change research shows that market responses around pledging firms depend on the governance/regulatory environment, rejecting the idea that pledging has one unconditional sign.
- More recent Taiwan evidence links insider pledging to higher corporate bank-loan costs, with effects varying by ownership structure.
- These results support governance-tail-risk and confidence roles, not a universal bearish hard gate.

### Falsification requirements

Before interpreting pledge evidence:
- distinguish new pledge, partial increase, partial release, full release, rollover/refinancing and forced liquidation;
- normalize pledged shares to insider/controller holdings and shares outstanding;
- aggregate related persons / nominee holders at controller-group level;
- separate director pledge from other insider/major-shareholder pledge;
- preserve pledge setup/release known_at and measurement date separately;
- control contemporaneous price drawdown, volatility, liquidity and market regime;
- control controller cash-flow/control wedge, board duality, insider transfer activity, repurchases/capital allocation, accounting quality and debt stress;
- identify whether Article 197-1 voting-right restriction becomes relevant;
- do NOT estimate a margin-call price unless loan-to-value, maintenance ratio, collateral terms and other required contract terms are known. Otherwise margin-call threshold = UNKNOWN.

### Candidate research features

- pledge_event_type;
- pledge_known_at;
- pledged_shares;
- pledge_to_insider_holding_ratio;
- pledge_to_controller_group_holding_ratio;
- pledge_to_shares_outstanding;
- pledge_ratio_change;
- controller_group_pledge_concentration;
- director_vote_restricted_shares_estimate where statutory inputs are complete;
- pre_event_drawdown / volatility / liquidity;
- concurrent_insider_transfer_flag;
- concurrent_repurchase / financing event;
- pledgee_type and maturity only when reliably disclosed;
- margin_call_threshold_known flag.

### D21-04 maturity decision

Advance D21-04 from L0 to L2 / 40%.

L1 satisfied:
- Taiwan disclosure/legal semantics and major economic mechanisms are defined.

L2 satisfied:
- benign-liquidity, margin-call, agency/control-retention, corporate-policy spillover and regulatory voting-right mechanisms are all retained as competing explanations.
- explicit falsification conditions and no-fabricated-margin-call rule are frozen.

L3 remains closed:
- no historical Taiwan pledge setup/release pair has yet been replayed end-to-end with original first-known timestamps and contemporaneous controller-group state.

Exact next continuation:
Build a historical D21-04 pledge PIT replay with at least one pledge setup and one release event, preferably for the same controller/issuer. Capture original known_at, pledged-share ratios at filer and controller-group levels, price path before/after the event, related insider transfers and Article 197-1 voting-right relevance. Do not infer a margin-call trigger unless loan contract terms are known. Preserve D21-03 exact monthly MOPS receipt as an unresolved dependency without blocking D21-04.

Formal Core impact: NONE.


## D21 multi-module deepening — 2026-10-04 morning block

Date: 2026-10-04 Asia/Taipei
Status: D21-04 PARTIAL_PLEDGE_REPLAY / D21-05 L2 / D21-07 L2 / D21-09 L2 / D21-10 L2 / FORMAL_CORE_UNCHANGED

## D21-04 Share Pledging — partial historical replay v0.2

### Taiwan paired setup/release reconstruction
New Product Insurance 2850 provides a usable partial reconstruction through structured public-market mirrors:
- major shareholder Shin Kong Textile Co., Ltd. had 20,000 lots pledged before 2024-12-19;
- 2024-12-19: +8,000 lots pledged, balance 28,000 lots, reported current holding 51,548 lots;
- 2025-01-23: -4,000 lots released, balance 24,000 lots;
- 2025-02-03: -5,000 lots released, balance 19,000 lots.

Interpretation:
- the pair proves that setup and release events can be sequenced and reconciled to a running pledge balance;
- pledge intensity moved from about 54.33% of the holder's reported position at 28,000 / 51,548 to about 36.86% at 19,000 / 51,548;
- the correct economic state is therefore a path, not a static binary pledge flag.

Why this does NOT promote D21-04 to L3:
- the event dates are currently reconstructed from a secondary structured mirror;
- exact original MOPS event receipts / first-known timestamps were not captured;
- the underlying loan terms, collateral maintenance ratio, maturity and other collateral remain UNKNOWN;
- no margin-call price may be inferred.

Durable lesson:
- pledge research must model state transitions (setup / increase / partial release / full release / rollover) and running balance.
- exact MOPS receipt remains required before L3.

## D21-05 Related-party Transactions — research contract v0.1

Status: L2 MECHANISM_AND_FALSIFICATION_DEFINED / PIT_TRANSACTION_REPLAY_PENDING / RESEARCH_ONLY

### 1. Taxonomy

Related-party transactions must be split by economic type rather than aggregated into one ratio:
- related sales / service revenue;
- related purchases / outsourced processing;
- related receivables / payables;
- loans to related parties;
- borrowings from related parties;
- guarantees / endorsements;
- asset purchases / disposals;
- real-estate / right-of-use transactions;
- equity investments / capital injections;
- other non-operating income / expense with related parties.

### 2. Competing mechanisms

Efficient contracting / internal-capital-market mechanism:
- business groups can use affiliated suppliers, customers and financing entities to reduce contracting frictions, coordinate production, share resources or fund high-return projects.
- Taiwan evidence shows some related-party product / processing sales can improve earnings informativeness.
- therefore high RPT intensity is not intrinsically bad.

Tunneling / self-dealing mechanism:
- controlling owners may transfer resources on non-arm's-length terms through sales, asset transfers, loans, guarantees or related financing.
- weak governance can make RPTs a vehicle for minority-shareholder expropriation.

Propping / earnings-management mechanism:
- affiliates can temporarily support revenue, earnings, working capital or financing around capital raising, earnings declines or financial pressure.
- this may improve short-run reported performance while weakening information quality.

### 3. Taiwan evidence synthesis

- Yeh, Shu and Su (2012) find stronger governance constrains RPT levels across related sales, lending/guarantees and related borrowings. Their evidence also gives partial support to both propping and internal-capital-market motives.
- Chen, Chen and Weng (2020) show that different revenue-related RPTs do not have one sign: related product/processing sales can increase earnings informativeness while related non-operating income can reduce it.
- Taiwan disclosure-regulation evidence shows enhanced disclosure reduced some RPT-related earnings-management behavior, with heterogeneous industry effects.
- Taiwan listed-firm evidence also links higher related sales/purchase intensity with greater real earnings-management activity in some samples.

Therefore a universal RPT penalty is rejected.

### 4. Official Taiwan control/disclosure architecture

- public companies' internal-control systems explicitly include management of related-party transactions, loans and guarantees.
- material related-party asset acquisitions/disposals can require pre-transaction board approval and audit-committee involvement.
- under the current asset-acquisition rules, certain related-party transactions above capital/assets/NT-dollar thresholds require formal approval before contract/payment; very large cases can require shareholder approval subject to stated exceptions.
- loans and guarantees have monthly and event-driven disclosure clocks. These are separate from annual financial-statement RPT notes.

### 5. PIT contract

Required fields:
- issuer;
- counterparty;
- historical_related_party_status;
- relationship_type;
- transaction_type;
- transaction_amount;
- denominator basis;
- announcement_or_filing_known_at;
- accounting_period;
- approval_date;
- board / audit-committee / shareholder-approval flags;
- stated purpose;
- pricing / valuation support if disclosed;
- consolidated_elimination_flag;
- recurrence / rolling-12m amount;
- transaction_counterparty_concentration;
- UNKNOWN flags for undisclosed terms.

Rules:
1. current related-party relationships may not be backfilled into older dates.
2. annual-report note disclosure is delayed evidence and must not be assigned to the underlying transaction date unless an earlier public filing exists.
3. intercompany transactions eliminated on consolidation still matter for governance research but cannot be mechanically compared with external revenue.
4. transaction amount must be normalized by relevant scale: sales, assets, net worth, cash, or controller-group exposure depending on type.
5. loans / guarantees need separate state and event clocks.
6. absence of disclosed RPT evidence is UNKNOWN when source coverage is incomplete.

### 6. Candidate research variables

- related_sales_ratio;
- related_purchase_ratio;
- related_receivable_ratio;
- related_lending_to_networth;
- related_guarantee_to_networth;
- related_borrowing_ratio;
- abnormal_RPT residual relative to industry / firm history;
- counterparty_concentration;
- RPT growth shock;
- RPT-to-cashflow divergence;
- transaction_before_equity_issue / earnings_decline indicators;
- governance interaction: control-cashflow wedge, board affiliation, pledge intensity;
- pricing_fairness / external valuation evidence where available.

### 7. Falsification requirements

Any predictive claim must survive:
- vertical-integration / supply-chain efficiency;
- firm size / industry / group-affiliation confounding;
- growth / capex funding demand;
- consolidation-boundary changes;
- acquisition/divestiture changing related-party status;
- currency / transfer-pricing / tax effects;
- earnings-management overlap with D07;
- ownership/control overlap with D21-01;
- tunneling overlap with D21-11.

### 8. Maturity

Advance D21-05 from L0 to L2 / 40%.
L3 remains closed pending historical Taiwan transaction replay across at least two transaction families and original first-known timestamps.

Formal Core impact: NONE.

## D21-07 Management Incentives / Capital Allocation Quality — research contract v0.1

Status: L2 MECHANISM_AND_FALSIFICATION_DEFINED / PIT_COMPENSATION_ALLOCATION_REPLAY_PENDING / RESEARCH_ONLY

### 1. Core principle

Compensation design is not the target variable by itself.
The research object is a chain:

incentive design -> managerial decision -> capital allocation -> realized economic outcome.

A seemingly shareholder-friendly equity incentive can still produce poor allocation; high compensation can coexist with excellent long-term investment; low compensation is not automatically disciplined governance.

### 2. Taiwan institutional baseline

Listed/OTC companies must establish a remuneration committee.
The committee is required to:
- formulate and periodically review policies, systems, standards and structures for director / manager performance evaluation and remuneration;
- periodically evaluate and determine remuneration;
- consider peer levels, individual performance, company operating performance and future risk;
- avoid incentives that encourage risk beyond the company's risk appetite;
- consider industry/business characteristics in short-term bonus proportions and payment timing.

The covered remuneration concept includes cash, stock options, stock-based profit sharing, retirement/severance, allowances and other substantive incentives.

### 3. Competing mechanisms

Alignment / long-horizon investment:
- performance-sensitive or equity-linked pay may align managers with shareholders and encourage investment in R&D and operating efficiency.
- Taiwan evidence from listed firms reports positive association between managerial compensation and both R&D investment and operating efficiency.

Short-termism / metric gaming:
- bonus metrics tied to short-horizon earnings, EPS or ROE can induce earnings timing, underinvestment, leverage changes or repurchases that improve the metric without improving long-run value.
- a metric such as ROE can change mechanically with leverage/equity-base decisions.

Overconfidence / control interaction:
- Taiwan evidence links short-term bonuses/equity incentives and managerial overconfidence to repurchase behavior.
- family-control and CEO-chair duality can alter repurchase motives because repurchases change ownership/control structure.

Reverse causality:
- high pay may be a consequence of superior growth opportunities or R&D success rather than the cause.
- higher R&D / efficiency may lead boards to reward executives ex post.

### 4. Capital-allocation outcome map

Research must link incentives to:
- R&D;
- capital expenditure;
- acquisitions / divestitures;
- share repurchases;
- dividends;
- debt issuance / repayment;
- equity issuance / private placement;
- cash accumulation;
- working-capital investment.

Outcome quality cannot be inferred from direction alone.
Example: more capex may be good under high-return opportunities and bad under empire building.

### 5. PIT contract

Required evidence:
- historical compensation policy / committee disclosure vintage;
- fixed vs variable / cash vs equity component where disclosed;
- performance metrics and measurement horizon where disclosed;
- grant/vesting/exercise conditions;
- board/committee approval date;
- allocation decision known_at;
- ex-ante opportunity set / financial constraints;
- later realized ROIC / margins / cash flow / write-offs with a strict future-outcome separation.

Rules:
- future performance cannot be used to construct the decision-time feature;
- policy presence is not equivalent to effective incentive intensity;
- aggregate compensation disclosure cannot be treated as CEO-specific pay;
- missing individual pay components remain UNKNOWN;
- employee stock plans and executive incentives must be separated.

### 6. Candidate variables

- variable_pay_share;
- equity_incentive_share;
- short_horizon_metric_exposure;
- long_horizon_vesting_share;
- pay_performance_sensitivity;
- compensation_growth_minus_performance_growth;
- R&D / capex / repurchase / payout responses after incentive changes;
- investment_efficiency residuals;
- ROIC spread versus cost-of-capital proxies after allocation;
- write-off / impairment / acquisition-performance follow-up;
- governance interactions with family control, CEO-chair duality and board independence.

### 7. Falsification requirements

- endogeneity / reverse causality;
- talent-market compensation;
- firm size;
- industry / technology intensity;
- risk;
- lifecycle / growth opportunities;
- tax / accounting-rule changes;
- buyback motives unrelated to incentives;
- equity-compensation dilution;
- compensation disclosure incompleteness.

### 8. Maturity

Advance D21-07 from L0 to L2 / 40%.
L3 remains closed until Taiwan historical compensation-policy and allocation-decision PIT replay is demonstrated.

Formal Core impact: NONE.

## D21-09 Succession / Key-person Risk — research contract v0.1

Status: L2 MECHANISM_AND_FALSIFICATION_DEFINED / HISTORICAL_SUCCESSION_REPLAY_PENDING / CONTEXT_ONLY / GOVERNANCE_TAIL_RISK

### 1. Event taxonomy

Succession research must distinguish:
- planned retirement / staged succession;
- sudden death / illness / incapacity;
- resignation;
- dismissal / forced turnover;
- family heir succession;
- internal non-family professional succession;
- external professional hire;
- interim / acting appointment;
- chairperson change;
- CEO / general-manager change;
- CFO / chief accounting officer / governance officer change where economically material;
- founder remains board/controller after operational succession versus full exit.

### 2. Competing mechanisms

Continuity / firm-specific capital:
- internal or family successors may preserve tacit knowledge, relationships and culture.

Capability / professionalization:
- outside professional successors may improve performance when family talent is limited, especially under high product-market competition.

Entrenchment:
- family succession can preserve control even when successor quality is weak.

Disruption / uncertainty:
- any succession can temporarily increase execution uncertainty, employee/customer/supplier risk and strategic drift.

Planned-transition mitigation:
- overlap periods, clear delegation and pre-announced successors can reduce key-person shock.

### 3. Taiwan evidence synthesis

- Taiwan listed-company studies show family CEO turnover dynamics differ materially from non-family firms.
- A 382-event Taiwan family-firm study (1997-2016) finds stronger product-market competition increases non-family succession and that non-family successors can improve post-succession performance; higher family ownership/management participation predicts family succession.
- Other Taiwan evidence reports succession on average can be associated with weaker performance, but results differ by successor type; some samples find internal/family successors outperform other relatives or external successors.
- 2026 Taiwan evidence on post-succession strategies shows outcomes depend on heir background and the strategy adopted: internal-improvement / R&D-oriented strategies can outperform, while contraction and some equity-financed expansion can underperform.

These conflicting findings reject a universal rule such as family successor = bad or outside CEO = good.

### 4. PIT/event-clock contract

Required:
- first public announcement known_at;
- board resolution date;
- effective date;
- predecessor departure reason;
- acting/interim flag;
- successor relationship to controlling family;
- internal/external tenure and prior role;
- founder/chair/controller continuing involvement;
- succession plan or overlap period if publicly disclosed;
- concurrent board/control changes;
- regulatory reporting vintage.

For listed firms, chair/CEO relationship and relevant board-role changes have prompt disclosure obligations. Current roster must never be backfilled.

### 5. Candidate variables

- succession_type;
- planned_vs_unplanned;
- predecessor_tenure;
- successor_internal_tenure;
- family_relation;
- overlap_days;
- founder_remains_controller;
- chair_CEO_role_change;
- concurrent_CFO_CAOfficer_turnover;
- cluster_turnover_count;
- product_market_competition;
- pre_event_performance / distress;
- post-event strategic actions studied only as later outcomes.

### 6. Falsification requirements

- poor performance causes turnover rather than turnover causes poor performance;
- succession can coincide with retirement age or board election cycle;
- sudden-event health/death cases differ from planned events;
- founder remains shadow controller;
- family/non-family classification can be ambiguous through marital/related-person networks;
- industry/firm lifecycle and competition alter successor choice;
- post-succession strategy, not successor identity, may drive outcomes.

### 7. Maturity and role

Advance D21-09 from L0 to L2 / 40%.
Role: CONTEXT_ONLY / GOVERNANCE_TAIL_RISK / CONFIDENCE by default.
L3 remains closed pending date-specific Taiwan succession replay.

Formal Core impact: NONE.

## D21-10 Audit / Restatement / Internal Control — research contract v0.1

Status: L2 MECHANISM_AND_FALSIFICATION_DEFINED / PIT_EVENT_REPLAY_PENDING / GOVERNANCE_TAIL_RISK / RESEARCH_ONLY

### 1. Event taxonomy

Do not merge:
- financial-statement correction / supplement below restatement threshold;
- formal restatement;
- regulator-initiated restatement;
- company-initiated restatement;
- auditor-qualified opinion;
- adverse opinion / disclaimer;
- material uncertainty / going-concern language;
- auditor change;
- internal-audit-head change;
- internal-control statement with material weakness;
- regulator-ordered special internal-control review;
- material fraud / suspected fraud;
- remediation / repeated weakness.

### 2. Taiwan regulatory materiality

Taiwan enforcement rules set quantitative thresholds that distinguish formal restatement from smaller corrections.
For example, individual financial statements and consolidated financial statements use separate absolute and percentage thresholds for income-statement and balance-sheet corrections.
Smaller errors may be corrected without full restatement, while listed-company correction/supplement disclosures have their own prompt filing clock.

Therefore:
- RESTATEMENT is not interchangeable with any correction;
- threshold and rule vintage must be stored.

Public-company internal-control rules define effective versus materially deficient internal control and require tracking/remediation of identified weaknesses.
The FSC can require special CPA review for serious control failures, unreliable external financial reporting, suspected fraud and other specified conditions.

### 3. Mechanisms

Information-quality failure:
- restatements and material weaknesses can reveal prior financial-report unreliability.

Control-environment failure:
- recurring or broad deficiencies can indicate weak management integrity, risk assessment or supervision.

Detection/remediation mechanism:
- disclosure of a weakness can also mean monitoring is functioning; a remediated weakness may be less risky than an undisclosed persistent problem.

Severity / direction:
- overstated past earnings and regulator-initiated corrections can carry different information from conservative understatements or classification errors.

### 4. Taiwan evidence synthesis

- Taiwan event-study evidence on restatements documents negative average market reaction, with stronger negative reactions where prior income was overstated; one Taiwan study reports positive reaction for income-understatement corrections.
- Taiwan research on 724 listed companies (2004-2010) finds internal-control weaknesses associated with lower performance, with more severe weakness categories associated with worse outcomes.
- Another Taiwan non-financial listed-company study (2004-2013) likewise reports negative relation between internal-control weakness and firm performance, moderated by governance quality.
- International evidence also warns that remediation changes the interpretation of a weakness; persistent/unremediated weakness should not be pooled with corrected problems.

### 5. PIT contract

Required:
- event_type;
- original_report_known_at;
- correction/restatement_known_at;
- affected fiscal periods;
- initiator;
- error category;
- direction/magnitude of earnings/equity change;
- rule_vintage and restatement threshold;
- auditor opinion before/after;
- auditor change / audit-partner data where reliable;
- internal-control statement vintage;
- material_weakness category;
- remediation date / repeated flag;
- regulator enforcement linkage.

Rules:
1. never rewrite historical financial features using restated values before the restatement became public.
2. maintain both originally-known and subsequently-restated versions.
3. a regulator-forced restatement is a different event type from voluntary correction.
4. classification-only corrections should not inherit the same severity as income/equity overstatement automatically.
5. remediation must be modeled as a state transition, not deletion of the original weakness.

### 6. Candidate variables

- restatement_severity;
- earnings_overstatement_ratio;
- equity_overstatement_ratio;
- regulator_initiated_flag;
- repeated_restatement_count;
- days_from_original_report_to_correction;
- auditor_opinion_deterioration;
- auditor_change_near_event;
- internal_control_material_weakness;
- repeated_weakness;
- remediation_lag;
- management_integrity / fraud-category flag only with reliable evidence.

### 7. Falsification / redundancy

- accounting-complexity and acquisition activity can raise correction frequency without fraud;
- rapid remediation can mitigate risk;
- firm distress can cause both control failures and poor returns;
- auditor conservatism may increase detected issues;
- D07 accounting-quality variables may already absorb part of the signal;
- D11 event-risk clocks can overlap the announcement effect.

### 8. Maturity and role

Advance D21-10 from L0 to L2 / 40%.
Role: GOVERNANCE_TAIL_RISK / CONFIDENCE / RESEARCH_ONLY until predictive evidence is established.
L3 remains closed pending historical Taiwan correction/restatement and internal-control event replay with original first-known timestamps and dual-vintage financial data.

Formal Core impact: NONE.


## D21 historical replay promotion block — 2026-10-04 late morning

Date: 2026-10-04 Asia/Taipei
Status: D21-05 L3 / D21-10 L3 / D21-11 L2 / FORMAL_CORE_UNCHANGED

## D21-05 Historical Related-party Transaction Replay v0.2

### Decision-time replay rule

For the formal daily after-market research clock, historical replay does not require pretending to know an unknowable first internet appearance. It requires a conservative public-availability proof before the decision timestamp.

Store:
- event_date;
- observed_public_at;
- source_class;
- issuer_archive_date;
- exact_first_known_status;
- safe_for_after_market_replay flag.

If an independently archived MOPS-fed announcement has a timestamp before the daily decision time and the issuer's official archive matches the event date/content, the event is safely known by the later decision timestamp even if the original MOPS receipt is unavailable. This supports daily PIT replay but not intraday first-minute event studies.

### Replay A — Yuanta Financial 2885 / related-party real-estate disposal

Issuer: Yuanta Financial Holding / subsidiary Yuanta International Asset Management.
Event: disposal of Taipei Nangang real estate to EirGenix, explicitly identified as a related party.
Event date: 2024-04-29.
Observed public timestamp from MOPS-fed market archive: 2024-04-29 16:46:05.
Issuer official archive date: 2024-04-29.
Transaction amount: NT$133,000,000.
Counterparty relation: related party; stated reason for choosing the party was that it was the existing tenant.
Professional appraisal: NT$124,102,144.
Expected disposal gain: about NT$47,237,651.
Decision unit: board.
Board approval: 2024-04-29.
Audit committee / supervisor approval: 2024-04-29.
Stated purpose: realize investment value and strengthen financial structure.
RPT family: asset disposal / real estate.

Interpretation:
- this is not an operating-sales RPT and should not be mixed with related sales/purchases;
- disclosed appraisal and same-day board/audit approval are governance-process fields, not proof that pricing is automatically fair;
- the transaction must be evaluated versus appraisal range, alternative counterparties, recurring relationship concentration and later cash realization if used for any substantive inference.

PIT result:
- safe for same-day after-market replay because the observed public archive timestamp precedes the formal after-market decision time;
- exact original MOPS first-known second remains UNKNOWN but is not required for a later daily decision clock.

### Replay B — Yuanta Financial 2885 / capital injection into 100%-owned related subsidiary

Event: subscription of Yuanta Life Insurance cash capital increase.
Event date: 2024-07-26.
Observed public timestamp from MOPS-fed market archive: 2024-07-26 16:26:47.
Issuer official archive date: 2024-07-26.
Amount: NT$3,000,000,000.
Counterparty: Yuanta Life Insurance, 100%-owned subsidiary.
Post-transaction disclosed holding: 100%.
Board approval: 2024-07-26.
Audit committee consent: 2024-07-16.
Stated purpose: strengthen operating funds, financial structure, capital adequacy and net-worth ratio.
RPT family: equity investment / internal capital allocation.

Interpretation:
- this event illustrates an internal-capital-market mechanism rather than an obvious tunneling transaction;
- a large RPT can be economically rational and regulatory-capital driven;
- any future score that mechanically penalizes related-party transaction size would misclassify this type of event.

PIT result:
- safe for same-day after-market replay because observed public timestamp precedes the decision time;
- event clock and approval clocks are independently reconstructable.

### Cross-case conclusion

The two cases demonstrate that Taiwan historical RPT events are daily-PIT replayable across at least two economically different transaction families:
1. related-party real-estate disposal;
2. capital injection into a wholly-owned related subsidiary.

Mandatory future classification fields:
- transaction_family;
- observed_public_at;
- exact_first_known_status;
- board_approval_date;
- audit_committee_approval_date;
- related_party_relationship;
- stated_purpose;
- valuation_support;
- transaction_amount and scale ratios;
- recurring_counterparty flag;
- transaction_direction / beneficiary;
- consolidated-group flag.

### D21-05 maturity decision

Advance D21-05 from L2 / 40% to L3 / 60%.

L3 rationale:
- historical Taiwan event-level data are demonstrably replayable for two RPT families;
- event and approval clocks can be separated;
- relationship and transaction purpose are preserved;
- conservative observed-public timestamps support daily after-market PIT use.

L4 remains closed:
- no OOS/prospective return-risk evidence;
- no cross-sectional proof that abnormal RPT measures add value beyond D21-01, D07, D11 or industry/size controls.

Role: RESEARCH_ONLY / CONTEXT / GOVERNANCE_TAIL_RISK.
Formal Core impact: NONE.

## D21-10 Historical Dual-vintage Restatement Replay v0.2

### Replay A — ACON-Holding / TAI-TWAN? Taiwan Terminal 3432 (台端)

Public announcement:
- event date: 2024-04-23;
- MOPS-fed archive timestamp: 2024-04-23 16:39:54;
- event type: formal restatement of 2022 annual through 2023 annual/interim reports.

Reason:
- reassessment of deferred tax asset related to investment loss and recoverability, with NT$170,010 thousand adjustment rooted in the 2022 accounting estimate.

Dual-vintage examples:
2022 consolidated:
- deferred tax asset: 170,409 -> 399 thousand;
- total assets: 488,262 -> 318,252 thousand;
- total equity: 442,802 -> 272,792 thousand;
- net loss: -1,170,230 -> -1,340,240 thousand;
- basic EPS: -17.57 -> -20.13.

2023 annual:
- net loss: -191,629 -> -21,619 thousand;
- basic EPS: -5.32 -> -0.60,
because the later-period reversal interacted with the earlier restatement.

Key falsification:
- a restatement is not directionally equivalent to “earnings became worse in every affected period.”
- one correction can worsen an earlier period while improving a later period because accounting reversals propagate across vintages.
- backtesting must preserve original values until public restatement known_at, then create a new corrected vintage.

PIT result:
- the restatement was publicly observable before the same day's after-market decision time;
- original and corrected values are explicitly disclosed in the announcement, enabling deterministic dual-vintage replay.

### Replay B — Leader Electronics 3058 (立德)

Observed public archive:
- 2025-05-15 09:10 for the announcement covering 2023 Q3 / annual 2023 / 2024 Q2-Q4 corrections and restatements;
- fact date stated as 2025-05-14.

Cause:
- senior manager violated internal-control rules;
- an unlisted investee's stock dividend was not properly recorded;
- 5 million shares were privately disposed without recording the transaction or collecting funds;
- 2024 dispositions totaled 9.5 million shares with NT$100,198 thousand receivable, later collected before the 2024 annual report was approved.

Interpretation:
- this is not a mere estimation-change case; it combines restatement with control-environment failure and management override risk;
- event severity must preserve cause category and remediation/cash-recovery status;
- “restatement” alone is too coarse.

PIT result:
- by the 2025-05-15 after-market decision point the event was unquestionably public;
- the case demonstrates replay of a materially different cause class from the 3432 case.

### D21-10 maturity decision

Advance D21-10 from L2 / 40% to L3 / 60%.

L3 rationale:
- two Taiwan cases with materially different causes are historically replayable;
- one case exposes original-versus-corrected financial values directly;
- event date, observed public availability, affected periods, cause, correction/restatement type and remediation context can be preserved.

L4 remains closed:
- no prospective/OOS validation of severity classes;
- no proof yet that a restatement-risk feature adds incremental stock-selection value beyond D07 accounting quality and D11 event-risk variables.

Role remains GOVERNANCE_TAIL_RISK / CONFIDENCE / RESEARCH_ONLY.
Formal Core impact: NONE.

## D21-11 Tunneling / Minority Shareholder Risk — ownership-boundary contract v0.1

Status: L2 MECHANISM_FALSIFICATION_AND_OWNER_BOUNDARY_FROZEN / DERIVED_RISK_LAYER / RESEARCH_ONLY

### 1. Ownership boundary

D21-11 does NOT own the raw inputs already owned elsewhere:
- ownership/control wedge -> D21-01;
- pledge -> D21-04;
- related-party transaction classification -> D21-05;
- accounting quality -> D07;
- event announcement clocks -> D11.

D21-11 owns the higher-order question:
Is there credible evidence that value is being transferred away from the listed issuer / non-controlling shareholders toward a controller-related beneficiary on terms inconsistent with ordinary economic exchange?

This makes D21-11 a derived risk-classification layer, not another raw factor family.

### 2. Evidence states

CONFIRMED_TUNNELING:
- legal/regulatory/court finding or sufficiently explicit issuer disclosure confirms non-arm's-length extraction or misappropriation.

HIGH_SUSPICION:
- multiple independent channels jointly indicate directional value extraction, with beneficiary linkage and weak economic justification.

AMBIGUOUS:
- suspicious RPT/control pattern exists but efficient-contracting/propping explanations remain plausible.

INSUFFICIENT:
- only one generic risk input such as high RPT ratio, high pledge or control wedge is present.

UNKNOWN:
- necessary beneficiary/pricing/relationship evidence is unavailable.

No risk state is inferred merely from a single RPT or a high control wedge.

### 3. Positive mechanism

Controlling shareholders can transfer value through:
- non-arm's-length asset transfers;
- preferential loans or guarantees;
- related sales/purchases with distorted terms;
- diversion of corporate opportunities;
- selective capital injections / withdrawals;
- misappropriation or management override;
- structures where voting control materially exceeds economic ownership.

Taiwan evidence documents RPTs as one possible tunneling/propping channel and shows governance quality conditions their use.

### 4. Counter-mechanisms / falsification

- group internal capital markets can allocate resources efficiently;
- related transactions can reduce contracting costs;
- financial support can be propping rather than extraction;
- vertical integration creates high related sales/purchases without abuse;
- distressed affiliates can be supported for strategic network reasons;
- controller ownership can align incentives when cash-flow rights are high;
- a transaction that appears unfavorable ex ante can be justified by independent valuation or long-horizon synergies.

Therefore tunneling classification requires direction, beneficiary, economic terms and control context.

### 5. Proposed derived evidence fields

- beneficiary_controller_linkage;
- transfer_direction;
- abnormal_pricing_or_terms;
- repayment_quality;
- guarantee_loss_realization;
- asset_value_gap;
- repeated_related_counterparty_pattern;
- control_cashflow_wedge_dependency;
- pledge_pressure_dependency;
- management_override_or_fraud_flag;
- independent_valuation_support;
- board/audit dissent or override;
- legal_or_regulatory_finding;
- remediation/recovery_status.

### 6. Anti-double-counting rule

D21-11 must not independently add another point for each raw governance risk already scored elsewhere.
If used in future research, it must either:
- serve as a categorical tail-risk state; or
- test incremental value after conditioning on D21-01/04/05 and D07 inputs.

No additive composite is approved.

### 7. Taiwan evidence / monitoring relevance

- Taiwan empirical literature supports both tunneling and propping/internal-capital-market explanations for RPTs.
- TWSE's 2024 financial-report review explicitly checked reasonableness/necessity, arm's-length pricing, approval processes, information disclosure and recoverability of major related receivables/prepayments; the review found some companies had failed to properly disclose substantive related-party relationships.
- This supports a process/relationship/beneficiary lens rather than a raw RPT-size lens.

### 8. Maturity decision

Advance D21-11 from L0 to L2 / 40%.

Reason:
- unique ownership boundary is defined;
- derived evidence states are specified;
- mechanisms, counter-mechanisms and anti-double-counting rules are frozen.

L3 remains closed:
- no historical Taiwan tunneling classification replay has yet demonstrated reproducible CONFIRMED / HIGH_SUSPICION / AMBIGUOUS labeling from contemporaneous evidence.

Role: GOVERNANCE_TAIL_RISK / CONFIDENCE / RESEARCH_ONLY.
Formal Core impact: NONE.

Exact continuation:
1. Build a historical D21-11 case set containing at least one confirmed/near-confirmed value-extraction case and one economically justified RPT control case.
2. Require contemporaneous beneficiary, pricing/terms, control and approval evidence.
3. Test whether D21-11 classification adds information beyond D21-01/04/05 instead of double counting them.
