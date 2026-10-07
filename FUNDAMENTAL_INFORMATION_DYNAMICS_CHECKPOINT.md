# Fundamental Information Dynamics Checkpoint

Updated: 2026-09-30 Asia/Taipei
Current cursor: FD-001 through FD-057 complete; valuation through VAL-020.
Next: source-readiness inventory and outcome-blind PIT receipt for Taiwan analyst forecasts; in parallel keep prospective general-industry cash/balance-sheet receipt waiting for a new financial vintage.

## Durable conclusions
- fundamentalScore structural audit is frozen: nine possible components sum to a theoretical 120 before clamping to 100; component availability is not normalized, so score scale is coverage-sensitive.
- scorePositive gives half-credit at zero change; fundamentalScore is a mixed level/change quality composite, not a pure growth or surprise score.
- revenueMoM ?? revenueQoQ creates an availability-dependent monthly-versus-quarterly horizon switch.
- Existing Shadow snapshots do not serialize grossMarginYoY/operatingMarginYoY or component availability/pre-clamp state, so exact historical score decomposition is incomplete.
- Machine artifact `research/fundamental_score_structural_falsification_v0_1.json` freezes fixed synthetic counterexamples before outcomes.
- Exact 2026 record-high revenue citation corrected to DOI 10.1016/j.frl.2026.109911. The event mechanism is horizon-dependent: short-term reversal can coexist with longer drift, especially conditional on pre-event run-up and institutional selling.
- Current V8.7.11 revenue evidence is CURRENT_SNAPSHOT_ONLY with firstKnownAt=null and historicalHighStatus=UNKNOWN_REQUIRES_HISTORY; it cannot establish announcement day or record-high-at-the-time state.
- The normal Formal enrichment already fetches full-market TWSE/TPEx monthly revenue, so future first-observed event receipts can potentially reuse the source with zero extra API calls; touching shared parser/storage remains Class-B proposal-first.
- Conservative prospective event timing uses next official session after first clean after-market observation when exact filing time is unavailable; missed prior scans => OBSERVATION_DELAY_UNKNOWN.

- Current Formal fundamentalScore uses realized fundamental LEVEL/CHANGE measures but no source-level surprise, consensus, revision or forecast fields.
- Growth != surprise. Revenue YoY/MoM and EPS YoY are realized changes, not expectation errors.
- PEAD is a substantial literature but not a guaranteed modern trading edge; mechanisms and persistence vary.
- Revenue surprise can add information beyond earnings surprise.
- Taiwan mandatory monthly revenue disclosure makes monthly fundamental events unusually valuable, but exact first-known publication timing is mandatory.
- Corrected/current MOPS values cannot be backfilled as if known historically; first-known vintage is required.
- Analyst forecast revisions have evidence in Taiwan, but current system has no verified consensus source. Missing consensus/revision must remain UNKNOWN.
- Fundamental surprise must be interpreted jointly with immediate price reaction and, if available, analyst revision speed.
- Price/fundamental disagreement is a research state, not a reason to ignore price.
- Recent Taiwan evidence on record-high monthly revenue suggests short-horizon reversal and longer-horizon drift can coexist; horizon and pre-event run-up matter.
- Peer earnings/revenue events can transfer information, but competitive versus common-demand effects must be separated.
- Formal Core remains LOCKED.

## Existing-source audit

Present:
- revenueMonth / revenueMoM / revenueYoY / revenueYTDYoY
- EPS / true single-quarter EPS review / epsYoY
- margins / margin YoY
- fundamentalScore
- official announcements / valuation

Absent in current main Worker source:
- surprise
- consensus
- revision
- forecast

## Exact next continuation

FD-011: Define surprise measurement hierarchy: true consensus, company guidance, seasonal/model expectation.
FD-012: Standardized Unexpected Earnings (SUE) and why naive EPS YoY is not SUE.
FD-013: Revenue acceleration/deceleration vs surprise; seasonality in monthly revenue.
FD-014: Earnings quality: cash flow/accruals and persistence versus headline EPS.
FD-015: Margin surprise and operating leverage.
FD-016: Guidance / outlook language and management forecast changes.
FD-017: Event-time alignment and abnormal-return baselines for Taiwan.
FD-018: Interaction with K-line/price-volume: gap-and-hold, gap-and-fade, no-reaction.
FD-019: Data-source feasibility / historical vintage audit in current repository.
FD-020: Freeze minimal prospective Fundamental Event Shadow schema.


## FD-011 through FD-028 — concept convergence

- Expectation source is part of the surprise variable: true analyst consensus, company guidance, frozen model expectation and simple realized change are separate objects.
- EPS YoY is not SUE. SUE requires actual minus pre-event expectation plus an explicit scale; every expectation/scale variant is a separate experiment.
- Taiwan monthly revenue requires seasonality/calendar controls. YoY acceleration is change-of-growth, not surprise.
- Cash/accrual quality is a genuine missing dimension in current main Worker source. MOPS exposes cash-flow statements, but high accrual must not be simplistically labeled bad/manipulated.
- Margin level, margin change and true margin surprise are separate. Revenue acceleration with margin compression is not automatically bad.
- MOPS/TWSE provide financial forecast / forecast-vs-actual and investor-conference disclosure surfaces, but management guidance is not analyst consensus and coverage is selective.
- Fundamental event studies require exact first-published / first-tradable timing and multi-news guards; date-only events cannot support clean intraday attribution.
- Fundamental information x K-line/price-volume reaction states are frozen; price disagreement with headline fundamentals is itself data.
- Earnings persistence, base effects and mean reversion must be separated from one-quarter growth.
- Accrual effects are entangled with investment/growth/risk; a simple low-accrual ranking is rejected.
- Analyst dispersion/disagreement is conditional and measurement-sensitive; current system has no point-in-time consensus provider.
- Fundamental momentum is a sequence concept but has an overreaction/representativeness counterstate.
- Own-history innovation and peer-relative innovation answer distinct questions and must remain separate.
- Redundancy map against existing fundamentalScore/K-line/PV/RS/attention/regime is frozen.
- Feasibility tiers: official point-in-time events first; cash/guidance second; analyst consensus/revision requires external point-in-time data.
- Concept lane status: CONCEPT_COMPLETE / EVIDENCE_PENDING. Formal Core unchanged.

