# D01 -> D16 Handoff — Repeated-Cycle Event Dependence V0.1

Updated: 2026-10-03 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_CLOSED

D01 freezes recurrent Pattern-event semantics only.

## Dependence unit

Repeated returns/reclaims under one relationEpisodeKey are correlated within one structural episode.

Do not treat each cycle as an independent stock-event sample.

Later inference must retain:
- relationEpisodeKey dependence;
- symbol dependence;
- scanDate/common-shock dependence where parent-level outcomes are studied.

## Exposure

Raw recurrence counts are exposure-dependent.

At minimum carry:
- repeatRiskStartAt;
- observableEligibleSessionsAtRisk;
- constrainedEligibleSessionsAtRisk;
- exact session/continuity provenance.

## Censoring

An open repeated return at asOf is not a completed cycle.
Episodes may be right-censored.

UNKNOWN path completeness is distinct from no recurrence.

## Future method choice

Potential future outcome formulations:
- recurrent event counting process;
- gap-time model;
- multi-state recurrent transition model;
- parent-level summary predictor analysis.

D01 does not choose among them.

D16 must preregister the scientific estimand and dependence assumptions before outcomes.

## Predictor-side hierarchy

R0 first-event bundle.
R1 counts + exposure.
R2 gap time / last-event age.
R3 full repeated sequence.
R4 derived churn categories.

No threshold/search family is authorized.

No outcome join by this handoff.
