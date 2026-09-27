# Immutable D1 Persistence / Publication Contract V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / PERSISTENCE_DESIGN_FROZEN / NO_D1_SCHEMA_CHANGE
Formal Core: LOCKED

## Purpose

Define how immutable parent/evidence rows can eventually be written to Cloudflare D1 without:
- overwrite;
- partial-generation publication;
- silent conflict;
- same-date rerun destruction.

No Production D1 table is created by this document.

## TI-479 — Legacy DELETE + UPSERT is prohibited

The legacy Shadow pattern:

DELETE scan_date
then
INSERT/UPSERT rows

is explicitly prohibited for promotion-grade immutable evidence.

Why:
- destroys first-known evidence;
- same-date rerun replaces the prior story;
- mid-write failure can leave partial data;
- an UPSERT can silently mutate original timestamps/payloads.

Future immutable research evidence is insert-once.

## TI-480 — Per-row insert semantics

For an immutable receipt identity:

Case A:
identity absent
=> INSERT.

Case B:
identity exists and semanticFingerprint matches
=> EXACT_DUPLICATE_NO_OP.

Case C:
identity exists and semanticFingerprint differs
=> PROVENANCE_CONFLICT.

Never:
UPDATE the existing immutable row to the new payload.

Exact duplicate must not change:
- captured_at;
- created_at;
- available_at;
- payload;
- source receipt references.

## TI-481 — D1 chunk atomicity

Cloudflare D1 batch statements are transactional:
if one statement in a batch fails, the batch aborts/rolls back.

Use bounded batch chunks for immutable writes.

But:
a whole scan generation may exceed one practical batch due to:
- row count;
- 30-second query limit;
- Worker CPU/memory;
- per-query statement/parameter limits;
- unknown real parent scale.

Therefore the entire generation must not rely on one giant transaction.

Batch size remains UNFROZEN until measured.

## TI-482 — Two-phase publication without mutable evidence

Phase 1 — STAGE IMMUTABLE ROWS

Write parent rows in bounded chunks.

Each chunk:
- insert-once;
- exact duplicate no-op;
- conflict blocks certification.

Rows are physically present but not yet inference-published.

Phase 2 — CERTIFY AND PUBLISH

After all chunks:
1. read exact generation parent identities/fingerprints through a first-primary Session;
2. recompute parentKeysetHash;
3. recompute decisionSetHash;
4. compare expected count/hash;
5. only on exact match insert one immutable generation receipt.

The generation receipt is the publication marker.

Readers must ignore parent rows whose captureGeneration lacks a valid final generation receipt.

Thus a crash after 73% of parent rows leaves unpublished staging evidence, not a false complete generation.

## TI-483 — Formal generation receipt is immutable and research-independent

The final generation receipt certifies:
- scan date;
- captureGeneration;
- Formal worker/rule/comparator lineage;
- parentScopeId;
- expected parent count;
- certified parentKeysetHash;
- decisionSetHash;
- selected-plan set hash/reference where available;
- decision cutoff/freeze timestamps.

It does NOT include later Technical/Pattern research completion state.

Reason:
later research completion would otherwise require mutating the Formal receipt.

Research runs are children of the already-certified generation.

## TI-484 — Operational run events are append-only and non-authoritative

Optional operational events may record:
- GENERATION_STARTED;
- PARENT_CHUNK_WRITTEN;
- PARENT_CHUNK_RETRY;
- PARENT_CONFLICT;
- FORMAL_GENERATION_CERTIFIED;
- OBSERVER_STARTED;
- OBSERVER_FAILED;
- QA_FAIL.

Events are append-only.

They help debugging but cannot make a generation inference-ready.

Only immutable final receipts have publication authority.

## TI-485 — Observer evidence uses the same publish pattern

For each evidence family / observer version / parent scope:

1. final Formal generation receipt must already exist;
2. write generic evidence-child rows in bounded chunks;
3. every expected parent must have exactly one ROOT attempt row;
4. additional Pattern-style item rows are allowed;
5. recompute attempted ROOT parentKeysetHash;
6. require exact match with expected parentKeysetHash;
7. require missing=0, provenanceConflict=0, QA failure=0;
8. insert immutable final observer-run receipt.

