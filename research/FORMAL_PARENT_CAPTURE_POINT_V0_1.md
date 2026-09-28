# Formal Parent Capture Point / Dual Evaluation Audit V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / CAPTURE_POINT_FROZEN / NO_RUNTIME_CHANGE
Formal Core: LOCKED

## Purpose

Find the exact in-memory capture boundary for immutable decision-state parents without re-running Formal scoring or ranking.

## TI-531 — featureRows are local to the selector

Current Formal featureRows exist inside selectTomorrowCandidates.

After the selector returns, callers receive final candidate plans and diagnostics, not the complete featureRows + per-symbol decision results.

Therefore a promotion-grade parent cannot be built later outside the selector without either:
- expanding the selector's returned research payload; or
- re-running decision logic.

Re-running decision logic is prohibited.

## TI-532 — Market-consensus overlay must be captured after it is applied

Since V7.5.30:
applyMarketConsensus(scoreCandidate(...), consensus)
wraps the qualified score result.

It can alter:
- priorityScore;
- marketConsensusScore;
- marketConsensusSources;
- marketConsensusBonus;
- selectedReason.

Therefore parent ranking provenance must capture the post-consensus result actually used by Formal.

A pre-consensus research reconstruction is not the production decision.

## TI-533 — Thousand-dollar symbols are evaluated twice in the current selector

Current structure:
1. first loop evaluates every featureRow;
2. second loop evaluates thousandFeatureRows again for the dedicated thousand pool.

The same market-consensus wrapper is applied to both Formal evaluations after V7.5.30.

For current pure deterministic logic the results should match.
But future drift can make them diverge.

This duplicated path is a first-class QA concern.

## TI-534 — One symbol must still have one parent

Promotion-grade parent identity is per symbol per Formal generation.

Do not create:
- one "all-universe" parent; and
- one "thousand pool" parent
for the same symbol.

Frozen authority:
- FORMAL_GENERAL symbol => PRIMARY evaluation is authoritative;
- FORMAL_THOUSAND symbol => THOUSAND_DEDICATED evaluation is authoritative.

The PRIMARY thousand result is a duplicate-evaluation QA witness only.

## TI-535 — Dual evaluation equivalence guard

For every FORMAL_THOUSAND symbol:

normalize the two actual Formal results and compare them.

If they differ:
DUAL_EVALUATION_DIVERGENCE
=> generation research publication QA_FAIL.

Do not:
- pick the more favorable result;
- average them;
- silently prefer one and ignore the mismatch.

This catches future path drift before it contaminates parent evidence.

## TI-536 — Parent assembly needs two in-memory phases

Phase 1 — evaluation capture:
- every feature symbol;
- actual post-consensus result;
- exact first-failure/formalOk state;
- evaluation ordinal;
- authoritative evaluation source.

Phase 2 — ranking finalization:
after the actual Formal sort/pool split:
- observed pool rank;
- pre-sort qualified ordinal;
- selected flag;
- cutline relation.

Only after Phase 2 may the immutable parent payload be finalized.

No D1 write is needed inside either scoring loop.

## TI-537 — Research must consume actual Formal ranking order

The capture helper does NOT implement the comparator.

It accepts:
- actual ranked GENERAL symbol list;
- actual ranked THOUSAND symbol list;
- actual selected symbol set.

It validates:
- ranked list contains exactly all qualified names in that pool;
- selected set matches the top quota from those supplied ranked lists.

This preserves ranking truth without creating a second ranking engine.

## TI-538 — Current Formal pool strings differ by semantic layer

Selected-plan strategyPool literals are:
- FORMAL_GENERAL;
- FORMAL_THOUSAND.

Parent-scope measurement may separately report descriptive price pools as:
- GENERAL;
- THOUSAND.

Do not mix these vocabularies.

The capture ledger uses the exact Formal pool literals.

## TI-539 — Hybrid Shadow remains separate

V8.9 introduces a third Hybrid Shadow path for thousand-dollar names.

It uses scoreHybridCandidate, not the Formal A/B scoreCandidate eligibility path.

Technical Indicator promotion-grade Formal parent scope remains the Formal history-admitted feature-row scope.

Hybrid membership/evidence may attach later as an overlay/child where semantically appropriate.

It must not create a second Formal parent for the same symbol.

## TI-540 — Pure prototype

research/formal_parent_capture_ledger_v0_1.mjs:
- zero market calls;
- zero D1 writes;
- zero scoreCandidate calls;
- zero comparator/ranking implementation.

It only consumes actual already-computed Formal outputs.

Falsification tests cover:
- correct general/thousand authority;
- duplicated-thousand divergence;
- ranked keyset mismatch;
- selected-set mismatch;
- missing dedicated-thousand evaluation.

## Current status

FORMAL_PARENT_CAPTURE_POINT = DESIGN_FROZEN_V0_1
DUAL_THOUSAND_EVALUATION_RISK = EXPLICIT_GUARD
NO_RESCORE = ENFORCED_BY_PROTOTYPE
NO_RERANK = ENFORCED_BY_PROTOTYPE
RUNTIME_WIRING = NOT_IMPLEMENTED
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Run pure capture-ledger tests.
2. Reconcile its output fields with immutable_decision_state_parent_v0_1.
3. Measure whether complete parent assembly can be done from already-loaded same-scan objects with zero additional market calls.
4. Keep all implementation research-only.
5. No Worker/D1 wiring without Class-B owner approval.
