# System 2 TWSE Par-Value Starred Candidate Discovery V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY DISCOVERY
System 1 Formal Core: LOCKED

## Purpose

Search for a historical TWSE par-value-change issuer revision chain through a candidate path that is independent from the already-exhausted TWSE par-value final-result event list.

The canonical 5/6 checkpoint leaves exactly one representative-routing gap:

`TWSE_PAR_VALUE_CHANGE_REFERENCE`

The supported TWSE final-result candidate path has already produced:
- complete negative 2020..2026 candidate inspection;
- zero official endpoint events for 2010..2019.

Repeating that route is not authorized.

## Independent candidate universe

TWSE security-short-name rules use `*` as an attribute marker when a stock has no par value or a par value other than NT$10.

V0.1 therefore uses the official current TWSE listed-company CSV and selects only:

- market = TWSE;
- ordinary four-digit stock;
- current `公司簡稱` contains `*`;
- listing date <= 2019-12-31.

This is a **candidate-generation rule only**.

A current star does not prove that the company changed par value after listing.

## Historical issuer scan

For each selected candidate:

- query MOPSOV material-information history;
- only years from max(2010, listing year) through 2019;
- one company-year request at a time;
- stop after the first valid positive chain.

A row is par-value-action relevant only when the subject itself contains a stock/par-value change or par-value exchange semantic.

Generic financial-report references such as `每股面額5元` are explicitly excluded.

A positive requires:

1. an earlier original row;
2. a later correction / amendment / cancellation row;
3. same par-value-change action family;
4. normalized subject stem exact, or conservative containment >= 78%;
5. distinct date/time/sequence version keys.

## Promotion boundary

A positive here is only an issuer-side candidate.

It still cannot become the sixth representative authority lane until an independent official TWSE operational/effective event for the same symbol/action is proven.

If no positive is observed, the result is valid negative evidence and the research path should move toward structural-unavailability disposition or another independent official historical source, not weaker matching.

Always false:
- representativeControlFrozen;
- exchangeOperationalJoinProven;
- authorityRevisionCoverageComplete;
- exact knownAt;
- revisionCoverageComplete;
- NO_EVENT;
- technical continuity;
- all trading authority.
