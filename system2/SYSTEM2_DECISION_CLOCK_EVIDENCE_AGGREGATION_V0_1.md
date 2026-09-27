# System 2 Decision Clock（決策時間點）Evidence Aggregation（證據彙整）V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH-ONLY / PROSPECTIVE ARTIFACT AGGREGATION / NO CLOCK AUTHORIZATION / NO WORKER CRON

## Purpose

The source-arrival collector now produces one immutable daily evidence bundle per successful same-day research run.

Before prospective dates accumulate, freeze how multiple GitHub Actions artifacts will be selected and aggregated so later performance or latency observations cannot be used to cherry-pick the most favorable run.

## Promotion-grade artifact rule

For each Taiwan market date:

1. only artifacts produced by the scheduled `system2-prospective-clock-evidence-readonly.yml` workflow are eligible for readiness aggregation;
2. manual `workflow_dispatch` artifacts remain diagnostics only;
3. if more than one scheduled artifact exists for the same market date, select the earliest run by `runCreatedAt`, then `runId`, regardless of whether its evidence is favorable;
4. never select a later rerun because it has an earlier observed source time, better precision, or complete required evidence;
5. preserve all excluded duplicate/manual candidates in the aggregation receipt.

This is a provenance rule, not an alpha rule.

## Collector Provenance V0.3

Promotion-grade scheduled evidence must use `S2_DECISION_CLOCK_DAILY_BUNDLE_V0_3` and carry Collector Provenance（擷取器來源證明）V0.3.

The artifact's embedded GitHub workflow run ID, run attempt and workflow SHA must match the GitHub Actions run metadata from which the artifact was downloaded. Any mismatch fails closed.

The underlying daily evidence object remains `S2_DECISION_CLOCK_DAILY_EVIDENCE_V0_2`; V0.3 changes the immutable bundle envelope/provenance, not the already-preregistered readiness math.

Legacy V0.2 bundles may remain manual/diagnostic evidence only. They are not promotion-grade scheduled evidence.

Each promotion-grade selected date also carries a deterministic collector-contract fingerprint over the preregistered source parsing, polling, dependency-observer, calendar-gate, workflow and bundle-construction files. All selected dates used toward the same readiness gate must have one identical fingerprint.

If more than one collector fingerprint is observed, aggregation returns `collectorContractConsistent=false` and blocks promotion as `COLLECTOR_CONTRACT_DRIFT`. The aggregator may not pick the most favorable fingerprint, silently discard inconvenient dates, or pool incompatible collector contracts to reach the 10-date/20-date gates.

A material collector change after evidence begins requires a separately documented/preregistered evidence epoch or contract version. V0.3 does not automatically reset the sample or choose a preferred version.

## Why earliest scheduled artifact

A best-result selection policy would create hidden look-ahead/cherry-picking:

- a later retry could observe a different source state;
- manual runs could start at a more favorable time;
- choosing "the most complete" artifact after observation would condition sample membership on the result.

The earliest scheduled artifact is deterministic before interpreting its evidence.

## Missing-artifact boundary

V0.1 does not infer a missing scheduled artifact as a failed trading date because a scheduled workflow may legitimately stop at the official non-trading-day gate.

Therefore the aggregation receipt separately reports:
- scheduled artifacts observed;
- manual artifacts observed;
- duplicate same-date scheduled artifacts;
- dates represented by promotion-grade bundles.

Coverage Integrity V0.2 now distinguishes:
- official non-trading day;
- no completed scheduled run;
- scheduled run not successful;
- scheduled rerun attempt (run_attempt > 1), which is diagnostic only and cannot become promotion-grade;
- successful scheduled run with no daily artifact;
- successful scheduled run with an invalid daily-artifact count.

The coverage window is generated independently from the observed artifact list, beginning at the preregistered first eligible prospective date (2026-09-29). This prevents a trading date with no scheduled run at all from disappearing from the denominator.

The first scheduled run observed for a Taiwan market date, attempt 1 only, is an immutable daily anchor for coverage. If GitHub later re-runs the same workflow run ID, the aggregator resolves the dedicated attempt-one metadata and uses only attempt-one bundles for promotion-grade selection. Later attempts remain diagnostic only.

A later rerun cannot repair an earlier failed/missing attempt-one anchor, cannot replace attempt one with a more favorable latency result, and cannot invalidate a previously valid attempt-one artifact merely because the run's latest attempt number changed.

The wrapper reports:
- `artifactCoverageAudited`;
- `promotionCoverageComplete`;
- `tradingDayArtifactGaps`;
- `nonTradingScheduledRuns`;
- `coverageIntegrity.failureClassCounts`;
- `coverageIntegrity.tradingDayGapDates`;
- `coverageIntegrity.laterScheduledRunsCannotRepairAnchor=true`;
- `coverageIntegrity.laterRerunAttemptsCannotRepairOrInvalidateAttemptOne=true`;
- `rerunDiagnosticArtifactCount` and `rerunDiagnosticArtifacts`.

A missing bundle on an official trading day blocks promotion-grade readiness as
`SCHEDULED_TRADING_DAY_ARTIFACT_GAPS`.

A missing bundle on an official non-trading day is a legitimate skip.

Even complete coverage still does not authorize the exact clock.

## A5 candidate-boundary integrity

A5_QUARTERLY_FINANCIALS remains a periodic required dependency rather than a same-session latency constraint.

The daily evidence first computes the candidate from A1 TWSE + A1 TPEx + B2, then requires A5 `firstReadyAt <= candidateTimestamp`. If A5 is first observed later, the date stays visible but `requiredReady=false` and cannot count toward readiness.

Aggregation preserves `a5BoundaryFailureDates`; the owner-review packet exposes them explicitly and blocks with `A5_NOT_AVAILABLE_BY_CANDIDATE`.

## Coverage Finalization V0.3

The promotion-grade denominator is finalized with a one-calendar-day lag. By default, aggregation audits only through the previous Taipei calendar date.

Artifacts/runs whose market date is later than `coverageThroughDate` are pending diagnostics only and cannot enter readiness or create a finalized gap. Pending artifacts are not downloaded for readiness evaluation.

The read-only readiness workflow runs at 08:30 Asia/Taipei every calendar day, auditing the previous date through the official TWSE trading-calendar gate. Prospective capture remains same-day; only aggregation is delayed.

## Readiness calculation

The selected promotion-grade daily evidence rows are passed unchanged to:
`assessDecisionClockReadinessV02()`.

Existing preregistered gates remain unchanged:
- 10 complete independent dates -> at most `PROVISIONAL_ELIGIBLE`;
- 20 complete precise independent dates -> may become `FREEZE_ELIGIBLE`;
- required A1/A5/B2 evidence rules remain unchanged;
- +15-minute safety buffer and next-5-minute rounding remain unchanged.

Even `FREEZE_ELIGIBLE` remains:
- candidateIsAuthorizedDecisionClock=false;
- exactCronFrozen=false;
- cronAuthorized=false;
- captureEnabled=false.

## Safety

The aggregation path:
- reads GitHub Actions metadata/artifacts only;
- uses no Cloudflare secret;
- performs no D1 write;
- does not mutate `system2-shadow-research`;
- does not call System 1/V8;
- cannot arm Worker Cron（排程）.

## Current state

No promotion-grade trading-date bundle exists yet.
Earliest ordinary prospective session remains 2026-09-29 according to the current official-calendar research evidence.

The correct action before that date is to preserve the aggregation policy and tooling, not fabricate historical evidence.
