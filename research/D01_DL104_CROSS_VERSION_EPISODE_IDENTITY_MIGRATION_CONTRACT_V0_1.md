# D01 DL-104 — Cross-Version Episode Identity Migration Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / EPISODE_MIGRATION_CONTRACT_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Freeze how D01 compares the same historical source window across detector versions without pretending every changed output is either the same episode or a brand-new independent pattern.

Episode identity is causal lineage, not label similarity and not price proximity.

## Canonical episode identity inputs

For any structural episode compare:
- symbol;
- semantic space;
- exactSessionHash;
- sourceHistoryHash;
- informationRoot;
- root anchor IDs;
- root anchor occurrence times;
- boundaryId/version where relevant;
- baseEpisodeId / gapRootId / sequence sourceBarIds where relevant;
- firstObservableAt;
- confirmedAt where applicable;
- predictorFreezeAt;
- detectorFamilyId;
- detectorVersion.

## Identity precedence

Use identity evidence in this order:

1. Exact immutable root / episode ID lineage.
2. Exact anchor/source-bar identity.
3. Boundary/version lineage.
4. Causal lifecycle relation.
5. Spatial overlap only as description.

Spatial proximity alone never proves same episode.

## Migration classes

UNCHANGED_EPISODE
- same causal identity;
- same clocks;
- same feature state;
- canonical feature payload equivalent.

SAME_EPISODE_REPRESENTATION_CHANGED
- same causal root/episode;
- new detector changes a representation/descriptor;
- no causal clock or provenance drift.

EPISODE_SPLIT
- one old episode maps to multiple causally distinct new episodes.
- requires explicit new episode IDs and anchor lineage.

EPISODE_MERGE
- multiple old episodes map to one new episode.
- requires explicit merge rationale.
- old episodes remain immutable in their original version.

NEW_EPISODE_IN_NEW_VERSION
- no valid causal predecessor exists.

DROPPED_EPISODE_IN_NEW_VERSION
- old episode exists but new version no longer emits it.

CLOCK_DRIFT
- same claimed episode but observable/confirmation clocks change without source/lifecycle justification.

PROVENANCE_DRIFT
- same claimed episode but source/session/history identity changed.

IDENTITY_UNRESOLVED
- causal lineage is insufficient to declare same/split/merge/new.

## Split/merge firewall

A detector version may refine structural topology and legitimately split or merge episodes.

But:
- split children do not inherit old outcome history as though they were always separate;
- merged episode does not erase old constituents;
- split/merge is a versioned representation change;
- each changed mapping belongs to the detector-version search family if outcomes are later compared.

## Clock preservation

For SAME_EPISODE_REPRESENTATION_CHANGED:
- new firstObservableAt may be later if the new specification explicitly requires additional causal evidence;
- it may not become earlier by using future-confirmed anchors unavailable at the earlier time;
- any earlier-clock claim must be justified by data already present in the historical prefix and by the frozen specification.

If the earlier-clock claim depends on a later pivot or suffix:
CLOCK_DRIFT / POST_HOC_NOT_ELIGIBLE.

## Episode fingerprint

The migration ledger stores a version-specific episode fingerprint from:
- detector family/version;
- semantic space;
- exact source/window commitments;
- immutable anchor IDs;
- episode/root identity;
- causal clocks;
- boundary/version identity;
- feature state.

A fingerprint is version-specific.
Matching symbol/date/label is insufficient.

## Outcome independence

Migration class is determined without forward returns.

Do not choose:
- split vs same episode;
- merge vs same episode;
- dropped vs invalid;

based on which mapping produces better later performance.

## Current decision

LABEL_SIMILARITY_EQUALS_EPISODE_IDENTITY = FALSE.
PRICE_OVERLAP_EQUALS_EPISODE_IDENTITY = FALSE.
SPLIT_MERGE_REWRITES_HISTORY = FALSE.
OLD_EPISODES_REMAIN_IMMUTABLE = TRUE.
MIGRATION_CLASSIFICATION_IS_OUTCOME_BLIND = TRUE.
Formal Core remains LOCKED.
