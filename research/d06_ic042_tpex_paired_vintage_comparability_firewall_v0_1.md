# D06 IC-042 — TPEx paired-vintage comparability firewall

Updated: 2026-10-02 Asia/Taipei
Status: OUTCOME-BLIND / PROSPECTIVE_RECEIPT_HARDENED / FORMAL CORE LOCKED

## Continuation basis

This artifact continues IC-040/IC-041. It does not restart D06 and does not treat chat memory as formal evidence.

The official TPEx public Short sale Balance of Margin Trading and SBL contract states that the table is updated approximately twice each evening, at 20:30 and 22:30, with actual timing dependent on completion of end-of-day processing. The table contains margin-short and SBL-short prior balance, daily flow and current balance fields. The SBL-short balance formula/rule vintage changed from 2012-03-19, and the next-business-day SBL short-sale limit rule changed from 2025-05-26.

## IC-041 Day-1 evidence classification

The durable 2026-09-30 EARLY receipt in IC-040 contains 814 parsed unique security codes and five frozen sentinel rows. A valid full-table early-versus-late comparison was not durably preserved with an identical parser, full sorted security-code keyset and canonical normalized-table hash.

Therefore the full-table 2026-09-30 paired-vintage classification is:

- sentinel evidence: EARLY values durably frozen; later equality may be checked only against independently preserved late evidence;
- full-table revision status: PARSER_INCOMPARABLE / UNKNOWN unless both vintages can be compared under the identical-parser contract below;
- an observed row-count difference alone must not be labeled COVERAGE_REVISION;
- no alpha/outcome inference is allowed.

## Missed-vintage rule

For 2026-10-01, no durable 20:30 EARLY receipt exists in latest main. Because the early vintage cannot be reconstructed after the 22:30 update, the date is classified EARLY_MISSED / UNKNOWN and contributes zero independent paired-vintage observations.

Historical/current downloads after the fact may verify source-date values but may not manufacture the missing firstKnownAt or early vintage.

## Hardened identical-parser contract

Starting with the next successfully captured trading date, both EARLY and LATE vintages must use the same parserVersion and schemaVersion and preserve:

- sourceDate, market, exact source/product identity and ruleVintage;
- requestedAt, capturedAt and firstSuccessfulCaptureAt;
- parserVersion, schemaVersion and parseStatus;
- official displayed row count when available;
- parsed unique-key count and duplicate-key count;
- complete sorted security-code keyset;
- sortedKeysetHash;
- normalized full-table payload hash;
- field list / schema hash;
- parse diagnostics and missing-field counts.

Canonical hashing must reuse the repository's shared canonical receipt/hash governance rather than inventing a D06-only hash convention.

## Pair classification

A date may be classified only after both vintages pass the identical-parser contract:

- EXACT_MATCH: identical keyset and identical normalized values.
- VALUE_REVISION: identical comparable key(s) with one or more changed normalized fields.
- COVERAGE_REVISION: validated keyset difference under identical parser/schema.
- PARSER_INCOMPARABLE: parser/schema mismatch or a required comparability artifact is absent.
- EARLY_MISSED / LATE_MISSED: required prospective vintage was not captured in its valid window.
- UNKNOWN: evidence is otherwise insufficient or conflicting.

Missing evidence is never coerced to zero, BAD, exact match or revision.

## Outcome firewall and readiness

- Keep B/C/D/E leverage/shorting/crowding outcomes closed while the receipt lane is being established.
- At least 10 independent valid paired trading dates are required before any stability claim about 20:30 versus 22:30 vintages.
- At least 20 independent valid dates plus common-support/source-quality checks are required before any outcome join.
- Repeated captures on the same sourceDate do not increase independent-date sample size.
- Stable prospective vintages cannot manufacture historical firstKnownAt.
- No scalar crowding score, threshold tuning, System 1/System 2 Formal change or deployment is authorized.

## Exact next continuation

IC-043: on the next trading date with a valid window, capture the TPEx public table after the first ~20:30 update using the hardened identical-parser/canonical-hash contract, then independently capture after ~22:30 and classify the pair. In parallel, continue PF-039 bounded domestic in-kind ETF units-delta + PCF prospective receipts and institutional D5+ maturity without opening outcomes early.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
