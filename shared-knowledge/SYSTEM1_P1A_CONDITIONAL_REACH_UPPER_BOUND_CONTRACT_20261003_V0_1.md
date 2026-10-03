# System1 P1-A Conditional Reach Upper-Bound Contract 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_CONTRACT_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Measure whether P1-A overfiltering could be materially important **before** requesting Class-B safety-receipt capture.

This contract does not treat safety UNKNOWN as PASS.

It asks a narrower counterfactual:

> Conditional on every currently unresolved safety state later proving PASS, how far could a P1-A-blocked row progress through the already-observed non-safety gate states?

The result is an **upper bound**, never an admissible candidate count.

## Eligibility

A row may enter conditional reach only when:

1. at least one P1-A blocker exists;
2. there is **no verified HARD FAIL**;
3. one or more HARD safety states may be UNKNOWN;
4. all non-safety states remain exactly as observed;
5. no missing non-safety dependency is imputed.

Verified HARD FAIL always stops both strict and conditional reach.

## Safety states allowed to remain conditional

Only unresolved states from the canonical safety family:
- SOURCE_AUTHENTICITY;
- SESSION_CONTINUITY;
- CORPORATE_ACTION_CONTINUITY;
- EXECUTION_FEASIBILITY;
- ACCOUNT_RISK.

However:
- any safety FAIL = hard stop;
- SOURCE_AUTHENTICITY or SESSION_CONTINUITY UNKNOWN must remain explicitly visible;
- the conditional funnel never writes PASS back into C1/C2.

## Conditional funnel

Use the same F0-F9 stages as strict P1-A reach:

- F0_FORMAL_PARENT
- F1_SAFETY_EVALUABLE
- F2_OWNER_UNIVERSE
- F3_P1A_SEMANTIC_BYPASS
- F4_AB_EVALUABLE
- F5_AB_PASS
- F6_TARGET_RR_EVALUABLE
- F7_RR_PASS
- F8_GRADE_PASS
- F9_RANKABLE

For conditional reach:
- F1 means "no verified safety FAIL; unresolved safety is explicitly conditional";
- F9 means "rankable under all currently observed non-safety evidence, **conditional on unresolved safety later proving PASS**."

It does not mean deployable.

## Required outputs

Per row:
- `conditionalReachStage`
- `conditionalOnSafetyUnknown`
- `conditionalSafetyUnknownSet[]`
- `conditionalReachBlockedBy[]`
- `conditionalP1aRankable:boolean`
- `researchUpperBoundOnly:true`

Aggregates:
- `p1aConditionalSafetyUnknownN`
- `p1aConditionalReachABN`
- `p1aConditionalABPassN`
- `p1aConditionalReachRRN`
- `p1aConditionalRRPassN`
- `p1aConditionalGradePassN`
- `p1aConditionalRankableN`

Strict `p1aRankableN` remains unchanged and must be reported beside the conditional upper bound.

## Interpretation

### CONDITIONAL_P1A_IMMATERIAL
Conditional F9 is negligible. Do not request Class-B safety capture solely for P1-A.

### CONDITIONAL_P1A_MATERIAL_SAFETY_CAPTURE_NEEDED
Conditional F9 is material. Identify which safety families are actually unresolved before proposing the smallest Class-B capture.

### CONDITIONAL_P1A_BLOCKED_BY_NONSAFETY_UNKNOWN
Even after conditionalizing safety, non-safety UNKNOWN / NOT_EVALUABLE prevents F9. Fix those evidence gaps first.

### DATA_INSUFFICIENT
Matched C1/C2 denominator is incomplete or unverifiable.

## Prohibitions

- no UNKNOWN -> PASS mutation;
- no Formal candidate creation;
- no WATCH/BUY count;
- no outcome claim from funnel count;
- no safety FAIL bypass;
- no Class-B implementation from materiality alone;
- no P1-B activation from conditional count alone.

## Promotion rule

Conditional materiality only answers:
"Is obtaining better safety evidence potentially worth the engineering cost?"

It does **not** answer:
"Should the P1-A gate be relaxed?"

Formal Core impact: NONE.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
