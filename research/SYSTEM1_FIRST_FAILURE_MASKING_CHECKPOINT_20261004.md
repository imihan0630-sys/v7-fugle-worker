# System 1 first-failure masking audit V0.1

Date: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY_IMPLEMENTED / DAILY_COLLECTOR_WIRED / CI_GREEN_MERGED / FORMAL_CORE_LOCKED

## Purpose

Quantify how much System 1's fail-fast production order hides simultaneous observed gate failures.

Production firstFailure is useful for exact execution-path attribution, but it is order-dependent. It must not be treated as:
- gate importance;
- unique exclusion count;
- marginal causal contribution;
- recovered-candidate count.

This audit compares the exact production firstFailure reason with the same-session full gate-overlap observer.

## Frozen reason mapping

Exact-match only.

`research/system1_first_failure_masking_audit_v0_1.mjs`
contains a versioned mapping from the current `scoreCandidate()` rejection strings to Formal gate IDs.

No fuzzy matching, substring guessing or later reinterpretation is allowed.

Known C1 fallback:
`HISTORY_OR_FEATURE_ADMISSION_BLOCKED`

is explicitly classified:
`OUTSIDE_SCORECANDIDATE_REASON_SCOPE`

and excluded from scoreCandidate firstFailure mapping coverage.

Any new/unrecognized production reason becomes:
`UNMAPPED`

and forces:
`MAPPING_REVIEW_REQUIRED`.

## Outputs

Per genuine C1 decision date:

- formalRejectedN;
- scoreCandidateReasonScopeN;
- outsideScoreCandidateReasonScopeN;
- mappedFirstFailureN;
- unmappedFirstFailureN;
- mappingCoverageRate;
- multiFailRejectedN;
- singleFailRejectedN;
- zeroObservedFailRejectedN;
- multiFailRateAmongRejected;
- mappedGateMismatchN;
- totalHiddenObservedFails.

For every Formal gate:
- firstFailureN;
- observedFailN;
- hiddenBehindOtherFirstFailureN;
- uniqueObservedFailN;
- coFailObservedN;
- firstFailureCaptureRateAmongObservedFails;
- hiddenRateAmongObservedFails.

## Row-level semantics

Every in-scope rejected row preserves:
- symbol;
- pool;
- exact firstFailureReason;
- mapped firstFailureGate;
- full observed fail set;
- hidden observed fail set;
- whether mapped firstFailure is itself observed FAIL.

No outcome or counterfactual selection is computed.

## Trust states

`MAPPING_COMPLETE`
requires:
- no unmapped in-scope production reason;
- no mapped firstFailure gate / observer FAIL mismatch.

Otherwise:
`MAPPING_REVIEW_REQUIRED`.

A mapping mismatch is a data/semantic QA issue, not evidence that the Formal gate is wrong.

## Daily collection

The existing verified C1 evidence path now appends:
`firstFailureMasking`.

No new:
- endpoint;
- HTTP/provider call;
- scheduler;
- D1 schema;
- Worker hook;
- Production deployment

is introduced.

## Interpretation guardrails

This audit does not prove:
- a hidden gate is more important;
- an early firstFailure gate should be removed;
- a multi-fail row would qualify if one gate were removed;
- firstFailure should stop being persisted;
- observed fail counts are causal effects.

Permitted use:
- prevent firstFailure-count misuse;
- show which gates are systematically hidden behind earlier fail-fast branches;
- identify dates where simple reason-prevalence dashboards are materially incomplete;
- route future matched single-gate and outcome studies to the correct denominator.

## Existing parents

- `research/first_failure_attribution_falsification_v0_1.json`
- `research/scarcity_gate_denominator_matrix_v0_1.json`
- `research/formal_gate_overlap_observer_v0_1.mjs`
- `research/formal_gate_replay_v0_1.mjs`
- `research/SYSTEM1_SHADOW_COHORT_MEMBERSHIP_IMPLEMENTATION_20261004.md`

## Formal boundary

No Formal gate order, threshold, A/B, RR, grade, score, ranking, quota, capital, BUY/ADD/REDUCE/SELL/STOP, 15m, push, order, Worker, D1, Production or System2 behavior changes.

`economicSuperiority=UNKNOWN`
`formalOptimizationCandidate=NONE`
Formal Core: LOCKED

## Exact next continuation

1. Merge only after exact-head Regression, Repair CI and isolated review are green.
2. Let the existing C1 evidence workflow emit the first genuine masking audit.
3. Require mapping completeness before using firstFailure-vs-overlap comparisons in gate-priority discussions.
4. Accumulate independent dates before claiming practical masking materiality.
5. Gate reformulation remains Class-C and requires explicit owner approval plus mature prospective/OOS outcome evidence.

## Merge acceptance

- PR #496 merged at `f4099f904b0e050e9de5c9784ee12606c64b4229`.
- Exact head `aff8d0cdc686bf999f04df6c3a3c3acc75929fd3`:
  - V8 Regression Tests run `37181599119` PASS;
  - V8 Repair CI run `37181599113` PASS;
  - System1 C1 C2 isolated offline repair review run `37181599118` PASS.
- No Worker/runtime/D1/Production/Formal/System2 behavior change or Cloudflare deployment was introduced.
- The next required evidence is prospective and will be emitted by the existing daily C1 evidence workflow on genuine trading sessions.
