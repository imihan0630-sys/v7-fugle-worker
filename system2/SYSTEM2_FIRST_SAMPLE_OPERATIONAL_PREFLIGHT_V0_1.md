# System 2 First Sample Operational Preflight（首筆樣本作業前檢查）V0.1

Updated: 2026-09-28 Asia/Taipei  
Status: READ-ONLY / PRE-FIRST-SAMPLE / NO EVIDENCE CREATION

## Purpose

The first ordinary eligible prospective Decision Clock（決策時間點）trading date is 2026-09-29.

The collector itself is intentionally frozen before that session. The remaining operational risk is not strategy logic; it is a preventable infrastructure/configuration failure immediately before the scheduled 13:25 Asia/Taipei collection window.

V0.1 therefore adds a separate read-only preflight at 12:45 Asia/Taipei on weekdays.

## What the preflight verifies

The preflight performs only read-only checks:

1. resolves the current Taipei market date;
2. queries the official TWSE calendar using the existing read-only calendar gate;
3. reruns Collector Freeze Guard V0.1;
4. reruns the prospective collector schedule-contract guard;
5. queries GitHub Actions metadata for the collector workflow and requires:
   - exact workflow path;
   - exact workflow name;
   - `state=active`;
6. produces a separate operational-preflight artifact.

## What it does not do

The preflight does not:

- query A1/A5/B2 market evidence;
- create a Decision Clock daily evidence bundle;
- increment any prospective readiness counter;
- write D1;
- call or modify the System 2 Worker;
- enable capture;
- authorize Worker Cron;
- call System 1/V8 runtime;
- use Cloudflare credentials.

It is an operational health receipt only.

## Schedule

GitHub Actions Research Schedule（研究排程）:

`04:45 UTC Monday-Friday = 12:45 Asia/Taipei`

The prospective collector remains unchanged at:

`05:25 UTC Monday-Friday = intended 13:25 Asia/Taipei`

The 40-minute separation provides an early warning window without changing the evidence collection clock.

## Workflow-active check

Script:

`system2/scripts/check_prospective_collector_workflow_readonly.mjs`

It calls the GitHub Actions workflow metadata endpoint with the built-in `github.token` and `actions: read` permission.

Promotion preflight requires:

- expected workflow filename;
- expected repository path;
- expected workflow display name;
- workflow state `active`.

An API/source error or disabled/renamed workflow fails the preflight closed.

## Artifact

The workflow uploads:

`system2-first-sample-preflight-<market_date>-<run_id>`

with 30-day retention.

The receipt explicitly states:

- official trading-day result;
- collector-freeze guard PASS;
- collector schedule guard PASS;
- workflow active/preflight eligibility;
- prospective evidence created = false;
- exact Decision Clock authorized = false;
- Worker Cron authorized = false;
- capture enabled = false.

## CI protection

System2 Research CI now triggers when the preflight workflow itself changes, in addition to the prospective collector workflow.

This prevents the operational guard from being silently edited without the System2 research test suite.

## Safety

This is Class A research infrastructure observability.

It does not change the 13-file collector contract or its frozen hash baseline, so the preregistered prospective evidence semantics remain unchanged.
