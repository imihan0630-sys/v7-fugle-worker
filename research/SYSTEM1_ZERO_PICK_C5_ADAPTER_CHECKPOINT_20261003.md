# System1 Zero-Pick C5 Eligibility Adapter V0.1 — 2026-10-03

Status: CLASS-A PURE ADAPTER / FORMAL CORE LOCKED / NO WORKER OR D1 INTEGRATION

## Purpose

Remove the remaining manual eligibility injection from the zero-pick research chain.

Before this adapter, the end-to-end pipeline required a caller-supplied list of
P1-A eligible symbols plus an outcome-blind declaration.

That was fail-closed but still left a human/API injection surface.

The preferred Class-A path is now:

C5 semantic repair diagnostic
→ deterministic extraction of rows where:
- p1aBlockSet is non-empty; and
- reachStage = F9_RANKABLE
→ zero-pick research pipeline
→ rank observer
→ frozen 3+3 comparator.

## Firewall

The adapter rejects C5 inputs unless:

- schema = SYSTEM1_C5_SEMANTIC_REPAIR_V0_2;
- researchOnly = true;
- formalCoreLocked = true;
- economicSuperiority = UNKNOWN;
- formalOptimizationCandidate = NONE;
- row symbols are unique;
- row sessionDate/generationId are consistent with the C5 header.

Observer sources must match the C5 session date.

## Result

The preferred zero-pick pipeline no longer depends on a manually supplied
eligible-symbol list.

This does not change C5 semantics and does not make F9_RANKABLE a candidate.
It only creates the frozen research challenger population for a Formal-zero-pick
date after C5 has already classified the matched research cohort.

## Current boundary

Safe Class-A zero-pick software preparation now includes:

1. data-gap proof;
2. frozen comparator;
3. Class-B capture proposal;
4. pure rank-input observer;
5. end-to-end fail-closed pipeline;
6. direct C5 F9 eligibility adapter.

Still not authorized:
- Worker integration;
- D1 prospective capture;
- production receipt generation.

Economic superiority remains UNKNOWN.
FORMAL_OPTIMIZATION_CANDIDATE remains NONE.
