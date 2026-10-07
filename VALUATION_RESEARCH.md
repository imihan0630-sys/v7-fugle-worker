# Valuation / Relative Valuation Research

Updated: 2026-09-26 Asia/Taipei
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED

## VAL-001 — Scope and existing Formal rule
Valuation is already part of System 1 Formal behavior, so research must falsify the existing rule rather than assume valuation is merely descriptive.

Production audit:
- TWSE source: daily BWIBBU_d for the scan date.
- TPEx source: tpex_mainboard_peratio_analysis.
- preserved fields include PE, PB, valuationObserved/date/source.
- missing PB blocks fine selection; missing data is not neutral.
- sectorMedianPe uses positive PE peers with at least 3 observations.
- current Formal reject: positive PE / sectorMedianPE > 2.5 AND neither quarterly revenue YoY nor EPS YoY > 25%.

No threshold change is authorized.

## VAL-002 — Denominator and PIT semantics
PE missing/N/A is UNKNOWN, never zero/cheap/expensive. PB is a different denominator and cannot silently replace PE.
Official TWSE material states PE is not calculated when after-tax EPS is zero or negative. TPEx warns that ex-right dates and financial-data update timing can differ and capital changes affect PE interpretation. Corporate-action provenance is therefore required around affected dates.

## VAL-003 — Positive mechanisms
Pre-registered possibilities:
1. extreme sector-relative valuation without matching growth may proxy expectation/crowding risk;
2. valuation conditional on quality/growth may separate expensive leadership from unsupported multiple expansion;
3. sector-relative valuation may be more meaningful than market-wide raw PE;
4. valuation may add downside/MAE or false-breakout protection even without mean-return alpha.

## VAL-004 — Countermechanisms
Mandatory alternatives:
1. high relative PE may correctly price durable growth/leadership and the veto may discard winners;
2. low PE may be a value trap;
3. temporarily depressed earnings can mechanically inflate PE;
4. sector median with only 3 positive-PE peers may be unstable;
5. sector labels can mix business models;
6. the 25% growth exception may be redundant with existing fundamentalScore/revenue/EPS gates;
7. relative PE may proxy late-stage price momentum already captured by overheat/RS;
8. D1/D3/D5 may be too short for valuation directional alpha.

## VAL-005 — Frozen falsification
No threshold sweep. Compare exact current states:
- CURRENT_PASS;
- VALUATION_REJECT_ONLY, with observable upstream Formal conditions held fixed;
- HIGH_REL_PE_WITH_GROWTH_EXCEPTION;
- PE_UNKNOWN;
- PB_OBSERVED_PE_UNKNOWN.

Targets: D1/D3/D5 return, MFE, MAE, stop-first/false-breakout where observable, candidate coverage and zero-pick impact.
Inference unit = independent scanDate. Use within-date comparisons, LODO/date-cluster diagnostics, market/sector/regime strata, crisis-date removal and cost sensitivity.

## VAL-006 — Redundancy gate
Require incremental value after A/B technical state, Price-Volume, sector RS/breadth, stock residual RS/trend, fundamentalScore and raw growth, liquidity/size, overheat/lateStage and RR. If valuation only restates these, mark REJECTED_OR_REDUNDANT.

## VAL-007 — Selection-bias firewall
Selected rows cannot prove whether a veto is useful because rejected rows are absent by construction. Historical reconstruction from today's valuation or today's denominator is prohibited.
A valid test requires PIT receipts for pass and valuation-rejected counterfactual candidates at the scan timestamp. If existing Shadow lacks the exact reject cohort/upstream state, historical effect remains UNKNOWN and prospective capture is required.

## VAL-008 — Optimization bridge
Symmetric possible outcomes:
- KEEP current veto if it survives falsification and adds protection;
- RELAX/REMOVE if rejected candidates outperform or veto is redundant/fragile;
- REFORMULATE if valuation matters but the current 2.5x + 25% representation is not robust.

Any Formal valuation-gate change is Class C and requires owner approval after PIT/OOS, independent-date, multi-regime, redundancy, cost, coverage/zero-pick and overfit gates.

Current status: FALSIFICATION_IN_PROGRESS / PIT_COHORT_AUDIT_REQUIRED / NOT_OPTIMIZATION_READY.


## VAL-009 — Trailing PE is a PIT observable, not a universal cheapness scale

Research date: 2026-09-28 Asia/Taipei.

TWSE official semantics make the denominator explicit: daily PE uses closing price divided by EPS based on the most recent four reported quarters, and PE is not calculated when EPS <= 0. PB uses the most recent reported quarterly book value. Therefore PE_UNKNOWN is a mixed state that can include non-positive earnings and must never be ranked as ultra-cheap.

Critical cycle inversion: a cyclical company near peak earnings can show a deceptively low trailing PE; near trough earnings the same business can show a very high or unavailable PE. Historical or sector-relative PE without normalized earnings can therefore invert the economic interpretation.

Frozen implication: D08-03 historical percentile must not be promoted until denominator-regime controls exist. For cyclical/commodity groups, test normalized earnings or cycle-state conditioning rather than raw percentile alone.

