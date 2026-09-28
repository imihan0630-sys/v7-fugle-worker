# System 2 Decision Clock（決策時間點）Finalized-Date Acceptance（最終化日期驗收）V0.1

Updated: 2026-09-28 Asia/Taipei  
Status: PREREGISTERED BEFORE FIRST PROSPECTIVE TRADING-DATE EVIDENCE / RESEARCH-ONLY

## Purpose

Task 14 requires accumulating same-day prospective Decision Clock evidence without retrospectively repairing or overstating it.

Coverage, provenance and readiness are already computed separately. V0.1 adds a compact read-only acceptance receipt for the latest finalized market date so each date has one explicit answer:

- did the date enter the independent observed-date sample?
- did it also count as a complete required-evidence date?
- did it also count toward the precision-eligible sample?
- if not, which stage rejected it?

The acceptance audit does not modify readiness logic. It verifies that the finalized-date classification agrees with the existing coverage-qualified aggregation.

## Status vocabulary

For an official trading date:

- `COMPLETE_PRECISE`
  - immutable coverage anchor is eligible;
  - selected artifact matches the anchor;
  - required evidence is complete;
  - A5 was available by candidate boundary;
  - precision gate passed;
  - counts toward independent-date, complete-date and precision-date samples.

- `COMPLETE_IMPRECISE`
  - all required evidence is complete;
  - date counts toward the independent-date sample;
  - precision gate did not pass, so it does not count toward the all-precise set.

- `COVERAGE_REJECTED`
  - immutable coverage anchor failed, was missing, had invalid artifact count, or otherwise was not promotion-eligible.

- `PROMOTION_ARTIFACT_MISSING`
  - coverage says the date is eligible but no coverage-qualified selected artifact exists.

- `COVERAGE_ANCHOR_RUN_MISMATCH`
  - selected artifact run ID does not equal the immutable coverage-anchor run ID.

- `NON_ATTEMPT_ONE_SELECTED`
  - only attempt one is permitted.

- `INCOMPLETE_REQUIRED_EVIDENCE`
  - the coverage-qualified scheduled artifact is a genuine independent observed date;
  - required A1/A5/B2 evidence is incomplete;
  - it counts toward the independent observed-date set but not the complete-date or precision-date sets.

- `A5_NOT_AVAILABLE_BY_CANDIDATE`
  - same-session A1/B2 evidence is ready but A5 was first observed after the computed candidate boundary;
  - the date remains an independent observed date but is not complete/precision eligible.

For non-trading or not-yet-finalized dates:

- `NON_TRADING_DAY_SKIP`;
- `NOT_IN_FINALIZED_WINDOW`.

## Independent-date invariant

The acceptance receipt distinguishes three different counters:

- `countsTowardIndependentDate`: the coverage-qualified scheduled date is part of the immutable observed-date set represented by `aggregation.promotionGradeMarketDates`;
- `countsTowardCompleteTradingDate`: required A1/A5/B2 evidence is complete;
- `countsTowardPrecisionEligibleDate`: the complete date also satisfies the preregistered precision rule.

Only the first field is cross-checked against `aggregation.promotionGradeMarketDates`. This matches V0.2 readiness, where `independentTradingDates`, `completeTradingDates` and `precisionEligibleDates` are intentionally distinct.

Any disagreement on independent-date membership throws a hard audit error.

This makes the acceptance audit a cross-check rather than another independent source of truth.

## PIT semantics

The audit explicitly preserves Point-in-Time（時點）semantics from the shared evidence-clock research:

- first READY observation is an observed upper bound, not proof of public publication time;
- `publicationTimestampProven=false`;
- collector capture time is not silently relabeled as source `available_at`;
- same-day date-only availability is not used to prove a cutoff;
- historical substitution remains prohibited.

System 2 therefore continues to use actual prospective observation timestamps for Decision Clock research while avoiding a false claim that those timestamps are official publication times.

## Workflow integration

The read-only Decision Clock readiness workflow now runs:

`system2/scripts/audit_decision_clock_finalized_date_readonly.mjs`

after aggregation.

It publishes a separate 90-day artifact:

`system2-decision-clock-finalized-date-audit-<run_id>`

The readiness summary displays:

- latest finalized date;
- acceptance status;
- whether it counts toward independent observed dates;
- whether it counts toward complete dates;
- whether it counts toward precision dates.

## Safety

The acceptance audit:

- reads only the generated readiness JSON;
- performs no market fetch;
- performs no D1 write;
- performs no Cloudflare Worker mutation;
- does not authorize System 2 Worker Cron;
- does not enable capture;
- does not use System 1/V8 runtime;
- does not inspect stock returns or strategy outcomes.

This is Class A research observability only.


## Pre-first-sample semantic correction

Before the first eligible prospective session, V0.1 was corrected so an incomplete but coverage-qualified scheduled artifact does not make the acceptance audit contradict the aggregation layer.

The immutable date still belongs to the independent observed-date set, while its complete-date and precision-date flags remain false. This preserves inconvenient/incomplete dates instead of dropping them after observation, while keeping the 10-complete / 20-complete-and-precise gates fail-closed.

The correction also makes `A5_NOT_AVAILABLE_BY_CANDIDATE` reachable only when the same-session clock is ready and A5 specifically misses the candidate boundary; broader A1/B2 incompleteness remains `INCOMPLETE_REQUIRED_EVIDENCE`.

No real prospective sample existed when this correction was made.
