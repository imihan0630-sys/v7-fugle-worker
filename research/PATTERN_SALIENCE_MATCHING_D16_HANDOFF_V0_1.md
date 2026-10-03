# D01 -> D16 Handoff — Salience Matching / Common Support V0.1

Updated: 2026-10-03 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_CLOSED

D01 freezes:
- O/M/S covariate ownership/semantics;
- E0/E1/E2/E3 estimand ladder;
- frozen parent-specific control manifest;
- no-forced-match / common-support requirement;
- coverage-loss reporting.

D16 owns, before outcome opening:
- exact matching/weighting estimator;
- distance/propensity model if used;
- caliper if any;
- balance diagnostics;
- common-support algorithm;
- uncertainty / finite-sample method.

Required reporting:
- total true parent count;
- non-empty pseudo-pool count;
- E1/E2/E3 matchable parent counts;
- outside-support count;
- missing-provenance count;
- covariate balance by O/M/S layer.

Interpret E2 and E3 separately because S-layer controls may be behavioral mediators.

No outcome join is authorized by this handoff.
