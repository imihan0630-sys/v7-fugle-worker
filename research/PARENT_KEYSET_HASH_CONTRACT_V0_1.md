# Immutable Parent Keyset / Decision-Set Hash Contract V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / SET-INTEGRITY_CONTRACT_FROZEN
Formal Core: LOCKED

## Purpose

Prove exact set completeness across:
- immutable decision-state parents;
- observer parent attempts;
- run receipts.

Equal row counts are insufficient.

## TI-470 — Count equality cannot prove same population

Example:

Expected parents:
A, B, C.

Observer attempts:
A, B, D.

Both counts are 3.

But one expected parent C disappeared and one foreign parent D entered.

Therefore:
attemptedParentCount == expectedParentCount
is necessary but not sufficient.

Exact keyset identity must also match.

## TI-471 — parentKeysetHash

Canonical payload:

{
  scanDate,
  captureGeneration,
  parentScopeId,
  parentIds: sorted unique parentDecisionReceiptIds
}

Hash:
SHA-256 + JCS under domain:
PARENT_KEYSET.

Rules:
- IDs sorted lexicographically before hashing;
- input order does not matter;
- duplicate parent IDs are QA_FAIL;
- malformed parent IDs are QA_FAIL;
- scope/generation/date are part of the payload.

Thus the same parent IDs under another generation or scope are not the same keyset receipt.

## TI-472 — observed vs certified keyset

A keyset can always produce:
observedParentKeysetHash
for diagnostics.

It becomes:
certifiedParentKeysetHash
only when:
- expectedParentCount is known;
- observed unique count equals expected count;
- no duplicate/malformed IDs;
- upstream scope QA is VALID.

If count is short:
INCOMPLETE.

Do not call a partial observed hash certified.

## TI-473 — decisionSetHash

Keyset hash proves which parents exist.

It does not prove their decision payloads.

decisionSetHash uses sorted pairs:

[
  { parentDecisionReceiptId, semanticFingerprint },
  ...
]

plus:
- scanDate;
- captureGeneration;
- parentScopeId.

Hash domain:
DECISION_SET.

Therefore:
same symbols/IDs + changed decision payload
changes decisionSetHash.

This is a generation-level summary of actual frozen Formal decision facts.

## TI-474 — Observer attempt hash must use parent-level ROOT rows

Some observers emit one evidence object per parent.
Others, especially Pattern, may emit multiple episodes for one parent.

Therefore evidence item count cannot define attempt coverage.

Generic rule:
every expected parent must emit exactly one evidence_item_key = ROOT row per observer run.

Single-object observer:
ROOT is the evidence row.

Multi-object observer:
ROOT records parent-level attempt/status/summary;
additional deterministic item keys store episodes/items.

Attempted parent keyset is built only from ROOT rows.

## TI-475 — COMPLETE observer run

A run may be COMPLETE only if:

1. expectedParentCount == attemptedParentCount;
2. missingCount == 0;
3. provenanceConflictCount == 0;
4. attemptedParentKeysetHash == expectedParentKeysetHash;
5. no duplicate ROOT parent IDs;
6. observer QA failures == 0.

Blocked/Unknown/Constrained ROOT rows still count as attempted.
Silent omission does not.

## TI-476 — Why this matters for cross-lane evidence

Technical Indicator:
one ROOT per parent.

Target/RR:
one ROOT per parent, possibly NOT_EVALUABLE.

Gate overlap:
one ROOT per parent with gate-state payload.

External evidence:
one ROOT per parent per evidence source-family run.

Pattern:
one ROOT attempt per parent + zero/many episode rows.

Thus the same completeness mechanism works across all five already-tested evidence families.

## TI-477 — Hash roles remain distinct

parentDecisionReceiptId:
one symbol decision identity.

semanticFingerprint:
one symbol decision payload fingerprint.

parentKeysetHash:
exact set of parent identities.

decisionSetHash:
exact set of parent identities + their semantic payload fingerprints.

Do not substitute one for another.

## Current status

PARENT_KEYSET_HASH = FROZEN_V0_1
DECISION_SET_HASH = FROZEN_V0_1
ROOT_ATTEMPT_ROW = REQUIRED
COUNT_ONLY_COMPLETENESS = REJECTED
RUNTIME_IMPLEMENTATION = NOT_IMPLEMENTED
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Implement pure keyset/decision-set helper.
2. Test order invariance, duplicate rejection and same-count substitution.
3. Update generic evidence-child schema to v0.4 ROOT-attempt semantics.
4. Keep zero market calls / zero D1 writes.
