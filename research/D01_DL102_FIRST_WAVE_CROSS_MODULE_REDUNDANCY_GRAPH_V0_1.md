# D01 DL-102 — First-Wave Cross-Module Redundancy Graph V0.1

Updated: 2026-10-07 Asia/Taipei
Status: OUTCOME_BLIND / REDUNDANCY_GRAPH_FROZEN / FORMAL_CORE_LOCKED

## Purpose
Prevent D01-02, D01-03, D01-07 and D01-09 from becoming four votes when they are different descriptions of the same price path.

Each R7 node preserves moduleId, opportunityId, informationRoot, redundancyGroup, ordered sourceBarIds, baseEpisodeId or gapRootId when applicable, predictorFreezeAt, exactSessionHash and sourceHistoryHash.

Edge classes:
- EXACT_REPRESENTATION_DUPLICATE: same root and same ordered source bars.
- NESTED_SHARED_ROOT: one source-bar set is contained in another under the same root.
- OVERLAPPING_SHARED_ROOT: source bars overlap but neither set fully contains the other.
- SAME_EPISODE_DIFFERENT_LABEL: same baseEpisodeId or gapRootId under different labels.
- SHARED_MECHANICAL_CONTEXT: the same legal/event context conditions multiple representations; context is not a second alpha vote.
- DISTINCT_ROOT_CANDIDATE: no shared root/episode/source-bar overlap is proven; independence still requires D16 evidence.

Example: one gap-up breakout day can simultaneously be a strong single candle, the final bar of a named sequence, the breakout day of a base, and a gap pattern. These are not automatically four independent reasons to buy.

The graph preserves labels for explanation rather than deleting them, while preventing score/sample-size multiplication.

D02 volume, D04 volatility, D05 market microstructure and D16 statistics remain separate owners; D01 only stores references to those contexts.

FOUR_FIRST_WAVE_MODULES_EQUAL_FOUR_VOTES = FALSE.
REDUNDANCY_GRAPH_REQUIRED = TRUE.
LABELS_PRESERVED_FOR_EXPLANATION = TRUE.
INDEPENDENCE_REQUIRES_D16_EVIDENCE = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
