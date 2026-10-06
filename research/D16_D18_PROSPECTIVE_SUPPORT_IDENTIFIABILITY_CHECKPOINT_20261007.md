# D16 + D18 Prospective Evidence Support / Missingness Identifiability Checkpoint

Updated: 2026-10-07 Asia/Taipei
Owner: 11｜統計驗證與策略市場狀態研究室
Scope: D16 + D18
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED / OUTCOMES_CLOSED
Formal Core impact: NONE

## Continuation basis
Latest main at round start: cabf4d7c830155378b314a2523524d9cf9304791.
Prior dependent-missingness research was not durable on main, so this file persists that completed research without redoing it.

## Hypothesis
Prospective evidence availability can itself depend on regime. If volatile, illiquid, transition, or weak regimes are more likely to have missing parent populations, policy fingerprints, cost fields, source receipts, or immature outcomes, complete-case Regime x Strategy estimates can be selected even when no future return was inspected.

## Support mechanism
Before any economic outcome linkage, preserve by decision date, strategy, regime, independent event, and source/version generation:
- evidence opportunities;
- legally eligible receipts;
- mature outcomes;
- complete cost receipts;
- complete policy fingerprints;
- UNKNOWN / SOURCE_BLOCKED / DATA_BLOCKED / INELIGIBLE_PARENT_MISSING / OUTCOME_NOT_MATURE counts;
- independent regime-event count and maximum single-event share.

## Falsification
The missingness-selection concern weakens if support/receipt rates are stable across PIT-safe regimes after controlling for source/version generation, universe generation, liquidity/activity, and other pre-outcome observables, and no single event dominates.

## Alternative explanations
Apparent regime-dependent missingness may be caused by deployment/version changes, upstream universe-generation failures, market holidays/session gaps, source outages, or changing eligibility rules rather than economic regime.

## Failure conditions
- Structural zero support => NOT_IDENTIFIABLE, not BAD.
- UNKNOWN and blocked states must not become zero return, zero selection, or strategy failure.
- No inverse-probability weighting or imputation may create support where none exists.
- Any missingness model used for confirmatory inference must be preregistered before protected outcomes, PIT-safe, overlap-supported, and weight-stability audited.
- Stock rows are not independent evidence; decision-date, overlapping horizon, repeated symbol, sector, source/version generation, and independent regime event dependence remain relevant.
- Recorder restarts or version boundaries do not automatically create independent economic regime replications.

## D18 implication
A strong complete-case Regime x Strategy cell remains descriptive when support differs materially by regime, positivity fails, or one economic event/source generation dominates. It cannot justify activation, deactivation, weighting, or capital allocation.

## Optimization boundary
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
No threshold, regime switch, strategy weight, rank, capital, execution, monitoring, or Formal Core rule is changed.

## Exact next continuation point
1. Re-read latest main, tracker, Shared Master Map, Router, and D16/D18 checkpoint.
2. Check whether a real Taiwan PIT prediction -> calibration -> mature-outcome receipt exists for D16-19/D16-25.
3. If present, validate clock, denominator, version lineage, outcome maturity, regime support, independent-event occupancy, and missingness states before inspecting economic results.
4. If absent, record the real blocker and move to the next executable D16/D18 falsification module; do not fabricate historical Shadow.
5. If prospective SDA-022 evidence starts, persist outcome-blind Strategy x Regime x Event x SourceGeneration x InclusionStatus support receipts before protected economic outcome analysis.
