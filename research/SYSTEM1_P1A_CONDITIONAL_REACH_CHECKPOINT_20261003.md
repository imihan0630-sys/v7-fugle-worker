# System 1 P1-A conditional reach upper-bound checkpoint — 2026-10-03

Status: CLASS-A RESEARCH / FORMAL CORE LOCKED / NO PRODUCTION DEPLOY REQUIRED

Authority:
- shared-knowledge/SYSTEM1_P1A_CONDITIONAL_REACH_UPPER_BOUND_CONTRACT_20261003_V0_1.md
- shared-knowledge/SYSTEM1_S1_S2_PROSPECTIVE_CAPTURE_READINESS_AUDIT_20261003_V0_1.md
- research/system1_c5_semantic_repair_v0_2.mjs

## Purpose

Implement the missing Class-A conditional reach diagnostic before requesting any
Class-B safety receipt capture.

Question answered:
conditional on unresolved canonical safety UNKNOWN states later proving PASS,
how far could a P1-A-blocked row progress through the already-observed
non-safety states?

This is an upper bound only.

## Implementation

New module:
research/system1_p1a_conditional_reach_v0_1.mjs

Schema:
SYSTEM1_P1A_CONDITIONAL_REACH_UPPER_BOUND_V0_1

Per-row outputs:
- strictReachStage
- conditionalReachStage
- conditionalOnSafetyUnknown
- conditionalSafetyUnknownSet
- verifiedSafetyFailSet
- conditionalReachBlockedBy
- conditionalP1aRankable
- p1aBlockSet
- researchUpperBoundOnly

Aggregate outputs:
- p1aStrictRankableN
- p1aConditionalSafetyUnknownN
- p1aConditionalReachABN
- p1aConditionalABPassN
- p1aConditionalReachRRN
- p1aConditionalRRPassN
- p1aConditionalGradePassN
- p1aConditionalRankableN
- verifiedSafetyFailN
- nonSafetyUnknownBlockedN
- stageCounts

## Safety semantics

Only unresolved canonical safety UNKNOWN may be conditionalized in the
counterfactual calculation.

Canonical safety family:
- SOURCE_AUTHENTICITY
- SESSION_CONTINUITY
- CORPORATE_ACTION_CONTINUITY
- EXECUTION_FEASIBILITY
- ACCOUNT_RISK

Rules:
- verified safety FAIL is never bypassed;
- safety NOT_EVALUABLE is not treated as conditional PASS;
- non-safety UNKNOWN / NOT_EVALUABLE is preserved and blocks reach;
- P1-A semantic blockers may be bypassed only for the research upper-bound;
- no C1/C5 input is mutated;
- no UNKNOWN is written back as PASS.

## Materiality boundary

The frozen contract does not define a numeric materiality threshold.

Therefore:
- zero conditional F9 may be classified as immaterial for the safety-capture question;
- non-safety UNKNOWN blocking is reported separately;
- positive conditional F9 count returns MATERIALITY_THRESHOLD_NOT_FROZEN;
- no 5%, 10%, N-stock or other threshold is invented.

No Class-B safety capture is authorized by a positive upper-bound count alone.

## Daily/post-session integration

buildC5DailyReport is versioned to:
SYSTEM1_C5_DAILY_REPORT_V0_3

It now reports strict SHORT/SWING and conditional SHORT/SWING summaries side by
side.

Future post-session packets therefore expose:
- strict P1-A reach;
- conditional-on-safety upper-bound reach;
- explicit materiality-threshold status.

## Non-authorizations

- conditional F9 is not a candidate count;
- not WATCH;
- not BUY;
- not admission authority;
- not economic evidence;
- not a Formal optimization candidate.

Economic superiority remains UNKNOWN.
FORMAL_OPTIMIZATION_CANDIDATE remains NONE.
Formal Core remains locked.
