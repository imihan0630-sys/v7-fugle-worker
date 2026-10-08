# System 2 Bounded Event-to-Version Linkage — Low-Volume Lanes V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / IMPLEMENTATION_PENDING_PHYSICAL_RESULT
System 1 Formal Core: LOCKED

## Purpose

Continue S2-07 from the physically accepted 23-event low-volume revision-history census.

The prior census proved issuer-history observability for all 23 frozen final events. It did not prove that every issuer-side action-family disclosure belongs to the exact final-result event, nor that correction/cancellation history is exhaustive.

This tranche creates an explicit event-to-version linkage receipt without converting same-company/same-family history into false exact linkage.

## Strict linkage rule

A MOPS issuer-history row is treated as strictly linked only when:
- the symbol and action family already match the final event;
- the issuer query has complete bounded 2025+2026 transport evidence;
- the row text explicitly contains the final event effective date in addition to, not merely as, the disclosure-row date;
- the row has an auditable source-reported version key based on disclosure date/time/sequence.

Rows that are same-company/same-family but do not meet that rule remain `HISTORY_BUNDLE_ONLY_UNRESOLVED`.

If the disclosure-row date itself equals the effective date, the date occurrence is recorded as ambiguous rather than used as exact linkage evidence.

## Version-chain evidence

Strictly linked rows are grouped by a normalized subject fingerprint. The receipt preserves:
- row text hashes rather than mutable raw prose;
- source-reported disclosure date/time/sequence version keys;
- original vs correction/revision hints;
- cancellation hints;
- duplicate or incomplete version-key ambiguity;
- per-event linkage hash;
- aggregate linkage-universe hash.

## Query-integrity evidence

For the bounded low-volume probe, each symbol must have exactly one successful HTTP 200 observation for each expected company-year query (2025 and 2026), with the same two-year scope used by PR #610.

Missing, duplicate, or failed year observations fail closed as `QUERY_INTEGRITY_INCOMPLETE`.

## Non-promotion boundary

Even if all 23 events become strictly linkable, this V0.1 receipt does not automatically set:
- `boundedRevisionHistoryCoverageComplete`;
- `correctionHistoryComplete`;
- `cancellationHistoryComplete`;
- `authorityRevisionCoverageComplete`;
- `revisionCoverageComplete`;
- exact public knownAt;
- `noEventMayBeClaimed`;
- technical continuity.

Negative no-revision/no-cancellation claims remain unqualified in this tranche. A later gate must define and physically validate their semantics before any completeness promotion.

No data mutation, strategy scoring, final selection, live push, capital, orders, or System 1 runtime changes are authorized.