## Next lane
Derivatives Information & Volatility Surface.


## 2026-09-28 D07+D08 long-block continuation
- FD-044..FD-046 added: profitability must be decomposed from leverage/denominator effects; cash conversion/accrual quality is a missing dimension; FCF has no single IFRS-defined formula; growth×quality states are preferred over blindly extending the additive fundamentalScore.
- VAL-009..VAL-012 added in VALUATION_RESEARCH.md: trailing PE has cycle inversion risk; EV/EBITDA needs peer/capital-intensity guards; FCF Yield needs a frozen numerator and reinvestment context; next architecture is quality-adjusted valuation rather than low-PE ranking.
- External evidence is mechanism/counterevidence only; it does not establish Taiwan System alpha. Taiwan accrual literature motivates, but does not authorize, a hard gate.
- No Formal change. No threshold/weight search. No historical PIT fabrication.
- Exact next continuation: repository/MOPS PIT field audit for CFO, capex, assets, equity, debt/cash; freeze sector policies (industrial vs financial); define prospective component receipt and quality×valuation Shadow schema; only then run within-date/sector incremental tests.


## 2026-09-28 D07+D08 long-block — PIT quality contract / industry firewall / forward valuation
- Fresh latest-main audit confirmed this room owns D07+D08. Current System 1/V8 financial candidate path preserves income/profitability/revenue fields but does not currently normalize CFO, assets, equity, liabilities or capex into equivalent quality fields.
- Taiwan official data/source structure proves balance-sheet/cash-flow source families exist and that general industry vs financial/insurance/securities/financial-holding reporting semantics differ materially.
- Official MOPS financial-comparison semantics explicitly mark generic operating-cash-flow ratios as not applicable to financial/insurance/securities-futures/financial-holding/cross-industry groups. Generic CFO/FCF quality research is therefore limited to GENERAL_INDUSTRY; financial institutions require specialist capital/asset-quality/solvency metrics.
- Existing System 2 A5_QUARTERLY_FINANCIALS prospective observer was re-audited. It uses official TWSE/TPEx EPS/profitability datasets, preserves observedAt/source/output-date/quarterly-vintage coverage, and explicitly treats firstObservedAt as an upper bound rather than exact company filing time. This is sufficient for D07-08 L3 PIT feasibility, but not L4 prospective outcome evidence.
- Frozen machine artifacts:
  - research/fundamental_quality_pit_contract_v0_1.json
  - research/fundamental_quality_valuation_shadow_spec_v0_1.json
- Formula policy frozen before outcome:
  - ROA and ROE use average denominators;
  - CFO/net-income, CFO margin, broad accrual proxy, liabilities/assets, asset turnover are candidate GENERAL_INDUSTRY primitives;
  - FCF, ROIC and net debt remain NOT_FROZEN until source taxonomy/definitions are proven.
- Forward PE is frozen as a forecast-vintage object: next-FY, NTM and current-year consensus variants cannot be mixed. Repository still has no validated canonical PIT estimates source, so D08-04 advances only to L1.
- PEG now has mechanism plus counterevidence: sign/near-zero growth, horizon mismatch, base effects and provider-definition drift require fail-closed UNKNOWN and redundancy testing versus valuation + expected-growth primitives. D08-05 advances to L2.
- External profitability/value evidence supports testing quality × valuation interactions but is heterogeneous internationally; no foreign factor premium is imported as Taiwan alpha.
- No Formal Core/runtime/production change. No threshold sweep, no return inspection, no historical PIT fabrication. FORMAL_OPTIMIZATION_CANDIDATE = NO.
- Maturity changes authorized by evidence:
  - D07-06 L1 -> L2;
  - D07-08 L2 -> L3;
  - D08-04 L0 -> L1;
  - D08-05 L1 -> L2.
- Exact next continuation:
  1. identify exact official TWSE/TPEx GENERAL_INDUSTRY cash-flow and balance-sheet endpoints/field names with parity;
  2. freeze field-level mapping and schema fingerprints for CFO/assets/equity/liabilities/receivables/inventory and capex candidates;
  3. generate a no-outcome prospective quality receipt on a valid new financial vintage;
  4. verify corrections/restatements append rather than overwrite;
  5. only then enable the preregistered Quality × Valuation Shadow outcome join;
  6. keep Forward PE/PEG source-gated; they must not block trailing-PE/PB quality-adjusted research.


## 2026-09-30 D07+D08 long-block — analyst forecast revision / Forward PE PIT contract
- Latest-main calibration used tracker as canonical maturity source: D07=40.0%, D08=38.3% at block start. Older Router/map percentages were treated as stale summary, not canonical evidence.
- Time-dependent exact-next item (first new general-industry financial vintage receipt) is still waiting. Per total-control rules, the room advanced a nonblocked module instead of idling: D07-11 analyst forecasts/revisions + D08-04 Forward PE.
- Durable new machine contract: research/analyst_forecast_revision_pit_contract_v0_1.json.
- Source status:
  - 2026 Taiwan Finance Research Letters paper (DOI 10.1016/j.frl.2025.109164) uses monthly CMoney consensus forecasts and reports predictive content in forecast-earnings-growth revisions for Taiwan 50 / Taiwan Mid-Cap 100 / TPEx 50 constituents; mechanism support only.
  - Recent NCCU thesis on Taiwan brokerage-report characteristics reports mixed long-short effects, small-cap/outlier sensitivity, and robustness only for a subset of analyst characteristics; direct caution against universal revision/dispersion alpha.
  - Public CMoney pages expose dated broker-report EPS forecast ranges/individual broker estimates, proving source-family existence, but repository audit still has no validated canonical licensed PIT API/history/revision contract. SOURCE_NEEDED remains.
