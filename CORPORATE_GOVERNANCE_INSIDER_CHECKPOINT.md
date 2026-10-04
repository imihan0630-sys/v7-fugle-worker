# Corporate Governance / Insider Checkpoint

Updated: 2026-10-04 21:25 Asia/Taipei
Scope: D21｜公司治理／經營者／內部人／控制權品質
Status: D21-01 L3 / D21-02 L3 / D21-03 L2 / D21-04 L2 / D21-05 L3 / D21-07 L3 / D21-09 L3 / D21-10 L3 / D21-11 L3 / D21-12 L3 / D21-13 L3 / FORMAL_CORE_UNCHANGED

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


## 2026-10-04 accelerated deepening block

### D21-04 pledge replay
- New Product Insurance 2850 / major shareholder Shin Kong Textile provides a partial historical state-transition case: +8,000 pledged lots on 2024-12-19 (balance 28,000), -4,000 released on 2025-01-23 (balance 24,000), and -5,000 released on 2025-02-03 (balance 19,000), against a reported 51,548-lot position.
- Pledge intensity therefore fell from about 54.33% to 36.86%.
- Exact original MOPS receipts remain unavailable in this replay; event dates currently come from a structured secondary mirror. D21-04 remains L2 / 40%, not L3.
- Margin-call level remains UNKNOWN because loan terms are unavailable.

### D21-05 RPT
- Advance D21-05 L0 -> L2 / 40%.
- Freeze separate transaction families: sales, purchases, receivables/payables, loans, borrowings, guarantees, assets/real estate, investments and non-operating items.
- Freeze competing mechanisms: efficient contracting/internal capital market, tunneling/self-dealing, propping/earnings management.
- Taiwan evidence rejects a universal negative sign. Some operating RPTs can improve earnings informativeness; other non-operating or financing RPTs can weaken it.
- PIT requirements: historical relationship status, transaction type/amount, known_at, approval clock, purpose/pricing support, consolidation treatment, scale normalization and UNKNOWN semantics.
- L3 pending at least two historical Taiwan RPT transaction-family replays.

### D21-07 incentives and capital allocation
- Advance D21-07 L0 -> L2 / 40%.
- Research object is incentive design -> decision -> allocation -> realized outcome, not compensation level alone.
- Taiwan remuneration-committee rules require periodic review of performance/remuneration structures, linkage to operating performance and future risk, and avoidance of incentives exceeding risk appetite.
- Freeze competing mechanisms: alignment/long-horizon investment, short-termism/metric gaming, overconfidence/control interaction, reverse causality/talent-market pay.
- Candidate allocation outcomes: R&D, capex, M&A, repurchases, dividends, debt/equity financing and cash accumulation.
- L3 pending historical compensation-policy plus allocation-decision PIT replay.

### D21-09 succession/key-person
- Advance D21-09 L0 -> L2 / 40%.
- Freeze event taxonomy: planned/unplanned, death/illness, resignation/dismissal, family/internal/external successor, interim appointment, chair/CEO/CFO/accounting-officer changes and founder-retains-control state.
- Taiwan evidence is heterogeneous: family/internal continuity can preserve firm-specific knowledge, while professional succession can improve outcomes in competitive industries. Successor identity alone is not a monotonic score.
- Role defaults to CONTEXT_ONLY / GOVERNANCE_TAIL_RISK / CONFIDENCE.
- L3 pending historical date-specific succession replay.

### D21-10 audit/restatement/internal control
- Advance D21-10 L0 -> L2 / 40%.
- Freeze distinct event types: correction, formal restatement, regulator/company initiation, auditor opinion deterioration, auditor change, internal-audit-head change, material weakness, special CPA review, fraud/suspected fraud and remediation.
- Taiwan rules distinguish corrections from restatements using quantitative materiality thresholds; rule vintage is mandatory.
- Historical financial research must preserve both originally-known and later-restated versions. Never rewrite the past with the corrected figures before public known_at.
- Taiwan evidence supports more negative interpretation for earnings overstatement/material control weaknesses, but remediation and error type matter.
- L3 pending Taiwan historical dual-vintage event replay.

