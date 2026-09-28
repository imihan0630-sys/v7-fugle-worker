# System 2 Decision Clock（決策時間點）Finalized-Date Acceptance（最終化日期驗收）V0.1

Updated: 2026-09-28 Asia/Taipei  
Status: PREREGISTERED BEFORE FIRST PROSPECTIVE TRADING-DATE EVIDENCE / RESEARCH-ONLY

## Purpose

Task 14 requires accumulating same-day prospective Decision Clock evidence without retrospectively repairing or overstating it.

Coverage, provenance and readiness are already computed separately. V0.1 adds a compact read-only acceptance receipt for the latest finalized market date so each date has one explicit answer:

- did the date count toward the independent-date sample?
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
  - counts toward both independent-date and precision-date samples.

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
  - required A1/A5/B2 evidence is incomplete.

- `A5_NOT_AVAILABLE_BY_CANDIDATE`
  - A5 was first observed after the computed candidate boundary.

For non-trading or not-yet-finalized dates:

- `NON_TRADING_DAY_SKIP`;
- `NOT_IN_FINALIZED_WINDOW`.

## Independent-date invariant

The acceptance receipt recomputes whether the target date should count toward the independent-date sample and compares that result with:

`aggregation.promotionGradeMarketDates`

Any disagreement throws a hard audit error.

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
- whether it counts toward independent dates;
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