- D07 forecast object is now decomposed into forecast level, forecast earnings growth, individual revision, consensus revision, revision breadth, dispersion, coverage and forecast age. These are not interchangeable.
- Consensus construction is point-in-time and detail-preserving: latest active forecast per forecaster for identical target horizon/basis; preserve mean/median, coverage, dispersion, up/down breadth, age distribution and correction/withdrawal history. No coverage => UNKNOWN, not bearish/zero.
- Forecast staleness is not assigned an outcome-mined cutoff. Preserve forecast ages first; any stale-window/recency-weighting rule requires a separately preregistered accuracy study.
- Event timing is part of the signal. International JFE evidence (DOI 10.1016/j.jfineco.2004.03.002) shows revision informativeness varies around earnings announcements, with revisions immediately after earnings announcements relatively less informative. Multiple revisions reacting to one public event must not masquerade as independent events.
- FEG denominator firewall: ratio growth requires positive/comparable prior actual EPS away from zero under a later frozen numerical guard; zero/negative/turnaround states retain raw EPS delta and state while percentage FEG=UNKNOWN.
- Forward PE decomposition is frozen:
  - CURRENT_FY / NEXT_FY / NTM are separate series;
  - horizon roll is not an analyst revision;
  - lower Forward PE caused by price decline is not equivalent to denominator improvement;
  - preserve price and forecast EPS separately;
  - forward earnings yield may be stored separately but cannot be mislabeled PE.
- Critical naming firewall: existing V8 marketConsensus is an independent-source ranking overlay, not sell-side earnings consensus. New analyst fields use analystEarningsConsensus prefix.
- Maturity decisions supported by mechanism + counterevidence:
  - D07-11 L0 -> L2 (40%);
  - D08-04 L1 -> L2 (40%).
- No L3 claim: authorized canonical PIT estimate source remains unproven.
- No Formal/runtime/scoring change. No threshold import from papers. FORMAL_OPTIMIZATION_CANDIDATE = NO.
- Exact next:
  1. inventory authorized/licensed Taiwan analyst-estimate source options and timestamp/revision history semantics;
  2. preregister a forecast freshness/consensus-accuracy diagnostic before choosing stale cutoff or weights;
  3. if an authorized source becomes available, capture immutable individual forecast vintages outcome-blind;
  4. only then open D07-11/D08-04 prospective Shadow joins;
  5. separately continue waiting for the next legitimate financial-statement vintage to execute the frozen general-industry cash/balance-sheet receipt.


## 2026-09-30 analyst forecast source-readiness inventory
- Added research/analyst_forecast_source_readiness_v0_1.json.
- CMoney: Taiwan research and public pages prove source-family existence and dated broker forecasts; canonical licensed PIT API/history, correction/withdrawal lineage and current runtime authorization remain unproven.
- TEJ: public documentation proves Taiwan listed/OTC analyst-EPS forecast-change/disagreement research and API-capable services generally; exact analyst dataset code, immutable historical forecast vintages, timestamp semantics and current runtime authorization remain unproven.
- MOPS/TWSE/TPEx: official filings, actual financials, issuer guidance and event clocks are supporting sources; they are NOT sell-side analyst consensus.
- Public broker-report/search pages: corroboration/spot-audit only unless completeness, licensing, immutable history and revision lineage are proven. They cannot serve as a canonical consensus population.
- Fail-closed decision: if no authorized source satisfies the frozen contract, D07-11/D08-04 remain L2 and analyst consensus/revisions/Forward PE/PEG remain UNKNOWN for empirical system research.
- No maturity change from this source inventory; it closes a source-selection ambiguity but does not prove L3 PIT data feasibility.


## 2026-10-02 D07+D08 continuation — freshness accuracy and historical valuation PIT

- Forecast freshness accuracy preregistration is frozen in research/analyst_forecast_freshness_accuracy_prereg_v0_1.json. Forecast age is first evaluated against forecast error, not stock returns. No outcome-tuned stale cutoff.
- Parallel research/analyst_output_horizon_alignment_v0_1.json was reconciled and not duplicated.
- D07-11 remains L2 because authorized canonical Taiwan PIT analyst-estimate access is still unproven.
- Historical valuation contract is frozen in research/historical_valuation_percentile_pit_contract_v0_1.json with source-only receipt research/historical_valuation_source_feasibility_receipt_20261002.json.
- TWSE official historical PE/PB archive and TPEx official historical PE/PB pages establish Taiwan historical source feasibility. N/A PE remains stateful; no current-statement backfill.
- Percentile windows are preregistered as 252/756/1260 valid sessions plus expanding history. No window is selected by returns.
- D08-03 may advance L1 -> L3 for PIT/source feasibility only. L4 still requires prospective Shadow or OOS.
- No Formal Core/runtime/scoring change. Outcome joins remain closed. FORMAL_OPTIMIZATION_CANDIDATE = NO.
- Exact next:
  1. build isolated TWSE/TPEx historical PE/PB replay fixture;
  2. freeze empirical-CDF tie rule, N/A mapping, minimum-history and structural-break tags;
  3. validate representative ordinary, loss-making, capital-action and newly listed cases;
  4. then preregister Shadow join versus raw valuation + quality + peer/sector + RS/trend + regime;
  5. analyst freshness remains SOURCE_BLOCKED until authorized PIT estimates access exists;
  6. general-industry CFO/balance-sheet receipt remains WAITING_PROSPECTIVE for the next valid financial vintage.