## Exact next continuation
Priority 1: attempt original-source historical D21-04 pledge setup/release receipt recovery; do not promote without authoritative known_at.
Priority 2: build D21-05 historical replay using at least two economically different RPT families, preferably one operating RPT and one financing/guarantee RPT, preserving relationship vintage and announcement/approval clocks.
Priority 3: build D21-10 dual-vintage restatement replay preserving both originally-known and corrected financial values.
D21-07 and D21-09 remain L2 until date-specific Taiwan replay is completed.
No Formal optimization candidate exists.

Formal Core impact: NONE.


## 2026-10-04 08:38 D21-05 RPT replay continuation

- D21-05 remains L2 / 40%; no maturity promotion.
- Taiwan official disclosure architecture confirms RPT evidence has multiple clocks: periodic financial-statement notes, monthly loan/guarantee filings, event-driven asset transactions, and threshold-triggered material information.
- Concrete financing-family replay: 2760 巨宇翔's 2026-10-01 material information records subsidiary Ding Tea Corporation guaranteeing its parent. Board approval for facility renewal was 2026-09-29; original guarantee balance NTD70m, new guarantee NTD70m, post-event balance NTD140m, actual drawdown NTD56m, with the stated purpose being renewal of a parent financing facility.
- Semantic guard: guarantee balance != actual cash drawdown; renewal != automatically new extraction; parent/subsidiary direction and collateral/capacity must be retained.
- TWSE 2024 annual-report/financial-statement review explicitly checks RPT necessity, arm's-length terms, decision/publication process, accounting disclosure, receivable recoverability and possible disguised financing. Some firms had deficient substantive-related-party disclosure or asset-transaction approval/valuation procedures.
- Research implication: abnormal terms/process failures/overdue balances are more specific governance-risk states than raw RPT intensity.
- Counterevidence retained: efficient internal contracting, treasury support and vertical integration.
- D21-11 may not duplicate D21-05 raw RPT variables as a second negative vote.
- L3 remains blocked until a second economically different Taiwan RPT family (operating or asset transaction) has native historical relationship/approval/public-known-at replay.
- No return outcomes, OOS, walk-forward or prospective Shadow inspected. Formal Core unchanged. FORMAL_OPTIMIZATION_CANDIDATE=NONE.

Exact next continuation:
1. Find and replay one native Taiwan operating RPT or related-party asset transaction with historical relationship status, approval clock and public filing clock.
2. Then reassess D21-05 L3 source/PIT feasibility only.
3. If source route blocks, move to D21-10 dual-vintage correction/restatement replay without changing D21-05 maturity.


## 2026-10-04 late-morning durable continuation

### D21-05 historical RPT replay
- Yuanta Financial 2885 provides two economically different related-party event families with conservative daily-PIT replay:
  1. 2024-04-29 related-party real-estate disposal, observed in a MOPS-fed archive at 16:46:05 and cross-checked against Yuanta's official same-day archive. Amount NT$133m; counterparty EirGenix identified as related party; existing tenant was stated reason; professional appraisal NT$124.102m; expected gain about NT$47.238m; board and audit approval same day.
  2. 2024-07-26 NT$3bn capital injection into 100%-owned Yuanta Life, observed in a MOPS-fed archive at 16:26:47; board approval 2024-07-26 and audit committee consent 2024-07-16; stated purpose was operating funds / financial structure / capital adequacy.
- These two cases prove daily after-market PIT feasibility across asset-disposal and internal-capital-allocation RPT families.
- Use observed_public_at for conservative daily replay; original MOPS first-known second can remain UNKNOWN unless intraday event-study precision is required.
- D21-05 advances L2 -> L3 / 60%.
- L4 remains closed pending OOS/prospective evidence and redundancy tests.

