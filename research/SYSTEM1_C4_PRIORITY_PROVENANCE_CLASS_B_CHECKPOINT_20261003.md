# System 1 C4 priority-score provenance Class-B checkpoint — 2026-10-03

Status: CLASS-B DEPLOYED / PRODUCTION READBACK VERIFIED / FORMAL CORE LOCKED
Parent research: PR #344 post-session C3/C4/C5 evidence pipeline.

## Purpose

C4 allocation comparison requires the exact Formal priorityScore used at the
selection decision timestamp. Current C1/C2 receipts preserve geometry and
selection context but not that score, so C4 correctly remains INPUT_BLOCKED.

Repository audit confirms priorityScore already exists in the Formal runtime
result produced by:

applyMarketConsensus(scoreCandidate(feature, sector), consensus)

before C1 receipt construction. Therefore no score reconstruction is needed.

## V8.15.4 candidate

Patch: scripts/apply_v8_15_4.py
Candidate version: 8.15.4-c4-priority-provenance

The patch only extends each C1 formalResult receipt with:
- priorityScore: c1Number(result.priorityScore)
- priorityScoreProvenance: FORMAL_RUNTIME_RESULT_AT_C1_DECISION

It does not call scoreCandidate or applyMarketConsensus again.

C2 selectionContext carries the score only as an observed receipt value and
preserves the exact provenance marker.

The post-session C4 readiness gate requires both:
- a finite preserved priorityScore; and
- priorityScoreProvenance exactly equal to
  FORMAL_RUNTIME_RESULT_AT_C1_DECISION.

A numeric score with missing or different provenance remains INPUT_BLOCKED.

## Frozen Formal behavior

The Formal comparator remains unchanged:
priorityScore descending, then rewardPerRisk and the existing tie-break chain.

No change is authorized or implemented for:
- score weights;
- market-consensus calculation;
- A/B definitions;
- admission gates;
- 3+3+3 quotas;
- capital rules;
- FIRST / ADD / REDUCE / SELL;
- signal or push;
- order authority;
- System2.

The isolated review allows only buildC1PopulationReceipt as the additional
V8.15.4 changed function. Formal selector/ranker functions are not allowlisted.

## Evidence boundary

This receipt extension enables C4 to compare allocation methods on the same
candidate set using the actual frozen Formal priority score.

It does not establish that any alternative allocator is superior.
preferredAllocator remains null and economicSuperiority remains UNKNOWN.

## Deployment boundary

This is Class B because the additional field is written prospectively into the
production C1 research receipt. Passing CI is not deployment authorization.
Owner approval is required before merge/deploy.

Rollback: remove/revert V8.15.4. Existing C1/C3 receipts remain valid historical
evidence; no trading plan, signal, fill or order record is deleted.


## Exact-head validation request

PR #347 was temporarily retargeted to latest main only to trigger the repository's main-target pull-request CI.
Latest-main overlap audit found zero overlapping files with the V8.15.4 candidate.
This is not merge or deployment authorization. After exact-head CI, PR #347 must return to parent PR #344.


## Deployment closure — 2026-10-03

Owner approval was explicitly granted for the Class-B merge/deploy sequence.

Execution:
- Parent PR #344 merged first as `9a12e0437834a9549f99716517490bc363ff9a88`.
- Its V8.15.3 rebuild passed Regression and Cloudflare Deploy, including preserved monitoring configuration and research-only readback.
- Historical PR #347 was not merged because PR #344 had been squash-merged and the child retained ancestry-only conflicts.
- V8.15.4 was clean-replayed from latest main as PR #353 with only the 14 child files.
- PR #353 exact-head Regression, Repair CI and isolated review all passed.
- PR #353 merged as `92abae632671d36b9a8764ead2a657e64ccb6094`.
- Cloudflare Deploy run `37102186016` completed successfully.
- Regression run `37102186039` completed successfully.

Production readback:
- expectedVersion: `8.15.4-c4-priority-provenance`
- observedVersion: `8.15.4-c4-priority-provenance`
- research readback verified on the expected deployment.
- deployed runtime bindings, mode, watchlist routes and existing monitoring configuration were preserved.
- 23:35 Taipei after-market schedule remained intact.

Formal firewall closure:
- `priorityScoreCopiedFromFormalResult=true`
- `priorityScoreRecomputed=false`
- `formalComparatorFrozen=true`
- `signalPathChanged=false`
- `pushPathChanged=false`
- `orderPathChanged=false`
- `formalCoreImpact=false`
- `system2Touched=false`

Therefore V8.15.4 is an evidence/provenance extension only. It does not authorize any Formal admission, ranking, allocation, signal or order-policy change. C4 economic superiority remains UNKNOWN and any future Formal promotion still requires the existing Class-C evidence gate and explicit owner decision.
