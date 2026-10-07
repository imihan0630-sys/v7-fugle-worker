# System1 Target/RR Child Capture Prototype — 2026-10-07

Status: CLASS-A PROTOTYPE / CLASS-B WIRING PROPOSAL ONLY / FORMAL CORE LOCKED

## What changed in the diagnosis

The major prerequisite once described as missing is now satisfied by V8.17:

- immutable C1 generation is deployed;
- first-known parent identity is preserved;
- exact per-symbol parent hash is available;
- overlapping research membership exists;
- quality overlays are append-only;
- parent/readback fingerprints are verified.

Therefore H2/H3 no longer require a new shadow architecture.

The remaining problem is narrower:
same-scan Target/RR source inputs exist in memory during the Formal scan, but the C1 projection discards the fields needed to replay resistance-source provenance after the scan.

Current C1 preserves selected target / RR / entry geometry, but not:
- priorHigh60;
- full retained history / dated local pivot candidates;
- raw targetPrice;
- targetPrice source/asOf/capturedAt/PIT eligibility;
- custom enrichment configured/fetch state;
- target search completeness.

## Prototype design

The Class-A prototype consumes:
1. the exact immutable V8.17+ C1 parent;
2. same-scan in-memory feature rows;
3. one secret-safe targetPrice source-state receipt.

It does not call any provider.

For every row that actually reached a target/RR-relevant Formal stage it:
- recomputes priorHigh20/priorHigh60 from same-scan history and compares them with runtime feature values;
- reuses the validated TARGET_RR_AUDIT_OBSERVER_V0_1;
- checks observer entry/stop/selected target against the immutable parent geometry;
- separates TARGET_NULL, LOW_RR, FINAL_GRADE_AFTER_RR_PASS and RR_PASSED;
- classifies TARGET_FOUND / TARGET_NONE_SEARCH_COMPLETE / TARGET_UNKNOWN_SOURCE / TARGET_UNKNOWN_GEOMETRY;
- computes complete full-frame counts before sampling;
- deterministically samples detail by pool × A/B × formalStage × targetStateV2.

## Critical source rule

TARGET_NONE_SEARCH_COMPLETE requires both historical-search completeness and targetPrice-source completeness.

Current generic custom enrichment has no contract that an absent per-symbol targetPrice means the source was completely searched.

Therefore:
- custom source NOT_CONFIGURED -> absence may be source-complete;
- configured source with UNKNOWN_SUBSET_COVERAGE -> absent targetPrice stays TARGET_UNKNOWN_SOURCE;
- configured source with FAILED fetch -> TARGET_UNKNOWN_SOURCE;
- targetPrice present but missing source/asOf/capturedAt/PIT eligibility -> TARGET_UNKNOWN_SOURCE;
- COMPLETE_SYMBOL_COVERAGE is a future explicit source-contract state, never inferred from fetch success.

No source failure or missing field becomes TARGET_NONE.

## Minimal future Class-B runtime delta

No new provider call and no second full parent.

Proposed wiring only:
1. freeze secret-safe targetPrice source state at the existing fetchEnrichment boundary;
2. before C1 feature projection discards raw history/target fields, run the already-validated Target/RR observer against same-scan features;
3. persist one immutable Target/RR receipt header per C1 generation with complete frame counts;
4. persist only deterministic sampled child details keyed to generation + symbol + sampling frame;
5. read back against the exact C1 generation and parentSnapshotHash;
6. fail closed for research and fail open for Formal if child persistence fails.

Suggested storage identities:
- trade_research_target_rr_receipts: generation_id PRIMARY KEY, semantic_fingerprint, receipt_json;
- trade_research_target_rr_children: generation_id + symbol + sampling_frame_id PRIMARY KEY, parent_snapshot_hash, semantic_fingerprint, child_json.

These are children of the existing V8.17 C1 parent, not a replacement parent or independent scoring path.

## Bounded storage

The prototype freezes:
- max 6 detailed children per stratum;
- max 384 detailed children per generation under the 2-pool × 2-channel × 4-stage × 4-state ontology;
- each child < 90 KB;
- header < 90 KB;
- whole header+children bundle < 5 MB.

Full denominator counts are computed before detail sampling.

If a budget is exceeded, research capture fails closed while Formal scan remains unaffected.

## What this does NOT authorize

This prototype does not authorize:
- Worker/D1 production wiring;
- new runtime version;
- target/null/RR rule changes;
- RR substitute for open-sky rows;
- targetPrice source becoming mandatory;
- A/B, Grade, comparator, Top6/3+3, capital, BUY/ADD/REDUCE/SELL/STOP, push or order changes;
- System2 changes.

A future production runtime/schema PR remains Class-B proposal-first and requires a separate owner approval gate.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
