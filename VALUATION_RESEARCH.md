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
