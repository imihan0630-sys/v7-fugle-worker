# D01 DL-103 — Detector-Version Representation Invariance Firewall V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / DETECTOR_VERSION_INVARIANCE_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent a later detector implementation from silently rewriting historical D01 pattern evidence, while also allowing legitimate bug fixes and new representations to be studied.

This tranche separates three clocks that are often confused:
1. marketFirstObservableAt — when the market inputs needed by a representation existed;
2. detectorSpecFrozenAt — when the research definition/version was frozen;
3. outcomeUnblindedAt — when the relevant future-outcome family became available to the researcher.

A detector created after the historical market date may still be evaluated on older data if:
- it uses only prefix-safe historical inputs;
- its specification was frozen before the relevant outcome family was opened for that experiment;
- the historical replay does not pretend the detector existed live at that old date;
- version choice is not selected from future performance.

Therefore:
DETECTOR_CREATED_AFTER_MARKET_DATE != LOOKAHEAD by itself.
OUTCOME_SELECTED_DETECTOR_VERSION = PROHIBITED.

## Version identity

Every detector version must preserve:
- detectorFamilyId;
- detectorVersion;
- specificationHash;
- codeHash or immutable implementation reference;
- detectorSpecFrozenAt;
- experimentFamilyId;
- parameterFamilyId;
- source semantic contract version;
- compatible R7 schema version.

## Historical replay clock rule

For each historical R7 candidate:
- marketFirstObservableAt <= predictorFreezeAt;
- all source bars / context receipts must satisfy their own PIT clocks;
- detectorSpecFrozenAt must be <= experimentOutcomeUnlockAt;
- outcomeUnblindedAt must be null/closed during feature construction.

The historical market date does not need to be >= detectorSpecFrozenAt.

Do not write detectorSpecFrozenAt back into marketFirstObservableAt.
They answer different questions.

## Cross-version comparison classes

EXACT_REPLAY_EQUIVALENT
- same exact source/window identity;
- same causal clocks;
- same feature state;
- same canonical payload hash.

SAME_CAUSAL_EPISODE_REPRESENTATION_DRIFT
- same causal episode/root/anchors;
- version produces a changed representation/value;
- no future data introduced.

EXPECTED_SPEC_CHANGE
- preregistered specification change intentionally changes detector behavior.

CLOCK_DRIFT
- later version moves firstObservableAt/confirmedAt in a way not justified by source availability.

PROVENANCE_DRIFT
- later version consumes different sourceHistoryHash / exactSessionHash / semantic space.

EPISODE_IDENTITY_DRIFT
- later version assigns a different root/episode without a causal lineage explanation.

DATA_BLOCKED
- comparison lacks exact source/version provenance.

No class implies alpha.

## Immutable old evidence

Old R7 receipts are append-only historical artifacts.

A later detector version may:
- emit a new receipt;
- mark old/new relation in a migration ledger;
- explain bug fix / spec change.

It may not:
- mutate the old receipt;
- replace its feature hash;
- backdate new firstObservableAt into the old receipt;
- delete failed/no-structure states;
- make the old detector appear to have produced the new result.

## Bug-fix rule

Implementation bug fixes are not automatically free.

If a bug fix changes any historical emitted state:
- record old and new detector versions;
- preserve both outputs;
- classify the change;
- treat the corrected version as a new research version for outcome accounting unless the change is proven implementation-equivalent.

If the bug fix only changes formatting and canonical feature payload remains identical:
EXACT_REPLAY_EQUIVALENT may be used.

## Multiple-testing implication

If researchers inspect outcomes from multiple detector versions and then retain the best one, all inspected versions belong to the same search family.

D16 must account for detector-version search in the experiment registry.

## SDA-002 relevance

This contract directly blocks:
- future-pivot relabeling through detector upgrades;
- post-hoc version swaps;
- historical receipt rewriting;
- hidden clock changes.

It does not close SDA-002 by itself; System guards, physical replay receipts, D16 validation and 00 closure remain required.

## Current decision

OLD_R7_RECEIPTS_MUTABLE = FALSE.
HISTORICAL_REPLAY_WITH_NEWER_FROZEN_DETECTOR = ALLOWED_WITH_DISCIPLINE.
OUTCOME_SELECTED_DETECTOR_VERSION = PROHIBITED.
DETECTOR_VERSION_SEARCH_COUNTS_AS_MULTIPLE_TESTING = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
