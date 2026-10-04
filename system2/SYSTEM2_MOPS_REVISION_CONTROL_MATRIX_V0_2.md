# System 2 MOPS Revision Control Matrix V0.2

Status: RESEARCH_ONLY / READ_ONLY_MULTI_CONTROL_PROBE
Updated: 2026-10-04 Asia/Taipei
System 1 Formal Core: LOCKED

## Purpose

Extend the physically accepted MOPS original/correction capability beyond one dividend example.

The matrix tests whether the same official MOPS historical material-information transport can preserve:
- original + correction for multiple companies;
- multiple corporate-action families;
- an explicit cancellation/revocation row.

It is a capability matrix, **not** a completeness certificate.

## Frozen controls

1. 2467 志聖 / 2026-05 / dividend ex-date notice:
   - original + correction.
2. 1459 聯發 / 2026-06 / cash capital-reduction exchange schedule:
   - original + correction.
3. 2321 東訊 / 2026-03 / capital-reduction decision:
   - original + correction, month-wide because original/correction may be on adjacent dates.
4. 1342 八貫 / 2026-06 / cash capital-increase subscription record date:
   - original + correction.
5. 1342 八貫 / 2026-07 / cash capital-increase cancellation:
   - explicit 撤銷 row.

These controls were chosen before the physical probe from already public MOPS-derived evidence.

## Acceptance semantics

Correction control PASS requires:
- MOPS history response readable;
- >=2 matching subject-family rows;
- >=1 original row;
- >=1 correction/cancellation-hint row;
- >=2 distinct date/time/sequence version keys.

Cancellation control PASS requires:
- >=1 matching subject row;
- correction/cancellation hint;
- row text contains 撤銷 or 取消.

All control results remain read-only.

## Authority firewall

Even if all controls pass:

- boundedIntervalCoverageComplete=false;
- actionFamilyCoverageComplete=false;
- cancellationHistoryComplete=false;
- knownAtVersionClockCertified=false;
- revisionCoverageComplete=false;
- noEventMayBeClaimed=false;
- symbolSessionCompletenessCertified=false;
- technicalContinuityCertified=false;
- historyMutationPerformed=false;
- strategyEvaluationPerformed=false;
- selectionAuthority=false;
- finalSelectionEnabled=false;
- livePushEnabled=false;
- capitalImpact=false;
- orderImpact=false;
- system1RuntimeUsed=false.

## Why this matters for D03

D03-09 ADX and D03-10 Bollinger are blocked because shared TECHNICAL_CONTINUITY lacks promotion-grade revision/cancellation completeness.

If this matrix passes, the blocker narrows:
- not "MOPS cannot show revisions/cancellations";
- instead "MOPS capability exists across multiple action families, but bounded source completeness and knownAt/cross-exchange coverage remain unproven."

That is meaningful blocker reduction but is **not** sufficient for D03 L3 promotion.

## Next gate if physical matrix passes

1. Freeze a bounded company-month completeness protocol.
2. Prove page/query truncation semantics and missing-date behavior.
3. Compare all returned company-month rows with a frozen action-family classifier; preserve OTHER/UNKNOWN.
4. Add official exchange-document cancellation/revocation lane.
5. Validate source-reported date/time as historical knownAt rather than merely display time.
6. Only then may System 2 attempt to feed the supplemental revision-history contract.
7. D03 re-reviews Bollinger first; ADX additionally requires canonical recursive replay.

Formal Core remains LOCKED.
