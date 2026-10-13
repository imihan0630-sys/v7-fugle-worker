# Room 11 D16/D18 size-state consistency audit — 2026-10-13

Status: RESEARCH_ONLY. Formal Core remains LOCKED.

## New falsification
The existing D18-06 index-size interaction parser classified `LARGE_LED` from the producer label without checking whether the three numeric total-return-index legs agree. A synthetic counterexample with large=-5, mid=0, small=5 and a LARGE_LEAD label was accepted by the old function.

Isolated research-branch fix: fail closed with `SIZE_STATE_RETURN_CONFLICT` on contradictory large-vs-small/mid leadership or a strict-leader tie. Tests `SZ-T15` through `SZ-T17` were added. Narrow extracted-function checks passed 5/5. An isolated execution of the actual fetched branch source and 17 fetched test cases passed 17/17, using a deterministic hash shim rather than Node crypto; canonical GitHub Actions CI is NOT verified. Draft PR creation was twice blocked by tool safety checks.

## Formal maturity scope conflict
The existing `D18_06_SIZE_STRATEGY_INTERACTION_L3_ACCEPTANCE_20261009_V0_1.md` accepted market-level D09-08 total-return-index context with 14/14 targeted tests. However, the canonical tracker still uses a stricter constituent-level S1 effective-market-cap denominator-vintage requirement and keeps D18-06 at L2/40. These are distinct capabilities. No tracker promotion is authorized by this audit alone.

## Scientific assessment
Support: genuine official index receipts with decision-clock provenance.
Falsification: horizon conflict, categorical/numeric mismatch, tiny independent-date N.
Alternatives: sector composition, liquidity, volatility, constituent churn and market beta.
Failure: late data, revision backfill, outcome-tuned labels, missing same-cost static controls, multiple-testing rescue.

## Exact next
Run full D18-06 test suite on this branch; verify independent regression and real official source consistency; reconcile the index-vs-S1 maturity scope before any tracker change. Then consume the next genuine D16-20 same-cut treatment/untreated-population receipt, or D18-04 physical price-continuity receipt. Keep unknown and prospective outcomes closed. No Formal Core changes.
