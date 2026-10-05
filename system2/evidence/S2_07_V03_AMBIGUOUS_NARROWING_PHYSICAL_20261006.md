# S2-07 V0.3 Ambiguous-Event Narrowing Physical Receipt

Date: 2026-10-06 Asia/Taipei
Lane: BUILD_LANE
Status: RESEARCH_ONLY / DIAGNOSTIC
System 1 Formal Core: LOCKED

## Execution
- commit: `8252a0b8417cf63fd317bb645c3f835a55d7e976`
- workflow: `System2 Bounded Revision Event Linkage V0.3 Readonly`
- run: `37328246286`
- job: `111824389195`
- result: PASS

## Physical summary
- 17 ambiguous events re-probed
- 10 exact per-symbol query-integrity reconciliations
- 7 query-integrity mismatches
- 0 event-specific anchors under the effective-date-in-subject experiment

Exact reconciliations: 6176, 1563, 3356, 1441, 6550, 6129, 3710, 8277, 4806, 3086.

Mismatch set:
- 3591: all 40, months 30, onlyAll 10
- 6949: all 72, months 73, onlyMonth 1
- 5381: all 58, months 60, onlyMonth 2
- 6241: all 57, months 60, onlyMonth 3
- 8937: all 49, months 50, onlyMonth 1
- 5904: all 44, months 45, onlyMonth 1
- 4747: all 42, months 43, onlyMonth 1

## Semantic boundary
This does not establish revision completeness, NO_EVENT, exact knownAt, cancellation completeness, technical continuity, session completeness, or trading authority. Normalized subject stem is not a sufficient episode identity. Zero title-level effective-date anchors means that strategy is inadequate as a promotion gate and must be replaced by richer event-specific disambiguation.