### D21-10 dual-vintage restatement replay
- Taiwan Terminal 3432: 2024-04-23 announcement observed at 16:39:54 restated 2022 annual through 2023 periods. 2022 consolidated equity moved from NT$442.802m to NT$272.792m and EPS from -17.57 to -20.13; 2023 annual EPS moved from -5.32 to -0.60 because the later-period reversal interacts with the earlier restatement.
- This proves why original financial values must remain the historical vintage until restatement known_at, with corrected values entering only afterward.
- Leader Electronics 3058: 2025-05-15 public archive described restatement/corrections caused by senior-manager internal-control violations, unrecorded stock dispositions and uncollected proceeds, providing a materially different cause class from an accounting-estimate restatement.
- D21-10 advances L2 -> L3 / 60%.
- L4 remains closed pending prospective/OOS severity validation and redundancy tests versus D07/D11.

### D21-11 ownership boundary
- Advance D21-11 L0 -> L2 / 40%.
- D21-11 is frozen as a derived tunneling/minority-risk classification layer, not a duplicate raw-factor family.
- Raw ownership wedge remains D21-01; pledge D21-04; RPT classification D21-05; accounting quality D07; event clock D11.
- Tunneling requires directional value transfer, controller-related beneficiary, terms/pricing evidence and control context.
- Evidence states: CONFIRMED_TUNNELING / HIGH_SUSPICION / AMBIGUOUS / INSUFFICIENT / UNKNOWN.
- A single high RPT ratio, pledge ratio or control wedge is never enough to classify tunneling.
- No additive composite or Formal gate is approved.

## Exact next continuation
1. Build D21-11 historical case-set replay with at least one confirmed/near-confirmed extraction case and one economically justified RPT control case, using contemporaneous beneficiary/terms/control evidence.
2. Continue D21-04 original MOPS pledge receipt recovery when source access allows; do not promote from secondary dates alone.
3. After D21-11 replay, move to D21-12 management-guidance credibility rather than mechanically extending overlapping governance composites.
4. D21-05 and D21-10 next promotion requires OOS/prospective evidence; no theory-only L4.

Formal Core impact: NONE.


## 2026-10-04 afternoon durable continuation

### D21-11 replay result
- A confirmed adverse case and a justified-RPT control case are now durable in the research file.
- Positive case: historical Ful-Hwa/Loyalty Founder Enterprise 5465 transaction later received judicial findings of non-arm's-length / special breach-of-trust conduct with quantified company loss and beneficiary linkage.
- Control case: Yuanta Financial related-party transaction with explicit economic purpose, valuation/governance process and no established extraction beneficiary.
- Critical anti-look-ahead rule: later court findings are ex-post labels only from adjudication/publication known_at onward. They cannot be backfilled to the original transaction date.
- D21-11 remains L2 / 40%, because a contemporaneous original transaction-date public receipt for the confirmed extraction case has not yet been recovered. The classifier logic is validated, but full historical decision-time reproducibility is not.
- Next for D21-11: recover contemporaneous public evidence or find a second high-suspicion case with public beneficiary/terms/control evidence available at the decision time.

### D21-12 management-guidance credibility
- Advance D21-12 L0 -> L2 / 40%.
- Freeze separate guidance channels: formal financial forecast, investor-conference guidance, material-announcement forward statements, and non-scorable generic optimism.
- Taiwan source framework is replayable in principle through MOPS, issuer IR archives, TWSE/WebPro and formal forecast filings.
- Freeze mechanisms: credibility history, information-efficiency benefit, strategic optimism/self-selection, meet-or-beat/earnings-management behavior, and genuine external uncertainty.
- Credibility must be rolling and based only on outcomes already public at the decision timestamp.
- Candidate fields include signed/absolute error, range hit, optimistic/pessimistic bias, revision frequency/magnitude/timing, withdrawal, assumption attribution, guidance continuity and manager identity.
- Management turnover requires identity-version handling; predecessor credibility does not automatically transfer.
- Qualitative statements with no machine-codable falsifiable proposition remain NON_SCORABLE.
- Role remains RESEARCH_ONLY / CONFIDENCE / GOVERNANCE_TAIL_RISK until historical replay and OOS evidence exist.

