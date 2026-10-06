# D03 Interaction Falsification Execution Readback V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Source main at read: 862b8c903e81e0945ba030b396b8a7d661f91f1e
Status: RESEARCH_ONLY / SIX_FIXTURES_EXECUTED / OUTCOME_CLOSED
Formal Core: LOCKED

## Purpose

Close the execution-evidence gap recorded at TI-853~970. The six canonical repository fixtures already defined 90 deterministic cases, but the checkpoint explicitly had no Node/CI execution receipt. This round fetched the exact latest-main blobs and executed all six with Node.

This readback validates contract mechanics only. It does not validate economic outcomes, Taiwan-stock alpha, prospective power or production readiness.

## TI-971 — immutable execution provenance

All fixtures and their imported JSON contracts were fetched from latest main before execution. Each process exited with code 0. No fixture or contract was modified before execution.

The aggregate receipt pins repository blob SHAs, observed outputs and the authoritative source-main SHA.

## TI-972 — negative-control / permutation oracle

Observed: status=PASS; cases=21.

Confirmed: naive row shuffle rejected; arbitrary derived-field shuffle rejected; conditional-model misspecification and dependence break block; lineage recomputation required; zero permutation p-value rejected; pipeline replay mismatch and unresolved same-null disagreement block; plus-one p-value with zero exceedances and M=99 equals 0.01.

## TI-973 — indicator-specific falsifier mapping

Observed: status=PASS; cases=14.

Confirmed: Bollinger component shuffle, ADX directional-movement / true-range field shuffle and raw global volume shuffle are rejected; descendant recomputation plus decision-clock and continuity symmetry are required.

## TI-974 — pipeline-level null replay

Observed: status=PASS; cases=15.

Confirmed: full pipeline replay required after search; a fixed candidate is allowed only when genuinely fixed ex ante; a null draw may select a different winner; support/cost symmetry and statistic-scale identity are mandatory; failed null draws remain visible.

## TI-975 — null-generator validation and disagreement

Observed: status=PASS; cases=15.

Confirmed: target break and nuisance preservation are simultaneous gates; support inflation/degradation both block; conditional misspecification sensitivity is required; a valid low-power falsifier blocks strong inference; same-null contradiction blocks; different-null disagreement stays null-specific.

## TI-976 — D03-to-D16 method-receipt acceptance

Observed: status=PASS; cases=12.

Confirmed: method-ready still does not authorize outcomes; legitimate blocking states are accepted; invalid ready receipts and fixed-winner null after observed search are rejected.

## TI-977 — null-of-null calibration

Observed: status=PASS; cases=13.

Confirmed: held-out synthetic audit plus correlated/dependent no-interaction worlds are required; calibration-overfit guard is active; synthetic audit pass contributes zero market-evidence units.

## TI-978 — aggregate decision

Aggregate: six fixtures executed; 90/90 canonical deterministic cases passed; all process exit codes were zero; outcomeDataUsed=false and formalCoreImpact=NONE_LOCKED for every fixture.

Interpretation:
- the previously missing repository Node execution receipt is closed for these six contract fixtures;
- this is not a D16 empirical receipt and does not clear source, support, outcome, OOS, cost or prospective evidence gates;
- no maturity promotion is justified;
- no FORMAL_OPTIMIZATION_CANDIDATE is created.

## Support, counterevidence and failure boundaries

Support: executable invariants agree with the written TI-853~970 semantics, reducing the chance that prose and machine contracts diverge.

Counterevidence: deterministic synthetic fixtures can all pass while an empirical null generator remains unidentified, low-powered, misspecified or invalid under real Taiwan-market dependence.

Alternative explanation: successful execution may reflect only internal consistency of the fixture implementation. It is not external scientific replication.

Failure boundaries: any source blob/version drift requires re-execution; a future D16 receipt must still bind exact versions and may legitimately return a blocking state; no failed/null empirical result may be omitted or redesigned after inspection; historical Shadow evidence must not be fabricated.

## Exact next continuation point

First re-read external machine lanes. If still unchanged, freeze a causal-direction / lead-lag placebo hierarchy that separates predictive timing from contemporaneous association, preserves date/sector/regime/symbol dependence, uses only information observable at the decision clock and forbids future-state leakage. This remains maturity-neutral until genuine prospective/raw-source or D16 evidence arrives.

