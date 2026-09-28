# Parent Keyset / Decision Set Hash Contract V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / HASH_SEMANTICS_FROZEN / NO_RUNTIME_CHANGE
Formal Core: LOCKED

## Purpose

Freeze two generation-level cryptographic commitments:

1. parentKeysetHash:
   which immutable parent identities belong to this Formal generation.

2. decisionSetHash:
   what immutable Formal decision payload fingerprint belongs to each parent.

These are independent checks.

## TI-438 — parentKeysetHash

Input:
unique parentDecisionReceiptId values for the generation.

Canonicalization:
- sort lexicographically by parentDecisionReceiptId;
- reject duplicate parent IDs;
- hash the canonical array using the PARENT_KEYSET domain.

Properties:
- input order does not matter;
- same count with one substituted parent changes the hash;
- changing only a parent semantic payload does NOT change parentKeysetHash.

## TI-439 — decisionSetHash

Input:
for every parent:
- parentDecisionReceiptId;
- semanticFingerprint.

Canonicalization:
- sort by parentDecisionReceiptId;
- reject duplicate parent IDs;
- hash the canonical array using the DECISION_SET domain.

Properties:
- input order does not matter;
- substituting a parent changes the hash;
- keeping the same parent IDs but changing one Formal semantic fingerprint changes the hash.

Therefore:
parentKeysetHash proves membership.
decisionSetHash proves membership-bound decision content.

## TI-440 — Why both hashes are required

Count alone cannot detect:
100 expected parents
versus
100 parents with one symbol substituted.

parentKeysetHash detects the substitution.

parentKeysetHash alone cannot detect:
same parent IDs
but one changed Formal decision payload.

decisionSetHash detects that change.

Generation certification therefore requires:
- expected count match;
- parentKeysetHash match;
- decisionSetHash match;
- zero provenance conflict.

## TI-441 — Order is not semantic

D1 chunk order, source enumeration order and retry order must not change either hash.

Observed Formal rank/order is already preserved inside each qualified parent semantic payload.

Therefore generation set hashes sort by parent ID and do not encode database insertion order.

## TI-442 — Duplicate parent identity is a hard failure

Two rows with the same parentDecisionReceiptId in one generation keyset are not "two observations."

They imply:
- duplicate construction;
- join duplication;
- or identity corruption.

Canonical parent-set construction fails closed on duplicate IDs.

## Current status

PARENT_KEYSET_HASH = FROZEN_V0_1
DECISION_SET_HASH = FROZEN_V0_1
HASH_ALGORITHM = SHA256_UTF8_V0_1
CANONICALIZATION = RFC8785_JCS_PLAIN_JSON_SUBSET_V0_1
RUNTIME_WIRING = NOT_IMPLEMENTED
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.
