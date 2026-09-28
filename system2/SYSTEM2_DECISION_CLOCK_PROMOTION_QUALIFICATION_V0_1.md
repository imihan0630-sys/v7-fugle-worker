# System 2 Decision Clock（決策時間點）Promotion Qualification（升級資格）V0.1

Updated: 2026-09-28 Asia/Taipei  
Status: PREREGISTERED BEFORE FIRST PROSPECTIVE TRADING-DATE EVIDENCE / RESEARCH-ONLY

## Problem

Artifact existence is not enough to make a trading date promotion-grade.

A later scheduled run can produce a valid-looking attempt-one artifact even when the immutable coverage anchor for that market date is a different earlier scheduled run that failed or produced no valid daily artifact.

If aggregation counts that later artifact in `independentTradingDates`, the readiness sample can be numerically inflated even though the date is already blocked by coverage integrity.

The owner-review gate would still remain blocked, but the intermediate 10-date / 20-date counters would become semantically misleading.

## V0.1 qualification rule

A selected scheduled artifact counts toward promotion-grade readiness only when all of the following are true:

1. the official coverage row says the date is a trading day;
2. the immutable coverage anchor has exactly one valid daily artifact;
3. the anchor run conclusion is `success`;
4. the selected artifact's run ID equals the coverage anchor run ID;
5. the artifact is `run_attempt=1`.

Only those coverage-qualified artifacts are passed into `assessDecisionClockReadinessV02()`.

## Diagnostic separation

Attempt-one scheduled artifacts that exist but fail coverage qualification are preserved as:

`coverageExcludedScheduledArtifacts`

They remain auditable diagnostics and are never silently deleted.

An eligible coverage row with no matching selected artifact is a hard provenance mismatch:

`COVERAGE_ARTIFACT_PROVENANCE_MISMATCH`

and forces:

- `promotionCoverageComplete=false`;
- `promotionReadinessStatus=COVERAGE_ARTIFACT_PROVENANCE_MISMATCH`;
- owner-review blocker `COVERAGE_ARTIFACT_PROVENANCE_MISMATCH`.

## Count semantics

After V0.1:

- `attemptOneScheduledArtifactCount` = all scheduled attempt-one artifact candidates;
- `promotionEligibleScheduledArtifactCount` = coverage-qualified selected artifacts only;
- `promotionGradeDateCount` = coverage-qualified selected market dates only;
- `readiness.independentTradingDates` = the same promotion-grade date set.

Therefore an artifact from a later scheduled run cannot make a failed coverage-anchor date appear to contribute to the 10-date or 20-date gates.

## Collector consistency

Collector-contract consistency and A5 boundary checks are computed over the same coverage-qualified promotion sample rather than over artifacts that are already excluded by immutable coverage.

This prevents excluded diagnostics from contaminating the active sample's collector-fingerprint set.

## Safety

This is a research-only evidence-accounting correction.

It does not:

- change any System 2 strategy/factor/ranking;
- enable System 2 capture;
- authorize Worker Cron;
- write D1;
- modify System 1/V8 Formal Core;
- use outcome or return data.

The rule is fixed while the prospective promotion-grade date count is still zero.
