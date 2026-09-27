# System 2 Decision Clock（決策時間點）Coverage Finalization（覆蓋最終化）V0.3

Updated: 2026-09-28 Asia/Taipei  
Status: PREREGISTERED BEFORE FIRST PROSPECTIVE TRADING-DATE EVIDENCE / RESEARCH-ONLY

## Problem

The prospective collector starts around 13:25 Asia/Taipei and may poll for up to roughly the configured bounded observation window. GitHub Actions（GitHub 自動化）scheduled jobs can also start later than their nominal cron time.

If the readiness aggregator audits the current Taiwan date while that day's collector is still running, a temporarily absent completed run/artifact can be mislabeled as a permanent trading-day gap.

A later aggregation would then appear to "repair" the gap after the collector completes. That is operational timing noise, not an immutable evidence failure.

## Finalized coverage window

Promotion-grade coverage now uses a one-calendar-day finalization lag.

Default:

`coverageThroughDate = previous Taipei calendar date`

The current Taipei date is never part of the finalized denominator.

Current/future-date runs and artifacts are reported as pending diagnostics only. They cannot:

- create a finalized missing-run or missing-artifact gap;
- enter readiness counts early;
- influence the candidate Decision Clock before their coverage date is finalized.

## Pending diagnostics

The aggregation receipt records:

- `coverageFinalization.version=S2_DECISION_CLOCK_COVERAGE_FINALIZATION_V0_3`;
- `lagCalendarDays=1`;
- finalized coverage start/through dates;
- pending unfinalized runs;
- pending unfinalized artifacts;
- pre-coverage-window run count;
- explicit booleans that unfinalized dates cannot create finalized gaps or enter readiness.

An artifact from an unfinalized date is not downloaded for readiness evaluation. This prevents malformed or incomplete current-day diagnostic artifacts from contaminating a previously finalized window.

## Readiness schedule

The read-only readiness aggregation schedule is moved from same-day 16:30 Asia/Taipei weekdays to next-morning 08:30 Asia/Taipei every calendar day:

`cron: "30 0 * * *"`

This does not change the prospective collector schedule.

The daily run audits only through the previous Taipei calendar date. Weekend/holiday dates remain handled by the official TWSE trading-calendar gate and do not become trading-day gaps.

The next-morning schedule also means Friday evidence can be finalized on Saturday instead of waiting until Monday.

## Evidence chronology

The underlying measurement still must be captured prospectively on the actual trading date.

The one-day lag applies only to aggregation/finalization, not to data collection.

Therefore:

- same-day first-known evidence remains immutable;
- historical retrieval is still prohibited as a substitute;
- a date is merely counted one day later after the collection window is safely over.

## Interaction with attempt-one provenance

Coverage Finalization V0.3 works with Attempt-One Provenance V0.4:

- first finalize the date window;
- within each finalized scheduled run, attempt one remains the immutable anchor;
- later rerun attempts remain diagnostic only.

No current-day rerun can repair, invalidate or prematurely enter a finalized sample.

## Safety

The readiness workflow remains:

- GitHub read-only;
- official trading-calendar GET-only;
- no Cloudflare secret;
- no D1 write;
- no System 2 Worker mutation;
- no Worker Cron authorization;
- no System 1/V8 runtime use.

System 2 capture remains disabled.
