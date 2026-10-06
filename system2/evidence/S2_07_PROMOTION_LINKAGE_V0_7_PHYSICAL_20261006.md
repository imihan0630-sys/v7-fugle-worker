# S2-07 Promotion Linkage V0.7 Physical Receipt

Date: 2026-10-06 Asia/Taipei
Lane: BUILD_LANE
Status: RESEARCH_ONLY / PHYSICALLY EXECUTED
System 1 Formal Core: LOCKED
Trading authority: NONE

## Execution

- Initial implementation merge: `ede2b4428e100c1dbb8adbd47341643e721f67bb` (PR #697)
- Initial V0.7 readonly run: `37481111846` = FAIL because the PAR_VALUE_CHANGE unit fixture omitted required chronology / aligned-episode fields while expecting promotion=true.
- Fixture/chronology repair merge: `84c0bc0c66a68eb3f01b5f2fddd3e658dd3cf81a` (PR #698)
- Authoritative readonly workflow: `System2 S2-07 Promotion Linkage V0.7 Readonly`
- Authoritative run: `37481645101`
- Job: `112330996478`
- Conclusion: PASS
- V8 Regression on initial implementation push: `37481111827` = PASS.

The failed initial fixture did not prove a runtime/policy defect. The evaluator failed closed correctly. The repair completed the synthetic PAR_VALUE_CHANGE fixture and tightened the aligned chronology gate.

## Physical summary

- eventCount = 17
- promotionEvidenceReadyCount = 7
- promotionEvidenceBlockedCount = 10
- promotionLinkageEstablishedCount = 7
- cancellationObservedCount = 0
- noCancellationCertifiedCount = 0
- eventLinkageCoverageComplete = false
- boundedRevisionHistoryCoverageComplete = false
- correctionHistoryComplete = false
- cancellationHistoryComplete = false
- knownAtVersionClockCertified = false
- revisionCoverageComplete = false
- technicalContinuityCertified = false
- tradingAuthority = false

Blocker decomposition:
- TRANSPORT_NOT_READY = 8
- PAGINATION_NOT_CERTIFIED = 8
- SOURCE_QUERY_INTEGRITY_NOT_EXACT = 6
- EVENT_SPECIFIC_ANCHOR_NOT_ESTABLISHED = 6
- SEMANTIC_EPISODE_NOT_CERTIFIED = 2

## Promotion-evidence-ready bounded events

These seven events satisfy only the V0.7 bounded event-linkage evidence contract:

- 1563 / 2026-09-07 / CAPITAL_REDUCTION
- 1441 / 2026-09-29 / CAPITAL_REDUCTION
- 6550 / 2026-09-29 / CAPITAL_REDUCTION
- 5381 / 2026-04-13 / CAPITAL_REDUCTION
- 6241 / 2026-08-25 / CAPITAL_REDUCTION
- 4806 / 2026-10-02 / CAPITAL_REDUCTION
- 3086 / 2026-04-20 / PAR_VALUE_CHANGE

`promotionLinkageEstablished=true` here means only that official event identity + issuer/action-family query integrity + dated detail chronology + semantic episode/correction containment satisfy the bounded V0.7 contract.

It does NOT mean:
- complete revision/cancellation history;
- exact knownAt;
- technical continuity;
- session continuity;
- strategy readiness;
- candidate authority;
- live trading authority.

## Blocked events

- 6176 / 2026-08-24 / CAPITAL_REDUCTION
- 3356 / 2026-09-21 / CAPITAL_REDUCTION
- 3591 / 2026-09-21 / CAPITAL_REDUCTION
- 6949 / 2026-09-07 / PAR_VALUE_CHANGE
- 6129 / 2026-09-14 / CAPITAL_REDUCTION
- 3710 / 2026-09-21 / CAPITAL_REDUCTION
- 8277 / 2026-09-21 / CAPITAL_REDUCTION
- 8937 / 2026-04-13 / PAR_VALUE_CHANGE
- 5904 / 2026-08-10 / PAR_VALUE_CHANGE
- 4747 / 2026-08-31 / PAR_VALUE_CHANGE

The four V0.6 PAR_VALUE_CHANGE divergence cases remain blocked as intended unless independently source-certified.

## Cancellation boundary

No cancellation disclosure was observed in the bounded candidate episodes, but absence is still history-incomplete:

`CANCELLATION_DISCLOSURE_NOT_OBSERVED_HISTORY_INCOMPLETE`

No row may be upgraded to NO_CANCELLATION from absence.

## Next BUILD_LANE continuation

1. integrate shared suspension/resumption evidence with symbol-session continuity;
2. keep event-linkage evidence grade separate from technical/session continuity;
3. require explicit source/session provenance before any continuity promotion;
4. then continue RAW A1 lineage;
5. keep all strategy/final-selection/push/order/System1 boundaries locked.
