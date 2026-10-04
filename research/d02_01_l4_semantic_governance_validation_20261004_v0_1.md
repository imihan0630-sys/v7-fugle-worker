# D02-01 L4 Semantic-Governance Admission Validation V0.1

Updated: 2026-10-04 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / EXECUTABLE_SEMANTIC_ADMISSION_PASS
Evidence cursor: PVE-239
Formal Core: LOCKED
D02 maturity impact: NONE

## Purpose

D02-01 is a data-semantic governance module, not an alpha factor.

Its L4 question is:
does frozen unit/session/corporate-action continuity governance materially prevent false classification in genuine prospective/OOS observations?

The executable layer therefore measures prospective provenance and counterfactual classification delta.
It does not inspect returns.

## Artifacts

- research/d02_01_l4_semantic_governance_admission_v0_1.mjs
- tests/test_d02_01_l4_semantic_governance_admission_v0_1.mjs

Independent local runtime:
- Node.js v22.16.0
- 18/18 tests PASS

## Frozen semantic boundaries

Daily lane:
- volumeUnit must be SHARES.

Regular-lot intraday lane:
- volumeUnit must be LOTS.

Session semantics:
- factual zero-volume eligible session is valid zero, not missing;
- zero-volume session cannot be replaced by an older row;
- expected missing source session cannot be backfilled by an older row;
- verified suspension/non-symbol session cannot be classified as an eligible volume session;
- UNKNOWN source semantics cannot become ELIGIBLE.

Corporate actions:
- UNIT_SCALE requires a verified bridge or a reset-clean >=20-session baseline;
- SUPPLY_CHANGE may remain RAW_ACTIVITY;
- COMPARABLE_PARTICIPATION after SUPPLY_CHANGE requires denominator normalization or a fully post-break >=20-session baseline;
- corporate-action information known after feature time cannot rewrite the earlier feature state.

Counterfactual:
- governed classification and ungoverned counterfactual classification must both come from a frozen adapter;
- classificationDelta is descriptive governance evidence;
- materialPreventionCandidate means governance blocked/unknown a row that the ungoverned path would have admitted.

## Test coverage

18/18 PASS includes:
- valid daily SHARES;
- daily LOTS unit mismatch;
- valid intraday LOTS;
- factual zero-volume preservation;
- zero-volume older-row substitution block;
- missing-session older-row substitution block;
- suspension eligibility block;
- UNIT_SCALE without bridge/reset block;
- UNIT_SCALE verified bridge pass;
- SUPPLY_CHANGE RAW_ACTIVITY pass;
- SUPPLY_CHANGE comparable-participation without denominator/reset block;
- normalized SUPPLY_CHANGE pass;
- late-known corporate-action block;
- material classification-delta recognition;
- no-delta recognition;
- retrospective-capture block;
- duplicate-event fatal integrity;
- permanent no-alpha/no-economic-outcome/no-Formal authorization.

## Current consequence

All 12 D02 modules now have an executable next-level evidence-admission firewall.

This is not L4 evidence itself.
No maturity promotion occurs.

D02 remains 60.0%.
Clean prospective date count remains 0.
PVE-240 remains next.
Gate 7 remains CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
