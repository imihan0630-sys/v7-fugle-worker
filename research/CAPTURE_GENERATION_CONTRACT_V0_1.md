# Formal Scan Capture Generation Contract V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / GENERATION_IDENTITY_FROZEN / NO_RUNTIME_CHANGE
Formal Core: LOCKED

## Purpose

Define one immutable execution-generation identity for a single after-market Formal scan invocation.

Same scan date can be run more than once.
Research evidence must know exactly which Formal invocation it belongs to.

## TI-459 — Current timestamps are useful witnesses but not a generation identity

Current Production already has useful same-invocation timing evidence:
- run summary has generatedAt;
- recordTradeJournalDay creates one invocation-level now;
- selected journal plan rows use recorded_at = same now;
- selected research snapshots use updated_at = same now.

This helps prove selected rows were produced together.

But it is not a durable generation contract because:
- same-date reruns can delete/rewrite or upsert legacy rows;
- generatedAt is a display/operation timestamp, not an immutable relational key;
- a timestamp alone should not be relied on for uniqueness;
- not every research child currently shares one immutable generation field.

Therefore:
DO_NOT_OVERLOAD_GENERATED_AT_AS_CAPTURE_GENERATION.

## TI-460 — captureGeneration is an opaque invocation ID

Frozen format semantics:

captureGeneration:
- created once per after-market scan invocation;
- opaque;
- unique to that invocation;
- reused unchanged by every parent/child/run receipt from that invocation;
- never derived from selected symbols or outcomes.

Recommended production primitive:
crypto.randomUUID().

Versioned representation:
G1_<uuid-v4>

Example:
G1_123e4567-e89b-42d3-a456-426614174000

The UUID is identity only.
scanDate, workerVersion and timing remain separate receipt fields.

## TI-461 — Why generation should be random, not deterministic from inputs

Two same-day executions with identical market inputs are still two distinct operational invocations.

A deterministic hash of:
scanDate + inputs
would collapse them into one generation.

That would hide:
- reruns;
- source retry differences;
- operator/manual reruns;
- pipeline timing differences;
- separate persistence attempts.

Therefore:
same inputs can legitimately produce two generations.

Semantic equality is tested separately through hashes/fingerprints.

## TI-462 — Generation creation point

Preferred future order:

1. acquire/validate the existing after-market execution lease/lock;
2. resolve requested scan date / run mode;
3. create captureGeneration exactly once;
4. start a generation receipt;
5. load sources and run Formal;
6. freeze immutable decision-state parents using the same generation;
7. persist Formal outputs with generation linkage;
8. run research observers with the same generation;
9. finalize generation receipt.

Do not create a new generation inside:
- each D1 persistence helper;
- each observer;
- each retry chunk.

One invocation => one generation.

## TI-463 — Retry semantics

Within the same live invocation:
- database batch retry;
- child chunk retry;
- exact persistence retry

must retain the original captureGeneration.

A separate re-entry into the after-market scan function after the previous invocation ended:
creates a new generation.

This distinction prevents persistence retries from masquerading as new decisions.

## TI-464 — Generation receipt states

Suggested run-level states:

STARTED
- generation allocated; Formal not yet frozen.

FORMAL_FROZEN
- actual Formal decision parent keyset/result hash frozen.

RESEARCH_COMPLETE
- all required research observer runs complete.

RESEARCH_INCOMPLETE
- Formal frozen, one or more research observers incomplete/blocked at run level.

FORMAL_FAILED
- Formal did not reach a certifiable frozen decision.

ABORTED_PRE_FORMAL
- invocation stopped before Formal freeze.

Research failure after FORMAL_FROZEN never changes Formal output.

## TI-465 — Minimum generation receipt

Required fields:
- captureGeneration;
- scanDate;
- runMode;
- requestedDate;
- decisionCutoffAt;
- startedAt;
- formalFrozenAt;
- finishedAt;
- formalWorkerVersion;
- selectionRuleVersion;
- sourceConfigVersion/fingerprint;
- parentScopeId;
- expectedParentCount;
- parentKeysetHash;
- formalDecisionSetHash;
- selectedPlanSetHash;
- generationStatus;
- researchRunSummary;
- failureClass if any.

No secrets/tokens are stored.

## TI-466 — Parent and Formal output linkage

Every immutable decision-state parent stores:
captureGeneration.

Future Formal durable plan/journal evidence should expose the same generation or a cryptographically linked generation reference.

This is required to prove:
- selected parent;
- selected plan;
- later research child

all came from the same Formal invocation.

Do not infer the link only from nearby timestamps.

## TI-467 — Generation ID and parent ID are different

captureGeneration identifies:
one whole Formal scan invocation.

parentDecisionReceiptId identifies:
one symbol's immutable decision state inside that generation.

Therefore:
one generation -> many parent IDs.

New generation:
all parent identities change even if semantic payloads happen to match exactly.

This is intentional.

## TI-468 — Dry-run semantics

Dry-run may create an in-memory ephemeral generation for deterministic plumbing tests.

It must be marked:
runMode = DRY_RUN.

It must not be persisted into the production first-known evidence archive as if it were a live Formal decision generation.

Historical reconstruction likewise cannot manufacture LIVE generation IDs.

## TI-469 — UUID availability

Cloudflare Workers Web Crypto exposes crypto.randomUUID().

Therefore future runtime needs no custom random-ID package.

The generator should still accept injected UUID/time sources in pure tests.

## Current status

CAPTURE_GENERATION_SEMANTICS = FROZEN_V0_1
GENERATED_AT_AS_GENERATION_ID = REJECTED
RUNTIME_GENERATION_RECEIPT = NOT_IMPLEMENTED
FORMAL_PLAN_GENERATION_LINK = NOT_IMPLEMENTED
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Add pure generation helper with injected UUID/time for deterministic tests.
2. Test same invocation reuse vs new invocation identity.
3. Freeze parentKeysetHash and decision-set hash construction next.
4. Do not wire generation into Worker/D1 yet.


## Persistence model correction — TI-478

The initial generation-status sketch mixed:
- Formal freeze;
- later research completion

inside one evolving generation receipt.

That is incompatible with an immutable final receipt because later research completion would require UPDATE.

Frozen correction:

### Immutable Formal generation receipt

Insert exactly once only AFTER:
- every parent chunk is persisted or confirmed exact duplicate;
- parent count reconciles;
- certified parentKeysetHash matches expected;
- decisionSetHash matches the in-memory frozen Formal decision set.

The immutable generation receipt certifies only the Formal parent generation.

It never waits for Technical/Pattern/other research completion.

### Append-only operational events

STARTED / retry / failure / QA diagnostics belong to an append-only event stream.

They are operational observability, not inference authority.

### Observer final receipts

Each research observer receives its own immutable final run receipt only after its exact ROOT attempt keyset is complete.

Research completion therefore never mutates the Formal generation receipt.

This correction occurs before any Production persistence implementation.