## Exact next continuation
1. Build D21-12 two-issuer numeric-guidance historical replay from original guidance known_at through revision history to actual-outcome known_at.
2. Prefer one relatively accurate guidance history and one repeated optimistic/revision-heavy history.
3. Test incremental value versus analyst coverage, earnings revisions, fundamental quality and event/news controls.
4. In parallel when source access permits, continue D21-11 contemporaneous-receipt recovery; do not promote D21-11 from later adjudication alone.
5. After D21-12 replay, begin D21-13 materiality-focused ESG/climate/social risk contract without importing generic ESG scores.

Formal Core impact: NONE.


## 2026-10-04 guidance-materiality durable continuation

### D21-12 guidance replay
- TSMC 2024 provides three clean numeric quarterly revenue-guidance observations:
  - 2Q24 guide US$19.6-20.4bn -> actual US$20.82bn, above upper bound;
  - 3Q24 guide US$22.4-23.2bn -> actual US$23.50bn, above upper bound;
  - 4Q24 guide US$26.1-26.9bn -> actual US$26.88bn, within range near upper bound.
- MediaTek provides multiple numeric quarterly revenue-guidance observations with event times in its investor calendar:
  - 3Q24 guide NT$123.5-132.4bn -> actual NT$131.813bn, within range;
  - 4Q24 guide NT$126.5-134.5bn -> actual NT$138.043bn, above upper bound;
  - 2Q25 guide NT$147.2-159.4bn -> actual NT$150.369bn, within range.
- Critical clock result: outcome known_at is metric-specific. MediaTek quarterly revenue becomes reconstructable after the final monthly-sales filing, before the earnings conference; margin metrics remain later. TSMC US-dollar revenue guidance should use the later official quarterly US-dollar actual rather than mixing monthly NT-dollar revenue without FX treatment.
- Small samples indicate conservative / under-guidance tendencies in both examples, but no permanent management-trait classification is allowed from this alone.
- Current TWSE forecast rules make revision / “forecast no longer applicable” disclosures first-class credibility events when applicable.
- D21-12 advances L2 -> L3 / 60%.
- L4 remains closed pending OOS / prospective evidence and redundancy tests versus analysts, fundamentals and earnings revisions.

### D21-13 ESG / climate / social materiality
- Advance D21-13 L0 -> L2 / 40%.
- Scope is limited to financially material environmental/climate/social exposures linked to cash flow, cost, assets, financing, regulation, supply chain, customers or workforce.
- Generic ESG scores are explicitly rejected as primary signals.
- Taiwan begins phased IFRS sustainability disclosure adoption from FY2026, starting with >=NT$10bn paid-in-capital listed/OTC firms, followed by NT$5-10bn firms in FY2027 and the remainder in FY2028.
- Disclosure-regime phase and methodology vintage are mandatory controls. Increased disclosure after mandatory adoption is not itself higher risk.
- Freeze transition, physical, supply-chain/customer-access, workforce/social and opportunity mechanisms.
- Freeze rating-divergence falsification: provider composite scores are provenance objects, not ground truth.
- Candidate metrics emphasize industry-material emissions/energy/water, transition capex, target-versus-realized progress, safety/labor/product events and disclosure quality.
- L3 remains closed pending multi-sector Taiwan PIT replay across changing disclosure standards and methodology vintages.

## Exact next continuation
1. D21-12 next promotion requires OOS/prospective testing of rolling guidance credibility after controlling analyst coverage, earnings revisions, fundamentals and industry/macro shocks.
2. Build D21-13 historical multi-sector materiality replay, preferably semiconductor water/energy/carbon exposure versus a high-emission or labor/product-safety-sensitive sector.
3. Preserve disclosure regime, methodology vintage, target-versus-realized state and first-known timing.
4. Continue D21-11 contemporaneous-evidence recovery opportunistically; do not promote from ex-post adjudication alone.