Status: PIT_SEMANTICS_CONFIRMED / CYCLE_INVERSION_COUNTEREXAMPLE_CONFIRMED / NO_FORMAL_CHANGE.

## VAL-010 — EV/EBITDA is useful only with capital-intensity and sector guards

EV/EBITDA can remain defined when net income is negative and incorporates debt/cash through enterprise value, which can make it useful where PE fails. But EBITDA ignores capital expenditure and working-capital requirements. Cross-company comparison is especially unsafe when capital intensity differs materially. Financial institutions also require separate treatment; standard EV/EBITDA is generally not an appropriate pooled comparator.

Research-only normalized object:
- compare EV/EBITDA within economically coherent peer groups;
- preserve debt/cash timestamp consistency with market cap and financial statement vintage;
- pair with capex intensity and ROIC/operating profitability rather than treating low EV/EBITDA as cheap by itself;
- maintain UNKNOWN when enterprise-value components cannot be reconstructed point-in-time.

Kill rule: if EV/EBITDA adds no stable increment after sector-relative PE/PB, leverage, profitability and capital-intensity controls, reject it as redundant.

Status: D08-06 MECHANISM_PLUS_COUNTEREVIDENCE_DEFINED / PIT_COMPONENT_AUDIT_NEXT / NO_FORMAL_CHANGE.

## VAL-011 — FCF Yield requires a frozen FCF definition and reinvestment interpretation

IFRS does not currently prescribe one universal FCF subtotal. Therefore FCF Yield cannot be safely researched until numerator semantics are frozen. A minimal industrial-company research definition may begin with CFO minus qualifying capital expenditures, but maintenance capex versus growth capex is not directly interchangeable and classification differences can materially change the result.

Positive mechanism: high FCF relative to enterprise/equity value may identify cash-generative businesses whose accounting earnings understate distributable economics.

Countermechanisms:
- growth capex can make a healthy expanding firm look poor on FCF;
- underinvestment can make a deteriorating firm look temporarily strong on FCF;
- working-capital release can create one-off FCF spikes;
- acquisitions and leases complicate cross-company comparability;
- financial firms require separate semantics.

Research design must use multi-period persistence and capex/reinvestment context, not one-quarter FCF Yield.

Status: D08-07 MECHANISM_PLUS_COUNTEREVIDENCE_DEFINED / FORMULA_NOT_YET_FROZEN / NO_FORMAL_CHANGE.

## VAL-012 — Quality-adjusted valuation is the candidate research architecture

International evidence supports interactions among profitability, investment and value; it also warns that value can become redundant after profitability/investment controls in some specifications. Therefore the next Taiwan experiment should not ask whether low PE wins. It should ask whether valuation contributes conditional information after growth and quality are known.

Pre-registered conceptual grid:
- growth quality: realized growth acceleration/deceleration;
- earnings quality: profitability persistence + cash conversion/accrual state;
- capital efficiency: ROIC/ROE with leverage guards;
- valuation: sector-relative trailing PE/PB first, later EV/EBITDA/FCF Yield only after PIT feasibility;
- regime: sector cycle + broad market regime;
- price state: RS/overheat/late-stage controls.

Primary hypotheses:
H1: expensive + improving quality may be justified leadership rather than an automatic veto;
H2: cheap + deteriorating quality is a value-trap state;
H3: cheap + stable/improving quality may be a genuine value-quality state;
H4: valuation may contribute more to MAE/false-breakout risk than D1/D3 directional return.

Falsification:
- within-date and within-sector comparisons;
- scanDate as inference cluster;
- PIT first-known financial vintage only;
- no threshold sweep;
- control existing fundamentalScore and technical/price-volume/RS/regime signals;
- independent dates, OOS/walk-forward and prospective Shadow before promotion;
- coverage/zero-pick and transaction-cost checks.

This architecture is a RESEARCH_CANDIDATE, not a FORMAL_OPTIMIZATION_CANDIDATE. Evidence is not yet sufficient for System 1/System 2 production changes.

Exact next continuation: verify point-in-time component availability, freeze sector policies and formulas, then create prospective Shadow schema before any return comparison.


## VAL-013 — Forward PE is a forecast-vintage object, not simply a better PE

Forward PE must freeze both the earnings horizon and the forecast vintage. Price / next-fiscal-year EPS, Price / next-twelve-month EPS and Price / current-year consensus EPS are different variables and must never be pooled under one label.

Required semantics before any Taiwan test:
- price timestamp/date;
- forecast provider and consensus construction rule;
- exact forecast snapshot/vintage timestamp;
- number/coverage of contributing analysts where available;
- EPS horizon and fiscal-year mapping;
- treatment of negative/near-zero expected EPS;
- revision history rather than only the latest consensus.

Taiwan evidence published in 2026 reports predictive content in analyst forecast earnings-growth revisions, but that study used a proprietary/third-party consensus dataset and a restricted index-based sample. It supports the research mechanism; it does not supply this system with a canonical licensed point-in-time source and does not justify importing its reported return magnitudes as thresholds.