## 2026-10-03 Room-06 continuation — H05 semantic split + D08-03 replay QA

- Re-read latest main after curriculum expanded to 22 domains / 354 modules. Prior 229-module denominator is obsolete.
- Governance priority was reconciled before continuing old work. Room 06 is assigned H05 D07-25 vs D21-10 specialist validation under the owner-approved H05-H08 semantic-split contract.
- Added research/h05_d07_25_specialist_evidence_packet_v0_1.json.
- Room-06 H05 result:
  - D07-25 owns statement-level forensic anomaly context;
  - D21-10 owns audit/restatement/internal-control governance/control events;
  - shared restatement evidence must use one canonical receipt with child interpretations;
  - statement anomaly without governance event and governance event without ratio anomaly are both legitimate divergent states;
  - accounting anomalies are red flags, not fraud labels.
- Cross-room terminal classification remains EVIDENCE_INSUFFICIENT because Room 14 counterpart validation is still pending. Room-06 recommendation is KEEP_SEPARATE if independent governance/control observables are confirmed; otherwise SCOPE_DEDUP_ONLY for overlapping content.
- H05 packet itself causes no maturity promotion, merge, retirement or Formal change.
- Returned to D08-03 exact continuation after H05 packet.
- Added research/historical_valuation_percentile_replay_fixture_v0_1.json and research/historical_valuation_percentile_replay_validation_receipt_20261003.json.
- Frozen average-rank percent-rank tie rule; arithmetic QA passed tie/all-equal/min/max fixtures.
- Fixed-history requirements: 252/756/1260 valid observations; expanding history also remains UNKNOWN before 252 valid observations.
- PE missing states remain separate; PB availability is independent.
- Structural breaks are context tags, not automatic history resets.
- Late corrections may not backfill an earlier replay state.
- D08-03 remains L3. Mechanical QA is not L4 evidence and no return outcomes were opened.
- Formal Core unchanged. FORMAL_OPTIMIZATION_CANDIDATE = NO.

Exact next:
1. D08-03: freeze exact TWSE/TPEx parser/schema fingerprints and validate representative ordinary, loss-making, capital-action and newly-listed replay cases;
2. only after source replay integrity, preregister Historical-Valuation × Quality Shadow outcome join;
3. H05: wait for Room-14 D21-10 counterpart packet, then return cross-room evidence to 00 for Dependency Audit / anti-orphan review;
4. D07 general-industry CFO/balance-sheet receipt remains WAITING_PROSPECTIVE for the next legitimate financial vintage;
5. D07-11 analyst forecast lane remains SOURCE_BLOCKED until authorized canonical PIT estimates access exists.


## 2026-10-03 Room-06 afternoon continuation — dual-market valuation source asymmetry + executable TWSE replay

- Re-read latest main and reconciled 22-domain / 354-module governance before continuing.
- D08-03 exact source contract is now market-specific rather than falsely symmetric.
- Added:
  - research/historical_valuation_dual_market_source_schema_contract_v0_2.json
  - research/historical_valuation_source_case_validation_receipt_20261003_v0_2.json
  - research/historical_valuation_twse_shadow_prereg_v0_1.json
- TWSE:
  - public BWIBBU_d historical machine response verified;
  - parse-by-header contract frozen;
  - PE/PB missingness independent;
  - official 9904 witness shows fiscal denominator period changed 115/1 -> 115/2 between 2026-08-12 and 2026-08-13 while PE/PB changed materially, proving raw percentile movement is not equivalent to pure market repricing.
- TPEx:
  - official public historical page and current OpenAPI schema verified;
  - public historical machine transport remains unresolved in this research environment; a candidate legacy URL found via noncanonical locator was not accepted because direct official response envelope could not be verified;
  - official EDIS V1.33 S17 / STKPEYIPBR.TXT machine schema is documented, but it is a licensed fourth-group after-market statistics lane and no purchase/access is authorized.
- New-listing guard: official TPEx announcement fixes 1294 漢田生技 main-board OTC listing date at 2024-09-26; by 2026-10-03, 756/1260-valid-session history is impossible, while 252 still requires actual valid-row count.
- Initial empirical design is explicitly TWSE-only. It cannot generalize to TPEx/full Taiwan.
- TWSE historical replay implementation completed as Class-A research-only:
  - research/historical_valuation_replay_core_v0_1.mjs
  - research/test_historical_valuation_replay_core_v0_1.mjs
  - system2/tests/d08_historical_valuation_replay_guard.test.mjs
  - PR #364 merged at 6943edc24ca4c1d78c525b33b730d911f245e4fa.
- Exact-head verification:
  - System2 Research CI 37107054148 PASS and log explicitly executed D08_HISTORICAL_VALUATION_REPLAY;
  - V8 Repair CI 37107054216 PASS;
  - V8 Regression 37107054202 PASS.
- Implementation is pure/parser-only: no market fetch in runtime, no persistence, no selection/ranking/threshold/capital/signal/push change.
- D08-03 remains L3/60. Parser/replay integrity is not L4 outcome evidence.
- FORMAL_OPTIMIZATION_CANDIDATE = NO. Formal Core unchanged.

Exact next:
1. create a bounded source-only TWSE raw-history replay sample with immutable source fingerprints/readback receipts;
2. include ordinary numeric, PE-missing/PB-present, fiscal denominator transition, corporate-action context and newly-listed/limited-history controls;
3. compute preregistered 252/756/1260/expanding percentiles without opening returns;
4. verify coverage/missingness and denominator-transition behavior;
5. only after replay/readback integrity open the preregistered TWSE-only Historical-Valuation Shadow outcome join;
6. keep TPEx outside the empirical cohort until public historical machine transport is directly verified or an authorized licensed lane is supplied;
7. H05 remains waiting for Room-14 counterpart; D07 general-industry financial-quality receipt remains WAITING_PROSPECTIVE; analyst forecast lane remains SOURCE_BLOCKED.


