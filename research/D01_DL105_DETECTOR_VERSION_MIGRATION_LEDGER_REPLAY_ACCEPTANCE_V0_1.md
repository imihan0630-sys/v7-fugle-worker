# D01 DL-105 — Detector-Version Migration Ledger and Replay Acceptance V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / VERSION_LEDGER_FROZEN / SDA_002_REMEDIATION / FORMAL_CORE_LOCKED

## Purpose

Freeze one append-only ledger for detector-version changes so a later implementation cannot silently overwrite prior D01 observations or selectively inherit only successful historical episodes.

## Ledger row identity

Each migration row binds:
- detectorFamilyId;
- fromDetectorVersion;
- toDetectorVersion;
- experimentFamilyId;
- parameterFamilyId;
- specificationHashFrom;
- specificationHashTo;
- codeHashFrom;
- codeHashTo;
- detectorSpecFrozenAtFrom;
- detectorSpecFrozenAtTo;
- source semantic contract;
- witness / universe version;
- migrationClass;
- migrationReason;
- outcomeAccessStateAtMigration;
- searchRegistryEntryId.

## Allowed migration reasons

BUG_FIX
SPECIFICATION_CHANGE
NUMERICAL_TOLERANCE_ONLY
SOURCE_SEMANTIC_UPGRADE
SCHEMA_ONLY
PERFORMANCE_REFACTOR_WITH_IDENTICAL_PAYLOAD
UNKNOWN

UNKNOWN remains blocked for promotion-grade use.

## Outcome-access firewall

At migration time, record whether the relevant outcome family was:
- CLOSED;
- PARTIALLY_OPENED;
- OPENED.

If PARTIALLY_OPENED or OPENED:
- the new detector version is a searched/tuned variant;
- it must be counted in the experiment family;
- it cannot inherit the untouched-final-holdout privilege of the old version;
- final holdout may not be re-used as if unseen.

## Historical replay acceptance

A versioned historical replay is accepted only when:
- exact source/session commitments are unchanged or explicitly versioned;
- every old receipt remains queryable;
- new receipt is append-only;
- migration classification is outcome-blind;
- prefix invariance holds under the new version;
- future suffix cannot alter earlier snapshot;
- no old failure/no-structure/data-blocked row is deleted;
- split/merge mappings preserve all predecessor IDs;
- detector version is included in the search registry.

## Exact-equivalence shortcut

A new version may share the same experiment identity only when:
- canonical feature payload is identical for the complete preregistered fixture/replay set;
- clocks are identical;
- source identities are identical;
- denominator states are identical;
- only formatting/performance/schema wrapper changed.

Otherwise:
NEW_RESEARCH_VERSION = TRUE.

## Future-bar adversarial requirement

For each detector version:
- run true historical prefix at t;
- run full future history queried with asOf=t;
- canonical R7 observation at t must match.

Required equality includes:
- featureState;
- requiredSourceBarIds;
- firstObservableAt;
- confirmedAt where relevant;
- informationRoot;
- redundancyGroup;
- feature values;
- episode identity;
- lifecycle state.

A later failure, confirmation, pivot, reclaim or label must not rewrite the prior snapshot.

## Negative-case retention

Version migration must preserve:
- NO_STRUCTURE;
- DATA_BLOCKED;
- FAILED;
- EXPIRED;
- INVALIDATED;
- UNRESOLVED;
- post-hoc/not-eligible cases.

A new version cannot be judged only on episodes that survive both versions.

## SDA-002 research-side readback

Already frozen across D01:
- label-independent geometry;
- firstObservableAt / confirmedAt;
- future-bar guards;
- failure lifecycle;
- immutable structural lineage;
- R7 outcome firewall;
- parameter-search accounting;
- cross-version immutable receipts;
- prefix invariance requirement.

Remaining before SDA-002 can close:
- physical replay-safe R7 receipts on genuine historical/forward data;
- System1/System2 executable future-pivot / immutable-episode enforcement;
- D16 validation;
- independent 00 audit closure.

Therefore:
SDA_002_RESEARCH_SEMANTICS = MATURE.
SDA_002_STATUS = REMEDIATION_IN_PROGRESS.

## Current decision

VERSION_LEDGER_APPEND_ONLY = TRUE.
POST_HOC_VERSION_SWAP = PROHIBITED.
OPENED_OUTCOME_VERSION_REUSES_FINAL_HOLDOUT = FALSE.
EXACT_EQUIVALENCE_REQUIRES_PAYLOAD_AND_CLOCK_EQUALITY = TRUE.
NEGATIVE_CASES_RETAINED = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
