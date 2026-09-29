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
