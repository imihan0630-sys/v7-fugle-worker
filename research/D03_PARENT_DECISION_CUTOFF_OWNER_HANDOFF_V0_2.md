# D03 -> Shared Parent Owner Decision-Cutoff Handoff V0.2

Updated: 2026-10-04 Asia/Taipei
Producer: D03 Technical Indicator Research
Owner: System 1 shared immutable C1 parent / capture-generation owner
Status: RESEARCH_HANDOFF / EFFECTIVE_BUILD_AUDITED / NO PRODUCTION CHANGE
Formal Core: LOCKED

## Purpose

Supersede the earlier raw-source boundary recommendation with a physical audit of the effective V8.17 build.

No runtime or Production mutation is performed here.

## Effective-build evidence

Read-only workflow:
- name: D03 Effective Worker Decision Cutoff Audit Readonly
- run: 37196768178
- result: SUCCESS
- effective runtime source version: 8.17.0-shadow-cohort-membership
- C1/C2 repair/regression review: 95/95 PASS before the cutoff audit.

Physical findings:

1. total-capital KV input is read before selection;
2. after total capital, the effective patch chain performs one additional Formal-affecting async read:
   V7_MARKET_CONSENSUS from STOCKS_KV;
3. market consensus is consumed by applyMarketConsensus and can affect candidate priority/ranking;
4. after that market-consensus read and before selectTomorrowCandidates, there are zero additional async/external reads;
5. selectTomorrowCandidates is synchronous and contains no fetch/KV/D1 read;
6. buildC1PopulationReceipt creates a later decisionAt receipt stamp;
7. effective C1 still has no physical decisionCutoffAt;
8. C1 build occurs downstream of Formal result capture.

Therefore the V0.1 recommendation "after total-capital read" is too early for the effective V8.17 build.

## Correct current candidate boundary

The current effective-build source-audited insertion point is:

> immediately after the V7_MARKET_CONSENSUS KV read completes, and immediately before the call to selectTomorrowCandidates(...).

At that boundary all currently observed Formal-affecting external inputs have been loaded, while the Formal selector has not begun.

Owner must re-audit this invariant against any newer runtime version before implementation/deploy.

## Required additive parent fields

Minimum:
- decisionCutoffAt;
- decisionAt;
- generationId / captureGeneration;
- scanDate;
- runtimeVersion;
- selectionRuleVersion;
- parent content/keyset identity.

Recommended:
- formalFrozenAt;
- captureCompletedAt;
- source-input fingerprint.

Required ordering:
decisionCutoffAt <= formalFrozenAt <= decisionAt <= captureCompletedAt
where fields that are not separately materialized may be omitted only if owner contract preserves equivalent semantics.

## Implementation semantics

A future owner implementation should:
1. stamp decisionCutoffAt immediately after the final Formal-affecting input read;
2. pass the timestamp as additive provenance into the C1 receipt;
3. persist it under the exact immutable generation identity;
4. expose it on protected readback;
5. preserve selection/ranking/capital/signal/push parity;
6. add no market-data call merely to produce the timestamp;
7. never backfill historical generations.

A free-floating log timestamp is insufficient.

## D03 continuity integration

After a genuine cutoff-bearing parent exists:

1. shared continuity owner builds an immutable market-wide evidence cut no later than decisionCutoffAt;
2. noRevisionGapThroughCut must be owner-certified under bounded population semantics;
3. a continuity receipt may be materialized after the parent only if it is derived exclusively from the immutable pre-cut evidence set;
4. D03 binds parent + cutoff + evidenceCut + continuity receipt using the V0.2 binding contract;
5. Bollinger population acceptance is first;
6. ADX additionally requires canonical FULL_REPLAY.

## Authority

This handoff does not authorize Production deployment.
It does not change Formal behavior.
It does not increase D03 maturity.

Current:
- D03 = 56.7%;
- Bollinger = L2/40;
- ADX = L2/40;
- Formal Optimization Candidate = NONE.
