# Full Formal Generation Expectation / Publication Gate V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / END_TO_END_GENERATION_GATE_FROZEN
Formal Core: LOCKED

## Purpose

Join upstream scan-population completeness with downstream immutable parent completeness before a Formal generation may become inference-visible.

## TI-506 — Generation publication must certify both sides of the funnel

Upstream:
- normalized market population;
- history admitted / blocked / unknown partitions;
- feature-ready expected parent symbol set.

Downstream:
- coherent immutable parent set;
- parentKeysetHash;
- decisionSetHash.

A complete downstream parent set does not excuse an incomplete upstream denominator.

## TI-507 — Parent symbols must equal feature-ready symbols

Before publication:

sorted parent symbols
must exactly equal
sorted featureReady parent-expected symbols from the scan-population receipt.

Count equality is insufficient.

A missing/substituted symbol fails expectation construction.

## TI-508 — Full generation expectation

A valid expectation freezes:
- parentScopeId;
- scanPopulationReceiptId;
- normalized/admission/feature-ready counts;
- normalized/admitted/blocked/unknown/feature-ready keyset hashes;
- expected parent count;
- parentKeysetHash;
- decisionSetHash;
- selectedPlanSetHash when available.

This is the in-memory expected truth used later to verify persisted rows.

## TI-509 — Publication read-back checks

After staged D1 writes, certification compares observed persisted state with the expectation.

Required:
- all upstream counts match;
- all upstream keyset hashes match;
- parent count matches;
- parentKeysetHash matches;
- decisionSetHash matches;
- selectedPlanSetHash matches when required;
- provenanceConflictCount=0.

Any mismatch:
UNPUBLISHED.

## TI-510 — Why upstream hashes belong in Formal generation certification

Without upstream certification, research could see:
100% complete parents
from only the subset whose history source happened to succeed.

That is complete downstream but biased upstream.

The final generation receipt must prove both:
- scan denominator integrity;
- decision-parent integrity.

## TI-511 — Changed decision content is distinct from changed membership

Same parent IDs + changed semantic fingerprint:
- parentKeysetHash stays the same;
- decisionSetHash changes.

Different parent membership:
- parentKeysetHash changes;
- decisionSetHash changes.

This distinction improves failure diagnosis.

## TI-512 — Selected plan linkage is a separate optional commitment

selectedPlanSetHash, when available, proves that durable selected plans/journal are linked to the same frozen Formal generation.

It does not replace:
- selectedFlag in parents;
- decisionSetHash.

Until production durable plans expose generation linkage:
selectedPlanSetHash may remain unavailable/UNKNOWN and must not be fabricated.

## Current status

FULL_GENERATION_EXPECTATION = FROZEN_V0_1
UPSTREAM_DENOMINATOR_CERTIFICATION = REQUIRED
PARENT_POPULATION_EXACT_MATCH = REQUIRED
RUNTIME_D1_IMPLEMENTATION = NOT_IMPLEMENTED
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.


## Selected-plan linkage hardening — TI-519

The earlier generation expectation accepted a caller-supplied selectedPlanSetHash.

This is too permissive:
a caller could supply a hash without proving that its plan symbols match the Selected parent set.

Frozen correction:

- buildFormalGenerationExpectation accepts selectedPlanReceipts, not an arbitrary hash string;
- it runs assessSelectedParentPlanLink internally;
- selectedPlanSetHash is read from the verified receipt bundle;
- missing selected-plan receipt bundle is invalid;
- a Selected parent / plan symbol mismatch invalidates generation expectation before publication.

Even a zero-selected generation should use a valid empty selected-plan receipt bundle rather than null/unknown if future production implements this contract.

This correction is research-only and occurs before runtime persistence.