Formal Core impact: NONE.


## 2026-10-04 late-afternoon durable continuation

### D21-13 materiality replay
- TSMC 2023 sustainability metrics became conservatively public on 2024-07-31 through the issuer's sustainability-report release. Do not backfill them into 2023.
- TSMC 2023 unit water consumption was 176.4 L per 12-inch equivalent wafer mask layer, +25.2% versus the 2010 base and a missed target; issuer attribution linked the deterioration to lower capacity utilization. At the same time, process-water recycling reached 90.3% and reclaimed-water replacement reached 12%, above its disclosed target.
- This freezes the denominator-effect falsification: worsening environmental intensity can reflect production/utilization changes while resilience metrics improve.
- China Steel's 2023 Sustainability Report was board-approved/publicly described on 2024-08-13. 2023 carbon reduction was about 358,000 tCO2e, process-water recycling 98.5%, total water intensity 5.04 t/tCS versus 4.90 target, and new-water intensity 2.16 t/tCS versus 2.50 target.
- China Steel explicitly identifies low-carbon raw-material transition, carbon fees, low-carbon energy and carbon-neutral technology as operating/R&D-cost channels. Carbon risk is therefore much more direct to cost/capex than a generic ESG score.
- Cross-sector result: semiconductor and integrated steel require different materiality maps and denominators. Generic ESG composite and unscaled cross-sector metric comparison remain rejected.
- D21-13 advances L2 -> L3 / 60%.
- L4 remains closed pending OOS/prospective incremental tests controlling sector, size, capex cycle, profitability, valuation and regulation phase.

### D21-09 succession replay
- TSMC planned succession: 2023-12-19 public announcement that Mark Liu would retire after the 2024 AGM and C.C. Wei was recommended as successor; 2024-06-04 the new board elected C.C. Wei chairman. Lead time = 168 days.
- Taiwan Cement abrupt succession: 2017-01-22 incapacitation triggered acting chairman/president appointment; MOPS-derived archive observed by 2017-01-23 07:20. Leslie Koo's death was announced before market open on 2017-01-23; later the same day the board selected Chang An-Ping as permanent chairman/president, observed in a MOPS-derived archive at 17:23. The 2017 annual report later confirmed the sequence.
- Succession is frozen as a state machine: incapacity/death/retirement -> acting state -> successor selection -> effective role, with planned lead time and board/election dependency preserved.
- Current roster must never replace historical state transitions.
- D21-09 advances L2 -> L3 / 60%.
- L4 remains closed pending broader samples and OOS/prospective tests.
- Role remains CONTEXT_ONLY / GOVERNANCE_TAIL_RISK / CONFIDENCE.

## Exact next continuation
1. D21-07 is now the largest executable L2 module without PIT validation. Build a historical Taiwan compensation-policy -> capital-allocation replay using at least one long-horizon investment decision and one capital-return/financing decision, separating policy known_at, decision known_at and future realized outcome.
2. Keep blocked source dependencies active but non-blocking: D21-11 contemporaneous tunneling evidence, D21-04 original pledge receipts, D21-03 original monthly insider known_at, D21-01 original ownership-report known_at.
3. D21-09 and D21-13 require OOS/prospective evidence before L4.

Formal Core impact: NONE.


## 00 control-plane receipt — H18 Room14 side accepted

00｜研究總控室 accepted D21-07 as the governance/incentive side of H18.

Closed on Room14 side:
- management incentive/alignment vs short-termism/metric-gaming mechanisms;
- capital-allocation outcomes across investment, M&A, buybacks/dividends, financing and cash;
- reverse-causality / talent-market / overconfidence-control countermechanisms;
- project economics itself is not owned by D21-07.

