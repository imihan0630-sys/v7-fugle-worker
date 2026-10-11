# Room 11 D16/D18 partial-identification review boundary

Status: RESEARCH_ONLY; OUTCOMES_CLOSED; FORMAL_CORE_LOCKED.

The existing helper on this branch calculates mathematical bounds for a single frozen exchange/date universe. It is not a live market observation, not a confidence interval, and not a strategy recommendation.

The caller's source and clock flags are assertions rather than cryptographic verification. A separate immutable provenance receipt, exchange/date identity, and source timing audit remain necessary before physical evidence acceptance. UNKNOWN stays UNKNOWN, not zero or negative.

The prior local fallback bundle includes 25 synthetic tests, but those tests have not been committed to this branch. No remote CI pass is claimed.

Exact next: attach reviewable automated tests and a provenance-bound real receipt; reconcile with current main before merging. Do not change D16/D18 maturity or any Formal policy based on this helper.