## 2026-10-03 Room-06 bounded TWSE historical valuation replay

- Disposable source-capture PR #381 was executed and closed without merge.
- Final run: System2 Research CI 37122478859 PASS; V8 Regression 37122478893 PASS.
- Durable receipt: research/d08_twse_bounded_history_source_receipt_20261003_v0_1.json.
- Failure history preserved:
  - future 2026-10-31 month-end query rejected -> corrected to 2026-10-02 asOf;
  - 3593 calendar-adjacent pre-event assumption rejected -> corrected to legal session boundary 2025-12-10 -> 2025-12-22.
- 1102 亞泥 official TWSE history: 1,300 rows from 2021-06-01 to 2026-10-02. PE/PB support 252/756/1260 and expanding percentile calculations.
- Current 1102 window ranks materially disagree numerically, confirming window sensitivity must remain preregistered rather than outcome-selected.
- 9904 denominator-period transition, 3593 corporate-action session break, 7812 newly-listed short history and 1101 PE-missing/PB-present all passed their fail-closed semantics.
- No return outcome joined. No alpha claim. No threshold selection.
- D08-03 remains L3/60; FORMAL_OPTIMIZATION_CANDIDATE = NO; Formal Core unchanged.

Exact next:
1. freeze broader TWSE cohort construction and scan-date sampling without returns;
2. materialize immutable percentile snapshots and coverage receipts;
3. add baseline/control variables while outcomes stay closed;
4. then open the preregistered TWSE-only Shadow outcome join;
5. TPEx remains excluded until historical machine replay is verified.


## 2026-10-04 Room-06 continuation — COV-04/COV-05 returns + D08-03 survivorship-safe cohort

- Re-read latest main and reconciled Curriculum Coverage governance before continuing D08-03.
- COV-04 D07 Dividend / Payout Policy & Sustainability:
  - machine contract: research/dividend_payout_sustainability_pit_contract_v0_1.json;
  - specialist return: research/COV04_D07_SPECIALIST_RETURN_V0_1.md;
  - repository intake preflight PASS as RETURN_CONTRACT_COMPLETE;
  - terminal specialist recommendation = ADD_MODULE;
  - proposed owner = D07, starting L0/0 if 00-room owner approval occurs;
  - no canonical curriculum/maturity/Formal change yet.
- COV-05 D08 P/S / EV-Sales:
  - machine contract: research/sales_enterprise_multiples_pit_contract_v0_1.json;
  - specialist return: research/COV05_D08_SPECIALIST_RETURN_V0_1.md;
  - after explicit anti-double-count wording, repository intake preflight PASS with errors=0/warnings=0;
  - terminal specialist recommendation = EXTEND_EXISTING_SCOPE into D08-06 rather than add a parallel module;
  - D08-06 current canonical L2/40 is not changed by this return; the new sales-multiple sub-capability starts evidence-wise at L0;
  - no Formal change.
- D08-03 cohort/scan progression:
  - executable cohort/scan contract: research/historical_valuation_twse_cohort_scan_contract_v0_1.json;
  - parent/newer cohort preregistrations reconciled in research/d08_twse_cohort_contract_reconciliation_20261004_v0_1.json;
  - 44 monthly scan dates from 2023-01 through 2026-08 frozen before outcomes;
  - scan-date receipt: research/d08_twse_month_end_scan_date_receipt_20261004_v0_1.json;
  - scanDateListHash = e4475abd9fe2ab867bf20e5a8ee2f1a000bdb78365afe6083e6433c2b5abc490.
- D1 historical-universe read-only audit:
  - temporary PR #430 closed without merge;
  - read-only guard passed, but isolated D1 had zero historical-universe registry receipts;
  - this is negative evidence: architecture exists but registry was not physically materialized;
  - current-list-only history reconstruction remained prohibited.
- Official TWSE survivorship-safe alternative:
  - current company source = TWSE OpenAPI t187ap03_L;
  - new-listing source = TWSE company/newlisting;
  - delisting source = TWSE company/suspendListing;
  - old delisted names missing from the new-listing history use official 2023-01-03 MI_INDEX presence under the already-existing HISTORY_FIRST_TRADING_DATE fallback;
  - fallback symbols: 1701, 2358, 2809.
- Durable universe receipt: research/d08_twse_official_universe_source_receipt_20261004_v0_1.json.
- Final validation:
  - System2 Research CI 37165989414 PASS;
  - V8 Regression 37165989421 PASS;
  - registry membershipCount=1101, replayEligible=1101, unknownStart=0;
  - current=1089, delisted=12;
  - 44 snapshots, min/max active members=975/1089;
  - registryHash=0b7b587b7962b9782570a3b9fc679be8440d0c4c2e75fc06d155bf95641041a7;
  - snapshotBundleHash=97d1b5324b388753b09236cb3a731361aed1f009a775e868c305c30d8189844a.
- No return outcomes opened. D08-03 remains L3/60. FORMAL_OPTIMIZATION_CANDIDATE=NO. Formal Core/runtime/selection/scoring unchanged.

Exact next:
1. materialize 44 date-specific TWSE valuation/control snapshots while return outcomes remain closed;
2. every survivorship-safe cohort member must be represented as KNOWN or explicit UNKNOWN;
3. freeze per-date coverage/missingness receipts and immutable source/readback hashes;
4. include raw PE/PB, 252/756/1260/expanding percentile states, denominator transition, corporate-action/listing-age context, peer/sector if PIT-safe, size/liquidity, trend/RS and regime controls;
5. only after all coverage/readback gates pass may the preregistered Historical-Valuation Shadow outcome join open;
6. TPEx remains outside inference until public historical machine replay or an authorized licensed history lane is verified;
7. COV-04/COV-05 wait for 00-room formal intake/owner audit before any canonical module/scope change.


