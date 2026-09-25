# Class B Proposal — Formal daily-history freshness invariant

Date: 2026-09-25
Status: PROPOSAL / TEST PLAN ONLY — DO NOT PROMOTE
Baseline main: fff5c685cd77d4c3d00ca2fb519449c89234107a

## Problem
B-130 proved that `runHistorySeed()` currently treats a D1 history cache as complete when `history.length >= 60` without proving that the cache reaches the required prior trading session or that recent sessions are continuous. `updateMarketState()` then appends the target scan date after filtering dates < scanDate. A stale cache can therefore create a false contiguous rolling series.

This is shared runtime and can change future Formal eligibility, so it is Class B. No production implementation or promotion is authorized by this proposal.

## Proposed invariant
For a target `marketDate`, a cached history is usable for rolling Formal features only when:
1. Official trading calendar for all required years is loaded.
2. Expected prior trading date = the immediately preceding official trading session before `marketDate`.
3. Latest cached bar date equals expected prior trading date.
4. Recent cached dates required by the rolling feature window are strictly increasing, unique, and match official trading sessions without internal gaps.
5. No cached date is >= `marketDate`.
6. If any check cannot be proven, status is `DATA_INCOMPLETE/UNKNOWN`; never BAD/0 and never silently eligible.
7. Historical recovery evaluates freshness relative to the recovery target market date, not rerun wall-clock date.

## Safe remediation shape
- Add a pure validator such as `validateHistoryFreshness(history, marketDate)`.
- During history-seed queue rebuild, `history.length >= 60` is necessary but no longer sufficient; only validated caches enter `completeCached`.
- Stale/gapped symbols remain in the fetch queue and are refetched through the existing historical-candle path.
- Before Formal feature construction, add a final fail-closed data-integrity guard so stale/gapped histories cannot reach `buildMarketFeatures`.
- Preserve all A/B formulas, ranking, thresholds, pool quotas, capital, entry/add/reduce/sell/stop, monitoring and push semantics.

## Required tests before owner promotion decision
1. 60+ bars ending exactly on prior official session => valid.
2. 60+ bars ending one trading session stale => invalid/refetch.
3. 60+ bars with an internal missing trading session => invalid/refetch.
4. Weekend/holiday gaps that are not trading sessions => valid.
5. Duplicate/out-of-order/future-dated bars => invalid.
6. Historical recovery uses target market date, not current date.
7. Reproduce B-130 stale sequence (cache through 2026-09-11 + append 2026-09-24) => rejected before Formal feature calculation.
8. Fresh complete sequence for the same target date => existing A/B feature formulas unchanged.
9. Regression: Top6/3+3/A-B formulas/capital/signal/push code unchanged.
10. Failure/unknown calendar => DATA_INCOMPLETE, never zero-pick.

## Evidence / falsification
- This proposal does not assume every 2026-09-24 symbol was stale; blast radius remains UNKNOWN without a preserved all-market D1 cache snapshot.
- It does not reinterpret 9/24 as a zero-pick day.
- 2006/4977 are root-cause witnesses only, not recommendations and not sufficient to estimate prevalence.
- A validator that only checks bar count or calendar-day age is insufficient and should be rejected.

## Rollback
Proposal branch only. No runtime deployment. Delete/close branch or PR to roll back the proposal artifact.
