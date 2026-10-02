# System 2 Decision Clock（決策時間點）A5 Boundary Integrity（A5 邊界完整性）V0.1

Updated: 2026-09-28 Asia/Taipei  
Status: PREREGISTERED BEFORE FIRST PROSPECTIVE TRADING-DATE EVIDENCE / RESEARCH-ONLY

## Purpose

A5_QUARTERLY_FINANCIALS（季度財務）is a periodic required dependency, not a same-session close-latency constraint.

That distinction means A5 should not normally determine the after-close Decision Clock candidate time. However, a date must not be counted as complete if A5 was first observed only after the candidate Decision Clock boundary.

Without this rule, an unusual A5 outage or late recovery could create a logically impossible daily sample: the evidence bundle would claim that a candidate time such as 14:00 was sufficient even though A5 did not become available until 14:10.

## Candidate construction

The same-session candidate remains determined only by the required same-session clock constraints:

- A1 TWSE daily close;
- A1 TPEx daily close;
- B2 prospective industry snapshot.

The candidate remains:

worst same-session required upper bound  
+ 15-minute safety buffer  
+ round up to next 5 minutes.

A5 is deliberately excluded from this latency maximum because it is periodic rather than a same-session publication process.

## A5 boundary rule

After the same-session candidate timestamp is computed, the daily evidence checks:

`A5 firstReadyAt <= candidateTimestamp`

A5 must also have valid prospective dependency coverage and an observed READY state.

The evidence now records:

- `evidenceSemanticsVersion=S2_DECISION_CLOCK_DAILY_EVIDENCE_SEMANTICS_V0_2_1`;
- `sameSessionClockReady`;
- `a5ObservedAtDecisionBoundary`;
- `a5AvailableByCandidate`;
- `candidateTimestamp`.

If A5 is first observed after the candidate timestamp:

- `a5AvailableByCandidate=false`;
- `requiredReady=false`;
- `precisionEligible=false`;
- the same-session candidate time remains visible for diagnosis;
- the date cannot count as a complete readiness date.

A5 is not allowed to silently push or retroactively justify a nicer Decision Clock candidate.

## Aggregation and owner review

Aggregation preserves `a5BoundaryFailureDates`.

Any selected promotion-grade artifact with `a5AvailableByCandidate != true` is disclosed in the owner-review packet and adds blocker:

`A5_NOT_AVAILABLE_BY_CANDIDATE`

This is independent of artifact coverage and collector-fingerprint integrity.

## Why this is not an alpha rule

This rule uses only source availability and decision-time chronology.

It does not inspect:

- selected stocks;
- returns;
- MFE/MAE;
- strategy performance;
- later market outcomes.

Therefore the rule is fixed before the first prospective trading-date sample and cannot be tuned toward a preferred return result.

## Collector provenance interaction

Decision Clock Collector Provenance（擷取器來源證明）V0.3 fingerprints the daily evidence builder and scheduled workflows.

This pre-evidence change therefore creates a new collector fingerprint automatically. Because the promotion-grade evidence count is still zero, no prior prospective sample is being mixed or discarded.

After the first promotion-grade sample exists, a comparable material semantic change would require a separately preregistered evidence epoch/version.

## Safety invariants

- System 2 Worker capture remains false.
- System 2 Worker Cron remains unauthorized / zero.
- No D1 write is performed.
- No Cloudflare runtime mutation is performed.
- No System 1/V8 runtime or Formal Core change is made.
- Historical retrieval cannot be relabeled as prospective A5 availability.
- Exact Decision Clock authorization remains false even if future readiness gates pass.


## Research diagnostic clarification — V0.2

2026-10-02 D16 review identified an attribution ambiguity in the aggregation/review layer.

Original safety semantics remain unchanged:
- same-session candidate time is determined by A1 TWSE + A1 TPEx + B2;
- A5 is periodic;
- when a same-session candidate exists, A5 must have been prospectively observed no later than that candidate;
- late A5 keeps `requiredReady=false` and `precisionEligible=false`.

Diagnostic correction:
- a date with `sameSessionClockReady=false` or `candidateTimestamp=null` has no candidate boundary against which A5 lateness can be evaluated;
- such a date remains incomplete, but is not truthfully an `A5_NOT_AVAILABLE_BY_CANDIDATE` event.

Research aggregation now separates:
- `a5BoundaryEvaluableDates`;
- `a5BoundaryPassDates`;
- `a5BoundaryFailureDates`;
- `a5BoundaryNotEvaluableDates`.

Only an evaluable date with:
- same-session candidate present; and
- `a5AvailableByCandidate=false`

enters `a5BoundaryFailureDates`.

Owner-review continues to block on true A5 boundary failures.
No-candidate dates remain blocked through Decision Clock readiness and are reported as not evaluable for A5 boundary attribution.

This is a provenance/failure-taxonomy correction only.
It does not:
- weaken A5 requirements;
- change candidate timing;
- authorize the exact Decision Clock;
- authorize Worker Cron/capture;
- change any strategy/rank/capital/order/signal behavior.