## 2026-10-04 00-room routing reconciliation — AOKD-05 source gate

Control-plane reconciliation only; this does not replace Room-06's active D08-03 execution order unless the owner/room chooses to service the routed source task.

- COV-04/COV-05 are no longer waiting for 00 intake: both were owner-approved and canonically executed by 00.
  - D07-34 now exists at L0/0.
  - D08-06 scope is extended to EV/EBITDA / EV-Sales / P/S; the sales-multiple sub-capabilities did not inherit L2 evidence.
- AOKD-05 owner triage is closed by:
  - `shared-knowledge/AOKD05_OWNER_SCOPE_RECONCILIATION_20261004_V0_1.md`
- 00 conclusion:
  - no new module and no owner reassignment;
  - D07-08 owns filing/document vintage clock;
  - economic content routes to existing D07 content owners;
  - D16-22 owns text-method validation only;
  - D20-07/D20-08 are dependent attention/underreaction consumers, not duplicate votes.
- Pending Room-06 source task:
  - `shared-knowledge/AOKD05_CORPUS_FEASIBILITY_CONTRACT_20261004_V0_1.md`
  - outcome-blind only;
  - return one of FEASIBLE / PROSPECTIVE_ONLY_FEASIBLE / DATA_BLOCKED / EVIDENCE_INSUFFICIENT;
  - no return outcome, maturity promotion, new module, or Formal change.
- This routing entry is a queued control-plane request. Preserve any already-active Room-06 experiment sequence and service this task at the next safe source-research slot.


## 2026-10-04 Room-06 D07-34 foundation promotion

- Canonical D07-34 Dividend / Payout Policy & Sustainability was taken from L0 foundation after 00-room curriculum approval.
- Added research/d07_34_dividend_payout_sustainability_foundation_v0_1.json.
- Mechanism, countermechanisms, falsification, anti-double-count ownership and decision role are now frozen.
- Taiwan-specific evidence supports lifecycle and tax/clientele heterogeneity but is not imported as current alpha.
- Universal high-payout/high-yield/stable-DPS rules are rejected.
- Primary role = VALIDATION; secondary = CONTEXT_ONLY / EXPLANATORY / SUPPORTIVE.
- D07-34 promoted L0/0 -> L2/40 only.
- D07 formal aggregate moved 14.1% -> 15.3%; tracker overall at this write recalculated to 44.6% across 356 modules.
- L3 remains blocked pending physical Taiwan PIT replay of proposal -> final/correction -> ex-date -> payment plus distribution-source and statement-denominator alignment.
- No Formal Core/runtime/scoring/selection change. Outcomes closed. FORMAL_OPTIMIZATION_CANDIDATE=NONE.

Exact next D07-34:
1. freeze official MOPS/TWSE dividend decision/version source parser;
2. preserve earnings/retained-earnings/reserve-funded source separately;
3. build proposal/final/correction append-only event identity;
4. join compatible earnings/CFO denominators only after their knownAt;
5. validate ordinary/special/stock/cash classification and financial-institution exception;
6. only a clean PIT receipt can justify L3.


## 00 control-plane receipt — H05 / H13 closure

00｜研究總控室 completed two no-structural-change closures:

H05:
- D07-25 remains statement-level forensic/anomaly owner.
- D21-10 remains audit/restatement/internal-control governance/control-event owner.
- one shared restatement/control parent receipt; corrected values never backfill pre-known-at history.
- H05 state = CLOSED_NO_STRUCTURAL_CHANGE.
- D07-25 remains L0/0%; no maturity transfer.

H13:
- D07-06 remains accounting balance-sheet/leverage primitive owner.
- D22-03 owns residual credit/funding transforms after liquidity-quality classification.
- one balance-sheet receipt; net debt is derived; maturity wall is linked but not additive.
- H13 state = CLOSED_NO_STRUCTURAL_CHANGE.
- D07-06 remains L2/40%; D22-03 remains L3/60%.

Audits:
- shared-knowledge/CURRICULUM_H05_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md
- shared-knowledge/CURRICULUM_H13_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md

These receipts do not override Room06 active research order.


## 00 routed H17 / H18 exact remaining deltas — 2026-10-04

### H17 — D13-06 → D22-04 → D07-18

Accepted upstream boundary:
- D13-06 owns risk-free/sovereign yield curve.
- D22-04 owns issuer debt-cost/refinancing spread.
- D07-18 must own enterprise WACC / cost-of-capital composite.

Room06 exact remaining D07-18 delta:
- freeze cost-of-equity, cost-of-debt and capital-structure weight semantics;
- distinguish WACC from discount-rate use cases and project-specific hurdle rates;
- preserve risk-free rate, beta/equity-risk-premium assumptions, issuer debt spread/cost, tax shield and capital-structure vintages;
- prohibit counting the same Treasury/risk-free shock again as debt-cost evidence and again as WACC alpha;
- include sensitivity/falsification for leverage, beta/ERP model choice, target-vs-current capital structure, negative/unstable cash flow and sector applicability;
- provide divergent state where WACC changes via equity-risk/capital-structure channel while issuer debt cost does not move identically.

D07-18 remains L0/0 until its own theory/mechanism contract exists.

### H18 — D07-19 vs D21-07

Room14 D21-07 mechanism/falsification side is accepted.

Room06 exact remaining D07-19 delta:
- project/capital-budget economics: project cash-flow forecast, hurdle/discount rate, NPV, IRR limitations, mutually exclusive project ranking, real-option states, sunk-cost/abandon/defer/expand semantics;
- project opportunity-set assumptions must have PIT/vintage lineage;
- separate project economics from management's choice/implementation quality;
- divergent states: attractive projects + poor allocation; weak opportunity set + improved governance/incentives;
- no duplicate vote from the same NPV/project economics under D21 governance.