H18 remains PARTIAL only because D07-19 project/capital-budget economics is still L0/0 and unstudied.

Do not repeat D21-07 ownership work unless contradictory evidence appears.


## 2026-10-04 evening D21-07 durable continuation

### D21-07 incentive -> capital-allocation replay
- TSMC 2024-02-06 Board disclosure provides a decision-time incentive event: 2023 RSA issuance and a 2024 RSA proposal were explicitly justified by executive/key-talent retention and alignment with shareholder interests and ESG outcomes.
- TSMC 2024-06-05 Board disclosure provides two capital-allocation families:
  1. about US$17.3562bn capital appropriations for long-term capacity based on demand forecasts and technology roadmap;
  2. repurchase of 3,249,000 common shares explicitly to offset dilution from employee restricted stock awards.
- The dilution-offset buyback is recorded as an ISSUER_STATED direct mechanism. The capex decision is only ASSOCIATION_ONLY with incentive design; no causal inference is allowed.
- TSMC 2024-08-13 approved further about US$29.61547bn capital appropriations, up to US$7.5bn Arizona capital injection and 2.353m 2024 RSA shares. Same-meeting occurrence remains non-causal evidence.
- Later outcomes: 2024 consolidated capex about US$29.76bn; annual report states about 0.9m 12-inch-equivalent wafer capacity increase; the 3.249m-share buyback was completed and cancelled.
- Board capital appropriations are authorization batches, not an annual capex forecast. No fake execution ratio may be calculated from annual capex divided by one authorization.
- MediaTek provides a falsification/control structure: 2022 executive stock-ownership guidelines, 2024 remuneration/RSA governance, an 80%-85% regular payout policy plus 2021-2024 special dividends, and about NT$132bn 2024 R&D investment. High payout and high long-term investment can coexist.
- D21-07 advances L2 -> L3 / 60%.
- L4 remains closed because no OOS/prospective incremental evidence or causal proof exists.

## Exact next continuation
1. Prioritize D21-11 contemporaneous decision-time evidence recovery / alternative high-suspicion case construction.
2. Then D21-04 authoritative pledge setup/release receipts.
3. Then D21-03 original monthly insider known_at and D21-01 original ownership-report known_at.
4. All L3 modules require OOS/prospective evidence before L4; no theory-only promotion.

Formal Core impact: NONE.


## 2026-10-04 evening D21-11 durable continuation

### D21-11 decision-time state replay
- Formosa Oilseed Processing 1225 provides a reproducible public-evidence state transition.
- 2020-02-07 issuer correction disclosed that the 2019 Q3 financial statements had omitted a related-party relationship and stock transactions: 1.523m Hsin Tai shares bought on 2019-08-12/14 for NT$43.338m from a first-degree relative of the then vice chairman.
- At that date the correct state is AMBIGUOUS / ELEVATED_GOVERNANCE_CONCERN, not confirmed tunneling.
- 2020-11-05 Taichung District Prosecutors Office publicly alleged controller/beneficiary linkage, use of company funds to purchase nominee-held related shares, irregular transactions totaling NT$92.32935m, concealment of the related-party nature, false financial reporting and about NT$20.175m company loss.
- At that date the correct state becomes HIGH_SUSPICION, not yet CONFIRMED_TUNNELING.
- Later final adjudication may create CONFIRMED_TUNNELING only from its own public known_at onward.
- Date-only public evidence is not treated as an intraday timestamp. If exact publication time is unavailable, first safe daily eligibility is the next trading day unless same-day-before-decision publication is independently proven.
- Combined with the prior confirmed-case semantics and the Yuanta justified-RPT control case, the classifier now supports UNKNOWN / AMBIGUOUS / HIGH_SUSPICION / CONFIRMED and non-tunneling control outcomes without mechanically copying RPT size.
- D21-11 advances L2 -> L3 / 60%.
- L4 remains closed pending OOS/prospective incremental validation and redundancy tests versus D21-01/04/05, D07 and D11.

