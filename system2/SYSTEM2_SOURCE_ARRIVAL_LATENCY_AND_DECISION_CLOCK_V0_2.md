# System 2 Source Arrival Latency（資料來源到達延遲）與 Decision Clock（決策時間點）契約 V0.2

Updated: 2026-09-27 Asia/Taipei
Status: PROSPECTIVE EVIDENCE COLLECTION ARMED / EXACT DECISION CLOCK UNFROZEN / SYSTEM2 WORKER CAPTURE DISABLED
Scope: System 2 isolated research only

## What V0.2 changes

V0.1 established the A1/A2/A3/A6 official GET-only measurement semantics and the 10-date / 20-date preregistration gates.

V0.2 adds the two previously blocked dependencies without weakening V0.1:

- A5_QUARTERLY_FINANCIALS: prospective filing-vintage observer using official EPS/profit datasets;
- B2_INDUSTRY_THESIS_PROSPECTIVE: deterministic same-day industry breadth/participation snapshot derived from official company profiles + same-day TWSE/TPEx close rows.

V0.2 also adds an isolated GitHub Actions Research Schedule（GitHub Actions研究排程） for evidence collection. This is not the System 2 Worker Cron（Worker自動排程） and does not arm capture.

## A5 filing-vintage semantics

Observer:
`runtime/a5_filing_vintage_observer.mjs`

Official source classes:
- TWSE/TPEx EPS;
- TWSE/TPEx profitability/income data.

What can be claimed:
- System 2 observed a market-wide quarterly vintage by `observedAt`;
- coverage and EPS/profit vintage consistency met the observer contract.

What cannot be claimed:
- exact company filing time;
- exact market publication timestamp;
- historical first-known time before the observer existed.

A5 is therefore a PIT-safe prospective observation boundary, not a reconstructed historical event clock.

## B2 prospective derived-industry snapshot semantics

Observer:
`runtime/b2_industry_snapshot_observer.mjs`

Inputs:
- current official company-profile industry classification;
- same-date official TWSE/TPEx daily close rows.

Derived descriptive fields include:
- member count;
- up/down/flat breadth;
- net breadth share;
- mean change when source fields permit;
- total trading value when source fields permit.

Important:
- this observer does not assign an INDUSTRY_TREND bullish/bearish thesis;
- it does not score a strategy;
- today's classification is not backfilled into historical dates;
- profile classification provenance remains prospectively observed.

## Daily V0.2 clock constraints

For a date to become complete V0.2 decision-clock evidence:

1. official calendar says it is a trading date;
2. A1 TWSE daily close reaches READY;
3. A1 TPEx daily close reaches READY;
4. A5 observer is coverage-eligible on the same prospective date;
5. B2 derived snapshot is coverage-eligible on the same prospective date.

Clock-latency constraints are:
- A1 TWSE daily close;
- A1 TPEx daily close;
- B2 derived same-day industry snapshot.

A5 must be observed before the decision boundary, but because it is periodic rather than a same-session close publication, its already-available market-wide vintage is not automatically treated as an after-close latency constraint.

## Precision rule

For freeze-eligibility, every same-session clock constraint must have:

- a prior observed NOT_READY state;
- a later READY state;
- observation interval <= 5 minutes.

If a GitHub scheduled job starts late and the first observation is already READY:
- the date can still prove availability by that time;
- it cannot claim a <=5-minute publication interval;
- `precisionEligible=false`.

No publication timestamp is inferred from scheduler start time.

## Research candidate time

For each complete/precise date:

`candidate lower operational clock = worst observed A1/B2 READY upper bound + 15-minute safety buffer, rounded up to next 5 minutes`.

Across dates:
- 10 independent complete dates => at most PROVISIONAL_ELIGIBLE（暫定符合研究資格）;
- 20 independent complete dates with precision on all included dates => may become FREEZE_ELIGIBLE（可提交凍結審查）.

Even then:
- `candidateIsAuthorizedDecisionClock=false`;
- `exactCronFrozen=false`;
- `cronAuthorized=false`;
- `captureEnabled=false`.

Owner review remains mandatory before an exact decision clock is frozen.

## Scheduled research collection

Workflow:
`.github/workflows/system2-prospective-clock-evidence-readonly.yml`

Research schedule:
- `05:25 UTC` Monday-Friday = intended `13:25 Asia/Taipei`;
- official TWSE calendar gate is authoritative;
- weekends/official holidays are skipped;
- actual probe timestamps, not scheduled time, are evidence;
- GitHub scheduling delay can only reduce precision, never manufacture precision.

On a trading date the workflow runs two GET-only lanes in parallel:
- A1 source-arrival polling;
- A5/B2 dependency polling.

Both use bounded 5-minute observations and stop early when their required state is reached.

A final artifact-only daily evidence bundle joins the two lanes.

## Isolation boundary

The scheduled research workflow:
- has `contents: read` only;
- uses no Cloudflare secret;
- writes no D1;
- calls no System 2 Worker;
- calls no System 1/V8 runtime;
- changes no candidate/rank/position state;
- sends no notification;
- cannot arm System 2 Worker Cron.

This GitHub Actions research schedule must never be described as the production/Shadow capture Cron.

## Operational evidence so far

2026-09-27 non-trading smoke:
- A5 transport and market-wide coverage: PASS;
- B2: INCOMPLETE, as expected because no same-date daily close existed;
- prospective evidence eligibility: false;
- no mutation guard: PASS.

2026-09-28 is an official TWSE holiday.

The earliest ordinary prospective trading date for V0.2 evidence is 2026-09-29.

## Current conclusion

`DECISION_CLOCK_STATUS = UNFROZEN / DEPENDENCY_OBSERVERS_IMPLEMENTED / WAITING_PROSPECTIVE_TRADING_DATES`

No exact after-close decision time is currently approved.
