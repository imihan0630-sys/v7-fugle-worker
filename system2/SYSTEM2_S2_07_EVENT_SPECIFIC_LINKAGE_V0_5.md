# System 2 S2-07 Event-Specific Linkage V0.5

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / BUILD_LANE DIAGNOSTIC
System 1 Formal Core: LOCKED

## Purpose

Continue from V0.4 without treating whole-company material-information mismatch as corporate-action incompleteness.

V0.5:
1. reconciles company-year vs month-shard history only after issuer-scope + target action-family filtering;
2. preserves target-family discrepancies separately, including a distinct periodic-notice-only divergence diagnostic;
3. uses official exchange subtype/detail plus issuer chronology to construct event-specific anchor candidates;
4. searches for positive correction/cancellation evidence inside the semantic episode candidate only.

## Capital-reduction episode disambiguation

Where the official source gives a subtype:
- 退還股款 -> RETURN_CAPITAL;
- 彌補虧損 -> LOSS_OFFSET.

The issuer chronology is seeded from a subtype-aligned disclosure, preferring the matching corporate-decision row. Rows from older episodes, subsidiaries, treasury-stock reductions, restricted-stock reductions and bond-conversion notices are not allowed to create the event-specific candidate for a different episode.

## Par-value events

Par-value events remain action-family scoped. Repeated notice rows are retained as evidence. A year/month mismatch consisting only of recurring announcement-period copies is labeled diagnostically but is not silently discarded or promoted to complete.

## Promotion boundary

eventSpecificAnchorCandidate=true is diagnostic only. It is not promotion-grade linkage.

V0.5 never claims:
- revision completeness;
- NO_EVENT;
- no-cancellation from absence;
- exact knownAt;
- technical continuity;
- session completeness;
- trading authority.

Normalized subject stem is not a sufficient episode key.


## Physical execution freeze — run 37331662930


## 2026-10-05 S2-07 event-specific linkage V0.5 physical result

Authoritative physical execution:
- merge commit: `50aac2717c47f6e1bc6fd29d29dd867267d09887`;
- workflow: `System2 S2-07 Event-Specific Linkage V0.5 Readonly`;
- run: `37331662930`;
- job: `111836005547`;
- conclusion: PASS.

Regression evidence around the same BUILD_LANE sequence:
- V8 Regression Tests run `37331377958`: PASS;
- V0.4 diagnostic rerun `37331377874`: PASS.

Physical summary:
- eventCount = 17;
- actionFamilyQueryIntegrityExactCount = 13;
- periodicNoticeOnlyDivergenceCount = 3;
- eventSpecificAnchorCandidateCount = 13;
- correctionObservedCount = 5;
- cancellationObservedCount = 0;
- promotionLinkageEstablishedCount = 0.

The four remaining action-family query-integrity divergences are all PAR_VALUE_CHANGE events: 6949 / 2026-09-07, 8937 / 2026-04-13, 5904 / 2026-08-10, and 4747 / 2026-08-31.

The 13 exact events have issuer + target-action-family keyset reconciliation and diagnostic event-specific anchors based on official event identity/detail plus issuer chronology. These remain bounded research candidates, not promotion-grade linkage and not trading authority.

Positive correction evidence is observed for five events: 3356, 3591, 1441, 6241, 4806. No cancellation disclosure was observed inside the V0.5 semantic episode candidates, but absence is not negative proof: `cancellationHistoryComplete=false` and no-cancellation may not be claimed.

All completeness / exact-clock / technical-continuity / trading-authority flags remain false.

Next exact BUILD_LANE continuation:
1. resolve the four PAR_VALUE_CHANGE source-divergence semantics at row/provenance level;
2. formalize cancellation state as positive-observed vs not-certified, never NO_CANCELLATION by absence;
3. determine which bounded event-specific candidates meet promotion evidence requirements without subject-stem dependence;
4. then continue shared suspension/resumption + symbol-session integration;
5. then RAW A1 lineage.