Readers may use child evidence for inference only when the final observer-run receipt exists and status is COMPLETE.

A partial child write without final receipt is unpublished.

## TI-486 — Exact duplicate handling needs read-after-write verification

Recommended D1 pattern:

- use INSERT ... ON CONFLICT DO NOTHING for immutable identity;
- after the insert batch, use the same first-primary Session to read the stored identity/fingerprint;
- classify:
  absent => WRITE_FAILURE / UNKNOWN;
  same fingerprint => INSERTED_OR_EXACT_DUPLICATE;
  different fingerprint => PROVENANCE_CONFLICT.

Do not use ON CONFLICT DO UPDATE for immutable evidence.

Why read-after-write:
DO NOTHING alone cannot distinguish exact duplicate from conflicting duplicate.

D1 Sessions provide sequential consistency, so subsequent reads in the same Session can verify the write view.

## TI-487 — Foreign-key use

D1 enforces foreign-key constraints.

Recommended:
evidence child parent_decision_receipt_id
REFERENCES decision parent parent_decision_receipt_id
ON DELETE RESTRICT.

Do not use cascading deletion for immutable research evidence.

The Formal generation receipt is inserted only after parent rows, so parent rows need not have a forward foreign key to a not-yet-created final receipt.

Inference publication is enforced by generation-receipt existence/hash verification.

## TI-488 — Chunking must not invent a semantic boundary

Chunk boundaries are storage/performance details only.

Do not let:
- chunk number;
- insert order;
- retry count

enter the parent/evidence semantic fingerprint.

A retry of the same chunk under the same captureGeneration uses the exact same receipt IDs/fingerprints.

A new Formal invocation gets a new captureGeneration.

## TI-489 — Reader firewall

Promotion-grade readers must begin from certified receipts:

Formal parent query:
valid final generation receipt
-> exact captureGeneration
-> decision parents.

Observer evidence query:
valid final observer-run receipt
-> exact captureGeneration/evidence family/version/scope
-> child rows.

Prohibited:
- date-range scan of child rows without run receipt;
- "latest row wins";
- use physically present staging rows because counts look sufficient;
- combine rows from different captureGenerations.

## TI-490 — Failure examples

Crash after some parent chunks:
- rows may exist;
- no final generation receipt;
- inference visibility = NO.

Exact retry:
- existing identical rows no-op;
- missing rows insert;
- final hashes verify;
- final generation receipt can then publish.

Same parent ID with changed payload:
- fingerprint mismatch;
- PROVENANCE_CONFLICT;
- generation cannot certify.

Research observer crashes:
- Formal generation remains valid;
- partial research child rows remain unpublished;
- Formal plans/signals/push are unaffected.

## TI-491 — D1 constraints / benchmarking boundary

Current Cloudflare documentation establishes:
- batch is transactional;
- individual query limits still apply inside batch;
- maximum SQL query duration is 30 seconds;
- D1 is effectively single-threaded per database for query processing;
- first-primary Session provides read-your-writes/sequential consistency;
- D1 enforces foreign keys.

Therefore:
- do not freeze one huge batch;
- do not freeze a chunk size yet;
- benchmark with real parent counts/payload sizes before Class-B approval.

## Current status

IMMUTABLE_ROW_WRITE_SEMANTICS = FROZEN_V0_1
GENERATION_TWO_PHASE_PUBLICATION = FROZEN_V0_1
OBSERVER_TWO_PHASE_PUBLICATION = FROZEN_V0_1
LEGACY_DELETE_UPSERT_FOR_NEW_EVIDENCE = PROHIBITED
CHUNK_SIZE = UNFROZEN_MEASUREMENT_REQUIRED
D1_SCHEMA_IMPLEMENTATION = NOT_IMPLEMENTED
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Build pure in-memory persistence-state simulator.
2. Falsify:
   - partial generation;
   - exact retry;
   - conflicting retry;
   - same-count wrong-keyset;
   - observer partial write.
3. Freeze receipt IDs for generation/evidence/run records.
4. Do not create D1 tables yet.
