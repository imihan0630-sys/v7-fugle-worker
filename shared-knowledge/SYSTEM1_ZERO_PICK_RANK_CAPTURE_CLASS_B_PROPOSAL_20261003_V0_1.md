# System1 Zero-Pick Rank-Input Capture — Class-B Proposal V0.1

Updated: 2026-10-03 Asia/Taipei  
Status: DESIGN_ONLY / OWNER_APPROVAL_REQUIRED_BEFORE_IMPLEMENTATION / FORMAL_CORE_LOCKED

Parents:
- `shared-knowledge/SYSTEM1_ZERO_PICK_COUNTERFACTUAL_DATA_GAP_20261003_V0_1.md`
- `research/SYSTEM1_ZERO_PICK_COUNTERFACTUAL_COMPARATOR_CHECKPOINT_20261003.md`
- `research/system1_zero_pick_counterfactual_comparator_v0_1.mjs`

## Purpose

Define the smallest prospective shared-runtime evidence addition needed to make
future Formal-zero-pick / P1-A-F9 dates reconstructable without changing any
Formal gate, score, rank, quota, capital, signal, push or order behavior.

This document authorizes **nothing**. It is a Class-B proposal only.

## Audit result

The missing tuple is not merely a persistence omission.

For a P1-A-rejected row, the current Formal `scoreCandidate()` exits at the
first failed gate. Therefore the production Formal result does not contain a
complete ranking tuple for that rejected row.

At the same decision scan, however, the runtime already has most of the factual
inputs needed by a separate research observer:

- `c1DerivedState()` already derives rewardPerRisk and setupQuality for feature rows;
- C1 V8.15.3 already persists ret20 and marketReturn20, so relativeStrength is
  observable from same-scan inputs;
- `sectorStats` already contains the in-memory sector score used by Formal;
- C1 derived state already computes institutionalScore and fundamentalScore;
- the same-day market-consensus reference is already loaded for the Formal scan;
- feature-row iteration order exists before ranking and can provide a deterministic
  same-pool pre-sort ordinal.

No new market-data provider call is required for the proposed receipt.

## Critical semantic boundary

The proposed tuple is **not an actual Formal rank** for a rejected row.

It is:

`COUNTERFACTUAL_RANK_INPUT / RESEARCH_ONLY / NO_FORMAL_DECISION_IMPACT`

The observer may reproduce the frozen rank formula from same-scan inputs only to
construct a preregistered challenger. It must never write the result back into
`formalResult`, selected plans, WATCH, BUY, capital allocation or order state.

## Proposed additive C1 child payload

Preferred placement: a nested, research-only child of the immutable C1 row,
generated in the same request before the C1 generation is persisted.

Suggested schema:

`SYSTEM1_ZERO_PICK_COUNTERFACTUAL_RANK_INPUT_V0_1`

Required identity/provenance:
- symbol;
- pool = GENERAL | THOUSAND;
- captureGeneration;
- decisionAt;
- rankingTupleKnownAt;
- rankComparatorVersion;
- priorityScoreDefinitionVersion;
- counterfactualFormulaVersion;
- rankingTupleProvenance;
- rankingTupleFingerprint;
- preSortOrdinal.

Required frozen tuple:
- postConsensusPriorityScore;
- rewardPerRisk;
- marketConsensusScore;
- setupQuality;
- sectorFlow;
- relativeStrength.

Supporting decomposition:
- preConsensusPriorityScore;
- marketConsensusSources;
- marketConsensusBonus;
- institutionalScore;
- fundamentalScore;
- rsComponent;
- rrComponent.

## Same-scan derivation contract

### rewardPerRisk
Source:
`c1DerivedState(f).rewardPerRisk`

No later price or target data may fill a missing value.

### setupQuality
Source:
`c1DerivedState(f).setupQuality`

Use the same A/B setup channel observed at the decision scan.

### sectorFlow
Source:
the existing same-scan `sectorStats[f.industry].score`.

Current C1 persists sector breadth/change/activity but not `sector.score`.
The proposal may copy that already-computed number into the research child.

No sector score is recomputed from a later sector snapshot.

### relativeStrength
Source:
`f.ret20 - f.marketReturn20`

Both values must be finite and known in the same scan.

### marketConsensusScore / bonus
Source:
the already-loaded `V7_MARKET_CONSENSUS` reference for the exact scan date.

Freeze the deployed V7.5.30 rule:
- sourceCount < 2 -> score 0 / bonus 0;
- otherwise score = min(100, 20 + sourceCount * 15);
- bonus = min(7, (sourceCount - 1) * 2).

A missing or wrong-date consensus reference must be represented explicitly. Do
not query a later consensus snapshot to repair it.