Current repository source matrix still classifies Forward PE/estimates as SOURCE_NEEDED. Therefore D08-04 advances only to L1 theory-understood, not L2/L3.

Status: D08-04 L1 THEORY_DEFINED / CANONICAL_PIT_SOURCE_NEEDED / NO_FORMAL_CHANGE.

## VAL-014 — PEG requires more guards than PE divided by growth

PEG is attractive because it attempts to relate valuation to growth, but the denominator makes it fragile.

Frozen counterexamples:
- negative expected growth makes the sign economically ambiguous;
- growth near zero explodes the ratio;
- one-year growth and multi-year PE horizons create horizon mismatch;
- cyclical rebound from a depressed base can produce an artificially low PEG;
- high sustainable growth with long duration can look expensive under a short-horizon PEG;
- different providers may use trailing PE, forward PE, historical EPS growth or forecast growth, producing non-comparable PEG values.

Research rule: PEG may only be derived when the PE basis and growth basis share an explicitly compatible horizon and forecast vintage. Otherwise PEG=UNKNOWN. It is a contextual normalization candidate, not a universal cheapness threshold.

Falsification: compare PEG against its two primitives (valuation and expected growth/revision). If PEG adds no stable incremental information after those primitives and sector/regime controls, mark it REDUNDANT.

Status: D08-05 MECHANISM_PLUS_COUNTEREVIDENCE_DEFINED / L2 / PIT_SOURCE_DEPENDENT / NO_FORMAL_CHANGE.

## VAL-015 — Quality-adjusted valuation preregistration now exists before outcomes

Machine-readable spec: research/fundamental_quality_valuation_shadow_spec_v0_1.json.

Initial point-in-time valuation lane:
- official same-day trailing PE;
- official same-day PB;
- sector-relative PE only when the peer set is economically coherent and sufficiently observed.

Blocked until separate source contracts:
- Forward PE / analyst estimates;
- PEG;
- EV/EBITDA;
- FCF Yield;
- historical PE/PB percentile.

The preregistered hypotheses remain symmetric: expensive/improving-quality may be justified; cheap/deteriorating-quality may be a value trap; cheap/stable-or-improving quality may represent value-quality; valuation may help downside/path-quality more than very-short-horizon directional return.

The design explicitly prohibits outcome-driven threshold sweeps and requires comparison against existing fundamentalScore, technical/PV, RS, industry/regime, liquidity/size and overheat controls.

Status: PREREGISTERED_SHADOW_ARCHITECTURE / PIT_PARTIAL / OUTCOMES_LOCKED / NOT_FORMAL_OPTIMIZATION_CANDIDATE.

## VAL-016 — International profitability/value evidence strengthens the interaction hypothesis, not a low-valuation rule

The Fama-French five-factor evidence shows profitability and investment can absorb part of traditional value information in their U.S. sample; Novy-Marx shows gross profitability can predict returns despite profitable firms often trading at richer valuations. But international evidence is heterogeneous: profitability/investment relations are weaker in some regions/markets.

System implication:
- valuation should be tested conditionally on quality, investment/reinvestment and regime;
- a premium found internationally must not be imported as a Taiwan production factor;
- if Taiwan PIT/OOS results show quality already explains the apparent valuation effect, valuation should be down-weighted/rejected as redundant rather than preserved by intuition;
- conversely, if valuation contributes independent downside/path-quality information after quality controls, retain it as a conditional risk dimension.

This directly supports the pre-registered interaction architecture while preserving a symmetric rejection path.

Exact next continuation: finish the official GENERAL_INDUSTRY cash/balance-sheet field contract and accumulate prospective receipts; Forward PE/PEG remain source-gated and must not delay the source-honest trailing-valuation Shadow lane.


## VAL-017 — Forward PE needs numerator/denominator attribution

Forward PE is not a single economic state. A lower Forward PE can be caused by:
1. price falling while forecast EPS is unchanged;
2. forecast EPS rising while price is unchanged;
3. both moving;
4. horizon roll or consensus-composition change.

Only case 2 is cleanly consistent with denominator improvement; case 1 may instead reflect new risk.

Therefore Forward PE research must persist price and forecast EPS separately and decompose every valuation change. It is prohibited to treat raw Forward-PE compression as a bullish improvement.

For compatible positive values:
Forward PE = decision-time price / point-in-time analyst consensus EPS.

A separate forward earnings yield = consensus EPS / price may be retained as a research primitive, including negative values, but it must not be mislabeled PE.

Status: FORWARD_PE_ATTRIBUTION_DEFINED / SOURCE_NEEDED / NO_FORMAL_CHANGE.

## VAL-018 — Forward PE horizon-roll contamination

Current-FY PE naturally changes its economic horizon as the calendar approaches fiscal year-end even if price and analyst beliefs do not move. Next-FY and NTM estimates have different roll mechanics.

Therefore:
- CURRENT_FY, NEXT_FY and NTM are separate series;
- horizon roll must be tagged explicitly;
- a change caused by roll is not an analyst revision;
- comparing current-FY PE in January with current-FY PE in December without horizon controls is not like-for-like valuation history.

