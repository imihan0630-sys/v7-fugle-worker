# D03 -> D16 Interaction Falsification Handoff Addendum V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: D03
Target method owner: D16 / Room11
Parent D03 handoff: D03_PRIMARY_QUEUE_D16_METHOD_HANDOFF_V0_1
Parent rules: TI-749~940
Status: RESEARCH_ONLY / METHOD_HANDOFF_FROZEN / OUTCOMES_CLOSED
Formal Core: LOCKED

## Purpose

Extend the existing D03->D16 handoff with interaction-falsification requirements without dictating one universal statistical method.

## TI-941 — method ownership stays with D16

D03 freezes:
- the scientific null;
- lineage constraints;
- preserved/broken structures;
- consumer/clock/support semantics;
- anti-search requirements.

D16 owns:
- exact test statistic;
- studentization;
- resampling/permutation family;
- block length;
- conditional model;
- selective/max-statistic method;
- finite-sample/asymptotic justification.

No D03 artifact may claim a method is valid merely because it is named.

## TI-942 — falsification method receipt identity

Future D16 receipt must bind:
- falsificationMethodReceiptVersion;
- D03 interaction family/version;
- variant/search family/version;
- component-pair/root identity;
- primary null claim;
- primary falsifier family/version;
- null-generator version;
- target population/support/consumer;
- decision clock;
- outcome horizon;
- D16 method version;
- local multiplicity family;
- outer research stream;
- SDA-016 consumption lineage.

## TI-943 — null-generator validation is a prerequisite, not a result

Before target economic inference, the D16 method receipt states whether the proposed null generator has:
- target-break validation;
- nuisance-preservation validation;
- lineage/mechanical validity;
- support/admission symmetry;
- misspecification sensitivity where conditional;
- power/sensitivity calibration where applicable.

`NULL_GENERATOR_READY` is a method-readiness state, not interaction evidence.

## TI-944 — same-root interactions may legitimately return no valid componentwise null

For Bollinger/ADX/oscillator-trend/divergence:
D16 may return
`NO_VALID_COMPONENTWISE_PERMUTATION`
or
`NULL_NOT_IDENTIFIABLE_BY_SURROGATE_FAMILY`.

This is not a failed implementation that D03 should "fix" by changing the indicator.

D16 may propose another preregistered dependence-aware interaction test, which then receives a new method version and validation.

## TI-945 — mixed-root conditional null may legitimately be blocked

For price×volume:
D16 may return:
- CONDITIONAL_NULL_MODEL_UNRELIABLE;
- SUPPORT_INSUFFICIENT;
- POSITIVITY_BLOCKED;
- DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE.

These terminal states block third-unit evidence and do not authorize simpler global volume shuffling.

## TI-946 — pipeline search adjustment is part of the method receipt

If the target interaction was selected from multiple variants, D16 method readiness must state how selection is handled:
- full pipeline max/selected-statistic replay; or
- another valid multiplicity/selective-inference method frozen before outcome access.

A fixed-winner permutation is not accepted after outcome-based search.

## TI-947 — Monte Carlo design is frozen before target inference

If resampling is used, receipt binds:
- replication rule;
- seed/RNG ledger semantics;
- p-value convention;
- precision/resolution rule;
- adaptive stopping rule if any;
- failure/retry handling.

No zero p-values.
No "run more until significant" behavior.

## TI-948 — falsifier disagreement policy is method-visible

Receipt states:
- primary falsifier;
- secondary sensitivity falsifiers;
- null claim for each;
- same-null contradiction rule;
- different-null interpretation.

Unresolved same-null contradiction blocks the interaction.

## TI-949 — allowed method terminal states

Allowed:
- FALSIFICATION_METHOD_READY;
- NULL_GENERATOR_NOT_READY;
- NO_VALID_COMPONENTWISE_PERMUTATION;
- NULL_NOT_IDENTIFIABLE_BY_SURROGATE_FAMILY;
- CONDITIONAL_NULL_MODEL_UNRELIABLE;
- POWER_INSUFFICIENT;
- JOINT_SUPPORT_INSUFFICIENT;
- DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE;
- FALSIFIER_DISAGREEMENT_UNRESOLVED;
- VERSION_INCOMPATIBLE;
- SELECTION_IDENTIFICATION_BLOCKED.

A structurally valid blocking state is an accepted scientific result.

## TI-950 — METHOD_READY still does not open or pass outcomes

`FALSIFICATION_METHOD_READY` means:
- the method/null contract is admissible;
- the physical/data gates may proceed when allowed.

It does NOT mean:
- interaction incrementality proven;
- third unit granted;
- predictive alpha proven;
- Bollinger/ADX promoted;
- Formal Core changed.

Outcome access remains governed by the existing D03/D16 readiness and SDA-016 controls.

Current:
- D03 outcomes CLOSED;
- raw gate 2/3;
- D03 56.7%;
- Formal Core LOCKED.

## Exact next continuation point

1. Machine-freeze the D16 falsification-method receipt schema.
2. Do not require a favorable terminal state; accept legitimate blocking states without redesign.
3. Re-read external System1/System2/D16 lanes after writeback.
4. If still no engineering delta, the next independent D03 path is "null-of-null" calibration: test whether the falsification pipeline itself produces nominal false positives on known synthetic no-interaction worlds and retains sensitivity on injected-interaction worlds, without converting synthetic success into market evidence.
