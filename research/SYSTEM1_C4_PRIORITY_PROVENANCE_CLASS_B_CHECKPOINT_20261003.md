# System 1 C4 priority-score provenance Class-B checkpoint — 2026-10-03

Status: CLASS-B CANDIDATE / NOT MERGED / NOT DEPLOYED / FORMAL CORE LOCKED
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