## Exact next continuation
1. D21-04 authoritative pledge setup/release receipts or another original-source pledge pair.
2. D21-03 authoritative monthly insider known_at plus a second transfer-motive case.
3. D21-01 authoritative ownership-report receipt / first-known time.
4. All L3 modules remain locked below L4 without OOS/prospective evidence.

Formal Core impact: NONE.


## 00 routed COV-11 exact remaining delta — 2026-10-04

COV-11 remains PARTIAL.

Do not redo D21 ownership/control, board, insider, RPT, minority-risk or audit/control work.

Exact remaining delta:
1. define the recurring shareholder-rights / stewardship / activism / voting family;
2. separate formal rights from D21-01 ownership/control concentration and D21-11 minority-risk outcomes;
3. freeze MOPS shareholder-meeting notice/agenda/material/proposal/minutes/voting-result first-known lifecycle;
4. freeze stewardship-code / institutional-voting disclosure source and version clocks;
5. produce at least one historical Taiwan lifecycle replay from agenda publication through voting result;
6. define activism/stewardship states without normative good/bad scoring;
7. prevent D06 ownership-flow and D11 proxy/event mechanics from becoming duplicate evidence;
8. choose exactly one terminal recommendation;
9. commit `research/COV11_D21_SPECIALIST_RETURN_V0_1.md`.

No maturity or Formal change is authorized by this routing.


## 2026-10-04 night D21-01 durable continuation

### D21-01 conservative daily PIT unlock
- Exact MOPS first-public timestamp remains preferred but is no longer mandatory for DAILY PIT if an authoritative statutory latest-public bound exists.
- Freeze precision hierarchy: AUTHORITATIVE_EXACT_TIMESTAMP > AUTHORITATIVE_OBSERVED_DATE > STATUTORY_LATEST_PUBLIC_BOUND > PRINT/MIRROR_ONLY.
- Under the 2024-08-01 annual-report rule, listed/OTC issuers with year-end paid-in capital >=NT$2bn or foreign/PRC holdings >=30% had to file annual reports 14 days before AGM.
- TSMC 2025 AGM = 2025-06-03 -> statutory latest filing 2025-05-20 -> conservative daily safe use from 2025-05-21.
- Formosa Plastics 2025 AGM = 2025-06-11 -> statutory latest filing 2025-05-28 -> conservative daily safe use from 2025-05-29.
- The prior threshold falsifications remain: TSMC ADR depositary 20.49% can create a false controller positive under naive >=20% direct-holder logic; Formosa Plastics related-group network can evade naive single-holder >=10% logic.
- Category C statutory-bound timing must never be labeled exact known_at and is prohibited for intraday research.
- If a late-filing violation is documented, statutory-bound eligibility is invalid.
- D21-01 advances L2 -> L3 / 60%.
- L4 remains closed pending OOS/prospective incremental evidence and robust controller-reconstruction tests.

### D21-04 source gate
- Official rules confirm pledge setup/release must be filed to MOPS within 5 days and monthly pledge changes by the monthly deadline.
- This supports a future conservative safe-known-at method once an authoritative event date exists.
- Current 2850/Shinkong Textile individual event dates remain secondary-source only; D21-04 stays L2 / 40%.

### D21-03 motive diversity
- Hon Hai 2019 trust-transfer observations provide a clear non-directional transfer family.
- FSC official publication corroborates the holder/date/amount for the 2019-04-19 filing; secondary market archives identify trust method / trust account.
- Trust rows must not be interpreted as bearish sales.
- Monthly post-change known_at remains unresolved; D21-03 stays L2 / 40%.

## Exact next continuation
1. D21-03: obtain authoritative monthly holding-change content or a conservative monthly safe-known-at supported by authoritative data.
2. D21-04: obtain authoritative pledge event dates/receipts or another issuer with official pledge setup/release archive.
3. All L3 modules remain below L4 without OOS/prospective evidence.

Formal Core impact: NONE.