This is a second reason historical Forward-PE percentiles cannot be built from unlabeled vendor snapshots.

Status: HORIZON_ROLL_FIREWALL_DEFINED / D08-04 MECHANISM_PLUS_COUNTEREVIDENCE_COMPLETE.

## VAL-019 — Coverage and forecast age belong inside forward-valuation uncertainty

Two companies with the same consensus EPS can have very different information quality:
- one may have ten recent, tightly clustered forecasts;
- another may have one old forecast.

Therefore point estimates alone are insufficient. Forward-valuation receipts should retain:
- coverageCount;
- dispersion;
- newest/oldest forecast age;
- revision breadth;
- source/broker concentration.

These fields are uncertainty/context variables, not automatic bonuses. High dispersion can reflect uncertainty, heterogeneous private information, delayed bad-news disclosure or simple sparse/stale coverage; literature does not support one universal directional interpretation.

Status: FORECAST_UNCERTAINTY_CONTEXT_DEFINED / DIRECTIONAL_ALPHA_UNKNOWN.

## VAL-020 — Taiwan evidence supports revision research, not threshold import

The 2026 Taiwan study reports economically large revision-sorted returns, but its design uses monthly CMoney forecasts and a restricted index-constituent universe. A separate Taiwan thesis reports mixed analyst-characteristic long-short results and small-cap/outlier sensitivity.

System implication:
- do not import the published 2.11% / 2.81% return figures as expected system performance;
- do not import a revision magnitude threshold;
- do not generalize index-constituent coverage to the full listed/OTC universe;
- require within-date/sector/size/liquidity controls and independent-date inference;
- test revision increment after current fundamentalScore, realized growth, price-volume, RS and regime.

D08-04 can advance to L2 because Forward-PE mechanism, failure modes and PIT semantics are now defined, but L3 remains blocked until a canonical authorized PIT forecast source is proven.

Status: D08-04 L2_CONCEPT_AND_FALSIFICATION_COMPLETE / PIT_SOURCE_NEEDED / NOT_FORMAL_OPTIMIZATION_CANDIDATE.


## VAL-021 — Official Taiwan history makes trailing PE/PB self-history PIT-feasible

Research date: 2026-10-02 Asia/Taipei.

Machine contract:
research/historical_valuation_percentile_pit_contract_v0_1.json.

TWSE official daily valuation history provides stock-level PE/PB observations from 2005-09-01 onward. Official semantics state that PE uses closing price divided by EPS from the most recent four reported quarters, PE is not calculated when EPS <= 0, PB uses the most recent reported quarterly book value per share, and the historical service does not provide back-calculations.

TPEx also provides official historical PE/PB inquiry by date and by stock code, with an explicit warning that ex-rights timing and financial-data update timing can differ and that capital changes affect PE interpretation.

This establishes Taiwan historical-source feasibility for self-history trailing PE/PB without reconstructing past valuation using today's financial statements.

It does not establish predictive alpha.

Status: D08-03 TAIWAN_PIT_SOURCE_FEASIBLE / L3_SOURCE_GATE_MET / OUTCOMES_CLOSED.

## VAL-022 — Historical percentile is conditional context, not an absolute cheapness oracle

Historical PE percentile has structural censoring:
- PE is undefined when trailing EPS <= 0;
- loss and turnaround periods disappear from the numeric PE distribution;
- a later return to positive EPS can look artificially extreme because important loss states are outside the numeric sample.

PE N/A must therefore retain an explicit state such as NONPOSITIVE_EPS, SOURCE_NA_OTHER or UNKNOWN. It must never be coerced to zero, infinity, the cheapest bucket or the most expensive bucket.

Cycle inversion remains mandatory counterevidence. A cyclical company near peak earnings may show a historically low PE just before profits normalize downward. Self-history cheapness does not solve denominator-cycle risk.

PB can remain numeric when earnings are negative, but business-model and balance-sheet comparability remain sector dependent.

Status: CENSORING_AND_CYCLE_COUNTEREVIDENCE_FROZEN / NO_LOW_PERCENTILE_BUY_RULE.

## VAL-023 — Percentile windows are preregistered as parallel descriptive variants

To prevent window mining, the first contract freezes four descriptive histories before outcomes:
- trailing 252 valid sessions;
- trailing 756 valid sessions;
- trailing 1260 valid sessions;
- expanding history since official data availability.

No window is called optimal.

For every asOf timestamp:
- only observations at or before asOf are eligible;
- validObservationCount and elapsed session/calendar span are preserved;
- insufficient history => UNKNOWN;
- ties require one explicit empirical-CDF convention before implementation because rounded ratios can create many ties;
- structural breaks such as capital actions, denominator fiscal updates, major M&A/accounting-scope changes and loss-to-profit transitions remain context fields.

Falsification:
- if percentile adds no stable information beyond raw PE/PB plus quality, sector/peer, RS/trend and regime, mark REDUNDANT;
- if an effect exists in one window only, mark WINDOW_FRAGILE;
- if low percentile is concentrated in cyclical peak-earnings states, reject a universal value interpretation.

