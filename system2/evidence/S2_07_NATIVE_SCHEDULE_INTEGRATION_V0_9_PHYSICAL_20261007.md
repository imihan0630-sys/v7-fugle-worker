# S2-07 Native Schedule Integration V0.9 — Physical Evidence

Observed: 2026-10-07 Asia/Taipei  
Scope: BUILD_LANE / research-only / read-only  
Formal Core: LOCKED  
Trading authority: NONE

## Authoritative execution

- implementation merge: `44212a6f3d8556d2ffc98a0f85b7d0e97b65f269` (PR #713)
- workflow: `System2 S2-07 Native Schedule Integration V0.9 Readonly`
- main push run: `37492646263`
- job: `112369057180`
- conclusion: PASS
- System2 Research CI: `37492646329` PASS
- V8 Regression: `37492646417` PASS

## Physical summary

- interval: 2026-04-05 .. 2026-10-02
- official trading dates: 125
- eventCount: 17
- promotionReadyCount: 7
- nativeScheduleCertifiedCount: 10
- boundedNativeSymbolSessionEvidenceReadyCount: 4
- blockedCount: 13
- EVENT_LINKAGE_PROMOTION_NOT_READY: 10
- NATIVE_SCHEDULE_DETAIL_NOT_SELF_DESCRIBING: 7
- noSuspensionCertifiedCount: 0

## Positive bounded cases

| Symbol | Family | Stop trading | Resume / effective | Source semantics | Source row hash |
| --- | --- | --- | --- | --- | --- |
| 5381 | CAPITAL_REDUCTION | 2026-04-01 | 2026-04-13 | TPEX_DETAIL_EXPLICIT_LABELS | 64798988766503e2b106f061686e66eae753a41823317555df019e4982dfe8ca |
| 6241 | CAPITAL_REDUCTION | 2026-08-18 | 2026-08-25 | TPEX_DETAIL_EXPLICIT_LABELS | 08d90d92eacbbb4cb5048b9b9508ba5fa17ee0c1dc3babb0d3cd5b06990c8b22 |
| 4806 | CAPITAL_REDUCTION | 2026-09-23 | 2026-10-02 | TPEX_DETAIL_EXPLICIT_LABELS | 518fcdf6b0f3d5dc8ffaafba59556c86da3cda76dd0e46c528217740c33ae92b |
| 3086 | PAR_VALUE_CHANGE | 2026-04-09 | 2026-04-20 | TPEX_DETAIL_EXPLICIT_LABELS | a835513cec338fabdf0c95bc82dd816b8f8203675aee587a31911245c04540e2 |

All four:
- have V0.7 bounded promotion evidence;
- have explicit TPEx `停止買賣日期` / `恢復買賣日期` source-native labels;
- have source event-version and row-hash provenance;
- resume on an official market session;
- satisfy `BOUNDED_NATIVE_SYMBOL_SESSION_EVIDENCE_READY`.

## Fail-closed cases

The seven TWSE corporate-action reference rows remain blocked under:
`NATIVE_SCHEDULE_DETAIL_NOT_SELF_DESCRIBING`.

Their compact detail strings are preserved but are not interpreted as suspension-start semantics.

The six additional TPEx events with source-native schedules remain blocked because their V0.7 event-linkage promotion evidence is not ready.

## Authority boundary

Still false:
- noSuspensionMayBeClaimed
- suspensionCoverageComplete
- symbolSessionCompletenessCertified
- rawA1LineageBound
- technicalContinuityCertified
- continuityTransformPerformed
- selectionAuthority
- finalSelectionEnabled
- livePushEnabled
- capitalImpact
- orderImpact
- system1RuntimeUsed

## Next gate

RAW A1 lineage may now be investigated only for the four positive bounded cases above.  
V0.9 does not itself mutate price history or certify technical continuity.
