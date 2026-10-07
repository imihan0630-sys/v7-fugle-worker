# D16 + D18 Prospective Sequential Inference / Regime Information-Time Checkpoint

Updated: 2026-10-07 Asia/Taipei
Owner room: 11｜統計驗證與策略市場狀態研究室
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED
Formal Core impact: NONE

## Continuation basis
Latest main at branch creation: 52c6ea8a8900869504482fc6133f4bf88a2e19ec.
Canonical tracker: D16=60.0%, D18=52.0%, aggregate=46.7%, 22 domains / 356 modules.
This checkpoint does not promote maturity.

## New research question
Prospective Shadow/OOS evidence can still overstate certainty if analysts repeatedly inspect accumulating outcomes and stop, extend, split, or promote when a favorable regime-specific result appears. Regime occupancy is irregular, so calendar time is not statistical information time.

## Frozen distinction: calendar time vs information time
For every preregistered D16/D18 experiment preserve separately:
- calendar decision date;
- eligible independent decision-date count;
- mature-outcome count;
- regime-eligible independent episode count;
- effective information count after overlap/dependence controls;
- missing / UNKNOWN / blocked opportunity count.

A long calendar run is not automatically a large sample. A frequent regime can accumulate information much faster than a rare transition regime.

## Hypothesis
Support mechanism:
A regime-conditioned strategy may have real incremental value if its frozen policy continues to beat the static baseline after costs across independent dates/episodes and under a valid sequential or fixed-horizon inference contract.

Falsification:
If significance appears only after repeated peeking, after extending the run because early results were weak, after stopping because results became favorable, or only in a rare regime with tiny independent information count, the evidence is not promotion-grade.

Alternative explanations:
- regime prevalence changed the speed of evidence accumulation;
- overlapping D+N outcomes inflated nominal N;
- one long regime episode supplied many correlated dates;
- missingness/support asymmetry removed difficult dates;
- repeated looks / multiple strategies / horizons / regime slices created multiplicity;
- deployment/source generations created technical clusters mistaken for economic replication.

Failure conditions:
The hypothesis remains unconfirmed if independent information is too small, one episode dominates, support is structurally absent, result maturity is incomplete, or inference cannot reconstruct what was known at each allowed look.

## Sequential inference firewall
Before protected outcomes are inspected, each experiment must choose one of two admissible families:

### A. Fixed-horizon family
Freeze:
- primary estimand;
- outcome horizon;
- eligibility/support denominator;
- target independent information count or explicit calendar cutoff;
- one primary outcome look;
- dependence-aware inference;
- multiplicity family;
- cost/slippage assumptions;
- failure/UNKNOWN semantics.

No early stopping for success/futility and no sample extension after seeing protected outcomes.

### B. Sequential family
Only if operationally necessary, preregister:
- allowed look schedule in information time, not ad-hoc calendar peeking;
- alpha-spending / always-valid evidence method or equivalent error-control contract;
- maximum information horizon;
- stopping boundaries for success/futility;
- dependence handling for overlapping outcomes/date clusters/regime episodes;
- simultaneous multiplicity across strategies, horizons, regime slices and repeated looks;
- immutable audit receipt for every look, including non-significant looks.

A conventional fixed-sample p-value reused at every look is inadmissible.

## Regime-specific guard
Do not allow each regime cell to run its own uncoordinated stopping clock. This creates selection pressure because common regimes reach thresholds earlier and rare regimes are repeatedly inspected with unstable estimates.

Primary policy evidence should use one preregistered experiment clock. Regime cells are secondary diagnostics unless a separately preregistered interaction experiment has enough independent episode support and multiplicity control.

## Minimum machine receipt for each permitted look
- experimentId / version
- lookIndex
- decisionCutoff
- outcomeMaturityCutoff
- eligibleOpportunityCount
- includedIndependentDateCount
- effectiveInformationCount
- regimeEpisodeCounts
- maxEpisodeShare
- UNKNOWN / SOURCE_BLOCKED / DATA_BLOCKED counts
- strategyVersion / regimeVersion / source-generation hashes
- primary estimand and frozen cost model
- inference family and multiplicity-family id
- stop / continue decision
- immutable receipt hash

Missing prior looks invalidate any claim that the sequential rule was followed prospectively.

## Relation to D16/D18
D16: strengthens OOS/Prospective Shadow, multiple-testing, independent-date, experiment-registry and maturity-gate semantics.
D18: prevents rare-regime cherry-picking and calendar-time stopping from masquerading as Regime × Strategy interaction evidence.

## Promotion boundary
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
No threshold, regime switch, allocation, weight, entry/exit, or production behavior is changed.

## Exact next continuation point
On next run, reread latest main. Check whether executable Taiwan PIT prediction→calibration→mature-outcome receipts or real prospective Regime × Strategy receipts now exist. If yes, audit their look history and information-time denominator before reading economic conclusions. If absent, continue to the next executable D16/D18 falsification topic; do not fabricate historical Shadow and do not treat UNKNOWN as zero/BAD.
