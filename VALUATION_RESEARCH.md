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