These routed governance deltas do not override Room06 active research sequence; service at the next safe slot.


## 2026-10-04 Room-06 active D08-03 full daily valuation archive

This is an active in-progress durable continuation point, not a completion claim.

Completed before this archive phase:
- D08 raw 44-scan-date TWSE valuation snapshots are physically stored in isolated research R2.
- Semantic-idempotency repair is canonical on main:
  - repair commit 72f8df7d73e9fba4815924ec5b3d1b2c15c45e37;
  - durable receipt research/d08_twse_raw_valuation_r2_capture_receipt_20261004_v0_2.json;
  - 45,287 survivorship-safe membership rows;
  - 45,041 observed valuation rows;
  - 35,719 PE known;
  - 45,036 PB known;
  - two consecutive physical captures produced identical canonical semantic/object identities.
- D08-03 remains L3/60. Outcomes remain CLOSED.

Full daily archive task:
- branch: research/d08-daily-valuation-year-pack-v0-1
- PR: #548
- objective: immutable yearly TWSE BWIBBU_d PE/PB packs from verified machine archive boundary through 2026-08-31, with isolated-R2 write/readback hashes and no return access.
- machine boundary evidence:
  - 2005-09-01 is rejected by the official machine endpoint as earlier than the supported boundary;
  - 2005-09-02 is the first verified machine-readable date;
  - durable boundary receipt: research/d08_twse_daily_valuation_archive_boundary_receipt_20261004_v0_1.json.
- legacy schema:
  - early official history exposes symbol/name/PE/yield/PB only;
  - close and fiscal-report period are SOURCE_NOT_PROVIDED, never reconstructed;
  - PE/PB ratio observations remain eligible for historical percentile history.
- 2005 physical pilot PASS after schema/version and semantic-vs-object hash corrections:
  - 85 trading dates;
  - 56,634 rows;
  - PE known 40,845;
  - PB known 56,497;
  - two consecutive executions had identical packPayloadHash/objectSha256 and verified R2 readback.
- original full-year matrix run 37199944604 used max-parallel=2 plus four intra-year parallel date requests.
- observed successful years so far in that run: 2005, 2006, 2007, 2010, 2012, 2013, 2014.
- 2008, 2009 and 2011 failed at different dates with exhausted fetch transports; independent official verification proved at least the 2008 failed date exists, so these are transport/rate-limit failures, not missing-history evidence.
- transport hardening now committed on the branch:
  - daily requests serialized;
  - retryAttempts=7;
  - retryDelayMs=1000;
  - annual matrix max-parallel=1;
  - UNKNOWN may not be assigned from transport exhaustion.
- new hardened workflow run 37200323003 is pending behind the prior same-branch concurrency group. System2 Research CI/V8 checks for the hardened branch are in flight/required before rollout.

Exact next continuation point:
1. let the original matrix finish/clear the same-ref concurrency group while retaining all successful R2 packs;
2. execute hardened serialized 2005-2026 matrix and require every yearly job PASS;
3. for every year persist trading-date count, total rows, PE/PB known counts, sourceBundleHash, packPayloadHash, objectSha256/objectKey and readback status;
4. build one durable 2005-2026 archive manifest and aggregate packBundleHash;
5. only after all year packs are complete, compute outcome-blind PE/PB 252/756/1260 and true EXPANDING_SINCE_AVAILABLE percentiles for the 44 frozen scan dates;
6. cross-check every scan-date current PE/PB against the already durable raw-v0.2 month-end snapshot; mismatch => DATA_BLOCKED;
7. then materialize remaining preregistered controls/coverage receipts;
8. outcome join remains CLOSED until those gates pass.

Formal Core/runtime/selection/scoring/capital/signals remain unchanged.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.


## 2026-10-05 Room-06 D08-03 active archive continuation — PR #588

This entry supersedes the operational branch/PR pointer in the earlier D08-03 archive section. Completed evidence remains valid; only the active execution pointer changes.

Last durable milestone:
- PR #584 merged at 2ee2cad90c74c2419afeebed335010cd5f96e484.
- 2005-09-02 through 2005-12-31 earliest machine-readable archive boundary physically PASS.
- 85 trading dates; 56,634 rows; PE known 40,845; PB known 56,497.
- consecutive runs produced identical:
  - sourceBundleHash = 501c7c1dc356ab70731e3839295c872a728a6c2784c0a8b874385b7ff111250a;
  - packPayloadHash = e15068875b9615fba74148b21016d5e9791d6f129f2192b32d10795d47ed532a;
  - objectSha256 = 03938cab114fb25ad0e0680ba261645c87d1d66abe9deb043647640ee73d5012.
- R2 readback PASS; old object was reused rather than rewritten.
- legacy BWIBBU_d ratio-only schema is now canonical research handling:
  - PE/PB remain eligible;
  - close and fiscal-report-period can be SOURCE_NOT_PROVIDED;
  - no reconstruction/backfill from later sources.
- D08 percentile implementation now separates:
  - cohort effectiveFrom = whether the symbol belongs to the scan-date cohort;
  - valuationHistoryStart = official listingDate when known, otherwise firstTradingDate fallback.
  This prevents the 2023 research-universe clamp from incorrectly deleting valid pre-2023 valuation history.
- 252/756/1260/EXPANDING_SINCE_AVAILABLE tests PASS; current scan-day PE/PB raw-snapshot cross-check PASS.
- PR #584 exact-head checks:
  - System2 Research CI 37223758899 PASS;
  - D08 Raw Valuation R2 Capture 37223758840 PASS;
  - D08 Daily Valuation Year Pack 37223758832 PASS;
  - V8 Regression 37223758821 PASS.