D08-03 may advance from L1 to L3 because both mechanism/counterevidence and Taiwan official PIT history feasibility are now established. L4 still requires prospective Shadow or OOS evidence.

Status: D08-03 L3_PIT_FEASIBLE / SHADOW_OUTCOME_JOIN_NOT_OPEN / NOT_FORMAL_OPTIMIZATION_CANDIDATE.


## VAL-024 — Historical PE/PB replay mechanics frozen and adversarially checked

Research date: 2026-10-03 Asia/Taipei.

Fixture:
research/historical_valuation_percentile_replay_fixture_v0_1.json.

Validation receipt:
research/historical_valuation_percentile_replay_validation_receipt_20261003.json.

Tie convention is now frozen as average-rank percent rank:
(countLess + 0.5*(countEqual - 1)) / (N - 1), for N > 1.

This convention maps:
- sample minimum to 0;
- sample maximum to 1;
- tied observations to their average rank;
- an all-equal sample to 0.5.

Independent arithmetic QA passed the tie, all-equal, minimum and maximum fixtures.

Fixed-window minimum history is conservative:
- 252-valid-session percentile requires 252 valid observations;
- 756 requires 756;
- 1260 requires 1260;
- expanding history is not reported before 252 valid observations.

This prevents short-history/new-listing samples from masquerading as stable historical extremes.

Status: REPLAY_MECHANICS_QA_PASS / NO_OUTCOME_EVIDENCE / D08-03_REMAINS_L3.

## VAL-025 — Missing PE and structural breaks remain stateful

PE missingness is not a number.

Frozen mapping:
- proven nonpositive trailing EPS -> NONPOSITIVE_EPS;
- source-declared other N/A -> SOURCE_NA_OTHER;
- unproven reason -> UNKNOWN.

PB can remain independently usable when PE is missing.

Structural breaks are tags, not automatic reset triggers:
- fiscal denominator update;
- EPS sign transition;
- ex-rights/capital change;
- par-value/split event;
- major M&A/scope change;
- accounting-policy/standard change;
- limited listing age;
- long suspension gap.

A structural break may later justify a break-conditioned experiment, but the replay layer itself does not silently reset history or rewrite earlier official ratios.

Late correction rule:
if a corrected historical ratio first becomes observable after the replay asOf time, it cannot overwrite the earlier decision-time state.

Status: FAIL_CLOSED_NA_AND_VINTAGE_RULES_VALIDATED / OUTCOMES_CLOSED.

## VAL-026 — Official source witnesses confirm numeric and PE-missing/PB-present independence

The 2026-10-02 official TWSE valuation table provides both:
- ordinary numeric PE/PB rows;
- rows where PE is unavailable while PB remains numeric.

This directly validates the implementation requirement that PE/PB availability be handled independently.

TPEx official historical PE/PB inquiry remains a separate market source contract; its exact column mapping must be validated from the source schema before automated replay. No ambiguous scraped column order is accepted.

Status: SOURCE_WITNESS_PASS / TPEX_SCHEMA_MAPPING_STILL_REQUIRED / NO_MATURITY_CHANGE.

Exact next D08-03:
freeze source parser/schema fingerprints for TWSE and TPEx, then perform representative replay across ordinary, loss-making, capital-action and new-listing histories. Only after replay integrity is proven may the Historical-Valuation × Quality Shadow join be preregistered.


## VAL-027 — Historical valuation source contracts must remain market-specific

Research date: 2026-10-03 Asia/Taipei.

Machine contracts:
- research/historical_valuation_dual_market_source_schema_contract_v0_2.json
- research/historical_valuation_source_case_validation_receipt_20261003_v0_2.json.

TWSE public historical daily valuation is directly machine-readable through BWIBBU_d. The verified response envelope contains stat/date/title/fields/data and explicit headers for symbol, name, close, PE, PB and financial-report year/quarter. Parsing must use returned header names rather than fixed positions.

TPEx is not currently symmetric:
- the public historical PE/PB page is verified and states modern coverage from ROC 96/01;
- the current OpenAPI schema is verified;
- an old/public historical machine-route candidate can be located, but direct official retrieval in this research environment did not return a stable response envelope;
- therefore its hidden/legacy JSON layout is NOT frozen from third-party implementations.

Rule:
source-family existence does not equal machine-replay completeness.

Status: TWSE_PUBLIC_REPLAY_READY / TPEX_PUBLIC_HISTORY_VISIBLE_MACHINE_TRANSPORT_UNVERIFIED / NO_FORMAL_CHANGE.

## VAL-028 — Fiscal denominator-period transitions are part of valuation identity

The official TWSE monthly stock history for 9904 寶成 gives a direct denominator-transition witness:
- 2026-08-12: PE 6.60, PB 0.47, fiscal report period 115/1;
- 2026-08-13: PE 5.06, PB 0.38, fiscal report period 115/2.

A large valuation-ratio move can therefore occur when the official denominator vintage changes, even without interpreting the move as a pure price-driven repricing event.

Historical percentile replay must preserve:
- fiscalReportPeriod;
- fiscalDenominatorChangedToday;
- daysSinceFiscalDenominatorChange when available.

