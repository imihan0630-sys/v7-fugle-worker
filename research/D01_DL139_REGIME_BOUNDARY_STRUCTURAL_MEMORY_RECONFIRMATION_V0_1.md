# D01 DL-139 — Regime-Boundary Structural-Memory Reconfirmation Contract V0.1

Updated: 2026-10-10 Asia/Taipei
Status: OUTCOME_BLIND / REGIME_RECONFIRMATION_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Define causal post-boundary reconfirmation when the same security survives but its prior structural memory has been marked stale.

The first post-boundary price print is not automatic reconfirmation.

## Required regime receipt

A D01 regime-boundary receipt must bind:
- regimeBoundaryReceiptId;
- regimeBoundaryVersion;
- securityIdentity;
- issuerIdentity if owner-certified;
- boundaryId;
- normalizedBoundaryClass;
- structuralMemoryDisposition;
- eventEffectiveAt;
- firstObservableAt;
- ownerDomain;
- sourceId/version/hash;
- replaySafe.

Allowed structuralMemoryDisposition:
PRESERVE_STRUCTURAL_MEMORY
STALE_RECONFIRM_REQUIRED
BREAK_STRUCTURAL_MEMORY
REGIME_MEMORY_UNKNOWN_BLOCKED

## Episode handling

### PRESERVE_STRUCTURAL_MEMORY

- security identity and old episode may continue;
- boundary remains an explicit context node;
- no extra vote is created.

### STALE_RECONFIRM_REQUIRED

At boundary:
- old episode becomes CONTEXT_STALE;
- old anchors remain historical facts;
- old confirmedAt remains immutable;
- old episode cannot emit a new post-boundary confirmation using pre-boundary evidence alone.

A post-boundary reconfirmation requires:
- preregistered geometry/lifecycle rule;
- only post-boundary observable bars for the reconfirming condition;
- new reconfirmedAt clock;
- no suffix/future-pivot backfill.

### BREAK_STRUCTURAL_MEMORY

At boundary:
- old episode becomes TERMINATED_REGIME_BREAK;
- new post-boundary structural episode must use a new episodeId;
- no pre-boundary base width/anchor count is inherited into the new episode.

### UNKNOWN

REGIME_MEMORY_UNKNOWN_BLOCKED:
- no continuity claim;
- no ordinary-breakout/gap interpretation that depends on regime continuity.

## Reconfirmation modes

D01 does not invent one universal numeric rule.

Allowed preregistered modes include:
POST_BOUNDARY_RETEST_OF_SURVIVING_ZONE
POST_BOUNDARY_NEW_BASE_CONFIRMATION
POST_BOUNDARY_BREAK_RECLAIM_SEQUENCE
POST_BOUNDARY_MULTI_SESSION_ACCEPTANCE

The mode and required bars must be frozen before outcome access.

No outcome-selected mode.

## Clock discipline

reconfirmedAt >= all required post-boundary source-bar availability times.

The reconfirmation receipt must preserve:
- priorEpisodeId;
- boundaryId;
- reconfirmationMode;
- requiredPostBoundarySourceBarIds;
- firstObservableAt;
- reconfirmedAt;
- predictorFreezeAt;
- deterministicReconfirmationHash.

A later successful price move cannot move reconfirmedAt earlier.

## Failed reconfirmation

Possible states:
RECONFIRMATION_PENDING
RECONFIRMATION_PASSED
RECONFIRMATION_FAILED
RECONFIRMATION_EXPIRED
DATA_BLOCKED

Failed/expired cases remain in the denominator.

Do not search for a new mode after one mode fails unless that new mode was already preregistered as a separate experiment.

## D01-07 special rule

If a base/cup/handle episode is stale:
- baseEpisodeId may remain as historical parent episode ID;
- a post-boundary continuation uses a derived continuationEpisodeId only after reconfirmation;
- parent and continuation remain dependency-linked.

This prevents one economic regime change from creating multiple independent base votes.

## D01-09 special rule

A cross-boundary gap can be decomposed into:
RAW_GAP
+
ISSUER_REGIME_BOUNDARY_CONTEXT.

If later testing asks whether gap geometry has residual value:
common-parent support must include the same regime-boundary class.

## Current decision

FIRST_POST_BOUNDARY_PRINT_EQUALS_RECONFIRMATION = FALSE.
RECONFIRMATION_MODE_MUST_BE_PREREGISTERED = TRUE.
FAILED_RECONFIRMATION_MAY_BE_DROPPED = FALSE.
RECONFIRMED_CLOCK_MAY_BE_BACKDATED = FALSE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
