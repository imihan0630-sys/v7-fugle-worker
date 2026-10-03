# System1 Zero-Pick Class-B Acceptance Gate V0.1 — 2026-10-03

Status: CLASS-A GOVERNANCE / CLASS-B IMPLEMENTATION STILL OWNER-APPROVAL-REQUIRED / FORMAL CORE LOCKED

## Purpose

Freeze the machine-verifiable acceptance conditions that any future
zero-pick prospective rank-input capture implementation must satisfy.

This gate does **not** implement Worker capture and does **not** authorize merge
or deployment. It exists so a later Class-B patch cannot define its own success
criteria after seeing test results.

## Formal invariants

A Class-B candidate is technically blocked if any of the following changes:

- `scoreCandidate()`;
- `applyMarketConsensus()`;
- Formal `rankFn`;
- selected-symbol output on deterministic parity fixtures;
- Formal plans or capital;
- signal-state behavior;
- 15-minute Formal path;
- push behavior;
- order behavior.

Provider-call delta must be exactly zero.
System2 must remain untouched.
Research failure must remain fail-open to Formal trading behavior.

## Evidence invariants

The candidate must prove:

- same-scan input only;
- `rankingTupleKnownAt <= decisionAt`;
- exact-date market-consensus reference only;
- no later repair;
- no historical backfill masquerading as contemporaneous evidence;
- `actualFormalRank=false`;
- incomplete tuple excluded from comparator;
- stable same-pool pre-sort ordinal.

## Storage invariants

- immutable-generation conflict guard remains active;
- readback verification is mandatory;
- max UTF-8 D1 chunk bytes <= 90,000;
- synthetic 2,000-row C1 receipt remains below 10,000,000 bytes.

## CI invariants

All three must pass:

1. V8 Regression Tests;
2. V8 Repair CI;
3. System1 C1 C2 isolated offline repair review.

## Authorization semantics

The technical gate has three states:

- `TECHNICAL_BLOCKED`;
- `TECHNICALLY_READY_OWNER_APPROVAL_REQUIRED`;
- `CLASS_B_CANDIDATE_ELIGIBLE_FOR_OWNER_MERGE_REVIEW`.

Even the last state does not itself authorize merge, deployment or any Class-C
Formal change. Owner approval is a separate governance fact and cannot be
inferred from a green test suite.

Current state remains:
- Class-B runtime capture: NOT AUTHORIZED;
- Economic superiority: UNKNOWN;
- FORMAL_OPTIMIZATION_CANDIDATE: NONE;
- Formal Core: LOCKED.
