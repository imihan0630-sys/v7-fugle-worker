# D01 DL-110 — Source-Vintage Migration Ledger and Holdout Contamination Firewall V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / SOURCE_VINTAGE_LEDGER_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Freeze how D01 records source-data revisions after historical pattern receipts already exist, especially when outcomes or final holdout may already have been inspected.

The objective is to prevent:
- silent historical restatement;
- silent holdout reuse;
- corrected data being mistaken for the original predictor information set;
- later archive improvements making earlier research look cleaner than it actually was.

## Ledger identity

Every source-vintage migration row binds:
- witnessRequestId;
- experimentFamilyId;
- moduleId;
- market;
- symbol;
- target/predictor date;
- oldSourceVintageId;
- newSourceVintageId;
- oldSourceHistoryHash;
- newSourceHistoryHash;
- oldCorporateActionRegistryVersion;
- newCorporateActionRegistryVersion;
- oldContinuityReceiptId;
- newContinuityReceiptId;
- oldR7ReceiptId;
- newR7ReceiptId if replayed;
- migrationClass;
- causalRevisionClass;
- originalPredictorCutoff;
- newEvidenceObservedAt;
- firstKnownAt;
- outcomeAccessStateAtDiscovery;
- finalHoldoutStateAtDiscovery;
- searchRegistryEntryId;
- auditReason.

## Outcome-access states

CLOSED
DEVELOPMENT_OUTCOMES_OPEN
FINAL_HOLDOUT_OPEN
PROSPECTIVE_OUTCOMES_OPEN

## Final-holdout states

UNTOUCHED
CONSUMED
NOT_APPLICABLE

If final holdout has ever been opened for the affected experiment family:
it remains CONSUMED.

A source correction does not reset it to UNTOUCHED.

## Migration classes

EXACT_EQUIVALENT_REOBSERVATION
- exact source-history/R7 identity unchanged.

SEMANTICALLY_EQUIVALENT_SOURCE_REFRESH
- new capture/parse is semantically equivalent;
- historical receipt remains old-vintage immutable;
- no new alpha experiment is created if complete equivalence is demonstrated.

PIPELINE_ERROR_CORRECTED_REPLAY
- preexisting public information was omitted/misparsed;
- corrected replay required;
- original clean-evidence claim is invalidated for that affected window.

LATE_CORRECTION_CURRENT_TRUTH_ONLY
- correction became knowable after predictor cutoff;
- original PIT predictor remains unchanged.

LATE_CANCELLATION_CURRENT_TRUTH_ONLY
- cancellation/supersession became knowable later;
- original PIT predictor remains unchanged.

PROVENANCE_ONLY_CONFIDENCE_UPGRADE
- completeness/authority proof improves without changing predictor semantic set;
- may upgrade data-quality documentation but cannot mutate old R7.

UNKNOWN_BLOCKED
- knowledge-time or revision lineage unresolved.

## Replay and experiment-accounting rules

### Exact-equivalent refresh

May retain the same experiment hypothesis identity only if all are unchanged:
- normalized semantic rows/events;
- PIT clocks;
- exactSessionHash;
- sourceHistoryHash;
- canonical R7 payload;
- denominator state;
- parent/child support.

### Corrected replay after pipeline error

If outcomes are CLOSED:
- corrected replay may replace the not-yet-evaluated dataset version for the experiment;
- old receipt remains archived;
- migration is recorded;
- no outcome has been used to choose the correction.

If development outcomes are already OPEN:
- corrected version is a new analysis version;
- both versions enter search/multiplicity history;
- old development evidence is not erased.

If final holdout is OPEN/CONSUMED:
- corrected replay is diagnostic/sensitivity evidence;
- final holdout stays consumed;
- confirmatory promotion needs a fresh untouched/prospective source unless a preregistered error-correction policy already governed this case.

### Late correction

A late official correction may improve current truth but cannot alter the predictor information set.

Do not create an artificial historical alpha result using the later corrected fact as though traders knew it then.

## Denominator integrity under revision

Source revision may not silently delete:
- NO_STRUCTURE;
- DATA_BLOCKED;
- failed/expired/invalidated episodes;
- opportunities affected by pipeline error.

Instead classify each affected row:
UNCHANGED
REPLAY_CHANGED
NO_LONGER_EVALUABLE
NEWLY_EVALUABLE_DUE_TO_PIPELINE_REPAIR

NEWLY_EVALUABLE rows cannot be inserted into an already-open confirmatory holdout without contamination accounting.

## Parent/child support under source revision

If a source revision changes support for either named child or common parent:
- re-pair both on the same revised support;
- do not compare revised child against old parent;
- do not preserve only favorable rows.

If the revised support differs materially:
the comparison is a new analysis version.

## Audit outputs

Each migration must expose:
- affectedOpportunityCount;
- unchangedCount;
- changedCount;
- newlyEvaluableCount;
- noLongerEvaluableCount;
- old/new denominator hashes;
- old/new sourceHistoryHash;
- finalHoldoutConsumed flag;
- cleanConfirmatoryClaimStillEligible flag.

## Current decision

SOURCE_REVISION_RESETS_HOLDOUT = FALSE.
OLD_RECEIPTS_REMAIN_IMMUTABLE = TRUE.
PIPELINE_REPAIR_REQUIRES_VERSIONED_REPLAY = TRUE.
LATE_CORRECTION_REWRITES_PIT = FALSE.
DENOMINATOR_CHANGES_MUST_BE_VISIBLE = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.

## Exact next continuation

1. Build deterministic source-vintage/revision oracle and adversarial tests.
2. Explicitly test preexisting-public backfill versus late correction.
3. Test final-holdout non-reset.
4. Test old/new parent-child support consistency under corrected replay.
5. Update checkpoint without raising D01 maturity.
