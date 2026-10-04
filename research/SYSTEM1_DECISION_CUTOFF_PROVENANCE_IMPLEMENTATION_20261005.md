# System 1 V8.18.0 Decision-Cutoff Provenance Implementation Checkpoint

Date: 2026-10-05 Asia/Taipei
Status: BRANCH_IMPLEMENTED / CI_PENDING / PRODUCTION_NOT_AUTHORIZED
Branch: `feature/d03-decision-cutoff-v8-18-0-20261005`
Base main at branch creation: `eca5d034b6c9437cad7fcf7ce6952c01ea95fd3c`
Formal Core: LOCKED

## Objective

Implement the D03-audited additive `decisionCutoffAt` provenance on the shared immutable C1 parent without changing Formal selection behavior.

## Frozen source boundary

Effective-build audit `37196768178` established the current boundary:

`V7_MARKET_CONSENSUS read completes -> decisionCutoffAt stamp -> selectTomorrowCandidates(...)`

There are zero audited async/external Formal-affecting reads between that final input and the synchronous selector.

## Branch implementation

Added:
- `scripts/apply_v8_18_0.py`
- `tests/test_system1_decision_cutoff_v8_18_0.mjs`

Updated:
- V8.17 cohort test to pin its own pre-V8.18 artifact;
- V8 Regression build/test chain;
- V8 Repair build/test chain;
- V8 Cloudflare build/test chain;
- System1 C1/C2 isolated review path;
- isolated review script to separately audit V8.16 -> V8.17 and V8.17 -> V8.18 diffs;
- `VERSIONING.md`.

## Intended runtime delta

Only:
1. `runAfterMarketScanCore` — stamp one `decisionCutoffAt` after the final market-consensus KV read and pass it to the selector;
2. `selectTomorrowCandidates` — accept/pass the exact timestamp to C1 research capture;
3. `buildC1PopulationReceipt` — validate/persist additive cutoff provenance in the immutable header.

No provider call, D1 schema column, membership duplication, Formal score/rank/quota/capital/signal/push/order change.

## Frozen validation requirements

- effective version = `8.18.0-decision-cutoff-provenance`;
- cutoff stamp after final `V7_MARKET_CONSENSUS` read and before selector;
- no async/external read after cutoff before selector;
- selector remains synchronous/external-read-free;
- cutoff <= decisionAt;
- invalid or session-mismatched cutoff blocks promotion-grade C1 capture;
- C1 header exact readback;
- same generation + changed cutoff => `C1_IMMUTABLE_GENERATION_CONFLICT`;
- legacy/fixture null cutoff remains explicit and ineligible for D03 promotion;
- V8.17 cohort semantics remain compatible;
- Formal parity and protected-function review PASS.

## Current authority boundary

No merge.
No Production deployment.
No synthetic business scan.
No historical backfill.
No D03 maturity promotion.

A concrete PR may be created for CI/review. Merge/deployment requires the existing explicit Production approval gate.

## Exact next action

1. Open draft PR to latest `main`.
2. Run V8 Regression, V8 Repair and System1 isolated C1/C2 review.
3. Fix any failures without broadening runtime scope.
4. Rebase/sync latest main if necessary.
5. Produce exact PR/head/CI/protected-function approval packet.
6. Stop before merge/deploy for owner Production approval.
7. Only after approved deploy and a genuine Taiwan trading session may D03 consume a physical cutoff-bearing C1 generation.
