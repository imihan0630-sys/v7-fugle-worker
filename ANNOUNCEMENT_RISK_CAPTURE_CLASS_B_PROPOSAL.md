# ANNOUNCEMENT_RISK — Prospective Evidence Capture Proposal

Updated: 2026-09-27 Asia/Taipei  
Status: CLASS-B PROPOSAL ONLY / NOT IMPLEMENTED  
Formal Core: LOCKED

## Minimum receipt

Unit:
`scanDate x decisionGeneration x sourceFetchGeneration`.

Source receipt:
- TWSE endpoint id/version;
- TPEx endpoint id/version;
- fetchStartedAt / fetchCompletedAt;
- HTTP success state per market;
- raw response hash per market;
- raw row count per market;
- parser/schema version;
- retained 30-day row count;
- retained unique-symbol count;
- validation result and validation version.

Per-symbol overlay:
- parent Formal-reach state;
- GENERAL/THOUSAND pool;
- retained official event rows with stable source id if available, date and exact title;
- exact lexical-match boolean;
- exact matched keyword(s);
- event semantic/resolution label only if independently sourced; otherwise UNKNOWN.

Parent linkage:
- immutable decision generation;
- full parent keyset/fingerprint;
- exact Formal/observer version;
- exact announcement-regex version.

## Guards

- Zero events is allowed only as an observed zero with positive source-fetch receipt, never inferred from missing evidence.
- No missing row becomes a no-event fact without complete parent/source reconciliation.
- No historical current-feed reconstruction is relabeled as first-known evidence.
- No outcome field is stored in the selection-time parent.
- Capture failure must not change Formal behavior.

## Engineering boundary

The current sync process already obtains the source payloads. Reusing their transport metadata/hash in a research receipt can add zero new source calls, but shared ingestion/D1 persistence is Class B and requires owner approval.

Changing the regex, 30-day window, event categories, source dependency or Formal veto behavior is Class C.

No implementation is performed by this proposal.