Current active execution:
- branch: research/d08-full-daily-valuation-archive-v0-1
- PR: #588
- head at creation: bd890b77e83942adb4ff0880684dfa24192fdd04
- full archive workflow run: 37224491439
- System2 Research CI run: 37224491376
- V8 Regression run: 37224491402
- workflow policy:
  - years 2005..2026; 2026 capped at 2026-08-31;
  - max-parallel=1 across years;
  - daily requests serialized;
  - retryAttempts=7 / retryDelayMs=1000;
  - existing R2 objects reused by putIfAbsent + exact readback verification;
  - fail-fast=false so evidence from good years is retained even if another year has transport failure.

Superseded pointer:
- prior branch research/d08-daily-valuation-year-pack-v0-1 / PR #548 is historical context only and must not be resumed as the active lane.

Exact next continuation point:
1. finish/inspect PR #588 run 37224491439 and require all 22 yearly jobs PASS;
2. retain for every year: tradingDateCount, totalRows, totalPeKnown, totalPbKnown, sourceBundleHash, packPayloadHash, objectSha256, objectKey, readbackVerified;
3. build one durable 2005-2026 archive manifest + aggregate packBundleHash;
4. only after full archive completeness, materialize the 44 frozen outcome-blind percentile snapshots:
   - PE/PB 252 valid sessions;
   - 756 valid sessions;
   - 1260 valid sessions;
   - true EXPANDING_SINCE_AVAILABLE;
5. cross-check every scan-date current PE/PB against durable raw-v0.2 month-end snapshots; mismatch => DATA_BLOCKED;
6. then freeze remaining preregistered control/coverage snapshots;
7. return/outcome join remains CLOSED until all pre-outcome gates pass.

Maturity:
- D08-03 remains L3/60.
- No L4 promotion from archive engineering alone.
- Formal Core/runtime/selection/scoring/capital/signals unchanged.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.


## 2026-10-07 Room-06 D07-19 Capital Budgeting / NPV / IRR / Real Options foundation

Status: **D07-19 L2 MECHANISM_AND_FALSIFICATION_DEFINED / PIT_PROJECT_REPLAY_PENDING / FORMAL_CORE_UNCHANGED**

- Canonical machine contract: `research/d07_19_capital_budgeting_real_options_foundation_v0_1.json`.
- D07-19 owns project economics; D21-07 owns capital-allocation governance and stewardship.
- NPV is the value-additivity anchor; IRR/MIRR are supporting diagnostics only.
- Project cash flow is incremental, after-tax, PIT-valid; sunk costs excluded, opportunity costs/cannibalization included, financing double-count prohibited.
- Real Options require an actual defer/expand/contract/abandon/stage decision right plus uncertainty resolution over time; narrative flexibility alone is insufficient.
- PIT rule: decision inputs require knownAt <= projectDecisionKnownAt; later utilization, margins, overruns, impairments and realized returns append as later vintages/outcomes only.
- Maturity: **L0/0 -> L2/40**. L3 remains blocked pending at least two Taiwan-listed issuers from materially different industries with project-level PIT replay and an explicit D07-19 vs D21-07 divergent case.
- Outcomes CLOSED. Formal Core unchanged. FORMAL_OPTIMIZATION_CANDIDATE = NONE.


## 2026-10-08 Room-06 D07-20 三大財報聯動預測基礎

Status: **D07-20 L2 / MECHANISM_AND_FALSIFICATION_DEFINED / TAIWAN_PIT_REPLAY_PENDING / FORMAL_CORE_UNCHANGED**

- Canonical machine contract: `research/d07_20_integrated_three_statement_forecast_foundation_v0_1.json`.
- D07-20 owns integrated statement reconciliation and forecast-vintage integrity; D07-21 owns revenue/margin/OPEX drivers, D07-22 owns working-capital/CAPEX/FCF detail, D07-23 owns scenarios, D08 consumes forecast outputs for valuation.
- Three-statement closure is a consistency/data-quality state, not standalone alpha and not an independent valuation vote.
- PIT guard: management guidance, consensus and model assumptions are separate provenance lanes; later filings, restatements, guidance revisions and realized outcomes append only.
- IFRS 18 transition is a presentation vintage; line-item/subtotal changes cannot be interpreted as economic improvement without comparable mapping.
- Maturity: **L0/0 -> L2/40**. L3 remains blocked pending Taiwan historical PIT replay across >=3 issuers and >=2 materially different industries.
- Outcomes CLOSED. Formal Core unchanged. FORMAL_OPTIMIZATION_CANDIDATE = NONE.


## 2026-10-08 Room-06 D08-03 outcome-blind percentile materialization PASS

Status: **PERCENTILE_SNAPSHOT_MATERIALIZATION_PASS / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED**

- Dedicated execution: GitHub Actions run `37648084681` PASS.
- Durable receipt: `research/d08_twse_historical_valuation_percentile_materialization_receipt_20261008_v0_1.json`.
- 44 frozen TWSE scan dates materialized from the 2005-2026 daily valuation archive, reconciled universe V0.2 and raw valuation V0.3.
- Cohort member rows=45305; raw observed=45059; PE known=35737; PB known=45054.
- PE percentile known totals: 252=34452, 756=32436, 1260=30567, expanding=34452.
- PB percentile known totals: 252=43548, 756=41237, 1260=39489, expanding=43548.
- snapshotBundleHash=`2b16513f237ca1c45b1658d5eaa35b5b45d7f23766b87aff7b8a85aec11f1c91`; objectBundleHash=`235f2c43281846aa8be65f26829935a0193875ee92fe5169784f3f73c355a077`.
- All 44 immutable objects passed readback. No returns, outcome join, D1 writes, System1 runtime or Formal Core impact.
- D08-03 remains **L3/60**; next gate is outcome-blind control snapshot freeze before any Historical-Valuation Shadow join.
