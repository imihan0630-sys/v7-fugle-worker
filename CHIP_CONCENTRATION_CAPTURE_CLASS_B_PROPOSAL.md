# TDCC / Chip-Concentration First-Known Capture — Class-B Proposal

Updated: 2026-09-27 Asia/Taipei  
Status: DESIGN_READY / OWNER_APPROVAL_REQUIRED / NOT_IMPLEMENTED  
Formal Core: LOCKED

## Problem

Current Formal selection has two distinct TDCC failure layers:

1. no TDCC quality snapshot for marketDate -> scan-level DATA_INCOMPLETE;
2. globally valid TDCC snapshot but symbol lacks numeric chipConcentration -> stock-level rejection when CHIP_CONCENTRATION_PRESENT is reached.

Current persisted quality JSON proves `asOfDate` and validated stock count, but it does not preserve immutable first-known availability or raw per-symbol omission reasons.

The quality table is same-key UPSERT mutable and `readQualitySnapshot()` returns only `snapshot_json`. Its mutable `updated_at` is not a first-known receipt.

## Proposed additive receipt

Do not replace the operational quality snapshot.

Add an immutable research receipt keyed by:
`dataset=TDCC × marketDate × captureGeneration/receiptId`.

Selection-time fields:

- marketDate;
- server-side `firstKnownAt` / `collectedAt`;
- decision cutoff used by after-market Formal;
- source URL;
- raw payload/source hash;
- TDCC `asOfDate`;
- calendar freshness age;
- raw row count;
- raw source symbol-group count;
- validated symbol count;
- validator version;
- dropped group reasons:
  - incomplete 17-grade set;
  - grade-17 ratio not 100;
  - grade-17 shares nonpositive;
- dataset-fatal validation state when applicable;
- immutable receipt fingerprint.

At scan time, an additive child reconciles against the exact same-generation Formal market keyset:

- market symbol count;
- TDCC covered count;
- no-source-row count;
- incomplete/invalid-group count where known;
- GENERAL / THOUSAND counts;
- pre-chip Formal reach count;
- reached + covered;
- reached + missing;
- parent scan generation/hash.

## PIT rule

`chipAsOfDate <= scanDate` is necessary but not sufficient.

Promotion-grade evidence requires:
`firstKnownAt <= original decision cutoff`.

If firstKnownAt is missing, overwritten, or later than the decision cutoff:
`PIT_AVAILABILITY_UNKNOWN / POST_DECISION_CAPTURE`.

No historical backfill may manufacture first-known availability.

## No behavior change

This receipt must:

- add zero network calls;
- not change TDCC validation;
- not change the 14-day operational freshness window;
- not convert missing concentration to zero;
- not change chipConcentration/institutionalScore;
- not alter A/B, gate order, rank, quota, capital, signals or push;
- not make a previously failing scan pass.

## Acceptance tests

1. Capture enabled/disabled yields byte-equivalent Formal candidate plans.
2. Zero extra source calls.
3. firstKnownAt is server-generated once and immutable.
4. Duplicate receipt identity + different fingerprint => provenance conflict, never overwrite.
5. Raw accepted/dropped counts reconcile to the validated source groups or explicitly UNKNOWN.
6. Same-generation market keyset reconciliation is complete before formal-reach rates are labeled CLEAN.
7. A missing symbol remains missing; no zero/default imputation.
8. Historical mutable v7_quality_snapshots are never rewritten for research repair.
9. Outcome join is impossible unless parent receipt is PIT-clean.

## Governance

- Pure observer/classifier/tests: Class A.
- Additive shared quality-ingest/D1 receipt and scan-keyset child: **Class B, owner approval required**.
- Any change making TDCC optional, changing freshness, changing missing-data rejection or changing score weight: **Class C, owner approval required**.

Status:
`TDCC_FIRST_KNOWN_CAPTURE_PROPOSAL_READY / CLASS_B_OWNER_APPROVAL_REQUIRED / FORMAL_UNCHANGED / OUTCOMES_CLOSED`.

No `FORMAL_OPTIMIZATION_CANDIDATE` exists.
