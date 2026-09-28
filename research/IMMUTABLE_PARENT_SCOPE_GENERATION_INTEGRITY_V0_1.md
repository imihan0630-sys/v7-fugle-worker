# Immutable Parent Scope / Generation Integrity V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / SCOPE_AND_COHERENCE_FROZEN / NO_RUNTIME_CHANGE
Formal Core: LOCKED

## Purpose

Prevent a cryptographically valid parent set from containing rows that do not belong to one coherent Formal invocation.

Set hashes commit to data.
They do not by themselves prove the data belongs together.

## TI-443 — Frozen parentScopeId

parentScopeId:

FORMAL_HISTORY_ADMITTED_FEATURE_ROWS_V0_1

Definition:
all history-admitted feature rows actually evaluated by the same-scan Formal decision path.

Includes:
- early base failures;
- downstream failures;
- qualified-not-selected;
- selected;
- decision-error rows that entered this scope.

Excludes:
rows blocked before history/feature admission.
Those remain represented in the date-level scan population receipt.

Selected-only = false.

## TI-444 — One generation must be lineage-coherent

Every parent inside one certified generation must share:

- scanDate;
- captureGeneration;
- decisionCutoffAt;
- formalWorkerVersion;
- selectionRuleVersion;
- rankComparatorVersion;
- parentSchemaVersion.

The generation receipt must also declare the same expected lineage.

A mixed set is invalid even if:
- parent count matches;
- keyset hash is internally consistent;
- decision-set hash is internally consistent.

## TI-445 — Symbol uniqueness

Within one parent scope/generation:
one canonical symbol may appear at most once.

Why:
parent identity contains more than symbol.
A bad pipeline could accidentally build two IDs for the same symbol by mixing cutoff/comparator/schema fields.

Parent-ID uniqueness alone would not catch that.

Therefore:
duplicate canonical symbol = INVALID_GENERATION_SET.

## TI-446 — Hashing and coherence solve different problems

parentKeysetHash:
proves exact parent identities.

decisionSetHash:
proves exact semantic fingerprints tied to those identities.

generation coherence:
proves those identities belong to one intended Formal invocation and scope.

All three are required before publication certification.

## TI-447 — Parent scope is a semantic contract, not a row-count heuristic

Do not define the parent scope as:
- top N;
- sampled Shadow;
- selected only;
- "whatever rows were successfully written."

The scope is determined upstream by the same-scan Formal evaluation boundary.

Expected parent count is measured from that frozen scope.

## TI-448 — Upstream history blocks remain visible in the denominator

Rows blocked before feature/decision evaluation are not assigned fake decision-state parents.

Instead the scan population receipt preserves:
- normalized market rows;
- history-admission valid/blocked/unknown counts and keysets.

This avoids:
- pretending no Formal decision means a Formal failure;
- losing source-blocked symbols from coverage analysis.

## Current status

PARENT_SCOPE_ID = FORMAL_HISTORY_ADMITTED_FEATURE_ROWS_V0_1
PARENT_SCOPE_SEMANTICS = FROZEN
GENERATION_COHERENCE = FROZEN
SYMBOL_UNIQUENESS = REQUIRED
RUNTIME_IMPLEMENTATION = NOT_IMPLEMENTED
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.


## Canonical scope-ID reconciliation

A concurrent research lane had already frozen the same semantic parent boundary under:
FORMAL_HISTORY_ADMITTED_FEATURE_ROWS_V0_1.

The local alias FORMAL_HISTORY_ADMITTED_DECISION_PATH_V1 is therefore retired.

Frozen rule:
- one semantic parent scope => one canonical parentScopeId;
- parent_generation_integrity_v0_1.mjs imports the canonical TECHNICAL_PARENT_SCOPE_ID from immutable_parent_scope_measurement_v0_1.mjs;
- the retired alias must not appear in new receipts.

This is a research-contract reconciliation before any runtime persistence.
