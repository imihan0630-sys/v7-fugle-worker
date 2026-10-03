# D01 -> D16 Handoff — First-Event Clock / Right-Censoring Semantics V0.1

Updated: 2026-10-03 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_CLOSED

D01 freezes the semantic distinction:

1. Decision-time predictor:
   only event history observed/available by the parent cutoff.
2. Not-yet-occurred event:
   right-censored through asOf, not age=0 and not UNKNOWN.
3. Future first event:
   outcome-side time-to-event information, never a predictor for the earlier parent.
4. UNKNOWN:
   provenance/path incompleteness, distinct from genuine not-yet-occurred.

Potential future analyses:
- T1 continuous observed-event ages vs T0 aggregate path/geometry;
- time-to-first-reentry/failure/reclaim as censored outcomes;
- lifecycle C3 vs flexible T1/T2 clocks.

D16/statistical validation owns:
- survival / hazard / landmark estimator choice;
- censoring assumptions;
- calibration/loss;
- cluster/dependence handling;
- small-sample inference.

D01 does not select an estimator or create duration buckets.

No outcome is opened by this handoff.
