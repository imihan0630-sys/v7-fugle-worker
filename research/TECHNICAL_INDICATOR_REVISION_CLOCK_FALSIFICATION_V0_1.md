# D03 revision-clock falsification v0.1

Updated: 2026-09-28 Asia/Taipei. Status: RESEARCH_ONLY / OUTCOME_BLIND / FORMAL_LOCKED.

## Question and positive mechanism

Could a correctly changed source digest still allow a later provider correction into an earlier decision-time replay? A content-bound digest detects changed bytes, but it says nothing about when those bytes first became available. Reliable point-in-time (PIT, 時點一致性) reconstruction needs both content identity and a version-specific availability clock. These are complementary checks: content binding alone does not establish time, and a timestamp asserted by the same untrusted adapter does not establish source authenticity.

## TI-410: independent negative witness

The executable `test_technical_indicator_revision_clock_falsification_v0_1.mjs` creates 50 synthetic bars and a decision timestamp of March 1. It revises the last bar's high, gives it a distinct raw identity and digest, and marks this hypothetical correction as first known and captured on March 2. It leaves the context's earlier `sourceAvailableAt` and parent receipt unchanged. Both old and revised windows pass the isolated guard as `VALID`, despite the revised bar's first-known and capture times being later than the decision. KD changes. Unlike TI-409, the asserted digest changes with the price; this witnesses a *revision-time binding* omission, not the earlier unchanged-hash omission. The test does not authenticate a real digest or establish a real provider correction.

The guard checks one context-level `sourceAvailableAt <= asOf` and nonempty row hashes. It never evaluates a per-version first-known/capture clock or proves that the parent and continuity receipts commit to the exact set of row versions. Thus a parent receipt string can remain constant while the calculation uses a new revision. Merely adding row timestamps to an untrusted record would leave a forgery path; the upstream source owner must attest both availability and content in an immutable receipt before the technical indicator observer can verify the binding.

## Counterargument and necessary distinctions

A legitimate post-decision correction is useful for present-day analysis, and adjusted OHLC may properly change across a corporate action. It should be a new version with raw-to-transformed ancestry, and it may be used for a later decision whose cutoff permits it. It cannot silently replace the version seen at the earlier decision. Conversely, a provider may publish a bar before the decision but our system capture it later. A defensible retrospective study must specify whether eligibility requires actual capture by the decision or independently provable contemporaneous availability; do not backdate a locally captured version from the provider's later assertion. Corrections lacking trustworthy first-known evidence stay `UNKNOWN`, not automatically fraudulent or a zero signal.

Minimum upstream handoff: immutable per-bar raw receipt with canonical bytes/field presence and source identity; content-bound digest; provider revision identifier where available; independently evidenced publication or first-known timestamp; local capture timestamp; previous-version link; and an exact parent-generation commitment to the ordered row-version set. A separate derived receipt binds adjustment-event vintage, factor/code version and the raw ancestor for each transformed bar. Verify `firstKnownAt <= decision cutoff` and the applicable capture rule for **each** row version, not only one window-level timestamp. Ambiguous timezone or date-only publication data must remain `UNKNOWN` until the source clock semantics are certified. Compare each transformed window with certified sessions and event versions before estimating false rejection rates.

## Evidence limits and continuation

This is isolated synthetic QA with no actual OHLC coverage, provider corrections, measured rejection denominator, runtime capture, returns, OOS (樣本外), costs, or incremental indicator value. Existing shared continuity documents state timestamp requirements but do not provide an independently attested live per-field receipt in this D03 guard. Formula QA remains separate from market-efficacy evidence. No candidate promotion, Worker wiring or Formal Core change follows.

Verification: run the new revision-clock test plus existing source-guard and TI-409 tests; all pass. Next obtain a permissioned, outcome-blind source sample and version clock contract from the shared source owner; measure missing/corrected OHLC by provider, session, symbol and corporate-action boundary. Then join exact immutable parent generation to every indicator child status, measure runtime costs, and only afterward consider a Class-B prospective capture proposal. TI-005/TI-006 incremental value remains blocked until PIT and OOS evidence exists.
