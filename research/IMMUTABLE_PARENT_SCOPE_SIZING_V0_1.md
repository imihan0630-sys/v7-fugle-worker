# Immutable Parent Scope / Sizing Measurement V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / MEASUREMENT_CONTRACT_FROZEN / NO_RUNTIME_WRITE
Formal Core: LOCKED

## Purpose

Define how to measure the real per-scan immutable-parent population without guessing from:
- the legacy <=54 sampled Shadow archive;
- HISTORY_CACHE_TARGET=2000;
- remembered market-universe counts.

No Production persistence is implemented.

## TI-451 — Parent count is an observed same-scan set size

For the current proposed parent scope:

PARENT_SET =
all history-admitted featureRows evaluated by the same Formal selector invocation.

Therefore:

parentCount = unique symbols in featureRows,

only after uniqueness and subset checks pass.

The count is not:
- diagnostics.scanned;
- with60Days;
- baseEligible;
- rrEligible;
- fullyQualified;
- selectedCount.

## TI-452 — HISTORY_CACHE_TARGET is not a contractual parent cap

Current code contains:
HISTORY_CACHE_TARGET = 2000.

This is an implementation target for history-cache operations.

It is NOT a frozen business rule saying:
parentCount <= 2000.

Reasons:
- market universe can change;
- cache implementation can change;
- V8.12 reads HISTORY_CACHE_TARGET + 400 in one path;
- parent semantics are defined by actual same-scan featureRows, not a constant.

Therefore prior feasibility wording that used ~2000 as a sizing scenario remains illustrative only.

No storage design may treat 2000 as a hard row cap.

## TI-453 — Two denominators must be measured separately

A. FORMAL_NORMALIZED_TODAY_ROWS:
the current diagnostics.scanned denominator.

B. HISTORY_ADMITTED_FEATURE_ROWS:
the rows that survive V8.12 history-admission gating and enter feature construction/evaluation.

Rows present in A but absent from B remain part of scan-data readiness accounting.

They must not be fabricated into decision-state parents.

## TI-454 — Set-integrity checks precede arithmetic

Required per scan:

- normalized symbol uniqueness;
- featureRows symbol uniqueness;
- every feature symbol exists in normalized-today set;
- explicit count of normalized symbols absent from featureRows;
- market split;
- price-pool split.

If duplicates exist:
SCOPE_QA_FAIL.

If featureRows contain symbols outside the normalized-today set:
SCOPE_QA_FAIL.

A simple count difference is not enough.

## TI-455 — History-blocked count is descriptive unless reasons reconcile

normalizedMinusFeature =
normalized unique symbols - feature unique symbols

may be reported as:
PRE_PARENT_NOT_IN_FEATURE_SET.

Do not automatically label all such rows:
HISTORY_SOURCE_REVALIDATION_REJECTED

unless per-symbol history-admission receipts reconcile the reason.

Reason:
future upstream filters/implementation changes can create other differences.

Date-level historySourceRevalidation summaries remain a separate referenced receipt.

## TI-456 — Parent-scope ID

Each observer run must reference a versioned parent_scope_id.

Technical Indicator promotion-grade v0.1 candidate:

FORMAL_HISTORY_ADMITTED_FEATURE_ROWS_V0_1

Definition:
unique same-scan featureRows after history admission and before Formal fail-fast exclusion sampling.

The parent scope version changes if:
- the inclusion stage changes;
- upstream admission semantics change materially;
- a different population is used.

Do not keep the same scope ID after semantic changes.

## TI-457 — Prospective sizing statistics

Before Class-B owner review, collect on every eligible scan date:

- normalizedTodayCount;
- parentCount;
- preParentNotInFeatureCount;
- parentCoverageRatio;
- parentCount by TWSE/TPEx;
- parentCount by GENERAL/THOUSAND;
- duplicateNormalizedCount;
- duplicateParentCount;
- parentOutsideNormalizedCount;
- historyAdmission summary reference;
- serialized parent bytes avg/p95/max;
- serialized Technical child bytes avg/p95/max;
- D1 rows written/read if a dry-run benchmark environment exists;
- observer CPU/wall time.

Across dates report:
- min;
- median;
- p95;
- max.

No cherry-picking only low-load dates.

## TI-458 — Current evidence boundary

The public Production research dashboard is authorization-protected and returned HTTP 401 through unauthenticated read tooling.

No secret/token is requested for this sizing study.

Therefore:
ACTUAL_PRODUCTION_PARENT_COUNT_DISTRIBUTION = UNKNOWN.

The measurement contract is ready.
Actual prospective values remain unmeasured.

This is preferable to treating remembered counts as verified current evidence.

## Current status

PARENT_SCOPE_ID = FORMAL_HISTORY_ADMITTED_FEATURE_ROWS_V0_1
PARENT_SCOPE_SEMANTICS = FROZEN
PARENT_SET_QA = FROZEN
REAL_PARENT_COUNT_DISTRIBUTION = UNKNOWN
HISTORY_CACHE_TARGET_AS_HARD_CAP = REJECTED
CLASS_B_IMPLEMENTATION = PREMATURE
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Implement pure parent-scope measurement helper with zero market calls / zero D1 writes.
2. Test duplicates, subset violations and market/pool counts.
3. Do not wire it into Production yet.
4. Continue shared infrastructure falsification and keep actual sizing UNKNOWN until prospectively measured through an authorized path.
