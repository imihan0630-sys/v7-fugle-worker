# D02 PVE-249 — Green Class-B candidate and owner gate

Updated: 2026-10-06 Asia/Taipei
Status: BASE_CI_REPAIRED / CANDIDATE_RESEQUENCED_V8_19_1 / ALL_APPLICABLE_CHECKS_PASS / DRAFT_PR_651_CLEAN / OWNER_APPROVAL_REQUIRED / UNMERGED / NOT_DEPLOYED

## Purpose

Close the technical preparation stage before any Class-B Production action.

PVE-249 resolves the repository-wide CI blocker, corrects the candidate's version-chain placement, reruns the applicable checks, and proves PR #651 is technically clean.

It does not merge or deploy.

## Base CI blocker resolution

The existing zero-pick collector test failure was caused by test-fixture drift.

Runtime/collector behavior had advanced to V8.19 and now performs a read-only C1 generation-inventory request.

The legacy test fixture:
- defaulted its modern runtime to V8.16;
- did not mock `/api/research/c1-generation-inventory`.

The collector therefore correctly reached the new inventory call, while the stale fixture threw an unexpected-endpoint failure and surfaced `collector CLI failed`.

Class-A fixture repair:
- main commit `c3bf53e0fe195647ecd77c87e6ce77e7ee744635`;
- modern fixture aligned to `8.19.0-c1-scan-origin-generation-inventory`;
- inventory GET mock binds the same generation/date/content/universe lineage and explicit scan origin;
- expected CLI GET sequence includes inventory;
- no verifier gate is weakened;
- no Worker runtime is changed.

Main Regression:
`37387343385 = SUCCESS`.

## Candidate version-chain correction

An intermediate PVE-248 candidate was initially applied between V8.18 and V8.19.

The V8.18 valuation source-vintage test correctly rejected that placement because its historical invariant verifies that all non-V8.18 runtime behavior remains byte-identical before V8.19.

PVE-249 did not weaken that invariant.

Instead the candidate was moved to:
`scripts/apply_v8_19_1_pve248_candidate.py`

and its guard to:
`tests/test_v8_19_1_pve248_runtime_candidate.mjs`.

Both Regression and Repair CI apply the PVE-248 candidate after `apply_v8_19_0.py`.

This preserves replayable V8.18 and V8.19 boundaries.

## Final candidate

Branch:
`research/d02-pve248-class-b-candidate-20261006`

Head:
`e26e0e8e7786e25505714942e82a64e4cb8cec09`

Draft PR:
`#651`

GitHub state at final readback:
- open;
- draft;
- mergeable=true;
- mergeable_state=clean;
- merged=false.

Production deploy workflow still does NOT apply the candidate.

## Final applicable checks

All authoritative checks on the final candidate head are green:

- D02 PVE-248 Candidate CI `37387779756` — SUCCESS;
- System1 C1 C2 isolated offline repair review `37387779711` — SUCCESS;
- V8 Repair CI `37387779433` — SUCCESS;
- V8 Regression Tests `37387779413` — SUCCESS;
- isolated branch Candidate CI `37387775656` — SUCCESS.

The Repair CI is now genuinely candidate-aware; it applies the V8.19.1 candidate rather than testing only the base.

## Candidate semantics

The technically green candidate remains bounded to:
1. combined 23:35/23:55 after-market recognition with existing only-if-missing/D1 lease recovery protection;
2. fail-open research PV baseline warmup and explicit bootstrap receipt;
3. exact-response 15m raw provenance capture before JSON normalization;
4. observability of recovery skip/idempotence reason.

No intended changes:
- Formal A/B;
- ranking;
- Top6 / 3+3;
- thresholds;
- capital;
- BUY / ADD / REDUCE / SELL / STOP;
- Formal 15m semantics;
- monitoring eligibility;
- push semantics.

## Owner gate

Technical preparation is complete.

However engineering governance still prohibits:
- merge;
- Production deploy;
- Production build-chain wiring of the candidate;

without explicit owner approval for the Class-B production change.

Therefore:
`technicalCandidateReviewEligible=true`
but:
`productionIntegrationAuthorized=false`.

## Research consequence

A green candidate is not a repaired Production system.

Still:
- remediationReady=false until approved Production integration + physical readback;
- h001ReceiptEligible=false;
- clean prospective dates=0;
- no outcome access;
- no numerical target;
- no D16 method selection;
- D02 maturity remains 60.0%;
- Gate 7 CLOSED;
- FORMAL_OPTIMIZATION_CANDIDATE=NONE;
- Formal Core LOCKED.

2026-10-05 remains permanently non-retroactive.

## Exact next continuation point

PVE-250 — owner decision on Class-B Production integration of the technically green PR #651 candidate.

If explicitly approved:
1. wire the V8.19.1 candidate into the Production build/deploy chain with an explicit runtime version/readback;
2. rerun all applicable checks on the production-ready diff;
3. merge/deploy only under that approval;
4. perform physical Production readback for schedule identity, recovery idempotence, bootstrap receipt/readiness and provider/endpoint/rawPayloadHash;
5. rerun the PVE-247 oracle;
6. only a future decision-time-valid H001 receipt may begin clean-date counting.

If not approved, remain draft/unmerged/un-deployed and fail closed.