### preConsensusPriorityScore
Research reproduction of the current frozen score formula from same-scan values:

- setupQuality * 0.28
- sectorFlow * 0.14
- institutionalScore * 0.16
- fundamentalScore * 0.14
- clamp(50 + relativeStrength * 2, 0, 100) * 0.14
- clamp(rewardPerRisk * 20, 0, 100) * 0.14
- final clamp 0..100

### postConsensusPriorityScore
`round(clamp(preConsensusPriorityScore + marketConsensusBonus, 0, 100), 1)`

This is a **counterfactual formula output**, not a claim that Formal assigned the
rejected row that score.

### preSortOrdinal
Freeze the row's insertion ordinal from the same feature-row sequence before
sorting, scoped within its pool.

Rationale:
the deployed comparator has no explicit symbol tie-break. JavaScript stable sort
preserves insertion order when all comparator fields tie. GENERAL and THOUSAND
must each preserve their own pre-sort lineage.

## Missing-data rule

No imputation is permitted.

If any required frozen tuple field cannot be certified from same-scan data:
- do not fabricate 0 merely to complete the tuple;
- emit `rankInputStatus = INCOMPLETE`;
- list `missingFields`;
- do not admit that row to the zero-pick comparator.

Exception:
a numeric 0 returned by an explicitly versioned existing scoring function is a
real function output, not an imputation. Its provenance must say so.

## Population rule

Do not capture only rows later discovered to have good outcomes.

Preferred prospective population:
all feature-admitted C1 rows for which the research observer can evaluate the
tuple, with the child clearly marked research-only.

P1-A F9 membership is attached later from the frozen C5 semantic observer.

This avoids outcome-conditioned capture and lets the post-session join use:
same C1 generation + same symbol + frozen P1-A membership + frozen rank input.

## Zero-pick usage order

For a Formal-zero-pick date:

1. take only rows that are P1-A F9 under the matched C5 generation;
2. require complete rank-input receipt;
3. require exact frozen comparator version;
4. partition GENERAL / THOUSAND;
5. sort by the six-field comparator + preSortOrdinal;
6. take max 3 per pool, no cross-fill;
7. freeze challenger membership;
8. only then apply the separately frozen allocation comparison;
9. only then execution/cost;
10. only then mature outcome comparison.

Never average all F9 rows against cash.

## Runtime firewall

Any implementation PR must prove:

- `scoreCandidate()` unchanged;
- `applyMarketConsensus()` unchanged;
- Formal `rankFn` unchanged;
- selected symbols unchanged on deterministic fixtures;
- Formal plans/capital unchanged;
- BUY / ADD / REDUCE / SELL unchanged;
- 15m Formal signal path unchanged;
- push unchanged;
- order path unchanged;
- no new provider calls;
- System2 untouched;
- research failure is fail-open with respect to Formal trading behavior.

## Storage / integrity

Preferred design:
extend the existing immutable C1 row JSON with the nested research child rather
than create a separate mutable table, provided D1 byte bounds remain safe.

Required:
- generation identity inherited from C1;
- tuple fingerprint over canonical fields;
- same generation + same symbol + different fingerprint => provenance conflict;
- no UPDATE of old generation rows;
- old historical rows are never backfilled as if contemporaneous;
- UTF-8 chunk-size regression must remain within the existing D1 ceiling.

If payload-size testing shows unacceptable expansion, use a separate immutable
child table keyed by generation + symbol. That would still be Class B.

## Implementation class

- this proposal/documentation: Class A research governance;
- pure local constructor/tests: Class A;
- Worker C1 child generation or D1 persistence: **Class B, owner approval required**;
- any change to actual Formal ranking/admission/selection: **Class C, separately prohibited unless explicitly approved**.

## Acceptance plan after owner approval

1. re-read latest main;
2. implement the child observer with zero provider calls;
3. deterministic parity fixture proving all Formal outputs byte/semantic equivalent;
4. test complete/incomplete tuple fail-closed behavior;
5. test stable same-pool tie semantics;
6. test C1 immutable conflict/idempotency behavior;
7. run Regression + Repair CI + isolated System1 review;
8. measure C1 payload bytes at 500 / 1000 / 2000-row scales;
9. deploy only after passing Class-B review;
10. verify production readback version and first prospective receipt.

## Current decision

- Comparator software gap: CLOSED by Class-A PR #382.
- Prospective rejected-row tuple evidence gap: OPEN.
- Class-B implementation: NOT AUTHORIZED.
- Historical zero-pick reconstruction: STILL BLOCKED.
- Economic superiority: UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE: NONE.
- Formal Core: LOCKED.