No automatic history reset is authorized. The transition is a context tag to be tested, not an exclusion window selected after outcomes.

Status: DENOMINATOR_PERIOD_BREAK_WITNESS_CONFIRMED / PERCENTILE_REPRICING_EQUIVALENCE_REJECTED.

## VAL-029 — TPEx public history and licensed EDIS history are separate authority lanes

The official TPEx public page provides historical PE/PB inquiry. Separately, official EDIS after-market format V1.33 documents S17 / STKPEYIPBR.TXT as a deterministic machine file with:
- stock code;
- stock name;
- PE;
- dividend yield;
- PB;
- YYYYMMDD data date;
- HHMM production time.

The S17 file belongs to the fourth after-market statistics subscription group. Its documented schema proves that an authorized deterministic machine lane exists, but this research does not authorize purchase, subscription, download or use.

The public historical webpage cannot silently inherit the licensed S17 schema, and a hidden public endpoint cannot be treated as canonical until directly verified.

Status: PUBLIC_UI_AND_LICENSED_MACHINE_LANE_SEPARATED / NO_HIDDEN_ENDPOINT_ASSUMPTION.

## VAL-030 — TWSE-only historical valuation Shadow is preregistered without claiming full Taiwan coverage

Machine preregistration:
research/historical_valuation_twse_shadow_prereg_v0_1.json.

The first empirical lane is explicitly TWSE-only because TWSE historical replay is machine-verifiable while TPEx automated historical transport remains incomplete.

Primary question:
does self-history PE/PB percentile add incremental information beyond raw PE/PB after quality, sector/peer, size/liquidity, RS/trend, regime and denominator-transition controls?

No valuation threshold is frozen. Historical percentiles remain continuous primary features; 252/756/1260/expanding windows are parallel preregistered variants, not a tournament for the best return.

The design explicitly tests whether:
- low PE percentile plus deteriorating/peak-cycle earnings behaves differently from low percentile plus improving quality;
- fiscal denominator updates create artificial percentile jumps;
- PB retains contextual value when PE is unavailable;
- any apparent effect survives raw valuation and existing fundamental controls.

TPEx/full-Taiwan generalization is prohibited from this pilot.

Status: TWSE_SHADOW_PREREGISTERED / OUTCOME_JOIN_LOCKED / NOT_FORMAL_OPTIMIZATION_CANDIDATE.

## VAL-031 — Executable TWSE replay parser and CI guard verified

Research-only implementation:
- research/historical_valuation_replay_core_v0_1.mjs
- research/test_historical_valuation_replay_core_v0_1.mjs
- system2/tests/d08_historical_valuation_replay_guard.test.mjs.

PR #364 merged to main at merge commit 6943edc24ca4c1d78c525b33b730d911f245e4fa after exact-head verification:
- System2 Research CI run 37107054148: PASS;
- V8 Repair CI run 37107054216: PASS;
- V8 Regression run 37107054202: PASS.

The System2 CI log explicitly executed d08_historical_valuation_replay_guard.test.mjs and returned ok=true with system2RuntimeImpact=false and formalCoreImpact=false.

Parser protections include:
- header-name mapping instead of positional assumptions;
- PE/PB independent missingness;
- schema-drift fail-closed behavior;
- duplicate-symbol rejection;
- fiscal-denominator transition tagging;
- average-rank percentile tie semantics;
- minimum-history fail-closed behavior.

This is implementation/replay integrity evidence only. It does not constitute L4 Shadow/OOS outcome evidence.

Status: TWSE_REPLAY_PARSER_VERIFIED / D08-03_REMAINS_L3 / FORMAL_CORE_UNCHANGED.

Exact next:
1. collect a bounded source-only TWSE historical replay sample with immutable raw payload fingerprints and readback receipts;
2. include ordinary, PE-missing/PB-present, fiscal-denominator transition, corporate-action-context and newly listed cases;
3. calculate preregistered 252/756/1260/expanding percentiles without opening stock-return outcomes;
4. verify coverage/missingness and listing-age behavior;
5. only then open the preregistered TWSE Historical-Valuation Shadow outcome join;
6. keep TPEx outside the empirical cohort until public historical machine transport is directly verified or an authorized licensed lane exists.


## VAL-032 — Bounded TWSE 5-year historical replay is source-ready

Durable receipt:
research/d08_twse_bounded_history_source_receipt_20261003_v0_1.json.

A disposable read-only capture harness was executed in PR #381 and intentionally closed without merge. Final exact-head verification:
- System2 Research CI run 37122478859: PASS;
- V8 Regression run 37122478893: PASS.

Two failed attempts are retained as evidence rather than erased:
1. a 2026-10 monthly query first used 2026-10-31, which TWSE correctly rejected as future-dated on 2026-10-03. The collector was corrected to latest completed session 2026-10-02.
2. the 3593 fixture first assumed a normal pre-event 2025-12-19 session. The verified corporate-action lifecycle instead requires old-share last trading session 2025-12-10 -> new-share resume session 2025-12-22.

