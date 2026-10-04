# D01 DL-030 — D16 Structural-Object Repeated-Exposure Handoff V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## D01 semantic ownership

D01 freezes:
- structural root identity;
- object version identity;
- episode semantics;
- observation-snapshot semantics;
- absence/censoring classes;
- rediscovery/reacquisition classes.

D01 does not select the future estimator.

## Required future D16 counts

Never report only one N.

At minimum report:
1. unique daily decision parents;
2. unique structural roots;
3. unique structural episodes;
4. object versions;
5. observation snapshots;
6. raw detector emissions;
7. repeated-exposure distribution per root/episode;
8. window-censoring / coverage-gap / detector-absence rates.

## Dependence

Daily parents may be valid decision observations while sharing one persistent structural object.

Therefore:
- decision-parent N != structural-object N;
- repeated snapshots are clustered/repeated measures;
- overlapping outcome windows require the existing D16 overlap/purging controls;
- rediscovery does not reset independence.

External finance methodology shows that overlapping observations and overlapping event dates can materially bias naive inference.

## Estimand split

Possible future estimands must remain explicit:

A. DAILY_DECISION_ESTIMAND
What does seeing this object state on a given decision date imply for a decision?

B. OBJECT_EPISODE_ESTIMAND
What happens after a structural object first confirms / changes / invalidates?

C. REDISCOVERY_STABILITY_ESTIMAND
How often does the detector lose/reacquire the same causal object under complete coverage?

Do not mix these Ns.

## Promotion boundary

No object-persistence statistic is a Formal feature by default.

No runtime wiring, selection/ranking change, capital change or Formal optimization is authorized.

Formal Core remains LOCKED.
