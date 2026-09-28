# System 2 First Prospective Decision Clock Day Drill V0.1

Updated: 2026-09-28 Asia/Taipei  
Status: PRE-FIRST-SAMPLE INTEGRATION DRILL / RESEARCH-ONLY

## Purpose

The first ordinary eligible prospective trading date is 2026-09-29.

Before that real same-day evidence arrives, this drill verifies the already-frozen Decision Clock contracts as one integrated chain:

A1 TWSE / A1 TPEx observed readiness  
+ B2 same-session readiness  
+ A5 periodic availability by candidate boundary  
→ daily evidence V0.2.1 semantics  
→ V0.3 provenance bundle  
→ immutable coverage-qualified aggregation  
→ owner-review packet  
→ finalized-date acceptance audit.

The drill uses synthetic timestamps only. It does not count as prospective evidence and cannot increase any readiness counter.

## Positive precision scenario

Synthetic observation pattern:

- market close: 13:30 Asia/Taipei;
- A1 TWSE: NOT_READY at 13:30, READY at 13:35;
- A1 TPEx: NOT_READY at 13:30, READY at 13:35;
- B2: NOT_READY at 13:30, READY at 13:35;
- A5: already prospectively observed READY at 13:25.

Expected result:

- required evidence complete;
- all same-session precision brackets = 5 minutes;
- worst observed upper bound = 5 minutes after close;
- +15 minute safety buffer;
- rounded candidate = 13:50 Asia/Taipei;
- A5 available by candidate boundary = true;
- one coverage-qualified promotion-grade date;
- finalized-date acceptance = `COMPLETE_PRECISE`;
- readiness remains `INSUFFICIENT_DATES` because one date is far below the 10/20-date gates;
- exact Decision Clock, Worker Cron and capture remain unauthorized.

## Already-ready / imprecise scenario

Synthetic observation pattern:

- first A1/B2 observation is already READY;
- no prior explicit NOT_READY observation exists.

Expected result:

- required evidence complete;
- date counts toward the independent-date sample;
- precision eligibility = false;
- finalized-date acceptance = `COMPLETE_IMPRECISE`;
- the date does not count toward the all-precise set.

This preserves the preregistered rule that a delayed scheduler cannot invent a <=5-minute publication interval from a first observation that is already READY.

## What this drill proves

The integration test confirms that the same date cannot be interpreted differently by the daily evidence builder, coverage-qualified aggregator and finalized-date acceptance audit.

It also confirms that a single good-looking date cannot authorize anything:

- `reviewState=ACCUMULATING`;
- `exactDecisionClockAuthorized=false`;
- `workerCronAuthorized=false`;
- `captureEnabled=false`.

## What this drill does not prove

It does not prove:

- actual 2026-09-29 source arrival times;
- official publication timestamps;
- future GitHub scheduler timeliness;
- 10-date provisional readiness;
- 20-date freeze readiness;
- any strategy alpha or stock-selection performance.

Only real same-day scheduled observations can supply those future evidence points.

## Safety

- no market HTTP request;
- no Cloudflare request;
- no D1 write;
- no Worker mutation;
- no Worker Cron authorization;
- no System 1/V8 runtime use;
- no historical evidence substitution.

The drill is a Class A integration test only.