This freezes two replay invariants:
- month-level source convenience may never cross the replay asOf;
- corporate-action joins use legal exchange sessions, not adjacent calendar dates.

## VAL-033 — Window sensitivity is empirically material before any return join

Official TWSE monthly history for 1102 亞泥 produced 1,300 valuation rows from 2021-06-01 through 2026-10-02.

At 2026-10-02:
- PE = 9.83;
- PB = 0.68.

Average-rank historical percentile:
- PE252 = 0.11554;
- PE756 = 0.03841;
- PE1260 = 0.15171;
- PE expanding = 0.14781;
- PB252 = 0.22908;
- PB756 = 0.07616;
- PB1260 = 0.04567;
- PB expanding = 0.04426.

Therefore window choice can materially change the numerical rank even before any return outcome is inspected. The preregistered parallel-window design is retained. Selecting the best window by later returns remains prohibited.

This is not a statement that 1102 is cheap or attractive. It is source/mechanics evidence only.

## VAL-034 — Structural-break and missingness controls passed on real TWSE history

Real source-only controls:
- 9904 寶成: 2026-08-12 fiscal period 115/1 PE/PB 6.60/0.47 -> 2026-08-13 fiscal period 115/2 5.06/0.38. Denominator-period transition remains a required context tag.
- 3593 力銘: old-share last trading 2025-12-10 has PE unavailable/PB 4.35; new-share resume 2025-12-22 has PE unavailable/PB 6.61, same reported fiscal period 114/3. Corporate-action unit-scale boundary must not be read as ordinary continuous repricing.
- 7812 稜研科技*-創: official listing 2026-09-22; only 7 valuation rows through 2026-10-02, PE valid count 0 and PB valid count 7. 252/756/1260 percentile eligibility is false.
- 1101 台泥: 2026-10-02 PE unavailable while PB=0.82. PE missing and PB known remain independent states.

D08-03 remains L3/60. This strengthens source/replay integrity but does not satisfy L4 prospective/OOS outcome evidence.

Exact next:
1. freeze a broader multi-symbol TWSE cohort construction rule before returns;
2. precompute immutable source-only percentile snapshots on selected scan dates;
3. add raw valuation, sector/peer, size/liquidity, trend/RS, regime and denominator-transition controls without inspecting outcomes;
4. only then open the already preregistered TWSE-only Historical-Valuation Shadow outcome join;
5. TPEx remains excluded from inference until historical machine transport or an authorized licensed history lane is verified.


## VAL-035 — COV-05 sales multiples belong inside D08-06 rather than a new vote

Research date: 2026-10-04 Asia/Taipei.

Machine contract:
research/sales_enterprise_multiples_pit_contract_v0_1.json.

Specialist return:
research/COV05_D08_SPECIALIST_RETURN_V0_1.md.

COV-05 specialist recommendation is EXTEND_EXISTING_SCOPE, not ADD_MODULE.

Proposed owner:
D08-06 extends from a single EV/EBITDA label into a coordinated enterprise/revenue-multiple capability containing:
- EV/EBITDA;
- EV/Sales;
- P/S as the equity-value sales view;
- enterprise-value numerator contract;
- revenue-denominator alignment;
- margin/growth/capital-structure decomposition.

D08-09 remains the peer-normalization owner; D08-12 remains the corporate-action/share-denominator owner; D08-18 remains the financial-institution specialist owner.

The new sales-multiple sub-capability does not inherit D08-06 L2 maturity. Canonical D08-06 maturity remains unchanged pending 00-room intake/owner approval.

Status: COV05_RETURN_CONTRACT_COMPLETE / TERMINAL_RECOMMENDATION_EXTEND_EXISTING_SCOPE / 00_INTAKE_REQUIRED / NO_CANONICAL_CHANGE.

## VAL-036 — Sales multiples require margin and capital-structure interpretation

Frozen semantics:
- trailing P/S = decision-time equity market value / PIT-safe TTM consolidated revenue;
- trailing EV/Sales = PIT-safe enterprise value / PIT-safe TTM consolidated revenue;
- forward variants remain SOURCE_BLOCKED until authorized PIT sales forecasts exist.

Counterevidence:
- the same P/S can imply very different economics across low-margin distributors and high-margin businesses;
- peak-cycle sales can create false cheapness;
- negative-margin firms can have a computable P/S without a viable profit path;
- acquisition-heavy issuers can change both sales scope and enterprise value;
- P/S and EV/Sales share one sales denominator and cannot become two independent votes.

Taiwan monthly revenue is a separate timely series. It may not silently substitute for IFRS TTM revenue without a frozen reconciliation/scope contract.

Status: SALES_MULTIPLE_PIT_SEMANTICS_FROZEN / FORWARD_SOURCE_BLOCKED / NO_RETURN_OUTCOME / FORMAL_UNCHANGED.


## VAL-037 — Monthly TWSE scan clock is frozen before outcomes

Research date: 2026-10-04 Asia/Taipei.

Contracts and receipts:
- research/historical_valuation_twse_cohort_scan_contract_v0_1.json
- research/d08_twse_month_end_scan_date_receipt_20261004_v0_1.json
- research/d08_twse_cohort_contract_reconciliation_20261004_v0_1.json

The D08-03 empirical clock is now fixed at the last actual TWSE trading session of each month from 2023-01 through 2026-08, for 44 scan dates total.

The date list was resolved from official TWSE monthly history before return outcomes. It is not calendar-month-end substitution; for example, 2025-01 resolves to 2025-01-22.

Immutable scan-date list hash:
e4475abd9fe2ab867bf20e5a8ee2f1a000bdb78365afe6083e6433c2b5abc490.

The parent preregistration and the later executable cohort contract were reconciled as non-conflicting. The later contract adds explicit survivorship, UNKNOWN accounting, per-date coverage and outcome-unlock gates.

Status: 44_SCAN_DATES_FROZEN / OUTCOMES_CLOSED / FORMAL_UNCHANGED.

## VAL-038 — Empty D1 universe receipt is negative evidence, not permission to use today's list

A research-only D1 audit in temporary PR #430 passed its read-only/production-isolation guard but failed because `s2_historical_universe_registry_receipts` contained zero durable registry receipts.

Interpretation:
- the historical-universe schema and runtime exist;
- no durable registry version had been materialized in isolated D1;
- therefore D1 could not serve as the D08-03 historical universe authority at that moment;
- current-list-only reconstruction remained prohibited.

The PR was closed without merge. This failure is retained as evidence.

Status: D1_REGISTRY_NOT_MATERIALIZED / SURVIVORSHIP_SHORTCUT_REJECTED / SHADOW_STILL_CLOSED.

## VAL-039 — Official TWSE current+delisted union now yields a survivorship-safe 44-date universe receipt

Durable receipt:
research/d08_twse_official_universe_source_receipt_20261004_v0_1.json.

Source-only disposable PR #431 was closed without merge after:
- System2 Research CI run 37165989414 PASS;
- V8 Regression run 37165989421 PASS.

Official source construction:
- current listed-company profile: TWSE OpenAPI `t187ap03_L`;
- historical new-listing dates: TWSE `company/newlisting`;
- historical delisting dates: TWSE `company/suspendListing`;
- for old delisted names whose original listing date is outside the new-listing table, the existing registry contract uses official dataset-start trading presence as `HISTORY_FIRST_TRADING_DATE` rather than inventing a listing date.

Observed source counts:
- current ordinary listed TWSE rows: 1,089;
- 2023+ delisted ordinary rows: 12;
- delisted rows with official listing-date match: 9;
- dataset-start history fallback: 3 symbols = 1701, 2358, 2809;
- official first dataset trading date: 2023-01-03 with 972 ordinary symbols.

Normalized historical registry:
- membershipCount = 1,101;
- replayEligibleCount = 1,101;
- unknownStartCount = 0;
- currentCount = 1,089;
- delistedCount = 12;
- registryHash = 0b7b587b7962b9782570a3b9fc679be8440d0c4c2e75fc06d155bf95641041a7.

All 44 preregistered snapshots were generated with deterministic hashes:
- min memberCount = 975;
- max memberCount = 1,089;
- snapshotBundleHash = 97d1b5324b388753b09236cb3a731361aed1f009a775e868c305c30d8189844a.

This closes the cohort-membership gate only. It does not open returns.

Exact remaining pre-outcome gate:
1. materialize source-only valuation/control snapshots for all 44 dates;
2. account for every cohort member as KNOWN or explicit UNKNOWN;
3. emit per-date coverage/missingness receipts and immutable readback hashes;
4. retain raw PE/PB, 252/756/1260/expanding percentile states, denominator-transition/corporate-action/listing-age context, and preregistered control variables;
5. only then unlock the Historical-Valuation Shadow outcome join.

D08-03 remains L3/60. FORMAL_OPTIMIZATION_CANDIDATE = NO. Formal Core unchanged.


## 2026-10-08 D08-03 — 44-date outcome-blind percentile snapshots physically materialized

Run `37648084681` physically materialized and read back all 44 preregistered TWSE monthly percentile snapshots from frozen 2005-2026 daily valuation packs, universe V0.2 and raw valuation V0.3. This closes the percentile-materialization gate only; the outcome gate remains CLOSED.

Across 45305 cohort-member/date rows, PE current known=35737 and PB current known=45054. The asymmetry is preserved as missingness, never converted into a numeric cheap/expensive state. PE window coverage is 252=34452, 756=32436, 1260=30567, expanding=34452; PB is 252=43548, 756=41237, 1260=39489, expanding=43548.

The semantic snapshot bundle is `2b16513f237ca1c45b1658d5eaa35b5b45d7f23766b87aff7b8a85aec11f1c91`; stored-object bundle is `235f2c43281846aa8be65f26829935a0193875ee92fe5169784f3f73c355a077`. Every object passed byte-level and canonical-payload readback, while upstream year packs and raw V0.3 objects were revalidated before derivation. D08-03 stays L3/60 because this is source/replay integrity, not OOS/prospective outcome evidence. Exact next: freeze PIT-safe control snapshots and coverage before any Historical-Valuation Shadow outcome join.
